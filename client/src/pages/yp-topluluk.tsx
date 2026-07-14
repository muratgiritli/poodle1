import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronDown, Menu, X, Home, Users, BookOpen, Monitor, ShoppingBag, Heart, MessageCircle, Share2, Search } from "lucide-react";
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

const ALL_POSTS = [
  { id:"1", author:"poodlemom_ayse",  poodle:"Mocha",   avatar:"🐩", time:"2 saat önce",   text:"Mocha bugün tıraş oldu 🥰 Müthiş görünüyor! Tıraşını yaptıran var mı bu hafta?", likes:48, comments:12, liked:false },
  { id:"2", author:"toypoodle_mert",  poodle:"Luna",    avatar:"🐾", time:"5 saat önce",   text:"Luna'nın ilk oyun randevusu! Diğer poodlelarla tanışmak onu çok heyecanlandırdı 💜", likes:34, comments:7, liked:false },
  { id:"3", author:"poodle_selin",    poodle:"Biscuit", avatar:"💜", time:"1 gün önce",    text:"Biscuit 1 yaşına girdi! 🎂 Doğum günü pastasını bitirdi hepsini haha. Yorumlarınızı bekliyorum!", likes:92, comments:23, liked:false },
  { id:"4", author:"miniaturist_can", poodle:"Coco",    avatar:"🌸", time:"2 gün önce",    text:"Coco'nun yeni mama markasını denedik. Royal Canin Toy Breed'den çok memnunuz. Tavsiye ederim 👍", likes:27, comments:9, liked:false },
  { id:"5", author:"poodle_istanbul", poodle:"Mochi",   avatar:"⭐", time:"3 gün önce",    text:"Ağırlık kontrolü için hepinize soruyorum — sizin poodleniz kaç kilo? Mochi 3.2 kg, idealmiş! 🐕", likes:61, comments:31, liked:false },
  { id:"6", author:"toy_lover_ece",   poodle:"Şeker",   avatar:"🎀", time:"4 gün önce",    text:"Şeker'in yeni figür fotoğrafları! 5 yaşında ama enerji olarak hiç yaşlanmıyor 🏃", likes:45, comments:15, liked:false },
  { id:"7", author:"poodle_ankara",   poodle:"Fıstık",  avatar:"🤍", time:"5 gün önce",    text:"Fıstık ilk kez karla tanıştı! Çok korktu önce sonra aşık oldu 😂❄️", likes:108, comments:44, liked:false },
  { id:"8", author:"kucuk_poodle",    poodle:"Pamuk",   avatar:"☁️", time:"1 hafta önce",  text:"Pamuk'un veteriner kontrolünden mükemmel not aldık! Herkesin poodle'ı böyle sağlıklı olsun 🏥", likes:77, comments:19, liked:false },
];

const CSS = [
  "*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}",
  "body{background:#F7F5FF;}",
  ".icon-btn{background:none;border:none;cursor:pointer;display:flex;align-items:center;padding:6px;border-radius:8px;}",
  ".post-action:hover{background:#F5F0FF;}",
].join("\n");

