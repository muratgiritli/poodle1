// Route: /hesabim/destek-talepleri
import { useState } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft, Plus, List, Clock, MessageCircle, CheckCircle,
  Search, SlidersHorizontal, ArrowUpDown, Paperclip,
  Check, Truck, PawPrint, Phone, ChevronRight,
  Star, Headphones, X,
} from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";

/* ── Palette ─────────────────────────── */
const P    = "#5D3EBD";
const PL   = "#F5F0E6";
const NAV  = "#1D1E9B";
const DRK  = "#111827";
const GT   = "#6B7280";
const GB   = "#E5E7EB";
const GBG  = "#F9F9FB";
const OBG  = "#FFF7ED";
const OFG  = "#EA580C";
const BBG  = "#EFF6FF";
const BFG  = "#3B82F6";
const GRN  = "#16A34A";
const GRNB = "#F0FDF4";

/* ── Types ────────────────────────────── */
type TicketTab = "all" | "open" | "replied" | "solved";

/* ── Mock data (from image + prompt) ─── */
const OPEN_TICKETS = [
  {
    id: "YP-4822",
    title: "Siparişimde bir ürün eksik geldi",
    category: "Sipariş ve Teslimat",
    issue: "Eksik Ürün",
    orderId: "YP-20260723",
    date: "24 Temmuz 2026",
    time: "00:52",
    lastUpdate: "2 dk önce",
    statusLabel: "İnceleniyor",
    progressStage: 1,
    attachmentCount: 2,
  },
];

const AWAITING_TICKETS = [
  {
    id: "YP-4798",
    title: "Tasma beden değişimi",
    category: "İade / Değişim",
    lastMsg: "YourPoodle Destek: Değişim talebiniz onaylandı...",
    date: "22 Temmuz 2026",
    newMsgCount: 1,
  },
  {
    id: "YP-4754",
    title: "Kupon kodu uygulanmıyor",
    category: "Ödeme ve Kampanya",
    lastMsg: "YourPoodle Destek: Kuponunuz hesabınıza yeniden tanımlandı...",
    date: "18 Temmuz 2026",
    newMsgCount: 0,
  },
];

const SOLVED_TICKETS = [
  { id: "YP-4612", title: "Kargo teslimat gecikmesi",     date: "12 Temmuz 2026",  Icon: Truck,    isEvaluated: false, rating: 0 },
  { id: "YP-4521", title: "Club playlaşımı silme",        date: "4 Temmuz 2026",   Icon: PawPrint, isEvaluated: true,  rating: 5 },
  { id: "YP-4388", title: "Telefon numarası değişikliği", date: "28 Haziran 2026", Icon: Phone,    isEvaluated: true,  rating: 4 },
];

const OLDER_TICKETS = [
  { id: "YP-4200", title: "İade talebi", date: "28 Haziran 2026", Icon: Truck, isEvaluated: true, rating: 5 },
];

const PROGRESS_STEPS = ["Alındı", "İnceleniyor", "Yanıt", "Çözüldü"];

/* ── Star Rating ─────────────────────── */
function StarRating({ ticketId, initialRating, onRate }: {
  ticketId: string; initialRating: number; onRate: (id: string, n: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display:"flex", gap:2, marginTop:4 }}>
      {[1,2,3,4,5].map(n => (
        <button key={n}
          onClick={e => { e.stopPropagation(); onRate(ticketId, n); }}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          style={{ background:"none", border:"none", cursor:"pointer", padding:0, lineHeight:1 }}>
          <Star size={13}
            fill={(hovered || initialRating) >= n ? "#FBBF24" : "none"}
            color={(hovered || initialRating) >= n ? "#FBBF24" : GB}
            strokeWidth={1.5} />
        </button>
      ))}
    </div>
  );
}

