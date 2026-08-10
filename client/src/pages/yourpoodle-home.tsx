import { useEffect } from "react";
import YPBottomNav from "@/components/YPBottomNav";

/* Mockup tokens — warm editorial, not Replit purple */
const P = "#5D3A1A";
const CREAM = "#F5F0E6";
const BORDER = "#E5DDD0";
const TEXT = "#2C2118";
const MUTED = "#8A7E72";
const LOGO_W = 240;

const Chevron = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const BowlIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={P} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12h18v1.5a6.5 6.5 0 0 1-6.5 6.5h-5A6.5 6.5 0 0 1 3 13.5V12z" />
    <path d="M7.5 12V9.5a4.5 4.5 0 0 1 9 0V12" />
  </svg>
);

const BookIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={P} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h6a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5H4z" />
    <path d="M20 4h-6a3 3 0 0 0-3 3v13a2.5 2.5 0 0 1 2.5-2.5H20z" />
  </svg>
);

const AiIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={P} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="11" r="3.2" />
    <path d="M6.5 18c1.2-2.2 3.1-3.3 5.5-3.3s4.3 1.1 5.5 3.3" />
    <path d="M12 3.5l.55 1.7h1.8l-1.45 1.05.55 1.7L12 6.9l-1.45 1.05.55-1.7-1.45-1.05h1.8z" />
    <path d="M19 7.5l.35 1.05h1.1l-.9.65.35 1.05L19 9.6l-.9.65.35-1.05-.9-.65h1.1z" />
  </svg>
);

const ClubIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={P} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="8" r="3" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M3.5 19c.8-3 2.8-4.5 5.5-4.5s4.7 1.5 5.5 4.5" />
    <path d="M14.5 19c.4-1.8 1.5-2.8 3.2-2.8 1.4 0 2.5.8 3.1 2.2" />
  </svg>
);

const StoreIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={P} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 9h16l-1 11H5L4 9z" />
    <path d="M3 9 5.5 4h13L21 9" />
    <path d="M10 13h4" />
  </svg>
);

const DESTINATIONS = [
  { label: "Mama Bul", desc: "Poodle'ınıza en uygun mamayı bulun.", href: "/yourpoodle/mama-bul", Icon: BowlIcon },
  { label: "Mağaza", desc: "Mama, aksesuar ve bakım ürünlerini keşfedin.", href: "/yourpoodle/magaza", Icon: StoreIcon },
  { label: "Rehber", desc: "Bakım, beslenme, eğitim ve sağlık rehberleri.", href: "/yourpoodle/rehber", Icon: BookIcon },
  { label: "AI Asistan", desc: "7/24 Poodle bakım asistanınız yanınızda.", href: "/yourpoodle/ai-asistan", Icon: AiIcon },
  { label: "Club", desc: "Topluluğa katılın, deneyimlerinizi paylaşın.", href: "/yourpoodle/club", Icon: ClubIcon },
];

export default function YourPoodleHomePage() {
  useEffect(() => {
    document.title = "YourPoodle | Toy Poodle Bakım, Mama, Eğitim ve Topluluk";
    const desc = "Toy Poodle sahipleri için mama önerileri, bakım rehberleri, AI asistan ve Poodle topluluğu.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, []);

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: CREAM,
        display: "flex",
        justifyContent: "center",
        fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
        html { scroll-behavior: smooth; }
        @keyframes ypHeroFade {
          from { opacity: 0; transform: scale(1.04); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes ypCopyUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ypRowIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .yp-hero-img { animation: ypHeroFade 1.1s ease-out both; }
        .yp-hero-copy { animation: ypCopyUp 0.7s ease-out 0.25s both; }
        .yp-dest-row { animation: ypRowIn 0.45s ease-out both; }
        .yp-dest-row:hover { background: rgba(255,255,255,0.55); }
        @media (prefers-reduced-motion: reduce) {
          .yp-hero-img, .yp-hero-copy, .yp-dest-row { animation: none !important; }
        }
      `}</style>

      <div
        style={{
          width: "100%",
          maxWidth: 430,
          background: "#fff",
          minHeight: "100dvh",
          position: "relative",
          boxShadow: "0 0 40px rgba(0,0,0,0.06)",
        }}
      >
        {/* HERO — full-bleed photo + left overlay, CTAs in a row */}
        <section
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "3 / 3.55",
            minHeight: 420,
            maxHeight: 560,
            overflow: "hidden",
          }}
        >
          <img
            className="yp-hero-img"
            src="/images/yp-home-hero.jpg"
            alt="Toy Poodle"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "58% 28%",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(105deg, rgba(28,20,14,0.55) 0%, rgba(28,20,14,0.28) 42%, rgba(28,20,14,0.08) 68%, rgba(28,20,14,0.18) 100%)",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              // Resim üzerindeki tüm yazılar altta, tamamen görünür
              padding: `36px 18px ${LOGO_W * 0.2}px`,
              maxWidth: "100%",
            }}
            className="yp-hero-copy"
          >
            <img
              src="/images/brand/logo-white.png?v=2"
              alt="YourPoodle"
              width={LOGO_W}
              height={83}
              style={{
                width: LOGO_W,
                height: "auto",
                marginBottom: 14,
                display: "block",
                filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.30))",
              }}
            />

            <h1
              style={{
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: "clamp(18px, 4.8vw, 24px)",
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.3,
                margin: "0 0 10px",
                textShadow: "0 2px 12px rgba(0,0,0,0.25)",
                maxWidth: "95%",
              }}
            >
              <span style={{ display: "block" }}>Toy Poodle’ınızın</span>
              <span style={{ display: "block", whiteSpace: "nowrap" }}>Dünyası Burada</span>
            </h1>

            <p
              style={{
                fontSize: "clamp(12px, 3.3vw, 14px)",
                fontWeight: 400,
                color: "rgba(255,255,255,0.92)",
                margin: 0,
                lineHeight: 1.45,
                maxWidth: "95%",
              }}
            >
              <span style={{ display: "block" }}>Alışveriş, bakım, rehber, AI asistan ve</span>
              <span style={{ display: "block", whiteSpace: "nowrap" }}>Poodle topluluğu tek yerde.</span>
            </p>
          </div>
        </section>

        {/* Destination list — cream, hairline dividers */}
        <section aria-label="Keşfet" style={{ background: CREAM }}>
          {DESTINATIONS.map((d, i) => (
            <a
              key={d.label}
              href={d.href}
              className="yp-dest-row"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "18px 20px",
                textDecoration: "none",
                color: TEXT,
                borderBottom: i < DESTINATIONS.length - 1 ? `1px solid ${BORDER}` : "none",
                minHeight: 76,
                animationDelay: `${0.35 + i * 0.07}s`,
                transition: "background 0.2s ease",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "#fff",
                  border: `1px solid ${BORDER}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <d.Icon />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3, color: TEXT }}>{d.label}</div>
                <div style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.4 }}>{d.desc}</div>
              </div>
              <Chevron />
            </a>
          ))}
        </section>

        <YPBottomNav />
      </div>
    </div>
  );
}
