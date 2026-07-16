import YPStaticPage from "@/components/yourpoodle/YPStaticPage";

export default function YPKargo() {
  return (
    <YPStaticPage
      title="Kargo ve Teslimat"
      description="YourPoodle kargo ve teslimat bilgileri: teslimat süreleri, kargo firmaları, takip ve ücretlendirme tablosu."
      updatedDate="16 Temmuz 2026"
      breadcrumb={[{ label:"Ana Sayfa", href:"/yourpoodle" }, { label:"Destek", href:"/yourpoodle/sss" }, { label:"Kargo ve Teslimat" }]}
    >
      <div className="sp-alert">
        Aynı gün kargoya verme için siparişinizi <strong>saat 14:00'e kadar</strong> tamamlamanız gerekmektedir (hafta içi).
      </div>

      <div className="sp-section">
        <h2>Teslimat Süreleri</h2>
        <table className="sp-table">
          <thead>
            <tr><th>Bölge</th><th>Süre</th><th>Kargo Firması</th></tr>
          </thead>
          <tbody>
            <tr><td>İstanbul</td><td>1 iş günü</td><td>Yurtiçi / MNG</td></tr>
            <tr><td>Ankara, İzmir</td><td>1–2 iş günü</td><td>Yurtiçi / MNG</td></tr>
            <tr><td>Diğer iller</td><td>2–3 iş günü</td><td>Yurtiçi / MNG</td></tr>
            <tr><td>Uzak bölgeler</td><td>3–4 iş günü</td><td>Yurtiçi Kargo</td></tr>
          </tbody>
        </table>
        <p style={{ marginTop:10, fontSize:13, color:"#888" }}>* Resmi tatiller ve yoğun dönemlerde (Kurban Bayramı, yılbaşı) ek 1–2 gün eklenebilir.</p>
      </div>

      <div className="sp-section">
        <h2>Kargo Ücretlendirmesi</h2>
        <table className="sp-table">
          <thead>
            <tr><th>Sipariş Tutarı</th><th>Kargo Ücreti</th></tr>
          </thead>
          <tbody>
            <tr><td>299 TL ve üzeri</td><td><strong style={{ color:"#16A34A" }}>Ücretsiz</strong></td></tr>
            <tr><td>0 – 299 TL</td><td>49 TL (sabit)</td></tr>
          </tbody>
        </table>
      </div>

      <div className="sp-section">
        <h2>Sipariş Takibi</h2>
        <p>Siparişiniz kargoya verildikten sonra tarafınıza SMS ve e-posta ile takip numarası gönderilir. Takip numarasını kargo firmasının web sitesinde sorgulayabilirsiniz.</p>
        <ul>
          <li><a href="https://www.yurticikargo.com/tr/online-islemler/gonderi-sorgula" target="_blank" rel="noopener noreferrer" style={{ color:"#7C3AED" }}>Yurtiçi Kargo Sorgula →</a></li>
          <li><a href="https://www.mngkargo.com.tr/gonderi-sorgula" target="_blank" rel="noopener noreferrer" style={{ color:"#7C3AED" }}>MNG Kargo Sorgula →</a></li>
        </ul>
      </div>

      <div className="sp-section">
        <h2>Paketleme</h2>
        <p>Tüm ürünler, taşıma hasarlarına karşı koruyucu ambalaj malzemeleriyle paketlenir. Mama ürünleri nemden korunmak için özel naylon iç poşetle gönderilir.</p>
      </div>

      <div className="sp-section">
        <h2>Teslimat Sorunları</h2>
        <p>Paketiniz hasarlı ya da eksik teslim edildiyse kargo teslim tutanağına not düşün ve <a href="mailto:info@yourpoodle.com" style={{ color:"#7C3AED" }}>info@yourpoodle.com</a> adresine fotoğrafla birlikte bildirin. 24 saat içinde dönüş yapılır.</p>
      </div>

      <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
        <a href="/yourpoodle/uluslararasi-kargo" className="sp-cta-btn" style={{ background:"#F5F0FF", color:"#7C3AED" }}>Uluslararası Kargo →</a>
        <a href="/yourpoodle/iade" className="sp-cta-btn" style={{ background:"#F5F0FF", color:"#7C3AED" }}>İade & Değişim →</a>
      </div>
    </YPStaticPage>
  );
}
