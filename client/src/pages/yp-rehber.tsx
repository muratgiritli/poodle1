import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useCustomer } from "@/contexts/CustomerContext";
import {
  Menu, X, ChevronRight, ShoppingBag, PawPrint, MessageCirclePlus, BookOpen,
  Search, SlidersHorizontal, Heart, Brush, GraduationCap, Calculator,
  Mail, Clock, Instagram, Youtube, Music2, Facebook, Plus, Minus,
  ShieldCheck, Home as HomeIcon, Users, ShoppingCart, Bot,
} from "lucide-react";

/* ── Design tokens ──────────────────────────────────────── */
const P   = "#6200EE";
const FBG = "#1A0052";
const NL  = "#2D1065";
const GB  = "#E5E7EB";

/* ── Section definitions ────────────────────────────────── */
interface GuideSection {
  id: string;
  name: string;
  icon: React.ElementType;
  iconColor: string;
  badgeColor: string;
  headerBg: string;
  headerBorder: string;
  numberBg: string;
  items: string[];
}

const SECTIONS: GuideSection[] = [
  {
    id: "saglik",
    name: "Sağlık",
    icon: Heart,
    iconColor: "#14B8A6",
    badgeColor: "#14B8A6",
    headerBg: "#F0FDFA",
    headerBorder: "#99F6E4",
    numberBg: "#14B8A6",
    items: [
      "Aşı Takvimi",
      "İç ve Dış Parazit",
      "Toy Poodle Hastalıkları",
      "Alerji Belirtileri",
      "Sindirim ve İshal",
      "Göz Sağlığı",
      "Kulak Sağlığı",
      "Ağız ve Diş Sağlığı",
      "Eklem ve Diz Kapağı",
      "Acil Durumlarda İlk Yardım",
    ],
  },
  {
    id: "bakim",
    name: "Bakım",
    icon: Brush,
    iconColor: "#EC4899",
    badgeColor: "#EC4899",
    headerBg: "#FDF2F8",
    headerBorder: "#FBCFE8",
    numberBg: "#EC4899",
    items: [
      "Tüy Bakımı ve Tarama",
      "Banyo Sıklığı",
      "Doğru Şampuan Seçimi",
      "Tıraş Modelleri",
      "Göz Yaşı Lekesi Bakımı",
      "Kulak Temizliği",
      "Tırnak Kesimi",
      "Diş Temizliği",
      "Pati ve Burun Bakımı",
      "Yaz ve Kış Bakımı",
    ],
  },
  {
    id: "egitim",
    name: "Eğitim",
    icon: GraduationCap,
    iconColor: "#F97316",
    badgeColor: "#F97316",
    headerBg: "#FFF7ED",
    headerBorder: "#FED7AA",
    numberBg: "#F97316",
    items: [
      "Tuvalet Eğitimi",
      "İsmini Öğretme",
      "Temel Komutlar",
      "Isırmayı Bırakma",
      "Havlama Kontrolü",
      "Tasma ile Yürüme",
      "Sosyalleşme Eğitimi",
      "Yalnız Kalma Eğitimi",
      "Ödülle Eğitim",
      "Seyahat ve Araba Eğitimi",
    ],
  },
  {
    id: "araclar",
    name: "Araçlar",
    icon: Calculator,
    iconColor: "#6200EE",
    badgeColor: "#6200EE",
    headerBg: "#F3EEFF",
    headerBorder: "#DDD6FE",
    numberBg: "#6200EE",
    items: [
      "Günlük Mama Hesaplayıcı",
      "Su İhtiyacı Hesaplayıcı",
      "İdeal Kilo Takibi",
      "Köpek Yaşı Hesaplayıcı",
      "Aşı Takvimi Oluştur",
      "Parazit Hatırlatıcısı",
      "Bakım Takvimi",
      "Mama Karşılaştırma",
      "Belirli Rehberi",
      "Seyahat Kontrol Listesi",
    ],
  },
];

