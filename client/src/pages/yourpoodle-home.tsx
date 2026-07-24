import React, { useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useCustomer } from "@/contexts/CustomerContext";
import { IS_YP } from "@/lib/store";
import {
  Bot, BookOpen, MapPin, Utensils, Heart, ShoppingCart,
  ChevronRight, Bookmark, Clock, Star,
} from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";

const BASE = IS_YP ? "" : "/yourpoodle";
const P    = "#7022C4";

/* ── Static fallback products (match design screenshot) ── */
interface StaticProduct {
  id: string; name: string; price: number; rating: number; reviews: number;
  img: string; category: string;
}
const FEATURED_PRODUCTS: StaticProduct[] = [
  {
    id: "2717",
    name: "Pro Plan Small & Mini Puppy Tavuklu 3 Kg",
    price: 699,
    rating: 4.8,
    reviews: 124,
    img: "/product-images/yp-2717.jpg",
    category: "mama",
  },
  {
    id: "2716",
    name: "Royal Canin X-Small Adult Köpek Maması 1.5 Kg",
    price: 529,
    rating: 4.6,
    reviews: 89,
    img: "/product-images/yp-2716.jpg",
    category: "mama",
  },
  {
    id: "2721",
    name: "N&D Quinoa Skin & Coat Köpek Maması 800 g",
    price: 349,
    rating: 4.9,
    reviews: 67,
    img: "/product-images/yp-2721.png",
    category: "mama",
  },
  {
    id: "2737",
    name: "PetKit Havalandırmalı Poodle Sırt Çantası",
    price: 849,
    rating: 4.7,
    reviews: 52,
    img: "/product-images/yp-2737.jpg",
    category: "aksesuar",
  },
];

const TOP_ARTICLES = [
  { slug: "poodle-tuy-bakimi-haftalik-rutin", title: "Toy Poodle Tüy Bakımı Nasıl Yapılır?",       readMin: 5, img: "/images/poodle-avatar-3.jpg" },
  { slug: "toy-poodle-en-iyi-mama-markalari-2026", title: "Poodle Beslenme Rehberi: Doğru Mama Seçimi", readMin: 6, img: "/images/poodle-avatar-1.jpg" },
  { slug: "poodle-goz-yasi-lekesi-temizleme", title: "Gözyaşı Lekeleri Neden Olur ve Nasıl Geçer?", readMin: 4, img: "/images/poodle-avatar-2.jpg" },
];

const COMMUNITY_AVATARS = [
  "/images/poodle-avatar-1.jpg",
  "/images/poodle-avatar-2.jpg",
  "/images/poodle-avatar-3.jpg",
  "/images/poodle-avatar-4.jpg",
];

/* ── Star Rating ── */
function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={12}
          fill={s <= Math.round(rating) ? "#FBBF24" : "none"}
          color={s <= Math.round(rating) ? "#FBBF24" : "#D1D5DB"}
          strokeWidth={1.5} />
      ))}
      <span style={{ fontSize: 11, color: "#6B7280" }}>({reviews})</span>
    </div>
  );
}

/* ── Toast ── */
function Toast({ msg, show }: { msg: string; show: boolean }) {
  return (
    <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)",
                  zIndex:9999, pointerEvents:"none", transition:"opacity 0.3s",
                  opacity: show ? 1 : 0 }}>
      <div style={{ background:"#1F2937", color:"#fff", padding:"10px 22px",
                    borderRadius:999, fontSize:13, fontWeight:600,
                    boxShadow:"0 4px 16px rgba(0,0,0,0.25)", whiteSpace:"nowrap" }}>
        {msg}
      </div>
    </div>
  );
}

