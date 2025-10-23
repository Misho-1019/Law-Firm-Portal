// services/appointmentService.js
import Appointment from "../models/Appointment.js";
import { leanSofiaTransform } from "../lib/leanSofia.js";
import {
  SOFIA_TZ,
  toSofiaISO,
  localIsoToUtcDate,
  buildSofiaReminders,
} from "../lib/time.js";
import { sendEmail } from "../lib/mailer.js";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || null;
const EMAILS_DISABLED = process.env.EMAILS_DISABLED === "1"; // optional toggle

const day_ms = 24 * 60 * 60 * 1000;

// Normalize incoming time to a UTC Date.
// Accept EITHER `startsAtLocal` (+ optional `timezone`) OR `startsAt` (UTC ISO with Z/offset).
function normalizeStartsAt(payload) {
  const zone = payload.timezone || SOFIA_TZ;

  if (payload.startsAtLocal) {
    // e.g. "2025-11-05T11:40:00" — Sofia wall time
    return localIsoToUtcDate(payload.startsAtLocal, zone);
  }

  if (payload.startsAt) {
    const d = new Date(payload.startsAt); // must include Z or explicit offset if using this
    if (Number.isNaN(d.getTime())) {
      const err = new Error(
        "startsAt must be a valid ISO (with 'Z'/offset), or provide startsAtLocal + timezone."
      );
      err.status = 400;
      throw err;
    }
    return d; // already an instant
  }

  return null; // not provided
}

// Detect if a string has an explicit timezone (Z or ±HH:MM)
const hasExplicitTZ = (s) =>
  typeof s === "string" && /[Zz]|[+\-]\d{2}:\d{2}$/.test(s);

// Normalize `from`/`to` range to UTC Date objects for querying.
// Supports:
//  - fromLocal/toLocal (preferred): treated as Sofia wall time
//  - from/to: if Z/offset present → use directly; otherwise treat as Sofia wall time
function normalizeRange({ from, to, fromLocal, toLocal, timezone }) {
  const zone = timezone || SOFIA_TZ;
  const range = {};

  if (fromLocal) {
    range.from = localIsoToUtcDate(fromLocal, zone);
  } else if (from) {
    range.from = hasExplicitTZ(from)
      ? new Date(from)
      : localIsoToUtcDate(from, zone);
  }

  if (toLocal) {
    range.to = localIsoToUtcDate(toLocal, zone);
  } else if (to) {
    range.to = hasExplicitTZ(to) ? new Date(to) : localIsoToUtcDate(to, zone);
  }

  return range;
}

function buildApptSummary(appt) {
  const when =
    typeof appt.startsAt === "string"
      ? appt.startsAt
      : toSofiaISO(appt.startsAt);
  const parts = [
    `<p><strong>When:</strong> ${when}</p>`,
    `<p><strong>Mode:</strong> ${appt.mode}</p>`,
    `<p><strong>Service:</strong> ${appt.service}</p>`,
    `<p><strong>Status:</strong> ${appt.status}</p>`,
  ];
  if (appt.notes) parts.push(`<p><strong>Notes:</strong> ${appt.notes}</p>`);
  return parts.join("\n");
}

async function emailCreated(apptDoc) {
  if (EMAILS_DISABLED) return;
  const appt = apptDoc.populate
    ? await apptDoc.populate("creator", "email username")
    : apptDoc;

  const clientEmail = appt.creator?.email || null;
  const clientName = appt.creator?.username || "there";
  const when = toSofiaISO(appt.startsAt);

  const subjectClient = `✅ Appointment created — ${when}`;
  const htmlClient = `<p>Hi ${clientName},</p><p>Your appointment was created successfully.</p>${buildApptSummary(
    appt
  )}`;

  const subjectAdmin = `📥 New appointment — ${clientName} @ ${when}`;
  const textAdmin = `New appointment for ${clientName}\nWhen: ${when}\nMode: ${appt.mode}\nService: ${appt.service}\nStatus: ${appt.status}`;

  const tasks = [];
  if (clientEmail)
    tasks.push(
      sendEmail({ to: clientEmail, subject: subjectClient, html: htmlClient })
    );
  if (ADMIN_EMAIL)
    tasks.push(
      sendEmail({ to: ADMIN_EMAIL, subject: subjectAdmin, text: textAdmin })
    );
  await Promise.allSettled(tasks);
}