/* ── Progress Stepper ────────────────── */
function ProgressStepper({ currentStep }: { currentStep: number }) {
  return (
    <div style={{ margin:"12px 0 14px" }}>
      <div style={{ display:"flex", alignItems:"center", position:"relative" }}>
        {PROGRESS_STEPS.map((label, i) => {
          const isCompleted = i < currentStep;
          const isActive    = i === currentStep;
          const isPending   = i > currentStep;
          return (
            <div key={label} style={{ display:"flex", alignItems:"center", flex: i < PROGRESS_STEPS.length - 1 ? 1 : "none" }}>
              {/* Circle */}
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0 }}>
                <div style={{
                  width:24, height:24, borderRadius:"50%",
                  background: isPending ? GB : P,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  boxShadow: isActive ? `0 0 0 3px ${PL}` : "none",
                }}>
                  {isCompleted
                    ? <Check size={12} color="#fff" strokeWidth={3} />
                    : <span style={{ fontSize:9, fontWeight:700, color: isPending ? GT : "#fff" }}>{i+1}</span>
                  }
                </div>
                <span style={{
                  fontSize:8.5, marginTop:4, textAlign:"center", whiteSpace:"nowrap",
                  color: isPending ? "#9CA3AF" : P,
                  fontWeight: isActive || isCompleted ? 600 : 400,
                }}>
                  {label}
                </span>
              </div>
              {/* Connector */}
              {i < PROGRESS_STEPS.length - 1 && (
                <div style={{
                  flex:1, height:2, margin:"0 2px", marginBottom:14,
                  background: i < currentStep ? P : GB,
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Create Ticket Modal ─────────────── */
function CreateTicketModal({ onClose, onSubmit }: {
  onClose: () => void; onSubmit: () => void;
}) {
  const [topic, setTopic] = useState("");
  const [desc,  setDesc]  = useState("");
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)",
                  display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:9999 }}>
      <div style={{ background:"#fff", borderRadius:"20px 20px 0 0",
                    padding:"24px 20px 40px", width:"100%", maxWidth: "var(--yp-shell-max)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
          <span style={{ fontSize:16, fontWeight:700, color:DRK }}>Yeni Talep Oluştur</span>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer" }}>
            <X size={20} color={GT} />
          </button>
        </div>
        <select value={topic} onChange={e => setTopic(e.target.value)}
          style={{ width:"100%", border:`1px solid ${GB}`, borderRadius:12,
                   padding:"10px 14px", fontSize:14, color:DRK, marginBottom:12,
                   background:"#fff", appearance:"none", fontFamily:"inherit" }}>
          <option value="">Konu seçin</option>
          <option>Sipariş ve Teslimat</option>
          <option>Ürünler</option>
          <option>Club</option>
          <option>Üyelik</option>
          <option>Ödeme</option>
        </select>
        <textarea value={desc} onChange={e => setDesc(e.target.value)}
          placeholder="Sorununuzu açıklayın..."
          rows={4}
          style={{ width:"100%", border:`1px solid ${GB}`, borderRadius:12,
                   padding:"10px 14px", fontSize:14, color:DRK, fontFamily:"inherit",
                   resize:"none", boxSizing:"border-box", marginBottom:16 }} />
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onClose}
            style={{ flex:1, border:`1.5px solid ${GB}`, borderRadius:12, padding:"11px 0",
                     fontSize:14, fontWeight:600, color:GT, background:"#fff",
                     cursor:"pointer", fontFamily:"inherit" }}>
            İptal
          </button>
          <button onClick={onSubmit}
            style={{ flex:1, background:P, border:"none", borderRadius:12, padding:"11px 0",
                     fontSize:14, fontWeight:600, color:"#fff", cursor:"pointer", fontFamily:"inherit" }}>
            Gönder
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════
   MAIN PAGE
════════════════════════════ */
export default function YPDestekTalepleriPage() {
  const [, navigate] = useLocation();

  const [activeTab, setActiveTab]   = useState<TicketTab>("all");
  const [search,    setSearch]      = useState("");
  const [showOlder, setShowOlder]   = useState(false);
  const [modalOpen, setModalOpen]   = useState(false);
  const [toast,     setToast]       = useState("");
  const [ratings,   setRatings]     = useState<Record<string, number>>({
    "YP-4521": 5, "YP-4388": 4,
  });
  const [evaluated, setEvaluated]   = useState<Record<string, boolean>>({
    "YP-4521": true, "YP-4388": true,
  });

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  const viewTicket  = (id: string) => navigate(`/hesabim/yardim/talep/${id}`);
  const replyTicket = (id: string) => navigate(`/hesabim/yardim/talep/${id}`);

  const setRating = (id: string, _n: number) => {
    navigate(`/hesabim/destek-talepleri/degerlendir/${id}`);
  };

  const handleSubmitTicket = () => {
    setModalOpen(false);
    navigate("/hesabim/yardim/talep/YP-4822");
    showToast("Talebiniz oluşturuldu ✓");
  };

  /* Filtering */
  const q = search.toLowerCase();

  const filteredOpen = OPEN_TICKETS.filter(t =>
    (!q || t.id.toLowerCase().includes(q) || t.title.toLowerCase().includes(q))
  );
  const filteredAwaiting = AWAITING_TICKETS.filter(t =>
    (!q || t.id.toLowerCase().includes(q) || t.title.toLowerCase().includes(q))
  );
  const baseSolved = showOlder ? [...SOLVED_TICKETS, ...OLDER_TICKETS] : SOLVED_TICKETS;
  const filteredSolved = baseSolved.filter(t =>
    (!q || t.id.toLowerCase().includes(q) || t.title.toLowerCase().includes(q))
  );

  const showOpenSec    = (activeTab === "all" || activeTab === "open")    && filteredOpen.length > 0;
  const showAwaitSec   = (activeTab === "all" || activeTab === "replied") && filteredAwaiting.length > 0;
  const showSolvedSec  = (activeTab === "all" || activeTab === "solved")  && filteredSolved.length > 0;
  const allEmpty       = !showOpenSec && !showAwaitSec && !showSolvedSec;

  return (
    <YPLayout activeLink="club" constrain={false}>
      <div style={{ maxWidth: "var(--yp-shell-max)", margin:"0 auto", background:GBG, minHeight:"100vh", fontFamily:"Inter, sans-serif" }}>

        {/* ── BREADCRUMB ── */}
        <div style={{ padding:"14px 16px 0" }}>
          <button onClick={() => navigate("/hesabim")}
            style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none",
                     cursor:"pointer", padding:0, fontFamily:"inherit" }}>
            <ArrowLeft size={15} color={P} />
            <span style={{ fontSize:12, color:P, fontWeight:500 }}>Hesabım / Destek Taleplerim</span>
          </button>
        </div>

        {/* ── TITLE ROW ── */}
        <div style={{ padding:"8px 16px 14px", display:"flex", justifyContent:"space-between",
                      alignItems:"flex-start", gap:10 }}>
          <div style={{ flex:1, minWidth:0 }}>
            <h1 style={{ margin:0, fontSize:20, fontWeight:700, color:P }}>Destek Taleplerim</h1>
            <p style={{ margin:"4px 0 0", fontSize:12, color:GT, lineHeight:1.45 }}>
              Sorularınızı, taleplerinizi ve çözüm durumlarını buradan takip edin.
            </p>
          </div>
          <button onClick={() => setModalOpen(true)}
            style={{ flexShrink:0, background:P, color:"#fff", border:"none",
                     borderRadius:12, padding:"9px 11px", fontSize:11, fontWeight:700,
                     cursor:"pointer", display:"flex", alignItems:"center", gap:5,
                     fontFamily:"inherit", whiteSpace:"nowrap" }}>
            <Plus size={13} />
            Yeni Talep Oluştur
          </button>
        </div>

        {/* ── STATS ROW ── */}
        <div style={{ padding:"0 16px 14px", display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:8 }}>
          {[
            { Icon: List,         bg: PL,   ic: P,   count: "6", label:"Toplam",    tab:"all"     },
            { Icon: Clock,        bg: OBG,  ic: OFG, count: "1", label:"Açık",      tab:"open"    },
            { Icon: MessageCircle,bg: BBG,  ic: BFG, count: "2", label:"Yanıtlandı",tab:"replied" },
            { Icon: CheckCircle,  bg: GRNB, ic: GRN, count: "3", label:"Çözüldü",   tab:"solved"  },
          ].map(({ Icon, bg, ic, count, label, tab }) => (
            <button key={label} onClick={() => setActiveTab(tab as TicketTab)}
              style={{ background:"#fff", border:`1px solid #F3F4F6`, borderRadius:14,
                       boxShadow:"0 1px 4px rgba(0,0,0,.06)", padding:"10px 4px",
                       textAlign:"center", cursor:"pointer", fontFamily:"inherit" }}>
              <div style={{ width:28, height:28, borderRadius:"50%", background:bg,
                            display:"flex", alignItems:"center", justifyContent:"center",
                            margin:"0 auto 5px" }}>
                <Icon size={14} color={ic} />
              </div>
              <div style={{ fontSize:17, fontWeight:700, color:ic }}>{count}</div>
              <div style={{ fontSize:9.5, color:GT, marginTop:2, lineHeight:1.2 }}>{label}</div>
            </button>
          ))}
        </div>

        {/* ── SEARCH ── */}
        <div style={{ padding:"0 16px 8px", position:"relative" }}>
          <Search size={15} color="#9CA3AF"
            style={{ position:"absolute", left:28, top:"50%", transform:"translateY(-50%)" }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Talep numarası veya konu ara..."
            style={{ width:"100%", boxSizing:"border-box", border:`1px solid ${GB}`,
                     borderRadius:14, paddingLeft:38, paddingRight:16, paddingTop:10, paddingBottom:10,
                     fontSize:13, color:DRK, background:"#fff", fontFamily:"inherit",
                     outline:"none" }} />
        </div>

        {/* ── FILTER + SORT ── */}
        <div style={{ padding:"0 16px 10px", display:"flex", gap:8 }}>
          <button onClick={() => showToast("Filtre yakında eklenecek")}
            style={{ display:"flex", alignItems:"center", gap:5, border:`1px solid ${GB}`,
                     borderRadius:12, padding:"8px 12px", fontSize:12, color:DRK,
                     background:"#fff", cursor:"pointer", fontFamily:"inherit" }}>
            <SlidersHorizontal size={13} />
            Filtrele
          </button>
          <button onClick={() => showToast("Sıralama yakında eklenecek")}
            style={{ border:`1px solid ${GB}`, borderRadius:12, padding:"8px 12px",
                     background:"#fff", cursor:"pointer", display:"flex", alignItems:"center" }}>
            <ArrowUpDown size={13} color={DRK} />
          </button>
        </div>

        {/* ── TABS ── */}
        <div style={{ padding:"0 16px 14px", display:"flex", gap:8, overflowX:"auto" }}>
          {[
            { key:"all",     label:"Tümü 6"      },
            { key:"open",    label:"Açık 1"       },
            { key:"replied", label:"Yanıtlandı 2" },
            { key:"solved",  label:"Çözüldü 3"    },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setActiveTab(key as TicketTab)}
              style={{
                flexShrink:0,
                background: activeTab === key ? P : "#fff",
                color: activeTab === key ? "#fff" : "#374151",
                border: activeTab === key ? "none" : `1px solid ${GB}`,
                borderRadius:20, padding:"7px 14px", fontSize:13,
                fontWeight: activeTab === key ? 700 : 400,
                cursor:"pointer", fontFamily:"inherit",
              }}>
              {label}
            </button>
          ))}
        </div>

        {/* ══ AÇIK TALEPLER ══ */}
        {showOpenSec && (
          <div style={{ padding:"0 16px 14px" }}>
            <div style={{ fontSize:13, fontWeight:700, color:DRK, marginBottom:12 }}>Açık Talepler</div>
            {filteredOpen.map(t => (
              <div key={t.id} style={{ background:"#fff", borderRadius:20, border:`1px solid #F3F4F6`,
                                       boxShadow:"0 1px 6px rgba(0,0,0,.06)", padding:16, marginBottom:8 }}>
                {/* Top row */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:11.5, fontWeight:700, color:P }}>#{t.id}</span>
                  <span style={{ background:PL, color:P, fontSize:10, fontWeight:700,
                                 padding:"3px 9px", borderRadius:20 }}>
                    {t.statusLabel}
                  </span>
                </div>
                {/* Title */}
                <div style={{ fontSize:14, fontWeight:700, color:DRK, marginTop:8 }}>{t.title}</div>
                {/* Tags */}
                <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:8 }}>
                  {[t.category, t.issue].filter(Boolean).map(tag => (
                    <span key={tag} style={{ background:"#F3F4F6", color:GT, fontSize:10,
                                             padding:"2px 8px", borderRadius:20 }}>
                      {tag}
                    </span>
                  ))}
                </div>
                {/* Details */}
                <div style={{ fontSize:11, color:GT, marginTop:8, lineHeight:1.7 }}>
                  <div>Sipariş: #{t.orderId}</div>
                  <div>{t.date} • {t.time}</div>
                </div>
                {/* Stepper */}
                <ProgressStepper currentStep={t.progressStage} />
                {/* Footer row */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                              borderTop:`1px solid #F9FAFB`, paddingTop:12, marginTop:4 }}>
                  <div>
                    <div style={{ fontSize:10, color:"#9CA3AF" }}>Son güncelleme: {t.lastUpdate}</div>
                    {t.attachmentCount ? (
                      <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:3 }}>
                        <Paperclip size={11} color={GT} />
                        <span style={{ fontSize:10, color:GT }}>{t.attachmentCount} dosya</span>
                      </div>
                    ) : null}
                  </div>
                  <button onClick={() => viewTicket(t.id)}
                    style={{ border:`2px solid ${P}`, color:P, background:"none",
                             borderRadius:12, padding:"9px 18px", fontSize:12,
                             fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                    Talebi Gör
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ YANIT BEKLEYENLER ══ */}
        {showAwaitSec && (
          <div style={{ padding:"0 16px 14px" }}>
            <div style={{ fontSize:13, fontWeight:700, color:DRK, marginBottom:12 }}>Yanıt Bekleyenler</div>
            {filteredAwaiting.map(t => (
              <div key={t.id}
                onClick={() => viewTicket(t.id)}
                style={{ background:"#fff", borderRadius:16, border:`1px solid #F3F4F6`,
                         padding:"12px", marginBottom:8, cursor:"pointer",
                         display:"flex", gap:12 }}>
                {/* LEFT */}
                <div style={{ flex:1, minWidth:0 }}>
                  <span style={{ fontSize:11.5, fontWeight:700, color:P }}>#{t.id}</span>
                  <div style={{ fontSize:13, fontWeight:600, color:DRK, marginTop:2 }}>{t.title}</div>
                  {t.lastMsg && (
                    <div style={{ fontSize:11, color:GT, marginTop:3,
                                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
                                  maxWidth:"100%" }}>
                      {t.lastMsg}
                    </div>
                  )}
                  <div style={{ fontSize:10, color:"#9CA3AF", marginTop:4 }}>{t.date}</div>
                </div>
                {/* RIGHT */}
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:7, flexShrink:0 }}>
                  <span style={{ background:BBG, color:BFG, fontSize:10, fontWeight:700,
                                 padding:"2px 8px", borderRadius:20 }}>
                    Yanıtlandı
                  </span>
                  {t.newMsgCount > 0 && (
                    <span style={{ background:P, color:"#fff", fontSize:9, fontWeight:700,
                                   padding:"2px 7px", borderRadius:20 }}>
                      {t.newMsgCount} yeni mesaj
                    </span>
                  )}
                  <button
                    onClick={e => { e.stopPropagation(); replyTicket(t.id); }}
                    style={{
                      background: t.newMsgCount > 0 ? P : "none",
                      color: t.newMsgCount > 0 ? "#fff" : P,
                      border: t.newMsgCount > 0 ? "none" : `1px solid ${P}`,
                      borderRadius:9, padding:"6px 13px", fontSize:10, fontWeight:700,
                      cursor:"pointer", fontFamily:"inherit",
                    }}>
                    {t.newMsgCount > 0 ? "Yanıtla" : "Talebi Gör"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ ÇÖZÜLEN TALEPLER ══ */}
        {showSolvedSec && (
          <div style={{ padding:"0 16px 14px" }}>
            <div style={{ fontSize:13, fontWeight:700, color:DRK, marginBottom:12 }}>Çözülen Talepler</div>
            {filteredSolved.map(t => {
              const isEval = evaluated[t.id] ?? t.isEvaluated;
              const rating = ratings[t.id] ?? t.rating;
              return (
                <div key={t.id}
                  onClick={() => viewTicket(t.id)}
                  style={{ background:"#fff", borderRadius:16, border:`1px solid #F3F4F6`,
                           padding:"12px 12px 12px 12px", marginBottom:8, cursor:"pointer",
                           display:"flex", alignItems:"center", gap:12 }}>
                  {/* Icon */}
                  <div style={{ width:36, height:36, borderRadius:12, background:GRNB,
                                display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <t.Icon size={16} color={GRN} />
                  </div>
                  {/* Center */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ background:GRNB, color:GRN, fontSize:9, fontWeight:700,
                                     padding:"2px 6px", borderRadius:6 }}>
                        Çözüldü
                      </span>
                      <span style={{ fontSize:11, color:GT }}>#{t.id}</span>
                    </div>
                    <div style={{ fontSize:13, fontWeight:600, color:DRK, marginTop:3,
                                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {t.title}
                    </div>
                    <div style={{ fontSize:10, color:"#9CA3AF", marginTop:2 }}>{t.date}</div>
                    {isEval ? (
                      <div style={{ fontSize:10, color:GRN, marginTop:4, display:"flex", alignItems:"center", gap:4 }}>
                        <Check size={11} color={GRN} strokeWidth={3} />
                        Değerlendirildi
                        {rating > 0 && (
                          <span style={{ display:"flex", gap:2, marginLeft:4 }}>
                            {[1,2,3,4,5].map(n => (
                              <Star key={n} size={11}
                                fill={n <= rating ? "#FBBF24" : "none"}
                                color={n <= rating ? "#FBBF24" : GB}
                                strokeWidth={1.5} />
                            ))}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize:10, color:GT, marginTop:4 }}>Deneyiminizi değerlendirin</div>
                        <StarRating
                          ticketId={t.id}
                          initialRating={rating}
                          onRate={setRating} />
                      </div>
                    )}
                  </div>
                  {/* Chevron */}
                  <ChevronRight size={16} color="#D1D5DB" style={{ flexShrink:0 }} />
                </div>
              );
            })}

            {/* Load more */}
            {!showOlder && (
              <button onClick={() => setShowOlder(true)}
                style={{ width:"100%", border:`2px solid ${P}`, color:P, background:"none",
                         borderRadius:14, padding:"13px 0", fontSize:13, fontWeight:700,
                         cursor:"pointer", marginTop:6, fontFamily:"inherit" }}>
                Daha Eski Talepleri Göster
              </button>
            )}
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {allEmpty && (
          <div style={{ padding:"48px 16px", textAlign:"center" }}>
            <MessageCircle size={44} color={GB} style={{ margin:"0 auto 14px" }} />
            <div style={{ fontSize:15, fontWeight:600, color:DRK, marginBottom:6 }}>
              Talep bulunamadı
            </div>
            <div style={{ fontSize:13, color:GT }}>
              Arama kriterlerinize uygun talep yok.
            </div>
          </div>
        )}

        {/* ── LIVE SUPPORT BANNER ── */}
        <div style={{ margin:"4px 16px 24px", background:PL, borderRadius:20, padding:"14px 14px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:"50%", background:"#fff",
                          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Headphones size={19} color={P} />
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:700, color:DRK }}>
                Hızlı yardıma mı ihtiyacınız var?
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:3 }}>
                <div style={{ width:7, height:7, borderRadius:"50%", background:"#22C55E" }} />
                <span style={{ fontSize:11, color:GT }}>Destek ekibimiz şu anda çevrimiçi</span>
              </div>
            </div>
            <button onClick={() => showToast("Canlı destek başlatılıyor...")}
              style={{ flexShrink:0, background:P, color:"#fff", border:"none",
                       borderRadius:12, padding:"9px 10px", fontSize:10, fontWeight:700,
                       cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>
              Canlı Desteği Başlat
            </button>
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

      {/* ── CREATE TICKET MODAL ── */}
      {modalOpen && (
        <CreateTicketModal
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmitTicket} />
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div style={{
          position:"fixed", bottom:84, left:"50%", transform:"translateX(-50%)",
          background:"#1F2937", color:"#fff", borderRadius:12, padding:"10px 18px",
          fontSize:13, fontWeight:600, zIndex:10000, whiteSpace:"nowrap",
          boxShadow:"0 4px 20px rgba(0,0,0,.25)",
        }}>
          {toast}
        </div>
      )}
    </YPLayout>
  );
}
