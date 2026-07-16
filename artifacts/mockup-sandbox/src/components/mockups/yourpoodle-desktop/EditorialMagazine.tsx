// Yön B — Editorial Magazine: Sağlık Rehberi desktop layout
// Full-width gradient hero + 3-column article grid. Magazine-style.

const articles = [
  { tag: "Aşı & Koruma", title: "Yavru Poodle Aşı Takvimi: Hangi Aşı Ne Zaman?", read: "5 dk", img: "💉", color: "#FEF3C7", accent: "#D97706" },
  { tag: "Beslenme", title: "Poodle'da Pankreatit: Belirtiler ve Düşük Yağlı Diyet", read: "8 dk", img: "🍽️", color: "#DCFCE7", accent: "#16A34A" },
  { tag: "Cilt & Tüy", title: "Poodle Deri Alerjileri: Yiyecek mi, Çevre mi?", read: "6 dk", img: "🌿", color: "#EDE9FE", accent: "#7C3AED" },
  { tag: "Diş Sağlığı", title: "Poodle Diş Taşı ve Günlük Fırçalama Rehberi", read: "4 dk", img: "🦷", color: "#FEE2E2", accent: "#DC2626" },
  { tag: "Göz Sağlığı", title: "Göz Altı Kızarıklığı: Epifora mı, Konjonktivit mi?", read: "5 dk", img: "👁️", color: "#DBEAFE", accent: "#2563EB" },
  { tag: "Ortopedi", title: "Patellar Lüksasyon: Önlemler ve Egzersiz Planı", read: "7 dk", img: "🦴", color: "#FCE7F3", accent: "#DB2777" },
];

export function EditorialMagazine() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh", background: "#FAFAFA" }}>
      {/* Top nav */}
      <nav style={{
        height: 52, display: "flex", alignItems: "center", padding: "0 32px",
        borderBottom: "1px solid #f0eeff", background: "#fff",
        justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>🐩</span>
          <span style={{ fontWeight: 800, fontSize: 15, color: "#6D28D9" }}>YourPoodle</span>
        </div>
        <div style={{ display: "flex", gap: 24, fontSize: 13 }}>
          {["Rehber","Mama Bul","Sağlık","Bakım","AI Asistan","Topluluk","Mağaza"].map(l => (
            <span key={l} style={{ cursor: "pointer", color: l === "Sağlık" ? "#7C3AED" : "#555", fontWeight: l === "Sağlık" ? 700 : 400, borderBottom: l === "Sağlık" ? "2px solid #7C3AED" : "2px solid transparent", paddingBottom: 2 }}>{l}</span>
          ))}
        </div>
        <button style={{ background: "#7C3AED", color: "#fff", border: "none", borderRadius: 20, padding: "7px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          Giriş Yap
        </button>
      </nav>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #4C1D95 0%, #6D28D9 40%, #7C3AED 70%, #8B5CF6 100%)",
        padding: "52px 80px", display: "flex", alignItems: "center", gap: 60,
        position: "relative", overflow: "hidden"
      }}>
        {/* Decorative */}
        <div style={{ position: "absolute", top: -40, right: 200, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ position: "absolute", bottom: -60, right: 60, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

        <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "5px 14px", marginBottom: 18, backdropFilter: "blur(8px)" }}>
            <span style={{ fontSize: 13 }}>🏥</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>Veteriner Onaylı İçerik</span>
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 900, color: "#fff", margin: "0 0 14px", lineHeight: 1.2, letterSpacing: -1 }}>
            Poodle Sağlık<br/>Rehberi
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.8)", margin: "0 0 28px", lineHeight: 1.7, maxWidth: 440 }}>
            Aşı takviminden diş bakımına, beslenme rehberinden genetik sağlık risklerine kadar kapsamlı bilgi.
          </p>

          {/* Search */}
          <div style={{ display: "flex", gap: 0, maxWidth: 420 }}>
            <div style={{
              flex: 1, display: "flex", alignItems: "center", gap: 10,
              background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)",
              borderRadius: "12px 0 0 12px", padding: "0 16px", height: 46,
              border: "1px solid rgba(255,255,255,0.25)", borderRight: "none"
            }}>
              <span style={{ color: "rgba(255,255,255,0.6)" }}>🔍</span>
              <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>Sağlık konusu ara...</span>
            </div>
            <button style={{
              background: "#fff", color: "#7C3AED", border: "none",
              borderRadius: "0 12px 12px 0", padding: "0 20px", fontSize: 13, fontWeight: 700, cursor: "pointer"
            }}>
              Ara
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 32, marginTop: 28 }}>
            {[["48", "Makale"], ["12", "Kategori"], ["Ücretsiz", "Erişim"]].map(([val, label]) => (
              <div key={label}>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>{val}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: featured card */}
        <div style={{
          width: 280, flexShrink: 0, background: "rgba(255,255,255,0.12)",
          borderRadius: 20, padding: 24, backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.2)", position: "relative", zIndex: 1
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⭐</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Bu Haftanın Önerisi</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 10, lineHeight: 1.4 }}>
            Yavru Poodle için İlk 6 Ay Sağlık Kontrol Listesi
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#A78BFA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>🩺</div>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Dr. Ayşe Kaya • 10 dk okuma</span>
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div style={{ background: "#fff", borderBottom: "1px solid #F0EEFF", padding: "0 80px", display: "flex", gap: 0, overflowX: "auto" }}>
        {["Tümü", "Aşı & Koruma", "Beslenme", "Cilt & Tüy", "Diş Sağlığı", "Göz Sağlığı", "Ortopedi"].map((cat, i) => (
          <button key={cat} style={{
            padding: "14px 20px", border: "none", background: "none",
            fontSize: 13, fontWeight: i === 0 ? 700 : 500,
            color: i === 0 ? "#7C3AED" : "#666", cursor: "pointer",
            borderBottom: i === 0 ? "2px solid #7C3AED" : "2px solid transparent",
            whiteSpace: "nowrap"
          }}>{cat}</button>
        ))}
      </div>

      {/* Article grid */}
      <div style={{ padding: "36px 80px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}>
        {articles.map(art => (
          <div key={art.title} style={{
            background: "#fff", borderRadius: 16, overflow: "hidden",
            border: "1px solid #F0EEFF", cursor: "pointer",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            transition: "box-shadow 0.2s"
          }}>
            <div style={{
              height: 110, background: art.color,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44
            }}>
              {art.img}
            </div>
            <div style={{ padding: "18px 20px" }}>
              <div style={{ display: "inline-block", background: art.color, color: art.accent, fontSize: 11, fontWeight: 700, borderRadius: 6, padding: "3px 8px", marginBottom: 10 }}>
                {art.tag}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111", lineHeight: 1.45, marginBottom: 12 }}>
                {art.title}
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "#999" }}>📖 {art.read} okuma</span>
                <span style={{ fontSize: 12, color: art.accent, fontWeight: 600 }}>Oku →</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
