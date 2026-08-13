import { useEffect, useState, useCallback, useMemo } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { ChevronRight, Clock, Eye, Heart, Share2, Loader2 } from "lucide-react";
import { getArticle, MOCK_ARTICLES, type Article } from "@/data/articles";
import { IS_YP } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

const P = "#5D3A1A";
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

type GuideProduct = {
  id: number;
  name: string;
  price: number;
  originalPrice?: number | null;
  img?: string | null;
};

type DbArticle = {
  id: number;
  title: string;
  body: string;
  tag?: string | null;
  emoji?: string | null;
  min_read?: number;
  featured?: boolean;
  slug: string;
  seo_title?: string | null;
  seo_description?: string | null;
  related_slugs?: string | null;
  published_at?: string | null;
};

function mapDbArticle(row: DbArticle): Article {
  const raw = String(row.body || "").trim();
  const chunks = raw.split(/\n\n+/).map((t) => t.trim()).filter(Boolean);
  const body =
    chunks.length > 0
      ? chunks.map((text) => ({
          text,
          isTip: text.startsWith("💡") || /ipucu/i.test(text),
        }))
      : [{ text: raw || "İçerik yakında." }];

  const relatedSlugs = String(row.related_slugs || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    slug: row.slug,
    category: "rehber",
    categoryLabel: row.tag || "Rehber",
    title: row.title,
    readTime: Number(row.min_read) || 5,
    date: row.published_at ? new Date(row.published_at).toLocaleDateString("tr-TR") : "",
    views: "—",
    excerpt: row.seo_description || body[0]?.text?.slice(0, 140) || "",
    body,
    relatedSlugs,
  };
}

