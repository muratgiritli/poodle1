// YourPoodle Club — poodle sahiplerinin özel kulübü
import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Heart, MessageCircle, Share2, Plus, Camera, X, Search,
  Edit3, Check, MapPin, Calendar, ChevronRight, Bot, HelpCircle, Filter,
} from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { useCustomer } from "@/contexts/CustomerContext";

/* ─── Types ─────────────────────────────────────────────── */
interface Post {
  id: string; author: string; poodle: string; avatar: string;
  time: string; text: string; img?: string;
  likes: number; comments: number; liked: boolean;
  cat?: string; type?: "post" | "question";
}
interface PoodleProfile { name: string; breed: string; age: string; color: string; about: string; photo: string; }
interface PoodleCard { id: number; name: string; initials: string; breed: string; ageGroup: string; age: string; city: string; weight: string; mama: string; bio: string; color: string; }

/* ─── Constants ─────────────────────────────────────────── */
const TABS = [
  { id:"akis",     label:"Ana Sayfa" },
  { id:"poodlem",  label:"Poodlem" },
  { id:"etkinlik", label:"Etkinlik" },
];

const FEED_CATS = [
  { id:"tumu",   label:"Tümü" },
  { id:"tiras",  label:"Tıraş & Bakım" },
  { id:"mama",   label:"Mama" },
  { id:"saglik", label:"Sağlık" },
  { id:"egitim", label:"Eğitim" },
  { id:"oyun",   label:"Oyun arkadaşı" },
];

const BREED_FILTERS = ["Tümü","Toy Poodle","Miniature Poodle"];
const AGE_FILTERS   = [{ id:"tumu", label:"Tümü" },{ id:"yavru", label:"Yavru 0–1" },{ id:"yetiskin", label:"Yetişkin" },{ id:"yasli", label:"Yaşlı 7+" }];
const CITY_FILTERS  = ["Tüm şehirler","İstanbul","Ankara","İzmir","Antalya","Samsun"];

const SEED_POSTS: Post[] = [
  { id:"1", author:"poodlemom_ayse",  poodle:"Mocha",   avatar:"MO", time:"2 saat önce",  cat:"tiras", type:"post",     text:"Mocha bugün tıraş oldu! Müthiş görünüyor. #tiras #bakim", img:"/images/poodle-hero.png", likes:48, comments:12, liked:false },
  { id:"2", author:"toypoodle_mert",  poodle:"Luna",    avatar:"LU", time:"5 saat önce",  cat:"oyun",  type:"post",     text:"Luna'nın ilk oyun randevusu! Diğer poodlelarla tanışmak onu çok heyecanlandırdı. #oyun #sosyallesme", likes:34, comments:7, liked:false },
  { id:"3", author:"poodle_selin",    poodle:"Biscuit", avatar:"BI", time:"1 gün önce",   cat:"egitim",type:"post",     text:"Biscuit 1 yaşına girdi! Doğum günü pastasını bitirdi hepsini. Tuvalet eğitimini de tamamladı bu ay. #egitim #doğumgünü", likes:92, comments:23, liked:false },
  { id:"4", author:"miniaturist_can", poodle:"Coco",    avatar:"CO", time:"2 gün önce",   cat:"mama",  type:"post",     text:"Coco'nun yeni mama markasını denedik. Royal Canin Toy Breed'den çok memnunuz. #mama #beslenme", likes:27, comments:9, liked:false },
  { id:"5", author:"poodle_istanbul", poodle:"Mochi",   avatar:"MC", time:"3 gün önce",   cat:"saglik",type:"question", text:"Ağırlık kontrolü için hepinize soruyorum — sizin poodleniz kaç kilo? Mochi 3.2 kg, idealmiş! #saglik", likes:61, comments:31, liked:false },
];

const DEMO_COMMENTS: Record<string, {author:string; text:string}[]> = {
  "1": [{ author:"toypoodle_mert", text:"Çok güzel! Hangi kuaföre gidiyor?" }, { author:"poodle_selin", text:"Mocha süper görünüyor!" }],
  "3": [{ author:"miniaturist_can", text:"Mutlu yıllar Biscuit!" }, { author:"poodle_istanbul", text:"Pastadan bir şeyler kaldı mı?" }],
};

const ALL_POODLES: PoodleCard[] = [
  { id:1,  name:"Mocha",   initials:"MO", breed:"Toy Poodle",       ageGroup:"yetiskin", age:"3 yaş",   city:"İstanbul", weight:"3.2 kg", mama:"Royal Canin", bio:"Çikolata rengi toy poodle.", color:"#C8956C" },
  { id:2,  name:"Luna",    initials:"LU", breed:"Toy Poodle",       ageGroup:"yetiskin", age:"2 yaş",   city:"Ankara",   weight:"2.8 kg", mama:"Pro Plan",    bio:"Siyah toy poodle, enerjik.",  color:"#2D2D2D" },
  { id:3,  name:"Biscuit", initials:"BI", breed:"Miniature Poodle", ageGroup:"yavru",    age:"1 yaş",   city:"İzmir",    weight:"5.1 kg", mama:"Hill's",      bio:"Kırmızı-kahve miniature.",    color:"#A0522D" },
  { id:4,  name:"Coco",    initials:"CO", breed:"Miniature Poodle", ageGroup:"yetiskin", age:"4 yaş",   city:"Bursa",    weight:"6.2 kg", mama:"Royal Canin", bio:"Beyaz miniature poodle.",     color:"#E8E8E8" },
  { id:5,  name:"Mochi",   initials:"MC", breed:"Toy Poodle",       ageGroup:"yetiskin", age:"2 yaş",   city:"İstanbul", weight:"3.2 kg", mama:"",            bio:"Gri toy poodle.",             color:"#A8A8A8" },
  { id:6,  name:"Şeker",   initials:"ŞK", breed:"Toy Poodle",       ageGroup:"yetiskin", age:"5 yaş",   city:"Antalya",  weight:"2.9 kg", mama:"N&D",         bio:"Krem toy poodle.",            color:"#F5DEB3" },
  { id:7,  name:"Peri",    initials:"PE", breed:"Toy Poodle",       ageGroup:"yavru",    age:"8 ay",    city:"İstanbul", weight:"1.8 kg", mama:"Royal Canin", bio:"Her şeyi merak eden mini poodle.", color:"#FFFFF0" },
  { id:8,  name:"Atlas",   initials:"AT", breed:"Miniature Poodle", ageGroup:"yetiskin", age:"3 yaş",   city:"Ankara",   weight:"5.8 kg", mama:"Hill's",      bio:"Siyah miniature poodle.",     color:"#1C1C1C" },
  { id:9,  name:"Pamuk",   initials:"PA", breed:"Toy Poodle",       ageGroup:"yasli",    age:"7 yaş",   city:"Samsun",   weight:"3.0 kg", mama:"Royal Canin", bio:"Beyaz toy poodle, sakin.",    color:"#FFFFFF" },
  { id:10, name:"Rio",     initials:"RI", breed:"Toy Poodle",       ageGroup:"yavru",    age:"1.5 yaş", city:"İzmir",    weight:"2.6 kg", mama:"Pro Plan",    bio:"Kızıl toy poodle.",           color:"#CD853F" },
  { id:11, name:"Latte",   initials:"LA", breed:"Toy Poodle",       ageGroup:"yetiskin", age:"4 yaş",   city:"İstanbul", weight:"3.4 kg", mama:"N&D",         bio:"Açık kahve toy poodle.",      color:"#D2B48C" },
  { id:12, name:"Elsa",    initials:"EL", breed:"Miniature Poodle", ageGroup:"yetiskin", age:"2 yaş",   city:"Ankara",   weight:"5.3 kg", mama:"",            bio:"Gümüş miniature poodle.",     color:"#C0C0C0" },
];

