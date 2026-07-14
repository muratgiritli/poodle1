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

          {/* ── BİLGİ BANKASI ─────────────────────────── */}
          <section style={{ padding:"20px 16px 24px", background:"#fff" }}>
            {/* header */}
            <div style={{ marginBottom:4, display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:20 }}>⚡</span>
              <span style={{ fontSize:18, fontWeight:800, color:"#1a1a1a", fontFamily:"'Inter',sans-serif" }}>Bilgi Bankası</span>
            </div>
            <p style={{ fontSize:13, color:"#888", fontFamily:"'Inter',sans-serif", marginBottom:18 }}>
              Poodle'iniz için en çok kullanılan araçlar.
            </p>

            {/* 3-col grid */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"20px 8px" }}>
              {[
                { label:"Mama Hesaplama",  desc:"Günlük mama miktarını hesapla",      bg:"#FFF0E0", color:"#E07820",
                  icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> },
                { label:"Aşı Takvimi",     desc:"Aşılarını düzenli takip et",         bg:"#FFE4EC", color:"#E75480",
                  icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 2 4 4-14 14H4v-4Z"/><path d="m14.5 5.5 4 4"/></svg> },
                { label:"Yaş Hesaplama",   desc:"Köpek yaşını insan yaşına çevir",    bg:"#F0E8FF", color:"#7C3AFF",
                  icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
                { label:"İdeal Kilo",      desc:"İdeal kilosunu öğren",               bg:"#D6F5E8", color:"#059669",
                  icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a9 9 0 1 0 0 18A9 9 0 0 0 12 3z"/><path d="M8 12h8"/><path d="M6 17 12 3l6 14"/></svg> },
                { label:"Hastalık Kontrolü",desc:"Belirtileri kontrol et",            bg:"#EDE8FF", color:"#7C3AFF",
                  icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg> },
                { label:"Diş Kontrolü",    desc:"Ağız ve diş sağlığı listesi",        bg:"#D6F5F5", color:"#0891B2",
                  icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg> },
                { label:"Dışkı Rehberi",   desc:"Rengine göre kontrol et",            bg:"#FEFCE8", color:"#CA8A04",
                  icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
                { label:"Su Hesaplama",    desc:"Günlük su ihtiyacını hesapla",       bg:"#DBEAFE", color:"#2563EB",
                  icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg> },
                { label:"Tıraş Zamanı",    desc:"Son tıraş tarihine göre hesapla",   bg:"#FFE4EC", color:"#E75480",
                  icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><line x1="20.49" y1="3.51" x2="3.51" y2="20.49"/></svg> },
                { label:"Ödül Hesabı",     desc:"Ödül mamasının kalorini hesapla",   bg:"#FFF9C4", color:"#CA8A04",
                  icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 10c.7-.7 1.69 0 2.5 1a2.02 2.02 0 0 1 0 2.5c-.71.7-1.73.2-2.25-.25"/><path d="M10 17c-.7.7 0 1.69 1 2.5a2.02 2.02 0 0 0 2.5 0c.7-.71.2-1.73-.25-2.25"/><path d="M6.08 14c.5-.5.56-2.68 1.92-4.08S11.5 8.58 12 8"/><path d="M9 21c-2.8-.47-5.58-2.26-6.41-5.59a6 6 0 0 1 3.41-6.93"/><path d="M15 3c2.8.47 5.58 2.26 6.41 5.59a6 6 0 0 1-3.41 6.93"/></svg> },
                { label:"Aktivite Hesabı", desc:"Günlük egzersiz ihtiyacını öğren",  bg:"#CCFBF1", color:"#0D9488",
                  icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3c0 2.2-1.2 3-2 3H5"/><path d="M4.6 13c.5.7 1.4 1 2.4 1h.5c1.1 0 2-.9 2-2V11"/><circle cx="12" cy="12" r="1"/><path d="m18.5 5-3.5 3"/><path d="m15.5 5 3.5 3"/><path d="M12 19a7 7 0 1 0 0-14 7 7 0 0 0 0 14z"/></svg> },
                { label:"İnsan Yaşı",      desc:"Karşılaştırmalı yaş tablosu",       bg:"#FFF0E0", color:"#E07820",
                  icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.469 2.344-2.5"/><path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.96-1.469-2.344-2.5"/><path d="M8 14v.5"/><path d="M16 14v.5"/><path d="M11.25 16.25h1.5L12 17l-.75-.75Z"/><path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306"/></svg> },
              ].map(({ label, desc, bg, color, icon }) => (
                <button key={label} style={{
                  display:"flex", flexDirection:"column", alignItems:"center",
                  gap:8, background:"none", border:"none", cursor:"pointer",
                  padding:0, textAlign:"center",
                }}>
                  <div style={{ width:52, height:52, borderRadius:"50%", background:bg, display:"flex", alignItems:"center", justifyContent:"center", color }}>
                    {icon}
                  </div>
                  <div>
                    <div style={{ fontSize:11.5, fontWeight:800, color:"#1a1a1a", fontFamily:"'Inter',sans-serif", lineHeight:1.3, marginBottom:3 }}>{label}</div>
                    <div style={{ fontSize:10, color:"#888", fontFamily:"'Inter',sans-serif", lineHeight:1.35 }}>{desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* ── GÜNÜN İPUCU ───────────────────────────── */}
          <div style={{ margin:"0 16px 0", background:"linear-gradient(135deg,#EDE8FF,#F5F0FF)", borderRadius:16, padding:"14px 16px", display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:24, flexShrink:0 }}>💡</span>
            <div>
              <div style={{ fontSize:11, fontWeight:800, color:"#7C3AFF", letterSpacing:"0.06em", marginBottom:3, fontFamily:"'Inter',sans-serif" }}>GÜNÜN İPUCU</div>
              <div style={{ fontSize:13, color:"#333", fontFamily:"'Inter',sans-serif", lineHeight:1.5 }}>
                Toy Poodle'ların tüyleri sürekli uzar, 6-8 haftada bir tıraş rutini oluşturun.
              </div>
            </div>
          </div>

          {/* ── SON REHBER YAZILARI ────────────────────── */}
          <section style={{ padding:"24px 16px 8px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:18 }}>📖</span>
                <span style={{ fontSize:16, fontWeight:800, color:"#1a1a1a", fontFamily:"'Inter',sans-serif" }}>Son Rehber Yazıları</span>
              </div>
              <a href="/rehber" style={{ fontSize:12, fontWeight:700, color:"#7C3AFF", textDecoration:"none", fontFamily:"'Inter',sans-serif" }}>Tümü →</a>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {[
                { emoji:"🍖", tag:"Beslenme",  title:"Toy Poodle İçin En İyi Mama Markaları 2024",       min:"5 dk" },
                { emoji:"🛁", tag:"Bakım",     title:"Evde Poodle Tıraşı: Adım Adım Rehber",             min:"8 dk" },
                { emoji:"💊", tag:"Sağlık",    title:"Poodle'larda Görülen 10 Yaygın Sağlık Sorunu",     min:"6 dk" },
              ].map(({ emoji, tag, title, min }) => (
                <div key={title} style={{ display:"flex", gap:12, alignItems:"center", padding:"12px", background:"#FAFAFA", borderRadius:14, cursor:"pointer" }}>
                  <div style={{ width:48, height:48, borderRadius:12, background:"#EDE8FF", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{emoji}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:"#7C3AFF", marginBottom:4, fontFamily:"'Inter',sans-serif" }}>{tag}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:"#1a1a1a", fontFamily:"'Inter',sans-serif", lineHeight:1.4 }}>{title}</div>
                  </div>
                  <div style={{ fontSize:11, color:"#aaa", fontFamily:"'Inter',sans-serif", flexShrink:0 }}>{min}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── ÖNERILEN ÜRÜNLER ──────────────────────── */}
          <section style={{ padding:"24px 16px 8px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:18 }}>🛍️</span>
                <span style={{ fontSize:16, fontWeight:800, color:"#1a1a1a", fontFamily:"'Inter',sans-serif" }}>Öne Çıkan Ürünler</span>
              </div>
              <a href="/magaza" style={{ fontSize:12, fontWeight:700, color:"#7C3AFF", textDecoration:"none", fontFamily:"'Inter',sans-serif" }}>Tümü →</a>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
              {[
                { emoji:"🦴", name:"Royal Canin Poodle Adult", price:"₺485", badge:"En Çok Satan" },
                { emoji:"✂️", name:"Slicker Tıraş Fırçası",    price:"₺129", badge:"" },
                { emoji:"🎀", name:"Poodle Fiyonk Seti",        price:"₺79",  badge:"Yeni" },
                { emoji:"💊", name:"Eklem Takviyesi Kapsül",    price:"₺320", badge:"" },
                { emoji:"🛁", name:"Köpek Şampuanı 500ml",      price:"₺189", badge:"İndirim" },
                { emoji:"🏠", name:"Taşıma Çantası Soft",       price:"₺599", badge:"" },
                { emoji:"🧶", name:"Interaktif Oyuncak Set",    price:"₺149", badge:"Popüler" },
                { emoji:"🪮", name:"Profesyonel Tarak Seti",    price:"₺219", badge:"" },
                { emoji:"🎾", name:"Mini Tenis Topu 3'lü",      price:"₺59",  badge:"" },
              ].map(({ emoji, name, price, badge }) => (
                <div key={name} style={{ background:"#FAFAFA", borderRadius:14, overflow:"hidden", cursor:"pointer", display:"flex", flexDirection:"column" }}>
                  <div style={{ background:"#F0ECFF", height:80, display:"flex", alignItems:"center", justifyContent:"center", fontSize:34, position:"relative" }}>
                    {emoji}
                    {badge && (
                      <div style={{ position:"absolute", top:6, left:6, background:"#7C3AFF", borderRadius:6, padding:"2px 6px" }}>
                        <span style={{ fontSize:8, fontWeight:800, color:"#fff", fontFamily:"'Inter',sans-serif" }}>{badge}</span>
                      </div>
                    )}
                  </div>
                  <div style={{ padding:"8px 8px 10px" }}>
                    <div style={{ fontSize:10.5, fontWeight:700, color:"#1a1a1a", fontFamily:"'Inter',sans-serif", lineHeight:1.3, marginBottom:4 }}>{name}</div>
                    <div style={{ fontSize:12, fontWeight:900, color:"#7C3AFF", fontFamily:"'Inter',sans-serif" }}>{price}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── SON TOPLULUK PAYLASIMLARI ─────────────── */}
          <section style={{ padding:"24px 16px 8px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:18 }}>👥</span>
                <span style={{ fontSize:16, fontWeight:800, color:"#1a1a1a", fontFamily:"'Inter',sans-serif" }}>Topluluk Paylaşımları</span>
              </div>
              <a href="/topluluk" style={{ fontSize:12, fontWeight:700, color:"#7C3AFF", textDecoration:"none", fontFamily:"'Inter',sans-serif" }}>Tümü →</a>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {[
                { avatar:"🐩", user:"poodlemom_ayse",   time:"2 saat önce",  text:"Bugün Mocha'nın ilk tıraşını yaptırdık! Muhteşem oldu 🎀",          likes:48 },
                { avatar:"🐾", user:"toypoodle_club",   time:"5 saat önce",  text:"Yeni mama geçişimizde hiçbir sorun yaşamadık, ipuçları için teşekkürler!", likes:32 },
                { avatar:"🤍", user:"poodle_istanbul",  time:"1 gün önce",   text:"Bebek Poodle'mın 6. ayında aşıları tamam, sağlıklı büyüyor 💜",     likes:91 },
              ].map(({ avatar, user, time, text, likes }) => (
                <div key={user} style={{ background:"#FAFAFA", borderRadius:14, padding:"12px 14px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                    <div style={{ width:36, height:36, borderRadius:"50%", background:"#EDE8FF", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{avatar}</div>
                    <div>
                      <div style={{ fontSize:12, fontWeight:800, color:"#1a1a1a", fontFamily:"'Inter',sans-serif" }}>@{user}</div>
                      <div style={{ fontSize:10, color:"#aaa", fontFamily:"'Inter',sans-serif" }}>{time}</div>
                    </div>
                  </div>
                  <p style={{ fontSize:13, color:"#333", fontFamily:"'Inter',sans-serif", lineHeight:1.5, margin:"0 0 8px" }}>{text}</p>
                  <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <span style={{ fontSize:14 }}>💜</span>
                    <span style={{ fontSize:11, color:"#888", fontFamily:"'Inter',sans-serif" }}>{likes} beğeni</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── HAFTANIN POODLE'I ─────────────────────── */}
          <section style={{ padding:"24px 16px 8px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
              <span style={{ fontSize:18 }}>⭐</span>
              <span style={{ fontSize:16, fontWeight:800, color:"#1a1a1a", fontFamily:"'Inter',sans-serif" }}>Haftanın Poodle'ı</span>
            </div>
            <div style={{ background:"linear-gradient(135deg,#B39DFF,#D4C4FF)", borderRadius:20, padding:"20px", display:"flex", gap:16, alignItems:"center" }}>
              <div style={{ width:80, height:80, borderRadius:20, background:"rgba(255,255,255,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:42, flexShrink:0 }}>🐩</div>
              <div>
                <div style={{ fontSize:11, fontWeight:800, color:"rgba(255,255,255,0.8)", letterSpacing:"0.06em", marginBottom:4, fontFamily:"'Inter',sans-serif" }}>BU HAFTANIN YILDIZI</div>
                <div style={{ fontSize:18, fontWeight:900, color:"#fff", fontFamily:"'Inter',sans-serif", marginBottom:4 }}>Mocha ✨</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.9)", fontFamily:"'Inter',sans-serif", lineHeight:1.4 }}>3 yaşında, İstanbul'dan.<br />Topluluğun en sevilen poodlelerinden!</div>
                <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:8 }}>
                  <span style={{ fontSize:14 }}>💜</span>
                  <span style={{ fontSize:12, color:"#fff", fontWeight:700, fontFamily:"'Inter',sans-serif" }}>1.243 beğeni</span>
                </div>
              </div>
            </div>
          </section>

          {/* ── YAKLAŞAN ETKİNLİKLER ─────────────────── */}
          <section style={{ padding:"24px 16px 8px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:18 }}>📅</span>
                <span style={{ fontSize:16, fontWeight:800, color:"#1a1a1a", fontFamily:"'Inter',sans-serif" }}>Yaklaşan Etkinlikler</span>
              </div>
              <a href="/etkinlikler" style={{ fontSize:12, fontWeight:700, color:"#7C3AFF", textDecoration:"none", fontFamily:"'Inter',sans-serif" }}>Tümü →</a>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {[
                { day:"18", month:"OCA", title:"Poodle Buluşması — Kadıköy",    loc:"İstanbul",  color:"#FF7FA7" },
                { day:"25", month:"OCA", title:"Online: Tıraş Teknikleri Webinarı", loc:"Zoom",  color:"#A77BFF" },
                { day:"03", month:"ŞUB", title:"Poodle Agility Yarışması",       loc:"Ankara",   color:"#78BEFF" },
              ].map(({ day, month, title, loc, color }) => (
                <div key={title} style={{ display:"flex", gap:12, alignItems:"center", padding:"12px 14px", background:"#FAFAFA", borderRadius:14, cursor:"pointer" }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:color + "22", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <div style={{ fontSize:16, fontWeight:900, color, fontFamily:"'Inter',sans-serif", lineHeight:1 }}>{day}</div>
                    <div style={{ fontSize:9, fontWeight:800, color, fontFamily:"'Inter',sans-serif" }}>{month}</div>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:"#1a1a1a", fontFamily:"'Inter',sans-serif", lineHeight:1.3, marginBottom:3 }}>{title}</div>
                    <div style={{ fontSize:11, color:"#888", fontFamily:"'Inter',sans-serif" }}>📍 {loc}</div>
                  </div>
                  <div style={{ fontSize:18 }}>›</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── ÜYE YORUMLARI ────────────────────────── */}
          <section style={{ padding:"24px 16px 32px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
              <span style={{ fontSize:18 }}>💬</span>
              <span style={{ fontSize:16, fontWeight:800, color:"#1a1a1a", fontFamily:"'Inter',sans-serif" }}>Üye Yorumları</span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {[
                { emoji:"🌸", name:"Zeynep K.",    stars:5, text:"YourPoodle sayesinde poodlem için doğru mamayı bulduk. Harika bir platform!" },
                { emoji:"🐶", name:"Mert A.",      stars:5, text:"Bilgi bankası inanılmaz kapsamlı. Her sorunun cevabı burada." },
                { emoji:"💜", name:"Selin T.",     stars:5, text:"Club üyeliği çok değerli, topluluktaki insanlar gerçekten yardımsever." },
              ].map(({ emoji, name, stars, text }) => (
                <div key={name} style={{ background:"#FAFAFA", borderRadius:16, padding:"14px 16px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                    <div style={{ width:36, height:36, borderRadius:"50%", background:"#EDE8FF", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{emoji}</div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:800, color:"#1a1a1a", fontFamily:"'Inter',sans-serif" }}>{name}</div>
                      <div style={{ fontSize:12, color:"#F59E0B" }}>{"★".repeat(stars)}</div>
                    </div>
                  </div>
                  <p style={{ fontSize:13, color:"#444", fontFamily:"'Inter',sans-serif", lineHeight:1.55, margin:0 }}>{text}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
