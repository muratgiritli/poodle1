import { useState, useRef } from "react";
import {
  Menu, Bot, User, Search, ChevronDown,
  GraduationCap, Heart, Scissors, ShoppingBag, MapPin, Award,
  X, Home, UtensilsCrossed,
} from "lucide-react";

// ── Navigation data ───────────────────────────────────────────────────────────
const DRAWER_LINKS = [
  { label: "Ana Sayfa",      href: "/" },
  { label: "Mama",           href: "/mama" },
  { label: "Eğitim",         href: "/egitim" },
  { label: "Sağlık",         href: "/saglik" },
  { label: "Bakım",          href: "/bakim" },
  { label: "Tuvalet",        href: "/tuvalet" },
  { label: "Ödül Mamaları",  href: "/odul-mamasi" },
  { label: "Ürünler",        href: "/urunler" },
  { label: "Hizmetler",      href: "/hizmetler" },
  { label: "Rehber",         href: "/rehber" },
  { label: "Poodle Club",    href: "/club" },
];

const LANGUAGES = [
  { code: "TR", flag: "🇹🇷", color: "#E30A17" },
  { code: "EN", flag: "🇺🇸", color: "#3C3B6E" },
  { code: "DE", flag: "🇩🇪", color: "#000000" },
  { code: "FR", flag: "🇫🇷", color: "#002395" },
  { code: "RU", flag: "🇷🇺", color: "#003580" },
  { code: "AR", flag: "🇸🇦", color: "#006C35" },
  { code: "ES", flag: "🇪🇸", color: "#AA151B" },
  { code: "IT", flag: "🇮🇹", color: "#009246" },
];

// Toilet bowl SVG for tuvalet since Lucide doesn't have one
const ToiletIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h6v6H4z" />
    <path d="M4 10h16a0 0 0 0 1 0 8H8a4 4 0 0 1-4-4v-4z" />
    <path d="M10 4h2" />
  </svg>
);

// Medal icon
const MedalIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="14" r="6" />
    <path d="M8.21 4.37 9.5 2h5l1.29 2.37" />
    <path d="M9.5 2 12 8l2.5-6" />
  </svg>
);

// Pet bowl icon
const PetBowlIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11h18" />
    <path d="M5 11a7 7 0 0 0 14 0" />
    <path d="M10 7c0-1.1.9-2 2-2s2 .9 2 2" />
    <path d="M8 7c0-2.2 1.8-4 4-4s4 1.8 4 4" />
  </svg>
);

const CATEGORIES = [
  { label: "Mama",      Icon: PetBowlIcon,    bg: "#FFE4EC", color: "#E75480", href: "/mama" },
  { label: "Eğitim",    Icon: GraduationCap,  bg: "#FFE8D6", color: "#C0622F", href: "/egitim" },
  { label: "Sağlık",    Icon: Heart,          bg: "#D6F5EC", color: "#1A8F6F", href: "/saglik" },
  { label: "Bakım",     Icon: Scissors,       bg: "#EDE0FF", color: "#7B3FC4", href: "/bakim" },
  { label: "Tuvalet",   Icon: ToiletIcon,     bg: "#FFFBD0", color: "#8A7A00", href: "/tuvalet" },
  { label: "Ödül",      Icon: MedalIcon,      bg: "#D6EEFF", color: "#1565A8", href: "/odul-mamasi" },
  { label: "Ürünler",   Icon: ShoppingBag,    bg: "#FFE0F0", color: "#B5306A", href: "/urunler" },
  { label: "Hizmetler", Icon: MapPin,         bg: "#D6F5EE", color: "#1B7A62", href: "/hizmetler" },
];

