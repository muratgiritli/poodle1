import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { ChevronRight, Clock, ArrowLeft, Heart, Share2, Search, X, CheckCircle2, Circle } from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";

/* ─── SEO ─────────────────────────────────────────────── */
const PAGE_TITLE    = "Poodle Eğitim Rehberi: Komutlar, Tuvalet ve Davranış | YourPoodle";
const PAGE_DESC     = "Toy Poodle eğitim rehberi: otur, gel, bırak komutları, tuvalet eğitimi, clicker eğitimi, havlama ve yalnız kalma çözümleri. Adım adım ödül bazlı eğitim.";
const PAGE_OG_TITLE = "Poodle Eğitim Rehberi: Komutlar, Tuvalet ve Davranış | YourPoodle";

/* ─── Helpers ─────────────────────────────────────────── */
type Difficulty = "Başlangıç" | "Orta" | "İleri";
type AgeGroup   = "yavru" | "genç" | "yetişkin";

const DIFF_COLOR: Record<Difficulty, string> = {
  "Başlangıç": "#16A34A",
  "Orta":      "#F59E0B",
  "İleri":     "#EF4444",
};
const AGE_COLOR = ["#FFB347", "#A67C52", "#34D399"];

const ARTICLE_CATS  = ["Tümü", "Temel", "Yavru", "Sosyalleşme", "Spor", "Davranış"];
const DIFF_FILTERS  = ["Tümü", "Başlangıç", "Orta", "İleri"] as const;

/* ─── DATA ─────────────────────────────────────────────── */
interface ArticleSection { heading?: string; content: string; list?: string[]; tip?: string; numbered?: boolean; }
interface Article {
  slug: string; emoji: string; tag: string; cat: string;
  difficulty: Difficulty; ageGroups: AgeGroup[];
  title: string; min: number; date: string; updated: string;
  author: string; role: string;
  intro: string; sections: ArticleSection[]; related: string[];
  isHowTo?: boolean;
}

