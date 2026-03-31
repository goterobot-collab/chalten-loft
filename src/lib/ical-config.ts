// iCal URLs for each property — syncs availability from Airbnb
// Some apartments have multiple Airbnb listings → all listed here, deduplication handled in sync
export const icalFeeds: Record<string, string[]> = {
  'chalten-loft-fitz-roy': [
    // Listing principal (1011...)
    'https://www.airbnb.com.ar/calendar/ical/1011472949294454066.ics?t=ba2c9ce1d9164b7f9b6819364980efb3',
    // "5 estrellas" — recibe los bookings reales (Simon, Max, An)
    'https://www.airbnb.com.ar/calendar/ical/1350102501359962830.ics?t=6e766023e4314e819004a786f1fd1729',
  ],
  'chalten-loft-cerro-torre': [
    'https://www.airbnb.com.ar/calendar/ical/1310153437538596146.ics?t=2fa9f291a343401fb1afd4122305e79f',
  ],
  'chalten-loft-poincenot': [
    'https://www.airbnb.com.ar/calendar/ical/1535576347091682548.ics?t=ae02e2029d8d441f94eb56d530b629ca',
  ],
}

export type PropertySlug = keyof typeof icalFeeds
