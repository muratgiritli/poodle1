import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, ChevronRight, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import YPLayout from "@/components/yourpoodle/YPLayout";

const CSS = `
*, *::before, *::after { box-sizing: border-box; }
body { background: #fff; margin: 0; }
.mb-page { min-height: 100vh; background: #F8F7FF; font-family: 'Inter', sans-serif; }
.mb-header { position: sticky; top: 0; z-index: 100; background: #fff; border-bottom: 1px solid #f0f0f0; padding: 12px 16px; display: flex; align-items: center; gap: 12px; }
.mb-progress { height: 4px; background: #E8E4FF; border-radius: 2px; margin: 0 16px 20px; }
.mb-progress-fill { height: 4px; background: linear-gradient(90deg, #7C3AFF, #A855F7); border-radius: 2px; transition: width 0.3s ease; }
.mb-content { padding: 0 16px 24px; }
.mb-option { display: flex; align-items: center; gap: 14px; background: #fff; border: 2px solid transparent; border-radius: 16px; padding: 15px 16px; margin-bottom: 10px; cursor: pointer; transition: all 0.15s; }
.mb-option.selected { border-color: #7C3AFF; background: #F5F0FF; }
.mb-option-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
.mb-option-text { flex: 1; }
.mb-option-label { font-size: 14px; font-weight: 700; color: #1a1a1a; margin-bottom: 2px; }
.mb-option-desc { font-size: 12px; color: #888; }
.mb-check { width: 24px; height: 24px; border-radius: 50%; border: 2px solid #ddd; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.15s; }
.mb-option.selected .mb-check { background: #7C3AFF; border-color: #7C3AFF; }
.mb-nav { display: flex; gap: 10px; margin-top: 20px; }
.mb-btn-back { flex: 0 0 auto; height: 52px; padding: 0 20px; border-radius: 14px; background: #F5F5F5; border: none; font-size: 15px; font-weight: 700; color: #666; cursor: pointer; font-family: 'Inter', sans-serif; }
.mb-btn-next { flex: 1; height: 52px; border-radius: 14px; background: #7C3AFF; border: none; font-size: 15px; font-weight: 800; color: #fff; cursor: pointer; font-family: 'Inter', sans-serif; }
.mb-btn-next:disabled { background: #ccc; cursor: not-allowed; }
.mb-result-card { background: #fff; border-radius: 20px; padding: 16px; margin-bottom: 14px; box-shadow: 0 2px 16px rgba(0,0,0,0.08); overflow: hidden; }
.mb-badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 800; }
`;

interface StepOption { value: string; label: string; desc?: string; icon?: string; }
interface Step { key: string; question: string; options: StepOption[]; multi?: boolean; }

