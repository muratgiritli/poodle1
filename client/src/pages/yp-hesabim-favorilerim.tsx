// Route: /hesabim/favoriler
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft, Search, SlidersHorizontal, ArrowUpDown,
  Heart, Package, Bell, RotateCcw, ShoppingCart,
} from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { useCustomer } from "@/contexts/CustomerContext";

/* ─── Palette ─────────────────────────── */
const P   = "#4B2BD6";
const PD  = "#3E27B3";
const PL  = "#F5F0E6";
const GB  = "#E5E7EB";
const GBG = "#F9FAFB";
const GT  = "#6B7280";
const DRK = "#111827";

/* ─── Mock Data ───────────────────────── */
interface Product {
  id: number;
  brand: string;
  name: string;
  oldPrice: number;
  price: number;
  stock: "stokta" | "az" | "tukendi";
  img: string;
  selected?: boolean;
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    brand: "Pro Plan",
    name: "Small Adult Sensitive Somonlu 3 kg",
    oldPrice: 1599,
    price: 1349,
    stock: "stokta",
    img: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=200&h=200&fit=crop",
  },
  {
    id: 2,
    brand: "Royal Canin",
    name: "Mini Adult Yetişkin 2 kg",
    oldPrice: 1249,
    price: 1049,
    stock: "stokta",
    img: "https://images.unsplash.com/photo-1601758177266-bc599de87707?w=200&h=200&fit=crop",
  },
  {
    id: 3,
    brand: "Simple Solution",
    name: "Yarı Köpek Çiş Pedi 30'lu",
    oldPrice: 649,
    price: 449,
    stock: "stokta",
    img: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=200&h=200&fit=crop",
  },
  {
    id: 4,
    brand: "Pawise",
    name: "Air Mesh Göğüs Taşıması",
    oldPrice: 529,
    price: 429,
    stock: "az",
    img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=200&h=200&fit=crop",
  },
  {
    id: 5,
    brand: "YourPoodle",
    name: "Yavru Köpek Elbisesi",
    oldPrice: 649,
    price: 549,
    stock: "stokta",
    img: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&h=200&fit=crop",
  },
  {
    id: 6,
    brand: "YourPoodle",
    name: "Buharlı Masaj Tarağı",
    oldPrice: 499,
    price: 399,
    stock: "stokta",
    img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop",
  },
  {
    id: 7,
    brand: "Beaphar",
    name: "Göz Yaşı Bakım Losyonu",
    oldPrice: 349,
    price: 289,
    stock: "stokta",
    img: "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=200&h=200&fit=crop",
  },
  {
    id: 8,
    brand: "Flamingo",
    name: "Köpek Dışkı Poşeti 8 Rulo",
    oldPrice: 249,
    price: 189,
    stock: "tukendi",
    img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop",
  },
];

const RECENTLY_REMOVED = [
  { id: 101, name: "Pawise Çift Taraflı Fırça", sub: "Küçük Irk" },
  { id: 102, name: "TropiClean Ağız ve Diş Bakım Spreyi", sub: "237 ml" },
];

const SUB_TABS = [
  { key: "urunler", label: "Ürünler", count: 18 },
  { key: "rehber",  label: "Rehber",  count: 5  },
  { key: "club",    label: "Club",    count: 4  },
  { key: "listeler",label: "Listeler",count: 1  },
];

/* ─── Helpers ─────────────────────────── */
function fmt(n: number) {
  return n.toLocaleString("tr-TR");
}

function StockBadge({ stock }: { stock: Product["stock"] }) {
  if (stock === "stokta") return (
    <span style={{ fontSize: 10, fontWeight: 600, color: "#16A34A" }}>Stokta</span>
  );
  if (stock === "az") return (
    <span style={{ fontSize: 10, fontWeight: 600, color: "#EA580C" }}>Son 3 ürün</span>
  );
  return (
    <span style={{ fontSize: 10, fontWeight: 600, color: "#EF4444" }}>Tükendi</span>
  );
}

