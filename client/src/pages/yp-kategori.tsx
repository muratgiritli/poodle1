import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ChevronRight, Heart, CreditCard, ShoppingCart } from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";

/* ── Design Tokens ── */
const P   = "#6200EE";
const GB  = "#E5E7EB";

/* ── Category metadata ── */
interface CatMeta { title: string; subtitle: string; count: number; slug: string; }

const CAT_META: Record<string, CatMeta> = {
  "tuvalet":           { title:"Tuvalet Malzemeleri",       subtitle:"Köpek tuvalet ürünleri",         count:24, slug:"tuvalet" },
  "yas-mama":          { title:"Yaş Mama",                  subtitle:"Islak ve konserve mamalar",       count:31, slug:"yas-mama" },
  "odul-cesitleri":    { title:"Ödül Çeşitleri",            subtitle:"Atıştırmalık ve ödüller",         count:28, slug:"odul-cesitleri" },
  "tasima-cantalari":  { title:"Taşıma Çantaları",          subtitle:"Kedi ve köpek taşıma ürünleri",  count:18, slug:"tasima-cantalari" },
  "kulubeler":         { title:"Kulübeler",                  subtitle:"Köpek evi ve kulübeleri",         count:15, slug:"kulubeler" },
  "oyuncaklar":        { title:"Oyuncaklar",                 subtitle:"Eğlence ve aktivite oyuncakları", count:42, slug:"oyuncaklar" },
  "mama-su-kaplari":   { title:"Mama ve Su Kapları",         subtitle:"Beslenme ekipmanları",            count:22, slug:"mama-su-kaplari" },
  "bel-boyun-tasmalari":{ title:"Bel ve Boyun Tasmaları",   subtitle:"Tasma, gerdanlık ve kayışlar",    count:35, slug:"bel-boyun-tasmalari" },
  "bakim-saglik":      { title:"Bakım ve Sağlık",            subtitle:"Vitamin, takviye ve bakım",       count:29, slug:"bakim-saglik" },
  "makas-taraklar":    { title:"Makas ve Taraklar",          subtitle:"Tıraş ve bakım aletleri",        count:20, slug:"makas-taraklar" },
  "sampuan-parfum":    { title:"Şampuan ve Parfüm",          subtitle:"Banyo ve koku ürünleri",         count:26, slug:"sampuan-parfum" },
  "agiz-dis-bakimi":   { title:"Ağız ve Diş Bakımı",        subtitle:"Diş macunu, fırça ve gargara",   count:17, slug:"agiz-dis-bakimi" },
  "sut-tozu-biberon":  { title:"Süt Tozu ve Biberon",        subtitle:"Yavru besleme ürünleri",         count:12, slug:"sut-tozu-biberon" },
  "bit-pire-parazit":  { title:"Bit, Pire ve Parazit",       subtitle:"Parazit önleme ve tedavi",       count:19, slug:"bit-pire-parazit" },
  "goz-kulak-bakimi":  { title:"Göz ve Kulak Bakımı",        subtitle:"Hijyen ve bakım damlaları",      count:14, slug:"goz-kulak-bakimi" },
  "tiras-ekipmanlari": { title:"Tıraş Ekipmanları",          subtitle:"Profesyonel bakım makineleri",   count:11, slug:"tiras-ekipmanlari" },
};

/* ── Product types ── */
interface Product {
  id: string; name: string; originalPrice: number; salePrice: number;
  discountPct: number; installments: number; color: string; emoji: string;
}
interface BrandGroup { brand: string; products: Product[]; }

function fmtPrice(n: number) { return n.toLocaleString("tr-TR") + " TL"; }

