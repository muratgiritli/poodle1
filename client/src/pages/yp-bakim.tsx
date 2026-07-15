import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronRight, Clock, CheckCircle2, Circle } from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";

const ARTICLES = [
  { emoji:"✂️", title:"Evde Poodle Tıraşı: Adım Adım Rehber", min:8, tag:"Tıraş",
    body:"Teddy bear kesimi için önce banyo, kurutma, ardından makasla şekillendirme adımlarını takip edin. Kulak temizliği tıraş öncesi yapılmalıdır. Gerekli ekipman: slicker fırça, matlaştırıcı sprey, profesyonel makas seti ve tıraş makinesi. Her 6–8 haftada bir tam tıraş önerilir." },
  { emoji:"🛁", title:"Poodle Tüy Bakımı: Haftalık Rutin Rehberi", min:5, tag:"Tüy Bakımı",
    body:"Haftada en az 3 kez slicker fırçayla tarama, 4–6 haftada bir profesyonel tıraş ve 2 haftada bir banyo standart bakım rutinidir. Pin fırça yerine slicker tercih edin; mat önlemek için köklere kadar tarayın. Kulak kıllarını 3–4 haftada bir aldırın." },
  { emoji:"🐾", title:"Poodle Pençe Bakımı: Nasıl ve Ne Zaman Kesilir?", min:5, tag:"Pençe Bakımı",
    body:"Pençeler zeminde tıkırtı çıkarmaya başladığında kesilmeli — genellikle 3-4 haftada bir. Damarı (quick) kesmemek için küçük adımlarla kesin, koyu renkli pençelerde dikkatli olun. İlk kez için veteriner veya groomer'dan yardım alın." },
  { emoji:"👂", title:"Poodle Kulak Bakımı ve Enfeksiyon Önleme", min:6, tag:"Kulak Bakımı",
    body:"Poodle'ların kulak kanalı kapalı yapısı nedeniyle enfeksiyona yatkındır. 3-4 haftada bir kulak kıllarını aldırın ve uygun kulak temizleyici ile silin. Kaşıma, baş sallama veya kötü koku varsa veterinere gidin." },
  { emoji:"🦷", title:"Evde Poodle Diş Fırçalama Teknikleri", min:6, tag:"Ağız Bakımı",
    body:"Köpeklere özel diş fırçası ve macun kullanın (insan macunu toksiktir). Önce parmakla diş etlerine alıştırın, sonra fırçayı tanıtın. Haftada 2-3 kez fırçalama ideal; minimum haftada 1 kez." },
  { emoji:"💆", title:"Banyo Rehberi: Doğru Sıklık ve Teknik", min:5, tag:"Banyo",
    body:"Toy Poodle'lar için 2 haftada bir banyo idealdir. Öncesinde tüyleri tarayın — ıslak mat daha zor çözülür. Köpek şampuanı, iyice durulamak ve saç kurutucuyla tam kurutma şart." },
];

const CHECKLIST = [
  { id:"fırça", freq:"3x/hafta", task:"Slicker fırça ile tüy tarama" },
  { id:"banyo",  freq:"2x/ay",   task:"Banyo" },
  { id:"kulak",  freq:"1x/ay",   task:"Kulak temizliği ve kıl kontrolü" },
  { id:"pençe",  freq:"1x/ay",   task:"Pençe kesimi" },
  { id:"diş",    freq:"2x/hafta",task:"Diş fırçalama" },
  { id:"tıraş",  freq:"6-8 hafta",task:"Profesyonel tıraş" },
  { id:"göz",    freq:"Günlük",  task:"Göz çevresi temizliği" },
];

