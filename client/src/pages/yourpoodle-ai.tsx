import { useState } from "react";
import { Link } from "wouter";
import { ChevronRight, Sparkles, Send, Bot } from "lucide-react";
import YourPoodleShell from "@/components/yourpoodle/YourPoodleShell";

const AI_TOOLS = [
  { id: "mama", icon: "🍖", title: "AI Mama Danışmanı", desc: "Köpeğinizin yaşı, kilosu ve sağlık durumuna göre kişisel mama önerisi.", color: "text-orange-600", bgColor: "bg-orange-50 border-orange-200", questions: ["Kaç aylık?", "Kaç kg?", "Alerjisi var mı?"] },
  { id: "vet", icon: "🏥", title: "AI Veteriner Ön Değerlendirme", desc: "Belirtileri girin, olası nedenleri ve aciliyet durumunu öğrenin.", color: "text-red-600", bgColor: "bg-red-50 border-red-200", questions: ["Belirtiler neler?", "Ne zamandan beri?", "İştahı var mı?"] },
  { id: "egitim", icon: "🎓", title: "AI Eğitim Koçu", desc: "Köpeğinize özel haftalık eğitim planı oluşturun.", color: "text-blue-600", bgColor: "bg-blue-50 border-blue-200", questions: ["Kaç aylık?", "Hangi komutları biliyor?", "Sorun davranışı var mı?"] },
  { id: "bakim", icon: "✂️", title: "AI Bakım Uzmanı", desc: "Tüy tipi ve yaşam tarzına göre kişisel bakım takvimi.", color: "text-purple-600", bgColor: "bg-purple-50 border-purple-200", questions: ["Tüy uzunluğu?", "Dışarıda mı yaşıyor?", "Son tıraş ne zaman?"] },
  { id: "urun", icon: "🛍️", title: "AI Ürün Önerisi", desc: "İhtiyacınıza ve bütçenize en uygun ürünleri bulun.", color: "text-pink-600", bgColor: "bg-pink-50 border-pink-200", questions: ["Hangi kategori?", "Bütçe?", "Marka tercihi?"] },
];

const SAMPLE_QA = [
  { q: "Köpeğim 3 aylık ve hiç mama yemiyor. Ne yapmalıyım?", a: "3 aylık yavrularda iştahsızlık birkaç nedenden kaynaklanabilir: ortam değişikliği stresi, diş çıkarma ağrısı veya yanlış mama seçimi. İlk olarak mamayı ıslak (konserve) mama ile karıştırmayı deneyin. 24 saatten uzun süren iştahsızlıkta veterinere başvurun." },
  { q: "Toy Poodle'ım 5 yaşında, günde ne kadar yürüyüş yapmalı?", a: "5 yaşındaki sağlıklı bir Toy Poodle için günde 2 kez, toplamda 30–45 dakika yürüyüş idealdir. Eklem sağlığı için sert zemin yerine yumuşak zemin tercih edin. Hava çok sıcak veya çok soğuksa süreyi kısaltın." },
  { q: "Göz altında kahverengi leke var, nasıl temizlenir?", a: "Gözyaşı lekeleri için günlük temizlik şarttır. Veteriner onaylı göz temizleme pedi veya serum fizyolojik emdirilmiş pamuk kullanın. İçten dışa doğru silin. Kronik lekelerde beslenme (saf su, hijyen düzeyi düşük su kaynağı) ve genetik faktörler incelenmelidir." },
];

