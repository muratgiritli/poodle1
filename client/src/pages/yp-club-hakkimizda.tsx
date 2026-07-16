// /yourpoodle/club/hakkimizda — Club hakkında + SSS (SEO içeriği)
import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronRight } from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";

const SSS = [
  { q:"YourPoodle Club nedir?",         a:"YourPoodle Club, Türkiye'nin poodle sahiplerini bir araya getiren ücretsiz sosyal platformdur. 500+ üye fotoğraf paylaşır, deneyim aktarır ve etkinliklere katılır." },
  { q:"Club'a katılım ücretsiz mi?",   a:"Evet, tamamen ücretsizdir. Gizli ücret yoktur. Kayıt için sadece bir e-posta adresi yeterlidir." },
  { q:"Kimler katılabilir?",            a:"Poodle sahibi olan veya poodle'lara ilgi duyan herkes katılabilir. Toy, Miniature, Moyen veya Standard Poodle sahibi olmanız yeterli." },
  { q:"Ne tür içerik paylaşılabilir?",  a:"Poodle fotoğrafları, bakım deneyimleri, mama önerileri, sağlık soruları, tıraş modelleri ve etkinlik duyuruları paylaşılabilir." },
  { q:"Etkinliklere nereden katılırım?",a:"Etkinlik sekmesinden yaklaşan buluşmaları, online webinarları ve yarışmaları görebilir, katıl butonuyla yerinizi ayırtabilirsiniz." },
];

