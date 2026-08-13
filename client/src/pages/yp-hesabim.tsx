import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft, Bell, MessageCircle, Package, Heart, MapPin, PawPrint,
  Settings, ChevronRight, HelpCircle, LogOut, Plus, Camera, Bookmark,
  Ticket, User, Smartphone, Shield,
} from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { useCustomer } from "@/contexts/CustomerContext";
import { IS_YP } from "@/lib/store";
import { goBack } from "@/lib/goBack";

const BASE = IS_YP ? "" : "/yourpoodle";
const NOTIF_PATH = IS_YP ? "/bildirimler" : "/yourpoodle/bildirimler";
const P = "#5D3A1A";
const PL = "#F5F0E6";
const GB = "#E5E7EB";

type Dog = {
  id: number;
  slug: string;
  name: string;
  breed?: string;
  city?: string | null;
  avatar_url?: string | null;
  weight_kg?: number | string | null;
  birth_date?: string | null;
  post_count?: number;
  follower_count?: number;
  following_count?: number;
};

type Order = {
  id: number;
  status: string;
  grandTotal: number | string;
  createdAt: string;
  items: Array<{ name?: string; productName?: string; qty?: number; img?: string | null; weight?: string }>;
  trackingNumber?: string | null;
};

const BREED_TR: Record<string, string> = {
  toy: "Toy Poodle",
  miniature: "Minyatür Poodle",
  standart: "Standart Poodle",
  moyen: "Moyen Poodle",
};

const ACTIVE_STATUSES = new Set([
  "beklemede", "hazirlaniyor", "hazırlanıyor", "kargoda", "yolda",
  "pending", "preparing", "shipping", "processing",
]);

function maskPhone(phone?: string | null) {
  if (!phone) return "Telefon eklenmemiş";
  const d = phone.replace(/\D/g, "");
  if (d.length < 7) return phone;
  return `+90 ${d.slice(-10, -7)} *** ** ${d.slice(-2)}`;
}

function dogAge(birth?: string | null) {
  if (!birth) return null;
  const b = new Date(birth);
  if (Number.isNaN(b.getTime())) return null;
  const months = Math.floor((Date.now() - b.getTime()) / (1000 * 60 * 60 * 24 * 30.44));
  if (months < 0) return null; // gelecek tarih / hatalı doğum
  if (months < 12) return `${months} ay`;
  const y = Math.floor(months / 12);
  return `${y} yaş`;
}

function statusLabel(status: string) {
  const s = (status || "").toLowerCase();
  if (s.includes("kargo") || s === "shipping" || s === "yolda") return "Kargoda";
  if (s.includes("hazir") || s === "preparing" || s === "processing") return "Hazırlanıyor";
  if (s.includes("bekle") || s === "pending") return "Alındı";
  if (s.includes("teslim") || s === "delivered") return "Teslim";
  return status || "Sipariş";
}

function statusKey(status: string): "received" | "preparing" | "shipping" | "delivered" {
  const s = (status || "").toLowerCase();
  if (s.includes("teslim") || s === "delivered") return "delivered";
  if (s.includes("kargo") || s === "shipping" || s === "yolda") return "shipping";
  if (s.includes("hazir") || s === "preparing" || s === "processing") return "preparing";
  return "received";
}

