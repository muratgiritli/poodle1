import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { ChevronRight, Clock, AlertTriangle, CheckCircle2, ArrowLeft, Heart, Share2, ChevronDown, ChevronUp, Search, X } from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";

/* ─── SEO ─────────────────────────────────────────────── */
const PAGE_TITLE = "Poodle Sağlık Rehberi — Belirtiler, Aşı Takvimi, Veteriner İpuçları | YourPoodle";
const PAGE_DESC  = "Poodle sağlık belirtilerini tanıyın, aşı takvimini öğrenin ve önleyici bakım ipuçları edinin. Veteriner onaylı Toy Poodle sağlık rehberi.";

/* ─── DATA ─────────────────────────────────────────────── */
const CATS = ["Tümü", "Genel Sağlık", "Ortopedi", "Davranış", "Önleyici Bakım", "Ağız Sağlığı", "Göz Sağlığı"];

const CAT_STYLE: Record<string, { bg: string; color: string }> = {
  "Genel Sağlık":    { bg: "#FFF1F2", color: "#EF4444" },
  "Ortopedi":        { bg: "#FFF7ED", color: "#EA580C" },
  "Davranış":        { bg: "#FDF4FF", color: "#9333EA" },
  "Önleyici Bakım":  { bg: "#F0FDF4", color: "#16A34A" },
  "Ağız Sağlığı":    { bg: "#EFF6FF", color: "#2563EB" },
  "Göz Sağlığı":     { bg: "#F0F9FF", color: "#0369A1" },
};

interface ArticleSection { heading?: string; content: string; list?: string[]; tip?: string; }
interface Article {
  slug: string; emoji: string; tag: string; title: string; min: number;
  date: string; updated: string; author: string; role: string;
  intro: string; sections: ArticleSection[]; related: string[];
}

