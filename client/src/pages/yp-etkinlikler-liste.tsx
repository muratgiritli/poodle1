import { useEffect } from "react";
import { useLocation } from "wouter";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { MapPin, Calendar, Users } from "lucide-react";
import { MOCK_EVENTS } from "@/data/events";
import { IS_YP } from "@/lib/store";

const P = "#7022C4";
const BASE = IS_YP ? "" : "/yourpoodle";

export default function YPEtkinliklerListePage() {
  useEffect(() => { document.title = "Poodle Etkinlikleri | YourPoodle"; }, []);
  const [, navigate] = useLocation();

  return (
    <YPLayout constrain={false}>
      <div style={{ minHeight: "100vh", background: "#FAFAFA", paddingBottom: 48 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 0" }}>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: "#111827", margin: "0 0 6px" }}>Poodle Etkinlikleri</h1>
          <p style={{ color: "#6B7280", fontSize: 15, margin: "0 0 32px" }}>Yakınızdaki etkinlikleri keşfedin</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 20 }}>
            {MOCK_EVENTS.map(event => (
              <div key={event.slug} style={{ background: "#fff", borderRadius: 18, overflow: "hidden", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
                {/* Image placeholder */}
                <div style={{ height: 140, background: "linear-gradient(135deg,#7022C4,#A855F7)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <span style={{ fontSize: 48 }}>🐩</span>
                  <div style={{ position: "absolute", top: 12, right: 12 }}>
                    <span style={{ padding: "4px 12px", borderRadius: 9999, background: event.price === "free" ? "#10B981" : "#fff", color: event.price === "free" ? "#fff" : P, fontSize: 12, fontWeight: 700 }}>
                      {event.price === "free" ? "Ücretsiz" : `₺${event.price}`}
                    </span>
                  </div>
                </div>
                <div style={{ padding: "18px 20px" }}>
                  <h2 style={{ fontSize: 16, fontWeight: 800, color: "#111827", margin: "0 0 10px" }}>{event.title}</h2>
                  <div style={{ display: "flex", gap: 14, marginBottom: 12, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#6B7280", fontSize: 12 }}>
                      <Calendar size={12} /> {event.dateDisplay} · {event.time}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#6B7280", fontSize: 12 }}>
                      <MapPin size={12} /> {event.city}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#6B7280", fontSize: 12 }}>
                      <Users size={12} /> {event.attendees} katılımcı
                    </div>
                  </div>
                  <button onClick={() => navigate(`${BASE}/etkinlikler/${event.slug}`)}
                    style={{ width: "100%", height: 42, borderRadius: 10, border: "none", background: "#F5F0FF", color: P, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                    Detayları Gör
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </YPLayout>
  );
}
