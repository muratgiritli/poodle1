import { useEffect } from "react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { IS_YP } from "@/lib/store";

const P = "#5D3A1A";
const ACCENT = "#A67C52";
const CREAM = "#FAF6F0";
const BORDER = "#E8DFD2";
const TEXT = "#2C2118";
const MUTED = "#8A7E72";
const LOGO_W = 220;
const BASE = IS_YP ? "" : "/yourpoodle";

type IconProps = { color?: string };

const BowlIcon = ({ color = P }: IconProps) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12h18v1.5a6.5 6.5 0 0 1-6.5 6.5h-5A6.5 6.5 0 0 1 3 13.5V12z" />
    <path d="M7.5 12V9.5a4.5 4.5 0 0 1 9 0V12" />
  </svg>
);

const BookIcon = ({ color = P }: IconProps) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h6a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5H4z" />
    <path d="M20 4h-6a3 3 0 0 0-3 3v13a2.5 2.5 0 0 1 2.5-2.5H20z" />
  </svg>
);

const AiIcon = ({ color = P }: IconProps) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="11" r="3.2" />
    <path d="M6.5 18c1.2-2.2 3.1-3.3 5.5-3.3s4.3 1.1 5.5 3.3" />
    <path d="M12 3.5l.55 1.7h1.8l-1.45 1.05.55 1.7L12 6.9l-1.45 1.05.55-1.7-1.45-1.05h1.8z" />
    <path d="M19 7.5l.35 1.05h1.1l-.9.65.35 1.05L19 9.6l-.9.65.35-1.05-.9-.65h1.1z" />
  </svg>
);

const ClubIcon = ({ color = P }: IconProps) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="8" r="3" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M3.5 19c.8-3 2.8-4.5 5.5-4.5s4.7 1.5 5.5 4.5" />
    <path d="M14.5 19c.4-1.8 1.5-2.8 3.2-2.8 1.4 0 2.5.8 3.1 2.2" />
  </svg>
);

const StoreIcon = ({ color = P }: IconProps) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 9h16l-1 11H5L4 9z" />
    <path d="M3 9 5.5 4h13L21 9" />
    <path d="M10 13h4" />
  </svg>
);

/** Açık yeşil / mavi / lavanta / turkuaz + 1 açık kırmızı */
const DESTINATIONS = [
  { label: "Mama Bul", desc: "Kişisel mama önerisi", href: `${BASE}/mama-bul`, Icon: BowlIcon, tint: "#E0F7F6", ink: "#1F9A8F", ring: "#B0E6E3" },
  { label: "Mağaza", desc: "Mama & aksesuar", href: `${BASE}/magaza`, Icon: StoreIcon, tint: "#FFF0E0", ink: "#D4782A", ring: "#F5D0A8" },
  { label: "Rehber", desc: "Bakım & eğitim yazıları", href: `${BASE}/rehber`, Icon: BookIcon, tint: "#E3F5EE", ink: "#2F8A6E", ring: "#B8E4D4" },
  { label: "AI Asistan", desc: "7/24 bakım soruları", href: `${BASE}/ai-asistan`, Icon: AiIcon, tint: "#ECEAF8", ink: "#6B5FA8", ring: "#CDC8EB" },
  { label: "Club", desc: "Paylaşım & topluluk", href: `${BASE}/club`, Icon: ClubIcon, tint: "#FCE8EB", ink: "#C45B68", ring: "#F0C4CB" },
];

