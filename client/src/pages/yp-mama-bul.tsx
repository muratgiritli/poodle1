import { useState, useEffect, useMemo, useRef } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Check, ShoppingCart, RotateCcw, Info } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { useCustomer } from "@/contexts/CustomerContext";
import { useCart } from "@/contexts/CartContext";

/* ─── Types ──────────────────────────────────────────────────── */
interface StepOption { value: string; label: string; desc?: string; icon?: string; }
type StepType = "radio" | "checkbox";
interface StepGroup {
  key: string;
  type: StepType;
  label: string;
  options: StepOption[];
}
interface Step {
  emoji: string;
  title: string;
  hint: string;
  groups: StepGroup[];
}

/* ─── Step config (4 compact steps) ──────────────────────────── */
const STEPS: Step[] = [
  {
    emoji: "🐾",
    title: "Yaş & boyut",
    hint: "Besin ihtiyacı ve porsiyon için temel profil.",
    groups: [
      {
        key: "age", type: "radio", label: "Yaş",
        options: [
          { value: "puppy",  label: "Yavru",    desc: "0–12 ay", icon: "🌱" },
          { value: "adult",  label: "Yetişkin", desc: "1–7 yaş", icon: "💪" },
          { value: "senior", label: "Yaşlı",    desc: "7+ yaş",  icon: "❤️" },
        ],
      },
      {
        key: "weight", type: "radio", label: "Kilo",
        options: [
          { value: "micro",    label: "1–2 kg", desc: "Micro",     icon: "🫧" },
          { value: "toy",      label: "2–4 kg", desc: "Toy",       icon: "🐩" },
          { value: "mini",     label: "4–9 kg", desc: "Minyatür",  icon: "🐕" },
          { value: "standard", label: "9+ kg",  desc: "Standart",  icon: "🦮" },
        ],
      },
    ],
  },
  {
    emoji: "🏃",
    title: "Yaşam tarzı",
    hint: "Kalori ihtiyacını netleştiriyoruz.",
    groups: [
      {
        key: "neutered", type: "radio", label: "Kısırlaştırıldı mı?",
        options: [
          { value: "yes", label: "Evet",  icon: "✅" },
          { value: "no",  label: "Hayır", icon: "🔵" },
        ],
      },
      {
        key: "activity", type: "radio", label: "Aktivite",
        options: [
          { value: "low",    label: "Düşük",  icon: "🛋️" },
          { value: "medium", label: "Orta",   icon: "🚶" },
          { value: "high",   label: "Yüksek", icon: "🏃" },
        ],
      },
      {
        key: "weight_goal", type: "radio", label: "Kilo hedefi",
        options: [
          { value: "lose",     label: "Versin",  icon: "📉" },
          { value: "maintain", label: "Korusun", icon: "⚖️" },
          { value: "gain",     label: "Alsın",   icon: "📈" },
        ],
      },
    ],
  },
  {
    emoji: "🌿",
    title: "Sağlık",
    hint: "Alerji ve hassasiyetleri filtreleriz.",
    groups: [
      {
        key: "allergy", type: "radio", label: "Alerji",
        options: [
          { value: "none",    label: "Yok",   icon: "✅" },
          { value: "chicken", label: "Tavuk", icon: "🐔" },
          { value: "grain",   label: "Tahıl", icon: "🌾" },
          { value: "fish",    label: "Balık", icon: "🐟" },
          { value: "other",   label: "Diğer", icon: "⚠️" },
        ],
      },
      {
        key: "digestion", type: "radio", label: "Sindirim",
        options: [
          { value: "none",           label: "Normal",  icon: "✅" },
          { value: "sensitive",      label: "Hassas",  icon: "🤢" },
          { value: "very_sensitive", label: "Çok hassas", icon: "⚠️" },
        ],
      },
      {
        key: "coat", type: "radio", label: "Tüy & deri",
        options: [
          { value: "none",     label: "İyi",     icon: "✨" },
          { value: "dull",     label: "Mat",     icon: "😔" },
          { value: "scratch",  label: "Kaşıntı", icon: "🤚" },
          { value: "shedding", label: "Dökülme", icon: "💇" },
        ],
      },
    ],
  },
  {
    emoji: "💳",
    title: "Tercihler",
    hint: "Birden fazla seçebilirsin.",
    groups: [
      {
        key: "protein", type: "checkbox", label: "Protein",
        options: [
          { value: "chicken", label: "Tavuk",  icon: "🐔" },
          { value: "lamb",    label: "Kuzu",   icon: "🐑" },
          { value: "salmon",  label: "Somon",  icon: "🐟" },
          { value: "rabbit",  label: "Tavşan", icon: "🐰" },
          { value: "any",     label: "Fark etmez", icon: "🔀" },
        ],
      },
      {
        key: "budget", type: "checkbox", label: "Bütçe",
        options: [
          { value: "economy", label: "₺500–1K",  icon: "💰" },
          { value: "mid",     label: "₺1–2K",    icon: "💳" },
          { value: "premium", label: "₺2K+",     icon: "⭐" },
        ],
      },
      {
        key: "package", type: "checkbox", label: "Paket",
        options: [
          { value: "small",  label: "1–2 kg",  icon: "📦" },
          { value: "medium", label: "3–5 kg",  icon: "🗃️" },
          { value: "large",  label: "7–12 kg", icon: "🏭" },
        ],
      },
    ],
  },
];

