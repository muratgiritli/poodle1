import { useEffect } from "react";
import { useLocation } from "wouter";
import { ChevronLeft } from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";

const CSS = `
  .tos-wrap { max-width: 760px; margin: 0 auto; padding: 32px 20px 64px; font-family: Inter, sans-serif; }
  .tos-section { margin-bottom: 32px; }
  .tos-section h2 { font-size: 17px; font-weight: 800; color: #1a1a1a; margin-bottom: 10px; padding-top: 8px; border-top: 1px solid #f0f0f0; }
  .tos-section p, .tos-section li { font-size: 14px; color: #555; line-height: 1.75; }
  .tos-section ul, .tos-section ol { padding-left: 20px; margin-top: 8px; }
  .tos-section li { margin-bottom: 6px; }
  @media (min-width: 768px) { .tos-wrap { padding: 48px 32px 80px; } }
`;

export default function YPKullanimSartlari() {
  const [, navigate] = useLocation();

  useEffect(() => {
    document.title = "Kullanım Şartları | YourPoodle";
    const setMeta = (attr: string, key: string, val: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
      el.content = val;
    };
    setMeta("name", "description", "YourPoodle kullanım şartları. Platformu kullanmadan önce lütfen bu şartları okuyun.");
    setMeta("name", "robots", "index, follow");
  }, []);

  return (
    <YPLayout activeLink="" constrain={false}>
      <style>{CSS}</style>
      <main>
        <div className="tos-wrap">
          <button onClick={() => navigate(-1 as any)}
            style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", cursor:"pointer", color:"#888", fontSize:13, fontWeight:600, fontFamily:"Inter,sans-serif", marginBottom:28, padding:0 }}>
            <ChevronLeft size={16} /> Geri Dön
          </button>

          <h1 style={{ fontSize:28, fontWeight:900, color:"#1a1a1a", marginBottom:8, letterSpacing:"-0.3px" }}>Kullanım Şartları</h1>
          <p style={{ fontSize:13, color:"#aaa", marginBottom:32 }}>Son güncelleme: 16 Temmuz 2026 · Geçerlilik tarihi: 16 Temmuz 2026</p>

          <div className="tos-section">
            <h2>1. Genel</h2>
            <p>
              Bu Kullanım Şartları ("Şartlar"), YourPoodle platformunu ("<strong>Platform</strong>") işleten <strong>Sizpa Yazılım ve Teknoloji A.Ş.</strong> ("Şirket", "biz") ile platformu kullanan gerçek kişiler ("Kullanıcı", "siz") arasındaki hukuki ilişkiyi düzenler.
            </p>
            <p style={{ marginTop:10 }}>
              Platforma erişerek veya platformu kullanarak bu Şartları kabul etmiş sayılırsınız. Şartları kabul etmiyorsanız platformu kullanmayın.
            </p>
          </div>

          <div className="tos-section">
            <h2>2. Üyelik ve Hesap</h2>
            <ul>
              <li>Platform üyeliği tamamen <strong>ücretsizdir</strong>. Gizli ücret veya zorunlu abonelik bulunmamaktadır.</li>
              <li>Üye olmak için Türkiye'de geçerli bir cep telefonu numarası (5XX formatında) veya Google hesabı gereklidir.</li>
              <li>Her telefon numarası ile yalnızca bir hesap oluşturulabilir.</li>
              <li>Hesap güvenliğinden kullanıcı sorumludur. Şüpheli giriş durumunda derhal <a href="mailto:info@yourpoodle.com">info@yourpoodle.com</a> ile iletişime geçin.</li>
              <li>18 yaşın altındaki kullanıcılar platformu yalnızca ebeveyn/vasi gözetiminde kullanabilir.</li>
            </ul>
          </div>

          <div className="tos-section">
            <h2>3. İçerik Kuralları</h2>
            <p>YourPoodle topluluğunda aşağıdaki içerikler <strong>yasaktır</strong>:</p>
            <ul>
              <li>Yanıltıcı, sahte veya başka kullanıcılara zarar veren paylaşımlar</li>
              <li>Nefret söylemi, taciz, zorbalık veya ayrımcı içerikler</li>
              <li>Telif hakkı ihlali içeren materyal</li>
              <li>Reklam/spam amaçlı izinsiz içerik</li>
              <li>Hayvan refahını tehdit eden veya şiddeti teşvik eden içerikler</li>
            </ul>
            <p style={{ marginTop:10 }}>Kural ihlali tespit edildiğinde içerik kaldırılır ve hesap askıya alınabilir veya kalıcı olarak kapatılabilir.</p>
          </div>

          <div className="tos-section">
            <h2>4. Fikri Mülkiyet</h2>
            <ul>
              <li>Platform'un tasarımı, kodu ve özgün içerikleri Sizpa Yazılım A.Ş.'ye aittir.</li>
              <li>Kullanıcılar paylaştıkları içeriklerin telif hakkına sahip olduğunu beyan eder; bu içeriklerin lisansını bize ücretsiz, dünya genelinde ve süresiz olarak verir.</li>
              <li>Başkalarına ait içerikleri izinsiz paylaşmak yasaktır.</li>
            </ul>
          </div>

          <div className="tos-section">
            <h2>5. Sorumluluk Sınırlaması</h2>
            <p>
              Platform "olduğu gibi" sunulmaktadır. Şirket; kesintisiz erişim, hatasız çalışma veya üçüncü taraf içeriklerin doğruluğu konusunda garanti vermez. Yasaların izin verdiği azami ölçüde sorumluluk sınırlandırılmıştır.
            </p>
            <p style={{ marginTop:10 }}>
              Veteriner önerileri dahil tüm sağlık içerikleri <strong>bilgi amaçlıdır</strong>; profesyonel veteriner muayenesinin yerini tutmaz.
            </p>
          </div>

          <div className="tos-section">
            <h2>6. Hesap Feshi</h2>
            <ul>
              <li>Hesabınızı dilediğiniz zaman <a href="mailto:info@yourpoodle.com">info@yourpoodle.com</a> adresine yazarak silebilirsiniz.</li>
              <li>Şirket, Şartları ihlal eden hesapları önceden bildirim yapmaksızın askıya alabilir veya silebilir.</li>
              <li>Hesap silinmesi durumunda kullanıcı tarafından paylaşılan içerikler 30 gün içinde silinir (yasal zorunluluklar hariç).</li>
            </ul>
          </div>

          <div className="tos-section">
            <h2>7. Değişiklikler</h2>
            <p>
              Bu Şartlar zaman zaman güncellenebilir. Önemli değişiklikler e-posta veya platform bildirimi ile duyurulur. Değişiklik sonrası platformu kullanmaya devam etmeniz yeni Şartları kabul ettiğiniz anlamına gelir.
            </p>
          </div>

          <div className="tos-section">
            <h2>8. Uygulanacak Hukuk</h2>
            <p>Bu Şartlar Türk Hukuku'na tabidir. Uyuşmazlıklarda İstanbul Mahkemeleri ve İcra Daireleri yetkilidir.</p>
          </div>

          <div className="tos-section" style={{ background:"#F5F0FF", borderRadius:16, padding:"20px", border:"none" }}>
            <h2 style={{ border:"none", paddingTop:0 }}>İletişim</h2>
            <p>Kullanım şartları hakkında sorularınız için:</p>
            <ul style={{ marginTop:8 }}>
              <li><strong>E-posta:</strong> <a href="mailto:info@yourpoodle.com" style={{ color:"#7C3AFF" }}>info@yourpoodle.com</a></li>
              <li><strong>Platform:</strong> YourPoodle / Sizpa Yazılım ve Teknoloji A.Ş.</li>
            </ul>
          </div>
        </div>
      </main>
    </YPLayout>
  );
}
