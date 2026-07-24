import { useEffect } from "react";
import YPLayout from "@/components/yourpoodle/YPLayout";

const P = "#7022C4";
const DATE = "Son güncelleme: 24 Temmuz 2026";

export type LegalVariant = "kvkk" | "gizlilik" | "kullanim-sartlari" | "mesafeli-satis";

const CONTENT: Record<LegalVariant, { title: string; pageTitle: string; sections: { heading: string; text: string }[] }> = {
  kvkk: {
    title: "KVKK Aydınlatma Metni",
    pageTitle: "KVKK | YourPoodle",
    sections: [
      { heading: "Veri Sorumlusu", text: "YourPoodle (SİZPA Bilişim Ltd. Şti.), 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında veri sorumlusu sıfatıyla hareket etmektedir. İletişim: info@yourpoodle.com" },
      { heading: "İşlenen Kişisel Veriler", text: "Ad-soyad, e-posta adresi, telefon numarası, teslimat adresi, sipariş geçmişi, çerez verileri ve Poodle profilinize ilişkin bilgiler işlenmektedir." },
      { heading: "İşleme Amaçları", text: "Kişisel verileriniz; sipariş yönetimi, üyelik hizmetleri, müşteri desteği, kargo ve lojistik operasyonları, yasal yükümlülüklerin yerine getirilmesi ve güvenliğin sağlanması amaçlarıyla işlenmektedir." },
      { heading: "Aktarım", text: "Verileriniz; kargo firmaları, ödeme altyapı sağlayıcıları ve yasal zorunluluk halinde resmi makamlarla paylaşılabilir. Üçüncü taraflara pazarlama amaçlı satış yapılmamaktadır." },
      { heading: "Haklarınız", text: "KVKK'nın 11. maddesi kapsamında verilerinize erişme, düzeltme, silme, işlemeye itiraz etme ve veri taşınabilirliği haklarına sahipsiniz. Başvurular için: info@yourpoodle.com" },
    ],
  },
  gizlilik: {
    title: "Gizlilik Politikası",
    pageTitle: "Gizlilik | YourPoodle",
    sections: [
      { heading: "Veri Toplama", text: "Sitemizi kullandığınızda, hesap oluşturduğunuzda veya sipariş verdiğinizde kişisel verileriniz toplanmaktadır. Bu veriler güvenli sunucularımızda saklanmaktadır." },
      { heading: "Çerezler", text: "Hizmetlerimizi geliştirmek ve kişiselleştirilmiş içerik sunmak için çerezler kullanılmaktadır. Tarayıcı ayarlarınızdan çerez tercihlerinizi yönetebilirsiniz." },
      { heading: "Veri Güvenliği", text: "SSL şifrelemesi, düzenli güvenlik denetimleri ve erişim kontrolleri ile kişisel verilerinizin güvenliği sağlanmaktadır." },
      { heading: "Üçüncü Taraflar", text: "Google Analytics ve ödeme işlemcileri gibi hizmet sağlayıcılarıyla minimum veri paylaşımı yapılmaktadır. Bu sağlayıcılar kendi gizlilik politikalarına tabidir." },
      { heading: "İletişim", text: "Gizlilik politikasına ilişkin sorularınız için: info@yourpoodle.com" },
    ],
  },
  "kullanim-sartlari": {
    title: "Kullanım Şartları",
    pageTitle: "Kullanım Şartları | YourPoodle",
    sections: [
      { heading: "Kabul", text: "YourPoodle platformunu kullanarak bu kullanım şartlarını kabul etmiş sayılırsınız. Şartları kabul etmiyorsanız platforma erişimden vazgeçiniz." },
      { heading: "Hesap Sorumluluğu", text: "Hesap güvenliğinizden siz sorumlusunuz. Şüpheli aktivite fark ettiğinizde info@yourpoodle.com adresine bildirin. Hesabınızı başkasıyla paylaşmayın." },
      { heading: "İçerik Kullanımı", text: "Platformdaki tüm içerikler (görseller, metinler, marka unsurları) YourPoodle'a aittir. İzinsiz kopyalanması ve dağıtılması yasaktır." },
      { heading: "Topluluk Kuralları", text: "Club bölümünde paylaşılan içerikler Türk hukukuna ve YourPoodle topluluk kurallarına uygun olmalıdır. Nefret söylemi, spam ve yanıltıcı içerik yasaktır." },
      { heading: "Hesap Silme", text: "Hesabınızı dilediğiniz zaman info@yourpoodle.com adresine yazarak silebilirsiniz. Talepler 30 gün içinde işleme alınır." },
    ],
  },
  "mesafeli-satis": {
    title: "Mesafeli Satış Sözleşmesi",
    pageTitle: "Mesafeli Satış Sözleşmesi | YourPoodle",
    sections: [
      { heading: "Satıcı Bilgileri", text: "SİZPA Bilişim Ltd. Şti. | Adres: Cumhuriyet Mah. Atatürk Bulvarı No:42, Atakum/Samsun | Tel: 0362 000 12 34 | E-posta: info@yourpoodle.com" },
      { heading: "Sipariş ve Ödeme", text: "Siparişler onaylandıktan sonra hazırlanmaya başlanır. Ödeme, sipariş sırasında kapıda (nakit/kart) veya havale/EFT ile gerçekleştirilir. Fiyatlara KDV dahildir." },
      { heading: "Teslimat", text: "Siparişler, onay tarihinden itibaren 2-4 iş günü içinde teslim edilir. Kargo ücreti 1.000₺ altı siparişler için ayrıca belirtilir." },
      { heading: "Cayma Hakkı", text: "Ürün tesliminden itibaren 14 gün içinde herhangi bir gerekçe göstermeksizin cayma hakkınızı kullanabilirsiniz. İade kargo ücreti alıcıya aittir. Açılmış, kullanılmış veya bozulmuş ürünler iade kabul edilmez." },
      { heading: "Şikâyet", text: "Tüketici şikâyetleri için önce info@yourpoodle.com üzerinden iletişime geçiniz. Çözüme kavuşamayan başvurular için Tüketici Hakem Heyeti'ne başvurabilirsiniz." },
    ],
  },
};

