import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronRight, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";

const ARTICLES = [
  { emoji:"💊", title:"Poodle'larda Görülen 10 Yaygın Sağlık Sorunu", min:6, tag:"Genel Sağlık",
    body:"Addison hastalığı, tiroid sorunları ve göz yaşı lekeleri Poodle'larda en sık görülen rahatsızlıkların başında gelir. Patellar luksasyon (diz kayması), ilerleyici retinal atrofi ve epilepsi genetik risk faktörleri arasındadır. Yılda iki kez veteriner kontrolü kritik öneme sahiptir." },
  { emoji:"🏥", title:"Poodle'larda Kalça Displazisi: Erken Teşhis", min:9, tag:"Ortopedi",
    body:"OFA sertifikasyonlu ebeveynlerden doğan yavruları tercih edin. 6 aylık kontrollerde röntgen çektirerek erken tarama yapılabilir. Eklem takviyesi için balık yağı ve glukozamin içeren mamalar destekleyici rol oynar." },
  { emoji:"❤️", title:"Poodle Anksiyetesi: Belirtiler ve Çözüm Yolları", min:7, tag:"Davranış Sağlığı",
    body:"Ayrılık anksiyetesi belirtileri: sürekli havlama, kapı önünde bekleme, eşya çiğneme. KONG oyuncağı ve Adaptil diffuser ilk adımlar olarak önerilir. Desensitizasyon protokolü için davranış uzmanıyla çalışmak uzun vadede en etkili yöntemdir." },
  { emoji:"💉", title:"Poodle Aşı Takvimi: Yavrudan Yetişkine", min:5, tag:"Önleyici Bakım",
    body:"İlk aşılar 6-8. haftadan başlar: Karma (DHPPi) + Kuduz serisi. Yıllık hatırlatıcılar zorunludur. Kennel cough ve leptospiroz, diğer köpeklerle temas durumunda önerilir. Pasaport defterini güncel tutun." },
  { emoji:"🦷", title:"Diş Sağlığı: Küçük Irklarda Periodontal Hastalık", min:6, tag:"Ağız Sağlığı",
    body:"Toy Poodle'larda diş sıkışması yaygındır. Haftada 2-3 kez fırçalama, 3-4 haftada bir profesyonel diş temizliği önerilir. Diş oyuncakları ve dental mamaları destekleyici olarak kullanabilirsiniz. Kötü ağız kokusu veteriner kontrolü gerektirir." },
  { emoji:"👁️", title:"Göz Yaşı Lekeleri: Nedenler ve Çözümler", min:5, tag:"Göz Sağlığı",
    body:"Beyaz ve açık renkli Poodle'larda göz altı lekeleri oksidasyondan oluşur. Temiz su içilmesi, göz dışı yüzey temizliği ve bazı durumlarda porfirin içeriği düşük mamalar faydalı olabilir. Aşırı yırtma göz tıkanıklığına işaret edebilir — veterinere görünün." },
];

const WARNING_SIGNS = [
  { sign:"İştah kaybı (>24 saat)", urgent:false },
  { sign:"Kanlı dışkı veya kusma", urgent:true },
  { sign:"Nefes darlığı", urgent:true },
  { sign:"Titreme veya nöbet", urgent:true },
  { sign:"Topallama (>12 saat)", urgent:false },
  { sign:"Aşırı su içme", urgent:false },
];

