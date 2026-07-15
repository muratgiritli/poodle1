import { useState } from "react";
import { useLocation } from "wouter";
import { Menu, X, Search, ShoppingCart, ChevronDown, ChevronUp } from "lucide-react";
import { useCustomer } from "@/contexts/CustomerContext";
import { useQuery } from "@tanstack/react-query";
import YPBottomNav from "@/components/YPBottomNav";

const LANGUAGES = [
  { code: "TR", flag: "🇹🇷" },
  { code: "EN", flag: "🇺🇸" },
  { code: "DE", flag: "🇩🇪" },
  { code: "FR", flag: "🇫🇷" },
  { code: "ES", flag: "🇪🇸" },
  { code: "IT", flag: "🇮🇹" },
  { code: "AR", flag: "🇸🇦" },
];

const CAT_NAV = [
  { label: "Rehber",      href: "/yourpoodle/rehber",       emoji: "📖" },
  { label: "Mama Bul",   href: "/yourpoodle/mama-bul",     emoji: "🔍" },
  { label: "Sağlık",     href: "/yourpoodle/saglik",       emoji: "🏥" },
  { label: "Bakım",      href: "/yourpoodle/bakim",        emoji: "✂️" },
  { label: "Eğitim",     href: "/yourpoodle/egitim",       emoji: "🎓" },
  { label: "AI Asistan", href: "/yourpoodle/ai-asistan",   emoji: "🤖" },
  { label: "Topluluk",   href: "/yourpoodle/topluluk",     emoji: "👥" },
  { label: "Market",     href: "/yourpoodle/magaza",       emoji: "🛒" },
];

const DRAWER_LINKS = [
  { label: "Ana Sayfa",       href: "/yourpoodle" },
  { label: "Rehber",          href: "/yourpoodle/rehber" },
  { label: "Mama Bul",        href: "/yourpoodle/mama-bul" },
  { label: "Hızlı Araçlar",   href: "/yourpoodle/bilgi" },
  { label: "AI Asistan",      href: "/yourpoodle/ai-asistan" },
  { label: "Topluluk",        href: "/yourpoodle/topluluk" },
  { label: "Market",          href: "/yourpoodle/magaza" },
  { label: "Poodle'ım",       href: "/yourpoodle/poodle-ekle" },
  { label: "Hakkımızda",      href: "/hakkimizda" },
  { label: "İletişim",        href: "/iletisim" },
];

const NEED_CARDS = [
  { emoji: "🍖", label: "Doğru mamayı bul",   href: "/yourpoodle/mama-bul",    bg: "#FFF0E0", color: "#E07820" },
  { emoji: "🚽", label: "Tuvalet eğitimi",     href: "/yourpoodle/egitim",      bg: "#D6F5E8", color: "#059669" },
  { emoji: "👁️", label: "Göz yaşı problemi",  href: "/yourpoodle/saglik",      bg: "#FFF0F5", color: "#E75480" },
  { emoji: "🪮", label: "Tüy ve tarama",       href: "/yourpoodle/bakim",       bg: "#EDE8FF", color: "#7C3AFF" },
  { emoji: "🔊", label: "Havlama sorunu",      href: "/yourpoodle/egitim",      bg: "#FFFBEB", color: "#D97706" },
  { emoji: "🏠", label: "Yalnız kalma",        href: "/yourpoodle/egitim",      bg: "#DBEAFE", color: "#2563EB" },
  { emoji: "🍼", label: "Yavru bakımı",        href: "/yourpoodle/rehber",      bg: "#D6F5F5", color: "#0891B2" },
  { emoji: "🩺", label: "Sağlık belirtileri",  href: "/yourpoodle/saglik",      bg: "#FFE4EC", color: "#DB2777" },
];

const AI_EXAMPLES = [
  "4 aylık Poodle'ım ne kadar mama yemeli?",
  "Göz altı neden kızarıyor?",
  "Evde yalnız kalınca neden havlıyor?",
  "Hangi tarak kullanılmalı?",
  "Tuvalet eğitimine nasıl başlamalıyım?",
];

const TOOLS = [
  { emoji: "🍽️", label: "Mama Hesaplama",    href: "/yourpoodle/bilgi", desc: "Günlük gram hesapla" },
  { emoji: "🐾", label: "Yaş Hesaplama",      href: "/yourpoodle/bilgi", desc: "Köpek yaşını hesapla" },
  { emoji: "⚖️", label: "İdeal Kilo",         href: "/yourpoodle/bilgi", desc: "Kilo kontrolü" },
  { emoji: "💧", label: "Su İhtiyacı",        href: "/yourpoodle/bilgi", desc: "Günlük su miktarı" },
  { emoji: "🚫", label: "Yasak Yiyecekler",   href: "/yourpoodle/bilgi", desc: "Tehlikeli besinler" },
  { emoji: "✂️", label: "Bakım Takvimi",      href: "/yourpoodle/bilgi", desc: "Tıraş zamanı" },
  { emoji: "💊", label: "Belirti Rehberi",    href: "/yourpoodle/saglik", desc: "Semptom kontrolü" },
  { emoji: "💉", label: "Aşı Takvimi",        href: "/yourpoodle/bilgi", desc: "Aşı hatırlatma" },
];

