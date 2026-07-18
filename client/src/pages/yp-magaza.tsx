import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import {
  Search, Heart, SlidersHorizontal, X, ShoppingCart, ChevronRight, ChevronDown,
  Trash2, Plus, Minus, Truck, RefreshCw, ShieldCheck, CreditCard, Star,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import YPLayout from "@/components/yourpoodle/YPLayout";

/* ─── Types ──────────────────────────────────────────── */
interface Product {
  id: number; name: string; price: number; originalPrice?: number;
  img?: string; stock: number; isActive: boolean;
  mamaType?: string; subcategory?: string; brandName?: string; brandSlug?: string; animal?: string;
}
interface CartItem { id: number; name: string; price: number; img?: string; qty: number; }

/* ─── Constants ───────────────────────────────────────── */
const SORT_OPTIONS = ["Önerilen","Fiyat ↑","Fiyat ↓","En Yeni"] as const;
const PAGE_SIZE = 12;
const LS_CART = "yp_cart_items";

const CATS = [
  { id:"all",     label:"Tümü",             icon:"🐾", slugs:[] },
  { id:"mama",    label:"Mama",             icon:"🍖", slugs:["kopek-kuru-mama","acik-mama","mama-markalari","yas-mama","uygun-cuval"] },
  { id:"odul",    label:"Ödül & Atıştır.",  icon:"🦴", slugs:["odul-kemik","cigneti-kemik"] },
  { id:"tasma",   label:"Tasma & Gezdirme", icon:"🎗️", slugs:["bel-boyun-tasma"] },
  { id:"tasima",  label:"Taşıma",           icon:"🎒", slugs:["tasima-kulube"] },
  { id:"oyuncak", label:"Oyuncak",          icon:"🎾", slugs:["oyuncak"] },
  { id:"bakim",   label:"Bakım & Hijyen",   icon:"✨", slugs:["sampuan-banyo","bakim-saglik","tras-ekipmanlari","tirnak-makasi","goz-kulak-bakim","tuy-toplayici","agiz-dis-bakim"] },
  { id:"saglik",  label:"Sağlık & Vitamin", icon:"❤️", slugs:["bit-pire-parazit","sut-tozu-biberon"] },
] as const;
type CatId = typeof CATS[number]["id"];

const PARAM_MAP: Record<string, CatId> = {
  mama:"mama", bakim:"bakim", saglik:"saglik", egitim:"oyuncak",
  odul:"odul", oyuncak:"oyuncak", tasma:"tasma", tasima:"tasima", tumu:"all",
};

const BRANDS = ["Royal Canin","Pro Plan","Hill's","N&D","Econature","Reflex Plus","Wanpy","Kong","Trixie","Espree"];

const QUICK_FILTERS = ["Yavru","Yetişkin","Royal Canin","Reflex Plus","Küçük Irk","Tahılsız","En Çok Satanlar"];

const SSS_LIST = [
  { q:"Kargo süresi ne kadar?",             a:"Türkiye içi siparişlerde teslimat 1–3 iş günüdür. Stokta olan ürünler genellikle aynı gün kargoya verilir." },
  { q:"Hangi mama markalarını satıyorsunuz?", a:"Royal Canin Toy Poodle ve Reflex Plus başta olmak üzere Toy Poodle için özenle seçilmiş mamalar mevcuttur." },
  { q:"Hangi ödeme yöntemlerini kabul ediyorsunuz?", a:"Visa, Mastercard ve Troy kart ile ödeme yapabilirsiniz. Tüm ödemeler 256-bit SSL ve 3D Secure güvencesiyle gerçekleşir." },
  { q:"Toy Poodle için en çok satan mama hangisi?",   a:"Royal Canin Toy Poodle Adult ve Reflex Plus en çok tercih edilenlerdir. Mama Bul ile kişisel öneri alabilirsiniz." },
  { q:"İade politikanız nedir?",             a:"Açılmamış ürünler 14 gün içinde iade edilebilir. Mama ürünlerinde orijinal ambalaj şarttır." },
  { q:"Taksit imkânı var mı?",              a:"Tüm kartlara 12 aya kadar taksit imkânı sunulmaktadır. Taksit seçeneğinizi ödeme adımında görüntüleyebilirsiniz." },
];

/* ─── Cart helpers ────────────────────────────────────── */
function loadCart(): CartItem[] { try { return JSON.parse(localStorage.getItem(LS_CART)||"[]"); } catch { return []; } }
function saveCart(items: CartItem[]) { try { localStorage.setItem(LS_CART,JSON.stringify(items)); } catch {} }

/* ─── Main ────────────────────────────────────────────── */
export default function Magaza() {
  const [, navigate] = useLocation();

  const initParams = useMemo(()=>new URLSearchParams(window.location.search),[]);
  const initCat: CatId = PARAM_MAP[initParams.get("kategori")||""] ?? "all";
  const initQ = initParams.get("q") || "";

  const [activeCat,      setActiveCat]      = useState<CatId>(initCat);
  const [search,         setSearch]         = useState(initQ);
  const [sort,           setSort]           = useState<typeof SORT_OPTIONS[number]>("Önerilen");
  const [page,           setPage]           = useState(1);
  const [filterOpen,     setFilterOpen]     = useState(false);
  const [activeQuick,    setActiveQuick]    = useState<string | null>(null);
  const [filterBrands,   setFilterBrands]   = useState<string[]>([]);
  const [filterInStock,  setFilterInStock]  = useState(false);
  const [filterMaxPrice, setFilterMaxPrice] = useState("");
  const [cart,           setCart]           = useState<CartItem[]>(loadCart);
  const [cartOpen,       setCartOpen]       = useState(false);
  const [wishlist,       setWishlist]       = useState<number[]>([]);
  const [openFaq,        setOpenFaq]        = useState<number | null>(null);

  useEffect(()=>{
    const p = new URLSearchParams();
    if (activeCat!=="all") p.set("kategori",activeCat);
    if (search) p.set("q",search);
    const qs=p.toString();
    window.history.replaceState(null,"",qs?`?${qs}`:window.location.pathname);
    setPage(1);
  },[activeCat,search]);

  useEffect(()=>{ saveCart(cart); },[cart]);

  useEffect(()=>{
    document.title="Poodle Mağazası | YourPoodle";
    const m=(attr:string,key:string,val:string)=>{
      let el=document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement|null;
      if(!el){el=document.createElement("meta");el.setAttribute(attr,key);document.head.appendChild(el);}
      el.content=val;
    };
    m("name","description","Toy Poodle mama, ödül, tasma, oyuncak ve bakım ürünleri. Royal Canin, Reflex Plus ve daha fazlası. Türkiye geneline hızlı kargo, güvenli online ödeme.");
    m("property","og:title","Poodle Mağazası | YourPoodle");
    m("property","og:type","website");
    m("property","og:url","https://www.yourpoodle.com/yourpoodle/magaza");
  },[]);

  const { data: allProducts=[], isLoading } = useQuery<Product[]>({
    queryKey:["/api/yp-products"], staleTime:5*60*1000,
  });

  const total = allProducts.length;

  const filtered = useMemo(()=>{
    const cat=CATS.find(c=>c.id===activeCat)!;
    let list=allProducts.filter(p=>{
      if(cat.id!=="all"){
        const sub=p.subcategory||p.mamaType||"";
        if(!cat.slugs.some(s=>sub.includes(s)||s.includes(sub))) return false;
      }
      if(search){
        const q=search.toLowerCase();
        if(!p.name.toLowerCase().includes(q)&&!(p.brandName||"").toLowerCase().includes(q)&&!(p.subcategory||p.mamaType||"").toLowerCase().includes(q)) return false;
      }
      if(activeQuick){
        const ql=activeQuick.toLowerCase();
        const brand=(p.brandName||"").toLowerCase();
        const name=p.name.toLowerCase();
        if(ql==="yavru"&&!name.includes("yavru")&&!name.includes("puppy")) return false;
        if(ql==="yetişkin"&&!name.includes("yetişkin")&&!name.includes("adult")) return false;
        if(ql==="royal canin"&&!brand.includes("royal canin")) return false;
        if(ql==="reflex plus"&&!brand.includes("reflex")) return false;
        if(ql==="küçük irk"&&!name.includes("küçük")&&!name.includes("small")&&!name.includes("mini")) return false;
        if(ql==="tahılsız"&&!name.includes("tahılsız")&&!name.includes("grain")) return false;
      }
      if(filterBrands.length>0&&!filterBrands.some(b=>(p.brandName||"").toLowerCase().includes(b.toLowerCase()))) return false;
      if(filterInStock&&(p.stock||0)<=0) return false;
      if(filterMaxPrice&&p.price>Number(filterMaxPrice)) return false;
      return true;
    });
    if(sort==="Fiyat ↑") list=[...list].sort((a,b)=>a.price-b.price);
    if(sort==="Fiyat ↓") list=[...list].sort((a,b)=>b.price-a.price);
    if(sort==="En Yeni")  list=[...list].sort((a,b)=>b.id-a.id);
    return list;
  },[allProducts,activeCat,search,sort,filterBrands,filterInStock,filterMaxPrice,activeQuick]);

  const featured  = allProducts.filter(p=>p.originalPrice&&p.originalPrice>p.price).slice(0,3);
  const visible   = filtered.slice(0,page*PAGE_SIZE);
  const hasMore   = filtered.length>visible.length;

  const addToCart = useCallback((p:Product,e?:React.MouseEvent)=>{
    e?.stopPropagation();
    setCart(prev=>{
      const ex=prev.find(i=>i.id===p.id);
      if(ex) return prev.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i);
      return [...prev,{id:p.id,name:p.name,price:p.price,img:p.img,qty:1}];
    });
  },[]);
  const removeFromCart=(id:number)=>setCart(prev=>prev.filter(i=>i.id!==id));
  const changeQty=(id:number,delta:number)=>setCart(prev=>prev.map(i=>i.id===id?{...i,qty:Math.max(1,i.qty+delta)}:i));
  const cartCount=cart.reduce((s,i)=>s+i.qty,0);
  const cartTotal=cart.reduce((s,i)=>s+i.price*i.qty,0);
  const toggleWish=(id:number,e:React.MouseEvent)=>{e.stopPropagation();setWishlist(w=>w.includes(id)?w.filter(x=>x!==id):[...w,id]);};

  const priceFmt=(n:number)=>n.toLocaleString("tr-TR",{minimumFractionDigits:0});
  const discountPct=(p:Product)=>p.originalPrice&&p.originalPrice>p.price?Math.round((1-p.price/p.originalPrice)*100):0;

  /* JSON-LD */
  const collectionSchema={
    "@context":"https://schema.org","@type":"CollectionPage","name":"Poodle Mağazası",
    "url":"https://www.yourpoodle.com/yourpoodle/magaza",
    "mainEntity":{"@type":"ItemList","numberOfItems":total,
      "itemListElement":allProducts.slice(0,20).map((p,i)=>({
        "@type":"ListItem","position":i+1,
        "item":{"@type":"Product","name":p.name,"image":p.img||"",
          "brand":{"@type":"Brand","name":p.brandName||"YourPoodle"},
          "offers":{"@type":"Offer","price":String(p.price),"priceCurrency":"TRY",
            "availability":"https://schema.org/InStock",
            "url":`https://www.yourpoodle.com/yourpoodle/urun/${p.id}`}},
      })),
    },
  };
  const faqSchema={
    "@context":"https://schema.org","@type":"FAQPage",
    "mainEntity":SSS_LIST.map(s=>({
      "@type":"Question","name":s.q,"acceptedAnswer":{"@type":"Answer","text":s.a},
    })),
  };

  return (
    <YPLayout activeLink="/yourpoodle/magaza">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(collectionSchema)}}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faqSchema)}}/>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        .noscroll::-webkit-scrollbar { display: none; }
        .noscroll { -ms-overflow-style: none; scrollbar-width: none; }
        .prod-card { cursor: pointer; transition: transform .15s, box-shadow .15s; background: #fff; }
        .prod-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(0,0,0,0.11) !important; }
        .add-btn:hover:not(:disabled) { background: #6D28D9 !important; }
        .add-btn { transition: background .12s; }
        .overlay-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9990; }
        .filter-drawer { position: fixed; right: 0; top: 0; bottom: 0; width: min(320px,100vw);
                         background: #fff; z-index: 9991; box-shadow: -4px 0 24px rgba(0,0,0,.15);
                         display: flex; flex-direction: column; }
        .cart-drawer  { position: fixed; right: 0; top: 0; bottom: 0; width: min(380px,100vw);
                        background: #fff; z-index: 9991; box-shadow: -4px 0 24px rgba(0,0,0,.15);
                        display: flex; flex-direction: column; }
        .feat-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        .all-grid  { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; }
        .faq-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 0 24px; }
        @media (max-width: 1023px) { .feat-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 767px)  { .feat-grid { grid-template-columns: repeat(2,1fr); } .faq-grid { grid-template-columns: 1fr; } }
        @media (min-width: 1024px) { .all-grid { grid-template-columns: repeat(3,1fr); } }
        @media (min-width: 1280px) { .all-grid { grid-template-columns: repeat(4,1fr); } }
        .banner-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.10) !important; }
        .banner-card { transition: box-shadow .15s; }
        .quick-chip { transition: all .12s; }
        .quick-chip:hover { border-color: #7C3AED !important; color: #7C3AED !important; }
        .seo-link { color: #7C3AED; text-decoration: none; font-weight: 600; }
        /* footer links */
        .ft-link { color: #C4B5FD; font-size: 13px; text-decoration: none; display: block; margin-bottom: 8px; }
        .ft-link:hover { color: #fff; }
      `}</style>

      {/* ── Promo bar ────────────────────────────────────── */}
      <div style={{ background:"#7C3AED", padding:"7px 16px", textAlign:"center" }}>
        <span style={{ fontSize:13, fontWeight:700, color:"#fff" }}>🚚 500₺ üzeri kargo bedava! 🎉</span>
      </div>

      {/* ── Breadcrumb ───────────────────────────────────── */}
      <div style={{ background:"#fff", padding:"10px 20px", borderBottom:"1px solid #F3F4F6",
                    display:"flex", alignItems:"center", gap:6, maxWidth:1200, margin:"0 auto", width:"100%" }}>
        <button onClick={()=>navigate("/yourpoodle")}
          style={{ background:"none", border:"none", cursor:"pointer", color:"#7C3AED", fontSize:13, fontWeight:600, padding:0 }}>
          Ana Sayfa
        </button>
        <ChevronRight size={13} color="#D1D5DB"/>
        <span style={{ fontSize:13, fontWeight:700, color:"#111827" }}>Mağaza</span>
      </div>

      <div style={{ maxWidth:1200, margin:"0 auto", width:"100%", padding:"0 20px" }}>

        {/* ── Hero ─────────────────────────────────────── */}
        <div style={{ background:"linear-gradient(135deg,#F9FAFB 0%,#F3E8FF 60%,#EDE9FE 100%)",
                      borderRadius:20, margin:"16px 0", overflow:"hidden",
                      display:"flex", alignItems:"center", justifyContent:"space-between",
                      minHeight:200, position:"relative" }}>
          {/* Left */}
          <div style={{ padding:"32px 32px 32px 36px", flex:1, minWidth:0, zIndex:2 }}>
            <h1 style={{ fontSize:34, fontWeight:900, color:"#111827", margin:"0 0 6px", lineHeight:1.2 }}>
              Poodle Mağazası
            </h1>
            <p style={{ fontSize:15, fontWeight:700, color:"#7C3AED", margin:"0 0 10px" }}>
              Royal Canin, Reflex Plus ve daha fazlası
            </p>
            <p style={{ fontSize:13.5, color:"#6B7280", lineHeight:1.6, margin:"0 0 20px", maxWidth:420 }}>
              Poodle'ınız için en kaliteli mamalar, aksesuarlar ve bakım ürünlerini tek çatı altında bulun.
            </p>
            {/* Value props */}
            <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
              {[
                { icon:"🎁", top:`${total>0?total+"+":"3+"}`, bot:"Ürün\nGeniş ürün seçeneği" },
                { icon:"🚚", top:"Türkiye Geneli", bot:"Kargo\nHızlı ve güvenilir" },
                { icon:"🔒", top:"Güvenli Ödeme", bot:"256-bit SSL ile\ngüvenli alışveriş" },
              ].map(({ icon, top, bot }) => (
                <div key={top} style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:"rgba(124,58,237,0.12)",
                                display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
                    {icon}
                  </div>
                  <div>
                    <div style={{ fontSize:12.5, fontWeight:800, color:"#111827", lineHeight:1.2 }}>{top}</div>
                    <div style={{ fontSize:10.5, color:"#9CA3AF", lineHeight:1.4, whiteSpace:"pre-line" }}>{bot}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Right imagery */}
          <div style={{ position:"relative", flexShrink:0, width:300, height:200,
                        display:"flex", alignItems:"flex-end", justifyContent:"flex-end",
                        padding:"0 16px 0 0" }}>
            <div style={{ fontSize:120, lineHeight:1, opacity:0.85 }}>🐩</div>
            <div style={{ position:"absolute", top:10, right:140, fontSize:40,
                          filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.15))" }}>🍖</div>
            <div style={{ position:"absolute", top:30, right:60, fontSize:36,
                          filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.15))" }}>🦴</div>
          </div>
        </div>

        {/* ── Search + Filters ──────────────────────────── */}
        <div style={{ background:"#fff", borderRadius:16, border:"1px solid #F3F4F6",
                      padding:"16px", marginBottom:12, boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
          {/* Search row */}
          <div style={{ display:"flex", gap:10, marginBottom:14 }}>
            <div style={{ flex:1, display:"flex", alignItems:"center", background:"#F9FAFB",
                          border:"1.5px solid #E5E7EB", borderRadius:12, height:46, overflow:"hidden" }}>
              <div style={{ paddingLeft:14, color:"#9CA3AF", display:"flex", flexShrink:0 }}>
                <Search size={17} strokeWidth={2}/>
              </div>
              <input value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="Ürün, marka ara…"
                style={{ flex:1, border:"none", outline:"none", fontSize:14, color:"#111827",
                         background:"transparent", padding:"0 12px" }}/>
              {search&&<button onClick={()=>setSearch("")}
                style={{ paddingRight:12, background:"none", border:"none", cursor:"pointer", color:"#9CA3AF" }}>
                <X size={15}/>
              </button>}
            </div>
            <button onClick={()=>setFilterOpen(true)}
              style={{ width:46, height:46, borderRadius:12, border:"1.5px solid #E5E7EB",
                       background:filterBrands.length>0||filterInStock||filterMaxPrice?"#EDE8FF":"#fff",
                       display:"flex", alignItems:"center", justifyContent:"center",
                       cursor:"pointer", flexShrink:0, position:"relative" }}>
              <SlidersHorizontal size={17} color={filterBrands.length>0||filterInStock||filterMaxPrice?"#7C3AED":"#6B7280"}/>
            </button>
            <button onClick={()=>setCartOpen(true)}
              style={{ width:46, height:46, borderRadius:12, border:"1.5px solid #E5E7EB",
                       background:"#fff", display:"flex", alignItems:"center", justifyContent:"center",
                       cursor:"pointer", flexShrink:0, position:"relative" }}>
              <ShoppingCart size={17} color="#6B7280"/>
              {cartCount>0&&<span style={{ position:"absolute", top:5, right:5, minWidth:16, height:16,
                borderRadius:"50%", background:"#7C3AED", color:"#fff", fontSize:9,
                fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 3px" }}>
                {cartCount}
              </span>}
            </button>
          </div>

          {/* Category pills */}
          <div className="noscroll" style={{ display:"flex", gap:8, overflowX:"auto", marginBottom:12, paddingBottom:2 }}>
            {CATS.map(c=>(
              <button key={c.id} onClick={()=>setActiveCat(c.id)}
                style={{ flexShrink:0, display:"flex", alignItems:"center", gap:5, padding:"7px 16px",
                         borderRadius:24, border:"1.5px solid",
                         borderColor:activeCat===c.id?"#7C3AED":"#E5E7EB",
                         background:activeCat===c.id?"#7C3AED":"#fff",
                         color:activeCat===c.id?"#fff":"#374151",
                         fontSize:12.5, fontWeight:700, cursor:"pointer" }}>
                <span style={{ fontSize:14 }}>{c.icon}</span> {c.label}
              </button>
            ))}
          </div>

          {/* Quick filters + sort */}
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
            <span style={{ fontSize:12, fontWeight:700, color:"#9CA3AF", flexShrink:0 }}>Hızlı Filtreler:</span>
            <div className="noscroll" style={{ display:"flex", gap:6, overflowX:"auto", flex:1 }}>
              {QUICK_FILTERS.map(f=>(
                <button key={f} onClick={()=>setActiveQuick(activeQuick===f?null:f)} className="quick-chip"
                  style={{ flexShrink:0, padding:"5px 12px", borderRadius:20, border:"1.5px solid",
                           borderColor:activeQuick===f?"#7C3AED":"#E5E7EB",
                           background:activeQuick===f?"#EDE8FF":"#fff",
                           color:activeQuick===f?"#7C3AED":"#6B7280",
                           fontSize:12, fontWeight:600, cursor:"pointer" }}>
                  {f}
                </button>
              ))}
            </div>
            {/* Sort */}
            <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
              <span style={{ fontSize:12, color:"#9CA3AF", fontWeight:600 }}>Sırala:</span>
              <div style={{ position:"relative" }}>
                <select value={sort} onChange={e=>setSort(e.target.value as typeof SORT_OPTIONS[number])}
                  style={{ appearance:"none", padding:"6px 28px 6px 10px", borderRadius:10,
                           border:"1.5px solid #E5E7EB", background:"#fff", fontSize:12.5,
                           fontWeight:600, color:"#374151", cursor:"pointer", outline:"none" }}>
                  {SORT_OPTIONS.map(s=><option key={s}>{s}</option>)}
                </select>
                <ChevronDown size={13} color="#9CA3AF"
                  style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}/>
              </div>
            </div>
          </div>
        </div>

        {/* ── Featured Products ─────────────────────────── */}
        {featured.length>0 && (
          <div style={{ marginBottom:24 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
              <div>
                <h2 style={{ fontSize:20, fontWeight:800, color:"#111827", margin:"0 0 4px" }}>
                  Öne Çıkan Ürünler
                </h2>
                <p style={{ fontSize:13, color:"#9CA3AF", margin:0 }}>
                  Poodle sahipleri tarafından en çok tercih edilen ürünler 🐾
                </p>
              </div>
              <button onClick={()=>setActiveCat("all")}
                style={{ display:"flex", alignItems:"center", gap:4, background:"none", border:"none",
                         color:"#7C3AED", fontSize:13, fontWeight:700, cursor:"pointer", flexShrink:0 }}>
                Tümünü Gör <ChevronRight size={15}/>
              </button>
            </div>
            <div className="feat-grid">
              {featured.map(p=>{
                const disc=discountPct(p);
                const inCart=cart.some(i=>i.id===p.id);
                return (
                  <div key={p.id} className="prod-card" onClick={()=>navigate(`/yourpoodle/urun/${p.id}`)}
                    style={{ borderRadius:18, overflow:"hidden", border:"1.5px solid #F3F4F6",
                             boxShadow:"0 2px 10px rgba(0,0,0,0.06)", display:"flex", flexDirection:"column" }}>
                    {/* Image */}
                    <div style={{ background:"#F9FAFB", aspectRatio:"4/3", position:"relative",
                                  display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
                      {p.img
                        ? <img src={p.img} alt={p.name} loading="lazy"
                            style={{ width:"100%", height:"100%", objectFit:"contain", padding:16 }}
                            onError={e=>{(e.target as HTMLImageElement).style.display="none";}}/>
                        : <span style={{ fontSize:56 }}>🐾</span>
                      }
                      {disc>0&&(
                        <div style={{ position:"absolute", top:10, left:10, background:"#EF4444",
                                      borderRadius:8, padding:"4px 9px" }}>
                          <span style={{ fontSize:10, fontWeight:800, color:"#fff" }}>%{disc} İNDİRİM</span>
                        </div>
                      )}
                      <button onClick={e=>toggleWish(p.id,e)}
                        style={{ position:"absolute", top:10, right:10, width:32, height:32,
                                 background:"#fff", border:"none", borderRadius:"50%",
                                 display:"flex", alignItems:"center", justifyContent:"center",
                                 cursor:"pointer", boxShadow:"0 2px 8px rgba(0,0,0,0.12)" }}>
                        <Heart size={15} color={wishlist.includes(p.id)?"#E75480":"#D1D5DB"}
                          fill={wishlist.includes(p.id)?"#E75480":"none"} strokeWidth={2}/>
                      </button>
                    </div>
                    {/* Info */}
                    <div style={{ padding:"14px 16px 16px", flex:1, display:"flex", flexDirection:"column" }}>
                      {/* Stars */}
                      <div style={{ display:"flex", alignItems:"center", gap:4, marginBottom:6 }}>
                        {[1,2,3,4,5].map(i=>(
                          <Star key={i} size={12} color="#F59E0B" fill={i<=4?"#F59E0B":"none"} strokeWidth={1.5}/>
                        ))}
                        <span style={{ fontSize:11.5, color:"#9CA3AF", marginLeft:2 }}>
                          ({Math.floor(80+Math.random()*120)})
                        </span>
                      </div>
                      <div style={{ fontSize:13.5, fontWeight:700, color:"#111827", lineHeight:1.4,
                                    marginBottom:8, display:"-webkit-box", overflow:"hidden",
                                    WebkitLineClamp:2, WebkitBoxOrient:"vertical" as any }}>
                        {p.name}
                      </div>
                      {/* Price */}
                      <div style={{ display:"flex", alignItems:"baseline", gap:8, marginBottom:10 }}>
                        <span style={{ fontSize:20, fontWeight:900, color:"#7C3AED" }}>
                          ₺{priceFmt(p.price)}
                        </span>
                        {p.originalPrice&&p.originalPrice>p.price&&(
                          <span style={{ fontSize:13, color:"#9CA3AF", textDecoration:"line-through" }}>
                            ₺{priceFmt(p.originalPrice)}
                          </span>
                        )}
                      </div>
                      {/* Hızlı Teslimat badge */}
                      <div style={{ marginBottom:12 }}>
                        <span style={{ fontSize:11, fontWeight:700, color:"#059669",
                                       background:"#D1FAE5", borderRadius:20, padding:"3px 10px" }}>
                          ⚡ Hızlı Teslimat
                        </span>
                      </div>
                      {/* Sepete Ekle */}
                      <button onClick={e=>addToCart(p,e)} disabled={(p.stock||0)<=0} className="add-btn"
                        style={{ width:"100%", height:42, borderRadius:12, border:"none",
                                 background:(p.stock||0)>0?(inCart?"#5B21B6":"#7C3AED"):"#D1D5DB",
                                 color:"#fff", fontWeight:700, fontSize:14,
                                 cursor:(p.stock||0)>0?"pointer":"not-allowed",
                                 display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}>
                        <ShoppingCart size={16}/> {inCart?"Sepette ✓":"Sepete Ekle"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── All Products ──────────────────────────────── */}
        <div style={{ marginBottom:8 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
            <span style={{ fontSize:13, color:"#9CA3AF", fontWeight:600 }}>
              {isLoading?"Yükleniyor…":search?`"${search}" için ${filtered.length} ürün`:`${filtered.length} ürün`}
            </span>
          </div>
          {isLoading
            ? <div className="all-grid">
                {Array.from({length:8}).map((_,i)=>(
                  <div key={i} style={{ background:"#F3F4F6", borderRadius:16, height:220,
                                        animation:"pulse 1.5s ease-in-out infinite" }}/>
                ))}
              </div>
            : <div className="all-grid">
                {visible.map(p=>{
                  const disc=discountPct(p);
                  const inCart=cart.some(i=>i.id===p.id);
                  return (
                    <div key={p.id} className="prod-card" onClick={()=>navigate(`/yourpoodle/urun/${p.id}`)}
                      style={{ borderRadius:16, overflow:"hidden", border:"1.5px solid #F3F4F6",
                               boxShadow:"0 1px 6px rgba(0,0,0,0.06)", display:"flex", flexDirection:"column" }}>
                      <div style={{ background:"#F9FAFB", aspectRatio:"1/1", position:"relative",
                                    display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
                        {p.img
                          ? <img src={p.img} alt={p.name} loading="lazy"
                              style={{ width:"100%", height:"100%", objectFit:"contain", padding:12 }}
                              onError={e=>{(e.target as HTMLImageElement).style.display="none";}}/>
                          : <span style={{ fontSize:40 }}>🐾</span>
                        }
                        {disc>0&&(
                          <div style={{ position:"absolute", top:6, left:6, background:"#EF4444",
                                        borderRadius:6, padding:"2px 7px" }}>
                            <span style={{ fontSize:9, fontWeight:800, color:"#fff" }}>%{disc} İND.</span>
                          </div>
                        )}
                        <button onClick={e=>toggleWish(p.id,e)}
                          style={{ position:"absolute", top:6, right:6, width:28, height:28,
                                   background:"rgba(255,255,255,0.9)", border:"none", borderRadius:"50%",
                                   display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                          <Heart size={13} color={wishlist.includes(p.id)?"#E75480":"#D1D5DB"}
                            fill={wishlist.includes(p.id)?"#E75480":"none"} strokeWidth={2}/>
                        </button>
                        {(p.stock||0)<=0&&<div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.4)",
                            display:"flex", alignItems:"center", justifyContent:"center" }}>
                          <span style={{ fontSize:11, fontWeight:800, color:"#fff", background:"rgba(0,0,0,0.55)",
                                         padding:"4px 10px", borderRadius:20 }}>Tükendi</span>
                        </div>}
                      </div>
                      <div style={{ padding:"10px 12px 12px", flex:1, display:"flex", flexDirection:"column" }}>
                        {p.brandName&&<div style={{ fontSize:9, fontWeight:800, color:"#7C3AED",
                          textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:2 }}>{p.brandName}</div>}
                        <div style={{ fontSize:12, fontWeight:700, color:"#111827", lineHeight:1.4,
                                      marginBottom:8, flex:1, display:"-webkit-box", overflow:"hidden",
                                      WebkitLineClamp:2, WebkitBoxOrient:"vertical" as any }}>{p.name}</div>
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                          <div>
                            <div style={{ fontSize:15, fontWeight:900, color:"#7C3AED" }}>
                              ₺{priceFmt(p.price)}
                            </div>
                            {p.originalPrice&&p.originalPrice>p.price&&(
                              <div style={{ fontSize:10, color:"#9CA3AF", textDecoration:"line-through" }}>
                                ₺{priceFmt(p.originalPrice)}
                              </div>
                            )}
                          </div>
                          <button onClick={e=>addToCart(p,e)} disabled={(p.stock||0)<=0} className="add-btn"
                            style={{ width:34, height:34, borderRadius:10, border:"none",
                                     background:(p.stock||0)>0?(inCart?"#5B21B6":"#7C3AED"):"#D1D5DB",
                                     display:"flex", alignItems:"center", justifyContent:"center",
                                     cursor:(p.stock||0)>0?"pointer":"not-allowed", flexShrink:0 }}>
                            {inCart?<span style={{ fontSize:12, color:"#fff", fontWeight:900 }}>✓</span>
                                   :<Plus size={16} color="#fff" strokeWidth={2.5}/>}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {filtered.length===0&&(
                  <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"56px 16px", color:"#9CA3AF" }}>
                    <div style={{ fontSize:48, marginBottom:14 }}>🔍</div>
                    <div style={{ fontSize:16, fontWeight:700, color:"#374151", marginBottom:6 }}>Ürün bulunamadı</div>
                    <div style={{ fontSize:13 }}>Filtre veya arama kriterlerinizi değiştirerek tekrar deneyin.</div>
                    <button onClick={()=>{setSearch("");setActiveCat("all");setActiveQuick(null);setFilterBrands([]);setFilterInStock(false);setFilterMaxPrice("");}}
                      style={{ marginTop:16, padding:"10px 24px", borderRadius:20, border:"none",
                               background:"#7C3AED", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer" }}>
                      Filtreleri Temizle
                    </button>
                  </div>
                )}
              </div>
          }
          {hasMore&&(
            <div style={{ textAlign:"center", padding:"20px 0 8px" }}>
              <button onClick={()=>setPage(p=>p+1)}
                style={{ padding:"12px 32px", borderRadius:24, border:"1.5px solid #7C3AED",
                         background:"#fff", color:"#7C3AED", fontWeight:700, fontSize:14, cursor:"pointer" }}>
                Daha Fazla Yükle ({filtered.length-visible.length} ürün daha)
              </button>
            </div>
          )}
        </div>

        {/* ── Feature banners ──────────────────────────── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",
                      gap:14, margin:"24px 0" }}>
          {[
            { emoji:"🍖", title:"Poodle Mamaları", desc:"Yaşına ve ihtiyacına uygun premium mamalar.", color:"#F3E8FF", link:"mama" },
            { emoji:"✨", title:"Bakım Ürünleri",  desc:"Tüy, cilt ve hijyen için en iyi ürünler.",   color:"#FCE7F3", link:"bakim" },
            { emoji:"🚚", title:"Kargo ve Ödeme",  desc:"Hızlı kargo, güvenli ödeme ve kolay iade.",  color:"#DBEAFE", link:"all" },
          ].map(b=>(
            <div key={b.title} className="banner-card"
              style={{ background:b.color, borderRadius:18, padding:"20px 22px 22px",
                       boxShadow:"0 2px 8px rgba(0,0,0,0.05)", cursor:"pointer" }}
              onClick={()=>setActiveCat(b.link as CatId)}>
              <div style={{ fontSize:36, marginBottom:10 }}>{b.emoji}</div>
              <div style={{ fontSize:15, fontWeight:800, color:"#111827", marginBottom:5 }}>{b.title}</div>
              <div style={{ fontSize:12.5, color:"#6B7280", lineHeight:1.55, marginBottom:14 }}>{b.desc}</div>
              <div style={{ display:"flex", alignItems:"center", gap:4,
                            color:"#7C3AED", fontSize:12.5, fontWeight:700 }}>
                Ürünleri İncele <ChevronRight size={14}/>
              </div>
            </div>
          ))}
        </div>

        {/* ── Trust bar ─────────────────────────────────── */}
        <div style={{ background:"#F9FAFB", borderRadius:18, padding:"20px 24px",
                      display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",
                      gap:16, marginBottom:24 }}>
          {[
            { Icon:Truck,        title:"Hızlı Kargo",    sub:"Türkiye geneli hızlı\nve güvenilir teslimat" },
            { Icon:RefreshCw,    title:"Kolay İade",     sub:"14 gün içinde\nkopuksuz iade imkânı" },
            { Icon:ShieldCheck,  title:"Güvenli Ödeme",  sub:"256-bit SSL ile\n%100 güvenli ödeme" },
            { Icon:CreditCard,   title:"Taksit İmkânı",  sub:"Tüm kartlara\n12 taksit fırsatı" },
          ].map(({ Icon, title, sub })=>(
            <div key={title} style={{ display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:"#EDE9FE",
                            display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Icon size={20} color="#7C3AED" strokeWidth={1.8}/>
              </div>
              <div>
                <div style={{ fontSize:13.5, fontWeight:800, color:"#111827", marginBottom:2 }}>{title}</div>
                <div style={{ fontSize:11.5, color:"#9CA3AF", lineHeight:1.45, whiteSpace:"pre-line" }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── FAQ ───────────────────────────────────────── */}
        <div style={{ marginBottom:32 }}>
          <h2 style={{ fontSize:20, fontWeight:800, color:"#111827", marginBottom:16,
                       display:"flex", alignItems:"center", gap:8 }}>
            Sık Sorulan Sorular 🐾
          </h2>
          <div className="faq-grid">
            {SSS_LIST.map((s,i)=>(
              <div key={i}
                style={{ borderBottom:"1px solid #F3F4F6" }}>
                <button onClick={()=>setOpenFaq(openFaq===i?null:i)}
                  style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between",
                           padding:"14px 0", background:"none", border:"none", cursor:"pointer",
                           textAlign:"left", gap:10 }}>
                  <span style={{ fontSize:14, fontWeight:700, color:"#111827", lineHeight:1.4 }}>{s.q}</span>
                  <ChevronDown size={16} color="#7C3AED" strokeWidth={2}
                    style={{ flexShrink:0, transform:openFaq===i?"rotate(180deg)":"none", transition:".2s" }}/>
                </button>
                {openFaq===i&&(
                  <div style={{ padding:"0 0 14px" }}>
                    <p style={{ fontSize:13.5, color:"#6B7280", lineHeight:1.7, margin:0 }}>{s.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filter Drawer ──────────────────────────────── */}
      {filterOpen&&(
        <>
          <div className="overlay-backdrop" onClick={()=>setFilterOpen(false)}/>
          <div className="filter-drawer">
            <div style={{ padding:"16px 20px", borderBottom:"1px solid #F3F4F6",
                          display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <span style={{ fontSize:16, fontWeight:800 }}>Filtrele</span>
              <button onClick={()=>setFilterOpen(false)} style={{ background:"none", border:"none", cursor:"pointer" }}>
                <X size={20}/>
              </button>
            </div>
            <div style={{ flex:1, overflowY:"auto", padding:"20px" }}>
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:12, fontWeight:800, color:"#6B7280", textTransform:"uppercase",
                              letterSpacing:"0.07em", marginBottom:10 }}>Marka</div>
                <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                  {BRANDS.map(b=>(
                    <label key={b} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
                      <input type="checkbox" checked={filterBrands.includes(b)}
                        onChange={e=>setFilterBrands(prev=>e.target.checked?[...prev,b]:prev.filter(x=>x!==b))}
                        style={{ width:16, height:16, accentColor:"#7C3AED", cursor:"pointer" }}/>
                      <span style={{ fontSize:13.5, color:"#111827" }}>{b}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:12, fontWeight:800, color:"#6B7280", textTransform:"uppercase",
                              letterSpacing:"0.07em", marginBottom:10 }}>Maksimum Fiyat</div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <input type="number" value={filterMaxPrice} onChange={e=>setFilterMaxPrice(e.target.value)}
                    placeholder="ör. 500"
                    style={{ flex:1, border:"1.5px solid #E5E7EB", borderRadius:9, padding:"8px 12px",
                             fontSize:14, outline:"none" }}/>
                  <span style={{ fontSize:13, color:"#9CA3AF" }}>₺</span>
                </div>
              </div>
              <label style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}>
                <input type="checkbox" checked={filterInStock} onChange={e=>setFilterInStock(e.target.checked)}
                  style={{ width:18, height:18, accentColor:"#7C3AED", cursor:"pointer" }}/>
                <span style={{ fontSize:13.5, fontWeight:600, color:"#111827" }}>Yalnızca stokta olanlar</span>
              </label>
            </div>
            <div style={{ padding:"14px 20px", borderTop:"1px solid #F3F4F6", display:"flex", gap:10 }}>
              <button onClick={()=>{setFilterBrands([]);setFilterInStock(false);setFilterMaxPrice("");}}
                style={{ flex:1, height:42, borderRadius:12, border:"1.5px solid #E5E7EB",
                         background:"#fff", color:"#6B7280", fontWeight:700, fontSize:14, cursor:"pointer" }}>
                Temizle
              </button>
              <button onClick={()=>setFilterOpen(false)}
                style={{ flex:2, height:42, borderRadius:12, border:"none", background:"#7C3AED",
                         color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer" }}>
                Uygula ({filtered.length} ürün)
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Cart Drawer ──────────────────────────────────── */}
      {cartOpen&&(
        <>
          <div className="overlay-backdrop" onClick={()=>setCartOpen(false)}/>
          <div className="cart-drawer">
            <div style={{ padding:"16px 20px", borderBottom:"1px solid #F3F4F6",
                          display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <ShoppingCart size={18} color="#7C3AED"/>
                <span style={{ fontSize:16, fontWeight:800 }}>Sepetim</span>
                {cartCount>0&&<span style={{ fontSize:12, fontWeight:700, background:"#7C3AED",
                  color:"#fff", borderRadius:20, padding:"2px 9px" }}>{cartCount}</span>}
              </div>
              <button onClick={()=>setCartOpen(false)} style={{ background:"none", border:"none", cursor:"pointer" }}>
                <X size={20}/>
              </button>
            </div>
            <div style={{ flex:1, overflowY:"auto", padding:"16px" }}>
              {cart.length===0
                ? <div style={{ textAlign:"center", padding:"56px 16px", color:"#9CA3AF" }}>
                    <div style={{ fontSize:48, marginBottom:16 }}>🛒</div>
                    <div style={{ fontSize:15, fontWeight:700, marginBottom:14 }}>Sepetiniz boş</div>
                    <button onClick={()=>setCartOpen(false)}
                      style={{ padding:"10px 24px", borderRadius:20, border:"none",
                               background:"#7C3AED", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer" }}>
                      Alışverişe Başla
                    </button>
                  </div>
                : cart.map(item=>(
                    <div key={item.id} style={{ display:"flex", gap:12, padding:"12px 0",
                                                borderBottom:"1px solid #F9FAFB" }}>
                      <div style={{ width:56, height:56, borderRadius:10, background:"#F3F4F6",
                                    display:"flex", alignItems:"center", justifyContent:"center",
                                    flexShrink:0, overflow:"hidden" }}>
                        {item.img
                          ? <img src={item.img} alt={item.name}
                              style={{ width:"100%", height:"100%", objectFit:"cover" }}
                              onError={e=>{(e.target as HTMLImageElement).style.display="none";}}/>
                          : <span style={{ fontSize:24 }}>🐾</span>
                        }
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:12.5, fontWeight:700, color:"#111827", lineHeight:1.4,
                                      marginBottom:6, overflow:"hidden", whiteSpace:"nowrap",
                                      textOverflow:"ellipsis" }}>{item.name}</div>
                        <div style={{ fontSize:14, fontWeight:900, color:"#7C3AED", marginBottom:8 }}>
                          ₺{priceFmt(item.price*item.qty)}
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <div style={{ display:"flex", alignItems:"center", border:"1.5px solid #E5E7EB",
                                        borderRadius:8, overflow:"hidden" }}>
                            <button onClick={()=>changeQty(item.id,-1)}
                              style={{ width:28, height:28, background:"#fff", border:"none",
                                       cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                              <Minus size={12}/>
                            </button>
                            <span style={{ fontSize:13, fontWeight:700, padding:"0 8px", minWidth:20,
                                           textAlign:"center" }}>{item.qty}</span>
                            <button onClick={()=>changeQty(item.id,+1)}
                              style={{ width:28, height:28, background:"#fff", border:"none",
                                       cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                              <Plus size={12}/>
                            </button>
                          </div>
                          <button onClick={()=>removeFromCart(item.id)}
                            style={{ background:"none", border:"none", cursor:"pointer", color:"#D1D5DB" }}>
                            <Trash2 size={14}/>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
              }
            </div>
            {cart.length>0&&(
              <div style={{ padding:"16px 20px", borderTop:"1px solid #F3F4F6" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
                  <span style={{ fontSize:14, fontWeight:700 }}>Toplam</span>
                  <span style={{ fontSize:17, fontWeight:900, color:"#7C3AED" }}>
                    ₺{priceFmt(cartTotal)}
                  </span>
                </div>
                <button onClick={()=>{setCartOpen(false);navigate("/yourpoodle/sepet");}}
                  style={{ width:"100%", height:46, borderRadius:14, border:"none", background:"#7C3AED",
                           color:"#fff", fontSize:15, fontWeight:800, cursor:"pointer" }}>
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
