import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { properties } from '@/lib/properties'
import { Users, Bed, Bath, Maximize, Wifi, Car, PawPrint, Tv, CookingPot, Briefcase, Coffee, Luggage, Mountain, Key, Wind } from 'lucide-react'
import type { Metadata } from 'next'
import PhotoCarousel from '@/components/properties/PhotoCarousel'
import AvailabilityCalendar from '@/components/booking/AvailabilityCalendar'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const property = properties.find((p) => p.slug === slug)
  if (!property) return {}

  return {
    title: `${property.name} (${property.subtitle}) — Chaltén Loft`,
    description: `${property.sqm}m² loft in El Chaltén, ${property.maxGuests} guests, ${property.beds} beds. Book direct for the best price.`,
  }
}

const amenityIcons: Record<string, React.ReactNode> = {
  kitchen: <CookingPot className="w-5 h-5" />,
  wifi: <Wifi className="w-5 h-5" />,
  parking: <Car className="w-5 h-5" />,
  pets: <PawPrint className="w-5 h-5" />,
  tv: <Tv className="w-5 h-5" />,
  workspace: <Briefcase className="w-5 h-5" />,
  washer: <Wind className="w-5 h-5" />,
  espresso: <Coffee className="w-5 h-5" />,
  luggage: <Luggage className="w-5 h-5" />,
  mountainView: <Mountain className="w-5 h-5" />,
  selfCheckin: <Key className="w-5 h-5" />,
}

export default async function PropertyPage({ params }: Props) {
  const { slug, locale } = await params
  setRequestLocale(locale)
  const property = properties.find((p) => p.slug === slug)

  if (!property) notFound()

  const t = await getTranslations({ locale, namespace: 'property' })
  const th = await getTranslations({ locale, namespace: 'home' })

  return (
    <>
      {/* Photo Gallery — fullwidth carousel */}
      <section className="relative h-[55vh] min-h-[400px] lg:h-[65vh]">
        <PhotoCarousel
          images={property.gallery}
          alt={`${property.name} (${property.subtitle})`}
        />
      </section>

      {/* Property Content */}
      <section className="py-12 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">

            {/* Main Content — 2/3 */}
            <div className="lg:col-span-2 space-y-12">

              {/* Title + Stats */}
              <div>
                <h1 className="font-heading text-4xl sm:text-5xl text-primary mb-2">
                  {property.name}
                </h1>
                <p className="font-heading text-2xl text-accent mb-6">
                  {property.subtitle}
                </p>
                <div className="flex flex-wrap items-center gap-6 text-muted">
                  <span className="flex items-center gap-2">
                    <Maximize className="w-5 h-5" />
                    {t('sqm', { count: property.sqm })}
                  </span>
                  <span className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    {th('guestsCount', { count: property.maxGuests })}
                  </span>
                  <span className="flex items-center gap-2">
                    <Bed className="w-5 h-5" />
                    {t('beds', { count: property.beds })}
                  </span>
                  <span className="flex items-center gap-2">
                    <Bath className="w-5 h-5" />
                    {t('bathrooms', { count: property.bathrooms })}
                  </span>
                </div>
              </div>

              {/* Description — Das Wanda editorial style */}
              <div className="border-t border-surface pt-10">
                <p className="text-lg leading-relaxed text-dark/80 max-w-2xl">
                  {t('detailDesc1', { sqm: property.sqm })}
                </p>
                <p className="text-base leading-relaxed text-muted mt-4 max-w-2xl">
                  {t('detailDesc2')}
                </p>
              </div>

              {/* Amenities — grid with icons */}
              <div className="border-t border-surface pt-10">
                <h2 className="font-heading text-2xl text-primary mb-8">
                  {t('amenities')}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                  {property.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-3 p-3 rounded-xl bg-surface/50"
                    >
                      <span className="text-accent">
                        {amenityIcons[amenity] || <span className="w-5 h-5 rounded-full bg-accent/20 block" />}
                      </span>
                      <span className="text-sm text-dark/80">{t(amenity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Availability Calendar — connected to Airbnb */}
              <div className="border-t border-surface pt-10">
                <h2 className="font-heading text-2xl text-primary mb-8">
                  {th('checkAvailability')}
                </h2>
                <AvailabilityCalendar propertySlug={property.slug} />
              </div>
            </div>

            {/* Sidebar — Booking widget sticky */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-2xl shadow-lg p-7 border border-surface/50">
                <div className="text-center mb-6">
                  <span className="badge-direct">{th('search')}</span>
                </div>

                <h3 className="font-heading text-xl text-primary mb-6 text-center">
                  {th('checkAvailability')}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                      {th('checkIn')}
                    </label>
                    <input
                      type="date"
                      className="w-full border border-surface rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                      {th('checkOut')}
                    </label>
                    <input
                      type="date"
                      className="w-full border border-surface rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                      {th('guests')}
                    </label>
                    <select className="w-full border border-surface rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all">
                      {Array.from({ length: property.maxGuests }, (_, i) => (
                        <option key={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>
                  <a
                    href={`/${locale}/booking/${property.slug}`}
                    className="block w-full bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl px-6 py-3.5 transition-all hover:shadow-lg hover:-translate-y-0.5 mt-2 text-center"
                  >
                    {t('bookNow')}
                  </a>
                </div>

                <p className="text-xs text-muted text-center mt-4">
                  {t('bookDirectBest')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
