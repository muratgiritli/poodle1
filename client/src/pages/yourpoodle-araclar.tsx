import { useState } from "react";
import { Link } from "wouter";
import { ChevronRight, Sparkles } from "lucide-react";
import YourPoodleShell from "@/components/yourpoodle/YourPoodleShell";

interface Tool {
  id: string;
  icon: string;
  title: string;
  desc: string;
  color: string;
  bgColor: string;
  unit: string;
  placeholder: string;
}

const TOOLS: Tool[] = [
  { id: "mama", icon: "🍖", title: "Mama Hesaplama", desc: "Günlük mama miktarını hesapla", color: "text-orange-600", bgColor: "bg-orange-50 border-orange-200", unit: "gr/gün", placeholder: "Köpeğinizin kilosu (kg)" },
  { id: "su", icon: "💧", title: "Su Hesaplama", desc: "Günlük su ihtiyacını öğren", color: "text-blue-600", bgColor: "bg-blue-50 border-blue-200", unit: "ml/gün", placeholder: "Köpeğinizin kilosu (kg)" },
  { id: "yas", icon: "🎂", title: "Yaş Hesaplama", desc: "Köpek yaşını insan yaşına çevir", color: "text-purple-600", bgColor: "bg-purple-50 border-purple-200", unit: "insan yaşı", placeholder: "Köpeğinizin yaşı" },
  { id: "kilo", icon: "⚖️", title: "İdeal Kilo", desc: "Toy Poodle için ideal kilo aralığı", color: "text-green-600", bgColor: "bg-green-50 border-green-200", unit: "kg", placeholder: "Köpeğinizin boyu (cm)" },
  { id: "asi", icon: "💉", title: "Aşı Takvimi", desc: "Doğum tarihine göre aşı planı", color: "text-red-600", bgColor: "bg-red-50 border-red-200", unit: "", placeholder: "Doğum tarihi (gg/aa/yyyy)" },
  { id: "tiras", icon: "✂️", title: "Tıraş Zamanı", desc: "Son tıraş tarihine göre hatırlatıcı", color: "text-pink-600", bgColor: "bg-pink-50 border-pink-200", unit: "", placeholder: "Son tıraş tarihi (gg/aa/yyyy)" },
];

function calcResult(id: string, val: string): string | null {
  const n = parseFloat(val);
  if (isNaN(n) || n <= 0) return null;
  switch (id) {
    case "mama": return `Günlük mama: ${Math.round(n * 30)}–${Math.round(n * 40)} gr`;
    case "su": return `Günlük su: ${Math.round(n * 50)}–${Math.round(n * 70)} ml`;
    case "yas": {
      // First 2 years = 10.5 yrs each, then 4 yrs per dog year
      const human = n <= 2 ? n * 10.5 : 21 + (n - 2) * 4;
      return `İnsan yaşı karşılığı: ~${Math.round(human)} yaş`;
    }
    case "kilo": return `Toy Poodle için ideal kilo: 2.0–3.5 kg`;
    default: return null;
  }
}

function SimpleCalculator({ tool }: { tool: Tool }) {
  const [val, setVal] = useState("");
  const result = calcResult(tool.id, val);

  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-5 ${tool.bgColor}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`text-3xl`}>{tool.icon}</div>
        <div>
          <h2 className="font-black text-gray-900 text-[15.5px]">{tool.title}</h2>
          <p className={`text-[12px] font-semibold ${tool.color}`}>{tool.desc}</p>
        </div>
      </div>
      <input
        type="text"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder={tool.placeholder}
        className="block w-full px-4 py-3 bg-white rounded-xl border border-gray-200 text-[13.5px] font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 mb-3 shadow-sm"
      />
      {result && (
        <div className={`rounded-xl px-4 py-3 ${tool.bgColor} border font-black text-[14px] ${tool.color}`}>
          ✅ {result}
        </div>
      )}
      {!result && val && (
        <div className="rounded-xl px-4 py-3 bg-gray-50 border border-gray-100 text-gray-400 font-semibold text-[13px]">
          Lütfen geçerli bir değer girin.
        </div>
      )}
    </div>
  );
}

