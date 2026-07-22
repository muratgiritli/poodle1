import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useCustomer } from "@/contexts/CustomerContext";
import YPBottomNav from "@/components/YPBottomNav";
import { Search, Bell, ShoppingCart, X, ChevronDown, Heart, ShoppingBag, BookOpen, Bot, PawPrint, Utensils, Wrench } from "lucide-react";

/* ─── SEO ──────────────────────────────────────────── */
const YP_TITLE = "YourPoodle — Toy Poodle Bakım, Mama ve Eğitim Platformu";
const YP_DESC  = "Toy Poodle sahipleri için dünya genelinde kargo yapan e-ticaret ve uzman içerik platformu. AI destekli mama önerisi, veteriner onaylı rehberler ve aktif topluluk.";

/* ─── COLORS ───────────────────────────────────────── */
const C = {
  purple: "#7C3AED",
  darkPurple: "#2E1760",
  lightPurple: "#F3EEFF",
  pink: "#EC4899",
  bg: "#FFFFFF",
  softBg: "#FAF9FC",
  text: "#171717",
  secondary: "#777681",
  border: "#ECE9F2",
  green: "#22C55E",
  orange: "#F59E0B",
};

/* ─── DATA ─────────────────────────────────────────── */
const NAV_DRAWER = [
  { label: "Ana Sayfa",   href: "/yourpoodle"              },
  { label: "Mama Bul",    href: "/yourpoodle/mama-bul"     },
  { label: "Rehber",      href: "/yourpoodle/rehber"       },
  { label: "AI Asistan",  href: "/yourpoodle/ai-asistan"   },
  { label: "Araçlar",     href: "/yourpoodle/bilgi"        },
  { label: "Mağaza",      href: "/yourpoodle/magaza"       },
  { label: "Sağlık",      href: "/yourpoodle/saglik"       },
  { label: "Bakım",       href: "/yourpoodle/bakim"        },
  { label: "Eğitim",      href: "/yourpoodle/egitim"       },
  { label: "Topluluk",    href: "/yourpoodle/topluluk"     },
];

const SHORTCUTS = [
  { emoji: "🍽️", label: "Mama Bul",       sub: "Poodle'ınıza en uygun mamayı bulun",  href: "/yourpoodle/mama-bul",   bg: "#F3EEFF", color: C.purple },
  { emoji: "📖", label: "Rehberler",       sub: "Uzman içerikler ve ipuçları",          href: "/yourpoodle/rehber",     bg: "#EFF6FF", color: "#2563EB" },
  { emoji: "🤖", label: "AI Asistan",      sub: "7/24 akıllı destek alın",              href: "/yourpoodle/ai-asistan", bg: "#F0FDF4", color: "#16A34A" },
  { emoji: "✂️", label: "Bakım Araçları",  sub: "Tüy bakım ve hijyen ürünleri",         href: "/yourpoodle/bakim",      bg: "#FFF7ED", color: "#EA580C" },
  { emoji: "👥", label: "Topluluk",         sub: "Poodle severlerle buluşun",            href: "/yourpoodle/topluluk",   bg: "#FDF2F8", color: C.pink   },
];

const ARTICLES = [
  { cat: "BESLENME", catColor: "#EA580C", catBg: "#FFF7ED", title: "Toy Poodle İçin En İyi Mama Markaları 2026", min: "5 dk okuma", img: "", emoji: "🥣", gradient: "linear-gradient(145deg,#FED7AA,#FDE68A)" },
  { cat: "BAKIM",    catColor: "#7C3AED", catBg: "#F3EEFF", title: "Evde Poodle Tıraşı: Adım Adım Rehber",       min: "8 dk okuma", img: "", emoji: "🐩", gradient: "linear-gradient(145deg,#DDD6FE,#C4B5FD)" },
  { cat: "EĞİTİM",  catColor: "#16A34A", catBg: "#F0FDF4", title: "2 Haftada Tuvalet Eğitimini Tamamlayın",      min: "6 dk okuma", img: "", emoji: "🎓", gradient: "linear-gradient(145deg,#BBF7D0,#6EE7B7)" },
  { cat: "SAĞLIK",  catColor: "#DC2626", catBg: "#FEF2F2", title: "Göz Altı Kızarıklığı: Neden Olur?",          min: "4 dk okuma", img: "", emoji: "👁️", gradient: "linear-gradient(145deg,#FECACA,#FCA5A5)" },
];

