import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { ChevronRight, Clock, CheckCircle2, Circle, ArrowLeft, Heart, Share2, Search, X } from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";

/* ─── SEO ─────────────────────────────────────────────── */
const PAGE_TITLE = "Poodle Bakım Rehberi: Tıraş, Tüy Bakımı ve Grooming | YourPoodle";
const PAGE_DESC  = "Toy Poodle bakım rehberi: evde tıraş, haftalık tüy tarama, banyo sıklığı, pençe ve diş bakımı. Adım adım grooming rehberleri ve tıraş zamanlama aracı.";
const PAGE_OG_TITLE = "Poodle Bakım Rehberi: Tıraş, Tüy Bakımı ve Grooming | YourPoodle";

/* ─── ARTICLE DATA ─────────────────────────────────────── */
const ARTICLE_CATS = ["Tümü","Tıraş","Tüy Bakımı","Pençe","Kulak","Ağız","Banyo","Göz"];

const CAT_STYLE: Record<string,{bg:string;color:string}> = {
  "Tıraş":     {bg:"#FFE4EC",color:"#E75480"},
  "Tüy Bakımı":{bg:"#FDF4FF",color:"#9333EA"},
  "Pençe":     {bg:"#F0FDF4",color:"#16A34A"},
  "Kulak":     {bg:"#FFF7ED",color:"#EA580C"},
  "Ağız":      {bg:"#EFF6FF",color:"#2563EB"},
  "Banyo":     {bg:"#F0F9FF",color:"#0369A1"},
  "Göz":       {bg:"#FFF9EB",color:"#D97706"},
};

interface ArticleSection { heading?:string; content:string; list?:string[]; tip?:string; numbered?:boolean; }
interface Article {
  slug:string; emoji:string; tag:string; title:string; min:number;
  date:string; updated:string; author:string; role:string;
  intro:string; sections:ArticleSection[]; related:string[];
  isHowTo?: boolean;
}

