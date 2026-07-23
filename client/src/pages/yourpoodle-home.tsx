import React, { useState, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  CreditCard, ChevronRight, Clock, Sparkles, MessageCirclePlus, Heart,
} from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";

/* ── Colors ── */
const P   = "#6200EE";
const PD  = "#3D0099";
const FBG = "#1A0052";
const PL  = "#F3EEFF";
const PB  = "#EDE7FF";
const GT  = "#6B7280";
const GB  = "#E5E7EB";
const GBG = "#F9FAFB";
const BL  = "#2563EB";
const BS  = "#DBEAFE";
const BST = "#1D4ED8";
const HA  = "#EF4444";

/* ── Types ── */
interface YPProduct {
  id: number; name: string; price: number; originalPrice?: number | null;
  img?: string | null; stock: number; isActive: boolean;
}

interface AccessoryProduct {
  id: string; title: string; price: string; image: string; bestseller?: boolean;
}

interface GuideArticle {
  id: string; title: string; description: string; readTime: string; image: string;
}

/* ── Static data ── */
const ACCESSORIES: AccessoryProduct[] = [
  { id:"a1", title:"Lavanta Poodle Elbisesi", price:"549 TL", image:"https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=400&h=400&fit=crop" },
  { id:"a2", title:"Air Mesh Göğüs Tasması",  price:"429 TL", image:"https://images.unsplash.com/photo-1608093273490-9a4a4c4d8661?w=400&h=400&fit=crop", bestseller:true },
  { id:"a3", title:"Köpek Çiş Bezi",          price:"249 TL", image:"https://images.unsplash.com/photo-1544568100-847a948583b9?w=400&h=400&fit=crop" },
  { id:"a4", title:"Poodle Parfümü",           price:"319 TL", image:"https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop" },
  { id:"a5", title:"Buharlı Maşa Tarağı",     price:"399 TL", image:"https://images.unsplash.com/photo-1516734212184-a967f81ad0d2?w=400&h=400&fit=crop" },
  { id:"a6", title:"Göz Yaşı Bakım Losyonu",  price:"289 TL", image:"https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop" },
];

const GUIDES: GuideArticle[] = [
  { id:"g1", title:"Toy Poodle Tuvalet Eğitimi",      description:"Adım adım tuvalet eğitimi rehberi",    readTime:"5 dk", image:"https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=120&h=120&fit=crop" },
  { id:"g2", title:"Doğru Mama Nasıl Seçilir?",       description:"Yaşa ve ihtiyacına uygun mama seçimi", readTime:"4 dk", image:"https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=120&h=120&fit=crop" },
  { id:"g3", title:"Göz Yaşı Lekesi Bakımı",          description:"Günlük bakım önerileri",               readTime:"3 dk", image:"https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=120&h=120&fit=crop" },
  { id:"g4", title:"Tüy Bakımı ve Tarama",             description:"Düğümsüz, temiz ve parlak tüyler",     readTime:"6 dk", image:"https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=120&h=120&fit=crop" },
  { id:"g5", title:"Yavru Poodle Eve İlk Geldiğinde", description:"İlk günlerde sağlıklı başlangıç",      readTime:"7 dk", image:"https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=120&h=120&fit=crop" },
];

/* ── Subcomponents ── */
function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div style={{ position:"fixed", bottom:90, left:"50%", transform:"translateX(-50%)",
                  zIndex:999, pointerEvents:"none", opacity:visible?1:0, transition:"opacity 0.3s ease" }}>
      <div style={{ background:FBG, color:"#fff", padding:"12px 24px", borderRadius:999,
                    fontSize:14, fontWeight:500, whiteSpace:"nowrap", boxShadow:"0 4px 16px rgba(0,0,0,0.25)" }}>
        {message}
      </div>
    </div>
  );
}

