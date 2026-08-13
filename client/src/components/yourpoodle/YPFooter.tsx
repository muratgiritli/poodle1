import { Truck, RefreshCcw, ShieldCheck, CreditCard, MapPin, Phone, Mail, Clock, Instagram, Facebook, Youtube, Twitter } from "lucide-react";
import { IS_YP } from "@/lib/store";
import { YP_COMPANY } from "@/lib/yp-company";
import PaymentCardLogos from "./PaymentCardLogos";

const B = IS_YP ? "" : "/yourpoodle";

const TRUST = [
  { Icon: Truck,       title: "Hızlı Kargo",    sub: "Hızlı kargoya verilir", href: `${B}/teslimat-iade` },
  { Icon: RefreshCcw,  title: "Kolay İade",      sub: "14 gün ücretsiz iade", href: `${B}/iade` },
  { Icon: ShieldCheck, title: "Güvenli Ödeme",   sub: "256-bit SSL şifreleme", href: `${B}/ssl` },
  { Icon: CreditCard,  title: "Taksit İmkânı",   sub: "3 taksit seçeneği", href: `${B}/odeme-kartlari` },
];

const COLUMNS = [
  {
    title: "Kurumsal",
    links: [
      { label: "Hakkımızda",               href: `${B}/hakkimizda` },
      { label: "SSL Sertifikası",          href: `${B}/ssl` },
      { label: "Teslimat ve İade Şartları", href: `${B}/teslimat-iade` },
      { label: "Gizlilik Sözleşmesi",      href: `${B}/gizlilik-politikasi` },
      { label: "Mesafeli Satış Sözleşmesi", href: `${B}/mesafeli-satis` },
    ],
  },
  {
    title: "Mağaza",
    links: [
      { label: "Tüm Ürünler",        href: `${B}/magaza` },
      { label: "Kuru Mamalar",        href: `${B}/kuru-mama` },
      { label: "Yaş Mamalar",         href: `${B}/kategori/yas-mama` },
      { label: "Oyuncaklar",          href: `${B}/kategori/oyuncaklar` },
      { label: "Bakım & Sağlık",      href: `${B}/kategori/bakim-saglik` },
      { label: "Taşıma & Kulübeler",  href: `${B}/kategori/tasima-cantalari` },
    ],
  },
  {
    title: "Destek",
    links: [
      { label: "İletişim",             href: `${B}/iletisim` },
      { label: "Sık Sorulan Sorular",  href: `${B}/sss` },
      { label: "Kargo ve Teslimat",    href: `${B}/kargo` },
      { label: "İade ve Değişim",      href: `${B}/iade` },
      { label: "Güvenli Alışveriş",    href: `${B}/guvenli-alisveris` },
      { label: "Kullanım Koşulları",   href: `${B}/kullanim-sartlari` },
      { label: "Çerez Politikası",     href: `${B}/cerez-politikasi` },
    ],
  },
  {
    title: "Topluluk",
    links: [
      { label: "Topluluk Akışı",   href: `${B}/club?tab=akis` },
      { label: "Köpek Dizini",     href: `${B}/club/kopekler` },
      { label: "YourPoodle Club",  href: `${B}/club` },
      { label: "Sağlık Asistanı",  href: `${B}/ai-asistan` },
      { label: "Poodle Rehberi",   href: `${B}/rehber` },
      { label: "Etkinlikler",      href: `${B}/etkinlikler` },
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
  { Icon: Mail,   content: "info@sizpa.com",  href: "mailto:info@sizpa.com" },
  { Icon: Clock,  content: "Hft. içi & Hft. sonu 09:00 – 22:00", href: undefined },
  { Icon: MapPin, content: "Türkiye geneline hızlı teslimat", href: undefined },
];

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": YP_COMPANY.brand,
  "legalName": YP_COMPANY.legalName,
  "url": YP_COMPANY.siteUrl,
  "telephone": YP_COMPANY.phoneTel,
  "email": YP_COMPANY.email,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": YP_COMPANY.addressLine,
    "addressLocality": YP_COMPANY.city,
    "addressRegion": YP_COMPANY.city,
    "addressCountry": "TR",
  },
  "description": "Türkiye geneline kargo ile Toy Poodle e-ticaret ve topluluk platformu.",
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
    <footer role="contentinfo" className="yp-site-footer bg-gray-950 mt-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      {/* ═══════════ SECTION 1 — TRUST BAR ═══════════ */}
      <div className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TRUST.map(({ Icon, title, sub, href }) => (
              <a key={title} href={href} className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "#3D2612" }}
                >
                  <Icon size={18} style={{ color: "#A67C52" }} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-white leading-tight">{title}</p>
                  <p className="text-[11px] text-gray-500 leading-tight mt-0.5">{sub}</p>
                </div>
              </a>
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
            <a href={B || "/"} className="flex items-center w-fit">
              <img
                src="/images/brand/logo.png"
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
                    style={{ color: "#A67C52" }}
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

          {/* Official iyzico payment marks band */}
          <div className="flex gap-3 flex-wrap justify-center items-center">
            <PaymentCardLogos height={36} href={`${B}/iyzico`} />
            <a
              href={`${B}/ssl`}
              className="px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 hover:opacity-90"
              style={{
                background: "rgb(27,58,45)",
                color: "rgb(52,211,153)",
                border: "1px solid rgb(6,95,70)",
              }}
            >
              <ShieldCheck size={12} strokeWidth={2.5} />
              SSL
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
