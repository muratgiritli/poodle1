export const userProfile = {
  firstName: "Ayşe",
  fullName: "Ayşe Yılmaz",
  phone: "+90 532 *** ** 48",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
  isClubMember: true,
  stats: {
    orders: 12,
    favorites: 28,
    points: 340,
  },
};

export const petProfile = {
  name: "Tarçın",
  breed: "Toy Poodle",
  age: "2 yaş",
  weight: "4,2 kg",
  city: "Samsun",
  avatar: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=150&h=150&fit=crop",
  verified: true,
  profileComplete: 85,
  clubUsername: "tarcin.poodle",
};

export const quickActions = [
  { id:"orders",    label:"Siparişlerim",       sublabel:"2 aktif", icon:"Package",  bg:"#EFF6FF", iconColor:"#3B82F6", route:"/hesabim/siparisler" },
  { id:"favorites", label:"Favorilerim",         sublabel:"28",      icon:"Heart",    bg:"#FDF2F8", iconColor:"#EC4899", route:"/hesabim/favoriler"  },
  { id:"addresses", label:"Adreslerim",          sublabel:null,      icon:"MapPin",   bg:"#F0FDF4", iconColor:"#22C55E", route:"/hesabim/adresler"   },
  { id:"coupons",   label:"Kuponlarım",           sublabel:"3",       icon:"Ticket",   bg:"#FFF7ED", iconColor:"#F97316", route:"/hesabim/kuponlar"   },
  { id:"clubposts", label:"Club Paylaşımlarım",  sublabel:"14",      icon:"Camera",   bg:"#F3EEFF", iconColor:"#7C3AED", route:"/club/profil/tarcin.poodle" },
  { id:"saved",     label:"Kaydettiklerim",       sublabel:null,      icon:"Bookmark", bg:"#FEFCE8", iconColor:"#EAB308", route:"/hesabim/kaydedilenler" },
  { id:"notif",     label:"Bildirimler",          sublabel:"3 yeni",  icon:"Bell",     bg:"#FEE2E2", iconColor:"#EF4444", route:"/hesabim/bildirimler" },
  { id:"settings",  label:"Hesap Ayarları",       sublabel:null,      icon:"Settings", bg:"#F3F4F6", iconColor:"#6B7280", route:"/hesabim/ayarlar"    },
];

export const activeOrder = {
  id: "YP-2026072318",
  date: "23 Temmuz 2026",
  productName: "Pro Plan Small Adult Sensitive Somonlu",
  weight: "3 kg",
  price: "1.349 TL",
  status: "Kargoya Hazırlanıyor",
  statusKey: "preparing",
  image: "https://images.unsplash.com/photo-1589924691995-400dc9eccs?w=120&h=120&fit=crop",
};

export const orderSteps = [
  { key:"received",  label:"Alındı"       },
  { key:"preparing", label:"Hazırlanıyor" },
  { key:"shipping",  label:"Kargoda"      },
  { key:"delivered", label:"Teslim"       },
];

export const reminders = [
  { id:"r1", title:"Karma Aşı",             date:"28 Temmuz 2026",  daysLeft:5,  icon:"Syringe", color:"#3B82F6" },
  { id:"r2", title:"İç Parazit Uygulaması", date:"4 Ağustos 2026",  daysLeft:12, icon:"Shield",  color:"#22C55E" },
  { id:"r3", title:"Tüy Bakımı",            date:"8 Ağustos 2026",  daysLeft:16, icon:"Brush",   color:"#EC4899" },
];

export const clubActivity = {
  posts: 14,
  followers: 1248,
  following: 186,
  thumbnails: [
    "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=80&h=80&fit=crop",
    "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=80&h=80&fit=crop",
    "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=80&h=80&fit=crop",
  ],
};

export const loyaltyPoints = {
  current: 340,
  target: 500,
  reward: "100 TL indirim kuponu",
};

export const settingsMenu = [
  { id:"personal", label:"Kişisel Bilgilerim",   icon:"User",        route:"/hesabim/kisisel"  },
  { id:"phone",    label:"Telefon Numaram",       icon:"Smartphone",  route:"/hesabim/telefon"  },
  { id:"comms",    label:"İletişim Tercihlerim",  icon:"Mail",        route:"/hesabim/iletisim" },
  { id:"privacy",  label:"Gizlilik ve Güvenlik",  icon:"Lock",        route:"/hesabim/gizlilik" },
  { id:"help",     label:"Yardım ve Destek",      icon:"HelpCircle",  route:"/hesabim/yardim"   },
];