const NEXT_STEPS = [
  { label: "Mama miktarı hesapla", desc: "Yaş ve kiloya göre günlük mama", href: `${BASE}/araclar/mama-hesaplama` },
  { label: "Tıraş takvimi kur", desc: "Sonraki bakım gününü unutma", href: `${BASE}/araclar/tiras-takvimi` },
  { label: "Bakım rehberine bak", desc: "Eğitim, sağlık ve tüy bakımı", href: `${BASE}/rehber` },
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
    <YPLayout activeLink={BASE || "/"} constrain={false} showMobileFooter>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        .yp-home { background: ${CREAM}; font-family: 'DM Sans', 'Helvetica Neue', Arial, sans-serif; }
        /* Home: bottom nav spacer is enough — don't stack layout padding */
        @media (max-width: 767px) {
          .yp-mobile-hdr { display: none !important; }
          .yp-page-body { padding-bottom: 0 !important; }
        }
        @keyframes ypHeroFade {
          from { opacity: 0; transform: scale(1.04); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes ypCopyUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ypRowIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .yp-hero-img { animation: ypHeroFade 1.1s ease-out both; }
        .yp-hero-copy { animation: ypCopyUp 0.7s ease-out 0.2s both; }
        .yp-dest-card { animation: ypRowIn 0.45s ease-out both; }
        .yp-dest-card:hover {
          box-shadow: 0 8px 22px rgba(93, 58, 26, 0.10);
          transform: translateY(-2px);
          filter: saturate(1.06) brightness(0.995);
        }
        .yp-dest-card:active { transform: translateY(0); }
        .yp-dest-icon {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }
        .yp-dest-card:hover .yp-dest-icon { transform: scale(1.04); }

        .yp-home-next {
          padding: 8px 14px 28px;
          max-width: 1120px;
          margin: 0 auto;
        }
        .yp-home-next-panel {
          display: grid;
          gap: 18px;
          padding: 20px 18px;
          border-radius: 20px;
          background:
            linear-gradient(135deg, rgba(93,58,26,0.06) 0%, rgba(245,240,230,0.95) 45%, #fff 100%);
          border: 1px solid #E8DFD0;
        }
        .yp-home-next-cta {
          display: flex;
          flex-direction: column;
          gap: 10px;
          justify-content: center;
        }
        .yp-home-next-kicker {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: ${P};
          margin: 0;
        }
        .yp-home-next-title {
          font-family: 'Libre Baskerville', Georgia, serif;
          font-size: 22px;
          font-weight: 700;
          color: ${TEXT};
          line-height: 1.25;
          margin: 0;
        }
        .yp-home-next-text {
          font-size: 14px;
          color: ${MUTED};
          line-height: 1.5;
          margin: 0;
          max-width: 38ch;
        }
        .yp-home-next-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          align-self: flex-start;
          margin-top: 4px;
          height: 44px;
          padding: 0 18px;
          border-radius: 12px;
          background: ${P};
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .yp-home-next-btn:hover { background: #4A2E14; transform: translateY(-1px); }
        .yp-home-next-list {
          display: grid;
          gap: 8px;
        }
        .yp-home-next-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 14px;
          background: rgba(255,255,255,0.88);
          border: 1px solid #EDE6DC;
          text-decoration: none;
          color: inherit;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
        }
        .yp-home-next-item:hover {
          border-color: #D8CBB8;
          box-shadow: 0 6px 16px rgba(93,58,26,0.08);
          transform: translateY(-1px);
        }
        .yp-home-next-item strong {
          display: block;
          font-size: 14px;
          font-weight: 700;
          color: ${TEXT};
          margin-bottom: 2px;
        }
        .yp-home-next-item span {
          font-size: 12.5px;
          color: ${MUTED};
          line-height: 1.35;
        }
        .yp-home-next-arrow {
          flex-shrink: 0;
          font-size: 18px;
          color: ${P};
          opacity: 0.7;
        }

        .yp-home-hero {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3.2;
          min-height: 280px;
          max-height: 420px;
          overflow: hidden;
        }
        .yp-home-dest { background: ${CREAM}; }
        .yp-home-dest-inner {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          padding: 12px 14px 16px;
        }
        .yp-home-copy-pad {
          padding: 28px 16px 22px;
        }
        .yp-home-h1 {
          font-family: 'Libre Baskerville', Georgia, serif;
          font-size: clamp(18px, 5vw, 24px);
          font-weight: 700;
          color: #fff;
          line-height: 1.28;
          margin: 0 0 8px;
          text-shadow: 0 2px 12px rgba(0,0,0,0.25);
          max-width: 95%;
        }
        .yp-home-h1 span { display: inline; white-space: normal; }
        .yp-home-sub {
          font-size: clamp(12px, 3.3vw, 14px);
          font-weight: 400;
          color: rgba(255,255,255,0.92);
          margin: 0;
          line-height: 1.45;
          max-width: 95%;
        }
        .yp-home-sub span { display: inline; white-space: normal; }
        .yp-dest-desc {
          display: block;
          font-size: 11.5px;
          font-weight: 500;
          color: ${MUTED};
          line-height: 1.35;
          margin-top: 2px;
        }
        .yp-dest-card:last-child {
          grid-column: 1 / -1;
          flex-direction: row !important;
          align-items: center !important;
          min-height: 72px !important;
          padding: 14px 16px !important;
        }

        @media (min-width: 480px) {
          .yp-home-hero {
            aspect-ratio: 16 / 11;
            min-height: 320px;
            max-height: 440px;
          }
        }

        @media (min-width: 768px) {
          .yp-home-hero {
            aspect-ratio: 21 / 9;
            min-height: 380px;
            max-height: 520px;
          }
          .yp-home-copy-pad {
            padding: 48px 40px 48px;
            max-width: 720px;
          }
          .yp-home-h1 { font-size: clamp(28px, 3.2vw, 40px); max-width: 18ch; }
          .yp-home-h1 span { display: block; }
          .yp-home-sub { font-size: 16px; max-width: 36ch; }
          .yp-home-sub span { display: block; }
          .yp-home-dest-inner {
            grid-template-columns: repeat(2, 1fr);
            max-width: 1120px;
            margin: 0 auto;
            padding: 20px 24px 12px;
            gap: 12px;
          }
          .yp-dest-desc { font-size: 12.5px; }
          .yp-home-next {
            padding: 8px 24px 40px;
          }
          .yp-home-next-panel {
            grid-template-columns: 1.1fr 1fr;
            gap: 28px;
            padding: 28px 32px;
            align-items: center;
          }
          .yp-home-next-title { font-size: 26px; }
          .yp-home-next-text { font-size: 15px; }
        }

        @media (min-width: 1024px) {
          .yp-home-hero {
            aspect-ratio: 2.4 / 1;
            min-height: 480px;
            max-height: 600px;
          }
          .yp-home-copy-pad {
            padding: 64px 56px 64px;
            max-width: 780px;
          }
          .yp-home-dest-inner {
            grid-template-columns: repeat(5, 1fr);
            gap: 14px;
            padding: 28px 40px 16px;
          }
          .yp-home-next {
            padding: 12px 40px 48px;
          }
          .yp-home-next-panel {
            padding: 32px 36px;
          }
          .yp-dest-card {
            min-height: 188px !important;
          }
          .yp-dest-card:last-child {
            grid-column: auto;
            flex-direction: column !important;
            align-items: flex-start !important;
            min-height: 188px !important;
            padding: 16px 14px !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .yp-hero-img, .yp-hero-copy, .yp-dest-card { animation: none !important; }
          .yp-dest-card:hover { transform: none; }
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
                "linear-gradient(160deg, rgba(28,20,14,0.18) 0%, rgba(28,20,14,0.22) 40%, rgba(28,20,14,0.62) 100%)",
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
              height={76}
              style={{
                width: LOGO_W,
                height: "auto",
                marginBottom: 12,
                display: "block",
                filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.30))",
              }}
            />
            <h1 className="yp-home-h1">
              <span>Toy Poodle’ınızın </span>
              <span>Dünyası Burada</span>
            </h1>
            <p className="yp-home-sub">
              <span>Alışveriş, bakım, rehber, AI asistan ve </span>
              <span>Poodle topluluğu tek yerde.</span>
            </p>
          </div>
        </section>

        <section aria-label="Keşfet" className="yp-home-dest">
          <div className="yp-home-dest-inner">
            {DESTINATIONS.map((d, i) => (
              <a
                key={d.label}
                href={d.href}
                className="yp-dest-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "16px 14px",
                  textDecoration: "none",
                  color: TEXT,
                  background: `linear-gradient(165deg, ${d.tint} 0%, #FFFcf8 72%)`,
                  border: `1px solid ${d.ring}`,
                  borderRadius: 16,
                  minHeight: 112,
                  animationDelay: `${0.28 + i * 0.06}s`,
                  transition: "background 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease, filter 0.2s ease",
                }}
              >
                <div
                  className="yp-dest-icon"
                  style={{
                    background: "#FFFcf8",
                    border: `1px solid ${d.ring}`,
                    boxShadow: `0 2px 10px ${d.ring}88`,
                  }}
                >
                  <d.Icon color={d.ink} />
                </div>
                <div style={{ flex: 1, minWidth: 0, width: "100%" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, letterSpacing: "-0.01em" }}>
                    {d.label}
                  </div>
                  <div className="yp-dest-desc">{d.desc}</div>
                </div>
                <span className="yp-dest-chevron" aria-hidden />
              </a>
            ))}
          </div>
        </section>

        <section aria-label="Sonraki adım" className="yp-home-next">
          <div className="yp-home-next-panel">
            <div className="yp-home-next-cta">
              <p className="yp-home-next-kicker">Nereden başlamalı?</p>
              <h2 className="yp-home-next-title">Poodle’ınıza özel mama önerisi alın</h2>
              <p className="yp-home-next-text">
                Yaş, kilo ve yaşam tarzına göre birkaç soruda doğru mama yönlendirmesi.
              </p>
              <a className="yp-home-next-btn" href={`${BASE}/mama-bul`}>
                Mama Bul’a Git
              </a>
            </div>
            <div className="yp-home-next-list">
              {NEXT_STEPS.map((step) => (
                <a key={step.href} href={step.href} className="yp-home-next-item">
                  <div>
                    <strong>{step.label}</strong>
                    <span>{step.desc}</span>
                  </div>
                  <span className="yp-home-next-arrow" aria-hidden>→</span>
                </a>
              ))}
            </div>
          </div>
        </section>

      </div>
    </YPLayout>
  );
}
