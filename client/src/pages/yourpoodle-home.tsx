import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useCustomer } from "@/contexts/CustomerContext";
import {
  Menu, X, ShoppingBag, BookOpen, MessageCirclePlus, CreditCard,
  ChevronRight, Clock, Sparkles, Mail, Instagram, Youtube, Music2, Facebook,
  Plus, Minus, Heart, PawPrint,
} from "lucide-react";

/* ── Colors ─────────────────────────────────── */
const P   = "#6200EE";   // primary purple
const PD  = "#3D0099";   // dark purple
const FBG = "#1A0052";   // footer bg
const PL  = "#F3EEFF";   // light purple bg
const PB  = "#EDE7FF";   // badge purple bg
const GT  = "#6B7280";   // gray text
const GB  = "#E5E7EB";   // gray border
const GBG = "#F9FAFB";   // gray light bg
const BL  = "#2563EB";   // blue link
const BS  = "#DBEAFE";   // bestseller badge bg
const BST = "#1D4ED8";   // bestseller text
const HA  = "#EF4444";   // heart active

/* ── Types ──────────────────────────────────── */
interface YPProduct {
  id: number; name: string; price: number; originalPrice?: number | null;
  img?: string | null; stock: number; isActive: boolean;
}

interface AccessoryProduct {
  id: string; title: string; price: string; image: string;
  bestseller?: boolean;
}

interface GuideArticle {
  id: string; title: string; description: string; readTime: string; image: string;
}

/* ── Static data ─────────────────────────────── */
const ACCESSORIES: AccessoryProduct[] = [
  { id:"a1", title:"Lavanta Poodle Elbisesi", price:"549 TL", image:"https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=400&h=400&fit=crop" },
  { id:"a2", title:"Air Mesh Göğüs Tasması",  price:"429 TL", image:"https://images.unsplash.com/photo-1608093273490-9a4a4c4d8661?w=400&h=400&fit=crop", bestseller:true },
  { id:"a3", title:"Köpek Çiş Bezi",          price:"249 TL", image:"https://images.unsplash.com/photo-1544568100-847a948583b9?w=400&h=400&fit=crop" },
  { id:"a4", title:"Poodle Parfümü",           price:"319 TL", image:"https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop" },
  { id:"a5", title:"Buharlı Maşa Tarağı",     price:"399 TL", image:"https://images.unsplash.com/photo-1516734212184-a967f81ad0d2?w=400&h=400&fit=crop" },
  { id:"a6", title:"Göz Yaşı Bakım Losyonu",  price:"289 TL", image:"https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop" },
];

const GUIDES: GuideArticle[] = [
  { id:"g1", title:"Toy Poodle Tuvalet Eğitimi",          description:"Adım adım tuvalet eğitimi rehberi",       readTime:"5 dk",
    image:"https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=120&h=120&fit=crop" },
  { id:"g2", title:"Doğru Mama Nasıl Seçilir?",           description:"Yaşa ve ihtiyacına uygun mama seçimi",    readTime:"4 dk",
    image:"https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=120&h=120&fit=crop" },
  { id:"g3", title:"Göz Yaşı Lekesi Bakımı",              description:"İçin gereksiz alanları için günlük bakım", readTime:"3 dk",
    image:"https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=120&h=120&fit=crop" },
  { id:"g4", title:"Tüy Bakımı ve Tarama",                description:"Düğümsüz, temiz ve parlak tüyler",        readTime:"6 dk",
    image:"https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=120&h=120&fit=crop" },
  { id:"g5", title:"Yavru Poodle Eve İlk Geldiğinde",     description:"İlk günlerde sağlıklı yaşamge geçenler",  readTime:"7 dk",
    image:"https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=120&h=120&fit=crop" },
];

const ACCORDION_ITEMS = [
  { title:"YourPoodle", links:["Hakkımızda","Misyonumuz","Kariyer","Basın"] },
  { title:"Alışveriş",  links:["Tüm Ürünler","Mamalar","Aksesuarlar","Kampanyalar"] },
  { title:"Yardım",     links:["SSS","Kargo & Teslimat","İade & Değişim","İletişim"] },
  { title:"Yasal",      links:["Gizlilik Politikası","Kullanım Koşulları","KVKK","Çerez Politikası"] },
];

/* ── Subcomponents ───────────────────────────── */

