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

      <div style={{ minHeight:"100vh", background:"#fff", fontFamily:"'Inter',sans-serif", position:"relative" }}>
        <div>

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

          {/* ── HERO ──────────────────────────────────── */}
          <section style={{
            background:"linear-gradient(135deg,#B39DFF 0%,#C8B8FF 40%,#D4C4FF 100%)",
            display:"flex", alignItems:"stretch",
            minHeight:340, position:"relative", overflow:"hidden",
            padding:"28px 20px 0 20px",
          }}>
            {/* LEFT */}
            <div style={{ flex:"0 0 55%", display:"flex", flexDirection:"column", justifyContent:"flex-start", zIndex:2, paddingBottom:24 }}>
              {/* tag */}
              <div style={{ display:"inline-flex", alignItems:"center", background:"rgba(0,0,0,0.25)", borderRadius:6, padding:"3px 10px", marginBottom:12, alignSelf:"flex-start" }}>
                <span style={{ fontSize:11, fontWeight:800, color:"#fff", letterSpacing:"0.08em" }}>DÜNYANIN EN BÜYÜK</span>
              </div>

              {/* big title */}
              <div style={{ marginBottom:4 }}>
                <div style={{ fontSize:48, fontWeight:900, color:"#fff", lineHeight:0.95, letterSpacing:"-1px", fontFamily:"'Inter',sans-serif" }}>POODLE</div>
                <div style={{ fontSize:48, fontWeight:900, color:"#fff", lineHeight:0.95, letterSpacing:"-1px", fontFamily:"'Inter',sans-serif" }}>AİLESİNE</div>
              </div>

              {/* script */}
              <div style={{ display:"flex", alignItems:"center", gap:8, margin:"10px 0 10px" }}>
                <span style={{ fontFamily:"'Dancing Script','Pacifico',cursive", fontSize:28, fontWeight:700, color:"#fff" }}>Hoş Geldiniz!</span>
                <span style={{ fontSize:22 }}>💜</span>
              </div>

              {/* desc */}
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.9)", lineHeight:1.5, marginBottom:18, fontFamily:"'Inter',sans-serif" }}>
                Toy Poodle'ınıza dair her şey burada! Sağlık, topluluk, özel ayrıcalıklar...
              </p>

              {/* buttons */}
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                <a href="/club" style={{
                  display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                  height:50, borderRadius:14,
                  background:"#7C3AFF",
                  textDecoration:"none", cursor:"pointer",
                  boxShadow:"0 4px 16px rgba(100,50,200,0.35)",
                }}>
                  <span style={{ fontSize:14, fontWeight:800, color:"#fff", letterSpacing:"0.05em", fontFamily:"'Inter',sans-serif" }}>CLUB'A KATIL</span>
                  <span style={{ fontSize:16 }}>🐾</span>
                </a>
                <a href="/poodle-ekle" style={{
                  display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                  height:50, borderRadius:14,
                  background:"rgba(255,255,255,0.92)",
                  textDecoration:"none", cursor:"pointer",
                  border:"2px solid rgba(255,255,255,0.6)",
                }}>
                  <span style={{ fontSize:14, fontWeight:800, color:"#5B21B6", letterSpacing:"0.05em", fontFamily:"'Inter',sans-serif" }}>POODLE'İMİ EKLE</span>
                  <span style={{ fontSize:18, color:"#5B21B6", fontWeight:700 }}>+</span>
                </a>
              </div>

              {/* avatars */}
              <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:16 }}>
                <div style={{ display:"flex" }}>
                  {[1,2,3,4].map(i => (
                    <img key={i} src={`/__mockup/images/poodle-avatar-${i}.jpg`} alt=""
                      style={{ width:28, height:28, borderRadius:"50%", border:"2px solid #fff", marginLeft:i===1?0:-8, objectFit:"cover" }} />
                  ))}
                </div>
                <div style={{ fontFamily:"'Inter',sans-serif" }}>
                  <span style={{ fontSize:14, fontWeight:900, color:"#fff" }}>10.000+</span>
                  <span style={{ fontSize:12, color:"rgba(255,255,255,0.85)", marginLeft:5 }}>mutlu poodle ailesi 💜</span>
                </div>
              </div>
            </div>

            {/* RIGHT — poodle */}
            <div style={{ flex:"0 0 45%", position:"relative" }}>
              <img
                src="/__mockup/images/poodle-hero.png"
                alt="Toy Poodle"
                style={{
                  position:"absolute", bottom:0, right:-20,
                  width:"130%", maxWidth:260,
                  objectFit:"contain", objectPosition:"bottom",
                }}
              />
            </div>
          </section>

          {/* ── ICON NAV BAR ──────────────────────────── */}
          <div style={{ padding:"14px 16px" }}>
            <div style={{
              background:"#fff", borderRadius:20,
              boxShadow:"0 2px 16px rgba(0,0,0,0.08)",
              padding:"14px 8px",
              display:"flex", justifyContent:"space-around", alignItems:"flex-start",
              overflowX:"auto",
            }}>
              {[
                { label:"AKIŞ",      bg:"#EDE8FF", color:"#7C3AFF", active:true,
                  icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
                { label:"TOPLULUK",  bg:"#FFE4EC", color:"#E75480", active:false,
                  icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> },
                { label:"REHBER",    bg:"#D6F5E8", color:"#059669", active:false,
                  icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg> },
                { label:"MAĞAZA",    bg:"#FFF0D6", color:"#D97706", active:false,
                  icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg> },
                { label:"VETERİNER", bg:"#D6EEFF", color:"#2563EB", active:false,
                  icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> },
                { label:"ETKİNLİKLER", bg:"#F3E8FF", color:"#9333EA", active:false,
                  icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="14" x2="8" y2="14"/><line x1="12" y1="14" x2="12" y2="14"/><line x1="16" y1="14" x2="16" y2="14"/></svg> },
              ].map(({ label, bg, color, active, icon }) => (
                <button key={label} style={{
                  display:"flex", flexDirection:"column", alignItems:"center", gap:6,
                  background:"none", border:"none", cursor:"pointer",
                  minWidth:52, padding:"0 4px",
                }}>
                  <div style={{
                    width:48, height:48, borderRadius:"50%",
                    background: bg,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    color: color,
                  }}>
                    {icon}
                  </div>
                  <span style={{
                    fontSize:10, fontWeight:800, color: active ? color : "#444",
                    letterSpacing:"0.04em", fontFamily:"'Inter',sans-serif",
                    lineHeight:1,
                  }}>
                    {label}
                  </span>
                  {active && (
                    <div style={{ width:24, height:3, borderRadius:2, background: color, marginTop:1 }} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── PLACEHOLDER ───────────────────────────── */}
          <div style={{ margin:"8px 16px 24px", height:160, borderRadius:18, background:"#F9F9F9", display:"flex", alignItems:"center", justifyContent:"center", border:"1.5px dashed #e0e0e0" }}>
            <p style={{ color:"#ccc", fontSize:13, fontWeight:600, textAlign:"center" }}>Sonraki bölümler sırayla eklenecek ↓</p>
          </div>

        </div>
      </div>
    </>
  );
}
