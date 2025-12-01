const SOFIA_TZ = 'Europe/Sofia';

export function formatSofiaDate(iso) {
    if (!iso) return '_';

    const d = new Date(iso)

    return new Intl.DateTimeFormat('en-EN', {
        timeZone: SOFIA_TZ,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(d)
}

export function formatSofiaTime(iso) {
    if (!iso) return '_';

    const d = new Date(iso)

    return new Intl.DateTimeFormat('en-EN', {
        timeZone: SOFIA_TZ,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(d)
}

export function getDateAndTimeDefaults(startsAtIso) {
    const date = startsAtIso.slice(0, 10)
    const time = startsAtIso.slice(11, 16)

    return {
        date,
        time,
    }
}

export function getDateAndTime(startsAtIso) {
  const day = startsAtIso.slice(0, 3)
  const date = startsAtIso.slice(4, 10)
  const time = startsAtIso.slice(16, 21)

  return {
    day,
    date,
    time,
  }
}

export function prettyDate(iso) {
    if (!iso) return '_';

    const dateIso = iso.slice(0, 10)

    const [year, month, date] = dateIso.split('-')
    const jsDate = new Date(Number(year), Number(month) - 1, Number(date));

    return jsDate.toLocaleDateString(undefined, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })
}