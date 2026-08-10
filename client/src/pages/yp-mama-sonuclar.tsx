import { useState } from "react";
import { useLocation } from "wouter";
import YPLayout from "@/components/yourpoodle/YPLayout";
import {
  ChevronLeft, X, SlidersHorizontal, ArrowUpDown,
  CreditCard, Heart, ShoppingCart,
} from "lucide-react";

/* ─── Colors ─────────────────────────── */
const P  = "#5D3A1A";
const PD = "#3D2612";
const GB = "#E5E7EB";

/* ─── Types ──────────────────────────── */
interface Product {
  id: string;
  brand: string;
  name: string;
  kg: number | string;
  barkod: string;
  skt: string;
  originalPrice: number;
  price: number;
  discount: number;
  brandColor: string;
  brandBg: string;
}

/* ─── Mock Data ───────────────────────── */
const PRODUCTS: Product[] = [
  { id:"rc1", brand:"Royal Canin", name:"Mini Adult Yetişkin",         kg:"2",   barkod:"3182550793124", skt:"12.08.2027", originalPrice:1249, price:1049, discount:15, brandColor:"#C8102E", brandBg:"#FFF0F0" },
  { id:"rc2", brand:"Royal Canin", name:"Mini Digestive Care",          kg:"3",   barkod:"3182550894012", skt:"25.09.2027", originalPrice:1499, price:1449, discount:15, brandColor:"#C8102E", brandBg:"#FFF0F0" },
  { id:"pp1", brand:"Pro Plan",    name:"Small Adult Sensitive Somonlu",kg:"3",   barkod:"7613035123456", skt:"18.07.2027", originalPrice:1599, price:1349, discount:15, brandColor:"#003087", brandBg:"#EFF3FF" },
  { id:"pp2", brand:"Pro Plan",    name:"Small & Mini Adult Light",      kg:"3",   barkod:"7613035987654", skt:"03.10.2027", originalPrice:1549, price:1299, discount:15, brandColor:"#003087", brandBg:"#EFF3FF" },
  { id:"hi1", brand:"Hill's",      name:"Small Paws Adult Sensitive",   kg:"2",   barkod:"052742034567", skt:"16.06.2027", originalPrice:1199, price: 999, discount:15, brandColor:"#0066CC", brandBg:"#EEF6FF" },
  { id:"hi2", brand:"Hill's",      name:"Perfect Weight Small Breed",   kg:"2.5", barkod:"052742098765", skt:"22.11.2027", originalPrice:1749, price:1499, discount:15, brandColor:"#0066CC", brandBg:"#EEF6FF" },
  { id:"nd1", brand:"N&D",         name:"Ocean Somonlu Mini",           kg:"2.5", barkod:"8010276034567", skt:"19.09.2027", originalPrice:1899, price:1599, discount:15, brandColor:"#5C4033", brandBg:"#FBF5F0" },
  { id:"nd2", brand:"N&D",         name:"Pumpkin Adult Mini",           kg:"2.5", barkod:"8010276098765", skt:"28.08.2027", originalPrice:1849, price:1549, discount:15, brandColor:"#5C4033", brandBg:"#FBF5F0" },
  { id:"bc1", brand:"Brit Care",   name:"Mini Grain Free Sensitive",    kg:"2",   barkod:"8595602543210", skt:"14.07.2027", originalPrice:1099, price: 899, discount:15, brandColor:"#E8173D", brandBg:"#FFF0F2" },
  { id:"bc2", brand:"Brit Care",   name:"Mini Light & Sterilised",      kg:"2",   barkod:"8595602598760", skt:"07.12.2027", originalPrice:1149, price: 949, discount:15, brandColor:"#E8173D", brandBg:"#FFF0F2" },
  { id:"rp1", brand:"Reflex Plus", name:"Somonlu Mini Adult",           kg:"3",   barkod:"8698950034561", skt:"30.11.2027", originalPrice: 999, price: 799, discount:15, brandColor:"#FF6B00", brandBg:"#FFF4EE" },
  { id:"rp2", brand:"Reflex Plus", name:"Kuzu Etli Mini Adult",         kg:"3",   barkod:"8698950098763", skt:"19.11.2027", originalPrice: 946, price: 749, discount:15, brandColor:"#FF6B00", brandBg:"#FFF4EE" },
];

const BRANDS = ["Royal Canin", "Pro Plan", "Hill's", "N&D", "Brit Care", "Reflex Plus"];
const ACTIVE_FILTERS = ["Yetişkin", "Sensitive", "Somonlu", "Indoor", "Weight Loss"];

