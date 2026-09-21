import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Search, ChevronRight,
  Package, Droplets, Soup, Candy, Briefcase, Home, ToyBrick,
  UtensilsCrossed, Link, HeartPulse, Scissors, Sparkles,
  Smile, Baby, Bug, Eye, Wand2,
} from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { IS_YP } from "@/lib/store";

const BASE = IS_YP ? "" : "/yourpoodle";

/* ── Tokens ── */
const P   = "#5D3A1A";
const PL  = "#F5F0E6";
const GB  = "#E8E0D4";

/* ── Accent map ── */
const COLOR_MAP = {
  purple: { bg:"#F5F0E6", border:"#E5DDD0", icon:"#5D3A1A" },
  red:    { bg:"#F5F0E6", border:"#E5DDD0", icon:"#5D3A1A" },
  teal:   { bg:"#F5F0E6", border:"#E5DDD0", icon:"#5D3A1A" },
  orange: { bg:"#F5F0E6", border:"#E5DDD0", icon:"#5D3A1A" },
  blue:   { bg:"#F5F0E6", border:"#E5DDD0", icon:"#5D3A1A" },
  pink:   { bg:"#F5F0E6", border:"#E5DDD0", icon:"#5D3A1A" },
  green:  { bg:"#F5F0E6", border:"#E5DDD0", icon:"#5D3A1A" },
  yellow: { bg:"#F5F0E6", border:"#E5DDD0", icon:"#5D3A1A" },
} as const;
type AccentKey = keyof typeof COLOR_MAP;

/* ── Route slug → DB subcategory (mirrors yp-kategori.tsx SLUG_TO_SUBCAT) ── */
const SLUG_TO_SUBCAT: Record<string, string> = {
  "kuru-mama":           "kopek-kuru-mama",
  "tuvalet":             "tuvalet-malzemeleri",
  "yas-mama":            "yas-mama",
  "odul-cesitleri":      "odul-kemik",
  "tasima-cantalari":    "tasima-kulube",
  "kulubeler":           "tasima-kulube",
  "oyuncaklar":          "oyuncak",
  "mama-su-kaplari":     "mama-su-kabi",
  "bel-boyun-tasmalari": "bel-boyun-tasma",
  "bakim-saglik":        "bakim-saglik",
  "makas-taraklar":      "tras-ekipmanlari",
  "sampuan-parfum":      "sampuan-banyo",
  "agiz-dis-bakimi":     "agiz-dis-bakim",
  "sut-tozu-biberon":    "sut-tozu-biberon",
  "bit-pire-parazit":    "bit-pire-parazit",
  "goz-kulak-bakimi":    "goz-kulak-bakim",
  "tiras-ekipmanlari":   "tras-ekipmanlari",
};

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

/* ── Category row ── */
function CategoryRow({ cat, count, onClick }: { cat:Cat; count:number|null; onClick:()=>void }) {
  const c = COLOR_MAP[cat.color];
  const badge = count === null
    ? null
    : count === 0
      ? <span className="yp-mag-badge" style={{ fontSize:11, fontWeight:600, color:"#9A8B7A", background:PL,
                        padding:"3px 8px", borderRadius:999, whiteSpace:"nowrap" }}>Yakında</span>
      : <span className="yp-mag-badge" style={{ fontSize:11, fontWeight:650, color:"#7A6A58", background:PL,
                        padding:"3px 8px", borderRadius:999, whiteSpace:"nowrap" }}>{count} ürün</span>;
  return (
    <div
      className="yp-mag-cat"
      role="button"
      aria-label={`${cat.name} kategorisine git`}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") onClick(); }}
      style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
               padding:"12px", marginBottom:8, borderRadius:16,
               border:`1px solid ${GB}`, background:"#fff",
               cursor:"pointer", transition:"box-shadow 0.15s, transform 0.15s" }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 14px rgba(93,58,26,0.08)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
      <div className="yp-mag-cat-top" style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:40, height:40, borderRadius:12, background:PL,
                      border:`1px solid ${c.border}`, display:"flex", alignItems:"center",
                      justifyContent:"center", flexShrink:0 }}>
          <cat.Icon size={20} color={c.icon} strokeWidth={1.75} />
        </div>
        <span style={{ fontSize:14, fontWeight:650, color:"#2C2118" }}>{cat.name}</span>
      </div>
      <div className="yp-mag-cat-meta" style={{ display:"flex", alignItems:"center", gap:8 }}>
        {badge}
        <ChevronRight className="yp-mag-chevron" size={18} color={c.icon} />
      </div>
    </div>
  );
}

