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