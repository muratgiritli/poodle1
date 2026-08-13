import { useEffect } from "react";
import { useLocation } from "wouter";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { Heart, Target, Building2, Mail, Phone, MapPin } from "lucide-react";
import { IS_YP } from "@/lib/store";
import { YP_COMPANY } from "@/lib/yp-company";

const P = "#5D3A1A";
const BASE = IS_YP ? "" : "/yourpoodle";

export default function YPHakkimizdaPage() {
  useEffect(() => { document.title = "Hakkımızda | YourPoodle"; }, []);
  const [, navigate] = useLocation();

  return (
    <YPLayout constrain={false}>
      <div style={{ minHeight: "100vh", background: "#FAFAFA", paddingBottom: 48 }}>
        <div style={{ background: "linear-gradient(135deg,#5D3A1A,#A67C52)", padding: "56px 20px", textAlign: "center" }}>
          <img src="/images/brand/logo.png" alt="YourPoodle" style={{ height: 48, margin: "0 auto 16px", display: "block" }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <h1 style={{ fontSize: 30, fontWeight: 900, color: "#fff", margin: "0 0 12px" }}>Hakkımızda</h1>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, maxWidth: 520, margin: "0 auto", lineHeight: 1.6 }}>
            Toy Poodle sahipleri için e-ticaret ve topluluk platformu — {YP_COMPANY.siteUrl.replace("https://", "")}
          </p>
        </div>

        <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px 0" }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "28px 32px", marginBottom: 24, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F5F0E6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Heart size={18} color={P} />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: 0 }}>Hikâyemiz</h2>
            </div>
            <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, margin: 0 }}>
              YourPoodle, Toy Poodle sahiplerinin kaliteli mama, bakım ürünleri ve güvenilir rehberliğe tek yerden
              ulaşması için kuruldu. Platform, {YP_COMPANY.legalName} tarafından işletilir; Türkiye geneline kargo ile
              hizmet verir.
            </p>
          </div>

          <div style={{ background: "#fff", borderRadius: 20, padding: "28px 32px", marginBottom: 24, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F5F0E6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Target size={18} color={P} />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: 0 }}>Misyonumuz</h2>
            </div>
            <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, margin: 0 }}>
              Her Toy Poodle sahibinin doğru beslenme ve bakım bilgisine kolayca ulaşmasını sağlamak;
              güvenli ödeme (iyzico, Visa, Mastercard, Troy) ve şeffaf teslimat/iade koşullarıyla alışverişi kolaylaştırmak.
            </p>
          </div>

          <div style={{ background: "#fff", borderRadius: 20, padding: "28px 32px", marginBottom: 28, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F5F0E6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Building2 size={18} color={P} />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: 0 }}>Şirket Bilgileri</h2>
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 12px" }}>{YP_COMPANY.legalName}</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              <li style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: "#374151" }}>
                <MapPin size={16} color={P} style={{ marginTop: 2, flexShrink: 0 }} />
                {YP_COMPANY.fullAddress}
              </li>
              <li style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14, color: "#374151" }}>
                <Phone size={16} color={P} />
                <a href={`tel:${YP_COMPANY.phoneTel}`} style={{ color: P, fontWeight: 600 }}>{YP_COMPANY.phoneDisplay}</a>
              </li>
              <li style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14, color: "#374151" }}>
                <Mail size={16} color={P} />
                <a href={`mailto:${YP_COMPANY.email}`} style={{ color: P, fontWeight: 600 }}>{YP_COMPANY.email}</a>
              </li>
            </ul>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
            {[
              { label: "Teslimat ve İade", href: `${BASE}/teslimat-iade` },
              { label: "Gizlilik Sözleşmesi", href: `${BASE}/gizlilik-politikasi` },
              { label: "Mesafeli Satış", href: `${BASE}/mesafeli-satis` },
              { label: "İletişim", href: `${BASE}/iletisim` },
            ].map((l) => (
              <button
                key={l.href}
                type="button"
                onClick={() => navigate(l.href)}
                style={{
                  border: `1.5px solid ${P}`, background: "#fff", color: P, borderRadius: 12,
                  padding: "10px 14px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </YPLayout>
  );
}
