import YPStaticPage from "@/components/yourpoodle/YPStaticPage";

export default function YPIade() {
  return (
    <YPStaticPage
      title="İade ve Değişim"
      description="YourPoodle iade ve değişim politikası: 14 gün iade hakkı, adımlar, istisnalar ve iade formu."
      updatedDate="16 Temmuz 2026"
      breadcrumb={[{ label:"Ana Sayfa", href:"/yourpoodle" }, { label:"Destek", href:"/yourpoodle/sss" }, { label:"İade ve Değişim" }]}
    >
      <div className="sp-alert">
        <strong>14 Gün İade Hakkı:</strong> Ürünü teslim aldığınız tarihten itibaren 14 gün içinde herhangi bir gerekçe göstermeksizin iade edebilirsiniz.
      </div>

      <div className="sp-section">
        <h2>İade Adımları</h2>
        <ol>
          <li><strong>Talep oluşturun:</strong> <a href="mailto:info@sizpa.com" style={{ color:"#5D3A1A" }}>info@sizpa.com</a> adresine sipariş numaranızı ve iade gerekçenizi yazın.</li>
          <li><strong>Kargo kodunu alın:</strong> 24 saat içinde size ücretsiz iade kargo kodu gönderilir.</li>
          <li><strong>Ürünü paketleyin:</strong> Orijinal ambalajında, tüm aksesuarlarıyla birlikte paketleyin.</li>
          <li><strong>Kargoya verin:</strong> Kargo koduyla herhangi bir Yurtiçi Kargo şubesine teslim edin.</li>
          <li><strong>Geri ödeme:</strong> Ürün bize ulaştıktan 3–5 iş günü içinde ödeme yönteminize iade yapılır.</li>
        </ol>
      </div>

      <div className="sp-section">
        <h2>İade Edilemeyen Ürünler</h2>
        <ul>
          <li>Açılmış veya kullanılmış mama paketleri (hijyen nedeniyle)</li>
          <li>Kullanılmış bakım ürünleri (şampuan, krem vb.)</li>
          <li>Kişiye özel tasarlanmış veya kişiselleştirilmiş ürünler</li>
          <li>İndirim/kampanya fiyatıyla satılan "Son Fiyat" ürünler (açıkça belirtilmişse)</li>
          <li>14 günlük süre geçtikten sonra yapılan iade talepleri</li>
        </ul>
      </div>

      <div className="sp-section">
        <h2>Değişim</h2>
        <p>Farklı bir ürünle değişim yapmak istiyorsanız mevcut ürünü iade edip yeni siparişi ayrıca oluşturmanızı öneririz. Değişim talebi için de aynı iletişim kanalını kullanabilirsiniz.</p>
      </div>

      <div className="sp-section">
        <h2>Hasarlı / Hatalı Ürün</h2>
        <p>Hasarlı veya yanlış ürün geldiyse iade kargo ücreti tamamen tarafımıza aittir. Fotoğraflı bildirim için <a href="mailto:info@sizpa.com" style={{ color:"#5D3A1A" }}>info@sizpa.com</a> adresine yazın; aynı gün çözüm üretilir.</p>
      </div>

      <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
        <a href="mailto:info@sizpa.com" className="sp-cta-btn">İade Talebi Oluştur</a>
        <a href="/yourpoodle/mesafeli-satis" className="sp-cta-btn" style={{ background:"#F5F0E6", color:"#5D3A1A" }}>Mesafeli Satış Sözleşmesi →</a>
      </div>
    </YPStaticPage>
  );
}
