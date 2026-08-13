import { useEffect, useMemo, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { ArrowLeft, Package, MapPin, CreditCard, Truck, FileText, RotateCcw, HelpCircle } from "lucide-react";
import { STEP_LABELS } from "@/data/orders";
import { useCustomer } from "@/contexts/CustomerContext";
import { IS_YP } from "@/lib/store";
import { goBack } from "@/lib/goBack";

const P = "#5D3A1A";
const BASE = IS_YP ? "" : "/yourpoodle";

const STATUS_STEP: Record<string, number> = {
  beklemede: 1,
  hazirlaniyor: 2,
  kargoda: 3,
  yolda: 3,
  teslim: 4,
  iptal: 1,
  iade: 1,
};

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  nakit: "Kapıda Nakit",
  "kredi-karti": "Kredi Kartı",
  "kapida-kart": "Kapıda Kart",
  havale: "Havale/EFT",
  iyzico: "Kredi Kartı (Online)",
  tosla: "Tosla ile Öde",
};

function Stepper({ step }: { step: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
      {STEP_LABELS.map((label, i) => {
        const done = i < step, active = i === step - 1;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEP_LABELS.length - 1 ? 1 : undefined }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: done || active ? P : "#E5E7EB",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, color: done || active ? "#fff" : "#9CA3AF", fontWeight: 700,
              }}>{done ? "✓" : i + 1}</div>
              <span style={{ fontSize: 10, color: active ? P : "#6B7280", marginTop: 4, textAlign: "center", maxWidth: 60, lineHeight: 1.3 }}>{label}</span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div style={{ flex: 1, height: 2, background: done ? P : "#E5E7EB", margin: "0 4px", marginBottom: 20 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function YPSiparisDetayPage() {
  const [, params] = useRoute("/hesabim/siparisler/:orderId");
  const [, navigate] = useLocation();
  const { isLoggedIn, isLoading: authLoading, customer } = useCustomer();
  const orderId = params?.orderId ?? "";
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2800); };

  useEffect(() => { document.title = `Sipariş Detayı | YourPoodle`; }, []);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      navigate(`${BASE}/giris?returnTo=${encodeURIComponent(`/hesabim/siparisler/${orderId}`)}`);
    }
  }, [authLoading, isLoggedIn, navigate, orderId]);

  const { data: apiOrders, isLoading: ordersLoading } = useQuery<any[]>({
    queryKey: ["/api/customer/orders"],
    enabled: !!isLoggedIn,
    staleTime: 30_000,
  });

  const order = useMemo(() => {
    if (!apiOrders || !orderId) return null;
    return apiOrders.find((o: any) => String(o.id) === String(orderId)) ?? null;
  }, [apiOrders, orderId]);

  const Section = ({ icon: Icon, title, children }: any) => (
    <div style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", marginBottom: 12, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <Icon size={16} color={P} />
        <span style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{title}</span>
      </div>
      {children}
    </div>
  );

  if (authLoading || !isLoggedIn || ordersLoading) {
    return (
      <YPLayout constrain={false}>
        <div style={{ padding: 48, textAlign: "center", color: "#6B7280", fontSize: 14 }}>Yükleniyor...</div>
      </YPLayout>
    );
  }

  if (!order) {
    return (
      <YPLayout constrain={false}>
        <div style={{ minHeight: "100vh", background: "#F9F9FB", paddingBottom: 64 }}>
          <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 0 8px" }}>
              <button onClick={() => goBack(navigate, `${BASE}/hesabim/siparisler`)}
                style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px solid #E5E7EB", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <ArrowLeft size={16} color="#374151" />
              </button>
              <h1 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: 0 }}>Sipariş Detayı</h1>
            </div>
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <Package size={40} color="#D1D5DB" style={{ margin: "0 auto 12px" }} />
              <p style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 6 }}>Sipariş bulunamadı</p>
              <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 18 }}>Bu siparişe erişiminiz yok veya sipariş silinmiş olabilir.</p>
              <button onClick={() => navigate(`${BASE}/hesabim/siparisler`)}
                style={{ background: P, color: "#fff", border: "none", borderRadius: 12, padding: "11px 22px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                Siparişlerime Dön
              </button>
            </div>
          </div>
        </div>
      </YPLayout>
    );
  }

  const items: any[] = Array.isArray(order.items) ? order.items : [];
  const statusStep = STATUS_STEP[String(order.status || "").toLowerCase()] || 1;
  const dateDisplay = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })
    : "";
  const paymentLabel = PAYMENT_METHOD_LABEL[order.paymentMethod] || order.paymentMethod || "—";
  const cityLine = [order.district, order.city].filter(Boolean).join(", ") || "";
  const trackingNo = order.trackingNumber || "—";

  return (
    <YPLayout constrain={false}>
      <div style={{ minHeight: "100vh", background: "#F9F9FB", paddingBottom: 64 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 0 8px" }}>
            <button onClick={() => goBack(navigate, `${BASE}/hesabim/siparisler`)}
              style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px solid #E5E7EB", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <ArrowLeft size={16} color="#374151" />
            </button>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: 0 }}>Sipariş Detayı</h1>
              <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>#{order.id} · {dateDisplay}</p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 340px", minWidth: 280 }}>
              <div style={{ background: "#fff", borderRadius: 14, padding: "20px 16px 8px", marginBottom: 12, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
                <Stepper step={statusStep} />
              </div>

              <Section icon={Package} title="Ürünler">
                {items.length === 0 ? (
                  <p style={{ margin: 0, fontSize: 13, color: "#6B7280" }}>Ürün bilgisi bulunamadı</p>
                ) : items.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: i < items.length - 1 ? "1px solid #F3F4F6" : undefined }}>
                    <div style={{ width: 52, height: 52, borderRadius: 10, background: "#FAF7F0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                      {item.img ? (
                        <img src={item.img} alt={item.name || ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.currentTarget as any).style.display = "none"; }} />
                      ) : (
                        <Package size={18} color={P} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111827" }}>{item.name || "Ürün"}</p>
                      <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>× {item.quantity || item.qty || 1}</p>
                    </div>
                    <span style={{ fontWeight: 700, color: P }}>
                      {(Number(item.price || 0) * Number(item.quantity || item.qty || 1)).toLocaleString("tr-TR")}₺
                    </span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12 }}>
                  <span style={{ fontWeight: 700, color: "#374151" }}>Toplam</span>
                  <span style={{ fontWeight: 800, color: P, fontSize: 16 }}>{Number(order.grandTotal || 0).toLocaleString("tr-TR")}₺</span>
                </div>
              </Section>
            </div>

            <div style={{ flex: "1 1 260px", minWidth: 260 }}>
              <Section icon={MapPin} title="Teslimat Adresi">
                <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
                  {customer?.name || "—"}<br />
                  {customer?.phone || "—"}<br />
                  {order.customerAddress || "Adres bilgisi yok"}
                  {cityLine ? <><br />{cityLine}</> : null}
                </p>
              </Section>

              <Section icon={CreditCard} title="Ödeme">
                <p style={{ margin: 0, fontSize: 13, color: "#374151" }}>{paymentLabel}</p>
                <p style={{ margin: "4px 0 0", fontSize: 15, fontWeight: 800, color: "#111827" }}>
                  {Number(order.grandTotal || 0).toLocaleString("tr-TR")}₺
                </p>
              </Section>

              <Section icon={Truck} title="Kargo">
                <p style={{ margin: "0 0 10px", fontSize: 13, color: "#374151" }}>
                  {order.cargoCompany ? `${order.cargoCompany} · ` : ""}
                  Takip No: <strong>{trackingNo}</strong>
                </p>
                <button onClick={() => {
                  if (order.trackingUrl) {
                    window.open(order.trackingUrl, "_blank", "noopener,noreferrer");
                  } else if (order.trackingNumber) {
                    navigate(`/siparis-takip?orderId=${order.id}`);
                  } else {
                    showToast("Kargo bilgisi henüz eklenmedi");
                  }
                }}
                  style={{ padding: "8px 16px", borderRadius: 8, border: "1.5px solid " + P, background: "#F5F0E6", color: P, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  Kargoyu Takip Et
                </button>
              </Section>

              <Section icon={FileText} title="Fatura">
                <button onClick={() => window.open(`/api/customer/orders/${order.id}/invoice`, "_blank")}
                  style={{ padding: "8px 16px", borderRadius: 8, border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  Fatura İndir
                </button>
              </Section>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button onClick={() => navigate(`${BASE}/hesabim/yardim`)}
              style={{ flex: 1, height: 48, borderRadius: 12, border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <HelpCircle size={16} /> Yardım Al
            </button>
            <button onClick={() => navigate(`${BASE}/sepet`)}
              style={{ flex: 1, height: 48, borderRadius: 12, border: "none", background: P, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <RotateCcw size={16} /> Siparişi Tekrarla
            </button>
          </div>
        </div>
      </div>
      {toast && (
        <div style={{ position:"fixed", bottom:90, left:"50%", transform:"translateX(-50%)", zIndex:999,
                      background:"#111827", color:"#fff", padding:"10px 20px", borderRadius:12,
                      fontSize:13, fontWeight:500, whiteSpace:"nowrap", boxShadow:"0 4px 12px rgba(0,0,0,0.25)" }}>
          {toast}
        </div>
      )}
    </YPLayout>
  );
}
