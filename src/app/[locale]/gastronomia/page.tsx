import { setRequestLocale } from 'next-intl/server'
import { ExternalLink, Star, Clock, MapPin } from 'lucide-react'

type Props = {
  params: Promise<{ locale: string }>
}

// ── Place data ────────────────────────────────────────────────────────────────

type Tag = 'vegan' | 'vegetarian' | 'gf' | 'cashonly' | 'reservation' | 'bbq' | 'coffee' | 'pizza' | 'pasta' | 'chocolate' | 'delivery'

type Place = {
  emoji: string
  key: string
  rating: number
  reviews: number
  price: '$' | '$$' | '$$$' | '$$$$'
  closedDay?: string       // e.g. "martes" key
  tags: Tag[]
  tripadvisor?: string
  instagram?: string
  gmaps?: string
}

const RESTAURANTS: Place[] = [
  {
    emoji: '🍽️',
    key: 'tapera',
    rating: 4.4,
    reviews: 1637,
    price: '$$$',
    tags: ['vegetarian', 'vegan', 'gf', 'cashonly'],
    tripadvisor: 'https://www.tripadvisor.com/Restaurant_Review-g316035-d1738600-Reviews-La_Tapera-El_Chalten_Province_of_Santa_Cruz_Patagonia.html',
    gmaps: 'https://maps.google.com/?q=La+Tapera+El+Chalten+Argentina',
  },
  {
    emoji: '🔥',
    key: 'asadores',
    rating: 4.9,
    reviews: 86,
    price: '$$$$',
    closedDay: 'sunday',
    tags: ['bbq', 'vegetarian', 'reservation'],
    tripadvisor: 'https://www.tripadvisor.com/Restaurant_Review-g316035-d25151918-Reviews-The_Asadores-El_Chalten_Province_of_Santa_Cruz_Patagonia.html',
    instagram: 'https://www.instagram.com/theasadores/',
    gmaps: 'https://maps.google.com/?q=The+Asadores+El+Chalten+Argentina',
  },
  {
    emoji: '🍕',
    key: 'laborum',
    rating: 4.9,
    reviews: 34,
    price: '$$',
    closedDay: 'sun_mon',
    tags: ['pizza', 'vegetarian', 'cashonly', 'delivery'],
    tripadvisor: 'https://www.tripadvisor.com/Restaurant_Review-g316035-d23858526-Reviews-Laborum-El_Chalten_Province_of_Santa_Cruz_Patagonia.html',
    gmaps: 'https://maps.google.com/?q=Laborum+Pizzeria+El+Chalten+Argentina',
  },
  {
    emoji: '🥗',
    key: 'curcuma',
    rating: 4.6,
    reviews: 215,
    price: '$$',
    tags: ['vegan', 'gf', 'vegetarian'],
    tripadvisor: 'https://www.tripadvisor.com/Restaurant_Review-g316035-d9718143-Reviews-Curcuma_Cocina-El_Chalten_Province_of_Santa_Cruz_Patagonia.html',
    instagram: 'https://www.instagram.com/curcumachalten/',
    gmaps: 'https://maps.google.com/?q=Curcuma+Cocina+El+Chalten+Argentina',
  },
  {
    emoji: '🍝',
    key: 'maffia',
    rating: 4.4,
    reviews: 551,
    price: '$$$',
    tags: ['pasta', 'vegetarian', 'reservation'],
    tripadvisor: 'https://www.tripadvisor.com/Restaurant_Review-g316035-d7595641-Reviews-Maffia_Trattoria-El_Chalten_Province_of_Santa_Cruz_Patagonia.html',
    instagram: 'https://www.instagram.com/maffiatrattoria/',
    gmaps: 'https://maps.google.com/?q=Maffia+Trattoria+El+Chalten+Argentina',
  },
  {
    emoji: '🫕',
    key: 'lito',
    rating: 4.8,
    reviews: 17,
    price: '$$$$',
    tags: ['pasta', 'reservation'],
    tripadvisor: 'https://www.tripadvisor.com/Restaurant_Review-g316035-d27131791-Reviews-Lito_Restoran-El_Chalten_Province_of_Santa_Cruz_Patagonia.html',
    instagram: 'https://www.instagram.com/litorestoran/',
    gmaps: 'https://maps.google.com/?q=Lito+Restoran+El+Chalten+Argentina',
  },
]

const CAFES: Place[] = [
  {
    emoji: '🍫',
    key: 'joshaike',
    rating: 4.4,
    reviews: 107,
    price: '$$',
    closedDay: 'tuesday',
    tags: ['chocolate'],
    tripadvisor: 'https://www.tripadvisor.com/Restaurant_Review-g316035-d2542871-Reviews-La_Chocolateria_Josh_Aike-El_Chalten_Province_of_Santa_Cruz_Patagonia.html',
    instagram: 'https://www.instagram.com/lachoco.elchalten/',
    gmaps: 'https://maps.google.com/?q=La+Chocolateria+Josh+Aike+El+Chalten+Argentina',
  },
  {
    emoji: '🫖',
    key: 'mathilda',
    rating: 4.2,
    reviews: 193,
    price: '$$$',
    closedDay: 'monday',
    tags: ['vegetarian', 'coffee'],
    tripadvisor: 'https://www.tripadvisor.com/Restaurant_Review-g316035-d2051566-Reviews-Mathilda-El_Chalten_Province_of_Santa_Cruz_Patagonia.html',
    instagram: 'https://www.instagram.com/mathilda_elchalten/',
    gmaps: 'https://maps.google.com/?q=Mathilda+El+Chalten+Argentina',
  },
  {
    emoji: '☕',
    key: 'paisa',
    rating: 4.9,
    reviews: 62,
    price: '$$',
    closedDay: 'tuesday',
    tags: ['coffee', 'vegetarian', 'vegan', 'gf'],
    tripadvisor: 'https://www.tripadvisor.com/Restaurant_Review-g316035-d25151918-Reviews',
    instagram: 'https://www.instagram.com/paisa.hmc/',
    gmaps: 'https://maps.google.com/?q=Paisa+High+Mountain+Coffee+El+Chalten+Argentina',
  },
  {
    emoji: '🍬',
    key: 'chaltenos',
    rating: 4.8,
    reviews: 136,
    price: '$$',
    tags: ['chocolate'],
    tripadvisor: 'https://www.tripadvisor.com/Restaurant_Review-g316035-d9712347-Reviews-Chaltenos-El_Chalten_Province_of_Santa_Cruz_Patagonia.html',
    instagram: 'https://www.instagram.com/chaltenos/',
    gmaps: 'https://maps.google.com/?q=Chalte%C3%B1os+El+Chalten+Argentina',
  },
  {
    emoji: '📚',
    key: 'esquina',
    rating: 4.9,
    reviews: 23,
    price: '$$',
    closedDay: 'monday',
    tags: ['coffee', 'vegetarian'],
    tripadvisor: 'https://www.tripadvisor.com/Restaurant_Review-g316035-d24944313-Reviews-La_Esquina_Chalten-El_Chalten_Province_of_Santa_Cruz_Patagonia.html',
    instagram: 'https://www.instagram.com/laesquinachalten/',
    gmaps: 'https://maps.google.com/?q=La+Esquina+Chalten+El+Chalten+Argentina',
  },
  {
    emoji: '🎂',
    key: 'memes',
    rating: 4.8,
    reviews: 13,
    price: '$',
    tags: ['chocolate'],
    tripadvisor: 'https://www.tripadvisor.com/Restaurant_Review-g316035-d23961843-Reviews-Meme_s_Cakes-El_Chalten_Province_of_Santa_Cruz_Patagonia.html',
    gmaps: 'https://maps.google.com/?q=Memes+Cakes+El+Chalten+Argentina',
  },
]

// ── i18n ──────────────────────────────────────────────────────────────────────

type Locale = 'es' | 'en' | 'pt' | 'fr' | 'de' | 'ko' | 'ja' | 'zh'