const STEPS: Step[] = [
  {
    key: "age", question: "Poodle'ının yaşı nedir?",
    options: [
      { value: "puppy", label: "Yavru (0–12 ay)", desc: "Besin ihtiyacı yüksek, büyüme dönemi", icon: "🐾" },
      { value: "adult", label: "Yetişkin (1–7 yaş)", desc: "Dengeli beslenme, enerji dengesi", icon: "🐩" },
      { value: "senior", label: "Yaşlı (7+ yaş)", desc: "Eklem desteği, düşük kalori", icon: "💜" },
    ],
  },
  {
    key: "weight", question: "Poodle'ının kilosu ne kadar?",
    options: [
      { value: "micro", label: "1–2 kg (Micro/Teacup)", icon: "⚖️" },
      { value: "toy", label: "2–4 kg (Toy Poodle)", icon: "⚖️" },
      { value: "mini", label: "4–9 kg (Minyatür)", icon: "⚖️" },
      { value: "standard", label: "9+ kg (Standart)", icon: "⚖️" },
    ],
  },
  {
    key: "neutered", question: "Poodle'ın kısırlaştırıldı mı?",
    options: [
      { value: "yes", label: "Evet, kısırlaştırıldı", desc: "Kilo artış riski nedeniyle light/kısır formül önerilir", icon: "✅" },
      { value: "no", label: "Hayır, kısırlaştırılmadı", desc: "Standart veya aktivite bazlı formül uygun", icon: "❌" },
    ],
  },
  {
    key: "activity", question: "Günlük aktivite seviyesi nasıl?",
    options: [
      { value: "low", label: "Düşük", desc: "Çoğunlukla evde, kısa yürüyüşler", icon: "🛋️" },
      { value: "medium", label: "Orta", desc: "Günlük 30-60 dk yürüyüş", icon: "🚶" },
      { value: "high", label: "Yüksek", desc: "Aktif, uzun yürüyüşler, oyun severler", icon: "🏃" },
    ],
  },
  {
    key: "weight_goal", question: "Kilo hedefi var mı?",
    options: [
      { value: "lose", label: "Kilo vermesi gerekiyor", icon: "📉" },
      { value: "maintain", label: "Kilosunu korusun", icon: "⚖️" },
      { value: "gain", label: "Biraz kilo alması lazım", icon: "📈" },
    ],
  },
  {
    key: "allergy", question: "Bilinen alerjisi veya hassasiyeti var mı?",
    options: [
      { value: "none", label: "Yok / Bilmiyorum", icon: "✅" },
      { value: "chicken", label: "Tavuk alerjisi", icon: "🐔" },
      { value: "grain", label: "Tahıl hassasiyeti", icon: "🌾" },
      { value: "fish", label: "Balık alerjisi", icon: "🐟" },
      { value: "other", label: "Farklı alerji var", icon: "⚠️" },
    ],
  },
  {
    key: "coat", question: "Tüy ve deri konusunda sorun var mı?",
    options: [
      { value: "none", label: "Hayır, sağlıklı", icon: "✨" },
      { value: "dull", label: "Tüyleri mat / cansız", icon: "😞" },
      { value: "scratch", label: "Çok kaşınıyor", icon: "🤚" },
      { value: "shedding", label: "Normalden fazla dökülüyor", icon: "💇" },
    ],
  },
  {
    key: "digestion", question: "Sindirim hassasiyeti var mı?",
    options: [
      { value: "none", label: "Yok, herhangi bir sorun yok", icon: "✅" },
      { value: "sensitive", label: "Zaman zaman mide sorunları", icon: "😣" },
      { value: "very_sensitive", label: "Çok hassas sindirim", icon: "⚠️" },
    ],
  },
  {
    key: "protein", question: "Tercih edilen protein kaynağı?",
    options: [
      { value: "chicken", label: "Tavuk", icon: "🐔" },
      { value: "lamb", label: "Kuzu", icon: "🐑" },
      { value: "salmon", label: "Somon / Balık", icon: "🐟" },
      { value: "rabbit", label: "Tavşan", icon: "🐰" },
      { value: "any", label: "Fark etmez", icon: "🔀" },
    ],
  },
  {
    key: "budget", question: "Aylık mama bütçeniz?",
    options: [
      { value: "economy", label: "Ekonomik (₺500-1000)", icon: "💰" },
      { value: "mid", label: "Orta (₺1000-2000)", icon: "💳" },
      { value: "premium", label: "Premium (₺2000+)", icon: "⭐" },
    ],
  },
  {
    key: "package", question: "Tercih edilen paket büyüklüğü?",
    options: [
      { value: "small", label: "Küçük (1-2 kg)", desc: "Taze kalır, değişiklik kolay", icon: "📦" },
      { value: "medium", label: "Orta (3-5 kg)", desc: "Denge: taze + ekonomik", icon: "📦" },
      { value: "large", label: "Büyük (7-12 kg)", desc: "En ekonomik, depo gerektirir", icon: "📦" },
    ],
  },
];

interface RecommendedProduct {
  id: number;
  name: string;
  price: number;
  img: string | null;
  originalPrice?: number;
}

function pickRecommendations(products: any[], answers: Record<string, string>): RecommendedProduct[] {
  if (!products.length) return [];
  const shuffled = [...products].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3).map((p: any) => ({
    id: p.id, name: p.name, price: p.price, img: p.img, originalPrice: p.originalPrice,
  }));
}

