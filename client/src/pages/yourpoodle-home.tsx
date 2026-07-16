import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useCustomer } from "@/contexts/CustomerContext";
import YPBottomNav from "@/components/YPBottomNav";

/* ─── SEO ─────────────────────────────────────────────── */
const YP_TITLE = "YourPoodle — Toy Poodle Bakım, Mama ve Eğitim Platformu";
const YP_DESC  = "Toy Poodle sahipleri için dünya genelinde kargo yapan e-ticaret ve uzman içerik platformu. AI destekli mama önerisi, veteriner onaylı rehberler ve aktif topluluk.";

/* ─── DATA ───────────────────────────────────────────── */
const NAV = [
  { label: "Mağaza",     href: "/yourpoodle/magaza" },
  { label: "Rehber",     href: "/yourpoodle/rehber" },
  { label: "AI Asistan", href: "/yourpoodle/ai-asistan" },
  { label: "Club",       href: "/yourpoodle/club" },
];

interface YPProduct {
  id: number; name: string; price: number; originalPrice?: number;
  img?: string; stock: number; isActive: boolean;
  mamaType?: string; subcategory?: string; brandName?: string;
}

const NEEDS = [
  { emoji: "🍖", label: "Doğru Mama",       sub: "Yaş & kiloya göre",  color: "#F97316", bg: "#FFF7ED", href: "/yourpoodle/mama-bul" },
  { emoji: "🚽", label: "Tuvalet Eğitimi",  sub: "Adım adım rehber",   color: "#10B981", bg: "#ECFDF5", href: "/yourpoodle/egitim" },
  { emoji: "👁️", label: "Göz Yaşı",         sub: "Tedavi & bakım",     color: "#EC4899", bg: "#FDF2F8", href: "/yourpoodle/saglik" },
  { emoji: "🪮", label: "Tüy & Bakım",      sub: "Tarama & tıraş",     color: "#8B5CF6", bg: "#F5F3FF", href: "/yourpoodle/bakim" },
  { emoji: "🔊", label: "Havlama",          sub: "Eğitim teknikleri",  color: "#F59E0B", bg: "#FFFBEB", href: "/yourpoodle/egitim" },
  { emoji: "🏠", label: "Yalnız Kalma",     sub: "Anksiyete çözümü",   color: "#3B82F6", bg: "#EFF6FF", href: "/yourpoodle/egitim" },
  { emoji: "🍼", label: "Yavru Bakımı",     sub: "0-6 ay rehberi",     color: "#06B6D4", bg: "#ECFEFF", href: "/yourpoodle/rehber" },
  { emoji: "🩺", label: "Sağlık Belirtileri", sub: "Belirti sorgulama", color: "#EF4444", bg: "#FEF2F2", href: "/yourpoodle/saglik" },
];

const TOOLS = [
  { emoji: "🍽️", label: "Mama Hesaplama",   desc: "Günlük gram miktarı",  color: "#7C3AED" },
  { emoji: "⚖️", label: "İdeal Kilo",        desc: "Kilo kontrolü",         color: "#2563EB" },
  { emoji: "🐾", label: "Yaş Hesaplama",     desc: "İnsan yaşı eşdeğeri",  color: "#059669" },
  { emoji: "💧", label: "Su İhtiyacı",       desc: "Günlük ml miktarı",    color: "#0891B2" },
  { emoji: "✂️", label: "Bakım Takvimi",     desc: "Tıraş zamanı",         color: "#D97706" },
  { emoji: "🚫", label: "Yasak Yiyecekler",  desc: "Tehlikeli besinler",   color: "#DC2626" },
  { emoji: "💊", label: "Belirti Rehberi",   desc: "Semptom kontrolü",     color: "#7C3AED" },
  { emoji: "💉", label: "Aşı Takvimi",       desc: "Hatırlatma sistemi",   color: "#BE185D" },
];

const REVIEWS = [
  { name: "Zeynep K.", avatar: "ZK", stars: 5, text: "AI asistan sayesinde poodle'ımın mama miktarını doğru hesapladık. Kilosu çok daha dengeli oldu!", tag: "AI Asistan" },
  { name: "Ahmet R.",  avatar: "AR", stars: 5, text: "Tıraş rehberi inanılmaz detaylı. Artık her 6 haftada bir kendim tıraş yapıyorum, kuaföre gitmiyorum.", tag: "Bakım Rehberi" },
  { name: "Merve A.",  avatar: "MA", stars: 5, text: "Göz yaşı problemi için verilen öneriler işe yaradı. 2 haftada gözleri tamamen temizlendi!", tag: "Sağlık" },
];

