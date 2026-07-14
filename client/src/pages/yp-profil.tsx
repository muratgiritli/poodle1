import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Edit3, Plus, LogIn } from "lucide-react";
import { useCustomer } from "@/contexts/CustomerContext";
import YPBottomNav from "@/components/YPBottomNav";
import YPBreadcrumb from "@/components/YPBreadcrumb";

const BREED_LABELS: Record<string, string> = {
  toy: "Toy Poodle",
  miniature: "Minyatür Poodle",
  standard: "Standart Poodle",
  teacup: "Teacup Poodle",
};

const COLOR_LABELS: Record<string, string> = {
  white: "Beyaz",
  black: "Siyah",
  brown: "Kahverengi",
  apricot: "Kayısı Rengi",
  red: "Kızıl",
  silver: "Gümüş",
  gray: "Gri",
  blue: "Mavi Gri",
  cream: "Krem",
};

const BREADCRUMBS = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Profilim", href: "/yourpoodle/profil" },
];

interface PoodleProfile {
  id?: number;
  name: string;
  breed?: string;
  age?: string;
  color?: string;
  gender?: string;
  photo?: string;
  about?: string;
}

export default function YPProfilPage() {
  const [, navigate] = useLocation();
  const { isLoggedIn } = useCustomer();
  const [profile, setProfile] = useState<PoodleProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (isLoggedIn) {
        try {
          const res = await fetch("/api/yp/poodle", { credentials: "include" });
          if (res.ok) {
            const data = await res.json();
            if (data) {
              setProfile(data);
              setLoading(false);
              return;
            }
          }
        } catch {}
      }
      // Fallback: localStorage
      try {
        const saved = localStorage.getItem("yp_poodle");
        if (saved) setProfile(JSON.parse(saved));
      } catch {}
      setLoading(false);
    }
    load();
  }, [isLoggedIn]);

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: "#FAFAF9", minHeight: "100vh", paddingBottom: 80 }}>
      <YPBreadcrumb items={BREADCRUMBS} />

      {/* Header */}
      <section style={{ background: "linear-gradient(135deg, #7C3AFF 0%, #5B21B6 100%)", padding: "32px 20px 28px", textAlign: "center", color: "#fff" }}>
        <div style={{ fontSize: 48, marginBottom: 10 }}>🐩</div>
        <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 6 }}>Poodle Profilim</h1>
        <p style={{ fontSize: 13, opacity: 0.85 }}>Poodle'ınızın bilgilerini kaydedin ve takip edin</p>
      </section>

      <div style={{ padding: "24px 16px", maxWidth: 480, margin: "0 auto" }}>

        {loading ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#aaa" }}>Yükleniyor…</div>
        ) : profile ? (
          /* ── Profil kartı ── */
          <>
            <div style={{ background: "#fff", borderRadius: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", overflow: "hidden", marginBottom: 16 }}>
              {/* Fotoğraf */}
              <div style={{ position: "relative", background: "linear-gradient(135deg, #EDE8FF, #F5F0FF)", height: 140, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {profile.photo ? (
                  <img src={profile.photo} alt={profile.name} style={{ width: 110, height: 110, borderRadius: "50%", objectFit: "cover", border: "4px solid #fff", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }} />
                ) : (
                  <div style={{ width: 110, height: 110, borderRadius: "50%", background: "#7C3AFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, border: "4px solid #fff" }}>🐩</div>
                )}
              </div>

              {/* Bilgiler */}
              <div style={{ padding: "20px 20px 24px", textAlign: "center" }}>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: "#1a1a1a", marginBottom: 4 }}>{profile.name}</h2>
                <p style={{ fontSize: 14, color: "#7C3AFF", fontWeight: 700, marginBottom: 16 }}>
                  {BREED_LABELS[profile.breed || "toy"] || profile.breed || "Toy Poodle"}
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                  {[
                    { label: "Yaş", value: profile.age ? `${profile.age} yaşında` : "—", emoji: "🎂" },
                    { label: "Cinsiyet", value: profile.gender === "erkek" ? "Erkek" : profile.gender === "disi" ? "Dişi" : profile.gender || "—", emoji: "♡" },
                    { label: "Renk", value: COLOR_LABELS[profile.color || ""] || profile.color || "—", emoji: "🎨" },
                    { label: "Irk", value: BREED_LABELS[profile.breed || "toy"] || "—", emoji: "🐾" },
                  ].map(item => (
                    <div key={item.label} style={{ background: "#F8F7FF", borderRadius: 14, padding: "12px 10px", textAlign: "center" }}>
                      <div style={{ fontSize: 20, marginBottom: 4 }}>{item.emoji}</div>
                      <div style={{ fontSize: 11, color: "#999", fontWeight: 600, marginBottom: 2 }}>{item.label}</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "#1a1a1a" }}>{item.value}</div>
                    </div>
                  ))}
                </div>

                {profile.about && (
                  <div style={{ background: "#F8F7FF", borderRadius: 14, padding: "14px 16px", textAlign: "left", marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: "#999", fontWeight: 700, marginBottom: 6 }}>HAKKINDA</div>
                    <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7, margin: 0 }}>{profile.about}</p>
                  </div>
                )}

                {!isLoggedIn && (
                  <div style={{ background: "#FFF3CD", border: "1.5px solid #F59E0B", borderRadius: 14, padding: "12px 14px", marginBottom: 16, textAlign: "left" }}>
                    <p style={{ fontSize: 12, color: "#92400E", lineHeight: 1.6, margin: 0 }}>
                      ⚠️ Şu an yalnızca bu cihazda kayıtlı. <strong>Giriş yapın</strong> ve profili buluta kaydedin.
                    </p>
                  </div>
                )}

                <button
                  onClick={() => navigate("/yourpoodle/poodle-ekle")}
                  style={{ width: "100%", height: 48, borderRadius: 14, background: "#7C3AFF", border: "none", color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "'Inter', sans-serif" }}
                >
                  <Edit3 size={18} />
                  Profili Düzenle
                </button>
              </div>
            </div>

            {/* Hızlı linkler */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { emoji: "🍖", label: "Mama Bul", href: "/yourpoodle/mama-bul" },
                { emoji: "🤖", label: "AI Asistan", href: "/yourpoodle/ai-asistan" },
                { emoji: "📚", label: "Bakım Rehberi", href: "/yourpoodle/bakim" },
                { emoji: "🏆", label: "Poodle Club", href: "/yourpoodle/club" },
              ].map(item => (
                <button
                  key={item.href}
                  onClick={() => navigate(item.href)}
                  style={{ background: "#fff", borderRadius: 16, padding: "18px 14px", border: "none", boxShadow: "0 2px 10px rgba(0,0,0,0.06)", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, fontFamily: "'Inter', sans-serif" }}
                >
                  <span style={{ fontSize: 24 }}>{item.emoji}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>{item.label}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          /* ── Profil yok ── */
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{ fontSize: 72, marginBottom: 20 }}>🐩</div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "#1a1a1a", marginBottom: 10 }}>
              Henüz poodle profiliniz yok
            </h2>
            <p style={{ fontSize: 14, color: "#888", lineHeight: 1.7, marginBottom: 28, maxWidth: 320, margin: "0 auto 28px" }}>
              Poodle'ınızın bilgilerini kaydedin, kişiselleştirilmiş bakım önerileri alın.
            </p>

            <button
              onClick={() => navigate("/yourpoodle/poodle-ekle")}
              style={{ height: 52, borderRadius: 16, background: "#7C3AFF", border: "none", color: "#fff", fontSize: 16, fontWeight: 800, padding: "0 32px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'Inter', sans-serif", marginBottom: 14 }}
            >
              <Plus size={20} />
              Poodle Ekle
            </button>

            {!isLoggedIn && (
              <div>
                <p style={{ fontSize: 12, color: "#aaa", marginBottom: 12 }}>ya da</p>
                <button
                  onClick={() => navigate("/yourpoodle/giris")}
                  style={{ height: 44, borderRadius: 14, border: "2px solid #7C3AFF", background: "transparent", color: "#7C3AFF", fontSize: 14, fontWeight: 700, padding: "0 24px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'Inter', sans-serif" }}
                >
                  <LogIn size={16} />
                  Giriş Yap
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <YPBottomNav />
    </div>
  );
}
