import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { Send, Bot, User, AlertTriangle, RotateCcw, ChevronDown, Search, ChevronRight } from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";

/* ─── SEO ─────────────────────────────────────────────── */
const PAGE_TITLE    = "AI Poodle Asistanı: Anlık Uzman Desteği | YourPoodle";
const PAGE_DESC     = "Toy Poodle hakkında AI asistana sorun. Mama, bakım, eğitim, sağlık ve davranış sorularına kişiselleştirilmiş anlık yanıtlar. Ücretsiz Poodle uzmanı.";

/* ─── Types ───────────────────────────────────────────── */
interface Message { role: "user" | "assistant"; content: string; ts: number; }
interface Profile { name: string; age: string; weight: string; gender: string; neutered: string; }

/* ─── Category-based quick questions ─────────────────── */
const CATS = [
  { id:"beslenme", emoji:"🍖", label:"Beslenme", qs:[
    "4 aylık Poodle'ım ne kadar mama yemeli?",
    "Poodle'a hangi yiyecekler verilmez?",
    "Yetişkin Toy Poodle için en iyi mama hangisi?",
  ]},
  { id:"bakim", emoji:"✂️", label:"Bakım", qs:[
    "Poodle tüyü ne sıklıkla taranmalı?",
    "Evde tıraş mı, groomer mı?",
    "Göz altı lekesi nasıl temizlenir?",
  ]},
  { id:"egitim", emoji:"🎓", label:"Eğitim", qs:[
    "Tuvalet eğitimine nasıl başlanır?",
    "Temel komutlar kaç haftada öğrenilir?",
    "Clicker eğitimi nasıl yapılır?",
  ]},
  { id:"saglik", emoji:"❤️", label:"Sağlık", qs:[
    "Poodle aşı takvimi nasıl olmalı?",
    "İdeal kilosu ne olmalı?",
    "Göz altı neden kızarır?",
  ]},
  { id:"davranis", emoji:"🐾", label:"Davranış", qs:[
    "Yalnız kalınca neden havlar?",
    "Anksiyete belirtileri neler?",
    "Isırma davranışı nasıl düzeltilir?",
  ]},
];

/* ─── Related articles for RAG-like source links ─────── */
const ARTICLE_LINKS: Record<string, { slug: string; title: string }[]> = {
  beslenme: [
    { slug: "toy-poodle-en-iyi-mama-markalari-2026", title: "En İyi Mama Markaları 2026" },
    { slug: "yavru-poodle-beslenmesi-ilk-12-ay", title: "Yavru Poodle Beslenmesi" },
    { slug: "poodle-beslenme-alerjisi", title: "Besin Alerjisi Rehberi" },
  ],
  bakim: [
    { slug: "evde-poodle-tirasi-adim-adim-rehber", title: "Evde Poodle Tıraşı" },
    { slug: "poodle-tuy-bakimi-haftalik-rutin", title: "Haftalık Tüy Bakım Rutini" },
    { slug: "poodle-goz-yasi-lekesi-temizleme", title: "Göz Yaşı Lekesi Temizleme" },
  ],
  egitim: [
    { slug: "temel-komut-egitimi", title: "Temel Komut Eğitimi" },
    { slug: "clicker-egitimi", title: "Clicker Eğitimi" },
    { slug: "tuvalet-egitimi", title: "Tuvalet Eğitimi" },
  ],
  saglik: [
    { slug: "poodle-saglik-sorunlari", title: "10 Yaygın Sağlık Sorunu" },
    { slug: "poodle-kalca-displazisi-erken-teshis", title: "Kalça Displazisi" },
    { slug: "poodle-dis-bakim-rehberi", title: "Diş Bakımı Rehberi" },
  ],
  davranis: [
    { slug: "poodle-anksiyetesi", title: "Poodle Anksiyetesi" },
  ],
};

/* ─── Static SSS ──────────────────────────────────────── */
const SSS = [
  { q:"4 aylık Poodle ne kadar mama yemeli?",
    a:"4 aylık Toy Poodle günde 100–150 gram yavru maması, 3–4 öğün halinde yemelidir. Mama miktarı köpeğin kilosuna ve mamaya göre değişir; ambalajdaki tabloyu referans alın." },
  { q:"Poodle göz altı neden kızarır?",
    a:"Gözyaşı kanalı tıkanıklığı, alerji veya enfeksiyon olabilir. Günlük ıslak mendille temizlik yapın; kızarıklık, şişlik veya akıntı varsa veteriner kontrolü önerilir." },
  { q:"Poodle evde yalnız kalınca neden havlar?",
    a:"Yalnız kalma kaygısı, dikkat isteme veya sıkıntı belirtisi olabilir. Kademeli ayrılma eğitimi ve KONG gibi zihinsel uyarım oyuncakları etkili ilk adımlardır." },
  { q:"Poodle tüyü ne sıklıkla taranmalı?",
    a:"Haftada en az 3 kez slicker fırçayla tarama önerilir. Profesyonel tıraş 6–8 haftada bir yapılmalıdır; mat oluşumunu önlemek için köklere kadar tarayın." },
  { q:"Poodle tuvalet eğitimine nasıl başlanır?",
    a:"Her yemekten 20–30 dakika sonra belirli bir noktaya götürün. Başarılı olduğunda hemen ödüllendirin, asla cezalandırmayın. Genellikle 2–4 haftada temel alışkanlık oluşur." },
];

