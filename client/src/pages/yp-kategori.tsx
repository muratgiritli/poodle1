import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search, X, Package, Check, ChevronLeft, ChevronDown } from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { useCart } from "@/contexts/CartContext";
import { IS_YP } from "@/lib/store";
import { goBack } from "@/lib/goBack";

const BASE = IS_YP ? "" : "/yourpoodle";
const P  = "#5D3A1A";
const PL = "#F5F0E6";
const GB = "#E8E0D4";

type SortKey = "popular" | "price-asc" | "price-desc" | "discount";

const SORT_OPTS: { value: SortKey; label: string }[] = [
  { value: "popular", label: "Popüler" },
  { value: "price-asc", label: "Fiyat ↑" },
  { value: "price-desc", label: "Fiyat ↓" },
  { value: "discount", label: "İndirim" },
];

/* ── Route slug → DB subcategory mapping ─────────────────────────── */
const SLUG_TO_SUBCAT: Record<string, string> = {
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

/* ── Page title / H1 mapping ──────────────────────────────────────── */
const SLUG_TO_TITLE: Record<string, string> = {
  "tuvalet":             "Köpek Tuvalet Malzemeleri",
  "yas-mama":            "Köpek Yaş Mamaları",
  "odul-cesitleri":      "Ödül ve Atıştırmalıklar",
  "tasima-cantalari":    "Köpek Taşıma Çantaları",
  "kulubeler":           "Köpek Kulübeleri",
  "oyuncaklar":          "Köpek Oyuncakları",
  "mama-su-kaplari":     "Mama ve Su Kapları",
  "bel-boyun-tasmalari": "Bel ve Boyun Tasmaları",
  "bakim-saglik":        "Bakım ve Sağlık",
  "makas-taraklar":      "Makas ve Taraklar",
  "sampuan-parfum":      "Şampuan ve Parfüm",
  "agiz-dis-bakimi":     "Ağız ve Diş Bakımı",
  "sut-tozu-biberon":    "Süt Tozu ve Biberon",
  "bit-pire-parazit":    "Bit, Pire ve Parazit",
  "goz-kulak-bakimi":    "Göz ve Kulak Bakımı",
  "tiras-ekipmanlari":   "Tıraş Ekipmanları",
};

const SLUG_TO_SUBTITLE: Record<string, string> = {
  "tuvalet":             "Kum, ped ve hijyen ürünleri",
  "yas-mama":            "Yaş mama ve konserve seçenekleri",
  "odul-cesitleri":      "Ödül, kemik ve atıştırmalıklar",
  "tasima-cantalari":    "Taşıma çantası ve seyahat ürünleri",
  "kulubeler":           "Kulübe ve dinlenme alanları",
  "oyuncaklar":          "Oyun ve diş kaşıma oyuncakları",
  "mama-su-kaplari":     "Mama ve su kapları",
  "bel-boyun-tasmalari": "Tasma, göğüs tasması ve gezdirme",
  "bakim-saglik":        "Bakım ve sağlık ürünleri",
  "makas-taraklar":      "Makas, tarak ve tarama",
  "sampuan-parfum":      "Şampuan, parfüm ve banyo",
  "agiz-dis-bakimi":     "Diş ve ağız bakımı",
  "sut-tozu-biberon":    "Süt tozu ve biberon",
  "bit-pire-parazit":    "Parazit ve koruma ürünleri",
  "goz-kulak-bakimi":    "Göz ve kulak bakımı",
  "tiras-ekipmanlari":   "Tıraş makinesi ve ekipman",
};

/**
 * Variant A = false (no SKT row ever shown)
 * Variant B = true  (SKT row shown when data is present)
 * Perishable / health categories are Variant B.
 */
const SLUG_TO_SHOW_SKT: Record<string, boolean> = {
  "yas-mama":            true,
  "bakim-saglik":        true,
  "sampuan-parfum":      true,
  "agiz-dis-bakimi":     true,
  "sut-tozu-biberon":    true,
  "bit-pire-parazit":    true,
  "goz-kulak-bakimi":    true,
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
        background:"#3D2612", color:"#fff", padding:"10px 22px", borderRadius:999,
        fontSize:13, fontWeight:500, whiteSpace:"nowrap", boxShadow:"0 4px 16px rgba(0,0,0,0.25)",
      }}>
        {message}
      </div>
    </div>
  );
}

