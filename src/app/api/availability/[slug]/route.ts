import { NextRequest, NextResponse } from 'next/server'
import { icalFeeds, type PropertySlug } from '@/lib/ical-config'
import { parseICal, getBlockedDates } from '@/lib/ical-parser'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const feedUrl = icalFeeds[slug as PropertySlug]
  if (!feedUrl) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 })
  }

  try {
    // Fetch all iCal feeds for this property and merge blocked dates
    const urls = Array.isArray(feedUrl) ? feedUrl : [feedUrl]
    let allEvents = []
    for (const url of urls) {
      const response = await fetch(url, { cache: 'no-store' })
      if (!response.ok) throw new Error(`iCal fetch failed: ${response.status}`)
      const icalText = await response.text()
      allEvents.push(...parseICal(icalText))
    }
    // Deduplicate events by startDate+endDate
    const seen = new Set<string>()
    const events = allEvents.filter(e => {
      const key = `${e.startDate}|${e.endDate}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    const blockedDates = getBlockedDates(events)

    return NextResponse.json({
      property: slug,
      blockedDates,
      reservations: events.filter((e) => e.isReserved).length,
      totalBlocked: blockedDates.length,
      lastSync: new Date().toISOString(),
    })
  } catch (error) {
    console.error(`iCal sync error for ${slug}:`, error)
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    )
  }
}
