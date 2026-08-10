import { useState } from "react";
import { Link } from "wouter";
import {
  ShoppingBag, Users, Bot, BookOpen, Heart, ChevronRight,
  Clock, MessageSquare, Mail, Plus, Minus,
  Instagram, Youtube, Facebook, ShieldCheck, CreditCard,
} from "lucide-react";

const PUR = "#5A2D91";
const PUR_DARK = "#3D1A6E";
const PUR_LIGHT = "#EDE7F6";

/* ─── DATA ─── */
const FOOD = [
  { id:"2717", name:"Puppy Tavuklu", weight:"2 kg", price:799, img:"/product-images/yp-2717.jpg" },
  { id:"2716", name:"Adult Kuzu Etli", weight:"2 kg", price:799, img:"/product-images/yp-2716.jpg" },
  { id:"2721", name:"Sensitive Somonlu", weight:"2 kg", price:849, img:"/product-images/yp-2721.png" },
  { id:"2718", name:"Sterilized Hindi", weight:"2 kg", price:829, img:"/product-images/yp-2718.jpg" },
  { id:"2719", name:"Hair & Skin", weight:"2 kg", price:869, img:"/product-images/yp-2719.jpg" },
  { id:"2720", name:"Senior Tavuklu", weight:"2 kg", price:819, img:"/product-images/yp-2720.jpg" },
];

const ACCESSORIES = [
  { id:"2730", name:"Lavanta Elbise",           spec:"S-M beden",    price:549, img:"/product-images/yp-2730.jpg",  badge:""          },
  { id:"2731", name:"Air Mesh Göğüs Tasması",   spec:"Ayarlanabilir",price:429, img:"/product-images/yp-2731.jpg",  badge:"Çok Satan" },
  { id:"2732", name:"Köpek Çiş Bezi",           spec:"121 içerik",   price:249, img:"/product-images/yp-2732.jpg",  badge:""          },
  { id:"2733", name:"Poodle Parfümü",           spec:"100 ml",       price:319, img:"/product-images/yp-2733.jpg",  badge:""          },
  { id:"2737", name:"Buharlı Masaj Tarağı",     spec:"USB şarjlı",   price:399, img:"/product-images/yp-2737.jpg",  badge:""          },
  { id:"2734", name:"Göz Yaşı Bakım Losyonu",  spec:"",              price:289, img:"/product-images/yp-2734.jpg",  badge:"Çok Satan" },
];

const GUIDES = [
  { slug:"poodle-tuvalet-egitimi",           title:"Toy Poodle Tuvalet Eğitimi",    desc:"Adım adım kolay eğitim rehberi",              min:5, img:"/images/poodle-avatar-1.jpg" },
  { slug:"toy-poodle-en-iyi-mama-markalari-2026", title:"Doğru Mama Nasıl Seçilir?", desc:"Yaşına ve ihtiyacına uygun mama seçimi",     min:4, img:"/images/poodle-avatar-2.jpg" },
  { slug:"poodle-goz-yasi-lekesi-temizleme", title:"Göz Yaşı Lekesi Bakımı",        desc:"Lekeleri azaltmak için günlük bakım",          min:3, img:"/images/poodle-avatar-3.jpg" },
  { slug:"poodle-tuy-bakimi-haftalik-rutin", title:"Tüy Bakımı ve Tarama",           desc:"Düğümsüz, sağlıklı ve parlak tüyler",         min:6, img:"/images/poodle-avatar-4.jpg" },
  { slug:"poodle-yalniz-kalma-egitimi",      title:"Yavru Poodle Eve İlk Geldiğinde",desc:"İlk günlerde yapmanız gerekenler",            min:7, img:"/images/poodle-avatar-1.jpg" },
];

const FOOTER_MENUS = [
  { title:"YourPoodle", items:["Hakkımızda","Blog","Kariyer","Basın"] },
  { title:"Alışveriş",  items:["Mama","Aksesuar","Bakım Ürünleri","Kampanyalar"] },
  { title:"Yardım",     items:["SSS","Kargo Takibi","İade","İletişim"] },
  { title:"Yasal",      items:["Gizlilik","Çerezler","KVKK","Kullanım Koşulları"] },
];

