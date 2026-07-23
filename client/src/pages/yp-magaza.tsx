import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useCustomer } from "@/contexts/CustomerContext";
import {
  Menu, X, ChevronRight, ShoppingBag, PawPrint, MessageCirclePlus, BookOpen,
  Package, Droplets, Soup, Candy, Briefcase, Home, ToyBrick, UtensilsCrossed,
  Link, HeartPulse, Scissors, Sparkles, Smile, Baby, Bug, Eye, Wand2,
  Mail, Clock, Instagram, Youtube, Music2, Facebook, Plus, Minus,
  ShieldCheck, Home as HomeIcon, Users, ShoppingCart, Bot,
} from "lucide-react";

/* ── Colors ─────────────────────── */
const P   = "#6200EE";
const PD  = "#3D0099";
const FBG = "#1A0052";
const NL  = "#2D1065"; // newsletter box
const GB  = "#E5E7EB";

/* ── Accent color map ────────────── */
const COLOR_MAP = {
  purple: { bg:"#F3EEFF", border:"#DDD6FE", icon:"#6200EE", chevron:"#6200EE" },
  red:    { bg:"#FEF2F2", border:"#FECACA", icon:"#EF4444", chevron:"#EF4444" },
  teal:   { bg:"#F0FDFA", border:"#99F6E4", icon:"#14B8A6", chevron:"#14B8A6" },
  orange: { bg:"#FFF7ED", border:"#FED7AA", icon:"#F97316", chevron:"#F97316" },
  blue:   { bg:"#EFF6FF", border:"#BFDBFE", icon:"#3B82F6", chevron:"#3B82F6" },
  pink:   { bg:"#FDF2F8", border:"#FBCFE8", icon:"#EC4899", chevron:"#EC4899" },
  green:  { bg:"#F0FDF4", border:"#BBF7D0", icon:"#22C55E", chevron:"#22C55E" },
  yellow: { bg:"#FEFCE8", border:"#FEF08A", icon:"#EAB308", chevron:"#EAB308" },
} as const;
type AccentKey = keyof typeof COLOR_MAP;

/* ── Categories ─────────────────── */
interface Cat { id:string; name:string; color:AccentKey; Icon:React.ElementType; slug:string; }

const CATEGORIES: Cat[] = [
  { id:"c1",  name:"Kuru Mama",              color:"purple", Icon:Package,          slug:"kuru-mama"           },
  { id:"c2",  name:"Tuvalet",                color:"red",    Icon:Droplets,         slug:"tuvalet"             },
  { id:"c3",  name:"Yaş Mama",               color:"teal",   Icon:Soup,             slug:"yas-mama"            },
  { id:"c4",  name:"Ödül Çeşitleri",         color:"orange", Icon:Candy,            slug:"odul-cesitleri"      },
  { id:"c5",  name:"Taşıma Çantaları",       color:"blue",   Icon:Briefcase,        slug:"tasima-cantalari"    },
  { id:"c6",  name:"Kulübeler",              color:"pink",   Icon:Home,             slug:"kulubeler"           },
  { id:"c7",  name:"Oyuncaklar",             color:"green",  Icon:ToyBrick,         slug:"oyuncaklar"          },
  { id:"c8",  name:"Mama ve Su Kapları",     color:"purple", Icon:UtensilsCrossed,  slug:"mama-su-kaplari"     },
  { id:"c9",  name:"Bel ve Boyun Tasmaları", color:"orange", Icon:Link,             slug:"bel-boyun-tasmalari" },
  { id:"c10", name:"Bakım ve Sağlık",        color:"teal",   Icon:HeartPulse,       slug:"bakim-saglik"        },
  { id:"c11", name:"Makas ve Taraklar",      color:"yellow", Icon:Scissors,         slug:"makas-taraklar"      },
  { id:"c12", name:"Şampuan ve Parfüm",      color:"blue",   Icon:Sparkles,         slug:"sampuan-parfum"      },
  { id:"c13", name:"Ağız ve Diş Bakımı",    color:"blue",   Icon:Smile,            slug:"agiz-dis-bakimi"     },
  { id:"c14", name:"Süt Tozu ve Biberon",    color:"pink",   Icon:Baby,             slug:"sut-tozu-biberon"    },
  { id:"c15", name:"Bit, Pire ve Parazit",   color:"green",  Icon:Bug,              slug:"bit-pire-parazit"    },
  { id:"c16", name:"Göz ve Kulak Bakımı",    color:"purple", Icon:Eye,              slug:"goz-kulak-bakimi"    },
  { id:"c17", name:"Tıraş Ekipmanları",      color:"yellow", Icon:Wand2,            slug:"tiras-ekipmanlari"   },
];