const RESULT_LABELS = [
  { key: "best", label: "En Uygun Seçim", color: "#7C3AFF", bg: "#F5F0FF", reason: "Poodle'ınızın yaşı, kilosu ve ihtiyaçlarıyla birebir örtüşüyor." },
  { key: "value", label: "Fiyat Performans", color: "#059669", bg: "#D1FAE5", reason: "Kaliteli içerik, makul fiyat. Uzun süreli kullanımda tasarruf sağlar." },
  { key: "premium", label: "Premium Seçim", color: "#D97706", bg: "#FEF3C7", reason: "En yüksek kalite standartları. İçerik açısından üstün formül." },
];

export default function YPMamaBulPage() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const { data: products = [] } = useQuery<any[]>({
    queryKey: ["/api/products"],
    staleTime: 10 * 60 * 1000,
  });

  const currentStep = STEPS[step];
  const selected = answers[currentStep?.key];
  const progress = ((step) / STEPS.length) * 100;

  const handleSelect = (val: string) => {
    setAnswers(a => ({ ...a, [currentStep.key]: val }));
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      setDone(true);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1);
    else navigate("/yourpoodle");
  };

  const recommendations = pickRecommendations(products, answers);

  if (done) {
    return (
      <YPLayout activeLink="/yourpoodle/mama-bul">
        <style>{CSS}</style>
        <div className="mb-page" style={{ minHeight:"unset" }}>
        <header className="mb-header">
          <button aria-label="Yeniden başla" onClick={() => { setStep(0); setAnswers({}); setDone(false); }}
            style={{ background: "#F5F0FF", border: "none", borderRadius: 10, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <ArrowLeft size={20} color="#7C3AFF" />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a" }}>Mama Önerileri</div>
            <div style={{ fontSize: 12, color: "#888" }}>Poodle'ınıza özel 3 öneri</div>
          </div>
        </header>

        <div style={{ padding: "16px 16px 100px" }}>
          <div style={{ background: "linear-gradient(135deg,#7C3AFF,#A855F7)", borderRadius: 20, padding: "18px", marginBottom: 20, color: "#fff" }}>
            <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.8, marginBottom: 4 }}>ANALİZ TAMAMLANDI ✓</div>
            <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 6 }}>Poodle'ınıza özel öneriler hazır!</div>
            <div style={{ fontSize: 13, opacity: 0.85, lineHeight: 1.5 }}>
              {answers.age === "puppy" ? "Yavru" : answers.age === "senior" ? "Yaşlı" : "Yetişkin"} poodle profiline göre{" "}
              {answers.protein !== "any" ? `${answers.protein === "chicken" ? "tavuklu" : answers.protein === "salmon" ? "somon" : answers.protein === "lamb" ? "kuzulu" : "tavşanlı"}` : "uygun proteinli"}{" "}
              mamalar önerildi.
            </div>
          </div>

          {recommendations.length > 0 ? (
            recommendations.map((prod, idx) => {
              const rl = RESULT_LABELS[idx];
              return (
                <div key={prod.id} className="mb-result-card">
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                    <span className="mb-badge" style={{ background: rl.bg, color: rl.color }}>
                      {idx === 0 ? "🏆" : idx === 1 ? "💚" : "⭐"} {rl.label}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 76, height: 76, borderRadius: 14, background: "#F0ECFF", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {prod.img
                        ? <img src={prod.img} alt={prod.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <span style={{ fontSize: 32 }}>🐾</span>
                      }
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.4, marginBottom: 4 }}>{prod.name}</div>
                      <div style={{ fontSize: 12, color: "#666", marginBottom: 8, lineHeight: 1.4 }}>{rl.reason}</div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                        <span style={{ fontSize: 17, fontWeight: 900, color: "#7C3AFF" }}>₺{Number(prod.price).toLocaleString("tr-TR")}</span>
                        {prod.originalPrice && prod.originalPrice > prod.price && (
                          <span style={{ fontSize: 12, color: "#bbb", textDecoration: "line-through" }}>₺{Number(prod.originalPrice).toLocaleString("tr-TR")}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                    <button
                      onClick={() => navigate(`/urun/${prod.id}`)}
                      style={{ flex: 1, height: 44, borderRadius: 12, background: rl.bg, border: "none", fontSize: 13, fontWeight: 700, color: rl.color, cursor: "pointer", fontFamily: "'Inter',sans-serif" }}
                    >
                      Detayı İncele
                    </button>
                    <button
                      onClick={() => navigate(`/urun/${prod.id}`)}
                      style={{ flex: 1, height: 44, borderRadius: 12, background: rl.color, border: "none", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "'Inter',sans-serif" }}
                    >
                      Sepete Ekle
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#888" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🐾</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#333", marginBottom: 8 }}>Öneri hazırlanıyor</div>
              <div style={{ fontSize: 13 }}>Ürün listesi yükleniyor, lütfen bekleyin.</div>
            </div>
          )}

          <div style={{ background: "#FFF9C4", borderRadius: 16, padding: "14px 16px", marginTop: 8, fontSize: 12, color: "#92400E", lineHeight: 1.5 }}>
            ⚠️ Bu öneriler genel profil bilgilerinize göre oluşturulmuştur. Özel sağlık durumları için veteriner hekiminize danışın.
          </div>

          <button
            onClick={() => { setStep(0); setAnswers({}); setDone(false); }}
            style={{ width: "100%", height: 52, borderRadius: 14, background: "#F5F0FF", border: "none", fontSize: 15, fontWeight: 700, color: "#7C3AFF", cursor: "pointer", fontFamily: "'Inter',sans-serif", marginTop: 16 }}
          >
            Yeniden Ara
          </button>
        </div>
        </div>
      </YPLayout>
    );
  }

  return (
    <YPLayout activeLink="/yourpoodle/mama-bul">
      <style>{CSS}</style>
      <div className="mb-page" style={{ minHeight:"unset" }}>

      <header className="mb-header">
        <button aria-label="Geri" onClick={handleBack}
          style={{ background: "#F5F0FF", border: "none", borderRadius: 10, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <ArrowLeft size={20} color="#7C3AFF" />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a" }}>Mama Bulma Sihirbazı</div>
          <div style={{ fontSize: 12, color: "#888" }}>Adım {step + 1} / {STEPS.length}</div>
        </div>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#7C3AFF" }}>
          %{Math.round(((step) / STEPS.length) * 100)}
        </div>
      </header>

      <div className="mb-progress" style={{ marginTop: 12 }}>
        <div className="mb-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="mb-content">
        <h2 style={{ fontSize: 20, fontWeight: 900, color: "#1a1a1a", marginBottom: 6, lineHeight: 1.3 }}>
          {currentStep.question}
        </h2>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>Bir seçenek seçin</p>

        {currentStep.options.map(opt => (
          <button
            key={opt.value}
            onClick={() => handleSelect(opt.value)}
            className={`mb-option ${selected === opt.value ? "selected" : ""}`}
            aria-pressed={selected === opt.value}
          >
            {opt.icon && (
              <div className="mb-option-icon" style={{ background: selected === opt.value ? "#EDE8FF" : "#F5F5F5" }}>
                {opt.icon}
              </div>
            )}
            <div className="mb-option-text">
              <div className="mb-option-label">{opt.label}</div>
              {opt.desc && <div className="mb-option-desc">{opt.desc}</div>}
            </div>
            <div className="mb-check">
              {selected === opt.value && <Check size={14} color="#fff" />}
            </div>
          </button>
        ))}

        <div className="mb-nav">
          <button className="mb-btn-back" onClick={handleBack}>
            ← Geri
          </button>
          <button
            className="mb-btn-next"
            disabled={!selected}
            onClick={handleNext}
          >
            {step === STEPS.length - 1 ? "Önerileri Gör 🎉" : "İleri →"}
          </button>
        </div>
      </div>

      </div>
    </YPLayout>
  );
}
