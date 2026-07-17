import { useEffect, useState } from "react";
import { useLocation } from "wouter";

const LS_CART = "yp_cart_items";

function readCartCount(): number {
  try {
    const items = JSON.parse(localStorage.getItem(LS_CART) || "[]");
    return Array.isArray(items) ? items.reduce((s: number, i: any) => s + (i.qty || 0), 0) : 0;
  } catch { return 0; }
}

const LEFT_TABS = [
  {
    label: "Ana Sayfa", href: "/yourpoodle",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    label: "Mama Bul", href: "/yourpoodle/mama-bul",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/>
        <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
      </svg>
    ),
  },
];

const RIGHT_TABS = [
  {
    label: "Mağaza", href: "/yourpoodle/magaza",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/>
        <path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
      </svg>
    ),
  },
  {
    label: "Rehber", href: "/yourpoodle/rehber",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
  },
];

export default function YPBottomNav() {
  const [location, navigate] = useLocation();
  const [cartCount, setCartCount] = useState(readCartCount);

  /* Canlı sepet sayısı — localStorage değişince badge güncellenir */
  useEffect(() => {
    const onStorage = () => setCartCount(readCartCount());
    window.addEventListener("storage", onStorage);

    /* Aynı sekmedeki değişimleri yakalamak için polling (storage event sadece diğer sekmeleri tetikler) */
    const interval = setInterval(() => setCartCount(readCartCount()), 500);

    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(interval);
    };
  }, []);

  const isActive = (href: string) =>
    href === "/yourpoodle"
      ? location === "/yourpoodle"
      : location.startsWith(href);

  const cartActive = location.startsWith("/yourpoodle/sepet") || location.startsWith("/yourpoodle/odeme");

  const tabBtn = (tab: typeof LEFT_TABS[number]) => {
    const active = isActive(tab.href);
    return (
      <button
        key={tab.label}
        onClick={() => navigate(tab.href)}
        aria-label={tab.label}
        style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: 3, background: "none", border: "none", cursor: "pointer",
          padding: "4px 6px", flex: 1, minWidth: 0,
          color: active ? "#7C3AFF" : "#999",
          transition: "color 0.15s",
        }}
      >
        {tab.icon}
        <span style={{ fontSize: 9, fontWeight: active ? 700 : 500, fontFamily: "'Inter',sans-serif", whiteSpace: "nowrap" }}>
          {tab.label}
        </span>
        {active && (
          <div style={{ width: 16, height: 2.5, borderRadius: 2, background: "#7C3AFF", marginTop: -2 }} />
        )}
      </button>
    );
  };

  return (
    <>
      {/* Safe area spacer */}
      <div style={{ height: 80 }} />

      <nav
        aria-label="Alt menü"
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 180,
          background: "#fff", borderTop: "1px solid #f0f0f0",
          display: "flex", alignItems: "center", justifyContent: "space-around",
          paddingBottom: "env(safe-area-inset-bottom,0px)",
          paddingTop: 4, height: 72,
          boxShadow: "0 -4px 20px rgba(0,0,0,0.07)",
        }}
      >
        {LEFT_TABS.map(tabBtn)}

        {/* ── Merkez Sepet butonu ── */}
        <button
          onClick={() => navigate("/yourpoodle/sepet")}
          aria-label="Sepetim"
          style={{
            position: "relative",
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 4, border: "none", cursor: "pointer",
            padding: 0, flex: "0 0 auto",
            background: "none",
          }}
        >
          {/* Yükseltilmiş daire */}
          <div style={{
            width: 54, height: 54,
            borderRadius: "50%",
            background: cartActive
              ? "linear-gradient(135deg,#5B21B6,#7C3AFF)"
              : "linear-gradient(135deg,#7C3AFF,#A855F7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px rgba(124,58,255,0.45)",
            marginTop: -24,
            border: "3px solid #fff",
            transition: "transform 0.15s",
          }}>
            {/* Sepet ikonu */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>

            {/* Badge */}
            {cartCount > 0 && (
              <span style={{
                position: "absolute", top: 0, right: 0,
                minWidth: 18, height: 18,
                borderRadius: "50%",
                background: "#EF4444",
                color: "#fff",
                fontSize: 10, fontWeight: 900,
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "0 4px",
                border: "2px solid #fff",
                fontFamily: "'Inter',sans-serif",
                boxSizing: "border-box",
              }}>
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </div>
          <span style={{
            fontSize: 9, fontWeight: 700,
            color: cartActive ? "#7C3AFF" : "#555",
            fontFamily: "'Inter',sans-serif",
            marginTop: 1,
          }}>
            Sepetim
          </span>
        </button>

        {RIGHT_TABS.map(tabBtn)}
      </nav>
    </>
  );
}
