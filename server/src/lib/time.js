// src/lib/time.js
import { DateTime } from "luxon";

export const SOFIA_TZ = "Europe/Sofia";

/**
 * Convert a JS Date / ISO string (assumed UTC instant) to an ISO string
 * in Sofia local time (EET/EEST), with the correct +02:00/+03:00 offset.
 * Returns null/undefined as-is so it's safe to use on optional fields.
 */
export function toSofiaISO(value) {
  if (!value) return value;

  // Normalize to a JS Date first (handles Date or ISO string)
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return value; // leave as-is if invalid

  const dt = DateTime.fromJSDate(d, { zone: "utc" }).setZone(SOFIA_TZ);
  if (!dt.isValid) return value;

  return dt.toFormat("yyyy-MM-dd'T'HH:mm:ssZZ"); // e.g. "2025-11-05T11:40:00+02:00"
}

/**
 * Convert a Sofia-local wall time (e.g. "2025-11-05T11:40:00")
 * into the exact UTC instant (JS Date) to store in Mongo.
 */
export function localIsoToUtcDate(localISO, zone = SOFIA_TZ) {
  const dtLocal = DateTime.fromISO(localISO, { zone });
  if (!dtLocal.isValid) {
    const err = new Error(
      `Invalid local datetime for zone "${zone}": ${dtLocal.invalidReason || "invalid"}`
    );
    err.status = 400;
    throw err;
  }
  return dtLocal.toUTC().toJSDate();
}

/**
 * Build reminder times by subtracting in Sofia zone (DST-safe),
 * then return UTC JS Dates for storage.
 */
export function buildSofiaReminders(utcStartsAt) {
  const base = DateTime.fromJSDate(utcStartsAt, { zone: "utc" }).setZone(SOFIA_TZ);
  const send24hLocal = base.minus({ hours: 24 });
  const send1hLocal  = base.minus({ hours: 1 });
  return {
    send24hAt: send24hLocal.toUTC().toJSDate(),
    sent24hAt: null,
    send1hAt:  send1hLocal.toUTC().toJSDate(),
    sent1hAt:  null,
  };
}
