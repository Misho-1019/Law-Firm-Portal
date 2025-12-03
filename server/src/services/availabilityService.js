// services/availabilityService.js
import { DateTime, Interval } from "luxon";
import Appointment from "../models/Appointment.js";
import WorkingSchedule from "../models/WorkingSchedule.js";
import TimeOff from "../models/TimeOff.js";
import { toSofiaISO, SOFIA_TZ } from "../lib/time.js";

const TZ = "Europe/Sofia";
const SLOT_STEP_MIN = 30;
const DEFAULT_DURATION_MIN = 120;
const MIN_START_SPACING_MIN = 120;
const WORK_START = '09:00';
const WORK_END = '17:00';

/**
 * Build an Interval [fromHHMM, toHHMM] for a given ISO date (local TZ).
 */
function hhmmIntervalOn(dateISO, fromHHMM, toHHMM) {
  const base = DateTime.fromISO(dateISO, { zone: TZ });

  const start = base.set({
    hour: +fromHHMM.slice(0, 2),
    minute: +fromHHMM.slice(3, 5),
    second: 0,
    millisecond: 0,
  });

  const end = base.set({
    hour: +toHHMM.slice(0, 2),
    minute: +toHHMM.slice(3, 5),
    second: 0,
    millisecond: 0,
  });

  return Interval.fromDateTimes(start, end);
}

/**
 * Intervals for a given day based on configured WorkingSchedule.
 * `weekday` convention in your schedule: 0 = Sunday, 1–6 = Monday–Saturday
 */
function intervalsForDay(dateISO, schedule) {
  const date = DateTime.fromISO(dateISO, { zone: TZ });

  const weekday = date.weekday === 7 ? 0 : date.weekday; // luxon: Monday=1..Sunday=7
  const day = schedule?.days?.find((x) => x.weekday === weekday);

  if (!day || !day.intervals?.length) return [];

  return day.intervals
    .map(({ from, to }) => hhmmIntervalOn(dateISO, from, to))
    .filter((i) => i.isValid && i.length("minutes") > 0);
}

/**
 * Default intervals if no WorkingSchedule is configured.
 * - Only weekdays
 * - 09:00–17:00 local time
 */
function defaultIntervals(dateISO) {
  const date = DateTime.fromISO(dateISO, { zone: TZ });

  // 6 = Saturday, 7 = Sunday in luxon
  if (date.weekday >= 6) return [];

  return [hhmmIntervalOn(dateISO, "09:00", "17:00")];
}

/**
 * Basic overlap helper between two intervals [startA, endA) and [startB, endB)
 */
function overlaps(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}

/**
 * Ensure new slot respects spacing from existing appointment start times.
 */
function respectsStartSpacing(slotStartUTC, existingStartUTC, spacingMin) {
  return existingStartUTC.every(
    (s) => Math.abs(slotStartUTC.diff(s, "minutes").minutes) >= spacingMin
  );
}

function clampToWorkingWindow(fromStr, toStr) {
  let from = fromStr || WORK_START;
  let to = toStr || WORK_END;

  if (from < WORK_START) from = WORK_START;
  if (to > WORK_END) to = WORK_END;

  if (from >= to) return null;
  return { from, to }
}

function isoDateFromJS(d) {
  return d.toISOString().slice(0, 10);
}

/**
 * Get allowed working intervals for a date:
 * - If WorkingSchedule configured for that weekday → use it.
 * - Otherwise fallback to default 09:00–17:00 (weekdays only).
 */
async function getAllowedIntervals(dateISO) {
  const schedule = await WorkingSchedule.findOne().lean();

  let allowed = intervalsForDay(dateISO, schedule);

  if (!allowed.length) {
    allowed = defaultIntervals(dateISO);
  }

  return allowed;
}

/**
 * Get all appointments for a day as intervals.
 */
async function getDayAppointments(dateISO) {
  const dayStartLocal = DateTime.fromISO(dateISO, { zone: TZ }).startOf("day");
  const dayStartUTC = dayStartLocal.toUTC();
  const dayEndUTC = dayStartLocal.endOf("day").toUTC();

  // Widen start a bit to catch long appointments
  const widenStart = dayStartUTC.minus({ hours: 4 });

  const docs = await Appointment.find({
    status: { $nin: ["CANCELLED"] },
    startsAt: {
      $gte: widenStart.toJSDate(),
      $lt: dayEndUTC.toJSDate(),
    },
  })
    .select("startsAt durationMin")
    .lean();

  const items = docs.map((a) => {
    const start = DateTime.fromJSDate(a.startsAt); // usually UTC in DB
    const dur =
      Number(a.durationMin) > 0 ? Number(a.durationMin) : DEFAULT_DURATION_MIN;
    const end = start.plus({ minutes: dur });

    return { start, end };
  });

  return {
    intervalsUTC: items,
    startsUTC: items.map((x) => x.start),
  };
}

