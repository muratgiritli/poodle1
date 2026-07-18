import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import {
  Send, Plus, Paperclip, Mic, MessageSquare, Menu,
  ChevronDown, Utensils, Scissors, GraduationCap, HeartPulse, PawPrint,
} from "lucide-react";

/* ─── Types ──────────────────────────────────────────────── */
interface Msg    { id: string; role: "user" | "assistant"; content: string; ts: number; }
interface Profile { name: string; age: string; weight: string; }

/* ─── Data ───────────────────────────────────────────────── */
const CATS = [
  { id:"beslenme",  label:"Beslenme",   Icon:Utensils,      color:"#8B5CF6", bg:"#F3E8FF",
    starter:"Toy Poodle beslenme hakkında bilgi almak istiyorum." },
  { id:"bakim",     label:"Tüy Bakımı", Icon:Scissors,      color:"#EC4899", bg:"#FCE7F3",
    starter:"Toy Poodle tüy bakımı hakkında bilgi almak istiyorum." },
  { id:"egitim",    label:"Eğitim",     Icon:GraduationCap, color:"#3B82F6", bg:"#DBEAFE",
    starter:"Toy Poodle eğitimi hakkında bilgi almak istiyorum." },
  { id:"saglik",    label:"Sağlık",     Icon:HeartPulse,    color:"#10B981", bg:"#D1FAE5",
    starter:"Toy Poodle sağlığı hakkında bilgi almak istiyorum." },
  { id:"davranis",  label:"Davranış",   Icon:PawPrint,      color:"#F97316", bg:"#FFEDD5",
    starter:"Toy Poodle davranışı hakkında bilgi almak istiyorum." },
] as const;

const HISTORY_TODAY = [
  { id:"new",  title:"Yeni sohbet" },
  { id:"h1",   title:"Toy Poodle beslenme rehberi" },
  { id:"h2",   title:"Tüy bakımı nasıl yapılır?" },
  { id:"h3",   title:"Tuvalet eğitimi ne zaman?" },
];
const HISTORY_YESTERDAY = [
  { id:"h4",  title:"Poodle tüy döker mi?" },
  { id:"h5",  title:"Yavru Poodle aşı takvimi" },
  { id:"h6",  title:"Poodle diş bakımı" },
];

const SUGGESTIONS = [
  { icon:"🍖", text:"4 aylık Toy Poodle için ne kadar mama vermeliyim?" },
  { icon:"✂️", text:"Tüy bakımı ne sıklıkla yapılmalı?" },
  { icon:"💉", text:"Tuvalet eğitimi için ipuçları nelerdir?" },
  { icon:"🔍", text:"Poodle'larda sık görülen sağlık sorunları nelerdir?" },
  { icon:"🧠", text:"Poodle'm neden havlıyor?" },
  { icon:"🐣", text:"Yavru Poodle için aşı takvimi" },
];

const ARTICLE_LINKS: Record<string, {slug:string; title:string}[]> = {
  beslenme: [{slug:"toy-poodle-en-iyi-mama-markalari-2026",title:"En İyi Mama Markaları 2026"},{slug:"yavru-poodle-beslenmesi-ilk-12-ay",title:"Yavru Poodle Beslenmesi"}],
  bakim:    [{slug:"evde-poodle-tirasi-adim-adim-rehber",title:"Evde Poodle Tıraşı"},{slug:"poodle-tuy-bakimi-haftalik-rutin",title:"Tüy Bakım Rutini"}],
  egitim:   [{slug:"temel-komut-egitimi",title:"Temel Komut Eğitimi"},{slug:"tuvalet-egitimi",title:"Tuvalet Eğitimi"}],
  saglik:   [{slug:"poodle-saglik-sorunlari",title:"Yaygın Sağlık Sorunları"},{slug:"poodle-dis-bakim-rehberi",title:"Diş Bakımı Rehberi"}],
  davranis: [{slug:"poodle-anksiyetesi",title:"Poodle Anksiyetesi"}],
};

