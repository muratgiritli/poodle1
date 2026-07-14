import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronDown, Menu, X, Home, Users, BookOpen, Monitor, ShoppingBag, MapPin, Calendar, ExternalLink } from "lucide-react";
import { useCustomer } from "@/contexts/CustomerContext";
import { useQuery } from "@tanstack/react-query";

const LANGUAGES = [{ code:"TR",flag:"🇹🇷" },{ code:"EN",flag:"🇺🇸" }];
const DRAWER_LINKS = [
  { label:"Ana Sayfa",     href:"/" },
  { label:"Rehber",        href:"/yourpoodle/rehber" },
  { label:"Bilgi Bankası", href:"/yourpoodle/bilgi" },
  { label:"Mağaza",        href:"/yourpoodle/magaza" },
  { label:"Mama",          href:"/yourpoodle/mama" },
  { label:"Eğitim",        href:"/yourpoodle/egitim" },
  { label:"Sağlık",        href:"/yourpoodle/saglik" },
  { label:"Bakım",         href:"/yourpoodle/bakim" },
  { label:"Poodle Club",   href:"/yourpoodle/club" },
  { label:"Etkinlikler",   href:"/yourpoodle/etkinlikler" },
];

const FALLBACK_EVENTS = [
  { id:1, day:"26", month:"TEM", year:"2026", title:"Poodle Buluşması — Kadıköy", location:"İstanbul", desc:"İstanbul poodle severler Kadıköy Moda sahilinde buluşuyor. Poodlenizi getirin!", color:"#FF7FA7", type:"Buluşma", free:true },
  { id:2, day:"09", month:"AĞU", year:"2026", title:"Online: Tıraş Teknikleri Webinarı", location:"Zoom", desc:"Uzman groomer Selin Demir ile ev ortamında tıraş teknikleri webinarı.", color:"#A77BFF", type:"Online", free:true },
  { id:3, day:"23", month:"AĞU", year:"2026", title:"Poodle Agility Yarışması", location:"Ankara", desc:"Poodle'ınızın çevikliğini sınayın! Tüm yaş grupları için ayrı kategoriler mevcut.", color:"#78BEFF", type:"Yarışma", free:false },
  { id:4, day:"06", month:"EYL", year:"2026", title:"Poodle Fotoğraf Günü", location:"İzmir", desc:"Profesyonel fotoğrafçı eşliğinde poodlenizle anılarınızı ölümsüzleştirin.", color:"#34D399", type:"Etkinlik", free:false },
  { id:5, day:"20", month:"EYL", year:"2026", title:"Beslenme ve Sağlık Semineri", location:"Online (Zoom)", desc:"Veteriner Dr. Ayşe Kaya'nın poodle beslenmesi ve sağlığı üzerine interaktif semineri.", color:"#FBBF24", type:"Online", free:true },
  { id:6, day:"10", month:"EKİ", year:"2026", title:"Sonbahar Poodle Parkı Buluşması", location:"İstanbul", desc:"Sonbaharı poodlelerinizle karşılıyoruz. Parkta sosyalleşme ve mini yarışmalar.", color:"#F472B6", type:"Buluşma", free:true },
];

const CSS = [
  "*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}",
  "body{background:#fff;}",
  ".icon-btn{background:none;border:none;cursor:pointer;display:flex;align-items:center;padding:6px;border-radius:8px;}",
  ".ev-card:active{transform:scale(0.98);} .ev-card{transition:transform 0.12s;}",
].join("\n");