const ARTICLES: Article[] = [
  {
    slug:"10-yaygin-saglik-sorunu", emoji:"💊", tag:"Genel Sağlık", min:10,
    date:"2026-01-10", updated:"2026-06-15",
    author:"Dr. Murat Yılmaz", role:"Dahiliye Uzmanı",
    title:"Poodle'larda Görülen 10 Yaygın Sağlık Sorunu",
    intro:"Poodle'lar uzun ömürlü ve genel olarak sağlıklı köpeklerdir; Toy Poodle 14–18 yıl yaşayabilir. Ancak bazı genetik yatkınlıklar belirli sağlık sorunlarına kapı aralar. Bu rehberde sık görülen 10 sorunu, belirtilerini ve yönetim yollarını bulabilirsiniz.",
    sections:[
      { heading:"1. Addison Hastalığı (Hipoadrenokortisizm)",
        content:"Böbrek üstü bezlerinin yeterli kortizol üretememesidir. Poodle'larda genetik yatkınlık mevcuttur.",
        list:["Belirtiler: letarji, iştahsızlık, kusma, zayıflama, bayılma","Teşhis: ACTH stimülasyon testi","Tedavi: ömür boyu fludrokortizon/prednizolon — iyi yönetimde normal yaşam","Kriz (Addison krizi) hayati tehlike — hemen acile gidin"] },
      { heading:"2. Hipotiroidizm",
        content:"Tiroid bezinin yetersiz hormon üretimidir; orta yaşlı Poodle'larda sık görülür.",
        list:["Belirtiler: kilo artışı, tüy dökülmesi, letarji, soğuğa hassasiyet, yüz ödemi","Teşhis: T4 + TSH kan testi","Tedavi: günlük oral levotiroksin (uygun fiyatlı, ömür boyu)","İyi kontrol altında prognoz mükemmel"] },
      { heading:"3. Patellar Luksasyon (Diz Kayması)",
        content:"Toy Poodle'larda en yaygın ortopedik sorundur. Diz kapağı yerinden çıkar.",
        list:["Belirtiler: 'hop-hop' yürüme, aralıklı topallama, bacak kaldırma","Grade 1–2: konservatif (ağırlık kontrolü, fizyo)","Grade 3–4: cerrahi gerekebilir","OFA sertifikalı ebeveynlerden yavru seçin"] },
      { heading:"4. İlerleyici Retinal Atrofi (PRA)",
        content:"Genetik, retina dejenerasyonuyla körlükle sonuçlanan bir göz hastalığıdır.",
        list:["İlk belirti: gece körlüğü, karanlıkta tereddüt","Günışığı görüşü sonradan etkilenir","Tedavisi yok; anti-oksidan takviye yavaşlatabilir","Ebeveyn DNA testi ile önleyin (prcd-PRA testi)"] },
      { heading:"5. Epilepsi",
        content:"İdiyopatik epilepsi 3–7 yaş arası başlayabilir; kalıtsal bileşeni vardır.",
        list:["Her nöbeti not alın: süre, tip, sıklık","MRI + BOS analizi ile teşhis","Tedavi: fenobarbital veya potasyum bromür","Nöbet >5 dk sürerse veya art arda gelirse acil veteriner"],
        tip:"Nöbet sırasında köpeğinize dokunmayın — siz de ısırılabilirsiniz. Sakin kalın, zamanı tutun, güvenli zemine alın." },
      { heading:"6. Göz Yaşı Lekeleri (Epiphora)",
        content:"",
        list:["Neden: dar kanal, kıl tahrişi, gıda alerjisi","Yönetim: günlük göz mendili, filtreli su, tahılsız mama denemesi","Aşırı veya aniden artan yırtma = veteriner"] },
      { heading:"7. Periodontal Hastalık",
        content:"",
        list:["Toy Poodle'ların >%80'i 3 yaş üstünde periodontitis geliştirir","Belirtiler: kötü nefes, diş eti kanaması, yeme güçlüğü","Önlem: haftada 3 fırçalama, yılda 1 diş taşı temizliği"] },
      { heading:"8. Kalça Displazisi",
        content:"",
        list:["Toy Poodle'da daha az sık; Standart'ta daha yaygın","Belirtiler: arka yürüyüş tutukluğu, merdivenden kaçınma","PennHIP veya OFA röntgen + glukozamin desteği"] },
      { heading:"9. Cushing Sendromu (Hiperadrenokortisizm)",
        content:"",
        list:["Belirtiler: simetrik tüy dökülmesi, şişmiş karın, aşırı su tüketimi, sık idrara çıkma","Teşhis: düşük doz deksametazon baskı testi","Tedavi: trilostane veya mitotane"] },
      { heading:"10. Alerjik Dermatit",
        content:"",
        list:["Çevre (toz akarı, çimen) veya gıda alerjisi olabilir","Belirtiler: pati yalamak, kulak iltihabı, deri kızarıklığı","Eliminasyon diyeti + deri testi ile alerjen tespiti","Tedavi: immunoterapi, Apoquel veya Cytopoint"],
        tip:"Yılda iki kez tam kan sayımı ve biyokimya paneli yaptırın. Erken tespit tedavi başarısını ve maliyeti belirleyici biçimde etkiler." }
    ],
    related:["kalca-displazisi","dis-sagligi-periodontal","asi-takvimi"]
  },
  {
    slug:"kalca-displazisi", emoji:"🏥", tag:"Ortopedi", min:8,
    date:"2025-09-20", updated:"2026-04-10",
    author:"Dr. Ali Öztürk", role:"Ortopedi Uzmanı",
    title:"Poodle'larda Kalça Displazisi: Erken Teşhis ve Tedavi",
    intro:"Kalça displazisi büyük ırklarda daha sık görülse de Standart Poodle'lar risk altındadır. Erken teşhis ve doğru yönetimle yaşam kalitesi korunabilir.",
    sections:[
      { heading:"Nedir ve Nasıl Oluşur?",
        content:"Kalça ekleminin top ve yuvasının tam oturmamasıdır. Eklemde anormal aşınma ve zamanla osteoartrite yol açar.",
        list:["Birincil neden: genetik yatkınlık","Hızlı büyüme ve aşırı beslenme riski artırır","Kaygan zemin ve merdiven erken dönemde zararlı"] },
      { heading:"Belirtiler",
        content:"",
        list:["Kalçaya konan ağırlığın azalması, topallama","Zıplamaktan, merdivenlerden kaçınma","'Tavşan koşusu' (iki arka bacağı birlikte itme)","Kalçada kas erimesi","Sabah tutukluğu"] },
      { heading:"Teşhis",
        content:"",
        list:["Radyoloji: PennHIP veya OFA görüntüleme","Muayene: Ortolani ve Barden testleri","MRI (ileri vakalarda)","Erken tarama: 4–6. ayda ilk kontrol"] },
      { heading:"Tedavi Seçenekleri",
        content:"",
        list:["Konservatif: ağırlık yönetimi, fizyo, yüzme, NSAID'lar","Takviye: glukozamin, kondroitin, omega-3","Cerrahi: TPO, FHO veya total kalça protezi","Akupunktur: destekleyici rol"],
        tip:"OFA veya PennHIP sertifikalı ebeveynlerden doğan yavruları tercih ederek bu riski minimuma indirebilirsiniz." }
    ],
    related:["10-yaygin-saglik-sorunu","asi-takvimi","dis-sagligi-periodontal"]
  },
  {
    slug:"poodle-anksiyetesi-saglik", emoji:"❤️", tag:"Davranış", min:7,
    date:"2025-11-05", updated:"2026-03-20",
    author:"Dr. Zeynep Acar", role:"Veteriner Davranış Uzmanı",
    title:"Poodle Anksiyetesi: Belirtiler, Nedenleri ve Çözüm Yolları",
    intro:"Poodle'lar sosyal ve bağlı bir ırak olduğundan ayrılık anksiyetesi en yaygın davranışsal sorunlardandır. Erken tespit ve doğru yaklaşımla yönetilebilir.",
    sections:[
      { heading:"Ayrılık Anksiyetesi Belirtileri",
        content:"",
        list:["Kapı veya pencere önünde sürekli bekleme","Aşırı havlama ve uluma","Eşya çiğneme (özellikle sahip eşyaları)","Sizi her odaya takip etme","İshal veya kusma (anksiyete kaynaklı)"] },
      { heading:"Ev İçi Çözümler",
        content:"",
        list:["Ayrılış ritüeli oluşturun: sessizce çıkın","KONG oyuncağı (donmuş PB veya yoğurtla)","Adaptil diffuser veya collar (feromonal destek)","Gündüz egzersizi: yorgun köpek daha sakin bekler"] },
      { heading:"Desensitizasyon Protokolü",
        content:"2–8 hafta sürer; sabır ister ama en kalıcı sonucu verir.",
        list:["Adım 1: kapıya yaklaşın, açmayın","Adım 2: 3 sn dışarı çıkın, geri gelin","Adım 3: 15 sn, 1 dk, 5 dk, 15 dk, 1 saat","Her aşamada köpek rahatsa ilerleyin"],
        tip:"Büyük sıkıntı varsa (hasar veriyorsa, kendini yaralıyorsa) mutlaka veteriner davranış uzmanına başvurun. İlaç tedavisi ve terapi birlikte uygulanabilir." }
    ],
    related:["10-yaygin-saglik-sorunu","asi-takvimi","goz-yasi-lekeleri"]
  },
  {
    slug:"asi-takvimi", emoji:"💉", tag:"Önleyici Bakım", min:6,
    date:"2026-02-01", updated:"2026-05-10",
    author:"Dr. Murat Yılmaz", role:"Dahiliye Uzmanı",
    title:"Poodle Aşı Takvimi: Yavrudan Yetişkine Eksiksiz Rehber",
    intro:"Aşılama, köpeğinizi birçok ölümcül hastalıktan korumanın en güvenilir yoludur. Türkiye'de yasal zorunlu aşılar ve önerilen ek aşılar hakkında bilmeniz gereken her şey burada.",
    sections:[
      { heading:"Yavru Aşı Takvimi (6–16 Hafta)",
        content:"",
        list:["6–8. hafta: DHPPi (Distemper+Hepatit+Parvo+Parainfluenza) 1. doz","10–12. hafta: DHPPi 2. doz + Leptospiroz 1. doz","14–16. hafta: DHPPi 3. doz + Leptospiroz 2. doz + Kuduz (yasal zorunlu)","16. haftadan önce dışarı çıkarmayın (parvo riski)"] },
      { heading:"Yetişkin Yıllık Hatırlatıcılar",
        content:"",
        list:["Yıllık: DHPPi hatırlatıcı + Leptospiroz","Yıllık: Kuduz (pasaport defterine işlenir)","Duruma göre: Kennel Cough (BarBor), özellikle oteller/parklar","Duruma göre: Tik aşısı (Lyme)"] },
      { heading:"Türkiye'de Pasaport ve Kayıt",
        content:"",
        list:["Kuduz aşısı yapılmadan pasaport düzenlenmez","Mikroçip zorunlu (15 rakam, ISO 11784/11785)","İl tarım müdürlüğü tescili önerilir","Seyahat için AB pasaportu: Türk veteriner klinikleri düzenler"],
        tip:"Aşı takviminizi telefon takviminize işleyin. Hatırlatıcı geçen köpek yeniden tam seriye başlamak zorunda kalabilir." }
    ],
    related:["10-yaygin-saglik-sorunu","dis-sagligi-periodontal","goz-yasi-lekeleri"]
  },
  {
    slug:"dis-sagligi-periodontal", emoji:"🦷", tag:"Ağız Sağlığı", min:7,
    date:"2026-03-15", updated:"2026-06-01",
    author:"Dr. Ali Öztürk", role:"Ortopedi Uzmanı",
    title:"Diş Sağlığı: Küçük Irklarda Periodontal Hastalık",
    intro:"Toy Poodle'larda diş hastalığı çarpıcı biçimde yaygındır — 3 yaş üstü köpeklerin %80'inden fazlasında periodontal bulgular mevcuttur. Erken önlemler kalp, böbrek ve karaciğer sağlığını doğrudan korur.",
    sections:[
      { heading:"Neden Küçük Irklarda Daha Fazla?",
        content:"",
        list:["Küçük çenede dişler sıkışık — plak birikimi daha hızlı","Diş minesi orantısal olarak daha ince","Küçük ırk sahipleri diş sağlığını genellikle ihmal eder"] },
      { heading:"Belirtiler",
        content:"",
        list:["Kötü ağız kokusu (en sık ilk belirti)","Diş eti kanaması veya kızarıklık","Sertçe çiğneme güçlüğü, tek taraflı yeme","Yüz altına dokunmaya hassasiyet","Ağız açarken ağrı ifadesi"] },
      { heading:"Önleme",
        content:"",
        list:["Haftada en az 3 kez köpek dişi fırçalama","Dental chew (Oravet, Whimzees vb.) günlük","Hill's t/d Dental diet","Su katkısı (klorheksidin bazlı)","Yılda 1 anestezi altında profesyonel temizlik"] },
      { heading:"Profesyonel Tedavi",
        content:"",
        list:["Anestezisiz diş temizliği yüzeysel ve yetersiz — sakının","Anestezi altında: ultrasonik temizlik + kök yüzeyi düzeltme","Ağır vakalarda çekim kaçınılmaz"],
        tip:"Periodontal bakteriler kan dolaşımına karışarak kalp kapakçıklarını (endokardit), böbrekleri ve karaciğeri etkileyebilir. Diş sağlığı sadece ağız sağlığı değildir." }
    ],
    related:["10-yaygin-saglik-sorunu","asi-takvimi","goz-yasi-lekeleri"]
  },
  {
    slug:"goz-yasi-lekeleri", emoji:"👁️", tag:"Göz Sağlığı", min:6,
    date:"2026-01-25", updated:"2026-05-20",
    author:"Dr. Zeynep Acar", role:"Veteriner Davranış Uzmanı",
    title:"Göz Yaşı Lekeleri: Nedenler, Temizlik ve Tedavi",
    intro:"Göz altı kahverengi-kırmızı lekeleri (epiphora) beyaz ve açık renkli Poodle'larda sık görülen kozmetik bir sorundur — ancak bazı vakalarda altta yatan tıbbi bir duruma işaret edebilir.",
    sections:[
      { heading:"Neden Oluşur?",
        content:"",
        list:["Gözyaşı kanalı tıkanıklığı veya anatomik darlık","Tüy ve kirpik tahrişi (trichiasis, distichiasis)","Gıda alerjisi veya tahıl hassasiyeti","Konjonktivit, üveit","Glokom (göz içi basınç artışı)"] },
      { heading:"Günlük Temizlik Rutini",
        content:"",
        list:["Sabah ıslak yumuşak bezle göz altını silin (içten dışa)","Poodle göz mendili kullanın","Leke bölgesini kuru bırakın — ıslaklık mantar ürer","Göz önü tüyleri kısa kesin"] },
      { heading:"Beslenme ile Yönetim",
        content:"",
        list:["Mısır, soya, buğday içermeyen mama 8 hafta deneyin","Filtreli içme suyu (klor ve demir azaltır)","Tylosin katkılı su: sadece veteriner önerisiyle"] },
      { heading:"Veteriner Tedavileri",
        content:"",
        list:["Kanal yıkama + göz muayenesi","Mantar/bakteri kaynaklıysa topikal tedavi","Göz içi basıncı ölçümü (glokom ekarte için)","Cerrahi kanal açma (kronik tıkanıklıkta)"],
        tip:"Leke aniden koyulaşır, gözde kızarıklık/kaşıma/çapak gelişirse hemen veterinere gidin — bu kozmetik değil tıbbi bir sorundur." }
    ],
    related:["10-yaygin-saglik-sorunu","dis-sagligi-periodontal","asi-takvimi"]
  },
];

