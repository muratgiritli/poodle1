import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Search, ChevronRight, Plus, Check, AlertCircle,
  Package, Droplets, Soup, Candy, Briefcase, Home, ToyBrick,
  UtensilsCrossed, Link, HeartPulse, Scissors, Sparkles,
  Smile, Baby, Bug, Eye, Wand2,
} from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { useCart } from "@/contexts/CartContext";
import { IS_YP } from "@/lib/store";

const BASE = IS_YP ? "" : "/yourpoodle";

/* ── Tokens ── */
const P   = "#6200EE";
const PL  = "#F3EEFF";
const GB  = "#E5E7EB";

/* ── Slugify helper ── */
function slugify(str: string) {
  return str.toLowerCase()
    .replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s")
    .replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c")
    .replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
}

/* ── Accent map ── */
const COLOR_MAP = {
  purple: { bg:"#F3EEFF", border:"#DDD6FE", icon:"#6200EE" },
  red:    { bg:"#FEF2F2", border:"#FECACA", icon:"#EF4444" },
  teal:   { bg:"#F0FDFA", border:"#99F6E4", icon:"#14B8A6" },
  orange: { bg:"#FFF7ED", border:"#FED7AA", icon:"#F97316" },
  blue:   { bg:"#EFF6FF", border:"#BFDBFE", icon:"#3B82F6" },
  pink:   { bg:"#FDF2F8", border:"#FBCFE8", icon:"#EC4899" },
  green:  { bg:"#F0FDF4", border:"#BBF7D0", icon:"#22C55E" },
  yellow: { bg:"#FEFCE8", border:"#FEF08A", icon:"#EAB308" },
} as const;
type AccentKey = keyof typeof COLOR_MAP;

/* ── Category data ── */
interface Cat { id:string; name:string; color:AccentKey; Icon:React.ElementType; slug:string; }
const CATEGORIES: Cat[] = [
  { id:"c1",  name:"Kuru Mama",              color:"purple", Icon:Package,          slug:"kuru-mama"           },
  { id:"c2",  name:"Tuvalet",                color:"red",    Icon:Droplets,         slug:"tuvalet"             },
  { id:"c3",  name:"Yaş Mama",               color:"teal",   Icon:Soup,             slug:"yas-mama"            },
  { id:"c4",  name:"Ödül Çeşitleri",         color:"orange", Icon:Candy,            slug:"odul-cesitleri"      },
  { id:"c5",  name:"Taşıma Çantaları",       color:"blue",   Icon:Briefcase,        slug:"tasima-cantalari"    },
  { id:"c6",  name:"Kulübeler",              color:"pink",   Icon:Home,             slug:"kulubeler"           },
  { id:"c7",  name:"Oyuncaklar",             color:"green",  Icon:ToyBrick,         slug:"oyuncaklar"          },
  { id:"c8",  name:"Mama ve Su Kapları",     color:"purple", Icon:UtensilsCrossed,  slug:"mama-su-kaplari"     },
  { id:"c9",  name:"Bel ve Boyun Tasmaları", color:"orange", Icon:Link,             slug:"bel-boyun-tasmalari" },
  { id:"c10", name:"Bakım ve Sağlık",        color:"teal",   Icon:HeartPulse,       slug:"bakim-saglik"        },
  { id:"c11", name:"Makas ve Taraklar",      color:"yellow", Icon:Scissors,         slug:"makas-taraklar"      },
  { id:"c12", name:"Şampuan ve Parfüm",      color:"blue",   Icon:Sparkles,         slug:"sampuan-parfum"      },
  { id:"c13", name:"Ağız ve Diş Bakımı",    color:"blue",   Icon:Smile,            slug:"agiz-dis-bakimi"     },
  { id:"c14", name:"Süt Tozu ve Biberon",    color:"pink",   Icon:Baby,             slug:"sut-tozu-biberon"    },
  { id:"c15", name:"Bit, Pire ve Parazit",   color:"green",  Icon:Bug,              slug:"bit-pire-parazit"    },
  { id:"c16", name:"Göz ve Kulak Bakımı",    color:"purple", Icon:Eye,              slug:"goz-kulak-bakimi"    },
  { id:"c17", name:"Tıraş Ekipmanları",      color:"yellow", Icon:Wand2,            slug:"tiras-ekipmanlari"   },
];

