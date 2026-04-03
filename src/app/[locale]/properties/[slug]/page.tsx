import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { properties } from '@/lib/properties'
import { Users, Bed, Bath, Maximize, Wifi, Car, PawPrint, Tv, CookingPot, Briefcase, Coffee, Luggage, Mountain, Key, Wind } from 'lucide-react'
import type { Metadata } from 'next'
import PhotoCarousel from '@/components/properties/PhotoCarousel'
import AvailabilityCalendar from '@/components/booking/AvailabilityCalendar'
import { FadeIn, FadeInView, StaggerFadeIn, StaggerItem, SlideInView } from '@/components/ui/animations'

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

const valijeroT = {
  es: {
    title: '🧳 Valijero — Guarda Equipaje',
    desc: 'Para su comodidad, tenemos un valijero a su disposición, a la izquierda de la propiedad, donde podrán dejar su equipaje.',
    items: [
      'Este espacio es compartido con el resto de los huéspedes de la propiedad.',
      'El código de acceso es 0000.',
      'Siéntase libre de utilizarlo al ingreso y al egreso del loft.',
    ],
    warning: 'Por favor, NO SE LLEVE la llave que abre el valijero. 🔑 Es de uso compartido. ¡Gracias!',
  },
  en: {
    title: '🧳 Luggage Storage',
    desc: 'For your convenience, there is a luggage locker available to you on the left side of the property, where you can leave your bags.',
    items: [
      'This storage space is shared with other guests at the property.',
      'The access code is 0000.',
      'Feel free to use it when checking in or checking out of the loft.',
    ],
    warning: 'Please do NOT take the key that opens the locker. 🔑 It is shared by all guests. Thank you!',
  },
  pt: {
    title: '🧳 Guarda-Volumes',
    desc: 'Para sua comodidade, temos um armário de bagagem à sua disposição, à esquerda da propriedade, onde você pode deixar suas malas.',
    items: [
      'Este espaço é compartilhado com os outros hóspedes da propriedade.',
      'O código de acesso é 0000.',
      'Sinta-se à vontade para usá-lo na entrada e na saída do loft.',
    ],
    warning: 'Por favor, NÃO LEVE a chave que abre o armário. 🔑 É de uso compartilhado. Obrigado!',
  },
  fr: {
    title: '🧳 Consigne à Bagages',
    desc: 'Pour votre confort, une consigne à bagages est à votre disposition sur le côté gauche de la propriété, où vous pouvez laisser vos bagages.',
    items: [
      'Cet espace est partagé avec les autres clients de la propriété.',
      'Le code d\'accès est 0000.',
      'N\'hésitez pas à l\'utiliser à l\'arrivée et au départ du loft.',
    ],
    warning: 'Veuillez NE PAS emporter la clé qui ouvre la consigne. 🔑 Elle est partagée par tous les clients. Merci !',
  },
  de: {
    title: '🧳 Gepäckaufbewahrung',
    desc: 'Für Ihre Bequemlichkeit steht Ihnen links neben dem Eingang ein Gepäckschrank zur Verfügung, in dem Sie Ihr Gepäck abstellen können.',
    items: [
      'Dieser Bereich ist mit den anderen Gästen der Unterkunft geteilt.',
      'Der Zugangscode ist 0000.',
      'Nutzen Sie ihn gerne bei An- und Abreise vom Loft.',
    ],
    warning: 'Bitte nehmen Sie den Schlüssel NICHT mit. 🔑 Er wird von allen Gästen genutzt. Danke!',
  },
  ko: {
    title: '🧳 수하물 보관함',
    desc: '편의를 위해 숙소 왼쪽에 수하물 보관함이 마련되어 있습니다. 짐을 맡기실 수 있습니다.',
    items: [
      '이 공간은 다른 투숙객들과 공유됩니다.',
      '비밀번호는 0000입니다.',
      '체크인 및 체크아웃 시 자유롭게 이용하세요.',
    ],
    warning: '보관함 열쇠를 가져가지 마세요. 🔑 모든 투숙객이 함께 사용합니다. 감사합니다!',
  },
  ja: {
    title: '🧳 荷物預かりロッカー',
    desc: 'ご便宜のために、物件の左側に荷物を預けられるロッカーをご用意しています。',
    items: [
      'このスペースは他のゲストと共有されます。',
      'アクセスコードは0000です。',
      'チェックイン・チェックアウト時にご自由にお使いください。',
    ],
    warning: 'ロッカーの鍵はお持ち帰りにならないでください。🔑 他のゲストと共有するものです。ありがとうございます！',
  },
  zh: {
    title: '🧳 行李寄存',
    desc: '为方便您，我们在房产左侧提供行李柜供您使用，您可以将行李存放于此。',
    items: [
      '该空间与房产内其他住客共用。',
      '访问密码为 0000。',
      '请在入住和退房时随时使用。',
    ],
    warning: '请勿带走行李柜的钥匙。🔑 该钥匙供所有住客共用。谢谢！',
  },
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
                <FadeIn delay={0.05}>
                  <h1 className="font-heading text-4xl sm:text-5xl text-primary mb-2">
                    {property.name}
                  </h1>
                  <p className="font-heading text-2xl text-accent mb-6">
                    {property.subtitle}
                  </p>
                </FadeIn>
                <FadeIn delay={0.2}>
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
                </FadeIn>
              </div>

              {/* Description — Das Wanda editorial style */}
              <FadeInView className="border-t border-surface pt-10">
                <p className="text-lg leading-relaxed text-dark/80 max-w-2xl">
                  {t('detailDesc1', { sqm: property.sqm })}
                </p>
                <p className="text-base leading-relaxed text-muted mt-4 max-w-2xl">
                  {t('detailDesc2')}
                </p>
              </FadeInView>

              {/* Amenities — grid with icons */}
              <div className="border-t border-surface pt-10">
                <FadeInView>
                  <h2 className="font-heading text-2xl text-primary mb-8">
                    {t('amenities')}
                  </h2>
                </FadeInView>
                <StaggerFadeIn className="grid grid-cols-2 sm:grid-cols-3 gap-5" stagger={0.06}>
                  {property.amenities.map((amenity) => (
                    <StaggerItem key={amenity}>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-surface/50">
                        <span className="text-accent">
                          {amenityIcons[amenity] || <span className="w-5 h-5 rounded-full bg-accent/20 block" />}
                        </span>
                        <span className="text-sm text-dark/80">{t(amenity)}</span>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerFadeIn>
              </div>

              {/* Luggage Storage — Valijero */}
              <FadeInView className="border-t border-surface pt-10">
                <h2 className="font-heading text-2xl text-primary mb-6">
                  {valijeroT[locale as keyof typeof valijeroT]?.title ?? valijeroT.en.title}
                </h2>
                <div className="rounded-2xl border border-surface bg-surface/30 p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Luggage className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <p className="text-dark/75 leading-relaxed text-sm">
                      {valijeroT[locale as keyof typeof valijeroT]?.desc ?? valijeroT.en.desc}
                    </p>
                  </div>
                  <ul className="space-y-2 pl-8">
                    {(valijeroT[locale as keyof typeof valijeroT]?.items ?? valijeroT.en.items).map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-dark/70">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mt-2">
                    <span className="text-lg shrink-0">⚠️</span>
                    <p className="text-sm font-medium text-amber-800">
                      {valijeroT[locale as keyof typeof valijeroT]?.warning ?? valijeroT.en.warning}
                    </p>
                  </div>
                </div>
              </FadeInView>

              {/* Availability Calendar — connected to Airbnb */}
              <FadeInView className="border-t border-surface pt-10">
                <h2 className="font-heading text-2xl text-primary mb-8">
                  {th('checkAvailability')}
                </h2>
                <AvailabilityCalendar propertySlug={property.slug} />
              </FadeInView>
            </div>

            {/* Sidebar — Booking widget sticky */}
            <SlideInView from="right" delay={0.15} className="lg:col-span-1">
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
            </SlideInView>
          </div>
        </div>
      </section>
    </>
  )
}
