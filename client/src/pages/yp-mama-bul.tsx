import { useState, useEffect, useMemo, useRef } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Check, ShoppingCart, RotateCcw, Info } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { useCustomer } from "@/contexts/CustomerContext";

/* ─── Types ──────────────────────────────────────────────────── */
interface StepOption { value: string; label: string; desc?: string; icon?: string; }
type StepType = "radio" | "checkbox";
interface Step {
  key: string; type: StepType; question: string; questionBold?: string; question2?: string;
  hint: string; emoji: string; options: StepOption[];
  infoBanner?: string; hasHero?: boolean;
}

/* ─── Step config (11 steps) ─────────────────────────────────── */
const STEPS: Step[] = [
  {
    key: "age", type: "radio", hasHero: true,
    emoji: "🐾",
    question: "Poodle'ınızın ", questionBold: "yaşı nedir?",
    hint: "Yaşa göre besin ihtiyacı farklılaşır. Doğru seçimi birlikte yapalım.",
    options: [
      { value: "puppy",  label: "Yavru (0–12 ay)",    desc: "Besin ihtiyacı yüksek, büyüme dönemi", icon: "🌱" },
      { value: "adult",  label: "Yetişkin (1–7 yaş)", desc: "Dengeli beslenme, enerji dengesi",      icon: "💪" },
      { value: "senior", label: "Yaşlı (7+ yaş)",     desc: "Eklem desteği, düşük kalori",          icon: "❤️" },
    ],
  },
  {
    key: "weight", type: "radio", hasHero: true,
    emoji: "⚖️",
    question: "Poodle'ınızın ", questionBold: "kilosu?",
    hint: "Doğru porsiyon hesabı için önemli",
    infoBanner: "Kilonuza göre günlük mama miktarı ve öneriler size özel hazırlanır.",
    options: [
      { value: "micro",    label: "1–2 kg",  desc: "Micro / Teacup", icon: "🫧" },
      { value: "toy",      label: "2–4 kg",  desc: "Toy Poodle",     icon: "🐩" },
      { value: "mini",     label: "4–9 kg",  desc: "Minyatür",       icon: "🐕" },
      { value: "standard", label: "9+ kg",   desc: "Standart",       icon: "🦮" },
    ],
  },
  {
    key: "neutered", type: "radio", hasHero: true,
    emoji: "🏥",
    question: "Kısırlaştırıldı mı?",
    hint: "Kısır poodle'lerin kalori ihtiyacı daha azdır.",
    infoBanner: "Doğru seçim, ideal kilo ve sağlıklı bir yaşam için önemlidir.",
    options: [
      { value: "yes", label: "Evet",  desc: "Light / kısır formül önerilir", icon: "✅" },
      { value: "no",  label: "Hayır", desc: "Standart formül uygundur",       icon: "🔵" },
    ],
  },
  {
    key: "activity", type: "radio", hasHero: true,
    emoji: "🏃",
    question: "Günlük ", questionBold: "aktivite seviyesi?",
    hint: "Aktif poodle'ler daha fazla kalori harcar",
    options: [
      { value: "low",    label: "Düşük",  desc: "Çoğunlukla evde, kısa yürüyüş", icon: "🛋️" },
      { value: "medium", label: "Orta",   desc: "Günlük 30–60 dk yürüyüş",       icon: "🚶" },
      { value: "high",   label: "Yüksek", desc: "Aktif, uzun yürüyüşler",        icon: "🏃" },
    ],
  },
  {
    key: "weight_goal", type: "radio", hasHero: true,
    emoji: "🎯",
    question: "Kilo ", questionBold: "hedefi", question2: " var mı?",
    hint: "Buna göre kalori yoğunluğunu ayarlıyoruz.",
    options: [
      { value: "lose",     label: "Kilo vermesi gerekiyor", desc: "Kilo kontrolü ve yağ kaybı desteklenir.", icon: "📉" },
      { value: "gain",     label: "Biraz kilo alması lazım", desc: "Sağlıklı kilo artışını destekler.",      icon: "📈" },
      { value: "maintain", label: "Kilosunu korusun",        desc: "Mevcut kilosunu korumaya yardımcı olur.", icon: "⚖️" },
    ],
  },
  {
    key: "allergy", type: "radio", hasHero: true,
    emoji: "🌿",
    question: "Bilinen ", questionBold: "alerjisi", question2: " var mı?",
    hint: "Alerjen içerikli mamaları filtreliyoruz.",
    options: [
      { value: "none",    label: "Yok / Bilmiyorum",  desc: "Alerjisi yok veya bilmiyorum.",                    icon: "✅" },
      { value: "chicken", label: "Tavuk alerjisi",     desc: "Tavuk proteinine karşı alerjisi var.",             icon: "🐔" },
      { value: "grain",   label: "Tahıl hassasiyeti",  desc: "Tahıl içeriklerine karşı hassasiyeti var.",        icon: "🌾" },
      { value: "fish",    label: "Balık alerjisi",     desc: "Balık proteinine karşı alerjisi var.",             icon: "🐟" },
      { value: "other",   label: "Farklı bir alerji",  desc: "Yukarıdakiler dışında farklı bir alerjisi var.",   icon: "⚠️" },
    ],
  },
  {
    key: "coat", type: "radio", hasHero: true,
    emoji: "✨",
    question: "Tüy & deri ", questionBold: "durumu?",
    hint: "Omega yağ asitleri tüy kalitesini artırır.",
    options: [
      { value: "none",     label: "Sağlıklı, sorun yok",  desc: "İdeal tüy & deri durumu",          icon: "✨" },
      { value: "dull",     label: "Tüyleri mat / cansız",  desc: "Parlaklık ve canlılık desteği",    icon: "😔" },
      { value: "scratch",  label: "Çok kaşınıyor",         desc: "Kaşıntı ve tahriş desteği",        icon: "🤚" },
      { value: "shedding", label: "Aşırı dökülüyor",       desc: "Tüy dökülmesine karşı destek",    icon: "💇" },
    ],
  },
  {
    key: "digestion", type: "radio", hasHero: true,
    emoji: "🫀",
    question: "Sindirim hassasiyeti var mı?",
    hint: "Hassas sindirim için özel formüller mevcuttur.",
    options: [
      { value: "none",           label: "Yok, sorun yok",         desc: "Normal sindirim, herhangi bir problem yok.",              icon: "✅" },
      { value: "sensitive",      label: "Zaman zaman mide sorunu", desc: "Ara sıra kusma, ishal veya mide hassasiyeti yaşıyor.",   icon: "🤢" },
      { value: "very_sensitive", label: "Çok hassas sindirim",     desc: "Sık sık sindirim problemi yaşıyor, özel mama gerekiyor.", icon: "⚠️" },
    ],
  },
  {
    key: "protein", type: "checkbox", hasHero: false,
    emoji: "🥩",
    question: "Tercih edilen protein?",
    hint: "Poodle'ınızın en iyi sindireceği kaynakları seçebilirsiniz.",
    infoBanner: "Birden fazla seçenek işaretleyebilirsiniz.",
    options: [
      { value: "chicken", label: "Tavuk",         desc: "Hafif ve sindirimi kolay protein kaynağıdır.",            icon: "🐔" },
      { value: "lamb",    label: "Kuzu",           desc: "Yüksek besin değeri ve lezzetli bir kaynaktır.",          icon: "🐑" },
      { value: "salmon",  label: "Somon / Balık",  desc: "Omega-3 kaynağı, tüy ve deri sağlığını destekler.",      icon: "🐟" },
      { value: "rabbit",  label: "Tavşan",         desc: "Hipoalerjenik özellik gösterir, hassas köpekler için idealdir.", icon: "🐰" },
      { value: "any",     label: "Fark etmez",     desc: "Protein kaynağı benim için önemli değil.",               icon: "🔀" },
    ],
  },
  {
    key: "budget", type: "checkbox", hasHero: false,
    emoji: "💳",
    question: "Aylık mama bütçeniz?",
    hint: "Her bütçe için kaliteli seçenekler var",
    infoBanner: "Birden fazla seçenek işaretleyebilirsiniz.",
    options: [
      { value: "economy", label: "₺500–1.000",   desc: "Uygun fiyatlı, temel ihtiyaçları karşılayan mamalar.", icon: "💰" },
      { value: "mid",     label: "₺1.000–2.000",  desc: "Dengeli içerik ve kalite, en popüler aralık.",        icon: "💳" },
      { value: "premium", label: "₺2.000+",       desc: "Yüksek kaliteli içerik, özel formüller ve destekler.", icon: "⭐" },
    ],
  },
  {
    key: "package", type: "checkbox", hasHero: false,
    emoji: "📦",
    question: "Tercih edilen paket boyutu?",
    hint: "Küçük paketler daha taze, büyükler daha ekonomik",
    infoBanner: "Birden fazla seçenek işaretleyebilirsiniz.",
    options: [
      { value: "small",   label: "1–2 kg",   desc: "Taze kalır, değişiklik kolay",              icon: "📦" },
      { value: "medium",  label: "3–5 kg",   desc: "Taze + ekonomik denge",                     icon: "🗃️" },
      { value: "large",   label: "7–12 kg",  desc: "En ekonomik, depo gerektirir",              icon: "🏭" },
      { value: "xl",      label: "13–20 kg", desc: "Büyük ırklar için ideal",                   icon: "📦" },
      { value: "xxl",     label: "21–30 kg", desc: "Uzun süreli kullanım için uygun",            icon: "📦" },
      { value: "bulk",    label: "30+ kg",   desc: "En avantajlı, toplu alım",                  icon: "📦" },
    ],
  },
];

