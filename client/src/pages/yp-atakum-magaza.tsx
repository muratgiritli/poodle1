import { useEffect } from "react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { MapPin, Phone, Clock, Mail, MessageCircle } from "lucide-react";

const P = "#7022C4";

const HOURS = [
  { day: "Pazartesi", hours: "09:00 – 20:00" },
  { day: "Salı", hours: "09:00 – 20:00" },
  { day: "Çarşamba", hours: "09:00 – 20:00" },
  { day: "Perşembe", hours: "09:00 – 20:00" },
  { day: "Cuma", hours: "09:00 – 20:00" },
  { day: "Cumartesi", hours: "10:00 – 18:00" },
  { day: "Pazar", hours: "Kapalı" },
];

export default function YPAtakumMagazaPage() {
  useEffect(() => { document.title = "Atakum Mağazası | YourPoodle"; }, []);

  return (
    <YPLayout constrain={false}>
      <div style={{ minHeight: "100vh", background: "#FAFAFA", paddingBottom: 48 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 0" }}>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: "#111827", margin: "0 0 4px" }}>YourPoodle Pet Shop Atakum Mağazası</h1>
          <p style={{ color: "#6B7280", fontSize: 15, margin: "0 0 32px" }}>YourPoodle Pet Shop — Atakum, Samsun</p>

          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 28 }}>
            {/* Left: Contact */}
            <div style={{ flex: "1 1 300px", background: "#fff", borderRadius: 18, padding: 28, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: "#111827", margin: "0 0 20px" }}>Adres ve İletişim</h2>

              <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F5F0FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <MapPin size={18} color={P} />
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "#111827" }}>Adres</p>
                  <p style={{ margin: 0, fontSize: 13, color: "#6B7280", lineHeight: 1.5 }}>Cumhuriyet Mah. Atatürk Bulvarı No:42<br />Atakum, Samsun 55200</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F5F0FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Phone size={18} color={P} />
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "#111827" }}>Telefon</p>
                  <a href="tel:+903620001234" style={{ color: "#6B7280", fontSize: 13, textDecoration: "none" }}>0362 000 12 34</a>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 24 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F5F0FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Mail size={18} color={P} />
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "#111827" }}>E-posta</p>
                  <a href="mailto:info@yourpoodle.com" style={{ color: "#6B7280", fontSize: 13, textDecoration: "none" }}>info@yourpoodle.com</a>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <a href="https://wa.me/905320001234" target="_blank" rel="noreferrer"
                  style={{ flex: 1, height: 44, borderRadius: 10, border: "none", background: "#25D366", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, textDecoration: "none" }}>
                  <MessageCircle size={16} /> WhatsApp
                </a>
                <a href="tel:+903620001234"
                  style={{ flex: 1, height: 44, borderRadius: 10, border: "none", background: "#2563EB", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, textDecoration: "none" }}>
                  <Phone size={16} /> Ara
                </a>
              </div>
            </div>

            {/* Right: Hours */}
            <div style={{ flex: "1 1 260px", background: "#fff", borderRadius: 18, padding: 28, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <Clock size={18} color={P} />
                <h2 style={{ fontSize: 17, fontWeight: 800, color: "#111827", margin: 0 }}>Çalışma Saatleri</h2>
              </div>
              {HOURS.map(({ day, hours }) => (
                <div key={day} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F3F4F6" }}>
                  <span style={{ fontSize: 13, color: "#374151" }}>{day}</span>
                  <span style={{ fontSize: 13, fontWeight: hours === "Kapalı" ? 600 : 400, color: hours === "Kapalı" ? "#EF4444" : "#111827" }}>{hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Map placeholder */}
          <div style={{ borderRadius: 18, overflow: "hidden", position: "relative" }}>
            <div style={{ height: 220, background: "linear-gradient(135deg,#E8E3F0,#D1C9E8)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
              <MapPin size={36} color={P} />
              <p style={{ margin: 0, color: P, fontWeight: 600, fontSize: 15 }}>Atakum, Samsun</p>
              <a href="https://maps.google.com/?q=Atakum+Samsun" target="_blank" rel="noreferrer"
                style={{ padding: "10px 24px", borderRadius: 10, background: P, color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
                Yol Tarifi Al →
              </a>
            </div>
          </div>
        </div>
      </div>
    </YPLayout>
  );
}
