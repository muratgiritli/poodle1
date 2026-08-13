import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { ChevronLeft, Scissors, Calendar } from "lucide-react";
import { IS_YP } from "@/lib/store";
import { goBack } from "@/lib/goBack";

const P = "#5D3A1A";
const BASE = IS_YP ? "" : "/yourpoodle";

const TIRAS_ARALIGI: Record<string, number> = {
  "puppy-cut": 42, "teddy-bear": 35, "lamb-cut": 56, "continental": 28, "summer": 49,
};
const TIRAS_LABELS: Record<string, string> = {
  "puppy-cut": "Puppy Cut", "teddy-bear": "Teddy Bear", "lamb-cut": "Lamb Cut",
  "continental": "Continental", "summer": "Yaz Kesimi",
};

function addDaysRaw(dateStr: string, days: number): Date {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d;
}

function toIcsDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

function buildIcs(events: { date: Date; label: string }[], tirasLabel: string): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//YourPoodle//Tiras Takvimi//TR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];
  events.forEach((ev, i) => {
    const dt = toIcsDate(ev.date);
    lines.push(
      "BEGIN:VEVENT",
      `UID:tiras-${dt}-${i}@yourpoodle.com`,
      `DTSTAMP:${toIcsDate(new Date())}T120000Z`,
      `DTSTART;VALUE=DATE:${dt}`,
      `DTEND;VALUE=DATE:${dt}`,
      `SUMMARY:Poodle Tıraş — ${tirasLabel}`,
      `DESCRIPTION:${ev.label}`,
      "END:VEVENT",
    );
  });
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

function downloadIcs(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function googleCalendarUrl(date: Date, title: string, details: string): string {
  const dt = toIcsDate(date);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${dt}/${dt}`,
    details,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export default function YPTirasTakvimiPage() {
  useEffect(() => { document.title = "Tıraş Takvimi | YourPoodle"; }, []);
  const [, navigate] = useLocation();
  const [tirasType, setTirasType] = useState("teddy-bear");
  const [sonTiras, setSonTiras] = useState("");
  const [result, setResult] = useState<string[]>([]);
  const [resultDates, setResultDates] = useState<Date[]>([]);
  const [showCalMenu, setShowCalMenu] = useState(false);

  function hesapla(e: React.FormEvent) {
    e.preventDefault();
    if (!sonTiras) return;
    const aralik = TIRAS_ARALIGI[tirasType];
    const rawDates = [1, 2, 3, 4].map(n => addDaysRaw(sonTiras, n * aralik));
    setResultDates(rawDates);
    setResult(rawDates.map(d => d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })));
    setShowCalMenu(false);
  }

  const tirasLabel = TIRAS_LABELS[tirasType];

  function handleDownloadIcs() {
    if (resultDates.length === 0) return;
    const events = resultDates.map((date, i) => ({
      date,
      label: `${i + 1}. bakım — ${tirasLabel} (${TIRAS_ARALIGI[tirasType]} gün aralık)`,
    }));
    downloadIcs(buildIcs(events, tirasLabel), "poodle-tiras-takvimi.ics");
    setShowCalMenu(false);
  }

  function handleGoogleCalendar() {
    if (resultDates.length === 0) return;
    const first = resultDates[0];
    const url = googleCalendarUrl(
      first,
      `Poodle Tıraş — ${tirasLabel}`,
      `YourPoodle tıraş hatırlatıcısı. Sonraki bakım: ${result[0]}. Tip: ${tirasLabel}.`,
    );
    window.open(url, "_blank", "noopener,noreferrer");
    setShowCalMenu(false);
  }

  return (
    <YPLayout constrain={false}>
      <div style={{ minHeight: "100vh", background: "#F5F0E6", paddingBottom: 48 }}>
        <div style={{ maxWidth: "var(--yp-shell-max)", margin: "0 auto", padding: "24px 20px 0" }}>
          <button onClick={() => goBack(navigate, `${BASE}/araclar`)}
            style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: "#6B7280", fontSize: 13, fontWeight: 600, padding: 0, fontFamily: "inherit", marginBottom: 20 }}>
            <ChevronLeft size={16} /> Araçlar
          </button>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✂️</div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: "#111827", margin: "0 0 6px" }}>Tıraş Takvimi</h1>
            <p style={{ color: "#6B7280", fontSize: 14, margin: 0 }}>Bir sonraki bakım tarihlerini planlayın</p>
          </div>
          <div style={{ background: "#fff", borderRadius: 18, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
            <form onSubmit={hesapla}>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Tıraş Tipi</label>
                <select value={tirasType} onChange={e => setTirasType(e.target.value)}
                  style={{ width: "100%", height: 48, borderRadius: 12, border: "1.5px solid #E5E7EB", padding: "0 14px", fontSize: 15, fontFamily: "inherit", background: "#fff", outline: "none" }}>
                  {Object.entries(TIRAS_LABELS).map(([v, l]) => <option key={v} value={v}>{l} ({TIRAS_ARALIGI[v]} gün)</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Son Tıraş Tarihi</label>
                <input type="date" value={sonTiras} onChange={e => setSonTiras(e.target.value)}
                  style={{ width: "100%", height: 48, borderRadius: 12, border: "1.5px solid #E5E7EB", padding: "0 16px", fontSize: 15, fontFamily: "inherit", boxSizing: "border-box", outline: "none" }} />
              </div>
              <button type="submit"
                style={{ width: "100%", height: 50, borderRadius: 14, border: "none", background: P, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Scissors size={16} /> Takvim Oluştur
              </button>
            </form>
            {result.length > 0 && (
              <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid #F3F4F6" }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#374151", margin: "0 0 14px" }}>Sonraki bakım tarihleri ({tirasLabel})</p>
                {result.map((date, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: i === 0 ? "#F5F0E6" : "#F9F9FB", borderRadius: 10, marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Calendar size={14} color={i === 0 ? P : "#9CA3AF"} />
                      <span style={{ fontSize: 14, color: i === 0 ? P : "#374151", fontWeight: i === 0 ? 700 : 400 }}>{date}</span>
                    </div>
                    {i === 0 && <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", background: P, padding: "2px 8px", borderRadius: 9999 }}>Yaklaşan</span>}
                  </div>
                ))}
                <div style={{ position: "relative", marginTop: 12 }}>
                  <button type="button" onClick={() => setShowCalMenu(v => !v)}
                    style={{ width: "100%", height: 44, borderRadius: 12, border: "1.5px solid " + P, background: "#F5F0E6", color: P, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <Calendar size={15} /> Takvime Ekle
                  </button>
                  {showCalMenu && (
                    <div style={{ position: "absolute", left: 0, right: 0, top: "calc(100% + 6px)", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", overflow: "hidden", zIndex: 10 }}>
                      <button type="button" onClick={handleDownloadIcs}
                        style={{ width: "100%", padding: "12px 16px", border: "none", background: "#fff", textAlign: "left", fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer", fontFamily: "inherit", borderBottom: "1px solid #F3F4F6" }}>
                        📥 .ics dosyası indir (Apple / Outlook)
                      </button>
                      <button type="button" onClick={handleGoogleCalendar}
                        style={{ width: "100%", padding: "12px 16px", border: "none", background: "#fff", textAlign: "left", fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer", fontFamily: "inherit" }}>
                        📅 Google Takvim'e ekle
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </YPLayout>
  );
}
