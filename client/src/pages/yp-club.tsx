// YourPoodle Club — social hub for poodle owners
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Heart, MessageCircle, Share2, Plus, Camera, X,
  Edit3, Check, ChevronLeft, Bell, BellOff, Calendar,
} from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { useCustomer } from "@/contexts/CustomerContext";

/* ─── Types ─────────────────────────────────────────────── */
interface Post {
  id: string;
  author: string;
  poodle: string;
  avatar: string;
  time: string;
  text: string;
  img?: string;
  likes: number;
  comments: number;
  liked: boolean;
}

interface PoodleProfile {
  name: string;
  breed: string;
  age: string;
  color: string;
  about: string;
  photo: string;
}

/* ─── Constants ─────────────────────────────────────────── */
const TABS = [
  { id:"feed",      label:"📰 Akış" },
  { id:"my",        label:"🐩 Poodlem" },
  { id:"people",    label:"👥 Topluluk" },
  { id:"events",    label:"🎉 Etkinlik" },
];

const SEED_POSTS: Post[] = [
  { id:"1", author:"poodlemom_ayse",  poodle:"Mocha",   avatar:"🐩", time:"2 saat önce",   text:"Mocha bugün tıraş oldu 🥰 Müthiş görünüyor! Tıraşını yaptıran var mı bu hafta?", img:"/images/poodle-hero.png", likes:48, comments:12, liked:false },
  { id:"2", author:"toypoodle_mert",  poodle:"Luna",    avatar:"🐾", time:"5 saat önce",   text:"Luna'nın ilk oyun randevusu! Diğer poodlelarla tanışmak onu çok heyecanlandırdı 💜", likes:34, comments:7, liked:false },
  { id:"3", author:"poodle_selin",    poodle:"Biscuit", avatar:"💜", time:"1 gün önce",    text:"Biscuit 1 yaşına girdi! 🎂 Doğum günü pastasını bitirdi hepsini haha. Yorumlarınızı bekliyorum!", likes:92, comments:23, liked:false },
  { id:"4", author:"miniaturist_can", poodle:"Coco",    avatar:"🌸", time:"2 gün önce",    text:"Coco'nun yeni mama markasını denedik. Royal Canin Toy Breed'den çok memnunuz. Tavsiye ederim 👍", likes:27, comments:9, liked:false },
  { id:"5", author:"poodle_istanbul", poodle:"Mochi",   avatar:"⭐", time:"3 gün önce",    text:"Ağırlık kontrolü için hepinize soruyorum — sizin poodleniz kaç kilo? Mochi 3.2 kg, idealmiş! 🐕", likes:61, comments:31, liked:false },
];

const MEMBERS = [
  { emoji:"🐩", name:"poodlemom_ayse",  city:"İstanbul", poodle:"Mocha",   age:"3 yaş",  color:"Bej" },
  { emoji:"🐾", name:"toypoodle_mert",  city:"Ankara",   poodle:"Luna",    age:"2 yaş",  color:"Siyah" },
  { emoji:"💜", name:"poodle_selin",    city:"İzmir",    poodle:"Biscuit", age:"1 yaş",  color:"Kırmızı-Kahve" },
  { emoji:"🌸", name:"miniaturist_can", city:"Bursa",    poodle:"Coco",    age:"4 yaş",  color:"Beyaz" },
  { emoji:"⭐", name:"poodle_istanbul", city:"İstanbul", poodle:"Mochi",   age:"2 yaş",  color:"Gri" },
  { emoji:"🎀", name:"toy_lover_ece",   city:"Antalya",  poodle:"Şeker",   age:"5 yaş",  color:"Krem" },
];

const BREEDS = ["Toy Poodle","Miniature Poodle","Standard Poodle","Moyen Poodle"];
const COLORS = ["Beyaz","Siyah","Bej/Krem","Kahverengi","Gri/Gümüş","Kırmızı","Kayısı","Mavi","Bicolor"];