function ChipRow({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="ypk-hscroll" style={{ marginBottom: 10, ...style }}>
      {children}
    </div>
  );
}

function FilterChip({
  label, on, onClick, solid,
}: { label: string; on: boolean; onClick: () => void; solid?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flexShrink: 0, padding: solid ? "8px 14px" : "7px 12px", borderRadius: 999,
        fontSize: solid ? 13 : 12, fontWeight: solid ? 650 : 600,
        border: `${solid ? 1.5 : 1}px solid ${on ? P : GB}`,
        background: on ? (solid ? P : PL) : "#fff",
        color: on ? (solid ? "#fff" : P) : "#5C4B3A",
        cursor: "pointer", fontFamily: "inherit",
      }}
    >
      {label}
    </button>
  );
}

function ProductCard({
  product,
  onNavigate,
  showSKT = false,
}: {
  product: any;
  onNavigate: (id: number, name: string) => void;
  showSKT?: boolean;
}) {
  const { updateQty, basket } = useCart();
  const [added, setAdded] = useState(false);
  const sid = String(product.id);
  const inCart = (basket[sid] || 0) > 0;
  const outOfStock = !product.stock || product.stock <= 0;
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const tags: string[] = [];
  if (showSKT && product.skt) tags.push(`SKT ${product.skt}`);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (outOfStock) return;
    const ok = updateQty(sid, 1);
    if (ok !== false) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1400);
    }
  };

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={product.name}
      onClick={() => onNavigate(product.id, product.name)}
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") onNavigate(product.id, product.name); }}
      style={{
        background: "#fff", borderRadius: 16, border: `1px solid ${GB}`,
        overflow: "hidden", display: "flex", flexDirection: "column",
        height: "100%", cursor: "pointer",
      }}
    >
      <div style={{
        position: "relative", width: "100%", aspectRatio: "1 / 1", flexShrink: 0,
        background: "#EFE8DE", overflow: "hidden",
      }}>
        {product.img ? (
          <img src={product.img} alt="" decoding="async"
            onError={e => {
              const el = e.target as HTMLImageElement;
              el.style.display = "none";
              const fb = el.parentElement?.querySelector("[data-img-fallback]") as HTMLElement | null;
              if (fb) fb.style.display = "flex";
            }}
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "contain", objectPosition: "center", padding: 10, boxSizing: "border-box",
            }} />
        ) : null}
        <div data-img-fallback style={{
          display: product.img ? "none" : "flex",
          position: "absolute", inset: 0, alignItems: "center", justifyContent: "center",
        }}>
          <Package size={36} color="#D1C4B0" strokeWidth={1.5} />
        </div>
        {hasDiscount && (
          <span style={{
            position: "absolute", top: 10, left: 10, background: "#EF4444", color: "#fff",
            borderRadius: 8, padding: "3px 8px", fontSize: 10, fontWeight: 800, zIndex: 1,
          }}>
            %{Math.round((1 - product.price / product.originalPrice) * 100)}
          </span>
        )}
        {inCart && !added && (
          <span style={{
            position: "absolute", top: 10, right: 10, width: 22, height: 22, borderRadius: "50%",
            background: "#DC2626", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1,
          }}>
            <Check size={12} color="#fff" strokeWidth={3} />
          </span>
        )}
      </div>

      <div style={{ padding: "10px 10px 12px", display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
        {product.brandName && !String(product.brandName).toLowerCase().includes("yourpoodle") && (
          <div style={{ fontSize: 11, fontWeight: 600, color: "#9A8B7A", letterSpacing: 0.2, height: 16, overflow: "hidden" }}>
            {product.brandName}
          </div>
        )}
        <h3 style={{
          fontSize: 13, fontWeight: 650, color: "#2C2118", lineHeight: 1.35, margin: 0,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden",
          height: 34,
        }}>
          {product.name}
        </h3>

        {tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {tags.map((t) => (
              <span key={t} style={{
                fontSize: 10, fontWeight: 700, color: P, background: PL,
                borderRadius: 999, padding: "3px 8px",
              }}>
                {t}
              </span>
            ))}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: "auto" }}>
          {hasDiscount && (
            <span style={{ fontSize: 11, color: "#B0A69C", textDecoration: "line-through" }}>
              {fmtPrice(product.originalPrice)}
            </span>
          )}
          <span style={{ fontSize: 16, fontWeight: 800, color: P }}>{fmtPrice(product.price)}</span>
        </div>

        <button
          type="button"
          aria-label={`${product.name} sepete ekle`}
          onClick={handleAdd}
          disabled={outOfStock}
          style={{
            width: "100%", marginTop: 2, padding: "6px 0", borderRadius: 8, border: "none",
            background: outOfStock ? "#FACC15" : added ? "#15803D" : "#DC2626",
            color: outOfStock ? "#713F12" : "#fff",
            fontSize: 12, fontWeight: 700, cursor: outOfStock ? "not-allowed" : "pointer",
            fontFamily: "inherit",
          }}
        >
          {outOfStock ? "Tükendi" : added ? "Eklendi" : "Sepete Ekle"}
        </button>
      </div>
    </article>
  );
}

