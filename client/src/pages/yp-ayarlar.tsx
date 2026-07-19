import { useState } from "react";
import { useLocation } from "wouter";
import { Bell, Lock, User, ChevronLeft, Check, Shield, Moon, Globe } from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { useCustomer } from "@/contexts/CustomerContext";

export default function YPAyarlarPage() {
  const [, navigate] = useLocation();
  const { isLoggedIn, customer } = useCustomer();
  const [saved, setSaved] = useState<string | null>(null);

  const [notifs, setNotifs] = useState({
    newPost: true,
    eventReminder: true,
    orderStatus: true,
    promotions: false,
    newsletter: false,
  });

  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    dogPublic: true,
    showInSearch: true,
  });

  const save = (section: string) => {
    setSaved(section);
    setTimeout(() => setSaved(null), 2000);
  };

  if (!isLoggedIn) {
    return (
      <YPLayout activeLink="/yourpoodle/ayarlar">
        <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, fontFamily: "Inter,sans-serif" }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🔒</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#1a1a1a", marginBottom: 8 }}>Giriş Gerekli</div>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 24, textAlign: "center" }}>Ayarlarınıza erişmek için giriş yapın.</p>
          <button onClick={() => navigate("/yourpoodle/giris")}
            style={{ padding: "12px 28px", borderRadius: 12, border: "none", background: "#7C3AED", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
            Giriş Yap
          </button>
        </div>
      </YPLayout>
    );
  }

  return (
    <YPLayout activeLink="/yourpoodle/ayarlar">
      <title>Ayarlar | YourPoodle</title>
      <style>{`
        .ayar-section { background: #fff; border-radius: 16px; border: 1px solid #F0EAFF; margin: 0 16px 16px; overflow: hidden; }
        .ayar-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid #F9F5FF; }
        .ayar-row:last-child { border-bottom: none; }
        .toggle-track { width: 44px; height: 24px; border-radius: 12px; cursor: pointer; border: none; position: relative; transition: background 0.2s; flex-shrink: 0; }
        .toggle-thumb { position: absolute; top: 3px; width: 18px; height: 18px; border-radius: 50%; background: #fff; transition: left 0.2s; box-shadow: 0 1px 4px rgba(0,0,0,0.2); }
        @media (min-width: 900px) { .ayar-section { margin: 0 0 16px; } }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#FAFAFA", fontFamily: "Inter,sans-serif", paddingBottom: 40 }}>

        {/* Header */}
        <div style={{ background: "#fff", borderBottom: "1px solid #F0EAFF", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => navigate("/hesabim")}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", color: "#7C3AED" }}>
            <ChevronLeft size={22} />
          </button>
          <h1 style={{ fontSize: 17, fontWeight: 900, color: "#1a1a1a", margin: 0 }}>Hesap Ayarları</h1>
        </div>

        {/* Profile summary */}
        <div style={{ background: "linear-gradient(135deg,#7C3AED,#A855F7)", padding: "20px 16px", margin: "16px 16px 0", borderRadius: 16, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <User size={28} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>{customer?.name || "Kullanıcı"}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 2 }}>{customer?.phone || ""}</div>
          </div>
        </div>

        {/* Bildirim Ayarları */}
        <div style={{ padding: "20px 0 4px 16px", fontSize: 11, fontWeight: 800, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          <Bell size={12} style={{ display: "inline", marginRight: 5 }} />BİLDİRİM TERCİHLERİ
        </div>
        <div className="ayar-section">
          {([
            { key: "newPost" as const, label: "Yeni Club Paylaşımı", desc: "Takip ettiğiniz poodle'lar paylaşım yaptığında" },
            { key: "eventReminder" as const, label: "Etkinlik Hatırlatıcısı", desc: "Kayıtlı etkinlikleriniz için 24 saat öncesinden" },
            { key: "orderStatus" as const, label: "Sipariş Güncellemeleri", desc: "Sipariş durumu değiştiğinde SMS & bildirim" },
            { key: "promotions" as const, label: "Kampanya & İndirimler", desc: "Özel fırsatlar ve yeni ürünler" },
            { key: "newsletter" as const, label: "E-posta Bülteni", desc: "Aylık poodle bakım ipuçları ve haberler" },
          ] as const).map(({ key, label, desc }) => (
            <div key={key} className="ayar-row">
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1a1a1a" }}>{label}</div>
                <div style={{ fontSize: 11.5, color: "#9CA3AF", marginTop: 2 }}>{desc}</div>
              </div>
              <button className="toggle-track"
                style={{ background: notifs[key] ? "#7C3AED" : "#E5E7EB" }}
                onClick={() => setNotifs(n => ({ ...n, [key]: !n[key] }))}>
                <div className="toggle-thumb" style={{ left: notifs[key] ? 23 : 3 }} />
              </button>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "right", padding: "0 16px 8px" }}>
          <button onClick={() => save("bildirim")}
            style={{ padding: "7px 18px", borderRadius: 10, border: "none", background: saved === "bildirim" ? "#16A34A" : "#7C3AED", color: "#fff", fontSize: 12, fontWeight: 800, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5, transition: "background 0.2s" }}>
            {saved === "bildirim" ? <><Check size={13} /> Kaydedildi</> : "Kaydet"}
          </button>
        </div>

        {/* Gizlilik */}
        <div style={{ padding: "8px 0 4px 16px", fontSize: 11, fontWeight: 800, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          <Shield size={12} style={{ display: "inline", marginRight: 5 }} />GİZLİLİK
        </div>
        <div className="ayar-section">
          {([
            { key: "profilePublic" as const, label: "Profil Herkese Açık", desc: "Profilinizi giriş yapmadan görüntüleyebilirler" },
            { key: "dogPublic" as const, label: "Köpek Profili Herkese Açık", desc: "Poodle profiliniz arama sonuçlarında görünür" },
            { key: "showInSearch" as const, label: "Aramada Görün", desc: "Diğer üyeler sizi kullanıcı adıyla bulabilir" },
          ] as const).map(({ key, label, desc }) => (
            <div key={key} className="ayar-row">
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1a1a1a" }}>{label}</div>
                <div style={{ fontSize: 11.5, color: "#9CA3AF", marginTop: 2 }}>{desc}</div>
              </div>
              <button className="toggle-track"
                style={{ background: privacy[key] ? "#7C3AED" : "#E5E7EB" }}
                onClick={() => setPrivacy(p => ({ ...p, [key]: !p[key] }))}>
                <div className="toggle-thumb" style={{ left: privacy[key] ? 23 : 3 }} />
              </button>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "right", padding: "0 16px 8px" }}>
          <button onClick={() => save("gizlilik")}
            style={{ padding: "7px 18px", borderRadius: 10, border: "none", background: saved === "gizlilik" ? "#16A34A" : "#7C3AED", color: "#fff", fontSize: 12, fontWeight: 800, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5, transition: "background 0.2s" }}>
            {saved === "gizlilik" ? <><Check size={13} /> Kaydedildi</> : "Kaydet"}
          </button>
        </div>

        {/* Güvenlik */}
        <div style={{ padding: "8px 0 4px 16px", fontSize: 11, fontWeight: 800, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          <Lock size={12} style={{ display: "inline", marginRight: 5 }} />GÜVENLİK
        </div>
        <div className="ayar-section">
          <div className="ayar-row" style={{ cursor: "pointer" }} onClick={() => navigate("/hesabim?tab=sifre")}>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1a1a1a" }}>Şifre Değiştir</div>
              <div style={{ fontSize: 11.5, color: "#9CA3AF", marginTop: 2 }}>Hesap güvenliğiniz için düzenli olarak güncelleyin</div>
            </div>
            <ChevronLeft size={16} color="#CCC" style={{ transform: "rotate(180deg)" }} />
          </div>
          <div className="ayar-row" style={{ cursor: "pointer" }} onClick={() => navigate("/hesabim?tab=oturumlar")}>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1a1a1a" }}>Aktif Oturumlar</div>
              <div style={{ fontSize: 11.5, color: "#9CA3AF", marginTop: 2 }}>Hesabınıza giriş yapılan cihazları görün</div>
            </div>
            <ChevronLeft size={16} color="#CCC" style={{ transform: "rotate(180deg)" }} />
          </div>
        </div>

        {/* Dil / Görünüm */}
        <div style={{ padding: "8px 0 4px 16px", fontSize: 11, fontWeight: 800, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          <Globe size={12} style={{ display: "inline", marginRight: 5 }} />GÖRÜNÜM
        </div>
        <div className="ayar-section">
          <div className="ayar-row">
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1a1a1a" }}>Dil</div>
              <div style={{ fontSize: 11.5, color: "#9CA3AF", marginTop: 2 }}>Türkçe</div>
            </div>
            <span style={{ fontSize: 12, color: "#7C3AED", fontWeight: 700 }}>Türkçe</span>
          </div>
          <div className="ayar-row">
            <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
              <Moon size={16} color="#9CA3AF" />
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1a1a1a" }}>Karanlık Mod</div>
                <div style={{ fontSize: 11.5, color: "#9CA3AF", marginTop: 2 }}>Yakında geliyor</div>
              </div>
            </div>
            <span style={{ fontSize: 11, color: "#D1D5DB", fontWeight: 700, background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 6, padding: "3px 8px" }}>Yakında</span>
          </div>
        </div>

        {/* Hesap Sil */}
        <div style={{ margin: "8px 16px 32px" }}>
          <button style={{ width: "100%", padding: "13px", borderRadius: 12, border: "1.5px solid #FCA5A5", background: "#FEF2F2", color: "#EF4444", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}
            onClick={() => { if (confirm("Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) alert("Hesap silme için destek@yourpoodle.com adresine yazın."); }}>
            Hesabı Sil
          </button>
        </div>
      </div>
    </YPLayout>
  );
}