/* ─── CSS ───────────────────────────────────────────────── */
const CSS = [
  "*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }",
  "body { background: #fff; }",
  ".icon-btn { background: none; border: none; cursor: pointer; display: flex; align-items: center; padding: 6px; border-radius: 8px; }",
  ".card { background: #fff; border-radius: 18px; box-shadow: 0 2px 16px rgba(0,0,0,0.07); overflow: hidden; }",
  ".post-action:hover { background: #F5F0FF; }",
  ".member-row:hover { background: #F5F0FF !important; }",
  ".tab-btn { flex: 1; padding: 10px 4px; font-size: 13px; font-weight: 700; border: none; background: none; cursor: pointer; border-bottom: 2.5px solid transparent; font-family: Inter, sans-serif; transition: color 0.15s; }",
  "textarea:focus { outline: none; border-color: #7C3AFF !important; box-shadow: 0 0 0 3px rgba(124,58,255,0.12); }",
  "input:focus { outline: none; border-color: #7C3AFF !important; }",
  "select:focus { outline: none; border-color: #7C3AFF !important; }",
  "@keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }",
  ".fade-up { animation: fadeUp 0.28s ease both; }",
].join("\n");


/* ─── Post Card ─────────────────────────────────────────── */
function PostCard({ post, onLike }: { post: Post; onLike: (id: string) => void }) {
  return (
    <div className="card fade-up" style={{ marginBottom:14 }}>
      {/* Author row */}
      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"14px 16px 10px" }}>
        <div style={{ width:42, height:42, borderRadius:"50%", background:"linear-gradient(135deg,#EDE8FF,#D4C4FF)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{post.avatar}</div>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontSize:13, fontWeight:800, color:"#1a1a1a" }}>@{post.author}</span>
            <span style={{ fontSize:11, background:"#EDE8FF", color:"#7C3AFF", borderRadius:6, padding:"1px 7px", fontWeight:700 }}>🐩 {post.poodle}</span>
          </div>
          <span style={{ fontSize:11, color:"#aaa" }}>{post.time}</span>
        </div>
      </div>
      {/* Text */}
      <p style={{ fontSize:13.5, color:"#333", lineHeight:1.65, padding:"0 16px 12px", fontFamily:"Inter,sans-serif" }}>{post.text}</p>
      {/* Image */}
      {post.img && <img src={post.img} alt="" style={{ width:"100%", maxHeight:220, objectFit:"cover", display:"block" }} />}
      {/* Actions */}
      <div style={{ display:"flex", borderTop:"1px solid #f5f5f5", padding:"4px 8px" }}>
        <button className="post-action" onClick={() => onLike(post.id)} style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 14px", borderRadius:10, border:"none", background:"none", cursor:"pointer", flex:1, justifyContent:"center", fontFamily:"Inter,sans-serif" }}>
          <Heart size={18} strokeWidth={2} color={post.liked?"#E75480":"#aaa"} fill={post.liked?"#E75480":"none"} />
          <span style={{ fontSize:12, fontWeight:700, color:post.liked?"#E75480":"#aaa" }}>{post.likes + (post.liked?1:0)}</span>
        </button>
        <button className="post-action" style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 14px", borderRadius:10, border:"none", background:"none", cursor:"pointer", flex:1, justifyContent:"center", fontFamily:"Inter,sans-serif" }}>
          <MessageCircle size={18} strokeWidth={2} color="#aaa" />
          <span style={{ fontSize:12, fontWeight:700, color:"#aaa" }}>{post.comments}</span>
        </button>
        <button className="post-action" onClick={() => {
          const url = window.location.href;
          if (navigator.share) {
            navigator.share({ title:"YourPoodle Club", text: post.text.slice(0, 100), url }).catch(()=>{});
          } else {
            navigator.clipboard?.writeText(url).catch(()=>{});
          }
        }} style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 14px", borderRadius:10, border:"none", background:"none", cursor:"pointer", flex:1, justifyContent:"center", fontFamily:"Inter,sans-serif" }}>
          <Share2 size={18} strokeWidth={2} color="#aaa" />
          <span style={{ fontSize:12, fontWeight:700, color:"#aaa" }}>Paylaş</span>
        </button>
      </div>
    </div>
  );
}