function OrderStepper({ current }: { current: ReturnType<typeof statusKey> }) {
  const steps = [
    { key: "received", label: "Alındı" },
    { key: "preparing", label: "Hazırlanıyor" },
    { key: "shipping", label: "Kargoda" },
    { key: "delivered", label: "Teslim" },
  ] as const;
  const idx = steps.findIndex(s => s.key === current);
  return (
    <div style={{ position: "relative", marginTop: 14 }}>
      <div style={{ position: "absolute", top: 6, left: "12%", right: "12%", height: 2, background: GB }} />
      <div style={{
        position: "absolute", top: 6, left: "12%",
        width: `${Math.max(0, (idx / (steps.length - 1)) * 76)}%`,
        height: 2, background: P,
      }} />
      <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
        {steps.map((step, i) => (
          <div key={step.key} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{
              width: 12, height: 12, borderRadius: "50%",
              background: i <= idx ? P : GB,
              border: i === idx ? `2px solid ${P}` : "none",
              boxSizing: "border-box",
            }} />
            <span style={{ fontSize: 9, color: "#6B7280", fontWeight: i === idx ? 700 : 400 }}>{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function YPHesabimPage() {
  const [, navigate] = useLocation();
  const { isLoggedIn, isLoading, customer, logout } = useCustomer();
  const [toast, setToast] = useState("");

  useEffect(() => {
    document.title = "Hesabım | YourPoodle";
    return () => { document.title = "YourPoodle"; };
  }, []);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate(`${BASE}/giris?returnTo=${encodeURIComponent("/hesabim")}`);
    }
  }, [isLoading, isLoggedIn, navigate]);

  const showSoon = (label: string) => {
    setToast(`${label} yakında`);
    setTimeout(() => setToast(""), 2200);
  };

  const { data: dogs = [] } = useQuery<Dog[]>({
    queryKey: ["/api/my/dogs"],
    enabled: isLoggedIn,
    queryFn: async () => {
      const r = await fetch("/api/my/dogs", { credentials: "include" });
      if (!r.ok) return [];
      return r.json();
    },
  });

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/customer/orders"],
    enabled: isLoggedIn,
    queryFn: async () => {
      const r = await fetch("/api/customer/orders", { credentials: "include" });
      if (!r.ok) return [];
      return r.json();
    },
  });

  const { data: favorites = [] } = useQuery<any[]>({
    queryKey: ["/api/customer/favorites"],
    enabled: isLoggedIn,
    queryFn: async () => {
      const r = await fetch("/api/customer/favorites", { credentials: "include" });
      if (!r.ok) return [];
      return r.json();
    },
  });

  const { data: addresses = [] } = useQuery<any[]>({
    queryKey: ["/api/customer/addresses"],
    enabled: isLoggedIn,
    queryFn: async () => {
      const r = await fetch("/api/customer/addresses", { credentials: "include" });
      if (!r.ok) return [];
      return r.json();
    },
  });

  const { data: unread } = useQuery<{ count: number }>({
    queryKey: ["/api/notifications/unread-count"],
    enabled: isLoggedIn,
    queryFn: async () => {
      const r = await fetch("/api/notifications/unread-count", { credentials: "include" });
      if (!r.ok) return { count: 0 };
      return r.json();
    },
    refetchInterval: 60_000,
  });

  const { data: loyalty } = useQuery<{ balance: number }>({
    queryKey: ["/api/customer/loyalty"],
    enabled: isLoggedIn,
    queryFn: async () => {
      const r = await fetch("/api/customer/loyalty", { credentials: "include" });
      if (!r.ok) return { balance: 0, transactions: [] };
      return r.json();
    },
  });

  const primaryDog = dogs[0] || null;
  const firstName = customer?.name?.trim()?.split(/\s+/)[0] || "Poodle dostu";
  const initials = (customer?.name || "YP").split(/\s+/).map(p => p[0]).join("").slice(0, 2).toUpperCase();

  const activeOrders = useMemo(
    () => orders.filter(o => ACTIVE_STATUSES.has(String(o.status || "").toLowerCase())),
    [orders],
  );
  const activeOrder = activeOrders[0] || null;

  const quickActions = [
    { label: "Siparişlerim", sub: activeOrders.length ? `${activeOrders.length} aktif` : `${orders.length}`, Icon: Package, href: "/hesabim/siparisler", bg: "#F5F0E6", color: P },
    { label: "Favorilerim", sub: String(favorites.length || 0), Icon: Heart, href: "/hesabim/favoriler", bg: "#FDF2F8", color: "#BE185D" },
    { label: "Adreslerim", sub: addresses.length ? `${addresses.length}` : null, Icon: MapPin, href: "/hesabim/adresler", bg: "#F0FDF4", color: "#15803D" },
    {
      label: "Ödül Merkezi",
      sub: loyalty?.balance != null ? `${loyalty.balance.toLocaleString("tr-TR")} puan` : null,
      Icon: Ticket,
      href: "/hesabim/poodle-puanlari/odul-merkezi",
      bg: "#FFF7ED",
      color: "#C2410C",
    },
    { label: "Club Paylaşımlarım", sub: primaryDog ? String(primaryDog.post_count || 0) : null, Icon: Camera, href: "/hesabim/club-paylasimlarim", bg: "#F5F0E6", color: P },
    { label: "Kaydettiklerim", sub: null, Icon: Bookmark, href: "/hesabim/favoriler", bg: "#FEFCE8", color: "#A16207" },
    { label: "Bildirimler", sub: unread?.count ? `${unread.count} yeni` : null, Icon: Bell, href: NOTIF_PATH, bg: "#FEE2E2", color: "#DC2626" },
    { label: "Hesap Ayarları", sub: null, Icon: Settings, href: "/hesabim/ayarlar", bg: "#F3F4F6", color: "#4B5563" },
  ] as Array<{
    label: string; sub: string | null; Icon: typeof Package; href: string;
    bg: string; color: string; soon?: boolean;
  }>;

  const settingsRows = [
    { label: "Kişisel Bilgilerim", Icon: User, href: "/hesabim/ayarlar" },
    { label: "Telefon Numaram", Icon: Smartphone, href: "/hesabim/ayarlar" },
    { label: "İletişim Tercihlerim", Icon: Bell, href: "/hesabim/ayarlar" },
    { label: "Gizlilik ve Güvenlik", Icon: Shield, href: "/hesabim/ayarlar" },
    { label: "Yardım ve Destek", Icon: HelpCircle, href: "/hesabim/yardim" },
  ] as Array<{ label: string; Icon: typeof User; href: string; soon?: boolean }>;

  if (isLoading) {
    return (
      <YPLayout activeLink="/hesabim" hideFooter>
        <div style={{ padding: 48, textAlign: "center", color: "#6B7280", fontSize: 14 }}>Yükleniyor...</div>
      </YPLayout>
    );
  }

  if (!isLoggedIn) return null;

  const handleLogout = async () => {
    await logout();
    navigate(BASE || "/yourpoodle");
  };

  const itemName = activeOrder?.items?.[0]?.name || activeOrder?.items?.[0]?.productName || "Sipariş";
  const itemImg = activeOrder?.items?.[0]?.img;

  return (
    <YPLayout activeLink="/hesabim" constrain={false} hideFooter>
      <div style={{ maxWidth: 720, margin: "0 auto", background: "#FAF8F4", minHeight: "70vh", paddingBottom: 24 }}>
        {/* Slim page bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 14px", background: "#fff", borderBottom: `1px solid ${GB}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button type="button" aria-label="Geri" onClick={() => goBack(navigate, BASE || "/yourpoodle")}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#374151", display: "flex" }}>
              <ArrowLeft size={18} />
            </button>
            <span style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>Hesabım</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <button type="button" aria-label="Bildirimler" onClick={() => navigate(NOTIF_PATH)}
              style={{ position: "relative", width: 40, height: 40, background: "none", border: "none", cursor: "pointer" }}>
              <Bell size={20} color="#374151" strokeWidth={1.75} />
              {!!unread?.count && (
                <span style={{
                  position: "absolute", top: 4, right: 4, minWidth: 15, height: 15, borderRadius: 999,
                  background: "#EF4444", color: "#fff", fontSize: 9, fontWeight: 800,
                  display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px",
                }}>
                  {unread.count > 9 ? "9+" : unread.count}
                </span>
              )}
            </button>
            <button type="button" aria-label="Mesajlar" onClick={() => navigate(`${BASE}/club/mesajlar`)}
              style={{ width: 40, height: 40, background: "none", border: "none", cursor: "pointer" }}>
              <MessageCircle size={20} color="#374151" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        <div style={{ padding: "14px 16px 6px" }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>Merhaba, {firstName}</div>
          <div style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>Sipariş, Poodle ve Club burada</div>
        </div>

        {/* Profile */}
        <div style={{
          margin: "10px 16px 14px", borderRadius: 16, overflow: "hidden",
          background: P, padding: 14,
        }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 6 }}>
            <button type="button" onClick={() => navigate("/hesabim/ayarlar")}
              style={{
                background: "rgba(255,255,255,0.18)", border: "none", color: "#fff",
                fontSize: 11, fontWeight: 600, padding: "5px 12px", borderRadius: 999,
                cursor: "pointer", fontFamily: "inherit",
              }}>
              Profili Düzenle
            </button>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{
              width: 58, height: 58, borderRadius: "50%", background: "rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 800, fontSize: 18, border: "2px solid rgba(255,255,255,0.45)",
              flexShrink: 0,
            }}>
              {initials}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{customer?.name || "Üye"}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.82)", marginTop: 2 }}>{maskPhone(customer?.phone)}</div>
              {(customer?.city || customer?.district) && (
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", marginTop: 4 }}>
                  {[customer?.district, customer?.city].filter(Boolean).join(", ")}
                </div>
              )}
            </div>
          </div>
          <div style={{
            display: "flex", justifyContent: "space-between", marginTop: 14,
            paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.2)",
          }}>
            {[
              { label: "Sipariş", value: orders.length, href: "/hesabim/siparisler", Icon: Package },
              { label: "Favori", value: favorites.length, href: "/hesabim/favoriler", Icon: Heart },
              { label: "Poodle", value: dogs.length, href: `${BASE}/benim-poodleim`, Icon: PawPrint },
            ].map(s => (
              <button key={s.label} type="button" onClick={() => navigate(s.href)}
                style={{ flex: 1, background: "none", border: "none", cursor: "pointer", color: "#fff", fontFamily: "inherit" }}>
                <s.Icon size={16} style={{ display: "block", margin: "0 auto 3px", opacity: 0.9 }} />
                <div style={{ fontSize: 16, fontWeight: 800 }}>{s.value}</div>
                <div style={{ fontSize: 11, opacity: 0.8 }}>{s.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Dog card */}
        <div style={{ margin: "0 16px 14px", background: "#fff", borderRadius: 16, border: `1px solid ${GB}`, padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>Poodle'ım</span>
            {primaryDog && (
              <button type="button" onClick={() => navigate(`${BASE}/p/${primaryDog.slug}`)}
                style={{ background: "none", border: "none", color: P, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                Profili Gör
              </button>
            )}
          </div>

          {!primaryDog ? (
            <div style={{ textAlign: "center", padding: "8px 0 4px" }}>
              <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 12, lineHeight: 1.45 }}>
                Henüz Poodle profilin yok. Oluşturunca Club ve Mama Bul kişiselleşir.
              </p>
              <button type="button" onClick={() => navigate(`${BASE}/p/olustur`)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: P, color: "#fff", border: "none", borderRadius: 12,
                  padding: "10px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                }}>
                <Plus size={15} /> Poodle Ekle
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 12 }}>
              <img
                src={primaryDog.avatar_url || "/images/yp-poodle-hero.png"}
                alt=""
                style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", border: `2px solid ${P}`, flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#111827" }}>{primaryDog.name}</div>
                <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>
                  {BREED_TR[primaryDog.breed || ""] || primaryDog.breed || "Poodle"}
                  {dogAge(primaryDog.birth_date) ? ` · ${dogAge(primaryDog.birth_date)}` : ""}
                  {primaryDog.weight_kg ? ` · ${primaryDog.weight_kg} kg` : ""}
                </div>
                {primaryDog.city && (
                  <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 3, fontSize: 11, color: "#6B7280" }}>
                    <MapPin size={11} /> {primaryDog.city}
                  </div>
                )}
                <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                  <button type="button" onClick={() => navigate(`${BASE}/p/${primaryDog.slug}/duzenle`)}
                    style={{ background: P, color: "#fff", border: "none", borderRadius: 10, padding: "7px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                    Bilgileri Güncelle
                  </button>
                  <button type="button" onClick={() => navigate(`${BASE}/p/${primaryDog.slug}`)}
                    style={{ background: "#fff", color: P, border: `1.5px solid ${P}`, borderRadius: 10, padding: "7px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                    Club Profili
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div style={{ padding: "0 16px 14px" }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#111827", marginBottom: 10 }}>Hızlı İşlemler</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {quickActions.map(a => (
              <button key={a.label} type="button"
                onClick={() => a.soon ? showSoon(a.label) : navigate(a.href)}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "11px 12px",
                  borderRadius: 12, border: `1px solid ${GB}`, background: "#fff",
                  cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                  opacity: a.soon ? 0.75 : 1,
                }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 10, background: a.bg, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <a.Icon size={16} color={a.color} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{a.label}</div>
                  {a.sub != null && <div style={{ fontSize: 10, color: "#6B7280", marginTop: 1 }}>{a.sub}</div>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Active order — only if real */}
        {activeOrder && (
          <div style={{ margin: "0 16px 14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>Aktif Siparişim</span>
              <button type="button" onClick={() => navigate("/hesabim/siparisler")}
                style={{ background: "none", border: "none", color: P, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                Tümü
              </button>
            </div>
            <div style={{ background: "#fff", borderRadius: 14, border: `1px solid ${GB}`, padding: 14 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 10, background: PL, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
                }}>
                  {itemImg
                    ? <img src={itemImg} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    : <Package size={22} color={P} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, color: "#9CA3AF" }}>#{activeOrder.id}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginTop: 2, lineHeight: 1.35 }}>
                    {itemName}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: P, marginTop: 4 }}>
                    ₺{Number(activeOrder.grandTotal || 0).toLocaleString("tr-TR")}
                  </div>
                </div>
                <span style={{
                  alignSelf: "flex-start", background: PL, color: P, fontSize: 10, fontWeight: 700,
                  padding: "4px 8px", borderRadius: 999, whiteSpace: "nowrap",
                }}>
                  {statusLabel(activeOrder.status)}
                </span>
              </div>
              <OrderStepper current={statusKey(activeOrder.status)} />
              <button type="button" onClick={() => navigate(`/hesabim/siparisler/${activeOrder.id}`)}
                style={{
                  width: "100%", marginTop: 14, border: `1.5px solid ${P}`, color: P, background: "#fff",
                  borderRadius: 12, padding: "10px 0", fontSize: 13, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit",
                }}>
                Siparişi Takip Et
              </button>
            </div>
          </div>
        )}

        {/* Club summary if dog exists */}
        {primaryDog && (
          <div style={{ margin: "0 16px 14px" }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#111827", marginBottom: 8 }}>Club Aktivitem</div>
            <div style={{ background: "#fff", borderRadius: 14, border: `1px solid ${GB}`, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 12 }}>
                {[
                  { v: primaryDog.post_count || 0, l: "Paylaşım" },
                  { v: primaryDog.follower_count || 0, l: "Takipçi" },
                  { v: primaryDog.following_count || 0, l: "Takip" },
                ].map(x => (
                  <div key={x.l} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>{x.v}</div>
                    <div style={{ fontSize: 11, color: "#6B7280" }}>{x.l}</div>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => navigate("/hesabim/club-paylasimlarim")}
                style={{
                  width: "100%", border: `1.5px solid ${P}`, color: P, background: "#fff",
                  borderRadius: 10, padding: "9px 0", fontSize: 13, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit", marginBottom: 8,
                }}>
                Paylaşımlarımı Gör
              </button>
              <button type="button" onClick={() => navigate("/hesabim/poodle-puanlari")}
                style={{
                  width: "100%", border: "none", color: "#fff", background: P,
                  borderRadius: 10, padding: "9px 0", fontSize: 13, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit",
                }}>
                Poodle Puanları
              </button>
            </div>
          </div>
        )}

        {/* Settings */}
        <div style={{ margin: "0 16px 14px" }}>
          <div style={{ background: "#fff", borderRadius: 16, border: `1px solid ${GB}`, overflow: "hidden" }}>
            {settingsRows.map((row, idx) => (
              <button key={row.label} type="button"
                onClick={() => row.soon ? showSoon(row.label) : navigate(row.href)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  width: "100%", padding: "13px 14px", background: "#fff", border: "none",
                  borderBottom: idx < settingsRows.length - 1 ? "1px solid #F3F4F6" : "none",
                  cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                  opacity: row.soon ? 0.75 : 1,
                }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <row.Icon size={17} color="#6B7280" />
                  <span style={{ fontSize: 14, fontWeight: 500, color: "#1F2937" }}>
                    {row.label}{row.soon ? " · Yakında" : ""}
                  </span>
                </div>
                <ChevronRight size={15} color="#9CA3AF" />
              </button>
            ))}
          </div>

          <button type="button" onClick={handleLogout}
            style={{
              width: "100%", marginTop: 12, padding: "13px 16px",
              background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: 12,
              fontSize: 14, fontWeight: 700, color: "#DC2626", cursor: "pointer",
              fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
            <LogOut size={16} /> Çıkış Yap
          </button>
        </div>
      </div>
      {toast && (
        <div style={{
          position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)", zIndex: 999,
          background: "#111827", color: "#fff", padding: "10px 20px", borderRadius: 12,
          fontSize: 13, fontWeight: 500, whiteSpace: "nowrap",
          boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
        }}>
          {toast}
        </div>
      )}
    </YPLayout>
  );
}