/* ─── Acil Belirtiler ────────────────────────────────── */
interface WarnSign {
  sign: string; urgent: boolean;
  detail: string; actions: string[];
}
const WARNING_SIGNS: WarnSign[] = [
  { sign:"Kanlı dışkı veya kusma", urgent:true,
    detail:"Parvo, zehirlenme veya iç kanama belirtisi olabilir. Renk ve yoğunluğa dikkat edin.",
    actions:["Suyu durdurmayın — dehidrasyon riskine karşı","Son yenilen şeyi not alın","Hemen acil veteriner klinikleyin"] },
  { sign:"Nefes darlığı", urgent:true,
    detail:"Kalp sorunu, plevral efüzyon, trakea çökmesi veya alerjik reaksiyon olabilir.",
    actions:["Köpeği sakin tutun, hareket ettirmeyin","Ağzında yabancı cisim var mı kontrol edin","ACİL — dakikalar içinde veterinere"] },
  { sign:"Titreme veya nöbet", urgent:true,
    detail:"Epilepsi, hipoglisemi, zehirlenme veya beyin sorununa işaret edebilir.",
    actions:["Nöbet süresini ölçün, video çekin","Etrafındaki keskin nesneleri kaldırın","Dokunmayın — ısırma riski var","5 dk'dan uzun sürerse acil veteriner"] },
  { sign:"İştah kaybı (>24 saat)", urgent:false,
    detail:"Birçok nedeni olabilir: stres, diş ağrısı, gastrit, organ sorunları.",
    actions:["Su içiyor mu takip edin","Son 48 saatte tükettiği şeyleri listeleyin","24 saat içinde veterinere bildirin"] },
  { sign:"Topallama (>12 saat)", urgent:false,
    detail:"Patellar luksasyon, pati yarası, ligament hasarı veya artrit olabilir.",
    actions:["Patiyi dikkatle inceleyin (kesik, diken, şişlik)","Yürümeye zorlamayın","Bir gün içinde veterinere görünün"] },
  { sign:"Aşırı su içme", urgent:false,
    detail:"Diyabet, Cushing sendromu, böbrek hastalığı veya pyometra (dişilerde) belirtisi olabilir.",
    actions:["24 saatlik su tüketimini ölçün (30 ml/kg normalin üstü anormaldir)","İdrar rengini ve sıklığını gözlemleyin","Haftaya veteriner randevusu alın"] },
];