const TOOLS = [
  { emoji: "🍽️", label: "Mama Hesaplama",  desc: "Günlük gram miktarı",  bg: "#F3EEFF", color: C.purple },
  { emoji: "⚖️", label: "İdeal Kilo",       desc: "Kilo kontrolü",         bg: "#EFF6FF", color: "#2563EB" },
  { emoji: "🐾", label: "Yaş Hesaplama",    desc: "İnsan yaşı eşdeğeri",  bg: "#F0FDF4", color: "#16A34A" },
  { emoji: "💧", label: "Su İhtiyacı",      desc: "Günlük ml miktarı",    bg: "#ECFEFF", color: "#0891B2" },
  { emoji: "✂️", label: "Bakım Takvimi",    desc: "Tıraş zamanı",         bg: "#FFF7ED", color: "#EA580C" },
  { emoji: "🚫", label: "Yasak Yiyecekler", desc: "Tehlikeli besinler",   bg: "#FEF2F2", color: "#DC2626" },
  { emoji: "💊", label: "Belirti Rehberi",  desc: "Semptom kontrolü",     bg: "#F5F3FF", color: C.purple  },
  { emoji: "💉", label: "Aşı Takvimi",      desc: "Hatırlatma sistemi",   bg: "#FDF2F8", color: C.pink    },
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

interface YPProduct {
  id: number; name: string; price: number; originalPrice?: number;
  img?: string; stock: number; isActive: boolean;
}

/* ─── COMPONENT ─────────────────────────────────────── */
export default function YourPoodleHomePage() {
  const [location, navigate] = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const profileRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn, customer } = useCustomer();
  const initials = (customer as any)?.name?.slice(0, 1).toUpperCase() || "";

  const { data: allProducts = [] } = useQuery<YPProduct[]>({
    queryKey: ["/api/yp-products"],
    staleTime: 5 * 60 * 1000,
  });
  const featuredProducts = allProducts.slice(0, 8);

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

  useEffect(() => {
    const read = () => {
      try {
        const c = JSON.parse(localStorage.getItem("yp_cart_items") || "[]");
        setCartCount(Array.isArray(c) ? c.reduce((s: number, i: any) => s + (i.qty || 0), 0) : 0);
      } catch { setCartCount(0); }
    };
    read();
    window.addEventListener("storage", read);
    const timer = setInterval(read, 500);
    return () => { window.removeEventListener("storage", read); clearInterval(timer); };
  }, []);

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
    <div style={{ fontFamily: "'Inter',-apple-system,sans-serif", background: C.bg, minHeight: "100vh", color: C.text }}>

      {/* ─── STYLES ────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=Inter:wght@400;500;600;700;800;900&display=swap');

        .yph-mobile  { display: none !important; }
        .yph-desktop { display: flex !important; }

        @media (max-width: 767px) {
          .yph-mobile  { display: flex !important; }
          .yph-desktop { display: none !important; }
          .yph-btm-nav { display: block !important; }
          .yph-page-pad { padding-bottom: 80px; }
        }
        @media (min-width: 768px) {
          .yph-btm-nav { display: none !important; }
        }

        /* Article swipe cards on mobile */
        .yph-article-scroll {
          display: flex;
          gap: 14px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding: 4px 4px 8px 4px;
        }
        .yph-article-scroll::-webkit-scrollbar { display: none; }
        .yph-article-card {
          flex: 0 0 78vw;
          max-width: 320px;
          scroll-snap-align: start;
        }

        /* Shortcut scroll on mobile */
        .yph-shortcut-scroll {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding: 4px 4px 8px;
        }
        .yph-shortcut-scroll::-webkit-scrollbar { display: none; }

        /* Tools 2-col on mobile, 4-col on desktop */
        .yph-tools-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        @media (min-width: 640px)  { .yph-tools-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1024px) { .yph-tools-grid { grid-template-columns: repeat(4, 1fr); } }

        /* Desktop article grid */
        .yph-article-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        @media (max-width: 1023px) { .yph-article-grid { grid-template-columns: repeat(2, 1fr); } }

        /* Hero grid */
        .yph-hero-grid { display: grid; grid-template-columns: 1fr; gap: 0; }
        @media (min-width: 768px) { .yph-hero-grid { grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; } }

        /* Desktop shortcuts */
        .yph-shortcut-desktop-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 14px;
        }
        @media (max-width: 1023px) { .yph-shortcut-desktop-grid { grid-template-columns: repeat(3, 1fr); } }

        /* Reviews */
        .yph-reviews-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }
        @media (max-width: 767px) { .yph-reviews-grid { grid-template-columns: 1fr; } }
        @media (min-width: 768px) and (max-width: 1023px) { .yph-reviews-grid { grid-template-columns: repeat(2, 1fr); } }

        /* FAQ */
        .yph-faq-grid {
          display: grid;
          grid-template-columns: 3fr 2fr;
          gap: 48px;
        }
        @media (max-width: 767px) { .yph-faq-grid { grid-template-columns: 1fr; } }

        /* Page max width */
        .yph-inner { max-width: 1200px; margin: 0 auto; }

        /* Hero responsive padding */
        .yph-hero-pad { padding: 20px 20px 28px; }
        @media (min-width: 768px) { .yph-hero-pad { padding: 64px 40px 56px; } }

        /* Section padding */
        .yph-section { padding: 32px 20px; }
        @media (min-width: 768px) { .yph-section { padding: 56px 40px; } }

        /* AI section layout */
        .yph-ai-inner {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        @media (min-width: 768px) {
          .yph-ai-inner {
            flex-direction: row;
            align-items: center;
          }
        }
      `}</style>

      {/* ─── MOBILE DRAWER ─────────────────────────────── */}
      {drawerOpen && (
        <div onClick={() => setDrawerOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 299, backdropFilter: "blur(2px)" }} />
      )}
      <nav style={{
        position: "fixed", top: 0, left: 0, height: "100%", width: 280,
        background: "#fff", zIndex: 300,
        transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.24s ease",
        boxShadow: "4px 0 28px rgba(0,0,0,0.15)",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 18px 14px", borderBottom: "1px solid #f2f2f2" }}>
          <span style={{ fontFamily: "'Pacifico', cursive", fontSize: 20, color: C.purple }}>YourPoodle 🐾</span>
          <button onClick={() => setDrawerOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32 }}>
            <X size={20} color="#666" />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {[
            ...NAV_DRAWER,
            ...(isLoggedIn ? [{ label: "Siparişlerim", href: "/yourpoodle/siparislerim" }] : []),
          ].map(l => (
            <button key={l.href} onClick={() => go(l.href)}
              style={{
                display: "block", width: "100%", padding: "13px 20px",
                fontSize: 15, fontWeight: 600,
                color: location === l.href ? C.purple : "#222",
                background: location === l.href ? "#F5F0FF" : "transparent",
                border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit",
              }}>
              {l.label}
            </button>
          ))}
        </div>
        <div style={{ padding: "16px 18px", borderTop: "1px solid #f2f2f2" }}>
          <button onClick={() => go(isLoggedIn ? "/hesabim" : "/yourpoodle/giris")}
            style={{ width: "100%", height: 46, borderRadius: 12, background: `linear-gradient(135deg,${C.purple},#A855F7)`, border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            {isLoggedIn ? "👤 Hesabım" : "Ücretsiz Başla"}
          </button>
        </div>
      </nav>

      {/* ─── HEADER ────────────────────────────────────── */}
      <header style={{ position: "sticky", top: 0, zIndex: 200 }}>

        {/* Promo bar */}
        <div style={{ background: `linear-gradient(90deg, ${C.darkPurple} 0%, ${C.purple} 100%)`, color: "#fff", textAlign: "center", padding: "8px 20px", fontSize: 12.5, fontWeight: 600, lineHeight: 1.4 }}>
          ✨ 500₺ üzeri ücretsiz kargo &nbsp;•&nbsp; Uzman destek 7/24 yanınızda
        </div>

        {/* Main header — mobile */}
        <div className="yph-mobile" style={{ background: "#fff", borderBottom: `1px solid ${C.border}`, alignItems: "center", padding: "8px 14px", gap: 8 }}>
          {/* Hamburger */}
          <button onClick={() => setDrawerOpen(true)}
            style={{ width: 38, height: 38, borderRadius: 10, background: C.lightPurple, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
              <rect y="0" width="18" height="2" rx="1" fill={C.purple}/>
              <rect y="6" width="14" height="2" rx="1" fill={C.purple}/>
              <rect y="12" width="18" height="2" rx="1" fill={C.purple}/>
            </svg>
          </button>
          {/* Logo */}
          <button onClick={() => go("/yourpoodle")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0 }}>
            <span style={{ fontFamily: "'Pacifico', cursive", fontSize: 18, color: C.purple, lineHeight: 1 }}>YourPoodle</span>
          </button>
          {/* Search */}
          <form onSubmit={handleSearch} style={{ flex: 1, position: "relative" }}>
            <Search size={14} color="#9CA3AF" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Mama, rehber veya ürün ara..."
              style={{ width: "100%", height: 36, borderRadius: 9999, border: `1.5px solid ${C.border}`, background: C.softBg, paddingLeft: 32, paddingRight: 10, fontSize: 12, color: C.text, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
            />
          </form>
          {/* Notification */}
          <button onClick={() => go("/yourpoodle/bildirimler")} style={{ width: 38, height: 38, borderRadius: "50%", border: `1.5px solid ${C.border}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            <Bell size={17} color={C.secondary} strokeWidth={1.8} />
          </button>
          {/* Cart */}
          <button onClick={() => go("/yourpoodle/sepet")} style={{ width: 38, height: 38, borderRadius: "50%", border: `1.5px solid ${C.border}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, position: "relative" }}>
            <ShoppingCart size={17} color={C.secondary} strokeWidth={1.8} />
            {cartCount > 0 && (
              <span style={{ position: "absolute", top: -2, right: -2, background: C.purple, color: "#fff", fontSize: 9, fontWeight: 800, width: 17, height: 17, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff" }}>
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Main header — desktop */}
        <div className="yph-desktop" style={{ background: "#fff", borderBottom: `1px solid ${C.border}` }}>
          <div className="yph-inner" style={{ display: "flex", alignItems: "center", padding: "14px 40px", gap: 24, width: "100%" }}>
            <button onClick={() => go("/yourpoodle")} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", flexShrink: 0, padding: 0 }}>
              <span style={{ fontFamily: "'Pacifico', cursive", fontSize: 26, color: C.text, lineHeight: 1 }}>YourPoodle</span>
              <span style={{ fontSize: 18 }}>🐾</span>
            </button>
            <form onSubmit={handleSearch} style={{ flex: 1, position: "relative" }}>
              <Search size={16} color="#9CA3AF" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Mama, aksesuar veya rehber ara..."
                style={{ width: "100%", height: 44, borderRadius: 9999, border: "none", background: C.softBg, paddingLeft: 48, paddingRight: 20, fontSize: 14, color: C.text, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
            </form>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
              {isLoggedIn ? (
                <div ref={profileRef} style={{ position: "relative" }}>
                  <button onClick={() => setProfileOpen(o => !o)}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px 4px 4px", borderRadius: 9999, border: `1.5px solid ${C.border}`, background: "#fff", cursor: "pointer" }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg,${C.darkPurple},${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>{initials || "🐾"}</span>
                    </div>
                    <ChevronDown size={13} color="#9CA3AF" strokeWidth={2} style={{ transform: profileOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
                  </button>
                  {profileOpen && (
                    <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "#fff", borderRadius: 16, boxShadow: "0 8px 32px rgba(112,34,196,0.18)", border: `1px solid ${C.lightPurple}`, minWidth: 180, zIndex: 300, overflow: "hidden" }}>
                      {[
                        { label: "👤 Profilim",       href: "/hesabim" },
                        { label: "📦 Siparişlerim",   href: "/yourpoodle/siparislerim" },
                        { label: "🐾 Köpek Profilim", href: "/yourpoodle/p/olustur" },
                        { label: "❤️ Favorilerim",    href: "/favoriler" },
                        { label: "🚪 Çıkış Yap",      href: "/giris?logout=1" },
                      ].map(({ label, href }) => (
                        <button key={href} onClick={() => { go(href); setProfileOpen(false); }}
                          style={{ display: "block", width: "100%", padding: "11px 18px", fontSize: 13, fontWeight: 600, color: "#374151", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}
                          onMouseEnter={e => (e.currentTarget.style.background = C.lightPurple)}
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
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, color: C.secondary, fontFamily: "inherit", padding: "0 4px" }}>
                    Giriş Yap
                  </button>
                  <button onClick={() => go("/yourpoodle/giris")}
                    style={{ padding: "10px 22px", borderRadius: 9999, border: "none", background: C.purple, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                    Üye Ol
                  </button>
                </>
              )}
              <button onClick={() => go("/yourpoodle/sepet")}
                style={{ width: 42, height: 42, borderRadius: "50%", border: `1.5px solid ${C.border}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, position: "relative" }}>
                <ShoppingCart size={18} color={C.secondary} strokeWidth={1.8} />
                {cartCount > 0 && (
                  <span style={{ position: "absolute", top: -3, right: -3, background: C.purple, color: "#fff", fontSize: 9, fontWeight: 800, width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff" }}>
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop sub-nav */}
        <nav className="yph-desktop" style={{ background: "#fff", borderBottom: `1px solid ${C.border}` }}>
          <div className="yph-inner" style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", height: 50, padding: "0 40px" }}>
            {[
              { label: "Mağaza",     href: "/yourpoodle/magaza" },
              { label: "AI Asistan", href: "/yourpoodle/ai-asistan" },
              { label: "Rehber",     href: "/yourpoodle/rehber" },
              { label: "Araçlar",    href: "/yourpoodle/bilgi" },
              { label: "Topluluk",   href: "/yourpoodle/topluluk" },
            ].map(({ label, href }, i, arr) => {
              const active = href === "/yourpoodle" ? location === "/yourpoodle" : location.startsWith(href);
              return (
                <span key={href} style={{ display: "flex", alignItems: "center" }}>
                  {i > 0 && <span style={{ color: C.border, margin: "0 10px", fontSize: 16 }}>•</span>}
                  <button onClick={() => go(href)}
                    style={{ padding: "6px 16px", borderRadius: 9999, background: active ? C.purple : "transparent", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, color: active ? "#fff" : C.text, fontFamily: "inherit", transition: "background 0.15s" }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = C.lightPurple; }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
                    {label}
                  </button>
                </span>
              );
            })}
          </div>
        </nav>
      </header>

      {/* ─── PAGE CONTENT ──────────────────────────────── */}
      <div className="yph-page-pad">

        {/* ══════════════════════════════════════════════ */}
        {/* HERO SECTION                                  */}
        {/* ══════════════════════════════════════════════ */}
        <section style={{ background: "linear-gradient(160deg, #FAF7FF 0%, #EDE9FE 55%, #F5F0FF 100%)", position: "relative", overflow: "hidden" }}>
          <div className="yph-inner yph-hero-pad" style={{ position: "relative", zIndex: 1 }}>
            <div className="yph-hero-grid">

              {/* Left: text content */}
              <div style={{ paddingTop: 4 }}>
                {/* Badge */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.8)", border: `1px solid ${C.border}`, borderRadius: 20, padding: "5px 14px", marginBottom: 16, backdropFilter: "blur(8px)" }}>
                  <span style={{ fontSize: 12 }}>✨</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.purple }}>Dünyanın En Büyük Poodle Platformu</span>
                </div>

                {/* Title */}
                <h1 style={{ fontSize: "clamp(28px,7vw,48px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-1px", marginBottom: 14, color: C.text, margin: "0 0 14px" }}>
                  Toy Poodle'ınız için
                  <br />
                  <span style={{ background: `linear-gradient(135deg, ${C.purple}, ${C.pink})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    Her Şey Tek Yerde
                  </span>
                </h1>

                {/* Description */}
                <p style={{ fontSize: 13.5, lineHeight: 1.7, color: C.secondary, marginBottom: 20, maxWidth: 420 }}>
                  Beslenme, bakım, sağlık ve eğitim rehberleri. Uzman desteği ve kaliteli ürünlerle Poodle'ınıza en iyisini sunun.
                </p>

                {/* CTA buttons */}
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
                  <button onClick={() => go("/yourpoodle/mama-bul")}
                    style={{ height: 48, padding: "0 24px", borderRadius: 14, border: "none", background: `linear-gradient(135deg,${C.purple},#A855F7)`, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 20px rgba(124,58,237,0.32)`, display: "flex", alignItems: "center", gap: 7 }}>
                    🐾 MAMA BUL
                  </button>
                  <button onClick={() => go("/yourpoodle/rehber")}
                    style={{ height: 48, padding: "0 22px", borderRadius: 14, border: `1.5px solid ${C.border}`, background: "rgba(255,255,255,0.9)", color: C.purple, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 7 }}>
                    📖 REHBERLERİ GÖR
                  </button>
                </div>

                {/* Trust row */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {/* Avatars */}
                  <div style={{ display: "flex" }}>
                    {["#7C3AED", "#EC4899", "#F59E0B"].map((bg, i) => (
                      <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: bg, border: "2px solid #fff", marginLeft: i > 0 ? -8 : 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff", fontWeight: 800 }}>
                        {["Z", "A", "M"][i]}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: C.text, lineHeight: 1.3 }}>
                      50.000+ Poodle sever
                      <br />
                      <span style={{ fontWeight: 500, color: C.secondary }}>Tarafından güveniliyor</span>
                    </div>
                    <div style={{ display: "flex", gap: 1, marginTop: 3 }}>
                      {[1,2,3,4,5].map(s => <span key={s} style={{ color: "#FBBF24", fontSize: 11 }}>★</span>)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: hero image — visible on mobile too as a compact strip */}
              <div style={{ position: "relative" }}>
                {/* Mobile: compact image strip above buttons */}
                <div className="yph-mobile" style={{ justifyContent: "center", marginTop: 20, marginBottom: 0, position: "relative" }}>
                  <div style={{ width: "100%", maxWidth: 340, borderRadius: 24, overflow: "hidden", boxShadow: `0 12px 40px rgba(124,58,237,0.2)`, background: "#EDE9FE", position: "relative" }}>
                    <img
                      src="/images/poodle-hero_2.jpg"
                      alt="Toy Poodle"
                      style={{ width: "100%", aspectRatio: "3/2.2", objectFit: "cover", objectPosition: "center top", display: "block" }}
                      onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                    />
                    {/* Speech bubble */}
                    <div style={{ position: "absolute", bottom: 12, right: 10, background: "#fff", borderRadius: 16, padding: "8px 12px", boxShadow: "0 4px 16px rgba(0,0,0,0.12)", maxWidth: 180, border: `1px solid ${C.lightPurple}` }}>
                      <p style={{ fontSize: 10.5, color: C.text, lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
                        Merhaba! Ben YourPoodle asistanınız. Size nasıl yardımcı olabilirim? 🐾
                      </p>
                    </div>
                  </div>
                </div>

                {/* Desktop: larger image with floating badges */}
                <div className="yph-desktop" style={{ position: "relative", flexDirection: "column" }}>
                  <div style={{ borderRadius: 28, overflow: "hidden", boxShadow: `0 16px 48px rgba(109,40,217,0.18)`, position: "relative", aspectRatio: "4/4.5", background: "#EDE9FE" }}>
                    <img
                      src="/images/poodle-hero_2.jpg"
                      alt="Toy Poodle"
                      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
                    />
                  </div>
                  {/* Speech bubble */}
                  <div style={{ position: "absolute", bottom: 80, right: -20, background: "#fff", borderRadius: 16, padding: "10px 14px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", maxWidth: 200, border: `1px solid ${C.lightPurple}` }}>
                    <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: 0 }}>
                      Merhaba! Ben YourPoodle asistanınız. Size nasıl yardımcı olabilirim? 🐾
                    </p>
                  </div>
                  {/* AI badge */}
                  <div style={{ position: "absolute", top: 24, right: -20, background: "#fff", borderRadius: 14, padding: "10px 14px", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: C.lightPurple, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🤖</div>
                    <div>
                      <div style={{ fontSize: 11.5, fontWeight: 800, color: C.text }}>AI Asistan</div>
                      <div style={{ fontSize: 10, color: C.secondary }}>7/24 size özel destek</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Curved bottom divider */}
          <svg viewBox="0 0 1440 40" style={{ display: "block", marginTop: -2 }} preserveAspectRatio="none" height="40" width="100%">
            <path d="M0,40 Q720,0 1440,40 L1440,40 L0,40 Z" fill="#fff" />
          </svg>
        </section>

        {/* ══════════════════════════════════════════════ */}
        {/* FEATURE SHORTCUTS                             */}
        {/* ══════════════════════════════════════════════ */}
        <section className="yph-section" style={{ background: "#fff" }}>
          <div className="yph-inner">

            {/* Mobile: horizontal scroll */}
            <div className="yph-mobile" style={{ flexDirection: "column" }}>
              <div className="yph-shortcut-scroll">
                {SHORTCUTS.map(s => (
                  <button key={s.label} onClick={() => go(s.href)}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "16px 14px", background: "#fff", border: `1.5px solid ${C.border}`, borderRadius: 18, cursor: "pointer", fontFamily: "inherit", minWidth: 100, flex: "0 0 auto", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", textAlign: "center" }}>
                    <div style={{ width: 46, height: 46, borderRadius: 14, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                      {s.emoji}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: C.text, whiteSpace: "nowrap" }}>{s.label}</div>
                      <div style={{ fontSize: 10, color: C.secondary, lineHeight: 1.4, maxWidth: 90, marginTop: 2 }}>{s.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop: 5-column grid */}
            <div className="yph-desktop yph-shortcut-desktop-grid" style={{ display: "none" }}>
              {SHORTCUTS.map(s => (
                <button key={s.label} onClick={() => go(s.href)}
                  style={{ display: "flex", flexDirection: "column", gap: 12, padding: "20px 18px", background: "#fff", border: `1.5px solid ${C.border}`, borderRadius: 20, cursor: "pointer", fontFamily: "inherit", textAlign: "left", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#C4B5FD"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(124,58,237,0.1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                  <div style={{ width: 46, height: 46, borderRadius: 14, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{s.emoji}</div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: C.text, marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 12, color: C.secondary, lineHeight: 1.5 }}>{s.sub}</div>
                  </div>
                  <div style={{ fontSize: 13, color: s.color, fontWeight: 700, marginTop: "auto" }}>→</div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════ */}
        {/* MOST READ                                     */}
        {/* ══════════════════════════════════════════════ */}
        <section className="yph-section" style={{ background: C.softBg, borderTop: `1px solid ${C.border}` }}>
          <div className="yph-inner">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: C.text, margin: 0 }}>🐾 Bu Hafta En Çok Okunanlar</h2>
              <button onClick={() => go("/yourpoodle/rehber")}
                style={{ fontSize: 13, fontWeight: 700, color: C.purple, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                Tümünü Gör →
              </button>
            </div>

            {/* Mobile: horizontal swipe */}
            <div className="yph-mobile" style={{ flexDirection: "column" }}>
              <div className="yph-article-scroll">
                {ARTICLES.map(a => (
                  <button key={a.title} className="yph-article-card"
                    onClick={() => go("/yourpoodle/rehber")}
                    style={{ background: "#fff", borderRadius: 18, overflow: "hidden", border: `1.5px solid ${C.border}`, cursor: "pointer", fontFamily: "inherit", textAlign: "left", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: 0, display: "flex", flexDirection: "column" }}>
                    {/* Image area */}
                    <div style={{ background: a.gradient, aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, position: "relative" }}>
                      {a.emoji}
                      <span style={{ position: "absolute", top: 10, left: 12, fontSize: 10, fontWeight: 800, color: a.catColor, background: a.catBg, borderRadius: 20, padding: "3px 10px", letterSpacing: "0.05em" }}>{a.cat}</span>
                    </div>
                    {/* Text area */}
                    <div style={{ padding: "14px 14px 16px" }}>
                      <div style={{ fontSize: 13.5, fontWeight: 800, color: C.text, lineHeight: 1.45, marginBottom: 8, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any, overflow: "hidden" }}>{a.title}</div>
                      <div style={{ fontSize: 11, color: C.secondary, display: "flex", alignItems: "center", gap: 4 }}>
                        <span>⏱</span> {a.min}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop: 4-col grid */}
            <div className="yph-desktop yph-article-grid" style={{ display: "none" }}>
              {ARTICLES.map(a => (
                <button key={a.title} onClick={() => go("/yourpoodle/rehber")}
                  style={{ background: "#fff", borderRadius: 18, overflow: "hidden", border: `1.5px solid ${C.border}`, cursor: "pointer", fontFamily: "inherit", textAlign: "left", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", padding: 0, display: "flex", flexDirection: "column", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)"; e.currentTarget.style.transform = "none"; }}>
                  <div style={{ background: a.gradient, aspectRatio: "16/10", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, position: "relative" }}>
                    {a.emoji}
                    <span style={{ position: "absolute", top: 10, left: 12, fontSize: 10, fontWeight: 800, color: a.catColor, background: a.catBg, borderRadius: 20, padding: "3px 10px", letterSpacing: "0.05em" }}>{a.cat}</span>
                  </div>
                  <div style={{ padding: "14px 14px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: C.text, lineHeight: 1.45, marginBottom: "auto", flex: 1 }}>{a.title}</div>
                    <div style={{ fontSize: 11, color: C.secondary, marginTop: 10, display: "flex", alignItems: "center", gap: 4 }}>
                      <span>⏱</span> {a.min}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════ */}
        {/* AI ASSISTANT                                  */}
        {/* ══════════════════════════════════════════════ */}
        <section className="yph-section" style={{ background: "#fff", borderTop: `1px solid ${C.border}` }}>
          <div className="yph-inner">
            <div style={{ background: "linear-gradient(145deg,#2D1B69 0%,#1a0e4f 55%,#1A0F3C 100%)", borderRadius: 24, padding: "28px 24px", position: "relative", overflow: "hidden" }}>

              {/* Decorative glows */}
              <div style={{ position: "absolute", top: -30, right: -30, width: 140, height: 140, borderRadius: "50%", background: "rgba(139,92,246,0.15)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: 30, left: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(139,92,246,0.1)", pointerEvents: "none" }} />
              <span style={{ position: "absolute", top: 18, right: 60, fontSize: 14, opacity: 0.4, pointerEvents: "none" }}>✦</span>
              <span style={{ position: "absolute", top: 44, right: 30, fontSize: 10, opacity: 0.35, pointerEvents: "none" }}>✦</span>
              <span style={{ position: "absolute", bottom: 60, right: 20, fontSize: 12, opacity: 0.3, pointerEvents: "none" }}>✦</span>

              <div className="yph-ai-inner">
                {/* Robot + title */}
                <div style={{ display: "flex", gap: 16, alignItems: "center", position: "relative", zIndex: 1, flexShrink: 0 }}>
                  <div style={{ width: 64, height: 64, borderRadius: 20, background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, flexShrink: 0 }}>🤖</div>
                  <div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(139,92,246,0.35)", border: "1px solid rgba(139,92,246,0.5)", borderRadius: 99, padding: "3px 10px", marginBottom: 6 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#A78BFA", display: "inline-block" }} />
                      <span style={{ fontSize: 10, fontWeight: 800, color: "#C4B5FD", letterSpacing: "0.06em" }}>🏠 7/24 YANINIZDA</span>
                    </div>
                    <h3 style={{ fontSize: 20, fontWeight: 900, color: "#fff", margin: 0, lineHeight: 1.2 }}>Poodle AI Asistan</h3>
                    <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.6)", margin: "4px 0 0", lineHeight: 1.4 }}>Sorunuzu yazın, Poodle'ınıza özel anında yanıt alın.</p>
                  </div>
                </div>

                {/* Right side: chips + CTA */}
                <div style={{ flex: 1, position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {["Kaç gram mama vermeliyim?", "Göz altı neden kızarıyor?", "Yalnız kalınca neden havlıyor?"].map(q => (
                      <button key={q} onClick={() => go("/yourpoodle/ai-asistan")}
                        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "9px 14px", color: "rgba(255,255,255,0.9)", fontSize: 12.5, cursor: "pointer", fontFamily: "inherit", textAlign: "left", transition: "background 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.14)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}>
                        {q}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => go("/yourpoodle/ai-asistan")}
                    style={{ width: "100%", height: 50, borderRadius: 14, background: `linear-gradient(135deg,${C.purple},#9B59D9)`, border: "none", color: "#fff", fontSize: 14.5, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 6px 20px rgba(124,58,237,0.4)", letterSpacing: "0.02em" }}>
                    AI ASİSTANA SOR →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════ */}
        {/* QUICK TOOLS                                   */}
        {/* ══════════════════════════════════════════════ */}
        <section className="yph-section" style={{ background: C.softBg, borderTop: `1px solid ${C.border}` }}>
          <div className="yph-inner">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: C.text, margin: 0 }}>⚡ Hızlı Araçlar</h2>
              <button onClick={() => go("/yourpoodle/bilgi")}
                style={{ fontSize: 13, fontWeight: 700, color: C.purple, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                Tümünü Gör →
              </button>
            </div>
            <div className="yph-tools-grid">
              {TOOLS.map(t => (
                <button key={t.label} onClick={() => go("/yourpoodle/bilgi")}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 12px", background: "#fff", border: `1.5px solid ${C.border}`, borderRadius: 16, cursor: "pointer", fontFamily: "inherit", textAlign: "left", transition: "all 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = t.color; e.currentTarget.style.boxShadow = `0 4px 16px ${t.color}20`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{t.emoji}</div>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 800, color: C.text, lineHeight: 1.3, marginBottom: 2 }}>{t.label}</div>
                    <div style={{ fontSize: 11, color: C.secondary }}>{t.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════ */}
        {/* MEMBERSHIP PROMO                              */}
        {/* ══════════════════════════════════════════════ */}
        <section style={{ padding: "0 20px 20px" }}>
          <div className="yph-inner">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, background: `linear-gradient(135deg,${C.lightPurple},#EDE9FE)`, borderRadius: 18, padding: "16px 18px", border: `1.5px solid #DDD6FE` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>🎁</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 900, color: C.text, lineHeight: 1.3 }}>Yeni Üyeye Özel Hoş Geldin!</div>
                  <div style={{ fontSize: 12, color: C.secondary, lineHeight: 1.4, marginTop: 2 }}>Üye ol, 100 TL hediye kuponunu hemen kazan!</div>
                </div>
              </div>
              <button onClick={() => go("/yourpoodle/giris")}
                style={{ flexShrink: 0, height: 40, padding: "0 18px", borderRadius: 12, background: C.purple, border: "none", color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                ÜYE OL →
              </button>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════ */}
        {/* FEATURED PRODUCTS (desktop) */}
        {/* ══════════════════════════════════════════════ */}
        <section className="yph-section yph-desktop" style={{ background: "#fff", borderTop: `1px solid ${C.border}`, display: "none" }}>
          <div className="yph-inner" style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>🛍️ Poodle Sahiplerinin Tercihleri</h2>
                <p style={{ fontSize: 13.5, color: C.secondary }}>Toy & Miniature Poodle için önerilen ürünler</p>
              </div>
              <button onClick={() => go("/yourpoodle/magaza")} style={{ fontSize: 13.5, fontWeight: 700, color: C.purple, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Tümünü Gör →</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
              {featuredProducts.length === 0
                ? Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} style={{ background: "#E8E4FF", borderRadius: 16, aspectRatio: "1" }} />
                  ))
                : featuredProducts.slice(0, 8).map(p => (
                  <button key={p.id} onClick={() => go(`/yourpoodle/urun/${p.id}`)}
                    style={{ background: "#fff", borderRadius: 16, overflow: "hidden", cursor: "pointer", display: "flex", flexDirection: "column", border: `1.5px solid ${C.border}`, padding: 0, fontFamily: "inherit", textAlign: "left", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
                    <div style={{ background: C.softBg, aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: 8 }}>
                      {p.img
                        ? <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                        : <span style={{ fontSize: 32 }}>🐾</span>
                      }
                    </div>
                    <div style={{ padding: "10px 12px 14px" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.text, lineHeight: 1.35, marginBottom: 6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any, overflow: "hidden" }}>{p.name}</div>
                      <div style={{ fontSize: 14, fontWeight: 900, color: C.purple }}>₺{Number(p.price).toLocaleString("tr-TR")}</div>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════ */}
        {/* REVIEWS                                       */}
        {/* ══════════════════════════════════════════════ */}
        <section className="yph-section" style={{ background: C.softBg, borderTop: `1px solid ${C.border}` }}>
          <div className="yph-inner">
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 6 }}>Poodle sahipleri ne diyor?</h2>
              <p style={{ fontSize: 13.5, color: C.secondary }}>50.000+ üyenin güvendiği platform</p>
            </div>
            <div className="yph-reviews-grid">
              {REVIEWS.map(r => (
                <div key={r.name} style={{ background: "#fff", borderRadius: 20, padding: "20px", border: `1.5px solid ${C.border}` }}>
                  <div style={{ display: "flex", gap: 2, marginBottom: 12 }}>
                    {Array.from({ length: r.stars }).map((_, i) => <span key={i} style={{ color: "#FBBF24", fontSize: 15 }}>★</span>)}
                  </div>
                  <p style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.7, marginBottom: 16 }}>"{r.text}"</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg,${C.purple},#A855F7)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff" }}>{r.avatar}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: C.text }}>{r.name}</div>
                      <span style={{ fontSize: 10.5, color: C.purple, background: C.lightPurple, borderRadius: 20, padding: "2px 8px", display: "inline-block", marginTop: 2, fontWeight: 700 }}>{r.tag}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════ */}
        {/* FAQ + EMAIL (desktop)                         */}
        {/* ══════════════════════════════════════════════ */}
        <section className="yph-section" style={{ background: "#fff", borderTop: `1px solid ${C.border}` }}>
          <div className="yph-inner">
            <div className="yph-faq-grid">
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 20 }}>Sık Sorulan Sorular</h2>
                {FAQ.map((item, i) => (
                  <div key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left", gap: 16 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{item.q}</span>
                      <span style={{ fontSize: 20, color: C.purple, flexShrink: 0, lineHeight: 1 }}>{openFaq === i ? "−" : "+"}</span>
                    </button>
                    {openFaq === i && (
                      <div style={{ fontSize: 13.5, color: C.secondary, lineHeight: 1.7, paddingBottom: 16 }}>{item.a}</div>
                    )}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ background: `linear-gradient(135deg,${C.purple},#A855F7)`, borderRadius: 24, padding: 28, textAlign: "center", position: "sticky", top: 80 }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>📬</div>
                  <h3 style={{ fontSize: 17, fontWeight: 900, color: "#fff", marginBottom: 8 }}>Haftalık Poodle İpuçları</h3>
                  <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.75)", lineHeight: 1.6, marginBottom: 18 }}>Her hafta uzman bakım önerileri, yeni araçlar ve topluluk haberleri.</p>
                  {emailSent ? (
                    <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: 14, fontSize: 14, fontWeight: 700, color: "#fff" }}>✓ Teşekkürler! Sizi ekledik.</div>
                  ) : (
                    <>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="E-posta adresiniz"
                        style={{ width: "100%", height: 46, borderRadius: 12, border: "none", padding: "0 16px", fontSize: 13.5, marginBottom: 10, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
                      <button onClick={async () => {
                          if (!email.includes("@")) return;
                          try { await fetch("/api/yp/email-subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) }); } catch {}
                          setEmailSent(true);
                        }}
                        style={{ width: "100%", height: 46, borderRadius: 12, background: "#fff", border: "none", fontSize: 14, fontWeight: 800, color: C.purple, cursor: "pointer", fontFamily: "inherit" }}>
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

        {/* ══════════════════════════════════════════════ */}
        {/* TRUST STRIP                                   */}
        {/* ══════════════════════════════════════════════ */}
        <section className="yph-section" style={{ background: C.softBg, borderTop: `1px solid ${C.border}`, padding: "24px 20px" }}>
          <div className="yph-inner" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
            {[
              { icon: "🛡️", label: "Güvenilir Bilgi",  sub: "Veteriner onaylı içerikler", color: C.purple },
              { icon: "🔒", label: "%100 Güvenli",      sub: "256-bit SSL koruması",       color: "#2563EB" },
              { icon: "🐩", label: "Poodle Odaklı",     sub: "Sadece Poodle'lara özel",    color: C.pink   },
              { icon: "🎧", label: "7/24 Destek",       sub: "AI + uzman ekip",            color: "#059669" },
            ].map(t => (
              <div key={t.label} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: `${t.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{t.icon}</div>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 800, color: C.text }}>{t.label}</div>
                  <div style={{ fontSize: 11, color: C.secondary, marginTop: 2 }}>{t.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>{/* yph-page-pad */}

      {/* ─── MOBILE BOTTOM NAV ─────────────────────────── */}
      <div className="yph-btm-nav">
        <YPBottomNav />
      </div>

    </div>
  );
}
