import { useTranslations } from 'next-intl'
import Image from 'next/image'

export default function Footer() {
  const t = useTranslations('footer')
  const year = new Date().getFullYear()

  return (
    <footer className="bg-primary text-white/90 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="Chaltén Loft Patagonia"
              width={48}
              height={48}
              className="rounded-full invert brightness-200"
            />
            <div>
              <h3 className="font-heading text-2xl font-bold text-white mb-0">
                Chaltén Loft
              </h3>
              <p className="text-white/60 text-sm">{t('location')}</p>
            </div>
          </div>

          {/* Direct Booking CTA */}
          <div className="flex items-center justify-center">
            <span className="badge-direct text-base px-6 py-3">
              {t('directBooking')}
            </span>
          </div>

          {/* Contact */}
          <div className="text-right">
            <p className="text-white/60 text-sm">
              © {year} Chaltén Loft. {t('rights')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
