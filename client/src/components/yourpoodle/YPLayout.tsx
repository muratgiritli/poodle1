import { useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useCustomer } from "@/contexts/CustomerContext";
import { Menu, X, ShoppingBag, BookOpen, Monitor, Home, Users } from "lucide-react";

const NAV_LINKS = [
  { label: "Rehber",     href: "/yourpoodle/rehber" },
  { label: "Mama Bul",   href: "/yourpoodle/mama-bul" },
  { label: "Sağlık",     href: "/yourpoodle/saglik" },
  { label: "Bakım",      href: "/yourpoodle/bakim" },
  { label: "Eğitim",     href: "/yourpoodle/egitim" },
  { label: "AI Asistan", href: "/yourpoodle/ai-asistan" },
  { label: "Topluluk",   href: "/yourpoodle/topluluk" },
  { label: "Mağaza",     href: "/yourpoodle/magaza" },
  { label: "Etkinlik",   href: "/yourpoodle/etkinlikler" },
  { label: "Bilgi",      href: "/yourpoodle/bilgi" },
  { label: "Club",       href: "/yourpoodle/club" },
];

interface Props {
  children: ReactNode;
  activeLink?: string;
  /** Override which bottom-nav tab appears active (when page has no matching tab) */
  bottomNavActive?: string;
  /** Set false for full-bleed pages (AI chat, wizard) that manage their own layout */
  constrain?: boolean;
}

