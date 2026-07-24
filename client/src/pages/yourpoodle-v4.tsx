import { useState } from "react";
import { Link } from "wouter";
import { Search, MapPin, Star, ShoppingCart, Heart, ArrowRight, CheckCircle2, Users, BookOpen, ShieldCheck, Sparkles } from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";

const PUR = "#6C27BE";
const PUR2 = "#4A1A8A";

/* ── Data ── */
const DOORS = [
  {
    href: "/magaza", icon: "🛍️", label: "Mama Bul",
    desc: "Yaşına, kilosuna ve ihtiyacına uygun mamayı bul.",
    btn: "Mama Bul", color: PUR, bg: "#F5F0FF", border: "#C4B5FD",
  },
  {
    href: "/rehber", icon: "📖", label: "Poodle Rehberi",
    desc: "Bakım, eğitim, sağlık ve beslenme rehberleri.",
    btn: "Rehbere Git", color: "#059669", bg: "#ECFDF5", border: "#6EE7B7",
  },
  {
    href: "/mama-bul", icon: "✨", label: "AI Poodle Asistanı",
    desc: "Sorunu yaz, saniyeler içinde yol haritası al.",
    btn: "AI'a Sor", color: "#2563EB", bg: "#EFF6FF", border: "#93C5FD",
  },
  {
    href: "/hizmetler", icon: "📍", label: "Hizmet Bul",
    desc: "Veteriner, kuaför, eğitim, otel ve pet taksi.",
    btn: "Yakınımda Bul", color: "#DC2626", bg: "#FFF1F1", border: "#FCA5A5",
  },
];

const TRENDING = [
  "Gözyaşı Lekesi", "Tuvalet Eğitimi", "Doğru Mama Seçimi",
  "Tüy Bakımı", "Yalnız Kalma Eğitimi", "Yasak Yiyecekler",
];

const TRENDING_SLUGS: Record<string, string> = {
  "Gözyaşı Lekesi": "poodle-goz-yasi-lekesi-temizleme",
  "Tuvalet Eğitimi": "poodle-tuvalet-egitimi",
  "Doğru Mama Seçimi": "toy-poodle-en-iyi-mama-markalari-2026",
  "Tüy Bakımı": "poodle-tuy-bakimi-haftalik-rutin",
  "Yalnız Kalma Eğitimi": "poodle-yalniz-kalma-egitimi",
  "Yasak Yiyecekler": "poodle-icin-zararli-yiyecekler",
};

const AGE_OPTIONS = [
  { label: "Yavru", sub: "0 – 12 ay", icon: "🐾" },
  { label: "Yetişkin", sub: "1 – 7 yaş", icon: "🐩" },
  { label: "Senior", sub: "7+ yaş", icon: "🦮" },
  { label: "Henüz sahiplenmedim", sub: "", icon: "🤍" },
];

const PRODUCTS = [
  { id: "2717", name: "Pro Plan Puppy Small & Mini Tavuklu", price: 699, img: "/product-images/yp-2717.jpg", tag: "Yavru maması" },
  { id: "2716", name: "Royal Canin X-Small Adult 1.5 Kg",    price: 529, img: "/product-images/yp-2716.jpg", tag: "Gözyaşı bakım" },
  { id: "2721", name: "N&D Quinoa Skin & Coat 800 g",        price: 349, img: "/product-images/yp-2721.png", tag: "Tüy açıcı" },
  { id: "2737", name: "PetKit Havalandırmalı Sırt Çantası",  price: 849, img: "/product-images/yp-2737.jpg", tag: "Aksesuar" },
];

const TRUST = [
  { icon: CheckCircle2, label: "Doğrulanmış hizmet sağlayıcılar" },
  { icon: BookOpen,     label: "Uzman kontrolünden geçen rehberler" },
  { icon: Users,        label: "Gerçek Poodle sahiplerinin yorumları" },
  { icon: ShieldCheck,  label: "Güvenli alışveriş" },
];

const SEARCH_EXAMPLES = ["Gözyaşı lekesi nasıl geçer?", "Yavru köpek maması", "Yakınımdaki kuaför", "Tuvalet eğitimi"];

