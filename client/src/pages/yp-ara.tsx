import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search, Package, Check, ChevronLeft } from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { useCart } from "@/contexts/CartContext";
import { searchArticles, POPULAR_SEARCHES } from "@/data/searchResults";
import { IS_YP } from "@/lib/store";
import { goBack } from "@/lib/goBack";

const P    = "#5D3A1A";
const GB   = "#E8E0D4";
const BASE = IS_YP ? "" : "/yourpoodle";

type Tab = "tumü" | "urunler" | "rehber";

/* ── helpers ─────────────────────────────────────────────────────── */
function slugify(str: string) {
  return str.toLowerCase()
    .replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s")
    .replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c")
    .replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
}

function fmtPrice(n: number) {
  return n.toLocaleString("tr-TR") + " TL";
}

/* ── Product Card ─────────────────────────────────────────────────── */
function ProductCard({
  product,
  onNavigate,
}: {
  product: any;
  onNavigate: (id: number, name: string) => void;
}) {
  const { updateQty, basket } = useCart();
  const [added, setAdded] = useState(false);
  const sid = String(product.id);
  const inCart = (basket[sid] || 0) > 0;
  const outOfStock = !product.stock || product.stock <= 0;
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

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
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "contain", objectPosition: "center", padding: 10, boxSizing: "border-box",
            }} />
        ) : (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Package size={36} color="#D1C4B0" strokeWidth={1.5} />
          </div>
        )}
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