const LS_MSG = "yp_ai_messages";
const LS_PRF = "yp_ai_profile";

/* ─── Main ───────────────────────────────────────────────── */
export default function YPAiAsistanPage() {
  const [, navigate] = useLocation();

  /* state */
  const [messages, setMessages] = useState<Msg[]>(() => {
    try { const r = localStorage.getItem(LS_MSG); return r ? JSON.parse(r) : []; } catch { return []; }
  });
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);

  const [profile] = useState<Profile>(() => {
    try {
      const r = localStorage.getItem(LS_PRF);
      const saved = r ? JSON.parse(r) : {};
      return { name: "Luna", age: "4 ay", weight: "2.1 kg", ...saved };
    } catch { return { name: "Luna", age: "4 ay", weight: "2.1 kg" }; }
  });

  const [sidebarOpen,    setSidebarOpen]    = useState(false);
  const [activeHistId,   setActiveHistId]   = useState("new");
  const [activeCat,      setActiveCat]      = useState("beslenme");

  /* refs */
  const bottomRef    = useRef<HTMLDivElement>(null);
  const textareaRef  = useRef<HTMLTextAreaElement>(null);
  const chatBodyRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try { localStorage.setItem(LS_MSG, JSON.stringify(messages.slice(-30))); } catch {}
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, loading]);

  useEffect(() => { document.title = "AI Poodle Asistanı | YourPoodle"; }, []);

  /* JSON-LD */
  useEffect(() => {
    const schema = {
      "@context":"https://schema.org","@type":"WebApplication",
      "name":"AI Poodle Asistanı","applicationCategory":"LifestyleApplication",
      "operatingSystem":"Web","offers":{"@type":"Offer","price":"0","priceCurrency":"TRY"},
      "url":"https://www.yourpoodle.com/yourpoodle/ai-asistan",
    };
    let el = document.getElementById("yp-ai-schema") as HTMLScriptElement | null;
    if (!el) { el = document.createElement("script"); el.id = "yp-ai-schema"; el.type = "application/ld+json"; document.head.appendChild(el); }
    el.textContent = JSON.stringify(schema);
    return () => { document.getElementById("yp-ai-schema")?.remove(); };
  }, []);

  const buildSystemPrompt = () =>
    `Sen YourPoodle'ın AI asistanısın. Yalnızca Toy Poodle sahiplerine yardımcı oluyorsun.
Kullanıcının poodle'ı: ${profile.name}, ${profile.age}, ${profile.weight}.
Kurallar:
- Samimi, sıcak ve anlaşılır dil kullan.
- Sadece toy poodle bakımı, beslenmesi, eğitimi, sağlığı ve davranışı hakkında bilgi ver.
- Kesin tıbbi teşhis koyma, ilaç dozu verme.
- Acil belirti varsa "⚠️ Hemen veterinere gidin" uyarısı ver.
- Kısa ve net cevaplar ver; gerektiğinde madde madde açıkla.
- Türkçe cevap ver.
- Her yanıt genel bilgilendirme amaçlıdır.`;

  const send = useCallback(async (text?: string) => {
    const q = (text ?? input).trim();
    if (!q || loading) return;
    setInput("");
    if (textareaRef.current) { textareaRef.current.style.height = "24px"; }
    const newMsg: Msg = { id: String(Date.now()), role: "user", content: q, ts: Date.now() };
    const updated = [...messages, newMsg];
    setMessages(updated);
    setLoading(true);
    try {
      const res = await fetch("/api/yp-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated.map(({ role, content }) => ({ role, content })),
          systemPrompt: buildSystemPrompt(),
        }),
      });
      const data = await res.json();
      let reply: string = data.reply ?? "Üzgünüm, şu anda yanıt veremiyorum. Lütfen tekrar deneyin.";
      const arts = ARTICLE_LINKS[activeCat];
      if (arts?.length >= 2) {
        reply += `\n\nİlgili rehberler:\n` + arts.slice(0, 2).map(a => `📖 ${a.title} → /yourpoodle/rehber/${a.slug}`).join("\n");
      }
      setMessages(prev => [...prev, { id: String(Date.now()), role: "assistant", content: reply, ts: Date.now() }]);
    } catch {
      setMessages(prev => [...prev, { id: String(Date.now()), role: "assistant", content: "Bağlantı hatası oluştu. Lütfen tekrar deneyin.", ts: Date.now() }]);
    }
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, loading, messages, profile, activeCat]);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const resetChat = () => {
    setMessages([]);
    setActiveHistId("new");
    try { localStorage.removeItem(LS_MSG); } catch {}
  };

  const isEmpty = messages.length === 0;

  const fmtTime = (ts: number) =>
    new Date(ts).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100dvh", background:"#fff",
                  fontFamily:"Inter, system-ui, -apple-system, sans-serif", overflow:"hidden" }}>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* scrollbars */
        .ai-chat-scroll::-webkit-scrollbar { width: 4px; }
        .ai-chat-scroll::-webkit-scrollbar-thumb { background: #DDD5FF; border-radius: 4px; }
        .ai-side-scroll::-webkit-scrollbar { display: none; }
        .ai-side-scroll { -ms-overflow-style: none; scrollbar-width: none; }

        /* typing dots */
        .ai-dot { width: 7px; height: 7px; border-radius: 50%; background: #C4B5FD; animation: ai-bounce 1.2s infinite; }
        .ai-dot:nth-child(2) { animation-delay: .2s; }
        .ai-dot:nth-child(3) { animation-delay: .4s; }
        @keyframes ai-bounce { 0%,60%,100%{transform:translateY(0);} 30%{transform:translateY(-6px);} }

        /* suggestion card hover */
        .ai-sugg { transition: box-shadow .15s, transform .15s; }
        .ai-sugg:hover { box-shadow: 0 6px 20px rgba(124,58,237,0.14) !important; transform: translateY(-2px); }

        /* sidebar item hover */
        .ai-hist-btn { transition: background .12s; }
        .ai-hist-btn:hover { background: rgba(124,58,237,0.09) !important; }
        .ai-cat-btn { transition: background .12s; }
        .ai-cat-btn:hover { background: rgba(124,58,237,0.09) !important; }

        /* message bubbles */
        .msg-user { background:#7C3AED; color:#fff; border-radius:20px 20px 4px 20px;
                    padding:12px 16px; font-size:14px; line-height:1.6; word-break:break-word; }
        .msg-bot  { background:#fff; color:#111827; border-radius:20px 20px 20px 4px;
                    padding:12px 16px; font-size:14px; line-height:1.65; border:1px solid #E5E7EB;
                    word-break:break-word; white-space:pre-wrap;
                    box-shadow:0 2px 8px rgba(0,0,0,0.06); }

        /* pill hover */
        .ai-pill:hover { background:#F3E8FF !important; border-color:#C4B5FD !important; }

        /* mobile sidebar */
        @media (max-width: 767px) {
          .ai-sidebar {
            position: fixed !important; left: 0 !important; top: 0 !important;
            bottom: 0 !important; z-index: 300 !important;
            transform: translateX(-100%); transition: transform .25s ease;
          }
          .ai-sidebar.open { transform: translateX(0) !important; }
          .ai-sidebar-overlay { display: block !important; }
          .ai-header-center { display: none !important; }
        }
        .ai-sidebar-overlay { display: none; position: fixed; inset: 0;
                              background: rgba(0,0,0,0.4); z-index: 299; }

        /* suggestion grid */
        .ai-sugg-grid { grid-template-columns: repeat(3,1fr); }
        @media (max-width: 900px)  { .ai-sugg-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 480px)  { .ai-sugg-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* ══ HEADER ══════════════════════════════════════════ */}
      <header style={{ height:64, background:"#fff", borderBottom:"1px solid #F3F4F6",
                       display:"flex", alignItems:"center", padding:"0 16px", gap:12,
                       flexShrink:0, boxShadow:"0 1px 4px rgba(0,0,0,0.06)", zIndex:200 }}>

        {/* Hamburger */}
        <button onClick={() => setSidebarOpen(s => !s)} aria-label="Menü"
          style={{ width:36, height:36, borderRadius:10, border:"none", background:"none",
                   display:"flex", alignItems:"center", justifyContent:"center",
                   cursor:"pointer", flexShrink:0, color:"#374151" }}>
          <Menu size={20} />
        </button>

        {/* Logo */}
        <a href="/yourpoodle" style={{ display:"flex", alignItems:"center", gap:8,
                                       textDecoration:"none", flexShrink:0 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"#F3E8FF",
                        display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>
            🐩
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:800, color:"#7C3AED", lineHeight:1.1 }}>YourPoodle</div>
            <div style={{ fontSize:10, color:"#9CA3AF" }}>AI Poodle Assistant</div>
          </div>
        </a>

        {/* Center title */}
        <div className="ai-header-center"
          style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
          <span style={{ fontSize:16, fontWeight:700, color:"#111827" }}>AI Poodle Asistanı</span>
          <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"#6B7280" }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:"#22C55E",
                           display:"inline-block", flexShrink:0 }} />
            Çevrimiçi
          </span>
        </div>

        {/* Profile chip */}
        <div style={{ display:"flex", alignItems:"center", gap:8, background:"#F9FAFB",
                      border:"1.5px solid #E5E7EB", borderRadius:24,
                      padding:"5px 12px 5px 5px", cursor:"pointer",
                      flexShrink:0, marginLeft:"auto" }}>
          <div style={{ width:30, height:30, borderRadius:"50%", background:"#F3E8FF",
                        display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>
            🐩
          </div>
          <div>
            <div style={{ fontSize:12.5, fontWeight:700, color:"#111827", lineHeight:1.1 }}>
              {profile.name}
            </div>
            <div style={{ fontSize:10.5, color:"#9CA3AF" }}>Toy Poodle · {profile.age}</div>
          </div>
          <ChevronDown size={14} color="#9CA3AF" />
        </div>
      </header>

      {/* ══ BODY ════════════════════════════════════════════ */}
      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>

        {/* Sidebar overlay (mobile) */}
        {sidebarOpen && (
          <div className="ai-sidebar-overlay" onClick={() => setSidebarOpen(false)} />
        )}

        {/* ── LEFT SIDEBAR ──────────────────────────────── */}
        <aside className={`ai-sidebar${sidebarOpen ? " open" : ""}`}
          style={{ width:240, background:"#F5F3FF", borderRight:"1px solid #EDE9FE",
                   display:"flex", flexDirection:"column", flexShrink:0, overflow:"hidden" }}>

          {/* New chat */}
          <div style={{ padding:"16px 12px 8px" }}>
            <button onClick={() => { resetChat(); setSidebarOpen(false); }}
              style={{ width:"100%", height:40, borderRadius:10, border:"none", background:"#7C3AED",
                       color:"#fff", fontSize:13.5, fontWeight:700, cursor:"pointer",
                       display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}>
              <Plus size={16} strokeWidth={2.5} />
              Yeni Sohbet
            </button>
          </div>

          {/* Scrollable area */}
          <div className="ai-side-scroll"
            style={{ flex:1, overflowY:"auto", padding:"0 10px 8px" }}>

            {/* Chat history */}
            <div style={{ marginBottom:8 }}>
              <div style={{ fontSize:10.5, fontWeight:700, color:"#9CA3AF", letterSpacing:"0.06em",
                            padding:"10px 8px 6px", textTransform:"uppercase" }}>
                Sohbet Geçmişi
              </div>

              <div style={{ fontSize:10.5, fontWeight:600, color:"#A78BFA",
                            padding:"4px 8px 3px" }}>Bugün</div>
              {HISTORY_TODAY.map(h => {
                const active = activeHistId === h.id;
                return (
                  <button key={h.id} className="ai-hist-btn"
                    onClick={() => { setActiveHistId(h.id); setSidebarOpen(false); if (h.id === "new") resetChat(); }}
                    style={{ width:"100%", display:"flex", alignItems:"center", gap:8,
                             padding:"8px 10px", background: active ? "rgba(124,58,237,0.12)" : "transparent",
                             border:"none", cursor:"pointer", textAlign:"left", borderRadius:8 }}>
                    <MessageSquare size={13} color={active ? "#7C3AED" : "#9CA3AF"} />
                    <span style={{ fontSize:12.5, color: active ? "#7C3AED" : "#374151",
                                   fontWeight: active ? 700 : 400,
                                   overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {h.title}
                    </span>
                  </button>
                );
              })}

              <div style={{ fontSize:10.5, fontWeight:600, color:"#A78BFA",
                            padding:"8px 8px 3px" }}>Dün</div>
              {HISTORY_YESTERDAY.map(h => {
                const active = activeHistId === h.id;
                return (
                  <button key={h.id} className="ai-hist-btn"
                    onClick={() => setActiveHistId(h.id)}
                    style={{ width:"100%", display:"flex", alignItems:"center", gap:8,
                             padding:"8px 10px", background: active ? "rgba(124,58,237,0.12)" : "transparent",
                             border:"none", cursor:"pointer", textAlign:"left", borderRadius:8 }}>
                    <MessageSquare size={13} color={active ? "#7C3AED" : "#9CA3AF"} />
                    <span style={{ fontSize:12.5, color: active ? "#7C3AED" : "#374151",
                                   fontWeight: active ? 700 : 400,
                                   overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {h.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick categories */}
            <div>
              <div style={{ fontSize:10.5, fontWeight:700, color:"#9CA3AF", letterSpacing:"0.06em",
                            padding:"4px 8px 6px", textTransform:"uppercase" }}>
                Hızlı Kategoriler
              </div>
              {CATS.map(c => {
                const active = activeCat === c.id;
                return (
                  <button key={c.id} className="ai-cat-btn"
                    onClick={() => { setActiveCat(c.id); setSidebarOpen(false); }}
                    style={{ width:"100%", display:"flex", alignItems:"center", gap:10,
                             padding:"9px 10px", background: active ? "rgba(124,58,237,0.1)" : "transparent",
                             border:"none", cursor:"pointer", textAlign:"left", borderRadius:8 }}>
                    <div style={{ width:28, height:28, borderRadius:8, background:c.bg,
                                  display:"flex", alignItems:"center", justifyContent:"center",
                                  flexShrink:0 }}>
                      <c.Icon size={14} color={c.color} />
                    </div>
                    <span style={{ fontSize:13, fontWeight: active ? 700 : 500,
                                   color: active ? "#7C3AED" : "#374151" }}>
                      {c.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom profile mini card */}
          <div style={{ padding:"10px 12px 14px", borderTop:"1px solid #EDE9FE" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px",
                          background:"#fff", borderRadius:12, border:"1px solid #EDE9FE" }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background:"#F3E8FF",
                            display:"flex", alignItems:"center", justifyContent:"center",
                            fontSize:20, flexShrink:0 }}>
                🐩
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:"#111827" }}>{profile.name}</div>
                <div style={{ fontSize:11, color:"#9CA3AF" }}>Toy Poodle · {profile.age}</div>
              </div>
            </div>
          </div>
        </aside>

        {/* ── MAIN CHAT ────────────────────────────────────── */}
        <main style={{ flex:1, display:"flex", flexDirection:"column",
                       background:"#FAFAFA", overflow:"hidden" }}>

          {/* Messages / Welcome */}
          <div ref={chatBodyRef} className="ai-chat-scroll"
            style={{ flex:1, overflowY:"auto",
                     padding: isEmpty ? "0" : "20px 20px 8px" }}>

            {isEmpty ? (
              /* ── Welcome state ── */
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center",
                            justifyContent:"center", minHeight:"100%",
                            padding:"40px 20px 24px" }}>
                {/* Poodle illustration */}
                <div style={{ marginBottom:24, position:"relative" }}>
                  <div style={{ width:110, height:110, borderRadius:"50%",
                                background:"linear-gradient(135deg,#F3E8FF,#EDE9FE)",
                                display:"flex", alignItems:"center", justifyContent:"center",
                                fontSize:60, boxShadow:"0 8px 32px rgba(124,58,237,0.15)" }}>
                    🐩
                  </div>
                  <div style={{ position:"absolute", top:-6, right:-6, fontSize:20 }}>✨</div>
                  <div style={{ position:"absolute", bottom:4, left:-10, fontSize:16 }}>⭐</div>
                </div>

                <h1 style={{ fontSize:22, fontWeight:800, color:"#111827",
                             textAlign:"center", lineHeight:1.45, marginBottom:10 }}>
                  Merhaba! 👋<br />
                  Ben YourPoodle, Poodle dostunuz için buradayım.
                </h1>
                <p style={{ fontSize:14, color:"#6B7280", textAlign:"center",
                            maxWidth:420, lineHeight:1.65, marginBottom:32 }}>
                  Beslenme, tüy bakımı, eğitim, sağlık ve davranış konularında
                  sorularınızı yanıtlayabilirim.
                </p>

                {/* Suggestion cards — 3×2 */}
                <div className="ai-sugg-grid"
                  style={{ display:"grid", gap:12, width:"100%", maxWidth:700 }}>
                  {SUGGESTIONS.map((s, i) => (
                    <button key={i} onClick={() => send(s.text)} className="ai-sugg"
                      style={{ display:"flex", alignItems:"flex-start", gap:11,
                               padding:"14px 14px", background:"#fff", borderRadius:14,
                               border:"1.5px solid #E9D5FF", cursor:"pointer", textAlign:"left",
                               boxShadow:"0 2px 8px rgba(0,0,0,0.05)", fontFamily:"inherit" }}>
                      <span style={{ fontSize:22, flexShrink:0, lineHeight:1 }}>{s.icon}</span>
                      <span style={{ fontSize:12.5, fontWeight:600, color:"#374151",
                                     lineHeight:1.5 }}>{s.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* ── Active chat ── */
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                {messages.map((m, idx) => (
                  <div key={m.id}
                    style={{ display:"flex", gap:10, alignItems:"flex-end",
                             flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
                    {/* Avatar */}
                    <div style={{ width:32, height:32, borderRadius:"50%",
                                  background: m.role === "user" ? "#7C3AED" : "#F3E8FF",
                                  display:"flex", alignItems:"center", justifyContent:"center",
                                  flexShrink:0, fontSize:16 }}>
                      {m.role === "user" ? "👤" : "🐩"}
                    </div>

                    {/* Bubble + meta */}
                    <div style={{ display:"flex", flexDirection:"column", gap:4,
                                  alignItems: m.role === "user" ? "flex-end" : "flex-start",
                                  maxWidth:"76%" }}>
                      <div className={m.role === "user" ? "msg-user" : "msg-bot"}>
                        {m.content}
                      </div>
                      <span style={{ fontSize:10.5, color:"#D1D5DB" }}>{fmtTime(m.ts)}</span>

                      {/* Category pills — last AI message only */}
                      {m.role === "assistant" && idx === messages.length - 1 && (
                        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:4 }}>
                          {CATS.map(c => (
                            <button key={c.id} className="ai-pill"
                              onClick={() => { setActiveCat(c.id); send(c.starter); }}
                              style={{ display:"flex", alignItems:"center", gap:4,
                                       padding:"4px 11px", borderRadius:20,
                                       border:"1.5px solid #E5E7EB", background:"#fff",
                                       color:"#374151", fontSize:11.5, fontWeight:600,
                                       cursor:"pointer", transition:"all .15s" }}>
                              <c.Icon size={11} color={c.color} />
                              {c.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {loading && (
                  <div style={{ display:"flex", gap:10, alignItems:"flex-end" }}>
                    <div style={{ width:32, height:32, borderRadius:"50%", background:"#F3E8FF",
                                  display:"flex", alignItems:"center", justifyContent:"center",
                                  fontSize:16 }}>🐩</div>
                    <div style={{ background:"#fff", borderRadius:"20px 20px 20px 4px",
                                  padding:"14px 18px", border:"1px solid #E5E7EB",
                                  boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                      <div style={{ display:"flex", gap:4 }}>
                        <div className="ai-dot" /><div className="ai-dot" /><div className="ai-dot" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={bottomRef} style={{ height:4 }} />
              </div>
            )}
          </div>

          {/* ── INPUT BAR ────────────────────────────────── */}
          <div style={{ padding:"12px 16px 10px", background:"#fff",
                        borderTop:"1px solid #F3F4F6", flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"flex-end", gap:10,
                          background:"#F9FAFB", border:"1.5px solid #E5E7EB",
                          borderRadius:18, padding:"8px 8px 8px 14px",
                          boxShadow:"0 2px 8px rgba(0,0,0,0.05)",
                          maxWidth:860, margin:"0 auto" }}>
              {/* Paperclip */}
              <button aria-label="Dosya ekle"
                style={{ width:32, height:32, borderRadius:10, border:"none", background:"none",
                         display:"flex", alignItems:"center", justifyContent:"center",
                         cursor:"pointer", flexShrink:0, color:"#9CA3AF" }}>
                <Paperclip size={18} />
              </button>

              {/* Textarea */}
              <textarea ref={textareaRef}
                value={input}
                onChange={e => {
                  setInput(e.target.value);
                  e.target.style.height = "24px";
                  e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
                }}
                onKeyDown={handleKey}
                placeholder="Sorunuzu yazın..."
                rows={1}
                aria-label="Poodle sorunuzu yazın"
                style={{ flex:1, border:"none", outline:"none", fontSize:14,
                         fontFamily:"inherit", resize:"none", background:"transparent",
                         color:"#111827", lineHeight:1.55, minHeight:24, maxHeight:100,
                         padding:"3px 0" }}
              />

              {/* Mic */}
              <button aria-label="Sesli giriş"
                style={{ width:32, height:32, borderRadius:10, border:"none", background:"none",
                         display:"flex", alignItems:"center", justifyContent:"center",
                         cursor:"pointer", flexShrink:0, color:"#9CA3AF" }}>
                <Mic size={18} />
              </button>

              {/* Send */}
              <button onClick={() => send()} disabled={!input.trim() || loading}
                aria-label="Gönder"
                style={{ width:40, height:40, borderRadius:12, border:"none",
                         background: input.trim() && !loading ? "#7C3AED" : "#E5E7EB",
                         display:"flex", alignItems:"center", justifyContent:"center",
                         cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                         flexShrink:0, transition:"background .15s" }}>
                <Send size={17} color={input.trim() && !loading ? "#fff" : "#9CA3AF"} />
              </button>
            </div>

            {/* Disclaimer */}
            <p style={{ fontSize:11, color:"#9CA3AF", textAlign:"center",
                        margin:"7px 0 0", lineHeight:1.4 }}>
              🔒 AI yanıtları yalnızca bilgilendirme amaçlıdır. Tıbbi durumlar için veteriner hekiminize danışın.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