const ASI_TAKVIMI = [
  { hafta: "6–8. Hafta", asi: "Karma Aşı — 1. Doz", notlar: "DHPP: Distemper, Hepatit, Parvo, Parainfluenza" },
  { hafta: "10–12. Hafta", asi: "Karma Aşı — 2. Doz", notlar: "İkinci DHPP dozu" },
  { hafta: "14–16. Hafta", asi: "Karma Aşı — 3. Doz + Kuduz", notlar: "Son DHPP ve ilk kuduz aşısı" },
  { hafta: "12–16 Ay", asi: "Yıllık Pekiştirme", notlar: "Tüm aşılar güncellenir" },
  { hafta: "Her Yıl", asi: "Yıllık Hatırlatıcı Aşılar", notlar: "Veteriner takvimine göre" },
];

export default function YourPoodleAraclarPage() {
  return (
    <YourPoodleShell activeTab="guide">
      {/* HERO */}
      <section className="bg-gradient-to-br from-[#059669] via-[#10B981] to-[#34D399] px-5 pt-5 pb-7 rounded-b-[2rem] shadow-md">
        <div className="flex justify-between items-center">
          <div className="flex-1 pr-3">
            <div className="bg-white/20 text-white text-[11px] font-bold px-3 py-1.5 rounded-full inline-flex items-center mb-3">
              🧮 6 Ücretsiz Araç
            </div>
            <h1 className="text-[24px] font-black text-white leading-tight mb-1.5">Hesaplama Araçları</h1>
            <p className="text-white/85 text-[13px] leading-relaxed font-semibold">
              Günlük bakım ve sağlık ihtiyaçlarını hesaplayan ücretsiz araçlar.
            </p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm p-4 rounded-2xl text-4xl flex-shrink-0">🧮</div>
        </div>
      </section>

      {/* BREADCRUMB */}
      <nav className="flex items-center gap-1.5 px-5 pt-4 pb-0 text-[12px] text-gray-400 font-semibold">
        <Link href="/yourpoodle"><span className="text-purple-600 cursor-pointer hover:underline">Ana Sayfa</span></Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/yourpoodle/rehber"><span className="text-purple-600 cursor-pointer hover:underline">Rehber</span></Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-700 font-bold">Hesaplama Araçları</span>
      </nav>

      {/* ARAÇLAR */}
      <section className="px-5 mt-5">
        <h2 className="text-[16px] font-black text-gray-900 mb-4">🔢 Hesaplayıcılar</h2>
        <div className="flex flex-col gap-4">
          {TOOLS.slice(0, 4).map((tool) => (
            <SimpleCalculator key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* AŞI TAKVİMİ */}
      <section className="px-5 mt-6">
        <h2 className="text-[16px] font-black text-gray-900 mb-3.5">💉 Aşı Takvimi</h2>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {ASI_TAKVIMI.map((row, i) => (
            <div key={i} className={`p-4 ${i < ASI_TAKVIMI.length - 1 ? "border-b border-gray-100" : ""}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="font-black text-[13.5px] text-gray-900 mb-0.5">{row.asi}</div>
                  <div className="text-[11.5px] text-gray-500 font-semibold">{row.notlar}</div>
                </div>
                <div className="bg-red-50 text-red-600 text-[11px] font-black px-2.5 py-1.5 rounded-lg whitespace-nowrap flex-shrink-0">
                  {row.hafta}
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11.5px] text-gray-400 font-semibold mt-2 px-1">
          ⚠️ Bu tablo genel bir rehberdir. Kesin takvim için veterinerinize danışın.
        </p>
      </section>

      {/* TIRAS PLANLAYICI */}
      <section className="px-5 mt-6">
        <div className="bg-white rounded-2xl border border-pink-100 shadow-sm p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-3xl">✂️</div>
            <div>
              <h2 className="font-black text-gray-900 text-[15.5px]">Tıraş Hatırlatıcısı</h2>
              <p className="text-[12px] font-semibold text-pink-600">Her 6–8 haftada tıraş önerilir</p>
            </div>
          </div>
          <div className="bg-pink-50 border border-pink-200 rounded-xl px-4 py-3.5 text-[13px] font-semibold text-gray-700">
            📅 Toy Poodle'lar her <strong>6–8 haftada bir</strong> tıraş edilmelidir. Son tıraş tarihinizi bir yere not edin ve bir sonraki randevunuzu önceden alın.
          </div>
        </div>
      </section>

      {/* AI CTA */}
      <section className="px-5 mt-6 mb-4">
        <div className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="flex-1">
            <p className="text-white font-black text-[14px] mb-1.5">Daha kişisel hesaplama mı istiyorsunuz?</p>
            <p className="text-white/80 text-[12px] font-semibold mb-3">AI Asistan özel öneriler sunsun.</p>
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
