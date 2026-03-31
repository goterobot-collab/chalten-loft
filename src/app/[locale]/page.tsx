import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { properties, heroImage, chaltenPhotos } from '@/lib/properties'
import { Users, Bed, Maximize, MapPin, Shield, MessageCircle, Wallet } from 'lucide-react'
import PhotoCarousel from '@/components/properties/PhotoCarousel'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'home' })
  const tp = await getTranslations({ locale, namespace: 'property' })

  return (
    <>
      {/* ═══════════════════════════════════════════════════
          HERO — Enjoy Montana fullscreen style
          ═══════════════════════════════════════════════════ */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        <Image
          src={heroImage}
          alt="Fitz Roy mountain at sunrise, El Chaltén Patagonia"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/60" />

        <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4">
          {/* Tagline — Das Wanda manifesto style */}
          <p className="text-sm sm:text-base uppercase tracking-[0.3em] text-white/70 mb-6">
            {t('location')}
          </p>
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[0.95]">
            {t('heroTagline')}
          </h1>
          <p className="text-lg sm:text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            {t('heroSubtitle')}
          </p>

          {/* Booking Widget — Lisboans style, floating glass */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="text-left">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                  {t('checkIn')}
                </label>
                <input
                  type="date"
                  className="w-full border-0 border-b-2 border-surface bg-transparent px-0 py-2 text-dark text-sm focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div className="text-left">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                  {t('checkOut')}
                </label>
                <input
                  type="date"
                  className="w-full border-0 border-b-2 border-surface bg-transparent px-0 py-2 text-dark text-sm focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div className="text-left">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                  {t('guests')}
                </label>
                <select className="w-full border-0 border-b-2 border-surface bg-transparent px-0 py-2 text-dark text-sm focus:outline-none focus:border-accent transition-colors">
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="w-full bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl px-6 py-3 transition-all hover:shadow-lg hover:-translate-y-0.5 text-sm">
                  {t('search')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2.5 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          WHY BOOK DIRECT — Das Wanda whitespace + icons
          ═══════════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-accent font-semibold mb-4">
            ✦
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-primary mb-20">
            {t('whyBookDirect')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto">
                <Wallet className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-heading text-xl text-primary">
                {t('reason1Title')}
              </h3>
              <p className="text-muted leading-relaxed text-[15px]">
                {t('reason1Desc')}
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto">
                <MessageCircle className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-heading text-xl text-primary">
                {t('reason2Title')}
              </h3>
              <p className="text-muted leading-relaxed text-[15px]">
                {t('reason2Desc')}
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-heading text-xl text-primary">
                {t('reason3Title')}
              </h3>
              <p className="text-muted leading-relaxed text-[15px]">
                {t('reason3Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          OUR LOFTS — Congaree style cards with carousel
          ═══════════════════════════════════════════════════ */}
      <section className="py-24 bg-surface/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <p className="text-sm uppercase tracking-[0.25em] text-accent font-semibold mb-4">
              ✦
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-primary">
              {t('ourLofts')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {properties.map((property) => (
              <Link
                key={property.slug}
                href={{ pathname: '/properties/[slug]', params: { slug: property.slug } }}
                className="group"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                  {/* Photo Carousel */}
                  <PhotoCarousel
                    images={property.gallery}
                    alt={`${property.name} (${property.subtitle})`}
                  />

                  {/* Info */}
                  <div className="p-6 sm:p-7">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-heading text-xl text-primary leading-tight">
                          {property.name}
                        </h3>
                        <span className="text-accent font-heading text-lg">
                          ({property.subtitle})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-muted mb-5">
                      <span className="flex items-center gap-1">
                        <Maximize className="w-3.5 h-3.5" />
                        {tp('sqm', { count: property.sqm })}
                      </span>
                      <span className="text-surface">•</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {t('guestsCount', { count: property.maxGuests })}
                      </span>
                      <span className="text-surface">•</span>
                      <span className="flex items-center gap-1">
                        <Bed className="w-3.5 h-3.5" />
                        {tp('beds', { count: property.beds })}
                      </span>
                    </div>

                    {/* Location tag */}
                    <div className="flex items-center gap-1.5 text-xs text-muted/70 mb-5">
                      <MapPin className="w-3 h-3" />
                      {t('location')}
                    </div>

                    <div className="pt-5 border-t border-surface/80">
                      <span className="inline-flex items-center gap-2 text-accent font-semibold text-sm group-hover:gap-3 transition-all">
                        {tp('bookNow')}
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          EL CHALTÉN — Destination section
          ═══════════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-accent font-semibold mb-4">
                El Chaltén
              </p>
              <h2 className="font-heading text-3xl sm:text-4xl text-primary mb-8 leading-tight">
                {t('chaltenTitle')}
              </h2>
              <div className="space-y-5 text-muted leading-relaxed text-[15px]">
                <p>{t('chaltenP1')}</p>
                <p>{t('chaltenP2')}</p>
                <p>{t('chaltenP3')}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src={chaltenPhotos[0]}
                  alt="Fitz Roy at sunset with wooden gate — El Chaltén Patagonia"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-square rounded-xl overflow-hidden">
                  <Image
                    src={chaltenPhotos[1]}
                    alt="Fitz Roy green valley golden sunset — El Chaltén"
                    fill
                    className="object-cover"
                    sizes="25vw"
                  />
                </div>
                <div className="relative aspect-square rounded-xl overflow-hidden">
                  <Image
                    src={chaltenPhotos[3]}
                    alt="Fitz Roy golden light with river — El Chaltén trekking"
                    fill
                    className="object-cover"
                    sizes="25vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
