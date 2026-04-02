// Lightweight iCal parser — no external dependency needed
export type CalendarEvent = {
  summary: string
  startDate: string // YYYY-MM-DD
  endDate: string   // YYYY-MM-DD
  isReserved: boolean
  reservationId?: string
  description?: string // Raw description from iCal
  guestCount?: number // Parsed from description if available
  guestName?: string // Parsed from description if available (fallback when summary is generic)
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
      const isReserved = summary.toLowerCase().includes('reserved') ||
        summary.toLowerCase().includes('not available') ||
        summary.toLowerCase().includes('airbnb')

      // Extract reservation ID, guest count, and guest name from description
      let reservationId: string | undefined
      let guestCount: number | undefined
      let guestName: string | undefined
      const description = descMatch?.[1]?.trim()

      if (description) {
        const idMatch = description.match(/details\/(\w+)/)
        reservationId = idMatch?.[1]

        // Try to extract guest count from description
        // Patterns: "2 guests", "2 guests", "2 huéspedes", "Grupo de 2"
        const guestMatch = description.match(/(\d+)\s+(?:guests?|huéspedes?|personas?|people)/i) ||
                          description.match(/grupo\s+de\s+(\d+)/i)
        if (guestMatch) {
          guestCount = parseInt(guestMatch[1])
        }

        // Try to extract guest name from description
        // Patterns: "Guest: John Smith", "Huésped: Maria", "huéspedes de Dario", "de Dario", "Guest name: Sarah"
        let nameMatch = description.match(/(?:guests?|hu[eé]spedes?|de)\s+([A-Za-zÁÉÍÓÚáéíóúñÑ]+(?:\s+[A-Za-zÁÉÍÓÚáéíóúñÑ]+)?)/i)
        if (nameMatch) {
          guestName = nameMatch[1].trim()
        }

        // Fallback: try "nombre:" or "name:" patterns
        if (!guestName) {
          nameMatch = description.match(/(?:nombre|name)\s*:\s*([A-Za-zÁÉÍÓÚáéíóúñÑ]+(?:\s+[A-Za-zÁÉÍÓÚáéíóúñÑ]+)?)/i)
          if (nameMatch) {
            guestName = nameMatch[1].trim()
          }
        }
      }

      events.push({
        summary,
        startDate: parseICalDate(startMatch[1]),
        endDate: parseICalDate(endMatch[1]),
        isReserved,
        reservationId,
        description,
        guestCount,
        guestName,
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