export default function Saglik() {
  const [, navigate] = useLocation();
  const [selected, setSelected] = useState<typeof ARTICLES[0]|null>(null);

  return (
    <YPLayout activeLink="/yourpoodle/saglik">
      <title>Sağlık Rehberi — YourPoodle</title>
      <style>{`
        .art-row-saglik:hover { background: #FFF1F2 !important; }
        @media (min-width: 900px) {
          .saglik-warning-grid { display: grid !important; grid-template-columns: 1fr 1fr; gap: 8px; }
          .saglik-hero { border-radius: 20px; margin: 24px 0 !important; }
        }
      `}</style>

      {/* Article detail modal */}
      {selected && (
        <div style={{ position:"fixed", inset:0, zIndex:500, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div onClick={() => setSelected(null)} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.4)" }} />
          <div style={{ position:"relative", background:"#fff", borderRadius:20, maxWidth:600, width:"calc(100% - 32px)", maxHeight:"85vh", display:"flex", flexDirection:"column", overflow:"hidden" }}>
            <div style={{ padding:"16px 20px 12px", borderBottom:"1px solid #f2f2f2", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <button onClick={() => setSelected(null)} style={{ background:"none", border:"none", cursor:"pointer", color:"#555", fontSize:14, fontWeight:600 }}>← Geri</button>
              <span style={{ display:"inline-block", background:"#FFF1F2", color:"#EF4444", fontSize:11, fontWeight:700, borderRadius:20, padding:"4px 12px" }}>{selected.tag}</span>
            </div>
            <div style={{ overflowY:"auto", padding:"16px 20px 32px" }}>
              <div style={{ fontSize:36, marginBottom:12, textAlign:"center" }}>{selected.emoji}</div>
              <h2 style={{ fontSize:18, fontWeight:900, color:"#1a1a1a", lineHeight:1.35, marginBottom:16 }}>{selected.title}</h2>
              <p style={{ fontSize:15, color:"#444", lineHeight:1.8 }}>{selected.body}</p>
              <div style={{ marginTop:20, background:"#FFF1F2", borderRadius:14, padding:14, borderLeft:"3px solid #EF4444" }}>
                <div style={{ fontSize:11, fontWeight:800, color:"#EF4444", marginBottom:4 }}>⚠️ ÖNEMLİ</div>
                <div style={{ fontSize:13, color:"#555", lineHeight:1.6 }}>Bu makale bilgilendirme amaçlıdır. Sağlık sorunları için mutlaka veterinerinize başvurun.</div>
              </div>
              <button onClick={() => navigate("/yourpoodle/bilgi")}
                style={{ width:"100%", marginTop:16, height:48, borderRadius:14, border:"none", background:"linear-gradient(135deg,#EF4444,#F87171)", color:"#fff", fontSize:14, fontWeight:800, cursor:"pointer" }}>
                Belirti Kontrolü Aracı →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="saglik-hero" style={{ background:"linear-gradient(135deg,#EF4444,#F87171)", padding:"28px 24px 32px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-30, right:-20, width:120, height:120, borderRadius:"50%", background:"rgba(255,255,255,0.1)" }} />
        <div style={{ fontSize:40, marginBottom:10 }}>🏥</div>
        <div style={{ fontSize:26, fontWeight:900, color:"#fff", marginBottom:6 }}>Sağlık Rehberi</div>
        <div style={{ fontSize:14, color:"rgba(255,255,255,0.9)", lineHeight:1.5 }}>Poodle'ınızın sağlığını koruyun</div>
      </div>

      {/* Emergency signs */}
      <div style={{ padding:"20px 16px 0" }}>
        <div style={{ fontSize:15, fontWeight:800, color:"#1a1a1a", marginBottom:12 }}>🚨 Acil Durum Belirtileri</div>
        <div style={{ background:"#FFF1F2", borderRadius:16, padding:16, marginBottom:16 }}>
          <div className="saglik-warning-grid" style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {WARNING_SIGNS.map(({ sign, urgent }) => (
              <div key={sign} style={{ display:"flex", alignItems:"center", gap:10 }}>
                {urgent
                  ? <AlertTriangle size={16} color="#EF4444" style={{ flexShrink:0 }} />
                  : <CheckCircle2 size={16} color="#F59E0B" style={{ flexShrink:0 }} />
                }
                <span style={{ fontSize:13, color:urgent?"#EF4444":"#555", fontWeight:urgent?700:500 }}>{sign}</span>
                {urgent && <span style={{ fontSize:9, fontWeight:800, background:"#EF4444", color:"#fff", borderRadius:4, padding:"1px 5px", marginLeft:"auto", flexShrink:0 }}>ACİL</span>}
              </div>
            ))}
          </div>
          <button onClick={() => navigate("/yourpoodle/bilgi")}
            style={{ marginTop:14, width:"100%", height:42, borderRadius:10, border:"none", background:"#EF4444", color:"#fff", fontSize:13, fontWeight:800, cursor:"pointer" }}>
            Belirti Kontrol Aracını Aç 🩺
          </button>
        </div>
      </div>

      {/* Articles */}
      <div style={{ padding:"4px 16px 24px" }}>
        <div style={{ fontSize:16, fontWeight:800, color:"#1a1a1a", marginBottom:14 }}>📖 Sağlık Yazıları</div>
        <div className="yp-art-grid" style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {ARTICLES.map(a => (
            <button key={a.title} className="art-row-saglik" onClick={() => setSelected(a)}
              style={{ display:"flex", gap:12, alignItems:"center", padding:"12px", background:"#FAFAFA", borderRadius:14, cursor:"pointer", border:"none", textAlign:"left", width:"100%", transition:"background 0.15s" }}>
              <div style={{ width:52, height:52, borderRadius:12, background:"#FFF1F2", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>{a.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:10, fontWeight:700, color:"#EF4444", marginBottom:4 }}>{a.tag}</div>
                <div style={{ fontSize:13, fontWeight:700, color:"#1a1a1a", lineHeight:1.4, marginBottom:4 }}>{a.title}</div>
                <span style={{ fontSize:11, color:"#aaa", display:"flex", alignItems:"center", gap:3 }}><Clock size={10} strokeWidth={2} />{a.min} dk</span>
              </div>
              <ChevronRight size={16} color="#ccc" />
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ margin:"0 16px 32px", background:"#F0FDF4", borderRadius:18, padding:"20px", textAlign:"center" }}>
        <div style={{ fontSize:24, marginBottom:8 }}>💊</div>
        <div style={{ fontSize:14, fontWeight:800, color:"#1a1a1a", marginBottom:4 }}>Veteriner Ürünleri</div>
        <div style={{ fontSize:12, color:"#888", lineHeight:1.5, marginBottom:12 }}>Sağlık takviyeleri, iç ve dış parazit ürünleri.</div>
        <button onClick={() => navigate("/yourpoodle/magaza")}
          style={{ height:40, borderRadius:12, border:"none", background:"#22C55E", color:"#fff", fontSize:13, fontWeight:800, padding:"0 24px", cursor:"pointer" }}>
          Sağlık Ürünleri →
        </button>
      </div>
    </YPLayout>
  );
}
