import { Link } from "wouter";
import YPLayout from "@/components/yourpoodle/YPLayout";

const doors = [
  {
    href: "/magaza",
    emoji: "🍖",
    label: "Mama",
    sub: "Poodle'ına özel mama bul",
    bg: "#F3F0FF",
    border: "#C4B5FD",
    accent: "#7C3AED",
  },
  {
    href: "/rehber",
    emoji: "📖",
    label: "Rehber",
    sub: "Bakım, sağlık, eğitim",
    bg: "#F0FDF4",
    border: "#86EFAC",
    accent: "#16A34A",
  },
  {
    href: "/mama-bul",
    emoji: "🤖",
    label: "AI Asistan",
    sub: "Anında cevap al",
    bg: "#EFF6FF",
    border: "#93C5FD",
    accent: "#2563EB",
  },
  {
    href: "/hizmetler",
    emoji: "📍",
    label: "Hizmet",
    sub: "Yakındaki kuaför & klinik",
    bg: "#FFF7ED",
    border: "#FCD34D",
    accent: "#D97706",
  },
];

export default function YourPoodleV3() {
  return (
    <YPLayout>
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 16px",
          background: "#FAFAFA",
        }}
      >
        {/* Headline */}
        <p style={{ fontSize: 13, color: "#9333EA", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>
          Toy Poodle platformu
        </p>
        <h1
          style={{
            fontSize: "clamp(28px, 5vw, 52px)",
            fontWeight: 900,
            color: "#111",
            textAlign: "center",
            lineHeight: 1.15,
            marginBottom: 8,
          }}
        >
          Poodle'ın için ne lazım?
        </h1>
        <p style={{ fontSize: 16, color: "#6B7280", textAlign: "center", marginBottom: 48, maxWidth: 380 }}>
          Bir kez tıkla, hemen başla.
        </p>

        {/* 4 Doors */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 16,
            width: "100%",
            maxWidth: 720,
          }}
        >
          {doors.map((d) => (
            <Link
              key={d.label}
              href={d.href}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "28px 24px",
                background: d.bg,
                border: `2px solid ${d.border}`,
                borderRadius: 20,
                textDecoration: "none",
                cursor: "pointer",
                transition: "transform 0.12s, box-shadow 0.12s",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
              }}
            >
              <span style={{ fontSize: 40, marginBottom: 16, lineHeight: 1 }}>{d.emoji}</span>
              <span style={{ fontSize: 22, fontWeight: 800, color: d.accent, marginBottom: 6 }}>
                {d.label}
              </span>
              <span style={{ fontSize: 14, color: "#374151", lineHeight: 1.4 }}>{d.sub}</span>
              <span
                style={{
                  marginTop: 20,
                  fontSize: 13,
                  fontWeight: 700,
                  color: d.accent,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                Gir →
              </span>
            </Link>
          ))}
        </div>

        {/* Bottom micro-trust */}
        <p style={{ marginTop: 40, fontSize: 13, color: "#9CA3AF" }}>
          10.000+ Poodle ailesi · Ücretsiz · Türkiye'nin ilk Poodle platformu
        </p>
      </div>
    </YPLayout>
  );
}
