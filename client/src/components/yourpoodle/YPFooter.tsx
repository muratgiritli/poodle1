import { Truck, RefreshCcw, ShieldCheck, CreditCard, MapPin, Phone, Mail, Clock, Instagram, Facebook, Youtube, Twitter, MessageCircle } from "lucide-react";
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
      { label: "Atakum Mağazamız",         href: `${B}/magazalar/atakum` },
      { label: "Bayi Başvurusu",           href: `${B}/bayi-basvurusu` },
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
      { label: "Kampanyalar",         href: `${B}/kampanyalar` },
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
      { label: "Sipariş Takip",        href: `${B}/siparis-takip` },
      { label: "Sık Sorulan Sorular",  href: `${B}/sss` },
      { label: "Kargo ve Teslimat",    href: `${B}/kargo` },
      { label: "İade ve Değişim",      href: `${B}/iade` },
      { label: "Güvenli Alışveriş",    href: `${B}/guvenli-alisveris` },
      { label: "Kullanım Koşulları",   href: `${B}/kullanim-sartlari` },
      { label: "Çerez Politikası",     href: `${B}/cerez-politikasi` },
    ],
  },
  {
    title: "Keşfet",
    links: [
      { label: "Sağlık Asistanı",  href: `${B}/ai-asistan` },
      { label: "Poodle Rehberi",   href: `${B}/rehber` },
      { label: "Poodle Araçları",  href: `${B}/araclar` },
      { label: "Hizmetler",        href: `${B}/hizmetler` },
      { label: "Benim Poodle'ım",  href: `${B}/benim-poodleim` },
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

const WA_HREF = `https://wa.me/${YP_COMPANY.phoneTel.replace(/\D/g, "")}?text=${encodeURIComponent("Merhaba, YourPoodle hakkında yardım almak istiyorum.")}`;

const CONTACT = [
  { Icon: Phone,  content: "0 850 840 3959", href: "tel:+908508403959" },
  { Icon: MessageCircle, content: "WhatsApp Destek", href: WA_HREF },
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
  "description": "Türkiye geneline kargo ile Toy Poodle e-ticaret platformu.",
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
    <footer
      role="contentinfo"
      className="yp-site-footer mt-0"
      style={{ background: "#2D1B11", color: "#fff" }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      {/* ═══════════ SECTION 1 — TRUST BAR ═══════════ */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,.10)" }}>
        <div className="mx-auto px-5 md:px-8 py-7" style={{ maxWidth: 1200 }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TRUST.map(({ Icon, title, sub, href }) => (
              <a key={title} href={href} className="flex items-center gap-3 hover:opacity-90 transition-opacity" style={{ color: "inherit" }}>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.08)" }}
                >
                  <Icon size={18} style={{ color: "#D7AD80" }} strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-[12px] font-bold leading-tight" style={{ color: "#FFF9F2" }}>{title}</p>
                  <p className="text-[11px] leading-tight mt-0.5" style={{ color: "rgba(255,255,255,.48)" }}>{sub}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════ SECTION 2 — MAIN CONTENT ═══════════ */}
      <div className="mx-auto px-5 md:px-8 py-12 md:py-14" style={{ maxWidth: 1200 }}>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8 lg:gap-10">

          {/* ── Brand + Contact column (2/6) ── */}
          <div className="md:col-span-2 flex flex-col gap-5">

            {/* Logo */}
            <a href={B || "/"} className="flex items-center w-fit">
              <img
                src="/images/brand/logo.png"
                alt="YourPoodle"
                style={{ height: 40, width: "auto", objectFit: "contain", background: "#FFF9F2", borderRadius: 12, padding: "5px 14px" }}
              />
            </a>

            {/* Description */}
            <p className="text-[13px] leading-relaxed max-w-[280px]" style={{ color: "rgba(255,255,255,.58)" }}>
              Toy Poodle sahipleri için seçilmiş ürünler, bakım rehberleri ve kişisel yardımcılar.
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
                  className="w-9 h-9 rounded-xl flex items-center justify-center hover:text-white transition-colors"
                  style={{ background: "rgba(255,255,255,.07)", color: "rgba(255,255,255,.52)", border: "1px solid rgba(255,255,255,.07)" }}
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
                    style={{ color: "#D7AD80" }}
                  />
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-[12px] hover:text-white transition-colors leading-snug"
                      style={{ color: "rgba(255,255,255,.58)" }}
                    >
                      {content}
                    </a>
                  ) : (
                    <span className="text-[12px] leading-snug whitespace-pre-line" style={{ color: "rgba(255,255,255,.58)" }}>
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
                <h4 className="text-[12px] font-bold mb-4 uppercase tracking-[0.08em]" style={{ color: "#FFF9F2" }}>
                  {title}
                </h4>
                <ul className="space-y-2">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <a
                        href={href}
                        className="text-[13px] hover:text-white transition-colors"
                        style={{ color: "rgba(255,255,255,.55)" }}
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
      <div style={{ borderTop: "1px solid rgba(255,255,255,.10)" }}>
        <div className="mx-auto px-5 md:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3" style={{ maxWidth: 1200 }}>

          {/* Copyright */}
          <p className="text-[11px] text-center md:text-left" style={{ color: "rgba(255,255,255,.42)" }}>
            © 2026 YourPoodle — Toy Poodle sahipleri için.{" "}
            <span>Tüm hakları saklıdır.</span>
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