/**
 * Get time-off intervals for a specific local date.
 * Supports:
 * - full-day (no from/to)
 * - optional partial day (from/to in HH:MM)
 */
async function getTimeOffIntervalsForDate(dateISO) {
  const docs = await TimeOff.find({
    dateFrom: { $lte: dateISO },
    dateTo: { $gte: dateISO },
  }).lean();

  const date = DateTime.fromISO(dateISO, { zone: TZ });

  const intervals = docs
    .map((doc) => {
      if (doc.from && doc.to) {
        const interval = hhmmIntervalOn(dateISO, doc.from, doc.to);
        return interval.isValid ? interval : null;
      } else {
        // Full-day block: treat as entire local day
        const start = date.startOf("day");
        const end = date.endOf("day");
        const interval = Interval.fromDateTimes(start, end);
        return interval.isValid ? interval : null;
      }
    })
    .filter(Boolean);

  // Return plain { start, end } pairs
  return intervals.map((i) => ({ start: i.start, end: i.end }));
}

/**
 * Return bookable slot starts (as UTC ISO strings) for a given local date.
 */
export async function getBookableSlotsForDate({
  dateISO,
  durationMin = DEFAULT_DURATION_MIN,
}) {
  const allowed = await getAllowedIntervals(dateISO);

  if (!allowed.length) return [];

  const {
    intervalsUTC: appointmentIntervalsUTC,
    startsUTC: appointmentStartsUTC,
  } = await getDayAppointments(dateISO);

  const timeOffIntervals = await getTimeOffIntervalsForDate(dateISO);

  const slots = [];

  for (const interval of allowed) {
    // iterate at SLOT_STEP_MIN inside allowed interval in local TZ
    for (
      let time = interval.start;
      time.plus({ minutes: durationMin }) <= interval.end;
      time = time.plus({ minutes: SLOT_STEP_MIN })
    ) {
      const startUTC = time.toUTC();
      const endUTC = time.plus({ minutes: durationMin }).toUTC();

      // 1) Conflict with appointments?
      const conflictAppointment = appointmentIntervalsUTC.some(
        ({ start, end }) => overlaps(startUTC, endUTC, start, end)
      );
      if (conflictAppointment) continue;

      // 2) Conflict with time off?
      const conflictTimeOff = timeOffIntervals.some(({ start, end }) =>
        overlaps(startUTC, endUTC, start, end)
      );
      if (conflictTimeOff) continue;

      // 3) Respect min spacing between appointment starts
      if (
        !respectsStartSpacing(
          startUTC,
          appointmentStartsUTC,
          MIN_START_SPACING_MIN
        )
      )
        continue;

      slots.push(startUTC.toISO());
    }
  }

  return slots;
}

/**
 * Calendar view for a whole month.
 * month = "YYYY-MM" (local TZ).
 * Returns: { days: [{ date, hasSlots, count }] }
 */
export async function getCalendarForMonth({
  month,
  durationMin = DEFAULT_DURATION_MIN,
}) {
  const start = DateTime.fromISO(`${month}-01`, { zone: TZ }).startOf("month");
  const end = start.endOf("month");

  const days = [];

  const timeOffList = await TimeOff.find({
    dateFrom: { $lte: end.toISODate() },
    dateTo: { $gte: start.toISODate() },
  }).lean();

  for (let cur = start; cur <= end; cur = cur.plus({ days: 1 })) {
    const dateISO = cur.toISODate();

    const matches = timeOffList.filter(
      (x) => x.dateFrom <= dateISO && x.dateTo >= dateISO
    )

    const hasTimeOff = matches.length > 0;
    const isFullDayOff = matches.some((x) => !x.from && !x.to)

    const slots = await getBookableSlotsForDate({ dateISO, durationMin });

    days.push({
      date: dateISO,
      hasSlots: slots.length > 0,
      count: slots.length,
      isTimeOff: hasTimeOff,
      isFullDayOff,
    });
  }

  return { days };
}

export async function update(data, id) {
  const updateData = {}

  if (data.dateFrom !== undefined) {
    updateData.dateFrom = data.dateFrom
  }

  if (data.dateTo !== undefined) {
    updateData.dateTo = data.dateTo
  }

  if (data.from !== undefined) {
    updateData.from = data.from
  }

  if (data.to !== undefined) {
    updateData.to = data.to
  }

  if (data.reason !== undefined) {
    updateData.reason = data.reason
  }

  const item = await TimeOff.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  })

  return item
}

