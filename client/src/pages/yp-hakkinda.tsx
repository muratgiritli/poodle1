import { useLocation } from "wouter";
import YPLayout from "@/components/yourpoodle/YPLayout";
import YPBreadcrumb from "@/components/YPBreadcrumb";

const BREADCRUMBS = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Hakkımızda", href: "/yourpoodle/hakkinda" },
];

const TEAM = [
  {
    emoji: "🐾",
    name: "Veteriner Dan. Ekibi",
    title: "Klinik Danışmanlar",
    bio: "İçeriklerimiz, Türkiye'deki köpek sağlığı ve beslenmesi konusunda uzman veteriner hekimler tarafından gözden geçirilmektedir. Sağlık, aşı takvimleri ve beslenme rehberleri doğrudan bu ekip tarafından onaylanır.",
  },
  {
    emoji: "✍️",
    name: "İçerik Ekibi",
    title: "Uzman Yazarlar",
    bio: "Poodle sahipliği deneyimine sahip yazarlardan oluşan ekibimiz, gerçek hayat deneyimlerini bilimsel kaynaklarla birleştirerek pratik, uygulanabilir rehberler üretir.",
  },
  {
    emoji: "🔬",
    name: "Araştırma & Doğrulama",
    title: "Kaynak Kontrolü",
    bio: "Tüm içerikler yayına girmeden önce güncel veteriner literatürü, ırk standartları ve beslenme araştırmalarıyla çapraz kontrol yapılır.",
  },
];

const METHODOLOGY = [
  { icon: "📚", title: "Bilimsel Kaynak", desc: "Her rehber veteriner literatürü, ırk bilgi bankaları ve kanıta dayalı köpek beslenmesi kaynaklarına dayanır." },
  { icon: "🩺", title: "Veteriner Onayı", desc: "Sağlık ve beslenme içerikleri, yayına girmeden önce veteriner hekim danışmanlarımız tarafından gözden geçirilir." },
  { icon: "🔄", title: "Düzenli Güncelleme", desc: "İçerikler yılda en az bir kez, güncel araştırmalar ve kullanıcı geri bildirimleri doğrultusunda revize edilir." },
  { icon: "⚠️", title: "Sınırlamalar", desc: "AI asistanımız ve içeriklerimiz genel bilgi amaçlıdır. Her zaman kendi veterinerinize danışın." },
];

