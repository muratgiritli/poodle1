import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Check, ShoppingCart, RotateCcw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import YPLayout from "@/components/yourpoodle/YPLayout";

const CSS = `
*, *::before, *::after { box-sizing: border-box; }

/* ── Page shell ── */
.mb-page { min-height: 100svh; background: #F5F0FF; font-family: 'Inter', sans-serif; display: flex; flex-direction: column; }

/* ── Top bar ── */
.mb-topbar {
  position: sticky; top: 0; z-index: 50;
  display: flex; align-items: center; gap: 14px;
  padding: 14px 18px 10px;
  background: transparent;
}
.mb-back-btn {
  width: 40px; height: 40px; border-radius: 50%;
  background: rgba(255,255,255,0.85); border: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(124,58,237,0.12);
  backdrop-filter: blur(8px);
}

/* ── Step dots ── */
.mb-stepdots { display: flex; gap: 5px; flex: 1; justify-content: center; }
.mb-dot {
  height: 5px; border-radius: 3px;
  background: rgba(124,58,237,0.18);
  transition: all 0.3s ease;
  flex: 1; max-width: 28px;
}
.mb-dot.done { background: #7C3AED; }
.mb-dot.active { background: #7C3AED; max-width: 40px; }

/* ── Progress bar ── */
.mb-progress-track { height: 3px; background: rgba(124,58,237,0.12); margin: 0 18px 0; border-radius: 99px; }
.mb-progress-fill { height: 3px; background: linear-gradient(90deg, #7C3AED, #A855F7); border-radius: 99px; transition: width 0.4s cubic-bezier(.4,0,.2,1); }

/* ── Question area ── */
.mb-question-wrap {
  padding: 28px 22px 8px;
  flex: 0 0 auto;
}
.mb-step-pill {
  display: inline-flex; align-items: center; gap: 5px;
  background: #EDE9FE; border-radius: 99px;
  padding: 4px 12px; font-size: 12px; font-weight: 700;
  color: #7C3AED; margin-bottom: 16px;
}
.mb-emoji { font-size: 36px; display: block; margin-bottom: 12px; line-height: 1; }
.mb-question {
  font-size: 24px; font-weight: 900; color: #18114a;
  line-height: 1.25; margin: 0 0 6px; letter-spacing: -0.5px;
}
.mb-hint { font-size: 13px; color: #9580CC; margin: 0; }

/* ── Options ── */
.mb-options-wrap { padding: 16px 18px 0; display: flex; flex-direction: column; gap: 10px; }
.mb-option {
  display: flex; align-items: center; gap: 14px;
  background: #fff; border: 2px solid transparent;
  border-radius: 18px; padding: 15px 16px;
  cursor: pointer; transition: all 0.18s ease;
  box-shadow: 0 1px 6px rgba(124,58,237,0.06);
  text-align: left; width: 100%;
  -webkit-tap-highlight-color: transparent;
}
.mb-option:active { transform: scale(0.98); }
.mb-option.selected {
  border-color: #7C3AED;
  background: linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%);
  box-shadow: 0 4px 20px rgba(124,58,237,0.32);
}
.mb-opt-icon {
  width: 46px; height: 46px; border-radius: 14px;
  background: #F5F0FF; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; transition: background 0.18s;
}
.mb-option.selected .mb-opt-icon { background: rgba(255,255,255,0.25); }
.mb-opt-label { flex: 1; font-size: 15px; font-weight: 700; color: #18114a; line-height: 1.3; }
.mb-opt-desc { font-size: 12px; color: #888; margin-top: 2px; }
.mb-option.selected .mb-opt-label { color: #fff; }
.mb-option.selected .mb-opt-desc { color: rgba(255,255,255,0.75); }
.mb-check-ring {
  width: 26px; height: 26px; border-radius: 50%;
  border: 2px solid #DDD; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.18s;
}
.mb-option.selected .mb-check-ring { background: rgba(255,255,255,0.3); border-color: rgba(255,255,255,0.5); }

/* ── Bottom CTA ── */
.mb-cta-wrap {
  position: sticky; bottom: 0;
  padding: 14px 18px calc(14px + env(safe-area-inset-bottom));
  background: linear-gradient(to top, #F5F0FF 60%, transparent);
  margin-top: auto;
}
.mb-btn-next {
  width: 100%; height: 56px; border-radius: 18px;
  background: linear-gradient(135deg, #7C3AED 0%, #A855F7 100%);
  border: none; font-size: 16px; font-weight: 800; color: #fff;
  cursor: pointer; font-family: 'Inter', sans-serif;
  box-shadow: 0 6px 24px rgba(124,58,237,0.38);
  transition: opacity 0.2s, transform 0.15s;
  letter-spacing: -0.2px;
}
.mb-btn-next:disabled {
  background: #DDD; box-shadow: none; cursor: not-allowed; color: #aaa;
}
.mb-btn-next:not(:disabled):active { transform: scale(0.98); }

/* ── Result screen ── */
.mb-result-hero {
  margin: 18px 18px 0;
  background: linear-gradient(135deg, #5B21B6 0%, #7C3AED 50%, #A855F7 100%);
  border-radius: 24px; padding: 24px 20px;
  color: #fff; position: relative; overflow: hidden;
}
.mb-result-hero::after {
  content: ''; position: absolute; top: -40px; right: -40px;
  width: 140px; height: 140px; border-radius: 50%;
  background: rgba(255,255,255,0.08);
}
.mb-result-cards { padding: 16px 18px 120px; display: flex; flex-direction: column; gap: 14px; }
.mb-result-card {
  background: #fff; border-radius: 22px;
  box-shadow: 0 2px 20px rgba(0,0,0,0.07);
  overflow: hidden;
}
.mb-card-badge {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 16px; font-size: 12px; font-weight: 800;
}
.mb-card-body { padding: 0 16px 16px; display: flex; gap: 14px; align-items: flex-start; }
.mb-card-img {
  width: 80px; height: 80px; border-radius: 16px;
  background: #F5F0FF; overflow: hidden; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; font-size: 32px;
}
.mb-card-actions { display: flex; gap: 8px; padding: 0 16px 16px; }
.mb-btn-detail {
  flex: 1; height: 44px; border-radius: 12px;
  background: #F5F0FF; border: none; font-size: 13px; font-weight: 700;
  color: #7C3AED; cursor: pointer; font-family: 'Inter', sans-serif;
}
.mb-btn-add {
  flex: 1; height: 44px; border-radius: 12px;
  border: none; font-size: 13px; font-weight: 700;
  color: #fff; cursor: pointer; font-family: 'Inter', sans-serif;
  display: flex; align-items: center; justify-content: center; gap: 6px;
}
.mb-restart {
  margin: 0 18px 20px; height: 50px; border-radius: 16px;
  background: #EDE9FE; border: none; font-size: 15px; font-weight: 700;
  color: #7C3AED; cursor: pointer; font-family: 'Inter', sans-serif;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: calc(100% - 36px);
}

/* ── Slide transition ── */
.mb-slide { animation: mbSlideIn 0.28s cubic-bezier(.4,0,.2,1) both; }
@keyframes mbSlideIn {
  from { opacity: 0; transform: translateX(28px); }
  to   { opacity: 1; transform: translateX(0); }
}

/* ── Desktop override ── */
@media (min-width: 900px) {
  .mb-topbar { display: none !important; }
  .mb-progress-track { display: none; }
  .mb-page { background: #F5F0FF; min-height: unset; }
  .mb-wizard-wrap {
    max-width: 680px; margin: 36px auto;
    background: #fff; border-radius: 28px;
    box-shadow: 0 8px 48px rgba(124,58,237,0.12);
    padding: 40px 44px; overflow: visible;
  }
  .mb-question-wrap { padding: 0 0 8px; }
  .mb-options-wrap { padding: 16px 0 0; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .mb-cta-wrap { position: static; padding: 24px 0 0; background: none; }
  .mb-btn-next { height: 52px; font-size: 15px; }
  .mb-result-hero { margin: 28px 0 0; }
  .mb-result-cards { padding: 16px 0 40px; }
  .mb-restart { margin: 0; width: 100%; }
}
`;