/* ─── Product Card ────────────────────── */
function ProductCard({ p }: { p: Product }) {
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);
  const [, navigate] = useLocation();

  const slug = p.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const addToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div onClick={() => navigate(`/yourpoodle/mama-urun/${slug}`)}
      style={{ background:"#fff", borderRadius:12, border:`1px solid ${GB}`,
               overflow:"hidden", display:"flex", flexDirection:"column",
               boxShadow:"0 1px 4px rgba(0,0,0,0.06)", cursor:"pointer" }}>
      <div style={{ position:"relative", background:p.brandBg,
                    height:110, display:"flex", alignItems:"center",
                    justifyContent:"center", flexShrink:0 }}>
        <div style={{ position:"absolute", top:6, left:6,
                      background:"#16A34A", color:"#fff",
                      fontSize:10, fontWeight:800, padding:"3px 8px",
                      borderRadius:999 }}>
          %{p.discount} İndirim
        </div>
        <button onClick={e => { e.stopPropagation(); setLiked(l => !l); }}
          style={{ position:"absolute", top:6, right:6,
                   width:28, height:28, borderRadius:"50%",
                   background:"rgba(255,255,255,0.9)", border:"none",
                   display:"flex", alignItems:"center", justifyContent:"center",
                   cursor:"pointer", boxShadow:"0 1px 4px rgba(0,0,0,0.15)" }}>
          <Heart size={14} fill={liked ? "#EF4444" : "none"}
            color={liked ? "#EF4444" : "#9CA3AF"} />
        </button>
        <div style={{ fontSize:40, userSelect:"none" }}>🐕</div>
      </div>
      <div style={{ padding:"10px 10px 12px", display:"flex",
                    flexDirection:"column", flex:1 }}>
        <div style={{ fontSize:10, fontWeight:800, color:p.brandColor,
                      marginBottom:4, textTransform:"uppercase",
                      letterSpacing:"0.5px" }}>
          {p.brand}
        </div>
        <p style={{ fontSize:12, fontWeight:600, color:"#111827",
                    lineHeight:1.4, marginBottom:6, flex:1,
                    display:"-webkit-box", WebkitLineClamp:2,
                    WebkitBoxOrient:"vertical", overflow:"hidden" }}>
          {p.name}
        </p>
        <div style={{ fontSize:10, color:"#9CA3AF", marginBottom:8 }}>
          {p.kg} kg · SKT: {p.skt}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
          <span style={{ fontSize:15, fontWeight:800, color:P }}>
            {p.price.toLocaleString("tr-TR")} TL
          </span>
          <span style={{ fontSize:11, color:"#9CA3AF",
                         textDecoration:"line-through" }}>
            {p.originalPrice.toLocaleString("tr-TR")} TL
          </span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:4,
                      marginBottom:8, background:"#F5F0E6",
                      borderRadius:8, padding:"5px 8px" }}>
          <CreditCard size={11} color={P} />
          <span style={{ fontSize:10, fontWeight:600, color:P }}>
            3 × {Math.round(p.price / 3).toLocaleString("tr-TR")} TL
          </span>
        </div>
        <button onClick={addToCart}
          style={{ marginTop:6, width:"100%", background: added ? "#16A34A" : P,
                   color:"#fff", border:"none", borderRadius:8,
                   padding:"9px 0", fontSize:12, fontWeight:600,
                   cursor:"pointer", fontFamily:"inherit",
                   transition:"background 0.2s", display:"flex",
                   alignItems:"center", justifyContent:"center", gap:5 }}>
          {added ? "✓ Eklendi" : "Sepete Ekle"}
        </button>
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ───────────────────────── */
export default function YPMamaSonuclarPage() {
  const [, navigate] = useLocation();
  const [filters, setFilters] = useState<string[]>(ACTIVE_FILTERS);
  const [visibleBrands, setVisibleBrands] = useState(BRANDS.length);

  const removeFilter = (f: string) =>
    setFilters(prev => prev.filter(x => x !== f));

  return (
    <YPLayout activeLink="/yourpoodle/magaza" constrain={false}>
      <style>{`
        .ms-chip { transition: opacity 0.1s; }
        .ms-chip:hover { opacity: 0.85; }
        .ms-card-btn:hover { opacity: 0.9; }
        .ms-btn-outline:hover { background: #F5F0E6 !important; }
      `}</style>

      {/* ══ SCROLLABLE CONTENT ════════════════════════════ */}
      <div style={{ flex:1, overflowY:"auto", paddingBottom:24 }}>

        {/* ── Breadcrumb + Title ────────────────────────── */}
        <div style={{ background:"#fff", padding:"12px 16px 14px",
                      borderBottom:`1px solid ${GB}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:4, marginBottom:10 }}>
            <button onClick={() => navigate("/yourpoodle/kuru-mama")}
              style={{ display:"flex", alignItems:"center", gap:2,
                       background:"none", border:"none", cursor:"pointer",
                       color:"#6B7280", fontSize:12, fontFamily:"inherit", padding:0 }}>
              <ChevronLeft size={14} />
              <span>Mağaza</span>
            </button>
            <span style={{ color:"#9CA3AF", fontSize:12 }}>/</span>
            <button onClick={() => navigate("/yourpoodle/kuru-mama")}
              style={{ background:"none", border:"none", cursor:"pointer",
                       color:"#6B7280", fontSize:12, fontFamily:"inherit", padding:0 }}>
              Kuru Mama
            </button>
            <span style={{ color:"#9CA3AF", fontSize:12 }}>/</span>
            <span style={{ color:"#111827", fontSize:12, fontWeight:500 }}>Sonuçlar</span>
          </div>

          <h1 style={{ fontSize:20, fontWeight:800, color:"#111827", marginBottom:3 }}>
            Size Uygun Mamalar
          </h1>
          <p style={{ fontSize:13, color:"#6B7280" }}>24 mama bulundu</p>

          {filters.length > 0 && (
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:12 }}>
              {filters.map(f => (
                <button key={f}
                  className="ms-chip"
                  onClick={() => removeFilter(f)}
                  style={{ display:"flex", alignItems:"center", gap:5,
                           background:"#FDF2F8", border:"1.5px solid #FBCFE8",
                           borderRadius:999, padding:"5px 10px",
                           fontSize:12, fontWeight:500, color:"#DB2777",
                           cursor:"pointer", fontFamily:"inherit" }}>
                  {f}
                  <X size={12} color="#DB2777" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Filter + Sort bar ─────────────────────────── */}
        <div style={{ background:"#fff", padding:"10px 16px",
                      borderBottom:`1px solid ${GB}`,
                      display:"flex", gap:10 }}>
          <button className="ms-btn-outline"
            style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center",
                     gap:7, background:"#fff", border:`1.5px solid ${GB}`,
                     borderRadius:10, padding:"10px 0", fontSize:13, fontWeight:500,
                     color:"#374151", cursor:"pointer", fontFamily:"inherit" }}>
            <SlidersHorizontal size={15} />
            Filtrele
          </button>
          <button className="ms-btn-outline"
            style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center",
                     gap:7, background:"#fff", border:`1.5px solid ${GB}`,
                     borderRadius:10, padding:"10px 0", fontSize:13, fontWeight:500,
                     color:"#374151", cursor:"pointer", fontFamily:"inherit" }}>
            <ArrowUpDown size={15} />
            Sırala
          </button>
        </div>

        {/* ── Installment banner ────────────────────────── */}
        <div style={{ background:P, margin:"12px 16px", borderRadius:12,
                      padding:"10px 16px", display:"flex", alignItems:"center", gap:10 }}>
          <CreditCard size={18} color="#fff" style={{ flexShrink:0 }} />
          <span style={{ fontSize:13, fontWeight:600, color:"#fff" }}>
            Peşin fiyatına 3 taksit
          </span>
        </div>

        {/* ── Brand sections ────────────────────────────── */}
        {BRANDS.slice(0, visibleBrands).map(brand => {
          const brandProducts = PRODUCTS.filter(p => p.brand === brand);
          return (
            <div key={brand} style={{ marginBottom:8 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                            padding:"14px 16px 10px", background:"#fff" }}>
                <span style={{ fontSize:15, fontWeight:700, color:"#111827" }}>{brand}</span>
                <button style={{ background:"none", border:"none", cursor:"pointer",
                                 fontSize:13, fontWeight:500, color:P, fontFamily:"inherit" }}>
                  Tümünü Gör
                </button>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr",
                            gap:10, padding:"0 16px 14px",
                            background:"#fff" }}>
                {brandProducts.map(p => (
                  <ProductCard key={p.id} p={p} />
                ))}
              </div>
            </div>
          );
        })}

        {/* ── Load more ─────────────────────────────────── */}
        <div style={{ padding:"4px 16px 8px" }}>
          <button onClick={() => setVisibleBrands(b => b + 3)}
            style={{ width:"100%", background:"#fff", border:`1.5px solid ${P}`,
                     borderRadius:12, padding:"14px 0", fontSize:14, fontWeight:600,
                     color:P, cursor:"pointer", fontFamily:"inherit",
                     transition:"background 0.15s" }}
            className="ms-btn-outline">
            Daha Fazla Mama Göster
          </button>
        </div>

      </div>
    </YPLayout>
  );
}
