import { useState } from "react";

const P = "#5A2D91";
const PD = "#3D1A6E";
const PL = "#F3EEFF";

/* ── DATA ── */
const PRODUCTS = [
  { name: "Pro Plan Puppy Small Tavuklu",  brand: "Purina",      kg: "3 kg",  price: 799,  old: 949,  img: "/product-images/yp-2717.jpg" },
  { name: "Royal Canin X-Small Adult",     brand: "Royal Canin", kg: "1.5 kg",price: 529,  old: null, img: "/product-images/yp-2716.jpg" },
  { name: "N&D Quinoa Skin & Coat",        brand: "Farmina",     kg: "800 g", price: 349,  old: 429,  img: "/product-images/yp-2721.png" },
  { name: "Hill's Science Plan Puppy",     brand: "Hill's",      kg: "3 kg",  price: 749,  old: null, img: "/product-images/yp-2718.jpg" },
  { name: "Orijen Small Breed Yetişkin",   brand: "Orijen",      kg: "2 kg",  price: 899,  old: 999,  img: "/product-images/yp-2719.jpg" },
  { name: "Acana Light & Fit Küçük Irk",  brand: "Acana",       kg: "2 kg",  price: 769,  old: null, img: "/product-images/yp-2720.png" },
];

const GUIDES = [
  { title: "Toy Poodle Tüy Bakımı Nasıl Yapılır?",      min: 5, img: "/images/poodle-avatar-1.jpg", tag: "Bakım" },
  { title: "Doğru Mama Seçimi: Yavru & Yetişkin",       min: 6, img: "/images/poodle-avatar-2.jpg", tag: "Beslenme" },
  { title: "Gözyaşı Lekeleri Neden Oluşur?",            min: 4, img: "/images/poodle-avatar-3.jpg", tag: "Sağlık" },
];

const NAV_ITEMS = ["Mama", "Bakım", "Aksesuar", "Giyim", "Oyuncak", "Sağlık"];

/* ── Heart Button ── */
function Heart({ size = 14 }: { size?: number }) {
  const [on, set] = useState(false);
  return (
    <button onClick={e => { e.stopPropagation(); set(v => !v); }}
      style={{ background: "rgba(255,255,255,0.93)", border: "none", borderRadius: "50%",
               width: size + 18, height: size + 18, display: "flex", alignItems: "center",
               justifyContent: "center", cursor: "pointer",
               boxShadow: "0 1px 5px rgba(0,0,0,0.13)" }}>
      <svg width={size} height={size} viewBox="0 0 24 24"
        fill={on ? "#E53935" : "none"} stroke={on ? "#E53935" : "#9CA3AF"} strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}

/* ── Product Card ── */
function ProductCard({ p }: { p: typeof PRODUCTS[0] }) {
  const disc = p.old ? Math.round((1 - p.price / p.old) * 100) : null;
  return (
    <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(90,45,145,0.09)",
                  border: "1px solid #EDE8F8", display: "flex", flexDirection: "column" }}>
      {/* image */}
      <div style={{ position: "relative", background: "#F7F3FF", aspectRatio: "1/1" }}>
        <img src={p.img} alt={p.name}
          style={{ width: "100%", height: "100%", objectFit: "contain", padding: 10 }}
          onError={e => { (e.target as HTMLImageElement).style.opacity = "0"; }} />
        {disc && (
          <span style={{ position: "absolute", top: 8, left: 8, background: "#E53935",
                         color: "#fff", fontSize: 10, fontWeight: 800,
                         padding: "3px 8px", borderRadius: 99 }}>
            −{disc}%
          </span>
        )}
        <div style={{ position: "absolute", top: 8, right: 8 }}><Heart /></div>
      </div>
      {/* info */}
      <div style={{ padding: "11px 11px 13px", flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: P, textTransform: "uppercase",
                       letterSpacing: 0.5 }}>{p.brand}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#111", lineHeight: 1.35,
                       display: "-webkit-box", WebkitLineClamp: 2,
                       WebkitBoxOrient: "vertical" as any, overflow: "hidden" }}>{p.name}</span>
        <span style={{ fontSize: 11, color: "#9CA3AF" }}>{p.kg}</span>
        <div style={{ display: "inline-flex", background: PL, borderRadius: 6,
                      padding: "2px 8px", fontSize: 10, fontWeight: 700, color: P,
                      width: "fit-content", marginTop: 2 }}>3 Taksit</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 4 }}>
          <span style={{ fontSize: 17, fontWeight: 900, color: "#111" }}>
            {p.price.toLocaleString("tr-TR")} TL
          </span>
          {p.old && (
            <span style={{ fontSize: 11, color: "#9CA3AF", textDecoration: "line-through" }}>
              {p.old.toLocaleString("tr-TR")} TL
            </span>
          )}
        </div>
        <button style={{ marginTop: 8, width: "100%", background: P, color: "#fff",
                         border: "none", borderRadius: 10, padding: "10px 0",
                         fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          Sepete Ekle
        </button>
      </div>
    </div>
  );
}

