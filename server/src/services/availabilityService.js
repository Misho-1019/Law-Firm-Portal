import { DateTime, Interval } from "luxon";
import Appointment from "../models/Appointment.js";
import WorkingSchedule from "../models/WorkingSchedule.js";
import TimeOff from "../models/TimeOff.js";

const TZ  = 'Europe/Sofia';
const SLOT_STEP_MIN = 30;
const DEFAULT_DURATION_MIN = 120;
const MIN_START_SPACING_MIN = 120;

function hhmmIntervalOn(dateISO, fromHHMM, toHHMM) {
    const base = DateTime.fromISO(dateISO, { zone: TZ })
    const start = base.set({ hour: +fromHHMM.slice(0,2), minute: +fromHHMM.slice(3,5), second: 0, millisecond: 0 })
    const end = base.set({ hour: +toHHMM.slice(0,2), minute: +toHHMM.slice(3,5), second: 0, millisecond: 0 })
    
    return Interval.fromDateTimes(start, end)
}

function IntervalsForDay(dateISO, schedule) {
    const date = DateTime.fromISO(dateISO, { zone: TZ })

    const weekday = date.weekday === 7 ? 0 : date.weekday;
    const day = schedule?.days?.find(x => x.weekday === weekday);

    if (!day || !day.intervals?.length) return [];

    return day.intervals
        .map(({ from, to }) => hhmmIntervalOn(dateISO, from, to))
        .filter(i => i.isValid && i.length('minutes') > 0)
    
}

function defaultIntervals(dateISO) {
    const date = DateTime.fromISO(dateISO, { zone: TZ })

    if (date.weekday >= 6) return [];

    return [hhmmIntervalOn(dateISO, '09:00', '17:00')];
}

function overlaps(startA, endA, startB, endB) {
    return startA < endB && endA > startB;
}

function respectsStartSpacing(slotStartUTC, existingStartUTC, spacingMin) {
    return existingStartUTC.every(s => Math.abs(slotStartUTC.diff(s, "minutes").minutes) >= spacingMin);
}

async function getAllowedIntervals(dateISO) {
    const schedule = await WorkingSchedule.findOne().lean()

    let allowed = IntervalsForDay(dateISO, schedule)

    if (!allowed.length) {
        allowed = defaultIntervals(dateISO)
    }
    return allowed;
}

async function isTimeOff(dateISO) {
    const timeOff = await TimeOff.findOne({
        dateFrom: { $lte: dateISO },
        dateTo: { $gte: dateISO },
    }).lean()

    return !!timeOff;
}

async function getDayAppointments(dateISO) {
    const dayStartUTC = DateTime.fromISO(dateISO, { zone: TZ }).startOf('day').toUTC();
    const dayEndUTC = dayStartUTC.endOf('day')

    const widenStart = dayStartUTC.minus({ hours: 4 });

    const docs = await Appointment.find({
        status: { $nin: ['CANCELLED'] },
        startsAt: { $gte: widenStart.toJSDate(), $lt: dayEndUTC.toJSDate() },
    }).select('startsAt durationMin').lean();

    const items = docs.map(a => {
        const start = DateTime.fromJSDate(a.startsAt);
        const dur = Number(a.durationMin) > 0 ? Number(a.durationMin) : DEFAULT_DURATION_MIN;
        const end = start.plus({ minutes: dur });
        
        return { start, end }
    })

    return {
        intervalsUTC: items,
        startsUTC: items.map(x => x.start),
    }
}


export async function getBookableSlotsForDate({ dateISO, durationMin = DEFAULT_DURATION_MIN}) {
        if (await isTimeOff(dateISO)) return [];

        const allowed = await getAllowedIntervals(dateISO);

        if (!allowed.length) return [];

        const { intervalsUTC: appointmentIntervalsUTC, startsUTC: appointmentStartsUTC } = await getDayAppointments(dateISO);

        const slots = [];

        for (const interval of allowed) {
            for (let time = interval.start; time.plus({ minutes: durationMin }) <= interval.end; time = time.plus({ minutes: SLOT_STEP_MIN })) {
                const startUTC = time.toUTC();
                const endUTC = time.plus({ minutes: durationMin }).toUTC();
                
                const conflict = appointmentIntervalsUTC.some(({ start, end }) => overlaps(startUTC, endUTC, start, end));

                if (conflict) continue;
                
                if (!respectsStartSpacing(startUTC, appointmentStartsUTC, MIN_START_SPACING_MIN)) continue;

                slots.push(startUTC.toISO());
            }
        }
        return slots;
}

export async function getCalendarForMonth({ month, durationMin = DEFAULT_DURATION_MIN}) {
        const start = DateTime.fromISO(`${month}-01`, { zone: TZ }).startOf('month');

        const end = start.endOf('month');

        const days = [];

        const schedule = await WorkingSchedule.findOne().lean();
        const timeOffList = await TimeOff.find({
            dateFrom: { $lte: end.toISODate() },
            dateTo: { $gte: start.toISODate() },
        }).lean();

        const isOff = (dateISO) => timeOffList.some( x => x.dateFrom <= dateISO && x.dateTo >= dateISO);

        for (let cur = start; cur <= end; cur = cur.plus({ days: 1 })) {
            const dateISO = cur.toISODate();

            if (isOff(dateISO)) {
                days.push({ date: dateISO, hasSlots: false, count: 0 })
                continue;
            }

            let allowed = IntervalsForDay(dateISO, schedule)

            if (!allowed.length) {
                allowed = defaultIntervals(dateISO)
            }

            if (!allowed.length) {
                days.push({ date: dateISO, hasSlots: false, count: 0 })
                continue;
            }

            const slots = await getBookableSlotsForDate({ dateISO, durationMin });
            
            days.push({ date: dateISO, hasSlots: slots.length > 0, count: slots.length })
        }

        return { days };
}

export default { getBookableSlotsForDate, getCalendarForMonth }