/* ── Accordion data (footer) ────────────────────────────── */
const ACCORDION = [
  { Icon: PawPrint,          title: "YourPoodle",  links: ["Hakkımızda","Misyonumuz","Kariyer","Basın"]                        },
  { Icon: ShoppingBag,       title: "Alışveriş",   links: ["Tüm Ürünler","Mamalar","Aksesuarlar","Kampanyalar"]                },
  { Icon: MessageCirclePlus, title: "Yardım",       links: ["SSS","Kargo & Teslimat","İade & Değişim","İletişim"]              },
  { Icon: ShieldCheck,       title: "Yasal",        links: ["Gizlilik Politikası","Kullanım Koşulları","KVKK","Çerez Politikası"] },
];

/* ── Toast ──────────────────────────────────────────────── */
function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div style={{
      position: "fixed", bottom: 88, left: "50%", transform: "translateX(-50%)",
      zIndex: 999, pointerEvents: "none",
      opacity: visible ? 1 : 0, transition: "opacity 0.3s ease",
    }}>
      <div style={{
        background: FBG, color: "#fff", padding: "12px 24px",
        borderRadius: 999, fontSize: 14, fontWeight: 500,
        whiteSpace: "nowrap", boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
      }}>
        {message}
      </div>
    </div>
  );
}

