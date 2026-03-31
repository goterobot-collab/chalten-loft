import { MapPin, Mail, Clock, MessageCircle, Luggage } from 'lucide-react'
import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import ContactForm from '@/components/contact/ContactForm'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'contact' })

  return (
    <>
      {/* Hero with Logo */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Big Logo */}
          <div className="mb-10">
            <Image
              src="/images/logo.png"
              alt="Chaltén Loft Patagonia"
              width={160}
              height={160}
              className="mx-auto mix-blend-multiply"
            />
          </div>

          <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-6">
            {t('title')}
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-primary mb-8">
            {t('heroTitle')}
          </h1>
          <p className="text-lg text-muted leading-relaxed max-w-2xl mx-auto">
            {t('heroSubtitle')}
          </p>
        </div>
      </section>

      {/* Luggage Storage Highlight */}
      <section className="pb-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="bg-accent/5 border border-accent/20 rounded-2xl p-8 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Luggage className="w-8 h-8 text-accent" />
            </div>
            <div>
              <h3 className="font-heading text-lg text-primary mb-1">
                {t('luggageTitle')}
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                {t('luggageDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="pb-24 sm:pb-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Contact Form */}
            <div>
              <h2 className="font-heading text-2xl text-primary mb-8">
                {t('sendMessage')}
              </h2>
              <ContactForm />
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <h2 className="font-heading text-2xl text-primary mb-8">
                {t('orReachUs')}
              </h2>

              <div className="space-y-6">
                <a
                  href="https://wa.me/5492901644067"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-surface hover:border-green-300 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary text-sm">{t('whatsapp')}</p>
                    <p className="text-muted text-sm">{t('whatsappDesc')}</p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-surface">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary text-sm">{t('emailLabel')}</p>
                    <p className="text-muted text-sm">chaltenloft@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-surface">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary text-sm">{t('locationLabel')}</p>
                    <p className="text-muted text-sm">
                      {t('locationValue')}<br />
                      {t('locationDetail')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-surface">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary text-sm">{t('responseTime')}</p>
                    <p className="text-muted text-sm">{t('responseTimeValue')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-surface">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Luggage className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary text-sm">{t('luggageLabel')}</p>
                    <p className="text-muted text-sm">{t('luggageValue')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
