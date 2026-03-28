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
    // Fetch iCal feed from Airbnb
    const response = await fetch(feedUrl, {
      next: { revalidate: 600 }, // Cache for 10 minutes
    })

    if (!response.ok) {
      throw new Error(`iCal fetch failed: ${response.status}`)
    }

    const icalText = await response.text()
    const events = parseICal(icalText)
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