const ARTICLES: Article[] = [
  /* ─── 1: Evde Tıraş ─── */
  {
    slug:"evde-poodle-tirasi", emoji:"✂️", tag:"Tıraş", min:10, isHowTo:true,
    date:"2026-01-12", updated:"2026-06-10",
    author:"Selin Demir", role:"Grooming Uzmanı",
    title:"Evde Poodle Tıraşı: Adım Adım Eksiksiz Rehber",
    intro:"Poodle tıraşı düzenli yapılması gereken bir bakım rutinidir. Profesyonel groomerlere her seferinde gidip gelmek yerine temel teknikleri öğrenerek evde uygulayabilirsiniz. Bu rehber başlangıç seviyesinden orta seviyeye kapsamlı kılavuz sunar.",
    sections:[
      { heading:"Neden Evde Tıraş?",
        content:"",
        list:["Groomer maliyetini yılda %40–60 azaltır","Köpeğinizle güven ilişkisi kurarsınız","Zamanlamayı siz kontrol edersiniz","Erken dönem deri/tüy sorunlarını fark edersiniz"] },
      { heading:"Gerekli Ekipmanlar",
        content:"Kaliteli alet yatırımı uzun vadede tasarruf sağlar:",
        list:["Slicker fırça (mat açmak için zorunlu)","Pim fırça (tüy ayrıştırma ve son tarama)","Profesyonel makas seti: düz + thinning (seyreltme) makas","Tıraş makinesi: Andis, Oster veya Wahl blade 5–10","Ayak makası (küçük, kıvrık uçlu)","Köpek şampuanı + conditioner","Matlaştırıcı / detangler sprey","Saç kurutma makinesi (yüksek debili tercih edin)","Paslanmaz metal tarak (ince ve geniş dişli)"] },
      { heading:"Adım 1: Tıraş Öncesi Hazırlık",
        content:"Tıraştan önce tüm matları açın — ıslak mat iyice sıkılaşır ve açmak çok zorlaşır.",
        list:["Slicker fırçayla katman katman tarayın","Mat spray ile dirençli bölgeleri yumuşatın","Kulak arkası, kasık ve koltuk altına özen gösterin","Mat çok büyükse kesin — acı vermek yerine temiz başlayın"],
        numbered:true },
      { heading:"Adım 2: Banyo",
        content:"",
        list:["38–40°C ılık suyla ıslatın (soğuk su tüy direncini artırır)","Poodle şampuanıyla 2 tur yıkayın","Conditioner uygulayın, 5–10 dk bekleyin","Bol suyla tam durulayın (kalıntı deri tahrişi yapar)","Havluyla ovuşturmadan fazla suyu alın"],
        numbered:true },
      { heading:"Adım 3: Kurutma",
        content:"Kurutma kalitesi tıraşın başarısını doğrudan etkiler.",
        list:["Fön makinesini orta ısıda, mesafeli tutun","Kurutma sırasında ters fırçalama yapın — tüy kabarmış ve hacimli durur","%100 kuru olduğundan emin olun (yarım kurutma kıvırcıklaşmaya neden olur)"],
        tip:"Kurutma sırasında ters fırçalama (against the grain) Poodle tüylerini kabarık tutar, makas için ideal yüzey oluşturur." },
      { heading:"Adım 4: Kulak Temizliği",
        content:"",
        list:["Kulak içini görünür kirden temizleyin (pamuk + kulak solüsyonu)","Kulak kanalına derin girmeyin","Kırmızılık, koku veya salgı varsa devam etmeyin — veterinere gidin","İç tüyleri 3–4 haftada bir groomer veya veteriner aldırır"],
        numbered:true },
      { heading:"Adım 5: Teddy Bear Kesim — Yüz ve Baş",
        content:"Teddy bear, günümüzde en yaygın tercih edilen Poodle tıraşıdır.",
        list:["Gözler önündeki tüyleri temizleyin — görmesini engellemesin","Yüzü yuvarlak şekle getirmek için makas kullanın","Kulaklar: tüyleri bırakın, uçlarını düzeltin","Baş üstü: hacimli bırakın, pompom görünümü için toparlayın"],
        numbered:true },
      { heading:"Adım 6: Vücut Şekillendirme",
        content:"",
        list:["Gövde: tıraş makinesiyle (blade 5–7) tabanı eşitleyin","Bacaklar: silindirik bırakın, uçları toparlayın","Kuyruk: pompom veya düz — tercihinize göre","Sırt hattı: iki omuz arasında düz hat çizin"],
        numbered:true },
      { heading:"Adım 7: Pençe ve Pati Bakımı",
        content:"",
        list:["Parmak aralarını ayak makasıyla temizleyin","Pati tabanı kaymaz tutmak için kısa kesin","Tırnakları kontrol edin — tıkırtı varsa kesin"],
        numbered:true },
      { heading:"Sık Yapılan Hatalar",
        content:"",
        list:["Kuru tüy tıraşı: makas kayar, eşit kesilmez","Matları açmadan banyoya girmek","Gözler önü tüyleri uzun bırakmak","Kulak kanalına derin girmek","Tırnakları çok kısa kesmek (quick'e ulaşabilir)"] },
      { heading:"Ne Zaman Profesyonel Groomere Gitmelisiniz?",
        content:"",
        list:["İlk birkaç tıraşı mutlaka profesyonele bırakın — köpeği alıştırın","Büyük mat oluşumlarında","Continental clip gibi karmaşık modellerde","Köpek strese giriyorsa veya ısırma belirtisi gösteriyorsa"] }
    ],
    related:["tuy-bakimi-haftalik-rutin","kulak-bakimi","pence-bakimi"]
  },

  /* ─── 2: Tüy Bakımı ─── */
  {
    slug:"tuy-bakimi-haftalik-rutin", emoji:"🛁", tag:"Tüy Bakımı", min:6,
    date:"2026-02-05", updated:"2026-05-15",
    author:"Selin Demir", role:"Grooming Uzmanı",
    title:"Poodle Tüy Bakımı: Haftalık Rutin Rehberi",
    intro:"Poodle tüyleri sürekli büyür, dökmez — bu alerjisi olanlar için avantaj, ama bakım sorumluluğu doğurur. Tutarlı bir haftalık rutin profesyonel grooming seansları arasındaki periyodu uzatır.",
    sections:[
      { heading:"Günlük Bakım (2–3 dk)",
        content:"",
        list:["Yüz çevresini ıslak mendille silin","Göz altı lekeleri varsa köpek göz mendiliyle temizleyin","Elle kısaca tarayın — mat kontrolü"] },
      { heading:"Haftada 3 Kez (15–20 dk)",
        content:"",
        list:["Slicker fırçayla tam tarama (kök→uç, katman katman)","Kulak içini kontrol edin — kırmızılık, koku, salgı?","Pati tabanlarını kontrol edin","Mat bulursa detangler sprey + açma"] },
      { heading:"2 Haftada 1: Banyo",
        content:"",
        list:["Poodle spesifik şampuan (pH 6.5–7.5)","Conditioner (kıvırcık tüy için şart)","Düşük–orta ısıda tam kurutma","Banyodan önce mat kontrolü yapın"],
        tip:"Slicker yerine pin fırça kullanırsanız tüyü kaldırır ama köklere ulaşamaz — mat açılmaz. Slicker'ı her zaman slicker ile kullanın." },
      { heading:"Aylık Bakım",
        content:"",
        list:["Kulak iç tüy kontrolü (groomer veya veteriner)","Tırnak kesimi","Diş fırçalama (tercihen haftada 3)","Tıraş randevusu (6–8 haftada)"] },
      { heading:"Doğru Fırça Seçimi",
        content:"",
        list:["Slicker fırça: mat açmak ve genel tarama için","Pim fırça: son parlatma ve kontrol için","Metal tarak (ince dişli): mat tespiti — tarak geçerse mat yok","Kenyon fırça: yoğun tüyde derine ulaşmak için"] }
    ],
    related:["evde-poodle-tirasi","banyo-rehberi","kulak-bakimi"]
  },

  /* ─── 3: Pençe ─── */
  {
    slug:"pence-bakimi", emoji:"🐾", tag:"Pençe", min:6,
    date:"2025-11-20", updated:"2026-04-01",
    author:"Selin Demir", role:"Grooming Uzmanı",
    title:"Poodle Pençe Bakımı: Nasıl ve Ne Zaman Kesilir?",
    intro:"Uzun tırnaklar Poodle'ların yürüyüş dengesini bozar ve eklem sorunlarına zemin hazırlar. Düzenli kesim hem konforu hem sağlığı korur.",
    sections:[
      { heading:"Ne Zaman Kesilmeli?",
        content:"",
        list:["Zeminde tıkırtı çıkarıyorsa — zaten geç","Her 3–4 haftada bir kontrol edin","Aktif koşan köpeklerde daha seyrek kesim gerekebilir","Sert zemin tırnakları doğal aşındırır"] },
      { heading:"Doğru Teknik",
        content:"",
        list:["Guillotine veya makas tipi kesici kullanın","Damarı (quick) kesmemek için küçük adımlarla kesin","Açık renkli tırnaklarda damar pembe bölge olarak görünür","Koyu tırnaklarda alt kısımdan bakın — gri/beyaz kesit noktayı gösterir","Kes, kontrol et, tekrar kes — acele etme"] },
      { heading:"Quick Kesilirse Ne Yapılır?",
        content:"",
        list:["Panik yapmayın — sık ama tehlikeli değil","Koagülasyon tozu (styptic powder) veya korner ile durdurun","Mısır nişastası acil alternatif olarak kullanılabilir","Köpeği sakinleştirin — devam etmeyin"] },
      { heading:"Pati Bakımı",
        content:"",
        list:["Parmak aralarını ayak makasıyla temizleyin (kaymaz tutar)","Kışın pati balmumunu (paw balm) düzenli uygulayın","Yaz sıcağında asfalt yanığı riski — sabah ve akşam çıkın","Tuz hasarı: kışın çıkış sonrası patileri ılık suyla yıkayın"],
        tip:"İlk birkaç kesimi groomer veya veterinere bırakın — köpeği tırnak kesimine alıştırmak sonraki seansları kolaylaştırır." }
    ],
    related:["evde-poodle-tirasi","tuy-bakimi-haftalik-rutin","dis-fircalama"]
  },

  /* ─── 4: Kulak ─── */
  {
    slug:"kulak-bakimi", emoji:"👂", tag:"Kulak", min:7,
    date:"2026-01-28", updated:"2026-05-22",
    author:"Dr. Ayşe Kaya", role:"Veteriner Hekimi",
    title:"Poodle Kulak Bakımı ve Enfeksiyon Önleme",
    intro:"Poodle'ların sarkık, kapalı kulak yapısı nem ve ısıyı hapseder — bu enfeksiyona zemin hazırlar. Düzenli bakım tedavi maliyetini ve acıyı önler.",
    sections:[
      { heading:"Neden Poodle'lar Kulak Enfeksiyonuna Yatkın?",
        content:"",
        list:["Sarkık kulaklar hava sirkülasyonunu engeller","İç kanal tüyleri nem biriktirir","Kıvırcık tüy yapısı bakteri üremesini kolaylaştırır","Sık banyo yapanlar ve yüzücü Poodle'lar daha riskli"] },
      { heading:"Aylık Kulak Temizliği",
        content:"",
        list:["Köpek kulak temizleyicisini kanalın ağzına damlatın","Kulak kaidesini nazikçe masaj yapın (30 sn)","Köpeğin silklemesine izin verin","Pamuk topuyla dışarı çıkan kiri temizleyin","Q-tip KULLANMAYIN — daha derine iter"],
        tip:"Kulak kanalına kendi erişim sınırınızın ötesinde girmeyin. Derin temizlik veteriner ya da groomere bırakılmalı." },
      { heading:"Enfeksiyon Belirtileri",
        content:"Şu belirtilerden biri varsa hemen veterinere gidin:",
        list:["Baş sallama veya kulağı kaşıma","Kahverengi, sarı veya kanlı akıntı","Ekşi veya peynir benzeri koku","Kulak içinde kızarıklık veya şişlik","Kulağa dokunmaya direnç"] },
      { heading:"Kulak İç Kılı",
        content:"",
        list:["3–4 haftada bir kulak içi kıllarını aldırın","Bu işlemi groomer veya veteriner yapmalı","Aşırı kıl birikimi havalanmayı engeller ve enfeksiyon riskini artırır"] }
    ],
    related:["evde-poodle-tirasi","tuy-bakimi-haftalik-rutin","banyo-rehberi"]
  },

  /* ─── 5: Diş ─── */
  {
    slug:"dis-fircalama", emoji:"🦷", tag:"Ağız", min:6,
    date:"2026-03-10", updated:"2026-06-05",
    author:"Dr. Murat Yılmaz", role:"Dahiliye Uzmanı",
    title:"Evde Poodle Diş Fırçalama: Adım Adım Teknik",
    intro:"Toy Poodle'ların %80'inden fazlasında 3 yaş itibarıyla periodontal bulgular görülür. Haftada 3 fırçalama bu riski dramatik biçimde azaltır ve veteriner diş temizliği maliyetini düşürür.",
    sections:[
      { heading:"Doğru Malzeme Seçimi",
        content:"",
        list:["Köpek diş macunu kullanın — insan macunu (flor) toksik","Tadlı formüller (tavuk, et) alışmayı hızlandırır","Parmak fırçası ile başlamak en kolayı","Diş şeridi veya su katkısı tamamlayıcı olarak kullanılabilir"] },
      { heading:"Alıştırma Aşamaları (1–3 Hafta)",
        content:"",
        list:["Hafta 1: Parmağınızı dudaklara sürerek alıştırın","Hafta 2: Parmak fırçayı diş etlerine değdirin","Hafta 3: Gerçek fırçayı tanıtın, ödülle destekleyin","Her seanstan sonra mutlaka ödüllendirin"],
        numbered:true },
      { heading:"Fırçalama Tekniği",
        content:"",
        list:["45° açıyla diş eti birleşim noktasına fırçalayın","Küçük dairesel hareketler yapın","Önce büyük diş yüzeylerini yapın (azı dişleri)","Köpekler dilin iç yüzünü kendisi temizler — odaklanmanıza gerek yok","Toplam 30–60 sn yeterli"] },
      { heading:"Tamamlayıcı Ürünler",
        content:"",
        list:["Dental chew (Oravet, Whimzees): günde 1","Hill's t/d Dental diet: veteriner onaylı","Su katkısı (klorheksidin bazlı): özellikle fırçalanamayan dönemlerde","Yılda 1 anestezi altında profesyonel diş temizliği"],
        tip:"Fırçalamayı reddetmek yerine her gün kısa süre deneyin. 20 saniyelik düzensiz fırçalama hiçbir şey yapmamanın çok önündedir." }
    ],
    related:["banyo-rehberi","pence-bakimi","kulak-bakimi"]
  },

  /* ─── 6: Banyo ─── */
  {
    slug:"banyo-rehberi", emoji:"💆", tag:"Banyo", min:7,
    date:"2025-12-15", updated:"2026-04-20",
    author:"Selin Demir", role:"Grooming Uzmanı",
    title:"Poodle Banyo Rehberi: Doğru Sıklık, Teknik ve Ürünler",
    intro:"Doğru banyo rutini Poodle tüyünü sağlıklı tutar, deri tahribatını önler ve tıraş kalitesini artırır. Sıklık, şampuan seçimi ve kurutma tekniği üçlü kritik faktördür.",
    sections:[
      { heading:"Ne Kadar Sıklıkla?",
        content:"",
        list:["Toy Poodle için ideal: 2 haftada 1","Aktif dışarı çıkan, kirli köpekler: 10 günde 1","Deri sorunu olanlar: veteriner önerisine göre","Sık banyo (haftada +2): deri yağını bozar, kuru ve kaşıntılı yapar"] },
      { heading:"Banyo Öncesi Hazırlık",
        content:"",
        list:["Banyo öncesi mutlaka tarayın — ıslak mat açılamaz","Kulak kanalına pamuk koyun (su kaçmasını önlemek için)","Gözleri korumak için göz etrafına vazelin sürülebilir","38–40°C ılık su hazırlayın"] },
      { heading:"Doğru Şampuan Seçimi",
        content:"",
        list:["pH dengeli (6.5–7.5) köpek şampuanı kullanın","Beyaz Poodle'lar için whitening formül","Deri hassasiyeti için yulaf bazlı, kokusuz","Conditioner: kıvırcık tüy için zorunlu, 5–10 dk bırakın"] },
      { heading:"Adım Adım Banyo",
        content:"",
        list:["Tam ıslatın (su köke ulaşmalı)","1. şampuanı yüzeysel uygulayın, durulayın","2. şampuanı köklere yedirin, masaj yapın","Conditioner uygulayın, 10 dk bekleyin","Bol su ile tam durulayın (kalıntı bırakmayın)","Havluyla presleme — ovuşturmayın"],
        numbered:true },
      { heading:"Kurutma",
        content:"",
        list:["Tam kurutma şart — yarı yaş bırakmak tüy kıvırcıklaşmasına ve mat oluşumuna zemin hazırlar","Yüksek debili köpek fönü (üfleyici) ideal","Ev saç kurutucusu orta ısıda kullanılabilir","Ters fırçalama yapın — hacim ve kolay tıraş için"],
        tip:"Kulaklara dolan suyu tamamen atmak için banyo sonrası köpeğin silkmesine izin verin. Kulak kanalına su girerse kurulama mendiliyle hafifçe temizleyin." }
    ],
    related:["tuy-bakimi-haftalik-rutin","evde-poodle-tirasi","kulak-bakimi"]
  },

  /* ─── 7: Göz Altı ─── */
  {
    slug:"goz-alti-lekesi-temizligi", emoji:"👁️", tag:"Göz", min:6,
    date:"2026-04-01", updated:"2026-06-18",
    author:"Dr. Ayşe Kaya", role:"Veteriner Hekimi",
    title:"Poodle Göz Altı Lekesi Temizliği: Neden Olur, Nasıl Giderilir?",
    intro:"Göz altı kahverengi-kırmızı lekeler (epiphora) beyaz ve açık renkli Poodle'ların çoğunda görülür. Kozmetik sorun gibi görünse de bazı vakalarda altta yatan tıbbi bir duruma işaret eder.",
    sections:[
      { heading:"Neden Oluşur?",
        content:"",
        list:["Gözyaşı kanalı tıkanıklığı veya dar kanal (anatomik)","Tüy ve kirpik tahrişi (trichiasis)","Gıda alerjisi: mısır, soya, buğday hassasiyeti","Konjonktivit veya üveit","Aşırı gözyaşı üretimi","Mineral yoğun su (klor, demir lekeleri koyulaştırır)"] },
      { heading:"Günlük Temizlik Rutini",
        content:"",
        list:["Sabah ıslak yumuşak bezle göz altını silin (içten dışa, tek yön)","Poodle göz mendili kullanın (bebek mendili değil)","Leke bölgesini kuru bırakın — ıslaklık mantar üretir","Göz önü tüyleri kısa kesin (groomer veya makas)","Gece yatmadan önce tekrar temizleyin"],
        tip:"Günlük temizlikte kullanılan mendili her gün değiştirin. Aynı mendili tekrar kullanmak bakteriyi gözden yüze taşır." },
      { heading:"Beslenme ile Yönetim",
        content:"",
        list:["Mısır, soya, buğday içermeyen mama 8 hafta deneyin","Filtreli içme suyu kullanın (klor ve demir azaltır)","Tahılsız mama geçişi kademeli (7–10 gün) yapın","Tylosin katkılı su: sadece veteriner önerisiyle"] },
      { heading:"Önerilen Ürünler",
        content:"",
        list:["Tropiclean Spa Tear Stain Remover","Angels' Eyes (tavuk içerdiğini dikkat edin)","Excel Tear Stain Remover","Veteriner onaylı göz damlası (kanalı açmak için)"] },
      { heading:"Ne Zaman Veterinere Gidilmeli?",
        content:"",
        list:["Leke aniden koyulaşır veya yaygınlaşırsa","Gözde kızarıklık, şişlik veya kaşıma başlarsa","Çapak artışı veya bulanık göz varsa","Günlük temizliğe 4 haftada yanıt yoksa","Köpek gözünü ovuyorsa"] }
    ],
    related:["tuy-bakimi-haftalik-rutin","banyo-rehberi","kulak-bakimi"]
  },
];

