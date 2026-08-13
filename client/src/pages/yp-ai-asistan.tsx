import { useState, useRef, useEffect, useCallback } from "react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { IS_YP } from "@/lib/store";
import {
  Plus, Send, Copy, ThumbsUp, ThumbsDown,
  UtensilsCrossed, HeartPulse, Brush, GraduationCap,
} from "lucide-react";

const BASE = IS_YP ? "" : "/yourpoodle";
const P = "#5D3A1A";

interface Msg {
  id: string;
  role: "user" | "ai";
  text: string;
  showCalculator?: boolean;
  ts: Date;
}

const WEIGHT_OPTIONS = [
  { value: "1", label: "1 kg" }, { value: "1.5", label: "1.5 kg" },
  { value: "2", label: "2 kg" }, { value: "2.5", label: "2.5 kg" },
  { value: "3", label: "3 kg" }, { value: "3.5", label: "3.5 kg" },
  { value: "4", label: "4 kg" },
];

const FOOD_OPTIONS = [
  { value: "puppy-chicken",  label: "Puppy Tavuklu",     kcalPer100g: 350 },
  { value: "adult-salmon",   label: "Adult Somonlu",     kcalPer100g: 330 },
  { value: "mini-chicken",   label: "Mini Tavuklu",      kcalPer100g: 340 },
  { value: "light-turkey",   label: "Light Hindi",       kcalPer100g: 300 },
  { value: "grain-lamb",     label: "Grain Free Kuzulu", kcalPer100g: 360 },
  { value: "senior-chicken", label: "Senior Tavuklu",    kcalPer100g: 310 },
];

function calcFood(weightKg: number, kcalPer100g: number) {
  const daily = weightKg * 90;
  const grams = Math.round((daily / kcalPer100g) * 100);
  return { grams, perMeal: Math.round(grams / 3) };
}

const SUGGESTIONS = [
  { label: "Mama önerisi",       Icon: UtensilsCrossed, prompt: "Toy Poodle'uma hangi mamayı önerirsiniz?" },
  { label: "Sağlık sorusu",      Icon: HeartPulse,      prompt: "Toy Poodle'umun sağlığı hakkında bir sorum var." },
  { label: "Tüy bakımı",         Icon: Brush,           prompt: "Toy Poodle tüy ve göz bakımı nasıl yapılır?" },
  { label: "Eğitim ipucu",       Icon: GraduationCap,   prompt: "Toy Poodle davranış ve eğitim konusunda yardım istiyorum." },
];

function FoodCalc() {
  const [weight, setWeight] = useState("");
  const [food, setFood] = useState("");
  const [result, setResult] = useState<{ grams: number; perMeal: number } | null>(null);
  const [err, setErr] = useState(false);

  const run = () => {
    if (!weight || !food) { setErr(true); return; }
    setErr(false);
    const opt = FOOD_OPTIONS.find(f => f.value === food)!;
    setResult(calcFood(parseFloat(weight), opt.kcalPer100g));
  };

  return (
    <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #EDE8E0" }}>
      <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 10 }}>
        Mama hesapla
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
        <select value={weight} onChange={e => { setWeight(e.target.value); setErr(false); }}
          style={{ flex: 1, minWidth: 120, background: "#fff", border: `1px solid ${err && !weight ? "#EF4444" : "#E5E7EB"}`,
                   borderRadius: 10, padding: "9px 10px", fontSize: 13, color: "#374151", outline: "none" }}>
          <option value="">Kilo</option>
          {WEIGHT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select value={food} onChange={e => { setFood(e.target.value); setErr(false); }}
          style={{ flex: 1, minWidth: 140, background: "#fff", border: `1px solid ${err && !food ? "#EF4444" : "#E5E7EB"}`,
                   borderRadius: 10, padding: "9px 10px", fontSize: 13, color: "#374151", outline: "none" }}>
          <option value="">Mama</option>
          {FOOD_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <button type="button" onClick={run}
        style={{ background: P, color: "#fff", border: "none", borderRadius: 10,
                 padding: "9px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
        Hesapla
      </button>
      {result && (
        <p style={{ marginTop: 10, fontSize: 13, fontWeight: 600, color: P }}>
          Günlük: {result.grams} g · 3 öğün × {result.perMeal} g
        </p>
      )}
    </div>
  );
}

function FeedbackRow({ text }: { text: string }) {
  const [fb, setFb] = useState<"up" | "down" | null>(null);
  const [cop, setCop] = useState(false);

  const copy = async () => {
    try { await navigator.clipboard.writeText(text); } catch {}
    setCop(true);
    setTimeout(() => setCop(false), 1500);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8, opacity: 0.7 }}>
      <button type="button" aria-label="Beğen" onClick={() => setFb(fb === "up" ? null : "up")}
        style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}>
        <ThumbsUp size={14} color={fb === "up" ? P : "#9CA3AF"} />
      </button>
      <button type="button" aria-label="Beğenme" onClick={() => setFb(fb === "down" ? null : "down")}
        style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}>
        <ThumbsDown size={14} color={fb === "down" ? "#EF4444" : "#9CA3AF"} />
      </button>
      <button type="button" aria-label="Kopyala" onClick={copy}
        style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}>
        <Copy size={14} color={cop ? P : "#9CA3AF"} />
      </button>
      {cop && <span style={{ fontSize: 11, color: P }}>Kopyalandı</span>}
    </div>
  );
}

