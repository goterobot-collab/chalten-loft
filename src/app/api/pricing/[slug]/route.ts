import { NextRequest, NextResponse } from 'next/server'
import { getPrice } from '@/lib/pricing'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const { searchParams } = new URL(request.url)
  const checkIn = searchParams.get('checkIn')
  const checkOut = searchParams.get('checkOut')

  if (!checkIn || !checkOut) {
    return NextResponse.json(
      { error: 'checkIn and checkOut parameters required' },
      { status: 400 }
    )
  }

  try {
    const pricing = getPrice(slug, checkIn, checkOut)
    return NextResponse.json(pricing)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Pricing error' },
      { status: 400 }
    )
  }
}
