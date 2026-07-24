import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { ChevronLeft } from "lucide-react";
import { IS_YP } from "@/lib/store";

const P = "#7022C4";
const BASE = IS_YP ? "" : "/yourpoodle";

function dogToHuman(yil: number, ay: number): number {
  const totalAy = yil * 12 + ay;
  if (totalAy <= 12) return Math.round(totalAy * 15 / 12);
  if (totalAy <= 24) return Math.round(15 + (totalAy - 12) * 9 / 12);
  return Math.round(24 + (totalAy - 24) * 4 / 12);
}

export default function YPYasHesaplamaPage() {
  useEffect(() => { document.title = "Yaş Hesaplama | YourPoodle"; }, []);
  const [, navigate] = useLocation();
  const [yil, setYil] = useState("2");
  const [ay, setAy] = useState("0");
  const [result, setResult] = useState<number | null>(null);

  function hesapla(e: React.FormEvent) {
    e.preventDefault();
    const r = dogToHuman(parseInt(yil) || 0, parseInt(ay) || 0);
    setResult(r);
  }

  return (
    <YPLayout constrain={false}>
      <div style={{ minHeight: "100vh", background: "#F0FDF4", paddingBottom: 48 }}>
        <div style={{ maxWidth: 440, margin: "0 auto", padding: "24px 20px 0" }}>
          <button onClick={() => navigate(`${BASE}/araclar`)}
            style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: "#6B7280", fontSize: 13, fontWeight: 600, padding: 0, fontFamily: "inherit", marginBottom: 20 }}>
            <ChevronLeft size={16} /> Araçlar
          </button>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎂</div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: "#111827", margin: "0 0 6px" }}>Yaş Hesaplama</h1>
            <p style={{ color: "#6B7280", fontSize: 14, margin: 0 }}>Poodle yaşını insan yaşına çevirin</p>
          </div>
          <div style={{ background: "#fff", borderRadius: 18, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
            <form onSubmit={hesapla}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Yaş (Yıl)</label>
                  <select value={yil} onChange={e => setYil(e.target.value)}
                    style={{ width: "100%", height: 48, borderRadius: 12, border: "1.5px solid #E5E7EB", padding: "0 12px", fontSize: 15, fontFamily: "inherit", background: "#fff", outline: "none" }}>
                    {Array.from({ length: 21 }, (_, i) => <option key={i} value={i}>{i} yıl</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Ay</label>
                  <select value={ay} onChange={e => setAy(e.target.value)}
                    style={{ width: "100%", height: 48, borderRadius: 12, border: "1.5px solid #E5E7EB", padding: "0 12px", fontSize: 15, fontFamily: "inherit", background: "#fff", outline: "none" }}>
                    {Array.from({ length: 12 }, (_, i) => <option key={i} value={i}>{i} ay</option>)}
                  </select>
                </div>
              </div>
              <button type="submit"
                style={{ width: "100%", height: 50, borderRadius: 14, border: "none", background: "#10B981", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                Hesapla 🎂
              </button>
            </form>
            {result !== null && (
              <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid #F3F4F6", textAlign: "center" }}>
                <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 8px" }}>İnsan yaşına göre</p>
                <div style={{ fontSize: 48, fontWeight: 900, color: "#10B981", margin: "0 0 8px" }}>~{result} yaş</div>
                <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>Poodle'ınız {yil} yıl {ay} aylık. İnsan gibi ~{result} yaşındaymış gibi düşünebilirsiniz.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </YPLayout>
  );
}