async function emailUpdated(prev, next) {
  if (EMAILS_DISABLED) return;
  const appt = next.populate
    ? await next.populate("creator", "email username")
    : next;

  const clientEmail = appt.creator?.email || null;
  const clientName = appt.creator?.username || "there";

  const timeChanged =
    prev?.startsAt &&
    new Date(prev.startsAt).getTime() !== new Date(appt.startsAt).getTime();
  const statusChanged = prev?.status !== appt.status;
  const when = toSofiaISO(appt.startsAt);

  let subjectClient = `Appointment updated — ${when}`;
  if (statusChanged)
    subjectClient = `Status: ${prev?.status ?? "?"} → ${appt.status} — ${when}`;
  if (statusChanged && appt.status === "CONFIRMED")
    subjectClient = `✅ Appointment confirmed — ${when}`;
  if (statusChanged && appt.status === "CANCELLED")
    subjectClient = `❌ Appointment cancelled — ${when}`;
  if (timeChanged && !statusChanged)
    subjectClient = `🗓️ Time changed — ${when}`;

  const htmlClient = `<p>Hi ${clientName},</p><p>Your appointment was updated.</p>${buildApptSummary(
    appt
  )}`;

  const subjectAdmin = `✏️ Appointment updated — ${clientName} @ ${when}`;
  const textAdmin = `Updated appointment for ${clientName}\nWhen: ${when}\nMode: ${appt.mode}\nStatus: ${appt.status}`;

  const tasks = [];
  if (clientEmail)
    tasks.push(
      sendEmail({ to: clientEmail, subject: subjectClient, html: htmlClient })
    );
  if (ADMIN_EMAIL)
    tasks.push(
      sendEmail({ to: ADMIN_EMAIL, subject: subjectAdmin, text: textAdmin })
    );
  await Promise.allSettled(tasks);
}

