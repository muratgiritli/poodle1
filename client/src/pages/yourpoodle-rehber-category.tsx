import { useState } from "react";
import { Link, useParams } from "wouter";
import { ChevronRight, ChevronDown, Search, BookOpen, Sparkles } from "lucide-react";
import YourPoodleShell from "@/components/yourpoodle/YourPoodleShell";
import { GUIDE_CATEGORIES, CATEGORY_COLORS } from "@/lib/yourpoodle-data";

// Extra context per category for richer template pages
const CATEGORY_CONTENT: Record<string, { tips: string[]; articles: { title: string; desc: string; time: string }[] }> = {
  "yavru-toy-poodle": {
    tips: ["İlk haftayı sessiz ve sakin geçirin.", "Köpeğinizi hemen diğer hayvanlarla tanıştırmayın.", "Aşı takvimini eksiksiz uygulayın.", "Yavrunun uyku alanını sabitleyin."],
    articles: [
      { title: "Eve İlk Geliş: Nelere Dikkat Etmeli?", desc: "İlk gün için pratik checklist ve öneriler.", time: "5 dk" },
      { title: "İlk Gece Ağlamayı Durdurmak", desc: "Köpeğinizi rahatlatacak kanıtlanmış yöntemler.", time: "4 dk" },
      { title: "Tuvalet Eğitimine Ne Zaman Başlanır?", desc: "8 haftadan itibaren adım adım eğitim planı.", time: "7 dk" },
      { title: "İlk Veteriner Ziyareti Rehberi", desc: "Götürmeniz gereken belgeler ve sormanız gereken sorular.", time: "3 dk" },
    ],
  },
  "beslenme": {
    tips: ["Günde 2–3 öğünde besleyin.", "Mama değişikliklerini 7–10 günde kademeli yapın.", "Temiz su her zaman erişilebilir olsun.", "İnsan yiyeceklerinden kaçının."],
    articles: [
      { title: "Toy Poodle İçin En İyi Mama Markaları", desc: "2024 güncel karşılaştırma ve öneriler.", time: "8 dk" },
      { title: "Günlük Mama Miktarı Nasıl Hesaplanır?", desc: "Kilo ve yaşa göre pratik hesaplama tablosu.", time: "4 dk" },
      { title: "Yasak Yiyecekler: Toy Poodle İçin Tehlikeli Gıdalar", desc: "Kesinlikle verilmemesi gereken yiyeceklerin tam listesi.", time: "5 dk" },
      { title: "Vitamin ve Takviye Rehberi", desc: "Hangi takviyeler gerçekten gerekli?", time: "6 dk" },
    ],
  },
  "bakim": {
    tips: ["Haftada en az 3 kez tarayın.", "Kulak kontrolünü ayda bir yapın.", "Diş fırçalamayı yavruken alıştırın.", "Tırnakları 3–4 haftada bir kesin."],
    articles: [
      { title: "Toy Poodle Tıraş Modelleri ve Sıklığı", desc: "Puppy cut'tan teddy bear'a tüm modeller.", time: "6 dk" },
      { title: "Gözyaşı Lekesini Temizleme Yöntemleri", desc: "Evde uygulayabileceğiniz güvenli temizlik rutini.", time: "5 dk" },
      { title: "Kulak Temizliği Adım Adım", desc: "Ürün seçimi ve uygulama tekniği.", time: "4 dk" },
      { title: "Doğru Şampuan Nasıl Seçilir?", desc: "Toy Poodle tüy yapısına uygun ürün kriterleri.", time: "3 dk" },
    ],
  },
  "saglik": {
    tips: ["Yıllık veteriner kontrollerini aksatmayın.", "Aşı takvimini takip edin.", "Belirtileri erken fark etmeyi öğrenin.", "İç ve dış parazit önlemlerini ihmal etmeyin."],
    articles: [
      { title: "Toy Poodle Aşı Takvimi 2024", desc: "Hangi aşı, ne zaman, kaç doz?", time: "5 dk" },
      { title: "Sık Görülen Toy Poodle Hastalıkları", desc: "Genetik yatkınlıklar ve önlem yolları.", time: "9 dk" },
      { title: "Acil Durumda Ne Yapmalı?", desc: "Veterinere gitmeden önce kritik ilk adımlar.", time: "6 dk" },
      { title: "Diz ve Kalça Problemleri: Belirtiler ve Tedavi", desc: "Toy Poodle'larda sık görülen eklem sorunları.", time: "7 dk" },
    ],
  },
  "egitim": {
    tips: ["Pozitif pekiştirmeyi temel alın.", "Eğitim seanslarını 5–10 dakikada tutun.", "Tutarlı komutlar kullanın.", "Başarıyı hemen ödüllendirin."],
    articles: [
      { title: "7 Günde Tuvalet Eğitimi", desc: "Kanıtlanmış adım adım program.", time: "8 dk" },
      { title: "Otur, Bekle, Gel: Temel Komutlar", desc: "Her komutu öğretmek için video destekli rehber.", time: "10 dk" },
      { title: "Havlamayı Kontrol Etme Teknikleri", desc: "Aşırı havlamayı azaltmanın 5 etkili yöntemi.", time: "6 dk" },
      { title: "Tasma Eğitimi: İlk Adımlar", desc: "Tasma ve gezdirmeden korkmayan köpek yetiştirme.", time: "5 dk" },
    ],
  },
  "davranis": {
    tips: ["Davranış sorunlarının kökenini anlayın.", "Stres tetikleyicilerini belirleyin.", "Rutinleri bozmaktan kaçının.", "Gerektiğinde davranış uzmanına başvurun."],
    articles: [
      { title: "Ayrılık Kaygısı ile Başa Çıkma", desc: "Yalnız kalma korkusunu azaltmanın bilimsel yolları.", time: "7 dk" },
      { title: "Neden Sürekli Havlıyor?", desc: "Havlama türlerini ayırt etme ve çözüm önerileri.", time: "5 dk" },
      { title: "Kıskançlık ve Kaynak Koruma", desc: "Agresif davranışları önleme stratejileri.", time: "6 dk" },
      { title: "Stres Belirtilerini Tanıma", desc: "Köpeğinizin dilini okuyun.", time: "4 dk" },
    ],
  },
  "seyahat": {
    tips: ["Seyahat öncesi veterinerden sağlık raporu alın.", "Küçük araç gezilerini erken yaşta alıştırın.", "Uçakta kabinin kural ve boyut limitlerini kontrol edin.", "Acil veteriner adreslerini kaydedin."],
    articles: [
      { title: "Arabayla Seyahatte Güvenlik", desc: "Koltuk güvenliği, mola süreleri ve taşıma rehberi.", time: "6 dk" },
      { title: "Uçakla Toy Poodle Taşıma Rehberi", desc: "Havayolu kuralları, kabin kabul şartları ve stres azaltma.", time: "8 dk" },
      { title: "Pet Friendly Otel Bulma Tüyoları", desc: "Türkiye'de ve yurt dışında pet kabul eden yerler.", time: "5 dk" },
      { title: "Seyahat Çantasına Neler Koymalı?", desc: "Eksiksiz seyahat kontrol listesi.", time: "3 dk" },
    ],
  },
  "mevsim-bakimi": {
    tips: ["Yazın aşırı sıcakta dışarı çıkarmayın.", "Kışın pati koruyucu krem kullanın.", "İlkbaharda tüy dökülmesi artar; taramayı artırın.", "Yağmurlu günlerde kulak nemini kontrol edin."],
    articles: [
      { title: "Toy Poodle'ı Yaz Sıcağından Koruma", desc: "Sıcak çarpması belirtileri ve acil müdahale.", time: "5 dk" },
      { title: "Kış Bakımı: Tüy ve Pati Koruma", desc: "Soğuk hava koşullarına karşı kapsamlı rehber.", time: "6 dk" },
      { title: "İlkbahar Tüy Dökülmesiyle Başa Çıkma", desc: "Yoğun dönemde tarama rutini ve araç önerileri.", time: "4 dk" },
      { title: "Sıcak Çarpması: Belirtiler ve İlk Yardım", desc: "Dakikalar içinde hayat kurtaran bilgiler.", time: "7 dk" },
    ],
  },
  "yasam": {
    tips: ["Günde en az 2 kez yürüyüşe çıkın.", "Apartmanda mentale uyarım için oyun oynayın.", "Çocuklara köpek dili öğretin.", "Ev kurallarını tutarlı uygulayın."],
    articles: [
      { title: "Apartmanda Toy Poodle Bakımı", desc: "Küçük alanda mutlu bir Poodle için pratik düzenlemeler.", time: "6 dk" },
      { title: "Çocuklu Evde Güvenli Birliktelik", desc: "Çocuk-köpek ilişkisini doğru kurmak.", time: "7 dk" },
      { title: "İkinci Köpek Alırken Dikkat Edilecekler", desc: "İki Poodle'ı tanıştırma süreci.", time: "5 dk" },
      { title: "Kedi ile Aynı Evde Yaşam", desc: "Kedi-köpek uyumunu kolaylaştırma rehberi.", time: "6 dk" },
    ],
  },
  "urun-rehberi": {
    tips: ["Ürünleri yaşa ve kilo grubuna göre seçin.", "Ucuz mama yerine içerik odaklı değerlendirin.", "Boyut ve güvenlik sertifikasına dikkat edin.", "Kullanıcı yorumlarını karşılaştırın."],
    articles: [
      { title: "2024 En İyi Toy Poodle Mamaları Karşılaştırması", desc: "İçerik analizi ve fiyat-değer değerlendirmesi.", time: "9 dk" },
      { title: "Doğru Tasma ve Göğüs Tasması Seçimi", desc: "Boyun sağlığı için göğüs tasmasının önemi.", time: "5 dk" },
      { title: "Yatak ve Uyku Alanı Önerileri", desc: "Toy Poodle için rahat ve güvenli uyku köşesi.", time: "4 dk" },
      { title: "Oyuncak Seçimi ve Güvenlik", desc: "Boğulma riski olmayan güvenli oyuncak kriterleri.", time: "3 dk" },
    ],
  },
  "yasa-gore": {
    tips: ["Her yaş dönemi farklı ihtiyaçlar getirir.", "Yaşlı Poodle'lar için eklem desteği önemlidir.", "Yavru dönemde aşırı egzersizden kaçının.", "Senior dönemde daha sık veteriner kontrolü yapın."],
    articles: [
      { title: "2–3 Aylık Yavru Rehberi", desc: "İlk haftalarda yapılması ve kaçınılması gerekenler.", time: "6 dk" },
      { title: "6 Aylık Köpek: Ergenlik Belirtileri", desc: "Hormonal değişimler ve davranış dönüşümleri.", time: "5 dk" },
      { title: "7+ Yaş Senior Toy Poodle Bakımı", desc: "Yaşlanan köpeğinize özel beslenme ve sağlık önerileri.", time: "7 dk" },
      { title: "Yaşa Göre Egzersiz Miktarı", desc: "Her dönem için güvenli aktivite süreleri.", time: "4 dk" },
    ],
  },
  "sik-sorulan-sorular": {
    tips: ["Merak ettiğiniz her şeyi sormaktan çekinmeyin.", "Çelişkili bilgilerle karşılaştığınızda veterinerinize danışın."],
    articles: [
      { title: "Toy Poodle Kaç Yıl Yaşar?", desc: "Ortalama ömür ve uzun yaşamı etkileyen faktörler.", time: "3 dk" },
      { title: "Tuvalet Eğitimi Kaç Günde Olur?", desc: "Gerçekçi beklentiler ve hızlandırma yöntemleri.", time: "4 dk" },
      { title: "Hangi Mama Daha İyi? Kuru mu Yaş mı?", desc: "Her iki seçeneğin avantaj ve dezavantajları.", time: "5 dk" },
      { title: "Günde Kaç Kez Yürüyüşe Çıkmalı?", desc: "Yaşa ve kondüsyona göre ideal egzersiz miktarı.", time: "3 dk" },
    ],
  },
  "hesaplama-araclari": {
    tips: ["Hesaplama araçları yalnızca rehber niteliğindedir.", "Sonuçları veterinerinizle paylaşın."],
    articles: [
      { title: "Günlük Mama Miktarı Hesaplama", desc: "Kilo ve aktivite seviyesine göre doğru porsiyon.", time: "3 dk" },
      { title: "Su Tüketimi Hesaplama", desc: "Günde ne kadar su içmeli?", time: "2 dk" },
      { title: "Köpek Yaşı İnsan Yaşına Dönüştürme", desc: "Köpek yaşı çarpanları ve formülleri.", time: "3 dk" },
      { title: "Aşı Takvimi Oluşturma", desc: "Doğum tarihine göre aşı programı.", time: "4 dk" },
    ],
  },
  "ai-rehber": {
    tips: ["AI önerileri profesyonel veteriner görüşünün yerini tutmaz.", "Acil durumlarda her zaman veterinerinizi arayın."],
    articles: [
      { title: "AI Mama Danışmanı Nasıl Çalışır?", desc: "Kişiselleştirilmiş mama önerisi alma rehberi.", time: "3 dk" },
      { title: "AI ile Belirtileri Ön Değerlendirme", desc: "Hangi belirtilerde veterinere gitmelisiniz?", time: "5 dk" },
      { title: "AI Eğitim Koçu: Kişisel Plan Oluşturma", desc: "Poodle'ınıza özel eğitim programı.", time: "4 dk" },
      { title: "AI Ürün Önerisi: Nasıl Kullanılır?", desc: "İhtiyacınıza en uygun ürünü bulma.", time: "3 dk" },
    ],
  },
};