/* ─── Belirti Sihirbazı ──────────────────────────────── */
const SYMPTOMS = [
  "Kusma", "İshal / Kanlı dışkı", "Nefes darlığı", "Topallama",
  "Nöbet / Titreme", "İştah kaybı", "Aşırı su içme",
  "Letarji / İsteksizlik", "Kaşıma / Tüy dökülmesi", "Göz / Burun akıntısı",
];

type Severity = "mild"|"moderate"|"severe";
type Duration = "lt6h"|"6to24h"|"gt24h";
interface WizardState { step:number; selected:string[]; severity:Severity|""; duration:Duration|""; }

function getRecommendation(state: WizardState): { level:"urgent"|"soon"|"watch"; text:string; advice:string[] } {
  const { selected, severity, duration } = state;
  const hasUrgent = selected.some(s => ["Nefes darlığı","Nöbet / Titreme","İshal / Kanlı dışkı"].includes(s));
  if (hasUrgent || severity === "severe") return {
    level:"urgent",
    text:"🚨 Hemen Acil Veterinere Gidin",
    advice:["Beklemeden en yakın acil veteriner kliniğine gidin","Yol boyunca köpeği sakin tutun, su dışında hiçbir şey vermeyin","Kliniği arayarak önceden haber verin"]
  };
  if (severity === "moderate" || duration === "gt24h") return {
    level:"soon",
    text:"⚠️ 24 Saat İçinde Veterinere Götürün",
    advice:["Bu gün veya yarın randevu alın","Su içimini ve idrarını gözlemleyin","Belirtileri kötüleşirse acil veterinere geçin"]
  };
  return {
    level:"watch",
    text:"🟡 Evde Gözlemleyin",
    advice:["24–48 saat dikkatle takip edin","İyi su içilmesini sağlayın","Belirtiler devam eder veya kötüleşirse veterinere gidin","Beslenme değişikliği, stres veya egzersiz geçmişi düşünün"]
  };
}

