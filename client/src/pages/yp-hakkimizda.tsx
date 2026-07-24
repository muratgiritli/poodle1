import { useEffect } from "react";
import { useLocation } from "wouter";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { Heart, Target, Users, Award } from "lucide-react";
import { IS_YP } from "@/lib/store";

const P = "#7022C4";
const BASE = IS_YP ? "" : "/yourpoodle";

const STATS = [
  { icon: "🐩", label: "Poodle Sahibi", value: "12.000+" },
  { icon: "📦", label: "Sipariş", value: "45.000+" },
  { icon: "⭐", label: "Memnun Müşteri", value: "%97" },
  { icon: "🌍", label: "Şehir", value: "81" },
];

const TEAM = [
  { name: "Ayşe Kaya", role: "Kurucu & CEO", emoji: "👩‍💼" },
  { name: "Mehmet Demir", role: "Veteriner Danışman", emoji: "👨‍⚕️" },
  { name: "Zeynep Çelik", role: "İçerik & Topluluk", emoji: "👩‍💻" },
  { name: "Can Yılmaz", role: "Teknik Altyapı", emoji: "👨‍🔧" },
];

export default function YPHakkimizdaPage() {
  useEffect(() => { document.title = "Hakkımızda | YourPoodle"; }, []);
  const [, navigate] = useLocation();

  return (
    <YPLayout constrain={false}>
      <div style={{ minHeight: "100vh", background: "#FAFAFA", paddingBottom: 48 }}>
        {/* Hero */}
        <div style={{ background: "linear-gradient(135deg,#7022C4,#A855F7)", padding: "56px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🐾</div>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: "#fff", margin: "0 0 12px" }}>Hakkımızda</h1>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, maxWidth: 520, margin: "0 auto", lineHeight: 1.6 }}>
            Toy Poodle sahipleri için Türkiye'nin ilk özel e-ticaret ve topluluk platformu.
          </p>
        </div>

        <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px 0" }}>
          {/* Story */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "28px 32px", marginBottom: 24, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F5F0FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Heart size={18} color={P} />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: 0 }}>Hikâyemiz</h2>
            </div>
            <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, margin: 0 }}>
              YourPoodle, 2024 yılında bir Toy Poodle sahibinin "neden bu küçük cins için özel bir yer yok?" sorusuyla doğdu. Poodle besleyenlerin en kaliteli mamaya, en doğru rehbere ve birbirinden harika bir topluluğa erişmesini kolaylaştırmak için çıktık yola. Bugün binlerce Poodle ailesiyle büyümeye devam ediyoruz.
            </p>
          </div>

          {/* Mission */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "28px 32px", marginBottom: 24, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F5F0FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Target size={18} color={P} />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: 0 }}>Misyonumuz</h2>
            </div>
            <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, margin: 0 }}>
              Her Toy Poodle sahibinin doğru beslenme, bakım ve veteriner bilgisine kolayca ulaşabilmesini sağlamak. Kalite standartlarından ödün vermeden, hem cüzdan dostu hem de köpeğinizin sağlığını destekleyen ürünler sunmak.
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 16, marginBottom: 24 }}>
            {STATS.map(s => (
              <div key={s.label} style={{ background: "#fff", borderRadius: 16, padding: "20px 16px", textAlign: "center", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: P, marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Team */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "28px 32px", marginBottom: 28, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F5F0FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Users size={18} color={P} />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: 0 }}>Ekibimiz</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 16 }}>
              {TEAM.map(t => (
                <div key={t.name} style={{ textAlign: "center", padding: "20px 12px", background: "#F9F5FF", borderRadius: 14 }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>{t.emoji}</div>
                  <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 14, color: "#111827" }}>{t.name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>{t.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ textAlign: "center" }}>
            <button onClick={() => navigate(`${BASE}/club`)}
              style={{ padding: "14px 40px", borderRadius: 14, border: "none", background: P, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Users size={18} /> Topluluğa Katıl
            </button>
          </div>
        </div>
      </div>
    </YPLayout>
  );
}