const RESULT_META = [
  { label: "En Uygun Seçim",    emoji: "🏆", color: "#5D3A1A", bg: "#EDE5D8", gradient: "linear-gradient(135deg,#5D3A1A,#8B5E34)", reason: "Poodle'ınızın yaşı, kilosu ve ihtiyaçlarıyla birebir örtüşüyor." },
  { label: "Fiyat Performans",  emoji: "💚", color: "#059669", bg: "#D1FAE5", gradient: "linear-gradient(135deg,#059669,#34D399)", reason: "Kaliteli içerik, makul fiyat. Uzun süreli kullanımda tasarruf sağlar." },
  { label: "Premium Seçim",     emoji: "⭐", color: "#D97706", bg: "#FEF3C7", gradient: "linear-gradient(135deg,#D97706,#F59E0B)", reason: "En yüksek kalite standartları. İçerik açısından üstün formül." },
];

interface Product {
  id: number; name: string; price: number; img: string | null;
  originalPrice?: number; mamaType?: string; mamaMetadata?: any;
  score?: number; matchPct?: number; reason?: string;
}

/* ─── Helpers for multi-select answers ──────────────────────── */
type Answers = Record<string, string | string[]>;

function getStr(answers: Answers, key: string): string {
  const v = answers[key];
  if (!v) return "";
  if (Array.isArray(v)) return v[0] || "";
  return v;
}

function hasAnswer(answers: Answers, key: string): boolean {
  const v = answers[key];
  if (!v) return false;
  if (Array.isArray(v)) return v.length > 0;
  return v !== "";
}

