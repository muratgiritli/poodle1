import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Bot,
  BookOpen,
  Bone,
  Calculator,
  Check,
  HeartPulse,
  PackageCheck,
  PawPrint,
  Scissors,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  Utensils,
} from "lucide-react";
import YPHomeProducts from "@/components/yourpoodle/YPHomeProducts";
import YPRecentlyViewed from "@/components/yourpoodle/YPRecentlyViewed";
import { IS_YP } from "@/lib/store";

const BASE = IS_YP ? "" : "/yourpoodle";

const PRIMARY_LINKS = [
  {
    label: "Mama Bul",
    desc: "Yaşına, kilosuna ve yaşamına uygun mama önerisi",
    href: `${BASE}/mama-bul`,
    Icon: Utensils,
    tone: "teal",
  },
  {
    label: "Mağaza",
    desc: "Poodle için seçilmiş mama, bakım ve aksesuarlar",
    href: `${BASE}/magaza`,
    Icon: ShoppingBag,
    tone: "amber",
  },
  {
    label: "Rehber",
    desc: "Bakım, eğitim ve sağlığa dair uzman içerikleri",
    href: `${BASE}/rehber`,
    Icon: BookOpen,
    tone: "sage",
  },
  {
    label: "AI Asistan",
    desc: "Poodle bakım soruların için 7/24 hızlı destek",
    href: `${BASE}/ai-asistan`,
    Icon: Bot,
    tone: "lilac",
  },
] as const;

const CATEGORIES = [
  { label: "Kuru Mama", desc: "Yaşa ve ihtiyaca uygun", href: `${BASE}/kuru-mama`, Icon: Bone, countKey: "kuru-mama" },
  { label: "Yaş Mama", desc: "Lezzetli ve dengeli", href: `${BASE}/kategori/yas-mama`, Icon: Utensils, countKey: "yas-mama" },
  { label: "Oyuncaklar", desc: "Zihin ve oyun zamanı", href: `${BASE}/kategori/oyuncaklar`, Icon: Sparkles, countKey: "oyuncak" },
  { label: "Bakım & Sağlık", desc: "Tüy, göz ve ağız bakımı", href: `${BASE}/kategori/bakim-saglik`, Icon: HeartPulse, countKey: "bakim-saglik" },
  { label: "Taşıma", desc: "Güvenli ve konforlu", href: `${BASE}/kategori/tasima-cantalari`, Icon: PackageCheck, countKey: "tasima-kulube" },
  { label: "Tasmalar", desc: "Günlük yürüyüş için", href: `${BASE}/kategori/bel-boyun-tasmalari`, Icon: PawPrint, countKey: "bel-boyun-tasma" },
] as const;

const TOOLS = [
  {
    eyebrow: "Beslenme",
    title: "Günlük mama miktarını hesapla",
    desc: "Yaş ve kiloya göre günlük porsiyon aralığını birkaç saniyede öğren.",
    href: `${BASE}/araclar/mama-hesaplama`,
    cta: "Hesaplamaya başla",
    Icon: Calculator,
  },
  {
    eyebrow: "Bakım",
    title: "Tıraş takvimini planla",
    desc: "Poodle’ının bakım rutinini oluştur, yaklaşan tıraş günlerini takip et.",
    href: `${BASE}/araclar/tiras-takvimi`,
    cta: "Takvimi oluştur",
    Icon: Scissors,
  },
] as const;

const TRUST = [
  { label: "Türkiye geneli kargo", Icon: Truck },
  { label: "Güvenli online ödeme", Icon: ShieldCheck },
  { label: "Poodle’a özel seçki", Icon: PawPrint },
] as const;

