import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Menu, X, Home, Users, BookOpen, Monitor, ShoppingBag, ChevronRight, Clock } from "lucide-react";
import { useCustomer } from "@/contexts/CustomerContext";

const LANGUAGES = [{ code:"TR",flag:"🇹🇷" },{ code:"EN",flag:"🇺🇸" }];
const DRAWER_LINKS = [
  { label:"Ana Sayfa",     href:"/" },
  { label:"Rehber",        href:"/yourpoodle/rehber" },
  { label:"Bilgi Bankası", href:"/yourpoodle/bilgi" },
  { label:"Mağaza",        href:"/yourpoodle/magaza" },
  { label:"Mama",          href:"/yourpoodle/mama" },
  { label:"Eğitim",        href:"/yourpoodle/egitim" },
  { label:"Sağlık",        href:"/yourpoodle/saglik" },
  { label:"Bakım",         href:"/yourpoodle/bakim" },
  { label:"Poodle Club",   href:"/yourpoodle/club" },
  { label:"Etkinlikler",   href:"/yourpoodle/etkinlikler" },
];

const ARTICLES = [
  { emoji:"🍖", title:"Toy Poodle İçin En İyi Mama Markaları 2024", min:5, tag:"Mama Seçimi", body:"Royal Canin Poodle formülü, yaşa özel besin değerleriyle öne çıkıyor. Hill's Science Plan ve Pro Plan da Poodle'ların küçük ağız yapısına uygun kibble boyutuyla dikkat çekiyor. Tahılsız seçenekler için Orijen ve Acana tercih edilebilir. Günlük kalori ihtiyacı: yetişkin Toy Poodle (3 kg) için yaklaşık 200–240 kcal." },
  { emoji:"🥩", title:"Yavru Poodle Beslenmesi: İlk 12 Ay", min:6, tag:"Yavru Bakımı", body:"8 haftaya kadar annesinden emzirme / mama geçişi, 8–16 hafta arası günde 3 öğün yavru maması, 6 aydan itibaren 2 öğüne geçiş. Yetişkin mamaya geçiş 12. ayda yapılmalı. Porsiyonları tartarak verin; aşırı yemek iskelet gelişimini olumsuz etkiler." },
  { emoji:"🥕", title:"Poodle'lara Verilmeyecek Besinler", min:4, tag:"Beslenme Güvenliği", body:"Çikolata, soğan, sarımsak, üzüm ve kuru üzüm kesinlikle verilmemelidir. Avokado ve macadamia cevizi de toksik kabul edilir. Tuzlu yiyecekler böbreklere zarar verir. Şeker ve yapay tatlandırıcılar (xylitol) hayati tehlike oluşturabilir." },
  { emoji:"🐟", title:"Poodle'larda Doğal Mama (BARF) Diyeti", min:8, tag:"Doğal Beslenme", body:"Kemik ve çiğ gıda (BARF) diyeti; çiğ et, kemik, organ eti, sebze ve meyveden oluşur. Besin dengesini sağlamak için veteriner onayı şarttır. Yanlış uygulama vitamin eksikliği veya bakteriyel enfeksiyona yol açabilir. Tecrübesiz besleyiciler için hazır mama daha güvenlidir." },
  { emoji:"💊", title:"Mama ile Birlikte Takviyeler ve Vitaminler", min:5, tag:"Takviyeler", body:"Balık yağı (Omega-3) tüy sağlığı için idealdir. Glukozamin eklem sağlığını destekler. Probiyotikler sindirim sağlığını düzenler. B kompleks vitaminleri sinir sistemi için önemlidir. Tüm takviyeler için önce veterinerinize danışın." },
  { emoji:"⚖️", title:"Poodle'larda Obezite: Belirtiler ve Önlemler", min:6, tag:"Kilo Yönetimi", body:"Kaburgaları hissedemiyorsanız, yürürken yoruluyor veya nefes darlığı çekiyorsa kilo sorunu olabilir. Günlük porsiyonu azaltın, ödül maması kullanmayın. Yüksek proteinli düşük karbonhidratlı mama tercih edin. Düzenli egzersizle destekleyin." },
];