/* ── Inline toast ── */
function Toast({ message, visible }: { message:string; visible:boolean }) {
  return (
    <div style={{ position:"fixed", bottom:88, left:"50%", transform:"translateX(-50%)",
                  zIndex:999, pointerEvents:"none", opacity:visible?1:0, transition:"opacity 0.3s" }}>
      <div style={{ background:"#1A0052", color:"#fff", padding:"10px 22px", borderRadius:999,
                    fontSize:13, fontWeight:500, whiteSpace:"nowrap", boxShadow:"0 4px 16px rgba(0,0,0,0.25)" }}>
        {message}
      </div>
    </div>
  );
}

/* ── Product card skeleton ── */
function ProductSkeleton() {
  return (
    <div style={{ flexShrink:0, width:148, borderRadius:14, border:`1px solid ${GB}`,
                  background:"#fff", overflow:"hidden" }}>
      <div style={{ width:"100%", height:120, background:"#F3F4F6", animation:"shimmer 1.4s infinite" }} />
      <div style={{ padding:"10px 10px 12px" }}>
        <div style={{ height:12, background:"#F3F4F6", borderRadius:6, marginBottom:6 }} />
        <div style={{ height:12, background:"#F3F4F6", borderRadius:6, width:"60%", marginBottom:10 }} />
        <div style={{ height:30, background:"#F3F4F6", borderRadius:8 }} />
      </div>
    </div>
  );
}

