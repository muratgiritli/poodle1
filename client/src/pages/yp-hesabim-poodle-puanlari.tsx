// Route: /hesabim/poodle-puanlari
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft, PawPrint, Crown, PlusCircle, ShoppingBag, Clock,
  Plus, Minus, Ticket, Package, Scissors, ChevronDown, ChevronUp,
  Gift, X, Star, BadgePercent,
} from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { goBack } from "@/lib/goBack";
import {
  LOYALTY_BRAND as P,
  LOYALTY_BRAND_DARK as PD,
  LOYALTY_BRAND_LIGHT as PL_BRAND,
  enrichReward,
  fetchLoyalty,
  fetchRewards,
  filterTransactions,
  formatLoyaltyDate,
} from "@/lib/loyalty-api";

/* ── Palette ─────────────────────────── */
const PL   = PL_BRAND || "#F5F0E6";
const NAV  = "#1D1E9B";
const DRK  = "#111827";
const GT   = "#6B7280";
const GB   = "#E5E7EB";
const GRN  = "#16A34A";
const RED  = "#DC2626";
const GOLD = "#F59E0B";
const GOLDB= "#FBBF24";

const EARN_TASKS = [
  { id:"et-1", title:"Poodle Profilini Tamamla",  points:100, btn:"Tamamla",   progress:80,  link:"/hesabim/ayarlar" },
  { id:"et-2", title:"Club'da İlk Yorumunu Yap",  points:20,  btn:"Club'a Git",progress:null,link:"/yourpoodle/club" },
  { id:"et-3", title:"Arkadaşını Davet Et",        points:250, btn:"Davet Et",  progress:null,link:null },
];

const FAQ_ITEMS = [
  { id:"faq-1",
    q:"PoodlePuan Nasıl Çalışır?",
    a:"Her alışverişte, Club paylaşımında ve rehber tamamladığınızda puan kazanırsınız. 10 PoodlePuan = 1 TL indirim değerindedir." },
  { id:"faq-2",
    q:"Seviye Avantajları",
    a:"Mor Poodle üyeler standart oranda puan kazanır. Gold seviyede alışverişlerden %5 daha fazla puan kazanırsınız." },
  { id:"faq-3",
    q:"Puan Kullanım Koşulları",
    a:"Puanlar 12 ay geçerlidir. Minimum sepet tutarı ödül kartında belirtilir. Puanlar nakde çevrilemez." },
];

function fmtPoints(n: number) {
  return Math.abs(n).toLocaleString("tr-TR");
}

/* ── UsePoints Modal ─────────────────── */
function UsePointsModal({ onClose, navigate, rewards, balance }: {
  onClose:()=>void; navigate:(p:string)=>void;
  rewards: ReturnType<typeof enrichReward>[]; balance: number;
}) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)",
                  display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:9999 }}>
      <div style={{ background:"#fff", borderRadius:"20px 20px 0 0",
                    padding:"24px 20px 40px", width:"100%", maxWidth: "var(--yp-shell-max)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
          <span style={{ fontSize:17, fontWeight:700, color:DRK }}>Puan Kullan</span>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer" }}>
            <X size={20} color={GT} />
          </button>
        </div>
        {rewards.length === 0 ? (
          <div style={{ fontSize:13, color:GT, textAlign:"center", padding:"16px 0" }}>
            Henüz kullanılabilir ödül yok.
          </div>
        ) : rewards.map(r => (
          <div key={r.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                                   padding:"12px 0", borderBottom:`1px solid #F3F4F6` }}>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:DRK }}>{r.title}</div>
              <div style={{ fontSize:11, color:P, marginTop:2 }}>{r.pointsCost} Puan</div>
            </div>
            <button
              onClick={() => navigate(`/hesabim/poodle-puanlari/odul-onayla/${r.id}`)}
              disabled={balance < r.pointsCost}
              style={{
                background: balance >= r.pointsCost ? P : GB, color: balance >= r.pointsCost ? "#fff" : GT,
                border:"none", borderRadius:10, padding:"7px 14px", fontSize:11, fontWeight:700,
                cursor: balance >= r.pointsCost ? "pointer" : "not-allowed", fontFamily:"inherit",
              }}>
              Kullan
            </button>
          </div>
        ))}
        <button onClick={() => navigate("/magaza")}
          style={{ width:"100%", background:P, color:"#fff", border:"none", borderRadius:14,
                   padding:"13px 0", fontSize:14, fontWeight:700, cursor:"pointer",
                   fontFamily:"inherit", marginTop:18 }}>
          Mağazaya Git
        </button>
      </div>
    </div>
  );
}

