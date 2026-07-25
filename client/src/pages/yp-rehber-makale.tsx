import { useEffect, useState, useCallback } from "react";
import { useRoute, useLocation } from "wouter";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { ChevronRight, Clock, Eye, Heart, Share2 } from "lucide-react";
import { getArticle, MOCK_ARTICLES } from "@/data/articles";
import { MOCK_SEARCH_PRODUCTS } from "@/data/searchResults";
import { IS_YP } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

const P = "#7022C4";
const BASE = IS_YP ? "" : "/yourpoodle";
const FAV_KEY = "yp_rehber_favorites";

function getFavorites(): string[] {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function setFavorites(favs: string[]) {
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
}

export default function YPRehberMakalePage() {
  const [, paramsA] = useRoute("/rehber/:category/:slug");
  const [, paramsB] = useRoute("/yourpoodle/rehber/:category/:slug");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const params = paramsA ?? paramsB;
  const slug = params?.slug ?? "toy-poodle-tuvalet-egitimi";
  const article = getArticle(slug) ?? MOCK_ARTICLES[0];

  const [isFavorited, setIsFavorited] = useState<boolean>(() =>
    getFavorites().includes(slug)
  );

  // Sync favorited state when slug changes (navigation between articles)
  useEffect(() => {
    setIsFavorited(getFavorites().includes(slug));
  }, [slug]);

  useEffect(() => {
    document.title = `${article.title} | YourPoodle Rehber`;
  }, [article.title]);

  const handleFavorile = useCallback(() => {
    const favs = getFavorites();
    let next: string[];
    let nowFav: boolean;
    if (favs.includes(slug)) {
      next = favs.filter((s) => s !== slug);
      nowFav = false;
    } else {
      next = [...favs, slug];
      nowFav = true;
    }
    setFavorites(next);
    setIsFavorited(nowFav);
    toast({
      title: nowFav ? "Favorilere eklendi ❤️" : "Favorilerden çıkarıldı",
      duration: 2000,
    });
  }, [slug, toast]);

  const handlePaylas = useCallback(async () => {
    const url = window.location.href;
    const shareData = {
      title: article.title,
      text: article.title,
      url,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err: any) {
        // User cancelled — fail silently
        if (err?.name === "AbortError") return;
        // Unexpected error — fall through to clipboard
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast({ title: "Link kopyalandı", duration: 2000 });
      } catch {
        // Clipboard denied — best-effort silent fail
      }
    }
  }, [article.title, toast]);

  return (
    <YPLayout activeLink={`${BASE}/rehber`} constrain={false}>
      <div style={{ minHeight: "100vh", background: "#FAFAFA", paddingBottom: 80 }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "20px 20px 0" }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 16, fontSize: 12, color: "#9CA3AF" }}>
            <button onClick={() => navigate(`${BASE}/rehber`)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: 0, fontFamily: "inherit", fontSize: 12 }}>Rehber</button>
            <ChevronRight size={12} />
            <span style={{ color: "#374151" }}>{article.categoryLabel}</span>
          </div>

          {/* Category badge */}
          <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#fff", background: P, padding: "3px 10px", borderRadius: 9999, marginBottom: 12 }}>
            {article.categoryLabel}
          </span>

          {/* Title */}
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#111827", margin: "0 0 12px", lineHeight: 1.3 }}>{article.title}</h1>

          {/* Meta row */}
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 24, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#9CA3AF", fontSize: 13 }}>
              <Clock size={13} /> {article.readTime} dk okuma
            </div>
            <div style={{ color: "#9CA3AF", fontSize: 13 }}>{article.date}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#9CA3AF", fontSize: 13 }}>
              <Eye size={13} /> {article.views}
            </div>
          </div>

          {/* Hero image */}
          <div style={{ height: 220, borderRadius: 18, background: "linear-gradient(135deg,#7022C4,#A855F7)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 32, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 64, opacity: 0.4 }}>🐾</span>
            </div>
            <span style={{ fontSize: 48, zIndex: 1, position: "relative" }}>🐩</span>
          </div>

          {/* Article body */}
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            {article.body.map((block, i) => (
              block.isTip ? (
                <div key={i} style={{ background: "#F5F0FF", border: "2px solid #A855F7", borderRadius: 12, padding: "14px 18px", margin: "24px 0", fontSize: 14, color: "#374151", lineHeight: 1.6 }}>
                  {block.text}
                </div>
              ) : (
                <div key={i} style={{ marginBottom: 20 }}>
                  {block.heading && <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: "0 0 10px" }}>{block.heading}</h2>}
                  <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, margin: 0 }}>{block.text}</p>
                </div>
              )
            ))}
          </div>

          {/* Product recommendations */}
          <div style={{ marginTop: 40, paddingTop: 32, borderTop: "2px solid #F3F4F6" }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: "#111827", margin: "0 0 16px" }}>Bu rehber için önerilen ürünler</h2>
            <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8 }}>
              {MOCK_SEARCH_PRODUCTS.slice(0, 3).map(p => (
                <div key={p.id} onClick={() => navigate(`${BASE}/urun/${p.id}`)}
                  style={{ flexShrink: 0, width: 160, background: "#fff", borderRadius: 14, overflow: "hidden", cursor: "pointer", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
                  <div style={{ height: 120, background: "#F9F5FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.currentTarget as any).style.display = "none"; }} />
                  </div>
                  <div style={{ padding: "10px 12px" }}>
                    <p style={{ margin: "0 0 6px", fontSize: 12, color: "#374151", lineHeight: 1.4 }}>{p.name}</p>
                    <span style={{ fontWeight: 800, color: P, fontSize: 13 }}>{p.price.toLocaleString("tr-TR")}₺</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Related articles */}
          <div style={{ marginTop: 36 }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: "#111827", margin: "0 0 16px" }}>Benzer Makaleler</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 14 }}>
              {MOCK_ARTICLES.filter(a => a.slug !== article.slug).slice(0, 3).map(a => (
                <div key={a.slug} onClick={() => navigate(`${BASE}/rehber/${a.category}/${a.slug}`)}
                  style={{ background: "#fff", borderRadius: 14, padding: "16px 18px", cursor: "pointer", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: P, background: "#F5F0FF", padding: "2px 8px", borderRadius: 9999 }}>{a.categoryLabel}</span>
                  <p style={{ margin: "8px 0 4px", fontWeight: 700, color: "#111827", fontSize: 14 }}>{a.title}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF" }}>{a.readTime} dk okuma</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile sticky bar — sits above bottom nav (60 px) + safe-area */}
        <div
          style={{
            position: "fixed",
            bottom: "calc(60px + env(safe-area-inset-bottom, 0px))",
            left: 0,
            right: 0,
            background: "#fff",
            borderTop: "1px solid #F3F4F6",
            padding: "12px 20px",
            display: "flex",
            gap: 10,
            zIndex: 210,
          }}
          className="lg:hidden"
        >
          {/* Favorile */}
          <button
            aria-pressed={isFavorited}
            onClick={handleFavorile}
            style={{
              flex: 1,
              height: 44,
              borderRadius: 12,
              border: isFavorited ? `1.5px solid ${P}` : "1.5px solid #E5E7EB",
              background: isFavorited ? "#F5F0FF" : "#fff",
              color: isFavorited ? P : "#374151",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              transition: "background 0.15s, border-color 0.15s, color 0.15s",
            }}
          >
            <Heart
              size={16}
              fill={isFavorited ? P : "none"}
              color={isFavorited ? P : "#374151"}
            />
            {isFavorited ? "Favorilerde" : "Favorile"}
          </button>

          {/* Paylaş */}
          <button
            onClick={handlePaylas}
            style={{
              flex: 1,
              height: 44,
              borderRadius: 12,
              border: "none",
              background: P,
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <Share2 size={16} /> Paylaş
          </button>
        </div>
      </div>
    </YPLayout>
  );
}
