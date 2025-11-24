import { DateTime } from "luxon";

export function toUTCISO(date, time, tz = 'Europe/Sofia') {
    const t = time.length === 5 ? `${time}:00` : time;

    return DateTime.fromISO(`${date}T${t}`, { zone: tz })
      .toUTC()
      .toISO({ suppressMilliseconds: true })
}