interface StepOption { value: string; label: string; desc?: string; icon?: string; }
interface Step { key: string; question: string; hint?: string; emoji: string; options: StepOption[]; }

const STEPS: Step[] = [
  {
    key: "age", emoji: "🐾",
    question: "Poodle'ınızın yaşı nedir?",
    hint: "Yaşa göre besin ihtiyacı farklılaşır",
    options: [
      { value: "puppy",  label: "Yavru (0–12 ay)",   desc: "Besin ihtiyacı yüksek, büyüme dönemi", icon: "🌱" },
      { value: "adult",  label: "Yetişkin (1–7 yaş)", desc: "Dengeli beslenme, enerji dengesi",      icon: "💪" },
      { value: "senior", label: "Yaşlı (7+ yaş)",     desc: "Eklem desteği, düşük kalori",          icon: "❤️" },
    ],
  },
  {
    key: "weight", emoji: "⚖️",
    question: "Poodle'ınızın kilosu?",
    hint: "Doğru porsiyon hesabı için önemli",
    options: [
      { value: "micro",    label: "1–2 kg",  desc: "Micro / Teacup", icon: "🫧" },
      { value: "toy",      label: "2–4 kg",  desc: "Toy Poodle",     icon: "🐩" },
      { value: "mini",     label: "4–9 kg",  desc: "Minyatür",       icon: "🐕" },
      { value: "standard", label: "9+ kg",   desc: "Standart",       icon: "🦮" },
    ],
  },
  {
    key: "neutered", emoji: "🏥",
    question: "Kısırlaştırıldı mı?",
    hint: "Kısır poodlelerin kalori ihtiyacı daha azdır",
    options: [
      { value: "yes", label: "Evet", desc: "Light / kısır formül önerilir", icon: "✅" },
      { value: "no",  label: "Hayır", desc: "Standart formül uygundur",     icon: "🔵" },
    ],
  },
  {
    key: "activity", emoji: "🏃",
    question: "Günlük aktivite seviyesi?",
    hint: "Aktif poodleler daha fazla kalori harcar",
    options: [
      { value: "low",    label: "Düşük",   desc: "Çoğunlukla evde, kısa yürüyüş", icon: "🛋️" },
      { value: "medium", label: "Orta",    desc: "Günlük 30–60 dk yürüyüş",       icon: "🚶" },
      { value: "high",   label: "Yüksek",  desc: "Aktif, uzun yürüyüşler",        icon: "🏃" },
    ],
  },
  {
    key: "weight_goal", emoji: "🎯",
    question: "Kilo hedefi var mı?",
    hint: "Buna göre kalori yoğunluğunu ayarlıyoruz",
    options: [
      { value: "lose",     label: "Kilo vermesi gerekiyor", icon: "📉" },
      { value: "maintain", label: "Kilosunu korusun",        icon: "⚖️" },
      { value: "gain",     label: "Biraz kilo alması lazım", icon: "📈" },
    ],
  },
  {
    key: "allergy", emoji: "🌿",
    question: "Bilinen alerjisi var mı?",
    hint: "Alerjen içerikli mamaları filtreliyoruz",
    options: [
      { value: "none",    label: "Yok / Bilmiyorum",  icon: "✅" },
      { value: "chicken", label: "Tavuk alerjisi",     icon: "🐔" },
      { value: "grain",   label: "Tahıl hassasiyeti",  icon: "🌾" },
      { value: "fish",    label: "Balık alerjisi",     icon: "🐟" },
      { value: "other",   label: "Farklı bir alerji",  icon: "⚠️" },
    ],
  },
  {
    key: "coat", emoji: "✨",
    question: "Tüy & deri durumu?",
    hint: "Omega yağ asitleri tüy kalitesini artırır",
    options: [
      { value: "none",     label: "Sağlıklı, sorun yok",  icon: "✨" },
      { value: "dull",     label: "Tüyleri mat / cansız",  icon: "😞" },
      { value: "scratch",  label: "Çok kaşınıyor",         icon: "🤚" },
      { value: "shedding", label: "Aşırı dökülüyor",       icon: "💇" },
    ],
  },
  {
    key: "digestion", emoji: "🫀",
    question: "Sindirim hassasiyeti var mı?",
    hint: "Hassas sindirim için özel formüller mevcuttur",
    options: [
      { value: "none",         label: "Yok, sorun yok",         icon: "✅" },
      { value: "sensitive",    label: "Zaman zaman mide sorunu", icon: "😣" },
      { value: "very_sensitive", label: "Çok hassas sindirim",   icon: "⚠️" },
    ],
  },
  {
    key: "protein", emoji: "🥩",
    question: "Tercih edilen protein?",
    hint: "Poodle'ınızın en iyi sindireceği kaynak",
    options: [
      { value: "chicken", label: "Tavuk",           icon: "🐔" },
      { value: "lamb",    label: "Kuzu",            icon: "🐑" },
      { value: "salmon",  label: "Somon / Balık",   icon: "🐟" },
      { value: "rabbit",  label: "Tavşan",          icon: "🐰" },
      { value: "any",     label: "Fark etmez",      icon: "🔀" },
    ],
  },
  {
    key: "budget", emoji: "💳",
    question: "Aylık mama bütçeniz?",
    hint: "Her bütçe için kaliteli seçenekler var",
    options: [
      { value: "economy", label: "₺500–1.000",  desc: "Ekonomik",       icon: "💰" },
      { value: "mid",     label: "₺1.000–2.000", desc: "Orta segment",  icon: "💳" },
      { value: "premium", label: "₺2.000+",      desc: "Premium",       icon: "⭐" },
    ],
  },
  {
    key: "package", emoji: "📦",
    question: "Tercih edilen paket boyutu?",
    hint: "Küçük paketler daha taze, büyükler daha ekonomik",
    options: [
      { value: "small",  label: "1–2 kg",   desc: "Taze kalır, değişiklik kolay",  icon: "📦" },
      { value: "medium", label: "3–5 kg",   desc: "Taze + ekonomik denge",         icon: "🗃️" },
      { value: "large",  label: "7–12 kg",  desc: "En ekonomik, depo gerektirir",  icon: "🏭" },
    ],
  },
];

