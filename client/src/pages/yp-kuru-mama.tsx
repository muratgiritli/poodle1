import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useLocation, useSearch } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search, X, Check, Package, ArrowRight, ChevronLeft, ChevronDown } from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { useCart } from "@/contexts/CartContext";
import { IS_YP } from "@/lib/store";
import { goBack } from "@/lib/goBack";

const BASE = IS_YP ? "" : "/yourpoodle";
const P = "#5D3A1A";
const PL = "#F5F0E6";
const GB = "#E8E0D4";

type SortKey = "popular" | "price-asc" | "price-desc" | "discount";

function fmtPrice(n: number) {
  return `${n.toLocaleString("tr-TR")} TL`;
}

function extractKgNum(name: string): number | null {
  const m = name.match(/(\d+(?:[.,]\d+)?)\s*kg/i);
  if (!m) return null;
  return parseFloat(m[1].replace(",", "."));
}

function slugify(str: string) {
  return str.toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function productTags(p: any): string[] {
  const tags: string[] = [];
  const meta = p.mamaMetadata || {};
  const name = String(p.name || "").toLocaleLowerCase("tr-TR");

  const ageMap: Record<string, string> = {
    yavru: "Yavru", puppy: "Yavru",
    yetiskin: "Yetişkin", adult: "Yetişkin",
    yasli: "Yaşlı", senior: "Yaşlı",
  };
  const ageKey = meta.age || p.mamaType || "";
  if (ageMap[ageKey]) tags.push(ageMap[ageKey]);
  else if (name.includes("yavru")) tags.push("Yavru");
  else if (name.includes("yaşlı") || name.includes("yasli")) tags.push("Yaşlı");
  else if (name.includes("yetişkin") || name.includes("yetiskin")) tags.push("Yetişkin");

  if (meta.grainFree === true || name.includes("tahılsız") || name.includes("tahilsiz")) {
    tags.push("Tahılsız");
  }

  const sizeMap: Record<string, string> = {
    micro: "Micro", toy: "Toy", mini: "Mini", miniature: "Mini", standard: "Standart",
  };
  const sizeKey = meta.weight || meta.breedSize || "";
  if (sizeMap[sizeKey]) tags.push(sizeMap[sizeKey]);
  else if (name.includes("toy")) tags.push("Toy");
  else if (name.includes("küçük") || name.includes("kucuk") || name.includes("mini")) tags.push("Mini");

  return tags.slice(0, 3);
}

function isGrainFree(p: any): boolean {
  const meta = p.mamaMetadata || {};
  if (meta.grainFree === true) return true;
  if (meta.grainFree === false) return false;
  const name = String(p.name || "").toLocaleLowerCase("tr-TR");
  return name.includes("tahılsız") || name.includes("tahilsiz");
}

function packageBucket(p: any): "small" | "medium" | "large" | null {
  const meta = p.mamaMetadata || {};
  const pkg = Array.isArray(meta.package) ? meta.package[0] : meta.package;
  if (pkg === "small" || pkg === "medium" || pkg === "large") return pkg;
  const kg = extractKgNum(p.name || "");
  if (kg == null) return null;
  if (kg <= 2.5) return "small";
  if (kg <= 5.5) return "medium";
  return "large";
}

function ageMatches(p: any, sel: string): boolean {
  const meta = p.mamaMetadata || {};
  const map: Record<string, string[]> = {
    yavru: ["yavru", "puppy"],
    yetiskin: ["yetiskin", "adult"],
    yasli: ["yasli", "senior"],
  };
  const keys = map[sel] || [];
  if (keys.includes(String(meta.age || ""))) return true;
  if (keys.includes(String(p.mamaType || ""))) return true;
  const name = String(p.name || "").toLocaleLowerCase("tr-TR");
  if (sel === "yavru") return name.includes("yavru") || name.includes("puppy");
  if (sel === "yasli") return name.includes("yaşlı") || name.includes("yasli") || name.includes("senior");
  if (sel === "yetiskin") {
    return name.includes("yetişkin") || name.includes("yetiskin") || name.includes("adult")
      || (!name.includes("yavru") && !name.includes("yaşlı") && !name.includes("yasli"));
  }
  return false;
}

function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div style={{
      position: "fixed", bottom: 88, left: "50%", transform: "translateX(-50%)",
      zIndex: 9999, pointerEvents: "none", opacity: visible ? 1 : 0, transition: "opacity .25s",
    }}>
      <div style={{
        background: "#3D2612", color: "#fff", padding: "11px 18px", borderRadius: 999,
        fontSize: 13, fontWeight: 600, whiteSpace: "nowrap",
      }}>
        {message}
      </div>
    </div>
  );
}

