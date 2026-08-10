import { CreditCard } from "lucide-react";
import YPStaticPage from "@/components/yourpoodle/YPStaticPage";
import { IS_YP } from "@/lib/store";

const BASE = IS_YP ? "" : "/yourpoodle";

const CARDS = [
  { name: "Visa", desc: "Visa kredi ve banka kartları kabul edilir." },
  { name: "Mastercard", desc: "Mastercard kredi ve banka kartları kabul edilir." },
  { name: "Troy", desc: "Yerli Troy kartlar ile güvenli ödeme yapılabilir." },
];

export default function YPOdemeKartlariPage() {
  return (
    <YPStaticPage
      title="Visa ve Mastercard"
      description="YourPoodle'da Visa, Mastercard ve Troy ile 3D Secure korumalı ödeme."
      updatedDate="10 Ağustos 2026"
      breadcrumb={[{ label: "Ana Sayfa", href: BASE || "/" }, { label: "Kart Logoları" }]}
    >
      <div className="sp-alert">
        <strong>Güvenli kart ödemesi:</strong> Tüm işlemler 3D Secure ve SSL ile korunur. Kart bilgileriniz YourPoodle sunucularında saklanmaz.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginBottom: 28 }}>
        {CARDS.map((c) => (
          <div key={c.name} style={{ border: "1px solid #E5DDD0", borderRadius: 14, padding: 18, background: "#fff" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <CreditCard size={18} color="#5D3A1A" />
              <span style={{ fontWeight: 800, fontSize: 15 }}>{c.name}</span>
            </div>
            <p style={{ fontSize: 13, color: "#6B7280", margin: 0, lineHeight: 1.5 }}>{c.desc}</p>
          </div>
        ))}
      </div>
      <div className="sp-section">
        <h2>Ödeme Süreci</h2>
        <ol>
          <li>Sepetinizi onaylayıp ödeme adımına geçin.</li>
          <li>Kart bilgilerinizi iyzico güvenli formuna girin.</li>
          <li>Banka 3D Secure SMS/onay adımını tamamlayın.</li>
          <li>Sipariş onay ekranı ile işleminiz tamamlanır.</li>
        </ol>
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a href={`${BASE}/iyzico`} className="sp-cta-btn">iyzico ile Öde</a>
        <a href={`${BASE}/ssl`} className="sp-cta-btn" style={{ background: "#F5F0E6", color: "#5D3A1A" }}>SSL Sertifikası →</a>
      </div>
    </YPStaticPage>
  );
}
