import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { properties } from '@/lib/properties'
import { Users, Bed, Maximize, MapPin } from 'lucide-react'
import PhotoCarousel from '@/components/properties/PhotoCarousel'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ checkIn?: string; checkOut?: string; guests?: string }>
}

export default async function PropertiesPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { checkIn, checkOut, guests } = await searchParams
  setRequestLocale(locale)

  const bookingParamsObj = new URLSearchParams()
  if (checkIn) bookingParamsObj.set('checkIn', checkIn)
  if (checkOut) bookingParamsObj.set('checkOut', checkOut)
  if (guests) bookingParamsObj.set('guests', guests)
  const bookingQuery = bookingParamsObj.toString() ? `?${bookingParamsObj.toString()}` : ''
  const t = await getTranslations({ locale, namespace: 'home' })
  const tp = await getTranslations({ locale, namespace: 'property' })

  return (
    <>
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-4">
              ✦
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-primary mb-6">
              {t('ourLofts')}
            </h1>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              {tp('propertiesSubtitle')}
            </p>
          </div>

          <div className="space-y-16">
            {properties.map((property, index) => (
              <Link
                key={property.slug}
                href={{ pathname: '/properties/[slug]', params: { slug: property.slug } }}
                className="group block"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${
                  index % 2 === 1 ? 'lg:direction-rtl' : ''
                }`}>
                  {/* Photo */}
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className="rounded-2xl overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-500">
                      <PhotoCarousel
                        images={property.gallery}
                        alt={`${property.name} (${property.subtitle})`}
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <div>
                      <h2 className="font-heading text-3xl sm:text-4xl text-primary leading-tight">
                        {property.name}
                      </h2>
                      <span className="font-heading text-2xl text-accent">
                        ({property.subtitle})
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
                      <span className="flex items-center gap-1.5">
                        <Maximize className="w-4 h-4" />
                        {tp('sqm', { count: property.sqm })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        {t('guestsCount', { count: property.maxGuests })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Bed className="w-4 h-4" />
                        {tp('beds', { count: property.beds })}
                      </span>
                    </div>

                    <p className="text-dark/70 leading-relaxed max-w-md">
                      {tp('propertyDesc', { sqm: property.sqm })}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-muted/60">
                      <MapPin className="w-3 h-3" />
                      {t('location')}
                    </div>

                    <a
                      href={`/${locale}/booking/${property.slug}${bookingQuery}`}
                      className="inline-flex items-center gap-2 text-accent font-semibold group-hover:gap-3 transition-all"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {tp('bookNow')}
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </a>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
