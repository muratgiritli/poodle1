import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import YPLayout from "@/components/yourpoodle/YPLayout";
import {
  ChevronLeft, Heart, Share2, CreditCard, ShieldCheck,
  Truck, Package, RotateCcw, MapPin, ChevronRight,
  Stethoscope, Fish, Minus, Plus, ShoppingCart,
  FileText, List, BarChart2, Info, BadgeCheck,
  Star, CircleDot, ChevronDown, ChevronUp, Sparkles,
} from "lucide-react";

/* ─── Palette ────────────────────────────────────────── */
const P   = "#5D3A1A";
const PB  = "#5D3A1A";
const PL  = "#F5F0E6";
const PBD = "#E5DDD0";
const GB  = "#E5E7EB";

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
  { id:"r1", initials:"A", name:"Ayşe K.",   rating:5, color:"#5D3A1A", text:"Toy Poodle'um çok sevdi, sindirim sorunu yaşamadık. Kesinlikle tavsiye ederim!", verified:true },
  { id:"r2", initials:"M", name:"Mehmet D.", rating:5, color:"#3B82F6", text:"Tüyleri parlaklaştı, enerjisi arttı. 3 kg paket ideal boyut.", verified:true },
  { id:"r3", initials:"E", name:"Elif S.",   rating:4, color:"#EC4899", text:"Hızlı kargo, ürün taze. Tek eksik biraz pahalı ama kalitesi belli.", verified:true },
];

function fmt(n: number) { return n.toLocaleString("tr-TR"); }

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

