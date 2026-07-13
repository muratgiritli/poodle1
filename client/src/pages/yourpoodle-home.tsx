import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Menu, Search, Bell, ShoppingBag, BookOpen, Users, LibraryBig, PawPrint,
  Gift, ChevronRight, ChevronDown, Heart, ShoppingCart, MessageCircle, Bot,
  Home, User,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@shared/schema";

// ── DATA ─────────────────────────────────────────────────────────────────────

const QUICK_LINKS = [
  { icon: ShoppingBag,  label: "Mağaza",          href: "/yourpoodle" },
  { icon: BookOpen,     label: "Rehber",           href: "/yourpoodle/rehber" },
  { icon: Users,        label: "Topluluk",         href: "/yourpoodle" },
  { icon: LibraryBig,   label: "Bilgi Bankası",    href: "/yourpoodle/bilgi" },
  { icon: PawPrint,     label: "Benim Poodle'ım",  href: "/yourpoodle" },
];

const POPULAR_GUIDES = [
  { gradient: "from-orange-200 to-amber-100",  emoji: "🚽", title: "Tuvalet Eğitimi Nasıl Verilir?", tag: "Eğitim",    tagColor: "text-orange-600 bg-orange-50",  href: "/yourpoodle/rehber/egitim" },
  { gradient: "from-purple-200 to-pink-100",   emoji: "✂️",  title: "Tüy Bakımı Rehberi",           tag: "Bakım",     tagColor: "text-purple-600 bg-purple-50",  href: "/yourpoodle/rehber/bakim" },
  { gradient: "from-green-200 to-emerald-100", emoji: "🍖",  title: "Poodle Mama Seçimi",           tag: "Beslenme",  tagColor: "text-green-700 bg-green-50",    href: "/yourpoodle/rehber/beslenme" },
  { gradient: "from-blue-200 to-sky-100",      emoji: "✈️",  title: "Seyahat Rehberi: Uçak Yolculuğu", tag: "Seyahat", tagColor: "text-blue-600 bg-blue-50",   href: "/yourpoodle/rehber/seyahat" },
];

const FAQ_ITEMS = [
  { q: "Poodle tüy döker mi?",                  a: "Toy Poodle'lar minimal tüy döker ve alerjisi olan kişiler için uygundur. Ancak düzenli tarama ve tıraş gerektirirler." },
  { q: "Poodle günde ne kadar mama yemeli?",     a: "2–3 kg'lık yetişkin bir Toy Poodle için günde yaklaşık 80–120 gr kuru mama yeterlidir. Günde 2 öğünde verin." },
  { q: "Toy Poodle ne sıklıkla tıraş edilmeli?", a: "Her 6–8 haftada bir tıraş edilmesi önerilir. Tüyleri hızlı uzar; düzenli bakım keçeleşmeyi önler." },
  { q: "Göz akıntısı normal mi?",                a: "Az miktarda şeffaf akıntı normaldir. Sarı-yeşil veya yoğun akıntı veteriner gerektirir. Günlük temizlik önerilir." },
];

