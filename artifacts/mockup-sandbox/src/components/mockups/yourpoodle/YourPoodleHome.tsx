import { useState, useEffect } from "react";
import {
  Menu, User, Search, ChevronDown,
  ShoppingBag, BookOpen, LibraryBig, Users, X,
  GraduationCap, Heart, Scissors, MapPin,
  Bot, ChevronRight, PawPrint,
} from "lucide-react";

// ── Drawer links ──────────────────────────────────────────────────────────────
const DRAWER_LINKS = [
  { label: "Ana Sayfa",     href: "/" },
  { label: "Mama",          href: "/mama" },
  { label: "Eğitim",        href: "/egitim" },
  { label: "Sağlık",        href: "/saglik" },
  { label: "Bakım",         href: "/bakim" },
  { label: "Tuvalet",       href: "/tuvalet" },
  { label: "Ödül Mamaları", href: "/odul-mamasi" },
  { label: "Ürünler",       href: "/urunler" },
  { label: "Hizmetler",     href: "/hizmetler" },
  { label: "Rehber",        href: "/rehber" },
  { label: "Poodle Club",   href: "/club" },
];

// ── Languages ─────────────────────────────────────────────────────────────────
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

// ── 4-item nav strip ──────────────────────────────────────────────────────────
const NAV_STRIP = [
  { label: "Club",         Icon: Users,      href: "/club",       color: "#E75480", bg: "#FFF0F5" },
  { label: "Rehber",       Icon: BookOpen,   href: "/rehber",     color: "#7B3FC4", bg: "#F5F0FF" },
  { label: "Bilgi Bankası",Icon: LibraryBig, href: "/bilgi",      color: "#1A8F6F", bg: "#F0FDF8" },
  { label: "Mağaza",       Icon: ShoppingBag,href: "/magaza",     color: "#C0622F", bg: "#FFF8F0" },
];

// ── Pet bowl SVG ──────────────────────────────────────────────────────────────
const PetBowlIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11h18" /><path d="M5 11a7 7 0 0 0 14 0" />
    <path d="M10 7c0-1.1.9-2 2-2s2 .9 2 2" />
    <path d="M8 7c0-2.2 1.8-4 4-4s4 1.8 4 4" />
  </svg>
);
const MedalIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="14" r="6" /><path d="M8.21 4.37 9.5 2h5l1.29 2.37" /><path d="M9.5 2 12 8l2.5-6" />
  </svg>
);
const ToiletIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="7" height="7" rx="1" /><path d="M4 9h16a1 1 0 0 1 1 1v2a7 7 0 0 1-7 7H8a4 4 0 0 1-4-4V9z" />
  </svg>
);

// ── Pastel category strip (below search) ──────────────────────────────────────
const CATEGORIES = [
  { label: "Mama",      Icon: PetBowlIcon,   bg: "#FFE4EC", color: "#E75480", href: "/mama" },
  { label: "Eğitim",   Icon: GraduationCap, bg: "#FFE8D6", color: "#C0622F", href: "/egitim" },
  { label: "Sağlık",   Icon: Heart,         bg: "#D6F5EC", color: "#1A8F6F", href: "/saglik" },
  { label: "Bakım",    Icon: Scissors,      bg: "#EDE0FF", color: "#7B3FC4", href: "/bakim" },
  { label: "Tuvalet",  Icon: ToiletIcon,    bg: "#FFFBD0", color: "#8A7A00", href: "/tuvalet" },
  { label: "Ödül",     Icon: MedalIcon,     bg: "#D6EEFF", color: "#1565A8", href: "/odul-mamasi" },
  { label: "Ürünler",  Icon: ShoppingBag,   bg: "#FFE0F0", color: "#B5306A", href: "/urunler" },
  { label: "Hizmetler",Icon: MapPin,        bg: "#D6F5EE", color: "#1B7A62", href: "/hizmetler" },
];

