import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import { Search, Heart, SlidersHorizontal, X, ShoppingCart, ChevronRight, ChevronDown, Trash2, Plus, Minus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import YPLayout from "@/components/yourpoodle/YPLayout";

/* ─── Types ─────────────────────────────────────────── */
interface Product {
  id: number; name: string; price: number; originalPrice?: number;
  img?: string; stock: number; isActive: boolean;
  mamaType?: string; subcategory?: string; brandName?: string; brandSlug?: string; animal?: string;
}
interface CartItem { id: number; name: string; price: number; img?: string; qty: number; }

/* ─── Constants ──────────────────────────────────────── */
const SORT_OPTIONS = ["Önerilen","Fiyat ↑","Fiyat ↓","En Yeni"] as const;
const PAGE_SIZE = 24;
const LS_CART = "yp_cart_items";

const CATS = [
  { id:"all",     label:"Tümü",             icon:"🐾", slugs:[] },
  { id:"mama",    label:"Mama",             icon:"🍖", slugs:["kopek-kuru-mama","acik-mama","mama-markalari","yas-mama","uygun-cuval"] },
  { id:"odul",    label:"Ödül & Atıştırmalık", icon:"🦴", slugs:["odul-kemik","cigneti-kemik"] },
  { id:"tasma",   label:"Tasma & Gezdirme", icon:"🎗️", slugs:["bel-boyun-tasma"] },
  { id:"tasima",  label:"Taşıma",           icon:"🎒", slugs:["tasima-kulube"] },
  { id:"oyuncak", label:"Oyuncak",          icon:"🎾", slugs:["oyuncak"] },
  { id:"bakim",   label:"Bakım & Hijyen",   icon:"✨", slugs:["sampuan-banyo","bakim-saglik","tras-ekipmanlari","tirnak-makasi","goz-kulak-bakim","tuy-toplayici","agiz-dis-bakim"] },
  { id:"saglik",  label:"Sağlık & Vitamin", icon:"❤️", slugs:["bit-pire-parazit","sut-tozu-biberon"] },
] as const;
type CatId = typeof CATS[number]["id"];

/* map ?kategori= param → internal cat id */
const PARAM_MAP: Record<string, CatId> = {
  mama:"mama", bakim:"bakim", saglik:"saglik", egitim:"oyuncak",
  odul:"odul", oyuncak:"oyuncak", tasma:"tasma", tasima:"tasima",
  tumu:"all",
};

const BRANDS = ["Royal Canin","Pro Plan","Hill's","N&D","Econature","Reflex Plus","Wanpy","Kong","Trixie","Espree"];

/* ─── Cart helpers ───────────────────────────────────── */
function loadCart(): CartItem[] {
  try { return JSON.parse(localStorage.getItem(LS_CART) || "[]"); } catch { return []; }
}
function saveCart(items: CartItem[]) {
  try { localStorage.setItem(LS_CART, JSON.stringify(items)); } catch {}
}

/* ─── Main ───────────────────────────────────────────── */
export default function Magaza() {
  const [, navigate] = useLocation();

  /* URL params */
  const initParams = useMemo(()=>new URLSearchParams(window.location.search),[]);
  const initCat: CatId = PARAM_MAP[initParams.get("kategori")||""] ?? "all";
  const initQ = initParams.get("q") || "";

  /* Filters */
  const [activeCat, setActiveCat] = useState<CatId>(initCat);
  const [search,    setSearch]    = useState(initQ);
  const [sort,      setSort]      = useState<typeof SORT_OPTIONS[number]>("Önerilen");
  const [page,      setPage]      = useState(1);
  const [filterOpen,setFilterOpen]= useState(false);

  /* Advanced filters */
  const [filterBrands, setFilterBrands] = useState<string[]>([]);
  const [filterInStock, setFilterInStock] = useState(false);
  const [filterMaxPrice, setFilterMaxPrice] = useState("");

  /* Cart */
  const [cart, setCart] = useState<CartItem[]>(loadCart);
  const [cartOpen, setCartOpen] = useState(false);

  /* Wishlist */
  const [wishlist, setWishlist] = useState<number[]>([]);

  /* Debounced search for URL update */
  const searchRef = useRef(search);
  searchRef.current = search;

  /* Sync URL when cat/search changes */
  useEffect(()=>{
    const p = new URLSearchParams();
    if (activeCat !== "all") p.set("kategori", activeCat);
    if (search) p.set("q", search);
    const qs = p.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
    setPage(1);
  }, [activeCat, search]);

  /* Persist cart */
  useEffect(()=>{ saveCart(cart); }, [cart]);

  /* SEO */
  useEffect(()=>{
    document.title = "Poodle Mağazası | YourPoodle";
    const m=(attr:string,key:string,val:string)=>{
      let el=document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement|null;
      if(!el){el=document.createElement("meta");el.setAttribute(attr,key);document.head.appendChild(el);}
      el.content=val;
    };
    m("name","description","Toy Poodle mama, ödül, tasma, oyuncak ve bakım ürünleri. Royal Canin, Reflex Plus ve daha fazlası. Türkiye geneline hızlı kargo, güvenli online ödeme.");
    m("property","og:title","Poodle Mağazası | YourPoodle");
    m("property","og:description","Poodle mama, ödül ve aksesuar. Türkiye geneline hızlı kargo, güvenli online ödeme.");
    m("property","og:type","website");
    m("property","og:url","https://www.yourpoodle.com/yourpoodle/magaza");
  }, []);

  /* Fetch products from yp-products (joined with brand_categories) */
  const { data: allProducts = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/yp-products"],
    staleTime: 5 * 60 * 1000,
  });

  const total = allProducts.length;

  /* Filtered + sorted list */
  const filtered = useMemo(()=>{
    const cat = CATS.find(c=>c.id===activeCat)!;
    let list = allProducts.filter(p=>{
      /* Category */
      if (cat.id !== "all") {
        const sub = p.subcategory || p.mamaType || "";
        if (!cat.slugs.some(s=>sub.includes(s)||s.includes(sub))) return false;
      }
      /* Search */
      if (search) {
        const q = search.toLowerCase();
        const inName  = p.name.toLowerCase().includes(q);
        const inBrand = (p.brandName||"").toLowerCase().includes(q);
        const inCat   = (p.subcategory||p.mamaType||"").toLowerCase().includes(q);
        if (!inName && !inBrand && !inCat) return false;
      }
      /* Brand filter */
      if (filterBrands.length > 0) {
        if (!filterBrands.some(b=>(p.brandName||"").toLowerCase().includes(b.toLowerCase()))) return false;
      }
      /* In stock */
      if (filterInStock && (p.stock||0) <= 0) return false;
      /* Max price */
      if (filterMaxPrice && p.price > Number(filterMaxPrice)) return false;
      return true;
    });

    /* Sort */
    if (sort==="Fiyat ↑") list=[...list].sort((a,b)=>a.price-b.price);
    if (sort==="Fiyat ↓") list=[...list].sort((a,b)=>b.price-a.price);
    if (sort==="En Yeni")  list=[...list].sort((a,b)=>b.id-a.id);
    return list;
  }, [allProducts, activeCat, search, sort, filterBrands, filterInStock, filterMaxPrice]);

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = filtered.length > visible.length;

  /* Cart ops */
  const addToCart = useCallback((p: Product, e?: React.MouseEvent)=>{
    e?.stopPropagation();
    setCart(prev=>{
      const ex = prev.find(i=>i.id===p.id);
      if (ex) return prev.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i);
      return [...prev, { id:p.id, name:p.name, price:p.price, img:p.img, qty:1 }];
    });
  }, []);
  const removeFromCart = (id:number) => setCart(prev=>prev.filter(i=>i.id!==id));
  const changeQty = (id:number, delta:number) => setCart(prev=>prev.map(i=>i.id===id?{...i,qty:Math.max(1,i.qty+delta)}:i));
  const cartCount = cart.reduce((s,i)=>s+i.qty,0);
  const cartTotal = cart.reduce((s,i)=>s+i.price*i.qty,0);

  const toggleWish = (id:number,e:React.MouseEvent)=>{ e.stopPropagation(); setWishlist(w=>w.includes(id)?w.filter(x=>x!==id):[...w,id]); };

  /* ── Schemas ── */
  const collectionSchema = {
    "@context":"https://schema.org","@type":"CollectionPage",
    "name":"Poodle Mağazası",
    "description":"Toy Poodle için mama, ödül, aksesuar ve bakım ürünleri",
    "url":"https://www.yourpoodle.com/yourpoodle/magaza",
    "mainEntity":{
      "@type":"ItemList","numberOfItems":total,
      "itemListElement":allProducts.slice(0,20).map((p,i)=>({
        "@type":"ListItem","position":i+1,
        "item":{
          "@type":"Product","name":p.name,"image":p.img||"",
          "brand":{"@type":"Brand","name":p.brandName||"YourPoodle"},
          "offers":{"@type":"Offer","price":String(p.price),"priceCurrency":"TRY",
            "availability":"https://schema.org/InStock",
            "url":`https://www.yourpoodle.com/yourpoodle/urun/${p.id}`},
        },
      })),
    },
  };

  const faqSchema = {
    "@context":"https://schema.org","@type":"FAQPage",
    "mainEntity":[
      { "@type":"Question","name":"Hangi ödeme yöntemlerini kabul ediyorsunuz?",
        "acceptedAnswer":{"@type":"Answer","text":"Yalnızca online kredi/banka kartı ile ödeme yapılmaktadır (Visa, Mastercard, Troy). Tüm ödemeler 256-bit SSL ve 3D Secure güvencesiyle gerçekleşir."} },
      { "@type":"Question","name":"İade politikanız nedir?",
        "acceptedAnswer":{"@type":"Answer","text":"Açılmamış ürünler 14 gün içinde iade edilebilir. Mama iadelerinde ürünün açılmamış olması şarttır."} },
      { "@type":"Question","name":"Hangi mama markalarını satıyorsunuz?",
        "acceptedAnswer":{"@type":"Answer","text":"Royal Canin Toy Poodle ve Reflex Plus başta olmak üzere Toy Poodle için özenle seçilmiş mamalar mevcuttur."} },
      { "@type":"Question","name":"Toy Poodle için en çok satan mama hangisi?",
        "acceptedAnswer":{"@type":"Answer","text":"Royal Canin Toy Poodle Adult ve Royal Canin Toy Poodle Puppy en çok tercih edilen mamalar arasında yer almaktadır."} },
      { "@type":"Question","name":"Kargo süresi ne kadar?",
        "acceptedAnswer":{"@type":"Answer","text":"Türkiye içi siparişler 1-3 iş günü içinde teslim edilir. Stokta olan ürünler genellikle aynı gün kargoya verilir."} },
    ],
  };

  const breadcrumbSchema = {
    "@context":"https://schema.org","@type":"BreadcrumbList",
    "itemListElement":[
      {"@type":"ListItem","position":1,"name":"Ana Sayfa","item":"https://www.yourpoodle.com/yourpoodle"},
      {"@type":"ListItem","position":2,"name":"Mağaza","item":"https://www.yourpoodle.com/yourpoodle/magaza"},
      ...(activeCat!=="all"?[{"@type":"ListItem","position":3,"name":CATS.find(c=>c.id===activeCat)?.label||""}]:[]),
    ],
  };

  return (
    <YPLayout activeLink="/yourpoodle/magaza">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html:JSON.stringify(collectionSchema) }}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html:JSON.stringify(faqSchema) }}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html:JSON.stringify(breadcrumbSchema) }}/>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        .noscroll::-webkit-scrollbar { display:none; }
        .noscroll { -ms-overflow-style:none; scrollbar-width:none; }
        .prod-card { cursor:pointer; transition:transform 0.12s, box-shadow 0.12s; background:#fff; }
        .prod-card:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,0.1) !important; }
        .add-btn:hover { background:#6D28D9 !important; }
        .add-btn { transition:background 0.12s; }
        .cat-chip { transition:all 0.12s; }
        .cat-chip:hover { opacity:0.85; }
        .overlay-backdrop { position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:9990; }
        .filter-drawer { position:fixed; right:0; top:0; bottom:0; width:min(320px,100vw); background:#fff; z-index:9991; box-shadow:-4px 0 24px rgba(0,0,0,0.15); display:flex; flex-direction:column; }
        .cart-drawer { position:fixed; right:0; top:0; bottom:0; width:min(380px,100vw); background:#fff; z-index:9991; box-shadow:-4px 0 24px rgba(0,0,0,0.15); display:flex; flex-direction:column; }
        /* Grid breakpoints */
        .magaza-grid { grid-template-columns: repeat(2, 1fr); }
        @media (min-width:768px)  { .magaza-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width:1024px) { .magaza-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width:1280px) { .magaza-grid { grid-template-columns: repeat(4, 1fr); } }
        @media (max-width:640px)  { .magaza-sort-row { overflow-x:auto; flex-wrap:nowrap !important; } }
      `}</style>

      <div style={{ background:"#fff", minHeight:"100vh" }}>

        {/* ── Hero ── */}
        <div style={{ background:"linear-gradient(135deg,#7C3AFF,#A855F7)", padding:"24px 20px 28px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-25, right:-15, width:110, height:110, borderRadius:"50%", background:"rgba(255,255,255,0.08)" }}/>
          <div style={{ position:"absolute", bottom:-20, left:10, width:70, height:70, borderRadius:"50%", background:"rgba(255,255,255,0.06)" }}/>
          <div style={{ fontSize:34, marginBottom:8 }}>🛍️</div>
          <h1 style={{ fontSize:22, fontWeight:900, color:"#fff", marginBottom:4, lineHeight:1.2 }}>Poodle Mağazası</h1>
          <p style={{ fontSize:13, color:"rgba(255,255,255,0.85)", marginBottom:14 }}>Royal Canin, Reflex Plus ve daha fazlası</p>
          <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>
            {[
              [isLoading?"…":total>0?`${total}+`:"Yükleniyor","Ürün"],
              ["Türkiye","Geneli Kargo"],["Güvenli","Ödeme"],
            ].map(([n,l])=>(
              <div key={l}><div style={{ fontSize:14, fontWeight:900, color:"#fff" }}>{n}</div><div style={{ fontSize:10, color:"rgba(255,255,255,0.72)" }}>{l}</div></div>
            ))}
          </div>
        </div>

        {/* ── Breadcrumb ── */}
        <div style={{ background:"#fff", padding:"8px 16px", borderBottom:"1px solid #f0f0f0", display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
          <button onClick={()=>navigate("/yourpoodle")} style={{ background:"none", border:"none", cursor:"pointer", color:"#7C3AFF", fontSize:12, fontWeight:600, padding:0 }}>Ana Sayfa</button>
          <ChevronRight size={13} color="#bbb"/>
          <button onClick={()=>setActiveCat("all")} style={{ background:"none", border:"none", cursor:"pointer", color:activeCat==="all"?"#1a1a1a":"#7C3AFF", fontSize:12, fontWeight:600, padding:0 }}>Mağaza</button>
          {activeCat!=="all" && (
            <>
              <ChevronRight size={13} color="#bbb"/>
              <span style={{ fontSize:12, fontWeight:700, color:"#1a1a1a" }}>
                {CATS.find(c=>c.id===activeCat)?.label}
              </span>
            </>
          )}
        </div>

        {/* ── Mama Bul CTA ── */}
        <div style={{ background:"linear-gradient(135deg,#FFF7ED,#FFEDD5)", borderBottom:"1px solid #FED7AA", padding:"12px 16px", display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:24 }}>🍖</span>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:800, color:"#9A3412" }}>Hangi mamayı seçeceğinizi bilmiyor musunuz?</div>
            <div style={{ fontSize:12, color:"#C2410C" }}>Yaş ve kiloya göre kişiselleştirilmiş mama önerisi alın.</div>
          </div>
          <button onClick={()=>navigate("/yourpoodle/mama-bul")}
            style={{ flexShrink:0, padding:"8px 14px", borderRadius:20, border:"none", background:"#EA580C", color:"#fff", fontSize:12, fontWeight:800, cursor:"pointer", whiteSpace:"nowrap" }}>
            Mama Bul →
          </button>
        </div>

        {/* ── Search + cart ── */}
        <div style={{ background:"#fff", padding:"12px 16px", borderBottom:"1px solid #f0f0f0", position:"sticky", top:0, zIndex:100 }}>
          <div style={{ display:"flex", gap:10, maxWidth:900 }}>
            <div style={{ flex:1, display:"flex", alignItems:"center", background:"#F7F7F7", border:"1.5px solid #ececec", borderRadius:12, height:44, overflow:"hidden" }}>
              <div style={{ paddingLeft:12, color:"#bbb", display:"flex" }}><Search size={16}/></div>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Ürün, marka ara…"
                style={{ flex:1, border:"none", outline:"none", fontSize:13, fontWeight:600, color:"#333", background:"transparent", padding:"0 10px" }}/>
              {search && (
                <button onClick={()=>setSearch("")} style={{ paddingRight:12, background:"none", border:"none", cursor:"pointer", color:"#aaa" }}><X size={14}/></button>
              )}
            </div>
            <button onClick={()=>setFilterOpen(true)}
              style={{ width:44, height:44, borderRadius:12, border:"1.5px solid #ececec", background:filterBrands.length>0||filterInStock||filterMaxPrice?"#EDE8FF":"#fff", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0, position:"relative" }}>
              <SlidersHorizontal size={17} color={filterBrands.length>0||filterInStock||filterMaxPrice?"#7C3AFF":"#555"}/>
              {(filterBrands.length>0||filterInStock||filterMaxPrice) && (
                <span style={{ position:"absolute", top:6, right:6, width:8, height:8, borderRadius:"50%", background:"#7C3AFF" }}/>
              )}
            </button>
            <button onClick={()=>setCartOpen(true)}
              style={{ width:44, height:44, borderRadius:12, border:"1.5px solid #ececec", background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0, position:"relative" }}>
              <ShoppingCart size={17} color="#555"/>
              {cartCount>0 && (
                <span style={{ position:"absolute", top:4, right:4, minWidth:16, height:16, borderRadius:"50%", background:"#7C3AFF", color:"#fff", fontSize:9, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 3px" }}>{cartCount}</span>
              )}
            </button>
          </div>
        </div>

        {/* ── Category chips ── */}
        <div style={{ background:"#fff", padding:"10px 16px 12px", borderBottom:"1px solid #f0f0f0" }}>
          <div className="noscroll" style={{ display:"flex", gap:8, overflowX:"auto" }}>
            {CATS.map(c=>(
              <button key={c.id} onClick={()=>setActiveCat(c.id)} className="cat-chip"
                style={{ flexShrink:0, display:"flex", alignItems:"center", gap:5, padding:"7px 14px", borderRadius:20, border:"1.5px solid", borderColor:activeCat===c.id?"#7C3AFF":"#e8e8e8", background:activeCat===c.id?"#7C3AFF":"#fff", color:activeCat===c.id?"#fff":"#555", fontSize:12.5, fontWeight:700, cursor:"pointer" }}>
                {c.icon} {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Sort + count ── */}
        <div style={{ padding:"10px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8, background:"#fff", borderBottom:"1px solid #f0f0f0" }}>
          <span style={{ fontSize:12, color:"#888" }}>
            {isLoading ? "Yükleniyor…" : search ? `"${search}" için ${filtered.length} sonuç` : `${filtered.length} ürün`}
          </span>
          <div className="noscroll magaza-sort-row" style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {SORT_OPTIONS.map(s=>(
              <button key={s} onClick={()=>setSort(s)}
                style={{ flexShrink:0, padding:"5px 10px", borderRadius:8, border:"1.5px solid", borderColor:sort===s?"#7C3AFF":"#e8e8e8", background:sort===s?"#EDE8FF":"#fff", color:sort===s?"#7C3AFF":"#555", fontSize:11.5, fontWeight:700, cursor:"pointer" }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* ── Product grid ── */}
        {isLoading ? (
          <div className="magaza-grid" style={{ display:"grid", gap:10, padding:"0 12px 24px" }}>
            {Array.from({length:8}).map((_,i)=>(
              <div key={i} style={{ background:"#e8e8e8", borderRadius:16, height:200, animation:"pulse 1.5s ease-in-out infinite" }}/>
            ))}
          </div>
        ) : (
          <div className="magaza-grid" style={{ display:"grid", gap:10, padding:"0 12px 24px" }}>
            {visible.map((p)=>{
              const inCart = cart.some(i=>i.id===p.id);
              return (
                <div key={p.id} className="prod-card" onClick={()=>navigate(`/yourpoodle/urun/${p.id}`)}
                  style={{ borderRadius:16, overflow:"hidden", display:"flex", flexDirection:"column", border:"1.5px solid #111", boxShadow:"0 2px 12px rgba(0,0,0,0.08)" }}>
                  <div style={{ background:"#fff", aspectRatio:"1/1", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden", borderBottom:"1px solid #111" }}>
                    {p.img
                      ? <>
                          <img src={p.img} alt={p.name} loading="lazy"
                            style={{ width:"100%", height:"100%", objectFit:"contain", padding:"14px" }}
                            onError={e=>{
                              (e.target as HTMLImageElement).style.display="none";
                              const sib = (e.target as HTMLImageElement).nextElementSibling as HTMLElement|null;
                              if (sib) sib.style.display="flex";
                            }}/>
                          <span style={{ fontSize:40, display:"none", width:"100%", height:"100%", alignItems:"center", justifyContent:"center" }}>🐾</span>
                        </>
                      : <span style={{ fontSize:40 }}>🐾</span>
                    }
                    {p.originalPrice && p.originalPrice>p.price && (
                      <div style={{ position:"absolute", top:6, left:6, background:"#EF4444", borderRadius:6, padding:"2px 7px" }}>
                        <span style={{ fontSize:9, fontWeight:800, color:"#fff" }}>
                          %{Math.round((1-p.price/p.originalPrice)*100)} İNDİRİM
                        </span>
                      </div>
                    )}
                    <button onClick={e=>toggleWish(p.id,e)}
                      style={{ position:"absolute", top:6, right:6, background:"rgba(255,255,255,0.88)", border:"none", borderRadius:"50%", width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                      <Heart size={14} color={wishlist.includes(p.id)?"#E75480":"#bbb"} fill={wishlist.includes(p.id)?"#E75480":"none"} strokeWidth={2}/>
                    </button>
                    {(p.stock||0)<=0 && (
                      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <span style={{ fontSize:12, fontWeight:800, color:"#fff", background:"rgba(0,0,0,0.6)", padding:"4px 10px", borderRadius:20 }}>Tükendi</span>
                      </div>
                    )}
                  </div>
                  <div style={{ padding:"10px 10px 12px", flex:1, display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
                    {p.brandName && (
                      <div style={{ fontSize:9, fontWeight:800, color:"#7C3AFF", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:2 }}>{p.brandName}</div>
                    )}
                    <div style={{ fontSize:11.5, fontWeight:700, color:"#1a1a1a", lineHeight:1.4, marginBottom:8, display:"-webkit-box", overflow:"hidden", WebkitLineClamp:2, WebkitBoxOrient:"vertical" as any }}>
                      {p.name}
                    </div>
                    <div>
                      <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between" }}>
                        <div>
                          <div style={{ fontSize:15, fontWeight:900, color:"#7C3AFF" }}>
                            ₺{Number(p.price).toLocaleString("tr-TR",{minimumFractionDigits:0})}
                          </div>
                          {p.originalPrice && p.originalPrice>p.price && (
                            <div style={{ fontSize:10, color:"#bbb", textDecoration:"line-through" }}>
                              ₺{Number(p.originalPrice).toLocaleString("tr-TR",{minimumFractionDigits:0})}
                            </div>
                          )}
                        </div>
                        <button onClick={e=>addToCart(p,e)} disabled={(p.stock||0)<=0} className="add-btn"
                          style={{ width:32, height:32, borderRadius:9, border:"none", background:(p.stock||0)>0?(inCart?"#5B21B6":"#7C3AFF"):"#e0e0e0", display:"flex", alignItems:"center", justifyContent:"center", cursor:(p.stock||0)>0?"pointer":"not-allowed", flexShrink:0 }}>
                          {inCart ? <span style={{ fontSize:11, color:"#fff", fontWeight:900 }}>✓</span> : <Plus size={15} color="#fff"/>}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filtered.length===0 && (
              <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"48px 16px", color:"#aaa" }}>
                {(!search && activeCat!=="all" && filterBrands.length===0) ? (
                  <>
                    <div style={{ fontSize:48, marginBottom:12 }}>🔜</div>
                    <div style={{ fontSize:16, fontWeight:800, color:"#7C3AFF" }}>Yakında!</div>
                    <div style={{ fontSize:13, marginTop:8, color:"#888" }}>
                      Bu kategori için ürünler hazırlanıyor. Çok yakında burada olacak!
                    </div>
                    <button onClick={()=>setActiveCat("all")}
                      style={{ marginTop:16, padding:"9px 22px", borderRadius:20, border:"none", background:"#7C3AFF", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer" }}>
                      Tüm Ürünleri Gör
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
                    <div style={{ fontSize:15, fontWeight:700, color:"#555" }}>Ürün bulunamadı</div>
                    <div style={{ fontSize:13, marginTop:6, color:"#888" }}>
                      {search ? `"${search}" için sonuç yok — farklı bir anahtar kelime deneyin` : "Filtre kriterlerine uygun ürün bulunamadı"}
                    </div>
                    {(search||activeCat!=="all"||filterBrands.length>0) && (
                      <button onClick={()=>{ setSearch(""); setActiveCat("all"); setFilterBrands([]); setFilterInStock(false); setFilterMaxPrice(""); }}
                        style={{ marginTop:16, padding:"9px 22px", borderRadius:20, border:"none", background:"#7C3AFF", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer" }}>
                        Filtreleri Temizle
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Load more */}
        {hasMore && (
          <div style={{ textAlign:"center", padding:"0 16px 24px" }}>
            <button onClick={()=>setPage(p=>p+1)}
              style={{ padding:"12px 32px", borderRadius:24, border:"1.5px solid #7C3AFF", background:"#fff", color:"#7C3AFF", fontWeight:700, fontSize:14, cursor:"pointer" }}>
              Daha Fazla Yükle ({filtered.length - visible.length} ürün daha)
            </button>
          </div>
        )}

        {/* ── Static SEO content (crawler-visible) ── */}
        <div style={{ background:"#fff", borderTop:"1px solid #f0f0f0", padding:"28px 20px 0" }}>
          <div style={{ maxWidth:900, margin:"0 auto" }}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))", gap:20, marginBottom:32 }}>
              {[
                { emoji:"🍖", title:"Poodle Mamaları", desc:"Royal Canin Toy Poodle, Pro Plan Small & Mini, Hill's Science Plan. Toy ve Miniature Poodle'ın küçük çenesi ve hassas sindirimi için özel formüller." },
                { emoji:"✨", title:"Bakım Ürünleri", desc:"Bio-Groom şampuan, Espree serisi, slicker fırça, tarak seti ve tıraş makası. Poodle tüyünü mat olmadan yumuşak tutun." },
                { emoji:"🚚", title:"Kargo ve Ödeme", desc:"Türkiye geneline hızlı kargo. Online kredi/banka kartı ile güvenli ödeme (256-bit SSL, 3D Secure). Siparişler özenle paketlenir." },
              ].map(item=>(
                <div key={item.title} style={{ background:"#F5F0FF", borderRadius:14, padding:"18px 18px 20px" }}>
                  <div style={{ fontSize:26, marginBottom:10 }}>{item.emoji}</div>
                  <h2 style={{ fontSize:14, fontWeight:800, color:"#1a1a1a", marginBottom:8 }}>{item.title}</h2>
                  <p style={{ fontSize:13, color:"#555", lineHeight:1.65, margin:0 }}>{item.desc}</p>
                </div>
              ))}
            </div>

            {/* SSS */}
            <h2 style={{ fontSize:16, fontWeight:800, color:"#1a1a1a", marginBottom:14 }}>Sık Sorulan Sorular</h2>
            <StaticSSS/>

            {/* Crawler-visible top products (hidden from UI but in DOM) */}
            <ul style={{ display:"none" }} aria-hidden="true">
              {allProducts.slice(0,20).map(p=>(
                <li key={p.id}>
                  <a href={`/yourpoodle/urun/${p.id}`}>{p.name}</a>{" "}
                  — ₺{p.price}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ height:28 }}/>
      </div>

      {/* ── Filter Drawer ── */}
      {filterOpen && (
        <>
          <div className="overlay-backdrop" onClick={()=>setFilterOpen(false)}/>
          <div className="filter-drawer">
            <div style={{ padding:"16px 20px", borderBottom:"1px solid #f0f0f0", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <span style={{ fontSize:16, fontWeight:800 }}>Filtrele</span>
              <button onClick={()=>setFilterOpen(false)} style={{ background:"none", border:"none", cursor:"pointer" }}><X size={20}/></button>
            </div>
            <div style={{ flex:1, overflowY:"auto", padding:"20px" }}>
              {/* Brand filter */}
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:12, fontWeight:800, color:"#555", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10 }}>Marka</div>
                <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                  {BRANDS.map(b=>(
                    <label key={b} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
                      <input type="checkbox" checked={filterBrands.includes(b)}
                        onChange={e=>setFilterBrands(prev=>e.target.checked?[...prev,b]:prev.filter(x=>x!==b))}
                        style={{ width:16, height:16, accentColor:"#7C3AFF", cursor:"pointer" }}/>
                      <span style={{ fontSize:13.5, color:"#1a1a1a" }}>{b}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Max price */}
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:12, fontWeight:800, color:"#555", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10 }}>Maksimum Fiyat</div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <input type="number" value={filterMaxPrice} onChange={e=>setFilterMaxPrice(e.target.value)} placeholder="ör. 500"
                    style={{ flex:1, border:"1.5px solid #e8e8e8", borderRadius:9, padding:"8px 12px", fontSize:14, outline:"none" }}/>
                  <span style={{ fontSize:13, color:"#888" }}>₺</span>
                </div>
              </div>
              {/* In stock */}
              <div style={{ marginBottom:20 }}>
                <label style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}>
                  <input type="checkbox" checked={filterInStock} onChange={e=>setFilterInStock(e.target.checked)}
                    style={{ width:18, height:18, accentColor:"#7C3AFF", cursor:"pointer" }}/>
                  <span style={{ fontSize:13.5, fontWeight:600, color:"#1a1a1a" }}>Yalnızca stokta olanlar</span>
                </label>
              </div>
            </div>
            <div style={{ padding:"14px 20px", borderTop:"1px solid #f0f0f0", display:"flex", gap:10 }}>
              <button onClick={()=>{ setFilterBrands([]); setFilterInStock(false); setFilterMaxPrice(""); }}
                style={{ flex:1, height:42, borderRadius:12, border:"1.5px solid #e8e8e8", background:"#fff", color:"#555", fontWeight:700, fontSize:14, cursor:"pointer" }}>
                Temizle
              </button>
              <button onClick={()=>setFilterOpen(false)}
                style={{ flex:2, height:42, borderRadius:12, border:"none", background:"#7C3AFF", color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer" }}>
                Uygula ({filtered.length} ürün)
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Cart Drawer ── */}
      {cartOpen && (
        <>
          <div className="overlay-backdrop" onClick={()=>setCartOpen(false)}/>
          <div className="cart-drawer">
            <div style={{ padding:"16px 20px", borderBottom:"1px solid #f0f0f0", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <ShoppingCart size={18} color="#7C3AFF"/>
                <span style={{ fontSize:16, fontWeight:800 }}>Sepetim</span>
                {cartCount>0 && <span style={{ fontSize:12, fontWeight:700, background:"#7C3AFF", color:"#fff", borderRadius:20, padding:"2px 9px" }}>{cartCount}</span>}
              </div>
              <button onClick={()=>setCartOpen(false)} style={{ background:"none", border:"none", cursor:"pointer" }}><X size={20}/></button>
            </div>
            <div style={{ flex:1, overflowY:"auto", padding:"16px" }}>
              {cart.length===0 ? (
                <div style={{ textAlign:"center", padding:"48px 16px", color:"#aaa" }}>
                  <div style={{ fontSize:48, marginBottom:16 }}>🛒</div>
                  <div style={{ fontSize:15, fontWeight:700 }}>Sepetiniz boş</div>
                  <button onClick={()=>setCartOpen(false)}
                    style={{ marginTop:16, padding:"10px 24px", borderRadius:20, border:"none", background:"#7C3AFF", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer" }}>
                    Alışverişe Başla
                  </button>
                </div>
              ) : cart.map(item=>(
                <div key={item.id} style={{ display:"flex", gap:12, padding:"12px 0", borderBottom:"1px solid #f5f5f5" }}>
                  <div style={{ width:56, height:56, borderRadius:10, background:"#F0ECFF", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, overflow:"hidden" }}>
                    {item.img
                      ? <img src={item.img} alt={item.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e=>{(e.target as HTMLImageElement).style.display="none";}}/>
                      : <span style={{ fontSize:24 }}>🐾</span>
                    }
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12.5, fontWeight:700, color:"#1a1a1a", lineHeight:1.4, marginBottom:6, overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>{item.name}</div>
                    <div style={{ fontSize:14, fontWeight:900, color:"#7C3AFF", marginBottom:8 }}>₺{(item.price*item.qty).toLocaleString("tr-TR",{minimumFractionDigits:0})}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ display:"flex", alignItems:"center", border:"1.5px solid #e8e8e8", borderRadius:8, overflow:"hidden" }}>
                        <button onClick={()=>changeQty(item.id,-1)} style={{ width:28, height:28, background:"#fff", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Minus size={12}/></button>
                        <span style={{ fontSize:13, fontWeight:700, padding:"0 8px", minWidth:20, textAlign:"center" }}>{item.qty}</span>
                        <button onClick={()=>changeQty(item.id,+1)} style={{ width:28, height:28, background:"#fff", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Plus size={12}/></button>
                      </div>
                      <button onClick={()=>removeFromCart(item.id)} style={{ background:"none", border:"none", cursor:"pointer", color:"#ccc" }}><Trash2 size={14}/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {cart.length>0 && (
              <div style={{ padding:"16px 20px", borderTop:"1px solid #f0f0f0" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
                  <span style={{ fontSize:14, fontWeight:700 }}>Toplam</span>
                  <span style={{ fontSize:16, fontWeight:900, color:"#7C3AFF" }}>₺{cartTotal.toLocaleString("tr-TR",{minimumFractionDigits:0})}</span>
                </div>
                <button onClick={()=>{ setCartOpen(false); navigate("/yourpoodle/sepet"); }}
                  style={{ width:"100%", height:46, borderRadius:14, border:"none", background:"#7C3AFF", color:"#fff", fontSize:15, fontWeight:800, cursor:"pointer" }}>
                  Siparişe Devam →
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </YPLayout>
  );
}

/* ─── Static SSS component ──────────────────────────── */
const SSS_LIST = [
  { q:"Kargo süresi ne kadar?", a:"Türkiye içi siparişlerde teslimat 1–3 iş günüdür. Stokta olan ürünler genellikle aynı gün kargoya verilir." },
  { q:"Hangi ödeme yöntemlerini kabul ediyorsunuz?", a:"Yalnızca online kredi/banka kartı ile ödeme yapılmaktadır (Visa, Mastercard, Troy). Tüm ödemeler 256-bit SSL ve 3D Secure güvencesiyle gerçekleşir." },
  { q:"İade politikanız nedir?", a:"Açılmamış ürünler 14 gün içinde iade edilebilir. Mama ürünlerinde açılmamış orijinal ambalaj şarttır. İade için info@yourpoodle.com adresine yazabilirsiniz." },
  { q:"Hangi mama markalarını satıyorsunuz?", a:"Royal Canin Toy Poodle ve Reflex Plus başta olmak üzere Toy Poodle için özenle seçilmiş mamalar mevcuttur." },
  { q:"Toy Poodle için en çok satan mama hangisi?", a:"Royal Canin Toy Poodle Adult ve Royal Canin Toy Poodle Puppy en çok tercih edilen mamalar arasındadır. Mama Bul sihirbazıyla kişiselleştirilmiş öneri alabilirsiniz." },
];
function StaticSSS() {
  const [open, setOpen] = useState<number|null>(null);
  return (
    <div style={{ background:"#fff", borderRadius:14, border:"1.5px solid #EDE9FE", overflow:"hidden", marginBottom:32 }}>
      {SSS_LIST.map((s,i)=>(
        <div key={i} style={{ borderBottom:i<SSS_LIST.length-1?"1px solid #F5F0FF":"none" }}>
          <button onClick={()=>setOpen(open===i?null:i)}
            style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 16px", background:"none", border:"none", cursor:"pointer", textAlign:"left", gap:10 }}>
            <span style={{ fontSize:13.5, fontWeight:700, color:"#1a1a1a", lineHeight:1.4 }}>S: {s.q}</span>
            <ChevronDown size={16} color="#7C3AFF" style={{ flexShrink:0, transform:open===i?"rotate(180deg)":"none", transition:"0.2s" }}/>
          </button>
          {open===i && (
            <div style={{ padding:"0 16px 14px" }}>
              <p style={{ fontSize:13.5, color:"#555", lineHeight:1.7, margin:0 }}>
                <span style={{ fontWeight:700, color:"#7C3AFF" }}>C: </span>{s.a}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
