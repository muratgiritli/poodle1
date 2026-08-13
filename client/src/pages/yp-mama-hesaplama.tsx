import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { ChevronLeft, Utensils } from "lucide-react";
import { IS_YP } from "@/lib/store";
import { goBack } from "@/lib/goBack";

const P = "#5D3A1A";
const BASE = IS_YP ? "" : "/yourpoodle";

export default function YPMamaHesaplamaPage() {
  useEffect(() => { document.title = "Mama Hesaplama | YourPoodle"; }, []);
  const [, navigate] = useLocation();
  const [kilo, setKilo] = useState("");
  const [yas, setYas] = useState("yetiskin");
  const [aktivite, setAktivite] = useState("orta");
  const [result, setResult] = useState<number | null>(null);

  function hesapla(e: React.FormEvent) {
    e.preventDefault();
    const k = parseFloat(kilo);
    if (!k || k <= 0) return;
    const base = k * 30 + 70;
    const yasFactor = yas === "yavru" ? 2 : yas === "yasli" ? 0.8 : 1;
    const aktFactor = aktivite === "dusuk" ? 0.8 : aktivite === "yuksek" ? 1.3 : 1;
    setResult(Math.round(base * yasFactor * aktFactor * 0.25));
  }

  const Select = ({ label, value, onChange, opts }: any) => (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ width: "100%", height: 48, borderRadius: 12, border: "1.5px solid #E5E7EB", padding: "0 14px", fontSize: 15, fontFamily: "inherit", background: "#fff", outline: "none" }}>
        {opts.map(([v, l]: [string, string]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  );

  return (
    <YPLayout constrain={false}>
      <div style={{ minHeight: "100vh", background: "#FFF7ED", paddingBottom: 48 }}>
        <div style={{ maxWidth: "var(--yp-shell-max)", margin: "0 auto", padding: "24px 20px 0" }}>
          <button onClick={() => goBack(navigate, `${BASE}/araclar`)}
            style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: "#6B7280", fontSize: 13, fontWeight: 600, padding: 0, fontFamily: "inherit", marginBottom: 20 }}>
            <ChevronLeft size={16} /> Araçlar
          </button>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🍽️</div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: "#111827", margin: "0 0 6px" }}>Mama Hesaplama</h1>
            <p style={{ color: "#6B7280", fontSize: 14, margin: 0 }}>Poodle'ınız için günlük önerilen mama miktarı</p>
          </div>
          <div style={{ background: "#fff", borderRadius: 18, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
            <form onSubmit={hesapla}>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Kilo (kg)</label>
                <input type="number" step="0.1" min="0.5" max="30" value={kilo} onChange={e => setKilo(e.target.value)} placeholder="örn. 3.5"
                  style={{ width: "100%", height: 48, borderRadius: 12, border: "1.5px solid #E5E7EB", padding: "0 16px", fontSize: 15, fontFamily: "inherit", boxSizing: "border-box", outline: "none" }} />
              </div>
              <Select label="Yaş Grubu" value={yas} onChange={setYas} opts={[["yavru","Yavru (0-12 ay)"],["yetiskin","Yetişkin (1-7 yaş)"],["yasli","Yaşlı (7+ yaş)"]]} />
              <Select label="Aktivite Seviyesi" value={aktivite} onChange={setAktivite} opts={[["dusuk","Düşük"],["orta","Orta"],["yuksek","Yüksek"]]} />
              <button type="submit"
                style={{ width: "100%", height: 50, borderRadius: 14, border: "none", background: P, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Utensils size={16} /> Hesapla
              </button>
            </form>
            {result !== null && (
              <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid #F3F4F6", textAlign: "center" }}>
                <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 8px" }}>Günlük önerilen mama miktarı</p>
                <div style={{ fontSize: 42, fontWeight: 900, color: P, margin: "0 0 8px" }}>{result}g</div>
                <p style={{ fontSize: 12, color: "#9CA3AF", margin: "0 0 20px" }}>Bu değer kuru mama için hesaplanmıştır. Veterinerinize danışın.</p>
                <button onClick={() => navigate(`${BASE}/magaza`)}
                  style={{ padding: "10px 24px", borderRadius: 10, border: "1.5px solid #FED7AA", background: "#FFF7ED", color: "#D97706", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  Uygun Mama Bul →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </YPLayout>
  );
}