// ── Flag pill ─────────────────────────────────────────────────────────────────
function FlagPill({ flag, code }: { flag: string; code: string }) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 800, color: "#333" }}>
      <span style={{ fontSize: 16, lineHeight: 1 }}>{flag}</span>
      {code}
    </span>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function YourPoodleHome() {
  const [drawerOpen, setDrawerOpen]     = useState(false);
  const [langOpen,   setLangOpen]       = useState(false);
  const [activeLang, setActiveLang]     = useState(LANGUAGES[0]);
  const [searchVal,  setSearchVal]      = useState("");
  const [heroVisible, setHeroVisible]   = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleSearch = () => {
    if (searchVal.trim()) alert(`/arama?q=${encodeURIComponent(searchVal)}`);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f0f0f0; }
        .noscroll::-webkit-scrollbar { display: none; }
        .noscroll { -ms-overflow-style: none; scrollbar-width: none; }
        .cat-tap:active { transform: scale(0.91); }
        .cat-tap { transition: transform 0.1s ease; }
        .nav-tap:active { opacity: 0.7; }
        .nav-tap { transition: opacity 0.1s; }
      `}</style>

      <div style={{ display:"flex", justifyContent:"center", alignItems:"flex-start", minHeight:"100vh", background:"#e5e7eb", padding:"24px 0 40px" }}>
        <div style={{ width:390, background:"#FAFAFA", borderRadius:36, overflow:"hidden", boxShadow:"0 24px 64px rgba(0,0,0,0.18)", fontFamily:"'Nunito',sans-serif", position:"relative", minHeight:760 }}>

          {/* ── DRAWER ────────────────────────────────────────────── */}
          {drawerOpen && (
            <div onClick={() => setDrawerOpen(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.32)", zIndex:100 }} />
          )}
          <div style={{
            position:"fixed", top:0, left:"50%", transform: drawerOpen ? "translateX(-195px)" : "translateX(-395px)",
            width:280, height:"100%", background:"#fff", zIndex:101,
            boxShadow:"4px 0 24px rgba(0,0,0,0.12)", transition:"transform 0.24s ease",
            display:"flex", flexDirection:"column",
          }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 16px 14px", borderBottom:"1px solid #f2f2f2" }}>
              <img src="/__mockup/images/yourpoodle-logo.jpg" alt="YourPoodle" style={{ height:32, objectFit:"contain" }} />
              <button aria-label="Kapat" onClick={() => setDrawerOpen(false)} style={{ width:34, height:34, borderRadius:"50%", border:"none", background:"#f5f5f5", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <X size={17} color="#555" />
              </button>
            </div>
            <nav style={{ overflowY:"auto", flex:1 }}>
              {DRAWER_LINKS.map(l => (
                <a key={l.href} href={l.href} onClick={() => setDrawerOpen(false)}
                  style={{ display:"flex", alignItems:"center", padding:"13px 18px", fontSize:14.5, fontWeight:700, color:"#1a1a1a", textDecoration:"none", borderBottom:"1px solid #fafafa" }}>
                  {l.label}
                </a>
              ))}
            </nav>
          </div>

          {/* ── STICKY HEADER ─────────────────────────────────────── */}
          <header style={{ position:"sticky", top:0, zIndex:50, background:"#fff", height:62, display:"flex", alignItems:"center", padding:"0 14px", borderBottom:"1px solid #f2f2f2", boxShadow:"0 1px 6px rgba(0,0,0,0.04)", gap:8 }}>

            {/* Hamburger */}
            <button aria-label="Menüyü aç" onClick={() => setDrawerOpen(true)}
              style={{ width:40, height:40, borderRadius:10, border:"none", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Menu size={23} color="#333" strokeWidth={2} />
            </button>

            {/* Logo — true center */}
            <div style={{ flex:1, display:"flex", justifyContent:"center" }}>
              <img src="/__mockup/images/yourpoodle-logo.jpg" alt="YourPoodle" style={{ height:36, width:150, objectFit:"contain" }} />
            </div>

            {/* Language picker (replaces AI button) */}
            <div style={{ position:"relative", flexShrink:0 }}>
              <button
                aria-label="Dil seç"
                onClick={() => setLangOpen(!langOpen)}
                style={{
                  display:"flex", alignItems:"center", gap:5,
                  padding:"6px 10px", borderRadius:20,
                  border:"1.5px solid #e8e8e8", background:"#fafafa",
                  cursor:"pointer", height:34,
                }}
              >
                <FlagPill flag={activeLang.flag} code={activeLang.code} />
                <ChevronDown size={13} color="#888" strokeWidth={2.5}
                  style={{ transform: langOpen ? "rotate(180deg)" : "none", transition:"transform 0.18s" }} />
              </button>

              {/* Dropdown */}
              {langOpen && (
                <div style={{
                  position:"absolute", right:0, top:40,
                  background:"#fff", borderRadius:14,
                  border:"1px solid #eee", boxShadow:"0 8px 28px rgba(0,0,0,0.12)",
                  zIndex:60, minWidth:110, padding:"4px 0",
                }}>
                  {LANGUAGES.map(l => (
                    <button key={l.code}
                      onClick={() => { setActiveLang(l); setLangOpen(false); }}
                      style={{
                        display:"flex", alignItems:"center", gap:8, width:"100%",
                        padding:"9px 14px", border:"none",
                        background: activeLang.code === l.code ? "#FFF5F8" : "transparent",
                        cursor:"pointer", fontSize:13, fontWeight:800,
                        color: activeLang.code === l.code ? "#E75480" : "#333",
                        fontFamily:"'Nunito',sans-serif",
                      }}
                    >
                      <span style={{ fontSize:16 }}>{l.flag}</span> {l.code}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Profile */}
            <a href="/giris" aria-label="Profil"
              style={{ width:36, height:36, borderRadius:"50%", background:"#F0F0F0", display:"flex", alignItems:"center", justifyContent:"center", textDecoration:"none", flexShrink:0 }}>
              <User size={18} color="#555" strokeWidth={2} />
            </a>
          </header>

          {/* ── SEARCH BAR ────────────────────────────────────────── */}
          <div style={{ padding:"14px 14px 0", background:"#fff" }}>
            <div style={{ display:"flex", alignItems:"center", background:"#F7F7F7", border:"1.5px solid #ececec", borderRadius:16, height:52, overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ paddingLeft:14, color:"#bbb", display:"flex", alignItems:"center" }}>
                <Search size={19} strokeWidth={2} />
              </div>
              <input
                type="text" value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                placeholder="Mama, eğitim, sağlık ara..."
                aria-label="Arama"
                style={{ flex:1, border:"none", outline:"none", fontSize:13.5, fontWeight:600, color:"#333", background:"transparent", padding:"0 10px", fontFamily:"'Nunito',sans-serif" }}
              />
              <button onClick={handleSearch} aria-label="Ara"
                style={{ height:"100%", padding:"0 20px", background:"linear-gradient(135deg,#FF80AB,#FF4081)", border:"none", cursor:"pointer", fontSize:13.5, fontWeight:800, color:"#fff", borderRadius:"0 14px 14px 0" }}>
                Ara
              </button>
            </div>
          </div>

          {/* ── 4-ITEM NAV STRIP ──────────────────────────────────── */}
          <div style={{ display:"flex", background:"#fff", padding:"10px 10px 14px", gap:8 }}>
            {NAV_STRIP.map(({ label, Icon, href, color, bg }) => (
              <a key={label} href={href} aria-label={label} className="nav-tap"
                style={{
                  flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                  gap:6, padding:"10px 4px 10px",
                  background: bg, borderRadius:14, textDecoration:"none",
                  border:`1.5px solid ${color}22`,
                }}>
                <Icon size={22} color={color} strokeWidth={1.8} />
                <span style={{ fontSize:10.5, fontWeight:800, color:"#333", textAlign:"center", lineHeight:1.2 }}>{label}</span>
              </a>
            ))}
          </div>

          {/* ── PASTEL CATEGORY STRIP ─────────────────────────────── */}
          <div style={{ background:"#fff", borderTop:"1px solid #f5f5f5" }}>
            <div className="noscroll" style={{ display:"flex", overflowX:"auto" }}>
              {CATEGORIES.map(({ label, Icon, bg, color, href }) => (
                <a key={label} href={href} aria-label={label} className="cat-tap"
                  style={{
                    display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                    gap:7, minWidth:88, height:96,
                    background: bg, textDecoration:"none", flexShrink:0,
                    borderRight:"1px solid rgba(255,255,255,0.7)",
                  }}>
                  <div style={{ color }}><Icon size={24} strokeWidth={1.7} /></div>
                  <span style={{ fontSize:11, fontWeight:800, color:"#2d2d2d" }}>{label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* ── HERO ──────────────────────────────────────────────── */}
          <section style={{
            position:"relative", overflow:"hidden",
            background:"#FFF9F6",
            minHeight:520, display:"flex", alignItems:"stretch",
          }}>
            {/* soft green blur top-right */}
            <div style={{ position:"absolute", top:-60, right:-40, width:200, height:200, borderRadius:"50%", background:"radial-gradient(circle,rgba(180,230,180,0.35) 0%,transparent 70%)", pointerEvents:"none" }} />
            {/* cream warm glow bottom */}
            <div style={{ position:"absolute", bottom:0, left:0, right:0, height:80, background:"linear-gradient(to top,rgba(255,240,220,0.5),transparent)", pointerEvents:"none" }} />

            {/* LEFT */}
            <div style={{
              width:"52%", padding:"28px 0 24px 18px",
              display:"flex", flexDirection:"column", justifyContent:"space-between",
              position:"relative", zIndex:2,
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateX(0)" : "translateX(-22px)",
              transition:"opacity 0.55s ease, transform 0.55s ease",
            }}>
              {/* slogan */}
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:4, marginBottom:10 }}>
                  <PawPrint size={14} color="#F58BAE" strokeWidth={2.5} />
                  <span style={{ fontFamily:"'Dancing Script',cursive", fontSize:13, color:"#888", lineHeight:1.35 }}>
                    Poodle'nız için<br />en iyisi burada
                  </span>
                  <Heart size={11} color="#F58BAE" fill="#F58BAE" style={{ marginLeft:2 }} />
                </div>

                {/* big title */}
                <h1 style={{
                  fontFamily:"'Playfair Display','DM Serif Display',Georgia,serif",
                  fontSize:46, fontWeight:900, lineHeight:1.05,
                  letterSpacing:"-1px", margin:"0 0 10px",
                }}>
                  <span style={{ color:"#222", display:"block" }}>Dünyanın</span>
                  <span style={{ color:"#222", display:"block" }}>En Büyük</span>
                  <span style={{ color:"#F58BAE", display:"block" }}>Toy Poodle</span>
                  <span style={{ color:"#222", display:"block" }}>Rehberi</span>
                </h1>

                <p style={{ fontFamily:"'Inter',sans-serif", fontSize:12.5, color:"#666", lineHeight:1.55, marginBottom:18 }}>
                  Köpeğiniz için ihtiyacınız olan<br />her şey tek yerde.
                  <Heart size={11} color="#F58BAE" fill="#F58BAE" style={{ marginLeft:5, verticalAlign:"middle" }} />
                </p>

                {/* CTA buttons */}
                <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
                  {[
                    { label:"Mama Bul",    href:"/mama",          bg:"linear-gradient(135deg,#FF7FA7,#F5678D)", delay:"0.1s" },
                    { label:"Rehbere Git", href:"/rehber",        bg:"linear-gradient(135deg,#A77BFF,#8B6CF0)", delay:"0.2s" },
                    { label:"AI Asistan",  href:"/ai-asistan",    bg:"linear-gradient(135deg,#78BEFF,#60A9F6)", delay:"0.3s" },
                  ].map(({ label, href, bg, delay }, i) => (
                    <a key={label} href={href}
                      style={{
                        display:"flex", alignItems:"center", justifyContent:"space-between",
                        height:52, padding:"0 14px",
                        background: bg, borderRadius:14,
                        textDecoration:"none", cursor:"pointer",
                        boxShadow:"0 3px 12px rgba(0,0,0,0.12)",
                        opacity: heroVisible ? 1 : 0,
                        transform: heroVisible ? "translateY(0)" : "translateY(12px)",
                        transition:`opacity 0.4s ease ${delay}, transform 0.4s ease ${delay}`,
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform="translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow="0 8px 20px rgba(0,0,0,0.18)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform="translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow="0 3px 12px rgba(0,0,0,0.12)"; }}
                    >
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        {i === 0 && <span style={{ fontSize:16 }}>🍖</span>}
                        {i === 1 && <BookOpen size={16} color="#fff" strokeWidth={2} />}
                        {i === 2 && <Bot size={16} color="#fff" strokeWidth={2} />}
                        <span style={{ fontFamily:"'Inter',sans-serif", fontSize:13, fontWeight:700, color:"#fff" }}>{label}</span>
                      </div>
                      <ChevronRight size={16} color="rgba(255,255,255,0.85)" strokeWidth={2.5} />
                    </a>
                  ))}
                </div>
              </div>

              {/* avatar row */}
              <div style={{
                display:"flex", alignItems:"center", gap:10, marginTop:16,
                background:"rgba(255,255,255,0.75)", backdropFilter:"blur(8px)",
                borderRadius:40, padding:"8px 14px", alignSelf:"flex-start",
                boxShadow:"0 2px 12px rgba(0,0,0,0.07)",
              }}>
                <div style={{ display:"flex" }}>
                  {[1,2,3].map(i => (
                    <img key={i} src={`/__mockup/images/poodle-avatar-${i}.jpg`}
                      alt="poodle avatar"
                      style={{ width:28, height:28, borderRadius:"50%", border:"2px solid #fff", marginLeft: i===1?0:-8, objectFit:"cover" }}
                      onError={e => { (e.target as HTMLImageElement).style.background="#F58BAE"; (e.target as HTMLImageElement).src=""; }}
                    />
                  ))}
                </div>
                <Heart size={14} color="#F58BAE" fill="#F58BAE" />
                <div style={{ fontFamily:"'Inter',sans-serif" }}>
                  <span style={{ fontSize:13, fontWeight:900, color:"#222" }}>10.000+</span>
                  <span style={{ fontSize:11, color:"#888", marginLeft:4 }}>mutlu poodle ailesi</span>
                </div>
              </div>
            </div>

            {/* RIGHT — poodle image */}
            <div style={{
              width:"48%", position:"relative",
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateX(0)" : "translateX(28px)",
              transition:"opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
            }}>
              <img
                src="/__mockup/images/poodle-hero.png"
                alt="Mutlu Toy Poodle"
                style={{
                  position:"absolute", bottom:0, right:-10,
                  width:"115%", maxWidth:260,
                  objectFit:"contain", objectPosition:"bottom",
                  filter:"drop-shadow(0 8px 24px rgba(0,0,0,0.08))",
                }}
              />
            </div>
          </section>

          {/* ── PLACEHOLDER for next sections ─────────────────────── */}
          <div style={{ margin:"16px 14px 24px", height:80, borderRadius:18, background:"linear-gradient(135deg,#FFF0F6,#F5EEFF)", display:"flex", alignItems:"center", justifyContent:"center", border:"1.5px dashed #ddd" }}>
            <p style={{ color:"#bbb", fontSize:13, fontWeight:700, textAlign:"center" }}>Sonraki bölümler sırayla eklenecek ↓</p>
          </div>

        </div>
      </div>
    </>
  );
}
