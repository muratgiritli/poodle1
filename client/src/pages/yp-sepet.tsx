import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  ChevronLeft, CheckCircle, X, Trash2, Heart,
  CreditCard, Truck, MapPin, ChevronRight, Tag,
  Lock, ShieldCheck, Plus, Minus, ShoppingCart,
} from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { useCustomer } from "@/contexts/CustomerContext";
import { IS_YP } from "@/lib/store";

const BASE = IS_YP ? "" : "/yourpoodle";

/* ─── Palette ──────────────────────────── */
const P   = "#4A2ED1";
const PB  = "#3B59FF";
const PL  = "#F3EEFF";
const PBD = "#DDD6FE";
const GB  = "#E5E7EB";

/* ─── Types ────────────────────────────── */
interface CartItemData {
  id: string; brand: string; name: string; weight: string;
  barcode: string; expiryDate: string;
  originalPrice: number; salePrice: number; quantity: number;
  inStock: boolean; tags: { label: string; bg: string; text: string }[];
}
interface DeliveryOption { id: string; title: string; price: number; subtitle: string; }

const DELIVERY_OPTIONS: DeliveryOption[] = [
  { id:"standard", title:"Standart Teslimat — Ücretsiz", price:0,  subtitle:"Tahmini teslimat: 25–26 Temmuz" },
  { id:"express",  title:"Hızlı Teslimat — 79 TL",       price:79, subtitle:"Yarın kapınızda" },
];

// Coupon validation is server-side via /api/coupons/validate

const RECS = [
  { id:"rec-1", name:"Buharlı Masaj Tarağı",   price:399, emoji:"🪮" },
  { id:"rec-2", name:"Göz Yaşı Bakım Losyonu", price:289, emoji:"💧" },
];

const DEFAULT_ITEM: CartItemData = {
  id:"cart-1", brand:"PRO PLAN",
  name:"Pro Plan Small Adult Sensitive Somonlu Yetişkin Köpek Maması",
  weight:"3 kg", barcode:"7613035123456", expiryDate:"18.07.2027",
  originalPrice:1599, salePrice:1349, quantity:1, inStock:true,
  tags:[
    { label:"Yetişkin +1", bg:"#FEE2E2", text:"#991B1B" },
    { label:"Sensitive",   bg:"#EDE9FE", text:"#5B21B6" },
    { label:"Somonlu",     bg:"#EDE9FE", text:"#5B21B6" },
  ],
};

function fmt(n: number) { return n.toLocaleString("tr-TR"); }