function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div style={{
      position:"fixed", bottom:90, left:"50%", transform:"translateX(-50%)",
      zIndex:999, pointerEvents:"none",
      opacity: visible ? 1 : 0,
      transition:"opacity 0.3s ease",
    }}>
      <div style={{ background:FBG, color:"#fff", padding:"12px 24px", borderRadius:999, fontSize:14, fontWeight:500, whiteSpace:"nowrap", boxShadow:"0 4px 16px rgba(0,0,0,0.25)" }}>
        {message}
      </div>
    </div>
  );
}

function ProductCard({
  title, price, image, installment, bestseller, isFavorite, onToggleFavorite, onAddToCart, weight,
}: {
  title:string; price:string; image:string; installment?:boolean; bestseller?:boolean;
  isFavorite:boolean; onToggleFavorite:()=>void; onAddToCart:()=>void; weight?:string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={()=>setHovered(true)}
      onMouseLeave={()=>setHovered(false)}
      style={{ background:"#fff", borderRadius:12, border:`1px solid ${GB}`, boxShadow: hovered ? "0 4px 12px rgba(0,0,0,0.12)" : "0 1px 3px rgba(0,0,0,0.08)", padding:12, display:"flex", flexDirection:"column", transition:"box-shadow 0.2s" }}>
      {/* Image area */}
      <div style={{ position:"relative", marginBottom:8 }}>
        <div style={{ height:128, background:GBG, borderRadius:8, padding:8, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
          <img src={image} alt={title} loading="lazy"
            style={{ maxWidth:"100%", maxHeight:"100%", objectFit:"contain" }}
            onError={e => { (e.currentTarget as HTMLImageElement).style.display="none"; }} />
        </div>
        {/* Heart */}
        <button
          aria-label={isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
          onClick={onToggleFavorite}
          style={{ position:"absolute", top:6, right:6, background:"rgba(255,255,255,0.9)", border:"none", borderRadius:"50%", width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", boxShadow:"0 1px 4px rgba(0,0,0,0.15)" }}>
          <Heart size={15} fill={isFavorite ? HA : "none"} color={isFavorite ? HA : GT} strokeWidth={1.5} />
        </button>
        {/* Bestseller */}
        {bestseller && (
          <span style={{ position:"absolute", top:6, left:6, background:BS, color:BST, fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:999 }}>Çok Satan</span>
        )}
      </div>
      {/* Info */}
      <div style={{ fontSize:13, fontWeight:600, color:"#111827", lineHeight:1.4, marginBottom:4, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" as any, overflow:"hidden" }}>
        {title}
      </div>
      {weight && <div style={{ fontSize:11, color:GT, marginBottom:4 }}>{weight}</div>}
      {installment && (
        <span style={{ display:"inline-block", background:PB, color:P, fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:999, marginBottom:6, alignSelf:"flex-start" }}>3 Taksit</span>
      )}
      <div style={{ fontSize:15, fontWeight:700, color:P, marginBottom:8 }}>{price}</div>
      <button
        aria-label={`${title} sepete ekle`}
        onClick={onAddToCart}
        style={{ width:"100%", background:P, color:"#fff", fontSize:12, fontWeight:600, padding:"8px 0", borderRadius:8, border:"none", cursor:"pointer", transition:"background 0.15s, transform 0.1s", fontFamily:"inherit" }}
        onMouseEnter={e=>{e.currentTarget.style.background="#5200CC";}}
        onMouseLeave={e=>{e.currentTarget.style.background=P;}}
        onMouseDown={e=>{e.currentTarget.style.transform="scale(0.95)";}}
        onMouseUp={e=>{e.currentTarget.style.transform="scale(1)";}}>
        Sepete Ekle
      </button>
    </div>
  );
}

function GuideListItem({ article, onClick }: { article:GuideArticle; onClick:()=>void }) {
  return (
    <button onClick={onClick}
      style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", borderBottom:`1px solid ${GB}`, cursor:"pointer", background:"none", border:"none", width:"100%", textAlign:"left", fontFamily:"inherit", transition:"background 0.15s" }}
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

function AccordionSection({ items }: { items:typeof ACCORDION_ITEMS }) {
  const [open, setOpen] = useState<number|null>(null);
  return (
    <div>
      {items.map((item,i)=>(
        <div key={item.title}>
          <button
            onClick={()=>setOpen(open===i?null:i)}
            style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderTop:`1px solid rgba(255,255,255,0.1)`, background:"none", border:"none", borderTopWidth:1, borderTopStyle:"solid", borderTopColor:"rgba(255,255,255,0.1)", cursor:"pointer", fontFamily:"inherit" }}>
            <span style={{ fontSize:14, fontWeight:500, color:"#fff" }}>{item.title}</span>
            {open===i ? <Minus size={18} color="#fff" /> : <Plus size={18} color="#fff" />}
          </button>
          {open===i && (
            <div style={{ paddingBottom:12, paddingLeft:8, display:"flex", flexDirection:"column", gap:8 }}>
              {item.links.map(link=>(
                <span key={link} style={{ fontSize:13, color:"rgba(255,255,255,0.6)", cursor:"pointer", display:"block" }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="#fff"; (e.currentTarget as HTMLElement).style.textDecoration="underline";}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="rgba(255,255,255,0.6)"; (e.currentTarget as HTMLElement).style.textDecoration="none";}}>
                  {link}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Main Page ───────────────────────────────── */
export default function YourPoodleHomePage() {
  const [, navigate] = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab,  setActiveTab]  = useState("magaza");
  const [favorites,  setFavorites]  = useState<Set<string>>(new Set());
  const [toast,      setToast]      = useState({ message:"", visible:false });
  const [newsEmail,  setNewsEmail]  = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout>|null>(null);
  const { isLoggedIn } = useCustomer();

  /* Real products */
  const { data: apiProducts = [] } = useQuery<YPProduct[]>({
    queryKey:["/api/yp-products"], staleTime:5*60*1000,
  });
  const foodProducts = apiProducts.filter(p=>p.isActive&&p.stock>0).slice(0,6);

  /* SEO */
  useEffect(()=>{
    document.title = "YourPoodle — Toy Poodle Bakım, Mama ve Eğitim Platformu";
  },[]);

  /* Lock body when drawer open */
  useEffect(()=>{
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return ()=>{ document.body.style.overflow=""; };
  },[drawerOpen]);

  const go = (href:string)=>{ navigate(href); setDrawerOpen(false); };

  const showToast = (msg:string)=>{
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({message:msg,visible:true});
    toastTimer.current = setTimeout(()=>setToast(t=>({...t,visible:false})),3000);
  };

  const toggleFav = (id:string)=>{
    setFavorites(prev=>{
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const addApiProductToCart = (p:YPProduct)=>{
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

  const addAccToCart = (a:AccessoryProduct)=>{
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

  const submitNewsletter = ()=>{
    if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsEmail)){
      showToast("Bültene kaydoldunuz ✓");
      setNewsEmail("");
    } else {
      showToast("Geçerli bir e-posta girin");
    }
  };

  /* Tab definitions */
  const TABS = [
    { key:"magaza", label:"Mağaza",     Icon:ShoppingBag     },
    { key:"club",   label:"Club",       Icon:PawPrint        },
    { key:"ai",     label:"AI Asistan", Icon:MessageCirclePlus},
    { key:"rehber", label:"Rehber",     Icon:BookOpen        },
  ];

  /* Fallback food products when API is empty */
  const foodFallback: YPProduct[] = [
    { id:1, name:"Puppy Tavuklu",      price:799,  originalPrice:null, img:null, stock:10, isActive:true },
    { id:2, name:"Adult Kuzu Etli",    price:849,  originalPrice:null, img:null, stock:10, isActive:true },
    { id:3, name:"Somonlu Sensitive",  price:899,  originalPrice:null, img:null, stock:10, isActive:true },
    { id:4, name:"Kısırlaştırılmış",   price:879,  originalPrice:null, img:null, stock:10, isActive:true },
    { id:5, name:"Hair & Skin",        price:929,  originalPrice:null, img:null, stock:10, isActive:true },
    { id:6, name:"Senior +7",          price:869,  originalPrice:null, img:null, stock:10, isActive:true },
  ];
  const displayFood = foodProducts.length > 0 ? foodProducts : foodFallback;

  return (
    <div style={{ fontFamily:"'Inter',-apple-system,sans-serif", background:"#fff", minHeight:"100vh", color:"#111827", maxWidth:480, margin:"0 auto" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin:0; }
        @media (min-width:481px){
          .yp-root { box-shadow: 0 0 40px rgba(0,0,0,0.12); }
        }
      `}</style>

      <Toast message={toast.message} visible={toast.visible} />

      {/* ── Mobile Drawer ──────────────────────────── */}
      {drawerOpen && (
        <div onClick={()=>setDrawerOpen(false)}
          style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:500 }} />
      )}
      <div style={{
        position:"fixed",top:0,left:0,height:"100%",width:288,
        background:"#fff",zIndex:501,
        transform:drawerOpen?"translateX(0)":"translateX(-100%)",
        transition:"transform 0.25s ease",
        boxShadow:"4px 0 24px rgba(0,0,0,0.18)",
        display:"flex",flexDirection:"column",
      }}>
        {/* Drawer top */}
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 16px 14px",borderBottom:`1px solid ${GB}` }}>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <img src="/images/yp-poodle-hero.png" alt="YourPoodle Logo" loading="lazy"
              style={{ width:32,height:32,borderRadius:"50%",objectFit:"cover" }} />
            <span style={{ fontWeight:700,fontSize:16,color:P }}>YourPoodle</span>
          </div>
          <button onClick={()=>setDrawerOpen(false)} aria-label="Menüyü kapat"
            style={{ background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",minWidth:44,minHeight:44 }}>
            <X size={20} color="#374151" />
          </button>
        </div>
        {/* Drawer links */}
        <div style={{ flex:1,overflowY:"auto" }}>
          {[
            {label:"Mağaza",     href:"/yourpoodle/magaza"},
            {label:"Club",       href:"/yourpoodle/topluluk"},
            {label:"AI Asistan", href:"/yourpoodle/ai-asistan"},
            {label:"Rehber",     href:"/yourpoodle/rehber"},
          ].map(l=>(
            <button key={l.href} onClick={()=>{go(l.href);}}
              style={{ display:"block",width:"100%",padding:"14px 20px",fontSize:15,fontWeight:500,color:"#1F2937",background:"none",border:"none",borderBottom:`1px solid ${GB}`,cursor:"pointer",textAlign:"left",fontFamily:"inherit",minHeight:44 }}>
              {l.label}
            </button>
          ))}
        </div>
        {/* Drawer bottom */}
        <div style={{ padding:"16px",borderTop:`1px solid ${GB}`,display:"flex",flexDirection:"column",gap:8 }}>
          <button onClick={()=>go(isLoggedIn?"/hesabim":"/yourpoodle/giris")}
            style={{ width:"100%",padding:"10px 0",fontSize:14,fontWeight:500,color:"#374151",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",textAlign:"center" }}>
            Giriş Yap
          </button>
          <button onClick={()=>go("/yourpoodle/giris")}
            style={{ width:"100%",padding:"12px 0",background:P,color:"#fff",border:"none",borderRadius:999,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>
            Üye Ol
          </button>
        </div>
      </div>

      {/* ── Sticky Header + Tab Nav ────────────────── */}
      <header style={{ position:"sticky",top:0,zIndex:400,background:"#fff" }}>
        {/* Header row */}
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",height:56,padding:"0 16px",borderBottom:`1px solid ${GB}` }}>
          {/* Left: hamburger */}
          <button aria-label="Menü" onClick={()=>setDrawerOpen(true)}
            style={{ background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",minWidth:44,minHeight:44,padding:0 }}>
            <Menu size={22} color="#374151" />
          </button>
          {/* Center: logo */}
          <button onClick={()=>go("/yourpoodle")} aria-label="Ana sayfa"
            style={{ display:"flex",alignItems:"center",gap:8,background:"none",border:"none",cursor:"pointer",padding:0 }}>
            <img src="/images/yp-poodle-hero.png" alt="YourPoodle Logo" loading="lazy"
              style={{ width:40,height:40,borderRadius:"50%",objectFit:"cover" }} />
            <span style={{ fontWeight:700,fontSize:18,color:P }}>YourPoodle</span>
          </button>
          {/* Right: login + join */}
          <div style={{ display:"flex",alignItems:"center",gap:12 }}>
            <button onClick={()=>go(isLoggedIn?"/hesabim":"/yourpoodle/giris")}
              style={{ background:"none",border:"none",cursor:"pointer",fontSize:13,color:"#374151",fontFamily:"inherit",whiteSpace:"nowrap" }}>
              {isLoggedIn ? "Hesabım" : "Giriş Yap"}
            </button>
            <button onClick={()=>go("/yourpoodle/giris")}
              style={{ background:P,color:"#fff",fontSize:13,fontWeight:500,padding:"6px 16px",borderRadius:999,border:"none",cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit",transition:"background 0.15s, transform 0.1s" }}
              onMouseEnter={e=>{e.currentTarget.style.background="#5200CC";}}
              onMouseLeave={e=>{e.currentTarget.style.background=P;}}
              onMouseDown={e=>{e.currentTarget.style.transform="scale(0.95)";}}
              onMouseUp={e=>{e.currentTarget.style.transform="scale(1)";}}>
              Üye Ol
            </button>
          </div>
        </div>
        {/* Tab Navigation */}
        <div style={{ display:"flex",borderBottom:`1px solid ${GB}`,background:"#fff" }}>
          {TABS.map(({key,label,Icon})=>{
            const active = activeTab===key;
            return (
              <button key={key} onClick={()=>setActiveTab(key)}
                style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"10px 0",border:"none",background:"none",cursor:"pointer",fontFamily:"inherit",borderBottom:active?`2px solid ${P}`:"2px solid transparent",color:active?P:"#9CA3AF",fontWeight:active?600:500,transition:"color 0.15s" }}>
                <Icon size={20} />
                <span style={{ fontSize:11 }}>{label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* ── Page content ─────────────────────────── */}
      <main>

        {/* ── 1. HERO ──────────────────────────────── */}
        <section style={{ margin:"16px 16px 0" }}>
          <div style={{ background:`linear-gradient(135deg,${P} 0%,${PD} 100%)`, borderRadius:16, overflow:"hidden", position:"relative", minHeight:200, padding:24 }}>
            {/* Content (max 60% wide) */}
            <div style={{ position:"relative",zIndex:10,maxWidth:"60%" }}>
              {/* Badge */}
              <span style={{ display:"inline-block",background:"rgba(255,255,255,0.2)",color:"#fff",fontSize:11,fontWeight:500,padding:"4px 12px",borderRadius:999,marginBottom:12 }}>
                Türkiye'nin en büyük Poodle topluluğu
              </span>
              {/* H1 */}
              <h1 style={{ color:"#fff",fontSize:22,fontWeight:700,lineHeight:1.3,margin:"0 0 8px" }}>
                Toy Poodle'ınız için her şey burada.
              </h1>
              {/* Subtext */}
              <p style={{ color:"rgba(255,255,255,0.8)",fontSize:13,lineHeight:1.6,margin:"0 0 16px" }}>
                Bilgi, alışveriş ve gerçek bir topluluk — tek bir yerde.
              </p>
              {/* CTA */}
              <button onClick={()=>alert("Topluluğa katılım yakında!")}
                style={{ background:"#fff",color:P,fontWeight:600,fontSize:13,padding:"10px 24px",borderRadius:999,border:"none",cursor:"pointer",fontFamily:"inherit",transition:"background 0.15s, transform 0.1s" }}
                onMouseEnter={e=>{e.currentTarget.style.background="#F3F4F6";}}
                onMouseLeave={e=>{e.currentTarget.style.background="#fff";}}
                onMouseDown={e=>{e.currentTarget.style.transform="scale(0.95)";}}
                onMouseUp={e=>{e.currentTarget.style.transform="scale(1)";}}>
                Topluluğa Katıl
              </button>
            </div>
            {/* Poodle image */}
            <img src="/images/yp-poodle-hero.png" alt="Toy Poodle" loading="lazy"
              style={{ position:"absolute",right:0,bottom:0,width:144,height:160,objectFit:"cover",objectPosition:"center bottom" }} />
          </div>
        </section>

        {/* ── 2. INSTALLMENT BANNER + FOOD PRODUCTS ─── */}
        <section style={{ padding:"24px 16px 0" }}>
          {/* Banner */}
          <div style={{ marginBottom:12 }}>
            <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:4 }}>
              <CreditCard size={18} color={P} />
              <span style={{ fontSize:14,fontWeight:600,color:"#111827" }}>Peşin fiyatına 3 taksit</span>
            </div>
            <p style={{ fontSize:11,color:GT,margin:0,paddingLeft:26 }}>Toy Poodle'ınıza özel seçilmiş mamalar</p>
          </div>
          {/* 2-col food grid */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
            {displayFood.map((p,i)=>(
              <ProductCard key={p.id||i}
                title={p.name}
                price={`${Number(p.price).toLocaleString("tr-TR")} TL`}
                image={p.img||""}
                installment={true}
                isFavorite={favorites.has(String(p.id))}
                onToggleFavorite={()=>toggleFav(String(p.id))}
                onAddToCart={()=>addApiProductToCart(p)}
              />
            ))}
          </div>
        </section>

        {/* ── 3. POODLE REHBERİ ─────────────────────── */}
        <section style={{ marginTop:24 }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 16px",marginBottom:8 }}>
            <h2 style={{ fontSize:18,fontWeight:700,color:"#111827",margin:0 }}>Poodle Rehberi</h2>
            <button onClick={()=>alert("Tüm rehberler yakında!")}
              style={{ fontSize:13,color:BL,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit" }}>
              Tümünü Gör
            </button>
          </div>
          <div>
            {GUIDES.map(g=>(
              <GuideListItem key={g.id} article={g} onClick={()=>go("/yourpoodle/rehber")} />
            ))}
          </div>
        </section>

        {/* ── 4. AI ASSISTANT CARD ─────────────────── */}
        <section style={{ margin:"24px 16px" }}>
          <div style={{ background:PL,borderRadius:16,padding:20,border:`1px dashed #C4B5FD` }}>
            <MessageCirclePlus size={32} color={P} style={{ marginBottom:12 }} />
            <h3 style={{ fontSize:16,fontWeight:700,color:"#111827",margin:"0 0 4px" }}>Cevabını hemen bul</h3>
            <p style={{ fontSize:13,color:GT,margin:"0 0 16px",lineHeight:1.5 }}>Poodle'ınızla ilgili merak ettiğiniz her şeyi sorun.</p>
            <button onClick={()=>go("/yourpoodle/ai-asistan")}
              style={{ width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:P,color:"#fff",fontWeight:600,fontSize:13,padding:"12px 0",borderRadius:12,border:"none",cursor:"pointer",fontFamily:"inherit",transition:"background 0.15s, transform 0.1s" }}
              onMouseEnter={e=>{e.currentTarget.style.background="#5200CC";}}
              onMouseLeave={e=>{e.currentTarget.style.background=P;}}
              onMouseDown={e=>{e.currentTarget.style.transform="scale(0.95)";}}
              onMouseUp={e=>{e.currentTarget.style.transform="scale(1)";}}>
              <Sparkles size={18} />
              AI Asistan'a Sor
            </button>
          </div>
        </section>

        {/* ── 5. POODLE'INIZA ÖZEL ÜRÜNLER ─────────── */}
        <section style={{ marginTop:8,marginBottom:24 }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 16px",marginBottom:12 }}>
            <h2 style={{ fontSize:18,fontWeight:700,color:"#111827",margin:0 }}>Poodle'ınıza Özel Ürünler</h2>
            <button onClick={()=>alert("Tüm ürünler yakında!")}
              style={{ fontSize:13,color:BL,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit" }}>
              Tümünü Gör
            </button>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,padding:"0 16px" }}>
            {ACCESSORIES.map(a=>(
              <ProductCard key={a.id}
                title={a.title}
                price={a.price}
                image={a.image}
                bestseller={a.bestseller}
                isFavorite={favorites.has(a.id)}
                onToggleFavorite={()=>toggleFav(a.id)}
                onAddToCart={()=>addAccToCart(a)}
              />
            ))}
          </div>
        </section>

        {/* ── 6. FOOTER ─────────────────────────────── */}
        <footer style={{ background:FBG,color:"#fff",padding:"32px 16px 24px" }}>

          {/* Newsletter */}
          <div style={{ marginBottom:24 }}>
            <h3 style={{ fontSize:15,fontWeight:600,margin:"0 0 12px" }}>Poodle dünyasından haberdar olun</h3>
            <p style={{ fontSize:12,color:"rgba(255,255,255,0.6)",margin:"0 0 12px",lineHeight:1.5 }}>
              Yeni rehberler, kampanyalar ve özel fırsatlar e-postanıza gelsin.
            </p>
            <div style={{ display:"flex" }}>
              <input type="email" value={newsEmail} onChange={e=>setNewsEmail(e.target.value)}
                placeholder="E-posta adresiniz"
                style={{ flex:1,background:"#fff",color:"#111827",borderRadius:"999px 0 0 999px",padding:"10px 16px",fontSize:13,border:"none",outline:"none",fontFamily:"inherit" }} />
              <button onClick={submitNewsletter}
                style={{ background:P,color:"#fff",fontWeight:600,fontSize:13,padding:"10px 20px",borderRadius:"0 999px 999px 0",border:"none",cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",transition:"background 0.15s" }}
                onMouseEnter={e=>{e.currentTarget.style.background="#5200CC";}}
                onMouseLeave={e=>{e.currentTarget.style.background=P;}}>
                Üye Ol
              </button>
            </div>
            <p style={{ fontSize:10,color:"rgba(255,255,255,0.4)",margin:"8px 0 0" }}>
              Üye olarak KVKK Aydınlatma Metni'ni kabul etmiş olursunuz.
            </p>
          </div>

          {/* Branding */}
          <div style={{ marginBottom:24 }}>
            <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
              <img src="/images/yp-poodle-hero.png" alt="YourPoodle" loading="lazy"
                style={{ width:32,height:32,borderRadius:"50%",objectFit:"cover" }} />
              <span style={{ fontWeight:700,fontSize:15 }}>YourPoodle</span>
            </div>
            <p style={{ fontSize:13,color:"rgba(255,255,255,0.7)",margin:0,lineHeight:1.6 }}>
              Toy Poodle sahipleri için bilgi, alışveriş ve topluluk platformu.
            </p>
          </div>

          {/* Accordion */}
          <AccordionSection items={ACCORDION_ITEMS} />

          {/* Contact */}
          <div style={{ marginTop:16,display:"flex",flexDirection:"column",gap:8 }}>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              <Mail size={16} color="rgba(255,255,255,0.7)" />
              <span style={{ fontSize:13,color:"rgba(255,255,255,0.7)" }}>destek@yourpoodle.com</span>
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              <Clock size={16} color="rgba(255,255,255,0.7)" />
              <span style={{ fontSize:13,color:"rgba(255,255,255,0.7)" }}>Pzt–Cmt 09:00 – 18:00</span>
            </div>
          </div>

          {/* Social */}
          <div style={{ marginTop:20 }}>
            <p style={{ fontSize:13,fontWeight:600,margin:"0 0 12px" }}>Bizi Takip Edin</p>
            <div style={{ display:"flex",gap:16,alignItems:"center" }}>
              {[
                { Icon:Instagram, label:"Instagram" },
                { Icon:Youtube,   label:"YouTube"   },
                { Icon:Music2,    label:"TikTok"    },
                { Icon:Facebook,  label:"Facebook"  },
              ].map(({Icon,label})=>(
                <a key={label} href="#" aria-label={label}
                  style={{ color:"rgba(255,255,255,0.7)",cursor:"pointer",transition:"color 0.15s" }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="#fff";}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="rgba(255,255,255,0.7)";}}>
                  <Icon size={22} />
                </a>
              ))}
            </div>
          </div>

          {/* Trust badges */}
          <div style={{ marginTop:20 }}>
            <p style={{ fontSize:11,color:"rgba(255,255,255,0.5)",margin:"0 0 8px" }}>🔒 SSL Güvenli Alışveriş</p>
            <div style={{ display:"flex",gap:8 }}>
              {["VISA","Mastercard","TROY"].map(b=>(
                <span key={b} style={{ background:"#fff",color:"#374151",fontSize:11,fontWeight:700,padding:"4px 8px",borderRadius:4 }}>{b}</span>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div style={{ marginTop:20,paddingTop:16,borderTop:"1px solid rgba(255,255,255,0.1)" }}>
            <p style={{ fontSize:11,color:"rgba(255,255,255,0.5)",margin:"0 0 8px" }}>
              © 2025 YourPoodle. Tüm hakları saklıdır.
            </p>
            <div style={{ display:"flex",gap:12 }}>
              {["Gizlilik","Çerezler","KVKK"].map(l=>(
                <span key={l} style={{ fontSize:11,color:"rgba(255,255,255,0.5)",cursor:"pointer",transition:"color 0.15s" }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="#fff";}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="rgba(255,255,255,0.5)";}}>
                  {l}
                </span>
              ))}
            </div>
          </div>

        </footer>

      </main>
    </div>
  );
}