/* ── Product Card ── */
function ProductCard({ product, isFav, onFav, onCart }: {
  product: StaticProduct;
  isFav: boolean;
  onFav: () => void;
  onCart: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6",
        boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.12)" : "0 2px 8px rgba(0,0,0,0.06)",
        padding: 12, display: "flex", flexDirection: "column",
        transition: "box-shadow 0.2s, transform 0.2s",
        transform: hovered ? "translateY(-2px)" : "none",
        cursor: "pointer",
      }}>
      {/* Image */}
      <div style={{ position: "relative", marginBottom: 10 }}>
        <div style={{ height: 148, borderRadius: 10, background: "#F9FAFB",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      overflow: "hidden" }}>
          <img src={product.img} alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
        </div>
        <button
          aria-label={isFav ? "Favorilerden çıkar" : "Favorilere ekle"}
          onClick={e => { e.stopPropagation(); onFav(); }}
          style={{ position: "absolute", top: 8, right: 8, background: "rgba(255,255,255,0.92)",
                   border: "none", borderRadius: "50%", width: 32, height: 32,
                   display: "flex", alignItems: "center", justifyContent: "center",
                   cursor: "pointer", boxShadow: "0 2px 6px rgba(0,0,0,0.12)" }}>
          <Heart size={15} fill={isFav ? "#EF4444" : "none"} color={isFav ? "#EF4444" : "#9CA3AF"} strokeWidth={1.8} />
        </button>
      </div>
      {/* Name */}
      <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", lineHeight: 1.45,
                    marginBottom: 4, flex: 1,
                    display: "-webkit-box", WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical" as any, overflow: "hidden" }}>
        {product.name}
      </div>
      {/* Stars */}
      <StarRating rating={product.rating} reviews={product.reviews} />
      {/* Price */}
      <div style={{ fontSize: 17, fontWeight: 800, color: P, marginBottom: 10 }}>
        {product.price.toLocaleString("tr-TR")},00 TL
      </div>
      {/* Add to cart */}
      <button
        onClick={e => { e.stopPropagation(); onCart(); }}
        style={{ width: "100%", background: P, color: "#fff", border: "none",
                 borderRadius: 10, padding: "9px 0", fontSize: 13, fontWeight: 700,
                 cursor: "pointer", fontFamily: "inherit", display: "flex",
                 alignItems: "center", justifyContent: "center", gap: 6,
                 transition: "background 0.15s" }}
        onMouseEnter={e => (e.currentTarget.style.background = "#5A32A3")}
        onMouseLeave={e => (e.currentTarget.style.background = P)}>
        <ShoppingCart size={14} />
        Sepete Ekle
      </button>
    </div>
  );
}

/* ── Quick Action Card ── */
function QuickCard({ icon: Icon, color, bg, label, desc, href }: {
  icon: typeof Bot; color: string; bg: string;
  label: string; desc: string; href: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link href={href}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6",
          boxShadow: hovered ? "0 8px 20px rgba(0,0,0,0.1)" : "0 2px 8px rgba(0,0,0,0.06)",
          padding: "18px 16px", display: "flex", alignItems: "center", gap: 14,
          cursor: "pointer", transition: "box-shadow 0.2s, transform 0.2s",
          transform: hovered ? "translateY(-2px)" : "none",
        }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: bg,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={22} color={color} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 2 }}>{label}</div>
          <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.4,
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{desc}</div>
        </div>
        <ChevronRight size={16} color="#D1D5DB" />
      </div>
    </Link>
  );
}

