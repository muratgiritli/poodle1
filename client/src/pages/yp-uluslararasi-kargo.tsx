import YPStaticPage from "@/components/yourpoodle/YPStaticPage";

export default function YPUluslararasiKargo() {
  return (
    <YPStaticPage
      title="Uluslararası Kargo"
      description="YourPoodle uluslararası kargo bilgileri: gönderim yapılan ülkeler, teslimat süreleri, gümrük ve minimum sipariş tutarı."
      updatedDate="16 Temmuz 2026"
      breadcrumb={[{ label:"Ana Sayfa", href:"/yourpoodle" }, { label:"Kargo", href:"/yourpoodle/kargo" }, { label:"Uluslararası Kargo" }]}
    >
      <div className="sp-alert">
        Uluslararası gönderiler için teslimat süresi ve gümrük vergileri ülkeden ülkeye farklılık gösterebilir. Sipariş vermeden önce aşağıdaki bilgileri dikkatlice okuyunuz.
      </div>

      <div className="sp-section">
        <h2>Gönderim Yapılan Ülkeler ve Süreler</h2>
        <table className="sp-table">
          <thead>
            <tr><th>Bölge</th><th>Ülkeler</th><th>Tahmini Süre</th></tr>
          </thead>
          <tbody>
            <tr><td>Avrupa</td><td>Almanya, Fransa, Hollanda, İsveç, İsviçre, Avusturya ve diğerleri</td><td>5–10 iş günü</td></tr>
            <tr><td>Kuzey Amerika</td><td>ABD, Kanada</td><td>7–14 iş günü</td></tr>
            <tr><td>Körfez / Orta Doğu</td><td>BAE, Suudi Arabistan, Katar, Kuveyt</td><td>4–8 iş günü</td></tr>
            <tr><td>Avustralya / Asya</td><td>Avustralya, Japonya, Singapur</td><td>8–15 iş günü</td></tr>
          </tbody>
        </table>
        <p style={{ marginTop:10, fontSize:13, color:"#888" }}>Listede olmayan ülkeler için info@sizpa.com adresinden bilgi alabilirsiniz.</p>
      </div>

      <div className="sp-section">
        <h2>Uluslararası Kargo Ücretleri</h2>
        <p>Uluslararası kargo ücreti, sipariş ağırlığına ve hedef ülkeye göre checkout sırasında otomatik hesaplanır. Minimum 500 TL sipariş tutarı geçerlidir.</p>
      </div>

      <div className="sp-section">
        <h2>Gümrük ve Vergi</h2>
        <p>Hedef ülkenin gümrük mevzuatına göre ek vergi veya gümrük vergisi uygulanabilir. Bu ücretler alıcıya aittir ve YourPoodle tarafından karşılanmaz. Ülkenizin gümrük kuralları hakkında bilgi almak için yerel gümrük idaresine başvurunuz.</p>
      </div>

      <div className="sp-section">
        <h2>Yasak ve Kısıtlı Ürünler</h2>
        <p>Bazı ülkelerde belirli mama içerikleri veya ürün türleri gümrük tarafından alıkonulabilir. Özellikle et bazlı mamalarda gümrük kısıtlaması yaşanabilir. Sipariş öncesi ülkenizin ithalat kurallarını kontrol edin.</p>
      </div>

      <div className="sp-section">
        <h2>İletişim</h2>
        <p>Uluslararası sipariş için yardım almak üzere <a href="mailto:info@sizpa.com" style={{ color:"#5D3A1A" }}>info@sizpa.com</a> adresine yazabilirsiniz. Yanıt süresi 24–48 saattir.</p>
      </div>

      <a href="/yourpoodle/kargo" className="sp-cta-btn" style={{ background:"#F5F0E6", color:"#5D3A1A" }}>← Yurt İçi Kargo</a>
    </YPStaticPage>
  );
}
