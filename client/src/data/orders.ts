export interface OrderItem { name: string; qty: number; price: number; img: string; }
export interface OrderAddress { name: string; phone: string; line1: string; city: string; }
export interface Order {
  id: string; displayId: string; date: string; dateDisplay: string;
  status: "hazirlaniyor" | "kargoda" | "teslim-edildi" | "iptal";
  statusStep: number; // 1-4
  items: OrderItem[];
  address: OrderAddress;
  payment: string;
  total: number;
  trackingNo: string;
  poodlePuan: number;
}

export const MOCK_ORDERS: Order[] = [
  {
    id: "YP-2026-0847",
    displayId: "YP-2026-0847",
    date: "2026-07-24",
    dateDisplay: "24 Temmuz 2026",
    status: "hazirlaniyor",
    statusStep: 2,
    items: [
      { name: "Royal Canin Poodle Adult 3 Kg", qty: 1, price: 1500, img: "/api/product-image/2706" },
      { name: "Reflex Plus Poodle Yetişkin 2 Kg", qty: 2, price: 800, img: "/api/product-image/2709" },
    ],
    address: { name: "Ayşe Yılmaz", phone: "0532 123 45 67", line1: "Cumhuriyet Mah. 14 Sk. No:8", city: "Atakum, Samsun" },
    payment: "Kapıda Kart",
    total: 3100,
    trackingNo: "TR123456789",
    poodlePuan: 45,
  },
  {
    id: "YP-2026-0801",
    displayId: "YP-2026-0801",
    date: "2026-07-10",
    dateDisplay: "10 Temmuz 2026",
    status: "teslim-edildi",
    statusStep: 4,
    items: [
      { name: "Trixie Toy Poodle Oyuncak Seti", qty: 1, price: 350, img: "/api/product-image/2710" },
    ],
    address: { name: "Ayşe Yılmaz", phone: "0532 123 45 67", line1: "Cumhuriyet Mah. 14 Sk. No:8", city: "Atakum, Samsun" },
    payment: "Havale / EFT",
    total: 350,
    trackingNo: "TR987654321",
    poodlePuan: 15,
  },
];

export const STEP_LABELS = ["Sipariş Alındı", "Hazırlanıyor", "Kargoda", "Teslim Edildi"];

export function getOrder(id: string): Order | undefined {
  return MOCK_ORDERS.find(o => o.id === id || o.id.replace("YP-", "") === id);
}
