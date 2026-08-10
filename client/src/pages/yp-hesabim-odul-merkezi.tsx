// Route: /hesabim/poodle-puanlari/odul-merkezi
import { useState, useRef } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft, PawPrint, Clock, Search, SlidersHorizontal,
  Heart, Check, ChevronDown, ChevronUp, Rocket, Award, Crown,
  Ticket, Package, X, Scissors, ShoppingBag,
} from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";

/* ── Palette ─────────────────────────── */
const P    = "#5D3EBD";
const PD   = "#4A22A0";
const PL   = "#F5F0E6";
const NAV  = "#1D1E9B";
const DRK  = "#111827";
const GT   = "#6B7280";
const GB   = "#E5E7EB";
const GRN  = "#16A34A";
const RED  = "#DC2626";
const ORG  = "#EA580C";
const GOLD = "#F59E0B";
const GOLDB= "#FBBF24";
const BG   = "#F9F9FB";

/* ── Data ────────────────────────────── */
const BALANCE = { total: 1275, tlValue: "127,50 TL", expiringPoints: 120, expiringDate: "31 Ağustos" };

const CATS = [
  { key: "all",      label: "Tümü" },
  { key: "discount", label: "İndirim" },
  { key: "shipping", label: "Ücretsiz Kargo" },
  { key: "products", label: "Ürünler" },
  { key: "club",     label: "Club" },
  { key: "special",  label: "Özel Fırsatlar" },
];

type Cat = "all"|"discount"|"shipping"|"products"|"club"|"special";

const POPULAR = [
  { id:"pr-1", title:"50 TL İndirim",       points:500,  desc:"Min. sepet 500 TL",                   cat:"discount" as Cat, badge:"Çok Popüler", badgeStyle:"vp", icon:"coupon"   },
  { id:"pr-2", title:"Ücretsiz Kargo",      points:300,  desc:"Min. sepet 250 TL",                   cat:"shipping" as Cat, badge:"Popüler",     badgeStyle:"p",  icon:"shipping"  },
  { id:"pr-3", title:"%15 Bakım İndirimi",  points:750,  desc:"Tüm bakım ürünlerinde",               cat:"discount" as Cat, badge:"Sınırlı Süre",badgeStyle:"lt", icon:"care"      },
  { id:"pr-4", title:"100 TL Mama İndirimi",points:1000, desc:"750 TL üzeri mama alışverişinde",     cat:"discount" as Cat, badge:"Stoklar Sınırlı",badgeStyle:"sk",icon:"food"   },
];

const PRODUCTS = [
  { id:"pp-1", name:"Buharlı Masaj Tarağı",    points:1200, origPrice:"399 TL",  stockLeft:8,  cat:"products" as Cat, img:"https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200&h=200&fit=crop" },
  { id:"pp-2", name:"Göz Yaşı Bakım Losyonu",  points:900,  origPrice:"289 TL",  stockLeft:0,  cat:"products" as Cat, img:"https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop" },
  { id:"pp-3", name:"İsimli Mor Tasma",         points:1100, origPrice:"349 TL",  stockLeft:0,  cat:"products" as Cat, img:"https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=200&h=200&fit=crop" },
  { id:"pp-4", name:"Toy Poodle Ödül Paketi",   points:2400, origPrice:"799 TL",  stockLeft:3,  cat:"products" as Cat, img:"https://images.unsplash.com/photo-1581888227599-779811939961?w=200&h=200&fit=crop" },
];

const CLUBS = [
  { id:"cp-1", title:"Gönderini 24 Saat Öne Çıkar", points:200,  icon:"rocket",  disabled:false, missing:0 },
  { id:"cp-2", title:"Özel Profil Rozeti",            points:400,  icon:"badge",   disabled:false, missing:0 },
  { id:"cp-3", title:"Club Premium 1 Ay",             points:1500, icon:"crown",   disabled:true,  missing:225 },
];

const EARNED = [
  { id:"er-1", title:"Ücretsiz Kargo", status:"available", label:"Kullanılabilir", date:"12 Ağustos'a kadar geçerli" },
  { id:"er-2", title:"25 TL İndirim",  status:"used",      label:"Kullanıldı",     date:"15 Temmuz 2026" },
];