const ARTICLES: Article[] = [
  /* ─── 1 ─── */
  {
    slug:"temel-komutlar", emoji:"🐾", tag:"Temel Eğitim", cat:"Temel", difficulty:"Başlangıç",
    ageGroups:["genç","yetişkin"], min:10, date:"2026-01-08", updated:"2026-06-10",
    author:"Cem Arslan", role:"Köpek Eğitmeni", isHowTo:true,
    title:"Poodle'a Temel Komutları Öğretmek: Adım Adım Rehber",
    intro:"Poodle'lar köpek zeka sıralamasında ikinci sıradadır. Bu eşsiz kapasiteyi doğru teknikle kullandığınızda otur, gel, bırak ve bekle komutlarını birkaç hafta içinde öğretebilirsiniz.",
    sections:[
      { heading:"Pozitif Pekiştirme: Neden İşe Yarar?",
        content:"",
        list:["Ödül bazlı eğitim köpek güvenini artırır","Ceza temelli yöntemler stres ve güvensizlik yaratır","Poodle'lar olumsuz pekiştirmeye özellikle hassas","Antrenman süresi: günde 2×10 dakika yeterli"] },
      { heading:"Adım 1: Otur (Sit)",
        content:"En kolay ve tüm komutların temeli olan otur:",
        list:["Ödülü burnunun üzerine götürün","Burnu takip ederken doğal olarak oturacak","Oturduğu anda 'Evet!' veya clicker + ödül","20–30 tekrar sonra 'Otur' kelimesini ekleyin","Hedef: komut söylenir söylenmez 3 sn içinde"],
        numbered:true },
      { heading:"Adım 2: Gel (Come/Recall)",
        content:"Güvenlik açısından hayat kurtarıcı komut:",
        list:["Asla çağırıp cezalandırmayın — komutu mahveder","Eğlenceli ses tonuyla uzaktan çağırın","Geldiğinde en yüksek değerli ödülle karşılayın","1→3→5→10 m mesafeyle artırın","Dışarıda önce uzun ip ile çalışın"],
        numbered:true },
      { heading:"Adım 3: Bırak (Leave It/Drop It)",
        content:"",
        list:["Sol el: düşük değerli ödül yumrukta","Koklarken açmayın","Uzaklaşınca sağ elden yüksek değerli ödül verin","Bu 'bırakmanın' karlı olduğunu öğretir"],
        numbered:true },
      { heading:"Adım 4: Bekle (Stay)",
        content:"",
        list:["Otur → 1 sn beklet → ödül","Süreyi yavaşça artırın (3→10→30 sn→1 dk)","Mesafe ekleyin: 1 adım → 3 adım → oda dışı","Her aşamayı yerleştirin, acele etmeyin"],
        numbered:true },
      { heading:"Adım 5: Dur / Yere Yat (Down)",
        content:"",
        list:["Otur pozisyonundan başlayın","Ödülü aşağı yere doğru indirin","Yere uzandığında işaretleyin + ödül","Poodle'lar bu komutu 3–5 günde öğrenir"],
        numbered:true },
      { heading:"Sık Yapılan Hatalar",
        content:"",
        list:["Komut tekrarı: 'Otur, otur, otur!' — köpek tek komuta uyacak","Gecikmeli ödül (0.5 sn üstü): karışıklık yaratır","Uzun seanslar: 10 dk üzerinde verim düşer","Sinirli tonda komut: eğitimi stresle ilişkilendirir"],
        tip:"Poodle'lar sıkılır — her antrenmana az da olsa yeni bir öğe ekleyin. 'Bugün yeni ne öğrendik?' sorusunu kendinize sormak iyi bir alışkanlıktır." }
    ],
    related:["clicker-egitimi","tuvalet-egitimi","havlama-kontrolu"]
  },

  /* ─── 2 ─── */
  {
    slug:"clicker-egitimi", emoji:"🎓", tag:"İleri Eğitim", cat:"Temel", difficulty:"Orta",
    ageGroups:["genç","yetişkin"], min:8, date:"2025-11-15", updated:"2026-05-20",
    author:"Cem Arslan", role:"Köpek Eğitmeni",
    title:"Clicker Eğitimi ile Hızlı Öğrenme Teknikleri",
    intro:"Clicker, doğru davranışı milisaniye hassasiyetiyle işaretlemenizi sağlayan küçük bir araçtır. Poodle'lar yüksek zeka ve ödüle duyarlılıkları kombinasyonuyla clicker eğitimine mükemmel uyum sağlar.",
    sections:[
      { heading:"Clicker Şartlandırması",
        content:"",
        list:["Tıklayın → hemen ödül verin (50 tekrar)","Test: köpek tıklamaya dikkat ediyorsa başarılı","'Evet!' kelimesi de aynı işlevi görür — tutarlı olun"] },
      { heading:"Capture (Yakalama) Tekniği",
        content:"Köpek doğal olarak istenen davranışı yaptığında tıklayın.",
        list:["Oturmayı bekliyorsunuz → otururken tıklayın","Havalayınca tıklayın","Doğal davranışları hızla repertuara katmanızı sağlar"] },
      { heading:"Shaping (Şekillendirme)",
        content:"Karmaşık davranışları küçük adımlara bölerek öğretin.",
        list:["Hedef: kasa girmek","Kasaya bakma → tık","Kasaya yaklaşma → tık","Bir pati koyma → tık","Tam girme → tık","Her aşama otomatikleşince ilerleyin"],
        numbered:true },
      { heading:"Sık Yapılan Hatalar",
        content:"",
        list:["Geç tıklama (0.5 sn sonrası): farklı davranışı pekiştirir","Ödülsüz tıklama: clicker değeri düşer","10 dk üzeri seans: verim düşer","Zor ortamda başlamak: önce ev içi"],
        tip:"Clicker'ı her an yanınızda taşımak zorunda değilsiniz. Dil tıklatması veya 'Evet!' da eşdeğer — ama her seferinde aynısını kullanın." }
    ],
    related:["temel-komutlar","agility-egitimi","yalniz-kalma-kaygisi"]
  },

  /* ─── 3 ─── */
  {
    slug:"tuvalet-egitimi", emoji:"🏠", tag:"Yavru Eğitimi", cat:"Yavru", difficulty:"Başlangıç",
    ageGroups:["yavru","genç"], min:9, date:"2026-02-10", updated:"2026-06-01",
    author:"Cem Arslan", role:"Köpek Eğitmeni", isHowTo:true,
    title:"Tuvalet Eğitimi: Yavru Poodle İçin Adım Adım",
    intro:"Doğru teknikle uygulandığında tuvalet eğitimi genellikle 2–4 haftada tamamlanır. Sabır, tutarlılık ve asla ceza vermemek üç temel kuraldır.",
    sections:[
      { heading:"Tuvalet İhtiyacı Ne Zaman Olur?",
        content:"Yavru köpekler rutin olarak şu anlarda tuvalet ihtiyacı duyar:",
        list:["Uyanır uyanmaz","Her öğün 15–30 dk sonra","Oyun ve heyecanın ardından","Her 1–2 saatte (çok küçük yavrular)","Uyku öncesi"] },
      { heading:"Adım 1: Rutin Oluşturun",
        content:"",
        list:["Her günü aynı saatlerde başlatın","Yemek saatlerini sabitleyin","Çıkış noktasını belirleyin ve her seferinde oraya gidin","Gece alarmı: 3–4 saatte bir"],
        numbered:true },
      { heading:"Adım 2: Anlık Ödüllendirme",
        content:"",
        list:["İş biter bitmez — dışarıdayken — ödüllendirin","Kelime seçin: 'Tuvalet', 'Çiş' — tutarlı olun","Eve döndükten sonra verilen ödül bağ kurmaz","Coşkulu ses tonu ödülü güçlendirir"],
        numbered:true },
      { heading:"Adım 3: Kaza Yönetimi",
        content:"",
        list:["Asla cezalandırmayın — kaza geçmişte kaldı","Yüzünü kazaya doğru itmeyin (korku + güvensizlik)","Enzimli temizleyici kullanın (koku kalıntısı tekrar çeker)","Siz görmeden olduysa sessiz kalın"],
        numbered:true },
      { heading:"Adım 4: Crate (Kafes) Yöntemi",
        content:"",
        list:["Köpekler uyku alanlarını kirletmez — bunu kullanın","Kafes boyu: uzanabilsin ama fazla yer olmasın","Geceyi kafeste geçirin","Her 2–3 saatte bir dışarı çıkarın"],
        numbered:true },
      { heading:"Adım 5: İlerleme Takibi",
        content:"",
        list:["Günlük dışarı çıkış sayısını not alın","Başarı oranı her hafta artmalı","4. haftada %80+ başarı hedefleyin","Regresyon olursa rutini sıkılaştırın"] },
      { heading:"Sık Yapılan Hatalar",
        content:"",
        list:["Serbestçe dolaştırmak (kaçarsa kontrol kaybedersiniz)","Sadece siz dışarı çıkarmak (tutarsızlık)","'Neden yaptın!' demek (anlam ifade etmez)","Temizliği ihmal etmek (koku tekrar çeker)"],
        tip:"Tuvalet eğitiminin 1 numaralı düşmanı tutarsızlıktır. Ev halkının tüm üyeleri aynı kelimeyi, aynı rutini uygulamalıdır." }
    ],
    related:["temel-komutlar","sosyallesme","isirma-davranisi"]
  },

  /* ─── 4 ─── */
  {
    slug:"sosyallesme", emoji:"🤝", tag:"Sosyalleşme", cat:"Sosyalleşme", difficulty:"Başlangıç",
    ageGroups:["yavru","genç"], min:9, date:"2025-10-20", updated:"2026-03-15",
    author:"Dr. Zeynep Acar", role:"Veteriner Davranış Uzmanı",
    title:"Poodle Sosyalleşme Rehberi: Diğer Köpekler ve İnsanlarla",
    intro:"3–12 hafta arası kritik sosyalleşme penceresidir. Bu dönemdeki pozitif deneyimler köpeğinizin hayat boyu özgüvenini şekillendirir. Kaçırılan sosyalleşme, sonraki yıllarda giderilmesi güç korku ve anksiyete bırakabilir.",
    sections:[
      { heading:"3–12 Hafta: Kritik Pencere",
        content:"",
        list:["Bu dönemde beyin en hızlı öğrenir","Her yeni deneyim kalıcı iz bırakır","Aşılı olmadan parkta köpeklerle temas riski var — eğitimli köpekler seçin","Evde misafir, farklı sesler, yer kaplamaları — hepsi sosyalleşme"] },
      { heading:"İnsan Sosyalleşmesi",
        content:"",
        list:["Farklı görünümlü insanlar: şapkalı, sakallı, çocuklar, yaşlılar","Her karşılaşmayı ödülle ilişkilendirin","Zorlama yok — köpeğin kendi hızında yaklaşmasına izin verin","Evde düzenli misafir rutini oluşturun"] },
      { heading:"Köpek Sosyalleşmesi",
        content:"",
        list:["Önce sakin, aşılı yetişkin köpekler","Köpek dili okuyun: sert beden dili olursa ayırın","Oyun sinyalleri: yay duruşu, açık ağız, gevşek vücut","Köpek parkları yerine küçük kontrollü gruplar tercih edin"] },
      { heading:"Çevre Sosyalleşmesi",
        content:"",
        list:["Farklı zeminler: taş, çim, kum, ızgara","Farklı sesler: kamyon, fırıldak, çocuk sesi","Araç yolculuğu: kısa + ödüllü başlayın","Veteriner klinikleri: keyifli ziyaretler planlayın (muayene olmadan)"],
        tip:"Aşı tamamlanmadan veteriner öneri: sizi tanıyan eğitimli köpeklerle etkileşim, bebek arabası yolculukları ve müzisyenli kafelerdeki gibi temiz ortamlar sosyalleşme için güvenlidir." }
    ],
    related:["temel-komutlar","tuvalet-egitimi","yalniz-kalma-kaygisi"]
  },

  /* ─── 5 ─── */
  {
    slug:"agility-egitimi", emoji:"🏃", tag:"Spor Eğitimi", cat:"Spor", difficulty:"İleri",
    ageGroups:["yetişkin"], min:11, date:"2025-08-30", updated:"2026-02-10",
    author:"Cem Arslan", role:"Köpek Eğitmeni",
    title:"Agility: Poodle'ınızı Engel Parkurunda Eğitmek",
    intro:"Poodle'lar agility sporunun ideal ırkıdır — zihinsel uyarım, fiziksel aktivite ve sahip uyumunu aynı anda geliştirir. Uluslararası yarışmalarda en başarılı ırklardan biridir.",
    sections:[
      { heading:"Agility Nedir?",
        content:"",
        list:["Tünel, atlama bariyeri, slalom, tahta ve köprü gibi engeller","Köpek ve sahip arasında koordinasyon gerektiren spor","Yarışma boyutları: mini, medium, large","Başlangıç için yerel kulüp önerilir"] },
      { heading:"Temel Gereksinimler",
        content:"",
        list:["Güçlü gel + bekle + sağ/sol yön komutları","Fiziksel sağlık kontrolü (özellikle eklemler)","Yüksek motivasyon ve odak","En az 12 ay yaş (iskelet gelişimi tamamlanmalı)"] },
      { heading:"Adım Adım Tanıtım",
        content:"",
        list:["Her engeli tek tek, ödülle tanıtın","Alçak yükseklik ve yavaş tempo ile başlayın","Engelleri sıralı bağlamadan önce her birini pekiştirin","Yön komutlarını (sağ/sol) ayarı ekleyin","Hızı en son ekleyin — önce doğruluk"],
        numbered:true },
      { heading:"Ev İçin Pratik Ekipman",
        content:"",
        list:["PVC borulardan atlama engeli (€5–15)","Küçük çadır tünel","Slalom direkleri (esnek PVC boru)","Alçak denge tahtası"] },
      { heading:"Yarışma Hazırlığı",
        content:"",
        list:["UKA veya FCI standartlarını öğrenin","Bölgesel kulüplere üye olun","Deneme parkurlarına katılın","Köpeğin günlük antrenman süresi: 20–30 dk"],
        tip:"Agility'ye başlamadan önce tam fizik muayenesi yaptırın. Eklem veya omurga sorunları bu sporu tehlikeli kılabilir." }
    ],
    related:["clicker-egitimi","temel-komutlar","sosyallesme"]
  },

  /* ─── 6 ─── */
  {
    slug:"bakim-rutini-egitimi", emoji:"🛁", tag:"Bakım Hazırlık", cat:"Temel", difficulty:"Başlangıç",
    ageGroups:["yavru"], min:6, date:"2026-01-20", updated:"2026-05-05",
    author:"Selin Demir", role:"Grooming Uzmanı",
    title:"Bakım Rutinine Alıştırma: Tıraş ve Banyo Eğitimi",
    intro:"Küçük yaştan itibaren tıraş ve banyoya alıştırmak hem köpeğin hem groomerin işini kolaylaştırır. Erken pozitif deneyimler ömür boyu kooperatif bakım alışkanlığı yaratır.",
    sections:[
      { heading:"Neden Erken Başlamak Kritik?",
        content:"",
        list:["İlk 6 ay öğrenme penceresinde alışkanlık kalıcı","Korku bazlı direnç ilerleyen yaşta çok güçlü","Groomer ziyaretlerini stressiz geçirmek sağlık açısından önemli"] },
      { heading:"Fırça Alıştırması",
        content:"",
        list:["Fırçayı önce sadece gösterin — ödül verin","Sırta 2–3 tarama → ödül","Her seans biraz uzatın","Sabırsız olup çok tarama yapmayın — kötü deneyim bırakabilir"] },
      { heading:"Banyo Alıştırması",
        content:"",
        list:["Önce boş küvete girin → ödül","Islak mendille ıslatma → ödül","Duş başlığının sesini tanıtın (açın ama dokundurma)","İlk banyoyu kısa tutun (5 dk)","Kurutma makinesi: uzaktan → yakına kademeli"] },
      { heading:"Pençe ve Kulak",
        content:"",
        list:["Patilere dokunmaya alıştırın (hep ödüllü)","Pençe makasını tanıtın — kesim öncesinde","Kulak içine bakmayı rutinleştirin","Her seansı ödülle bitirin — son deneyim belirleyici"],
        tip:"Her bakım seansını köpeğin sevdiği bir aktiviteyle (oyun, yürüyüş) bitirin. Bakım = eğlenceli şeyler öncesi bağlantısı kurar." }
    ],
    related:["tuvalet-egitimi","sosyallesme","temel-komutlar"]
  },

  /* ─── 7 YENİ ─── */
  {
    slug:"havlama-kontrolu", emoji:"🔊", tag:"Davranış Eğitimi", cat:"Davranış", difficulty:"Orta",
    ageGroups:["genç","yetişkin"], min:8, date:"2026-03-05", updated:"2026-06-12",
    author:"Dr. Zeynep Acar", role:"Veteriner Davranış Uzmanı",
    title:"Poodle Havlama Kontrolü: Neden Havlar, Nasıl Azaltılır?",
    intro:"Poodle'lar iletişimci ve zeki ırklardandır; havlama çoğunlukla bir ihtiyacın veya duygunun ifadesidir. 'Sustur' komutu öğretmek mümkün — ama önce nedeni anlamak şarttır.",
    sections:[
      { heading:"Havlama Türleri ve Nedenleri",
        content:"",
        list:["Uyarı havlaması: kapı, yabancı, ses — içgüdüsel","Dikkat havlaması: ilgi çekmek için (siz pekiştirdiniz mi?)","Kaygı havlaması: yalnız kalma, stres","Sıkıntı havlaması: yeterince uyarılmıyor","Öğrenilmiş havlama: geçmişte işe yaramıştı"] },
      { heading:"'Sustur' Komutu Öğretimi",
        content:"",
        list:["Havlarken ödüllü sessizliği bekleyin (birkaç sn)","Sessizken 'Sessiz' veya 'Yeter' deyin + tıklayın + ödül verin","Süreyi kademeli artırın (5 sn → 15 sn → 1 dk)","Asla bağırmayın — havlama rekabeti başlatır"],
        numbered:true },
      { heading:"Uyarı Havlaması Yönetimi",
        content:"",
        list:["Teşekkür edin: 'İyi köpek, gördüm.' → sessizlik ödülü","Görsel uyaranı engelleyin (pencere filmi)","Desensitizasyon: kayıt sesini düşük sesle çalın + ödül"] },
      { heading:"Dikkat Havlaması — Ne Yapmamalı?",
        content:"",
        list:["ASLA yanına gitmeyin havlarken","ASLA bağırmayın veya 'Hayır!' demeyim — bu dikkat","Tam görmezden gelin → hareketsiz, sessiz durun","Sessiz olduğu anda dikkat verin"],
        tip:"Havlamayı besleyen en büyük faktör tutarsız tepkidir. Bir gün görmezden gelip bir gün reaksiyon vermek davranışı pekiştirir — aile içinde herkes aynı protokolü uygulamalı." }
    ],
    related:["yalniz-kalma-kaygisi","temel-komutlar","isirma-davranisi"]
  },

  /* ─── 8 YENİ ─── */
  {
    slug:"yalniz-kalma-kaygisi", emoji:"😰", tag:"Davranış Eğitimi", cat:"Davranış", difficulty:"Orta",
    ageGroups:["genç","yetişkin"], min:9, date:"2026-04-10", updated:"2026-06-15",
    author:"Dr. Zeynep Acar", role:"Veteriner Davranış Uzmanı",
    title:"Poodle Yalnız Kalma Kaygısı: Belirtiler ve Çözüm Protokolü",
    intro:"Poodle'lar sosyal ve bağlı bir ıraktır; ayrılık anksiyetesi bu ırkta sık görülür. Erken tespit ve sistematik yaklaşımla büyük çoğunluğu çözülebilir.",
    sections:[
      { heading:"Belirtiler",
        content:"",
        list:["Kapı veya pencere önünde sürekli bekleme","Aşırı havlama ve uluma (yalnız kaldığında)","Eşya çiğneme (özellikle sahip eşyaları)","Sizi her odaya takip etme","İshal veya kusma (anksiyete kaynaklı)","Kapı, pencere veya kafese kaçma girişimi"] },
      { heading:"Hafif Kaygı: Ev Tedbirleri",
        content:"",
        list:["Ayrılış ritüeli yaratmayın — sessizce gidin","Dönüşte coşkuyla karşılamayın (2 dk bekleyin)","KONG oyuncağı: donmuş PB veya yoğurtla","Adaptil diffuser veya collar (feromonlar)","Gündüz egzersizi: yorgun köpek daha sakin bekler"] },
      { heading:"Desensitizasyon Protokolü",
        content:"2–8 hafta sürer; en kalıcı sonucu bu verir:",
        list:["Kapıya gidin, açmayın, geri dönün","Kapıyı açın, 3 sn dışarıda durun, geri gelin","Tamamen çıkın, 10 sn bekleyin","5 dk → 15 dk → 1 saat → 2 saat artırın","Köpek rahatsa ilerleyin; değilse geri adım atın"],
        numbered:true },
      { heading:"Ne Zaman Profesyonel Yardım?",
        content:"",
        list:["4 haftalık ev terapisine yanıt yoksa","Köpek kendine zarar veriyorsa","Sürekli 2 saat üzeri uluyor/havlıyorsa","Giderek kötüleşiyorsa — veteriner davranış uzmanı"],
        tip:"Güvenlik kamerası kurun — yalnız kaldığında gerçekten ne olduğunu görünce doğru protokolü seçersiniz. Bazen sandığınızdan çok daha sakin veya çok daha stresli." }
    ],
    related:["havlama-kontrolu","sosyallesme","temel-komutlar"]
  },

  /* ─── 9 YENİ ─── */
  {
    slug:"isirma-davranisi", emoji:"😬", tag:"Davranış Eğitimi", cat:"Davranış", difficulty:"Orta",
    ageGroups:["yavru","genç"], min:7, date:"2026-05-01", updated:"2026-06-18",
    author:"Dr. Zeynep Acar", role:"Veteriner Davranış Uzmanı",
    title:"Poodle'da Isırma Davranışı: Kontrol ve Çözüm",
    intro:"Yavru köpeklerde ısırma (mouthing) normal gelişimsel davranıştır. Ancak yetişkin köpekte süregelen ısırma veya saldırganlık kökenli ısırma farklı müdahale gerektirir.",
    sections:[
      { heading:"Yavru Isırması (Mouthing) — Normal mi?",
        content:"",
        list:["Evet — dünya bunu keşfeder; oyun dili budur","Sorun: ne kadar sert ısırabileceğini öğrenmemiş","Isırma baskısı kontrolü (bite inhibition) öğretilmeli"] },
      { heading:"Isırma Baskısı Öğretimi",
        content:"",
        list:["Sert ısırırsa: 'Ay!' deyin + tüm etkileşimi durdurun","30 sn görmezden gelin","Tekrar başlayın — nazikse devam et","Farkında olmadan ödüllendirme: ısırma = oyun devam ediyor"],
        numbered:true },
      { heading:"Yönlendirme Tekniği",
        content:"",
        list:["Elinize geldiğinde oyuncağa yönlendirin","Daima uygun çiğneme materyali sunun","Sert lastik oyuncaklar, soğutulmuş buz oyuncakları","Elle ilgisini çekip oyuncağa geçirin"] },
      { heading:"Yetişkin Köpekte Isırma",
        content:"",
        list:["Korku bazlı ısırma: kaynağı belirleyin, güven inşa edin","Kaynak koruma: eğitimle yönetilir (ama uzman şart)","Ağrı kaynaklı: önce veteriner muayenesi","Territorial: erken müdahale kritik"] },
      { heading:"Ne Zaman Profesyonel Şart?",
        content:"",
        list:["Yetişkin köpek baskısız ısırıyorsa","Kan çıkaran ısırma olmuşsa","Uyarısız saldırı varsa","Belirli kişilere (çocuk, misafir) yönelikse"],
        tip:"Isırmayı fiziksel cezayla durdurmaya çalışmayın — güveni kaybedersiniz ve ısırma artabilir. Negatif pekiştirme burada kesinlikle kontraendike." }
    ],
    related:["tuvalet-egitimi","sosyallesme","yalniz-kalma-kaygisi"]
  },
];

