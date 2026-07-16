import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Clock } from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";

const ARTICLES = [
  { emoji:"🍖", title:"Toy Poodle İçin En İyi Mama Markaları 2024", min:5, tag:"Mama Seçimi",
    body:"Royal Canin Poodle formülü, yaşa özel besin değerleriyle öne çıkıyor. Hill's Science Plan ve Pro Plan da Poodle'ların küçük ağız yapısına uygun kibble boyutuyla dikkat çekiyor. Tahılsız seçenekler için Orijen ve Acana tercih edilebilir. Günlük kalori ihtiyacı: yetişkin Toy Poodle (3 kg) için yaklaşık 200–240 kcal." },
  { emoji:"🥩", title:"Yavru Poodle Beslenmesi: İlk 12 Ay", min:6, tag:"Yavru Bakımı",
    body:"8 haftaya kadar annesinden emzirme / mama geçişi, 8–16 hafta arası günde 3 öğün yavru maması, 6 aydan itibaren 2 öğüne geçiş. Yetişkin mamaya geçiş 12. ayda yapılmalı. Porsiyonları tartarak verin; aşırı yemek iskelet gelişimini olumsuz etkiler." },
  { emoji:"🥕", title:"Poodle'lara Verilmeyecek Besinler", min:4, tag:"Beslenme Güvenliği",
    body:"Çikolata, soğan, sarımsak, üzüm ve kuru üzüm kesinlikle verilmemelidir. Avokado ve macadamia cevizi de toksik kabul edilir. Tuzlu yiyecekler böbreklere zarar verir. Şeker ve yapay tatlandırıcılar (xylitol) hayati tehlike oluşturabilir." },
  { emoji:"🐟", title:"Poodle'larda Doğal Mama (BARF) Diyeti", min:8, tag:"Doğal Beslenme",
    body:"Kemik ve çiğ gıda (BARF) diyeti; çiğ et, kemik, organ eti, sebze ve meyveden oluşur. Besin dengesini sağlamak için veteriner onayı şarttır. Yanlış uygulama vitamin eksikliği veya bakteriyel enfeksiyona yol açabilir." },
  { emoji:"💊", title:"Mama ile Birlikte Takviyeler ve Vitaminler", min:5, tag:"Takviyeler",
    body:"Balık yağı (Omega-3) tüy sağlığı için idealdir. Glukozamin eklem sağlığını destekler. Probiyotikler sindirim sağlığını düzenler. B kompleks vitaminleri sinir sistemi için önemlidir. Tüm takviyeler için önce veterinerinize danışın." },
  { emoji:"⚖️", title:"Poodle'larda Obezite: Belirtiler ve Önlemler", min:6, tag:"Kilo Yönetimi",
    body:"Kaburgaları hissedemiyorsanız, yürürken yoruluyor veya nefes darlığı çekiyorsa kilo sorunu olabilir. Günlük porsiyonu azaltın, ödül maması kullanmayın. Yüksek proteinli düşük karbonhidratlı mama tercih edin. Düzenli egzersizle destekleyin." },
];

const TIPS = [
  { icon:"🍽️", tip:"Günde 2 öğün, belirli saatlerde verin." },
  { icon:"💧", tip:"Her zaman temiz taze su erişimi sağlayın." },
  { icon:"⏰", tip:"Mama değiştirirken 7-10 gün kademeli geçiş yapın." },
  { icon:"🚫", tip:"İnsan yemeği verme alışkanlığından kaçının." },
];

