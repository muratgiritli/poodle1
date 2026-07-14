import { useState } from "react";
import { Search, ShoppingBag, ChevronDown, Menu, X } from "lucide-react";

const LANGUAGES = [
  { code: "TR", flag: "🇹🇷" },
  { code: "EN", flag: "🇺🇸" },
  { code: "DE", flag: "🇩🇪" },
  { code: "FR", flag: "🇫🇷" },
  { code: "RU", flag: "🇷🇺" },
  { code: "AR", flag: "🇸🇦" },
  { code: "ES", flag: "🇪🇸" },
  { code: "IT", flag: "🇮🇹" },
];

const NAV_TABS = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Rehber",    href: "/rehber" },
  { label: "Bilgi Bankası", href: "/bilgi" },
  { label: "Mağaza",   href: "/magaza" },
];

const DRAWER_LINKS = [
  { label: "Ana Sayfa",     href: "/" },
  { label: "Rehber",        href: "/rehber" },
  { label: "Bilgi Bankası", href: "/bilgi" },
  { label: "Mağaza",        href: "/magaza" },
  { label: "Mama",          href: "/mama" },
  { label: "Eğitim",        href: "/egitim" },
  { label: "Sağlık",        href: "/saglik" },
  { label: "Bakım",         href: "/bakim" },
  { label: "Poodle Club",   href: "/club" },
];

export default function YourPoodleHome() {
  const [activeLang, setActiveLang] = useState(LANGUAGES[0]);
  const [langOpen,   setLangOpen]   = useState(false);
  const [activeTab,  setActiveTab]  = useState("Ana Sayfa");
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f0f0f0; }
        .icon-btn { background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 6px; border-radius: 8px; }
        .icon-btn:active { background: #f5f5f5; }
        .tab-btn { background: none; border: none; cursor: pointer; font-family: 'Inter', sans-serif; }
        .drawer { position: fixed; top: 0; right: 0; height: 100%; width: 72%; max-width: 280px; background: #fff; z-index: 200; transform: translateX(100%); transition: transform 0.24s ease; box-shadow: -4px 0 24px rgba(0,0,0,0.13); }
        .drawer.open { transform: translateX(0); }
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 199; }
      `}</style>

      {/* phone frame */}
      <div style={{ display:"flex", justifyContent:"center", alignItems:"flex-start", minHeight:"100vh", background:"#e5e7eb", padding:"24px 0 40px" }}>
        <div style={{ width:390, background:"#fff", borderRadius:36, overflow:"hidden", boxShadow:"0 24px 64px rgba(0,0,0,0.18)", fontFamily:"'Inter',sans-serif", position:"relative", minHeight:760 }}>

          {/* ── DRAWER ────────────────────────────────── */}
          {drawerOpen && <div className="overlay" onClick={() => setDrawerOpen(false)} />}
          <div className={`drawer ${drawerOpen ? "open" : ""}`}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 18px 14px", borderBottom:"1px solid #f2f2f2" }}>
              <img src="/__mockup/images/yourpoodle-logo.jpg" alt="YourPoodle" style={{ height:32, objectFit:"contain" }} />
              <button className="icon-btn" aria-label="Kapat" onClick={() => setDrawerOpen(false)}>
                <X size={20} color="#444" />
              </button>
            </div>
            <nav>
              {DRAWER_LINKS.map(l => (
                <a key={l.href} href={l.href} onClick={() => setDrawerOpen(false)}
                  style={{ display:"block", padding:"14px 20px", fontSize:15, fontWeight:600, color:"#222", textDecoration:"none", borderBottom:"1px solid #fafafa" }}>
                  {l.label}
                </a>
              ))}
            </nav>
          </div>

          {/* ── HEADER ────────────────────────────────── */}
          <header style={{ position:"sticky", top:0, zIndex:100, background:"#fff", borderBottom:"1px solid #f0f0f0" }}>

            {/* top row */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px" }}>
              {/* Logo */}
              <img
                src="/__mockup/images/yourpoodle-logo.jpg"
                alt="YourPoodle"
                style={{ height:36, width:160, objectFit:"contain", objectPosition:"left center" }}
              />

              {/* Right icons */}
              <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                {/* Search */}
                <button className="icon-btn" aria-label="Ara">
                  <Search size={21} color="#333" strokeWidth={2} />
                </button>

                {/* Cart */}
                <button className="icon-btn" aria-label="Sepet">
                  <ShoppingBag size={21} color="#333" strokeWidth={2} />
                </button>

                {/* Language */}
                <div style={{ position:"relative" }}>
                  <button
                    className="icon-btn"
                    aria-label="Dil seç"
                    onClick={() => setLangOpen(!langOpen)}
                    style={{ gap:4, padding:"5px 8px", borderRadius:8 }}
                  >
                    <span style={{ fontSize:15 }}>{activeLang.flag}</span>
                    <span style={{ fontSize:13, fontWeight:700, color:"#6C47FF", letterSpacing:"0.02em" }}>{activeLang.code}</span>
                    <ChevronDown size={13} color="#6C47FF" strokeWidth={2.5}
                      style={{ transform: langOpen ? "rotate(180deg)" : "none", transition:"transform 0.18s" }} />
                  </button>

                  {langOpen && (
                    <div style={{
                      position:"absolute", right:0, top:38,
                      background:"#fff", borderRadius:12, border:"1px solid #eee",
                      boxShadow:"0 8px 28px rgba(0,0,0,0.12)", zIndex:150,
                      minWidth:110, padding:"4px 0",
                    }}>
                      {LANGUAGES.map(l => (
                        <button key={l.code}
                          onClick={() => { setActiveLang(l); setLangOpen(false); }}
                          style={{
                            display:"flex", alignItems:"center", gap:8,
                            width:"100%", padding:"9px 14px",
                            border:"none", cursor:"pointer",
                            background: activeLang.code === l.code ? "#F5F0FF" : "transparent",
                            fontSize:13, fontWeight:700,
                            color: activeLang.code === l.code ? "#6C47FF" : "#333",
                            fontFamily:"'Inter',sans-serif",
                          }}>
                          <span style={{ fontSize:16 }}>{l.flag}</span>{l.code}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Hamburger */}
                <button className="icon-btn" aria-label="Menü" onClick={() => setDrawerOpen(true)}>
                  <Menu size={22} color="#333" strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* nav tabs */}
            <div style={{ display:"flex", borderTop:"1px solid #f0f0f0" }}>
              {NAV_TABS.map(tab => (
                <button
                  key={tab.label}
                  className="tab-btn"
                  onClick={() => setActiveTab(tab.label)}
                  style={{
                    flex:1, padding:"11px 4px",
                    fontSize:13.5, fontWeight: activeTab === tab.label ? 700 : 500,
                    color: activeTab === tab.label ? "#6C47FF" : "#555",
                    borderBottom: activeTab === tab.label ? "2.5px solid #6C47FF" : "2.5px solid transparent",
                    transition:"color 0.15s",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </header>

          {/* ── CONTENT PLACEHOLDER ───────────────────── */}
          <div style={{ margin:"20px 16px", height:400, borderRadius:18, background:"linear-gradient(135deg,#F5F0FF,#FFF0F6)", display:"flex", alignItems:"center", justifyContent:"center", border:"1.5px dashed #ddd" }}>
            <p style={{ color:"#bbb", fontSize:13, fontWeight:600, textAlign:"center" }}>Sonraki bölümler<br />sırayla eklenecek ↓</p>
          </div>

        </div>
      </div>
    </>
  );
}