const RESULT_META = [
  { label: "En Uygun Seçim", emoji: "🏆", color: "#7C3AED", bg: "#EDE9FE", gradient: "linear-gradient(135deg,#7C3AED,#8B5CF6)", reason: "Poodle'ınızın yaşı, kilosu ve ihtiyaçlarıyla birebir örtüşüyor." },
  { label: "Fiyat Performans", emoji: "💚", color: "#059669", bg: "#D1FAE5", gradient: "linear-gradient(135deg,#059669,#34D399)", reason: "Kaliteli içerik, makul fiyat. Uzun süreli kullanımda tasarruf sağlar." },
  { label: "Premium Seçim", emoji: "⭐", color: "#D97706", bg: "#FEF3C7", gradient: "linear-gradient(135deg,#D97706,#F59E0B)", reason: "En yüksek kalite standartları. İçerik açısından üstün formül." },
];

interface Product {
  id: number; name: string; price: number; img: string | null;
  originalPrice?: number; mamaType?: string; mamaMetadata?: any;
  score?: number; matchPct?: number; reason?: string;
}

/* ─── Scoring algorithm ─────────────────────────────────────── */
function scoreProduct(p: any, answers: Record<string, string>): number {
  let score = 50;
  const meta = p.mamaMetadata || {};

  // mamaType ↔ age: +30 match / -10 mismatch
  const ageMap: Record<string, string> = { puppy: "yavru", adult: "yetiskin", senior: "yasli" };
  const expectedType = ageMap[answers.age] || "";
  if (expectedType && p.mamaType) {
    score += p.mamaType === expectedType ? 30 : -10;
  }

  // proteinType ↔ protein: +20 match / -5 mismatch
  const protMap: Record<string, string> = { chicken: "tavuk", salmon: "somon", lamb: "kuzu", rabbit: "tavsan" };
  if (answers.protein && answers.protein !== "any" && meta.proteinType) {
    score += meta.proteinType === protMap[answers.protein] ? 20 : -5;
  } else if (answers.protein === "any") {
    score += 6;
  }

  // grainFree ↔ allergy grain: +15
  if (answers.allergy === "grain") {
    score += meta.grainFree === true ? 15 : -20;
  }

  // budgetTier ↔ budget: +15 match / tiered penalty
  const budgetMap: Record<string, string> = { economy: "ekonomik", mid: "orta", premium: "premium" };
  const tiers = ["ekonomik", "orta", "premium"];
  if (answers.budget && meta.budgetTier) {
    const expected = budgetMap[answers.budget] || "";
    if (meta.budgetTier === expected) score += 15;
    else {
      const diff = Math.abs(tiers.indexOf(meta.budgetTier) - tiers.indexOf(expected));
      score += diff === 1 ? -3 : -10;
    }
  }

  // breedSize ↔ weight: +10 match / -3 mismatch
  const weightBreed: Record<string, string[]> = { micro: ["toy"], toy: ["toy"], mini: ["miniature"], standard: ["standart"] };
  if (answers.weight && meta.breedSize) {
    const ok = weightBreed[answers.weight] || [];
    score += ok.includes(meta.breedSize) ? 10 : -3;
  }

  // allergen elimination: -100 (effectively removes)
  if (meta.allergens && answers.allergy && answers.allergy !== "none" && answers.allergy !== "other") {
    const allergyMap: Record<string, string[]> = { chicken: ["tavuk"], fish: ["balik", "somon"], grain: ["tahil", "bugday"] };
    const allergyTerms = allergyMap[answers.allergy] || [];
    const hasAllergen = meta.allergens.some((a: string) =>
      allergyTerms.some((t: string) => a.toLowerCase().includes(t))
    );
    if (hasAllergen) score -= 100;
  }

  // specialNeeds ↔ coat/digestion: +10
  if (meta.specialNeeds && Array.isArray(meta.specialNeeds)) {
    if ((answers.coat === "dull" || answers.coat === "shedding" || answers.coat === "scratch") &&
        meta.specialNeeds.some((n: string) => n.includes("tuy") || n.includes("deri"))) {
      score += 10;
    }
    if ((answers.digestion === "sensitive" || answers.digestion === "very_sensitive") &&
        meta.specialNeeds.some((n: string) => n.includes("sindirim") || n.includes("hassas"))) {
      score += 10;
    }
  }

  return score;
}

