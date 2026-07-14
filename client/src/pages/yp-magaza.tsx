import { useState } from "react";
import { useLocation } from "wouter";
import { Search, ShoppingBag, ChevronDown, Menu, X, Home, Users, BookOpen, Monitor, SlidersHorizontal, Plus, Heart } from "lucide-react";
import { useCustomer } from "@/contexts/CustomerContext";

const LANGUAGES = [{ code:"TR", flag:"🇹🇷" },{ code:"EN", flag:"🇺🇸" }];

const CATS = ["Tümü","Mama","Aksesuar","Bakım","Oyuncak","Sağlık","Giyim"];

const PRODUCTS = [
  { id:1,  emoji:"🍖", name:"Royal Canin Poodle Adult 3kg",   price:485,  oldPrice:560,  cat:"Mama",    badge:"En Çok Satan", rating:4.9, reviews:248 },
  { id:2,  emoji:"✂️", name:"Slicker Tıraş Fırçası Pro",      price:129,  oldPrice:null, cat:"Bakım",   badge:"",             rating:4.7, reviews:89  },
  { id:3,  emoji:"🎀", name:"Poodle Fiyonk Seti 5'li",        price:79,   oldPrice:null, cat:"Aksesuar",badge:"Yeni",          rating:4.8, reviews:42  },
  { id:4,  emoji:"💊", name:"Eklem Takviyesi Kapsül 60'lı",   price:320,  oldPrice:399,  cat:"Sağlık",  badge:"İndirim",      rating:4.6, reviews:134 },
  { id:5,  emoji:"🛁", name:"Poodle Şampuanı 500ml",          price:189,  oldPrice:null, cat:"Bakım",   badge:"",             rating:4.5, reviews:67  },
  { id:6,  emoji:"🏠", name:"Taşıma Çantası Soft Pembe",      price:599,  oldPrice:750,  cat:"Aksesuar",badge:"",             rating:4.8, reviews:56  },
  { id:7,  emoji:"🧶", name:"Interaktif Tünel Oyuncak",       price:149,  oldPrice:null, cat:"Oyuncak", badge:"Popüler",      rating:4.7, reviews:103 },
  { id:8,  emoji:"🪮", name:"Profesyonel Tarak Seti 4'lü",   price:219,  oldPrice:null, cat:"Bakım",   badge:"",             rating:4.6, reviews:78  },
  { id:9,  emoji:"🎾", name:"Mini Tenis Topu 3'lü Paket",     price:59,   oldPrice:null, cat:"Oyuncak", badge:"",             rating:4.4, reviews:211 },
  { id:10, emoji:"👗", name:"Poodle Kıyafet Set Kış",         price:249,  oldPrice:299,  cat:"Giyim",   badge:"Yeni",         rating:4.5, reviews:34  },
  { id:11, emoji:"🦷", name:"Köpek Diş Fırçası Seti",        price:89,   oldPrice:null, cat:"Sağlık",  badge:"",             rating:4.3, reviews:56  },
  { id:12, emoji:"🥩", name:"Poodle Ödül Maması 200g",        price:119,  oldPrice:null, cat:"Mama",    badge:"Organik",      rating:4.9, reviews:189 },
];

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
        <a key={label} href="/" style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:3,textDecoration:"none",flex:1,color:"#aaa" }}>{icon}<span style={{ fontSize:10,fontWeight:700,fontFamily:"'Inter',sans-serif" }}>{label}</span></a>
      ))}
    </nav>
  );
}

