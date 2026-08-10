import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { ChevronLeft, Scissors, Calendar } from "lucide-react";
import { IS_YP } from "@/lib/store";

const P = "#5D3A1A";
const BASE = IS_YP ? "" : "/yourpoodle";

const TIRAS_ARALIGI: Record<string, number> = {
  "puppy-cut": 42, "teddy-bear": 35, "lamb-cut": 56, "continental": 28, "summer": 49,
};
const TIRAS_LABELS: Record<string, string> = {
  "puppy-cut": "Puppy Cut", "teddy-bear": "Teddy Bear", "lamb-cut": "Lamb Cut",
  "continental": "Continental", "summer": "Yaz Kesimi",
};

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

export default function YPTirasTakvimiPage() {
  useEffect(() => { document.title = "Tıraş Takvimi | YourPoodle"; }, []);
  const [, navigate] = useLocation();
  const [tirasType, setTirasType] = useState("teddy-bear");
  const [sonTiras, setSonTiras] = useState("");
  const [result, setResult] = useState<string[]>([]);

  function hesapla(e: React.FormEvent) {
    e.preventDefault();
    if (!sonTiras) return;
    const aralik = TIRAS_ARALIGI[tirasType];
    const dates = [1, 2, 3, 4].map(n => addDays(sonTiras, n * aralik));
    setResult(dates);
  }

  return (
    <YPLayout constrain={false}>
      <div style={{ minHeight: "100vh", background: "#F5F0E6", paddingBottom: 48 }}>
        <div style={{ maxWidth: 440, margin: "0 auto", padding: "24px 20px 0" }}>
          <button onClick={() => navigate(`${BASE}/araclar`)}
            style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: "#6B7280", fontSize: 13, fontWeight: 600, padding: 0, fontFamily: "inherit", marginBottom: 20 }}>
            <ChevronLeft size={16} /> Araçlar
          </button>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✂️</div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: "#111827", margin: "0 0 6px" }}>Tıraş Takvimi</h1>
            <p style={{ color: "#6B7280", fontSize: 14, margin: 0 }}>Bir sonraki bakım tarihlerini planlayın</p>
          </div>
          <div style={{ background: "#fff", borderRadius: 18, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
            <form onSubmit={hesapla}>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Tıraş Tipi</label>
                <select value={tirasType} onChange={e => setTirasType(e.target.value)}
                  style={{ width: "100%", height: 48, borderRadius: 12, border: "1.5px solid #E5E7EB", padding: "0 14px", fontSize: 15, fontFamily: "inherit", background: "#fff", outline: "none" }}>
                  {Object.entries(TIRAS_LABELS).map(([v, l]) => <option key={v} value={v}>{l} ({TIRAS_ARALIGI[v]} gün)</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Son Tıraş Tarihi</label>
                <input type="date" value={sonTiras} onChange={e => setSonTiras(e.target.value)}
                  style={{ width: "100%", height: 48, borderRadius: 12, border: "1.5px solid #E5E7EB", padding: "0 16px", fontSize: 15, fontFamily: "inherit", boxSizing: "border-box", outline: "none" }} />
              </div>
              <button type="submit"
                style={{ width: "100%", height: 50, borderRadius: 14, border: "none", background: P, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Scissors size={16} /> Takvim Oluştur
              </button>
            </form>
            {result.length > 0 && (
              <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid #F3F4F6" }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#374151", margin: "0 0 14px" }}>Sonraki bakım tarihleri ({TIRAS_LABELS[tirasType]})</p>
                {result.map((date, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: i === 0 ? "#F5F0E6" : "#F9F9FB", borderRadius: 10, marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Calendar size={14} color={i === 0 ? P : "#9CA3AF"} />
                      <span style={{ fontSize: 14, color: i === 0 ? P : "#374151", fontWeight: i === 0 ? 700 : 400 }}>{date}</span>
                    </div>
                    {i === 0 && <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", background: P, padding: "2px 8px", borderRadius: 9999 }}>Yaklaşan</span>}
                  </div>
                ))}
                <button onClick={() => alert("Takvime ekle özelliği yakında!")}
                  style={{ marginTop: 12, width: "100%", height: 44, borderRadius: 12, border: "1.5px solid " + P, background: "#F5F0E6", color: P, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <Calendar size={15} /> Takvime Ekle
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </YPLayout>
  );
}
