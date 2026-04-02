import { NextResponse } from 'next/server'
import { icalFeeds } from '@/lib/ical-config'
import { parseICal } from '@/lib/ical-parser'
import { buildGuestMap } from '@/lib/gmail-reader'
import { properties } from '@/lib/properties'

// Debug endpoint to diagnose turnaround events and guest data issues
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const targetDate = searchParams.get('date') // e.g., 2026-04-03
  const propertySlug = searchParams.get('property') || 'chalten-loft-cerro-torre'

  try {
    // Fetch Gmail guest data
    const guestMap = await buildGuestMap()

    // Fetch iCal reservations for the property
    const feedUrls = icalFeeds[propertySlug as keyof typeof icalFeeds] || []
    const allReservations = []

    for (const feedUrl of feedUrls) {
      try {
        const response = await fetch(feedUrl, { cache: 'no-store' })
        if (!response.ok) continue
        const icalText = await response.text()
        const events = parseICal(icalText)
        allReservations.push(...events)
      } catch {
        // Skip feed errors
      }
    }

    // Sort by date
    allReservations.sort((a, b) => a.startDate.localeCompare(b.startDate))

    // Find reservations around the target date
    const today = new Date().toISOString().split('T')[0]
    const targetDateStr = targetDate || today
    const beforeDate = new Date(targetDateStr)
    beforeDate.setDate(beforeDate.getDate() - 1)
    const before = beforeDate.toISOString().split('T')[0]

    const afterDate = new Date(targetDateStr)
    afterDate.setDate(afterDate.getDate() + 3)
    const after = afterDate.toISOString().split('T')[0]

    const nearbyReservations = allReservations.filter(
      r => r.startDate >= before && r.startDate <= after
    )

    // For each nearby reservation, check if we have Gmail data
    const analysis = nearbyReservations.map(res => {
      const propertySlugForRes = propertySlug
      const gmailKey = `${propertySlugForRes}|${res.startDate}|${res.endDate}`
      const gmailData = guestMap.get(gmailKey)

      // Try fuzzy match
      let fuzzyMatch = undefined
      if (!gmailData) {
        for (const [key, data] of guestMap) {
          if (!key.startsWith(propertySlugForRes + '|')) continue
          const diffIn = Math.abs(new Date(data.checkIn).getTime() - new Date(res.startDate).getTime()) / 86400000
          const diffOut = Math.abs(new Date(data.checkOut).getTime() - new Date(res.endDate).getTime()) / 86400000
          if (diffIn <= 2 && diffOut <= 2) {
            fuzzyMatch = data
            break
          }
        }
      }

      return {
        iCalName: res.summary,
        startDate: res.startDate,
        endDate: res.endDate,
        gmailExactMatch: gmailData ? { name: gmailData.guestName, guests: gmailData.guests } : null,
        gmailFuzzyMatch: fuzzyMatch ? { name: fuzzyMatch.guestName, guests: fuzzyMatch.guests, offset: { in: 0, out: 0 } } : null,
        status: gmailData ? 'exact' : fuzzyMatch ? 'fuzzy' : 'NOT_FOUND',
      }
    })

    // Also show what's in the guest map for this property
    const gmailForProperty = Array.from(guestMap.entries())
      .filter(([key]) => key.startsWith(propertySlug + '|'))
      .map(([key, data]) => ({
        key,
        guestName: data.guestName,
        guests: data.guests,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
      }))

    return NextResponse.json({
      property: propertySlug,
      targetDate: targetDateStr,
      analysis,
      gmailDataForProperty: gmailForProperty,
      totalGmailEntries: guestMap.size,
      iCalReservationsAnalyzed: nearbyReservations.length,
    })
  } catch (err) {
    return NextResponse.json({
      error: String(err),
      message: err instanceof Error ? err.message : 'Unknown error',
    }, { status: 500 })
  }
}