/* ── Main Page ────────────────────────────────────────────────────── */
interface YPKategoriPageProps { routeSlug?: string; }

export default function YPKategoriPage({ routeSlug }: YPKategoriPageProps) {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [selMarka, setSelMarka] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("popular");
  const [toast, setToast] = useState({ message:"", visible:false });
  const toastTimer = useRef<ReturnType<typeof setTimeout>|null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const slug     = routeSlug || "tuvalet";
  const subcat   = SLUG_TO_SUBCAT[slug] || slug;
  const title    = SLUG_TO_TITLE[slug] || "Kategori";
  const subtitle = SLUG_TO_SUBTITLE[slug] || "Poodle ürünlerini incele";
  const showSKT  = !!SLUG_TO_SHOW_SKT[slug];

  useEffect(() => {
    document.title = `${title} | YourPoodle`;
    const setMeta = (attr: string, key: string, val: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
      el.content = val;
    };
    const desc = `${title} — Toy ve küçük ırk poodle ürünleri YourPoodle Mağaza'da. Türkiye geneli kargo, yalnızca online kredi kartı ile ödeme.`;
    setMeta("name", "description", desc);
    setMeta("property", "og:title", `${title} | YourPoodle`);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:type", "website");
    setMeta("name", "robots", "index,follow");
  }, [title]);

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
  const { data: rawProducts = [], isLoading, isError, refetch } = useQuery<any[]>({
    queryKey: [`/api/yp-products`, subcat],
    queryFn: async () => {
      const res = await fetch(`/api/yp-products?subcategory=${encodeURIComponent(subcat)}`);
      if (res.status === 429) {
        const err: any = new Error("rate_limited");
        err.status = 429;
        throw err;
      }
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
    retry: (count, err: any) => (err?.status === 429 ? count < 4 : count < 2),
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });

  /* Only show products that have a real image; hide YourPoodle-branded SKUs. */
  const imgProducts = useMemo(() =>
    rawProducts.filter((p: any) => {
      if (!p.img) return false;
      const brand = String(p.brandName || "").toLowerCase();
      return !brand.includes("yourpoodle");
    }),
  [rawProducts]);

  const brands = useMemo(() => {
    const set = new Set<string>();
    imgProducts.forEach((p: any) => {
      const b = p.brandName;
      if (b && !String(b).toLowerCase().includes("yourpoodle")) set.add(b);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, "tr"));
  }, [imgProducts]);

  const filtered = useMemo(() => {
    let result = imgProducts;
    if (debouncedQ) {
      const q = debouncedQ.toLocaleLowerCase("tr-TR");
      result = result.filter((p: any) =>
        (p.name || "").toLocaleLowerCase("tr-TR").includes(q) ||
        (p.brandName || "").toLocaleLowerCase("tr-TR").includes(q) ||
        (p.barcode || "").includes(q)
      );
    }
    if (selMarka) result = result.filter((p: any) => p.brandName === selMarka);

    const sorted = [...result];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    else if (sort === "discount") {
      sorted.sort((a, b) => {
        const da = a.originalPrice && a.originalPrice > a.price ? 1 - a.price / a.originalPrice : 0;
        const db = b.originalPrice && b.originalPrice > b.price ? 1 - b.price / b.originalPrice : 0;
        return db - da;
      });
    } else {
      sorted.sort((a, b) => {
        const sa = (a.stock || 0) > 0 ? 1 : 0;
        const sb = (b.stock || 0) > 0 ? 1 : 0;
        if (sb !== sa) return sb - sa;
        const da = a.originalPrice && a.originalPrice > a.price ? 1 - a.price / a.originalPrice : 0;
        const db = b.originalPrice && b.originalPrice > b.price ? 1 - b.price / b.originalPrice : 0;
        return db - da;
      });
    }
    return sorted;
  }, [imgProducts, debouncedQ, selMarka, sort]);

  const goProduct = useCallback((id: number, name: string) => {
    navigate(`${BASE}/urun/${id}/${slugify(name)}`);
  }, [navigate]);

  useEffect(() => {
    setSearch("");
    setSelMarka(null);
    setSort("popular");
  }, [slug]);

  const clearFilters = () => {
    setSelMarka(null);
    setSearch("");
    showToast("Filtreler temizlendi");
  };

  const activeChips: { key: string; label: string; clear: () => void }[] = [];
  if (selMarka) activeChips.push({ key: "marka", label: selMarka, clear: () => setSelMarka(null) });
  if (search) activeChips.push({ key: "q", label: `"${search}"`, clear: () => setSearch("") });
  const hasFilters = activeChips.length > 0;

  return (
    <YPLayout activeLink={`${BASE}/magaza`} constrain={false} hideFooter>
      <style>{`
        .ypk-hscroll { display:flex; gap:8px; overflow-x:auto; scrollbar-width:none; -ms-overflow-style:none; }
        .ypk-hscroll::-webkit-scrollbar { display:none; }
        @keyframes ypk-pulse { 0%,100%{opacity:1} 50%{opacity:.45} }
        .ypk-skel { animation: ypk-pulse 1.3s ease-in-out infinite; }
        @media (min-width: 768px) {
          .ypk-wrap { max-width: 1180px !important; padding: 32px 28px 80px !important; }
          .ypk-grid { grid-template-columns: repeat(3, minmax(0,1fr)) !important; gap: 18px !important; }
        }
        @media (min-width: 1100px) {
          .ypk-grid { grid-template-columns: repeat(4, minmax(0,1fr)) !important; gap: 20px !important; }
        }
      `}</style>
      <Toast message={toast.message} visible={toast.visible} />

      <div style={{ background: "#FAF8F4", minHeight: "70vh" }}>
        <div className="ypk-wrap" style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px 110px" }}>

          <header style={{ marginBottom: 16 }}>
            <button
              type="button"
              onClick={() => goBack(navigate, `${BASE}/magaza`)}
              aria-label="Mağaza kategorilerine dön"
              style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                background: "none", border: "none", cursor: "pointer",
                color: P, fontSize: 13, fontWeight: 700, padding: 0, marginBottom: 10,
                fontFamily: "inherit",
              }}
            >
              <ChevronLeft size={16} /> Mağaza
            </button>

            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
              <div>
                <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#2C2118", letterSpacing: "-0.02em" }}>
                  {title}
                </h1>
                <p style={{ margin: "6px 0 0", fontSize: 14, color: "#7A6A58", lineHeight: 1.4 }}>
                  {subtitle}
                </p>
              </div>
              {!isLoading && !isError && (
                <span style={{ fontSize: 13, fontWeight: 600, color: "#9A8B7A", whiteSpace: "nowrap", paddingTop: 8 }}>
                  {filtered.length} ürün
                </span>
              )}
            </div>
          </header>

          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "#fff", border: `1px solid ${GB}`,
            borderRadius: 14, padding: "12px 14px", marginBottom: 14,
          }}>
            <Search size={18} color="#B0A69C" strokeWidth={1.75} />
            <input
              ref={searchRef}
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={`${title.replace("Köpek ", "")} ara`}
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                fontSize: 15, color: "#2C2118", fontFamily: "inherit",
              }}
            />
            {search && (
              <button type="button" aria-label="Temizle"
                onClick={() => { setSearch(""); searchRef.current?.focus(); }}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "flex" }}>
                <X size={16} color="#9A8B7A" />
              </button>
            )}
          </div>

          {brands.length > 0 && (
            <>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9A8B7A", marginBottom: 6, letterSpacing: 0.3 }}>MARKA</div>
              <ChipRow style={{ marginBottom: 12 }}>
                <FilterChip label="Tümü" on={!selMarka} onClick={() => setSelMarka(null)} solid />
                {brands.map((b) => (
                  <FilterChip
                    key={b}
                    label={b}
                    on={selMarka === b}
                    onClick={() => setSelMarka(selMarka === b ? null : b)}
                  />
                ))}
              </ChipRow>
            </>
          )}

          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 10, marginBottom: 14, flexWrap: "wrap",
          }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", flex: 1 }}>
              {activeChips.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={c.clear}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    background: PL, border: `1px solid ${GB}`, borderRadius: 999,
                    padding: "5px 10px", fontSize: 12, fontWeight: 650, color: P,
                    cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  {c.label} <X size={12} />
                </button>
              ))}
              {hasFilters && (
                <button type="button" onClick={clearFilters}
                  style={{
                    background: "none", border: "none", cursor: "pointer", padding: "4px 0",
                    fontSize: 12, fontWeight: 700, color: P, fontFamily: "inherit",
                  }}>
                  Tümünü temizle
                </button>
              )}
            </div>

            <label style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "#fff", border: `1px solid ${GB}`, borderRadius: 12,
              padding: "6px 10px", fontSize: 12, fontWeight: 650, color: "#5C4B3A",
              position: "relative",
            }}>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                aria-label="Sıralama"
                style={{
                  appearance: "none", border: "none", background: "transparent",
                  fontFamily: "inherit", fontSize: 12, fontWeight: 650, color: "#5C4B3A",
                  paddingRight: 16, cursor: "pointer", outline: "none",
                }}
              >
                {SORT_OPTS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={14} color="#9A8B7A" style={{ position: "absolute", right: 8, pointerEvents: "none" }} />
            </label>
          </div>

          {isLoading ? (
            <div className="ypk-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="ypk-skel" style={{ borderRadius: 16, background: "#EDE7DE", aspectRatio: "0.72" }} />
              ))}
            </div>
          ) : isError ? (
            <div style={{
              textAlign: "center", padding: "56px 20px", background: "#fff",
              borderRadius: 20, border: `1px solid ${GB}`,
            }}>
              <p style={{ fontSize: 17, fontWeight: 800, color: "#2C2118", margin: "0 0 8px" }}>
                Ürünler yüklenemedi
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                style={{
                  border: "none", background: P, color: "#fff", borderRadius: 12,
                  padding: "11px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                }}>
                Tekrar Dene
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "56px 20px", background: "#fff",
              borderRadius: 20, border: `1px solid ${GB}`,
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%", background: PL, margin: "0 auto 16px",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Package size={24} color={P} strokeWidth={1.6} />
              </div>
              <h2 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 800, color: "#2C2118" }}>
                {imgProducts.length === 0 ? "Bu kategoride henüz ürün yok" : "Sonuç bulunamadı"}
              </h2>
              <p style={{ margin: "0 0 20px", fontSize: 13, color: "#7A6A58", lineHeight: 1.5, maxWidth: 300, marginLeft: "auto", marginRight: "auto" }}>
                {imgProducts.length === 0
                  ? "Yakında yeni ürünler eklenecek."
                  : "Aramayı değiştir veya filtreleri temizle."}
              </p>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                {hasFilters && (
                  <button type="button" onClick={clearFilters}
                    style={{
                      border: `1.5px solid ${P}`, background: "#fff", color: P, borderRadius: 12,
                      padding: "11px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                    }}>
                    Filtreleri Temizle
                  </button>
                )}
                <button type="button" onClick={() => navigate(`${BASE}/magaza`)}
                  style={{
                    border: "none", background: P, color: "#fff", borderRadius: 12,
                    padding: "11px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                  }}>
                  Mağazaya Dön
                </button>
              </div>
            </div>
          ) : (
            <div className="ypk-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {filtered.map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onNavigate={goProduct}
                  showSKT={showSKT}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </YPLayout>
  );
}
