// Lightweight iCal parser — no external dependency needed
export type CalendarEvent = {
  summary: string
  startDate: string // YYYY-MM-DD
  endDate: string   // YYYY-MM-DD
  isReserved: boolean
  reservationId?: string
}

function parseICalDate(dateStr: string): string {
  // Format: 20260325 or 20260325T150000Z
  const clean = dateStr.replace(/[TZ:]/g, '').substring(0, 8)
  return `${clean.substring(0, 4)}-${clean.substring(4, 6)}-${clean.substring(6, 8)}`
}

export function parseICal(icalText: string): CalendarEvent[] {
  const events: CalendarEvent[] = []
  const blocks = icalText.split('BEGIN:VEVENT')

  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i].split('END:VEVENT')[0]

    const summaryMatch = block.match(/SUMMARY:(.+)/m)
    const startMatch = block.match(/DTSTART(?:;VALUE=DATE)?:(\S+)/m)
    const endMatch = block.match(/DTEND(?:;VALUE=DATE)?:(\S+)/m)
    const descMatch = block.match(/DESCRIPTION:(.+)/m)

    if (startMatch && endMatch) {
      const summary = summaryMatch?.[1]?.trim() || 'Blocked'
      const isReserved = summary.toLowerCase().includes('reserved')

      // Extract reservation ID from description URL
      let reservationId: string | undefined
      if (descMatch) {
        const idMatch = descMatch[1].match(/details\/(\w+)/)
        reservationId = idMatch?.[1]
      }

      events.push({
        summary,
        startDate: parseICalDate(startMatch[1]),
        endDate: parseICalDate(endMatch[1]),
        isReserved,
        reservationId,
      })
    }
  }

  return events.sort((a, b) => a.startDate.localeCompare(b.startDate))
}

// Get all blocked dates as an array of date strings
export function getBlockedDates(events: CalendarEvent[]): string[] {
  const blocked: string[] = []

  for (const event of events) {
    const start = new Date(event.startDate)
    const end = new Date(event.endDate)
    const current = new Date(start)

    while (current < end) {
      blocked.push(current.toISOString().split('T')[0])
      current.setDate(current.getDate() + 1)
    }
  }

  return [...new Set(blocked)].sort()
}
