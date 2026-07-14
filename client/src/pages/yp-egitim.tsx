import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronDown, Menu, X, Home, Users, BookOpen, Monitor, ShoppingBag, ChevronRight, Clock, Star } from "lucide-react";
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
    body:"Küçük yaştan itibaren tarama, pençe kesimi ve banyoya alıştırın. Her oturumu pozitif deneyimle bitirin. Fırça sesi, makas ve saç kurutma makinasını önce uzaktan tanıtın. Bakımı reddetmek eğitim yetersizliğinden kaynaklanır, ırk özelliği değil." },
];

const STAGES = [
  { label:"Yavru (0-6 ay)", tips:["Tuvalet eğitimi","Temel komutlar","Sosyalleşme","Isırma kontrolü"], color:"#FFB347" },
  { label:"Genç (6-18 ay)", tips:["İleri komutlar","Tasma eğitimi","Geri çağırma","Başka köpeklerle play"], color:"#A78BFA" },
  { label:"Yetişkin (1-7 yaş)", tips:["Çevre güvenliği","İsteksizlik yönetimi","Konsantrasyon arttırma","Yeni beceriler"], color:"#34D399" },
];

const CSS = [
  "*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}",
  "body{background:#fff;}",
  ".icon-btn{background:none;border:none;cursor:pointer;display:flex;align-items:center;padding:6px;border-radius:8px;}",
  ".art-row:hover{background:#F0FDF4!important;}",
].join("\n");