export default function Etkinlikler() {
  const [, navigate] = useLocation();
  const { isLoggedIn } = useCustomer();
  const [activeLang, setActiveLang] = useState(LANGUAGES[0]);
  const [langOpen, setLangOpen]   = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filter, setFilter]       = useState("Tümü");

  const { data: apiEvents } = useQuery<any[]>({
    queryKey: ["/api/yp-events"],
    staleTime: 2 * 60 * 1000,
  });
  const events = (apiEvents && apiEvents.length > 0) ? apiEvents : FALLBACK_EVENTS;
  const types = ["Tümü", ...Array.from(new Set(events.map((e:any)=>e.type)))];
  const filtered = filter === "Tümü" ? events : events.filter((e:any)=>e.type===filter);

  return (
    <>
      <title>Etkinlikler — YourPoodle</title>
      <style>{CSS}</style>

      {drawerOpen&&<div onClick={()=>setDrawerOpen(false)} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.3)",zIndex:199 }}/>}
      <div style={{ position:"fixed",top:0,left:0,height:"100%",width:280,background:"#fff",zIndex:200,transform:drawerOpen?"translateX(0)":"translateX(-100%)",transition:"transform 0.24s ease",boxShadow:"4px 0 24px rgba(0,0,0,0.12)" }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 18px 14px",borderBottom:"1px solid #f2f2f2" }}>
          <img src="/images/yourpoodle-logo.jpg" alt="YourPoodle" style={{ height:32,objectFit:"contain" }}/>
          <button className="icon-btn" onClick={()=>setDrawerOpen(false)}><X size={20} color="#444"/></button>
        </div>
        <nav>{DRAWER_LINKS.map(({label,href})=>(
          <button key={label} onClick={()=>{setDrawerOpen(false);navigate(href);}}
            style={{ display:"block",width:"100%",textAlign:"left",padding:"14px 20px",fontSize:15,fontWeight:600,color:href==="/yourpoodle/etkinlikler"?"#7C3AFF":"#222",background:href==="/yourpoodle/etkinlikler"?"#F5F0FF":"none",border:"none",borderBottom:"1px solid #fafafa",cursor:"pointer",fontFamily:"Inter,sans-serif" }}>{label}</button>
        ))}</nav>
      </div>

      <div style={{ minHeight:"100vh",background:"#fff",fontFamily:"Inter,sans-serif",paddingBottom:90 }}>
        <header style={{ position:"sticky",top:0,zIndex:100,background:"#fff",borderBottom:"1px solid #f0f0f0" }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px" }}>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              <button className="icon-btn" onClick={()=>setDrawerOpen(true)}><Menu size={22} color="#333" strokeWidth={2}/></button>
              <button className="icon-btn" onClick={()=>navigate("/")} style={{ padding:0 }}>
                <img src="/images/yourpoodle-logo.jpg" alt="YourPoodle" style={{ height:30,width:120,objectFit:"contain",objectPosition:"left center" }}/>
              </button>
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:6 }}>
              <button className="icon-btn" onClick={()=>navigate(isLoggedIn?"/hesabim":"/yourpoodle/giris")}
                style={{ padding:"6px 13px",borderRadius:20,border:"2px solid",borderColor:isLoggedIn?"#22C55E":"#7C3AFF",background:isLoggedIn?"#F0FDF4":"#F5F0FF",color:isLoggedIn?"#16A34A":"#7C3AFF",fontSize:12,fontWeight:800,whiteSpace:"nowrap" }}>
                {isLoggedIn?"Hesabım 👤":"Üye Girişi"}
              </button>
              <div style={{ position:"relative" }}>
                <button className="icon-btn" onClick={()=>setLangOpen(!langOpen)} style={{ gap:3,padding:"5px 6px" }}>
                  <span style={{ fontSize:14 }}>{activeLang.flag}</span>
                  <span style={{ fontSize:12,fontWeight:700,color:"#6C47FF" }}>{activeLang.code}</span>
                  <ChevronDown size={12} color="#6C47FF" strokeWidth={2.5}/>
                </button>
                {langOpen&&<div style={{ position:"absolute",right:0,top:36,background:"#fff",borderRadius:12,border:"1px solid #eee",boxShadow:"0 8px 28px rgba(0,0,0,0.12)",zIndex:150,minWidth:110,padding:"4px 0" }}>
                  {LANGUAGES.map(l=><button key={l.code} onClick={()=>{setActiveLang(l);setLangOpen(false);}}
                    style={{ display:"flex",alignItems:"center",gap:8,width:"100%",padding:"9px 14px",border:"none",background:activeLang.code===l.code?"#F5F0FF":"transparent",cursor:"pointer",fontSize:13,fontWeight:700,color:activeLang.code===l.code?"#6C47FF":"#333",fontFamily:"Inter,sans-serif" }}><span style={{ fontSize:16 }}>{l.flag}</span>{l.code}</button>)}
                </div>}
              </div>
            </div>
          </div>
        </header>

        {/* Hero banner */}
        <div style={{ background:"linear-gradient(135deg,#7C3AFF,#9B59FF)",padding:"24px 20px 28px",position:"relative",overflow:"hidden" }}>
          <div style={{ position:"absolute",top:-30,right:-30,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.07)" }}/>
          <div style={{ fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.65)",letterSpacing:"0.1em",marginBottom:4 }}>YourPoodle</div>
          <div style={{ fontSize:22,fontWeight:900,color:"#fff",marginBottom:6 }}>📅 Etkinlikler</div>
          <div style={{ fontSize:13,color:"rgba(255,255,255,0.85)" }}>Poodle severlerin buluşma noktası</div>
          <div style={{ display:"flex",gap:16,marginTop:16 }}>
            {[["6","Etkinlik"],["3","Şehir"],["2","Online"]].map(([n,l])=>(
              <div key={l} style={{ textAlign:"center" }}>
                <div style={{ fontSize:18,fontWeight:900,color:"#fff" }}>{n}</div>
                <div style={{ fontSize:10,color:"rgba(255,255,255,0.7)" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div style={{ padding:"14px 16px 0",display:"flex",gap:8,overflowX:"auto" }}>
          {types.map(t=>(
            <button key={t} onClick={()=>setFilter(t)}
              style={{ flexShrink:0,padding:"7px 16px",borderRadius:20,border:"1.5px solid",borderColor:filter===t?"#7C3AFF":"#e8e8e8",background:filter===t?"#7C3AFF":"#fff",color:filter===t?"#fff":"#555",fontSize:12.5,fontWeight:700,cursor:"pointer",fontFamily:"Inter,sans-serif" }}>
              {t}
            </button>
          ))}
        </div>

        {/* Events list */}
        <div style={{ padding:"16px 16px 0",display:"flex",flexDirection:"column",gap:14 }}>
          {filtered.map((ev:any)=>(
            <div key={ev.id||ev.title} className="ev-card" style={{ background:"#fff",borderRadius:18,boxShadow:"0 2px 16px rgba(0,0,0,0.07)",overflow:"hidden" }}>
              <div style={{ display:"flex",alignItems:"stretch" }}>
                <div style={{ width:72,flexShrink:0,background:ev.color+"22",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"16px 8px" }}>
                  <div style={{ fontSize:22,fontWeight:900,color:ev.color,lineHeight:1 }}>{ev.day}</div>
                  <div style={{ fontSize:10,fontWeight:800,color:ev.color }}>{ev.month}</div>
                  <div style={{ fontSize:9,color:ev.color,opacity:0.7,marginTop:2 }}>{ev.year||""}</div>
                </div>
                <div style={{ flex:1,padding:"14px 14px 14px 12px" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:5 }}>
                    <span style={{ fontSize:10,fontWeight:800,background:ev.color+"22",color:ev.color,borderRadius:6,padding:"2px 8px" }}>{ev.type}</span>
                    {ev.free&&<span style={{ fontSize:10,fontWeight:800,background:"#DCFCE7",color:"#16A34A",borderRadius:6,padding:"2px 8px" }}>ÜCRETSİZ</span>}
                  </div>
                  <div style={{ fontSize:14,fontWeight:800,color:"#1a1a1a",lineHeight:1.35,marginBottom:6,fontFamily:"Inter,sans-serif" }}>{ev.title}</div>
                  {ev.desc&&<div style={{ fontSize:12,color:"#666",lineHeight:1.55,marginBottom:6,fontFamily:"Inter,sans-serif" }}>{ev.desc}</div>}
                  <div style={{ display:"flex",alignItems:"center",gap:4 }}>
                    <MapPin size={11} color="#888"/><span style={{ fontSize:11,color:"#888",fontFamily:"Inter,sans-serif" }}>{ev.location||ev.loc}</span>
                  </div>
                </div>
              </div>
              {!isLoggedIn&&(
                <div style={{ borderTop:"1px solid #f5f5f5",padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                  <span style={{ fontSize:12,color:"#888",fontFamily:"Inter,sans-serif" }}>Katılmak için üye ol</span>
                  <button onClick={()=>navigate("/yourpoodle/giris")}
                    style={{ padding:"6px 14px",borderRadius:10,border:"none",background:"#7C3AFF",color:"#fff",fontSize:12,fontWeight:800,cursor:"pointer",fontFamily:"Inter,sans-serif" }}>Üye Ol</button>
                </div>
              )}
              {isLoggedIn&&(
                <div style={{ borderTop:"1px solid #f5f5f5",padding:"10px 14px" }}>
                  <button style={{ display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",color:"#7C3AFF",fontSize:13,fontWeight:700,fontFamily:"Inter,sans-serif" }}>
                    <Calendar size={14}/>Takvime ekle <ExternalLink size={12}/>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Submit event CTA */}
        <div style={{ margin:"24px 16px",background:"#F5F0FF",borderRadius:18,padding:"20px",textAlign:"center" }}>
          <div style={{ fontSize:24,marginBottom:8 }}>🎉</div>
          <div style={{ fontSize:15,fontWeight:800,color:"#1a1a1a",marginBottom:6 }}>Etkinlik Düzenlemek İster misiniz?</div>
          <p style={{ fontSize:12,color:"#888",lineHeight:1.6,marginBottom:16 }}>Poodle topluluğu için etkinlik organize edin, duyurunuzu yayınlayalım.</p>
          <button onClick={()=>navigate(isLoggedIn?"/hesabim":"/yourpoodle/giris")}
            style={{ height:44,borderRadius:12,border:"none",background:"#7C3AFF",color:"#fff",fontSize:13,fontWeight:800,padding:"0 24px",cursor:"pointer",fontFamily:"Inter,sans-serif" }}>
            Bize Ulaşın
          </button>
        </div>
      </div>

      <nav style={{ position:"fixed",bottom:0,left:0,right:0,background:"#fff",borderTop:"1px solid #f0f0f0",boxShadow:"0 -4px 20px rgba(0,0,0,0.08)",height:64,display:"flex",alignItems:"center",zIndex:200,padding:"0 8px" }}>
        {[{label:"Ana Sayfa",href:"/",Icon:Home},{label:"Club",href:"/yourpoodle/club",Icon:Users}].map(({label,href,Icon})=>(
          <button key={label} onClick={()=>navigate(href)} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",flex:1,color:"#aaa" }}>
            <Icon size={22} strokeWidth={2}/><span style={{ fontSize:10,fontWeight:700,fontFamily:"Inter,sans-serif" }}>{label}</span>
          </button>
        ))}
        <button onClick={()=>navigate("/yourpoodle/magaza")} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",flex:1,position:"relative" }}>
          <div style={{ width:54,height:54,borderRadius:"50%",background:"linear-gradient(135deg,#9B59FF,#7C3AFF)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 6px 20px rgba(124,58,255,0.4)",position:"absolute",top:-24 }}>
            <ShoppingBag size={24} color="#fff" strokeWidth={2.2}/>
          </div>
          <span style={{ fontSize:10,fontWeight:700,color:"#aaa",fontFamily:"Inter,sans-serif",marginTop:32 }}>Mağaza</span>
        </button>
        {[{label:"Rehber",href:"/yourpoodle/rehber",Icon:BookOpen},{label:"Bilgi",href:"/yourpoodle/bilgi",Icon:Monitor}].map(({label,href,Icon})=>(
          <button key={label} onClick={()=>navigate(href)} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",flex:1,color:"#aaa" }}>
            <Icon size={22} strokeWidth={2}/><span style={{ fontSize:10,fontWeight:700,fontFamily:"Inter,sans-serif" }}>{label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