const T: Record<string, Record<string, string>> = {
  tagline:       { es:'Gastronomía Local', en:'Local Food Guide', pt:'Gastronomia Local', fr:'Gastronomie Locale', de:'Lokale Gastronomie', ko:'현지 맛집 가이드', ja:'地元グルメガイド', zh:'当地美食指南' },
  heroTitle:     { es:'¡Explora los Sabores\nde Chaltén!', en:'Explore the Flavors\nof Chaltén!', pt:'Explore os Sabores\nde Chaltén!', fr:'Explorez les Saveurs\nde Chaltén !', de:'Entdecke die Aromen\nvon Chaltén!', ko:'찰텐의 맛을\n탐험하세요!', ja:'チャルテンの\n味を探索しよう！', zh:'探索查尔腾\n的美食风味！' },
  heroSub:       { es:'Desde Chaltén Loft queremos que aproveches al máximo tu estadía. Acá van nuestros lugares favoritos, elegidos por la comunidad local y con miles de reseñas que respaldan cada recomendación.', en:'From Chaltén Loft we want you to make the most of your stay. Here are our favorite spots, chosen by the local community and backed by thousands of reviews.', pt:'Do Chaltén Loft queremos que você aproveite ao máximo sua estadia. Aqui estão nossos lugares favoritos, escolhidos pela comunidade local e respaldados por milhares de avaliações.', fr:"Depuis Chaltén Loft, nous voulons que vous profitiez au maximum de votre séjour. Voici nos endroits préférés, choisis par la communauté locale et soutenus par des milliers d'avis.", de:'Von Chaltén Loft aus möchten wir, dass Sie Ihren Aufenthalt in vollen Zügen genießen. Hier sind unsere Lieblingsorte, von der lokalen Gemeinschaft ausgewählt und durch tausende Bewertungen unterstützt.', ko:'찰텐 로프트에서 여러분의 체류를 최대한 즐기시길 바랍니다. 현지 커뮤니티가 선정하고 수천 개의 리뷰가 뒷받침하는 즐겨 찾는 장소들을 소개합니다.', ja:'チャルテン・ロフトから、滞在を最大限に楽しんでいただきたいと思います。地域コミュニティが選び、何千ものレビューが裏付けるお気に入りの場所をご紹介します。', zh:'从查尔腾阁楼出发，我们希望您充分享受住宿体验。以下是我们最喜爱的地方，由当地社区精选，并有数千条评价作为支撑。' },
  restTitle:     { es:'Restaurantes', en:'Restaurants', pt:'Restaurantes', fr:'Restaurants', de:'Restaurants', ko:'레스토랑', ja:'レストラン', zh:'餐厅' },
  restSub:       { es:'Cocina argentina, italiana y vegana para todos los gustos. Muchos se llenan rápido — reservar es esencial.', en:'Argentine, Italian, and vegan cuisine for every taste. Many fill up fast — reservations are essential.', pt:'Cozinha argentina, italiana e vegana para todos os gostos. Muitos lotam rápido — reservar é essencial.', fr:'Cuisine argentine, italienne et végane pour tous les goûts. Beaucoup se remplissent vite — la réservation est essentielle.', de:'Argentinische, italienische und vegane Küche für jeden Geschmack. Viele füllen sich schnell — Reservierungen sind unerlässlich.', ko:'모든 취향을 위한 아르헨티나, 이탈리아, 비건 요리. 많은 곳이 빨리 차므로 예약이 필수입니다.', ja:'すべての好みに合ったアルゼンチン料理、イタリア料理、ビーガン料理。多くのお店はすぐに満席になるため予約が必須です。', zh:'适合各种口味的阿根廷、意大利和纯素料理。很多地方很快就座满——提前预订至关重要。' },
  cafeTitle:     { es:'Cafeterías & Casas de Té', en:'Cafés & Tea Houses', pt:'Cafeterias & Casas de Chá', fr:'Cafés & Salons de Thé', de:'Cafés & Teestuben', ko:'카페 & 티하우스', ja:'カフェ＆ティーハウス', zh:'咖啡馆 & 茶室' },
  cafeSub:       { es:'Para el desayuno post-trekking, la pausa del mediodía o el capricho de las 16h. Algunos de los mejores cafés especializados de la Patagonia.', en:'For post-trek breakfast, a midday break, or a 4pm treat. Some of the best specialty coffees in Patagonia.', pt:'Para o café da manhã pós-trekking, a pausa do meio-dia ou o capricho das 16h. Alguns dos melhores cafés especializados da Patagônia.', fr:'Pour le petit-déjeuner post-trek, la pause déjeuner ou la gourmandise de 16h. Certains des meilleurs cafés de spécialité de Patagonie.', de:'Für das Post-Trek-Frühstück, eine Mittagspause oder einen 16-Uhr-Genuss. Einige der besten Spezialitätenkaffees Patagoniens.', ko:'트레킹 후 아침 식사, 점심 휴식, 오후 4시 간식을 위한 곳. 파타고니아 최고의 스페셜티 커피 중 일부입니다.', ja:'トレッキング後の朝食、昼の休憩、午後4時のおやつのために。パタゴニア屈指のスペシャルティコーヒーが楽しめます。', zh:'用于徒步后的早餐、午间休息或下午4点的美食。巴塔哥尼亚最好的精品咖啡之一。' },
  tipsTitle:     { es:'Consejos prácticos', en:'Practical tips', pt:'Dicas práticas', fr:'Conseils pratiques', de:'Praktische Tipps', ko:'실용적인 팁', ja:'実用的なヒント', zh:'实用提示' },
  ctaTitle:      { es:'¿Querés más recomendaciones?', en:'Want more recommendations?', pt:'Quer mais recomendações?', fr:'Vous voulez plus de recommandations ?', de:'Möchten Sie weitere Empfehlungen?', ko:'더 많은 추천을 원하시나요?', ja:'もっとおすすめが知りたいですか？', zh:'想要更多推荐吗？' },
  ctaBody:       { es:'Somos locales y conocemos cada rincón del pueblo. Escribinos por WhatsApp y te recomendamos según tus gustos y los días disponibles.', en:"We're locals and know every corner of the village. Message us on WhatsApp and we'll recommend based on your tastes and available days.", pt:'Somos locais e conhecemos cada cantinho do vilarejo. Escreva para nós no WhatsApp e recomendamos de acordo com seus gostos e dias disponíveis.', fr:"Nous sommes locaux et connaissons chaque recoin du village. Écrivez-nous sur WhatsApp et nous vous recommanderons selon vos goûts.", de:'Wir sind Einheimische und kennen jeden Winkel des Dorfes. Schreiben Sie uns auf WhatsApp für persönliche Empfehlungen.', ko:'우리는 마을의 구석구석을 아는 현지인입니다. WhatsApp으로 메시지를 보내주시면 취향에 맞게 추천해 드립니다.', ja:'私たちは地元民で、村のすみずみを知っています。WhatsAppでメッセージをいただければ、好みに合わせてお勧めします。', zh:'我们是当地人，了解村子的每个角落。通过WhatsApp联系我们，我们将根据您的口味和可用天数提供推荐。' },
  ctaButton:     { es:'Consultanos por WhatsApp', en:'Ask us on WhatsApp', pt:'Fale conosco pelo WhatsApp', fr:'Contactez-nous sur WhatsApp', de:'Fragen Sie uns auf WhatsApp', ko:'WhatsApp으로 문의하기', ja:'WhatsAppでお問い合わせ', zh:'通过WhatsApp咨询' },
  reviews:       { es:'reseñas', en:'reviews', pt:'avaliações', fr:'avis', de:'Bewertungen', ko:'리뷰', ja:'件のレビュー', zh:'条评价' },
  closed:        { es:'Cerrado los', en:'Closed on', pt:'Fechado às', fr:'Fermé le', de:'Geschlossen am', ko:'휴무일:', ja:'定休日:', zh:'休息日：' },
  sunday:        { es:'domingos', en:'Sundays', pt:'domingos', fr:'dimanches', de:'Sonntagen', ko:'일요일', ja:'日曜日', zh:'周日' },
  monday:        { es:'lunes', en:'Mondays', pt:'segundas', fr:'lundis', de:'Montagen', ko:'월요일', ja:'月曜日', zh:'周一' },
  tuesday:       { es:'martes', en:'Tuesdays', pt:'terças', fr:'mardis', de:'Dienstagen', ko:'화요일', ja:'火曜日', zh:'周二' },
  sun_mon:       { es:'domingos y lunes', en:'Sundays & Mondays', pt:'domingos e segundas', fr:'dimanches et lundis', de:'Sonn- und Montagen', ko:'일요일 · 월요일', ja:'日・月曜日', zh:'周日和周一' },
  tagVegan:      { es:'Vegano', en:'Vegan', pt:'Vegano', fr:'Végane', de:'Vegan', ko:'비건', ja:'ヴィーガン', zh:'纯素' },
  tagVegetarian: { es:'Vegetariano', en:'Vegetarian', pt:'Vegetariano', fr:'Végétarien', de:'Vegetarisch', ko:'채식', ja:'ベジタリアン', zh:'素食' },
  tagGF:         { es:'Sin Gluten', en:'Gluten Free', pt:'Sem Glúten', fr:'Sans Gluten', de:'Glutenfrei', ko:'글루텐 프리', ja:'グルテンフリー', zh:'无麸质' },
  tagCash:       { es:'Solo Efectivo', en:'Cash Only', pt:'Só Dinheiro', fr:'Espèces Seulement', de:'Nur Bargeld', ko:'현금만 가능', ja:'現金のみ', zh:'仅收现金' },
  tagReservation:{ es:'Reserva Requerida', en:'Reservation Required', pt:'Reserva Necessária', fr:'Réservation Requise', de:'Reservierung Erforderlich', ko:'예약 필수', ja:'要予約', zh:'需要预订' },
  tagBBQ:        { es:'Parrilla', en:'Grill / BBQ', pt:'Churrasco', fr:'Grill / BBQ', de:'Grill / BBQ', ko:'바베큐', ja:'BBQ', zh:'烤肉' },
  tagCoffee:     { es:'Café de Especialidad', en:'Specialty Coffee', pt:'Café Especial', fr:'Café de Spécialité', de:'Spezialitätenkaffee', ko:'스페셜티 커피', ja:'スペシャルティコーヒー', zh:'精品咖啡' },
  tagPizza:      { es:'Pizza Masa Madre', en:'Sourdough Pizza', pt:'Pizza Fermentação Natural', fr:'Pizza au Levain', de:'Sauerteig-Pizza', ko:'사워도우 피자', ja:'サワードウピザ', zh:'酸面团披萨' },
  tagPasta:      { es:'Pasta Artesanal', en:'Handmade Pasta', pt:'Massa Artesanal', fr:'Pâtes Maison', de:'Handgemachte Pasta', ko:'수제 파스타', ja:'手打ちパスタ', zh:'手工面食' },
  tagChocolate:  { es:'Chocolates Artesanales', en:'Artisan Chocolates', pt:'Chocolates Artesanais', fr:'Chocolats Artisanaux', de:'Handgefertigte Schokoladen', ko:'수제 초콜릿', ja:'職人チョコレート', zh:'手工巧克力' },
  tagDelivery:   { es:'Delivery', en:'Delivery', pt:'Delivery', fr:'Livraison', de:'Lieferung', ko:'배달', ja:'デリバリー', zh:'外卖' },
  tripadvisor:   { es:'Ver en TripAdvisor', en:'See on TripAdvisor', pt:'Ver no TripAdvisor', fr:'Voir sur TripAdvisor', de:'Auf TripAdvisor', ko:'TripAdvisor에서 보기', ja:'TripAdvisorで見る', zh:'在TripAdvisor查看' },
  gmaps:         { es:'Ver en Google Maps', en:'See on Google Maps', pt:'Ver no Google Maps', fr:'Voir sur Google Maps', de:'Auf Google Maps', ko:'Google 지도에서 보기', ja:'Google マップで見る', zh:'在Google地图查看' },
  instagramLink: { es:'Ver Instagram', en:'See Instagram', pt:'Ver Instagram', fr:'Voir Instagram', de:'Instagram ansehen', ko:'인스타그램 보기', ja:'Instagramを見る', zh:'查看Instagram' },
}

