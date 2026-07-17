import { useState, useEffect, useCallback } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ShoppingCart, Heart, Plus, Minus, Share2 } from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";

/* ─── Types ─────────────────────────────────────────── */
interface MamaMetadata {
  proteinType?: string;
  grainFree?: boolean;
  breedSize?: string;
  budgetTier?: string;
  allergens?: string[];
  specialNeeds?: string[];
  nutritionalAnalysis?: { protein?: number; fat?: number; fiber?: number; ash?: number; moisture?: number };
  dailyPortionGuide?: string;
}
interface Product {
  id: number; name: string; price: number; originalPrice?: number;
  img?: string; stock: number; isActive: boolean;
  mamaType?: string; subcategory?: string; brandName?: string; brandSlug?: string;
  animal?: string; barcode?: string; longDescription?: string;
  mamaMetadata?: MamaMetadata | null;
}
interface CartItem { id: number; name: string; price: number; img?: string; qty: number; }

const LS_CART = "yp_cart_items";

function loadCart(): CartItem[] {
  try { return JSON.parse(localStorage.getItem(LS_CART) || "[]"); } catch { return []; }
}
function saveCart(items: CartItem[]) {
  try { localStorage.setItem(LS_CART, JSON.stringify(items)); } catch {}
}

/* ─── Component ─────────────────────────────────────── */
export default function YPUrunPage() {
  const params = useParams<{ id: string; slug?: string }>();
  const [, navigate] = useLocation();
  const productId = Number(params.id);

  const [cart, setCart] = useState<CartItem[]>(loadCart);
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => { saveCart(cart); }, [cart]);

  /* Fetch all YP products (shared cache with mağaza page) */
  const { data: allProducts = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/yp-products"],
    staleTime: 5 * 60 * 1000,
  });

  const product = allProducts.find(p => p.id === productId);

  /* SEO */
  useEffect(() => {
    if (!product) return;
    document.title = `${product.name} | YourPoodle Mağaza`;
    const setMeta = (attr: string, key: string, val: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
      el.content = val;
    };
    setMeta("name", "description", `${product.name} — YourPoodle Mağaza'da en uygun fiyatla. Toy Poodle sahipleri için özenle seçilmiş ürün.`);
    setMeta("property", "og:title", product.name);
    setMeta("property", "og:image", product.img || "");
    setMeta("property", "og:type", "product");
  }, [product]);

  const addToCart = useCallback(() => {
    if (!product) return;
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id);
      if (ex) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { id: product.id, name: product.name, price: product.price, img: product.img, qty }];
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }, [product, qty]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const inStock = product ? (product.stock || 0) > 0 : false;
  const discount = product?.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  /* ─── Loading / not found ─── */
  if (isLoading) {
    return (
      <YPLayout>
        <div style={{ padding: "32px 20px", maxWidth: 600, margin: "0 auto" }}>
          {[200, 120, 80, 160, 100].map((w, i) => (
            <div key={i} style={{ height: i === 0 ? 320 : 20, borderRadius: 12, background: "#e8e8e8", marginBottom: 16, width: `${w * 3}px`, maxWidth: "100%", animation: "pulse 1.5s ease-in-out infinite" }} />
          ))}
        </div>
      </YPLayout>
    );
  }

  if (!product) {
    return (
      <YPLayout>
        <div style={{ padding: "64px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a", marginBottom: 8 }}>Ürün bulunamadı</h1>
          <p style={{ fontSize: 14, color: "#888", marginBottom: 24 }}>Bu ürün mevcut değil ya da kaldırılmış olabilir.</p>
          <button onClick={() => navigate("/yourpoodle/magaza")}
            style={{ padding: "12px 28px", borderRadius: 20, background: "#7C3AFF", border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            Mağazaya Dön
          </button>
        </div>
      </YPLayout>
    );
  }

  return (
    <YPLayout>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .yp-urun-img-wrap { background: #F0ECFF; }
        @media (min-width: 768px) {
          .yp-urun-layout { display: grid !important; grid-template-columns: 1fr 1fr; gap: 40px; max-width: 960px; margin: 0 auto; padding: 32px 24px; }
          .yp-urun-img-wrap { border-radius: 20px; aspect-ratio: 1/1; }
          .yp-urun-back { display: none !important; }
        }
      `}</style>

      {/* ── Mobile top bar ── */}
      <div className="yp-urun-back" style={{ background: "#fff", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f0f0f0", position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={() => navigate("/yourpoodle/magaza")}
          style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: "#7C3AFF", fontSize: 13, fontWeight: 700, padding: 0 }}>
          <ChevronLeft size={16} /> Mağaza
        </button>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => { if (navigator.share) navigator.share({ title: product.name, url: window.location.href }); }}
            style={{ width: 36, height: 36, borderRadius: "50%", background: "#f5f5f5", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Share2 size={15} color="#555" />
          </button>
          <button onClick={() => navigate("/yourpoodle/magaza")} style={{ position: "relative", width: 36, height: 36, borderRadius: "50%", background: "#f5f5f5", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ShoppingCart size={15} color="#555" />
            {cartCount > 0 && (
              <span style={{ position: "absolute", top: 4, right: 4, width: 14, height: 14, borderRadius: "50%", background: "#7C3AFF", color: "#fff", fontSize: 8, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>
            )}
          </button>
        </div>
      </div>

      <div className="yp-urun-layout" style={{ padding: "0 0 120px" }}>

        {/* ── Product image ── */}
        <div className="yp-urun-img-wrap" style={{ position: "relative", aspectRatio: "1/1", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          {discount > 0 && (
            <div style={{ position: "absolute", top: 12, left: 12, background: "#EF4444", borderRadius: 8, padding: "4px 10px", zIndex: 2 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>%{discount} İNDİRİM</span>
            </div>
          )}
          <button onClick={() => setWishlisted(w => !w)}
            style={{ position: "absolute", top: 12, right: 12, width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
            <Heart size={17} color={wishlisted ? "#E75480" : "#bbb"} fill={wishlisted ? "#E75480" : "none"} strokeWidth={2} />
          </button>
          {product.img && !imgError
            ? <img src={product.img} alt={product.name} onError={() => setImgError(true)}
                style={{ width: "100%", height: "100%", objectFit: "contain", padding: 16 }} />
            : <span style={{ fontSize: 80 }}>🐾</span>
          }
          {!inStock && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: "#fff", background: "rgba(0,0,0,0.6)", padding: "6px 18px", borderRadius: 20 }}>Tükendi</span>
            </div>
          )}
        </div>

        {/* ── Product info ── */}
        <div style={{ padding: "20px 16px 0" }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
            <button onClick={() => navigate("/yourpoodle")} style={{ background: "none", border: "none", cursor: "pointer", color: "#7C3AFF", fontSize: 12, fontWeight: 600, padding: 0 }}>Ana Sayfa</button>
            <span style={{ color: "#ccc", fontSize: 12 }}>›</span>
            <button onClick={() => navigate("/yourpoodle/magaza")} style={{ background: "none", border: "none", cursor: "pointer", color: "#7C3AFF", fontSize: 12, fontWeight: 600, padding: 0 }}>Mağaza</button>
            <span style={{ color: "#ccc", fontSize: 12 }}>›</span>
            <span style={{ fontSize: 12, color: "#888", fontWeight: 600 }}>{product.name}</span>
          </div>

          {/* Brand */}
          {product.brandName && (
            <div style={{ fontSize: 11, fontWeight: 800, color: "#7C3AFF", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
              {product.brandName}
            </div>
          )}

          {/* Name */}
          <h1 style={{ fontSize: 20, fontWeight: 900, color: "#1a1a1a", lineHeight: 1.3, marginBottom: 16 }}>{product.name}</h1>

          {/* Price */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 20 }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: "#7C3AFF" }}>
              ₺{Number(product.price).toLocaleString("tr-TR", { minimumFractionDigits: 0 })}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span style={{ fontSize: 16, color: "#bbb", textDecoration: "line-through", fontWeight: 600 }}>
                ₺{Number(product.originalPrice).toLocaleString("tr-TR", { minimumFractionDigits: 0 })}
              </span>
            )}
          </div>

          {/* Stock badge */}
          <div style={{ marginBottom: 20 }}>
            {inStock
              ? <span style={{ fontSize: 12, fontWeight: 700, color: "#059669", background: "#ECFDF5", borderRadius: 20, padding: "4px 12px" }}>✓ Stokta var</span>
              : <span style={{ fontSize: 12, fontWeight: 700, color: "#DC2626", background: "#FEF2F2", borderRadius: 20, padding: "4px 12px" }}>✗ Tükendi</span>
            }
          </div>

          {/* Qty + Add to cart */}
          {inStock && (
            <div style={{ display: "flex", gap: 10, marginBottom: 20, alignItems: "center" }}>
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
              <button onClick={addToCart}
                style={{ flex: 1, height: 48, borderRadius: 12, border: "none", background: added ? "#059669" : "linear-gradient(135deg,#7C3AFF,#A855F7)", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit" }}>
                {added ? "✓ Sepete Eklendi!" : "Sepete Ekle"}
              </button>
            </div>
          )}

          {/* Info pills */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
            {[
              { emoji: "🚚", text: "Hızlı Kargo" },
              { emoji: "🔒", text: "Güvenli Ödeme" },
              { emoji: "↩️", text: "14 Gün İade" },
            ].map(p => (
              <div key={p.text} style={{ display: "flex", alignItems: "center", gap: 5, background: "#F5F3FF", borderRadius: 20, padding: "6px 12px" }}>
                <span style={{ fontSize: 13 }}>{p.emoji}</span>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: "#7C3AFF" }}>{p.text}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          {product.longDescription && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a", marginBottom: 10 }}>Ürün Hakkında</h2>
              <div className="prose-product" style={{ fontSize: 13.5, color: "#555", lineHeight: 1.7 }}
                dangerouslySetInnerHTML={{ __html: product.longDescription }} />
            </div>
          )}

          {/* Bu mama kimler için? */}
          {product.mamaMetadata && (
            <div style={{ marginBottom: 24, background: "#F5F0FF", borderRadius: 14, padding: "16px 18px" }}>
              <h2 style={{ fontSize: 14, fontWeight: 800, color: "#7C3AFF", marginBottom: 12 }}>Bu mama kimler için?</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                {product.mamaMetadata.breedSize && (
                  <span style={{ background: "#EDE8FF", color: "#7C3AFF", fontSize: 12, fontWeight: 700, borderRadius: 20, padding: "4px 12px" }}>
                    🐩 {product.mamaMetadata.breedSize === "toy" ? "Toy Poodle" : product.mamaMetadata.breedSize === "miniature" ? "Minyatür Poodle" : "Standart Poodle"}
                  </span>
                )}
                {product.mamaType && (
                  <span style={{ background: "#EDE8FF", color: "#7C3AFF", fontSize: 12, fontWeight: 700, borderRadius: 20, padding: "4px 12px" }}>
                    {product.mamaType === "yavru" ? "🌱 Yavru (0–12 ay)" : product.mamaType === "yasli" ? "❤️ Yaşlı (7+ yaş)" : "💪 Yetişkin (1–7 yaş)"}
                  </span>
                )}
                {product.mamaMetadata.grainFree === true && (
                  <span style={{ background: "#F0FDF4", color: "#16A34A", fontSize: 12, fontWeight: 700, borderRadius: 20, padding: "4px 12px" }}>
                    🌿 Tahılsız
                  </span>
                )}
                {product.mamaMetadata.budgetTier && (
                  <span style={{ background: "#FFF7ED", color: "#C2410C", fontSize: 12, fontWeight: 700, borderRadius: 20, padding: "4px 12px" }}>
                    {product.mamaMetadata.budgetTier === "premium" ? "⭐ Premium" : product.mamaMetadata.budgetTier === "orta" ? "💳 Orta Segment" : "💰 Ekonomik"}
                  </span>
                )}
              </div>
              {product.mamaMetadata.specialNeeds && product.mamaMetadata.specialNeeds.length > 0 && (
                <div style={{ fontSize: 12.5, color: "#555", lineHeight: 1.6 }}>
                  <span style={{ fontWeight: 700, color: "#7C3AFF" }}>Özellikler: </span>
                  {product.mamaMetadata.specialNeeds.map((n: string) =>
                    n.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())
                  ).join(", ")}
                </div>
              )}
              {product.mamaMetadata.dailyPortionGuide && (
                <div style={{ marginTop: 8, fontSize: 12.5, color: "#555" }}>
                  <span style={{ fontWeight: 700, color: "#7C3AFF" }}>Günlük Porsiyon: </span>
                  {product.mamaMetadata.dailyPortionGuide}
                </div>
              )}
            </div>
          )}

          {/* Nutritional analysis */}
          {product.mamaMetadata?.nutritionalAnalysis && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 14, fontWeight: 800, color: "#1a1a1a", marginBottom: 10 }}>Besin Analizi (kuru madde bazında)</h2>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <tbody>
                  {[
                    ["Ham Protein", `${product.mamaMetadata.nutritionalAnalysis.protein ?? "—"}%`],
                    ["Ham Yağ", `${product.mamaMetadata.nutritionalAnalysis.fat ?? "—"}%`],
                    ["Ham Selüloz", `${product.mamaMetadata.nutritionalAnalysis.fiber ?? "—"}%`],
                    ["Ham Kül", `${product.mamaMetadata.nutritionalAnalysis.ash ?? "—"}%`],
                    ["Nem", `${product.mamaMetadata.nutritionalAnalysis.moisture ?? "—"}%`],
                  ].map(([label, val], i) => (
                    <tr key={label} style={{ background: i % 2 === 0 ? "#F9FAFB" : "#fff" }}>
                      <td style={{ padding: "7px 12px", color: "#555", borderRadius: i === 0 ? "8px 0 0 0" : "0" }}>{label}</td>
                      <td style={{ padding: "7px 12px", fontWeight: 700, color: "#1a1a1a", textAlign: "right" }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Category / type */}
          {(product.subcategory || product.mamaType) && (
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: "#888", background: "#F3F4F6", borderRadius: 20, padding: "4px 12px" }}>
                {product.subcategory || product.mamaType}
              </span>
            </div>
          )}

          {/* Barcode */}
          {product.barcode && (
            <div style={{ fontSize: 11, color: "#bbb", marginTop: 8 }}>Barkod: {product.barcode}</div>
          )}
        </div>
      </div>

      {/* ── Mobile sticky CTA ── */}
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
            style={{ flex: 1, height: 44, borderRadius: 12, border: "none", background: added ? "#059669" : "linear-gradient(135deg,#7C3AFF,#A855F7)", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", transition: "background 0.2s", fontFamily: "inherit" }}>
            {added ? "✓ Eklendi!" : `Sepete Ekle — ₺${(product.price * qty).toLocaleString("tr-TR")}`}
          </button>
        </div>
      )}
    </YPLayout>
  );
}