export default function ClubHakkimizda() {
  const [, navigate] = useLocation();
  const [expanded, setExpanded] = useState<number|null>(null);

  return (
    <YPLayout activeLink="/yourpoodle/club">
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        .sss-answer { overflow:hidden; transition:max-height 0.28s ease, padding 0.28s ease; }
      `}</style>

      {/* Mini header */}
      <div style={{ background:"#fff", borderBottom:"1px solid #E5E7EB", padding:"10px 16px", display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#7C3AED,#A855F7)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontSize:18 }}>🐩</span>
        </div>
        <span style={{ fontSize:15, fontWeight:900, color:"#1A1A1A" }}>Poodle Club</span>
      </div>

      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" style={{ padding:"10px 16px", display:"flex", gap:4, alignItems:"center", fontSize:12, color:"#9CA3AF", background:"#fff", borderBottom:"1px solid #F3F4F6" }}>
        <a href="/yourpoodle" style={{ color:"#7C3AED", textDecoration:"none", fontWeight:600 }}>Ana Sayfa</a>
        <ChevronRight size={11}/>
        <a href="/yourpoodle/club" style={{ color:"#7C3AED", textDecoration:"none", fontWeight:600 }}>Poodle Club</a>
        <ChevronRight size={11}/>
        <span style={{ color:"#374151", fontWeight:600 }}>Hakkımızda</span>
      </nav>

      <div style={{ background:"#FAFAF8", minHeight:"100vh", fontFamily:"Inter,sans-serif", paddingBottom:80 }}>
        <div style={{ padding:"20px 16px 0" }}>

          {/* Hero */}
          <div style={{ background:"linear-gradient(135deg,#7C3AED,#A855F7)", borderRadius:18, padding:"24px 20px", marginBottom:24, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:-20, right:-20, width:100, height:100, borderRadius:"50%", background:"rgba(255,255,255,0.08)" }}/>
            <h1 style={{ fontSize:22, fontWeight:900, color:"#fff", marginBottom:6 }}>Poodle Club Nedir?</h1>
            <p style={{ fontSize:13.5, color:"rgba(255,255,255,0.88)", lineHeight:1.6, margin:0 }}>
              Türkiye'nin en büyük poodle sahipleri sosyal platformu. 50+ şehirden 500+ üye.
            </p>
            <div style={{ display:"flex", gap:20, marginTop:16 }}>
              {[["500+","Aktif Üye"],["1.200+","Paylaşım"],["50+","Şehir"],["Ücretsiz","Her zaman"]].map(([n,l])=>(
                <div key={l}>
                  <div style={{ fontSize:15, fontWeight:900, color:"#fff" }}>{n}</div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.7)" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hakkında */}
          <section style={{ background:"#fff", borderRadius:16, border:"1px solid #E5E7EB", padding:"20px", marginBottom:20 }}>
            <h2 style={{ fontSize:17, fontWeight:800, color:"#1A1A1A", marginBottom:12 }}>Nasıl Katılırım?</h2>
            <ol style={{ paddingLeft:0, listStyle:"none", margin:0 }}>
              {[
                ["1", "Üye Olun", "\"Ücretsiz Başla\" butonuyla saniyeler içinde kayıt olun. E-posta adresiniz yeterli."],
                ["2", "Poodle Profilini Oluşturun", "Poodle'ınızın adı, fotoğrafı, yaşı ve bilgilerini ekleyin. Diğer üyeler poodle'ınızla tanışabilir."],
                ["3", "Topluluğa Katılın", "Paylaşım yapın, etkinliklere katılın, deneyim aktarın. Toy Poodle arkadaşlığı kurun."],
              ].map(([num, title, desc]) => (
                <li key={num} style={{ display:"flex", gap:14, alignItems:"flex-start", marginBottom:16 }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", background:"#EDE8FF", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:15, fontWeight:900, color:"#7C3AED" }}>{num}</div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:800, color:"#1A1A1A", marginBottom:3 }}>{title}</div>
                    <div style={{ fontSize:13, color:"#6B7280", lineHeight:1.6 }}>{desc}</div>
                  </div>
                </li>
              ))}
            </ol>
            <button onClick={() => navigate("/yourpoodle/giris")}
              style={{ width:"100%", height:48, borderRadius:12, border:"none", background:"#7C3AED", color:"#fff", fontSize:14, fontWeight:800, cursor:"pointer" }}>
              Ücretsiz Katıl →
            </button>
          </section>

          {/* Özellikler */}
          <section style={{ background:"#fff", borderRadius:16, border:"1px solid #E5E7EB", padding:"20px", marginBottom:20 }}>
            <h2 style={{ fontSize:17, fontWeight:800, color:"#1A1A1A", marginBottom:14 }}>Club Özellikleri</h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {[
                { icon:"📸", title:"Fotoğraf Paylaşımı", desc:"Poodle'ınızın anlarını paylaşın" },
                { icon:"🐩", title:"Poodle Profilleri",  desc:"500+ Poodle profil dizini" },
                { icon:"📅", title:"Etkinlikler",         desc:"Buluşma, yarışma, webinar" },
                { icon:"🤖", title:"AI Asistan",           desc:"7/24 uzman Poodle desteği" },
                { icon:"🍖", title:"Mama Önerileri",      desc:"Yaşa göre mama önerileri" },
                { icon:"✂️", title:"Bakım Rehberi",       desc:"Tıraş ve bakım ipuçları" },
              ].map(f => (
                <div key={f.title} style={{ background:"#F9FAFB", borderRadius:12, padding:"14px 12px", border:"1px solid #E5E7EB" }}>
                  <div style={{ fontSize:22, marginBottom:6 }}>{f.icon}</div>
                  <div style={{ fontSize:13, fontWeight:800, color:"#1A1A1A", marginBottom:2 }}>{f.title}</div>
                  <div style={{ fontSize:11.5, color:"#9CA3AF", lineHeight:1.5 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* SSS */}
          <section style={{ background:"#fff", borderRadius:16, border:"1px solid #E5E7EB", overflow:"hidden", marginBottom:20 }}>
            <h2 style={{ fontSize:17, fontWeight:800, color:"#1A1A1A", padding:"18px 20px 14px", margin:0, borderBottom:"1px solid #F3F4F6" }}>Sık Sorulan Sorular</h2>
            {SSS.map((s, i) => {
              const open = expanded === i;
              return (
                <div key={i} style={{ borderBottom:i<SSS.length-1?"1px solid #F3F4F6":"none" }}>
                  <button onClick={() => setExpanded(open ? null : i)} aria-expanded={open}
                    style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px", background:"none", border:"none", cursor:"pointer", textAlign:"left", gap:10 }}>
                    <span style={{ fontSize:13.5, fontWeight:700, color:"#1A1A1A", lineHeight:1.4 }}>S: {s.q}</span>
                    <span style={{ fontSize:16, color:"#7C3AED", flexShrink:0 }} aria-hidden="true">{open?"−":"+"}</span>
                  </button>
                  <div className="sss-answer" style={{ maxHeight:open?"300px":"0", padding:open?"0 20px 14px":"0 20px" }}>
                    <p style={{ fontSize:13.5, color:"#4B5563", lineHeight:1.7, margin:0 }}>
                      <span style={{ fontWeight:700, color:"#7C3AED" }}>C: </span>{s.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Son paylaşımlar — SEO için crawler-visible */}
          <section aria-label="Son paylaşımlardan örnekler" style={{ background:"#fff", borderRadius:16, border:"1px solid #E5E7EB", padding:"18px 20px", marginBottom:20 }}>
            <h2 style={{ fontSize:15, fontWeight:800, color:"#1A1A1A", marginBottom:12 }}>Son Paylaşımlardan</h2>
            {[
              { author:"poodlemom_ayse",  poodle:"Mocha",   text:"Mocha bugün tıraş oldu! Müthiş görünüyor. #tiras #bakim" },
              { author:"poodle_selin",    poodle:"Biscuit", text:"Biscuit 1 yaşına girdi! Tuvalet eğitimini de bu ay tamamladı." },
              { author:"miniaturist_can", poodle:"Coco",    text:"Royal Canin Toy Breed'den çok memnunuz. #mama #beslenme" },
            ].map(p => (
              <div key={p.author} style={{ marginBottom:10, padding:"10px 12px", background:"#F9FAFB", borderRadius:12, border:"1px solid #E5E7EB" }}>
                <div style={{ fontSize:11, color:"#7C3AED", fontWeight:700, marginBottom:3 }}>@{p.author} · {p.poodle}</div>
                <p style={{ fontSize:13, color:"#374151", lineHeight:1.55, margin:0 }}>{p.text}</p>
              </div>
            ))}
            <button onClick={() => navigate("/yourpoodle/club")}
              style={{ marginTop:8, width:"100%", height:42, borderRadius:12, border:"1.5px solid #E5E7EB", background:"#fff", color:"#7C3AED", fontSize:13, fontWeight:700, cursor:"pointer" }}>
              Tüm Paylaşımları Gör →
            </button>
          </section>

        </div>

        {/* Footer */}
        <footer style={{ borderTop:"1px solid #E5E7EB", padding:"16px", background:"#fff", textAlign:"center" }}>
          <div style={{ fontSize:12.5, color:"#9CA3AF", display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <a href="/yourpoodle/club" style={{ color:"#7C3AED", fontWeight:700, textDecoration:"none" }}>← Club'a Dön</a>
            <a href="/yourpoodle/gizlilik-politikasi" style={{ color:"#9CA3AF", textDecoration:"none" }}>Gizlilik</a>
            <a href="/yourpoodle/kullanim-sartlari" style={{ color:"#9CA3AF", textDecoration:"none" }}>Kullanım Koşulları</a>
          </div>
        </footer>
      </div>
    </YPLayout>
  );
}
