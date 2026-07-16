// Yön C — AI Studio: AI Asistan desktop layout
// Left sidebar (topics/suggestions) + Main chat area (messages + input)

const messages = [
  { role: "bot", text: "Merhaba! 🐾 Ben Poodle asistanınım. Poodle'ınızın beslenmesi, bakımı, eğitimi veya sağlığıyla ilgili her türlü soruyu yanıtlayabilirim.\n\nYaş, kilo ve ihtiyacını belirtirseniz daha özel öneriler sunabilirim." },
  { role: "user", text: "4 aylık miniature poodlem için günlük mama miktarı ne olmalı?" },
  { role: "bot", text: "4 aylık bir Miniature Poodle (yaklaşık 4–7 kg hedef kilo) için günlük mama miktarı:\n\n• **Kuru mama:** 60–80 g / gün (3 öğüne bölün)\n• **Yaş mama:** günde 2× 150 g poşet\n\nYavru poodleler hızlı büyüdüğünden porsiyon kontrolü çok önemli. Kullandığınız mamanın paketindeki tabloyu da referans alın — kalori yoğunluğu markadan markaya değişir.\n\nHangi markayı kullanıyorsunuz?" },
];

const suggestions = [
  { icon: "🍽️", text: "Günlük mama miktarı" },
  { icon: "🏃", text: "Egzersiz ihtiyacı" },
  { icon: "💇", text: "Tüy bakımı sıklığı" },
  { icon: "💉", text: "Aşı takvimi" },
  { icon: "🦷", text: "Diş fırçalama" },
  { icon: "😴", text: "Uyku düzeni" },
];

const history = [
  "Poodle'da patellar lüksasyon...",
  "Royal Canin vs Hills karşılaştırması",
  "Yavru poodle sosyalleşme",
];

