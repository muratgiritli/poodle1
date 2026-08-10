import { useEffect } from "react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import YPBottomNav from "@/components/YPBottomNav";
import { IS_YP } from "@/lib/store";

const P = "#5D3A1A";
const CREAM = "#F5F0E6";
const BORDER = "#E5DDD0";
const TEXT = "#2C2118";
const MUTED = "#8A7E72";
const LOGO_W = 240;
const BASE = IS_YP ? "" : "/yourpoodle";

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
  { label: "Mama Bul", desc: "Poodle'ınıza en uygun mamayı bulun.", href: `${BASE}/mama-bul`, Icon: BowlIcon },
  { label: "Mağaza", desc: "Mama, aksesuar ve bakım ürünlerini keşfedin.", href: `${BASE}/magaza`, Icon: StoreIcon },
  { label: "Rehber", desc: "Bakım, beslenme, eğitim ve sağlık rehberleri.", href: `${BASE}/rehber`, Icon: BookIcon },
  { label: "AI Asistan", desc: "7/24 Poodle bakım asistanınız yanınızda.", href: `${BASE}/ai-asistan`, Icon: AiIcon },
  { label: "Club", desc: "Topluluğa katılın, deneyimlerinizi paylaşın.", href: `${BASE}/club`, Icon: ClubIcon },
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
    <YPLayout activeLink={BASE || "/"} constrain={false} hideFooter={false}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        .yp-home { background: ${CREAM}; font-family: 'DM Sans', 'Helvetica Neue', Arial, sans-serif; }
        /* Keep mobile home full-bleed (no top chrome) — desktop header stays via YPLayout */
        @media (max-width: 767px) {
          .yp-mobile-hdr { display: none !important; }
        }
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
        .yp-home-hero {
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 3.55;
          min-height: 420px;
          max-height: 560px;
          overflow: hidden;
        }
        .yp-home-dest {
          background: ${CREAM};
        }
        .yp-home-dest-inner {
          display: flex;
          flex-direction: column;
        }
        .yp-home-copy-pad {
          padding: 36px 18px ${LOGO_W * 0.2}px;
        }
        .yp-home-h1 {
          font-family: 'Libre Baskerville', Georgia, serif;
          font-size: clamp(18px, 4.8vw, 24px);
          font-weight: 700;
          color: #fff;
          line-height: 1.3;
          margin: 0 0 10px;
          text-shadow: 0 2px 12px rgba(0,0,0,0.25);
          max-width: 95%;
        }
        .yp-home-sub {
          font-size: clamp(12px, 3.3vw, 14px);
          font-weight: 400;
          color: rgba(255,255,255,0.92);
          margin: 0;
          line-height: 1.45;
          max-width: 95%;
        }
        @media (min-width: 768px) {
          .yp-home-hero {
            aspect-ratio: 21 / 9;
            min-height: 420px;
            max-height: 560px;
          }
          .yp-home-copy-pad {
            padding: 48px 40px 56px;
            max-width: 720px;
          }
          .yp-home-h1 { font-size: clamp(28px, 3.2vw, 40px); max-width: 18ch; }
          .yp-home-sub { font-size: 16px; max-width: 36ch; }
          .yp-home-dest-inner {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            max-width: 1120px;
            margin: 0 auto;
            padding: 8px 24px 40px;
            gap: 0 8px;
          }
          .yp-dest-row {
            border-bottom: 1px solid ${BORDER} !important;
            border-radius: 16px;
            margin: 4px 0;
          }
        }
        @media (min-width: 1024px) {
          .yp-home-hero {
            aspect-ratio: 2.4 / 1;
            min-height: 520px;
            max-height: 640px;
          }
          .yp-home-copy-pad {
            padding: 64px 56px 72px;
            max-width: 780px;
          }
          .yp-home-dest-inner {
            grid-template-columns: repeat(5, 1fr);
            gap: 12px;
            padding: 28px 40px 56px;
          }
          .yp-dest-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            text-align: left;
            min-height: 180px !important;
            padding: 22px 18px !important;
            background: #fff;
            border: 1px solid ${BORDER} !important;
            border-radius: 18px !important;
            margin: 0 !important;
          }
          .yp-dest-row .yp-dest-chevron { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .yp-hero-img, .yp-hero-copy, .yp-dest-row { animation: none !important; }
        }
      `}</style>

      <div className="yp-home">
        <section className="yp-home-hero" aria-label="YourPoodle">
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
            className="yp-hero-copy yp-home-copy-pad"
            style={{
              position: "relative",
              zIndex: 1,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
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
            <h1 className="yp-home-h1">
              <span style={{ display: "block" }}>Toy Poodle’ınızın</span>
              <span style={{ display: "block", whiteSpace: "nowrap" }}>Dünyası Burada</span>
            </h1>
            <p className="yp-home-sub">
              <span style={{ display: "block" }}>Alışveriş, bakım, rehber, AI asistan ve</span>
              <span style={{ display: "block", whiteSpace: "nowrap" }}>Poodle topluluğu tek yerde.</span>
            </p>
          </div>
        </section>

        <section aria-label="Keşfet" className="yp-home-dest">
          <div className="yp-home-dest-inner">
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
                  transition: "background 0.2s ease, box-shadow 0.2s ease",
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
                <span className="yp-dest-chevron"><Chevron /></span>
              </a>
            ))}
          </div>
        </section>

        <YPBottomNav />
      </div>
    </YPLayout>
  );
}
