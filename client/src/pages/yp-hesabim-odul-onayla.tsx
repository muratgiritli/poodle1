// Route: /hesabim/poodle-puanlari/odul-onayla/:rewardId
import { useMemo, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft, PawPrint, Coins, ShoppingCart, Ticket,
  Percent, Clock, ShieldCheck, Calendar, Tag, Hash,
  XCircle, ArrowRight, ChevronDown, ChevronUp, Check, X, Package,
} from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { goBack } from "@/lib/goBack";
import { apiRequest } from "@/lib/queryClient";
import {
  LOYALTY_BRAND as P,
  LOYALTY_BRAND_DARK as PD,
  LOYALTY_BRAND_LIGHT as PL,
  enrichReward,
  fetchLoyalty,
  fetchRewards,
} from "@/lib/loyalty-api";

/* ── Palette ─────────────────────────── */
const DRK  = "#111827";
const GT   = "#6B7280";
const GB   = "#E5E7EB";
const GRN  = "#16A34A";
const BLU  = "#3B82F6";
const GOLDB= "#FBBF24";
const ORG  = "#EA580C";
const BG   = "#F9F9FB";

/* ── Reward defaults ─────────────────── */
const DEFAULT_REWARD = {
  id: "rw-50tl",
  title: "50 TL Alışveriş İndirimi",
  couponLabel: "50 TL İNDİRİM",
  badge: "Ödül",
  description: "Mağaza alışverişlerinde geçerlidir.",
  pointsRequired: 500,
  minCart: "500 TL",
  validCategory: "Tüm ürünler",
  expiryDate: "30 gün",
  usage: "Tek kullanımlık",
  combining: "Başka kuponlarla kullanılamaz",
  icon: "coupon",
};

const FAQ_ITEMS = [
  { id:"faq-1", q:"Puan iadesi yapılır mı?",    a:"Ödül kullanıldıktan sonra puan iadesi yapılmaz. Kullanılmamış kuponlar 30 gün içinde iade talep edilebilir." },
  { id:"faq-2", q:"Kupon kullanım koşulları",    a:"Minimum sepet tutarına ulaşıldığında ödeme adımında kupon otomatik görünür. Tek kullanımlıktır." },
  { id:"faq-3", q:"Yardım ve destek",             a:"Sorularınız için Yardım Merkezi'nden bize ulaşabilirsiniz." },
];

/* ── Toast ───────────────────────────── */
function Toast({ msg, onClose }: { msg:string; onClose:()=>void }) {
  return (
    <div style={{ position:"fixed", top:20, left:"50%", transform:"translateX(-50%)",
                  background:"#111827", color:"#fff", borderRadius:12, padding:"10px 18px",
                  fontSize:13, fontWeight:600, zIndex:99999, whiteSpace:"nowrap",
                  boxShadow:"0 4px 20px rgba(0,0,0,.3)", display:"flex", gap:10, alignItems:"center" }}>
      <Check size={14} color="#4ADE80" />
      {msg}
      <button onClick={onClose} style={{ background:"none", border:"none", color:"#9CA3AF", cursor:"pointer", padding:0 }}>
        <X size={14}/>
      </button>
    </div>
  );
}

