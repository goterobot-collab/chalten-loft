import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ExternalLink, AlertTriangle, Smartphone, Clock, TrendingUp, MapPin, Zap, Shield } from 'lucide-react'
import Image from 'next/image'
import ContentPageBookingCTA from '@/components/content/ContentPageBookingCTA'

type Props = {
  params: Promise<{ locale: string }>
}

// ── Trail data ────────────────────────────────────────────────────────────────

type Trail = {
  emoji: string
  key: string
  difficulty: 'easy' | 'moderate' | 'hard'
  distance: string
  elevation: string
  duration: string
  photo?: { url: string; author: string; license: string }
  wikiloc?: string
  alltrails?: string
}

const SHORT_TRAILS: Trail[] = [
  {
    emoji: '🌊',
    key: 'chorillo',
    difficulty: 'easy',
    distance: '7 km',
    elevation: '80 m',
    duration: '2–3 h',
    photo: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Argentina_2015-11-21_%2824311069564%29.jpg',
      author: 'Guillaume Baviere',
      license: 'CC BY-SA 2.0',
    },
    wikiloc: 'https://www.wikiloc.com/hiking-trails/parque-nacional-los-glaciares-el-chalten-laguna-torre-cerro-torre-chorrillo-del-salto-32827706',
  },
  {
    emoji: '🦅',
    key: 'condores',
    difficulty: 'easy',
    distance: '6–7 km',
    elevation: '215 m',
    duration: '1.5–2.5 h',
    photo: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/El_Chalt%C3%A9n%2C_panoramic_view.jpg',
      author: 'Pablo Vazquez (Pablovqz)',
      license: 'CC BY 3.0',
    },
    wikiloc: 'https://www.wikiloc.com/hiking-trails/sendero-mirador-los-condores-y-mirador-las-aguilas-el-chalten-23105523',
    alltrails: 'https://www.alltrails.com/trail/argentina/santa-cruz/el-chalten-el-paredon-las-vueltas',
  },
  {
    emoji: '🪨',
    key: 'paredon',
    difficulty: 'easy',
    distance: '8–10 km',
    elevation: '400 m',
    duration: '3–5 h',
    photo: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Valle_del_Rio_de_las_Vueltas_-_El_Chalt%C3%A9n_-_panoramio.jpg',
      author: 'Pavel Špindler',
      license: 'CC BY 3.0',
    },
    alltrails: 'https://www.alltrails.com/trail/argentina/santa-cruz/el-chalten-el-paredon-las-vueltas',
  },
  {
    emoji: '⛪',
    key: 'cementerio',
    difficulty: 'easy',
    distance: '1–2 km',
    elevation: '20 m',
    duration: '30 min',
    // No Wikimedia photo available — no GPS track needed either (within town)
  },
  {
    emoji: '💧',
    key: 'margarita',
    difficulty: 'easy',
    distance: '2 km',
    elevation: '80 m',
    duration: '1–1.5 h',
    photo: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Waterfall_in_second_lake_Fitz_Roy_Trail_Parque_Nacional_Los_Glaciares_El_Chalten_Argentina.jpg',
      author: 'amanderson2',
      license: 'CC BY 2.0',
    },
    wikiloc: 'https://www.wikiloc.com/hiking-trails/mirador-cascada-margarita-y-mirador-cerro-torre-desde-el-chalten-169106666',
  },
]

const MEDIUM_TRAILS: Trail[] = [
  {
    emoji: '🏔️',
    key: 'capri',
    difficulty: 'moderate',
    distance: '8–9 km',
    elevation: '400 m',
    duration: '3.5–5 h',
    photo: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Laguna_Capri_-_panoramio.jpg',
      author: 'Martin Cígler',
      license: 'CC BY-SA 3.0',
    },
    wikiloc: 'https://www.wikiloc.com/hiking-trails/el-chalten-laguna-de-los-tres-2430274',
  },
  {
    emoji: '🗼',
    key: 'torre',
    difficulty: 'moderate',
    distance: '18–20 km',
    elevation: '515 m',
    duration: '6–8 h',
    photo: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Laguna_Torre_and_Cerro_Torre_%286952701790%29.jpg',
      author: 'Christoph Strässler',
      license: 'CC BY-SA 2.0',
    },
    wikiloc: 'https://www.wikiloc.com/hiking-trails/parque-nacional-los-glaciares-el-chalten-laguna-torre-cerro-torre-chorrillo-del-salto-32827706',
    alltrails: 'https://www.alltrails.com/trail/argentina/santa-cruz/laguna-torre-desde-el-chalten',
  },
]

const LONG_TRAILS: Trail[] = [
  {
    emoji: '⭐',
    key: 'tres',
    difficulty: 'hard',
    distance: '22–25 km',
    elevation: '1000 m',
    duration: '8–10 h',
    photo: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Fitz_Roy_massif_2015_1.JPG',
      author: 'Fredlyfish4',
      license: 'CC BY-SA 4.0',
    },
    wikiloc: 'https://www.wikiloc.com/hiking-trails/el-chalten-laguna-de-los-tres-2430274',
    alltrails: 'https://www.alltrails.com/trail/argentina/santa-cruz/chalten-laguna-de-los-tres-laguna-sucia',
  },
  {
    emoji: '🌐',
    key: 'pliegue',
    difficulty: 'hard',
    distance: '18 km',
    elevation: '1128 m',
    duration: '7–9 h',
    photo: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Fitzroy_Peak_rail_to_Loma_del_Pliegue_Tumbado_Parque_Nacional_Los_Glaciares_El_Chalten_Argentina.jpg',
      author: 'amanderson2',
      license: 'CC BY 2.0',
    },
    wikiloc: 'https://www.wikiloc.com/hiking-trails/el-chalten-loma-del-pliegue-tumbado-2430178',
  },
]

// ── i18n content ──────────────────────────────────────────────────────────────

type Locale = 'es' | 'en' | 'pt' | 'fr' | 'de' | 'ko' | 'ja' | 'zh'

