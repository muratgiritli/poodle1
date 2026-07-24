export interface ClubComment { id: number; author: string; avatar: string; text: string; time: string; }
export interface ClubPost {
  id: string; author: string; username: string; title: string;
  avatar: string; image?: string; caption: string;
  likes: number; comments: ClubComment[]; time: string;
  hashtags: string[]; location?: string;
}

export const MOCK_POSTS: ClubPost[] = [
  {
    id: "1",
    author: "Tarçın'ın Annesi",
    username: "tarcin.poodle",
    title: "Bugün Tarçın 2 yaşında!",
    avatar: "🐩",
    caption: "Bugün Tarçın 2 yaşında! 🎂 İki yıl önce küçücük bir yumak gibi geldi, şimdi tam bir prens oldu. Her gün biraz daha severek büyüyoruz ❤️",
    likes: 128,
    time: "2 saat önce",
    hashtags: ["#toypoodle", "#yourpoodle", "#2yas", "#dogbirthday"],
    location: "Samsun, Türkiye",
    comments: [
      { id: 1, author: "Luna_anne", avatar: "🐾", text: "Kutlu olsun Tarçın! 🎉 Ne kadar tatlı!", time: "1 saat önce" },
      { id: 2, author: "poodle.istanbul", avatar: "🐶", text: "Doğum günün kutlu olsun 🥳", time: "45 dk önce" },
      { id: 3, author: "mia.poodle", avatar: "🐩", text: "Harika fotoğraf, çok sevimli!", time: "20 dk önce" },
    ],
  },
  {
    id: "2",
    author: "Luna'nın Ailesi",
    username: "luna.toyp",
    title: "İlk tıraş deneyimi",
    avatar: "🐾",
    caption: "Luna'nın ilk profesyonel tıraşı bugün! Biraz gergin başladı ama sonunda harika göründü 🌸 Groomer'ımız muhteşemdi!",
    likes: 94,
    time: "5 saat önce",
    hashtags: ["#poodlegrooming", "#toypoodel", "#yourpoodle"],
    comments: [
      { id: 1, author: "tarcin.poodle", avatar: "🐩", text: "Çok şık olmuş! Hangi groomer gittiniz?", time: "4 saat önce" },
      { id: 2, author: "bademli.poodle", avatar: "🎀", text: "Prenses gibi görünüyor 👑", time: "3 saat önce" },
    ],
  },
  {
    id: "3",
    author: "Badem'in Babası",
    username: "badem.poodle",
    title: "Park keyfi",
    avatar: "🎀",
    caption: "Pazar sabahı park keyfi ☀️ Badem koşmayı çok seviyor. Siz de köpeğinizle ne sıklıkla parka gidiyorsunuz?",
    likes: 67,
    time: "1 gün önce",
    hashtags: ["#poodlelife", "#yourpoodle", "#dogpark"],
    comments: [
      { id: 1, author: "luna.toyp", avatar: "🐾", text: "Biz haftada 3 gün gidiyoruz 🏃‍♀️", time: "23 saat önce" },
    ],
  },
];

export function getPost(id: string): ClubPost | undefined {
  return MOCK_POSTS.find(p => p.id === id);
}
