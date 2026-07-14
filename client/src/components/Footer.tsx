import { useState } from "react";
import { Link } from "wouter";
import { Mail, HelpCircle, Truck, Lock, Cookie, Shield, ScrollText, MessageSquare, ShieldCheck, Brain, BookOpen, Users, ShoppingBag, Sparkles } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import kartLogoPath from "@assets/kart_1775765432584.png";
import ContactDialog from "@/components/ContactDialog";
import { useStore } from "@/lib/store";

const YP_PLATFORM_LINKS = [
  { label: "Rehber", href: "/yourpoodle/rehber", icon: BookOpen },
  { label: "Bilgi Bankası", href: "/yourpoodle/bilgi", icon: Sparkles },
  { label: "AI Asistan", href: "/yourpoodle/ai-asistan", icon: Brain },
  { label: "Mama Bul", href: "/yourpoodle/mama-bul", icon: Sparkles },
  { label: "Mağaza", href: "/yourpoodle/magaza", icon: ShoppingBag },
];

const YP_COMMUNITY_LINKS = [
  { label: "Poodle Club", href: "/yourpoodle/club", icon: Users },
  { label: "Etkinlikler", href: "/yourpoodle/etkinlikler", icon: Users },
  { label: "Topluluk", href: "/yourpoodle/topluluk", icon: Users },
  { label: "Profil Oluştur", href: "/yourpoodle/poodle-ekle", icon: Users },
];

const SUPPORT_LINKS = [
  { label: "Sıkça Sorulan Sorular", href: "/sss", icon: HelpCircle },
  { label: "Sipariş Takibi", href: "/siparis-takip", icon: Truck },
  { label: "Teslimat ve İade", href: "/teslimat-iade", icon: Truck },
  { label: "İletişim", href: "/iletisim", icon: Mail },
  { label: "Hakkımızda", href: "/yourpoodle/hakkinda", icon: BookOpen },
];

const LEGAL_LINKS = [
  { label: "Gizlilik Politikası", href: "/gizlilik", icon: Shield },
  { label: "Çerez Politikası", href: "/cerez-politikasi", icon: Cookie },
  { label: "KVKK Sözleşmesi", href: "/kvkk", icon: Lock },
  { label: "Mesafeli Satış Sözleşmesi", href: "/mesafeli-satis", icon: ScrollText },
];

export default function Footer() {
  const [contactOpen, setContactOpen] = useState(false);
  const store = useStore();
  const whatsappDigits = store.phone.replace(/\D/g, "");

  return (
    <footer className="block bg-gray-900 text-gray-300 mt-8 pb-20 md:pb-0" data-testid="footer-desktop">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">

          {/* Platform */}
          <div>
            <h3 className="text-white font-bold text-lg mb-1">Platform</h3>
            <p className="text-gray-400 text-sm mb-4">Poodle'ınız için araçlar</p>
            <ul className="space-y-2">
              {YP_PLATFORM_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <Link href={link.href} className="flex items-center gap-2 text-sm hover:text-white transition-colors" data-testid={`footer-link-${link.href.slice(1).replace(/\//g, "-")}`}>
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Topluluk */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Topluluk</h3>
            <ul className="space-y-2">
              {YP_COMMUNITY_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <Link href={link.href} className="flex items-center gap-2 text-sm hover:text-white transition-colors" data-testid={`footer-link-${link.href.slice(1).replace(/\//g, "-")}`}>
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <h3 className="text-white font-bold text-base mt-6 mb-3">Destek</h3>
            <ul className="space-y-2">
              {SUPPORT_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <Link href={link.href} className="flex items-center gap-2 text-sm hover:text-white transition-colors" data-testid={`footer-link-${link.href.slice(1).replace(/\//g, "-")}`}>
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">İletişim</h3>
            <div className="flex flex-col gap-2 mb-4">
              <a
                href={`https://wa.me/${whatsappDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-300 hover:border-green-500 hover:bg-green-50 text-gray-800 text-sm font-bold shadow-sm transition-colors whitespace-nowrap w-fit"
                data-testid="btn-footer-whatsapp"
              >
                <SiWhatsapp className="w-4 h-4 text-green-600 shrink-0" />
                <span>WhatsApp Destek</span>
              </a>
            </div>
            <ul className="space-y-3">
              <li>
                <button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  className="flex items-center gap-2.5 text-sm text-yellow-300 hover:text-yellow-200 font-bold transition-colors"
                  data-testid="footer-iletisime-gec"
                >
                  <MessageSquare className="w-4 h-4 flex-shrink-0" />
                  İletişime Geç →
                </button>
              </li>
              <li className="text-xs text-gray-500 mt-2">
                <a href={`mailto:${store.email}`} className="hover:text-white transition-colors">{store.email}</a>
              </li>
            </ul>
          </div>

          {/* Yasal */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Yasal</h3>
            <ul className="space-y-2">
              {LEGAL_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <Link href={link.href} className="flex items-center gap-2 text-sm hover:text-white transition-colors" data-testid={`footer-link-${link.href.slice(1).replace(/\//g, "-")}`}>
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* SEO linkler — poodle odaklı */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {[
              { label: "Toy Poodle Bakımı", href: "/yourpoodle/bakim" },
              { label: "Poodle Mama Seçimi", href: "/yourpoodle/mama" },
              { label: "Poodle Eğitimi", href: "/yourpoodle/egitim" },
              { label: "Poodle Sağlığı", href: "/yourpoodle/saglik" },
              { label: "Poodle Hesaplama Araçları", href: "/yourpoodle/bilgi" },
              { label: "Köpek Maması", href: "/kopek-mamasi" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-gray-400 hover:text-white transition-colors"
                data-testid={`footer-seo-${l.href.slice(1).replace(/\//g, "-")}`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Alt bar */}
        <div className="border-t border-gray-700 mt-6 pt-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <img
                src="/images/yourpoodle-logo.jpg"
                alt="YourPoodle"
                className="h-6 object-contain opacity-80"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>

            <div className="flex items-center gap-4" data-testid="footer-badges">
              <div className="flex items-center gap-1.5 bg-gray-800 rounded px-2.5 py-1.5" data-testid="footer-ssl-badge">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                <span className="text-[10px] text-green-400 font-semibold">SSL</span>
                <span className="text-[10px] text-gray-400">Güvenli Bağlantı</span>
              </div>
              <img
                src={kartLogoPath}
                alt="Mastercard, Visa, American Express, Troy"
                className="h-6 object-contain"
                data-testid="footer-card-logos"
              />
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-gray-500" data-testid="footer-sizpa-credit">
            © {new Date().getFullYear()}{" "}
            <a
              href="https://www.sizpa.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white underline underline-offset-2 transition-colors"
              data-testid="footer-sizpa-link"
            >
              Sizpa İnternet Tic. Ltd. Şti.
            </a>{" "}
            · Tüm hakları saklıdır.
          </p>
        </div>
      </div>
      <ContactDialog open={contactOpen} onOpenChange={setContactOpen} />
    </footer>
  );
}