const FAQ = [
  { id:"faq-1", q:"Ödüller nasıl kullanılır?",  a:"Ödülü seçip 'Ödülü Al' butonuna basın. İndirim kuponları sepetinizde otomatik uygulanır." },
  { id:"faq-2", q:"Puan ve ödül koşulları",      a:"Her ödülün minimum sepet tutarı ve geçerlilik süresi vardır. Detaylar ödül kartında belirtilir." },
  { id:"faq-3", q:"İptal ve iade",               a:"Kullanılmamış kuponlar 30 gün içinde iade edilebilir. Kullanılan puanlar geri yüklenmez." },
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
      <button onClick={onClose} style={{ background:"none", border:"none", color:"#9CA3AF", cursor:"pointer", padding:0 }}><X size={14}/></button>
    </div>
  );
}

/* ── Popular card icon visuals ───────── */
function RewardIcon({ icon, size=44 }: { icon:string; size?:number }) {
  if (icon === "coupon") return (
    <div style={{ width:size*1.6, height:size*1.1, background:`linear-gradient(135deg,${P},${PD})`,
                  borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center",
                  flexDirection:"column", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", left:-8, top:"50%", transform:"translateY(-50%)",
                    width:16, height:16, borderRadius:999, background:"#F9FAFB" }} />
      <div style={{ position:"absolute", right:-8, top:"50%", transform:"translateY(-50%)",
                    width:16, height:16, borderRadius:999, background:"#F9FAFB" }} />
      <span style={{ fontSize:18, fontWeight:900, color:GOLDB, lineHeight:1 }}>50 TL</span>
      <span style={{ fontSize:8, fontWeight:700, color:"rgba(255,255,255,.85)", letterSpacing:1 }}>İNDİRİM</span>
    </div>
  );
  if (icon === "shipping") return (
    <div style={{ width:size, height:size, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=120&h=120&fit=crop"
           alt="" style={{ width:"100%", height:"100%", objectFit:"contain", borderRadius:8 }}
           onError={e => { (e.target as HTMLImageElement).style.display="none" }} />
      <Package size={32} color={P} style={{ display:"none" }} />
    </div>
  );
  if (icon === "care") return (
    <div style={{ width:size, height:size, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <img src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=120&h=120&fit=crop"
           alt="" style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:8 }}
           onError={e => { (e.target as HTMLImageElement).style.display="none" }} />
    </div>
  );
  if (icon === "food") return (
    <div style={{ width:size, height:size, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <img src="https://images.unsplash.com/photo-1589924691995-400dc9e7c8db?w=120&h=120&fit=crop"
           alt="" style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:8 }}
           onError={e => { (e.target as HTMLImageElement).style.display="none" }} />
    </div>
  );
  return <div style={{ width:size, height:size, background:PL, borderRadius:8 }} />;
}

/* ── Main Page ───────────────────────── */
export default function YPOdulMerkeziPage() {
  const [, navigate] = useLocation();
  const [balance, setBalance] = useState(BALANCE.total);
  const [activeCat, setActiveCat] = useState<Cat>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(POPULAR[0]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [expandedFaq, setExpandedFaq] = useState<string|null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [toast, setToast] = useState<string|null>(null);
  const [earned, setEarned] = useState(EARNED);
  const popularRef = useRef<HTMLDivElement>(null);

  const showToast = (msg:string) => { setToast(msg); setTimeout(()=>setToast(null), 3000); };

  const filteredPopular = POPULAR.filter(r => {
    const matchCat = activeCat === "all" || r.cat === activeCat;
    const matchQ   = r.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQ;
  });

  const filteredProducts = PRODUCTS.filter(p => {
    const matchCat = activeCat === "all" || p.cat === activeCat;
    const matchQ   = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQ;
  });

  const remaining = balance - (selected?.points || 0);
  const canRedeem = balance >= (selected?.points || 0);

  function redeemSelected() {
    if (!canRedeem) return;
    navigate(`/hesabim/poodle-puanlari/odul-onayla/${selected.id}`);
  }

  function buyWithPoints(id: string) {
    const p = PRODUCTS.find(x=>x.id===id);
    if (!p) return;
    if (balance < p.points) { showToast("Yeterli puanınız yok"); return; }
    setBalance(b => b - p.points);
    showToast(`${p.name} siparişiniz oluşturuldu ✓`);
  }

  function redeemPrivilege(id:string) {
    const c = CLUBS.find(x=>x.id===id);
    if (!c || c.disabled) return;
    if (balance < c.points) { showToast("Yeterli puanınız yok"); return; }
    setBalance(b => b - c.points);
    showToast(`${c.title} tanımlandı ✓`);
  }

  const badgeColors: Record<string,{bg:string;color:string}> = {
    vp: { bg:PL, color:P }, p: { bg:PL, color:P },
    lt: { bg:"#FEF2F2", color:RED }, sk: { bg:"#FDF2F8", color:"#EC4899" },
  };

  return (
    <YPLayout activeLink="club" constrain={false}>
      {toast && <Toast msg={toast} onClose={()=>setToast(null)} />}
      {filterOpen && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:9998, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
          <div style={{ background:"#fff", borderRadius:"20px 20px 0 0", padding:"24px 20px 40px", width:"100%", maxWidth: "var(--yp-shell-max)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <span style={{ fontSize:16, fontWeight:700, color:DRK }}>Filtrele</span>
              <button onClick={()=>setFilterOpen(false)} style={{ background:"none", border:"none", cursor:"pointer" }}><X size={20} color={GT}/></button>
            </div>
            <p style={{ fontSize:13, color:GT, marginBottom:20 }}>Kategori filtreleme için üstteki chip'leri kullanabilirsiniz.</p>
            <button onClick={()=>setFilterOpen(false)} style={{ width:"100%", background:P, color:"#fff", border:"none", borderRadius:12, padding:"14px 0", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
              Uygula
            </button>
          </div>
        </div>
      )}

      <div className="yp-acct" style={{ margin:"0 auto", background:BG, minHeight:"100vh", paddingBottom:96, fontFamily:"Inter,sans-serif" }}>

        {/* ── BREADCRUMB + TITLE ── */}
        <div style={{ padding:"12px 16px 10px" }}>
          <button onClick={()=>navigate("/hesabim/poodle-puanlari")}
            style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:6, padding:0, marginBottom:8 }}>
            <ArrowLeft size={15} color={P} />
            <span style={{ fontSize:11, color:P, fontWeight:500 }}>Hesabım / PoodlePuanlarım / Ödül Merkezi</span>
          </button>
          <h1 style={{ fontSize:20, fontWeight:800, color:DRK, margin:"0 0 3px" }}>PoodlePuan Ödül Merkezi</h1>
          <p style={{ fontSize:12, color:GT, margin:0 }}>Puanlarını sana özel indirimlere, ürünlere ve ayrıcalıklara dönüştür.</p>
        </div>

        {/* ── BALANCE HERO CARD ── */}
        <div style={{ margin:"0 16px 14px", borderRadius:20, background:`linear-gradient(135deg,${P},${PD})`,
                      padding:"14px 14px", display:"flex", alignItems:"center", gap:12 }}>
          {/* Gold coin */}
          <div style={{ width:52, height:52, borderRadius:999, flexShrink:0,
                        background:`radial-gradient(circle at 35% 35%, ${GOLDB}, #D97706)`,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        boxShadow:"0 2px 8px rgba(0,0,0,.25)" }}>
            <PawPrint size={24} color="#fff" strokeWidth={2.2} />
          </div>
          {/* Text */}
          <div style={{ flex:1 }}>
            <div style={{ fontSize:10, color:"rgba(255,255,255,.75)", marginBottom:2 }}>Kullanılabilir Puan</div>
            <div style={{ fontSize:20, fontWeight:800, color:"#fff", lineHeight:1 }}>
              {balance.toLocaleString("tr-TR")} <span style={{ fontSize:12, fontWeight:600 }}>PoodlePuan</span>
            </div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,.85)", marginTop:2 }}>{BALANCE.tlValue}</div>
            <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:4 }}>
              <Clock size={10} color="rgba(255,255,255,.6)" />
              <span style={{ fontSize:10, color:"rgba(255,255,255,.65)" }}>
                {BALANCE.expiringPoints} puan {BALANCE.expiringDate}'ta sona erecek
              </span>
            </div>
          </div>
          {/* Button */}
          <button onClick={()=>navigate("/hesabim/poodle-puanlari")}
            style={{ border:"1.5px solid rgba(255,255,255,.55)", background:"none", color:"#fff",
                     borderRadius:10, padding:"9px 10px", fontSize:10, fontWeight:700,
                     cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap", flexShrink:0 }}>
            Puan Geçmişi
          </button>
        </div>

        {/* ── SEARCH + FILTRELE ── */}
        <div style={{ padding:"0 16px 10px", display:"flex", gap:8 }}>
          <div style={{ flex:1, position:"relative" }}>
            <Search size={14} color={GT} style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)" }} />
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Ödül veya ürün ara..."
              style={{ width:"100%", paddingLeft:32, paddingRight:12, paddingTop:10, paddingBottom:10,
                       borderRadius:12, border:`1.5px solid ${GB}`, background:"#fff",
                       fontSize:12, color:DRK, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }} />
          </div>
          <button onClick={()=>setFilterOpen(true)}
            style={{ border:`1.5px solid ${GB}`, background:"#fff", borderRadius:12,
                     padding:"10px 12px", display:"flex", alignItems:"center", gap:5,
                     fontSize:12, color:DRK, cursor:"pointer", fontFamily:"inherit", flexShrink:0 }}>
            <SlidersHorizontal size={13} color={GT} />
            Filtrele
          </button>
        </div>

        {/* ── CATEGORY CHIPS ── */}
        <div style={{ display:"flex", gap:8, overflowX:"auto", padding:"0 16px 12px",
                      scrollbarWidth:"none", msOverflowStyle:"none" }}>
          {CATS.map(c => (
            <button key={c.key} onClick={()=>setActiveCat(c.key as Cat)}
              style={{ flexShrink:0, padding:"7px 14px", borderRadius:999, fontSize:12, fontWeight:600,
                       cursor:"pointer", fontFamily:"inherit", border:"none",
                       background: activeCat===c.key ? P : "#fff",
                       color: activeCat===c.key ? "#fff" : GT,
                       boxShadow: activeCat===c.key ? "none" : `0 0 0 1.5px ${GB}` }}>
              {c.label}
            </button>
          ))}
        </div>

        {/* ── HAFTANIN POODLE ÖDÜLÜ ── */}
        <div style={{ margin:"0 16px 14px", background:PL, borderRadius:20, padding:14,
                      display:"flex", alignItems:"center", gap:12 }}>
          <img src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=160&h=130&fit=crop"
               alt="Poodle ödül"
               style={{ width:72, height:60, objectFit:"cover", borderRadius:12, flexShrink:0 }}
               onError={e => {
                 const el = e.target as HTMLImageElement;
                 el.style.background=PL;
                 el.src="";
                 el.style.display="flex";
               }} />
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:800, color:DRK, marginBottom:2 }}>Haftanın Poodle Ödülü</div>
            <div style={{ fontSize:11, color:GT, marginBottom:4 }}>750 puanla %20 bakım indirimi</div>
            <div style={{ display:"flex", alignItems:"center", gap:4 }}>
              <Clock size={12} color={P} />
              <span style={{ fontSize:10, color:P, fontWeight:700 }}>2 gün 14 saat kaldı</span>
            </div>
          </div>
          <button onClick={()=>{ const r=POPULAR[2]; setSelected(r); }}
            style={{ background:P, color:"#fff", border:"none", borderRadius:12,
                     padding:"9px 12px", fontSize:10, fontWeight:700, cursor:"pointer",
                     fontFamily:"inherit", whiteSpace:"nowrap", flexShrink:0 }}>
            Ödülü İncele
          </button>
        </div>

        {/* ── EN POPÜLER ÖDÜLLER ── */}
        <div ref={popularRef} style={{ padding:"0 16px 14px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <span style={{ fontSize:13, fontWeight:800, color:DRK }}>En Popüler Ödüller</span>
            <button style={{ background:"none", border:"none", color:P, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
              Tümünü Gör &gt;
            </button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {(filteredPopular.length > 0 ? filteredPopular : POPULAR).map(r => {
              const bc = badgeColors[r.badgeStyle] || badgeColors.p;
              const isSel = selected?.id === r.id;
              const isFav = favorites.has(r.id);
              return (
                <div key={r.id} style={{ background:"#fff", borderRadius:18,
                                          border:`1.5px solid ${isSel ? P : "#F3F4F6"}`,
                                          boxShadow:"0 1px 5px rgba(0,0,0,.06)",
                                          overflow:"hidden", display:"flex", flexDirection:"column" }}>
                  {/* Visual */}
                  <div style={{ height:80, background:"#F9FAFB", display:"flex", alignItems:"center",
                                justifyContent:"center", position:"relative" }}>
                    <RewardIcon icon={r.icon} size={48} />
                    {/* Heart */}
                    <button onClick={e=>{ e.stopPropagation(); setFavorites(f=>{ const n=new Set(f); isFav?n.delete(r.id):n.add(r.id); return n; }); }}
                      style={{ position:"absolute", top:7, right:8, background:"none", border:"none", cursor:"pointer", padding:0 }}>
                      <Heart size={16} color={isFav ? RED : "#D1D5DB"} fill={isFav ? RED : "none"} />
                    </button>
                    {/* Badge */}
                    <div style={{ position:"absolute", top:7, left:7, background:bc.bg, color:bc.color,
                                  fontSize:9, fontWeight:700, padding:"2px 6px", borderRadius:6 }}>
                      {r.badge}
                    </div>
                  </div>
                  {/* Content */}
                  <div style={{ padding:"10px 10px 10px", flex:1, display:"flex", flexDirection:"column", gap:2 }}>
                    <div style={{ fontSize:12, fontWeight:800, color:DRK }}>{r.title}</div>
                    <div style={{ fontSize:11, fontWeight:700, color:P }}>{r.points.toLocaleString("tr-TR")} Puan</div>
                    <div style={{ fontSize:10, color:GT, flex:1 }}>{r.desc}</div>
                    <button onClick={()=>setSelected(r)}
                      style={{ marginTop:8, width:"100%", border:`2px solid ${P}`, color:P,
                               background: isSel ? PL : "none",
                               borderRadius:10, padding:"7px 0", fontSize:10, fontWeight:700,
                               cursor:"pointer", fontFamily:"inherit" }}>
                      Seç
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── PUANLA ÜRÜN AL ── */}
        <div style={{ padding:"0 0 14px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"0 16px", marginBottom:10 }}>
            <span style={{ fontSize:13, fontWeight:800, color:DRK }}>Puanla Ürün Al</span>
            <button style={{ background:"none", border:"none", color:P, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
              Tümünü Gör &gt;
            </button>
          </div>
          <div style={{ display:"flex", gap:10, overflowX:"auto", padding:"0 16px 4px",
                        scrollbarWidth:"none", msOverflowStyle:"none" }}>
            {(activeCat==="all"||activeCat==="products" ? filteredProducts.length?filteredProducts:PRODUCTS : PRODUCTS.filter(p=>activeCat===p.cat)).map(p => {
              const canBuy = balance >= p.points;
              return (
                <div key={p.id} style={{ minWidth:135, background:"#fff", borderRadius:18,
                                          border:"1.5px solid #F3F4F6", boxShadow:"0 1px 5px rgba(0,0,0,.06)",
                                          padding:10, display:"flex", flexDirection:"column", flexShrink:0 }}>
                  <div style={{ position:"relative", marginBottom:8 }}>
                    <img src={p.img} alt={p.name}
                         style={{ width:"100%", aspectRatio:"1/1", objectFit:"cover", borderRadius:12, display:"block" }}
                         onError={e=>{ (e.target as HTMLImageElement).style.background="#F5F0E6"; }} />
                    {p.stockLeft > 0 && (
                      <div style={{ position:"absolute", top:6, right:6, background:"#FDF2F8", color:"#EC4899",
                                    fontSize:9, fontWeight:700, padding:"2px 6px", borderRadius:6 }}>
                        Son {p.stockLeft}
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize:11, fontWeight:700, color:DRK, lineHeight:1.35, marginBottom:4, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{p.name}</div>
                  <div style={{ fontSize:13, fontWeight:800, color:P }}>{p.points.toLocaleString("tr-TR")} Puan</div>
                  <div style={{ fontSize:10, color:"#9CA3AF", textDecoration:"line-through", marginBottom:2 }}>{p.origPrice}</div>
                  <div style={{ fontSize:9, color:GRN, marginBottom:8, display:"flex", alignItems:"center", gap:3 }}>
                    <ShoppingBag size={9} color={GRN} /> Kargo ücretsiz
                  </div>
                  <button onClick={()=>buyWithPoints(p.id)} disabled={!canBuy}
                    style={{ width:"100%", background: canBuy ? P : "#E5E7EB", color: canBuy ? "#fff" : "#9CA3AF",
                             border:"none", borderRadius:10, padding:"9px 0", fontSize:10, fontWeight:700,
                             cursor: canBuy ? "pointer" : "not-allowed", fontFamily:"inherit" }}>
                    Puanla Al
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── CLUB AYRICALIKLARI ── */}
        <div style={{ padding:"0 16px 14px" }}>
          <div style={{ fontSize:13, fontWeight:800, color:DRK, marginBottom:10 }}>Club Ayrıcalıkları</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
            {CLUBS.map(c => (
              <div key={c.id}
                onClick={()=>redeemPrivilege(c.id)}
                style={{ background:"#fff", borderRadius:16, border:`1.5px solid ${GB}`,
                          padding:"12px 8px", textAlign:"center", display:"flex", flexDirection:"column",
                          alignItems:"center", gap:4, opacity: c.disabled ? 0.65 : 1,
                          cursor: c.disabled ? "not-allowed" : "pointer",
                          boxShadow:"0 1px 4px rgba(0,0,0,.05)" }}>
                <div style={{ width:40, height:40, borderRadius:12, background:PL,
                              display:"flex", alignItems:"center", justifyContent:"center", marginBottom:2 }}>
                  {c.icon==="rocket" && <Rocket size={20} color={P} />}
                  {c.icon==="badge"  && <Award  size={20} color={P} />}
                  {c.icon==="crown"  && <Crown  size={20} color={P} />}
                </div>
                <div style={{ fontSize:10, fontWeight:700, color:DRK, lineHeight:1.3 }}>{c.title}</div>
                <div style={{ fontSize:10, fontWeight:800, color:P }}>{c.points.toLocaleString("tr-TR")} Puan</div>
                {c.disabled ? (
                  <>
                    <div style={{ fontSize:9, color:RED, fontWeight:700, marginTop:2 }}>
                      {c.missing} puan eksik
                    </div>
                    <div style={{ width:"100%", background:"#E5E7EB", borderRadius:999, height:4, marginTop:2 }}>
                      <div style={{ width:`${(BALANCE.total/c.points)*100}%`, background:P, borderRadius:999, height:"100%" }} />
                    </div>
                  </>
                ) : (
                  <button onClick={e=>{ e.stopPropagation(); redeemPrivilege(c.id); }}
                    style={{ marginTop:4, width:"100%", background:P, color:"#fff", border:"none",
                             borderRadius:8, padding:"6px 0", fontSize:10, fontWeight:700,
                             cursor:"pointer", fontFamily:"inherit" }}>
                    Kullan
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── REDEMPTION BAR ── */}
        {selected && (
          <div style={{ margin:"0 16px 14px", background:"#fff", borderRadius:20,
                        border:`2px solid ${P}`, padding:14, boxShadow:"0 2px 12px rgba(93,62,189,.15)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
              {/* Coupon icon */}
              <div style={{ width:48, height:48, borderRadius:14, background:PL,
                            display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                {selected.icon === "coupon"   && <Ticket  size={24} color={P} />}
                {selected.icon === "shipping" && <Package size={24} color={P} />}
                {selected.icon === "care"     && <Scissors size={24} color={P} />}
                {selected.icon === "food"     && <ShoppingBag size={24} color={P} />}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:800, color:DRK, marginBottom:2 }}>{selected.title}</div>
                <div style={{ fontSize:11, color:GT }}>{selected.points.toLocaleString("tr-TR")} PoodlePuan kullanılacak</div>
                <div style={{ fontSize:11, fontWeight:700, color:P }}>Kalan puan: {remaining.toLocaleString("tr-TR")}</div>
              </div>
              <button onClick={redeemSelected} disabled={!canRedeem}
                style={{ background: canRedeem ? P : "#E5E7EB", color: canRedeem ? "#fff" : "#9CA3AF",
                         border:"none", borderRadius:12, padding:"12px 14px",
                         fontSize:13, fontWeight:700, cursor: canRedeem ? "pointer" : "not-allowed",
                         fontFamily:"inherit", flexShrink:0 }}>
                Ödülü Al
              </button>
            </div>
            <div style={{ fontSize:10, color:"#9CA3AF", textAlign:"center" }}>
              Sepette kullanabileceğiniz kupon olarak tanımlanır.
            </div>
          </div>
        )}

        {/* ── KAZANDIĞIM ÖDÜLLER ── */}
        <div style={{ padding:"0 16px 14px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <span style={{ fontSize:13, fontWeight:800, color:DRK }}>Kazandığım Ödüller</span>
            <button style={{ background:"none", border:"none", color:P, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
              Tümünü Gör &gt;
            </button>
          </div>
          <div style={{ background:"#fff", borderRadius:18, border:`1.5px solid ${GB}`,
                        boxShadow:"0 1px 4px rgba(0,0,0,.04)", overflow:"hidden" }}>
            {earned.map((e,i) => (
              <div key={e.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 14px",
                                        borderBottom: i<earned.length-1 ? `1px solid #F9FAFB` : "none" }}>
                <div style={{ width:32, height:32, borderRadius:999, flexShrink:0,
                              background: e.status==="available" ? "#F0FDF4" : "#F3F4F6",
                              display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Check size={14} color={e.status==="available" ? GRN : "#9CA3AF"} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:DRK }}>{e.title}</div>
                  <div style={{ fontSize:11, color: e.status==="available" ? GRN : GT, fontWeight:600 }}>{e.label}</div>
                  <div style={{ fontSize:10, color:"#9CA3AF", marginTop:1 }}>{e.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FAQ ── */}
        <div style={{ padding:"0 16px 14px" }}>
          <div style={{ background:"#fff", borderRadius:18, border:`1.5px solid ${GB}`,
                        overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
            {FAQ.map((f, i) => {
              const open = expandedFaq === f.id;
              return (
                <div key={f.id} style={{ borderBottom: i<FAQ.length-1 ? `1px solid #F9FAFB` : "none" }}>
                  <button onClick={()=>setExpandedFaq(open ? null : f.id)}
                    style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center",
                             padding:"14px 16px", background:"none", border:"none", cursor:"pointer",
                             textAlign:"left", fontFamily:"inherit" }}>
                    <span style={{ fontSize:13, fontWeight:700, color:DRK }}>{f.q}</span>
                    {open ? <ChevronUp size={16} color={GT}/> : <ChevronDown size={16} color={GT}/>}
                  </button>
                  {open && (
                    <div style={{ padding:"0 16px 14px", fontSize:12, color:GT, lineHeight:1.6 }}>{f.a}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div style={{ background:P, padding:"24px 20px 32px", marginTop:4 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
            <div style={{ width:30, height:30, borderRadius:999, background:"rgba(255,255,255,.2)",
                          display:"flex", alignItems:"center", justifyContent:"center" }}>
              <PawPrint size={16} color="#fff" />
            </div>
            <span style={{ fontSize:16, fontWeight:800, color:"#fff" }}>YourPoodle</span>
          </div>
          <div style={{ display:"flex", gap:16, marginBottom:12 }}>
            {["Yardım","İletişim","KVKK"].map((l,i,arr) => (
              <span key={l} style={{ fontSize:11, color:"rgba(255,255,255,.8)", display:"flex", alignItems:"center", gap:16 }}>
                {l}{i<arr.length-1 && <span style={{ marginLeft:16, color:"rgba(255,255,255,.4)" }}>|</span>}
              </span>
            ))}
          </div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,.5)" }}>© 2026 YourPoodle</div>
        </div>
      </div>

      {/* ── STICKY EXPIRY BAR ── */}
      <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:4000,
                    display:"flex", justifyContent:"center", pointerEvents:"none" }}>
        <div style={{ maxWidth: "var(--yp-shell-max)", width:"100%", pointerEvents:"all" }}>
          <div style={{ background:"#FFF7ED", borderTop:"1px solid #FED7AA",
                        borderRadius:"20px 20px 0 0", padding:"12px 16px",
                        display:"flex", alignItems:"center", gap:10 }}>
            <Clock size={16} color={ORG} style={{ flexShrink:0 }} />
            <span style={{ fontSize:11, color:"#1F2937", flex:1, lineHeight:1.45 }}>
              120 puanın sona ermek üzere. 31 Ağustos'tan önce kullanmayı unutma.
            </span>
            <button onClick={()=>popularRef.current?.scrollIntoView({ behavior:"smooth" })}
              style={{ border:`1.5px solid ${ORG}`, color:ORG, background:"none", borderRadius:10,
                       padding:"6px 10px", fontSize:10, fontWeight:700, cursor:"pointer",
                       fontFamily:"inherit", flexShrink:0, whiteSpace:"nowrap" }}>
              Önerileri Gör
            </button>
          </div>
        </div>
      </div>
    </YPLayout>
  );
}
