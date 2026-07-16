import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Send, Bot, User, AlertTriangle, ChevronDown } from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const EXAMPLE_QUESTIONS = [
  "4 aylık Poodle'ım ne kadar mama yemeli?",
  "Göz altı neden kızarıyor ve ne yapmalıyım?",
  "Evde yalnız kalınca neden havlıyor?",
  "Hangi tarak kullanılmalı, ne sıklıkla taramalıyım?",
  "Tuvalet eğitimine nasıl başlamalıyım?",
];

const PROFILE_FIELDS = [
  { key: "age", label: "Yaş", placeholder: "ör. 6 ay, 2 yaş" },
  { key: "weight", label: "Kilo", placeholder: "ör. 3.2 kg" },
  { key: "gender", label: "Cinsiyet", placeholder: "Erkek / Dişi" },
  { key: "neutered", label: "Kısırlaştırıldı mı?", placeholder: "Evet / Hayır" },
];

const CSS = `
*, *::before, *::after { box-sizing: border-box; }
body { background: #fff; margin: 0; }
.yp-ai-page { min-height: 100vh; background: #f8f7ff; font-family: 'Inter', sans-serif; display: flex; flex-direction: column; }
.yp-ai-header { position: sticky; top: 0; z-index: 100; background: #7C3AFF; padding: 12px 16px; display: flex; align-items: center; gap: 12px; }
.yp-ai-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; padding-bottom: 140px; }
.yp-msg-user { align-self: flex-end; background: #7C3AFF; color: #fff; border-radius: 18px 18px 4px 18px; padding: 11px 15px; max-width: 80%; font-size: 14px; line-height: 1.5; }
.yp-msg-bot { align-self: flex-start; background: #fff; color: #222; border-radius: 18px 18px 18px 4px; padding: 11px 15px; max-width: 85%; font-size: 14px; line-height: 1.6; box-shadow: 0 2px 12px rgba(0,0,0,0.07); }
.yp-ai-input-bar { position: fixed; bottom: 64px; left: 0; right: 0; background: #fff; border-top: 1px solid #f0f0f0; padding: 10px 12px; display: flex; gap: 8px; align-items: flex-end; z-index: 90; }
.yp-ai-textarea { flex: 1; border: 1.5px solid #DDD5FF; border-radius: 14px; padding: 10px 14px; font-size: 14px; font-family: 'Inter', sans-serif; resize: none; outline: none; min-height: 42px; max-height: 120px; background: #F8F7FF; color: #222; line-height: 1.5; }
.yp-ai-textarea:focus { border-color: #7C3AFF; }
.yp-ai-send { width: 44px; height: 44px; border-radius: 12px; background: #7C3AFF; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #fff; }
.yp-ai-send:disabled { background: #ccc; cursor: not-allowed; }
.yp-typing { display: flex; gap: 4px; padding: 14px 16px; }
.yp-dot { width: 7px; height: 7px; border-radius: 50%; background: #bbb; animation: yp-bounce 1.2s infinite; }
.yp-dot:nth-child(2) { animation-delay: 0.2s; }
.yp-dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes yp-bounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }
`;

