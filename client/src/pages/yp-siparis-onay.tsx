import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { CheckCircle, Copy, Package, MapPin, ArrowRight } from "lucide-react";
import { getOrder, STEP_LABELS } from "@/data/orders";
import { IS_YP } from "@/lib/store";

const P = "#7022C4", G = "#10B981";
const BASE = IS_YP ? "" : "/yourpoodle";

export default function YPSiparisOnayPage() {
  const [match, params] = useRoute("/siparis/onay/:orderId");
  const [, navigate] = useLocation();
  const orderId = params?.orderId ?? "YP-2026-0847";
  const order = getOrder(orderId) ?? getOrder("YP-2026-0847")!;
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => { document.title = "Sipariş Onayı | YourPoodle"; }, []);

  function copy() {
    navigator.clipboard?.writeText(order.trackingNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <YPLayout constrain={false}>
      <div style={{ minHeight: "100vh", background: "#F9F5FF", paddingBottom: 48 }}>
        {/* Subtle confetti strip */}
        <div style={{ height: 6, background: `linear-gradient(90deg,${P},#A855F7,#EC4899,${G})` }} />

        <div style={{ maxWidth: 560, margin: "0 auto", padding: "32px 20px" }}>
          {/* Success badge */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: P, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <CheckCircle size={44} color="#fff" />
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: "#111827", margin: "0 0 8px" }}>Siparişiniz Alındı!</h1>
            <p style={{ color: "#6B7280", fontSize: 15, margin: 0 }}>Teşekkür ederiz. Siparişiniz hazırlanıyor.</p>
          </div>

          {/* Order number */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, marginBottom: 16, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <Package size={20} color={P} />
              <span style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>Sipariş No: #{order.displayId}</span>
            </div>

            {/* Items */}
            {order.items.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F3F4F6" }}>
                <span style={{ color: "#374151", fontSize: 14 }}>{item.name} × {item.qty}</span>
                <span style={{ color: "#111827", fontWeight: 600, fontSize: 14 }}>{(item.price * item.qty).toLocaleString("tr-TR")}₺</span>
              </div>
            ))}

            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12 }}>
              <span style={{ fontWeight: 700, color: "#374151" }}>Toplam</span>
              <span style={{ fontWeight: 800, fontSize: 18, color: P }}>{order.total.toLocaleString("tr-TR")}₺</span>
            </div>

            {/* Address */}
            <div style={{ marginTop: 16, padding: "12px 14px", background: "#F9F5FF", borderRadius: 10 }}>
              <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                <MapPin size={14} color={P} style={{ marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>
                  {order.address.name} · {order.address.line1}, {order.address.city}
                </span>
              </div>
            </div>

            <p style={{ margin: "14px 0 0", fontSize: 13, color: "#6B7280" }}>🕒 Tahmini teslimat: <strong>2-4 iş günü</strong></p>
          </div>

          {/* PoodlePuan badge */}
          <div style={{ background: "linear-gradient(135deg,#7022C4,#A855F7)", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <span style={{ fontSize: 32 }}>🐾</span>
            <div>
              <p style={{ margin: 0, color: "#fff", fontWeight: 800, fontSize: 16 }}>+{order.poodlePuan} PoodlePuan kazandınız!</p>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: 12 }}>Bir sonraki alışverişte kullanabilirsiniz</p>
            </div>
          </div>

          {/* Tracking */}
          <div style={{ background: "#fff", borderRadius: 14, padding: "16px 20px", marginBottom: 24, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
            <p style={{ margin: "0 0 8px", fontSize: 13, color: "#6B7280" }}>Sipariş Takip No:</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 700, color: "#111827", letterSpacing: 1 }}>{order.trackingNo}</span>
              <button onClick={copy}
                style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 8, border: "1.5px solid #E5E7EB", background: copied ? "#F0FDF4" : "#fff", color: copied ? G : "#6B7280", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                <Copy size={12} /> {copied ? "Kopyalandı" : "Kopyala"}
              </button>
            </div>
          </div>

          {/* CTA buttons */}
          <button onClick={() => navigate(`${BASE}/hesabim/siparisler/${order.id}`)}
            style={{ width: "100%", height: 52, borderRadius: 14, border: "none", background: P, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            Siparişimi Görüntüle <ArrowRight size={18} />
          </button>
          <button onClick={() => navigate(`${BASE}/magaza`)}
            style={{ width: "100%", height: 52, borderRadius: 14, border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            Alışverişe Devam Et
          </button>
        </div>
      </div>
    </YPLayout>
  );
}
