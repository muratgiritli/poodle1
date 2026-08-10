import { useState } from "react";

const P = "#5A2D91";
const PD = "#3D1A6E";
const PL = "#EDE7F6";

const FOOD = [
  { name: "Puppy Tavuklu",      kg: "2 kg", price: 799, img: "/product-images/yp-2717.jpg" },
  { name: "Adult Kuzu Etli",    kg: "2 kg", price: 799, img: "/product-images/yp-2716.jpg" },
  { name: "Somonlu Sensitive",  kg: "2 kg", price: 849, img: "/product-images/yp-2721.png" },
  { name: "Kısırlaştırılmış",   kg: "2 kg", price: 879, img: "/product-images/yp-2718.jpg" },
  { name: "Hair & Skin",        kg: "2 kg", price: 929, img: "/product-images/yp-2719.jpg" },
  { name: "Senior +7",          kg: "2 kg", price: 869, img: "/product-images/yp-2720.png" },
];

const ACCESSORIES = [
  { name: "Lavanta Elbise",           spec: "S-M beden",     price: 549, img: "/product-images/yp-2730.jpg",  badge: ""         },
  { name: "Air Mesh Göğüs Tasması",   spec: "Ayarlanabilir", price: 429, img: "/product-images/yp-2731.png",  badge: "Çok Satan"},
  { name: "Köpek Çiş Bezi",           spec: "121 içerik",    price: 249, img: "/product-images/yp-2732.jpg",  badge: ""         },
  { name: "Poodle Parfümü",           spec: "100 ml",        price: 319, img: "/product-images/yp-2733.jpg",  badge: ""         },
  { name: "Buharlı Masaj Tarağı",     spec: "USB şarjlı",    price: 399, img: "/product-images/yp-2737.jpg",  badge: ""         },
  { name: "Göz Yaşı Bakım Losyonu",  spec: "50 ml",          price: 289, img: "/product-images/yp-2734.jpg",  badge: "Çok Satan"},
];

const GUIDES = [
  { title: "Toy Poodle Tuvalet Eğitimi",        desc: "Adım adım kolay eğitim rehberi",           min: 5, img: "/images/poodle-avatar-1.jpg" },
  { title: "Doğru Mama Nasıl Seçilir?",         desc: "Yaşına ve ihtiyacına uygun mama seçimi",   min: 4, img: "/images/poodle-avatar-2.jpg" },
  { title: "Göz Yaşı Lekesi Bakımı",            desc: "Lekeleri azaltmak için günlük bakım",       min: 3, img: "/images/poodle-avatar-3.jpg" },
  { title: "Tüy Bakımı ve Tarama",              desc: "Düğümsüz, sağlıklı ve parlak tüyler",       min: 6, img: "/images/poodle-avatar-4.jpg" },
  { title: "Yavru Poodle Eve İlk Geldiğinde",   desc: "İlk günlerde yapmanız gerekenler",          min: 7, img: "/images/poodle-avatar-1.jpg" },
];

const FOOTER_MENUS = [
  { title: "YourPoodle", items: ["Hakkımızda", "Blog", "Kariyer", "Basın"] },
  { title: "Alışveriş",  items: ["Mama", "Aksesuar", "Bakım Ürünleri", "Kampanyalar"] },
  { title: "Yardım",     items: ["SSS", "Kargo Takibi", "İade & Değişim", "İletişim"] },
  { title: "Yasal",      items: ["Gizlilik Politikası", "Çerez Politikası", "KVKK", "Kullanım Koşulları"] },
];

