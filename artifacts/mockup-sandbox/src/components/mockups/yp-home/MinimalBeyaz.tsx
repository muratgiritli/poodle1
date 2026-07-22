import React from "react";
import { Bell, User } from "lucide-react";

export function MinimalBeyaz() {
  return (
    <div className="w-full max-w-[390px] mx-auto min-h-screen bg-white text-gray-900 font-sans relative flex flex-col shadow-2xl">
      {/* HEADER (sticky) */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#F3F4F6] px-5 py-3 flex items-center justify-between">
        <div className="text-lg font-bold tracking-tight flex items-center gap-1">
          YourPoodle <span className="text-sm">🐾</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
            <Bell size={20} strokeWidth={2.5} />
          </button>
          <div className="w-8 h-8 rounded-full bg-[#F3EEFF] flex items-center justify-center border border-[#EDE9FE] overflow-hidden">
            <User size={16} className="text-[#7C3AED]" strokeWidth={2.5} />
          </div>
        </div>
      </header>

      <main className="flex-1 pb-10">
        {/* HERO */}
        <section className="p-5">
          <div className="inline-flex items-center bg-[#F3EEFF] text-[#7C3AED] px-3 py-1 rounded-full text-[11px] font-semibold mb-3.5">
            ✨ YourPoodle 2.0 Çıktı!
          </div>
          
          <img 
            src="/__mockup/images/poodle-hero_2.jpg" 
            alt="Toy Poodle" 
            className="w-full aspect-[16/9] object-cover object-[center_top] rounded-[24px] shadow-[0_8px_32px_rgba(124,58,237,0.18)]"
          />
          
          <h1 className="text-[24px] font-[800] leading-tight text-gray-900 mt-4 mb-2">
            Poodle'ınız İçin<br/>Her Şey 🐾
          </h1>
          
          <p className="text-[13px] text-gray-500 mb-4 leading-relaxed pr-4">
            Beslenmeden eğitime, sağlıktan bakıma kadar sadık dostunuz için ihtiyacınız olan en iyi araçlar ve rehberler tek bir yerde.
          </p>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="flex -space-x-2">
              <img src="/__mockup/images/poodle-avatar-1.jpg" alt="User 1" className="w-6 h-6 rounded-full border-2 border-white object-cover" />
              <img src="/__mockup/images/poodle-avatar-2.jpg" alt="User 2" className="w-6 h-6 rounded-full border-2 border-white object-cover" />
              <img src="/__mockup/images/poodle-avatar-3.jpg" alt="User 3" className="w-6 h-6 rounded-full border-2 border-white object-cover" />
            </div>
            <div className="text-[11px] text-gray-500 font-medium">
              <span className="font-bold text-gray-700">50.000+</span> Poodle sever güveniyor ⭐ 4.9
            </div>
          </div>
          
          <button className="w-full h-[52px] bg-[#7C3AED] text-white rounded-[16px] text-[16px] font-[800] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-lg shadow-purple-500/20 mt-1">
            Başla &rarr;
          </button>
        </section>

        {/* ARAÇ CHİPLERİ */}
        <section className="mt-2">
          <h2 className="text-[15px] font-bold px-5 pb-2.5 text-gray-900">Kategoriler</h2>
          <div className="flex gap-2 overflow-x-auto px-5 pb-3 scrollbar-hide" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            {/* Inline styles for hiding scrollbar as fallback */}
            <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
            {[
              "🍽️ Mama Bul",
              "📚 Rehberler",
              "🤖 AI Asistan",
              "✂️ Bakım",
              "👥 Topluluk"
            ].map((chip, i) => (
              <button 
                key={i}
                className="bg-[#F8F5FF] border border-[#EDE9FE] text-[#7C3AED] rounded-full px-[18px] py-[10px] text-[13px] font-[600] whitespace-nowrap active:bg-[#F3EEFF] transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>
        </section>

        {/* ÖNE ÇIKAN KARTLAR */}
        <section className="mt-4">
          <h2 className="text-[15px] font-bold px-5 pb-3 text-gray-900">Öne Çıkanlar</h2>
          <div className="flex gap-4 overflow-x-auto px-5 pb-5 scrollbar-hide">
            <div className="bg-white border border-[#F0E8FF] rounded-[20px] p-4 min-w-[220px] shadow-sm flex flex-col">
              <div className="text-xl mb-2">🥩</div>
              <h3 className="font-bold text-gray-900 mb-1.5 text-[14px]">Toy Poodle Beslenmesi</h3>
              <p className="text-[12px] text-gray-500 mb-3 line-clamp-3 leading-relaxed flex-1">
                Yavruluktan yetişkinliğe Poodle ırkına özel günlük kalori ihtiyacı, porsiyon kontrolü ve en iyi mama içerikleri.
              </p>
              <a href="#" className="text-[#7C3AED] text-[12px] font-bold mt-auto hover:underline inline-flex items-center gap-1">
                Oku &rarr;
              </a>
            </div>

            <div className="bg-white border border-[#F0E8FF] rounded-[20px] p-4 min-w-[220px] shadow-sm flex flex-col">
              <div className="text-xl mb-2">✂️</div>
              <h3 className="font-bold text-gray-900 mb-1.5 text-[14px]">Tüy Bakım Rehberi</h3>
              <p className="text-[12px] text-gray-500 mb-3 line-clamp-3 leading-relaxed flex-1">
                Kıvırcık ve hassas tüyler için günlük tarama teknikleri, doğru fırça seçimi ve evde traş önerileri.
              </p>
              <a href="#" className="text-[#7C3AED] text-[12px] font-bold mt-auto hover:underline inline-flex items-center gap-1">
                Oku &rarr;
              </a>
            </div>
          </div>
        </section>

        {/* ÜYELİK */}
        <section className="px-5 pt-3 pb-8">
          <div 
            className="rounded-[20px] p-5 flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg, #F3EEFF, #FCE7F3)' }}
          >
            <div>
              <h4 className="font-bold text-gray-900 text-[15px] mb-0.5">🎁 100 TL Bonus</h4>
              <p className="text-[12px] text-gray-600 font-medium">Üye ol, hemen kazan</p>
            </div>
            <button className="bg-[#7C3AED] text-white px-4 py-2 rounded-full text-[12px] font-bold shadow-md shadow-purple-500/20 active:scale-95 transition-transform">
              Üye Ol &rarr;
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
