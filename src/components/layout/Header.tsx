'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import LocaleSwitcher from './LocaleSwitcher'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const t = useTranslations('nav')
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Chaltén Loft Patagonia"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="font-heading text-xl font-bold text-primary tracking-tight hidden sm:inline">
              Chaltén Loft
            </span>
          </Link>

          {/* Nav — Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/properties"
              className="text-sm font-medium text-dark/70 hover:text-primary transition-colors"
            >
              {t('properties')}
            </Link>
            <Link
              href="/trekking"
              className="text-sm font-medium text-dark/70 hover:text-primary transition-colors"
            >
              {t('trekking')}
            </Link>
            <Link
              href="/gastronomia"
              className="text-sm font-medium text-dark/70 hover:text-primary transition-colors"
            >
              {t('gastronomia')}
            </Link>
            <Link
              href="/recomendaciones"
              className="text-sm font-medium text-dark/70 hover:text-primary transition-colors"
            >
              {t('recomendaciones')}
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-dark/70 hover:text-primary transition-colors"
            >
              {t('about')}
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-dark/70 hover:text-primary transition-colors"
            >
              {t('contact')}
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <LocaleSwitcher />
            <span className="badge-direct hidden sm:inline-block">
              {t('bookDirect')}
            </span>
            {/* Hamburger — Mobile */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-dark/70 hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-surface animate-in slide-in-from-top">
          <nav className="px-4 py-6 space-y-4">
            <Link
              href="/properties"
              onClick={() => setMobileOpen(false)}
              className="block text-lg font-medium text-dark/80 hover:text-primary transition-colors py-2"
            >
              {t('properties')}
            </Link>
            <Link
              href="/trekking"
              onClick={() => setMobileOpen(false)}
              className="block text-lg font-medium text-dark/80 hover:text-primary transition-colors py-2"
            >
              {t('trekking')}
            </Link>
            <Link
              href="/gastronomia"
              onClick={() => setMobileOpen(false)}
              className="block text-lg font-medium text-dark/80 hover:text-primary transition-colors py-2"
            >
              {t('gastronomia')}
            </Link>
            <Link
              href="/recomendaciones"
              onClick={() => setMobileOpen(false)}
              className="block text-lg font-medium text-dark/80 hover:text-primary transition-colors py-2"
            >
              {t('recomendaciones')}
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileOpen(false)}
              className="block text-lg font-medium text-dark/80 hover:text-primary transition-colors py-2"
            >
              {t('about')}
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="block text-lg font-medium text-dark/80 hover:text-primary transition-colors py-2"
            >
              {t('contact')}
            </Link>
            <div className="pt-4 border-t border-surface">
              <span className="badge-direct">
                {t('bookDirect')}
              </span>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