/* ─── Scoring ────────────────────────────────────────────────── */
function scoreProduct(p: any, answers: Answers): number {
  let score = 50;
  const meta = p.mamaMetadata || {};

  const ageMap: Record<string, string> = { puppy: "yavru", adult: "yetiskin", senior: "yasli" };
  const expectedType = ageMap[getStr(answers, "age")] || "";
  if (expectedType && p.mamaType) {
    score += p.mamaType === expectedType ? 30 : -10;
  }

  const protMap: Record<string, string> = { chicken: "tavuk", salmon: "somon", lamb: "kuzu", rabbit: "tavsan" };
  const proteinVals = answers.protein ? (Array.isArray(answers.protein) ? answers.protein : [answers.protein]) : [];
  if (proteinVals.length > 0 && !proteinVals.includes("any") && meta.proteinType) {
    const anyMatch = proteinVals.some(pv => meta.proteinType === protMap[pv]);
    score += anyMatch ? 20 : -5;
  } else if (proteinVals.includes("any")) {
    score += 6;
  }

  if (getStr(answers, "allergy") === "grain") {
    score += meta.grainFree === true ? 15 : -20;
  }

  const budgetMap: Record<string, string> = { economy: "ekonomik", mid: "orta", premium: "premium" };
  const tiers = ["ekonomik", "orta", "premium"];
  const budgetVals = answers.budget ? (Array.isArray(answers.budget) ? answers.budget : [answers.budget]) : [];
  if (budgetVals.length > 0 && meta.budgetTier) {
    const anyBudgetMatch = budgetVals.some(bv => meta.budgetTier === budgetMap[bv]);
    if (anyBudgetMatch) score += 15;
    else {
      const bestDiff = Math.min(...budgetVals.map(bv => {
        const expected = budgetMap[bv] || "";
        return Math.abs(tiers.indexOf(meta.budgetTier) - tiers.indexOf(expected));
      }));
      score += bestDiff === 1 ? -3 : -10;
    }
  }

  const weightBreed: Record<string, string[]> = { micro: ["toy"], toy: ["toy"], mini: ["miniature"], standard: ["standart"] };
  const weight = getStr(answers, "weight");
  if (weight && meta.breedSize) {
    const ok = weightBreed[weight] || [];
    score += ok.includes(meta.breedSize) ? 10 : -3;
  }

  const allergyKey = getStr(answers, "allergy");
  if (meta.allergens && allergyKey && allergyKey !== "none" && allergyKey !== "other") {
    const allergyMap: Record<string, string[]> = { chicken: ["tavuk"], fish: ["balik", "somon"], grain: ["tahil", "bugday"] };
    const allergyTerms = allergyMap[allergyKey] || [];
    const hasAllergen = meta.allergens.some((a: string) =>
      allergyTerms.some((t: string) => a.toLowerCase().includes(t))
    );
    if (hasAllergen) score -= 100;
  }

  if (meta.specialNeeds && Array.isArray(meta.specialNeeds)) {
    const coat = getStr(answers, "coat");
    const digestion = getStr(answers, "digestion");
    if ((coat === "dull" || coat === "shedding" || coat === "scratch") &&
        meta.specialNeeds.some((n: string) => n.includes("tuy") || n.includes("deri"))) {
      score += 10;
    }
    if ((digestion === "sensitive" || digestion === "very_sensitive") &&
        meta.specialNeeds.some((n: string) => n.includes("sindirim") || n.includes("hassas"))) {
      score += 10;
    }
  }

  return score;
}

function buildReason(p: any, answers: Answers): string {
  const meta = p.mamaMetadata || {};
  const parts: string[] = [];
  const age = getStr(answers, "age");
  const ageMatch = (age === "puppy" && p.mamaType === "yavru") ||
                   (age === "adult" && p.mamaType === "yetiskin") ||
                   (age === "senior" && p.mamaType === "yasli");
  if (ageMatch) {
    const lbl = { puppy: "Yavru", adult: "Yetişkin", senior: "Yaşlı" }[age] || "";
    parts.push(`${lbl} formülü`);
  }
  const protTR: Record<string, string> = { tavuk: "tavuklu", somon: "somonlu", kuzu: "kuzulu", tavsan: "tavşanlı" };
  if (meta.proteinType) parts.push(protTR[meta.proteinType] || meta.proteinType);
  if (meta.grainFree === true && getStr(answers, "allergy") === "grain") parts.push("tahılsız");
  if (meta.breedSize === "toy") parts.push("Toy boy'a uygun");
  return parts.length > 0 ? parts.join(" · ") : "Profilinize uygun seçim";
}

function pickRecommendations(products: any[], answers: Answers): Product[] {
  if (!products.length) return [];
  // Only consider products that have been tagged with food metadata — this
  // ensures non-food products (accessories, supplements without metadata) don't
  // crowd out proper matches, and any new admin-seeded product automatically
  // joins the candidate pool without extra steps.
  const candidates = products.filter(p => p.mamaMetadata != null);
  if (!candidates.length) return [];
  const scored = candidates.map(p => {
    const score = scoreProduct(p, answers);
    const matchPct = Math.min(98, Math.max(40, score));
    return { id: p.id, name: p.name, price: p.price, img: p.img, originalPrice: p.originalPrice,
             mamaType: p.mamaType, mamaMetadata: p.mamaMetadata, score, matchPct,
             reason: buildReason(p, answers) };
  });
  scored.sort((a, b) => b.score !== a.score ? b.score - a.score : a.price - b.price);
  const eligible = scored.filter(p => (p.score ?? 0) >= 0);
  const ineligible = scored.filter(p => (p.score ?? 0) < 0);
  return [...eligible, ...ineligible].slice(0, 3);
}

function breedToWeight(breed?: string | null): string | undefined {
  if (!breed) return undefined;
  const map: Record<string, string> = { toy: "toy", miniature: "mini", standard: "standard" };
  return map[breed];
}

