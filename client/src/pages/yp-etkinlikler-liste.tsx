import { useEffect } from "react";
import { useLocation } from "wouter";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { MapPin, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { IS_YP } from "@/lib/store";

const P = "#5D3A1A";
const BASE = IS_YP ? "" : "/yourpoodle";

export default function YPEtkinliklerListePage() {
  useEffect(() => { document.title = "Poodle Etkinlikleri | YourPoodle"; }, []);
  const [, navigate] = useLocation();

  const { data: events = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/yp-events"],
    staleTime: 2 * 60 * 1000,
  });

  return (
    <YPLayout constrain={false}>
      <div style={{ minHeight: "100vh", background: "#FAFAFA", paddingBottom: 48 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 0" }}>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: "#111827", margin: "0 0 6px" }}>Poodle Etkinlikleri</h1>
          <p style={{ color: "#6B7280", fontSize: 15, margin: "0 0 32px" }}>Yakınızdaki etkinlikleri keşfedin</p>

          {isLoading && (
            <div style={{ padding: "48px 0", textAlign: "center", color: "#6B7280", fontSize: 14 }}>
              Etkinlikler yükleniyor…
            </div>
          )}

          {!isLoading && events.length === 0 && (
            <div style={{ padding: "48px 0", textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#111827", marginBottom: 8 }}>Yaklaşan etkinlik yok</div>
              <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6, maxWidth: 300, margin: "0 auto" }}>
                Şu an aktif bir etkinlik bulunmuyor. Yakında yeni etkinlikler eklenecek!
              </p>
            </div>
          )}

          {!isLoading && events.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 20 }}>
              {events.map((event: any) => (
                <div key={event.id} style={{ background: "#fff", borderRadius: 18, overflow: "hidden", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
                  {/* Color header */}
                  <div style={{ height: 140, background: event.color ? `${event.color}33` : "linear-gradient(135deg,#5D3A1A,#A67C52)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    <span style={{ fontSize: 48 }}>🐩</span>
                    <div style={{ position: "absolute", top: 12, right: 12 }}>
                      <span style={{ padding: "4px 12px", borderRadius: 9999, background: event.free ? "#10B981" : P, color: "#fff", fontSize: 12, fontWeight: 700 }}>
                        {event.free ? "Ücretsiz" : "Ücretli"}
                      </span>
                    </div>
                    {event.day && (
                      <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(255,255,255,0.9)", borderRadius: 10, padding: "4px 10px", textAlign: "center" }}>
                        <div style={{ fontSize: 18, fontWeight: 900, color: event.color || P, lineHeight: 1 }}>{event.day}</div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: event.color || P }}>{event.month}</div>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "18px 20px" }}>
                    <h2 style={{ fontSize: 16, fontWeight: 800, color: "#111827", margin: "0 0 10px" }}>{event.title}</h2>
                    <div style={{ display: "flex", gap: 14, marginBottom: 12, flexWrap: "wrap" }}>
                      {event.event_date && (
                        <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#6B7280", fontSize: 12 }}>
                          <Calendar size={12} /> {new Date(event.event_date).toLocaleDateString("tr-TR", { day:"numeric", month:"long", year:"numeric" })}
                        </div>
                      )}
                      {event.location && (
                        <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#6B7280", fontSize: 12 }}>
                          <MapPin size={12} /> {event.location}
                        </div>
                      )}
                    </div>
                    {event.slug ? (
                      <button onClick={() => navigate(`${BASE}/etkinlikler/${event.slug}`)}
                        style={{ width: "100%", height: 42, borderRadius: 10, border: "none", background: "#F5F0E6", color: P, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                        Detayları Gör
                      </button>
                    ) : (
                      <div style={{ height: 42, borderRadius: 10, background: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 13, color: "#9CA3AF" }}>Detay yakında</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </YPLayout>
  );
}
