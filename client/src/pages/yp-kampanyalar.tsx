import { useEffect } from "react";
import { useLocation } from "wouter";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { MOCK_CAMPAIGNS } from "@/data/campaigns";
import { IS_YP } from "@/lib/store";

const P = "#7022C4";
const BASE = IS_YP ? "" : "/yourpoodle";

export default function YPKampanyalarPage() {
  useEffect(() => { document.title = "Kampanyalar | YourPoodle"; }, []);
  const [, navigate] = useLocation();

  return (
    <YPLayout constrain={false}>
      <div style={{ minHeight: "100vh", background: "#FAFAFA", paddingBottom: 48 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 0" }}>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: "#111827", margin: "0 0 6px" }}>Kampanyalar</h1>
          <p style={{ color: "#6B7280", fontSize: 15, margin: "0 0 32px" }}>Tüm güncel fırsat ve indirimler</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
            {MOCK_CAMPAIGNS.map(c => (
              <div key={c.id} style={{ background: c.bgColor, borderRadius: 20, padding: 24, border: "1.5px solid rgba(0,0,0,0.05)", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ fontSize: 40 }}>{c.emoji}</div>
                  <span style={{ padding: "4px 12px", borderRadius: 9999, background: c.badgeColor, color: "#fff", fontSize: 11, fontWeight: 700 }}>{c.badge}</span>
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: "0 0 8px" }}>{c.title}</h2>
                <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: "0 0 16px", flex: 1 }}>{c.description}</p>
                {c.expiry !== "—" && (
                  <p style={{ fontSize: 12, color: "#9CA3AF", margin: "0 0 14px" }}>Son geçerlilik: {c.expiry}</p>
                )}
                <button onClick={() => navigate(c.ctaLink)}
                  style={{ height: 44, borderRadius: 12, border: "none", background: P, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  {c.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </YPLayout>
  );
}
