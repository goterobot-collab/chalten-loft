import type { Metadata } from 'next'
import { DM_Serif_Display, Poppins, Noto_Sans } from 'next/font/google'
import './globals.css'

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-playfair',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
})

const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-noto-sans',
})

export const metadata: Metadata = {
  title: 'Chaltén Loft',
  description: 'Apartments in El Chaltén, Patagonia Argentina',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className={`${dmSerif.variable} ${poppins.variable} ${notoSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-dark">
        {children}
      </body>
    </html>
  )
}
