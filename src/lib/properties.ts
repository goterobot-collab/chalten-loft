export type Property = {
  slug: string
  name: string
  subtitle: string
  sqm: number
  maxGuests: number
  bedrooms: number
  beds: number
  bathrooms: number
  checkIn: string
  checkOut: string
  amenities: string[]
  heroImage: string
  gallery: string[]
}

export const properties: Property[] = [
  {
    slug: 'chalten-loft-fitz-roy',
    name: 'Chaltén Loft',
    subtitle: 'Dpto 1 — Fitz Roy',
    sqm: 75,
    maxGuests: 3,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    checkIn: '15:00',
    checkOut: '10:00',
    amenities: [
      'kitchen', 'wifi', 'workspace', 'parking', 'pets', 'tv',
      'washer', 'bathtub', 'espresso', 'luggage', 'mountainView', 'selfCheckin',
    ],
    heroImage: 'https://a0.muscache.com/im/pictures/miso/Hosting-1011472949294454066/original/8696b0ce-8645-4551-b7e4-167f558f0bc2.jpeg?im_w=1200',
    gallery: [
      'https://a0.muscache.com/im/pictures/miso/Hosting-1011472949294454066/original/8696b0ce-8645-4551-b7e4-167f558f0bc2.jpeg?im_w=1200',
      'https://a0.muscache.com/im/pictures/miso/Hosting-1010969935135126542/original/1d621af7-bc7c-4d00-a79a-db7a97fea7c5.jpeg?im_w=1200',
      'https://a0.muscache.com/im/pictures/miso/Hosting-1011472949294454066/original/36e61d07-414d-4011-a320-7a4d0f1ab9cc.jpeg?im_w=1200',
      'https://a0.muscache.com/im/pictures/miso/Hosting-1010969935135126542/original/6f059683-e26d-47e6-9b3b-b9dbcd89b7ff.jpeg?im_w=1200',
    ],
  },
  {
    slug: 'chalten-loft-cerro-torre',
    name: 'Chaltén Loft',
    subtitle: 'Dpto 2 — Cerro Torre',
    sqm: 40,
    maxGuests: 3,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    checkIn: '16:00',
    checkOut: '10:00',
    amenities: [
      'kitchen', 'wifi', 'parking', 'pets', 'tv',
      'luggage', 'hairDryer', 'selfCheckin',
    ],
    heroImage: 'https://a0.muscache.com/im/pictures/miso/Hosting-1292195182539473607/original/e0a9cd5c-aec5-47b9-ae4b-b7257f4ae1e5.jpeg?im_w=1200',
    gallery: [
      'https://a0.muscache.com/im/pictures/miso/Hosting-1292195182539473607/original/e0a9cd5c-aec5-47b9-ae4b-b7257f4ae1e5.jpeg?im_w=1200',
      'https://a0.muscache.com/im/pictures/miso/Hosting-1292195182539473607/original/14d3fdbb-a159-4d39-8e84-8c6f1de21133.jpeg?im_w=1200',
      'https://a0.muscache.com/im/pictures/miso/Hosting-1292195182539473607/original/a70409f1-271a-4369-80d6-25690cc870e2.jpeg?im_w=1200',
      'https://a0.muscache.com/im/pictures/miso/Hosting-1292195182539473607/original/67ec68b1-f95f-4249-a51f-1d0c71159493.jpeg?im_w=1200',
      'https://a0.muscache.com/im/pictures/miso/Hosting-1292195182539473607/original/ccd51b41-79c1-4484-a13d-be13d69dc2e2.jpeg?im_w=1200',
    ],
  },
  {
    slug: 'chalten-loft-poincenot',
    name: 'Chaltén Loft',
    subtitle: 'Dpto 3 — Poincenot',
    sqm: 55,
    maxGuests: 4,
    bedrooms: 1,
    beds: 3,
    bathrooms: 1,
    checkIn: '15:00',
    checkOut: '10:00',
    amenities: [
      'kitchen', 'wifi', 'parking', 'pets', 'tv',
      'luggage', 'hairDryer', 'selfCheckin',
    ],
    heroImage: 'https://a0.muscache.com/im/pictures/miso/Hosting-1302399968522167298/original/33a9d1bb-1083-4526-a13c-a4f5728a9ad3.jpeg?im_w=1200',
    gallery: [
      'https://a0.muscache.com/im/pictures/miso/Hosting-1302399968522167298/original/33a9d1bb-1083-4526-a13c-a4f5728a9ad3.jpeg?im_w=1200',
      'https://a0.muscache.com/im/pictures/miso/Hosting-1302399968522167298/original/06bed20f-6e3c-41c9-959c-d15a14eb45a5.jpeg?im_w=1200',
      'https://a0.muscache.com/im/pictures/miso/Hosting-1302399968522167298/original/85045d71-b9de-41f0-83df-7aeeb3b7a097.jpeg?im_w=1200',
      'https://a0.muscache.com/im/pictures/miso/Hosting-1302399968522167298/original/b174b0c3-a6c7-493a-8e68-89765fa6fc6a.jpeg?im_w=1200',
      'https://a0.muscache.com/im/pictures/miso/Hosting-1302399968522167298/original/2d9242e0-9d48-477f-bd63-730b10d2eb63.jpeg?im_w=1200',
    ],
  },
]

// Hero image — Fitz Roy real photo from Wikimedia Commons (free use)
// Gabriel's own Fitz Roy photos — El Chaltén, Patagonia
export const heroImage = '/images/chalten/fitzroy-green-valley.jpeg'

// All Chaltén landscape photos for use across the site
export const chaltenPhotos = [
  '/images/chalten/fitzroy-gate-sunset.jpeg',      // Hero — tranquera + Fitz Roy atardecer
  '/images/chalten/fitzroy-green-valley.jpeg',      // Valle verde + Fitz Roy dorado
  '/images/chalten/fitzroy-sunset-road.jpeg',       // Ruta + cielo rosado
  '/images/chalten/fitzroy-river-golden.jpeg',      // Río + Fitz Roy dorado
  '/images/chalten/fitzroy-milkyway-snow.jpeg',     // Nieve + vía láctea
  '/images/chalten/fitzroy-aurora-night.jpeg',      // Aurora austral
  '/images/chalten/fitzroy-stars-closeup.jpeg',     // Fitz Roy + estrellas rojo
  '/images/chalten/fitzroy-big-waterfall.jpeg',     // Cascada grande + Fitz Roy
  '/images/chalten/fitzroy-canyon-waterfall.jpeg',   // Cañón + cascada
  '/images/chalten/fitzroy-autumn-creek.jpeg',      // Arroyo otoño + Fitz Roy
]
