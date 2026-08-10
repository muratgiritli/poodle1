import YPStaticPage from "@/components/yourpoodle/YPStaticPage";

const ITEMS = [
  { emoji:"🎀", title:"Kişisel Tasma", desc:"Adı ve iletişim bilgileriyle nakışlanmış deri veya naylon tasma. 12 renk seçeneği." },
  { emoji:"👗", title:"Özel Kıyafet",  desc:"Bedeninize göre dikilmiş kazak, elbise veya yağmurluk. Kendi kumaşınızı da gönderebilirsiniz." },
  { emoji:"🏷️", title:"İsim Plakası",  desc:"Paslanmaz çelik ya da köpekçik şeklinde gravürlü kolye plakası. 24 saatte üretim." },
  { emoji:"🛏️", title:"Özel Yatak",    desc:"Boyutuna göre dikilen, yıkanabilir iç kaplı yumuşak yatak. İsim işleme eklenebilir." },
];

export default function YPOzelTasarim() {
  return (
    <YPStaticPage
      title="Özel Tasarım"
      description="Poodle'ınız için kişiselleştirilmiş tasma, kıyafet ve aksesuar. Adını yazın, rengini seçin — size özel üretelim."
      breadcrumb={[{ label:"Ana Sayfa", href:"/yourpoodle" }, { label:"Mağaza", href:"/yourpoodle/magaza" }, { label:"Özel Tasarım" }]}
    >
      {/* Hero */}
      <div style={{ background:"linear-gradient(135deg,#5D3A1A,#A67C52,#EC4899)", borderRadius:18, padding:"28px 24px", marginBottom:32, color:"#fff" }}>
        <div style={{ fontSize:11, fontWeight:800, letterSpacing:"0.1em", color:"rgba(255,255,255,0.7)", marginBottom:6 }}>SADECE YOURPOODLE'DA</div>
        <h2 style={{ fontSize:22, fontWeight:900, marginBottom:8, padding:0, border:"none", color:"#fff" }}>Poodle'ınıza Özel Ürünler</h2>
        <p style={{ fontSize:14, lineHeight:1.6, color:"rgba(255,255,255,0.88)", margin:"0 0 20px" }}>
          Adı işlenmiş, rengi seçilmiş, bedeni ölçülmüş — tamamen sizin için üretilen poodle aksesuarları.
        </p>
        <a href="mailto:info@sizpa.com?subject=Özel%20Tasarım%20Talebi"
          style={{ display:"inline-flex", alignItems:"center", gap:8, height:46, padding:"0 22px", borderRadius:12, background:"#fff", color:"#5D3A1A", fontSize:14, fontWeight:800, textDecoration:"none", fontFamily:"Inter,sans-serif" }}>
          Talep Oluştur →
        </a>
      </div>

      <div className="sp-section">
        <h2>Ürün Kategorileri</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))", gap:14 }}>
          {ITEMS.map(({ emoji, title, desc }) => (
            <div key={title} style={{ background:"#FAFAFA", border:"1px solid #E5E7EB", borderRadius:14, padding:"18px 16px" }}>
              <div style={{ fontSize:28, marginBottom:10 }}>{emoji}</div>
              <div style={{ fontSize:14, fontWeight:800, color:"#1a1a1a", marginBottom:6 }}>{title}</div>
              <div style={{ fontSize:13, color:"#6B7280", lineHeight:1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="sp-section">
        <h2>Sipariş Süreci</h2>
        <ol>
          <li><strong>Talep gönderin:</strong> <a href="mailto:info@sizpa.com?subject=Özel%20Tasarım%20Talebi" style={{ color:"#5D3A1A" }}>info@sizpa.com</a> adresine ürün türü, renk, beden ve varsa özel not gönderin.</li>
          <li><strong>Fiyat teklifi alın:</strong> 24 saat içinde kişiselleştirilmiş fiyat teklifi gönderilir.</li>
          <li><strong>Onaylayın ve ödeme yapın:</strong> Ödeme bağlantısı e-posta ile iletilir.</li>
          <li><strong>Üretim ve kargo:</strong> Üretim süresi 3–7 iş günü; tamamlandığında kargoya verilir.</li>
        </ol>
      </div>

      <div className="sp-section">
        <h2>Sık Sorulan Sorular</h2>
        <p><strong>Minimum sipariş var mı?</strong><br/>Hayır, tek adet sipariş verilebilir.</p>
        <p><strong>Tasarım ücreti alınıyor mu?</strong><br/>Temel kişiselleştirme (isim, renk) ücretsizdir. Karmaşık grafik tasarımlar için ek ücret uygulanabilir.</p>
        <p><strong>İade edilebilir mi?</strong><br/>Kişiselleştirilmiş ürünler üretim başlamadan iptal edilebilir; üretim başladıktan sonra iade kabul edilmez.</p>
      </div>

      <a href="mailto:info@sizpa.com?subject=Özel%20Tasarım%20Talebi" className="sp-cta-btn">Talep Oluştur</a>
    </YPStaticPage>
  );
}