/* ── Small product card ── */
function PCard({ p }: { p: typeof PRODUCTS[0] }) {
  const [fav, setFav] = useState(false);
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: "#fff", borderRadius: 18, overflow: "hidden",
        boxShadow: hov ? "0 16px 48px rgba(108,39,190,0.14)" : "0 2px 16px rgba(0,0,0,0.07)",
        transform: hov ? "translateY(-5px)" : "none",
        transition: "all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
        display: "flex", flexDirection: "column",
      }}>
      <div style={{ position: "relative", background: "#F8F6FF", aspectRatio: "1/1", overflow: "hidden" }}>
        <img src={p.img} alt={p.name}
          style={{ width: "100%", height: "100%", objectFit: "contain", padding: 10,
                   transform: hov ? "scale(1.05)" : "scale(1)", transition: "transform 0.3s" }}
          onError={e => { (e.target as HTMLImageElement).style.opacity = "0.3"; }} />
        <div style={{
          position: "absolute", top: 8, left: 8, background: PUR, color: "#fff",
          fontSize: 10, fontWeight: 800, padding: "3px 9px", borderRadius: 99, letterSpacing: 0.4,
        }}>{p.tag}</div>
        <button onClick={e => { e.stopPropagation(); setFav(f => !f); }}
          style={{ position: "absolute", top: 8, right: 8, background: "#fff",
                   border: "none", borderRadius: "50%", width: 32, height: 32,
                   display: "flex", alignItems: "center", justifyContent: "center",
                   cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.10)" }}>
          <Heart size={14} fill={fav ? "#EF4444" : "none"} color={fav ? "#EF4444" : "#9CA3AF"} strokeWidth={2} />
        </button>
      </div>
      <div style={{ padding: "14px 14px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#111", lineHeight: 1.4,
                      display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any, overflow: "hidden" }}>
          {p.name}
        </div>
        <div style={{ fontSize: 19, fontWeight: 900, color: "#111", marginTop: "auto" }}>
          {p.price.toLocaleString("tr-TR")} TL
        </div>
        <button style={{
          width: "100%", background: PUR, color: "#fff", border: "none", borderRadius: 10,
          padding: "10px 0", fontSize: 13, fontWeight: 700, cursor: "pointer",
          fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}
          onMouseEnter={e => (e.currentTarget.style.background = PUR2)}
          onMouseLeave={e => (e.currentTarget.style.background = PUR)}>
          <ShoppingCart size={13} /> Sepete Ekle
        </button>
      </div>
    </div>
  );
}