export default function Bakim() {
  const [, navigate] = useLocation();
  const [selected, setSelected] = useState<typeof ARTICLES[0]|null>(null);
  const [checked, setChecked]   = useState<Set<string>>(new Set());
  const toggle = (id: string) => { const s = new Set(checked); s.has(id) ? s.delete(id) : s.add(id); setChecked(s); };

  return (
    <YPLayout activeLink="/yourpoodle/bakim">
      <title>Bakım Rehberi — YourPoodle</title>
      <style>{`
        .art-row-bakim:hover { background: #FFF0F5 !important; }
        @media (min-width: 900px) {
          .bakim-hero { border-radius: 20px; margin: 24px 0 !important; }
          .bakim-checklist { display: grid !important; grid-template-columns: 1fr 1fr; gap: 8px !important; }
        }
      `}</style>

      {/* Article detail modal */}
      {selected && (
        <div style={{ position:"fixed", inset:0, zIndex:500, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div onClick={() => setSelected(null)} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.4)" }} />
          <div style={{ position:"relative", background:"#fff", borderRadius:20, maxWidth:600, width:"calc(100% - 32px)", maxHeight:"85vh", display:"flex", flexDirection:"column", overflow:"hidden" }}>
            <div style={{ padding:"16px 20px 12px", borderBottom:"1px solid #f2f2f2", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <button onClick={() => setSelected(null)} style={{ background:"none", border:"none", cursor:"pointer", color:"#555", fontSize:14, fontWeight:600 }}>← Geri</button>
              <span style={{ display:"inline-block", background:"#FFE4EC", color:"#E75480", fontSize:11, fontWeight:700, borderRadius:20, padding:"4px 12px" }}>{selected.tag}</span>
            </div>
            <div style={{ overflowY:"auto", padding:"16px 20px 32px" }}>
              <div style={{ fontSize:36, marginBottom:12, textAlign:"center" }}>{selected.emoji}</div>
              <h2 style={{ fontSize:18, fontWeight:900, color:"#1a1a1a", lineHeight:1.35, marginBottom:16 }}>{selected.title}</h2>
              <p style={{ fontSize:15, color:"#444", lineHeight:1.8 }}>{selected.body}</p>
              <button onClick={() => navigate("/yourpoodle/magaza")}
                style={{ width:"100%", marginTop:20, height:48, borderRadius:14, border:"none", background:"linear-gradient(135deg,#E75480,#F472B6)", color:"#fff", fontSize:14, fontWeight:800, cursor:"pointer" }}>
                Bakım Ürünlerine Git 🛍️
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="bakim-hero" style={{ background:"linear-gradient(135deg,#E75480,#F472B6)", padding:"28px 24px 32px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-30, right:-20, width:120, height:120, borderRadius:"50%", background:"rgba(255,255,255,0.1)" }} />
        <div style={{ fontSize:40, marginBottom:10 }}>✂️</div>
        <div style={{ fontSize:26, fontWeight:900, color:"#fff", marginBottom:6 }}>Bakım Rehberi</div>
        <div style={{ fontSize:14, color:"rgba(255,255,255,0.9)", lineHeight:1.5 }}>Poodle'ınızı her zaman şık ve sağlıklı tutun</div>
      </div>

      {/* Checklist */}
      <div style={{ padding:"20px 16px 0" }}>
        <div style={{ fontSize:15, fontWeight:800, color:"#1a1a1a", marginBottom:12 }}>✅ Bakım Kontrol Listesi</div>
        <div className="bakim-checklist" style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:4 }}>
          {CHECKLIST.map(({ id, freq, task }) => (
            <button key={id} onClick={() => toggle(id)}
              style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", background:checked.has(id)?"#FFF0F5":"#FAFAFA", borderRadius:12, border:`1.5px solid ${checked.has(id)?"#FCA5A5":"#f0f0f0"}`, cursor:"pointer", textAlign:"left", transition:"all 0.15s" }}>
              {checked.has(id)
                ? <CheckCircle2 size={20} color="#E75480" strokeWidth={2} style={{ flexShrink:0 }} />
                : <Circle size={20} color="#ddd" strokeWidth={2} style={{ flexShrink:0 }} />
              }
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:checked.has(id)?"#E75480":"#333", textDecoration:checked.has(id)?"line-through":"none" }}>{task}</div>
              </div>
              <span style={{ fontSize:10, fontWeight:700, background:"#FFE4EC", color:"#E75480", borderRadius:6, padding:"2px 8px", flexShrink:0 }}>{freq}</span>
            </button>
          ))}
        </div>
        {checked.size > 0 && (
          <div style={{ textAlign:"center", padding:"8px 0", fontSize:12, color:"#E75480", fontWeight:700 }}>
            {checked.size}/{CHECKLIST.length} tamamlandı 🎀
          </div>
        )}
      </div>

      {/* Articles */}
      <div style={{ padding:"20px 16px 0" }}>
        <div style={{ fontSize:16, fontWeight:800, color:"#1a1a1a", marginBottom:14 }}>📖 Bakım Yazıları</div>
        <div className="yp-art-grid" style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {ARTICLES.map(a => (
            <button key={a.title} className="art-row-bakim" onClick={() => setSelected(a)}
              style={{ display:"flex", gap:12, alignItems:"center", padding:"12px", background:"#FAFAFA", borderRadius:14, cursor:"pointer", border:"none", textAlign:"left", width:"100%", transition:"background 0.15s" }}>
              <div style={{ width:52, height:52, borderRadius:12, background:"#FFE4EC", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>{a.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:10, fontWeight:700, color:"#E75480", marginBottom:4 }}>{a.tag}</div>
                <div style={{ fontSize:13, fontWeight:700, color:"#1a1a1a", lineHeight:1.4, marginBottom:4 }}>{a.title}</div>
                <span style={{ fontSize:11, color:"#aaa", display:"flex", alignItems:"center", gap:3 }}><Clock size={10} strokeWidth={2} />{a.min} dk</span>
              </div>
              <ChevronRight size={16} color="#ccc" />
            </button>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div style={{ margin:"20px 16px 32px", background:"linear-gradient(135deg,#FFE4EC,#FFF0F5)", borderRadius:18, padding:"20px", textAlign:"center" }}>
        <div style={{ fontSize:24, marginBottom:8 }}>✂️</div>
        <div style={{ fontSize:14, fontWeight:800, color:"#1a1a1a", marginBottom:4 }}>Tıraş Zamanlama Aracı</div>
        <div style={{ fontSize:12, color:"#888", lineHeight:1.5, marginBottom:14 }}>Son tıraş tarihine göre bir sonraki tarihi hesaplayın.</div>
        <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
          <button onClick={() => navigate("/yourpoodle/bilgi")}
            style={{ flex:1, maxWidth:160, height:40, borderRadius:12, border:"none", background:"#E75480", color:"#fff", fontSize:13, fontWeight:800, cursor:"pointer" }}>
            Hesapla
          </button>
          <button onClick={() => navigate("/yourpoodle/magaza")}
            style={{ flex:1, maxWidth:160, height:40, borderRadius:12, border:"2px solid #E75480", background:"#fff", color:"#E75480", fontSize:13, fontWeight:800, cursor:"pointer" }}>
            Bakım Ürünleri
          </button>
        </div>
      </div>
    </YPLayout>
  );
}
