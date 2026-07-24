import { useState } from "react";
import { Link } from "wouter";
import { Heart, ShoppingCart, Star } from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";

const P = "#7022C4";

const doors = [
  { href: "/magaza",   emoji: "🍖", label: "Mama",       sub: "Poodle'ına özel mama bul",     bg: "#F3F0FF", border: "#C4B5FD", accent: "#7C3AED" },
  { href: "/rehber",   emoji: "📖", label: "Rehber",     sub: "Bakım, sağlık, eğitim",         bg: "#F0FDF4", border: "#86EFAC", accent: "#16A34A" },
  { href: "/mama-bul", emoji: "🤖", label: "AI Asistan", sub: "Anında cevap al",               bg: "#EFF6FF", border: "#93C5FD", accent: "#2563EB" },
  { href: "/hizmetler",emoji: "📍", label: "Hizmet",     sub: "Yakındaki kuaför & klinik",     bg: "#FFF7ED", border: "#FCD34D", accent: "#D97706" },
];

interface Product { id: string; name: string; price: number; rating: number; reviews: number; img: string; }

const PRODUCTS: Product[] = [
  { id: "2717", name: "Pro Plan Small & Mini Puppy Tavuklu 3 Kg",            price: 699, rating: 4.8, reviews: 124, img: "/product-images/yp-2717.jpg"  },
  { id: "2716", name: "Royal Canin X-Small Adult Köpek Maması 1.5 Kg",        price: 529, rating: 4.6, reviews: 89,  img: "/product-images/yp-2716.jpg"  },
  { id: "2721", name: "N&D Quinoa Skin & Coat Köpek Maması 800 g",            price: 349, rating: 4.9, reviews: 67,  img: "/product-images/yp-2721.png"  },
  { id: "2737", name: "PetKit Havalandırmalı Poodle Sırt Çantası",            price: 849, rating: 4.7, reviews: 52,  img: "/product-images/yp-2737.jpg"  },
  { id: "2718", name: "Hill's Science Plan Puppy Small & Mini Tavuklu 3 Kg",  price: 749, rating: 4.7, reviews: 98,  img: "/product-images/yp-2718.jpg"  },
  { id: "2719", name: "Orijen Small Breed Yetişkin Köpek Maması 2 Kg",        price: 899, rating: 4.9, reviews: 43,  img: "/product-images/yp-2719.jpg"  },
  { id: "2720", name: "Acana Light & Fit Küçük Irk Köpek Maması 2 Kg",        price: 769, rating: 4.6, reviews: 31,  img: "/product-images/yp-2720.jpg"  },
  { id: "2722", name: "Brit Care Mini Puppy Lamb & Potato 7 Kg",               price: 459, rating: 4.5, reviews: 61,  img: "/product-images/yp-2722.jpg"  },
];

function Stars({ r, n }: { r: number; n: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 5 }}>
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={11}
          fill={s <= Math.round(r) ? "#FBBF24" : "none"}
          color={s <= Math.round(r) ? "#FBBF24" : "#D1D5DB"} strokeWidth={1.5} />
      ))}
      <span style={{ fontSize: 11, color: "#9CA3AF" }}>({n})</span>
    </div>
  );
}

function ProductCard({ p }: { p: Product }) {
  const [fav, setFav] = useState(false);
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6",
        boxShadow: hov ? "0 8px 24px rgba(0,0,0,0.12)" : "0 2px 8px rgba(0,0,0,0.06)",
        padding: 12, display: "flex", flexDirection: "column",
        transform: hov ? "translateY(-2px)" : "none",
        transition: "box-shadow 0.15s, transform 0.15s",
      }}>
      <div style={{ position: "relative", marginBottom: 10 }}>
        <div style={{ height: 140, borderRadius: 10, background: "#F9FAFB",
                      display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          <img src={p.img} alt={p.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
        </div>
        <button
          onClick={e => { e.stopPropagation(); setFav(f => !f); }}
          style={{ position: "absolute", top: 8, right: 8, background: "rgba(255,255,255,0.92)",
                   border: "none", borderRadius: "50%", width: 30, height: 30,
                   display: "flex", alignItems: "center", justifyContent: "center",
                   cursor: "pointer", boxShadow: "0 2px 6px rgba(0,0,0,0.12)" }}>
          <Heart size={14} fill={fav ? "#EF4444" : "none"} color={fav ? "#EF4444" : "#9CA3AF"} strokeWidth={1.8} />
        </button>
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", lineHeight: 1.4,
                    marginBottom: 4, flex: 1,
                    display: "-webkit-box", WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical" as any, overflow: "hidden" }}>
        {p.name}
      </div>
      <Stars r={p.rating} n={p.reviews} />
      <div style={{ fontSize: 16, fontWeight: 800, color: P, marginBottom: 10 }}>
        {p.price.toLocaleString("tr-TR")},00 TL
      </div>
      <Link href={`/urun/${p.id}`}>
        <button
          style={{ width: "100%", background: P, color: "#fff", border: "none",
                   borderRadius: 10, padding: "9px 0", fontSize: 13, fontWeight: 700,
                   cursor: "pointer", fontFamily: "inherit", display: "flex",
                   alignItems: "center", justifyContent: "center", gap: 6 }}
          onMouseEnter={e => (e.currentTarget.style.background = "#5A32A3")}
          onMouseLeave={e => (e.currentTarget.style.background = P)}>
          <ShoppingCart size={13} />
          Sepete Ekle
        </button>
      </Link>
    </div>
  );
}

export default function YourPoodleV3() {
  return (
    <YPLayout>
      <div style={{ background: "#FAFAFA", minHeight: "100dvh", paddingBottom: 60 }}>

        {/* ── HERO ── */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center",
                      justifyContent: "center", padding: "48px 16px 40px" }}>
          <p style={{ fontSize: 12, color: "#9333EA", fontWeight: 700, letterSpacing: 1.5,
                      textTransform: "uppercase", marginBottom: 10 }}>
            Toy Poodle platformu
          </p>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 50px)", fontWeight: 900, color: "#111",
                       textAlign: "center", lineHeight: 1.15, marginBottom: 8 }}>
            Poodle'ın için ne lazım?
          </h1>
          <p style={{ fontSize: 15, color: "#6B7280", textAlign: "center", marginBottom: 40, maxWidth: 340 }}>
            Bir kez tıkla, hemen başla.
          </p>

          {/* 4 Doors */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                        gap: 14, width: "100%", maxWidth: 680 }}>
            {doors.map(d => (
              <Link key={d.label} href={d.href}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "flex-start",
                  padding: "24px 20px",
                  background: d.bg, border: `2px solid ${d.border}`, borderRadius: 18,
                  textDecoration: "none", cursor: "pointer",
                  transition: "transform 0.12s, box-shadow 0.12s",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
                }}
              >
                <span style={{ fontSize: 36, marginBottom: 12, lineHeight: 1 }}>{d.emoji}</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: d.accent, marginBottom: 4 }}>{d.label}</span>
                <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.4 }}>{d.sub}</span>
                <span style={{ marginTop: 16, fontSize: 12, fontWeight: 700, color: d.accent }}>Gir →</span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── PRODUCTS ── */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111" }}>Öne Çıkan Ürünler</h2>
            <Link href="/magaza" style={{ fontSize: 13, fontWeight: 700, color: P, textDecoration: "none" }}>
              Tümünü Gör →
            </Link>
          </div>
          <div style={{ display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                        gap: 16 }}>
            {PRODUCTS.map(p => <ProductCard key={p.id} p={p} />)}
          </div>
        </div>

      </div>
    </YPLayout>
  );
}
