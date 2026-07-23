import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useCustomer } from "@/contexts/CustomerContext";
import YPBottomNav from "@/components/YPBottomNav";
import { Search, ShoppingCart, X, ChevronDown, Bot, Menu } from "lucide-react";

/* ─── SEO ──────────────────────────────────────────── */
const YP_TITLE = "YourPoodle — Toy Poodle Bakım, Mama ve Eğitim Platformu";
const YP_DESC  = "Toy Poodle sahipleri için dünya genelinde kargo yapan e-ticaret ve uzman içerik platformu. AI destekli mama önerisi, veteriner onaylı rehberler ve aktif topluluk.";

/* ─── Design tokens ────────────────────────────────── */
const C = {
  primary:   "#7C3AED",
  amber:     "#F59E0B",
  bg:        "#F9FAFB",
  white:     "#FFFFFF",
  text:      "#171717",
  secondary: "#6B7280",
  success:   "#10B981",
  border:    "#EDE9FE",
  softBg:    "#FAF9FC",
  lightPurple: "#F3EEFF",
  darkPurple:  "#2E1760",
  pink:        "#EC4899",
};

const card: React.CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
};

/* ─── DATA ─────────────────────────────────────────── */
const NAV_DRAWER = [
  { label: "Ana Sayfa",   href: "/yourpoodle"              },
  { label: "Mama Bul",    href: "/yourpoodle/mama-bul"     },
  { label: "Rehber",      href: "/yourpoodle/rehber"       },
  { label: "AI Asistan",  href: "/yourpoodle/ai-asistan"   },
  { label: "Araçlar",     href: "/yourpoodle/bilgi"        },
  { label: "Mağaza",      href: "/yourpoodle/magaza"       },
  { label: "Sağlık",      href: "/yourpoodle/saglik"       },
  { label: "Bakım",       href: "/yourpoodle/bakim"        },
  { label: "Eğitim",      href: "/yourpoodle/egitim"       },
  { label: "Topluluk",    href: "/yourpoodle/topluluk"     },
];

/* Kademe 3 — kısayollar, "Mama Bul" tekrarı yok */
const SHORTCUTS = [
  { emoji: "🛍️", label: "Mağaza",   sub: "Tüm ürünler",         href: "/yourpoodle/magaza",      bg: "#EDE9FE", color: C.primary },
  { emoji: "⚡",  label: "Araçlar",  sub: "Hesapla & bul",        href: "/yourpoodle/bilgi",       bg: "#FEF3C7", color: "#D97706" },
  { emoji: "📖",  label: "Rehber",   sub: "Bakım & sağlık",       href: "/yourpoodle/rehber",      bg: "#D1FAE5", color: "#059669" },
  { emoji: "👥",  label: "Topluluk", sub: "Poodle sahipleri",     href: "/yourpoodle/topluluk",    bg: "#FCE7F3", color: C.pink    },
];

/* Kademe 5 — 4 araç (popüler) */
const TOOLS = [
  { emoji: "⚖️", label: "İdeal Kilo",      desc: "Kilo kontrolü",        href: "/yourpoodle/bilgi", bg: "#EFF6FF", color: "#2563EB" },
  { emoji: "🍽️", label: "Mama Hesaplama",  desc: "Günlük gram miktarı",  href: "/yourpoodle/bilgi", bg: "#F3EEFF", color: C.primary },
  { emoji: "💉", label: "Aşı Takvimi",     desc: "Hatırlatma sistemi",   href: "/yourpoodle/bilgi", bg: "#FDF2F8", color: C.pink    },
  { emoji: "✂️", label: "Bakım Takvimi",   desc: "Tıraş zamanı",         href: "/yourpoodle/bilgi", bg: "#FFF7ED", color: "#EA580C" },
];

/* Kademe 5 — 3 makale */
const ARTICLES = [
  { cat: "BESLENME", catColor: "#EA580C", catBg: "#FFF7ED", title: "Toy Poodle İçin En İyi Mama Markaları 2026", min: "5 dk", emoji: "🥣", gradient: "linear-gradient(145deg,#FED7AA,#FDE68A)" },
  { cat: "BAKIM",    catColor: C.primary, catBg: "#F3EEFF", title: "Evde Poodle Tıraşı: Adım Adım Rehber",       min: "8 dk", emoji: "🐩", gradient: "linear-gradient(145deg,#DDD6FE,#C4B5FD)" },
  { cat: "SAĞLIK",  catColor: "#DC2626", catBg: "#FEF2F2", title: "Göz Altı Kızarıklığı: Neden Olur?",          min: "4 dk", emoji: "👁️", gradient: "linear-gradient(145deg,#FECACA,#FCA5A5)" },
];