const HERO_DOTS = [0, 1, 2, 3];

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export default function YourPoodleHomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());

  const { updateQty, basket, itemCount } = useCart();

  const { data: allProducts = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Pick 4 featured products (first 4 with images)
  const featured = allProducts
    .filter((p) => p.img)
    .slice(0, 4);

  const toggleFav = (id: number) =>
    setFavorites((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });

  const handleAdd = (p: Product) => {
    updateQty(String(p.id), 1);
    setAddedIds((prev) => new Set(prev).add(p.id));
    setTimeout(() => setAddedIds((prev) => { const s = new Set(prev); s.delete(p.id); return s; }), 1200);
  };

  return (
    <div className="w-full min-h-screen flex justify-center" style={{ background: "#FCFBFF", fontFamily: "'Nunito', sans-serif" }}>
      {/* ── FONT LOADER via CSS @import hack (no useEffect) */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Nunito:wght@400;600;700;800;900&display=swap');.yph-noscroll::-webkit-scrollbar{display:none}.yph-noscroll{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <div className="w-full max-w-[430px] min-h-screen relative pb-28 overflow-x-hidden" style={{ background: "#FCFBFF" }}>

        {/* ── 1. HEADER ───────────────────────────────────────────── */}
        <header className="bg-white sticky top-0 z-40 border-b border-[#EEE9F7] shadow-sm">
          <div className="flex items-center justify-between px-4 h-16">
            {/* Left: hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-1.5 -ml-1 text-gray-700">
              <Menu size={24} strokeWidth={2.5} />
            </button>

            {/* Center: logo */}
            <span
              style={{ fontFamily: "'Dancing Script', cursive", fontSize: "26px", fontWeight: 700, letterSpacing: "-0.3px" }}
              className="text-gray-900 select-none flex items-center gap-1"
            >
              YourPoodle<span className="text-purple-500 text-[20px]">🐾</span>
            </span>

            {/* Right: search + notification */}
            <div className="flex items-center gap-3 text-gray-700">
              <Search size={22} strokeWidth={2.5} />
              <div className="relative">
                <Bell size={22} strokeWidth={2.5} />
                {itemCount > 0 && (
                  <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-purple-600 text-white rounded-full text-[9px] font-black flex items-center justify-center">
                    {itemCount > 9 ? "9+" : itemCount}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Slide-down menu */}
        {menuOpen && (
          <div className="absolute top-16 left-0 right-0 z-30 bg-white border-b border-[#EEE9F7] shadow-lg px-5 py-4 flex flex-col gap-3">
            {[
              { label: "Ana Sayfa", href: "/yourpoodle" },
              { label: "Rehber", href: "/yourpoodle/rehber" },
              { label: "Bilgi Bankası", href: "/yourpoodle/bilgi" },
              { label: "AI Poodle Asistanı", href: "/yourpoodle/ai-poodle-asistani" },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <div onClick={() => setMenuOpen(false)} className="py-2.5 text-[15px] font-bold text-gray-800 border-b border-gray-50 cursor-pointer hover:text-purple-600 transition-colors">
                  {item.label}
                </div>
              </Link>
            ))}
          </div>
        )}

        <main className="px-4 pt-4 space-y-4">

          {/* ── 2. HERO BANNER ───────────────────────────────────── */}
          <section
            className="rounded-[24px] overflow-hidden relative shadow-sm"
            style={{ background: "linear-gradient(135deg, #F0EAFF 0%, #E8DAFF 50%, #F5EEFF 100%)", minHeight: "210px" }}
          >
            {/* Decorative paw */}
            <div className="absolute top-4 right-36 text-purple-200 text-3xl select-none pointer-events-none rotate-12 opacity-60">🐾</div>
            <div className="absolute bottom-10 left-36 text-purple-100 text-xl select-none pointer-events-none -rotate-12 opacity-50">🐾</div>

            <div className="flex items-stretch">
              {/* Text side */}
              <div className="flex-1 px-5 pt-5 pb-4 flex flex-col justify-between min-h-[210px]">
                <div>
                  <h1 className="text-[24px] font-black text-gray-900 leading-tight mb-1">
                    Poodle için<br />
                    <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg, #7C3AED, #A855F7)" }}>
                      en iyisi burada!
                    </span>
                  </h1>
                  <p className="text-[12.5px] text-gray-600 font-semibold leading-snug mt-2">
                    Sevgiyle bakım, doğru bilgi<br />ve mutlu bir yaşam.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-2 mt-3">
                  <Link href="/yourpoodle">
                    <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-black text-[13px] px-4 py-2.5 rounded-full shadow-[0_4px_14px_-4px_rgba(124,58,237,0.5)] w-full">
                      <ShoppingBag size={15} strokeWidth={2.5} /> Alışverişe Başla
                    </button>
                  </Link>
                  <Link href="/yourpoodle">
                    <button className="flex items-center justify-center gap-2 bg-white text-[#7C3AED] font-black text-[13px] px-4 py-2.5 rounded-full border-2 border-purple-300 w-full">
                      <Users size={15} strokeWidth={2.5} /> Topluluğa Katıl
                    </button>
                  </Link>
                </div>

                {/* Slider dots */}
                <div className="flex gap-1.5 mt-3">
                  {HERO_DOTS.map((i) => (
                    <div key={i} className={`h-1.5 rounded-full transition-all ${i === 0 ? "w-5 bg-purple-600" : "w-1.5 bg-purple-200"}`} />
                  ))}
                </div>
              </div>

              {/* Poodle image */}
              <div className="w-[150px] flex-shrink-0 flex items-end justify-center pt-2 pr-2">
                <img
                  src="/images/poodle-hero.png"
                  alt="Toy Poodle"
                  loading="eager"
                  className="w-full h-[205px] object-contain object-bottom drop-shadow-lg"
                  onError={(e) => {
                    const el = e.target as HTMLImageElement;
                    el.style.display = "none";
                    el.parentElement!.innerHTML = '<div class="text-8xl flex items-end justify-center h-[200px]">🐩</div>';
                  }}
                />
              </div>
            </div>
          </section>

          {/* ── 3. QUICK NAV ─────────────────────────────────────── */}
          <section className="bg-white rounded-[20px] border border-[#EEE9F7] shadow-sm px-3 py-3">
            <div className="flex justify-between">
              {QUICK_LINKS.map((item) => (
                <Link key={item.label} href={item.href}>
                  <div className="flex flex-col items-center gap-1.5 cursor-pointer group min-w-0 flex-1">
                    <div className="w-12 h-12 rounded-full bg-[#F5F0FF] flex items-center justify-center text-[#7C3AED] group-hover:bg-purple-100 transition-colors">
                      <item.icon size={22} strokeWidth={2} />
                    </div>
                    <span className="text-[10.5px] font-extrabold text-gray-700 text-center leading-tight px-0.5">{item.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── 4. ÜYELİK KANCA KARTI ───────────────────────────── */}
          <section className="bg-[#F5F0FF] rounded-[18px] border border-purple-100 px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 text-purple-600">
              <Gift size={20} strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-gray-900 text-[13px] leading-tight">Yeni üye ol, 100 TL bonus kazan! 🎉</p>
              <p className="text-[11px] text-gray-500 font-semibold mt-0.5">Kampanyaları kaçırma, hemen üye ol.</p>
            </div>
            <Link href="/giris?tab=register">
              <button className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-black text-[12px] px-3.5 py-2.5 rounded-full flex-shrink-0 shadow-sm whitespace-nowrap">
                Üye Ol
              </button>
            </Link>
          </section>

          {/* ── 5. BUGÜN EN ÇOK OKUNANLAR ───────────────────────── */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[16.5px] font-black text-gray-900">Bugün En Çok Okunanlar</h2>
              <Link href="/yourpoodle/rehber">
                <span className="text-[13px] font-bold text-purple-600 flex items-center gap-0.5 cursor-pointer">
                  Tümünü Gör <ChevronRight size={14} strokeWidth={3} />
                </span>
              </Link>
            </div>

            <div className="flex gap-3.5 overflow-x-auto yph-noscroll pb-1 -mx-4 px-4">
              {POPULAR_GUIDES.map((guide, i) => (
                <Link key={i} href={guide.href}>
                  <div className="flex-shrink-0 w-[165px] bg-white rounded-[16px] border border-[#EEE9F7] shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                    {/* Image area */}
                    <div className={`h-[105px] bg-gradient-to-br ${guide.gradient} flex items-center justify-center text-5xl`}>
                      {guide.emoji}
                    </div>
                    <div className="p-3">
                      <p className="font-black text-[12.5px] text-gray-900 leading-tight mb-2 line-clamp-2">{guide.title}</p>
                      <span className={`inline-block text-[10.5px] font-black px-2.5 py-1 rounded-full ${guide.tagColor}`}>
                        {guide.tag}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── 6. SİZİN İÇİN SEÇTİKLERİMİZ ───────────────────── */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[16.5px] font-black text-gray-900">Sizin İçin Seçtiklerimiz</h2>
              <Link href="/kategori/kopek">
                <span className="text-[13px] font-bold text-purple-600 flex items-center gap-0.5 cursor-pointer">
                  Tümünü Gör <ChevronRight size={14} strokeWidth={3} />
                </span>
              </Link>
            </div>

            <div className="flex gap-3.5 overflow-x-auto yph-noscroll pb-1 -mx-4 px-4">
              {featured.length === 0
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-[155px] h-[220px] bg-white rounded-[16px] border border-[#EEE9F7] animate-pulse" />
                  ))
                : featured.map((p) => (
                    <div key={p.id} className="flex-shrink-0 w-[155px] bg-white rounded-[16px] border border-[#EEE9F7] shadow-sm overflow-hidden">
                      {/* Product image + fav */}
                      <div className="relative h-[110px] bg-gray-50 flex items-center justify-center p-2">
                        <img
                          src={p.img || "/images/poodle-hero.png"}
                          alt={p.name}
                          loading="lazy"
                          className="h-full w-full object-contain"
                        />
                        <button
                          onClick={() => toggleFav(p.id)}
                          className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100"
                        >
                          <Heart
                            size={14}
                            strokeWidth={2.5}
                            className={favorites.has(p.id) ? "fill-red-500 text-red-500" : "text-gray-300"}
                          />
                        </button>
                      </div>
                      <div className="p-2.5">
                        <p className="text-[11.5px] font-bold text-gray-700 leading-tight mb-1 line-clamp-2 min-h-[30px]">{p.name}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[14px] font-black text-gray-900">
                            ₺{Number(p.price).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                          </span>
                          <button
                            onClick={() => handleAdd(p)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all ${
                              addedIds.has(p.id)
                                ? "bg-green-500 text-white scale-90"
                                : "bg-gradient-to-br from-[#7C3AED] to-[#A855F7] text-white"
                            }`}
                          >
                            <ShoppingCart size={14} strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </section>

          {/* ── 7. AI POODLE ASİSTANI ────────────────────────────── */}
          <section
            className="rounded-[18px] px-4 py-3.5 flex items-center gap-3.5"
            style={{ background: "linear-gradient(135deg, #F5F0FF, #EDE5FF)" }}
          >
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 text-2xl">
              🤖
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-black text-gray-900 text-[14px]">Poodle Asistanı</span>
                <span className="bg-purple-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase">YENİ</span>
              </div>
              <p className="text-[11.5px] text-gray-600 font-semibold leading-snug">Poodle bakımında aklına takılan her şeyi sor!</p>
            </div>
            <Link href="/yourpoodle/ai-poodle-asistani">
              <button className="flex items-center gap-1.5 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-black text-[12px] px-3.5 py-2.5 rounded-full shadow-sm flex-shrink-0 whitespace-nowrap">
                <MessageCircle size={13} strokeWidth={2.5} /> Asistana Sor
              </button>
            </Link>
          </section>

          {/* ── 8. SIK SORULAN SORULAR ───────────────────────────── */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[16.5px] font-black text-gray-900">Sık Sorulan Sorular</h2>
              <Link href="/yourpoodle/rehber/sik-sorulan-sorular">
                <span className="text-[13px] font-bold text-purple-600 flex items-center gap-0.5 cursor-pointer">
                  Tümünü Gör <ChevronRight size={14} strokeWidth={3} />
                </span>
              </Link>
            </div>

            <div className="bg-white rounded-[20px] border border-[#EEE9F7] shadow-sm overflow-hidden">
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} className={i < FAQ_ITEMS.length - 1 ? "border-b border-[#F3EEFF]" : ""}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-4 py-4 text-left gap-3 hover:bg-[#FAFAFF] transition-colors"
                  >
                    <span className="font-bold text-[13.5px] text-gray-800 leading-snug flex-1">{item.q}</span>
                    <ChevronDown
                      size={18}
                      strokeWidth={2.5}
                      className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 text-[12.5px] text-gray-600 font-semibold leading-relaxed border-t border-[#F3EEFF] pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

        </main>

        {/* ── 9. MOBİL ALT NAVİGASYON ─────────────────────────── */}
        <nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white border-t border-[#EEE9F7] z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-end justify-around px-2 pb-safe" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>

            {/* Ana Sayfa */}
            <Link href="/yourpoodle">
              <div className="flex flex-col items-center gap-1 pt-2 pb-1 px-3 cursor-pointer text-purple-600">
                <Home size={24} strokeWidth={2.5} />
                <span className="text-[10px] font-black">Ana Sayfa</span>
              </div>
            </Link>

            {/* Mağaza */}
            <Link href="/kategori/kopek">
              <div className="flex flex-col items-center gap-1 pt-2 pb-1 px-3 cursor-pointer text-gray-400 hover:text-purple-500 transition-colors">
                <ShoppingBag size={24} strokeWidth={2.5} />
                <span className="text-[10px] font-bold">Mağaza</span>
              </div>
            </Link>

            {/* Center paw button */}
            <div className="flex flex-col items-center -mt-6 pb-1">
              <Link href="/yourpoodle">
                <div className="w-[58px] h-[58px] rounded-full bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center shadow-[0_4px_20px_-4px_rgba(124,58,237,0.6)] cursor-pointer border-4 border-white hover:scale-105 transition-transform">
                  <PawPrint size={26} className="text-white" strokeWidth={2.5} />
                </div>
              </Link>
            </div>

            {/* Topluluk */}
            <div className="flex flex-col items-center gap-1 pt-2 pb-1 px-3 cursor-pointer text-gray-400">
              <Users size={24} strokeWidth={2.5} />
              <span className="text-[10px] font-bold">Topluluk</span>
            </div>

            {/* Profilim */}
            <Link href="/hesabim">
              <div className="flex flex-col items-center gap-1 pt-2 pb-1 px-3 cursor-pointer text-gray-400 hover:text-purple-500 transition-colors">
                <User size={24} strokeWidth={2.5} />
                <span className="text-[10px] font-bold">Profilim</span>
              </div>
            </Link>

          </div>
        </nav>

      </div>
    </div>
  );
}