const CHECKBOX_KEYS = new Set(
  STEPS.flatMap(s => s.groups.filter(g => g.type === "checkbox").map(g => g.key)),
);

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

function pickRecommendations(products: any[], answers: Answers, rules: any[] = []): Product[] {
  if (!products.length) return [];
  // Only consider products that have been tagged with food metadata — this
  // ensures non-food products (accessories, supplements without metadata) don't
  // crowd out proper matches, and any new admin-seeded product automatically
  // joins the candidate pool without extra steps.
  const candidates = products.filter(p => p.mamaMetadata != null);
  if (!candidates.length) return [];
  const scored = candidates.map(p => {
    let score = scoreProduct(p, answers);
    for (const rule of rules) {
      if (!rule || rule.active === false) continue;
      const ids = Array.isArray(rule.productIds) ? rule.productIds.map(Number) : [];
      if (ids.includes(Number(p.id))) {
        score += Number(rule.boost) || 0;
      } else if (rule.match && typeof rule.match === "object") {
        let ok = true;
        for (const [k, v] of Object.entries(rule.match)) {
          if (v == null || v === "") continue;
          const ans = getStr(answers, k);
          if (ans && String(ans) !== String(v)) { ok = false; break; }
        }
        if (ok && Object.keys(rule.match).length > 0) score += Number(rule.boost) || 0;
      }
    }
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

/* ─── Compact option chip ────────────────────────────────────── */
function OptionChip({
  opt, selected, onClick, type,
}: {
  opt: StepOption; selected: boolean; onClick: () => void; type: StepType;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      style={{
        display: "flex", alignItems: "center", gap: 4,
        background: selected ? "#FAF7F0" : "#fff",
        border: `1px solid ${selected ? "#5D3A1A" : "#E8E0D4"}`,
        borderRadius: 8, padding: "4px 5px",
        cursor: "pointer", textAlign: "left", width: "100%",
        maxWidth: "100%", minWidth: 0, minHeight: 32,
        boxSizing: "border-box", overflow: "hidden",
        transition: "all 0.15s ease",
        WebkitTapHighlightColor: "transparent",
        fontFamily: "inherit",
      }}
    >
      {opt.icon && (
        <span style={{
          width: 18, height: 18, borderRadius: 5, flexShrink: 0,
          background: selected ? "#EDE5D8" : "#F7F3EC",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 10,
        }}>
          {opt.icon}
        </span>
      )}
      <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
        <div style={{
          fontSize: 11, fontWeight: 700, color: selected ? "#3D2612" : "#2C2118",
          lineHeight: 1.15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {opt.label}
        </div>
        {opt.desc && (
          <div style={{
            fontSize: 9, color: "#8A8076", lineHeight: 1.1, marginTop: 0,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{opt.desc}</div>
        )}
      </div>
      <div style={{
        width: 13, height: 13, flexShrink: 0,
        borderRadius: type === "radio" ? "50%" : 3,
        border: `1.5px solid ${selected ? "#5D3A1A" : "#D1D5DB"}`,
        background: selected ? "#5D3A1A" : "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {selected && <Check size={7} color="#fff" strokeWidth={3} />}
      </div>
    </button>
  );
}

/* ─── Main component ─────────────────────────────────────────── */
export default function YPMamaBulPage() {
  const [, navigate] = useLocation();
  const { isLoggedIn, isLoading: authLoading } = useCustomer();
  const { updateQty } = useCart();
  const [answers, setAnswers] = useState<Answers>({});
  const [done, setDone] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false); // #34: notice
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set()); // direct add-to-cart feedback
  const [clearingHistory, setClearingHistory] = useState(false); // #33: loading state
  const savedRef = useRef(false);
  const prefillApplied = useRef(false);
  const historyApplied = useRef(false);

  // Keys for checkbox-type steps — stored as comma-joined strings in the DB
  // (module-level CHECKBOX_KEYS)

  const { data: products = [] } = useQuery<any[]>({
    queryKey: ["/api/yp-products"],
    staleTime: 10 * 60 * 1000,
  });

  const { data: mamaRules = [] } = useQuery<any[]>({
    queryKey: ["/api/mama-bul/rules"],
    staleTime: 60_000,
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

  const handleSelect = (group: StepGroup, val: string) => {
    if (group.type === "radio") {
      setAnswers(a => ({ ...a, [group.key]: val }));
    } else {
      setAnswers(a => {
        const prev = a[group.key];
        const arr: string[] = Array.isArray(prev) ? [...prev] : (prev ? [prev as string] : []);
        const idx = arr.indexOf(val);
        if (idx >= 0) arr.splice(idx, 1);
        else arr.push(val);
        return { ...a, [group.key]: arr };
      });
    }
  };

  const isSelected = (group: StepGroup, val: string): boolean => {
    const v = answers[group.key];
    if (!v) return false;
    if (Array.isArray(v)) return v.includes(val);
    return v === val;
  };

  const allGroups = STEPS.flatMap(s => s.groups);
  const hasSelection = allGroups.every(g => hasAnswer(answers, g.key));

  const scrollTop = () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const showResults = () => {
    setDone(true);
    import("@/lib/yp-analytics").then(({ track }) => {
      track("food_finder_complete", { answers });
    }).catch(() => {});
    // Form en alttaydı — sonuçların başı görünsün
    requestAnimationFrame(scrollTop);
    setTimeout(scrollTop, 50);
  };

  // Correct page-specific document title — overrides static index.html title
  useEffect(() => {
    if (done) {
      document.title = "Mama Önerileri | Poodle'ınıza Özel | YourPoodle";
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } else {
      document.title = "Poodle Mama Bul | Kişisel Mama Önerisi | YourPoodle";
    }
    return () => { document.title = "YourPoodle"; };
  }, [done]);

  useEffect(() => {
    import("@/lib/yp-analytics").then(({ track }) => track("food_finder_start")).catch(() => {});
  }, []);

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
    setAnswers(buildPrefill()); setDone(false);
    savedRef.current = false; setHistoryLoaded(false);
    requestAnimationFrame(scrollTop);
    setTimeout(scrollTop, 50);
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

  const recommendations = useMemo(() => pickRecommendations(products, answers, mamaRules), [products, answers, mamaRules]);

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
    width: "100%",
    maxWidth: "100%",
    overflowX: "hidden",
    boxSizing: "border-box",
  };

  const cardStyle: React.CSSProperties = {
    maxWidth: 560, margin: "0 auto",
    width: "100%",
    background: "#fff", borderRadius: 20,
    boxShadow: "0 8px 28px rgba(93,58,26,0.08)",
    overflow: "hidden",
    boxSizing: "border-box",
  };

  /* ── Result screen ── */
  if (done) {
    const resultCardStyle: React.CSSProperties = {
      background: "#fff", borderRadius: 20,
      boxShadow: "0 2px 20px rgba(0,0,0,0.07)", overflow: "hidden", marginBottom: 14,
    };
    return (
      <YPLayout activeLink="/yourpoodle/mama-bul" hideFooter>
        <style>{`
          .yp-mama-results-wrap, .yp-mama-results-wrap * { box-sizing: border-box; }
          .yp-mama-results-wrap { width: 100%; max-width: 100%; overflow-x: hidden; }
        `}</style>
        <div className="yp-mama-results-wrap" style={{ ...pageStyle, padding: "16px 12px 32px" }}>
          <div style={{ ...cardStyle, padding: 0 }}>
            {/* Header */}
            <div style={{
              background: "linear-gradient(135deg, #3D2612 0%, #5D3A1A 50%, #A67C52 100%)",
              padding: "20px 18px 18px", position: "relative", overflow: "hidden", color: "#fff",
            }}>
              <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 8, position: "relative", zIndex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, opacity: 0.75, textTransform: "uppercase" }}>✓ Analiz Tamamlandı</div>
                <button
                  type="button"
                  onClick={restart}
                  style={{
                    flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 5,
                    background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.35)",
                    borderRadius: 999, padding: "6px 12px", color: "#fff",
                    fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  <RotateCcw size={13} /> Yeni arama
                </button>
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 6, lineHeight: 1.25, position: "relative", zIndex: 1 }}>
                Poodle'ınıza özel öneriler hazır!
              </div>
              <div style={{ fontSize: 13, opacity: 0.82, lineHeight: 1.55, position: "relative", zIndex: 1 }}>
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
            <div style={{ padding: "16px 14px 28px" }}>
              <button
                type="button"
                onClick={restart}
                style={{
                  width: "100%", height: 42, borderRadius: 12, marginBottom: 14,
                  background: "#EDE5D8", border: "1px solid #D4C4B0",
                  fontSize: 13, fontWeight: 700, color: "#5D3A1A",
                  cursor: "pointer", fontFamily: "inherit",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                }}
              >
                <RotateCcw size={14} /> Kriterleri değiştir · Yeni arama
              </button>

              {recommendations.length > 0 && recommendations.every(p => (p.score ?? 0) < 0) && (
                <div style={{ background: "#FFF7ED", borderRadius: 14, padding: "14px 16px", marginBottom: 16, fontSize: 13, color: "#C2410C", lineHeight: 1.6 }}>
                  <div style={{ fontWeight: 800, marginBottom: 4 }}>⚠️ Tam eşleşme bulunamadı</div>
                  Seçtiğiniz kısıtlamalara tam uyan bir ürün şu an mağazamızda yok. En yakın alternatifler listelenmiştir.
                </div>
              )}

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
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "14px 12px 0", maxWidth: "100%" }}>
                      <div
                        style={{ width: 72, height: 72, borderRadius: 14, background: "#F5F0E6", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, cursor: "pointer" }}
                        onClick={() => navigate(`/yourpoodle/urun/${prod.id}`)}
                      >
                        {prod.img
                          ? <img src={prod.img} alt={prod.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: "6px" }} />
                          : <span>🐾</span>}
                      </div>
                      <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#2C2118", lineHeight: 1.4, marginBottom: 6, cursor: "pointer", wordBreak: "break-word" }}
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
                          updateQty(String(prod.id), 1);
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
                type="button"
                onClick={restart}
                style={{
                  width: "100%", height: 46, borderRadius: 14,
                  background: "#EDE5D8", border: "1px solid #D4C4B0", fontSize: 14, fontWeight: 700,
                  color: "#5D3A1A", cursor: "pointer", fontFamily: "inherit",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                <RotateCcw size={15} /> Yeni arama yap
              </button>
            </div>
          </div>
        </div>
      </YPLayout>
    );
  }

  /* ── Single-page form ── */
  return (
    <YPLayout activeLink="/yourpoodle/mama-bul" hideFooter>
      <style>{`
        .yp-mama-form-wrap, .yp-mama-form-wrap * { box-sizing: border-box; }
        .yp-mama-form-wrap {
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
          padding-bottom: calc(88px + env(safe-area-inset-bottom, 0px));
        }
        .yp-mama-inner {
          width: 100%;
          max-width: 100%;
          padding: 0 10px;
          overflow-x: hidden;
        }
        .yp-opt-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 4px;
          width: 100%;
          max-width: 100%;
        }
        .yp-opt-grid > * { min-width: 0; max-width: 100%; }
        /* Dar ekranda 3 sütun taşmasın — 2'ye düş */
        .yp-opt-grid.cols-3,
        .yp-opt-grid.cols-5 {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        @media (min-width: 380px) {
          .yp-opt-grid.cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .yp-opt-grid.cols-5 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
        .yp-mama-section {
          width: 100%;
          max-width: 100%;
          overflow: hidden;
        }
        .yp-mama-cta-bar {
          width: 100%;
          max-width: 100%;
          left: 0;
          right: 0;
          box-sizing: border-box;
        }
        @media (max-width: 899px) {
          .yp-mama-desktop-cta { display: none !important; }
        }
        @media (min-width: 900px) {
          .yp-mama-cta-bar { display: none !important; }
          .yp-mama-form-wrap { padding-bottom: 32px !important; }
        }
      `}</style>

      <div style={{ ...pageStyle, padding: "0 0 24px" }} className="yp-mama-form-wrap">
        <div style={{ height: 8 }} />
        <div className="yp-mama-inner">
          <div style={{ ...cardStyle, borderRadius: 16, boxShadow: "0 4px 16px rgba(93,58,26,0.06)" }}>
            <div style={{ padding: "12px 14px 0" }}>
              <h1 style={{ fontSize: 17, fontWeight: 800, color: "#2C2118", margin: "0 0 2px", lineHeight: 1.25 }}>
                Mama Bul
              </h1>
              <p style={{ fontSize: 12, color: "#6B7280", margin: 0, lineHeight: 1.4 }}>
                Tüm soruları tek sayfada yanıtla, hemen önerileri gör.
              </p>
            </div>

            {historyLoaded && (
              <div style={{ margin: "10px 14px 0", padding: "6px 10px", borderRadius: 8, background: "#EDE5D8", border: "1px solid #D4C4B0", fontSize: 11, color: "#3D2612", display: "flex", alignItems: "center", gap: 6 }}>
                <Info size={12} style={{ flexShrink: 0 }} />
                Geçmiş aramanız yüklendi.
                <button type="button" onClick={() => setHistoryLoaded(false)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#5D3A1A", fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
              </div>
            )}

            <div style={{ padding: "10px 10px 12px", width: "100%", overflow: "hidden" }}>
              {STEPS.map((section) => (
                <section
                  key={section.title}
                  className="yp-mama-section"
                  style={{
                    marginBottom: 10,
                    padding: "8px 8px 6px",
                    background: "#FAF7F0",
                    border: "1px solid #EDE5D8",
                    borderRadius: 12,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 2, minWidth: 0 }}>
                    <span style={{ fontSize: 13, flexShrink: 0 }}>{section.emoji}</span>
                    <h2 style={{ fontSize: 13, fontWeight: 800, color: "#2C2118", margin: 0, lineHeight: 1.2, minWidth: 0 }}>
                      {section.title}
                    </h2>
                  </div>
                  <p style={{ fontSize: 10.5, color: "#8A8076", margin: "0 0 6px", lineHeight: 1.35, wordBreak: "break-word" }}>
                    {section.hint}
                  </p>
                  {section.groups.map(group => {
                    const cols =
                      group.options.length === 2 ? "" :
                      group.options.length === 3 ? "cols-3" :
                      group.options.length >= 5 ? "cols-5" : "";
                    return (
                      <div key={group.key} style={{ marginBottom: 4, width: "100%", maxWidth: "100%", overflow: "hidden" }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#8A8076", margin: "4px 0 3px", letterSpacing: 0.2 }}>
                          {group.label}{group.type === "checkbox" ? " · çoklu" : ""}
                        </div>
                        <div className={`yp-opt-grid ${cols}`}>
                          {group.options.map(opt => (
                            <OptionChip
                              key={opt.value}
                              opt={opt}
                              selected={isSelected(group, opt.value)}
                              onClick={() => handleSelect(group, opt.value)}
                              type={group.type}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </section>
              ))}
            </div>

            <div className="yp-mama-desktop-cta" style={{ padding: "0 14px 14px" }}>
              <button
                type="button"
                disabled={!hasSelection}
                onClick={showResults}
                style={{
                  width: "100%", height: 44, borderRadius: 9999,
                  background: hasSelection
                    ? "linear-gradient(135deg, #5D3A1A 0%, #A67C52 100%)"
                    : "#E8E0D4",
                  border: "none", fontSize: 14, fontWeight: 800,
                  color: hasSelection ? "#fff" : "#9CA3AF",
                  cursor: hasSelection ? "pointer" : "not-allowed",
                  fontFamily: "inherit",
                }}
              >
                Sonuçları Gör →
              </button>
              <div style={{ textAlign: "center", marginTop: 8 }}>
                <button type="button" onClick={() => navigate("/yourpoodle")}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#9CA3AF", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 4, fontWeight: 500 }}>
                  <ArrowLeft size={12} /> Ana sayfa
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="yp-mama-cta-bar"
        style={{
          display: "flex",
          position: "fixed",
          bottom: "calc(60px + env(safe-area-inset-bottom, 0px))",
          left: 0,
          right: 0,
          width: "100%",
          maxWidth: "100%",
          background: "#fff",
          borderTop: "1px solid #EDE5D8",
          boxShadow: "0 -4px 18px rgba(93,58,26,0.08)",
          padding: "8px 12px",
          zIndex: 210,
          boxSizing: "border-box",
        }}
      >
        <button
          type="button"
          disabled={!hasSelection}
          onClick={showResults}
          style={{
            width: "100%", maxWidth: "100%", height: 44, borderRadius: 9999,
            background: hasSelection
              ? "linear-gradient(135deg, #5D3A1A 0%, #A67C52 100%)"
              : "#E8E0D4",
            border: "none", fontSize: 14, fontWeight: 800,
            color: hasSelection ? "#fff" : "#9CA3AF",
            cursor: hasSelection ? "pointer" : "not-allowed",
            fontFamily: "inherit",
            boxSizing: "border-box",
          }}
        >
          Sonuçları Gör →
        </button>
      </div>
    </YPLayout>
  );
}
