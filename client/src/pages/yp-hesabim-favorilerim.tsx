// Route: /hesabim/favoriler
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  ArrowLeft, Search, Heart, Package, ShoppingCart,
} from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { useCustomer } from "@/contexts/CustomerContext";
import { useCart } from "@/contexts/CartContext";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { goBack } from "@/lib/goBack";
import { IS_YP } from "@/lib/store";

const BASE = IS_YP ? "" : "/yourpoodle";
const P   = "#5D3A1A";
const PD  = "#3D2612";
const PL  = "#F5F0E6";
const GB  = "#E5E7EB";
const GBG = "#F9FAFB";
const GT  = "#6B7280";
const DRK = "#111827";

interface FavProduct {
  id: number;
  name: string;
  price: number;
  img?: string | null;
  stock?: number;
  selected?: boolean;
}

function fmt(n: number) {
  return n.toLocaleString("tr-TR");
}

function stockKind(stock?: number): "stokta" | "az" | "tukendi" {
  if (stock == null) return "stokta";
  if (stock <= 0) return "tukendi";
  if (stock <= 3) return "az";
  return "stokta";
}

function StockBadge({ stock }: { stock?: number }) {
  const kind = stockKind(stock);
  if (kind === "stokta") return <span style={{ fontSize: 10, fontWeight: 600, color: "#16A34A" }}>Stokta</span>;
  if (kind === "az") return <span style={{ fontSize: 10, fontWeight: 600, color: "#EA580C" }}>Son {stock} ürün</span>;
  return <span style={{ fontSize: 10, fontWeight: 600, color: "#EF4444" }}>Tükendi</span>;
}