function ProductCard({
  title, price, image, installment, bestseller, isFavorite, onToggleFavorite, onAddToCart,
}: {
  title:string; price:string; image:string; installment?:boolean; bestseller?:boolean;
  isFavorite:boolean; onToggleFavorite:()=>void; onAddToCart:()=>void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
      style={{ background:"#fff", borderRadius:12, border:`1px solid ${GB}`,
               boxShadow: hovered ? "0 4px 12px rgba(0,0,0,0.12)" : "0 1px 3px rgba(0,0,0,0.08)",
               padding:12, display:"flex", flexDirection:"column", transition:"box-shadow 0.2s" }}>
      <div style={{ position:"relative", marginBottom:8 }}>
        <div style={{ height:128, background:GBG, borderRadius:8, padding:8,
                      display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
          <img src={image} alt={title} loading="lazy"
            style={{ maxWidth:"100%", maxHeight:"100%", objectFit:"contain" }}
            onError={e => { (e.currentTarget as HTMLImageElement).style.display="none"; }} />
        </div>
        <button aria-label={isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
          onClick={onToggleFavorite}
          style={{ position:"absolute", top:6, right:6, background:"rgba(255,255,255,0.9)", border:"none",
                   borderRadius:"50%", width:28, height:28, display:"flex", alignItems:"center",
                   justifyContent:"center", cursor:"pointer", boxShadow:"0 1px 4px rgba(0,0,0,0.15)" }}>
          <Heart size={15} fill={isFavorite?HA:"none"} color={isFavorite?HA:GT} strokeWidth={1.5} />
        </button>
        {bestseller && (
          <span style={{ position:"absolute", top:6, left:6, background:BS, color:BST,
                         fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:999 }}>Çok Satan</span>
        )}
      </div>
      <div style={{ fontSize:13, fontWeight:600, color:"#111827", lineHeight:1.4, marginBottom:4,
                    display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" as any, overflow:"hidden" }}>
        {title}
      </div>
      {installment && (
        <span style={{ display:"inline-block", background:PB, color:P, fontSize:10, fontWeight:600,
                       padding:"2px 8px", borderRadius:999, marginBottom:6, alignSelf:"flex-start" }}>3 Taksit</span>
      )}
      <div style={{ fontSize:15, fontWeight:700, color:P, marginBottom:8 }}>{price}</div>
      <button aria-label={`${title} sepete ekle`} onClick={onAddToCart}
        style={{ width:"100%", background:P, color:"#fff", fontSize:12, fontWeight:600,
                 padding:"8px 0", borderRadius:8, border:"none", cursor:"pointer",
                 transition:"background 0.15s", fontFamily:"inherit" }}
        onMouseEnter={e=>{e.currentTarget.style.background="#5200CC";}}
        onMouseLeave={e=>{e.currentTarget.style.background=P;}}>
        Sepete Ekle
      </button>
    </div>
  );
}

function GuideListItem({ article, onClick }: { article:GuideArticle; onClick:()=>void }) {
  return (
    <button onClick={onClick}
      style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px",
               borderBottom:`1px solid ${GB}`, cursor:"pointer", background:"none", border:"none",
               width:"100%", textAlign:"left", fontFamily:"inherit", transition:"background 0.15s" }}
      onMouseEnter={e=>{e.currentTarget.style.background=GBG;}}
      onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}>
      <img src={article.image} alt={article.title} loading="lazy" width={56} height={56}
        style={{ width:56, height:56, borderRadius:8, objectFit:"cover", flexShrink:0 }} />
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:13, fontWeight:600, color:"#111827", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{article.title}</div>
        <div style={{ fontSize:11, color:GT, marginTop:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{article.description}</div>
        <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:4 }}>
          <Clock size={12} color="#9CA3AF" />
          <span style={{ fontSize:11, color:"#9CA3AF" }}>{article.readTime}</span>
        </div>
      </div>
      <ChevronRight size={18} color="#9CA3AF" />
    </button>
  );
}

/* ── Main Page ── */
export default function YourPoodleHomePage() {
  const [, navigate] = useLocation();
  const [favorites,  setFavorites]  = useState<Set<string>>(new Set());
  const [toast,      setToast]      = useState({ message:"", visible:false });
  const toastTimer = useRef<ReturnType<typeof setTimeout>|null>(null);

  /* Real products */
  const { data: apiProducts = [] } = useQuery<YPProduct[]>({
    queryKey:["/api/yp-products"], staleTime:5*60*1000,
  });
  const foodProducts = apiProducts.filter(p=>p.isActive&&p.stock>0).slice(0,6);

  const go = (href:string) => navigate(href);

  const showToast = (msg:string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({message:msg,visible:true});
    toastTimer.current = setTimeout(()=>setToast(t=>({...t,visible:false})),3000);
  };

  const toggleFav = (id:string) => {
    setFavorites(prev=>{
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const addApiProductToCart = (p:YPProduct) => {
    try {
      const items = JSON.parse(localStorage.getItem("yp_cart_items")||"[]");
      const idx = items.findIndex((i:any)=>i.id===p.id);
      if(idx>=0) items[idx].qty+=1;
      else items.push({id:p.id,name:p.name,price:p.price,img:p.img,qty:1});
      localStorage.setItem("yp_cart_items",JSON.stringify(items));
      window.dispatchEvent(new Event("storage"));
    } catch {}
    showToast("Sepete eklendi ✓");
  };

  const addAccToCart = (a:AccessoryProduct) => {
    try {
      const items = JSON.parse(localStorage.getItem("yp_cart_items")||"[]");
      const idx = items.findIndex((i:any)=>i.id===a.id);
      if(idx>=0) items[idx].qty+=1;
      else items.push({id:a.id,name:a.title,price:parseInt(a.price),img:a.image,qty:1});
      localStorage.setItem("yp_cart_items",JSON.stringify(items));
      window.dispatchEvent(new Event("storage"));
    } catch {}
    showToast("Sepete eklendi ✓");
  };

  /* Fallback food products when API is empty */
  const foodFallback: YPProduct[] = [
    { id:1, name:"Puppy Tavuklu",     price:799, originalPrice:null, img:null, stock:10, isActive:true },
    { id:2, name:"Adult Kuzu Etli",   price:849, originalPrice:null, img:null, stock:10, isActive:true },
    { id:3, name:"Somonlu Sensitive", price:899, originalPrice:null, img:null, stock:10, isActive:true },
    { id:4, name:"Kısırlaştırılmış",  price:879, originalPrice:null, img:null, stock:10, isActive:true },
    { id:5, name:"Hair & Skin",       price:929, originalPrice:null, img:null, stock:10, isActive:true },
    { id:6, name:"Senior +7",         price:869, originalPrice:null, img:null, stock:10, isActive:true },
  ];
  const displayFood = foodProducts.length > 0 ? foodProducts : foodFallback;

  return (
    <YPLayout activeLink="/yourpoodle" constrain={false}>
      <Toast message={toast.message} visible={toast.visible} />

      <main style={{ paddingBottom:80 }}>

        {/* ── 1. HERO ── */}
        <section style={{ margin:"16px 16px 0" }}>
          <div style={{ background:`linear-gradient(135deg,${P} 0%,${PD} 100%)`, borderRadius:16,
                        overflow:"hidden", position:"relative", minHeight:200, padding:24 }}>
            <div style={{ position:"relative", zIndex:10, maxWidth:"60%" }}>
              <span style={{ display:"inline-block", background:"rgba(255,255,255,0.2)", color:"#fff",
                             fontSize:11, fontWeight:500, padding:"4px 12px", borderRadius:999, marginBottom:12 }}>
                Türkiye'nin en büyük Poodle topluluğu
              </span>
              <h1 style={{ color:"#fff", fontSize:22, fontWeight:700, lineHeight:1.3, margin:"0 0 8px" }}>
                Toy Poodle'ınız için her şey burada.
              </h1>
              <p style={{ color:"rgba(255,255,255,0.8)", fontSize:13, lineHeight:1.6, margin:"0 0 16px" }}>
                Bilgi, alışveriş ve gerçek bir topluluk — tek bir yerde.
              </p>
              <button onClick={() => alert("Topluluğa katılım yakında!")}
                style={{ background:"#fff", color:P, fontWeight:600, fontSize:13, padding:"10px 24px",
                         borderRadius:999, border:"none", cursor:"pointer", fontFamily:"inherit" }}
                onMouseEnter={e=>{e.currentTarget.style.background="#F3F4F6";}}
                onMouseLeave={e=>{e.currentTarget.style.background="#fff";}}>
                Topluluğa Katıl
              </button>
            </div>
            <img src="/images/yp-poodle-hero.png" alt="Toy Poodle" loading="lazy"
              style={{ position:"absolute", right:0, bottom:0, width:144, height:160,
                       objectFit:"cover", objectPosition:"center bottom" }} />
          </div>
        </section>

        {/* ── 2. INSTALLMENT BANNER + FOOD PRODUCTS ── */}
        <section style={{ padding:"24px 16px 0" }}>
          <div style={{ marginBottom:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
              <CreditCard size={18} color={P} />
              <span style={{ fontSize:14, fontWeight:600, color:"#111827" }}>Peşin fiyatına 3 taksit</span>
            </div>
            <p style={{ fontSize:11, color:GT, margin:0, paddingLeft:26 }}>
              Toy Poodle'ınıza özel seçilmiş mamalar
            </p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {displayFood.map((p,i) => (
              <ProductCard key={p.id||i}
                title={p.name}
                price={`${Number(p.price).toLocaleString("tr-TR")} TL`}
                image={p.img||""}
                installment={true}
                isFavorite={favorites.has(String(p.id))}
                onToggleFavorite={() => toggleFav(String(p.id))}
                onAddToCart={() => addApiProductToCart(p)} />
            ))}
          </div>
        </section>

        {/* ── 3. POODLE REHBERİ ── */}
        <section style={{ marginTop:24 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                        padding:"0 16px", marginBottom:8 }}>
            <h2 style={{ fontSize:18, fontWeight:700, color:"#111827", margin:0 }}>Poodle Rehberi</h2>
            <button onClick={() => alert("Tüm rehberler yakında!")}
              style={{ fontSize:13, color:BL, background:"none", border:"none",
                       cursor:"pointer", fontFamily:"inherit" }}>
              Tümünü Gör
            </button>
          </div>
          <div>
            {GUIDES.map(g => (
              <GuideListItem key={g.id} article={g} onClick={() => go("/yourpoodle/rehber")} />
            ))}
          </div>
        </section>

        {/* ── 4. AI ASSISTANT CARD ── */}
        <section style={{ margin:"24px 16px" }}>
          <div style={{ background:PL, borderRadius:16, padding:20, border:`1px dashed #C4B5FD` }}>
            <MessageCirclePlus size={32} color={P} style={{ marginBottom:12 }} />
            <h3 style={{ fontSize:16, fontWeight:700, color:"#111827", margin:"0 0 4px" }}>
              Cevabını hemen bul
            </h3>
            <p style={{ fontSize:13, color:GT, margin:"0 0 16px", lineHeight:1.5 }}>
              Poodle'ınızla ilgili merak ettiğiniz her şeyi sorun.
            </p>
            <button onClick={() => go("/yourpoodle/ai-asistan")}
              style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center",
                       gap:8, background:P, color:"#fff", fontWeight:600, fontSize:13,
                       padding:"12px 0", borderRadius:12, border:"none", cursor:"pointer",
                       fontFamily:"inherit" }}
              onMouseEnter={e=>{e.currentTarget.style.background="#5200CC";}}
              onMouseLeave={e=>{e.currentTarget.style.background=P;}}>
              <Sparkles size={18} />
              AI Asistan'a Sor
            </button>
          </div>
        </section>

        {/* ── 5. POODLE'INIZA ÖZEL ÜRÜNLER ── */}
        <section style={{ marginTop:8, marginBottom:24 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                        padding:"0 16px", marginBottom:12 }}>
            <h2 style={{ fontSize:18, fontWeight:700, color:"#111827", margin:0 }}>
              Poodle'ınıza Özel Ürünler
            </h2>
            <button onClick={() => alert("Tüm ürünler yakında!")}
              style={{ fontSize:13, color:BL, background:"none", border:"none",
                       cursor:"pointer", fontFamily:"inherit" }}>
              Tümünü Gör
            </button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, padding:"0 16px" }}>
            {ACCESSORIES.map(a => (
              <ProductCard key={a.id}
                title={a.title} price={a.price} image={a.image} bestseller={a.bestseller}
                isFavorite={favorites.has(a.id)}
                onToggleFavorite={() => toggleFav(a.id)}
                onAddToCart={() => addAccToCart(a)} />
            ))}
          </div>
        </section>

      </main>
    </YPLayout>
  );
}
