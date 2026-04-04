'use client'

import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'

type Props = {
  slug: string
  priceFrom: number
  currency?: string
}

export default function MobileBookingBar({ slug, priceFrom, currency = 'USD' }: Props) {
  const [visible, setVisible] = useState(false)
  const locale = useLocale()
  const t = useTranslations('property')

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300)
    }

    const sidebar = document.getElementById('booking-sidebar')
    let observer: IntersectionObserver | null = null
    if (sidebar) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setVisible(false)
        },
        { threshold: 0.3 }
      )
      observer.observe(sidebar)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer?.disconnect()
    }
  }, [])

  return (
    <div
      className={`
        fixed bottom-0 inset-x-0 z-40 lg:hidden
        bg-white border-t border-surface shadow-[0_-4px_24px_rgba(0,0,0,0.08)]
        transition-transform duration-300 ease-in-out
        ${visible ? 'translate-y-0' : 'translate-y-full'}
      `}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <div>
          <p className="text-xs text-muted uppercase tracking-wide font-medium">
            {t('priceFrom')}
          </p>
          <p className="font-heading text-xl text-primary">
            <span className="font-bold">{currency} {priceFrom}</span>
            <span className="text-sm text-muted font-normal"> / {t('night')}</span>
          </p>
        </div>
        <a
          href={`/${locale}/booking/${slug}`}
          className="bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl px-7 py-3.5 text-sm transition-all hover:shadow-lg active:scale-95 whitespace-nowrap"
        >
          {t('bookNow')}
        </a>
      </div>
    </div>
  )
}