/* ─── Profile fields ──────────────────────────────────── */
const PROFILE_FIELDS = [
  { key:"name",     label:"İsim",             placeholder:"ör. Max" },
  { key:"age",      label:"Yaş",              placeholder:"ör. 6 ay, 2 yaş" },
  { key:"weight",   label:"Kilo",             placeholder:"ör. 3.2 kg" },
  { key:"gender",   label:"Cinsiyet",         placeholder:"Erkek / Dişi" },
  { key:"neutered", label:"Kısırlaştırıldı?", placeholder:"Evet / Hayır" },
];

/* ─── Constants ───────────────────────────────────────── */
const EMPTY_PROFILE: Profile = { name:"", age:"", weight:"", gender:"", neutered:"" };
const LS_MSG   = "yp_ai_messages";
const LS_PRF   = "yp_ai_profile";
const LS_LIMIT = "yp_ai_daily";
const MAX_STORED  = 20;
const DAILY_LIMIT = 5;

/* ─── Daily limit helpers ─────────────────────────────── */
function getToday() { return new Date().toISOString().slice(0,10); }
function getLimitData(): { date: string; count: number } {
  try {
    const raw = localStorage.getItem(LS_LIMIT);
    if (raw) {
      const d = JSON.parse(raw);
      if (d.date === getToday()) return d;
    }
  } catch {}
  return { date: getToday(), count: 0 };
}
function incrementLimit() {
  const d = getLimitData();
  d.count += 1;
  try { localStorage.setItem(LS_LIMIT, JSON.stringify(d)); } catch {}
  return d.count;
}

/* ─── Analytics helper ────────────────────────────────── */
function track(event: string, props?: Record<string, unknown>) {
  console.log("[YP Analytics]", event, props ?? {});
}

