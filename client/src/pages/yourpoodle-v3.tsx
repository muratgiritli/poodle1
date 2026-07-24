import { useState } from "react";
import { Link } from "wouter";
import { Heart, ShoppingCart, Star, ArrowRight } from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";

const PURPLE = "#6C27BE";
const PURPLE_DARK = "#4A1A8A";

/* ── 4 Navigation Doors ── */
const DOORS = [
  { href: "/magaza",    icon: "🍖", label: "Mama",       desc: "Poodle'ına özel",   color: "#7C3AED", light: "#F5F0FF" },
  { href: "/rehber",    icon: "📖", label: "Rehber",     desc: "Bakım & sağlık",    color: "#059669", light: "#ECFDF5" },
  { href: "/mama-bul",  icon: "✨", label: "AI Asistan", desc: "Anında cevap",      color: "#2563EB", light: "#EFF6FF" },
  { href: "/hizmetler", icon: "📍", label: "Hizmetler",  desc: "Yakın esnaf",       color: "#DC2626", light: "#FFF1F1" },
];

/* ── 8 Products ── */
interface Product { id: string; name: string; brand: string; price: number; oldPrice?: number; rating: number; reviews: number; img: string; badge?: string; }

const PRODUCTS: Product[] = [
  { id: "2717", name: "Small & Mini Puppy Tavuklu",        brand: "Pro Plan",   price: 699, oldPrice: 849, rating: 4.8, reviews: 124, img: "/product-images/yp-2717.jpg",  badge: "Çok Satan"  },
  { id: "2716", name: "X-Small Adult Köpek Maması 1.5 Kg", brand: "Royal Canin",price: 529,               rating: 4.6, reviews: 89,  img: "/product-images/yp-2716.jpg"                       },
  { id: "2721", name: "Quinoa Skin & Coat 800 g",          brand: "N&D",        price: 349, oldPrice: 429, rating: 4.9, reviews: 67,  img: "/product-images/yp-2721.png",  badge: "Yeni"       },
  { id: "2737", name: "Havalandırmalı Sırt Çantası",       brand: "PetKit",     price: 849,               rating: 4.7, reviews: 52,  img: "/product-images/yp-2737.jpg"                       },
  { id: "2718", name: "Puppy Small & Mini Tavuklu 3 Kg",   brand: "Hill's",     price: 749,               rating: 4.7, reviews: 98,  img: "/product-images/yp-2718.jpg"                       },
  { id: "2719", name: "Small Breed Yetişkin Maması 2 Kg",  brand: "Orijen",     price: 899, oldPrice: 999, rating: 4.9, reviews: 43,  img: "/product-images/yp-2719.jpg",  badge: "Premium"    },
  { id: "2720", name: "Light & Fit Küçük Irk Maması 2 Kg", brand: "Acana",      price: 769,               rating: 4.6, reviews: 31,  img: "/product-images/yp-2720.jpg"                       },
  { id: "2722", name: "Mini Puppy Lamb & Potato 7 Kg",     brand: "Brit Care",  price: 459,               rating: 4.5, reviews: 61,  img: "/product-images/yp-2722.jpg"                       },
];

function Stars({ r, n }: { r: number; n: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={11}
          fill={s <= Math.round(r) ? "#FBBF24" : "none"}
          color={s <= Math.round(r) ? "#FBBF24" : "#D1D5DB"} strokeWidth={1.5} />
      ))}
      <span style={{ fontSize: 11, color: "#9CA3AF", marginLeft: 2 }}>{n}</span>
    </div>
  );
}

