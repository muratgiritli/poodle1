import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { Search, X, ChevronRight, ArrowLeft, Heart, Share2, Clock, ChevronLeft } from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";

/* ─── SEO ─────────────────────────────────────────────── */
const PAGE_TITLE = "Poodle Rehberi — Bakım, Beslenme, Eğitim ve Sağlık | YourPoodle";
const PAGE_DESC  = "Toy Poodle rehberi: beslenme, sağlık, bakım, eğitim ve davranış konularında veteriner onaylı makaleler. Poodle sahipleri için Türkiye'nin en kapsamlı kaynağı.";

const CATS = ["Tümü","Beslenme","Sağlık","Bakım","Eğitim","Davranış","Üreme"];

const CAT_COLORS: Record<string,{bg:string;color:string}> = {
  Beslenme: { bg:"#FFF7ED", color:"#EA580C" },
  Sağlık:   { bg:"#FFF1F2", color:"#E11D48" },
  Bakım:    { bg:"#F0F9FF", color:"#0369A1" },
  Eğitim:   { bg:"#F0FDF4", color:"#16A34A" },
  Davranış: { bg:"#FDF4FF", color:"#9333EA" },
  Üreme:    { bg:"#FFF9EB", color:"#D97706" },
};

interface Section { heading?: string; subheading?: string; content: string; list?: string[]; tip?: string; }
interface Article {
  slug: string; emoji: string; cat: string; title: string; min: number;
  views: string; featured: boolean; author: string; role: string;
  date: string; updated: string;
  intro: string;
  sections: Section[];
  related: string[]; // slugs
}

