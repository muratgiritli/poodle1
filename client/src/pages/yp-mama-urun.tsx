import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Menu, ShoppingBag, PawPrint, BookOpen, Sparkles,
  ChevronLeft, Heart, Share2, CreditCard, ShieldCheck,
  Truck, Package, RotateCcw, MapPin, ChevronRight,
  Stethoscope, Fish, Minus, Plus, ShoppingCart,
  FileText, List, BarChart2, Info, BadgeCheck,
  Star, CircleDot, ChevronDown, ChevronUp,
} from "lucide-react";

/* ─── Palette ────────────────────────────────────────── */
const P   = "#6B21A8"; // purple-primary
const PB  = "#7C3AED"; // purple-bright
const PL  = "#F3EEFF"; // purple-light
const PBD = "#DDD6FE"; // purple-border
const GB  = "#E5E7EB"; // border-light

/* ─── Mock Data ─────────────────────────────────────── */
interface ProductPackage {
  id: string; weight: string; price: number; barcode: string;
  originalPrice: number; label: string;
}

const PACKAGES: ProductPackage[] = [
  { id:"pkg-1.5", weight:"1,5 kg", price:899,  barcode:"7613035123454", originalPrice:1049, label:"749 TL" },
  { id:"pkg-3",   weight:"3 kg",   price:1349, barcode:"7613035123456", originalPrice:1599, label:"1.349 TL" },
  { id:"pkg-7",   weight:"7 kg",   price:2499, barcode:"7613035123458", originalPrice:2899, label:"2.699 TL" },
];

const FEATURE_TAGS = ["Yetişkin +1", "Sensitive", "Somonlu", "Küçük Irk"];

const WHY_FEATURES = [
  { icon: Stethoscope, label: "Hassas sindirim desteği" },
  { icon: Fish,         label: "Somonlu yüksek protein" },
  { icon: Sparkles,     label: "Deri ve tüy sağlığı" },
  { icon: CircleDot,    label: "Küçük ırklara özel tane" },
];

const ACCORDIONS = [
  { icon: FileText,  title: "Ürün Açıklaması",     content: "Pro Plan Small Adult Sensitive Somonlu, hassas sindirim sistemine sahip küçük ırk yetişkin köpekler için özel olarak formüle edilmiş premium kuru mamadır. Somon proteini ve prebiyotik lifler içerir." },
  { icon: List,      title: "İçindekiler",          content: "Somon (%18), pirinç, mısır gluteni, hayvansal yağ, kurutulmuş pancar küspesi, balık yağı, mineraller, vitaminler." },
  { icon: BarChart2, title: "Besin Değerleri",      content: "Ham protein: %27 | Ham yağ: %17 | Ham lif: %2,5 | Ham kül: %7 | Nem: %9,5" },
  { icon: Info,      title: "Kullanım ve Saklama",  content: "Günde 2 öğün olmak üzere paketteki beslenme tablosuna göre veriniz. Serin ve kuru yerde, güneş almayan ortamda saklayınız. Açıldıktan sonra 6 hafta içinde tüketiniz." },
];

const REVIEWS = [
  { id:"r1", initials:"A", name:"Ayşe K.",   rating:5, color:"#7C3AED", text:"Toy Poodle'um çok sevdi, sindirim sorunu yaşamadık. Kesinlikle tavsiye ederim!", verified:true },
  { id:"r2", initials:"M", name:"Mehmet D.", rating:5, color:"#3B82F6", text:"Tüyleri parlaklaştı, enerjisi arttı. 3 kg paket ideal boyut.", verified:true },
  { id:"r3", initials:"E", name:"Elif S.",   rating:4, color:"#EC4899", text:"Hızlı kargo, ürün taze. Tek eksik biraz pahalı ama kalitesi belli.", verified:true },
];

/* ─── Helpers ──────────────────────────────────────── */
function fmt(n: number) {
  return n.toLocaleString("tr-TR");
}
function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span style={{ display:"flex", gap:1 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={size}
          fill={i <= Math.round(rating) ? "#EAB308" : "none"}
          color={i <= Math.round(rating) ? "#EAB308" : "#D1D5DB"} />
      ))}
    </span>
  );
}