function SymptomWizard({ onClose }: { onClose: () => void }) {
  const [state, setState] = useState<WizardState>({ step:1, selected:[], severity:"", duration:"" });

  const toggle = (s: string) => setState(p => ({
    ...p,
    selected: p.selected.includes(s) ? p.selected.filter(x=>x!==s) : [...p.selected, s]
  }));
  const next = () => setState(p => ({ ...p, step: p.step + 1 }));
  const back = () => setState(p => ({ ...p, step: p.step - 1 }));
  const reset = () => setState({ step:1, selected:[], severity:"", duration:"" });

  const rec = state.step === 3 ? getRecommendation(state) : null;
  const recColor = rec?.level === "urgent" ? "#EF4444" : rec?.level === "soon" ? "#F59E0B" : "#22C55E";

  return (
    <div style={{ position:"fixed", inset:0, zIndex:600, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.5)" }} />
      <div style={{ position:"relative", background:"#fff", borderRadius:20, maxWidth:540, width:"calc(100% - 24px)", maxHeight:"90vh", display:"flex", flexDirection:"column", overflow:"hidden", boxShadow:"0 32px 80px rgba(0,0,0,0.22)" }}>
        {/* Header */}
        <div style={{ padding:"14px 18px 12px", borderBottom:"1px solid #f2f2f2", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <div>
            <div style={{ fontSize:15, fontWeight:900, color:"#111" }}>🩺 Belirti Kontrol Sihirbazı</div>
            <div style={{ fontSize:11, color:"#aaa" }}>Adım {state.step}/3</div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"#aaa" }}><X size={20} /></button>
        </div>
        {/* Progress */}
        <div style={{ height:3, background:"#f2f2f2" }}>
          <div style={{ height:"100%", background:"#EF4444", width:`${(state.step/3)*100}%`, transition:"width 0.3s" }} />
        </div>

        <div style={{ overflowY:"auto", padding:"20px 20px 28px", flex:1 }}>
          {/* Step 1: Symptoms */}
          {state.step === 1 && (
            <>
              <div style={{ fontSize:15, fontWeight:800, color:"#111", marginBottom:6 }}>Hangi belirtiler var?</div>
              <div style={{ fontSize:12, color:"#888", marginBottom:16 }}>Birden fazla seçebilirsiniz.</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {SYMPTOMS.map(s => (
                  <button key={s} onClick={() => toggle(s)}
                    style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 14px", borderRadius:12, border:"1.5px solid", borderColor:state.selected.includes(s)?"#EF4444":"#e8e8e8", background:state.selected.includes(s)?"#FFF1F2":"#fff", cursor:"pointer", textAlign:"left" }}>
                    <div style={{ width:20, height:20, borderRadius:6, border:"2px solid", borderColor:state.selected.includes(s)?"#EF4444":"#ddd", background:state.selected.includes(s)?"#EF4444":"#fff", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      {state.selected.includes(s) && <span style={{ color:"#fff", fontSize:12, fontWeight:900 }}>✓</span>}
                    </div>
                    <span style={{ fontSize:13.5, fontWeight:600, color:state.selected.includes(s)?"#EF4444":"#333" }}>{s}</span>
                  </button>
                ))}
              </div>
              <button disabled={state.selected.length===0} onClick={next}
                style={{ marginTop:20, width:"100%", height:48, borderRadius:14, border:"none", background:state.selected.length===0?"#f0f0f0":"#EF4444", color:state.selected.length===0?"#ccc":"#fff", fontSize:14, fontWeight:800, cursor:state.selected.length===0?"default":"pointer" }}>
                Devam Et →
              </button>
            </>
          )}

          {/* Step 2: Severity + Duration */}
          {state.step === 2 && (
            <>
              <div style={{ fontSize:15, fontWeight:800, color:"#111", marginBottom:16 }}>Belirtilerin şiddeti ve süresi?</div>
              <div style={{ fontSize:13, fontWeight:700, color:"#555", marginBottom:8 }}>Şiddet</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:20 }}>
                {([["mild","Hafif — normal davranışını sürdürüyor"],["moderate","Orta — dikkat çekiyor, rahatsız görünüyor"],["severe","Ağır — hareket edemiyor, acı belirgin"]] as const).map(([v,l]) => (
                  <button key={v} onClick={() => setState(p=>({...p,severity:v}))}
                    style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 14px", borderRadius:12, border:"1.5px solid", borderColor:state.severity===v?"#EF4444":"#e8e8e8", background:state.severity===v?"#FFF1F2":"#fff", cursor:"pointer", textAlign:"left" }}>
                    <div style={{ width:18, height:18, borderRadius:"50%", border:"2px solid", borderColor:state.severity===v?"#EF4444":"#ddd", background:state.severity===v?"#EF4444":"#fff", flexShrink:0 }} />
                    <span style={{ fontSize:13, fontWeight:600, color:state.severity===v?"#EF4444":"#333" }}>{l}</span>
                  </button>
                ))}
              </div>
              <div style={{ fontSize:13, fontWeight:700, color:"#555", marginBottom:8 }}>Ne zamandan beri?</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {([["lt6h","6 saatten az"],["6to24h","6–24 saat"],["gt24h","24 saatten fazla"]] as const).map(([v,l]) => (
                  <button key={v} onClick={() => setState(p=>({...p,duration:v}))}
                    style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 14px", borderRadius:12, border:"1.5px solid", borderColor:state.duration===v?"#EF4444":"#e8e8e8", background:state.duration===v?"#FFF1F2":"#fff", cursor:"pointer", textAlign:"left" }}>
                    <div style={{ width:18, height:18, borderRadius:"50%", border:"2px solid", borderColor:state.duration===v?"#EF4444":"#ddd", background:state.duration===v?"#EF4444":"#fff", flexShrink:0 }} />
                    <span style={{ fontSize:13, fontWeight:600, color:state.duration===v?"#EF4444":"#333" }}>{l}</span>
                  </button>
                ))}
              </div>
              <div style={{ display:"flex", gap:10, marginTop:20 }}>
                <button onClick={back} style={{ flex:1, height:48, borderRadius:14, border:"1.5px solid #e8e8e8", background:"#fff", color:"#555", fontSize:14, fontWeight:700, cursor:"pointer" }}>← Geri</button>
                <button disabled={!state.severity||!state.duration} onClick={next}
                  style={{ flex:2, height:48, borderRadius:14, border:"none", background:(!state.severity||!state.duration)?"#f0f0f0":"#EF4444", color:(!state.severity||!state.duration)?"#ccc":"#fff", fontSize:14, fontWeight:800, cursor:(!state.severity||!state.duration)?"default":"pointer" }}>
                  Sonucu Gör →
                </button>
              </div>
            </>
          )}

          {/* Step 3: Result */}
          {state.step === 3 && rec && (
            <>
              <div style={{ background:rec.level==="urgent"?"#FEF2F2":rec.level==="soon"?"#FFFBEB":"#F0FDF4", borderRadius:16, padding:"20px 18px", marginBottom:20, textAlign:"center" }}>
                <div style={{ fontSize:22, fontWeight:900, color:recColor, marginBottom:8 }}>{rec.text}</div>
                <div style={{ fontSize:12, color:"#888" }}>Seçilen belirtiler: {state.selected.join(", ")}</div>
              </div>
              <div style={{ fontSize:13, fontWeight:800, color:"#333", marginBottom:10 }}>Ne yapmalısınız?</div>
              {rec.advice.map((a,i) => (
                <div key={i} style={{ display:"flex", gap:9, marginBottom:9 }}>
                  <span style={{ color:recColor, fontWeight:800, flexShrink:0, marginTop:1 }}>{i+1}.</span>
                  <span style={{ fontSize:13.5, color:"#444", lineHeight:1.65 }}>{a}</span>
                </div>
              ))}
              <div style={{ marginTop:16, padding:"12px 14px", background:"#F9FAFB", borderRadius:12, fontSize:12, color:"#888", lineHeight:1.6 }}>
                ⚠️ Bu araç yalnızca yönlendirme amaçlıdır. Kesin tanı ve tedavi için mutlaka veterinerinize başvurun.
              </div>
              <div style={{ display:"flex", gap:10, marginTop:20 }}>
                <button onClick={reset} style={{ flex:1, height:48, borderRadius:14, border:"1.5px solid #e8e8e8", background:"#fff", color:"#555", fontSize:13, fontWeight:700, cursor:"pointer" }}>Yeniden Dene</button>
                <button onClick={onClose} style={{ flex:1, height:48, borderRadius:14, border:"none", background:"#EF4444", color:"#fff", fontSize:13, fontWeight:800, cursor:"pointer" }}>Kapat</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Article Detail ─────────────────────────────────── */
function ArticleDetail({ article, onClose, onOpenWizard, allArticles }: {
  article: Article; onClose: () => void; onOpenWizard: () => void; allArticles: Article[];
}) {
  const [liked, setLiked] = useState(() => {
    try { return !!localStorage.getItem("yp_sl_liked_" + article.slug); } catch { return false; }
  });
  const [, navigate] = useLocation();

  const toggleLike = () => {
    const next = !liked;
    setLiked(next);
    try { next ? localStorage.setItem("yp_sl_liked_"+article.slug,"1") : localStorage.removeItem("yp_sl_liked_"+article.slug); } catch {}
  };
  const share = () => {
    const url = window.location.origin + "/yourpoodle/saglik?a=" + article.slug;
    if (navigator.share) navigator.share({ title: article.title, url }).catch(()=>{});
    else navigator.clipboard.writeText(url).then(()=>alert("Bağlantı kopyalandı!")).catch(()=>{});
  };

  const cs = CAT_STYLE[article.tag] || { bg:"#FFF1F2", color:"#EF4444" };
  const related = allArticles.filter(a => article.related.includes(a.slug)).slice(0,3);

  useEffect(() => {
    const schema = {
      "@context":"https://schema.org","@type":"Article",
      "headline":article.title,"datePublished":article.date,"dateModified":article.updated,
      "author":{"@type":"Person","name":article.author,"jobTitle":article.role},
      "publisher":{"@type":"Organization","name":"YourPoodle","url":"https://www.yourpoodle.com"},
    };
    const id = "yp-sl-art-schema";
    const el = document.getElementById(id);
    if (el) el.textContent = JSON.stringify(schema);
    else { const s = document.createElement("script"); s.id=id; s.type="application/ld+json"; s.textContent=JSON.stringify(schema); document.head.appendChild(s); }
    return () => { document.getElementById(id)?.remove(); };
  }, [article]);

  return (
    <div style={{ position:"fixed", inset:0, zIndex:500, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.45)" }} />
      <div className="saglik-modal-inner" style={{ position:"relative", background:"#fff", borderRadius:20, maxWidth:680, width:"calc(100% - 24px)", maxHeight:"93vh", display:"flex", flexDirection:"column", overflow:"hidden", boxShadow:"0 32px 80px rgba(0,0,0,0.22)" }}>
        {/* Top bar */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 18px 10px", borderBottom:"1px solid #f2f2f2", flexShrink:0 }}>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:6, color:"#555", fontSize:13.5, fontWeight:700 }}>
            <ArrowLeft size={15} strokeWidth={2.5} /> Geri
          </button>
          <div style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:"#aaa" }}>
            <span style={{ cursor:"pointer", color:"#EF4444" }} onClick={onClose}>Sağlık</span>
            <ChevronRight size={10} />
            <span style={{ background:cs.bg, color:cs.color, padding:"2px 8px", borderRadius:20, fontWeight:700 }}>{article.tag}</span>
          </div>
          <div style={{ display:"flex", gap:6 }}>
            <button onClick={toggleLike} style={{ background:"none", border:"none", cursor:"pointer", padding:4 }}>
              <Heart size={20} color={liked?"#FF4566":"#ccc"} fill={liked?"#FF4566":"none"} strokeWidth={2} />
            </button>
            <button onClick={share} style={{ background:"none", border:"none", cursor:"pointer", padding:4 }}>
              <Share2 size={20} color="#ccc" strokeWidth={2} />
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
            <div style={{ width:38, height:38, borderRadius:"50%", background:"#FFF1F2", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>👩‍⚕️</div>
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
          {article.sections.map((sec,i) => (
            <div key={i} style={{ marginBottom:22 }}>
              {sec.heading && <h3 style={{ fontSize:15.5, fontWeight:800, color:"#111", marginBottom:10, paddingBottom:6, borderBottom:`2px solid ${cs.bg}` }}>{sec.heading}</h3>}
              {sec.content && <p style={{ fontSize:14, color:"#555", lineHeight:1.8, marginBottom:sec.list?10:0 }}>{sec.content}</p>}
              {sec.list && (
                <ul style={{ margin:0, paddingLeft:0, listStyle:"none" }}>
                  {sec.list.map((item,j) => (
                    <li key={j} style={{ display:"flex", gap:9, fontSize:13.5, color:"#444", lineHeight:1.65, marginBottom:6 }}>
                      <span style={{ color:cs.color, fontWeight:700, flexShrink:0, marginTop:1 }}>•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {sec.tip && (
                <div style={{ marginTop:14, padding:"13px 16px", background:"#FFF1F2", borderRadius:12, borderLeft:"3px solid #EF4444" }}>
                  <div style={{ fontSize:11, fontWeight:800, color:"#EF4444", marginBottom:5 }}>⚠️ ÖNEMLİ</div>
                  <div style={{ fontSize:13, color:"#555", lineHeight:1.65 }}>{sec.tip}</div>
                  <button onClick={onOpenWizard}
                    style={{ marginTop:10, padding:"7px 14px", background:"#EF4444", color:"#fff", border:"none", borderRadius:20, fontSize:12, fontWeight:700, cursor:"pointer" }}>
                    🩺 Belirti Kontrol Sihirbazı →
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Vet warning */}
          <div style={{ marginTop:24, padding:"14px 16px", background:"#FFF7ED", borderRadius:12, borderLeft:"3px solid #F59E0B" }}>
            <div style={{ fontSize:11, fontWeight:800, color:"#F59E0B", marginBottom:5 }}>⚠️ BİLGİLENDİRME</div>
            <div style={{ fontSize:13, color:"#555", lineHeight:1.65 }}>Bu makale bilgilendirme amaçlıdır. Sağlık sorunları için mutlaka veterinerinize başvurun.</div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div style={{ marginTop:28, paddingTop:22, borderTop:"1px solid #f2f2f2" }}>
              <div style={{ fontSize:13, fontWeight:800, color:"#333", marginBottom:12 }}>📖 İlgili Makaleler</div>
              <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
                {related.map(r => {
                  const rcs = CAT_STYLE[r.tag]||{bg:"#FFF1F2",color:"#EF4444"};
                  return (
                    <button key={r.slug}
                      onClick={() => { const e=new CustomEvent("yp-saglik-open",{detail:r.slug}); window.dispatchEvent(e); onClose(); }}
                      style={{ display:"flex", gap:12, alignItems:"center", padding:"11px", background:"#FAFAFA", borderRadius:12, cursor:"pointer", border:"1.5px solid #F3F4F6", textAlign:"left", width:"100%" }}>
                      <div style={{ fontSize:22, width:42, height:42, background:rcs.bg, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{r.emoji}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:10.5, fontWeight:700, color:rcs.color, marginBottom:3 }}>{r.tag}</div>
                        <div style={{ fontSize:13, fontWeight:700, color:"#111", lineHeight:1.4 }}>{r.title}</div>
                      </div>
                      <ChevronRight size={14} color="#ccc" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Footer ─────────────────────────────────────────── */
function SaglikFooter({ onNav }: { onNav:(href:string)=>void }) {
  return (
    <footer style={{ background:"#111", padding:"40px 24px 28px" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:28, marginBottom:28 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:10 }}>
              <div style={{ width:28, height:28, borderRadius:7, background:"linear-gradient(135deg,#7C3AED,#A855F7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>🐩</div>
              <span style={{ fontSize:14, fontWeight:900, color:"#fff" }}>YourPoodle</span>
            </div>
            <p style={{ fontSize:12, color:"#6B7280", lineHeight:1.6 }}>Toy Poodle sahipleri için Türkiye'nin en kapsamlı bakım ve bilgi platformu.</p>
          </div>
          {[
            { title:"Platform", links:[["Rehber","/yourpoodle/rehber"],["Sağlık","/yourpoodle/saglik"],["AI Asistan","/yourpoodle/ai-asistan"],["Mağaza","/yourpoodle/magaza"]] },
            { title:"Destek",   links:[["İletişim","/iletisim"],["Sipariş Takip","/siparis-takip"]] },
            { title:"Yasal",    links:[["Gizlilik","/gizlilik"],["KVKK","/kvkk"],["Çerez","/cerez-politikasi"]] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize:10, fontWeight:900, color:"#4B5563", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>{col.title}</div>
              {col.links.map(([l,h]) => (
                <button key={l} onClick={()=>onNav(h as string)}
                  style={{ display:"block", fontSize:12.5, color:"#6B7280", marginBottom:7, cursor:"pointer", background:"none", border:"none", padding:0, textAlign:"left" }}>
                  {l}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop:"1px solid #1F2937", paddingTop:18 }}>
          <span style={{ fontSize:11, color:"#4B5563" }}>© 2026 Sizpa İnternet Tic. Ltd. Şti. · info@yourpoodle.com</span>
        </div>
      </div>
    </footer>
  );
}

/* ─── Main Page ──────────────────────────────────────── */
export default function Saglik() {
  const [, navigate] = useLocation();
  const [selected, setSelected]         = useState<Article|null>(null);
  const [showWizard, setShowWizard]     = useState(false);
  const [expandedSign, setExpandedSign] = useState<string|null>(null);
  const [activeCat, setActiveCat]       = useState("Tümü");
  const [search, setSearch]             = useState("");

  /* SEO */
  useEffect(() => {
    document.title = PAGE_TITLE;
    const setMeta = (attr:string, key:string, val:string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement|null;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr,key); document.head.appendChild(el); }
      el.content = val;
    };
    setMeta("property","og:title","Poodle Sağlık Rehberi | YourPoodle");
    setMeta("property","og:description",PAGE_DESC);
    setMeta("property","og:url","https://www.yourpoodle.com/yourpoodle/saglik");
    setMeta("name","description",PAGE_DESC);
  }, []);

  /* URL param: ?a=slug */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("a");
    if (slug) { const found = ARTICLES.find(a=>a.slug===slug); if (found) setSelected(found); }
  }, []);

  /* cross-component open event */
  useEffect(() => {
    const handler = (e:Event) => {
      const slug = (e as CustomEvent).detail as string;
      const found = ARTICLES.find(a=>a.slug===slug);
      if (found) { setSelected(found); window.history.pushState({},"","/yourpoodle/saglik?a="+slug); }
    };
    window.addEventListener("yp-saglik-open", handler);
    return () => window.removeEventListener("yp-saglik-open", handler);
  }, []);

  const openArticle = useCallback((a:Article) => {
    setSelected(a);
    window.history.pushState({},"","/yourpoodle/saglik?a="+a.slug);
  }, []);
  const closeArticle = useCallback(() => {
    setSelected(null);
    window.history.pushState({},"","/yourpoodle/saglik");
  }, []);
  const openWizard = useCallback(() => { setSelected(null); setShowWizard(true); }, []);

  const filtered = ARTICLES.filter(a =>
    (activeCat==="Tümü" || a.tag===activeCat) &&
    (search==="" || a.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <YPLayout activeLink="/yourpoodle/saglik" bottomNavActive="/yourpoodle/bilgi">
      {/* Inline schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context":"https://schema.org","@type":"MedicalWebPage",
        "name":"Poodle Sağlık Rehberi","description":PAGE_DESC,
        "url":"https://www.yourpoodle.com/yourpoodle/saglik",
        "about":{"@type":"Thing","name":"Toy Poodle Health"},
        "publisher":{"@type":"Organization","name":"YourPoodle","url":"https://www.yourpoodle.com"}
      }) }} />
      <style>{`
        .art-row-sl:hover { background: #FFF1F2 !important; border-color: #FECACA !important; }
        .noscroll-sl::-webkit-scrollbar { display: none; }
        .noscroll-sl { -ms-overflow-style: none; scrollbar-width: none; }
        .warn-item { cursor: pointer; transition: background 0.15s; }
        .warn-item:hover { background: #FEE2E2 !important; }
        .cat-scroll-sl { position:relative; }
        .cat-scroll-sl::after { content:""; position:absolute; right:0; top:0; bottom:0; width:36px; background:linear-gradient(to right,transparent,#fff); pointer-events:none; }
        @media (min-width: 640px) {
          .saglik-art-grid { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 14px !important; }
          .saglik-warning-grid { display: grid !important; grid-template-columns: 1fr 1fr; gap: 8px !important; }
          .saglik-tools-grid { display: grid !important; grid-template-columns: repeat(3,1fr) !important; gap: 14px !important; }
        }
        @media (max-width: 639px) {
          .saglik-modal-inner { border-radius: 16px 16px 0 0 !important; position: fixed !important; bottom: 0 !important; top: auto !important; left: 0 !important; right: 0 !important; width: 100% !important; max-width: 100% !important; max-height: 92vh !important; }
        }
      `}</style>

      {showWizard && <SymptomWizard onClose={() => setShowWizard(false)} />}
      {selected && <ArticleDetail article={selected} onClose={closeArticle} onOpenWizard={openWizard} allArticles={ARTICLES} />}

      {/* ── Hero ── */}
      <div style={{ background:"linear-gradient(135deg,#EF4444,#F87171)", padding:"28px 24px 32px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-30, right:-20, width:130, height:130, borderRadius:"50%", background:"rgba(255,255,255,0.1)" }} />
        <div style={{ position:"absolute", bottom:-20, left:-10, width:80, height:80, borderRadius:"50%", background:"rgba(255,255,255,0.07)" }} />
        <div style={{ fontSize:40, marginBottom:10 }}>🏥</div>
        <h1 style={{ fontSize:26, fontWeight:900, color:"#fff", marginBottom:6, lineHeight:1.2 }}>Poodle Sağlık Rehberi</h1>
        <p style={{ fontSize:14, color:"rgba(255,255,255,0.9)", lineHeight:1.5, marginBottom:0 }}>Poodle'ınızın sağlığını koruyun — veteriner onaylı içerikler</p>
      </div>

      {/* ── Acil Durum Belirtileri ── */}
      <div style={{ padding:"20px 16px 0" }}>
        <div style={{ fontSize:15, fontWeight:800, color:"#1a1a1a", marginBottom:12 }}>🚨 Acil Durum Belirtileri</div>
        <div style={{ background:"#FFF1F2", borderRadius:16, padding:"14px 14px 16px" }}>
          <div className="saglik-warning-grid" style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:14 }}>
            {WARNING_SIGNS.map(ws => (
              <div key={ws.sign}>
                <div className="warn-item" onClick={() => setExpandedSign(expandedSign===ws.sign?null:ws.sign)}
                  style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:10, background:expandedSign===ws.sign?"#FEE2E2":"#fff", border:"1.5px solid", borderColor:expandedSign===ws.sign?"#FECACA":"#f3f3f3" }}>
                  {ws.urgent
                    ? <AlertTriangle size={16} color="#EF4444" style={{ flexShrink:0 }} />
                    : <CheckCircle2 size={16} color="#F59E0B" style={{ flexShrink:0 }} />}
                  <span style={{ fontSize:13, color:ws.urgent?"#EF4444":"#555", fontWeight:ws.urgent?700:500, flex:1 }}>{ws.sign}</span>
                  {ws.urgent && <span style={{ fontSize:9, fontWeight:800, background:"#EF4444", color:"#fff", borderRadius:4, padding:"2px 5px", flexShrink:0 }}>ACİL</span>}
                  {expandedSign===ws.sign ? <ChevronUp size={14} color="#aaa" style={{ flexShrink:0 }} /> : <ChevronDown size={14} color="#aaa" style={{ flexShrink:0 }} />}
                </div>
                {expandedSign===ws.sign && (
                  <div style={{ background:"#fff", border:"1.5px solid #FECACA", borderTop:"none", borderRadius:"0 0 10px 10px", padding:"12px 14px" }}>
                    <p style={{ fontSize:12.5, color:"#555", lineHeight:1.65, marginBottom:10 }}>{ws.detail}</p>
                    {ws.actions.map((a,i) => (
                      <div key={i} style={{ display:"flex", gap:8, marginBottom:6, fontSize:12.5, color:"#333" }}>
                        <span style={{ color:"#EF4444", fontWeight:700, flexShrink:0 }}>{i+1}.</span>
                        <span>{a}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <button onClick={() => setShowWizard(true)}
            style={{ width:"100%", height:44, borderRadius:11, border:"none", background:"#EF4444", color:"#fff", fontSize:13.5, fontWeight:800, cursor:"pointer" }}>
            🩺 Belirti Kontrol Sihirbazını Aç
          </button>
        </div>
      </div>

      {/* ── Sağlık Araçları ── */}
      <div style={{ padding:"20px 16px 0" }}>
        <div style={{ fontSize:15, fontWeight:800, color:"#1a1a1a", marginBottom:12 }}>🔧 Sağlık Araçları</div>
        <div className="saglik-tools-grid" style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {[
            { emoji:"💉", title:"Aşı Takvimi", desc:"Yavrudan yetişkine eksiksiz aşı programı", href:"/yourpoodle/bilgi", label:"Takvimi Gör →", bg:"#F0FDF4", color:"#16A34A" },
            { emoji:"⚖️", title:"İdeal Kilo Hesabı", desc:"Toy Poodle için sağlıklı kilo aralığı", href:"/yourpoodle/bilgi", label:"Hesapla →", bg:"#EFF6FF", color:"#2563EB" },
            { emoji:"🎂", title:"Yaş Hesaplama", desc:"Köpek yaşını insan yaşına çevir", href:"/yourpoodle/bilgi", label:"Hesapla →", bg:"#FFF7ED", color:"#EA580C" },
          ].map(t => (
            <button key={t.title} onClick={() => navigate(t.href)}
              style={{ background:t.bg, borderRadius:14, padding:"16px 18px", border:"none", cursor:"pointer", textAlign:"left", display:"flex", flexDirection:"column", gap:6 }}>
              <div style={{ fontSize:26 }}>{t.emoji}</div>
              <div style={{ fontSize:14, fontWeight:800, color:"#111" }}>{t.title}</div>
              <div style={{ fontSize:11.5, color:"#888", lineHeight:1.5 }}>{t.desc}</div>
              <div style={{ fontSize:12, fontWeight:700, color:t.color, marginTop:4 }}>{t.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Arama + Kategori Filtresi ── */}
      <div style={{ padding:"20px 16px 0" }}>
        {/* Search */}
        <div style={{ display:"flex", alignItems:"center", background:"#F7F7F7", border:"1.5px solid #ececec", borderRadius:14, height:48, overflow:"hidden", marginBottom:12 }}>
          <div style={{ paddingLeft:13, color:"#bbb", display:"flex" }}><Search size={17} strokeWidth={2} /></div>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Sağlık konusu ara..."
            style={{ flex:1, border:"none", outline:"none", fontSize:14, fontWeight:600, color:"#333", background:"transparent", padding:"0 11px" }} />
          {search && <button onClick={()=>setSearch("")} style={{ background:"none", border:"none", cursor:"pointer", paddingRight:11, color:"#bbb" }}><X size={15} strokeWidth={2}/></button>}
        </div>
        {/* Category pills */}
        <div className="cat-scroll-sl" style={{ position:"relative" }}>
          <div className="noscroll-sl" style={{ display:"flex", gap:7, overflowX:"auto", paddingBottom:2, paddingRight:36 }}>
            {CATS.map(c => (
              <button key={c} onClick={() => setActiveCat(c)}
                style={{ flexShrink:0, padding:"6px 15px", borderRadius:20, border:"1.5px solid", borderColor:activeCat===c?"#EF4444":"#e8e8e8", background:activeCat===c?"#EF4444":"#fff", color:activeCat===c?"#fff":"#555", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sağlık Yazıları ── */}
      <div style={{ padding:"16px 16px 0" }}>
        <div style={{ fontSize:15, fontWeight:800, color:"#1a1a1a", marginBottom:12 }}>📖 Sağlık Yazıları</div>
        {filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"40px 20px", color:"#aaa" }}>
            <div style={{ fontSize:38, marginBottom:10 }}>🔍</div>
            <div style={{ fontSize:14, fontWeight:700, color:"#555", marginBottom:5 }}>
              {search ? `"${search}" için makale bulunamadı` : "Bu kategoride henüz makale yok"}
            </div>
            <button onClick={() => { setSearch(""); setActiveCat("Tümü"); }}
              style={{ marginTop:12, padding:"9px 22px", borderRadius:20, background:"#EF4444", color:"#fff", border:"none", cursor:"pointer", fontSize:13, fontWeight:700 }}>
              Tümünü Göster
            </button>
          </div>
        ) : (
          <div className="saglik-art-grid" style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {filtered.map(a => {
              const cs = CAT_STYLE[a.tag]||{bg:"#FFF1F2",color:"#EF4444"};
              return (
                <button key={a.slug} className="art-row-sl" onClick={() => openArticle(a)}
                  style={{ display:"flex", gap:13, alignItems:"center", padding:"13px", background:"#FAFAFA", borderRadius:14, cursor:"pointer", border:"1.5px solid #F3F4F6", textAlign:"left", width:"100%", transition:"all 0.15s" }}>
                  <div style={{ width:56, height:56, borderRadius:13, background:cs.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>{a.emoji}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:cs.color, marginBottom:4 }}>{a.tag}</div>
                    <div style={{ fontSize:13.5, fontWeight:700, color:"#1a1a1a", lineHeight:1.4, marginBottom:4 }}>{a.title}</div>
                    <div style={{ fontSize:11, color:"#aaa" }}>{a.author} · <span style={{ display:"inline-flex", alignItems:"center", gap:2 }}><Clock size={10} strokeWidth={2}/>{a.min} dk</span></div>
                  </div>
                  <ChevronRight size={16} color="#ccc" style={{ flexShrink:0 }} />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── CTA ── */}
      <div style={{ margin:"24px 16px 0", background:"#F0FDF4", borderRadius:18, padding:"20px", textAlign:"center" }}>
        <div style={{ fontSize:26, marginBottom:8 }}>💊</div>
        <div style={{ fontSize:14, fontWeight:800, color:"#1a1a1a", marginBottom:4 }}>Veteriner Ürünleri</div>
        <div style={{ fontSize:12, color:"#888", lineHeight:1.5, marginBottom:14 }}>Sağlık takviyeleri, iç ve dış parazit ürünleri.</div>
        <button onClick={() => navigate("/yourpoodle/magaza?kategori=saglik")}
          style={{ height:42, borderRadius:12, border:"none", background:"#22C55E", color:"#fff", fontSize:13, fontWeight:800, padding:"0 26px", cursor:"pointer" }}>
          Sağlık Ürünleri →
        </button>
      </div>

      <div style={{ height:24 }} />
      <SaglikFooter onNav={navigate} />
    </YPLayout>
  );
}
