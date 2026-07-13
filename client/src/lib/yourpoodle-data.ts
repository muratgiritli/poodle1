export interface GuideCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;       // tailwind color name: orange, green, purple, etc.
  badge?: string;
  subcategories: string[];
  route: string;
}

export const GUIDE_CATEGORIES: GuideCategory[] = [
  {
    id: "yavru-toy-poodle",
    title: "Yavru Toy Poodle",
    description: "Yavru Toy Poodle'ın eve gelişinden temel bakım ve eğitimine kadar ilk dönem rehberi.",
    icon: "🐾",
    color: "orange",
    badge: "Başlangıç",
    route: "/yourpoodle/rehber/yavru-toy-poodle",
    subcategories: [
      "Eve İlk Geliş", "İlk Gün Yapılması Gerekenler", "İlk Gece", "İlk Oyuncak",
      "İlk Mama", "İlk Veteriner", "İlk Aşılar", "İlk Tuvalet Eğitimi",
      "İlk Banyo", "İlk Tarama", "İlk Tıraş", "Sosyalleştirme",
      "Isırma Problemi", "Havlama", "Yalnız Kalma", "Kafes Eğitimi",
    ],
  },
  {
    id: "beslenme",
    title: "Beslenme",
    description: "Yaşına, kilosuna ve özel ihtiyaçlarına göre doğru beslenme rehberi.",
    icon: "🍖",
    color: "green",
    route: "/yourpoodle/rehber/beslenme",
    subcategories: [
      "Mama Seçimi", "Mama Hesaplama", "Günlük Mama Miktarı", "Yavru Mama",
      "Yetişkin Mama", "Senior Mama", "Kısırlaştırılmış Mama", "Tahılsız Mama",
      "Hassas Sindirim", "Ödül Mamaları", "Vitaminler", "Takviyeler",
      "Su Tüketimi", "Yasak Yiyecekler", "Ev Yemeği Verilir mi?",
    ],
  },
  {
    id: "bakim",
    title: "Bakım",
    description: "Tüy, göz, kulak, diş ve pati bakımının tüm detayları.",
    icon: "✂️",
    color: "purple",
    route: "/yourpoodle/rehber/bakim",
    subcategories: [
      "Tarama", "Tıraş", "Göz Temizliği", "Kulak Temizliği",
      "Diş Bakımı", "Tırnak Kesimi", "Pati Bakımı", "Gözyaşı Lekesi",
      "Şampuan Seçimi", "Tüy Açıcılar", "Koku Problemi",
    ],
  },
  {
    id: "saglik",
    title: "Sağlık",
    description: "Toy Poodle'larda görülen sağlık sorunları, belirtiler ve koruyucu bakım.",
    icon: "💊",
    color: "red",
    route: "/yourpoodle/rehber/saglik",
    subcategories: [
      "Hastalıklar", "Aşı Takvimi", "İç Parazit", "Dış Parazit",
      "Bit", "Kene", "Pire", "Kusma", "İshal", "Ateş",
      "Göz Hastalıkları", "Kulak Hastalıkları", "Diş Hastalıkları",
      "Kalça Problemleri", "Diz Problemleri", "Solunum Problemleri", "Acil Durumlar",
    ],
  },
  {
    id: "egitim",
    title: "Eğitim",
    description: "Temel komutlardan tuvalet ve sosyalleşme eğitimine kadar uygulamalı rehber.",
    icon: "🎓",
    color: "blue",
    route: "/yourpoodle/rehber/egitim",
    subcategories: [
      "Tuvalet Eğitimi", "Havlama Eğitimi", "Isırma Eğitimi",
      "Otur Komutu", "Bekle Komutu", "Gel Komutu", "Tasma Eğitimi",
      "Kafes Eğitimi", "Sosyalleşme", "Ev Kuralları",
      "Çocuklarla İletişim", "Diğer Köpeklerle İletişim",
    ],
  },
  {
    id: "davranis",
    title: "Davranış",
    description: "Toy Poodle davranışlarını anlama ve sorunlara doğru yaklaşım rehberi.",
    icon: "🧠",
    color: "amber",
    route: "/yourpoodle/rehber/davranis",
    subcategories: [
      "Çok Havlıyor", "Çok Isırıyor", "Sürekli Ağlıyor", "Sürekli Uyuyor",
      "Sürekli Kaşınıyor", "Eşyaları Kemiriyor", "Tuvalet Kaçırıyor",
      "Yalnız Kalamıyor", "Sahibine Bağlılık", "Kıskançlık", "Korkular", "Stres",
    ],
  },
  {
    id: "seyahat",
    title: "Seyahat",
    description: "Toy Poodle ile güvenli ve konforlu yolculuk için gereken bilgiler.",
    icon: "✈️",
    color: "teal",
    route: "/yourpoodle/rehber/seyahat",
    subcategories: [
      "Arabayla Yolculuk", "Uçak Yolculuğu", "Otobüs Yolculuğu", "Tren Yolculuğu",
      "Otel Seçimi", "Pet Friendly Yerler", "Seyahat Çantası", "Seyahat Listesi",
    ],
  },
  {
    id: "mevsim-bakimi",
    title: "Mevsim Bakımı",
    description: "Yaz, kış ve mevsim geçişlerinde Toy Poodle bakımı.",
    icon: "🌤️",
    color: "sky",
    route: "/yourpoodle/rehber/mevsim-bakimi",
    subcategories: [
      "Yaz Bakımı", "Kış Bakımı", "İlkbahar Bakımı", "Sonbahar Bakımı",
      "Sıcak Çarpması", "Karlı Hava", "Yağmurlu Günler",
    ],
  },
  {
    id: "yasam",
    title: "Yaşam",
    description: "Toy Poodle ile ev, apartman, çocuk ve diğer hayvanlarla yaşam rehberi.",
    icon: "🏠",
    color: "indigo",
    route: "/yourpoodle/rehber/yasam",
    subcategories: [
      "Evde Yaşam", "Bahçede Yaşam", "Apartmanda Bakım",
      "Çocuklu Ev", "Yaşlılarla Yaşam", "İkinci Köpek", "Kedi ile Yaşam",
    ],
  },
  {
    id: "urun-rehberi",
    title: "Ürün Rehberi",
    description: "Toy Poodle için doğru ürünleri seçmeye yardımcı olan alışveriş rehberi.",
    icon: "🛍️",
    color: "pink",
    route: "/yourpoodle/rehber/urun-rehberi",
    subcategories: [
      "Mama", "Tasma", "Göğüs Tasması", "Yatak", "Taşıma Çantası",
      "Tarak", "Şampuan", "Diş Fırçası", "Eğitim Pedi", "Oyuncak", "Mama Kabı",
    ],
  },
  {
    id: "yasa-gore",
    title: "Yaşa Göre Rehber",
    description: "Her yaş dönemine özel bakım, beslenme ve sağlık önerileri.",
    icon: "📅",
    color: "violet",
    route: "/yourpoodle/rehber/yasa-gore",
    subcategories: [
      "2 Aylık Toy Poodle", "3 Aylık Toy Poodle", "4 Aylık Toy Poodle",
      "5 Aylık Toy Poodle", "6 Aylık Toy Poodle", "7–12 Aylık Toy Poodle",
      "1 Yaş", "2 Yaş", "3 Yaş", "5 Yaş", "7+ Yaş", "10+ Yaş",
    ],
  },
  {
    id: "sik-sorulan-sorular",
    title: "Sık Sorulan Sorular",
    description: "Toy Poodle sahiplerinin en sık sorduğu soruların kısa ve net cevapları.",
    icon: "❓",
    color: "slate",
    route: "/yourpoodle/rehber/sik-sorulan-sorular",
    subcategories: [
      "Toy Poodle kaç yıl yaşar?", "Ne kadar mama yer?", "Ne zaman tıraş olur?",
      "Çok havlıyor, ne yapmalıyım?", "Ne zaman çiftleşir?",
      "Tuvalet eğitimi kaç günde olur?", "Hangi mama daha iyi?",
      "Günde kaç kez yürüyüş yapılmalı?",
    ],
  },
  {
    id: "hesaplama-araclari",
    title: "Hesaplama Araçları",
    description: "Günlük bakım ve sağlık ihtiyaçlarını hesaplayan ücretsiz araçlar.",
    icon: "🧮",
    color: "emerald",
    route: "/yourpoodle/araclar",
    subcategories: [
      "Mama Hesaplama", "Su Hesaplama", "Kalori Hesaplama", "Yaş Hesaplama",
      "İdeal Kilo Hesaplama", "Tüy Bakım Takvimi", "Aşı Takvimi", "Doğum Günü Hesaplama",
    ],
  },
  {
    id: "ai-rehber",
    title: "AI Rehber",
    description: "Toy Poodle hakkında kişiselleştirilmiş öneriler sunan yapay zekâ araçları.",
    icon: "🤖",
    color: "fuchsia",
    badge: "Yeni",
    route: "/yourpoodle/ai-poodle-asistani",
    subcategories: [
      "AI Mama Danışmanı", "AI Veteriner Ön Değerlendirme",
      "AI Eğitim Koçu", "AI Bakım Uzmanı", "AI Ürün Önerisi",
    ],
  },
];

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; dot: string; badge: string }> = {
  orange:  { bg: "bg-orange-50",  text: "text-orange-600",  border: "border-orange-400",  dot: "bg-orange-400",  badge: "bg-orange-100 text-orange-600" },
  green:   { bg: "bg-green-50",   text: "text-green-700",   border: "border-green-500",   dot: "bg-green-500",   badge: "bg-green-100 text-green-700" },
  purple:  { bg: "bg-purple-50",  text: "text-purple-700",  border: "border-purple-500",  dot: "bg-purple-500",  badge: "bg-purple-100 text-purple-700" },
  red:     { bg: "bg-red-50",     text: "text-red-600",     border: "border-red-400",     dot: "bg-red-400",     badge: "bg-red-100 text-red-600" },
  blue:    { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-500",    dot: "bg-blue-500",    badge: "bg-blue-100 text-blue-700" },
  amber:   { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-400",   dot: "bg-amber-400",   badge: "bg-amber-100 text-amber-700" },
  teal:    { bg: "bg-teal-50",    text: "text-teal-700",    border: "border-teal-500",    dot: "bg-teal-500",    badge: "bg-teal-100 text-teal-700" },
  sky:     { bg: "bg-sky-50",     text: "text-sky-700",     border: "border-sky-400",     dot: "bg-sky-400",     badge: "bg-sky-100 text-sky-700" },
  indigo:  { bg: "bg-indigo-50",  text: "text-indigo-700",  border: "border-indigo-500",  dot: "bg-indigo-500",  badge: "bg-indigo-100 text-indigo-700" },
  pink:    { bg: "bg-pink-50",    text: "text-pink-700",    border: "border-pink-400",    dot: "bg-pink-400",    badge: "bg-pink-100 text-pink-700" },
  violet:  { bg: "bg-violet-50",  text: "text-violet-700",  border: "border-violet-500",  dot: "bg-violet-500",  badge: "bg-violet-100 text-violet-700" },
  slate:   { bg: "bg-slate-50",   text: "text-slate-700",   border: "border-slate-400",   dot: "bg-slate-400",   badge: "bg-slate-100 text-slate-700" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-500", dot: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700" },
  fuchsia: { bg: "bg-fuchsia-50", text: "text-fuchsia-700", border: "border-fuchsia-500", dot: "bg-fuchsia-500", badge: "bg-fuchsia-100 text-fuchsia-700" },
};

export const POPULAR_GUIDES = [
  { icon: "🚽", title: "Tuvalet Eğitimi",  desc: "Adım adım eğitim rehberi",    route: "/yourpoodle/rehber/egitim" },
  { icon: "👁️", title: "Göz Akıntısı",     desc: "Temizlik ve bakım ipuçları",   route: "/yourpoodle/rehber/bakim" },
  { icon: "🍖", title: "Mama Seçimi",       desc: "Doğru mama nasıl seçilir?",   route: "/yourpoodle/rehber/beslenme" },
  { icon: "🔊", title: "Havlama Sorunu",    desc: "Kontrol etme yöntemleri",     route: "/yourpoodle/rehber/davranis" },
  { icon: "💉", title: "İlk Aşılar",        desc: "Aşı takvimi ve önemi",        route: "/yourpoodle/rehber/saglik" },
  { icon: "✂️", title: "Tıraş ve Tarama",  desc: "Bakım ipuçları ve sıklık",    route: "/yourpoodle/rehber/bakim" },
];

export const QUICK_TOOLS = [
  { icon: "🍖", title: "Mama Hesaplama",   route: "/yourpoodle/araclar" },
  { icon: "💧", title: "Su Hesaplama",     route: "/yourpoodle/araclar" },
  { icon: "🎂", title: "Yaş Hesaplama",    route: "/yourpoodle/araclar" },
  { icon: "⚖️", title: "İdeal Kilo",       route: "/yourpoodle/araclar" },
  { icon: "💉", title: "Aşı Takvimi",      route: "/yourpoodle/araclar" },
  { icon: "✂️", title: "Tıraş Zamanı",    route: "/yourpoodle/araclar" },
];

export const AGE_GROUPS = [
  { label: "2–3 Ay",   route: "/yourpoodle/rehber/yasa-gore" },
  { label: "4–6 Ay",   route: "/yourpoodle/rehber/yasa-gore" },
  { label: "7–12 Ay",  route: "/yourpoodle/rehber/yasa-gore" },
  { label: "1–3 Yaş",  route: "/yourpoodle/rehber/yasa-gore" },
  { label: "4–6 Yaş",  route: "/yourpoodle/rehber/yasa-gore" },
  { label: "7+ Yaş",   route: "/yourpoodle/rehber/yasa-gore" },
  { label: "10+ Yaş",  route: "/yourpoodle/rehber/yasa-gore" },
];

export const FAQ_ITEMS = [
  {
    q: "Poodle'ım kaç aylıkken aşıları tamamlanır?",
    a: "Toy Poodle yavruları genellikle 16. haftada (4 aylık) temel aşı serisini tamamlar. Bu süreçte 6–8, 10–12 ve 14–16. haftalarda olmak üzere 3 doz karma aşı ve kuduz aşısı uygulanır.",
  },
  {
    q: "Ne sıklıkla tıraş edilmeli?",
    a: "Toy Poodle'lar genellikle her 6–8 haftada bir tıraş edilmelidir. Tüyler hızlı uzar ve düzenli bakım yapılmadığında keçeleşir, bu da cilt problemlerine yol açabilir.",
  },
  {
    q: "Günde ne kadar mama yemeli?",
    a: "Ağırlığa ve yaşa bağlı olarak değişir. Ortalama 2–3 kg'lık yetişkin bir Toy Poodle için günde 80–120 gr kuru mama yeterlidir. Günde 2–3 öğüne bölmek önerilir.",
  },
  {
    q: "Göz akıntısı normal mi?",
    a: "Az miktarda, şeffaf göz akıntısı normaldir. Ancak kahverengi leke bırakan, sarı-yeşil renkli veya yoğun akıntı bir sorunun işareti olabilir. Veterinerinize başvurmanız önerilir.",
  },
  {
    q: "Yalnız kalabilir mi?",
    a: "Toy Poodle'lar insan etkileşimine çok bağlıdır. Alıştırmayla 4–6 saate kadar yalnız kalabilirler. Daha uzun süreler için oyuncak, interaktif besleyici veya evcil hayvan kamerası düşünülebilir.",
  },
];
