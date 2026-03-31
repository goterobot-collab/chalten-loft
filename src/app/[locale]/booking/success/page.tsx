import { CheckCircle, MessageCircle, Mail } from 'lucide-react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'

type Props = {
  params: Promise<{ locale: string }>
}

export const dynamic = 'force-dynamic'

export default async function BookingSuccessPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'success' })
  const tw = await getTranslations({ locale, namespace: 'whatsapp' })

  return (
    <div className="py-20 sm:py-32">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
        <Image
          src="/images/logo.png"
          alt="Chaltén Loft"
          width={80}
          height={80}
          className="mx-auto mb-8 mix-blend-multiply"
        />

        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="font-heading text-4xl sm:text-5xl text-primary mb-4">
          {t('title')}
        </h1>
        <p className="text-lg text-muted mb-10">
          {t('subtitle')}
        </p>

        <div className="bg-surface/50 rounded-2xl p-8 mb-10 text-left">
          <h3 className="font-heading text-lg text-primary mb-4">{t('whatsNext')}</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <p className="font-medium text-dark text-sm">{t('emailSent')}</p>
                <p className="text-muted text-sm">{t('emailSentDesc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <p className="font-medium text-dark text-sm">{t('gabrielReach')}</p>
                <p className="text-muted text-sm">{t('gabrielReachDesc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <p className="font-medium text-dark text-sm">{t('beforeArrival')}</p>
                <p className="text-muted text-sm">{t('beforeArrivalDesc')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={`https://wa.me/5492901644067?text=${encodeURIComponent(tw('defaultMessage'))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl px-6 py-3 transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            {t('messageGabriel')}
          </a>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl px-6 py-3 transition-all"
          >
            {t('backHome')}
          </Link>
        </div>
      </div>
    </div>
  )
}
