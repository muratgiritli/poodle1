import { ShieldCheck, Lock, Globe } from "lucide-react";
import YPStaticPage from "@/components/yourpoodle/YPStaticPage";
import { IS_YP } from "@/lib/store";

const BASE = IS_YP ? "" : "/yourpoodle";

export default function YPSslPage() {
  return (
    <YPStaticPage
      title="SSL Sertifikası"
      description="YourPoodle 256-bit SSL ile güvenli bağlantı. Verileriniz uçtan uca şifrelenir."
      updatedDate="10 Ağustos 2026"
      breadcrumb={[{ label: "Ana Sayfa", href: BASE || "/" }, { label: "SSL Sertifikası" }]}
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14, marginBottom: 28 }}>
        {[
          { Icon: Lock, title: "256-bit SSL", desc: "TLS ile şifreli bağlantı" },
          { Icon: ShieldCheck, title: "Güvenli Ödeme", desc: "Kart verisi sitede saklanmaz" },
          { Icon: Globe, title: "HTTPS", desc: "Adres çubuğunda kilit simgesi" },
        ].map(({ Icon, title, desc }) => (
          <div key={title} style={{ background: "#F5F0E6", borderRadius: 14, padding: 16, display: "1px solid #E5DDD0" }}>
            <Icon size={20} color="#5D3A1A" style={{ marginBottom: 8 }} />
            <div style={{ fontWeight: 800, fontSize: 14, color: "#2C2118" }}>{title}</div>
            <div style={{ fontSize: 13, color: "#8A7E72", marginTop: 4 }}>{desc}</div>
          </div>
        ))}
      </div>
      <div className="sp-section">
        <h2>SSL Nedir?</h2>
        <p>
          SSL (Secure Sockets Layer) / TLS, tarayıcınız ile YourPoodle sunucuları arasındaki veriyi şifreler.
          Sipariş, üyelik ve ödeme sırasında iletilen bilgiler üçüncü kişilerin okuyamayacağı biçimde korunur.
        </p>
      </div>
      <div className="sp-section">
        <h2>Nasıl Anlarsınız?</h2>
        <ul>
          <li>Adres çubuğunda <strong>kilit</strong> simgesi görünür.</li>
          <li>Adres <strong>https://</strong> ile başlar.</li>
          <li>Footer’daki yeşil SSL rozeti güvenli bağlantıyı gösterir.</li>
        </ul>
      </div>
      <a href={`${BASE}/guvenli-alisveris`} className="sp-cta-btn" style={{ background: "#F5F0E6", color: "#5D3A1A" }}>
        Güvenli Alışveriş →
      </a>
    </YPStaticPage>
  );
}
