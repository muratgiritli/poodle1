import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Search, ShoppingBag, ChevronDown, Menu, X, Home, Users, BookOpen, Monitor, SlidersHorizontal, Heart } from "lucide-react";
import { useCustomer } from "@/contexts/CustomerContext";
import { useQuery } from "@tanstack/react-query";

const LANGUAGES = [{ code:"TR", flag:"🇹🇷" },{ code:"EN", flag:"🇺🇸" }];

const SORT_OPTIONS = ["Önerilen","Fiyat ↑","Fiyat ↓","En Yeni"];

function BottomNav() {
  return (
    <nav style={{ position:"fixed",bottom:0,left:0,right:0,background:"#fff",borderTop:"1px solid #f0f0f0",boxShadow:"0 -4px 20px rgba(0,0,0,0.08)",height:64,display:"flex",alignItems:"center",justifyContent:"space-around",zIndex:200,padding:"0 8px" }}>
      {[{label:"Ana Sayfa",icon:<Home size={22} strokeWidth={2}/>},{label:"Club",icon:<Users size={22} strokeWidth={2}/>}].map(({label,icon})=>(
        <a key={label} href="/" style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:3,textDecoration:"none",flex:1,color:"#aaa" }}>{icon}<span style={{ fontSize:10,fontWeight:700,fontFamily:"'Inter',sans-serif" }}>{label}</span></a>
      ))}
      <a href="/yourpoodle/magaza" style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:3,textDecoration:"none",flex:1,position:"relative" }}>
        <div style={{ width:54,height:54,borderRadius:"50%",background:"linear-gradient(135deg,#9B59FF,#7C3AFF)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 6px 20px rgba(124,58,255,0.4)",position:"absolute",top:-24 }}>
          <ShoppingBag size={24} color="#fff" strokeWidth={2.2}/>
        </div>
        <span style={{ fontSize:10,fontWeight:700,color:"#7C3AFF",fontFamily:"'Inter',sans-serif",marginTop:32 }}>Mağaza</span>
      </a>
      {[{label:"Rehber",icon:<BookOpen size={22} strokeWidth={2}/>,href:"/yourpoodle/rehber"},{label:"Bilgi Bankası",icon:<Monitor size={22} strokeWidth={2}/>,href:"/yourpoodle/bilgi"}].map(({label,icon,href})=>(
        <a key={label} href={href} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:3,textDecoration:"none",flex:1,color:"#aaa" }}>{icon}<span style={{ fontSize:10,fontWeight:700,fontFamily:"'Inter',sans-serif" }}>{label}</span></a>
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
  const [sort, setSort] = useState("Önerilen");
  const [wishlist, setWishlist] = useState<number[]>([]);

  const { data: allProducts = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/products"],
    staleTime: 5 * 60 * 1000,
  });

  const { data: brandCategories = [] } = useQuery<any[]>({
    queryKey: ["/api/brand-categories"],
    staleTime: 10 * 60 * 1000,
  });

  // Gerçek kategorileri API'dan al; en çok geçen subcategory'leri göster
  const cats = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of allProducts) {
      if (p.animal !== "kopek") continue;
      const sub = p.subcategory || p.mamaType || "";
      if (sub) counts[sub] = (counts[sub] || 0) + 1;
    }
    // En çok ürünü olan 5 kategoriyi göster
    const top5 = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([k]) => k);
    return ["Tümü", ...top5];
  }, [allProducts]);

  const filtered = useMemo(() => {
    let list = allProducts.filter((p: any) => {
      const matchAnimal = p.animal === "kopek";
      const matchCat = activeCat === "Tümü" || (p.subcategory || p.mamaType || "") === activeCat;
      const matchQ   = search === "" || p.name.toLowerCase().includes(search.toLowerCase());
      return matchAnimal && matchCat && matchQ;
    });
    if (sort === "Fiyat ↑") list = [...list].sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === "Fiyat ↓") list = [...list].sort((a, b) => Number(b.price) - Number(a.price));
    if (sort === "En Yeni")  list = [...list].sort((a, b) => b.id - a.id);
    return list;
  }, [allProducts, activeCat, search, sort]);

  const toggleWish = (id: number) =>
    setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);

  return (
    <>
      <style>{[
        "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');",
        "*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}",
        "body{background:#fff;}",
        ".noscroll::-webkit-scrollbar{display:none;} .noscroll{-ms-overflow-style:none;scrollbar-width:none;}",
        ".icon-btn{background:none;border:none;cursor:pointer;display:flex;align-items:center;padding:6px;border-radius:8px;}",
        ".prod-card:active{transform:scale(0.97);} .prod-card{transition:transform 0.1s;cursor:pointer;}",
      ].join(" ")}</style>

      <div style={{ minHeight:"100vh", background:"#F8F8F8", fontFamily:"'Inter',sans-serif", paddingBottom:80 }}>

        {/* DRAWER OVERLAY */}
        {drawerOpen && <div onClick={()=>setDrawerOpen(false)} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.3)",zIndex:199 }}/>}
        <div style={{ position:"fixed",top:0,left:0,height:"100%",width:280,background:"#fff",zIndex:200,transform:drawerOpen?"translateX(0)":"translateX(-100%)",transition:"transform 0.24s ease",boxShadow:"4px 0 24px rgba(0,0,0,0.12)" }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 18px 14px",borderBottom:"1px solid #f2f2f2" }}>
            <img src="/images/yourpoodle-logo.jpg" alt="YourPoodle" style={{ height:32,objectFit:"contain" }}/>
            <button className="icon-btn" onClick={()=>setDrawerOpen(false)}><X size={20} color="#444"/></button>
          </div>
          <nav>
            {[{l:"Ana Sayfa",h:"/"},{l:"Rehber",h:"/yourpoodle/rehber"},{l:"Bilgi Bankası",h:"/yourpoodle/bilgi"},{l:"Mağaza",h:"/yourpoodle/magaza"},{l:"Mama",h:"/yourpoodle/mama"},{l:"Eğitim",h:"/yourpoodle/egitim"},{l:"Sağlık",h:"/yourpoodle/saglik"},{l:"Bakım",h:"/yourpoodle/bakim"},{l:"Poodle Club",h:"/yourpoodle/club"},{l:"Etkinlikler",h:"/yourpoodle/etkinlikler"}].map(({l,h})=>(
              <button key={l} onClick={()=>{setDrawerOpen(false);navigate(h);}} style={{ display:"block",width:"100%",textAlign:"left",padding:"14px 20px",fontSize:15,fontWeight:600,color:h==="/yourpoodle/magaza"?"#7C3AFF":"#222",background:h==="/yourpoodle/magaza"?"#F5F0FF":"none",border:"none",borderBottom:"1px solid #fafafa",cursor:"pointer",fontFamily:"Inter,sans-serif" }}>{l}</button>
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
              <button className="icon-btn" onClick={()=>navigate(isLoggedIn?"/hesabim":"/yourpoodle/giris")}
                style={{ padding:"6px 13px",borderRadius:20,border:"2px solid",borderColor:isLoggedIn?"#22C55E":"#7C3AFF",background:isLoggedIn?"#F0FDF4":"#F5F0FF",color:isLoggedIn?"#16A34A":"#7C3AFF",fontSize:12,fontWeight:800,whiteSpace:"nowrap" }}>
                {isLoggedIn?"Hesabım 👤":"Üye Girişi"}
              </button>
              <div style={{ position:"relative" }}>
                <button className="icon-btn" onClick={()=>setLangOpen(!langOpen)} style={{ gap:3,padding:"5px 6px" }}>
                  <span style={{ fontSize:14 }}>{activeLang.flag}</span>
                  <span style={{ fontSize:12,fontWeight:700,color:"#6C47FF" }}>{activeLang.code}</span>
                  <ChevronDown size={12} color="#6C47FF" strokeWidth={2.5} style={{ transform:langOpen?"rotate(180deg)":"none",transition:"transform 0.18s" }}/>
                </button>
                {langOpen && (
                  <div style={{ position:"absolute",right:0,top:36,background:"#fff",borderRadius:12,border:"1px solid #eee",boxShadow:"0 8px 28px rgba(0,0,0,0.12)",zIndex:150,minWidth:110,padding:"4px 0" }}>
                    {LANGUAGES.map(l=>(
                      <button key={l.code} onClick={()=>{setActiveLang(l);setLangOpen(false);}}
                        style={{ display:"flex",alignItems:"center",gap:8,width:"100%",padding:"9px 14px",border:"none",background:activeLang.code===l.code?"#F5F0FF":"transparent",cursor:"pointer",fontSize:13,fontWeight:700,color:activeLang.code===l.code?"#6C47FF":"#333",fontFamily:"Inter,sans-serif" }}>
                        <span style={{ fontSize:16 }}>{l.flag}</span>{l.code}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Sub-nav */}
          <div style={{ display:"flex",borderTop:"1px solid #f0f0f0" }}>
            {[{label:"Ana Sayfa",href:"/"},{label:"Rehber",href:"/yourpoodle/rehber"},{label:"Bilgi Bankası",href:"/yourpoodle/bilgi"},{label:"Mağaza",href:"/yourpoodle/magaza"}].map(t=>(
              <button key={t.label} onClick={()=>navigate(t.href)} style={{ flex:1,padding:"11px 4px",fontSize:13.5,fontWeight:t.label==="Mağaza"?700:500,color:t.label==="Mağaza"?"#6C47FF":"#555",background:"none",border:"none",borderBottom:t.label==="Mağaza"?"2.5px solid #6C47FF":"2.5px solid transparent",cursor:"pointer",fontFamily:"Inter,sans-serif" }}>{t.label}</button>
            ))}
          </div>
        </header>

        {/* SEARCH + FILTER */}
        <div style={{ background:"#fff",padding:"12px 16px",borderBottom:"1px solid #f0f0f0" }}>
          <div style={{ display:"flex",gap:10 }}>
            <div style={{ flex:1,display:"flex",alignItems:"center",background:"#F7F7F7",border:"1.5px solid #ececec",borderRadius:12,height:44,overflow:"hidden" }}>
              <div style={{ paddingLeft:12,color:"#bbb",display:"flex" }}><Search size={17} strokeWidth={2}/></div>
              <input
                value={search}
                onChange={e=>setSearch(e.target.value)}
                placeholder="Ürün ara…"
                style={{ flex:1,border:"none",outline:"none",fontSize:13,fontWeight:600,color:"#333",background:"transparent",padding:"0 10px",fontFamily:"'Inter',sans-serif" }}
              />
              {search && (
                <button onClick={()=>setSearch("")} style={{ paddingRight:12,background:"none",border:"none",cursor:"pointer",color:"#aaa" }}>
                  <X size={14}/>
                </button>
              )}
            </div>
            <button style={{ width:44,height:44,borderRadius:12,border:"1.5px solid #ececec",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0 }}>
              <SlidersHorizontal size={18} color="#555" strokeWidth={2}/>
            </button>
          </div>
        </div>

        {/* CATEGORY CHIPS */}
        <div style={{ background:"#fff",padding:"10px 16px 12px",borderBottom:"1px solid #f0f0f0" }}>
          <div className="noscroll" style={{ display:"flex",gap:8,overflowX:"auto" }}>
            {cats.map(c => (
              <button key={c} onClick={()=>setActiveCat(c)}
                style={{ flexShrink:0,padding:"7px 16px",borderRadius:20,border:"1.5px solid",borderColor:activeCat===c?"#7C3AFF":"#e8e8e8",background:activeCat===c?"#7C3AFF":"#fff",color:activeCat===c?"#fff":"#555",fontSize:12.5,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all 0.15s" }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* SORT + COUNT */}
        <div style={{ padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <span style={{ fontSize:12,color:"#888" }}>
            {isLoading ? "Yükleniyor…" : `${filtered.length} ürün`}
          </span>
          <div style={{ display:"flex",gap:6 }}>
            {SORT_OPTIONS.map(s => (
              <button key={s} onClick={()=>setSort(s)}
                style={{ padding:"5px 10px",borderRadius:8,border:"1.5px solid",borderColor:sort===s?"#7C3AFF":"#e8e8e8",background:sort===s?"#EDE8FF":"#fff",color:sort===s?"#7C3AFF":"#555",fontSize:11.5,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif" }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* LOADING */}
        {isLoading && (
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,padding:"0 12px 24px" }}>
            {Array.from({length:9}).map((_,i)=>(
              <div key={i} style={{ background:"#f0f0f0",borderRadius:16,height:170,animation:"pulse 1.5s infinite" }}/>
            ))}
          </div>
        )}

        {/* PRODUCT GRID */}
        {!isLoading && (
          <div style={{ padding:"0 12px 24px",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10 }}>
            {filtered.map((p: any) => (
              <div
                key={p.id}
                className="prod-card"
                onClick={() => navigate(`/urun/${p.id}`)}
                style={{ background:"#fff",borderRadius:16,overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}
              >
                {/* image */}
                <div style={{ background:"#F0ECFF",height:90,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden" }}>
                  {p.img
                    ? <img src={p.img} alt={p.name} style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
                    : <span style={{ fontSize:36 }}>🐾</span>
                  }
                  {p.originalPrice && Number(p.originalPrice) > Number(p.price) && (
                    <div style={{ position:"absolute",top:6,left:6,background:"#EF4444",borderRadius:6,padding:"2px 6px" }}>
                      <span style={{ fontSize:8,fontWeight:800,color:"#fff" }}>İNDİRİM</span>
                    </div>
                  )}
                  <button
                    onClick={e=>{e.stopPropagation();toggleWish(p.id);}}
                    style={{ position:"absolute",top:6,right:6,background:"rgba(255,255,255,0.85)",border:"none",borderRadius:"50%",width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}
                  >
                    <Heart size={12} color={wishlist.includes(p.id)?"#E75480":"#bbb"} fill={wishlist.includes(p.id)?"#E75480":"none"} strokeWidth={2}/>
                  </button>
                </div>
                {/* info */}
                <div style={{ padding:"8px 8px 10px",flex:1,display:"flex",flexDirection:"column",justifyContent:"space-between" }}>
                  <div style={{ fontSize:10,fontWeight:700,color:"#1a1a1a",lineHeight:1.35,marginBottom:5,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical" as any,overflow:"hidden" }}>
                    {p.name}
                  </div>
                  <div>
                    <div style={{ fontSize:13,fontWeight:900,color:"#7C3AFF" }}>
                      ₺{Number(p.price).toLocaleString("tr-TR",{minimumFractionDigits:0,maximumFractionDigits:0})}
                    </div>
                    {p.originalPrice && Number(p.originalPrice) > Number(p.price) && (
                      <div style={{ fontSize:10,color:"#bbb",textDecoration:"line-through" }}>
                        ₺{Number(p.originalPrice).toLocaleString("tr-TR",{minimumFractionDigits:0,maximumFractionDigits:0})}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {!isLoading && filtered.length === 0 && (
              <div style={{ gridColumn:"1/-1",textAlign:"center",padding:"48px 16px",color:"#aaa" }}>
                <div style={{ fontSize:40,marginBottom:12 }}>🔍</div>
                <div style={{ fontSize:15,fontWeight:700 }}>Ürün bulunamadı</div>
                <div style={{ fontSize:12,marginTop:6 }}>Farklı bir arama deneyin veya filtreyi temizleyin.</div>
                {(search || activeCat !== "Tümü") && (
                  <button onClick={()=>{setSearch("");setActiveCat("Tümü");}}
                    style={{ marginTop:16,padding:"8px 20px",borderRadius:20,border:"none",background:"#7C3AFF",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer" }}>
                    Filtreyi Temizle
                  </button>
                )}
              </div>
            )}
          </div>
        )}

      </div>
      <BottomNav />
    </>
  );
}