const TAG_COLORS: Record<Tag, string> = {
  vegan: 'bg-green-100 text-green-800',
  vegetarian: 'bg-lime-100 text-lime-800',
  gf: 'bg-yellow-100 text-yellow-800',
  cashonly: 'bg-orange-100 text-orange-800',
  reservation: 'bg-blue-100 text-blue-800',
  bbq: 'bg-red-100 text-red-800',
  coffee: 'bg-amber-100 text-amber-800',
  pizza: 'bg-rose-100 text-rose-800',
  pasta: 'bg-orange-100 text-orange-800',
  chocolate: 'bg-stone-100 text-stone-800',
  delivery: 'bg-purple-100 text-purple-800',
}

const TAG_KEYS: Record<Tag, string> = {
  vegan: 'tagVegan',
  vegetarian: 'tagVegetarian',
  gf: 'tagGF',
  cashonly: 'tagCash',
  reservation: 'tagReservation',
  bbq: 'tagBBQ',
  coffee: 'tagCoffee',
  pizza: 'tagPizza',
  pasta: 'tagPasta',
  chocolate: 'tagChocolate',
  delivery: 'tagDelivery',
}

// Per-place copy in all locales
const PLACE_COPY: Record<string, Record<string, { name: string; desc: string; highlight: string }>> = {
  tapera: {
    es: { name: 'La Tapera', desc: 'El restaurante más querido del pueblo. Cocina argentina auténtica con opciones vegetarianas y veganas igual de deliciosas. El dueño recibe personalmente a cada mesa. Solo efectivo.', highlight: 'Reservá con anticipación — suele estar lleno desde el mediodía' },
    en: { name: 'La Tapera', desc: 'The most beloved restaurant in town. Authentic Argentine cuisine with equally delicious vegetarian and vegan options. The owner personally welcomes each table. Cash only.', highlight: 'Book ahead — it fills up from noon' },
    pt: { name: 'La Tapera', desc: 'O restaurante mais querido da cidade. Culinária argentina autêntica com opções vegetarianas e veganas igualmente deliciosas. O proprietário recebe pessoalmente cada mesa. Somente dinheiro.', highlight: 'Reserve com antecedência — costuma estar lotado desde o meio-dia' },
    fr: { name: 'La Tapera', desc: "Le restaurant le plus aimé du village. Cuisine argentine authentique avec des options végétariennes et véganes tout aussi délicieuses. Le propriétaire accueille personnellement chaque table. Espèces uniquement.", highlight: 'Réservez à l\'avance — il est souvent plein dès midi' },
    de: { name: 'La Tapera', desc: 'Das beliebteste Restaurant im Ort. Authentische argentinische Küche mit ebenso köstlichen vegetarischen und veganen Optionen. Der Besitzer begrüßt jeden Tisch persönlich. Nur Bargeld.', highlight: 'Im Voraus reservieren — ab Mittag meist voll' },
    ko: { name: 'La Tapera', desc: '마을에서 가장 사랑받는 레스토랑. 채식·비건 옵션도 동등하게 맛있는 정통 아르헨티나 요리. 주인이 직접 각 테이블을 맞이합니다. 현금만 가능.', highlight: '미리 예약하세요 — 정오부터 꽉 차는 경우가 많습니다' },
    ja: { name: 'La Tapera', desc: '町で最も愛されているレストラン。ベジタリアン・ヴィーガンオプションも同じく美味しい本格アルゼンチン料理。オーナーが直接各テーブルをお迎えします。現金のみ。', highlight: '事前予約を — 正午から満席になることが多い' },
    zh: { name: 'La Tapera', desc: '镇上最受欢迎的餐厅。正宗的阿根廷料理，素食和纯素选项同样美味。老板亲自迎接每桌客人。仅收现金。', highlight: '提前预订——通常从中午开始就已满座' },
  },
  asadores: {
    es: { name: 'The Asadores', desc: 'La experiencia de parrilla más destacada del Chaltén. Menú de pasos fijo (3 o 5 tiempos) con carnes a la leña y opciones vegetarianas. Ambiente íntimo, platos cuidados al detalle.', highlight: 'Agenda con días de anticipación — solo abren de lunes a sábado' },
    en: { name: 'The Asadores', desc: 'The most outstanding grill experience in Chaltén. Fixed tasting menu (3 or 5 courses) with wood-fire meats and vegetarian options. Intimate setting with meticulously prepared dishes.', highlight: 'Book days ahead — open Monday to Saturday only' },
    pt: { name: 'The Asadores', desc: 'A experiência de churrasco mais destacada do Chaltén. Menu fixo de etapas (3 ou 5 tempos) com carnes na lenha e opções vegetarianas. Ambiente íntimo, pratos elaborados em detalhes.', highlight: 'Reserve com dias de antecedência — aberto de segunda a sábado' },
    fr: { name: 'The Asadores', desc: 'La meilleure expérience de grill à Chaltén. Menu dégustation fixe (3 ou 5 plats) avec viandes au bois et options végétariennes. Cadre intimiste, plats soignés dans les détails.', highlight: 'Réservez plusieurs jours à l\'avance — ouvert du lundi au samedi' },
    de: { name: 'The Asadores', desc: 'Das herausragendste Grillerlebnis in Chaltén. Festes Degustationsmenü (3 oder 5 Gänge) mit Holzfeuer-Fleisch und vegetarischen Optionen. Intimes Ambiente, sorgfältig zubereitete Gerichte.', highlight: 'Tage im Voraus buchen — nur Montag bis Samstag geöffnet' },
    ko: { name: 'The Asadores', desc: '찰텐에서 가장 뛰어난 그릴 경험. 나무 불에 구운 고기와 채식 옵션이 포함된 고정 테이스팅 메뉴(3 또는 5코스). 아늑한 분위기와 세심하게 준비된 요리.', highlight: '며칠 전에 예약하세요 — 월요일부터 토요일만 영업' },
    ja: { name: 'The Asadores', desc: 'チャルテンで最も際立つグリル体験。薪火の肉とベジタリアンオプションを含む固定テイスティングメニュー（3または5コース）。親密な雰囲気と丁寧に仕上げた料理。', highlight: '数日前から予約を — 月〜土曜のみ営業' },
    zh: { name: 'The Asadores', desc: '查尔腾最出色的烤肉体验。固定品鉴菜单（3或5道菜），提供柴火烤肉和素食选项。温馨氛围，精心烹制的菜肴。', highlight: '提前几天预订——仅周一至周六营业' },
  },
  laborum: {
    es: { name: 'Laborum', desc: 'Pizzas de masa madre con fermentación natural y toppings creativos. Solo hacen 60 pizzas por noche — si llegás a las 20h puede que no haya más. Delivery y take-away disponibles.', highlight: 'Llegá temprano o avisá por delivery — no hay segundo turno' },
    en: { name: 'Laborum', desc: 'Sourdough pizzas with natural fermentation and creative toppings. Only 60 pizzas per night — arrive by 8pm or there may be none left. Delivery and take-away available.', highlight: 'Arrive early or order delivery — no second service' },
    pt: { name: 'Laborum', desc: 'Pizzas de massa madre com fermentação natural e coberturas criativas. Apenas 60 pizzas por noite — se você chegar às 20h pode não restar mais. Delivery e take-away disponíveis.', highlight: 'Chegue cedo ou peça por delivery — não há segundo turno' },
    fr: { name: 'Laborum', desc: 'Pizzas au levain avec fermentation naturelle et garnitures créatives. Seulement 60 pizzas par soir — si vous arrivez à 20h il n\'en restera peut-être plus. Livraison et à emporter disponibles.', highlight: 'Arrivez tôt ou commandez en livraison — pas de second service' },
    de: { name: 'Laborum', desc: 'Sauerteig-Pizzen mit natürlicher Fermentation und kreativen Belägen. Nur 60 Pizzen pro Abend — um 20 Uhr kann es vorbei sein. Lieferung und Take-away verfügbar.', highlight: 'Früh kommen oder Lieferung bestellen — kein zweiter Service' },
    ko: { name: 'Laborum', desc: '자연 발효 사워도우와 창의적인 토핑의 피자. 하룻밤 60판만 준비 — 저녁 8시에 도착하면 없을 수도 있습니다. 배달 및 포장 가능.', highlight: '일찍 가거나 배달 주문하세요 — 2부 없음' },
    ja: { name: 'Laborum', desc: '天然発酵のサワードウとクリエイティブなトッピングのピザ。1夜60枚のみ — 20時到着時には売り切れの可能性も。デリバリーとテイクアウト可能。', highlight: '早めに行くかデリバリーを — 2部制なし' },
    zh: { name: 'Laborum', desc: '天然发酵酸面团披萨，配以创意配料。每晚仅供60张披萨——晚上8点到达时可能已经售完。提供外卖和自取服务。', highlight: '尽早到达或点外卖——没有第二轮服务' },
  },
  curcuma: {
    es: { name: 'Cúrcuma Cocina', desc: '100% vegano y sin gluten. Platos frescos y coloridos preparados al momento. Hacen viandas especiales para trekking con un día de anticipación — una joya para caminantes.', highlight: 'Pedí tu vianda de trekking con 24 hs de anticipación' },
    en: { name: 'Cúrcuma Cocina', desc: '100% vegan and gluten-free. Fresh, colorful dishes made to order. They prepare special trekking lunches with one day\'s notice — a gem for hikers.', highlight: 'Order your trekking lunch box 24 hours in advance' },
    pt: { name: 'Cúrcuma Cocina', desc: '100% vegano e sem glúten. Pratos frescos e coloridos preparados na hora. Fazem marmitas especiais para trekking com um dia de antecedência — uma joia para caminhantes.', highlight: 'Peça sua marmita de trekking com 24h de antecedência' },
    fr: { name: 'Cúrcuma Cocina', desc: '100% végane et sans gluten. Plats frais et colorés préparés à la commande. Ils préparent des repas spéciaux pour le trekking avec un jour de préavis — une pépite pour les randonneurs.', highlight: 'Commandez votre panier de trekking 24h à l\'avance' },
    de: { name: 'Cúrcuma Cocina', desc: '100% vegan und glutenfrei. Frische, bunte Gerichte nach Bestellung zubereitet. Sie bereiten spezielle Trek-Mahlzeiten mit einem Tag Voranmeldung vor — ein Juwel für Wanderer.', highlight: 'Trek-Lunchpaket 24 Stunden im Voraus bestellen' },
    ko: { name: 'Cúrcuma Cocina', desc: '100% 비건 및 글루텐 프리. 주문 즉시 만드는 신선하고 다채로운 요리. 하루 전 예약으로 특별 트레킹 도시락 준비 — 등산객들에게 최고.', highlight: '트레킹 도시락은 24시간 전에 주문하세요' },
    ja: { name: 'Cúrcuma Cocina', desc: '100%ヴィーガン＆グルテンフリー。注文を受けてから作る新鮮でカラフルな料理。前日予約でトレッキング専用ランチボックスも用意 — ハイカーにとっての宝石。', highlight: 'トレッキングランチは24時間前に注文を' },
    zh: { name: 'Cúrcuma Cocina', desc: '100%纯素和无麸质。按需现做的新鲜多彩菜肴。提前一天预订可准备特别的徒步午餐——徒步者的瑰宝。', highlight: '徒步午餐盒需提前24小时预订' },
  },
  maffia: {
    es: { name: 'Maffia Trattoria', desc: 'Pastas artesanales con casi 15 años de historia. Ravioles de ossobuco, sorrentinos y spaghetti que no defraudan. Reservas solo por WhatsApp — se llena rápido.', highlight: 'Mandá WhatsApp temprano ese día para reservar' },
    en: { name: 'Maffia Trattoria', desc: 'Handmade pasta with nearly 15 years of history. Ossobuco ravioli, sorrentinos, and spaghetti that never disappoint. Reservations by WhatsApp only — fills up fast.', highlight: 'Send a WhatsApp early that day to book' },
    pt: { name: 'Maffia Trattoria', desc: 'Massas artesanais com quase 15 anos de história. Ravioles de ossobuco, sorrentinos e spaghetti que não decepcionam. Reservas apenas por WhatsApp — lota rápido.', highlight: 'Mande um WhatsApp cedo naquele dia para reservar' },
    fr: { name: 'Maffia Trattoria', desc: "Pâtes artisanales avec près de 15 ans d'histoire. Ravioles à l'ossobuco, sorrentinos et spaghetti qui ne déçoivent jamais. Réservations uniquement par WhatsApp — se remplit vite.", highlight: 'Envoyez un WhatsApp tôt ce jour-là pour réserver' },
    de: { name: 'Maffia Trattoria', desc: 'Handgemachte Pasta mit fast 15 Jahren Geschichte. Ossobuco-Ravioli, Sorrentinos und Spaghetti, die nie enttäuschen. Reservierungen nur per WhatsApp — füllt sich schnell.', highlight: 'Früh an dem Tag eine WhatsApp senden, um zu reservieren' },
    ko: { name: 'Maffia Trattoria', desc: '거의 15년 역사의 수제 파스타. 실망시키지 않는 오소부코 라비올리, 소렌티노스, 스파게티. 예약은 WhatsApp으로만 — 빨리 차므로.', highlight: '당일 아침 일찍 WhatsApp으로 예약하세요' },
    ja: { name: 'Maffia Trattoria', desc: 'ほぼ15年の歴史を持つ手打ちパスタ。失望させないオッソブーコラビオリ、ソレンティーノス、スパゲッティ。予約はWhatsAppのみ — すぐ満席に。', highlight: '当日早めにWhatsAppで予約を' },
    zh: { name: 'Maffia Trattoria', desc: '近15年历史的手工面食。不会令人失望的炖牛腱馄饨、索伦蒂诺斯和意大利面。仅接受WhatsApp预订——很快就满座。', highlight: '当天早上尽早通过WhatsApp预订' },
  },
  joshaike: {
    es: { name: 'La Chocolatería Josh Aike', desc: 'Delicatessen pura en un local de madera con piso de piedra. Chocolates artesanales con vista al Fitz Roy desde el mezzanine. Los alfajores y el chocolate caliente son legendarios.', highlight: 'Subí al mezzanine para la vista más romántica del pueblo' },
    en: { name: 'La Chocolatería Josh Aike', desc: 'Pure indulgence in a wooden café with stone floors. Artisan chocolates with a Fitz Roy view from the mezzanine. The alfajores and hot chocolate are legendary.', highlight: 'Head up to the mezzanine for the most romantic view in town' },
    pt: { name: 'La Chocolatería Josh Aike', desc: 'Pura indulgência em um local de madeira com piso de pedra. Chocolates artesanais com vista para o Fitz Roy do mezanino. Os alfajores e o chocolate quente são lendários.', highlight: 'Suba ao mezanino para a vista mais romântica da cidade' },
    fr: { name: 'La Chocolatería Josh Aike', desc: 'Pure gourmandise dans un café en bois au sol de pierre. Chocolats artisanaux avec vue sur le Fitz Roy depuis la mezzanine. Les alfajores et le chocolat chaud sont légendaires.', highlight: 'Montez à la mezzanine pour la vue la plus romantique du village' },
    de: { name: 'La Chocolatería Josh Aike', desc: 'Purer Genuss in einem Holzcafé mit Steinboden. Handgemachte Schokoladen mit Fitz Roy-Blick von der Galerie. Die Alfajores und die heiße Schokolade sind legendär.', highlight: 'Für den romantischsten Ausblick im Ort die Galerie aufsuchen' },
    ko: { name: 'La Chocolatería Josh Aike', desc: '돌 바닥의 목조 카페에서의 순수한 즐거움. 메자닌에서 피츠 로이 전망과 함께 즐기는 수제 초콜릿. 알파호레스와 핫 초콜릿은 전설적입니다.', highlight: '마을에서 가장 낭만적인 전망을 위해 메자닌으로 올라가세요' },
    ja: { name: 'La Chocolatería Josh Aike', desc: '石の床の木造カフェで純粋な至福。メザニンからフィッツロイを望みながら楽しむ職人チョコレート。アルファホレスとホットチョコレートは伝説的。', highlight: '町で最もロマンティックな眺めはメザニンから' },
    zh: { name: 'La Chocolatería Josh Aike', desc: '石地板木质咖啡馆中的纯粹享受。在夹层楼欣赏菲茨罗伊风景并品尝手工巧克力。阿尔法乔雷斯和热可可堪称传奇。', highlight: '去夹层楼欣赏小镇最浪漫的风景' },
  },
  mathilda: {
    es: { name: 'Matilda', desc: 'Casa de té acogedora con sofás en planta alta, terraza y WiFi. Popular con trekkers en modo pausa. Buena selección de tés, lattes y platos para el almuerzo. Pet-friendly.', highlight: 'Los sillones del primer piso son el mejor refugio post-trekking' },
    en: { name: 'Matilda', desc: 'Cozy tea house with upstairs sofas, terrace, and WiFi. Popular with trekkers taking a break. Good selection of teas, lattes, and lunch dishes. Pet-friendly.', highlight: 'The upstairs armchairs are the best post-trekking refuge' },
    pt: { name: 'Matilda', desc: 'Casa de chá aconchegante com sofás no andar de cima, terraço e WiFi. Popular entre os caminhantes em pausa. Boa seleção de chás, lattes e pratos para o almoço. Pet-friendly.', highlight: 'As poltronas do primeiro andar são o melhor refúgio pós-trekking' },
    fr: { name: 'Matilda', desc: 'Salon de thé cosy avec canapés à l\'étage, terrasse et WiFi. Populaire auprès des randonneurs en pause. Bonne sélection de thés, lattes et plats déjeuner. Animaux bienvenus.', highlight: 'Les fauteuils du premier étage sont le meilleur refuge post-trek' },
    de: { name: 'Matilda', desc: 'Gemütliche Teestube mit Sofas im Obergeschoss, Terrasse und WLAN. Beliebt bei Wanderern in der Pause. Gute Auswahl an Tees, Lattes und Mittagsgerichten. Haustierfreundlich.', highlight: 'Die Sessel im Obergeschoss sind das beste Post-Trek-Refugium' },
    ko: { name: 'Matilda', desc: '2층 소파, 테라스, WiFi를 갖춘 아늑한 티하우스. 휴식 중인 트레커들에게 인기. 다양한 티, 라테, 점심 요리 제공. 반려동물 가능.', highlight: '2층 안락의자는 트레킹 후 최고의 피난처' },
    ja: { name: 'Matilda', desc: '上階にソファ、テラス、WiFiを備えた居心地の良いティーハウス。休憩中のトレッカーに人気。豊富なティー、ラテ、ランチメニュー。ペット可。', highlight: '2階のアームチェアはトレッキング後の最高の避難所' },
    zh: { name: 'Matilda', desc: '舒适的茶室，楼上有沙发、露台和WiFi。深受休息中的徒步者喜爱。提供丰富的茶饮、拿铁和午餐菜肴。宠物友好。', highlight: '二楼的扶手椅是徒步后最好的避风港' },
  },
  paisa: {
    es: { name: 'Paisa High Mountain Coffee', desc: 'El primer café de especialidad de El Chaltén. Granos de origen colombiano, brasileño y Papua Nueva Guinea. Arepa paisa, bruschettas y pasteles caseros. Happy hour de 15 a 17h.', highlight: 'El mejor espresso de toda la Patagonia — en serio' },
    en: { name: 'Paisa High Mountain Coffee', desc: 'El Chaltén\'s first specialty coffee shop. Colombian, Brazilian and Papua New Guinea single-origin beans. Arepa paisa, bruschettas and homemade pastries. Happy hour 3–5pm.', highlight: 'The best espresso in all of Patagonia — seriously' },
    pt: { name: 'Paisa High Mountain Coffee', desc: 'A primeira cafeteria de especialidade de El Chaltén. Grãos de origem única da Colômbia, Brasil e Papua Nova Guiné. Arepa paisa, bruschettas e doces caseiros. Happy hour das 15h às 17h.', highlight: 'O melhor espresso de toda a Patagônia — sério' },
    fr: { name: 'Paisa High Mountain Coffee', desc: 'Le premier café de spécialité d\'El Chaltén. Grains d\'origine unique de Colombie, Brésil et Papouasie-Nouvelle-Guinée. Arepa paisa, bruschettas et pâtisseries maison. Happy hour de 15h à 17h.', highlight: 'Le meilleur espresso de toute la Patagonie — vraiment' },
    de: { name: 'Paisa High Mountain Coffee', desc: 'El Cháltens erstes Spezialitätenkaffeehaus. Bohnen aus Kolumbien, Brasilien und Papua-Neuguinea. Arepa paisa, Bruschetta und hausgemachtes Gebäck. Happy Hour 15–17 Uhr.', highlight: 'Der beste Espresso ganz Patagoniens — wirklich' },
    ko: { name: 'Paisa High Mountain Coffee', desc: '엘 찰텐 최초의 스페셜티 커피숍. 콜롬비아, 브라질, 파푸아뉴기니 싱글 오리진 원두. 아레파 파이사, 브루스케타, 수제 패스트리. 오후 3-5시 해피아워.', highlight: '파타고니아 전체 최고의 에스프레소 — 진심' },
    ja: { name: 'Paisa High Mountain Coffee', desc: 'エル・チャルテン初のスペシャルティコーヒーショップ。コロンビア、ブラジル、パプアニューギニアのシングルオリジン豆。アレパ・パイサ、ブルスケッタ、手作りペストリー。ハッピーアワー15〜17時。', highlight: 'パタゴニア全土で最高のエスプレッソ — 本当に' },
    zh: { name: 'Paisa High Mountain Coffee', desc: '查尔腾第一家精品咖啡店。来自哥伦比亚、巴西和巴布亚新几内亚的单一产地咖啡豆。传统薄饼、布鲁斯凯塔和手工糕点。下午3-5点欢乐时光。', highlight: '整个巴塔哥尼亚最好的意式浓缩咖啡——真的' },
  },
  destino: {
    es: { name: 'Destino Restó', desc: 'Cocina de autor patagónica con productos de temporada y huerta propia. Trucha, pappardelle con estofado de cordero, bondiola, ragout de ternera con spetzel y postres de pastelero propio con flores comestibles. Alta cocina en el fin del mundo.', highlight: 'La experiencia gastronómica más sofisticada del pueblo' },
    en: { name: 'Destino Restó', desc: 'Patagonian chef\'s cuisine with seasonal products and their own vegetable garden. Trout, pappardelle with lamb stew, pork, veal ragout with spetzle and pastry chef desserts with edible flowers. Fine dining at the end of the world.', highlight: 'The most sophisticated dining experience in the village' },
    pt: { name: 'Destino Restó', desc: 'Cozinha autoral patagônica com produtos de temporada e horta própria. Trucha, pappardelle com estufado de cordeiro, bondiola, ragout de vitela com spetzel e sobremesas de confeiteiro com flores comestíveis. Alta cozinha no fim do mundo.', highlight: 'A experiência gastronômica mais sofisticada do vilarejo' },
    fr: { name: 'Destino Restó', desc: 'Cuisine d\'auteur patagonienne avec produits de saison et potager maison. Truite, pappardelle à l\'agneau, bondiola, ragout de veau et desserts du pâtissier maison avec fleurs comestibles. Grande cuisine au bout du monde.', highlight: 'L\'expérience gastronomique la plus sophistiquée du village' },
    de: { name: 'Destino Restó', desc: 'Patagonische Autorenküche mit Saisonprodukten und eigenem Gemüsegarten. Forelle, Pappardelle mit Lammragù, Bondiola, Kalbsragout mit Spätzle und Pâtisserie-Desserts mit essbaren Blüten. Fine Dining am Ende der Welt.', highlight: 'Das ausgefeilteste Restauranterlebnis im Dorf' },
    ko: { name: 'Destino Restó', desc: '계절 식재료와 자체 채소밭을 활용한 파타고니아 셰프 요리. 송어, 양고기 스튜 파파르델레, 본디올라, 식용 꽃 디저트. 세상 끝에서의 파인 다이닝.', highlight: '마을에서 가장 세련된 다이닝 경험' },
    ja: { name: 'Destino Restó', desc: '旬の食材と自家菜園を活かしたパタゴニアのシェフズキュイジーヌ。マス、仔羊のパパルデッレ、ボンディオラ、食用花のデザート。世界の果てのファインダイニング。', highlight: '村で最も洗練されたダイニング体験' },
    zh: { name: 'Destino Restó', desc: '使用时令食材和自家菜园的巴塔哥尼亚主厨料理。鳟鱼、炖羊肉宽面条、猪颈肉、小牛肉炖菜配面疙瘩，以及带食用花的甜点师甜点。世界尽头的精致料理。', highlight: '村里最精致的用餐体验' },
  },
  lito: {
    es: { name: 'Lito Restoran', desc: 'Pasta fresca artesanal y cocina de mercado en una casa familiar con apenas 10 mesas. Ravioles, tagliatelle, risotto de hongos y pescado fresco. Reserva obligatoria — sin reserva, no hay lugar. Solo abre en temporada alta.', highlight: 'Mandá mensaje antes de las 17h para conseguir mesa' },
    en: { name: 'Lito Restoran', desc: 'Fresh handmade pasta and market cuisine in a family home with only 10 tables. Ravioli, tagliatelle, mushroom risotto and fresh fish. Reservation required — no walk-ins. Open high season only.', highlight: 'Message before 5pm to secure a table' },
    pt: { name: 'Lito Restoran', desc: 'Massa fresca artesanal e cozinha de mercado em uma casa familiar com apenas 10 mesas. Ravioli, tagliatelle, risoto de cogumelos e peixe fresco. Reserva obrigatória — sem reserva, sem lugar. Abre apenas na alta temporada.', highlight: 'Mande mensagem antes das 17h para garantir mesa' },
    fr: { name: 'Lito Restoran', desc: 'Pâtes fraîches maison et cuisine de marché dans une maison familiale avec seulement 10 tables. Ravioles, tagliatelle, risotto aux champignons et poisson frais. Réservation obligatoire — pas de walk-in. Ouvert en haute saison uniquement.', highlight: 'Envoyez un message avant 17h pour réserver une table' },
    de: { name: 'Lito Restoran', desc: 'Frische handgemachte Pasta und Marktküche in einem Familienhaus mit nur 10 Tischen. Ravioli, Tagliatelle, Pilzrisotto und frischer Fisch. Reservierung erforderlich — keine Walk-ins. Nur in der Hochsaison geöffnet.', highlight: 'Vor 17 Uhr eine Nachricht schicken für einen Tisch' },
    ko: { name: 'Lito Restoran', desc: '10개 테이블뿐인 가정집에서의 수제 파스타와 마켓 요리. 라비올리, 탈리아텔레, 버섯 리조또, 신선한 생선. 예약 필수 — 워크인 불가. 성수기만 운영.', highlight: '오후 5시 전에 메시지로 예약하세요' },
    ja: { name: 'Lito Restoran', desc: '10テーブルのみの家庭的な家での手打ちパスタとマーケット料理。ラビオリ、タリアテッレ、キノコリゾット、新鮮な魚。予約必須 — ウォークイン不可。ハイシーズンのみ営業。', highlight: '17時前にメッセージで予約を' },
    zh: { name: 'Lito Restoran', desc: '在只有10张桌子的家庭式小屋里享用新鲜手工面食和市场料理。意大利饺子、宽面条、蘑菇烩饭和新鲜鱼。必须预订——不接受散客。仅旺季营业。', highlight: '下午5点前发消息预订座位' },
  },
  niponing: {
    es: { name: 'Nipo Nino', desc: 'La rotisería más accesible y querida del pueblo. Las empanadas caseras son las más elogiadas de El Chaltén — variedad de rellenos, pasta fresca y minutas para cualquier hora. Abre hasta medianoche.', highlight: 'Las empanadas de carne picante son las favoritas del pueblo' },
    en: { name: 'Nipo Nino', desc: 'The most affordable and beloved deli in town. Homemade empanadas are the most praised in El Chaltén — various fillings, fresh pasta and quick meals at any hour. Open until midnight.', highlight: 'The spicy beef empanadas are the town\'s favorite' },
    pt: { name: 'Nipo Nino', desc: 'A rotisserie mais acessível e querida da cidade. As empanadas caseiras são as mais elogiadas de El Chaltén — variedade de recheios, massa fresca e refeições rápidas a qualquer hora. Abre até meia-noite.', highlight: 'As empanadas de carne picante são as favoritas da cidade' },
    fr: { name: 'Nipo Nino', desc: 'La rôtisserie la plus abordable et appréciée du village. Les empanadas maison sont les plus louées d\'El Chaltén — garnitures variées, pâtes fraîches et repas rapides à toute heure. Ouvert jusqu\'à minuit.', highlight: 'Les empanadas à la viande épicée sont les préférées du village' },
    de: { name: 'Nipo Nino', desc: 'Die günstigste und beliebteste Imbissstube des Ortes. Hausgemachte Empanadas sind die beliebtesten in El Chaltén — verschiedene Füllungen, frische Pasta und schnelle Mahlzeiten zu jeder Stunde. Bis Mitternacht geöffnet.', highlight: 'Die scharfen Fleisch-Empanadas sind die Lieblinge des Dorfes' },
    ko: { name: 'Nipo Nino', desc: '마을에서 가장 저렴하고 사랑받는 로티세리. 수제 엠파나다는 엘 찰텐 최고로 칭찬받음 — 다양한 속재료, 생파스타, 언제든 빠른 식사. 자정까지 영업.', highlight: '매운 소고기 엠파나다는 마을 최고 인기' },
    ja: { name: 'Nipo Nino', desc: '町で最もリーズナブルで人気のロティスリー。手作りエンパナーダはエル・チャルテンで最も絶賛される — 様々な具材、生パスタ、いつでも素早い食事。深夜0時まで営業。', highlight: '辛い牛肉エンパナーダが町のお気に入り' },
    zh: { name: 'Nipo Nino', desc: '镇上最实惠、最受喜爱的熟食店。手工馅饼是查尔腾最受称赞的——各种馅料、新鲜面食，随时都能快速用餐。营业至午夜。', highlight: '辣牛肉馅饼是全镇最受欢迎的' },
  },
  chaltenos: {
    es: { name: 'Chalteños', desc: 'Confitería artesanal con más de 1.000 alfajores por día. Chocolates de calidad gourmet, alfajores de calafate, gooseberry y chocolate negro. El souvenir comestible obligado del Chaltén.', highlight: 'Llevate alfajores de calafate — no los conseguís en otro lado' },
    en: { name: 'Chalteños', desc: 'Artisan confectionery making over 1,000 alfajores per day. Gourmet quality chocolates, alfajores with calafate berry, gooseberry and dark chocolate. The must-bring edible souvenir from Chaltén.', highlight: 'Take home calafate alfajores — you can\'t find these anywhere else' },
    pt: { name: 'Chalteños', desc: 'Confeitaria artesanal com mais de 1.000 alfajores por dia. Chocolates de qualidade gourmet, alfajores de calafate, groselha e chocolate amargo. O souvenir comestível obrigatório do Chaltén.', highlight: 'Leve alfajores de calafate — você não encontra em outro lugar' },
    fr: { name: 'Chalteños', desc: 'Confiserie artisanale produisant plus de 1 000 alfajores par jour. Chocolats de qualité gastronomique, alfajores au calafate, groseille et chocolat noir. Le souvenir comestible incontournable de Chaltén.', highlight: 'Ramenez des alfajores au calafate — introuvables ailleurs' },
    de: { name: 'Chalteños', desc: 'Handwerkliche Konfiserie mit über 1.000 Alfajores pro Tag. Gourmet-Schokoladen, Alfajores mit Kalafate-Beeren, Stachelbeeren und dunkler Schokolade. Das essbare Pflicht-Souvenir aus Chaltén.', highlight: 'Kalafate-Alfajores mitnehmen — woanders nicht erhältlich' },
    ko: { name: 'Chalteños', desc: '하루 1,000개 이상의 알파호레스를 만드는 수제 제과점. 구르메 품질 초콜릿, 칼라파테 베리·구즈베리·다크 초콜릿 알파호레스. 찰텐에서 꼭 사야 할 먹을 수 있는 기념품.', highlight: '칼라파테 알파호레스를 가져가세요 — 다른 곳에선 못 구합니다' },
    ja: { name: 'Chalteños', desc: '1日1,000個以上のアルファホレスを作る職人菓子店。グルメ品質のチョコレート、カラファテベリー・グーズベリー・ダークチョコのアルファホレス。チャルテンで必ず買いたい食べるお土産。', highlight: 'カラファテアルファホレスをお土産に — 他では手に入らない' },
    zh: { name: 'Chalteños', desc: '每天制作1000多个阿尔法乔雷斯的手工糖果店。美食级品质巧克力，卡拉法特浆果、鹅莓和黑巧克力阿尔法乔雷斯。查尔腾必带的可食用纪念品。', highlight: '带走卡拉法特阿尔法乔雷斯——其他地方买不到' },
  },
  esquina: {
    es: { name: 'La Esquina Chaltén', desc: 'Café de especialidad, tortas caseras y empanadas en un espacio con biblioteca curada y estudio de yoga en el piso de arriba. Hacen viandas para trekking y locro en invierno. El rincón más tranquilo del pueblo.', highlight: 'El lugar perfecto para leer algo después del trek' },
    en: { name: 'La Esquina Chaltén', desc: 'Specialty coffee, homemade cakes and empanadas in a space with a curated library and yoga studio upstairs. Trekking packed lunches and winter locro stew available. The quietest corner in the village.', highlight: 'Perfect place to read something after the trek' },
    pt: { name: 'La Esquina Chaltén', desc: 'Café de especialidade, bolos caseiros e empanadas em um espaço com biblioteca curada e estúdio de yoga no andar de cima. Fazem marmitas para trekking e locro no inverno. O canto mais tranquilo do vilarejo.', highlight: 'O lugar perfeito para ler algo depois do trekking' },
    fr: { name: 'La Esquina Chaltén', desc: 'Café de spécialité, gâteaux maison et empanadas dans un espace avec une bibliothèque curatée et un studio de yoga à l\'étage. Pique-niques de trekking et locro hivernal disponibles. Le coin le plus tranquille du village.', highlight: 'L\'endroit parfait pour lire quelque chose après le trek' },
    de: { name: 'La Esquina Chaltén', desc: 'Spezialitätenkaffee, hausgemachte Kuchen und Empanadas in einem Raum mit kuratierter Bibliothek und Yoga-Studio im Obergeschoss. Trek-Lunchpakete und Winter-Locro erhältlich. Die ruhigste Ecke des Dorfes.', highlight: 'Perfekter Ort zum Lesen nach der Wanderung' },
    ko: { name: 'La Esquina Chaltén', desc: '엄선된 도서관과 위층 요가 스튜디오가 있는 공간에서 즐기는 스페셜티 커피, 수제 케이크, 엠파나다. 트레킹 도시락과 겨울 로크로 스튜 제공. 마을에서 가장 조용한 구석.', highlight: '트레킹 후 책 읽기에 완벽한 장소' },
    ja: { name: 'La Esquina Chaltén', desc: 'キュレーションされたライブラリーと上階のヨガスタジオがある空間でのスペシャルティコーヒー、手作りケーキ、エンパナーダ。トレッキングランチボックスと冬のロクロも。村で最も静かなコーナー。', highlight: 'トレッキング後に読書するのに最適な場所' },
    zh: { name: 'La Esquina Chaltén', desc: '精心挑选的图书馆和楼上瑜伽工作室的空间里提供精品咖啡、自制蛋糕和馅饼。提供徒步午餐盒和冬季炖菜。村里最安静的角落。', highlight: '徒步后读书的完美场所' },
  },
  memes: {
    es: { name: "Meme's Cakes", desc: 'Pequeña pastelería casera en la planta alta del edificio Maffia. Alfajores de almendras con dulce de leche, apple crumble, tortas y submarinos. El espacio más pequeño y auténtico del pueblo.', highlight: 'El alfajor de almendras es imperdible — comprá de más para el trekking' },
    en: { name: "Meme's Cakes", desc: 'Small homemade bakery on the upper floor of the Maffia building. Almond alfajores with dulce de leche, apple crumble, cakes and hot chocolate. The smallest, most authentic spot in town.', highlight: 'The almond alfajor is unmissable — buy extras for the trek' },
    pt: { name: "Meme's Cakes", desc: 'Pequena padaria caseira no andar de cima do edifício Maffia. Alfajores de amêndoa com doce de leite, apple crumble, bolos e submarino. O espaço mais pequeno e autêntico do vilarejo.', highlight: 'O alfajor de amêndoa é imperdível — compre extras para o trekking' },
    fr: { name: "Meme's Cakes", desc: 'Petite boulangerie maison au premier étage du bâtiment Maffia. Alfajores aux amandes avec dulce de leche, apple crumble, gâteaux et chocolat chaud. Le plus petit et le plus authentique du village.', highlight: "L'alfajor aux amandes est incontournable — achetez-en en plus pour la rando" },
    de: { name: "Meme's Cakes", desc: 'Kleine hausgemachte Bäckerei im Obergeschoss des Maffia-Gebäudes. Mandel-Alfajores mit Dulce de Leche, Apple Crumble, Kuchen und heißer Schokolade. Der kleinste, authentischste Ort im Dorf.', highlight: 'Der Mandel-Alfajor ist ein Muss — kaufen Sie Extras für die Wanderung' },
    ko: { name: "Meme's Cakes", desc: '마피아 건물 위층에 있는 작은 수제 제과점. 둘세 데 레체를 곁들인 아몬드 알파호레스, 애플 크럼블, 케이크, 핫 초콜릿. 마을에서 가장 작고 진정한 곳.', highlight: '아몬드 알파호레스는 필수 — 트레킹용으로 여분도 사세요' },
    ja: { name: "Meme's Cakes", desc: 'マフィアビル上階の小さな手作りベーカリー。ドゥルセ・デ・レチェを添えたアーモンドアルファホレス、アップルクランブル、ケーキ、ホットチョコレート。町で最も小さく本物らしい場所。', highlight: 'アーモンドアルファホレスは必食 — トレッキング用に余分に購入を' },
    zh: { name: "Meme's Cakes", desc: '马菲亚大楼上层的小型自制烘焙店。配有牛奶糖的杏仁阿尔法乔雷斯、苹果酥、蛋糕和热可可。镇上最小、最正宗的地方。', highlight: '杏仁阿尔法乔雷斯必吃——多买些带去徒步' },
  },
}