const FALLBACK_EVENTS = [
  { id:1, day:"26", month:"TEM", time:"10:00", title:"Poodle Buluşması — Kadıköy", location:"İstanbul", venue:"Moda Sahili", desc:"İstanbul poodle severler Kadıköy Moda sahilinde buluşuyor.", color:"#7C3AED", type:"Yüz yüze", free:true,  participants:23, featured:true  },
  { id:2, day:"09", month:"AĞU", time:"19:30", title:"Online: Tıraş Teknikleri Webinarı", location:"Online", venue:"Zoom", desc:"Uzman groomer Selin Demir ile ev ortamında tıraş teknikleri.", color:"#A855F7", type:"Online",    free:true,  participants:41, featured:false },
  { id:3, day:"23", month:"AĞU", time:"09:00", title:"Poodle Agility Yarışması",     location:"Ankara",   venue:"Atatürk Orman Çiftliği", desc:"Tüm yaş grupları için ayrı kategoriler.", color:"#6D28D9", type:"Yüz yüze", free:false, participants:17, featured:false },
  { id:4, day:"06", month:"EYL", time:"14:00", title:"Poodle Fotoğraf Günü",         location:"İzmir",    venue:"Kordon", desc:"Profesyonel fotoğrafçı eşliğinde anılar.", color:"#7C3AED", type:"Yüz yüze", free:false, participants:12, featured:false },
];

const BREEDS = ["Toy Poodle","Miniature Poodle","Standard Poodle","Moyen Poodle"];
const COLORS = ["Beyaz","Siyah","Bej/Krem","Kahverengi","Gri/Gümüş","Kırmızı","Kayısı","Bicolor"];

