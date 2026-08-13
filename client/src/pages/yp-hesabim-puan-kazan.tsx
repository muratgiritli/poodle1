// Route: /hesabim/poodle-puanlari/kazan
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useCustomer } from "@/contexts/CustomerContext";
import {
  ArrowLeft, PawPrint, Flame, Check, Copy, Gift, Medal,
  ShoppingCart, BookOpen, MessageSquare, Bot, Share2,
  ChevronDown, ChevronUp, User, Smartphone, Star,
  UserPlus, ShoppingBag, Bell, CheckCircle, Coins,
  Ticket,
} from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { goBack } from "@/lib/goBack";
import {
  LOYALTY_BRAND as P,
  LOYALTY_BRAND_DARK as PD,
  LOYALTY_BRAND_LIGHT as PL,
  fetchLoyalty,
} from "@/lib/loyalty-api";

/* ── Palette ─────────────────────────── */
const DRK  = "#111827";
const GT   = "#6B7280";
const GB   = "#E5E7EB";
const GRN  = "#16A34A";
const GOLDB= "#FBBF24";
const BG   = "#F9F9FB";
const BLU  = "#3B82F6";
const BLUL = "#EFF6FF";

/* ── Types ───────────────────────────── */
type FilterTab = "all" | "daily" | "club" | "shop" | "guide";

interface StreakDay {
  day: string; label?: string; points: number;
  status: "completed" | "today" | "upcoming" | "bonus"; isGift?: boolean;
}

interface EarnTask {
  id: string; title: string; category: string; section: string;
  points: number; progress: number; progressMax: number;
  status: string; buttonLabel: string; buttonDisabled?: boolean;
  icon: string; link?: string;
}

interface CompletedTask { id:string; title:string; points:number; date:string; }

/* ── Data ────────────────────────────── */
const STREAK_DAYS: StreakDay[] = [
  { day:"Pzt", points:5,  status:"completed" },
  { day:"Sal", points:5,  status:"completed" },
  { day:"Çar", points:10, status:"completed" },
  { day:"Per", points:10, status:"completed" },
  { day:"Cum", points:15, status:"today", label:"Bugün" },
  { day:"Cmt", points:20, status:"upcoming" },
  { day:"Paz", points:50, status:"bonus", isGift:true },
];

const TODAY_TASKS: EarnTask[] = [
  { id:"dt-1", title:"Günlük giriş yap",           category:"daily", section:"today", points:10, progress:1, progressMax:1, status:"claimed",  buttonLabel:"Alındı",    buttonDisabled:true, icon:"login" },
  { id:"dt-2", title:"Club'da bir gönderiye yorum yap", category:"club",  section:"today", points:20, progress:0, progressMax:1, status:"pending", buttonLabel:"Göreve Git", icon:"comment", link:"/club" },
  { id:"dt-3", title:"Bir rehber yazısı oku",       category:"guide", section:"today", points:15, progress:0, progressMax:1, status:"pending", buttonLabel:"Oku",        icon:"book",    link:"/rehber" },
  { id:"dt-4", title:"AI Asistan'a bir soru sor",   category:"daily", section:"today", points:10, progress:0, progressMax:1, status:"pending", buttonLabel:"Sor",        icon:"ai",      link:"/ai-asistan" },
];

const WEEKLY_TASKS: EarnTask[] = [
  { id:"wt-1", title:"3 Club paylaşımı yap",    category:"club",  section:"weekly", points:75,  progress:1, progressMax:3, status:"in_progress", buttonLabel:"Göreve Git", icon:"post",     link:"/club" },
  { id:"wt-2", title:"5 faydalı yorum bırak",   category:"club",  section:"weekly", points:50,  progress:2, progressMax:5, status:"in_progress", buttonLabel:"Göreve Git", icon:"comments", link:"/club" },
  { id:"wt-3", title:"2 rehber tamamla",        category:"guide", section:"weekly", points:40,  progress:0, progressMax:2, status:"pending",     buttonLabel:"Göreve Git", icon:"guide",    link:"/rehber" },
  { id:"wt-4", title:"Mağazadan alışveriş yap", category:"shop",  section:"weekly", points:100, progress:0, progressMax:1, status:"pending",     buttonLabel:"Göreve Git", icon:"cart",     link:"/magaza" },
];

