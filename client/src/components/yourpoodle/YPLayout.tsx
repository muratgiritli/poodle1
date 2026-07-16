import { useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useCustomer } from "@/contexts/CustomerContext";
import { ShoppingBag, BookOpen, Bot, Utensils, Wrench } from "lucide-react";
import YPFooter from "./YPFooter";

// Primary nav — 5 items shown everywhere
const NAV_LINKS = [
  { label: "Rehber",     href: "/yourpoodle/rehber",     Icon: BookOpen },
  { label: "Mama Bul",   href: "/yourpoodle/mama-bul",   Icon: Utensils },
  { label: "Ara\u00e7lar",    href: "/yourpoodle/bilgi",      Icon: Wrench },
  { label: "AI Asistan", href: "/yourpoodle/ai-asistan", Icon: Bot },
  { label: "Ma\u011faza",     href: "/yourpoodle/magaza",     Icon: ShoppingBag },
];

// Drawer — all links including secondary ones
const DRAWER_LINKS = [
  { label: "Ana Sayfa",  href: "/" },
  { label: "Rehber",     href: "/yourpoodle/rehber" },
  { label: "Mama Bul",   href: "/yourpoodle/mama-bul" },
  { label: "Ara\u00e7lar",    href: "/yourpoodle/bilgi" },
  { label: "AI Asistan", href: "/yourpoodle/ai-asistan" },
  { label: "Ma\u011faza",     href: "/yourpoodle/magaza" },
  { label: "Sa\u011fl\u0131k",     href: "/yourpoodle/saglik" },
  { label: "Bak\u0131m",      href: "/yourpoodle/bakim" },
  { label: "E\u011fitim",     href: "/yourpoodle/egitim" },
  { label: "Topluluk",   href: "/yourpoodle/topluluk" },
  { label: "Etkinlik",   href: "/yourpoodle/etkinlikler" },
];

interface Props {
  children: ReactNode;
  activeLink?: string;
  /** Override which bottom-nav tab appears active (when page has no matching tab) */
  bottomNavActive?: string;
  /** Set false for full-bleed pages (AI chat, wizard) that manage their own layout */
  constrain?: boolean;
  /** Auth-mode: simplified header (logo only), no bottom nav — use on /giris and auth pages */
  authMode?: boolean;
}

