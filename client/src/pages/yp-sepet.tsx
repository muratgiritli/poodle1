import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { ShoppingCart, Plus, Minus, Trash2, ChevronLeft, ArrowRight, AlertTriangle } from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";

interface CartItem { id: number; name: string; price: number; img?: string; qty: number; }
interface StockInfo { name: string; price: number; stock: number; isActive: boolean; }

const LS_CART = "yp_cart_items";
const LOW_STOCK_THRESHOLD = 5;

function loadCart(): CartItem[] {
  try { return JSON.parse(localStorage.getItem(LS_CART) || "[]"); } catch { return []; }
}
function saveCart(items: CartItem[]) {
  try { localStorage.setItem(LS_CART, JSON.stringify(items)); } catch {}
}

export default function YPSepetPage() {
  const [, navigate] = useLocation();
  const [cart, setCart] = useState<CartItem[]>(loadCart);
  const [stockMap, setStockMap] = useState<Record<number, StockInfo>>({});
  const [stockLoading, setStockLoading] = useState(false);
  const prevIdsRef = useRef<string>("");

  useEffect(() => {
    document.title = "Sepetim | YourPoodle";
    saveCart(cart);
  }, [cart]);

  // Validate stock whenever cart item ids change
  useEffect(() => {
    if (cart.length === 0) {
      setStockMap({});
      return;
    }
    const ids = cart.map(i => i.id);
    const idsKey = ids.slice().sort((a,b)=>a-b).join(",");
    if (idsKey === prevIdsRef.current) return;
    prevIdsRef.current = idsKey;

    setStockLoading(true);
    fetch("/api/yp-cart/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    })
      .then(r => r.ok ? r.json() : {})
      .then(data => {
        // Convert string keys from JSON to number keys
        const normalized: Record<number, StockInfo> = {};
        for (const k of Object.keys(data)) {
          normalized[Number(k)] = data[k];
        }
        setStockMap(normalized);
      })
      .catch(() => {})
      .finally(() => setStockLoading(false));
  }, [cart]);

  // Auto-remove fully out-of-stock items once validation results arrive
  useEffect(() => {
    if (Object.keys(stockMap).length === 0) return;
    setCart(prev => {
      const filtered = prev.filter(item => {
        const info = stockMap[item.id];
        if (!info) return true; // not yet loaded — keep
        return info.isActive && info.stock > 0;
      });
      return filtered.length !== prev.length ? filtered : prev;
    });
  }, [stockMap]);

  const remove = (id: number) => setCart(prev => prev.filter(i => i.id !== id));
  const changeQty = (id: number, delta: number) =>
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const kargo = subtotal >= 299 ? 0 : 49;
  const total = subtotal + kargo;
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  // Determine per-item stock status
  function getStockStatus(item: CartItem): "ok" | "low" | "insufficient" | "out" {
    const info = stockMap[item.id];
    if (!info) return "ok"; // not yet loaded — optimistic
    if (!info.isActive || info.stock === 0) return "out";
    if (item.qty > info.stock) return "insufficient";
    if (info.stock <= LOW_STOCK_THRESHOLD) return "low";
    return "ok";
  }

  const hasBlockingIssue = cart.some(item => {
    const s = getStockStatus(item);
    return s === "out" || s === "insufficient";
  });

  const hasOutItems = cart.some(item => getStockStatus(item) === "out");

  const removeOutOfStock = () =>
    setCart(prev => prev.filter(item => getStockStatus(item) !== "out"));

  return (
    <YPLayout activeLink="/yourpoodle/magaza">
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .sepet-item { transition: background 0.12s; }
        .sepet-item:hover { background: #FAFAFA; }
      `}</style>

      <div style={{ background: "#fff", minHeight: "100vh" }}>
        {/* Header */}
        <div style={{ background: "#fff", padding: "12px 16px", borderBottom: "1px solid #f0f0f0", position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => navigate("/yourpoodle/magaza")}
            style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: "#7C3AFF", fontSize: 13, fontWeight: 700, padding: 0, flexShrink: 0 }}>
            <ChevronLeft size={16} /> Mağaza
          </button>
          <h1 style={{ flex: 1, textAlign: "center", fontSize: 16, fontWeight: 800, color: "#1a1a1a", margin: 0 }}>
            Sepetim {cartCount > 0 ? `(${cartCount})` : ""}
          </h1>
          <div style={{ width: 60, flexShrink: 0 }} />
        </div>

        {cart.length === 0 ? (
          /* Empty cart */
          <div style={{ padding: "80px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1a1a1a", marginBottom: 8 }}>Sepetiniz boş</h2>
            <p style={{ fontSize: 14, color: "#888", marginBottom: 24 }}>Mağazadan Poodle'ınız için ürün ekleyin.</p>
            <button onClick={() => navigate("/yourpoodle/magaza")}
              style={{ padding: "12px 28px", borderRadius: 20, background: "linear-gradient(135deg,#7C3AFF,#A855F7)", border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              Mağazaya Git
            </button>
          </div>
        ) : (
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            {/* Cart items */}
            <div style={{ padding: "8px 0 0" }}>
              {cart.map(item => {
                const status = getStockStatus(item);
                const isOut = status === "out";
                const isInsufficient = status === "insufficient";
                const isLow = status === "low";
                const info = stockMap[item.id];

                return (
                  <div key={item.id} className="sepet-item"
                    style={{ display: "flex", flexDirection: "column", gap: 0, borderBottom: "1px solid #f5f5f5" }}>
                    <div style={{ display: "flex", gap: 12, padding: "14px 16px", alignItems: "center", opacity: isOut ? 0.6 : 1 }}>
                      {/* Image */}
                      <div style={{ width: 72, height: 72, borderRadius: 12, background: "#F5F0FF", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {item.img
                          ? <img src={item.img} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 6 }} />
                          : <span style={{ fontSize: 28 }}>🐾</span>
                        }
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div onClick={() => navigate(`/yourpoodle/urun/${item.id}`)}
                          style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.4, marginBottom: 6, cursor: "pointer", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 900, color: isOut ? "#9CA3AF" : "#7C3AFF" }}>
                          ₺{(item.price * item.qty).toLocaleString("tr-TR", { minimumFractionDigits: 0 })}
                        </div>
                      </div>

                      {/* Qty controls */}
                      <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                        <button onClick={() => item.qty === 1 ? remove(item.id) : changeQty(item.id, -1)}
                          style={{ width: 30, height: 30, borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {item.qty === 1 ? <Trash2 size={13} color="#EF4444" /> : <Minus size={13} />}
                        </button>
                        <span style={{ width: 26, textAlign: "center", fontSize: 14, fontWeight: 800 }}>{item.qty}</span>
                        <button onClick={() => changeQty(item.id, 1)}
                          disabled={isOut || (info != null && item.qty >= info.stock)}
                          style={{ width: 30, height: 30, borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", cursor: (isOut || (info != null && item.qty >= info.stock)) ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: (isOut || (info != null && item.qty >= info.stock)) ? 0.4 : 1 }}>
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Stock warning badge */}
                    {(isOut || isInsufficient || isLow) && (
                      <div style={{
                        margin: "0 16px 10px",
                        padding: "7px 10px",
                        borderRadius: 8,
                        background: isOut || isInsufficient ? "#FEF2F2" : "#FFFBEB",
                        border: `1px solid ${isOut || isInsufficient ? "#FECACA" : "#FDE68A"}`,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        color: isOut || isInsufficient ? "#DC2626" : "#D97706",
                      }}>
                        <AlertTriangle size={13} style={{ flexShrink: 0 }} />
                        {isOut
                          ? "Bu ürün stokta kalmadı. Sepetten çıkarmak için çöp kutusuna basın."
                          : isInsufficient
                          ? `Stokta yalnızca ${info?.stock ?? 0} adet var. Lütfen miktarı azaltın.`
                          : `Son ${info?.stock ?? LOW_STOCK_THRESHOLD} ürün — acele edin!`
                        }
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Kargo bilgisi */}
            {subtotal < 299 && (
              <div style={{ margin: "12px 16px", background: "#FFF7ED", borderRadius: 12, padding: "10px 14px", fontSize: 12.5, color: "#C2410C", fontWeight: 600 }}>
                🚚 <strong>₺{(299 - subtotal).toLocaleString("tr-TR", { minimumFractionDigits: 0 })} daha</strong> ekle, kargo ücretsiz!
              </div>
            )}

            {/* Out-of-stock summary warning */}
            {hasBlockingIssue && !stockLoading && (
              <div style={{ margin: "0 16px 12px" }}>
                <div style={{ padding: "10px 14px", borderRadius: 12, background: "#FEF2F2", border: "1px solid #FECACA", fontSize: 13, color: "#DC2626", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                  <AlertTriangle size={15} style={{ flexShrink: 0 }} />
                  Sepetinizdeki bazı ürünlerin stoğu yetersiz. Siparişi tamamlamak için miktarları güncelleyin veya ürünleri çıkarın.
                </div>
                {hasOutItems && (
                  <button
                    onClick={removeOutOfStock}
                    style={{
                      marginTop: 8,
                      width: "100%",
                      padding: "10px 16px",
                      borderRadius: 10,
                      border: "1.5px solid #FECACA",
                      background: "#fff",
                      color: "#DC2626",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      fontFamily: "inherit",
                    }}>
                    <Trash2 size={14} /> Stokta olmayan ürünleri kaldır
                  </button>
                )}
              </div>
            )}

            {/* Özet */}
            <div style={{ margin: "12px 16px 100px", background: "#F9FAFB", borderRadius: 16, padding: "16px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#555", marginBottom: 8 }}>
                <span>Ürünler ({cartCount} adet)</span>
                <span>₺{subtotal.toLocaleString("tr-TR", { minimumFractionDigits: 0 })}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#555", marginBottom: 12 }}>
                <span>Kargo</span>
                <span style={{ color: kargo === 0 ? "#16A34A" : undefined, fontWeight: kargo === 0 ? 700 : undefined }}>
                  {kargo === 0 ? "Ücretsiz" : `₺${kargo}`}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 900, color: "#1a1a1a", borderTop: "1px solid #e5e7eb", paddingTop: 12 }}>
                <span>Toplam</span>
                <span style={{ color: "#7C3AFF" }}>₺{total.toLocaleString("tr-TR", { minimumFractionDigits: 0 })}</span>
              </div>
            </div>
          </div>
        )}

        {/* Checkout CTA */}
        {cart.length > 0 && (
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #f0f0f0", padding: "12px 16px", zIndex: 200 }}>
            <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", gap: 10 }}>
              <button onClick={() => navigate("/yourpoodle/magaza")}
                style={{ width: 48, height: 48, borderRadius: 12, border: "1.5px solid #7C3AFF", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <ShoppingCart size={18} color="#7C3AFF" />
              </button>
              <button
                onClick={() => !hasBlockingIssue && navigate("/yourpoodle/odeme")}
                disabled={hasBlockingIssue}
                title={hasBlockingIssue ? "Stok sorunu olan ürünleri düzeltin" : undefined}
                style={{
                  flex: 1, height: 48, borderRadius: 12, border: "none",
                  background: hasBlockingIssue
                    ? "linear-gradient(135deg,#9CA3AF,#D1D5DB)"
                    : "linear-gradient(135deg,#7C3AFF,#A855F7)",
                  color: "#fff", fontSize: 14, fontWeight: 800,
                  cursor: hasBlockingIssue ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  gap: 8, fontFamily: "inherit",
                  opacity: hasBlockingIssue ? 0.8 : 1,
                }}>
                {hasBlockingIssue ? (
                  <>
                    <AlertTriangle size={16} /> Stok Sorunu Var
                  </>
                ) : (
                  <>
                    Siparişi Tamamla <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </YPLayout>
  );
}