function ProductCard({ p }: { p: Product }) {
  const [fav, setFav] = useState(false);
  const [hov, setHov] = useState(false);
  const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : null;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#fff",
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: hov ? "0 20px 60px rgba(108,39,190,0.15)" : "0 4px 20px rgba(0,0,0,0.07)",
        transform: hov ? "translateY(-6px)" : "none",
        transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
      }}>

      {/* Image area — full square */}
      <div style={{ position: "relative", background: "#F8F7FF", aspectRatio: "1/1", overflow: "hidden" }}>
        <img
          src={p.img} alt={p.name}
          style={{ width: "100%", height: "100%", objectFit: "contain", padding: 12,
                   transform: hov ? "scale(1.06)" : "scale(1)", transition: "transform 0.35s ease" }}
          onError={e => {
            const el = e.target as HTMLImageElement;
            el.src = `https://placehold.co/400x400/F5F0FF/7C3AED?text=${encodeURIComponent(p.brand)}`;
          }}
        />
        {/* Fav button */}
        <button
          onClick={e => { e.stopPropagation(); setFav(f => !f); }}
          style={{
            position: "absolute", top: 10, right: 10,
            background: "#fff", border: "none", borderRadius: "50%",
            width: 34, height: 34, display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer",
            boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
          }}>
          <Heart size={15} fill={fav ? "#EF4444" : "none"} color={fav ? "#EF4444" : "#9CA3AF"} strokeWidth={2} />
        </button>
        {/* Badge */}
        {p.badge && (
          <div style={{
            position: "absolute", top: 10, left: 10,
            background: PURPLE, color: "#fff",
            fontSize: 10, fontWeight: 800, letterSpacing: 0.5,
            padding: "4px 10px", borderRadius: 99,
          }}>{p.badge}</div>
        )}
        {/* Discount */}
        {discount && (
          <div style={{
            position: "absolute", bottom: 10, left: 10,
            background: "#EF4444", color: "#fff",
            fontSize: 11, fontWeight: 800,
            padding: "3px 8px", borderRadius: 99,
          }}>−{discount}%</div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "14px 14px 16px", display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: PURPLE, textTransform: "uppercase", letterSpacing: 0.8 }}>{p.brand}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", lineHeight: 1.4,
                      display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any, overflow: "hidden" }}>
          {p.name}
        </div>
        <Stars r={p.rating} n={p.reviews} />
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 2 }}>
          <span style={{ fontSize: 18, fontWeight: 900, color: "#111" }}>
            {p.price.toLocaleString("tr-TR")} TL
          </span>
          {p.oldPrice && (
            <span style={{ fontSize: 12, color: "#9CA3AF", textDecoration: "line-through" }}>
              {p.oldPrice.toLocaleString("tr-TR")} TL
            </span>
          )}
        </div>
        <Link href={`/urun/${p.id}`}>
          <button style={{
            marginTop: 10,
            width: "100%", background: hov ? PURPLE_DARK : PURPLE,
            color: "#fff", border: "none", borderRadius: 12,
            padding: "10px 0", fontSize: 13, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            transition: "background 0.2s",
          }}>
            <ShoppingCart size={14} /> Sepete Ekle
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function YourPoodleV3() {
  return (
    <YPLayout>
      <div style={{ background: "#FAFAFA", minHeight: "100dvh" }}>

        {/* ══ HERO ══ */}
        <div style={{
          background: `linear-gradient(135deg, ${PURPLE_DARK} 0%, ${PURPLE} 60%, #9B59B6 100%)`,
          padding: "56px 24px 52px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* bg circles */}
          <div style={{ position: "absolute", top: -60, right: -60, width: 280, height: 280,
                        borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -80, left: -40, width: 220, height: 220,
                        borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
              borderRadius: 99, padding: "6px 16px", marginBottom: 20,
            }}>
              <span style={{ fontSize: 16 }}>🐩</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.95)", letterSpacing: 1, textTransform: "uppercase" }}>
                Toy Poodle için tasarlandı
              </span>
            </div>

            <h1 style={{
              fontSize: "clamp(32px, 6vw, 58px)", fontWeight: 900, color: "#fff",
              lineHeight: 1.1, marginBottom: 16, letterSpacing: -1,
            }}>
              Poodle'ın için<br />ne lazım?
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.80)", marginBottom: 0 }}>
              10 saniyede doğru yere git.
            </p>
          </div>
        </div>

        {/* ══ 4 DOORS ══ */}
        <div style={{ maxWidth: 1000, margin: "-28px auto 0", padding: "0 20px 0", position: "relative", zIndex: 2 }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 14,
          }}>
            {DOORS.map(d => (
              <Link key={d.label} href={d.href}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  textAlign: "center", padding: "24px 16px 20px",
                  background: "#fff", borderRadius: 20,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
                  textDecoration: "none", cursor: "pointer",
                  border: "2px solid transparent",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = d.color;
                  el.style.transform = "translateY(-4px)";
                  el.style.boxShadow = `0 16px 40px ${d.color}25`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "transparent";
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "0 8px 32px rgba(0,0,0,0.10)";
                }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: d.light, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 26, marginBottom: 12,
                }}>
                  {d.icon}
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#111", marginBottom: 4 }}>{d.label}</div>
                <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 14 }}>{d.desc}</div>
                <div style={{
                  display: "flex", alignItems: "center", gap: 4,
                  fontSize: 12, fontWeight: 700, color: d.color,
                }}>
                  Gir <ArrowRight size={13} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ══ PRODUCTS ══ */}
        <div style={{ maxWidth: 1100, margin: "52px auto 60px", padding: "0 20px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28 }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: PURPLE, textTransform: "uppercase",
                          letterSpacing: 1.2, marginBottom: 6 }}>Seçilmiş ürünler</p>
              <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 900, color: "#111", lineHeight: 1.1 }}>
                Poodle'lara özel<br />en çok satanlar
              </h2>
            </div>
            <Link href="/magaza"
              style={{
                display: "flex", alignItems: "center", gap: 6,
                fontSize: 13, fontWeight: 700, color: PURPLE, textDecoration: "none",
                background: "#F5F0FF", padding: "10px 18px", borderRadius: 12,
                whiteSpace: "nowrap",
              }}>
              Tümü <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 20,
          }}>
            {PRODUCTS.map(p => <ProductCard key={p.id} p={p} />)}
          </div>
        </div>

      </div>
    </YPLayout>
  );
}