export function AIStudio() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", height: "100vh", display: "flex", flexDirection: "column", background: "#F8F7FF" }}>
      {/* Top nav */}
      <nav style={{
        height: 52, display: "flex", alignItems: "center", padding: "0 24px",
        borderBottom: "1px solid #ede9fe", background: "#fff", flexShrink: 0,
        justifyContent: "space-between", zIndex: 10
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>🐩</span>
          <span style={{ fontWeight: 800, fontSize: 15, color: "#6D28D9" }}>YourPoodle</span>
        </div>
        <div style={{ display: "flex", gap: 24, fontSize: 13 }}>
          {["Rehber","Mama Bul","Sağlık","Bakım","AI Asistan","Topluluk","Mağaza"].map(l => (
            <span key={l} style={{ cursor: "pointer", color: l === "AI Asistan" ? "#7C3AED" : "#555", fontWeight: l === "AI Asistan" ? 700 : 400, borderBottom: l === "AI Asistan" ? "2px solid #7C3AED" : "2px solid transparent", paddingBottom: 2 }}>{l}</span>
          ))}
        </div>
        <button style={{ background: "#7C3AED", color: "#fff", border: "none", borderRadius: 20, padding: "7px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          Giriş Yap
        </button>
      </nav>

      {/* Content: sidebar + chat */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left sidebar */}
        <div style={{
          width: 260, flexShrink: 0, background: "#fff",
          borderRight: "1px solid #EDE9FE", display: "flex", flexDirection: "column", padding: "20px 0"
        }}>
          {/* New chat button */}
          <div style={{ padding: "0 16px 20px" }}>
            <button style={{
              width: "100%", padding: "10px 16px", borderRadius: 12,
              background: "linear-gradient(135deg, #7C3AED, #8B5CF6)",
              color: "#fff", border: "none", fontSize: 13, fontWeight: 700,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 8, justifyContent: "center"
            }}>
              <span>✏️</span> Yeni Sohbet
            </button>
          </div>

          {/* Quick suggestions */}
          <div style={{ padding: "0 16px 16px" }}>
            <div style={{ fontSize: 11, color: "#999", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>Popüler Sorular</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {suggestions.map(s => (
                <button key={s.text} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
                  border: "none", background: "none", borderRadius: 8, cursor: "pointer",
                  textAlign: "left", width: "100%"
                }}>
                  <span style={{ fontSize: 16 }}>{s.icon}</span>
                  <span style={{ fontSize: 13, color: "#555" }}>{s.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "#EDE9FE", margin: "0 16px 16px" }} />

          {/* History */}
          <div style={{ padding: "0 16px", flex: 1, overflow: "auto" }}>
            <div style={{ fontSize: 11, color: "#999", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>Geçmiş Sohbetler</div>
            {history.map(h => (
              <button key={h} style={{
                display: "flex", alignItems: "center", gap: 8, padding: "8px 10px",
                border: "none", background: "none", borderRadius: 8, cursor: "pointer",
                textAlign: "left", width: "100%", marginBottom: 2
              }}>
                <span style={{ fontSize: 14, color: "#BBB" }}>💬</span>
                <span style={{ fontSize: 12, color: "#777", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h}</span>
              </button>
            ))}
          </div>

          {/* Bottom disclaimer */}
          <div style={{ padding: "16px", margin: "0 16px", background: "#FFF7ED", borderRadius: 10, border: "1px solid #FED7AA" }}>
            <div style={{ fontSize: 11, color: "#92400E", lineHeight: 1.5 }}>
              ⚠️ Bu asistan genel bilgilendirme sağlar. Ciddi sağlık sorunlarında veteriner hekime başvurun.
            </div>
          </div>
        </div>

        {/* Main chat area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Chat header */}
          <div style={{
            padding: "16px 32px", borderBottom: "1px solid #EDE9FE", background: "#fff",
            display: "flex", alignItems: "center", gap: 12, flexShrink: 0
          }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #7C3AED, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤖</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>Poodle AI Asistanı</div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E" }} />
                <span style={{ fontSize: 12, color: "#6B7280" }}>Aktif</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "28px 80px", display: "flex", flexDirection: "column", gap: 24 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: "flex", gap: 14, justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "100%"
              }}>
                {msg.role === "bot" && (
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #7C3AED, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0, marginTop: 2 }}>🤖</div>
                )}
                <div style={{
                  maxWidth: "70%", padding: "14px 18px", borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  background: msg.role === "user" ? "linear-gradient(135deg, #7C3AED, #8B5CF6)" : "#fff",
                  color: msg.role === "user" ? "#fff" : "#222",
                  fontSize: 14, lineHeight: 1.65,
                  boxShadow: msg.role === "bot" ? "0 1px 4px rgba(0,0,0,0.07)" : "none",
                  border: msg.role === "bot" ? "1px solid #EDE9FE" : "none",
                  whiteSpace: "pre-line"
                }}>
                  {msg.text}
                </div>
                {msg.role === "user" && (
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0, marginTop: 2 }}>👤</div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            <div style={{ display: "flex", gap: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #7C3AED, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🤖</div>
              <div style={{ padding: "14px 18px", borderRadius: "18px 18px 18px 4px", background: "#fff", border: "1px solid #EDE9FE", display: "flex", gap: 5, alignItems: "center" }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#C4B5FD", opacity: 0.7 + i * 0.15 }} />
                ))}
              </div>
            </div>
          </div>

          {/* Input area */}
          <div style={{ padding: "16px 80px 24px", background: "#fff", borderTop: "1px solid #EDE9FE", flexShrink: 0 }}>
            <div style={{
              display: "flex", gap: 12, alignItems: "center",
              background: "#F8F7FF", borderRadius: 16, padding: "12px 16px",
              border: "2px solid #EDE9FE"
            }}>
              <input
                placeholder="Poodle'ınızla ilgili sorun..."
                readOnly
                style={{
                  flex: 1, border: "none", background: "none", fontSize: 14, color: "#111",
                  outline: "none"
                }}
              />
              <button style={{
                width: 38, height: 38, borderRadius: 10, border: "none",
                background: "linear-gradient(135deg, #7C3AED, #8B5CF6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", fontSize: 16, flexShrink: 0
              }}>
                ➤
              </button>
            </div>
            <div style={{ textAlign: "center", marginTop: 10, fontSize: 11, color: "#BBB" }}>
              YourPoodle AI · Yanıtlar bilgilendirme amaçlıdır
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
