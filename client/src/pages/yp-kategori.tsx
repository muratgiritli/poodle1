import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search, X, Package, Check, Plus, ShoppingCart } from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { useCart } from "@/contexts/CartContext";
import { IS_YP } from "@/lib/store";

const BASE = IS_YP ? "" : "/yourpoodle";
const P    = "#6200EE";
const PD   = "#4C1DAA";

/* ── Route slug → DB subcategory mapping ─────────────────────────── */
const SLUG_TO_SUBCAT: Record<string, string> = {
  "tuvalet":           "tuvalet-malzemeleri",
  "yas-mama":          "yas-mama",
  "odul-cesitleri":    "odul-kemik",
  "tasima-cantalari":  "tasima-kulube",
  "kulubeler":         "tasima-kulube",
  "oyuncaklar":        "oyuncak",
  "mama-su-kaplari":   "mama-su-kabi",
  "bel-boyun-tasmalari": "bel-boyun-tasma",
  "bakim-saglik":      "bakim-saglik",
  "makas-taraklar":    "tras-ekipmanlari",
  "sampuan-parfum":    "sampuan-banyo",
  "agiz-dis-bakimi":   "agiz-dis-bakim",
  "sut-tozu-biberon":  "sut-tozu-biberon",
  "bit-pire-parazit":  "bit-pire-parazit",
  "goz-kulak-bakimi":  "goz-kulak-bakim",
  "tiras-ekipmanlari": "tras-ekipmanlari",
};

/* ── Page title / H1 mapping ──────────────────────────────────────── */
const SLUG_TO_TITLE: Record<string, string> = {
  "tuvalet":           "Köpek Tuvalet Malzemeleri",
  "yas-mama":          "Köpek Yaş Mamaları",
  "odul-cesitleri":    "Ödül ve Atıştırmalıklar",
  "tasima-cantalari":  "Köpek Taşıma Çantaları",
  "kulubeler":         "Kulübeler ve Taşıma Araçları",
  "oyuncaklar":        "Köpek Oyuncakları",
  "mama-su-kaplari":   "Mama ve Su Kapları",
  "bel-boyun-tasmalari": "Bel ve Boyun Tasmaları",
  "bakim-saglik":      "Bakım ve Sağlık",
  "makas-taraklar":    "Makas ve Taraklar",
  "sampuan-parfum":    "Şampuan ve Parfüm",
  "agiz-dis-bakimi":   "Ağız ve Diş Bakımı",
  "sut-tozu-biberon":  "Süt Tozu ve Biberon",
  "bit-pire-parazit":  "Bit, Pire ve Parazit",
  "goz-kulak-bakimi":  "Göz ve Kulak Bakımı",
  "tiras-ekipmanlari": "Tıraş Ekipmanları",
};

/* ── helpers ─────────────────────────────────────────────────────── */
function fmtPrice(n: number) {
  return n.toLocaleString("tr-TR") + " TL";
}

function slugify(str: string) {
  return str.toLowerCase()
    .replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s")
    .replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c")
    .replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
}

/* ── Toast ───────────────────────────────────────────────────────── */
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

