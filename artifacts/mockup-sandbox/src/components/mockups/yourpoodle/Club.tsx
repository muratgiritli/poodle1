import { useState } from "react";
import { Search, ShoppingBag, ChevronDown, Menu, X, Home, Users, BookOpen, Monitor, Check, Star, Crown } from "lucide-react";

const LANGUAGES = [
  { code: "TR", flag: "🇹🇷" }, { code: "EN", flag: "🇺🇸" }, { code: "DE", flag: "🇩🇪" },
];

const MEMBERS = [
  { emoji:"🐩", name:"poodlemom_ayse",  city:"İstanbul", poodle:"Mocha", since:"2023" },
  { emoji:"🐾", name:"toypoodle_mert",  city:"Ankara",   poodle:"Luna",  since:"2022" },
  { emoji:"💜", name:"poodle_selin",    city:"İzmir",    poodle:"Biscuit",since:"2024" },
  { emoji:"🌸", name:"miniaturist_can", city:"Bursa",    poodle:"Coco",  since:"2023" },
];

const PLANS = [
  {
    name:"Ücretsiz", price:"₺0", period:"/ay", color:"#888", bg:"#F9F9F9", badge:"",
    features:["Rehber makalelerine erişim","Topluluk paylaşımları","Bilgi bankası araçları","Etkinlik takvimi"],
  },
  {
    name:"Premium", price:"₺89", period:"/ay", color:"#7C3AFF", bg:"linear-gradient(135deg,#EDE8FF,#F5F0FF)", badge:"En Popüler",
    features:["Tüm ücretsiz özellikler","Sınırsız makale erişimi","Haftalık uzman Q&A","Özel indirim kuponu %10","Club rozeti profilde"],
  },
  {
    name:"Elite", price:"₺189", period:"/ay", color:"#D97706", bg:"linear-gradient(135deg,#FFF9C4,#FFF3E0)", badge:"🏆 Ayrıcalıklı",
    features:["Tüm Premium özellikler","1:1 veteriner danışma","VIP etkinlik davetleri","Özel ürün sepeti %20","Elite altın rozet"],
  },
];

function BottomNav() {
  return (
    <nav style={{ position:"fixed", bottom:0, left:0, right:0, background:"#fff", borderTop:"1px solid #f0f0f0", boxShadow:"0 -4px 20px rgba(0,0,0,0.08)", height:64, display:"flex", alignItems:"center", justifyContent:"space-around", zIndex:200, padding:"0 8px" }}>
      {[{label:"Ana Sayfa",href:"/",icon:<Home size={22} strokeWidth={2} />},{label:"Club",href:"/club",icon:<Users size={22} strokeWidth={2} />}].map(({label,href,icon})=>(
        <a key={label} href={href} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:3,textDecoration:"none",flex:1,color:label==="Club"?"#7C3AFF":"#aaa" }}>
          {icon}<span style={{ fontSize:10,fontWeight:label==="Club"?800:700,fontFamily:"'Inter',sans-serif" }}>{label}</span>
          {label==="Club"&&<div style={{ width:20,height:2.5,borderRadius:2,background:"#7C3AFF" }}/>}
        </a>
      ))}
      <a href="/sepet" style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:3,textDecoration:"none",flex:1,position:"relative" }}>
        <div style={{ width:54,height:54,borderRadius:"50%",background:"linear-gradient(135deg,#9B59FF,#7C3AFF)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 6px 20px rgba(124,58,255,0.4)",position:"absolute",top:-24 }}>
          <ShoppingBag size={24} color="#fff" strokeWidth={2.2} />
        </div>
        <span style={{ fontSize:10,fontWeight:700,color:"#aaa",fontFamily:"'Inter',sans-serif",marginTop:32 }}>Sepet</span>
      </a>
      {[{label:"Rehber",href:"/rehber",icon:<BookOpen size={22} strokeWidth={2} />},{label:"Bilgi Bankası",href:"/bilgi",icon:<Monitor size={22} strokeWidth={2} />}].map(({label,href,icon})=>(
        <a key={label} href={href} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:3,textDecoration:"none",flex:1,color:"#aaa" }}>
          {icon}<span style={{ fontSize:10,fontWeight:700,fontFamily:"'Inter',sans-serif" }}>{label}</span>
        </a>
      ))}
    </nav>
  );
}