export default function YourPoodleRehberCategoryPage() {
  const params = useParams<{ category: string }>();
  const slug = params.category || "";
  const [search, setSearch] = useState("");

  const cat = GUIDE_CATEGORIES.find((c) => c.id === slug);

  if (!cat) {
    return (
      <YourPoodleShell activeTab="guide">
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-5 text-center">
          <div className="text-5xl mb-4">😕</div>
          <h1 className="text-[20px] font-black text-gray-900 mb-2">Sayfa Bulunamadı</h1>
          <p className="text-gray-500 font-semibold mb-5">Bu kategori mevcut değil.</p>
          <Link href="/yourpoodle/rehber">
            <button className="bg-purple-600 text-white font-black px-6 py-3 rounded-xl">Rehbere Dön</button>
          </Link>
        </div>
      </YourPoodleShell>
    );
  }

  const c = CATEGORY_COLORS[cat.color];
  const extra = CATEGORY_CONTENT[cat.id] || { tips: [], articles: [] };
  const filtered = cat.subcategories.filter((s) =>
    search === "" || s.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <YourPoodleShell activeTab="guide">
      {/* HERO */}
      <section className={`bg-gradient-to-br from-[#6D28D9] via-[#7C3AED] to-[#A855F7] px-5 pt-5 pb-7 rounded-b-[2rem] shadow-md`}>
        <div className="flex justify-between items-center">
          <div className="flex-1 pr-3">
            <div className={`bg-white/20 text-white text-[11px] font-bold px-3 py-1.5 rounded-full inline-flex items-center mb-3`}>
              {cat.icon} {cat.subcategories.length} rehber
            </div>
            <h1 className="text-[24px] font-black text-white leading-tight mb-1.5">{cat.title}</h1>
            <p className="text-white/85 text-[13px] leading-relaxed font-semibold">{cat.description}</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm p-4 rounded-2xl text-4xl flex-shrink-0">
            {cat.icon}
          </div>
        </div>
      </section>

      {/* BREADCRUMB */}
      <nav className="flex items-center gap-1.5 px-5 pt-4 pb-0 text-[12px] text-gray-400 font-semibold">
        <Link href="/yourpoodle"><span className="text-purple-600 cursor-pointer hover:underline">Ana Sayfa</span></Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/yourpoodle/rehber"><span className="text-purple-600 cursor-pointer hover:underline">Rehber</span></Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-700 font-bold">{cat.title}</span>
      </nav>

      {/* ÖNERILEN İPUÇLARI */}
      {extra.tips.length > 0 && (
        <section className="px-5 mt-5">
          <div className={`${c.bg} border ${c.border.replace("border-", "border-")} rounded-2xl p-4`}>
            <div className={`flex items-center gap-2 mb-3 ${c.text}`}>
              <BookOpen className="h-4 w-4" />
              <span className="font-black text-[14px]">Bu Kategoride Bilmeniz Gerekenler</span>
            </div>
            <ul className="space-y-2">
              {extra.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[12.5px] text-gray-700 font-semibold">
                  <div className={`w-1.5 h-1.5 ${c.dot} rounded-full mt-1.5 flex-shrink-0`} />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ARAMA */}
      <section className="px-5 mt-5">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`${cat.title} konularında ara...`}
            className="block w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 text-[13.5px] font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
          />
        </div>
      </section>

      {/* ALT KATEGORİLER */}
      <section className="px-5 mt-4">
        <h2 className="text-[16px] font-black text-gray-900 mb-3.5">
          Tüm Konular
          <span className="ml-2 text-[12px] font-bold text-gray-400">({filtered.length})</span>
        </h2>
        <div className="grid grid-cols-1 gap-2">
          {filtered.map((sub, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3.5 flex items-center justify-between cursor-pointer hover:border-purple-200 hover:shadow-md transition-all group">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 ${c.dot} rounded-full flex-shrink-0`} />
                <span className="text-[13.5px] font-bold text-gray-800 group-hover:text-purple-700 transition-colors">{sub}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-purple-400 transition-colors flex-shrink-0" />
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <div className="text-3xl mb-2">🔍</div>
              <p className="font-bold">Konu bulunamadı</p>
              <button onClick={() => setSearch("")} className="mt-2 text-purple-600 font-bold text-[13px]">Aramayı Temizle</button>
            </div>
          )}
        </div>
      </section>

      {/* ÖNE ÇIKAN MAKALELER */}
      {extra.articles.length > 0 && (
        <section className="px-5 mt-6">
          <h2 className="text-[16px] font-black text-gray-900 mb-3.5">📖 Öne Çıkan Rehberler</h2>
          <div className="flex flex-col gap-3">
            {extra.articles.map((article, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-black text-[14px] text-gray-900 leading-tight mb-1 group-hover:text-purple-700 transition-colors">{article.title}</h3>
                    <p className="text-[12px] text-gray-500 font-semibold leading-snug">{article.desc}</p>
                  </div>
                  <div className={`flex-shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full ${c.badge} whitespace-nowrap`}>
                    ⏱ {article.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* AI CTA */}
      <section className="px-5 mt-6 mb-4">
        <div className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="flex-1">
            <p className="text-white font-black text-[14px] mb-1.5">Daha fazla sorunuz mu var?</p>
            <p className="text-white/80 text-[12px] font-semibold mb-3">AI Poodle Asistanı size özel cevaplar versin.</p>
            <Link href="/yourpoodle/ai-poodle-asistani">
              <button className="bg-white text-purple-700 font-black text-[12.5px] px-4 py-2.5 rounded-xl flex items-center gap-1.5 hover:opacity-90 transition-opacity">
                <Sparkles className="h-3.5 w-3.5" /> AI Asistana Sor
              </button>
            </Link>
          </div>
          <div className="text-4xl">🤖</div>
        </div>
      </section>
    </YourPoodleShell>
  );
}