export default function YPModernHome() {
  const { data: categoryCounts = {} } = useQuery<Record<string, number>>({
    queryKey: ["/api/yp-category-counts"],
    staleTime: 5 * 60 * 1000,
  });

  return (
    <main className="yph">
      <style>{`
        :root {
          --yph-brown: #5D3A1A;
          --yph-brown-dark: #352014;
          --yph-tan: #A67C52;
          --yph-cream: #F7F2EA;
          --yph-paper: #FFFCF8;
          --yph-line: #E6DCCF;
          --yph-text: #2C2118;
          --yph-muted: #76695D;
        }
        .yph {
          overflow: hidden;
          background: var(--yph-cream);
          color: var(--yph-text);
          font-family: 'DM Sans', 'Helvetica Neue', Arial, sans-serif;
        }
        .yph * { box-sizing: border-box; }
        .yph-container {
          width: min(1200px, calc(100% - 32px));
          margin: 0 auto;
        }
        .yph-serif {
          font-family: 'Libre Baskerville', Georgia, serif;
        }
        .yph-hero-wrap { padding: 24px 0 18px; }
        .yph-hero {
          position: relative;
          min-height: 570px;
          overflow: hidden;
          border: 1px solid rgba(93,58,26,.12);
          border-radius: 28px;
          background: #302117;
        }
        .yph-hero-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: 64% 30%;
        }
        .yph-hero-shade {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, rgba(30,19,12,.90) 0%, rgba(30,19,12,.67) 38%, rgba(30,19,12,.10) 70%),
            linear-gradient(0deg, rgba(30,19,12,.25), transparent 45%);
        }
        .yph-hero-copy {
          position: relative;
          z-index: 1;
          width: min(610px, 58%);
          min-height: 570px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 58px;
          color: #fff;
        }
        .yph-kicker {
          display: inline-flex;
          width: fit-content;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
          padding: 7px 11px;
          border: 1px solid rgba(255,255,255,.25);
          border-radius: 999px;
          background: rgba(255,255,255,.10);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .04em;
          backdrop-filter: blur(8px);
        }
        .yph-hero h1 {
          max-width: 12ch;
          margin: 0 0 18px;
          font-size: clamp(38px, 4.4vw, 64px);
          font-weight: 700;
          line-height: 1.08;
          letter-spacing: -.045em;
        }
        .yph-hero-lead {
          max-width: 43ch;
          margin: 0 0 28px;
          color: rgba(255,255,255,.84);
          font-size: 17px;
          line-height: 1.65;
        }
        .yph-actions { display: flex; flex-wrap: wrap; gap: 10px; }
        .yph-btn {
          min-height: 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0 18px;
          border: 1px solid transparent;
          border-radius: 13px;
          font-size: 14px;
          font-weight: 750;
          text-decoration: none;
          transition: transform .18s ease, background .18s ease, border-color .18s ease;
        }
        .yph-btn:hover { transform: translateY(-1px); }
        .yph-btn-primary { background: #fff; color: var(--yph-brown-dark); }
        .yph-btn-primary:hover { background: #F8F1E8; }
        .yph-btn-ghost {
          border-color: rgba(255,255,255,.35);
          background: rgba(255,255,255,.08);
          color: #fff;
          backdrop-filter: blur(8px);
        }
        .yph-btn-ghost:hover { background: rgba(255,255,255,.15); }
        .yph-trust-line {
          display: flex;
          flex-wrap: wrap;
          gap: 14px 20px;
          margin-top: 26px;
          color: rgba(255,255,255,.72);
          font-size: 12px;
          font-weight: 650;
        }
        .yph-trust-line span { display: inline-flex; align-items: center; gap: 6px; }

        .yph-primary {
          display: grid;
          grid-template-columns: repeat(4, minmax(0,1fr));
          gap: 14px;
          padding: 0 0 68px;
        }
        .yph-primary-card {
          min-height: 178px;
          display: flex;
          flex-direction: column;
          padding: 20px;
          border: 1px solid var(--yph-line);
          border-radius: 20px;
          background: var(--yph-paper);
          color: inherit;
          text-decoration: none;
          transition: transform .18s ease, border-color .18s ease;
        }
        .yph-primary-card:hover { transform: translateY(-3px); border-color: #CDBBA8; }
        .yph-icon {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          margin-bottom: 24px;
          border-radius: 13px;
          color: var(--yph-brown);
        }
        .yph-tone-teal .yph-icon { background: #DDF4F0; color: #247C72; }
        .yph-tone-amber .yph-icon { background: #FBE9D5; color: #B86520; }
        .yph-tone-sage .yph-icon { background: #E1EFE7; color: #39745C; }
        .yph-tone-lilac .yph-icon { background: #EAE6F5; color: #68569A; }
        .yph-primary-card strong { margin-bottom: 6px; font-size: 17px; letter-spacing: -.01em; }
        .yph-primary-card p { margin: 0; color: var(--yph-muted); font-size: 13px; line-height: 1.5; }
        .yph-card-arrow { margin-top: auto; padding-top: 15px; color: var(--yph-brown); }

        .yph-section { padding: 76px 0; }
        .yph-section-white { background: var(--yph-paper); }
        .yph-heading-row {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 28px;
        }
        .yph-eyebrow {
          margin: 0 0 9px;
          color: var(--yph-tan);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .11em;
          text-transform: uppercase;
        }
        .yph-section-title {
          max-width: 620px;
          margin: 0;
          font-size: clamp(27px, 3vw, 40px);
          line-height: 1.2;
          letter-spacing: -.035em;
        }
        .yph-text-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: var(--yph-brown);
          font-size: 13px;
          font-weight: 750;
          text-decoration: none;
          white-space: nowrap;
        }
        .yph-categories {
          display: grid;
          grid-template-columns: repeat(3, minmax(0,1fr));
          gap: 12px;
        }
        .yph-category {
          min-height: 126px;
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          border: 1px solid var(--yph-line);
          border-radius: 18px;
          background: #fff;
          color: inherit;
          text-decoration: none;
          transition: transform .18s ease, border-color .18s ease;
        }
        .yph-category:hover { transform: translateY(-2px); border-color: #CDBBA8; }
        .yph-category-icon {
          width: 52px;
          height: 52px;
          display: grid;
          flex: 0 0 auto;
          place-items: center;
          border-radius: 15px;
          background: var(--yph-cream);
          color: var(--yph-brown);
        }
        .yph-category strong { display: block; margin-bottom: 4px; font-size: 15px; }
        .yph-category small { color: var(--yph-muted); font-size: 12px; }

        .yph-tools {
          display: grid;
          grid-template-columns: repeat(2, minmax(0,1fr));
          gap: 16px;
        }
        .yph-tool {
          position: relative;
          min-height: 292px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 34px;
          border: 1px solid var(--yph-line);
          border-radius: 24px;
          background: #EFE6D9;
          color: inherit;
          text-decoration: none;
        }
        .yph-tool:nth-child(2) { background: #E8EDE5; }
        .yph-tool-icon {
          position: absolute;
          right: 30px;
          top: 30px;
          width: 64px;
          height: 64px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: rgba(255,255,255,.58);
          color: var(--yph-brown);
        }
        .yph-tool h3 {
          max-width: 14ch;
          margin: 0 0 12px;
          font-size: 27px;
          line-height: 1.22;
          letter-spacing: -.03em;
        }
        .yph-tool p:not(.yph-eyebrow) {
          max-width: 45ch;
          margin: 0;
          color: var(--yph-muted);
          font-size: 14px;
          line-height: 1.6;
        }
        .yph-tool .yph-text-link { margin-top: auto; padding-top: 24px; }

        .yph-trust {
          display: grid;
          grid-template-columns: repeat(3, minmax(0,1fr));
          border-block: 1px solid var(--yph-line);
        }
        .yph-trust-item {
          min-height: 94px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 11px;
          color: var(--yph-text);
          font-size: 13px;
          font-weight: 700;
        }
        .yph-trust-item + .yph-trust-item { border-left: 1px solid var(--yph-line); }

        .yph-closing { padding: 82px 0; }
        .yph-closing-box {
          position: relative;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1.15fr .85fr;
          align-items: center;
          min-height: 330px;
          border-radius: 28px;
          background: var(--yph-brown-dark);
          color: #fff;
        }
        .yph-closing-copy { position: relative; z-index: 1; padding: 52px; }
        .yph-closing h2 {
          max-width: 13ch;
          margin: 0 0 14px;
          font-size: clamp(30px, 3.6vw, 48px);
          line-height: 1.14;
          letter-spacing: -.04em;
        }
        .yph-closing p {
          max-width: 47ch;
          margin: 0 0 24px;
          color: rgba(255,255,255,.72);
          font-size: 15px;
          line-height: 1.6;
        }
        .yph-closing-art {
          height: 100%;
          display: grid;
          place-items: center;
          color: rgba(255,255,255,.16);
        }

        .yph a:focus-visible {
          outline: 3px solid #C78D52;
          outline-offset: 3px;
        }
        @media (max-width: 900px) {
          .yph-container { width: min(100% - 28px, 760px); }
          .yph-hero, .yph-hero-copy { min-height: 520px; }
          .yph-hero-copy { width: 68%; padding: 42px; }
          .yph-primary { grid-template-columns: repeat(2, minmax(0,1fr)); padding-bottom: 52px; }
          .yph-categories { grid-template-columns: repeat(2, minmax(0,1fr)); }
          .yph-section { padding: 60px 0; }
          .yph-closing-copy { padding: 40px; }
        }
        @media (max-width: 620px) {
          .yph-container { width: calc(100% - 24px); }
          .yph-hero-wrap { padding: 12px 0 12px; }
          .yph-hero { min-height: 520px; border-radius: 22px; }
          .yph-hero-img { object-position: 60% 30%; }
          .yph-hero-shade {
            background: linear-gradient(0deg, rgba(28,18,11,.92) 0%, rgba(28,18,11,.55) 48%, rgba(28,18,11,.08) 78%);
          }
          .yph-hero-copy {
            width: 100%;
            min-height: 520px;
            justify-content: flex-end;
            padding: 28px 24px 32px;
          }
          .yph-kicker { margin-bottom: 14px; font-size: 10px; }
          .yph-hero h1 { max-width: 13ch; margin-bottom: 12px; font-size: 34px; }
          .yph-hero-lead { margin-bottom: 20px; font-size: 14px; line-height: 1.5; }
          .yph-btn { min-height: 44px; padding: 0 14px; font-size: 12px; }
          .yph-trust-line { display: none; }
          .yph-primary { gap: 9px; padding-bottom: 42px; }
          .yph-primary-card { min-height: 148px; padding: 14px; border-radius: 16px; }
          .yph-icon { width: 40px; height: 40px; margin-bottom: 17px; }
          .yph-primary-card strong { font-size: 14px; }
          .yph-primary-card p { font-size: 11px; }
          .yph-card-arrow { padding-top: 10px; }
          .yph-section { padding: 48px 0; }
          .yph-heading-row { align-items: start; margin-bottom: 20px; }
          .yph-heading-row .yph-text-link { display: none; }
          .yph-section-title { font-size: 27px; }
          .yph-categories { gap: 9px; }
          .yph-category { min-height: 112px; flex-direction: column; align-items: flex-start; gap: 12px; padding: 15px; }
          .yph-category-icon { width: 42px; height: 42px; border-radius: 13px; }
          .yph-category strong { font-size: 13px; }
          .yph-category small { font-size: 10px; }
          .yph-tools { grid-template-columns: 1fr; gap: 12px; }
          .yph-tool { min-height: 246px; padding: 25px; border-radius: 20px; }
          .yph-tool-icon { width: 52px; height: 52px; right: 22px; top: 22px; }
          .yph-tool h3 { max-width: 12ch; font-size: 24px; }
          .yph-trust { grid-template-columns: 1fr; }
          .yph-trust-item { min-height: 68px; justify-content: flex-start; padding: 0 8px; }
          .yph-trust-item + .yph-trust-item { border-left: 0; border-top: 1px solid var(--yph-line); }
          .yph-closing { padding: 48px 0; }
          .yph-closing-box { grid-template-columns: 1fr; min-height: 390px; border-radius: 22px; }
          .yph-closing-copy { padding: 32px 25px; }
          .yph-closing-art { display: none; }
          .yph-closing h2 { font-size: 31px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .yph * { scroll-behavior: auto !important; transition: none !important; }
        }
      `}</style>

      <section className="yph-hero-wrap">
        <div className="yph-container">
          <div className="yph-hero">
            <picture>
              <source
                type="image/webp"
                srcSet="/images/yp-home-hero-640.webp 640w, /images/yp-home-hero-1024.webp 1024w"
                sizes="(max-width: 620px) 100vw, 1200px"
              />
              <img
                className="yph-hero-img"
                src="/images/yp-home-hero-1024.jpg"
                alt="Koltukta dinlenen Toy Poodle"
                width={1024}
                height={1536}
                decoding="async"
                fetchPriority="high"
              />
            </picture>
            <div className="yph-hero-shade" />
            <div className="yph-hero-copy">
              <div className="yph-kicker"><PawPrint size={14} /> Poodle’ına özel bir dünya</div>
              <h1 className="yph-serif">Daha mutlu bir Poodle için her şey burada.</h1>
              <p className="yph-hero-lead">
                Doğru mamayı bul, özenle seçilmiş ürünleri keşfet ve bakım yolculuğunda güvenilir destek al.
              </p>
              <div className="yph-actions">
                <a className="yph-btn yph-btn-primary" href={`${BASE}/mama-bul`}>
                  Mama Bul <ArrowRight size={16} />
                </a>
                <a className="yph-btn yph-btn-ghost" href={`${BASE}/magaza`}>
                  Mağazayı keşfet
                </a>
              </div>
              <div className="yph-trust-line">
                <span><Check size={14} /> Poodle’a özel seçim</span>
                <span><Check size={14} /> Güvenli ödeme</span>
                <span><Check size={14} /> Türkiye geneli kargo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="YourPoodle hizmetleri">
        <div className="yph-container yph-primary">
          {PRIMARY_LINKS.map(({ label, desc, href, Icon, tone }) => (
            <a key={label} className={`yph-primary-card yph-tone-${tone}`} href={href}>
              <span className="yph-icon"><Icon size={21} strokeWidth={1.8} /></span>
              <strong>{label}</strong>
              <p>{desc}</p>
              <ArrowRight className="yph-card-arrow" size={17} />
            </a>
          ))}
        </div>
      </section>

      <section className="yph-section yph-section-white">
        <div className="yph-container">
          <div className="yph-heading-row">
            <div>
              <p className="yph-eyebrow">Poodle seçkisi</p>
              <h2 className="yph-section-title yph-serif">İhtiyacına göre keşfet</h2>
            </div>
            <a className="yph-text-link" href={`${BASE}/magaza`}>Tüm kategoriler <ArrowRight size={15} /></a>
          </div>
          <div className="yph-categories">
            {CATEGORIES.map(({ label, desc, href, Icon, countKey }) => {
              const count = categoryCounts[countKey];
              return (
                <a key={label} className="yph-category" href={href}>
                  <span className="yph-category-icon"><Icon size={22} strokeWidth={1.7} /></span>
                  <span>
                    <strong>{label}</strong>
                    <small>{count ? `${count} ürün` : desc}</small>
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <YPHomeProducts />

      <div className="yph-container">
        <YPRecentlyViewed />
      </div>

      <section className="yph-section">
        <div className="yph-container">
          <div className="yph-heading-row">
            <div>
              <p className="yph-eyebrow">Poodle araçları</p>
              <h2 className="yph-section-title yph-serif">Bakımı kolaylaştıran küçük yardımcılar</h2>
            </div>
            <a className="yph-text-link" href={`${BASE}/araclar`}>Tüm araçlar <ArrowRight size={15} /></a>
          </div>
          <div className="yph-tools">
            {TOOLS.map(({ eyebrow, title, desc, href, cta, Icon }) => (
              <a className="yph-tool" href={href} key={title}>
                <span className="yph-tool-icon"><Icon size={27} strokeWidth={1.6} /></span>
                <p className="yph-eyebrow">{eyebrow}</p>
                <h3 className="yph-serif">{title}</h3>
                <p>{desc}</p>
                <span className="yph-text-link">{cta} <ArrowRight size={15} /></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="yph-section-white">
        <div className="yph-container yph-trust">
          {TRUST.map(({ label, Icon }) => (
            <div className="yph-trust-item" key={label}>
              <Icon size={19} color="#5D3A1A" strokeWidth={1.8} /> {label}
            </div>
          ))}
        </div>
      </section>

      <section className="yph-closing yph-section-white">
        <div className="yph-container">
          <div className="yph-closing-box">
            <div className="yph-closing-copy">
              <p className="yph-eyebrow">Nereden başlamalı?</p>
              <h2 className="yph-serif">Poodle’ına uygun mamayı birlikte bulalım.</h2>
              <p>Birkaç kısa soruyla yaşına, kilosuna ve ihtiyaçlarına uygun seçeneklere ulaş.</p>
              <a className="yph-btn yph-btn-primary" href={`${BASE}/mama-bul`}>
                Mama Bul’a başla <ArrowRight size={16} />
              </a>
            </div>
            <div className="yph-closing-art" aria-hidden="true">
              <PawPrint size={180} strokeWidth={.7} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