export default function YPMamaUrunPage() {
  const [, navigate] = useLocation();

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

  const [showCityModal, setShowCityModal] = useState(false);
  const CITIES = ["İstanbul", "Ankara", "İzmir", "Samsun", "Bursa", "Antalya"];

  const pickCity = () => setShowCityModal(true);

  const IMG_COUNT = 2;

  return (
    <YPLayout activeLink="/yourpoodle/magaza" constrain={false}>
      <style>{`
        select { -webkit-appearance:none; appearance:none; }
        .acc-body { overflow:hidden; transition:max-height 0.25s ease; }
        .reviews-scroll::-webkit-scrollbar { display:none; }
        .reviews-scroll { -ms-overflow-style:none; scrollbar-width:none; }
        button { font-family:inherit; }
      `}</style>

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

      {/* ══ PRODUCT GALLERY ════════════════════════════════ */}
      <div style={{ position:"relative", background:"#F9FAFB",
                    height:280, display:"flex", alignItems:"center",
                    justifyContent:"center", overflow:"hidden" }}>
        <div style={{ fontSize:80, userSelect:"none", filter:"drop-shadow(0 8px 24px rgba(0,0,0,0.12))" }}>
          🐕
        </div>
        {/* dots */}
        <div style={{ position:"absolute", bottom:12, left:"50%",
                      transform:"translateX(-50%)", display:"flex", gap:6 }}>
          {Array.from({ length: IMG_COUNT }).map((_, i) => (
            <button key={i} onClick={() => setImgIdx(i)}
              style={{ width: i === imgIdx ? 18 : 6, height:6, borderRadius:3,
                       background: i === imgIdx ? P : "#D1D5DB",
                       border:"none", cursor:"pointer", transition:"all 0.2s", padding:0 }} />
          ))}
        </div>
        {/* action buttons */}
        <button onClick={() => setLiked(l => !l)}
          style={{ position:"absolute", top:12, right:54, width:38, height:38,
                   borderRadius:"50%", background:"rgba(255,255,255,0.9)",
                   border:"none", display:"flex", alignItems:"center",
                   justifyContent:"center", cursor:"pointer",
                   boxShadow:"0 2px 8px rgba(0,0,0,0.12)" }}>
          <Heart size={18} fill={liked?"#EF4444":"none"} color={liked?"#EF4444":"#374151"} />
        </button>
        <button onClick={share}
          style={{ position:"absolute", top:12, right:12, width:38, height:38,
                   borderRadius:"50%", background:"rgba(255,255,255,0.9)",
                   border:"none", display:"flex", alignItems:"center",
                   justifyContent:"center", cursor:"pointer",
                   boxShadow:"0 2px 8px rgba(0,0,0,0.12)" }}>
          <Share2 size={18} color="#374151" />
        </button>
      </div>

      {/* ══ PRODUCT INFO ═══════════════════════════════════ */}
      <div style={{ background:"#fff", padding:"16px 16px 12px" }}>
        {/* Brand + Tags */}
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
          <span style={{ fontSize:11, fontWeight:800, color:"#003087",
                         textTransform:"uppercase", letterSpacing:"0.5px" }}>
            PRO PLAN
          </span>
          {FEATURE_TAGS.map(t => (
            <span key={t} style={{ fontSize:10, fontWeight:600, color:PB,
                                   background:PL, borderRadius:999,
                                   padding:"2px 8px" }}>{t}</span>
          ))}
        </div>

        {/* Name */}
        <h1 style={{ fontSize:17, fontWeight:700, color:"#111827",
                     lineHeight:1.35, marginBottom:10 }}>
          Pro Plan Small Adult Sensitive Somonlu Yetişkin Köpek Maması
        </h1>

        {/* Rating row */}
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
          <Stars rating={4.7} />
          <span style={{ fontSize:13, fontWeight:600, color:"#374151" }}>4.7</span>
          <button onClick={() => reviewsRef.current?.scrollIntoView({ behavior:"smooth" })}
            style={{ fontSize:12, color:PB, background:"none", border:"none",
                     cursor:"pointer", fontFamily:"inherit", padding:0 }}>
            (248 yorum)
          </button>
          <span style={{ fontSize:11, background:"#F0FDF4", color:"#16A34A",
                         border:"1px solid #BBF7D0", borderRadius:999,
                         padding:"2px 8px", fontWeight:600 }}>
            Çok Satan
          </span>
        </div>

        {/* Price */}
        <div style={{ display:"flex", alignItems:"baseline", gap:10, marginBottom:4 }}>
          <span style={{ fontSize:26, fontWeight:800, color:P }}>{fmt(pkg.price)} TL</span>
          <span style={{ fontSize:14, color:"#9CA3AF", textDecoration:"line-through" }}>
            {fmt(pkg.originalPrice)} TL
          </span>
          <span style={{ fontSize:13, fontWeight:700, color:"#16A34A" }}>
            %{Math.round((savings / pkg.originalPrice) * 100)} İndirim
          </span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6,
                      background:PL, borderRadius:10, padding:"8px 12px",
                      marginBottom:12 }}>
          <CreditCard size={15} color={P} style={{ flexShrink:0 }} />
          <span style={{ fontSize:13, fontWeight:600, color:P }}>
            Peşin fiyatına 3 taksit: {installAmt} TL
          </span>
        </div>

        {/* Why features */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr",
                      gap:8, marginBottom:14 }}>
          {WHY_FEATURES.map(f => (
            <div key={f.label}
              style={{ display:"flex", alignItems:"center", gap:8,
                       background:"#F9FAFB", borderRadius:10, padding:"8px 10px" }}>
              <f.icon size={16} color={P} style={{ flexShrink:0 }} />
              <span style={{ fontSize:12, fontWeight:500, color:"#374151", lineHeight:1.3 }}>
                {f.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ══ PACKAGE SELECTOR ══════════════════════════════ */}
      <div style={{ background:"#fff", padding:"16px", marginTop:8 }}>
        <p style={{ fontSize:14, fontWeight:700, color:"#111827", marginBottom:10 }}>
          Paket Seçin
        </p>
        <div style={{ display:"flex", gap:8 }}>
          {PACKAGES.map(p => (
            <button key={p.id} onClick={() => setPkgId(p.id)}
              style={{ flex:1, display:"flex", flexDirection:"column",
                       alignItems:"center", gap:4,
                       padding:"10px 6px", borderRadius:12,
                       border:`2px solid ${pkgId === p.id ? P : GB}`,
                       background: pkgId === p.id ? PL : "#fff",
                       cursor:"pointer", fontFamily:"inherit",
                       transition:"all 0.15s" }}>
              <span style={{ fontSize:13, fontWeight:700,
                             color: pkgId === p.id ? P : "#374151" }}>
                {p.weight}
              </span>
              <span style={{ fontSize:12, fontWeight:600,
                             color: pkgId === p.id ? P : "#6B7280" }}>
                {p.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ══ QUANTITY + BARCODE ════════════════════════════ */}
      <div style={{ background:"#fff", padding:"12px 16px 16px",
                    display:"flex", alignItems:"center", justifyContent:"space-between",
                    marginTop:1 }}>
        <div style={{ display:"flex", alignItems:"center", gap:0 }}>
          <button onClick={() => setQty(q => Math.max(1, q - 1))}
            style={{ width:36, height:36, borderRadius:"8px 0 0 8px",
                     border:`1px solid ${GB}`, background:"#F9FAFB",
                     display:"flex", alignItems:"center", justifyContent:"center",
                     cursor:"pointer" }}>
            <Minus size={14} color="#374151" />
          </button>
          <div style={{ width:48, height:36, border:`1px solid ${GB}`,
                        borderLeft:"none", borderRight:"none",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:15, fontWeight:700, color:"#111827" }}>
            {qty}
          </div>
          <button onClick={() => setQty(q => q + 1)}
            style={{ width:36, height:36, borderRadius:"0 8px 8px 0",
                     border:`1px solid ${GB}`, background:"#F9FAFB",
                     display:"flex", alignItems:"center", justifyContent:"center",
                     cursor:"pointer" }}>
            <Plus size={14} color="#374151" />
          </button>
        </div>
        <div style={{ fontSize:11, color:"#9CA3AF" }}>
          Barkod: {pkg.barcode}
        </div>
      </div>

      {/* ══ DELIVERY INFO ═════════════════════════════════ */}
      <div style={{ background:"#fff", padding:"16px", marginTop:8 }}>
        <p style={{ fontSize:14, fontWeight:700, color:"#111827", marginBottom:10 }}>
          Teslimat Bilgileri
        </p>
        {[
          { icon:Truck,    label:"Standart Kargo — Ücretsiz", sub:"Tahmini: 2–3 gün" },
          { icon:Package,  label:"Ekspres Teslimat — 49 TL",  sub:"Yarın kapınızda" },
          { icon:RotateCcw,label:"14 Gün Ücretsiz İade",      sub:"Koşulsuz iade garantisi" },
        ].map(d => (
          <div key={d.label} style={{ display:"flex", alignItems:"center", gap:10,
                                      marginBottom:10 }}>
            <d.icon size={18} color={P} style={{ flexShrink:0 }} />
            <div>
              <p style={{ fontSize:13, fontWeight:600, color:"#111827" }}>{d.label}</p>
              <p style={{ fontSize:11, color:"#9CA3AF" }}>{d.sub}</p>
            </div>
          </div>
        ))}
        <button onClick={pickCity}
          style={{ display:"flex", alignItems:"center", gap:6,
                   background:"none", border:"none", cursor:"pointer",
                   fontSize:13, color:PB, fontFamily:"inherit", padding:0 }}>
          <MapPin size={14} />
          {city ? `${city} için teslimat süresi görüntüle` : "Şehrinizi seçin"}
          <ChevronRight size={14} />
        </button>
      </div>

      {/* ══ FOOD CALCULATOR ═══════════════════════════════ */}
      <div style={{ background:"#fff", padding:"16px", marginTop:8 }}>
        <p style={{ fontSize:14, fontWeight:700, color:"#111827", marginBottom:4 }}>
          Mama Hesaplayıcı
        </p>
        <p style={{ fontSize:12, color:"#9CA3AF", marginBottom:12 }}>
          Köpeğinizin kilosuna göre günlük mama miktarını hesaplayın.
        </p>
        <div style={{ display:"flex", gap:8, marginBottom:10 }}>
          <div style={{ flex:1 }}>
            <label style={{ fontSize:11, color:"#6B7280", fontWeight:500,
                            display:"block", marginBottom:4 }}>Kilo (kg)</label>
            <input type="number" value={calcKg}
              onChange={e => setCalcKg(e.target.value)}
              style={{ width:"100%", border:`1px solid ${GB}`, borderRadius:8,
                       padding:"8px 10px", fontSize:13, fontFamily:"inherit",
                       outline:"none", boxSizing:"border-box" }} />
          </div>
          <div style={{ flex:1 }}>
            <label style={{ fontSize:11, color:"#6B7280", fontWeight:500,
                            display:"block", marginBottom:4 }}>Aktivite</label>
            <select value={calcAct} onChange={e => setCalcAct(e.target.value)}
              style={{ width:"100%", border:`1px solid ${GB}`, borderRadius:8,
                       padding:"8px 10px", fontSize:13, fontFamily:"inherit",
                       outline:"none", background:"#fff", boxSizing:"border-box" }}>
              <option>Düşük</option>
              <option>Orta</option>
              <option>Yüksek</option>
            </select>
          </div>
        </div>
        <button onClick={calc}
          style={{ width:"100%", background:P, color:"#fff", border:"none",
                   borderRadius:10, padding:"10px 0", fontSize:13, fontWeight:600,
                   cursor:"pointer", fontFamily:"inherit" }}>
          Hesapla
        </button>
        <div style={{ marginTop:10, background:PL, borderRadius:10,
                      padding:"10px 12px", textAlign:"center" }}>
          <span style={{ fontSize:13, fontWeight:600, color:P }}>
            Önerilen günlük: {calcResult}
          </span>
        </div>
      </div>

      {/* ══ ACCORDIONS ════════════════════════════════════ */}
      <div style={{ background:"#fff", marginTop:8 }}>
        {ACCORDIONS.map((acc, i) => (
          <div key={acc.title}
            style={{ borderBottom: i < ACCORDIONS.length - 1 ? `1px solid ${GB}` : "none" }}>
            <button onClick={() => setOpenAcc(openAcc === i ? null : i)}
              style={{ width:"100%", display:"flex", alignItems:"center",
                       justifyContent:"space-between", padding:"14px 16px",
                       background:"none", border:"none", cursor:"pointer",
                       fontFamily:"inherit" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <acc.icon size={18} color={P} style={{ flexShrink:0 }} />
                <span style={{ fontSize:14, fontWeight:600, color:"#111827" }}>
                  {acc.title}
                </span>
              </div>
              {openAcc === i
                ? <ChevronUp size={18} color="#9CA3AF" />
                : <ChevronDown size={18} color="#9CA3AF" />}
            </button>
            {openAcc === i && (
              <div style={{ padding:"0 16px 16px", fontSize:13,
                            color:"#6B7280", lineHeight:1.7 }}>
                {acc.content}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ══ REVIEWS ══════════════════════════════════════ */}
      <div ref={reviewsRef}
        style={{ background:"#fff", padding:"16px", marginTop:8, marginBottom:100 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                      marginBottom:14 }}>
          <p style={{ fontSize:14, fontWeight:700, color:"#111827" }}>
            Müşteri Yorumları
          </p>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <Stars rating={4.7} />
            <span style={{ fontSize:13, fontWeight:700, color:"#111827" }}>4.7</span>
          </div>
        </div>

        <div className="reviews-scroll"
          style={{ display:"flex", gap:12, overflowX:"auto",
                   paddingBottom:4, cursor:"grab" }}>
          {REVIEWS.map(r => (
            <div key={r.id}
              style={{ minWidth:240, background:"#F9FAFB", borderRadius:14,
                       padding:16, flexShrink:0 }}>
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
              <p style={{ fontSize:12, color:"#4B5563", lineHeight:1.6, marginTop:10 }}>
                {r.text}
              </p>
              {r.verified && (
                <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:10 }}>
                  <BadgeCheck size={12} color="#16A34A" />
                  <span style={{ fontSize:10, color:"#16A34A" }}>Doğrulanmış Alışveriş</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <button onClick={() => reviewsRef.current?.scrollIntoView({ behavior:"smooth" })}
          style={{ width:"100%", marginTop:16, background:"#fff",
                   border:`2px solid ${P}`, color:P, borderRadius:12,
                   padding:"13px 0", fontSize:13, fontWeight:700,
                   cursor:"pointer", fontFamily:"inherit" }}>
          Tüm Yorumları Gör
        </button>
      </div>

      {/* ══ STICKY BOTTOM BAR ════════════════════════════ */}
      <div style={{ position:"fixed", bottom:72, left:0, right:0, zIndex:50,
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
      {/* City selection modal */}
      {showCityModal && (
        <div style={{ position:"fixed",inset:0,zIndex:300,display:"flex",alignItems:"flex-end",
                      justifyContent:"center",background:"rgba(0,0,0,0.5)" }}
          onClick={()=>setShowCityModal(false)}>
          <div style={{ maxWidth:480,width:"100%",background:"#fff",borderRadius:"20px 20px 0 0",
                        padding:"24px 20px 40px" }}
            onClick={e=>e.stopPropagation()}>
            <p style={{ fontSize:16,fontWeight:700,color:"#111827",marginBottom:16 }}>Şehir Seçin</p>
            {CITIES.map(c=>(
              <button key={c} onClick={()=>{setCity(c);setShowCityModal(false);}}
                style={{ width:"100%",background:city===c?"#F5F0E6":"#F9FAFB",
                         border:`1.5px solid ${city===c?P:"transparent"}`,
                         borderRadius:12,padding:"13px 16px",textAlign:"left",
                         fontSize:14,fontWeight:city===c?700:500,
                         color:city===c?P:"#374151",cursor:"pointer",
                         marginBottom:8,fontFamily:"inherit" }}>
                {c}
              </button>
            ))}
          </div>
        </div>
      )}
    </YPLayout>
  );
}