export default function MamaRehberi() {
  const [, navigate] = useLocation();
  const [selected, setSelected] = useState<typeof ARTICLES[0]|null>(null);

  const { data: allProducts = [] } = useQuery<any[]>({
    queryKey: ["/api/products"],
    staleTime: 5 * 60 * 1000,
  });

  const featuredMama = (allProducts as any[])
    .filter((p: any) => p.animal === "kopek" && p.isActive !== false)
    .sort((a: any, b: any) => b.id - a.id)
    .slice(0, 4);

  return (
    <YPLayout activeLink="/yourpoodle/mama">
      <title>Poodle Mama Rehberi 2024 | En İyi Mama Markası ve Beslenme | YourPoodle</title>
      <meta name="description" content="Toy Poodle mama rehberi: Royal Canin, Hill's, Pro Plan karşılaştırması. Günlük kalori ihtiyacı, BARF diyeti, yavru maması geçişi ve beslenme ipuçları." />
      <meta property="og:title" content="Poodle Mama Rehberi 2024 | YourPoodle" />
      <meta property="og:description" content="Poodle için en iyi mama markası rehberi. Günlük kalori, BARF diyeti ve beslenme ipuçları." />
      <meta property="og:type" content="website" />
      <meta name="robots" content="index, follow" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Poodle Mama Rehberi",
        "description": "Toy Poodle için en iyi mama markaları, beslenme rehberi ve kalori hesaplama",
        "url": "https://www.yourpoodle.com/yourpoodle/mama",
        "publisher": { "@type": "Organization", "name": "YourPoodle", "url": "https://www.yourpoodle.com" }
      }) }} />
      <style>{`
        .art-row-mama:hover { background: #FFF8F0 !important; }
        @media (min-width: 900px) {
          .mama-hero { border-radius: 20px; margin: 24px 0 !important; }
          .mama-tips { display: grid !important; grid-template-columns: repeat(4,1fr) !important; gap: 10px !important; }
          .mama-products { grid-template-columns: repeat(4,1fr) !important; }
        }
      `}</style>

      {/* Article detail modal */}
      {selected && (
        <div style={{ position:"fixed", inset:0, zIndex:500, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div onClick={() => setSelected(null)} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.4)" }} />
          <div style={{ position:"relative", background:"#fff", borderRadius:20, maxWidth:600, width:"calc(100% - 32px)", maxHeight:"85vh", display:"flex", flexDirection:"column", overflow:"hidden" }}>
            <div style={{ padding:"16px 20px 12px", borderBottom:"1px solid #f2f2f2", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <button onClick={() => setSelected(null)} style={{ background:"none", border:"none", cursor:"pointer", color:"#555", fontSize:14, fontWeight:600 }}>← Geri</button>
              <span style={{ display:"inline-block", background:"#FFF0E0", color:"#E07820", fontSize:11, fontWeight:700, borderRadius:20, padding:"4px 12px" }}>{selected.tag}</span>
            </div>
            <div style={{ overflowY:"auto", padding:"16px 20px 32px" }}>
              <div style={{ fontSize:36, marginBottom:12, textAlign:"center" }}>{selected.emoji}</div>
              <h2 style={{ fontSize:18, fontWeight:900, color:"#1a1a1a", lineHeight:1.35, marginBottom:16 }}>{selected.title}</h2>
              <p style={{ fontSize:15, color:"#444", lineHeight:1.8 }}>{selected.body}</p>
              <div style={{ marginTop:20, padding:"14px", background:"#FFF0E0", borderRadius:14, borderLeft:"3px solid #E07820" }}>
                <div style={{ fontSize:11, fontWeight:800, color:"#E07820", marginBottom:4 }}>💡 UZMAN TAVSİYESİ</div>
                <div style={{ fontSize:13, color:"#555", lineHeight:1.6 }}>Her poodle'ın ihtiyacı farklıdır. Veterinerinizle beslenme planını kişiselleştirin.</div>
              </div>
              <button onClick={() => navigate("/yourpoodle/magaza")}
                style={{ width:"100%", marginTop:16, height:48, borderRadius:14, border:"none", background:"linear-gradient(135deg,#E07820,#F59E0B)", color:"#fff", fontSize:14, fontWeight:800, cursor:"pointer" }}>
                Mama Mağazasına Git 🛍️
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="mama-hero" style={{ background:"linear-gradient(135deg,#E07820,#F59E0B)", padding:"28px 24px 32px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-30, right:-20, width:120, height:120, borderRadius:"50%", background:"rgba(255,255,255,0.1)" }} />
        <div style={{ fontSize:40, marginBottom:10 }}>🍖</div>
        <div style={{ fontSize:26, fontWeight:900, color:"#fff", marginBottom:6 }}>Mama Rehberi</div>
        <div style={{ fontSize:14, color:"rgba(255,255,255,0.9)", lineHeight:1.5 }}>Poodle'ınız için doğru beslenme rehberi</div>
      </div>

      {/* Quick tips */}
      <div style={{ padding:"20px 16px 0" }}>
        <div style={{ fontSize:15, fontWeight:800, color:"#1a1a1a", marginBottom:12 }}>⚡ Hızlı İpuçları</div>
        <div className="mama-tips" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          {TIPS.map(({ icon, tip }) => (
            <div key={tip} style={{ background:"#FFF8F0", borderRadius:12, padding:"10px 12px", display:"flex", alignItems:"flex-start", gap:8 }}>
              <span style={{ fontSize:18, flexShrink:0 }}>{icon}</span>
              <span style={{ fontSize:11, color:"#555", lineHeight:1.5 }}>{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Articles */}
      <div style={{ padding:"20px 16px 0" }}>
        <div style={{ fontSize:16, fontWeight:800, color:"#1a1a1a", marginBottom:14 }}>📖 Beslenme Yazıları</div>
        <div className="yp-art-grid" style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {ARTICLES.map(a => (
            <button key={a.title} className="art-row-mama" onClick={() => setSelected(a)}
              style={{ display:"flex", gap:12, alignItems:"center", padding:"12px", background:"#FAFAFA", borderRadius:14, cursor:"pointer", border:"none", textAlign:"left", width:"100%", transition:"background 0.15s" }}>
              <div style={{ width:52, height:52, borderRadius:12, background:"#FFF0E0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>{a.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:10, fontWeight:700, color:"#E07820", marginBottom:4 }}>{a.tag}</div>
                <div style={{ fontSize:13, fontWeight:700, color:"#1a1a1a", lineHeight:1.4, marginBottom:4 }}>{a.title}</div>
                <span style={{ fontSize:11, color:"#aaa", display:"flex", alignItems:"center", gap:3 }}><Clock size={10} strokeWidth={2} />{a.min} dk</span>
              </div>
              <ChevronRight size={16} color="#ccc" />
            </button>
          ))}
        </div>
      </div>

      {/* Featured products */}
      {featuredMama.length > 0 && (
        <div style={{ margin:"20px 16px 0" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
            <div style={{ fontSize:15, fontWeight:900, color:"#1a1a1a" }}>🛍️ Öne Çıkan Mamalar</div>
            <button onClick={() => navigate("/yourpoodle/magaza")} style={{ fontSize:12, fontWeight:700, color:"#E07820", background:"none", border:"none", cursor:"pointer" }}>Tümü →</button>
          </div>
          <div className="mama-products" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {featuredMama.map((p: any) => (
              <button key={p.id} onClick={() => navigate(`/urun/${p.id}/${p.slug || ""}`)}
                style={{ background:"#fff", borderRadius:14, padding:"12px", boxShadow:"0 2px 8px rgba(0,0,0,0.07)", border:"none", cursor:"pointer", textAlign:"left" }}>
                {p.img && <img src={p.img} alt={p.name} style={{ width:"100%", height:80, objectFit:"contain", borderRadius:8, marginBottom:8, background:"#f9f9f9" }} />}
                <div style={{ fontSize:11, fontWeight:700, color:"#1a1a1a", lineHeight:1.4, marginBottom:4, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" as const }}>{p.name}</div>
                <div style={{ fontSize:13, fontWeight:900, color:"#E07820" }}>{Number(p.price).toLocaleString("tr-TR")} ₺</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CTAs */}
      <div style={{ margin:"20px 16px", background:"linear-gradient(135deg,#FFF0E0,#FFF9C4)", borderRadius:18, padding:"20px", display:"flex", gap:14, alignItems:"center" }}>
        <span style={{ fontSize:36, flexShrink:0 }}>🛍️</span>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:14, fontWeight:800, color:"#1a1a1a", marginBottom:4 }}>Mama Mağazamız</div>
          <div style={{ fontSize:12, color:"#888", lineHeight:1.5, marginBottom:10 }}>900'den fazla mama ve ürün. Hızlı teslimat.</div>
          <button onClick={() => navigate("/yourpoodle/magaza")}
            style={{ height:40, borderRadius:12, border:"none", background:"#E07820", color:"#fff", fontSize:13, fontWeight:800, padding:"0 20px", cursor:"pointer" }}>
            Mağazaya Git →
          </button>
        </div>
      </div>

      <div style={{ margin:"0 16px 32px", background:"#F0FDF4", borderRadius:18, padding:"20px", textAlign:"center" }}>
        <div style={{ fontSize:24, marginBottom:8 }}>🍖</div>
        <div style={{ fontSize:14, fontWeight:800, color:"#1a1a1a", marginBottom:4 }}>Mama Hesaplama Aracı</div>
        <div style={{ fontSize:12, color:"#888", lineHeight:1.5, marginBottom:12 }}>Poodle'ınızın kilosuna göre günlük mama miktarını hesaplayın.</div>
        <button onClick={() => navigate("/yourpoodle/bilgi")}
          style={{ height:40, borderRadius:12, border:"none", background:"#059669", color:"#fff", fontSize:13, fontWeight:800, padding:"0 24px", cursor:"pointer" }}>
          Hesapla
        </button>
      </div>
    </YPLayout>
  );
}
