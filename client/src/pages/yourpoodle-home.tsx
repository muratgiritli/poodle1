import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useCustomer } from "@/contexts/CustomerContext";
import YPBottomNav from "@/components/YPBottomNav";
import { PawPrint, Utensils, BookOpen, Wrench, Bot, ShoppingBag, Search, Heart, ShoppingCart, ChevronDown, User, X } from "lucide-react";

/* ─── SEO ─────────────────────────────────────────────── */
const YP_TITLE = "YourPoodle — Toy Poodle Bakım, Mama ve Eğitim Platformu";
const YP_DESC  = "Toy Poodle sahipleri için dünya genelinde kargo yapan e-ticaret ve uzman içerik platformu. AI destekli mama önerisi, veteriner onaylı rehberler ve aktif topluluk.";

/* ─── DATA ───────────────────────────────────────────── */
const NAV = [
  { label: "Ana Sayfa",  href: "/yourpoodle",              Icon: PawPrint    },
  { label: "Mama Bul",   href: "/yourpoodle/mama-bul",     Icon: Utensils    },
  { label: "Rehber",     href: "/yourpoodle/rehber",       Icon: BookOpen    },
  { label: "Araçlar",    href: "/yourpoodle/bilgi",        Icon: Wrench      },
  { label: "AI Asistan", href: "/yourpoodle/ai-asistan",   Icon: Bot         },
  { label: "Mağaza",     href: "/yourpoodle/magaza",       Icon: ShoppingBag },
];

interface YPProduct {
  id: number; name: string; price: number; originalPrice?: number;
  img?: string; stock: number; isActive: boolean;
  mamaType?: string; subcategory?: string; brandName?: string;
}

