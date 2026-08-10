import { useEffect, useState } from "react";
import { useRoute, useLocation, useSearch } from "wouter";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { ArrowLeft, MapPin, Calendar, Clock, Users, Plus } from "lucide-react";
import { getEvent } from "@/data/events";
import { IS_YP } from "@/lib/store";
import { useCustomer } from "@/contexts/CustomerContext";

const P = "#5D3A1A";
const BASE = IS_YP ? "" : "/yourpoodle";

interface DbEvent {
  id: number;
  title: string;
  description: string | null;
  location: string | null;
  event_date: string | null;
  day: string;
  month: string;
  year: string | null;
  type: string;
  free: boolean;
  color: string;
}

export default function YPEtkinlikDetayPage() {
  const [, paramsA] = useRoute("/etkinlikler/:slug");
  const [, paramsB] = useRoute("/yourpoodle/etkinlikler/:slug");
  const [, navigate] = useLocation();
  const search = useSearch();
  const params = paramsA ?? paramsB;
  const slug = params?.slug ?? "";
  const isPreview = new URLSearchParams(search).get("preview") === "1";

  const mockEvent = slug ? getEvent(slug) : undefined;

  const [dbEvent, setDbEvent] = useState<DbEvent | null>(null);
  const [loading, setLoading] = useState(!mockEvent);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // Reset state deterministically on every slug change.
    setDbEvent(null);
    setNotFound(false);

    if (!slug) {
      setLoading(false);
      return;
    }
    if (mockEvent) {
      setLoading(false);
      return;
    }

    // Race-safe fetch: abort the in-flight request if slug changes before it resolves.
    const controller = new AbortController();
    setLoading(true);

    const previewParam = isPreview ? "?preview=1" : "";
    fetch(`/api/yp-events/by-slug/${encodeURIComponent(slug)}${previewParam}`, { signal: controller.signal })
      .then(r => {
        if (!r.ok) { setNotFound(true); setLoading(false); return null; }
        return r.json();
      })
      .then(data => {
        if (data) setDbEvent(data);
        setLoading(false);
      })
      .catch(err => {
        // Ignore AbortError — a new fetch for the next slug is already in flight.
        if (err?.name === "AbortError") return;
        setNotFound(true);
        setLoading(false);
      });

    return () => controller.abort();
  }, [slug, mockEvent]);

  const { isLoggedIn } = useCustomer();
  const [joined, setJoined] = useState(false);

  // Normalise to a display shape
  const title = mockEvent?.title ?? dbEvent?.title ?? "Etkinlik";
  const dateDisplay = mockEvent?.dateDisplay ?? (dbEvent ? `${dbEvent.day} ${dbEvent.month}${dbEvent.year ? " " + dbEvent.year : ""}` : "");
  const time = mockEvent?.time ?? "";
  const locationText = mockEvent ? `${mockEvent.location}, ${mockEvent.city}` : (dbEvent?.location ?? "");
  const description = mockEvent?.description ?? dbEvent?.description ?? "";
  const price = mockEvent?.price ?? (dbEvent?.free === false ? "ücretli" : "free");
  const attendees = mockEvent?.attendees ?? 0;

  useEffect(() => { document.title = `${title} | YourPoodle`; }, [title]);

  function handleJoin() {
    if (!isLoggedIn) { navigate(`${BASE}/giris`); return; }
    setJoined(true);
    alert("Etkinliğe katıldınız! 🎉 Takvime eklendi.");
  }

  const AVATARS = ["🐩","🐾","🎀","🐶","🌸"];

  if (loading) {
    return (
      <YPLayout constrain={false}>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "#6B7280", fontSize: 14 }}>Yükleniyor…</p>
        </div>
      </YPLayout>
    );
  }

  if (notFound || (!mockEvent && !dbEvent)) {
    return (
      <YPLayout constrain={false}>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <p style={{ fontSize: 48 }}>🐩</p>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>Etkinlik bulunamadı</h1>
          <button onClick={() => navigate(`${BASE}/etkinlikler`)}
            style={{ padding: "10px 20px", borderRadius: 12, border: "none", background: P, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            Etkinliklere dön
          </button>
        </div>
      </YPLayout>
    );
  }

  return (
    <YPLayout constrain={false}>
      {isPreview && (
        <div style={{ background: "#F59E0B", color: "#fff", textAlign: "center", padding: "8px 16px", fontSize: 13, fontWeight: 700 }}>
          ⚠️ Önizleme modu — Bu etkinlik henüz yayında değil (Gizli)
        </div>
      )}
      <div style={{ minHeight: "100vh", background: "#FAFAFA", paddingBottom: 64 }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "20px 20px 0" }}>
          <button onClick={() => navigate(`${BASE}/etkinlikler`)}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#6B7280", fontSize: 13, fontWeight: 600, padding: 0, fontFamily: "inherit", marginBottom: 20 }}>
            <ArrowLeft size={16} /> Etkinlikler
          </button>

          {/* Hero */}
          <div style={{ height: 240, borderRadius: 20, background: dbEvent ? `linear-gradient(135deg,${dbEvent.color},#A67C52,#EC4899)` : "linear-gradient(135deg,#5D3A1A,#A67C52,#EC4899)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, position: "relative" }}>
            <span style={{ fontSize: 64 }}>🐩</span>
            {price !== "free" && (
              <div style={{ position: "absolute", top: 16, right: 16, padding: "6px 14px", borderRadius: 9999, background: "#fff", color: P, fontSize: 14, fontWeight: 700 }}>
                {typeof price === "number" ? `₺${price}` : price}
              </div>
            )}
            {price === "free" && (
              <div style={{ position: "absolute", top: 16, right: 16, padding: "6px 14px", borderRadius: 9999, background: "#10B981", color: "#fff", fontSize: 14, fontWeight: 700 }}>Ücretsiz</div>
            )}
          </div>

          <h1 style={{ fontSize: 24, fontWeight: 900, color: "#111827", margin: "0 0 16px" }}>{title}</h1>

          {/* Meta */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
            {[
              { Icon: Calendar, text: dateDisplay },
              ...(time ? [{ Icon: Clock, text: time }] : []),
              ...(locationText ? [{ Icon: MapPin, text: locationText }] : []),
              { Icon: Users, text: `${attendees} katılımcı` },
            ].map(({ Icon, text }) => text ? (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", background: "#fff", borderRadius: 12, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
                <Icon size={16} color={P} />
                <span style={{ fontSize: 13, color: "#374151" }}>{text}</span>
              </div>
            ) : null)}
          </div>

          {/* Description */}
          {description && (
            <div style={{ background: "#fff", borderRadius: 16, padding: "20px 22px", marginBottom: 20, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 12px" }}>Etkinlik Hakkında</h2>
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, margin: 0 }}>{description}</p>
            </div>
          )}

          {/* Attendees */}
          {attendees > 0 && (
            <div style={{ background: "#fff", borderRadius: 16, padding: "16px 20px", marginBottom: 24, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
              <p style={{ margin: "0 0 10px", fontWeight: 700, fontSize: 14, color: "#111827" }}>Katılımcılar</p>
              <div style={{ display: "flex", alignItems: "center", gap: -4 }}>
                {AVATARS.map((a, i) => (
                  <div key={i} style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#5D3A1A,#A67C52)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, border: "2px solid #fff", marginLeft: i > 0 ? -8 : 0 }}>
                    {a}
                  </div>
                ))}
                {attendees > AVATARS.length && (
                  <span style={{ marginLeft: 12, fontSize: 13, color: "#6B7280", fontWeight: 600 }}>+{attendees - AVATARS.length} katılımcı</span>
                )}
              </div>
            </div>
          )}

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
