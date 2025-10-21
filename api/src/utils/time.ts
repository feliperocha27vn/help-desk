export function parseHHmmToMinutes(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export function minutesToHHmm(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  const hh = String(h).padStart(2, '0')
  const mm = String(m).padStart(2, '0')
  return `${hh}:${mm}`
}

export function generateSlotsFromWindows(
  windows: Array<{ start: number; end: number }>,
  slotDurationMinutes: number
) {
  const slots: string[] = []

  for (const w of windows) {
    let cursor = w.start
    while (cursor + slotDurationMinutes <= w.end) {
      slots.push(minutesToHHmm(cursor))
      cursor += slotDurationMinutes
    }
  }

  // remove duplicates and sort
  return Array.from(new Set(slots)).sort()
}

export function buildWorkWindows(
  startHHmm: string,
  endHHmm: string,
  breakStartHHmm?: string | null,
  breakEndHHmm?: string | null
) {
  const start = parseHHmmToMinutes(startHHmm)
  const end = parseHHmmToMinutes(endHHmm)

  if (start >= end) {
    throw new Error('start must be < end')
  }

  if (!breakStartHHmm || !breakEndHHmm) {
    return [{ start, end }]
  }

  const breakStart = parseHHmmToMinutes(breakStartHHmm)
  const breakEnd = parseHHmmToMinutes(breakEndHHmm)

  if (breakStart >= breakEnd) {
    throw new Error('breakStart must be < breakEnd')
  }

  // if break is outside window, ignore it
  if (breakEnd <= start || breakStart >= end) {
    return [{ start, end }]
  }

  const windows: Array<{ start: number; end: number }> = []

  if (breakStart > start)
    windows.push({ start, end: Math.min(breakStart, end) })
  if (breakEnd < end) windows.push({ start: Math.max(breakEnd, start), end })

  return windows
}
