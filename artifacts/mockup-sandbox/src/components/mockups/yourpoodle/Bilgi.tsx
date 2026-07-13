import React, { useEffect } from 'react';
import {
  Search,
  ShoppingCart,
  Menu,
  ChevronLeft,
  Zap,
  Utensils,
  Syringe,
  Cake,
  Scale,
  Activity,
  Smile,
  Leaf,
  Droplets,
  Scissors,
  Bone,
  PawPrint,
  Heart,
  Truck,
  RefreshCw,
  Shield,
  CreditCard,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  House,
  Users,
  ShoppingBag,
  User
} from 'lucide-react';

export function Bilgi() {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Nunito:wght@400;600;700;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div 
      className="w-full min-h-[100dvh] bg-gray-50 flex flex-col relative"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <div className="w-full max-w-[430px] mx-auto bg-gray-50 min-h-screen shadow-2xl relative pb-28">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white shadow-sm flex items-center justify-between px-5 py-4">
          <div className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Dancing Script', cursive" }}>
            YourPoodle
          </div>
          <div className="flex items-center gap-4">
            <Search size={20} className="text-gray-600" />
            <ShoppingCart size={20} className="text-gray-600" />
            <div className="text-sm font-bold text-gray-800">🇬🇧 EN</div>
            <Menu size={24} className="text-gray-900" />
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-100 flex items-center px-5 gap-6 overflow-x-auto no-scrollbar">
          <div className="py-4 text-sm font-bold text-gray-400 whitespace-nowrap">Home</div>
          <div className="py-4 text-sm font-bold text-gray-400 whitespace-nowrap">Guide</div>
          <div className="py-4 text-sm font-bold text-[#7C3AED] border-b-[3px] border-[#7C3AED] whitespace-nowrap">Knowledge Base</div>
          <div className="py-4 text-sm font-bold text-gray-400 whitespace-nowrap">Shop</div>
        </div>

        {/* Breadcrumb */}
        <div className="px-5 py-4 flex items-center gap-1">
          <ChevronLeft size={16} className="text-gray-400" />
          <span className="text-sm font-bold text-gray-500">Ana Sayfa</span>
        </div>

        {/* Page Header */}
        <div className="px-5 mb-5">
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <Zap size={24} className="text-yellow-400 fill-yellow-400" />
            Bilgi Bankası
          </h1>
          <p className="text-sm text-gray-500 font-bold mt-1">
            Poodle'iniz için hesaplayıcılar ve sağlık rehberleri.
          </p>
        </div>

        {/* Tool Grid Card */}
        <div className="bg-white rounded-[32px] mx-5 p-6 shadow-sm border border-gray-100 mb-8">
          <div className="grid grid-cols-3 gap-y-6 gap-x-4">
            {/* ROW 1 */}
            <div className="flex flex-col items-center text-center gap-2 cursor-pointer">
              <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center bg-pink-100 text-pink-500">
                <Utensils size={28} strokeWidth={2.5} />
              </div>
              <div className="text-[12px] font-extrabold text-gray-800 leading-tight">Mama Hesaplama</div>
              <div className="text-[10px] text-gray-500 leading-tight px-1 font-bold">Günlük mama miktarını hesapla</div>
            </div>
            <div className="flex flex-col items-center text-center gap-2 cursor-pointer">
              <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center bg-rose-100 text-rose-500">
                <Syringe size={28} strokeWidth={2.5} />
              </div>
              <div className="text-[12px] font-extrabold text-gray-800 leading-tight">Aşı Takvimi</div>
              <div className="text-[10px] text-gray-500 leading-tight px-1 font-bold">Aşılarını düzenli takip et</div>
            </div>
            <div className="flex flex-col items-center text-center gap-2 cursor-pointer">
              <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center bg-purple-100 text-purple-500">
                <Cake size={28} strokeWidth={2.5} />
              </div>
              <div className="text-[12px] font-extrabold text-gray-800 leading-tight">Yaş Hesaplama</div>
              <div className="text-[10px] text-gray-500 leading-tight px-1 font-bold">Köpek yaşını insan yaşına çevir</div>
            </div>

            {/* ROW 2 */}
            <div className="flex flex-col items-center text-center gap-2 cursor-pointer">
              <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center bg-emerald-100 text-emerald-500">
                <Scale size={28} strokeWidth={2.5} />
              </div>
              <div className="text-[12px] font-extrabold text-gray-800 leading-tight">İdeal Kilo</div>
              <div className="text-[10px] text-gray-500 leading-tight px-1 font-bold">İdeal kilosunu öğren</div>
            </div>
            <div className="flex flex-col items-center text-center gap-2 cursor-pointer">
              <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center bg-cyan-100 text-cyan-500">
                <Activity size={28} strokeWidth={2.5} />
              </div>
              <div className="text-[12px] font-extrabold text-gray-800 leading-tight">Hastalık Kontrolü</div>
              <div className="text-[10px] text-gray-500 leading-tight px-1 font-bold">Belirtileri kontrol et</div>
            </div>
            <div className="flex flex-col items-center text-center gap-2 cursor-pointer">
              <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center bg-teal-100 text-teal-500">
                <Smile size={28} strokeWidth={2.5} />
              </div>
              <div className="text-[12px] font-extrabold text-gray-800 leading-tight">Diş Kontrolü</div>
              <div className="text-[10px] text-gray-500 leading-tight px-1 font-bold">Ağız ve diş sağlığı tüyosu</div>
            </div>

            {/* ROW 3 */}
            <div className="flex flex-col items-center text-center gap-2 cursor-pointer">
              <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center bg-pink-100 text-pink-500">
                <Leaf size={28} strokeWidth={2.5} />
              </div>
              <div className="text-[12px] font-extrabold text-gray-800 leading-tight">Dışkı Rehberi</div>
              <div className="text-[10px] text-gray-500 leading-tight px-1 font-bold">Rengine göre kontrol et</div>
            </div>
            <div className="flex flex-col items-center text-center gap-2 cursor-pointer">
              <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center bg-blue-100 text-blue-500">
                <Droplets size={28} strokeWidth={2.5} />
              </div>
              <div className="text-[12px] font-extrabold text-gray-800 leading-tight">Su Hesaplama</div>
              <div className="text-[10px] text-gray-500 leading-tight px-1 font-bold">Günlük su ihtiyacını hesapla</div>
            </div>
            <div className="flex flex-col items-center text-center gap-2 cursor-pointer">
              <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center bg-fuchsia-100 text-fuchsia-500">
                <Scissors size={28} strokeWidth={2.5} />
              </div>
              <div className="text-[12px] font-extrabold text-gray-800 leading-tight">Tıraş Zamanı</div>
              <div className="text-[10px] text-gray-500 leading-tight px-1 font-bold">Son tıraş tarihine göre hesapla</div>
            </div>

            {/* ROW 4 */}
            <div className="flex flex-col items-center text-center gap-2 cursor-pointer">
              <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center bg-orange-100 text-orange-500">
                <Bone size={28} strokeWidth={2.5} />
              </div>
              <div className="text-[12px] font-extrabold text-gray-800 leading-tight">Ödül Hesabı</div>
              <div className="text-[10px] text-gray-500 leading-tight px-1 font-bold">Ödül mamasının kalorilerini hesapla</div>
            </div>
            <div className="flex flex-col items-center text-center gap-2 cursor-pointer">
              <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center bg-teal-100 text-teal-500">
                <PawPrint size={28} strokeWidth={2.5} />
              </div>
              <div className="text-[12px] font-extrabold text-gray-800 leading-tight">Aktivite Hesabı</div>
              <div className="text-[10px] text-gray-500 leading-tight px-1 font-bold">Günlük egzersiz ihtiyacını öğren</div>
            </div>
            <div className="flex flex-col items-center text-center gap-2 cursor-pointer">
              <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center bg-amber-100 text-amber-500">
                <Heart size={28} strokeWidth={2.5} />
              </div>
              <div className="text-[12px] font-extrabold text-gray-800 leading-tight">İnsan Yaşı</div>
              <div className="text-[10px] text-gray-500 leading-tight px-1 font-bold">Karşılaştırmalı yaş tablosu</div>
            </div>
          </div>
        </div>

        {/* Trust Bar */}
        <div className="bg-[#1a1a2e] py-8 px-5 w-full">
          <div className="grid grid-cols-2 gap-y-8 gap-x-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#2a2a4a] text-[#a78bfa] flex items-center justify-center shrink-0">
                <Truck size={22} />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Hızlı Kargo</div>
                <div className="text-[11px] text-gray-400 font-bold mt-0.5">Aynı gün kargoya verilir</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#2a2a4a] text-[#22d3ee] flex items-center justify-center shrink-0">
                <RefreshCw size={22} />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Kolay İade</div>
                <div className="text-[11px] text-gray-400 font-bold mt-0.5">14 gün ücretsiz iade</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#2a2a4a] text-[#60a5fa] flex items-center justify-center shrink-0">
                <Shield size={22} />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Güvenli Ödeme</div>
                <div className="text-[11px] text-gray-400 font-bold mt-0.5">256-bit SSL şifreleme</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#2a2a4a] text-[#34d399] flex items-center justify-center shrink-0">
                <CreditCard size={22} />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Taksit İmkânı</div>
                <div className="text-[11px] text-gray-400 font-bold mt-0.5">12 taksit seçeneği</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
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
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-200 cursor-pointer">
                <Instagram size={20} />
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-200 cursor-pointer">
                <Facebook size={20} />
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-200 cursor-pointer">
                <Youtube size={20} />
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-200 cursor-pointer">
                <Twitter size={20} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-10 mb-10">
            <div>
              <h4 className="text-xs font-extrabold text-gray-200 mb-5 tracking-wider">KURUMSAL</h4>
              <ul className="space-y-4">
                <li className="text-sm text-gray-400 font-bold cursor-pointer hover:text-white">Hakkımızda</li>
                <li className="text-sm text-gray-400 font-bold cursor-pointer hover:text-white">Blog & Rehber</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-gray-200 mb-5 tracking-wider">MAĞAZA</h4>
              <ul className="space-y-4">
                <li className="text-sm text-gray-400 font-bold cursor-pointer hover:text-white">Tüm Ürünler</li>
                <li className="text-sm text-gray-400 font-bold cursor-pointer hover:text-white">Mamalar</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-gray-200 mb-5 tracking-wider">DESTEK</h4>
              <ul className="space-y-4">
                <li className="text-sm text-gray-400 font-bold cursor-pointer hover:text-white">Sıkça Sorulan Sorular</li>
                <li className="text-sm text-gray-400 font-bold cursor-pointer hover:text-white">Kargo ve Teslimat</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-gray-200 mb-5 tracking-wider">TOPLULUK</h4>
              <ul className="space-y-4">
                <li className="text-sm text-gray-400 font-bold cursor-pointer hover:text-white">Topluluk Akışı</li>
                <li className="text-sm text-gray-400 font-bold cursor-pointer hover:text-white">Köpek Dizini</li>
                <li className="text-sm text-gray-400 font-bold cursor-pointer hover:text-white">YourPoodle Club</li>
                <li className="text-sm text-gray-400 font-bold cursor-pointer hover:text-white">Sağlık Asistanı</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 text-center">
            <p className="text-[11px] text-gray-500 font-bold">© 2024 YourPoodle. Tüm hakları saklıdır.</p>
          </div>
        </footer>

        {/* Bottom Navigation Bar */}
        <div className="fixed bottom-0 w-full max-w-[430px] bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.08)] z-50 px-6 h-[80px]">
          <div className="flex justify-between items-center h-full relative">
            <div className="flex flex-col items-center gap-1 cursor-pointer">
              <House size={24} className="text-gray-400" />
              <span className="text-[10px] font-bold text-gray-400">Home</span>
            </div>
            <div className="flex flex-col items-center gap-1 cursor-pointer mr-6">
              <Users size={24} className="text-gray-400" />
              <span className="text-[10px] font-bold text-gray-400">Club</span>
            </div>

            {/* Center FAB */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-6">
              <div className="w-[60px] h-[60px] bg-[#7C3AED] rounded-full flex items-center justify-center border-[6px] border-gray-50 shadow-sm cursor-pointer">
                <ShoppingCart size={24} className="text-white fill-white" />
              </div>
            </div>

            <div className="flex flex-col items-center gap-1 cursor-pointer ml-6">
              <ShoppingBag size={24} className="text-gray-400" />
              <span className="text-[10px] font-bold text-gray-400">Shop</span>
            </div>
            <div className="flex flex-col items-center gap-1 cursor-pointer">
              <User size={24} className="text-gray-400" />
              <span className="text-[10px] font-bold text-gray-400">My Profile</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