/* ── HowToEarn Modal ─────────────────── */
function HowToEarnModal({ onClose }: { onClose:()=>void }) {
  const ways = [
    "🛍 Her 10 TL alışverişte 1 PoodlePuan",
    "🐾 Club'da gönderi paylaştığında +10 Puan",
    "📖 Her rehber tamamlandığında +20 Puan",
    "⭐ Destek değerlendirmesinde +25 Puan",
    "🔥 Günlük girişlerde seri bonusu (7 gün = +75 Puan)",
  ];
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)",
                  display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:9999 }}>
      <div style={{ background:"#fff", borderRadius:"20px 20px 0 0",
                    padding:"24px 20px 40px", width:"100%", maxWidth: "var(--yp-shell-max)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
          <span style={{ fontSize:17, fontWeight:700, color:DRK }}>Nasıl Puan Kazanırım?</span>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer" }}>
            <X size={20} color={GT} />
          </button>
        </div>
        {ways.map(w => (
          <div key={w} style={{ fontSize:13, color:DRK, padding:"8px 0",
                                 borderBottom:`1px solid #F9FAFB`, lineHeight:1.5 }}>
            {w}
          </div>
        ))}
        <button onClick={onClose}
          style={{ width:"100%", background:P, color:"#fff", border:"none", borderRadius:14,
                   padding:"13px 0", fontSize:14, fontWeight:700, cursor:"pointer",
                   fontFamily:"inherit", marginTop:18 }}>
          Tamam
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════
   MAIN PAGE
════════════════════════════ */
type Tab = "movements" | "rewards" | "earn";
type Filter = "all" | "earned" | "spent";

export default function YPPoodlePuanlariPage() {
  const [, navigate] = useLocation();

  const [activeTab,     setActiveTab]     = useState<Tab>("movements");
  const [filter,        setFilter]        = useState<Filter>("all");
  const [openFaq,       setOpenFaq]       = useState<string|null>(null);
  const [useModal,      setUseModal]      = useState(false);
  const [earnModal,     setEarnModal]     = useState(false);
  const [showAll,       setShowAll]       = useState(false);
  const [toast,         setToast]         = useState("");

  const { data: loyalty, isLoading } = useQuery({
    queryKey: ["/api/customer/loyalty"],
    queryFn: fetchLoyalty,
  });
  const { data: rewardCatalog = [] } = useQuery({
    queryKey: ["/api/customer/loyalty/rewards"],
    queryFn: fetchRewards,
  });

  const balance = loyalty?.balance ?? 0;
  const transactions = loyalty?.transactions ?? [];
  const rewards = useMemo(() => rewardCatalog.slice(0, 3).map(enrichReward), [rewardCatalog]);

  const quickStats = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    let earnedMonth = 0;
    let spentTotal = 0;
    for (const tx of transactions) {
      if (tx.amount > 0 && new Date(tx.createdAt) >= monthStart) earnedMonth += tx.amount;
      if (tx.amount < 0) spentTotal += Math.abs(tx.amount);
    }
    return [
      { icon: PlusCircle, label: "Bu Ay", value: earnedMonth ? `+${earnedMonth.toLocaleString("tr-TR")} Puan` : "—", color: P },
      { icon: ShoppingBag, label: "Harcanan", value: spentTotal ? `${spentTotal.toLocaleString("tr-TR")} Puan` : "—", color: P },
      { icon: Clock, label: "Hareket", value: `${transactions.length}`, color: P },
      { icon: Crown, label: "Seviye", value: "Poodle Üye", color: P },
    ];
  }, [transactions]);

  const showToast = (m:string) => { setToast(m); setTimeout(()=>setToast(""), 2800); };

  const useReward = (id: string) => {
    navigate(`/hesabim/poodle-puanlari/odul-onayla/${id}`);
  };

  const earnAction = (task: typeof EARN_TASKS[0]) => {
    if (task.link) navigate(task.link);
    else showToast("Davet bağlantısı kopyalandı ✓");
  };

  const filteredTx = filterTransactions(transactions, filter);
  const visibleTx = showAll ? filteredTx : filteredTx.slice(0, 6);

  const txIcon = (amount: number) => {
    if (amount < 0) return { Icon: Minus, bg:"#FEF2F2", ic:RED };
    return { Icon: Plus, bg:"#F0FDF4", ic:GRN };
  };

  return (
    <YPLayout activeLink="club" constrain={false}>
      <div className="yp-acct" style={{ margin:"0 auto", background:"#F9F9FB",
                    minHeight:"100vh", fontFamily:"Inter, sans-serif" }}>

        {/* ── BREADCRUMB + HEADER ── */}
        <div style={{ padding:"14px 16px 10px" }}>
          <button onClick={() => goBack(navigate, "/hesabim")}
            style={{ display:"flex", alignItems:"center", gap:6, background:"none",
                     border:"none", cursor:"pointer", padding:0, fontFamily:"inherit" }}>
            <ArrowLeft size={15} color={P} />
            <span style={{ fontSize:12, color:P, fontWeight:500 }}>Hesabım / PoodlePuanlarım</span>
          </button>
          <h1 style={{ margin:"8px 0 4px", fontSize:21, fontWeight:700, color:P }}>
            PoodlePuanlarım
          </h1>
          <p style={{ margin:0, fontSize:12, color:GT, lineHeight:1.45 }}>
            Alışveriş yapın, Club'a katılın, puan kazanın ve ödülleri kullanın.
          </p>
        </div>

        {/* ── HERO CARD ── */}
        <div style={{ margin:"0 16px 14px", borderRadius:20, overflow:"hidden",
                      background:`linear-gradient(135deg,${P} 0%,${PD} 100%)`,
                      padding:"16px 14px" }}>
          {/* Top row: tier badge */}
          <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:5,
                          background:"rgba(255,255,255,.18)", borderRadius:20,
                          padding:"3px 10px" }}>
              <Crown size={12} color={GOLDB} />
              <span style={{ fontSize:10, color:"#fff", fontWeight:700 }}>Poodle Üye</span>
            </div>
          </div>
          {/* Main row */}
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {/* Gold coin */}
            <div style={{ width:64, height:64, borderRadius:"50%",
                          background:`linear-gradient(135deg,${GOLDB} 0%,${GOLD} 100%)`,
                          display:"flex", alignItems:"center", justifyContent:"center",
                          flexShrink:0,
                          boxShadow:"0 4px 16px rgba(0,0,0,.25)" }}>
              <PawPrint size={28} color="#fff" fill="rgba(255,255,255,.3)" />
            </div>
            {/* Text */}
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:10, color:"rgba(255,255,255,.75)",
                            textTransform:"uppercase", letterSpacing:".05em", marginBottom:2 }}>
                Kullanılabilir Puan
              </div>
              <div style={{ fontSize:24, fontWeight:800, color:"#fff", lineHeight:1.1 }}>
                {isLoading ? "…" : balance.toLocaleString("tr-TR")}{" "}
                <span style={{ fontSize:14, fontWeight:600 }}>PoodlePuan</span>
              </div>
              <div style={{ fontSize:11, color:"#D4C4B0", marginTop:4 }}>
                {(balance / 10).toLocaleString("tr-TR", { minimumFractionDigits:2 })} TL indirim değerinde
              </div>
            </div>
            {/* Buttons */}
            <div style={{ display:"flex", flexDirection:"column", gap:7, flexShrink:0 }}>
              <button onClick={() => navigate("/hesabim/poodle-puanlari/odul-merkezi")}
                style={{ background:"#fff", color:P, border:"none", borderRadius:10,
                         padding:"9px 12px", fontSize:10, fontWeight:800,
                         cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>
                Puan Kullan
              </button>
              <button onClick={() => setEarnModal(true)}
                style={{ background:"none", color:"#fff", border:"1.5px solid rgba(255,255,255,.55)",
                         borderRadius:10, padding:"8px 10px", fontSize:10, fontWeight:600,
                         cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>
                Nasıl Kazanırım?
              </button>
            </div>
          </div>
        </div>

        {/* ── TIER PROGRESS ── */}
        <div style={{ margin:"0 16px 14px", background:"#fff", borderRadius:20,
                      border:"1px solid #F3F4F6", boxShadow:"0 1px 4px rgba(0,0,0,.05)", padding:"14px 16px" }}>
          <div style={{ fontSize:13, fontWeight:700, color:DRK, marginBottom:12 }}>
            Puan kazanmaya devam edin
          </div>
          <div style={{ position:"relative", height:10, background:PL, borderRadius:999,
                        overflow:"hidden", marginBottom:6 }}>
            <div style={{ width:`${Math.min(100, Math.round((balance % 2000) / 20))}%`, height:"100%",
                          background:P, borderRadius:999 }} />
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ display:"flex", alignItems:"center", gap:4 }}>
              <Crown size={13} color={P} />
              <span style={{ fontSize:11, fontWeight:700, color:P }}>Poodle Üye</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:4 }}>
              <Crown size={13} color={GOLD} />
              <span style={{ fontSize:11, fontWeight:700, color:GT }}>Gold Poodle</span>
            </div>
          </div>
          <div style={{ fontSize:10.5, color:GT, marginTop:8 }}>
            Gold seviyede alışverişlerden %5 daha fazla puan kazanırsınız.
          </div>
        </div>

        {/* ── QUICK STATS 2×2 ── */}
        <div style={{ padding:"0 16px 14px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          {quickStats.map(({ icon: Icon, label, value }) => (
            <div key={label} style={{ background:"#fff", border:"1px solid #F3F4F6",
                                      borderRadius:14, padding:"12px" }}>
              <div style={{ width:32, height:32, borderRadius:10, background:PL,
                            display:"flex", alignItems:"center", justifyContent:"center",
                            marginBottom:8 }}>
                <Icon size={16} color={P} />
              </div>
              <div style={{ fontSize:10, color:GT, marginBottom:3 }}>{label}</div>
              <div style={{ fontSize:12, fontWeight:700, color:DRK }}>{value}</div>
            </div>
          ))}
        </div>

        {/* ── TABS ── */}
        <div style={{ padding:"0 16px 12px", display:"flex", gap:8, overflowX:"auto" }}>
          {[
            { key:"movements" as Tab, label:"Puan Hareketleri" },
            { key:"rewards"   as Tab, label:"Ödüller"          },
            { key:"earn"      as Tab, label:"Kazanma Yolları"  },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => key === "earn" ? navigate("/hesabim/poodle-puanlari/kazan") : setActiveTab(key)}
              style={{
                flexShrink:0,
                background: activeTab === key ? P : "#fff",
                color: activeTab === key ? "#fff" : "#374151",
                border: activeTab === key ? "none" : `1px solid ${GB}`,
                borderRadius:20, padding:"8px 16px", fontSize:13,
                fontWeight: activeTab === key ? 700 : 400,
                cursor:"pointer", fontFamily:"inherit",
              }}>
              {label}
            </button>
          ))}
        </div>

        {/* ══ TRANSACTIONS ══ */}
        {(activeTab === "movements") && (
          <div style={{ padding:"0 16px 14px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <span style={{ fontSize:13, fontWeight:700, color:DRK }}>Son Puan Hareketleri</span>
              <select value={filter} onChange={e => setFilter(e.target.value as Filter)}
                style={{ border:`1px solid ${GB}`, borderRadius:8, padding:"4px 8px",
                         fontSize:11, color:DRK, background:"#fff", fontFamily:"inherit",
                         cursor:"pointer" }}>
                <option value="all">Tümü</option>
                <option value="earned">Kazanılan</option>
                <option value="spent">Harcanan</option>
              </select>
            </div>
            <div style={{ background:"#fff", borderRadius:16, border:"1px solid #F3F4F6",
                          padding:"0 14px" }}>
              {visibleTx.length === 0 ? (
                <div style={{ padding:"28px 8px", textAlign:"center" }}>
                  <PawPrint size={32} color={GB} style={{ margin:"0 auto 10px" }} />
                  <div style={{ fontSize:14, fontWeight:600, color:DRK }}>Henüz puan hareketi yok</div>
                  <div style={{ fontSize:12, color:GT, marginTop:4 }}>
                    Alışveriş yaptıkça ve görevleri tamamladıkça hareketler burada görünür.
                  </div>
                </div>
              ) : visibleTx.map((t, i) => {
                const { Icon, bg, ic } = txIcon(t.amount);
                const isLast = i === visibleTx.length - 1;
                return (
                  <div key={t.id} style={{ display:"flex", alignItems:"center", gap:12,
                                            paddingTop:12, paddingBottom:12,
                                            borderBottom: isLast ? "none" : "1px solid #F9FAFB" }}>
                    <div style={{ width:36, height:36, borderRadius:"50%", background:bg,
                                  display:"flex", alignItems:"center", justifyContent:"center",
                                  flexShrink:0 }}>
                      <Icon size={16} color={ic} />
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:DRK,
                                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        {t.description}
                      </div>
                      {t.orderId != null && (
                        <div style={{ fontSize:11, color:GT, marginTop:1 }}>
                          Sipariş #{t.orderId}
                        </div>
                      )}
                      <div style={{ fontSize:10, color:"#9CA3AF", marginTop:2 }}>
                        {formatLoyaltyDate(t.createdAt)}
                      </div>
                    </div>
                    <div style={{ flexShrink:0, fontSize:13, fontWeight:700,
                                  color: t.amount > 0 ? GRN : RED }}>
                      {t.amount > 0 ? `+${fmtPoints(t.amount)}` : `-${fmtPoints(t.amount)}`} Puan
                    </div>
                  </div>
                );
              })}
            </div>
            {!showAll && filteredTx.length > 6 && (
              <button onClick={() => setShowAll(true)}
                style={{ width:"100%", border:`2px solid ${P}`, color:P, background:"none",
                         borderRadius:14, padding:"13px 0", fontSize:13, fontWeight:700,
                         cursor:"pointer", marginTop:12, fontFamily:"inherit" }}>
                Tüm Puan Hareketlerini Gör
              </button>
            )}
          </div>
        )}

        {/* ══ REWARDS ══ */}
        {(activeTab === "movements" || activeTab === "rewards") && (
          <div style={{ padding:"0 16px 14px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <span style={{ fontSize:13, fontWeight:700, color:DRK }}>Puanlarınla Alabileceğin Ödüller</span>
              <button onClick={() => navigate("/hesabim/poodle-puanlari/odul-merkezi")}
                style={{ background:"none", border:"none", color:P, fontSize:11, fontWeight:600,
                         cursor:"pointer", fontFamily:"inherit" }}>
                Tüm Ödüller
              </button>
            </div>
            <div style={{ display:"flex", gap:12, overflowX:"auto", paddingBottom:4 }}>
              {rewards.length === 0 ? (
                <div style={{ padding:"20px 8px", fontSize:13, color:GT }}>
                  Ödül kataloğu yüklenemedi veya boş.
                </div>
              ) : rewards.map(r => {
                const canUse = balance >= r.pointsCost;
                const rewardType = r.icon === "shipping" ? "shipping" : r.icon === "care" ? "care" : "coupon";
                return (
                  <div key={r.id} style={{ minWidth:148, background:"#fff", borderRadius:18,
                                           border:"1px solid #F3F4F6",
                                           boxShadow:"0 1px 5px rgba(0,0,0,.06)",
                                           overflow:"hidden", display:"flex", flexDirection:"column",
                                           flexShrink:0 }}>
                    <div style={{ height:90, background:"#F9FAFB",
                                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {rewardType === "coupon" && (
                        <div style={{ background:PL, borderRadius:12, padding:"10px 14px", textAlign:"center" }}>
                          <div style={{ fontSize:11, color:P, fontWeight:700 }}>İNDİRİM</div>
                        </div>
                      )}
                      {rewardType === "shipping" && <Package size={36} color={P} />}
                      {rewardType === "care" && <BadgePercent size={32} color={P} />}
                    </div>
                    <div style={{ padding:"10px 12px", flex:1, display:"flex", flexDirection:"column" }}>
                      <div style={{ fontSize:13, fontWeight:700, color:DRK, marginBottom:3 }}>{r.title}</div>
                      <div style={{ fontSize:11, color:P, fontWeight:600, marginBottom:2 }}>{r.pointsCost} Puan</div>
                      <div style={{ fontSize:10, color:GT, marginBottom:10 }}>{r.minCart}</div>
                      <button onClick={() => useReward(r.id)}
                        disabled={!canUse}
                        style={{
                          background: canUse ? P : GB, color: canUse ? "#fff" : GT,
                          border:"none", borderRadius:10, padding:"8px 0",
                          fontSize:11, fontWeight:700, cursor: canUse ? "pointer" : "not-allowed",
                          fontFamily:"inherit",
                        }}>
                        Kullan
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══ EARN TASKS ══ */}
        {(activeTab === "movements" || activeTab === "earn") && (
          <div style={{ padding:"0 16px 14px" }}>
            <div style={{ fontSize:13, fontWeight:700, color:DRK, marginBottom:12 }}>
              Daha Fazla Puan Kazan
            </div>
            {EARN_TASKS.map(t => (
              <div key={t.id} style={{ background:"#fff", borderRadius:14,
                                       border:"1px solid #F3F4F6", padding:"12px 14px",
                                       marginBottom:8, display:"flex",
                                       alignItems:"center", gap:12 }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:DRK }}>{t.title}</div>
                  {t.progress !== null && (
                    <div style={{ height:5, background:"#F3F4F6", borderRadius:999,
                                  marginTop:7, overflow:"hidden" }}>
                      <div style={{ width:`${t.progress}%`, height:"100%",
                                    background:P, borderRadius:999 }} />
                    </div>
                  )}
                  <div style={{ fontSize:11, fontWeight:700, color:GRN, marginTop:5 }}>
                    +{t.points} Puan
                  </div>
                </div>
                <button onClick={() => earnAction(t)}
                  style={{ flexShrink:0, border:`1.5px solid ${P}`, color:P, background:"none",
                           borderRadius:10, padding:"7px 13px", fontSize:10, fontWeight:700,
                           cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>
                  {t.btn}
                </button>
              </div>
            ))}
          </div>
        )}

        {balance > 0 && (
        <div style={{ margin:"0 16px 14px", background:"#FEF9C3", border:"1px solid #FDE68A",
                      borderRadius:18, padding:"12px 14px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <Clock size={20} color="#EA580C" style={{ flexShrink:0 }} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:700, color:DRK }}>Puanlarını kullan</div>
              <div style={{ fontSize:11, color:"#374151", marginTop:3, lineHeight:1.5 }}>
                {balance.toLocaleString("tr-TR")} PoodlePuan ödül merkezinde indirime dönüşür.
              </div>
            </div>
            <button onClick={() => setUseModal(true)}
              style={{ flexShrink:0, border:"1.5px solid #EA580C", color:"#EA580C", background:"none",
                       borderRadius:10, padding:"7px 11px", fontSize:11, fontWeight:700,
                       cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>
              Şimdi Kullan
            </button>
          </div>
        </div>
        )}

        {/* ── FAQ ── */}
        <div style={{ padding:"0 16px 14px" }}>
          {FAQ_ITEMS.map(f => (
            <div key={f.id} style={{ background:"#fff", border:"1px solid #F3F4F6",
                                     borderRadius:14, marginBottom:8, overflow:"hidden" }}>
              <button
                onClick={() => setOpenFaq(prev => prev === f.id ? null : f.id)}
                style={{ width:"100%", display:"flex", justifyContent:"space-between",
                         alignItems:"center", padding:"14px 16px",
                         background:"none", border:"none", cursor:"pointer",
                         fontFamily:"inherit" }}>
                <span style={{ fontSize:13, fontWeight:700, color:DRK, textAlign:"left" }}>
                  {f.q}
                </span>
                {openFaq === f.id
                  ? <ChevronUp size={16} color={GT} />
                  : <ChevronDown size={16} color={GT} />
                }
              </button>
              {openFaq === f.id && (
                <div style={{ padding:"0 16px 14px", fontSize:12, color:GT, lineHeight:1.65 }}>
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── PROMO BANNER ── */}
        <div style={{ margin:"0 16px 24px", background:PL, borderRadius:20, padding:"14px 16px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <img
              src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=80&h=80&fit=crop"
              alt="poodle"
              style={{ width:60, height:60, borderRadius:"50%", objectFit:"cover", flexShrink:0 }} />
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:DRK }}>
                Her hareketin ödüle dönüşür!
              </div>
              <div style={{ fontSize:12, color:GT, marginTop:4, lineHeight:1.5 }}>
                Alışveriş, Club ve Rehber ile her gün puan kazan.
              </div>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div style={{ background:NAV, padding:"22px 16px 36px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
            <span style={{ fontSize:22 }}>🐾</span>
            <span style={{ fontSize:16, fontWeight:800, color:"#fff" }}>YourPoodle</span>
          </div>
          <div style={{ display:"flex", gap:18, marginBottom:12 }}>
            {["Yardım","İletişim","KVKK"].map(l => (
              <a key={l} href="#"
                style={{ fontSize:12, color:"rgba(255,255,255,.7)", textDecoration:"none" }}>
                {l}
              </a>
            ))}
          </div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,.4)" }}>© 2026 YourPoodle</div>
        </div>
      </div>

      {/* ── MODALS ── */}
      {useModal  && <UsePointsModal onClose={() => setUseModal(false)} navigate={navigate} rewards={rewardCatalog.map(enrichReward)} balance={balance} />}
      {earnModal && <HowToEarnModal  onClose={() => setEarnModal(false)} />}

      {/* ── TOAST ── */}
      {toast && (
        <div style={{ position:"fixed", bottom:84, left:"50%", transform:"translateX(-50%)",
                      background:"#1F2937", color:"#fff", borderRadius:12, padding:"10px 18px",
                      fontSize:13, fontWeight:600, zIndex:10000, whiteSpace:"nowrap",
                      boxShadow:"0 4px 20px rgba(0,0,0,.25)" }}>
          {toast}
        </div>
      )}
    </YPLayout>
  );
}