/* ── Terms Modal ─────────────────────── */
function TermsModal({ onClose, onAccept }: { onClose:()=>void; onAccept:()=>void }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:9998,
                  display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div style={{ background:"#fff", borderRadius:"20px 20px 0 0", padding:"24px 20px 40px",
                    width:"100%", maxWidth: "var(--yp-shell-max)", maxHeight:"80vh", display:"flex", flexDirection:"column" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <span style={{ fontSize:16, fontWeight:700, color:DRK }}>PoodlePuan Ödül Kullanım Koşulları</span>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer" }}>
            <X size={20} color={GT}/>
          </button>
        </div>
        <div style={{ overflowY:"auto", flex:1, fontSize:12, color:GT, lineHeight:1.7, marginBottom:20 }}>
          <p><strong>1. Genel Koşullar</strong><br/>PoodlePuan ödülleri yalnızca YourPoodle platformunda geçerlidir. Ödüller nakde çevrilemez.</p>
          <p><strong>2. Kullanım Süresi</strong><br/>Her ödülün belirtilen son kullanma tarihi vardır. Süresi geçen ödüller otomatik olarak iptal edilir.</p>
          <p><strong>3. İade Koşulları</strong><br/>Kullanılan ödüller ve harcanan puanlar iade edilmez. Kullanılmamış kuponlar 30 gün içinde iade talebinde bulunulabilir.</p>
          <p><strong>4. Birleştirme</strong><br/>Ödüller başka kupon veya kampanyalarla birleştirilemez. Her sipariş için yalnızca bir kupon uygulanabilir.</p>
        </div>
        <button onClick={()=>{ onAccept(); onClose(); }}
          style={{ width:"100%", background:P, color:"#fff", border:"none", borderRadius:12,
                   padding:"14px 0", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
          Kabul Ediyorum
        </button>
      </div>
    </div>
  );
}

/* ── Success Modal ───────────────────── */
function SuccessModal({ title, onCenter, onShop }: { title:string; onCenter:()=>void; onShop:()=>void }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.6)", zIndex:9999,
                  display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ background:"#fff", borderRadius:24, padding:"32px 24px",
                    width:"100%", maxWidth:380, textAlign:"center" }}>
        <div style={{ width:64, height:64, borderRadius:999, background:"#F0FDF4",
                      display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
          <Check size={28} color={GRN} />
        </div>
        <div style={{ fontSize:20, fontWeight:800, color:DRK, marginBottom:8 }}>Ödülünüz tanımlandı!</div>
        <div style={{ fontSize:13, color:GT, marginBottom:24, lineHeight:1.5 }}>
          {title} kuponu hesabınıza eklendi.
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <button onClick={onShop}
            style={{ width:"100%", background:P, color:"#fff", border:"none", borderRadius:12,
                     padding:"14px 0", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
            Alışverişe Başla
          </button>
          <button onClick={onCenter}
            style={{ width:"100%", background:"none", border:`2px solid ${P}`, color:P, borderRadius:12,
                     padding:"12px 0", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
            Ödül Merkezine Dön
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Suggestion icon ─────────────────── */
function SuggIcon({ icon }: { icon:string }) {
  const style = { width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center" };
  if (icon === "shipping") return <div style={style}><Package size={28} color={P} /></div>;
  if (icon === "care") return (
    <div style={style}>
      <img src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=80&h=80&fit=crop"
           alt="" style={{ width:36, height:36, objectFit:"cover", borderRadius:8 }}
           onError={e=>{(e.target as HTMLImageElement).style.display="none"}}/>
    </div>
  );
  return (
    <div style={style}>
      <img src="https://images.unsplash.com/photo-1589924691995-400dc9e7c8db?w=80&h=80&fit=crop"
           alt="" style={{ width:36, height:36, objectFit:"cover", borderRadius:8 }}
           onError={e=>{(e.target as HTMLImageElement).style.display="none"}}/>
    </div>
  );
}

/* ── Main Page ───────────────────────── */
export default function YPOdulOnaylaPage() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const params = useParams<{ rewardId?: string }>();
  const rewardId = params.rewardId || DEFAULT_REWARD.id;

  const { data: loyalty } = useQuery({ queryKey: ["/api/customer/loyalty"], queryFn: fetchLoyalty });
  const { data: catalog = [] } = useQuery({ queryKey: ["/api/customer/loyalty/rewards"], queryFn: fetchRewards });

  const catalogItem = catalog.find(r => r.id === rewardId);
  const enriched = catalogItem ? enrichReward(catalogItem) : null;
  const reward = {
    ...DEFAULT_REWARD,
    id: rewardId,
    title: enriched?.title ?? DEFAULT_REWARD.title,
    pointsRequired: enriched?.points ?? DEFAULT_REWARD.pointsRequired,
    minCart: enriched?.minCart?.replace("Min. sepet ", "") ?? DEFAULT_REWARD.minCart,
    badge: enriched?.badge ?? DEFAULT_REWARD.badge,
    icon: enriched?.icon ?? DEFAULT_REWARD.icon,
    couponLabel: enriched?.title?.toUpperCase() ?? DEFAULT_REWARD.couponLabel,
  };

  const suggestions = useMemo(
    () => catalog.filter(r => r.id !== rewardId).slice(0, 3).map(r => {
      const e = enrichReward(r);
      return { id: r.id, title: r.title, points: r.points, icon: e.icon };
    }),
    [catalog, rewardId],
  );

  const balance = loyalty?.balance ?? 0;

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<string|null>(null);
  const [toast, setToast] = useState<string|null>(null);

  const canConfirm = termsAccepted && balance >= reward.pointsRequired;

  const remaining = balance - reward.pointsRequired;

  const showToast = (msg:string) => { setToast(msg); setTimeout(()=>setToast(null), 3500); };

  const redeemMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/customer/loyalty/redeem", {
        rewardId: reward.id,
        pointsCost: reward.pointsRequired,
        title: reward.title,
      });
      return res.json() as Promise<{ ok: boolean; balance: number; message?: string }>;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/customer/loyalty"] });
      const qs = new URLSearchParams({
        title: reward.title,
        points: String(reward.pointsRequired),
        balance: String(data.balance ?? remaining),
        message: data.message ?? "",
      });
      navigate(`/hesabim/poodle-puanlari/odul-hazir/${reward.id}?${qs.toString()}`);
    },
    onError: (err: Error) => {
      showToast(err.message.replace(/^\d+:\s*/, "") || "Ödül kullanılamadı");
    },
  });

  function confirmRedeem() {
    if (!canConfirm || redeemMutation.isPending) return;
    redeemMutation.mutate();
  }

  const DETAIL_ROWS = [
    { icon: <Coins    size={15} color={P}/>, label:"Gerekli Puan",   value:`${reward.pointsRequired.toLocaleString("tr-TR")} PoodlePuan`, valueColor:BLU },
    { icon: <ShoppingCart size={15} color={P}/>, label:"Minimum Sepet", value:reward.minCart,        valueColor:DRK },
    { icon: <Tag      size={15} color={P}/>, label:"Geçerli Kategori",value:reward.validCategory,    valueColor:DRK },
    { icon: <Calendar size={15} color={P}/>, label:"Son Kullanma",   value:reward.expiryDate,        valueColor:DRK },
    { icon: <Hash     size={15} color={P}/>, label:"Kullanım",       value:reward.usage,             valueColor:DRK },
    { icon: <XCircle  size={15} color={P}/>, label:"Birleştirme",    value:reward.combining,         valueColor:DRK },
  ];

  return (
    <YPLayout activeLink="club" constrain={false}>
      {toast && <Toast msg={toast} onClose={()=>setToast(null)} />}
      {termsModalOpen && (
        <TermsModal
          onClose={()=>setTermsModalOpen(false)}
          onAccept={()=>setTermsAccepted(true)}
        />
      )}

      <div className="yp-acct" style={{ margin:"0 auto", background:BG, minHeight:"100vh", paddingBottom:32, fontFamily:"Inter,sans-serif" }}>

        {/* ── BREADCRUMB ── */}
        <div style={{ padding:"12px 16px 6px" }}>
          <button onClick={()=>goBack(navigate, "/hesabim/poodle-puanlari/odul-merkezi")}
            style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:6, padding:0 }}>
            <ArrowLeft size={15} color={P} />
            <span style={{ fontSize:11, color:P, fontWeight:500 }}>Hesabım / PoodlePuanlarım / Ödülü Onayla</span>
          </button>
        </div>

        {/* ── PAGE HEADER ── */}
        <div style={{ padding:"0 16px 14px" }}>
          <h1 style={{ fontSize:22, fontWeight:800, color:DRK, margin:"6px 0 3px" }}>Ödülü Onayla</h1>
          <p style={{ fontSize:12, color:GT, margin:0 }}>Puanlarını kullanmadan önce ödül detaylarını kontrol et.</p>
        </div>

        {/* ── HERO COUPON CARD ── */}
        <div style={{ margin:"0 16px 14px", background:PL, borderRadius:20, padding:"16px 14px",
                      display:"flex", alignItems:"center", gap:14 }}>
          {/* Left: coupon ticket visual */}
          <div style={{ position:"relative", width:88, height:76, flexShrink:0 }}>
            {/* Main ticket */}
            <div style={{ position:"absolute", top:0, left:0,
                          width:82, height:66, borderRadius:12,
                          background:`linear-gradient(135deg,${P},${PD})`,
                          boxShadow:"0 4px 14px rgba(93,62,189,.4)",
                          transform:"rotate(-5deg)",
                          display:"flex", flexDirection:"column", alignItems:"center",
                          justifyContent:"center", overflow:"hidden" }}>
              {/* Notch left */}
              <div style={{ position:"absolute", left:-8, top:"50%", transform:"translateY(-50%)",
                            width:16, height:16, borderRadius:999, background:PL }} />
              {/* Notch right */}
              <div style={{ position:"absolute", right:-8, top:"50%", transform:"translateY(-50%)",
                            width:16, height:16, borderRadius:999, background:PL }} />
              <span style={{ fontSize:16, fontWeight:900, color:GOLDB, lineHeight:1 }}>50 TL</span>
              <span style={{ fontSize:7, fontWeight:800, color:"rgba(255,255,255,.85)", letterSpacing:1 }}>İNDİRİM</span>
            </div>
            {/* Gold coin 1 */}
            <div style={{ position:"absolute", bottom:0, right:2,
                          width:26, height:26, borderRadius:999,
                          background:`radial-gradient(circle at 35% 35%, ${GOLDB}, #D97706)`,
                          display:"flex", alignItems:"center", justifyContent:"center",
                          boxShadow:"0 2px 6px rgba(0,0,0,.2)", zIndex:2 }}>
              <PawPrint size={12} color="#fff" strokeWidth={2.5}/>
            </div>
            {/* Gold coin 2 */}
            <div style={{ position:"absolute", bottom:6, right:24,
                          width:20, height:20, borderRadius:999,
                          background:`radial-gradient(circle at 35% 35%, ${GOLDB}, #D97706)`,
                          display:"flex", alignItems:"center", justifyContent:"center",
                          boxShadow:"0 2px 5px rgba(0,0,0,.15)", zIndex:1 }}>
              <PawPrint size={9} color="#fff" strokeWidth={2.5}/>
            </div>
          </div>

          {/* Right: text */}
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15, fontWeight:800, color:DRK, marginBottom:4, lineHeight:1.3 }}>{reward.title}</div>
            <div style={{ display:"inline-block", background:"#FFF7ED", color:ORG,
                          fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:999, marginBottom:6 }}>
              {reward.badge}
            </div>
            <div style={{ fontSize:11, color:GT, lineHeight:1.4 }}>{reward.description}</div>
          </div>
        </div>

        {/* ── ÖDÜL DETAYLARI ── */}
        <div style={{ margin:"0 16px 14px", background:"#fff", borderRadius:20,
                      border:`1px solid ${GB}`, boxShadow:"0 1px 5px rgba(0,0,0,.05)", padding:"14px 16px" }}>
          <div style={{ fontSize:13, fontWeight:800, color:DRK, marginBottom:10 }}>Ödül Detayları</div>
          {DETAIL_ROWS.map((row, i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                                   padding:"10px 0", borderBottom: i<DETAIL_ROWS.length-1 ? `1px solid #F9FAFB` : "none" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:28, height:28, borderRadius:8, background:PL,
                              display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  {row.icon}
                </div>
                <span style={{ fontSize:11, color:GT }}>{row.label}</span>
              </div>
              <span style={{ fontSize:12, fontWeight:700, color:row.valueColor, textAlign:"right", maxWidth:160 }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* ── BALANCE FLOW ── */}
        <div style={{ margin:"0 16px 14px", background:"#fff", borderRadius:20,
                      border:`1px solid ${GB}`, boxShadow:"0 1px 5px rgba(0,0,0,.05)", padding:"16px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
            {/* Left: Current */}
            <div style={{ flex:1, textAlign:"center" }}>
              <div style={{ fontSize:10, color:GT, marginBottom:6 }}>Mevcut Bakiyen</div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}>
                <div style={{ width:20, height:20, borderRadius:999,
                              background:`radial-gradient(circle at 35% 35%, ${GOLDB}, #D97706)`,
                              display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <PawPrint size={10} color="#fff" strokeWidth={2.5}/>
                </div>
                <span style={{ fontSize:20, fontWeight:800, color:DRK }}>
                  {balance.toLocaleString("tr-TR")}
                </span>
              </div>
              <div style={{ fontSize:10, color:"#9CA3AF", marginTop:2 }}>PoodlePuan</div>
            </div>

            {/* Center: arrow + deduction */}
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
              <ArrowRight size={18} color="#D1D5DB" />
              <div style={{ width:40, height:40, borderRadius:999, background:P,
                            display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontSize:10, fontWeight:800, color:"#fff" }}>
                  -{reward.pointsRequired >= 1000
                    ? reward.pointsRequired.toLocaleString("tr-TR")
                    : reward.pointsRequired}
                </span>
              </div>
            </div>

            {/* Right: Remaining */}
            <div style={{ flex:1, textAlign:"center" }}>
              <div style={{ fontSize:10, color:GT, marginBottom:6 }}>Kalan Bakiyen</div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}>
                <div style={{ width:20, height:20, borderRadius:999,
                              background:`radial-gradient(circle at 35% 35%, ${GOLDB}, #D97706)`,
                              display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <PawPrint size={10} color="#fff" strokeWidth={2.5}/>
                </div>
                <span style={{ fontSize:20, fontWeight:800, color:P }}>
                  {remaining.toLocaleString("tr-TR")}
                </span>
              </div>
              <div style={{ fontSize:10, color:"#9CA3AF", marginTop:2 }}>PoodlePuan</div>
            </div>
          </div>
        </div>

        {/* ── KUPON NASIL KULLANILACAK? + İNDİRİM ÖRNEĞİ ── */}
        <div style={{ margin:"0 16px 14px" }}>
          <div style={{ fontSize:13, fontWeight:800, color:DRK, marginBottom:12 }}>Kupon nasıl kullanılacak?</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {/* Left: 3 steps */}
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {[
                { icon:<Ticket size={14} color={P}/>,       text:"Ödülü hesabına tanımla\nOnaydan sonra kuponların bölümüne eklenir." },
                { icon:<ShoppingCart size={14} color={P}/>, text:"Sepetine ürün ekle\nSepet tutarı en az 50 TL olmalıdır." },
                { icon:<Percent size={14} color={P}/>,      text:"Ödeme adımında kuponu seç\n50 TL indirim uygulanır." },
              ].map((step, i) => (
                <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:8 }}>
                  <div style={{ width:22, height:22, borderRadius:999, background:P, flexShrink:0, marginTop:1,
                                display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <span style={{ fontSize:10, fontWeight:800, color:"#fff" }}>{i+1}</span>
                  </div>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:4, marginBottom:1 }}>
                      {step.icon}
                    </div>
                    <div style={{ fontSize:10, color:DRK, lineHeight:1.5 }}>{step.text.split("\n")[0]}</div>
                    <div style={{ fontSize:9, color:GT, lineHeight:1.4 }}>{step.text.split("\n")[1]}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: İndirim Örneği */}
            <div style={{ background:"#EFF6FF", borderRadius:14, padding:"12px 12px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10 }}>
                <ShoppingCart size={13} color={BLU}/>
                <span style={{ fontSize:11, fontWeight:800, color:DRK }}>İndirim Örneği</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <span style={{ fontSize:10, color:GT }}>Sepet Tutarı:</span>
                <span style={{ fontSize:10, fontWeight:600, color:DRK }}>649 TL</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontSize:10, color:GT }}>Kupon İndirimi:</span>
                <span style={{ fontSize:10, fontWeight:700, color:GRN }}>-50 TL</span>
              </div>
              <div style={{ height:1, background:"#BFDBFE", marginBottom:8 }} />
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontSize:10, fontWeight:700, color:DRK }}>Ödenecek:</span>
                <span style={{ fontSize:13, fontWeight:800, color:BLU }}>599 TL</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── INFO ALERT ── */}
        <div style={{ margin:"0 16px 10px", background:"#FEF3C7", border:"1px solid #FDE68A",
                      borderRadius:14, padding:"12px 14px", display:"flex", gap:10 }}>
          <Clock size={16} color="#CA8A04" style={{ flexShrink:0, marginTop:1 }} />
          <span style={{ fontSize:11, color:"#1F2937", lineHeight:1.6 }}>
            Bu kupon <strong>{reward.expiryDate}</strong> tarihine kadar geçerlidir. Kullanılan puanlar iade edilmez.
          </span>
        </div>

        {/* ── TERMS CHECKBOX ── */}
        <div style={{ padding:"8px 16px 16px", display:"flex", alignItems:"flex-start", gap:10 }}>
          <input type="checkbox" checked={termsAccepted} onChange={()=>setTermsAccepted(v=>!v)}
            style={{ width:16, height:16, marginTop:1, accentColor:P, cursor:"pointer", flexShrink:0 }}/>
          <div style={{ fontSize:11, color:"#374151", lineHeight:1.6 }}>
            PoodlePuan ödül kullanım koşullarını okudum ve kabul ediyorum.{" "}
            <button onClick={()=>setTermsModalOpen(true)}
              style={{ background:"none", border:"none", color:P, fontWeight:700, fontSize:11,
                       cursor:"pointer", padding:0, fontFamily:"inherit" }}>
              Koşulları Gör &gt;
            </button>
          </div>
        </div>

        {/* ── ACTION BUTTONS ── */}
        <div style={{ padding:"0 16px 10px", display:"flex", flexDirection:"column", gap:10 }}>
          <button onClick={confirmRedeem} disabled={!canConfirm || redeemMutation.isPending}
            style={{ width:"100%", background: canConfirm ? P : "#D4C4B0",
                     color:"#fff", border:"none", borderRadius:14, padding:"16px 0",
                     fontSize:14, fontWeight:800,
                     cursor: canConfirm && !redeemMutation.isPending ? "pointer" : "not-allowed",
                     fontFamily:"inherit", transition:"background .2s" }}>
            {redeemMutation.isPending
              ? "İşleniyor..."
              : `${reward.pointsRequired.toLocaleString("tr-TR")} Puan Kullan ve Ödülü Al`}
          </button>
          <button onClick={()=>navigate("/hesabim/poodle-puanlari/odul-merkezi")}
            style={{ width:"100%", background:"#fff", border:`2px solid ${P}`, color:P,
                     borderRadius:14, padding:"14px 0", fontSize:14, fontWeight:700,
                     cursor:"pointer", fontFamily:"inherit" }}>
            Vazgeç ve Ödüllere Dön
          </button>
        </div>

        {/* ── TRUST BADGE ── */}
        <div style={{ padding:"6px 16px 20px", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
          <ShieldCheck size={16} color={GRN} />
          <span style={{ fontSize:11, color:GT }}>İşlemin güvende. Onay sonrası kuponun hemen hesabına tanımlanır.</span>
        </div>

        {/* ── SUGGESTIONS ── */}
        <div style={{ padding:"0 16px 16px" }}>
          <div style={{ fontSize:13, fontWeight:800, color:DRK, marginBottom:12 }}>Bunları da beğenebilirsin</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
            {suggestions.map(s => (
              <div key={s.id} style={{ background:"#fff", borderRadius:16, border:`1px solid ${GB}`,
                                        padding:"10px 8px", textAlign:"center", display:"flex",
                                        flexDirection:"column", alignItems:"center", gap:4,
                                        boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                <div style={{ height:44, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <SuggIcon icon={s.icon}/>
                </div>
                <div style={{ fontSize:10, fontWeight:700, color:DRK, lineHeight:1.3,
                              display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                  {s.title}
                </div>
                <div style={{ fontSize:10, fontWeight:800, color:P }}>{s.points.toLocaleString("tr-TR")} Puan</div>
                <button onClick={()=>navigate(`/hesabim/poodle-puanlari/odul-onayla/${s.id}`)}
                  style={{ width:"100%", border:`1px solid ${P}`, color:P, background:"none",
                           borderRadius:8, padding:"5px 0", fontSize:9, fontWeight:700,
                           cursor:"pointer", fontFamily:"inherit", marginTop:2 }}>
                  İncele
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── FAQ ── */}
        <div style={{ padding:"0 16px 16px" }}>
          <div style={{ background:"#fff", borderRadius:18, border:`1px solid ${GB}`,
                        overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
            {FAQ_ITEMS.map((f, i) => {
              const open = expandedFaq === f.id;
              return (
                <div key={f.id} style={{ borderBottom: i<FAQ_ITEMS.length-1 ? `1px solid #F9FAFB` : "none" }}>
                  <button onClick={()=>setExpandedFaq(open ? null : f.id)}
                    style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center",
                             padding:"14px 16px", background:"none", border:"none", cursor:"pointer",
                             textAlign:"left", fontFamily:"inherit" }}>
                    <span style={{ fontSize:13, fontWeight:600, color:DRK }}>{f.q}</span>
                    {open ? <ChevronUp size={16} color={GT}/> : <ChevronDown size={16} color={GT}/>}
                  </button>
                  {open && <div style={{ padding:"0 16px 14px", fontSize:12, color:GT, lineHeight:1.6 }}>{f.a}</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── BOTTOM BANNER ── */}
        <div style={{ margin:"0 16px 16px", background:PL, borderRadius:20, padding:"14px",
                      display:"flex", alignItems:"center", gap:12 }}>
          {/* Poodle photo + mini coupon overlay */}
          <div style={{ position:"relative", flexShrink:0 }}>
            <img src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=120&h=120&fit=crop"
                 alt="Poodle" style={{ width:52, height:52, borderRadius:999, objectFit:"cover",
                                       border:`2px solid #fff`, boxShadow:"0 2px 8px rgba(0,0,0,.1)" }}
                 onError={e=>{(e.target as HTMLImageElement).style.display="none"}} />
            {/* Mini coupon badge */}
            <div style={{ position:"absolute", bottom:-4, right:-6, background:P, borderRadius:6,
                          padding:"2px 5px", display:"flex", flexDirection:"column", alignItems:"center" }}>
              <span style={{ fontSize:7, fontWeight:900, color:GOLDB }}>50 TL</span>
              <span style={{ fontSize:5, fontWeight:700, color:"rgba(255,255,255,.8)" }}>İNDİRİM</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize:14, fontWeight:800, color:DRK, marginBottom:2 }}>Bir adım kaldı!</div>
            <div style={{ fontSize:11, color:GT, lineHeight:1.4 }}>Onayla, kuponun hemen hesabına tanımlansın.</div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div style={{ background:P, padding:"24px 20px 32px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
            <div style={{ width:30, height:30, borderRadius:999, background:"rgba(255,255,255,.2)",
                          display:"flex", alignItems:"center", justifyContent:"center" }}>
              <PawPrint size={16} color="#fff"/>
            </div>
            <span style={{ fontSize:16, fontWeight:800, color:"#fff" }}>YourPoodle</span>
          </div>
          <div style={{ display:"flex", gap:6, marginBottom:10, flexWrap:"wrap" }}>
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
