import { useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { ChevronRight } from "lucide-react";
import { MOCK_SEARCH_PRODUCTS } from "@/data/searchResults";
import { IS_YP } from "@/lib/store";

const P = "#7022C4";
const BASE = IS_YP ? "" : "/yourpoodle";

const CATEGORY_MAP: Record<string, string> = {
  "kuru-mama": "Kuru Mama",
  "yas-mama": "Yaş Mama",
  "odul": "Ödül & Ek Besin",
  "oyuncak": "Oyuncaklar",
  "bakim": "Bakım Ürünleri",
  "aksesuar": "Aksesuarlar",
};

export default function YPKategoriSayfasiPage() {
  const [, params] = useRoute("/magaza/kategori/:slug");
  const [, navigate] = useLocation();
  const slug = params?.slug ?? "";
  const title = CATEGORY_MAP[slug] ?? slug.replace(/-/g, " ");

  useEffect(() => { document.title = `${title} | YourPoodle`; }, [title]);

  return (
    <YPLayout activeLink={`${BASE}/magaza`} constrain={false}>
      <div style={{ minHeight: "100vh", background: "#FAFAFA", paddingBottom: 48 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 20px 0" }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 20, fontSize: 12, color: "#9CA3AF" }}>
            <button onClick={() => navigate(`${BASE}/magaza`)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: 0, fontFamily: "inherit", fontSize: 12 }}>Mağaza</button>
            <ChevronRight size={12} />
            <span style={{ color: "#374151", fontWeight: 600 }}>{title}</span>
          </div>

          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: "0 0 6px" }}>{title}</h1>
          <p style={{ color: "#6B7280", fontSize: 14, margin: "0 0 24px" }}>Toy Poodle için en iyi {title.toLowerCase()} ürünleri</p>

          {/* Sort bar */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
            <select style={{ padding: "8px 14px", borderRadius: 10, border: "1.5px solid #E5E7EB", background: "#fff", fontSize: 13, color: "#374151", fontFamily: "inherit", outline: "none" }}>
              <option>Sırala: Önerilen</option>
              <option>Fiyat: Düşükten Yükseğe</option>
              <option>Fiyat: Yüksekten Düşüğe</option>
              <option>En Çok Satan</option>
            </select>
          </div>

          {/* Product grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 16 }}>
            {MOCK_SEARCH_PRODUCTS.map(p => (
              <div key={p.id} onClick={() => navigate(`${BASE}/urun/${p.id}`)}
                style={{ background: "#fff", borderRadius: 14, overflow: "hidden", cursor: "pointer", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ height: 150, background: "#F9F5FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