/* ─── Poodle SVG illustration ────────────────────────────────── */
function PoodleIllustration() {
  return (
    <div style={{
      width: 200, height: 200, borderRadius: "50%",
      background: "linear-gradient(135deg, #5D3A1A 0%, #A67C52 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, position: "relative", overflow: "hidden",
      boxShadow: "0 12px 40px rgba(123,63,228,0.28)",
    }}>
      {/* Decorative circles */}
      <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
      <div style={{ position: "absolute", bottom: -10, left: -10, width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
      {/* Poodle emoji */}
      <span style={{ fontSize: 88, lineHeight: 1, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))", userSelect: "none" }}>🐩</span>
      {/* Heart decoration */}
      <span style={{ position: "absolute", top: 18, right: 22, fontSize: 20 }}>💜</span>
      <span style={{ position: "absolute", bottom: 22, left: 20, fontSize: 16 }}>🐾</span>
    </div>
  );
}

/* ─── Progress tracker ───────────────────────────────────────── */
function ProgressTracker({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "nowrap" }}>
      {Array.from({ length: total }).map((_, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} style={{
            width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700,
            background: done ? "#5D3A1A" : active ? "#FAF7F0" : "#F5F0E6",
            border: active ? "2px solid #5D3A1A" : done ? "2px solid #5D3A1A" : "2px solid #E5DDD0",
            color: done ? "#fff" : active ? "#5D3A1A" : "#B0A69C",
            transition: "all 0.3s ease",
          }}>
            {done ? <Check size={12} strokeWidth={3} /> : i + 1}
          </div>
        );
      })}
    </div>
  );
}

/* ─── InfoBanner ─────────────────────────────────────────────── */
function InfoBanner({ text }: { text: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      background: "#F5F0E6", borderRadius: 12,
      padding: "12px 16px", marginBottom: 16,
    }}>
      <Info size={16} color="#5D3A1A" style={{ flexShrink: 0 }} />
      <span style={{ fontSize: 13, color: "#3D2612", fontWeight: 500, lineHeight: 1.5 }}>{text}</span>
    </div>
  );
}

/* ─── OptionCard ─────────────────────────────────────────────── */
function OptionCard({
  opt, selected, onClick, type
}: {
  opt: StepOption; selected: boolean; onClick: () => void; type: StepType;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      style={{
        display: "flex", alignItems: "center", gap: 14,
        background: selected ? "#FAF7F0" : "#fff",
        border: `2px solid ${selected ? "#5D3A1A" : "#E5E7EB"}`,
        borderRadius: 16, padding: "16px 18px",
        cursor: "pointer", textAlign: "left", width: "100%",
        transition: "all 0.18s ease",
        boxShadow: selected ? "0 4px 16px rgba(123,63,228,0.12)" : "0 1px 4px rgba(0,0,0,0.04)",
        WebkitTapHighlightColor: "transparent",
      }}
      onMouseEnter={e => {
        if (!selected) (e.currentTarget as HTMLButtonElement).style.borderColor = "#D4C4B0";
      }}
      onMouseLeave={e => {
        if (!selected) (e.currentTarget as HTMLButtonElement).style.borderColor = "#E5E7EB";
      }}
    >
      {opt.icon && (
        <div style={{
          width: 48, height: 48, borderRadius: 12, flexShrink: 0,
          background: selected ? "#EDE5D8" : "#FAF7F0",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, transition: "background 0.18s",
        }}>
          {opt.icon}
        </div>
      )}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: selected ? "#3D2612" : "#2C2118", lineHeight: 1.3, marginBottom: opt.desc ? 3 : 0 }}>
          {opt.label}
        </div>
        {opt.desc && (
          <div style={{ fontSize: 12, color: selected ? "#5D3A1A" : "#6B7280", lineHeight: 1.4 }}>
            {opt.desc}
          </div>
        )}
      </div>
      {/* Radio / Checkbox indicator */}
      <div style={{
        width: 22, height: 22, flexShrink: 0,
        borderRadius: type === "radio" ? "50%" : 6,
        border: `2px solid ${selected ? "#5D3A1A" : "#D1D5DB"}`,
        background: selected ? "#5D3A1A" : "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.18s",
      }}>
        {selected && <Check size={12} color="#fff" strokeWidth={3} />}
      </div>
    </button>
  );
}

