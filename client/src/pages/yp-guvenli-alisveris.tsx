import { ShieldCheck, Lock, CreditCard, Eye, Award } from "lucide-react";
import YPStaticPage from "@/components/yourpoodle/YPStaticPage";

export default function YPGuvenliAlisveris() {
  return (
    <YPStaticPage
      title="Güvenli Alışveriş"
      description="YourPoodle'da güvenli alışveriş: SSL şifreleme, 3D Secure, veri koruma ve alıcı güvencesi."
      updatedDate="16 Temmuz 2026"
      breadcrumb={[{ label:"Ana Sayfa", href:"/yourpoodle" }, { label:"Destek", href:"/yourpoodle/sss" }, { label:"Güvenli Alışveriş" }]}
    >
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:14, marginBottom:32 }}>
        {[
          { Icon:Lock,        title:"256-bit SSL",          desc:"Tüm iletişim uçtan uca şifrelenir." },
          { Icon:ShieldCheck, title:"3D Secure",            desc:"Her ödemede banka doğrulaması." },
          { Icon:CreditCard,  title:"PCI DSS Uyumlu",      desc:"Kart bilgileri sistemimizde saklanmaz." },
          { Icon:Eye,         title:"KVKK & GDPR",          desc:"Kişisel veriler yasal güvence altında." },
          { Icon:Award,       title:"14 Gün İade",          desc:"Koşulsuz iade hakkı." },
        ].map(({ Icon, title, desc }) => (
          <div key={title} style={{ background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:14, padding:"16px", display:"flex", gap:12, alignItems:"flex-start" }}>
            <div style={{ width:38, height:38, borderRadius:10, background:"#EDE5D8", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Icon size={18} color="#5D3A1A" strokeWidth={2}/>
            </div>
            <div>
              <div style={{ fontSize:13, fontWeight:800, color:"#1a1a1a", marginBottom:3 }}>{title}</div>
              <div style={{ fontSize:12.5, color:"#6B7280", lineHeight:1.5 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="sp-section">
        <h2>SSL Şifreleme</h2>
        <p>Sitemiz, endüstri standardı 256-bit SSL (Secure Socket Layer) protokolü ile korunmaktadır. Tarayıcı adres çubuğundaki kilit simgesi, bağlantınızın şifreli olduğunu gösterir. Kredi kartı bilgileriniz dahil tüm verileriniz şifreli olarak iletilir.</p>
      </div>

      <div className="sp-section">
        <h2>3D Secure Ödeme</h2>
        <p>Destekleyen tüm bankalarda 3D Secure doğrulama zorunlu tutulmaktadır. Ödeme sırasında bankanız tarafından gönderilen SMS kodu ile kimliğinizi doğrulamanız istenir. Bu sistem yetkisiz kart kullanımını engeller.</p>
      </div>

      <div className="sp-section">
        <h2>Kart Güvenliği</h2>
        <p>Kredi veya banka kartı bilgileriniz YourPoodle sunucularında saklanmaz. Tüm kart işlemleri PCI DSS sertifikalı ödeme altyapısı (İyzico) üzerinden gerçekleştirilir.</p>
      </div>

      <div className="sp-section">
        <h2>Kabul Edilen Ödeme Yöntemi</h2>
        <ul>
          <li>Visa, Mastercard, Troy (kredi ve banka kartı)</li>
          <li>3D Secure korumalı online ödeme</li>
          <li>256-bit SSL şifreli güvenli altyapı</li>
        </ul>
        <p style={{ marginTop: 8, fontSize: 13.5, color: "#666" }}>YourPoodle Mağazası yalnızca online kredi/banka kartı ödemesini desteklemektedir. Havale, EFT veya kapıda ödeme kabul edilmemektedir.</p>
      </div>

      <div className="sp-section">
        <h2>Alıcı Güvencesi</h2>
        <p>Siparişiniz hasarlı veya yanlış geldiyse tüm masraflar tarafımıza aittir. <strong>14 gün koşulsuz iade</strong> hakkınız mevcuttur. Sorun yaşadığınızda <a href="mailto:info@yourpoodle.com" style={{ color:"#5D3A1A" }}>info@yourpoodle.com</a> adresine yazın.</p>
      </div>

      <a href="/yourpoodle/gizlilik-politikasi" className="sp-cta-btn" style={{ background:"#F5F0E6", color:"#5D3A1A" }}>KVKK / Gizlilik Politikası →</a>
    </YPStaticPage>
  );
}
