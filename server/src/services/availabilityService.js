import { DateTime } from "luxon";
import Appointment from "../models/Appointment";

const TZ  = 'Europe/Sofia';
const SLOT_STEP_MIN = 30;
const DEFAULT_DURATION_MIN = 60;
const MIN_START_SPACING_MIN = 120;

function dayIntervalsLocal(dateISO) {
    const date = DateTime.fromISO(dateISO, { zone: TZ })

    if (date.weekday >= 6) return [];

    const start = date.set({ hour: 9, minute: 0, second: 0, millisecond: 0 });
    const end = date.set({ hour: 17, minute: 0, second: 0, millisecond: 0 });

    return [{ start, end }]
}

function overlaps(startA, endA, startB, endB) {
    return startA < endB && endA > startB;
}

function respectsStartSpacing(slotStartUTC, existingStartUTC, spacingMin) {
    return existingStartUTC.every(s => Math.abs(slotStartUTC.diff(s, "minutes").minutes) >= spacingMin);
}

export default {
    async getSlotsForDate({ dateISO, durationMin = DEFAULT_DURATION_MIN}) {
        const intervals = dayIntervalsLocal(dateISO)
        if (!intervals.length) return [];

        const dayStartUTC = DateTime.fromISO(dateISO, { zone: TZ }).startOf('day').toUTC();
        const dayEndUTC = dayStartUTC.endOf('day');

        const appointments = await Appointment.find({
            status: { $nin: ['CANCELLED'] },
            startsAt: { $gte: dayStartUTC.toJSDate(), $lt: dayEndUTC.toJSDate() },
        }).select('startsAt durationMin status').lean();

        const appointmentIntervalsUTC = appointments.map(a => {
            const start = DateTime.fromJSDate(a.startsAt);
            const dur   = Number(a.durationMin) > 0 ? Number(a.durationMin) : DEFAULT_DURATION_MIN;
            const end   = start.plus({ minutes: dur });
            return { start, end };
        });
        const appointmentStartsUTC = appointmentIntervalsUTC.map(x => x.start);

        const slots = [];

        for (const {start, end} of intervals) {
            for (let slotStart = start; slotStart.plus({ minutes: durationMin }) <= end; slotStart = slotStart.plus({ minutes: SLOT_STEP_MIN })) {
                const startUTC = slotStart.toUTC();
                const endUTC = slotStart.plus({ minutes: durationMin }).toUTC();

                const conflict = appointmentIntervalsUTC.some(({ start, end }) => overlaps(startUTC, endUTC, start, end));
                if (conflict) continue;

                if (!respectsStartSpacing(startUTC, appointmentStartsUTC, MIN_START_SPACING_MIN)) continue;

                slots.push(startUTC.toISO())
            }
        }
        return slots;
    },
    async getCalendarForMonth({ month, durationMin = DEFAULT_DURATION_MIN}) {
        const start = DateTime.fromISO(`${month}-01`, { zone: TZ }).startOf('month');

        const end = start.endOf('month');

        const days = [];

        for (let cur = start; cur < end; cur = cur.plus({ days: 1 })) {
            const dateISO = cur.toISODate();

            const slots = await getSlotsForDate({ dateISO, durationMin });
            
            days.push({ date: dateISO, hasSlots: slots.length > 0, count: slots.length })
        }

        return { days };
    }
}