/* ─── Main ────────────────────────────────────────────── */
export default function YPAiAsistanPage() {
  const [, navigate] = useLocation();

  /* Chat state */
  const [messages, setMessages] = useState<Message[]>(() => {
    try { const r = localStorage.getItem(LS_MSG); return r ? JSON.parse(r) : []; } catch { return []; }
  });
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);

  /* Daily limit */
  const [limitData, setLimitData] = useState(getLimitData);
  const remainingQuestions = Math.max(0, DAILY_LIMIT - limitData.count);
  const limitReached = remainingQuestions === 0;

  /* Profile */
  const [profile, setProfile] = useState<Profile>(() => {
    try { const r = localStorage.getItem(LS_PRF); return r ? { ...EMPTY_PROFILE, ...JSON.parse(r) } : EMPTY_PROFILE; } catch { return EMPTY_PROFILE; }
  });
  const hasProfile = Object.values(profile).some(v => v);
  const [showProfile, setShowProfile] = useState(false);
  const [showExamples, setShowExamples] = useState(true);

  /* Category & SSS */
  const [activeCat, setActiveCat] = useState(CATS[0].id);
  const [expandedSss, setExpandedSss] = useState<number|null>(null);

  const bottomRef   = useRef<HTMLDivElement>(null);
  const msgsRef     = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatRef     = useRef<HTMLDivElement>(null);

  /* Persist */
  useEffect(() => {
    try { localStorage.setItem(LS_MSG, JSON.stringify(messages.slice(-MAX_STORED))); } catch {}
  }, [messages]);
  useEffect(() => {
    try { localStorage.setItem(LS_PRF, JSON.stringify(profile)); } catch {}
  }, [profile]);

  /* Auto-scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:"smooth", block:"nearest" });
  }, [messages, loading]);

  /* SEO */
  useEffect(() => {
    document.title = PAGE_TITLE;
    const m = (attr: string, key: string, val: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement|null;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
      el.content = val;
    };
    m("property","og:title", PAGE_TITLE);
    m("property","og:description", PAGE_DESC);
    m("property","og:type","website");
    m("property","og:url","https://www.yourpoodle.com/yourpoodle/ai-asistan");
    m("property","og:image","https://www.yourpoodle.com/images/ai-asistan-og.webp");
    m("name","description", PAGE_DESC);
  }, []);

  /* System prompt */
  const buildSystemPrompt = () => {
    const parts: string[] = [];
    if (profile.name)     parts.push(`İsim: ${profile.name}`);
    if (profile.age)      parts.push(`Yaş: ${profile.age}`);
    if (profile.weight)   parts.push(`Kilo: ${profile.weight}`);
    if (profile.gender)   parts.push(`Cinsiyet: ${profile.gender}`);
    if (profile.neutered) parts.push(`Kısırlaştırıldı mı: ${profile.neutered}`);
    const profileStr = parts.length ? `\n\nPoodle profili: ${parts.join(", ")}.` : "";
    return `Sen YourPoodle'ın AI asistanısın. Yalnızca Toy Poodle ve Miniature Poodle sahiplerine yardımcı oluyorsun.${profileStr}

Kurallar:
- Samimi, sıcak ve anlaşılır dil kullan.
- Sadece poodle bakımı, beslenmesi, eğitimi, sağlığı ve davranışı hakkında bilgi ver.
- Kesin tıbbi teşhis koyma, ilaç dozu verme.
- Acil belirti (kusma+letarji, 24 saatten uzun iştahsızlık, nöbet, zehirlenme şüphesi) varsa "⚠️ Hemen veterinere gidin" uyarısı ver.
- Ciddi sağlık sorunlarında daima veterinere yönlendir.
- Sorulara kısa ve net cevaplar ver, gerektiğinde madde madde açıkla.
- Türkçe cevap ver.
- Her yanıt genel bilgilendirme amaçlıdır; bunu kısa bir notla belirt.`;
  };

  /* Greeting */
  const greeting = (() => {
    if (profile.name && (profile.age || profile.weight)) {
      const details = [profile.age, profile.weight].filter(Boolean).join(", ");
      return `Merhaba! ${profile.name} (${details}) için size nasıl yardımcı olabilirim? 🐾`;
    }
    if (profile.name) return `Merhaba! ${profile.name}'ın sahibine hoş geldiniz. 🐾 Beslenme, bakım, eğitim veya sağlık hakkında her şeyi sorabilirsiniz.`;
    return "Merhaba! Ben Poodle asistanınım. 🐾\nBeslenme, bakım, eğitim veya sağlık hakkındaki sorularınızı yanıtlayabilirim. Poodle'ınızın bilgilerini profilden girerseniz daha özel öneriler sunabilirim.";
  })();

  /* Source articles for active cat */
  const sourceArticles = ARTICLE_LINKS[activeCat] ?? [];

  /* Send message */
  const send = useCallback(async (text?: string) => {
    const q = (text ?? input).trim();
    if (!q || loading) return;

    if (limitReached) {
      track("ai_limit_reached");
      return;
    }

    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "42px";

    const newCount = incrementLimit();
    setLimitData({ date: getToday(), count: newCount });

    const ts = Date.now();
    const newMessages: Message[] = [...messages, { role:"user", content:q, ts }];
    setMessages(newMessages);
    setLoading(true);
    setShowExamples(false);

    track("ai_question_sent", { category: activeCat, has_profile: hasProfile });

    try {
      const res = await fetch("/api/yp-chat", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          messages: newMessages.map(({ role, content }) => ({ role, content })),
          systemPrompt: buildSystemPrompt(),
        }),
      });
      const data = await res.json();
      let reply = data.reply ?? "Üzgünüm, şu anda yanıt veremiyorum. Lütfen tekrar deneyin.";

      /* Append source article links */
      const arts = ARTICLE_LINKS[activeCat];
      if (arts && arts.length >= 2) {
        const links = arts.slice(0, 2).map(a => `📖 ${a.title} → /yourpoodle/rehber/${a.slug}`).join("\n");
        reply += `\n\nİlgili rehberler:\n${links}`;
      }

      setMessages(prev => [...prev, { role:"assistant", content: reply, ts: Date.now() }]);
    } catch {
      setMessages(prev => [...prev, { role:"assistant", content:"Bağlantı hatası oluştu. Lütfen tekrar deneyin.", ts:Date.now() }]);
    }
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, loading, messages, profile, activeCat, limitReached, hasProfile]);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const resetChat = () => {
    setMessages([]);
    setShowExamples(true);
    try { localStorage.removeItem(LS_MSG); } catch {}
  };

  const selectCat = (id: string) => {
    setActiveCat(id);
    track("ai_category_selected", { category: id });
  };

  const sendChip = (q: string) => {
    track("ai_quick_chip_clicked", { question: q, category: activeCat });
    send(q);
  };

  const currentCat = CATS.find(c => c.id === activeCat) ?? CATS[0];
  const isHealthCat = activeCat === "saglik";

  /* Schemas */
  const webAppSchema = {
    "@context":"https://schema.org","@type":"WebApplication",
    "name":"AI Poodle Asistanı","applicationCategory":"LifestyleApplication",
    "operatingSystem":"Web",
    "offers":{"@type":"Offer","price":"0","priceCurrency":"TRY"},
    "url":"https://www.yourpoodle.com/yourpoodle/ai-asistan",
    "description":PAGE_DESC,
    "featureList":["Poodle beslenme danışmanlığı","Bakım ve tıraş önerileri","Eğitim ve davranış tavsiyeleri","Sağlık bilgilendirme","Kişiselleştirilmiş yanıtlar"],
    "publisher":{"@type":"Organization","name":"YourPoodle","url":"https://www.yourpoodle.com"},
  };
  const faqSchema = {
    "@context":"https://schema.org","@type":"FAQPage",
    "mainEntity": SSS.map(s => ({
      "@type":"Question","name":s.q,
      "acceptedAnswer":{"@type":"Answer","text":s.a},
    })),
  };

  const TOOLS = [
    { emoji:"🍖", title:"Mama Bul", desc:"Yaşa ve kiloya göre mama önerisi", href:"/yourpoodle/mama-bul", color:"#FFF7ED", accent:"#EA580C" },
    { emoji:"✂️", title:"Tıraş Planlayıcı", desc:"Bakım rehberi ve tıraş takvimi", href:"/yourpoodle/bilgi", color:"#FFF0F5", accent:"#E75480" },
    { emoji:"❤️", title:"Belirti Kontrolü", desc:"Sağlık sihirbazını başlat", href:"/yourpoodle/saglik", color:"#FFF1F2", accent:"#EF4444" },
    { emoji:"🎓", title:"Eğitim Programı", desc:"4 haftalık komut programı", href:"/yourpoodle/egitim", color:"#F0FDF4", accent:"#16A34A" },
  ];

  return (
    <YPLayout activeLink="/yourpoodle/ai-asistan" bottomNavActive="/yourpoodle/bilgi">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}/>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        .yp-ai-msgs-area::-webkit-scrollbar { width: 4px; }
        .yp-ai-msgs-area::-webkit-scrollbar-thumb { background: #DDD5FF; border-radius: 4px; }
        .yp-msg-user { align-self: flex-end; background: #7C3AED; color: #fff; border-radius: 18px 18px 4px 18px; padding: 11px 15px; max-width: 82%; font-size: 14px; line-height: 1.55; word-break: break-word; }
        .yp-msg-bot  { align-self: flex-start; background: #fff; color: #222; border-radius: 18px 18px 18px 4px; padding: 11px 15px; max-width: 86%; font-size: 14px; line-height: 1.65; box-shadow: 0 2px 12px rgba(0,0,0,0.07); word-break: break-word; white-space: pre-wrap; }
        .yp-dot { width: 7px; height: 7px; border-radius: 50%; background: #bbb; animation: yp-bounce 1.2s infinite; }
        .yp-dot:nth-child(2) { animation-delay: 0.2s; }
        .yp-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes yp-bounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }
        .cat-pill-ai { transition: all 0.15s; }
        .cat-pill-ai:hover { opacity: 0.85; }
        .noscroll-ai::-webkit-scrollbar { display:none; }
        .noscroll-ai { -ms-overflow-style:none; scrollbar-width:none; }
        .eq-btn:hover { background: #F0EBFF !important; border-color: #A78BFA !important; }
        .eq-btn { transition: background 0.12s, border-color 0.12s; }
        .tool-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(124,58,237,0.12); text-decoration: none; }
        .tool-card { transition: all 0.2s; }
        .sss-answer { overflow: hidden; transition: max-height 0.28s ease, padding 0.28s ease; }
        @media (min-width: 640px) {
          .ai-capability-grid { display: grid !important; grid-template-columns: repeat(3, 1fr) !important; gap: 14px !important; }
          .ai-tools-grid { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 12px !important; }
          .ai-stats-row { display: flex !important; }
        }
        @media (max-width: 639px) {
          .ai-stats-row { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 10px 20px !important; }
          .ai-hero { padding: 18px 20px 22px !important; }
        }
      `}</style>

      {/* ── Hero ── */}
      <div className="ai-hero" style={{ background:"linear-gradient(135deg,#7C3AED,#A855F7)", padding:"28px 24px 32px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-30, right:-20, width:140, height:140, borderRadius:"50%", background:"rgba(255,255,255,0.08)" }}/>
        <div style={{ position:"absolute", bottom:-30, left:-10, width:90, height:90, borderRadius:"50%", background:"rgba(255,255,255,0.06)" }}/>
        <div style={{ width:52, height:52, borderRadius:16, background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14 }}>
          <Bot size={28} color="#fff"/>
        </div>
        <h1 style={{ fontSize:26, fontWeight:900, color:"#fff", marginBottom:6, lineHeight:1.2 }}>AI Poodle Asistanı</h1>
        <p style={{ fontSize:14, color:"rgba(255,255,255,0.9)", lineHeight:1.55, margin:"0 0 16px" }}>
          Poodle'ınız hakkında her soruyu sorun — beslenme, bakım, eğitim ve sağlık.
        </p>
        <div className="ai-stats-row" style={{ display:"flex", gap:22, flexWrap:"wrap" }}>
          {[["7/24","Aktif"],["Ücretsiz","Her zaman"],["Anlık","Yanıt"],["5","Kategori"]].map(([n,l])=>(
            <div key={l}>
              <div style={{ fontSize:15, fontWeight:900, color:"#fff" }}>{n}</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.75)" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Breadcrumb ── */}
      <nav aria-label="breadcrumb" style={{ padding:"10px 16px 0", display:"flex", gap:4, alignItems:"center", fontSize:12, color:"#aaa" }}>
        <a href="/yourpoodle" style={{ color:"#7C3AED", textDecoration:"none", fontWeight:600 }}>Ana Sayfa</a>
        <ChevronRight size={11}/>
        <span style={{ color:"#555", fontWeight:600 }}>AI Asistan</span>
      </nav>

      {/* ── Capability cards ── */}
      <div style={{ padding:"20px 16px 0" }}>
        <h2 style={{ fontSize:15, fontWeight:800, color:"#1a1a1a", marginBottom:12 }}>🤖 AI Asistanı Ne Yapabilir?</h2>
        <div className="ai-capability-grid" style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {CATS.map(c => (
            <div key={c.id} style={{ background:"#F5F0FF", borderRadius:13, padding:"14px 16px", border:"1.5px solid #EDE9FE" }}>
              <div style={{ fontSize:22, marginBottom:7 }} aria-hidden="true">{c.emoji}</div>
              <div style={{ fontSize:13.5, fontWeight:800, color:"#1a1a1a", marginBottom:5 }}>{c.label}</div>
              <div style={{ fontSize:12.5, color:"#666", lineHeight:1.55 }}>"{c.qs[0]}"</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Chat section ── */}
      <div style={{ padding:"20px 16px 0" }}>
        <div className="ai-chat-layout" style={{ display:"block" }}>

          {/* Profile panel */}
          <div style={{ marginBottom:14 }}>
            <button onClick={() => { setShowProfile(!showProfile); if (!showProfile) track("ai_profile_connected"); }}
              style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"11px 14px", background:"#F5F0FF", borderRadius:13, border:"1.5px solid #DDD5FF", cursor:"pointer", marginBottom:showProfile?8:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                <span style={{ fontSize:18 }} aria-hidden="true">🐩</span>
                <span style={{ fontSize:13.5, fontWeight:700, color:"#7C3AED" }}>Poodle Profilim</span>
                {hasProfile && (
                  <span style={{ fontSize:10, fontWeight:700, background:"#7C3AED", color:"#fff", borderRadius:20, padding:"2px 8px" }}>Dolu</span>
                )}
              </div>
              <ChevronDown size={16} color="#7C3AED" style={{ transform:showProfile?"rotate(180deg)":"none", transition:"0.2s" }}/>
            </button>
            {showProfile && (
              <div style={{ background:"#F5F0FF", borderRadius:13, padding:"14px 16px", border:"1.5px solid #DDD5FF" }}>
                <p style={{ fontSize:12, color:"#6D4BC5", marginBottom:12, lineHeight:1.5 }}>
                  Poodle'ınızın bilgilerini girerek daha kişisel öneriler alın (isteğe bağlı):
                </p>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}>
                  {PROFILE_FIELDS.map(f => (
                    <div key={f.key}>
                      <label htmlFor={"yp-prf-"+f.key} style={{ fontSize:11, fontWeight:700, color:"#555", display:"block", marginBottom:3 }}>{f.label}</label>
                      <input id={"yp-prf-"+f.key}
                        value={profile[f.key as keyof Profile]}
                        onChange={e => setProfile(p => ({ ...p, [f.key]:e.target.value }))}
                        placeholder={f.placeholder}
                        style={{ width:"100%", border:"1.5px solid #DDD5FF", borderRadius:9, padding:"7px 10px", fontSize:13, outline:"none", fontFamily:"'Inter',sans-serif", background:"#fff" }}/>
                    </div>
                  ))}
                </div>
                <button onClick={() => setShowProfile(false)}
                  style={{ width:"100%", height:36, borderRadius:9, border:"none", background:"#7C3AED", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>
                  Kaydet ✓
                </button>
              </div>
            )}
          </div>

          {/* Chat card */}
          <div ref={chatRef} style={{ border:"1.5px solid #DDD5FF", borderRadius:16, overflow:"hidden", background:"#f8f7ff" }}>

            {/* Chat header */}
            <div style={{ background:"#7C3AED", padding:"12px 16px", display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Bot size={20} color="#fff"/>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14.5, fontWeight:800, color:"#fff" }}>AI Poodle Asistanı</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.75)" }}>
                  {loading ? "Yazıyor..." : "Poodle uzmanı • Her zaman aktif"}
                </div>
              </div>
              {/* Daily limit badge */}
              <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.85)", background:"rgba(255,255,255,0.15)", borderRadius:20, padding:"3px 10px", flexShrink:0 }}>
                {limitReached ? "⛔ Limit doldu" : `${remainingQuestions}/${DAILY_LIMIT} soru`}
              </div>
              {messages.length > 0 && (
                <button onClick={resetChat} title="Yeni Sohbet" aria-label="Sohbeti temizle"
                  style={{ background:"rgba(255,255,255,0.15)", border:"none", borderRadius:9, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#fff", flexShrink:0 }}>
                  <RotateCcw size={16}/>
                </button>
              )}
            </div>

            {/* Health emergency banner */}
            {isHealthCat && (
              <div style={{ background:"#FFF1F2", borderBottom:"1px solid #FEE2E2", padding:"9px 14px", display:"flex", alignItems:"center", gap:8 }}>
                <AlertTriangle size={14} color="#EF4444" style={{ flexShrink:0 }}/>
                <span style={{ fontSize:12, color:"#991B1B", flex:1 }}>
                  ⚠️ Acil durum mu?{" "}
                  <a href="/yourpoodle/rehber/poodle-saglik-sorunlari" style={{ color:"#7C3AED", fontWeight:700, textDecoration:"none" }}>
                    Acil belirti rehberi →
                  </a>
                </span>
              </div>
            )}

            {/* Messages area */}
            <div ref={msgsRef} className="yp-ai-msgs-area" role="log" aria-live="polite"
              style={{ minHeight:340, maxHeight:"56vh", overflowY:"auto", padding:"14px 14px 8px", display:"flex", flexDirection:"column", gap:11 }}>

              {messages.length === 0 && (
                <>
                  {/* Greeting bubble */}
                  <div style={{ display:"flex", gap:9, alignItems:"flex-start" }}>
                    <div style={{ width:30, height:30, borderRadius:"50%", background:"#F0E8FF", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2 }}>
                      <Bot size={15} color="#7C3AED"/>
                    </div>
                    <div className="yp-msg-bot" style={{ marginTop:0 }}>
                      <span style={{ fontWeight:700 }}>{greeting.split("\n")[0]}</span>
                      {greeting.includes("\n") && "\n" + greeting.split("\n").slice(1).join("\n")}
                    </div>
                  </div>

                  {/* Profile CTA chip — only when no profile */}
                  {!hasProfile && (
                    <div style={{ display:"flex", gap:9, alignItems:"center" }}>
                      <div style={{ width:30, height:30, flexShrink:0 }}/>
                      <button onClick={() => setShowProfile(true)}
                        style={{ fontSize:12, fontWeight:700, color:"#7C3AED", background:"#F0E8FF", border:"1.5px solid #DDD5FF", borderRadius:20, padding:"6px 14px", cursor:"pointer" }}>
                        🐩 Profil oluşturun → daha kişisel öneriler alın
                      </button>
                    </div>
                  )}

                  {/* Tıbbi disclaimer */}
                  <div role="alert" style={{ display:"flex", gap:9, alignItems:"flex-start", padding:"10px 12px", background:"#FFFBEB", borderRadius:12, border:"1px solid #FDE68A" }}>
                    <AlertTriangle size={15} color="#D97706" style={{ flexShrink:0, marginTop:1 }}/>
                    <p style={{ fontSize:12, color:"#92400E", margin:0, lineHeight:1.5 }}>
                      Bu asistan genel bilgilendirme sağlar. Acil veya ciddi sağlık durumlarında veteriner hekime başvurun.
                    </p>
                  </div>
                </>
              )}

              {/* Message list */}
              {messages.map((m, i) => (
                <div key={i} style={{ display:"flex", gap:8, alignItems:"flex-end", flexDirection:m.role==="user"?"row-reverse":"row" }}>
                  {m.role==="assistant" && (
                    <div style={{ width:28, height:28, borderRadius:"50%", background:"#F0E8FF", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <Bot size={14} color="#7C3AED"/>
                    </div>
                  )}
                  <div className={m.role==="user"?"yp-msg-user":"yp-msg-bot"}>{m.content}</div>
                  {m.role==="user" && (
                    <div style={{ width:28, height:28, borderRadius:"50%", background:"#7C3AED", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <User size={14} color="#fff"/>
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div style={{ display:"flex", gap:8, alignItems:"flex-end" }}>
                  <div style={{ width:28, height:28, borderRadius:"50%", background:"#F0E8FF", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Bot size={14} color="#7C3AED"/>
                  </div>
                  <div style={{ background:"#fff", borderRadius:"18px 18px 18px 4px", padding:"14px 16px", boxShadow:"0 2px 12px rgba(0,0,0,0.07)" }}>
                    <div style={{ display:"flex", gap:4 }}><div className="yp-dot"/><div className="yp-dot"/><div className="yp-dot"/></div>
                  </div>
                </div>
              )}
              <div ref={bottomRef}/>
            </div>

            {/* Example questions */}
            {showExamples && (
              <div style={{ borderTop:"1px solid #EDE9FE", background:"#fff" }}>
                <div style={{ padding:"10px 12px 6px" }}>
                  <div className="noscroll-ai" style={{ display:"flex", gap:6, overflowX:"auto" }}>
                    {CATS.map(c => (
                      <button key={c.id} onClick={() => selectCat(c.id)} className="cat-pill-ai"
                        aria-pressed={activeCat===c.id}
                        style={{ flexShrink:0, display:"flex", alignItems:"center", gap:4, padding:"5px 12px", borderRadius:20, border:"1.5px solid", borderColor:activeCat===c.id?"#7C3AED":"#DDD5FF", background:activeCat===c.id?"#7C3AED":"#fff", color:activeCat===c.id?"#fff":"#555", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                        {c.emoji} {c.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ padding:"4px 12px 12px", display:"flex", flexDirection:"column", gap:7 }}>
                  {currentCat.qs.map(q => (
                    <button key={q} onClick={() => sendChip(q)} className="eq-btn" disabled={limitReached}
                      style={{ background:"#fff", border:"1.5px solid #DDD5FF", borderRadius:11, padding:"10px 13px", textAlign:"left", fontSize:13, color: limitReached?"#aaa":"#333", cursor: limitReached?"not-allowed":"pointer", fontFamily:"'Inter',sans-serif", lineHeight:1.4 }}>
                      💬 {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Toggle examples when chat started */}
            {messages.length > 0 && (
              <div style={{ borderTop:"1px solid #EDE9FE", padding:"6px 12px", background:"#fff" }}>
                <button onClick={() => setShowExamples(!showExamples)}
                  style={{ fontSize:12, fontWeight:700, color:"#7C3AED", background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>
                  <Search size={13}/>
                  {showExamples ? "Örnek soruları gizle" : "Örnek soruları göster"}
                </button>
              </div>
            )}

            {/* Limit reached banner */}
            {limitReached && (
              <div style={{ borderTop:"1px solid #EDE9FE", padding:"12px 14px", background:"#FFF7ED" }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#92400E", marginBottom:6 }}>⛔ Günlük 5 ücretsiz sorunuz doldu</div>
                <div style={{ fontSize:12, color:"#92400E", marginBottom:8 }}>Yarın tekrar soru sorabilir ya da Club üyesi olarak sınırsız erişim alabilirsiniz.</div>
                <button onClick={() => navigate("/yourpoodle/kayit")}
                  style={{ padding:"7px 16px", borderRadius:20, border:"none", background:"#7C3AED", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                  Club Üyesi Ol → Sınırsız Soru
                </button>
              </div>
            )}

            {/* Input bar */}
            <div style={{ borderTop:"1px solid #EDE9FE", padding:"10px 12px", display:"flex", gap:8, alignItems:"flex-end", background:"#fff" }}>
              <textarea ref={textareaRef}
                value={input}
                onChange={e => { setInput(e.target.value); e.target.style.height="42px"; e.target.style.height=Math.min(e.target.scrollHeight,120)+"px"; }}
                onKeyDown={handleKey}
                placeholder={limitReached ? "Günlük limit doldu" : "Sorunuzu yazın... (Enter ile gönder, Shift+Enter yeni satır)"}
                disabled={limitReached}
                rows={1}
                aria-label="Poodle sorunuzu yazın"
                role="textbox"
                style={{ flex:1, border:"1.5px solid #DDD5FF", borderRadius:13, padding:"10px 14px", fontSize:14, fontFamily:"'Inter',sans-serif", resize:"none", outline:"none", minHeight:42, maxHeight:120, background: limitReached?"#F5F5F5":"#F8F7FF", color:"#222", lineHeight:1.5, transition:"border-color 0.15s" }}
                onFocus={e => { if (!limitReached) e.target.style.borderColor="#7C3AED"; }}
                onBlur={e => { e.target.style.borderColor="#DDD5FF"; }}/>
              <button onClick={() => send()} disabled={!input.trim()||loading||limitReached} aria-label="Gönder"
                style={{ width:44, height:44, borderRadius:12, background:input.trim()&&!loading&&!limitReached?"#7C3AED":"#DDD5FF", border:"none", cursor:input.trim()&&!loading&&!limitReached?"pointer":"not-allowed", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:"#fff", transition:"background 0.15s" }}>
                <Send size={18}/>
              </button>
            </div>

            {/* Privacy note */}
            <div style={{ padding:"8px 14px 12px", background:"#fff", borderTop:"1px solid #f5f5f5" }}>
              <p style={{ fontSize:11, color:"#aaa", margin:0, lineHeight:1.5 }}>
                🔒 Sohbetleriniz anonim olarak işlenir. Kişisel verileriniz üçüncü taraflarla paylaşılmaz.{" "}
                <a href="/yourpoodle/gizlilik-politikasi" style={{ color:"#7C3AED", fontSize:11, fontWeight:700, textDecoration:"none" }}>
                  Gizlilik Politikası →
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── SSS Accordion (FAQPage schema, crawler-visible via max-height) ── */}
      <div style={{ padding:"24px 16px 0" }}>
        <h2 style={{ fontSize:15, fontWeight:800, color:"#1a1a1a", marginBottom:12 }}>💡 Sık Sorulan Sorular</h2>
        <div style={{ background:"#fff", borderRadius:16, border:"1.5px solid #EDE9FE", overflow:"hidden" }}>
          {SSS.map((s, i) => {
            const open = expandedSss === i;
            return (
              <div key={i} style={{ borderBottom:i<SSS.length-1?"1px solid #F5F0FF":"none" }}>
                <button onClick={() => setExpandedSss(open ? null : i)}
                  aria-expanded={open}
                  style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 16px", background:"none", border:"none", cursor:"pointer", textAlign:"left", gap:10 }}>
                  <span style={{ fontSize:13.5, fontWeight:700, color:"#1a1a1a", lineHeight:1.4 }}>S: {s.q}</span>
                  <span style={{ fontSize:16, color:"#7C3AED", flexShrink:0, lineHeight:1 }} aria-hidden="true">{open?"−":"+"}</span>
                </button>
                {/* max-height animation instead of display:none — keeps content in DOM for SEO */}
                <div className="sss-answer" style={{ maxHeight: open ? "400px" : "0px", padding: open ? "0 16px 14px" : "0 16px" }}>
                  <p style={{ fontSize:13.5, color:"#555", lineHeight:1.7, margin:0 }}>
                    <span style={{ fontWeight:700, color:"#7C3AED" }}>C: </span>{s.a}
                  </p>
                  <button onClick={() => send(s.q)} disabled={limitReached}
                    style={{ marginTop:10, padding:"7px 15px", borderRadius:20, border:"1.5px solid #7C3AED", background:"#fff", color:"#7C3AED", fontSize:12, fontWeight:700, cursor: limitReached?"not-allowed":"pointer", opacity: limitReached?0.5:1 }}>
                    💬 Asistana sor →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Related tools (real <a> links) ── */}
      <div style={{ padding:"24px 16px 0" }}>
        <h2 style={{ fontSize:15, fontWeight:800, color:"#1a1a1a", marginBottom:12 }}>🔧 İlgili Araçlar</h2>
        <div className="ai-tools-grid" style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {TOOLS.map(t => (
            <a key={t.title} href={t.href}
              className="tool-card"
              aria-label={`${t.title}: ${t.desc}`}
              onClick={() => track("ai_tool_card_clicked", { tool: t.title, href: t.href })}
              style={{ display:"flex", alignItems:"center", gap:13, padding:"14px 16px", background:t.color, borderRadius:13, textDecoration:"none" }}>
              <div style={{ fontSize:28, flexShrink:0 }} aria-hidden="true">{t.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13.5, fontWeight:800, color:"#111", marginBottom:3 }}>{t.title}</div>
                <div style={{ fontSize:12, color:"#666" }}>{t.desc}</div>
              </div>
              <div style={{ fontSize:13, color:t.accent, fontWeight:700, flexShrink:0 }}>→</div>
            </a>
          ))}
        </div>
      </div>

      {/* ── Mobile sticky FAB ── */}
      <style>{`
        @media (max-width: 767px) {
          .yp-chat-fab { display: flex !important; }
        }
      `}</style>
      <button className="yp-chat-fab"
        onClick={() => chatRef.current?.scrollIntoView({ behavior:"smooth", block:"start" })}
        aria-label="Soru Sor"
        style={{ display:"none", position:"fixed", bottom:80, right:18, zIndex:400, width:54, height:54, borderRadius:"50%", background:"#7C3AED", border:"none", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 20px rgba(124,58,237,0.4)", cursor:"pointer", color:"#fff", fontSize:22 }}>
        💬
      </button>

      <div style={{ height:32 }}/>
    </YPLayout>
  );
}