/* ─── Product Card ────────────────────── */
function ProductCard({
  product, selected, onToggleSelect, onRemove,
}: {
  product: Product;
  selected: boolean;
  onToggleSelect: () => void;
  onRemove: () => void;
}) {
  const sold = product.stock === "tukendi";

  return (
    <div style={{
      background: "#fff", borderRadius: 14,
      border: `1.5px solid ${selected ? P : GB}`,
      overflow: "hidden", display: "flex", flexDirection: "column",
      transition: "border-color 0.15s",
    }}>
      {/* Image + checkbox + heart */}
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

        <Heart size={16} fill={P} color={P} style={{ position: "absolute", top: 8, right: 8, zIndex: 2, cursor: "pointer" }} />

        <img
          src={product.img}
          alt={product.name}
          style={{
            width: "100%", aspectRatio: "1", objectFit: "cover",
            opacity: sold ? 0.5 : 1,
          }}
        />
      </div>

      {/* Info */}
      <div style={{ padding: "8px 8px 0" }}>
        <div style={{ fontSize: 10, color: GT, fontWeight: 500, marginBottom: 2 }}>
          Marka: {product.brand}
        </div>
        <div style={{
          fontSize: 12, fontWeight: 600, color: DRK, lineHeight: 1.3, marginBottom: 4,
          overflow: "hidden", display: "-webkit-box",
          WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any,
        }}>
          {product.name}
        </div>

        {/* Pricing */}
        <div style={{ marginBottom: 4 }}>
          <span style={{ fontSize: 10, color: "#9CA3AF", textDecoration: "line-through", display: "block" }}>
            {fmt(product.oldPrice)} TL
          </span>
          <span style={{ fontSize: 15, fontWeight: 800, color: P }}>
            {fmt(product.price)} TL
          </span>
        </div>

        {/* Stock */}
        <div style={{ marginBottom: 4 }}>
          <StockBadge stock={product.stock} />
        </div>

        {/* Taksit */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
          <Package size={11} color={GT} />
          <span style={{ fontSize: 10, color: GT }}>Taksit</span>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: "0 8px 8px", marginTop: "auto" }}>
        {sold ? (
          <button style={{
            width: "100%", padding: "9px 0", borderRadius: 10,
            border: `1.5px solid ${GB}`, background: GBG,
            fontSize: 11, fontWeight: 700, color: GT,
            cursor: "pointer", fontFamily: "inherit",
          }}>
            Gelince Haber Ver
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
          onClick={() => alert(`${product.name} sepete eklendi`)}>
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

/* ─── Main Page ───────────────────────── */
export default function YPHesabimFavorilerimPage() {
  const [, navigate] = useLocation();
  const { isLoggedIn } = useCustomer();
  const [activeTab, setActiveTab] = useState("urunler");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS.map(p => ({ ...p, selected: false })));
  const [recentlyRemoved, setRecentlyRemoved] = useState(RECENTLY_REMOVED);

  useEffect(() => {
    if (isLoggedIn === false) {
      navigate("/yourpoodle/giris?returnTo=/hesabim/favoriler");
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) return null;

  const selectedCount = products.filter(p => p.selected).length;
  const toggleSelect = (id: number) =>
    setProducts(ps => ps.map(p => p.id === id ? { ...p, selected: !p.selected } : p));
  const selectAll = () =>
    setProducts(ps => ps.map(p => ({ ...p, selected: true })));
  const removeProduct = (id: number) =>
    setProducts(ps => ps.filter(p => p.id !== id));
  const removeSelected = () =>
    setProducts(ps => ps.filter(p => !p.selected));

  const displayed = products.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <YPLayout activeLink="" constrain={false}>
      <div style={{
        maxWidth: "var(--yp-shell-max)", margin: "0 auto",
        fontFamily: "'Inter',-apple-system,sans-serif",
        color: DRK, background: GBG, minHeight: "100vh", paddingBottom: 90,
      }}>

        {/* ── BREADCRUMB + TITLE ── */}
        <div style={{ background: "#fff", padding: "14px 16px 12px", borderBottom: `1px solid ${GB}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <button onClick={() => navigate("/hesabim")} aria-label="Geri"
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
              <h1 style={{ fontSize: 22, fontWeight: 700, color: DRK, marginBottom: 4 }}>
                Favorilerim
              </h1>
              <p style={{ fontSize: 13, color: GT, lineHeight: 1.5 }}>
                Beğendiğiniz ürünleri ve içerikleri tek yerde saklayın.
              </p>
            </div>
            <span style={{
              fontSize: 11, fontWeight: 700, color: P,
              background: PL, padding: "4px 10px", borderRadius: 999,
              flexShrink: 0, marginTop: 4,
            }}>
              28 kayıt
            </span>
          </div>
        </div>

        {/* ── SUB-TABS ── */}
        <div style={{
          background: "#fff", borderBottom: `1px solid ${GB}`,
          display: "flex", overflowX: "auto",
          scrollbarWidth: "none",
        }}>
          {SUB_TABS.map(tab => {
            const active = activeTab === tab.key;
            return (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                style={{
                  flexShrink: 0, padding: "11px 14px",
                  background: "none", border: "none",
                  borderBottom: active ? `2px solid ${P}` : "2px solid transparent",
                  cursor: "pointer", fontFamily: "inherit",
                  display: "flex", alignItems: "center", gap: 5,
                }}>
                <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? P : GT }}>
                  {tab.label}
                </span>
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  padding: "1px 6px", borderRadius: 999,
                  background: active ? PL : "#F3F4F6",
                  color: active ? P : GT,
                }}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── SEARCH + FILTER + SORT ── */}
        <div style={{ padding: "10px 12px 0", display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ flex: 1, position: "relative" }}>
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
          <button style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "9px 12px", borderRadius: 10,
            border: `1.5px solid ${GB}`, background: "#fff",
            fontSize: 12, fontWeight: 600, color: GT,
            cursor: "pointer", fontFamily: "inherit",
          }}>
            <SlidersHorizontal size={13} /> Filtrele
          </button>
          <button style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "9px 12px", borderRadius: 10,
            border: `1.5px solid ${GB}`, background: "#fff",
            fontSize: 12, fontWeight: 600, color: GT,
            cursor: "pointer", fontFamily: "inherit",
          }}>
            <ArrowUpDown size={13} /> Sırala
          </button>
        </div>

        {/* ── TÜMÜNÜ SEÇ ── */}
        {activeTab === "urunler" && (
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

        {/* ── PRODUCT GRID ── */}
        {activeTab === "urunler" && (
          <div style={{ padding: "4px 12px 0" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {displayed.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  selected={!!product.selected}
                  onToggleSelect={() => toggleSelect(product.id)}
                  onRemove={() => removeProduct(product.id)}
                />
              ))}
            </div>

            {displayed.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 0", color: GT }}>
                <Heart size={40} color="#E5E7EB" style={{ margin: "0 auto 12px" }} />
                <div style={{ fontSize: 14, fontWeight: 600 }}>Favori ürün bulunamadı</div>
              </div>
            )}

            {/* ── SELECTION BAR ── */}
            <div style={{
              background: "#fff", borderRadius: 12, border: `1px solid ${GB}`,
              padding: "10px 12px", marginTop: 12,
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
            }}>
              <span style={{ fontSize: 12, color: GT, flexShrink: 0 }}>
                Seçilen ürünler: {selectedCount}
              </span>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={removeSelected}
                  disabled={selectedCount === 0}
                  style={{
                    padding: "7px 12px", borderRadius: 8,
                    border: `1.5px solid ${GB}`, background: "#fff",
                    fontSize: 11, fontWeight: 600, color: GT,
                    cursor: selectedCount > 0 ? "pointer" : "default",
                    opacity: selectedCount > 0 ? 1 : 0.5,
                    fontFamily: "inherit",
                  }}>
                  Favoriden Çıkar
                </button>
                <button
                  onClick={() => alert("Seçilenler sepete eklendi")}
                  style={{
                    padding: "7px 14px", borderRadius: 8,
                    border: "none", background: P,
                    fontSize: 11, fontWeight: 700, color: "#fff",
                    cursor: "pointer", fontFamily: "inherit",
                  }}>
                  Tümünü Sepete Ekle
                </button>
              </div>
            </div>

            {/* ── PRICE DROP BANNER ── */}
            <div style={{
              background: "#fff", borderRadius: 14, border: `1px solid ${GB}`,
              padding: "14px 14px", marginTop: 12,
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "#FEF9C3",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Bell size={18} color="#CA8A04" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: DRK, marginBottom: 2 }}>
                  Favorilerinizde 3 ürünün fiyatı düştü!
                </div>
                <div style={{ fontSize: 12, color: GT }}>
                  Toplam 480 TL daha avantajlı.
                </div>
              </div>
              <button
                onClick={() => alert("İndirimler")}
                style={{
                  padding: "8px 14px", borderRadius: 10,
                  border: "none", background: P,
                  fontSize: 12, fontWeight: 700, color: "#fff",
                  cursor: "pointer", fontFamily: "inherit", flexShrink: 0,
                }}>
                İndirimleri Gör
              </button>
            </div>

            {/* ── SON ÇIKARDIKLARINIZ ── */}
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: DRK, marginBottom: 10 }}>
                Son Çıkardıklarınız
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {recentlyRemoved.map(item => (
                  <div key={item.id} style={{
                    background: "#fff", borderRadius: 12, border: `1px solid ${GB}`,
                    padding: "12px 14px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: DRK }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: GT, marginTop: 2 }}>{item.sub}</div>
                    </div>
                    <button
                      onClick={() => setRecentlyRemoved(r => r.filter(x => x.id !== item.id))}
                      style={{
                        display: "flex", alignItems: "center", gap: 5,
                        padding: "7px 14px", borderRadius: 10,
                        border: `1.5px solid ${GB}`, background: "#fff",
                        fontSize: 12, fontWeight: 600, color: DRK,
                        cursor: "pointer", fontFamily: "inherit",
                      }}>
                      <RotateCcw size={12} />
                      Geri Ekle
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Other tabs placeholder */}
        {activeTab !== "urunler" && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: GT }}>
            <Heart size={40} color="#E5E7EB" style={{ margin: "0 auto 12px" }} />
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
              {SUB_TABS.find(t => t.key === activeTab)?.label} favorileri
            </div>
            <div style={{ fontSize: 13, color: GT }}>Yakında burada görünecek.</div>
          </div>
        )}

        {/* ── MINI FOOTER ── */}
        <div style={{ margin: "16px 12px 0" }}>
          <div style={{
            background: "#1D1E9B", borderRadius: 16, padding: "20px 16px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 22 }}>🐾</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>YourPoodle</span>
            </div>
            <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
              {["Yardım", "İletişim", "KVKK"].map(link => (
                <a key={link} href="#"
                  style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>
                  {link}
                </a>
              ))}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>
              🔒 256-bit SSL ile güvenli alışveriş
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
              © 2026 YourPoodle
            </div>
          </div>
        </div>
      </div>

      {/* ── STICKY BOTTOM BAR ── */}
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
          onClick={() => alert("Tümü sepete eklendi")}
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
    </YPLayout>
  );
}
