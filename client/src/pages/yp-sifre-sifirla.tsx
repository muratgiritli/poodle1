import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { Lock, Eye, EyeOff } from "lucide-react";
import { IS_YP } from "@/lib/store";

const P = "#5D3A1A";
const BASE = IS_YP ? "" : "/yourpoodle";

function strength(pw: string): { level: number; label: string; color: string } {
  if (pw.length === 0) return { level: 0, label: "", color: "#E5E7EB" };
  if (pw.length < 6) return { level: 1, label: "Zayıf", color: "#EF4444" };
  if (pw.length < 10 || !/[0-9]/.test(pw)) return { level: 2, label: "Orta", color: "#F59E0B" };
  return { level: 3, label: "Güçlü", color: "#10B981" };
}

export default function YPSifreSifirlaPage() {
  useEffect(() => { document.title = "Yeni Şifre Belirle | YourPoodle"; }, []);
  const [, navigate] = useLocation();
  const [pw, setPw] = useState(""), [pw2, setPw2] = useState("");
  const [show1, setShow1] = useState(false), [show2, setShow2] = useState(false);
  const [error, setError] = useState(""), [loading, setLoading] = useState(false);
  const s = strength(pw);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pw.length < 6) { setError("Şifre en az 6 karakter olmalı."); return; }
    if (pw !== pw2) { setError("Şifreler eşleşmiyor."); return; }
    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    alert("Şifreniz güncellendi! Giriş yapabilirsiniz.");
    navigate(`${BASE}/giris`);
  }

  return (
    <YPLayout authMode constrain={false}>
      <div style={{ minHeight: "100vh", background: "#FAF7F0", paddingBottom: 48 }}>
        <div style={{ maxWidth: 440, margin: "0 auto", padding: "40px 20px 0" }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: 32, boxShadow: "0 2px 16px rgba(0,0,0,0.08)" }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#F5F0E6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Lock size={28} color={P} />
              </div>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: "0 0 6px" }}>Yeni Şifre Belirle</h1>
              <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>Hesabınız için güçlü bir şifre belirleyin.</p>
            </div>
            <form onSubmit={handleSubmit}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Yeni Şifre</label>
              <div style={{ position: "relative", marginBottom: 8 }}>
                <input type={show1 ? "text" : "password"} value={pw} onChange={e => setPw(e.target.value)}
                  style={{ width: "100%", height: 48, borderRadius: 12, border: "1.5px solid #E5E7EB", padding: "0 44px 0 16px", fontSize: 15, fontFamily: "inherit", boxSizing: "border-box", outline: "none" }} />
                <button type="button" onClick={() => setShow1(x => !x)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}>
                  {show1 ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Strength bar */}
              {pw.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ height: 4, borderRadius: 9999, background: "#E5E7EB", marginBottom: 4 }}>
                    <div style={{ height: "100%", width: `${(s.level / 3) * 100}%`, background: s.color, borderRadius: 9999, transition: "all 0.3s" }} />
                  </div>
                  <span style={{ fontSize: 11, color: s.color, fontWeight: 600 }}>{s.label}</span>
                </div>
              )}
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Yeni Şifre Tekrar</label>
              <div style={{ position: "relative", marginBottom: 20 }}>
                <input type={show2 ? "text" : "password"} value={pw2} onChange={e => setPw2(e.target.value)}
                  style={{ width: "100%", height: 48, borderRadius: 12, border: "1.5px solid #E5E7EB", padding: "0 44px 0 16px", fontSize: 15, fontFamily: "inherit", boxSizing: "border-box", outline: "none" }} />
                <button type="button" onClick={() => setShow2(x => !x)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}>
                  {show2 ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {error && <p style={{ color: "#EF4444", fontSize: 13, margin: "0 0 14px" }}>{error}</p>}
              <button type="submit" disabled={loading}
                style={{ width: "100%", height: 50, borderRadius: 14, border: "none", background: loading ? "#D1D5DB" : P, color: "#fff", fontSize: 15, fontWeight: 700, cursor: loading ? "default" : "pointer", fontFamily: "inherit" }}>
                {loading ? "Güncelleniyor…" : "Şifreyi Güncelle"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </YPLayout>
  );
}
