// src/jobs/reminder.js
import dotenv from "dotenv";
dotenv.config();

import cron from "node-cron";
import Appointment from "../models/Appointment.js";
import { sendEmail } from "../lib/mailer.js";
import { toSofiaISO, SOFIA_TZ } from "../lib/time.js"; // 👈 use Sofia formatter + zone
import { getDateAndTime } from "../lib/dates.js";

const BATCH_LIMIT = Number(process.env.REMINDER_BATCH_LIMIT || 100);

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

  const adminEmail = process.env.ADMIN_EMAIL || null;
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

    console.log(`[reminders] ${kind} batch ${processed + 1}-${processed + due.length} due`);

    const results = await Promise.allSettled(
      due.map((appt) => sendOneReminder(appt, kind))
    );

    const failed = results.filter((r) => r.status === "rejected").length;
    if (failed) {
      console.error(`[reminders] ${kind} ${failed}/${due.length} failed in this batch`);
    }

    processed += due.length;
  }

  if (processed > 0) {
    console.log(`[reminders] ${kind} done — ${processed} total processed`);
  }
}

export async function runRemindersOnce() {
  if (process.env.REMINDERS_DISABLED === "1") {
    console.log("[reminders] disabled via env");
    return;
  }

  await flushWindow("24h");
  await flushWindow("1h");
}

export function startReminderCron() {
  if (process.env.REMINDERS_DISABLED === "1") {
    console.log("[reminders] disabled via env");
    return;
  }

  // 👇 anchor schedule to Sofia local time
  cron.schedule(
    "*/5 * * * *", // every 5 minutes ✅ (matches what you chose)
    async () => {
      try {
        await runRemindersOnce();
      } catch (e) {
        console.error("[reminders] tick error:", e);
      }
    },
    { timezone: SOFIA_TZ }
  );
  
  console.log(`[reminders] cron scheduled: every 5 minutes (zone: ${SOFIA_TZ})`);

}
