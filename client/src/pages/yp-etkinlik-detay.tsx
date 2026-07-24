import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { ArrowLeft, MapPin, Calendar, Clock, Users, Plus } from "lucide-react";
import { getEvent } from "@/data/events";
import { IS_YP } from "@/lib/store";
import { useCustomer } from "@/contexts/CustomerContext";

const P = "#7022C4";
const BASE = IS_YP ? "" : "/yourpoodle";

export default function YPEtkinlikDetayPage() {
  const [, paramsA] = useRoute("/etkinlikler/:slug");
  const [, paramsB] = useRoute("/yourpoodle/etkinlikler/:slug");
  const [, navigate] = useLocation();
  const params = paramsA ?? paramsB;
  const slug = params?.slug ?? "istanbul-poodle-bulusmasi";
  const event = getEvent(slug) ?? { slug, title: "Etkinlik", dateDisplay: "", time: "", location: "", city: "", description: "", price: "free" as const, attendees: 0, organizer: "YourPoodle", tags: [] };
  const { isLoggedIn } = useCustomer();
  const [joined, setJoined] = useState(false);

  useEffect(() => { document.title = `${event.title} | YourPoodle`; }, [event.title]);

  function handleJoin() {
    if (!isLoggedIn) { navigate(`${BASE}/giris`); return; }
    setJoined(true);
    alert("Etkinliğe katıldınız! 🎉 Takvime eklendi.");
  }

  const AVATARS = ["🐩","🐾","🎀","🐶","🌸"];

  return (
    <YPLayout constrain={false}>
      <div style={{ minHeight: "100vh", background: "#FAFAFA", paddingBottom: 64 }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "20px 20px 0" }}>
          <button onClick={() => navigate(`${BASE}/etkinlikler`)}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#6B7280", fontSize: 13, fontWeight: 600, padding: 0, fontFamily: "inherit", marginBottom: 20 }}>
            <ArrowLeft size={16} /> Etkinlikler
          </button>

          {/* Hero */}
          <div style={{ height: 240, borderRadius: 20, background: "linear-gradient(135deg,#7022C4,#A855F7,#EC4899)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, position: "relative" }}>
            <span style={{ fontSize: 64 }}>🐩</span>
            {event.price !== "free" && (
              <div style={{ position: "absolute", top: 16, right: 16, padding: "6px 14px", borderRadius: 9999, background: "#fff", color: P, fontSize: 14, fontWeight: 700 }}>₺{event.price}</div>
            )}
            {event.price === "free" && (
              <div style={{ position: "absolute", top: 16, right: 16, padding: "6px 14px", borderRadius: 9999, background: "#10B981", color: "#fff", fontSize: 14, fontWeight: 700 }}>Ücretsiz</div>
            )}
          </div>

          <h1 style={{ fontSize: 24, fontWeight: 900, color: "#111827", margin: "0 0 16px" }}>{event.title}</h1>

          {/* Meta */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
            {[
              { Icon: Calendar, text: event.dateDisplay },
              { Icon: Clock, text: event.time },
              { Icon: MapPin, text: `${event.location}, ${event.city}` },
              { Icon: Users, text: `${event.attendees} katılımcı` },
            ].map(({ Icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", background: "#fff", borderRadius: 12, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
                <Icon size={16} color={P} />
                <span style={{ fontSize: 13, color: "#374151" }}>{text}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          <div style={{ background: "#fff", borderRadius: 16, padding: "20px 22px", marginBottom: 20, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 12px" }}>Etkinlik Hakkında</h2>
            <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, margin: 0 }}>{event.description}</p>
          </div>

          {/* Attendees */}
          <div style={{ background: "#fff", borderRadius: 16, padding: "16px 20px", marginBottom: 24, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
            <p style={{ margin: "0 0 10px", fontWeight: 700, fontSize: 14, color: "#111827" }}>Katılımcılar</p>
            <div style={{ display: "flex", alignItems: "center", gap: -4 }}>
              {AVATARS.map((a, i) => (
                <div key={i} style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#7022C4,#A855F7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, border: "2px solid #fff", marginLeft: i > 0 ? -8 : 0 }}>
                  {a}
                </div>
              ))}
              <span style={{ marginLeft: 12, fontSize: 13, color: "#6B7280", fontWeight: 600 }}>+{event.attendees - AVATARS.length} katılımcı</span>
            </div>
          </div>

          {/* CTA */}
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={handleJoin}
              style={{ flex: 2, height: 52, borderRadius: 14, border: "none", background: joined ? "#10B981" : P, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              {joined ? "✓ Katıldınız!" : "Katıl"}
            </button>
            <button onClick={() => alert("Takvime eklendi!")}
              style={{ flex: 1, height: 52, borderRadius: 14, border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Plus size={16} /> Takvim
            </button>
          </div>
        </div>
      </div>
    </YPLayout>
  );
}
