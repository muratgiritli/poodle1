import { useState } from "react";

// ── inline SVG icons to avoid any import issues ─────────────────────────────
const Icon = ({ d, size = 22, stroke = "#7C3AED", fill = "none", strokeWidth = 2.2 }: { d: string; size?: number; stroke?: string; fill?: string; strokeWidth?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const SEARCH   = "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z";
const CART     = "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0";
const MENU     = "M3 12h18M3 6h18M3 18h18";
const HOME     = "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z";
const HEART    = "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z";
const BOOK     = "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z";
const GIFT     = "M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7z";
const SHIELD   = "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z";
const CALENDAR = "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z";
const USERS    = "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z";
const SHOP_BAG = "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0";
const PERSON   = "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z";

// food cross
const FOOD_X   = "M18 6 6 18M6 6l12 12";
const SYRINGE  = "m18 2-4 4M2 22l7-7m9-13 2 2-9.5 9.5-3.5.5.5-3.5L18 2zM14 8l2 2";
const CAKE     = "M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8M2 21h20M7 21v-8M12 21v-8M17 21v-8M12 3a2 2 0 0 0 2-2M10 1c0 1.1.9 2 2 2";
const SCALE    = "M16 16v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2M12 2v14M7 9l5-7 5 7M2 22h20";
const STETHOSCOPE = "M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4";
const SMILE    = "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01";
const DROPLET  = "M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69z";
const SCISSORS = "M6 3a3 3 0 0 1 0 6c-.79 0-1.5-.29-2.05-.76L9 12l-5.05 3.76C3.5 15.29 4.21 15 5 15a3 3 0 0 1 0 6c-1.66 0-3-1.34-3-3 0-.79.29-1.5.76-2.05L5 14l-2.24-1.95A3 3 0 0 1 3 9c0-1.66 1.34-3 3-3zm12 0c1.66 0 3 1.34 3 3s-1.34 3-3 3c-.79 0-1.5-.29-2.05-.76L9 12l6.95-5.76A2.97 2.97 0 0 1 18 3zM9 12l-3 2.25";
const BONE     = "M17 10c.7-.7 1.69-.8 2.5-.4l1.5-1.5a3 3 0 0 0-4.24-4.24L15.26 5.4c-.4-.81-.3-1.8.4-2.5M7 14c-.7.7-1.69.8-2.5.4L3 15.9a3 3 0 0 0 4.24 4.24l1.4-1.5c.41.81.3 1.8-.4 2.5M14 6l-8 8";
const PAW      = "M11 2c-1.1 0-2 1.1-2 2.5S9.9 7 11 7s2-1.1 2-2.5S12.1 2 11 2zM16 4c-.8 0-1.5.9-1.5 2s.7 2 1.5 2 1.5-.9 1.5-2S16.8 4 16 4zM6.5 5C5.7 5 5 5.9 5 7s.7 2 1.5 2S8 8.1 8 7s-.7-2-1.5-2zM19 9c-.6 0-1 .6-1 1.5S18.4 12 19 12s1-.6 1-1.5S19.6 9 19 9zM4.5 9c-.6 0-1 .6-1 1.5S3.9 12 4.5 12s1-.6 1-1.5S5.1 9 4.5 9zM11.5 10c-3.5 0-6.5 2.7-6.5 7 0 2 1 3 2.5 3 1 0 2-.5 3-1 .5-.3 1-.5 1.5-.5s1 .2 1.5.5c1 .5 2 1 3 1 1.5 0 2.5-1 2.5-3 0-4.3-3-7-7.5-7z";
const CIRCLE   = "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z";

export default function PoodleHomepage() {
  const [activeTab, setActiveTab] = useState("home");

  const navItems = [
    { icon: HOME,     label: "AKIŞ",      color: "#7C3AED", bg: "#F3E8FF", active: true },
    { icon: HEART,    label: "TOPLULUK",  color: "#F43F5E", bg: "#FFF1F2" },
    { icon: BOOK,     label: "REHBER",    color: "#14B8A6", bg: "#F0FDFA" },
    { icon: GIFT,     label: "MAĞAZA",    color: "#F97316", bg: "#FFF7ED" },
    { icon: SHIELD,   label: "VETERİNER", color: "#0EA5E9", bg: "#F0F9FF" },
    { icon: CALENDAR, label: "ETKİNLİKLER", color: "#6366F1", bg: "#EEF2FF" },
  ];

  const tools = [
    { icon: FOOD_X,      bg: "#FFE4E6", fg: "#F43F5E", label: "Mama Hesaplama",   desc: "Günlük mama miktarını hesapla" },
    { icon: SYRINGE,     bg: "#FEE2E2", fg: "#EF4444", label: "Aşı Takvimi",      desc: "Aşılarını düzenli takip et" },
    { icon: CAKE,        bg: "#EDE9FE", fg: "#8B5CF6", label: "Yaş Hesaplama",    desc: "Köpek yaşını insan yaşına çevir" },
    { icon: SCALE,       bg: "#D1FAE5", fg: "#10B981", label: "İdeal Kilo",       desc: "İdeal kilosunu öğren" },
    { icon: STETHOSCOPE, bg: "#CFFAFE", fg: "#06B6D4", label: "Hastalık Kontrolü",desc: "Belirtileri kontrol et" },
    { icon: SMILE,       bg: "#FEF3C7", fg: "#F59E0B", label: "Diş Kontrolü",     desc: "Ağız ve diş sağlığı tüyosu" },
    { icon: DROPLET,     bg: "#DCFCE7", fg: "#22C55E", label: "Dışkı Rehberi",    desc: "Rengine göre kontrol et" },
    { icon: DROPLET,     bg: "#DBEAFE", fg: "#3B82F6", label: "Su Hesaplama",     desc: "Günlük su ihtiyacını hesapla" },
    { icon: SCISSORS,    bg: "#FCE7F3", fg: "#EC4899", label: "Tıraş Zamanı",     desc: "Son tıraş tarihine göre hesapla" },
    { icon: BONE,        bg: "#FFEDD5", fg: "#F97316", label: "Ödül Rehberi",     desc: "Ne kadar ödül vermeli?" },
    { icon: PAW,         bg: "#CCFBF1", fg: "#14B8A6", label: "Pati Bakımı",      desc: "Günlük pati bakım rutini" },
    { icon: CIRCLE,      bg: "#E0E7FF", fg: "#6366F1", label: "Oyun Saati",       desc: "Günlük oyun ihtiyacı" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Nunito:wght@400;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#f3f4f6}
        .noscroll::-webkit-scrollbar{display:none}
        .noscroll{-ms-overflow-style:none;scrollbar-width:none}
      `}</style>

      <div style={{ display:"flex", justifyContent:"center", alignItems:"flex-start", minHeight:"100vh", background:"#e5e7eb", padding:"20px 0" }}>
        <div style={{ width:390, background:"#FDFDFD", borderRadius:32, overflow:"hidden", boxShadow:"0 20px 60px rgba(0,0,0,0.15)", fontFamily:"'Nunito',sans-serif", position:"relative" }}>

          {/* ── HEADER */}
          <div style={{ background:"#fff", padding:"14px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"1px solid #f1f1f1" }}>
            <div style={{ width:28 }} />
            <span style={{ fontFamily:"'Dancing Script',cursive", fontSize:26, fontWeight:700, color:"#111" }}>YourPoodle</span>
            <div style={{ display:"flex", alignItems:"center", gap:14, color:"#374151" }}>
              <Icon d={SEARCH} size={20} stroke="#374151" />
              <Icon d={CART}   size={20} stroke="#374151" />
              <span style={{ fontSize:12, fontWeight:700, display:"flex", alignItems:"center", gap:4 }}>
                <span style={{ fontSize:16 }}>🇬🇧</span> EN
              </span>
              <Icon d={MENU}   size={22} stroke="#374151" />
            </div>
          </div>

          {/* ── NAV TABS */}
          <div style={{ background:"#fff", display:"flex", borderBottom:"1px solid #f1f1f1" }}>
            {[
              { id:"home",  label:"Home" },
              { id:"guide", label:"Guide" },
              { id:"kb",    label:"Knowledge Base" },
              { id:"shop",  label:"Shop" },
            ].map(t => (
              <div key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  flex:1, textAlign:"center", padding:"13px 0",
                  fontSize:13, fontWeight:800, cursor:"pointer",
                  color: activeTab===t.id ? "#7C3AED" : "#9CA3AF",
                  borderBottom: activeTab===t.id ? "3px solid #7C3AED" : "3px solid transparent",
                  transition:"all .15s",
                }}
              >{t.label}</div>
            ))}
          </div>

          {/* ── HERO */}
          <div style={{
            background:"linear-gradient(135deg,#C4B5FD 0%,#A78BFA 30%,#8B5CF6 60%,#C4B5FD 100%)",
            margin:"0", padding:"24px 20px 20px 20px",
            position:"relative", minHeight:360, overflow:"hidden",
          }}>
            {/* badge */}
            <div style={{ display:"inline-block", background:"rgba(255,255,255,0.25)", color:"#fff", fontSize:10, fontWeight:900, letterSpacing:"0.12em", padding:"4px 12px", borderRadius:20, marginBottom:12 }}>
              DÜNYANIN EN BÜYÜK
            </div>

            {/* big title */}
            <div style={{ width:"58%", position:"relative", zIndex:2 }}>
              <h1 style={{ fontSize:42, fontWeight:900, color:"#111", lineHeight:1.05, letterSpacing:"-1px" }}>
                POODLE<br />AİLESİNE
              </h1>
              <p style={{ fontFamily:"'Dancing Script',cursive", fontSize:26, color:"#7C3AED", fontWeight:700, marginTop:4 }}>
                Hoş Geldiniz! 💜
              </p>
              <p style={{ fontSize:12.5, color:"#374151", fontWeight:600, marginTop:12, lineHeight:1.5 }}>
                Toy Poodle'inize dair her şey burada! Sağlık,<br />topluluk, özel ayrıcalıklar...
              </p>
            </div>

            {/* poodle image */}
            <div style={{ position:"absolute", right:-50, top:"50%", transform:"translateY(-48%)", width:260, height:280, pointerEvents:"none", zIndex:1 }}>
              <img
                src="/images/poodle-hero.png"
                alt="Toy Poodle"
                style={{ width:"100%", height:"100%", objectFit:"contain", filter:"drop-shadow(0 8px 24px rgba(0,0,0,0.15))" }}
                onError={e => { (e.target as HTMLImageElement).style.display="none"; }}
              />
              {/* fallback emoji */}
              <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:120, zIndex:-1 }}>🐩</div>
            </div>

            {/* buttons */}
            <div style={{ marginTop:22, position:"relative", zIndex:2, display:"flex", flexDirection:"column", gap:10, width:"62%" }}>
              <button style={{
                background:"#7C3AED", color:"#fff", border:"none", borderRadius:50,
                padding:"13px 0", fontSize:13.5, fontWeight:900, cursor:"pointer",
                boxShadow:"0 6px 20px -4px rgba(124,58,237,0.5)", letterSpacing:"0.02em",
              }}>CLUB'A KATIL 🐾</button>
              <button style={{
                background:"#fff", color:"#7C3AED", border:"2px solid #C4B5FD", borderRadius:50,
                padding:"12px 0", fontSize:13.5, fontWeight:900, cursor:"pointer",
              }}>POODLE'İMİ EKLE +</button>
            </div>

            {/* avatars + count */}
            <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:16, position:"relative", zIndex:2 }}>
              <div style={{ display:"flex" }}>
                {[1,2,3,4].map(i => (
                  <img key={i}
                    src={`/images/poodle-avatar-${i}.jpg`}
                    style={{ width:28, height:28, borderRadius:"50%", border:"2px solid #E9D5FF", marginLeft: i===1 ? 0 : -8, objectFit:"cover" }}
                    onError={e => {
                      const el = e.target as HTMLImageElement;
                      el.style.display="none";
                    }}
                  />
                ))}
              </div>
              <div style={{ fontSize:11, lineHeight:1.3 }}>
                <strong style={{ color:"#111", fontSize:12 }}>10.000+</strong>{" "}
                <span style={{ color:"#4B5563" }}>mutlu poodle ailesi 💜</span>
              </div>
            </div>
          </div>

          {/* ── QUICK NAV STRIP */}
          <div style={{ background:"#fff", margin:"0", padding:"10px 12px 12px", borderBottom:"1px solid #f5f5f5" }}>
            <div className="noscroll" style={{ display:"flex", overflowX:"auto", gap:4 }}>
              {navItems.map((item, i) => (
                <div key={i} style={{
                  display:"flex", flexDirection:"column", alignItems:"center",
                  gap:5, minWidth:60, padding:"6px 2px 8px", cursor:"pointer", position:"relative",
                }}>
                  <div style={{
                    width:50, height:50, borderRadius:"50%",
                    background: item.active ? "#F3E8FF" : item.bg,
                    display:"flex", alignItems:"center", justifyContent:"center",
                  }}>
                    <Icon d={item.icon} size={22} stroke={item.color} />
                  </div>
                  <span style={{ fontSize:9.5, fontWeight:800, color: item.active ? "#7C3AED" : "#6B7280", letterSpacing:"0.04em", textAlign:"center" }}>
                    {item.label}
                  </span>
                  {item.active && (
                    <div style={{ position:"absolute", bottom:0, width:32, height:3, background:"#7C3AED", borderRadius:"2px 2px 0 0" }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── BİLGİ BANKASI */}
          <div style={{ background:"#fff", margin:"8px 10px", borderRadius:24, padding:"20px 16px 24px", border:"1px solid #f0f0f0", boxShadow:"0 2px 10px rgba(0,0,0,0.04)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
              <h2 style={{ fontSize:18, fontWeight:900, color:"#111", display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ color:"#FACC15" }}>⚡</span> Bilgi Bankası
              </h2>
              <span style={{ fontSize:12, fontWeight:800, color:"#7C3AED", cursor:"pointer" }}>Tümü →</span>
            </div>
            <p style={{ fontSize:12, color:"#6B7280", fontWeight:600, marginBottom:20 }}>Poodle'iniz için en çok kullanılan araçlar.</p>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"20px 8px" }}>
              {tools.map((tool, i) => (
                <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", gap:8, cursor:"pointer" }}>
                  <div style={{ width:54, height:54, borderRadius:"50%", background:tool.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Icon d={tool.icon} size={22} stroke={tool.fg} />
                  </div>
                  <div>
                    <div style={{ fontSize:11, fontWeight:900, color:"#1F2937", lineHeight:1.3, marginBottom:3 }}>{tool.label}</div>
                    <div style={{ fontSize:9.5, color:"#9CA3AF", fontWeight:600, lineHeight:1.3 }}>{tool.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* spacer for bottom nav */}
          <div style={{ height:80 }} />

          {/* ── BOTTOM NAV */}
          <div style={{
            position:"sticky", bottom:0,
            background:"#fff", borderTop:"1px solid #f0f0f0",
            padding:"10px 0 18px",
            display:"flex", alignItems:"flex-end", justifyContent:"space-around",
            boxShadow:"0 -4px 16px rgba(0,0,0,0.04)",
          }}>
            {/* Home */}
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, cursor:"pointer", color:"#7C3AED" }}>
              <Icon d={HOME} size={24} stroke="#7C3AED" />
              <span style={{ fontSize:10, fontWeight:800 }}>Home</span>
            </div>
            {/* Club */}
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, cursor:"pointer", color:"#9CA3AF" }}>
              <Icon d={USERS} size={24} stroke="#9CA3AF" />
              <span style={{ fontSize:10, fontWeight:700 }}>Club</span>
            </div>
            {/* Center cart bubble */}
            <div style={{ marginTop:-22 }}>
              <div style={{
                width:58, height:58, borderRadius:"50%",
                background:"linear-gradient(135deg,#7C3AED,#A855F7)",
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:"0 6px 20px -4px rgba(124,58,237,0.55)",
                border:"4px solid #fff", cursor:"pointer",
              }}>
                <Icon d={SHOP_BAG} size={24} stroke="#fff" strokeWidth={2.5} />
              </div>
            </div>
            {/* Shop */}
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, cursor:"pointer", color:"#9CA3AF" }}>
              <Icon d={SHOP_BAG} size={24} stroke="#9CA3AF" />
              <span style={{ fontSize:10, fontWeight:700 }}>Shop</span>
            </div>
            {/* My Profile */}
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, cursor:"pointer", color:"#9CA3AF" }}>
              <Icon d={PERSON} size={24} stroke="#9CA3AF" />
              <span style={{ fontSize:10, fontWeight:700 }}>My Profile</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
