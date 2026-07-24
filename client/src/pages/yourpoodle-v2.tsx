/**
 * YourPoodle — Demo Ana Sayfa v2
 * Tek hedef: ziyaretçiyi 10 saniyede doğru kapıya sokmak.
 * Route: /yourpoodle/v2
 */
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { IS_YP } from "@/lib/store";
import {
  Utensils, Bot, BookOpen, MapPin, Users,
  ArrowRight, Star, ShoppingBag, ChevronRight,
} from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";

const BASE = IS_YP ? "" : "/yourpoodle";
const P    = "#7022C4";

/* ── The 5 Doors ────────────────────────────────────────────── */
const DOORS = [
  {
    id: "mama",
    icon: Utensils,
    emoji: "🍖",
    color: "#7022C4",
    bg: "linear-gradient(135deg,#F3E8FF 0%,#EDE9FE 100%)",
    border: "#DDD6FE",
    label: "Mama & Mağaza",
    tagline: "Poodle'ınıza özel mama bul",
    desc: "Yaş ve kiloya göre filtreleme, veteriner onaylı listeler.",
    cta: "Ürünlere Git",
    href: `${BASE}/magaza`,
    badge: "En Popüler",
  },
  {
    id: "rehber",
    icon: BookOpen,
    emoji: "📖",
    color: "#059669",
    bg: "linear-gradient(135deg,#ECFDF5 0%,#D1FAE5 100%)",
    border: "#A7F3D0",
    label: "Poodle Rehberi",
    tagline: "Bakım, beslenme, tüy & eğitim",
    desc: "50+ uzman makalesi. Yavrudan yaşlıya her aşama için.",
    cta: "Rehberi Aç",
    href: `${BASE}/rehber`,
    badge: null,
  },
  {
    id: "ai",
    icon: Bot,
    emoji: "🤖",
    color: "#0EA5E9",
    bg: "linear-gradient(135deg,#F0F9FF 0%,#E0F2FE 100%)",
    border: "#BAE6FD",
    label: "AI Asistan",
    tagline: "7/24 anında yanıt",
    desc: "Hastalık, mama, bakım — her soruya saniyeler içinde.",
    cta: "Sormaya Başla",
    href: `${BASE}/ai-asistan`,
    badge: "Ücretsiz",
  },
  {
    id: "hizmet",
    icon: MapPin,
    emoji: "📍",
    color: "#F97316",
    bg: "linear-gradient(135deg,#FFF7ED 0%,#FFEDD5 100%)",
    border: "#FED7AA",
    label: "Yakındaki Hizmetler",
    tagline: "Kuaför, klinik, pet otel",
    desc: "Konumuna göre poodle dostu işletmeleri bul.",
    cta: "Haritada Gör",
    href: `${BASE}/hizmetler`,
    badge: null,
  },
  {
    id: "topluluk",
    icon: Users,
    emoji: "🐾",
    color: "#EC4899",
    bg: "linear-gradient(135deg,#FDF2F8 0%,#FCE7F3 100%)",
    border: "#FBCFE8",
    label: "Topluluk",
    tagline: "10.000+ Poodle sahibiyle tanış",
    desc: "Sorularına gerçek sahiplerden yanıt al, deneyim paylaş.",
    cta: "Topluluğa Katıl",
    href: `${BASE}/club`,
    badge: null,
  },
];

/* ── Door Card ──────────────────────────────────────────────── */
function DoorCard({ door }: { door: typeof DOORS[0] }) {
  const [hovered, setHovered] = useState(false);
  const Icon = door.icon;

  return (
    <Link href={door.href}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: door.bg,
          border: `1.5px solid ${hovered ? door.color : door.border}`,
          borderRadius: 20,
          padding: "28px 24px",
          cursor: "pointer",
          transition: "transform 0.18s, box-shadow 0.18s, border-color 0.18s",
          transform: hovered ? "translateY(-4px)" : "none",
          boxShadow: hovered
            ? `0 16px 40px rgba(0,0,0,0.12), 0 0 0 3px ${door.color}22`
            : "0 2px 8px rgba(0,0,0,0.06)",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          height: "100%",
        }}>

        {/* Badge */}
        {door.badge && (
          <div style={{
            position: "absolute", top: 16, right: 16,
            background: door.color, color: "#fff",
            fontSize: 10, fontWeight: 800, letterSpacing: "0.05em",
            padding: "3px 10px", borderRadius: 999,
          }}>{door.badge}</div>
        )}

        {/* Icon */}
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: "#fff",
          boxShadow: `0 4px 12px ${door.color}33`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24,
        }}>
          <Icon size={26} color={door.color} strokeWidth={1.8} />
        </div>

        {/* Text */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: "#111827", marginBottom: 4 }}>
            {door.label}
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: door.color, marginBottom: 8 }}>
            {door.tagline}
          </div>
          <div style={{ fontSize: 12.5, color: "#6B7280", lineHeight: 1.6 }}>
            {door.desc}
          </div>
        </div>

        {/* CTA row */}
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          fontSize: 13, fontWeight: 700, color: door.color,
          marginTop: 4,
        }}>
          {door.cta}
          <ArrowRight size={14} style={{
            transition: "transform 0.18s",
            transform: hovered ? "translateX(4px)" : "none",
          }} />
        </div>
      </div>
    </Link>
  );
}

