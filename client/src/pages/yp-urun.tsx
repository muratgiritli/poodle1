import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ShoppingCart, Heart, Plus, Minus, Share2, ArrowRight } from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import YPProductReviews, { reviewSummary, useProductReviews } from "@/components/yourpoodle/YPProductReviews";
import YPRecentlyViewed from "@/components/yourpoodle/YPRecentlyViewed";
import YPStockAlert from "@/components/yourpoodle/YPStockAlert";
import { useCustomer } from "@/contexts/CustomerContext";
import { addRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { useCart } from "@/contexts/CartContext";
import { apiRequest } from "@/lib/queryClient";
import { goBack } from "@/lib/goBack";
import { IS_YP } from "@/lib/store";
import {
  getCategorySchema,
  buildAttrRows,
  buildBenefitsFromMeta,
  categoryShowsSkt,
} from "@/lib/yp-product-attrs";

const BASE = IS_YP ? "" : "/yourpoodle";
const P = "#5D3A1A";
const PL = "#F5F0E6";

/* ─── Types ─────────────────────────────────────────── */
interface MamaBenefit { title: string; desc?: string }
interface MamaMetadata {
  age?: string; weight?: string; neutered?: string; activity?: string; weight_goal?: string;
  allergy?: string; digestion?: string; coat?: string;
  protein?: string | string[]; budget?: string | string[]; package?: string | string[];
  proteinType?: string; grainFree?: boolean; breedSize?: string; budgetTier?: string;
  allergens?: string[]; specialNeeds?: string[]; ingredients?: string;
  benefits?: MamaBenefit[];
  nutritionalAnalysis?: { protein?: number; fat?: number; fiber?: number; ash?: number; moisture?: number };
  dailyPortionGuide?: string;
}
interface Product {
  id: number; name: string; price: number; originalPrice?: number;
  img?: string; stock: number; isActive: boolean;
  mamaType?: string; subcategory?: string; brandName?: string; brandSlug?: string;
  animal?: string; barcode?: string; skt?: string; longDescription?: string;
  metaTitle?: string; metaDescription?: string; metaKeywords?: string;
  mamaMetadata?: MamaMetadata | null;
}
function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/javascript:/gi, "");
}

