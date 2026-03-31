import { NextResponse } from 'next/server'
import { icalFeeds } from '@/lib/ical-config'
import { parseICal } from '@/lib/ical-parser'

export async function GET() {
  const today = new Date().toISOString().split('T')[0]
  const result: Record<string, unknown> = {}

  for (const [slug, feedUrl] of Object.entries(icalFeeds)) {
    try {
      const res = await fetch(feedUrl, { cache: 'no-store' })
      const text = await res.text()
      const events = parseICal(text)
      const future = events
        .filter(e => e.isReserved && e.endDate >= today)
        .sort((a, b) => a.startDate.localeCompare(b.startDate))

      result[slug] = {
        total: future.length,
        reservations: future.map(e => ({
          in: e.startDate,
          out: e.endDate,
          guest: e.summary,
        })),
      }
    } catch (err) {
      result[slug] = { error: String(err) }
    }
  }

  return NextResponse.json(result)
}
