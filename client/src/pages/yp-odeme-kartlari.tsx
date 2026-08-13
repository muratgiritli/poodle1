import YPStaticPage from "@/components/yourpoodle/YPStaticPage";
import { IS_YP } from "@/lib/store";

const BASE = IS_YP ? "" : "/yourpoodle";

const CARDS = [
  { name: "Visa", desc: "Visa kredi ve banka kartları kabul edilir.", src: "/images/payment/visa.svg" },
  { name: "Mastercard", desc: "Mastercard kredi ve banka kartları kabul edilir.", src: "/images/payment/mastercard.svg" },
  { name: "Troy", desc: "Yerli Troy kartlar ile güvenli ödeme yapılabilir.", src: "/images/payment/troy.svg" },
];

export default function YPOdemeKartlariPage() {
  return (
    <YPStaticPage
      title="Visa ve Mastercard Logoları"
      description="YourPoodle'da Visa, Mastercard ve Troy ile 3D Secure korumalı ödeme."
      updatedDate="13 Ağustos 2026"
      breadcrumb={[{ label: "Ana Sayfa", href: BASE || "/" }, { label: "Visa ve Mastercard" }]}
    >
      <div className="sp-alert">
        <strong>Güvenli kart ödemesi:</strong> Tüm işlemler 3D Secure ve SSL ile korunur. Kart bilgileriniz YourPoodle sunucularında saklanmaz; ödeme iyzico üzerinden alınır.
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20, padding: "16px 20px", background: "#000", borderRadius: 12 }}>
        <img
          src="/images/payment/iyzico-cards-band.png"
          alt="iyzico ile Öde — Mastercard, Visa, American Express, Troy"
          style={{ height: 48, width: "auto", maxWidth: "100%" }}
        />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginBottom: 28 }}>
        {CARDS.map((c) => (
          <div key={c.name} style={{ border: "1px solid #E5DDD0", borderRadius: 14, padding: 18, background: "#fff" }}>
            <img
              src={c.src}
              alt={c.name}
              style={{ height: 40, width: "auto", display: "block", marginBottom: 12, borderRadius: 8 }}
            />
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