/* ── Mock data (abbreviated – builds on the same data as before) ── */
function getProductsForCategory(slug: string): BrandGroup[] {
  const fallback: BrandGroup[] = [
    { brand:"Trixie", products:[
      { id:`${slug}-1`, name:"Premium Ürün 1 Küçük Irk", originalPrice:999, salePrice:849, discountPct:15, installments:3, color:"#EDE9FE", emoji:"🐩" },
      { id:`${slug}-2`, name:"Premium Ürün 2 Poodle",    originalPrice:799, salePrice:679, discountPct:15, installments:3, color:"#DBEAFE", emoji:"🐕" },
    ]},
    { brand:"Karlie", products:[
      { id:`${slug}-3`, name:"Deluxe Set Küçük Irk",     originalPrice:1199, salePrice:999, discountPct:15, installments:3, color:"#FEF9C3", emoji:"⭐" },
      { id:`${slug}-4`, name:"Classic Ürün Mini",         originalPrice:599, salePrice:499, discountPct:15, installments:3, color:"#F0FDF4", emoji:"🌟" },
    ]},
    { brand:"Pawise", products:[
      { id:`${slug}-5`, name:"Comfort Plus Serisi",       originalPrice:849, salePrice:719, discountPct:15, installments:3, color:"#FFF7ED", emoji:"💜" },
      { id:`${slug}-6`, name:"Basic Ürün XS",             originalPrice:449, salePrice:379, discountPct:15, installments:3, color:"#FEF2F2", emoji:"🔶" },
    ]},
    { brand:"Hunter", products:[
      { id:`${slug}-7`, name:"Pro Serisi Premium",        originalPrice:1499, salePrice:1249, discountPct:15, installments:3, color:"#F9FAFB", emoji:"🏆" },
      { id:`${slug}-8`, name:"Elite Mini Koleksiyon",     originalPrice:1099, salePrice:929, discountPct:15, installments:3, color:"#DBEAFE", emoji:"💫" },
    ]},
    { brand:"Flamingo", products:[
      { id:`${slug}-9`,  name:"Trend Ürün Küçük Irk",    originalPrice:699, salePrice:589, discountPct:15, installments:3, color:"#FEF9C3", emoji:"🦩" },
      { id:`${slug}-10`, name:"Comfort XS Mini",          originalPrice:549, salePrice:459, discountPct:15, installments:3, color:"#F0FDF4", emoji:"🌺" },
    ]},
    { brand:"Beaphar", products:[
      { id:`${slug}-11`, name:"Sağlık Ürünü 30 Adet",    originalPrice:399, salePrice:339, discountPct:15, installments:3, color:"#EDE9FE", emoji:"💊" },
      { id:`${slug}-12`, name:"Care Set Küçük Irk",       originalPrice:329, salePrice:279, discountPct:15, installments:3, color:"#F3F4F6", emoji:"🧴" },
    ]},
  ];
  return fallback;
}

/* ── Product Card ── */
function ProductCard({ product, brand }: { product: Product; brand: string }) {
  const [fav,   setFav]   = useState(false);
  const [added, setAdded] = useState(false);
  const handleAdd = () => { setAdded(true); setTimeout(()=>setAdded(false), 1500); };
  return (
    <div style={{ background:"#fff",border:"1px solid #F3F4F6",borderRadius:12,
                  overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,0.06)",
                  display:"flex",flexDirection:"column",position:"relative" }}>
      <div style={{ position:"absolute",top:8,left:8,zIndex:2,background:"#DC2626",
                    color:"#fff",fontSize:10,fontWeight:700,padding:"2px 6px",borderRadius:6 }}>
        %{product.discountPct} İndirim
      </div>
      <button onClick={()=>setFav(f=>!f)} aria-label="Favorilere ekle"
        style={{ position:"absolute",top:6,right:6,zIndex:2,background:"#fff",
                 border:"none",borderRadius:"50%",width:28,height:28,
                 display:"flex",alignItems:"center",justifyContent:"center",
                 cursor:"pointer",boxShadow:"0 1px 4px rgba(0,0,0,0.12)" }}>
        <Heart size={14} fill={fav?"#DC2626":"none"} color={fav?"#DC2626":"#9CA3AF"} />
      </button>
      <div style={{ background:product.color,height:110,display:"flex",
                    alignItems:"center",justifyContent:"center",fontSize:36 }}>
        {product.emoji}
      </div>
      <div style={{ padding:"8px 8px 10px",flex:1,display:"flex",flexDirection:"column" }}>
        <div style={{ fontSize:10,color:"#6B7280",marginBottom:2 }}>
          Marka: <span style={{ color:"#4A2ED1",fontWeight:600 }}>{brand}</span>
        </div>
        <div style={{ fontSize:11,fontWeight:600,color:"#111827",lineHeight:1.35,
                      flex:1,marginBottom:6,display:"-webkit-box",WebkitLineClamp:2,
                      WebkitBoxOrient:"vertical",overflow:"hidden" }}>
          {product.name}
        </div>
        <div style={{ fontSize:11,color:"#9CA3AF",textDecoration:"line-through",marginBottom:1 }}>
          {fmtPrice(product.originalPrice)}
        </div>
        <div style={{ fontSize:17,fontWeight:700,color:"#3B59FF",marginBottom:1 }}>
          {fmtPrice(product.salePrice)}
        </div>
        <div style={{ fontSize:10,color:"#6B7280",marginBottom:8 }}>{product.installments} Taksit</div>
        <button onClick={handleAdd}
          style={{ width:"100%",background:added?"#16A34A":"#4A2ED1",color:"#fff",border:"none",
                   borderRadius:8,padding:"7px 0",fontSize:12,fontWeight:600,cursor:"pointer",
                   transition:"background 0.2s",fontFamily:"inherit" }}>
          {added ? "✓ Eklendi" : "Sepete Ekle"}
        </button>
      </div>
    </div>
  );
}

