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