function ChipRow({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="ykm-hscroll" style={{ marginBottom: 10, ...style }}>
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

function ProductCard({ product, onNavigate }: { product: any; onNavigate: (id: number, name: string) => void }) {
  const { updateQty, basket } = useCart();
  const [added, setAdded] = useState(false);
  const sid = String(product.id);
  const inCart = (basket[sid] || 0) > 0;
  const outOfStock = !product.stock || product.stock <= 0;
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const tags = productTags(product);

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
        height: "100%",
        cursor: "pointer",
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

const AGE_FILTERS = [
  { value: "yavru", label: "Yavru" },
  { value: "yetiskin", label: "Yetişkin" },
  { value: "yasli", label: "Yaşlı" },
];

const GRAIN_FILTERS = [
  { value: "all", label: "Tümü" },
  { value: "free", label: "Tahılsız" },
  { value: "with", label: "Tahıllı" },
];

const KG_FILTERS = [
  { value: "small", label: "1–2 kg" },
  { value: "medium", label: "3–5 kg" },
  { value: "large", label: "7+ kg" },
];

const SORT_OPTS: { value: SortKey; label: string }[] = [
  { value: "popular", label: "Popüler" },
  { value: "price-asc", label: "Fiyat ↑" },
  { value: "price-desc", label: "Fiyat ↓" },
  { value: "discount", label: "İndirim" },
];

export default function YPKuruMamaPage() {
  const [, navigate] = useLocation();
  const qs = useSearch();
  const [search, setSearch] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [selYas, setSelYas] = useState<string | null>(null);
  const [selGrain, setSelGrain] = useState<"all" | "free" | "with">("all");
  const [selKg, setSelKg] = useState<string | null>(null);
  const [selMarka, setSelMarka] = useState<string | null>(null);
  const [markaSlug, setMarkaSlug] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("popular");
  const [toast, setToast] = useState({ message: "", visible: false });
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => { document.title = "Kuru Mama | YourPoodle"; }, []);

  useEffect(() => {
    const slug = new URLSearchParams(qs).get("marka");
    if (slug) setMarkaSlug(slug);
  }, [qs]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(search), 250);
    return () => clearTimeout(t);
  }, [search]);

  const showToast = useCallback((msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message: msg, visible: true });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 2200);
  }, []);

  const { data: rawProducts = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/yp-products"],
    staleTime: 5 * 60 * 1000,
  });

  const mamaProducts = useMemo(() =>
    rawProducts.filter((p: any) => {
      // Only show products with a real stored image (no broken hotlinks / proxy)
      const img = String(p?.img || "");
      if (!img.startsWith("/api/product-image")) return false;
      const brand = String(p.brandName || "").toLowerCase();
      if (brand.includes("yourpoodle")) return false;
      const sub = (p.subcategory || "").toLowerCase();
      const cat = (p.category || "").toLowerCase();
      const name = (p.name || "").toLowerCase();
      return (
        sub === "kopek-kuru-mama" ||
        sub === "mama-markalari" ||
        sub === "odul-kemik" ||
        sub.includes("kuru") ||
        (cat.includes("mama") && name.includes("kuru"))
      );
    }),
  [rawProducts]);

  const brands = useMemo(() => {
    const set = new Set<string>();
    mamaProducts.forEach((p: any) => {
      const b = p.brandName;
      if (b && !String(b).toLowerCase().includes("yourpoodle")) set.add(b);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, "tr"));
  }, [mamaProducts]);

  const filtered = useMemo(() => {
    let result = mamaProducts;
    if (debouncedQ) {
      const q = debouncedQ.toLocaleLowerCase("tr-TR");
      result = result.filter((p: any) =>
        (p.name || "").toLocaleLowerCase("tr-TR").includes(q) ||
        (p.brandName || "").toLocaleLowerCase("tr-TR").includes(q),
      );
    }
    if (selYas) result = result.filter((p: any) => ageMatches(p, selYas));
    if (selGrain === "free") result = result.filter((p: any) => isGrainFree(p));
    if (selGrain === "with") result = result.filter((p: any) => !isGrainFree(p));
    if (selKg) result = result.filter((p: any) => packageBucket(p) === selKg);
    if (selMarka) result = result.filter((p: any) => p.brandName === selMarka);
    if (markaSlug) result = result.filter((p: any) => slugify(p.brandName || "") === markaSlug);

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
      // popular: in-stock first, then discount
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
  }, [mamaProducts, debouncedQ, selYas, selGrain, selKg, selMarka, markaSlug, sort]);

  const goProduct = useCallback((id: number, name: string) => {
    navigate(`${BASE}/urun/${id}/${slugify(name)}`);
  }, [navigate]);

  const clearFilters = () => {
    setSelYas(null);
    setSelGrain("all");
    setSelKg(null);
    setSelMarka(null);
    setMarkaSlug(null);
    setSearch("");
    showToast("Filtreler temizlendi");
  };

  const activeChips: { key: string; label: string; clear: () => void }[] = [];
  if (selYas) {
    const lab = AGE_FILTERS.find((f) => f.value === selYas)?.label || selYas;
    activeChips.push({ key: "yas", label: lab, clear: () => setSelYas(null) });
  }
  if (selGrain !== "all") {
    activeChips.push({
      key: "grain",
      label: selGrain === "free" ? "Tahılsız" : "Tahıllı",
      clear: () => setSelGrain("all"),
    });
  }
  if (selKg) {
    const lab = KG_FILTERS.find((f) => f.value === selKg)?.label || selKg;
    activeChips.push({ key: "kg", label: lab, clear: () => setSelKg(null) });
  }
  if (selMarka) activeChips.push({ key: "marka", label: selMarka, clear: () => setSelMarka(null) });
  if (markaSlug && !selMarka) {
    activeChips.push({ key: "slug", label: markaSlug, clear: () => setMarkaSlug(null) });
  }
  if (search) activeChips.push({ key: "q", label: `"${search}"`, clear: () => setSearch("") });

  const hasFilters = activeChips.length > 0;

  return (
    <YPLayout activeLink={`${BASE}/magaza`} constrain={false} hideFooter>
      <style>{`
        .ykm-hscroll { display:flex; gap:8px; overflow-x:auto; scrollbar-width:none; -ms-overflow-style:none; }
        .ykm-hscroll::-webkit-scrollbar { display:none; }
        @keyframes ykm-pulse { 0%,100%{opacity:1} 50%{opacity:.45} }
        .ykm-skel { animation: ykm-pulse 1.3s ease-in-out infinite; }
        @media (min-width: 768px) {
          .ykm-wrap { max-width: 1180px !important; padding: 32px 28px 80px !important; }
          .ykm-grid { grid-template-columns: repeat(3, minmax(0,1fr)) !important; gap: 18px !important; }
        }
        @media (min-width: 1100px) {
          .ykm-grid { grid-template-columns: repeat(4, minmax(0,1fr)) !important; gap: 20px !important; }
        }
      `}</style>

      <Toast message={toast.message} visible={toast.visible} />

      <div style={{ background: "#FAF8F4", minHeight: "70vh" }}>
        <div className="ykm-wrap" style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px 110px" }}>

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
                  Kuru Mama
                </h1>
                <p style={{ margin: "6px 0 0", fontSize: 14, color: "#7A6A58", lineHeight: 1.4 }}>
                  Yaşa, boyuta ve tahılsıza göre filtrele
                </p>
              </div>
              {!isLoading && (
                <span style={{ fontSize: 13, fontWeight: 600, color: "#9A8B7A", whiteSpace: "nowrap", paddingTop: 8 }}>
                  {filtered.length} ürün
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => navigate(`${BASE}/mama-bul`)}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: 12, padding: "12px 14px", borderRadius: 14, border: `1.5px solid ${P}`,
                background: PL, cursor: "pointer", fontFamily: "inherit", marginBottom: 14,
              }}
            >
              <span style={{ textAlign: "left" }}>
                <span style={{ display: "block", fontSize: 13, fontWeight: 800, color: P }}>Kararsız mısın? Mama Bul</span>
                <span style={{ display: "block", fontSize: 12, color: "#7A6A58", marginTop: 2 }}>
                  Birkaç soruyla en uygun mamayı bul
                </span>
              </span>
              <ArrowRight size={18} color={P} />
            </button>
          </header>

          {/* Search */}
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
              placeholder="Marka veya mama ara"
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

          {/* Yaş */}
          <div style={{ fontSize: 11, fontWeight: 700, color: "#9A8B7A", marginBottom: 6, letterSpacing: 0.3 }}>YAŞ</div>
          <ChipRow>
            <FilterChip label="Tümü" on={!selYas} onClick={() => setSelYas(null)} solid />
            {AGE_FILTERS.map((f) => (
              <FilterChip
                key={f.value}
                label={f.label}
                on={selYas === f.value}
                onClick={() => setSelYas(selYas === f.value ? null : f.value)}
                solid
              />
            ))}
          </ChipRow>

          {/* Tahıl + kg */}
          <div style={{ fontSize: 11, fontWeight: 700, color: "#9A8B7A", marginBottom: 6, letterSpacing: 0.3 }}>TAHIL & PAKET</div>
          <ChipRow>
            {GRAIN_FILTERS.map((f) => (
              <FilterChip
                key={f.value}
                label={f.label}
                on={selGrain === f.value}
                onClick={() => setSelGrain(f.value as "all" | "free" | "with")}
              />
            ))}
            <span style={{ width: 1, alignSelf: "stretch", background: GB, flexShrink: 0, margin: "0 2px" }} />
            {KG_FILTERS.map((f) => (
              <FilterChip
                key={f.value}
                label={f.label}
                on={selKg === f.value}
                onClick={() => setSelKg(selKg === f.value ? null : f.value)}
              />
            ))}
          </ChipRow>

          {/* Marka */}
          {brands.length > 0 && (
            <>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9A8B7A", marginBottom: 6, letterSpacing: 0.3 }}>MARKA</div>
              <ChipRow style={{ marginBottom: 12 }}>
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

          {/* Active chips + sort */}
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

          {/* Grid */}
          {isLoading ? (
            <div className="ykm-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="ykm-skel" style={{ borderRadius: 16, background: "#EDE7DE", aspectRatio: "0.72" }} />
              ))}
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
                {mamaProducts.length === 0 ? "Henüz kuru mama yok" : "Sonuç bulunamadı"}
              </h2>
              <p style={{ margin: "0 0 20px", fontSize: 13, color: "#7A6A58", lineHeight: 1.5, maxWidth: 300, marginLeft: "auto", marginRight: "auto" }}>
                {mamaProducts.length === 0
                  ? "Mağaza stoğu yakında güncellenecek. Bu arada Mama Bul ile ihtiyaca uygun öneri alabilirsin."
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
                <button type="button" onClick={() => navigate(`${BASE}/mama-bul`)}
                  style={{
                    border: "none", background: P, color: "#fff", borderRadius: 12,
                    padding: "11px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                    display: "inline-flex", alignItems: "center", gap: 6,
                  }}>
                  Mama Bul <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div className="ykm-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {filtered.map((product: any) => (
                <ProductCard key={product.id} product={product} onNavigate={goProduct} />
              ))}
            </div>
          )}
        </div>
      </div>
    </YPLayout>
  );
}
