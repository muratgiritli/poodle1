import { useEffect } from "react";
import { useLocation } from "wouter";
import { ChevronLeft } from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";

const CSS = `
  .giz-wrap { max-width: 760px; margin: 0 auto; padding: 32px 20px 64px; font-family: Inter, sans-serif; }
  .giz-section { margin-bottom: 32px; }
  .giz-section h2 { font-size: 17px; font-weight: 800; color: #1a1a1a; margin-bottom: 10px; padding-top: 8px; border-top: 1px solid #f0f0f0; }
  .giz-section p, .giz-section li { font-size: 14px; color: #555; line-height: 1.75; }
  .giz-section ul { padding-left: 20px; margin-top: 8px; }
  .giz-section li { margin-bottom: 6px; }
  .giz-table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 10px; }
  .giz-table th, .giz-table td { padding: 10px 12px; text-align: left; border: 1px solid #f0f0f0; }
  .giz-table th { background: #F5F0FF; color: #7C3AFF; font-weight: 700; }
  @media (min-width: 768px) { .giz-wrap { padding: 48px 32px 80px; } }
`;

export default function YPGizlilikPolitikasi() {
  const [, navigate] = useLocation();

  useEffect(() => {
    document.title = "Gizlilik Politikası | YourPoodle";
    const setMeta = (attr: string, key: string, val: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
      el.content = val;
    };
    setMeta("name", "description", "YourPoodle gizlilik politikası ve KVKK aydınlatma metni. Verilerinizi nasıl işlediğimizi öğrenin.");
    setMeta("name", "robots", "index, follow");
  }, []);

  return (
    <YPLayout activeLink="" constrain={false}>
      <style>{CSS}</style>
      <main>
        <div className="giz-wrap">
          <button onClick={() => navigate(-1 as any)}
            style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", cursor:"pointer", color:"#888", fontSize:13, fontWeight:600, fontFamily:"Inter,sans-serif", marginBottom:28, padding:0 }}>
            <ChevronLeft size={16} /> Geri Dön
          </button>

          <h1 style={{ fontSize:28, fontWeight:900, color:"#1a1a1a", marginBottom:8, letterSpacing:"-0.3px" }}>Gizlilik Politikası</h1>
          <p style={{ fontSize:13, color:"#aaa", marginBottom:8 }}>Son güncelleme: 16 Temmuz 2026</p>
          <p style={{ fontSize:13, color:"#888", marginBottom:32, lineHeight:1.6 }}>
            Bu metin, 6698 sayılı <strong>Kişisel Verilerin Korunması Kanunu (KVKK)</strong> kapsamında hazırlanmış aydınlatma metnidir.
          </p>

          <div className="giz-section">
            <h2>1. Veri Sorumlusu</h2>
            <p>
              Kişisel verileriniz, veri sorumlusu sıfatıyla <strong>Sizpa Yazılım ve Teknoloji A.Ş.</strong> ("Şirket") tarafından işlenmektedir.
            </p>
            <ul>
              <li><strong>Platform:</strong> YourPoodle</li>
              <li><strong>E-posta:</strong> <a href="mailto:info@yourpoodle.com" style={{ color:"#7C3AFF" }}>info@yourpoodle.com</a></li>
            </ul>
          </div>

          <div className="giz-section">
            <h2>2. Toplanan Kişisel Veriler</h2>
            <table className="giz-table">
              <thead>
                <tr>
                  <th>Veri Kategorisi</th>
                  <th>Örnekler</th>
                  <th>Toplama Yöntemi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Kimlik Bilgisi</td>
                  <td>Ad, soyad</td>
                  <td>Kullanıcı tarafından girilir</td>
                </tr>
                <tr>
                  <td>İletişim Bilgisi</td>
                  <td>Cep telefonu numarası</td>
                  <td>Üyelik/OTP doğrulaması</td>
                </tr>
                <tr>
                  <td>İşlem Güvenliği</td>
                  <td>Giriş zamanı, IP adresi, cihaz türü</td>
                  <td>Otomatik (sunucu kayıtları)</td>
                </tr>
                <tr>
                  <td>Kullanım Verisi</td>
                  <td>Görüntülenen sayfalar, tıklanan içerikler</td>
                  <td>Otomatik (çerezler/analitik)</td>
                </tr>
                <tr>
                  <td>İçerik Verisi</td>
                  <td>Paylaşılan gönderiler, poodle profil bilgileri</td>
                  <td>Kullanıcı tarafından girilir</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="giz-section">
            <h2>3. Kişisel Verilerin İşlenme Amaçları</h2>
            <ul>
              <li>Üyelik ve kimlik doğrulama işlemlerinin yürütülmesi</li>
              <li>Platform hizmetlerinin sunulması ve geliştirilmesi</li>
              <li>Siparişlerin işlenmesi ve teslimatın sağlanması (alışveriş yapılması durumunda)</li>
              <li>Müşteri hizmetleri ve destek taleplerinin karşılanması</li>
              <li>Yasal yükümlülüklerin yerine getirilmesi</li>
              <li>Platform güvenliğinin ve dolandırıcılık önlemlerinin sağlanması</li>
              <li>Kullanıcının açık rızası kapsamında pazarlama iletişimi (opsiyonel)</li>
            </ul>
          </div>

          <div className="giz-section">
            <h2>4. Hukuki Dayanak</h2>
            <p>Kişisel verileriniz aşağıdaki KVKK madde 5 kapsamındaki hukuki dayanaklar çerçevesinde işlenmektedir:</p>
            <ul>
              <li><strong>Sözleşmenin kurulması ve ifası:</strong> Üyelik ve sipariş işlemleri</li>
              <li><strong>Hukuki yükümlülük:</strong> Yasal kayıt tutma ve raporlama gereksinimleri</li>
              <li><strong>Meşru menfaat:</strong> Platform güvenliği, dolandırıcılık önleme</li>
              <li><strong>Açık rıza:</strong> Pazarlama iletişimi (tercihler sayfasından geri alınabilir)</li>
            </ul>
          </div>

          <div className="giz-section">
            <h2>5. Veri Saklama Süreleri</h2>
            <ul>
              <li><strong>Hesap verileri:</strong> Hesap aktif olduğu sürece + silme talebinden itibaren 30 gün</li>
              <li><strong>Sipariş kayıtları:</strong> Son işlemden itibaren 10 yıl (Türk Ticaret Kanunu gereği)</li>
              <li><strong>Sunucu log kayıtları:</strong> 90 gün</li>
              <li><strong>OTP kodları:</strong> Doğrulama tamamlandıktan sonra derhal silinir</li>
              <li><strong>Pazarlama verileri:</strong> Rıza geri alınıncaya kadar</li>
            </ul>
          </div>

          <div className="giz-section">
            <h2>6. Kişisel Verilerin Aktarımı</h2>
            <p>Kişisel verileriniz aşağıdaki taraflarla paylaşılabilir:</p>
            <ul>
              <li><strong>SMS hizmet sağlayıcıları</strong> (OTP gönderimi — yalnızca telefon numarası)</li>
              <li><strong>Ödeme altyapı sağlayıcıları</strong> (alışveriş yapılması durumunda)</li>
              <li><strong>Kargo şirketleri</strong> (sipariş teslimatı — yalnızca sipariş adresi)</li>
              <li><strong>Yetkili kamu kurum ve kuruluşları</strong> (yasal zorunluluk halinde)</li>
            </ul>
            <p style={{ marginTop:10 }}>Verileriniz rızanız olmadan üçüncü taraf reklam şirketlerine satılmaz veya devredilmez.</p>
          </div>

          <div className="giz-section">
            <h2>7. Çerezler (Cookies)</h2>
            <ul>
              <li><strong>Zorunlu çerezler:</strong> Oturum yönetimi için gereklidir, devre dışı bırakılamaz.</li>
              <li><strong>Analitik çerezler:</strong> Platform performansını ölçmek için kullanılır (onayınızla).</li>
              <li><strong>Pazarlama çerezleri:</strong> Kişiselleştirilmiş içerik için kullanılır (onayınızla).</li>
            </ul>
            <p style={{ marginTop:10 }}>Çerez tercihlerinizi her zaman platform üzerinden yönetebilirsiniz.</p>
          </div>

          <div className="giz-section">
            <h2>8. KVKK Kapsamındaki Haklarınız</h2>
            <p>KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
            <ul>
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>İşlenmişse buna ilişkin bilgi talep etme</li>
              <li>İşlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
              <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
              <li>Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme</li>
              <li>Silinmesini veya yok edilmesini isteme</li>
              <li>İşlemeye itiraz etme</li>
              <li>Otomatik işleme sonucu ortaya çıkan aleyhte kararları itiraz etme</li>
              <li>Zararın giderilmesini talep etme</li>
            </ul>
            <p style={{ marginTop:10 }}>Bu haklarınızı kullanmak için <a href="mailto:info@yourpoodle.com" style={{ color:"#7C3AFF", fontWeight:700 }}>info@yourpoodle.com</a> adresine e-posta gönderebilirsiniz. Talepler 30 gün içinde yanıtlanır.</p>
          </div>

          <div className="giz-section" style={{ background:"#F5F0FF", borderRadius:16, padding:"20px", border:"none" }}>
            <h2 style={{ border:"none", paddingTop:0 }}>İletişim</h2>
            <p>Gizlilik politikamız hakkında sorularınız için:</p>
            <ul style={{ marginTop:8 }}>
              <li><strong>E-posta:</strong> <a href="mailto:info@yourpoodle.com" style={{ color:"#7C3AFF" }}>info@yourpoodle.com</a></li>
              <li><strong>Veri Sorumlusu:</strong> Sizpa Yazılım ve Teknoloji A.Ş.</li>
            </ul>
            <p style={{ marginTop:10, fontSize:13 }}>Kişisel Verileri Koruma Kurulu'na (KVKK) şikâyet hakkınız saklıdır: <a href="https://www.kvkk.gov.tr" target="_blank" rel="noopener noreferrer" style={{ color:"#7C3AFF" }}>www.kvkk.gov.tr</a></p>
          </div>
        </div>
      </main>
    </YPLayout>
  );
}