function buildReason(p: any, answers: Record<string, string>): string {
  const meta = p.mamaMetadata || {};
  const parts: string[] = [];
  const ageMatch = (answers.age === "puppy" && p.mamaType === "yavru") ||
                   (answers.age === "adult" && p.mamaType === "yetiskin") ||
                   (answers.age === "senior" && p.mamaType === "yasli");
  if (ageMatch) {
    const lbl = { puppy: "Yavru", adult: "Yetişkin", senior: "Yaşlı" }[answers.age] || "";
    parts.push(`${lbl} formülü`);
  }
  const protTR: Record<string, string> = { tavuk: "tavuklu", somon: "somonlu", kuzu: "kuzulu", tavsan: "tavşanlı" };
  if (meta.proteinType) parts.push(protTR[meta.proteinType] || meta.proteinType);
  if (meta.grainFree === true && answers.allergy === "grain") parts.push("tahılsız");
  if (meta.breedSize === "toy") parts.push("Toy boy'a uygun");
  return parts.length > 0 ? parts.join(" · ") : "Profilinize uygun seçim";
}

function pickRecommendations(products: any[], answers: Record<string, string>): Product[] {
  if (!products.length) return [];
  const scored = products.map(p => {
    const score = scoreProduct(p, answers);
    const matchPct = Math.min(98, Math.max(40, score));
    return { id: p.id, name: p.name, price: p.price, img: p.img, originalPrice: p.originalPrice,
             mamaType: p.mamaType, mamaMetadata: p.mamaMetadata, score, matchPct,
             reason: buildReason(p, answers) };
  });
  // Sort by score DESC, then price ASC for ties
  scored.sort((a, b) => b.score !== a.score ? b.score - a.score : a.price - b.price);
  // Allergen-disqualified products go last
  const eligible = scored.filter(p => (p.score ?? 0) >= 0);
  const ineligible = scored.filter(p => (p.score ?? 0) < 0);
  return [...eligible, ...ineligible].slice(0, 3);
}

