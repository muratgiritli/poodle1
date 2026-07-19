import { useState } from "react";
import { useLocation } from "wouter";
import { MapPin, Calendar, Check, X } from "lucide-react";
import { useCustomer } from "@/contexts/CustomerContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import YPLayout from "@/components/yourpoodle/YPLayout";

const FALLBACK_EVENTS = [
  { id:1, day:"26", month:"TEM", year:"2026", title:"Poodle Buluşması — Kadıköy", location:"İstanbul", desc:"İstanbul poodle severler Kadıköy Moda sahilinde buluşuyor. Poodlenizi getirin!", color:"#FF7FA7", type:"Buluşma", free:true },
  { id:2, day:"09", month:"AĞU", year:"2026", title:"Online: Tıraş Teknikleri Webinarı", location:"Zoom", desc:"Uzman groomer Selin Demir ile ev ortamında tıraş teknikleri webinarı.", color:"#A77BFF", type:"Online", free:true },
  { id:3, day:"23", month:"AĞU", year:"2026", title:"Poodle Agility Yarışması", location:"Ankara", desc:"Poodle'ınızın çevikliğini sınayın! Tüm yaş grupları için ayrı kategoriler mevcut.", color:"#78BEFF", type:"Yarışma", free:false },
  { id:4, day:"06", month:"EYL", year:"2026", title:"Poodle Fotoğraf Günü", location:"İzmir", desc:"Profesyonel fotoğrafçı eşliğinde poodlenizle anılarınızı ölümsüzleştirin.", color:"#34D399", type:"Etkinlik", free:false },
  { id:5, day:"20", month:"EYL", year:"2026", title:"Beslenme ve Sağlık Semineri", location:"Online (Zoom)", desc:"Veteriner Dr. Ayşe Kaya'nın poodle beslenmesi ve sağlığı üzerine interaktif semineri.", color:"#FBBF24", type:"Online", free:true },
  { id:6, day:"10", month:"EKİ", year:"2026", title:"Sonbahar Poodle Parkı Buluşması", location:"İstanbul", desc:"Sonbaharı poodlelerinizle karşılıyoruz. Parkta sosyalleşme ve mini yarışmalar.", color:"#F472B6", type:"Buluşma", free:true },
];