function AddressModal({ onSelect, onClose }: { onSelect:(s:string)=>void; onClose:()=>void }) {
  const [, navigate] = useLocation();
  const [sel, setSel] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/customer/addresses")
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => { setAddresses(data); if (data.length > 0) setSel(String(data[0].id)); })
      .catch(() => setAddresses([]))
      .finally(() => setLoading(false));
  }, []);

  const selected = addresses.find(a => String(a.id) === sel);

  return (
    <div style={{ position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"flex-end",
                  justifyContent:"center",background:"rgba(0,0,0,0.5)" }}
      onClick={onClose}>
      <div style={{ maxWidth:480,width:"100%",background:"#fff",borderRadius:"20px 20px 0 0",
                    padding:"24px 20px 36px" }}
        onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
          <span style={{ fontSize:16,fontWeight:700 }}>Teslimat Adresi Seçin</span>
          <button onClick={onClose} style={{ background:"none",border:"none",cursor:"pointer",display:"flex" }}>
            <X size={20} color="#6B7280" />
          </button>
        </div>
        {loading && <p style={{ textAlign:"center",color:"#9CA3AF",padding:"20px 0" }}>Yükleniyor…</p>}
        {!loading && addresses.length === 0 && (
          <p style={{ textAlign:"center",color:"#6B7280",padding:"16px 0" }}>
            Kayıtlı adresiniz yok. Hesabınızdan yeni adres ekleyin.
          </p>
        )}
        {addresses.map(a=>(
          <div key={a.id} onClick={()=>setSel(String(a.id))}
            style={{ display:"flex",alignItems:"center",gap:12,padding:"12px 16px",
                     marginBottom:8,borderRadius:12,
                     border:`2px solid ${String(a.id)===sel?P:GB}`,
                     background:String(a.id)===sel?PL:"#fff",cursor:"pointer" }}>
            <div style={{ width:18,height:18,borderRadius:"50%",
                          border:`2px solid ${String(a.id)===sel?P:"#9CA3AF"}`,
                          display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
              {String(a.id)===sel && <div style={{ width:9,height:9,borderRadius:"50%",background:P }} />}
            </div>
            <div>
              <p style={{ fontSize:14,fontWeight:600,color:"#111827" }}>{a.label || "Adres"}</p>
              <p style={{ fontSize:12,color:"#6B7280" }}>{[a.district, a.city].filter(Boolean).join(", ") || a.detail || a.address || ""}</p>
            </div>
          </div>
        ))}
        <button onClick={()=>navigate("/hesabim/adreslerim")}
          style={{ width:"100%",background:"none",border:`1.5px dashed ${GB}`,
                   borderRadius:10,padding:"10px 0",fontSize:13,color:"#6B7280",
                   cursor:"pointer",marginBottom:16,fontFamily:"inherit" }}>
          + Yeni Adres Ekle
        </button>
        <button
          disabled={!selected}
          onClick={()=>{ if(!selected) return; onSelect(`${selected.label || "Adres"} — ${[selected.district, selected.city].filter(Boolean).join(", ") || selected.detail || ""}`); onClose(); }}
          style={{ width:"100%",background:selected?P:"#D1D5DB",color:"#fff",border:"none",borderRadius:12,
                   padding:"13px 0",fontSize:14,fontWeight:700,cursor:selected?"pointer":"default",fontFamily:"inherit" }}>
          Kaydet
        </button>
      </div>
    </div>
  );
}

function Toast({ msg, onHide }: { msg:string; onHide:()=>void }) {
  return (
    <div style={{ position:"fixed",bottom:100,left:"50%",transform:"translateX(-50%)",
                  zIndex:300,background:"#111827",color:"#fff",padding:"10px 20px",
                  borderRadius:12,fontSize:13,fontWeight:500,whiteSpace:"nowrap",
                  boxShadow:"0 4px 12px rgba(0,0,0,0.2)" }}
      onClick={onHide}>
      {msg}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════ */
export default function YPSepetPage() {
  const [, navigate] = useLocation();
  const { isLoggedIn } = useCustomer();

  const [items, setItems]               = useState<CartItemData[]>([DEFAULT_ITEM]);
  const [showBanner, setShowBanner]     = useState(true);
  const [deliveryId, setDeliveryId]     = useState("standard");
  const [address, setAddress]           = useState<string|null>(null);
  const [showAddrModal, setShowAddrModal] = useState(false);
  const [couponInput, setCouponInput]   = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{discount:number;label:string}|null>(null);
  const [toastMsg, setToastMsg]         = useState<string|null>(null);
  const [recAdded, setRecAdded]         = useState<Set<string>>(new Set());

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(()=>setToastMsg(null), 2500);
  };

  const delivery       = DELIVERY_OPTIONS.find(d=>d.id===deliveryId)!;
  const originalSubtotal = items.reduce((s,i)=>s+i.originalPrice*i.quantity, 0);
  const saleSubtotal     = items.reduce((s,i)=>s+i.salePrice*i.quantity, 0);
  const productDiscount  = originalSubtotal - saleSubtotal;
  const shippingCost     = delivery.price===0 ? 0 : (saleSubtotal>=500 ? 0 : delivery.price);
  const couponDiscount   = appliedCoupon?.discount ?? 0;
  const total            = saleSubtotal + shippingCost - couponDiscount;
  const installAmt       = (total/3).toFixed(2).replace(".",",");
  const freeShipPct      = Math.min((saleSubtotal/500)*100, 100);
  const itemCount        = items.reduce((s,i)=>s+i.quantity, 0);

  const updateQty  = (id:string, delta:number) =>
    setItems(prev=>prev.map(i=>i.id===id?{...i,quantity:Math.max(1,Math.min(10,i.quantity+delta))}:i));
  const removeItem = (id:string) => setItems(prev=>prev.filter(i=>i.id!==id));
  const clearCart  = () => { if(window.confirm("Sepeti temizlemek istediğinizden emin misiniz?")) setItems([]); };

  const applyCoupon = async (code: string) => {
    const upper = code.trim().toUpperCase();
    if (!upper) return;
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: upper, subtotal: saleSubtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setAppliedCoupon({ discount: data.discountAmount, label: `${upper} — ${data.message}` });
        showToast("Kupon uygulandı ✓");
      } else {
        showToast(data.message || "Geçersiz kupon kodu");
      }
    } catch {
      showToast("Kupon doğrulanamadı. Tekrar deneyin.");
    }
  };

  const proceedToPayment = () => {
    if (!isLoggedIn) { navigate(`${BASE}/giris?returnTo=${encodeURIComponent(`${BASE}/sepet`)}`); return; }
    if(!address){ showToast("Lütfen teslimat adresi seçin"); setShowAddrModal(true); return; }
    navigate("/odeme");
  };

  /* ── EMPTY STATE ── */
  if (items.length === 0) {
    return (
      <YPLayout activeLink="/yourpoodle/magaza" constrain={false}>
        <div style={{ padding:"80px 24px", textAlign:"center" }}>
          <ShoppingCart size={60} color="#D1D5DB" style={{ margin:"0 auto 16px", display:"block" }} />
          <p style={{ fontSize:18, fontWeight:700, color:"#111827", marginBottom:8 }}>Sepetiniz boş</p>
          <p style={{ fontSize:13, color:"#9CA3AF", marginBottom:24 }}>Mağazadan ürün ekleyerek başlayın.</p>
          <button onClick={()=>navigate("/yourpoodle/magaza")}
            style={{ background:P,color:"#fff",border:"none",borderRadius:12,
                     padding:"13px 32px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}>
            Alışverişe Devam Et
          </button>
        </div>
      </YPLayout>
    );
  }

  /* ── FULL PAGE ── */
  return (
    <YPLayout activeLink="/yourpoodle/magaza" constrain={false}>
      <style>{`
        button { font-family:inherit; }
        .rec-scroll::-webkit-scrollbar { display:none; }
        .rec-scroll { -ms-overflow-style:none; scrollbar-width:none; }
        input { font-family:inherit; }
      `}</style>

      {/* ══ CART HEADER ════════════════════════════════════ */}
      <div style={{ background:"#fff", padding:"12px 16px",
                    display:"flex", alignItems:"center", justifyContent:"space-between",
                    borderBottom:`1px solid ${GB}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <button onClick={()=>navigate(-1 as any)} aria-label="Geri"
            style={{ width:32,height:32,border:"none",background:"none",cursor:"pointer",
                     display:"flex",alignItems:"center",justifyContent:"center",
                     color:"#374151",padding:0 }}>
            <ChevronLeft size={20} />
          </button>
          <span style={{ fontSize:17,fontWeight:800,color:"#111827" }}>Sepetim</span>
          <span style={{ background:PL,color:P,fontSize:11,fontWeight:700,
                         padding:"3px 9px",borderRadius:999 }}>
            {itemCount} ürün
          </span>
        </div>
        <button onClick={clearCart}
          style={{ background:"none",border:"none",cursor:"pointer",fontSize:13,color:"#9CA3AF",fontFamily:"inherit" }}>
          Sepeti Temizle
        </button>
      </div>

      <div style={{ padding:"0 0 12px", paddingBottom:88 }}>

        {/* ══ SUCCESS BANNER ═══════════════════════════════ */}
        {showBanner && (
          <div style={{ margin:"12px 16px 4px" }}>
            <div style={{ background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:12,
                          padding:"12px 14px",display:"flex",alignItems:"center",gap:10 }}>
              <CheckCircle size={18} color="#28A745" style={{ flexShrink:0 }} />
              <span style={{ fontSize:13,fontWeight:500,color:"#15803D",flex:1 }}>
                Ürün sepetinize eklendi.
              </span>
              <button onClick={()=>setShowBanner(false)}
                style={{ background:"none",border:"none",cursor:"pointer",display:"flex",padding:2 }}>
                <X size={16} color="#6B7280" />
              </button>
            </div>
          </div>
        )}
        <div style={{ padding:"8px 16px 8px" }}>
          <button onClick={()=>navigate("/yourpoodle/magaza")}
            style={{ background:"none",border:"none",cursor:"pointer",
                     fontSize:13,fontWeight:600,color:PB,fontFamily:"inherit" }}>
            Alışverişe Devam Et
          </button>
        </div>

        {/* ══ CART ITEM CARD ═══════════════════════════════ */}
        {items.map(item=>(
          <div key={item.id}
            style={{ margin:"0 16px 12px",background:"#fff",borderRadius:14,
                     border:`1px solid ${GB}`,padding:14,
                     boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
            <div style={{ display:"flex",gap:12 }}>
              {/* Image */}
              <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:6,flexShrink:0 }}>
                <div style={{ width:80,height:108,borderRadius:10,
                              background:"linear-gradient(135deg,#EEF2FF,#E0E7FF)",
                              display:"flex",flexDirection:"column",alignItems:"center",
                              justifyContent:"center",overflow:"hidden",position:"relative" }}>
                  <span style={{ fontSize:11,fontWeight:800,color:"#003087",letterSpacing:"0.5px" }}>PRO PLAN</span>
                  <span style={{ fontSize:32,marginTop:4 }}>🦮</span>
                </div>
                <button onClick={()=>showToast("Daha sonra al listesine eklendi")}
                  style={{ background:"none",border:"none",cursor:"pointer",
                           fontSize:11,fontWeight:600,color:PB,fontFamily:"inherit",
                           textDecoration:"underline",whiteSpace:"nowrap" }}>
                  Daha Sonra Al
                </button>
              </div>
              {/* Details */}
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ display:"flex",justifyContent:"flex-end",gap:10,marginBottom:6 }}>
                  <button onClick={()=>removeItem(item.id)} aria-label="Sil"
                    style={{ background:"none",border:"none",cursor:"pointer",display:"flex",padding:2 }}>
                    <Trash2 size={16} color="#9CA3AF" />
                  </button>
                  <button aria-label="Favorile"
                    style={{ background:"none",border:"none",cursor:"pointer",display:"flex",padding:2 }}>
                    <Heart size={16} color="#9CA3AF" />
                  </button>
                </div>
                <p style={{ fontSize:10,fontWeight:800,color:P,letterSpacing:"0.6px",
                            textTransform:"uppercase",marginBottom:3 }}>{item.brand}</p>
                <p style={{ fontSize:12,fontWeight:700,color:"#111827",lineHeight:1.35,
                            marginBottom:5,display:"-webkit-box",WebkitLineClamp:2,
                            WebkitBoxOrient:"vertical",overflow:"hidden" }}>{item.name}</p>
                <p style={{ fontSize:10,color:"#6B7280",lineHeight:1.7 }}>
                  {item.weight}<br />Barkod: {item.barcode}<br />SKT: {item.expiryDate}
                </p>
                <div style={{ display:"flex",alignItems:"center",gap:5,marginTop:4,marginBottom:6 }}>
                  <span style={{ width:7,height:7,borderRadius:"50%",background:"#22C55E",display:"inline-block" }} />
                  <span style={{ fontSize:10,color:"#16A34A",fontWeight:500 }}>Stokta</span>
                </div>
                <div style={{ display:"flex",flexWrap:"wrap",gap:4,marginBottom:8 }}>
                  {item.tags.map(t=>(
                    <span key={t.label} style={{ background:t.bg,color:t.text,fontSize:10,fontWeight:600,padding:"3px 8px",borderRadius:999 }}>{t.label}</span>
                  ))}
                </div>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end" }}>
                  <div>
                    <p style={{ fontSize:11,color:"#9CA3AF",textDecoration:"line-through",marginBottom:1 }}>
                      {fmt(item.originalPrice*item.quantity)} TL
                    </p>
                    <p style={{ fontSize:17,fontWeight:800,color:PB,lineHeight:1,marginBottom:2 }}>
                      {fmt(item.salePrice*item.quantity)} TL
                    </p>
                    <p style={{ fontSize:10,fontWeight:600,color:"#16A34A" }}>
                      {fmt((item.originalPrice-item.salePrice)*item.quantity)} TL kazanç
                    </p>
                  </div>
                  <div style={{ display:"flex",alignItems:"center",border:`1.5px solid ${PBD}`,borderRadius:10,overflow:"hidden" }}>
                    <button onClick={()=>updateQty(item.id,-1)} aria-label="Azalt"
                      disabled={item.quantity===1}
                      style={{ padding:"7px 10px",background:"none",border:"none",
                               cursor:item.quantity===1?"not-allowed":"pointer",
                               color:item.quantity===1?"#D1D5DB":"#374151",
                               display:"flex",alignItems:"center" }}>
                      <Minus size={13} />
                    </button>
                    <span style={{ padding:"7px 12px",fontSize:13,fontWeight:700,color:"#111827",
                                   minWidth:30,textAlign:"center" }}>
                      {item.quantity}
                    </span>
                    <button onClick={()=>updateQty(item.id,1)} aria-label="Artır"
                      disabled={item.quantity===10}
                      style={{ padding:"7px 10px",background:"none",border:"none",
                               cursor:item.quantity===10?"not-allowed":"pointer",
                               color:item.quantity===10?"#D1D5DB":"#374151",
                               display:"flex",alignItems:"center" }}>
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* ══ INSTALLMENT BANNER ═══════════════════════════ */}
        <div style={{ margin:"0 16px 12px",background:PL,borderRadius:14,padding:"12px 16px",
                      display:"flex",alignItems:"center",gap:12 }}>
          <CreditCard size={18} color={P} style={{ flexShrink:0 }} />
          <div>
            <p style={{ fontSize:11,fontWeight:600,color:"#374151" }}>Peşin fiyatına 3 taksit</p>
            <p style={{ fontSize:14,fontWeight:800,color:P }}>3 × {installAmt} TL</p>
          </div>
        </div>

        {/* ══ SHIPPING PROGRESS ════════════════════════════ */}
        <div style={{ margin:"0 16px 12px",background:"#fff",borderRadius:14,
                      border:`1px solid ${GB}`,padding:"14px 16px" }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:10 }}>
            <Truck size={18} color={PB} />
            <span style={{ fontSize:13,fontWeight:700,color:"#111827" }}>
              {freeShipPct>=100?"Ücretsiz kargo kazandınız!":`Ücretsiz kargoya ${fmt(500-saleSubtotal)} TL kaldı`}
            </span>
          </div>
          <div style={{ width:"100%",height:8,background:"#F3F4F6",borderRadius:999,overflow:"hidden" }}>
            <div style={{ width:`${freeShipPct}%`,height:"100%",background:PB,borderRadius:999,transition:"width 0.4s" }} />
          </div>
          <p style={{ fontSize:11,color:"#9CA3AF",marginTop:8 }}>500 TL üzeri siparişlerde kargo ücretsiz</p>
        </div>

        {/* ══ DELIVERY OPTIONS ═════════════════════════════ */}
        <div style={{ margin:"0 16px 12px" }}>
          <p style={{ fontSize:13,fontWeight:700,color:"#111827",marginBottom:10 }}>Teslimat Seçenekleri</p>
          <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
            {DELIVERY_OPTIONS.map(opt=>{
              const sel = deliveryId===opt.id;
              return (
                <button key={opt.id} onClick={()=>setDeliveryId(opt.id)}
                  style={{ display:"flex",alignItems:"center",gap:12,padding:"12px 14px",
                           borderRadius:12,border:`2px solid ${sel?P:GB}`,
                           background:sel?"#FAFAFF":"#fff",cursor:"pointer",
                           textAlign:"left",width:"100%",fontFamily:"inherit" }}>
                  <div style={{ width:18,height:18,borderRadius:"50%",border:`2px solid ${sel?P:"#D1D5DB"}`,
                                display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                    {sel && <div style={{ width:9,height:9,borderRadius:"50%",background:P }} />}
                  </div>
                  <div>
                    <p style={{ fontSize:13,fontWeight:600,color:"#111827" }}>{opt.title}</p>
                    <p style={{ fontSize:11,color:"#9CA3AF",marginTop:2 }}>{opt.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>
          {/* Address picker */}
          <button onClick={()=>setShowAddrModal(true)}
            style={{ display:"flex",alignItems:"center",justifyContent:"space-between",
                     width:"100%",marginTop:10,background:"#F9FAFB",border:`1px solid ${GB}`,
                     borderRadius:12,padding:"13px 16px",cursor:"pointer",fontFamily:"inherit" }}>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              <MapPin size={17} color={P} />
              <span style={{ fontSize:13,color:"#374151" }}>{address ?? "Teslimat adresinizi seçin"}</span>
            </div>
            <ChevronRight size={17} color="#9CA3AF" />
          </button>
        </div>

        {/* ══ COUPON ═══════════════════════════════════════ */}
        <div style={{ margin:"0 16px 12px" }}>
          <p style={{ fontSize:13,fontWeight:700,color:"#111827",marginBottom:10 }}>İndirim Kodu</p>
          <div style={{ display:"flex",gap:8 }}>
            <input value={couponInput}
              onChange={e=>setCouponInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&applyCoupon(couponInput)}
              placeholder="Kupon kodunuzu girin"
              style={{ flex:1,border:`1.5px solid ${GB}`,borderRadius:12,
                       padding:"11px 14px",fontSize:13,color:"#374151",background:"#fff",outline:"none" }} />
            <button onClick={()=>applyCoupon(couponInput)}
              style={{ border:`2px solid ${P}`,borderRadius:12,padding:"11px 16px",
                       background:"none",color:P,fontSize:13,fontWeight:700,cursor:"pointer" }}>
              Uygula
            </button>
          </div>
          {appliedCoupon && (
            <div style={{ marginTop:8,background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:12,padding:"10px 14px",
                          display:"flex",alignItems:"center",justifyContent:"space-between" }}>
              <div style={{ display:"flex",alignItems:"center",gap:7 }}>
                <Tag size={14} color="#16A34A" />
                <span style={{ fontSize:12,color:"#15803D",fontWeight:600 }}>{appliedCoupon.label}</span>
              </div>
              <button onClick={()=>{ setAppliedCoupon(null); setCouponInput(""); showToast("Kupon kaldırıldı"); }}
                style={{ background:"none",border:"none",cursor:"pointer",fontSize:12,fontWeight:700,color:"#EF4444",fontFamily:"inherit" }}>
                Kaldır
              </button>
            </div>
          )}
        </div>

        {/* ══ ORDER SUMMARY ════════════════════════════════ */}
        <div style={{ margin:"0 16px 12px",background:"#fff",borderRadius:14,
                      border:`1px solid ${GB}`,padding:"16px 16px" }}>
          <p style={{ fontSize:13,fontWeight:700,color:"#111827",marginBottom:14 }}>Sipariş Özeti</p>
          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            <div style={{ display:"flex",justifyContent:"space-between" }}>
              <span style={{ fontSize:13,color:"#374151" }}>Ürünler ({itemCount})</span>
              <span style={{ fontSize:13,color:"#374151" }}>{fmt(originalSubtotal)} TL</span>
            </div>
            <div style={{ display:"flex",justifyContent:"space-between" }}>
              <span style={{ fontSize:13,color:"#374151" }}>Ürün İndirimi</span>
              <span style={{ fontSize:13,color:"#16A34A",fontWeight:600 }}>-{fmt(productDiscount)} TL</span>
            </div>
            <div style={{ display:"flex",justifyContent:"space-between" }}>
              <span style={{ fontSize:13,color:"#374151" }}>Kargo</span>
              <span style={{ fontSize:13,color:shippingCost===0?"#16A34A":"#374151",fontWeight:shippingCost===0?600:400 }}>
                {shippingCost===0?"Ücretsiz":`${fmt(shippingCost)} TL`}
              </span>
            </div>
            <div style={{ display:"flex",justifyContent:"space-between" }}>
              <span style={{ fontSize:13,color:"#374151" }}>Kupon İndirimi</span>
              <span style={{ fontSize:13,color:couponDiscount>0?"#16A34A":"#374151",fontWeight:couponDiscount>0?600:400 }}>
                {couponDiscount>0?`-${fmt(couponDiscount)} TL`:"0 TL"}
              </span>
            </div>
          </div>
          <div style={{ height:1,background:"#F3F4F6",margin:"14px 0" }} />
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"baseline" }}>
            <span style={{ fontSize:14,fontWeight:700,color:"#111827" }}>Toplam</span>
            <span style={{ fontSize:24,fontWeight:800,color:PB }}>{fmt(total)} TL</span>
          </div>
          <p style={{ fontSize:11,color:"#9CA3AF",marginTop:3 }}>KDV dahil</p>
          <p style={{ fontSize:11,color:"#9CA3AF",marginTop:4 }}>3 taksit seçeneği: 3 x {installAmt} TL</p>
        </div>

        {/* ══ PAYMENT SECTION ══════════════════════════════ */}
        <div style={{ padding:"0 16px",marginBottom:12,display:"flex",flexDirection:"column",gap:10 }}>
          <button onClick={proceedToPayment}
            style={{ width:"100%",background:P,color:"#fff",border:"none",borderRadius:14,
                     padding:"16px 0",fontSize:15,fontWeight:700,cursor:"pointer",
                     display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontFamily:"inherit" }}>
            <Lock size={17} />
            Güvenli Ödemeye Geç
          </button>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:6 }}>
            <ShieldCheck size={14} color={PB} />
            <span style={{ fontSize:12,color:"#9CA3AF" }}>256-bit SSL ile güvenli ödeme</span>
          </div>
          <div style={{ display:"flex",justifyContent:"center",gap:8 }}>
            {["VISA","Mastercard","troy"].map(logo=>(
              <div key={logo} style={{ background:"#fff",border:`1px solid ${GB}`,borderRadius:8,
                                       padding:"5px 12px",fontSize:12,fontWeight:800,color:"#374151" }}>
                {logo}
              </div>
            ))}
          </div>
          <button onClick={()=>navigate("/yourpoodle/magaza")}
            style={{ width:"100%",background:"#fff",border:`2px solid ${P}`,borderRadius:14,
                     padding:"13px 0",fontSize:14,fontWeight:700,color:P,cursor:"pointer",fontFamily:"inherit" }}>
            Alışverişe Devam Et
          </button>
        </div>

        {/* ══ RECOMMENDATIONS ══════════════════════════════ */}
        <div style={{ padding:"0 16px" }}>
          <p style={{ fontSize:13,fontWeight:700,color:"#111827",marginBottom:12 }}>Bunları da sevebilirsiniz</p>
          <div className="rec-scroll" style={{ display:"flex",gap:12,overflowX:"auto" }}>
            {RECS.map(rec=>(
              <div key={rec.id} style={{ minWidth:140,background:"#fff",border:`1px solid ${GB}`,
                                         borderRadius:14,padding:"10px 10px 12px",flexShrink:0 }}>
                <div style={{ width:"100%",height:76,borderRadius:10,background:"#F9FAFB",
                              display:"flex",alignItems:"center",justifyContent:"center",
                              fontSize:36,marginBottom:8 }}>
                  {rec.emoji}
                </div>
                <p style={{ fontSize:11,fontWeight:600,color:"#374151",lineHeight:1.4,marginBottom:5,
                            display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden" }}>
                  {rec.name}
                </p>
                <p style={{ fontSize:14,fontWeight:800,color:PB,marginBottom:8 }}>{fmt(rec.price)} TL</p>
                <button onClick={()=>{ setRecAdded(prev=>new Set(prev).add(rec.id)); showToast(`${rec.name} sepete eklendi`); }}
                  style={{ width:"100%",background:recAdded.has(rec.id)?"#16A34A":"none",
                           border:`1.5px solid ${recAdded.has(rec.id)?"#16A34A":P}`,borderRadius:8,
                           padding:"7px 0",fontSize:11,fontWeight:700,
                           color:recAdded.has(rec.id)?"#fff":P,cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s" }}>
                  {recAdded.has(rec.id)?"✓ Eklendi":"+ Ekle"}
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ══ ADDRESS MODAL ═══════════════════════════════════ */}
      {showAddrModal && <AddressModal onSelect={setAddress} onClose={()=>setShowAddrModal(false)} />}

      {/* ══ TOAST ════════════════════════════════════════════ */}
      {toastMsg && <Toast msg={toastMsg} onHide={()=>setToastMsg(null)} />}

      {/* ══ STICKY BOTTOM BAR ════════════════════════════════ */}
      <div style={{ position:"fixed",bottom:72,left:0,right:0,zIndex:50,
                    display:"flex",justifyContent:"center",pointerEvents:"none" }}>
        <div style={{ maxWidth:480,width:"100%",background:"#fff",
                      borderTop:`1px solid ${GB}`,
                      display:"flex",alignItems:"center",justifyContent:"space-between",
                      padding:"12px 16px",boxShadow:"0 -4px 16px rgba(0,0,0,0.08)",
                      pointerEvents:"all" }}>
          <div>
            <p style={{ fontSize:11,color:"#9CA3AF" }}>Toplam</p>
            <p style={{ fontSize:18,fontWeight:800,color:PB }}>{fmt(total)} TL</p>
          </div>
          <button onClick={proceedToPayment}
            style={{ background:P,color:"#fff",border:"none",borderRadius:12,
                     padding:"12px 24px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}>
            Ödemeye Geç
          </button>
        </div>
      </div>
    </YPLayout>
  );
}