const T: Record<string, Record<string, string>> = {
  tagline:      { es:'Guía de Trekking', en:'Trekking Guide', pt:'Guia de Trekking', fr:'Guide de Trekking', de:'Trekking-Guide', ko:'트레킹 가이드', ja:'トレッキングガイド', zh:'徒步指南' },
  heroTitle:    { es:'Explora la Naturaleza\nen Chaltén', en:'Explore Nature\nin Chaltén', pt:'Explore a Natureza\nem Chaltén', fr:'Explorez la Nature\nà Chaltén', de:'Erkunde die Natur\nin Chaltén', ko:'찰텐의 자연을\n탐험하세요', ja:'チャルテンの自然を\n探索しよう', zh:'探索查尔腾\n的自然风光' },
  heroSub:      { es:'Armamos esta guía con los mejores senderos, links a tracks GPS descargables y todo lo que necesitás saber antes de salir.', en:'We put together this guide with the best trails, downloadable GPS tracks, and everything you need to know before heading out.', pt:'Montamos este guia com as melhores trilhas, links para tracks GPS para baixar e tudo o que você precisa saber antes de sair.', fr:'Nous avons élaboré ce guide avec les meilleurs sentiers, des traces GPS téléchargeables et tout ce que vous devez savoir avant de partir.', de:'Wir haben diesen Leitfaden mit den besten Wanderwegen, herunterladbaren GPS-Tracks und allem zusammengestellt, was Sie wissen müssen.', ko:'최고의 트레일, 다운로드 가능한 GPS 트랙 링크, 출발 전 알아야 할 모든 정보를 담아 이 가이드를 준비했습니다.', ja:'最高のトレイル、ダウンロード可能なGPSトラック、出発前に知っておくべきことをすべてまとめたガイドをご用意しました。', zh:'我们整理了这份指南，包含最佳徒步路线、可下载的GPS轨迹链接，以及出发前需要了解的一切。' },
  alertTitle:   { es:'No hay helicóptero de rescate en El Chaltén', en:'There is no rescue helicopter in El Chaltén', pt:'Não há helicóptero de resgate em El Chaltén', fr:"Il n'y a pas d'hélicoptère de secours à El Chaltén", de:'In El Chaltén gibt es keinen Rettungshubschrauber', ko:'엘 찰텐에는 구조 헬기가 없습니다', ja:'エル・チャルテンには救助ヘリコプターがありません', zh:'查尔腾没有救援直升机' },
  alertBody:    { es:'En El Chaltén operan dos equipos de rescate: la CAX del Centro Andino — voluntarios que pueden movilizar hasta 60 personas — y el personal de Parques Nacionales, que es mínimo en número. Ninguno cuenta con helicóptero dedicado. En emergencias serias, la evacuación puede tardar horas. Esto no es para asustar — es para que salgas preparado. La prevención es la única estrategia real en estas montañas.', en:'El Chaltén has two rescue teams: the CAX from the Andean Center — volunteers who can mobilize up to 60 people — and the National Parks staff, who are minimal in number. Neither has a dedicated helicopter. In serious emergencies, evacuation can take hours. This is not to scare you — it\'s so you leave prepared. Prevention is the only real strategy in these mountains.', pt:'Em El Chaltén operam duas equipes de resgate: a CAX do Centro Andino — voluntários que podem mobilizar até 60 pessoas — e o pessoal de Parques Nacionais, mínimo em número. Nenhuma conta com helicóptero dedicado. Em emergências sérias, a evacuação pode demorar horas. Isso não é para assustar — é para que você saia preparado. A prevenção é a única estratégia real nestas montanhas.', fr:"El Chaltén dispose de deux équipes de secours : la CAX du Centre Andin — des bénévoles pouvant mobiliser jusqu'à 60 personnes — et le personnel des Parcs Nationaux, en effectif minimal. Aucune ne dispose d'hélicoptère dédié. En cas d'urgence grave, l'évacuation peut prendre des heures. Ce n'est pas pour vous faire peur — c'est pour que vous partiez préparé. La prévention est la seule vraie stratégie dans ces montagnes.", de:'In El Chaltén gibt es zwei Rettungsteams: die CAX des Andean Centers — Freiwillige, die bis zu 60 Personen mobilisieren können — und das Personal der Nationalparks, das zahlenmäßig minimal ist. Keines verfügt über einen eigenen Hubschrauber. Bei ernsthaften Notfällen kann die Evakuierung Stunden dauern. Das soll keine Angst machen — sondern dafür sorgen, dass Sie vorbereitet aufbrechen. Prävention ist die einzige echte Strategie in diesen Bergen.', ko:'엘 찰텐에는 두 개의 구조대가 있습니다: 안데스 센터의 CAX — 최대 60명을 동원할 수 있는 자원봉사자 — 와 인원이 최소한인 국립공원 직원. 둘 다 전용 헬기가 없습니다. 심각한 응급 상황에서는 후송에 몇 시간이 걸릴 수 있습니다. 겁주려는 게 아닙니다 — 준비하고 나서길 바라는 마음입니다.', ja:'エル・チャルテンには2つの救助チームがあります：アンデスセンターのCAX（最大60人を動員できるボランティア）と、人数が最小限の国立公園スタッフ。どちらも専用ヘリコプターはありません。重大な緊急時には避難に数時間かかることがあります。怖がらせるためではなく、準備して出発してもらうためです。', zh:'查尔腾有两支救援队：安第斯中心的CAX（可动员多达60名志愿者）和国家公园工作人员（人数极少）。两支队伍都没有专用直升机。在严重紧急情况下，疏散可能需要数小时。这不是为了吓你——而是希望你有备而来。' },
  shortTitle:   { es:'Senderos Cortos', en:'Short Trails', pt:'Trilhas Curtas', fr:'Sentiers Courts', de:'Kurze Wanderwege', ko:'짧은 트레일', ja:'ショートトレイル', zh:'短途徒步' },
  shortMeta:    { es:'Menos de 5h · Fácil', en:'Under 5h · Easy', pt:'Menos de 5h · Fácil', fr:'Moins de 5h · Facile', de:'Unter 5h · Leicht', ko:'5시간 미만 · 쉬움', ja:'5時間未満・易しい', zh:'5小时以内·简单' },
  shortDesc:    { es:'Ideales para el primer día, familias o si el tiempo no acompaña.', en:'Ideal for your first day, families, or when the weather is unpredictable.', pt:'Ideais para o primeiro dia, famílias ou quando o tempo não ajuda.', fr:"Idéaux pour le premier jour, les familles ou quand le temps est capricieux.", de:'Ideal für den ersten Tag, Familien oder wenn das Wetter unbeständig ist.', ko:'첫날, 가족 단위, 또는 날씨가 좋지 않을 때 이상적입니다.', ja:'初日、ファミリー、天候が不安定な日に最適です。', zh:'适合第一天、家庭出游或天气不佳时。' },
  medTitle:     { es:'Senderos Medios', en:'Medium Trails', pt:'Trilhas Médias', fr:'Sentiers Moyens', de:'Mittlere Wanderwege', ko:'중간 트레일', ja:'ミドルトレイル', zh:'中等徒步' },
  medMeta:      { es:'5–8h · Moderado', en:'5–8h · Moderate', pt:'5–8h · Moderado', fr:'5–8h · Modéré', de:'5–8h · Mittel', ko:'5–8시간 · 보통', ja:'5〜8時間・普通', zh:'5–8小时·中等' },
  medDesc:      { es:'Los clásicos del Parque Nacional. Requieren buena condición física y salida temprana.', en:'The national park classics. Require good fitness and an early start.', pt:'Os clássicos do Parque Nacional. Requerem boa condição física e saída cedo.', fr:'Les classiques du Parc National. Nécessitent une bonne condition physique et un départ matinal.', de:'Die Klassiker des Nationalparks. Erfordern gute Kondition und einen frühen Start.', ko:'국립공원의 클래식 루트. 체력과 이른 출발이 필요합니다.', ja:'国立公園の定番コース。体力と早めの出発が必要です。', zh:'国家公园经典路线。需要良好体能和早出发。' },
  longTitle:    { es:'Senderos Largos', en:'Long Trails', pt:'Trilhas Longas', fr:'Longs Sentiers', de:'Lange Wanderwege', ko:'장거리 트레일', ja:'ロングトレイル', zh:'长距离徒步' },
  longMeta:     { es:'Día completo · Difícil', en:'Full day · Difficult', pt:'Dia completo · Difícil', fr:'Journée complète · Difficile', de:'Ganzer Tag · Schwer', ko:'하루 종일 · 어려움', ja:'終日・難しい', zh:'全天·困难' },
  longDesc:     { es:'Exigen experiencia, buena condición y salida antes de las 8am. Llevá bastones.', en:'Require experience, good fitness, and departure before 8am. Bring trekking poles.', pt:'Exigem experiência, boa condição física e saída antes das 8h. Leve bastões.', fr:'Exigent de l\'expérience, une bonne condition physique et un départ avant 8h. Prenez des bâtons.', de:'Erfordern Erfahrung, gute Fitness und Abfahrt vor 8 Uhr. Wanderstöcke mitnehmen.', ko:'경험, 체력, 오전 8시 전 출발이 필요합니다. 등산 스틱을 챙기세요.', ja:'経験・体力・8時前の出発が必要です。ストックを持参してください。', zh:'需要经验、良好体能和早上8点前出发。请携带徒步杖。' },
  roundtrip:    { es:'ida y vuelta', en:'round trip', pt:'ida e volta', fr:'aller-retour', de:'Hin und zurück', ko:'왕복', ja:'往復', zh:'往返' },
  elevation:    { es:'desnivel', en:'elevation gain', pt:'desnível', fr:'dénivelé', de:'Höhenunterschied', ko:'고도 차이', ja:'標高差', zh:'爬升高度' },
  duration:     { es:'duración', en:'duration', pt:'duração', fr:'durée', de:'Dauer', ko:'소요 시간', ja:'所要時間', zh:'时长' },
  easy:         { es:'Fácil', en:'Easy', pt:'Fácil', fr:'Facile', de:'Leicht', ko:'쉬움', ja:'易しい', zh:'简单' },
  moderate:     { es:'Moderado', en:'Moderate', pt:'Moderado', fr:'Modéré', de:'Mittel', ko:'보통', ja:'普通', zh:'中等' },
  hard:         { es:'Difícil', en:'Difficult', pt:'Difícil', fr:'Difficile', de:'Schwer', ko:'어려움', ja:'難しい', zh:'困难' },
  appsTitle:    { es:'Apps para los Senderos', en:'Trail Apps', pt:'Apps para as Trilhas', fr:'Applications pour les Sentiers', de:'Wander-Apps', ko:'트레일 앱', ja:'トレイルアプリ', zh:'户外徒步应用' },
  appsSub:      { es:'En el Parque Nacional no hay señal celular. Descargá los mapas la noche anterior.', en:'There is no cell service in the National Park. Download the maps the night before.', pt:'No Parque Nacional não há sinal celular. Baixe os mapas na noite anterior.', fr:"Il n'y a pas de réseau dans le Parc National. Téléchargez les cartes la veille.", de:'Im Nationalpark gibt es keinen Mobilfunkempfang. Lade die Karten am Vorabend herunter.', ko:'국립공원에는 휴대폰 신호가 없습니다. 전날 밤 지도를 다운로드하세요.', ja:'国立公園内では電波がありません。前日の夜にマップをダウンロードしてください。', zh:'国家公园内没有手机信号。请提前一晚下载地图。' },
  beforeTagline:{ es:'Antes de salir', en:'Before you go', pt:'Antes de sair', fr:'Avant de partir', de:'Bevor Sie aufbrechen', ko:'출발 전', ja:'出発前に', zh:'出发前' },
  beforeTitle:  { es:'Lo que necesitás saber', en:'What you need to know', pt:'O que você precisa saber', fr:'Ce que vous devez savoir', de:'Was Sie wissen müssen', ko:'알아야 할 것들', ja:'知っておくべきこと', zh:'出发前须知' },
  gearTitle:    { es:'Ropa y equipo', en:'Clothing & gear', pt:'Roupas e equipamentos', fr:'Vêtements et équipement', de:'Kleidung und Ausrüstung', ko:'의류 및 장비', ja:'服装と装備', zh:'服装与装备' },
  techTitle:    { es:'Tecnología y señal', en:'Technology & signal', pt:'Tecnologia e sinal', fr:'Technologie et réseau', de:'Technik und Empfang', ko:'기술 및 신호', ja:'テクノロジーと電波', zh:'技术与信号' },
  weatherTitle: { es:'El clima en Chaltén', en:'Weather in Chaltén', pt:'O clima em Chaltén', fr:'La météo à Chaltén', de:'Das Wetter in Chaltén', ko:'찰텐의 날씨', ja:'チャルテンの天気', zh:'查尔腾的天气' },
  rescueTitle:  { es:'Rescate: CAX + Parques', en:'Rescue: CAX + Parks', pt:'Resgate: CAX + Parques', fr:'Secours : CAX + Parcs', de:'Rettung: CAX + Parks', ko:'구조: CAX + 공원', ja:'救助：CAX＋公園', zh:'救援：CAX + 公园' },
  ctaTitle:     { es:'¿Tenés preguntas sobre los senderos?', en:'Questions about the trails?', pt:'Tem dúvidas sobre as trilhas?', fr:'Des questions sur les sentiers ?', de:'Fragen zu den Wanderwegen?', ko:'트레일에 대해 궁금한 점이 있나요?', ja:'トレイルについてご質問は？', zh:'对路线有疑问吗？' },
  ctaBody:      { es:'Somos locales y caminamos estos senderos regularmente. Escribinos por WhatsApp y te recomendamos el mejor trek según el tiempo disponible y el clima del día.', en:"We're locals and walk these trails regularly. Message us on WhatsApp and we'll recommend the best trek based on your time and the day's weather.", pt:'Somos locais e caminhamos estas trilhas regularmente. Escreva para nós pelo WhatsApp e recomendamos o melhor trek de acordo com o tempo disponível e o clima do dia.', fr:'Nous sommes locaux et parcourons ces sentiers régulièrement. Écrivez-nous sur WhatsApp et nous vous recommanderons le meilleur trek selon votre temps et la météo.', de:'Wir sind Einheimische und wandern regelmäßig auf diesen Wegen. Schreiben Sie uns per WhatsApp für eine persönliche Empfehlung.', ko:'우리는 현지인이며 이 트레일들을 정기적으로 걷습니다. WhatsApp으로 메시지를 보내주시면 최적의 트레킹을 추천해 드립니다.', ja:'私たちは地元民で、これらのトレイルを定期的に歩いています。WhatsAppでメッセージをいただければ、最適なトレックをお勧めします。', zh:'我们是当地人，经常在这些步道上行走。通过WhatsApp联系我们，我们将为您推荐最佳路线。' },
  ctaButton:    { es:'Consultanos por WhatsApp', en:'Ask us on WhatsApp', pt:'Fale conosco pelo WhatsApp', fr:'Contactez-nous sur WhatsApp', de:'Fragen Sie uns auf WhatsApp', ko:'WhatsApp으로 문의하기', ja:'WhatsAppでお問い合わせ', zh:'通过WhatsApp咨询' },
  photo:        { es:'Foto', en:'Photo', pt:'Foto', fr:'Photo', de:'Foto', ko:'사진', ja:'写真', zh:'照片' },
}

