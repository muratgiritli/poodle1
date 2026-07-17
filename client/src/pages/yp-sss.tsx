import { useState } from "react";
import YPStaticPage from "@/components/yourpoodle/YPStaticPage";

const SECTIONS = [
  {
    title: "Genel",
    items: [
      { q: "YourPoodle nedir?", a: "YourPoodle, Toy Poodle ve Miniature Poodle sahipleri için mama, aksesuar ve bakım ürünleri satan bir e-ticaret ve topluluk platformudur." },
      { q: "Nasıl üye olabilirim?", a: "Ana sayfadaki 'Ücretsiz Başla' butonuna tıklayın, telefon numaranızla OTP doğrulaması yapın. Kayıt tamamen ücretsizdir." },
      { q: "Poodle Club nedir?", a: "Poodle Club, 500+ poodle sahibinin bir araya geldiği sosyal platformdur. Fotoğraf paylaşabilir, etkinliklere katılabilir, deneyim aktarabilirsiniz." },
    ],
  },
  {
    title: "Mağaza & Sipariş",
    items: [
      { q: "Sipariş nasıl veririm?", a: "Ürün sayfasına gidin, adet seçin, 'Sepete Ekle' butonuna tıklayın ve ödeme adımlarını takip edin. Üye olmadan misafir olarak da sipariş verebilirsiniz." },
      { q: "Hangi ödeme yöntemleri kabul ediliyor?", a: "Yalnızca online kredi/banka kartı ile ödeme yapılmaktadır (Visa, Mastercard, Troy). Tüm ödemeler 256-bit SSL şifreleme ve 3D Secure güvencesiyle gerçekleşir. Kredi kartı ile 12 taksit imkânı mevcuttur." },
      { q: "Siparişimi nasıl iptal edebilirim?", a: "Sipariş kargoya verilmeden önce 'Siparişlerim' bölümünden iptal edebilirsiniz. Kargoya verildikten sonra iade sürecini başlatmanız gerekir." },
      { q: "Fatura bilgilerimi nasıl güncelleyebilirim?", a: "Hesabım > Fatura Bilgileri bölümünden güncelleyebilirsiniz. Verilen siparişlerin faturası değiştirilemez." },
    ],
  },
  {
    title: "Kargo",
    items: [
      { q: "Kargo süresi ne kadar?", a: "Türkiye içi siparişler 1-3 iş günü içinde teslim edilir. Stokta olan ürünler genellikle aynı gün kargoya verilir." },
      { q: "Ücretsiz kargo var mı?", a: "299 TL ve üzeri siparişlerde kargo ücretsizdir. Altındaki siparişlerde standart kargo ücreti uygulanır." },
      { q: "Kargo firmam hangisi?", a: "Yurt içi teslimatlar Yurtiçi Kargo veya MNG Kargo ile yapılmaktadır. Kargo firmasını seçemezsiniz." },
      { q: "Siparişimi nasıl takip edebilirim?", a: "Sipariş onay e-postasındaki takip numarasını kargo firmasının sitesinde sorgulayabilirsiniz. Ayrıca SMS ile bilgilendirme gönderilir." },
    ],
  },
  {
    title: "İade",
    items: [
      { q: "İade süresi ne kadar?", a: "Ürünü teslim aldıktan itibaren 14 gün içinde iade talebinde bulunabilirsiniz." },
      { q: "Hangi ürünler iade edilemez?", a: "Açılmış mama paketleri, kullanılmış bakım ürünleri ve kişiselleştirilmiş ürünler iade edilemez. Detaylar için İade ve Değişim sayfamıza bakın." },
      { q: "İade süreci nasıl işler?", a: "İade talebinizi oluşturduktan sonra kargo kodu gönderilir. Ürün bize ulaştıktan 3-5 iş günü içinde iade işleminiz tamamlanır." },
    ],
  },
  {
    title: "Üyelik & Club",
    items: [
      { q: "Club üyeliği ücretli mi?", a: "Hayır, tamamen ücretsizdir. Kayıt için yalnızca telefon numaranız yeterlidir." },
      { q: "Şifremi unuttum, ne yapmalıyım?", a: "Giriş ekranındaki 'Şifremi Unuttum' linkine tıklayın veya telefon numaranızla OTP ile giriş yapın." },
      { q: "Hesabımı nasıl silebilirim?", a: "info@yourpoodle.com adresine e-posta göndererek hesap silme talebinde bulunabilirsiniz. Verileriniz 30 gün içinde silinir." },
    ],
  },
  {
    title: "AI Asistan",
    items: [
      { q: "AI Asistan'ın yanıtları güvenilir mi?", a: "AI Asistan genel bilgi sağlar; veteriner tavsiyesinin yerini tutmaz. Sağlık konularında mutlaka veterinerinize danışın." },
      { q: "Günde kaç soru sorabiliyorum?", a: "Misafir kullanıcılar günde 5 soru sorabilir. Üye girişiyle limit artırılabilir." },
      { q: "AI hangi konularda yardımcı olabilir?", a: "Mama seçimi, beslenme, tıraş rutini, tuvalet eğitimi, davranış sorunları ve genel sağlık tavsiyeleri konularında yardım sağlar." },
    ],
  },
];

function Accordion({ items }: { items: typeof SECTIONS[0]["items"] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div style={{ border:"1px solid #f0f0f0", borderRadius:14, overflow:"hidden" }}>
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: i < items.length - 1 ? "1px solid #f0f0f0" : "none" }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 16px", background:"none", border:"none", cursor:"pointer", textAlign:"left", gap:12 }}
          >
            <span style={{ fontSize:14, fontWeight:700, color:"#1a1a1a", lineHeight:1.4 }}>{item.q}</span>
            <span style={{ fontSize:18, color:"#7C3AED", flexShrink:0, lineHeight:1 }}>{open === i ? "−" : "+"}</span>
          </button>
          <div style={{ maxHeight: open === i ? "400px" : "0", overflow:"hidden", transition:"max-height 0.28s ease" }}>
            <p style={{ fontSize:14, color:"#555", lineHeight:1.75, padding:"0 16px 16px", margin:0 }}>{item.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function YPSSS() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SECTIONS.flatMap(s => s.items.map(item => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    }))),
  };

  return (
    <YPStaticPage
      title="Sık Sorulan Sorular"
      description="YourPoodle hakkında en çok sorulan sorular: sipariş, kargo, iade, üyelik ve AI Asistan."
      updatedDate="16 Temmuz 2026"
      breadcrumb={[{ label:"Ana Sayfa", href:"/yourpoodle" }, { label:"Destek", href:"/yourpoodle/bilgi" }, { label:"Sık Sorulan Sorular" }]}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <p style={{ fontSize:14, color:"#555", lineHeight:1.75, marginBottom:28 }}>
        Aradığınızı bulamazsanız <a href="mailto:info@yourpoodle.com" style={{ color:"#7C3AED", fontWeight:700 }}>info@yourpoodle.com</a> adresinden bize ulaşabilirsiniz.
      </p>
      {SECTIONS.map(s => (
        <div key={s.title} className="sp-section">
          <h2>{s.title}</h2>
          <Accordion items={s.items} />
        </div>
      ))}
      <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginTop:8 }}>
        <a href="/yourpoodle/kargo" className="sp-cta-btn" style={{ background:"#F5F0FF", color:"#7C3AED" }}>Kargo Bilgileri →</a>
        <a href="/yourpoodle/iade" className="sp-cta-btn" style={{ background:"#F5F0FF", color:"#7C3AED" }}>İade & Değişim →</a>
      </div>
    </YPStaticPage>
  );
}
