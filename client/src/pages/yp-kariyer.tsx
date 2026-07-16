import YPStaticPage from "@/components/yourpoodle/YPStaticPage";

const POSITIONS = [
  { title:"İçerik Editörü", type:"Tam zamanlı", location:"Uzaktan", desc:"Toy Poodle bakım, mama ve sağlık konularında Türkçe içerik üretimi. SEO odaklı yazarlık deneyimi tercih sebebidir." },
  { title:"Topluluk Yöneticisi", type:"Yarı zamanlı", location:"Uzaktan", desc:"YourPoodle Club topluluğunu yönetme, üye ilişkileri ve etkinlik koordinasyonu. Poodle sahibi olmak artı." },
  { title:"E-ticaret Uzmanı", type:"Tam zamanlı", location:"Samsun veya Uzaktan", desc:"Ürün listeleme, kampanya yönetimi ve sipariş süreçlerinin operasyonel yönetimi. Shopify/WooCommerce deneyimi beklenir." },
];

export default function YPKariyer() {
  return (
    <YPStaticPage
      title="Kariyer"
      description="YourPoodle'da kariyer fırsatları: açık pozisyonlar, başvuru süreci ve neden YourPoodle'da çalışmalısınız."
      updatedDate="16 Temmuz 2026"
      breadcrumb={[{ label:"Ana Sayfa", href:"/yourpoodle" }, { label:"Hakkımızda", href:"/yourpoodle/hakkinda" }, { label:"Kariyer" }]}
    >
      <p style={{ fontSize:14, color:"#555", lineHeight:1.75, marginBottom:28 }}>
        YourPoodle, Türkiye'nin büyüyen poodle sahipleri platformudur. Köpek dostu, uzaktan çalışmayı destekleyen ve topluluk odaklı ekibimize katılmak ister misiniz?
      </p>

      <div className="sp-section">
        <h2>Neden YourPoodle?</h2>
        <ul>
          <li>Tam uzaktan veya hibrit çalışma imkânı</li>
          <li>Büyüyen startup enerjisi — kararlar hızlı alınır</li>
          <li>Poodle sahiplerine gerçek değer katan ürün geliştirme</li>
          <li>Esnek çalışma saatleri ve sonuç odaklı kültür</li>
        </ul>
      </div>

      <div className="sp-section">
        <h2>Açık Pozisyonlar</h2>
        {POSITIONS.map(p => (
          <div key={p.title} style={{ background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:14, padding:"18px 20px", marginBottom:12 }}>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center", marginBottom:8 }}>
              <span style={{ fontSize:15, fontWeight:800, color:"#1a1a1a" }}>{p.title}</span>
              <span style={{ fontSize:11, background:"#EDE8FF", color:"#7C3AED", borderRadius:6, padding:"2px 8px", fontWeight:700 }}>{p.type}</span>
              <span style={{ fontSize:11, background:"#F0FFF4", color:"#16A34A", borderRadius:6, padding:"2px 8px", fontWeight:700 }}>📍 {p.location}</span>
            </div>
            <p style={{ fontSize:13.5, color:"#555", lineHeight:1.7, margin:0 }}>{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="sp-section">
        <h2>Nasıl Başvurursunuz?</h2>
        <p>CV'nizi ve başvurmak istediğiniz pozisyonu belirterek <a href="mailto:info@yourpoodle.com" style={{ color:"#7C3AED", fontWeight:700 }}>info@yourpoodle.com</a> adresine e-posta gönderin. Uygun adaylara 5 iş günü içinde dönüş yapılır.</p>
      </div>

      <a href="mailto:info@yourpoodle.com?subject=Kariyer%20Başvurusu" className="sp-cta-btn">Başvur →</a>
    </YPStaticPage>
  );
}
