import { useState, useEffect, type ReactNode, useRef, Fragment } from "react";
import { Link, useLocation } from "wouter";
import { useCustomer } from "@/contexts/CustomerContext";
import {
  ShoppingBag, BookOpen, Bot, Utensils, Wrench,
  PawPrint, Search, Heart, ShoppingCart, ChevronDown, X, User,
} from "lucide-react";
import YPFooter from "./YPFooter";

/* ─── Nav items ─────────────────────────────────────────── */
const NAV_LINKS = [
  { label: "Ana Sayfa",  href: "/yourpoodle",              Icon: PawPrint   },
  { label: "Mama Bul",   href: "/yourpoodle/mama-bul",     Icon: Utensils   },
  { label: "Rehber",     href: "/yourpoodle/rehber",       Icon: BookOpen   },
  { label: "Araçlar",    href: "/yourpoodle/bilgi",        Icon: Wrench     },
  { label: "AI Asistan", href: "/yourpoodle/ai-asistan",   Icon: Bot        },
  { label: "Mağaza",     href: "/yourpoodle/magaza",       Icon: ShoppingBag},
];

const DRAWER_LINKS_BASE = [
  { label: "Ana Sayfa",  href: "/yourpoodle" },
  { label: "Rehber",     href: "/yourpoodle/rehber" },
  { label: "Mama Bul",   href: "/yourpoodle/mama-bul" },
  { label: "Araçlar",    href: "/yourpoodle/bilgi" },
  { label: "AI Asistan", href: "/yourpoodle/ai-asistan" },
  { label: "Mağaza",     href: "/yourpoodle/magaza" },
  { label: "Sağlık",     href: "/yourpoodle/saglik" },
  { label: "Bakım",      href: "/yourpoodle/bakim" },
  { label: "Eğitim",     href: "/yourpoodle/egitim" },
  { label: "Topluluk",   href: "/yourpoodle/topluluk" },
  { label: "Etkinlik",   href: "/yourpoodle/etkinlikler" },
];

interface Props {
  children: ReactNode;
  activeLink?: string;
  bottomNavActive?: string;
  constrain?: boolean;
  authMode?: boolean;
}

function isActive(activeLink: string, href: string) {
  if (href === "/yourpoodle") return activeLink === "/yourpoodle" || activeLink === "" || activeLink === "/";
  return activeLink === href || activeLink.startsWith(href + "/");
}