/* ─── Product Card ─── */
function PCard({ p, withBadge }: { p: typeof FOOD[0] & { spec?: string; badge?: string }; withBadge?: boolean }) {
  const [fav, setFav] = useState(false);
  return (
    <div style={{
      background:"#fff", borderRadius:14, border:"1px solid #F0EBF8",
      boxShadow:"0 2px 10px rgba(90,45,145,0.08)", overflow:"hidden",
      display:"flex", flexDirection:"column",
    }}>
      {/* image */}
      <div style={{ position:"relative", background:"#F9F6FF", aspectRatio:"1/1", overflow:"hidden" }}>
        <img src={p.img} alt={p.name}
          style={{ width:"100%", height:"100%", objectFit:"contain", padding:8 }}
          onError={e => {
            const el = e.target as HTMLImageElement;
            el.style.display = "none";
            el.parentElement!.style.background = "#EDE7F6";
          }} />
        {withBadge && p.badge && (
          <div style={{
            position:"absolute", top:6, left:6, background:"#E53935", color:"#fff",
            fontSize:9, fontWeight:800, padding:"2px 8px", borderRadius:99,
          }}>{p.badge}</div>
        )}
        <button onClick={e => { e.stopPropagation(); setFav(f=>!f); }}
          style={{
            position:"absolute", top:6, right:6, background:"rgba(255,255,255,0.9)",
            border:"none", borderRadius:"50%", width:28, height:28,
            display:"flex", alignItems:"center", justifyContent:"center",
            cursor:"pointer", boxShadow:"0 1px 4px rgba(0,0,0,0.1)",
          }}>
          <Heart size={13} fill={fav?"#E53935":"none"} color={fav?"#E53935":"#9CA3AF"} strokeWidth={2} />
        </button>
      </div>
      {/* info */}
      <div style={{ padding:"10px 10px 12px", flex:1, display:"flex", flexDirection:"column", gap:4 }}>
        <div style={{ fontSize:12, fontWeight:700, color:"#111", lineHeight:1.3 }}>{p.name}</div>
        <div style={{ fontSize:11, color:"#9CA3AF" }}>{(p as any).weight || (p as any).spec}</div>
        <div style={{
          display:"inline-flex", alignItems:"center",
          background:"#F0EBF8", borderRadius:6,
          padding:"2px 7px", fontSize:10, fontWeight:700, color:PUR,
          width:"fit-content", marginBottom:2,
        }}>3 Taksit</div>
        <div style={{ fontSize:16, fontWeight:900, color:"#111", marginBottom:4 }}>
          {p.price.toLocaleString("tr-TR")} TL
        </div>
        <button style={{
          width:"100%", background:PUR, color:"#fff", border:"none",
          borderRadius:10, padding:"8px 0", fontSize:12, fontWeight:700,
          cursor:"pointer", fontFamily:"inherit",
        }}>Sepete Ekle</button>
      </div>
    </div>
  );
}

