// src/jobs/reminder.js
import dotenv from "dotenv";
dotenv.config();

import cron from "node-cron";
import Appointment from "../models/Appointment.js";
import { sendEmail } from "../lib/mailer.js";
import { toSofiaISO, SOFIA_TZ } from "../lib/time.js"; // 👈 use Sofia formatter + zone
import { getDateAndTime } from "../lib/dates.js";
import config from "../config.js";
import logger from "../utils/logger.js";

const BATCH_LIMIT = config.REMINDER_BATCH_LIMIT;

async function sendOneReminder(appt, kind) {
  const startsAtUtc = new Date(appt.startsAt);
  const localWhen = toSofiaISO(startsAtUtc);
  const { day, date, time } = getDateAndTime(localWhen);

  const clientEmail = appt.creator?.email || null;

  if (clientEmail) {
    const subjectClient =
      kind === "24h"
        ? `Reminder: your appointment is in 24 hours (Tomorrow, ${date} - ${time})`
        : `Reminder: your appointment is in 1 hour (Today at ${time})`;

    const html = `
      <p>Hi ${appt.creator?.username || "there"},</p>
      <p>This is a ${kind} reminder for your appointment.</p>
      <p><strong>When:</strong> ${`${day}, ${date} - ${time}`}</p>
      <p><strong>Mode:</strong> ${appt.mode}</p>
      <p><strong>Service:</strong> ${appt.service}</p>
    `;

    await sendEmail({ to: clientEmail, subject: subjectClient, html });
  }

  const adminEmail = config.ADMIN_EMAIL;
  if (adminEmail) {
    const subjectAdmin =
      kind === "24h"
        ? `Reminder sent (24h) -> ${appt.creator?.username || "Client"} @ ${date} ${time}`
        : `Reminder sent (1h) -> ${appt.creator?.username || "Client"} @ ${date} ${time}`;

    await sendEmail({
      to: adminEmail,
      subject: subjectAdmin,
      text: `Appointment ${kind} reminder sent to ${clientEmail || "unknown"} at ${day}, ${date} - ${time}`,
    });
  }

  const fieldSent = kind === "24h" ? "reminders.sent24hAt" : "reminders.sent1hAt";
  await Appointment.updateOne(
    { _id: appt._id, [fieldSent]: { $in: [null, undefined] } },
    { $set: { [fieldSent]: new Date() } }
  );
}

async function flushWindow(kind) {
  const fieldSend = kind === "24h" ? "reminders.send24hAt" : "reminders.send1hAt";
  const fieldSent = kind === "24h" ? "reminders.sent24hAt" : "reminders.sent1hAt";
  const now = new Date();

  let processed = 0;

  while (true) {
    const due = await Appointment.find({
      status: "CONFIRMED",
      [fieldSend]: { $lte: now },
      $or: [{ [fieldSent]: null }, { [fieldSent]: { $exists: false } }],
    })
      .sort({ [fieldSend]: 1 })
      .limit(BATCH_LIMIT)
      .populate("creator", "email username")
      .lean();

    if (!due.length) break;

    logger.info(`reminders ${kind} batch`, { from: processed + 1, to: processed + due.length });

    const results = await Promise.allSettled(
      due.map((appt) => sendOneReminder(appt, kind))
    );

    const failed = results.filter((r) => r.status === "rejected").length;
    if (failed) {
      logger.error(`reminders ${kind} failures`, { failed, total: due.length });
    }

    processed += due.length;
  }

  if (processed > 0) {
    logger.info(`reminders ${kind} done`, { processed });
  }
}

export async function runRemindersOnce() {
  if (config.REMINDERS_DISABLED) {
    logger.info("reminders disabled via env");
    return;
  }

  await flushWindow("24h");
  await flushWindow("1h");
}

export function startReminderCron() {
  if (config.REMINDERS_DISABLED) {
    logger.info("reminders disabled via env");
    return;
  }

  // 👇 anchor schedule to Sofia local time
  cron.schedule(
    "*/5 * * * *", // every 5 minutes ✅ (matches what you chose)
    async () => {
      try {
        await runRemindersOnce();
      } catch (e) {
        logger.error("reminders tick error", { message: e.message });
      }
    },
    { timezone: SOFIA_TZ }
  );
  
  logger.info("reminders cron scheduled", { zone: SOFIA_TZ, interval: "5min" });

}
