import { DateTime } from "luxon";

export function getDateAndTimeDefaults(startsAtIso) {
    const dt = DateTime.fromISO(startsAtIso, { setZone: true })
    if (!dt.isValid) return { date: '_', time: '_' }
    return {
        date: dt.toISODate(),
        time: dt.toFormat("HH:mm"),
    }
}

export function getDateAndTime(startsAtIso) {
    const dt = DateTime.fromISO(startsAtIso, { setZone: true })
    if (!dt.isValid) return { day: '_', date: '_', time: '_' }
    return {
        day: dt.toFormat("EEE"),
        date: dt.toISODate(),
        time: dt.toFormat("HH:mm"),
    }
}