const TIPS: Record<string, { title: string; items: string[] }> = {
  es: {
    title: 'Lo que tenés que saber antes de cenar en Chaltén',
    items: [
      '🕐 Los restaurantes populares se llenan rápido — reservá con anticipación o llegá antes de las 19h',
      '💵 Varios lugares solo aceptan efectivo en pesos o dólares. Siempre llevá billete',
      '🍕 Laborum hace solo 60 pizzas por noche — si llegás a las 20h puede que no haya más',
      '🥾 Muchos locales abren para el desayuno / brunch si llegás de madrugada del trekking',
      '☕ Paisa ofrece viandas para llevar al cerro — consultá con anticipación',
      '📅 The Asadores y Maffia solo aceptan reservas. Sin reserva, no hay lugar',
    ],
  },
  en: {
    title: 'What you need to know before dining in Chaltén',
    items: [
      '🕐 Popular restaurants fill up fast — book ahead or arrive before 7pm',
      '💵 Several spots only accept cash (pesos or dollars). Always carry bills',
      '🍕 Laborum makes only 60 pizzas per night — by 8pm there may be none left',
      '🥾 Many places open early for breakfast / brunch after a pre-dawn trek',
      '☕ Paisa offers packed lunches to take up the mountain — ask in advance',
      '📅 The Asadores and Maffia only accept reservations. No reservation = no table',
    ],
  },
  pt: {
    title: 'O que você precisa saber antes de jantar em Chaltén',
    items: [
      '🕐 Os restaurantes populares lotam rápido — reserve com antecedência ou chegue antes das 19h',
      '💵 Vários lugares só aceitam dinheiro em pesos ou dólares. Sempre leve cédulas',
      '🍕 Laborum faz apenas 60 pizzas por noite — às 20h pode não haver mais',
      '🥾 Muitos locais abrem cedo para café da manhã/brunch após o trekking',
      '☕ Paisa oferece marmitas para levar à trilha — consulte com antecedência',
      '📅 The Asadores e Maffia só aceitam reservas. Sem reserva = sem mesa',
    ],
  },
  fr: {
    title: 'Ce que vous devez savoir avant de dîner à Chaltén',
    items: [
      '🕐 Les restaurants populaires se remplissent vite — réservez à l\'avance ou arrivez avant 19h',
      '💵 Plusieurs endroits n\'acceptent que les espèces (pesos ou dollars). Prenez toujours des billets',
      '🍕 Laborum ne fait que 60 pizzas par soir — à 20h il n\'en restera peut-être plus',
      '🥾 Beaucoup d\'endroits ouvrent tôt pour le petit-déjeuner/brunch après le trek',
      '☕ Paisa propose des repas à emporter en montagne — demandez à l\'avance',
      '📅 The Asadores et Maffia n\'acceptent que les réservations. Sans réservation = pas de table',
    ],
  },
  de: {
    title: 'Was Sie vor dem Abendessen in Chaltén wissen müssen',
    items: [
      '🕐 Beliebte Restaurants füllen sich schnell — im Voraus reservieren oder vor 19 Uhr ankommen',
      '💵 Mehrere Lokale akzeptieren nur Bargeld (Pesos oder Dollar). Immer Scheine dabeihaben',
      '🍕 Laborum macht nur 60 Pizzen pro Nacht — um 20 Uhr kann es vorbei sein',
      '🥾 Viele Orte öffnen früh zum Frühstück/Brunch nach dem Trek',
      '☕ Paisa bietet Lunchpakete für die Wanderung an — im Voraus anfragen',
      '📅 The Asadores und Maffia akzeptieren nur Reservierungen. Ohne Reservierung kein Tisch',
    ],
  },
  ko: {
    title: '찰텐에서 식사하기 전에 알아야 할 것',
    items: [
      '🕐 인기 식당은 빨리 차므로 미리 예약하거나 오후 7시 전에 도착하세요',
      '💵 여러 곳이 현금(페소 또는 달러)만 받습니다. 항상 지폐를 지참하세요',
      '🍕 Laborum은 하루 60판만 만들어요 — 저녁 8시면 없을 수도 있어요',
      '🥾 많은 곳이 새벽 트레킹 후 조식/브런치를 위해 일찍 문을 엽니다',
      '☕ Paisa는 산에 가져갈 도시락을 제공합니다 — 미리 문의하세요',
      '📅 The Asadores와 Maffia는 예약만 받습니다. 예약 없이는 자리 없음',
    ],
  },
  ja: {
    title: 'チャルテンで食事をする前に知っておくべきこと',
    items: [
      '🕐 人気のレストランはすぐ満席に — 事前予約か19時前の到着を',
      '💵 現金（ペソまたはドル）のみのお店が複数あります。常に現金を持参して',
      '🍕 Laborumは1夜60枚のピザのみ — 20時には売り切れの可能性も',
      '🥾 早朝トレッキング後の朝食/ブランチのために早くから開くお店も多い',
      '☕ Paisaは山に持っていくランチボックスを提供 — 事前に相談を',
      '📅 The AsadoresとMaffiaは予約のみ受付。予約なし = 席なし',
    ],
  },
  zh: {
    title: '在查尔腾就餐前需要了解的事项',
    items: [
      '🕐 热门餐厅很快就满座——提前预订或在晚上7点前到达',
      '💵 多处餐厅只收现金（比索或美元）。始终携带现金',
      '🍕 Laborum每晚只做60张披萨——晚上8点可能已经卖完',
      '🥾 许多地方为徒步后的早早起床者提供早餐/早午餐',
      '☕ Paisa提供带去山上的午餐盒——提前咨询',
      '📅 The Asadores和Maffia只接受预订。没有预订 = 没有桌子',
    ],
  },
}