/* ── Product Card ─────────────────────────────────────────────────── */
function ProductCard({
  product,
  onNavigate,
  onAddToCart,
}: {
  product: any;
  onNavigate: (id: number, name: string) => void;
  onAddToCart: (product: any) => void;
}) {
  const { basket } = useCart();
  const sid = String(product.id);
  const inCart = (basket[sid] || 0) > 0;
  const [added, setAdded] = useState(false);

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPct = hasDiscount
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;
  const outOfStock = !product.stock || product.stock <= 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (outOfStock) return;
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${product.name} ürününe git`}
      onClick={() => onNavigate(product.id, product.name)}
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") onNavigate(product.id, product.name); }}
      style={{
        background:"#fff", border:"1px solid #E5E7EB", borderRadius:12,
        overflow:"hidden", display:"flex", flexDirection:"column",
        boxShadow:"0 1px 4px rgba(0,0,0,0.06)", cursor:"pointer",
        transition:"box-shadow 0.15s, transform 0.15s",
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow="0 4px 12px rgba(98,0,238,0.10)"; e.currentTarget.style.transform="translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.06)"; e.currentTarget.style.transform="translateY(0)"; }}
    >
      {/* Image */}
      <div style={{ position:"relative", width:"100%", paddingTop:"100%", background:"#F9FAFB", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
          {product.img ? (
            <img
              src={product.img}
              alt={product.name}
              loading="lazy"
              onError={e => { (e.target as HTMLImageElement).style.display="none"; }}
              style={{ width:"100%", height:"100%", objectFit:"contain", padding:8 }}
            />
          ) : (
            <Package size={40} color="#D1D5DB" />
          )}
        </div>
        {hasDiscount && (
          <div style={{
            position:"absolute", top:6, left:6, background:"#EF4444",
            color:"#fff", fontSize:10, fontWeight:800, padding:"2px 7px", borderRadius:6,
          }}>
            %{discountPct} İndirim
          </div>
        )}
        {inCart && !added && (
          <div style={{
            position:"absolute", top:6, right:6, width:20, height:20,
            background:P, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <Check size={12} color="#fff" strokeWidth={3} />
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding:"10px 10px 12px", flex:1, display:"flex", flexDirection:"column" }}>
        <p style={{
          fontSize:12, fontWeight:500, color:"#374151", lineHeight:1.4,
          margin:"0 0 4px", flex:1,
          overflow:"hidden", display:"-webkit-box",
          WebkitLineClamp:2, WebkitBoxOrient:"vertical",
        }}>
          {product.name}
        </p>

        {(product.barcode || product.skt) && (
          <div style={{ margin:"0 0 6px" }}>
            {product.barcode && (
              <p style={{ fontSize:10, color:"#9CA3AF", margin:0, lineHeight:1.5 }}>
                Barkod: {product.barcode}
              </p>
            )}
            {product.skt && (
              <p style={{ fontSize:10, color:"#9CA3AF", margin:0, lineHeight:1.5 }}>
                SKT: {product.skt}
              </p>
            )}
          </div>
        )}

        <div style={{ marginBottom:8 }}>
          {hasDiscount && (
            <span style={{ fontSize:11, color:"#9CA3AF", textDecoration:"line-through", display:"block" }}>
              {fmtPrice(product.originalPrice)}
            </span>
          )}
          <span style={{ fontSize:17, fontWeight:800, color:P }}>
            {fmtPrice(product.price)}
          </span>
        </div>

        <button
          aria-label={`${product.name} sepete ekle`}
          onClick={handleAdd}
          disabled={outOfStock}
          style={{
            width:"100%", padding:"9px 0", borderRadius:10, border:"none",
            background: outOfStock ? "#E5E7EB" : added ? "#16A34A" : P,
            color: outOfStock ? "#9CA3AF" : "#fff",
            fontSize:13, fontWeight:700, cursor: outOfStock ? "not-allowed" : "pointer",
            fontFamily:"inherit", display:"flex", alignItems:"center",
            justifyContent:"center", gap:5, transition:"background 0.2s",
          }}
        >
          {outOfStock
            ? "Tükendi"
            : added
              ? <><Check size={14} /> Eklendi</>
              : <><ShoppingCart size={14} /> Sepete Ekle</>
          }
        </button>
      </div>
    </div>
  );
}

/* ── Skeleton card ────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div style={{
      borderRadius:12, border:"1px solid #E5E7EB", background:"#fff", overflow:"hidden",
    }}>
      <div style={{ paddingTop:"100%", background:"#F3F4F6", animation:"ypk-shimmer 1.4s infinite" }} />
      <div style={{ padding:"10px 10px 12px" }}>
        <div style={{ height:12, background:"#F3F4F6", borderRadius:6, marginBottom:6, animation:"ypk-shimmer 1.4s infinite" }} />
        <div style={{ height:12, background:"#F3F4F6", borderRadius:6, width:"60%", marginBottom:10, animation:"ypk-shimmer 1.4s infinite" }} />
        <div style={{ height:36, background:"#F3F4F6", borderRadius:10, animation:"ypk-shimmer 1.4s infinite" }} />
      </div>
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────────────────── */
interface YPKategoriPageProps { routeSlug?: string; }

export default function YPKategoriPage({ routeSlug }: YPKategoriPageProps) {
  const [, navigate] = useLocation();
  const { updateQty } = useCart();
  const [search, setSearch] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [toast, setToast] = useState({ message:"", visible:false });
  const toastTimer = useRef<ReturnType<typeof setTimeout>|null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const slug  = routeSlug || "tuvalet";
  const subcat = SLUG_TO_SUBCAT[slug] || slug;
  const title  = SLUG_TO_TITLE[slug] || "Kategori";

  useEffect(() => { document.title = `${title} | YourPoodle`; }, [title]);

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

  /* fetch products filtered by subcategory */
  const { data: rawProducts = [], isLoading, isError } = useQuery<any[]>({
    queryKey: [`/api/yp-products`, subcat],
    queryFn: async () => {
      const res = await fetch(`/api/yp-products?subcategory=${encodeURIComponent(subcat)}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  /* client-side search filter */
  const filtered = useMemo(() => {
    if (!debouncedQ) return rawProducts;
    const q = debouncedQ.toLowerCase();
    return rawProducts.filter((p: any) =>
      (p.name || "").toLowerCase().includes(q) ||
      (p.brandName || "").toLowerCase().includes(q) ||
      (p.barcode || "").includes(q)
    );
  }, [rawProducts, debouncedQ]);

  const goProduct = useCallback((id: number, name: string) => {
    navigate(`${BASE}/urun/${id}/${slugify(name)}`);
  }, [navigate]);

  const handleAddToCart = useCallback((product: any) => {
    const sid = String(product.id);
    const blocked = updateQty(sid, 1);
    if (blocked === true) {
      showToast("Stok kalmadı!");
    } else {
      showToast("✓ Sepete eklendi");
    }
  }, [updateQty, showToast]);

  return (
    <YPLayout activeLink={`${BASE}/magaza`} constrain={false} hideFooter>
      <style>{`
        @keyframes ypk-shimmer {
          0%,100%{opacity:1} 50%{opacity:0.5}
        }
      `}</style>
      <Toast message={toast.message} visible={toast.visible} />

      <div style={{ padding:"16px 16px 100px" }}>

        {/* Back + H1 */}
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
          <button
            onClick={() => navigate(`${BASE}/magaza`)}
            style={{ background:"none", border:"none", cursor:"pointer", padding:"4px 0",
                     color:P, fontSize:13, fontWeight:500, fontFamily:"inherit" }}>
            ← Mağaza
          </button>
        </div>
        <h1 style={{ fontSize:22, fontWeight:800, color:"#111827", margin:"0 0 14px" }}>
          {title}
        </h1>

        {/* Search */}
        <div style={{
          display:"flex", alignItems:"center", gap:10,
          background:"#F9FAFB", border:"1.5px solid #E5E7EB",
          borderRadius:12, padding:"10px 14px", marginBottom:14,
        }}>
          <Search size={18} color="#9CA3AF" />
          <input
            ref={searchRef}
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={`${title.replace("Köpek ", "")} ara...`}
            style={{
              flex:1, background:"transparent", border:"none", outline:"none",
              fontSize:14, color:"#111827", fontFamily:"inherit",
            }}
          />
          {search && (
            <button
              onClick={() => { setSearch(""); searchRef.current?.focus(); }}
              style={{ background:"none", border:"none", cursor:"pointer", padding:0, display:"flex" }}>
              <X size={16} color="#9CA3AF" />
            </button>
          )}
        </div>

        {/* Product count */}
        {!isLoading && !isError && (
          <p style={{ fontSize:13, color:"#6B7280", marginBottom:12 }}>
            {filtered.length} ürün bulundu
          </p>
        )}

        {/* Grid */}
        {isLoading ? (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {Array.from({length:6}).map((_,i) => <SkeletonCard key={i} />)}
          </div>
        ) : isError ? (
          <div style={{ textAlign:"center", padding:"48px 0", color:"#6B7280" }}>
            <p style={{ fontSize:15, fontWeight:600, color:"#374151", marginBottom:8 }}>
              Ürünler yüklenemedi
            </p>
            <button
              onClick={() => navigate(`${BASE}/magaza`)}
              style={{ background:P, color:"#fff", border:"none", borderRadius:10,
                       padding:"10px 24px", fontSize:14, fontWeight:600,
                       cursor:"pointer", fontFamily:"inherit" }}>
              Mağazaya Dön
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"48px 0", color:"#6B7280" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
            <p style={{ fontSize:15, fontWeight:600, color:"#374151", marginBottom:4 }}>
              {search ? "Sonuç bulunamadı" : "Bu kategoride henüz ürün bulunmuyor"}
            </p>
            <p style={{ fontSize:13, marginBottom:16 }}>
              {search
                ? "Farklı bir arama deneyin."
                : "Yakında yeni ürünler eklenecek."}
            </p>
            <button
              onClick={() => navigate(`${BASE}/magaza`)}
              style={{ background:P, color:"#fff", border:"none", borderRadius:10,
                       padding:"10px 24px", fontSize:14, fontWeight:600,
                       cursor:"pointer", fontFamily:"inherit" }}>
              Mağazaya Dön
            </button>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {filtered.map((product: any) => (
              <ProductCard
                key={product.id}
                product={product}
                onNavigate={goProduct}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </YPLayout>
  );
}