/* ─── Checklist ─────────────────────────────────────────── */
const CHECKLIST = [
  { id:"fırça",  freq:"3x/hafta",    task:"Slicker fırça ile tüy tarama" },
  { id:"banyo",  freq:"2x/ay",       task:"Banyo" },
  { id:"kulak",  freq:"1x/ay",       task:"Kulak temizliği ve kıl kontrolü" },
  { id:"pençe",  freq:"1x/ay",       task:"Pençe kesimi" },
  { id:"diş",    freq:"2x/hafta",    task:"Diş fırçalama" },
  { id:"tıraş",  freq:"6-8 haftada", task:"Profesyonel tıraş" },
  { id:"göz",    freq:"Günlük",      task:"Göz çevresi temizliği" },
];

/* ─── FAQ ──────────────────────────────────────────────── */
const FAQS = [
  { q:"Toy Poodle ne sıklıkla tıraş edilir?",       a:"Profesyonel tıraş 6–8 haftada bir önerilir. Ev tıraşı 4 haftada bir yapılabilir; sadece yüz tıraşı 2 haftada bir yeterli." },
  { q:"Poodle ne sıklıkla banyo yapılır?",           a:"2 haftada 1 kez ideal. Fazla banyo deri yağını bozar, kuru ve kaşıntılı tüy oluşturur." },
  { q:"Poodle tüyü ne sıklıkla taranır?",           a:"Haftada en az 3 kez slicker fırçayla taranmalıdır. Mat oluşumunu önlemek için her tarama seansı köklere kadar ulaşmalıdır." },
  { q:"Poodle pençeleri ne zaman kesilir?",         a:"Ayda 1 kez veya zeminde tıkırtı sesi çıkarmaya başladığında. Aktif koşan köpeklerde doğal aşınma daha uzun aralıklara izin verebilir." },
  { q:"Poodle tüyü neden dökülmez?",                a:"Poodle'ların tüyleri sürekli büyüyen kıl yapısına (hair, not fur) sahiptir. Bu onları hipoalerjenik yapar ama düzenli tıraş ve bakım zorunlu kılar." },
];