/* ── Accordion data ─────────────── */
const ACCORDION = [
  { Icon:PawPrint,        title:"YourPoodle", links:["Hakkımızda","Misyonumuz","Kariyer","Basın"] },
  { Icon:ShoppingBag,     title:"Alışveriş",  links:["Tüm Ürünler","Mamalar","Aksesuarlar","Kampanyalar"] },
  { Icon:MessageCirclePlus, title:"Yardım",   links:["SSS","Kargo & Teslimat","İade & Değişim","İletişim"] },
  { Icon:ShieldCheck,     title:"Yasal",      links:["Gizlilik Politikası","Kullanım Koşulları","KVKK","Çerez Politikası"] },
];

/* ── Subcomponents ──────────────── */

function Toast({ message, visible }: { message:string; visible:boolean }) {
  return (
    <div style={{ position:"fixed", bottom:88, left:"50%", transform:"translateX(-50%)", zIndex:999, pointerEvents:"none", opacity:visible?1:0, transition:"opacity 0.3s ease" }}>
      <div style={{ background:FBG, color:"#fff", padding:"12px 24px", borderRadius:999, fontSize:14, fontWeight:500, whiteSpace:"nowrap", boxShadow:"0 4px 16px rgba(0,0,0,0.25)" }}>
        {message}
      </div>
    </div>
  );
}