/* Kademe 5 — 3 SSS */
const FAQ = [
  { q: "Toy Poodle günde kaç öğün yemeli?",           a: "Yetişkin Toy Poodle genellikle günde 2–3 küçük öğün yer. 3 aylıktan küçük yavrular 4 öğüne çıkabilir." },
  { q: "Poodle'lar için en iyi mama hangisi?",         a: "Royal Canin, Pro Plan ve Hill's Science Plan veterinerlerce önerilen başlıca seçeneklerdir. Mama Bul sihirbazımız poodle'ınıza özel öneri sunar." },
  { q: "Poodle'lar ne sıklıkla tıraş yaptırılmalı?",  a: "Toy ve Minyatür Poodle'lar ortalama 6-8 haftada bir tıraş gerektirir. Tüyleri sürekli uzadığından düzenli bakım şarttır." },
];

interface YPProduct {
  id: number; name: string; price: number; originalPrice?: number | null;
  img?: string | null; stock: number; isActive: boolean;
}

/* ─── COMPONENT ─────────────────────────────────────── */
export default function YourPoodleHomePage() {
  const [location, navigate] = useLocation();
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [openFaq, setOpenFaq]         = useState<number | null>(null);
  const [email, setEmail]             = useState("");
  const [emailSent, setEmailSent]     = useState(false);
  const [search, setSearch]           = useState("");
  const [cartCount, setCartCount]     = useState(0);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef  = useRef<HTMLInputElement>(null);
  const { isLoggedIn, customer } = useCustomer();
  const initials = (customer as any)?.name?.slice(0, 1).toUpperCase() || "";

  const { data: allProducts = [] } = useQuery<YPProduct[]>({
    queryKey: ["/api/yp-products"],
    staleTime: 5 * 60 * 1000,
  });
  const featuredProducts = allProducts.filter(p => p.isActive && p.stock > 0).slice(0, 6);

  /* SEO */
  useEffect(() => {
    document.title = YP_TITLE;
    const setMeta = (attr: string, key: string, val: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
      el.content = val;
    };
    setMeta("property", "og:title", YP_TITLE);
    setMeta("name", "description", YP_DESC);
    setMeta("property", "og:description", YP_DESC);
    setMeta("property", "og:type", "website");
  }, []);

  /* Cart counter */
  useEffect(() => {
    const read = () => {
      try {
        const c = JSON.parse(localStorage.getItem("yp_cart_items") || "[]");
        setCartCount(Array.isArray(c) ? c.reduce((s: number, i: any) => s + (i.qty || 0), 0) : 0);
      } catch { setCartCount(0); }
    };
    read();
    window.addEventListener("storage", read);
    const t = setInterval(read, 500);
    return () => { window.removeEventListener("storage", read); clearInterval(t); };
  }, []);

  /* Close profile dropdown on outside click */
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  /* Focus search input when overlay opens */
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50);
  }, [searchOpen]);

  const go = (href: string) => { navigate(href); setDrawerOpen(false); setSearchOpen(false); };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) { go(`/yourpoodle/magaza?q=${encodeURIComponent(search.trim())}`); setSearch(""); }
  };

  const addToCart = (product: YPProduct) => {
    try {
      const items = JSON.parse(localStorage.getItem("yp_cart_items") || "[]");
      const idx = items.findIndex((i: any) => i.id === product.id);
      if (idx >= 0) items[idx].qty += 1;
      else items.push({ id: product.id, name: product.name, price: product.price, img: product.img, qty: 1 });
      localStorage.setItem("yp_cart_items", JSON.stringify(items));
      window.dispatchEvent(new Event("storage"));
    } catch {}
  };

  return (
    <div style={{ fontFamily: "'Inter',-apple-system,sans-serif", background: C.bg, minHeight: "100vh", color: C.text }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=Inter:wght@400;500;600;700;800;900&display=swap');

        /* responsive breakpoints */
        .yph-mobile  { display: none !important; }
        .yph-desktop { display: flex !important; }
        @media (max-width: 767px) {
          .yph-mobile  { display: flex !important; }
          .yph-desktop { display: none !important; }
          .yph-btm-nav { display: block !important; }
          .yph-page-pad { padding-bottom: 80px; }
        }
        @media (min-width: 768px) { .yph-btm-nav { display: none !important; } }

        /* product scroll */
        .yph-product-scroll {
          display: flex; gap: 12px;
          overflow-x: auto; scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch; scrollbar-width: none;
          padding: 4px 4px 8px;
        }
        .yph-product-scroll::-webkit-scrollbar { display: none; }

        /* article list */
        .yph-article-list { display: flex; flex-direction: column; gap: 10px; }

        /* tools 2-col mobile / 4-col desktop */
        .yph-tools-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; }
        @media (min-width: 768px) { .yph-tools-grid { grid-template-columns: repeat(4,1fr); } }

        /* shortcut strip */
        .yph-shortcut-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; }

        /* page inner max-width */
        .yph-inner { max-width: 1200px; margin: 0 auto; }
        .yph-section { padding: 20px 16px; }
        @media (min-width: 768px) { .yph-section { padding: 40px 40px; } }

        /* hero grid desktop */
        @media (min-width: 768px) {
          .yph-hero-card { min-height: 380px !important; }
          .yph-tools-grid { grid-template-columns: repeat(4,1fr); }
        }

        /* trust strip desktop */
        .yph-trust-grid { display: flex; justify-content: space-around; align-items: center; gap: 8px; }
        @media (min-width: 768px) { .yph-trust-grid { justify-content: center; gap: 48px; } }
      `}</style>

      {/* ── Fullscreen search overlay (mobile) ──────────── */}
      {searchOpen && (
        <div style={{ position: "fixed", inset: 0, background: "#fff", zIndex: 400, display: "flex", flexDirection: "column" }}>
          <form onSubmit={handleSearch} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
            <Search size={18} color={C.primary} />
            <input ref={searchRef} value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Mama, rehber veya ürün ara..."
              style={{ flex: 1, fontSize: 16, border: "none", outline: "none", color: C.text, fontFamily: "inherit", background: "transparent" }} />
            <button type="button" onClick={() => setSearchOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", minWidth: 44, minHeight: 44 }}>
              <X size={20} color={C.secondary} />
            </button>
          </form>
          {/* Quick links */}
          <div style={{ padding: "16px" }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: C.secondary, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>Popüler Aramalar</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["Royal Canin Poodle", "Toy Poodle maması", "Tıraş rehberi", "Aşı takvimi"].map(q => (
                <button key={q} onClick={() => { setSearch(q); go(`/yourpoodle/magaza?q=${encodeURIComponent(q)}`); }}
                  style={{ padding: "8px 14px", borderRadius: 999, background: C.lightPurple, border: "none", fontSize: 13, fontWeight: 600, color: C.primary, cursor: "pointer", fontFamily: "inherit" }}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile drawer ────────────────────────────────── */}
      {drawerOpen && (
        <div onClick={() => setDrawerOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 299, backdropFilter: "blur(2px)" }} />
      )}
      <nav style={{
        position: "fixed", top: 0, left: 0, height: "100%", width: 280,
        background: "#fff", zIndex: 300,
        transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.24s ease",
        boxShadow: "4px 0 28px rgba(0,0,0,0.15)",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 18px 14px", borderBottom: "1px solid #f2f2f2" }}>
          <span style={{ fontFamily: "'Pacifico', cursive", fontSize: 20, color: C.primary }}>YourPoodle 🐾</span>
          <button onClick={() => setDrawerOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={20} color="#666" />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {[...NAV_DRAWER, ...(isLoggedIn ? [{ label: "Siparişlerim", href: "/yourpoodle/siparislerim" }] : [])].map(l => (
            <button key={l.href} onClick={() => go(l.href)}
              style={{ display: "block", width: "100%", padding: "14px 20px", fontSize: 15, fontWeight: 600, color: location === l.href ? C.primary : "#222", background: location === l.href ? C.lightPurple : "transparent", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit", minHeight: 44 }}>
              {l.label}
            </button>
          ))}
        </div>
        <div style={{ padding: "16px 18px", borderTop: "1px solid #f2f2f2" }}>
          <button onClick={() => go(isLoggedIn ? "/hesabim" : "/yourpoodle/giris")}
            style={{ width: "100%", height: 48, borderRadius: 14, background: `linear-gradient(135deg,${C.darkPurple},${C.primary})`, border: "none", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            {isLoggedIn ? "👤 Hesabım" : "Ücretsiz Başla"}
          </button>
        </div>
      </nav>

      {/* ── Header ───────────────────────────────────────── */}
      <header style={{ position: "sticky", top: 0, zIndex: 200 }}>

        {/* Kademe 4 — slim promo band, single scrolling line */}
        <div style={{ background: C.primary, color: "#fff", textAlign: "center", padding: "6px 16px", fontSize: 12, fontWeight: 500, letterSpacing: 0.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          🎁 Yeni üyelere 100 TL bonus &nbsp;•&nbsp; 500₺ üzeri ücretsiz kargo
        </div>

        {/* Mobile header — Kademe 4 */}
        <div className="yph-mobile" style={{ background: "#fff", borderBottom: `1px solid ${C.border}`, alignItems: "center", padding: "0 8px", height: 52, gap: 0 }}>
          {/* Hamburger 44×44 */}
          <button onClick={() => setDrawerOpen(true)}
            style={{ minWidth: 44, minHeight: 44, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Menu size={22} color={C.text} />
          </button>
          {/* Logo */}
          <button onClick={() => go("/yourpoodle")} style={{ background: "none", border: "none", cursor: "pointer", padding: "0 4px", flex: 1, display: "flex", justifyContent: "center" }}>
            <span style={{ fontFamily: "'Pacifico', cursive", fontSize: 18, color: C.primary, lineHeight: 1 }}>YourPoodle 🐾</span>
          </button>
          {/* Search icon — opens overlay */}
          <button onClick={() => setSearchOpen(true)}
            style={{ minWidth: 44, minHeight: 44, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Search size={20} color={C.text} />
          </button>
          {/* Cart icon (no duplicate: alt nav has cart too — removed from here per Kademe 7) */}
          {/* Üye Ol */}
          {!isLoggedIn && (
            <button onClick={() => go("/yourpoodle/giris")}
              style={{ height: 34, padding: "0 12px", background: C.primary, color: "#fff", border: "none", borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit", flexShrink: 0, marginRight: 4 }}>
              Üye Ol
            </button>
          )}
          {isLoggedIn && (
            <button onClick={() => go("/hesabim")}
              style={{ minWidth: 44, minHeight: 44, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg,${C.darkPurple},${C.primary})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff" }}>
                {initials || "🐾"}
              </div>
            </button>
          )}
        </div>

        {/* Desktop header */}
        <div className="yph-desktop" style={{ background: "#fff", borderBottom: `1px solid ${C.border}` }}>
          <div className="yph-inner" style={{ display: "flex", alignItems: "center", padding: "14px 40px", gap: 24, width: "100%" }}>
            <button onClick={() => go("/yourpoodle")} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", flexShrink: 0, padding: 0 }}>
              <span style={{ fontFamily: "'Pacifico', cursive", fontSize: 26, color: C.text, lineHeight: 1 }}>YourPoodle</span>
              <span style={{ fontSize: 20 }}>🐾</span>
            </button>
            <form onSubmit={handleSearch} style={{ flex: 1, position: "relative" }}>
              <Search size={16} color="#9CA3AF" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Mama, rehber veya ürün ara..."
                style={{ width: "100%", height: 44, borderRadius: 999, border: "none", background: C.softBg, paddingLeft: 48, paddingRight: 20, fontSize: 14, color: C.text, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
            </form>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
              {isLoggedIn ? (
                <div ref={profileRef} style={{ position: "relative" }}>
                  <button onClick={() => setProfileOpen(o => !o)}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px 4px 4px", borderRadius: 999, border: `1.5px solid ${C.border}`, background: "#fff", cursor: "pointer" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg,${C.darkPurple},${C.primary})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>{initials || "🐾"}</span>
                    </div>
                    <ChevronDown size={13} color="#9CA3AF" strokeWidth={2} style={{ transform: profileOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
                  </button>
                  {profileOpen && (
                    <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "#fff", borderRadius: 16, boxShadow: "0 8px 32px rgba(112,34,196,0.18)", border: `1px solid ${C.lightPurple}`, minWidth: 180, zIndex: 300, overflow: "hidden" }}>
                      {[
                        { label: "👤 Profilim",       href: "/hesabim" },
                        { label: "📦 Siparişlerim",   href: "/yourpoodle/siparislerim" },
                        { label: "🐾 Köpek Profilim", href: "/yourpoodle/p/olustur" },
                        { label: "🚪 Çıkış Yap",      href: "/giris?logout=1" },
                      ].map(({ label, href }) => (
                        <button key={href} onClick={() => { go(href); setProfileOpen(false); }}
                          style={{ display: "block", width: "100%", padding: "12px 18px", fontSize: 13, fontWeight: 600, color: "#374151", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}
                          onMouseEnter={e => (e.currentTarget.style.background = C.lightPurple)}
                          onMouseLeave={e => (e.currentTarget.style.background = "none")}>
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button onClick={() => go("/yourpoodle/giris")}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, color: C.secondary, fontFamily: "inherit" }}>
                    Giriş Yap
                  </button>
                  <button onClick={() => go("/yourpoodle/giris")}
                    style={{ padding: "10px 22px", borderRadius: 999, border: "none", background: C.primary, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                    Üye Ol
                  </button>
                </>
              )}
              <button onClick={() => go("/yourpoodle/sepet")}
                style={{ minWidth: 44, minHeight: 44, borderRadius: "50%", border: `1.5px solid ${C.border}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
                <ShoppingCart size={18} color={C.secondary} strokeWidth={1.8} />
                {cartCount > 0 && (
                  <span style={{ position: "absolute", top: -2, right: -2, background: C.primary, color: "#fff", fontSize: 9, fontWeight: 800, width: 17, height: 17, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff" }}>
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop sub-nav */}
        <nav className="yph-desktop" style={{ background: "#fff", borderBottom: `1px solid ${C.border}` }}>
          <div className="yph-inner" style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", height: 48, padding: "0 40px", gap: 4 }}>
            {[
              { label: "Mağaza",     href: "/yourpoodle/magaza" },
              { label: "Mama Bul",   href: "/yourpoodle/mama-bul" },
              { label: "AI Asistan", href: "/yourpoodle/ai-asistan" },
              { label: "Rehber",     href: "/yourpoodle/rehber" },
              { label: "Araçlar",    href: "/yourpoodle/bilgi" },
              { label: "Topluluk",   href: "/yourpoodle/topluluk" },
            ].map(({ label, href }) => {
              const active = href === "/yourpoodle" ? location === "/yourpoodle" : location.startsWith(href);
              return (
                <button key={href} onClick={() => go(href)}
                  style={{ padding: "6px 16px", borderRadius: 999, background: active ? C.primary : "transparent", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, color: active ? "#fff" : C.text, fontFamily: "inherit", transition: "background 0.15s" }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = C.lightPurple; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
                  {label}
                </button>
              );
            })}
          </div>
        </nav>
      </header>

      {/* ── PAGE CONTENT ─────────────────────────────────── */}
      <div className="yph-page-pad">

        {/* ═══════════════════════════════════════ */}
        {/* 1. HERO                                */}
        {/* ═══════════════════════════════════════ */}
        <section style={{ background: "#fff", padding: "12px 16px 0" }}>
          <div className="yph-hero-card" style={{
            background: "linear-gradient(135deg,#F0EAFF 0%,#EAE0FF 40%,#E8DFFF 100%)",
            borderRadius: 20, overflow: "hidden", position: "relative", display: "flex", minHeight: 300,
          }}>
            {/* Left */}
            <div style={{ flex: "0 0 54%", padding: "22px 8px 22px 20px", display: "flex", flexDirection: "column", position: "relative", zIndex: 2 }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: C.primary, lineHeight: 1.25, letterSpacing: -0.3 }}>
                Toy Poodle'ınız için her şey tek yerde <span style={{ color: "#F9A8D4" }}>♡</span>
              </div>
              <p style={{ fontSize: 12, color: C.secondary, margin: "8px 0 14px", lineHeight: 1.6, paddingRight: 8 }}>
                Beslenme, bakım, sağlık ve eğitim — hepsi burada.
              </p>
              <button onClick={() => go("/yourpoodle/mama-bul")}
                style={{ height: 44, borderRadius: 999, background: C.primary, color: "#fff", fontSize: 15, fontWeight: 600, border: "none", boxShadow: "0 4px 14px rgba(124,58,237,0.32)", cursor: "pointer", fontFamily: "inherit" }}>
                🐾 Mama Bul
              </button>
              {/* Social proof — single line */}
              <div style={{ marginTop: "auto", paddingTop: 14, display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ display: "flex" }}>
                  {["/images/poodle-avatar-1.jpg", "/images/poodle-avatar-2.jpg", "/images/poodle-avatar-3.jpg"].map((src, i) => (
                    <div key={i} style={{ width: 22, height: 22, borderRadius: "50%", border: "2px solid #fff", marginLeft: i > 0 ? -7 : 0, overflow: "hidden", background: [C.primary, C.pink, C.amber][i], flexShrink: 0 }}>
                      <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                    </div>
                  ))}
                </div>
                <span style={{ fontSize: 11, color: C.secondary }}>
                  <span style={{ color: C.amber }}>★★★★★</span>{" "}
                  <b style={{ color: C.text }}>50K+</b> güveniyor
                </span>
              </div>
            </div>
            {/* Right — poodle image */}
            <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "48%", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: 28, background: "linear-gradient(to right,#EBE1FF,transparent)", zIndex: 1 }} />
              <img src="/images/yp-poodle-hero.png" alt="Toy Poodle"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* 2. ÜRÜN VİTRİNİ                        */}
        {/* ═══════════════════════════════════════ */}
        <section className="yph-section" style={{ background: "#fff", paddingTop: 20 }}>
          <div className="yph-inner">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: C.text, margin: 0 }}>Poodle için Seçilenler</h2>
              <button onClick={() => go("/yourpoodle/magaza")}
                style={{ fontSize: 13, fontWeight: 700, color: C.primary, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                Tümünü Gör →
              </button>
            </div>
            <div className="yph-product-scroll">
              {(featuredProducts.length > 0 ? featuredProducts : Array.from({ length: 4 }).map((_, i) => ({
                id: i, name: ["Royal Canin Poodle Adult 3kg", "Reflex Plus Poodle 2kg", "Hills Science Plan 1kg", "N&D Pumpkin 2kg"][i],
                price: [1500, 800, 620, 950][i], originalPrice: [2000, 1000, null, 1200][i] as number | null,
                img: null, stock: 10, isActive: true,
              }))).map((p: YPProduct, idx) => (
                <div key={p.id || idx} style={{ flex: "0 0 150px", ...card, overflow: "hidden", display: "flex", flexDirection: "column", scrollSnapAlign: "start" }}>
                  {/* Product image */}
                  <div style={{ height: 110, background: [C.lightPurple, "#FEF3C7", "#D1FAE5", "#FCE7F3", "#DBEAFE", "#FEF2F2"][idx % 6], display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    {p.img
                      ? <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 8 }} onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                      : <span style={{ fontSize: 32 }}>🐾</span>
                    }
                  </div>
                  <div style={{ padding: "10px 10px 12px", display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.text, lineHeight: 1.35, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any, overflow: "hidden" }}>
                      {p.name}
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                      <span style={{ fontSize: 15, fontWeight: 800, color: C.primary }}>₺{Number(p.price).toLocaleString("tr-TR")}</span>
                      {p.originalPrice && <span style={{ fontSize: 11, color: C.secondary, textDecoration: "line-through" }}>₺{Number(p.originalPrice).toLocaleString("tr-TR")}</span>}
                    </div>
                    <button onClick={() => addToCart(p)}
                      style={{ height: 34, borderRadius: 10, background: C.primary, color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "inherit", marginTop: "auto" }}>
                      Sepete Ekle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* 3. KISAYOLLAR — Kademe 3               */}
        {/* ═══════════════════════════════════════ */}
        <section className="yph-section" style={{ background: C.bg, paddingTop: 4, paddingBottom: 16 }}>
          <div className="yph-inner">
            <div className="yph-shortcut-grid">
              {SHORTCUTS.map(s => (
                <button key={s.label} onClick={() => go(s.href)}
                  style={{ ...card, padding: "12px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer", fontFamily: "inherit", border: "none", textAlign: "center" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{s.emoji}</div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{s.label}</span>
                  <span style={{ fontSize: 10, color: C.secondary, lineHeight: 1.3 }}>{s.sub}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* 4. HIZLI ARAÇLAR (4 popüler)           */}
        {/* ═══════════════════════════════════════ */}
        <section className="yph-section" style={{ background: "#fff", borderTop: `1px solid ${C.border}` }}>
          <div className="yph-inner">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: C.text, margin: 0 }}>⚡ Hızlı Araçlar</h2>
              <button onClick={() => go("/yourpoodle/bilgi")}
                style={{ fontSize: 13, fontWeight: 700, color: C.primary, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                Tümünü Gör →
              </button>
            </div>
            <div className="yph-tools-grid">
              {TOOLS.map(t => (
                <button key={t.label} onClick={() => go(t.href)}
                  style={{ ...card, display: "flex", alignItems: "center", gap: 10, padding: "14px 12px", cursor: "pointer", fontFamily: "inherit", border: "none", textAlign: "left" }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 4px 16px ${t.color}22`; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; }}>
                  <div style={{ width: 44, height: 44, borderRadius: 13, background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{t.emoji}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.text, lineHeight: 1.3 }}>{t.label}</div>
                    <div style={{ fontSize: 12, color: C.secondary, marginTop: 2 }}>{t.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* 5. EN ÇOK OKUNANLAR (3 makale)         */}
        {/* ═══════════════════════════════════════ */}
        <section className="yph-section" style={{ background: C.bg, borderTop: `1px solid ${C.border}` }}>
          <div className="yph-inner">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: C.text, margin: 0 }}>Bu Hafta En Çok Okunanlar</h2>
              <button onClick={() => go("/yourpoodle/rehber")}
                style={{ fontSize: 13, fontWeight: 700, color: C.primary, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                Tümü →
              </button>
            </div>
            <div className="yph-article-list">
              {ARTICLES.map((a, i) => (
                <button key={i} onClick={() => go("/yourpoodle/rehber")}
                  style={{ ...card, display: "flex", gap: 12, padding: 12, cursor: "pointer", fontFamily: "inherit", border: "none", textAlign: "left" }}>
                  <div style={{ width: 72, height: 54, borderRadius: 12, background: a.gradient, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, position: "relative" }}>
                    {a.emoji}
                    <span style={{ position: "absolute", top: 4, left: 4, fontSize: 9, fontWeight: 800, color: a.catColor, background: a.catBg, borderRadius: 999, padding: "2px 6px" }}>{a.cat}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.text, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any, overflow: "hidden" }}>{a.title}</div>
                    <div style={{ fontSize: 11, color: C.secondary, marginTop: 5 }}>⏱ {a.min} okuma</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* 6. AI ASISTAN — ince banner, Kademe 9  */}
        {/* ═══════════════════════════════════════ */}
        <section style={{ padding: "0 16px" }}>
          <div style={{ background: "linear-gradient(135deg,#1E0B3B,#4C1D95)", borderRadius: 16, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 30, flexShrink: 0 }}>🤖</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 2 }}>Sorunuz mu var? AI Asistan 7/24</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Poodle'ınız için anında yanıt alın.</div>
            </div>
            <button onClick={() => go("/yourpoodle/ai-asistan")}
              style={{ height: 40, padding: "0 16px", background: "#fff", color: C.primary, borderRadius: 999, fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, fontFamily: "inherit" }}>
              Sor →
            </button>
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* 7. TESTİMONİAL (1 adet)                */}
        {/* ═══════════════════════════════════════ */}
        <section className="yph-section" style={{ background: "#fff", borderTop: `1px solid ${C.border}` }}>
          <div className="yph-inner">
            <div style={{ ...card, padding: 20 }}>
              <div style={{ fontSize: 36, color: C.amber, lineHeight: 1, marginBottom: 8, fontFamily: "Georgia,serif" }}>"</div>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, fontStyle: "italic", margin: "0 0 14px" }}>
                YourPoodle sayesinde Charlie'nin mamasını değiştirdik; 3 haftada tüyleri inanılmaz parladı. AI asistan da çok yardımcı oldu.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg,${C.darkPurple},${C.primary})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff", flexShrink: 0 }}>SK</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Selin K.</div>
                  <div style={{ fontSize: 13, color: C.amber }}>★★★★★</div>
                </div>
                <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: C.primary, background: C.lightPurple, borderRadius: 999, padding: "3px 10px" }}>Mama Bul</span>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* 8. SSS — 3 adet + Tümünü Gör          */}
        {/* ═══════════════════════════════════════ */}
        <section className="yph-section" style={{ background: C.bg, borderTop: `1px solid ${C.border}` }}>
          <div className="yph-inner">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: C.text, margin: 0 }}>Sık Sorulanlar</h2>
              <button onClick={() => go("/yourpoodle/rehber")}
                style={{ fontSize: 13, fontWeight: 700, color: C.primary, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                Tümünü Gör →
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {FAQ.map((f, i) => (
                <div key={i} style={{ ...card, padding: "14px 16px", cursor: "pointer" }} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: C.text, lineHeight: 1.4, flex: 1 }}>{f.q}</span>
                    <span style={{ fontSize: 18, color: C.primary, flexShrink: 0, fontWeight: 400, lineHeight: 1 }}>{openFaq === i ? "−" : "+"}</span>
                  </div>
                  {openFaq === i && (
                    <p style={{ fontSize: 13, color: C.secondary, margin: "10px 0 0", lineHeight: 1.7, borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>{f.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* 9. ÜYELİK / NEWSLETTER (tek promo)     */}
        {/* ═══════════════════════════════════════ */}
        <section style={{ padding: "0 16px 0" }}>
          {!isLoggedIn ? (
            /* Üye Ol banner */
            <div style={{ background: "linear-gradient(135deg,#F3EEFF,#FCE7F3)", borderRadius: 16, padding: "20px 18px", display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 36, flexShrink: 0 }}>🎁</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 4 }}>100 TL Bonus Bekliyor</div>
                <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.5 }}>Ücretsiz hesap aç, hemen kullan.</div>
              </div>
              <button onClick={() => go("/yourpoodle/giris")}
                style={{ height: 42, padding: "0 16px", background: C.primary, color: "#fff", borderRadius: 999, fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, fontFamily: "inherit" }}>
                Üye Ol
              </button>
            </div>
          ) : (
            /* Newsletter for logged-in users */
            <div style={{ background: `linear-gradient(135deg,${C.primary},#A855F7)`, borderRadius: 16, padding: "20px 18px", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📬</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 6 }}>Haftalık Poodle İpuçları</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginBottom: 14 }}>Her hafta uzman bakım önerileri ve topluluk haberleri.</div>
              {emailSent ? (
                <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 10, padding: 12, fontSize: 14, fontWeight: 700, color: "#fff" }}>✓ Teşekkürler! Sizi ekledik.</div>
              ) : (
                <div style={{ display: "flex", gap: 8 }}>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="E-posta adresiniz"
                    style={{ flex: 1, height: 44, borderRadius: 10, border: "none", padding: "0 14px", fontSize: 13, fontFamily: "inherit", outline: "none" }} />
                  <button onClick={async () => {
                      if (!email.includes("@")) return;
                      try { await fetch("/api/yp/email-subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) }); } catch {}
                      setEmailSent(true);
                    }}
                    style={{ height: 44, padding: "0 16px", borderRadius: 10, background: "#fff", border: "none", fontSize: 14, fontWeight: 800, color: C.primary, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                    Abone Ol
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* 10. GÜVEN ROZETLERİ                    */}
        {/* ═══════════════════════════════════════ */}
        <section className="yph-section" style={{ background: "#fff", borderTop: `1px solid ${C.border}` }}>
          <div className="yph-inner">
            <div className="yph-trust-grid">
              {[
                { icon: "🛡️", label: "Güvenilir Bilgi",  sub: "Veteriner onaylı" },
                { icon: "🔒", label: "%100 Güvenli",      sub: "256-bit SSL" },
                { icon: "🐩", label: "Poodle Odaklı",     sub: "Sadece Poodle" },
                { icon: "🎧", label: "7/24 Destek",       sub: "AI + uzman" },
              ].map(t => (
                <div key={t.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, textAlign: "center" }}>
                  <span style={{ fontSize: 22 }}>{t.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{t.label}</span>
                  <span style={{ fontSize: 10, color: C.secondary }}>{t.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* Kademe 8 — Platform Hakkında (görünür) */}
        {/* ═══════════════════════════════════════ */}
        <section style={{ padding: "0 16px 24px", borderTop: `1px solid ${C.border}`, background: C.bg }}>
          <div className="yph-inner" style={{ paddingTop: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 8 }}>YourPoodle Hakkında</div>
            <p style={{ fontSize: 13, color: C.secondary, lineHeight: 1.7, margin: 0 }}>
              YourPoodle, Türkiye'deki Toy Poodle sahipleri için tasarlanmış bir platformdur. Mama önerileri, bakım rehberleri, AI destekli sağlık asistanı ve Poodle topluluğunu tek çatı altında sunar. 50.000'den fazla Poodle sever bu platformu tercih etmektedir.
            </p>
          </div>
        </section>

      </div>{/* yph-page-pad */}

      {/* ── Mobile bottom nav ───────────────────────────── */}
      <div className="yph-btm-nav">
        <YPBottomNav />
      </div>

    </div>
  );
}
