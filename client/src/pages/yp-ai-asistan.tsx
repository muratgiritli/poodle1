import { useState, useRef, useEffect, useCallback } from "react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import {
  MessageCircle, ShieldCheck, ShieldAlert,
  UtensilsCrossed, HeartPulse, Bath, Brush, GraduationCap, Syringe,
  ThumbsUp, ThumbsDown, Copy, Plus, Send,
} from "lucide-react";

/* ─────────────────────── DESIGN TOKENS ───────────────────────── */
const P   = "#6324D6";
const PD  = "#4C1DAA";
const PL  = "#F3EEFF";

/* ─────────────────────── TYPES ───────────────────────────────── */
interface Msg {
  id: string;
  role: "user" | "ai";
  text: string;
  showCalculator?: boolean;
  ts: Date;
}

/* ─────────────────────── MOCK DATA ───────────────────────────── */
const WEIGHT_OPTIONS = [
  { value: "1",   label: "1 kg"   },
  { value: "1.5", label: "1.5 kg" },
  { value: "2",   label: "2 kg"   },
  { value: "2.5", label: "2.5 kg" },
  { value: "3",   label: "3 kg"   },
  { value: "3.5", label: "3.5 kg" },
  { value: "4",   label: "4 kg"   },
];

const FOOD_OPTIONS = [
  { value: "puppy-chicken",  label: "Puppy Tavuklu",    kcalPer100g: 350 },
  { value: "adult-salmon",   label: "Adult Somonlu",    kcalPer100g: 330 },
  { value: "mini-chicken",   label: "Mini Tavuklu",     kcalPer100g: 340 },
  { value: "light-turkey",   label: "Light Hindi",      kcalPer100g: 300 },
  { value: "grain-lamb",     label: "Grain Free Kuzulu",kcalPer100g: 360 },
  { value: "senior-chicken", label: "Senior Tavuklu",   kcalPer100g: 310 },
];

function calcFood(weightKg: number, kcalPer100g: number) {
  const daily = weightKg * 90;
  const grams = Math.round((daily / kcalPer100g) * 100);
  const perMeal = Math.round(grams / 3);
  return { grams, perMeal };
}

const INITIAL_AI_TEXT =
  "3 aylık bir Toy Poodle yavrusu için günlük mama miktarı; kilosuna, mamanın kalori değerine ve aktivitesine göre değişir. Kilosunu ve kullandığınız mamanın adını yazarsanız birlikte hesaplayabiliriz.";

const QUICK_ACTIONS = [
  { id:"food",     label:"Mama önerisi",      Icon:UtensilsCrossed, color:"purple",  bg:"#F3EEFF", border:"#DDD6FE", icon:P,         prompt:"Toy Poodle'uma hangi mamayı önerirsiniz?" },
  { id:"health",   label:"Sağlık sorusu",     Icon:HeartPulse,      color:"pink",    bg:"#FDF2F8", border:"#FBCFE8", icon:"#EC4899", prompt:"Toy Poodle'umun sağlığı hakkında bir sorum var." },
  { id:"potty",    label:"Tuvalet eğitimi",   Icon:Bath,            color:"blue",    bg:"#EFF6FF", border:"#BFDBFE", icon:"#3B82F6", prompt:"Toy Poodle yavruma tuvalet eğitimi nasıl verilir?" },
  { id:"grooming", label:"Tüy ve göz bakımı", Icon:Brush,           color:"teal",    bg:"#F0FDFA", border:"#99F6E4", icon:"#14B8A6", prompt:"Toy Poodle tüy ve göz bakımı nasıl yapılır?" },
  { id:"behavior", label:"Davranış ve eğitim",Icon:GraduationCap,   color:"orange",  bg:"#FFF7ED", border:"#FED7AA", icon:"#F97316", prompt:"Toy Poodle davranış ve eğitim konusunda yardım istiyorum." },
  { id:"vaccine",  label:"Aşı ve parazit",    Icon:Syringe,         color:"lavender",bg:"#F5F3FF", border:"#DDD6FE", icon:"#7C3AED", prompt:"Toy Poodle aşı ve parazit takvimi hakkında bilgi alabilir miyim?" },
];

/* ─────────────────────── SUBCOMPONENTS ───────────────────────── */

