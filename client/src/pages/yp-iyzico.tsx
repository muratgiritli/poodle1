import YPStaticPage from "@/components/yourpoodle/YPStaticPage";
import PaymentCardLogos from "@/components/yourpoodle/PaymentCardLogos";
import { IS_YP } from "@/lib/store";

const BASE = IS_YP ? "" : "/yourpoodle";

export default function YPIyzicoPage() {
  return (
    <YPStaticPage
      title="iyzico ile Öde"
      description="YourPoodle ödemeleri iyzico altyapısı ile güvenli şekilde alınır."
      updatedDate="13 Ağustos 2026"
      breadcrumb={[{ label: "Ana Sayfa", href: BASE || "/" }, { label: "iyzico ile Öde" }]}
    >
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20, padding: "18px 22px", background: "#000", borderRadius: 12 }}>
        <img
          src="/images/payment/iyzico-cards-band.png"
          alt="iyzico ile Öde — Mastercard, Visa, American Express, Troy"
          style={{ height: 56, width: "auto", maxWidth: "100%" }}
        />
      </div>
      <div className="sp-alert">
        YourPoodle online kart ödemelerinde <strong>iyzico</strong> altyapısını kullanır. Kart numarası sitemizde tutulmaz.
      </div>
      <div className="sp-section">
        <h2>Neden iyzico?</h2>
        <ul>
          <li>PCI DSS uyumlu ödeme altyapısı</li>
          <li>3D Secure doğrulama</li>
          <li>Visa, Mastercard ve Troy desteği</li>
          <li>Taksit seçenekleri (bankaya göre)</li>
        </ul>
      </div>
      <div className="sp-section">
        <h2>Kabul edilen kartlar</h2>
        <PaymentCardLogos height={36} />
      </div>
      <div className="sp-section">
        <h2>Ödeme sırasında</h2>
        <p>
          Ödeme adımında iyzico güvenli ödeme formu açılır. Bilgileriniz doğrudan iyzico sistemine iletilir;
          YourPoodle yalnızca sipariş sonucunu (başarılı / başarısız) alır.
        </p>
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a href={`${BASE}/odeme-kartlari`} className="sp-cta-btn" style={{ background: "#F5F0E6", color: "#5D3A1A" }}>Kart Logoları →</a>
        <a href={`${BASE}/guvenli-alisveris`} className="sp-cta-btn" style={{ background: "#F5F0E6", color: "#5D3A1A" }}>Güvenli Alışveriş →</a>
      </div>
    </YPStaticPage>
  );
}
