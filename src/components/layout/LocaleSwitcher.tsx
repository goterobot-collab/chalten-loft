'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { locales } from '@/i18n/routing'

const localeNames: Record<string, string> = {
  en: 'EN',
  es: 'ES',
  pt: 'PT',
  fr: 'FR',
  de: 'DE',
  ko: '한국어',
  zh: '中文',
  ja: '日本語',
}

export default function LocaleSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  function onLocaleChange(newLocale: string) {
    router.replace(
      // @ts-expect-error — pathname may include dynamic segments
      pathname,
      { locale: newLocale as typeof locales[number] }
    )
  }

  return (
    <select
      value={locale}
      onChange={(e) => onLocaleChange(e.target.value)}
      className="bg-transparent text-sm font-medium text-dark/70 border border-surface rounded px-2 py-1 cursor-pointer hover:border-primary/30 transition-colors focus:outline-none focus:ring-1 focus:ring-primary/30"
      aria-label="Select language"
    >
      {locales.map((loc) => (
        <option key={loc} value={loc}>
          {localeNames[loc]}
        </option>
      ))}
    </select>
  )
}