function FoodCalc() {
  const [weight, setWeight] = useState("");
  const [food,   setFood]   = useState("");
  const [result, setResult] = useState<{ grams:number; perMeal:number } | null>(null);
  const [err,    setErr]    = useState(false);

  const run = () => {
    if (!weight || !food) { setErr(true); return; }
    setErr(false);
    const opt = FOOD_OPTIONS.find(f => f.value === food)!;
    setResult(calcFood(parseFloat(weight), opt.kcalPer100g));
  };

  return (
    <div style={{ marginTop:12, padding:12, borderRadius:12, border:"1px solid #DDD6FE",
                  background:PL }}>
      <p style={{ fontSize:13, fontWeight:600, color:"#111827", marginBottom:10 }}>
        Hızlı hesaplama için bilgileri seçin
      </p>
      <div style={{ display:"flex", gap:8, marginBottom:10 }}>
        <select value={weight} onChange={e=>{ setWeight(e.target.value); setErr(false); }}
          style={{ flex:1, background:"#fff", border:`1px solid ${err&&!weight?"#EF4444":"#E5E7EB"}`,
                   borderRadius:8, padding:"8px 10px", fontSize:13, color:"#374151",
                   outline:"none", cursor:"pointer" }}>
          <option value="">Kilo seçin</option>
          {WEIGHT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select value={food} onChange={e=>{ setFood(e.target.value); setErr(false); }}
          style={{ flex:1, background:"#fff", border:`1px solid ${err&&!food?"#EF4444":"#E5E7EB"}`,
                   borderRadius:8, padding:"8px 10px", fontSize:13, color:"#374151",
                   outline:"none", cursor:"pointer" }}>
          <option value="">Mama seçin</option>
          {FOOD_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <button onClick={run}
        style={{ width:"100%", background:P, color:"#fff", border:"none",
                 borderRadius:10, padding:"10px 0", fontSize:13, fontWeight:600,
                 cursor:"pointer", transition:"background 0.15s" }}
        onMouseEnter={e=>(e.currentTarget.style.background=PD)}
        onMouseLeave={e=>(e.currentTarget.style.background=P)}>
        Hesapla
      </button>
      {result && (
        <p style={{ marginTop:8, fontSize:13, fontWeight:600, color:P }}>
          Önerilen günlük mama: {result.grams} g (3 öğün × {result.perMeal} g)
        </p>
      )}
    </div>
  );
}

function FeedbackRow({ text }: { text: string }) {
  const [fb, setFb]   = useState<"up"|"down"|null>(null);
  const [cop, setCop] = useState(false);

  const copy = async () => {
    try { await navigator.clipboard.writeText(text); } catch {}
    setCop(true);
    setTimeout(() => setCop(false), 1500);
  };

  const btnStyle = (active?: boolean, hoverColor?: string): React.CSSProperties => ({
    background: "none", border: "none", cursor: "pointer", padding: 4,
    display: "flex", alignItems: "center", justifyContent: "center",
    color: active ? hoverColor : "#9CA3AF", transition: "color 0.15s",
  });

  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:6 }}>
      <button aria-label="Beğen" style={btnStyle(fb==="up", P)}
        onClick={() => setFb(fb==="up" ? null : "up")}>
        <ThumbsUp size={15} color={fb==="up" ? P : "#9CA3AF"} />
      </button>
      <button aria-label="Beğenme" style={btnStyle(fb==="down", "#EF4444")}
        onClick={() => setFb(fb==="down" ? null : "down")}>
        <ThumbsDown size={15} color={fb==="down" ? "#EF4444" : "#9CA3AF"} />
      </button>
      <button aria-label="Kopyala" style={btnStyle(cop, P)} onClick={copy}>
        <Copy size={15} color={cop ? P : "#9CA3AF"} />
      </button>
      {cop && (
        <span style={{ fontSize:11, color:P, fontWeight:500 }}>Kopyalandı</span>
      )}
    </div>
  );
}