export default function YourPoodleV4() {
  const [searchVal, setSearchVal] = useState("");
  const [selectedAge, setSelectedAge] = useState<string | null>(null);
  const [exIdx, setExIdx] = useState(0);

  return (
    <YPLayout>
      <div style={{ background: "#fff", minHeight: "100dvh" }}>

        {/* ══════════ 1. HERO ══════════ */}
        <section style={{
          background: `linear-gradient(160deg, #1E0845 0%, ${PUR} 55%, #9B59B6 100%)`,
          padding: "60px 24px 80px",
          position: "relative", overflow: "hidden",
          textAlign: "center",
        }}>
          {/* decorative blobs */}
          {[
            { w:320, h:320, t:-80, r:-80, op:0.07 },
            { w:200, h:200, b:-60, l:-40, op:0.06 },
            { w:150, h:150, t:40, l:"30%", op:0.04 },
          ].map((b, i) => (
            <div key={i} style={{
              position: "absolute", width: b.w, height: b.h, borderRadius: "50%",
              background: "#fff", opacity: b.op, pointerEvents: "none",
              top: (b as any).t, right: (b as any).r, bottom: (b as any).b, left: (b as any).l,
            }} />
          ))}

          <div style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto" }}>
            {/* poodle avatar */}
            <div style={{
              width: 88, height: 88, borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              border: "3px solid rgba(255,255,255,0.3)",
              overflow: "hidden", margin: "0 auto 20px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <img src="/images/poodle-hero-transparent.png" alt="Poodle"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={e => {
                  (e.target as HTMLImageElement).outerHTML = '<span style="font-size:48px">🐩</span>';
                }} />
            </div>

            {/* pill badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 99, padding: "6px 18px", marginBottom: 24,
            }}>
              <Sparkles size={14} color="#FFD700" fill="#FFD700" />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", letterSpacing: 1, textTransform: "uppercase" }}>
                Toy Poodle için tasarlandı
              </span>
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize: "clamp(30px, 5.5vw, 56px)", fontWeight: 900, color: "#fff",
              lineHeight: 1.1, letterSpacing: -1, marginBottom: 16,
            }}>
              Toy Poodle'ınız için<br />ihtiyacınız olan her şey
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.78)", marginBottom: 36, maxWidth: 500, margin: "0 auto 36px" }}>
              Doğru mamayı bulun, uzman rehberleri okuyun,<br />AI asistana sorun veya yakın hizmetleri keşfedin.
            </p>

            {/* Search bar */}
            <div style={{
              display: "flex", alignItems: "center", gap: 0,
              background: "#fff", borderRadius: 16, overflow: "hidden",
              boxShadow: "0 8px 40px rgba(0,0,0,0.25)",
              maxWidth: 560, margin: "0 auto",
            }}>
              <Search size={18} color="#9CA3AF" style={{ marginLeft: 18, flexShrink: 0 }} />
              <input
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder={SEARCH_EXAMPLES[exIdx]}
                onFocus={() => { const iv = setInterval(() => setExIdx(i => (i+1)%SEARCH_EXAMPLES.length), 2500); return () => clearInterval(iv); }}
                style={{
                  flex: 1, border: "none", outline: "none", padding: "16px 12px",
                  fontSize: 15, fontFamily: "inherit", background: "transparent", color: "#111",
                }}
              />
              <button style={{
                background: PUR, color: "#fff", border: "none",
                padding: "14px 24px", fontSize: 14, fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit", flexShrink: 0,
              }}>
                Ara
              </button>
            </div>
          </div>
        </section>

        {/* ══════════ 2. FOUR DOORS ══════════ */}
        <section style={{
          maxWidth: 1060, margin: "-36px auto 0",
          padding: "0 20px", position: "relative", zIndex: 2,
        }}>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16,
          }}>
            {DOORS.map(d => (
              <Link key={d.label} href={d.href}
                style={{
                  display: "flex", flexDirection: "column",
                  background: "#fff", borderRadius: 20, padding: "28px 20px 24px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
                  textDecoration: "none", border: "2px solid transparent",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = d.color;
                  el.style.transform = "translateY(-5px)";
                  el.style.boxShadow = `0 20px 48px ${d.color}22`;
                  el.style.background = d.bg;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "transparent";
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "0 8px 32px rgba(0,0,0,0.10)";
                  el.style.background = "#fff";
                }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 14, background: d.bg,
                  border: `1.5px solid ${d.border}`, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: 24, marginBottom: 16,
                }}>
                  {d.icon}
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#111", marginBottom: 8, lineHeight: 1.2 }}>
                  {d.label}
                </div>
                <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.5, flex: 1, marginBottom: 20 }}>
                  {d.desc}
                </div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: d.color, color: "#fff",
                  fontSize: 12, fontWeight: 700, padding: "8px 16px",
                  borderRadius: 10, alignSelf: "flex-start",
                }}>
                  {d.btn} <ArrowRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ══════════ 3. CLUB BAND ══════════ */}
        <section style={{
          maxWidth: 1060, margin: "40px auto 0", padding: "0 20px",
        }}>
          <div style={{
            background: `linear-gradient(135deg, ${PUR2} 0%, ${PUR} 100%)`,
            borderRadius: 24, padding: "36px 48px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 32, flexWrap: "wrap",
          }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.65)",
                            textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>
                YourPoodle Club
              </div>
              <h3 style={{ fontSize: "clamp(18px, 2.5vw, 26px)", fontWeight: 900, color: "#fff", marginBottom: 10, lineHeight: 1.2 }}>
                Topluluğa katıl, farkı hisset
              </h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", marginBottom: 20 }}>
                Poodle profilini oluştur, özel indirimlerden ve kişisel önerilerden yararlan.
              </p>
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                {["Poodle profili", "Soru-cevap topluluğu", "Üyelere özel fiyatlar", "Kişisel bakım önerileri"].map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 6,
                                        fontSize: 13, color: "rgba(255,255,255,0.85)" }}>
                    <CheckCircle2 size={13} color="#A78BFA" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
            <Link href="/uye-ol">
              <button style={{
                background: "#fff", color: PUR, border: "none",
                padding: "14px 32px", borderRadius: 14, fontSize: 15,
                fontWeight: 800, cursor: "pointer", fontFamily: "inherit",
                whiteSpace: "nowrap", flexShrink: 0,
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              }}>
                Ücretsiz Üye Ol 🎉
              </button>
            </Link>
          </div>
        </section>

        {/* ══════════ 4. POODLE'INI TANIYALIM ══════════ */}
        <section style={{ maxWidth: 1060, margin: "52px auto 0", padding: "0 20px" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: PUR, textTransform: "uppercase",
                        letterSpacing: 1.2, marginBottom: 8 }}>Kişiselleştir</p>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 900, color: "#111" }}>
              Poodle'ınız kaç yaşında?
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            {AGE_OPTIONS.map(a => {
              const sel = selectedAge === a.label;
              return (
                <button key={a.label}
                  onClick={() => setSelectedAge(a.label)}
                  style={{
                    background: sel ? PUR : "#fff",
                    border: `2px solid ${sel ? PUR : "#E5E7EB"}`,
                    borderRadius: 16, padding: "22px 16px",
                    cursor: "pointer", fontFamily: "inherit",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                    transition: "all 0.18s ease",
                    boxShadow: sel ? `0 8px 24px ${PUR}33` : "none",
                    transform: sel ? "translateY(-2px)" : "none",
                  }}>
                  <span style={{ fontSize: 32 }}>{a.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: sel ? "#fff" : "#111" }}>{a.label}</span>
                  {a.sub && <span style={{ fontSize: 12, color: sel ? "rgba(255,255,255,0.75)" : "#9CA3AF" }}>{a.sub}</span>}
                </button>
              );
            })}
          </div>
          {selectedAge && (
            <div style={{ marginTop: 20, textAlign: "center", fontSize: 14, color: "#6B7280" }}>
              <span style={{ background: "#F5F0FF", color: PUR, fontWeight: 700, padding: "6px 16px", borderRadius: 99 }}>
                ✓ {selectedAge} profili seçildi — içerikler kişiselleştiriliyor
              </span>
            </div>
          )}
        </section>

        {/* ══════════ 5. TRENDING ══════════ */}
        <section style={{ maxWidth: 1060, margin: "52px auto 0", padding: "0 20px" }}>
          <h2 style={{ fontSize: "clamp(18px, 2.5vw, 26px)", fontWeight: 900, color: "#111", marginBottom: 20 }}>
            Poodle sahipleri bugün bunları araştırıyor
          </h2>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {TRENDING.map((t, i) => (
              <Link key={t} href={`/rehber/${TRENDING_SLUGS[t] ?? "#"}`}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: i % 2 === 0 ? "#F5F0FF" : "#fff",
                  border: "1.5px solid #E9D5FF",
                  borderRadius: 12, padding: "10px 18px",
                  fontSize: 14, fontWeight: 600, color: "#374151",
                  textDecoration: "none", transition: "all 0.15s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = PUR;
                  (e.currentTarget as HTMLElement).style.color = "#fff";
                  (e.currentTarget as HTMLElement).style.borderColor = PUR;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? "#F5F0FF" : "#fff";
                  (e.currentTarget as HTMLElement).style.color = "#374151";
                  (e.currentTarget as HTMLElement).style.borderColor = "#E9D5FF";
                }}
              >
                <span style={{ fontSize: 16 }}>🔍</span> {t}
              </Link>
            ))}
          </div>
        </section>

        {/* ══════════ 6. PRODUCTS ══════════ */}
        <section style={{ maxWidth: 1060, margin: "52px auto 0", padding: "0 20px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28 }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: PUR, textTransform: "uppercase",
                          letterSpacing: 1.2, marginBottom: 6 }}>Editörün seçimi</p>
              <h2 style={{ fontSize: "clamp(20px, 3vw, 30px)", fontWeight: 900, color: "#111", lineHeight: 1.1 }}>
                Sizin için seçtiklerimiz
              </h2>
            </div>
            <Link href="/magaza"
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "#F5F0FF", color: PUR,
                fontSize: 13, fontWeight: 700, padding: "10px 20px",
                borderRadius: 12, textDecoration: "none",
              }}>
              Tüm Ürünleri Gör <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {PRODUCTS.map(p => <PCard key={p.id} p={p} />)}
          </div>
        </section>

        {/* ══════════ 7. CLUB ══════════ */}
        <section style={{ maxWidth: 1060, margin: "52px auto 0", padding: "0 20px" }}>
          <div style={{
            background: `linear-gradient(135deg, ${PUR2} 0%, ${PUR} 100%)`,
            borderRadius: 24, padding: "48px 52px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 32, flexWrap: "wrap", position: "relative", overflow: "hidden",
          }}>
            {/* bg blobs */}
            <div style={{ position:"absolute", width:260, height:260, borderRadius:"50%",
                          background:"rgba(255,255,255,0.06)", top:-80, right:120, pointerEvents:"none" }} />
            <div style={{ position:"absolute", width:160, height:160, borderRadius:"50%",
                          background:"rgba(255,255,255,0.05)", bottom:-60, right:40, pointerEvents:"none" }} />

            <div style={{ flex: 1, minWidth: 260, position: "relative", zIndex: 1 }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:6,
                            background:"rgba(255,255,255,0.15)", borderRadius:99,
                            padding:"4px 14px", marginBottom:14 }}>
                <span style={{ fontSize:14 }}>🐩</span>
                <span style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.9)",
                               textTransform:"uppercase", letterSpacing:1 }}>YourPoodle Club</span>
              </div>
              <h3 style={{ fontSize:"clamp(20px, 2.8vw, 30px)", fontWeight:900, color:"#fff",
                           marginBottom:10, lineHeight:1.2 }}>
                Topluluğa katıl,<br />farkı hisset
              </h3>
              <p style={{ fontSize:14, color:"rgba(255,255,255,0.75)", marginBottom:22, maxWidth:400 }}>
                Poodle profilini oluştur, özel indirimlerden ve kişisel önerilerden yararlan.
              </p>
              <div style={{ display:"flex", gap:20, flexWrap:"wrap", marginBottom:28 }}>
                {["Poodle profili","Soru-cevap topluluğu","Üyelere özel fiyatlar","Kişisel bakım önerileri"].map(f => (
                  <div key={f} style={{ display:"flex", alignItems:"center", gap:6,
                                        fontSize:13, color:"rgba(255,255,255,0.85)" }}>
                    <CheckCircle2 size={13} color="#A78BFA" /> {f}
                  </div>
                ))}
              </div>
              <Link href="/uye-ol">
                <button style={{
                  background:"#fff", color:PUR, border:"none",
                  padding:"14px 32px", borderRadius:14, fontSize:15,
                  fontWeight:800, cursor:"pointer", fontFamily:"inherit",
                  boxShadow:"0 4px 20px rgba(0,0,0,0.18)",
                }}>
                  Ücretsiz Üye Ol 🎉
                </button>
              </Link>
            </div>

            {/* poodle illustration */}
            <div style={{ flexShrink:0, position:"relative", zIndex:1 }}>
              <div style={{
                width:160, height:160, borderRadius:"50%",
                background:"rgba(255,255,255,0.12)",
                border:"3px solid rgba(255,255,255,0.25)",
                overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <img src="/images/poodle-hero-transparent.png" alt="Poodle"
                  style={{ width:"100%", height:"100%", objectFit:"cover" }}
                  onError={e => { (e.target as HTMLImageElement).style.display="none"; }} />
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ 8. TRUST ══════════ */}
        <section style={{ maxWidth: 1060, margin: "52px auto 60px", padding: "0 20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {TRUST.map(({ icon: Icon, label }) => (
              <div key={label} style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                textAlign: "center", padding: "28px 20px",
                background: "#fff", border: "1px solid #F3F4F6",
                borderRadius: 18, gap: 12,
              }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "#F5F0FF",
                              display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={22} color={PUR} strokeWidth={1.8} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#374151", lineHeight: 1.4 }}>{label}</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </YPLayout>
  );
}
