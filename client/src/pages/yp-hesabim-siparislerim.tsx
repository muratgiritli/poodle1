// Route: /hesabim/siparisler
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft, Search, Check, Truck, Calendar,
  ChevronDown, Headphones, ShieldCheck,
} from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { useCustomer } from "@/contexts/CustomerContext";

/* ─── Palette ─────────────────────────────────── */
const P   = "#4B2BD6";
const PL  = "#F3EEFF";
const GB  = "#E5E7EB";
const GBG = "#F9FAFB";
const GT  = "#6B7280";
const DRK = "#111827";

/* ─── Mock data (replaces/extends real API) ─────── */
const MOCK_ACTIVE = [
  {
    id: "YP-2026072318",
    date: "23 Temmuz 2026",
    status: "hazirlaniyor",
    statusLabel: "Kargoya Hazırlanıyor",
    statusColor: "#9A3412",
    statusBg: "#FFF7ED",
    stepIdx: 1, // 0=Alındı 1=Hazırlanıyor 2=Kargoda 3=Teslim
    delivery: "Tahmini teslimat: 25-26 Temmuz",
    tracking: null,
    items: [
      { img: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=80&h=80&fit=crop", name: "Pro Plan Small Adult Sensitive Somonlu 3 kg", qty: 1, total: "1.349 TL" },
    ],
    total: "1.349 TL",
    primaryBtn: "Siparişi Takip Et",
    secondaryBtn: "Sipariş Detayı",
    hasHelp: true,
  },
  {
    id: "YP-2026072211",
    date: "23 Temmuz 2026",
    status: "kargoda",
    statusLabel: "Kargoda",
    statusColor: "#1E40AF",
    statusBg: "#EFF6FF",
    stepIdx: 2,
    delivery: null,
    tracking: "Yurtiçi Kargo • Takip No: 78451296.30",
    items: null,
    itemCount: 2,
    total: "838 TL",
    primaryBtn: "Kargoyu Takip Et",
    secondaryBtn: "Sipariş Detayı",
    hasHelp: false,
  },
];

const MOCK_COMPLETED = [
  {
    id: "YP-2026071507",
    date: "15 Temmuz 2026",
    img: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=80&h=80&fit=crop",
    name: "Simple Solution Yarı Köpek Çiş Pedi 30'lu",
    total: "449 TL",
    deliveredDate: "17 Temmuz 2026",
    btn1: "Tekrar Satın Al",
    btn2: "Değerlendir",
  },
  {
    id: "YP-2026070803",
    date: "8 Temmuz 2026",
    img: null,
    name: null,
    itemCount: 2,
    total: "718 TL",
    deliveredDate: "10 Temmuz 2026",
    btn1: "Tekrar Satın Al",
    btn2: "Sipariş Detayı",
  },
  {
    id: "YP-2026062914",
    date: "29 Haziran 2026",
    img: "https://images.unsplash.com/photo-1601758177266-bc599de87707?w=80&h=80&fit=crop",
    name: "Royal Canin Mini Adult 2 kg",
    total: "1.049 TL",
    deliveredDate: "1 Temmuz 2026",
    btn1: "Tekrar Satın Al",
    btn2: "Değerlendir",
  },
];

const MOCK_RETURNS = [
  {
    id: "YP-2026061810",
    date: "18 Haziran 2026",
    img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=80&h=80&fit=crop",
    name: "Air Mesh Göğüs Taşıması",
    total: "429 TL",
    note: "İade tutarı kartınıza gönderildi.",
    btn: "İade Detayı",
  },
];

const STEPS = ["Alındı", "Hazırlanıyor", "Kargoda", "Teslim"];
const TABS = [
  { key: "all",       label: "Tümü",       count: 12 },
  { key: "active",    label: "Aktif",      count: 2  },
  { key: "done",      label: "Tamamlandı", count: 9  },
  { key: "return",    label: "İade",       count: 1  },
];

/* ─── Sub-components ─────────────────────────────── */
function OrderStepper({ stepIdx }: { stepIdx: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "10px 0 4px" }}>
      {STEPS.map((step, i) => {
        const done   = i < stepIdx;
        const active = i === stepIdx;
        return (
          <div key={step} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : 0 }}>
            {/* Node */}
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
            {/* Connector */}
            {i < STEPS.length - 1 && (
              <div style={{
                flex: 1, height: 2, margin: "0 2px",
                marginBottom: 14,
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
    solid: {
      background: P, color: "#fff", border: "none",
    },
    outline: {
      background: "#fff", color: P, border: `1.5px solid ${P}`,
    },
    ghost: {
      background: GBG, color: GT, border: `1.5px solid ${GB}`,
    },
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

/* ─── Main Page ──────────────────────────────────── */
export default function YPHesabimSiparislerimPage() {
  const [, navigate] = useLocation();
  const { isLoggedIn } = useCustomer();
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (isLoggedIn === false) {
      navigate("/yourpoodle/giris?returnTo=/hesabim/siparisler");
    }
  }, [isLoggedIn]);

  /* Real API data — augments the mock order list when logged in */
  const { data: apiOrders } = useQuery<any[]>({
    queryKey: ["/api/customer/orders"],
    enabled: !!isLoggedIn,
    staleTime: 30_000,
  });

  if (!isLoggedIn) return null;

  return (
    <YPLayout activeLink="" constrain={false}>
      <div style={{
        maxWidth: 480, margin: "0 auto",
        fontFamily: "'Inter',-apple-system,sans-serif",
        color: DRK, background: GBG, minHeight: "100vh", paddingBottom: 80,
      }}>

        {/* ── BREADCRUMB + TITLE ── */}
        <div style={{ background: "#fff", padding: "14px 16px 16px", borderBottom: `1px solid ${GB}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <button onClick={() => navigate("/hesabim")} aria-label="Geri"
              style={{ background: "none", border: "none", cursor: "pointer",
                       display: "flex", alignItems: "center", padding: 0, color: GT }}>
              <ArrowLeft size={17} />
            </button>
            <span style={{ fontSize: 12, color: GT }}>Hesabım</span>
            <span style={{ fontSize: 12, color: GT }}>/</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: DRK }}>Siparişlerim</span>
          </div>

          <h1 style={{ fontSize: 22, fontWeight: 700, color: DRK, marginBottom: 4 }}>
            Siparişlerim
          </h1>
          <p style={{ fontSize: 13, color: GT, lineHeight: 1.5, marginBottom: 14 }}>
            Siparişlerinizi görüntüleyin ve kolayca takip edin.
          </p>

          {/* Search */}
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

        {/* ── FILTER TABS ── */}
        <div style={{
          background: "#fff", borderBottom: `1px solid ${GB}`,
          display: "flex", overflowX: "auto",
          scrollbarWidth: "none",
        }}>
          {TABS.map(tab => {
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

          {/* ══════════ ACTIVE ORDERS ══════════ */}
          {(activeTab === "all" || activeTab === "active") && MOCK_ACTIVE.map(order => (
            <div key={order.id} style={{
              background: "#fff", borderRadius: 16,
              border: `1px solid ${GB}`, marginBottom: 12, overflow: "hidden",
            }}>
              {/* Order header */}
              <div style={{
                padding: "12px 14px 10px",
                borderBottom: `1px solid ${GBG}`,
                display: "flex", alignItems: "flex-start", justifyContent: "space-between",
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: DRK }}>
                    Sipariş #{order.id}
                  </div>
                  <div style={{ fontSize: 11, color: GT, marginTop: 2 }}>{order.date}</div>
                </div>
                <StatusBadge label={order.statusLabel} color={order.statusColor} bg={order.statusBg} />
              </div>

              {/* Item row */}
              <div style={{ padding: "12px 14px" }}>
                {order.items ? (
                  order.items.map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <img src={item.img} alt={item.name}
                        style={{ width: 54, height: 54, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: DRK, lineHeight: 1.3, marginBottom: 2 }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: 12, color: GT }}>{item.qty} adet</div>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: DRK, flexShrink: 0 }}>
                        {item.total}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, color: GT }}>{order.itemCount} ürün</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: DRK }}>{order.total}</span>
                  </div>
                )}
              </div>

              {/* Delivery / tracking info */}
              {order.delivery && (
                <div style={{
                  margin: "0 14px 10px",
                  background: PL, borderRadius: 10, padding: "8px 12px",
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <Calendar size={14} color={P} />
                  <span style={{ fontSize: 12, color: P, fontWeight: 600 }}>{order.delivery}</span>
                </div>
              )}
              {order.tracking && (
                <div style={{
                  margin: "0 14px 10px",
                  background: GBG, borderRadius: 10, padding: "8px 12px",
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <Truck size={14} color={GT} />
                  <span style={{ fontSize: 12, color: GT, fontWeight: 500 }}>{order.tracking}</span>
                </div>
              )}

              {/* Progress stepper */}
              <div style={{ padding: "0 14px" }}>
                <OrderStepper stepIdx={order.stepIdx} />
              </div>

              {/* Buttons */}
              <div style={{ padding: "10px 14px 12px", display: "flex", gap: 8 }}>
                <ActionBtn variant="outline" onClick={() => alert(`${order.id} takip`)}>
                  {order.primaryBtn}
                </ActionBtn>
                <ActionBtn variant="ghost" onClick={() => alert(`${order.id} detay`)}>
                  {order.secondaryBtn}
                </ActionBtn>
              </div>

              {/* Help link */}
              {order.hasHelp && (
                <div style={{ textAlign: "center", paddingBottom: 12 }}>
                  <button style={{ background: "none", border: "none", fontSize: 12, color: P,
                                   fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                                   textDecoration: "underline" }}>
                    Yardım Al
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* ══════════ COMPLETED ORDERS ══════════ */}
          {(activeTab === "all" || activeTab === "done") && (
            <>
              {/* Section header */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "8px 2px 8px",
              }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: DRK }}>Tamamlanan Siparişler</span>
                <span style={{ fontSize: 12, color: GT }}>9 sipariş</span>
              </div>

              {MOCK_COMPLETED.map(order => (
                <div key={order.id} style={{
                  background: "#fff", borderRadius: 16,
                  border: `1px solid ${GB}`, marginBottom: 10, overflow: "hidden",
                  padding: "12px 14px",
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                    {/* Thumb */}
                    {order.img ? (
                      <img src={order.img} alt={order.name || ""}
                        style={{ width: 48, height: 48, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: 48, height: 48, borderRadius: 10, background: PL,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 22, flexShrink: 0 }}>🐾</div>
                    )}

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, color: GT, marginBottom: 2 }}>
                        #{order.id} · {order.date}
                      </div>
                      {order.name ? (
                        <div style={{ fontSize: 13, fontWeight: 600, color: DRK, lineHeight: 1.3, marginBottom: 2,
                                      overflow: "hidden", display: "-webkit-box",
                                      WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any }}>
                          {order.name}
                        </div>
                      ) : (
                        <div style={{ fontSize: 13, color: GT, marginBottom: 2 }}>{order.itemCount} ürün</div>
                      )}
                      <div style={{ fontSize: 13, fontWeight: 700, color: DRK }}>{order.total}</div>
                    </div>

                    {/* Status + delivered */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                      <StatusBadge label="Teslim Edildi" color="#166534" bg="#DCFCE7" />
                    </div>
                  </div>

                  {/* Delivered date */}
                  <div style={{ fontSize: 11, color: GT, marginBottom: 10 }}>
                    Teslim: {order.deliveredDate}
                  </div>

                  {/* Buttons */}
                  <div style={{ display: "flex", gap: 8 }}>
                    <ActionBtn variant="ghost" onClick={() => alert("Tekrar satın al")}>
                      {order.btn1}
                    </ActionBtn>
                    <ActionBtn variant="ghost" onClick={() => alert("Detay")}>
                      {order.btn2}
                    </ActionBtn>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* ══════════ RETURNS ══════════ */}
          {(activeTab === "all" || activeTab === "return") && (
            <>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "8px 2px 8px",
              }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: DRK }}>İade ve İptaller</span>
              </div>

              {MOCK_RETURNS.map(order => (
                <div key={order.id} style={{
                  background: "#fff", borderRadius: 16,
                  border: `1px solid ${GB}`, marginBottom: 10, overflow: "hidden",
                  padding: "12px 14px",
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                    <img src={order.img} alt={order.name}
                      style={{ width: 48, height: 48, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, color: GT, marginBottom: 2 }}>
                        #{order.id} · {order.date}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: DRK, lineHeight: 1.3, marginBottom: 2 }}>
                        {order.name}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: DRK }}>{order.total}</div>
                    </div>
                    <StatusBadge label="İade Tamamlandı" color="#6D28D9" bg="#EDE9FE" />
                  </div>

                  {/* Refund note */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: 6,
                    fontSize: 12, color: "#16A34A", fontWeight: 500, marginBottom: 10,
                  }}>
                    <ShieldCheck size={13} color="#16A34A" />
                    {order.note}
                  </div>

                  <ActionBtn variant="ghost" onClick={() => alert("İade detayı")}>
                    {order.btn}
                  </ActionBtn>
                </div>
              ))}
            </>
          )}

          {/* ══════════ LOAD MORE ══════════ */}
          {(activeTab === "all" || activeTab === "done") && !showMore && (
            <button
              onClick={() => setShowMore(true)}
              style={{
                width: "100%", padding: "13px 0",
                background: "#fff", border: `1.5px solid ${GB}`,
                borderRadius: 14, fontSize: 13, fontWeight: 600, color: GT,
                cursor: "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                marginBottom: 12,
              }}>
              <ChevronDown size={16} />
              Daha Fazla Sipariş Göster
            </button>
          )}

          {/* ══════════ SUPPORT BANNER ══════════ */}
          <div style={{
            background: "linear-gradient(135deg,#F3EEFF 0%,#E9D5FF 100%)",
            borderRadius: 16, padding: "16px 14px",
            display: "flex", alignItems: "flex-start", gap: 12,
            marginBottom: 16,
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
                onClick={() => alert("Destek")}
                style={{
                  background: P, color: "#fff", border: "none",
                  borderRadius: 10, padding: "9px 20px",
                  fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                }}>
                Destek Al
              </button>
            </div>
          </div>

          {/* ══════════ MINI FOOTER ══════════ */}
          <div style={{
            background: "#1D1E9B", borderRadius: 16, padding: "20px 16px",
            marginBottom: 16,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 22 }}>🐾</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>YourPoodle</span>
            </div>
            <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
              {["Yardım", "İletişim", "KVKK"].map(link => (
                <a key={link} href="#"
                  style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>
                  {link}
                </a>
              ))}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>
              🔒 256-bit SSL ile güvenli alışveriş
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
              © 2026 YourPoodle
            </div>
          </div>

        </div>
      </div>
    </YPLayout>
  );
}