/* ─── Main Page ─────────────────────────────────────── */
export default function YPMamaUrunPage() {
  const [, navigate] = useLocation();

  /* state */
  const [pkgId, setPkgId]         = useState("pkg-3");
  const [qty, setQty]             = useState(1);
  const [imgIdx, setImgIdx]       = useState(0);
  const [liked, setLiked]         = useState(false);
  const [added, setAdded]         = useState(false);
  const [city, setCity]           = useState<string | null>(null);
  const [openAcc, setOpenAcc]     = useState<number | null>(null);
  const [calcKg, setCalcKg]       = useState("5");
  const [calcAct, setCalcAct]     = useState("Orta");
  const [calcResult, setCalcResult] = useState<string>("65–80 g");
  const reviewsRef = useRef<HTMLDivElement>(null);

  const pkg = PACKAGES.find(p => p.id === pkgId)!;
  const totalPrice    = pkg.price * qty;
  const savings       = pkg.originalPrice - pkg.price;
  const installAmt    = (totalPrice / 3).toFixed(2).replace(".", ",");

  const addToCart = () => {
    setAdded(true);
    setTimeout(() => { setAdded(false); navigate("/yourpoodle/sepet"); }, 800);
  };

  const share = () => {
    if (navigator.share) {
      navigator.share({ title: "Pro Plan Small Adult Sensitive Somonlu", url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
  };

  const calc = () => {
    const base = Number(calcKg) * 12;
    const mult = calcAct === "Düşük" ? 0.9 : calcAct === "Yüksek" ? 1.15 : 1.0;
    const r = base * mult;
    const mn = Math.round(r * 0.9);
    const mx = Math.round(r * 1.1);
    setCalcResult(`${mn}–${mx} g`);
  };

  const pickCity = () => {
    const cities = ["İstanbul", "Ankara", "İzmir", "Samsun"];
    const chosen = window.prompt("Şehir seçin:\n" + cities.join(", "), city || "");
    if (chosen && cities.includes(chosen)) setCity(chosen);
  };

  /* Tab nav */
  const TABS = [
    { key:"magaza", label:"Mağaza",     Icon:ShoppingBag, href:"/yourpoodle/magaza"     },
    { key:"club",   label:"Club",       Icon:PawPrint,    href:"/yourpoodle/club"       },
    { key:"ai",     label:"AI Asistan", Icon:Sparkles,    href:"/yourpoodle/ai-asistan" },
    { key:"rehber", label:"Rehber",     Icon:BookOpen,    href:"/yourpoodle/rehber"     },
  ];

  /* Image dots: 2 in mockup */
  const IMG_COUNT = 2;

  return (
    <div style={{ maxWidth:480, margin:"0 auto", background:"#fff",
                  minHeight:"100dvh", display:"flex", flexDirection:"column",
                  fontFamily:"Inter, system-ui, sans-serif",
                  boxShadow:"0 0 40px rgba(0,0,0,0.09)",
                  paddingBottom:88 }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        select { -webkit-appearance:none; appearance:none; }
        .acc-body { overflow:hidden; transition:max-height 0.25s ease; }
        .reviews-scroll::-webkit-scrollbar { display:none; }
        .reviews-scroll { -ms-overflow-style:none; scrollbar-width:none; }
        button { font-family:inherit; }
      `}</style>

      {/* ══ HEADER ════════════════════════════════════════ */}
      <header style={{ position:"sticky", top:0, zIndex:50, background:"#fff",
                       borderBottom:`1px solid ${GB}` }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                      height:56, padding:"0 16px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <button aria-label="Menü"
              style={{ width:36, height:36, border:"none", background:"none",
                       display:"flex", alignItems:"center", justifyContent:"center",
                       cursor:"pointer", color:"#374151" }}>
              <Menu size={22} />
            </button>
            <button onClick={() => navigate("/yourpoodle")}
              style={{ display:"flex", alignItems:"center", gap:8,
                       background:"none", border:"none", cursor:"pointer", padding:0 }}>
              <img src="/images/yp-poodle-hero.png" alt="YourPoodle"
                style={{ width:32, height:32, borderRadius:"50%",
                         objectFit:"cover", objectPosition:"center top" }} />
              <span style={{ fontSize:16, fontWeight:700, color:P }}>YourPoodle</span>
            </button>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button style={{ background:"none", border:"none", cursor:"pointer",
                             fontSize:13, color:"#374151", fontWeight:500 }}>
              Giriş Yap
            </button>
            <button style={{ background:P, color:"#fff", border:"none", borderRadius:999,
                             padding:"7px 16px", fontSize:13, fontWeight:600, cursor:"pointer" }}>
              Üye Ol
            </button>
          </div>
        </div>
        <nav style={{ display:"flex", borderBottom:`1px solid ${GB}` }}>
          {TABS.map(tab => {
            const active = tab.key === "magaza";
            return (
              <button key={tab.key} onClick={() => navigate(tab.href)}
                style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center",
                         gap:4, padding:"10px 0", background:"none", border:"none",
                         borderBottom: active ? `2px solid ${P}` : "2px solid transparent",
                         cursor:"pointer", color: active ? P : "#9CA3AF",
                         fontWeight: active ? 600 : 500, transition:"color 0.15s" }}>
                <tab.Icon size={20} />
                <span style={{ fontSize:11 }}>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </header>

      {/* ══ BREADCRUMB ════════════════════════════════════ */}
      <div style={{ display:"flex", alignItems:"center", gap:6,
                    padding:"12px 16px", fontSize:13 }}>
        <button onClick={() => navigate("/yourpoodle/mama-sonuclar")}
          aria-label="Geri"
          style={{ background:"none", border:"none", cursor:"pointer",
                   display:"flex", alignItems:"center", color:"#6B7280", padding:0 }}>
          <ChevronLeft size={17} />
        </button>
        <span style={{ color:"#9CA3AF" }}>Mağaza</span>
        <span style={{ color:"#9CA3AF" }}>/</span>
        <span style={{ color:"#9CA3AF" }}>Kuru Mama</span>
        <span style={{ color:"#9CA3AF" }}>/</span>
        <span style={{ color:"#111827", fontWeight:600 }}>Pro Plan</span>
      </div>

      {/* ══ GALLERY ═══════════════════════════════════════ */}
      <div style={{ padding:"0 16px", marginBottom:16 }}>
        {/* Main image */}
        <div style={{ position:"relative", borderRadius:20, overflow:"hidden",
                      background:"#F9FAFB", border:`1px solid ${GB}` }}>
          {/* Product image placeholder — Pro Plan brand bg */}
          <div style={{ width:"100%", aspectRatio:"1/1", display:"flex",
                        flexDirection:"column", alignItems:"center", justifyContent:"center",
                        background: imgIdx === 0
                          ? "linear-gradient(135deg,#EEF2FF 0%,#E0E7FF 100%)"
                          : "linear-gradient(135deg,#F0FDF4 0%,#DCFCE7 100%)",
                        position:"relative" }}>
            {/* Kibbles/food illustration */}
            <div style={{ fontSize:72, lineHeight:1, marginBottom:8, userSelect:"none" }}>
              {imgIdx === 0 ? "🦮" : "🐾"}
            </div>
            <div style={{ fontSize:11, fontWeight:700, color:"#003087",
                          letterSpacing:"0.5px", textAlign:"center" }}>
              PRO PLAN
            </div>
            <div style={{ fontSize:10, color:"#6B7280", textAlign:"center", marginTop:2 }}>
              Small Adult Sensitive
            </div>
          </div>

          {/* TOP LEFT badges */}
          <div style={{ position:"absolute", top:12, left:12,
                        display:"flex", flexDirection:"column", gap:5 }}>
            <span style={{ background:"#FEE2E2", color:"#DC2626",
                           fontSize:11, fontWeight:700, padding:"4px 10px",
                           borderRadius:999 }}>%15 İndirim</span>
            <span style={{ background:"#EDE9FE", color:"#5B21B6",
                           fontSize:11, fontWeight:700, padding:"4px 10px",
                           borderRadius:999 }}>Çok Satan</span>
          </div>

          {/* TOP RIGHT actions */}
          <div style={{ position:"absolute", top:12, right:12,
                        display:"flex", flexDirection:"column", gap:8 }}>
            <button onClick={() => setLiked(l => !l)}
              aria-label="Favorilere ekle"
              style={{ width:36, height:36, borderRadius:"50%", background:"#fff",
                       border:"none", cursor:"pointer", display:"flex",
                       alignItems:"center", justifyContent:"center",
                       boxShadow:"0 1px 6px rgba(0,0,0,0.12)" }}>
              <Heart size={17}
                color={liked ? "#EF4444" : "#9CA3AF"}
                fill={liked ? "#EF4444" : "none"} />
            </button>
            <button onClick={share}
              aria-label="Paylaş"
              style={{ width:36, height:36, borderRadius:"50%", background:"#fff",
                       border:"none", cursor:"pointer", display:"flex",
                       alignItems:"center", justifyContent:"center",
                       boxShadow:"0 1px 6px rgba(0,0,0,0.12)" }}>
              <Share2 size={16} color="#6B7280" />
            </button>
          </div>

          {/* Dots */}
          <div style={{ display:"flex", justifyContent:"center", gap:6,
                        paddingBottom:12, paddingTop:8 }}>
            {Array.from({ length: IMG_COUNT }).map((_, i) => (
              <button key={i} onClick={() => setImgIdx(i)}
                aria-label={`Resim ${i+1}`}
                style={{ width: imgIdx === i ? 20 : 8,
                         height:8, borderRadius:999, border:"none", cursor:"pointer",
                         background: imgIdx === i ? P : "#D1D5DB",
                         transition:"all 0.2s", padding:0 }} />
            ))}
          </div>
        </div>

        {/* Thumbnails */}
        <div style={{ display:"flex", gap:8, marginTop:10 }}>
          {[0, 1].map(i => (
            <button key={i} onClick={() => setImgIdx(i)}
              style={{ width:56, height:56, borderRadius:10, overflow:"hidden",
                       border:`2px solid ${imgIdx === i ? P : "transparent"}`,
                       background: i === 0
                         ? "linear-gradient(135deg,#EEF2FF,#E0E7FF)"
                         : "linear-gradient(135deg,#F0FDF4,#DCFCE7)",
                       cursor:"pointer", display:"flex", alignItems:"center",
                       justifyContent:"center", fontSize:24, flexShrink:0 }}>
              {i === 0 ? "🦮" : "🐾"}
            </button>
          ))}
        </div>
      </div>

      {/* ══ HEADER INFO ═══════════════════════════════════ */}
      <div style={{ padding:"0 16px", marginBottom:12 }}>
        <p style={{ fontSize:11, fontWeight:700, color:P,
                    letterSpacing:"0.8px", textTransform:"uppercase", marginBottom:4 }}>
          PRO PLAN
        </p>
        <h1 style={{ fontSize:16, fontWeight:800, color:"#111827",
                     lineHeight:1.35, marginBottom:10 }}>
          Pro Plan Small Adult Sensitive Somonlu Yetişkin Köpek Maması
        </h1>
        {/* Rating row */}
        <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
          <Stars rating={4.8} size={14} />
          <span style={{ fontSize:13, fontWeight:600, color:"#111827" }}>4,8</span>
          <span style={{ fontSize:12, color:"#9CA3AF" }}>127 değerlendirme</span>
          <button onClick={() => reviewsRef.current?.scrollIntoView({ behavior:"smooth" })}
            style={{ background:"none", border:"none", cursor:"pointer",
                     fontSize:12, color:P, fontWeight:600, fontFamily:"inherit" }}>
            Yorumları Gör
          </button>
        </div>
      </div>

      {/* ══ META BAR ══════════════════════════════════════ */}
      <div style={{ margin:"0 16px 12px",
                    border:`1px solid #F3F4F6`, borderRadius:12,
                    padding:"10px 14px",
                    display:"flex", flexWrap:"wrap", gap:"4px 16px",
                    fontSize:12, color:"#6B7280" }}>
        <span>Kg: {pkg.weight.replace(",",".")}</span>
        <span>Barkod: {pkg.barcode}</span>
        <span>SKT: 18.07.2027</span>
        <span style={{ display:"flex", alignItems:"center", gap:4, color:"#16A34A", fontWeight:500 }}>
          <span style={{ width:7, height:7, borderRadius:"50%",
                         background:"#22C55E", display:"inline-block" }} />
          Stokta
        </span>
      </div>

      {/* ══ FEATURE TAGS ══════════════════════════════════ */}
      <div style={{ padding:"0 16px", marginBottom:16,
                    display:"flex", flexWrap:"wrap", gap:8 }}>
        {FEATURE_TAGS.map(t => (
          <span key={t} style={{ background:PL, color:P,
                                  fontSize:12, fontWeight:500,
                                  padding:"5px 12px", borderRadius:999 }}>
            {t}
          </span>
        ))}
      </div>

      {/* ══ PRICING ════════════════════════════════════════ */}
      <div style={{ padding:"0 16px", marginBottom:16,
                    display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        {/* Left — prices */}
        <div>
          <p style={{ fontSize:13, color:"#9CA3AF", textDecoration:"line-through",
                      marginBottom:2 }}>
            {fmt(pkg.originalPrice)} TL
          </p>
          <p style={{ fontSize:26, fontWeight:800, color:P, lineHeight:1, marginBottom:4 }}>
            {fmt(pkg.price)} TL
          </p>
          <p style={{ fontSize:12, fontWeight:600, color:"#16A34A" }}>
            {fmt(savings)} TL kazanç
          </p>
        </div>
        {/* Right — installment */}
        <div style={{ border:`1px solid ${PBD}`, borderRadius:14,
                      padding:"10px 12px", background:"#FAFAFF" }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
            <CreditCard size={15} color={P} />
            <span style={{ fontSize:11, fontWeight:600, color:"#374151" }}>
              Peşin fiyatına 3 taksit
            </span>
          </div>
          <p style={{ fontSize:14, fontWeight:700, color:P }}>
            3 × {installAmt} TL
          </p>
        </div>
      </div>

      {/* ══ PACKAGE SELECTOR ══════════════════════════════ */}
      <div style={{ padding:"0 16px", marginBottom:16 }}>
        <p style={{ fontSize:13, fontWeight:700, color:"#111827", marginBottom:10 }}>
          Paket Seçimi
        </p>
        <div style={{ display:"flex", gap:8 }}>
          {PACKAGES.map(p => (
            <button key={p.id} onClick={() => setPkgId(p.id)}
              style={{ flex:1, borderRadius:12, padding:"10px 6px",
                       border:`2px solid ${pkgId === p.id ? P : GB}`,
                       background: pkgId === p.id ? PL : "#fff",
                       cursor:"pointer", textAlign:"center" }}>
              <p style={{ fontSize:13, fontWeight:700, color:"#111827",
                          marginBottom:3 }}>{p.weight}</p>
              <p style={{ fontSize:11, fontWeight:600, color:P }}>{p.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ══ QUANTITY ═══════════════════════════════════════ */}
      <div style={{ padding:"0 16px", marginBottom:16,
                    display:"flex", alignItems:"center", gap:14 }}>
        <span style={{ fontSize:13, fontWeight:500, color:"#374151" }}>Adet</span>
        <div style={{ display:"flex", alignItems:"center",
                      border:`1.5px solid ${PBD}`, borderRadius:12, overflow:"hidden" }}>
          <button aria-label="Azalt"
            onClick={() => setQty(q => Math.max(1, q - 1))}
            disabled={qty === 1}
            style={{ padding:"10px 14px", background:"none", border:"none",
                     cursor: qty === 1 ? "not-allowed" : "pointer",
                     color: qty === 1 ? "#D1D5DB" : "#374151",
                     display:"flex", alignItems:"center" }}>
            <Minus size={14} />
          </button>
          <span style={{ padding:"10px 16px", fontSize:14, fontWeight:600,
                         color:"#111827", minWidth:40, textAlign:"center" }}>
            {qty}
          </span>
          <button aria-label="Artır"
            onClick={() => setQty(q => Math.min(10, q + 1))}
            disabled={qty === 10}
            style={{ padding:"10px 14px", background:"none", border:"none",
                     cursor: qty === 10 ? "not-allowed" : "pointer",
                     color: qty === 10 ? "#D1D5DB" : "#374151",
                     display:"flex", alignItems:"center" }}>
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* ══ PURCHASE BUTTONS ══════════════════════════════ */}
      <div style={{ padding:"0 16px", marginBottom:10, display:"flex",
                    flexDirection:"column", gap:10 }}>
        {/* Sepete Ekle */}
        <button onClick={addToCart}
          style={{ width:"100%", background: added ? "#16A34A" : P, color:"#fff",
                   border:"none", borderRadius:14, padding:"15px 20px",
                   fontSize:15, fontWeight:700, cursor:"pointer",
                   display:"flex", alignItems:"center", justifyContent:"center",
                   gap:8, transition:"background 0.2s" }}>
          <ShoppingCart size={18} />
          {added ? "Sepete Eklendi ✓" : `Sepete Ekle — ${fmt(totalPrice)} TL`}
        </button>
        {/* Hemen Al */}
        <button onClick={() => alert("Ödeme sayfası yakında!")}
          style={{ width:"100%", background:"#fff",
                   border:`2px solid ${P}`, borderRadius:14, padding:"13px 20px",
                   fontSize:15, fontWeight:700, color:P, cursor:"pointer" }}>
          Hemen Al
        </button>
      </div>

      {/* ══ SSL BADGE ══════════════════════════════════════ */}
      <div style={{ padding:"0 16px", marginBottom:16,
                    display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
        <ShieldCheck size={14} color="#3B82F6" />
        <span style={{ fontSize:12, color:"#9CA3AF" }}>256-bit SSL ile güvenli ödeme</span>
      </div>

      {/* ══ SHIPPING BAR ══════════════════════════════════ */}
      <div style={{ margin:"0 16px", marginBottom:14,
                    display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
        {[
          { Icon:Truck,      text:"Bugün sipariş ver, yarın kargoda" },
          { Icon:Package,    text:"500 TL üzeri ücretsiz kargo" },
          { Icon:RotateCcw,  text:"14 gün içinde kolay iade" },
        ].map(({ Icon, text }) => (
          <div key={text} style={{ display:"flex", flexDirection:"column",
                                    alignItems:"center", textAlign:"center", gap:5 }}>
            <Icon size={18} color={P} />
            <span style={{ fontSize:10, color:"#4B5563", lineHeight:1.35 }}>{text}</span>
          </div>
        ))}
      </div>

      {/* ══ DELIVERY PICKER ═══════════════════════════════ */}
      <button onClick={pickCity}
        style={{ margin:"0 16px 20px",
                 display:"flex", alignItems:"center", justifyContent:"space-between",
                 background:"#F9FAFB", border:`1px solid ${GB}`,
                 borderRadius:14, padding:"13px 16px", cursor:"pointer",
                 fontFamily:"inherit", width:"calc(100% - 32px)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <MapPin size={16} color={P} />
          <span style={{ fontSize:13, color:"#374151" }}>
            {city ? `Teslimat: ${city}` : "Teslimat bölgenizi seçin"}
          </span>
        </div>
        <ChevronRight size={18} color="#9CA3AF" />
      </button>

      {/* ══ NEDEN BU MAMA? ════════════════════════════════ */}
      <div style={{ padding:"0 16px", marginBottom:20 }}>
        <p style={{ fontSize:15, fontWeight:800, color:"#111827", marginBottom:12 }}>
          Neden Bu Mama?
        </p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {WHY_FEATURES.map(({ icon: Icon, label }) => (
            <div key={label} style={{ background:"#F9FAFB", borderRadius:14,
                                       padding:"14px 10px",
                                       display:"flex", flexDirection:"column",
                                       alignItems:"center", textAlign:"center", gap:8 }}>
              <Icon size={22} color={P} />
              <span style={{ fontSize:12, fontWeight:500, color:"#374151",
                             lineHeight:1.4 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══ FOOD CALCULATOR ═══════════════════════════════ */}
      <div style={{ margin:"0 16px 20px", background:PL,
                    border:`1px solid ${PBD}`, borderRadius:18, padding:16 }}>
        <p style={{ fontSize:14, fontWeight:700, color:"#111827", marginBottom:4 }}>
          Günlük Mama Hesaplayıcı
        </p>
        <p style={{ fontSize:12, color:"#6B7280", marginBottom:14, lineHeight:1.5 }}>
          Poodle'ınızın kilosuna göre günlük miktarı hesaplayın.
        </p>
        <div style={{ display:"flex", gap:8, marginBottom:12 }}>
          {/* Kilo */}
          <div style={{ flex:1, position:"relative" }}>
            <select value={calcKg} onChange={e => setCalcKg(e.target.value)}
              style={{ width:"100%", background:"#fff", border:`1px solid ${GB}`,
                       borderRadius:10, padding:"10px 32px 10px 12px",
                       fontSize:13, color:"#374151", cursor:"pointer",
                       outline:"none", fontFamily:"inherit" }}>
              {[1,2,3,4,5,6,7,8].map(k => (
                <option key={k} value={String(k)}>{k} kg</option>
              ))}
            </select>
            <ChevronDown size={14} color="#9CA3AF"
              style={{ position:"absolute", right:10, top:"50%",
                       transform:"translateY(-50%)", pointerEvents:"none" }} />
          </div>
          {/* Aktivite */}
          <div style={{ flex:1, position:"relative" }}>
            <select value={calcAct} onChange={e => setCalcAct(e.target.value)}
              style={{ width:"100%", background:"#fff", border:`1px solid ${GB}`,
                       borderRadius:10, padding:"10px 32px 10px 12px",
                       fontSize:13, color:"#374151", cursor:"pointer",
                       outline:"none", fontFamily:"inherit" }}>
              <option>Düşük</option>
              <option>Orta</option>
              <option>Yüksek</option>
            </select>
            <ChevronDown size={14} color="#9CA3AF"
              style={{ position:"absolute", right:10, top:"50%",
                       transform:"translateY(-50%)", pointerEvents:"none" }} />
          </div>
        </div>
        <button onClick={calc}
          style={{ width:"100%", background:P, color:"#fff", border:"none",
                   borderRadius:12, padding:"11px 0", fontSize:13,
                   fontWeight:700, cursor:"pointer" }}>
          Hesapla
        </button>
        <p style={{ fontSize:13, fontWeight:600, color:P, marginTop:12, textAlign:"center" }}>
          Önerilen günlük miktar: {calcResult}
        </p>
      </div>

      {/* ══ ACCORDIONS ════════════════════════════════════ */}
      <div style={{ padding:"0 16px", marginBottom:20 }}>
        {ACCORDIONS.map((acc, i) => {
          const open = openAcc === i;
          const Icon = acc.icon;
          return (
            <div key={acc.title} style={{ borderTop:`1px solid #F3F4F6` }}>
              <button onClick={() => setOpenAcc(open ? null : i)}
                style={{ width:"100%", display:"flex", alignItems:"center",
                         justifyContent:"space-between", padding:"14px 0",
                         background:"none", border:"none", cursor:"pointer",
                         fontFamily:"inherit" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <Icon size={16} color={P} />
                  <span style={{ fontSize:13, fontWeight:600, color:"#111827" }}>
                    {acc.title}
                  </span>
                </div>
                {open
                  ? <ChevronUp size={16} color="#6B7280" />
                  : <ChevronDown size={16} color="#6B7280" />}
              </button>
              <div className="acc-body"
                style={{ maxHeight: open ? 400 : 0 }}>
                <p style={{ fontSize:13, color:"#6B7280", lineHeight:1.65,
                            paddingBottom:14 }}>
                  {acc.content}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ══ REVIEWS ════════════════════════════════════════ */}
      <div ref={reviewsRef} id="reviews" style={{ padding:"0 16px", marginBottom:20 }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"flex-start",
                      justifyContent:"space-between", marginBottom:16 }}>
          <div>
            <p style={{ fontSize:22, fontWeight:800, color:"#111827" }}>
              Müşteri Yorumları
            </p>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:6 }}>
              <span style={{ fontSize:20, fontWeight:800 }}>4,8</span>
              <span style={{ fontSize:14, color:"#6B7280" }}>/ 5</span>
            </div>
            <div style={{ display:"flex", gap:3, marginTop:4 }}>
              <Stars rating={4.8} size={16} />
            </div>
            <p style={{ fontSize:12, color:"#9CA3AF", marginTop:3 }}>127 değerlendirme</p>
          </div>
        </div>

        {/* Horizontal scroll cards */}
        <div className="reviews-scroll"
          style={{ display:"flex", gap:12, overflowX:"auto",
                   paddingBottom:4, cursor:"grab" }}>
          {REVIEWS.map(r => (
            <div key={r.id}
              style={{ minWidth:240, background:"#F9FAFB", borderRadius:14,
                       padding:16, flexShrink:0 }}>
              {/* Avatar row */}
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:36, height:36, borderRadius:"50%",
                              background:r.color, display:"flex",
                              alignItems:"center", justifyContent:"center",
                              color:"#fff", fontSize:14, fontWeight:700,
                              flexShrink:0 }}>
                  {r.initials}
                </div>
                <div>
                  <p style={{ fontSize:13, fontWeight:600, color:"#111827" }}>{r.name}</p>
                  <Stars rating={r.rating} size={12} />
                </div>
              </div>
              <p style={{ fontSize:12, color:"#4B5563", lineHeight:1.6,
                          marginTop:10 }}>
                {r.text}
              </p>
              {r.verified && (
                <div style={{ display:"flex", alignItems:"center", gap:4,
                              marginTop:10 }}>
                  <BadgeCheck size={12} color="#16A34A" />
                  <span style={{ fontSize:10, color:"#16A34A" }}>
                    Doğrulanmış Alışveriş
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        <button onClick={() => alert("Tüm yorumlar yakında!")}
          style={{ width:"100%", marginTop:16, background:"#fff",
                   border:`2px solid ${P}`, color:P, borderRadius:12,
                   padding:"13px 0", fontSize:13, fontWeight:700,
                   cursor:"pointer", fontFamily:"inherit" }}>
          Tüm Yorumları Gör
        </button>
      </div>

      {/* ══ STICKY BOTTOM BAR ════════════════════════════ */}
      <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:50,
                    display:"flex", justifyContent:"center", pointerEvents:"none" }}>
        <div style={{ maxWidth:480, width:"100%", background:"#fff",
                      borderTop:`1px solid ${GB}`, padding:"12px 16px",
                      display:"flex", alignItems:"center",
                      justifyContent:"space-between",
                      boxShadow:"0 -4px 16px rgba(0,0,0,0.08)",
                      pointerEvents:"all" }}>
          <div>
            <p style={{ fontSize:18, fontWeight:800, color:P }}>{fmt(totalPrice)} TL</p>
            <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:2 }}>
              <span style={{ width:7, height:7, borderRadius:"50%",
                             background:"#22C55E", display:"inline-block" }} />
              <span style={{ fontSize:11, color:"#16A34A", fontWeight:500 }}>Stokta</span>
            </div>
          </div>
          <button onClick={addToCart}
            style={{ background: added ? "#16A34A" : P, color:"#fff",
                     border:"none", borderRadius:12, padding:"11px 20px",
                     fontSize:13, fontWeight:700, cursor:"pointer",
                     display:"flex", alignItems:"center", gap:6,
                     transition:"background 0.2s" }}>
            <ShoppingCart size={16} />
            {added ? "Eklendi ✓" : "Sepete Ekle"}
          </button>
        </div>
      </div>
    </div>
  );
}
