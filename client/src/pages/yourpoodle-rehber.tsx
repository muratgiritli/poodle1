import { useState } from "react";
import { Link } from "wouter";
import {
  Search, Star, BookOpen, ChevronRight, ChevronDown, Sparkles, Clock,
} from "lucide-react";
import YourPoodleShell from "@/components/yourpoodle/YourPoodleShell";
import {
  GUIDE_CATEGORIES, CATEGORY_COLORS, POPULAR_GUIDES, QUICK_TOOLS, AGE_GROUPS, FAQ_ITEMS,
} from "@/lib/yourpoodle-data";

export default function YourPoodleRehberPage() {
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const filtered = GUIDE_CATEGORIES.filter((c) =>
    search === "" ||
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.subcategories.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <YourPoodleShell activeTab="guide">
      {/* ── HERO ─────────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#6D28D9] via-[#7C3AED] to-[#A855F7] p-5 pb-8 rounded-b-[2rem] shadow-md">
        <div className="flex justify-between items-start mb-5 pt-1">
          <div className="flex-1 pr-4">
            <div className="bg-white/20 text-white text-[11px] font-bold px-3 py-1.5 rounded-full inline-flex items-center backdrop-blur-sm mb-3">
              📚 50+ Rehber
            </div>
            <h1 className="text-[27px] font-black text-white leading-tight mb-2">
              Toy Poodle Rehberi
            </h1>
            <p className="text-white/85 text-[13px] leading-relaxed font-medium">
              Yavru döneminden ileri yaşlara kadar bakım, sağlık, beslenme, eğitim ve yaşam hakkında ihtiyacınız olan her şey.
            </p>
          </div>
          <div className="bg-white p-2.5 rounded-2xl shadow-xl rotate-3 flex-shrink-0 border-4 border-white/30">
            <img
              src="/images/poodle-hero.png"
              alt="Toy Poodle"
              className="w-16 h-16 object-cover rounded-xl"
              loading="eager"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; (e.target as HTMLImageElement).parentElement!.textContent = "🐩"; }}
            />
          </div>
        </div>

        {/* SEARCH */}
        <div className="relative mb-4 shadow-lg rounded-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-11 pr-4 py-3.5 bg-white rounded-full text-[14px] font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Toy Poodle hakkında ne öğrenmek istiyorsunuz?"
          />
        </div>

        {/* FILTER CHIPS */}
        <div className="flex overflow-x-auto yp-no-scrollbar gap-2 pb-1">
          {["Yavru", "Beslenme", "Bakım", "Eğitim", "Davranış", "Seyahat", "Sağlık"].map((chip, i) => (
            <button
              key={chip}
              onClick={() => setSearch(search === chip ? "" : chip)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-[13px] font-bold shadow-sm flex-shrink-0 transition-all ${search === chip ? "bg-purple-800 text-white border-2 border-purple-300" : "bg-white/95 text-gray-700 border border-white/60"}`}
            >
              {chip}
            </button>
          ))}
        </div>
      </section>

      {/* ── BREADCRUMB ───────────────────────────── */}
      <nav className="flex items-center gap-1.5 px-5 pt-4 pb-0 text-[12px] text-gray-400 font-semibold">
        <Link href="/yourpoodle"><span className="text-purple-600 cursor-pointer hover:underline">Ana Sayfa</span></Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-600">Rehber</span>
      </nav>

      {/* ── EN ÇOK OKUNAN ────────────────────────── */}
      <section className="mt-5">
        <div className="flex items-center px-5 mb-3.5">
          <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-2" />
          <h2 className="text-[18px] font-black text-gray-900">En Çok Okunan Rehberler</h2>
        </div>
        <div className="flex overflow-x-auto yp-no-scrollbar gap-3.5 px-5 pb-5">
          {POPULAR_GUIDES.map((item, i) => (
            <Link key={i} href={item.route}>
              <div className="min-w-[138px] w-[138px] bg-white rounded-[20px] border border-gray-100 shadow-sm p-4 flex flex-col flex-shrink-0 cursor-pointer hover:shadow-md transition-shadow">
                <div className="text-4xl text-center mb-3">{item.icon}</div>
                <h3 className="font-black text-[13.5px] text-gray-900 leading-tight mb-1">{item.title}</h3>
                <p className="text-[11.5px] text-gray-500 leading-snug mb-3 flex-grow font-semibold">{item.desc}</p>
                <div className="text-[12px] font-black text-purple-600 flex items-center">
                  Oku <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── ANA KATEGORİLER ──────────────────────── */}
      <section className="px-5 mb-4">
        <div className="flex items-center mb-4">
          <BookOpen className="h-5 w-5 text-gray-800 mr-2" />
          <h2 className="text-[18px] font-black text-gray-900">Tüm Rehber Kategorileri</h2>
          {search && (
            <span className="ml-auto text-[12px] text-gray-400 font-bold">{filtered.length} kategori</span>
          )}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-bold text-[15px]">Sonuç bulunamadı</p>
            <button onClick={() => setSearch("")} className="mt-3 text-purple-600 font-bold text-[13px]">Aramayı Temizle</button>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {filtered.map((cat) => {
            const c = CATEGORY_COLORS[cat.color];
            const isExpanded = expanded[cat.id];
            const shown = isExpanded ? cat.subcategories : cat.subcategories.slice(0, 5);
            const extra = cat.subcategories.length - 5;
            return (
              <div key={cat.id} className={`bg-white border-l-[5px] ${c.border} border border-gray-100 rounded-2xl p-5 shadow-sm`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`${c.badge} p-2.5 rounded-full text-xl w-10 h-10 flex items-center justify-center`}>
                      {cat.icon}
                    </div>
                    <div>
                      <h2 className="font-black text-gray-900 text-[16.5px] leading-tight">{cat.title}</h2>
                      <div className={`flex items-center ${c.text} text-[11px] font-bold mt-0.5`}>
                        <Clock className="h-3 w-3 mr-1" /> {cat.subcategories.length} rehber
                      </div>
                    </div>
                  </div>
                  {cat.badge && (
                    <div className={`${c.badge} text-[10.5px] font-black px-2.5 py-1.5 rounded-full uppercase tracking-wide`}>
                      {cat.badge}
                    </div>
                  )}
                </div>

                <p className="text-[13px] text-gray-600 mb-3.5 font-semibold leading-relaxed">{cat.description}</p>

                <div className="border-t border-gray-100 mb-3.5" />

                <ul className="space-y-2.5 mb-3">
                  {shown.map((sub, i) => (
                    <li key={i} className="flex items-center text-[13px] text-gray-700 font-semibold cursor-pointer hover:text-purple-600 transition-colors">
                      <div className={`w-1.5 h-1.5 ${c.dot} rounded-full mr-3 flex-shrink-0`} />
                      {sub}
                    </li>
                  ))}
                </ul>

                {extra > 0 && (
                  <button
                    onClick={() => setExpanded((prev) => ({ ...prev, [cat.id]: !isExpanded }))}
                    className={`text-[12.5px] ${c.text} font-black mb-4 flex items-center gap-1 cursor-pointer`}
                  >
                    {isExpanded ? "Daha az göster" : `+${extra} daha göster`}
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </button>
                )}

                <Link href={cat.route}>
                  <button className={`w-full ${c.bg} ${c.text} font-black py-3.5 rounded-xl flex items-center justify-center text-[13.5px] hover:opacity-90 transition-opacity`}>
                    Tümünü Gör <ChevronRight className="h-4 w-4 ml-1.5" />
                  </button>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── YAŞA GÖRE HIZLI SEÇİM ────────────────── */}
      {!search && (
        <section className="px-5 mb-6">
          <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-5">
            <h2 className="text-[17px] font-black text-gray-900 mb-1.5">🎂 Poodle'ınız Kaç Yaşında?</h2>
            <p className="text-[12.5px] text-gray-500 font-semibold mb-4">Yaşına özel rehberlere ulaşın.</p>
            <div className="flex flex-wrap gap-2">
              {AGE_GROUPS.map((ag) => (
                <Link key={ag.label} href={ag.route}>
                  <div className="bg-purple-50 border border-purple-200 text-purple-700 text-[13px] font-black px-4 py-2.5 rounded-full cursor-pointer hover:bg-purple-100 transition-colors">
                    {ag.label}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── HIZLI ARAÇLAR ────────────────────────── */}
      {!search && (
        <section className="px-5 mb-6">
          <h2 className="text-[17px] font-black text-gray-900 mb-3.5">🧮 Hızlı Araçlar</h2>
          <div className="grid grid-cols-3 gap-3">
            {QUICK_TOOLS.map((tool) => (
              <Link key={tool.title} href={tool.route}>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3.5 flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-shadow">
                  <div className="text-3xl mb-2">{tool.icon}</div>
                  <span className="text-[11.5px] font-black text-gray-800 leading-tight">{tool.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── BUGÜN EN ÇOK OKUNANLAR + SSS ─────────── */}
      {!search && (
        <section className="px-5 mb-6 flex flex-col gap-4">
          {/* Bugün En Çok Okunanlar */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-[16px] font-black text-gray-900 mb-4 flex items-center gap-2">
              🔥 Bugün En Çok Okunanlar
            </h2>
            <ul className="space-y-3">
              {["Tuvalet Eğitimi", "Havlama Sorunu", "Göz Akıntısı", "Mama Seçimi", "Yaz Bakımı", "Kış Bakımı"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black flex-shrink-0 ${i === 0 ? "bg-yellow-400 text-white" : i === 1 ? "bg-gray-300 text-gray-700" : i === 2 ? "bg-amber-600 text-white" : "bg-purple-100 text-purple-700"}`}>
                    {i + 1}
                  </div>
                  <span className="text-[13.5px] font-bold text-gray-800 group-hover:text-purple-600 transition-colors">{item}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-gray-300 ml-auto group-hover:text-purple-400 transition-colors" />
                </li>
              ))}
            </ul>
          </div>

          {/* Sık Sorulan Sorular */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-[16px] font-black text-gray-900 mb-4">❓ Sık Sorulan Sorular</h2>
            <div className="space-y-2">
              {FAQ_ITEMS.map((faq, i) => (
                <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-start justify-between p-4 text-left gap-3 hover:bg-purple-50 transition-colors"
                  >
                    <span className="text-[13px] font-black text-gray-800 leading-snug flex-1">{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 text-[12.5px] text-gray-600 font-semibold leading-relaxed border-t border-gray-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── AI POODLE ASİSTANI CTA ───────────────── */}
      {!search && (
        <section className="px-5 mb-6">
          <div className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] rounded-2xl p-5 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="bg-white/20 text-white text-[11px] font-bold px-3 py-1 rounded-full inline-flex items-center mb-3">
                  <Sparkles className="h-3 w-3 mr-1" /> Yapay Zekâ
                </div>
                <h2 className="text-[17px] font-black text-white mb-1.5 leading-tight">
                  Aradığınız Cevabı Bulamadınız mı?
                </h2>
                <p className="text-white/85 text-[12.5px] font-semibold leading-relaxed mb-4">
                  Poodle Asistanına sorun, size uygun rehberleri saniyeler içinde bulun.
                </p>
                <Link href="/yourpoodle/ai-poodle-asistani">
                  <button className="bg-white text-purple-700 font-black text-[13px] px-5 py-3 rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    AI Poodle Asistanına Sor
                  </button>
                </Link>
              </div>
              <div className="text-5xl mt-1">🤖</div>
            </div>
          </div>
        </section>
      )}
    </YourPoodleShell>
  );
}
