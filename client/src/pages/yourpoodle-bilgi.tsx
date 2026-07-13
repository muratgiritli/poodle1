import { useEffect } from "react";
import { Link } from "wouter";
import {
  Search, ShoppingCart, Menu, ChevronLeft, Zap,
  Utensils, Syringe, Cake, Scale, Activity, Smile, Leaf, Droplets, Scissors, Bone, PawPrint, Heart,
  Truck, RefreshCw, Shield, CreditCard, Instagram, Facebook, Youtube, Twitter,
  House, Users, ShoppingBag, User
} from "lucide-react";

export default function YourPoodleBilgiPage() {
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

  const tools = [
    { icon: Utensils, bg: "bg-pink-100", fg: "text-pink-500", label: "Mama Hesaplama", desc: "Günlük mama miktarını hesapla" },
    { icon: Syringe, bg: "bg-rose-100", fg: "text-rose-500", label: "Aşı Takvimi", desc: "Aşılarını düzenli takip et" },
    { icon: Cake, bg: "bg-purple-100", fg: "text-purple-500", label: "Yaş Hesaplama", desc: "Köpek yaşını insan yaşına çevir" },
    { icon: Scale, bg: "bg-emerald-100", fg: "text-emerald-500", label: "İdeal Kilo", desc: "İdeal kilosunu öğren" },
    { icon: Activity, bg: "bg-cyan-100", fg: "text-cyan-500", label: "Hastalık Kontrolü", desc: "Belirtileri kontrol et" },
    { icon: Smile, bg: "bg-teal-100", fg: "text-teal-500", label: "Diş Kontrolü", desc: "Ağız ve diş sağlığı tüyosu" },
    { icon: Leaf, bg: "bg-pink-100", fg: "text-pink-500", label: "Dışkı Rehberi", desc: "Rengine göre kontrol et" },
    { icon: Droplets, bg: "bg-blue-100", fg: "text-blue-500", label: "Su Hesaplama", desc: "Günlük su ihtiyacını hesapla" },
    { icon: Scissors, bg: "bg-fuchsia-100", fg: "text-fuchsia-500", label: "Tıraş Zamanı", desc: "Son tıraş tarihine göre hesapla" },
    { icon: Bone, bg: "bg-orange-100", fg: "text-orange-500", label: "Ödül Hesabı", desc: "Ödül mamasının kalorilerini hesapla" },
    { icon: PawPrint, bg: "bg-teal-100", fg: "text-teal-500", label: "Aktivite Hesabı", desc: "Günlük egzersiz ihtiyacını öğren" },
    { icon: Heart, bg: "bg-amber-100", fg: "text-amber-500", label: "İnsan Yaşı", desc: "Karşılaştırmalı yaş tablosu" },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50 flex justify-center" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <div className="w-full max-w-[430px] bg-gray-50 min-h-screen shadow-2xl relative pb-28">

        {/* HEADER */}
        <header className="sticky top-0 z-40 bg-white shadow-sm flex items-center justify-between px-5 py-4">
          <div style={{ fontFamily: "'Dancing Script', cursive" }} className="text-2xl font-bold text-gray-900">YourPoodle</div>
          <div className="flex items-center gap-4">
            <Search size={20} className="text-gray-600" />
            <ShoppingCart size={20} className="text-gray-600" />
            <div className="text-sm font-bold text-gray-800">🇬🇧 EN</div>
            <Menu size={24} className="text-gray-900" />
          </div>
        </header>

        {/* NAV TABS */}
        <div className="bg-white border-b border-gray-100 flex items-center px-5 gap-6 overflow-x-auto no-scrollbar">
          <Link href="/yourpoodle"><div className="py-4 text-sm font-bold text-gray-400 whitespace-nowrap cursor-pointer">Home</div></Link>
          <Link href="/yourpoodle/rehber"><div className="py-4 text-sm font-bold text-gray-400 whitespace-nowrap cursor-pointer">Guide</div></Link>
          <div className="py-4 text-sm font-bold text-[#7C3AED] border-b-[3px] border-[#7C3AED] whitespace-nowrap">Knowledge Base</div>
          <div className="py-4 text-sm font-bold text-gray-400 whitespace-nowrap">Shop</div>
        </div>

        {/* BREADCRUMB */}
        <Link href="/yourpoodle">
          <div className="px-5 py-4 flex items-center gap-1 cursor-pointer">
            <ChevronLeft size={16} className="text-gray-400" />
            <span className="text-sm font-bold text-gray-500">Ana Sayfa</span>
          </div>
        </Link>

        {/* PAGE HEADER */}
        <div className="px-5 mb-5">
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <Zap size={24} className="text-yellow-400 fill-yellow-400" />
            Bilgi Bankası
          </h1>
          <p className="text-sm text-gray-500 font-bold mt-1">Poodle'iniz için hesaplayıcılar ve sağlık rehberleri.</p>
        </div>

        {/* TOOL GRID */}
        <div className="bg-white rounded-[32px] mx-5 p-6 shadow-sm border border-gray-100 mb-8">
          <div className="grid grid-cols-3 gap-y-6 gap-x-4">
            {tools.map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-2 cursor-pointer">
                <div className={`w-[60px] h-[60px] rounded-full flex items-center justify-center ${item.bg} ${item.fg}`}>
                  <item.icon size={28} strokeWidth={2.5} />
                </div>
                <div className="text-[12px] font-extrabold text-gray-800 leading-tight">{item.label}</div>
                <div className="text-[10px] text-gray-500 leading-tight px-1 font-bold">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* TRUST BAR */}
        <div className="bg-[#1a1a2e] py-8 px-5 w-full">
          <div className="grid grid-cols-2 gap-y-8 gap-x-6">
            {[
              { icon: Truck, color: "text-[#a78bfa]", title: "Hızlı Kargo", sub: "Aynı gün kargoya verilir" },
              { icon: RefreshCw, color: "text-[#22d3ee]", title: "Kolay İade", sub: "14 gün ücretsiz iade" },
              { icon: Shield, color: "text-[#60a5fa]", title: "Güvenli Ödeme", sub: "256-bit SSL şifreleme" },
              { icon: CreditCard, color: "text-[#34d399]", title: "Taksit İmkânı", sub: "12 taksit seçeneği" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full bg-[#2a2a4a] ${item.color} flex items-center justify-center shrink-0`}>
                  <item.icon size={22} />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{item.title}</div>
                  <div className="text-[11px] text-gray-400 font-bold mt-0.5">{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <footer className="bg-[#0f0f1a] text-white pt-10 pb-32 px-5 border-t border-white/5">
          <div className="mb-8">
            <div className="text-3xl font-bold mb-4 flex items-center gap-2">
              <span style={{ fontFamily: "'Dancing Script', cursive" }}>YourPoodle</span>
              <span>🐾</span>
            </div>
            <p className="text-sm text-gray-400 font-bold leading-relaxed mb-6">
              Toy Poodle sahipleri için özel e-ticaret ve topluluk platformu. Sağlık, bakım, beslenme ve daha fazlası.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Youtube, Twitter].map((Icon, i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-200 cursor-pointer">
                  <Icon size={20} />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-10 mb-10">
            {[
              { title: "KURUMSAL", items: ["Hakkımızda", "Blog & Rehber"] },
              { title: "MAĞAZA", items: ["Tüm Ürünler", "Mamalar"] },
              { title: "DESTEK", items: ["Sıkça Sorulan Sorular", "Kargo ve Teslimat"] },
              { title: "TOPLULUK", items: ["Topluluk Akışı", "Köpek Dizini", "YourPoodle Club", "Sağlık Asistanı"] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-xs font-extrabold text-gray-200 mb-5 tracking-wider">{col.title}</h4>
                <ul className="space-y-4">
                  {col.items.map((item, j) => (
                    <li key={j} className="text-sm text-gray-400 font-bold cursor-pointer hover:text-white">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-white/10 text-center">
            <p className="text-[11px] text-gray-500 font-bold">© 2024 YourPoodle. Tüm hakları saklıdır.</p>
          </div>
        </footer>

        {/* BOTTOM NAV */}
        <div className="fixed bottom-0 w-full max-w-[430px] bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.08)] z-50 px-6 h-[80px]">
          <div className="flex justify-between items-center h-full relative">
            <Link href="/yourpoodle">
              <div className="flex flex-col items-center gap-1 cursor-pointer">
                <House size={24} className="text-gray-400" />
                <span className="text-[10px] font-bold text-gray-400">Home</span>
              </div>
            </Link>
            <div className="flex flex-col items-center gap-1 mr-6 text-gray-400">
              <Users size={24} /><span className="text-[10px] font-bold">Club</span>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 -top-6">
              <div className="w-[60px] h-[60px] bg-[#7C3AED] rounded-full flex items-center justify-center border-[6px] border-gray-50 shadow-sm cursor-pointer">
                <ShoppingCart size={24} className="text-white" />
              </div>
            </div>
            <div className="flex flex-col items-center gap-1 ml-6 text-gray-400">
              <ShoppingBag size={24} /><span className="text-[10px] font-bold">Shop</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-gray-400">
              <User size={24} /><span className="text-[10px] font-bold">My Profile</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