const ARTICLES: Article[] = [
  /* ─── 1 ─── */
  {
    slug:"toy-poodle-en-iyi-mama-markalari-2026", emoji:"🍖", cat:"Beslenme", featured:true, min:8,
    views:"2.4K", author:"Dr. Ayşe Kaya", role:"Veteriner Hekimi",
    date:"2026-01-15", updated:"2026-06-10",
    title:"Toy Poodle İçin En İyi Mama Markaları 2026",
    intro:"Toy Poodle'ınıza en uygun mamayı seçmek hem sağlık hem de yaşam kalitesi açısından kritik öneme sahiptir. Bu rehberde 2026 yılında piyasadaki en iyi seçenekleri, bağımsız laboratuvar analizleri ve veteriner görüşleri ışığında değerlendirdik.",
    sections: [
      {
        heading:"Toy Poodle'ların Beslenme İhtiyaçları",
        content:"Toy Poodle'lar ortalama 2–4 kg ağırlığında, yüksek metabolizma hızına sahip köpeklerdir. Bu durum, birim ağırlık başına daha fazla kalori ve protein gerektirdikleri anlamına gelir. Bir yetişkin Toy Poodle'ın günlük kalori ihtiyacı yaklaşık 200–280 kcal arasındadır.",
        list:["Protein: minimum %25 (hayvansal kaynak öncelikli)","Yağ: %12–18 arası","Karbonhidrat: düşük glisemik indeksli","Omega-3: göz ve deri sağlığı için kritik","Kalsiyum/Fosfor oranı: 1,2:1 ideal"]
      },
      {
        heading:"Royal Canin Poodle Adult",
        content:"Toy Poodle ırkına özel formül geliştirme konusunda öncü olan Royal Canin, poodle'ların küçük, kare çeneli ağız yapısına uygun özel kibble şekliyle öne çıkıyor. Çiğnemeyi kolaylaştıran bu tasarım, diş sağlığına da katkı sağlıyor.",
        list:["Kibble boyutu: Poodle çenesi için optimize edilmiş","Enerji yoğunluğu: 362 kcal/100g (yüksek aktivite için uygun)","Taurin içeriği: kalp sağlığını destekler","Biotin: uzun poodle tüyleri için özel formül"],
        tip:"6–10 yaş arası Poodle'lar için Mature versiyonu tercih edin; eklem desteği için glukozamin içermektedir."
      },
      {
        heading:"Hill's Science Plan Small & Miniature",
        content:"Hill's, veteriner tavsiye oranı en yüksek mama markalarından biridir. Small & Miniature serisi, küçük ırk köpeklerin hızlı metabolizmasına göre kalibre edilmiş enerji değerleriyle dikkat çekiyor.",
        list:["Tavuk ve pirinç bazlı, kolay sindirilebilir","Vitamin E ve C: bağışıklık sistemi desteği","Prebiyotik fiber: sağlıklı bağırsak florası","Küçük kibble boyutu: 28–32 kg altı köpekler için ideal"]
      },
      {
        heading:"Pro Plan Small & Mini Adult",
        content:"Purina'nın Pro Plan serisi, yüksek protein içeriği ve bilimsel formülüyle veteriner çevrelerinde sık önerilmektedir. Salmon versiyonu, cilt ve tüy sağlığı sorunlarına yatkın Poodle'lar için özellikle uygun.",
        list:["Ham protein: %30 (sektör ortalamasının üzerinde)","Somonlu versiyon: omega-3 ve omega-6 dengeli","Prebiyotik: sindirim sağlığı","DHA içeriği: beyin ve göz gelişimini destekler"]
      },
      {
        heading:"Tahılsız Seçenekler: Orijen & Acana",
        content:"Belirli tahıl alerjileri veya hassasiyetleri olan Poodle'lar için tahılsız (grain-free) seçenekler uygun olabilir. Ancak bu tür mamaları kullanmadan önce veterinerinize danışmanızı öneririz; bazı çalışmalar tahılsız diyetleri dilate kardiyomiyopati (DCM) ile ilişkilendirmiştir.",
        list:["Orijen Small Breed: %85 hayvansal içerik, yüksek protein","Acana Small Breed: bölgesel kaynaklı içerikler","Her iki markada da patates/baklagil bazlı karbonhidrat"]
      },
      {
        heading:"Mama Seçerken Dikkat Edilmesi Gerekenler",
        content:"Piyasada yüzlerce marka bulunmakta; doğru seçimi yapmak için aşağıdaki kriterleri göz önünde bulundurun:",
        list:["İlk 3 ingredientin hayvansal protein olmasına dikkat edin","Yapay renklendirici ve koruyucu içermeyen markaları tercih edin","AAFCO veya FEDIAF standartlarına uygunluk belgesini kontrol edin","Mama değiştirirken 7–10 gün geçiş süreci uygulayın","Yavru, yetişkin ve senior formüller arasındaki farkları göz önünde bulundurun"],
        tip:"Köpeğinizin dışkı kıvamı, tüy parlaklığı ve enerji seviyesi doğru mama seçiminin en iyi göstergesidir. Mama değişikliğinden 4 hafta sonra bu kriterleri değerlendirin."
      },
      {
        heading:"Günlük Porsiyon Hesabı",
        content:"Toy Poodle'lar için genel porsiyon rehberi (günlük, 2 öğüne bölünmüş):",
        list:["2 kg: 60–75 g/gün","3 kg: 80–100 g/gün","4 kg: 100–120 g/gün","Hamile veya emziren dişi: %25–50 fazla","Yaşlı (8+ yaş): %15 azaltma önerilir"]
      }
    ],
    related:["yavru-poodle-beslenmesi-ilk-12-ay","poodle-saglik-sorunlari","poodle-tuy-bakimi-haftalik-rutin"]
  },

  /* ─── 2 ─── */
  {
    slug:"evde-poodle-tirasi-adim-adim-rehber", emoji:"✂️", cat:"Bakım", featured:true, min:10,
    views:"1.8K", author:"Selin Demir", role:"Grooming Uzmanı",
    date:"2026-02-20", updated:"2026-05-15",
    title:"Evde Poodle Tıraşı: Adım Adım Eksiksiz Rehber",
    intro:"Poodle tıraşı, hem bakım hem de köpeğinizin konforu açısından düzenli yapılması gereken bir rutindir. Profesyonel groomerlere sürekli gidip gelmek yerine temel teknikleri öğrenerek evde yapabilirsiniz. Bu rehber, başlangıç seviyesinden orta seviyeye kadar kapsamlı bir kılavuz sunmaktadır.",
    sections:[
      {
        heading:"Gerekli Ekipmanlar",
        content:"Evde kaliteli bir tıraş için aşağıdaki ekipmanlara ihtiyacınız olacak:",
        list:["Slicker fırça (mat açmak için)","Pim fırça (tüy ayrıştırma)","Profesyonel makas seti (düz + thinning makas)","Tıraş makinesi (blade 10 veya 30)","Ayak makası (küçük, kıvrımlı uçlu)","Matlaştırıcı sprey","Banyo öncesi de-shedding şampuanı","Saç kurutma makinesi (düşük ısı)"]
      },
      {
        heading:"Adım 1: Banyo ve Kurutma",
        content:"Tıraştan önce her zaman banyo yapılmalıdır. Kuru tüy üzerinde makas kaymaz ve eşit kesim yapılamaz. Banyodan önce bütün matları açın — ıslak mat iyice sıkılaşır ve açmak çok zorlaşır.",
        list:["Ilık suyla ıslatın (38–40°C)","Poodle şampuanı ile 2 kez yıkayın","Saç kremi veya conditioner uygulayın (10 dk bekletin)","Bol su ile durulayın","Havluyla fazla suyu alın — ovuşturmayın","Saç kurutma makinesiyle tamamen kurutun (orta ısı, mesafeli)"],
        tip:"Kurutma sırasında ters fırçalama yapın — bu Poodle tüylerini kabarık ve hacimli tutar, kesimi kolaylaştırır."
      },
      {
        heading:"Adım 2: Tarama ve Mat Açma",
        content:"Kurutma sonrasında tüyleri katman katman tarayın. Slicker fırçayı deri yüzeyine paralel tutarak çekin; deri yüzeyine dik bastırmak tahrişe yol açar. Matları bulmak için parmaklarınızla tüylerin içinde gezin.",
        list:["Kulak arkası, kasıklar ve kollar çok mat yapar","Mat açıcı sprey kullanın","Mat çok büyükse kesin — acı vermeden bekletin","Kulak içi tüylerini de bu aşamada çekin"]
      },
      {
        heading:"Adım 3: Teddy Bear Kesimi",
        content:"Teddy bear, günümüzde en yaygın tercih edilen Poodle tıraşıdır. Yuvarlak, oyuncak ayı görünümü verir ve bakımı görece kolaydır.",
        list:["Gövde: tıraş makinesiyle (blade 5–7 arası) tabanı eşitleyin","Bacaklar: silindirik bırakın, toparlayın","Yüz: yuvarlak şekil için makas kullanın","Kulaklar: tüyleri bırakın, uçlarını düzeltin","Kuyruk: toparlayın (pompom veya düz)","Patiler: parmak aralarını ayak makasıyla temizleyin"]
      },
      {
        heading:"Adım 4: Son Dokunuşlar",
        content:"Tüm kesimden sonra köpeğinizi dik bir pozisyonda tutun ve genel uyumu kontrol edin. Asimetrik noktalara dikkat edin.",
        list:["Gözler önündeki tüyleri temizleyin (görmesini engellemesin)","Anüs çevresini temizleyin","Ayak tabanlarını temizleyin (kayma önler)","Ayna ile arka ve yan kontrol yapın"]
      },
      {
        heading:"Bakım Takvimi",
        content:"Düzenli bakım, hem köpeğinizin konforunu hem de tıraş kolaylığını artırır:",
        list:["Günlük: kısa tarama (slicker fırça, 3–5 dk)","Haftada 3: tam tarama, kulak kontrolü","2 haftada 1: banyo","4–6 haftada 1: profesyonel veya ev tıraşı","3 ayda 1: kulak iç tüy aldırma (veteriner/groomer)"]
      }
    ],
    related:["poodle-tuy-bakimi-haftalik-rutin","poodle-goz-yasi-lekesi-temizleme","toy-poodle-en-iyi-mama-markalari-2026"]
  },

  /* ─── 3 ─── */
  {
    slug:"poodle-saglik-sorunlari", emoji:"💊", cat:"Sağlık", featured:false, min:9,
    views:"3.1K", author:"Dr. Murat Yılmaz", role:"Dahiliye Uzmanı",
    date:"2025-11-05", updated:"2026-04-20",
    title:"Poodle'larda Görülen 10 Yaygın Sağlık Sorunu",
    intro:"Poodle'lar genel olarak sağlıklı ve uzun ömürlü köpeklerdir; Toy Poodle'lar 14–18 yıl yaşayabilir. Ancak bazı genetik yatkınlıklar nedeniyle belirli sağlık sorunlarına daha sık rastlanır. Erkenden tespit etmek tedavi başarısını büyük ölçüde artırır.",
    sections:[
      {
        heading:"1. Patellar Luksasyon (Çıkık Diz Kapağı)",
        content:"Toy ve Minyatür Poodle'larda en yaygın görülen ortopedik sorundur. Diz kapağının yerinden çıkması sonucu oluşur.",
        list:["Belirtiler: bacağı hafifçe kaldırma, topallama, ''hop hop'' yürüme","Tedavi: Grade 1–2 konservatif (ağırlık kontrolü, kısıtlama), Grade 3–4 cerrahi","Önlem: OFA sertifikalı ebeveynlerden yavru tercih edin"]
      },
      {
        heading:"2. İlerleyici Retinal Atrofi (PRA)",
        content:"Genetik bir göz hastalığıdır; retina hücreleri zamanla bozulur ve körlükle sonuçlanabilir. Erken belirtiler genellikle gece körlüğüdür.",
        list:["DNA testi mevcut — etkilenen ebeveynlerden doğan yavruları almayın","Tedavisi yok, ancak anti-oksidan takviye yavaşlatabilir","Yıllık göz muayenesi önerilir"]
      },
      {
        heading:"3. Addison Hastalığı (Hipoadrenokortisizm)",
        content:"Böbrek üstü bezlerinin yeterli steroid hormonu üretememesidir. Poodle'larda genetik yatkınlık mevcuttur.",
        list:["Belirtiler: letarji, iştahsızlık, kusma, zayıflama","Teşhis: ACTH stimülasyon testi","Tedavi: ömür boyu hormon replasman tedavisi (iyi yönetimle normal yaşam"]
      },
      {
        heading:"4. Tiroid Sorunları (Hipotiroidizm)",
        content:"Özellikle orta yaşlı Poodle'larda görülür. Tiroid bezi yeterli hormon üretemez.",
        list:["Belirtiler: kilo artışı, tüy dökülmesi, letarji, soğuğa hassasiyet","Teşhis: T4 ve TSH kan testi","Tedavi: günlük oral levotiroksin (ucuz ve etkili)"]
      },
      {
        heading:"5. Göz Yaşı Lekeleri",
        content:"Kozmetik bir sorun olmakla birlikte altta yatan sağlık sorununa işaret edebilir. Gözyaşı kanalı tıkanıklığı veya kıl kaynaklı irritasyon en sık nedenlerdir.",
        list:["Günlük göz altı temizliği (yaş mendil)","Beslenme değişikliği (mısır ve soya içermeyen mama)","Veteriner kontrolünde antifungal/antibiyotik tedavi","Cerrahi kanal açma (kronik vakalarda)"]
      },
      {
        heading:"6. Epilepsi",
        content:"Poodle'lar idiyopatik epilepsiye yatkın ırklardandır. Nöbet 3–7 yaş arasında başlayabilir.",
        list:["Tüm nöbetleri kaydedin (süre, tür, sıklık)","Beyin MR + BOS sıvısı analizi","Tedavi: fenobarbital veya potasyum bromür","Nöbet >5 dk sürerse acile gidin"]
      },
      {
        heading:"7–10. Diğer Önemli Sorunlar",
        content:"",
        list:["İntervertebral Disk Hastalığı (IVDD): bel ağrısı, felç belirtileri","Çökme Trakea: öksürük, nefes güçlüğü (özellikle Toy'larda)","Diş Hastalıkları: küçük ırklarda çok sık, 2 yaşından itibaren diş taşı","Şişirme (Gastrik Dilatasyon): büyük öğünden sonra egzersizden kaçının"],
        tip:"Yılda iki kez tam kan sayımı ve biyokimya paneli yaptırın. Erken tespit, tedavi maliyetini ve köpeğinizin acısını büyük ölçüde azaltır."
      }
    ],
    related:["poodle-goz-yasi-lekesi-temizleme","poodle-kalca-displazisi-erken-teshis","temel-komut-egitimi"]
  },

  /* ─── 4 ─── */
  {
    slug:"temel-komut-egitimi", emoji:"🐾", cat:"Eğitim", featured:false, min:10,
    views:"980", author:"Cem Arslan", role:"Köpek Eğitmeni",
    date:"2025-10-12", updated:"2026-03-01",
    title:"Poodle'ınıza Temel Komutları Nasıl Öğretirsiniz?",
    intro:"Poodle'lar, köpek türleri arasında zeka sıralamasında ikinci sıradadır (Stanley Coren'in araştırmasına göre). Bu, eğitimi hem çok etkili hem de son derece zevkli kılıyor. Doğru tekniklerle birkaç hafta içinde temel komutların tamamını öğretebilirsiniz.",
    sections:[
      {
        heading:"Pozitif Pekiştirme: Neden İşe Yarıyor?",
        content:"Modern köpek davranış bilimi, ödül bazlı eğitimi ceza bazlı eğitime karşı açık ara daha etkili bulmuştur. Poodle'lar, negatif pekiştirmeye özellikle duyarlıdır; bu teknik güven kaybına ve strese yol açabilir.",
        list:["Ödül: küçük, yüksek değerli tedavi (biftek, peynir küpü)","Ödülü davranışın hemen arkasından (0.5 sn içinde) verin","Önce davranış, sonra komut — davranışı işaretleyin ardından isimlendirin","Antrenman süresi: günde 2–3 × 5–10 dakika yeterli"]
      },
      {
        heading:"Otur (Sit)",
        content:"Öğretilmesi en kolay komuttur ve diğer komutların temelini oluşturur.",
        list:["Elinizdeki ödülü burnunun üzerine götürün","Burnunu takip ederken doğal olarak otururlar","Oturduğu anda tıklayın (veya ''Evet'' deyin) + ödül verin","20–30 tekrar sonra 'Otur' komutunu ekleyin","Hedef: komut söylenir söylenmez, 3 sn içinde oturma"]
      },
      {
        heading:"Gel (Come / Recall)",
        content:"Güvenlik açısından hayat kurtarıcı bir komuttur. Hiçbir zaman köpeğinizi 'gel' diyerek çağırıp ardından cezalandırmayın — bu komutu mahveder.",
        list:["Uzak bir noktadan eğlenceli bir sesle çağırın","Geldiğinde coşkuyla ödüllendirin (en yüksek değerli ödül)","Önce 1 metre, sonra 3, 5, 10 metre mesafeyle artırın","Dış ortamda önce uzun bir ip ile egzersiz yapın","Komutu asla olumsuz bir şeyle ilişkilendirmeyin"]
      },
      {
        heading:"Dur / Yerde Uzan (Down)",
        content:"Sakinleştirme ve kontrol için kritik.",
        list:["Önce ''Otur'' pozisyonundan başlayın","Ödülü burnundan aşağı, yere doğru indirin","Yere uzandığında işaretleyin + ödül","''İnce'' veya 'Yat' komutunu ekleyin","Poodle'lar bu komutu genellikle 3–5 günde öğrenir"]
      },
      {
        heading:"Bırak (Leave It / Drop It)",
        content:"Tehlikeli nesnelerden uzak tutmak için önemlidir.",
        list:["Sol elde düşük değerli ödül (bisküvi), sağ elde yüksek değerli","Sol eli yumruk yapın — koklasın ama alamasın","Uzaklaştığı anda sağdakini verin","Bu ''bırak''ın değerini öğretir; cezasız ve nazik bir süreç"]
      },
      {
        heading:"İleri Komutlar: Hareket Noktaları",
        content:"Temel komutlar otomatik hale geldikten sonra:",
        list:["Yerinde kal (Stay): Otur/Yat + adım adım mesafe artırma","Yanıma (Heel): gevşek tasma yürüyüşü","Pati ver (Shake): işaretleme + ödül döngüsü","Spin: daire hareketini ödülle şekillendirin"],
        tip:"Poodle'lar rutin sevmez — her antrenman seansında az da olsa yeni bir öğe ekleyin. Sıkılan Poodle dikkatini başka yerlere çevirir."
      }
    ],
    related:["poodle-anksiyetesi","clicker-egitimi","tuvalet-egitimi"]
  },

  /* ─── 5 ─── */
  {
    slug:"poodle-anksiyetesi", emoji:"❤️", cat:"Davranış", featured:false, min:8,
    views:"1.2K", author:"Dr. Zeynep Acar", role:"Veteriner Davranış Uzmanı",
    date:"2025-09-30", updated:"2026-02-14",
    title:"Poodle Anksiyetesi: Belirtiler, Nedenleri ve Çözüm Yolları",
    intro:"Poodle'lar, sosyal ve bağlı bir ırk olduğundan ayrılık anksiyetesi en sık karşılaşılan davranışsal sorunlardandır. Erken tespit ve doğru yaklaşımla bu sorun yönetilebilir ve çoğu durumda tamamen çözülebilir.",
    sections:[
      {
        heading:"Ayrılık Anksiyetesi Belirtileri",
        content:"Köpeğiniz aşağıdaki davranışları yalnız kaldığında sergiliyorsa ayrılık anksiyetesi düşünülebilir:",
        list:["Kapı veya pencere önünde sürekli bekleme","Aşırı havlama ve uluma","Eşya çiğneme (özellikle sahip eşyaları)","Sizi kapıya kadar takip etme, her odaya gelme","Kıyafet veya ayakkabılarınızı çiğneme","İshal veya kusma (anksiyete kaynaklı GIS)"]
      },
      {
        heading:"Hafif Anksiyete: Ev İçi Çözümler",
        content:"Hafif vakalarda profesyonel yardıma gerek kalmadan iyileşme sağlanabilir:",
        list:["Ayrılış ritüeli oluşturun: vedalaşmayın, sessizce gidin","Dönüşte köpeğinizi coşkuyla karşılamayın (2 dk bekleyin)","KONG oyuncağı: donmuş PB veya yoğurtla doldurun","Titreşimli veya nefes sesli yastıklar","Ziyaret saatleri düzensizleştirin — ayrılık öngörülemez hale gelsin","Gündüz egzersizi: yorgun köpek daha sakin bekler"]
      },
      {
        heading:"Desensitizasyon Protokolü",
        content:"Bu protokol 2–8 hafta sürer, sabır ister ama en kalıcı sonucu verir:",
        list:["Adım 1: kapıya yaklaşın, açmayın, geri dönün","Adım 2: kapıyı açın, 3 sn dışarıda durun, geri gelin","Adım 3: tamamen çıkın, 10 sn bekleyin","Adım 4: süreyi yavaşça artırın (5 dk → 15 dk → 1 saat)","Her aşamada köpek rahatsa ilerleyin; değilse geri adım atın"]
      },
      {
        heading:"Tamamlayıcı Yaklaşımlar",
        content:"",
        list:["Adaptil diffuser veya collar (feromonlar, kanıtlanmış etki)","Melatonin takviyesi (veteriner onaylı doz)","Thundershirt / baskı yeleği","Müzik veya beyaz gürültü (Through a Dog's Ear serisi önerilir)"],
        tip:"Köpeğiniz büyük bir sıkıntı içindeyse (hasar veriyor, yaralıyorsa, 2 saatin üzerinde sürekli havlıyorsa) mutlaka bir veteriner davranış uzmanına başvurun. Bu vakalarda ilaç tedavisi ve davranış terapisi birlikte uygulanır."
      },
      {
        heading:"Veteriner Yardımı Ne Zaman Gerekir?",
        content:"Aşağıdaki durumlarda profesyonel desteğe başvurmakta gecikmeyin:",
        list:["Ev içi terapiye 4 haftada yanıt yok","Köpek kendine zarar veriyorsa","Anksiyete giderek kötüleşiyorsa","Birden fazla tetikleyici varsa (sadece ayrılık değil)"]
      }
    ],
    related:["temel-komut-egitimi","clicker-egitimi","poodle-saglik-sorunlari"]
  },

  /* ─── 6 ─── */
  {
    slug:"poodle-kalca-displazisi-erken-teshis", emoji:"🏥", cat:"Sağlık", featured:false, min:7,
    views:"760", author:"Dr. Ali Öztürk", role:"Ortopedi Uzmanı",
    date:"2025-08-22", updated:"2026-01-30",
    title:"Poodle'larda Kalça Displazisi: Belirtiler ve Erken Teşhis",
    intro:"Kalça displazisi büyük ırklarda daha sık görülse de küçük ırklarda da rastlanabilir. Poodle'larda özellikle Standart Poodle'lar risk altındadır. Erken teşhis, doğru yönetimle köpeğinizin yaşam kalitesini korumanızı sağlar.",
    sections:[
      { heading:"Nedir ve Nasıl Oluşur?", content:"Kalça displazisi; kalça ekleminin top ve yuva kısımlarının birbirine tam oturmamasıdır. Bu durum eklemde anormal aşınmaya ve zamanla osteoartrite yol açar.", list:["Genetik faktörler birincil nedendir","Hızlı büyüme ve aşırı beslenme riski artırır","Kaygan zemin ve merdiven erken dönemde zararlıdır"] },
      { heading:"Belirtiler", content:"", list:["Kalçaya konan ağırlığın azalması, topallama","Zıplamaktan, merdivenlerden kaçınma","''Tavşan koşusu'' (iki arka bacağı birlikte kullanma)","Kalçada kas erimesi","Sabahları hareket güçlüğü (sabah tutukluğu)"] },
      { heading:"Teşhis Yöntemleri", content:"", list:["Radyoloji (röntgen): PennHIP veya OFA görüntüleme","Muayene: Ortolani ve Barden testleri","MR (ileri vakalarda)","Erken tarama için 4–6. ayda ilk kontrol önerilir"] },
      { heading:"Tedavi Seçenekleri", content:"", list:["Konservatif: ağırlık yönetimi, fizyo, yüzme, NSAID'lar","Takviye: glukozamin, kondroitin, omega-3 (kanıtlanmış yarar)","Cerrahi: TPO, FHO veya total kalça protezi","Akupunktur: destekleyici rol"], tip:"OFA veya PennHIP sertifikalı ebeveynlerden doğan yavruları tercih ederek bu riski minimuma indirebilirsiniz." }
    ],
    related:["poodle-saglik-sorunlari","yavru-poodle-beslenmesi-ilk-12-ay","toy-poodle-en-iyi-mama-markalari-2026"]
  },

  /* ─── 7 ─── */
  {
    slug:"poodle-tuy-bakimi-haftalik-rutin", emoji:"🛁", cat:"Bakım", featured:false, min:6,
    views:"1.5K", author:"Selin Demir", role:"Grooming Uzmanı",
    date:"2025-12-10", updated:"2026-05-20",
    title:"Poodle Tüy Bakımı: Haftalık Rutin Rehberi",
    intro:"Poodle tüyleri sürekli büyür, dökmez — bu hem alerjisi olanlar için avantaj hem de bakım sorumluluğu getirir. Tutarlı bir haftalık bakım rutini, profesyonel grooming seansları arasındaki periyodu uzatır ve köpeğinizi konforlu tutar.",
    sections:[
      { heading:"Günlük Bakım (3–5 dk)", content:"", list:["Yüz çevresini ıslak mendille silin","Göz altı lekeleri varsa köpek göz mendiliyle temizleyin","Kısaca elle tarayın — mat kontrolü"] },
      { heading:"Haftada 3 Kez (15–20 dk)", content:"", list:["Slicker fırçayla tam tarama (kök→uç)","Kulak içini kontrol edin — kırmızılık, koku, salgı?","Mat bulursa açın","Patileri kontrol edin (toplar arası, tırnak boyutu)"] },
      { heading:"2 Haftada 1 Banyo", content:"", list:["Poodle spesifik şampuan","Conditioner (kıvırcık tüy için şart)","Düşük ısıda tam kurutma","Banyodan önce mat kontrolü"], tip:"Slicker fırça yerine pin fırça kullanırsanız mat açılmaz — saçı yukarı kaldırır, kökleri taramaz." },
      { heading:"Aylık Bakım", content:"", list:["Kulak iç tüy kontrolü (groomer veya veteriner)","Tırnak kesimi (ya da her 3–4 haftada bir)","Diş fırçalama (tercihen haftada 3)"] }
    ],
    related:["evde-poodle-tirasi-adim-adim-rehber","poodle-goz-yasi-lekesi-temizleme","poodle-saglik-sorunlari"]
  },

  /* ─── 8 ─── */
  {
    slug:"yavru-poodle-beslenmesi-ilk-12-ay", emoji:"🥩", cat:"Beslenme", featured:false, min:7,
    views:"890", author:"Dr. Ayşe Kaya", role:"Veteriner Hekimi",
    date:"2025-07-15", updated:"2026-04-01",
    title:"Yavru Poodle Beslenmesi: İlk 12 Ay Rehberi",
    intro:"Yavru Poodle'ların ilk 12 ayı, kemik, kas ve bağışıklık sisteminin şekillendiği kritik bir dönemdir. Bu süreçte yapılan beslenme hataları uzun vadeli sağlık sorunlarına zemin hazırlayabilir.",
    sections:[
      { heading:"0–8 Hafta: Süt Dönemi", content:"", list:["Anne sütü temel gıdadır — değiştirmeye çalışmayın","Sütten kesilme 6–8. haftada tamamlanır","Sütten kesme: anne maması ıslatılarak verilir (lapalaştırma)","Yavru anne olmadan ayrılmamalı (sosyalizasyon ve bağışıklık)"] },
      { heading:"8–16 Hafta: Yeni Eve Uyum", content:"", list:["Günde 3–4 öğün","Breeder'ın verdiği mama 1 hafta devam etsin","Mama değişimi: 7–10 günde kademeli","Yavru maması (Puppy/Junior formül) kullanın","Ölçülü besleyin — serbest beslenme obezite riski taşır"] },
      { heading:"16 Hafta – 6 Ay: Hızlı Büyüme", content:"", list:["Günde 3 öğün","Kalsiyum takviyesi GEREKMİYOR (dengeli mama yeterli)","İçme suyu her zaman hazır olmalı","Aşı takvimini takip edin (3. aşı ve kuduz)"] },
      { heading:"6–12 Ay: Olgunlaşma Dönemi", content:"", list:["Günde 2 öğüne geçin","Kısırlaştırma planlaması (6–9 ay önerilir)","12. ayda yetişkin mamasına geçiş başlayın (10 günde)","İdeal vücut kondisyonu: kaburga hissedilmeli ama görülmemeli"], tip:"Porsiyonları mutlaka tartın — ''göz kararı'' beslemek yavru obezitesinin ana nedenidir. Yavru Toy Poodle günde 80–120 g mama almalıdır (markaya göre değişir, paketteki tabloyu dikkate alın)." }
    ],
    related:["toy-poodle-en-iyi-mama-markalari-2026","poodle-saglik-sorunlari","poodle-kalca-displazisi-erken-teshis"]
  },

  /* ─── 9 ─── */
  {
    slug:"clicker-egitimi", emoji:"🎓", cat:"Eğitim", featured:false, min:8,
    views:"640", author:"Cem Arslan", role:"Köpek Eğitmeni",
    date:"2025-06-18", updated:"2026-02-28",
    title:"Clicker Eğitimi ile Hızlı Öğrenme Teknikleri",
    intro:"Clicker, köpeğinizin doğru davranışını milisaniye hassasiyetiyle işaretlemenizi sağlayan küçük bir araçtır. Poodle'lar clicker eğitimine özellikle yatkındır — yüksek zeka ve ödüle duyarlılıkları kombinasyonu mükemmel bir öğrenme ortamı yaratır.",
    sections:[
      { heading:"Clicker Şartlandırması (Charging the Clicker)", content:"Önce köpeğinizin ''tık'' sesi = ödül denklemini anlamasını sağlamanız gerekir.", list:["Elinizdeki ödülleri hazırlayın (küçük parçalar)","Tıklayın → hemen ödül verin","50 tekrar yapın (2–3 seansta)","Test: köpek tıklama sesine dikkat ediyorsa şartlandırma başarılı"] },
      { heading:"Capture (Yakalama) Tekniği", content:"Köpek doğal olarak istenen davranışı yaptığında tıklayın.", list:["Oturmayı bekliyorsunuz → otururken tıklayın","Sesiniz çıkmayı bekliyorsunuz → havalayınca tıklayın","Doğal davranışları hızla repertuara katmanızı sağlar"] },
      { heading:"Shaping (Şekillendirme) Tekniği", content:"Karmaşık davranışları küçük adımlara bölerek öğretin.", list:["Hedef: kasa girmek","Adım 1: kasaya bakma → tık","Adım 2: kasaya yaklaşma → tık","Adım 3: bir pati koyma → tık","Her aşama otomatikleşince bir sonrakine geçin"] },
      { heading:"Sık Yapılan Hatalar", content:"", list:["Geç tıklama: 0.5 saniyeden sonra tıklanırsa karışıklık olur","Ödülsüz tıklama: clicker'ın değeri düşer","Çok uzun seanslar: 10 dk üzerinde verim düşer","Zor ortamda başlamak: önce ev içinde, sonra dışarıda"], tip:"Clicker'ı her an yanınızda taşımak zorunda değilsiniz. 'Evet!' veya dil tıklatması da aynı işlevi görür — ama tutarlı olun, her zaman aynı kelimeyi kullanın." }
    ],
    related:["temel-komut-egitimi","poodle-anksiyetesi","tuvalet-egitimi"]
  },

  /* ─── 10 ─── */
  {
    slug:"poodle-kizginlik-ciftlestirme", emoji:"🐣", cat:"Üreme", featured:false, min:7,
    views:"520", author:"Dr. Murat Yılmaz", role:"Dahiliye Uzmanı",
    date:"2025-05-10", updated:"2026-01-12",
    title:"Poodle'da İlk Kızgınlık ve Doğru Çiftleştirme Zamanı",
    intro:"Üreme kararı vermeden önce hem anne hem baba adayını kapsamlı sağlık testlerinden geçirmeniz, sağlıklı yavrular için en önemli adımdır.",
    sections:[
      { heading:"İlk Kızgınlık", content:"", list:["Toy Poodle: 6–12 ayda ilk kızgınlık","Minyatür: 9–14 ay","Kızgınlık süresi: 18–21 gün","Belirtiler: vulva şişliği, hafif kanama, idrara sık çıkma","Her 6–8 ayda bir tekrar eder"] },
      { heading:"Çiftleştirme Zamanı", content:"", list:["İlk kızgınlıkta çiftleştirme önerilmez (anne büyüme sürecinde)","2. ya da 3. kızgınlık ideal","Progesteron testi: ovulasyon 5 gün öncesinden izleme","Ovulasyon testi 2–3 günde bir yapılır","Optimum çiftleşme günü LH zirvesinden 2 gün sonra"] },
      { heading:"Sağlık Testleri", content:"", list:["PRA (göz hastalığı) DNA testi","OFA kalça ve diz değerlendirmesi","Addison taraması (anne için)","Tiroid testi","Genetik panel (PRA-prcd, vWD, Neonatal Encephalopathy)"], tip:"Yalnızca ticari amaçla yavru üretmek yerine ırkın sağlık standartlarını iyileştirmeye odaklanın. Sorumlu yetiştiriciler yavruları çok satmaya değil, doğru ailelere yerleştirmeye odaklanır." }
    ],
    related:["poodle-yavrulara-ilk-gunlerde-bakim","yavru-poodle-beslenmesi-ilk-12-ay","poodle-saglik-sorunlari"]
  },

  /* ─── 11 ─── */
  {
    slug:"poodle-yavrulara-ilk-gunlerde-bakim", emoji:"🍼", cat:"Üreme", featured:false, min:6,
    views:"430", author:"Dr. Zeynep Acar", role:"Veteriner Davranış Uzmanı",
    date:"2025-04-05", updated:"2025-12-20",
    title:"Poodle Yavrularına İlk Günlerde Bakım",
    intro:"İlk iki haftada yavru Poodle'lar tamamen anneye bağımlıdır. Bu dönemde yetiştirici olarak doğru ortamı sağlamak ve sağlık takibini yapmak kritik öneme sahiptir.",
    sections:[
      { heading:"0–2 Hafta: Neonatal Dönem", content:"", list:["Göz ve kulaklar kapalı — 10–14. gün açılır","Isı düzenlemesi yok: ortam 29–32°C olmalı","Annesini kaybeden yavrular için yavru sütü tozu (veteriner formülü)","Her 2–3 saatte bir besleme (annesiz ise)","Kilolama: günlük tartım, %10 kayıp alarm sinyali"] },
      { heading:"2–4 Hafta: Geçiş Dönemi", content:"", list:["Göz ve kulaklar açılır","İlk dişler çıkmaya başlar","Hareket etmeye başlarlar","Uyaranlara maruz bırakmaya başlayın (nazikçe)","Anne sütü hâlâ temel beslenme"] },
      { heading:"4–8 Hafta: Sosyalizasyon Kritik", content:"", list:["Ödül bazlı ilk insan teması","Farklı sesler, dokular, ortamlar","Anneden erken ayırmayın (8 hafta taban)","İlk veteriner muayenesi (5–6. hafta)","İlk aşı: 6–8. haftada başlar"], tip:"Sosyalizasyon penceresi 3–12 hafta arası en geniştir. Bu dönemdeki pozitif deneyimler, köpeğinizin hayat boyu özgüveni üzerinde belirleyici rol oynar." }
    ],
    related:["poodle-kizginlik-ciftlestirme","yavru-poodle-beslenmesi-ilk-12-ay","temel-komut-egitimi"]
  },

  /* ─── 12 ─── */
  {
    slug:"tuvalet-egitimi", emoji:"🚽", cat:"Eğitim", featured:false, min:9,
    views:"1.1K", author:"Cem Arslan", role:"Köpek Eğitmeni",
    date:"2026-01-05", updated:"2026-06-01",
    title:"Poodle Tuvalet Eğitimi: 2 Haftada Başarıya Ulaşın",
    intro:"Tuvalet eğitimi, ev ile uyumu başarıyla tamamlamak için yeni sahiplerin en çok odaklandığı konudur. Doğru zamanlama ve tutarlılıkla Poodle'lar 2 hafta içinde büyük ilerleme kaydeder.",
    sections:[
      { heading:"Tuvalet İhtiyacı Ne Zaman Olur?", content:"Yavru köpekler rutin olarak şu zamanlarda tuvalet ihtiyacı duyar:", list:["Uyanır uyanmaz","Her öğün yemekten 15–30 dk sonra","Oyun ve heyecanın ardından","Her 2–3 saatte bir (çok küçük yavrularda 1 saatte)","Uyku öncesi"] },
      { heading:"Başarının Anahtarı: Öngörme", content:"Kaza beklemek yerine, ihtiyaç duyacağı anları önceden tahmin edin ve o anda dışarı çıkarın.", list:["Yemekten sonra hemen dışarı","Kucaktan indirince hemen kapıya","Koklayıp dönüyorsa kesinlikle dışarı","Gece uyarma alarmı: her 3–4 saatte bir"] },
      { heading:"Ödül Bazlı Yerleştirme", content:"", list:["İş biter bitmez coşkuyla ödüllendirin (dışarıdayken)","Kelimeyi seçin: ''Tuvalet'', ''Çiş'', ''Dışarı'' — tutarlı olun","Ödülü eve döndüğünde vermeyin — dışarıdayken verin","Belirli bir yer seçin: her seferinde aynı bölgeye gidin"] },
      { heading:"Kaza Olduğunda", content:"", list:["Asla cezalandırmayın — kaza geçmişte kaldı, anlam ifade etmez","Yüzünü kazaya doğru itmeyin — korku ve güvensizlik yaratır","Enzimli temizleyiciyle temizleyin (koku kalıntısı tekrar çeker)","Siz görmeden olmuşsa hiçbir şey söylemeyin"] },
      { heading:"Kafesin Kullanımı (Crate Training)", content:"Köpekler doğası gereği uyku alanlarını kirletmez. Kafes bu içgüdüyü tuvalet eğitimine katar.", list:["Kafes boyu: uzanabilsin ama fazla yer olmasın","Kafesi pozitif tutun: yemek ve ödülü orada verin","Geceyi kafeste geçirin","2–3 saatte bir dışarı çıkarın"],
        tip:"Tutarsızlık tuvalet eğitiminin birinci düşmanıdır. Evin her üyesi aynı kelimeyi, aynı rutini uygularsa köpek çok daha hızlı öğrenir." }
    ],
    related:["temel-komut-egitimi","clicker-egitimi","poodle-anksiyetesi"]
  },

  /* ─── 13 ─── */
  {
    slug:"poodle-goz-yasi-lekesi-temizleme", emoji:"👁️", cat:"Sağlık", featured:false, min:6,
    views:"870", author:"Dr. Murat Yılmaz", role:"Dahiliye Uzmanı",
    date:"2026-02-10", updated:"2026-05-28",
    title:"Poodle Göz Yaşı Lekesi: Neden Olur ve Nasıl Temizlenir?",
    intro:"Göz altı kahverengi-kırmızı lekeleri (epiphora) Toy Poodle sahiplerinin en sık şikâyet ettiği kozmetik sorunlardandır. Çoğu vaka yönetilebilir, ancak bazıları altta yatan bir sağlık sorununun işareti olabilir.",
    sections:[
      { heading:"Neden Oluşur?", content:"", list:["Gözyaşı kanalı tıkanıklığı / dar kanal (anatomik)","Tüy ve kirpik tahrişi (trichiasis)","Gıda alerjisi veya hassasiyeti","Konjonktivit veya üveit","Glokom (göz içi basıncı artışı)"] },
      { heading:"Günlük Temizlik Rutini", content:"", list:["Sabah ıslak yumuşak bez ile silin (içten dışa)","Poodle spesifik göz mendili kullanın","Leke bölgesini kuru bırakın — ıslaklık mantar ürer","Tüyleri kısa tutun, gözlere temastan uzak"] },
      { heading:"Beslenme ile Yönetim", content:"", list:["Mısır, soya, buğday içermeyen mama deneyin (8 hafta süre)","İçme suyunu filtreli yapın (klor ve demir azaltır)","Antibiyotik katkılı su (Tylosin) — sadece veteriner önerisiyle"] },
      { heading:"Veteriner Tedavileri", content:"", list:["Kanal yıkama (dacryocystorhinography)","Tıkalı kanal için cerrahi","Mantar/bakteri kaynaklıysa topikal tedavi","Göz içi basınç ölçümü (glokom ekarte için)"], tip:"Leke aniden koyulaşır veya gözde kızarıklık, kaşıma, çapak gelişirse hemen veterinere gidin — bu kozmetik değil, tıbbi bir sorundur." }
    ],
    related:["poodle-saglik-sorunlari","poodle-tuy-bakimi-haftalik-rutin","evde-poodle-tirasi-adim-adim-rehber"]
  },

  /* ─── 14 ─── */
  {
    slug:"poodle-beslenme-alerjisi", emoji:"🌿", cat:"Beslenme", featured:false, min:7,
    views:"530", author:"Dr. Ayşe Kaya", role:"Veteriner Hekimi",
    date:"2026-03-22", updated:"2026-06-15",
    title:"Poodle'larda Besin Alerjisi: Belirti ve Eliminasyon Diyeti",
    intro:"Besin alerjisi, bağışıklık sisteminin normal bir gıda bileşenine aşırı tepki vermesidir. Poodle'larda deri ve sindirim belirtileriyle kendini gösterir. Doğru teşhis için sabır ve sistematik bir süreç gerekir.",
    sections:[
      { heading:"Besin Alerjisinin Belirtileri", content:"", list:["Yüz ve kulak kaşıma","Pati yalamak (özellikle ayak tabanları)","Tekrarlayan kulak iltihabı","Kırmızı, kaşıntılı deri (özellikle kasık, koltuk altı)","İshal ve gaz şikâyetleri","Göz yaşı artışı"] },
      { heading:"En Yaygın Alerjenler", content:"", list:["Sığır eti (en sık!)","Süt ürünleri","Buğday","Yumurta","Tavuk (bazı bireylerde)","Soya"] },
      { heading:"Eliminasyon Diyeti Protokolü", content:"8–12 hafta süren, altın standart teşhis yöntemidir:", list:["Hiç yememiş protein + karbonhidrat (örn: yaban domuzu + patates)","Veteriner hidrolize veya tek protein maması kullanın","8 hafta boyunca başka hiçbir şey vermeyin (sakız, ödül dahil)","Belirtiler geçerse alerji kesin","Sonra eski proteini ekleyin — belirtiler dönerse alerjen o"] },
      { heading:"Uzun Vadeli Yönetim", content:"", list:["Alerjen içermeyen mama seçin","Her içerik listesini okuyun","Ödül mamalarına dikkat (çoğu sığır içerir)","Yıllık yeniden test — alerji profili değişebilir"], tip:"Besin alerjisi bazen çevre alerjisiyle (toz akarı, çimen) karıştırılır. İkisini ayırt etmek için veteriner dermatolojist desteği alın." }
    ],
    related:["toy-poodle-en-iyi-mama-markalari-2026","yavru-poodle-beslenmesi-ilk-12-ay","poodle-saglik-sorunlari"]
  },

  /* ─── 15 ─── */
  {
    slug:"poodle-dis-bakim-rehberi", emoji:"🦷", cat:"Sağlık", featured:false, min:6,
    views:"410", author:"Dr. Ali Öztürk", role:"Ortopedi Uzmanı",
    date:"2026-04-08", updated:"2026-06-20",
    title:"Poodle Diş Bakımı: Periodontal Hastalığı Önleyin",
    intro:"Küçük ırk köpekler, diş hastalıklarına orantısız biçimde yatkındır. Toy Poodle'ların ağzında büyük ırklara göre orantılı daha kalabalık bir diş sıralaması vardır — bu durum diş taşı ve periodontitis riskini artırır.",
    sections:[
      { heading:"Neden Küçük Irklarda Daha Fazla?", content:"", list:["Küçük çenede dişler sıkışık — plak birikimi artar","Kuru mama yetersiz kalabilir","Diş minesi daha ince","Yaşlı Poodle'ların %80'inde periodontal hastalık mevcut"] },
      { heading:"Günlük Diş Fırçalama", content:"", list:["Köpek macunu kullanın (flor içermesin — köpekler yutar)","Parmak fırçası ile başlayın, kademeli geçiş","Günde 1 kez ideal, haftada 3 minimum","Önce dudakları alıştırın, sonra dişlere, sonra fırça"] },
      { heading:"Tamamlayıcı Ürünler", content:"", list:["Dental chew (Oravet, Whimzees vb.)","Su katkıları (klorheksidin bazlı)","Dental diet mamalar (Hill's t/d)","Köpek diş jelleri"] },
      { heading:"Profesyonel Diş Taşı Temizliği", content:"", list:["Yılda 1 kez anestezi altında temizlik önerilir","Radyoloji ile kök sorunları tespit","Piyasadaki anestezisiz temizlik yüzeysel ve yetersizdir"], tip:"Periodontal bakteriler kan yoluyla kalp kapakçıklarına ulaşabilir (endokardit). Diş sağlığı sadece ağız sağlığı değil, kalp sağlığıdır." }
    ],
    related:["poodle-saglik-sorunlari","poodle-tuy-bakimi-haftalik-rutin","toy-poodle-en-iyi-mama-markalari-2026"]
  },
];