export default function YPLayout({ children, activeLink = "", bottomNavActive, constrain = true }: Props) {
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
        background: "#fff", borderBottom: "1px solid #eee",
        alignItems: "center", justifyContent: "space-between",
        padding: "0 48px", height: 64,
        boxShadow: "0 1px 12px rgba(0,0,0,0.05)"
      }}>
        <Link href="/">
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg,#7C3AED,#A855F7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🐩</div>
            <span style={{ fontSize: 18, fontWeight: 900, color: "#7C3AED", letterSpacing: "-0.3px" }}>YourPoodle</span>
          </div>
        </Link>

        <nav style={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "nowrap" }}>
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href}>
              <span style={{
                display: "inline-block", padding: "6px 10px", borderRadius: 8,
                fontSize: 12.5, fontWeight: activeLink === l.href ? 700 : 500,
                cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
                color: activeLink === l.href ? "#7C3AED" : "#555",
                background: activeLink === l.href ? "#F5F0FF" : "transparent",
              }}>{l.label}</span>
            </Link>
          ))}
        </nav>

        <button onClick={() => navigate(isLoggedIn ? "/hesabim" : "/yourpoodle/giris")}
          style={{
            padding: "9px 22px", borderRadius: 20, border: "2px solid",
            borderColor: isLoggedIn ? "#22C55E" : "#7C3AED",
            background: isLoggedIn ? "#F0FDF4" : "#7C3AED",
            color: isLoggedIn ? "#16A34A" : "#fff",
            fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
          }}>
          {isLoggedIn ? "Hesabım 👤" : "Giriş Yap"}
        </button>
      </header>

      {/* ──────────── MOBILE DRAWER ──────────── */}
      {drawerOpen && (
        <div onClick={() => setDrawerOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 299 }} />
      )}
      <nav style={{
        position: "fixed", top: 0, left: 0, height: "100%", width: 280, background: "#fff", zIndex: 300,
        transform: drawerOpen ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.24s ease",
        boxShadow: "4px 0 28px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 18px 14px", borderBottom: "1px solid #f2f2f2" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg,#7C3AED,#A855F7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🐩</div>
            <span style={{ fontSize: 16, fontWeight: 900, color: "#7C3AED" }}>YourPoodle</span>
          </div>
          <button onClick={() => setDrawerOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}>
            <X size={20} color="#666" />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {[{ label: "Ana Sayfa", href: "/" }, ...NAV_LINKS,
            { label: "Poodle'ım", href: "/yourpoodle/poodle-ekle" },
          ].map(l => (
            <button key={l.href} onClick={() => { navigate(l.href); setDrawerOpen(false); }}
              style={{
                display: "block", width: "100%", padding: "13px 20px", fontSize: 14, fontWeight: 600,
                color: activeLink === l.href ? "#7C3AED" : "#222",
                background: activeLink === l.href ? "#F5F0FF" : "transparent",
                border: "none", borderBottom: "1px solid #fafafa", cursor: "pointer", textAlign: "left", fontFamily: "inherit",
              }}>{l.label}</button>
          ))}
        </div>
      </nav>

      {/* ──────────── MOBILE HEADER ──────────── */}
      <header className="yp-mobile-hdr" style={{
        position: "sticky", top: 0, zIndex: 100, background: "#fff",
        borderBottom: "1px solid #f0f0f0", alignItems: "center",
        justifyContent: "space-between", padding: "10px 14px", height: 56,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => setDrawerOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 6 }}>
            <Menu size={22} color="#333" strokeWidth={2} />
          </button>
          <Link href="/">
            <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <div style={{ width: 26, height: 26, borderRadius: 6, background: "linear-gradient(135deg,#7C3AED,#A855F7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🐩</div>
              <span style={{ fontSize: 15, fontWeight: 900, color: "#7C3AED" }}>YourPoodle</span>
            </div>
          </Link>
        </div>
        <button onClick={() => navigate(isLoggedIn ? "/hesabim" : "/yourpoodle/giris")}
          style={{
            padding: "6px 13px", borderRadius: 20, border: "2px solid",
            borderColor: isLoggedIn ? "#22C55E" : "#7C3AED",
            background: isLoggedIn ? "#F0FDF4" : "#F5F0FF",
            color: isLoggedIn ? "#16A34A" : "#7C3AED",
            fontSize: 12, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap",
          }}>
          {isLoggedIn ? "Hesabım 👤" : "Giriş Yap"}
        </button>
      </header>

      {/* ──────────── PAGE CONTENT ──────────── */}
      <div className="yp-page-body">
        <div className={constrain ? "yp-constrain" : ""}>
          {children}
        </div>
      </div>

      {/* ──────────── MOBILE BOTTOM NAV ──────────── */}
      <div className="yp-btm-nav">
        <nav style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          background: "#fff", borderTop: "1px solid #f0f0f0",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
          height: 64, display: "flex", alignItems: "center", zIndex: 200, padding: "0 8px"
        }}>
          {[
            { label: "Ana Sayfa", href: "/", Icon: Home },
            { label: "Rehber",    href: "/yourpoodle/rehber", Icon: BookOpen },
          ].map(({ label, href, Icon }) => (
            <button key={label} onClick={() => navigate(href)}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", flex: 1, color: effectiveBottomLink === href ? "#7C3AED" : "#aaa" }}>
              <Icon size={22} strokeWidth={2} />
              <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "inherit" }}>{label}</span>
            </button>
          ))}
          <button onClick={() => navigate("/yourpoodle/magaza")}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", flex: 1, position: "relative" }}>
            <div style={{ width: 54, height: 54, borderRadius: "50%", background: "linear-gradient(135deg,#9B59FF,#7C3AFF)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px rgba(124,58,255,0.4)", position: "absolute", top: -24 }}>
              <ShoppingBag size={24} color="#fff" strokeWidth={2.2} />
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#aaa", fontFamily: "inherit", marginTop: 32 }}>Mağaza</span>
          </button>
          {[
            { label: "Bilgi",  href: "/yourpoodle/bilgi",  Icon: Monitor },
            { label: "Club",   href: "/yourpoodle/club",   Icon: Users },
          ].map(({ label, href, Icon }) => (
            <button key={label} onClick={() => navigate(href)}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", flex: 1, color: effectiveBottomLink === href ? "#7C3AED" : "#aaa" }}>
              <Icon size={22} strokeWidth={2} />
              <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "inherit" }}>{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
