import { useEffect } from "react";
import { useLocation } from "wouter";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { IS_YP } from "@/lib/store";

const P = "#7022C4";
const BASE = IS_YP ? "" : "/yourpoodle";

const TOOLS = [
  { emoji: "🍽️", title: "Mama Hesaplama", desc: "Günlük mama miktarını hesaplayın", href: `${BASE}/araclar/mama-hesaplama`, bg: "#FFF7ED" },
  { emoji: "🎂", title: "Yaş Hesaplama", desc: "Poodle yaşını insan yaşına çevirin", href: `${BASE}/araclar/yas-hesaplama`, bg: "#F0FDF4" },
  { emoji: "✂️", title: "Tıraş Takvimi", desc: "Bakım takviminizi oluşturun", href: `${BASE}/araclar/tiras-takvimi`, bg: "#F5F3FF" },
];

export default function YPAraclarPage() {
  useEffect(() => { document.title = "Poodle Araçları | YourPoodle"; }, []);
  const [, navigate] = useLocation();

  return (
    <YPLayout constrain={false}>
      <div style={{ minHeight: "100vh", background: "#FAFAFA", paddingBottom: 48 }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 20px 0" }}>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: "#111827", margin: "0 0 6px" }}>Poodle Araçları</h1>
          <p style={{ color: "#6B7280", fontSize: 15, margin: "0 0 32px" }}>Poodle'ınız için pratik hesaplama araçları</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 20 }}>
            {TOOLS.map(t => (
              <div key={t.title} onClick={() => navigate(t.href)}
                style={{ background: t.bg, borderRadius: 20, padding: 28, cursor: "pointer", transition: "transform 0.15s", border: "1.5px solid rgba(0,0,0,0.04)" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-4px)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "none")}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{t.emoji}</div>
                <h2 style={{ fontSize: 17, fontWeight: 800, color: "#111827", margin: "0 0 6px" }}>{t.title}</h2>
                <p style={{ margin: 0, fontSize: 13, color: "#6B7280" }}>{t.desc}</p>
                <div style={{ marginTop: 16, fontSize: 13, color: P, fontWeight: 700 }}>Hesapla →</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </YPLayout>
  );
}
