import { useState } from "react";
import { useLocation } from "wouter";
import {
  Menu, ShoppingBag, PawPrint, BookOpen, Sparkles,
  ChevronLeft, Check, CheckCircle2,
  Scale, ShieldCheck, Gauge, Leaf, Feather, Droplets, Fish,
  TrendingDown, Bird, Home, Baby, Beef, Drumstick, Activity,
  UtensilsCrossed,
} from "lucide-react";

/* ─── Colors ───────────────────────────────────────── */
const P   = "#6200EE";
const PD  = "#3D0099";
const GB  = "#E5E7EB";

/* ─── Age options ──────────────────────────────────── */
interface AgeOpt {
  key: string;
  label: string;
  sub: string;
  border: string;
  bg: string;
  labelColor: string;
  imgFilter: string;
}

const AGE_OPTS: AgeOpt[] = [
  { key:"yavru",    label:"YAVRU",    sub:"0–12 Ay", border:"#C4B5FD", bg:"#F5F0FF", labelColor:"#6200EE", imgFilter:"brightness(1.15) saturate(0.9)" },
  { key:"yetiskin", label:"YETİŞKİN", sub:"+1 Yaş",  border:"#FCA5A5", bg:"#FFF0F0", labelColor:"#DC2626", imgFilter:"hue-rotate(10deg) saturate(1.1)" },
  { key:"yasli",    label:"YAŞLI",    sub:"+7 Yaş",  border:"#5EEAD4", bg:"#F0FDFA", labelColor:"#0D9488", imgFilter:"grayscale(0.3) sepia(0.15) brightness(0.9)" },
];

/* ─── Special needs ────────────────────────────────── */
interface NeedOpt {
  key: string;
  label: string;
  Icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}

const NEEDS_LEFT: NeedOpt[] = [
  { key:"kisirlas",   label:"Kısırlaştırılmış", Icon:Scale,          iconColor:"#6200EE", iconBg:"#EDE9FE" },
  { key:"hipo",       label:"Hipoalerjenik",     Icon:ShieldCheck,    iconColor:"#16A34A", iconBg:"#DCFCE7" },
  { key:"kilo",       label:"Kilo Kontrolü",     Icon:Gauge,          iconColor:"#DC2626", iconBg:"#FEE2E2" },
  { key:"hairskin",   label:"Hair & Skin",        Icon:Sparkles,       iconColor:"#EC4899", iconBg:"#FDF2F8" },
  { key:"kuzu",       label:"Kuzu Etli",          Icon:Activity,       iconColor:"#D97706", iconBg:"#FEF3C7" },
  { key:"tavuklu",    label:"Tavuklu",            Icon:Drumstick,      iconColor:"#EA580C", iconBg:"#FFF7ED" },
  { key:"indoor",     label:"Indoor",             Icon:Home,           iconColor:"#2563EB", iconBg:"#DBEAFE" },
  { key:"starter",    label:"Starter",            Icon:Baby,           iconColor:"#0891B2", iconBg:"#E0F2FE" },
];

const NEEDS_RIGHT: NeedOpt[] = [
  { key:"tahilsiz",   label:"Tahılsız",    Icon:Leaf,          iconColor:"#16A34A", iconBg:"#DCFCE7" },
  { key:"sensitive",  label:"Sensitive",   Icon:UtensilsCrossed, iconColor:"#2563EB", iconBg:"#DBEAFE" },
  { key:"light",      label:"Light",       Icon:Feather,       iconColor:"#CA8A04", iconBg:"#FEF9C3" },
  { key:"derma",      label:"Derma Care",  Icon:Droplets,      iconColor:"#0EA5E9", iconBg:"#E0F2FE" },
  { key:"somonlu",    label:"Somonlu",     Icon:Fish,          iconColor:"#0D9488", iconBg:"#CCFBF1" },
  { key:"biftekli",   label:"Biftekli",    Icon:Beef,          iconColor:"#DC2626", iconBg:"#FEE2E2" },
  { key:"weightloss", label:"Weight Loss", Icon:TrendingDown,  iconColor:"#EA580C", iconBg:"#FFF7ED" },
  { key:"ordekli",    label:"Ördekli",     Icon:Bird,          iconColor:"#0891B2", iconBg:"#CCFBF1" },
];

const ALL_NEEDS = [...NEEDS_LEFT, ...NEEDS_RIGHT];

