import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { chaltenPhotos } from '@/lib/properties'
import { FadeIn, FadeInView, StaggerFadeIn, StaggerItem } from '@/components/ui/animations'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'about' })

  return (
    <>
      {/* Hero — Das Wanda editorial style */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn delay={0.05}>
            <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-6">
              {t('ourStory')}
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-primary mb-8 leading-tight whitespace-pre-line">
              {t('heroTitle')}
            </h1>
          </FadeIn>
          <FadeIn delay={0.35}>
            <p className="text-lg text-muted leading-relaxed max-w-2xl mx-auto">
              {t('heroSubtitle')}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Photo break */}
      <section className="relative h-[50vh] min-h-[300px]">
        <Image
          src={chaltenPhotos[1]}
          alt="Fitz Roy green valley sunset — El Chaltén Patagonia"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </section>

      {/* Story */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <StaggerFadeIn className="space-y-8 text-dark/80 leading-relaxed text-[17px]" stagger={0.12}>
            <StaggerItem><p>{t('storyP1')}</p></StaggerItem>
            <StaggerItem><p>{t('storyP2')}</p></StaggerItem>
            <StaggerItem><p>{t('storyP3')}</p></StaggerItem>
          </StaggerFadeIn>

          {/* Host info */}
          <FadeInView delay={0.1} className="mt-16 pt-16 border-t border-surface">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="w-24 h-24 rounded-full bg-surface flex items-center justify-center">
                <span className="font-heading text-3xl text-primary">G</span>
              </div>
              <div>
                <h3 className="font-heading text-xl text-primary mb-1">{t('hostName')}</h3>
                <p className="text-muted text-sm mb-3">{t('hostRole')}</p>
                <p className="text-dark/70 text-[15px] leading-relaxed">
                  {t('hostDesc')}
                </p>
              </div>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* Numbers — Lisboans trust section */}
      <section className="py-20 bg-primary text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <StaggerFadeIn className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center" stagger={0.08}>
            <StaggerItem>
              <p className="font-heading text-4xl sm:text-5xl font-bold">3</p>
              <p className="text-white/60 text-sm mt-2">{t('lofts')}</p>
            </StaggerItem>
            <StaggerItem>
              <p className="font-heading text-4xl sm:text-5xl font-bold">153</p>
              <p className="text-white/60 text-sm mt-2">{t('reviews')}</p>
            </StaggerItem>
            <StaggerItem>
              <p className="font-heading text-4xl sm:text-5xl font-bold">4.66</p>
              <p className="text-white/60 text-sm mt-2">{t('averageRating')}</p>
            </StaggerItem>
            <StaggerItem>
              <p className="font-heading text-4xl sm:text-5xl font-bold">2</p>
              <p className="text-white/60 text-sm mt-2">{t('yearsHosting')}</p>
            </StaggerItem>
          </StaggerFadeIn>
        </div>
      </section>
    </>
  )
}
