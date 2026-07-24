export interface Event {
  slug: string; title: string; date: string; dateDisplay: string;
  time: string; location: string; city: string;
  description: string; price: number | "free";
  attendees: number; maxAttendees?: number;
  organizer: string; tags: string[];
}

export const MOCK_EVENTS: Event[] = [
  {
    slug: "istanbul-poodle-bulusmasi",
    title: "İstanbul Poodle Buluşması",
    date: "2026-08-15",
    dateDisplay: "15 Ağustos 2026",
    time: "10:00 - 14:00",
    location: "Emirgan Korusu Açık Alan",
    city: "İstanbul",
    description: "İstanbul'daki tüm Poodle sahiplerini bir araya getiriyoruz! Büyük buluşmamızda köpekleriniz yeni arkadaşlar edinirken siz de deneyimlerinizi paylaşabilirsiniz. Eğitimci sunumu, oyun alanı ve hediye çekilişi de var!",
    price: "free",
    attendees: 24,
    maxAttendees: 50,
    organizer: "YourPoodle",
    tags: ["buluşma", "istanbul", "eğitim"],
  },
  {
    slug: "ankara-poodle-egitim-gunu",
    title: "Ankara Poodle Eğitim Günü",
    date: "2026-09-06",
    dateDisplay: "6 Eylül 2026",
    time: "11:00 - 15:00",
    location: "Kugulu Park Etkinlik Alanı",
    city: "Ankara",
    description: "Profesyonel köpek eğitmeni eşliğinde temel komut ve davranış geliştirme atölyesi. Küçük grup ortamında birebir ilgiyle çalışma fırsatı!",
    price: 150,
    attendees: 12,
    maxAttendees: 20,
    organizer: "YourPoodle",
    tags: ["eğitim", "ankara", "atölye"],
  },
  {
    slug: "samsun-poodle-festivali",
    title: "Samsun Poodle Festivali",
    date: "2026-09-20",
    dateDisplay: "20 Eylül 2026",
    time: "09:00 - 17:00",
    location: "Sahil Parkı",
    city: "Samsun",
    description: "Samsun'un ilk Poodle festivali! Güzellik yarışması, engel parkuru, fotoğraf köşesi ve yerel esnaf standlarıyla dolu bir gün sizi bekliyor.",
    price: "free",
    attendees: 38,
    organizer: "YourPoodle Samsun",
    tags: ["festival", "samsun", "yarışma"],
  },
];

export function getEvent(slug: string): Event | undefined {
  return MOCK_EVENTS.find(e => e.slug === slug);
}
