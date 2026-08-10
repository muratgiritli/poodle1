// Route: /hesabim/poodle-puanlari/odul-hazir/:rewardId
import { useState } from "react";
import { useLocation, useParams } from "wouter";
import {
  ArrowLeft, PawPrint, Copy, Check, X, ShoppingCart, Calendar,
  Tag, CheckCircle, ShoppingBag, Ticket, Percent, Bell,
  ShieldCheck, ChevronDown, ChevronUp, Link2, MessageSquare,
  Mail, MoreHorizontal, Sparkles, Gift, ArrowRight,
} from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";

/* ── Palette ─────────────────────────── */
const P    = "#5D3EBD";
const PD   = "#4A22A0";
const PL   = "#F5F0E6";
const DRK  = "#111827";
const GT   = "#6B7280";
const GB   = "#E5E7EB";
const GRN  = "#16A34A";
const GOLDB= "#FBBF24";
const BG   = "#F9F9FB";

/* ── Reward data map ─────────────────── */
const REWARDS: Record<string,{
  title:string; couponLabel:string; couponCode:string;
  pointsUsed:number; discountAmount:string; minCart:string;
  expiryDate:string; validFor:string; newBalance:number; newBalanceTl:string;
}> = {
  "pr-1": { title:"50 TL Alışveriş İndirimi", couponLabel:"50 TL İNDİRİM", couponCode:"POODLE50-84K2",
    pointsUsed:500, discountAmount:"50 TL", minCart:"500 TL", expiryDate:"31 Ağustos 2026",
    validFor:"Tüm ürünlerde geçerli", newBalance:775, newBalanceTl:"77,50 TL" },
  "pr-2": { title:"Ücretsiz Kargo", couponLabel:"ÜCRETSİZ KARGO", couponCode:"KARGO50-FREE",
    pointsUsed:300, discountAmount:"Ücretsiz", minCart:"250 TL", expiryDate:"31 Ağustos 2026",
    validFor:"Tüm siparişlerde geçerli", newBalance:975, newBalanceTl:"97,50 TL" },
  "pr-3": { title:"%15 Bakım İndirimi", couponLabel:"%15 İNDİRİM", couponCode:"BAKIM15-ODUL",
    pointsUsed:750, discountAmount:"%15", minCart:"300 TL", expiryDate:"31 Ağustos 2026",
    validFor:"Bakım ürünlerinde geçerli", newBalance:525, newBalanceTl:"52,50 TL" },
  "pr-4": { title:"100 TL Mama İndirimi", couponLabel:"100 TL İNDİRİM", couponCode:"MAMA100-ODUL",
    pointsUsed:1000, discountAmount:"100 TL", minCart:"750 TL", expiryDate:"31 Ağustos 2026",
    validFor:"Mama ürünlerinde geçerli", newBalance:275, newBalanceTl:"27,50 TL" },
};

const TRANSACTION_NO = "PP-20260724-1842";
const TRANSACTION_DATE = "24 Temmuz 2026 • 01:18";

const PRODUCTS = [
  { id:"sp-1", name:"Buharlı Masaj Tarağı",   price:"399 TL", img:"https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop" },
  { id:"sp-2", name:"Göz Yaşı Bakım Losyonu", price:"289 TL", img:"https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop" },
  { id:"sp-3", name:"Mor Air Mesh Tasma",      price:"249 TL", img:"https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=300&h=300&fit=crop" },
  { id:"sp-4", name:"Toy Poodle Ödül Paketi",  price:"499 TL", img:"https://images.unsplash.com/photo-1581888227599-779811939961?w=300&h=300&fit=crop" },
];

const OTHER_REWARDS = [
  { id:"or-1", title:"50 TL İndirim",   status:"Kullanılabilir", expiry:"31 Ağustos" },
  { id:"or-2", title:"Ücretsiz Kargo",  status:"Kullanılabilir", expiry:"12 Ağustos" },
];

