import { useState } from "react";
import { Search, ShoppingBag, ChevronDown, Menu, X, Home, Users, BookOpen, Monitor, ChevronLeft, RotateCcw } from "lucide-react";

const LANGUAGES = [{ code:"TR", flag:"🇹🇷" },{ code:"EN", flag:"🇺🇸" }];

const TOOLS = [
  { id:"mama",    emoji:"🍖", label:"Mama Hesaplama",   desc:"Günlük mama miktarını hesapla",       bg:"#FFF0E0", color:"#E07820" },
  { id:"asi",     emoji:"💉", label:"Aşı Takvimi",      desc:"Aşılarını düzenli takip et",          bg:"#FFE4EC", color:"#E75480" },
  { id:"yas",     emoji:"🎂", label:"Yaş Hesaplama",    desc:"Köpek yaşını insan yaşına çevir",     bg:"#F0E8FF", color:"#7C3AFF" },
  { id:"kilo",    emoji:"⚖️", label:"İdeal Kilo",       desc:"İdeal kilosunu öğren",                bg:"#D6F5E8", color:"#059669" },
  { id:"hastalik",emoji:"🩺", label:"Hastalık Kontrolü",desc:"Belirtileri kontrol et",              bg:"#EDE8FF", color:"#7C3AFF" },
  { id:"dis",     emoji:"😁", label:"Diş Kontrolü",     desc:"Ağız ve diş sağlığı listesi",        bg:"#D6F5F5", color:"#0891B2" },
  { id:"diski",   emoji:"📊", label:"Dışkı Rehberi",    desc:"Rengine göre kontrol et",             bg:"#FEFCE8", color:"#CA8A04" },
  { id:"su",      emoji:"💧", label:"Su Hesaplama",     desc:"Günlük su ihtiyacını hesapla",        bg:"#DBEAFE", color:"#2563EB" },
  { id:"tiras",   emoji:"✂️", label:"Tıraş Zamanı",    desc:"Son tıraş tarihine göre hesapla",    bg:"#FFE4EC", color:"#E75480" },
  { id:"odul",    emoji:"🦴", label:"Ödül Hesabı",      desc:"Ödül mamasının kalorini hesapla",    bg:"#FFF9C4", color:"#CA8A04" },
  { id:"aktivite",emoji:"🏃", label:"Aktivite Hesabı",  desc:"Günlük egzersiz ihtiyacını öğren",   bg:"#CCFBF1", color:"#0D9488" },
  { id:"insanyas",emoji:"🐕", label:"İnsan Yaşı",       desc:"Karşılaştırmalı yaş tablosu",        bg:"#FFF0E0", color:"#E07820" },
];