/* ─────────────────────── MAIN PAGE ───────────────────────────── */
export default function YPAiAsistanPage() {
  const initMsgs: Msg[] = [
    { id:"m0", role:"user", text:"3 aylık Toy Poodle yavrum ne kadar mama yemeli?", ts:new Date() },
    { id:"m1", role:"ai",   text:INITIAL_AI_TEXT, showCalculator:true,              ts:new Date() },
  ];
  const [msgs,    setMsgs]    = useState<Msg[]>(initMsgs);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);
  const isFirst   = useRef(true);

  /* page title */
  useEffect(() => {
    document.title = "AI Poodle Asistanı: Anlık Poodle Uzman Desteği | YourPoodle";
  }, []);

  /* auto-scroll on new messages */
  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }
    bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [msgs, loading]);

  const sendMessage = useCallback(async (text: string) => {
    const t = text.trim();
    if (!t || loading) return;
    const userMsg: Msg = { id:String(Date.now()), role:"user", text:t, ts:new Date() };
    setMsgs(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const allMsgs = [...msgs, userMsg];
      const chatHistory = allMsgs.slice(-10).map(m => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.text,
      }));
      const res = await fetch("/api/yp-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Bir hata oluştu");
      const aiMsg: Msg = { id:String(Date.now()+1), role:"ai", text:data.reply, ts:new Date() };
      setMsgs(prev => [...prev, aiMsg]);
    } catch (err: any) {
      const errMsg: Msg = { id:String(Date.now()+1), role:"ai", text:err.message || "Bir hata oluştu. Lütfen tekrar deneyin.", ts:new Date() };
      setMsgs(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  }, [loading, msgs]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  return (
    <YPLayout activeLink="/yourpoodle/ai-asistan" constrain={false} hideHeader hideFooter>
      <style>{`
        .yp-ai-scroll::-webkit-scrollbar { width: 3px; }
        .yp-ai-scroll::-webkit-scrollbar-thumb { background: #DDD6FE; border-radius: 3px; }
        .yp-qa-btn { transition: box-shadow 0.15s, transform 0.1s; }
        .yp-qa-btn:hover { box-shadow: 0 4px 12px rgba(99,36,214,0.12); }
        .yp-qa-btn:active { transform: scale(0.98); }
        @keyframes yp-bounce { 0%,60%,100%{transform:translateY(0);} 30%{transform:translateY(-5px);} }
        .yp-dot { width:8px; height:8px; border-radius:50%; background:#D1D5DB; animation:yp-bounce 1.2s infinite; }
        .yp-dot:nth-child(2){ animation-delay:.2s; }
        .yp-dot:nth-child(3){ animation-delay:.4s; }
      `}</style>

      {/* ══ SCROLLABLE CONTENT ══════════════════════════════════ */}
      {/*
        Fixed composer (~80px) sits above fixed bottom nav (60px).
        Total reserved = ~140px. Add extra bottom padding so the last
        chat bubble is not hidden behind the fixed bars.
      */}
      <div className="yp-ai-scroll yp-ai-center"
        style={{ paddingBottom: 160 }}>


        {/* ── QUICK ACTIONS ───────────────────────────────────── */}
        <div style={{ padding:"20px 16px 0" }}>
          <p style={{ fontSize:15, fontWeight:700, color:"#111827", marginBottom:12 }}>
            Size nasıl yardımcı olabilirim?
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {QUICK_ACTIONS.map(qa => (
              <button key={qa.id}
                className="yp-qa-btn"
                onClick={() => sendMessage(qa.prompt)}
                style={{ display:"flex", alignItems:"center", gap:10,
                         padding:"12px 12px", borderRadius:12,
                         border:`1px solid ${qa.border}`,
                         background:qa.bg, cursor:"pointer",
                         fontFamily:"inherit", textAlign:"left" }}>
                <qa.Icon size={20} color={qa.icon} style={{ flexShrink:0 }} />
                <span style={{ fontSize:13, fontWeight:500, color:"#1F2937",
                               lineHeight:1.3 }}>
                  {qa.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── CHAT AREA ───────────────────────────────────────── */}
        <div style={{ marginTop:20 }}>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}>
            <span style={{ background:"#F3F4F6", color:"#6B7280", fontSize:12,
                           padding:"4px 16px", borderRadius:999 }}>
              Bugün
            </span>
          </div>

          {msgs.map(m => {
            if (m.role === "user") {
              return (
                <div key={m.id}
                  style={{ display:"flex", justifyContent:"flex-end",
                           marginBottom:12, padding:"0 16px" }}>
                  <div style={{ background:P, color:"#fff", fontSize:14,
                                lineHeight:1.55, padding:"12px 16px",
                                borderRadius:"18px 18px 4px 18px",
                                maxWidth:"85%", wordBreak:"break-word" }}>
                    {m.text}
                  </div>
                </div>
              );
            }
            return (
              <div key={m.id}
                style={{ display:"flex", gap:8, marginBottom:12, padding:"0 16px" }}>
                <div style={{ width:36, height:36, borderRadius:"50%",
                               flexShrink:0, position:"relative", alignSelf:"flex-start" }}>
                  <img src="/images/yp-poodle-hero.png" alt="AI"
                    style={{ width:36, height:36, borderRadius:"50%",
                              objectFit:"cover", objectPosition:"center top",
                              display:"block" }} />
                  <div style={{ position:"absolute", bottom:-2, right:-2,
                                width:16, height:16, borderRadius:"50%",
                                background:P, color:"#fff",
                                fontSize:7, fontWeight:700,
                                display:"flex", alignItems:"center", justifyContent:"center" }}>
                    AI
                  </div>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ background:"#fff", border:"1px solid #E5E7EB",
                                 color:"#1F2937", fontSize:14, lineHeight:1.6,
                                 padding:"12px 16px",
                                 borderRadius:"18px 18px 18px 4px",
                                 wordBreak:"break-word" }}>
                    {m.text}
                    {m.showCalculator && <FoodCalc />}
                  </div>
                  <FeedbackRow text={m.text} />
                </div>
              </div>
            );
          })}

          {loading && (
            <div style={{ display:"flex", gap:8, marginBottom:12, padding:"0 16px" }}>
              <div style={{ width:36, height:36, borderRadius:"50%",
                             background:"#F3EEFF", flexShrink:0, display:"flex",
                             alignItems:"center", justifyContent:"center", fontSize:18 }}>
                🐩
              </div>
              <div style={{ background:"#fff", border:"1px solid #E5E7EB",
                             borderRadius:"18px 18px 18px 4px",
                             padding:"14px 18px", display:"flex", gap:6,
                             alignItems:"center" }}>
                <div className="yp-dot" />
                <div className="yp-dot" />
                <div className="yp-dot" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* ── DISCLAIMER BANNER ───────────────────────────────── */}
        <div style={{ margin:"12px 16px 8px",
                      display:"flex", alignItems:"flex-start", gap:12,
                      background:"#FFF7ED", border:"1px solid #FED7AA",
                      borderRadius:12, padding:"12px 16px" }}>
          <ShieldAlert size={20} color="#EA580C"
            style={{ flexShrink:0, marginTop:1 }} />
          <p style={{ fontSize:12, color:"#92400E", lineHeight:1.55 }}>
            AI Asistan veteriner muayenesinin yerini tutmaz. Acil durumlarda veterinerinize başvurun.
          </p>
        </div>

      </div>{/* end scrollable */}

      {/* ══ FIXED COMPOSER BAR ══════════════════════════════════
          Sits above the bottom nav (60px) + safe-area.
          zIndex 210 clears both YPBottomNav (z-200) and sticky headers.
      */}
      <div
        className="yp-ai-sticky-bar"
        style={{
          position: "fixed",
          bottom: "calc(60px + env(safe-area-inset-bottom, 0px))",
          left: 0,
          right: 0,
          background: "#fff",
          borderTop: "1px solid #F3F4F6",
          padding: "12px 16px 16px",
          zIndex: 210,
        }}
      >
        <div className="yp-ai-center">
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            {/* Inline calculator trigger */}
            <button
              aria-label="Mama hesapla"
              onClick={() => {
                const calcMsg: Msg = {
                  id: String(Date.now()),
                  role: "ai",
                  text: "Mama hesaplayıcıyı kullanabilirsiniz:",
                  showCalculator: true,
                  ts: new Date(),
                };
                setMsgs(prev => [...prev, calcMsg]);
              }}
              style={{ width:44, height:44, borderRadius:"50%", border:"none",
                       background:"none", display:"flex", alignItems:"center",
                       justifyContent:"center", cursor:"pointer", flexShrink:0,
                       color:"#6B7280", transition:"background 0.15s" }}
              onMouseEnter={e=>(e.currentTarget.style.background="#F3F4F6")}
              onMouseLeave={e=>(e.currentTarget.style.background="none")}>
              <Plus size={20} />
            </button>

            {/* Text input */}
            <div style={{ flex:1, display:"flex", alignItems:"center",
                          background:"#F9FAFB", border:"1px solid #E5E7EB",
                          borderRadius:999, padding:"0 14px 0 16px" }}>
              <input
                ref={inputRef}
                aria-label="Poodle'ınızla ilgili sorunuzu yazın"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Poodle'ınızla ilgili bir şey sorun..."
                style={{ flex:1, background:"transparent", border:"none", outline:"none",
                         fontSize:14, color:"#111827", padding:"11px 0",
                         fontFamily:"inherit", minWidth:0 }}
              />
            </div>

            {/* Send */}
            <button
              aria-label="Gönder"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              style={{ width:44, height:44, borderRadius:"50%",
                       background: (!input.trim() || loading) ? "#D1D5DB" : P,
                       border:"none", display:"flex", alignItems:"center",
                       justifyContent:"center",
                       cursor: (!input.trim() || loading) ? "default" : "pointer",
                       flexShrink:0, transition:"background 0.15s",
                       opacity: (!input.trim() || loading) ? 0.55 : 1 }}
              onMouseEnter={e=>{ if(input.trim()&&!loading) e.currentTarget.style.background=PD; }}
              onMouseLeave={e=>{ if(input.trim()&&!loading) e.currentTarget.style.background=P; }}>
              <Send size={18} color="#fff" />
            </button>
          </div>

          <p style={{ marginTop:8, textAlign:"center", fontSize:11, color:"#9CA3AF" }}>
            AI yanıtları hata içerebilir. Önemli bilgileri doğrulayın.
          </p>
        </div>
      </div>
    </YPLayout>
  );
}