export default function YPRehberMakalePage() {
  const [, paramsCatA] = useRoute("/rehber/:category/:slug");
  const [, paramsCatB] = useRoute("/yourpoodle/rehber/:category/:slug");
  const [, paramsSlugA] = useRoute("/rehber/:slug");
  const [, paramsSlugB] = useRoute("/yourpoodle/rehber/:slug");
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const catParams = paramsCatA ?? paramsCatB;
  const slugParams = (!catParams ? (paramsSlugA ?? paramsSlugB) : null);
  const slug = catParams?.slug ?? slugParams?.slug ?? "";

  const mockArticle = slug ? getArticle(slug) : undefined;

  const {
    data: dbArticle,
    isLoading: dbLoading,
    isError: dbError,
    error: dbErr,
  } = useQuery<DbArticle | null>({
    queryKey: ["/api/yp-article", slug],
    queryFn: async () => {
      const r = await fetch(`/api/yp-article/${encodeURIComponent(slug)}`);
      if (r.status === 404) return null;
      if (r.status === 410) {
        const err = new Error("gone") as Error & { status: number };
        err.status = 410;
        throw err;
      }
      if (!r.ok) throw new Error("Makale yüklenemedi");
      return r.json();
    },
    enabled: !!slug && !mockArticle,
    staleTime: 60_000,
    retry: false,
  });

  const { data: dbList = [] } = useQuery<DbArticle[]>({
    queryKey: ["/api/yp-articles"],
    queryFn: async () => {
      const r = await fetch("/api/yp-articles");
      if (!r.ok) return [];
      return r.json();
    },
    staleTime: 60_000,
    enabled: !!slug && !mockArticle && !!dbArticle,
  });

  const article: Article | null = useMemo(() => {
    if (mockArticle) return mockArticle;
    if (dbArticle) return mapDbArticle(dbArticle);
    return null;
  }, [mockArticle, dbArticle]);

  const [isFavorited, setIsFavorited] = useState<boolean>(() =>
    slug ? getFavorites().includes(slug) : false
  );

  const { data: recommendedProducts = [], isLoading: recLoading } = useQuery<GuideProduct[]>({
    queryKey: ["/api/yp-guide", slug, "products"],
    queryFn: async () => {
      const r = await fetch(`/api/yp-guide/${encodeURIComponent(slug)}/products`);
      if (!r.ok) return [];
      return r.json();
    },
    enabled: !!slug,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (slug) setIsFavorited(getFavorites().includes(slug));
  }, [slug]);

  const handleFavorile = useCallback(() => {
    if (!slug) return;
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
    if (!article) return;
    const url = window.location.href;
    const shareData = {
      title: article.title,
      text: article.title,
      url,
    };

    const copyLink = async () => {
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(url);
        } else {
          const ta = document.createElement("textarea");
          ta.value = url;
          ta.setAttribute("readonly", "");
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
        }
        toast({ title: "Link kopyalandı", duration: 2000 });
        return true;
      } catch {
        toast({ title: "Link kopyalanamadı", duration: 2500 });
        return false;
      }
    };

    if (typeof navigator.share === "function") {
      try {
        if (!navigator.canShare || navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return;
        }
      } catch (err: any) {
        if (err?.name === "AbortError") return;
      }
    }

    await copyLink();
  }, [article, toast]);

  const related = useMemo(() => {
    if (mockArticle) {
      return MOCK_ARTICLES.filter((a) => a.slug !== slug).slice(0, 3);
    }
    const wanted = (article?.relatedSlugs || []).filter((s) => s && s !== slug);
    const list = dbList as DbArticle[];
    if (wanted.length > 0) {
      const bySlug = new Map(list.map((a) => [a.slug, a]));
      const picked = wanted.map((s) => bySlug.get(s)).filter(Boolean) as DbArticle[];
      if (picked.length > 0) return picked.slice(0, 3).map(mapDbArticle);
    }
    return list
      .filter((a) => a.slug && a.slug !== slug)
      .slice(0, 3)
      .map(mapDbArticle);
  }, [mockArticle, dbList, slug, article?.relatedSlugs]);

  useEffect(() => {
    if (!article) return;
    const seoTitle = (dbArticle as DbArticle | null | undefined)?.seo_title || article.title;
    document.title = `${seoTitle} | YourPoodle Rehber`;
    const desc =
      (dbArticle as DbArticle | null | undefined)?.seo_description ||
      article.excerpt ||
      "";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    if (desc) meta.setAttribute("content", desc.slice(0, 160));
  }, [article, dbArticle]);

  if (!slug) {
    return (
      <YPLayout activeLink={`${BASE}/rehber`} constrain={false}>
        <div style={{ padding: 40, textAlign: "center" }}>
          <p>Makale bulunamadı.</p>
          <button type="button" onClick={() => navigate(`${BASE}/rehber`)} style={{ color: P, marginTop: 12 }}>
            Rehbere dön
          </button>
        </div>
      </YPLayout>
    );
  }

  if (!mockArticle && dbLoading) {
    return (
      <YPLayout activeLink={`${BASE}/rehber`} constrain={false}>
        <div style={{ minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: P }} />
        </div>
      </YPLayout>
    );
  }

  if (!article) {
    const gone = dbError && (dbErr as any)?.status === 410;
    return (
      <YPLayout activeLink={`${BASE}/rehber`} constrain={false}>
        <div style={{ padding: 40, textAlign: "center", maxWidth: 480, margin: "0 auto" }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>
            {gone ? "Bu makale yayında değil" : "Makale bulunamadı"}
          </h1>
          <p style={{ color: "#6B7280", marginTop: 8, fontSize: 14 }}>
            {gone
              ? "Makale kaldırılmış veya gizlenmiş olabilir."
              : "Aradığınız rehber yazısı mevcut değil."}
          </p>
          <button
            type="button"
            onClick={() => navigate(`${BASE}/rehber`)}
            style={{
              marginTop: 20,
              background: P,
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "10px 18px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Tüm rehberlere dön
          </button>
        </div>
      </YPLayout>
    );
  }

  const articlePath = (a: Article) =>
    a.category && a.category !== "rehber"
      ? `${BASE}/rehber/${a.category}/${a.slug}`
      : `${BASE}/rehber/${a.slug}`;

  return (
    <YPLayout activeLink={`${BASE}/rehber`} constrain={false}>
      <div style={{ minHeight: "100vh", background: "#FAFAFA", paddingBottom: 80 }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "16px 16px 0" }}>

          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 12, fontSize: 11, color: "#9CA3AF" }}>
            <button onClick={() => navigate(`${BASE}/rehber`)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: 0, fontFamily: "inherit", fontSize: 11 }}>Rehber</button>
            <ChevronRight size={11} />
            <span style={{ color: "#374151" }}>{article.categoryLabel}</span>
          </div>

          <span style={{ display: "inline-block", fontSize: 10, fontWeight: 700, color: "#fff", background: P, padding: "3px 9px", borderRadius: 9999, marginBottom: 10, letterSpacing: 0.2 }}>
            {article.categoryLabel}
          </span>

          <h1 style={{ fontSize: "clamp(1.125rem, 4.2vw, 1.5rem)", fontWeight: 800, color: "#111827", margin: "0 0 10px", lineHeight: 1.35, letterSpacing: "-0.01em" }}>{article.title}</h1>

          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 18, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#9CA3AF", fontSize: 12 }}>
              <Clock size={12} /> {article.readTime} dk okuma
            </div>
            {article.date ? <div style={{ color: "#9CA3AF", fontSize: 12 }}>{article.date}</div> : null}
            {article.views && article.views !== "—" ? (
              <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#9CA3AF", fontSize: 12 }}>
                <Eye size={12} /> {article.views}
              </div>
            ) : null}
          </div>

          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            {article.body.map((block, i) => (
              block.isTip ? (
                <div key={i} style={{ background: "#F5F0E6", border: "1.5px solid #D4C4A8", borderRadius: 12, padding: "12px 14px", margin: "18px 0", fontSize: 13, color: "#374151", lineHeight: 1.55 }}>
                  {block.text}
                </div>
              ) : (
                <div key={i} style={{ marginBottom: 16 }}>
                  {block.heading && <h2 style={{ fontSize: "clamp(0.95rem, 3.4vw, 1.125rem)", fontWeight: 700, color: "#111827", margin: "0 0 8px", lineHeight: 1.35 }}>{block.heading}</h2>}
                  <p style={{ fontSize: "clamp(0.875rem, 3.2vw, 0.9375rem)", color: "#4B5563", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>{block.text}</p>
                </div>
              )
            ))}
          </div>

          {!recLoading && recommendedProducts.length > 0 && (
          <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid #F3F4F6" }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 14px" }}>Bu rehber için önerilen ürünler</h2>
            <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8 }}>
              {recommendedProducts.map(p => (
                <div key={p.id} onClick={() => navigate(`${BASE}/urun/${p.id}`)}
                  style={{ flexShrink: 0, width: 160, background: "#fff", borderRadius: 14, overflow: "hidden", cursor: "pointer", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
                  <div style={{ height: 120, background: "#FAF7F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {p.img ? (
                      <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.currentTarget as any).style.display = "none"; }} />
                    ) : null}
                  </div>
                  <div style={{ padding: "10px 12px" }}>
                    <p style={{ margin: "0 0 6px", fontSize: 12, color: "#374151", lineHeight: 1.4 }}>{p.name}</p>
                    <span style={{ fontWeight: 800, color: P, fontSize: 13 }}>{Number(p.price).toLocaleString("tr-TR")}₺</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          )}

          {related.length > 0 && (
          <div style={{ marginTop: 36 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 14px" }}>Benzer Makaleler</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 14 }}>
              {related.map(a => (
                <div key={a.slug} onClick={() => navigate(articlePath(a))}
                  style={{ background: "#fff", borderRadius: 14, padding: "16px 18px", cursor: "pointer", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: P, background: "#F5F0E6", padding: "2px 8px", borderRadius: 9999 }}>{a.categoryLabel}</span>
                  <p style={{ margin: "8px 0 4px", fontWeight: 700, color: "#111827", fontSize: 14 }}>{a.title}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF" }}>{a.readTime} dk okuma</p>
                </div>
              ))}
            </div>
          </div>
          )}
        </div>

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
          <button
            aria-pressed={isFavorited}
            onClick={handleFavorile}
            style={{
              flex: 1,
              height: 44,
              borderRadius: 12,
              border: isFavorited ? `1.5px solid ${P}` : "1.5px solid #E5E7EB",
              background: isFavorited ? "#F5F0E6" : "#fff",
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

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void handlePaylas();
            }}
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