function CategoryRow({ cat, onClick }: { cat:Cat; onClick:()=>void }) {
  const c = COLOR_MAP[cat.color];
  const [hovered, setHovered] = useState(false);
  return (
    <div
      role="button"
      aria-label={`${cat.name} kategorisine git`}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e=>{ if(e.key==="Enter"||e.key===" ") onClick(); }}
      onMouseEnter={()=>setHovered(true)}
      onMouseLeave={()=>setHovered(false)}
      style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        width:"100%", padding:"12px", marginBottom:8,
        borderRadius:12, border:`1px solid ${c.border}`,
        background:c.bg,
        cursor:"pointer",
        boxShadow: hovered ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
        transform: hovered ? "scale(1.01)" : "scale(1)",
        transition:"all 0.15s ease",
      }}>
      {/* Left */}
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:40, height:40, borderRadius:8, background:"#fff", border:`1px solid ${c.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <cat.Icon size={20} color={c.icon} strokeWidth={1.75} />
        </div>
        <span style={{ fontSize:14, fontWeight:500, color:"#111827" }}>{cat.name}</span>
      </div>
      {/* Right */}
      <ChevronRight size={18} color={c.chevron} />
    </div>
  );
}

function AccordionFooter() {
  const [open, setOpen] = useState<number|null>(null);
  return (
    <div>
      {ACCORDION.map((item,i)=>(
        <div key={item.title}>
          <button
            onClick={()=>setOpen(open===i?null:i)}
            style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 0", borderTop:`1px solid rgba(255,255,255,0.1)`, background:"none", border:"none", borderTopWidth:1, borderTopStyle:"solid", borderTopColor:"rgba(255,255,255,0.1)", cursor:"pointer", fontFamily:"inherit" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <item.Icon size={18} color="rgba(255,255,255,0.8)" />
              <span style={{ fontSize:14, fontWeight:500, color:"#fff" }}>{item.title}</span>
            </div>
            {open===i ? <Minus size={18} color="#fff" /> : <Plus size={18} color="#fff" />}
          </button>
          {open===i && (
            <div style={{ paddingBottom:12, paddingLeft:30, display:"flex", flexDirection:"column", gap:8 }}>
              {item.links.map(l=>(
                <span key={l} style={{ fontSize:14, color:"rgba(255,255,255,0.6)", cursor:"pointer", display:"block", transition:"color 0.15s" }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="#fff"; (e.currentTarget as HTMLElement).style.textDecoration="underline";}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="rgba(255,255,255,0.6)"; (e.currentTarget as HTMLElement).style.textDecoration="none";}}>
                  {l}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Main Page ──────────────────── */
export default function YPMagazaPage() {
  const [, navigate] = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeNav,  setActiveNav]  = useState("magaza");
  const [toast,      setToast]      = useState({ message:"", visible:false });
  const [newsEmail,  setNewsEmail]  = useState("");
  const [cartCount,  setCartCount]  = useState(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout>|null>(null);
  const { isLoggedIn } = useCustomer();

  useEffect(()=>{ document.title = "Mağaza Kategorileri | YourPoodle"; },[]);

  /* Cart counter */
  useEffect(()=>{
    const read = ()=>{
      try {
        const c = JSON.parse(localStorage.getItem("yp_cart_items")||"[]");
        setCartCount(Array.isArray(c)?c.reduce((s:number,i:any)=>s+(i.qty||0),0):0);
      } catch { setCartCount(0); }
    };
    read();
    window.addEventListener("storage",read);
    const t = setInterval(read,500);
    return ()=>{ window.removeEventListener("storage",read); clearInterval(t); };
  },[]);

  useEffect(()=>{
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return ()=>{ document.body.style.overflow=""; };
  },[drawerOpen]);

  const go = (href:string)=>{ navigate(href); setDrawerOpen(false); };

  const showToast = (msg:string)=>{
    if(toastTimer.current) clearTimeout(toastTimer.current);
    setToast({message:msg,visible:true});
    toastTimer.current = setTimeout(()=>setToast(t=>({...t,visible:false})),3000);
  };

  const submitNewsletter = ()=>{
    if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsEmail)){
      showToast("Bültene kaydoldunuz ✓");
      setNewsEmail("");
    } else {
      showToast("Geçerli bir e-posta girin");
    }
  };

  /* Top tabs */
  const TOP_TABS = [
    { key:"magaza", label:"Mağaza",    Icon:ShoppingBag,       href:"/yourpoodle/magaza"    },
    { key:"club",   label:"Club",      Icon:PawPrint,           href:"/yourpoodle/topluluk"  },
    { key:"ai",     label:"AI Asistan",Icon:MessageCirclePlus,  href:"/yourpoodle/ai-asistan"},
    { key:"rehber", label:"Rehber",    Icon:BookOpen,           href:"/yourpoodle/rehber"    },
  ];

  /* Bottom nav tabs */
  const BOT_TABS = [
    { key:"anasayfa", label:"Ana Sayfa", Icon:HomeIcon,     href:"/yourpoodle"            },
    { key:"club",     label:"Club",      Icon:Users,        href:"/yourpoodle/topluluk"   },
    { key:"magaza",   label:"Mağaza",    Icon:ShoppingBag,  href:"/yourpoodle/magaza"     },
    { key:"ai",       label:"AI",        Icon:Bot,          href:"/yourpoodle/ai-asistan" },
  ];

  return (
    <div style={{ fontFamily:"'Inter',-apple-system,sans-serif", background:"#fff", minHeight:"100vh", color:"#111827", maxWidth:480, margin:"0 auto" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing:border-box; }
        body { margin:0; }
      `}</style>

      <Toast message={toast.message} visible={toast.visible} />

      {/* ── Mobile Drawer ── */}
      {drawerOpen && (
        <div onClick={()=>setDrawerOpen(false)}
          style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:500 }} />
      )}
      <div style={{ position:"fixed",top:0,left:0,height:"100%",width:288,background:"#fff",zIndex:501,
        transform:drawerOpen?"translateX(0)":"translateX(-100%)",transition:"transform 0.25s ease",
        boxShadow:"4px 0 24px rgba(0,0,0,0.18)",display:"flex",flexDirection:"column" }}>
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
        <div style={{ flex:1,overflowY:"auto" }}>
          {[
            {label:"Mağaza",     href:"/yourpoodle/magaza"},
            {label:"Club",       href:"/yourpoodle/topluluk"},
            {label:"AI Asistan", href:"/yourpoodle/ai-asistan"},
            {label:"Rehber",     href:"/yourpoodle/rehber"},
          ].map(l=>(
            <button key={l.href} onClick={()=>go(l.href)}
              style={{ display:"block",width:"100%",padding:"14px 20px",fontSize:15,fontWeight:500,color:"#1F2937",background:"none",border:"none",borderBottom:`1px solid ${GB}`,cursor:"pointer",textAlign:"left",fontFamily:"inherit",minHeight:44 }}>
              {l.label}
            </button>
          ))}
        </div>
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

      {/* ── Sticky Header + Top Tab Nav ── */}
      <header style={{ position:"sticky",top:0,zIndex:400,background:"#fff" }}>
        {/* Header row */}
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",height:56,padding:"0 16px",borderBottom:`1px solid ${GB}` }}>
          <button aria-label="Menü" onClick={()=>setDrawerOpen(true)}
            style={{ background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",minWidth:44,minHeight:44,padding:0 }}>
            <Menu size={22} color="#374151" />
          </button>
          <button onClick={()=>go("/yourpoodle")} aria-label="Ana sayfa"
            style={{ display:"flex",alignItems:"center",gap:8,background:"none",border:"none",cursor:"pointer",padding:0 }}>
            <img src="/images/yp-poodle-hero.png" alt="YourPoodle Logo" loading="lazy"
              style={{ width:40,height:40,borderRadius:"50%",objectFit:"cover" }} />
            <span style={{ fontWeight:700,fontSize:18,color:P }}>YourPoodle</span>
          </button>
          <div style={{ display:"flex",alignItems:"center",gap:12 }}>
            <button onClick={()=>go(isLoggedIn?"/hesabim":"/yourpoodle/giris")}
              style={{ background:"none",border:"none",cursor:"pointer",fontSize:13,color:"#374151",fontFamily:"inherit",whiteSpace:"nowrap" }}>
              {isLoggedIn ? "Hesabım" : "Giriş Yap"}
            </button>
            <button onClick={()=>go("/yourpoodle/giris")}
              style={{ background:`linear-gradient(135deg,${P} 0%,#4F46E5 100%)`,color:"#fff",fontSize:13,fontWeight:500,padding:"6px 16px",borderRadius:999,border:"none",cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit",transition:"opacity 0.15s, transform 0.1s" }}
              onMouseEnter={e=>{e.currentTarget.style.opacity="0.9";}}
              onMouseLeave={e=>{e.currentTarget.style.opacity="1";}}
              onMouseDown={e=>{e.currentTarget.style.transform="scale(0.95)";}}
              onMouseUp={e=>{e.currentTarget.style.transform="scale(1)";}}>
              Üye Ol
            </button>
          </div>
        </div>
        {/* Top Tab Navigation */}
        <div style={{ display:"flex",borderBottom:`1px solid ${GB}`,background:"#fff" }}>
          {TOP_TABS.map(({key,label,Icon,href})=>{
            const active = key==="magaza";
            return (
              <button key={key} onClick={()=>go(href)}
                style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"10px 0",border:"none",background:"none",cursor:"pointer",fontFamily:"inherit",
                  borderBottom:active?`2px solid ${P}`:"2px solid transparent",
                  color:active?P:"#9CA3AF",fontWeight:active?600:500,transition:"color 0.15s" }}>
                <Icon size={20} />
                <span style={{ fontSize:11 }}>{label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* ── Main Content ── */}
      <main style={{ padding:"20px 16px 24px", paddingBottom:96 }}>

        {/* Section header */}
        <h1 style={{ fontSize:20,fontWeight:700,color:"#111827",margin:"0 0 4px" }}>Mağaza Kategorileri</h1>
        <p style={{ fontSize:14,color:"#6B7280",margin:"0 0 20px" }}>Poodle'ınız için aradığınız her şey</p>

        {/* 17 category rows */}
        <div style={{ display:"flex",flexDirection:"column" }}>
          {CATEGORIES.map(cat=>(
            <CategoryRow key={cat.id} cat={cat}
              onClick={()=>{
                if(cat.slug==="kuru-mama") navigate("/yourpoodle/kuru-mama");
                else navigate(`/yourpoodle/kategori/${cat.slug}`);
              }} />
          ))}
        </div>

      </main>

      {/* ── Footer ── */}
      <footer style={{ background:FBG,color:"#fff" }}>

        {/* Newsletter box */}
        <div style={{ margin:"0 16px",borderRadius:16,padding:20,background:NL,position:"relative",top:-1 }}>
          <h3 style={{ fontSize:15,fontWeight:600,margin:"0 0 4px" }}>Poodle dünyasından haberdar olun</h3>
          <p style={{ fontSize:13,color:"rgba(255,255,255,0.7)",margin:"0 0 16px",lineHeight:1.5 }}>
            Kampanyalar, yeni ürünler ve Poodle ipuçları e-postanıza gelsin.
          </p>
          <div style={{ display:"flex" }}>
            <input type="email" value={newsEmail} onChange={e=>setNewsEmail(e.target.value)}
              placeholder="E-posta adresiniz"
              style={{ flex:1,background:"#fff",color:"#111827",borderRadius:"999px 0 0 999px",padding:"10px 16px",fontSize:13,border:"none",outline:"none",fontFamily:"inherit" }} />
            <button onClick={submitNewsletter}
              style={{ background:"#4F46E5",color:"#fff",fontWeight:600,fontSize:13,padding:"10px 20px",borderRadius:"0 999px 999px 0",border:"none",cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",transition:"background 0.15s" }}
              onMouseEnter={e=>{e.currentTarget.style.background="#4338CA";}}
              onMouseLeave={e=>{e.currentTarget.style.background="#4F46E5";}}>
              Üye Ol
            </button>
          </div>
          <p style={{ fontSize:11,color:"rgba(255,255,255,0.5)",margin:"8px 0 0" }}>
            Kayıt olarak KVKK Aydınlatma Metni'ni kabul etmiş olursunuz.
          </p>
        </div>

        {/* Branding */}
        <div style={{ padding:"24px 16px 0" }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
            <img src="/images/yp-poodle-hero.png" alt="YourPoodle" loading="lazy"
              style={{ width:32,height:32,borderRadius:"50%",objectFit:"cover" }} />
            <span style={{ fontWeight:700,fontSize:17 }}>YourPoodle</span>
          </div>
          <p style={{ fontSize:13,color:"rgba(255,255,255,0.7)",margin:"0 0 20px",lineHeight:1.6 }}>
            Toy Poodle sahipleri için mutlu ve sağlıklı bir yaşam platformu.
          </p>
        </div>

        {/* Accordion */}
        <div style={{ padding:"0 16px" }}>
          <AccordionFooter />
        </div>

        {/* Contact */}
        <div style={{ padding:"16px 16px 0",display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <Mail size={16} color="rgba(255,255,255,0.7)" />
            <span style={{ fontSize:13,color:"rgba(255,255,255,0.7)" }}>destek@yourpoodle.com</span>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <Clock size={16} color="rgba(255,255,255,0.7)" />
            <span style={{ fontSize:13,color:"rgba(255,255,255,0.7)" }}>Pzt–Cmt 09.00–18.00</span>
          </div>
        </div>

        {/* Social */}
        <div style={{ padding:"24px 16px 0",textAlign:"center" }}>
          <p style={{ fontSize:13,fontWeight:600,margin:"0 0 12px" }}>Bizi Takip Edin</p>
          <div style={{ display:"flex",justifyContent:"center",gap:16 }}>
            {[
              { Icon:Instagram, label:"Instagram" },
              { Icon:Youtube,   label:"YouTube"   },
              { Icon:Music2,    label:"TikTok"    },
              { Icon:Facebook,  label:"Facebook"  },
            ].map(({Icon,label})=>(
              <a key={label} href="#" aria-label={label}
                style={{ width:36,height:36,borderRadius:"50%",border:"1px solid rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",cursor:"pointer",transition:"background 0.15s",textDecoration:"none" }}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.1)";}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="transparent";}}>
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Trust & Payment */}
        <div style={{ padding:"24px 16px 0",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <ShieldCheck size={16} color="rgba(255,255,255,0.6)" />
            <span style={{ fontSize:12,color:"rgba(255,255,255,0.6)" }}>256-bit SSL ile güvenli alışveriş</span>
          </div>
          <div style={{ display:"flex",gap:8 }}>
            {["VISA","Mastercard","TROY"].map(b=>(
              <span key={b} style={{ background:"#fff",color:"#374151",fontSize:11,fontWeight:700,padding:"4px 8px",borderRadius:4 }}>{b}</span>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div style={{ padding:"24px 16px",borderTop:"1px solid rgba(255,255,255,0.1)",marginTop:24 }}>
          <p style={{ fontSize:11,color:"rgba(255,255,255,0.5)",textAlign:"center",margin:"0 0 8px" }}>
            © 2026 YourPoodle. Tüm hakları saklıdır.
          </p>
          <div style={{ display:"flex",justifyContent:"center",gap:16 }}>
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

      {/* ── Fixed Bottom Nav ── */}
      <nav style={{ position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,
        background:"#fff",borderTop:`1px solid ${GB}`,boxShadow:"0 -4px 16px rgba(0,0,0,0.08)",
        display:"flex",alignItems:"flex-end",height:64,zIndex:900,paddingBottom:4 }}>

        {/* Left 2 tabs */}
        {BOT_TABS.slice(0,2).map(({key,label,Icon,href})=>{
          const active = activeNav===key;
          return (
            <button key={key} onClick={()=>{ setActiveNav(key); go(href); }}
              style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",
                gap:3,paddingBottom:8,border:"none",background:"none",cursor:"pointer",fontFamily:"inherit",
                color:active?P:"#9CA3AF" }}>
              <Icon size={22} strokeWidth={active?2:1.5} />
              <span style={{ fontSize:10,fontWeight:active?700:500,letterSpacing:0.2,
                borderBottom:active?`2px solid ${P}`:"2px solid transparent",paddingBottom:1,lineHeight:1.2 }}>
                {label}
              </span>
            </button>
          );
        })}

        {/* Center — Sepetim */}
        <button onClick={()=>{ setActiveNav("sepetim"); go("/yourpoodle/sepet"); }}
          style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",
            gap:3,paddingBottom:8,border:"none",background:"none",cursor:"pointer",fontFamily:"inherit",
            position:"relative", color:activeNav==="sepetim"?P:"#111827" }}>
          <div style={{ position:"absolute",bottom:28,width:56,height:56,borderRadius:"50%",background:P,
            boxShadow:`0 0 0 6px rgba(98,0,238,0.15), 0 4px 16px rgba(98,0,238,0.35)`,
            display:"flex",alignItems:"center",justifyContent:"center" }}>
            <ShoppingCart size={26} color="#fff" strokeWidth={2} />
            {cartCount > 0 && (
              <span style={{ position:"absolute",top:4,right:4,background:"#EF4444",color:"#fff",
                fontSize:9,fontWeight:800,width:16,height:16,borderRadius:"50%",
                display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid #fff" }}>
                {cartCount>9?"9+":cartCount}
              </span>
            )}
          </div>
          <span style={{ fontSize:10,fontWeight:700,letterSpacing:0.2,marginTop:2 }}>Sepetim</span>
        </button>

        {/* Right 2 tabs */}
        {BOT_TABS.slice(2).map(({key,label,Icon,href})=>{
          const active = activeNav===key;
          return (
            <button key={key} onClick={()=>{ setActiveNav(key); go(href); }}
              style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",
                gap:3,paddingBottom:8,border:"none",background:"none",cursor:"pointer",fontFamily:"inherit",
                color:active?P:"#9CA3AF" }}>
              <Icon size={22} strokeWidth={active?2:1.5} />
              <span style={{ fontSize:10,fontWeight:active?700:500,letterSpacing:0.2,
                borderBottom:active?`2px solid ${P}`:"2px solid transparent",paddingBottom:1,lineHeight:1.2 }}>
                {label}
              </span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}
