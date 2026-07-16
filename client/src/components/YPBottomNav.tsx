import { useLocation } from "wouter";

const TABS = [
  {
    label: "Rehber", href: "/yourpoodle/rehber",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  },
  {
    label: "Mama Bul", href: "/yourpoodle/mama-bul",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>,
  },
  {
    label: "Araçlar", href: "/yourpoodle/bilgi",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  },
  {
    label: "AI Asistan", href: "/yourpoodle/ai-asistan",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>,
  },
  {
    label: "Mağaza", href: "/yourpoodle/magaza",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>,
  },
];

export default function YPBottomNav() {
  const [location, navigate] = useLocation();

  const isActive = (href: string) => location.startsWith(href);

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
        })}
      </nav>
    </>
  );
}
