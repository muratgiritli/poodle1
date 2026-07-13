import React from 'react';
import { 
  Search, ShoppingCart, Menu, 
  Home, Heart, BookOpen, Gift, ShieldPlus, Calendar,
  Utensils, Syringe, Cake, Scale, Stethoscope, Smile, Leaf, Droplet, Scissors, Bone, PawPrint, CircleDot, Users, User, ShoppingBag
} from 'lucide-react';

export function Homepage() {
  return (
    <div className="w-[430px] min-h-screen bg-[#FDFDFD] mx-auto relative font-sans text-gray-900 pb-24 overflow-x-hidden shadow-2xl">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400..700&family=Nunito:wght@400;500;700;800&display=swap');
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .font-sans {
          font-family: 'Nunito', sans-serif;
        }
      `}} />

      {/* HEADER */}
      <header className="bg-white px-5 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="font-['Dancing_Script'] text-[28px] font-bold text-gray-900 tracking-tight">YourPoodle</div>
        <div className="flex items-center gap-5 text-gray-700">
          <Search size={22} strokeWidth={2.5} />
          <ShoppingCart size={22} strokeWidth={2.5} />
          <div className="flex items-center gap-1.5 text-sm font-bold">
            <span className="text-lg leading-none">🇬🇧</span>
            <span>EN</span>
          </div>
          <Menu size={26} strokeWidth={2.5} />
        </div>
      </header>

      {/* NAVIGATION TABS */}
      <div className="bg-white px-5 flex gap-7 border-b border-gray-100 text-[15px] font-bold">
        <div className="py-3 border-b-[3px] border-purple-600 text-purple-600">Home</div>
        <div className="py-3 text-gray-400">Guide</div>
        <div className="py-3 text-gray-400">Knowledge Base</div>
        <div className="py-3 text-gray-400">Shop</div>
      </div>

      <main className="px-5 py-6 space-y-6">
        {/* HERO SECTION */}
        <section className="bg-gradient-to-br from-[#F5EFFF] to-[#E9D5FF] rounded-[32px] p-6 relative overflow-hidden h-[520px] flex flex-col justify-between shadow-sm">
          <div className="relative z-10 w-[70%] mt-2">
            <span className="inline-block px-3 py-1.5 bg-white/60 text-gray-700 text-[10px] font-extrabold rounded-full mb-4 uppercase tracking-[0.15em]">
              Dünyanın En Büyük
            </span>
            <h1 className="text-[44px] font-extrabold leading-[1.05] text-gray-900 tracking-tight">
              POODLE<br/>AİLESİNE
            </h1>
            <p className="font-['Dancing_Script'] text-[28px] text-purple-600 font-bold mt-1.5">
              Hoş Geldiniz! 💜
            </p>
            <p className="text-[13px] text-gray-600 mt-5 leading-relaxed font-semibold max-w-[210px]">
              Toy Poodle'inize dair her şey burada! Sağlık, topluluk, özel ayrıcalıklar...
            </p>
          </div>

          <div className="absolute right-[-70px] top-1/2 -translate-y-[45%] w-[340px] h-[340px] z-0 pointer-events-none">
            <img 
              src="/__mockup/images/poodle-hero.png" 
              alt="Toy Poodle" 
              className="w-full h-full object-contain drop-shadow-xl"
            />
          </div>

          <div className="relative z-10 flex flex-col gap-3 mt-auto">
            <button className="w-full bg-[#7C3AED] text-white font-extrabold text-[15px] py-4 rounded-full shadow-[0_8px_20px_-6px_rgba(124,58,237,0.5)]">
              CLUB'A KATIL 🐾
            </button>
            <button className="w-full bg-white text-[#7C3AED] font-extrabold text-[15px] py-[14px] rounded-full border-2 border-[#D8B4FE]">
              POODLE'İMİ EKLE +
            </button>
            
            <div className="flex items-center gap-2.5 mt-3 ml-1">
              <div className="flex -space-x-2.5">
                <img src="/__mockup/images/poodle-avatar-1.jpg" className="w-[30px] h-[30px] rounded-full border-2 border-[#E9D5FF] object-cover" />
                <img src="/__mockup/images/poodle-avatar-2.jpg" className="w-[30px] h-[30px] rounded-full border-2 border-[#E9D5FF] object-cover" />
                <img src="/__mockup/images/poodle-avatar-3.jpg" className="w-[30px] h-[30px] rounded-full border-2 border-[#E9D5FF] object-cover" />
                <img src="/__mockup/images/poodle-avatar-4.jpg" className="w-[30px] h-[30px] rounded-full border-2 border-[#E9D5FF] object-cover" />
              </div>
              <div className="text-[11px] leading-tight mt-0.5">
                <span className="font-extrabold text-gray-900">10.000+</span> <span className="font-semibold text-gray-600">mutlu poodle ailesi 💜</span>
              </div>
            </div>
          </div>
        </section>

        {/* QUICK NAV TABS */}
        <div className="bg-white rounded-3xl p-2.5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-x-auto no-scrollbar border border-gray-100">
          <div className="flex min-w-max gap-1 px-1">
            <div className="flex flex-col items-center gap-1.5 min-w-[76px] relative pb-2 pt-1.5">
              <div className="w-[52px] h-[52px] rounded-full bg-[#F3E8FF] flex items-center justify-center text-[#7C3AED]">
                <Home size={24} strokeWidth={2.5} />
              </div>
              <span className="text-[11px] font-extrabold text-gray-900">Akış</span>
              <div className="absolute bottom-0 w-10 h-1 bg-[#7C3AED] rounded-t-full"></div>
            </div>
            
            {[
              { icon: Heart, label: "Topluluk", color: "text-rose-500" },
              { icon: BookOpen, label: "Rehber", color: "text-blue-500" },
              { icon: Gift, label: "Mağaza", color: "text-orange-500" },
              { icon: ShieldPlus, label: "Veteriner", color: "text-teal-500" },
              { icon: Calendar, label: "Etkinlikler", color: "text-indigo-500" }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 min-w-[76px] pb-2 pt-1.5">
                <div className={`w-[52px] h-[52px] rounded-full bg-gray-50/80 flex items-center justify-center ${item.color}`}>
                  <item.icon size={24} strokeWidth={2.5} />
                </div>
                <span className="text-[11px] font-bold text-gray-500">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* BİLGİ BANKASI SECTION */}
        <section className="bg-white rounded-[32px] p-6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
          <div className="flex justify-between items-end mb-1">
            <h2 className="text-[22px] font-extrabold flex items-center gap-2 text-gray-900">
              <span className="text-yellow-400">⚡</span> Bilgi Bankası
            </h2>
            <a href="#" className="text-[13px] font-bold text-[#7C3AED] mb-1">Tümü &rarr;</a>
          </div>
          <p className="text-[13px] font-semibold text-gray-500 mb-6">Poodle'iniz için en çok kullanılan araçlar.</p>

          <div className="grid grid-cols-3 gap-y-7 gap-x-3">
            {[
              { icon: Utensils, bg: "bg-pink-100", fg: "text-pink-500", label: "Mama Hesaplama", desc: "Günlük mama miktarını hesapla" },
              { icon: Syringe, bg: "bg-rose-100", fg: "text-rose-500", label: "Aşı Takvimi", desc: "Aşılarını düzenli takip et" },
              { icon: Cake, bg: "bg-purple-100", fg: "text-purple-500", label: "Yaş Hesaplama", desc: "Köpek yaşını insan yaşına çevir" },
              
              { icon: Scale, bg: "bg-emerald-100", fg: "text-emerald-500", label: "İdeal Kilo", desc: "İdeal kilosunu öğren" },
              { icon: Stethoscope, bg: "bg-cyan-100", fg: "text-cyan-500", label: "Hastalık Kontrolü", desc: "Belirtileri kontrol et" },
              { icon: Smile, bg: "bg-amber-100", fg: "text-amber-500", label: "Diş Kontrolü", desc: "Ağız ve diş sağlığı tüyosu" },
              
              { icon: Leaf, bg: "bg-lime-100", fg: "text-lime-600", label: "Dışkı Rehberi", desc: "Rengine göre kontrol et" },
              { icon: Droplet, bg: "bg-blue-100", fg: "text-blue-500", label: "Su Hesaplama", desc: "Günlük su ihtiyacını hesapla" },
              { icon: Scissors, bg: "bg-pink-100", fg: "text-pink-500", label: "Tıraş Zamanı", desc: "Son tıraş tarihine göre hesapla" },
              
              { icon: Bone, bg: "bg-orange-100", fg: "text-orange-500", label: "Ödül Rehberi", desc: "Ne kadar ödül vermeli?" },
              { icon: PawPrint, bg: "bg-teal-100", fg: "text-teal-600", label: "Pati Bakımı", desc: "Günlük pati bakım rutini" },
              { icon: CircleDot, bg: "bg-indigo-100", fg: "text-indigo-500", label: "Oyun Saati", desc: "Günlük oyun ihtiyacı" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-2.5">
                <div className={`w-[60px] h-[60px] rounded-full ${item.bg} ${item.fg} flex items-center justify-center`}>
                  <item.icon size={26} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-[12px] font-extrabold leading-tight mb-1 text-gray-800">{item.label}</h3>
                  <p className="text-[10px] font-semibold text-gray-500 leading-tight px-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* BOTTOM NAVIGATION BAR */}
      <div className="fixed bottom-0 w-[430px] bg-white border-t border-gray-100 px-7 py-3 pb-8 flex justify-between items-end z-50 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col items-center gap-1.5 text-[#7C3AED] pb-1">
          <Home size={26} strokeWidth={2.5} />
          <span className="text-[11px] font-extrabold">Home</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 text-gray-400 pb-1">
          <Users size={26} strokeWidth={2.5} />
          <span className="text-[11px] font-bold">Club</span>
        </div>
        
        {/* FAB */}
        <div className="relative -top-6 bg-[#7C3AED] w-16 h-16 rounded-full flex items-center justify-center text-white shadow-[0_8px_20px_-4px_rgba(124,58,237,0.4)] border-[5px] border-[#FDFDFD]">
          <ShoppingCart size={26} strokeWidth={2.5} />
        </div>
        
        <div className="flex flex-col items-center gap-1.5 text-gray-400 pb-1">
          <ShoppingBag size={26} strokeWidth={2.5} />
          <span className="text-[11px] font-bold">Shop</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 text-gray-400 pb-1">
          <User size={26} strokeWidth={2.5} />
          <span className="text-[11px] font-bold">My Profile</span>
        </div>
      </div>
    </div>
  );
}
