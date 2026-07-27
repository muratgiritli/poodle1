import { useState, useEffect, type ReactNode, useRef, Fragment } from "react";
import { Link, useLocation } from "wouter";
import { useCustomer } from "@/contexts/CustomerContext";
import { IS_YP } from "@/lib/store";
import {
  ShoppingBag, BookOpen, Bot, Utensils, Wrench,
  PawPrint, Search, Heart, ShoppingCart, ChevronDown, X, Users,
} from "lucide-react";
import YPFooter from "./YPFooter";
import YPBottomNav from "@/components/YPBottomNav";

/**
 * Route prefix: "" on yourpoodle.com (canonical routes at /magaza etc.),
 * "/yourpoodle" on dev/other hosts (routes at /yourpoodle/magaza etc.)
 */
const BASE = IS_YP ? "" : "/yourpoodle";

/* ─── Path helpers ──────────────────────────────────────────── */
function normalizePath(p: string): string {
  // Strip /yourpoodle prefix so /yourpoodle/club and /club both equal "/club"
  if (p === "/yourpoodle") return "/";
  return p.replace(/^\/yourpoodle(?=\/|$)/, "") || "/";
}
function isActive(activeLink: string, href: string) {
  const na = normalizePath(activeLink);
  const nh = normalizePath(href);
  if (nh === "/" || nh === "") return na === "/" || na === "" || na === "/yourpoodle";
  return na === nh || na.startsWith(nh + "/");
}

/* ─── Nav items ─────────────────────────────────────────────── */
const DRAWER_LINKS_BASE = [
  { label: "Ana Sayfa",   href: BASE || "/" },
  { label: "Rehber",      href: `${BASE}/rehber` },
  { label: "Mama Bul",    href: `${BASE}/mama-bul` },
  { label: "Araçlar",     href: "/yourpoodle/bilgi" },
  { label: "AI Asistan",  href: `${BASE}/ai-asistan` },
  { label: "Mağaza",      href: `${BASE}/magaza` },
  { label: "Sağlık",      href: "/yourpoodle/saglik" },
  { label: "Bakım",       href: "/yourpoodle/bakim" },
  { label: "Eğitim",      href: "/yourpoodle/egitim" },
  { label: "Topluluk",    href: "/yourpoodle/topluluk" },
  { label: "Etkinlik",    href: "/yourpoodle/etkinlikler" },
  { label: "Bildirimler", href: "/yourpoodle/bildirimler" },
  { label: "Ayarlar",     href: "/yourpoodle/ayarlar" },
];

interface Props {
  children: ReactNode;
  activeLink?: string;
  bottomNavActive?: string;
  constrain?: boolean;
  authMode?: boolean;
  hideFooter?: boolean;
  hideHeader?: boolean;
}

