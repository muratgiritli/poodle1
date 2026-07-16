// Yön A — Split Wizard: Mama Bul desktop layout
// Left: branded purple panel with step progress | Right: white wizard area

export function SplitWizard() {
  const steps = [
    { id: 1, label: "Yaş grubu", done: true },
    { id: 2, label: "Kilo aralığı", active: true },
    { id: 3, label: "Sağlık durumu", done: false },
    { id: 4, label: "Bütçe", done: false },
  ];

  const options = [
    { icon: "🐾", label: "1–3 kg", desc: "Toy & Teacup" },
    { icon: "🐩", label: "4–7 kg", desc: "Miniature" },
    { icon: "🐕", label: "8–14 kg", desc: "Medium / Klein" },
    { icon: "🦮", label: "15+ kg", desc: "Standard" },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", height: "100vh", display: "flex", flexDirection: "column", background: "#fff" }}>
      {/* Top nav */}
      <nav style={{
        height: 52, display: "flex", alignItems: "center", padding: "0 24px",
        borderBottom: "1px solid #f0eeff", background: "#fff", flexShrink: 0,
        justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>🐩</span>
          <span style={{ fontWeight: 800, fontSize: 15, color: "#6D28D9" }}>YourPoodle</span>
        </div>
        <div style={{ display: "flex", gap: 24, fontSize: 13, color: "#666" }}>
          {["Rehber","Mama Bul","Sağlık","Bakım","AI Asistan","Topluluk","Mağaza"].map(l => (
            <span key={l} style={{ cursor: "pointer", color: l === "Mama Bul" ? "#7C3AED" : "#555", fontWeight: l === "Mama Bul" ? 700 : 400 }}>{l}</span>
          ))}
        </div>
        <button style={{ background: "#7C3AED", color: "#fff", border: "none", borderRadius: 20, padding: "7px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          Giriş Yap
        </button>
      </nav>

      {/* Main split area */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left branded panel */}
        <div style={{
          width: 340, flexShrink: 0,
          background: "linear-gradient(145deg, #5B21B6 0%, #7C3AED 50%, #8B5CF6 100%)",
          display: "flex", flexDirection: "column", padding: "40px 36px",
          position: "relative", overflow: "hidden"
        }}>
          {/* Decorative circles */}
          <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
          <div style={{ position: "absolute", bottom: -80, left: -40, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 42, marginBottom: 12 }}>🐾</div>
            <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 800, margin: "0 0 6px", lineHeight: 1.3 }}>
              Mama Bulma<br/>Sihirbazı
            </h2>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, margin: "0 0 40px", lineHeight: 1.6 }}>
              4 kısa soruyla poodle'ınıza özel mama önerisi alın.
            </p>

            {/* Step progress */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {steps.map((step, i) => (
                <div key={step.id} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                      background: step.done ? "#A78BFA" : step.active ? "#fff" : "rgba(255,255,255,0.2)",
                      border: step.active ? "none" : "none",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 800,
                      color: step.done ? "#fff" : step.active ? "#7C3AED" : "rgba(255,255,255,0.5)"
                    }}>
                      {step.done ? "✓" : step.id}
                    </div>
                    {i < steps.length - 1 && (
                      <div style={{ width: 2, height: 28, background: step.done ? "rgba(167,139,250,0.6)" : "rgba(255,255,255,0.15)", margin: "3px 0" }} />
                    )}
                  </div>
                  <div style={{ paddingTop: 4, paddingBottom: i < steps.length - 1 ? 28 : 0 }}>
                    <div style={{
                      fontSize: 13, fontWeight: step.active ? 700 : 500,
                      color: step.active ? "#fff" : step.done ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.45)"
                    }}>
                      {step.label}
                    </div>
                    {step.active && (
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>Şu an bu adımdayız</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div style={{ marginTop: 40 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>İlerleme</span>
                <span style={{ fontSize: 12, color: "#fff", fontWeight: 700 }}>%25</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.2)" }}>
                <div style={{ height: "100%", width: "25%", borderRadius: 3, background: "#fff" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right wizard panel */}
        <div style={{ flex: 1, padding: "40px 60px", display: "flex", flexDirection: "column", justifyContent: "center", background: "#FAFAFA" }}>
          <div style={{ maxWidth: 560 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#EDE9FE", borderRadius: 20, padding: "4px 14px", marginBottom: 20 }}>
              <span style={{ fontSize: 12 }}>⚖️</span>
              <span style={{ fontSize: 12, color: "#7C3AED", fontWeight: 600 }}>Adım 2 / 4</span>
            </div>

            <h2 style={{ fontSize: 28, fontWeight: 900, color: "#111", margin: "0 0 8px", lineHeight: 1.25 }}>
              Poodle'ınızın kilosu<br/>ne kadar?
            </h2>
            <p style={{ fontSize: 14, color: "#888", margin: "0 0 32px" }}>
              Doğru porsiyon hesabı için kilonuzu seçin
            </p>

            {/* 2-column option grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 36 }}>
              {options.map((opt, i) => (
                <button key={opt.label} style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "18px 20px",
                  border: i === 1 ? "2px solid #7C3AED" : "2px solid #E5E7EB",
                  borderRadius: 14, cursor: "pointer", textAlign: "left",
                  background: i === 1 ? "#F5F3FF" : "#fff",
                  transition: "all 0.15s"
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: i === 1 ? "#EDE9FE" : "#F9F9F9",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22
                  }}>
                    {opt.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: i === 1 ? "#6D28D9" : "#111", marginBottom: 2 }}>{opt.label}</div>
                    <div style={{ fontSize: 12, color: i === 1 ? "#8B5CF6" : "#999" }}>{opt.desc}</div>
                  </div>
                  <div style={{ marginLeft: "auto" }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: "50%",
                      background: i === 1 ? "#7C3AED" : "transparent",
                      border: i === 1 ? "none" : "2px solid #DDD",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      {i === 1 && <span style={{ color: "#fff", fontSize: 11 }}>✓</span>}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Nav buttons */}
            <div style={{ display: "flex", gap: 12 }}>
              <button style={{
                padding: "12px 24px", borderRadius: 10, border: "2px solid #E5E7EB",
                background: "#fff", color: "#555", fontSize: 14, fontWeight: 600, cursor: "pointer"
              }}>
                ← Geri
              </button>
              <button style={{
                flex: 1, padding: "12px 24px", borderRadius: 10, border: "none",
                background: "linear-gradient(135deg, #7C3AED, #8B5CF6)",
                color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer"
              }}>
                İleri → Sağlık Durumu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