export default function Etkinlikler() {
  const [, navigate] = useLocation();
  const { isLoggedIn } = useCustomer();
  const [filter, setFilter] = useState("Tümü");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const qc = useQueryClient();

  const { data: apiEvents } = useQuery<any[]>({
    queryKey: ["/api/yp-events"],
    staleTime: 2 * 60 * 1000,
  });
  const events = (apiEvents && apiEvents.length > 0) ? apiEvents : FALLBACK_EVENTS;

  const { data: myRegistrations = [] } = useQuery<number[]>({
    queryKey: ["/api/yp/event-registrations"],
    queryFn: async () => {
      const r = await fetch("/api/yp/event-registrations", { credentials: "include" });
      if (!r.ok) return [];
      return r.json();
    },
    enabled: isLoggedIn,
    staleTime: 0,
  });

  const registerMutation = useMutation({
    mutationFn: async ({ eventId, join }: { eventId: number; join: boolean }) => {
      const method = join ? "POST" : "DELETE";
      const r = await fetch(`/api/yp/event-registrations/${eventId}`, { method, credentials: "include" });
      if (!r.ok) throw new Error("İşlem başarısız");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/yp/event-registrations"] }),
  });
  const types = ["Tümü", ...Array.from(new Set(events.map((e:any) => e.type)))];
  const filtered = filter === "Tümü" ? events : events.filter((e:any) => e.type === filter);

  return (
    <YPLayout activeLink="/yourpoodle/etkinlikler">
      <title>Poodle Etkinlikleri | Buluşmalar, Yarışmalar, Webinarlar | YourPoodle</title>
      <meta name="description" content="Türkiye genelinde poodle etkinlikleri: buluşmalar, agility yarışmaları, grooming webinarları ve veteriner seminerleri. Poodle topluluğuyla tanışın." />
      <meta property="og:title" content="Poodle Etkinlikleri | YourPoodle" />
      <meta property="og:description" content="Poodle buluşmaları, yarışmaları ve online webinarlar. Topluluğa katılın." />
      <meta property="og:type" content="website" />
      <meta name="robots" content="index, follow" />
      <style>{`
        .ev-card:active { transform: scale(0.98); } .ev-card { transition: transform 0.12s; }
        @media (min-width: 900px) {
          .etk-hero { border-radius: 20px; margin: 24px 0 !important; }
          .etk-grid { display: grid !important; grid-template-columns: 1fr 1fr; gap: 14px; }
        }
      `}</style>

      <div style={{ minHeight:"100vh", background:"#fff", fontFamily:"Inter,sans-serif", paddingBottom:32 }}>

        {/* Hero banner */}
        <div className="etk-hero" style={{ background:"linear-gradient(135deg,#7C3AFF,#9B59FF)", padding:"24px 20px 28px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-30, right:-30, width:120, height:120, borderRadius:"50%", background:"rgba(255,255,255,0.07)" }} />
          <div style={{ fontSize:11, fontWeight:800, color:"rgba(255,255,255,0.65)", letterSpacing:"0.1em", marginBottom:4 }}>YourPoodle</div>
          <div style={{ fontSize:22, fontWeight:900, color:"#fff", marginBottom:6 }}>📅 Etkinlikler</div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,0.85)" }}>Poodle severlerin buluşma noktası</div>
          <div style={{ display:"flex", gap:16, marginTop:16 }}>
            {[["6","Etkinlik"],["3","Şehir"],["2","Online"]].map(([n,l]) => (
              <div key={l} style={{ textAlign:"center" }}>
                <div style={{ fontSize:18, fontWeight:900, color:"#fff" }}>{n}</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.7)" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div style={{ padding:"14px 16px 0", display:"flex", gap:8, overflowX:"auto" }}>
          {types.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              style={{ flexShrink:0, padding:"7px 16px", borderRadius:20, border:"1.5px solid", borderColor:filter===t?"#7C3AFF":"#e8e8e8", background:filter===t?"#7C3AFF":"#fff", color:filter===t?"#fff":"#555", fontSize:12.5, fontWeight:700, cursor:"pointer", fontFamily:"Inter,sans-serif" }}>
              {t}
            </button>
          ))}
        </div>

        {/* Events list */}
        <div className="etk-grid" style={{ padding:"16px 16px 0", display:"flex", flexDirection:"column", gap:14 }}>
          {filtered.map((ev:any) => (
            <div key={ev.id||ev.title} className="ev-card" onClick={() => setSelectedEvent(ev)} style={{ background:"#fff", borderRadius:18, boxShadow:"0 2px 16px rgba(0,0,0,0.07)", overflow:"hidden", cursor:"pointer" }}>
              <div style={{ display:"flex", alignItems:"stretch" }}>
                <div style={{ width:72, flexShrink:0, background:ev.color+"22", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"16px 8px" }}>
                  <div style={{ fontSize:22, fontWeight:900, color:ev.color, lineHeight:1 }}>{ev.day}</div>
                  <div style={{ fontSize:10, fontWeight:800, color:ev.color }}>{ev.month}</div>
                  <div style={{ fontSize:9, color:ev.color, opacity:0.7, marginTop:2 }}>{ev.year||""}</div>
                </div>
                <div style={{ flex:1, padding:"14px 14px 14px 12px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:5 }}>
                    <span style={{ fontSize:10, fontWeight:800, background:ev.color+"22", color:ev.color, borderRadius:6, padding:"2px 8px" }}>{ev.type}</span>
                    {ev.free && <span style={{ fontSize:10, fontWeight:800, background:"#DCFCE7", color:"#16A34A", borderRadius:6, padding:"2px 8px" }}>ÜCRETSİZ</span>}
                  </div>
                  <div style={{ fontSize:14, fontWeight:800, color:"#1a1a1a", lineHeight:1.35, marginBottom:6, fontFamily:"Inter,sans-serif" }}>{ev.title}</div>
                  {ev.desc && <div style={{ fontSize:12, color:"#666", lineHeight:1.55, marginBottom:6, fontFamily:"Inter,sans-serif" }}>{ev.desc}</div>}
                  <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <MapPin size={11} color="#888" /><span style={{ fontSize:11, color:"#888", fontFamily:"Inter,sans-serif" }}>{ev.location||ev.loc}</span>
                  </div>
                </div>
              </div>
              {!isLoggedIn && (
                <div style={{ borderTop:"1px solid #f5f5f5", padding:"10px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:12, color:"#888", fontFamily:"Inter,sans-serif" }}>Katılmak için üye ol</span>
                  <button onClick={() => navigate("/yourpoodle/giris")}
                    style={{ padding:"6px 14px", borderRadius:10, border:"none", background:"#7C3AFF", color:"#fff", fontSize:12, fontWeight:800, cursor:"pointer", fontFamily:"Inter,sans-serif" }}>Üye Ol</button>
                </div>
              )}
              {isLoggedIn && (() => {
                const joined = myRegistrations.includes(ev.id);
                return (
                  <div style={{ borderTop:"1px solid #f5f5f5", padding:"10px 14px", display:"flex", gap:8 }}>
                    <button
                      onClick={() => registerMutation.mutate({ eventId: ev.id, join: !joined })}
                      disabled={registerMutation.isPending}
                      style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:10, border:`1.5px solid ${joined ? "#16A34A" : "#7C3AFF"}`, background: joined ? "#DCFCE7" : "#7C3AFF", color: joined ? "#16A34A" : "#fff", fontSize:13, fontWeight:800, cursor:"pointer", fontFamily:"Inter,sans-serif" }}>
                      {joined ? <><Check size={14} /> Katılıyorum</> : <><Calendar size={14} /> Katılacağım</>}
                    </button>
                    {joined && (
                      <span style={{ fontSize:11, color:"#16A34A", alignSelf:"center" }}>✓ Kayıtlısın</span>
                    )}
                  </div>
                );
              })()}
            </div>
          ))}
        </div>

        {/* Event detail bottom sheet */}
        {selectedEvent && (
          <div style={{ position:"fixed", inset:0, zIndex:500, display:"flex", flexDirection:"column", justifyContent:"flex-end" }}
            onClick={() => setSelectedEvent(null)}>
            <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.45)" }} />
            <div onClick={e => e.stopPropagation()}
              style={{ position:"relative", background:"#fff", borderRadius:"24px 24px 0 0", padding:"24px 20px 40px", maxHeight:"85vh", overflowY:"auto" }}>
              <div style={{ width:40, height:4, borderRadius:2, background:"#E5E7EB", margin:"-12px auto 20px", display:"block" }} />
              {/* Date + color strip */}
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
                <div style={{ width:60, height:60, borderRadius:14, background:selectedEvent.color+"22", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <div style={{ fontSize:22, fontWeight:900, color:selectedEvent.color, lineHeight:1 }}>{selectedEvent.day}</div>
                  <div style={{ fontSize:10, fontWeight:800, color:selectedEvent.color }}>{selectedEvent.month}</div>
                  <div style={{ fontSize:9, color:selectedEvent.color, opacity:0.7 }}>{selectedEvent.year||""}</div>
                </div>
                <div>
                  <div style={{ display:"flex", gap:6, marginBottom:5, flexWrap:"wrap" }}>
                    <span style={{ fontSize:10, fontWeight:800, background:selectedEvent.color+"22", color:selectedEvent.color, borderRadius:6, padding:"2px 8px" }}>{selectedEvent.type}</span>
                    {selectedEvent.free && <span style={{ fontSize:10, fontWeight:800, background:"#DCFCE7", color:"#16A34A", borderRadius:6, padding:"2px 8px" }}>ÜCRETSİZ</span>}
                  </div>
                  <div style={{ fontSize:18, fontWeight:900, color:"#1a1a1a", lineHeight:1.3, fontFamily:"Inter,sans-serif" }}>{selectedEvent.title}</div>
                </div>
              </div>
              {/* Description */}
              {selectedEvent.desc && (
                <p style={{ fontSize:14, color:"#555", lineHeight:1.7, marginBottom:16, fontFamily:"Inter,sans-serif" }}>{selectedEvent.desc}</p>
              )}
              {/* Details */}
              <div style={{ background:"#F9FAFB", borderRadius:12, padding:"12px 14px", marginBottom:16, display:"flex", flexDirection:"column", gap:8 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <MapPin size={14} color="#7C3AFF" />
                  <span style={{ fontSize:13, color:"#374151", fontFamily:"Inter,sans-serif" }}>{selectedEvent.location||selectedEvent.loc}</span>
                </div>
                {selectedEvent.venue && (
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <Calendar size={14} color="#7C3AFF" />
                    <span style={{ fontSize:13, color:"#374151", fontFamily:"Inter,sans-serif" }}>{selectedEvent.venue}</span>
                  </div>
                )}
                {selectedEvent.time && (
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:13, marginLeft:1 }}>🕐</span>
                    <span style={{ fontSize:13, color:"#374151", fontFamily:"Inter,sans-serif" }}>{selectedEvent.time}</span>
                  </div>
                )}
                {selectedEvent.participants && (
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:13, marginLeft:1 }}>👥</span>
                    <span style={{ fontSize:13, color:"#374151", fontFamily:"Inter,sans-serif" }}>{selectedEvent.participants} katılımcı</span>
                  </div>
                )}
              </div>
              {/* CTA */}
              {isLoggedIn ? (() => {
                const joined = myRegistrations.includes(selectedEvent.id);
                return (
                  <button
                    onClick={() => registerMutation.mutate({ eventId: selectedEvent.id, join: !joined })}
                    disabled={registerMutation.isPending}
                    style={{ width:"100%", height:50, borderRadius:14, border:`1.5px solid ${joined ? "#16A34A" : "#7C3AFF"}`, background: joined ? "#DCFCE7" : "#7C3AFF", color: joined ? "#16A34A" : "#fff", fontSize:15, fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, fontFamily:"Inter,sans-serif" }}>
                    {joined ? <><Check size={16} /> Katılıyorum — İptal Et</> : <><Calendar size={16} /> Katılacağım</>}
                  </button>
                );
              })() : (
                <button onClick={() => { setSelectedEvent(null); navigate("/yourpoodle/giris"); }}
                  style={{ width:"100%", height:50, borderRadius:14, border:"none", background:"#7C3AFF", color:"#fff", fontSize:15, fontWeight:800, cursor:"pointer", fontFamily:"Inter,sans-serif" }}>
                  Katılmak için Üye Ol
                </button>
              )}
            </div>
          </div>
        )}

        {/* Submit event CTA */}
        <div style={{ margin:"24px 16px", background:"#F5F0FF", borderRadius:18, padding:"20px", textAlign:"center" }}>
          <div style={{ fontSize:24, marginBottom:8 }}>🎉</div>
          <div style={{ fontSize:15, fontWeight:800, color:"#1a1a1a", marginBottom:6 }}>Etkinlik Düzenlemek İster misiniz?</div>
          <p style={{ fontSize:12, color:"#888", lineHeight:1.6, marginBottom:16 }}>Poodle topluluğu için etkinlik organize edin, duyurunuzu yayınlayalım.</p>
          <button onClick={() => navigate(isLoggedIn ? "/hesabim" : "/yourpoodle/giris")}
            style={{ height:44, borderRadius:12, border:"none", background:"#7C3AFF", color:"#fff", fontSize:13, fontWeight:800, padding:"0 24px", cursor:"pointer", fontFamily:"Inter,sans-serif" }}>
            Bize Ulaşın
          </button>
        </div>
      </div>
    </YPLayout>
  );
}
