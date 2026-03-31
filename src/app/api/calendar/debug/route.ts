import { NextResponse } from 'next/server'
import { icalFeeds } from '@/lib/ical-config'
import { parseICal } from '@/lib/ical-parser'

export async function GET() {
  const today = new Date().toISOString().split('T')[0]
  const result: Record<string, unknown> = {}

  for (const [slug, feedUrls] of Object.entries(icalFeeds)) {
    const seen = new Set<string>()
    const reservations = []

    for (const feedUrl of feedUrls) {
      try {
        const res = await fetch(feedUrl, { cache: 'no-store' })
        const text = await res.text()
        const events = parseICal(text)
        for (const e of events) {
          if (!e.isReserved || e.endDate < today) continue
          const key = `${e.startDate}|${e.endDate}`
          if (!seen.has(key)) {
            seen.add(key)
            reservations.push({ in: e.startDate, out: e.endDate, guest: e.summary })
          }
        }
      } catch (err) {
        reservations.push({ error: String(err) })
      }
    }

    reservations.sort((a, b) => ('in' in a && 'in' in b && a.in && b.in) ? a.in.localeCompare(b.in) : 0)
    result[slug] = { total: reservations.length, reservations }
  }

  return NextResponse.json(result)
}
