import YPStaticPage from "@/components/yourpoodle/YPStaticPage";

export default function YPCerezPolitikasi() {
  return (
    <YPStaticPage
      title="Çerez Politikası"
      description="YourPoodle çerez politikası: kullanılan çerez türleri, amaçları, saklama süreleri ve devre dışı bırakma yöntemleri."
      updatedDate="16 Temmuz 2026"
      breadcrumb={[{ label:"Ana Sayfa", href:"/yourpoodle" }, { label:"Gizlilik", href:"/yourpoodle/gizlilik-politikasi" }, { label:"Çerez Politikası" }]}
    >
      <p style={{ fontSize:14, color:"#555", lineHeight:1.75, marginBottom:28 }}>
        YourPoodle olarak kullanıcı deneyimini iyileştirmek, site performansını ölçmek ve kişiselleştirilmiş içerik sunmak amacıyla çerezler (cookies) kullanmaktayız. Bu sayfa hangi çerezleri neden kullandığımızı açıklar.
      </p>

      <div className="sp-section">
        <h2>Çerez Nedir?</h2>
        <p>Çerez, web sitesi ziyaretinizde tarayıcınıza yerleştirilen küçük metin dosyalarıdır. Siteyi bir sonraki ziyaretinizde çerezler sayesinde tercihleriniz hatırlanır ve daha kişiselleştirilmiş bir deneyim sunulur.</p>
      </div>

      <div className="sp-section">
        <h2>Kullandığımız Çerez Türleri</h2>
        <table className="sp-table">
          <thead>
            <tr><th>Çerez Türü</th><th>Amaç</th><th>Süre</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>Zorunlu</strong></td><td>Giriş oturumu, sepet, güvenlik token'ı</td><td>Oturum / 30 gün</td></tr>
            <tr><td><strong>Tercih</strong></td><td>Dil, tema, cookie onayı tercihleriniz</td><td>1 yıl</td></tr>
            <tr><td><strong>Analitik</strong></td><td>Google Analytics — ziyaretçi sayısı, sayfa görüntüleme</td><td>2 yıl</td></tr>
            <tr><td><strong>Pazarlama</strong></td><td>Google Ads — ilgili ürün reklamları (yalnızca onayınızla)</td><td>90 gün</td></tr>
          </tbody>
        </table>
      </div>

      <div className="sp-section">
        <h2>Üçüncü Taraf Çerezler</h2>
        <ul>
          <li><strong>Google Analytics:</strong> Anonim site kullanım istatistikleri. Google'ın gizlilik politikası geçerlidir.</li>
          <li><strong>Google Ads / GTM:</strong> Reklam dönüşüm takibi. Yalnızca onayınızla etkinleştirilir.</li>
          <li><strong>İyzico:</strong> Ödeme işlemi sırasında kullanılan güvenlik çerezleri.</li>
        </ul>
      </div>

      <div className="sp-section">
        <h2>Çerezleri Devre Dışı Bırakma</h2>
        <p>Sitemizin sağ alt köşesindeki <strong>Çerez Tercihleri</strong> butonundan isteğe bağlı çerezleri istediğiniz zaman açıp kapatabilirsiniz.</p>
        <p>Bunun yanı sıra tarayıcı ayarlarınızdan tüm çerezleri engelleyebilirsiniz; ancak bu durumda siteyi giriş yaparak kullanmanız mümkün olmayabilir.</p>
        <ul>
          <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" style={{ color:"#5D3A1A" }}>Chrome çerez ayarları →</a></li>
          <li><a href="https://support.mozilla.org/tr/kb/cerezleri-silmek" target="_blank" rel="noopener noreferrer" style={{ color:"#5D3A1A" }}>Firefox çerez ayarları →</a></li>
          <li><a href="https://support.apple.com/tr-tr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" style={{ color:"#5D3A1A" }}>Safari çerez ayarları →</a></li>
        </ul>
      </div>

      <div className="sp-section">
        <h2>İletişim</h2>
        <p>Çerez kullanımıyla ilgili sorularınız için <a href="mailto:info@sizpa.com" style={{ color:"#5D3A1A" }}>info@sizpa.com</a> adresine yazabilirsiniz.</p>
      </div>

      <a href="/yourpoodle/gizlilik-politikasi" className="sp-cta-btn" style={{ background:"#F5F0E6", color:"#5D3A1A" }}>KVKK / Gizlilik Politikası →</a>
    </YPStaticPage>
  );
}