// Per-trail copy in all locales
const TRAIL_COPY: Record<string, Record<string, { name: string; desc: string; highlight: string }>> = {
  chorillo: {
    es: { name: 'Chorillo del Salto', desc: 'Cascada de más de 20 metros sobre el Río de las Vueltas, a 4 km del pueblo. Ideal para el primer día o para ir en familia. Se puede combinar con bici.', highlight: 'Perfecta para calentar piernas el primer día' },
    en: { name: 'Chorillo del Salto', desc: 'A waterfall over 20 m on the Río de las Vueltas, 4 km from town. Perfect for the first day or a family outing. Can be combined with a bike ride.', highlight: 'Perfect for warming up your legs on day one' },
    pt: { name: 'Chorillo del Salto', desc: 'Uma cachoeira de mais de 20 metros sobre o Rio de las Vueltas, a 4 km do vilarejo. Ideal para o primeiro dia ou para ir em família. Pode ser combinada com bicicleta.', highlight: 'Perfeita para aquecer as pernas no primeiro dia' },
    fr: { name: 'Chorillo del Salto', desc: 'Une cascade de plus de 20 m sur le Río de las Vueltas, à 4 km du village. Idéale pour le premier jour ou une sortie en famille. Peut se combiner avec du vélo.', highlight: 'Parfaite pour échauffer les jambes le premier jour' },
    de: { name: 'Chorillo del Salto', desc: 'Ein über 20 m hoher Wasserfall am Río de las Vueltas, 4 km vom Dorf. Ideal für den ersten Tag oder Familienausflug. Lässt sich mit einer Fahrradtour kombinieren.', highlight: 'Perfekt zum Aufwärmen am ersten Tag' },
    ko: { name: '쇼리요 델 살토', desc: '강마을에서 4km 떨어진 라스 부엘타스 강의 20미터 이상 폭포. 첫날이나 가족 나들이에 적합합니다.', highlight: '첫날 다리 워밍업에 완벽' },
    ja: { name: 'チョリージョ・デル・サルト', desc: '町から4km、ラス・ブエルタス川沿いの20m以上の滝。初日や家族の外出に最適。自転車と組み合わせることも可能。', highlight: '初日の足慣らしに最適' },
    zh: { name: '乔里略瀑布', desc: '距村庄4公里，位于拉斯布埃尔塔斯河上20余米的瀑布。适合第一天或家庭出游，可与骑自行车结合。', highlight: '第一天暖腿的完美选择' },
  },
  condores: {
    es: { name: 'Mirador de los Cóndores y Águilas', desc: 'Sale desde el Centro de Visitantes al borde norte del pueblo. Sendero señalizado con vistas del valle del Fitz Roy, el pueblo y los cerros. Dos miradores en loop, avistaje de cóndores frecuente.', highlight: 'La mejor introducción al paisaje de Chaltén' },
    en: { name: 'Condors & Eagles Viewpoint', desc: 'Starts at the Visitor Center at the northern edge of town. Marked trail with views of the Fitz Roy valley, the village, and surrounding peaks. Two viewpoints as a loop, frequent condor sightings.', highlight: 'The best introduction to Chaltén\'s landscape' },
    pt: { name: 'Mirante dos Cóndores e Águias', desc: 'Parte do Centro de Visitantes na borda norte do vilarejo. Trilha sinalizada com vistas do vale do Fitz Roy, o vilarejo e os cerros. Dois mirantes em loop, avistamento frequente de cóndores.', highlight: 'A melhor introdução à paisagem de Chaltén' },
    fr: { name: 'Mirador des Condors et des Aigles', desc: 'Départ depuis le Centre des Visiteurs au bord nord du village. Sentier balisé avec vues sur la vallée du Fitz Roy, le village et les sommets. Deux belvédères en boucle, condors fréquents.', highlight: 'La meilleure introduction au paysage de Chaltén' },
    de: { name: 'Kondor- und Adler-Aussichtspunkt', desc: 'Start am Besucherzentrum am nördlichen Ortsrand. Markierter Pfad mit Blick auf das Fitz-Roy-Tal, den Ort und die Gipfel. Zwei Aussichtspunkte als Rundweg, häufige Kondorsichtungen.', highlight: 'Die beste Einführung in die Landschaft von Chaltén' },
    ko: { name: '콘도르와 독수리 전망대', desc: '마을 북쪽 방문자 센터에서 출발. 피츠로이 계곡, 마을, 주변 봉우리가 보이는 표지판이 있는 트레일. 루프 형태로 두 개의 전망대.', highlight: '찰텐 경관을 처음 접하기에 최고' },
    ja: { name: 'コンドルとワシの展望台', desc: '北端のビジターセンターからスタート。フィッツロイ渓谷、村、周囲の峰々を望む標識付きトレイル。ループで2つの展望台、コンドルをよく目撃。', highlight: 'チャルテンの景観への最高のイントロ' },
    zh: { name: '秃鹰与雄鹰瞭望台', desc: '从村庄北端游客中心出发，标志明确，可俯瞰菲茨罗伊山谷、村庄和周围山峰。环形路线经过两个瞭望台，常见秃鹰出没。', highlight: '了解查尔腾风景的最佳起点' },
  },
  paredon: {
    es: { name: 'Paredón del Frente del Pueblo', desc: 'Al otro lado del río, cruzando el puente por calle Trevisan. Vistas del pueblo, del Río de las Vueltas, el Lago Viedma y el Fitz Roy desde una perspectiva diferente. Mucho menos concurrido.', highlight: 'La foto del pueblo que nadie tiene' },
    en: { name: 'Paredón del Frente del Pueblo', desc: 'Across the river, via the bridge on Trevisan street. Views of the village, Río de las Vueltas, Lago Viedma, and Fitz Roy from a completely different angle. Much less crowded.', highlight: 'The photo of the village nobody has' },
    pt: { name: 'Paredón del Frente del Pueblo', desc: 'Do outro lado do rio, cruzando a ponte pela rua Trevisan. Vistas do vilarejo, do Rio de las Vueltas, do Lago Viedma e do Fitz Roy de uma perspectiva diferente. Muito menos movimentado.', highlight: 'A foto do vilarejo que ninguém tem' },
    fr: { name: 'Paredón del Frente del Pueblo', desc: "De l'autre côté de la rivière, via le pont de la rue Trevisan. Vues sur le village, le Río de las Vueltas, le Lago Viedma et le Fitz Roy sous un angle complètement différent. Beaucoup moins fréquenté.", highlight: 'La photo du village que personne n\'a' },
    de: { name: 'Paredón del Frente del Pueblo', desc: 'Auf der anderen Flussseite, über die Brücke an der Trevisan-Straße. Blick auf Ort, Fluss, Lago Viedma und Fitz Roy aus einem anderen Winkel. Deutlich weniger besucht.', highlight: 'Das Foto des Dorfes, das niemand hat' },
    ko: { name: '파레돈 델 프렌테 델 푸에블로', desc: '트레비산 거리 다리를 건너 강 반대편. 마을, 강, 비에드마 호수, 피츠로이를 완전히 다른 각도에서 볼 수 있습니다. 훨씬 한적합니다.', highlight: '아무도 갖지 못한 마을 사진' },
    ja: { name: 'パレドン・デル・フレンテ・デル・プエブロ', desc: 'トレビサン通りの橋を渡った川の反対側。村、川、ビエドマ湖、フィッツロイを全く異なる角度から眺められます。ずっと空いています。', highlight: '誰も持っていない村の写真' },
    zh: { name: '村庄正面岩壁', desc: '穿过特雷维桑街的桥到河对岸，从完全不同的角度俯瞰村庄、河流、别德马湖和菲茨罗伊山。游客极少。', highlight: '没有人拍到过的村庄照片' },
  },
  cementerio: {
    es: { name: 'Cementerio de Escaladores', desc: 'En los márgenes del pueblo, cerca del Mirador de los Cóndores. El cementerio de quienes perdieron la vida en estas montañas. Un lugar de gran significado para la comunidad andinista mundial. No requiere entrada al parque.', highlight: 'Parada obligada para entender la dimensión de estas montañas' },
    en: { name: "Climbers' Cemetery", desc: "On the edge of town, near the Condors Viewpoint. The resting place of those who lost their lives on these mountains. Deeply significant for the global mountaineering community. No park entrance required.", highlight: 'A must-see to understand the scale of these mountains' },
    pt: { name: 'Cemitério dos Escaladores', desc: 'Nas margens do vilarejo, perto do Mirante dos Cóndores. O cemitério dos que perderam a vida nestas montanhas. De grande significado para a comunidade andinista mundial. Não requer entrada no parque.', highlight: 'Parada obrigatória para entender a dimensão destas montanhas' },
    fr: { name: 'Cimetière des Alpinistes', desc: "En bordure du village, près du Mirador des Condors. Le cimetière de ceux qui ont perdu la vie dans ces montagnes. Lieu d'une grande signification pour la communauté mondiale de l'alpinisme. Pas d'entrée au parc requise.", highlight: 'Étape incontournable pour comprendre ces montagnes' },
    de: { name: 'Bergsteiger-Friedhof', desc: 'Am Ortsrand, nahe dem Kondor-Aussichtspunkt. Der Friedhof jener, die ihr Leben in diesen Bergen verloren. Von großer Bedeutung für die weltweite Bergsteigergemeinschaft. Kein Parkeintritt.', highlight: 'Pflichtbesuch, um das Ausmaß dieser Berge zu begreifen' },
    ko: { name: '등산가의 묘지', desc: '마을 가장자리, 콘도르 전망대 근처. 이 산에서 생명을 잃은 이들의 안식처. 세계 등산 커뮤니티에서 매우 의미 있는 장소. 공원 입장권 불필요.', highlight: '이 산의 규모를 이해하기 위한 필수 방문지' },
    ja: { name: '登山家の墓地', desc: 'コンドル展望台近くの村はずれ。この山で命を落とした人々の安息の地。世界の登山コミュニティにとって深い意味を持つ場所。公園入場料不要。', highlight: 'これらの山の規模を理解するための必見スポット' },
    zh: { name: '登山者墓地', desc: '位于村庄边缘，秃鹰瞭望台附近。这里长眠着在这些山中失去生命的攀登者，对全球登山界具有深远意义。无需公园门票。', highlight: '了解这些山脉规模的必访之处' },
  },
  margarita: {
    es: { name: 'Cascada Margarita', desc: 'Los primeros 700 metros del sendero a Laguna Torre. La cascada cae al otro lado del cañón del río. Ideal si tenés poco tiempo o querés un calentamiento antes de un trek más largo. Requiere entrada al parque.', highlight: 'En 1 hora ya ves un paisaje increíble' },
    en: { name: 'Cascada Margarita', desc: 'The first 700 meters of the Laguna Torre trail. The waterfall drops on the far side of the river canyon. Ideal if you\'re short on time or want a warm-up before a longer trek. Park entrance required.', highlight: 'In 1 hour you\'re already seeing an incredible landscape' },
    pt: { name: 'Cascata Margarita', desc: 'Os primeiros 700 metros da trilha para Laguna Torre. A cachoeira cai do outro lado do cânion do rio. Ideal se você tem pouco tempo ou quer um aquecimento. Requer entrada no parque.', highlight: 'Em 1 hora você já vê uma paisagem incrível' },
    fr: { name: 'Cascade Margarita', desc: 'Les premiers 700 mètres du sentier menant à la Laguna Torre. La cascade tombe de l\'autre côté du canyon. Idéale si vous êtes pressé ou souhaitez un échauffement. Entrée au parc requise.', highlight: 'En 1 heure, vous admirez déjà un paysage incroyable' },
    de: { name: 'Wasserfall Margarita', desc: 'Die ersten 700 Meter des Wegs zur Laguna Torre. Der Wasserfall stürzt auf der anderen Seite des Flusskanons. Ideal bei wenig Zeit oder als Aufwärmung. Parkeintritt erforderlich.', highlight: 'Nach 1 Stunde siehst du bereits eine unglaubliche Landschaft' },
    ko: { name: '마르가리타 폭포', desc: '라구나 토레 트레일의 첫 700미터. 강 협곡 반대편으로 폭포가 떨어집니다. 시간이 부족하거나 워밍업으로 적합. 공원 입장권 필요.', highlight: '1시간 만에 믿을 수 없는 풍경을 만납니다' },
    ja: { name: 'カスカダ・マルガリータ', desc: 'ラグナ・トーレのトレイルの最初の700m。川の渓谷の向こう側に滝が落ちます。時間が少ない方や長いトレックの前のウォームアップに最適。公園入場料必要。', highlight: '1時間で素晴らしい景色に出会えます' },
    zh: { name: '玛格丽特瀑布', desc: '通往托雷湖步道的前700米。瀑布从河谷对面倾泻而下。适合时间有限或想要热身的人。需要公园门票。', highlight: '1小时内即可欣赏到令人叹为观止的风景' },
  },
  capri: {
    es: { name: 'Laguna Capri + Mirador Fitz Roy', desc: 'Comparte el inicio con Laguna de los Tres pero se termina en Laguna Capri (~4 km del pueblo). En días tranquilos la laguna refleja el Fitz Roy. Opción perfecta si no querés hacer el día completo.', highlight: 'El 80% de la vista del Fitz Roy con el 50% del esfuerzo' },
    en: { name: 'Laguna Capri + Fitz Roy Viewpoint', desc: 'Shares the start with Laguna de los Tres but ends at Laguna Capri (~4 km from town). On calm days the lagoon mirrors Fitz Roy. Perfect if you don\'t want to do the full day.', highlight: '80% of the Fitz Roy view with 50% of the effort' },
    pt: { name: 'Laguna Capri + Mirante Fitz Roy', desc: 'Compartilha o início com Laguna de los Tres, mas termina na Laguna Capri (~4 km do vilarejo). Em dias calmos, a lagoa reflete o Fitz Roy. Opção perfeita para quem não quer fazer o dia completo.', highlight: '80% da vista do Fitz Roy com 50% do esforço' },
    fr: { name: 'Laguna Capri + Mirador Fitz Roy', desc: 'Partage le départ avec la Laguna de los Tres mais se termine à la Laguna Capri (~4 km du village). Par temps calme, la lagune reflète le Fitz Roy. Option parfaite pour une journée partielle.', highlight: '80% de la vue sur le Fitz Roy avec 50% de l\'effort' },
    de: { name: 'Laguna Capri + Fitz-Roy-Aussichtspunkt', desc: 'Teilt den Start mit der Laguna de los Tres, endet aber an der Laguna Capri (~4 km vom Ort). An ruhigen Tagen spiegelt der See den Fitz Roy. Perfekt für einen Halbtag.', highlight: '80% des Fitz-Roy-Ausblicks mit 50% des Aufwands' },
    ko: { name: '라구나 카프리 + 피츠로이 전망대', desc: '라구나 데 로스 트레스와 출발점을 공유하지만 라구나 카프리(마을에서 약 4km)에서 끝납니다. 잔잔한 날엔 호수에 피츠로이가 반영됩니다.', highlight: '피츠로이 전망의 80%를 50%의 노력으로' },
    ja: { name: 'ラグナ・カプリ + フィッツロイ展望台', desc: 'ラグナ・デ・ロス・トレスと出発点を共有しますが、ラグナ・カプリ（町から約4km）で終わります。穏やかな日はフィッツロイが湖に映ります。', highlight: '50%の努力でフィッツロイの景色の80%を得られる' },
    zh: { name: '卡普里湖 + 菲茨罗伊瞭望台', desc: '与三湖步道共享起点，但在卡普里湖（距村庄约4公里）结束。平静的日子里湖面倒映菲茨罗伊山。不想走全程的最佳选择。', highlight: '50%的体力获得80%的菲茨罗伊风景' },
  },
  torre: {
    es: { name: 'Laguna Torre + Mirador Maestri', desc: 'El clásico de la cara del Cerro Torre. Sigue el valle a través de bosques de lenga, mallines y morenas hasta la laguna con el Cerro Torre (3128 m) enfrente. El Mirador Maestri da vista directa al Glaciar Grande.', highlight: 'Una de las vistas más dramáticas de la Patagonia' },
    en: { name: 'Laguna Torre + Mirador Maestri', desc: 'The classic facing Cerro Torre. Follows the valley through lenga beech forests, wetlands and moraines to the lagoon with Cerro Torre (3128 m) ahead. Mirador Maestri gives a direct view of Glaciar Grande.', highlight: 'One of the most dramatic views in Patagonia' },
    pt: { name: 'Laguna Torre + Mirador Maestri', desc: 'O clássico da face do Cerro Torre. Segue o vale por florestas de lenga, pântanos e morenas até a lagoa com o Cerro Torre (3128 m) à frente.', highlight: 'Uma das vistas mais dramáticas da Patagônia' },
    fr: { name: 'Laguna Torre + Mirador Maestri', desc: 'Le classique face au Cerro Torre. Suit la vallée à travers forêts de lenga, zones humides et moraines jusqu\'au lac avec le Cerro Torre (3128 m) en face.', highlight: "L'un des panoramas les plus spectaculaires de Patagonie" },
    de: { name: 'Laguna Torre + Mirador Maestri', desc: 'Der Klassiker mit Blick auf den Cerro Torre. Folgt dem Tal durch Lenga-Wälder, Feuchtgebiete und Moränen bis zum See mit dem Cerro Torre (3128 m) direkt davor.', highlight: 'Eine der dramatischsten Aussichten in Patagonien' },
    ko: { name: '라구나 토레 + 마에스트리 전망대', desc: '세로 토레 방향의 클래식 루트. 렝가 너도밤나무 숲, 습지, 빙퇴석을 지나 세로 토레(3128m)가 보이는 호수까지 이어집니다.', highlight: '파타고니아에서 가장 극적인 전망 중 하나' },
    ja: { name: 'ラグナ・トーレ + マエストリ展望台', desc: 'セロ・トーレに面したクラシックルート。レンガブナの森、湿地、モレーンを抜けてセロ・トーレ（3128m）が正面に見える湖へ。', highlight: 'パタゴニアで最もドラマチックな景色のひとつ' },
    zh: { name: '托雷湖 + 马埃斯特里瞭望台', desc: '面向塞罗托雷的经典路线，穿过南青冈森林、湿地和冰碛，到达塞罗托雷（3128米）正前方的湖泊。', highlight: '巴塔哥尼亚最壮观的景色之一' },
  },
  tres: {
    es: { name: 'Laguna de los Tres — Fitz Roy', desc: 'El trekking emblema de El Chaltén. Culmina en Laguna de los Tres (1170 m) con el Fitz Roy (3405 m) enfrente. La subida final son 400 m empinados. En días claros es una de las vistas más fotografiadas del planeta.', highlight: 'El trekking más icónico de Argentina — hacelo sí o sí' },
    en: { name: 'Laguna de los Tres — Fitz Roy', desc: 'El Chaltén\'s signature trek. Ends at Laguna de los Tres (1170 m) with Fitz Roy (3405 m) straight ahead. The final climb is a steep 400 m. On clear days, one of the most photographed views on Earth.', highlight: "Argentina's most iconic trek — don't leave without doing it" },
    pt: { name: 'Laguna de los Tres — Fitz Roy', desc: 'O trekking emblema de El Chaltén. Termina na Laguna de los Tres (1170 m) com o Fitz Roy (3405 m) à frente. A subida final são 400 m íngremes. Em dias claros é uma das vistas mais fotografadas do planeta.', highlight: 'O trekking mais icônico da Argentina — não vá embora sem fazer' },
    fr: { name: 'Laguna de los Tres — Fitz Roy', desc: "Le trek emblématique d'El Chaltén. Se termine à la Laguna de los Tres (1170 m) avec le Fitz Roy (3405 m) en face. La montée finale est une pente raide de 400 m. Par temps clair, l'un des panoramas les plus photographiés de la planète.", highlight: "Le trek le plus emblématique d'Argentine — à faire absolument" },
    de: { name: 'Laguna de los Tres — Fitz Roy', desc: 'Der Vorzeige-Trek von El Chaltén. Endet an der Laguna de los Tres (1170 m) mit dem Fitz Roy (3405 m) direkt davor. Der letzte Aufstieg ist ein steiler 400-m-Anstieg. Bei klarem Wetter einer der meistfotografierten Aussichtspunkte weltweit.', highlight: "Argentiniens ikonischster Trek — ein absolutes Muss" },
    ko: { name: '라구나 데 로스 트레스 — 피츠로이', desc: '엘 찰텐의 대표 트레킹. 라구나 데 로스 트레스(1170m)에서 피츠로이(3405m)를 정면으로 바라봅니다. 마지막 400m는 급경사. 맑은 날에는 지구상에서 가장 많이 사진 찍히는 풍경 중 하나.', highlight: '아르헨티나에서 가장 상징적인 트레킹 — 반드시 해야 합니다' },
    ja: { name: 'ラグナ・デ・ロス・トレス — フィッツロイ', desc: 'エル・チャルテンを代表するトレック。ラグナ・デ・ロス・トレス（1170m）でフィッツロイ（3405m）を正面に見ます。最後の400mは急勾配。晴れた日は地球上で最も写真に撮られる景色のひとつ。', highlight: 'アルゼンチン最も象徴的なトレック — 絶対にやるべき' },
    zh: { name: '三湖 — 菲茨罗伊', desc: '查尔腾的标志性徒步。终点是海拔1170米的三湖，菲茨罗伊山（3405米）近在眼前。最后400米极为陡峭。天晴时是地球上被拍摄最多的景色之一。', highlight: '阿根廷最具标志性的徒步——绝对不能错过' },
  },
  pliegue: {
    es: { name: 'Loma del Pliegue Tumbado', desc: 'El mirador de 360° que lo muestra todo: Fitz Roy, Cerro Torre, Valle del Torre, Lago Viedma y el Campo de Hielo Sur. Mucho menos concurrido que Laguna de los Tres, pero exige buen estado físico.', highlight: 'Vista de 360° — el único lugar donde ves TODO al mismo tiempo' },
    en: { name: 'Loma del Pliegue Tumbado', desc: 'The 360° viewpoint that shows everything: Fitz Roy, Cerro Torre, Torre Valley, Lago Viedma, and the Southern Ice Field. Much less crowded than Laguna de los Tres but demands good fitness.', highlight: '360° view — the only place where you see EVERYTHING at once' },
    pt: { name: 'Loma del Pliegue Tumbado', desc: 'O mirante de 360° que mostra tudo: Fitz Roy, Cerro Torre, Vale do Torre, Lago Viedma e o Campo de Gelo Sul. Muito menos movimentado que a Laguna de los Tres, mas exige boa condição física.', highlight: 'Vista de 360° — o único lugar onde você vê TUDO ao mesmo tempo' },
    fr: { name: 'Loma del Pliegue Tumbado', desc: 'Le belvédère à 360° qui montre tout : Fitz Roy, Cerro Torre, Vallée du Torre, Lago Viedma et le Champ de Glace Sud. Beaucoup moins fréquenté que la Laguna de los Tres mais exigeant physiquement.', highlight: 'Vue à 360° — le seul endroit où vous voyez TOUT en même temps' },
    de: { name: 'Loma del Pliegue Tumbado', desc: 'Der 360°-Aussichtspunkt, der alles zeigt: Fitz Roy, Cerro Torre, Torre-Tal, Lago Viedma und Südliches Eisfeld. Deutlich weniger besucht als die Laguna de los Tres, aber körperlich anspruchsvoll.', highlight: '360°-Aussicht — der einzige Ort, wo man ALLES auf einmal sieht' },
    ko: { name: '로마 델 플리에게 툼바도', desc: '모든 것을 보여주는 360° 전망대: 피츠로이, 세로 토레, 토레 계곡, 비에드마 호수, 남부 빙원. 라구나 데 로스 트레스보다 훨씬 한적하지만 체력이 필요합니다.', highlight: '360° 전망 — 모든 것을 한눈에 볼 수 있는 유일한 장소' },
    ja: { name: 'ロマ・デル・プリエゲ・トゥンバド', desc: 'すべてが見える360°展望台：フィッツロイ、セロ・トーレ、トーレ渓谷、ビエドマ湖、南部氷原。ラグナ・デ・ロス・トレスよりずっと空いていますが、体力が必要です。', highlight: '360°の眺め — すべてを一度に見られる唯一の場所' },
    zh: { name: '洛马德尔普利耶格图姆巴多', desc: '可以看到一切的360°瞭望台：菲茨罗伊、塞罗托雷、托雷山谷、别德马湖和南部冰原。比三湖人少得多，但对体能要求高。', highlight: '360°视野 — 唯一一次能看到一切的地方' },
  },
}

