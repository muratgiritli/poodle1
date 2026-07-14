import { useState } from "react";
import { Search, ShoppingBag, ChevronDown, Menu, X, Home, Users, BookOpen, Monitor, Clock, ChevronRight } from "lucide-react";

const LANGUAGES = [
  { code: "TR", flag: "🇹🇷" }, { code: "EN", flag: "🇺🇸" }, { code: "DE", flag: "🇩🇪" },
  { code: "FR", flag: "🇫🇷" }, { code: "RU", flag: "🇷🇺" }, { code: "AR", flag: "🇸🇦" },
];

const CATS = ["Tümü","Beslenme","Sağlık","Bakım","Eğitim","Davranış","Üreme"];

const ARTICLES = [
  { emoji:"🍖", cat:"Beslenme",  title:"Toy Poodle İçin En İyi Mama Markaları 2024",         min:5,  views:"2.4B",  featured:true  },
  { emoji:"✂️", cat:"Bakım",     title:"Evde Poodle Tıraşı: Adım Adım Rehber",               min:8,  views:"1.8B",  featured:true  },
  { emoji:"💊", cat:"Sağlık",    title:"Poodle'larda Görülen 10 Yaygın Sağlık Sorunu",       min:6,  views:"3.1B",  featured:false },
  { emoji:"🐾", cat:"Eğitim",    title:"Poodle'ınıza Temel Komutları Nasıl Öğretirsiniz?",   min:10, views:"980B",  featured:false },
  { emoji:"❤️", cat:"Davranış",  title:"Poodle Anksiyetesi: Belirtiler ve Çözüm Yolları",    min:7,  views:"1.2B",  featured:false },
  { emoji:"🏥", cat:"Sağlık",    title:"Poodle'larda Kalça Displazisi: Erken Teşhis",        min:9,  views:"760B",  featured:false },
  { emoji:"🛁", cat:"Bakım",     title:"Poodle Tüy Bakımı: Haftalık Rutin Rehberi",          min:5,  views:"1.5B",  featured:false },
  { emoji:"🥩", cat:"Beslenme",  title:"Yavru Poodle Beslenmesi: İlk 12 Ay",                 min:6,  views:"890B",  featured:false },
  { emoji:"🎓", cat:"Eğitim",    title:"Clicker Eğitimi ile Hızlı Öğrenme Teknikleri",       min:8,  views:"640B",  featured:false },
];

const DRAWER_LINKS = [
  "Ana Sayfa","Rehber","Bilgi Bankası","Mağaza","Mama","Eğitim","Sağlık","Bakım","Poodle Club",
];

function BottomNav({ active }: { active: string }) {
  return (
    <nav style={{ position:"fixed", bottom:0, left:0, right:0, background:"#fff", borderTop:"1px solid #f0f0f0", boxShadow:"0 -4px 20px rgba(0,0,0,0.08)", height:64, display:"flex", alignItems:"center", justifyContent:"space-around", zIndex:200, padding:"0 8px" }}>
      {[
        { label:"Ana Sayfa", href:"/", icon:<Home size={22} strokeWidth={2} /> },
        { label:"Club",      href:"/club", icon:<Users size={22} strokeWidth={2} /> },
      ].map(({ label, href, icon }) => (
        <a key={label} href={href} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, textDecoration:"none", flex:1, color: active===label ? "#7C3AFF" : "#aaa" }}>
          {icon}
          <span style={{ fontSize:10, fontWeight: active===label ? 800 : 700, fontFamily:"'Inter',sans-serif" }}>{label}</span>
          {active===label && <div style={{ width:20, height:2.5, borderRadius:2, background:"#7C3AFF" }} />}
        </a>
      ))}
      <a href="/sepet" style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, textDecoration:"none", flex:1, position:"relative" }}>
        <div style={{ width:54, height:54, borderRadius:"50%", background:"linear-gradient(135deg,#9B59FF,#7C3AFF)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 6px 20px rgba(124,58,255,0.4)", position:"absolute", top:-24 }}>
          <ShoppingBag size={24} color="#fff" strokeWidth={2.2} />
        </div>
        <span style={{ fontSize:10, fontWeight:700, color:"#aaa", fontFamily:"'Inter',sans-serif", marginTop:32 }}>Sepet</span>
      </a>
      {[
        { label:"Rehber",       href:"/rehber",       icon:<BookOpen size={22} strokeWidth={2} /> },
        { label:"Bilgi Bankası",href:"/bilgi-bankasi", icon:<Monitor size={22} strokeWidth={2} /> },
      ].map(({ label, href, icon }) => (
        <a key={label} href={href} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, textDecoration:"none", flex:1, color: active===label ? "#7C3AFF" : "#aaa" }}>
          {icon}
          <span style={{ fontSize:10, fontWeight: active===label ? 800 : 700, fontFamily:"'Inter',sans-serif" }}>{label}</span>
          {active===label && <div style={{ width:20, height:2.5, borderRadius:2, background:"#7C3AFF" }} />}
        </a>
      ))}
    </nav>
  );
}

