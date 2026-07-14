import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronDown, Menu, X, Home, Users, BookOpen, Monitor, ShoppingBag, ChevronRight, Clock, CheckCircle2, Circle } from "lucide-react";
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
  { emoji:"✂️", title:"Evde Poodle Tıraşı: Adım Adım Rehber", min:8, tag:"Tıraş",
    body:"Teddy bear kesimi için önce banyo, kurutma, ardından makasla şekillendirme adımlarını takip edin. Kulak temizliği tıraş öncesi yapılmalıdır. Gerekli ekipman: slicker fırça, matlaştırıcı sprey, profesyonel makas seti ve tıraş makinesi. Her 6–8 haftada bir tam tıraş önerilir." },
  { emoji:"🛁", title:"Poodle Tüy Bakımı: Haftalık Rutin Rehberi", min:5, tag:"Tüy Bakımı",
    body:"Haftada en az 3 kez slicker fırçayla tarama, 4–6 haftada bir profesyonel tıraş ve 2 haftada bir banyo standart bakım rutinidir. Pin fırça yerine slicker tercih edin; mat önlemek için köklere kadar tarayın. Kulak kıllarını 3–4 haftada bir aldırın." },
  { emoji:"🐾", title:"Poodle Pençe Bakımı: Nasıl ve Ne Zaman Kesilir?", min:5, tag:"Pençe Bakımı",
    body:"Pençeler zeminde tıkırtı çıkarmaya başladığında kesilmeli — genellikle 3-4 haftada bir. Damarı (quick) kesmemek için küçük adımlarla kesin, koyu renkli pençelerde dikkatli olun. İlk kez için veteriner veya groomer'dan yardım alın. Kesimden sonra pençe dolayının altını kontrol edin." },
  { emoji:"👂", title:"Poodle Kulak Bakımı ve Enfeksiyon Önleme", min:6, tag:"Kulak Bakımı",
    body:"Poodle'ların kulak kanalı kapalı yapısı nedeniyle enfeksiyona yatkındır. 3-4 haftada bir kulak kıllarını aldırın ve uygun kulak temizleyici ile silin. Kaşıma, baş sallama veya kötü koku varsa veterinere gidin. Banyo sonrası kulağı iyice kurulayın." },
  { emoji:"🦷", title:"Evde Poodle Diş Fırçalama Teknikleri", min:6, tag:"Ağız Bakımı",
    body:"Köpeklere özel diş fırçası ve macun kullanın (insan macunu toksiktir). Önce parmakla diş etlerine alıştırın, sonra fırçayı tanıtın. Haftada 2-3 kez fırçalama ideal; minimum haftada 1 kez. Dental çiğneme oyuncakları ek destek sağlar." },
  { emoji:"💆", title:"Banyo Rehberi: Doğru Sıklık ve Teknik", min:5, tag:"Banyo",
    body:"Toy Poodle'lar için 2 haftada bir banyo idealdir. Öncesinde tüyleri tarayın — ıslak matt daha zor çözülür. Köpek şampuanı, iyice durulamak ve saç kurutucuyla tam kurutma şart. Çok sık banyo tüyleri kurutur ve cilt sorunlarına yol açar." },
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

const CSS = [
  "*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}",
  "body{background:#fff;}",
  ".icon-btn{background:none;border:none;cursor:pointer;display:flex;align-items:center;padding:6px;border-radius:8px;}",
  ".art-row:hover{background:#FFF0F5!important;}",
].join("\n");

