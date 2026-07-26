import { useEffect, useState } from "react";
import { useLocation } from "wouter";

const P = "#7C3AED";

/* CartContext stores basket as Record<string, number> under "jet55_cart" */
function readCartCount(): number {
  try {
    const raw = localStorage.getItem("jet55_cart");
    if (!raw) return 0;
    const basket = JSON.parse(raw);
    if (basket && typeof basket === "object" && !Array.isArray(basket)) {
      return Object.values(basket as Record<string, number>).reduce(
        (s: number, qty) => s + (Number(qty) || 0), 0
      );
    }
    return 0;
  } catch { return 0; }
}

/* Route prefix: "" on yourpoodle.com, "/yourpoodle" on dev */
const BASE = window.location.hostname === "yourpoodle.com" ? "" : "/yourpoodle";

const HomeIcon  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const FoodIcon  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>;
const CartIcon  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>;
const BookIcon  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
const ClubIcon  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;

const TABS = [
  { label: "Ana Sayfa", href: `${BASE}` || "/yourpoodle", Icon: HomeIcon },
  { label: "Mama Bul",  href: `${BASE}/mama-bul`,          Icon: FoodIcon },
  { label: "Sepet",     href: `${BASE}/sepet`,              Icon: CartIcon, isCart: true },
  { label: "Rehber",    href: `${BASE}/rehber`,             Icon: BookIcon },
  { label: "Club",      href: `${BASE}/club`,               Icon: ClubIcon },
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
    return () => { window.removeEventListener("storage", onStorage); clearInterval(interval); };
  }, []);

  function isActive(href: string) {
    const nl = normPath(location);
    const nh = normPath(href);
    if (nh === "/" || nh === "") return nl === "/" || nl === "";
    return nl === nh || nl.startsWith(nh + "/");
  }

  return (
    <>
      {/* Spacer so page content isn't hidden behind nav */}
      <div style={{ height: 68 }} />

      <nav
        aria-label="Alt menü"
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200,
          background: "#fff", borderTop: "1px solid #F0F0F0",
          display: "flex", alignItems: "stretch",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          height: 60,
          boxShadow: "0 -2px 12px rgba(0,0,0,0.06)",
        }}
      >
        {TABS.map(tab => {
          const active = isActive(tab.href);
          return (
            <button
              key={tab.label}
              onClick={() => navigate(tab.href)}
              aria-label={tab.label}
              style={{
                flex: 1,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                gap: 3, background: "none", border: "none",
                cursor: "pointer", padding: "6px 4px 8px",
                color: active ? P : "#9CA3AF",
                transition: "color 0.15s",
                position: "relative",
                minWidth: 44,
              }}
            >
              <tab.Icon />

              {/* Sepet rozeti */}
              {tab.isCart && cartCount > 0 && (
                <span style={{
                  position: "absolute", top: 4, left: "50%", marginLeft: 4,
                  minWidth: 16, height: 16, borderRadius: 999,
                  background: "#EF4444", color: "#fff",
                  fontSize: 9, fontWeight: 900,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: "0 3px", border: "1.5px solid #fff",
                  boxSizing: "border-box", fontFamily: "'Inter',sans-serif",
                }}>
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}

              <span style={{
                fontSize: 10, fontWeight: active ? 700 : 500,
                fontFamily: "'Inter',sans-serif", lineHeight: 1,
              }}>
                {tab.label}
              </span>

              {active && (
                <div style={{
                  position: "absolute", bottom: 0,
                  left: "20%", right: "20%",
                  height: 2.5, borderRadius: 2, background: P,
                }} />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
}