const ONETIME_TASKS: EarnTask[] = [
  { id:"ot-1", title:"Profilini tamamla",           category:"daily", section:"onetime", points:100, progress:60,  progressMax:100, status:"in_progress", buttonLabel:"Tamamla",  icon:"profile", link:"/hesabim/ayarlar" },
  { id:"ot-2", title:"Telefonunu doğrula",           category:"daily", section:"onetime", points:50,  progress:1,   progressMax:1,   status:"completed",   buttonLabel:"Alındı",   buttonDisabled:true, icon:"phone" },
  { id:"ot-3", title:"Toy Poodle profili oluştur",   category:"daily", section:"onetime", points:150, progress:0,   progressMax:1,   status:"pending",     buttonLabel:"Oluştur",  icon:"poodle", link:"/hesabim/poodle-profil" },
  { id:"ot-4", title:"Arkadaşını davet et",          category:"daily", section:"onetime", points:250, progress:0,   progressMax:1,   status:"pending",     buttonLabel:"Davet Et", icon:"invite" },
];

const COMPLETED_TASKS: CompletedTask[] = [
  { id:"ct-1", title:"Club'da gönderi beğen",  points:5,  date:"24 Temmuz 2026" },
  { id:"ct-2", title:"Favorilere ürün ekle",   points:5,  date:"23 Temmuz 2026" },
  { id:"ct-3", title:"Günlük giriş serisi",    points:15, date:"23 Temmuz 2026" },
];

const FAQ_ITEMS = [
  { id:"faq-1", q:"Puanlar ne zaman yüklenir?",       a:"Görev tamamlandığında puanlar anında hesabınıza eklenir. Alışveriş puanları teslimattan 24 saat sonra yüklenir." },
  { id:"faq-2", q:"Puanların son kullanma tarihi var mı?", a:"Puanlar 12 ay geçerlidir. Sona erecek puanlar size önceden bildirilir." },
  { id:"faq-3", q:"Görevler her gün yenilenir mi?",   a:"Günlük görevler her gece yarısı, haftalık görevler her Pazartesi yenilenir." },
];

const SHOPPING_MULTIPLIERS = [
  { label:"Club Üyesi", multiplier:"x2" },
  { label:"Seçili Ürünler", multiplier:"x3" },
  { label:"Doğum Gününde", multiplier:"x5" },
];

/* ── Task icon map ───────────────────── */
function TaskIcon({ icon }: { icon: string }) {
  const sz = 18; const col = P;
  switch (icon) {
    case "login":    return <PawPrint   size={sz} color={col}/>;
    case "comment":  return <MessageSquare size={sz} color={col}/>;
    case "book":     return <BookOpen   size={sz} color={col}/>;
    case "ai":       return <Bot        size={sz} color={col}/>;
    case "post":     return <Star       size={sz} color={col}/>;
    case "comments": return <MessageSquare size={sz} color={col}/>;
    case "guide":    return <BookOpen   size={sz} color={col}/>;
    case "cart":     return <ShoppingCart size={sz} color={col}/>;
    case "profile":  return <User       size={sz} color={col}/>;
    case "phone":    return <Smartphone size={sz} color={col}/>;
    case "poodle":   return <PawPrint   size={sz} color={col}/>;
    case "invite":   return <UserPlus   size={sz} color={col}/>;
    default:         return <Ticket     size={sz} color={col}/>;
  }
}

/* ── Toast ───────────────────────────── */
function Toast({ msg, onClose }: { msg:string; onClose:()=>void }) {
  return (
    <div style={{ position:"fixed", top:20, left:"50%", transform:"translateX(-50%)",
                  background:"#111827", color:"#fff", borderRadius:12, padding:"10px 18px",
                  fontSize:13, fontWeight:600, zIndex:99999, whiteSpace:"nowrap",
                  boxShadow:"0 4px 20px rgba(0,0,0,.3)", display:"flex", gap:10, alignItems:"center" }}>
      <Check size={14} color="#4ADE80"/>
      {msg}
      <button onClick={onClose} style={{ background:"none", border:"none", color:"#9CA3AF", cursor:"pointer", padding:0 }}>✕</button>
    </div>
  );
}