const AGE_GUIDES: Record<string, { emoji: string; title: string; tag: string; min: string }[]> = {
  yavru: [
    { emoji: "🍼", tag: "Yavru", title: "Eve İlk Geldiğinde Ne Yapmalısınız?", min: "5 dk" },
    { emoji: "💉", tag: "Sağlık", title: "İlk Aşılar: Ne Zaman, Nasıl?", min: "4 dk" },
    { emoji: "🚽", tag: "Eğitim", title: "Tuvalet Eğitimine Başlama Kılavuzu", min: "7 dk" },
  ],
  yetiskin: [
    { emoji: "🍖", tag: "Beslenme", title: "Yetişkin Poodle İçin En İyi Mama Markaları", min: "5 dk" },
    { emoji: "✂️", tag: "Bakım",    title: "Evde Tıraş: Adım Adım Rehber", min: "8 dk" },
    { emoji: "🏃", tag: "Aktivite", title: "Günlük Egzersiz ve Oyun Rehberi", min: "4 dk" },
  ],
  yasli: [
    { emoji: "🫀", tag: "Sağlık",   title: "Yaşlı Poodle'da Dikkat Edilmesi Gerekenler", min: "6 dk" },
    { emoji: "🦷", tag: "Bakım",    title: "Diş ve Ağız Sağlığı Yaşlı Köpeklerde", min: "4 dk" },
    { emoji: "🍽️", tag: "Beslenme", title: "Yaşlı Poodle İçin Beslenme Değişikliği", min: "5 dk" },
  ],
};

const FAQ_ITEMS = [
  { q: "Toy Poodle ile Minyatür Poodle arasındaki fark nedir?", a: "Toy Poodle genellikle 2-4 kg, Minyatür Poodle ise 4-9 kg ağırlığındadır. İkisi de zeki, eğitilebilir ve az dökülen tüylere sahiptir." },
  { q: "Poodle'lar için en iyi mama hangisi?", a: "Royal Canin, Pro Plan ve Hill's Science Plan poodle sahiplerinin en çok tercih ettiği markalar arasındadır. Mama Bul sihirbazımız poodle'ınıza özel öneri sunar." },
  { q: "Poodle'lar ne sıklıkla tıraş yaptırılmalı?", a: "Toy ve Minyatür Poodle'lar ortalama 6-8 haftada bir tıraş gerektirir. Tüyleri sürekli uzadığından düzenli bakım şarttır." },
  { q: "Poodle'ımı evde yalnız bırakabilir miyim?", a: "Poodle'lar sosyal köpeklerdir. Uzun süre yalnız kaldıklarında anksiyete yaşayabilirler. Günde 4-6 saatten fazla yalnız bırakmamaya çalışın." },
  { q: "AI asistan gerçek veteriner yerine geçer mi?", a: "Hayır. AI asistanımız genel bilgilendirme sağlar. Sağlık sorunları için mutlaka veteriner hekiminize başvurun." },
];

const CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #fff; }
.yp-icon-btn { background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 6px; border-radius: 8px; }
.yp-icon-btn:active { background: #f5f5f5; }
.yp-drawer { position: fixed; top: 0; left: 0; height: 100%; width: 72%; max-width: 290px; background: #fff; z-index: 200; transform: translateX(-100%); transition: transform 0.24s ease; box-shadow: 4px 0 28px rgba(0,0,0,0.15); }
.yp-drawer.open { transform: translateX(0); }
.yp-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 199; backdrop-filter: blur(2px); }
.need-card { display: flex; flex-direction: column; align-items: center; gap: 8px; background: none; border: none; cursor: pointer; padding: 0; text-align: center; }
.tool-card { display: flex; align-items: center; gap: 12px; background: #fff; border: 1.5px solid #f0f0f0; border-radius: 14px; padding: 14px 14px; cursor: pointer; }
.tool-card:active { background: #F8F7FF; }
.guide-row { display: flex; gap: 12px; align-items: center; padding: 13px; background: #FAFAFA; border-radius: 14px; cursor: pointer; }
.guide-row:active { background: #F0ECFF; }
.faq-item { border-bottom: 1px solid #F0F0F0; }
.faq-btn { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 16px 0; background: none; border: none; cursor: pointer; font-family: 'Inter', sans-serif; text-align: left; gap: 12px; }
.age-tab { flex: 1; padding: 9px 4px; background: none; border: none; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; border-bottom: 2.5px solid transparent; transition: all 0.15s; }
.age-tab.active { color: #7C3AFF; border-bottom-color: #7C3AFF; font-weight: 800; }

/* ── DESKTOP ─────────────────────────────────────────── */
.yp-center { width: 100%; }
.yp-hero-section { padding: 32px 20px 28px; }
.yp-hero-content { position: relative; z-index: 2; }
.yp-hero-row { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
.yp-hero-img-wrap { flex-shrink: 0; width: 120px; height: 120px; }
.yp-hero-cta-row { display: flex; flex-direction: column; gap: 10px; }
.yp-hero-cta-pair { display: flex; gap: 10px; }
.yp-need-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.yp-ai-profile-row { display: flex; flex-direction: column; gap: 0; }
.yp-section-pad { padding: 24px 16px; }
.yp-section-mg { margin: 0 16px 24px; }
.yp-tools-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.yp-products-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
.yp-community-reviews-row { display: flex; flex-direction: column; gap: 0; }
.yp-faq-email-row { display: flex; flex-direction: column; gap: 0; }
.yp-footer-links { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
.yp-bottom-nav-wrap { display: block; }
.yp-header-cats { overflow-x: auto; display: flex; padding: 6px 10px 8px; gap: 6px; scrollbar-width: none; border-top: 1px solid #f5f5f5; }

@media (min-width: 900px) {
  .yp-bottom-nav-wrap { display: none; }
  .yp-center { max-width: 1280px; margin: 0 auto; padding: 0 48px; }
  .yp-header-inner { max-width: 1280px; margin: 0 auto; padding: 0 48px; }
  .yp-header-cats { max-width: 1280px; margin: 0 auto; padding: 6px 48px 10px; overflow: visible; border-top: 1px solid #f5f5f5; }
  .yp-header-cats-inner { gap: 8px; }

  .yp-hero-section { padding: 64px 0 56px; }
  .yp-hero-content { max-width: 1280px; margin: 0 auto; padding: 0 48px; display: grid; grid-template-columns: 1fr 480px; gap: 64px; align-items: center; }
  .yp-hero-row { flex-direction: column; align-items: flex-start; gap: 0; margin-bottom: 0; }
  .yp-hero-img-wrap { display: none; }
  .yp-hero-text h1 { font-size: 56px !important; }
  .yp-hero-text p { font-size: 18px !important; }
  .yp-hero-cta-row { flex-direction: column; gap: 14px; }
  .yp-hero-cta-main { height: 56px !important; font-size: 17px !important; border-radius: 16px !important; }
  .yp-hero-cta-pair { gap: 12px; }
  .yp-hero-cta-sec { height: 52px !important; font-size: 15px !important; border-radius: 14px !important; }
  .yp-hero-right { display: flex !important; flex-direction: column; align-items: center; justify-content: center; }
  .yp-hero-right-img { width: 300px !important; height: 300px !important; }
  .yp-hero-badges { justify-content: flex-start !important; }

  .yp-section-pad { padding: 40px 0; }
  .yp-section-mg { margin: 0 0 32px; }
  .yp-need-grid { grid-template-columns: repeat(4, 1fr); gap: 16px; }
  .need-card { padding: 20px 12px !important; border-radius: 20px !important; }

  .yp-ai-profile-row { flex-direction: row; gap: 24px; }
  .yp-ai-profile-row > * { flex: 1; }

  .yp-tools-grid { grid-template-columns: repeat(4, 1fr); gap: 14px; }
  .tool-card { padding: 18px 16px; border-radius: 16px; }

  .yp-guides-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .yp-age-guides-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }

  .yp-products-grid { grid-template-columns: repeat(6, 1fr); gap: 14px; }

  .yp-community-reviews-row { flex-direction: row; gap: 24px; align-items: flex-start; }
  .yp-community-reviews-row > * { flex: 1; }

  .yp-faq-email-row { flex-direction: row; gap: 56px; align-items: flex-start; }
  .yp-faq-col { flex: 3; }
  .yp-email-col { flex: 2; position: sticky; top: 100px; }

  .yp-footer-links { grid-template-columns: repeat(4, 1fr); gap: 32px; }
  .yp-footer-inner { max-width: 1280px; margin: 0 auto; }
  .yp-footer-brand { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 40px; }
  .yp-footer-brand-text { max-width: 360px; }

  .guide-row { border-radius: 16px; padding: 16px; }
  .guide-row:hover { background: #F0ECFF; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(124,58,255,0.08); transition: all 0.2s; }
}
`;

export default function YourPoodleHomePage() {
  const [location, navigate] = useLocation();
  const [activeLang, setActiveLang] = useState(LANGUAGES[0]);
  const [langOpen, setLangOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [ageTab, setAgeTab] = useState<"yavru" | "yetiskin" | "yasli">("yetiskin");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const { isLoggedIn } = useCustomer();

  const { data: products = [] } = useQuery<any[]>({
    queryKey: ["/api/products"],
    staleTime: 5 * 60 * 1000,
  });

  const { data: settings } = useQuery<Record<string, string>>({
    queryKey: ["/api/public-settings"],
    staleTime: 2 * 60 * 1000,
  });

  return (
    <>
      <style>{CSS}</style>

      <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Inter',sans-serif", position: "relative" }}>

        {/* ── DRAWER ─────────────────────────────────────────────── */}
        {drawerOpen && <div className="yp-overlay" onClick={() => setDrawerOpen(false)} />}
        <nav className={`yp-drawer ${drawerOpen ? "open" : ""}`} aria-label="Yan menü">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 18px 14px", borderBottom: "1px solid #f2f2f2" }}>
            <img src="/images/yourpoodle-logo.jpg" alt="YourPoodle" style={{ height: 30, objectFit: "contain" }} />
            <button className="yp-icon-btn" aria-label="Menüyü kapat" onClick={() => setDrawerOpen(false)}>
              <X size={20} color="#444" />
            </button>
          </div>
          <div style={{ padding: "8px 0" }}>
            {DRAWER_LINKS.map(l => (
              <a key={l.href} href={l.href}
                onClick={e => { e.preventDefault(); navigate(l.href); setDrawerOpen(false); }}
                style={{ display: "block", padding: "13px 20px", fontSize: 15, fontWeight: 600, color: location.startsWith(l.href) ? "#7C3AFF" : "#222", textDecoration: "none", background: location.startsWith(l.href) ? "#F5F0FF" : "transparent" }}>
                {l.label}
              </a>
            ))}
          </div>
          <div style={{ padding: "20px 18px", borderTop: "1px solid #f2f2f2", marginTop: "auto" }}>
            <button
              onClick={() => { navigate(isLoggedIn ? "/hesabim" : "/yourpoodle/giris"); setDrawerOpen(false); }}
              style={{ width: "100%", height: 46, borderRadius: 12, background: "#7C3AFF", border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>
              {isLoggedIn ? "👤 Hesabım" : "Üye Girişi / Kayıt"}
            </button>
          </div>
        </nav>

        {/* ── 1. HEADER ──────────────────────────────────────────── */}
        <header style={{ position: "sticky", top: 0, zIndex: 100, background: "#fff", borderBottom: "1px solid #f0f0f0" }}>
          <div className="yp-header-inner" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px" }}>
            {/* Left: logo */}
            <button className="yp-icon-btn" onClick={() => navigate("/yourpoodle")} style={{ padding: 0 }} aria-label="Ana sayfa">
              <img src="/images/yourpoodle-logo.jpg" alt="YourPoodle"
                style={{ height: 30, width: 120, objectFit: "contain", objectPosition: "left center" }} />
            </button>

            {/* Desktop nav links — hidden on mobile via inline trick, shown via CSS */}
            <nav style={{ display: "flex", gap: 4, alignItems: "center" }} aria-label="Ana menü" className="yp-desktop-nav">
              <style>{`@media (max-width: 899px) { .yp-desktop-nav { display: none !important; } }`}</style>
              {CAT_NAV.map(c => {
                const active = location.startsWith(c.href);
                return (
                  <button key={c.href}
                    onClick={() => navigate(c.href)}
                    style={{ display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap", padding: "7px 12px", borderRadius: 20, border: "1.5px solid", borderColor: active ? "#7C3AFF" : "transparent", background: active ? "#7C3AFF" : "transparent", color: active ? "#fff" : "#555", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Inter',sans-serif", transition: "all 0.15s" }}>
                    <span style={{ fontSize: 13 }}>{c.emoji}</span>
                    {c.label}
                  </button>
                );
              })}
            </nav>

            {/* Right: search, cart, lang, login, menu */}
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button className="yp-icon-btn" aria-label="Ara" onClick={() => navigate("/yourpoodle/bilgi")}>
                <Search size={20} color="#444" />
              </button>
              <button className="yp-icon-btn" aria-label="Sepet" onClick={() => navigate("/yourpoodle/magaza")}>
                <ShoppingCart size={20} color="#444" />
              </button>
              {/* Desktop login button */}
              <style>{`@media (max-width: 899px) { .yp-login-btn { display: none !important; } }`}</style>
              <button
                className="yp-login-btn"
                onClick={() => navigate(isLoggedIn ? "/hesabim" : "/yourpoodle/giris")}
                style={{ height: 38, padding: "0 16px", borderRadius: 20, background: "#7C3AFF", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Inter',sans-serif", whiteSpace: "nowrap" }}>
                {isLoggedIn ? "👤 Hesabım" : "Giriş Yap"}
              </button>
              {/* Lang selector */}
              <div style={{ position: "relative" }}>
                <button className="yp-icon-btn" aria-label="Dil seç" aria-haspopup="listbox"
                  onClick={() => setLangOpen(!langOpen)}
                  style={{ gap: 3, padding: "5px 7px" }}>
                  <span style={{ fontSize: 15 }}>{activeLang.flag}</span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#6C47FF" }}>{activeLang.code}</span>
                  <ChevronDown size={11} color="#6C47FF" strokeWidth={2.5}
                    style={{ transform: langOpen ? "rotate(180deg)" : "none", transition: "0.18s" }} />
                </button>
                {langOpen && (
                  <div role="listbox" aria-label="Dil seçenekleri"
                    style={{ position: "absolute", right: 0, top: 38, background: "#fff", borderRadius: 12, border: "1px solid #eee", boxShadow: "0 8px 28px rgba(0,0,0,0.12)", zIndex: 150, minWidth: 110, padding: "4px 0" }}>
                    {LANGUAGES.map(l => (
                      <button key={l.code} role="option" aria-selected={activeLang.code === l.code}
                        onClick={() => { setActiveLang(l); setLangOpen(false); }}
                        style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "9px 14px", border: "none", cursor: "pointer", background: activeLang.code === l.code ? "#F5F0FF" : "transparent", fontSize: 13, fontWeight: 700, color: activeLang.code === l.code ? "#6C47FF" : "#333", fontFamily: "'Inter',sans-serif" }}>
                        <span style={{ fontSize: 16 }}>{l.flag}</span>{l.code}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Mobile hamburger only */}
              <style>{`@media (min-width: 900px) { .yp-hamburger { display: none !important; } }`}</style>
              <button className="yp-icon-btn yp-hamburger" aria-label="Menüyü aç" onClick={() => setDrawerOpen(true)}>
                <Menu size={22} color="#333" strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* ── MOBILE KATEGORİ MENÜSÜ ─────────────────────────── */}
          <style>{`@media (min-width: 900px) { .yp-mobile-cats { display: none !important; } }`}</style>
          <div className="yp-mobile-cats yp-header-cats">
            {CAT_NAV.map(c => {
              const active = location.startsWith(c.href);
              return (
                <button key={c.href}
                  onClick={() => navigate(c.href)}
                  aria-current={active ? "page" : undefined}
                  style={{
                    display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap",
                    padding: "7px 13px", borderRadius: 20, border: "1.5px solid",
                    borderColor: active ? "#7C3AFF" : "#ebebeb",
                    background: active ? "#7C3AFF" : "#fff",
                    color: active ? "#fff" : "#444",
                    fontSize: 12.5, fontWeight: 700, cursor: "pointer", flexShrink: 0,
                    fontFamily: "'Inter',sans-serif", transition: "all 0.15s",
                  }}>
                  <span style={{ fontSize: 14 }}>{c.emoji}</span>
                  {c.label}
                </button>
              );
            })}
          </div>
        </header>

        {/* ── 3. HERO ────────────────────────────────────────────── */}
        <section aria-label="Giriş" className="yp-hero-section" style={{ background: "linear-gradient(135deg,#5B21B6 0%,#7C3AFF 50%,#A855F7 100%)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
          <div style={{ position: "absolute", bottom: -60, left: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
          <div style={{ position: "absolute", top: "30%", right: "20%", width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />

          <div className="yp-hero-content">
            {/* Desktop: grid layout. Mobile: flex column */}
            <div className="yp-hero-row">
              {/* Left: text */}
              <div style={{ flex: 1 }} className="yp-hero-text">
                <div style={{ fontSize: 11, fontWeight: 900, color: "rgba(255,255,255,0.75)", letterSpacing: "0.1em", marginBottom: 8, textTransform: "uppercase" }}>
                  Dünyanın En Büyük
                </div>
                <h1 style={{ fontSize: 36, fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: 12, letterSpacing: "-0.5px" }}>
                  Toy Poodle<br />Rehberi
                </h1>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", lineHeight: 1.6, marginBottom: 0 }}>
                  Köpeğiniz için ihtiyacınız olan her şey tek yerde. Beslenme, bakım, sağlık ve eğitim rehberleri.
                </p>
              </div>
              {/* Mobile-only image */}
              <div className="yp-hero-img-wrap">
                <img src="/images/poodle-hero.png" alt="Toy Poodle"
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
            </div>

            {/* CTA buttons */}
            <div className="yp-hero-cta-row" style={{ marginTop: 20 }}>
              <button
                className="yp-hero-cta-main"
                onClick={() => navigate("/yourpoodle/mama-bul")}
                aria-label="Poodle'ınıza uygun mamayı bul"
                style={{ height: 52, borderRadius: 14, background: "#fff", border: "none", fontSize: 15, fontWeight: 800, color: "#7C3AFF", cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>
                🔍 Mama Bul
              </button>
              <div className="yp-hero-cta-pair">
                <button
                  className="yp-hero-cta-sec"
                  onClick={() => navigate("/yourpoodle/rehber")}
                  style={{ flex: 1, height: 48, borderRadius: 14, background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.4)", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "'Inter',sans-serif", backdropFilter: "blur(4px)" }}>
                  📖 Rehbere Git
                </button>
                <button
                  className="yp-hero-cta-sec"
                  onClick={() => navigate("/yourpoodle/ai-asistan")}
                  style={{ flex: 1, height: 48, borderRadius: 14, background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.4)", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "'Inter',sans-serif", backdropFilter: "blur(4px)" }}>
                  🤖 AI'ya Sor
                </button>
              </div>
            </div>

            {/* Trust badges */}
            <div className="yp-hero-badges" style={{ display: "flex", gap: 12, marginTop: 22, flexWrap: "wrap" }}>
              {["🐩 Poodle'a özel içerikler", "🎯 Kişiselleştirilmiş öneriler", "🆓 Ücretsiz araçlar"].map(t => (
                <span key={t} style={{ fontSize: 12, color: "rgba(255,255,255,0.9)", fontWeight: 600, background: "rgba(255,255,255,0.1)", borderRadius: 20, padding: "5px 12px" }}>
                  {t}
                </span>
              ))}
            </div>

            {/* Desktop-only right panel */}
            <style>{`@media (max-width: 899px) { .yp-hero-right { display: none !important; } }`}</style>
            <div className="yp-hero-right" style={{ display: "none" }}>
              <img src="/images/poodle-hero.png" alt="Toy Poodle" className="yp-hero-right-img"
                style={{ width: 260, height: 260, objectFit: "contain", filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.3))" }}
                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
                {["✓ 500+ Poodle bakım rehberi", "✓ AI destekli mama önerisi", "✓ Türkiye'nin en büyük Poodle topluluğu"].map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.9)", background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 14px" }}>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. BUGÜN NE ARIYORSUNUZ? ───────────────────────────── */}
        <section aria-labelledby="need-heading" className="yp-section-pad">
          <div className="yp-center">
            <h2 id="need-heading" style={{ fontSize: 20, fontWeight: 900, color: "#1a1a1a", marginBottom: 4 }}>
              Poodle'ınız için bugün ne arıyorsunuz?
            </h2>
            <p style={{ fontSize: 13, color: "#888", marginBottom: 18 }}>Aşağıdaki konulardan birini seçin</p>
            <div className="yp-need-grid">
              {NEED_CARDS.map(c => (
                <button
                  key={c.label}
                  className="need-card"
                  onClick={() => navigate(c.href)}
                  aria-label={c.label}
                  style={{ background: c.bg, borderRadius: 16, padding: "16px 10px", border: "none", cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>
                  <span style={{ fontSize: 30 }}>{c.emoji}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: c.color, lineHeight: 1.3 }}>{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5 + 6. AI ASISTAN + PROFİL (yan yana masaüstünde) ── */}
        <div className="yp-section-pad" style={{ paddingTop: 0 }}>
          <div className="yp-center">
            <div className="yp-ai-profile-row">

              {/* AI Asistan */}
              <div style={{ background: "linear-gradient(135deg,#1E1155,#3D1D8C)", borderRadius: 24, padding: "22px 20px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
                    🤖
                  </div>
                  <div>
                    <h2 style={{ fontSize: 16, fontWeight: 900, color: "#fff", marginBottom: 4 }}>
                      Poodle'ınızla ilgili aklınıza takılanı sorun
                    </h2>
                    <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.7)", lineHeight: 1.5, margin: 0 }}>
                      Yaşını, kilosunu ve ihtiyacını belirtin. Poodle'ınıza özel öneriler alın.
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                  {AI_EXAMPLES.slice(0, 3).map(q => (
                    <button
                      key={q}
                      onClick={() => navigate("/yourpoodle/ai-asistan")}
                      style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "10px 14px", textAlign: "left", fontSize: 12.5, color: "rgba(255,255,255,0.85)", cursor: "pointer", fontFamily: "'Inter',sans-serif", lineHeight: 1.4 }}>
                      💬 {q}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => navigate("/yourpoodle/ai-asistan")}
                  style={{ width: "100%", height: 50, borderRadius: 14, background: "#7C3AFF", border: "none", fontSize: 15, fontWeight: 800, color: "#fff", cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>
                  AI Asistana Sor →
                </button>
                <p style={{ marginTop: 12, fontSize: 11, color: "rgba(255,255,255,0.45)", textAlign: "center", lineHeight: 1.4 }}>
                  Bu asistan genel bilgilendirme sağlar. Acil sağlık durumlarında veteriner hekime başvurun.
                </p>
              </div>

              {/* Profil oluştur */}
              <div style={{ background: "linear-gradient(135deg,#FFF0F5,#FFE4EC)", borderRadius: 24, padding: "22px 20px", display: "flex", gap: 16, alignItems: "center" }}>
                <div style={{ fontSize: 64, flexShrink: 0, lineHeight: 1 }}>🐩</div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 900, color: "#1a1a1a", marginBottom: 8 }}>
                    Poodle profilinizi oluşturun
                  </h2>
                  <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, marginBottom: 18 }}>
                    Yaşına, kilosuna ve ihtiyaçlarına özel mama önerileri, bakım hatırlatıcıları ve kişiselleştirilmiş rehberler alın.
                  </p>
                  <button
                    onClick={() => navigate("/yourpoodle/poodle-ekle")}
                    style={{ height: 46, padding: "0 24px", borderRadius: 12, background: "#E75480", border: "none", fontSize: 14, fontWeight: 800, color: "#fff", cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>
                    Ücretsiz Profil Oluştur
                  </button>
                  <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                    {["🍽️ Yaşa özel beslenme planı", "💊 Aşı ve veteriner hatırlatıcısı", "✂️ Kişiselleştirilmiş bakım takvimi"].map(f => (
                      <div key={f} style={{ fontSize: 12.5, color: "#666", display: "flex", alignItems: "center", gap: 6 }}>{f}</div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── 7. HIZLI ARAÇLAR ─────────────────────────────────────── */}
        <section aria-labelledby="tools-heading" className="yp-section-pad">
          <div className="yp-center">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 id="tools-heading" style={{ fontSize: 20, fontWeight: 900, color: "#1a1a1a" }}>⚡ Hızlı Araçlar</h2>
              <button onClick={() => navigate("/yourpoodle/bilgi")} style={{ fontSize: 13, fontWeight: 700, color: "#7C3AFF", background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>
                Tümünü Gör →
              </button>
            </div>
            <div className="yp-tools-grid">
              {TOOLS.map(t => (
                <button key={t.label} className="tool-card"
                  onClick={() => navigate(t.href)}
                  aria-label={`${t.label}: ${t.desc}`}
                  style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", border: "1.5px solid #f0f0f0", borderRadius: 14, padding: "14px", cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>
                  <span style={{ fontSize: 26, flexShrink: 0 }}>{t.emoji}</span>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#1a1a1a", lineHeight: 1.3 }}>{t.label}</div>
                    <div style={{ fontSize: 11, color: "#999" }}>{t.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── 8 + 9. REHBERLER + YAŞ REHBER (yan yana masaüstünde) ── */}
        <section aria-labelledby="guides-heading" className="yp-section-pad">
          <div className="yp-center">
            <div className="yp-guides-row">

              {/* Sol: Bugün En Çok Okunan */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <h2 id="guides-heading" style={{ fontSize: 20, fontWeight: 900, color: "#1a1a1a" }}>📖 Bugün En Çok Okunan</h2>
                  <button onClick={() => navigate("/yourpoodle/rehber")} style={{ fontSize: 13, fontWeight: 700, color: "#7C3AFF", background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>
                    Tümü →
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { emoji: "🍖", tag: "Beslenme", title: "Toy Poodle İçin En İyi Mama Markaları 2025", min: "5 dk", href: "/yourpoodle/mama" },
                    { emoji: "🛁", tag: "Bakım",    title: "Evde Poodle Tıraşı: Adım Adım Rehber",       min: "8 dk", href: "/yourpoodle/bakim" },
                    { emoji: "💊", tag: "Sağlık",   title: "Göz Yaşı Lekesi: Neden Olur, Nasıl Geçer?",  min: "4 dk", href: "/yourpoodle/saglik" },
                    { emoji: "🚽", tag: "Eğitim",   title: "Tuvalet Eğitimi: 2 Haftada Tamamla",          min: "6 dk", href: "/yourpoodle/egitim" },
                  ].map(({ emoji, tag, title, min, href }) => (
                    <button key={title} className="guide-row"
                      onClick={() => navigate(href)}
                      style={{ display: "flex", gap: 12, alignItems: "center", padding: "13px", background: "#FAFAFA", borderRadius: 14, cursor: "pointer", border: "none", textAlign: "left", fontFamily: "'Inter',sans-serif", width: "100%" }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: "#EDE8FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{emoji}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#7C3AFF", marginBottom: 3 }}>{tag}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.4 }}>{title}</div>
                      </div>
                      <div style={{ fontSize: 11, color: "#aaa", flexShrink: 0 }}>{min}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sağ: Yaşa Göre Rehber */}
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: "#1a1a1a", marginBottom: 14 }}>🐾 Yaşa Göre Rehber</h2>
                <div style={{ display: "flex", borderBottom: "1px solid #f0f0f0", marginBottom: 16 }}>
                  {(["yavru", "yetiskin", "yasli"] as const).map(tab => (
                    <button key={tab} className={`age-tab ${ageTab === tab ? "active" : ""}`}
                      onClick={() => setAgeTab(tab)}
                      aria-selected={ageTab === tab}>
                      {tab === "yavru" ? "🍼 Yavru" : tab === "yetiskin" ? "🐩 Yetişkin" : "💜 Yaşlı"}
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {AGE_GUIDES[ageTab].map(({ emoji, tag, title, min }) => (
                    <button key={title} className="guide-row"
                      onClick={() => navigate("/yourpoodle/rehber")}
                      style={{ display: "flex", gap: 12, alignItems: "center", padding: "13px", background: "#FAFAFA", borderRadius: 14, cursor: "pointer", border: "none", textAlign: "left", fontFamily: "'Inter',sans-serif", width: "100%" }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: "#EDE8FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{emoji}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#7C3AFF", marginBottom: 3 }}>{tag}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.4 }}>{title}</div>
                      </div>
                      <div style={{ fontSize: 11, color: "#aaa" }}>{min}</div>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── 10. MAMA BULMA TANITIM ───────────────────────────────── */}
        <section aria-labelledby="mama-heading" className="yp-section-pad" style={{ paddingTop: 0 }}>
          <div className="yp-center">
            <div style={{ background: "linear-gradient(135deg,#FFF9ED,#FEF3C7)", borderRadius: 24, padding: "28px 28px", border: "1.5px solid #FDE68A" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                <span style={{ fontSize: 48 }}>🔍</span>
                <div>
                  <h2 id="mama-heading" style={{ fontSize: 18, fontWeight: 900, color: "#1a1a1a", marginBottom: 6 }}>
                    Poodle'ınıza özel mama bul
                  </h2>
                  <p style={{ fontSize: 13, color: "#666", margin: 0, lineHeight: 1.5 }}>
                    11 soruluk sihirbazla en uygun 3 mamayı bulun. Yaş, kilo, alerji ve bütçenize göre filtreleme.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/yourpoodle/mama-bul")}
                  style={{ marginLeft: "auto", height: 52, padding: "0 28px", borderRadius: 14, background: "#D97706", border: "none", fontSize: 15, fontWeight: 800, color: "#fff", cursor: "pointer", fontFamily: "'Inter',sans-serif", flexShrink: 0, whiteSpace: "nowrap" }}>
                  Sihirbazı Başlat →
                </button>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["Yaşa göre", "Kiloya göre", "Alerjisiz", "Bütçeye göre", "Marka karşılaştır", "Besin analizi"].map(t => (
                  <span key={t} style={{ fontSize: 12, fontWeight: 700, color: "#92400E", background: "#FDE68A", borderRadius: 20, padding: "4px 10px" }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 11. POODLE SAHİPLERİNİN TERCİH ETTİĞİ ÜRÜNLER ─────── */}
        <section aria-labelledby="products-heading" className="yp-section-pad">
          <div className="yp-center">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 id="products-heading" style={{ fontSize: 20, fontWeight: 900, color: "#1a1a1a" }}>🛍️ Poodle Sahiplerinin Tercihleri</h2>
              <button onClick={() => navigate("/yourpoodle/magaza")} style={{ fontSize: 13, fontWeight: 700, color: "#7C3AFF", background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>
                Tümü →
              </button>
            </div>
            <div className="yp-products-grid">
              {products.slice(0, 12).map((p: any) => (
                <button key={p.id} onClick={() => navigate(`/urun/${p.id}`)}
                  style={{ background: "#FAFAFA", borderRadius: 14, overflow: "hidden", cursor: "pointer", display: "flex", flexDirection: "column", border: "1px solid #f0f0f0", padding: 0, fontFamily: "'Inter',sans-serif", WebkitTapHighlightColor: "transparent", textAlign: "left", transition: "box-shadow 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)")}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}>
                  <div style={{ background: "#F0ECFF", aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                    {p.img
                      ? <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <span style={{ fontSize: 34 }}>🐾</span>}
                    {p.originalPrice && p.originalPrice > p.price && (
                      <div style={{ position: "absolute", top: 6, left: 6, background: "#EF4444", borderRadius: 6, padding: "2px 7px" }}>
                        <span style={{ fontSize: 9, fontWeight: 800, color: "#fff" }}>İND.</span>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "10px 10px 12px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.35, marginBottom: 5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any, overflow: "hidden" }}>{p.name}</div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: "#7C3AFF" }}>₺{Number(p.price).toLocaleString("tr-TR", { minimumFractionDigits: 0 })}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── 12 + 13. TOPLULUK + YORUMLAR (yan yana masaüstünde) ── */}
        <section className="yp-section-pad">
          <div className="yp-center">
            <div className="yp-community-reviews-row">

              {/* Topluluk */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 900, color: "#1a1a1a" }}>👥 Topluluk Paylaşımları</h2>
                  <button onClick={() => navigate("/yourpoodle/topluluk")} style={{ fontSize: 13, fontWeight: 700, color: "#7C3AFF", background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>
                    Tümü →
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { avatar: "🐩", user: "poodlemom_ayse",  time: "2 saat önce", text: "Bugün Mocha'nın ilk tıraşını yaptırdık! Muhteşem oldu 🎀" },
                    { avatar: "🐾", user: "toypoodle_club",  time: "5 saat önce", text: "Yeni mama geçişimizde hiçbir sorun yaşamadık, ipuçları için teşekkürler!" },
                    { avatar: "🤍", user: "poodle_istanbul", time: "1 gün önce",  text: "Bebek poodle'mın 6. ayında aşıları tamam, sağlıklı büyüyor 💜" },
                  ].map(({ avatar, user, time, text }) => (
                    <article key={user} style={{ background: "#FAFAFA", borderRadius: 14, padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#EDE8FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{avatar}</div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 800, color: "#1a1a1a" }}>@{user}</div>
                          <div style={{ fontSize: 10, color: "#aaa" }}><time>{time}</time></div>
                        </div>
                      </div>
                      <p style={{ fontSize: 13, color: "#333", lineHeight: 1.5, margin: 0 }}>{text}</p>
                    </article>
                  ))}
                </div>
                <button
                  onClick={() => navigate("/yourpoodle/topluluk")}
                  style={{ width: "100%", height: 46, borderRadius: 12, background: "#F5F0FF", border: "none", fontSize: 14, fontWeight: 700, color: "#7C3AFF", cursor: "pointer", fontFamily: "'Inter',sans-serif", marginTop: 14 }}>
                  Topluluğa Katıl →
                </button>
              </div>

              {/* Yorumlar */}
              <div style={{ background: "#F8F7FF", borderRadius: 24, padding: "24px" }}>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: "#1a1a1a", marginBottom: 16 }}>💬 Üye Yorumları</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { emoji: "🌸", name: "Zeynep K.", stars: 5, text: "YourPoodle sayesinde poodle'ım için doğru mamayı bulduk. Harika bir platform!" },
                    { emoji: "🐾", name: "Ahmet R.", stars: 5, text: "Mama hesaplama aracı çok işe yaradı. Ölçülü besleme ile kilosunu korudu." },
                    { emoji: "💜", name: "Merve A.", stars: 5, text: "Tuvalet eğitimi rehberi sayesinde 2 haftada hallettik. Süper detaylı." },
                  ].map(({ emoji, name, stars, text }) => (
                    <article key={name} style={{ background: "#fff", borderRadius: 16, padding: "15px 16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#EDE8FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{emoji}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: "#1a1a1a" }}>{name}</div>
                          <div style={{ display: "flex", gap: 2 }}>
                            {Array.from({ length: stars }).map((_, i) => <span key={i} style={{ color: "#FBBF24", fontSize: 13 }}>★</span>)}
                          </div>
                        </div>
                      </div>
                      <p style={{ fontSize: 13, color: "#444", lineHeight: 1.6, margin: 0 }}>{text}</p>
                    </article>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── 14 + 15. SSS + E-POSTA (yan yana masaüstünde) ───────── */}
        <section className="yp-section-pad">
          <div className="yp-center">
            <div className="yp-faq-email-row">

              {/* FAQ */}
              <div className="yp-faq-col">
                <h2 style={{ fontSize: 20, fontWeight: 900, color: "#1a1a1a", marginBottom: 16 }}>❓ Sık Sorulan Sorular</h2>
                <div>
                  {FAQ_ITEMS.map((item, i) => (
                    <div key={i} className="faq-item">
                      <button
                        className="faq-btn"
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        aria-expanded={openFaq === i}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.4 }}>{item.q}</span>
                        {openFaq === i
                          ? <ChevronUp size={18} color="#7C3AFF" style={{ flexShrink: 0 }} />
                          : <ChevronDown size={18} color="#aaa" style={{ flexShrink: 0 }} />}
                      </button>
                      {openFaq === i && (
                        <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6, paddingBottom: 16 }}>
                          {item.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Email abone */}
              <div className="yp-email-col">
                <div style={{ background: "linear-gradient(135deg,#EDE8FF,#F5F0FF)", borderRadius: 24, padding: "32px 28px", textAlign: "center" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>💜</div>
                  <h2 style={{ fontSize: 18, fontWeight: 900, color: "#1a1a1a", marginBottom: 10 }}>
                    Poodle bakım ipuçları al
                  </h2>
                  <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, marginBottom: 20 }}>
                    Haftalık rehberler, yeni araçlar ve poodle topluluğundan haberler. İstediğiniz zaman çıkabilirsiniz.
                  </p>
                  {emailSent ? (
                    <div style={{ background: "#D1FAE5", borderRadius: 12, padding: "14px", fontSize: 14, fontWeight: 700, color: "#065F46" }}>
                      ✓ Teşekkürler! Sizi ekledik.
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="E-posta adresiniz"
                        aria-label="E-posta adresiniz"
                        style={{ width: "100%", height: 48, borderRadius: 12, border: "1.5px solid #DDD5FF", padding: "0 14px", fontSize: 14, outline: "none", fontFamily: "'Inter',sans-serif", background: "#fff" }}
                      />
                      <button
                        onClick={async () => {
                          if (!email.includes("@")) return;
                          try {
                            await fetch("/api/yp/email-subscribe", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ email }),
                            });
                          } catch {}
                          setEmailSent(true);
                        }}
                        style={{ width: "100%", height: 48, borderRadius: 12, background: "#7C3AFF", border: "none", fontSize: 14, fontWeight: 800, color: "#fff", cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>
                        Abone Ol
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── 16. FOOTER ───────────────────────────────────────────── */}
        <footer aria-label="Site haritası" style={{ background: "#1a1a2e", padding: "40px 20px 28px" }}>
          <div className="yp-footer-inner" style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div className="yp-footer-brand" style={{ marginBottom: 32 }}>
              <div className="yp-footer-brand-text">
                <img src="/images/yourpoodle-logo.jpg" alt="YourPoodle" style={{ height: 28, objectFit: "contain", opacity: 0.9 }}
                  onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginTop: 12 }}>
                  Toy Poodle sahipleri için bakım, beslenme, sağlık, eğitim ve topluluk platformu.
                </p>
              </div>
            </div>

            <div className="yp-footer-links">
              {[
                { title: "Rehber", links: [["Yavru Poodle", "/yourpoodle/rehber"], ["Beslenme", "/yourpoodle/mama"], ["Eğitim", "/yourpoodle/egitim"], ["Bakım", "/yourpoodle/bakim"], ["Sağlık", "/yourpoodle/saglik"]] },
                { title: "Market", links: [["Mama", "/yourpoodle/magaza"], ["Ödül", "/yourpoodle/magaza"], ["Bakım", "/yourpoodle/magaza"], ["Aksesuar", "/yourpoodle/magaza"], ["Kişiye özel", "/yourpoodle/magaza"]] },
                { title: "Destek", links: [["Sık Sorulan Sorular", "/sss"], ["Sipariş Takibi", "/siparis-takip"], ["İade", "/teslimat-iade"], ["Yardım Merkezi", "/iletisim"]] },
                { title: "Yasal", links: [["Kullanım Koşulları", "/kullanim-kosullari"], ["Gizlilik", "/gizlilik"], ["KVKK", "/kvkk"], ["Çerez Politikası", "/cerez-politikasi"], ["Topluluk Kuralları", "/yourpoodle/club"]] },
              ].map(({ title, links }) => (
                <div key={title}>
                  <div style={{ fontSize: 11, fontWeight: 900, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>{title}</div>
                  {links.map(([label, href]) => (
                    <a key={label} href={href}
                      onClick={e => { e.preventDefault(); navigate(href); }}
                      style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.65)", textDecoration: "none", marginBottom: 8, lineHeight: 1.4, transition: "color 0.15s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}>
                      {label}
                    </a>
                  ))}
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", lineHeight: 1.6 }}>
                © 2025 Sizpa İnternet Tic. Ltd. Şti. · <a href="mailto:info@sizpa.com" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>info@sizpa.com</a>
              </p>
              <div style={{ display: "flex", gap: 16 }}>
                {[["Gizlilik", "/gizlilik"], ["Çerezler", "/cerez-politikasi"], ["KVKK", "/kvkk"]].map(([l, h]) => (
                  <a key={l} href={h} onClick={e => { e.preventDefault(); navigate(h); }}
                    style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textDecoration: "none" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}>
                    {l}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>

        {/* ── 17. BOTTOM NAV (only mobile) ─────────────────────────── */}
        <div className="yp-bottom-nav-wrap">
          <YPBottomNav />
        </div>

      </div>
    </>
  );
}
