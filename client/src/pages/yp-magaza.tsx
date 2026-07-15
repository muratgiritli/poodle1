import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Search, Heart, SlidersHorizontal, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import YPLayout from "@/components/yourpoodle/YPLayout";

const SORT_OPTIONS = ["Önerilen","Fiyat ↑","Fiyat ↓","En Yeni"];

export default function Magaza() {
  const [, navigate]   = useLocation();
  const [activeCat, setActiveCat] = useState("Tümü");
  const [search,    setSearch]    = useState("");
  const [sort,      setSort]      = useState("Önerilen");
  const [wishlist,  setWishlist]  = useState<number[]>([]);

  const { data: allProducts = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/products"],
    staleTime: 5 * 60 * 1000,
  });

  const cats = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of allProducts as any[]) {
      if (p.animal !== "kopek") continue;
      const sub = p.subcategory || p.mamaType || "";
      if (sub) counts[sub] = (counts[sub] || 0) + 1;
    }
    return ["Tümü", ...Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k]) => k)];
  }, [allProducts]);

  const filtered = useMemo(() => {
    let list = (allProducts as any[]).filter((p: any) => {
      const matchAnimal = p.animal === "kopek";
      const matchCat    = activeCat === "Tümü" || (p.subcategory || p.mamaType || "") === activeCat;
      const matchQ      = search === "" || p.name.toLowerCase().includes(search.toLowerCase());
      return matchAnimal && matchCat && matchQ;
    });
    if (sort === "Fiyat ↑") list = [...list].sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === "Fiyat ↓") list = [...list].sort((a, b) => Number(b.price) - Number(a.price));
    if (sort === "En Yeni")  list = [...list].sort((a, b) => b.id - a.id);
    return list;
  }, [allProducts, activeCat, search, sort]);

  const toggleWish = (id: number) =>
    setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);

  return (
    <YPLayout activeLink="/yourpoodle/magaza">
      <title>Mağaza — YourPoodle</title>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        .noscroll::-webkit-scrollbar { display: none; }
        .noscroll { -ms-overflow-style: none; scrollbar-width: none; }
        .prod-card { cursor: pointer; transition: transform 0.1s, box-shadow 0.1s; }
        .prod-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.1) !important; }
        @media (min-width: 900px) {
          .magaza-grid { grid-template-columns: repeat(4,1fr) !important; }
          .magaza-sort-row { flex-wrap: wrap; gap: 8px; }
        }
        @media (min-width: 1100px) {
          .magaza-grid { grid-template-columns: repeat(5,1fr) !important; }
        }
      `}</style>

      <div style={{ background:"#F8F8F8", minHeight:"100vh" }}>

        {/* Search + filter */}
        <div style={{ background:"#fff", padding:"14px 16px", borderBottom:"1px solid #f0f0f0" }}>
          <div style={{ display:"flex", gap:10, maxWidth:800 }}>
            <div style={{ flex:1, display:"flex", alignItems:"center", background:"#F7F7F7", border:"1.5px solid #ececec", borderRadius:12, height:46, overflow:"hidden" }}>
              <div style={{ paddingLeft:12, color:"#bbb", display:"flex" }}><Search size={17} strokeWidth={2} /></div>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Ürün ara…"
                style={{ flex:1, border:"none", outline:"none", fontSize:13, fontWeight:600, color:"#333", background:"transparent", padding:"0 10px" }}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{ paddingRight:12, background:"none", border:"none", cursor:"pointer", color:"#aaa" }}>
                  <X size={14} />
                </button>
              )}
            </div>
            <button style={{ width:46, height:46, borderRadius:12, border:"1.5px solid #ececec", background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0 }}>
              <SlidersHorizontal size={18} color="#555" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Category chips */}
        <div style={{ background:"#fff", padding:"10px 16px 12px", borderBottom:"1px solid #f0f0f0" }}>
          <div className="noscroll" style={{ display:"flex", gap:8, overflowX:"auto" }}>
            {cats.map(c => (
              <button key={c} onClick={() => setActiveCat(c)}
                style={{ flexShrink:0, padding:"7px 16px", borderRadius:20, border:"1.5px solid", borderColor:activeCat===c?"#7C3AFF":"#e8e8e8", background:activeCat===c?"#7C3AFF":"#fff", color:activeCat===c?"#fff":"#555", fontSize:12.5, fontWeight:700, cursor:"pointer", transition:"all 0.15s" }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Sort + count */}
        <div style={{ padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
          <span style={{ fontSize:12, color:"#888" }}>
            {isLoading ? "Yükleniyor…" : `${filtered.length} ürün`}
          </span>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {SORT_OPTIONS.map(s => (
              <button key={s} onClick={() => setSort(s)}
                style={{ padding:"5px 10px", borderRadius:8, border:"1.5px solid", borderColor:sort===s?"#7C3AFF":"#e8e8e8", background:sort===s?"#EDE8FF":"#fff", color:sort===s?"#7C3AFF":"#555", fontSize:11.5, fontWeight:700, cursor:"pointer" }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Product grid */}
        {isLoading ? (
          <div className="magaza-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, padding:"0 12px 24px" }}>
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} style={{ background:"#f0f0f0", borderRadius:16, height:170 }} />
            ))}
          </div>
        ) : (
          <div className="magaza-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, padding:"0 12px 24px" }}>
            {filtered.map((p: any) => (
              <div key={p.id} className="prod-card" onClick={() => navigate(`/urun/${p.id}`)}
                style={{ background:"#fff", borderRadius:16, overflow:"hidden", display:"flex", flexDirection:"column", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ background:"#F0ECFF", height:110, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>
                  {p.img
                    ? <img src={p.img} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                    : <span style={{ fontSize:36 }}>🐾</span>
                  }
                  {p.originalPrice && Number(p.originalPrice) > Number(p.price) && (
                    <div style={{ position:"absolute", top:6, left:6, background:"#EF4444", borderRadius:6, padding:"2px 6px" }}>
                      <span style={{ fontSize:8, fontWeight:800, color:"#fff" }}>İNDİRİM</span>
                    </div>
                  )}
                  <button onClick={e => { e.stopPropagation(); toggleWish(p.id); }}
                    style={{ position:"absolute", top:6, right:6, background:"rgba(255,255,255,0.85)", border:"none", borderRadius:"50%", width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                    <Heart size={14} color={wishlist.includes(p.id) ? "#E75480" : "#bbb"} fill={wishlist.includes(p.id) ? "#E75480" : "none"} strokeWidth={2} />
                  </button>
                </div>
                <div style={{ padding:"10px 10px 12px", flex:1, display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
                  <div style={{ fontSize:11, fontWeight:700, color:"#1a1a1a", lineHeight:1.35, marginBottom:6, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" as any }}>
                    {p.name}
                  </div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:900, color:"#7C3AFF" }}>
                      ₺{Number(p.price).toLocaleString("tr-TR", { minimumFractionDigits:0, maximumFractionDigits:0 })}
                    </div>
                    {p.originalPrice && Number(p.originalPrice) > Number(p.price) && (
                      <div style={{ fontSize:10, color:"#bbb", textDecoration:"line-through" }}>
                        ₺{Number(p.originalPrice).toLocaleString("tr-TR", { minimumFractionDigits:0, maximumFractionDigits:0 })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"48px 16px", color:"#aaa" }}>
                <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
                <div style={{ fontSize:15, fontWeight:700 }}>Ürün bulunamadı</div>
                <div style={{ fontSize:12, marginTop:6 }}>Farklı bir arama deneyin veya filtreyi temizleyin.</div>
                {(search || activeCat !== "Tümü") && (
                  <button onClick={() => { setSearch(""); setActiveCat("Tümü"); }}
                    style={{ marginTop:16, padding:"8px 20px", borderRadius:20, border:"none", background:"#7C3AFF", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer" }}>
                    Filtreyi Temizle
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </YPLayout>
  );
}