export default function YPAiAsistanPage() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isEmpty = msgs.length === 0 && !loading;

  useEffect(() => {
    document.title = "AI Asistan | YourPoodle";
    import("@/lib/yp-analytics").then(({ track }) => track("ai_open")).catch(() => {});
  }, []);

  useEffect(() => {
    if (isEmpty) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading, isEmpty]);

  const sendMessage = useCallback(async (text: string) => {
    const t = text.trim();
    if (!t || loading) return;
    const userMsg: Msg = { id: String(Date.now()), role: "user", text: t, ts: new Date() };
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
      setMsgs(prev => [...prev, { id: String(Date.now() + 1), role: "ai", text: data.reply, ts: new Date() }]);
    } catch (err: any) {
      setMsgs(prev => [...prev, {
        id: String(Date.now() + 1),
        role: "ai",
        text: err.message || "Bir hata oluştu. Lütfen tekrar deneyin.",
        ts: new Date(),
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }, [loading, msgs]);

  const newChat = () => {
    setMsgs([]);
    setInput("");
    setLoading(false);
    inputRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <YPLayout
      activeLink={`${BASE}/ai-asistan`}
      constrain={false}
      hideFooter
    >
      <style>{`
        .yp-ai-page {
          display: flex;
          flex-direction: column;
          min-height: calc(100dvh - 128px);
          background: #FAF8F4;
        }
        @media (min-width: 768px) {
          .yp-ai-page { min-height: calc(100dvh - 80px); }
        }
        .yp-ai-messages {
          flex: 1;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        .yp-ai-messages::-webkit-scrollbar { width: 4px; }
        .yp-ai-messages::-webkit-scrollbar-thumb { background: #E5DDD0; border-radius: 4px; }
        .yp-ai-composer textarea {
          field-sizing: content;
          max-height: 160px;
          resize: none;
        }
        .yp-ai-sticky-bar {
          flex-shrink: 0;
          background: #FAF8F4;
          padding: 10px 16px 12px;
          border-top: 1px solid #EDE8E0;
        }
        @media (max-width: 767px) {
          .yp-ai-sticky-bar {
            padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
          }
        }
        @keyframes yp-bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
        .yp-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #C4B5A5; animation: yp-bounce 1.2s infinite;
        }
        .yp-dot:nth-child(2) { animation-delay: .2s; }
        .yp-dot:nth-child(3) { animation-delay: .4s; }
      `}</style>

      <div className="yp-ai-page">
        {/* Page toolbar under site header */}
        <div style={{
          flexShrink: 0, height: 48, display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "0 16px",
          borderBottom: "1px solid #EDE8E0", background: "#FAF8F4",
        }}>
          <span style={{ fontSize: 15, fontWeight: 650, color: "#1F2937" }}>AI Asistan</span>
          <button type="button" aria-label="Yeni sohbet" onClick={newChat}
            style={{ display: "inline-flex", alignItems: "center", gap: 6,
                     height: 36, padding: "0 12px", borderRadius: 10, border: "1px solid #E5DDD0",
                     background: "#fff", cursor: "pointer", color: "#374151",
                     fontSize: 13, fontWeight: 600, fontFamily: "inherit" }}>
            <Plus size={16} /> Yeni sohbet
          </button>
        </div>

        {/* Messages / empty state */}
        <div className="yp-ai-messages">
          <div className="yp-ai-center" style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
            {isEmpty ? (
              <div style={{
                flex: 1, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                padding: "32px 20px 24px", textAlign: "center",
              }}>
                <img
                  src="/images/yp-poodle-hero.png"
                  alt=""
                  style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", marginBottom: 16 }}
                />
                <h1 style={{ fontSize: 22, fontWeight: 650, color: "#111827", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
                  Merhaba
                </h1>
                <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 28px", maxWidth: 320, lineHeight: 1.5 }}>
                  Toy Poodle bakımı, mama, eğitim ve sağlık hakkında sor.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 420 }}>
                  {SUGGESTIONS.map(s => (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => sendMessage(s.prompt)}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        padding: "8px 14px", borderRadius: 999,
                        border: "1px solid #E5DDD0", background: "#fff",
                        fontSize: 13, fontWeight: 500, color: "#374151",
                        cursor: "pointer", fontFamily: "inherit",
                      }}
                    >
                      <s.Icon size={14} color={P} />
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ padding: "20px 16px 12px", flex: 1 }}>
                {msgs.map(m => {
                  if (m.role === "user") {
                    return (
                      <div key={m.id} style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
                        <div style={{
                          background: P, color: "#fff", fontSize: 15, lineHeight: 1.55,
                          padding: "10px 16px", borderRadius: 18, maxWidth: "85%",
                          wordBreak: "break-word",
                        }}>
                          {m.text}
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div key={m.id} style={{ marginBottom: 24, maxWidth: 720 }}>
                      <div style={{ fontSize: 15, lineHeight: 1.65, color: "#1F2937", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                        {m.text}
                      </div>
                      {m.showCalculator && <FoodCalc />}
                      <FeedbackRow text={m.text} />
                    </div>
                  );
                })}

                {loading && (
                  <div style={{ display: "flex", gap: 6, alignItems: "center", padding: "8px 0 24px" }}>
                    <div className="yp-dot" />
                    <div className="yp-dot" />
                    <div className="yp-dot" />
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            )}
          </div>
        </div>

        {/* Composer — sticky above bottom nav */}
        <div className="yp-ai-sticky-bar">
          <div className="yp-ai-center yp-ai-composer">
            <div style={{
              display: "flex", alignItems: "flex-end", gap: 8,
              background: "#fff", border: "1px solid #E5DDD0", borderRadius: 24,
              padding: "8px 8px 8px 14px",
            }}>
              <button
                type="button"
                aria-label="Mama hesapla"
                onClick={() => {
                  setMsgs(prev => [...prev, {
                    id: String(Date.now()),
                    role: "ai",
                    text: "Mama miktarını birlikte hesaplayalım:",
                    showCalculator: true,
                    ts: new Date(),
                  }]);
                }}
                style={{
                  width: 36, height: 36, borderRadius: "50%", border: "none",
                  background: "none", color: "#6B7280", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}
              >
                <Plus size={18} />
              </button>
              <textarea
                ref={inputRef}
                aria-label="Mesaj yaz"
                rows={1}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Bir şey sor..."
                style={{
                  flex: 1, border: "none", outline: "none", background: "transparent",
                  fontSize: 15, color: "#111827", fontFamily: "inherit",
                  padding: "8px 0", lineHeight: 1.45, minHeight: 36, maxHeight: 160,
                }}
              />
              <button
                type="button"
                aria-label="Gönder"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                style={{
                  width: 36, height: 36, borderRadius: "50%", border: "none", flexShrink: 0,
                  background: (!input.trim() || loading) ? "#E5E7EB" : P,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: (!input.trim() || loading) ? "default" : "pointer",
                }}
              >
                <Send size={16} color="#fff" />
              </button>
            </div>
            <p style={{ margin: "8px 0 0", textAlign: "center", fontSize: 11, color: "#9CA3AF" }}>
              AI yanıtları hata içerebilir · Veteriner muayenesinin yerini tutmaz
            </p>
          </div>
        </div>
      </div>
    </YPLayout>
  );
}
