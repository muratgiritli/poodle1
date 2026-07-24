import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { Search } from "lucide-react";
import { searchProducts, searchArticles, searchPosts, POPULAR_SEARCHES } from "@/data/searchResults";
import { IS_YP } from "@/lib/store";

const P = "#7022C4";
const BASE = IS_YP ? "" : "/yourpoodle";
type Tab = "tumü" | "urunler" | "rehber" | "club";

export default function YPAraPage() {
  const [, navigate] = useLocation();
  const q = new URLSearchParams(window.location.search).get("q") ?? "";

  const [tab, setTab] = useState<Tab>("tumü");
  const products = searchProducts(q);
  const articles = searchArticles(q);
  const posts = searchPosts(q);
  const totalCount = products.length + articles.length + posts.length;

  useEffect(() => { document.title = q ? `Arama: ${q} | YourPoodle` : "Arama | YourPoodle"; }, [q]);

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "tumü", label: "Tümü", count: totalCount },
    { key: "urunler", label: "Ürünler", count: products.length },
    { key: "rehber", label: "Rehber", count: articles.length },
    { key: "club", label: "Club", count: posts.length },
  ];

  return (
    <YPLayout activeLink={`${BASE}/magaza`} constrain={false}>
      <div style={{ minHeight: "100vh", background: "#FAFAFA", paddingBottom: 48 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px 0" }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: "0 0 4px" }}>Arama Sonuçları</h1>
          {q && <p style={{ color: "#6B7280", fontSize: 14, margin: "0 0 20px" }}>"{q}" için {totalCount} sonuç bulundu</p>}

          {/* Filter tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24, overflowX: "auto", paddingBottom: 4 }}>
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                style={{ flexShrink: 0, padding: "8px 18px", borderRadius: 9999, border: "1.5px solid", borderColor: tab === t.key ? P : "#E5E7EB", background: tab === t.key ? "#F5F0FF" : "#fff", color: tab === t.key ? P : "#6B7280", fontSize: 13, fontWeight: tab === t.key ? 700 : 500, cursor: "pointer", fontFamily: "inherit" }}>
                {t.label} ({t.count})
              </button>
            ))}
          </div>

          {!q ? (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <Search size={48} color="#D1D5DB" style={{ marginBottom: 16 }} />
              <p style={{ color: "#6B7280", fontSize: 15 }}>Arama yapmak için bir kelime girin</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 20 }}>
                {POPULAR_SEARCHES.map(s => (
                  <button key={s} onClick={() => navigate(`${BASE}/ara?q=${encodeURIComponent(s)}`)}
                    style={{ padding: "8px 16px", borderRadius: 9999, border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Products */}
              {(tab === "tumü" || tab === "urunler") && products.length > 0 && (
                <div style={{ marginBottom: 32 }}>
                  {tab === "tumü" && <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>Ürünler</h2>}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 16 }}>
                    {products.map(p => (
                      <div key={p.id} onClick={() => navigate(`${BASE}/urun/${p.id}`)}
                        style={{ background: "#fff", borderRadius: 14, overflow: "hidden", cursor: "pointer", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
                        <div style={{ height: 140, background: "#F9F5FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.currentTarget as any).style.display = "none"; }} />
                        </div>
                        <div style={{ padding: "12px 14px" }}>
                          <p style={{ margin: "0 0 6px", fontSize: 13, color: "#374151", lineHeight: 1.4 }}>{p.name}</p>
                          {p.originalPrice && <span style={{ fontSize: 11, color: "#9CA3AF", textDecoration: "line-through", marginRight: 4 }}>{p.originalPrice.toLocaleString("tr-TR")}₺</span>}
                          <span style={{ fontWeight: 800, color: P }}>{p.price.toLocaleString("tr-TR")}₺</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Articles */}
              {(tab === "tumü" || tab === "rehber") && articles.length > 0 && (
                <div style={{ marginBottom: 32 }}>
                  {tab === "tumü" && <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>Rehber</h2>}
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {articles.map(a => (
                      <div key={a.slug} onClick={() => navigate(`${BASE}/rehber/${a.category}/${a.slug}`)}
                        style={{ background: "#fff", borderRadius: 14, padding: "16px 18px", cursor: "pointer", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: P, background: "#F5F0FF", padding: "2px 8px", borderRadius: 9999 }}>{a.categoryLabel}</span>
                        <p style={{ margin: "8px 0 4px", fontWeight: 700, color: "#111827", fontSize: 15 }}>{a.title}</p>
                        <p style={{ margin: 0, fontSize: 13, color: "#6B7280" }}>{a.excerpt}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Posts */}
              {(tab === "tumü" || tab === "club") && posts.length > 0 && (
                <div>
                  {tab === "tumü" && <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>Club</h2>}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {posts.map(p => (
                      <div key={p.id} onClick={() => navigate(`${BASE}/club/gonderi/${p.id}`)}
                        style={{ background: "#fff", borderRadius: 14, padding: "14px 18px", cursor: "pointer", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          <span style={{ fontSize: 28 }}>{p.avatar}</span>
                          <div>
                            <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#111827" }}>@{p.username}</p>
                            <p style={{ margin: 0, fontSize: 13, color: "#6B7280" }}>{p.caption.slice(0, 80)}…</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {totalCount === 0 && (
                <div style={{ textAlign: "center", padding: "48px 0", color: "#6B7280" }}>
                  <p style={{ fontSize: 15 }}>"{q}" için sonuç bulunamadı.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </YPLayout>
  );
}