/* ─── New Post Modal ────────────────────────────────────── */
function NewPostModal({ poodleName, onClose, onSubmit }: { poodleName: string; onClose: () => void; onSubmit: (text: string, img: string) => void }) {
  const [text, setText] = useState("");
  const [img,  setImg]  = useState("");

  return (
    <div style={{ position:"fixed", inset:0, zIndex:400, background:"rgba(0,0,0,0.5)", display:"flex", flexDirection:"column" }}
      onClick={e => { if (e.target===e.currentTarget) onClose(); }}>
      <div style={{ marginTop:"auto", background:"#fff", borderRadius:"22px 22px 0 0", padding:"20px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
          <span style={{ fontSize:16, fontWeight:800, color:"#1a1a1a", fontFamily:"Inter,sans-serif" }}>Paylaşım Yap</span>
          <button onClick={onClose} style={{ background:"#F5F5F5", border:"none", borderRadius:8, padding:6, cursor:"pointer", display:"flex" }}><X size={18} color="#555"/></button>
        </div>
        <div style={{ display:"flex", gap:10, marginBottom:12 }}>
          <div style={{ width:38, height:38, borderRadius:"50%", background:"linear-gradient(135deg,#7C3AFF,#A855F7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>🐩</div>
          <div>
            <div style={{ fontSize:12, fontWeight:800, color:"#1a1a1a", fontFamily:"Inter,sans-serif" }}>Sen</div>
            <div style={{ fontSize:11, background:"#EDE8FF", color:"#7C3AFF", borderRadius:6, padding:"1px 7px", fontWeight:700, display:"inline-block" }}>🐩 {poodleName || "Poodlem"}</div>
          </div>
        </div>
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Poodlenle ilgili ne paylaşmak istersin?"
          style={{ width:"100%", minHeight:110, borderRadius:14, border:"2px solid #eee", padding:"12px", fontSize:14, color:"#333", fontFamily:"Inter,sans-serif", resize:"none", lineHeight:1.6 }} />
        <div style={{ marginTop:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
            <Camera size={15} color="#888" />
            <span style={{ fontSize:12, color:"#888", fontWeight:600, fontFamily:"Inter,sans-serif" }}>Fotoğraf linki (isteğe bağlı)</span>
          </div>
          <input value={img} onChange={e=>setImg(e.target.value)} placeholder="https://..."
            style={{ width:"100%", height:40, borderRadius:10, border:"2px solid #eee", padding:"0 12px", fontSize:13, fontFamily:"Inter,sans-serif" }} />
        </div>
        <button onClick={() => { if (text.trim()) { onSubmit(text.trim(), img.trim()); onClose(); } }} disabled={!text.trim()}
          style={{ width:"100%", marginTop:14, height:50, borderRadius:14, border:"none", background:text.trim()?"linear-gradient(135deg,#7C3AFF,#A855F7)":"#e8e8e8", color:text.trim()?"#fff":"#bbb", fontSize:15, fontWeight:800, cursor:text.trim()?"pointer":"not-allowed", fontFamily:"Inter,sans-serif" }}>
          Paylaş 🐾
        </button>
      </div>
    </div>
  );
}

/* ─── Poodle Profile Form ───────────────────────────────── */
function PoodleForm({ initial, onSave }: { initial: PoodleProfile; onSave: (p: PoodleProfile) => void }) {
  const [form, setForm] = useState<PoodleProfile>(initial);
  const [saved, setSaved] = useState(false);

  const F = (k: keyof PoodleProfile) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = () => {
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputStyle = { width:"100%", height:46, borderRadius:12, border:"2px solid #eee", padding:"0 14px", fontSize:14, fontFamily:"Inter,sans-serif", color:"#222", background:"#fafafa" };
  const labelStyle = { fontSize:11, fontWeight:700, color:"#555", display:"block" as const, marginBottom:6, fontFamily:"Inter,sans-serif" };

  return (
    <div className="fade-up" style={{ padding:"0 0 20px" }}>
      {/* Preview card */}
      {form.name && (
        <div style={{ background:"linear-gradient(135deg,#7C3AFF,#A855F7)", borderRadius:20, padding:"20px", marginBottom:20, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-20, right:-20, width:100, height:100, borderRadius:"50%", background:"rgba(255,255,255,0.08)" }} />
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            {form.photo ? (
              <img src={form.photo} alt={form.name} style={{ width:60, height:60, borderRadius:"50%", objectFit:"cover", border:"3px solid rgba(255,255,255,0.8)", flexShrink:0 }} onError={e=>{(e.target as HTMLImageElement).style.display="none";}} />
            ) : (
              <div style={{ width:60, height:60, borderRadius:"50%", background:"rgba(255,255,255,0.18)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, flexShrink:0 }}>🐩</div>
            )}
            <div>
              <div style={{ fontSize:20, fontWeight:900, color:"#fff" }}>{form.name}</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.85)", marginTop:2 }}>{form.breed} {form.age ? `· ${form.age}` : ""} {form.color ? `· ${form.color}` : ""}</div>
              {form.about && <div style={{ fontSize:12, color:"rgba(255,255,255,0.75)", marginTop:4, lineHeight:1.5 }}>{form.about}</div>}
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        <div>
          <label style={labelStyle}>Poodle'ınızın Adı *</label>
          <input value={form.name} onChange={F("name")} placeholder="Örn: Mocha" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Irk</label>
          <select value={form.breed} onChange={F("breed")} style={{ ...inputStyle }}>
            <option value="">Seçin...</option>
            {BREEDS.map(b=><option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div>
            <label style={labelStyle}>Yaş</label>
            <input value={form.age} onChange={F("age")} placeholder="Örn: 2 yaş" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Renk</label>
            <select value={form.color} onChange={F("color")} style={{ ...inputStyle }}>
              <option value="">Seçin...</option>
              {COLORS.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label style={labelStyle}>Fotoğraf URL'si</label>
          <input value={form.photo} onChange={F("photo")} placeholder="https://..." style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Hakkında</label>
          <textarea value={form.about} onChange={F("about")} placeholder="Poodle'ınız hakkında birkaç cümle yazın..." rows={3}
            style={{ width:"100%", borderRadius:12, border:"2px solid #eee", padding:"12px 14px", fontSize:14, fontFamily:"Inter,sans-serif", color:"#222", background:"#fafafa", resize:"none", lineHeight:1.6 }} />
        </div>
        <button onClick={handleSave} disabled={!form.name.trim()}
          style={{ height:52, borderRadius:14, border:"none", background:form.name.trim()?"linear-gradient(135deg,#7C3AFF,#A855F7)":"#e8e8e8", color:form.name.trim()?"#fff":"#bbb", fontSize:15, fontWeight:800, cursor:form.name.trim()?"pointer":"not-allowed", fontFamily:"Inter,sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
          {saved ? <><Check size={18}/> Kaydedildi!</> : "Profili Kaydet 🐾"}
        </button>
      </div>
    </div>
  );
}

/* ─── Push Subscription Hook ────────────────────────────── */
function usePushSubscription() {
  const [state, setState] = useState<"idle"|"subscribed"|"denied"|"loading">("idle");

  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) { setState("denied"); return; }
    if (Notification.permission === "denied") { setState("denied"); return; }
    navigator.serviceWorker.ready.then(reg => {
      reg.pushManager.getSubscription().then(sub => {
        setState(sub ? "subscribed" : "idle");
      });
    }).catch(() => setState("denied"));
  }, []);

  const subscribe = async () => {
    setState("loading");
    try {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") { setState("denied"); return; }
      const vapidRes = await fetch("/api/push/vapid-public-key");
      const { publicKey } = await vapidRes.json();
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(sub.toJSON()),
      });
      setState("subscribed");
    } catch { setState("idle"); }
  };

  const unsubscribe = async () => {
    setState("loading");
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setState("idle");
    } catch { setState("idle"); }
  };

  return { state, subscribe, unsubscribe };
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}

/* ─── Main ───────────────────────────────────────────────── */
export default function Club() {
  const [, navigate]   = useLocation();
  const { isLoggedIn } = useCustomer();
  const [activeTab,    setActiveTab]    = useState("feed");
  const [posts,        setPosts]        = useState<Post[]>(SEED_POSTS);
  const [showCompose,  setShowCompose]  = useState(false);
  const [poodle,       setPoodle]       = useState<PoodleProfile>(() => {
    try { return JSON.parse(localStorage.getItem("yp_poodle")||"{}"); } catch { return {}; }
  });
  const { state: pushState, subscribe: pushSubscribe, unsubscribe: pushUnsubscribe } = usePushSubscription();

  // Fetch events from API
  const { data: events = [] } = useQuery<any[]>({
    queryKey: ["/api/yp-events"],
    queryFn: async () => {
      const res = await fetch("/api/yp-events");
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const emptyPoodle: PoodleProfile = { name:"", breed:"", age:"", color:"", about:"", photo:"" };
  const profile: PoodleProfile = { ...emptyPoodle, ...poodle };

  const handleLike = (id: string) =>
    setPosts(ps => ps.map(p => p.id===id ? { ...p, liked:!p.liked } : p));

  const handleNewPost = (text: string, img: string) => {
    const p: Post = {
      id: Date.now().toString(),
      author: "sen",
      poodle: profile.name || "Poodlem",
      avatar: "🐩",
      time: "Az önce",
      text,
      img: img||undefined,
      likes: 0,
      comments: 0,
      liked: false,
    };
    setPosts(ps => [p, ...ps]);
    setActiveTab("feed");
  };

  const handleSavePoodle = (p: PoodleProfile) => {
    setPoodle(p);
    localStorage.setItem("yp_poodle", JSON.stringify(p));
  };

  return (
    <YPLayout activeLink="/yourpoodle/club">
      <title>YourPoodle Club | Poodle Sosyal Topluluğu ve Paylaşım Platformu</title>
      <meta name="description" content="YourPoodle Club: poodle sahiplerinin buluştuğu sosyal platform. Gönderi paylaşın, etkinliklere katılın, poodle profilinizi gösterin ve topluluğa dahil olun." />
      <meta property="og:title" content="YourPoodle Club | Poodle Sosyal Topluluğu" />
      <meta property="og:description" content="Poodle sahiplerinin sosyal platformu. Paylaş, bağlan, topluluğa katıl." />
      <meta property="og:type" content="website" />
      <meta name="robots" content="index, follow" />
      <style>{CSS}</style>

      {showCompose && isLoggedIn && (
        <NewPostModal poodleName={profile.name} onClose={() => setShowCompose(false)} onSubmit={handleNewPost} />
      )}

      <div style={{ background:"#F7F5FF", fontFamily:"Inter,sans-serif" }}>

        {/* Tab bar — page-level sub-nav */}
        <div style={{ display:"flex", background:"#fff", borderBottom:"1px solid #f0f0f0", position:"sticky", top:0, zIndex:50 }}>
          {TABS.map(t => (
            <button key={t.id} className="tab-btn" onClick={() => setActiveTab(t.id)}
              style={{ color:activeTab===t.id?"#7C3AFF":"#888", borderBottomColor:activeTab===t.id?"#7C3AFF":"transparent" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* HERO BANNER (feed tab only) */}
        {activeTab==="feed" && (
          <div style={{ background:"linear-gradient(135deg,#7C3AFF,#9B59FF)", padding:"20px 20px 22px", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:-30, right:-30, width:120, height:120, borderRadius:"50%", background:"rgba(255,255,255,0.07)" }}/>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ fontSize:36 }}>🐩</div>
              <div>
                <div style={{ fontSize:10, fontWeight:800, color:"rgba(255,255,255,0.65)", letterSpacing:"0.1em", marginBottom:3 }}>YourPoodle</div>
                <div style={{ fontSize:18, fontWeight:900, color:"#fff", lineHeight:1.2 }}>Poodle Club</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.82)", marginTop:3 }}>✅ Ücretsiz · 🐾 Poodle sahibi herkese açık</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:16, marginTop:16 }}>
              {[["10.000+","Üye"],["500+","Paylaşım"],["50+","Şehir"]].map(([n,l])=>(
                <div key={l} style={{ textAlign:"center" }}>
                  <div style={{ fontSize:16, fontWeight:900, color:"#fff" }}>{n}</div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.65)" }}>{l}</div>
                </div>
              ))}
            </div>
            {!isLoggedIn && (
              <button onClick={() => navigate("/yourpoodle/giris")}
                style={{ marginTop:16, height:44, borderRadius:14, border:"none", background:"#fff", color:"#7C3AFF", fontSize:13, fontWeight:800, padding:"0 22px", cursor:"pointer", fontFamily:"Inter,sans-serif" }}>
                Ücretsiz Katıl 🐾
              </button>
            )}
          </div>
        )}

        {/* CONTENT */}
        <div style={{ padding:"16px 14px 0" }}>

          {/* ══ FEED TAB ══ */}
          {activeTab==="feed" && (
            <div>
              {/* Compose bar (logged in) */}
              {isLoggedIn && (
                <button onClick={() => setShowCompose(true)}
                  style={{ width:"100%", display:"flex", alignItems:"center", gap:12, background:"#fff", borderRadius:16, padding:"12px 16px", border:"2px dashed #DDD8FF", cursor:"pointer", marginBottom:16, fontFamily:"Inter,sans-serif" }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#7C3AFF,#A855F7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>🐩</div>
                  <span style={{ fontSize:14, color:"#aaa", fontWeight:600, textAlign:"left" }}>Poodlenle ilgili bir şey paylaş...</span>
                  <div style={{ marginLeft:"auto", width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#7C3AFF,#A855F7)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Plus size={18} color="#fff" strokeWidth={2.5}/>
                  </div>
                </button>
              )}

              {/* Push notification opt-in */}
              {pushState !== "denied" && (
                <div style={{ background: pushState === "subscribed" ? "#F0FFF4" : "#fff", borderRadius:16, padding:"14px 16px", marginBottom:14, border:`1.5px solid ${pushState==="subscribed"?"#BBF7D0":"#EDE8FF"}`, display:"flex", alignItems:"center", gap:12 }}>
                  {pushState === "subscribed"
                    ? <Bell size={22} color="#16A34A" />
                    : <Bell size={22} color="#7C3AFF" />}
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:800, color:"#1a1a1a" }}>
                      {pushState === "subscribed" ? "Bildirimler Aktif ✅" : "Bildirimler Al 🔔"}
                    </div>
                    <div style={{ fontSize:11, color:"#888" }}>
                      {pushState === "subscribed" ? "Yeni etkinlik ve içeriklerden haberdar oluyorsunuz" : "Yeni etkinlik ve içeriklerden anında haberdar ol"}
                    </div>
                  </div>
                  <button
                    onClick={pushState === "subscribed" ? pushUnsubscribe : pushSubscribe}
                    disabled={pushState === "loading"}
                    style={{ padding:"8px 14px", borderRadius:12, border:"none", background: pushState==="subscribed"?"#F0FFF4":"#7C3AFF", color:pushState==="subscribed"?"#16A34A":"#fff", fontSize:12, fontWeight:800, cursor:"pointer", fontFamily:"Inter,sans-serif", whiteSpace:"nowrap" }}>
                    {pushState === "loading" ? "…" : pushState === "subscribed" ? "Kapat" : "Aç"}
                  </button>
                </div>
              )}

              {/* Guest join CTA */}
              {!isLoggedIn && (
                <div style={{ background:"#fff", borderRadius:16, padding:"16px", marginBottom:16, border:"1.5px solid #EDE8FF", display:"flex", alignItems:"center", gap:12 }}>
                  <span style={{ fontSize:28 }}>✏️</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:800, color:"#1a1a1a" }}>Siz de paylaşın!</div>
                    <div style={{ fontSize:11, color:"#888" }}>Paylaşım yapmak için ücretsiz üye olun</div>
                  </div>
                  <button onClick={() => navigate("/yourpoodle/giris")}
                    style={{ padding:"8px 14px", borderRadius:12, border:"none", background:"#7C3AFF", color:"#fff", fontSize:12, fontWeight:800, cursor:"pointer", fontFamily:"Inter,sans-serif", whiteSpace:"nowrap" }}>
                    Katıl
                  </button>
                </div>
              )}

              {/* Posts */}
              {posts.map(post => (
                <PostCard key={post.id} post={post} onLike={handleLike} />
              ))}
            </div>
          )}

          {/* ══ MY POODLE TAB ══ */}
          {activeTab==="my" && (
            <div className="fade-up">
              {!isLoggedIn ? (
                <div style={{ textAlign:"center", paddingTop:40, paddingBottom:40 }}>
                  <div style={{ fontSize:56, marginBottom:16 }}>🐩</div>
                  <div style={{ fontSize:18, fontWeight:900, color:"#1a1a1a", marginBottom:8 }}>Poodle Profilini Oluştur</div>
                  <p style={{ fontSize:13, color:"#888", lineHeight:1.7, marginBottom:24, maxWidth:260, margin:"0 auto 24px" }}>
                    Poodle'ınız için bir profil oluşturun, fotoğraf ve bilgilerini ekleyin.
                  </p>
                  <button onClick={() => navigate("/yourpoodle/giris")}
                    style={{ height:50, borderRadius:14, border:"none", background:"linear-gradient(135deg,#7C3AFF,#A855F7)", color:"#fff", fontSize:14, fontWeight:800, padding:"0 32px", cursor:"pointer", fontFamily:"Inter,sans-serif" }}>
                    Ücretsiz Üye Ol 🐾
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20 }}>
                    <Edit3 size={18} color="#7C3AFF" />
                    <span style={{ fontSize:16, fontWeight:800, color:"#1a1a1a" }}>Poodle Profilim</span>
                  </div>
                  <PoodleForm initial={profile} onSave={handleSavePoodle} />
                </div>
              )}
            </div>
          )}

          {/* ══ EVENTS TAB ══ */}
          {activeTab==="events" && (
            <div className="fade-up">
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
                <span style={{ fontSize:16, fontWeight:800, color:"#1a1a1a" }}>🎉 Etkinlikler</span>
              </div>
              {events.length === 0 ? (
                <div style={{ textAlign:"center", padding:"40px 0", color:"#aaa" }}>
                  <Calendar size={40} style={{ marginBottom:12, opacity:0.3 }} />
                  <div style={{ fontSize:14, fontWeight:700 }}>Yakında etkinlik duyurulacak</div>
                  <div style={{ fontSize:12, marginTop:4 }}>Bildirimleri açarak ilk öğrenen siz olun!</div>
                  {pushState !== "denied" && pushState !== "subscribed" && (
                    <button onClick={pushSubscribe}
                      style={{ marginTop:16, padding:"10px 22px", borderRadius:14, border:"none", background:"linear-gradient(135deg,#7C3AFF,#A855F7)", color:"#fff", fontSize:13, fontWeight:800, cursor:"pointer", fontFamily:"Inter,sans-serif" }}>
                      🔔 Bildirim Aç
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {events.map((ev: any) => (
                    <div key={ev.id} className="card" style={{ padding:"18px 16px" }}>
                      {ev.image && <img src={ev.image} alt={ev.title} style={{ width:"100%", height:140, objectFit:"cover", borderRadius:12, marginBottom:12, display:"block" }} />}
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                        <span style={{ fontSize:11, background:"#EDE8FF", color:"#7C3AFF", borderRadius:6, padding:"2px 8px", fontWeight:700 }}>🎉 Etkinlik</span>
                        {ev.date && <span style={{ fontSize:11, color:"#aaa" }}>{new Date(ev.date).toLocaleDateString("tr-TR", { day:"numeric", month:"long", year:"numeric" })}</span>}
                      </div>
                      <div style={{ fontSize:15, fontWeight:900, color:"#1a1a1a", marginBottom:6 }}>{ev.title}</div>
                      {ev.description && <p style={{ fontSize:13, color:"#555", lineHeight:1.65, fontFamily:"Inter,sans-serif" }}>{ev.description}</p>}
                      {ev.location && <div style={{ fontSize:12, color:"#888", marginTop:8 }}>📍 {ev.location}</div>}
                      {ev.link && (
                        <a href={ev.link} target="_blank" rel="noopener noreferrer"
                          style={{ display:"inline-block", marginTop:12, padding:"9px 18px", borderRadius:12, background:"linear-gradient(135deg,#7C3AFF,#A855F7)", color:"#fff", fontSize:13, fontWeight:800, textDecoration:"none" }}>
                          Detaylar →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ COMMUNITY TAB ══ */}
          {activeTab==="people" && (
            <div className="fade-up">
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
                <span style={{ fontSize:16, fontWeight:800, color:"#1a1a1a" }}>👥 Club Üyeleri</span>
                <span style={{ fontSize:12, color:"#7C3AFF", fontWeight:700 }}>{MEMBERS.length + 9994} üye</span>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {MEMBERS.map(m => (
                  <div key={m.name} className="member-row" style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 14px", background:"#fff", borderRadius:16, cursor:"pointer", transition:"background 0.15s" }}>
                    <div style={{ width:46, height:46, borderRadius:"50%", background:"linear-gradient(135deg,#EDE8FF,#D4C4FF)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{m.emoji}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                        <span style={{ fontSize:13, fontWeight:800, color:"#1a1a1a" }}>@{m.name}</span>
                        <span style={{ fontSize:11, background:"#EDE8FF", color:"#7C3AFF", borderRadius:6, padding:"1px 7px", fontWeight:700 }}>🐩 {m.poodle}</span>
                      </div>
                      <div style={{ fontSize:11, color:"#aaa", marginTop:2 }}>{m.city} · {m.age} · {m.color}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Join banner for guests */}
              {!isLoggedIn && (
                <div style={{ marginTop:20, background:"linear-gradient(135deg,#7C3AFF,#A855F7)", borderRadius:20, padding:"22px", textAlign:"center" }}>
                  <div style={{ fontSize:32, marginBottom:10 }}>🐾</div>
                  <div style={{ fontSize:16, fontWeight:900, color:"#fff", marginBottom:6 }}>Sen de aramıza katıl!</div>
                  <p style={{ fontSize:12, color:"rgba(255,255,255,0.82)", marginBottom:16, lineHeight:1.6 }}>Ücretsiz üye ol, poodle profilini oluştur, paylaşım yap.</p>
                  <button onClick={() => navigate("/yourpoodle/giris")}
                    style={{ height:46, borderRadius:14, border:"none", background:"#fff", color:"#7C3AFF", fontSize:13, fontWeight:800, padding:"0 28px", cursor:"pointer", fontFamily:"Inter,sans-serif" }}>
                    Ücretsiz Katıl 🐾
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* FAB — compose (logged in, feed tab) */}
        {isLoggedIn && activeTab==="feed" && (
          <button onClick={() => setShowCompose(true)}
            style={{ position:"fixed", bottom:20, right:20, width:54, height:54, borderRadius:"50%", background:"linear-gradient(135deg,#7C3AFF,#A855F7)", border:"none", boxShadow:"0 6px 20px rgba(124,58,255,0.45)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", zIndex:150 }}>
            <Plus size={24} color="#fff" strokeWidth={2.5}/>
          </button>
        )}
      </div>
    </YPLayout>
  );
}