// ── Flag circle component (CSS-based, no emoji rendering issues) ──────────────
function FlagCircle({ code, flag }: { code: string; flag: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 22,
        height: 22,
        borderRadius: "50%",
        overflow: "hidden",
        fontSize: 14,
        lineHeight: 1,
        border: "1px solid rgba(0,0,0,0.08)",
        flexShrink: 0,
      }}
    >
      {flag}
    </span>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function YourPoodleHome() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeLang, setActiveLang] = useState("TR");
  const [langDropdown, setLangDropdown] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    if (searchVal.trim()) {
      alert(`Arama: ${searchVal}`); // in real app: navigate(`/arama?q=${searchVal}`)
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F5F0FF; }
        .noscroll::-webkit-scrollbar { display: none; }
        .noscroll { -ms-overflow-style: none; scrollbar-width: none; }
        .cat-card:active { transform: scale(0.93); }
        .cat-card { transition: transform 0.12s ease; }
        .drawer-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.35); z-index: 100; }
        .drawer { position: fixed; top: 0; left: 0; height: 100%; width: 78%; max-width: 300px; background: #fff; z-index: 101; transform: translateX(-100%); transition: transform 0.25s ease; box-shadow: 4px 0 24px rgba(0,0,0,0.12); }
        .drawer.open { transform: translateX(0); }
        .lang-btn:active { background: rgba(255,105,150,0.08); }
      `}</style>

      {/* Phone frame wrapper */}
      <div style={{
        display: "flex", justifyContent: "center", alignItems: "flex-start",
        minHeight: "100vh", background: "#e5e7eb", padding: "24px 0 40px",
      }}>
        <div style={{
          width: 390, background: "#fff", borderRadius: 36,
          overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
          fontFamily: "'Nunito', sans-serif", position: "relative",
          minHeight: 760,
        }}>

          {/* ── MOBILE DRAWER ──────────────────────────────────────── */}
          {drawerOpen && (
            <div className="drawer-overlay" onClick={() => setDrawerOpen(false)} />
          )}
          <div className={`drawer ${drawerOpen ? "open" : ""}`}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 18px 16px", borderBottom: "1px solid #f0f0f0" }}>
              <img src="/__mockup/images/yourpoodle-logo.jpg" alt="YourPoodle" style={{ height: 32, objectFit: "contain" }} />
              <button
                aria-label="Menüyü kapat"
                onClick={() => setDrawerOpen(false)}
                style={{ width: 36, height: 36, borderRadius: "50%", border: "none", background: "#f5f5f5", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <X size={18} color="#555" />
              </button>
            </div>
            <nav style={{ padding: "8px 0" }}>
              {DRAWER_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  style={{
                    display: "flex", alignItems: "center", padding: "13px 20px",
                    fontSize: 15, fontWeight: 700, color: "#1a1a1a",
                    textDecoration: "none", borderBottom: "1px solid #fafafa",
                  }}
                  onClick={() => setDrawerOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* ── STICKY HEADER ──────────────────────────────────────── */}
          <header style={{
            position: "sticky", top: 0, zIndex: 50,
            background: "#fff", height: 64,
            display: "flex", alignItems: "center",
            padding: "0 14px",
            borderBottom: "1px solid #f2f2f2",
            boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
          }}>
            {/* Hamburger */}
            <button
              aria-label="Menüyü aç"
              onClick={() => setDrawerOpen(true)}
              style={{
                width: 42, height: 42, borderRadius: 10,
                border: "none", background: "transparent",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Menu size={24} color="#333" strokeWidth={2} />
            </button>

            {/* Logo — centered absolutely so it stays true-center */}
            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <img
                src="/__mockup/images/yourpoodle-logo.jpg"
                alt="YourPoodle"
                style={{ height: 38, width: 155, objectFit: "contain", objectPosition: "center" }}
              />
            </div>

            {/* AI Asistan + Profile */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <a
                href="/ai-asistan"
                aria-label="AI Asistan"
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  padding: "6px 10px", borderRadius: 20,
                  border: "1.5px solid #FFB6C1",
                  background: "#FFF5F8",
                  textDecoration: "none", cursor: "pointer",
                }}
              >
                <Bot size={16} color="#E75480" strokeWidth={2} />
                {/* Text hidden on very small, shown on 360px+ */}
                <span style={{ fontSize: 12, fontWeight: 800, color: "#E75480", whiteSpace: "nowrap" }}>
                  AI Asistan
                </span>
              </a>

              <a
                href="/giris"
                aria-label="Profil"
                style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "#F0F0F0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  textDecoration: "none", flexShrink: 0,
                }}
              >
                <User size={18} color="#555" strokeWidth={2} />
              </a>
            </div>
          </header>

          {/* ── SEARCH BAR ─────────────────────────────────────────── */}
          <div style={{ padding: "14px 14px 0" }}>
            <div style={{
              display: "flex", alignItems: "center",
              background: "#fff",
              border: "1.5px solid #ececec",
              borderRadius: 16,
              height: 54,
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              overflow: "hidden",
            }}>
              <div style={{ display: "flex", alignItems: "center", paddingLeft: 14, color: "#bbb" }}>
                <Search size={20} strokeWidth={2} />
              </div>
              <input
                ref={searchRef}
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Mama, eğitim, sağlık ara..."
                aria-label="Arama"
                style={{
                  flex: 1, border: "none", outline: "none",
                  fontSize: 14, fontWeight: 600, color: "#333",
                  background: "transparent", padding: "0 10px",
                  fontFamily: "'Nunito', sans-serif",
                }}
              />
              <button
                onClick={handleSearch}
                aria-label="Ara"
                style={{
                  height: "100%", padding: "0 20px",
                  background: "linear-gradient(135deg, #FF80AB, #FF4081)",
                  border: "none", cursor: "pointer",
                  fontSize: 14, fontWeight: 800, color: "#fff",
                  borderRadius: "0 14px 14px 0",
                  letterSpacing: "0.01em",
                }}
              >
                Ara
              </button>
            </div>
          </div>

          {/* ── LANGUAGE SELECTOR ──────────────────────────────────── */}
          <div style={{ padding: "12px 14px 0", position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
              {/* Scrollable language list */}
              <div
                className="noscroll"
                style={{
                  display: "flex", alignItems: "center", gap: 0,
                  overflowX: "auto", flex: 1,
                }}
              >
                {LANGUAGES.map((lang) => {
                  const isActive = lang.code === activeLang;
                  return (
                    <button
                      key={lang.code}
                      className="lang-btn"
                      onClick={() => setActiveLang(lang.code)}
                      aria-label={`Dil: ${lang.code}`}
                      style={{
                        display: "flex", flexDirection: "column",
                        alignItems: "center", gap: 2,
                        padding: "6px 10px 0",
                        border: "none", background: "transparent",
                        cursor: "pointer", flexShrink: 0,
                        borderBottom: isActive ? "2.5px solid #FF4081" : "2.5px solid transparent",
                        paddingBottom: 6,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <FlagCircle code={lang.code} flag={lang.flag} />
                        <span style={{
                          fontSize: 12, fontWeight: 800,
                          color: isActive ? "#FF4081" : "#555",
                          letterSpacing: "0.03em",
                        }}>{lang.code}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Dropdown chevron */}
              <button
                onClick={() => setLangDropdown(!langDropdown)}
                aria-label="Tüm diller"
                style={{
                  width: 30, height: 30, borderRadius: 8,
                  border: "1.5px solid #eee", background: "#fafafa",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", flexShrink: 0, marginLeft: 6,
                }}
              >
                <ChevronDown size={15} color="#888" strokeWidth={2.5} style={{ transform: langDropdown ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </button>
            </div>

            {/* Language dropdown */}
            {langDropdown && (
              <div style={{
                position: "absolute", right: 14, top: 52,
                background: "#fff", borderRadius: 12,
                border: "1px solid #eee",
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                zIndex: 30, padding: "6px 0", minWidth: 120,
              }}>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { setActiveLang(lang.code); setLangDropdown(false); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      width: "100%", padding: "9px 14px",
                      border: "none", background: activeLang === lang.code ? "#FFF5F8" : "transparent",
                      cursor: "pointer", fontSize: 13, fontWeight: 700,
                      color: activeLang === lang.code ? "#FF4081" : "#333",
                      fontFamily: "'Nunito', sans-serif",
                    }}
                  >
                    <FlagCircle code={lang.code} flag={lang.flag} />
                    {lang.code}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── CATEGORY STRIP ─────────────────────────────────────── */}
          <div style={{ marginTop: 14 }}>
            <div
              className="noscroll"
              style={{
                display: "flex",
                overflowX: "auto",
                width: "100%",
              }}
            >
              {CATEGORIES.map(({ label, Icon, bg, color, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="cat-card"
                  style={{
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    gap: 8,
                    minWidth: 92, height: 108,
                    background: bg,
                    textDecoration: "none",
                    flexShrink: 0,
                    borderRight: "1px solid rgba(255,255,255,0.6)",
                  }}
                >
                  <div style={{ color }}>
                    <Icon size={26} strokeWidth={1.6} />
                  </div>
                  <span style={{
                    fontSize: 12, fontWeight: 800,
                    color: "#2d2d2d", letterSpacing: "0.01em",
                  }}>
                    {label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* ── PLACEHOLDER for upcoming sections ──────────────────── */}
          <div style={{
            margin: "20px 14px 0",
            height: 320,
            borderRadius: 18,
            background: "linear-gradient(135deg, #FFF0F6, #F5EEFF)",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "1.5px dashed #ddd",
          }}>
            <p style={{ color: "#bbb", fontSize: 13, fontWeight: 700, textAlign: "center" }}>
              Sonraki bölümler<br />sırayla eklenecek ↓
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
