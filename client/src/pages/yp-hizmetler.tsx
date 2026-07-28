import { useEffect } from "react";
import { useLocation } from "wouter";
import {
  Search, Bot, BookOpen, ShoppingBag, Truck, HelpCircle,
  Users, PawPrint, ChevronRight,
} from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { IS_YP } from "@/lib/store";

const BASE = IS_YP ? "" : "/yourpoodle";
const P  = "#6200EE";
const PL = "#F3EEFF";

interface Service {
  icon: React.ElementType;
  color: string;
  bg: string;
  title: string;
  desc: string;
  href: string;
  cta: string;
}

const SERVICES: Service[] = [
  {
    icon: Search,
    color: "#6200EE",
    bg: "#F3EEFF",
    title: "Mama Bul",
    desc: "Poodle'ınızın yaşına, kilosuna ve sağlık durumuna göre en uygun mamayı 11 adımda bulun.",
    href: `${BASE}/mama-bul`,
    cta: "Mama Bul'a Git",
  },
  {
    icon: Bot,
    color: "#7C3AED",
    bg: "#EDE9FE",
    title: "AI Asistan",
    desc: "Poodle sağlığı, beslenmesi ve eğitimi hakkında 7/24 yapay zeka destekli rehberlik.",
    href: `${BASE}/ai-asistan`,
    cta: "AI ile Sor",
  },
  {
    icon: BookOpen,
    color: "#0EA5E9",
    bg: "#E0F2FE",
    title: "Rehber",
    desc: "Veteriner onaylı makaleler: beslenme, bakım, sağlık, eğitim ve daha fazlası.",
    href: `${BASE}/rehber`,
    cta: "Rehberi Aç",
  },
  {
    icon: Users,
    color: "#EC4899",
    bg: "#FDF2F8",
    title: "Club",
    desc: "Diğer Toy Poodle sahipleriyle bağlantı kurun, deneyim paylaşın, toplulukta yerinizi alın.",
    href: `${BASE}/club`,
    cta: "Topluluğa Katıl",
  },
  {
    icon: ShoppingBag,
    color: "#16A34A",
    bg: "#F0FDF4",
    title: "Mağaza",
    desc: "Kuru mama, aksesuar, oyuncak ve bakım ürünleri — Türkiye geneline hızlı kargo.",
    href: `${BASE}/magaza`,
    cta: "Mağazaya Git",
  },
  {
    icon: PawPrint,
    color: "#D97706",
    bg: "#FFFBEB",
    title: "Benim Poodle'ım",
    desc: "Poodle'ınızın profilini oluşturun, sağlık notlarını takip edin, kişiselleştirilmiş öneriler alın.",
    href: `${BASE}/benim-poodleim`,
    cta: "Profil Oluştur",
  },
  {
    icon: Truck,
    color: "#0369A1",
    bg: "#F0F9FF",
    title: "Kargo & Teslimat",
    desc: "Türkiye geneli kargo seçenekleri, teslimat süreleri ve takip bilgileri.",
    href: `${BASE}/kargo`,
    cta: "Kargo Bilgisi",
  },
  {
    icon: HelpCircle,
    color: "#6B7280",
    bg: "#F9FAFB",
    title: "Sık Sorulan Sorular",
    desc: "Sipariş, iade, kargo, ödeme ve hesap hakkında sık sorulan soruların cevapları.",
    href: `${BASE}/sss`,
    cta: "SSS'ye Git",
  },
];

export default function YPHizmetlerPage() {
  const [, navigate] = useLocation();

  useEffect(() => {
    document.title = "Hizmetler | YourPoodle";
  }, []);

  return (
    <YPLayout activeLink={`${BASE}/hizmetler`} constrain={false}>
      <div style={{ padding: "24px 16px 100px", maxWidth: 600, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#111827", margin: "0 0 8px" }}>
            Hizmetlerimiz
          </h1>
          <p style={{ fontSize: 14, color: "#6B7280", margin: 0, lineHeight: 1.5 }}>
            Toy Poodle'ınız için ihtiyacınız olan tüm araçlar tek yerde.
          </p>
        </div>

        {/* Service Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {SERVICES.map((svc) => {
            const Icon = svc.icon;
            return (
              <button
                key={svc.title}
                onClick={() => navigate(svc.href)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "16px",
                  background: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: 14,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textAlign: "left",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                  transition: "box-shadow 0.15s, transform 0.15s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = `0 4px 16px rgba(98,0,238,0.12)`;
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Icon */}
                <div style={{
                  width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                  background: svc.bg, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={22} color={svc.color} strokeWidth={1.75} />
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 3px" }}>
                    {svc.title}
                  </p>
                  <p style={{ fontSize: 12, color: "#6B7280", margin: 0, lineHeight: 1.4,
                    overflow: "hidden", display: "-webkit-box",
                    WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {svc.desc}
                  </p>
                </div>

                {/* Arrow */}
                <ChevronRight size={18} color={svc.color} style={{ flexShrink: 0 }} />
              </button>
            );
          })}
        </div>

        {/* Brand footer note */}
        <div style={{
          marginTop: 32, padding: "16px", background: PL, borderRadius: 12,
          textAlign: "center",
        }}>
          <p style={{ fontSize: 13, color: P, fontWeight: 600, margin: "0 0 4px" }}>
            🐾 YourPoodle — Toy Poodle'ınızın Yanında
          </p>
          <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>
            Türkiye geneline hızlı kargo · Güvenli ödeme · Toy Poodle uzmanı içerik
          </p>
        </div>
      </div>
    </YPLayout>
  );
}