/* ── Product card ── */
function ProductCard({ product, onNavigate }: {
  product: any;
  onNavigate: (id: number, name: string) => void;
}) {
  const { updateQty, basket } = useCart();
  const [added, setAdded] = useState(false);
  const sid = String(product.id);
  const inCart = (basket[sid] || 0) > 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = updateQty(sid, 1);
    if (ok !== false) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${product.name} ürününe git`}
      onClick={() => onNavigate(product.id, product.name)}
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") onNavigate(product.id, product.name); }}
      style={{ flexShrink:0, width:148, borderRadius:14, border:`1px solid ${GB}`,
               background:"#fff", overflow:"hidden", cursor:"pointer",
               transition:"box-shadow 0.15s, transform 0.15s",
               boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(98,0,238,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* Image */}
      <div style={{ position:"relative", width:"100%", height:120, background:"#F9FAFB", overflow:"hidden" }}>
        {product.img ? (
          <img
            src={product.img}
            alt={product.name}
            loading="lazy"
            style={{ width:"100%", height:"100%", objectFit:"contain", padding:6 }}
          />
        ) : (
          <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Package size={36} color="#D1D5DB" />
          </div>
        )}
        {hasDiscount && (
          <div style={{ position:"absolute", top:6, left:6, background:"#EF4444", color:"#fff",
                        fontSize:10, fontWeight:800, padding:"2px 6px", borderRadius:6 }}>
            %{Math.round((1 - product.price / product.originalPrice) * 100)} İndirim
          </div>
        )}
        {inCart && !added && (
          <div style={{ position:"absolute", top:6, right:6, width:18, height:18,
                        background:P, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Check size={11} color="#fff" strokeWidth={3} />
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding:"8px 10px 10px" }}>
        <p style={{ fontSize:12, fontWeight:500, color:"#374151", lineHeight:1.4,
                    margin:"0 0 6px", overflow:"hidden", display:"-webkit-box",
                    WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>
          {product.name}
        </p>
        <div style={{ display:"flex", alignItems:"baseline", gap:4, marginBottom:8 }}>
          <span style={{ fontSize:14, fontWeight:800, color:"#111827" }}>
            {product.price.toLocaleString("tr-TR")} ₺
          </span>
          {hasDiscount && (
            <span style={{ fontSize:11, color:"#9CA3AF", textDecoration:"line-through" }}>
              {product.originalPrice.toLocaleString("tr-TR")} ₺
            </span>
          )}
        </div>
        <button
          aria-label={`${product.name} sepete ekle`}
          onClick={handleAdd}
          style={{ width:"100%", padding:"7px 0", borderRadius:8, border:"none",
                   background: added ? "#16A34A" : P,
                   color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer",
                   fontFamily:"inherit", display:"flex", alignItems:"center",
                   justifyContent:"center", gap:5, transition:"background 0.2s" }}>
          {added ? <><Check size={13} /> Eklendi</> : <><Plus size={13} /> Sepete Ekle</>}
        </button>
      </div>
    </div>
  );
}

/* ── Category row ── */
function CategoryRow({ cat, onClick }: { cat:Cat; onClick:()=>void }) {
  const c = COLOR_MAP[cat.color];
  return (
    <div
      role="button"
      aria-label={`${cat.name} kategorisine git`}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") onClick(); }}
      style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
               padding:"12px", marginBottom:8, borderRadius:12,
               border:`1px solid ${c.border}`, background:c.bg,
               cursor:"pointer", transition:"box-shadow 0.15s, transform 0.15s" }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "scale(1.01)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "scale(1)"; }}>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:40, height:40, borderRadius:8, background:"#fff",
                      border:`1px solid ${c.border}`, display:"flex", alignItems:"center",
                      justifyContent:"center", flexShrink:0 }}>
          <cat.Icon size={20} color={c.icon} strokeWidth={1.75} />
        </div>
        <span style={{ fontSize:14, fontWeight:500, color:"#111827" }}>{cat.name}</span>
      </div>
      <ChevronRight size={18} color={c.icon} />
    </div>
  );
}

/* ════════════ Main Page ════════════ */
export default function YPMagazaPage() {
  const [, navigate] = useLocation();
  const [searchQ, setSearchQ] = useState("");
  const [toast,   setToast]   = useState({ message:"", visible:false });
  const toastTimer = useRef<ReturnType<typeof setTimeout>|null>(null);

  /* Page title */
  useEffect(() => {
    document.title = "Poodle Ürünleri: Mama, Aksesuar ve Oyuncaklar | YourPoodle";
  }, []);

  const showToast = useCallback((msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message:msg, visible:true });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, visible:false })), 2500);
  }, []);

  /* Products from API */
  const { data: allProducts = [], isLoading, isError, refetch } = useQuery<any[]>({
    queryKey: ["/api/products"],
    staleTime: 5 * 60 * 1000,
  });

  const activeProducts = allProducts.filter((p: any) => p.isActive !== false && p.stock > 0);
  const featured   = activeProducts.slice(0, 8);
  const bestsellers = [...activeProducts].sort((a, b) => b.price - a.price).slice(0, 8);

  /* Navigate to product detail */
  const goProduct = useCallback((id: number, name: string) => {
    navigate(`${BASE}/urun/${id}/${slugify(name)}`);
  }, [navigate]);

  /* Search submit */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQ.trim();
    if (q) navigate(`${BASE}/ara?q=${encodeURIComponent(q)}`);
  };

  /* Category click */
  const goCat = useCallback((cat: Cat) => {
    if (cat.slug === "kuru-mama") navigate(`${BASE}/kuru-mama`);
    else navigate(`${BASE}/kategori/${cat.slug}`);
  }, [navigate]);

  return (
    <YPLayout activeLink={`${BASE}/magaza`} constrain={false} hideFooter>
      <style>{`
        @keyframes shimmer {
          0%   { opacity:1; }
          50%  { opacity:0.5; }
          100% { opacity:1; }
        }
        .yp-mag-scroll::-webkit-scrollbar { display:none; }
      `}</style>
      <Toast message={toast.message} visible={toast.visible} />

      <main className="yp-pw" style={{ padding:"16px 16px 104px" }}>

        {/* ── Search bar ── */}
        <form onSubmit={handleSearch} style={{ position:"relative", marginBottom:20 }}>
          <Search size={16} color="#9CA3AF"
            style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }} />
          <input
            type="search"
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            placeholder="Ürün veya marka ara..."
            aria-label="Mağazada ara"
            style={{ width:"100%", height:46, borderRadius:12, border:`1.5px solid ${GB}`,
                     background:"#fff", paddingLeft:40, paddingRight:16,
                     fontSize:14, color:"#374151", fontFamily:"inherit",
                     outline:"none", boxSizing:"border-box",
                     boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}
            onFocus={e => (e.target.style.borderColor = P)}
            onBlur={e  => (e.target.style.borderColor = GB)}
          />
        </form>

        {/* ── Campaign banner ── */}
        <button
          onClick={() => navigate(`${BASE}/kuru-mama`)}
          aria-label="Kuru mama kampanyasına git"
          style={{ width:"100%", marginBottom:24, borderRadius:16, border:"none", cursor:"pointer",
                   background:`linear-gradient(135deg,${P} 0%,#9333EA 100%)`,
                   padding:"18px 20px", display:"flex", alignItems:"center", justifyContent:"space-between",
                   boxShadow:"0 4px 16px rgba(98,0,238,0.25)", fontFamily:"inherit" }}>
          <div style={{ textAlign:"left" }}>
            <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.8)", letterSpacing:1, textTransform:"uppercase", marginBottom:4 }}>
              Özel Fiyat
            </div>
            <div style={{ fontSize:17, fontWeight:900, color:"#fff", lineHeight:1.25 }}>
              Poodle Kuru Mama
            </div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.85)", marginTop:4 }}>
              Royal Canin, Hill's ve daha fazlası →
            </div>
          </div>
          <div style={{ fontSize:48, lineHeight:1, flexShrink:0, marginLeft:12 }}>🐾</div>
        </button>

        {/* ── Öne Çıkanlar ── */}
        <section style={{ marginBottom:28 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
            <h2 style={{ fontSize:17, fontWeight:800, color:"#111827", margin:0 }}>Öne Çıkan Ürünler</h2>
            <button
              onClick={() => navigate(`${BASE}/magaza/kategori/kuru-mama`)}
              style={{ background:"none", border:"none", cursor:"pointer", fontSize:13,
                       fontWeight:600, color:P, fontFamily:"inherit", padding:0, display:"flex", alignItems:"center", gap:3 }}>
              Tümü <ChevronRight size={14} />
            </button>
          </div>

          {isError ? (
            <div style={{ padding:"28px 16px", textAlign:"center", background:"#FEF2F2",
                          borderRadius:12, border:"1px solid #FECACA" }}>
              <AlertCircle size={28} color="#EF4444" style={{ marginBottom:8 }} />
              <p style={{ fontSize:13, color:"#991B1B", margin:"0 0 12px", fontWeight:500 }}>Ürünler yüklenemedi.</p>
              <button onClick={() => refetch()}
                style={{ padding:"8px 20px", borderRadius:8, border:"none", background:"#EF4444",
                         color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                Tekrar Dene
              </button>
            </div>
          ) : (
            <div className="yp-mag-scroll"
              style={{ display:"flex", gap:12, overflowX:"auto", scrollbarWidth:"none", paddingBottom:4 }}>
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
                : featured.length === 0
                  ? (
                    <div style={{ padding:"24px", textAlign:"center", width:"100%", color:"#9CA3AF", fontSize:13 }}>
                      Henüz ürün bulunmuyor.
                    </div>
                  )
                  : featured.map((p: any) => (
                    <ProductCard key={p.id} product={p} onNavigate={goProduct} />
                  ))
              }
            </div>
          )}
        </section>

        {/* ── Çok Satanlar ── */}
        {!isLoading && !isError && bestsellers.length > 0 && (
          <section style={{ marginBottom:28 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
              <h2 style={{ fontSize:17, fontWeight:800, color:"#111827", margin:0 }}>Çok Satanlar</h2>
              <button
                onClick={() => navigate(`${BASE}/ara`)}
                style={{ background:"none", border:"none", cursor:"pointer", fontSize:13,
                         fontWeight:600, color:P, fontFamily:"inherit", padding:0, display:"flex", alignItems:"center", gap:3 }}>
                Tümü <ChevronRight size={14} />
              </button>
            </div>
            <div className="yp-mag-scroll"
              style={{ display:"flex", gap:12, overflowX:"auto", scrollbarWidth:"none", paddingBottom:4 }}>
              {bestsellers.map((p: any) => (
                <ProductCard key={p.id} product={p} onNavigate={goProduct} />
              ))}
            </div>
          </section>
        )}

        {/* ── Category divider ── */}
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
          <div style={{ flex:1, height:1, background:GB }} />
          <h2 style={{ fontSize:14, fontWeight:700, color:"#6B7280", margin:0, whiteSpace:"nowrap" }}>
            Tüm Kategoriler
          </h2>
          <div style={{ flex:1, height:1, background:GB }} />
        </div>

        {/* ── Category grid ── */}
        <div className="yp-cat-grid">
          {CATEGORIES.map(cat => (
            <CategoryRow key={cat.id} cat={cat} onClick={() => goCat(cat)} />
          ))}
        </div>

      </main>
    </YPLayout>
  );
}