export default function YPAiAsistanPage() {
  const [, navigate] = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile] = useState({ age: "", weight: "", gender: "", neutered: "" });
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const buildSystemPrompt = () => {
    const profileParts: string[] = [];
    if (profile.age) profileParts.push(`Yaş: ${profile.age}`);
    if (profile.weight) profileParts.push(`Kilo: ${profile.weight}`);
    if (profile.gender) profileParts.push(`Cinsiyet: ${profile.gender}`);
    if (profile.neutered) profileParts.push(`Kısırlaştırıldı mı: ${profile.neutered}`);
    const profileStr = profileParts.length ? `\n\nPoodle profili: ${profileParts.join(", ")}.` : "";

    return `Sen YourPoodle'ın AI asistanısın. Yalnızca Toy Poodle ve Miniature Poodle sahiplerine yardımcı oluyorsun.${profileStr}

Kurallar:
- Samimi, sıcak ve anlaşılır dil kullan.
- Sadece poodle bakımı, beslenmesi, eğitimi, sağlığı ve davranışı hakkında bilgi ver.
- Kesin tıbbi teşhis koyma. Ciddi sağlık sorunlarında daima veterinere yönlendir.
- Sorulara kısa ve net cevaplar ver, gerektiğinde madde madde açıkla.
- Türkçe cevap ver.`;
  };

  const send = async (text?: string) => {
    const q = (text ?? input).trim();
    if (!q || loading) return;
    setInput("");
    const newMessages: Message[] = [...messages, { role: "user", content: q }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch("/api/yp-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, systemPrompt: buildSystemPrompt() }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", content: "Üzgünüm, şu anda yanıt veremiyorum. Lütfen tekrar deneyin." }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Bağlantı hatası oluştu. Lütfen tekrar deneyin." }]);
    }
    setLoading(false);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <YPLayout activeLink="/yourpoodle/ai-asistan" constrain={false}>
      <title>Poodle AI Asistanı | Anlık Köpek Bakımı Soruları | YourPoodle</title>
      <meta name="description" content="YourPoodle AI asistanıyla Toy Poodle hakkında anlık sorularınızı sorun. Beslenme, sağlık, bakım ve eğitim konularında yapay zeka destekli cevaplar." />
      <meta property="og:title" content="Poodle AI Asistanı | YourPoodle" />
      <meta property="og:description" content="Poodle sorularınıza anında AI destekli cevaplar. Beslenme, sağlık ve bakım hakkında her şeyi sorun." />
      <meta property="og:type" content="website" />
      <meta name="robots" content="index, follow" />
      <style>{`${CSS}
        @media (min-width: 900px) { .yp-ai-input-bar { bottom: 0 !important; } }
      `}</style>
      <div className="yp-ai-page" style={{ minHeight:"unset" }}>

      {/* Sub-header */}
      <header className="yp-ai-header">
        <button
          aria-label="Geri"
          onClick={() => navigate("/yourpoodle")}
          style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 10, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", flexShrink: 0 }}
        >
          <ArrowLeft size={20} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Bot size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>AI Poodle Asistanı</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)" }}>Poodle uzmanı • Her zaman aktif</div>
          </div>
        </div>
        <button
          aria-label="Poodle profilini göster"
          onClick={() => setShowProfile(!showProfile)}
          style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 10, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}
        >
          <ChevronDown size={18} style={{ transform: showProfile ? "rotate(180deg)" : "none", transition: "0.2s" }} />
        </button>
      </header>

      {/* Profile panel */}
      {showProfile && (
        <div style={{ background: "#fff", borderBottom: "1px solid #f0f0f0", padding: "14px 16px" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#7C3AFF", marginBottom: 10, margin: "0 0 10px" }}>
            Poodle'ın bilgilerini girerek daha kişisel cevaplar al (isteğe bağlı)
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {PROFILE_FIELDS.map(f => (
              <div key={f.key}>
                <label htmlFor={`yp-prof-${f.key}`} style={{ fontSize: 11, fontWeight: 600, color: "#666", display: "block", marginBottom: 3 }}>{f.label}</label>
                <input
                  id={`yp-prof-${f.key}`}
                  value={profile[f.key as keyof typeof profile]}
                  onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  style={{ width: "100%", border: "1.5px solid #e0e0e0", borderRadius: 8, padding: "7px 10px", fontSize: 13, outline: "none", fontFamily: "'Inter',sans-serif" }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="yp-ai-messages">
        {messages.length === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "4px 0" }}>
            {/* Intro */}
            <div style={{ background: "#fff", borderRadius: 18, padding: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#F0E8FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Bot size={20} color="#7C3AFF" />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 6 }}>Merhaba! Ben Poodle asistanınım. 🐾</div>
                <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>
                  Poodle'ınızın beslenmesi, bakımı, eğitimi veya sağlığıyla ilgili her türlü sorunuzu yanıtlayabilirim. Yaş, kilo ve ihtiyacını belirtirseniz daha özel öneriler sunabilirim.
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div style={{ background: "#FFFBEB", borderRadius: 12, padding: "11px 14px", display: "flex", gap: 10, alignItems: "flex-start", border: "1px solid #FDE68A" }}>
              <AlertTriangle size={16} color="#D97706" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 12, color: "#92400E", margin: 0, lineHeight: 1.5 }}>
                Bu asistan genel bilgilendirme sağlar. Acil veya ciddi sağlık durumlarında veteriner hekime başvurun.
              </p>
            </div>

            {/* Example questions */}
            <div style={{ padding: "4px 0" }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#888", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Örnek sorular</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {EXAMPLE_QUESTIONS.map(q => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    style={{
                      background: "#fff", border: "1.5px solid #DDD5FF", borderRadius: 12,
                      padding: "11px 14px", textAlign: "left", fontSize: 13, color: "#333",
                      cursor: "pointer", fontFamily: "'Inter',sans-serif", lineHeight: 1.4,
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={e => { (e.target as HTMLElement).style.background = "#F5F0FF"; }}
                    onMouseLeave={e => { (e.target as HTMLElement).style.background = "#fff"; }}
                  >
                    💬 {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-end", flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
            {m.role === "assistant" && (
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#F0E8FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Bot size={14} color="#7C3AFF" />
              </div>
            )}
            <div className={m.role === "user" ? "yp-msg-user" : "yp-msg-bot"} style={{ whiteSpace: "pre-wrap" }}>
              {m.content}
            </div>
            {m.role === "user" && (
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#7C3AFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <User size={14} color="#fff" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#F0E8FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Bot size={14} color="#7C3AFF" />
            </div>
            <div style={{ background: "#fff", borderRadius: "18px 18px 18px 4px", padding: "14px 16px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
              <div className="yp-typing">
                <div className="yp-dot" />
                <div className="yp-dot" />
                <div className="yp-dot" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="yp-ai-input-bar">
        <textarea
          ref={textareaRef}
          className="yp-ai-textarea"
          value={input}
          onChange={e => { setInput(e.target.value); e.target.style.height = "42px"; e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"; }}
          onKeyDown={handleKey}
          placeholder="Poodle'ınızla ilgili sorun..."
          rows={1}
          aria-label="Mesaj yaz"
        />
        <button
          className="yp-ai-send"
          onClick={() => send()}
          disabled={!input.trim() || loading}
          aria-label="Gönder"
        >
          <Send size={18} />
        </button>
      </div>

      </div>
    </YPLayout>
  );
}
