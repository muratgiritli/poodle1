import { Truck, RefreshCcw, ShieldCheck, CreditCard, MapPin, Phone, Mail, Clock, Instagram, Facebook, Youtube, Twitter } from "lucide-react";

const TRUST = [
  { Icon: Truck,       title: "Hızlı Kargo",    sub: "Aynı gün kargoya verilir" },
  { Icon: RefreshCcw,  title: "Kolay İade",      sub: "14 gün ücretsiz iade" },
  { Icon: ShieldCheck, title: "Güvenli Ödeme",   sub: "256-bit SSL şifreleme" },
  { Icon: CreditCard,  title: "Taksit İmkânı",   sub: "12 taksit seçeneği" },
];

const COLUMNS = [
  {
    title: "Kurumsal",
    links: [
      { label: "Hakkımızda",          href: "/yourpoodle/hakkinda" },
      { label: "Kariyer",             href: "/yourpoodle/kariyer" },
      { label: "Bayi Başvurusu",      href: "/yourpoodle/bayi-basvurusu" },
      { label: "Fotoğraf Yarışması",  href: "/yourpoodle/club?tab=poodlem" },
    ],
  },
  {
    title: "Mağaza",
    links: [
      { label: "Tüm Ürünler",     href: "/yourpoodle/magaza" },
      { label: "Mamalar",         href: "/yourpoodle/magaza?kategori=mama" },
      { label: "Bakım Ürünleri",  href: "/yourpoodle/magaza?kategori=bakim" },
      { label: "Oyuncaklar",      href: "/yourpoodle/magaza?kategori=oyuncak" },
      { label: "Kıyafetler",      href: "/yourpoodle/magaza?kategori=kiyafet" },
      { label: "Özel Tasarım",    href: "/yourpoodle/ozel-tasarim" },
      { label: "Kampanyalar",     href: "/yourpoodle/magaza?kategori=kampanya" },
    ],
  },
  {
    title: "Destek",
    links: [
      { label: "Sık Sorulan Sorular",  href: "/yourpoodle/sss" },
      { label: "Kargo ve Teslimat",    href: "/yourpoodle/kargo" },
      { label: "İade ve Değişim",      href: "/yourpoodle/iade" },
      { label: "Güvenli Alışveriş",    href: "/yourpoodle/guvenli-alisveris" },
      { label: "KVKK / Gizlilik",      href: "/yourpoodle/gizlilik-politikasi" },
      { label: "Kullanım Koşulları",   href: "/yourpoodle/kullanim-sartlari" },
      { label: "Çerez Politikası",     href: "/yourpoodle/cerez-politikasi" },
      { label: "Mesafeli Satış Sözl.", href: "/yourpoodle/mesafeli-satis" },
    ],
  },
  {
    title: "Topluluk",
    links: [
      { label: "Topluluk Akışı",   href: "/yourpoodle/club?tab=akis" },
      { label: "Köpek Dizini",     href: "/yourpoodle/club/kopekler" },
      { label: "YourPoodle Club",  href: "/yourpoodle/club" },
      { label: "Sağlık Asistanı",  href: "/yourpoodle/ai-asistan" },
      { label: "Poodle Rehberi",   href: "/yourpoodle/rehber" },
      { label: "Etkinlikler",      href: "/yourpoodle/etkinlikler" },
    ],
  },
];

const SOCIALS = [
  { Icon: Instagram, href: "https://instagram.com/yourpoodle",  label: "Instagram" },
  { Icon: Facebook,  href: "https://facebook.com/yourpoodle",   label: "Facebook" },
  { Icon: Youtube,   href: "https://youtube.com/@yourpoodle",   label: "YouTube" },
  { Icon: Twitter,   href: "https://twitter.com/yourpoodle",    label: "Twitter/X" },
];