/* ── Main Page ───────────────────────── */
export default function YPPuanKazanPage() {
  const [, navigate] = useLocation();
  const { customer } = useCustomer();

  // Derive a stable referral code from customer id (no PII in the code)
  const referralCode = useMemo(() => {
    if (!customer?.id) return "YP0000";
    const n = String(customer.id).padStart(5, "0");
    return `YP${n}`;
  }, [customer?.id]);

  const { data: loyalty } = useQuery({ queryKey: ["/api/customer/loyalty"], queryFn: fetchLoyalty });

  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [expandedFaq, setExpandedFaq]   = useState<string|null>(null);
  const [codeCopied, setCodeCopied]     = useState(false);
  const [toast, setToast]               = useState<string|null>(null);

  const balance = loyalty?.balance ?? 0;

  const showToast = (msg:string) => { setToast(msg); setTimeout(()=>setToast(null), 3000); };

  function claimStreak() {
    showToast("Günlük puanlar sipariş ve görevlerle otomatik yüklenir");
  }

  function taskAction(task: EarnTask) {
    if (task.status === "claimed" || task.buttonDisabled) return;
    if (task.link) { navigate(task.link); return; }
    if (task.icon === "invite") {
      copyReferralCode();
      return;
    }
    showToast("Puanlar sipariş tamamlandığında otomatik yüklenir");
  }

  function copyReferralCode() {
    navigator.clipboard.writeText(referralCode).catch(()=>{});
    setCodeCopied(true); setTimeout(()=>setCodeCopied(false), 2000);
    showToast(`${referralCode} kopyalandı ✓`);
  }

  function shareReferral() {
    if (navigator.share) {
      navigator.share({ title:"YourPoodle", text:`${referralCode} koduyla 250 PoodlePuan kazan!`, url:"https://yourpoodle.com" }).catch(()=>{});
    } else {
      navigator.clipboard.writeText(`https://yourpoodle.com?ref=${referralCode}`).catch(()=>{});
      showToast("Davet bağlantısı kopyalandı ✓");
    }
  }

  // Filter logic
  const showSection = (section: string, categories: string[]) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "daily") return section === "today" || section === "onetime";
    if (activeFilter === "club") return categories.includes("club");
    if (activeFilter === "shop") return categories.includes("shop");
    if (activeFilter === "guide") return categories.includes("guide");
    return false;
  };

  const filterTasks = (tasks: EarnTask[]) => {
    if (activeFilter === "all") return tasks;
    if (activeFilter === "daily") return tasks.filter(t => t.category === "daily");
    if (activeFilter === "club") return tasks.filter(t => t.category === "club");
    if (activeFilter === "shop") return tasks.filter(t => t.category === "shop");
    if (activeFilter === "guide") return tasks.filter(t => t.category === "guide");
    return tasks;
  };

  const filteredToday  = filterTasks(TODAY_TASKS);
  const filteredWeekly = filterTasks(WEEKLY_TASKS);
  const filteredOnetime= filterTasks(ONETIME_TASKS);

  const showToday   = activeFilter === "all" || activeFilter === "daily" || activeFilter === "club" || activeFilter === "guide";
  const showWeekly  = activeFilter === "all" || activeFilter === "club" || activeFilter === "guide" || activeFilter === "shop";
  const showOnetime = activeFilter === "all" || activeFilter === "daily";
  const showShop    = activeFilter === "all" || activeFilter === "shop";
  const showStreak  = activeFilter === "all" || activeFilter === "daily";

  return (
    <YPLayout activeLink="club" constrain={false}>
      {toast && <Toast msg={toast} onClose={()=>setToast(null)}/>}

      <div className="yp-acct" style={{ margin:"0 auto", background:BG, minHeight:"100vh", paddingBottom:32, fontFamily:"Inter,sans-serif" }}>

        {/* ── BREADCRUMB ── */}
        <div style={{ padding:"12px 16px 0" }}>
          <button onClick={()=>goBack(navigate, "/hesabim/poodle-puanlari")}
            style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:6, padding:0 }}>
            <ArrowLeft size={15} color={P}/>
            <span style={{ fontSize:11, color:P, fontWeight:500 }}>Hesabım / PoodlePuanlarım / Puan Kazan</span>
          </button>
        </div>

        {/* ── PAGE TITLE ── */}
        <div style={{ padding:"8px 16px 12px" }}>
          <div style={{ fontSize:21, fontWeight:900, color:P }}>Puan Kazanma Yolları</div>
          <div style={{ fontSize:12, color:GT, marginTop:2 }}>Görevleri tamamla, puan kazan, ödüllerin keyfini çıkar.</div>
        </div>

        {/* ── BALANCE HERO ── */}
        <div style={{ margin:"0 16px 12px", borderRadius:20, background:`linear-gradient(135deg,${P},${PD})`,
                      padding:"16px", position:"relative", overflow:"hidden" }}>
          {/* Dot pattern */}
          <div style={{ position:"absolute", inset:0, opacity:.06, pointerEvents:"none",
                        backgroundImage:`radial-gradient(circle,#fff 1.5px,transparent 1.5px)`,
                        backgroundSize:"20px 20px" }}/>
          <div style={{ display:"flex", gap:12 }}>
            {/* Left */}
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                <div style={{ width:40, height:40, borderRadius:999, flexShrink:0,
                              background:`radial-gradient(circle at 35% 35%,${GOLDB},#D97706)`,
                              display:"flex", alignItems:"center", justifyContent:"center",
                              boxShadow:"0 2px 8px rgba(0,0,0,.2)" }}>
                  <PawPrint size={18} color="#fff" strokeWidth={2.5}/>
                </div>
                <div>
                  <div style={{ fontSize:19, fontWeight:900, color:"#fff" }}>{balance.toLocaleString("tr-TR")} <span style={{ fontSize:12, fontWeight:600 }}>PoodlePuan</span></div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,.75)" }}>{(balance * 0.1).toFixed(2).replace(".",",")} TL değerinde</div>
                </div>
              </div>
              <button onClick={()=>navigate("/hesabim/poodle-puanlari")}
                style={{ background:"none", border:"none", cursor:"pointer", fontFamily:"inherit",
                         fontSize:10, color:"rgba(255,255,255,.9)", padding:0, textDecoration:"underline", textUnderlineOffset:2 }}>
                Puan Geçmişi &gt;
              </button>
            </div>
            {/* Right */}
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:4 }}>
                <div style={{ width:28, height:28, borderRadius:999, flexShrink:0,
                              background:`radial-gradient(circle at 35% 35%,${GOLDB},#D97706)`,
                              display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Medal size={14} color="#fff"/>
                </div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,.9)", lineHeight:1.4 }}>
                  Gold Poodle seviyesine<br/>
                  <strong>1.225 puan kaldı</strong>
                </div>
              </div>
              {/* Progress bar */}
              <div style={{ height:7, background:"rgba(255,255,255,.2)", borderRadius:999, overflow:"hidden", marginBottom:5 }}>
                <div style={{ height:"100%", width:"39%", background:GOLDB, borderRadius:999 }}/>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                <Medal size={11} color="rgba(255,255,255,.8)"/>
                <span style={{ fontSize:10, color:"rgba(255,255,255,.85)" }}>Mevcut Seviye: Silver Poodle</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── GÜNLÜK GİRİŞ SERİSİ ── */}
        {showStreak && (
          <div style={{ margin:"0 16px 12px", background:"#fff", borderRadius:20,
                        border:`1px solid ${GB}`, boxShadow:"0 1px 5px rgba(0,0,0,.05)", padding:"14px 14px 12px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <Flame size={18} color="#EA580C"/>
                <span style={{ fontSize:13, fontWeight:800, color:DRK }}>Günlük Giriş Serisi</span>
              </div>
              <span style={{ fontSize:11, fontWeight:700, color:"#EA580C" }}>Serin: 5 gün</span>
            </div>

            {/* 7-day row */}
            <div style={{ display:"flex", justifyContent:"space-between", gap:4, overflowX:"auto", marginBottom:12 }}>
              {STREAK_DAYS.map((d) => {
                const isClaimed = d.status === "completed";
                const isToday   = d.status === "today";
                const isBonus   = d.status === "bonus";
                const isUpcoming= d.status === "upcoming";

                let circleStyle: React.CSSProperties = {
                  width:38, height:38, borderRadius:999, flexShrink:0,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:11, fontWeight:800, margin:"0 auto",
                };
                if (isClaimed)  { circleStyle = { ...circleStyle, background:PL }; }
                if (isToday)    { circleStyle = { ...circleStyle, background:BLUL, border:`2px solid ${BLU}` }; }
                if (isBonus)    { circleStyle = { ...circleStyle, background:PL }; }
                if (isUpcoming) { circleStyle = { ...circleStyle, background:"#F3F4F6" }; }

                return (
                  <div key={d.day} style={{ display:"flex", flexDirection:"column", alignItems:"center", minWidth:40 }}>
                    <div style={circleStyle}>
                      {isClaimed && <Check size={14} color={P} strokeWidth={3}/>}
                      {isToday   && <span style={{ color:BLU, fontSize:11, fontWeight:900 }}>+{d.points}</span>}
                      {isBonus   && <Gift size={14} color={P}/>}
                      {isUpcoming && <span style={{ color:"#9CA3AF", fontSize:10 }}>+{d.points}</span>}
                    </div>
                    <div style={{ fontSize:9, color: isToday ? BLU : (isClaimed ? P : GT), fontWeight:600, marginTop:3, textAlign:"center" }}>
                      {d.day}
                    </div>
                    {d.label && <div style={{ fontSize:8, color:BLU, fontWeight:700 }}>{d.label}</div>}
                    {!isToday && (
                      <div style={{ fontSize:8, color: isClaimed ? P : (isUpcoming ? "#9CA3AF" : GT), fontWeight:600 }}>
                        +{d.points}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Claim button */}
            <button onClick={claimStreak}
              style={{ width:"100%", background:P, color:"#fff",
                       border:"none", borderRadius:12, padding:"11px 0", fontSize:12,
                       fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
              Nasıl Puan Kazanırım?
            </button>
          </div>
        )}

        {/* ── FILTER TABS ── */}
        <div style={{ padding:"0 16px 12px", display:"flex", gap:8, overflowX:"auto" }}>
          {([
            { key:"all",   label:"Tümü"   },
            { key:"daily", label:"Günlük" },
            { key:"club",  label:"Club"   },
            { key:"shop",  label:"Mağaza" },
            { key:"guide", label:"Rehber" },
          ] as { key:FilterTab; label:string }[]).map(t => (
            <button key={t.key} onClick={()=>setActiveFilter(t.key)}
              style={{ flexShrink:0, background: activeFilter===t.key ? P : "#fff",
                       color: activeFilter===t.key ? "#fff" : "#374151",
                       border: activeFilter===t.key ? "none" : `1px solid ${GB}`,
                       borderRadius:20, padding:"7px 14px", fontSize:12,
                       fontWeight: activeFilter===t.key ? 700 : 400,
                       cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── BUGÜNÜN GÖREVLERİ ── */}
        {showToday && filteredToday.length > 0 && (
          <TaskSection title="Bugünün Görevleri" tasks={filteredToday}
            onAction={taskAction} showToast={showToast} />
        )}

        {/* ── HAFTALIK GÖREVLER ── */}
        {showWeekly && filteredWeekly.length > 0 && (
          <>
            {/* Weekly bonus bar */}
            {activeFilter === "all" || activeFilter === "club" ? (
              <div style={{ margin:"0 16px 4px", background:PL, borderRadius:14, padding:"10px 12px",
                            display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:DRK, marginBottom:5 }}>
                    Tümünü tamamla, +200 bonus kazan
                  </div>
                  <div style={{ height:5, background:"rgba(93,62,189,.15)", borderRadius:999, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:"40%", background:P, borderRadius:999 }}/>
                  </div>
                  <div style={{ fontSize:10, color:GT, marginTop:3 }}>2/5 tamamlandı</div>
                </div>
                <span style={{ fontSize:14, fontWeight:900, color:GOLDB }}>+200</span>
              </div>
            ) : null}
            <TaskSection title="Haftalık Görevler" tasks={filteredWeekly}
              onAction={taskAction} showToast={showToast} />
          </>
        )}

        {/* ── TEK SEFERLİK GÖREVLER ── */}
        {showOnetime && filteredOnetime.length > 0 && (
          <TaskSection title="Tek Seferlik Görevler" tasks={filteredOnetime}
            onAction={taskAction} showToast={showToast} />
        )}

        {/* ── REFERRAL BANNER ── */}
        {(activeFilter === "all" || activeFilter === "daily") && (
          <div style={{ margin:"0 16px 12px", borderRadius:20, background:`linear-gradient(135deg,${P},${PD})`,
                        padding:"16px", position:"relative", overflow:"hidden" }}>
            {/* Poodle photos decorative */}
            <div style={{ position:"absolute", right:-10, top:0, bottom:0, width:120,
                          display:"flex", alignItems:"center", justifyContent:"flex-end" }}>
              <img src="https://images.unsplash.com/photo-1581888227599-779811939961?w=100&h=100&fit=crop"
                   alt="" style={{ position:"absolute", right:12, bottom:0, width:70, height:70,
                                   borderRadius:999, objectFit:"cover", border:"2px solid rgba(255,255,255,.4)" }}
                   onError={e=>{(e.target as HTMLImageElement).style.display="none"}}/>
              <img src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=100&h=100&fit=crop"
                   alt="" style={{ position:"absolute", right:46, bottom:8, width:55, height:55,
                                   borderRadius:999, objectFit:"cover", border:"2px solid rgba(255,255,255,.4)" }}
                   onError={e=>{(e.target as HTMLImageElement).style.display="none"}}/>
            </div>

            <div style={{ position:"relative", zIndex:2, maxWidth:"65%" }}>
              <div style={{ fontSize:13, fontWeight:900, color:"#fff", lineHeight:1.35, marginBottom:10 }}>
                Arkadaşını Davet Et,<br/>
                <span style={{ fontSize:16, color:GOLDB }}>250 PoodlePuan</span> Kazan
              </div>

              {/* Code box */}
              <div style={{ background:"rgba(255,255,255,.2)", borderRadius:12, padding:"8px 12px",
                            display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontSize:13, fontWeight:800, color:"#fff", letterSpacing:2 }}>{referralCode}</span>
                <button onClick={copyReferralCode}
                  style={{ background:"none", border:"none", cursor:"pointer", padding:2 }}>
                  {codeCopied ? <Check size={15} color="#4ADE80"/> : <Copy size={15} color="rgba(255,255,255,.8)"/>}
                </button>
              </div>

              <div style={{ fontSize:10, color:"rgba(255,255,255,.75)", marginBottom:10, lineHeight:1.5 }}>
                Davet ettiğin arkadaşın kayıt işlemini tamamladığında puanlar hesabına yüklenecektir.
              </div>

              <button onClick={shareReferral}
                style={{ background:"#fff", color:P, border:"none", borderRadius:12,
                         padding:"8px 20px", fontSize:11, fontWeight:700,
                         cursor:"pointer", fontFamily:"inherit",
                         display:"inline-flex", alignItems:"center", gap:6 }}>
                <Share2 size={13} color={P}/> Paylaş
              </button>
            </div>
          </div>
        )}

        {/* ── ALIŞVERİŞLE PUAN KAZAN ── */}
        {showShop && (
          <div style={{ margin:"0 16px 12px", background:BLUL, borderRadius:20,
                        border:"1px solid #BFDBFE", padding:"14px" }}>
            <div style={{ display:"flex", gap:12 }}>
              {/* Left icon */}
              <div style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                <div style={{ width:42, height:42, background:"#fff", borderRadius:14,
                              display:"flex", alignItems:"center", justifyContent:"center",
                              boxShadow:"0 1px 4px rgba(0,0,0,.08)" }}>
                  <ShoppingBag size={20} color={BLU}/>
                </div>
                <div style={{ display:"flex", gap:2 }}>
                  {[GOLDB,"#F59E0B","#D97706"].map((c,i)=>(
                    <div key={i} style={{ width:8, height:8, borderRadius:999, background:c }}/>
                  ))}
                </div>
              </div>
              {/* Content */}
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:800, color:DRK, marginBottom:2 }}>Alışverişle Puan Kazan</div>
                <div style={{ fontSize:11, color:GT, marginBottom:8 }}>Her 10 TL alışverişe 1 PoodlePuan</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:10 }}>
                  {SHOPPING_MULTIPLIERS.map(m => (
                    <div key={m.label} style={{ background:"#fff", border:`1px solid ${GB}`,
                                                borderRadius:20, padding:"3px 8px",
                                                fontSize:10, fontWeight:700, color:DRK }}>
                      {m.label} <span style={{ color:BLU }}>{m.multiplier}</span>
                    </div>
                  ))}
                </div>
                <button onClick={()=>navigate("/magaza")}
                  style={{ width:"100%", background:BLU, color:"#fff", border:"none",
                           borderRadius:12, padding:"10px 0", fontSize:12, fontWeight:700,
                           cursor:"pointer", fontFamily:"inherit" }}>
                  Mağazaya Git
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TAMAMLANAN GÖREVLER ── */}
        {(activeFilter === "all" || activeFilter === "daily") && (
          <div style={{ padding:"0 16px 12px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <span style={{ fontSize:13, fontWeight:800, color:DRK }}>Tamamlanan Görevler</span>
              <button onClick={()=>showToast("Tüm tamamlanan görevler görüntüleniyor")}
                style={{ background:"none", border:"none", color:P, fontSize:11,
                         fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                Tümünü Gör &gt;
              </button>
            </div>
            <div style={{ background:"#fff", borderRadius:18, border:`1px solid ${GB}`,
                          overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
              {COMPLETED_TASKS.map((t, i) => (
                <div key={t.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 14px",
                                          borderBottom: i<COMPLETED_TASKS.length-1 ? `1px solid #F9FAFB` : "none" }}>
                  <CheckCircle size={16} color={GRN} style={{ flexShrink:0 }}/>
                  <span style={{ flex:1, fontSize:12, color:DRK, fontWeight:500 }}>{t.title}</span>
                  <span style={{ fontSize:12, fontWeight:700, color:GRN }}>+{t.points}</span>
                  <span style={{ fontSize:10, color:GT, marginLeft:6 }}>
                    {t.date.replace(" 2026","")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── FAQ ── */}
        <div style={{ padding:"0 16px 12px" }}>
          <div style={{ fontSize:13, fontWeight:800, color:DRK, marginBottom:8 }}>Sık Sorulan Sorular</div>
          <div style={{ background:"#fff", borderRadius:18, border:`1px solid ${GB}`,
                        overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
            {FAQ_ITEMS.map((f, i) => {
              const open = expandedFaq === f.id;
              return (
                <div key={f.id} style={{ borderBottom: i<FAQ_ITEMS.length-1 ? `1px solid #F9FAFB` : "none" }}>
                  <button onClick={()=>setExpandedFaq(open ? null : f.id)}
                    style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center",
                             padding:"13px 16px", background:"none", border:"none", cursor:"pointer",
                             textAlign:"left", fontFamily:"inherit" }}>
                    <span style={{ fontSize:12, fontWeight:600, color:DRK }}>{f.q}</span>
                    {open ? <ChevronUp size={15} color={GT}/> : <ChevronDown size={15} color={GT}/>}
                  </button>
                  {open && <div style={{ padding:"0 16px 13px", fontSize:11, color:GT, lineHeight:1.65 }}>{f.a}</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── BİLDİRİMLER CTA ── */}
        <div style={{ margin:"0 16px 16px", background:PL, borderRadius:20, padding:"14px 16px",
                      display:"flex", alignItems:"center", gap:12 }}>
          <img src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=120&h=120&fit=crop"
               alt="Poodle" style={{ width:48, height:48, borderRadius:999, objectFit:"cover",
                                     flexShrink:0, border:"2px solid #fff",
                                     boxShadow:"0 2px 6px rgba(0,0,0,.1)" }}
               onError={e=>{(e.target as HTMLImageElement).style.display="none"}}/>
          <div style={{ flex:1, fontSize:12, fontWeight:700, color:DRK, lineHeight:1.45 }}>
            Her gün yeni görevler seni bekliyor!<br/>
            <span style={{ fontWeight:400, color:GT, fontSize:11 }}>Hiçbir fırsatı kaçırma.</span>
          </div>
          <button onClick={()=>{ navigate("/hesabim/ayarlar"); }}
            style={{ flexShrink:0, background:P, color:"#fff", border:"none",
                     borderRadius:12, padding:"9px 14px", fontSize:10, fontWeight:700,
                     cursor:"pointer", fontFamily:"inherit",
                     display:"flex", alignItems:"center", gap:5 }}>
            <Bell size={13} color="#fff"/> Bildirimleri Aç
          </button>
        </div>

        {/* ── FOOTER ── */}
        <div style={{ background:P, padding:"22px 20px 32px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
            <div style={{ width:28, height:28, borderRadius:999, background:"rgba(255,255,255,.2)",
                          display:"flex", alignItems:"center", justifyContent:"center" }}>
              <PawPrint size={15} color="#fff"/>
            </div>
            <span style={{ fontSize:15, fontWeight:800, color:"#fff" }}>YourPoodle</span>
          </div>
          <div style={{ display:"flex", gap:0, marginBottom:8, flexWrap:"wrap" }}>
            {["Yardım","İletişim","KVKK"].map((l,i,arr) => (
              <span key={l} style={{ fontSize:11, color:"rgba(255,255,255,.8)" }}>
                {l}{i<arr.length-1 && <span style={{ color:"rgba(255,255,255,.35)", margin:"0 6px" }}>•</span>}
              </span>
            ))}
          </div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,.5)" }}>© 2026 YourPoodle</div>
        </div>
      </div>
    </YPLayout>
  );
}

/* ── Task Section Component ─────────── */
function TaskSection({ title, tasks, onAction, showToast }:{
  title:string; tasks:EarnTask[];
  onAction:(t:EarnTask)=>void;
  showToast:(m:string)=>void;
}) {
  return (
    <div style={{ padding:"0 16px 12px" }}>
      <div style={{ fontSize:13, fontWeight:800, color:DRK, marginBottom:8 }}>{title}</div>
      <div style={{ background:"#fff", borderRadius:18, border:`1px solid ${GB}`,
                    overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
        {tasks.map((task, i) => (
          <TaskRow key={task.id} task={task} isLast={i===tasks.length-1}
            onAction={onAction} showToast={showToast}/>
        ))}
      </div>
    </div>
  );
}

/* ── Task Row Component ──────────────── */
function TaskRow({ task, isLast, onAction, showToast }:{
  task:EarnTask; isLast:boolean;
  onAction:(t:EarnTask)=>void;
  showToast:(m:string)=>void;
}) {
  const isClaimed    = task.status === "claimed";
  const isCompleted  = task.status === "completed";
  const isDone       = isClaimed || isCompleted;

  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 14px",
                  borderBottom: isLast ? "none" : `1px solid #F9FAFB` }}>
      {/* Icon */}
      <div style={{ width:38, height:38, borderRadius:12, background:PL, flexShrink:0,
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
        <TaskIcon icon={task.icon}/>
      </div>

      {/* Center */}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:12, fontWeight:700, color:DRK, marginBottom:3,
                      overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
          {task.title}
        </div>
        {/* Progress bar */}
        {task.progressMax > 1 && (
          <div style={{ height:4, background:"#F3F4F6", borderRadius:999, overflow:"hidden",
                        maxWidth:120, marginBottom:2 }}>
            <div style={{ height:"100%", width:`${(task.progress/task.progressMax)*100}%`,
                          background:P, borderRadius:999 }}/>
          </div>
        )}
        {task.progressMax > 1 && (
          <div style={{ fontSize:9, color:GT }}>{task.progress}/{task.progressMax}</div>
        )}
        {task.progressMax === 100 && task.progress > 0 && task.progress < 100 && (
          <>
            <div style={{ height:4, background:"#F3F4F6", borderRadius:999, overflow:"hidden",
                          maxWidth:120, marginBottom:2 }}>
              <div style={{ height:"100%", width:`${task.progress}%`, background:P, borderRadius:999 }}/>
            </div>
            <div style={{ fontSize:9, color:GT }}>{task.progress}%</div>
          </>
        )}
        {isCompleted && (
          <div style={{ fontSize:9, color:GT, display:"flex", alignItems:"center", gap:3 }}>
            <Check size={9} color={GRN}/> Tamamlandı
          </div>
        )}
      </div>

      {/* Points badge */}
      <div style={{ display:"flex", alignItems:"center", gap:3, flexShrink:0 }}>
        <Coins size={12} color={GOLDB}/>
        <span style={{ fontSize:11, fontWeight:800, color:GOLDB }}>+{task.points}</span>
      </div>

      {/* Action button */}
      <div style={{ flexShrink:0 }}>
        {isDone ? (
          <div style={{ background:"#F0FDF4", color:GRN, borderRadius:10,
                        padding:"5px 8px", fontSize:10, fontWeight:700,
                        display:"flex", alignItems:"center", gap:3 }}>
            <Check size={10} color={GRN}/> Alındı
          </div>
        ) : (
          <button onClick={()=>onAction(task)}
            style={{ background:"none", border:`1.5px solid ${P}`, color:P,
                     borderRadius:10, padding:"5px 8px", fontSize:10, fontWeight:700,
                     cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>
            {task.buttonLabel}
          </button>
        )}
      </div>
    </div>
  );
}