export default function YPLayout({
  children, activeLink = "", bottomNavActive, constrain = true, authMode = false,
}: Props) {
  const effectiveBottomLink = bottomNavActive ?? activeLink;
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch]           = useState("");
  const [cartCount, setCartCount]     = useState(0);
  const [, navigate]                  = useLocation();
  const { isLoggedIn, customer }      = useCustomer();
  const profileRef = useRef<HTMLDivElement>(null);

  /* cart badge — reads YP localStorage cart (yp_cart_items) */
  useEffect(() => {
    const read = () => {
      try {
        const c = JSON.parse(localStorage.getItem("yp_cart_items") || "[]");
        setCartCount(Array.isArray(c) ? c.reduce((s: number, i: any) => s + (i.qty || 0), 0) : 0);
      } catch { setCartCount(0); }
    };
    read();
    window.addEventListener("storage", read);
    /* Aynı sekmedeki değişimleri de yakala */
    const timer = setInterval(read, 500);
    return () => { window.removeEventListener("storage", read); clearInterval(timer); };
  }, []);

  /* close profile dropdown on outside click */
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) { navigate(`/yourpoodle/magaza?q=${encodeURIComponent(search.trim())}`); setSearch(""); }
  };

  const initials = customer?.name?.slice(0, 1).toUpperCase() || "";

  return (
    <div style={{ fontFamily: "'Inter',-apple-system,sans-serif", minHeight: "100vh", background: "#FAFAFA" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');

        .yp-desktop-hdr { display: none !important; }
        .yp-mobile-hdr  { display: flex !important; }
        .yp-btm-nav     { display: block !important; }
        .yp-page-body   { padding-bottom: 80px; }

        @media (min-width: 900px) {
          .yp-desktop-hdr      { display: block !important; }
          .yp-mobile-hdr       { display: none !important; }
          .yp-btm-nav          { display: none !important; }
          .yp-mobile-cat-strip { display: none !important; }
          .yp-page-body        { padding-bottom: 48px !important; }
          .yp-constrain   { max-width: 1200px; margin: 0 auto; padding: 0 48px; }
          .yp-art-grid    { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 14px !important; }
          .yp-3col-grid   { display: grid !important; grid-template-columns: 1fr 1fr 1fr !important; gap: 14px !important; }
          .yp-prod-grid   { grid-template-columns: repeat(4,1fr) !important; }
          .yp-tools-grid  { display: grid !important; grid-template-columns: repeat(4,1fr) !important; gap: 12px !important; }
          .yp-2col-layout { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 24px !important; align-items: start; }
          .yp-hero-banner { border-radius: 20px; margin: 24px 0 !important; }
          .yp-section-title { font-size: 20px !important; }
        }

        .yp-nav-item { transition: background 0.15s, color 0.15s; cursor: pointer; }
        .yp-nav-item:hover { background: #F5F0FF !important; color: #7C3AED !important; }
        .yp-nav-item:hover svg { color: #7C3AED !important; }
        .yp-util-btn { transition: background 0.15s; cursor: pointer; }
        .yp-util-btn:hover { background: #F5F5F5 !important; }
        .yp-search-inp:focus { outline: none; border-color: #A78BFA !important; }
        .yp-profile-drop { animation: yp-fade-in 0.12s ease; }
        @keyframes yp-fade-in { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* ════════════ DESKTOP HEADER ════════════ */}
      <div className="yp-desktop-hdr" style={{ position: "sticky", top: 0, zIndex: 200 }}>

        {/* ── Duyuru çubuğu ── */}
        <div style={{ background: "#7022C4", color: "#fff", textAlign: "center", padding: "9px 20px", fontSize: 13.5, fontWeight: 500 }}>
          Toy Poodle dünyasının adresi — 500₺ üzeri ücretsiz kargo 🚚
        </div>

        {/* ── Ana satır ── */}
        <div style={{ background: "#fff", borderBottom: "1px solid #F3F4F6", padding: "14px 40px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 24 }}>

            {/* Logo */}
            <Link href="/yourpoodle">
              <div style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", flexShrink: 0 }}>
                <span style={{ fontFamily: "'Pacifico', cursive", fontSize: 28, color: "#111", lineHeight: 1 }}>YourPoodle</span>
                <span style={{ fontSize: 20 }}>🐾</span>
              </div>
            </Link>

            {/* Arama */}
            {!authMode && (
              <form onSubmit={handleSearch} style={{ flex: 1, position: "relative" }}>
                <Search size={17} color="#9CA3AF" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input
                  className="yp-search-inp"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Mama, aksesuar veya rehber ara..."
                  style={{ width: "100%", height: 46, borderRadius: 9999, border: "none", background: "#F3F4F6", paddingLeft: 50, paddingRight: 20, fontSize: 14, color: "#374151", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
                />
              </form>
            )}

            {/* Sağ aksiyonlar */}
            {!authMode && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                {isLoggedIn ? (
                  <div ref={profileRef} style={{ position: "relative" }}>
                    <button
                      className="yp-util-btn"
                      onClick={() => setProfileOpen(o => !o)}
                      style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px 4px 4px", borderRadius: 9999, border: "1.5px solid #E5E7EB", background: "#fff", cursor: "pointer" }}
                    >
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#7022C4,#A855F7)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>{initials || "🐾"}</span>
                      </div>
                      <ChevronDown size={13} color="#9CA3AF" strokeWidth={2} style={{ transform: profileOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
                    </button>
                    {profileOpen && (
                      <div className="yp-profile-drop" style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "#fff", borderRadius: 16, boxShadow: "0 8px 32px rgba(112,34,196,0.18)", border: "1px solid #EDE9FE", minWidth: 180, zIndex: 300, overflow: "hidden" }}>
                        {[
                          { label: "👤 Profilim",         href: "/hesabim" },
                          { label: "📦 Siparişlerim",     href: "/yourpoodle/siparislerim" },
                          { label: "🐾 Köpek Profilim",   href: "/yourpoodle/p/olustur" },
                          { label: "❤️ Favorilerim",      href: "/favoriler" },
                          { label: "🚪 Çıkış Yap",        href: "/giris?logout=1" },
                        ].map(({ label, href }) => (
                          <button key={href} onClick={() => { navigate(href); setProfileOpen(false); }}
                            style={{ display: "block", width: "100%", padding: "11px 18px", fontSize: 13, fontWeight: 600, color: "#374151", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}
                            onMouseEnter={e => (e.currentTarget.style.background = "#F5F0FF")}
                            onMouseLeave={e => (e.currentTarget.style.background = "none")}
                          >{label}</button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <button onClick={() => navigate("/yourpoodle/giris")}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#374151", fontFamily: "inherit", padding: "0 4px", whiteSpace: "nowrap" }}>
                      Giriş Yap
                    </button>
                    <button onClick={() => navigate("/yourpoodle/giris")}
                      style={{ padding: "10px 22px", borderRadius: 9999, border: "none", background: "#7022C4", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                      Üye Ol
                    </button>
                  </>
                )}

                {/* Favoriler */}
                <button className="yp-util-btn" onClick={() => navigate("/favoriler")}
                  style={{ width: 42, height: 42, borderRadius: "50%", border: "1.5px solid #E5E7EB", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                  <Heart size={18} color="#374151" strokeWidth={1.8} />
                </button>

                {/* Sepet */}
                <button className="yp-util-btn" onClick={() => navigate("/yourpoodle/sepet")}
                  style={{ width: 42, height: 42, borderRadius: "50%", border: "1.5px solid #E5E7EB", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, position: "relative" }}>
                  <ShoppingCart size={18} color="#374151" strokeWidth={1.8} />
                  {cartCount > 0 && (
                    <span style={{ position: "absolute", top: -3, right: -3, background: "#7022C4", color: "#fff", fontSize: 9, fontWeight: 800, width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff" }}>
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Alt nav satırı ── */}
        {!authMode && (
          <nav style={{ background: "#fff", borderBottom: "1px solid #F3F4F6", padding: "0 40px" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "center", alignItems: "center", height: 52 }}>
              {([
                { label: "Mağaza",     href: "/yourpoodle/magaza",     Icon: ShoppingBag },
                { label: "Club",       href: "/yourpoodle/club",        Icon: PawPrint    },
                { label: "AI Asistan", href: "/yourpoodle/ai-asistan",  Icon: Bot         },
                { label: "Rehber",     href: "/yourpoodle/rehber",      Icon: BookOpen    },
              ] as const).map(({ label, href, Icon }, i) => {
                const active = isActive(activeLink, href);
                return (
                  <Fragment key={href}>
                    {i > 0 && <span style={{ color: "#D1D5DB", margin: "0 14px", fontSize: 16, lineHeight: 1, userSelect: "none" }}>•</span>}
                    <Link href={href}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, padding: active ? "7px 18px" : "7px 10px", borderRadius: 9999, background: active ? "#7022C4" : "transparent", cursor: "pointer", transition: "background 0.15s" }}
                        onMouseEnter={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = "#F5F0FF"; }}
                        onMouseLeave={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}>
                        <Icon size={15} color={active ? "#fff" : "#7022C4"} strokeWidth={active ? 2.5 : 2} />
                        <span style={{ fontSize: 14, fontWeight: 700, color: active ? "#fff" : "#111", whiteSpace: "nowrap", fontFamily: "inherit" }}>{label}</span>
                      </div>
                    </Link>
                  </Fragment>
                );
              })}
            </div>
          </nav>
        )}
      </div>

      {/* ════════════ MOBILE DRAWER ════════════ */}
      {drawerOpen && (
        <div onClick={() => setDrawerOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 299, backdropFilter: "blur(2px)" }} />
      )}
      <nav style={{
        position: "fixed", top: 0, left: 0, height: "100%", width: 280, background: "#fff", zIndex: 300,
        transform: drawerOpen ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.24s ease",
        boxShadow: "4px 0 28px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 18px 14px", borderBottom: "1px solid #f2f2f2" }}>
          <span style={{ fontFamily: "'Pacifico', cursive", fontSize: 20, color: "#6B21A8" }}>YourPoodle 🐾</span>
          <button onClick={() => setDrawerOpen(false)}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32 }}>
            <X size={20} color="#666" />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {[
            ...DRAWER_LINKS_BASE,
            ...(isLoggedIn ? [{ label: "Siparişlerim", href: "/yourpoodle/siparislerim" }] : []),
          ].map(l => (
            <button key={l.href} onClick={() => { navigate(l.href); setDrawerOpen(false); }}
              style={{
                display: "block", width: "100%", padding: "13px 20px", fontSize: 15, fontWeight: 600,
                color: isActive(activeLink, l.href) ? "#7C3AED" : "#222",
                background: isActive(activeLink, l.href) ? "#F5F0FF" : "transparent",
                border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit",
              }}>{l.label}</button>
          ))}
        </div>
        <div style={{ padding: "16px 18px", borderTop: "1px solid #f2f2f2" }}>
          <button onClick={() => { navigate(isLoggedIn ? "/hesabim" : "/yourpoodle/giris"); setDrawerOpen(false); }}
            style={{ width: "100%", height: 46, borderRadius: 12, background: "linear-gradient(135deg,#7C3AED,#A855F7)", border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            {isLoggedIn ? "👤 Hesabım" : "Ücretsiz Başla"}
          </button>
        </div>
      </nav>

      {/* ════════════ MOBILE HEADER ════════════ */}
      <header className="yp-mobile-hdr" style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "linear-gradient(135deg, #F5F0FF 0%, #EDE9FE 100%)",
        alignItems: "center",
        justifyContent: authMode ? "center" : "space-between",
        padding: "8px 12px",
        height: 58,
      }}>
        {authMode ? (
          <Link href="/yourpoodle">
            <span style={{ fontFamily: "'Pacifico', cursive", fontSize: 20, color: "#6B21A8", cursor: "pointer" }}>YourPoodle 🐾</span>
          </Link>
        ) : (
          <div style={{
            width: "100%", display: "flex", alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Link href="/yourpoodle">
                <span style={{ fontFamily: "'Pacifico', cursive", fontSize: 17, color: "#6B21A8", cursor: "pointer" }}>YourPoodle 🐾</span>
              </Link>
              <button onClick={() => setDrawerOpen(true)}
                style={{ background: "#EDE9FE", border: "none", cursor: "pointer", padding: "5px 8px", fontSize: 18, color: "#7C3AED", borderRadius: 10, lineHeight: 1 }}>
                ☰
              </button>
            </div>
            <button onClick={() => navigate(isLoggedIn ? "/hesabim" : "/yourpoodle/giris")}
              style={{ padding: "5px 11px", borderRadius: 20, border: "1.5px solid #7C3AED", background: "#F5F0FF", color: "#7C3AED", fontSize: 11.5, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit" }}>
              {isLoggedIn ? "Hesabım" : "Giriş"}
            </button>
          </div>
        )}
      </header>

      {/* ════════════ MOBILE CATEGORY STRIP ════════════ */}
      {!authMode && (
        <div className="yp-mobile-cat-strip" style={{
          display: "flex", overflowX: "auto", gap: 8,
          padding: "8px 12px", background: "#fff",
          borderBottom: "1px solid #F3F4F6",
          position: "sticky", top: 58, zIndex: 99,
        }}>
          {([
            { label: "Mağaza",     href: "/yourpoodle/magaza",      emoji: "🛍️" },
            { label: "Club",       href: "/yourpoodle/club",         emoji: "🐾" },
            { label: "AI Asistan", href: "/yourpoodle/ai-asistan",   emoji: "🤖" },
            { label: "Rehber",     href: "/yourpoodle/rehber",       emoji: "📖" },
          ] as const).map(({ label, href, emoji }) => {
            const active = isActive(effectiveBottomLink, href);
            return (
              <button key={href} onClick={() => navigate(href)}
                style={{
                  flexShrink: 0, display: "flex", alignItems: "center", gap: 5,
                  padding: "6px 14px", borderRadius: 20, border: "1.5px solid",
                  borderColor: active ? "#7C3AED" : "#E5E7EB",
                  background: active ? "#7C3AED" : "#fff",
                  color: active ? "#fff" : "#555",
                  fontSize: 12.5, fontWeight: 700, cursor: "pointer",
                  fontFamily: "inherit", whiteSpace: "nowrap",
                }}>
                <span style={{ fontSize: 14 }}>{emoji}</span> {label}
              </button>
            );
          })}
        </div>
      )}

      {/* ════════════ PAGE CONTENT ════════════ */}
      <div className="yp-page-body">
        <div className={constrain ? "yp-constrain" : ""}>
          {children}
        </div>
        <YPFooter />
      </div>

      {/* ════════════ MOBILE BOTTOM NAV ════════════ */}
      {!authMode && (
        <div className="yp-btm-nav">
          <nav style={{
            position: "fixed", bottom: 0, left: 0, right: 0,
            background: "#fff", borderTop: "1px solid #f0f0f0",
            boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
            height: 72, display: "flex", alignItems: "center", zIndex: 200,
            padding: "0 4px", paddingBottom: "env(safe-area-inset-bottom,0px)",
          }}>
            {/* Sol 2 tab */}
            {[
              { label: "Ana Sayfa", href: "/yourpoodle",          Icon: PawPrint  },
              { label: "Mama Bul",  href: "/yourpoodle/mama-bul", Icon: Utensils  },
            ].map(({ label, href, Icon }) => {
              const active = isActive(effectiveBottomLink, href);
              return (
                <button key={href} onClick={() => navigate(href)}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "none", border: "none", cursor: "pointer", flex: 1, color: active ? "#7C3AED" : "#aaa", transition: "color 0.15s", padding: "4px 2px" }}>
                  <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                  <span style={{ fontSize: 9, fontWeight: active ? 800 : 600, fontFamily: "inherit", whiteSpace: "nowrap" }}>{label}</span>
                  {active && <div style={{ width: 14, height: 2.5, borderRadius: 2, background: "#7C3AED", marginTop: -1 }} />}
                </button>
              );
            })}

            {/* Merkez — Sepet butonu */}
            {(() => {
              const cartActive = effectiveBottomLink.startsWith("/yourpoodle/sepet") || effectiveBottomLink.startsWith("/yourpoodle/odeme");
              return (
                <button onClick={() => navigate("/yourpoodle/sepet")}
                  aria-label="Sepetim"
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", flex: "0 0 auto", padding: 0 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: "50%",
                    background: cartActive
                      ? "linear-gradient(135deg,#5B21B6,#7C3AED)"
                      : "linear-gradient(135deg,#7C3AED,#A855F7)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 4px 16px rgba(124,58,237,0.4)",
                    marginTop: -22,
                    border: "3px solid #fff",
                    position: "relative",
                  }}>
                    <ShoppingCart size={22} color="#fff" strokeWidth={2.2} />
                    {cartCount > 0 && (
                      <span style={{
                        position: "absolute", top: -2, right: -2,
                        minWidth: 18, height: 18, borderRadius: 9,
                        background: "#EF4444", color: "#fff",
                        fontSize: 9, fontWeight: 900,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        padding: "0 4px", border: "2px solid #fff",
                        fontFamily: "inherit", boxSizing: "border-box",
                      }}>{cartCount > 99 ? "99+" : cartCount}</span>
                    )}
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: cartActive ? "#7C3AED" : "#555", fontFamily: "inherit" }}>Sepetim</span>
                </button>
              );
            })()}

            {/* Sağ 2 tab */}
            {[
              { label: "Mağaza", href: "/yourpoodle/magaza",  Icon: ShoppingBag },
              { label: "Rehber", href: "/yourpoodle/rehber",  Icon: BookOpen    },
            ].map(({ label, href, Icon }) => {
              const active = isActive(effectiveBottomLink, href);
              return (
                <button key={href} onClick={() => navigate(href)}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "none", border: "none", cursor: "pointer", flex: 1, color: active ? "#7C3AED" : "#aaa", transition: "color 0.15s", padding: "4px 2px" }}>
                  <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                  <span style={{ fontSize: 9, fontWeight: active ? 800 : 600, fontFamily: "inherit", whiteSpace: "nowrap" }}>{label}</span>
                  {active && <div style={{ width: 14, height: 2.5, borderRadius: 2, background: "#7C3AED", marginTop: -1 }} />}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}