/* ── Skeleton ─────────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div style={{ borderRadius: 16, background: "#EDE7DE", aspectRatio: "0.72", animation: "ypa-shimmer 1.4s infinite" }} />
  );
}

/* ════════════ Main Page ════════════ */
export default function YPAraPage() {
  const [, navigate] = useLocation();
  const q = new URLSearchParams(window.location.search).get("q") ?? "";

  const [tab, setTab] = useState<Tab>("tumü");

  useEffect(() => { document.title = q ? `Arama: ${q} | YourPoodle` : "Arama | YourPoodle"; }, [q]);

  /* Reset tab to "tumü" whenever q changes */
  useEffect(() => { setTab("tumü"); }, [q]);

  useEffect(() => {
    if (!q || q.trim().length < 2) return;
    import("@/lib/yp-analytics").then(({ track }) => {
      track("search", { query: q.trim().slice(0, 120) });
    }).catch(() => {});
  }, [q]);

  /* Fetch ALL YP products (no subcategory filter) */
  const { data: rawProducts = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/yp-products"],
    queryFn: async () => {
      const res = await fetch("/api/yp-products");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  /* Client-side filter by q */
  const matchedProducts = useMemo(() => {
    if (!q) return [];
    const lq = q.toLowerCase();
    return rawProducts.filter((p: any) =>
      (p.name || "").toLowerCase().includes(lq) ||
      (p.brandName || "").toLowerCase().includes(lq) ||
      (p.barcode || "").includes(lq)
    );
  }, [rawProducts, q]);

  /* Static article/post search (kept as-is) */
  const articles = useMemo(() => searchArticles(q), [q]);

  const totalCount = matchedProducts.length + articles.length;

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "tumü",    label: "Tümü",    count: totalCount },
    { key: "urunler", label: "Ürünler", count: matchedProducts.length },
    { key: "rehber",  label: "Rehber",  count: articles.length },
  ];

  const goProduct = useCallback((id: number, name: string) => {
    navigate(`${BASE}/urun/${id}/${slugify(name)}`);
  }, [navigate]);

  return (
    <YPLayout activeLink={`${BASE}/magaza`} constrain={false} hideFooter>
      <style>{`
        @keyframes ypa-shimmer { 0%,100%{opacity:1} 50%{opacity:.45} }
        @media (min-width: 768px) {
          .ypa-wrap { max-width: 1180px !important; padding: 32px 28px 80px !important; }
          .ypa-grid { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; gap: 18px !important; }
        }
        @media (min-width: 1100px) {
          .ypa-grid { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; gap: 20px !important; }
        }
      `}</style>
      <div style={{ minHeight:"70vh", background:"#FAF8F4", paddingBottom:80 }}>
        <div className="ypa-wrap" style={{ maxWidth:1100, margin:"0 auto", padding:"20px 16px 110px" }}>

          <button
            type="button"
            onClick={() => goBack(navigate, `${BASE}/magaza`)}
            aria-label="Mağazaya dön"
            style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              background: "none", border: "none", cursor: "pointer",
              color: P, fontSize: 13, fontWeight: 700, padding: 0, marginBottom: 10,
              fontFamily: "inherit",
            }}
          >
            <ChevronLeft size={16} /> Mağaza
          </button>

          <h1 style={{ fontSize:26, fontWeight:800, color:"#2C2118", margin:"0 0 4px", letterSpacing:"-0.02em" }}>
            Arama Sonuçları
          </h1>
          {q && (
            <p style={{ color:"#6B7280", fontSize:14, margin:"0 0 20px" }}>
              "{q}" için {isLoading ? "…" : totalCount} sonuç bulundu
            </p>
          )}

          {/* Filter tabs (only show when there's a query) */}
          {q && (
            <div style={{ display:"flex", gap:8, marginBottom:20, overflowX:"auto", paddingBottom:4 }}>
              {tabs.map(t => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  style={{
                    flexShrink:0, padding:"8px 18px", borderRadius:9999,
                    border:"1.5px solid", borderColor: tab===t.key ? P : "#E5E7EB",
                    background: tab===t.key ? "#F5F0E6" : "#fff",
                    color: tab===t.key ? P : "#6B7280",
                    fontSize:13, fontWeight: tab===t.key ? 700 : 500,
                    cursor:"pointer", fontFamily:"inherit",
                  }}>
                  {t.label} ({isLoading && t.key !== "rehber" ? "…" : t.count})
                </button>
              ))}
            </div>
          )}

          {/* No query — show popular searches */}
          {!q ? (
            <div style={{ textAlign:"center", padding:"48px 0" }}>
              <Search size={48} color="#D1D5DB" style={{ marginBottom:16 }} />
              <p style={{ color:"#6B7280", fontSize:15 }}>Arama yapmak için bir kelime girin</p>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center", marginTop:20 }}>
                {POPULAR_SEARCHES.map(s => (
                  <button key={s} onClick={() => navigate(`${BASE}/ara?q=${encodeURIComponent(s)}`)}
                    style={{ padding:"8px 16px", borderRadius:9999, border:"1.5px solid #E5E7EB",
                             background:"#fff", color:"#374151", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

          ) : (
            <>
              {/* ── Products section ── */}
              {(tab === "tumü" || tab === "urunler") && (
                <div style={{ marginBottom:32 }}>
                  {tab === "tumü" && matchedProducts.length > 0 && (
                    <h2 style={{ fontSize:16, fontWeight:700, color:"#111827", margin:"0 0 14px" }}>
                      Ürünler
                    </h2>
                  )}

                  {isLoading ? (
                    <div className="ypa-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                      {Array.from({length:4}).map((_,i) => <SkeletonCard key={i} />)}
                    </div>
                  ) : matchedProducts.length > 0 ? (
                    <>
                      <p style={{ fontSize:13, color:"#6B7280", margin:"0 0 12px" }}>
                        {matchedProducts.length} ürün bulundu
                      </p>
                      <div className="ypa-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                        {matchedProducts.map((product: any) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            onNavigate={goProduct}
                          />
                        ))}
                      </div>
                    </>
                  ) : tab === "urunler" ? (
                    <div style={{ textAlign:"center", padding:"48px 0" }}>
                      <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
                      <p style={{ fontSize:15, fontWeight:600, color:"#374151", marginBottom:4 }}>
                        Sonuç bulunamadı
                      </p>
                      <p style={{ fontSize:13, color:"#6B7280", marginBottom:16 }}>
                        "{q}" ile eşleşen ürün bulunamadı. Farklı bir arama deneyin.
                      </p>
                      <button
                        onClick={() => navigate(`${BASE}/magaza`)}
                        style={{ background:P, color:"#fff", border:"none", borderRadius:10,
                                 padding:"10px 24px", fontSize:14, fontWeight:600,
                                 cursor:"pointer", fontFamily:"inherit" }}>
                        Mağazaya Dön
                      </button>
                    </div>
                  ) : null}
                </div>
              )}

              {/* ── Articles section ── */}
              {(tab === "tumü" || tab === "rehber") && articles.length > 0 && (
                <div style={{ marginBottom:32 }}>
                  {tab === "tumü" && (
                    <h2 style={{ fontSize:16, fontWeight:700, color:"#111827", margin:"0 0 14px" }}>
                      Rehber
                    </h2>
                  )}
                  <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                    {articles.map((a: any) => (
                      <div key={a.slug} onClick={() => navigate(`${BASE}/rehber/${a.category}/${a.slug}`)}
                        style={{ background:"#fff", borderRadius:14, padding:"16px 18px",
                                 cursor:"pointer", boxShadow:"0 1px 6px rgba(0,0,0,0.05)" }}>
                        <span style={{ fontSize:11, fontWeight:700, color:P, background:"#F5F0E6",
                                       padding:"2px 8px", borderRadius:9999 }}>
                          {a.categoryLabel}
                        </span>
                        <p style={{ margin:"8px 0 4px", fontWeight:700, color:"#111827", fontSize:15 }}>
                          {a.title}
                        </p>
                        <p style={{ margin:0, fontSize:13, color:"#6B7280" }}>{a.excerpt}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── All-tabs empty state ── */}
              {!isLoading && totalCount === 0 && tab === "tumü" && (
                <div style={{ textAlign:"center", padding:"48px 0" }}>
                  <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
                  <p style={{ fontSize:15, fontWeight:600, color:"#374151", marginBottom:4 }}>
                    Sonuç bulunamadı
                  </p>
                  <p style={{ fontSize:13, color:"#6B7280", marginBottom:16 }}>
                    "{q}" için hiçbir sonuç bulunamadı. Farklı bir arama deneyin.
                  </p>
                  <button
                    onClick={() => navigate(`${BASE}/magaza`)}
                    style={{ background:P, color:"#fff", border:"none", borderRadius:10,
                             padding:"10px 24px", fontSize:14, fontWeight:600,
                             cursor:"pointer", fontFamily:"inherit" }}>
                    Mağazaya Dön
                  </button>
                </div>
              )}

              {/* ── Rehber tab empty state ── */}
              {tab === "rehber" && articles.length === 0 && (
                <div style={{ textAlign:"center", padding:"48px 0", color:"#6B7280" }}>
                  <p style={{ fontSize:15 }}>"{q}" için rehber makalesi bulunamadı.</p>
                </div>
              )}

            </>
          )}
        </div>
      </div>
    </YPLayout>
  );
}
