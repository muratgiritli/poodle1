import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronDown, Menu, X, Home, Users, BookOpen, Monitor, ShoppingBag, ChevronRight, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useCustomer } from "@/contexts/CustomerContext";

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
    body:"Beyaz ve açık renkli Poodle'larda göz altı lekeleri oksidasyondan oluşur. Temiz su içilmesi, köz dışı yüzey temizliği ve bazı durumlarda porfirin içeriği düşük mamalar faydalı olabilir. Aşırı yırtma göz tıkanıklığına işaret edebilir — veterinere görünün." },
];

const WARNING_SIGNS = [
  { sign:"İştah kaybı (>24 saat)", urgent:false },
  { sign:"Kanlı dışkı veya kusma", urgent:true },
  { sign:"Nefes darlığı", urgent:true },
  { sign:"Titreme veya nöbet", urgent:true },
  { sign:"Topallama (>12 saat)", urgent:false },
  { sign:"Aşırı su içme", urgent:false },
];

const CSS = [
  "*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}",
  "body{background:#fff;}",
  ".icon-btn{background:none;border:none;cursor:pointer;display:flex;align-items:center;padding:6px;border-radius:8px;}",
  ".art-row:hover{background:#FFF1F2!important;}",
].join("\n");

export default function Saglik() {
  const [, navigate] = useLocation();
  const { isLoggedIn } = useCustomer();
  const [activeLang, setActiveLang] = useState(LANGUAGES[0]);
  const [langOpen, setLangOpen]   = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected]   = useState<typeof ARTICLES[0]|null>(null);

  return (
    <>
      <title>Sağlık Rehberi — YourPoodle</title>
      <style>{CSS}</style>

      {drawerOpen&&<div onClick={()=>setDrawerOpen(false)} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.3)",zIndex:199 }}/>}
      <div style={{ position:"fixed",top:0,left:0,height:"100%",width:280,background:"#fff",zIndex:200,transform:drawerOpen?"translateX(0)":"translateX(-100%)",transition:"transform 0.24s ease",boxShadow:"4px 0 24px rgba(0,0,0,0.12)" }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 18px 14px",borderBottom:"1px solid #f2f2f2" }}>
          <img src="/images/yourpoodle-logo.jpg" alt="YourPoodle" style={{ height:32,objectFit:"contain" }}/>
          <button className="icon-btn" onClick={()=>setDrawerOpen(false)}><X size={20} color="#444"/></button>
        </div>
        <nav>{DRAWER_LINKS.map(({label,href})=>(
          <button key={label} onClick={()=>{setDrawerOpen(false);navigate(href);}}
            style={{ display:"block",width:"100%",textAlign:"left",padding:"14px 20px",fontSize:15,fontWeight:600,color:href==="/yourpoodle/saglik"?"#EF4444":"#222",background:href==="/yourpoodle/saglik"?"#FFF1F2":"none",border:"none",borderBottom:"1px solid #fafafa",cursor:"pointer",fontFamily:"Inter,sans-serif" }}>{label}</button>
        ))}</nav>
      </div>

      {selected&&(
        <div style={{ position:"fixed",inset:0,zIndex:500,display:"flex",flexDirection:"column" }}>
          <div onClick={()=>setSelected(null)} style={{ flex:1,background:"rgba(0,0,0,0.4)" }}/>
          <div style={{ background:"#fff",borderRadius:"24px 24px 0 0",maxHeight:"85vh",display:"flex",flexDirection:"column" }}>
            <div style={{ display:"flex",justifyContent:"center",paddingTop:10,paddingBottom:6 }}><div style={{ width:36,height:4,borderRadius:2,background:"#e0e0e0" }}/></div>
            <div style={{ padding:"0 16px 12px" }}><button onClick={()=>setSelected(null)} style={{ background:"none",border:"none",cursor:"pointer",color:"#555",fontFamily:"Inter,sans-serif",fontSize:14,fontWeight:600 }}>← Geri</button></div>
            <div style={{ overflowY:"auto",padding:"0 20px 40px" }}>
              <div style={{ fontSize:28,marginBottom:12,textAlign:"center" }}>{selected.emoji}</div>
              <div style={{ display:"inline-block",background:"#FFF1F2",color:"#EF4444",fontSize:11,fontWeight:700,borderRadius:20,padding:"4px 12px",marginBottom:12 }}>{selected.tag}</div>
              <h2 style={{ fontSize:17,fontWeight:900,color:"#1a1a1a",lineHeight:1.35,marginBottom:16 }}>{selected.title}</h2>
              <p style={{ fontSize:15,color:"#444",lineHeight:1.8,fontFamily:"Inter,sans-serif" }}>{selected.body}</p>
              <div style={{ marginTop:20,background:"#FFF1F2",borderRadius:14,padding:14,borderLeft:"3px solid #EF4444" }}>
                <div style={{ fontSize:11,fontWeight:800,color:"#EF4444",marginBottom:4 }}>⚠️ ÖNEMLİ</div>
                <div style={{ fontSize:13,color:"#555",lineHeight:1.6,fontFamily:"Inter,sans-serif" }}>Bu makale bilgilendirme amaçlıdır. Sağlık sorunları için mutlaka veterinerinize başvurun.</div>
              </div>
              <button onClick={()=>navigate("/yourpoodle/bilgi")}
                style={{ width:"100%",marginTop:16,height:48,borderRadius:14,border:"none",background:"linear-gradient(135deg,#EF4444,#F87171)",color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"Inter,sans-serif" }}>
                Belirti Kontrolü Aracı →
              </button>
            </div>
          </div>
        </div>
      )}

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

        <div style={{ background:"linear-gradient(135deg,#EF4444,#F87171)",padding:"24px 20px 28px",position:"relative",overflow:"hidden" }}>
          <div style={{ position:"absolute",top:-30,right:-20,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,0.1)" }}/>
          <div style={{ fontSize:36,marginBottom:8 }}>🏥</div>
          <div style={{ fontSize:22,fontWeight:900,color:"#fff",marginBottom:4 }}>Sağlık Rehberi</div>
          <div style={{ fontSize:13,color:"rgba(255,255,255,0.9)",lineHeight:1.5 }}>Poodle'ınızın sağlığını koruyun</div>
        </div>

        {/* Emergency signs */}
        <div style={{ padding:"16px 16px 0" }}>
          <div style={{ fontSize:14,fontWeight:800,color:"#1a1a1a",marginBottom:10 }}>🚨 Acil Durum Belirtileri</div>
          <div style={{ background:"#FFF1F2",borderRadius:14,padding:14,marginBottom:16 }}>
            <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
              {WARNING_SIGNS.map(({sign,urgent})=>(
                <div key={sign} style={{ display:"flex",alignItems:"center",gap:10 }}>
                  {urgent
                    ? <AlertTriangle size={16} color="#EF4444" style={{ flexShrink:0 }}/>
                    : <CheckCircle2 size={16} color="#F59E0B" style={{ flexShrink:0 }}/>
                  }
                  <span style={{ fontSize:13,color:urgent?"#EF4444":"#555",fontWeight:urgent?700:500,fontFamily:"Inter,sans-serif" }}>{sign}</span>
                  {urgent&&<span style={{ fontSize:9,fontWeight:800,background:"#EF4444",color:"#fff",borderRadius:4,padding:"1px 5px",marginLeft:"auto",flexShrink:0 }}>ACİL</span>}
                </div>
              ))}
            </div>
            <button onClick={()=>navigate("/yourpoodle/bilgi")}
              style={{ marginTop:12,width:"100%",height:40,borderRadius:10,border:"none",background:"#EF4444",color:"#fff",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"Inter,sans-serif" }}>
              Belirti Kontrol Aracını Aç 🩺
            </button>
          </div>
        </div>

        <div style={{ padding:"4px 16px 0" }}>
          <div style={{ fontSize:16,fontWeight:800,color:"#1a1a1a",marginBottom:12 }}>📖 Sağlık Yazıları</div>
          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            {ARTICLES.map(a=>(
              <button key={a.title} className="art-row" onClick={()=>setSelected(a)}
                style={{ display:"flex",gap:12,alignItems:"center",padding:"12px",background:"#FAFAFA",borderRadius:14,cursor:"pointer",border:"none",textAlign:"left",width:"100%",transition:"background 0.15s" }}>
                <div style={{ width:52,height:52,borderRadius:12,background:"#FFF1F2",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0 }}>{a.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:10,fontWeight:700,color:"#EF4444",marginBottom:4 }}>{a.tag}</div>
                  <div style={{ fontSize:13,fontWeight:700,color:"#1a1a1a",lineHeight:1.4,marginBottom:4,fontFamily:"Inter,sans-serif" }}>{a.title}</div>
                  <span style={{ fontSize:11,color:"#aaa",display:"flex",alignItems:"center",gap:3 }}><Clock size={10} strokeWidth={2}/>{a.min} dk</span>
                </div>
                <ChevronRight size={16} color="#ccc"/>
              </button>
            ))}
          </div>
        </div>

        <div style={{ margin:"20px 16px 24px",background:"#F0FDF4",borderRadius:18,padding:"20px",textAlign:"center" }}>
          <div style={{ fontSize:24,marginBottom:8 }}>💊</div>
          <div style={{ fontSize:14,fontWeight:800,color:"#1a1a1a",marginBottom:4 }}>Veteriner Ürünleri</div>
          <div style={{ fontSize:12,color:"#888",lineHeight:1.5,marginBottom:12 }}>Sağlık takviyeleri, iç ve dış parazit ürünleri.</div>
          <button onClick={()=>navigate("/yourpoodle/magaza")}
            style={{ height:40,borderRadius:12,border:"none",background:"#22C55E",color:"#fff",fontSize:13,fontWeight:800,padding:"0 24px",cursor:"pointer",fontFamily:"Inter,sans-serif" }}>
            Sağlık Ürünleri →
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
