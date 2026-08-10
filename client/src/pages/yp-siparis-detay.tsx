import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { ArrowLeft, Package, MapPin, CreditCard, Truck, FileText, RotateCcw, HelpCircle } from "lucide-react";
import { getOrder, STEP_LABELS } from "@/data/orders";
import { IS_YP } from "@/lib/store";

const P = "#5D3A1A";
const BASE = IS_YP ? "" : "/yourpoodle";

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
  const orderId = params?.orderId ?? "YP-2026-0847";
  const order = getOrder(orderId) ?? getOrder("YP-2026-0847")!;
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2800); };

  useEffect(() => { document.title = `Sipariş Detayı | YourPoodle`; }, []);

  const Section = ({ icon: Icon, title, children }: any) => (
    <div style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", marginBottom: 12, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <Icon size={16} color={P} />
        <span style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{title}</span>
      </div>
      {children}
    </div>
  );

  return (
    <YPLayout constrain={false}>
      <div style={{ minHeight: "100vh", background: "#F9F9FB", paddingBottom: 64 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 0 8px" }}>
            <button onClick={() => navigate(`${BASE}/hesabim/siparisler`)}
              style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px solid #E5E7EB", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <ArrowLeft size={16} color="#374151" />
            </button>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: 0 }}>Sipariş Detayı</h1>
              <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>#{order.displayId} · {order.dateDisplay}</p>
            </div>
          </div>

          {/* Desktop 2-col */}
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
            {/* Left */}
            <div style={{ flex: "1 1 340px", minWidth: 280 }}>
              {/* Stepper */}
              <div style={{ background: "#fff", borderRadius: 14, padding: "20px 16px 8px", marginBottom: 12, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
                <Stepper step={order.statusStep} />
              </div>

              {/* Items */}
              <Section icon={Package} title="Ürünler">
                {order.items.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: i < order.items.length - 1 ? "1px solid #F3F4F6" : undefined }}>
                    <div style={{ width: 52, height: 52, borderRadius: 10, background: "#FAF7F0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                      <img src={item.img} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.currentTarget as any).style.display = "none"; }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111827" }}>{item.name}</p>
                      <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>× {item.qty}</p>
                    </div>
                    <span style={{ fontWeight: 700, color: P }}>{(item.price * item.qty).toLocaleString("tr-TR")}₺</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12 }}>
                  <span style={{ fontWeight: 700, color: "#374151" }}>Toplam</span>
                  <span style={{ fontWeight: 800, color: P, fontSize: 16 }}>{order.total.toLocaleString("tr-TR")}₺</span>
                </div>
              </Section>
            </div>

            {/* Right */}
            <div style={{ flex: "1 1 260px", minWidth: 260 }}>
              <Section icon={MapPin} title="Teslimat Adresi">
                <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
                  {order.address.name}<br />{order.address.phone}<br />
                  {order.address.line1}<br />{order.address.city}
                </p>
              </Section>

              <Section icon={CreditCard} title="Ödeme">
                <p style={{ margin: 0, fontSize: 13, color: "#374151" }}>{order.payment}</p>
                <p style={{ margin: "4px 0 0", fontSize: 15, fontWeight: 800, color: "#111827" }}>{order.total.toLocaleString("tr-TR")}₺</p>
              </Section>

              <Section icon={Truck} title="Kargo">
                <p style={{ margin: "0 0 10px", fontSize: 13, color: "#374151" }}>Takip No: <strong>{order.trackingNo}</strong></p>
                <button onClick={() => order.trackingNo && order.trackingNo !== "—" ? navigate(`/siparis-takip?orderId=${orderId}`) : showToast("Kargo bilgisi henüz eklenmedi")}
                  style={{ padding: "8px 16px", borderRadius: 8, border: "1.5px solid " + P, background: "#F5F0E6", color: P, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  Kargoyu Takip Et
                </button>
              </Section>

              <Section icon={FileText} title="Fatura">
                <button onClick={() => showToast("Fatura indirme özelliği yakında aktif olacak.")}
                  style={{ padding: "8px 16px", borderRadius: 8, border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  Fatura İndir
                </button>
              </Section>
            </div>
          </div>

          {/* Bottom actions */}
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