/* ─── Main component ─────────────────────────────────────────── */
export default function YPMamaBulPage() {
  const [, navigate] = useLocation();
  const { isLoggedIn, isLoading: authLoading } = useCustomer();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [done, setDone] = useState(false);
  const [slideKey, setSlideKey] = useState(0);
  const [historyLoaded, setHistoryLoaded] = useState(false); // #34: notice
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set()); // direct add-to-cart feedback
  const [clearingHistory, setClearingHistory] = useState(false); // #33: loading state
  const savedRef = useRef(false);
  const prefillApplied = useRef(false);
  const historyApplied = useRef(false);

  // Keys for checkbox-type steps — stored as comma-joined strings in the DB
  const CHECKBOX_KEYS = new Set(STEPS.filter(s => s.type === "checkbox").map(s => s.key));

  const { data: products = [] } = useQuery<any[]>({
    queryKey: ["/api/yp-products"],
    staleTime: 10 * 60 * 1000,
  });

  const { data: poodle } = useQuery<any>({
    queryKey: ["/api/yp/poodle"],
    enabled: isLoggedIn,
    staleTime: 5 * 60 * 1000,
  });

  const { data: latestRec } = useQuery<{ id: number; answers: Record<string, string> } | null>({
    queryKey: ["/api/yp/recommendations/latest"],
    enabled: isLoggedIn,
    staleTime: 5 * 60 * 1000,
  });

  // Restore all answers from the most recent run as defaults (logged-in only)
  useEffect(() => {
    if (historyApplied.current) return;
    if (authLoading) return; // wait until session bootstrap completes
    if (!isLoggedIn) { historyApplied.current = true; return; } // guest: skip
    if (latestRec === undefined) return; // still loading
    historyApplied.current = true;
    if (!latestRec) return; // no history yet
    const restored: Answers = {};
    for (const [k, v] of Object.entries(latestRec.answers)) {
      if (!v) continue;
      if (CHECKBOX_KEYS.has(k)) {
        restored[k] = v.includes(",") ? v.split(",") : [v];
      } else {
        restored[k] = v;
      }
    }
    if (Object.keys(restored).length === 0) return;
    // Merge: history provides defaults; any already-set answer (e.g. from
    // poodle profile if that effect ran first) wins over the history value.
    setAnswers(prev => {
      const merged = { ...restored };
      for (const k of Object.keys(prev)) {
        const existing = prev[k];
        if (existing && (Array.isArray(existing) ? existing.length > 0 : true)) {
          merged[k] = existing;
        }
      }
      return merged;
    });
    setHistoryLoaded(true); // #34: show "geçmişten yüklendi" notice
  }, [authLoading, isLoggedIn, latestRec]);

  // Poodle profile overrides age + weight (canonical source, always wins)
  useEffect(() => {
    if (!poodle || prefillApplied.current) return;
    prefillApplied.current = true;
    const prefill: Answers = {};
    const ageValues = ["puppy", "adult", "senior"];
    if (poodle.age && ageValues.includes(poodle.age)) prefill.age = poodle.age;
    const weight = breedToWeight(poodle.breed);
    if (weight) prefill.weight = weight;
    if (Object.keys(prefill).length > 0) setAnswers(a => ({ ...a, ...prefill }));
  }, [poodle]);

  const currentStep = STEPS[step];

  const handleSelect = (val: string) => {
    if (currentStep.type === "radio") {
      setAnswers(a => ({ ...a, [currentStep.key]: val }));
    } else {
      // checkbox: toggle
      setAnswers(a => {
        const prev = a[currentStep.key];
        const arr: string[] = Array.isArray(prev) ? [...prev] : (prev ? [prev as string] : []);
        const idx = arr.indexOf(val);
        if (idx >= 0) arr.splice(idx, 1);
        else arr.push(val);
        return { ...a, [currentStep.key]: arr };
      });
    }
  };

  const isSelected = (val: string): boolean => {
    const v = answers[currentStep.key];
    if (!v) return false;
    if (Array.isArray(v)) return v.includes(val);
    return v === val;
  };

  const hasSelection = hasAnswer(answers, currentStep.key);

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
      setSlideKey(k => k + 1);
    } else {
      setDone(true);
    }
  };

  const handleBack = () => {
    if (step > 0) { setStep(s => s - 1); setSlideKey(k => k + 1); }
    else navigate("/yourpoodle");
  };

  // Correct page-specific document title — overrides static index.html title
  useEffect(() => {
    if (done) {
      document.title = "Mama Önerileri | Poodle'ınıza Özel | YourPoodle";
    } else {
      document.title = "Poodle Mama Bul | Kişisel Mama Önerisi | YourPoodle";
    }
    return () => { document.title = "YourPoodle"; };
  }, [done]);

  const buildPrefill = (): Answers => {
    if (!poodle) return {};
    const prefill: Answers = {};
    const ageValues = ["puppy", "adult", "senior"];
    if (poodle.age && ageValues.includes(poodle.age)) prefill.age = poodle.age;
    const weight = breedToWeight(poodle.breed);
    if (weight) prefill.weight = weight;
    return prefill;
  };

  const restart = () => {
    setStep(0); setAnswers(buildPrefill()); setDone(false); setSlideKey(0);
    savedRef.current = false; setHistoryLoaded(false);
  };

  // #33: Clear all history
  const clearAllHistory = async () => {
    if (!isLoggedIn) return;
    setClearingHistory(true);
    try {
      await fetch("/api/yp/recommendations", { method: "DELETE", credentials: "include" });
    } catch {}
    setClearingHistory(false);
  };

  const recommendations = useMemo(() => pickRecommendations(products, answers), [products, answers]);

  useEffect(() => {
    if (!done || !isLoggedIn || savedRef.current || recommendations.length === 0) return;
    savedRef.current = true;
    const serializedAnswers: Record<string, string> = {};
    for (const [k, v] of Object.entries(answers)) {
      serializedAnswers[k] = Array.isArray(v) ? v.join(",") : v;
    }
    const payload = {
      answers: serializedAnswers,
      products: recommendations.map(p => ({ id: p.id, name: p.name, price: p.price, matchPct: p.matchPct, reason: p.reason })),
    };
    fetch("/api/yp/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    }).catch(() => {});
  }, [done, isLoggedIn, recommendations, answers]);

  /* ── Shared inline styles ── */
  const pageStyle: React.CSSProperties = {
    minHeight: "100svh",
    background: "#F5F0E6",
    fontFamily: "'Inter', 'Plus Jakarta Sans', sans-serif",
    padding: "0 0 40px",
  };

  const cardStyle: React.CSSProperties = {
    maxWidth: 920, margin: "0 auto",
    background: "#fff", borderRadius: 28,
    boxShadow: "0 20px 60px rgba(123,63,228,0.08)",
    overflow: "hidden",
  };

  /* ── Result screen ── */
  if (done) {
    const resultCardStyle: React.CSSProperties = {
      background: "#fff", borderRadius: 20,
      boxShadow: "0 2px 20px rgba(0,0,0,0.07)", overflow: "hidden", marginBottom: 14,
    };
    return (
      <YPLayout activeLink="/yourpoodle/mama-bul">
        <div style={{ ...pageStyle, padding: "24px 16px 32px" }}>
          <div style={{ ...cardStyle, padding: 0 }}>
            {/* Header */}
            <div style={{
              background: "linear-gradient(135deg, #3D2612 0%, #5D3A1A 50%, #A67C52 100%)",
              padding: "32px 36px", position: "relative", overflow: "hidden", color: "#fff",
            }}>
              <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, opacity: 0.75, marginBottom: 8, textTransform: "uppercase" }}>✓ Analiz Tamamlandı</div>
              <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 8, lineHeight: 1.25 }}>
                Poodle'ınıza özel öneriler hazır! 🎉
              </div>
              <div style={{ fontSize: 13, opacity: 0.82, lineHeight: 1.55 }}>
                {getStr(answers, "age") === "puppy" ? "Yavru" : getStr(answers, "age") === "senior" ? "Yaşlı" : "Yetişkin"} profil ·{" "}
                {(() => {
                  const p = answers.protein;
                  const pArr = Array.isArray(p) ? p : (p ? [p] : []);
                  if (pArr.includes("any") || pArr.length === 0) return "esnek protein";
                  return pArr.map(pv => ({ chicken: "tavuklu", salmon: "somonlu", lamb: "kuzulu", rabbit: "tavşanlı" }[pv] || pv)).join(", ");
                })()} mama önerildi
              </div>
            </div>

            {/* Results */}
            <div style={{ padding: "24px 36px 36px" }}>
              {recommendations.length > 0 && recommendations.every(p => (p.score ?? 0) < 0) && (
                <div style={{ background: "#FFF7ED", borderRadius: 14, padding: "14px 16px", marginBottom: 16, fontSize: 13, color: "#C2410C", lineHeight: 1.6 }}>
                  <div style={{ fontWeight: 800, marginBottom: 4 }}>⚠️ Tam eşleşme bulunamadı</div>
                  Seçtiğiniz kısıtlamalara tam uyan bir ürün şu an mağazamızda yok. En yakın alternatifler listelenmiştir.
                </div>
              )}

              {/* #33: Clear history button */}
              {isLoggedIn && (
                <div style={{ textAlign: "right", marginBottom: 8 }}>
                  <button
                    onClick={clearAllHistory}
                    disabled={clearingHistory}
                    style={{ background: "none", border: "none", fontSize: 12, color: "#DC2626", cursor: clearingHistory ? "not-allowed" : "pointer", opacity: clearingHistory ? 0.5 : 1, fontFamily: "inherit", textDecoration: "underline" }}
                  >
                    {clearingHistory ? "Temizleniyor…" : "🗑 Geçmişi Temizle"}
                  </button>
                </div>
              )}

              {recommendations.length > 0 ? recommendations.map((prod, idx) => {
                const m = RESULT_META[idx];
                return (
                  <div key={prod.id} style={resultCardStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: m.bg, color: m.color, justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span>{m.emoji}</span>
                        <span style={{ fontSize: 12, fontWeight: 800 }}>{m.label}</span>
                      </div>
                      {(prod.matchPct ?? 0) > 0 && (
                        <span style={{ background: m.color, color: "#fff", borderRadius: 20, fontSize: 11, fontWeight: 800, padding: "2px 9px" }}>
                          %{Math.round(prod.matchPct ?? 0)} uyum
                        </span>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "16px 16px 0" }}>
                      <div
                        style={{ width: 80, height: 80, borderRadius: 16, background: "#F5F0E6", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, cursor: "pointer" }}
                        onClick={() => navigate(`/yourpoodle/urun/${prod.id}`)}
                      >
                        {prod.img
                          ? <img src={prod.img} alt={prod.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: "6px" }} />
                          : <span>🐾</span>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#2C2118", lineHeight: 1.4, marginBottom: 6, cursor: "pointer" }}
                             onClick={() => navigate(`/yourpoodle/urun/${prod.id}`)}>
                          {prod.name}
                        </div>
                        <div style={{ fontSize: 12, color: "#777", marginBottom: 10, lineHeight: 1.5 }}>{prod.reason || m.reason}</div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                          <span style={{ fontSize: 18, fontWeight: 900, color: m.color }}>₺{Number(prod.price).toLocaleString("tr-TR")}</span>
                          {prod.originalPrice && prod.originalPrice > prod.price && (
                            <span style={{ fontSize: 12, color: "#ccc", textDecoration: "line-through" }}>₺{Number(prod.originalPrice).toLocaleString("tr-TR")}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, padding: "12px 16px 16px" }}>
                      <button
                        onClick={() => navigate(`/yourpoodle/urun/${prod.id}`)}
                        style={{ flex: 1, height: 44, borderRadius: 12, background: "#F5F0E6", border: "none", fontSize: 13, fontWeight: 700, color: "#5D3A1A", cursor: "pointer", fontFamily: "inherit" }}
                      >
                        İncele
                      </button>
                      <button
                        onClick={() => {
                          const LS_CART = "yp_cart_items";
                          try {
                            const raw = localStorage.getItem(LS_CART);
                            const items: any[] = raw ? JSON.parse(raw) : [];
                            const idx = items.findIndex((i: any) => i.id === prod.id);
                            if (idx >= 0) { items[idx].qty += 1; }
                            else { items.push({ id: prod.id, name: prod.name, price: prod.price, img: prod.img ?? null, qty: 1 }); }
                            localStorage.setItem(LS_CART, JSON.stringify(items));
                          } catch {}
                          setAddedIds(prev => new Set(prev).add(prod.id));
                          setTimeout(() => setAddedIds(prev => { const s = new Set(prev); s.delete(prod.id); return s; }), 2000);
                        }}
                        style={{ flex: 1, height: 44, borderRadius: 12, border: "none", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "inherit", background: addedIds.has(prod.id) ? "#16A34A" : m.gradient, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "background 0.3s" }}
                      >
                        {addedIds.has(prod.id) ? <><span>✓</span> Eklendi</> : <><ShoppingCart size={14} /> Sepete Ekle</>}
                      </button>
                    </div>
                  </div>
                );
              }) : (
                <div style={{ textAlign: "center", padding: "48px 20px" }}>
                  <div style={{ fontSize: 52, marginBottom: 14 }}>🐾</div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: "#2C2118", marginBottom: 8 }}>Eşleşen mama bulunamadı</div>
                  <div style={{ fontSize: 13, color: "#999", lineHeight: 1.6 }}>
                    Seçtiğiniz kriterlere uygun, etiketlenmiş bir mama şu an mağazamızda yok.<br />
                    Ürünlere metadata eklendiğinde öneriler otomatik güncellenir.
                  </div>
                </div>
              )}

              <div style={{ background: "#FFF9C4", borderRadius: 14, padding: "14px 16px", fontSize: 12, color: "#92400E", lineHeight: 1.55, marginBottom: 16 }}>
                ⚠️ Bu öneriler genel profil bilgilerinize göre oluşturulmuştur. Özel sağlık sorunlarında veteriner hekiminize danışın.
              </div>

              <button
                onClick={restart}
                style={{
                  width: "100%", height: 50, borderRadius: 16,
                  background: "#EDE5D8", border: "none", fontSize: 15, fontWeight: 700,
                  color: "#5D3A1A", cursor: "pointer", fontFamily: "inherit",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                <RotateCcw size={16} /> Yeniden Başla
              </button>
            </div>
          </div>
        </div>
      </YPLayout>
    );
  }

  /* ── Wizard screen ── */
  const isCheckbox = currentStep.type === "checkbox";
  const isLastStep = step === STEPS.length - 1;
  const hasHero = currentStep.hasHero !== false;

  return (
    <YPLayout activeLink="/yourpoodle/mama-bul" hideFooter>

      <style>{`
        @keyframes yp-slide-in {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .yp-wizard-slide { animation: yp-slide-in 0.22s cubic-bezier(.4,0,.2,1) both; }
        @media (max-width: 899px) {
          .yp-hero-row { flex-direction: column !important; }
          .yp-hero-img { display: none !important; }
          .yp-options-grid { grid-template-columns: 1fr !important; }
          .yp-card-pad { padding: 20px 16px !important; }
          .yp-card-header { padding: 16px 16px 0 !important; }
          /* Hide in-card footer on mobile — replaced by fixed action bar */
          .yp-footer { display: none !important; }
          .yp-progress-tracker { display: none !important; }
          .yp-mobile-progress { display: block !important; }
          /* Fixed action bar visible only on mobile */
          .yp-wizard-cta-bar { display: flex !important; flex-direction: column; }
          /* Extra bottom pad so last option isn't hidden under the fixed bar */
          .yp-wizard-page-wrap { padding-bottom: 140px !important; }
        }
        @media (min-width: 900px) {
          .yp-mobile-progress { display: none !important; }
          .yp-wizard-cta-bar { display: none !important; }
        }
      `}</style>

      <div style={pageStyle} className="yp-wizard-page-wrap">
        {/* Page top padding */}
        <div style={{ height: 20 }} />

        <div style={{ padding: "0 16px" }}>
          <div style={cardStyle}>
            {/* Card header: step badge + progress tracker */}
            <div className="yp-card-header" style={{ padding: "24px 36px 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "#EDE5D8", borderRadius: 99, padding: "5px 14px",
                fontSize: 13, fontWeight: 700, color: "#5D3A1A",
              }}>
                <span>{currentStep.emoji}</span>
                Adım {step + 1} / {STEPS.length}
              </div>
              <div className="yp-progress-tracker">
                <ProgressTracker current={step} total={STEPS.length} />
              </div>
            </div>

            {/* Mobile thin progress bar */}
            <div className="yp-mobile-progress" style={{ margin: "12px 16px 0", height: 4, background: "#EDE5D8", borderRadius: 99 }}>
              <div style={{ height: 4, width: `${((step + 1) / STEPS.length) * 100}%`, background: "linear-gradient(90deg, #5D3A1A, #A67C52)", borderRadius: 99, transition: "width 0.4s" }} />
            </div>

            {/* #34: "Geçmişten yüklendi" notice */}
            {historyLoaded && (
              <div style={{ margin: "10px 24px 0", padding: "8px 14px", borderRadius: 10, background: "#EDE5D8", border: "1px solid #D4C4B0", fontSize: 12, color: "#3D2612", display: "flex", alignItems: "center", gap: 6 }}>
                <Info size={13} style={{ flexShrink: 0 }} />
                Geçmiş aramanızdan yüklendi — istediğiniz yanıtları değiştirebilirsiniz.
                <button onClick={() => setHistoryLoaded(false)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#5D3A1A", fontSize: 16, lineHeight: 1, padding: 0 }}>×</button>
              </div>
            )}

            {/* Step content */}
            <div className={`yp-wizard-slide yp-card-pad`} key={`step-${slideKey}`} style={{ padding: "28px 36px" }}>

              {hasHero ? (
                /* Hero layout: text left, poodle right */
                <div className="yp-hero-row" style={{ display: "flex", alignItems: "center", gap: 32, marginBottom: 28 }}>
                  <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: 28, fontWeight: 800, color: "#2C2118", margin: "0 0 10px", lineHeight: 1.25 }}>
                      {currentStep.question}
                      {(currentStep as any).questionBold && (
                        <em style={{ fontStyle: "normal", color: "#5D3A1A", borderBottom: "2px solid #D4C4B0" }}>
                          {(currentStep as any).questionBold}
                        </em>
                      )}
                      {(currentStep as any).question2 || ""}
                    </h2>
                    <p style={{ fontSize: 15, color: "#6B7280", margin: 0, lineHeight: 1.6 }}>{currentStep.hint}</p>
                  </div>
                  <div className="yp-hero-img">
                    <PoodleIllustration />
                  </div>
                </div>
              ) : (
                /* No-hero layout: centered text */
                <div style={{ marginBottom: 24 }}>
                  <h2 style={{ fontSize: 26, fontWeight: 800, color: "#2C2118", margin: "0 0 8px", lineHeight: 1.25 }}>
                    {currentStep.question}
                    {(currentStep as any).questionBold && (
                      <em style={{ fontStyle: "normal", color: "#5D3A1A", borderBottom: "2px solid #D4C4B0" }}>
                        {(currentStep as any).questionBold}
                      </em>
                    )}
                    {(currentStep as any).question2 || ""}
                  </h2>
                  <p style={{ fontSize: 15, color: "#6B7280", margin: 0, lineHeight: 1.6 }}>{currentStep.hint}</p>
                </div>
              )}

              {/* Info banner */}
              {currentStep.infoBanner && <InfoBanner text={currentStep.infoBanner} />}

              {/* Options grid */}
              <div
                className="yp-options-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: currentStep.options.length === 2 ? "1fr 1fr" : currentStep.options.length === 3 ? "1fr 1fr 1fr" : "1fr 1fr",
                  gap: 10,
                }}
              >
                {currentStep.options.map(opt => (
                  <OptionCard
                    key={opt.value}
                    opt={opt}
                    selected={isSelected(opt.value)}
                    onClick={() => handleSelect(opt.value)}
                    type={currentStep.type}
                  />
                ))}
              </div>

              {/* Step 11 tip banner */}
              {step === 10 && (
                <div style={{
                  display: "flex", alignItems: "flex-start", gap: 10,
                  background: "#F5F0E6", borderRadius: 12, padding: "14px 16px", marginTop: 14,
                  border: "1px solid #E5DDD0",
                }}>
                  <span style={{ fontSize: 18 }}>⭐</span>
                  <span style={{ fontSize: 12, color: "#3D2612", lineHeight: 1.6, fontWeight: 500 }}>
                    <strong>Önerimiz:</strong> 1–2 kg ve 3–5 kg paketleri dönüşümlü kullanarak hem tazeliği koruyabilir hem de ekonomik avantaj sağlayabilirsiniz.
                  </span>
                </div>
              )}
            </div>

            {/* Footer — desktop only (hidden on mobile via CSS) */}
            <div className="yp-footer" style={{ padding: "0 36px 32px" }}>
              <button
                disabled={!hasSelection}
                onClick={handleNext}
                style={{
                  width: "100%", height: 52, borderRadius: 9999,
                  background: hasSelection
                    ? "linear-gradient(135deg, #5D3A1A 0%, #A67C52 100%)"
                    : "#E2E2F0",
                  border: "none", fontSize: 16, fontWeight: 800,
                  color: hasSelection ? "#fff" : "#9CA3AF",
                  cursor: hasSelection ? "pointer" : "not-allowed",
                  fontFamily: "inherit",
                  boxShadow: hasSelection ? "0 6px 24px rgba(123,63,228,0.32)" : "none",
                  transition: "all 0.2s",
                  letterSpacing: "-0.2px",
                }}
              >
                {isLastStep ? "Sonuçları Gör →" : "Devam Et →"}
              </button>

              {step > 0 && (
                <div style={{ textAlign: "center", marginTop: 14 }}>
                  <button
                    onClick={handleBack}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      fontSize: 14, color: "#9CA3AF", fontFamily: "inherit",
                      display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 500,
                    }}
                  >
                    <ArrowLeft size={14} /> Geri dön
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile fixed CTA bar — sits above bottom nav, never covered ── */}
      <div
        className="yp-wizard-cta-bar"
        style={{
          display: "none", /* shown via CSS on mobile */
          position: "fixed",
          bottom: "calc(60px + env(safe-area-inset-bottom, 0px))",
          left: 0, right: 0,
          background: "#fff",
          borderTop: "1.5px solid #EDE5D8",
          boxShadow: "0 -4px 24px rgba(123,63,228,0.12)",
          padding: "12px 16px",
          zIndex: 210,
        }}
      >
        <button
          disabled={!hasSelection}
          onClick={handleNext}
          style={{
            width: "100%", height: 52, borderRadius: 9999,
            background: hasSelection
              ? "linear-gradient(135deg, #5D3A1A 0%, #A67C52 100%)"
              : "#E2E2F0",
            border: "none", fontSize: 16, fontWeight: 800,
            color: hasSelection ? "#fff" : "#9CA3AF",
            cursor: hasSelection ? "pointer" : "not-allowed",
            fontFamily: "inherit",
            boxShadow: hasSelection ? "0 6px 24px rgba(123,63,228,0.28)" : "none",
            transition: "all 0.2s",
            letterSpacing: "-0.2px",
          }}
        >
          {isLastStep ? "Sonuçları Gör →" : "Devam Et →"}
        </button>

        {step > 0 && (
          <button
            onClick={handleBack}
            style={{
              width: "100%", marginTop: 8, padding: "10px 0",
              background: "none", border: "none", cursor: "pointer",
              fontSize: 14, color: "#9CA3AF", fontFamily: "inherit",
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 6, fontWeight: 500, minHeight: 44,
            }}
          >
            <ArrowLeft size={14} /> Geri dön
          </button>
        )}
      </div>
    </YPLayout>
  );
}