function slugify(str: string) {
  return str.toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const LABEL_MAP: Record<string, Record<string, string>> = {
  age: { puppy: "Yavru (0–12 ay)", adult: "Yetişkin (1–7 yaş)", senior: "Yaşlı (7+ yaş)", yavru: "Yavru (0–12 ay)", yetiskin: "Yetişkin (1–7 yaş)", yasli: "Yaşlı (7+ yaş)" },
  weight: { micro: "1–2 kg (Micro)", toy: "2–4 kg (Toy)", mini: "4–9 kg (Minyatür)", miniature: "4–9 kg (Minyatür)", standard: "9+ kg (Standart)" },
  neutered: { yes: "Evet", no: "Hayır" },
  activity: { low: "Düşük", medium: "Orta", high: "Yüksek" },
  weight_goal: { lose: "Versin", maintain: "Korusun", gain: "Alsın" },
  allergy: { none: "Yok", chicken: "Tavuk", grain: "Tahıl", fish: "Balık", other: "Diğer" },
  digestion: { none: "Normal", sensitive: "Hassas", very_sensitive: "Çok hassas" },
  coat: { none: "İyi", dull: "Mat", scratch: "Kaşıntı", shedding: "Dökülme" },
  protein: { chicken: "Tavuk", lamb: "Kuzu", salmon: "Somon", rabbit: "Tavşan", any: "Fark etmez", tavuk: "Tavuk", kuzu: "Kuzu", somon: "Somon" },
  budget: { economy: "₺500–1K", mid: "₺1–2K", premium: "₺2K+", ekonomi: "₺500–1K", orta: "₺1–2K" },
  package: { small: "1–2 kg", medium: "3–5 kg", large: "7–12 kg" },
};
const PROTEIN_TR = LABEL_MAP.protein;
const AGE_TR = LABEL_MAP.age;
const BUDGET_TR = LABEL_MAP.budget;
const BREED_TR: Record<string, string> = {
  toy: "Toy Poodle (2–4 kg)", miniature: "Minyatür Poodle (4–9 kg)",
  mini: "Minyatür Poodle (4–9 kg)", standard: "Standart Poodle (9+ kg)", micro: "Micro (1–2 kg)",
};

function mapVal(group: string, raw: string | string[] | undefined): string | null {
  if (raw == null) return null;
  const vals = Array.isArray(raw) ? raw : [raw];
  const mapped = vals.map((v) => LABEL_MAP[group]?.[v] || v).filter(Boolean);
  return mapped.length ? mapped.join(", ") : null;
}

function buildBenefits(product: Product): MamaBenefit[] {
  const fromMeta = buildBenefitsFromMeta(product.mamaMetadata as any);
  if (fromMeta.length) return fromMeta;

  const schema = getCategorySchema(product.subcategory);
  // Mama dışı / boş: kategoriye göre varsayılan 0 — zorla mama faydası basma
  if (!schema.showMamaBulCta) return [];

  const name = (product.name || "").toLocaleLowerCase("tr-TR");
  const meta = product.mamaMetadata;
  const out: MamaBenefit[] = [];
  if (name.includes("poodle") || name.includes("toy") || meta?.breedSize === "toy") {
    out.push({ title: "Irklara özel beslenme", desc: "Toy / küçük ırk Poodle formülü" });
  } else {
    out.push({ title: "Irklara özel beslenme", desc: "Küçük ırk ihtiyaçlarına göre" });
  }
  out.push({ title: "Özel tasarlanan mama taneleri", desc: "Küçük çeneye uygun granül" });
  out.push({ title: "Günlük beslenme dengesi", desc: "Protein ve enerji dengesi" });
  return out.slice(0, 3);
}

export default function YPUrunPage() {
  const params = useParams<{ id: string; slug?: string }>();
  const [, navigate] = useLocation();
  const productId = Number(params.id);
  const { updateQty, itemCount } = useCart();

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { isLoggedIn } = useCustomer();
  const { data: reviews = [] } = useProductReviews(productId);
  const ratingSummary = useMemo(() => reviewSummary(reviews), [reviews]);

  useEffect(() => {
    if (!isLoggedIn || !productId) return;
    apiRequest("GET", "/api/customer/favorites")
      .then(r => r.json())
      .then((ids: number[]) => { if (Array.isArray(ids)) setWishlisted(ids.includes(productId)); })
      .catch(() => {});
  }, [isLoggedIn, productId]);

  const toggleWishlist = useCallback(async () => {
    if (wishlistLoading) return;
    if (!isLoggedIn) { window.location.href = `${BASE}/giris`; return; }
    setWishlistLoading(true);
    const next = !wishlisted;
    setWishlisted(next);
    try {
      if (next) await apiRequest("POST", "/api/customer/favorites", { productId });
      else await apiRequest("DELETE", `/api/customer/favorites/${productId}`);
    } catch { setWishlisted(!next); }
    setWishlistLoading(false);
  }, [wishlisted, wishlistLoading, isLoggedIn, productId]);

  const { data: allProducts = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/yp-products"],
    staleTime: 5 * 60 * 1000,
  });

  const product = allProducts.find(p => p.id === productId);

  type CrossSellSection = { id: number; title: string; products: Product[] };
  const { data: productDetail } = useQuery<{ crossSellSections?: CrossSellSection[] }>({
    queryKey: ["/api/product-detail", productId],
    queryFn: async () => {
      const r = await fetch(`/api/product-detail/${productId}`);
      if (!r.ok) return { crossSellSections: [] };
      return r.json();
    },
    enabled: Number.isFinite(productId) && productId > 0,
    staleTime: 5 * 60 * 1000,
  });

  const alsoBought = useMemo(() => {
    const sections = productDetail?.crossSellSections || [];
    const seen = new Set<number>();
    const out: Product[] = [];
    for (const s of sections) {
      for (const p of s.products || []) {
        if (!p?.id || p.id === productId || seen.has(p.id)) continue;
        seen.add(p.id);
        out.push(p);
      }
    }
    return out.slice(0, 8);
  }, [productDetail, productId]);

  const catSchema = useMemo(() => getCategorySchema(product?.subcategory), [product?.subcategory]);
  const showSktRow = categoryShowsSkt(product?.subcategory);

  useEffect(() => {
    if (!product) return;
    const title = product.metaTitle || `${product.name} | YourPoodle Mağaza`;
    const description =
      product.metaDescription ||
      `${product.name} — YourPoodle Mağaza'da. Toy Poodle sahipleri için seçilmiş mama. Yalnızca online kredi kartı ile ödeme.`;
    document.title = title;
    const setMeta = (attr: string, key: string, val: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
      el.content = val;
    };
    setMeta("name", "description", description);
    if (product.metaKeywords) setMeta("name", "keywords", product.metaKeywords);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:image", product.img || "");
    setMeta("property", "og:type", "product");
    setMeta("name", "robots", "index,follow,max-image-preview:large");

    // Product JSON-LD for Google / AI search
    const ldId = "yp-product-jsonld";
    document.getElementById(ldId)?.remove();
    const script = document.createElement("script");
    script.id = ldId;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      image: product.img ? [product.img] : undefined,
      description,
      brand: product.brandName ? { "@type": "Brand", name: product.brandName } : undefined,
      sku: product.barcode || String(product.id),
      // Only emitted when real published reviews exist — never fabricated.
      aggregateRating: ratingSummary.count > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: Number(ratingSummary.average.toFixed(1)),
            reviewCount: ratingSummary.count,
          }
        : undefined,
      offers: {
        "@type": "Offer",
        url: typeof window !== "undefined" ? window.location.href : undefined,
        priceCurrency: "TRY",
        price: product.price,
        availability: (product.stock || 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        acceptedPaymentMethod: "http://purl.org/goodrelations/v1#PaymentMethodCreditCard",
      },
    });
    document.head.appendChild(script);
    return () => { document.getElementById(ldId)?.remove(); };
  }, [product, ratingSummary.count, ratingSummary.average]);

  const addToCart = useCallback(() => {
    if (!product) return;
    for (let i = 0; i < qty; i++) updateQty(String(product.id), 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }, [product, qty, updateQty]);

  useEffect(() => {
    if (!product) return;
    addRecentlyViewed({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
    });
    import("@/lib/yp-analytics").then((yp) => {
      yp.trackProductView({ id: product.id, name: product.name, price: product.price });
    }).catch(() => {});
  }, [product?.id]);

  const cartCount = itemCount;
  const inStock = product ? (product.stock || 0) > 0 : false;
  const discount = product?.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  const detailRows = useMemo(() => {
    if (!product) return [] as { label: string; value: string }[];
    const schema = getCategorySchema(product.subcategory);
    const fromSchema = buildAttrRows(product.mamaMetadata as any, schema);
    if (fromSchema.length > 0) return fromSchema;

    // Geriye dönük: eski mama alanları
    if (!schema.showMamaBulCta) return [];
    const meta = product.mamaMetadata || {};
    const nameLower = (product.name || "").toLocaleLowerCase("tr-TR");
    const rows: { label: string; value: string }[] = [];
    const push = (label: string, value: string | null | undefined) => { if (value) rows.push({ label, value }); };
    push("Yaş", mapVal("age", meta.age) || AGE_TR[product.mamaType || ""] || null);
    push("Kilo", mapVal("weight", meta.weight) || (meta.breedSize ? BREED_TR[meta.breedSize] : null));
    push("Protein", mapVal("protein", meta.protein) || (meta.proteinType ? PROTEIN_TR[meta.proteinType] || meta.proteinType : null));
    if (meta.grainFree === true || nameLower.includes("tahılsız") || nameLower.includes("tahilsiz")) push("Tahıl", "Tahılsız");
    else if (meta.grainFree === false) push("Tahıl", "Tahıllı");
    if (meta.dailyPortionGuide) push("Günlük porsiyon", meta.dailyPortionGuide);
    return rows;
  }, [product]);

  const benefits = useMemo(() => (product ? buildBenefits(product) : []), [product]);

  if (isLoading) {
    return (
      <YPLayout constrain={false}>
        <div className="yp-urun-skel" style={{ padding: "32px 20px", maxWidth: 720, margin: "0 auto" }}>
          <div style={{ height: 220, borderRadius: 12, background: "#e8e8e8", marginBottom: 16, animation: "pulse 1.5s ease-in-out infinite" }} />
          {[120, 80, 160].map((w, i) => (
            <div key={i} style={{ height: 18, borderRadius: 8, background: "#e8e8e8", marginBottom: 12, width: w * 3, maxWidth: "100%", animation: "pulse 1.5s ease-in-out infinite" }} />
          ))}
        </div>
      </YPLayout>
    );
  }

  if (!product) {
    return (
      <YPLayout constrain={false}>
        <div style={{ padding: "64px 24px", textAlign: "center" }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a", marginBottom: 8 }}>Ürün bulunamadı</h1>
          <button onClick={() => navigate(`${BASE}/magaza`)}
            style={{ padding: "12px 28px", borderRadius: 20, background: P, border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            Mağazaya Dön
          </button>
        </div>
      </YPLayout>
    );
  }

  const ingredientsText = product.mamaMetadata?.ingredients || null;
  const na = product.mamaMetadata?.nutritionalAnalysis;

  return (
    <YPLayout constrain={false}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .yp-urun-page { max-width: 960px; margin: 0 auto; padding: 0 0 120px; }
        .yp-urun-img-wrap { background: #fff; border-bottom: 1px solid #E8E0D4; aspect-ratio: 16/10; }
        .yp-urun-buy { padding: 18px 16px 0; }
        .yp-urun-related-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        @media (min-width: 768px) {
          .yp-urun-skel { max-width: 1180px !important; padding: 40px 24px !important; }
          .yp-urun-page { max-width: 1180px; padding: 8px 24px 72px; }
          .yp-urun-hero {
            display: grid !important;
            grid-template-columns: minmax(0, 1.1fr) minmax(340px, 420px);
            gap: 36px;
            align-items: start;
            padding: 20px 0 8px;
          }
          .yp-urun-img-wrap {
            border-radius: 22px;
            border: 1px solid #E8E0D4 !important;
            aspect-ratio: 1 / 1 !important;
            min-height: 440px;
            box-shadow: 0 12px 40px rgba(93, 58, 26, 0.08);
            background: linear-gradient(180deg, #fff 0%, #FBF8F3 100%);
          }
          .yp-urun-buy {
            padding: 28px 26px !important;
            background: #fff;
            border: 1px solid #EDE5D8;
            border-radius: 22px;
            box-shadow: 0 10px 36px rgba(93, 58, 26, 0.07);
            position: sticky;
            top: 96px;
          }
          .yp-urun-back { display: none !important; }
          .yp-urun-related-grid { grid-template-columns: repeat(4, 1fr); gap: 14px; }
          .yp-urun-body { padding: 32px 0 0 !important; }
          .yp-urun-title { font-size: 26px !important; line-height: 1.28 !important; }
          .yp-urun-price { font-size: 32px !important; }
          .yp-urun-benefits { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 12px !important; }
          .yp-urun-cta { height: 52px !important; border-radius: 14px !important; font-size: 15px !important; }
        }
        @media (min-width: 1100px) {
          .yp-urun-hero {
            grid-template-columns: minmax(0, 1.15fr) minmax(380px, 460px);
            gap: 48px;
          }
          .yp-urun-img-wrap { min-height: 520px; }
        }
      `}</style>

      {/* Mobile sticky top */}
      <div className="yp-urun-back" style={{ background: "#fff", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f0f0f0", position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={() => goBack(navigate, `${BASE}${catSchema.listPath}`)}
          style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: P, fontSize: 13, fontWeight: 700, padding: 0 }}>
          <ChevronLeft size={16} /> {catSchema.listLabel}
        </button>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => { if (navigator.share) navigator.share({ title: product.name, url: window.location.href }); }}
            style={{ width: 36, height: 36, borderRadius: "50%", background: "#f5f5f5", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Share2 size={15} color="#555" />
          </button>
          <button onClick={() => navigate(`${BASE}/sepet`)} style={{ position: "relative", width: 36, height: 36, borderRadius: "50%", background: "#f5f5f5", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ShoppingCart size={15} color="#555" />
            {cartCount > 0 && (
              <span style={{ position: "absolute", top: 4, right: 4, width: 14, height: 14, borderRadius: "50%", background: P, color: "#fff", fontSize: 8, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>
            )}
          </button>
        </div>
      </div>

      <div className="yp-urun-page">
        <div className="yp-urun-hero">
          {/* Wide hero image */}
          <div className="yp-urun-img-wrap" style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            {discount > 0 && (
              <div style={{ position: "absolute", top: 12, left: 12, background: "#EF4444", borderRadius: 8, padding: "4px 10px", zIndex: 2 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>%{discount} İNDİRİM</span>
              </div>
            )}
            <button onClick={toggleWishlist}
              style={{ position: "absolute", top: 12, right: 12, width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.95)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2, opacity: wishlistLoading ? 0.6 : 1 }}>
              <Heart size={17} color={wishlisted ? "#E75480" : "#bbb"} fill={wishlisted ? "#E75480" : "none"} strokeWidth={2} />
            </button>
            {product.img && !imgError
              ? <img src={product.img} alt={product.name} loading="lazy" onError={() => setImgError(true)}
                  style={{ width: "100%", height: "100%", objectFit: "contain", padding: 8 }} />
              : <span style={{ fontSize: 64 }}>🐾</span>}
            {!inStock && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: "#fff", background: "rgba(0,0,0,0.6)", padding: "6px 18px", borderRadius: 20 }}>Tükendi</span>
              </div>
            )}
          </div>

          {/* Buy column */}
          <div className="yp-urun-buy">
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
              <button onClick={() => navigate(`${BASE}/magaza`)} style={{ background: "none", border: "none", cursor: "pointer", color: P, fontSize: 12, fontWeight: 600, padding: 0 }}>Mağaza</button>
              <span style={{ color: "#ccc", fontSize: 12 }}>›</span>
              <button onClick={() => navigate(`${BASE}${catSchema.listPath}`)} style={{ background: "none", border: "none", cursor: "pointer", color: P, fontSize: 12, fontWeight: 600, padding: 0 }}>{catSchema.listLabel}</button>
            </div>

            {product.brandName && (
              <div style={{ fontSize: 11, fontWeight: 800, color: P, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                {product.brandName}
              </div>
            )}
            <h1 className="yp-urun-title" style={{ fontSize: 22, fontWeight: 900, color: "#1a1a1a", lineHeight: 1.25, margin: "0 0 14px" }}>{product.name}</h1>

            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 14 }}>
              <span className="yp-urun-price" style={{ fontSize: 28, fontWeight: 900, color: P }}>
                ₺{Number(product.price).toLocaleString("tr-TR", { minimumFractionDigits: 0 })}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span style={{ fontSize: 16, color: "#bbb", textDecoration: "line-through", fontWeight: 600 }}>
                  ₺{Number(product.originalPrice).toLocaleString("tr-TR", { minimumFractionDigits: 0 })}
                </span>
              )}
            </div>

            <div style={{ display: "grid", gap: 8, marginBottom: 14, background: "#F9FAFB", borderRadius: 12, padding: "12px 14px", border: "1px solid #EFEFEF" }}>
              {showSktRow && (
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13 }}>
                  <span style={{ color: "#6B7280", fontWeight: 600 }}>S.K.T.</span>
                  <span style={{ color: "#111827", fontWeight: 700 }}>{product.skt?.trim() || "—"}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13 }}>
                <span style={{ color: "#6B7280", fontWeight: 600 }}>Barkod No</span>
                <span style={{ color: "#111827", fontWeight: 700, fontFamily: "ui-monospace, monospace" }}>{product.barcode?.trim() || "—"}</span>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              {inStock
                ? <span style={{ fontSize: 12, fontWeight: 700, color: "#059669", background: "#ECFDF5", borderRadius: 20, padding: "4px 12px" }}>✓ Stokta var</span>
                : <span style={{ fontSize: 12, fontWeight: 700, color: "#DC2626", background: "#FEF2F2", borderRadius: 20, padding: "4px 12px" }}>✗ Tükendi</span>}
            </div>

            {!inStock && (
              <YPStockAlert productId={product.id} productName={product.name} />
            )}

            {inStock && (
              <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #E5E7EB", borderRadius: 12, overflow: "hidden", background: "#fff" }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}
                    style={{ width: 40, height: 48, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#555" }}>
                    <Minus size={15} />
                  </button>
                  <span style={{ width: 36, textAlign: "center", fontSize: 15, fontWeight: 800, color: "#1a1a1a" }}>{qty}</span>
                  <button onClick={() => setQty(q => q + 1)}
                    style={{ width: 40, height: 48, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#555" }}>
                    <Plus size={15} />
                  </button>
                </div>
                <button className="yp-urun-cta" onClick={addToCart}
                  style={{ flex: 1, height: 48, borderRadius: 12, border: "none", background: added ? "#059669" : "#DC2626", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
                  {added ? "✓ Sepete Eklendi!" : "Sepete Ekle"}
                </button>
              </div>
            )}

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                { emoji: "💳", text: "Sadece Online Kart" },
                { emoji: "🚚", text: "Türkiye Geneli Kargo" },
                { emoji: "🔒", text: "SSL Güvenli Ödeme" },
              ].map(p => (
                <div key={p.text} style={{ display: "flex", alignItems: "center", gap: 5, background: PL, borderRadius: 20, padding: "6px 12px" }}>
                  <span style={{ fontSize: 13 }}>{p.emoji}</span>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: P }}>{p.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="yp-urun-body" style={{ padding: "20px 16px 0" }}>
          {/* 3 benefits */}
          {benefits.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a", marginBottom: 12 }}>
                {catSchema.showMamaBulCta ? "Neden bu mama?" : "Öne çıkan özellikler"}
              </h2>
              <div className="yp-urun-benefits" style={{ display: "grid", gap: 10 }}>
                {benefits.map((b, i) => (
                  <div key={b.title} style={{
                    display: "flex", gap: 12, alignItems: "flex-start",
                    background: "#fff", border: "1px solid #E8E0D4", borderRadius: 14, padding: "12px 14px",
                  }}>
                    <span style={{
                      width: 28, height: 28, borderRadius: "50%", background: PL, color: P,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 800, flexShrink: 0,
                    }}>{i + 1}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#1a1a1a" }}>{b.title}</div>
                      {b.desc && <div style={{ fontSize: 12.5, color: "#6B5A48", marginTop: 2, lineHeight: 1.4 }}>{b.desc}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mama Bul details */}
          {detailRows.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a", marginBottom: 8 }}>{catSchema.label}</h2>
              <p style={{ fontSize: 12, color: "#8A7E72", margin: "0 0 12px", lineHeight: 1.45 }}>
                {catSchema.showMamaBulCta ? "Mama Bul sorularına göre ürün profili" : "Bu kategori için ürün özellikleri"}
              </p>
              <div style={{ border: "1px solid #E5E7EB", borderRadius: 12, overflow: "hidden" }}>
                {detailRows.map((row, i) => (
                  <div key={row.label} style={{
                    display: "flex", justifyContent: "space-between", gap: 16,
                    padding: "10px 14px", background: i % 2 === 0 ? "#FAFAFA" : "#fff",
                    borderTop: i === 0 ? "none" : "1px solid #F3F4F6",
                  }}>
                    <span style={{ fontSize: 13, color: "#6B7280", fontWeight: 600, flexShrink: 0 }}>{row.label}</span>
                    <span style={{ fontSize: 13, color: "#111827", fontWeight: 700, textAlign: "right" }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {catSchema.showIngredients && (
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a", marginBottom: 10 }}>Ürün İçindekiler</h2>
            {ingredientsText ? (
              <p style={{ fontSize: 13.5, color: "#555", lineHeight: 1.7, margin: 0 }}>{ingredientsText}</p>
            ) : (
              <p style={{ margin: 0, color: "#888", fontSize: 13.5 }}>İçerik bilgisi paket üzerinde yer alır.</p>
            )}
          </div>
          )}

          {product.longDescription && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a", marginBottom: 10 }}>Ürün Hakkında</h2>
              <div style={{ fontSize: 13.5, color: "#555", lineHeight: 1.7 }}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.longDescription) }} />
            </div>
          )}

          {catSchema.showNutrition && na && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 14, fontWeight: 800, color: "#1a1a1a", marginBottom: 10 }}>Besin Analizi</h2>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <tbody>
                  {([
                    ["Ham Protein", na.protein],
                    ["Ham Yağ", na.fat],
                    ["Ham Selüloz", na.fiber],
                    ["Ham Kül", na.ash],
                    ["Nem", na.moisture],
                  ] as [string, number | undefined][])
                    .filter(([, v]) => v != null)
                    .map(([label, val], i) => (
                      <tr key={label} style={{ background: i % 2 === 0 ? "#F9FAFB" : "#fff" }}>
                        <td style={{ padding: "7px 12px", color: "#555" }}>{label}</td>
                        <td style={{ padding: "7px 12px", fontWeight: 700, color: "#1a1a1a", textAlign: "right" }}>{val}%</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          <YPProductReviews productId={productId} />

          {catSchema.showMamaBulCta && (
          <button
            type="button"
            onClick={() => navigate(`${BASE}/mama-bul`)}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
              gap: 12, padding: "14px 16px", borderRadius: 14, border: `1.5px solid ${P}`,
              background: PL, cursor: "pointer", fontFamily: "inherit", marginBottom: 24,
            }}
          >
            <span style={{ textAlign: "left" }}>
              <span style={{ display: "block", fontSize: 14, fontWeight: 800, color: P }}>Kararsız mısın? Mama Bul</span>
              <span style={{ display: "block", fontSize: 12, color: "#7A6A58", marginTop: 2 }}>
                Birkaç soruyla en uygun mamayı bul
              </span>
            </span>
            <ArrowRight size={18} color={P} />
          </button>
          )}

          {/* Also bought — managed in Admin → Birlikte Alınan */}
          {alsoBought.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a", margin: "0 0 12px" }}>
                Bu ürünü alanlar bu ürünleri de alıyor
              </h2>
              <div className="yp-urun-related-grid">
                {alsoBought.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => navigate(`${BASE}/urun/${p.id}/${slugify(p.name)}`)}
                    style={{
                      background: "#fff", border: "1px solid #E8E0D4", borderRadius: 12, padding: 0,
                      overflow: "hidden", cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                    }}
                  >
                    <div style={{ aspectRatio: "4/3", background: "#FAF8F4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {p.img
                        ? <img src={p.img} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "contain", padding: 6 }} />
                        : <span style={{ fontSize: 28 }}>🐾</span>}
                    </div>
                    <div style={{ padding: "8px 10px 10px" }}>
                      <div style={{
                        fontSize: 12, fontWeight: 650, color: "#2C2118", lineHeight: 1.3,
                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden", minHeight: 32,
                      }}>{p.name}</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: P, marginTop: 4 }}>
                        ₺{Number(p.price).toLocaleString("tr-TR")}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <YPRecentlyViewed excludeId={product.id} />
        </div>
      </div>

      {inStock && (
        <div className="yp-urun-back" style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #f0f0f0", padding: "12px 16px", zIndex: 200, display: "flex", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #E5E7EB", borderRadius: 12, overflow: "hidden", background: "#fff", flexShrink: 0 }}>
            <button onClick={() => setQty(q => Math.max(1, q - 1))}
              style={{ width: 36, height: 44, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Minus size={14} />
            </button>
            <span style={{ width: 28, textAlign: "center", fontSize: 14, fontWeight: 800 }}>{qty}</span>
            <button onClick={() => setQty(q => q + 1)}
              style={{ width: 36, height: 44, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Plus size={14} />
            </button>
          </div>
          <button onClick={addToCart}
            style={{ flex: 1, height: 44, borderRadius: 12, border: "none", background: added ? "#059669" : "#DC2626", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
            {added ? "✓ Eklendi!" : `Sepete Ekle — ₺${(product.price * qty).toLocaleString("tr-TR")}`}
          </button>
        </div>
      )}
    </YPLayout>
  );
}
