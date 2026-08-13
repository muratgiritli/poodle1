import { useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { MOCK_CAMPAIGNS } from "@/data/campaigns";
import { IS_YP } from "@/lib/store";

const P = "#5D3A1A";
const BASE = IS_YP ? "" : "/yourpoodle";

interface CampaignProduct {
  id: number;
  product_id: number;
  item_type: string;
  name: string;
  price: number;
  original_price: number | null;
  img: string | null;
  stock: number;
  campaign_price?: number | null;
}

const INFO_BANNERS = [
  {
    id: "kargo",
    title: "299₺ Üzeri Ücretsiz Kargo",
    description: "Toplam sepet tutarı 299₺ ve üzerinde olan tüm siparişlerde kargo bedava.",
    badge: "Süresiz",
    badgeColor: "#6B7280",
    emoji: "🚚",
    bgColor: "#F5F3FF",
    cta: "Mağazayı Keşfet",
    ctaLink: `${BASE}/magaza`,
  },
  {
    id: "guven",
    title: "Güvenli Alışveriş",
    description: "256-bit SSL şifreleme ve iyzico güvencesiyle kapıda veya online ödeme.",
    badge: "Güvenli",
    badgeColor: "#10B981",
    emoji: "🔒",
    bgColor: "#F0FDF4",
    cta: "Detayları Gör",
    ctaLink: `${BASE}/guvenli-alisveris`,
  },
];

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function YPKampanyalarPage() {
  useEffect(() => { document.title = "Kampanyalar | YourPoodle"; }, []);
  const [, navigate] = useLocation();

  const { data: items = [], isLoading } = useQuery<CampaignProduct[]>({
    queryKey: ["/api/campaign-items"],
    queryFn: async () => {
      const r = await fetch("/api/campaign-items");
      if (!r.ok) return [];
      return r.json();
    },
    staleTime: 60_000,
  });

  const mainProducts = useMemo(
    () => items.filter(i => i.item_type === "main"),
    [items],
  );

  const staticFallback = mainProducts.length === 0 && !isLoading;

  return (
    <YPLayout constrain={false}>
      <div style={{ minHeight: "100vh", background: "#FAFAFA", paddingBottom: 48 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 0" }}>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: "#111827", margin: "0 0 6px" }}>Kampanyalar</h1>
          <p style={{ color: "#6B7280", fontSize: 15, margin: "0 0 32px" }}>Tüm güncel fırsat ve indirimler</p>

          {/* Static info banners */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16, marginBottom: 32 }}>
            {INFO_BANNERS.map(c => (
              <div key={c.id} style={{ background: c.bgColor, borderRadius: 20, padding: 24, border: "1.5px solid rgba(0,0,0,0.05)", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ fontSize: 40 }}>{c.emoji}</div>
                  <span style={{ padding: "4px 12px", borderRadius: 9999, background: c.badgeColor, color: "#fff", fontSize: 11, fontWeight: 700 }}>{c.badge}</span>
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: "0 0 8px" }}>{c.title}</h2>
                <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: "0 0 16px", flex: 1 }}>{c.description}</p>
                <button onClick={() => navigate(c.ctaLink)}
                  style={{ height: 44, borderRadius: 12, border: "none", background: P, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  {c.cta}
                </button>
              </div>
            ))}
          </div>

          {/* Campaign products from API */}
          {isLoading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 16 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ aspectRatio: "3/4", background: "#E5E7EB", borderRadius: 16, animation: "pulse 1.5s infinite" }} />
              ))}
            </div>
          ) : mainProducts.length > 0 ? (
            <>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: "0 0 16px" }}>Kampanyalı Ürünler</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 16 }}>
                {mainProducts.map(item => {
                  const orig = item.original_price ?? item.price;
                  const discounted = item.price;
                  const pct = orig > discounted ? Math.round((1 - discounted / orig) * 100) : 0;
                  return (
                    <div key={item.id} onClick={() => navigate(`${BASE}/urun/${item.product_id}/${slugify(item.name)}`)}
                      style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #F0F0F0", cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                      <div style={{ aspectRatio: "1", background: "#FAF7F0", position: "relative", overflow: "hidden" }}>
                        {item.img ? (
                          <img src={item.img} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 8 }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>🐾</div>
                        )}
                        {pct > 0 && (
                          <span style={{ position: "absolute", top: 8, left: 8, background: "#EF4444", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 9999 }}>
                            -%{pct}
                          </span>
                        )}
                      </div>
                      <div style={{ padding: "10px 12px 14px" }}>
                        <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 600, color: "#111827", lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.name}</p>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                          <span style={{ fontSize: 16, fontWeight: 800, color: P }}>{discounted.toLocaleString("tr-TR")}₺</span>
                          {orig > discounted && (
                            <span style={{ fontSize: 12, color: "#9CA3AF", textDecoration: "line-through" }}>{orig.toLocaleString("tr-TR")}₺</span>
                          )}
                        </div>
                        {item.stock <= 5 && item.stock > 0 && (
                          <p style={{ margin: "4px 0 0", fontSize: 11, color: "#EF4444", fontWeight: 600 }}>Son {item.stock} adet</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : staticFallback ? (
            <>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: "0 0 16px" }}>Diğer Kampanyalar</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
                {MOCK_CAMPAIGNS.map(c => (
                  <div key={c.id} style={{ background: c.bgColor, borderRadius: 20, padding: 24, border: "1.5px solid rgba(0,0,0,0.05)", display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                      <div style={{ fontSize: 40 }}>{c.emoji}</div>
                      <span style={{ padding: "4px 12px", borderRadius: 9999, background: c.badgeColor, color: "#fff", fontSize: 11, fontWeight: 700 }}>{c.badge}</span>
                    </div>
                    <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: "0 0 8px" }}>{c.title}</h2>
                    <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: "0 0 16px", flex: 1 }}>{c.description}</p>
                    {c.expiry !== "—" && (
                      <p style={{ fontSize: 12, color: "#9CA3AF", margin: "0 0 14px" }}>Son geçerlilik: {c.expiry}</p>
                    )}
                    <button onClick={() => navigate(c.ctaLink.startsWith("/") ? `${BASE}${c.ctaLink}` : c.ctaLink)}
                      style={{ height: 44, borderRadius: 12, border: "none", background: P, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                      {c.cta}
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#9CA3AF" }}>
              <p style={{ margin: 0, fontSize: 15 }}>Şu an aktif kampanya ürünü bulunmuyor.</p>
            </div>
          )}
        </div>
      </div>
    </YPLayout>
  );
}
