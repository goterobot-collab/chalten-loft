import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { properties } from '@/lib/properties'
import { Users, Bed, Bath, Maximize, Wifi, Car, PawPrint, Tv, CookingPot, Briefcase, Coffee, Luggage, Mountain, Key, Wind } from 'lucide-react'
import type { Metadata } from 'next'
import PhotoCarousel from '@/components/properties/PhotoCarousel'
import AvailabilityCalendar from '@/components/booking/AvailabilityCalendar'
import PropertyBookingSidebar from '@/components/properties/PropertyBookingSidebar'
import MobileBookingBar from '@/components/properties/MobileBookingBar'
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

// ── Lo que incluye — detalle por categoría ───────────────────────────────────
const includedT: Record<string, {
  title: string
  kitchen: { title: string; items: string[] }
  sleep: { title: string; items: string[] }
  bath: { title: string; items: string[] }
  extras: { title: string; items: string[] }
  noSmoke: string
}> = {
  es: {
    title: 'Lo que incluye',
    kitchen: { title: '🍳 Cocina equipada', items: ['Hornallas vitrocerámicas y horno microondas', 'Refrigerador con congelador y pava eléctrica', 'Cafetera Nespresso y cafetera italiana', 'Utensilios completos, vajilla y mesa para 3–4 personas'] },
    sleep:   { title: '🛏️ Descanso', items: ['Cama doble + sofá cama o cama doble con luces de lectura (según loft)', 'Ropa de cama de algodón 100%, cortinas blackout', 'Almohadas y mantas adicionales', 'Vista a las montañas'] },
    bath:    { title: '🚿 Baño', items: ['Ducha con bidet de mano', 'Toallas y toallones incluidos', 'Secador de pelo, shampoo, acondicionador, jabón líquido, papel higiénico'] },
    extras:  { title: '✨ Extras', items: ['Ingreso privado e independiente', 'Estacionamiento en la vía pública', 'SmartTV, juegos de mesa y biblioteca', 'WiFi 24hs · Calefacción central por radiadores', 'Detector de humo y extintor de incendios', 'Guardaequipaje disponible'] },
    noSmoke: '🚭 No se permite fumar dentro de la propiedad',
  },
  en: {
    title: "What's included",
    kitchen: { title: '🍳 Fully equipped kitchen', items: ['Vitroceramic hob and microwave oven', 'Fridge with freezer and electric kettle', 'Nespresso machine and Italian stovetop coffee maker', 'Full utensils, tableware and dining table for 3–4'] },
    sleep:   { title: '🛏️ Sleep', items: ['Double bed + sofa bed or double bed with reading lights (varies by loft)', '100% cotton bed linen, blackout curtains', 'Extra pillows and blankets', 'Mountain views'] },
    bath:    { title: '🚿 Bathroom', items: ['Shower with handheld bidet', 'Bath towels and face towels included', 'Hair dryer, shampoo, conditioner, liquid soap, toilet paper'] },
    extras:  { title: '✨ Extras', items: ['Private and independent entrance', 'Free street parking', 'Smart TV, board games and book library', 'WiFi 24/7 · Central heating via radiators', 'Smoke detector and fire extinguisher', 'Luggage storage available'] },
    noSmoke: '🚭 No smoking inside the property',
  },
  pt: {
    title: 'O que está incluído',
    kitchen: { title: '🍳 Cozinha equipada', items: ['Cooktop vitrocerâmico e micro-ondas', 'Geladeira com freezer e chaleira elétrica', 'Cafeteira Nespresso e cafeteira italiana', 'Utensílios completos, louça e mesa para 3–4 pessoas'] },
    sleep:   { title: '🛏️ Descanso', items: ['Cama de casal + sofá-cama ou cama de casal com luzes de leitura (conforme loft)', 'Roupa de cama 100% algodão, cortinas blackout', 'Travesseiros e mantas adicionais', 'Vista para as montanhas'] },
    bath:    { title: '🚿 Banheiro', items: ['Chuveiro com ducha higiênica', 'Toalhas de banho e rosto incluídas', 'Secador de cabelo, shampoo, condicionador, sabão líquido, papel higiênico'] },
    extras:  { title: '✨ Extras', items: ['Entrada privativa e independente', 'Estacionamento na via pública', 'Smart TV, jogos de mesa e biblioteca', 'WiFi 24hs · Aquecimento central por radiadores', 'Detector de fumaça e extintor', 'Guarda-volumes disponível'] },
    noSmoke: '🚭 Não é permitido fumar dentro da propriedade',
  },
  fr: {
    title: 'Ce qui est inclus',
    kitchen: { title: '🍳 Cuisine équipée', items: ['Plaques vitrocéramiques et four micro-ondes', 'Réfrigérateur avec congélateur et bouilloire électrique', 'Machine Nespresso et cafetière italienne', 'Ustensiles complets, vaisselle et table pour 3–4 personnes'] },
    sleep:   { title: '🛏️ Repos', items: ['Lit double + canapé-lit ou lit double avec lampes de lecture (selon le loft)', 'Linge de lit 100% coton, rideaux occultants', 'Oreillers et couvertures supplémentaires', 'Vue sur les montagnes'] },
    bath:    { title: '🚿 Salle de bain', items: ['Douche avec douchette bidet', 'Serviettes de bain et de toilette incluses', 'Sèche-cheveux, shampooing, après-shampooing, savon liquide, papier toilette'] },
    extras:  { title: '✨ Extras', items: ['Entrée privée et indépendante', 'Stationnement sur la voie publique', 'Smart TV, jeux de société et bibliothèque', 'WiFi 24h/24 · Chauffage central par radiateurs', 'Détecteur de fumée et extincteur', 'Consigne à bagages disponible'] },
    noSmoke: '🚭 Il est interdit de fumer à l\'intérieur',
  },
  de: {
    title: 'Inbegriffen',
    kitchen: { title: '🍳 Voll ausgestattete Küche', items: ['Glaskeramik-Kochfeld und Mikrowelle', 'Kühlschrank mit Gefrierfach und Wasserkocher', 'Nespresso-Maschine und Espressokanne', 'Vollständiges Kochgeschirr, Geschirr und Tisch für 3–4'] },
    sleep:   { title: '🛏️ Schlafen', items: ['Doppelbett + Schlafsofa oder Doppelbett mit Leselampen (je nach Loft)', '100% Baumwoll-Bettwäsche, Verdunkelungsvorhänge', 'Zusätzliche Kissen und Decken', 'Bergblick'] },
    bath:    { title: '🚿 Badezimmer', items: ['Dusche mit Handbrause-Bidet', 'Bade- und Handtücher inklusive', 'Haartrockner, Shampoo, Spülung, Flüssigseife, Toilettenpapier'] },
    extras:  { title: '✨ Extras', items: ['Privater und unabhängiger Eingang', 'Parkplatz auf der Straße', 'Smart TV, Brettspiele und Bibliothek', 'WLAN 24/7 · Zentralheizung über Heizkörper', 'Rauchmelder und Feuerlöscher', 'Gepäckaufbewahrung verfügbar'] },
    noSmoke: '🚭 Rauchen im Gebäude nicht gestattet',
  },
  ko: {
    title: '포함 사항',
    kitchen: { title: '🍳 주방 완비', items: ['세라믹 가스레인지 및 전자레인지', '냉동고 포함 냉장고 및 전기 주전자', '네스프레소 머신 및 이탈리아식 커피메이커', '주방용품 완비, 3–4인용 식기 및 식탁'] },
    sleep:   { title: '🛏️ 수면', items: ['더블 침대 + 소파 침대 또는 독서등이 있는 더블 침대 (로프트에 따라 다름)', '100% 순면 침구, 암막 커튼', '추가 베개 및 담요', '산 전망'] },
    bath:    { title: '🚿 욕실', items: ['핸드헬드 비데 샤워기', '목욕 및 세면 타월 포함', '헤어드라이어, 샴푸, 컨디셔너, 액체 비누, 화장지'] },
    extras:  { title: '✨ 기타', items: ['독립적인 개인 출입구', '공공 도로 주차 가능', 'Smart TV, 보드게임 및 도서관', 'WiFi 24시간 · 라디에이터 중앙 난방', '화재 감지기 및 소화기', '수하물 보관 가능'] },
    noSmoke: '🚭 건물 내 흡연 금지',
  },
  ja: {
    title: '含まれるもの',
    kitchen: { title: '🍳 完備キッチン', items: ['ガラスセラミックコンロと電子レンジ', '冷凍庫付き冷蔵庫と電気ケトル', 'ネスプレッソマシンとイタリア式コーヒーメーカー', '調理器具完備、3〜4名用の食器とダイニングテーブル'] },
    sleep:   { title: '🛏️ 睡眠', items: ['ダブルベッド＋ソファベッド、またはダブルベッドとリーディングライト（ロフトにより異なる）', '綿100%のリネン、遮光カーテン', '追加の枕と毛布', '山の眺望'] },
    bath:    { title: '🚿 バスルーム', items: ['ハンドシャワー付きシャワー', 'バスタオルとフェイスタオル完備', 'ヘアドライヤー、シャンプー、コンディショナー、液体ソープ、トイレットペーパー'] },
    extras:  { title: '✨ その他', items: ['独立したプライベート入口', '路上駐車可能', 'Smart TV、ボードゲームと書籍', 'WiFi 24時間 · ラジエーター式セントラルヒーティング', '煙感知器と消火器', '荷物預かりサービスあり'] },
    noSmoke: '🚭 建物内は禁煙です',
  },
  zh: {
    title: '含包项目',
    kitchen: { title: '🍳 全套厨房', items: ['玻璃陶瓷炉灶和微波炉', '带冷冻室的冰箱和电热水壶', 'Nespresso胶囊咖啡机和意式摩卡壶', '全套厨具、餐具和3–4人餐桌'] },
    sleep:   { title: '🛏️ 休息', items: ['双人床+沙发床，或带阅读灯的双人床（因loft而异）', '100%纯棉床上用品，遮光窗帘', '额外枕头和毯子', '山景'] },
    bath:    { title: '🚿 卫生间', items: ['带手持式坐浴盆的淋浴', '浴巾和毛巾已包含', '吹风机、洗发水、护发素、液体皂、卫生纸'] },
    extras:  { title: '✨ 其他', items: ['独立私人入口', '路边停车', 'Smart TV、桌游和图书馆', 'WiFi 24小时 · 散热器中央供暖', '烟雾探测器和灭火器', '行李寄存服务'] },
    noSmoke: '🚭 建筑内禁止吸烟',
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

              {/* Lo que incluye — detalle por categoría */}
              {(() => {
                const inc = includedT[locale] ?? includedT.en
                return (
                  <FadeInView className="border-t border-surface pt-10">
                    <h2 className="font-heading text-2xl text-primary mb-8">{inc.title}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {[inc.kitchen, inc.sleep, inc.bath, inc.extras].map((cat) => (
                        <div key={cat.title} className="rounded-2xl bg-surface/40 p-5">
                          <p className="font-semibold text-dark mb-3 text-sm">{cat.title}</p>
                          <ul className="space-y-1.5">
                            {cat.items.map((item) => (
                              <li key={item} className="flex items-start gap-2 text-sm text-dark/70">
                                <span className="text-accent mt-0.5 shrink-0">·</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <p className="mt-5 text-sm text-dark/50 italic">{inc.noSmoke}</p>
                  </FadeInView>
                )
              })()}

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
              <PropertyBookingSidebar
                slug={property.slug}
                locale={locale}
                maxGuests={property.maxGuests}
                priceFrom={property.priceFrom}
              />
            </SlideInView>
          </div>
        </div>
      </section>

      <MobileBookingBar slug={property.slug} priceFrom={property.priceFrom} />
    </>
  )
}