const FAQ = [
  { q: "Toy Poodle ile Minyatür Poodle arasındaki fark nedir?", a: "Toy Poodle genellikle 2-4 kg, Minyatür Poodle ise 4-9 kg ağırlığındadır. Her ikisi de zeki, eğitilebilir ve az dökülen tüylere sahiptir." },
  { q: "Poodle'lar için en iyi mama hangisi?", a: "Royal Canin, Pro Plan ve Hill's Science Plan en çok tercih edilen markalar arasındadır. Mama Bul sihirbazımız poodle'ınıza özel öneri sunar." },
  { q: "Poodle'lar ne sıklıkla tıraş yaptırılmalı?", a: "Toy ve Minyatür Poodle'lar ortalama 6-8 haftada bir tıraş gerektirir. Tüyleri sürekli uzadığından düzenli bakım şarttır." },
  { q: "AI asistan gerçek veteriner yerine geçer mi?", a: "Hayır. AI asistanımız genel bilgilendirme sağlar. Acil sağlık durumlarında mutlaka veteriner hekiminize başvurun." },
];

const AGE_GUIDES = {
  yavru: [
    { emoji: "🏠", title: "Eve İlk Geldiğinde Ne Yapmalısınız?",   tag: "Yavru",    min: "5 dk" },
    { emoji: "💉", title: "İlk Aşılar: Takvim ve Öneriler",         tag: "Sağlık",   min: "4 dk" },
    { emoji: "🚽", title: "Tuvalet Eğitimine Başlama Kılavuzu",      tag: "Eğitim",   min: "7 dk" },
  ],
  yetiskin: [
    { emoji: "🥩", title: "Yetişkin Poodle İçin En İyi Mama Markaları", tag: "Beslenme", min: "5 dk" },
    { emoji: "✂️", title: "Evde Tıraş: Adım Adım Eksiksiz Rehber",     tag: "Bakım",    min: "8 dk" },
    { emoji: "🏃", title: "Günlük Egzersiz ve Aktivite Rehberi",        tag: "Aktivite", min: "4 dk" },
  ],
  yasli: [
    { emoji: "🫀", title: "Yaşlı Poodle'da Dikkat Edilmesi Gerekenler", tag: "Sağlık",   min: "6 dk" },
    { emoji: "🦷", title: "Diş ve Ağız Sağlığı Yaşlı Köpeklerde",      tag: "Bakım",    min: "4 dk" },
    { emoji: "🥗", title: "Yaşlı Poodle İçin Beslenme Değişikliği",    tag: "Beslenme", min: "5 dk" },
  ],
};

