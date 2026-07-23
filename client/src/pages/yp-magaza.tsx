import React, { useState, useRef } from "react";
import { useLocation } from "wouter";
import {
  ChevronRight,
  Package, Droplets, Soup, Candy, Briefcase, Home, ToyBrick, UtensilsCrossed,
  Link, HeartPulse, Scissors, Sparkles, Smile, Baby, Bug, Eye, Wand2,
} from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";

/* ── Colors ─────────────────────────── */
const P   = "#6200EE";
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

function Toast({ message, visible }: { message:string; visible:boolean }) {
  return (
    <div style={{ position:"fixed", bottom:88, left:"50%", transform:"translateX(-50%)", zIndex:999, pointerEvents:"none", opacity:visible?1:0, transition:"opacity 0.3s ease" }}>
      <div style={{ background:"#1A0052", color:"#fff", padding:"12px 24px", borderRadius:999, fontSize:14, fontWeight:500, whiteSpace:"nowrap", boxShadow:"0 4px 16px rgba(0,0,0,0.25)" }}>
        {message}
      </div>
    </div>
  );
}

function CategoryRow({ cat, onClick }: { cat:Cat; onClick:()=>void }) {
  const c = COLOR_MAP[cat.color];
  const [hovered, setHovered] = useState(false);
  return (
    <div role="button" aria-label={`${cat.name} kategorisine git`} tabIndex={0}
      onClick={onClick}
      onKeyDown={e=>{ if(e.key==="Enter"||e.key===" ") onClick(); }}
      onMouseEnter={()=>setHovered(true)}
      onMouseLeave={()=>setHovered(false)}
      style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
               width:"100%", padding:"12px", marginBottom:8,
               borderRadius:12, border:`1px solid ${c.border}`,
               background:c.bg, cursor:"pointer",
               boxShadow: hovered ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
               transform: hovered ? "scale(1.01)" : "scale(1)",
               transition:"all 0.15s ease" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:40, height:40, borderRadius:8, background:"#fff", border:`1px solid ${c.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <cat.Icon size={20} color={c.icon} strokeWidth={1.75} />
        </div>
        <span style={{ fontSize:14, fontWeight:500, color:"#111827" }}>{cat.name}</span>
      </div>
      <ChevronRight size={18} color={c.chevron} />
    </div>
  );
}

export default function YPMagazaPage() {
  const [, navigate] = useLocation();
  const [toast, setToast] = useState({ message:"", visible:false });
  const toastTimer = useRef<ReturnType<typeof setTimeout>|null>(null);

  const go = (href:string) => navigate(href);

  const showToast = (msg:string) => {
    if(toastTimer.current) clearTimeout(toastTimer.current);
    setToast({message:msg,visible:true});
    toastTimer.current = setTimeout(()=>setToast(t=>({...t,visible:false})),3000);
  };

  return (
    <YPLayout activeLink="/yourpoodle/magaza" constrain={false}>
      <Toast message={toast.message} visible={toast.visible} />

      <main style={{ padding:"20px 16px 24px", paddingBottom:96 }}>
        <h1 style={{ fontSize:20, fontWeight:700, color:"#111827", margin:"0 0 4px" }}>Mağaza Kategorileri</h1>
        <p style={{ fontSize:14, color:"#6B7280", margin:"0 0 20px" }}>Poodle'ınız için aradığınız her şey</p>

        <div style={{ display:"flex", flexDirection:"column" }}>
          {CATEGORIES.map(cat=>(
            <CategoryRow key={cat.id} cat={cat}
              onClick={()=>{
                if(cat.slug==="kuru-mama") navigate("/yourpoodle/kuru-mama");
                else navigate(`/yourpoodle/kategori/${cat.slug}`);
              }} />
          ))}
        </div>
      </main>
    </YPLayout>
  );
}
