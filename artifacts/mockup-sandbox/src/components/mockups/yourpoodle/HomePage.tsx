import { useState } from "react";

const DOMAIN = "387d00fb-fb49-41f4-b269-b5b5ea754886-00-1oz2rd0qjcizr.sisko.replit.dev";

const NAV = [
  { label: "Rehber", emoji: "📖" },
  { label: "Mama Bul", emoji: "🔍" },
  { label: "Sağlık", emoji: "🏥" },
  { label: "Bakım", emoji: "✂️" },
  { label: "Eğitim", emoji: "🎓" },
  { label: "AI Asistan", emoji: "🤖" },
  { label: "Topluluk", emoji: "👥" },
];

const NEEDS = [
  { emoji: "🍖", label: "Doğru Mama", sub: "Yaş & kiloya göre", color: "#F97316", bg: "#FFF7ED" },
  { emoji: "🚽", label: "Tuvalet Eğitimi", sub: "Adım adım rehber", color: "#10B981", bg: "#ECFDF5" },
  { emoji: "👁️", label: "Göz Yaşı", sub: "Tedavi & bakım", color: "#EC4899", bg: "#FDF2F8" },
  { emoji: "🪮", label: "Tüy & Bakım", sub: "Tarama & tıraş", color: "#8B5CF6", bg: "#F5F3FF" },
  { emoji: "🔊", label: "Havlama", sub: "Eğitim teknikleri", color: "#F59E0B", bg: "#FFFBEB" },
  { emoji: "🏠", label: "Yalnız Kalma", sub: "Anksiyete çözümü", color: "#3B82F6", bg: "#EFF6FF" },
  { emoji: "🍼", label: "Yavru Bakımı", sub: "0-6 ay rehberi", color: "#06B6D4", bg: "#ECFEFF" },
  { emoji: "🩺", label: "Sağlık Belirtileri", sub: "Belirti sorgulama", color: "#EF4444", bg: "#FEF2F2" },
];

const TOOLS = [
  { emoji: "🍽️", label: "Mama Hesaplama", desc: "Günlük gram miktarı", color: "#7C3AED" },
  { emoji: "⚖️", label: "İdeal Kilo", desc: "Kilo kontrolü", color: "#2563EB" },
  { emoji: "🐾", label: "Yaş Hesaplama", desc: "İnsan yaşı eşdeğeri", color: "#059669" },
  { emoji: "💧", label: "Su İhtiyacı", desc: "Günlük ml miktarı", color: "#0891B2" },
  { emoji: "✂️", label: "Bakım Takvimi", desc: "Tıraş zamanı", color: "#D97706" },
  { emoji: "🚫", label: "Yasak Yiyecekler", desc: "Tehlikeli besinler", color: "#DC2626" },
  { emoji: "💊", label: "Belirti Rehberi", desc: "Semptom kontrolü", color: "#7C3AED" },
  { emoji: "💉", label: "Aşı Takvimi", desc: "Hatırlatma sistemi", color: "#BE185D" },
];

const GUIDES = [
  { tag: "Beslenme", title: "Toy Poodle İçin En İyi Mama Markaları 2025", min: "5 dk okuma", emoji: "🥇" },
  { tag: "Bakım",    title: "Evde Poodle Tıraşı: Adım Adım Eksiksiz Rehber", min: "8 dk okuma", emoji: "✂️" },
  { tag: "Sağlık",   title: "Göz Altı Kızarıklığı: Neden Olur, Nasıl Geçer?", min: "4 dk okuma", emoji: "👁️" },
  { tag: "Eğitim",   title: "2 Haftada Tuvalet Eğitimini Tamamlayın", min: "6 dk okuma", emoji: "🎯" },
];

const REVIEWS = [
  { name: "Zeynep K.", avatar: "ZK", stars: 5, text: "AI asistan sayesinde poodle'ımın mama miktarını doğru hesapladık. Kilosu çok daha dengeli oldu!", tag: "AI Asistan" },
  { name: "Ahmet R.", avatar: "AR", stars: 5, text: "Tıraş rehberi inanılmaz detaylı. Artık her 6 haftada bir kendim tıraş yapıyorum, kuaföre gitmiyorum.", tag: "Bakım Rehberi" },
  { name: "Merve A.", avatar: "MA", stars: 5, text: "Göz yaşı problemi için verilen öneriler işe yaradı. 2 haftada gözleri temizlendi!", tag: "Sağlık" },
];