const ARTICLES_PER_PAGE = 8;

/* ─── Tab/URL helpers ──────────────────────────────────── */
const TAB_MAP: Record<string, string> = {
  tumu: "Tümü", saglik: "Sağlık", bakim: "Bakım",
  egitim: "Eğitim", beslenme: "Beslenme", davranis: "Davranış", ureme: "Üreme",
};
const CAT_TO_TAB: Record<string, string> = {
  "Tümü": "tumu", "Sağlık": "saglik", "Bakım": "bakim",
  "Eğitim": "egitim", "Beslenme": "beslenme", "Davranış": "davranis", "Üreme": "ureme",
};

/* ─── TOC helper ─────────────────────────────────────── */
function buildTOC(article: Article) {
  return article.sections.filter(s => s.heading).map(s => s.heading!);
}

/* ─── Article Detail Component ───────────────────────── */
function ArticleDetail({ article, onClose, allArticles }: { article: Article; onClose: () => void; allArticles: Article[] }) {
  const [liked, setLiked] = useState(() => {
    try { return !!localStorage.getItem("yp_liked_" + article.slug); } catch { return false; }
  });
  const [, navigate] = useLocation();

  /* ── Dynamic SEO: title, canonical, og tags ── */
  useEffect(() => {
    const prevTitle = document.title;
    const desc = article.intro.slice(0, 155);
    const canonical = `https://www.yourpoodle.com/yourpoodle/rehber/${article.slug}`;

    document.title = `${article.title} | YourPoodle`;

    const setMeta = (attr: string, key: string, val: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
      el.content = val;
    };
    setMeta("name", "description", desc);
    setMeta("property", "og:title", `${article.title} | YourPoodle`);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:url", canonical);

    let canonEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const prevHref = canonEl?.href ?? "";
    if (!canonEl) { canonEl = document.createElement("link"); canonEl.setAttribute("rel", "canonical"); document.head.appendChild(canonEl); }
    canonEl.href = canonical;

    return () => {
      document.title = prevTitle;
      if (canonEl) canonEl.href = prevHref;
      setMeta("name", "description", PAGE_DESC);
      setMeta("property", "og:title", PAGE_TITLE);
      setMeta("property", "og:description", PAGE_DESC);
      setMeta("property", "og:url", "https://www.yourpoodle.com/yourpoodle/rehber");
    };
  }, [article]);

  /* ── JSON-LD Article schema ── */
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title,
      "description": article.intro.slice(0, 155),
      "author": { "@type": "Person", "name": article.author, "jobTitle": article.role },
      "datePublished": article.date,
      "dateModified": article.updated,
      "publisher": { "@type": "Organization", "name": "YourPoodle", "url": "https://www.yourpoodle.com" },
      "url": `https://www.yourpoodle.com/yourpoodle/rehber/${article.slug}`,
      "mainEntityOfPage": { "@type": "WebPage", "@id": `https://www.yourpoodle.com/yourpoodle/rehber/${article.slug}` },
    };
    const el = document.getElementById("yp-article-schema");
    if (el) el.textContent = JSON.stringify(schema);
    else {
      const s = document.createElement("script");
      s.id = "yp-article-schema"; s.type = "application/ld+json";
      s.textContent = JSON.stringify(schema);
      document.head.appendChild(s);
    }
    return () => { document.getElementById("yp-article-schema")?.remove(); };
  }, [article]);

  const toggleLike = () => {
    const next = !liked;
    setLiked(next);
    try { next ? localStorage.setItem("yp_liked_" + article.slug, "1") : localStorage.removeItem("yp_liked_" + article.slug); } catch {}
  };

  const share = () => {
    const url = `${window.location.origin}/yourpoodle/rehber/${article.slug}`;
    if (navigator.share) {
      navigator.share({ title: article.title, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => alert("Bağlantı kopyalandı!")).catch(() => {});
    }
  };

  const catStyle = CAT_COLORS[article.cat] || { bg: "#F5F0FF", color: "#7C3AED" };
  const related = allArticles.filter(a => article.related.includes(a.slug)).slice(0, 3);
  const toc = buildTOC(article);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }} />
      <div style={{ position: "relative", background: "#fff", borderRadius: 20, maxWidth: 700, width: "calc(100% - 24px)", maxHeight: "93vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.22)" }}>

        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px 10px", borderBottom: "1px solid #f2f2f2", flexShrink: 0 }}>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "#555", fontSize: 13.5, fontWeight: 700, padding: "4px 0" }}>
            <ArrowLeft size={15} strokeWidth={2.5} /> Geri
          </button>
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#aaa" }}>
            <a href="/yourpoodle/rehber" onClick={e => { e.preventDefault(); onClose(); }} style={{ cursor: "pointer", color: "#7C3AED", textDecoration: "none" }}>Rehber</a>
            <ChevronRight size={10} />
            <span style={{ background: catStyle.bg, color: catStyle.color, padding: "2px 8px", borderRadius: 20, fontWeight: 700 }}>{article.cat}</span>
          </nav>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={toggleLike} aria-label={liked ? "Beğenildi" : "Beğen"} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <Heart size={20} color={liked ? "#FF4566" : "#ccc"} fill={liked ? "#FF4566" : "none"} strokeWidth={2} />
            </button>
            <button onClick={share} aria-label="Paylaş" style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <Share2 size={20} color="#ccc" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ overflowY: "auto", padding: "20px 24px 48px" }}>
          {/* Hero */}
          <div style={{ background: `linear-gradient(135deg,${catStyle.bg},#fff)`, borderRadius: 16, padding: "24px 20px 20px", marginBottom: 20, textAlign: "center" }}>
            <div style={{ fontSize: 52, marginBottom: 10 }}>{article.emoji}</div>
            <span style={{ display: "inline-block", background: catStyle.bg, color: catStyle.color, fontSize: 11, fontWeight: 800, borderRadius: 20, padding: "4px 13px", marginBottom: 12 }}>{article.cat}</span>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: "#111", lineHeight: 1.35, marginBottom: 0 }}>{article.title}</h1>
          </div>

          {/* Meta */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #f2f2f2", flexWrap: "wrap" }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#EDE8FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>👩‍⚕️</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "#222" }}>{article.author}</div>
              <div style={{ fontSize: 11, color: "#888" }}>{article.role}</div>
            </div>
            <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#aaa" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Clock size={11} strokeWidth={2} />{article.min} dk okuma</span>
              <span>📅 {article.updated.split("-")[0]}</span>
            </div>
          </div>

          {/* TOC */}
          {toc.length >= 3 && (
            <div style={{ background: "#F9F7FF", border: "1px solid #E9D5FF", borderRadius: 12, padding: "14px 18px", marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#7C3AED", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>📋 İçindekiler</div>
              {toc.map((h, i) => (
                <div key={i} style={{ fontSize: 12.5, color: "#555", marginBottom: 5, display: "flex", gap: 7, alignItems: "flex-start" }}>
                  <span style={{ color: "#7C3AED", fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          )}

          {/* Intro */}
          <p style={{ fontSize: 14.5, color: "#444", lineHeight: 1.8, marginBottom: 24, fontStyle: "italic" }}>{article.intro}</p>

          {/* Sections */}
          {article.sections.map((sec, i) => (
            <div key={i} style={{ marginBottom: 24 }}>
              {sec.heading && <h2 style={{ fontSize: 16, fontWeight: 800, color: "#111", marginBottom: 10, paddingBottom: 6, borderBottom: "2px solid " + catStyle.bg }}>{sec.heading}</h2>}
              {sec.subheading && <h3 style={{ fontSize: 14, fontWeight: 700, color: "#444", marginBottom: 8 }}>{sec.subheading}</h3>}
              {sec.content && <p style={{ fontSize: 14, color: "#555", lineHeight: 1.8, marginBottom: sec.list ? 10 : 0 }}>{sec.content}</p>}
              {sec.list && (
                <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
                  {sec.list.map((item, j) => (
                    <li key={j} style={{ display: "flex", gap: 9, fontSize: 13.5, color: "#444", lineHeight: 1.65, marginBottom: 6 }}>
                      <span style={{ color: catStyle.color, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {sec.tip && (
                <div style={{ marginTop: 14, padding: "13px 16px", background: "#F7F4FF", borderRadius: 12, borderLeft: "3px solid #7C3AED" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#7C3AED", marginBottom: 5 }}>💡 UZMAN TAVSİYESİ</div>
                  <div style={{ fontSize: 13, color: "#555", lineHeight: 1.65 }}>{sec.tip}</div>
                  <button onClick={() => navigate("/yourpoodle/ai-asistan")}
                    style={{ marginTop: 10, padding: "7px 14px", background: "#7C3AED", color: "#fff", border: "none", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                    🤖 AI Asistan'a Sor →
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Medical disclaimer */}
          <div style={{ margin: "20px 0", padding: "12px 16px", background: "#FFF7ED", borderRadius: 10, borderLeft: "3px solid #F59E0B", fontSize: 12, color: "#92400E" }}>
            ⚕️ <strong>Bilgilendirme:</strong> Bu içerik bilgilendirme amaçlıdır. Acil durumlarda veya sağlık sorunlarında veteriner hekiminize başvurun.
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid #f2f2f2" }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#333", marginBottom: 14 }}>📖 İlgili Makaleler</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {related.map(r => (
                  <a key={r.slug}
                    href={"/yourpoodle/rehber/" + r.slug}
                    aria-label={`${r.title} makalesini oku`}
                    onClick={e => { e.preventDefault(); navigate("/yourpoodle/rehber/" + r.slug); onClose(); }}
                    style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px", background: "#FAFAFA", borderRadius: 12, cursor: "pointer", border: "1.5px solid #F3F4F6", textDecoration: "none" }}>
                    <div style={{ fontSize: 24, width: 44, height: 44, background: "#EDE8FF", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{r.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: "#7C3AED", marginBottom: 3 }}>{r.cat}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#111", lineHeight: 1.4 }}>{r.title}</div>
                    </div>
                    <ChevronRight size={14} color="#ccc" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Reusable article row card ─────────────────────── */
function ArticleRow({ a, onOpen }: { a: Article; onOpen: (a: Article) => void }) {
  const cs = CAT_COLORS[a.cat] || { bg: "#F5F0FF", color: "#7C3AED" };
  return (
    <a href={"/yourpoodle/rehber/" + a.slug}
      aria-label={`${a.title} makalesini oku`}
      className="art-row-reh"
      onClick={e => { e.preventDefault(); onOpen(a); }}
      style={{ display: "flex", gap: 0, background: "#fff", borderRadius: 16, border: "1.5px solid #F0F0F0", cursor: "pointer", textDecoration: "none", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      <div style={{ width: 90, minWidth: 90, background: cs.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, flexShrink: 0 }}>
        {a.emoji}
      </div>
      <div style={{ flex: 1, padding: "13px 14px", minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#111", lineHeight: 1.4, marginBottom: 6 }}>{a.title}</div>
        <div style={{ fontSize: 11, color: "#999", marginBottom: 5 }}>{a.author} — {a.role}</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: "#bbb", display: "flex", alignItems: "center", gap: 3 }}><Clock size={10} strokeWidth={2} />{a.min} dk okuma</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", paddingRight: 14, paddingLeft: 4, flexShrink: 0 }}>
        <ChevronRight size={16} color="#D1D5DB" strokeWidth={2.5} />
      </div>
    </a>
  );
}

/* ─── Main Page ──────────────────────────────────────── */
export default function Rehber({ routeSlug }: { routeSlug?: string } = {}) {
  const [, navigate] = useLocation();
  const [activeCat, setActiveCat] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    return TAB_MAP[p.get("tab") || ""] || "Tümü";
  });
  const [query, setQuery] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    return p.get("q") || "";
  });
  const [selected, setSelected] = useState<Article | null>(null);
  const [page, setPage]         = useState(1);
  const catScrollRef = useRef<HTMLDivElement>(null);

  /* SEO — hub (only when no article is open) */
  useEffect(() => {
    if (selected) return;
    document.title = PAGE_TITLE;
    const setMeta = (attr: string, key: string, val: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
      el.content = val;
    };
    setMeta("property", "og:title", PAGE_TITLE);
    setMeta("name", "description", PAGE_DESC);
    setMeta("property", "og:description", PAGE_DESC);
  }, [selected]);

  /* Handle routeSlug from URL (direct navigation to /yourpoodle/rehber/:slug) */
  useEffect(() => {
    if (routeSlug) {
      const found = ARTICLES.find(a => a.slug === routeSlug);
      setSelected(found ?? null);
    } else {
      // Backwards compat: ?a=slug → redirect to clean URL
      const params = new URLSearchParams(window.location.search);
      const oldSlug = params.get("a");
      if (oldSlug) {
        navigate("/yourpoodle/rehber/" + oldSlug);
      } else {
        setSelected(null);
      }
    }
  }, [routeSlug]);

  /* Custom event from related articles */
  useEffect(() => {
    const handler = (e: Event) => {
      const slug = (e as CustomEvent).detail as string;
      navigate("/yourpoodle/rehber/" + slug);
    };
    window.addEventListener("yp-open-article", handler);
    return () => window.removeEventListener("yp-open-article", handler);
  }, [navigate]);

  const openArticle = useCallback((a: Article) => {
    setSelected(a);
    navigate("/yourpoodle/rehber/" + a.slug);
  }, [navigate]);

  const closeArticle = useCallback(() => {
    setSelected(null);
    navigate("/yourpoodle/rehber");
  }, [navigate]);

  const filtered = ARTICLES.filter(a =>
    (activeCat === "Tümü" || a.cat === activeCat) &&
    (query === "" || a.title.toLowerCase().includes(query.toLowerCase()) || a.author.toLowerCase().includes(query.toLowerCase()))
  );

  const featuredArticle = ARTICLES.find(a => a.featured);
  const listArticles = filtered.filter(a => !(a.featured && activeCat === "Tümü" && query === ""));
  const totalPages = Math.ceil(listArticles.length / ARTICLES_PER_PAGE);
  const pageItems = listArticles.slice((page - 1) * ARTICLES_PER_PAGE, page * ARTICLES_PER_PAGE);

  const changeCategory = (cat: string) => {
    setActiveCat(cat); setPage(1);
    const tab = CAT_TO_TAB[cat] || "tumu";
    const qs = new URLSearchParams();
    if (tab !== "tumu") qs.set("tab", tab);
    if (query) qs.set("q", query);
    const qStr = qs.toString();
    window.history.replaceState({}, "", "/yourpoodle/rehber" + (qStr ? "?" + qStr : ""));
  };

  const changeQuery = (val: string) => {
    setQuery(val); setPage(1);
    const tab = CAT_TO_TAB[activeCat] || "tumu";
    const qs = new URLSearchParams();
    if (tab !== "tumu") qs.set("tab", tab);
    if (val) qs.set("q", val);
    const qStr = qs.toString();
    window.history.replaceState({}, "", "/yourpoodle/rehber" + (qStr ? "?" + qStr : ""));
  };

  /* ── Category-based featured article ── */
  const CAT_FEATURED: Record<string, string> = {
    "Tümü":     "toy-poodle-en-iyi-mama-markalari-2026",
    "Beslenme": "toy-poodle-en-iyi-mama-markalari-2026",
    "Sağlık":   "poodle-saglik-sorunlari",
    "Bakım":    "evde-poodle-tirasi-adim-adim-rehber",
    "Eğitim":   "temel-komut-egitimi",
    "Davranış": "poodle-anksiyetesi",
    "Üreme":    "poodle-kizginlik-ciftlestirme",
  };
  const activeFeatured = ARTICLES.find(a => a.slug === (CAT_FEATURED[activeCat] ?? CAT_FEATURED["Tümü"])) ?? featuredArticle;

  const CAT_EMOJI: Record<string, string> = {
    Tümü: "✦", Beslenme: "🌿", Sağlık: "❤️", Bakım: "🛁", Eğitim: "🎓", Davranış: "💬", Üreme: "🥚",
  };

  const formatDate = (d: string) => {
    const [, m] = d.split("-");
    const months: Record<string, string> = { "01":"Oca","02":"Şub","03":"Mar","04":"Nis","05":"May","06":"Haz","07":"Tem","08":"Ağu","09":"Eyl","10":"Eki","11":"Kas","12":"Ara" };
    return (months[m] ?? m) + " " + d.split("-")[0];
  };

  return (
    <YPLayout activeLink="/yourpoodle/rehber">
      <style>{`
        /* scrollbar */
        .noscroll-reh::-webkit-scrollbar { display: none; }
        .noscroll-reh { -ms-overflow-style: none; scrollbar-width: none; }
        /* hero dots */
        .reh-hero-dots {
          position: absolute; left: 0; top: 0; bottom: 0; width: 110px;
          background-image: radial-gradient(circle, rgba(255,255,255,0.22) 1.5px, transparent 1.5px);
          background-size: 14px 14px; pointer-events: none;
        }
        /* featured hover */
        .reh-featured:hover { box-shadow: 0 6px 28px rgba(124,58,237,0.13) !important; border-color: #D8B4FE !important; }
        /* card hover */
        .art-row-reh { transition: box-shadow .15s, border-color .15s; }
        .art-row-reh:hover { box-shadow: 0 4px 18px rgba(0,0,0,0.07) !important; border-color: #E9D5FF !important; }
        /* cat pill edge fade */
        .cat-fade-wrap { position: relative; }
        .cat-fade-wrap::after {
          content: ""; position: absolute; right: 0; top: 0; bottom: 0;
          width: 48px; background: linear-gradient(to right, transparent, #fff);
          pointer-events: none;
        }
        /* grid */
        @media (min-width: 640px) {
          .reh-art-grid { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 12px !important; }
        }
        @media (max-width: 639px) {
          .reh-art-grid { display: flex; flex-direction: column; gap: 10px; }
        }
        /* modal mobile */
        @media (max-width: 639px) {
          .reh-modal-box { border-radius: 20px 20px 0 0 !important; position: fixed !important; bottom: 0 !important; top: auto !important; left: 0 !important; right: 0 !important; width: 100% !important; max-width: 100% !important; max-height: 92vh !important; }
        }
        /* page wrapper */
        .reh-page { max-width: 900px; margin: 0 auto; }
      `}</style>

      {selected && <ArticleDetail article={selected} onClose={closeArticle} allArticles={ARTICLES} />}

      <div className="reh-page">

        {/* ── Hero ── */}
        <div style={{ background: "linear-gradient(135deg,#6D28D9 0%,#7C3AED 55%,#8B5CF6 100%)", padding: "32px 28px 36px", position: "relative", overflow: "hidden" }}>
          {/* dot pattern left */}
          <div className="reh-hero-dots" />
          {/* top-right circle blur */}
          <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />

          <div style={{ position: "relative", display: "flex", alignItems: "flex-start", gap: 20 }}>
            {/* book icon box */}
            <div style={{ width: 64, height: 64, background: "rgba(255,255,255,0.18)", borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, flexShrink: 0, backdropFilter: "blur(4px)" }}>
              📖
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 28, fontWeight: 900, color: "#fff", margin: "0 0 6px", lineHeight: 1.15 }}>Poodle Rehberi</h1>
              <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.85)", margin: "0 0 20px", lineHeight: 1.4 }}>Veteriner onaylı içerikler, uzman yazarlar</p>
              <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
                {[
                  { icon: "📄", n: String(ARTICLES.length), l: "Articles" },
                  { icon: "⊞",  n: "6",                    l: "Categories" },
                  { icon: "⭐", n: "Free",                  l: "Access" },
                ].map(({ icon, n, l }) => (
                  <div key={l} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 32, height: 32, background: "rgba(255,255,255,0.18)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>{icon}</div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{n}</div>
                      <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.72)", marginTop: 2 }}>{l}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Breadcrumb ── */}
        <nav aria-label="breadcrumb" style={{ padding: "14px 20px 0", display: "flex", gap: 6, alignItems: "center", fontSize: 12.5, color: "#aaa" }}>
          <a href="/yourpoodle" style={{ color: "#7C3AED", textDecoration: "none", fontWeight: 600 }}>Ana Sayfa</a>
          <ChevronRight size={12} />
          <span style={{ color: "#555", fontWeight: 600 }}>Rehber</span>
        </nav>

        {/* ── Search ── */}
        <div style={{ padding: "12px 20px 0" }}>
          <div style={{ display: "flex", alignItems: "center", background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 14, height: 52, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div style={{ paddingLeft: 16, color: "#bbb", display: "flex", flexShrink: 0 }}><Search size={18} strokeWidth={2} /></div>
            <input
              value={query}
              onChange={e => changeQuery(e.target.value)}
              placeholder="Makale, konu veya yazar ara…"
              aria-label="Makale ara"
              style={{ flex: 1, border: "none", outline: "none", fontSize: 14, color: "#333", background: "transparent", padding: "0 14px" }}
            />
            {query && (
              <button onClick={() => changeQuery("")} aria-label="Aramayı temizle" style={{ background: "none", border: "none", cursor: "pointer", paddingRight: 14, color: "#bbb" }}>
                <X size={16} strokeWidth={2} />
              </button>
            )}
          </div>
        </div>

        {/* ── Section tabs: Sağlık / Bakım / Eğitim / Araçlar ── */}
        <div style={{ padding: "16px 20px 0", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
          {([
            { label: "Sağlık",  cat: "Sağlık",  emoji: "💊", color: "#E11D48", bg: "#FFF1F2" },
            { label: "Bakım",   cat: "Bakım",   emoji: "🛁", color: "#0369A1", bg: "#F0F9FF" },
            { label: "Eğitim",  cat: "Eğitim",  emoji: "🎓", color: "#16A34A", bg: "#F0FDF4" },
            { label: "Araçlar", cat: "Araçlar", emoji: "🔧", color: "#7C3AED", bg: "#F5F0FF" },
          ] as const).map(({ label, cat, emoji, color, bg }) => {
            const active = activeCat === cat;
            return (
              <button key={cat}
                onClick={() => cat === "Araçlar" ? navigate("/yourpoodle/bilgi") : changeCategory(active ? "Tümü" : cat)}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                  padding: "12px 6px", borderRadius: 14, border: "2px solid",
                  borderColor: active ? color : "#E5E7EB",
                  background: active ? bg : "#fff",
                  cursor: "pointer", fontFamily: "inherit", transition: "all .15s",
                }}>
                <span style={{ fontSize: 22 }}>{emoji}</span>
                <span style={{ fontSize: 11.5, fontWeight: 800, color: active ? color : "#555" }}>{label}</span>
              </button>
            );
          })}
        </div>

        {/* ── Featured card ── */}
        {query === "" && activeFeatured && (
          <div style={{ padding: "18px 20px 0" }}>
            <a href={"/yourpoodle/rehber/" + activeFeatured.slug}
              onClick={e => { e.preventDefault(); openArticle(activeFeatured); }}
              aria-label={`Öne çıkan: ${activeFeatured.title}`}
              className="reh-featured"
              style={{ display: "flex", gap: 0, background: "#fff", borderRadius: 18, border: "1.5px solid #E9D5FF", overflow: "hidden", cursor: "pointer", textDecoration: "none", boxShadow: "0 2px 12px rgba(124,58,237,0.08)", transition: "box-shadow .15s, border-color .15s" }}>
              {/* thumbnail */}
              <div style={{ width: 140, minWidth: 140, background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, flexShrink: 0 }}>
                {activeFeatured.emoji}
              </div>
              {/* content */}
              <div style={{ flex: 1, padding: "20px 18px 20px 20px", minWidth: 0 }}>
                {/* badges */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4, background: "#FEF3C7", color: "#D97706", fontSize: 10.5, fontWeight: 800, borderRadius: 20, padding: "3px 10px", letterSpacing: "0.04em" }}>
                    ⭐ ÖNE ÇIKAN
                  </span>
                  <span style={{ fontSize: 10.5, fontWeight: 800, color: CAT_COLORS[activeFeatured.cat]?.color ?? "#7C3AED", letterSpacing: "0.05em" }}>
                    {activeFeatured.cat.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize: 17, fontWeight: 800, color: "#111", lineHeight: 1.35, marginBottom: 14 }}>{activeFeatured.title}</div>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontSize: 11.5, color: "#888", display: "flex", alignItems: "center", gap: 4 }}>
                    <Clock size={12} strokeWidth={2} />{activeFeatured.min} dk okuma
                  </span>
                  <span style={{ fontSize: 11.5, color: "#888", display: "flex", alignItems: "center", gap: 4 }}>
                    👤 {activeFeatured.author}
                  </span>
                  <span style={{ fontSize: 11.5, color: "#888", display: "flex", alignItems: "center", gap: 4 }}>
                    📅 {activeFeatured.updated.split("-")[0]}
                  </span>
                </div>
              </div>
              {/* arrow */}
              <div style={{ display: "flex", alignItems: "center", paddingRight: 18, paddingLeft: 4, flexShrink: 0 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ChevronRight size={20} color="#fff" strokeWidth={2.5} />
                </div>
              </div>
            </a>
          </div>
        )}

        {/* ── Article grid ── */}
        <div style={{ padding: "18px 20px 0" }}>
          {pageItems.length === 0 ? (
            <div style={{ textAlign: "center", padding: "56px 24px", color: "#aaa" }}>
              <div style={{ fontSize: 44, marginBottom: 14 }}>🔍</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#555", marginBottom: 6 }}>
                {query ? `"${query}" için makale bulunamadı` : "Bu kategoride henüz makale yok"}
              </div>
              <div style={{ fontSize: 13 }}>Farklı bir kategori veya arama terimi deneyin.</div>
              <button onClick={() => { changeQuery(""); changeCategory("Tümü"); }}
                style={{ marginTop: 18, padding: "10px 24px", borderRadius: 20, background: "#7C3AED", color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
                Tümünü Göster
              </button>
            </div>
          ) : activeCat === "Tümü" && query === "" ? (
            /* ── Grouped by section when showing all ── */
            <>
              {([
                { label: "Sağlık",  emoji: "💊", color: "#E11D48" },
                { label: "Bakım",   emoji: "🛁", color: "#0369A1" },
                { label: "Eğitim",  emoji: "🎓", color: "#16A34A" },
                { label: "Beslenme",emoji: "🌿", color: "#EA580C" },
                { label: "Davranış",emoji: "💬", color: "#9333EA" },
              ] as const).map(({ label, emoji, color }) => {
                const group = pageItems.filter(a => a.cat === label);
                if (group.length === 0) return null;
                return (
                  <div key={label} style={{ marginBottom: 24 }}>
                    {/* Section header */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, paddingBottom: 8, borderBottom: `2px solid ${color}20` }}>
                      <span style={{ fontSize: 18 }}>{emoji}</span>
                      <span style={{ fontSize: 15, fontWeight: 900, color }}>{label}</span>
                      <span style={{ fontSize: 11, color: "#bbb", fontWeight: 600, marginLeft: "auto" }}>{group.length} makale</span>
                    </div>
                    <div className="reh-art-grid" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {group.map(a => <ArticleRow key={a.slug} a={a} onOpen={openArticle} />)}
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div className="reh-art-grid" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {pageItems.map(a => <ArticleRow key={a.slug} a={a} onOpen={openArticle} />)}
            </div>
          )}
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "24px 20px 8px", flexWrap: "wrap" }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              style={{ padding: "8px 16px", borderRadius: 20, border: "1.5px solid #E5E7EB", background: "#fff", cursor: page === 1 ? "default" : "pointer", color: page === 1 ? "#ccc" : "#555", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
              <ChevronLeft size={14} /> Önceki
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPage(n)}
                style={{ width: 38, height: 38, borderRadius: "50%", border: "1.5px solid", borderColor: page === n ? "#7C3AED" : "#E5E7EB", background: page === n ? "#7C3AED" : "#fff", color: page === n ? "#fff" : "#555", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                {n}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              style={{ padding: "8px 16px", borderRadius: 20, border: "1.5px solid #E5E7EB", background: "#fff", cursor: page === totalPages ? "default" : "pointer", color: page === totalPages ? "#ccc" : "#555", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
              Sonraki <ChevronRight size={14} />
            </button>
          </div>
        )}

        <div style={{ height: 40 }} />
      </div>
    </YPLayout>
  );
}