export default function Topluluk() {
  const [, navigate] = useLocation();
  const { isLoggedIn } = useCustomer();
  const [activeLang, setActiveLang] = useState(LANGUAGES[0]);
  const [langOpen, setLangOpen]   = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch]       = useState("");
  const [posts, setPosts]         = useState(ALL_POSTS);

  const filtered = search ? posts.filter(p=>p.text.toLowerCase().includes(search.toLowerCase())||p.author.toLowerCase().includes(search.toLowerCase())) : posts;
  const handleLike = (id:string) => setPosts(ps=>ps.map(p=>p.id===id?{...p,liked:!p.liked}:p));

  return (
    <>
      <title>Topluluk — YourPoodle</title>
      <style>{CSS}</style>

      {drawerOpen&&<div onClick={()=>setDrawerOpen(false)} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.3)",zIndex:199 }}/>}
      <div style={{ position:"fixed",top:0,left:0,height:"100%",width:280,background:"#fff",zIndex:200,transform:drawerOpen?"translateX(0)":"translateX(-100%)",transition:"transform 0.24s ease",boxShadow:"4px 0 24px rgba(0,0,0,0.12)" }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 18px 14px",borderBottom:"1px solid #f2f2f2" }}>
          <img src="/images/yourpoodle-logo.jpg" alt="YourPoodle" style={{ height:32,objectFit:"contain" }}/>
          <button className="icon-btn" onClick={()=>setDrawerOpen(false)}><X size={20} color="#444"/></button>
        </div>
        <nav>{DRAWER_LINKS.map(({label,href})=>(
          <button key={label} onClick={()=>{setDrawerOpen(false);navigate(href);}}
            style={{ display:"block",width:"100%",textAlign:"left",padding:"14px 20px",fontSize:15,fontWeight:600,color:"#222",background:"none",border:"none",borderBottom:"1px solid #fafafa",cursor:"pointer",fontFamily:"Inter,sans-serif" }}>{label}</button>
        ))}</nav>
      </div>

      <div style={{ minHeight:"100vh",background:"#F7F5FF",fontFamily:"Inter,sans-serif",paddingBottom:90 }}>
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

        <div style={{ padding:"16px 14px 0" }}>
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:18,fontWeight:900,color:"#1a1a1a",marginBottom:4 }}>👥 Topluluk Paylaşımları</div>
            <div style={{ fontSize:12,color:"#888" }}>10.000+ poodle sahibinin paylaşımları</div>
          </div>

          {/* Search */}
          <div style={{ display:"flex",alignItems:"center",background:"#fff",border:"1.5px solid #ececec",borderRadius:14,height:46,overflow:"hidden",marginBottom:16 }}>
            <div style={{ paddingLeft:14,color:"#bbb",display:"flex" }}><Search size={17} strokeWidth={2}/></div>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Paylaşım ara..."
              style={{ flex:1,border:"none",outline:"none",fontSize:13,fontWeight:600,color:"#333",background:"transparent",padding:"0 10px",fontFamily:"Inter,sans-serif" }}/>
            {search&&<button onClick={()=>setSearch("")} style={{ background:"none",border:"none",cursor:"pointer",paddingRight:12,color:"#bbb" }}><X size={15}/></button>}
          </div>

          {/* Join CTA for guests */}
          {!isLoggedIn&&(
            <div style={{ background:"#fff",borderRadius:16,padding:"14px 16px",marginBottom:16,border:"1.5px solid #EDE8FF",display:"flex",alignItems:"center",gap:12 }}>
              <span style={{ fontSize:26 }}>✏️</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13,fontWeight:800,color:"#1a1a1a" }}>Siz de paylaşın!</div>
                <div style={{ fontSize:11,color:"#888" }}>Ücretsiz üye olun ve toplulukla paylaşın</div>
              </div>
              <button onClick={()=>navigate("/yourpoodle/giris")}
                style={{ padding:"8px 14px",borderRadius:12,border:"none",background:"#7C3AFF",color:"#fff",fontSize:12,fontWeight:800,cursor:"pointer",fontFamily:"Inter,sans-serif",whiteSpace:"nowrap" }}>Katıl</button>
            </div>
          )}

          {/* Posts */}
          {filtered.map(post=>(
            <div key={post.id} style={{ background:"#fff",borderRadius:18,boxShadow:"0 2px 16px rgba(0,0,0,0.07)",overflow:"hidden",marginBottom:14 }}>
              <div style={{ display:"flex",alignItems:"center",gap:10,padding:"14px 16px 10px" }}>
                <div style={{ width:42,height:42,borderRadius:"50%",background:"linear-gradient(135deg,#EDE8FF,#D4C4FF)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>{post.avatar}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                    <span style={{ fontSize:13,fontWeight:800,color:"#1a1a1a" }}>@{post.author}</span>
                    <span style={{ fontSize:11,background:"#EDE8FF",color:"#7C3AFF",borderRadius:6,padding:"1px 7px",fontWeight:700 }}>🐩 {post.poodle}</span>
                  </div>
                  <span style={{ fontSize:11,color:"#aaa" }}>{post.time}</span>
                </div>
              </div>
              <p style={{ fontSize:13.5,color:"#333",lineHeight:1.65,padding:"0 16px 12px",fontFamily:"Inter,sans-serif" }}>{post.text}</p>
              <div style={{ display:"flex",borderTop:"1px solid #f5f5f5",padding:"4px 8px" }}>
                <button className="post-action" onClick={()=>handleLike(post.id)} style={{ display:"flex",alignItems:"center",gap:6,padding:"9px 14px",borderRadius:10,border:"none",background:"none",cursor:"pointer",flex:1,justifyContent:"center",fontFamily:"Inter,sans-serif" }}>
                  <Heart size={18} strokeWidth={2} color={post.liked?"#E75480":"#aaa"} fill={post.liked?"#E75480":"none"}/>
                  <span style={{ fontSize:12,fontWeight:700,color:post.liked?"#E75480":"#aaa" }}>{post.likes+(post.liked?1:0)}</span>
                </button>
                <button className="post-action" style={{ display:"flex",alignItems:"center",gap:6,padding:"9px 14px",borderRadius:10,border:"none",background:"none",cursor:"pointer",flex:1,justifyContent:"center",fontFamily:"Inter,sans-serif" }}>
                  <MessageCircle size={18} strokeWidth={2} color="#aaa"/>
                  <span style={{ fontSize:12,fontWeight:700,color:"#aaa" }}>{post.comments}</span>
                </button>
                <button className="post-action" onClick={()=>{ if(navigator.share){navigator.share({title:"YourPoodle",text:post.text.slice(0,100),url:window.location.href}).catch(()=>{});}else{navigator.clipboard?.writeText(window.location.href).catch(()=>{});} }} style={{ display:"flex",alignItems:"center",gap:6,padding:"9px 14px",borderRadius:10,border:"none",background:"none",cursor:"pointer",flex:1,justifyContent:"center",fontFamily:"Inter,sans-serif" }}>
                  <Share2 size={18} strokeWidth={2} color="#aaa"/>
                  <span style={{ fontSize:12,fontWeight:700,color:"#aaa" }}>Paylaş</span>
                </button>
              </div>
            </div>
          ))}

          {filtered.length===0&&(
            <div style={{ textAlign:"center",padding:"40px 24px",color:"#aaa" }}>
              <div style={{ fontSize:36,marginBottom:12 }}>🔍</div>
              <div style={{ fontSize:14,fontWeight:700,color:"#555",marginBottom:4 }}>Sonuç bulunamadı</div>
              <button onClick={()=>setSearch("")} style={{ marginTop:12,padding:"8px 20px",borderRadius:20,background:"#7C3AFF",color:"#fff",border:"none",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"Inter,sans-serif" }}>Tümünü Göster</button>
            </div>
          )}

          {/* Load more */}
          <div style={{ textAlign:"center",padding:"8px 0 16px" }}>
            <button onClick={()=>navigate("/yourpoodle/club")}
              style={{ padding:"10px 28px",borderRadius:20,border:"2px solid #7C3AFF",background:"#fff",color:"#7C3AFF",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"Inter,sans-serif" }}>
              Club'da Daha Fazla Gör 🐾
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
