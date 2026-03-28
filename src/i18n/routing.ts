import { defineRouting } from 'next-intl/routing'

export const locales = ['en', 'es', 'pt', 'fr', 'de', 'ko', 'zh', 'ja'] as const
export type Locale = (typeof locales)[number]

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    '/properties': {
      en: '/properties',
      es: '/propiedades',
      pt: '/propriedades',
      fr: '/proprietes',
      de: '/unterkuenfte',
      ko: '/properties',
      zh: '/properties',
      ja: '/properties',
    },
    '/properties/[slug]': {
      en: '/properties/[slug]',
      es: '/propiedades/[slug]',
      pt: '/propriedades/[slug]',
      fr: '/proprietes/[slug]',
      de: '/unterkuenfte/[slug]',
      ko: '/properties/[slug]',
      zh: '/properties/[slug]',
      ja: '/properties/[slug]',
    },
    '/about': {
      en: '/about',
      es: '/nosotros',
      pt: '/sobre',
      fr: '/a-propos',
      de: '/ueber-uns',
      ko: '/about',
      zh: '/about',
      ja: '/about',
    },
    '/contact': {
      en: '/contact',
      es: '/contacto',
      pt: '/contato',
      fr: '/contact',
      de: '/kontakt',
      ko: '/contact',
      zh: '/contact',
      ja: '/contact',
    },
  },
})