function ProductCard({
  product, selected, onToggleSelect, onRemove, onAddToCart,
}: {
  product: FavProduct;
  selected: boolean;
  onToggleSelect: () => void;
  onRemove: () => void;
  onAddToCart: () => void;
}) {
  const sold = stockKind(product.stock) === "tukendi";

  return (
    <div style={{
      background: "#fff", borderRadius: 14,
      border: `1.5px solid ${selected ? P : GB}`,
      overflow: "hidden", display: "flex", flexDirection: "column",
      transition: "border-color 0.15s",
    }}>
      <div style={{ position: "relative" }}>
        <div
          onClick={onToggleSelect}
          style={{
            position: "absolute", top: 8, left: 8, zIndex: 2,
            width: 18, height: 18, borderRadius: 4,
            border: `2px solid ${selected ? P : "#D1D5DB"}`,
            background: selected ? P : "#fff",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {selected && (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>

        <Heart size={16} fill={P} color={P} style={{ position: "absolute", top: 8, right: 8, zIndex: 2 }} />

        {product.img ? (
          <img
            src={product.img}
            alt={product.name}
            style={{ width: "100%", aspectRatio: "1", objectFit: "cover", opacity: sold ? 0.5 : 1 }}
          />
        ) : (
          <div style={{
            width: "100%", aspectRatio: "1", background: PL,
            display: "flex", alignItems: "center", justifyContent: "center", opacity: sold ? 0.5 : 1,
          }}>
            <Package size={28} color={P} />
          </div>
        )}
      </div>

      <div style={{ padding: "8px 8px 0" }}>
        <div style={{
          fontSize: 12, fontWeight: 600, color: DRK, lineHeight: 1.3, marginBottom: 4,
          overflow: "hidden", display: "-webkit-box",
          WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any,
        }}>
          {product.name}
        </div>
        <div style={{ marginBottom: 4 }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: P }}>{fmt(product.price)} TL</span>
        </div>
        <div style={{ marginBottom: 8 }}>
          <StockBadge stock={product.stock} />
        </div>
      </div>

      <div style={{ padding: "0 8px 8px", marginTop: "auto" }}>
        {sold ? (
          <button style={{
            width: "100%", padding: "9px 0", borderRadius: 10,
            border: `1.5px solid ${GB}`, background: GBG,
            fontSize: 11, fontWeight: 700, color: GT,
            cursor: "default", fontFamily: "inherit",
          }}>
            Tükendi
          </button>
        ) : (
          <button style={{
            width: "100%", padding: "9px 0", borderRadius: 10,
            border: "none", background: P,
            fontSize: 11, fontWeight: 700, color: "#fff",
            cursor: "pointer", fontFamily: "inherit",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = PD; }}
          onMouseLeave={e => { e.currentTarget.style.background = P; }}
          onClick={onAddToCart}>
            Sepete Ekle
          </button>
        )}

        <button
          onClick={onRemove}
          style={{
            width: "100%", padding: "5px 0", marginTop: 4,
            background: "none", border: "none",
            fontSize: 10, fontWeight: 600, color: GT,
            cursor: "pointer", fontFamily: "inherit",
            textDecoration: "underline",
          }}>
          Favoriden Çıkar
        </button>
      </div>
    </div>
  );
}

export default function YPHesabimFavorilerimPage() {
  const [, navigate] = useLocation();
  const { isLoggedIn, isLoading } = useCustomer();
  const { updateQty } = useCart();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [toast, setToast] = useState("");

  useEffect(() => {
    document.title = "Favorilerim | YourPoodle";
  }, []);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate(`${BASE}/giris?returnTo=${encodeURIComponent("/hesabim/favoriler")}`);
    }
  }, [isLoading, isLoggedIn, navigate]);

  const { data: favDetails = [], isLoading: favLoading } = useQuery<FavProduct[]>({
    queryKey: ["/api/customer/favorites/details"],
    enabled: !!isLoggedIn,
  });

  const removeMutation = useMutation({
    mutationFn: async (productId: number) => {
      await apiRequest("DELETE", `/api/customer/favorites/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customer/favorites"] });
      queryClient.invalidateQueries({ queryKey: ["/api/customer/favorites/details"] });
    },
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  const products = Array.isArray(favDetails) ? favDetails : [];
  const displayed = products.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(displayed.map(p => p.id)));

  const removeProduct = async (id: number) => {
    await removeMutation.mutateAsync(id);
    setSelected(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    showToast("Favoriden çıkarıldı");
  };

  const removeSelected = async () => {
    const ids = [...selected];
    for (const id of ids) {
      await removeMutation.mutateAsync(id);
    }
    setSelected(new Set());
    showToast(`${ids.length} ürün favoriden çıkarıldı`);
  };

  const addToCart = (product: FavProduct) => {
    if (stockKind(product.stock) === "tukendi") return;
    const ok = updateQty(String(product.id), 1);
    showToast(ok === false ? "Sepete eklenemedi" : "Sepete eklendi ✓");
  };

  const addSelectedToCart = () => {
    const list = products.filter(p => selected.has(p.id) && stockKind(p.stock) !== "tukendi");
    list.forEach(p => updateQty(String(p.id), 1));
    showToast(list.length ? `${list.length} ürün sepete eklendi ✓` : "Seçili stokta ürün yok");
  };

  const addAllToCart = () => {
    const list = products.filter(p => stockKind(p.stock) !== "tukendi");
    list.forEach(p => updateQty(String(p.id), 1));
    showToast(list.length ? `${list.length} ürün sepete eklendi ✓` : "Stokta ürün yok");
  };

  if (isLoading || !isLoggedIn) {
    return (
      <YPLayout activeLink="" constrain={false}>
        <div style={{ padding: 48, textAlign: "center", color: GT, fontSize: 14 }}>Yükleniyor...</div>
      </YPLayout>
    );
  }

  return (
    <YPLayout activeLink="" constrain={false}>
      {toast && (
        <div style={{
          position: "fixed", top: 72, left: "50%", transform: "translateX(-50%)",
          background: "#111", color: "#fff", padding: "10px 20px", borderRadius: 12,
          fontSize: 13, fontWeight: 600, zIndex: 999, whiteSpace: "nowrap",
          boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
        }}>
          {toast}
        </div>
      )}

      <div style={{
        maxWidth: "var(--yp-shell-max)", margin: "0 auto",
        fontFamily: "'Inter',-apple-system,sans-serif",
        color: DRK, background: GBG, minHeight: "100vh", paddingBottom: 90,
      }}>
        <div style={{ background: "#fff", padding: "14px 16px 12px", borderBottom: `1px solid ${GB}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <button onClick={() => goBack(navigate, "/hesabim")} aria-label="Geri"
              style={{ background: "none", border: "none", cursor: "pointer",
                       display: "flex", alignItems: "center", padding: 0, color: GT }}>
              <ArrowLeft size={17} />
            </button>
            <span style={{ fontSize: 12, color: GT }}>Hesabım</span>
            <span style={{ fontSize: 12, color: GT }}>/</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: DRK }}>Favorilerim</span>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: DRK, marginBottom: 4 }}>Favorilerim</h1>
              <p style={{ fontSize: 13, color: GT, lineHeight: 1.5 }}>
                Beğendiğiniz ürünleri tek yerde saklayın.
              </p>
            </div>
            <span style={{
              fontSize: 11, fontWeight: 700, color: P,
              background: PL, padding: "4px 10px", borderRadius: 999,
              flexShrink: 0, marginTop: 4,
            }}>
              {products.length} ürün
            </span>
          </div>
        </div>

        <div style={{ padding: "10px 12px 0" }}>
          <div style={{ position: "relative" }}>
            <Search size={14} color="#9CA3AF"
              style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              placeholder="Favorilerimde ara..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: "100%", padding: "9px 10px 9px 32px",
                borderRadius: 10, border: `1.5px solid ${GB}`,
                fontSize: 13, fontFamily: "inherit", color: DRK,
                outline: "none", background: "#fff", boxSizing: "border-box",
              }}
              onFocus={e => { e.currentTarget.style.borderColor = P; }}
              onBlur={e => { e.currentTarget.style.borderColor = GB; }}
            />
          </div>
        </div>

        {products.length > 0 && (
          <div style={{ padding: "8px 12px 4px", textAlign: "right" }}>
            <button onClick={selectAll}
              style={{
                background: "none", border: "none",
                fontSize: 12, fontWeight: 600, color: P,
                cursor: "pointer", fontFamily: "inherit",
              }}>
              Tümünü Seç
            </button>
          </div>
        )}

        <div style={{ padding: "4px 12px 0" }}>
          {favLoading ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: GT }}>Yükleniyor…</div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {displayed.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    selected={selected.has(product.id)}
                    onToggleSelect={() => toggleSelect(product.id)}
                    onRemove={() => removeProduct(product.id)}
                    onAddToCart={() => addToCart(product)}
                  />
                ))}
              </div>

              {displayed.length === 0 && (
                <div style={{ textAlign: "center", padding: "40px 0", color: GT }}>
                  <Heart size={40} color="#E5E7EB" style={{ margin: "0 auto 12px" }} />
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                    {products.length === 0 ? "Henüz favori ürün yok" : "Favori ürün bulunamadı"}
                  </div>
                  {products.length === 0 && (
                    <button onClick={() => navigate(`${BASE}/magaza`)}
                      style={{
                        marginTop: 8, background: P, color: "#fff", border: "none",
                        borderRadius: 12, padding: "10px 18px", fontSize: 13, fontWeight: 700,
                        cursor: "pointer", fontFamily: "inherit",
                      }}>
                      Mağazaya Git
                    </button>
                  )}
                </div>
              )}

              {products.length > 0 && (
                <div style={{
                  background: "#fff", borderRadius: 12, border: `1px solid ${GB}`,
                  padding: "10px 12px", marginTop: 12,
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
                }}>
                  <span style={{ fontSize: 12, color: GT, flexShrink: 0 }}>
                    Seçilen: {selected.size}
                  </span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={removeSelected}
                      disabled={selected.size === 0}
                      style={{
                        padding: "7px 12px", borderRadius: 8,
                        border: `1.5px solid ${GB}`, background: "#fff",
                        fontSize: 11, fontWeight: 600, color: GT,
                        cursor: selected.size > 0 ? "pointer" : "default",
                        opacity: selected.size > 0 ? 1 : 0.5,
                        fontFamily: "inherit",
                      }}>
                      Favoriden Çıkar
                    </button>
                    <button
                      onClick={addSelectedToCart}
                      disabled={selected.size === 0}
                      style={{
                        padding: "7px 14px", borderRadius: 8,
                        border: "none", background: P,
                        fontSize: 11, fontWeight: 700, color: "#fff",
                        cursor: selected.size > 0 ? "pointer" : "default",
                        opacity: selected.size > 0 ? 1 : 0.5,
                        fontFamily: "inherit",
                      }}>
                      Sepete Ekle
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {products.length > 0 && (
        <div style={{
          position: "fixed", bottom: 60, left: "50%", transform: "translateX(-50%)",
          width: "100%", maxWidth: "var(--yp-shell-max)",
          background: "#fff", borderTop: `1px solid ${GB}`,
          boxShadow: "0 -4px 16px rgba(0,0,0,0.08)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 16px", zIndex: 50,
          boxSizing: "border-box",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <ShoppingCart size={16} color={P} />
            <span style={{ fontSize: 13, fontWeight: 700, color: DRK }}>
              {products.length} ürün
            </span>
          </div>
          <button
            onClick={addAllToCart}
            style={{
              padding: "10px 22px", borderRadius: 12,
              border: "none", background: P,
              fontSize: 13, fontWeight: 700, color: "#fff",
              cursor: "pointer", fontFamily: "inherit",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = PD; }}
            onMouseLeave={e => { e.currentTarget.style.background = P; }}>
            Tümünü Sepete Ekle
          </button>
        </div>
      )}
    </YPLayout>
  );
}