export default function YourPoodleAiPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [openQ, setOpenQ] = useState<number | null>(null);

  return (
    <YourPoodleShell activeTab="guide">
      {/* HERO */}
      <section className="bg-gradient-to-br from-[#6D28D9] via-[#7C3AED] to-[#EC4899] px-5 pt-5 pb-7 rounded-b-[2rem] shadow-md">
        <div className="flex justify-between items-center">
          <div className="flex-1 pr-3">
            <div className="bg-white/20 text-white text-[11px] font-bold px-3 py-1.5 rounded-full inline-flex items-center mb-3">
              <Sparkles className="h-3 w-3 mr-1.5" /> Yapay Zekâ ile Güçlendirildi
            </div>
            <h1 className="text-[24px] font-black text-white leading-tight mb-1.5">AI Poodle Asistanı</h1>
            <p className="text-white/85 text-[13px] leading-relaxed font-semibold">
              Toy Poodle hakkında kişiselleştirilmiş öneriler sunan yapay zekâ araçları.
            </p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm p-4 rounded-2xl text-4xl flex-shrink-0">🤖</div>
        </div>
      </section>

      {/* BREADCRUMB */}
      <nav className="flex items-center gap-1.5 px-5 pt-4 pb-0 text-[12px] text-gray-400 font-semibold">
        <Link href="/yourpoodle"><span className="text-purple-600 cursor-pointer hover:underline">Ana Sayfa</span></Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/yourpoodle/rehber"><span className="text-purple-600 cursor-pointer hover:underline">Rehber</span></Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-700 font-bold">AI Rehber</span>
      </nav>

      {/* HIZLI SORU KUTUSU */}
      <section className="px-5 mt-5">
        <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-5">
          <div className="flex items-center gap-2.5 mb-3">
            <Bot className="h-5 w-5 text-purple-600" />
            <h2 className="font-black text-gray-900 text-[15px]">Poodle'ınız hakkında sorun</h2>
          </div>
          <div className="flex gap-2.5">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Örn: 3 aylık yavrum mama yemiyor..."
              className="flex-1 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-[13.5px] font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button className="bg-purple-600 text-white p-3 rounded-xl flex-shrink-0 hover:bg-purple-700 transition-colors">
              <Send className="h-5 w-5" />
            </button>
          </div>
          <p className="text-[11px] text-gray-400 font-semibold mt-2">
            🔒 AI önerileri veteriner tavsiyesinin yerini tutmaz.
          </p>
        </div>
      </section>

      {/* AI ARAÇ KARTLARı */}
      <section className="px-5 mt-5">
        <h2 className="text-[16px] font-black text-gray-900 mb-3.5">🤖 AI Araçları</h2>
        <div className="flex flex-col gap-3">
          {AI_TOOLS.map((tool) => (
            <div
              key={tool.id}
              onClick={() => setSelected(selected === tool.id ? null : tool.id)}
              className={`bg-white rounded-2xl border shadow-sm p-5 cursor-pointer transition-all ${selected === tool.id ? `border-purple-300 shadow-md` : "border-gray-100 hover:border-purple-200"}`}
            >
              <div className="flex items-start gap-3">
                <div className={`text-3xl flex-shrink-0 mt-0.5`}>{tool.icon}</div>
                <div className="flex-1">
                  <h3 className="font-black text-gray-900 text-[14.5px] leading-tight mb-1">{tool.title}</h3>
                  <p className={`text-[12px] font-semibold ${tool.color} mb-2`}>{tool.desc}</p>
                  {selected === tool.id && (
                    <div className={`rounded-xl p-3.5 mt-2 ${tool.bgColor} border`}>
                      <p className="text-[12.5px] font-black text-gray-700 mb-2.5">Şu bilgileri hazırlayın:</p>
                      <ul className="space-y-1.5">
                        {tool.questions.map((q, i) => (
                          <li key={i} className="flex items-center gap-2 text-[12.5px] font-semibold text-gray-700">
                            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-[11px] font-black text-purple-600 flex-shrink-0 shadow-sm">{i + 1}</div>
                            {q}
                          </li>
                        ))}
                      </ul>
                      <button className="mt-3.5 w-full bg-purple-600 text-white font-black text-[13px] py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors">
                        <Sparkles className="h-4 w-4" /> Bu Aracı Kullan
                      </button>
                    </div>
                  )}
                </div>
                <ChevronRight className={`h-4 w-4 text-gray-300 flex-shrink-0 mt-1 transition-transform ${selected === tool.id ? "rotate-90" : ""}`} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ÖRNEK SORULAR */}
      <section className="px-5 mt-6">
        <h2 className="text-[16px] font-black text-gray-900 mb-3.5">💬 Sık Sorulan Sorular</h2>
        <div className="space-y-2">
          {SAMPLE_QA.map((item, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenQ(openQ === i ? null : i)}
                className="w-full flex items-start justify-between p-4 text-left gap-3 hover:bg-purple-50 transition-colors"
              >
                <span className="text-[13px] font-black text-gray-800 leading-snug flex-1">{item.q}</span>
                <ChevronRight className={`h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5 transition-transform ${openQ === i ? "rotate-90" : ""}`} />
              </button>
              {openQ === i && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 text-purple-700 p-2 rounded-xl flex-shrink-0 mt-0.5">
                      <Bot className="h-4 w-4" />
                    </div>
                    <p className="text-[12.5px] text-gray-600 font-semibold leading-relaxed">{item.a}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* UYARI */}
      <section className="px-5 mt-6 mb-4">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-[12.5px] font-bold text-amber-800 leading-relaxed">
            ⚠️ <strong>Önemli Not:</strong> AI Poodle Asistanı genel bilgilendirme amaçlıdır. Tıbbi belirtiler, acil durumlar veya tedavi kararları için mutlaka bir veteriner hekime başvurun.
          </p>
        </div>
      </section>
    </YourPoodleShell>
  );
}
