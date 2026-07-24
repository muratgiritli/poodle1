import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { Search, Package } from "lucide-react";
import { getOrder, STEP_LABELS } from "@/data/orders";
import { IS_YP } from "@/lib/store";

const P = "#7022C4";
const BASE = IS_YP ? "" : "/yourpoodle";

function Stepper({ step }: { step: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
      {STEP_LABELS.map((label, i) => {
        const done = i < step, active = i === step - 1;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEP_LABELS.length - 1 ? 1 : undefined }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: done || active ? P : "#E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: done || active ? "#fff" : "#9CA3AF", fontWeight: 700 }}>
                {done ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: 9, color: active ? P : "#9CA3AF", marginTop: 4, textAlign: "center", maxWidth: 55, lineHeight: 1.3 }}>{label}</span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div style={{ flex: 1, height: 2, background: done ? P : "#E5E7EB", margin: "0 3px", marginBottom: 18 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function YPSiparisTakipPage() {
  useEffect(() => { document.title = "Sipariş Takip | YourPoodle"; }, []);
  const [, navigate] = useLocation();
  const [orderNo, setOrderNo] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<ReturnType<typeof getOrder>>(undefined);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!orderNo || !email) { setError("Lütfen tüm alanları doldurun."); return; }
    setError("");
    setSearched(true);
    const found = getOrder(orderNo.trim());
    setResult(found);
  }

  return (
    <YPLayout constrain={false}>
      <div style={{ minHeight: "100vh", background: "#F9F5FF", paddingBottom: 48 }}>
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "32px 20px" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: P, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Package size={32} color="#fff" />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: "#111827", margin: "0 0 8px" }}>Sipariş Takip</h1>
            <p style={{ color: "#6B7280", fontSize: 14, margin: 0 }}>Sipariş numaranız ve e-posta adresiniz ile siparişinizi takip edin.</p>
          </div>

          <div style={{ background: "#fff", borderRadius: 18, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
            <form onSubmit={handleSearch}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Sipariş No</label>
              <input value={orderNo} onChange={e => setOrderNo(e.target.value)} placeholder="YP-2026-0847"
                style={{ width: "100%", height: 48, borderRadius: 12, border: "1.5px solid #E5E7EB", padding: "0 16px", fontSize: 15, fontFamily: "inherit", marginBottom: 16, boxSizing: "border-box", outline: "none" }} />

              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>E-posta</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ornek@email.com"
                style={{ width: "100%", height: 48, borderRadius: 12, border: "1.5px solid #E5E7EB", padding: "0 16px", fontSize: 15, fontFamily: "inherit", marginBottom: 20, boxSizing: "border-box", outline: "none" }} />

              {error && <p style={{ color: "#EF4444", fontSize: 13, margin: "0 0 12px" }}>{error}</p>}

              <button type="submit"
                style={{ width: "100%", height: 52, borderRadius: 14, border: "none", background: P, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Search size={18} /> Siparişi Sorgula
              </button>
            </form>

            {searched && (
              <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid #F3F4F6" }}>
                {result ? (
                  <>
                    <p style={{ fontSize: 13, fontWeight: 700, color: P, margin: "0 0 16px" }}>#{result.displayId} · {result.dateDisplay}</p>
                    <Stepper step={result.statusStep} />
                    <p style={{ fontSize: 12, color: "#6B7280", margin: "12px 0 0" }}>Kargo Takip: <strong>{result.trackingNo}</strong></p>
                  </>
                ) : (
                  <div style={{ textAlign: "center", color: "#EF4444", fontSize: 14 }}>
                    <p>Sipariş bulunamadı. Sipariş numaranızı kontrol edin.</p>
                  </div>
                )}
              </div>
            )}

            <p style={{ textAlign: "center", margin: "20px 0 0", fontSize: 13, color: "#6B7280" }}>
              Üye misiniz?{" "}
              <button onClick={() => navigate(`${BASE}/giris`)}
                style={{ background: "none", border: "none", color: P, fontWeight: 700, cursor: "pointer", fontSize: 13, padding: 0, fontFamily: "inherit" }}>
                Giriş yapın
              </button>
            </p>
          </div>
        </div>
      </div>
    </YPLayout>
  );
}
