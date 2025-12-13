import { DateTime } from "luxon";

export function toUTCISO(date, time, tz = 'Europe/Sofia') {
    const t = time.length === 5 ? `${time}:00` : time;

    return DateTime.fromISO(`${date}T${t}`, { zone: tz })
      .toUTC()
      .toISO({ suppressMilliseconds: true })
}

export function endTime(time, duration) {
  const [sh, sm] = time.split(':')

  const fullMin = sh * 60 + Number(sm) + duration;
  const hh = Math.trunc(fullMin / 60);
  const mm = fullMin % 60;

  if (mm === 0) {
    return `${hh}:${mm}0`;
  } else {
    return `${hh}:${mm}`
  }
}