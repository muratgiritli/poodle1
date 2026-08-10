import YPStaticPage from "@/components/yourpoodle/YPStaticPage";
import { IS_YP } from "@/lib/store";

const BASE = IS_YP ? "" : "/yourpoodle";

export default function YPIyzicoPage() {
  return (
    <YPStaticPage
      title="iyzico ile Öde"
      description="YourPoodle ödemeleri iyzico altyapısı ile güvenli şekilde alınır."
      updatedDate="10 Ağustos 2026"
      breadcrumb={[{ label: "Ana Sayfa", href: BASE || "/" }, { label: "iyzico ile Öde" }]}
    >
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
        <h2>Ödeme sırasında</h2>
        <p>
          Ödeme adımında iyzico güvenli ödeme formu açılır. Bilgileriniz doğrudan iyzico sistemine iletilir;
          YourPoodle yalnızca sipariş sonucunu (başarılı / başarısız) alır.
        </p>
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a href={`${BASE}/odeme-kartlari`} className="sp-cta-btn" style={{ background: "#F5F0E6", color: "#5D3A1A" }}>Kartlar →</a>
        <a href={`${BASE}/guvenli-alisveris`} className="sp-cta-btn" style={{ background: "#F5F0E6", color: "#5D3A1A" }}>Güvenli Alışveriş →</a>
      </div>
    </YPStaticPage>
  );
}