/* ─── Hashtag parser ─────────────────────────────────────── */
function renderText(text: string, onTag: (tag: string) => void) {
  const parts = text.split(/(#\w+)/g);
  return parts.map((part, i) => {
    if (part.startsWith("#")) {
      const tag = part.slice(1).toLowerCase();
      const catId = FEED_CATS.find(c => c.id === tag || c.label.toLowerCase().replace(/[^a-z]/g,"") === tag)?.id ?? "tumas";
      return (
        <button key={i} onClick={() => onTag(tag)}
          style={{ background:"none", border:"none", color:"#7C3AED", fontWeight:700, cursor:"pointer", padding:0, fontSize:"inherit", fontFamily:"inherit" }}>
          {part}
        </button>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

/* ─── Initials Avatar ────────────────────────────────────── */
function InitialsAvatar({ initials, size=42, color="#7C3AED" }: { initials:string; size?:number; color?:string }) {
  const bg = color.startsWith("#") ? color : "#7C3AED";
  const luma = parseInt(bg.slice(1,3),16)*0.299 + parseInt(bg.slice(3,5),16)*0.587 + parseInt(bg.slice(5,7),16)*0.114;
  const textColor = luma > 180 ? "#333" : "#fff";
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:`linear-gradient(135deg, ${bg}cc, ${bg})`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:size*0.35, fontWeight:800, color:textColor, border:"2px solid rgba(255,255,255,0.6)" }}>
      {initials}
    </div>
  );
}

/* ─── Post Card ─────────────────────────────────────────── */
function PostCard({ post, onLike, isLoggedIn, onJoin, onTagClick }: {
  post: Post; onLike: (id: string) => void; isLoggedIn: boolean; onJoin: () => void; onTagClick: (tag: string) => void;
}) {
  const [, navigate] = useLocation();
  const [showComments, setShowComments] = useState(false);
  const postComments = DEMO_COMMENTS[post.id] ?? [];
  const isQuestion = post.type === "question";

  return (
    <article style={{ background:"#fff", borderRadius:16, border:"1px solid #E5E7EB", marginBottom:16, overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
      {/* Question indicator */}
      {isQuestion && (
        <div style={{ background:"#EFF6FF", borderBottom:"1px solid #DBEAFE", padding:"7px 16px", display:"flex", alignItems:"center", gap:6 }}>
          <HelpCircle size={13} color="#3B82F6" strokeWidth={2.5}/>
          <span style={{ fontSize:11, fontWeight:700, color:"#1D4ED8" }}>Soru</span>
          <a href="/yourpoodle/ai-asistan" style={{ marginLeft:"auto", fontSize:11, color:"#7C3AED", fontWeight:700, textDecoration:"none" }}>🤖 AI'ya sor →</a>
        </div>
      )}
      {/* Author row */}
      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"14px 16px 10px" }}>
        <InitialsAvatar initials={post.avatar} size={40} />
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
            <span style={{ fontSize:13, fontWeight:800, color:"#1A1A1A" }}>@{post.author}</span>
            <span style={{ fontSize:11, background:"#EDE8FF", color:"#7C3AED", borderRadius:6, padding:"1px 7px", fontWeight:700 }}>{post.poodle}</span>
          </div>
          <span style={{ fontSize:11, color:"#9CA3AF" }}>{post.time}</span>
        </div>
      </div>
      {/* Text with hashtag links */}
      <p style={{ fontSize:13.5, color:"#374151", lineHeight:1.7, padding:"0 16px 12px", margin:0 }}>
        {renderText(post.text, onTagClick)}
      </p>
      {/* Image */}
      {post.img && <img src={post.img} alt={`${post.poodle} fotoğrafı`} loading="lazy" style={{ width:"100%", maxHeight:240, objectFit:"cover", display:"block" }} />}
      {/* Actions */}
      <div style={{ display:"flex", borderTop:"1px solid #F3F4F6", padding:"2px 8px" }}>
        <button onClick={() => { if (!isLoggedIn) { onJoin(); return; } onLike(post.id); }}
          style={{ display:"flex", alignItems:"center", gap:5, padding:"8px 12px", borderRadius:10, border:"none", background:"none", cursor:"pointer", flex:1, justifyContent:"center" }}>
          <Heart size={17} strokeWidth={2} color={post.liked?"#E75480":"#9CA3AF"} fill={post.liked?"#E75480":"none"} />
          <span style={{ fontSize:12, fontWeight:700, color:post.liked?"#E75480":"#9CA3AF" }}>{post.likes + (post.liked?1:0)}</span>
        </button>
        <button onClick={() => setShowComments(s => !s)}
          style={{ display:"flex", alignItems:"center", gap:5, padding:"8px 12px", borderRadius:10, border:"none", background:"none", cursor:"pointer", flex:1, justifyContent:"center" }}>
          <MessageCircle size={17} strokeWidth={2} color={showComments?"#7C3AED":"#9CA3AF"} />
          <span style={{ fontSize:12, fontWeight:700, color:showComments?"#7C3AED":"#9CA3AF" }}>{post.comments}</span>
        </button>
        <button onClick={() => {
          const url = `${window.location.origin}/yourpoodle/club/post/${post.id}`;
          if (navigator.share) { navigator.share({ title:"YourPoodle Club", text:post.text.slice(0,100), url }).catch(()=>{}); }
          else { navigator.clipboard?.writeText(url).catch(()=>{}); }
        }} style={{ display:"flex", alignItems:"center", gap:5, padding:"8px 12px", borderRadius:10, border:"none", background:"none", cursor:"pointer", flex:1, justifyContent:"center" }}>
          <Share2 size={17} strokeWidth={2} color="#9CA3AF" />
          <span style={{ fontSize:12, fontWeight:700, color:"#9CA3AF" }}>Paylaş</span>
        </button>
      </div>
      {/* Comments */}
      {showComments && (
        <div style={{ padding:"12px 16px 16px", borderTop:"1px solid #F3F4F6", background:"#F9FAFB" }}>
          {postComments.map(c => (
            <div key={c.author} style={{ display:"flex", gap:8, alignItems:"flex-start", marginBottom:10 }}>
              <InitialsAvatar initials={c.author.slice(0,2).toUpperCase()} size={26} />
              <div style={{ background:"#fff", borderRadius:12, padding:"8px 12px", flex:1, border:"1px solid #E5E7EB" }}>
                <span style={{ fontSize:11, fontWeight:800, color:"#7C3AED" }}>@{c.author} </span>
                <span style={{ fontSize:12.5, color:"#374151" }}>{c.text}</span>
              </div>
            </div>
          ))}
          {isLoggedIn ? (
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <InitialsAvatar initials="SN" size={26} />
              <input placeholder="Yorum yaz..." style={{ flex:1, height:34, borderRadius:10, border:"1.5px solid #E5E7EB", padding:"0 12px", fontSize:13, outline:"none", background:"#fff" }} />
            </div>
          ) : (
            <button onClick={onJoin} style={{ width:"100%", padding:"9px", borderRadius:10, border:"1.5px solid #EDE8FF", background:"#fff", color:"#7C3AED", fontSize:12, fontWeight:700, cursor:"pointer" }}>
              Yorum yapmak için ücretsiz katıl →
            </button>
          )}
        </div>
      )}
    </article>
  );
}

/* ─── New Post Modal ────────────────────────────────────── */
function NewPostModal({ poodleName, onClose, onSubmit }: { poodleName:string; onClose:()=>void; onSubmit:(text:string,img:string,type:"post"|"question")=>void }) {
  const [text, setText] = useState("");
  const [img,  setImg]  = useState("");
  const [type, setType] = useState<"post"|"question">("post");

  return (
    <div style={{ position:"fixed", inset:0, zIndex:400, background:"rgba(0,0,0,0.5)", display:"flex", flexDirection:"column" }}
      onClick={e => { if (e.target===e.currentTarget) onClose(); }}>
      <div style={{ marginTop:"auto", background:"#fff", borderRadius:"22px 22px 0 0", padding:"20px", maxHeight:"90vh", overflowY:"auto" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
          <span style={{ fontSize:16, fontWeight:800, color:"#1A1A1A" }}>Paylaşım Yap</span>
          <button onClick={onClose} style={{ background:"#F5F5F5", border:"none", borderRadius:8, padding:6, cursor:"pointer", display:"flex" }}><X size={18} color="#555"/></button>
        </div>
        {/* Type selector */}
        <div style={{ display:"flex", gap:8, marginBottom:16 }}>
          {[{ id:"post", icon:"📸", label:"Fotoğraf / Paylaşım" }, { id:"question", icon:"❓", label:"Soru sor" }].map(t => (
            <button key={t.id} onClick={() => setType(t.id as "post"|"question")}
              style={{ flex:1, padding:"10px 8px", borderRadius:12, border:`2px solid ${type===t.id?"#7C3AED":"#E5E7EB"}`, background:type===t.id?"#F5F0FF":"#fff", cursor:"pointer", fontSize:12.5, fontWeight:700, color:type===t.id?"#7C3AED":"#555" }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
        <div style={{ display:"flex", gap:10, marginBottom:12 }}>
          <InitialsAvatar initials="SN" size={38} />
          <div>
            <div style={{ fontSize:12, fontWeight:800, color:"#1A1A1A" }}>Sen</div>
            {poodleName && <div style={{ fontSize:11, background:"#EDE8FF", color:"#7C3AED", borderRadius:6, padding:"1px 7px", fontWeight:700, display:"inline-block", marginTop:2 }}>{poodleName}</div>}
          </div>
        </div>
        <textarea value={text} onChange={e=>setText(e.target.value)}
          placeholder={type==="question" ? "Sorunuzu yazın... (AI Asistan da yardımcı olabilir)" : "Poodlenle ilgili ne paylaşmak istersin?"}
          style={{ width:"100%", minHeight:110, borderRadius:14, border:"2px solid #E5E7EB", padding:"12px", fontSize:14, color:"#333", fontFamily:"Inter,sans-serif", resize:"none", lineHeight:1.6, outline:"none", boxSizing:"border-box" }} />
        {type==="post" && (
          <div style={{ marginTop:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
              <Camera size={14} color="#888" />
              <span style={{ fontSize:12, color:"#888", fontWeight:600 }}>Fotoğraf linki (isteğe bağlı)</span>
            </div>
            <input value={img} onChange={e=>setImg(e.target.value)} placeholder="https://..."
              style={{ width:"100%", height:40, borderRadius:10, border:"2px solid #E5E7EB", padding:"0 12px", fontSize:13, outline:"none", boxSizing:"border-box" }} />
          </div>
        )}
        <button onClick={() => { if (text.trim()) { onSubmit(text.trim(), img.trim(), type); onClose(); } }} disabled={!text.trim()}
          style={{ width:"100%", marginTop:14, height:50, borderRadius:14, border:"none", background:text.trim()?"#7C3AED":"#E5E7EB", color:text.trim()?"#fff":"#9CA3AF", fontSize:15, fontWeight:800, cursor:text.trim()?"pointer":"not-allowed" }}>
          {type==="question" ? "Soru Gönder" : "Paylaş"}
        </button>
      </div>
    </div>
  );
}

/* ─── Poodle Detail Modal ────────────────────────────────── */
function PoodleDetailModal({ p, onClose }: { p: PoodleCard; onClose: () => void }) {
  const similar = ALL_POODLES.filter(x => x.id !== p.id && (x.city === p.city || x.ageGroup === p.ageGroup)).slice(0, 4);
  return (
    <div style={{ position:"fixed", inset:0, zIndex:400, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center" }}
      onClick={e => { if (e.target===e.currentTarget) onClose(); }}>
      <div style={{ background:"#fff", borderRadius:20, maxWidth:420, width:"calc(100% - 24px)", maxHeight:"88vh", overflowY:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
        {/* Header */}
        <div style={{ background:`linear-gradient(135deg,#7C3AED,#A855F7)`, padding:"24px 20px 20px", position:"relative" }}>
          <button onClick={onClose} style={{ position:"absolute", top:14, right:14, background:"rgba(255,255,255,0.2)", border:"none", borderRadius:8, padding:6, cursor:"pointer", display:"flex" }}><X size={16} color="#fff"/></button>
          <InitialsAvatar initials={p.initials} size={64} color={p.color} />
          <div style={{ marginTop:12, color:"#fff" }}>
            <div style={{ fontSize:22, fontWeight:900 }}>{p.name}</div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.85)", marginTop:3 }}>{p.breed} · {p.age} · {p.weight}</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.75)", marginTop:2 }}>📍 {p.city}</div>
          </div>
        </div>
        <div style={{ padding:"20px" }}>
          <p style={{ fontSize:13.5, color:"#4B5563", lineHeight:1.7, margin:"0 0 16px" }}>{p.bio}</p>
          {p.mama && (
            <div style={{ display:"flex", gap:8, alignItems:"center", padding:"10px 12px", background:"#FFF7ED", borderRadius:10, marginBottom:16 }}>
              <span style={{ fontSize:18 }}>🍖</span>
              <div><div style={{ fontSize:11, color:"#78350F", fontWeight:700 }}>Mama Markası</div><div style={{ fontSize:13, color:"#92400E", fontWeight:600 }}>{p.mama}</div></div>
            </div>
          )}
          {similar.length > 0 && (
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:"#6B7280", marginBottom:10 }}>Benzer Poodle'lar</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {similar.map(s => (
                  <div key={s.id} style={{ padding:"10px", background:"#F9FAFB", borderRadius:12, border:"1px solid #E5E7EB" }}>
                    <InitialsAvatar initials={s.initials} size={32} color={s.color} />
                    <div style={{ fontSize:12.5, fontWeight:700, color:"#1A1A1A", marginTop:6 }}>{s.name}</div>
                    <div style={{ fontSize:11, color:"#9CA3AF" }}>{s.age} · {s.city}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={{ display:"flex", gap:8, marginTop:16 }}>
            <button onClick={() => { navigator.clipboard?.writeText(`${window.location.origin}/yourpoodle/club?tab=poodlem&id=${p.id}`).catch(()=>{}); onClose(); }}
              style={{ flex:1, height:42, borderRadius:12, border:"1.5px solid #E5E7EB", background:"#fff", color:"#555", fontSize:13, fontWeight:700, cursor:"pointer" }}>
              Profili Paylaş
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Poodle Profile Form ─────────────────────────────────── */
function PoodleForm({ initial, onSave }: { initial: PoodleProfile; onSave: (p: PoodleProfile) => void }) {
  const [form, setForm] = useState<PoodleProfile>(initial);
  const [saved, setSaved] = useState(false);
  const F = (k: keyof PoodleProfile) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => setForm(f=>({...f,[k]:e.target.value}));
  const handleSave = () => { onSave(form); setSaved(true); setTimeout(()=>setSaved(false),2000); };
  const inp = { width:"100%", height:46, borderRadius:12, border:"1.5px solid #E5E7EB", padding:"0 14px", fontSize:14, fontFamily:"Inter,sans-serif", color:"#222", background:"#FAFAFA", outline:"none", boxSizing:"border-box" as const };
  const lbl = { fontSize:11, fontWeight:700, color:"#6B7280", display:"block" as const, marginBottom:5 };
  return (
    <div style={{ paddingBottom:20 }}>
      {form.name && (
        <div style={{ background:"linear-gradient(135deg,#7C3AED,#A855F7)", borderRadius:16, padding:"18px", marginBottom:20 }}>
          <div style={{ display:"flex", gap:12, alignItems:"center" }}>
            <InitialsAvatar initials={form.name.slice(0,2).toUpperCase()} size={54} />
            <div>
              <div style={{ fontSize:18, fontWeight:900, color:"#fff" }}>{form.name}</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.8)", marginTop:2 }}>{form.breed} {form.age?`· ${form.age}`:""}</div>
            </div>
          </div>
        </div>
      )}
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        <div><label style={lbl}>İsim *</label><input value={form.name} onChange={F("name")} placeholder="Örn: Mocha" style={inp}/></div>
        <div><label style={lbl}>Irk</label>
          <select value={form.breed} onChange={F("breed")} style={{ ...inp }}>
            <option value="">Seçin...</option>
            {BREEDS.map(b=><option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div><label style={lbl}>Yaş</label><input value={form.age} onChange={F("age")} placeholder="2 yaş" style={inp}/></div>
          <div><label style={lbl}>Renk</label>
            <select value={form.color} onChange={F("color")} style={{ ...inp }}>
              <option value="">Seçin...</option>
              {COLORS.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div><label style={lbl}>Hakkında</label>
          <textarea value={form.about} onChange={F("about")} placeholder="Poodle'ınız hakkında..." rows={3}
            style={{ width:"100%", borderRadius:12, border:"1.5px solid #E5E7EB", padding:"10px 14px", fontSize:14, fontFamily:"Inter,sans-serif", color:"#222", background:"#FAFAFA", resize:"none", lineHeight:1.6, outline:"none", boxSizing:"border-box" }}/>
        </div>
        <button onClick={handleSave} disabled={!form.name.trim()}
          style={{ height:50, borderRadius:14, border:"none", background:form.name.trim()?"#7C3AED":"#E5E7EB", color:form.name.trim()?"#fff":"#9CA3AF", fontSize:15, fontWeight:800, cursor:form.name.trim()?"pointer":"not-allowed", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
          {saved ? <><Check size={18}/> Kaydedildi!</> : "Profili Kaydet"}
        </button>
      </div>
    </div>
  );
}

/* ─── usePushSubscription ────────────────────────────────── */
function urlBase64ToUint8Array(b: string) {
  const pad = "=".repeat((4-b.length%4)%4);
  const base64 = (b+pad).replace(/-/g,"+").replace(/_/g,"/");
  const raw = atob(base64);
  return Uint8Array.from([...raw].map(c=>c.charCodeAt(0)));
}

/* ─── Main ───────────────────────────────────────────────── */
export default function Club() {
  const [, navigate] = useLocation();
  const { isLoggedIn } = useCustomer();

  const [activeTab, setActiveTab] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    const slug = p.get("tab");
    if (slug === "topluluk") return "poodlem"; // redirect
    return slug && TABS.find(t=>t.id===slug) ? slug : "akis";
  });

  const [feedCat,      setFeedCat]      = useState(() => new URLSearchParams(window.location.search).get("kategori") || "tumu");
  const [posts,        setPosts]        = useState<Post[]>(SEED_POSTS);
  const [search,       setSearch]       = useState("");
  const [showCompose,  setShowCompose]  = useState(false);
  const [poodle,       setPoodle]       = useState<PoodleProfile>(() => { try { return JSON.parse(localStorage.getItem("yp_poodle")||"{}"); } catch { return {}; } });
  const profile: PoodleProfile = { name:"", breed:"", age:"", color:"", about:"", photo:"", ...poodle };

  // Poodlem tab state
  const [poodleSearch,  setPoodleSearch]  = useState("");
  const [breedFilter,   setBreedFilter]   = useState("Tümü");
  const [ageFilter,     setAgeFilter]     = useState("tumu");
  const [cityFilter,    setCityFilter]    = useState("Tüm şehirler");
  const [selectedPoodle,setSelectedPoodle]= useState<PoodleCard|null>(null);
  const [showPoodleForm,setShowPoodleForm]= useState(false);

  // Etkinlik tab state
  const [evCity, setEvCity] = useState("Tüm şehirler");

  const { data: apiEvents = [] } = useQuery<any[]>({
    queryKey: ["/api/yp-events"],
    queryFn: async () => { const res = await fetch("/api/yp-events"); if (!res.ok) return []; return res.json(); },
    staleTime: 5 * 60 * 1000,
  });

  const displayEvents = (apiEvents as any[]).length > 0 ? apiEvents : FALLBACK_EVENTS;

  // Tab switch + URL sync
  const switchTab = (id: string) => {
    setActiveTab(id);
    setSearch("");
    const qs = new URLSearchParams();
    qs.set("tab", id);
    window.history.pushState(null, "", `?${qs.toString()}`);
  };

  const switchFeedCat = (cat: string) => {
    setFeedCat(cat);
    const qs = new URLSearchParams();
    qs.set("tab", activeTab);
    if (cat !== "tumu") qs.set("kategori", cat);
    window.history.pushState(null, "", `?${qs.toString()}`);
  };

  useEffect(() => {
    const handler = () => {
      const p = new URLSearchParams(window.location.search);
      const slug = p.get("tab");
      if (slug === "topluluk") { setActiveTab("poodlem"); return; }
      setActiveTab(slug && TABS.find(t=>t.id===slug) ? slug : "akis");
      setFeedCat(p.get("kategori") || "tumu");
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  useEffect(() => {
    document.title = "Poodle Club — 500+ Üye Topluluğu | YourPoodle";
    const m = (attr:string,key:string,val:string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement|null;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr,key); document.head.appendChild(el); }
      el.content = val;
    };
    m("name","description","YourPoodle Club: poodle sahiplerinin ücretsiz sosyal platformu. Fotoğraf paylaşın, deneyim aktarın, etkinliklere katılın.");
    m("property","og:title","Poodle Club | YourPoodle");
    m("property","og:url","https://www.yourpoodle.com/yourpoodle/club");
  }, []);

  const handleLike = (id: string) => setPosts(ps => ps.map(p => p.id===id ? { ...p, liked:!p.liked } : p));
  const handleNewPost = (text: string, img: string, type: "post"|"question") => {
    const p: Post = { id:Date.now().toString(), author:"sen", poodle:profile.name||"Poodlem", avatar:"SN", time:"Az önce", text, img:img||undefined, likes:0, comments:0, liked:false, cat:"tumu", type };
    setPosts(ps => [p, ...ps]);
    switchTab("akis");
  };
  const handleSavePoodle = (p: PoodleProfile) => { setPoodle(p); localStorage.setItem("yp_poodle", JSON.stringify(p)); };

  const filteredPosts = posts.filter(p => {
    const matchCat = feedCat==="tumu" || p.cat===feedCat;
    const matchSearch = !search || p.text.toLowerCase().includes(search.toLowerCase()) || p.author.toLowerCase().includes(search.toLowerCase()) || p.poodle.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredPoodles = ALL_POODLES.filter(p => {
    const matchBreed  = breedFilter==="Tümü" || p.breed===breedFilter;
    const matchAge    = ageFilter==="tumu" || p.ageGroup===ageFilter;
    const matchCity   = cityFilter==="Tüm şehirler" || p.city===cityFilter;
    const matchSearch = !poodleSearch || p.name.toLowerCase().includes(poodleSearch.toLowerCase()) || p.city.toLowerCase().includes(poodleSearch.toLowerCase());
    return matchBreed && matchAge && matchCity && matchSearch;
  });

  const filteredEvents = displayEvents.filter((ev:any) => evCity==="Tüm şehirler" || ev.location===evCity);
  const featuredEvent = filteredEvents[0];
  const listEvents    = filteredEvents.slice(1);

  const goLogin = () => navigate("/yourpoodle/giris?redirect=/yourpoodle/club");

  // Schema
  const webPageSchema = { "@context":"https://schema.org","@type":"WebPage","name":"Poodle Club","description":"Türkiye'nin poodle sahipleri sosyal topluluğu","url":"https://www.yourpoodle.com/yourpoodle/club" };

  return (
    <YPLayout activeLink="/yourpoodle/club" bottomNavActive="/yourpoodle/club">
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        .club-noscroll::-webkit-scrollbar { display:none; }
        .club-noscroll { -ms-overflow-style:none; scrollbar-width:none; }
        .poodle-card:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(124,58,237,0.12) !important; }
        .poodle-card { transition:all 0.2s; }
        .club-action-btn:hover { background:#F5F0FF !important; }
        .club-action-btn { transition:background 0.12s; }
        @media(min-width:640px) {
          .poodle-grid { grid-template-columns: repeat(4,1fr) !important; }
          .ev-featured { flex-direction:row !important; }
        }
        @media(max-width:639px) {
          .poodle-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}/>

      {showCompose && isLoggedIn && (
        <NewPostModal poodleName={profile.name} onClose={()=>setShowCompose(false)} onSubmit={handleNewPost}/>
      )}
      {selectedPoodle && <PoodleDetailModal p={selectedPoodle} onClose={()=>setSelectedPoodle(null)}/>}

      <div style={{ background:"#FAFAF8", minHeight:"100vh", fontFamily:"Inter,sans-serif", paddingBottom:80 }}>

        {/* ── Mini header ── */}
        <div style={{ background:"#fff", borderBottom:"1px solid #E5E7EB", padding:"10px 16px", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#7C3AED,#A855F7)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <span style={{ fontSize:18 }}>🐩</span>
          </div>
          <div style={{ flex:1 }}>
            <span style={{ fontSize:15, fontWeight:900, color:"#1A1A1A" }}>Poodle Club</span>
            <span style={{ fontSize:12, color:"#9CA3AF", marginLeft:8 }}>500+ üye · Ücretsiz</span>
          </div>
          {isLoggedIn ? (
            <div style={{ fontSize:13, fontWeight:700, color:"#7C3AED" }}>
              {profile.name ? `${profile.name}'ın sahibi 👋` : "Merhaba 👋"}
            </div>
          ) : (
            <button onClick={goLogin}
              style={{ padding:"7px 14px", borderRadius:20, border:"none", background:"#7C3AED", color:"#fff", fontSize:12.5, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>
              Profil oluştur
            </button>
          )}
        </div>

        {/* ── Tab bar ── */}
        <div role="tablist" style={{ display:"flex", background:"#fff", borderBottom:"1px solid #E5E7EB", position:"sticky", top:0, zIndex:50 }}>
          {TABS.map(t => (
            <button key={t.id} role="tab" aria-selected={activeTab===t.id}
              onClick={() => switchTab(t.id)}
              style={{ flex:1, padding:"11px 4px", fontSize:13.5, fontWeight:700, border:"none", background:"none", cursor:"pointer", borderBottom:`2.5px solid ${activeTab===t.id?"#7C3AED":"transparent"}`, color:activeTab===t.id?"#7C3AED":"#6B7280", fontFamily:"Inter,sans-serif", transition:"color 0.15s" }}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ padding:"16px 14px 0" }}>

          {/* ══ ANA SAYFA (FEED) TAB ══ */}
          {activeTab==="akis" && (
            <div>
              {/* Quick action bar */}
              <div className="club-noscroll" style={{ display:"flex", gap:8, overflowX:"auto", marginBottom:14 }}>
                {[
                  { icon:"📸", label:"Paylaş",     action:() => { if (!isLoggedIn) { goLogin(); return; } setShowCompose(true); } },
                  { icon:"❓", label:"Soru sor",   action:() => { if (!isLoggedIn) { goLogin(); return; } setShowCompose(true); } },
                  { icon:"📅", label:"Etkinlikler",action:() => switchTab("etkinlik") },
                  { icon:"🤖", label:"AI'ya sor",  action:() => navigate("/yourpoodle/ai-asistan") },
                ].map(b => (
                  <button key={b.label} className="club-action-btn" onClick={b.action}
                    style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 14px", borderRadius:20, border:"1.5px solid #E5E7EB", background:"#fff", cursor:"pointer", fontSize:13, fontWeight:700, color:"#374151", whiteSpace:"nowrap", flexShrink:0 }}>
                    <span>{b.icon}</span> {b.label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div style={{ display:"flex", alignItems:"center", background:"#fff", border:"1.5px solid #E5E7EB", borderRadius:12, height:42, overflow:"hidden", marginBottom:12 }}>
                <div style={{ paddingLeft:12, color:"#9CA3AF", display:"flex" }}><Search size={16} strokeWidth={2}/></div>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Paylaşım ara..."
                  style={{ flex:1, border:"none", outline:"none", fontSize:13, color:"#333", background:"transparent", padding:"0 10px" }}/>
                {search && <button onClick={()=>setSearch("")} style={{ background:"none", border:"none", cursor:"pointer", paddingRight:10, color:"#9CA3AF", display:"flex" }}><X size={14}/></button>}
              </div>

              {/* Category filters */}
              <div className="club-noscroll" style={{ display:"flex", gap:6, overflowX:"auto", marginBottom:14, paddingBottom:2 }}>
                {FEED_CATS.map(c => (
                  <button key={c.id} onClick={() => switchFeedCat(c.id)}
                    style={{ flexShrink:0, padding:"6px 14px", borderRadius:20, border:"1.5px solid", borderColor:feedCat===c.id?"#7C3AED":"#E5E7EB", background:feedCat===c.id?"#7C3AED":"#fff", color:feedCat===c.id?"#fff":"#6B7280", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Compose prompt (logged in) */}
              {isLoggedIn && (
                <button onClick={() => setShowCompose(true)}
                  style={{ width:"100%", display:"flex", alignItems:"center", gap:12, background:"#fff", borderRadius:14, padding:"12px 16px", border:"1.5px dashed #DDD5FF", cursor:"pointer", marginBottom:16 }}>
                  <InitialsAvatar initials="SN" size={34}/>
                  <span style={{ fontSize:13.5, color:"#9CA3AF", fontWeight:600 }}>Poodlenle ilgili bir şey paylaş...</span>
                  <div style={{ marginLeft:"auto", width:30, height:30, borderRadius:"50%", background:"#7C3AED", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Plus size={16} color="#fff" strokeWidth={2.5}/>
                  </div>
                </button>
              )}

              {/* Feed */}
              <div role="feed">
                {filteredPosts.length === 0 ? (
                  <div style={{ textAlign:"center", padding:"48px 0" }}>
                    <div style={{ fontSize:36, marginBottom:12 }}>🔍</div>
                    <div style={{ fontSize:14, fontWeight:700, color:"#555", marginBottom:16 }}>
                      {search ? `"${search}" için paylaşım bulunamadı` : "Bu kategoride henüz paylaşım yok"}
                    </div>
                    <button onClick={() => { setSearch(""); switchFeedCat("tumu"); }}
                      style={{ padding:"10px 24px", borderRadius:20, background:"#7C3AED", color:"#fff", border:"none", cursor:"pointer", fontSize:13, fontWeight:700 }}>
                      Tümünü Göster
                    </button>
                  </div>
                ) : (
                  filteredPosts.map(post => (
                    <PostCard key={post.id} post={post} onLike={handleLike} isLoggedIn={isLoggedIn} onJoin={goLogin}
                      onTagClick={(tag) => { const cat = FEED_CATS.find(c => c.id === tag); if (cat) switchFeedCat(cat.id); }} />
                  ))
                )}
              </div>
            </div>
          )}

          {/* ══ POODLEM TAB ══ */}
          {activeTab==="poodlem" && (
            <div>
              {!showPoodleForm ? (
                <>
                  {/* Search + filters */}
                  <div style={{ display:"flex", alignItems:"center", background:"#fff", border:"1.5px solid #E5E7EB", borderRadius:12, height:42, overflow:"hidden", marginBottom:12 }}>
                    <div style={{ paddingLeft:12, color:"#9CA3AF", display:"flex" }}><Search size={16} strokeWidth={2}/></div>
                    <input value={poodleSearch} onChange={e=>setPoodleSearch(e.target.value)} placeholder="İsim veya şehir ara..."
                      style={{ flex:1, border:"none", outline:"none", fontSize:13, color:"#333", background:"transparent", padding:"0 10px" }}/>
                  </div>
                  {/* Filters row */}
                  <div className="club-noscroll" style={{ display:"flex", gap:6, overflowX:"auto", marginBottom:12, paddingBottom:2 }}>
                    {BREED_FILTERS.map(b => (
                      <button key={b} onClick={()=>setBreedFilter(b)}
                        style={{ flexShrink:0, padding:"5px 12px", borderRadius:20, border:"1.5px solid", borderColor:breedFilter===b?"#7C3AED":"#E5E7EB", background:breedFilter===b?"#7C3AED":"#fff", color:breedFilter===b?"#fff":"#6B7280", fontSize:11.5, fontWeight:700, cursor:"pointer" }}>
                        {b}
                      </button>
                    ))}
                    {AGE_FILTERS.map(a => (
                      <button key={a.id} onClick={()=>setAgeFilter(a.id)}
                        style={{ flexShrink:0, padding:"5px 12px", borderRadius:20, border:"1.5px solid", borderColor:ageFilter===a.id?"#7C3AED":"#E5E7EB", background:ageFilter===a.id?"#7C3AED":"#fff", color:ageFilter===a.id?"#fff":"#6B7280", fontSize:11.5, fontWeight:700, cursor:"pointer" }}>
                        {a.label}
                      </button>
                    ))}
                  </div>
                  {/* City filter */}
                  <div className="club-noscroll" style={{ display:"flex", gap:6, overflowX:"auto", marginBottom:16, paddingBottom:2 }}>
                    {CITY_FILTERS.map(c => (
                      <button key={c} onClick={()=>setCityFilter(c)}
                        style={{ flexShrink:0, padding:"5px 12px", borderRadius:20, border:"1.5px solid", borderColor:cityFilter===c?"#6D28D9":"#E5E7EB", background:cityFilter===c?"#6D28D9":"#fff", color:cityFilter===c?"#fff":"#6B7280", fontSize:11.5, fontWeight:700, cursor:"pointer" }}>
                        {c === "Tüm şehirler" ? "📍 Tüm şehirler" : c}
                      </button>
                    ))}
                  </div>

                  {/* Poodle grid */}
                  <div className="poodle-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
                    {filteredPoodles.map(p => (
                      <button key={p.id} className="poodle-card" onClick={() => setSelectedPoodle(p)}
                        style={{ background:"#fff", borderRadius:16, border:"1px solid #E5E7EB", padding:"16px 14px", cursor:"pointer", textAlign:"left", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
                        <InitialsAvatar initials={p.initials} size={52} color={p.color}/>
                        <div style={{ fontSize:15, fontWeight:800, color:"#1A1A1A", marginTop:10, marginBottom:2 }}>{p.name}</div>
                        <div style={{ fontSize:11, color:"#9CA3AF", marginBottom:4 }}>{p.age} · {p.breed.replace(" Poodle","")}</div>
                        <div style={{ fontSize:11, color:"#6B7280", display:"flex", alignItems:"center", gap:3 }}><MapPin size={10} color="#9CA3AF"/>{p.city}</div>
                        {p.weight && <div style={{ fontSize:11, color:"#9CA3AF", marginTop:2 }}>{p.weight}</div>}
                      </button>
                    ))}
                  </div>

                  {filteredPoodles.length === 0 && (
                    <div style={{ textAlign:"center", padding:"48px 0", color:"#9CA3AF" }}>
                      <div style={{ fontSize:36, marginBottom:12 }}>🐩</div>
                      <div style={{ fontSize:14, fontWeight:700, color:"#555" }}>Bu filtrede Poodle bulunamadı</div>
                    </div>
                  )}

                  {/* CTA */}
                  <button onClick={() => { if (!isLoggedIn) { goLogin(); return; } setShowPoodleForm(true); }}
                    style={{ width:"100%", height:50, borderRadius:14, border:"1.5px dashed #DDD5FF", background:"#F9F7FF", color:"#7C3AED", fontSize:14, fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                    <Plus size={18}/> Poodle'ınızı ekleyin
                  </button>
                </>
              ) : (
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
                    <button onClick={()=>setShowPoodleForm(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"#7C3AED", fontWeight:700, fontSize:13, display:"flex", alignItems:"center", gap:4 }}>
                      ← Geri
                    </button>
                    <span style={{ fontSize:16, fontWeight:800, color:"#1A1A1A" }}>Poodle Profilim</span>
                  </div>
                  <PoodleForm initial={profile} onSave={(p) => { handleSavePoodle(p); setShowPoodleForm(false); }}/>
                </div>
              )}
            </div>
          )}

          {/* ══ ETKİNLİK TAB ══ */}
          {activeTab==="etkinlik" && (
            <div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                <h2 style={{ fontSize:16, fontWeight:800, color:"#1A1A1A", margin:0 }}>Yaklaşan Etkinlikler</h2>
                <a href="/yourpoodle/etkinlikler" style={{ color:"#7C3AED", fontSize:12, fontWeight:700, textDecoration:"none" }}>Tümü →</a>
              </div>

              {/* City filter */}
              <div className="club-noscroll" style={{ display:"flex", gap:6, overflowX:"auto", marginBottom:16 }}>
                {["Tüm şehirler","İstanbul","Ankara","İzmir","Online"].map(c => (
                  <button key={c} onClick={() => setEvCity(c)}
                    style={{ flexShrink:0, display:"flex", alignItems:"center", gap:4, padding:"6px 12px", borderRadius:20, border:"1.5px solid", borderColor:evCity===c?"#7C3AED":"#E5E7EB", background:evCity===c?"#7C3AED":"#fff", color:evCity===c?"#fff":"#6B7280", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                    {c === "Tüm şehirler" ? <><MapPin size={11}/>Tüm şehirler</> : c}
                  </button>
                ))}
              </div>

              {/* Featured event */}
              {featuredEvent && (
                <div style={{ background:"linear-gradient(135deg,#7C3AED,#A855F7)", borderRadius:18, padding:"20px", marginBottom:16, position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", top:-20, right:-20, width:100, height:100, borderRadius:"50%", background:"rgba(255,255,255,0.08)" }}/>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                    <div style={{ width:52, height:52, borderRadius:14, background:"rgba(255,255,255,0.2)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <div style={{ fontSize:16, fontWeight:900, color:"#fff", lineHeight:1.1 }}>{featuredEvent.day}</div>
                      <div style={{ fontSize:9, fontWeight:800, color:"rgba(255,255,255,0.8)" }}>{featuredEvent.month}</div>
                    </div>
                    <div>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:4 }}>
                        <span style={{ fontSize:10, background:"rgba(255,255,255,0.2)", color:"#fff", borderRadius:6, padding:"2px 8px", fontWeight:700 }}>{featuredEvent.type}</span>
                        {featuredEvent.free && <span style={{ fontSize:10, background:"rgba(255,255,255,0.2)", color:"#fff", borderRadius:6, padding:"2px 8px", fontWeight:700 }}>Ücretsiz</span>}
                      </div>
                      <div style={{ fontSize:16, fontWeight:900, color:"#fff", lineHeight:1.3 }}>{featuredEvent.title}</div>
                    </div>
                  </div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.8)", marginBottom:6 }}>
                    📍 {featuredEvent.venue}, {featuredEvent.location} · 🕙 {featuredEvent.time}
                  </div>
                  {featuredEvent.desc && <p style={{ fontSize:12.5, color:"rgba(255,255,255,0.85)", lineHeight:1.6, margin:"0 0 12px" }}>{featuredEvent.desc}</p>}
                  {/* Participants */}
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                    <div style={{ display:"flex" }}>
                      {["MO","LU","BI"].map((ini,i) => (
                        <div key={ini} style={{ width:24, height:24, borderRadius:"50%", background:"rgba(255,255,255,0.3)", border:"2px solid rgba(255,255,255,0.6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:800, color:"#fff", marginLeft:i?-8:0, zIndex:3-i }}>
                          {ini}
                        </div>
                      ))}
                    </div>
                    <span style={{ fontSize:12, color:"rgba(255,255,255,0.85)", fontWeight:600 }}>{featuredEvent.participants} kişi katılıyor</span>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={() => { if (!isLoggedIn) { goLogin(); return; } }}
                      style={{ flex:1, height:40, borderRadius:12, border:"none", background:"#fff", color:"#7C3AED", fontSize:13, fontWeight:800, cursor:"pointer" }}>
                      Katıl
                    </button>
                    <a href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(featuredEvent.title)}&location=${encodeURIComponent(`${featuredEvent.venue}, ${featuredEvent.location}`)}`}
                      target="_blank" rel="noopener noreferrer"
                      style={{ height:40, borderRadius:12, border:"2px solid rgba(255,255,255,0.4)", background:"transparent", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", padding:"0 12px", textDecoration:"none" }}>
                      <Calendar size={14}/>&nbsp;Takvim
                    </a>
                  </div>
                </div>
              )}

              {/* Event list */}
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {listEvents.map((ev:any) => (
                  <div key={ev.id} style={{ background:"#fff", borderRadius:14, border:"1px solid #E5E7EB", padding:"14px 16px", display:"flex", gap:12, alignItems:"flex-start", boxShadow:"0 1px 4px rgba(0,0,0,0.03)" }}>
                    <div style={{ width:46, height:46, borderRadius:12, background:ev.color||"#7C3AED", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <div style={{ fontSize:14, fontWeight:900, color:"#fff", lineHeight:1.1 }}>{ev.day}</div>
                      <div style={{ fontSize:8, fontWeight:800, color:"rgba(255,255,255,0.85)" }}>{ev.month}</div>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:4 }}>
                        <span style={{ fontSize:10, background:"#EDE8FF", color:"#7C3AED", borderRadius:5, padding:"2px 6px", fontWeight:700 }}>{ev.type}</span>
                        {ev.free && <span style={{ fontSize:10, background:"#DCFCE7", color:"#16A34A", borderRadius:5, padding:"2px 6px", fontWeight:700 }}>Ücretsiz</span>}
                      </div>
                      <div style={{ fontSize:14, fontWeight:800, color:"#1A1A1A", marginBottom:2 }}>{ev.title}</div>
                      <div style={{ fontSize:11.5, color:"#9CA3AF" }}>📍 {ev.location} · 🕙 {ev.time}</div>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:6 }}>
                        <div style={{ display:"flex" }}>
                          {["MO","LU"].map((ini,i)=>(
                            <div key={ini} style={{ width:18, height:18, borderRadius:"50%", background:"#EDE8FF", border:"1.5px solid #fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:7, fontWeight:800, color:"#7C3AED", marginLeft:i?-6:0 }}>{ini}</div>
                          ))}
                        </div>
                        <span style={{ fontSize:11, color:"#9CA3AF" }}>{ev.participants} katılımcı</span>
                        <a href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(ev.title)}&location=${encodeURIComponent(ev.location)}`}
                          target="_blank" rel="noopener noreferrer"
                          style={{ marginLeft:"auto", fontSize:11, color:"#7C3AED", fontWeight:700, textDecoration:"none", display:"flex", alignItems:"center", gap:3 }}>
                          <Calendar size={11}/> Takvim
                        </a>
                      </div>
                    </div>
                    <button onClick={() => { if (!isLoggedIn) { goLogin(); return; } }}
                      style={{ padding:"7px 12px", borderRadius:10, border:"none", background:"#7C3AED", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", flexShrink:0, alignSelf:"center" }}>
                      Katıl
                    </button>
                  </div>
                ))}
              </div>

              {filteredEvents.length === 0 && (
                <div style={{ textAlign:"center", padding:"48px 0", color:"#9CA3AF" }}>
                  <div style={{ fontSize:36, marginBottom:12 }}>📅</div>
                  <div style={{ fontSize:14, fontWeight:700, color:"#555" }}>Bu şehirde yaklaşan etkinlik yok</div>
                  <button onClick={() => setEvCity("Tüm şehirler")} style={{ marginTop:12, padding:"8px 20px", borderRadius:20, border:"none", background:"#7C3AED", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>
                    Tüm şehirleri göster
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Club footer ── */}
        <footer style={{ marginTop:32, borderTop:"1px solid #E5E7EB", padding:"16px", background:"#fff", textAlign:"center" }}>
          <div style={{ fontSize:12.5, color:"#9CA3AF", display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <span style={{ fontWeight:700, color:"#7C3AED" }}>YourPoodle Club</span>
            <a href="/yourpoodle/gizlilik-politikasi" style={{ color:"#9CA3AF", textDecoration:"none" }}>Gizlilik</a>
            <a href="/yourpoodle/kullanim-sartlari" style={{ color:"#9CA3AF", textDecoration:"none" }}>Kullanım Koşulları</a>
            <a href="/yourpoodle/hakkinda" style={{ color:"#9CA3AF", textDecoration:"none" }}>Hakkımızda</a>
            <a href="/yourpoodle/club/hakkimizda" style={{ color:"#9CA3AF", textDecoration:"none" }}>Club Nedir?</a>
          </div>
        </footer>
      </div>

      {/* FAB — compose */}
      {isLoggedIn && activeTab==="akis" && (
        <button onClick={() => setShowCompose(true)}
          style={{ position:"fixed", bottom:80, right:20, width:52, height:52, borderRadius:"50%", background:"#7C3AED", border:"none", boxShadow:"0 6px 20px rgba(124,58,237,0.4)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", zIndex:150 }}>
          <Plus size={22} color="#fff" strokeWidth={2.5}/>
        </button>
      )}
    </YPLayout>
  );
}
