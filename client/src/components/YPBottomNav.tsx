import { useEffect, useState } from "react";
import { useLocation } from "wouter";

const P = "#5D3A1A";
const INACTIVE = "#B0A69C";

function readCartCount(): number {
  try {
    const yp = localStorage.getItem("yp_cart_items");
    if (yp) {
      const arr = JSON.parse(yp);
      if (Array.isArray(arr)) return arr.reduce((s: number, i: any) => s + (Number(i?.qty) || 0), 0);
    }
    const raw = localStorage.getItem("jet55_cart");
    if (!raw) return 0;
    const basket = JSON.parse(raw);
    if (basket && typeof basket === "object" && !Array.isArray(basket)) {
      return Object.values(basket as Record<string, number>).reduce(
        (s: number, qty) => s + (Number(qty) || 0),
        0,
      );
    }
    return 0;
  } catch {
    return 0;
  }
}

const BASE = window.location.hostname === "yourpoodle.com" || window.location.hostname === "www.yourpoodle.com"
  ? ""
  : "/yourpoodle";

const HomeIcon = ({ active }: { active?: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? P : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10.5 12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 20z" />
    {!active && <polyline points="9 21.5 9 12 15 12 15 21.5" />}
  </svg>
);

const SearchIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

const CartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="20" r="1" />
    <circle cx="18" cy="20" r="1" />
    <path d="M2 3h2.5l2.1 11.2a1.5 1.5 0 0 0 1.5 1.2h8.7a1.5 1.5 0 0 0 1.5-1.2L20 7H6" />
  </svg>
);

const BookIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h6a3 3 0 0 1 3 3v14a2.5 2.5 0 0 0-2.5-2.5H4z" />
    <path d="M20 4h-6a3 3 0 0 0-3 3v14a2.5 2.5 0 0 1 2.5-2.5H20z" />
  </svg>
);

const ClubIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="8" r="3" />
    <circle cx="17" cy="9" r="2.4" />
    <path d="M3.5 19c.8-3 2.8-4.5 5.5-4.5s4.7 1.5 5.5 4.5" />
    <path d="M14.8 19c.35-1.7 1.4-2.7 3-2.7 1.3 0 2.3.7 2.9 2" />
  </svg>
);

const TABS = [
  { label: "Ana Sayfa", href: `${BASE}` || "/yourpoodle", Icon: HomeIcon, home: true },
  { label: "Mama Bul", href: `${BASE}/mama-bul`, Icon: SearchIcon },
  { label: "Sepet", href: `${BASE}/sepet`, Icon: CartIcon, isCart: true },
  { label: "Rehber", href: `${BASE}/rehber`, Icon: BookIcon },
  { label: "Club", href: `${BASE}/club`, Icon: ClubIcon },
];

function normPath(p: string) {
  if (p === "/yourpoodle" || p === "/") return "/";
  return p.replace(/^\/yourpoodle(?=\/|$)/, "") || "/";
}

export default function YPBottomNav() {
  const [location, navigate] = useLocation();
  const [cartCount, setCartCount] = useState(readCartCount);

  useEffect(() => {
    const onStorage = () => setCartCount(readCartCount());
    window.addEventListener("storage", onStorage);
    const interval = setInterval(() => setCartCount(readCartCount()), 500);
    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(interval);
    };
  }, []);

  function isActive(href: string) {
    const nl = normPath(location);
    const nh = normPath(href);
    if (nh === "/" || nh === "") return nl === "/" || nl === "";
    return nl === nh || nl.startsWith(nh + "/");
  }

  return (
    <>
      <div className="yp-btm-nav-spacer" style={{ height: 68 }} />
      <nav
        className="yp-btm-nav-root yp-btm-nav"
        aria-label="Alt menü"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          background: "#FFFcf7",
          borderTop: "1px solid #EDE6DC",
          display: "flex",
          alignItems: "stretch",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          height: 62,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "var(--yp-shell-max)",
            margin: "0 auto",
            display: "flex",
            alignItems: "stretch",
          }}
        >
          {TABS.map((tab) => {
            const active = isActive(tab.href);
            const Icon = tab.Icon as any;
            return (
              <button
                key={tab.label}
                onClick={() => navigate(tab.href)}
                aria-label={tab.label}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 3,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px 4px",
                  color: active ? P : INACTIVE,
                  position: "relative",
                  minWidth: 44,
                }}
              >
                {tab.home ? <Icon active={active} /> : <Icon />}
                {tab.isCart && cartCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: 4,
                      left: "50%",
                      marginLeft: 4,
                      minWidth: 16,
                      height: 16,
                      borderRadius: 999,
                      background: "#C45C3E",
                      color: "#fff",
                      fontSize: 9,
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0 3px",
                      border: "1.5px solid #FFFcf7",
                      boxSizing: "border-box",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: active ? 700 : 500,
                    fontFamily: "'DM Sans', sans-serif",
                    lineHeight: 1,
                  }}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
