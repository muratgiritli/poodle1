import { useLocation } from "wouter";

const BOT_SVG = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2"/>
    <circle cx="12" cy="5" r="2"/>
    <path d="M12 7v4"/>
    <line x1="8" y1="16" x2="8" y2="16"/>
    <line x1="16" y1="16" x2="16" y2="16"/>
  </svg>
);

const TABS = [
  {
    label: "Ana Sayfa", href: "/yourpoodle",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  },
  {
    label: "Rehber", href: "/yourpoodle/rehber",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  },
  {
    label: "Asistan", href: "/yourpoodle/ai-asistan", center: true,
    icon: BOT_SVG,
  },
  {
    label: "Market", href: "/yourpoodle/magaza",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>,
  },
  {
    label: "Profil", href: "/yourpoodle/poodle-ekle",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  },
];

export default function YPBottomNav() {
  const [location, navigate] = useLocation();

  const isActive = (href: string) => {
    if (href === "/yourpoodle") return location === "/" || location === "/yourpoodle";
    return location.startsWith(href);
  };

  return (
    <>
      {/* Safe area spacer */}
      <div style={{ height: 72 }} />

      <nav
        aria-label="Alt menü"
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 180,
          background: "#fff", borderTop: "1px solid #f0f0f0",
          display: "flex", alignItems: "center", justifyContent: "space-around",
          paddingBottom: "env(safe-area-inset-bottom,0px)",
          paddingTop: 4, height: 64,
          boxShadow: "0 -4px 20px rgba(0,0,0,0.07)",
        }}
      >
        {TABS.map(tab => {
          const active = isActive(tab.href);
          if (tab.center) {
            return (
              <button
                key={tab.label}
                onClick={() => navigate(tab.href)}
                aria-label={tab.label}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  gap: 2, background: "none", border: "none", cursor: "pointer",
                  position: "relative", top: -18,
                }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: active ? "#5B21B6" : "#7C3AFF",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", boxShadow: "0 4px 16px rgba(124,58,255,0.4)",
                }}>
                  {tab.icon}
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: active ? "#7C3AFF" : "#999", fontFamily: "'Inter',sans-serif" }}>
                  {tab.label}
                </span>
              </button>
            );
          }
          return (
            <button
              key={tab.label}
              onClick={() => navigate(tab.href)}
              aria-label={tab.label}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: 3, background: "none", border: "none", cursor: "pointer",
                padding: "4px 8px", flex: 1, minWidth: 0,
                color: active ? "#7C3AFF" : "#999",
              }}
            >
              {tab.icon}
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, fontFamily: "'Inter',sans-serif" }}>
                {tab.label}
              </span>
              {active && (
                <div style={{ width: 16, height: 2.5, borderRadius: 2, background: "#7C3AFF", marginTop: -2 }} />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
}
