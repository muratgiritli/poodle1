import YPStaticPage from "@/components/yourpoodle/YPStaticPage";
import { IS_YP } from "@/lib/store";
import { YP_COMPANY } from "@/lib/yp-company";

const BASE = IS_YP ? "" : "/yourpoodle";

export default function YPMesafeliSatis() {
  return (
    <YPStaticPage
      title="Mesafeli Satış Sözleşmesi"
      description="YourPoodle mesafeli satış sözleşmesi: satıcı bilgileri, cayma hakkı, teslimat koşulları ve uyuşmazlık çözümü."
      updatedDate="13 Ağustos 2026"
      breadcrumb={[
        { label: "Ana Sayfa", href: BASE || "/" },
        { label: "Mesafeli Satış Sözleşmesi" },
      ]}
    >
      <div className="sp-section">
        <h2>Madde 1 — Taraflar</h2>
        <p><strong>Satıcı:</strong></p>
        <ul>
          <li>Unvan: {YP_COMPANY.legalName}</li>
          <li>Marka / Site: {YP_COMPANY.brand} ({YP_COMPANY.siteUrl})</li>
          <li>Adres: {YP_COMPANY.fullAddress}</li>
          <li>E-posta: <a href={`mailto:${YP_COMPANY.email}`} style={{ color: "#5D3A1A" }}>{YP_COMPANY.email}</a></li>
          <li>Telefon: {YP_COMPANY.phoneDisplay}</li>
        </ul>
        <p style={{ marginTop: 12 }}>
          <strong>Alıcı:</strong> Sipariş sırasında beyan edilen ad, adres ve iletişim bilgilerine sahip gerçek veya tüzel kişi.
        </p>
      </div>

      <div className="sp-section">
        <h2>Madde 2 — Sözleşme Konusu</h2>
        <p>
          İşbu sözleşme, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği
          çerçevesinde, Satıcının internet sitesi üzerinden Alıcıya satışı yapılan ürünlerin teslimatına ilişkin
          karşılıklı hak ve yükümlülükleri düzenler.
        </p>
      </div>

      <div className="sp-section">
        <h2>Madde 3 — Ürün ve Fiyat Bilgisi</h2>
        <p>
          Satın alınan ürünlerin adı, miktarı, KDV dahil fiyatı ve ödeme bilgileri sipariş özeti ve onay bildiriminde yer alır.
          Fiyatlar Türk Lirası cinsinden belirtilir ve KDV dahildir. Online kart ödemeleri iyzico altyapısı ile alınır.
        </p>
      </div>

      <div className="sp-section">
        <h2>Madde 4 — Teslimat</h2>
        <p>
          Ürünler, sipariş onayından itibaren genellikle 1–5 iş günü içinde Alıcının belirttiği adrese kargoya verilir.
          Teslimat süresi stok durumu ve kargo firmasına göre değişebilir. Ayrıntılar:{" "}
          <a href={`${BASE}/teslimat-iade`} style={{ color: "#5D3A1A", fontWeight: 700 }}>Teslimat ve İade Şartları</a>
          {" · "}
          <a href={`${BASE}/kargo`} style={{ color: "#5D3A1A", fontWeight: 700 }}>Kargo ve Teslimat</a>.
        </p>
      </div>

      <div className="sp-section">
        <h2>Madde 5 — Cayma Hakkı</h2>
        <p>
          Alıcı, ürünü teslim aldığı tarihten itibaren <strong>14 (on dört) gün</strong> içinde herhangi bir gerekçe
          göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir.
        </p>
        <p>
          Cayma bildirimi için <a href={`mailto:${YP_COMPANY.email}`} style={{ color: "#5D3A1A" }}>{YP_COMPANY.email}</a> yeterlidir.
        </p>
        <p><strong>Cayma hakkı kullanılamayan durumlar:</strong></p>
        <ul>
          <li>Ambalajı açılmış, kullanılmış mama veya hijyen ürünleri</li>
          <li>Alıcının talebi doğrultusunda özel olarak hazırlanan ürünler</li>
          <li>Niteliği itibarıyla iade edilmesi uygun olmayan ve çabuk bozulabilecek ürünler</li>
        </ul>
      </div>

      <div className="sp-section">
        <h2>Madde 6 — Gizlilik ve Kişisel Veri</h2>
        <p>
          Sipariş sürecinde toplanan kişisel veriler, 6698 sayılı KVKK kapsamında işlenir. Ayrıntılar:{" "}
          <a href={`${BASE}/gizlilik-politikasi`} style={{ color: "#5D3A1A", fontWeight: 700 }}>Gizlilik Sözleşmesi</a>.
        </p>
      </div>

      <div className="sp-section">
        <h2>Madde 7 — Uyuşmazlık Çözümü</h2>
        <p>
          Sözleşmeden doğan uyuşmazlıklarda Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir.
          Başvuru için Ticaret Bakanlığı’nın yayımladığı parasal sınırlar esas alınır.
        </p>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a href={`${BASE}/iade`} className="sp-cta-btn" style={{ background: "#F5F0E6", color: "#5D3A1A" }}>İade & Değişim →</a>
        <a href={`${BASE}/teslimat-iade`} className="sp-cta-btn" style={{ background: "#F5F0E6", color: "#5D3A1A" }}>Teslimat ve İade →</a>
      </div>
    </YPStaticPage>
  );
}