export default function Club() {
  const [activeLang, setActiveLang] = useState(LANGUAGES[0]);
  const [langOpen, setLangOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("Premium");

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'); *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;} body{background:#fff;} .icon-btn{background:none;border:none;cursor:pointer;display:flex;align-items:center;padding:6px;border-radius:8px;}`}</style>

      <div style={{ minHeight:"100vh", background:"#fff", fontFamily:"'Inter',sans-serif", paddingBottom:80 }}>

        {drawerOpen && <div onClick={() => setDrawerOpen(false)} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.3)",zIndex:199 }}/>}
        <div style={{ position:"fixed",top:0,right:0,height:"100%",width:280,background:"#fff",zIndex:200,transform:drawerOpen?"translateX(0)":"translateX(100%)",transition:"transform 0.24s ease",boxShadow:"-4px 0 24px rgba(0,0,0,0.12)" }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 18px 14px",borderBottom:"1px solid #f2f2f2" }}>
            <img src="/__mockup/images/yourpoodle-logo.jpg" alt="YourPoodle" style={{ height:32,objectFit:"contain" }}/>
            <button className="icon-btn" onClick={() => setDrawerOpen(false)}><X size={20} color="#444"/></button>
          </div>
          <nav>{["Ana Sayfa","Club","Rehber","Bilgi Bankası","Mağaza"].map(l=><a key={l} href={`/${l.toLowerCase().replace(/\s/g,"-")}`} style={{ display:"block",padding:"14px 20px",fontSize:15,fontWeight:600,color:"#222",textDecoration:"none",borderBottom:"1px solid #fafafa" }}>{l}</a>)}</nav>
        </div>

        {/* HEADER */}
        <header style={{ position:"sticky",top:0,zIndex:100,background:"#fff",borderBottom:"1px solid #f0f0f0" }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px" }}>
            <img src="/__mockup/images/yourpoodle-logo.jpg" alt="YourPoodle" style={{ height:36,width:160,objectFit:"contain",objectPosition:"left center" }}/>
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
              <a key={t.label} href={t.href} style={{ flex:1,padding:"11px 4px",fontSize:13.5,fontWeight:500,color:"#555",borderBottom:"2.5px solid transparent",textAlign:"center",textDecoration:"none",display:"block" }}>{t.label}</a>
            ))}
          </div>
        </header>

        {/* HERO */}
        <div style={{ background:"linear-gradient(135deg,#7C3AFF,#9B59FF,#B39DFF)", padding:"32px 20px 28px", textAlign:"center" }}>
          <div style={{ fontSize:40, marginBottom:8 }}>🐩</div>
          <div style={{ fontSize:11, fontWeight:800, color:"rgba(255,255,255,0.7)", letterSpacing:"0.1em", marginBottom:8 }}>POODLE CLUB</div>
          <h1 style={{ fontSize:26, fontWeight:900, color:"#fff", marginBottom:10, lineHeight:1.2 }}>Poodle Ailesine<br />Katıl!</h1>
          <p style={{ fontSize:13, color:"rgba(255,255,255,0.85)", lineHeight:1.6, marginBottom:20 }}>10.000+ poodle sahibiyle aynı toplulukta ol.<br />Uzman tavsiyeleri, özel indirimler ve daha fazlası.</p>
          <div style={{ display:"flex", justifyContent:"center", gap:24 }}>
            {[["10.000+","Üye"],["500+","İçerik"],["50+","Uzman"]].map(([n,l])=>(
              <div key={l} style={{ textAlign:"center" }}>
                <div style={{ fontSize:20, fontWeight:900, color:"#fff" }}>{n}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* PLANS */}
        <div style={{ padding:"24px 16px 0" }}>
          <h2 style={{ fontSize:18, fontWeight:800, color:"#1a1a1a", marginBottom:4 }}>Üyelik Planları</h2>
          <p style={{ fontSize:13, color:"#888", marginBottom:16 }}>İhtiyacına en uygun planı seç</p>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {PLANS.map(plan => (
              <div key={plan.name} onClick={() => setSelectedPlan(plan.name)} style={{ background: selectedPlan===plan.name ? plan.bg : "#FAFAFA", borderRadius:18, padding:"18px", border: selectedPlan===plan.name ? `2px solid ${plan.color}` : "2px solid transparent", cursor:"pointer", position:"relative" }}>
                {plan.badge && <div style={{ position:"absolute", top:14, right:14, background: plan.color==="#7C3AFF" ? "#7C3AFF" : "#D97706", borderRadius:8, padding:"3px 10px" }}><span style={{ fontSize:10, fontWeight:800, color:"#fff" }}>{plan.badge}</span></div>}
                <div style={{ display:"flex", alignItems:"baseline", gap:4, marginBottom:12 }}>
                  <span style={{ fontSize:24, fontWeight:900, color:plan.color }}>{plan.price}</span>
                  <span style={{ fontSize:12, color:"#888" }}>{plan.period}</span>
                  <span style={{ fontSize:15, fontWeight:800, color:"#1a1a1a", marginLeft:8 }}>{plan.name}</span>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:18, height:18, borderRadius:"50%", background:plan.color+"22", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <Check size={11} color={plan.color} strokeWidth={3} />
                      </div>
                      <span style={{ fontSize:12.5, color:"#333" }}>{f}</span>
                    </div>
                  ))}
                </div>
                {selectedPlan===plan.name && (
                  <button style={{ width:"100%", marginTop:16, height:44, borderRadius:12, border:"none", background:plan.color, color:"#fff", fontSize:14, fontWeight:800, cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>
                    {plan.name === "Ücretsiz" ? "Şimdi Başla" : `${plan.name} Üye Ol`}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* MEMBERS */}
        <div style={{ padding:"24px 16px 0" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
            <h2 style={{ fontSize:16, fontWeight:800, color:"#1a1a1a" }}>👥 Son Üyeler</h2>
            <a href="/club/uyeler" style={{ fontSize:12, fontWeight:700, color:"#7C3AFF", textDecoration:"none" }}>Tümü →</a>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {MEMBERS.map(m => (
              <div key={m.name} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", background:"#FAFAFA", borderRadius:14 }}>
                <div style={{ width:44, height:44, borderRadius:"50%", background:"#EDE8FF", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{m.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:800, color:"#1a1a1a" }}>@{m.name}</div>
                  <div style={{ fontSize:11, color:"#888" }}>{m.city} · {m.poodle} ile · {m.since}'den beri</div>
                </div>
                <div style={{ width:28, height:28, borderRadius:"50%", background:"#EDE8FF", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Star size={13} color="#7C3AFF" fill="#7C3AFF" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BENEFITS */}
        <div style={{ padding:"24px 16px 32px" }}>
          <h2 style={{ fontSize:16, fontWeight:800, color:"#1a1a1a", marginBottom:14 }}>🏆 Club Avantajları</h2>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {[
              { emoji:"💰", title:"Özel İndirimler",  desc:"Mağaza ürünlerinde %10-20" },
              { emoji:"🧑‍⚕️", title:"Uzman Danışma",   desc:"Veteriner & eğitmen" },
              { emoji:"🎉", title:"VIP Etkinlikler",  desc:"Buluşma & yarışmalar" },
              { emoji:"📚", title:"Özel İçerikler",   desc:"Sadece üyelere özel" },
              { emoji:"🏅", title:"Rozet Sistemi",    desc:"Club seviye rozetleri" },
              { emoji:"🐾", title:"Poodle Profili",   desc:"Köpeğin için sayfa" },
            ].map(({ emoji, title, desc }) => (
              <div key={title} style={{ background:"#FAFAFA", borderRadius:14, padding:"14px 12px" }}>
                <div style={{ fontSize:24, marginBottom:6 }}>{emoji}</div>
                <div style={{ fontSize:13, fontWeight:800, color:"#1a1a1a", marginBottom:3 }}>{title}</div>
                <div style={{ fontSize:11, color:"#888" }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
      <BottomNav />
    </>
  );
}
