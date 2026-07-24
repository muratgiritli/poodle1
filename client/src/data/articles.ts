export interface Article {
  slug: string;
  category: string; // egitim | saglik | bakim | beslenme
  categoryLabel: string;
  title: string;
  readTime: number;
  date: string;
  views: string;
  excerpt: string;
  body: { heading?: string; text: string; isTip?: boolean }[];
  relatedSlugs: string[];
}

export const MOCK_ARTICLES: Article[] = [
  {
    slug: "toy-poodle-tuvalet-egitimi",
    category: "egitim",
    categoryLabel: "Eğitim",
    title: "Toy Poodle Tuvalet Eğitimi",
    readTime: 5,
    date: "24 Temmuz 2026",
    views: "1.2K",
    excerpt: "Toy Poodle'ınıza doğru ve kalıcı tuvalet alışkanlığı kazandırmanın adım adım yolu.",
    body: [
      { heading: "Başlamadan Önce", text: "Toy Poodle'lar zeki ve öğrenmeye açık köpeklerdir. Tuvalet eğitimine 8-10 haftalıktan itibaren başlanabilir. Sabır ve tutarlılık bu sürecin en önemli unsurlarıdır." },
      { heading: "Belirlenen Tuvalet Alanı", text: "Eğitim boyunca aynı tuvalet alanını kullanın. İster dışarıda belirlediğiniz bir köşe, ister iç mekânda özel bir pet pad — yer değiştirmemek öğrenmeyi hızlandırır." },
      { heading: "Zamanlama", text: "Köpeğiniz uyandıktan hemen sonra, yemek yedikten 15-20 dakika sonra ve oyun aralarında tuvalet ihtiyacı duyar. Bu anlarda tuvalet alanına yönlendirin ve tamamladığında ödüllendirin." },
      { text: "💡 İpucu: Sabır ve tutarlılık en önemli anahtardır. Kaza olduğunda asla azarlamayın — bu güvensizliğe yol açar.", isTip: true },
      { heading: "Ödüllendirme", text: "Başarılı her tuvaletten hemen sonra ödül (ödül maması veya övgü) verin. Köpeğiniz ödülü davranışla ilişkilendirirse öğrenme hızlanır." },
      { heading: "Sık Yapılan Hatalar", text: "Kazadan uzun süre sonra azarlamak, tuvalet alanını sık değiştirmek ve tutarsız program uygulamak eğitimi zorlaştırır. Tüm aile aynı komutları kullanmalıdır." },
    ],
    relatedSlugs: ["toy-poodle-beslenme-rehberi", "poodle-yas-hesaplama"],
  },
  {
    slug: "toy-poodle-beslenme-rehberi",
    category: "beslenme",
    categoryLabel: "Beslenme",
    title: "Toy Poodle Beslenme Rehberi",
    readTime: 7,
    date: "20 Temmuz 2026",
    views: "2.1K",
    excerpt: "Toy Poodle'ınızın yaşına ve kilogramına göre doğru beslenme miktarlarını öğrenin.",
    body: [
      { heading: "Yaşa Göre Beslenme", text: "Yavru poodle'lar (0-12 ay) günde 3-4 öğün, yetişkinler günde 2 öğün, yaşlılar ise günde 2 küçük öğün almalıdır." },
      { heading: "Kuru mu Yaş mı?", text: "Kuru mama diş sağlığını destekler ve ekonomiktir. Yaş mama ise su alımını artırır. Pek çok sahip ikisini karıştırarak kullanmayı tercih eder." },
      { text: "💡 İpucu: Mama değişikliği yapacaksanız 7-10 günde kademeli geçiş yapın, ani değişiklik sindirim sorunlarına neden olabilir.", isTip: true },
    ],
    relatedSlugs: ["toy-poodle-tuvalet-egitimi", "poodle-yas-hesaplama"],
  },
  {
    slug: "poodle-goz-bakimi",
    category: "bakim",
    categoryLabel: "Bakım",
    title: "Poodle Göz Bakımı",
    readTime: 4,
    date: "15 Temmuz 2026",
    views: "980",
    excerpt: "Poodle'larda sık görülen göz yaşı izleri ve düzenli göz bakımının önemi.",
    body: [
      { heading: "Göz Yaşı İzleri", text: "Toy Poodle'lar beyaz veya açık renk tüyleri nedeniyle göz yaşı izlerini kolayca fark ettiren ırklardandır. Bu izler, gözyaşı kanallarının dar yapısından kaynaklanır." },
      { text: "💡 İpucu: Günde bir kez nemli bez veya özel göz temizleme pamuğu ile gözlerin iç köşesini silin.", isTip: true },
    ],
    relatedSlugs: ["toy-poodle-beslenme-rehberi"],
  },
];

export function getArticle(slug: string): Article | undefined {
  return MOCK_ARTICLES.find(a => a.slug === slug);
}
export function getArticlesByCategory(cat: string): Article[] {
  return MOCK_ARTICLES.filter(a => a.category === cat);
}