/* ════════════ MAIN PAGE ════════════ */
export default function YourPoodleHomePage() {
  const [, navigate] = useLocation();
  const { isLoggedIn } = useCustomer();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState({ msg: "", show: false });
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, show: true });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 2800);
  };

  const toggleFav = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const addToCart = (p: StaticProduct) => {
    try {
      const items = JSON.parse(localStorage.getItem("yp_cart_items") || "[]");
      const idx = items.findIndex((i: any) => i.id === p.id);
      if (idx >= 0) items[idx].qty += 1;
      else items.push({ id: p.id, name: p.name, price: p.price, img: p.img, qty: 1 });
      localStorage.setItem("yp_cart_items", JSON.stringify(items));
      window.dispatchEvent(new Event("storage"));
    } catch {}
    showToast("Ürün sepete eklendi ✓");
  };

  const handleCommunityJoin = () => {
    if (isLoggedIn) navigate(`${BASE}/club`);
    else navigate(`${BASE}/giris`);
  };

  return (
    <YPLayout activeLink={BASE || "/"} constrain={false}>
      <Toast msg={toast.msg} show={toast.show} />

      <style>{`
        /* ── MOBILE ── */
        .yp-home-hero        { background: #F8F5FF; }
        .yp-hero-inner       { display: flex; flex-direction: column; padding: 32px 20px 0; gap: 24px; }
        .yp-hero-left        { }
        .yp-hero-right       { }
        .yp-hero-poodle-box  { border-radius: 16px 16px 0 0; overflow: hidden; }
        .yp-hero-img         {
          width: 100%; height: 260px;
          object-fit: contain; object-position: bottom center; display: block;
        }
        .yp-floating-cards   { display: none; }
        .yp-quick-row        { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 20px 16px; }
        .yp-home-main        { padding: 0 16px 40px; }
        .yp-prod-grid-home   { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .yp-sidebar-widgets  { margin-top: 24px; }
        .yp-hero-social      { display: flex; align-items: center; gap: 8px; }

        /* ── DESKTOP (≥900px) ── */
        @media (min-width: 900px) {
          .yp-home-hero      { background: #F3EEFF; }
          .yp-hero-inner     {
            flex-direction: row; align-items: flex-end;
            max-width: 1200px; margin: 0 auto;
            padding: 48px 40px 0; gap: 24px;
          }
          .yp-hero-left      {
            flex: 1; display: flex; flex-direction: column;
            justify-content: center; padding-bottom: 56px;
          }
          .yp-hero-right     {
            flex: 0 0 580px;
            display: flex; align-items: flex-end; gap: 16px;
            overflow: visible; background: none;
          }
          .yp-hero-poodle-box {
            flex: 0 0 340px;
            background: linear-gradient(150deg, #DDD6FE 0%, #C4B5F4 55%, #A78BFA 100%);
            border-radius: 20px 20px 0 0; overflow: hidden;
          }
          .yp-hero-img       {
            width: 100%; height: 420px;
            object-fit: contain; object-position: bottom center; display: block;
          }
          .yp-floating-cards {
            flex: 1; display: flex; flex-direction: column; gap: 12px;
            padding-bottom: 48px;
          }
          .yp-quick-row      { grid-template-columns: repeat(4,1fr); gap: 14px; padding: 24px 40px; max-width: 1200px; margin: 0 auto; }
          .yp-home-main      { max-width: 1200px; margin: 0 auto; padding: 0 40px 60px; display: grid; grid-template-columns: 1fr 300px; gap: 28px; align-items: start; }
          .yp-prod-grid-home { grid-template-columns: repeat(4,1fr); gap: 14px; }
          .yp-sidebar-widgets{ margin-top: 0; }
        }
      `}</style>

      {/* ══════════════════════════════ HERO ══════════════════════════════ */}
      <section className="yp-home-hero">
        <div className="yp-hero-inner">

          {/* LEFT */}
          <div className="yp-hero-left">
            <h1 style={{
              fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 900,
              color: "#1F2937", lineHeight: 1.2, margin: "0 0 14px",
              letterSpacing: "-0.5px",
            }}>
              Toy Poodle'ınız İçin<br />
              <span style={{ color: P }}>Her Şey Tek Yerde</span>
            </h1>
            <p style={{ fontSize: 16, color: "#6B7280", lineHeight: 1.65, margin: "0 0 28px", maxWidth: 420 }}>
              Bakım rehberleri, doğru ürünler ve uzman destekli akıllı asistan.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
              <button onClick={() => navigate(`${BASE}/mama-bul`)}
                style={{ display:"flex", alignItems:"center", gap:8, background:P, color:"#fff",
                         border:"none", borderRadius:12, padding:"13px 24px", fontSize:15,
                         fontWeight:700, cursor:"pointer", fontFamily:"inherit",
                         boxShadow:"0 4px 16px rgba(112,34,196,0.35)" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#5A32A3")}
                onMouseLeave={e => (e.currentTarget.style.background = P)}>
                <Utensils size={18} />
                Mama Bul
              </button>
              <button onClick={() => navigate(`${BASE}/rehber`)}
                style={{ display:"flex", alignItems:"center", gap:8, background:"#fff", color:"#1F2937",
                         border:"2px solid #E5E7EB", borderRadius:12, padding:"12px 24px", fontSize:15,
                         fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = P; e.currentTarget.style.color = P; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.color = "#1F2937"; }}>
                <BookOpen size={18} />
                Rehbere Git
              </button>
            </div>

            {/* Social proof */}
            <div className="yp-hero-social">
              <div style={{ display: "flex" }}>
                {COMMUNITY_AVATARS.map((src, i) => (
                  <img key={i} src={src} alt="üye"
                    style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid #fff",
                             marginLeft: i === 0 ? 0 : -8, objectFit: "cover" }} />
                ))}
                <div style={{ width:32, height:32, borderRadius:"50%", border:"2px solid #fff",
                              marginLeft:-8, background:P, color:"#fff", fontSize:9, fontWeight:800,
                              display:"flex", alignItems:"center", justifyContent:"center" }}>+9K</div>
              </div>
              <span style={{ fontSize: 13, color: "#6B7280", fontWeight: 600 }}>10.000+ Poodle Ailesi</span>
            </div>
          </div>

          {/* RIGHT — photo + floating cards */}
          <div className="yp-hero-right">
            <div className="yp-hero-poodle-box">
              <img
                src="/images/poodle-hero-transparent.png"
                alt="Toy Poodle"
                className="yp-hero-img"
              />
            </div>

            {/* Floating feature cards */}
            <div className="yp-floating-cards">
              {[
                {
                  icon: Bot, bg: "#EDE9FE", color: "#7022C4",
                  title: "AI Poodle Asistanı",
                  desc: "7/24 uzman destek sorularınıza anında yanıt.",
                  href: `${BASE}/ai-asistan`,
                },
                {
                  icon: Utensils, bg: "#FEF3C7", color: "#D97706",
                  title: "Günlük Mama Hesabı",
                  desc: "Poodle'ınıza özel günlük mama miktarını öğrenin.",
                  href: `${BASE}/araclar/mama-hesaplama`,
                },
              ].map(({ icon: Icon, bg, color, title, desc, href }) => (
                <Link key={href} href={href}>
                  <div style={{
                    background:"rgba(255,255,255,0.96)", backdropFilter:"blur(12px)",
                    borderRadius:14, boxShadow:"0 8px 24px rgba(0,0,0,0.12)",
                    border:"1px solid rgba(255,255,255,0.7)",
                    padding:"12px 16px", display:"flex", alignItems:"center", gap:12,
                    cursor:"pointer", transition:"transform 0.2s",
                  }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "none")}>
                    <div style={{ width:40, height:40, borderRadius:10, background:bg,
                                  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <Icon size={20} color={color} />
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:"#111827", marginBottom:2 }}>{title}</div>
                      <div style={{ fontSize:11, color:"#6B7280", lineHeight:1.4 }}>{desc}</div>
                    </div>
                    <ChevronRight size={14} color="#D1D5DB" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ QUICK ACCESS ══════════════════════════════ */}
      <div style={{ background:"#fff", borderBottom:"1px solid #F3F4F6" }}>
        <div className="yp-quick-row">
          <QuickCard icon={Utensils} color="#7022C4" bg="#F3E8FF" label="Mama Bul"
            desc="Poodle'ınıza en uygun mamayı bulun."
            href={`${BASE}/mama-bul`} />
          <QuickCard icon={Bot} color="#0EA5E9" bg="#E0F2FE" label="AI Asistan"
            desc="Akıllı asistanınıza sorun, anında yanıt alın."
            href={`${BASE}/ai-asistan`} />
          <QuickCard icon={BookOpen} color="#059669" bg="#D1FAE5" label="Poodle Rehberi"
            desc="Bakım, beslenme ve eğitim rehberleri."
            href={`${BASE}/rehber`} />
          <QuickCard icon={MapPin} color="#F97316" bg="#FFEDD5" label="Yakındaki Hizmetler"
            desc="Kuaför, veteriner ve daha fazlası."
            href={`${BASE}/hizmetler`} />
        </div>
      </div>

      {/* ══════════════════════════════ MAIN CONTENT ══════════════════════════════ */}
      <div className="yp-home-main">

        {/* LEFT — Products */}
        <div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
            <h2 style={{ fontSize:20, fontWeight:800, color:"#1F2937", margin:0 }}>
              Poodle'ınız İçin Seçtiklerimiz
            </h2>
            <Link href={`${BASE}/magaza`}>
              <span style={{ fontSize:13, color:P, fontWeight:700, cursor:"pointer",
                             display:"flex", alignItems:"center", gap:4 }}>
                Tümünü Gör <ChevronRight size={14} />
              </span>
            </Link>
          </div>

          <div className="yp-prod-grid-home">
            {FEATURED_PRODUCTS.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                isFav={favorites.has(p.id)}
                onFav={() => toggleFav(p.id)}
                onCart={() => addToCart(p)}
              />
            ))}
          </div>
        </div>

        {/* RIGHT — Sidebar */}
        <div className="yp-sidebar-widgets">

          {/* En Çok Okunanlar */}
          <div style={{ background:"#fff", borderRadius:16, border:"1px solid #F3F4F6",
                        boxShadow:"0 2px 8px rgba(0,0,0,0.06)", overflow:"hidden", marginBottom:20 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                          padding:"16px 16px 12px", borderBottom:"1px solid #F9FAFB" }}>
              <span style={{ fontSize:15, fontWeight:800, color:"#111827" }}>Bugün En Çok Okunanlar</span>
              <Bookmark size={17} color={P} strokeWidth={2} />
            </div>
            {TOP_ARTICLES.map((a, i) => (
              <Link key={a.slug} href={`${BASE}/rehber/bakim/${a.slug}`}>
                <div style={{
                  display:"flex", alignItems:"center", gap:12,
                  padding:"12px 16px", cursor:"pointer",
                  borderBottom: i < TOP_ARTICLES.length - 1 ? "1px solid #F9FAFB" : "none",
                  transition:"background 0.15s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#F9FAFB")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <img src={a.img} alt={a.title}
                    style={{ width:56, height:56, borderRadius:10, objectFit:"cover", flexShrink:0 }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:"#111827", lineHeight:1.4,
                                  marginBottom:4, display:"-webkit-box", WebkitLineClamp:2,
                                  WebkitBoxOrient:"vertical" as any, overflow:"hidden" }}>
                      {a.title}
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                      <Clock size={11} color="#9CA3AF" />
                      <span style={{ fontSize:11, color:"#9CA3AF" }}>{a.readMin} dk okuma</span>
                    </div>
                  </div>
                  <ChevronRight size={15} color="#D1D5DB" />
                </div>
              </Link>
            ))}
          </div>

          {/* Poodle Ailesi Büyüyor */}
          <div style={{ background:"#fff", borderRadius:16, border:"1px solid #F3F4F6",
                        boxShadow:"0 2px 8px rgba(0,0,0,0.06)", padding:20 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
              <Heart size={17} color="#EC4899" fill="#EC4899" />
              <span style={{ fontSize:15, fontWeight:800, color:"#111827" }}>Poodle Ailesi Büyüyor</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:0, marginBottom:12 }}>
              {COMMUNITY_AVATARS.map((src, i) => (
                <img key={i} src={src} alt="üye"
                  style={{ width:34, height:34, borderRadius:"50%", border:"2px solid #fff",
                           marginLeft: i === 0 ? 0 : -8, objectFit:"cover" }} />
              ))}
              <div style={{ width:34, height:34, borderRadius:"50%", border:"2px solid #fff",
                            marginLeft:-8, background:P, color:"#fff", fontSize:9, fontWeight:800,
                            display:"flex", alignItems:"center", justifyContent:"center" }}>+9K</div>
            </div>
            <p style={{ fontSize:13, color:"#6B7280", lineHeight:1.6, margin:"0 0 16px" }}>
              10.000+ üye ile deneyimlerini paylaş, sorularına yanıt bul.
            </p>
            <button onClick={handleCommunityJoin}
              style={{ width:"100%", background:P, color:"#fff", border:"none",
                       borderRadius:12, padding:"11px 0", fontSize:14, fontWeight:700,
                       cursor:"pointer", fontFamily:"inherit",
                       boxShadow:"0 4px 12px rgba(112,34,196,0.3)" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#5A32A3")}
              onMouseLeave={e => (e.currentTarget.style.background = P)}>
              Topluluğa Katıl
            </button>
          </div>

        </div>
      </div>

    </YPLayout>
  );
}