const CONTACT = [
  { Icon: Phone,  content: "0 850 840 3959", href: "tel:+908508403959" },
  { Icon: Mail,   content: "info@yourpoodle.com",  href: "mailto:info@yourpoodle.com" },
  { Icon: Clock,  content: "Hft. içi & Hft. sonu 09:00 – 22:00", href: undefined },
  { Icon: MapPin, content: "Türkiye geneline hızlı teslimat", href: undefined },
];

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "YourPoodle",
  "url": "https://www.yourpoodle.com",
  "telephone": "+908508403959",
  "email": "info@yourpoodle.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Yenimahalle Atatürk 3. Kısım Blv. No:113/A",
    "addressLocality": "Samsun",
    "addressCountry": "TR",
  },
  "areaServed": "TR",
  "sameAs": [
    "https://instagram.com/yourpoodle",
    "https://facebook.com/yourpoodle",
    "https://youtube.com/@yourpoodle",
    "https://twitter.com/yourpoodle",
  ],
};

export default function YPFooter() {
  return (
    <footer role="contentinfo" className="bg-gray-950 mt-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      {/* ═══════════ SECTION 1 — TRUST BAR ═══════════ */}
      <div className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TRUST.map(({ Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgb(45,27,105)" }}
                >
                  <Icon size={18} style={{ color: "rgb(167,139,250)" }} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-white leading-tight">{title}</p>
                  <p className="text-[11px] text-gray-500 leading-tight mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════ SECTION 2 — MAIN CONTENT ═══════════ */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8 lg:gap-10">

          {/* ── Brand + Contact column (2/6) ── */}
          <div className="md:col-span-2 flex flex-col gap-5">

            {/* Logo */}
            <a href="/yourpoodle" className="flex items-center w-fit">
              <img
                src="/yourpoodle-logo.jpg"
                alt="YourPoodle"
                style={{ height: 38, width: "auto", objectFit: "contain", background: "#fff", borderRadius: 12, padding: "5px 14px", boxShadow: "0 2px 12px rgba(0,0,0,0.25)" }}
              />
            </a>

            {/* Description */}
            <p className="text-[13px] text-gray-400 leading-relaxed max-w-[260px]">
              Toy Poodle sahipleri için Türkiye geneline hızlı kargo yapan uzman e-ticaret ve topluluk platformu.
            </p>

            {/* Social buttons */}
            <div className="flex gap-2">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                  style={{ background: "rgb(31,19,51)" }}
                >
                  <Icon size={16} strokeWidth={2} />
                </a>
              ))}
            </div>

            {/* Contact info */}
            <div className="flex flex-col gap-3">
              {CONTACT.map(({ Icon, content, href }) => (
                <div key={content} className="flex items-start gap-2.5">
                  <Icon
                    size={14}
                    strokeWidth={2}
                    className="mt-0.5 flex-shrink-0"
                    style={{ color: "rgb(167,139,250)" }}
                  />
                  {href ? (
                    <a
                      href={href}
                      className="text-[12px] text-gray-400 hover:text-white transition-colors leading-snug"
                    >
                      {content}
                    </a>
                  ) : (
                    <span className="text-[12px] text-gray-400 leading-snug whitespace-pre-line">
                      {content}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── 4 Link columns (4/6) ── */}
          <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-6">
            {COLUMNS.map(({ title, links }) => (
              <div key={title}>
                <h4 className="text-[13px] font-bold text-white mb-4 uppercase tracking-wide">
                  {title}
                </h4>
                <ul className="space-y-2">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <a
                        href={href}
                        className="text-[13px] text-gray-400 hover:text-white transition-colors"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════ SECTION 3 — COPYRIGHT BAR ═══════════ */}
      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3">

          {/* Copyright */}
          <p className="text-[11px] text-gray-500 text-center md:text-left">
            © 2026 YourPoodle — Toy Poodle sahipleri için.{" "}
            <span className="text-gray-600">Tüm hakları saklıdır.</span>
          </p>

          {/* Payment badges */}
          <div className="flex gap-2 flex-wrap justify-center">
            {["VISA", "MC", "Troy", "İyzico"].map(badge => (
              <span
                key={badge}
                className="px-2.5 py-1 rounded-md text-[10px] font-bold text-gray-400"
                style={{
                  background: "rgb(17,24,39)",
                  border: "1px solid rgb(31,41,55)",
                }}
              >
                {badge}
              </span>
            ))}
            {/* SSL badge */}
            <span
              className="px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1"
              style={{
                background: "rgb(27,58,45)",
                color: "rgb(52,211,153)",
                border: "1px solid rgb(6,95,70)",
              }}
            >
              <ShieldCheck size={12} strokeWidth={2.5} />
              SSL
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
