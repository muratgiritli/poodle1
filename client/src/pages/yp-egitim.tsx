import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronRight, Clock, Star } from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";

const ARTICLES = [
  { emoji:"🐾", title:"Poodle'ınıza Temel Komutları Nasıl Öğretirsiniz?", min:10, tag:"Temel Eğitim", difficulty:"Başlangıç",
    body:"Otur, gel, dur, bırak komutlarını pozitif pekiştirme ile 2–4 hafta içinde öğretebilirsiniz. Günlük 10 dakika tutarlı antrenman yeterlidir. Poodle'lar yüksek zeka düzeyi sayesinde köpek türleri arasında en hızlı öğrenenlerden biridir; sıkılmamak için egzersizleri çeşitlendirin." },
  { emoji:"🎓", title:"Clicker Eğitimi ile Hızlı Öğrenme Teknikleri", min:8, tag:"İleri Eğitim", difficulty:"Orta",
    body:"Clicker sesi ile ödülü eşleştirin (50 tekrar), ardından istenen davranışı capture ya da shaping yöntemiyle pekiştirin. Mark & reward döngüsü 50–100 tekrarda otomatik hale gelir. Poodle'lar hata toleransı yüksek köpeklerdir; asla olumsuz pekiştirme kullanmayın." },
  { emoji:"🏠", title:"Tuvalet Eğitimi: Yavru Poodle İçin Adım Adım", min:7, tag:"Yavru Eğitimi", difficulty:"Başlangıç",
    body:"Her yemekten 20-30 dakika sonra belirli bir noktaya götürün. Başarılı olduğunda hemen ödüllendirin. Kaza yaptığında asla cezalandırmayın. İlk hafta saatte bir çıkış rutini oluşturun. Genellikle 2-4 haftada tamamlanır." },
  { emoji:"🤝", title:"Sosyalleşme: Diğer Köpekler ve İnsanlarla", min:9, tag:"Sosyalleşme", difficulty:"Başlangıç",
    body:"3-12 hafta arası kritik sosyalleşme penceresidir. Bu dönemde mümkün olduğunca farklı ses, koku, insan ve hayvanla tanıştırın. Köpek parkları, köpek kreşleri ve poodle buluşmaları ideal ortamlardır. Her pozitif deneyimi ödülle pekiştirin." },
  { emoji:"🏃", title:"Agility: Poodle'ınızı Engel Parkuru'nda Eğitmek", min:12, tag:"Spor Eğitimi", difficulty:"İleri",
    body:"Agility tünel, atlama bariyerleri ve slalom gibi ekipmanlar gerektirir. Önce her engeli ayrı ayrı tanıtın, sonra sıralı parkuru deneyin. Poodle'lar agility'de çok başarılıdır — zihinsel uyarım ve fiziksel aktiviteyi birleştirir. Yerel kulüpler başlangıç için idealdir." },
  { emoji:"🛁", title:"Bakım Rutinine Alıştırma: Tıraş ve Banyo Eğitimi", min:6, tag:"Bakım Hazırlık", difficulty:"Başlangıç",
    body:"Küçük yaştan itibaren tarama, pençe kesimi ve banyoya alıştırın. Her oturumu pozitif deneyimle bitirin. Fırça sesi, makas ve saç kurutma makinasını önce uzaktan tanıtın." },
];

const STAGES = [
  { label:"Yavru (0-6 ay)",     tips:["Tuvalet eğitimi","Temel komutlar","Sosyalleşme","Isırma kontrolü"], color:"#FFB347" },
  { label:"Genç (6-18 ay)",     tips:["İleri komutlar","Tasma eğitimi","Geri çağırma","Başka köpeklerle play"], color:"#A78BFA" },
  { label:"Yetişkin (1-7 yaş)", tips:["Çevre güvenliği","İsteksizlik yönetimi","Konsantrasyon arttırma","Yeni beceriler"], color:"#34D399" },
];

const diffColor = (d: string) => d === "Başlangıç" ? "#22C55E" : d === "Orta" ? "#F59E0B" : "#EF4444";