/* ─── Yaş Grupları ────────────────────────────────────── */
const STAGES = [
  { label:"Yavru (0–6 ay)", age:"yavru" as AgeGroup, color:"#FFB347",
    tips:[
      { text:"Tuvalet eğitimi",   slug:"tuvalet-egitimi" },
      { text:"Isırma kontrolü",   slug:"isirma-davranisi" },
      { text:"Sosyalleşme",      slug:"sosyallesme" },
      { text:"Bakım rutinine alıştırma", slug:"bakim-rutini-egitimi" },
    ]},
  { label:"Genç (6–18 ay)", age:"genç" as AgeGroup, color:"#A67C52",
    tips:[
      { text:"Temel komutlar",    slug:"temel-komutlar" },
      { text:"Clicker eğitimi",  slug:"clicker-egitimi" },
      { text:"Havlama kontrolü", slug:"havlama-kontrolu" },
      { text:"Yalnız kalma",     slug:"yalniz-kalma-kaygisi" },
    ]},
  { label:"Yetişkin (1–7 yaş)", age:"yetişkin" as AgeGroup, color:"#34D399",
    tips:[
      { text:"Agility",          slug:"agility-egitimi" },
      { text:"İleri clicker",    slug:"clicker-egitimi" },
      { text:"Davranış sorunları",slug:"havlama-kontrolu" },
      { text:"Komut pekiştirme", slug:"temel-komutlar" },
    ]},
];

