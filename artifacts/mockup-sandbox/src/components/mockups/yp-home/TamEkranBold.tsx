import React from 'react';

export function TamEkranBold() {
  return (
    <div className="w-full max-w-[390px] mx-auto min-h-[100dvh] font-sans bg-white overflow-hidden flex flex-col relative shadow-2xl">
      {/* Upper Purple Section (Hero + Cards) */}
      <div 
        className="w-full flex flex-col"
        style={{ background: 'linear-gradient(160deg, #0F0520 0%, #2D0D6B 45%, #7C3AED 100%)' }}
      >
        {/* Header */}
        <header className="sticky top-0 z-50 flex items-center justify-between px-5 py-4" style={{ background: 'transparent' }}>
          {/* Header background with blur (optional enhancement) */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-md border-b border-white/10" style={{ zIndex: -1 }}></div>
          
          <div className="font-bold text-white text-lg tracking-tight">YourPoodle 🐾</div>
          <button className="text-white p-1">
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </header>

        {/* Hero Section */}
        <div className="relative min-h-[500px] w-full flex flex-col pt-6 px-5 pb-8">
          
          {/* Text Content */}
          <div className="relative z-10 w-[68%]">
            <div 
              className="inline-block text-white text-xs font-medium"
              style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '999px', padding: '4px 14px' }}
            >
              ✨ Türkiye'nin #1 Poodle Platformu
            </div>
            
            <h1 className="text-[28px] font-black text-white mt-3 drop-shadow-sm" style={{ lineHeight: '1.2' }}>
              Her Toy Poodle'ın<br />Hak Ettiği Bakım
            </h1>
            
            <p className="text-white text-[12px] mt-2 font-medium leading-relaxed pr-2" style={{ opacity: 0.8 }}>
              Poodle'ınıza özel beslenme rehberi, sağlık takibi ve veteriner onaylı ürünler bir arada.
            </p>

            {/* Buttons */}
            <div className="flex items-center gap-3 mt-6">
              <button className="bg-white text-[#7C3AED] px-4 py-3 rounded-2xl font-bold text-sm shadow-[0_8px_16px_rgba(0,0,0,0.15)] flex-1 text-center whitespace-nowrap">
                🐾 Mama Bul
              </button>
              <button className="border border-white text-white px-4 py-3 rounded-2xl font-bold text-sm flex-1 text-center whitespace-nowrap">
                📖 Rehber
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-1.5 mt-8 text-white text-[11px] font-medium bg-black/20 self-start inline-flex px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/5">
              <span>⭐ 4.9</span>
              <span className="opacity-50">·</span>
              <span>50.000+ Üye</span>
              <span className="opacity-50">·</span>
              <span>200+ Ürün</span>
            </div>
          </div>

          {/* Poodle Image - Bottom Right */}
          <img 
            src="/__mockup/images/poodle-hero_2.jpg" 
            alt="Toy Poodle" 
            className="absolute bottom-0 right-0 object-cover object-left-top shadow-[-10px_-10px_30px_rgba(0,0,0,0.25)] z-0"
            style={{ 
              height: '75%', 
              width: '60%', 
              borderRadius: '20px 0 0 0' 
            }}
          />
          {/* Subtle gradient overlay on image for blending */}
          <div 
            className="absolute bottom-0 right-0 pointer-events-none z-0"
            style={{ 
              height: '75%', 
              width: '60%', 
              borderRadius: '20px 0 0 0',
              background: 'linear-gradient(to top, rgba(124, 58, 237, 0.2), transparent)'
            }}
          ></div>
        </div>

        {/* Glassmorphism Tools Section */}
        <div className="px-5 pb-10 relative z-10 -mt-2">
          <h2 className="text-white font-bold text-[17px] mb-4">Ne aramak istiyorsunuz?</h2>
          
          <div className="grid grid-cols-2 gap-3">
            {[
              { title: "Mamalar", desc: "Özel filtre", icon: "🥩" },
              { title: "Veteriner", desc: "Klinik bul", icon: "🩺" },
              { title: "Eğitim", desc: "Temel itaat", icon: "🎾" },
              { title: "Bakım", desc: "Pet kuaför", icon: "✂️" },
              { title: "Sağlık Takvimi", desc: "Aşı & Parazit", icon: "📅", full: true }
            ].map((item, i) => (
              <div 
                key={i} 
                className={`flex flex-col justify-center ${item.full ? 'col-span-2 flex-row items-center justify-between text-left' : 'items-center text-center'}`}
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: '20px',
                  padding: item.full ? '16px 20px' : '20px 12px',
                  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)'
                }}
              >
                {item.full ? (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="text-[32px] drop-shadow-md leading-none">{item.icon}</div>
                      <div>
                        <div className="text-white font-bold text-[15px]">{item.title}</div>
                        <div className="text-white/80 text-[12px] font-medium mt-0.5">{item.desc}</div>
                      </div>
                    </div>
                    <div className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold backdrop-blur-md">
                      ➔
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-[36px] mb-2 drop-shadow-md leading-none">{item.icon}</div>
                    <div className="text-white font-bold text-[15px] leading-tight">{item.title}</div>
                    <div className="text-white/80 text-[11px] font-medium mt-1">{item.desc}</div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div 
        className="bg-white flex-1 flex flex-col justify-center relative z-20"
        style={{ padding: '32px 20px', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', marginTop: '-24px' }}
      >
        <button 
          className="w-full flex items-center justify-center text-white shadow-[0_8px_20px_rgba(124,58,237,0.25)] hover:scale-[1.02] transition-transform"
          style={{ 
            background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
            borderRadius: '999px',
            height: '52px',
            fontSize: '15px',
            fontWeight: 800
          }}
        >
          🎁 Üye Ol — 100 TL Bonus Kazan <span className="ml-1 opacity-80 text-lg leading-none">→</span>
        </button>
        <div className="text-center text-[12px] text-gray-500 font-medium mt-3">
          Ücretsiz kayıt ol, ilk siparişinde anında kullan.
        </div>
      </div>

    </div>
  );
}