function AgePath({ step, total }: { step: number; total: number }) {
  return (
    <div className="mb-stepdots">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`mb-dot ${i < step ? "done" : i === step ? "active" : ""}`} />
      ))}
    </div>
  );
}

export default function YPMamaBulPage() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [slideKey, setSlideKey] = useState(0);

  const { data: products = [] } = useQuery<any[]>({
    queryKey: ["/api/yp-products"],
    staleTime: 10 * 60 * 1000,
  });

  const currentStep = STEPS[step];
  const selected = answers[currentStep?.key];
  const progress = (step / STEPS.length) * 100;

  const handleSelect = (val: string) => setAnswers(a => ({ ...a, [currentStep.key]: val }));

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

  const restart = () => { setStep(0); setAnswers({}); setDone(false); setSlideKey(0); };
  const recommendations = useMemo(() => pickRecommendations(products, answers), [products, answers]);

  // ── Result screen ────────────────────────────────────────
  if (done) {
    return (
      <YPLayout activeLink="/yourpoodle/mama-bul">
        <title>Mama Önerileri | YourPoodle</title>
        <style>{CSS}</style>
        <div className="mb-page" style={{ minHeight: "unset" }}>
          {/* topbar */}
          <div className="mb-topbar">
            <button className="mb-back-btn" onClick={restart} aria-label="Yeniden başla">
              <ArrowLeft size={18} color="#7C3AED" />
            </button>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#7C3AED" }}>Öneriler</span>
          </div>

          {/* hero */}
          <div className="mb-result-hero">
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, opacity: 0.75, marginBottom: 6, textTransform: "uppercase" }}>✓ Analiz Tamamlandı</div>
            <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 8, lineHeight: 1.25, position: "relative", zIndex: 1 }}>
              Poodle'ınıza özel<br />öneriler hazır! 🎉
            </div>
            <div style={{ fontSize: 13, opacity: 0.82, lineHeight: 1.55, position: "relative", zIndex: 1 }}>
              {answers.age === "puppy" ? "Yavru" : answers.age === "senior" ? "Yaşlı" : "Yetişkin"} profil ·{" "}
              {answers.protein === "any" ? "esnek protein" : answers.protein === "chicken" ? "tavuklu" : answers.protein === "salmon" ? "somonlu" : answers.protein === "lamb" ? "kuzulu" : "tavşanlı"} mama önerildi
            </div>
          </div>

          {/* cards */}
          <div className="mb-result-cards">
            {/* No-match notice when allergen/constraint disqualifies everything */}
            {recommendations.length > 0 && recommendations.every(p => (p.score ?? 0) < 0) && (
              <div style={{ background: "#FFF7ED", borderRadius: 14, padding: "14px 16px", marginBottom: 4, fontSize: 13, color: "#C2410C", lineHeight: 1.6 }}>
                <div style={{ fontWeight: 800, marginBottom: 4 }}>⚠️ Tam eşleşme bulunamadı</div>
                Seçtiğiniz kısıtlamalara (alerji, protein tercihi vb.) tam uyan bir ürün şu an mağazamızda yok. Aşağıdaki en yakın alternatifler listelenmiştir — detaylar için ürün sayfasını inceleyin veya veterinerinize danışın.
              </div>
            )}
            {recommendations.length > 0 ? recommendations.map((prod, idx) => {
              const m = RESULT_META[idx];
              return (
                <div key={prod.id} className="mb-result-card">
                  <div className="mb-card-badge" style={{ background: m.bg, color: m.color, justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span>{m.emoji}</span>
                      <span>{m.label}</span>
                    </div>
                    {(prod.matchPct ?? 0) > 0 && (
                      <span style={{ background: m.color, color: "#fff", borderRadius: 20, fontSize: 11, fontWeight: 800, padding: "2px 9px" }}>
                        %{Math.round(prod.matchPct ?? 0)} uyum
                      </span>
                    )}
                  </div>
                  <div className="mb-card-body">
                    <div className="mb-card-img" style={{ cursor: "pointer" }} onClick={() => navigate(`/yourpoodle/urun/${prod.id}`)}>
                      {prod.img
                        ? <img src={prod.img} alt={prod.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: "6px" }} />
                        : <span>🐾</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#18114a", lineHeight: 1.4, marginBottom: 6, cursor: "pointer" }}
                           onClick={() => navigate(`/yourpoodle/urun/${prod.id}`)}>{prod.name}</div>
                      <div style={{ fontSize: 12, color: "#777", marginBottom: 10, lineHeight: 1.5 }}>
                        {prod.reason || m.reason}
                      </div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                        <span style={{ fontSize: 18, fontWeight: 900, color: m.color }}>₺{Number(prod.price).toLocaleString("tr-TR")}</span>
                        {prod.originalPrice && prod.originalPrice > prod.price && (
                          <span style={{ fontSize: 12, color: "#ccc", textDecoration: "line-through" }}>₺{Number(prod.originalPrice).toLocaleString("tr-TR")}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mb-card-actions">
                    <button className="mb-btn-detail" onClick={() => navigate(`/yourpoodle/urun/${prod.id}`)}>İncele</button>
                    <button className="mb-btn-add" style={{ background: m.gradient }} onClick={() => navigate(`/yourpoodle/urun/${prod.id}`)}>
                      <ShoppingCart size={14} /> Sepete Ekle
                    </button>
                  </div>
                </div>
              );
            }) : (
              <div style={{ textAlign: "center", padding: "48px 20px" }}>
                <div style={{ fontSize: 52, marginBottom: 14 }}>🐾</div>
                <div style={{ fontSize: 17, fontWeight: 800, color: "#18114a", marginBottom: 8 }}>Öneri hazırlanıyor</div>
                <div style={{ fontSize: 13, color: "#999" }}>Ürünler yükleniyor, lütfen bekleyin.</div>
              </div>
            )}

            <div style={{ background: "#FFF9C4", borderRadius: 16, padding: "14px 16px", fontSize: 12, color: "#92400E", lineHeight: 1.55 }}>
              ⚠️ Bu öneriler genel profil bilgilerinize göre oluşturulmuştur. Özel sağlık sorunlarında veteriner hekiminize danışın.
            </div>

            <button className="mb-restart" onClick={restart}>
              <RotateCcw size={16} /> Yeniden Ara
            </button>
          </div>
        </div>
      </YPLayout>
    );
  }

  // ── Wizard screen ────────────────────────────────────────
  return (
    <YPLayout activeLink="/yourpoodle/mama-bul">
      <title>Poodle Mama Bul | Kişiselleştirilmiş Mama Öneri Sihirbazı | YourPoodle</title>
      <meta name="description" content="Poodle'ınıza özel mama önerisi. Yaş, kilo, sağlık durumu ve bütçenize göre en uygun mama markasını bulun." />
      <meta property="og:title" content="Poodle Mama Bul | YourPoodle" />
      <meta property="og:type" content="website" />
      <meta name="robots" content="index, follow" />
      <style>{CSS}</style>

      <div className="mb-page" style={{ minHeight: "unset" }}>
        {/* Top bar */}
        <div className="mb-topbar">
          <button className="mb-back-btn" onClick={handleBack} aria-label="Geri">
            <ArrowLeft size={18} color="#7C3AED" />
          </button>
          <AgePath step={step} total={STEPS.length} />
          <div style={{ width: 40, flexShrink: 0 }} />
        </div>

        {/* Progress bar */}
        <div className="mb-progress-track">
          <div className="mb-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="mb-wizard-wrap">
          {/* Question */}
          <div className="mb-question-wrap mb-slide" key={`q-${slideKey}`}>
            <span className="mb-step-pill">Adım {step + 1} / {STEPS.length}</span>
            <span className="mb-emoji">{currentStep.emoji}</span>
            <h2 className="mb-question">{currentStep.question}</h2>
            {currentStep.hint && <p className="mb-hint">{currentStep.hint}</p>}
          </div>

          {/* Options */}
          <div className="mb-options-wrap mb-slide" key={`o-${slideKey}`}>
            {currentStep.options.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`mb-option ${selected === opt.value ? "selected" : ""}`}
                aria-pressed={selected === opt.value}
              >
                {opt.icon && <div className="mb-opt-icon">{opt.icon}</div>}
                <div style={{ flex: 1 }}>
                  <div className="mb-opt-label">{opt.label}</div>
                  {opt.desc && <div className="mb-opt-desc">{opt.desc}</div>}
                </div>
                <div className="mb-check-ring">
                  {selected === opt.value && <Check size={13} color="#fff" strokeWidth={3} />}
                </div>
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="mb-cta-wrap">
            <button
              className="mb-btn-next"
              disabled={!selected}
              onClick={handleNext}
            >
              {step === STEPS.length - 1 ? "Önerileri Gör 🎉" : "Devam Et →"}
            </button>
          </div>
        </div>
      </div>
    </YPLayout>
  );
}