/* ─── COMPONENT ──────────────────────────────────────── */
export default function YourPoodleHomePage() {
  const [location, navigate] = useLocation();
  const [ageTab, setAgeTab]   = useState<"yavru" | "yetiskin" | "yasli">("yetiskin");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [email, setEmail]     = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isLoggedIn } = useCustomer();

  /* Live products from API — top 8 by newest id */
  const { data: allProducts = [] } = useQuery<YPProduct[]>({
    queryKey: ["/api/yp-products"],
    staleTime: 5 * 60 * 1000,
  });
  const featuredProducts = allProducts.slice(0, 8);

  /* SEO: set title + og:title */
  useEffect(() => {
    document.title = YP_TITLE;
    const setMeta = (attr: string, key: string, val: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
      el.content = val;
    };
    setMeta("property", "og:title", YP_TITLE);
    setMeta("name", "description", YP_DESC);
    setMeta("property", "og:description", YP_DESC);
    setMeta("property", "og:type", "website");
  }, []);

  /* Onboarding drawer: auto-open once on first visit */
  useEffect(() => {
    if (!localStorage.getItem("onboarding_seen")) {
      setDrawerOpen(true);
      localStorage.setItem("onboarding_seen", "true");
    }
  }, []);

  const go = (href: string) => { navigate(href); setDrawerOpen(false); };

  return (
    <div style={{ fontFamily: "'Inter',-apple-system,sans-serif", background: "#fff", minHeight: "100vh", color: "#111" }}>

      {/* ─── CSS ──────────────────────────────────────────── */}
      <style>{`
        /* ── Desktop ≥1024px ── */
        @media (min-width: 1024px) {
          .yph-mobile-only  { display: none !important; }
          .yph-desktop-only { display: flex !important; }
          .yph-btm-nav      { display: none !important; }
          .yph-hero-right   { display: block !important; }
          .yph-hero-grid    { grid-template-columns: 1fr 1fr !important; }
          .yph-grid-4       { grid-template-columns: repeat(4,1fr) !important; }
          .yph-grid-8       { grid-template-columns: repeat(4,1fr) !important; }
          .yph-grid-3r      { grid-template-columns: repeat(3,1fr) !important; }
          .yph-grid-5p      { grid-template-columns: repeat(5,1fr) !important; }
          .yph-guides-grid  { grid-template-columns: 1fr 1fr !important; }
          .yph-ai-grid      { grid-template-columns: 1fr 1fr !important; }
          .yph-faq-grid     { grid-template-columns: 3fr 2fr !important; }
          .yph-footer-grid  { grid-template-columns: 2fr 1fr 1fr 1fr !important; }
        }
        /* ── Tablet 768-1023px ── */
        @media (min-width: 768px) and (max-width: 1023px) {
          .yph-mobile-only  { display: none !important; }
          .yph-desktop-only { display: flex !important; }
          .yph-btm-nav      { display: none !important; }
          .yph-hero-right   { display: block !important; }
          .yph-hero-grid    { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
          .yph-grid-4       { grid-template-columns: repeat(2,1fr) !important; }
          .yph-grid-8       { grid-template-columns: repeat(2,1fr) !important; }
          .yph-grid-3r      { grid-template-columns: repeat(2,1fr) !important; }
          .yph-grid-5p      { grid-template-columns: repeat(3,1fr) !important; }
          .yph-guides-grid  { grid-template-columns: 1fr !important; }
          .yph-ai-grid      { grid-template-columns: 1fr 1fr !important; }
          .yph-faq-grid     { grid-template-columns: 1fr !important; }
          .yph-footer-grid  { grid-template-columns: 1fr 1fr !important; }
          .yph-mama-row     { flex-direction: row !important; }
        }
        /* ── Mobile <768px ── */
        @media (max-width: 767px) {
          .yph-desktop-only { display: none !important; }
          .yph-btm-nav      { display: block !important; }
          .yph-hero-right   { display: none !important; }
          .yph-hero-grid    { grid-template-columns: 1fr !important; }
          .yph-grid-4       { grid-template-columns: repeat(2,1fr) !important; }
          .yph-grid-8       { grid-template-columns: repeat(2,1fr) !important; }
          .yph-grid-3r      { grid-template-columns: 1fr !important; }
          .yph-grid-5p      { grid-template-columns: repeat(2,1fr) !important; }
          .yph-guides-grid  { grid-template-columns: 1fr !important; }
          .yph-ai-grid      { grid-template-columns: 1fr !important; }
          .yph-faq-grid     { grid-template-columns: 1fr !important; }
          .yph-footer-grid  { grid-template-columns: 1fr 1fr !important; }
          .yph-mama-row     { flex-direction: column !important; gap: 20px !important; }
          .yph-page-pad     { padding-bottom: 80px !important; }
        }
      `}</style>

      {/* ─── MOBILE DRAWER ───────────────────────────────── */}
      {drawerOpen && (
        <div onClick={() => setDrawerOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 199, backdropFilter: "blur(2px)" }} />
      )}
      <nav style={{ position: "fixed", top: 0, left: 0, height: "100%", width: 280, background: "#fff", zIndex: 200,
        transform: drawerOpen ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.24s ease",
        boxShadow: "4px 0 28px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 18px 14px", borderBottom: "1px solid #f2f2f2" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src="/yourpoodle-logo.jpg" alt="YourPoodle" style={{ height: 30, width: "auto", objectFit: "contain" }} />
          </div>
          <button onClick={() => setDrawerOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: "#666" }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {[
            { label: "Ana Sayfa",  href: "/" },
            ...NAV,
            { label: "Mama Bul",   href: "/yourpoodle/mama-bul" },
            { label: "Sağlık",     href: "/yourpoodle/saglik" },
            { label: "Bakım",      href: "/yourpoodle/bakim" },
            { label: "Eğitim",     href: "/yourpoodle/egitim" },
            { label: "Topluluk",   href: "/yourpoodle/topluluk" },
            { label: "Poodle'ım",  href: "/yourpoodle/poodle-ekle" },
          ].map(l => (
            <button key={l.href} onClick={() => go(l.href)}
              style={{ display: "block", width: "100%", padding: "13px 20px", fontSize: 15, fontWeight: 600,
                color: location === l.href ? "#7C3AED" : "#222",
                background: location === l.href ? "#F5F0FF" : "transparent",
                border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
              {l.label}
            </button>
          ))}
        </div>
        <div style={{ padding: "16px 18px", borderTop: "1px solid #f2f2f2" }}>
          <button onClick={() => go(isLoggedIn ? "/hesabim" : "/yourpoodle/giris")}
            style={{ width: "100%", height: 46, borderRadius: 12, background: "linear-gradient(135deg,#7C3AED,#A855F7)", border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            {isLoggedIn ? "👤 Hesabım" : "Ücretsiz Başla"}
          </button>
        </div>
      </nav>

      {/* ─── HEADER ──────────────────────────────────────── */}
      <header style={{ background: "#fff", borderBottom: "1px solid #F0F0F0", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", gap: 32, height: 60 }}>

          {/* Logo */}
          <button onClick={() => go("/")} style={{ display: "flex", alignItems: "center", background: "none", border: "none", cursor: "pointer", flexShrink: 0, padding: 0 }}>
            <img src="/yourpoodle-logo.jpg" alt="YourPoodle" style={{ height: 38, width: "auto", objectFit: "contain" }} />
          </button>

          {/* Desktop + Tablet Nav */}
          <nav style={{ display: "flex", gap: 2, flex: 1, overflow: "hidden" }} className="yph-desktop-only">
            {NAV.map(n => (
              <button key={n.href} onClick={() => go(n.href)}
                style={{ padding: "6px 13px", borderRadius: 20, border: "none", fontSize: 13.5, fontWeight: 600,
                  background: location.startsWith(n.href) ? "#F5F3FF" : "transparent",
                  color: location.startsWith(n.href) ? "#7C3AED" : "#555",
                  cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit", transition: "all 0.15s" }}
                onMouseEnter={e => { if (!location.startsWith(n.href)) { e.currentTarget.style.background = "#F9F9F9"; e.currentTarget.style.color = "#333"; } }}
                onMouseLeave={e => { if (!location.startsWith(n.href)) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#555"; } }}>
                {n.label}
              </button>
            ))}
          </nav>

          {/* Desktop + Tablet Actions */}
          <div style={{ display: "flex", gap: 8, flexShrink: 0, alignItems: "center" }} className="yph-desktop-only">
            <button onClick={() => go(isLoggedIn ? "/hesabim" : "/yourpoodle/giris")}
              style={{ padding: "7px 18px", borderRadius: 20, border: "1.5px solid #E5E7EB", background: "#fff", fontSize: 13.5, fontWeight: 700, color: "#555", cursor: "pointer", fontFamily: "inherit" }}>
              {isLoggedIn ? "Hesabım" : "Giriş Yap"}
            </button>
            <button onClick={() => go("/yourpoodle/poodle-ekle")}
              style={{ padding: "7px 18px", borderRadius: 20, border: "none", background: "linear-gradient(135deg,#7C3AED,#A855F7)", fontSize: 13.5, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>
              Ücretsiz Başla
            </button>
          </div>

          {/* Mobile: Hamburger + Giriş Yap */}
          <div className="yph-mobile-only" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => go(isLoggedIn ? "/hesabim" : "/yourpoodle/giris")}
              style={{ padding: "6px 13px", borderRadius: 20, border: "1.5px solid #7C3AED", background: "#F5F0FF", fontSize: 12, fontWeight: 800, color: "#7C3AED", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
              {isLoggedIn ? "Hesabım" : "Giriş Yap"}
            </button>
            <button onClick={() => setDrawerOpen(true)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 6px", fontSize: 22, color: "#333" }}>
              ☰
            </button>
          </div>
        </div>
        {/* NOTE: Horizontal pill nav removed — hamburger + bottom tab bar sufficient on mobile */}
      </header>

      {/* ─── PAGE CONTENT ────────────────────────────────── */}
      <div className="yph-page-pad">

      {/* ─── HERO ────────────────────────────────────────── */}
      <section style={{ background: "#fff", borderBottom: "1px solid #F0F0F0" }}>
        <div className="yph-hero-grid" style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 24px 56px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>

          {/* Left */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#F5F3FF", border: "1px solid #E9D5FF", borderRadius: 20, padding: "5px 14px", marginBottom: 22 }}>
              <span style={{ fontSize: 13 }}>✨</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#7C3AED" }}>🌍 Dünya Geneli Kargo · #1 Poodle Platformu</span>
            </div>

            <h1 style={{ fontSize: "clamp(32px,5vw,50px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-2px", marginBottom: 18, color: "#0F0F0F" }}>
              Toy Poodle'ınız<br />
              <span style={{ background: "linear-gradient(135deg,#7C3AED,#EC4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>için her şey</span><br />
              tek yerde
            </h1>

            <p style={{ fontSize: 16, lineHeight: 1.7, color: "#6B7280", marginBottom: 32, maxWidth: 420 }}>
              Beslenme, bakım, sağlık ve eğitim rehberleri. AI destekli kişisel öneriler. Dünya geneline kargo yapan Poodle uzman platformu.
            </p>

            <div style={{ display: "flex", gap: 12, marginBottom: 40, flexWrap: "wrap" }}>
              <button onClick={() => go("/yourpoodle/mama-bul")}
                style={{ height: 52, padding: "0 28px", borderRadius: 14, border: "none", background: "linear-gradient(135deg,#7C3AED,#A855F7)", color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 24px rgba(124,58,237,0.3)" }}>
                🔍 Mama Bul
              </button>
              <button onClick={() => go("/yourpoodle/rehber")}
                style={{ height: 52, padding: "0 28px", borderRadius: 14, border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                📖 Rehberleri Gör
              </button>
            </div>

            {/* Stats — flex-wrap so they never overflow on mobile */}
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {[["50K+", "Aktif üye"], ["500+", "Rehber"], ["4.9★", "Puan"]].map(([n, l]) => (
                <div key={l} style={{ minWidth: 60 }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#111", letterSpacing: "-0.5px" }}>{n}</div>
                  <div style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 600, marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — hidden on mobile, visible on tablet+ */}
          <div className="yph-hero-right" style={{ position: "relative" }}>
            <div style={{ borderRadius: 28, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.08)", position: "relative", aspectRatio: "4/4.5", background: "#fff" }}>
              <img
                src="/images/poodle-hero_2.jpg"
                alt="Toy Poodle"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
              />
              <div style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                  {["🍽️ Kişisel mama planı", "✂️ Bakım takvimi", "💊 Sağlık takibi"].map(f => (
                    <span key={f} style={{ fontSize: 11, fontWeight: 700, color: "#5B21B6", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)", borderRadius: 20, padding: "5px 11px", border: "1px solid #E9D5FF", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>{f}</span>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ position: "absolute", top: -14, left: -14, background: "#fff", borderRadius: 16, padding: "10px 16px", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 22 }}>🎓</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#111", lineHeight: 1.2 }}>500+ Rehber</div>
                <div style={{ fontSize: 11, color: "#9CA3AF" }}>Uzman içerik</div>
              </div>
            </div>
            <div style={{ position: "absolute", bottom: -14, right: -14, background: "#fff", borderRadius: 16, padding: "10px 16px", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 22 }}>❤️</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#111", lineHeight: 1.2 }}>50K+ Üye</div>
                <div style={{ fontSize: 11, color: "#9CA3AF" }}>Güvenilen platform</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── NE ARIYORSUNUZ ──────────────────────────────── */}
      <section style={{ background: "#fff", padding: "56px 24px", borderTop: "1px solid #F3F4F6" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.5px", marginBottom: 6 }}>Bugün ne arıyorsunuz?</h2>
            <p style={{ fontSize: 14, color: "#6B7280" }}>Poodle'ınız için ihtiyacınız olan konuyu seçin</p>
          </div>
          <div className="yph-grid-8" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
            {NEEDS.map(n => (
              <button key={n.label} onClick={() => go(n.href)}
                style={{ background: n.bg, border: `1.5px solid ${n.color}25`, borderRadius: 18, padding: "20px 12px", cursor: "pointer", textAlign: "center", fontFamily: "inherit", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 12px 28px ${n.color}25`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{n.emoji}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: n.color, marginBottom: 3 }}>{n.label}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>{n.sub}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AI + PROFİL ─────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "56px 24px", borderTop: "1px solid #F3F4F6" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="yph-ai-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

            {/* AI */}
            <div style={{ background: "linear-gradient(135deg,#1E1155 0%,#4C1D95 100%)", borderRadius: 24, padding: 28, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -30, right: -30, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 18 }}>
                <div style={{ width: 50, height: 50, borderRadius: 16, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>🤖</div>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 900, color: "#fff", marginBottom: 5 }}>Poodle AI Asistan</h3>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", margin: 0, lineHeight: 1.5 }}>Sorunuzu yazın, Poodle'ınıza özel yanıt alın</p>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
                {["Kaç gram mama vermeliyim?", "Göz altı neden kızarıyor?", "Yalnız kalınca neden havlıyor?"].map(q => (
                  <button key={q} onClick={() => go("/yourpoodle/ai-asistan")}
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: "11px 16px", textAlign: "left", color: "rgba(255,255,255,0.85)", fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "background 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.14)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}>
                    💬 {q}
                  </button>
                ))}
              </div>
              <button onClick={() => go("/yourpoodle/ai-asistan")}
                style={{ width: "100%", height: 50, borderRadius: 14, background: "#7C3AED", border: "none", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 16px rgba(124,58,237,0.4)" }}>
                AI Asistanı Başlat →
              </button>
            </div>

            {/* Profil */}
            <div style={{ background: "linear-gradient(135deg,#FFF1F2 0%,#FCE7F3 100%)", borderRadius: 24, padding: 28, border: "1.5px solid #FECDD3", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 58, lineHeight: 1, marginBottom: 14 }}>🐩</div>
                <h3 style={{ fontSize: 20, fontWeight: 900, color: "#111", marginBottom: 10 }}>Poodle Profilinizi Oluşturun</h3>
                <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7, marginBottom: 20 }}>
                  Adı, yaşı ve kilosunu girin. Size özel mama önerileri, bakım takvimi ve sağlık hatırlatıcıları alın.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 28 }}>
                  {["🍽️ Kişiselleştirilmiş mama planı", "💊 Aşı ve veteriner takibi", "✂️ Otomatik bakım takvimi"].map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 600, color: "#374151" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#EC4899", flexShrink: 0 }} />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={() => go("/yourpoodle/poodle-ekle")}
                style={{ width: "100%", height: 50, borderRadius: 14, background: "#EC4899", border: "none", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 16px rgba(236,72,153,0.3)" }}>
                Ücretsiz Profil Oluştur →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HIZLI ARAÇLAR ───────────────────────────────── */}
      <section style={{ background: "#fff", padding: "56px 24px", borderTop: "1px solid #F3F4F6" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
            <div>
              <h2 style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.5px", marginBottom: 4 }}>⚡ Hızlı Araçlar</h2>
              <p style={{ fontSize: 14, color: "#6B7280" }}>Poodle bakımını kolaylaştıran ücretsiz hesaplama araçları</p>
            </div>
            <button onClick={() => go("/yourpoodle/bilgi")} style={{ fontSize: 13.5, fontWeight: 700, color: "#7C3AED", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
              Tümünü Gör →
            </button>
          </div>
          <div className="yph-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
            {TOOLS.map(t => (
              <button key={t.label} onClick={() => go("/yourpoodle/bilgi")}
                style={{ background: "#fff", border: "1.5px solid #F3F4F6", borderRadius: 18, padding: "18px 16px", textAlign: "left", cursor: "pointer", fontFamily: "inherit", display: "flex", gap: 12, alignItems: "flex-start", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = t.color; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 20px ${t.color}18`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#F3F4F6"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: `${t.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 21, flexShrink: 0 }}>{t.emoji}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#111", marginBottom: 3, lineHeight: 1.3 }}>{t.label}</div>
                  <div style={{ fontSize: 11.5, color: "#9CA3AF" }}>{t.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── REHBERLER ───────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "56px 24px", borderTop: "1px solid #F3F4F6" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="yph-guides-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>

            {/* En çok okunanlar */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ fontSize: 20, fontWeight: 900 }}>📖 Bu Hafta En Çok Okunan</h2>
                <button onClick={() => go("/yourpoodle/rehber")} style={{ fontSize: 13, fontWeight: 700, color: "#7C3AED", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Tümü →</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { emoji: "🥇", tag: "Beslenme", title: "Toy Poodle İçin En İyi Mama Markaları 2026", min: "5 dk", href: "/yourpoodle/mama-bul" },
                  { emoji: "✂️", tag: "Bakım",    title: "Evde Poodle Tıraşı: Adım Adım Eksiksiz Rehber", min: "8 dk", href: "/yourpoodle/bakim" },
                  { emoji: "👁️", tag: "Sağlık",   title: "Göz Altı Kızarıklığı: Neden Olur, Nasıl Geçer?", min: "4 dk", href: "/yourpoodle/saglik" },
                  { emoji: "🎯", tag: "Eğitim",   title: "2 Haftada Tuvalet Eğitimini Tamamlayın", min: "6 dk", href: "/yourpoodle/egitim" },
                ].map(g => (
                  <button key={g.title} onClick={() => go(g.href)}
                    style={{ display: "flex", gap: 14, alignItems: "center", padding: "14px", background: "#fff", borderRadius: 16, cursor: "pointer", border: "1.5px solid #F3F4F6", fontFamily: "inherit", textAlign: "left", transition: "all 0.2s", width: "100%" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#F5F3FF"; e.currentTarget.style.borderColor = "#E9D5FF"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#F3F4F6"; }}>
                    <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg,#7C3AED,#A855F7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{g.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10.5, fontWeight: 800, color: "#7C3AED", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.05em" }}>{g.tag}</div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111", lineHeight: 1.4 }}>{g.title}</div>
                    </div>
                    <div style={{ fontSize: 11, color: "#9CA3AF", flexShrink: 0 }}>{g.min}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Yaşa göre */}
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 20 }}>🐾 Yaşa Göre Rehber</h2>
              <div style={{ display: "flex", background: "#F3F4F6", borderRadius: 14, padding: 4, marginBottom: 16 }}>
                {(["yavru", "yetiskin", "yasli"] as const).map(tab => (
                  <button key={tab} onClick={() => setAgeTab(tab)}
                    style={{ flex: 1, height: 36, borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700, transition: "all 0.2s",
                      background: ageTab === tab ? "#7C3AED" : "transparent",
                      color: ageTab === tab ? "#fff" : "#6B7280" }}>
                    {tab === "yavru" ? "🍼 Yavru" : tab === "yetiskin" ? "🐩 Yetişkin" : "💜 Yaşlı"}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {AGE_GUIDES[ageTab].map(item => (
                  <button key={item.title} onClick={() => go("/yourpoodle/rehber")}
                    style={{ display: "flex", gap: 14, alignItems: "center", padding: "14px", background: "#fff", borderRadius: 16, cursor: "pointer", border: "1.5px solid #F3F4F6", fontFamily: "inherit", textAlign: "left", transition: "all 0.2s", width: "100%" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#F5F3FF"; e.currentTarget.style.borderColor = "#E9D5FF"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#F3F4F6"; }}>
                    <div style={{ width: 44, height: 44, borderRadius: 14, background: "#EDE9FE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{item.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10.5, fontWeight: 800, color: "#7C3AED", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.05em" }}>{item.tag}</div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111", lineHeight: 1.4 }}>{item.title}</div>
                    </div>
                    <div style={{ fontSize: 11, color: "#9CA3AF", flexShrink: 0 }}>{item.min}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MAMA BULMA BANNER ───────────────────────────── */}
      <section style={{ background: "#fff", padding: "56px 24px", borderTop: "1px solid #F3F4F6" }}>
        <div className="yph-mama-row" style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 40 }}>
          <div style={{ fontSize: 64, lineHeight: 1, flexShrink: 0 }}>🔍</div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>Poodle'ınıza özel en iyi mamayı bulun</h2>
            <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6, marginBottom: 14 }}>11 soruluk akıllı sihirbaz. Yaşına, kilosuna, alerjisine ve bütçenize göre en uygun 3 mama önerisi.</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Yaşa göre", "Alerji kontrolü", "Bütçe seçimi", "Marka karşılaştırma", "Besin analizi"].map(t => (
                <span key={t} style={{ fontSize: 12, fontWeight: 700, color: "#92400E", background: "#FDE68A", borderRadius: 20, padding: "4px 11px" }}>{t}</span>
              ))}
            </div>
          </div>
          <button onClick={() => go("/yourpoodle/mama-bul")}
            style={{ flexShrink: 0, height: 54, padding: "0 32px", borderRadius: 16, background: "#D97706", border: "none", color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 24px rgba(217,119,6,0.3)", whiteSpace: "nowrap" }}>
            Sihirbazı Başlat →
          </button>
        </div>
      </section>

      {/* ─── ÜRÜNLER (static curated) ────────────────────── */}
      <section style={{ background: "#fff", padding: "56px 24px", borderTop: "1px solid #F3F4F6" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.5px", marginBottom: 4 }}>🛍️ Poodle Sahiplerinin Tercihleri</h2>
              <p style={{ fontSize: 14, color: "#6B7280" }}>Toy & Miniature Poodle için önerilen ürünler</p>
            </div>
            <button onClick={() => go("/yourpoodle/magaza")} style={{ fontSize: 13.5, fontWeight: 700, color: "#7C3AED", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
              Tümünü Gör →
            </button>
          </div>
          <div className="yph-grid-5p" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
            {featuredProducts.length === 0
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} style={{ background: "#E8E4FF", borderRadius: 16, aspectRatio: "1", animation: "pulse 1.5s ease-in-out infinite" }} />
                ))
              : featuredProducts.map(p => (
              <button key={p.id} onClick={() => go(`/yourpoodle/urun/${p.id}`)}
                style={{ background: "#fff", borderRadius: 16, overflow: "hidden", cursor: "pointer", display: "flex", flexDirection: "column", border: "1.5px solid #F3F4F6", padding: 0, fontFamily: "inherit", textAlign: "left", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
                <div style={{ background: "#fff", aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: 8 }}>
                  {p.img
                    ? <>
                        <img
                          src={p.img}
                          alt={p.name}
                          style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
                          onError={e => {
                            e.currentTarget.style.display = "none";
                            const sib = e.currentTarget.nextElementSibling as HTMLElement | null;
                            if (sib) sib.style.display = "flex";
                          }}
                        />
                        <span style={{ fontSize: 32, display: "none", width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}>🐾</span>
                      </>
                    : <span style={{ fontSize: 32, display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}>🐾</span>
                  }
                </div>
                <div style={{ padding: "10px 12px 14px" }}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: "#111", lineHeight: 1.35, marginBottom: 6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any, overflow: "hidden" }}>{p.name}</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: "#7C3AED" }}>₺{Number(p.price).toLocaleString("tr-TR")}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── YORUMLAR ────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "56px 24px", borderTop: "1px solid #F3F4F6" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.5px", marginBottom: 6 }}>Poodle sahipleri ne diyor?</h2>
            <p style={{ fontSize: 14, color: "#6B7280" }}>50.000+ üyenin güvendiği platform</p>
          </div>
          <div className="yph-grid-3r" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
            {REVIEWS.map(r => (
              <div key={r.name} style={{ background: "#fff", borderRadius: 20, padding: 24, border: "1.5px solid #F3F4F6" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
                  {Array.from({ length: r.stars }).map((_, i) => <span key={i} style={{ color: "#FBBF24", fontSize: 16 }}>★</span>)}
                </div>
                <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, marginBottom: 18 }}>"{r.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#A855F7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff" }}>{r.avatar}</div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: "#111" }}>{r.name}</div>
                    <span style={{ fontSize: 11, color: "#7C3AED", background: "#F5F3FF", borderRadius: 20, padding: "2px 8px", display: "inline-block", marginTop: 2, fontWeight: 700 }}>{r.tag}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SSS + EMAIL ─────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "56px 24px", borderTop: "1px solid #F3F4F6" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="yph-faq-grid" style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 56 }}>
            <div>
              <h2 style={{ fontSize: 26, fontWeight: 900, marginBottom: 20 }}>Sık Sorulan Sorular</h2>
              {FAQ.map((item, i) => (
                <div key={i} style={{ borderBottom: "1px solid #E5E7EB" }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "17px 0", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left", gap: 16 }}>
                    <span style={{ fontSize: 14.5, fontWeight: 700, color: "#111" }}>{item.q}</span>
                    <span style={{ fontSize: 20, color: "#7C3AED", flexShrink: 0, lineHeight: 1 }}>{openFaq === i ? "−" : "+"}</span>
                  </button>
                  {openFaq === i && (
                    <div style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7, paddingBottom: 16 }}>{item.a}</div>
                  )}
                </div>
              ))}
            </div>

            <div>
              <div style={{ background: "linear-gradient(135deg,#7C3AED,#A855F7)", borderRadius: 24, padding: 28, textAlign: "center", position: "sticky", top: 80 }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>📬</div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: "#fff", marginBottom: 8 }}>Haftalık Poodle İpuçları</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.6, marginBottom: 20 }}>
                  Her hafta uzman bakım önerileri, yeni araçlar ve topluluk haberleri.
                </p>
                {emailSent ? (
                  <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: 14, fontSize: 14, fontWeight: 700, color: "#fff" }}>
                    ✓ Teşekkürler! Sizi ekledik.
                  </div>
                ) : (
                  <>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="E-posta adresiniz"
                      style={{ width: "100%", height: 48, borderRadius: 12, border: "none", padding: "0 16px", fontSize: 14, marginBottom: 10, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
                    <button onClick={async () => {
                        if (!email.includes("@")) return;
                        try { await fetch("/api/yp/email-subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) }); } catch {}
                        setEmailSent(true);
                      }}
                      style={{ width: "100%", height: 48, borderRadius: 12, background: "#fff", border: "none", fontSize: 14, fontWeight: 800, color: "#7C3AED", cursor: "pointer", fontFamily: "inherit" }}>
                      Abone Ol — Ücretsiz
                    </button>
                  </>
                )}
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 10 }}>İstediğiniz zaman çıkabilirsiniz.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      </div>{/* yph-page-pad */}

      {/* ─── MOBILE BOTTOM NAV ───────────────────────────── */}
      <div className="yph-btm-nav">
        <YPBottomNav />
      </div>

    </div>
  );
}