export default function Rehber() {
  const [activeLang, setActiveLang] = useState(LANGUAGES[0]);
  const [langOpen, setLangOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeCat, setActiveCat] = useState("Tümü");
  const [search, setSearch] = useState("");

  const filtered = ARTICLES.filter(a =>
    (activeCat === "Tümü" || a.cat === activeCat) &&
    (search === "" || a.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'); *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;} body{background:#fff;} .noscroll::-webkit-scrollbar{display:none;} .noscroll{-ms-overflow-style:none;scrollbar-width:none;} .icon-btn{background:none;border:none;cursor:pointer;display:flex;align-items:center;padding:6px;border-radius:8px;}`}</style>

      <div style={{ minHeight:"100vh", background:"#fff", fontFamily:"'Inter',sans-serif", paddingBottom:80 }}>

        {/* DRAWER */}
        {drawerOpen && <div onClick={() => setDrawerOpen(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.3)", zIndex:199 }} />}
        <div style={{ position:"fixed", top:0, right:0, height:"100%", width:280, background:"#fff", zIndex:200, transform: drawerOpen ? "translateX(0)" : "translateX(100%)", transition:"transform 0.24s ease", boxShadow:"-4px 0 24px rgba(0,0,0,0.12)" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 18px 14px", borderBottom:"1px solid #f2f2f2" }}>
            <img src="/__mockup/images/yourpoodle-logo.jpg" alt="YourPoodle" style={{ height:32, objectFit:"contain" }} />
            <button className="icon-btn" onClick={() => setDrawerOpen(false)}><X size={20} color="#444" /></button>
          </div>
          <nav>{DRAWER_LINKS.map(l => <a key={l} href={`/${l.toLowerCase().replace(/\s/g,"-")}`} style={{ display:"block", padding:"14px 20px", fontSize:15, fontWeight:600, color:"#222", textDecoration:"none", borderBottom:"1px solid #fafafa" }}>{l}</a>)}</nav>
        </div>

        {/* HEADER */}
        <header style={{ position:"sticky", top:0, zIndex:100, background:"#fff", borderBottom:"1px solid #f0f0f0" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px" }}>
            <img src="/__mockup/images/yourpoodle-logo.jpg" alt="YourPoodle" style={{ height:36, width:160, objectFit:"contain", objectPosition:"left center" }} />
            <div style={{ display:"flex", alignItems:"center", gap:4 }}>
              <button className="icon-btn"><Search size={21} color="#333" strokeWidth={2} /></button>
              <button className="icon-btn"><ShoppingBag size={21} color="#333" strokeWidth={2} /></button>
              <div style={{ position:"relative" }}>
                <button className="icon-btn" onClick={() => setLangOpen(!langOpen)} style={{ gap:4, padding:"5px 8px" }}>
                  <span style={{ fontSize:15 }}>{activeLang.flag}</span>
                  <span style={{ fontSize:13, fontWeight:700, color:"#6C47FF" }}>{activeLang.code}</span>
                  <ChevronDown size={13} color="#6C47FF" strokeWidth={2.5} style={{ transform: langOpen ? "rotate(180deg)" : "none", transition:"transform 0.18s" }} />
                </button>
                {langOpen && (
                  <div style={{ position:"absolute", right:0, top:38, background:"#fff", borderRadius:12, border:"1px solid #eee", boxShadow:"0 8px 28px rgba(0,0,0,0.12)", zIndex:150, minWidth:110, padding:"4px 0" }}>
                    {LANGUAGES.map(l => <button key={l.code} onClick={() => { setActiveLang(l); setLangOpen(false); }} style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"9px 14px", border:"none", background: activeLang.code===l.code ? "#F5F0FF" : "transparent", cursor:"pointer", fontSize:13, fontWeight:700, color: activeLang.code===l.code ? "#6C47FF" : "#333", fontFamily:"'Inter',sans-serif" }}><span style={{ fontSize:16 }}>{l.flag}</span>{l.code}</button>)}
                  </div>
                )}
              </div>
              <button className="icon-btn" onClick={() => setDrawerOpen(true)}><Menu size={22} color="#333" strokeWidth={2} /></button>
            </div>
          </div>
          <div style={{ display:"flex", borderTop:"1px solid #f0f0f0" }}>
            {[{label:"Ana Sayfa",href:"/"},{label:"Rehber",href:"/rehber"},{label:"Bilgi Bankası",href:"/bilgi"},{label:"Mağaza",href:"/magaza"}].map(t => (
              <a key={t.label} href={t.href} style={{ flex:1, padding:"11px 4px", fontSize:13.5, fontWeight: t.label==="Rehber" ? 700 : 500, color: t.label==="Rehber" ? "#6C47FF" : "#555", borderBottom: t.label==="Rehber" ? "2.5px solid #6C47FF" : "2.5px solid transparent", textAlign:"center", textDecoration:"none", display:"block" }}>{t.label}</a>
            ))}
          </div>
        </header>

        {/* PAGE TITLE */}
        <div style={{ padding:"20px 16px 0" }}>
          <h1 style={{ fontSize:22, fontWeight:900, color:"#1a1a1a", marginBottom:4 }}>📖 Rehber</h1>
          <p style={{ fontSize:13, color:"#888" }}>Toy Poodle'ınız için kapsamlı içerikler</p>
        </div>

        {/* SEARCH */}
        <div style={{ padding:"14px 16px 0" }}>
          <div style={{ display:"flex", alignItems:"center", background:"#F7F7F7", border:"1.5px solid #ececec", borderRadius:14, height:48, overflow:"hidden" }}>
            <div style={{ paddingLeft:14, color:"#bbb", display:"flex" }}><Search size={18} strokeWidth={2} /></div>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Makale ara..." style={{ flex:1, border:"none", outline:"none", fontSize:13.5, fontWeight:600, color:"#333", background:"transparent", padding:"0 10px", fontFamily:"'Inter',sans-serif" }} />
          </div>
        </div>

        {/* CATEGORY CHIPS */}
        <div style={{ padding:"12px 16px 0" }}>
          <div className="noscroll" style={{ display:"flex", gap:8, overflowX:"auto" }}>
            {CATS.map(c => (
              <button key={c} onClick={() => setActiveCat(c)} style={{ flexShrink:0, padding:"7px 16px", borderRadius:20, border:"1.5px solid", borderColor: activeCat===c ? "#7C3AFF" : "#e8e8e8", background: activeCat===c ? "#7C3AFF" : "#fff", color: activeCat===c ? "#fff" : "#555", fontSize:12.5, fontWeight:700, cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>{c}</button>
            ))}
          </div>
        </div>

        {/* FEATURED */}
        {activeCat === "Tümü" && search === "" && (
          <div style={{ padding:"16px 16px 0" }}>
            <div style={{ background:"linear-gradient(135deg,#EDE8FF,#F5F0FF)", borderRadius:18, padding:"18px", display:"flex", gap:14, alignItems:"center", cursor:"pointer" }}>
              <div style={{ width:64, height:64, borderRadius:16, background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, flexShrink:0 }}>🍖</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:10, fontWeight:800, color:"#7C3AFF", letterSpacing:"0.06em", marginBottom:5 }}>ÖNE ÇIKAN</div>
                <div style={{ fontSize:15, fontWeight:800, color:"#1a1a1a", lineHeight:1.35, marginBottom:6 }}>Toy Poodle İçin En İyi Mama Markaları 2024</div>
                <div style={{ display:"flex", gap:12 }}>
                  <span style={{ fontSize:11, color:"#888", display:"flex", alignItems:"center", gap:3 }}><Clock size={11} strokeWidth={2} /> 5 dk</span>
                  <span style={{ fontSize:11, color:"#888" }}>👁 2.4B görüntülenme</span>
                </div>
              </div>
              <ChevronRight size={18} color="#7C3AFF" />
            </div>
          </div>
        )}

        {/* ARTICLE LIST */}
        <div style={{ padding:"16px 16px 0", display:"flex", flexDirection:"column", gap:12 }}>
          {filtered.filter(a => !a.featured || activeCat !== "Tümü" || search !== "").map(a => (
            <div key={a.title} style={{ display:"flex", gap:12, alignItems:"center", padding:"12px", background:"#FAFAFA", borderRadius:14, cursor:"pointer" }}>
              <div style={{ width:52, height:52, borderRadius:12, background:"#EDE8FF", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>{a.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:10, fontWeight:700, color:"#7C3AFF", marginBottom:4 }}>{a.cat}</div>
                <div style={{ fontSize:13, fontWeight:700, color:"#1a1a1a", lineHeight:1.4, marginBottom:5 }}>{a.title}</div>
                <div style={{ display:"flex", gap:10 }}>
                  <span style={{ fontSize:11, color:"#aaa", display:"flex", alignItems:"center", gap:3 }}><Clock size={11} strokeWidth={2} />{a.min} dk</span>
                  <span style={{ fontSize:11, color:"#aaa" }}>👁 {a.views}</span>
                </div>
              </div>
              <ChevronRight size={16} color="#ccc" />
            </div>
          ))}
        </div>

      </div>
      <BottomNav active="Rehber" />
    </>
  );
}