export default function Bakim() {
  const [, navigate] = useLocation();
  const { isLoggedIn } = useCustomer();
  const [activeLang, setActiveLang] = useState(LANGUAGES[0]);
  const [langOpen, setLangOpen]   = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected]   = useState<typeof ARTICLES[0]|null>(null);
  const [checked, setChecked]     = useState<Set<string>>(new Set());
  const toggle = (id:string) => { const s=new Set(checked); s.has(id)?s.delete(id):s.add(id); setChecked(s); };

  return (
    <>
      <title>Bakım Rehberi — YourPoodle</title>
      <style>{CSS}</style>

      {drawerOpen&&<div onClick={()=>setDrawerOpen(false)} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.3)",zIndex:199 }}/>}
      <div style={{ position:"fixed",top:0,left:0,height:"100%",width:280,background:"#fff",zIndex:200,transform:drawerOpen?"translateX(0)":"translateX(-100%)",transition:"transform 0.24s ease",boxShadow:"4px 0 24px rgba(0,0,0,0.12)" }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 18px 14px",borderBottom:"1px solid #f2f2f2" }}>
          <img src="/images/yourpoodle-logo.jpg" alt="YourPoodle" style={{ height:32,objectFit:"contain" }}/>
          <button className="icon-btn" onClick={()=>setDrawerOpen(false)}><X size={20} color="#444"/></button>
        </div>
        <nav>{DRAWER_LINKS.map(({label,href})=>(
          <button key={label} onClick={()=>{setDrawerOpen(false);navigate(href);}}
            style={{ display:"block",width:"100%",textAlign:"left",padding:"14px 20px",fontSize:15,fontWeight:600,color:href==="/yourpoodle/bakim"?"#E75480":"#222",background:href==="/yourpoodle/bakim"?"#FFE4EC":"none",border:"none",borderBottom:"1px solid #fafafa",cursor:"pointer",fontFamily:"Inter,sans-serif" }}>{label}</button>
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
              <div style={{ display:"inline-block",background:"#FFE4EC",color:"#E75480",fontSize:11,fontWeight:700,borderRadius:20,padding:"4px 12px",marginBottom:12 }}>{selected.tag}</div>
              <h2 style={{ fontSize:17,fontWeight:900,color:"#1a1a1a",lineHeight:1.35,marginBottom:16 }}>{selected.title}</h2>
              <p style={{ fontSize:15,color:"#444",lineHeight:1.8,fontFamily:"Inter,sans-serif" }}>{selected.body}</p>
              <button onClick={()=>navigate("/yourpoodle/magaza")}
                style={{ width:"100%",marginTop:20,height:48,borderRadius:14,border:"none",background:"linear-gradient(135deg,#E75480,#F472B6)",color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"Inter,sans-serif" }}>
                Bakım Ürünlerine Git 🛍️
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

        <div style={{ background:"linear-gradient(135deg,#E75480,#F472B6)",padding:"24px 20px 28px",position:"relative",overflow:"hidden" }}>
          <div style={{ position:"absolute",top:-30,right:-20,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,0.1)" }}/>
          <div style={{ fontSize:36,marginBottom:8 }}>✂️</div>
          <div style={{ fontSize:22,fontWeight:900,color:"#fff",marginBottom:4 }}>Bakım Rehberi</div>
          <div style={{ fontSize:13,color:"rgba(255,255,255,0.9)",lineHeight:1.5 }}>Poodle'ınızı her zaman şık ve sağlıklı tutun</div>
        </div>

        {/* Grooming checklist */}
        <div style={{ padding:"16px 16px 0" }}>
          <div style={{ fontSize:14,fontWeight:800,color:"#1a1a1a",marginBottom:10 }}>✅ Bakım Kontrol Listesi</div>
          <div style={{ display:"flex",flexDirection:"column",gap:8,marginBottom:4 }}>
            {CHECKLIST.map(({id,freq,task})=>(
              <button key={id} onClick={()=>toggle(id)}
                style={{ display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:checked.has(id)?"#FFF0F5":"#FAFAFA",borderRadius:12,border:`1.5px solid ${checked.has(id)?"#FCA5A5":"#f0f0f0"}`,cursor:"pointer",textAlign:"left",transition:"all 0.15s" }}>
                {checked.has(id)
                  ? <CheckCircle2 size={20} color="#E75480" strokeWidth={2} style={{ flexShrink:0 }}/>
                  : <Circle size={20} color="#ddd" strokeWidth={2} style={{ flexShrink:0 }}/>
                }
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13,fontWeight:600,color:checked.has(id)?"#E75480":"#333",fontFamily:"Inter,sans-serif",textDecoration:checked.has(id)?"line-through":"none" }}>{task}</div>
                </div>
                <span style={{ fontSize:10,fontWeight:700,background:"#FFE4EC",color:"#E75480",borderRadius:6,padding:"2px 8px",flexShrink:0 }}>{freq}</span>
              </button>
            ))}
          </div>
          {checked.size>0&&(
            <div style={{ textAlign:"center",padding:"8px 0",fontSize:12,color:"#E75480",fontWeight:700 }}>
              {checked.size}/{CHECKLIST.length} tamamlandı 🎀
            </div>
          )}
        </div>

        {/* Articles */}
        <div style={{ padding:"16px 16px 0" }}>
          <div style={{ fontSize:16,fontWeight:800,color:"#1a1a1a",marginBottom:12 }}>📖 Bakım Yazıları</div>
          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            {ARTICLES.map(a=>(
              <button key={a.title} className="art-row" onClick={()=>setSelected(a)}
                style={{ display:"flex",gap:12,alignItems:"center",padding:"12px",background:"#FAFAFA",borderRadius:14,cursor:"pointer",border:"none",textAlign:"left",width:"100%",transition:"background 0.15s" }}>
                <div style={{ width:52,height:52,borderRadius:12,background:"#FFE4EC",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0 }}>{a.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:10,fontWeight:700,color:"#E75480",marginBottom:4 }}>{a.tag}</div>
                  <div style={{ fontSize:13,fontWeight:700,color:"#1a1a1a",lineHeight:1.4,marginBottom:4,fontFamily:"Inter,sans-serif" }}>{a.title}</div>
                  <span style={{ fontSize:11,color:"#aaa",display:"flex",alignItems:"center",gap:3 }}><Clock size={10} strokeWidth={2}/>{a.min} dk</span>
                </div>
                <ChevronRight size={16} color="#ccc"/>
              </button>
            ))}
          </div>
        </div>

        {/* Tıraş zamanlama aracı */}
        <div style={{ margin:"20px 16px 24px",background:"linear-gradient(135deg,#FFE4EC,#FFF0F5)",borderRadius:18,padding:"20px",textAlign:"center" }}>
          <div style={{ fontSize:24,marginBottom:8 }}>✂️</div>
          <div style={{ fontSize:14,fontWeight:800,color:"#1a1a1a",marginBottom:4 }}>Tıraş Zamanlama Aracı</div>
          <div style={{ fontSize:12,color:"#888",lineHeight:1.5,marginBottom:12 }}>Son tıraş tarihine göre bir sonraki tıraş tarihini hesaplayın.</div>
          <div style={{ display:"flex",gap:10 }}>
            <button onClick={()=>navigate("/yourpoodle/bilgi")}
              style={{ flex:1,height:40,borderRadius:12,border:"none",background:"#E75480",color:"#fff",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"Inter,sans-serif" }}>
              Hesapla
            </button>
            <button onClick={()=>navigate("/yourpoodle/magaza")}
              style={{ flex:1,height:40,borderRadius:12,border:"2px solid #E75480",background:"#fff",color:"#E75480",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"Inter,sans-serif" }}>
              Bakım Ürünleri
            </button>
          </div>
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