export default function YPHakkindaPage() {
  const [, navigate] = useLocation();

  return (
    <YPLayout activeLink="/yourpoodle/hakkinda">
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: "#FAFAF9" }}>
      <YPBreadcrumb items={BREADCRUMBS} />

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section style={{ background: "linear-gradient(135deg, #7C3AFF 0%, #5B21B6 100%)", padding: "48px 20px 40px", textAlign: "center", color: "#fff" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🐾</div>
        <h1 style={{ fontSize: 26, fontWeight: 900, lineHeight: 1.3, marginBottom: 14 }}>
          YourPoodle Hakkında
        </h1>
        <p style={{ fontSize: 15, lineHeight: 1.7, opacity: 0.9, maxWidth: 520, margin: "0 auto" }}>
          Toy Poodle sahiplerinin en güvenilir dijital arkadaşı olmak için kurulduk.
          Bilimsel içerik, pratik araçlar ve gerçek bir toplulukla poodle bakımını kolaylaştırıyoruz.
        </p>
      </section>

      {/* ── Hikayemiz ──────────────────────────────────────────────────── */}
      <section style={{ padding: "32px 20px", maxWidth: 640, margin: "0 auto" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: "#1a1a1a", marginBottom: 16 }}>Neden YourPoodle?</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <p style={{ fontSize: 14, color: "#444", lineHeight: 1.8, margin: 0 }}>
              Toy Poodle sahipleri, diğer ırklara kıyasla çok daha spesifik bilgiye ihtiyaç duyar. Tüy bakımı, 
              beslenme hassasiyeti, eğitim zekası ve sağlık riskleri açısından poodle gerçekten özgün bir ırktır. 
              Genel "köpek bakımı" rehberleri çoğu zaman yetersiz kalır.
            </p>
          </div>
          <div style={{ background: "#EDE8FF", borderRadius: 16, padding: "20px" }}>
            <p style={{ fontSize: 14, color: "#5B21B6", lineHeight: 1.8, margin: 0, fontWeight: 600 }}>
              YourPoodle, tüm bu boşluğu doldurmak için tasarlandı: Türk poodle sahiplerine ana dillerinde, 
              güvenilir, derinlemesine içerik ve pratik araçlar sunmak.
            </p>
          </div>
          <div style={{ background: "#fff", borderRadius: 16, padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <p style={{ fontSize: 14, color: "#444", lineHeight: 1.8, margin: 0 }}>
              Arkamızda Samsun'da faaliyet gösteren Sizpa İnternet Tic. Ltd. Şti. bulunmaktadır — 
              köpek ürünleri alanında yıllarca edindiğimiz deneyimi dijital bir platforma taşıyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* ── İçerik Ekibi ───────────────────────────────────────────────── */}
      <section style={{ padding: "0 20px 32px", maxWidth: 640, margin: "0 auto" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: "#1a1a1a", marginBottom: 16 }}>İçerik Ekibimiz</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {TEAM.map((member) => (
            <article key={member.name} style={{ background: "#fff", borderRadius: 16, padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{ fontSize: 36, flexShrink: 0 }}>{member.emoji}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a", marginBottom: 2 }}>{member.name}</div>
                <div style={{ fontSize: 12, color: "#7C3AFF", fontWeight: 700, marginBottom: 8 }}>{member.title}</div>
                <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7, margin: 0 }}>{member.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── İçerik Metodolojisi ────────────────────────────────────────── */}
      <section style={{ padding: "0 20px 32px", maxWidth: 640, margin: "0 auto" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: "#1a1a1a", marginBottom: 16 }}>İçerik Metodolojimiz</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {METHODOLOGY.map((item) => (
            <div key={item.title} style={{ background: "#fff", borderRadius: 16, padding: "18px 16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{item.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#1a1a1a", marginBottom: 6 }}>{item.title}</div>
              <p style={{ fontSize: 12, color: "#666", lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Önemli Uyarı ───────────────────────────────────────────────── */}
      <section style={{ padding: "0 20px 32px", maxWidth: 640, margin: "0 auto" }}>
        <div style={{ background: "#FFF3CD", border: "1.5px solid #F59E0B", borderRadius: 16, padding: "20px" }}>
          <div style={{ fontSize: 20, marginBottom: 8 }}>⚠️</div>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: "#92400E", marginBottom: 8 }}>Veteriner Tavsiyesinin Yerine Geçmez</h3>
          <p style={{ fontSize: 13, color: "#78350F", lineHeight: 1.7, margin: 0 }}>
            YourPoodle üzerindeki tüm içerikler, AI asistanı dahil, genel bilgilendirme amacıyla sunulmaktadır.
            Poodle'ınızın sağlık sorunları, diyet kısıtlamaları veya tıbbi durumları için lütfen lisanslı 
            bir veteriner hekimine danışın. Belirtiler ciddi görünüyorsa zaman kaybetmeden veterinere gidin.
          </p>
        </div>
      </section>

      {/* ── İletişim ───────────────────────────────────────────────────── */}
      <section style={{ padding: "0 20px 32px", maxWidth: 640, margin: "0 auto" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: "#1a1a1a", marginBottom: 16 }}>İletişim</h2>
        <div style={{ background: "#fff", borderRadius: 20, padding: "24px 20px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 22 }}>📧</span>
              <div>
                <div style={{ fontSize: 12, color: "#999", fontWeight: 600 }}>E-posta</div>
                <a href="mailto:info@sizpa.com" style={{ fontSize: 14, fontWeight: 700, color: "#7C3AFF", textDecoration: "none" }}>info@sizpa.com</a>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 22 }}>🏢</span>
              <div>
                <div style={{ fontSize: 12, color: "#999", fontWeight: 600 }}>Şirket</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>Sizpa İnternet Tic. Ltd. Şti.</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 22 }}>📍</span>
              <div>
                <div style={{ fontSize: 12, color: "#999", fontWeight: 600 }}>Adres</div>
                <div style={{ fontSize: 14, color: "#444", lineHeight: 1.5 }}>Yenimahalle Atatürk 3. Kısım Blv. No:113/A,<br />Atakum, Samsun (55200)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bağlantılar ────────────────────────────────────────────────── */}
      <section style={{ padding: "0 20px 16px", maxWidth: 640, margin: "0 auto" }}>
        <h2 style={{ fontSize: 16, fontWeight: 900, color: "#1a1a1a", marginBottom: 12 }}>Politikalar</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[
            ["Gizlilik Politikası", "/gizlilik"],
            ["Çerez Politikası", "/cerez-politikasi"],
            ["KVKK", "/kvkk"],
            ["Kullanım Koşulları", "/kullanim-kosullari"],
            ["Teslimat & İade", "/teslimat-iade"],
          ].map(([label, href]) => (
            <button
              key={href}
              onClick={() => navigate(href)}
              style={{ fontSize: 12, color: "#7C3AFF", background: "#F3F0FF", border: "none", borderRadius: 20, padding: "6px 14px", cursor: "pointer", fontWeight: 600 }}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

    </div>
    </YPLayout>
  );
}