export function HomePage() {
  const [activeTab, setActiveTab] = useState<"yavru" | "yetiskin" | "yasli">("yetiskin");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: "#FAFAFA", minHeight: "100vh", color: "#111" }}>

      {/* ─── HEADER ─────────────────────────────────────────── */}
      <header style={{ background: "#fff", borderBottom: "1px solid #F0F0F0", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", gap: 40, height: 64 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #7C3AED, #A855F7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🐩</div>
            <span style={{ fontSize: 18, fontWeight: 900, color: "#7C3AED", letterSpacing: "-0.5px" }}>YourPoodle</span>
          </div>

          {/* Nav */}
          <nav style={{ display: "flex", gap: 4, flex: 1, overflow: "hidden" }}>
            {NAV.map(n => (
              <button key={n.label} style={{ padding: "6px 14px", borderRadius: 20, border: "none", background: "transparent", fontSize: 13.5, fontWeight: 600, color: "#555", cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#F5F3FF"; e.currentTarget.style.color = "#7C3AED"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#555"; }}>
                {n.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button style={{ padding: "8px 20px", borderRadius: 20, border: "1.5px solid #E5E7EB", background: "#fff", fontSize: 13.5, fontWeight: 700, color: "#555", cursor: "pointer", fontFamily: "inherit" }}>Giriş Yap</button>
            <button style={{ padding: "8px 20px", borderRadius: 20, border: "none", background: "linear-gradient(135deg, #7C3AED, #A855F7)", fontSize: 13.5, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>Ücretsiz Başla</button>
          </div>
        </div>
      </header>

      {/* ─── HERO ───────────────────────────────────────────── */}
      <section style={{ background: "#fff", borderBottom: "1px solid #F0F0F0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 32px 64px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          {/* Left */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#F5F3FF", border: "1px solid #E9D5FF", borderRadius: 20, padding: "6px 14px", marginBottom: 24 }}>
              <span style={{ fontSize: 14 }}>✨</span>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#7C3AED" }}>Türkiye'nin #1 Poodle Platformu</span>
            </div>

            <h1 style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.1, letterSpacing: "-2px", marginBottom: 20, color: "#0F0F0F" }}>
              Toy Poodle'ınız<br />
              <span style={{ background: "linear-gradient(135deg, #7C3AED, #EC4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>için her şey</span><br />
              tek yerde
            </h1>

            <p style={{ fontSize: 17, lineHeight: 1.7, color: "#6B7280", marginBottom: 36, maxWidth: 440 }}>
              Beslenme, bakım, sağlık ve eğitim rehberleri. AI destekli kişisel öneriler. Türkiye'nin en büyük Poodle topluluğu.
            </p>

            <div style={{ display: "flex", gap: 12, marginBottom: 40 }}>
              <button style={{ height: 52, padding: "0 28px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #7C3AED, #A855F7)", color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 24px rgba(124,58,237,0.3)" }}>
                🔍 Mama Bul
              </button>
              <button style={{ height: 52, padding: "0 28px", borderRadius: 14, border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                📖 Rehberleri Gör
              </button>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: 32 }}>
              {[["50K+", "Aktif üye"], ["500+", "Rehber yazısı"], ["4.9★", "Kullanıcı puanı"]].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: "#111", letterSpacing: "-0.5px" }}>{n}</div>
                  <div style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 600, marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div style={{ position: "relative" }}>
            {/* Main card */}
            <div style={{ background: "linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%)", borderRadius: 28, padding: 32, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
              <div style={{ position: "absolute", bottom: -20, left: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />

              <div style={{ fontSize: 80, textAlign: "center", lineHeight: 1, marginBottom: 20, position: "relative", zIndex: 1 }}>🐩</div>

              <div style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", borderRadius: 16, padding: "16px 20px", border: "1px solid rgba(255,255,255,0.2)", position: "relative", zIndex: 1 }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 700, marginBottom: 4 }}>AI Asistan</div>
                <div style={{ fontSize: 14, color: "#fff", fontWeight: 600, lineHeight: 1.5 }}>
                  "4 aylık Poodle'ım için günde kaç gram mama vermeliyim?"
                </div>
                <div style={{ marginTop: 12, background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "10px 14px" }}>
                  <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.9)", lineHeight: 1.5 }}>
                    4 aylık yavrunuz için günde <strong>3 öğün</strong>, toplamda yaklaşık <strong>85-100g</strong> mama önerilir...
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div style={{ position: "absolute", top: -12, left: -16, background: "#fff", borderRadius: 14, padding: "10px 16px", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 20 }}>🎓</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#111" }}>500+ Rehber</div>
                <div style={{ fontSize: 10, color: "#9CA3AF" }}>Uzman içerik</div>
              </div>
            </div>
            <div style={{ position: "absolute", bottom: -12, right: -16, background: "#fff", borderRadius: 14, padding: "10px 16px", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 20 }}>❤️</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#111" }}>50K+ Üye</div>
                <div style={{ fontSize: 10, color: "#9CA3AF" }}>Güvenilen platform</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BUGÜN NE ARIYORSUNUZ ─────────────────────────── */}
      <section style={{ background: "#FAFAFA", padding: "64px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-0.5px", marginBottom: 8 }}>Bugün ne arıyorsunuz?</h2>
            <p style={{ fontSize: 15, color: "#6B7280" }}>Poodle'ınız için ihtiyacınız olan konuyu seçin</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            {NEEDS.map(n => (
              <button key={n.label} style={{ background: n.bg, border: `1.5px solid ${n.color}22`, borderRadius: 18, padding: "22px 16px", cursor: "pointer", textAlign: "center", fontFamily: "inherit", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 12px 28px ${n.color}22`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>{n.emoji}</div>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: n.color, marginBottom: 4 }}>{n.label}</div>
                <div style={{ fontSize: 11.5, color: "#9CA3AF", fontWeight: 600 }}>{n.sub}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AI ASISTAN + PROFİL ──────────────────────────── */}
      <section style={{ background: "#fff", padding: "64px 32px", borderTop: "1px solid #F3F4F6", borderBottom: "1px solid #F3F4F6" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* AI Asistan */}
          <div style={{ background: "linear-gradient(135deg, #1E1155 0%, #4C1D95 100%)", borderRadius: 24, padding: 32, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -30, right: -30, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 20 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>🤖</div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: "#fff", marginBottom: 6 }}>Poodle AI Asistan</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.5, margin: 0 }}>Sorunuzu yazın, Poodle'ınıza özel yanıt alın</p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {["Kaç gram mama vermeliyim?", "Göz altı neden kızarıyor?", "Yalnız kalınca neden havlıyor?"].map(q => (
                <button key={q} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: "11px 16px", textAlign: "left", color: "rgba(255,255,255,0.85)", fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.14)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}>
                  💬 {q}
                </button>
              ))}
            </div>
            <button style={{ width: "100%", height: 50, borderRadius: 14, background: "#7C3AED", border: "none", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 16px rgba(124,58,237,0.4)" }}>
              AI Asistanı Başlat →
            </button>
          </div>

          {/* Poodle Profil */}
          <div style={{ background: "linear-gradient(135deg, #FFF1F2 0%, #FCE7F3 100%)", borderRadius: 24, padding: 32, border: "1.5px solid #FECDD3", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 64, lineHeight: 1, marginBottom: 16 }}>🐩</div>
              <h3 style={{ fontSize: 22, fontWeight: 900, color: "#111", marginBottom: 10 }}>Poodle Profilinizi Oluşturun</h3>
              <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7, marginBottom: 24 }}>
                Adı, yaşı ve kilosunu girin. Size özel mama önerileri, bakım takvimi ve sağlık hatırlatıcıları alın.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                {["🍽️ Kişiselleştirilmiş mama planı", "💊 Aşı ve veteriner takibi", "✂️ Otomatik bakım takvimi"].map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 600, color: "#374151" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#EC4899", flexShrink: 0 }} />
                    {f}
                  </div>
                ))}
              </div>
            </div>
            <button style={{ width: "100%", height: 52, borderRadius: 14, background: "#EC4899", border: "none", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 16px rgba(236,72,153,0.3)" }}>
              Ücretsiz Profil Oluştur →
            </button>
          </div>
        </div>
      </section>

      {/* ─── HIZLI ARAÇLAR ─────────────────────────────────── */}
      <section style={{ background: "#FAFAFA", padding: "64px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
            <div>
              <h2 style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-0.5px", marginBottom: 6 }}>⚡ Hızlı Araçlar</h2>
              <p style={{ fontSize: 15, color: "#6B7280" }}>Poodle bakımını kolaylaştıran ücretsiz hesaplama araçları</p>
            </div>
            <button style={{ fontSize: 13.5, fontWeight: 700, color: "#7C3AED", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Tümünü Gör →</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            {TOOLS.map(t => (
              <button key={t.label} style={{ background: "#fff", border: "1.5px solid #F3F4F6", borderRadius: 18, padding: "20px 18px", textAlign: "left", cursor: "pointer", fontFamily: "inherit", display: "flex", gap: 14, alignItems: "flex-start", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = t.color; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 20px ${t.color}15`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#F3F4F6"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${t.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{t.emoji}</div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: "#111", marginBottom: 3, lineHeight: 1.3 }}>{t.label}</div>
                  <div style={{ fontSize: 11.5, color: "#9CA3AF" }}>{t.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── REHBERLER ──────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "64px 32px", borderTop: "1px solid #F3F4F6" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
          {/* En Çok Okunanlar */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontSize: 22, fontWeight: 900 }}>📖 Bu Hafta En Çok Okunan</h2>
              <button style={{ fontSize: 13, fontWeight: 700, color: "#7C3AED", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Tümü →</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {GUIDES.map((g, i) => (
                <div key={g.title} style={{ display: "flex", gap: 14, alignItems: "center", padding: "16px", background: "#FAFAFA", borderRadius: 16, cursor: "pointer", border: "1.5px solid #F3F4F6", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#F5F3FF"; e.currentTarget.style.borderColor = "#E9D5FF"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#FAFAFA"; e.currentTarget.style.borderColor = "#F3F4F6"; }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg, #7C3AED, #A855F7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{g.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10.5, fontWeight: 800, color: "#7C3AED", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.05em" }}>{g.tag}</div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111", lineHeight: 1.4 }}>{g.title}</div>
                  </div>
                  <div style={{ fontSize: 11, color: "#9CA3AF", flexShrink: 0 }}>{g.min}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Yaşa Göre */}
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 24 }}>🐾 Yaşa Göre Rehber</h2>
            <div style={{ display: "flex", background: "#F9FAFB", borderRadius: 14, padding: 4, marginBottom: 20, border: "1px solid #F3F4F6" }}>
              {(["yavru", "yetiskin", "yasli"] as const).map(tab => (
                <button key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{ flex: 1, height: 38, borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700, transition: "all 0.2s",
                    background: activeTab === tab ? "#7C3AED" : "transparent",
                    color: activeTab === tab ? "#fff" : "#6B7280" }}>
                  {tab === "yavru" ? "🍼 Yavru" : tab === "yetiskin" ? "🐩 Yetişkin" : "💜 Yaşlı"}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {(activeTab === "yavru" ? [
                { emoji: "🏠", title: "Eve İlk Geldiğinde Ne Yapmalısınız?", tag: "Yavru", min: "5 dk" },
                { emoji: "💉", title: "İlk Aşılar: Takvim ve Öneriler", tag: "Sağlık", min: "4 dk" },
                { emoji: "🚽", title: "Tuvalet Eğitimine Başlama Kılavuzu", tag: "Eğitim", min: "7 dk" },
              ] : activeTab === "yetiskin" ? [
                { emoji: "🥩", title: "Yetişkin Poodle İçin En İyi Mama Markaları", tag: "Beslenme", min: "5 dk" },
                { emoji: "✂️", title: "Evde Tıraş: Adım Adım Eksiksiz Rehber", tag: "Bakım", min: "8 dk" },
                { emoji: "🏃", title: "Günlük Egzersiz ve Aktivite Rehberi", tag: "Aktivite", min: "4 dk" },
              ] : [
                { emoji: "🫀", title: "Yaşlı Poodle'da Dikkat Edilmesi Gerekenler", tag: "Sağlık", min: "6 dk" },
                { emoji: "🦷", title: "Diş ve Ağız Sağlığı Yaşlı Köpeklerde", tag: "Bakım", min: "4 dk" },
                { emoji: "🥗", title: "Yaşlı Poodle İçin Beslenme Değişikliği", tag: "Beslenme", min: "5 dk" },
              ]).map(item => (
                <div key={item.title} style={{ display: "flex", gap: 14, alignItems: "center", padding: "16px", background: "#FAFAFA", borderRadius: 16, cursor: "pointer", border: "1.5px solid #F3F4F6", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#F5F3FF"; e.currentTarget.style.borderColor = "#E9D5FF"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#FAFAFA"; e.currentTarget.style.borderColor = "#F3F4F6"; }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: "#EDE9FE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{item.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10.5, fontWeight: 800, color: "#7C3AED", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.05em" }}>{item.tag}</div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111", lineHeight: 1.4 }}>{item.title}</div>
                  </div>
                  <div style={{ fontSize: 11, color: "#9CA3AF", flexShrink: 0 }}>{item.min}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── MAMA BULMA ──────────────────────────────────────── */}
      <section style={{ background: "linear-gradient(135deg, #FFFBEB, #FEF3C7)", padding: "64px 32px", borderTop: "1px solid #FDE68A" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 48 }}>
          <div style={{ fontSize: 72, lineHeight: 1, flexShrink: 0 }}>🔍</div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 10 }}>Poodle'ınıza özel en iyi mamayı bulun</h2>
            <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.6, marginBottom: 16 }}>11 soruluk akıllı sihirbaz. Yaşına, kilosuna, alerjisine ve bütçenize göre en uygun 3 mama önerisi.</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Yaşa göre filtreleme", "Alerji kontrolü", "Bütçe seçimi", "Marka karşılaştırma", "Besin analizi"].map(t => (
                <span key={t} style={{ fontSize: 12, fontWeight: 700, color: "#92400E", background: "#FDE68A", borderRadius: 20, padding: "5px 12px" }}>{t}</span>
              ))}
            </div>
          </div>
          <button style={{ flexShrink: 0, height: 56, padding: "0 36px", borderRadius: 16, background: "#D97706", border: "none", color: "#fff", fontSize: 16, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 24px rgba(217,119,6,0.3)", whiteSpace: "nowrap" }}>
            Sihirbazı Başlat →
          </button>
        </div>
      </section>

      {/* ─── KULLANICI YORUMLARI ─────────────────────────────── */}
      <section style={{ background: "#fff", padding: "64px 32px", borderTop: "1px solid #F3F4F6" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-0.5px", marginBottom: 8 }}>Poodle sahipleri ne diyor?</h2>
            <p style={{ fontSize: 15, color: "#6B7280" }}>50.000+ üyenin güvendiği platform</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {REVIEWS.map(r => (
              <div key={r.name} style={{ background: "#FAFAFA", borderRadius: 20, padding: 24, border: "1.5px solid #F3F4F6" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                  {Array.from({ length: r.stars }).map((_, i) => <span key={i} style={{ color: "#FBBF24", fontSize: 16 }}>★</span>)}
                </div>
                <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, marginBottom: 20 }}>"{r.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #7C3AED, #A855F7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff" }}>{r.avatar}</div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: "#111" }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF", background: "#F5F3FF", borderRadius: 20, padding: "2px 8px", display: "inline-block", marginTop: 2 }}>{r.tag}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SSS + EMAIL ─────────────────────────────────────── */}
      <section style={{ background: "#FAFAFA", padding: "64px 32px", borderTop: "1px solid #F3F4F6" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "3fr 2fr", gap: 56 }}>
          {/* FAQ */}
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 24 }}>Sık Sorulan Sorular</h2>
            {[
              { q: "Toy Poodle ile Minyatür Poodle arasındaki fark nedir?", a: "Toy Poodle genellikle 2-4 kg, Minyatür Poodle ise 4-9 kg ağırlığındadır. Her ikisi de zeki, eğitilebilir ve az dökülen tüylere sahiptir." },
              { q: "Poodle'lar için en iyi mama hangisi?", a: "Royal Canin, Pro Plan ve Hill's Science Plan en çok tercih edilen markalar arasındadır. Mama Bul sihirbazımız poodle'ınıza özel öneri sunar." },
              { q: "Poodle'lar ne sıklıkla tıraş yaptırılmalı?", a: "Toy ve Minyatür Poodle'lar ortalama 6-8 haftada bir tıraş gerektirir. Tüyleri sürekli uzadığından düzenli bakım şarttır." },
              { q: "AI asistan gerçek veteriner yerine geçer mi?", a: "Hayır. AI asistanımız genel bilgilendirme sağlar. Sağlık sorunları için mutlaka veteriner hekiminize başvurun." },
            ].map((item, i) => (
              <div key={i} style={{ borderBottom: "1px solid #E5E7EB" }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left", gap: 16 }}>
                  <span style={{ fontSize: 14.5, fontWeight: 700, color: "#111" }}>{item.q}</span>
                  <span style={{ fontSize: 18, color: "#7C3AED", flexShrink: 0 }}>{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <div style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7, paddingBottom: 18 }}>{item.a}</div>
                )}
              </div>
            ))}
          </div>

          {/* Email */}
          <div>
            <div style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)", borderRadius: 24, padding: 32, textAlign: "center", position: "sticky", top: 80 }}>
              <div style={{ fontSize: 48, marginBottom: 14 }}>📬</div>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 10 }}>Haftalık Poodle İpuçları</h3>
              <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.75)", lineHeight: 1.6, marginBottom: 24 }}>
                Her hafta uzman bakım önerileri, yeni araçlar ve topluluk haberleri.
              </p>
              <input type="email" placeholder="E-posta adresiniz"
                style={{ width: "100%", height: 50, borderRadius: 12, border: "none", padding: "0 16px", fontSize: 14, marginBottom: 10, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
              <button style={{ width: "100%", height: 50, borderRadius: 12, background: "#fff", border: "none", fontSize: 14, fontWeight: 800, color: "#7C3AED", cursor: "pointer", fontFamily: "inherit" }}>
                Abone Ol — Ücretsiz
              </button>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 12 }}>İstediğiniz zaman çıkabilirsiniz.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────── */}
      <footer style={{ background: "#111", padding: "48px 32px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 40 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #7C3AED, #A855F7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🐩</div>
                <span style={{ fontSize: 16, fontWeight: 900, color: "#fff" }}>YourPoodle</span>
              </div>
              <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.7, maxWidth: 260 }}>Toy Poodle sahipleri için Türkiye'nin en kapsamlı bakım, beslenme ve eğitim platformu.</p>
            </div>
            {[
              { title: "Platform", links: ["Rehber", "Mama Bul", "AI Asistan", "Topluluk", "Market"] },
              { title: "Destek",   links: ["SSS", "İletişim", "Sipariş Takip", "Yardım Merkezi"] },
              { title: "Yasal",   links: ["Kullanım Koşulları", "Gizlilik", "KVKK", "Çerez Politikası"] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontSize: 10.5, fontWeight: 900, color: "#4B5563", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>{col.title}</div>
                {col.links.map(l => (
                  <div key={l} style={{ fontSize: 13.5, color: "#6B7280", marginBottom: 10, cursor: "pointer" }}
                    onMouseEnter={e => { (e.target as HTMLElement).style.color = "#fff"; }}
                    onMouseLeave={e => { (e.target as HTMLElement).style.color = "#6B7280"; }}>{l}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid #1F2937", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#4B5563" }}>© 2025 Sizpa İnternet Tic. Ltd. Şti. · info@yourpoodle.com</span>
            <div style={{ display: "flex", gap: 20 }}>
              {["Gizlilik", "Çerezler", "KVKK"].map(l => (
                <span key={l} style={{ fontSize: 12, color: "#4B5563", cursor: "pointer" }}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