function Fav() {
  const [on, set] = useState(false);
  return (
    <button onClick={e => { e.stopPropagation(); set(v => !v); }}
      style={{ position: "absolute", top: 8, right: 8, width: 30, height: 30,
               borderRadius: "50%", background: "rgba(255,255,255,0.92)",
               border: "none", cursor: "pointer", display: "flex",
               alignItems: "center", justifyContent: "center",
               boxShadow: "0 1px 4px rgba(0,0,0,0.12)" }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill={on ? "#E53935" : "none"}
        stroke={on ? "#E53935" : "#9CA3AF"} strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}

function ProductCard({ p, badge }: { p: typeof FOOD[0] & { spec?: string; badge?: string }; badge?: string }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden",
                  boxShadow: "0 1px 8px rgba(90,45,145,0.10)", border: "1px solid #F0EBF8",
                  display: "flex", flexDirection: "column" }}>
      <div style={{ position: "relative", background: "#FAF7F0", aspectRatio: "1/1" }}>
        <img src={p.img} alt={p.name}
          style={{ width: "100%", height: "100%", objectFit: "contain", padding: 10 }}
          onError={e => { (e.target as HTMLImageElement).style.opacity = "0"; }} />
        {(p.badge || badge) && (
          <span style={{ position: "absolute", top: 7, left: 7, background: "#E53935",
                         color: "#fff", fontSize: 9, fontWeight: 800,
                         padding: "3px 7px", borderRadius: 99 }}>
            {p.badge || badge}
          </span>
        )}
        <Fav />
      </div>
      <div style={{ padding: "10px 10px 12px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#111", lineHeight: 1.35, marginBottom: 3 }}>{p.name}</div>
        <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 6 }}>{(p as any).kg || (p as any).spec}</div>
        <div style={{ display: "inline-flex", background: "#EDE7F6", borderRadius: 6,
                      padding: "2px 8px", fontSize: 10, fontWeight: 700, color: P,
                      width: "fit-content", marginBottom: 6 }}>3 Taksit</div>
        <div style={{ fontSize: 17, fontWeight: 900, color: "#111", marginTop: "auto", marginBottom: 10 }}>
          {p.price.toLocaleString("tr-TR")} TL
        </div>
        <button style={{ width: "100%", background: P, color: "#fff", border: "none",
                         borderRadius: 10, padding: "9px 0", fontSize: 12, fontWeight: 700,
                         cursor: "pointer", fontFamily: "inherit" }}>
          Sepete Ekle
        </button>
      </div>
    </div>
  );
}