export default {
  async getAll({
    status,
    from,
    to,
    fromLocal,
    toLocal,
    timezone,
    clientId,
    limit = 20,
    skip = 0,
    sort = "startsAt:asc",
  } = {}) {
    const query = {};

    if (status) query.status = status;
    if (clientId) query.creator = clientId;

    // Sofia-aware filters
    const { from: fromUtc, to: toUtc } = normalizeRange({
      from,
      to,
      fromLocal,
      toLocal,
      timezone,
    });
    if (fromUtc || toUtc) {
      query.startsAt = {};
      if (fromUtc) query.startsAt.$gte = fromUtc;
      if (toUtc) query.startsAt.$lte = toUtc;
    }

    let sortField = "startsAt";
    let sortDir = 1;
    if (typeof sort === "string") {
      const [field, dir] = sort.split(":");
      if (field === "startsAt" || field === "createdAt") sortField = field;
      if (dir === "desc") sortDir = -1;
    }
    const sortObj = { [sortField]: sortDir };

    const lim = Math.max(0, Number(limit) || 20);
    const skp = Math.max(0, Number(skip) || 0);

    let appointments = await Appointment.find(query)
      .sort(sortObj)
      .skip(skp)
      .limit(lim)
      .lean();

    appointments = appointments.map(leanSofiaTransform);

    const total = await Appointment.countDocuments(query);

    return { appointments, total, limit: lim, skip: skp };
  },

  async listMine(
    userId,
    {
      status,
      from,
      to,
      fromLocal,
      toLocal,
      timezone,
      limit = 20,
      skip = 0,
      sort = "asc",
    } = {}
  ) {
    const query = { creator: userId };
    if (status) query.status = status;

    // Sofia-aware filters
    const { from: fromUtc, to: toUtc } = normalizeRange({
      from,
      to,
      fromLocal,
      toLocal,
      timezone,
    });
    if (fromUtc || toUtc) {
      query.startsAt = {};
      if (fromUtc) query.startsAt.$gte = fromUtc;
      if (toUtc) query.startsAt.$lte = toUtc;
    }

    const sortObj = { startsAt: sort === "desc" ? -1 : 1 };
    const lim = Math.max(0, Number(limit) || 20);
    const skp = Math.max(0, Number(skip) || 0);

    let appointments = await Appointment.find(query)
      .sort(sortObj)
      .skip(skp)
      .limit(lim)
      .lean();

    appointments = appointments.map(leanSofiaTransform);

    const total = await Appointment.countDocuments(query);

    return { appointments, total, limit: lim, skip: skp };
  },

  getOne(appointmentId) {
    // Returns a Mongoose doc; model's toJSON transform will format dates to Sofia on res.json()
    return Appointment.findById(appointmentId);
  },

  // Made async so errors from create are caught correctly
  async create(appointmentData, creatorId) {
    // Normalize input time and compute Sofia-based reminders
    const whenUtc = normalizeStartsAt(appointmentData);
    if (!whenUtc) {
      const err = new Error(
        "Provide startsAtLocal (+timezone) or startsAt (UTC)."
      );
      err.status = 400;
      throw err;
    }

    const reminders = buildSofiaReminders(whenUtc);

    try {
      const result = await Appointment.create({
        ...appointmentData,
        startsAt: whenUtc, // store UTC instant
        reminders, // DST-safe, computed in Sofia zone
        creator: creatorId,
      });

      emailCreated(result).catch((e) =>
        console.error("[email] create failed:", e?.message || e)
      );

      return result;
    } catch (error) {
      if (error && error.code === 11000) {
        const err = new Error("Time slot is no longer available!");
        err.status = 409;
        throw err;
      }
      throw error;
    }
  },

  async update(appointmentData, appointmentId) {
    const update = {};

    if (typeof appointmentData.notes === "string") {
      update.notes = appointmentData.notes.trim();
    }

    if (Object.prototype.hasOwnProperty.call(appointmentData, "status")) {
      // Controller must ensure only admins can change status
      update.status = appointmentData.status;
    }

    // Allow either startsAtLocal(+timezone) or startsAt
    const whenUtc = normalizeStartsAt(appointmentData);
    if (whenUtc) {
      update.startsAt = whenUtc;
      update.reminders = buildSofiaReminders(whenUtc); // recompute on reschedule
    }

    try {
      const doc = await Appointment.findByIdAndUpdate(appointmentId, update, {
        new: true,
        runValidators: true,
      });

      const prev = await Appointment.findById(appointmentId).lean(); // for email diff

      emailUpdated(prev, doc).catch((e) =>
        console.error("[email] update failed:", e?.message || e)
      );

      return doc;
    } catch (error) {
      if (error && error.code === 11000) {
        const err = new Error("Time slot is no longer available!");
        err.status = 409;
        throw err;
      }
      throw error;
    }
  },

  async updateStatus(appointmentId, user) {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      const err = new Error("Appointment not found!");
      err.status = 404;
      throw err;
    }

    const isOwner =
      appointment.creator?.toString() === user.id ||
      appointment.creator === user.id;
    const isAdmin = user.role === "Admin";

    if (!isOwner) {
      const err = new Error(
        "You are not authorized to update this appointment!"
      );
      err.status = 403;
      throw err;
    }

    if (!isAdmin) {
      const msUntilAppointment = appointment.startsAt.getTime() - Date.now();
      if (msUntilAppointment < day_ms) {
        const err = new Error(
          "Too late to cancel: less than 24 hours before the appointment."
        );
        err.status = 422;
        throw err;
      }
    }

    try {
      const updatedAppointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        { status: "CANCELLED" },
        { new: true, runValidators: true }
      );

      const prev = appointment.toObject();
      emailUpdated(prev, updatedAppointment).catch((e) =>
        console.error("[email] status update failed:", e?.message || e)
      );

      return updatedAppointment;
    } catch (error) {
      if (error && error.code === 11000) {
        const err = new Error("Time slot is no longer available!");
        err.status = 409;
        throw err;
      }
      throw error;
    }

  },

  async delete(appointmentId) {
    return await Appointment.findByIdAndDelete(appointmentId);
  },
};
