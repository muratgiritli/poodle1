import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search, X, ChevronDown, Check, SlidersHorizontal, Package } from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { useCart } from "@/contexts/CartContext";
import { IS_YP } from "@/lib/store";

const BASE = IS_YP ? "" : "/yourpoodle";
const P    = "#6A38C2";
const PD   = "#4C1DAA";

/* ── helpers ────────────────────────────────────────── */
function fmtPrice(n: number) {
  return n.toLocaleString("tr-TR") + " TL";
}

function extractKg(name: string): string | null {
  const m = name.match(/(\d+(?:[.,]\d+)?)\s*kg/i);
  return m ? `${m[1].replace(",", ".")} KG` : null;
}

function fmtSkt(skt: string | null | undefined): string | null {
  if (!skt) return null;
  // skt is usually "YYYY-MM-DD" or "MM/YYYY" — normalise to "MM.YYYY"
  const iso = skt.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) return `${iso[2]}.${iso[1]}`;
  return skt;
}

/* ── Slugify ─────────────────────────────────────────── */
function slugify(str: string) {
  return str.toLowerCase()
    .replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s")
    .replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c")
    .replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
}

/* ── Toast ───────────────────────────────────────────── */
function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div style={{
      position:"fixed", bottom:88, left:"50%", transform:"translateX(-50%)",
      zIndex:9999, pointerEvents:"none", opacity:visible?1:0, transition:"opacity 0.3s",
    }}>
      <div style={{
        background:"#1A0052", color:"#fff", padding:"10px 22px", borderRadius:999,
        fontSize:13, fontWeight:500, whiteSpace:"nowrap", boxShadow:"0 4px 16px rgba(0,0,0,0.25)",
      }}>
        {message}
      </div>
    </div>
  );
}

/* ── Filter chip ─────────────────────────────────────── */
function FilterChip({
  icon, label, active, onClick,
}: { icon?: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display:"flex", alignItems:"center", gap:5, flexShrink:0,
        padding:"8px 12px", borderRadius:999,
        border:`1.5px solid ${active ? P : "#D1D5DB"}`,
        background: active ? "#EDE9FE" : "#fff",
        color: active ? P : "#374151",
        fontSize:13, fontWeight:active?700:500,
        cursor:"pointer", fontFamily:"inherit",
        transition:"border-color 0.15s, background 0.15s",
      }}>
      {icon}
      {label}
      <ChevronDown size={14} style={{ marginLeft:1 }} />
    </button>
  );
}