/* ─── Footer Accordion ─── */
function FooterAccordion({ title, items }: { title: string; items: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom:"1px solid rgba(255,255,255,0.1)" }}>
      <button onClick={() => setOpen(o=>!o)}
        style={{
          width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between",
          background:"none", border:"none", color:"#fff", padding:"14px 0",
          fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
        }}>
        {title}
        {open ? <Minus size={16} /> : <Plus size={16} />}
      </button>
      {open && (
        <div style={{ paddingBottom:12, display:"flex", flexDirection:"column", gap:10 }}>
          {items.map(it => (
            <span key={it} style={{ fontSize:13, color:"rgba(255,255,255,0.7)", cursor:"pointer" }}>{it}</span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── MAIN ─── */
export default function YourPoodleV5() {
  const [email, setEmail] = useState("");

  return (
    <>
      {/* Mobile frame wrapper */}
      <div style={{
        minHeight:"100dvh", background:"#F3F0F8",
        display:"flex", justifyContent:"center",
      }}>
        <div style={{
          width:"100%", maxWidth:430,
          background:"#FAFAFA", position:"relative",
          minHeight:"100dvh",
        }}>

          {/* ══ 1. STICKY HEADER ══ */}
          <header style={{
            position:"sticky", top:0, zIndex:100,
            background:"#fff", borderBottom:"1px solid #F0EBF8",
            padding:"12px 16px",
            display:"flex", alignItems:"center", justifyContent:"space-between",
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{
                width:32, height:32, borderRadius:8,
                background:PUR_LIGHT, overflow:"hidden",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <img src="/images/poodle-avatar-1.jpg" alt="logo"
                  style={{ width:"100%", height:"100%", objectFit:"cover" }}
                  onError={e => { (e.target as HTMLImageElement).style.display="none"; }} />
              </div>
              <span style={{ fontSize:17, fontWeight:900, color:PUR }}>YourPoodle</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:13, fontWeight:600, color:"#374151", cursor:"pointer" }}>Giriş Yap</span>
              <button style={{
                background:PUR, color:"#fff", border:"none",
                borderRadius:99, padding:"7px 18px", fontSize:13,
                fontWeight:700, cursor:"pointer", fontFamily:"inherit",
              }}>Üye Ol</button>
            </div>
          </header>

          {/* ══ 2. ICON NAV ══ */}
          <nav style={{
            background:"#fff", borderBottom:"1px solid #F0EBF8",
            display:"flex", justifyContent:"space-around", padding:"8px 0",
          }}>
            {[
              { icon:<ShoppingBag size={20}/>, label:"Mağaza", active:true },
              { icon:<Users size={20}/>,       label:"Club",    active:false },
              { icon:<Bot size={20}/>,         label:"AI Asistan", active:false },
              { icon:<BookOpen size={20}/>,    label:"Rehber",  active:false },
            ].map(n => (
              <div key={n.label} style={{
                display:"flex", flexDirection:"column", alignItems:"center", gap:3,
                padding:"4px 12px", cursor:"pointer",
                borderBottom: n.active ? `2px solid ${PUR}` : "2px solid transparent",
              }}>
                <span style={{ color: n.active ? PUR : "#9CA3AF" }}>{n.icon}</span>
                <span style={{ fontSize:11, fontWeight: n.active ? 700 : 500,
                               color: n.active ? PUR : "#9CA3AF" }}>{n.label}</span>
              </div>
            ))}
          </nav>

          {/* ══ 3. HERO ══ */}
          <section style={{ padding:"12px 12px 0" }}>
            <div style={{
              background:`linear-gradient(135deg, ${PUR_DARK} 0%, ${PUR} 100%)`,
              borderRadius:20, padding:"24px 20px 0",
              overflow:"hidden", position:"relative", minHeight:200,
              display:"flex", flexDirection:"column",
            }}>
              <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.75)",
                            marginBottom:10, letterSpacing:0.3 }}>
                Türkiye'nin en büyük Poodle topluluğu
              </div>
              <h1 style={{
                fontSize:24, fontWeight:900, color:"#fff",
                lineHeight:1.2, marginBottom:10, maxWidth:"60%",
              }}>
                Toy Poodle'ınız için her şey burada.
              </h1>
              <p style={{ fontSize:12, color:"rgba(255,255,255,0.78)", marginBottom:20, maxWidth:"58%" }}>
                Bilgi, alışveriş ve gerçek bir topluluk — tek bir yerde.
              </p>
              <button style={{
                background:"#fff", color:PUR, border:"none",
                borderRadius:99, padding:"10px 22px",
                fontSize:13, fontWeight:800, cursor:"pointer",
                fontFamily:"inherit", alignSelf:"flex-start", marginBottom:0,
              }}>Topluluğa Katıl</button>

              {/* poodle photo — absolute right */}
              <img
                src="/images/poodle-real-hero.jpg"
                alt="Poodle"
                style={{
                  position:"absolute", bottom:0, right:-4,
                  height:200, width:"auto",
                  objectFit:"contain",
                  filter:"drop-shadow(0 4px 16px rgba(0,0,0,0.3))",
                }}
                onError={e => {
                  const el = e.target as HTMLImageElement;
                  el.src = "/images/poodle-hero-transparent.png";
                  el.onerror = () => { el.style.display="none"; };
                }} />
            </div>
          </section>

          {/* ══ 4. FOOD PRODUCTS ══ */}
          <section style={{ padding:"24px 12px 0" }}>
            <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:4 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <CreditCard size={16} color={PUR} />
                <span style={{ fontSize:15, fontWeight:900, color:"#111" }}>Peşin fiyatına 3 taksit</span>
              </div>
            </div>
            <p style={{ fontSize:12, color:"#6B7280", marginBottom:14 }}>
              Toy Poodle'ınıza özel seçilmiş mamalar
            </p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {FOOD.map(p => <PCard key={p.id} p={p} />)}
            </div>
          </section>

          {/* ══ 5. GUIDE ══ */}
          <section style={{ padding:"28px 12px 0" }}>
            <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:4 }}>
              <span style={{ fontSize:15, fontWeight:900, color:"#111" }}>Poodle Rehberi</span>
              <span style={{ fontSize:12, fontWeight:700, color:PUR, cursor:"pointer" }}>Tümünü Gör</span>
            </div>
            <p style={{ fontSize:12, color:"#6B7280", marginBottom:14 }}>
              Poodle'ınız için güvenilir ve pratik bilgiler
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
              {GUIDES.map((g, i) => (
                <div key={g.slug} style={{
                  display:"flex", alignItems:"center", gap:12,
                  padding:"12px 0",
                  borderBottom: i < GUIDES.length-1 ? "1px solid #F3F4F6" : "none",
                  cursor:"pointer",
                }}>
                  <div style={{
                    width:56, height:56, borderRadius:10, overflow:"hidden",
                    flexShrink:0, background:"#EDE7F6",
                  }}>
                    <img src={g.img} alt={g.title}
                      style={{ width:"100%", height:"100%", objectFit:"cover" }}
                      onError={e => { (e.target as HTMLImageElement).style.display="none"; }} />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:"#111", lineHeight:1.3, marginBottom:3 }}>
                      {g.title}
                    </div>
                    <div style={{ fontSize:11, color:"#6B7280", marginBottom:4, lineHeight:1.3 }}>{g.desc}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:4, color:"#9CA3AF" }}>
                      <Clock size={11} />
                      <span style={{ fontSize:11 }}>{g.min} dk</span>
                    </div>
                  </div>
                  <ChevronRight size={16} color="#D1D5DB" />
                </div>
              ))}
            </div>
          </section>

          {/* ══ 6. AI BANNER ══ */}
          <section style={{ padding:"24px 12px 0" }}>
            <div style={{
              background:PUR_LIGHT, borderRadius:16,
              padding:"20px 20px", display:"flex", flexDirection:"column",
              alignItems:"center", textAlign:"center", gap:8,
            }}>
              <div style={{
                width:44, height:44, borderRadius:12, background:PUR,
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <MessageSquare size={22} color="#fff" />
              </div>
              <div style={{ fontSize:16, fontWeight:900, color:"#111" }}>Cevabını hemen bul</div>
              <div style={{ fontSize:12, color:"#6B7280", maxWidth:260 }}>
                Poodle'ınızla ilgili merak ettiğiniz her şeyi sorun.
              </div>
              <button style={{
                width:"100%", background:PUR_DARK, color:"#fff", border:"none",
                borderRadius:12, padding:"12px 0", fontSize:13, fontWeight:700,
                cursor:"pointer", fontFamily:"inherit", marginTop:4,
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              }}>
                <Bot size={15} /> AI Asistan'a Sor
              </button>
            </div>
          </section>

          {/* ══ 7. ACCESSORIES ══ */}
          <section style={{ padding:"28px 12px 0" }}>
            <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:4 }}>
              <span style={{ fontSize:15, fontWeight:900, color:"#111" }}>Poodle'ınıza Özel Ürünler</span>
              <span style={{ fontSize:12, fontWeight:700, color:PUR, cursor:"pointer" }}>Tümünü Gör</span>
            </div>
            <p style={{ fontSize:12, color:"#6B7280", marginBottom:14 }}>
              Stil, bakım ve günlük ihtiyaçlar bir arada
            </p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {ACCESSORIES.map(p => <PCard key={p.id} p={p} withBadge />)}
            </div>
          </section>

          {/* ══ 8. NEWSLETTER ══ */}
          <section style={{ padding:"28px 12px 0" }}>
            <div style={{
              background:PUR_DARK, borderRadius:20, padding:"24px 20px",
            }}>
              <div style={{ fontSize:16, fontWeight:900, color:"#fff", marginBottom:6, textAlign:"center" }}>
                Poodle dünyasından haberdar olun
              </div>
              <p style={{ fontSize:12, color:"rgba(255,255,255,0.7)", textAlign:"center", marginBottom:16 }}>
                Yeni rehberler, kampanyalar ve özel fırsatlar e-postanıza gelsin.
              </p>
              <div style={{ display:"flex", gap:8, marginBottom:10 }}>
                <input
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="E-posta adresiniz"
                  style={{
                    flex:1, border:"none", borderRadius:10, padding:"11px 14px",
                    fontSize:13, fontFamily:"inherit", background:"rgba(255,255,255,0.15)",
                    color:"#fff", outline:"none",
                  }} />
                <button style={{
                  background:"#fff", color:PUR, border:"none",
                  borderRadius:10, padding:"11px 20px", fontSize:13,
                  fontWeight:800, cursor:"pointer", fontFamily:"inherit", flexShrink:0,
                }}>Üye Ol</button>
              </div>
              <p style={{ fontSize:10, color:"rgba(255,255,255,0.5)", textAlign:"center" }}>
                Üye olarak KVKK Aydınlatma Metni'ni kabul etmiş olursunuz.
              </p>
            </div>
          </section>

          {/* ══ 9. FOOTER ══ */}
          <footer style={{ background:PUR_DARK, padding:"32px 20px 24px", marginTop:28 }}>
            {/* logo */}
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
              <div style={{ width:32, height:32, borderRadius:8, background:"rgba(255,255,255,0.15)",
                            overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <img src="/images/poodle-avatar-1.jpg" alt="logo"
                  style={{ width:"100%", height:"100%", objectFit:"cover" }}
                  onError={e => { (e.target as HTMLImageElement).style.display="none"; }} />
              </div>
              <span style={{ fontSize:16, fontWeight:900, color:"#fff" }}>YourPoodle</span>
            </div>
            <p style={{ fontSize:12, color:"rgba(255,255,255,0.6)", marginBottom:24, lineHeight:1.5 }}>
              Toy Poodle'ınızın mutlu ve sağlıklı yaşamı için<br />
              alışveriş, bilgi ve topluluk platformu.
            </p>

            {/* accordion menus */}
            {FOOTER_MENUS.map(m => <FooterAccordion key={m.title} title={m.title} items={m.items} />)}

            {/* contact */}
            <div style={{ marginTop:20, display:"flex", justifyContent:"space-between",
                          flexWrap:"wrap", gap:8, marginBottom:20 }}>
              <span style={{ fontSize:12, color:"rgba(255,255,255,0.65)" }}>📧 destek@yourpoodle.com</span>
              <span style={{ fontSize:12, color:"rgba(255,255,255,0.65)" }}>🕐 Pzt–Cmt 09:00–18:00</span>
            </div>

            {/* social */}
            <div style={{ display:"flex", gap:16, marginBottom:24 }}>
              {[Instagram, Youtube, Facebook].map((Icon, i) => (
                <div key={i} style={{
                  width:36, height:36, borderRadius:10,
                  background:"rgba(255,255,255,0.12)",
                  display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer",
                }}>
                  <Icon size={18} color="rgba(255,255,255,0.85)" />
                </div>
              ))}
              {/* TikTok */}
              <div style={{
                width:36, height:36, borderRadius:10,
                background:"rgba(255,255,255,0.12)",
                display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer",
                fontSize:16,
              }}>♪</div>
            </div>

            {/* trust + payment */}
            <div style={{
              display:"flex", alignItems:"center", justifyContent:"space-between",
              padding:"14px 0", borderTop:"1px solid rgba(255,255,255,0.1)", marginBottom:14,
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <ShieldCheck size={14} color="#A67C52" />
                <span style={{ fontSize:11, color:"rgba(255,255,255,0.65)" }}>256-bit SSL ile güvenli alışveriş</span>
              </div>
              <div style={{ display:"flex", gap:6 }}>
                {["VISA","MC","TROY"].map(b => (
                  <div key={b} style={{
                    background:"rgba(255,255,255,0.15)", borderRadius:5,
                    padding:"3px 8px", fontSize:9, fontWeight:800, color:"#fff",
                  }}>{b}</div>
                ))}
              </div>
            </div>

            {/* copyright */}
            <div style={{ textAlign:"center" }}>
              <p style={{ fontSize:11, color:"rgba(255,255,255,0.45)", marginBottom:8 }}>
                © 2026 YourPoodle. Tüm hakları saklıdır.
              </p>
              <div style={{ display:"flex", justifyContent:"center", gap:16 }}>
                {["Gizlilik","Çerezler","KVKK"].map(l => (
                  <span key={l} style={{ fontSize:11, color:"rgba(255,255,255,0.5)", cursor:"pointer" }}>{l}</span>
                ))}
              </div>
            </div>
          </footer>

        </div>
      </div>
    </>
  );
}