// ── Component ─────────────────────────────────────────────────────────────────

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.25
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i < full
              ? 'fill-amber-400 text-amber-400'
              : i === full && half
              ? 'fill-amber-200 text-amber-400'
              : 'text-surface'
          }`}
        />
      ))}
    </span>
  )
}

function PriceTag({ price }: { price: string }) {
  const colors: Record<string, string> = {
    '$': 'text-green-700 bg-green-50',
    '$$': 'text-blue-700 bg-blue-50',
    '$$$': 'text-orange-700 bg-orange-50',
    '$$$$': 'text-red-700 bg-red-50',
  }
  return (
    <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${colors[price] ?? ''}`}>
      {price}
    </span>
  )
}

function PlaceCard({ place, locale, copy }: { place: Place; locale: Locale; copy: { name: string; desc: string; highlight: string } }) {
  const t = (key: string) => T[key]?.[locale] ?? T[key]?.en ?? key
  const closedKey = place.closedDay ?? ''

  return (
    <div className="bg-white rounded-2xl border border-surface shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{place.emoji}</span>
            <div>
              <h3 className="font-heading text-lg font-bold text-dark leading-tight">{copy.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Stars rating={place.rating} />
                <span className="text-sm font-semibold text-amber-600">{place.rating}</span>
                <span className="text-xs text-dark/50">({place.reviews.toLocaleString()} {t('reviews')})</span>
              </div>
            </div>
          </div>
          <PriceTag price={place.price} />
        </div>

        {/* Closed day */}
        {closedKey && (
          <div className="flex items-center gap-1.5 text-xs text-dark/50 mb-3">
            <Clock className="w-3.5 h-3.5" />
            <span>{t('closed')} {t(closedKey)}</span>
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-dark/70 leading-relaxed mb-3">{copy.desc}</p>

        {/* Highlight */}
        <div className="bg-primary/5 border-l-3 border-primary rounded-r-lg px-3 py-2 mb-4">
          <p className="text-xs font-medium text-primary">💡 {copy.highlight}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {place.tags.map(tag => (
            <span key={tag} className={`text-xs font-medium px-2 py-0.5 rounded-full ${TAG_COLORS[tag]}`}>
              {t(TAG_KEYS[tag])}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-2 pt-3 border-t border-surface">
          {place.gmaps && (
            <a
              href={place.gmaps}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-dark/60 hover:text-primary transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" />
              {t('gmaps')}
              <ExternalLink className="w-3 h-3 opacity-50" />
            </a>
          )}
          {place.tripadvisor && (
            <a
              href={place.tripadvisor}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-dark/60 hover:text-primary transition-colors"
            >
              <Star className="w-3.5 h-3.5" />
              TripAdvisor
              <ExternalLink className="w-3 h-3 opacity-50" />
            </a>
          )}
          {place.instagram && (
            <a
              href={place.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-dark/60 hover:text-primary transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Instagram
              <ExternalLink className="w-3 h-3 opacity-50" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function GastronomiaPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const loc = locale as Locale
  const t = (key: string) => T[key]?.[loc] ?? T[key]?.en ?? key
  const copy = (key: string) => PLACE_COPY[key]?.[loc] ?? PLACE_COPY[key]?.en
  const tips = TIPS[loc] ?? TIPS.en

  return (
    <main className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-primary/8 via-background to-amber-50/40 pt-16 pb-12 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary/70 mb-4">
            {t('tagline')}
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-black text-dark leading-tight mb-4 whitespace-pre-line">
            {t('heroTitle')}
          </h1>
          <p className="text-lg text-dark/60 max-w-2xl mx-auto leading-relaxed">
            {t('heroSub')}
          </p>
        </div>
      </section>

      {/* ── Restaurants ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <h2 className="font-heading text-3xl font-black text-dark mb-2">{t('restTitle')}</h2>
          <p className="text-dark/60">{t('restSub')}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {RESTAURANTS.map(place => {
            const c = copy(place.key)
            if (!c) return null
            return <PlaceCard key={place.key} place={place} locale={loc} copy={c} />
          })}
        </div>
      </section>

      {/* ── Cafés ── */}
      <section className="bg-amber-50/30 border-y border-amber-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-10">
            <h2 className="font-heading text-3xl font-black text-dark mb-2">{t('cafeTitle')}</h2>
            <p className="text-dark/60">{t('cafeSub')}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {CAFES.map(place => {
              const c = copy(place.key)
              if (!c) return null
              return <PlaceCard key={place.key} place={place} locale={loc} copy={c} />
            })}
          </div>
        </div>
      </section>

      {/* ── Tips ── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="font-heading text-2xl font-bold text-dark mb-6">{tips.title}</h2>
        <ul className="space-y-3">
          {tips.items.map((item, i) => (
            <li key={i} className="flex gap-3 text-sm text-dark/70 leading-relaxed">
              <span className="shrink-0 mt-0.5 text-base">{item.slice(0, 2)}</span>
              <span>{item.slice(2).trim()}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── CTA ── */}
      <section className="bg-primary/5 border-t border-primary/10">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h2 className="font-heading text-2xl font-bold text-dark mb-3">{t('ctaTitle')}</h2>
          <p className="text-dark/60 mb-8 leading-relaxed">{t('ctaBody')}</p>
          <a
            href="https://wa.me/5492966421502"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {t('ctaButton')}
          </a>
        </div>
      </section>

    </main>
  )
}