function t(key: string, locale: string): string {
  return T[key]?.[locale] ?? T[key]?.['en'] ?? key
}

function tc(trailKey: string, field: 'name' | 'desc' | 'highlight', locale: string): string {
  return TRAIL_COPY[trailKey]?.[locale]?.[field] ?? TRAIL_COPY[trailKey]?.['en']?.[field] ?? ''
}

const difficultyStyle: Record<string, string> = {
  easy: 'bg-emerald-100 text-emerald-800',
  moderate: 'bg-amber-100 text-amber-800',
  hard: 'bg-red-100 text-red-800',
}

function TrailCard({ trail, locale }: { trail: Trail; locale: string }) {
  const name = tc(trail.key, 'name', locale)
  const desc = tc(trail.key, 'desc', locale)
  const highlight = tc(trail.key, 'highlight', locale)
  const diffLabel = t(trail.difficulty, locale)

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-surface hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col">
      {/* Photo */}
      {trail.photo && (
        <div className="relative aspect-[16/9] overflow-hidden bg-surface">
          <img
            src={trail.photo.url}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-3 py-2">
            <p className="text-white/70 text-[10px]">
              {t('photo', locale)}: <a href={trail.photo.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">{trail.photo.author}</a> · {trail.photo.license}
            </p>
          </div>
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-start gap-2 mb-3">
          <span className="text-2xl shrink-0">{trail.emoji}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading text-lg text-primary leading-tight">{name}</h3>
            <span className={`inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full ${difficultyStyle[trail.difficulty]}`}>
              {diffLabel}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-3 py-3 border-y border-surface">
          <div className="text-center">
            <MapPin className="w-3 h-3 text-muted mx-auto mb-0.5" />
            <p className="text-sm font-semibold text-primary">{trail.distance}</p>
            <p className="text-[10px] text-muted">{t('roundtrip', locale)}</p>
          </div>
          <div className="text-center border-x border-surface">
            <TrendingUp className="w-3 h-3 text-muted mx-auto mb-0.5" />
            <p className="text-sm font-semibold text-primary">+{trail.elevation}</p>
            <p className="text-[10px] text-muted">{t('elevation', locale)}</p>
          </div>
          <div className="text-center">
            <Clock className="w-3 h-3 text-muted mx-auto mb-0.5" />
            <p className="text-sm font-semibold text-primary">{trail.duration}</p>
            <p className="text-[10px] text-muted">{t('duration', locale)}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted leading-relaxed mb-3 flex-1">{desc}</p>

        {/* Highlight */}
        <p className="text-xs font-medium text-accent bg-accent/5 rounded-lg px-3 py-2 mb-4">
          💡 {highlight}
        </p>

        {/* Links */}
        {(trail.wikiloc || trail.alltrails) && (
          <div className="flex gap-2 flex-wrap">
            {trail.wikiloc && (
              <a href={trail.wikiloc} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium text-primary bg-surface hover:bg-primary hover:text-white rounded-lg px-3 py-2 transition-colors">
                <ExternalLink className="w-3 h-3" />Wikiloc
              </a>
            )}
            {trail.alltrails && (
              <a href={trail.alltrails} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium text-primary bg-surface hover:bg-primary hover:text-white rounded-lg px-3 py-2 transition-colors">
                <ExternalLink className="w-3 h-3" />AllTrails
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function SectionHeader({ emoji, title, meta, desc, bg = false }: { emoji: string; title: string; meta: string; desc: string; bg?: boolean }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-2 flex-wrap">
        <span className="text-2xl">{emoji}</span>
        <h2 className="font-heading text-3xl text-primary">{title}</h2>
        <span className={`text-sm text-muted px-3 py-1 rounded-full ${bg ? 'bg-white border border-surface' : 'bg-surface'}`}>{meta}</span>
      </div>
      <p className="text-muted ml-11">{desc}</p>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function TrekkingPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const l = locale as Locale

  return (
    <>
      {/* Hero */}
      <section className="py-24 sm:py-32 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-6">
            {t('tagline', l)}
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-primary mb-8 leading-tight whitespace-pre-line">
            {t('heroTitle', l)}
          </h1>
          <p className="text-lg text-muted leading-relaxed max-w-2xl mx-auto">
            {t('heroSub', l)}
          </p>
        </div>
      </section>

      {/* Alerta rescate */}
      <section className="pb-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex gap-4">
            <div className="shrink-0">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <div>
              <h2 className="font-semibold text-amber-900 mb-2">{t('alertTitle', l)}</h2>
              <p className="text-sm text-amber-800 leading-relaxed">{t('alertBody', l)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Senderos cortos */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader emoji="🌿" title={t('shortTitle', l)} meta={t('shortMeta', l)} desc={t('shortDesc', l)} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SHORT_TRAILS.map(trail => <TrailCard key={trail.key} trail={trail} locale={l} />)}
          </div>
        </div>
      </section>

      {/* Senderos medios */}
      <section className="py-16 bg-surface/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader emoji="🥾" title={t('medTitle', l)} meta={t('medMeta', l)} desc={t('medDesc', l)} bg />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl">
            {MEDIUM_TRAILS.map(trail => <TrailCard key={trail.key} trail={trail} locale={l} />)}
          </div>
        </div>
      </section>

      {/* Senderos largos */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader emoji="🏔️" title={t('longTitle', l)} meta={t('longMeta', l)} desc={t('longDesc', l)} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl">
            {LONG_TRAILS.map(trail => <TrailCard key={trail.key} trail={trail} locale={l} />)}
          </div>
        </div>
      </section>

      {/* Apps */}
      <section className="py-16 bg-primary text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <Smartphone className="w-7 h-7 text-white/60" />
            <h2 className="font-heading text-3xl text-white">{t('appsTitle', l)}</h2>
          </div>
          <p className="text-white/70 mb-10 ml-10">{t('appsSub', l)}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🥇</span>
                <h3 className="font-semibold text-white text-lg">AllTrails</h3>
                <span className="text-xs bg-accent/80 text-white px-2 py-0.5 rounded-full">★</span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-4">Interfaz simple, miles de reseñas con fotos, mapas offline con Plus (USD 36/año). La más recomendada para turistas.</p>
              <a href="https://www.alltrails.com/argentina/santa-cruz/el-chalten" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium text-white/90 hover:text-white transition-colors">
                <ExternalLink className="w-3 h-3" />alltrails.com/el-chalten
              </a>
            </div>
            <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🥈</span>
                <h3 className="font-semibold text-white text-lg">Wikiloc</h3>
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-4">Dominante en Sudamérica. Excelente base de tracks GPS comunitarios. Premium muy económico (USD 10/año).</p>
              <a href="https://www.wikiloc.com/trails/hiking/argentina/santa-cruz/el-chalten" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium text-white/90 hover:text-white transition-colors">
                <ExternalLink className="w-3 h-3" />wikiloc.com/el-chalten
              </a>
            </div>
            <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🗺️</span>
                <h3 className="font-semibold text-white text-lg">Gaia GPS</h3>
                <span className="text-xs bg-white/20 text-white/80 px-2 py-0.5 rounded-full">Pro</span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-4">Para trekkers experimentados o rutas multi-day. Las mejores capas topográficas del mercado (USD 40/año).</p>
              <a href="https://www.gaiagps.com" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium text-white/90 hover:text-white transition-colors">
                <ExternalLink className="w-3 h-3" />gaiagps.com
              </a>
            </div>
          </div>
          <div className="mt-8 bg-white/5 rounded-xl px-6 py-4 border border-white/10 flex gap-3 items-start">
            <Zap className="w-5 h-5 text-accent mt-0.5 shrink-0" />
            <p className="text-sm text-white/80 leading-relaxed">
              <strong className="text-white">Offline:</strong> AllTrails → descargar área desde "Mapas". Wikiloc → guardar track y elegir "Descargar mapa". Siempre <strong className="text-white">probá en modo avión</strong> antes de salir.
            </p>
          </div>
        </div>
      </section>

      {/* Antes de salir */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-4">{t('beforeTagline', l)}</p>
            <h2 className="font-heading text-3xl sm:text-4xl text-primary">{t('beforeTitle', l)}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-surface">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center"><span className="text-xl">🧥</span></div>
                <h3 className="font-semibold text-primary text-lg">{t('gearTitle', l)}</h3>
              </div>
              <ul className="space-y-2.5">
                {[
                  ['🍃', 'Chaqueta cortaviento impermeable — prioridad sobre todo lo demás'],
                  ['🧅', 'Capas: base moisture-wicking + mid layer abrigado'],
                  ['🧤', 'Gorro, guantes y buff — incluso en verano'],
                  ['🪄', 'Bastones de trekking — críticos en descensos y viento fuerte'],
                  ['💡', 'Linterna frontal — los treks largos pueden extenderse'],
                  ['🩹', 'Botiquín básico — curitas para ampollas como mínimo'],
                ].map(([icon, text]) => (
                  <li key={text} className="flex gap-2 text-sm text-muted"><span className="shrink-0">{icon}</span><span>{text}</span></li>
                ))}
              </ul>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-surface">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center"><span className="text-xl">📱</span></div>
                <h3 className="font-semibold text-primary text-lg">{t('techTitle', l)}</h3>
              </div>
              <ul className="space-y-2.5">
                {[
                  ['🔋', 'Power bank — el GPS drena la batería rápido con el frío'],
                  ['📵', 'Sin señal en el parque — descargá mapas la noche anterior'],
                  ['📶', 'En el pueblo: Claro 4G funciona. Personal no tiene cobertura.'],
                  ['💳', 'Entrada al parque: solo tarjeta (no efectivo), online o kiosco'],
                  ['🌡️', 'Revisá Windy.com antes de salir — las ráfagas importan más que la temperatura'],
                  ['🔭', 'Ideal salir antes de las 8am en los treks difíciles'],
                ].map(([icon, text]) => (
                  <li key={text} className="flex gap-2 text-sm text-muted"><span className="shrink-0">{icon}</span><span>{text}</span></li>
                ))}
              </ul>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-surface">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center"><span className="text-xl">🌬️</span></div>
                <h3 className="font-semibold text-primary text-lg">{t('weatherTitle', l)}</h3>
              </div>
              <p className="text-sm text-muted leading-relaxed mb-3">El tiempo puede cambiar en minutos. Ráfagas de hasta <strong className="text-dark">120 km/h</strong> son posibles incluso en verano. Si el viento te obliga a usar los brazos para equilibrarte, es señal de peligro: <strong className="text-dark">dar vuelta</strong>.</p>
              <p className="text-sm text-muted leading-relaxed">No hay sistema de alerta meteorológica automático para senderos. Preguntá a otros que vuelven del cerro antes de subir.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-surface">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center"><Shield className="w-5 h-5 text-red-500" /></div>
                <h3 className="font-semibold text-primary text-lg">{t('rescueTitle', l)}</h3>
              </div>
              <p className="text-sm text-muted leading-relaxed mb-3">
                La <strong className="text-dark">CAX (Comisión de Auxilio)</strong> del Centro Andino El Chaltén es un equipo de <strong className="text-dark">voluntarios que puede movilizar hasta 60 personas</strong>. El <strong className="text-dark">personal de Parques Nacionales</strong> también interviene en rescates pero es mínimo en número. Ninguno cuenta con helicóptero dedicado.
              </p>
              <p className="text-sm text-muted leading-relaxed">
                Emergencias: <strong className="text-dark">+54 2962 493040</strong> (Delegación Parque Nacional)
              </p>
            </div>
          </div>
        </div>
      </section>

      <ContentPageBookingCTA locale={l} variant="trekking" />
    </>
  )
}