/* ── Footer Accordion ── */
function Accordion({ title, items }: { title: string; items: string[] }) {
  const [open, set] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <button onClick={() => set(v => !v)}
        style={{ width: "100%", background: "none", border: "none", color: "#fff",
                 display: "flex", justifyContent: "space-between", alignItems: "center",
                 padding: "13px 0", fontSize: 14, fontWeight: 700,
                 cursor: "pointer", fontFamily: "inherit" }}>
        {title} <span style={{ fontSize: 20, fontWeight: 300 }}>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div style={{ paddingBottom: 12, display: "flex", flexDirection: "column", gap: 9 }}>
          {items.map(it => (
            <span key={it} style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", cursor: "pointer" }}>{it}</span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════ */
export default function YourPoodleDemo2() {
  const [email, setEmail] = useState("");
  const [activeNav, setActiveNav] = useState("Mama");

  return (
    <div style={{ minHeight: "100dvh", background: "#EDEBF5",
                  display: "flex", justifyContent: "center",
                  fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 430, background: "#FAFAFA", minHeight: "100dvh" }}>

        {/* ════════ HEADER ════════ */}
        <header style={{ position: "sticky", top: 0, zIndex: 999,
                         background: "#fff", borderBottom: "1px solid #EDE8F8",
                         padding: "10px 16px",
                         display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, overflow: "hidden",
                          background: PL, flexShrink: 0 }}>
              <img src="/images/poodle-avatar-3.jpg" alt="logo"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>
            <span style={{ fontSize: 18, fontWeight: 900, color: P, letterSpacing: -0.3 }}>YourPoodle</span>
          </div>
          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer" }}>Giriş Yap</span>
            <button style={{ background: P, color: "#fff", border: "none", borderRadius: 99,
                             padding: "8px 18px", fontSize: 13, fontWeight: 700,
                             cursor: "pointer", fontFamily: "inherit" }}>Üye Ol</button>
          </div>
        </header>

        {/* ════════ HEADER ALTI MENÜ ════════ */}
        <div style={{ background: "#fff", borderBottom: "1px solid #EDE8F8",
                      overflowX: "auto", WebkitOverflowScrolling: "touch" as any,
                      scrollbarWidth: "none" }}>
          <div style={{ display: "flex", padding: "0 12px", gap: 0, width: "max-content" }}>
            {NAV_ITEMS.map(n => {
              const active = activeNav === n;
              return (
                <button key={n} onClick={() => setActiveNav(n)}
                  style={{ background: "none", border: "none", cursor: "pointer",
                           fontFamily: "inherit", padding: "11px 14px",
                           fontSize: 13, fontWeight: active ? 800 : 500,
                           color: active ? P : "#6B7280",
                           borderBottom: active ? `2.5px solid ${P}` : "2.5px solid transparent",
                           whiteSpace: "nowrap" }}>
                  {n}
                </button>
              );
            })}
          </div>
        </div>

        {/* ════════ BANNER / HERO ════════ */}
        <div style={{ padding: "14px 12px 0" }}>
          <div style={{ background: `linear-gradient(135deg, ${PD} 0%, ${P} 55%, #8B5CF6 100%)`,
                        borderRadius: 20, padding: "26px 20px 0",
                        position: "relative", overflow: "hidden", minHeight: 210 }}>
            {/* bg blobs */}
            <div style={{ position: "absolute", width: 180, height: 180, borderRadius: "50%",
                          background: "rgba(255,255,255,0.07)", top: -60, right: -40, pointerEvents: "none" }} />
            <div style={{ position: "absolute", width: 100, height: 100, borderRadius: "50%",
                          background: "rgba(255,255,255,0.05)", bottom: -20, left: -20, pointerEvents: "none" }} />

            <div style={{ position: "relative", zIndex: 1, maxWidth: "58%" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.65)",
                            letterSpacing: 0.5, marginBottom: 8, textTransform: "uppercase" }}>
                Türkiye'nin en büyük Poodle topluluğu
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: "#fff", lineHeight: 1.2,
                           marginBottom: 8, letterSpacing: -0.3 }}>
                Toy Poodle'ınız için her şey burada.
              </h1>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.72)", marginBottom: 20, lineHeight: 1.5 }}>
                Bilgi, alışveriş ve gerçek bir topluluk — tek bir yerde.
              </p>
              <button style={{ background: "#fff", color: P, border: "none",
                               borderRadius: 99, padding: "10px 20px",
                               fontSize: 13, fontWeight: 800, cursor: "pointer",
                               fontFamily: "inherit", marginBottom: 26,
                               boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                Topluluğa Katıl
              </button>
            </div>

            <img src="/images/poodle-hero.jpg" alt="Toy Poodle"
              style={{ position: "absolute", bottom: 0, right: 0,
                       height: 210, width: "auto", objectFit: "contain",
                       objectPosition: "bottom" }} />
          </div>
        </div>

        {/* ════════ 100 TL BONUS ════════ */}
        <div style={{ padding: "12px 12px 0" }}>
          <div style={{
            background: "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)",
            borderRadius: 16, padding: "16px 18px",
            display: "flex", alignItems: "center", gap: 14,
          }}>
            <div style={{ fontSize: 36, flexShrink: 0 }}>🎁</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: "#fff", marginBottom: 3 }}>
                Yeni üyelere 100 TL bonus!
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", lineHeight: 1.4 }}>
                Hemen üye ol, ilk alışverişinde kullan.
              </div>
            </div>
            <button style={{ background: "#fff", color: "#D97706", border: "none",
                             borderRadius: 99, padding: "9px 16px",
                             fontSize: 12, fontWeight: 800, cursor: "pointer",
                             fontFamily: "inherit", flexShrink: 0,
                             boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
              Üye Ol
            </button>
          </div>
        </div>

        {/* ════════ ÜRÜNLER — 3 SIRA × 2 ════════ */}
        <div style={{ padding: "24px 12px 0" }}>
          {/* section header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 16, fontWeight: 900, color: "#111" }}>Öne Çıkan Ürünler</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: P, cursor: "pointer" }}>Tümünü Gör →</span>
          </div>
          <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 14 }}>
            Poodle'ınıza özel en çok satanlar
          </div>

          {/* 3 rows × 2 cols */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {PRODUCTS.map(p => <ProductCard key={p.name} p={p} />)}
          </div>
        </div>

        {/* ════════ REHBERDEN KESİTLER ════════ */}
        <div style={{ padding: "28px 12px 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 16, fontWeight: 900, color: "#111" }}>Poodle Rehberi</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: P, cursor: "pointer" }}>Tümünü Gör →</span>
          </div>
          <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 14 }}>
            Uzmanlardan güvenilir bilgiler
          </div>

          <div style={{ background: "#fff", borderRadius: 16,
                        border: "1px solid #EDE8F8",
                        boxShadow: "0 2px 10px rgba(90,45,145,0.07)", overflow: "hidden" }}>
            {GUIDES.map((g, i) => (
              <div key={g.title} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "14px 14px",
                borderBottom: i < GUIDES.length - 1 ? "1px solid #F5F0FF" : "none",
                cursor: "pointer",
              }}>
                <div style={{ width: 60, height: 60, borderRadius: 12, overflow: "hidden",
                              flexShrink: 0, background: PL }}>
                  <img src={g.img} alt={g.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "inline-flex", background: PL, borderRadius: 99,
                                padding: "2px 8px", fontSize: 10, fontWeight: 700, color: P,
                                marginBottom: 4 }}>{g.tag}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#111",
                                lineHeight: 1.3, marginBottom: 5 }}>{g.title}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                      stroke="#9CA3AF" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span style={{ fontSize: 11, color: "#9CA3AF" }}>{g.min} dk okuma</span>
                  </div>
                </div>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="#C4B5FD" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* ════════ CLUB KISMI ════════ */}
        <div style={{ padding: "28px 12px 0" }}>
          <div style={{ background: `linear-gradient(135deg, ${PD} 0%, ${P} 100%)`,
                        borderRadius: 20, padding: "28px 22px", position: "relative", overflow: "hidden" }}>
            {/* blob */}
            <div style={{ position: "absolute", width: 160, height: 160, borderRadius: "50%",
                          background: "rgba(255,255,255,0.07)", top: -50, right: -40, pointerEvents: "none" }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6,
                            background: "rgba(255,255,255,0.15)", borderRadius: 99,
                            padding: "4px 12px", marginBottom: 14 }}>
                <span style={{ fontSize: 14 }}>🐩</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.9)",
                               textTransform: "uppercase", letterSpacing: 0.8 }}>YourPoodle Club</span>
              </div>

              <h3 style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 10, lineHeight: 1.2 }}>
                Topluluğa katıl,<br />farkı hisset.
              </h3>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.72)", marginBottom: 20, lineHeight: 1.6 }}>
                Poodle profilini oluştur, 10.000+ üye ile deneyim paylaş, özel indirimlerden yararlan.
              </p>

              {/* features */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
                {[
                  "🐾 Poodle profilin ve bakım takvimin",
                  "💬 Uzman cevaplamalı soru-cevap",
                  "🏷️ Üyelere özel fiyatlar & kampanyalar",
                  "✨ Kişiselleştirilmiş bakım önerileri",
                ].map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 8,
                                        fontSize: 13, color: "rgba(255,255,255,0.85)" }}>
                    <span style={{ flexShrink: 0 }}>{f}</span>
                  </div>
                ))}
              </div>

              <button style={{ width: "100%", background: "#fff", color: P, border: "none",
                               borderRadius: 12, padding: "13px 0", fontSize: 14, fontWeight: 800,
                               cursor: "pointer", fontFamily: "inherit",
                               boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
                Ücretsiz Üye Ol 🎉
              </button>
            </div>
          </div>

          {/* stats strip */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 12 }}>
            {[
              { n: "10K+", label: "Aktif Üye" },
              { n: "500+", label: "Rehber" },
              { n: "4.9★", label: "Ortalama Puan" },
            ].map(s => (
              <div key={s.label} style={{ background: "#fff", borderRadius: 14,
                                          border: "1px solid #EDE8F8",
                                          boxShadow: "0 2px 8px rgba(90,45,145,0.07)",
                                          padding: "14px 10px", textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: P }}>{s.n}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ════════ NEWSLETTER ════════ */}
        <div style={{ padding: "24px 12px 0" }}>
          <div style={{ background: PD, borderRadius: 20, padding: "24px 18px" }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#fff", textAlign: "center", marginBottom: 6 }}>
              Poodle dünyasından haberdar olun
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", textAlign: "center",
                          marginBottom: 16, lineHeight: 1.5 }}>
              Rehberler, kampanyalar ve özel fırsatlar e-postanıza gelsin.
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <input value={email} onChange={e => setEmail(e.target.value)}
                placeholder="E-posta adresiniz"
                style={{ flex: 1, border: "none", borderRadius: 10, padding: "11px 14px",
                         fontSize: 13, fontFamily: "inherit",
                         background: "rgba(255,255,255,0.12)", color: "#fff",
                         outline: "none" }} />
              <button style={{ background: "#fff", color: P, border: "none",
                               borderRadius: 10, padding: "11px 18px",
                               fontSize: 13, fontWeight: 800, cursor: "pointer",
                               fontFamily: "inherit", flexShrink: 0 }}>
                Üye Ol
              </button>
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.40)", textAlign: "center" }}>
              Üye olarak KVKK Aydınlatma Metni'ni kabul etmiş olursunuz.
            </div>
          </div>
        </div>

        {/* ════════ FOOTER ════════ */}
        <footer style={{ background: PD, marginTop: 28, padding: "32px 20px 32px" }}>
          {/* logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, overflow: "hidden",
                          background: "rgba(255,255,255,0.15)" }}>
              <img src="/images/poodle-avatar-3.jpg" alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>
            <span style={{ fontSize: 17, fontWeight: 900, color: "#fff" }}>YourPoodle</span>
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.50)", lineHeight: 1.6, marginBottom: 24 }}>
            Toy Poodle'ınızın mutlu ve sağlıklı yaşamı için<br />
            alışveriş, bilgi ve topluluk platformu.
          </p>

          {[
            { title: "YourPoodle", items: ["Hakkımızda", "Blog", "Kariyer", "Basın"] },
            { title: "Alışveriş",  items: ["Mama", "Aksesuar", "Bakım Ürünleri", "Kampanyalar"] },
            { title: "Yardım",     items: ["SSS", "Kargo Takibi", "İade & Değişim", "İletişim"] },
            { title: "Yasal",      items: ["Gizlilik", "Çerezler", "KVKK", "Kullanım Koşulları"] },
          ].map(m => <Accordion key={m.title} title={m.title} items={m.items} />)}

          {/* contact */}
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 6, marginBottom: 22 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>📧 destek@yourpoodle.com</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>🕐 Pzt–Cmt 09.00–18.00</span>
          </div>

          {/* social */}
          <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
            {[["📷","Instagram"], ["▶️","YouTube"], ["♪","TikTok"], ["👤","Facebook"]].map(([ic, label]) => (
              <div key={label} title={label}
                style={{ width: 40, height: 40, borderRadius: 10,
                         background: "rgba(255,255,255,0.10)",
                         display: "flex", alignItems: "center",
                         justifyContent: "center", fontSize: 18, cursor: "pointer" }}>
                {ic}
              </div>
            ))}
          </div>

          {/* trust */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 18,
                        display: "flex", alignItems: "center",
                        justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 14 }}>🔒</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.50)" }}>256-bit SSL ile güvenli</span>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["VISA", "MC", "TROY"].map(b => (
                <div key={b} style={{ background: "rgba(255,255,255,0.12)", borderRadius: 6,
                                      padding: "4px 10px", fontSize: 9, fontWeight: 800, color: "#fff" }}>
                  {b}
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 10 }}>
              © 2026 YourPoodle. Tüm hakları saklıdır.
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
              {["Gizlilik", "Çerezler", "KVKK"].map(l => (
                <span key={l} style={{ fontSize: 11, color: "rgba(255,255,255,0.40)", cursor: "pointer" }}>{l}</span>
              ))}
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
