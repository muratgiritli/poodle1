// Route: /hesabim/siparisler
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft, Search, Check, Truck, Calendar,
  Headphones, Package,
} from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { useCustomer } from "@/contexts/CustomerContext";
import { goBack } from "@/lib/goBack";
import { IS_YP } from "@/lib/store";

const BASE = IS_YP ? "" : "/yourpoodle";
const P   = "#5D3A1A";
const PL  = "#F5F0E6";
const GB  = "#E5E7EB";
const GBG = "#F9FAFB";
const GT  = "#6B7280";
const DRK = "#111827";

const STEPS = ["Alındı", "Hazırlanıyor", "Kargoda", "Teslim"];

const STATUS_META: Record<string, { label: string; color: string; bg: string; stepIdx: number; tab: "active" | "done" | "return" }> = {
  beklemede:    { label: "Sipariş Alındı",     color: "#92400E", bg: "#FEF3C7", stepIdx: 0, tab: "active" },
  hazirlaniyor: { label: "Kargoya Hazırlanıyor", color: "#9A3412", bg: "#FFF7ED", stepIdx: 1, tab: "active" },
  kargoda:      { label: "Kargoda",            color: "#1E40AF", bg: "#EFF6FF", stepIdx: 2, tab: "active" },
  yolda:        { label: "Kargoda",            color: "#1E40AF", bg: "#EFF6FF", stepIdx: 2, tab: "active" },
  teslim:       { label: "Teslim Edildi",      color: "#166534", bg: "#DCFCE7", stepIdx: 3, tab: "done" },
  iptal:        { label: "İptal",              color: "#991B1B", bg: "#FEE2E2", stepIdx: 0, tab: "return" },
  iade:         { label: "İade",               color: "#6D28D9", bg: "#EDE5D8", stepIdx: 0, tab: "return" },
};

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

function formatCurrency(v: number | string) {
  return Number(v || 0).toLocaleString("tr-TR", { maximumFractionDigits: 0 });
}