/* ─── Need row item ─────────────────────────────────── */
function NeedItem({ opt, selected, onToggle }: {
  opt: NeedOpt; selected: boolean; onToggle: () => void;
}) {
  return (
    <button onClick={onToggle}
      style={{ display:"flex", alignItems:"center", gap:10,
               padding:"10px 12px", borderRadius:12,
               border:`1.5px solid ${selected ? "#3B82F6" : GB}`,
               background: selected ? "#EFF6FF" : "#fff",
               cursor:"pointer", fontFamily:"inherit",
               width:"100%", textAlign:"left",
               transition:"border-color 0.15s, background 0.15s" }}>
      {/* icon box */}
      <div style={{ width:32, height:32, borderRadius:8, flexShrink:0,
                    background:opt.iconBg,
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
        <opt.Icon size={16} color={opt.iconColor} />
      </div>
      {/* label */}
      <span style={{ flex:1, fontSize:13, fontWeight:500, color:"#1F2937",
                     lineHeight:1.2 }}>
        {opt.label}
      </span>
      {/* circle checkbox */}
      <div style={{ width:20, height:20, borderRadius:"50%", flexShrink:0,
                    border:`2px solid ${selected ? "#3B82F6" : "#D1D5DB"}`,
                    background: selected ? "#3B82F6" : "#fff",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    transition:"all 0.15s" }}>
        {selected && <Check size={11} color="#fff" strokeWidth={3} />}
      </div>
    </button>
  );
}

/* ─── MAIN PAGE ─────────────────────────────────────── */
export default function YPKuruMamaPage() {
  const [, navigate] = useLocation();
  const [selectedAge,   setSelectedAge]   = useState<string | null>("yetiskin");
  const [selectedNeeds, setSelectedNeeds] = useState<Set<string>>(new Set(["sensitive"]));

  const toggleNeed = (key: string) => {
    setSelectedNeeds(prev => {
      const n = new Set(prev);
      n.has(key) ? n.delete(key) : n.add(key);
      return n;
    });
  };

  const clearAll = () => {
    setSelectedAge(null);
    setSelectedNeeds(new Set());
  };

  const ageLabel = selectedAge
    ? AGE_OPTS.find(a => a.key === selectedAge)?.label ?? ""
    : "";

  const needLabels = ALL_NEEDS
    .filter(n => selectedNeeds.has(n.key))
    .map(n => n.label);

  const TABS = [
    { key:"magaza", label:"Mağaza",    Icon:ShoppingBag, href:"/yourpoodle/magaza"     },
    { key:"club",   label:"Club",      Icon:PawPrint,    href:"/yourpoodle/club"       },
    { key:"ai",     label:"AI Asistan",Icon:Sparkles,    href:"/yourpoodle/ai-asistan" },
    { key:"rehber", label:"Rehber",    Icon:BookOpen,    href:"/yourpoodle/rehber"     },
  ];

  return (
    <div style={{ maxWidth:480, margin:"0 auto", background:"#F9FAFB",
                  minHeight:"100dvh", display:"flex", flexDirection:"column",
                  fontFamily:"Inter, system-ui, -apple-system, sans-serif",
                  boxShadow:"0 0 40px rgba(0,0,0,0.08)" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .km-age-card { transition: transform 0.1s; }
        .km-age-card:hover { transform: translateY(-2px); }
        .km-age-card:active { transform: scale(0.97); }
        .km-btn-main:hover { background: ${PD} !important; }
        .km-btn-main:active { transform: scale(0.98); }
      `}</style>

      {/* ══ HEADER ══════════════════════════════════════ */}
      <header style={{ position:"sticky", top:0, zIndex:40, background:"#fff",
                       borderBottom:`1px solid ${GB}` }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                      height:56, padding:"0 16px" }}>
          {/* Left */}
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <button aria-label="Menü"
              style={{ width:36, height:36, borderRadius:8, border:"none", background:"none",
                       display:"flex", alignItems:"center", justifyContent:"center",
                       cursor:"pointer", color:"#374151", flexShrink:0 }}>
              <Menu size={22} />
            </button>
            <button onClick={() => navigate("/yourpoodle")}
              style={{ display:"flex", alignItems:"center", gap:8,
                       background:"none", border:"none", cursor:"pointer", padding:0 }}>
              <img src="/images/yp-poodle-hero.png" alt="YourPoodle"
                style={{ width:32, height:32, borderRadius:"50%", objectFit:"cover",
                         objectPosition:"center top" }} />
              <span style={{ fontSize:16, fontWeight:700, color:P }}>YourPoodle</span>
            </button>
          </div>
          {/* Right */}
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button style={{ background:"none", border:"none", cursor:"pointer",
                             fontSize:13, color:"#374151", fontWeight:500 }}>
              Giriş Yap
            </button>
            <button style={{ background:P, color:"#fff", border:"none", borderRadius:999,
                             padding:"7px 16px", fontSize:13, fontWeight:600, cursor:"pointer" }}
              className="km-btn-main">
              Üye Ol
            </button>
          </div>
        </div>

        {/* Tab nav */}
        <nav style={{ display:"flex", borderBottom:`1px solid ${GB}`, background:"#fff" }}>
          {TABS.map(tab => {
            const active = tab.key === "magaza";
            return (
              <button key={tab.key} onClick={() => navigate(tab.href)}
                style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center",
                         gap:4, padding:"10px 0", background:"none", border:"none",
                         borderBottom: active ? `2px solid ${P}` : "2px solid transparent",
                         cursor:"pointer", fontFamily:"inherit",
                         color: active ? P : "#9CA3AF",
                         fontWeight: active ? 600 : 500, transition:"color 0.15s" }}>
                <tab.Icon size={20} />
                <span style={{ fontSize:11 }}>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </header>

      {/* ══ SCROLLABLE CONTENT ══════════════════════════ */}
      <div style={{ flex:1, overflowY:"auto", paddingBottom:24 }}>

        {/* Breadcrumb */}
        <div style={{ display:"flex", alignItems:"center", gap:6,
                      padding:"12px 16px 0", background:"#fff" }}>
          <button onClick={() => navigate("/yourpoodle/magaza")}
            style={{ display:"flex", alignItems:"center", gap:4,
                     background:"none", border:"none", cursor:"pointer",
                     color:"#6B7280", fontSize:13, fontFamily:"inherit", padding:0 }}>
            <ChevronLeft size={16} />
            <span>Mağaza</span>
          </button>
          <span style={{ color:"#9CA3AF", fontSize:13 }}>/</span>
          <span style={{ color:"#111827", fontSize:13, fontWeight:500 }}>Kuru Mama</span>
        </div>

        {/* Hero */}
        <div style={{ display:"flex", alignItems:"center", gap:14,
                      padding:"16px 16px 14px", background:"#fff",
                      borderBottom:`1px solid ${GB}` }}>
          <div style={{ width:56, height:56, borderRadius:14, flexShrink:0,
                        background:"#EDE9FE",
                        display:"flex", alignItems:"center", justifyContent:"center" }}>
            <UtensilsCrossed size={28} color={P} />
          </div>
          <div>
            <h1 style={{ fontSize:17, fontWeight:700, color:"#111827",
                         lineHeight:1.25, marginBottom:4 }}>
              Poodle'ınıza Uygun Mamayı Bulun
            </h1>
            <p style={{ fontSize:13, color:"#6B7280", lineHeight:1.45 }}>
              Yaşını ve özel ihtiyacını seçin, uygun mamaları hemen listeleyelim.
            </p>
          </div>
        </div>

        {/* ── Section 1: Yaşını Seçin ─────────────────── */}
        <div style={{ padding:"20px 16px 0", background:"#fff", marginBottom:8 }}>
          <h2 style={{ fontSize:15, fontWeight:700, color:"#111827", marginBottom:14 }}>
            1. Yaşını Seçin
          </h2>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10,
                        paddingBottom:20 }}>
            {AGE_OPTS.map(opt => {
              const sel = selectedAge === opt.key;
              return (
                <button key={opt.key}
                  className="km-age-card"
                  onClick={() => setSelectedAge(opt.key)}
                  style={{ display:"flex", flexDirection:"column", alignItems:"center",
                           padding:"12px 6px 10px", borderRadius:16,
                           border:`2px solid ${sel ? opt.border : "#E5E7EB"}`,
                           background: sel ? opt.bg : "#FAFAFA",
                           cursor:"pointer", fontFamily:"inherit",
                           position:"relative", overflow:"hidden",
                           transition:"border-color 0.15s, background 0.15s" }}>
                  {/* Selected checkmark badge */}
                  {sel && (
                    <div style={{ position:"absolute", top:6, right:6,
                                  width:20, height:20, borderRadius:"50%",
                                  background: opt.key==="yetiskin" ? "#DC2626" : opt.labelColor,
                                  display:"flex", alignItems:"center", justifyContent:"center",
                                  zIndex:2 }}>
                      <Check size={11} color="#fff" strokeWidth={3} />
                    </div>
                  )}

                  {/* Dog image */}
                  <div style={{ width:"100%", height:90, overflow:"hidden",
                                borderRadius:10, marginBottom:8,
                                background:"#F3F4F6" }}>
                    <img src="/images/yp-poodle-hero.png" alt={opt.label}
                      style={{ width:"100%", height:"100%", objectFit:"cover",
                               objectPosition:"center top",
                               filter:opt.imgFilter }} />
                  </div>

                  {/* Label */}
                  <span style={{ fontSize:12, fontWeight:800, color:opt.labelColor,
                                 letterSpacing:"0.5px", lineHeight:1.2 }}>
                    {opt.label}
                  </span>
                  <span style={{ fontSize:11, color:"#6B7280", marginTop:2 }}>
                    {opt.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Section 2: Özel İhtiyacını Seçin ─────────── */}
        <div style={{ padding:"16px 16px 0", background:"#fff" }}>
          <h2 style={{ fontSize:15, fontWeight:700, color:"#111827", marginBottom:4 }}>
            2. Özel İhtiyacını Seçin
          </h2>
          <p style={{ fontSize:12, color:"#6B7280", marginBottom:14 }}>
            Birden fazla seçim yapabilirsiniz.
          </p>

          {/* 2-column grid */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8,
                        paddingBottom:20 }}>
            {/* Interleave left + right columns row by row */}
            {NEEDS_LEFT.map((left, i) => {
              const right = NEEDS_RIGHT[i];
              return [
                <NeedItem key={left.key} opt={left}
                  selected={selectedNeeds.has(left.key)}
                  onToggle={() => toggleNeed(left.key)} />,
                right ? (
                  <NeedItem key={right.key} opt={right}
                    selected={selectedNeeds.has(right.key)}
                    onToggle={() => toggleNeed(right.key)} />
                ) : <div key="empty" />,
              ];
            })}
          </div>
        </div>

        {/* ── Selection summary + CTA ──────────────────── */}
        <div style={{ padding:"0 16px 16px", background:"#fff" }}>
          {/* Summary row */}
          {(selectedAge || selectedNeeds.size > 0) && (
            <div style={{ display:"flex", alignItems:"center", gap:8,
                          marginBottom:14, padding:"10px 0 0" }}>
              <CheckCircle2 size={18} color="#2563EB" style={{ flexShrink:0 }} />
              <span style={{ fontSize:13, color:"#374151" }}>
                Seçiminiz:{" "}
                {selectedAge && (
                  <span style={{ fontWeight:600,
                                 color: AGE_OPTS.find(a=>a.key===selectedAge)?.labelColor ?? "#111827" }}>
                    {ageLabel}
                  </span>
                )}
                {selectedAge && needLabels.length > 0 && (
                  <span style={{ color:"#374151" }}> + </span>
                )}
                {needLabels.map((l, i) => (
                  <span key={l}>
                    <span style={{ fontWeight:600, color:"#2563EB" }}>{l}</span>
                    {i < needLabels.length - 1 && (
                      <span style={{ color:"#374151" }}> + </span>
                    )}
                  </span>
                ))}
              </span>
            </div>
          )}

          {/* CTA Button */}
          <button
            className="km-btn-main"
            onClick={() => navigate("/yourpoodle/mama-bul")}
            style={{ width:"100%", background:P, color:"#fff",
                     border:"none", borderRadius:14, padding:"15px 0",
                     fontSize:15, fontWeight:700, cursor:"pointer",
                     fontFamily:"inherit", transition:"background 0.15s",
                     marginBottom:12 }}>
            Uygun Mamaları Göster
          </button>

          {/* Clear link */}
          <div style={{ textAlign:"center" }}>
            <button onClick={clearAll}
              style={{ background:"none", border:"none", cursor:"pointer",
                       fontSize:13, color:"#6B7280", fontFamily:"inherit",
                       padding:"4px 0", textDecoration:"underline" }}>
              Seçimleri Temizle
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