/* ── Mama Bul Mini Widget ─────────────────────────────────────── */
function QuickFinder({ navigate }: { navigate: (p: string) => void }) {
  const [age, setAge]     = useState("");
  const [weight, setWeight] = useState("");

  const sel: React.CSSProperties = {
    flex: 1, height: 40, border: "1.5px solid #DDD6FE", borderRadius: 10,
    padding: "0 12px", fontSize: 13, background: "#fff",
    cursor: "pointer", fontFamily: "inherit", outline: "none",
    color: "#374151", minWidth: 130,
  };

  return (
    <div style={{
      background: "#fff", borderRadius: 16, border: "1px solid #EDE9FE",
      boxShadow: "0 2px 12px rgba(112,34,196,0.08)",
      padding: "20px 24px", marginBottom: 40,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 20 }}>🐾</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>
            Poodle'ım için mama bul
          </div>
          <div style={{ fontSize: 12, color: "#9CA3AF" }}>
            Yaş ve kiloya göre kişisel öneri
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <select value={age} onChange={e => setAge(e.target.value)} style={sel}>
          <option value="">Yaş</option>
          <option value="0-1">Yavru (0–1)</option>
          <option value="1-3">Genç (1–3)</option>
          <option value="3-8">Yetişkin (3–8)</option>
          <option value="8+">Yaşlı (8+)</option>
        </select>
        <select value={weight} onChange={e => setWeight(e.target.value)} style={sel}>
          <option value="">Kilo</option>
          <option value="1-2">1–2 kg</option>
          <option value="2-4">2–4 kg</option>
          <option value="4-6">4–6 kg</option>
        </select>
        <button
          onClick={() => {
            const p = new URLSearchParams();
            if (age) p.set("yas", age);
            if (weight) p.set("kilo", weight);
            navigate(`${BASE}/mama-bul${p.toString() ? "?" + p : ""}`);
          }}
          style={{
            height: 40, padding: "0 20px", borderRadius: 10, border: "none",
            background: P, color: "#fff", fontSize: 13, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
            boxShadow: "0 4px 12px rgba(112,34,196,0.3)",
          }}>
          Mama Bul →
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */
export default function YourPoodleV2Page() {
  const [, navigate] = useLocation();

  return (
    <YPLayout activeLink={BASE || "/"} constrain={false}>

      <style>{`
        .v2-wrap       { max-width:1160px; margin:0 auto; padding:0 24px; }
        .v2-doors      { display:grid; grid-template-columns:repeat(2,1fr); gap:16px; }
        .v2-hero-inner { display:flex; flex-direction:column; gap:16px; padding:40px 24px 32px; text-align:center; align-items:center; }
        .v2-tagline    { font-size:clamp(22px,4vw,42px); font-weight:900; color:#111827; line-height:1.2; letter-spacing:-0.5px; }
        .v2-sub        { font-size:15px; color:#6B7280; max-width:480px; line-height:1.65; }

        @media(min-width:640px)  { .v2-doors { grid-template-columns:repeat(3,1fr); } }
        @media(min-width:900px)  {
          .v2-doors      { grid-template-columns:repeat(5,1fr); gap:20px; }
          .v2-hero-inner { padding:56px 40px 40px; }
          .v2-wrap       { padding:0 40px; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section style={{ background: "linear-gradient(180deg,#F8F5FF 0%,#fff 100%)", borderBottom: "1px solid #F3F4F6" }}>
        <div className="v2-hero-inner">
          <div style={{ display:"flex", alignItems:"center", gap:10, background:"#EDE9FE", borderRadius:999, padding:"6px 16px 6px 10px" }}>
            <img src="/images/poodle-hero-transparent.png" alt="" style={{ width:28, height:28, objectFit:"contain", borderRadius:"50%" }} />
            <span style={{ fontSize:13, fontWeight:700, color:P }}>Toy Poodle'ınıza özel platform</span>
          </div>

          <h1 className="v2-tagline">
            Nereye gitmek istiyorsunuz?
          </h1>

          <p className="v2-sub">
            Mama, rehber, AI asistan, yakın hizmetler veya topluluk — hepsi burada, tek tıkla.
          </p>
        </div>
      </section>

      {/* ── 5 DOORS ── */}
      <section style={{ background:"#FAFAFA", padding:"40px 0" }}>
        <div className="v2-wrap">
          <div className="v2-doors">
            {DOORS.map(d => <DoorCard key={d.id} door={d} />)}
          </div>
        </div>
      </section>

      {/* ── QUICK FINDER ── */}
      <section style={{ background:"#fff", padding:"0 0 8px" }}>
        <div className="v2-wrap" style={{ maxWidth:760 }}>
          <QuickFinder navigate={navigate} />
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section style={{ background:"#F8F5FF", borderTop:"1px solid #EDE9FE", padding:"20px 0" }}>
        <div className="v2-wrap">
          <div style={{ display:"flex", gap:32, flexWrap:"wrap", justifyContent:"center", alignItems:"center" }}>
            {[
              { e:"🚚", t:"Hızlı Teslimat" },
              { e:"🔄", t:"Kolay İade" },
              { e:"🔒", t:"Güvenli Ödeme" },
              { e:"💳", t:"12 Ay Taksit" },
            ].map(x => (
              <div key={x.t} style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:18 }}>{x.e}</span>
                <span style={{ fontSize:13, fontWeight:700, color:"#374151" }}>{x.t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </YPLayout>
  );
}