export default function YPLayout({ children, activeLink = "", bottomNavActive, constrain = true, authMode = false }: Props) {
  const effectiveBottomLink = bottomNavActive ?? activeLink;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [, navigate] = useLocation();
  const { isLoggedIn } = useCustomer();

  return (
    <div style={{ fontFamily: "'Inter',-apple-system,sans-serif", minHeight: "100vh", background: "#FAFAFA" }}>
      <style>{`
        /* ── responsive layout ── */
        .yp-desktop-hdr { display: none !important; }
        .yp-mobile-hdr  { display: flex !important; }
        .yp-btm-nav     { display: block !important; }
        .yp-page-body   { padding-bottom: 80px; }
        @media (min-width: 900px) {
          .yp-desktop-hdr { display: flex !important; }
          .yp-mobile-hdr  { display: none !important; }
          .yp-btm-nav     { display: none !important; }
          .yp-page-body   { padding-bottom: 48px !important; }
          .yp-constrain   { max-width: 1200px; margin: 0 auto; padding: 0 48px; }
          /* content grids */
          .yp-art-grid    { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 14px !important; }
          .yp-3col-grid   { display: grid !important; grid-template-columns: 1fr 1fr 1fr !important; gap: 14px !important; }
          .yp-prod-grid   { grid-template-columns: repeat(4,1fr) !important; }
          .yp-tools-grid  { display: grid !important; grid-template-columns: repeat(4,1fr) !important; gap: 12px !important; }
          .yp-2col-layout { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 24px !important; align-items: start; }
          .yp-hero-banner { border-radius: 20px; margin: 24px 0 !important; }
          .yp-section-title { font-size: 20px !important; }
        }
      `}</style>

      {/* ──────────── DESKTOP HEADER ──────────── */}
      <header className="yp-desktop-hdr" style={{
        position: "sticky", top: 0, zIndex: 200,
        background: "#fff", borderBottom: "1px solid #F0F0F0",
        alignItems: "center",
        height: 60,
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", gap: 32, height: "100%", width: "100%" }}>
          <Link href="/">
            <div style={{ display: "flex", alignItems: "center", cursor: "pointer", flexShrink: 0 }}>
              <img src="/yourpoodle-logo.jpg" alt="YourPoodle" style={{ height: 38, width: "auto", objectFit: "contain" }} />
            </div>
          </Link>

          {!authMode && (
            <>
              <nav style={{ display: "flex", gap: 4, alignItems: "center", flex: 1, justifyContent: "center" }}>
                {NAV_LINKS.map(l => {
                  const isActive = activeLink === l.href || activeLink.startsWith(l.href);
                  return (
                    <Link key={l.href} href={l.href}>
                      <span
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 6,
                          padding: "7px 16px", borderRadius: 20,
                          fontSize: 13.5, fontWeight: 600,
                          cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
                          color: isActive ? "#7C3AED" : "#555",
                          background: isActive ? "#F5F3FF" : "transparent",
                          border: isActive ? "1.5px solid #E9D5FF" : "1.5px solid transparent",
                        }}
                        onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = "#F9F9F9"; (e.currentTarget as HTMLElement).style.color = "#333"; } }}
                        onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#555"; } }}
                      >{l.label}</span>
                    </Link>
                  );
                })}
              </nav>
              <div style={{ display: "flex", gap: 8, flexShrink: 0, alignItems: "center" }}>
                <button onClick={() => navigate(isLoggedIn ? "/hesabim" : "/yourpoodle/giris")}
                  style={{
                    padding: "7px 18px", borderRadius: 20, border: "1.5px solid #E5E7EB",
                    background: "#fff", fontSize: 13.5, fontWeight: 700,
                    color: isLoggedIn ? "#16A34A" : "#555",
                    cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit",
                  }}>
                  {isLoggedIn ? "Hesab\u0131m" : "Giri\u015f Yap"}
                </button>
                {!isLoggedIn && (
                  <button onClick={() => navigate("/yourpoodle/giris")}
                    style={{
                      padding: "7px 18px", borderRadius: 20, border: "none",
                      background: "linear-gradient(135deg,#7C3AED,#A855F7)",
                      fontSize: 13.5, fontWeight: 700, color: "#fff",
                      cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit",
                    }}>
                    Ücretsiz Başla
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </header>

      {/* ──────────── MOBILE DRAWER ──────────── */}
      {drawerOpen && (
        <div onClick={() => setDrawerOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 299, backdropFilter: "blur(2px)" }} />
      )}
      <nav style={{
        position: "fixed", top: 0, left: 0, height: "100%", width: 280, background: "#fff", zIndex: 300,
        transform: drawerOpen ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.24s ease",
        boxShadow: "4px 0 28px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 18px 14px", borderBottom: "1px solid #f2f2f2" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src="/yourpoodle-logo.jpg" alt="YourPoodle" style={{ height: 30, width: "auto", objectFit: "contain" }} />
          </div>
          <button onClick={() => setDrawerOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: "#666", padding: 6 }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {DRAWER_LINKS.map(l => (
            <button key={l.href} onClick={() => { navigate(l.href); setDrawerOpen(false); }}
              style={{
                display: "block", width: "100%", padding: "13px 20px", fontSize: 15, fontWeight: 600,
                color: activeLink === l.href || activeLink.startsWith(l.href) ? "#7C3AED" : "#222",
                background: activeLink === l.href || activeLink.startsWith(l.href) ? "#F5F0FF" : "transparent",
                border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit",
              }}>{l.label}</button>
          ))}
        </div>
        <div style={{ padding: "16px 18px", borderTop: "1px solid #f2f2f2" }}>
          <button onClick={() => { navigate(isLoggedIn ? "/hesabim" : "/yourpoodle/giris"); setDrawerOpen(false); }}
            style={{ width: "100%", height: 46, borderRadius: 12, background: "linear-gradient(135deg,#7C3AED,#A855F7)", border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            {isLoggedIn ? "\ud83d\udc64 Hesab\u0131m" : "Ücretsiz Başla"}
          </button>
        </div>
      </nav>

      {/* ──────────── MOBILE HEADER ──────────── */}
      <header className="yp-mobile-hdr" style={{
        position: "sticky", top: 0, zIndex: 100, background: "#fff",
        borderBottom: "1px solid #F0F0F0", alignItems: "center",
        justifyContent: authMode ? "center" : "space-between", padding: "10px 14px", height: 60,
      }}>
        {authMode ? (
          <Link href="/yourpoodle">
            <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              <img src="/yourpoodle-logo.jpg" alt="YourPoodle" style={{ height: 32, width: "auto", objectFit: "contain" }} />
            </div>
          </Link>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Link href="/">
                <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                  <img src="/yourpoodle-logo.jpg" alt="YourPoodle" style={{ height: 34, width: "auto", objectFit: "contain" }} />
                </div>
              </Link>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
              <button onClick={() => navigate(isLoggedIn ? "/hesabim" : "/yourpoodle/giris")}
                style={{
                  padding: "6px 13px", borderRadius: 20, border: "1.5px solid #7C3AED",
                  background: "#F5F0FF", color: "#7C3AED",
                  fontSize: 12, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit",
                }}>
                {isLoggedIn ? "Hesab\u0131m" : "Giri\u015f Yap"}
              </button>
              <button onClick={() => setDrawerOpen(true)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 6, fontSize: 22, color: "#333" }}>
                ☰
              </button>
            </div>
          </>
        )}
      </header>

      {/* ──────────── PAGE CONTENT ──────────── */}
      <div className="yp-page-body">
        <div className={constrain ? "yp-constrain" : ""}>
          {children}
        </div>
        <YPFooter />
      </div>

      {/* ──────────── MOBILE BOTTOM NAV ──────────── */}
      {!authMode && <div className="yp-btm-nav">
        <nav style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          background: "#fff", borderTop: "1px solid #f0f0f0",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
          height: 64, display: "flex", alignItems: "center", zIndex: 200, padding: "0 2px"
        }}>
          {NAV_LINKS.map(({ label, href, Icon }) => {
            const isActive = effectiveBottomLink === href || effectiveBottomLink.startsWith(href);
            return (
              <button key={href} onClick={() => navigate(href)}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "none", border: "none", cursor: "pointer", flex: 1, color: isActive ? "#7C3AED" : "#aaa", transition: "color 0.15s", padding: "4px 2px" }}>
                <Icon size={21} strokeWidth={isActive ? 2.5 : 2} />
                <span style={{ fontSize: 9, fontWeight: isActive ? 800 : 600, fontFamily: "inherit", whiteSpace: "nowrap" }}>{label}</span>
              </button>
            );
          })}
        </nav>
      </div>}
    </div>
  );
}