/* ─── Tıraş Modelleri ────────────────────────────────── */
const GROOM_STYLES = [
  { name:"Teddy Bear", emoji:"🐻", desc:"Yuvarlak, oyuncak ayı görünümü. Yeni başlayanlar için en kolay ve yaygın model.", freq:"6–8 hafta", level:"Başlangıç" },
  { name:"Puppy Cut",  emoji:"🐶", desc:"Tüm vücudu eşit uzunlukta bırakır. Pratik, bakımı kolay, sıcak aylarda ideal.", freq:"6–8 hafta", level:"Başlangıç" },
  { name:"Lamb Cut",   emoji:"🐑", desc:"Bacaklar dolgun, vücut kısa kesilir. Kabarık bacak efekti. Orta düzey.", freq:"6–8 hafta", level:"Orta" },
  { name:"Kennel Cut", emoji:"✂️", desc:"Tüm vücut kısa, pratik ve hijyenik. Yaz ayları veya aktif köpekler için.", freq:"8–10 hafta",level:"Başlangıç" },
  { name:"Continental",emoji:"👑", desc:"Göster tıraşı, karmaşık pompom detaylar. Sadece deneyimli groomers.", freq:"4–6 hafta", level:"Uzman" },
];

/* ─── Tıraş Zamanlama Aracı ─────────────────────────── */
function GroomCalculator() {
  const [lastDate, setLastDate] = useState("");
  const [type, setType]         = useState<"pro"|"home"|"face">("pro");
  const [result, setResult]     = useState<{date:string;days:number}|null>(null);

  const INTERVALS: Record<string,number> = { pro:49, home:28, face:14 }; // days (midpoint of range)
  const LABELS: Record<string,string> = {
    pro:"Profesyonel tıraş (6–8 hafta)",
    home:"Ev tıraşı (4 hafta)",
    face:"Sadece yüz tıraşı (2 hafta)",
  };

  const calculate = () => {
    if (!lastDate) return;
    const last = new Date(lastDate);
    const next = new Date(last);
    next.setDate(next.getDate() + INTERVALS[type]);
    const today = new Date();
    today.setHours(0,0,0,0);
    const diffMs = next.getTime() - today.getTime();
    const diffDays = Math.round(diffMs / 86400000);
    const formatted = next.toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric"});
    setResult({ date:formatted, days:diffDays });
  };

  const downloadIcs = () => {
    if (!result || !lastDate) return;
    const last = new Date(lastDate);
    const next = new Date(last);
    next.setDate(next.getDate() + INTERVALS[type]);
    const pad = (n:number) => String(n).padStart(2,"0");
    const dt = `${next.getFullYear()}${pad(next.getMonth()+1)}${pad(next.getDate())}`;
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:Poodle Tıraş Günü\nDTSTART;VALUE=DATE:${dt}\nDTEND;VALUE=DATE:${dt}\nDESCRIPTION:${LABELS[type]}\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([ics],{type:"text/calendar"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download="poodle-tirasi.ics"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ background:"linear-gradient(135deg,#FFE4EC,#FFF0F5)", borderRadius:18, padding:"20px 18px" }}>
      <h2 style={{ fontSize:16, fontWeight:800, color:"#1a1a1a", marginBottom:4 }}>✂️ Tıraş Zamanlama Aracı</h2>
      <p style={{ fontSize:12, color:"#888", lineHeight:1.5, marginBottom:16 }}>Son tıraş tarihine göre bir sonraki tarihi hesaplayın.</p>

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        <div>
          <label style={{ fontSize:12, fontWeight:700, color:"#555", display:"block", marginBottom:5 }}>Son tıraş tarihi</label>
          <input type="date" value={lastDate} onChange={e=>{ setLastDate(e.target.value); setResult(null); }}
            max={new Date().toISOString().split("T")[0]}
            style={{ width:"100%", height:44, borderRadius:12, border:"1.5px solid #f0c0d0", padding:"0 14px", fontSize:14, fontWeight:600, color:"#333", boxSizing:"border-box", background:"#fff", outline:"none" }} />
        </div>
        <div>
          <label style={{ fontSize:12, fontWeight:700, color:"#555", display:"block", marginBottom:5 }}>Tıraş tipi</label>
          <select value={type} onChange={e=>{ setType(e.target.value as "pro"|"home"|"face"); setResult(null); }}
            style={{ width:"100%", height:44, borderRadius:12, border:"1.5px solid #f0c0d0", padding:"0 14px", fontSize:13.5, fontWeight:600, color:"#333", background:"#fff", outline:"none", boxSizing:"border-box" }}>
            <option value="pro">Profesyonel tıraş (6–8 hafta)</option>
            <option value="home">Ev tıraşı (4 hafta)</option>
            <option value="face">Sadece yüz tıraşı (2 hafta)</option>
          </select>
        </div>
        <button onClick={calculate} disabled={!lastDate}
          style={{ width:"100%", height:46, borderRadius:13, border:"none", background:lastDate?"#E75480":"#f0c0d0", color:"#fff", fontSize:14, fontWeight:800, cursor:lastDate?"pointer":"default" }}>
          Hesapla ✂️
        </button>
      </div>

      {result && (
        <div style={{ marginTop:18, background:"#fff", borderRadius:14, padding:"16px 18px", border:"1.5px solid #f0c0d0" }}>
          <div style={{ fontSize:11, fontWeight:800, color:"#E75480", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.06em" }}>📅 Sonuç</div>
          <div style={{ fontSize:17, fontWeight:900, color:"#111", marginBottom:4 }}>Bir sonraki tıraş: {result.date}</div>
          <div style={{ fontSize:14, color: result.days < 0 ? "#EF4444" : result.days <= 7 ? "#F59E0B" : "#16A34A", fontWeight:700, marginBottom:14 }}>
            {result.days < 0 ? `${Math.abs(result.days)} gün gecikti!` : result.days === 0 ? "Bugün tıraş günü!" : `${result.days} gün kaldı`}
          </div>
          <button onClick={downloadIcs}
            style={{ width:"100%", height:40, borderRadius:11, border:"1.5px solid #E75480", background:"#fff", color:"#E75480", fontSize:13, fontWeight:700, cursor:"pointer" }}>
            📲 Takvime Ekle (.ics)
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Article Detail ─────────────────────────────────── */
function ArticleDetail({ article, onClose, allArticles }: {
  article:Article; onClose:()=>void; allArticles:Article[];
}) {
  const [liked, setLiked] = useState(() => {
    try { return !!localStorage.getItem("yp_bk_liked_"+article.slug); } catch { return false; }
  });
  const [, navigate] = useLocation();

  const toggleLike = () => {
    const next = !liked; setLiked(next);
    try { next ? localStorage.setItem("yp_bk_liked_"+article.slug,"1") : localStorage.removeItem("yp_bk_liked_"+article.slug); } catch {}
  };
  const share = () => {
    const url = window.location.origin+"/yourpoodle/bakim?a="+article.slug;
    if (navigator.share) navigator.share({title:article.title,url}).catch(()=>{});
    else navigator.clipboard.writeText(url).then(()=>alert("Bağlantı kopyalandı!")).catch(()=>{});
  };

  const cs = CAT_STYLE[article.tag]||{bg:"#FFE4EC",color:"#E75480"};
  const related = allArticles.filter(a=>article.related.includes(a.slug)).slice(0,3);

  /* HowTo + Article schema */
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
        "name":article.title,
        "description":article.intro,
        "totalTime":"PT60M",
        "tool":[
          {"@type":"HowToTool","name":"Slicker fırça"},
          {"@type":"HowToTool","name":"Profesyonel makas"},
          {"@type":"HowToTool","name":"Matlaştırıcı sprey"},
          {"@type":"HowToTool","name":"Fön makinesi"},
        ],
        "step":steps.map((t,i)=>({ "@type":"HowToStep","position":i+1,"text":t })),
      });
    }
    const id="yp-bk-art-schema";
    const el=document.getElementById(id);
    const txt=schemas.map(s=>JSON.stringify(s)).join("\n");
    if(el) el.textContent=txt;
    else { const sc=document.createElement("script"); sc.id=id; sc.type="application/ld+json"; sc.textContent=txt; document.head.appendChild(sc); }
    return ()=>{ document.getElementById(id)?.remove(); };
  },[article]);

  return (
    <div style={{ position:"fixed", inset:0, zIndex:500, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.45)" }} />
      <div className="bakim-modal-inner" style={{ position:"relative", background:"#fff", borderRadius:20, maxWidth:680, width:"calc(100% - 24px)", maxHeight:"93vh", display:"flex", flexDirection:"column", overflow:"hidden", boxShadow:"0 32px 80px rgba(0,0,0,0.22)" }}>
        {/* Top bar */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 18px 10px", borderBottom:"1px solid #f2f2f2", flexShrink:0 }}>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:6, color:"#555", fontSize:13.5, fontWeight:700 }}>
            <ArrowLeft size={15} strokeWidth={2.5}/> Geri
          </button>
          <div style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:"#aaa" }}>
            <span style={{ cursor:"pointer", color:"#E75480" }} onClick={onClose}>Bakım</span>
            <ChevronRight size={10}/>
            <span style={{ background:cs.bg, color:cs.color, padding:"2px 8px", borderRadius:20, fontWeight:700 }}>{article.tag}</span>
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
          <div style={{ background:`linear-gradient(135deg,${cs.bg},#fff)`, borderRadius:16, padding:"22px 20px 18px", marginBottom:18, textAlign:"center" }}>
            <div style={{ fontSize:50, marginBottom:10 }}>{article.emoji}</div>
            <span style={{ display:"inline-block", background:cs.bg, color:cs.color, fontSize:11, fontWeight:800, borderRadius:20, padding:"4px 13px", marginBottom:12 }}>{article.tag}</span>
            <h1 style={{ fontSize:19, fontWeight:900, color:"#111", lineHeight:1.35, margin:0 }}>{article.title}</h1>
          </div>
          {/* Meta */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20, paddingBottom:16, borderBottom:"1px solid #f2f2f2", flexWrap:"wrap" }}>
            <div style={{ width:38, height:38, borderRadius:"50%", background:cs.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>✂️</div>
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
              {sec.heading && <h3 style={{ fontSize:15.5, fontWeight:800, color:"#111", marginBottom:10, paddingBottom:6, borderBottom:`2px solid ${cs.bg}` }}>{sec.heading}</h3>}
              {sec.content && <p style={{ fontSize:14, color:"#555", lineHeight:1.8, marginBottom:sec.list?10:0 }}>{sec.content}</p>}
              {sec.list && (
                <ul style={{ margin:0, paddingLeft:0, listStyle:"none" }}>
                  {sec.list.map((item,j)=>(
                    <li key={j} style={{ display:"flex", gap:9, fontSize:13.5, color:"#444", lineHeight:1.65, marginBottom:6 }}>
                      <span style={{ color:cs.color, fontWeight:700, flexShrink:0, marginTop:1 }}>{sec.numbered ? `${j+1}.` : "•"}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {sec.tip && (
                <div style={{ marginTop:14, padding:"13px 16px", background:"#FFE4EC", borderRadius:12, borderLeft:"3px solid #E75480" }}>
                  <div style={{ fontSize:11, fontWeight:800, color:"#E75480", marginBottom:5 }}>💡 GROOMER TAVSİYESİ</div>
                  <div style={{ fontSize:13, color:"#555", lineHeight:1.65 }}>{sec.tip}</div>
                </div>
              )}
            </div>
          ))}
          {/* Related */}
          {related.length>0 && (
            <div style={{ marginTop:28, paddingTop:22, borderTop:"1px solid #f2f2f2" }}>
              <div style={{ fontSize:13, fontWeight:800, color:"#333", marginBottom:12 }}>📖 İlgili Makaleler</div>
              <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
                {related.map(r=>{
                  const rcs=CAT_STYLE[r.tag]||{bg:"#FFE4EC",color:"#E75480"};
                  return (
                    <button key={r.slug}
                      onClick={()=>{ const e=new CustomEvent("yp-bakim-open",{detail:r.slug}); window.dispatchEvent(e); onClose(); }}
                      style={{ display:"flex", gap:12, alignItems:"center", padding:"11px", background:"#FAFAFA", borderRadius:12, cursor:"pointer", border:"1.5px solid #F3F4F6", textAlign:"left", width:"100%" }}>
                      <div style={{ fontSize:22, width:42, height:42, background:rcs.bg, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{r.emoji}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:10.5, fontWeight:700, color:rcs.color, marginBottom:3 }}>{r.tag}</div>
                        <div style={{ fontSize:13, fontWeight:700, color:"#111", lineHeight:1.4 }}>{r.title}</div>
                      </div>
                      <ChevronRight size={14} color="#ccc"/>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {/* CTA */}
          <button onClick={()=>navigate("/yourpoodle/magaza?kategori=bakim")}
            style={{ width:"100%", marginTop:24, height:48, borderRadius:14, border:"none", background:"linear-gradient(135deg,#E75480,#F472B6)", color:"#fff", fontSize:14, fontWeight:800, cursor:"pointer" }}>
            Bakım Ürünlerine Git 🛍️
          </button>
        </div>
      </div>
    </div>
  );
}


/* ─── Main Page ──────────────────────────────────────── */
export default function Bakim() {
  const [, navigate] = useLocation();
  const [selected, setSelected] = useState<Article|null>(null);
  const [activeCat, setActiveCat] = useState("Tümü");
  const [search, setSearch]       = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number|null>(null);

  /* Checklist — localStorage persisted */
  const [checked, setChecked] = useState<Set<string>>(()=>{
    try {
      const stored = localStorage.getItem("yp_bakim_checklist");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch { return new Set(); }
  });
  const toggle = (id:string) => {
    setChecked(prev=>{
      const s=new Set(prev); s.has(id)?s.delete(id):s.add(id);
      try { localStorage.setItem("yp_bakim_checklist",JSON.stringify([...s])); } catch {}
      return s;
    });
  };

  /* SEO */
  useEffect(()=>{
    document.title = PAGE_TITLE;
    const setMeta=(attr:string,key:string,val:string)=>{
      let el=document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement|null;
      if(!el){el=document.createElement("meta");el.setAttribute(attr,key);document.head.appendChild(el);}
      el.content=val;
    };
    setMeta("property","og:title",PAGE_OG_TITLE);
    setMeta("property","og:description",PAGE_DESC);
    setMeta("property","og:type","website");
    setMeta("property","og:url","https://www.yourpoodle.com/yourpoodle/bakim");
    setMeta("name","description",PAGE_DESC);
  },[]);

  /* URL param */
  useEffect(()=>{
    const slug=new URLSearchParams(window.location.search).get("a");
    if(slug){ const f=ARTICLES.find(a=>a.slug===slug); if(f) setSelected(f); }
  },[]);

  /* cross-component open event */
  useEffect(()=>{
    const h=(e:Event)=>{
      const slug=(e as CustomEvent).detail as string;
      const f=ARTICLES.find(a=>a.slug===slug);
      if(f){ setSelected(f); window.history.pushState({},"","/yourpoodle/bakim?a="+slug); }
    };
    window.addEventListener("yp-bakim-open",h);
    return ()=>window.removeEventListener("yp-bakim-open",h);
  },[]);

  const openArticle = useCallback((a:Article)=>{
    setSelected(a);
    window.history.pushState({},"","/yourpoodle/bakim?a="+a.slug);
  },[]);
  const closeArticle = useCallback(()=>{
    setSelected(null);
    window.history.pushState({},"","/yourpoodle/bakim");
  },[]);

  const filtered = ARTICLES.filter(a=>
    (activeCat==="Tümü"||a.tag===activeCat) &&
    (search===""||a.title.toLowerCase().includes(search.toLowerCase()))
  );

  /* Page-level schemas */
  const itemListSchema = {
    "@context":"https://schema.org","@type":"ItemList",
    "name":"Poodle Bakım Yazıları","numberOfItems":ARTICLES.length,
    "itemListElement":ARTICLES.map((a,i)=>({
      "@type":"ListItem","position":i+1,
      "url":`https://www.yourpoodle.com/yourpoodle/bakim?a=${a.slug}`,
      "name":a.title,
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
    "name":"Poodle Bakım Rehberi","description":PAGE_DESC,
    "url":"https://www.yourpoodle.com/yourpoodle/bakim",
    "datePublished":"2025-06-01","dateModified":"2026-06-18",
    "publisher":{"@type":"Organization","name":"YourPoodle","url":"https://www.yourpoodle.com"},
  };

  return (
    <YPLayout activeLink="/yourpoodle/bakim" bottomNavActive="/yourpoodle/rehber">
      {/* Schemas */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <style>{`
        .art-row-bakim:hover { background:#FFF0F5 !important; border-color:#FCA5A5 !important; }
        .noscroll-bk::-webkit-scrollbar { display:none; }
        .noscroll-bk { -ms-overflow-style:none; scrollbar-width:none; }
        .cat-scroll-bk { position:relative; }
        .cat-scroll-bk::after { content:""; position:absolute; right:0; top:0; bottom:0; width:36px; background:linear-gradient(to right,transparent,#fff); pointer-events:none; }
        .style-card:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(231,84,128,0.15); }
        .style-card { transition:all 0.2s; }
        @media (min-width: 640px) {
          .bakim-art-grid { display:grid !important; grid-template-columns:1fr 1fr !important; gap:14px !important; }
          .bakim-checklist { display:grid !important; grid-template-columns:1fr 1fr; gap:8px !important; }
          .bakim-styles-grid { display:grid !important; grid-template-columns:repeat(3,1fr) !important; gap:14px !important; }
        }
        @media (max-width: 639px) {
          .bakim-modal-inner { border-radius:16px 16px 0 0 !important; position:fixed !important; bottom:0 !important; top:auto !important; left:0 !important; right:0 !important; width:100% !important; max-width:100% !important; max-height:92vh !important; }
        }
      `}</style>

      {selected && <ArticleDetail article={selected} onClose={closeArticle} allArticles={ARTICLES}/>}

      {/* ── Hero ── */}
      <div style={{ background:"linear-gradient(135deg,#E75480,#F472B6)", padding:"28px 24px 32px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-30, right:-20, width:130, height:130, borderRadius:"50%", background:"rgba(255,255,255,0.1)" }}/>
        <div style={{ position:"absolute", bottom:-20, left:-10, width:80, height:80, borderRadius:"50%", background:"rgba(255,255,255,0.07)" }}/>
        <div style={{ fontSize:40, marginBottom:10 }}>✂️</div>
        <h1 style={{ fontSize:26, fontWeight:900, color:"#fff", marginBottom:6, lineHeight:1.2 }}>Poodle Bakım Rehberi</h1>
        <p style={{ fontSize:14, color:"rgba(255,255,255,0.9)", lineHeight:1.5, margin:0 }}>Poodle'ınızı her zaman şık ve sağlıklı tutun</p>
      </div>

      {/* ── Hızlı Cevaplar ── */}
      <div style={{ padding:"20px 16px 0" }}>
        <div style={{ fontSize:15, fontWeight:800, color:"#1a1a1a", marginBottom:12 }}>💡 Hızlı Cevaplar</div>
        <div style={{ background:"#fff", borderRadius:16, border:"1.5px solid #f0e0e8", overflow:"hidden" }}>
          {FAQS.map((f,i)=>(
            <div key={i} style={{ borderBottom:i<FAQS.length-1?"1px solid #fce8ef":"none" }}>
              <button onClick={()=>setExpandedFaq(expandedFaq===i?null:i)}
                style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 16px", background:"none", border:"none", cursor:"pointer", textAlign:"left", gap:10 }}>
                <span style={{ fontSize:13.5, fontWeight:700, color:"#1a1a1a", lineHeight:1.4 }}>S: {f.q}</span>
                <span style={{ fontSize:16, color:"#E75480", flexShrink:0, lineHeight:1 }}>{expandedFaq===i?"−":"+"}</span>
              </button>
              {expandedFaq===i && (
                <div style={{ padding:"0 16px 14px", fontSize:13.5, color:"#555", lineHeight:1.7 }}>
                  <span style={{ fontWeight:700, color:"#E75480" }}>C: </span>{f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Bakım Kontrol Listesi ── */}
      <div style={{ padding:"20px 16px 0" }}>
        <h2 style={{ fontSize:15, fontWeight:800, color:"#1a1a1a", marginBottom:12 }}>✅ Bakım Kontrol Listesi</h2>
        <div className="bakim-checklist" style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:8 }}>
          {CHECKLIST.map(({id,freq,task})=>(
            <button key={id} onClick={()=>toggle(id)}
              style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", background:checked.has(id)?"#FFF0F5":"#FAFAFA", borderRadius:12, border:`1.5px solid ${checked.has(id)?"#FCA5A5":"#f0f0f0"}`, cursor:"pointer", textAlign:"left", transition:"all 0.15s" }}>
              {checked.has(id)
                ? <CheckCircle2 size={20} color="#E75480" strokeWidth={2} style={{ flexShrink:0 }}/>
                : <Circle size={20} color="#ddd" strokeWidth={2} style={{ flexShrink:0 }}/>}
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:checked.has(id)?"#E75480":"#333", textDecoration:checked.has(id)?"line-through":"none" }}>{task}</div>
              </div>
              <span style={{ fontSize:10, fontWeight:700, background:"#FFE4EC", color:"#E75480", borderRadius:6, padding:"2px 8px", flexShrink:0 }}>{freq}</span>
            </button>
          ))}
        </div>
        {checked.size>0 && (
          <div style={{ textAlign:"center", fontSize:12.5, color:"#E75480", fontWeight:700, padding:"4px 0 8px" }}>
            {checked.size}/{CHECKLIST.length} tamamlandı 🎀
            {checked.size===CHECKLIST.length && <span style={{ marginLeft:8 }}>Harika! Tüm bakım tamam!</span>}
          </div>
        )}
      </div>

      {/* ── Arama + Kategori + Makaleler ── */}
      <div style={{ padding:"20px 16px 0" }}>
        <h2 style={{ fontSize:15, fontWeight:800, color:"#1a1a1a", marginBottom:12 }}>📖 Bakım Yazıları</h2>
        {/* Search */}
        <div style={{ display:"flex", alignItems:"center", background:"#F7F7F7", border:"1.5px solid #ececec", borderRadius:14, height:46, overflow:"hidden", marginBottom:10 }}>
          <div style={{ paddingLeft:13, color:"#bbb", display:"flex" }}><Search size={16} strokeWidth={2}/></div>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Bakım konusu ara..."
            style={{ flex:1, border:"none", outline:"none", fontSize:14, fontWeight:600, color:"#333", background:"transparent", padding:"0 11px" }}/>
          {search && <button onClick={()=>setSearch("")} style={{ background:"none", border:"none", cursor:"pointer", paddingRight:11, color:"#bbb" }}><X size={14} strokeWidth={2}/></button>}
        </div>
        {/* Category pills */}
        <div className="cat-scroll-bk" style={{ position:"relative", marginBottom:14 }}>
          <div className="noscroll-bk" style={{ display:"flex", gap:7, overflowX:"auto", paddingBottom:2, paddingRight:36 }}>
            {ARTICLE_CATS.map(c=>(
              <button key={c} onClick={()=>setActiveCat(c)}
                style={{ flexShrink:0, padding:"6px 14px", borderRadius:20, border:"1.5px solid", borderColor:activeCat===c?"#E75480":"#e8e8e8", background:activeCat===c?"#E75480":"#fff", color:activeCat===c?"#fff":"#555", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                {c}
              </button>
            ))}
          </div>
        </div>
        {/* Articles */}
        {filtered.length===0 ? (
          <div style={{ textAlign:"center", padding:"36px 20px", color:"#aaa" }}>
            <div style={{ fontSize:36, marginBottom:10 }}>🔍</div>
            <div style={{ fontSize:14, fontWeight:700, color:"#555", marginBottom:5 }}>
              {search ? `"${search}" için makale bulunamadı` : "Bu kategoride henüz makale yok"}
            </div>
            <button onClick={()=>{ setSearch(""); setActiveCat("Tümü"); }}
              style={{ marginTop:12, padding:"9px 22px", borderRadius:20, background:"#E75480", color:"#fff", border:"none", cursor:"pointer", fontSize:13, fontWeight:700 }}>
              Tümünü Göster
            </button>
          </div>
        ) : (
          <div className="bakim-art-grid" style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {filtered.map(a=>{
              const cs=CAT_STYLE[a.tag]||{bg:"#FFE4EC",color:"#E75480"};
              return (
                <button key={a.slug} className="art-row-bakim" onClick={()=>openArticle(a)}
                  style={{ display:"flex", gap:13, alignItems:"center", padding:"13px", background:"#FAFAFA", borderRadius:14, cursor:"pointer", border:"1.5px solid #F3F4F6", textAlign:"left", width:"100%", transition:"all 0.15s" }}>
                  <div style={{ width:56, height:56, borderRadius:13, background:cs.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>{a.emoji}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:cs.color, marginBottom:4 }}>{a.tag}</div>
                    <div style={{ fontSize:13.5, fontWeight:700, color:"#1a1a1a", lineHeight:1.4, marginBottom:4 }}>{a.title}</div>
                    <div style={{ fontSize:11, color:"#aaa" }}>{a.author} · <span style={{ display:"inline-flex", alignItems:"center", gap:2 }}><Clock size={10} strokeWidth={2}/>{a.min} dk</span></div>
                  </div>
                  <ChevronRight size={16} color="#ccc" style={{ flexShrink:0 }}/>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Tıraş Modelleri Galerisi ── */}
      <div style={{ padding:"24px 16px 0" }}>
        <div style={{ fontSize:15, fontWeight:800, color:"#1a1a1a", marginBottom:12 }}>💈 Tıraş Modelleri</div>
        <div className="bakim-styles-grid" style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {GROOM_STYLES.map(s=>(
            <div key={s.name} className="style-card"
              style={{ background:"#fff", borderRadius:14, padding:"16px 16px 14px", border:"1.5px solid #FDE8EF", cursor:"default" }}>
              <div style={{ fontSize:28, marginBottom:8 }}>{s.emoji}</div>
              <div style={{ fontSize:14, fontWeight:800, color:"#1a1a1a", marginBottom:5 }}>{s.name}</div>
              <div style={{ fontSize:12.5, color:"#666", lineHeight:1.55, marginBottom:10 }}>{s.desc}</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <span style={{ fontSize:10.5, fontWeight:700, background:"#FFE4EC", color:"#E75480", borderRadius:6, padding:"3px 8px" }}>🔄 {s.freq}</span>
                <span style={{ fontSize:10.5, fontWeight:700, background:"#F3F4F6", color:"#555", borderRadius:6, padding:"3px 8px" }}>⭐ {s.level}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tıraş Zamanlama Aracı ── */}
      <div style={{ padding:"24px 16px 0" }}>
        <GroomCalculator/>
      </div>

      {/* ── Bakım Ürünleri CTA ── */}
      <div style={{ margin:"24px 16px 0", background:"linear-gradient(135deg,#FDF4FF,#FFE4EC)", borderRadius:18, padding:"20px", textAlign:"center" }}>
        <div style={{ fontSize:24, marginBottom:8 }}>🛍️</div>
        <div style={{ fontSize:14, fontWeight:800, color:"#1a1a1a", marginBottom:4 }}>Bakım Ürünleri</div>
        <div style={{ fontSize:12, color:"#888", lineHeight:1.5, marginBottom:14 }}>Fırçalar, makaslar, şampuanlar ve daha fazlası.</div>
        <button onClick={()=>navigate("/yourpoodle/magaza?kategori=bakim")}
          style={{ height:42, borderRadius:12, border:"none", background:"#E75480", color:"#fff", fontSize:13, fontWeight:800, padding:"0 26px", cursor:"pointer" }}>
          Bakım Ürünlerine Git →
        </button>
      </div>

      <div style={{ height:24 }}/>
    </YPLayout>
  );
}