interface Props { variant: LegalVariant; }

export default function YPLegalPage({ variant }: Props) {
  const c = CONTENT[variant];
  useEffect(() => { document.title = c.pageTitle; }, [c.pageTitle]);

  return (
    <YPLayout constrain={false}>
      <div style={{ minHeight: "100vh", background: "#FAFAFA", paddingBottom: 48 }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 20px 0" }}>
          <p style={{ fontSize: 12, color: "#9CA3AF", margin: "0 0 8px" }}>{DATE}</p>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#111827", margin: "0 0 32px" }}>{c.title}</h1>
          <div style={{ background: "#fff", borderRadius: 18, padding: "28px 32px", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
            {c.sections.map((s, i) => (
              <div key={i} style={{ marginBottom: i < c.sections.length - 1 ? 28 : 0 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: "#111827", margin: "0 0 10px" }}>{s.heading}</h2>
                <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.75, margin: 0 }}>{s.text}</p>
              </div>
            ))}
            <div style={{ marginTop: 32, paddingTop: 20, borderTop: "1px solid #F3F4F6" }}>
              <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>
                Diğer belgeler: {" "}
                <a href="/kvkk" style={{ color: P }}>KVKK</a> · {" "}
                <a href="/gizlilik" style={{ color: P }}>Gizlilik</a> · {" "}
                <a href="/kullanim-sartlari" style={{ color: P }}>Kullanım Şartları</a> · {" "}
                <a href="/mesafeli-satis-sozlesmesi" style={{ color: P }}>Mesafeli Satış</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </YPLayout>
  );
}