export default function YPLayout({
  children, activeLink = "", bottomNavActive, constrain = true, authMode = false, hideFooter = false, hideHeader = false,
}: Props) {
  const effectiveBottomLink = bottomNavActive ?? activeLink;
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch]           = useState("");
  const [cartCount, setCartCount]     = useState(0);
  const [, navigate]                  = useLocation();
  const { isLoggedIn, customer }      = useCustomer();
  const profileRef = useRef<HTMLDivElement>(null);

  /* cart badge — reads jet55_cart (same key as CartContext + YPBottomNav) */
  useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem("jet55_cart");
        if (!raw) { setCartCount(0); return; }
        const b = JSON.parse(raw);
        setCartCount(
          b && typeof b === "object" && !Array.isArray(b)
            ? Object.values(b as Record<string, number>).reduce((s: number, q) => s + (Number(q) || 0), 0)
            : 0
        );
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
    if (search.trim()) { navigate(`${BASE}/ara?q=${encodeURIComponent(search.trim())}`); setSearch(""); }
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

        /* ── Responsive page wrappers ──────────────────────── */
        /* Account inner: mobile 480px, desktop 860px */
        .yp-acct { max-width: 480px; margin: 0 auto; width: 100%; }

        /* Cat grid: mobile flex-col, desktop 2-col */
        .yp-cat-grid { display: flex; flex-direction: column; }

        /* Section grid: mobile stack, desktop 2-col */
        .yp-section-grid { }

        /* Content columns: max 480px centered on mobile/tablet (key tablet fix) */
        .yp-pw          { max-width: 480px; margin: 0 auto; }
        .yp-feed-center { max-width: 480px; margin: 0 auto; }
        .yp-ai-center   { max-width: 480px; margin: 0 auto; }

        /* Sticky AI input: mobile offset for bottom nav, desktop flush */
        @media (min-width: 900px) {
          .yp-ai-sticky-bar { bottom: 0 !important; }
          .yp-ai-scroll     { padding-bottom: 0 !important; }
        }

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

          /* Page content wrapper for constrain=false pages */
          .yp-pw { max-width: 1200px; margin: 0 auto; }

          /* Magaza: 2-col category grid */
          .yp-cat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px; align-items: start; }

          /* Rehber: 2-col sections grid */
          .yp-section-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 24px; align-items: start; }

          /* Club/AI: centered feed column */
          .yp-feed-center { max-width: 720px; margin: 0 auto; }
          .yp-ai-center   { max-width: 800px; margin: 0 auto; }

          /* Account pages wider on tablet/desktop */
          .yp-acct { max-width: 860px; }


          /* Quick pills: 4-col on desktop (Rehber) */
          .yp-pill-row { display: grid !important; grid-template-columns: repeat(4,1fr) !important; gap: 12px !important; }
        }

        @media (min-width: 1100px) {
          .yp-cat-grid { grid-template-columns: repeat(3,1fr); }
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
      {!hideHeader && <div className="yp-desktop-hdr" style={{ position: "sticky", top: 0, zIndex: 200 }}>

        {/* ── Duyuru çubuğu — auth sayfalarında gösterilmez ── */}
        {!authMode && (
          <div style={{ background: "#7022C4", color: "#fff", textAlign: "center", padding: "9px 20px", fontSize: 13.5, fontWeight: 500 }}>
            🎁 Yeni üyelere 100 TL hoş geldin bonusu
          </div>
        )}

        {/* ── Ana satır (logo + nav + search + auth) ── */}
        <div style={{ background: "#fff", borderBottom: "1px solid #F3F4F6", padding: "0 40px" }}>
          <div style={{ maxWidth: 1260, margin: "0 auto", display: "flex", alignItems: "center", height: 64, gap: 20 }}>

            {/* Logo */}
            <Link href={BASE || "/"}>
              <img
                src="/images/yourpoodle-logo.jpg"
                alt="YourPoodle"
                style={{ height: 42, width: "auto", objectFit: "contain", cursor: "pointer", flexShrink: 0, display: "block" }}
              />
            </Link>

            {/* Center nav links */}
            {!authMode && (
              <nav style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: 16 }}>
                {([
                  { label: "Mağaza",          href: `${BASE}/magaza` },
                  { label: "Hizmetler",        href: `${BASE}/hizmetler` },
                  { label: "Rehber",           href: `${BASE}/rehber` },
                  { label: "Topluluk",         href: `${BASE}/club` },
                  { label: "Benim Poodle'ım",  href: `${BASE}/benim-poodleim` },
                ] as { label: string; href: string }[]).map(({ label, href }) => {
                  const active = isActive(activeLink, href);
                  return (
                    <Link key={href} href={href}>
                      <div style={{
                        padding: "6px 12px", borderRadius: 8, cursor: "pointer",
                        fontSize: 14, fontWeight: active ? 700 : 500,
                        color: active ? "#7022C4" : "#374151",
                        background: active ? "#F5F0FF" : "transparent",
                        transition: "background 0.15s, color 0.15s",
                        whiteSpace: "nowrap",
                      }}
                        onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = "#F9F5FF"; (e.currentTarget as HTMLElement).style.color = "#7022C4"; } }}
                        onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#374151"; } }}>
                        {label}
                      </div>
                    </Link>
                  );
                })}
              </nav>
            )}

            {/* Spacer */}
            <div style={{ flex: 1 }} />


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
                      <div className="yp-profile-drop" style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "#fff", borderRadius: 16, boxShadow: "0 8px 32px rgba(112,34,196,0.18)", border: "1px solid #EDE9FE", minWidth: 200, zIndex: 300, overflow: "hidden" }}>
                        {[
                          { label: "👤 Profilim",           href: "/hesabim" },
                          { label: "📦 Siparişlerim",       href: "/hesabim/siparisler" },
                          { label: "🐾 Benim Poodle'ım",    href: `${BASE}/benim-poodleim` },
                          { label: "❤️ Favorilerim",        href: "/favoriler" },
                          { label: "🚪 Çıkış Yap",          href: "/giris?logout=1" },
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
                    <button onClick={() => navigate(`${BASE}/giris`)}
                      style={{ background: "none", border: "1.5px solid #D1D5DB", borderRadius: 9999, cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#374151", fontFamily: "inherit", padding: "8px 18px", whiteSpace: "nowrap" }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = "#7022C4")}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = "#D1D5DB")}>
                      Giriş Yap
                    </button>
                    <button onClick={() => navigate(`${BASE}/uye-ol`)}
                      style={{ padding: "9px 20px", borderRadius: 9999, border: "none", background: "#7022C4", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#5A32A3")}
                      onMouseLeave={e => (e.currentTarget.style.background = "#7022C4")}>
                      Üye Ol
                    </button>
                  </>
                )}

                {/* Sepet */}
                <button className="yp-util-btn" onClick={() => navigate(`${BASE}/sepet`)}
                  style={{ width: 42, height: 42, borderRadius: "50%", border: "1.5px solid #E5E7EB", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, position: "relative" }}>
                  <ShoppingCart size={18} color="#374151" strokeWidth={1.8} />
                  {cartCount > 0 && (
                    <span style={{ position: "absolute", top: -3, right: -3, background: "#EF4444", color: "#fff", fontSize: 9, fontWeight: 800, width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff" }}>
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>}

      {/* ════════════ MOBILE DRAWER ════════════ */}
      {drawerOpen && (
        <div onClick={() => setDrawerOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 299, backdropFilter: "blur(2px)" }} />
      )}
      <nav
        aria-hidden={!drawerOpen}
        style={{
          position: "fixed", top: 0, left: 0, height: "100%", width: 280, background: "#fff", zIndex: 300,
          transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.24s ease, visibility 0s linear " + (drawerOpen ? "0s" : "0.24s"),
          visibility: drawerOpen ? "visible" : "hidden",
          boxShadow: "4px 0 28px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column",
        }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 18px 14px", borderBottom: "1px solid #f2f2f2" }}>
          <img src="/images/yourpoodle-logo.jpg" alt="YourPoodle" style={{ height: 30, width: "auto", objectFit: "contain" }} />
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
      {!hideHeader && <header className="yp-mobile-hdr" style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "#fff",
        borderBottom: "1px solid #F3F4F6",
        alignItems: "center",
        justifyContent: authMode ? "center" : "space-between",
        padding: "0 12px",
        height: 60,
        boxSizing: "border-box",
      }}>
        {authMode ? (
          <Link href={BASE || "/"}>
            <img src="/images/yourpoodle-logo.jpg" alt="YourPoodle" style={{ height: 34, width: "auto", objectFit: "contain", cursor: "pointer" }} />
          </Link>
        ) : (
          <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {/* Left: logo only — same as homepage */}
            <Link href={BASE || "/"}>
              <img src="/images/yourpoodle-logo.jpg" alt="YourPoodle"
                style={{ height: 34, width: "auto", objectFit: "contain", cursor: "pointer" }} />
            </Link>

            {/* Right: search · account · cart — same icon cluster as homepage */}
            <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
              {/* Account */}
              <button onClick={() => navigate(isLoggedIn ? "/hesabim" : `${BASE}/giris`)}
                aria-label={isLoggedIn ? "Profilim" : "Giriş yap"}
                style={{ width: 44, height: 44, background: "none", border: "none", cursor: "pointer",
                         display: "flex", alignItems: "center", justifyContent: "center",
                         borderRadius: 8, color: isLoggedIn ? "#7C3AED" : "#374151",
                         gap: 4 }}>
                {isLoggedIn ? (
                  <div style={{ width: 26, height: 26, borderRadius: "50%",
                                background: "linear-gradient(135deg,#7022C4,#A855F7)",
                                display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>
                      {initials || "🐾"}
                    </span>
                  </div>
                ) : (
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                )}
              </button>
              {/* Cart */}
              <button onClick={() => navigate(`${BASE}/sepet`)} aria-label="Sepetim"
                style={{ width: 44, height: 44, background: "none", border: "none", cursor: "pointer",
                         display: "flex", alignItems: "center", justifyContent: "center",
                         borderRadius: 8, color: "#374151", position: "relative" }}>
                <ShoppingCart size={20} strokeWidth={2} />
                {cartCount > 0 && (
                  <span style={{ position: "absolute", top: 6, right: 6,
                                 background: "#7C3AED", color: "#fff",
                                 fontSize: 9, fontWeight: 900,
                                 width: 16, height: 16, borderRadius: "50%",
                                 display: "flex", alignItems: "center", justifyContent: "center",
                                 border: "1.5px solid #fff" }}>
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </header>}

      {/* ════════════ MOBILE CATEGORY TABS (same as homepage) ════════════ */}
      {!hideHeader && !authMode && (
        <nav className="yp-mobile-hdr" aria-label="Kategori menüsü" style={{
          background: "#fff", borderBottom: "1px solid #F3F4F6",
          overflowX: "auto", display: "flex", padding: "0 4px",
          scrollbarWidth: "none", position: "sticky", top: 60, zIndex: 99,
        }}>
          {([
            { label: "Mağaza",     href: `${BASE}/magaza` },
            { label: "Mama Bul",   href: `${BASE}/mama-bul` },
            { label: "Rehber",     href: `${BASE}/rehber` },
            { label: "AI Asistan", href: `${BASE}/ai-asistan` },
            { label: "Club",       href: `${BASE}/club` },
          ] as const).map(({ label, href }) => {
            const active = isActive(effectiveBottomLink, href);
            return (
              <button key={href} onClick={() => navigate(href)}
                style={{
                  flex: "none", padding: "12px 10px", fontSize: 14, fontWeight: active ? 700 : 500,
                  color: active ? "#7C3AED" : "#111827", background: "none", border: "none",
                  borderBottom: `2.5px solid ${active ? "#7C3AED" : "transparent"}`,
                  cursor: "pointer", whiteSpace: "nowrap", minHeight: 44,
                  display: "flex", alignItems: "center", fontFamily: "inherit",
                  transition: "color 0.15s, border-color 0.15s",
                }}>
                {label}
              </button>
            );
          })}
        </nav>
      )}

      {/* ════════════ PAGE CONTENT ════════════ */}
      <div className="yp-page-body">
        <div className={constrain ? "yp-constrain" : ""}>
          {children}
        </div>
        {!hideFooter && !hideHeader && !authMode && <YPFooter />}
      </div>

      {/* ════════════ UNIFIED MOBILE BOTTOM NAV ════════════ */}
      {!authMode && <YPBottomNav />}
    </div>
  );
}