/* ════════════ Main Page ════════════ */
export default function YPMagazaPage() {
  const [, navigate] = useLocation();
  const [searchQ, setSearchQ] = useState("");

  /* ?kategori=mama redirect → mama PLP */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const kat = params.get("kategori");
    if (kat === "mama") navigate(`${BASE}/kuru-mama`, { replace: true });
  }, [navigate]);

  /* Page title */
  useEffect(() => {
    document.title = "Poodle Ürünleri: Mama, Aksesuar ve Oyuncaklar | YourPoodle";
  }, []);

  /* Category counts */
  const { data: categoryCounts = {} } = useQuery<Record<string, number>>({
    queryKey: ["/api/yp-category-counts"],
    staleTime: 5 * 60 * 1000,
  });

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
    <YPLayout activeLink={`${BASE}/magaza`} constrain={false}>
      <style>{`
        .yp-mag-main {
          padding: 16px 16px 24px;
          background: #FAF8F4;
          min-height: 60vh;
        }
        .yp-mag-main h2 { font-family: 'DM Sans', 'Helvetica Neue', Arial, sans-serif; }
        @media (max-width: 767px) {
          .yp-mag-hide-mobile { display: none !important; }
        }
        @media (min-width: 768px) {
          .yp-mag-main { padding: 32px 28px 80px !important; max-width: 1180px; }
          .yp-cat-grid { grid-template-columns: repeat(3, minmax(0,1fr)) !important; gap: 16px !important; }
          .yp-mag-h1 { font-size: 26px !important; }
          .yp-mag-search { border-radius: 14px !important; }
          .yp-mag-cat {
            flex-direction: column !important;
            align-items: flex-start !important;
            justify-content: space-between !important;
            padding: 18px 16px !important;
            margin-bottom: 0 !important;
            min-height: 132px;
            gap: 16px;
          }
          .yp-mag-cat-top { width: 100%; }
          .yp-mag-chevron { display: none; }
        }
        @media (min-width: 1100px) {
          .yp-cat-grid { grid-template-columns: repeat(4, minmax(0,1fr)) !important; gap: 18px !important; }
        }
      `}</style>

      <main className="yp-pw yp-mag-main">

        {/* ── Search bar ── */}
        <header style={{ marginBottom: 16 }}>
          <h1 className="yp-mag-h1" style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#2C2118", letterSpacing: "-0.02em" }}>
            Mağaza
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: 14, color: "#7A6A58", lineHeight: 1.4 }}>
            Kuru mama, aksesuar ve bakım ürünleri
          </p>
        </header>

        <form onSubmit={handleSearch} style={{ marginBottom:20 }}>
          <div className="yp-mag-search" style={{ display:"flex", alignItems:"center", gap:10,
                        border:`1px solid ${GB}`, borderRadius:14,
                        background:"#fff", padding:"4px 4px 4px 14px" }}>
            <Search size={18} color="#B0A69C" strokeWidth={1.75} style={{ flexShrink:0 }} />
            <input
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              type="search"
              placeholder="Marka veya ürün ara"
              style={{ flex:1, border:"none", outline:"none", padding:"10px 4px",
                       fontSize:15, color:"#2C2118", fontFamily:"inherit",
                       background:"transparent" }}
            />
            <button type="submit"
              style={{ background:P, color:"#fff", border:"none", borderRadius:12,
                       padding:"10px 16px", fontSize:13, fontWeight:700,
                       cursor:"pointer", fontFamily:"inherit", flexShrink:0 }}>
              Ara
            </button>
          </div>
        </form>

        {/* ── Campaign banner (desktop only) ── */}
        <button
          className="yp-mag-hide-mobile"
          onClick={() => navigate(`${BASE}/kuru-mama`)}
          aria-label="Kuru mama kampanyasına git"
          style={{ width:"100%", marginBottom:24, borderRadius:16, border:"none", cursor:"pointer",
                   background:`linear-gradient(135deg,${P} 0%,#8B5E34 100%)`,
                   padding:"18px 20px", display:"flex", alignItems:"center", justifyContent:"space-between",
                   boxShadow:"0 4px 16px rgba(93,58,26,0.25)", fontFamily:"inherit" }}>
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

        {/* ── Category divider ── */}
        <div style={{ fontSize:11, fontWeight:700, color:"#9A8B7A", marginBottom:10, letterSpacing:0.3 }}>
          KATEGORİLER
        </div>

        {/* ── Category grid — ALL categories always visible ── */}
        <div className="yp-cat-grid">
          {CATEGORIES.map(cat => {
            const countsLoaded = Object.keys(categoryCounts).length > 0;
            let count: number | null = null;
            if (countsLoaded) {
              if (cat.slug === "kuru-mama") {
                count =
                  (categoryCounts["kuru-mama"] ??
                    ((categoryCounts["kopek-kuru-mama"] || 0) +
                      (categoryCounts["mama-markalari"] || 0)));
              } else {
                const subcat = SLUG_TO_SUBCAT[cat.slug];
                count = subcat ? (categoryCounts[subcat] ?? 0) : null;
              }
            }
            return (
              <CategoryRow key={cat.id} cat={cat} count={count} onClick={() => goCat(cat)} />
            );
          })}
        </div>

      </main>
    </YPLayout>
  );
}
