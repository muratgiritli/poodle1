import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { Mail, CheckCircle, ChevronLeft } from "lucide-react";
import { IS_YP } from "@/lib/store";

const P = "#5D3A1A";
const BASE = IS_YP ? "" : "/yourpoodle";

export default function YPSifremiUnuttumPage() {
  useEffect(() => { document.title = "Şifremi Unuttum | YourPoodle"; }, []);
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.match(/^[^@]+@[^@]+\.[^@]+$/)) { setError("Geçerli bir e-posta adresi girin."); return; }
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  }

  return (
    <YPLayout authMode constrain={false}>
      <div style={{ minHeight: "100vh", background: "#FAF7F0", paddingBottom: 48 }}>
        <div style={{ maxWidth: 440, margin: "0 auto", padding: "28px 20px 0" }}>
          <button onClick={() => navigate(`${BASE}/giris`)}
            style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: "#6B7280", fontSize: 13, fontWeight: 600, padding: 0, fontFamily: "inherit", marginBottom: 20 }}>
            <ChevronLeft size={16} /> Giriş sayfasına dön
          </button>

          <div style={{ background: "#fff", borderRadius: 20, padding: 32, boxShadow: "0 2px 16px rgba(0,0,0,0.08)" }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "8px 0" }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <CheckCircle size={36} color="#10B981" />
                </div>
                <h1 style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: "0 0 10px" }}>E-postanızı kontrol edin</h1>
                <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6, margin: "0 0 24px" }}>
                  <strong>{email}</strong> adresine şifre sıfırlama bağlantısı gönderdik. Gelen kutunuzu ve spam klasörünüzü kontrol edin.
                </p>
                <button onClick={() => navigate(`${BASE}/giris`)}
                  style={{ padding: "12px 28px", borderRadius: 12, border: "none", background: P, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  Giriş Sayfasına Dön
                </button>
              </div>
            ) : (
              <>
                <div style={{ textAlign: "center", marginBottom: 28 }}>
                  <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#F5F0E6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <Mail size={28} color={P} />
                  </div>
                  <h1 style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: "0 0 8px" }}>Şifremi Unuttum</h1>
                  <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>E-posta adresinize şifre sıfırlama bağlantısı göndereceğiz.</p>
                </div>
                <form onSubmit={handleSubmit}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>E-posta</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ornek@email.com"
                    style={{ width: "100%", height: 48, borderRadius: 12, border: `1.5px solid ${error ? "#EF4444" : "#E5E7EB"}`, padding: "0 16px", fontSize: 15, fontFamily: "inherit", marginBottom: error ? 6 : 20, boxSizing: "border-box", outline: "none" }} />
                  {error && <p style={{ color: "#EF4444", fontSize: 12, margin: "0 0 16px" }}>{error}</p>}
                  <button type="submit" disabled={loading}
                    style={{ width: "100%", height: 50, borderRadius: 14, border: "none", background: loading ? "#D1D5DB" : P, color: "#fff", fontSize: 15, fontWeight: 700, cursor: loading ? "default" : "pointer", fontFamily: "inherit" }}>
                    {loading ? "Gönderiliyor…" : "Sıfırlama Bağlantısı Gönder"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </YPLayout>
  );
}