const FAQ_ITEMS = [
  { id:"faq-1", q:"Kupon neden çalışmıyor?",  a:"Minimum sepet tutarına ulaştığınızdan emin olun. Kupon tek kullanımlıktır ve başka kuponlarla birleştirilemez." },
  { id:"faq-2", q:"İptal ve puan iadesi",       a:"Kullanılmamış kuponlar 30 gün içinde iade talep edilebilir. Kullanılan kuponlarda puan iadesi yapılmaz." },
  { id:"faq-3", q:"Yardım ve destek",            a:"Yardım Merkezi'nden destek ekibimize ulaşabilirsiniz." },
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

/* ── QR Code stub ────────────────────── */
function QRCode() {
  const cell = (filled:boolean) => (
    <div style={{ width:4, height:4, background: filled ? "#1F2937" : "transparent" }} />
  );
  const row = (pattern: number[]) => (
    <div style={{ display:"flex" }}>{pattern.map((v,i)=><div key={i}>{cell(!!v)}</div>)}</div>
  );
  const p = [
    [1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
    [1,0,1,1,0,1,1,1,0,0,1,0,1,0,1,1,0],
    [0,1,0,0,1,0,0,1,1,0,0,1,0,1,0,0,1],
    [1,0,1,0,0,1,1,0,0,1,1,0,1,0,1,0,1],
    [0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,1,0],
    [1,1,1,1,1,1,1,0,1,0,1,0,0,1,0,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,1,0,1,0,0],
    [1,0,1,1,1,0,1,0,1,0,1,0,0,1,0,1,0],
    [1,0,0,0,0,0,1,0,0,1,0,0,1,0,1,0,1],
    [1,1,1,1,1,1,1,0,1,1,1,1,0,1,0,0,1],
  ];
  return (
    <div style={{ background:"#fff", borderRadius:8, padding:4, display:"inline-block" }}>
      {p.map((r,i)=><div key={i}>{row(r)}</div>)}
    </div>
  );
}

/* ── Toggle switch ───────────────────── */
function Toggle({ on, onToggle }: { on:boolean; onToggle:()=>void }) {
  return (
    <button onClick={onToggle}
      style={{ width:44, height:24, borderRadius:999, background: on ? P : "#D1D5DB",
               border:"none", cursor:"pointer", position:"relative", flexShrink:0,
               transition:"background .2s" }}>
      <div style={{ position:"absolute", top:3, left: on ? 22 : 3, width:18, height:18,
                    borderRadius:999, background:"#fff",
                    boxShadow:"0 1px 4px rgba(0,0,0,.2)", transition:"left .2s" }} />
    </button>
  );
}

/* ── Main Page ───────────────────────── */
export default function YPOdulHazirPage() {
  const [, navigate] = useLocation();
  const params = useParams<{ rewardId?: string }>();
  const rewardId = params.rewardId || "pr-1";
  const reward = REWARDS[rewardId] || REWARDS["pr-1"];

  const [reminderOn, setReminderOn]   = useState(true);
  const [copiedCode, setCopiedCode]   = useState(false);
  const [copiedTx, setCopiedTx]       = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<string|null>(null);
  const [toast, setToast]             = useState<string|null>(null);
  const [addedToCart, setAddedToCart] = useState<Set<string>>(new Set());

  const showToast = (msg:string) => { setToast(msg); setTimeout(()=>setToast(null), 3000); };

  function copyCouponCode() {
    navigator.clipboard.writeText(reward.couponCode).catch(()=>{});
    setCopiedCode(true); setTimeout(()=>setCopiedCode(false), 2000);
    showToast("Kupon kodu kopyalandı ✓");
  }
  function copyTxNo() {
    navigator.clipboard.writeText(TRANSACTION_NO).catch(()=>{});
    setCopiedTx(true); setTimeout(()=>setCopiedTx(false), 2000);
    showToast("İşlem no kopyalandı ✓");
  }
  function addToCart(id:string, name:string) {
    setAddedToCart(prev => new Set([...prev, id]));
    showToast(`${name} sepete eklendi ✓`);
  }
  function addBundle() {
    setAddedToCart(prev => new Set([...prev, "sp-1", "sp-2"]));
    showToast("Paket sepete eklendi ✓");
  }
  function shareVia(type:string) {
    if (type === "link") {
      navigator.clipboard.writeText(window.location.href).catch(()=>{});
      showToast("Bağlantı kopyalandı ✓");
    } else if (type === "whatsapp") {
      window.open(`https://wa.me/?text=YourPoodle kuponu: ${reward.couponCode}`, "_blank");
    } else {
      showToast("Paylaşım açıldı");
    }
  }

  const HOW_STEPS = [
    { num:1, icon:<ShoppingBag size={16} color={P}/>,   text:"Mağazadan ürünleri seç"       },
    { num:2, icon:<ShoppingCart size={16} color={P}/>,  text:"500 TL sepet tutarına ulaş"    },
    { num:3, icon:<Ticket size={16} color={P}/>,        text:"Ödemede kuponu uygula"          },
  ];

  return (
    <YPLayout activeLink="club" constrain={false}>
      {toast && <Toast msg={toast} onClose={()=>setToast(null)} />}

      <div className="yp-acct" style={{ margin:"0 auto", background:BG, minHeight:"100vh", paddingBottom:32, fontFamily:"Inter,sans-serif" }}>

        {/* ── BREADCRUMB ── */}
        <div style={{ padding:"12px 16px 6px" }}>
          <button onClick={()=>navigate("/hesabim/poodle-puanlari/odul-merkezi")}
            style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:6, padding:0 }}>
            <ArrowLeft size={15} color={P}/>
            <span style={{ fontSize:11, color:P, fontWeight:500 }}>Hesabım / PoodlePuanlarım / Ödülünüz Hazır</span>
          </button>
        </div>

        {/* ── SUCCESS HERO ── */}
        <div style={{ padding:"8px 16px 12px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
            {/* Illustration: poodle + gift + checkmark */}
            <div style={{ position:"relative", width:120, height:110, flexShrink:0 }}>
              {/* Poodle */}
              <img src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=180&h=180&fit=crop"
                   alt="Poodle" style={{ position:"absolute", bottom:0, left:0, width:80, height:80,
                                         borderRadius:999, objectFit:"cover", border:`3px solid #fff`,
                                         boxShadow:"0 2px 8px rgba(0,0,0,.12)" }}
                   onError={e=>{(e.target as HTMLImageElement).style.display="none"}}/>
              {/* Gift box */}
              <div style={{ position:"absolute", bottom:4, right:0,
                            width:52, height:52, background:`linear-gradient(135deg,${P},${PD})`,
                            borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center",
                            boxShadow:"0 3px 10px rgba(93,62,189,.4)" }}>
                <Gift size={26} color="#fff"/>
              </div>
              {/* Checkmark circle */}
              <div style={{ position:"absolute", top:0, right:12,
                            width:32, height:32, borderRadius:999, background:P,
                            display:"flex", alignItems:"center", justifyContent:"center",
                            boxShadow:"0 2px 8px rgba(93,62,189,.5)" }}>
                <Check size={16} color="#fff" strokeWidth={3}/>
              </div>
              {/* Confetti sparkles */}
              <Sparkles size={14} color={GOLDB} style={{ position:"absolute", top:2, left:8 }}/>
              <Sparkles size={10} color={P}     style={{ position:"absolute", top:18, right:2 }}/>
              <Sparkles size={10} color="#F472B6" style={{ position:"absolute", bottom:28, right:38 }}/>
            </div>

            {/* Text */}
            <div style={{ flex:1 }}>
              <div style={{ fontSize:22, fontWeight:900, color:P, marginBottom:5, lineHeight:1.2 }}>Ödülünüz Hazır!</div>
              <div style={{ fontSize:12, color:GT, lineHeight:1.55 }}>
                {reward.pointsUsed} PoodlePuan başarıyla kullanıldı.<br/>
                {reward.discountAmount} indirim kuponunuz hesabınıza tanımlandı.
              </div>
            </div>
          </div>

          {/* Transaction box */}
          <div style={{ background:"#F3F4F6", borderRadius:12, padding:"10px 14px",
                        display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div>
              <div style={{ fontSize:11, color:"#374151", fontWeight:600 }}>
                İşlem No: {TRANSACTION_NO}
              </div>
              <div style={{ fontSize:10, color:"#9CA3AF", marginTop:2 }}>{TRANSACTION_DATE}</div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <button onClick={copyTxNo}
                style={{ background:"none", border:"none", cursor:"pointer", padding:4 }}>
                {copiedTx ? <Check size={14} color={GRN}/> : <Copy size={14} color={GT}/>}
              </button>
              <div style={{ fontSize:10, color:"#9CA3AF" }}>📅 {TRANSACTION_DATE.split("•")[0].trim()}</div>
            </div>
          </div>
        </div>

        {/* ── COUPON CARD ── */}
        <div style={{ margin:"0 16px 4px", borderRadius:20, background:`linear-gradient(135deg,${P},${PD})`,
                      padding:"16px 14px", overflow:"hidden", position:"relative" }}>
          {/* Paw pattern overlay */}
          <div style={{ position:"absolute", inset:0, opacity:.06, pointerEvents:"none",
                        backgroundImage:`radial-gradient(circle, #fff 1.5px, transparent 1.5px)`,
                        backgroundSize:"20px 20px" }} />

          <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
            {/* Left: ticket visual */}
            <div style={{ flexShrink:0, width:80, position:"relative" }}>
              <div style={{ width:76, borderRadius:12, background:"rgba(255,255,255,.18)",
                            border:"1.5px solid rgba(255,255,255,.3)", padding:"10px 6px",
                            display:"flex", flexDirection:"column", alignItems:"center",
                            position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", left:-7, top:"48%", transform:"translateY(-50%)",
                              width:14, height:14, borderRadius:999, background:P }} />
                <div style={{ position:"absolute", right:-7, top:"48%", transform:"translateY(-50%)",
                              width:14, height:14, borderRadius:999, background:P }} />
                <span style={{ fontSize:20, fontWeight:900, color:GOLDB, lineHeight:1 }}>50 TL</span>
                <span style={{ fontSize:7, fontWeight:800, color:"rgba(255,255,255,.8)", letterSpacing:1, marginTop:2 }}>İNDİRİM</span>
              </div>
              {/* Gold coin */}
              <div style={{ position:"absolute", bottom:-6, right:-2, width:22, height:22, borderRadius:999,
                            background:`radial-gradient(circle at 35% 35%, ${GOLDB}, #D97706)`,
                            display:"flex", alignItems:"center", justifyContent:"center",
                            boxShadow:"0 2px 5px rgba(0,0,0,.2)" }}>
                <PawPrint size={10} color="#fff" strokeWidth={2.5}/>
              </div>
            </div>

            {/* Center */}
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:800, color:"#fff", marginBottom:4 }}>{reward.title}</div>
              <div style={{ display:"inline-block", background:"#F0FDF4", color:GRN,
                            fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:999, marginBottom:8 }}>
                Kullanılabilir
              </div>

              {/* Code box */}
              <div style={{ background:"#fff", borderRadius:10, padding:"8px 10px",
                            display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:7 }}>
                <span style={{ fontSize:13, fontWeight:800, color:DRK, letterSpacing:1.5 }}>{reward.couponCode}</span>
                <button onClick={copyCouponCode}
                  style={{ background:"none", border:"none", cursor:"pointer", padding:"2px 4px" }}>
                  {copiedCode ? <Check size={14} color={GRN}/> : <Copy size={14} color={GT}/>}
                </button>
              </div>

              {/* Kodu Kopyala button */}
              <button onClick={copyCouponCode}
                style={{ width:"100%", background:"rgba(255,255,255,.2)", border:"1.5px solid rgba(255,255,255,.4)",
                         color:"#fff", borderRadius:10, padding:"8px 0", fontSize:11, fontWeight:700,
                         cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center",
                         justifyContent:"center", gap:5 }}>
                <Copy size={12} color="#fff"/> Kodu Kopyala
              </button>
            </div>

            {/* Right: QR */}
            <div style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center" }}>
              <QRCode />
              <div style={{ fontSize:9, color:"rgba(255,255,255,.75)", marginTop:4, textAlign:"center" }}>Kasada okut</div>
            </div>
          </div>

          {/* Card footer: Min Sepet / Son Kullanma / Tüm ürünler */}
          <div style={{ display:"flex", borderTop:"1px solid rgba(255,255,255,.2)",
                        marginTop:14, paddingTop:10, gap:0 }}>
            {[
              { icon:<ShoppingCart size={11} color="rgba(255,255,255,.8)"/>, label:"Min. Sepet",     val:reward.minCart },
              { icon:<Calendar     size={11} color="rgba(255,255,255,.8)"/>, label:"Son Kullanma",   val:reward.expiryDate },
              { icon:<Tag          size={11} color="rgba(255,255,255,.8)"/>, label:null,              val:reward.validFor },
            ].map((col, i) => (
              <div key={i} style={{ flex:1, textAlign:"center", borderRight: i<2 ? "1px solid rgba(255,255,255,.15)" : "none", padding:"0 4px" }}>
                <div style={{ display:"flex", justifyContent:"center", marginBottom:2 }}>{col.icon}</div>
                {col.label && <div style={{ fontSize:9, color:"rgba(255,255,255,.6)" }}>{col.label}</div>}
                <div style={{ fontSize:9, color:"rgba(255,255,255,.9)", fontWeight:600, lineHeight:1.3 }}>{col.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── ACTION BUTTONS ── */}
        <div style={{ padding:"12px 16px 16px", display:"flex", flexDirection:"column", gap:10 }}>
          <button onClick={()=>{ showToast("Mağazaya yönlendiriliyor..."); navigate("/yourpoodle"); }}
            style={{ width:"100%", background:P, color:"#fff", border:"none", borderRadius:14,
                     padding:"16px 0", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
                     display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            <ShoppingBag size={17} color="#fff"/> Mağazada Kullan
          </button>
          <button onClick={()=>navigate("/hesabim/poodle-puanlari/odul-merkezi")}
            style={{ width:"100%", background:"#fff", border:`2px solid ${P}`, color:P,
                     borderRadius:14, padding:"14px 0", fontSize:14, fontWeight:700,
                     cursor:"pointer", fontFamily:"inherit" }}>
            Kuponlarıma Git
          </button>
        </div>

        {/* ── BALANCE CARD ── */}
        <div style={{ margin:"0 16px 14px", background:"#fff", borderRadius:20,
                      border:`1px solid ${GB}`, boxShadow:"0 1px 5px rgba(0,0,0,.05)", padding:"14px 16px" }}>
          <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
            {/* Gold coin */}
            <div style={{ width:44, height:44, borderRadius:999, flexShrink:0,
                          background:`radial-gradient(circle at 35% 35%, ${GOLDB}, #D97706)`,
                          display:"flex", alignItems:"center", justifyContent:"center",
                          boxShadow:"0 2px 8px rgba(0,0,0,.15)" }}>
              <PawPrint size={20} color="#fff" strokeWidth={2.5}/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:11, color:GT, marginBottom:2 }}>Yeni Puan Bakiyen</div>
              <div style={{ fontSize:22, fontWeight:900, color:DRK }}>
                {reward.newBalance.toLocaleString("tr-TR")} <span style={{ fontSize:13, fontWeight:600 }}>PoodlePuan</span>
              </div>
              <div style={{ fontSize:11, color:GT }}>({reward.newBalanceTl} indirim değerinde)</div>
              <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:6 }}>
                <CheckCircle size={13} color={GRN}/>
                <span style={{ fontSize:11, color:GRN, fontWeight:600 }}>İşlem tamamlandı</span>
              </div>
              <button onClick={()=>navigate("/hesabim/poodle-puanlari")}
                style={{ background:"none", border:"none", color:P, fontSize:11, fontWeight:700,
                         cursor:"pointer", fontFamily:"inherit", padding:"6px 0 0", display:"flex", alignItems:"center", gap:3 }}>
                Puan Detaylarını Gör <ArrowRight size={12} color={P}/>
              </button>
            </div>
          </div>
        </div>

        {/* ── HOW TO USE ── */}
        <div style={{ margin:"0 16px 10px", background:"#fff", borderRadius:20,
                      border:`1px solid ${GB}`, boxShadow:"0 1px 5px rgba(0,0,0,.05)", padding:"14px 16px" }}>
          <div style={{ fontSize:13, fontWeight:800, color:DRK, marginBottom:14 }}>Kuponu nasıl kullanırsın?</div>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
            {HOW_STEPS.map((step, i) => (
              <div key={step.num} style={{ display:"flex", alignItems:"flex-start", flex:1 }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:1 }}>
                  <div style={{ width:28, height:28, borderRadius:999, background:P, flexShrink:0,
                                display:"flex", alignItems:"center", justifyContent:"center", marginBottom:6 }}>
                    <span style={{ fontSize:11, fontWeight:800, color:"#fff" }}>{step.num}</span>
                  </div>
                  <div style={{ marginBottom:4 }}>{step.icon}</div>
                  <div style={{ fontSize:10, color:GT, textAlign:"center", lineHeight:1.4 }}>{step.text}</div>
                </div>
                {i < HOW_STEPS.length-1 && (
                  <div style={{ flexShrink:0, marginTop:8, color:"#D1D5DB", padding:"0 4px" }}>
                    <ArrowRight size={14} color="#D1D5DB"/>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── REMINDER TOGGLE ── */}
        <div style={{ margin:"0 16px 14px", background:PL, borderRadius:14,
                      padding:"12px 14px", display:"flex", alignItems:"center", gap:10 }}>
          <Bell size={18} color={P} style={{ flexShrink:0 }}/>
          <div style={{ flex:1, fontSize:11, color:"#374151", lineHeight:1.5 }}>
            <strong>Kuponunu unutma.</strong> Sona ermeden 3 gün önce sana haber vereceğiz.
          </div>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, flexShrink:0 }}>
            <Toggle on={reminderOn} onToggle={()=>{ setReminderOn(v=>!v); if(reminderOn) showToast("Hatırlatıcı kapatıldı"); }}/>
            <span style={{ fontSize:9, color: reminderOn ? P : GT, fontWeight:700 }}>
              {reminderOn ? "Hatırlatıcı Açık" : "Kapalı"}
            </span>
          </div>
        </div>

        {/* ── PRODUCT GRID ── */}
        <div style={{ padding:"0 16px 14px" }}>
          <div style={{ fontSize:13, fontWeight:800, color:DRK, marginBottom:12 }}>Kuponla Alabileceğin Ürünler</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {PRODUCTS.map(p => {
              const inCart = addedToCart.has(p.id);
              return (
                <div key={p.id} style={{ background:"#fff", borderRadius:18,
                                          border:`1.5px solid ${GB}`, overflow:"hidden",
                                          boxShadow:"0 1px 5px rgba(0,0,0,.05)",
                                          display:"flex", flexDirection:"column" }}>
                  <div style={{ position:"relative" }}>
                    <img src={p.img} alt={p.name}
                         style={{ width:"100%", aspectRatio:"1/1", objectFit:"cover", display:"block" }}
                         onError={e=>{ const el=e.target as HTMLImageElement; el.style.background=PL; el.style.minHeight="100px"; }}/>
                    <div style={{ position:"absolute", top:6, left:6, background:PL, color:P,
                                  fontSize:9, fontWeight:700, padding:"2px 6px", borderRadius:6 }}>
                      50 TL kuponuna uygun
                    </div>
                  </div>
                  <div style={{ padding:"9px 10px 10px", display:"flex", flexDirection:"column", gap:3, flex:1 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:DRK, lineHeight:1.35 }}>{p.name}</div>
                    <div style={{ fontSize:13, fontWeight:800, color:P }}>{p.price}</div>
                    <button onClick={()=>addToCart(p.id, p.name)}
                      style={{ marginTop:4, width:"100%", background: inCart ? "#E5E7EB" : P,
                               color: inCart ? GT : "#fff", border:"none", borderRadius:10,
                               padding:"8px 0", fontSize:10, fontWeight:700,
                               cursor:"pointer", fontFamily:"inherit", display:"flex",
                               alignItems:"center", justifyContent:"center", gap:4 }}>
                      {inCart ? <><Check size={11}/> Eklendi</> : "Sepete Ekle"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── BUNDLE OFFER ── */}
        <div style={{ margin:"0 16px 14px", background:"#fff", borderRadius:20,
                      border:`1.5px solid ${GB}`, boxShadow:"0 1px 5px rgba(0,0,0,.05)", padding:"14px 16px" }}>
          <div style={{ fontSize:13, fontWeight:800, color:DRK, marginBottom:10 }}>Kuponu hemen kullan</div>
          {/* Thumbnails */}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
            <div style={{ position:"relative", width:70 }}>
              <img src={PRODUCTS[0].img} alt="" style={{ width:48, height:48, borderRadius:10, objectFit:"cover", border:"2px solid #fff", boxShadow:"0 1px 4px rgba(0,0,0,.1)" }}/>
              <img src={PRODUCTS[1].img} alt="" style={{ position:"absolute", left:24, top:0, width:48, height:48, borderRadius:10, objectFit:"cover", border:"2px solid #fff", boxShadow:"0 1px 4px rgba(0,0,0,.1)" }}/>
            </div>
            <div style={{ marginLeft:28 }}>
              <div style={{ fontSize:11, fontWeight:600, color:DRK }}>Tarak + Bakım Losyonu</div>
              <div style={{ fontSize:10, color:GT, marginTop:1 }}>İkili bakım seti</div>
            </div>
          </div>
          {/* Pricing */}
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
            <span style={{ fontSize:12, color:GT }}>Alt toplam</span>
            <span style={{ fontSize:12, fontWeight:600, color:DRK }}>688 TL</span>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <span style={{ fontSize:12, color:GT }}>Kuponla</span>
            <span style={{ fontSize:13, fontWeight:800, color:GRN }}>638 TL</span>
          </div>
          <button onClick={addBundle}
            style={{ width:"100%", background:P, color:"#fff", border:"none", borderRadius:12,
                     padding:"13px 0", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
                     display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
            <ShoppingCart size={15} color="#fff"/> Sepete Ekle
          </button>
        </div>

        {/* ── KAZANDIĞIM ÖDÜLLER ── */}
        <div style={{ padding:"0 16px 14px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <span style={{ fontSize:13, fontWeight:800, color:DRK }}>Kazandığım Ödüller</span>
            <button onClick={()=>navigate("/hesabim/poodle-puanlari/odul-merkezi")}
              style={{ background:"none", border:"none", color:P, fontSize:11, fontWeight:700,
                       cursor:"pointer", fontFamily:"inherit" }}>
              Tüm Ödüllerim &gt;
            </button>
          </div>
          <div style={{ background:"#fff", borderRadius:18, border:`1px solid ${GB}`,
                        overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
            {OTHER_REWARDS.map((r, i) => (
              <div key={r.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 14px",
                                        borderBottom: i<OTHER_REWARDS.length-1 ? `1px solid #F9FAFB` : "none" }}>
                <div style={{ width:34, height:34, borderRadius:10, background:PL, flexShrink:0,
                              display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Ticket size={16} color={P}/>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:DRK }}>{r.title}</div>
                  <div style={{ fontSize:11, color:GRN, fontWeight:600 }}>{r.status}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:10, color:GT }}>{r.expiry}</div>
                  <ArrowRight size={13} color="#D1D5DB"/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SHARE ROW ── */}
        <div style={{ padding:"0 16px 14px" }}>
          <div style={{ fontSize:13, fontWeight:800, color:DRK, marginBottom:12 }}>Ödülünü paylaş</div>
          <div style={{ display:"flex", gap:14, justifyContent:"center" }}>
            {[
              { type:"link",      icon:<Link2       size={18} color="#6B7280"/>, bg:"#F3F4F6" },
              { type:"sms",       icon:<MessageSquare size={18} color="#2563EB"/>, bg:"#EFF6FF" },
              { type:"whatsapp",  icon:<span style={{ fontSize:18 }}>💬</span>, bg:"#F0FDF4"  },
              { type:"mail",      icon:<Mail        size={18} color="#D97706"/>, bg:"#FFFBEB" },
              { type:"more",      icon:<MoreHorizontal size={18} color={GT}/>,  bg:"#F3F4F6" },
            ].map(s => (
              <button key={s.type} onClick={()=>shareVia(s.type)}
                style={{ width:46, height:46, borderRadius:999, background:s.bg,
                         border:"none", cursor:"pointer", display:"flex",
                         alignItems:"center", justifyContent:"center",
                         boxShadow:"0 1px 4px rgba(0,0,0,.08)" }}>
                {s.icon}
              </button>
            ))}
          </div>
        </div>

        {/* ── SECURITY BADGE ── */}
        <div style={{ margin:"0 16px 14px", border:"2px solid #BBF7D0", background:"#F0FDF4",
                      borderRadius:14, padding:"12px 14px", display:"flex", gap:10, alignItems:"flex-start" }}>
          <ShieldCheck size={18} color={GRN} style={{ flexShrink:0, marginTop:1 }}/>
          <div style={{ fontSize:11, color:"#374151", lineHeight:1.6 }}>
            <strong>Ödülünüz güvenle hesabınıza eklendi.</strong> Kupon kodunuz Hesabım &gt; Kuponlarım bölümünden istediğiniz zaman görebilirsiniz.
          </div>
        </div>

        {/* ── FAQ ── */}
        <div style={{ padding:"0 16px 14px" }}>
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

        {/* ── CLOSING BANNER ── */}
        <div style={{ margin:"0 16px 16px", background:PL, borderRadius:20, padding:"14px 16px",
                      display:"flex", alignItems:"center", gap:12 }}>
          <img src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=120&h=120&fit=crop"
               alt="Poodle" style={{ width:52, height:52, borderRadius:999, objectFit:"cover",
                                     border:`2px solid #fff`, boxShadow:"0 2px 6px rgba(0,0,0,.1)", flexShrink:0 }}
               onError={e=>{(e.target as HTMLImageElement).style.display="none"}} />
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:800, color:DRK, marginBottom:2 }}>Güle güle kullan!</div>
            <div style={{ fontSize:11, color:GT, marginBottom:8 }}>Yeni ödüller için puan kazanmaya devam et.</div>
            <button onClick={()=>navigate("/hesabim/poodle-puanlari")}
              style={{ background:P, color:"#fff", border:"none", borderRadius:12,
                       padding:"8px 16px", fontSize:11, fontWeight:700,
                       cursor:"pointer", fontFamily:"inherit" }}>
              Puan Kazanma Yolları →
            </button>
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
          <div style={{ display:"flex", gap:8, marginBottom:10, flexWrap:"wrap" }}>
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