/* ─── 4 Haftalık Program ─────────────────────────────── */
const WEEKS = [
  { week:1, title:"Otur + İsim Tanıma",   tasks:["Günde 2×10 dk antrenman","İsim öğretme (seslenince bak + ödül)","Otur komutunu pekiştir (20–30 tekrar)","Ödüllü dokunma egzersizleri"] },
  { week:2, title:"Gel + Bırak",           tasks:["Gel komutunu ev içinde öğret","Bırak komutunu tanıt","İsim + gel kombinasyonu","Kısa tasma yürüyüşü"] },
  { week:3, title:"Bekle + Dur",           tasks:["Bekle (5→30 sn artırın)","Dur komutunu öğret","Gel + bekle kombinasyonu","Farklı odada komut ver"] },
  { week:4, title:"Pekiştirme + Yeni Ortam",tasks:["Park veya bahçede tekrar","Dikkat dağıtıcıyla çalış","Tüm komutları bağlayın","Yeni biri veriyor: genelleme"] },
];

/* ─── FAQ ─────────────────────────────────────────────── */
const FAQS = [
  { q:"Toy Poodle tuvalet eğitimi ne kadar sürer?",    a:"Genellikle 2–4 hafta içinde temel alışkanlık oluşur. Tutarlılık süreci belirler." },
  { q:"Poodle günde ne kadar eğitim yapmalı?",         a:"10 dakikalık kısa ve pozitif seanslar idealdir. Uzun seanslar dikkat dağıtır." },
  { q:"Poodle kaç haftada temel komutları öğrenir?",  a:"Otur, gel, bırak komutları 4 haftalık düzenli programla öğretilebilir." },
  { q:"Poodle neden çok havlar?",                     a:"Dikkat, kaygı veya sıkıntı belirtisi olabilir. Neden tespit edilmeden çözüm olmaz." },
  { q:"Poodle yalnız kalamıyor, ne yapmalıyım?",      a:"Kademeli ayrılma eğitimi ve desensitizasyon protokolü etkili. Şiddetliyse veteriner davranış uzmanı." },
];

