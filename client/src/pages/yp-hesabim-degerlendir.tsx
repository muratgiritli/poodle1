// Route: /hesabim/destek-talepleri/degerlendir/:ticketId
import { useState } from "react";
import { useLocation, useParams } from "wouter";
import {
  ArrowLeft, Check, BadgeCheck, Gift,
  ThumbsUp, ThumbsDown, CheckSquare, Square,
  FileText, Star,
} from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";

/* ── Palette ─────────────────────────── */
const P    = "#5D3EBD";
const PL   = "#F3EEFF";
const NAV  = "#1D1E9B";
const DRK  = "#111827";
const GT   = "#6B7280";
const GB   = "#E5E7EB";
const GRN  = "#16A34A";
const GRNB = "#F0FDF4";
const GRNBR= "#BBF7D0";

/* ── Mock data ───────────────────────── */
const RATING_LABELS: Record<number, string> = {
  1: "Çok Kötü",
  2: "Kötü",
  3: "Orta",
  4: "Çok İyi",
  5: "Mükemmel",
};

const TICKET_DATA: Record<string, {
  ticketNumber: string; title: string; closedAt: string; solution: string;
}> = {
  "YP-4798": {
    ticketNumber: "YP-4798",
    title: "Tasma beden değişimi",
    closedAt: "24 Temmuz 2026 • 01:06",
    solution: "M beden değişimi onaylandı",
  },
  "YP-4612": {
    ticketNumber: "YP-4612",
    title: "Kargo teslimat gecikmesi",
    closedAt: "12 Temmuz 2026 • 15:30",
    solution: "Kargo teslimi sağlandı",
  },
};

const FALLBACK_TICKET = {
  ticketNumber: "YP-4798",
  title: "Tasma beden değişimi",
  closedAt: "24 Temmuz 2026 • 01:06",
  solution: "M beden değişimi onaylandı",
};

const DEFAULT_COMMENT =
  "Elif hanım tasma bedeni konusunda çok yardımcı oldu. Değişim süreci hızlı ilerledi, kargo bilgisi de net paylaşıldı.";

const SATISFACTION_OPTIONS = [
  { id: "fast",     label: "Hızlı Yanıt",      defaultSelected: true  },
  { id: "kind",     label: "Nazik İletişim",    defaultSelected: true  },
  { id: "easy",     label: "Kolay İşlem",       defaultSelected: false },
  { id: "solved",   label: "Sorunum Çözüldü",   defaultSelected: true  },
  { id: "clear",    label: "Açıklayıcı Bilgi",  defaultSelected: true  },
  { id: "tracking", label: "Takip Süreci",      defaultSelected: false },
];

/* ── Reusable star row ───────────────── */
function StarRow({
  count, filled, size, color, onRate,
}: {
  count: number; filled: number; size: number;
  color: string; onRate: (n: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display:"flex", gap: size > 20 ? 8 : 4 }}>
      {Array.from({ length: count }, (_, i) => i + 1).map(n => (
        <button key={n}
          onClick={() => onRate(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          style={{ background:"none", border:"none", cursor:"pointer", padding:0, lineHeight:1,
                   transform: (hovered === n) ? "scale(1.15)" : "scale(1)",
                   transition:"transform .12s" }}>
          <Star size={size}
            fill={(hovered || filled) >= n ? color : "none"}
            color={(hovered || filled) >= n ? color : GB}
            strokeWidth={1.5} />
        </button>
      ))}
    </div>
  );
}

/* ── Toggle switch ───────────────────── */
function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      style={{
        width:44, height:24, borderRadius:12, flexShrink:0,
        background: on ? P : GB,
        border:"none", cursor:"pointer", position:"relative",
        transition:"background .2s",
      }}>
      <div style={{
        position:"absolute", top:3,
        left: on ? "calc(100% - 21px)" : 3,
        width:18, height:18, borderRadius:"50%",
        background:"#fff",
        transition:"left .2s",
        boxShadow:"0 1px 3px rgba(0,0,0,.2)",
      }} />
    </button>
  );
}