/* ── Bottom Sheet ────────────────────────────────────── */
interface SheetProps {
  title: string;
  options: { value: string; label: string }[];
  selected: Set<string>;
  multi?: boolean;
  onToggle: (v: string) => void;
  onClear: () => void;
  onClose: () => void;
}
function BottomSheet({ title, options, selected, multi=false, onToggle, onClear, onClose }: SheetProps) {
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,0.4)",
          zIndex:1000, backdropFilter:"blur(2px)",
        }}
      />
      <div style={{
        position:"fixed", bottom:0, left:0, right:0, zIndex:1001,
        background:"#fff", borderRadius:"20px 20px 0 0",
        padding:"0 0 env(safe-area-inset-bottom,0)",
        maxHeight:"70vh", display:"flex", flexDirection:"column",
        boxShadow:"0 -4px 32px rgba(0,0,0,0.18)",
      }}>
        {/* Handle */}
        <div style={{ display:"flex", justifyContent:"center", padding:"12px 0 4px" }}>
          <div style={{ width:40, height:4, borderRadius:2, background:"#E5E7EB" }} />
        </div>
        {/* Header */}
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"0 16px 12px", borderBottom:"1px solid #F3F4F6",
        }}>
          <span style={{ fontSize:16, fontWeight:700, color:"#111827" }}>{title}</span>
          <div style={{ display:"flex", gap:8 }}>
            {selected.size > 0 && (
              <button onClick={onClear}
                style={{ background:"none", border:"none", cursor:"pointer",
                         fontSize:13, color:P, fontWeight:600, fontFamily:"inherit" }}>
                Temizle
              </button>
            )}
            <button onClick={onClose}
              style={{ background:"none", border:"none", cursor:"pointer", padding:4 }}>
              <X size={20} color="#6B7280" />
            </button>
          </div>
        </div>
        {/* Options */}
        <div style={{ overflowY:"auto", padding:"8px 16px 24px" }}>
          {options.map(opt => {
            const sel = selected.has(opt.value);
            return (
              <button key={opt.value}
                onClick={() => { onToggle(opt.value); if (!multi) onClose(); }}
                style={{
                  width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between",
                  padding:"13px 0", borderBottom:"1px solid #F9FAFB",
                  background:"none", border:"none",
                  cursor:"pointer", fontFamily:"inherit",
                }}>
                <span style={{ fontSize:14, fontWeight:sel?700:400, color:sel?P:"#111827" }}>
                  {opt.label}
                </span>
                {sel && <Check size={18} color={P} strokeWidth={2.5} />}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* ── Product Card ────────────────────────────────────── */
function ProductCard({ product, onNavigate }: { product: any; onNavigate: (id: number, name: string) => void }) {
  const { updateQty, basket } = useCart();
  const [added, setAdded] = useState(false);
  const sid = String(product.id);
  const inCart = (basket[sid] || 0) > 0;
  const outOfStock = !product.stock || product.stock <= 0;

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const kg  = extractKg(product.name);
  const skt = fmtSkt(product.skt);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (outOfStock) return;
    const ok = updateQty(sid, 1);
    if (ok !== false) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1600);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${product.name} ürününe git`}
      onClick={() => onNavigate(product.id, product.name)}
      onKeyDown={e => { if (e.key==="Enter"||e.key===" ") onNavigate(product.id, product.name); }}
      style={{
        background:"#fff", borderRadius:12, border:"1px solid #E5E7EB",
        overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.05)",
        display:"flex", flexDirection:"column",
        cursor:"pointer", transition:"box-shadow 0.15s",
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow="0 4px 12px rgba(106,56,194,0.12)")}
      onMouseLeave={e => (e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.05)")}
    >
      {/* Top: image + info side by side */}
      <div style={{ display:"flex", minHeight:120 }}>
        {/* Image */}
        <div style={{
          width:"42%", flexShrink:0, background:"#F9FAFB",
          display:"flex", alignItems:"center", justifyContent:"center",
          padding:8, position:"relative",
        }}>
          {product.img ? (
            <img
              src={product.img}
              alt={product.name}
              loading="lazy"
              style={{ width:"100%", height:100, objectFit:"contain" }}
            />
          ) : (
            <Package size={32} color="#D1D5DB" />
          )}
          {inCart && !added && (
            <div style={{
              position:"absolute", top:6, right:6,
              width:18, height:18, borderRadius:"50%",
              background:P, display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              <Check size={10} color="#fff" strokeWidth={3} />
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ flex:1, padding:"10px 10px 6px 8px", display:"flex", flexDirection:"column", justifyContent:"flex-start" }}>
          <p style={{
            fontSize:12, fontWeight:600, color:"#1F2937", lineHeight:1.4,
            margin:"0 0 6px", display:"-webkit-box",
            WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden",
          }}>
            {product.name}
          </p>
          {product.barcode && (
            <p style={{ fontSize:10.5, color:"#6B7280", margin:"0 0 2px" }}>
              Barkod: <span style={{ color:"#374151" }}>{product.barcode}</span>
            </p>
          )}
          {skt && (
            <p style={{ fontSize:10.5, color:"#6B7280", margin:"0 0 2px" }}>
              SKT: <span style={{ color:"#374151" }}>{skt}</span>
            </p>
          )}
          {kg && (
            <p style={{ fontSize:10.5, color:"#374151", fontWeight:600, margin:0 }}>{kg}</p>
          )}
        </div>
      </div>

      {/* Price row */}
      <div style={{ padding:"6px 10px 2px", display:"flex", alignItems:"baseline", gap:6 }}>
        {hasDiscount && (
          <span style={{ fontSize:11, color:"#9CA3AF", textDecoration:"line-through" }}>
            {fmtPrice(product.originalPrice)}
          </span>
        )}
        <span style={{ fontSize:16, fontWeight:800, color:P }}>
          {fmtPrice(product.price)}
        </span>
      </div>

      {/* Sepete Ekle */}
      <div style={{ padding:"6px 10px 10px" }}>
        <button
          aria-label={`${product.name} sepete ekle`}
          onClick={handleAdd}
          disabled={outOfStock}
          style={{
            width:"100%", padding:"9px 0", borderRadius:8, border:"none",
            background: outOfStock ? "#E5E7EB" : (added ? "#16A34A" : P),
            color: outOfStock ? "#9CA3AF" : "#fff",
            fontSize:13, fontWeight:700, cursor: outOfStock ? "not-allowed" : "pointer",
            fontFamily:"inherit", transition:"background 0.2s",
          }}>
          {outOfStock ? "Tükendi" : added ? "✓ Eklendi" : "Sepete Ekle"}
        </button>
      </div>
    </div>
  );
}

/* ── PRICE RANGES ─────────────────────────────────── */
const PRICE_RANGES = [
  { value:"0-500",   label:"0 – 500 TL"    },
  { value:"500-1000",label:"500 – 1.000 TL" },
  { value:"1000-2000",label:"1.000 – 2.000 TL" },
  { value:"2000+",   label:"2.000 TL üzeri" },
];

/* ── MAIN PAGE ───────────────────────────────────────── */
export default function YPKuruMamaPage() {
  const [, navigate] = useLocation();
  const [search,       setSearch]       = useState("");
  const [debouncedQ,   setDebouncedQ]   = useState("");
  const [openSheet,    setOpenSheet]    = useState<"marka"|"yas"|"kg"|"fiyat"|null>(null);
  const [selMarka,     setSelMarka]     = useState<Set<string>>(new Set());
  const [selYas,       setSelYas]       = useState<Set<string>>(new Set());
  const [selKg,        setSelKg]        = useState<Set<string>>(new Set());
  const [selFiyat,     setSelFiyat]     = useState<Set<string>>(new Set());
  const [toast,        setToast]        = useState({ message:"", visible:false });
  const toastTimer = useRef<ReturnType<typeof setTimeout>|null>(null);
  const searchRef  = useRef<HTMLInputElement>(null);

  useEffect(() => { document.title = "Köpek Mamaları | YourPoodle"; }, []);

  /* debounce search */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(search), 280);
    return () => clearTimeout(t);
  }, [search]);

  const showToast = useCallback((msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message:msg, visible:true });
    toastTimer.current = setTimeout(() => setToast(t => ({...t, visible:false})), 2500);
  }, []);

  /* fetch products */
  const { data: rawProducts = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/yp-products"],
    staleTime: 5 * 60 * 1000,
  });

  /* filter to DRY FOOD ONLY with real images.
     - subcategory must be kopek-kuru-mama exclusively (never wet food / bowls)
     - product must have a real image; imageless products are hidden from all PLPs */
  const mamaProducts = useMemo(() =>
    rawProducts.filter((p: any) => {
      const sub = (p.subcategory || "").toLowerCase();
      return sub === "kopek-kuru-mama" && !!p.img;
    }),
  [rawProducts]);

  /* derive filter options from data */
  const markaOptions = useMemo(() => {
    const brands = Array.from(new Set(mamaProducts.map((p:any) => p.brandName).filter(Boolean))) as string[];
    return brands.map(b => ({ value:b, label:b }));
  }, [mamaProducts]);

  const yasOptions = [
    { value:"yavru",    label:"Yavru (0-12 ay)"  },
    { value:"yetiskin", label:"Yetişkin (+1 yaş)" },
    { value:"yasli",    label:"Yaşlı (+7 yaş)"    },
  ];

  const kgOptions = useMemo(() => {
    const sizes = new Set<string>();
    mamaProducts.forEach((p:any) => {
      const kg = extractKg(p.name);
      if (kg) sizes.add(kg);
    });
    return Array.from(sizes).sort((a,b) => parseFloat(a)-parseFloat(b)).map(k => ({ value:k, label:k }));
  }, [mamaProducts]);

  /* apply filters */
  const filtered = useMemo(() => {
    let result = mamaProducts;

    if (debouncedQ) {
      const q = debouncedQ.toLowerCase();
      result = result.filter((p:any) =>
        (p.name||"").toLowerCase().includes(q) ||
        (p.brandName||"").toLowerCase().includes(q)
      );
    }
    if (selMarka.size) result = result.filter((p:any) => selMarka.has(p.brandName));
    if (selYas.size)   result = result.filter((p:any) => selYas.has(p.mamaType));
    if (selKg.size)    result = result.filter((p:any) => { const kg=extractKg(p.name); return kg && selKg.has(kg); });
    if (selFiyat.size) {
      result = result.filter((p:any) => {
        return Array.from(selFiyat).some(range => {
          if (range==="0-500")    return p.price < 500;
          if (range==="500-1000") return p.price>=500 && p.price<1000;
          if (range==="1000-2000") return p.price>=1000 && p.price<2000;
          if (range==="2000+")    return p.price>=2000;
          return false;
        });
      });
    }
    return result;
  }, [mamaProducts, debouncedQ, selMarka, selYas, selKg, selFiyat]);

  const goProduct = useCallback((id: number, name: string) => {
    navigate(`${BASE}/urun/${id}/${slugify(name)}`);
  }, [navigate]);

  const toggle = (set: Set<string>, val: string, setter: (s: Set<string>) => void) => {
    const n = new Set(set);
    n.has(val) ? n.delete(val) : n.add(val);
    setter(n);
  };

  const anyFilter = selMarka.size+selYas.size+selKg.size+selFiyat.size > 0;

  const activeFiltersCount = selMarka.size + selYas.size + selKg.size + selFiyat.size;

  return (
    <YPLayout activeLink={`${BASE}/magaza`} constrain={false} hideFooter>
      <style>{`
        .ykm-scroll::-webkit-scrollbar { display:none; }
        @keyframes ykm-shimmer {
          0%,100%{opacity:1} 50%{opacity:0.5}
        }
        .ykm-skel { animation: ykm-shimmer 1.4s infinite; }
      `}</style>
      <Toast message={toast.message} visible={toast.visible} />

      {/* Bottom sheets */}
      {openSheet === "marka" && (
        <BottomSheet
          title="Marka Seç" options={markaOptions} selected={selMarka} multi
          onToggle={v => toggle(selMarka,v,setSelMarka)}
          onClear={() => setSelMarka(new Set())}
          onClose={() => setOpenSheet(null)}
        />
      )}
      {openSheet === "yas" && (
        <BottomSheet
          title="Yaş Seç" options={yasOptions} selected={selYas}
          onToggle={v => toggle(selYas,v,setSelYas)}
          onClear={() => setSelYas(new Set())}
          onClose={() => setOpenSheet(null)}
        />
      )}
      {openSheet === "kg" && (
        <BottomSheet
          title="Kg Seç" options={kgOptions} selected={selKg} multi
          onToggle={v => toggle(selKg,v,setSelKg)}
          onClear={() => setSelKg(new Set())}
          onClose={() => setOpenSheet(null)}
        />
      )}
      {openSheet === "fiyat" && (
        <BottomSheet
          title="Fiyat Aralığı" options={PRICE_RANGES} selected={selFiyat}
          onToggle={v => toggle(selFiyat,v,setSelFiyat)}
          onClear={() => setSelFiyat(new Set())}
          onClose={() => setOpenSheet(null)}
        />
      )}

      <div style={{ padding:"16px 16px 100px" }}>

        {/* Title */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
          <h1 style={{ fontSize:22, fontWeight:800, color:"#111827", margin:0 }}>Köpek Mamaları</h1>
          {anyFilter && (
            <button
              onClick={() => { setSelMarka(new Set()); setSelYas(new Set()); setSelKg(new Set()); setSelFiyat(new Set()); }}
              style={{ background:"none", border:"none", cursor:"pointer",
                       fontSize:12, color:"#EF4444", fontWeight:600, fontFamily:"inherit",
                       display:"flex", alignItems:"center", gap:3 }}>
              <X size={13} />
              Temizle ({activeFiltersCount})
            </button>
          )}
        </div>

        {/* Search */}
        <div style={{
          display:"flex", alignItems:"center", gap:10,
          background:"#F9FAFB", border:"1.5px solid #E5E7EB",
          borderRadius:12, padding:"10px 14px", marginBottom:14,
        }}>
          <Search size={18} color="#9CA3AF" />
          <input
            ref={searchRef}
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Mama ara..."
            style={{
              flex:1, background:"transparent", border:"none", outline:"none",
              fontSize:14, color:"#111827", fontFamily:"inherit",
            }}
          />
          {search && (
            <button onClick={() => { setSearch(""); searchRef.current?.focus(); }}
              style={{ background:"none", border:"none", cursor:"pointer", padding:0, display:"flex" }}>
              <X size={16} color="#9CA3AF" />
            </button>
          )}
        </div>

        {/* Filter chips */}
        <div className="ykm-scroll" style={{
          display:"flex", gap:8, overflowX:"auto",
          marginBottom:16, scrollbarWidth:"none",
          paddingBottom:2,
        }}>
          <FilterChip
            label="Marka"
            active={selMarka.size>0}
            onClick={() => setOpenSheet("marka")}
          />
          <FilterChip
            label="Yaş"
            active={selYas.size>0}
            onClick={() => setOpenSheet("yas")}
          />
          <FilterChip
            label="Kg"
            active={selKg.size>0}
            onClick={() => setOpenSheet("kg")}
          />
          <FilterChip
            label="Fiyat"
            active={selFiyat.size>0}
            onClick={() => setOpenSheet("fiyat")}
          />
        </div>

        {/* Product count */}
        {!isLoading && (
          <p style={{ fontSize:13, color:"#6B7280", marginBottom:12 }}>
            {filtered.length} ürün bulundu
          </p>
        )}

        {/* Grid */}
        {isLoading ? (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {Array.from({length:6}).map((_,i) => (
              <div key={i} className="ykm-skel" style={{
                borderRadius:12, background:"#F3F4F6", height:220,
              }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"48px 0", color:"#6B7280" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
            <p style={{ fontSize:15, fontWeight:600, color:"#374151", marginBottom:4 }}>
              Sonuç bulunamadı
            </p>
            <p style={{ fontSize:13 }}>
              Farklı bir arama yapmayı ya da filtreleri temizlemeyi deneyin.
            </p>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {filtered.map((product: any) => (
              <ProductCard
                key={product.id}
                product={product}
                onNavigate={goProduct}
              />
            ))}
          </div>
        )}
      </div>
    </YPLayout>
  );
}