/* ─── Davranış Sorunları ──────────────────────────────── */
const BEHAVIOR_ISSUES = [
  { emoji:"🔊", title:"Havlama Kontrolü",    slug:"havlama-kontrolu",    color:"#FFF7ED", accent:"#EA580C" },
  { emoji:"😰", title:"Yalnız Kalma Kaygısı",slug:"yalniz-kalma-kaygisi",color:"#FAF7F0", accent:"#8B5E34" },
  { emoji:"😬", title:"Isırma Davranışı",    slug:"isirma-davranisi",    color:"#FFF1F2", accent:"#EF4444" },
  { emoji:"😤", title:"Aşırı Heyecan",       slug:"sosyallesme",         color:"#F0FDF4", accent:"#16A34A" },
];

/* ─── Article Detail ─────────────────────────────────── */
function ArticleDetail({ article, onClose, allArticles, onOpenBySlug }: {
  article: Article; onClose: ()=>void; allArticles: Article[]; onOpenBySlug:(slug:string)=>void;
}) {
  const [liked, setLiked] = useState(()=>{ try { return !!localStorage.getItem("yp_eg_liked_"+article.slug); } catch { return false; } });
  const [, navigate] = useLocation();

  const toggleLike = () => {
    const next = !liked; setLiked(next);
    try { next ? localStorage.setItem("yp_eg_liked_"+article.slug,"1") : localStorage.removeItem("yp_eg_liked_"+article.slug); } catch {}
  };
  const share = () => {
    const url = window.location.origin+"/yourpoodle/egitim?a="+article.slug;
    if (navigator.share) navigator.share({title:article.title,url}).catch(()=>{});
    else navigator.clipboard.writeText(url).then(()=>alert("Bağlantı kopyalandı!")).catch(()=>{});
  };

  const related = allArticles.filter(a=>article.related.includes(a.slug)).slice(0,3);

  useEffect(()=>{
    const schemas: object[] = [{
      "@context":"https://schema.org","@type":"Article",
      "headline":article.title,"datePublished":article.date,"dateModified":article.updated,
      "author":{"@type":"Person","name":article.author,"jobTitle":article.role},
      "publisher":{"@type":"Organization","name":"YourPoodle","url":"https://www.yourpoodle.com"},
    }];
    if (article.isHowTo) {
      const steps = article.sections.filter(s=>s.numbered&&s.list).flatMap(s=>s.list||[]);
      schemas.push({
        "@context":"https://schema.org","@type":"HowTo",
        "name":article.title,"description":article.intro,
        "step":steps.map((t,i)=>({"@type":"HowToStep","position":i+1,"text":t})),
      });
    }
    const id="yp-eg-art-schema";
    const el=document.getElementById(id);
    const txt=schemas.map(s=>JSON.stringify(s)).join("\n");
    if(el) el.textContent=txt;
    else { const sc=document.createElement("script"); sc.id=id; sc.type="application/ld+json"; sc.textContent=txt; document.head.appendChild(sc); }
    return ()=>{ document.getElementById(id)?.remove(); };
  },[article]);

  const dc = DIFF_COLOR[article.difficulty];

  return (
    <div style={{ position:"fixed", inset:0, zIndex:500, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.45)" }}/>
      <div className="egitim-modal-inner" style={{ position:"relative", background:"#fff", borderRadius:20, maxWidth:680, width:"calc(100% - 24px)", maxHeight:"93vh", display:"flex", flexDirection:"column", overflow:"hidden", boxShadow:"0 32px 80px rgba(0,0,0,0.22)" }}>
        {/* Top bar */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 18px 10px", borderBottom:"1px solid #f2f2f2", flexShrink:0 }}>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:6, color:"#555", fontSize:13.5, fontWeight:700 }}>
            <ArrowLeft size={15} strokeWidth={2.5}/> Geri
          </button>
          <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:11 }}>
            <span style={{ cursor:"pointer", color:"#0D9488" }} onClick={onClose}>Eğitim</span>
            <ChevronRight size={10} color="#ccc"/>
            <span style={{ background:"#CCFBF1", color:"#0D9488", padding:"2px 8px", borderRadius:20, fontWeight:700 }}>{article.tag}</span>
            <span style={{ background:dc+"22", color:dc, padding:"2px 8px", borderRadius:20, fontWeight:700 }}>{article.difficulty}</span>
          </div>
          <div style={{ display:"flex", gap:6 }}>
            <button onClick={toggleLike} style={{ background:"none", border:"none", cursor:"pointer", padding:4 }}>
              <Heart size={20} color={liked?"#FF4566":"#ccc"} fill={liked?"#FF4566":"none"} strokeWidth={2}/>
            </button>
            <button onClick={share} style={{ background:"none", border:"none", cursor:"pointer", padding:4 }}>
              <Share2 size={20} color="#ccc" strokeWidth={2}/>
            </button>
          </div>
        </div>

        <div style={{ overflowY:"auto", padding:"20px 24px 48px" }}>
          {/* Hero */}
          <div style={{ background:"linear-gradient(135deg,#CCFBF1,#fff)", borderRadius:16, padding:"22px 20px 18px", marginBottom:18, textAlign:"center" }}>
            <div style={{ fontSize:50, marginBottom:10 }}>{article.emoji}</div>
            <h1 style={{ fontSize:19, fontWeight:900, color:"#111", lineHeight:1.35, margin:0 }}>{article.title}</h1>
          </div>
          {/* Meta */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20, paddingBottom:16, borderBottom:"1px solid #f2f2f2", flexWrap:"wrap" }}>
            <div style={{ width:38, height:38, borderRadius:"50%", background:"#CCFBF1", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>🎓</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12.5, fontWeight:700, color:"#222" }}>{article.author}</div>
              <div style={{ fontSize:11, color:"#888" }}>{article.role}</div>
            </div>
            <div style={{ display:"flex", gap:10, fontSize:11, color:"#aaa" }}>
              <span style={{ display:"flex", alignItems:"center", gap:3 }}><Clock size={11} strokeWidth={2}/>{article.min} dk</span>
              <span>📅 {article.updated.split("-")[0]}</span>
            </div>
          </div>
          {/* Intro */}
          <p style={{ fontSize:14.5, color:"#444", lineHeight:1.8, marginBottom:22, fontStyle:"italic" }}>{article.intro}</p>
          {/* Sections */}
          {article.sections.map((sec,i)=>(
            <div key={i} style={{ marginBottom:22 }}>
              {sec.heading && <h3 style={{ fontSize:15.5, fontWeight:800, color:"#111", marginBottom:10, paddingBottom:6, borderBottom:"2px solid #CCFBF1" }}>{sec.heading}</h3>}
              {sec.content && <p style={{ fontSize:14, color:"#555", lineHeight:1.8, marginBottom:sec.list?10:0 }}>{sec.content}</p>}
              {sec.list && (
                <ul style={{ margin:0, paddingLeft:0, listStyle:"none" }}>
                  {sec.list.map((item,j)=>(
                    <li key={j} style={{ display:"flex", gap:9, fontSize:13.5, color:"#444", lineHeight:1.65, marginBottom:6 }}>
                      <span style={{ color:"#0D9488", fontWeight:700, flexShrink:0, marginTop:1 }}>{sec.numbered?`${j+1}.`:"•"}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {sec.tip && (
                <div style={{ marginTop:14, padding:"13px 16px", background:"#F0FDFA", borderRadius:12, borderLeft:"3px solid #0D9488" }}>
                  <div style={{ fontSize:11, fontWeight:800, color:"#0D9488", marginBottom:5 }}>💡 EĞİTMEN TAVSİYESİ</div>
                  <div style={{ fontSize:13, color:"#555", lineHeight:1.65 }}>{sec.tip}</div>
                </div>
              )}
            </div>
          ))}
          {/* AI CTA */}
          <div style={{ marginTop:20, padding:"14px 16px", background:"#F0FDFA", borderRadius:12, display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:24 }}>🤖</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#111", marginBottom:4 }}>Eğitim sorunuzu AI'a sorun</div>
              <div style={{ fontSize:12, color:"#888" }}>YourPoodle AI Asistan 7/24 yardıma hazır</div>
            </div>
            <button onClick={()=>navigate("/yourpoodle/ai-asistan")}
              style={{ padding:"8px 14px", borderRadius:20, border:"none", background:"#0D9488", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", flexShrink:0 }}>
              Sor →
            </button>
          </div>
          {/* Related */}
          {related.length>0 && (
            <div style={{ marginTop:28, paddingTop:22, borderTop:"1px solid #f2f2f2" }}>
              <div style={{ fontSize:13, fontWeight:800, color:"#333", marginBottom:12 }}>📖 İlgili Makaleler</div>
              <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
                {related.map(r=>(
                  <button key={r.slug}
                    onClick={()=>{ onOpenBySlug(r.slug); onClose(); }}
                    style={{ display:"flex", gap:12, alignItems:"center", padding:"11px", background:"#FAFAFA", borderRadius:12, cursor:"pointer", border:"1.5px solid #F3F4F6", textAlign:"left", width:"100%" }}>
                    <div style={{ fontSize:22, width:42, height:42, background:"#CCFBF1", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{r.emoji}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:10.5, fontWeight:700, color:"#0D9488", marginBottom:3 }}>{r.tag}</div>
                      <div style={{ fontSize:13, fontWeight:700, color:"#111", lineHeight:1.4 }}>{r.title}</div>
                    </div>
                    <ChevronRight size={14} color="#ccc"/>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


/* ─── Main Page ──────────────────────────────────────── */
export default function Egitim() {
  const [, navigate]         = useLocation();
  const [selected, setSelected]       = useState<Article|null>(null);
  const [activeStage, setActiveStage] = useState(0);
  const [activeCat, setActiveCat]     = useState("Tümü");
  const [activeDiff, setActiveDiff]   = useState<typeof DIFF_FILTERS[number]>("Tümü");
  const [search, setSearch]           = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number|null>(null);

  /* 4-week program checklist — localStorage */
  const [weekDone, setWeekDone] = useState<Record<string,boolean>>(()=>{
    try { return JSON.parse(localStorage.getItem("yp_eg_weeks")||"{}"); } catch { return {}; }
  });
  const toggleWeek = (key:string) => setWeekDone(p=>{
    const n={...p,[key]:!p[key]};
    try { localStorage.setItem("yp_eg_weeks",JSON.stringify(n)); } catch {}
    return n;
  });

  /* SEO */
  useEffect(()=>{
    document.title = PAGE_TITLE;
    const m=(attr:string,key:string,val:string)=>{
      let el=document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement|null;
      if(!el){el=document.createElement("meta");el.setAttribute(attr,key);document.head.appendChild(el);}
      el.content=val;
    };
    m("property","og:title",PAGE_OG_TITLE);
    m("property","og:description",PAGE_DESC);
    m("property","og:type","website");
    m("property","og:url","https://www.yourpoodle.com/yourpoodle/egitim");
    m("name","description",PAGE_DESC);
  },[]);

  /* URL param */
  useEffect(()=>{
    const slug=new URLSearchParams(window.location.search).get("a");
    if(slug){ const f=ARTICLES.find(a=>a.slug===slug); if(f) setSelected(f); }
  },[]);

  const openArticle = useCallback((a:Article)=>{
    setSelected(a);
    window.history.pushState({},"","/yourpoodle/egitim?a="+a.slug);
  },[]);
  const openBySlug = useCallback((slug:string)=>{
    const f=ARTICLES.find(a=>a.slug===slug);
    if(f){ setSelected(f); window.history.pushState({},"","/yourpoodle/egitim?a="+slug); }
  },[]);
  const closeArticle = useCallback(()=>{
    setSelected(null);
    window.history.pushState({},"","/yourpoodle/egitim");
  },[]);

  /* Filtering */
  const currentAge = STAGES[activeStage].age;
  const filtered = ARTICLES.filter(a=>{
    const ageOk  = a.ageGroups.includes(currentAge);
    const catOk  = activeCat==="Tümü" || a.cat===activeCat;
    const diffOk = activeDiff==="Tümü" || a.difficulty===activeDiff;
    const srchOk = search===""||a.title.toLowerCase().includes(search.toLowerCase());
    return ageOk && catOk && diffOk && srchOk;
  });

  /* Schemas */
  const courseSchema = {
    "@context":"https://schema.org","@type":"Course",
    "name":"Toy Poodle 4 Haftalık Temel Komut Programı",
    "description":"Otur, gel, bırak, bekle komutlarını 4 haftada öğretin",
    "provider":{"@type":"Organization","name":"YourPoodle"},
    "hasCourseInstance":{"@type":"CourseInstance","courseMode":"online","duration":"P4W"},
  };
  const itemListSchema = {
    "@context":"https://schema.org","@type":"ItemList",
    "name":"Poodle Eğitim Yazıları","numberOfItems":ARTICLES.length,
    "itemListElement":ARTICLES.map((a,i)=>({
      "@type":"ListItem","position":i+1,
      "url":`https://www.yourpoodle.com/yourpoodle/egitim?a=${a.slug}`,"name":a.title,
    })),
  };
  const faqSchema = {
    "@context":"https://schema.org","@type":"FAQPage",
    "mainEntity":FAQS.map(f=>({
      "@type":"Question","name":f.q,
      "acceptedAnswer":{"@type":"Answer","text":f.a},
    })),
  };
  const webPageSchema = {
    "@context":"https://schema.org","@type":"WebPage",
    "name":"Poodle Eğitim Rehberi","description":PAGE_DESC,
    "url":"https://www.yourpoodle.com/yourpoodle/egitim",
    "datePublished":"2025-06-01","dateModified":"2026-06-18",
    "publisher":{"@type":"Organization","name":"YourPoodle","url":"https://www.yourpoodle.com"},
  };

  const stageColor = STAGES[activeStage].color;

  return (
    <YPLayout activeLink="/yourpoodle/egitim" bottomNavActive="/yourpoodle/rehber">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}/>

      <style>{`
        .art-row-egitim:hover { background:#F0FDF4 !important; border-color:#BBF7D0 !important; }
        .noscroll-eg::-webkit-scrollbar { display:none; }
        .noscroll-eg { -ms-overflow-style:none; scrollbar-width:none; }
        .beh-card:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,0.1); }
        .beh-card { transition:all 0.2s; }
        @media (min-width: 640px) {
          .egitim-art-grid { display:grid !important; grid-template-columns:1fr 1fr !important; gap:14px !important; }
          .egitim-stages   { display:flex; flex-direction:row !important; gap:10px; }
          .egitim-stages button { flex:1; }
          .egitim-beh-grid { display:grid !important; grid-template-columns:1fr 1fr !important; gap:12px !important; }
          .egitim-week-grid { display:grid !important; grid-template-columns:1fr 1fr !important; gap:12px !important; }
        }
        @media (max-width: 639px) {
          .egitim-modal-inner { border-radius:16px 16px 0 0 !important; position:fixed !important; bottom:0 !important; top:auto !important; left:0 !important; right:0 !important; width:100% !important; max-width:100% !important; max-height:92vh !important; }
        }
      `}</style>

      {selected && <ArticleDetail article={selected} onClose={closeArticle} allArticles={ARTICLES} onOpenBySlug={openBySlug}/>}

      {/* ── Hero ── */}
      <div style={{ background:"linear-gradient(135deg,#0D9488,#34D399)", padding:"28px 24px 32px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-30, right:-20, width:130, height:130, borderRadius:"50%", background:"rgba(255,255,255,0.1)" }}/>
        <div style={{ position:"absolute", bottom:-20, left:-10, width:80, height:80, borderRadius:"50%", background:"rgba(255,255,255,0.07)" }}/>
        <div style={{ fontSize:40, marginBottom:10 }}>🎓</div>
        <h1 style={{ fontSize:26, fontWeight:900, color:"#fff", marginBottom:6, lineHeight:1.2 }}>Poodle Eğitim Rehberi</h1>
        <p style={{ fontSize:14, color:"rgba(255,255,255,0.9)", lineHeight:1.5, margin:0 }}>Poodle'ınızın zekasını en iyi şekilde kullanın</p>
        <div style={{ display:"flex", gap:24, marginTop:16, flexWrap:"wrap" }}>
          {[["#1","En Zeki Köpek Irkı"],["10 dk","Günlük Antrenman"],["4 Hafta","Temel Komutlar"],["9","Makale"]].map(([n,l])=>(
            <div key={l}>
              <div style={{ fontSize:15, fontWeight:900, color:"#fff" }}>{n}</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.75)" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Hızlı Cevaplar ── */}
      <div style={{ padding:"20px 16px 0" }}>
        <div style={{ fontSize:15, fontWeight:800, color:"#1a1a1a", marginBottom:12 }}>💡 Hızlı Cevaplar</div>
        <div style={{ background:"#fff", borderRadius:16, border:"1.5px solid #D1FAE5", overflow:"hidden" }}>
          {FAQS.map((f,i)=>(
            <div key={i} style={{ borderBottom:i<FAQS.length-1?"1px solid #ECFDF5":"none" }}>
              <button onClick={()=>setExpandedFaq(expandedFaq===i?null:i)}
                style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 16px", background:"none", border:"none", cursor:"pointer", textAlign:"left", gap:10 }}>
                <span style={{ fontSize:13.5, fontWeight:700, color:"#1a1a1a", lineHeight:1.4 }}>S: {f.q}</span>
                <span style={{ fontSize:16, color:"#0D9488", flexShrink:0, lineHeight:1 }}>{expandedFaq===i?"−":"+"}</span>
              </button>
              {expandedFaq===i && (
                <div style={{ padding:"0 16px 14px", fontSize:13.5, color:"#555", lineHeight:1.7 }}>
                  <span style={{ fontWeight:700, color:"#0D9488" }}>C: </span>{f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Yaşa Göre Eğitim ── */}
      <div style={{ padding:"20px 16px 0" }}>
        <h2 style={{ fontSize:15, fontWeight:800, color:"#1a1a1a", marginBottom:12 }}>📅 Yaşa Göre Eğitim</h2>
        <div className="egitim-stages" style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:14 }}>
          {STAGES.map((s,i)=>(
            <button key={i} onClick={()=>setActiveStage(i)}
              style={{ padding:"10px 14px", borderRadius:10, border:"2px solid", borderColor:activeStage===i?s.color:"#e8e8e8", background:activeStage===i?s.color+"22":"#fff", fontSize:13, fontWeight:700, color:activeStage===i?s.color:"#555", cursor:"pointer", textAlign:"left" }}>
              {s.label}
            </button>
          ))}
        </div>
        <div style={{ background:stageColor+"11", borderRadius:14, padding:"14px 16px", marginBottom:4 }}>
          <div style={{ fontSize:12, fontWeight:700, color:"#888", marginBottom:10 }}>
            Bu yaş grubu için önerilen konular ({filtered.length} makale):
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
            {STAGES[activeStage].tips.map(t=>(
              <button key={t.slug} onClick={()=>openBySlug(t.slug)}
                style={{ display:"flex", alignItems:"center", gap:10, background:"none", border:"none", cursor:"pointer", padding:"6px 4px", textAlign:"left" }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:stageColor, flexShrink:0 }}/>
                <span style={{ fontSize:13.5, color:"#0D9488", fontWeight:600, textDecoration:"underline", textDecorationStyle:"dotted" }}>{t.text}</span>
                <ChevronRight size={13} color={stageColor} style={{ flexShrink:0, marginLeft:"auto" }}/>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Eğitim Yazıları ── */}
      <div style={{ padding:"20px 16px 0" }}>
        <h2 style={{ fontSize:15, fontWeight:800, color:"#1a1a1a", marginBottom:12 }}>📖 Eğitim Yazıları</h2>
        {/* Search */}
        <div style={{ display:"flex", alignItems:"center", background:"#F7F7F7", border:"1.5px solid #ececec", borderRadius:14, height:46, overflow:"hidden", marginBottom:10 }}>
          <div style={{ paddingLeft:13, color:"#bbb", display:"flex" }}><Search size={16} strokeWidth={2}/></div>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Eğitim konusu ara..."
            style={{ flex:1, border:"none", outline:"none", fontSize:14, fontWeight:600, color:"#333", background:"transparent", padding:"0 11px" }}/>
          {search && <button onClick={()=>setSearch("")} style={{ background:"none", border:"none", cursor:"pointer", paddingRight:11, color:"#bbb" }}><X size={14} strokeWidth={2}/></button>}
        </div>
        {/* Category pills */}
        <div style={{ position:"relative", marginBottom:8 }}>
          <div className="noscroll-eg" style={{ display:"flex", gap:7, overflowX:"auto", paddingBottom:2, paddingRight:10 }}>
            {ARTICLE_CATS.map(c=>(
              <button key={c} onClick={()=>setActiveCat(c)}
                style={{ flexShrink:0, padding:"5px 13px", borderRadius:20, border:"1.5px solid", borderColor:activeCat===c?"#0D9488":"#e8e8e8", background:activeCat===c?"#0D9488":"#fff", color:activeCat===c?"#fff":"#555", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                {c}
              </button>
            ))}
          </div>
        </div>
        {/* Difficulty pills */}
        <div style={{ display:"flex", gap:7, marginBottom:14, flexWrap:"wrap" }}>
          {DIFF_FILTERS.map(d=>(
            <button key={d} onClick={()=>setActiveDiff(d)}
              style={{ padding:"4px 12px", borderRadius:20, border:"1.5px solid", borderColor:activeDiff===d?(d==="Tümü"?"#0D9488":DIFF_COLOR[d as Difficulty]||"#0D9488"):"#e8e8e8", background:activeDiff===d?"transparent":"#fff", color:activeDiff===d?(d==="Tümü"?"#0D9488":DIFF_COLOR[d as Difficulty]||"#0D9488"):"#888", fontSize:11, fontWeight:700, cursor:"pointer" }}>
              {d==="Tümü"?"Tüm Seviyeler":d}
            </button>
          ))}
        </div>
        {/* Articles */}
        {filtered.length===0 ? (
          <div style={{ textAlign:"center", padding:"36px 20px" }}>
            <div style={{ fontSize:36, marginBottom:10 }}>🔍</div>
            <div style={{ fontSize:14, fontWeight:700, color:"#555", marginBottom:5 }}>Bu kriterlere uygun makale bulunamadı</div>
            <button onClick={()=>{ setSearch(""); setActiveCat("Tümü"); setActiveDiff("Tümü"); }}
              style={{ marginTop:10, padding:"9px 22px", borderRadius:20, background:"#0D9488", color:"#fff", border:"none", cursor:"pointer", fontSize:13, fontWeight:700 }}>
              Tümünü Göster
            </button>
          </div>
        ) : (
          <div className="egitim-art-grid" style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {filtered.map(a=>{
              const dc=DIFF_COLOR[a.difficulty];
              return (
                <button key={a.slug} className="art-row-egitim" onClick={()=>openArticle(a)}
                  style={{ display:"flex", gap:13, alignItems:"center", padding:"13px", background:"#FAFAFA", borderRadius:14, cursor:"pointer", border:"1.5px solid #F3F4F6", textAlign:"left", width:"100%", transition:"all 0.15s" }}>
                  <div style={{ width:56, height:56, borderRadius:13, background:"#CCFBF1", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>{a.emoji}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", gap:6, marginBottom:4, flexWrap:"wrap" }}>
                      <span style={{ fontSize:10, fontWeight:700, color:"#0D9488" }}>{a.tag}</span>
                      <span style={{ fontSize:10, fontWeight:700, color:dc, background:dc+"22", borderRadius:4, padding:"0 5px" }}>{a.difficulty}</span>
                    </div>
                    <div style={{ fontSize:13.5, fontWeight:700, color:"#1a1a1a", lineHeight:1.4, marginBottom:4 }}>{a.title}</div>
                    <div style={{ fontSize:11, color:"#aaa", display:"flex", alignItems:"center", gap:3 }}><Clock size={10} strokeWidth={2}/>{a.min} dk</div>
                  </div>
                  <ChevronRight size={16} color="#ccc" style={{ flexShrink:0 }}/>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Davranış Sorunları ── */}
      <div style={{ padding:"24px 16px 0" }}>
        <div style={{ fontSize:15, fontWeight:800, color:"#1a1a1a", marginBottom:12 }}>⚠️ Davranış Sorunları</div>
        <div className="egitim-beh-grid" style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {BEHAVIOR_ISSUES.map(b=>(
            <button key={b.slug} className="beh-card" onClick={()=>openBySlug(b.slug)}
              style={{ background:b.color, borderRadius:14, padding:"16px", border:"none", cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ fontSize:28, flexShrink:0 }}>{b.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:800, color:"#111" }}>{b.title}</div>
                <div style={{ fontSize:11, color:b.accent, fontWeight:700, marginTop:3 }}>Makaleye git →</div>
              </div>
              <ChevronRight size={16} color={b.accent}/>
            </button>
          ))}
        </div>
      </div>

      {/* ── 4 Haftalık Program ── */}
      <div style={{ padding:"24px 16px 0" }}>
        <div style={{ fontSize:15, fontWeight:800, color:"#1a1a1a", marginBottom:4 }}>📋 4 Haftalık Temel Komut Programı</div>
        <div style={{ fontSize:12, color:"#888", marginBottom:14 }}>Hangi haftadasınız? Tamamladığınız görevleri işaretleyin.</div>
        <div className="egitim-week-grid" style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {WEEKS.map(w=>{
            const allDone = w.tasks.every((_,i)=>weekDone[`${w.week}-${i}`]);
            return (
              <div key={w.week} style={{ background:allDone?"#F0FDF4":"#fff", borderRadius:14, padding:"14px 16px", border:`1.5px solid ${allDone?"#BBF7D0":"#e8e8e8"}` }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                  <div style={{ width:28, height:28, borderRadius:"50%", background:allDone?"#16A34A":"#0D9488", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:12, fontWeight:900, flexShrink:0 }}>
                    {allDone?"✓":w.week}
                  </div>
                  <div>
                    <div style={{ fontSize:12, fontWeight:800, color:"#888" }}>HAFTA {w.week}</div>
                    <div style={{ fontSize:13.5, fontWeight:800, color:"#111" }}>{w.title}</div>
                  </div>
                </div>
                {w.tasks.map((t,i)=>{
                  const key=`${w.week}-${i}`;
                  return (
                    <button key={i} onClick={()=>toggleWeek(key)}
                      style={{ display:"flex", alignItems:"center", gap:9, width:"100%", background:"none", border:"none", cursor:"pointer", padding:"5px 0", textAlign:"left" }}>
                      {weekDone[key]
                        ? <CheckCircle2 size={16} color="#16A34A" strokeWidth={2} style={{ flexShrink:0 }}/>
                        : <Circle size={16} color="#ddd" strokeWidth={2} style={{ flexShrink:0 }}/>}
                      <span style={{ fontSize:12.5, color:weekDone[key]?"#16A34A":"#444", textDecoration:weekDone[key]?"line-through":"none", fontWeight:weekDone[key]?600:400 }}>{t}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CTAs ── */}
      <div style={{ padding:"24px 16px 0", display:"flex", flexDirection:"column", gap:14 }}>
        {/* AI Asistan */}
        <div style={{ background:"linear-gradient(135deg,#F0FDFA,#CCFBF1)", borderRadius:18, padding:"18px 20px", display:"flex", gap:14, alignItems:"center" }}>
          <div style={{ fontSize:32, flexShrink:0 }}>🤖</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:800, color:"#111", marginBottom:3 }}>Eğitim Sorunuzu AI'a Sorun</div>
            <div style={{ fontSize:12, color:"#555", lineHeight:1.5 }}>YourPoodle AI Asistan 7/24 kişisel eğitim tavsiyesi verir.</div>
          </div>
          <button onClick={()=>navigate("/yourpoodle/ai-asistan")}
            style={{ height:38, borderRadius:20, border:"none", background:"#0D9488", color:"#fff", fontSize:13, fontWeight:800, padding:"0 18px", cursor:"pointer", flexShrink:0 }}>
            Sor →
          </button>
        </div>
        {/* Eğitim ürünleri */}
        <div style={{ background:"#F0FDF4", borderRadius:18, padding:"18px 20px", textAlign:"center" }}>
          <div style={{ fontSize:22, marginBottom:6 }}>🎯</div>
          <div style={{ fontSize:14, fontWeight:800, color:"#111", marginBottom:3 }}>Eğitim Ürünleri</div>
          <div style={{ fontSize:12, color:"#888", marginBottom:12 }}>Clicker, ödül maması, tasma ve daha fazlası.</div>
          <button onClick={()=>navigate("/yourpoodle/magaza?kategori=egitim")}
            style={{ height:40, borderRadius:12, border:"none", background:"#0D9488", color:"#fff", fontSize:13, fontWeight:800, padding:"0 22px", cursor:"pointer" }}>
            Eğitim Ürünleri →
          </button>
        </div>
        {/* Topluluk */}
        <div style={{ background:"#CCFBF1", borderRadius:18, padding:"18px 20px", textAlign:"center" }}>
          <div style={{ fontSize:22, marginBottom:6 }}>🐾</div>
          <div style={{ fontSize:14, fontWeight:800, color:"#111", marginBottom:3 }}>Topluluğa Katıl</div>
          <div style={{ fontSize:12, color:"#555", marginBottom:12 }}>Diğer Poodle sahipleriyle eğitim ipuçlarını paylaşın.</div>
          <button onClick={()=>navigate("/yourpoodle/club")}
            style={{ height:40, borderRadius:12, border:"none", background:"#0D9488", color:"#fff", fontSize:13, fontWeight:800, padding:"0 22px", cursor:"pointer" }}>
            Club'a Git
          </button>
        </div>
      </div>

      <div style={{ height:24 }}/>
    </YPLayout>
  );
}