/* ── Footer Accordion ───────────────────────────────────── */
function FooterAccordion() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div>
      {ACCORDION.map((item, i) => (
        <div key={item.title}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: "100%", display: "flex", alignItems: "center",
              justifyContent: "space-between", padding: "14px 0",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              background: "none", border: "none", borderTopWidth: 1,
              borderTopStyle: "solid", borderTopColor: "rgba(255,255,255,0.1)",
              cursor: "pointer", fontFamily: "inherit",
            }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <item.Icon size={18} color="rgba(255,255,255,0.8)" />
              <span style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>{item.title}</span>
            </div>
            {open === i ? <Minus size={18} color="#fff" /> : <Plus size={18} color="#fff" />}
          </button>
          {open === i && (
            <div style={{ paddingBottom: 12, paddingLeft: 30, display: "flex", flexDirection: "column", gap: 8 }}>
              {item.links.map(l => (
                <span key={l} style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", cursor: "pointer", display: "block" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.textDecoration = "underline"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"; (e.currentTarget as HTMLElement).style.textDecoration = "none"; }}>
                  {l}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Quick category pill ────────────────────────────────── */
function QuickPill({ section, onClick }: { section: GuideSection; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        padding: "12px 8px", borderRadius: 12,
        border: `1px solid ${section.headerBorder}`,
        background: hov ? section.headerBorder : section.headerBg,
        cursor: "pointer", transition: "all 0.15s ease",
        transform: hov ? "scale(1.03)" : "scale(1)",
      }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10, background: "#fff",
        border: `1px solid ${section.headerBorder}`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <section.icon size={22} color={section.iconColor} strokeWidth={1.75} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{section.name}</span>
    </button>
  );
}

/* ── Guide section card ─────────────────────────────────── */
function SectionCard({ section }: { section: GuideSection }) {
  return (
    <div style={{
      borderRadius: 16, border: `1px solid ${section.headerBorder}`,
      overflow: "hidden", marginBottom: 16,
    }}>
      {/* Header */}
      <div style={{
        background: section.headerBg, padding: "14px 16px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, background: "#fff",
            border: `1px solid ${section.headerBorder}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <section.icon size={18} color={section.iconColor} strokeWidth={1.75} />
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{section.name}</span>
        </div>
        <span style={{ fontSize: 13, fontWeight: 500, color: section.badgeColor }}>
          {section.items.length} konu
        </span>
      </div>

      {/* Items */}
      <div style={{ background: "#fff" }}>
        {section.items.map((item, idx) => (
          <button
            key={item}
            style={{
              width: "100%", display: "flex", alignItems: "center",
              justifyContent: "space-between", padding: "11px 16px",
              background: "none", border: "none", borderBottom: `1px solid ${GB}`,
              cursor: "pointer", fontFamily: "inherit", textAlign: "left",
              transition: "background 0.12s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#F9FAFB"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "none"; }}
            onClick={() => alert(`Konu: ${item}`)}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* number bubble */}
              <span style={{
                width: 22, height: 22, borderRadius: "50%",
                background: section.numberBg, color: "#fff",
                fontSize: 11, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                {idx + 1}
              </span>
              <span style={{ fontSize: 14, color: "#111827", fontWeight: 400 }}>{item}</span>
            </div>
            <ChevronRight size={16} color="#9CA3AF" />
          </button>
        ))}
      </div>

      {/* "Tümünü Gör" footer */}
      <div style={{
        background: "#fff", padding: "10px 16px",
        display: "flex", justifyContent: "center",
      }}>
        <button
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: 600, color: section.badgeColor,
            fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4,
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.textDecoration = "underline"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.textDecoration = "none"; }}
          onClick={() => alert(`${section.name} — tümünü gör`)}>
          Tümünü Gör
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

/* ── Main page ──────────────────────────────────────────── */
export default function YPRehberPage({ routeSlug: _routeSlug }: { routeSlug?: string }) {
  const [, navigate] = useLocation();
  const [drawerOpen, setDrawerOpen]  = useState(false);
  const [activeNav,  setActiveNav]   = useState("rehber");
  const [search,     setSearch]      = useState("");
  const [toast,      setToast]       = useState({ message: "", visible: false });
  const [newsEmail,  setNewsEmail]   = useState("");
  const [cartCount,  setCartCount]   = useState(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { isLoggedIn } = useCustomer();

  useEffect(() => { document.title = "Poodle Rehberi | YourPoodle"; }, []);

  /* cart badge */
  useEffect(() => {
    const read = () => {
      try {
        const c = JSON.parse(localStorage.getItem("yp_cart_items") || "[]");
        setCartCount(Array.isArray(c) ? c.reduce((s: number, i: any) => s + (i.qty || 0), 0) : 0);
      } catch { setCartCount(0); }
    };
    read();
    window.addEventListener("storage", read);
    const t = setInterval(read, 500);
    return () => { window.removeEventListener("storage", read); clearInterval(t); };
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const go = (href: string) => { navigate(href); setDrawerOpen(false); };

  const showToast = (msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message: msg, visible: true });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
  };

  /* filter sections by search */
  const filtered = search.trim() === ""
    ? SECTIONS
    : SECTIONS.map(s => ({
        ...s,
        items: s.items.filter(item => item.toLowerCase().includes(search.toLowerCase())),
      })).filter(s => s.items.length > 0 || s.name.toLowerCase().includes(search.toLowerCase()));

  /* Top tabs */
  const TOP_TABS = [
    { key: "magaza", label: "Mağaza",     Icon: ShoppingBag,       href: "/yourpoodle/magaza"     },
    { key: "club",   label: "Club",       Icon: PawPrint,           href: "/yourpoodle/topluluk"   },
    { key: "ai",     label: "AI Asistan", Icon: MessageCirclePlus,  href: "/yourpoodle/ai-asistan" },
    { key: "rehber", label: "Rehber",     Icon: BookOpen,           href: "/yourpoodle/rehber"     },
  ];

  /* Bottom nav */
  const BOT_TABS = [
    { key: "anasayfa", label: "Ana Sayfa", Icon: HomeIcon,    href: "/yourpoodle"            },
    { key: "club",     label: "Club",      Icon: Users,       href: "/yourpoodle/topluluk"   },
    { key: "magaza",   label: "Mağaza",    Icon: ShoppingBag, href: "/yourpoodle/magaza"     },
    { key: "ai",       label: "AI",        Icon: Bot,         href: "/yourpoodle/ai-asistan" },
  ];

  return (
    <div style={{ fontFamily: "'Inter',-apple-system,sans-serif", background: "#fff", minHeight: "100vh", color: "#111827", maxWidth: 480, margin: "0 auto" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'); *{box-sizing:border-box;} body{margin:0;}`}</style>

      <Toast message={toast.message} visible={toast.visible} />

      {/* ── Drawer backdrop ── */}
      {drawerOpen && (
        <div onClick={() => setDrawerOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 500 }} />
      )}
      {/* ── Drawer panel ── */}
      <div style={{
        position: "fixed", top: 0, left: 0, height: "100%", width: 288, background: "#fff",
        zIndex: 501, transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.25s ease", boxShadow: "4px 0 24px rgba(0,0,0,0.18)",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 16px 14px", borderBottom: `1px solid ${GB}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img src="/images/yp-poodle-hero.png" alt="YourPoodle Logo" loading="lazy"
              style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
            <span style={{ fontWeight: 700, fontSize: 16, color: P }}>YourPoodle</span>
          </div>
          <button onClick={() => setDrawerOpen(false)} aria-label="Menüyü kapat"
            style={{ background: "none", border: "none", cursor: "pointer", minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={20} color="#374151" />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {[
            { label: "Mağaza",     href: "/yourpoodle/magaza"     },
            { label: "Club",       href: "/yourpoodle/topluluk"   },
            { label: "AI Asistan", href: "/yourpoodle/ai-asistan" },
            { label: "Rehber",     href: "/yourpoodle/rehber"     },
          ].map(l => (
            <button key={l.href} onClick={() => go(l.href)}
              style={{ display: "block", width: "100%", padding: "14px 20px", fontSize: 15, fontWeight: 500, color: "#1F2937", background: "none", border: "none", borderBottom: `1px solid ${GB}`, cursor: "pointer", textAlign: "left", fontFamily: "inherit", minHeight: 44 }}>
              {l.label}
            </button>
          ))}
        </div>
        <div style={{ padding: 16, borderTop: `1px solid ${GB}`, display: "flex", flexDirection: "column", gap: 8 }}>
          <button onClick={() => go(isLoggedIn ? "/hesabim" : "/yourpoodle/giris")}
            style={{ width: "100%", padding: "10px 0", fontSize: 14, fontWeight: 500, color: "#374151", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "center" }}>
            Giriş Yap
          </button>
          <button onClick={() => go("/yourpoodle/giris")}
            style={{ width: "100%", padding: "12px 0", background: P, color: "#fff", border: "none", borderRadius: 999, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            Üye Ol
          </button>
        </div>
      </div>

      {/* ── Sticky header + top tabs ── */}
      <header style={{ position: "sticky", top: 0, zIndex: 400, background: "#fff" }}>
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 56, padding: "0 16px", borderBottom: `1px solid ${GB}` }}>
          <button aria-label="Menü" onClick={() => setDrawerOpen(true)}
            style={{ background: "none", border: "none", cursor: "pointer", minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
            <Menu size={22} color="#374151" />
          </button>
          <button onClick={() => go("/yourpoodle")} aria-label="Ana sayfa"
            style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <img src="/images/yp-poodle-hero.png" alt="YourPoodle Logo" loading="lazy"
              style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }} />
            <span style={{ fontWeight: 700, fontSize: 18, color: P }}>YourPoodle</span>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => go(isLoggedIn ? "/hesabim" : "/yourpoodle/giris")}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#374151", fontFamily: "inherit", whiteSpace: "nowrap" }}>
              {isLoggedIn ? "Hesabım" : "Giriş Yap"}
            </button>
            <button onClick={() => go("/yourpoodle/giris")}
              style={{ background: `linear-gradient(135deg,${P} 0%,#4F46E5 100%)`, color: "#fff", fontSize: 13, fontWeight: 500, padding: "6px 16px", borderRadius: 999, border: "none", cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit" }}>
              Üye Ol
            </button>
          </div>
        </div>
        {/* Top tab nav — Rehber active */}
        <div style={{ display: "flex", borderBottom: `1px solid ${GB}`, background: "#fff" }}>
          {TOP_TABS.map(({ key, label, Icon, href }) => {
            const active = key === "rehber";
            return (
              <button key={key} onClick={() => go(href)}
                style={{
                  flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                  padding: "10px 0", border: "none", background: "none", cursor: "pointer", fontFamily: "inherit",
                  borderBottom: active ? `2px solid ${P}` : "2px solid transparent",
                  color: active ? P : "#9CA3AF", fontWeight: active ? 600 : 500, transition: "color 0.15s",
                }}>
                <Icon size={20} />
                <span style={{ fontSize: 11 }}>{label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* ── Main content ── */}
      <main style={{ padding: "20px 16px 16px", paddingBottom: 96 }}>

        {/* Search bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 0,
          border: `1px solid ${GB}`, borderRadius: 12,
          background: "#F9FAFB", marginBottom: 20, overflow: "hidden",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0 12px" }}>
            <Search size={18} color="#9CA3AF" />
          </div>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Poodle rehberinde ara..."
            style={{
              flex: 1, background: "none", border: "none", outline: "none",
              fontSize: 14, color: "#111827", padding: "12px 0", fontFamily: "inherit",
            }}
          />
          <button
            onClick={() => alert("Filtre seçenekleri yakında!")}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "0 14px", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
            <SlidersHorizontal size={18} color="#6B7280" />
          </button>
        </div>

        {/* Quick category pills */}
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          {SECTIONS.map(s => (
            <QuickPill key={s.id} section={s}
              onClick={() => {
                const el = document.getElementById(`section-${s.id}`);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }} />
          ))}
        </div>

        {/* Section cards */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#6B7280" }}>
            <p style={{ fontSize: 15 }}>Aramanızla eşleşen konu bulunamadı.</p>
            <button onClick={() => setSearch("")}
              style={{ marginTop: 12, background: "none", border: "none", color: P, fontSize: 14, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
              Aramayı temizle
            </button>
          </div>
        ) : (
          filtered.map(s => (
            <div id={`section-${s.id}`} key={s.id}>
              <SectionCard section={s} />
            </div>
          ))
        )}
      </main>

      {/* ── Footer ── */}
      <footer style={{ background: FBG, color: "#fff" }}>

        {/* Newsletter */}
        <div style={{ margin: "0 16px", borderRadius: 16, padding: 20, background: NL }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 4px" }}>Poodle dünyasından haberdar olun</h3>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: "0 0 16px", lineHeight: 1.5 }}>
            Kampanyalar, yeni ürünler ve Poodle ipuçları e-postanıza gelsin.
          </p>
          <div style={{ display: "flex" }}>
            <input type="email" value={newsEmail} onChange={e => setNewsEmail(e.target.value)}
              placeholder="E-posta adresiniz"
              style={{ flex: 1, background: "#fff", color: "#111827", borderRadius: "999px 0 0 999px", padding: "10px 16px", fontSize: 13, border: "none", outline: "none", fontFamily: "inherit" }} />
            <button
              onClick={() => {
                if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsEmail)) {
                  showToast("Bültene kaydoldunuz ✓");
                  setNewsEmail("");
                } else {
                  showToast("Geçerli bir e-posta girin");
                }
              }}
              style={{ background: "#4F46E5", color: "#fff", fontWeight: 600, fontSize: 13, padding: "10px 20px", borderRadius: "0 999px 999px 0", border: "none", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#4338CA"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#4F46E5"; }}>
              Üye Ol
            </button>
          </div>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", margin: "8px 0 0" }}>
            Kayıt olarak KVKK Aydınlatma Metni'ni kabul etmiş olursunuz.
          </p>
        </div>

        {/* Branding */}
        <div style={{ padding: "24px 16px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <img src="/images/yp-poodle-hero.png" alt="YourPoodle" loading="lazy"
              style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
            <span style={{ fontWeight: 700, fontSize: 17 }}>YourPoodle</span>
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: "0 0 20px", lineHeight: 1.6 }}>
            Toy Poodle sahipleri için mutlu ve sağlıklı bir yaşam platformu.
          </p>
        </div>

        {/* Accordion */}
        <div style={{ padding: "0 16px" }}>
          <FooterAccordion />
        </div>

        {/* Contact */}
        <div style={{ padding: "16px 16px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Mail size={16} color="rgba(255,255,255,0.7)" />
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>destek@yourpoodle.com</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Clock size={16} color="rgba(255,255,255,0.7)" />
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>Pzt–Cmt 09.00–18.00</span>
          </div>
        </div>

        {/* Social */}
        <div style={{ padding: "24px 16px 0", textAlign: "center" }}>
          <p style={{ fontSize: 13, fontWeight: 600, margin: "0 0 12px" }}>Bizi Takip Edin</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
            {[
              { Icon: Instagram, label: "Instagram" },
              { Icon: Youtube,   label: "YouTube"   },
              { Icon: Music2,    label: "TikTok"    },
              { Icon: Facebook,  label: "Facebook"  },
            ].map(({ Icon, label }) => (
              <a key={label} href="#" aria-label={label}
                style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", cursor: "pointer", textDecoration: "none" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Trust & Payment */}
        <div style={{ padding: "24px 16px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ShieldCheck size={16} color="rgba(255,255,255,0.6)" />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>256-bit SSL ile güvenli alışveriş</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["VISA", "Mastercard", "TROY"].map(b => (
              <span key={b} style={{ background: "#fff", color: "#374151", fontSize: 11, fontWeight: 700, padding: "4px 8px", borderRadius: 4 }}>{b}</span>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div style={{ padding: "24px 16px", borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: 24 }}>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", textAlign: "center", margin: "0 0 8px" }}>
            © 2026 YourPoodle. Tüm hakları saklıdır.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
            {["Gizlilik", "Çerezler", "KVKK"].map(l => (
              <span key={l} style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", cursor: "pointer" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}>
                {l}
              </span>
            ))}
          </div>
        </div>
      </footer>

      {/* ── Fixed bottom nav ── */}
      <nav style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 480, background: "#fff", borderTop: `1px solid ${GB}`,
        boxShadow: "0 -4px 16px rgba(0,0,0,0.08)", display: "flex",
        alignItems: "flex-end", height: 64, zIndex: 900, paddingBottom: 4,
      }}>
        {/* Left 2 */}
        {BOT_TABS.slice(0, 2).map(({ key, label, Icon, href }) => {
          const active = activeNav === key;
          return (
            <button key={key} onClick={() => { setActiveNav(key); go(href); }}
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", gap: 3, paddingBottom: 8, border: "none", background: "none", cursor: "pointer", fontFamily: "inherit", color: active ? P : "#9CA3AF" }}>
              <Icon size={22} strokeWidth={active ? 2 : 1.5} />
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, borderBottom: active ? `2px solid ${P}` : "2px solid transparent", paddingBottom: 1, lineHeight: 1.2 }}>
                {label}
              </span>
            </button>
          );
        })}

        {/* Center — Sepetim */}
        <button onClick={() => { setActiveNav("sepetim"); go("/yourpoodle/sepet"); }}
          style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", gap: 3, paddingBottom: 8, border: "none", background: "none", cursor: "pointer", fontFamily: "inherit", position: "relative", color: activeNav === "sepetim" ? P : "#111827" }}>
          <div style={{ position: "absolute", bottom: 28, width: 56, height: 56, borderRadius: "50%", background: P, boxShadow: `0 0 0 6px rgba(98,0,238,0.15), 0 4px 16px rgba(98,0,238,0.35)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ShoppingCart size={26} color="#fff" strokeWidth={2} />
            {cartCount > 0 && (
              <span style={{ position: "absolute", top: 4, right: 4, background: "#EF4444", color: "#fff", fontSize: 9, fontWeight: 800, width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff" }}>
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, marginTop: 2 }}>Sepetim</span>
        </button>

        {/* Right 2 */}
        {BOT_TABS.slice(2).map(({ key, label, Icon, href }) => {
          const active = activeNav === key;
          return (
            <button key={key} onClick={() => { setActiveNav(key); go(href); }}
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", gap: 3, paddingBottom: 8, border: "none", background: "none", cursor: "pointer", fontFamily: "inherit", color: active ? P : "#9CA3AF" }}>
              <Icon size={22} strokeWidth={active ? 2 : 1.5} />
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, borderBottom: active ? `2px solid ${P}` : "2px solid transparent", paddingBottom: 1, lineHeight: 1.2 }}>
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