const NEEDS = [
  { emoji: "🍖", label: "Doğru Mama",         sub: "Yaş & kiloya göre en uygun mamayı bulun",          color: "#F97316", bg: "#FFF7ED", href: "/yourpoodle/mama-bul" },
  { emoji: "🚽", label: "Tuvalet Eğitimi",     sub: "Adım adım tuvalet eğitimi rehberi",                color: "#10B981", bg: "#ECFDF5", href: "/yourpoodle/egitim" },
  { emoji: "👁️", label: "Göz Yaşı",            sub: "Nedenleri, tedavi & bakım önerileri",              color: "#EC4899", bg: "#FDF2F8", href: "/yourpoodle/saglik" },
  { emoji: "🪮", label: "Tüy & Bakım",         sub: "Tüy bakımı, tarama & profesyonel ipuçları",        color: "#8B5CF6", bg: "#F5F3FF", href: "/yourpoodle/bakim" },
  { emoji: "🔊", label: "Havlama",             sub: "Havlama nedenleri & eğitim teknikleri",            color: "#F59E0B", bg: "#FFFBEB", href: "/yourpoodle/egitim" },
  { emoji: "🏠", label: "Yalnız Kalma",        sub: "Ayrılık kaygısı ve çözüm önerileri",              color: "#3B82F6", bg: "#EFF6FF", href: "/yourpoodle/egitim" },
  { emoji: "🍼", label: "Yavru Bakımı",        sub: "0–6 ay arası yavru bakım rehberi",                color: "#06B6D4", bg: "#ECFEFF", href: "/yourpoodle/rehber" },
  { emoji: "🩺", label: "Sağlık Belirtileri",  sub: "Belirtileri kontrol edin, ne yapmanız gerektiğini öğrenin", color: "#EF4444", bg: "#FEF2F2", href: "/yourpoodle/saglik" },
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
  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch]   = useState("");
  const [cartCount, setCartCount] = useState(0);
  const profileRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn, customer } = useCustomer();
  const initials = (customer as any)?.name?.slice(0, 1).toUpperCase() || "";

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

  /* Cart badge — same key as yp-magaza/yp-sepet */
  useEffect(() => {
    const read = () => {
      try {
        const c = JSON.parse(localStorage.getItem("yp_cart_items") || "[]");
        setCartCount(Array.isArray(c) ? c.reduce((s: number, i: any) => s + (i.qty || 0), 0) : 0);
      } catch { setCartCount(0); }
    };
    read();
    window.addEventListener("storage", read);
    const timer = setInterval(read, 500); // same-tab updates
    return () => { window.removeEventListener("storage", read); clearInterval(timer); };
  }, []);

  /* Close profile dropdown on outside click */
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const go = (href: string) => { navigate(href); setDrawerOpen(false); };
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) { navigate(`/yourpoodle/magaza?q=${encodeURIComponent(search.trim())}`); setSearch(""); }
  };

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
          .yph-home-header { padding: 0 !important; }
          .yph-home-pill   { border-radius: 0 !important; box-shadow: none !important; padding: 8px 12px !important; height: 58px; border-bottom: 1px solid #EDE9FE; }
          .yph-desktop-only { display: none !important; }
          .yph-btm-nav      { display: block !important; }
          .yph-hero-right   { display: none !important; }
          .yph-hero-grid    { grid-template-columns: 1fr !important; }
          .yph-hero-pad     { padding: 36px 20px 32px !important; }
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
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 299, backdropFilter: "blur(2px)" }} />
      )}
      <nav style={{ position: "fixed", top: 0, left: 0, height: "100%", width: 280, background: "#fff", zIndex: 300,
        transform: drawerOpen ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.24s ease",
        boxShadow: "4px 0 28px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 18px 14px", borderBottom: "1px solid #f2f2f2" }}>
          <span style={{ fontFamily: "'Pacifico', cursive", fontSize: 20, color: "#6B21A8" }}>YourPoodle 🐾</span>
          <button onClick={() => setDrawerOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32 }}>
            <X size={20} color="#666" />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {[
            ...NAV,
            { label: "Sağlık",     href: "/yourpoodle/saglik",   Icon: Bot },
            { label: "Bakım",      href: "/yourpoodle/bakim",    Icon: Bot },
            { label: "Eğitim",     href: "/yourpoodle/egitim",   Icon: Bot },
            { label: "Topluluk",   href: "/yourpoodle/topluluk", Icon: Bot },
            ...(isLoggedIn ? [{ label: "Siparişlerim", href: "/yourpoodle/siparislerim", Icon: Bot }] : []),
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

      {/* ─── HEADER ───────────────────────────────────────── */}
      <div style={{ position: "sticky", top: 0, zIndex: 200 }}>

        {/* Duyuru çubuğu — sadece desktop */}
        <div className="yph-desktop-only" style={{ background: "#7022C4", color: "#fff", textAlign: "center", padding: "9px 20px", fontSize: 13.5, fontWeight: 500 }}>
          Toy Poodle dünyasının adresi — 500₺ üzeri ücretsiz kargo 🚚
        </div>

        {/* Ana satır */}
        <div style={{ background: "#fff", borderBottom: "1px solid #F3F4F6" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", padding: "14px 40px", gap: 24 }} className="yph-desktop-only">
            {/* Logo */}
            <button onClick={() => go("/yourpoodle")} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", flexShrink: 0, padding: 0 }}>
              <span style={{ fontFamily: "'Pacifico', cursive", fontSize: 28, color: "#111", lineHeight: 1 }}>YourPoodle</span>
              <span style={{ fontSize: 20 }}>🐾</span>
            </button>

            {/* Arama */}
            <form onSubmit={handleSearch} style={{ flex: 1, position: "relative" }}>
              <Search size={17} color="#9CA3AF" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Mama, aksesuar veya rehber ara..."
                style={{ width: "100%", height: 46, borderRadius: 9999, border: "none", background: "#F3F4F6", paddingLeft: 50, paddingRight: 20, fontSize: 14, color: "#374151", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
            </form>

            {/* Sağ aksiyonlar */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
              {isLoggedIn ? (
                <div ref={profileRef} style={{ position: "relative" }}>
                  <button onClick={() => setProfileOpen(o => !o)}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px 4px 4px", borderRadius: 9999, border: "1.5px solid #E5E7EB", background: "#fff", cursor: "pointer" }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#7022C4,#A855F7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>{initials || "🐾"}</span>
                    </div>
                    <ChevronDown size={13} color="#9CA3AF" strokeWidth={2} style={{ transform: profileOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
                  </button>
                  {profileOpen && (
                    <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "#fff", borderRadius: 16, boxShadow: "0 8px 32px rgba(112,34,196,0.18)", border: "1px solid #EDE9FE", minWidth: 180, zIndex: 300, overflow: "hidden" }}>
                      {[
                        { label: "👤 Profilim",       href: "/hesabim" },
                        { label: "📦 Siparişlerim",   href: "/yourpoodle/siparislerim" },
                        { label: "🐾 Köpek Profilim", href: "/yourpoodle/p/olustur" },
                        { label: "❤️ Favorilerim",    href: "/favoriler" },
                        { label: "🚪 Çıkış Yap",      href: "/giris?logout=1" },
                      ].map(({ label, href }) => (
                        <button key={href} onClick={() => { go(href); setProfileOpen(false); }}
                          style={{ display: "block", width: "100%", padding: "11px 18px", fontSize: 13, fontWeight: 600, color: "#374151", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "#F5F0FF")}
                          onMouseLeave={e => (e.currentTarget.style.background = "none")}>
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button onClick={() => go("/yourpoodle/giris")}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#374151", fontFamily: "inherit", padding: "0 4px", whiteSpace: "nowrap" }}>
                    Giriş Yap
                  </button>
                  <button onClick={() => go("/yourpoodle/giris")}
                    style={{ padding: "10px 22px", borderRadius: 9999, border: "none", background: "#7022C4", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                    Üye Ol
                  </button>
                </>
              )}
              <button onClick={() => go("/favoriler")}
                style={{ width: 42, height: 42, borderRadius: "50%", border: "1.5px solid #E5E7EB", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                <Heart size={18} color="#374151" strokeWidth={1.8} />
              </button>
              <button onClick={() => go("/yourpoodle/sepet")}
                style={{ width: 42, height: 42, borderRadius: "50%", border: "1.5px solid #E5E7EB", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, position: "relative" }}>
                <ShoppingCart size={18} color="#374151" strokeWidth={1.8} />
                {cartCount > 0 && (
                  <span style={{ position: "absolute", top: -3, right: -3, background: "#7022C4", color: "#fff", fontSize: 9, fontWeight: 800, width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff" }}>
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile satır */}
          <div className="yph-mobile-only" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", height: 58 }}>
            <button onClick={() => go("/yourpoodle")} style={{ display: "flex", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              <span style={{ fontFamily: "'Pacifico', cursive", fontSize: 17, color: "#6B21A8" }}>YourPoodle 🐾</span>
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button onClick={() => go(isLoggedIn ? "/hesabim" : "/yourpoodle/giris")}
                style={{ padding: "5px 11px", borderRadius: 20, border: "1.5px solid #7C3AED", background: "#F5F0FF", color: "#7C3AED", fontSize: 11.5, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit" }}>
                {isLoggedIn ? "Hesabım" : "Giriş"}
              </button>
              <button onClick={() => setDrawerOpen(true)}
                style={{ background: "#EDE9FE", border: "none", cursor: "pointer", padding: "5px 8px", fontSize: 18, color: "#7C3AED", borderRadius: 10, lineHeight: 1 }}>
                ☰
              </button>
            </div>
          </div>
        </div>

        {/* Alt nav satırı — sadece desktop */}
        <nav className="yph-desktop-only" style={{ background: "#fff", borderBottom: "1px solid #F3F4F6", padding: "0 40px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "center", alignItems: "center", height: 52 }}>
            {([
              { label: "Mağaza",     href: "/yourpoodle/magaza",    Icon: ShoppingBag },
              { label: "Club",       href: "/yourpoodle/club",       Icon: PawPrint    },
              { label: "AI Asistan", href: "/yourpoodle/ai-asistan", Icon: Bot         },
              { label: "Rehber",     href: "/yourpoodle/rehber",     Icon: BookOpen    },
            ] as const).map(({ label, href, Icon }, i) => {
              const active = href === "/yourpoodle" ? location === "/yourpoodle" : location.startsWith(href);
              return (
                <span key={href} style={{ display: "flex", alignItems: "center" }}>
                  {i > 0 && <span style={{ color: "#D1D5DB", margin: "0 14px", fontSize: 16, userSelect: "none" }}>•</span>}
                  <button onClick={() => go(href)}
                    style={{ display: "flex", alignItems: "center", gap: 7, padding: active ? "7px 18px" : "7px 10px", borderRadius: 9999, background: active ? "#7022C4" : "transparent", border: "none", cursor: "pointer", transition: "background 0.15s", fontFamily: "inherit" }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#F5F0FF"; }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
                    <Icon size={15} color={active ? "#fff" : "#7022C4"} strokeWidth={active ? 2.5 : 2} />
                    <span style={{ fontSize: 14, fontWeight: 700, color: active ? "#fff" : "#111", whiteSpace: "nowrap" }}>{label}</span>
                  </button>
                </span>
              );
            })}
          </div>
        </nav>
      </div>

      {/* ─── PAGE CONTENT ────────────────────────────────── */}
      <div className="yph-page-pad">

      {/* ─── HERO ────────────────────────────────────────── */}
      <section style={{ background: "linear-gradient(160deg, #F5F0FF 0%, #EDE9FE 60%, #F0EAFF 100%)", borderBottom: "1px solid #E8DFFF" }}>
        <div className="yph-hero-grid yph-hero-pad" style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 24px 56px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>

          {/* Left */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.7)", border: "1px solid #E9D5FF", borderRadius: 20, padding: "5px 14px", marginBottom: 22, backdropFilter: "blur(8px)" }}>
              <span style={{ fontSize: 13 }}>✨</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#7C3AED" }}>Dünyanın En Büyük Poodle Platformu</span>
            </div>

            <h1 style={{ fontSize: "clamp(32px,5vw,50px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-2px", marginBottom: 18, color: "#0F0F0F" }}>
              Toy Poodle'ınız<br />
              <span style={{ color: "#7C3AED" }}>için her şey</span><br />
              tek yerde
            </h1>

            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#6B7280", marginBottom: 32, maxWidth: 420 }}>
              Beslenme, bakım, sağlık ve eğitim rehberleri. AI destekli kişisel öneriler. Dünya geneline kargo yapan Poodle uzman platformu.
            </p>

            <div style={{ display: "flex", gap: 12, marginBottom: 0, flexWrap: "wrap" }}>
              <button onClick={() => go("/yourpoodle/mama-bul")}
                style={{ height: 52, padding: "0 28px", borderRadius: 14, border: "none", background: "linear-gradient(135deg,#7C3AED,#A855F7)", color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 24px rgba(124,58,237,0.3)", display: "flex", alignItems: "center", gap: 8 }}>
                🔍 Mama Bul
              </button>
              <button onClick={() => go("/yourpoodle/rehber")}
                style={{ height: 52, padding: "0 28px", borderRadius: 14, border: "1.5px solid #C4B5FD", background: "rgba(255,255,255,0.8)", color: "#7C3AED", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8 }}>
                📖 Rehberleri Gör
              </button>
            </div>
          </div>

          {/* Right — hidden on mobile, visible on tablet+ */}
          <div className="yph-hero-right" style={{ position: "relative" }}>
            <div style={{ borderRadius: 28, overflow: "hidden", boxShadow: "0 16px 48px rgba(109,40,217,0.18)", position: "relative", aspectRatio: "4/4.5", background: "#EDE9FE" }}>
              <img
                src="/images/poodle-hero_2.jpg"
                alt="Toy Poodle"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
              />
            </div>
            {/* Floating badge — AI Asistan (top-right) */}
            <div style={{ position: "absolute", top: 24, right: -20, background: "#fff", borderRadius: 16, padding: "10px 16px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", gap: 10, minWidth: 170 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#EDE9FE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🤖</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#111", lineHeight: 1.2 }}>AI Asistan</div>
                <div style={{ fontSize: 11, color: "#9CA3AF" }}>7/24 size özel destek</div>
              </div>
            </div>
            {/* Floating badge — Kişiselleştirilmiş Öneriler (mid-left) */}
            <div style={{ position: "absolute", top: "36%", left: -24, background: "#fff", borderRadius: 16, padding: "10px 16px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", gap: 10, minWidth: 190 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>❤️</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#111", lineHeight: 1.2 }}>Kişiselleştirilmiş Öneriler</div>
                <div style={{ fontSize: 11, color: "#9CA3AF" }}>Poodle'ınıza özel içerik ve ürün önerileri</div>
              </div>
            </div>
            {/* Floating badge — Dünya Geneli Kargo (bottom-right) */}
            <div style={{ position: "absolute", bottom: 32, right: -20, background: "#fff", borderRadius: 16, padding: "10px 16px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", gap: 10, minWidth: 170 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🌍</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#111", lineHeight: 1.2 }}>Dünya Geneli Kargo</div>
                <div style={{ fontSize: 11, color: "#9CA3AF" }}>Hızlı ve güvenilir teslimat</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HIZLI LİNKLER + STATS ───────────────────────── */}
      <section style={{ background: "#fff", borderBottom: "1px solid #F3F4F6" }}>
        {/* 5 hızlı link kartı */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 0" }}>
          <div className="yph-grid-5p" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
            {[
              { emoji: "🍽️", label: "Mama Bul",       sub: "Poodle'ınıza en uygun mamayı bulun",       href: "/yourpoodle/mama-bul"  },
              { emoji: "📖", label: "Rehberler",       sub: "Uzman rehberler ve ipuçları",               href: "/yourpoodle/rehber"     },
              { emoji: "✂️", label: "Bakım Araçları",  sub: "Tüy bakımı ve hijyen araçları",            href: "/yourpoodle/bakim"      },
              { emoji: "🩺", label: "Sağlık Takibi",   sub: "Aşı, kontrol ve sağlık takip rehberi",     href: "/yourpoodle/saglik"     },
              { emoji: "👥", label: "Topluluk",         sub: "Poodle severlerle buluşun",                href: "/yourpoodle/topluluk"   },
            ].map(item => (
              <button key={item.label} onClick={() => go(item.href)}
                style={{ background: "#fff", border: "1.5px solid #F3F4F6", borderRadius: 18, padding: "18px 16px", textAlign: "left", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", display: "flex", flexDirection: "column", gap: 10 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#C4B5FD"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(124,58,237,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#F3F4F6"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: "#F5F0FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{item.emoji}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#111", marginBottom: 3 }}>{item.label}</div>
                  <div style={{ fontSize: 11.5, color: "#9CA3AF", lineHeight: 1.4 }}>{item.sub}</div>
                </div>
                <div style={{ marginTop: "auto", fontSize: 14, color: "#7C3AED", fontWeight: 700 }}>→</div>
              </button>
            ))}
          </div>
        </div>

        {/* Stats şeridi */}
        <div className="yph-desktop-only" style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
          <div style={{ background: "#F9F8FF", borderRadius: 20, padding: "28px 32px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <p style={{ fontSize: 18, fontWeight: 900, color: "#111", margin: "0 0 2px" }}>Binlerce Poodle sahibi bize güveniyor 💜</p>
            </div>
            <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
              {[["50K+", "Aktif Üye"], ["500+", "Uzman Rehber"], ["4.9", "Ortalama Puan"], ["100+", "Ülkeye Kargo"]].map(([n, l]) => (
                <div key={l} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: "#7C3AED", letterSpacing: "-0.5px" }}>{n}</div>
                  <div style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 600, marginTop: 2, whiteSpace: "nowrap" }}>{l}</div>
                </div>
              ))}
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
          <div className="yph-grid-8" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
            {NEEDS.map(n => (
              <button key={n.label} onClick={() => go(n.href)}
                style={{ background: n.bg, border: `1.5px solid ${n.color}20`, borderRadius: 20, padding: "22px 16px 16px", cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "all 0.2s", position: "relative", display: "flex", flexDirection: "column" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 16px 32px ${n.color}22`; e.currentTarget.style.borderColor = `${n.color}50`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = `${n.color}20`; }}>
                <div style={{ fontSize: 36, marginBottom: 12, lineHeight: 1 }}>{n.emoji}</div>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: n.color, marginBottom: 4 }}>{n.label}</div>
                <div style={{ fontSize: 11.5, color: "#6B7280", fontWeight: 500, lineHeight: 1.4, flex: 1 }}>{n.sub}</div>
                <div style={{
                  marginTop: 14, width: 28, height: 28, borderRadius: "50%",
                  background: `${n.color}18`, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, color: n.color, fontWeight: 800,
                }}>→</div>
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
            <div style={{ background: "linear-gradient(145deg,#2D1B69 0%,#1a0e4f 55%,#1A0F3C 100%)", borderRadius: 24, padding: 28, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              {/* Decorative sparkles */}
              <div style={{ position: "absolute", top: -24, right: -24, width: 120, height: 120, borderRadius: "50%", background: "rgba(139,92,246,0.18)" }} />
              <div style={{ position: "absolute", bottom: 60, left: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(139,92,246,0.1)" }} />
              <span style={{ position: "absolute", top: 20, right: 52, fontSize: 14, opacity: 0.5 }}>✦</span>
              <span style={{ position: "absolute", top: 50, right: 28, fontSize: 10, opacity: 0.4 }}>✦</span>
              <span style={{ position: "absolute", bottom: 90, right: 22, fontSize: 12, opacity: 0.35 }}>✦</span>

              {/* Top row: robot + badge + title */}
              <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 20, position: "relative", zIndex: 1 }}>
                <div style={{ width: 64, height: 64, borderRadius: 20, background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, flexShrink: 0 }}>🤖</div>
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(139,92,246,0.35)", border: "1px solid rgba(139,92,246,0.5)", borderRadius: 99, padding: "3px 10px", marginBottom: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#A78BFA", display: "inline-block" }} />
                    <span style={{ fontSize: 10, fontWeight: 800, color: "#C4B5FD", letterSpacing: "0.06em" }}>7/24 YANINIZDA</span>
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 900, color: "#fff", margin: 0, lineHeight: 1.2 }}>Poodle AI Asistan</h3>
                  <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.6)", margin: "4px 0 0", lineHeight: 1.4 }}>Sorunuzu yazın, Poodle'ınıza özel anında yanıt alın.</p>
                </div>
              </div>

              {/* Chat bubbles */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20, flex: 1, position: "relative", zIndex: 1 }}>
                {["Kaç gram mama vermeliyim?", "Göz altı neden kızarıyor?", "Yalnız kalınca neden havlıyor?"].map(q => (
                  <button key={q} onClick={() => go("/yourpoodle/ai-asistan")}
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 16px", textAlign: "left", color: "rgba(255,255,255,0.88)", fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "background 0.15s", display: "flex", alignItems: "center", gap: 10 }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.13)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(139,92,246,0.35)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14 }}>💬</div>
                    {q}
                    <span style={{ marginLeft: "auto", color: "rgba(255,255,255,0.35)", fontSize: 16 }}>›</span>
                  </button>
                ))}
              </div>

              <button onClick={() => go("/yourpoodle/ai-asistan")}
                style={{ width: "100%", height: 52, borderRadius: 14, background: "linear-gradient(135deg,#7C3AED,#9B59D9)", border: "none", color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 6px 20px rgba(124,58,237,0.45)", position: "relative", zIndex: 1 }}>
                AI Asistana Sor →
              </button>
            </div>

            {/* Profil */}
            <div style={{ background: "#FFF0F5", borderRadius: 24, padding: 28, border: "1.5px solid #FECDD3", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
              {/* Badge + poodle image row */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#FCE7F3", border: "1px solid #F9A8D4", borderRadius: 99, padding: "3px 12px", marginBottom: 12 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: "#BE185D", letterSpacing: "0.05em" }}>KİŞİSELLEŞTİRİN</span>
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 900, color: "#111", marginBottom: 6, lineHeight: 1.2 }}>
                    Poodle <span style={{ color: "#EC4899" }}>Profilinizi</span><br />Oluşturun
                  </h3>
                  <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.65, marginBottom: 0 }}>
                    Adı, yaşı ve kilosunu girin.<br />Size özel mama önerileri, bakım takvimi ve sağlık hatırlatıcıları alın.
                  </p>
                </div>
                <div style={{ fontSize: 72, lineHeight: 1, flexShrink: 0, marginLeft: 8, marginTop: -4 }}>🐩</div>
              </div>

              {/* Feature list */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                {[
                  { icon: "🥛", label: "Kişiselleştirilmiş mama planı", sub: "Poodle'ınızın ihtiyacına özel öneriler" },
                  { icon: "💉", label: "Aşı ve veteriner takibi",       sub: "Aşı takvimi ve randevu hatırlatıcıları" },
                  { icon: "✂️", label: "Otomatik bakım takvimi",        sub: "Tarama, tırnak kesimi ve daha fazlası" },
                ].map(f => (
                  <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FCE7F3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{f.icon}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#111", lineHeight: 1.2 }}>{f.label}</div>
                      <div style={{ fontSize: 11.5, color: "#9CA3AF" }}>{f.sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Inline mini inputs */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
                {[{ label: "Adı", placeholder: "Örn: Max" }, { label: "Yaşı", placeholder: "Örn: 2 Yıl" }, { label: "Kilosu", placeholder: "Örn: 4.5 kg" }].map(f => (
                  <div key={f.label}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", marginBottom: 4 }}>{f.label}</div>
                    <input
                      readOnly
                      placeholder={f.placeholder}
                      onClick={() => go("/yourpoodle/giris")}
                      style={{ width: "100%", height: 38, borderRadius: 10, border: "1.5px solid #FECDD3", background: "#fff", padding: "0 10px", fontSize: 12, color: "#374151", fontFamily: "inherit", cursor: "pointer", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                ))}
              </div>

              <button onClick={() => go("/yourpoodle/giris")}
                style={{ width: "100%", height: 52, borderRadius: 14, background: "linear-gradient(135deg,#F14A89,#EC4899)", border: "none", color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 6px 20px rgba(236,72,153,0.32)" }}>
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
      <section className="yph-desktop-only" style={{ background: "#fff", padding: "56px 24px", borderTop: "1px solid #F3F4F6" }}>
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

      {/* ─── GÜVEN ŞERIDI ────────────────────────────────── */}
      <section style={{ background: "#F9F9FC", padding: "28px 24px", borderTop: "1px solid #F0EEF8" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="yph-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
            {[
              { icon: "🛡️", label: "Güvenilir Bilgi",   sub: "Veteriner onaylı içerikler ve uzman yazarlar",  color: "#7C3AED" },
              { icon: "🔒", label: "%100 Güvenli",       sub: "Kişisel verileriniz 256-bit SSL ile korunur",   color: "#2563EB" },
              { icon: "🐩", label: "Poodle Odaklı",      sub: "Sadece Poodle'lara özel içerikler ve çözümler", color: "#EC4899" },
              { icon: "🎧", label: "7/24 Destek",        sub: "AI Asistan ve uzman ekip her zaman yanınızda",  color: "#059669" },
            ].map(t => (
              <div key={t.label} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: `${t.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{t.icon}</div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: "#111", marginBottom: 3 }}>{t.label}</div>
                  <div style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 1.5 }}>{t.sub}</div>
                </div>
              </div>
            ))}
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