const TIPS = [
  { icon:"🍽️", tip:"Günde 2 öğün, belirli saatlerde verin." },
  { icon:"💧", tip:"Her zaman temiz taze su erişimi sağlayın." },
  { icon:"⏰", tip:"Mama değiştirirken 7-10 gün kademeli geçiş yapın." },
  { icon:"🚫", tip:"İnsan yemeği verme alışkanlığından kaçının." },
];

const CSS = [
  "*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}",
  "body{background:#fff;}",
  ".icon-btn{background:none;border:none;cursor:pointer;display:flex;align-items:center;padding:6px;border-radius:8px;}",
  ".art-row:hover{background:#FFF8F0!important;}",
].join("\n");

export default function MamaRehberi() {
  const [, navigate] = useLocation();
  const { isLoggedIn } = useCustomer();
  const [activeLang, setActiveLang] = useState(LANGUAGES[0]);
  const { data: allProducts = [] } = useQuery<any[]>({
    queryKey: ["/api/products"],
    staleTime: 5 * 60 * 1000,
  });
  const featuredMama = allProducts
    .filter((p: any) => p.animal === "kopek" && p.isActive !== false)
    .sort((a: any, b: any) => b.id - a.id)
    .slice(0, 4);
  const [langOpen, setLangOpen]   = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected]   = useState<typeof ARTICLES[0]|null>(null);

  return (
    <>
      <title>Mama Rehberi — YourPoodle</title>
      <style>{CSS}</style>

      {drawerOpen&&<div onClick={()=>setDrawerOpen(false)} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.3)",zIndex:199 }}/>}
      <div style={{ position:"fixed",top:0,left:0,height:"100%",width:280,background:"#fff",zIndex:200,transform:drawerOpen?"translateX(0)":"translateX(-100%)",transition:"transform 0.24s ease",boxShadow:"4px 0 24px rgba(0,0,0,0.12)" }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 18px 14px",borderBottom:"1px solid #f2f2f2" }}>
          <img src="/images/yourpoodle-logo.jpg" alt="YourPoodle" style={{ height:32,objectFit:"contain" }}/>
          <button className="icon-btn" onClick={()=>setDrawerOpen(false)}><X size={20} color="#444"/></button>
        </div>
        <nav>{DRAWER_LINKS.map(({label,href})=>(
          <button key={label} onClick={()=>{setDrawerOpen(false);navigate(href);}}
            style={{ display:"block",width:"100%",textAlign:"left",padding:"14px 20px",fontSize:15,fontWeight:600,color:href==="/yourpoodle/mama"?"#E07820":"#222",background:href==="/yourpoodle/mama"?"#FFF0E0":"none",border:"none",borderBottom:"1px solid #fafafa",cursor:"pointer",fontFamily:"Inter,sans-serif" }}>{label}</button>
        ))}</nav>
      </div>

      {/* Article detail overlay */}
      {selected&&(
        <div style={{ position:"fixed",inset:0,zIndex:500,display:"flex",flexDirection:"column" }}>
          <div onClick={()=>setSelected(null)} style={{ flex:1,background:"rgba(0,0,0,0.4)" }}/>
          <div style={{ background:"#fff",borderRadius:"24px 24px 0 0",maxHeight:"85vh",display:"flex",flexDirection:"column" }}>
            <div style={{ display:"flex",justifyContent:"center",paddingTop:10,paddingBottom:6 }}><div style={{ width:36,height:4,borderRadius:2,background:"#e0e0e0" }}/></div>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px 12px" }}>
              <button onClick={()=>setSelected(null)} style={{ background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:6,color:"#555",fontFamily:"Inter,sans-serif",fontSize:14,fontWeight:600 }}>← Geri</button>
            </div>
            <div style={{ overflowY:"auto",padding:"0 20px 40px" }}>
              <div style={{ fontSize:28,marginBottom:12,textAlign:"center" }}>{selected.emoji}</div>
              <div style={{ display:"inline-block",background:"#FFF0E0",color:"#E07820",fontSize:11,fontWeight:700,borderRadius:20,padding:"4px 12px",marginBottom:12 }}>{selected.tag}</div>
              <h2 style={{ fontSize:17,fontWeight:900,color:"#1a1a1a",lineHeight:1.35,marginBottom:16 }}>{selected.title}</h2>
              <p style={{ fontSize:15,color:"#444",lineHeight:1.8,fontFamily:"Inter,sans-serif" }}>{selected.body}</p>
              <div style={{ marginTop:20,padding:"14px",background:"#FFF0E0",borderRadius:14,borderLeft:"3px solid #E07820" }}>
                <div style={{ fontSize:11,fontWeight:800,color:"#E07820",marginBottom:4 }}>💡 UZMAN TAVSİYESİ</div>
                <div style={{ fontSize:13,color:"#555",lineHeight:1.6,fontFamily:"Inter,sans-serif" }}>Her poodle'ın ihtiyacı farklıdır. Veterinerinizle beslenme planını kişiselleştirin.</div>
              </div>
              <button onClick={()=>navigate("/yourpoodle/magaza")}
                style={{ width:"100%",marginTop:16,height:48,borderRadius:14,border:"none",background:"linear-gradient(135deg,#E07820,#F59E0B)",color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"Inter,sans-serif" }}>
                Mama Mağazasına Git 🛍️
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ minHeight:"100vh",background:"#fff",fontFamily:"Inter,sans-serif",paddingBottom:90 }}>
        <header style={{ position:"sticky",top:0,zIndex:100,background:"#fff",borderBottom:"1px solid #f0f0f0" }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px" }}>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              <button className="icon-btn" onClick={()=>setDrawerOpen(true)}><Menu size={22} color="#333" strokeWidth={2}/></button>
              <button className="icon-btn" onClick={()=>navigate("/")} style={{ padding:0 }}>
                <img src="/images/yourpoodle-logo.jpg" alt="YourPoodle" style={{ height:30,width:120,objectFit:"contain",objectPosition:"left center" }}/>
              </button>
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:6 }}>
              <button className="icon-btn" onClick={()=>navigate(isLoggedIn?"/hesabim":"/yourpoodle/giris")}
                style={{ padding:"6px 13px",borderRadius:20,border:"2px solid",borderColor:isLoggedIn?"#22C55E":"#7C3AFF",background:isLoggedIn?"#F0FDF4":"#F5F0FF",color:isLoggedIn?"#16A34A":"#7C3AFF",fontSize:12,fontWeight:800,whiteSpace:"nowrap" }}>
                {isLoggedIn?"Hesabım 👤":"Üye Girişi"}
              </button>
              <div style={{ position:"relative" }}>
                <button className="icon-btn" onClick={()=>setLangOpen(!langOpen)} style={{ gap:3,padding:"5px 6px" }}>
                  <span style={{ fontSize:14 }}>{activeLang.flag}</span>
                  <span style={{ fontSize:12,fontWeight:700,color:"#6C47FF" }}>{activeLang.code}</span>
                  <ChevronDown size={12} color="#6C47FF" strokeWidth={2.5}/>
                </button>
                {langOpen&&<div style={{ position:"absolute",right:0,top:36,background:"#fff",borderRadius:12,border:"1px solid #eee",boxShadow:"0 8px 28px rgba(0,0,0,0.12)",zIndex:150,minWidth:110,padding:"4px 0" }}>
                  {LANGUAGES.map(l=><button key={l.code} onClick={()=>{setActiveLang(l);setLangOpen(false);}}
                    style={{ display:"flex",alignItems:"center",gap:8,width:"100%",padding:"9px 14px",border:"none",background:activeLang.code===l.code?"#F5F0FF":"transparent",cursor:"pointer",fontSize:13,fontWeight:700,color:activeLang.code===l.code?"#6C47FF":"#333",fontFamily:"Inter,sans-serif" }}><span style={{ fontSize:16 }}>{l.flag}</span>{l.code}</button>)}
                </div>}
              </div>
            </div>
          </div>
        </header>

        {/* Hero */}
        <div style={{ background:"linear-gradient(135deg,#E07820,#F59E0B)",padding:"24px 20px 28px",position:"relative",overflow:"hidden" }}>
          <div style={{ position:"absolute",top:-30,right:-20,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,0.1)" }}/>
          <div style={{ fontSize:36,marginBottom:8 }}>🍖</div>
          <div style={{ fontSize:22,fontWeight:900,color:"#fff",marginBottom:4 }}>Mama Rehberi</div>
          <div style={{ fontSize:13,color:"rgba(255,255,255,0.9)",lineHeight:1.5 }}>Poodle'ınız için doğru beslenme rehberi</div>
        </div>

        {/* Quick tips */}
        <div style={{ padding:"16px 16px 0" }}>
          <div style={{ fontSize:14,fontWeight:800,color:"#1a1a1a",marginBottom:10 }}>⚡ Hızlı İpuçları</div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
            {TIPS.map(({icon,tip})=>(
              <div key={tip} style={{ background:"#FFF8F0",borderRadius:12,padding:"10px 12px",display:"flex",alignItems:"flex-start",gap:8 }}>
                <span style={{ fontSize:18,flexShrink:0 }}>{icon}</span>
                <span style={{ fontSize:11,color:"#555",lineHeight:1.5,fontFamily:"Inter,sans-serif" }}>{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Articles */}
        <div style={{ padding:"20px 16px 0" }}>
          <div style={{ fontSize:16,fontWeight:800,color:"#1a1a1a",marginBottom:12 }}>📖 Beslenme Yazıları</div>
          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            {ARTICLES.map(a=>(
              <button key={a.title} className="art-row" onClick={()=>setSelected(a)}
                style={{ display:"flex",gap:12,alignItems:"center",padding:"12px",background:"#FAFAFA",borderRadius:14,cursor:"pointer",border:"none",textAlign:"left",width:"100%",transition:"background 0.15s" }}>
                <div style={{ width:52,height:52,borderRadius:12,background:"#FFF0E0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0 }}>{a.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:10,fontWeight:700,color:"#E07820",marginBottom:4 }}>{a.tag}</div>
                  <div style={{ fontSize:13,fontWeight:700,color:"#1a1a1a",lineHeight:1.4,marginBottom:4,fontFamily:"Inter,sans-serif" }}>{a.title}</div>
                  <div style={{ display:"flex",gap:8 }}>
                    <span style={{ fontSize:11,color:"#aaa",display:"flex",alignItems:"center",gap:3 }}><Clock size={10} strokeWidth={2}/>{a.min} dk</span>
                  </div>
                </div>
                <ChevronRight size={16} color="#ccc"/>
              </button>
            ))}
          </div>
        </div>

        {/* Öne Çıkan Ürünler */}
        {featuredMama.length > 0 && (
          <div style={{ margin:"8px 16px 24px" }}>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12 }}>
              <div style={{ fontSize:15,fontWeight:900,color:"#1a1a1a" }}>🛍️ Öne Çıkan Mamalar</div>
              <button onClick={()=>navigate("/yourpoodle/magaza")} style={{ fontSize:12,fontWeight:700,color:"#E07820",background:"none",border:"none",cursor:"pointer",fontFamily:"Inter,sans-serif" }}>Tümü →</button>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
              {featuredMama.map((p: any) => (
                <button key={p.id} onClick={()=>navigate(`/urun/${p.id}/${p.slug || ""}`)}
                  style={{ background:"#fff",borderRadius:14,padding:"12px",boxShadow:"0 2px 8px rgba(0,0,0,0.07)",border:"none",cursor:"pointer",textAlign:"left",fontFamily:"Inter,sans-serif" }}>
                  {p.img && <img src={p.img} alt={p.name} style={{ width:"100%",height:80,objectFit:"contain",borderRadius:8,marginBottom:8,background:"#f9f9f9" }}/>}
                  <div style={{ fontSize:11,fontWeight:700,color:"#1a1a1a",lineHeight:1.4,marginBottom:4,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical" as const }}>{p.name}</div>
                  <div style={{ fontSize:13,fontWeight:900,color:"#E07820" }}>{Number(p.price).toLocaleString("tr-TR")} ₺</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mama CTA */}
        <div style={{ margin:"24px 16px",background:"linear-gradient(135deg,#FFF0E0,#FFF9C4)",borderRadius:18,padding:"20px",display:"flex",gap:14,alignItems:"center" }}>
          <span style={{ fontSize:36,flexShrink:0 }}>🛍️</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14,fontWeight:800,color:"#1a1a1a",marginBottom:4 }}>Mama Mağazamız</div>
            <div style={{ fontSize:12,color:"#888",lineHeight:1.5,marginBottom:10 }}>900'den fazla mama ve ürün. Hızlı teslimat.</div>
            <button onClick={()=>navigate("/yourpoodle/magaza")}
              style={{ height:40,borderRadius:12,border:"none",background:"#E07820",color:"#fff",fontSize:13,fontWeight:800,padding:"0 20px",cursor:"pointer",fontFamily:"Inter,sans-serif" }}>
              Mağazaya Git →
            </button>
          </div>
        </div>

        {/* Calculator CTA */}
        <div style={{ margin:"0 16px 24px",background:"#F0FDF4",borderRadius:18,padding:"20px",textAlign:"center" }}>
          <div style={{ fontSize:24,marginBottom:8 }}>🍖</div>
          <div style={{ fontSize:14,fontWeight:800,color:"#1a1a1a",marginBottom:4 }}>Mama Hesaplama Aracı</div>
          <div style={{ fontSize:12,color:"#888",lineHeight:1.5,marginBottom:12 }}>Poodle'ınızın kilosuna göre günlük mama miktarını hesaplayın.</div>
          <button onClick={()=>navigate("/yourpoodle/bilgi")}
            style={{ height:40,borderRadius:12,border:"none",background:"#059669",color:"#fff",fontSize:13,fontWeight:800,padding:"0 24px",cursor:"pointer",fontFamily:"Inter,sans-serif" }}>
            Hesapla
          </button>
        </div>
      </div>

      <nav style={{ position:"fixed",bottom:0,left:0,right:0,background:"#fff",borderTop:"1px solid #f0f0f0",boxShadow:"0 -4px 20px rgba(0,0,0,0.08)",height:64,display:"flex",alignItems:"center",zIndex:200,padding:"0 8px" }}>
        {[{label:"Ana Sayfa",href:"/",Icon:Home},{label:"Club",href:"/yourpoodle/club",Icon:Users}].map(({label,href,Icon})=>(
          <button key={label} onClick={()=>navigate(href)} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",flex:1,color:"#aaa" }}>
            <Icon size={22} strokeWidth={2}/><span style={{ fontSize:10,fontWeight:700,fontFamily:"Inter,sans-serif" }}>{label}</span>
          </button>
        ))}
        <button onClick={()=>navigate("/yourpoodle/magaza")} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",flex:1,position:"relative" }}>
          <div style={{ width:54,height:54,borderRadius:"50%",background:"linear-gradient(135deg,#9B59FF,#7C3AFF)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 6px 20px rgba(124,58,255,0.4)",position:"absolute",top:-24 }}>
            <ShoppingBag size={24} color="#fff" strokeWidth={2.2}/>
          </div>
          <span style={{ fontSize:10,fontWeight:700,color:"#aaa",fontFamily:"Inter,sans-serif",marginTop:32 }}>Mağaza</span>
        </button>
        {[{label:"Rehber",href:"/yourpoodle/rehber",Icon:BookOpen},{label:"Bilgi",href:"/yourpoodle/bilgi",Icon:Monitor}].map(({label,href,Icon})=>(
          <button key={label} onClick={()=>navigate(href)} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",flex:1,color:"#aaa" }}>
            <Icon size={22} strokeWidth={2}/><span style={{ fontSize:10,fontWeight:700,fontFamily:"Inter,sans-serif" }}>{label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
