import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, ChevronRight, RotateCcw, Trash2 } from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import YPBreadcrumb from "@/components/YPBreadcrumb";
import { useCustomer } from "@/contexts/CustomerContext";

const BREADCRUMBS = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Profilim", href: "/yourpoodle/profil" },
  { label: "Geçmiş Önerilerim", href: "/yourpoodle/gecmis-oneriler" },
];

const AGE_LABELS: Record<string, string> = { puppy: "Yavru (0–12 ay)", adult: "Yetişkin (1–7 yaş)", senior: "Yaşlı (7+ yaş)" };
const BUDGET_LABELS: Record<string, string> = { economy: "₺500–1.000", mid: "₺1.000–2.000", premium: "₺2.000+" };
const ALLERGY_LABELS: Record<string, string> = { none: "Alerji yok", chicken: "Tavuk alerjisi", grain: "Tahıl hassasiyeti", fish: "Balık alerjisi", other: "Diğer alerji" };
const ACTIVITY_LABELS: Record<string, string> = { low: "Düşük aktivite", medium: "Orta aktivite", high: "Yüksek aktivite" };
const WEIGHT_LABELS: Record<string, string> = { micro: "1–2 kg (Micro)", toy: "2–4 kg (Toy)", mini: "4–9 kg (Minyatür)", standard: "9+ kg (Standart)" };

interface RecommendedProduct {
  id: number;
  name: string;
  price: number;
  matchPct?: number;
  reason?: string;
}

interface HistoryEntry {
  id: number;
  answers: Record<string, string>;
  products: RecommendedProduct[];
  created_at: string;
}

