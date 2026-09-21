import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import {
  ChevronLeft, CheckCircle, X, Trash2,
  Truck, Tag,
  Lock, ShieldCheck, Plus, Minus, ShoppingCart,
} from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { useCustomer } from "@/contexts/CustomerContext";
import { IS_YP } from "@/lib/store";
import { useCart } from "@/contexts/CartContext";
import { useQuery } from "@tanstack/react-query";
import { goBack } from "@/lib/goBack";
import { saveCheckoutDraft } from "@/lib/checkout-draft";
import { resolveYpShipping, type DeliveryNeighborhood } from "@/lib/yp-shipping";
import PaymentCardLogos from "@/components/yourpoodle/PaymentCardLogos";

const BASE = IS_YP ? "" : "/yourpoodle";

/* ─── Palette ──────────────────────────── */
const P   = "#5D3A1A";
const PB  = "#3D2612";
const PL  = "#F5F0E6";
const PBD = "#E5DDD0";
const GB  = "#E5E7EB";

function fmt(n: number) { return n.toLocaleString("tr-TR"); }


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
  const { basket, updateQty: cartUpdate } = useCart();

  /* Fetch product catalog to resolve basket IDs → product details */
  const { data: allProducts = [] } = useQuery<any[]>({
    queryKey: ["/api/yp-products"],
    staleTime: 60_000,
  });

  /* Build cart items from basket + product data */
  const items = Object.entries(basket)
    .filter(([, qty]) => (qty as number) > 0)
    .map(([pid, qty]) => {
      const p = allProducts.find((x: any) => String(x.id) === pid);
      if (!p) return null;
      return { id: pid, product: p, quantity: qty as number };
    })
    .filter(Boolean) as { id: string; product: any; quantity: number }[];

  const [showBanner, setShowBanner]     = useState(true);
  const [couponInput, setCouponInput]   = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; label: string; freeShipping?: boolean }|null>(null);
  const [toastMsg, setToastMsg]         = useState<string|null>(null);

  const { data: deliveryNeighborhoods = [] } = useQuery<DeliveryNeighborhood[]>({
    queryKey: ["/api/delivery-neighborhoods"],
    staleTime: 60_000,
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(()=>setToastMsg(null), 2500);
  };

  const saleSubtotal  = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const origSubtotal  = items.reduce((s, i) => s + (i.product.originalPrice ?? i.product.price) * i.quantity, 0);
  const productDiscount  = Math.max(0, origSubtotal - saleSubtotal);
  const shipInfo = useMemo(
    () => resolveYpShipping(saleSubtotal, "", deliveryNeighborhoods),
    [saleSubtotal, deliveryNeighborhoods],
  );
  const shippingCost  = appliedCoupon?.freeShipping ? 0 : shipInfo.shipping;
  const couponDiscount   = appliedCoupon?.discount ?? 0;
  const total         = Math.max(0, saleSubtotal + shippingCost - couponDiscount);
  const freeShipPct   = Math.min((saleSubtotal / shipInfo.freeLimit) * 100, 100);
  const itemCount     = items.reduce((s, i) => s + i.quantity, 0);

  const handleQty = (id: string, delta: number) => cartUpdate(id, delta);
  const removeItem = (id: string) => {
    const cur = basket[id] || 0;
    if (cur > 0) cartUpdate(id, -cur);
  };
  const clearCart = () => {
    if (window.confirm("Sepeti temizlemek istediğinizden emin misiniz?"))
      items.forEach(i => cartUpdate(i.id, -(i.quantity)));
  };

  const applyCoupon = async (code: string) => {
    const upper = code.trim().toUpperCase();
    if (!upper) return;
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code: upper, subtotal: saleSubtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setAppliedCoupon({
          code: upper,
          discount: data.discountAmount,
          label: `${upper} — ${data.message}`,
          freeShipping: !!data.freeShipping || data.discountType === "free_shipping",
        });
        showToast("Kupon uygulandı ✓");
      } else {
        showToast(data.message || "Geçersiz kupon kodu");
      }
    } catch {
      showToast("Kupon doğrulanamadı. Tekrar deneyin.");
    }
  };

  const proceedToPayment = () => {
    // Draft önce kaydedilir — giriş redirect'inde kupon/adres kaybolmasın
    saveCheckoutDraft({
      couponCode: appliedCoupon?.code,
      couponDiscount: appliedCoupon?.discount ?? 0,
      couponLabel: appliedCoupon?.label,
      couponFreeShipping: !!appliedCoupon?.freeShipping,
      deliveryId: "standard",
      deliveryPrice: shippingCost,
    });
    if (!isLoggedIn) {
      navigate(`${BASE}/giris?returnTo=${encodeURIComponent(`${BASE}/odeme`)}`);
      return;
    }
    navigate(`${BASE}/odeme`);
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
          <button onClick={()=>goBack(navigate, "/")} aria-label="Geri"
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
        {items.map(({id, product: p, quantity})=>(
          <div key={id}
            style={{ margin:"0 16px 12px",background:"#fff",borderRadius:14,
                     border:`1px solid ${GB}`,padding:14,
                     boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
            <div style={{ display:"flex",gap:12 }}>
              {/* Image */}
              <div style={{ width:80,height:80,borderRadius:10,flexShrink:0,
                            background:"#F9FAFB",overflow:"hidden",display:"flex",
                            alignItems:"center",justifyContent:"center" }}>
                {p.img
                  ? <img src={p.img} alt={p.name} style={{ width:"100%",height:"100%",objectFit:"contain",padding:4 }} />
                  : <ShoppingCart size={28} color="#D1D5DB" />}
              </div>
              {/* Details */}
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ display:"flex",justifyContent:"flex-end",marginBottom:4 }}>
                  <button onClick={()=>removeItem(id)} aria-label="Sil"
                    style={{ background:"none",border:"none",cursor:"pointer",display:"flex",padding:2 }}>
                    <Trash2 size={16} color="#9CA3AF" />
                  </button>
                </div>
                {p.brand && (
                  <p style={{ fontSize:10,fontWeight:800,color:P,letterSpacing:"0.6px",
                              textTransform:"uppercase",marginBottom:3 }}>{p.brand}</p>
                )}
                <p style={{ fontSize:12,fontWeight:700,color:"#111827",lineHeight:1.35,
                            marginBottom:6,display:"-webkit-box",WebkitLineClamp:2,
                            WebkitBoxOrient:"vertical",overflow:"hidden" }}>{p.name}</p>
                <div style={{ display:"flex",alignItems:"center",gap:5,marginBottom:8 }}>
                  <span style={{ width:7,height:7,borderRadius:"50%",background:"#22C55E",display:"inline-block" }} />
                  <span style={{ fontSize:10,color:"#16A34A",fontWeight:500 }}>Stokta</span>
                </div>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end" }}>
                  <div>
                    {p.originalPrice && p.originalPrice > p.price && (
                      <p style={{ fontSize:11,color:"#9CA3AF",textDecoration:"line-through",marginBottom:1 }}>
                        {fmt(p.originalPrice*quantity)} TL
                      </p>
                    )}
                    <p style={{ fontSize:17,fontWeight:800,color:PB,lineHeight:1,marginBottom:2 }}>
                      {fmt(p.price*quantity)} TL
                    </p>
                    {p.originalPrice && p.originalPrice > p.price && (
                      <p style={{ fontSize:10,fontWeight:600,color:"#16A34A" }}>
                        {fmt((p.originalPrice-p.price)*quantity)} TL kazanç
                      </p>
                    )}
                  </div>
                  <div style={{ display:"flex",alignItems:"center",border:`1.5px solid ${PBD}`,borderRadius:10,overflow:"hidden" }}>
                    <button onClick={()=>handleQty(id,-1)} aria-label="Azalt"
                      disabled={quantity<=1}
                      style={{ padding:"7px 10px",background:"none",border:"none",
                               cursor:quantity<=1?"not-allowed":"pointer",
                               color:quantity<=1?"#D1D5DB":"#374151",
                               display:"flex",alignItems:"center" }}>
                      <Minus size={13} />
                    </button>
                    <span style={{ padding:"7px 12px",fontSize:13,fontWeight:700,color:"#111827",
                                   minWidth:30,textAlign:"center" }}>
                      {quantity}
                    </span>
                    <button onClick={()=>handleQty(id,1)} aria-label="Artır"
                      style={{ padding:"7px 10px",background:"none",border:"none",cursor:"pointer",
                               color:"#374151",display:"flex",alignItems:"center" }}>
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* ══ SHIPPING PROGRESS ════════════════════════════ */}
        <div style={{ margin:"0 16px 12px",background:"#fff",borderRadius:14,
                      border:`1px solid ${GB}`,padding:"14px 16px" }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:10 }}>
            <Truck size={18} color={PB} />
            <span style={{ fontSize:13,fontWeight:700,color:"#111827" }}>
              {freeShipPct>=100
                ? "Ücretsiz kargo kazandınız!"
                : `Ücretsiz kargoya ${fmt(Math.max(0, shipInfo.freeLimit - saleSubtotal))} TL kaldı`}
            </span>
          </div>
          <div style={{ width:"100%",height:8,background:"#F3F4F6",borderRadius:999,overflow:"hidden" }}>
            <div style={{ width:`${freeShipPct}%`,height:"100%",background:PB,borderRadius:999,transition:"width 0.4s" }} />
          </div>
          <p style={{ fontSize:11,color:"#9CA3AF",marginTop:8 }}>
            {shipInfo.matched
              ? `${shipInfo.matched.name}: ${fmt(shipInfo.freeLimit)} TL üzeri ücretsiz (aksi halde ${fmt(shipInfo.fee)} TL)`
              : `${fmt(shipInfo.freeLimit)} TL üzeri ücretsiz kargo (altı ${fmt(shipInfo.fee)} TL)`}
          </p>
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
              <span style={{ fontSize:13,color:"#374151" }}>{fmt(origSubtotal)} TL</span>
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
          <p style={{ fontSize:11,color:"#9CA3AF",marginTop:3 }}>KDV dahil · online kart ile ödeme</p>
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
          <PaymentCardLogos height={30} />
          <button onClick={()=>navigate("/yourpoodle/magaza")}
            style={{ width:"100%",background:"#fff",border:`2px solid ${P}`,borderRadius:14,
                     padding:"13px 0",fontSize:14,fontWeight:700,color:P,cursor:"pointer",fontFamily:"inherit" }}>
            Alışverişe Devam Et
          </button>
        </div>

      </div>

      {/* ══ TOAST ════════════════════════════════════════════ */}
      {toastMsg && <Toast msg={toastMsg} onHide={()=>setToastMsg(null)} />}

      {/* ══ STICKY BOTTOM BAR ════════════════════════════════ */}
      <div style={{ position:"fixed",bottom:72,left:0,right:0,zIndex:50,
                    display:"flex",justifyContent:"center",pointerEvents:"none" }}>
        <div style={{ maxWidth: "var(--yp-shell-max)",width:"100%",background:"#fff",
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
