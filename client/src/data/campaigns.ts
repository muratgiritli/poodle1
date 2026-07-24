export interface Campaign {
  id: string; title: string; description: string;
  badge: string; badgeColor: string; expiry: string;
  cta: string; ctaLink: string; emoji: string;
  bgColor: string;
}

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "taksit",
    title: "Peşin Fiyatına 3 Taksit",
    description: "Tüm kredi kartlarıyla geçerli. 500₺ ve üzeri siparişlerde 3 taksit imkânı.",
    badge: "Devam Ediyor",
    badgeColor: "#10B981",
    expiry: "31 Ağustos 2026",
    cta: "Alışverişe Başla",
    ctaLink: "/magaza",
    emoji: "💳",
    bgColor: "#F0FDF4",
  },
  {
    id: "kargo",
    title: "1.000₺ Üzeri Ücretsiz Kargo",
    description: "Toplam sepet tutarı 1.000₺ ve üzerinde olan tüm siparişlerde kargo bedava.",
    badge: "Süresiz",
    badgeColor: "#6B7280",
    expiry: "—",
    cta: "Mağazayı Keşfet",
    ctaLink: "/magaza",
    emoji: "🚚",
    bgColor: "#F5F3FF",
  },
  {
    id: "yeni-uye",
    title: "Yeni Üyelere %10 İndirim",
    description: "İlk siparişinizde YENIPOODLE kodu ile %10 indirim. Tüm ürünlerde geçerli.",
    badge: "Yeni Üye",
    badgeColor: "#7022C4",
    expiry: "24 Ağustos 2026",
    cta: "Hemen Üye Ol",
    ctaLink: "/uye-ol",
    emoji: "🎁",
    bgColor: "#FFF7ED",
  },
  {
    id: "royal-canin",
    title: "Royal Canin'de %15 İndirim",
    description: "Tüm Royal Canin Poodle ürünlerinde kampanya süresi boyunca %15 indirim.",
    badge: "Sınırlı Süre",
    badgeColor: "#EF4444",
    expiry: "1 Ağustos 2026",
    cta: "Ürünleri Gör",
    ctaLink: "/magaza/marka/royal-canin",
    emoji: "⭐",
    bgColor: "#FFF1F2",
  },
];
