import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search, Package, Check, ShoppingCart } from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { useCart } from "@/contexts/CartContext";
import { searchArticles, searchPosts, POPULAR_SEARCHES } from "@/data/searchResults";
import { IS_YP } from "@/lib/store";

const P    = "#5D3A1A";
const BASE = IS_YP ? "" : "/yourpoodle";

type Tab = "tumü" | "urunler" | "rehber" | "club";

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
      onMouseEnter={e => { e.currentTarget.style.boxShadow="0 4px 12px rgba(93,58,26,0.10)"; e.currentTarget.style.transform="translateY(-1px)"; }}
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

/* ── Skeleton ─────────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div style={{ borderRadius:12, border:"1px solid #E5E7EB", background:"#fff", overflow:"hidden" }}>
      <div style={{ paddingTop:"100%", background:"#F3F4F6", animation:"ypa-shimmer 1.4s infinite" }} />
      <div style={{ padding:"10px 10px 12px" }}>
        <div style={{ height:12, background:"#F3F4F6", borderRadius:6, marginBottom:6, animation:"ypa-shimmer 1.4s infinite" }} />
        <div style={{ height:12, background:"#F3F4F6", borderRadius:6, width:"60%", marginBottom:10, animation:"ypa-shimmer 1.4s infinite" }} />
        <div style={{ height:36, background:"#F3F4F6", borderRadius:10, animation:"ypa-shimmer 1.4s infinite" }} />
      </div>
    </div>
  );
}

/* ════════════ Main Page ════════════ */
export default function YPAraPage() {
  const [, navigate] = useLocation();
  const q = new URLSearchParams(window.location.search).get("q") ?? "";
  const { updateQty } = useCart();

  const [tab, setTab] = useState<Tab>("tumü");
  const [toast, setToast] = useState({ message:"", visible:false });
  const toastTimer = useRef<ReturnType<typeof setTimeout>|null>(null);

  useEffect(() => { document.title = q ? `Arama: ${q} | YourPoodle` : "Arama | YourPoodle"; }, [q]);

  /* Reset tab to "tumü" whenever q changes */
  useEffect(() => { setTab("tumü"); }, [q]);

  const showToast = useCallback((msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message:msg, visible:true });
    toastTimer.current = setTimeout(() => setToast(t => ({...t, visible:false})), 2500);
  }, []);

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
  const posts    = useMemo(() => searchPosts(q), [q]);

  const totalCount = matchedProducts.length + articles.length + posts.length;

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "tumü",    label: "Tümü",    count: totalCount },
    { key: "urunler", label: "Ürünler", count: matchedProducts.length },
    { key: "rehber",  label: "Rehber",  count: articles.length },
    { key: "club",    label: "Club",    count: posts.length },
  ];

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
    <YPLayout activeLink={`${BASE}/magaza`} constrain={false}>
      <style>{`
        @keyframes ypa-shimmer { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
      <Toast message={toast.message} visible={toast.visible} />

      <div style={{ minHeight:"100vh", background:"#FAFAFA", paddingBottom:80 }}>
        <div style={{ maxWidth:900, margin:"0 auto", padding:"24px 16px 0" }}>

          <h1 style={{ fontSize:22, fontWeight:800, color:"#111827", margin:"0 0 4px" }}>
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
                  {t.label} ({isLoading && t.key !== "rehber" && t.key !== "club" ? "…" : t.count})
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
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                      {Array.from({length:4}).map((_,i) => <SkeletonCard key={i} />)}
                    </div>
                  ) : matchedProducts.length > 0 ? (
                    <>
                      <p style={{ fontSize:13, color:"#6B7280", margin:"0 0 12px" }}>
                        {matchedProducts.length} ürün bulundu
                      </p>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                        {matchedProducts.map((product: any) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            onNavigate={goProduct}
                            onAddToCart={handleAddToCart}
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

              {/* ── Club posts section ── */}
              {(tab === "tumü" || tab === "club") && posts.length > 0 && (
                <div style={{ marginBottom:32 }}>
                  {tab === "tumü" && (
                    <h2 style={{ fontSize:16, fontWeight:700, color:"#111827", margin:"0 0 14px" }}>
                      Club
                    </h2>
                  )}
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    {posts.map((p: any) => (
                      <div key={p.id} onClick={() => navigate(`${BASE}/club/gonderi/${p.id}`)}
                        style={{ background:"#fff", borderRadius:14, padding:"14px 18px",
                                 cursor:"pointer", boxShadow:"0 1px 6px rgba(0,0,0,0.05)" }}>
                        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                          <span style={{ fontSize:28 }}>{p.avatar}</span>
                          <div>
                            <p style={{ margin:0, fontWeight:700, fontSize:14, color:"#111827" }}>
                              @{p.username}
                            </p>
                            <p style={{ margin:0, fontSize:13, color:"#6B7280" }}>
                              {p.caption.slice(0, 80)}…
                            </p>
                          </div>
                        </div>
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

              {/* ── Club tab empty state ── */}
              {tab === "club" && posts.length === 0 && (
                <div style={{ textAlign:"center", padding:"48px 0", color:"#6B7280" }}>
                  <p style={{ fontSize:15 }}>"{q}" için club gönderisi bulunamadı.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </YPLayout>
  );
}