/* ════════════════════════════
   MAIN PAGE
════════════════════════════ */
export default function YPDegerlendirPage() {
  const [, navigate] = useLocation();
  const params = useParams<{ ticketId?: string }>();
  const ticketId = params?.ticketId ?? "YP-4798";

  const ticket = TICKET_DATA[ticketId] ?? FALLBACK_TICKET;

  /* ── State ─────────────────────────── */
  const [overallRating, setOverallRating]   = useState(4);
  const [agentRating,   setAgentRating]     = useState(5);
  const [selected,      setSelected]        = useState<Set<string>>(
    () => new Set(SATISFACTION_OPTIONS.filter(o => o.defaultSelected).map(o => o.id))
  );
  const [comment,       setComment]         = useState(DEFAULT_COMMENT);
  const [shareWithTeam, setShareWithTeam]   = useState(true);
  const [solution,      setSolution]        = useState<"yes"|"no">("yes");
  const [submitting,    setSubmitting]      = useState(false);
  const [toast,         setToast]           = useState("");

  /* ── Helpers ───────────────────────── */
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3000); };

  const toggleSatisfaction = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSubmit = () => {
    if (overallRating < 1) { showToast("Lütfen bir puan verin"); return; }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      navigate("/hesabim/destek-talepleri");
      showToast("Değerlendirmeniz alındı ✓ +25 PoodlePuan hesabınıza eklendi");
    }, 700);
  };

  return (
    <YPLayout activeLink="club" constrain={false}>
      <div style={{ maxWidth:480, margin:"0 auto", background:"#F9F9FB",
                    minHeight:"100vh", fontFamily:"Inter, sans-serif" }}>

        {/* ── BREADCRUMB ── */}
        <div style={{ padding:"14px 16px 8px" }}>
          <button onClick={() => navigate("/hesabim/destek-talepleri")}
            style={{ display:"flex", alignItems:"center", gap:6, background:"none",
                     border:"none", cursor:"pointer", padding:0, fontFamily:"inherit" }}>
            <ArrowLeft size={15} color={P} />
            <span style={{ fontSize:12, color:P, fontWeight:500 }}>
              Hesabım / Destek Taleplerim / Değerlendir
            </span>
          </button>
        </div>

        {/* ── RESOLVED BANNER ── */}
        <div style={{ margin:"0 16px 16px", background:GRNB, border:`1px solid ${GRNBR}`,
                      borderRadius:20, padding:"18px 16px", textAlign:"center" }}>
          <div style={{ width:48, height:48, borderRadius:"50%", background:GRN,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        margin:"0 auto 12px" }}>
            <Check size={22} color="#fff" strokeWidth={3} />
          </div>
          <div style={{ fontSize:15, fontWeight:700, color:DRK }}>Talebiniz Çözüldü</div>
          <div style={{ fontSize:13, color:GT, marginTop:8, lineHeight:1.6, padding:"0 8px" }}>
            #{ticket.ticketNumber} numaralı '{ticket.title}' talebiniz başarıyla kapatıldı.
          </div>
          <div style={{ fontSize:11, color:"#9CA3AF", marginTop:6 }}>{ticket.closedAt}</div>
        </div>

        {/* ── MAIN RATING CARD ── */}
        <div style={{ margin:"0 16px 16px", background:"#fff", borderRadius:20,
                      border:"1px solid #F3F4F6", boxShadow:"0 1px 6px rgba(0,0,0,.06)", padding:18 }}>

          {/* Overall Rating */}
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:DRK }}>
              Destek deneyiminiz nasıldı?
            </div>
            <div style={{ fontSize:12, color:GT, marginTop:3, marginBottom:14 }}>
              Görüşünüz hizmetimizi geliştirmemize yardımcı olur.
            </div>
            <div style={{ display:"flex", justifyContent:"center" }}>
              <StarRow count={5} filled={overallRating} size={36} color={P}
                onRate={setOverallRating} />
            </div>
            <div style={{ textAlign:"center", marginTop:10, display:"flex",
                          alignItems:"baseline", justifyContent:"center", gap:4 }}>
              <span style={{ fontSize:14, fontWeight:700, color:P }}>
                {RATING_LABELS[overallRating]}
              </span>
              <span style={{ fontSize:12, color:GT }}>{overallRating} / 5</span>
            </div>
          </div>

          {/* Agent Card */}
          <div style={{ borderTop:`1px solid #F3F4F6`, paddingTop:16, marginTop:16 }}>
            <div style={{ fontSize:11, color:GT, marginBottom:10 }}>Size yardımcı olan kişi</div>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop"
                alt="Elif"
                style={{ width:44, height:44, borderRadius:"50%", objectFit:"cover", flexShrink:0 }} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <span style={{ fontSize:14, fontWeight:700, color:DRK }}>Elif</span>
                  <BadgeCheck size={14} color="#3B82F6" />
                </div>
                <div style={{ fontSize:11, color:GT, marginTop:2 }}>YourPoodle Destek Uzmanı</div>
                <div style={{ marginTop:6 }}>
                  <StarRow count={5} filled={agentRating} size={16} color={P}
                    onRate={setAgentRating} />
                </div>
              </div>
            </div>
          </div>

          {/* Satisfaction Grid */}
          <div style={{ borderTop:`1px solid #F3F4F6`, paddingTop:16, marginTop:16 }}>
            <div style={{ fontSize:14, fontWeight:700, color:DRK, marginBottom:12 }}>
              Aşağıdakilerden hangilerinden memnun kaldınız?
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {SATISFACTION_OPTIONS.map(opt => {
                const on = selected.has(opt.id);
                return (
                  <button key={opt.id}
                    onClick={() => toggleSatisfaction(opt.id)}
                    style={{
                      display:"flex", alignItems:"center", gap:8,
                      padding:"9px 12px", borderRadius:12, cursor:"pointer",
                      border: on ? `1.5px solid ${P}` : "1.5px solid #E5E7EB",
                      background: on ? PL : "#fff",
                      fontFamily:"inherit", transition:"all .15s",
                    }}>
                    {on
                      ? <CheckSquare size={15} color={P} />
                      : <Square size={15} color="#9CA3AF" />
                    }
                    <span style={{ fontSize:11, fontWeight: on ? 700 : 500,
                                   color: on ? P : "#374151" }}>
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment Box */}
          <div style={{ borderTop:`1px solid #F3F4F6`, paddingTop:16, marginTop:16 }}>
            <div style={{ fontSize:14, fontWeight:700, color:DRK, marginBottom:10 }}>
              Deneyiminizi biraz anlatır mısınız?
            </div>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value.slice(0, 500))}
              rows={4}
              style={{
                width:"100%", boxSizing:"border-box",
                background:"#F9FAFB", border:`1px solid ${GB}`,
                borderRadius:12, padding:"10px 12px",
                fontSize:13, color:"#1F2937", fontFamily:"inherit",
                resize:"none", outline:"none", lineHeight:1.55,
              }} />
            <div style={{ fontSize:10, color:"#9CA3AF", textAlign:"right", marginTop:4 }}>
              {comment.length} / 500
            </div>
            {/* Share toggle */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:12 }}>
              <span style={{ fontSize:12, color:"#374151", flex:1, paddingRight:12 }}>
                Yorumum destek ekibiyle paylaşılsın
              </span>
              <Toggle on={shareWithTeam} onClick={() => setShareWithTeam(v => !v)} />
            </div>
          </div>

          {/* Solution Buttons */}
          <div style={{ borderTop:`1px solid #F3F4F6`, paddingTop:16, marginTop:16 }}>
            <div style={{ fontSize:14, fontWeight:700, color:DRK, marginBottom:12 }}>
              Çözüm sizin için yeterli oldu mu?
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <button
                onClick={() => setSolution("yes")}
                style={{
                  display:"flex", flexDirection:"column", alignItems:"center", gap:6,
                  padding:"12px 8px", borderRadius:14, cursor:"pointer",
                  border: solution === "yes" ? `2px solid ${P}` : `2px solid ${GB}`,
                  background: solution === "yes" ? PL : "#fff",
                  fontFamily:"inherit",
                }}>
                <ThumbsUp size={20} color={solution === "yes" ? P : GT} />
                <span style={{ fontSize:12, fontWeight: solution === "yes" ? 700 : 500,
                               color: solution === "yes" ? P : GT }}>
                  Evet, çözüldü
                </span>
              </button>
              <button
                onClick={() => setSolution("no")}
                style={{
                  display:"flex", flexDirection:"column", alignItems:"center", gap:6,
                  padding:"12px 8px", borderRadius:14, cursor:"pointer",
                  border: solution === "no" ? "2px solid #DC2626" : `2px solid ${GB}`,
                  background: solution === "no" ? "#FEF2F2" : "#F9FAFB",
                  fontFamily:"inherit",
                }}>
                <ThumbsDown size={20} color={solution === "no" ? "#DC2626" : GT} />
                <span style={{ fontSize:12, fontWeight: solution === "no" ? 700 : 500,
                               color: solution === "no" ? "#DC2626" : GT }}>
                  Hayır, devam ediyor
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ── REWARD BANNER ── */}
        <div style={{ margin:"0 16px 16px", background:PL, borderRadius:20, padding:"14px 16px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ flexShrink:0, position:"relative" }}>
              <Gift size={26} color={P} />
              <span style={{ position:"absolute", top:-6, right:-6, fontSize:13 }}>🏅</span>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:700, color:DRK }}>
                Değerlendirmenize 25 PoodlePuan
              </div>
              <div style={{ fontSize:11, color:GT, marginTop:3 }}>
                Yorumunuzu gönderdiğinizde hesabınıza eklenecek.
              </div>
            </div>
            <div style={{
              flexShrink:0, background:P, color:"#fff",
              fontSize:12, fontWeight:700, padding:"5px 11px", borderRadius:20,
            }}>
              +25 Puan
            </div>
          </div>
        </div>

        {/* ── ACTION BUTTONS ── */}
        <div style={{ padding:"0 16px 16px", display:"flex", flexDirection:"column", gap:10 }}>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              width:"100%", background: submitting ? "#9CA3AF" : P,
              color:"#fff", border:"none", borderRadius:14,
              padding:"14px 0", fontSize:14, fontWeight:700,
              cursor: submitting ? "not-allowed" : "pointer",
              fontFamily:"inherit",
            }}>
            {submitting ? "Gönderiliyor..." : "Değerlendirmeyi Gönder"}
          </button>
          <button
            onClick={() => navigate("/hesabim/destek-talepleri")}
            style={{
              width:"100%", background:"#fff", border:`2px solid ${P}`,
              color:P, borderRadius:14, padding:"12px 0",
              fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
            }}>
            Daha Sonra
          </button>
        </div>

        {/* ── TALEP ÖZETİ ── */}
        <div style={{ margin:"0 16px 16px", background:"#fff", borderRadius:20,
                      border:"1px solid #F3F4F6", boxShadow:"0 1px 6px rgba(0,0,0,.06)",
                      padding:"14px 14px" }}>
          <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
            {/* Icon */}
            <div style={{ width:40, height:40, borderRadius:12, background:GRNB,
                          display:"flex", alignItems:"center", justifyContent:"center",
                          flexShrink:0 }}>
              <FileText size={18} color={GRN} />
            </div>
            {/* Content */}
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:10, color:GT, marginBottom:2 }}>Talep Özeti</div>
              <div style={{ fontSize:12, fontWeight:700, color:P }}>#{ticket.ticketNumber}</div>
              <div style={{ fontSize:13, fontWeight:700, color:DRK, marginTop:2,
                            overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {ticket.title}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:4 }}>
                <div style={{ width:7, height:7, borderRadius:"50%", background:"#22C55E" }} />
                <span style={{ fontSize:10, color:GRN, fontWeight:700 }}>Çözüldü</span>
              </div>
              <div style={{ fontSize:11, color:GT, marginTop:4 }}>
                Çözüm: {ticket.solution}
              </div>
            </div>
            {/* Button */}
            <button
              onClick={() => navigate(`/hesabim/yardim/talep/${ticketId}`)}
              style={{ flexShrink:0, border:`1px solid ${P}`, color:P, background:"none",
                       borderRadius:10, padding:"6px 10px", fontSize:10, fontWeight:700,
                       cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>
              Talebi Tekrar Gör
            </button>
          </div>
        </div>

        {/* ── THANK YOU BANNER ── */}
        <div style={{ margin:"0 16px 24px", background:PL, borderRadius:20, padding:"14px 16px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ position:"relative", flexShrink:0 }}>
              <img
                src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=80&h=80&fit=crop"
                alt="poodle"
                style={{ width:54, height:54, borderRadius:"50%", objectFit:"cover" }} />
              <span style={{ position:"absolute", top:-4, right:-6, fontSize:14 }}>🤍</span>
              <span style={{ position:"absolute", bottom:-2, left:-6, fontSize:12 }}>🐾</span>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:14, fontWeight:700, color:DRK }}>
                Görüşünüz için teşekkür ederiz!
              </div>
              <div style={{ fontSize:12, color:GT, marginTop:4, lineHeight:1.5 }}>
                Her yorum YourPoodle deneyimini daha iyi yapıyor.
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