export async function getCalendarWeek(fromStr, toStr) {
  if (!fromStr || !toStr) {
    const err = new Error(`from and to are required (YYYY-MM-DD)`);
    err.status = 400;
    throw err;
  }

  // 1) Load working schedule
  const scheduleDoc = await WorkingSchedule.findOne().lean();
  const tz = scheduleDoc?.tz || scheduleDoc?.tzone || SOFIA_TZ || "Europe/Sofia";
  const dayConfigs = Array.isArray(scheduleDoc?.days) ? scheduleDoc.days : [];

  // 2) Load time off blocks overlapping the range
  const timeOffList = await TimeOff.find({
    dateFrom: { $lte: toStr },
    dateTo: { $gte: fromStr },
  }).lean();

  // 3) Load appointments in that range (in UTC, then later filter per local date)
  const rangeStartLocal = DateTime.fromISO(fromStr, { zone: TZ }).startOf("day");
  const rangeEndLocal = DateTime.fromISO(toStr, { zone: TZ }).endOf("day");

  const rangeStartUtc = rangeStartLocal.toUTC().toJSDate();
  const rangeEndUtc = rangeEndLocal.toUTC().toJSDate();

  const appointments = await Appointment.find({
    status: { $nin: ["CANCELLED"] },
    startsAt: {
      $gte: rangeStartUtc,
      $lte: rangeEndUtc,
    },
  })
    .select("startsAt durationMin service firstName lastName")
    .lean();

  const days = [];
  const cursor = new Date(fromStr + "T00:00:00.000Z");
  const end = new Date(toStr + "T00:00:00.000Z");

  while (cursor <= end) {
    const dateIso = isoDateFromJS(cursor); // "YYYY-MM-DD"
    // weekday in your WorkingSchedule: 0=Sunday,1=Monday,... (you used getUTCDay())
    const weekday = cursor.getUTCDay();

    const items = [];

    // 4a) Working intervals from schedule
    const cfg = dayConfigs.find((x) => x.weekday === weekday);
    const intervals = cfg?.intervals || [];

    intervals.forEach((intv, idx) => {
      const clamped = clampToWorkingWindow(intv.from, intv.to);
      if (!clamped) return;

      items.push({
        id: `working_${dateIso}_${idx}`,
        type: "working",
        title: "Working hours",
        startTime: clamped.from, // "HH:MM"
        endTime: clamped.to,     // "HH:MM"
        note: null,
      });
    });

    // 4b) Time off blocks affecting this date
    timeOffList.forEach((off) => {
      if (dateIso < off.dateFrom || dateIso > off.dateTo) return;

      const isFullDay = !off.from && !off.to;
      const rawFrom = isFullDay ? WORK_START : off.from;
      const rawTo = isFullDay ? WORK_END : off.to;

      const clamped = clampToWorkingWindow(rawFrom, rawTo);
      if (!clamped) return;

      items.push({
        id: off._id.toString(),
        type: "timeoff",
        title: off.reason || "Time off",
        startTime: clamped.from,
        endTime: clamped.to,
        note: null,
      });
    });

    // 4c) Appointments on this date (Sofia local time)
    appointments.forEach((appt) => {
      // Convert startsAt (UTC in DB) to Sofia local
      const startLocal = DateTime.fromJSDate(appt.startsAt).setZone(TZ);

      const localDate = startLocal.toISODate(); // "YYYY-MM-DD"
      if (localDate !== dateIso) return;

      const dur =
        Number(appt.durationMin) > 0
          ? Number(appt.durationMin)
          : DEFAULT_DURATION_MIN;

      const endLocal = startLocal.plus({ minutes: dur });

      const timeFrom = startLocal.toFormat("HH:mm");
      const timeTo = endLocal.toFormat("HH:mm");

      const clamped = clampToWorkingWindow(timeFrom, timeTo);
      if (!clamped) return;

      const noteParts = [appt.firstName || "", appt.lastName || ""].filter(Boolean);
      const note = noteParts.join(" ") || null;

      items.push({
        id: appt._id.toString(),
        type: "appointment",
        title: appt.service || "Appointment",
        startTime: clamped.from,
        endTime: clamped.to,
        note,
      });
    });

    days.push({ date: dateIso, items });

    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return { tz, days };
}

export default {
  getBookableSlotsForDate,
  getCalendarForMonth,
  update,
  getCalendarWeek,
};
