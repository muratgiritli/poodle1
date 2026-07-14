import { useLocation } from "wouter";

export default function NotFound() {
  const [, navigate] = useLocation();

  return (
    <div style={{
      minHeight: "100vh", background: "linear-gradient(135deg,#F5F0FF 0%,#EDE8FF 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "24px 20px", fontFamily: "'Inter',sans-serif", textAlign: "center",
    }}>
      <div style={{ fontSize: 80, marginBottom: 16, lineHeight: 1 }}>🐾</div>
      <div style={{ fontSize: 72, fontWeight: 900, color: "#DDD5FF", lineHeight: 1, marginBottom: 8 }}>404</div>
      <h1 style={{ fontSize: 24, fontWeight: 900, color: "#1a1a1a", marginBottom: 10, lineHeight: 1.3 }}>
        Aradığınız sayfayı bulamadık
      </h1>
      <p style={{ fontSize: 15, color: "#666", marginBottom: 32, maxWidth: 320, lineHeight: 1.6 }}>
        Bu sayfa taşınmış veya kaldırılmış olabilir. Aşağıdaki bağlantılardan devam edebilirsiniz.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 320 }}>
        <button
          onClick={() => navigate("/yourpoodle")}
          style={{
            height: 52, borderRadius: 14, background: "#7C3AFF", border: "none",
            fontSize: 15, fontWeight: 800, color: "#fff", cursor: "pointer",
            fontFamily: "'Inter',sans-serif",
          }}
        >
          🏠 Ana Sayfaya Dön
        </button>
        <button
          onClick={() => navigate("/yourpoodle/rehber")}
          style={{
            height: 52, borderRadius: 14, background: "#F5F0FF", border: "none",
            fontSize: 15, fontWeight: 700, color: "#7C3AFF", cursor: "pointer",
            fontFamily: "'Inter',sans-serif",
          }}
        >
          📖 Rehberlere Git
        </button>
        <button
          onClick={() => navigate("/yourpoodle/ai-asistan")}
          style={{
            height: 52, borderRadius: 14, background: "#fff", border: "2px solid #DDD5FF",
            fontSize: 15, fontWeight: 700, color: "#7C3AFF", cursor: "pointer",
            fontFamily: "'Inter',sans-serif",
          }}
        >
          🤖 AI Asistana Sor
        </button>
      </div>
    </div>
  );
}
