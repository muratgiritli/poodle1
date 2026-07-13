import { useEffect } from "react";
import { Link } from "wouter";
import {
  Search, ShoppingCart, Menu, Star, BookOpen, Clock,
  Home, Users, ShoppingBag, User, ChevronRight, Utensils, Scissors
} from "lucide-react";

export default function YourPoodleRehberPage() {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Nunito:wght@400;600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    const style = document.createElement("style");
    style.textContent = `.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`;
    document.head.appendChild(style);
    return () => { document.head.removeChild(link); document.head.removeChild(style); };
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-50 flex justify-center" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <div className="w-full max-w-[430px] min-h-screen bg-gray-50 relative pb-24 shadow-2xl">

        {/* HEADER */}
        <header className="sticky top-0 z-40 bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 h-14 border-b border-gray-100">
            <div style={{ fontFamily: "'Dancing Script', cursive" }} className="text-2xl font-bold text-gray-900">YourPoodle</div>
            <div className="flex items-center gap-3 text-gray-700">
              <Search size={20} /><ShoppingCart size={20} />
              <span className="text-sm font-bold">🇬🇧 EN</span>
              <Menu size={24} />
            </div>
          </div>
          {/* NAV TABS */}
          <div className="flex px-4 overflow-x-auto no-scrollbar border-b border-gray-100">
            <div className="flex whitespace-nowrap">
              <Link href="/yourpoodle"><div className="px-4 py-3.5 text-sm text-gray-500 font-bold cursor-pointer">Home</div></Link>
              <div className="px-4 py-3.5 text-sm text-purple-600 font-extrabold border-b-[3px] border-purple-600">Guide</div>
              <Link href="/yourpoodle/bilgi"><div className="px-4 py-3.5 text-sm text-gray-500 font-bold cursor-pointer">Knowledge Base</div></Link>
              <div className="px-4 py-3.5 text-sm text-gray-500 font-bold">Shop</div>
            </div>
          </div>
        </header>

        {/* HERO */}
        <section className="bg-gradient-to-r from-[#7C3AED] to-[#E040FB] p-5 pb-8 relative rounded-b-[2rem] shadow-md">
          <div className="flex justify-between items-start mb-6 pt-2">
            <div className="w-[65%]">
              <div className="bg-white/25 text-white text-[11px] font-bold px-3 py-1.5 rounded-full inline-flex items-center backdrop-blur-md mb-4 shadow-sm">
                📚 50+ Rehber
              </div>
              <h1 className="text-[28px] font-extrabold text-white leading-tight mb-3">Toy Poodle Rehberi</h1>
              <p className="text-white/90 text-[13px] leading-relaxed font-medium">
                Bakım, eğitim, beslenme ve günlük yaşam için adım adım hazırlanmış rehberler.
              </p>
            </div>
            <div className="bg-white p-3 rounded-2xl shadow-xl mt-3 mr-1 rotate-3 flex-shrink-0 border-4 border-white/40">
              <div className="text-6xl" role="img" aria-label="poodle">🐩</div>
            </div>
          </div>

          <div className="relative mb-5 z-10 shadow-lg rounded-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-3.5 bg-white rounded-full text-[14px] font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Hangi konuda yardıma ihtiyacınız var?"
            />
          </div>

          <div className="flex overflow-x-auto no-scrollbar gap-2.5 pb-1">
            {["Yavru", "Beslenme", "Bakım", "Eğitim", "Davranış", "Seyahat", "Mevsim Bakımı"].map((chip, i) => (
              <div key={chip} className={`whitespace-nowrap px-4 py-2 rounded-full text-[13px] font-bold shadow-sm cursor-pointer ${i === 0 ? "bg-white text-purple-700 border-2 border-purple-200" : "bg-white/95 text-gray-700"}`}>
                {chip}
              </div>
            ))}
          </div>
        </section>

        {/* EN ÇOK OKUNAN */}
        <section className="mt-8">
          <div className="flex items-center px-5 mb-4">
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-2.5" />
            <h2 className="text-[19px] font-extrabold text-gray-900">En Çok Okunan Rehberler</h2>
          </div>
          <div className="flex overflow-x-auto no-scrollbar gap-4 px-5 pb-6">
            {[
              { icon: "🚽", title: "Tuvalet Eğitimi", desc: "Adım adım eğitim rehberi" },
              { icon: "👁️", title: "Göz Akıntısı", desc: "Temizlik ve bakım" },
              { icon: "🍖", title: "Mama Seçimi", desc: "Doğru mama nasıl seçilir?" },
              { icon: "🔊", title: "Havlama Sorunu", desc: "Kontrol etme yöntemleri" },
              { icon: "💉", title: "İlk Aşılar", desc: "Aşı takvimi ve önemi" },
              { icon: "✂️", title: "Tıraş ve Tarama", desc: "Bakım ipuçları" },
            ].map((item, i) => (
              <div key={i} className="min-w-[144px] w-36 bg-white rounded-[20px] border border-gray-100 shadow-sm p-4 flex flex-col flex-shrink-0 cursor-pointer">
                <div className="text-4xl text-center mb-3.5">{item.icon}</div>
                <h3 className="font-extrabold text-[14px] text-gray-900 leading-tight mb-1.5">{item.title}</h3>
                <p className="text-[12px] text-gray-500 leading-snug mb-3 flex-grow font-medium">{item.desc}</p>
                <div className="text-[12px] font-bold text-purple-600 mt-auto flex items-center">
                  Oku <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* KATEGORİLER */}
        <section className="mt-2 px-5 mb-10">
          <div className="flex items-center mb-5">
            <BookOpen className="h-5 w-5 text-gray-800 mr-2.5" />
            <h2 className="text-[19px] font-extrabold text-gray-900">Tüm Rehber Kategorileri</h2>
          </div>

          <div className="flex flex-col gap-5">
            {/* Yavru */}
            <div className="bg-white border-l-[5px] border-l-orange-400 border border-orange-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-2.5 rounded-full text-orange-600"><Home className="h-5 w-5" /></div>
                  <h3 className="font-extrabold text-gray-900 text-[17px]">Yavru Toy Poodle</h3>
                </div>
                <div className="bg-orange-100 text-orange-600 text-[11px] font-extrabold px-3 py-1.5 rounded-full uppercase">Başlangıç</div>
              </div>
              <p className="text-[13.5px] text-gray-600 mb-4 font-medium leading-relaxed">Yavru Toy Poodle'ın eve gelişinden temel bakım ve eğitimine kadar ilk dönem rehberi.</p>
              <div className="flex items-center text-gray-500 text-[12px] font-bold mb-4"><Clock className="h-3.5 w-3.5 mr-1.5" /> 15 rehber</div>
              <div className="border-t border-gray-100 my-4" />
              <ul className="space-y-2.5 mb-5">
                {["Eve İlk Geliş", "İlk Gün Yapılması Gerekenler", "İlk Gece", "İlk Mama", "İlk Veteriner"].map((item, i) => (
                  <li key={i} className="flex items-center text-[13.5px] text-gray-700 font-semibold">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-3" />{item}
                  </li>
                ))}
              </ul>
              <div className="text-[13px] text-purple-600 font-extrabold mb-5 cursor-pointer">+9 daha göster →</div>
              <button className="w-full bg-orange-50 text-orange-600 font-extrabold py-3.5 rounded-xl flex items-center justify-center">
                Tümünü Gör <ChevronRight className="h-4 w-4 ml-1.5" />
              </button>
            </div>

            {/* Beslenme */}
            <div className="bg-white border-l-[5px] border-l-green-500 border border-green-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2.5 rounded-full text-green-600"><Utensils className="h-5 w-5" /></div>
                  <h3 className="font-extrabold text-gray-900 text-[17px]">Beslenme</h3>
                </div>
                <div className="bg-green-100 text-green-700 text-[11px] font-extrabold px-3 py-1.5 rounded-full uppercase">Orta</div>
              </div>
              <p className="text-[13.5px] text-gray-600 mb-4 font-medium leading-relaxed">Yaşına, kilosuna ve özel ihtiyaçlarına göre doğru beslenme rehberi.</p>
              <div className="flex items-center text-gray-500 text-[12px] font-bold mb-4"><Clock className="h-3.5 w-3.5 mr-1.5" /> 8 rehber</div>
              <div className="border-t border-gray-100 my-4" />
              <ul className="space-y-2.5 mb-5">
                {["Mama Seçimi", "Mama Hesaplama", "Günlük Mama Miktarı", "Yavru Mama", "Ödül Mamaları"].map((item, i) => (
                  <li key={i} className="flex items-center text-[13.5px] text-gray-700 font-semibold">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3" />{item}
                  </li>
                ))}
              </ul>
              <div className="text-[13px] text-purple-600 font-extrabold mb-5 cursor-pointer">+3 daha göster →</div>
              <button className="w-full bg-green-50 text-green-700 font-extrabold py-3.5 rounded-xl flex items-center justify-center">
                Tümünü Gör <ChevronRight className="h-4 w-4 ml-1.5" />
              </button>
            </div>

            {/* Bakım */}
            <div className="bg-white border-l-[5px] border-l-purple-500 border border-purple-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2.5 rounded-full text-purple-600"><Scissors className="h-5 w-5" /></div>
                  <h3 className="font-extrabold text-gray-900 text-[17px]">Bakım</h3>
                </div>
                <div className="bg-purple-100 text-purple-700 text-[11px] font-extrabold px-3 py-1.5 rounded-full uppercase">Orta</div>
              </div>
              <p className="text-[13.5px] text-gray-600 mb-4 font-medium leading-relaxed">Tüy, göz, kulak, diş ve pati bakımının tüm detayları.</p>
              <div className="flex items-center text-gray-500 text-[12px] font-bold mb-4"><Clock className="h-3.5 w-3.5 mr-1.5" /> 9 rehber</div>
              <div className="border-t border-gray-100 my-4" />
              <ul className="space-y-2.5 mb-5">
                {["Tarama", "Tıraş", "Göz Temizliği", "Kulak Bakımı", "Diş Bakımı"].map((item, i) => (
                  <li key={i} className="flex items-center text-[13.5px] text-gray-700 font-semibold">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3" />{item}
                  </li>
                ))}
              </ul>
              <div className="text-[13px] text-purple-600 font-extrabold mb-5 cursor-pointer">+4 daha göster →</div>
              <button className="w-full bg-purple-50 text-purple-700 font-extrabold py-3.5 rounded-xl flex items-center justify-center">
                Tümünü Gör <ChevronRight className="h-4 w-4 ml-1.5" />
              </button>
            </div>
          </div>
        </section>

        {/* BOTTOM NAV */}
        <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white rounded-t-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.08)] z-50">
          <div className="flex justify-around items-center h-20 px-2 pb-2">
            <Link href="/yourpoodle">
              <div className="flex flex-col items-center justify-center w-16 text-gray-400 cursor-pointer">
                <Home className="h-[22px] w-[22px] mb-1.5" strokeWidth={2.5} />
                <span className="text-[10px] font-bold">Home</span>
              </div>
            </Link>
            <div className="flex flex-col items-center justify-center w-16 text-gray-400">
              <Users className="h-[22px] w-[22px] mb-1.5" strokeWidth={2.5} />
              <span className="text-[10px] font-bold">Club</span>
            </div>
            <div className="flex flex-col items-center justify-center w-16 -mt-8">
              <div className="bg-purple-600 text-white p-4 rounded-full shadow-[0_8px_20px_rgba(124,58,237,0.4)]">
                <ShoppingCart className="h-6 w-6" strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center w-16 text-gray-400">
              <ShoppingBag className="h-[22px] w-[22px] mb-1.5" strokeWidth={2.5} />
              <span className="text-[10px] font-bold">Shop</span>
            </div>
            <div className="flex flex-col items-center justify-center w-16 text-gray-400">
              <User className="h-[22px] w-[22px] mb-1.5" strokeWidth={2.5} />
              <span className="text-[10px] font-bold">Profile</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
