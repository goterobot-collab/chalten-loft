'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { properties } from '@/lib/properties'
import { Users, Calendar, CreditCard, Tag } from 'lucide-react'
import AvailabilityCalendar from '@/components/booking/AvailabilityCalendar'
import type { DateRange } from 'react-day-picker'
import type { PricingResult } from '@/lib/pricing'

export default function BookingPage() {
  const params = useParams()
  const slug = params.slug as string
  const locale = params.locale as string
  const property = properties.find((p) => p.slug === slug)
  const t = useTranslations('booking')
  const th = useTranslations('home')

  const searchParams = useSearchParams()
  const initialCheckIn = searchParams.get('checkIn')
  const initialCheckOut = searchParams.get('checkOut')
  const initialGuests = parseInt(searchParams.get('guests') || '2')

  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    if (initialCheckIn && initialCheckOut) {
      return {
        from: new Date(initialCheckIn + 'T12:00:00'),
        to: new Date(initialCheckOut + 'T12:00:00'),
      }
    }
    return undefined
  })
  const [guests, setGuests] = useState(initialGuests)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [pricing, setPricing] = useState<PricingResult | null>(null)
  const [pricingLoading, setPricingLoading] = useState(false)

  // Fetch dynamic pricing when dates change
  useEffect(() => {
    if (!dateRange?.from || !dateRange?.to) {
      setPricing(null)
      return
    }

    const checkIn = dateRange.from.toISOString().split('T')[0]
    const checkOut = dateRange.to.toISOString().split('T')[0]

    setPricingLoading(true)
    fetch(`/api/pricing/${slug}?checkIn=${checkIn}&checkOut=${checkOut}`)
      .then(res => res.json())
      .then(data => {
        setPricing(data)
        setPricingLoading(false)
      })
      .catch(() => setPricingLoading(false))
  }, [dateRange, slug])

  if (!property) return <div className="p-20 text-center">{t('propertyNotFound')}</div>

  const prop = property!
  const isSpanish = locale === 'es'

  async function handlePayment() {
    if (!dateRange?.from || !dateRange?.to) {
      setError(t('errorSelectDates'))
      return
    }
    if (!name || !email) {
      setError(t('errorNameEmail'))
      return
    }
    if (!pricing) return

    if (pricing.isClosed) {
      setError(t('errorClosed'))
      return
    }

    if (pricing.nights < pricing.minNights) {
      setError(t('errorMinNights', { count: pricing.minNights }))
      return
    }

    setLoading(true)
    setError('')

    try {
      // Re-check availability against Airbnb BEFORE processing payment
      const availRes = await fetch(`/api/availability/${slug}`)
      const availData = await availRes.json()
      if (availData.blockedDates) {
        const checkInStr = dateRange.from.toISOString().split('T')[0]
        const checkOutStr = dateRange.to.toISOString().split('T')[0]
        const start = new Date(checkInStr + 'T12:00:00')
        const end = new Date(checkOutStr + 'T12:00:00')
        const blocked = new Set(availData.blockedDates as string[])
        const current = new Date(start)
        while (current < end) {
          if (blocked.has(current.toISOString().split('T')[0])) {
            setError(t('errorClosed'))
            setLoading(false)
            return
          }
          current.setDate(current.getDate() + 1)
        }
      }

      if (isSpanish) {
        // Argentine guests → MercadoPago (ARS)
        const res = await fetch('/api/payments/mercadopago', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            propertyName: `${prop.name} (${prop.subtitle})`,
            propertySlug: prop.slug,
            checkIn: dateRange.from.toISOString().split('T')[0],
            checkOut: dateRange.to.toISOString().split('T')[0],
            nights: pricing.nights,
            guests,
            totalPrice: pricing.totalARS,
            guestName: name,
            guestEmail: email,
          }),
        })
        const data = await res.json()
        if (data.init_point) {
          window.location.href = data.init_point
        } else {
          setError(t('errorPayment'))
        }
      } else {
        // International guests → Stripe (USD)
        const res = await fetch('/api/payments/stripe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            propertyName: `${prop.name} (${prop.subtitle})`,
            propertySlug: prop.slug,
            checkIn: dateRange.from.toISOString().split('T')[0],
            checkOut: dateRange.to.toISOString().split('T')[0],
            nights: pricing.nights,
            guests,
            totalPrice: pricing.totalUSD,
            guestName: name,
            guestEmail: email,
          }),
        })
        const data = await res.json()
        if (data.url) {
          window.location.href = data.url
        } else {
          setError(t('errorPayment'))
        }
      }
    } catch {
      setError(t('errorConnection'))
    } finally {
      setLoading(false)
    }
  }

  const dateLocale = locale === 'es' ? 'es-AR' : locale === 'pt' ? 'pt-BR' : 'en-US'

  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.25em] text-accent font-semibold mb-3">
            {t('bookDirectBest')}
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl text-primary mb-2">
            {prop.name}
          </h1>
          <p className="font-heading text-xl text-accent">{prop.subtitle}</p>
          <p className="text-muted text-sm mt-2">{prop.sqm}m² · {th('guestsCount', { count: prop.maxGuests })}</p>
          {/* Discount badge */}
          <div className="mt-3 inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
            <Tag className="w-3.5 h-3.5" />
            {t('directDiscount')}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Calendar + Form */}
          <div className="space-y-8">
            <div>
              <h2 className="font-heading text-xl text-primary mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent" />
                {t('selectDates')}
              </h2>
              <AvailabilityCalendar
                propertySlug={prop.slug}
                onDateChange={setDateRange}
              />
            </div>

            <div>
              <h2 className="font-heading text-xl text-primary mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" />
                {t('guestDetails')}
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted mb-1">
                      {t('fullName')}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('namePlaceholder')}
                      className="w-full border border-surface rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted mb-1">
                      {t('guests')}
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      className="w-full border border-surface rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                    >
                      {Array.from({ length: prop.maxGuests }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{t('guestCount', { count: i + 1 })}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted mb-1">
                    {t('email')}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('emailPlaceholder')}
                    className="w-full border border-surface rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted mb-1">
                    {t('phone')}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t('phonePlaceholder')}
                    className="w-full border border-surface rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Summary + Pay */}
          <div>
            <div className="sticky top-24 bg-white rounded-2xl shadow-lg border border-surface/50 overflow-hidden">
              <div className="relative h-48">
                <Image src={prop.heroImage} alt={prop.name} fill className="object-cover" />
              </div>

              <div className="p-6">
                <h3 className="font-heading text-lg text-primary mb-1">{prop.name}</h3>
                <p className="text-accent text-sm mb-6">{prop.subtitle}</p>

                {pricingLoading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  </div>
                ) : pricing && pricing.nights > 0 ? (
                  <>
                    {/* Closed dates warning */}
                    {pricing.isClosed && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-700">
                        {t('closedWarning')}
                      </div>
                    )}

                    {/* Min nights warning */}
                    {pricing.nights < pricing.minNights && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-sm text-amber-700">
                        {t('minNightsWarning', { count: pricing.minNights })}
                      </div>
                    )}

                    {/* Demand surcharge badge */}
                    {pricing.demandSurcharges.length > 0 && (
                      <div className="bg-accent/5 border border-accent/20 rounded-xl p-3 mb-4 text-sm text-accent">
                        {t('highDemand')}: {pricing.demandSurcharges.join(', ')}
                      </div>
                    )}

                    {/* Price breakdown */}
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted">
                          ~${pricing.avgPerNight} USD × {th('nightCount', { count: pricing.nights })}
                        </span>
                        <span className="font-medium">${pricing.subtotal} USD</span>
                      </div>
                      <div className="border-t border-surface pt-3 flex justify-between">
                        <span className="font-semibold text-primary">{t('total')}</span>
                        <div className="text-right">
                          <p className="font-bold text-primary text-lg">${pricing.totalUSD} USD</p>
                          {isSpanish && (
                            <p className="text-xs text-muted">~${pricing.totalARS.toLocaleString('es-AR')} ARS</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="mt-4 p-3 bg-surface/50 rounded-xl text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted">{t('checkIn')}</span>
                        <span className="font-medium">
                          {dateRange?.from?.toLocaleDateString(dateLocale, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-muted">{t('checkOut')}</span>
                        <span className="font-medium">
                          {dateRange?.to?.toLocaleDateString(dateLocale, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>

                    {error && (
                      <p className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-xl">{error}</p>
                    )}

                    <button
                      onClick={handlePayment}
                      disabled={loading || pricing.isClosed || pricing.nights < pricing.minNights}
                      className="w-full mt-6 bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl px-6 py-4 transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          {isSpanish ? t('payMercadoPago') : t('payCard')}
                        </>
                      )}
                    </button>

                    <p className="text-xs text-center text-muted mt-3">
                      {t('securePayment')}
                    </p>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-10 h-10 text-muted/30 mx-auto mb-3" />
                    <p className="text-muted text-sm">{t('selectDatesPrompt')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