export default function Egitim() {
  const [, navigate] = useLocation();
  const [selected,     setSelected]     = useState<typeof ARTICLES[0]|null>(null);
  const [activeStage,  setActiveStage]  = useState(0);

  return (
    <YPLayout activeLink="/yourpoodle/egitim">
      <title>Poodle Eğitim Rehberi | Komutlar, Clicker ve Agility | YourPoodle</title>
      <meta name="description" content="Toy Poodle eğitim rehberi: otur, gel, bırak komutları, clicker eğitimi, tuvalet eğitimi ve sosyalleşme. Poodle dünyanın en zeki köpek ırkıdır — doğru yöntemlerle eğitin." />
      <meta property="og:title" content="Poodle Eğitim Rehberi | YourPoodle" />
      <meta property="og:description" content="Poodle için komut eğitimi, clicker ve agility rehberi. Dünyanın en zeki köpeğini doğru yöntemle eğitin." />
      <meta property="og:type" content="website" />
      <meta name="robots" content="index, follow" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Poodle Eğitim Rehberi",
        "description": "Toy Poodle eğitimi: temel komutlar, clicker, agility ve tuvalet eğitimi",
        "url": "https://www.yourpoodle.com/yourpoodle/egitim",
        "publisher": { "@type": "Organization", "name": "YourPoodle", "url": "https://www.yourpoodle.com" }
      }) }} />
      <style>{`
        .art-row-egitim:hover { background: #F0FDF4 !important; }
        @media (min-width: 900px) {
          .egitim-hero { border-radius: 20px; margin: 24px 0 !important; }
          .egitim-stages { display: flex; gap: 10px; }
          .egitim-stages button { flex: 1; }
        }
      `}</style>

      {/* Article detail modal */}
      {selected && (
        <div style={{ position:"fixed", inset:0, zIndex:500, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div onClick={() => setSelected(null)} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.4)" }} />
          <div style={{ position:"relative", background:"#fff", borderRadius:20, maxWidth:600, width:"calc(100% - 32px)", maxHeight:"85vh", display:"flex", flexDirection:"column", overflow:"hidden" }}>
            <div style={{ padding:"16px 20px 12px", borderBottom:"1px solid #f2f2f2", display:"flex", alignItems:"center", gap:12 }}>
              <button onClick={() => setSelected(null)} style={{ background:"none", border:"none", cursor:"pointer", color:"#555", fontSize:14, fontWeight:600 }}>← Geri</button>
              <span style={{ fontSize:10, fontWeight:800, background:"#CCFBF1", color:"#0D9488", borderRadius:20, padding:"4px 12px" }}>{selected.tag}</span>
              <span style={{ fontSize:10, fontWeight:800, background:diffColor(selected.difficulty)+"22", color:diffColor(selected.difficulty), borderRadius:20, padding:"4px 12px" }}>{selected.difficulty}</span>
            </div>
            <div style={{ overflowY:"auto", padding:"16px 20px 32px" }}>
              <div style={{ fontSize:36, marginBottom:12, textAlign:"center" }}>{selected.emoji}</div>
              <h2 style={{ fontSize:18, fontWeight:900, color:"#1a1a1a", lineHeight:1.35, marginBottom:16 }}>{selected.title}</h2>
              <p style={{ fontSize:15, color:"#444", lineHeight:1.8 }}>{selected.body}</p>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="egitim-hero" style={{ background:"linear-gradient(135deg,#0D9488,#34D399)", padding:"28px 24px 32px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-30, right:-20, width:120, height:120, borderRadius:"50%", background:"rgba(255,255,255,0.1)" }} />
        <div style={{ fontSize:40, marginBottom:10 }}>🎓</div>
        <div style={{ fontSize:26, fontWeight:900, color:"#fff", marginBottom:6 }}>Eğitim Rehberi</div>
        <div style={{ fontSize:14, color:"rgba(255,255,255,0.9)", lineHeight:1.5 }}>Poodle'ınızın zekasını en iyi şekilde kullanın</div>
        <div style={{ display:"flex", gap:20, marginTop:16 }}>
          {[["#1","En Zeki","Köpek Irkı"],["10dk","Günlük","Antrenman"],["4 hafta","Temel","Komutlar"]].map(([n,l,s]) => (
            <div key={l} style={{ textAlign:"center" }}>
              <div style={{ fontSize:16, fontWeight:900, color:"#fff" }}>{n}</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.75)" }}>{l}</div>
              <div style={{ fontSize:9, color:"rgba(255,255,255,0.6)" }}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Training stages */}
      <div style={{ padding:"20px 16px 0" }}>
        <div style={{ fontSize:15, fontWeight:800, color:"#1a1a1a", marginBottom:12 }}>📅 Yaşa Göre Eğitim</div>
        <div className="egitim-stages" style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:12 }}>
          {STAGES.map((s, i) => (
            <button key={i} onClick={() => setActiveStage(i)}
              style={{ padding:"10px 14px", borderRadius:10, border:"2px solid", borderColor:activeStage===i?s.color:"#e8e8e8", background:activeStage===i?s.color+"22":"#fff", fontSize:13, fontWeight:700, color:activeStage===i?s.color:"#555", cursor:"pointer", textAlign:"left" }}>
              {s.label}
            </button>
          ))}
        </div>
        <div style={{ background:STAGES[activeStage].color+"11", borderRadius:14, padding:14, marginBottom:16 }}>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {STAGES[activeStage].tips.map(tip => (
              <div key={tip} style={{ display:"flex", alignItems:"center", gap:8 }}>
                <Star size={12} color={STAGES[activeStage].color} fill={STAGES[activeStage].color} />
                <span style={{ fontSize:13, color:"#333" }}>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Articles */}
      <div style={{ padding:"4px 16px 0" }}>
        <div style={{ fontSize:16, fontWeight:800, color:"#1a1a1a", marginBottom:14 }}>📖 Eğitim Yazıları</div>
        <div className="yp-art-grid" style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {ARTICLES.map(a => (
            <button key={a.title} className="art-row-egitim" onClick={() => setSelected(a)}
              style={{ display:"flex", gap:12, alignItems:"center", padding:"12px", background:"#FAFAFA", borderRadius:14, cursor:"pointer", border:"none", textAlign:"left", width:"100%", transition:"background 0.15s" }}>
              <div style={{ width:52, height:52, borderRadius:12, background:"#CCFBF1", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>{a.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", gap:6, marginBottom:4 }}>
                  <span style={{ fontSize:10, fontWeight:700, color:"#0D9488" }}>{a.tag}</span>
                  <span style={{ fontSize:10, fontWeight:700, color:diffColor(a.difficulty), background:diffColor(a.difficulty)+"22", borderRadius:4, padding:"0 4px" }}>{a.difficulty}</span>
                </div>
                <div style={{ fontSize:13, fontWeight:700, color:"#1a1a1a", lineHeight:1.4, marginBottom:4 }}>{a.title}</div>
                <span style={{ fontSize:11, color:"#aaa", display:"flex", alignItems:"center", gap:3 }}><Clock size={10} strokeWidth={2} />{a.min} dk</span>
              </div>
              <ChevronRight size={16} color="#ccc" />
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ margin:"20px 16px 32px", background:"#CCFBF1", borderRadius:18, padding:"20px", textAlign:"center" }}>
        <div style={{ fontSize:24, marginBottom:8 }}>🐾</div>
        <div style={{ fontSize:14, fontWeight:800, color:"#1a1a1a", marginBottom:4 }}>Topluluğa Katıl</div>
        <div style={{ fontSize:12, color:"#555", lineHeight:1.5, marginBottom:12 }}>Diğer poodle sahipleriyle eğitim ipuçlarını paylaşın.</div>
        <button onClick={() => navigate("/yourpoodle/club")}
          style={{ height:40, borderRadius:12, border:"none", background:"#0D9488", color:"#fff", fontSize:13, fontWeight:800, padding:"0 24px", cursor:"pointer" }}>
          Club'a Git
        </button>
      </div>
    </YPLayout>
  );
}
