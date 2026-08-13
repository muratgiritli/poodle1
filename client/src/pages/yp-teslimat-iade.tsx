import YPStaticPage from "@/components/yourpoodle/YPStaticPage";
import { IS_YP } from "@/lib/store";
import { YP_COMPANY } from "@/lib/yp-company";

const BASE = IS_YP ? "" : "/yourpoodle";

export default function YPTeslimatIadePage() {
  return (
    <YPStaticPage
      title="Teslimat ve İade Şartları"
      description="YourPoodle teslimat süreleri, kargo koşulları ve 14 gün iade politikası."
      updatedDate="13 Ağustos 2026"
      breadcrumb={[{ label: "Ana Sayfa", href: BASE || "/" }, { label: "Teslimat ve İade Şartları" }]}
    >
      <div className="sp-alert">
        <strong>Satıcı:</strong> {YP_COMPANY.legalName} · {YP_COMPANY.fullAddress} ·{" "}
        <a href={`mailto:${YP_COMPANY.email}`} style={{ color: "#5D3A1A", fontWeight: 700 }}>{YP_COMPANY.email}</a>
        {" · "}{YP_COMPANY.phoneDisplay}
      </div>
      <div className="sp-section">
        <h2>Teslimat</h2>
        <ul>
          <li>Siparişler stok durumuna göre genellikle 1–5 iş günü içinde kargoya verilir.</li>
          <li>Türkiye geneline kargo ile gönderim yapılır ({YP_COMPANY.brand}).</li>
          <li>Belirlenen tutarın üzerindeki siparişlerde kargo ücretsiz olabilir (kampanya koşullarına bakınız).</li>
          <li>Teslimat adresi ve telefonun doğru girilmesi alıcının sorumluluğundadır.</li>
        </ul>
        <p style={{ marginTop: 10 }}>
          Detaylı kargo bilgisi: <a href={`${BASE}/kargo`} style={{ color: "#5D3A1A", fontWeight: 700 }}>Kargo ve Teslimat</a>
        </p>
      </div>
      <div className="sp-section">
        <h2>İade (14 Gün)</h2>
        <p>
          Ürünü teslim aldığınız tarihten itibaren <strong>14 gün</strong> içinde cayma / iade hakkınızı kullanabilirsiniz.
        </p>
        <ol>
          <li>{YP_COMPANY.email} adresine sipariş no ve talebinizi yazın.</li>
          <li>Ücretsiz iade kargo kodu iletilir.</li>
          <li>Ürünü orijinal ambalajında kargoya verin.</li>
          <li>Ürün bize ulaştıktan sonra 3–5 iş günü içinde iade ödeme yönteminize yapılır.</li>
        </ol>
      </div>
      <div className="sp-section">
        <h2>İade edilemeyenler</h2>
        <ul>
          <li>Açılmış mama ve hijyen ürünleri</li>
          <li>Kişiye özel üretilmiş ürünler</li>
          <li>14 günü geçen talepler</li>
        </ul>
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a href={`${BASE}/iade`} className="sp-cta-btn">İade Detayı →</a>
        <a href={`${BASE}/mesafeli-satis`} className="sp-cta-btn" style={{ background: "#F5F0E6", color: "#5D3A1A" }}>Mesafeli Satış →</a>
      </div>
    </YPStaticPage>
  );
}
