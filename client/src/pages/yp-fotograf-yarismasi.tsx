import YPStaticPage from "@/components/yourpoodle/YPStaticPage";

export default function YPFotografYarismasi() {
  return (
    <YPStaticPage
      title="Fotoğraf Yarışması"
      description="YourPoodle Sonbahar Poodle Fotoğraf Yarışması: katılım kuralları, ödüller ve son başvuru tarihi."
      updatedDate="16 Temmuz 2026"
      breadcrumb={[{ label:"Ana Sayfa", href:"/yourpoodle" }, { label:"Club", href:"/yourpoodle/club" }, { label:"Fotoğraf Yarışması" }]}
    >
      {/* Hero */}
      <div style={{ background:"linear-gradient(135deg,#5D3A1A,#A67C52)", borderRadius:18, padding:"24px 20px", marginBottom:32, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-20, right:-20, width:100, height:100, borderRadius:"50%", background:"rgba(255,255,255,0.08)" }}/>
        <div style={{ fontSize:11, fontWeight:800, color:"rgba(255,255,255,0.65)", letterSpacing:"0.1em", marginBottom:6 }}>AKTİF YARIŞMA</div>
        <h2 style={{ fontSize:20, fontWeight:900, color:"#fff", marginBottom:8, padding:0, border:"none" }}>Sonbahar Poodle Fotoğraf Yarışması 2026</h2>
        <p style={{ fontSize:13, color:"rgba(255,255,255,0.85)", lineHeight:1.6, margin:"0 0 16px" }}>
          Poodle'ınızın en güzel sonbahar anını paylaşın. En çok beğeni alan 3 fotoğraf ödüllendirilecek!
        </p>
        <div style={{ display:"flex", gap:16 }}>
          {[["📅","Son Katılım","30 Ağustos 2026"],["🏆","Ödül","500 TL mağaza kredisi"],["📸","Kategori","Tüm Poodle ırkları"]].map(([icon,label,val])=>(
            <div key={label}>
              <div style={{ fontSize:16 }}>{icon}</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.65)", marginTop:2 }}>{label}</div>
              <div style={{ fontSize:12, fontWeight:700, color:"#fff" }}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="sp-section">
        <h2>Ödüller</h2>
        <ul>
          <li><strong>🥇 1. Ödül:</strong> 500 TL YourPoodle mağaza kredisi + "Yılın Poodle'ı" rozeti</li>
          <li><strong>🥈 2. Ödül:</strong> 250 TL mağaza kredisi</li>
          <li><strong>🥉 3. Ödül:</strong> 100 TL mağaza kredisi</li>
          <li><strong>Özel Ödül:</strong> En yaratıcı fotoğraf — YourPoodle sosyal medyasında öne çıkarılma</li>
        </ul>
      </div>

      <div className="sp-section">
        <h2>Katılım Koşulları</h2>
        <ol>
          <li>YourPoodle Club üyesi olmanız gerekir (ücretsiz kayıt).</li>
          <li>Fotoğraf kendi Poodle'ınıza ait olmalıdır.</li>
          <li>Kişi başı en fazla <strong>3 fotoğraf</strong> gönderilebilir.</li>
          <li>Fotoğraflar daha önce başka bir yarışmada ödül almamış olmalıdır.</li>
          <li>Minimum çözünürlük: 1080 × 1080 px.</li>
          <li>Katılım tarihi: 1 Ağustos — 30 Ağustos 2026.</li>
        </ol>
      </div>

      <div className="sp-section">
        <h2>Nasıl Katılırım?</h2>
        <ol>
          <li>YourPoodle Club'a giriş yapın.</li>
          <li>Ana Sayfa sekmesinde "Paylaş" butonuna tıklayın.</li>
          <li>Fotoğrafınızı yükleyin ve açıklamaya <strong>#SonbaharPoodle2026</strong> etiketini ekleyin.</li>
          <li>Paylaşımınız otomatik olarak yarışmaya dahil edilir.</li>
        </ol>
      </div>

      <div className="sp-section">
        <h2>Kazanan Seçimi</h2>
        <p>Kazananlar 5–10 Eylül 2026 tarihleri arasında topluluk oylaması (%60) ve jüri değerlendirmesi (%40) kombinasyonuyla belirlenir. Sonuçlar 12 Eylül 2026'da açıklanır.</p>
      </div>

      <a href="/yourpoodle/club?tab=akis" className="sp-cta-btn">Club'a Katıl ve Paylaş →</a>
    </YPStaticPage>
  );
}