interface PaginatedResponse {
  items: HistoryEntry[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

function groupByDate(items: HistoryEntry[]): Array<{ label: string; entries: HistoryEntry[] }> {
  const groups: Record<string, HistoryEntry[]> = {};
  const today = new Date();
  const todayStr = today.toDateString();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  for (const item of items) {
    const d = new Date(item.created_at);
    const ds = d.toDateString();
    let label: string;
    if (ds === todayStr) label = "Bugün";
    else if (ds === yesterdayStr) label = "Dün";
    else label = d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
    if (!groups[label]) groups[label] = [];
    groups[label].push(item);
  }

  return Object.entries(groups).map(([label, entries]) => ({ label, entries }));
}

function AnswerTag({ label }: { label: string }) {
  return (
    <span style={{ background: "#EDE5D8", color: "#5D3A1A", borderRadius: 99, padding: "3px 10px", fontSize: 11, fontWeight: 700, display: "inline-block" }}>
      {label}
    </span>
  );
}

function HistoryCard({ entry, navigate, onDelete }: { entry: HistoryEntry; navigate: (p: string) => void; onDelete: (id: number) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { answers, products, created_at } = entry;
  const time = new Date(created_at).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const r = await fetch(`/api/yp/recommendations/${entry.id}`, { method: "DELETE", credentials: "include" });
      if (r.ok) onDelete(entry.id);
    } catch {}
    setDeleting(false);
    setConfirmDelete(false);
  };

  const answerTags: string[] = [];
  if (answers.age) answerTags.push(AGE_LABELS[answers.age] || answers.age);
  if (answers.weight) answerTags.push(WEIGHT_LABELS[answers.weight] || answers.weight);
  if (answers.budget) answerTags.push(BUDGET_LABELS[answers.budget] || answers.budget);
  if (answers.allergy && answers.allergy !== "none") answerTags.push(ALLERGY_LABELS[answers.allergy] || answers.allergy);
  if (answers.activity) answerTags.push(ACTIVITY_LABELS[answers.activity] || answers.activity);

  const RANK_META = [
    { label: "🏆 En Uygun", color: "#5D3A1A", bg: "linear-gradient(135deg,#5D3A1A,#8B5E34)" },
    { label: "💚 Fiyat Performans", color: "#059669", bg: "#D1FAE5" },
    { label: "⭐ Premium", color: "#D97706", bg: "#FEF3C7" },
  ];

  return (
    <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 14px rgba(0,0,0,0.07)", overflow: "hidden", marginBottom: 12 }}>
      {/* Header */}
      <button
        onClick={() => setExpanded(e => !e)}
        style={{ width: "100%", background: "none", border: "none", padding: "16px 16px 14px", cursor: "pointer", textAlign: "left", fontFamily: "'Inter', sans-serif" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 12, color: "#9580CC", fontWeight: 600 }}>{time}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Trash / confirm inline */}
            {confirmDelete ? (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }} onClick={e => e.stopPropagation()}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#DC2626" }}>Silinsin mi?</span>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  style={{ background: "#DC2626", border: "none", borderRadius: 8, color: "#fff", fontSize: 11, fontWeight: 800, padding: "3px 10px", cursor: "pointer", opacity: deleting ? 0.6 : 1, fontFamily: "inherit" }}>
                  {deleting ? "…" : "Evet"}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  style={{ background: "#F3F4F6", border: "none", borderRadius: 8, color: "#555", fontSize: 11, fontWeight: 700, padding: "3px 10px", cursor: "pointer", fontFamily: "inherit" }}>
                  İptal
                </button>
              </div>
            ) : (
              <button
                onClick={e => { e.stopPropagation(); setConfirmDelete(true); }}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", color: "#D4C4B0" }}
                title="Sil">
                <Trash2 size={14} />
              </button>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#5D3A1A", fontSize: 12, fontWeight: 700 }}>
              {expanded ? "Gizle" : "Detaylar"}
              <ChevronRight size={14} style={{ transform: expanded ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
            </div>
          </div>
        </div>

        {/* Answer tags */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
          {answerTags.map(t => <AnswerTag key={t} label={t} />)}
        </div>

        {/* Top pick preview */}
        {products[0] && (
          <div style={{ background: "linear-gradient(135deg,#5D3A1A,#8B5E34)", borderRadius: 14, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", fontWeight: 700, marginBottom: 2 }}>🏆 En Uygun</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", lineHeight: 1.3 }}>{products[0].name}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 2 }}>₺{Number(products[0].price).toLocaleString("tr-TR")}</div>
            </div>
            {(products[0].matchPct ?? 0) > 0 && (
              <span style={{ background: "rgba(255,255,255,0.22)", color: "#fff", borderRadius: 20, fontSize: 12, fontWeight: 800, padding: "4px 10px", flexShrink: 0 }}>
                %{Math.round(products[0].matchPct!)} uyum
              </span>
            )}
          </div>
        )}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div style={{ padding: "0 16px 16px" }}>
          {/* All answer details */}
          <div style={{ background: "#F8F7FF", borderRadius: 14, padding: "12px 14px", marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: "#9580CC", fontWeight: 700, marginBottom: 8 }}>KULLANILAN PROFIL</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {[
                ["Yaş", answers.age ? (AGE_LABELS[answers.age] || answers.age) : null],
                ["Kilo", answers.weight ? (WEIGHT_LABELS[answers.weight] || answers.weight) : null],
                ["Bütçe", answers.budget ? (BUDGET_LABELS[answers.budget] || answers.budget) : null],
                ["Alerji", answers.allergy ? (ALLERGY_LABELS[answers.allergy] || answers.allergy) : null],
                ["Aktivite", answers.activity ? (ACTIVITY_LABELS[answers.activity] || answers.activity) : null],
                ["Kısır", answers.neutered ? (answers.neutered === "yes" ? "Evet" : "Hayır") : null],
              ].filter(([, v]) => v).map(([k, v]) => (
                <div key={String(k)} style={{ fontSize: 12 }}>
                  <span style={{ color: "#9580CC", fontWeight: 600 }}>{k}: </span>
                  <span style={{ color: "#2C2118", fontWeight: 700 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* All 3 products */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {products.map((p, i) => {
              const meta = RANK_META[i] || RANK_META[2];
              const isFirst = i === 0;
              return (
                <button
                  key={p.id}
                  onClick={() => navigate(`/yourpoodle/urun/${p.id}`)}
                  style={{
                    width: "100%",
                    background: isFirst ? meta.bg : "#F8F7FF",
                    borderRadius: 14,
                    padding: "10px 12px",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontFamily: "'Inter', sans-serif",
                    textAlign: "left",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 10, color: isFirst ? "rgba(255,255,255,0.8)" : meta.color, fontWeight: 700, marginBottom: 2 }}>{meta.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: isFirst ? "#fff" : "#2C2118", lineHeight: 1.3 }}>{p.name}</div>
                    {p.reason && <div style={{ fontSize: 11, color: isFirst ? "rgba(255,255,255,0.7)" : "#9580CC", marginTop: 2 }}>{p.reason}</div>}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800, color: isFirst ? "#fff" : "#5D3A1A", flexShrink: 0, marginLeft: 8 }}>
                    ₺{Number(p.price).toLocaleString("tr-TR")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function YPGecmisOnerilerPage() {
  const [, navigate] = useLocation();
  const { isLoggedIn } = useCustomer();
  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!isLoggedIn) { setLoading(false); return; }
    setLoading(true);
    fetch(`/api/yp/recommendations?page=${page}&limit=10`, { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setData(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isLoggedIn, page]);

  const grouped = data ? groupByDate(data.items) : [];

  return (
    <YPLayout activeLink="/yourpoodle/profil">
      <title>Geçmiş Mama Önerilerim | YourPoodle</title>
      <meta name="description" content="Mama Bul sihirbazıyla oluşturduğunuz tüm geçmiş önerilerinizi görüntüleyin." />
      <meta name="robots" content="noindex" />
      <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: "#FAFAF9", minHeight: "100vh" }}>
        <YPBreadcrumb items={BREADCRUMBS} />

        {/* Header */}
        <section style={{ background: "linear-gradient(135deg, #5D3A1A 0%, #3D2612 100%)", padding: "28px 20px 24px", color: "#fff" }}>
          <button
            onClick={() => navigate("/yourpoodle/profil")}
            style={{ background: "rgba(255,255,255,0.18)", border: "none", borderRadius: 12, padding: "6px 14px 6px 10px", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "'Inter', sans-serif", marginBottom: 16 }}
          >
            <ArrowLeft size={15} /> Profilim
          </button>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🍖</div>
          <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>Geçmiş Önerilerim</h1>
          <p style={{ fontSize: 13, opacity: 0.85, margin: 0 }}>Mama Bul sihirbazından geçmişteki tüm sonuçların</p>
        </section>

        <div style={{ padding: "20px 16px 40px", maxWidth: 700, margin: "0 auto" }}>
          {!isLoggedIn ? (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
              <p style={{ fontSize: 15, color: "#666", marginBottom: 20 }}>Geçmiş önerilerinizi görmek için giriş yapmanız gerekiyor.</p>
              <button
                onClick={() => navigate("/yourpoodle/giris")}
                style={{ height: 48, borderRadius: 14, background: "#5D3A1A", border: "none", color: "#fff", fontSize: 15, fontWeight: 800, padding: "0 28px", cursor: "pointer", fontFamily: "'Inter', sans-serif" }}
              >
                Giriş Yap
              </button>
            </div>
          ) : loading ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: "#aaa" }}>Yükleniyor…</div>
          ) : !data || data.items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🍽️</div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1a1a1a", marginBottom: 8 }}>Henüz öneri yok</h2>
              <p style={{ fontSize: 14, color: "#888", marginBottom: 24 }}>Mama Bul sihirbazını kullanarak poodle'ınıza özel öneriler oluşturun.</p>
              <button
                onClick={() => navigate("/yourpoodle/mama-bul")}
                style={{ height: 48, borderRadius: 14, background: "#5D3A1A", border: "none", color: "#fff", fontSize: 15, fontWeight: 800, padding: "0 28px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'Inter', sans-serif" }}
              >
                <RotateCcw size={16} /> Mama Bul'a Git
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <span style={{ fontSize: 13, color: "#888" }}>Toplam <strong style={{ color: "#1a1a1a" }}>{data.total}</strong> sonuç</span>
                <button
                  onClick={() => navigate("/yourpoodle/mama-bul")}
                  style={{ background: "#EDE5D8", border: "none", borderRadius: 10, padding: "6px 12px", fontSize: 12, fontWeight: 700, color: "#5D3A1A", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontFamily: "'Inter', sans-serif" }}
                >
                  <RotateCcw size={12} /> Yeni Öneri
                </button>
              </div>

              {grouped.map(group => (
                <div key={group.label}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "#9580CC", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8, marginTop: 16 }}>
                    {group.label}
                  </div>
                  {group.entries.map(entry => (
                    <HistoryCard
                      key={entry.id}
                      entry={entry}
                      navigate={navigate}
                      onDelete={(id) => setData(prev => prev ? {
                        ...prev,
                        total: prev.total - 1,
                        items: prev.items.filter(i => i.id !== id),
                      } : prev)}
                    />
                  ))}
                </div>
              ))}

              {/* Pagination */}
              {data.pages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage(p => p - 1)}
                    style={{ height: 40, borderRadius: 12, border: "2px solid #EDE5D8", background: page <= 1 ? "#F5F0E6" : "#fff", color: page <= 1 ? "#D4C4B0" : "#5D3A1A", fontWeight: 700, fontSize: 13, padding: "0 16px", cursor: page <= 1 ? "not-allowed" : "pointer", fontFamily: "'Inter', sans-serif" }}
                  >
                    ← Önceki
                  </button>
                  <span style={{ height: 40, display: "flex", alignItems: "center", fontSize: 13, color: "#666", fontWeight: 600 }}>
                    {page} / {data.pages}
                  </span>
                  <button
                    disabled={page >= data.pages}
                    onClick={() => setPage(p => p + 1)}
                    style={{ height: 40, borderRadius: 12, border: "2px solid #EDE5D8", background: page >= data.pages ? "#F5F0E6" : "#fff", color: page >= data.pages ? "#D4C4B0" : "#5D3A1A", fontWeight: 700, fontSize: 13, padding: "0 16px", cursor: page >= data.pages ? "not-allowed" : "pointer", fontFamily: "'Inter', sans-serif" }}
                  >
                    Sonraki →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </YPLayout>
  );
}
