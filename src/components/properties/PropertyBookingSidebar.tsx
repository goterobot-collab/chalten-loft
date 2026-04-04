'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

type Props = {
  slug: string
  locale: string
  maxGuests: number
  priceFrom?: number
}

export default function PropertyBookingSidebar({ slug, locale, maxGuests, priceFrom }: Props) {
  const th = useTranslations('home')
  const t = useTranslations('property')

  const today = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)

  const params = new URLSearchParams()
  if (checkIn) params.set('checkIn', checkIn)
  if (checkOut) params.set('checkOut', checkOut)
  params.set('guests', String(guests))
  const bookingQuery = params.toString() ? `?${params.toString()}` : ''

  return (
    <div id="booking-sidebar" className="sticky top-24 bg-white rounded-2xl shadow-lg p-7 border border-surface/50">
      <div className="text-center mb-6">
        <span className="badge-direct">{th('search')}</span>
      </div>

      <h3 className="font-heading text-xl text-primary mb-1 text-center">
        {th('checkAvailability')}
      </h3>

      {priceFrom && (
        <p className="text-center text-sm text-muted mb-6">
          {t('priceFrom')} <span className="font-bold text-primary text-base">USD {priceFrom}</span>
          <span className="text-xs"> / {t('night')}</span>
        </p>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
            {th('checkIn')}
          </label>
          <input
            type="date"
            value={checkIn}
            min={today}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full border border-surface rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
            {th('checkOut')}
          </label>
          <input
            type="date"
            value={checkOut}
            min={checkIn || tomorrow}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full border border-surface rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
            {th('guests')}
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            className="w-full border border-surface rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
          >
            {Array.from({ length: maxGuests }, (_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>
        <a
          href={`/${locale}/booking/${slug}${bookingQuery}`}
          className="block w-full bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl px-6 py-3.5 transition-all hover:shadow-lg hover:-translate-y-0.5 mt-2 text-center"
        >
          {t('bookNow')}
        </a>
      </div>

      <p className="text-xs text-muted text-center mt-4">
        {t('bookDirectBest')}
      </p>
    </div>
  )
}
