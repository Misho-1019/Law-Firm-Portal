export function getDateAndTimeDefaults(startsAtIso) {
    const date = startsAtIso.slice(0, 10)
    const time = startsAtIso.slice(11, 16)

    return {
        date,
        time,
    }
}