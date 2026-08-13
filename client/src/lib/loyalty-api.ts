export const LOYALTY_BRAND = "#5D3A1A";
export const LOYALTY_BRAND_DARK = "#4A2E15";
export const LOYALTY_BRAND_LIGHT = "#F5F0E6";

export type LoyaltyTransaction = {
  id: string;
  amount: number;
  type: string;
  description: string;
  createdAt: string;
  orderId?: string | number | null;
};

export type LoyaltyData = {
  balance: number;
  transactions: LoyaltyTransaction[];
};

export type RewardCatalogItem = {
  id: string;
  title: string;
  points: number;
  category: string;
};

export type RedeemResult = {
  ok: boolean;
  balance: number;
  message?: string;
};

/** Client-side catalog when rewards API is empty or unavailable */
export const FALLBACK_REWARDS: RewardCatalogItem[] = [
  { id: "rw-50tl", title: "50 TL İndirim", points: 500, category: "discount" },
  { id: "rw-kargo", title: "Ücretsiz Kargo", points: 300, category: "shipping" },
  { id: "rw-bakim", title: "%15 Bakım İndirimi", points: 750, category: "discount" },
  { id: "rw-mama", title: "100 TL Mama İndirimi", points: 1000, category: "discount" },
];

const REWARD_META: Record<string, { minCart: string; icon: string; badge?: string }> = {
  "rw-50tl": { minCart: "Min. sepet 500 TL", icon: "coupon", badge: "Çok Popüler" },
  "rw-kargo": { minCart: "Min. sepet 250 TL", icon: "shipping", badge: "Popüler" },
  "rw-bakim": { minCart: "Min. sepet 300 TL", icon: "care", badge: "Sınırlı Süre" },
  "rw-mama": { minCart: "Min. sepet 750 TL", icon: "food", badge: "Stoklar Sınırlı" },
  "pr-1": { minCart: "Min. sepet 500 TL", icon: "coupon", badge: "Çok Popüler" },
  "pr-2": { minCart: "Min. sepet 250 TL", icon: "shipping", badge: "Popüler" },
  "pr-3": { minCart: "Min. sepet 300 TL", icon: "care", badge: "Sınırlı Süre" },
  "pr-4": { minCart: "Min. sepet 750 TL", icon: "food", badge: "Stoklar Sınırlı" },
};

export function enrichReward(r: RewardCatalogItem) {
  const meta = REWARD_META[r.id] ?? {
    minCart: "Koşullar ödül kartında",
    icon: r.category === "shipping" ? "shipping" : "coupon",
  };
  return { ...r, pointsCost: r.points, ...meta };
}

export function formatLoyaltyDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const now = new Date();
  const sameDay =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  if (sameDay) return "Bugün";
  return d.toLocaleDateString("tr-TR", { day: "numeric", month: "long" });
}

export function txIsEarn(tx: LoyaltyTransaction) {
  return tx.amount > 0 || tx.type === "earn";
}

export function filterTransactions(
  txs: LoyaltyTransaction[],
  filter: "all" | "earned" | "spent",
) {
  if (filter === "earned") return txs.filter(tx => tx.amount > 0);
  if (filter === "spent") return txs.filter(tx => tx.amount < 0);
  return txs;
}

export async function fetchLoyalty(): Promise<LoyaltyData> {
  const r = await fetch("/api/customer/loyalty", { credentials: "include" });
  if (!r.ok) return { balance: 0, transactions: [] };
  return r.json();
}

export async function fetchRewards(): Promise<RewardCatalogItem[]> {
  const r = await fetch("/api/customer/loyalty/rewards", { credentials: "include" });
  if (!r.ok) return FALLBACK_REWARDS;
  const data = await r.json();
  return Array.isArray(data) && data.length > 0 ? data : FALLBACK_REWARDS;
}