function OrderStepper({ stepIdx }: { stepIdx: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "10px 0 4px" }}>
      {STEPS.map((step, i) => {
        const done   = i < stepIdx;
        const active = i === stepIdx;
        return (
          <div key={step} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{
                width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                background: done || active ? P : "#fff",
                border: done || active ? `2px solid ${P}` : `2px solid ${GB}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {done && <Check size={11} color="#fff" strokeWidth={3} />}
                {active && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />}
              </div>
              <span style={{
                fontSize: 9, fontWeight: active ? 700 : 500,
                color: active ? P : done ? P : GT,
                whiteSpace: "nowrap",
              }}>{step}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                flex: 1, height: 2, margin: "0 2px", marginBottom: 14,
                background: done ? P : GB,
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function StatusBadge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: 999,
      background: bg, color, fontSize: 11, fontWeight: 700,
    }}>
      {label}
    </span>
  );
}

function ActionBtn({
  children, variant = "outline", onClick,
}: { children: React.ReactNode; variant?: "solid" | "outline" | "ghost"; onClick?: () => void }) {
  const styles: Record<string, React.CSSProperties> = {
    solid: { background: P, color: "#fff", border: "none" },
    outline: { background: "#fff", color: P, border: `1.5px solid ${P}` },
    ghost: { background: GBG, color: GT, border: `1.5px solid ${GB}` },
  };
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, padding: "9px 0", borderRadius: 10, fontSize: 12, fontWeight: 700,
        cursor: "pointer", fontFamily: "inherit",
        ...styles[variant],
      }}
      onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
      {children}
    </button>
  );
}

export default function YPHesabimSiparislerimPage() {
  const [, navigate] = useLocation();
  const { isLoggedIn, isLoading } = useCustomer();
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.title = "Siparişlerim | YourPoodle";
  }, []);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate(`${BASE}/giris?returnTo=${encodeURIComponent("/hesabim/siparisler")}`);
    }
  }, [isLoading, isLoggedIn, navigate]);

  const { data: apiOrders, isLoading: ordersLoading } = useQuery<any[]>({
    queryKey: ["/api/customer/orders"],
    enabled: !!isLoggedIn,
    staleTime: 30_000,
  });

  const orders = useMemo(() => {
    const list = Array.isArray(apiOrders) ? apiOrders : [];
    return list.filter((o: any) =>
      o.paymentStatus !== "pending" && o.paymentStatus !== "awaiting"
    );
  }, [apiOrders]);

  const categorized = useMemo(() => {
    const active: any[] = [];
    const done: any[] = [];
    const ret: any[] = [];
    for (const o of orders) {
      const meta = STATUS_META[String(o.status || "").toLowerCase()] || STATUS_META.beklemede;
      if (meta.tab === "active") active.push(o);
      else if (meta.tab === "done") done.push(o);
      else ret.push(o);
    }
    return { active, done, ret };
  }, [orders]);

  const q = search.trim().toLowerCase();
  const matchSearch = (o: any) => {
    if (!q) return true;
    const items: any[] = Array.isArray(o.items) ? o.items : [];
    const names = items.map(i => String(i.name || "")).join(" ").toLowerCase();
    return String(o.id).includes(q) || names.includes(q);
  };

  const tabs = [
    { key: "all", label: "Tümü", count: orders.length },
    { key: "active", label: "Aktif", count: categorized.active.length },
    { key: "done", label: "Tamamlandı", count: categorized.done.length },
    { key: "return", label: "İade", count: categorized.ret.length },
  ];

  if (isLoading || !isLoggedIn) {
    return (
      <YPLayout activeLink="" constrain={false}>
        <div style={{ padding: 48, textAlign: "center", color: GT, fontSize: 14 }}>Yükleniyor...</div>
      </YPLayout>
    );
  }

  const goDetail = (id: number | string) => navigate(`/hesabim/siparisler/${id}`);

  const renderActiveCard = (order: any) => {
    const status = String(order.status || "").toLowerCase();
    const meta = STATUS_META[status] || STATUS_META.beklemede;
    const items: any[] = Array.isArray(order.items) ? order.items : [];
    const tracking = order.trackingNumber
      ? `${order.cargoCompany || "Kargo"} • Takip No: ${order.trackingNumber}`
      : null;

    return (
      <div key={order.id} style={{
        background: "#fff", borderRadius: 16,
        border: `1px solid ${GB}`, marginBottom: 12, overflow: "hidden",
      }}>
        <div style={{
          padding: "12px 14px 10px", borderBottom: `1px solid ${GBG}`,
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: DRK }}>Sipariş #{order.id}</div>
            <div style={{ fontSize: 11, color: GT, marginTop: 2 }}>{formatDate(order.createdAt)}</div>
          </div>
          <StatusBadge label={meta.label} color={meta.color} bg={meta.bg} />
        </div>

        <div style={{ padding: "12px 14px" }}>
          {items.length > 0 ? (
            items.slice(0, 2).map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < Math.min(items.length, 2) - 1 ? 10 : 0 }}>
                {item.img ? (
                  <img src={item.img} alt={item.name || ""}
                    style={{ width: 54, height: 54, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
                ) : (
                  <div style={{
                    width: 54, height: 54, borderRadius: 10, background: PL, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Package size={20} color={P} />
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: DRK, lineHeight: 1.3, marginBottom: 2 }}>
                    {item.name || "Ürün"}
                  </div>
                  <div style={{ fontSize: 12, color: GT }}>{item.quantity || item.qty || 1} adet</div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: DRK, flexShrink: 0 }}>
                  {formatCurrency(Number(item.price || 0) * Number(item.quantity || item.qty || 1))} TL
                </div>
              </div>
            ))
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: GT }}>Ürün bilgisi yok</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: DRK }}>{formatCurrency(order.grandTotal)} TL</span>
            </div>
          )}
          {items.length > 2 && (
            <div style={{ fontSize: 12, color: GT, marginTop: 8 }}>+{items.length - 2} ürün daha</div>
          )}
        </div>

        {order.deliverySlot && (
          <div style={{
            margin: "0 14px 10px", background: PL, borderRadius: 10, padding: "8px 12px",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <Calendar size={14} color={P} />
            <span style={{ fontSize: 12, color: P, fontWeight: 600 }}>Tahmini teslimat: {order.deliverySlot}</span>
          </div>
        )}
        {tracking && (
          <div style={{
            margin: "0 14px 10px", background: GBG, borderRadius: 10, padding: "8px 12px",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <Truck size={14} color={GT} />
            <span style={{ fontSize: 12, color: GT, fontWeight: 500 }}>{tracking}</span>
          </div>
        )}

        <div style={{ padding: "0 14px" }}>
          <OrderStepper stepIdx={meta.stepIdx} />
        </div>

        <div style={{ padding: "10px 14px 12px", display: "flex", gap: 8 }}>
          <ActionBtn variant="outline" onClick={() => goDetail(order.id)}>
            {tracking ? "Kargoyu Takip Et" : "Siparişi Takip Et"}
          </ActionBtn>
          <ActionBtn variant="ghost" onClick={() => goDetail(order.id)}>
            Sipariş Detayı
          </ActionBtn>
        </div>
      </div>
    );
  };

  const renderCompactCard = (order: any, badge: { label: string; color: string; bg: string }) => {
    const items: any[] = Array.isArray(order.items) ? order.items : [];
    const first = items[0];
    return (
      <div key={order.id} style={{
        background: "#fff", borderRadius: 16, border: `1px solid ${GB}`,
        marginBottom: 10, overflow: "hidden", padding: "12px 14px",
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
          {first?.img ? (
            <img src={first.img} alt={first.name || ""}
              style={{ width: 48, height: 48, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
          ) : (
            <div style={{
              width: 48, height: 48, borderRadius: 10, background: PL, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Package size={18} color={P} />
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: GT, marginBottom: 2 }}>
              #{order.id} · {formatDate(order.createdAt)}
            </div>
            {first?.name ? (
              <div style={{
                fontSize: 13, fontWeight: 600, color: DRK, lineHeight: 1.3, marginBottom: 2,
                overflow: "hidden", display: "-webkit-box",
                WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any,
              }}>
                {first.name}
              </div>
            ) : (
              <div style={{ fontSize: 13, color: GT, marginBottom: 2 }}>{items.length || 0} ürün</div>
            )}
            <div style={{ fontSize: 13, fontWeight: 700, color: DRK }}>{formatCurrency(order.grandTotal)} TL</div>
          </div>
          <StatusBadge label={badge.label} color={badge.color} bg={badge.bg} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <ActionBtn variant="ghost" onClick={() => goDetail(order.id)}>Sipariş Detayı</ActionBtn>
        </div>
      </div>
    );
  };

  const showActive = activeTab === "all" || activeTab === "active";
  const showDone = activeTab === "all" || activeTab === "done";
  const showReturn = activeTab === "all" || activeTab === "return";
  const activeList = categorized.active.filter(matchSearch);
  const doneList = categorized.done.filter(matchSearch);
  const returnList = categorized.ret.filter(matchSearch);
  const empty = !ordersLoading && orders.length === 0;

  return (
    <YPLayout activeLink="" constrain={false}>
      <div style={{
        maxWidth: "var(--yp-shell-max)", margin: "0 auto",
        fontFamily: "'Inter',-apple-system,sans-serif",
        color: DRK, background: GBG, minHeight: "100vh", paddingBottom: 80,
      }}>
        <div style={{ background: "#fff", padding: "14px 16px 16px", borderBottom: `1px solid ${GB}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <button onClick={() => goBack(navigate, "/hesabim")} aria-label="Geri"
              style={{ background: "none", border: "none", cursor: "pointer",
                       display: "flex", alignItems: "center", padding: 0, color: GT }}>
              <ArrowLeft size={17} />
            </button>
            <span style={{ fontSize: 12, color: GT }}>Hesabım</span>
            <span style={{ fontSize: 12, color: GT }}>/</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: DRK }}>Siparişlerim</span>
          </div>

          <h1 style={{ fontSize: 22, fontWeight: 700, color: DRK, marginBottom: 4 }}>Siparişlerim</h1>
          <p style={{ fontSize: 13, color: GT, lineHeight: 1.5, marginBottom: 14 }}>
            Siparişlerinizi görüntüleyin ve kolayca takip edin.
          </p>

          <div style={{ position: "relative" }}>
            <Search size={16} color="#9CA3AF" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              placeholder="Sipariş numarası veya ürün ara..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: "100%", padding: "10px 12px 10px 38px",
                borderRadius: 12, border: `1.5px solid ${GB}`,
                fontSize: 13, fontFamily: "inherit", color: DRK,
                outline: "none", background: "#fff", boxSizing: "border-box",
              }}
              onFocus={e => { e.currentTarget.style.borderColor = P; }}
              onBlur={e => { e.currentTarget.style.borderColor = GB; }}
            />
          </div>
        </div>

        <div style={{
          background: "#fff", borderBottom: `1px solid ${GB}`,
          display: "flex", overflowX: "auto", scrollbarWidth: "none",
        }}>
          {tabs.map(tab => {
            const active = activeTab === tab.key;
            return (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                style={{
                  flexShrink: 0, padding: "12px 16px",
                  background: "none", border: "none",
                  borderBottom: active ? `2px solid ${P}` : "2px solid transparent",
                  cursor: "pointer", fontFamily: "inherit",
                  display: "flex", alignItems: "center", gap: 5,
                }}>
                <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? P : GT }}>
                  {tab.label}
                </span>
                <span style={{
                  fontSize: 11, fontWeight: 700, minWidth: 20,
                  padding: "1px 6px", borderRadius: 999,
                  background: active ? PL : "#F3F4F6",
                  color: active ? P : GT,
                }}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ padding: "12px 12px 0" }}>
          {ordersLoading && (
            <div style={{ textAlign: "center", padding: "40px 0", color: GT, fontSize: 14 }}>Yükleniyor…</div>
          )}

          {empty && (
            <div style={{ textAlign: "center", padding: "48px 16px" }}>
              <Package size={40} color="#D1D5DB" style={{ margin: "0 auto 12px" }} />
              <div style={{ fontSize: 16, fontWeight: 700, color: DRK, marginBottom: 6 }}>Henüz siparişiniz yok</div>
              <p style={{ fontSize: 13, color: GT, marginBottom: 18 }}>Mağazadan ilk siparişinizi verin.</p>
              <button onClick={() => navigate(`${BASE}/magaza`)}
                style={{
                  background: P, color: "#fff", border: "none", borderRadius: 12,
                  padding: "11px 22px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                }}>
                Mağazaya Git
              </button>
            </div>
          )}

          {showActive && activeList.map(renderActiveCard)}

          {showDone && doneList.length > 0 && (
            <>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "8px 2px",
              }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: DRK }}>Tamamlanan Siparişler</span>
                <span style={{ fontSize: 12, color: GT }}>{doneList.length} sipariş</span>
              </div>
              {doneList.map(o => renderCompactCard(o, { label: "Teslim Edildi", color: "#166534", bg: "#DCFCE7" }))}
            </>
          )}

          {showReturn && returnList.length > 0 && (
            <>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "8px 2px",
              }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: DRK }}>İade ve İptaller</span>
              </div>
              {returnList.map(o => {
                const meta = STATUS_META[String(o.status || "").toLowerCase()] || STATUS_META.iptal;
                return renderCompactCard(o, { label: meta.label, color: meta.color, bg: meta.bg });
              })}
            </>
          )}

          {!ordersLoading && !empty &&
            ((activeTab === "active" && activeList.length === 0) ||
             (activeTab === "done" && doneList.length === 0) ||
             (activeTab === "return" && returnList.length === 0) ||
             (activeTab === "all" && !activeList.length && !doneList.length && !returnList.length && q)) && (
            <div style={{ textAlign: "center", padding: "32px 0", color: GT, fontSize: 13 }}>
              Bu filtrede sipariş bulunamadı.
            </div>
          )}

          <div style={{
            background: "linear-gradient(135deg,#F5F0E6 0%,#EDE5D8 100%)",
            borderRadius: 16, padding: "16px 14px",
            display: "flex", alignItems: "flex-start", gap: 12,
            marginBottom: 16, marginTop: 8,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%", background: P,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Headphones size={20} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: DRK, marginBottom: 4 }}>
                Siparişlerinizle ilgili yardıma mı ihtiyacınız var?
              </div>
              <div style={{ fontSize: 12, color: GT, lineHeight: 1.5, marginBottom: 12 }}>
                Destek ekibimiz hafta içi ve cumartesi 09.00-18.00 arasında yanınızda.
              </div>
              <button
                onClick={() => navigate("/hesabim/yardim")}
                style={{
                  background: P, color: "#fff", border: "none",
                  borderRadius: 10, padding: "9px 20px",
                  fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                }}>
                Destek Al
              </button>
            </div>
          </div>
        </div>
      </div>
    </YPLayout>
  );
}