export default function Egitim() {
  const [, navigate] = useLocation();
  const { isLoggedIn } = useCustomer();
  const [activeLang, setActiveLang] = useState(LANGUAGES[0]);
  const [langOpen, setLangOpen]   = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected]   = useState<typeof ARTICLES[0]|null>(null);
  const [activeStage, setActiveStage] = useState(0);

  const diffColor = (d:string) => d==="Başlangıç"?"#22C55E":d==="Orta"?"#F59E0B":"#EF4444";

  return (
    <>
      <title>Eğitim Rehberi — YourPoodle</title>
      <style>{CSS}</style>

      {drawerOpen&&<div onClick={()=>setDrawerOpen(false)} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.3)",zIndex:199 }}/>}
      <div style={{ position:"fixed",top:0,left:0,height:"100%",width:280,background:"#fff",zIndex:200,transform:drawerOpen?"translateX(0)":"translateX(-100%)",transition:"transform 0.24s ease",boxShadow:"4px 0 24px rgba(0,0,0,0.12)" }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 18px 14px",borderBottom:"1px solid #f2f2f2" }}>
          <img src="/images/yourpoodle-logo.jpg" alt="YourPoodle" style={{ height:32,objectFit:"contain" }}/>
          <button className="icon-btn" onClick={()=>setDrawerOpen(false)}><X size={20} color="#444"/></button>
        </div>
        <nav>{DRAWER_LINKS.map(({label,href})=>(
          <button key={label} onClick={()=>{setDrawerOpen(false);navigate(href);}}
            style={{ display:"block",width:"100%",textAlign:"left",padding:"14px 20px",fontSize:15,fontWeight:600,color:href==="/yourpoodle/egitim"?"#059669":"#222",background:href==="/yourpoodle/egitim"?"#F0FDF4":"none",border:"none",borderBottom:"1px solid #fafafa",cursor:"pointer",fontFamily:"Inter,sans-serif" }}>{label}</button>
        ))}</nav>
      </div>

      {selected&&(
        <div style={{ position:"fixed",inset:0,zIndex:500,display:"flex",flexDirection:"column" }}>
          <div onClick={()=>setSelected(null)} style={{ flex:1,background:"rgba(0,0,0,0.4)" }}/>
          <div style={{ background:"#fff",borderRadius:"24px 24px 0 0",maxHeight:"85vh",display:"flex",flexDirection:"column" }}>
            <div style={{ display:"flex",justifyContent:"center",paddingTop:10,paddingBottom:6 }}><div style={{ width:36,height:4,borderRadius:2,background:"#e0e0e0" }}/></div>
            <div style={{ padding:"0 16px 12px" }}>
              <button onClick={()=>setSelected(null)} style={{ background:"none",border:"none",cursor:"pointer",color:"#555",fontFamily:"Inter,sans-serif",fontSize:14,fontWeight:600 }}>← Geri</button>
            </div>
            <div style={{ overflowY:"auto",padding:"0 20px 40px" }}>
              <div style={{ fontSize:28,marginBottom:12,textAlign:"center" }}>{selected.emoji}</div>
              <div style={{ display:"flex",gap:8,marginBottom:12 }}>
                <span style={{ fontSize:10,fontWeight:800,background:"#CCFBF1",color:"#0D9488",borderRadius:20,padding:"4px 12px" }}>{selected.tag}</span>
                <span style={{ fontSize:10,fontWeight:800,background:diffColor(selected.difficulty)+"22",color:diffColor(selected.difficulty),borderRadius:20,padding:"4px 12px" }}>{selected.difficulty}</span>
              </div>
              <h2 style={{ fontSize:17,fontWeight:900,color:"#1a1a1a",lineHeight:1.35,marginBottom:16 }}>{selected.title}</h2>
              <p style={{ fontSize:15,color:"#444",lineHeight:1.8,fontFamily:"Inter,sans-serif" }}>{selected.body}</p>
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

        <div style={{ background:"linear-gradient(135deg,#0D9488,#34D399)",padding:"24px 20px 28px",position:"relative",overflow:"hidden" }}>
          <div style={{ position:"absolute",top:-30,right:-20,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,0.1)" }}/>
          <div style={{ fontSize:36,marginBottom:8 }}>🎓</div>
          <div style={{ fontSize:22,fontWeight:900,color:"#fff",marginBottom:4 }}>Eğitim Rehberi</div>
          <div style={{ fontSize:13,color:"rgba(255,255,255,0.9)",lineHeight:1.5 }}>Poodle'ınızın zekasını en iyi şekilde kullanın</div>
          <div style={{ display:"flex",gap:16,marginTop:16 }}>
            {[["#1","En Zeki","Köpek Irkı"],["10dk","Günlük","Antrenman"],["4 hafta","Temel","Komutlar"]].map(([n,l,s])=>(
              <div key={l} style={{ textAlign:"center" }}>
                <div style={{ fontSize:16,fontWeight:900,color:"#fff" }}>{n}</div>
                <div style={{ fontSize:10,color:"rgba(255,255,255,0.75)" }}>{l}</div>
                <div style={{ fontSize:9,color:"rgba(255,255,255,0.6)" }}>{s}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Training stages */}
        <div style={{ padding:"16px 16px 0" }}>
          <div style={{ fontSize:14,fontWeight:800,color:"#1a1a1a",marginBottom:10 }}>📅 Yaşa Göre Eğitim</div>
          <div style={{ display:"flex",gap:8,marginBottom:12 }}>
            {STAGES.map((s,i)=>(
              <button key={i} onClick={()=>setActiveStage(i)}
                style={{ flex:1,padding:"8px 4px",borderRadius:10,border:"2px solid",borderColor:activeStage===i?s.color:"#e8e8e8",background:activeStage===i?s.color+"22":"#fff",fontSize:10,fontWeight:700,color:activeStage===i?s.color:"#555",cursor:"pointer",fontFamily:"Inter,sans-serif",lineHeight:1.4 }}>
                {s.label}
              </button>
            ))}
          </div>
          <div style={{ background:STAGES[activeStage].color+"11",borderRadius:14,padding:14,marginBottom:16 }}>
            <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
              {STAGES[activeStage].tips.map(tip=>(
                <div key={tip} style={{ display:"flex",alignItems:"center",gap:8 }}>
                  <Star size={12} color={STAGES[activeStage].color} fill={STAGES[activeStage].color}/>
                  <span style={{ fontSize:13,color:"#333",fontFamily:"Inter,sans-serif" }}>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Articles */}
        <div style={{ padding:"4px 16px 0" }}>
          <div style={{ fontSize:16,fontWeight:800,color:"#1a1a1a",marginBottom:12 }}>📖 Eğitim Yazıları</div>
          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            {ARTICLES.map(a=>(
              <button key={a.title} className="art-row" onClick={()=>setSelected(a)}
                style={{ display:"flex",gap:12,alignItems:"center",padding:"12px",background:"#FAFAFA",borderRadius:14,cursor:"pointer",border:"none",textAlign:"left",width:"100%",transition:"background 0.15s" }}>
                <div style={{ width:52,height:52,borderRadius:12,background:"#CCFBF1",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0 }}>{a.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex",gap:6,marginBottom:4 }}>
                    <span style={{ fontSize:10,fontWeight:700,color:"#0D9488" }}>{a.tag}</span>
                    <span style={{ fontSize:10,fontWeight:700,color:diffColor(a.difficulty),background:diffColor(a.difficulty)+"22",borderRadius:4,padding:"0 4px" }}>{a.difficulty}</span>
                  </div>
                  <div style={{ fontSize:13,fontWeight:700,color:"#1a1a1a",lineHeight:1.4,marginBottom:4,fontFamily:"Inter,sans-serif" }}>{a.title}</div>
                  <span style={{ fontSize:11,color:"#aaa",display:"flex",alignItems:"center",gap:3 }}><Clock size={10} strokeWidth={2}/>{a.min} dk</span>
                </div>
                <ChevronRight size={16} color="#ccc"/>
              </button>
            ))}
          </div>
        </div>

        <div style={{ margin:"20px 16px 24px",background:"#CCFBF1",borderRadius:18,padding:"20px",textAlign:"center" }}>
          <div style={{ fontSize:24,marginBottom:8 }}>🐾</div>
          <div style={{ fontSize:14,fontWeight:800,color:"#1a1a1a",marginBottom:4 }}>Topluluğa Katıl</div>
          <div style={{ fontSize:12,color:"#555",lineHeight:1.5,marginBottom:12 }}>Diğer poodle sahipleriyle eğitim ipuçlarını paylaşın.</div>
          <button onClick={()=>navigate("/yourpoodle/club")}
            style={{ height:40,borderRadius:12,border:"none",background:"#0D9488",color:"#fff",fontSize:13,fontWeight:800,padding:"0 24px",cursor:"pointer",fontFamily:"Inter,sans-serif" }}>
            Club'a Git
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