function SectionHeader({ title, sub, link }: { title: string; sub?: string; link?: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 16, fontWeight: 900, color: "#111" }}>{title}</span>
        {link && <span style={{ fontSize: 12, fontWeight: 700, color: P, cursor: "pointer" }}>{link}</span>}
      </div>
      {sub && <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function FooterAccordion({ title, items }: { title: string; items: string[] }) {
  const [open, set] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.10)" }}>
      <button onClick={() => set(v => !v)}
        style={{ width: "100%", background: "none", border: "none", color: "#fff",
                 display: "flex", justifyContent: "space-between", alignItems: "center",
                 padding: "14px 0", fontSize: 14, fontWeight: 700,
                 cursor: "pointer", fontFamily: "inherit" }}>
        {title}
        <span style={{ fontSize: 18, fontWeight: 300 }}>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div style={{ paddingBottom: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map(it => (
            <span key={it} style={{ fontSize: 13, color: "rgba(255,255,255,0.60)", cursor: "pointer" }}>{it}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function YourPoodleDemo() {
  const [email, setEmail] = useState("");
  const [activeNav, setActiveNav] = useState("Mağaza");

  const navItems = [
    { label: "Mağaza",     icon: "🛍️" },
    { label: "Club",       icon: "👥" },
    { label: "AI Asistan", icon: "✨" },
    { label: "Rehber",     icon: "📖" },
  ];

  return (
    <div style={{ background: "#F3F0F8", minHeight: "100dvh", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: "var(--yp-shell-max)", background: "#FAFAFA",
                    minHeight: "100dvh", fontFamily: "system-ui, -apple-system, sans-serif" }}>

        {/* ── HEADER ── */}
        <header style={{ position: "sticky", top: 0, zIndex: 999, background: "#fff",
                         borderBottom: "1px solid #F0EBF8", padding: "11px 16px",
                         display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, overflow: "hidden",
                          background: PL, flexShrink: 0 }}>
              <img src="/images/poodle-avatar-3.jpg" alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>
            <span style={{ fontSize: 18, fontWeight: 900, color: P, letterSpacing: -0.3 }}>YourPoodle</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer" }}>Giriş Yap</span>
            <button style={{ background: P, color: "#fff", border: "none", borderRadius: 99,
                             padding: "8px 18px", fontSize: 13, fontWeight: 700,
                             cursor: "pointer", fontFamily: "inherit" }}>Üye Ol</button>
          </div>
        </header>

        {/* ── ICON NAV ── */}
        <nav style={{ background: "#fff", borderBottom: "1px solid #F0EBF8",
                      display: "flex", justifyContent: "space-around" }}>
          {navItems.map(n => {
            const active = activeNav === n.label;
            return (
              <button key={n.label} onClick={() => setActiveNav(n.label)}
                style={{ flex: 1, background: "none", border: "none", cursor: "pointer",
                         padding: "10px 0 8px",
                         borderBottom: active ? `2.5px solid ${P}` : "2.5px solid transparent",
                         display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                         fontFamily: "inherit" }}>
                <span style={{ fontSize: 20 }}>{n.icon}</span>
                <span style={{ fontSize: 11, fontWeight: active ? 700 : 500,
                               color: active ? P : "#9CA3AF" }}>{n.label}</span>
              </button>
            );
          })}
        </nav>

        {/* ── HERO ── */}
        <div style={{ padding: "14px 12px 0" }}>
          <div style={{ background: `linear-gradient(130deg, ${PD} 0%, ${P} 100%)`,
                        borderRadius: 20, padding: "26px 20px 0",
                        position: "relative", overflow: "hidden", minHeight: 220 }}>
            {/* circles */}
            <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%",
                          background: "rgba(255,255,255,0.06)", top: -70, right: -50 }} />
            <div style={{ position: "absolute", width: 120, height: 120, borderRadius: "50%",
                          background: "rgba(255,255,255,0.05)", bottom: -30, left: -30 }} />

            <div style={{ position: "relative", zIndex: 1, maxWidth: "60%" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.70)",
                            marginBottom: 10, letterSpacing: 0.2 }}>
                Türkiye'nin en büyük Poodle topluluğu
              </div>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: "#fff", lineHeight: 1.2,
                           marginBottom: 10, letterSpacing: -0.3 }}>
                Toy Poodle'ınız için her şey burada.
              </h1>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.72)", marginBottom: 22, lineHeight: 1.5 }}>
                Bilgi, alışveriş ve gerçek bir topluluk — tek bir yerde.
              </p>
              <button style={{ background: "#fff", color: P, border: "none",
                               borderRadius: 99, padding: "11px 22px",
                               fontSize: 13, fontWeight: 800, cursor: "pointer",
                               fontFamily: "inherit", marginBottom: 26 }}>
                Topluluğa Katıl
              </button>
            </div>

            {/* poodle overflowing bottom-right */}
            <img src="/images/poodle-hero.jpg"
              alt="Toy Poodle"
              style={{ position: "absolute", bottom: 0, right: -4,
                       height: 220, width: "auto", objectFit: "contain",
                       objectPosition: "bottom" }} />
          </div>
        </div>

        {/* ── FOOD SECTION ── */}
        <div style={{ padding: "26px 12px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={P} strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            <span style={{ fontSize: 16, fontWeight: 900, color: "#111" }}>Peşin fiyatına 3 taksit</span>
          </div>
          <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 14 }}>Toy Poodle'ınıza özel seçilmiş mamalar</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {FOOD.map(p => <ProductCard key={p.name} p={p} />)}
          </div>
        </div>

        {/* ── GUIDE SECTION ── */}
        <div style={{ padding: "28px 12px 0" }}>
          <SectionHeader title="Poodle Rehberi"
            sub="Poodle'ınız için güvenilir ve pratik bilgiler"
            link="Tümünü Gör" />
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F0EBF8",
                        boxShadow: "0 1px 8px rgba(90,45,145,0.07)", overflow: "hidden" }}>
            {GUIDES.map((g, i) => (
              <div key={g.title} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "13px 14px",
                borderBottom: i < GUIDES.length - 1 ? "1px solid #F9F6FF" : "none",
                cursor: "pointer",
              }}>
                <div style={{ width: 56, height: 56, borderRadius: 12, overflow: "hidden",
                              flexShrink: 0, background: PL }}>
                  <img src={g.img} alt={g.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#111",
                                lineHeight: 1.3, marginBottom: 3 }}>{g.title}</div>
                  <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 5,
                                lineHeight: 1.3 }}>{g.desc}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                      stroke="#9CA3AF" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span style={{ fontSize: 11, color: "#9CA3AF" }}>{g.min} dk</span>
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="#D1D5DB" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* ── AI BANNER ── */}
        <div style={{ padding: "24px 12px 0" }}>
          <div style={{ background: PL, borderRadius: 16, padding: "22px 20px",
                        display: "flex", flexDirection: "column", alignItems: "center",
                        textAlign: "center", gap: 8 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: P,
                          display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="#fff" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div style={{ fontSize: 17, fontWeight: 900, color: "#111" }}>Cevabını hemen bul</div>
            <div style={{ fontSize: 12, color: "#6B7280", maxWidth: 260, lineHeight: 1.5 }}>
              Poodle'ınızla ilgili merak ettiğiniz her şeyi sorun.
            </div>
            <button style={{ width: "100%", background: PD, color: "#fff", border: "none",
                             borderRadius: 12, padding: "13px 0", fontSize: 13, fontWeight: 700,
                             cursor: "pointer", fontFamily: "inherit", marginTop: 4,
                             display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="#fff" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              AI Asistan'a Sor
            </button>
          </div>
        </div>

        {/* ── ACCESSORIES ── */}
        <div style={{ padding: "28px 12px 0" }}>
          <SectionHeader title="Poodle'ınıza Özel Ürünler"
            sub="Stil, bakım ve günlük ihtiyaçlar bir arada"
            link="Tümünü Gör" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {ACCESSORIES.map(p => <ProductCard key={p.name} p={p} />)}
          </div>
        </div>

        {/* ── NEWSLETTER ── */}
        <div style={{ padding: "28px 12px 0" }}>
          <div style={{ background: PD, borderRadius: 20, padding: "26px 18px" }}>
            <div style={{ fontSize: 17, fontWeight: 900, color: "#fff",
                          textAlign: "center", marginBottom: 6 }}>
              Poodle dünyasından haberdar olun
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)",
                          textAlign: "center", marginBottom: 16, lineHeight: 1.5 }}>
              Yeni rehberler, kampanyalar ve özel fırsatlar e-postanıza gelsin.
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <input value={email} onChange={e => setEmail(e.target.value)}
                placeholder="E-posta adresiniz"
                style={{ flex: 1, border: "none", borderRadius: 10, padding: "11px 14px",
                         fontSize: 13, fontFamily: "inherit",
                         background: "rgba(255,255,255,0.13)", color: "#fff", outline: "none" }} />
              <button style={{ background: "#fff", color: P, border: "none",
                               borderRadius: 10, padding: "11px 18px", fontSize: 13,
                               fontWeight: 800, cursor: "pointer", fontFamily: "inherit",
                               flexShrink: 0 }}>Üye Ol</button>
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", textAlign: "center" }}>
              Üye olarak KVKK Aydınlatma Metni'ni kabul etmiş olursunuz.
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer style={{ background: PD, marginTop: 28, padding: "32px 20px 28px" }}>
          {/* logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, overflow: "hidden",
                          background: "rgba(255,255,255,0.15)" }}>
              <img src="/images/poodle-avatar-3.jpg" alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>
            <span style={{ fontSize: 17, fontWeight: 900, color: "#fff" }}>YourPoodle</span>
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.6,
                      marginBottom: 24 }}>
            Toy Poodle'ınızın mutlu ve sağlıklı yaşamı için<br />
            alışveriş, bilgi ve topluluk platformu.
          </p>

          {FOOTER_MENUS.map(m => <FooterAccordion key={m.title} title={m.title} items={m.items} />)}

          {/* contact */}
          <div style={{ marginTop: 20, marginBottom: 20, display: "flex",
                        flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.60)" }}>📧 destek@yourpoodle.com</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.60)" }}>🕐 Pzt–Cmt 09.00–18.00</span>
          </div>

          {/* social */}
          <div style={{ display: "flex", gap: 12, marginBottom: 22 }}>
            {["📸", "▶️", "♪", "👤"].map((ic, i) => (
              <div key={i} style={{ width: 38, height: 38, borderRadius: 10,
                                    background: "rgba(255,255,255,0.12)",
                                    display: "flex", alignItems: "center",
                                    justifyContent: "center", fontSize: 17, cursor: "pointer" }}>
                {ic}
              </div>
            ))}
          </div>

          {/* trust + payment */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.10)", paddingTop: 16,
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="#A67C52" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>256-bit SSL ile güvenli alışveriş</span>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["VISA", "MC", "TROY"].map(b => (
                <div key={b} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 5,
                                      padding: "3px 8px", fontSize: 9, fontWeight: 800, color: "#fff" }}>
                  {b}
                </div>
              ))}
            </div>
          </div>

          {/* copyright */}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.40)", marginBottom: 8 }}>
              © 2026 YourPoodle. Tüm hakları saklıdır.
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 18 }}>
              {["Gizlilik", "Çerezler", "KVKK"].map(l => (
                <span key={l} style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", cursor: "pointer" }}>{l}</span>
              ))}
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
