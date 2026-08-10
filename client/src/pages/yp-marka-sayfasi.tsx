import { useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { ChevronRight } from "lucide-react";
import { MOCK_SEARCH_PRODUCTS } from "@/data/searchResults";
import { IS_YP } from "@/lib/store";

const P = "#5D3A1A";
const BASE = IS_YP ? "" : "/yourpoodle";

const BRAND_MAP: Record<string, { name: string; desc: string; logo: string }> = {
  "royal-canin": { name: "Royal Canin", desc: "Irka özgü beslenme çözümleriyle 50 yılı aşkın deneyim. Toy Poodle sahipleri için özel formüller.", logo: "👑" },
  "reflex-plus": { name: "Reflex Plus", desc: "Türk yapımı, yüksek protein içerikli premium köpek mamaları.", logo: "⚡" },
  "trixie": { name: "Trixie", desc: "Alman kalitesiyle köpek aksesuarları ve oyuncakları.", logo: "🎾" },
  "hills": { name: "Hill's Science Plan", desc: "Veteriner tarafından önerilen bilimsel beslenme ürünleri.", logo: "🔬" },
};

export default function YPMarkaSayfasiPage() {
  const [, params] = useRoute("/magaza/marka/:slug");
  const [, navigate] = useLocation();
  const slug = params?.slug ?? "royal-canin";
  const brand = BRAND_MAP[slug] ?? { name: slug.replace(/-/g, " "), desc: "", logo: "🏷️" };

  useEffect(() => { document.title = `${brand.name} | YourPoodle`; }, [brand.name]);

  const products = MOCK_SEARCH_PRODUCTS.filter((_, i) => i < 4);

  return (
    <YPLayout activeLink={`${BASE}/magaza`} constrain={false}>
      <div style={{ minHeight: "100vh", background: "#FAFAFA", paddingBottom: 48 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 20px 0" }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 20, fontSize: 12, color: "#9CA3AF" }}>
            <button onClick={() => navigate(`${BASE}/magaza`)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: 0, fontFamily: "inherit", fontSize: 12 }}>Mağaza</button>
            <ChevronRight size={12} />
            <span style={{ color: "#374151", fontWeight: 600 }}>{brand.name}</span>
          </div>

          {/* Brand header */}
          <div style={{ background: "linear-gradient(135deg,#F5F0E6,#EDE5D8)", borderRadius: 18, padding: "28px 24px", marginBottom: 28, display: "flex", gap: 20, alignItems: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: 16, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, flexShrink: 0, boxShadow: "0 2px 12px rgba(93,58,26,0.12)" }}>
              {brand.logo}
            </div>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: "#111827", margin: "0 0 6px" }}>{brand.name}</h1>
              <p style={{ color: "#6B7280", fontSize: 14, margin: 0, lineHeight: 1.5 }}>{brand.desc}</p>
            </div>
          </div>

          <h2 style={{ fontSize: 17, fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>{brand.name} Ürünleri</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 16 }}>
            {products.map(p => (
              <div key={p.id} onClick={() => navigate(`${BASE}/urun/${p.id}`)}
                style={{ background: "#fff", borderRadius: 14, overflow: "hidden", cursor: "pointer", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ height: 150, background: "#FAF7F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.currentTarget as any).style.display = "none"; }} />
                </div>
                <div style={{ padding: "12px 14px" }}>
                  <p style={{ margin: "0 0 8px", fontSize: 13, color: "#374151", lineHeight: 1.4 }}>{p.name}</p>
                  {p.originalPrice && <div style={{ fontSize: 11, color: "#9CA3AF", textDecoration: "line-through" }}>{p.originalPrice.toLocaleString("tr-TR")}₺</div>}
                  <span style={{ fontWeight: 800, color: P, fontSize: 15 }}>{p.price.toLocaleString("tr-TR")}₺</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </YPLayout>
  );
}
