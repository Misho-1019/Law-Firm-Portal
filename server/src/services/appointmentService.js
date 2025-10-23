// services/appointmentService.js
import Appointment from "../models/Appointment.js";
import { leanSofiaTransform } from "../lib/leanSofia.js";
import {
  SOFIA_TZ,
  localIsoToUtcDate,
  buildSofiaReminders,
} from "../lib/time.js";

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
const hasExplicitTZ = (s) => typeof s === "string" && /[Zz]|[+\-]\d{2}:\d{2}$/.test(s);

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
    range.from = hasExplicitTZ(from) ? new Date(from) : localIsoToUtcDate(from, zone);
  }

  if (toLocal) {
    range.to = localIsoToUtcDate(toLocal, zone);
  } else if (to) {
    range.to = hasExplicitTZ(to) ? new Date(to) : localIsoToUtcDate(to, zone);
  }

  return range;
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
    const { from: fromUtc, to: toUtc } = normalizeRange({ from, to, fromLocal, toLocal, timezone });
    if (fromUtc || toUtc) {
      query.startsAt = {};
      if (fromUtc) query.startsAt.$gte = fromUtc;
      if (toUtc)   query.startsAt.$lte = toUtc;
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
    { status, from, to, fromLocal, toLocal, timezone, limit = 20, skip = 0, sort = "asc" } = {}
  ) {
    const query = { creator: userId };
    if (status) query.status = status;

    // Sofia-aware filters
    const { from: fromUtc, to: toUtc } = normalizeRange({ from, to, fromLocal, toLocal, timezone });
    if (fromUtc || toUtc) {
      query.startsAt = {};
      if (fromUtc) query.startsAt.$gte = fromUtc;
      if (toUtc)   query.startsAt.$lte = toUtc;
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
      const err = new Error("Provide startsAtLocal (+timezone) or startsAt (UTC).");
      err.status = 400;
      throw err;
    }

    const reminders = buildSofiaReminders(whenUtc);

    try {
      const result = await Appointment.create({
        ...appointmentData,
        startsAt: whenUtc,   // store UTC instant
        reminders,           // DST-safe, computed in Sofia zone
        creator: creatorId,
      });

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
      appointment.creator?.toString() === user || appointment.creator === user;
    const isAdmin = user.role === "Admin";

    if (!isOwner && !isAdmin) {
      const err = new Error("You are not authorized to update this appointment!");
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

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: "CANCELLED" },
      { new: true, runValidators: true }
    );

    return updatedAppointment;
  },

  async delete(appointmentId) {
    return await Appointment.findByIdAndDelete(appointmentId);
  },
};