export default function Magaza() {
  const [, navigate] = useLocation();
  const [activeLang, setActiveLang] = useState(LANGUAGES[0]);
  const [langOpen, setLangOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isLoggedIn } = useCustomer();
  const [activeCat, setActiveCat] = useState("Tümü");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<number[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [sort, setSort] = useState("Önerilen");

  const filtered = PRODUCTS.filter(p =>
    (activeCat === "Tümü" || p.cat === activeCat) &&
    (search === "" || p.name.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleCart = (id: number) => setCart(c => c.includes(id) ? c.filter(x=>x!==id) : [...c, id]);
  const toggleWish = (id: number) => setWishlist(w => w.includes(id) ? w.filter(x=>x!==id) : [...w, id]);

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'); *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;} body{background:#fff;} .noscroll::-webkit-scrollbar{display:none;} .noscroll{-ms-overflow-style:none;scrollbar-width:none;} .icon-btn{background:none;border:none;cursor:pointer;display:flex;align-items:center;padding:6px;border-radius:8px;} .prod-card:active{transform:scale(0.97);} .prod-card{transition:transform 0.1s;}`}</style>

      <div style={{ minHeight:"100vh", background:"#F8F8F8", fontFamily:"'Inter',sans-serif", paddingBottom:80 }}>

        {drawerOpen && <div onClick={()=>setDrawerOpen(false)} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.3)",zIndex:199 }}/>}
        <div style={{ position:"fixed",top:0,left:0,height:"100%",width:280,background:"#fff",zIndex:200,transform:drawerOpen?"translateX(0)":"translateX(-100%)",transition:"transform 0.24s ease",boxShadow:"4px 0 24px rgba(0,0,0,0.12)" }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 18px 14px",borderBottom:"1px solid #f2f2f2" }}>
            <img src="/images/yourpoodle-logo.jpg" alt="YourPoodle" style={{ height:32,objectFit:"contain" }}/>
            <button className="icon-btn" onClick={()=>setDrawerOpen(false)}><X size={20} color="#444"/></button>
          </div>
          <nav>
            {[{l:"Ana Sayfa",h:"/"},{l:"Rehber",h:"/yourpoodle/rehber"},{l:"Bilgi Bankası",h:"/yourpoodle/bilgi"},{l:"Mağaza",h:"/yourpoodle/magaza"},{l:"Club",h:"/yourpoodle/club"}].map(({l,h})=>(
              <button key={l} onClick={()=>{setDrawerOpen(false);navigate(h);}} style={{ display:"block",width:"100%",textAlign:"left",padding:"14px 20px",fontSize:15,fontWeight:600,color:"#222",background:"none",border:"none",borderBottom:"1px solid #fafafa",cursor:"pointer",fontFamily:"Inter,sans-serif" }}>{l}</button>
            ))}
          </nav>
        </div>

        {/* HEADER */}
        <header style={{ position:"sticky",top:0,zIndex:100,background:"#fff",borderBottom:"1px solid #f0f0f0" }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px" }}>
            {/* Sol */}
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              <button className="icon-btn" onClick={()=>setDrawerOpen(true)}><Menu size={22} color="#333" strokeWidth={2}/></button>
              <button className="icon-btn" onClick={()=>navigate("/")} style={{ padding:0 }}>
                <img src="/images/yourpoodle-logo.jpg" alt="YourPoodle" style={{ height:30,width:120,objectFit:"contain",objectPosition:"left center" }}/>
              </button>
            </div>
            {/* Sağ */}
            <div style={{ display:"flex",alignItems:"center",gap:6 }}>
              <button className="icon-btn" onClick={()=>navigate(isLoggedIn?"/":"/yourpoodle/giris")}
                style={{ padding:"6px 13px",borderRadius:20,border:"2px solid",borderColor:isLoggedIn?"#22C55E":"#7C3AFF",background:isLoggedIn?"#F0FDF4":"#F5F0FF",color:isLoggedIn?"#16A34A":"#7C3AFF",fontSize:12,fontWeight:800,whiteSpace:"nowrap" }}>
                {isLoggedIn?"Hesabım 👤":"Üye Girişi"}
              </button>
              <div style={{ position:"relative" }}>
                <button className="icon-btn" onClick={()=>setLangOpen(!langOpen)} style={{ gap:3,padding:"5px 6px" }}>
                  <span style={{ fontSize:14 }}>{activeLang.flag}</span>
                  <span style={{ fontSize:12,fontWeight:700,color:"#6C47FF" }}>{activeLang.code}</span>
                  <ChevronDown size={12} color="#6C47FF" strokeWidth={2.5} style={{ transform:langOpen?"rotate(180deg)":"none",transition:"transform 0.18s" }}/>
                </button>
                {langOpen&&<div style={{ position:"absolute",right:0,top:36,background:"#fff",borderRadius:12,border:"1px solid #eee",boxShadow:"0 8px 28px rgba(0,0,0,0.12)",zIndex:150,minWidth:110,padding:"4px 0" }}>{LANGUAGES.map(l=><button key={l.code} onClick={()=>{setActiveLang(l);setLangOpen(false);}} style={{ display:"flex",alignItems:"center",gap:8,width:"100%",padding:"9px 14px",border:"none",background:activeLang.code===l.code?"#F5F0FF":"transparent",cursor:"pointer",fontSize:13,fontWeight:700,color:activeLang.code===l.code?"#6C47FF":"#333",fontFamily:"Inter,sans-serif" }}><span style={{ fontSize:16 }}>{l.flag}</span>{l.code}</button>)}</div>}
              </div>
            </div>
          </div>
          <div style={{ display:"flex",borderTop:"1px solid #f0f0f0" }}>
            {[{label:"Ana Sayfa",href:"/"},{label:"Rehber",href:"/yourpoodle/rehber"},{label:"Bilgi Bankası",href:"/yourpoodle/bilgi"},{label:"Mağaza",href:"/yourpoodle/magaza"}].map(t=>(
              <button key={t.label} onClick={()=>navigate(t.href)} style={{ flex:1,padding:"11px 4px",fontSize:13.5,fontWeight:t.label==="Mağaza"?700:500,color:t.label==="Mağaza"?"#6C47FF":"#555",background:"none",border:"none",borderBottom:t.label==="Mağaza"?"2.5px solid #6C47FF":"2.5px solid transparent",cursor:"pointer",fontFamily:"Inter,sans-serif" }}>{t.label}</button>
            ))}
          </div>
        </header>

        {/* SEARCH + FILTER */}
        <div style={{ background:"#fff", padding:"12px 16px", borderBottom:"1px solid #f0f0f0" }}>
          <div style={{ display:"flex", gap:10 }}>
            <div style={{ flex:1, display:"flex", alignItems:"center", background:"#F7F7F7", border:"1.5px solid #ececec", borderRadius:12, height:44, overflow:"hidden" }}>
              <div style={{ paddingLeft:12, color:"#bbb", display:"flex" }}><Search size={17} strokeWidth={2}/></div>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Ürün ara..." style={{ flex:1,border:"none",outline:"none",fontSize:13,fontWeight:600,color:"#333",background:"transparent",padding:"0 10px",fontFamily:"'Inter',sans-serif" }}/>
            </div>
            <button style={{ width:44, height:44, borderRadius:12, border:"1.5px solid #ececec", background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0 }}>
              <SlidersHorizontal size={18} color="#555" strokeWidth={2}/>
            </button>
          </div>
        </div>

        {/* CATEGORY CHIPS */}
        <div style={{ background:"#fff", padding:"10px 16px 12px", borderBottom:"1px solid #f0f0f0" }}>
          <div className="noscroll" style={{ display:"flex", gap:8, overflowX:"auto" }}>
            {CATS.map(c => (
              <button key={c} onClick={()=>setActiveCat(c)} style={{ flexShrink:0, padding:"7px 16px", borderRadius:20, border:"1.5px solid", borderColor:activeCat===c?"#7C3AFF":"#e8e8e8", background:activeCat===c?"#7C3AFF":"#fff", color:activeCat===c?"#fff":"#555", fontSize:12.5, fontWeight:700, cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>{c}</button>
            ))}
          </div>
        </div>

        {/* SORT + COUNT */}
        <div style={{ padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:12, color:"#888" }}>{filtered.length} ürün</span>
          <div style={{ display:"flex", gap:6 }}>
            {["Önerilen","Fiyat ↑","Fiyat ↓","Yeni"].map(s=>(
              <button key={s} onClick={()=>setSort(s)} style={{ padding:"5px 10px", borderRadius:8, border:"1.5px solid", borderColor:sort===s?"#7C3AFF":"#e8e8e8", background:sort===s?"#EDE8FF":"#fff", color:sort===s?"#7C3AFF":"#555", fontSize:11.5, fontWeight:700, cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>{s}</button>
            ))}
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div style={{ padding:"0 12px 24px", display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
          {filtered.map(p => (
            <div key={p.id} className="prod-card" style={{ background:"#fff", borderRadius:16, overflow:"hidden", cursor:"pointer", display:"flex", flexDirection:"column", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
              {/* image area */}
              <div style={{ background:"#F0ECFF", height:90, display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, position:"relative" }}>
                {p.emoji}
                {p.badge && <div style={{ position:"absolute", top:6, left:6, background:"#7C3AFF", borderRadius:6, padding:"2px 6px" }}><span style={{ fontSize:8, fontWeight:800, color:"#fff" }}>{p.badge}</span></div>}
                <button onClick={e=>{e.stopPropagation();toggleWish(p.id);}} style={{ position:"absolute", top:6, right:6, background:"rgba(255,255,255,0.85)", border:"none", borderRadius:"50%", width:24, height:24, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                  <Heart size={12} color={wishlist.includes(p.id)?"#E75480":"#bbb"} fill={wishlist.includes(p.id)?"#E75480":"none"} strokeWidth={2}/>
                </button>
              </div>
              {/* info */}
              <div style={{ padding:"8px 8px 10px", flex:1, display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
                <div style={{ fontSize:10.5, fontWeight:700, color:"#1a1a1a", lineHeight:1.3, marginBottom:5 }}>{p.name}</div>
                <div style={{ display:"flex", alignItems:"center", gap:3, marginBottom:6 }}>
                  <span style={{ fontSize:9, color:"#F59E0B" }}>★</span>
                  <span style={{ fontSize:9, color:"#888" }}>{p.rating} ({p.reviews})</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:900, color:"#7C3AFF" }}>₺{p.price}</div>
                    {p.oldPrice && <div style={{ fontSize:10, color:"#bbb", textDecoration:"line-through" }}>₺{p.oldPrice}</div>}
                  </div>
                  <button onClick={e=>{e.stopPropagation();toggleCart(p.id);}} style={{ width:28, height:28, borderRadius:8, border:"none", background:cart.includes(p.id)?"#7C3AFF":"#EDE8FF", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                    {cart.includes(p.id) ? <span style={{ fontSize:13 }}>✓</span> : <Plus size={14} color="#7C3AFF" strokeWidth={2.5}/>}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
      <BottomNav />
    </>
  );
}