/* ── Brand Section ── */
function BrandSection({ group }: { group: BrandGroup }) {
  return (
    <div style={{ marginBottom:24 }}>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10 }}>
        <span style={{ fontSize:14,fontWeight:700,color:"#111827" }}>{group.brand}</span>
        <span style={{ fontSize:12,color:"#4A2ED1",fontWeight:500,cursor:"pointer" }}>Tümünü Gör</span>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
        {group.products.map(p=>(
          <ProductCard key={p.id} product={p} brand={group.brand} />
        ))}
      </div>
    </div>
  );
}

/* ── Main Page ── */
interface YPKategoriPageProps { routeSlug?: string; }

export default function YPKategoriPage({ routeSlug }: YPKategoriPageProps) {
  const [, navigate] = useLocation();
  const [toast, setToast]   = useState({ message:"", visible:false });
  const [showAll, setShowAll] = useState(false);

  const slug = routeSlug || "tuvalet";
  const meta = CAT_META[slug] || CAT_META["tuvalet"];
  const allGroups = getProductsForCategory(slug);
  const visibleGroups = showAll ? allGroups : allGroups.slice(0, 4);

  useEffect(()=>{ document.title = `${meta.title} | YourPoodle`; }, [meta.title]);

  const showToast = (msg: string) => {
    setToast({message:msg,visible:true});
    setTimeout(()=>setToast(t=>({...t,visible:false})), 2500);
  };

  return (
    <YPLayout activeLink="/yourpoodle/magaza" constrain={false}>
      {/* Toast */}
      <div style={{ position:"fixed",bottom:88,left:"50%",transform:"translateX(-50%)",
                    zIndex:999,pointerEvents:"none",opacity:toast.visible?1:0,transition:"opacity 0.3s ease" }}>
        <div style={{ background:"#1A0052",color:"#fff",padding:"12px 24px",borderRadius:999,
                      fontSize:14,fontWeight:500,whiteSpace:"nowrap",boxShadow:"0 4px 16px rgba(0,0,0,0.25)" }}>
          {toast.message}
        </div>
      </div>

      {/* ── Page header ── */}
      <div style={{ background:"#fff",borderBottom:`1px solid ${GB}`,padding:"12px 16px 14px" }}>
        <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:10 }}>
          <button onClick={()=>navigate("/yourpoodle/magaza")}
            style={{ background:"none",border:"none",cursor:"pointer",display:"flex",
                     alignItems:"center",gap:4,padding:0,color:"#4A2ED1",
                     fontSize:13,fontWeight:500,fontFamily:"inherit" }}>
            ← Mağaza
          </button>
          <ChevronRight size={14} color="#9CA3AF" />
          <span style={{ fontSize:13,color:"#6B7280",fontWeight:400 }}>{meta.title}</span>
        </div>
        <h1 style={{ fontSize:22,fontWeight:700,color:"#111827",margin:"0 0 3px" }}>{meta.title}</h1>
        <p style={{ fontSize:13,color:"#6B7280",margin:"0 0 14px" }}>{meta.count} ürün bulundu</p>
        <div style={{ display:"flex",alignItems:"center",gap:10,background:"#F0F4FF",
                      border:"1px solid #DDD6FE",borderRadius:10,padding:"10px 14px" }}>
          <CreditCard size={18} color="#4A2ED1" />
          <span style={{ fontSize:13,fontWeight:600,color:"#1F2937" }}>Peşin fiyatına 3 taksit</span>
        </div>
      </div>

      {/* ── Product sections ── */}
      <div style={{ padding:"16px 12px 24px",paddingBottom:96 }}>
        {visibleGroups.map(group=>(
          <BrandSection key={group.brand} group={group} />
        ))}
        {!showAll && allGroups.length > 4 && (
          <button onClick={()=>setShowAll(true)}
            style={{ width:"100%",background:"#fff",border:"2px solid #4A2ED1",
                     borderRadius:12,color:"#4A2ED1",fontSize:14,fontWeight:600,
                     padding:"13px 0",cursor:"pointer",fontFamily:"inherit",transition:"background 0.15s" }}
            onMouseEnter={e=>{e.currentTarget.style.background="#F3EEFF";}}
            onMouseLeave={e=>{e.currentTarget.style.background="#fff";}}>
            Daha Fazla Ürün Göster
          </button>
        )}
      </div>
    </YPLayout>
  );
}