function MamaCalculator({ onBack }: { onBack: () => void }) {
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("yetiskin");
  const [activity, setActivity] = useState("orta");
  const [result, setResult] = useState<number|null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    if (isNaN(w)) return;
    let base = w * 30 + 70;
    if (age === "yavru") base *= 2;
    if (activity === "dusuk") base *= 0.9;
    if (activity === "yuksek") base *= 1.2;
    setResult(Math.round(base / 3.5));
  };

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:12, padding:"16px 16px 0", marginBottom:16 }}>
        <button onClick={onBack} style={{ background:"#F5F5F5", border:"none", borderRadius:10, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
          <ChevronLeft size={18} color="#333" />
        </button>
        <div>
          <div style={{ fontSize:17, fontWeight:800, color:"#1a1a1a" }}>🍖 Mama Hesaplama</div>
          <div style={{ fontSize:12, color:"#888" }}>Günlük mama miktarını hesapla</div>
        </div>
      </div>

      <div style={{ padding:"0 16px", display:"flex", flexDirection:"column", gap:16 }}>
        <div style={{ background:"#FFF0E0", borderRadius:16, padding:"16px" }}>
          <label style={{ fontSize:12, fontWeight:700, color:"#E07820", display:"block", marginBottom:8 }}>Poodle'ın kilosu (kg)</label>
          <input type="number" value={weight} onChange={e=>setWeight(e.target.value)} placeholder="Örn: 3.5" style={{ width:"100%", height:48, borderRadius:12, border:"2px solid #E07820", padding:"0 14px", fontSize:16, fontWeight:700, outline:"none", fontFamily:"'Inter',sans-serif", background:"#fff" }} />
        </div>

        <div style={{ background:"#FAFAFA", borderRadius:16, padding:"16px" }}>
          <label style={{ fontSize:12, fontWeight:700, color:"#555", display:"block", marginBottom:10 }}>Yaş grubu</label>
          <div style={{ display:"flex", gap:8 }}>
            {[["yavru","🐶 Yavru (0-1 yaş)"],["yetiskin","🐕 Yetişkin (1-7 yaş)"],["yasli","🦮 Yaşlı (7+ yaş)"]].map(([v,l])=>(
              <button key={v} onClick={()=>setAge(v)} style={{ flex:1, padding:"10px 4px", borderRadius:10, border:"2px solid", borderColor:age===v?"#E07820":"#e8e8e8", background:age===v?"#FFF0E0":"#fff", fontSize:10.5, fontWeight:700, color:age===v?"#E07820":"#555", cursor:"pointer", fontFamily:"'Inter',sans-serif", lineHeight:1.4 }}>{l}</button>
            ))}
          </div>
        </div>

        <div style={{ background:"#FAFAFA", borderRadius:16, padding:"16px" }}>
          <label style={{ fontSize:12, fontWeight:700, color:"#555", display:"block", marginBottom:10 }}>Aktivite seviyesi</label>
          <div style={{ display:"flex", gap:8 }}>
            {[["dusuk","😴 Düşük"],["orta","🚶 Orta"],["yuksek","🏃 Yüksek"]].map(([v,l])=>(
              <button key={v} onClick={()=>setActivity(v)} style={{ flex:1, padding:"10px 4px", borderRadius:10, border:"2px solid", borderColor:activity===v?"#7C3AFF":"#e8e8e8", background:activity===v?"#EDE8FF":"#fff", fontSize:12, fontWeight:700, color:activity===v?"#7C3AFF":"#555", cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>{l}</button>
            ))}
          </div>
        </div>

        <button onClick={calculate} style={{ height:52, borderRadius:16, border:"none", background:"linear-gradient(135deg,#E07820,#F59E0B)", color:"#fff", fontSize:15, fontWeight:800, cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>
          Hesapla
        </button>

        {result !== null && (
          <div style={{ background:"linear-gradient(135deg,#FFF0E0,#FFF9C4)", borderRadius:18, padding:"20px", textAlign:"center", border:"2px solid #E07820" }}>
            <div style={{ fontSize:13, color:"#888", marginBottom:4 }}>Günlük önerilen mama miktarı</div>
            <div style={{ fontSize:48, fontWeight:900, color:"#E07820" }}>{result}g</div>
            <div style={{ fontSize:12, color:"#888", marginTop:8, lineHeight:1.5 }}>
              Bu miktar yaklaşık değerdir.<br />Mama markasının talimatlarını da göz önünde bulundurun.
            </div>
            <button onClick={()=>setResult(null)} style={{ marginTop:12, display:"inline-flex", alignItems:"center", gap:6, background:"none", border:"none", color:"#E07820", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>
              <RotateCcw size={13} /> Yeniden Hesapla
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function BottomNav() {
  return (
    <nav style={{ position:"fixed",bottom:0,left:0,right:0,background:"#fff",borderTop:"1px solid #f0f0f0",boxShadow:"0 -4px 20px rgba(0,0,0,0.08)",height:64,display:"flex",alignItems:"center",justifyContent:"space-around",zIndex:200,padding:"0 8px" }}>
      {[{label:"Ana Sayfa",icon:<Home size={22} strokeWidth={2}/>},{label:"Club",icon:<Users size={22} strokeWidth={2}/>}].map(({label,icon})=>(
        <a key={label} href="/" style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:3,textDecoration:"none",flex:1,color:"#aaa" }}>{icon}<span style={{ fontSize:10,fontWeight:700,fontFamily:"'Inter',sans-serif" }}>{label}</span></a>
      ))}
      <a href="/sepet" style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:3,textDecoration:"none",flex:1,position:"relative" }}>
        <div style={{ width:54,height:54,borderRadius:"50%",background:"linear-gradient(135deg,#9B59FF,#7C3AFF)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 6px 20px rgba(124,58,255,0.4)",position:"absolute",top:-24 }}>
          <ShoppingBag size={24} color="#fff" strokeWidth={2.2}/>
        </div>
        <span style={{ fontSize:10,fontWeight:700,color:"#aaa",fontFamily:"'Inter',sans-serif",marginTop:32 }}>Sepet</span>
      </a>
      {[{label:"Rehber",icon:<BookOpen size={22} strokeWidth={2}/>},{label:"Bilgi Bankası",icon:<Monitor size={22} strokeWidth={2}/>}].map(({label,icon})=>(
        <a key={label} href="/" style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:3,textDecoration:"none",flex:1,color:label==="Bilgi Bankası"?"#7C3AFF":"#aaa" }}>{icon}<span style={{ fontSize:10,fontWeight:label==="Bilgi Bankası"?800:700,fontFamily:"'Inter',sans-serif" }}>{label}</span>{label==="Bilgi Bankası"&&<div style={{ width:20,height:2.5,borderRadius:2,background:"#7C3AFF" }}/>}</a>
      ))}
    </nav>
  );
}

export default function BilgiBankasi() {
  const [activeLang, setActiveLang] = useState(LANGUAGES[0]);
  const [langOpen, setLangOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<string|null>(null);
  const [search, setSearch] = useState("");

  const filtered = TOOLS.filter(t => search === "" || t.label.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'); *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;} body{background:#fff;} .icon-btn{background:none;border:none;cursor:pointer;display:flex;align-items:center;padding:6px;border-radius:8px;} .tool-card:active{transform:scale(0.94);} .tool-card{transition:transform 0.12s;}`}</style>

      <div style={{ minHeight:"100vh", background:"#fff", fontFamily:"'Inter',sans-serif", paddingBottom:80 }}>

        {drawerOpen && <div onClick={()=>setDrawerOpen(false)} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.3)",zIndex:199 }}/>}
        <div style={{ position:"fixed",top:0,right:0,height:"100%",width:280,background:"#fff",zIndex:200,transform:drawerOpen?"translateX(0)":"translateX(100%)",transition:"transform 0.24s ease",boxShadow:"-4px 0 24px rgba(0,0,0,0.12)" }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 18px 14px",borderBottom:"1px solid #f2f2f2" }}>
            <img src="/images/yourpoodle-logo.jpg" alt="YourPoodle" style={{ height:32,objectFit:"contain" }}/>
            <button className="icon-btn" onClick={()=>setDrawerOpen(false)}><X size={20} color="#444"/></button>
          </div>
          <nav>{["Ana Sayfa","Club","Rehber","Bilgi Bankası","Mağaza"].map(l=><a key={l} href="/" style={{ display:"block",padding:"14px 20px",fontSize:15,fontWeight:600,color:"#222",textDecoration:"none",borderBottom:"1px solid #fafafa" }}>{l}</a>)}</nav>
        </div>

        <header style={{ position:"sticky",top:0,zIndex:100,background:"#fff",borderBottom:"1px solid #f0f0f0" }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px" }}>
            <img src="/images/yourpoodle-logo.jpg" alt="YourPoodle" style={{ height:36,width:160,objectFit:"contain",objectPosition:"left center" }}/>
            <div style={{ display:"flex",alignItems:"center",gap:4 }}>
              <button className="icon-btn"><Search size={21} color="#333" strokeWidth={2}/></button>
              <button className="icon-btn"><ShoppingBag size={21} color="#333" strokeWidth={2}/></button>
              <div style={{ position:"relative" }}>
                <button className="icon-btn" onClick={()=>setLangOpen(!langOpen)} style={{ gap:4,padding:"5px 8px" }}>
                  <span style={{ fontSize:15 }}>{activeLang.flag}</span>
                  <span style={{ fontSize:13,fontWeight:700,color:"#6C47FF" }}>{activeLang.code}</span>
                  <ChevronDown size={13} color="#6C47FF" strokeWidth={2.5}/>
                </button>
                {langOpen&&<div style={{ position:"absolute",right:0,top:38,background:"#fff",borderRadius:12,border:"1px solid #eee",boxShadow:"0 8px 28px rgba(0,0,0,0.12)",zIndex:150,minWidth:110,padding:"4px 0" }}>{LANGUAGES.map(l=><button key={l.code} onClick={()=>{setActiveLang(l);setLangOpen(false);}} style={{ display:"flex",alignItems:"center",gap:8,width:"100%",padding:"9px 14px",border:"none",background:"transparent",cursor:"pointer",fontSize:13,fontWeight:700,color:"#333",fontFamily:"'Inter',sans-serif" }}><span style={{ fontSize:16 }}>{l.flag}</span>{l.code}</button>)}</div>}
              </div>
              <button className="icon-btn" onClick={()=>setDrawerOpen(true)}><Menu size={22} color="#333" strokeWidth={2}/></button>
            </div>
          </div>
          <div style={{ display:"flex",borderTop:"1px solid #f0f0f0" }}>
            {[{label:"Ana Sayfa",href:"/"},{label:"Rehber",href:"/rehber"},{label:"Bilgi Bankası",href:"/bilgi"},{label:"Mağaza",href:"/magaza"}].map(t=>(
              <a key={t.label} href={t.href} style={{ flex:1,padding:"11px 4px",fontSize:13.5,fontWeight:t.label==="Bilgi Bankası"?700:500,color:t.label==="Bilgi Bankası"?"#6C47FF":"#555",borderBottom:t.label==="Bilgi Bankası"?"2.5px solid #6C47FF":"2.5px solid transparent",textAlign:"center",textDecoration:"none",display:"block" }}>{t.label}</a>
            ))}
          </div>
        </header>

        {activeTool === "mama" ? (
          <MamaCalculator onBack={() => setActiveTool(null)} />
        ) : (
          <>
            <div style={{ padding:"20px 16px 0" }}>
              <h1 style={{ fontSize:22, fontWeight:900, color:"#1a1a1a", marginBottom:4 }}>⚡ Bilgi Bankası</h1>
              <p style={{ fontSize:13, color:"#888", marginBottom:14 }}>Poodle'ınız için en çok kullanılan araçlar</p>
              <div style={{ display:"flex", alignItems:"center", background:"#F7F7F7", border:"1.5px solid #ececec", borderRadius:14, height:48, overflow:"hidden", marginBottom:20 }}>
                <div style={{ paddingLeft:14, color:"#bbb", display:"flex" }}><Search size={18} strokeWidth={2}/></div>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Araç ara..." style={{ flex:1,border:"none",outline:"none",fontSize:13.5,fontWeight:600,color:"#333",background:"transparent",padding:"0 10px",fontFamily:"'Inter',sans-serif" }}/>
              </div>
            </div>
            <div style={{ padding:"0 16px 24px", display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"20px 8px" }}>
              {filtered.map(t => (
                <button key={t.id} className="tool-card" onClick={()=>setActiveTool(t.id)} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:8,background:"none",border:"none",cursor:"pointer",padding:0,textAlign:"center" }}>
                  <div style={{ width:60,height:60,borderRadius:"50%",background:t.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>{t.emoji}</div>
                  <div>
                    <div style={{ fontSize:11.5,fontWeight:800,color:"#1a1a1a",lineHeight:1.3,marginBottom:3 }}>{t.label}</div>
                    <div style={{ fontSize:10,color:"#888",lineHeight:1.35 }}>{t.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

      </div>
      <BottomNav />
    </>
  );
}
