import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { useCustomer } from "@/contexts/CustomerContext";
import {
  Menu, X, ShoppingBag, PawPrint, MessageCirclePlus, BookOpen,
  Bell, MessageCircle, Heart, Send, Bookmark, MoreHorizontal,
  Smile, Plus, Mail, Clock, Instagram, Youtube, Music2, Facebook,
  ShieldCheck, Home as HomeIcon, Users, ShoppingCart, Bot,
  CheckCircle, Plus as PlusIcon, Minus,
} from "lucide-react";

/* ── Design tokens ── */
const P   = "#6200EE";
const FBG = "#1A0052";
const NL  = "#2D1065";
const GB  = "#E5E7EB";

/* ── Stories data ── */
const LOCAL = "/images/yp-poodle-hero.png";
const STORIES = [
  { id: 1, name: "Mia",    img: LOCAL, filter: "none",                              isMe: true  },
  { id: 2, name: "Tarçın", img: LOCAL, filter: "hue-rotate(20deg) saturate(1.2)",  isMe: false },
  { id: 3, name: "Loki",   img: LOCAL, filter: "grayscale(0.85) brightness(0.65)", isMe: false },
  { id: 4, name: "Luna",   img: LOCAL, filter: "brightness(1.5) saturate(0.3)",    isMe: false },
  { id: 5, name: "Badem",  img: LOCAL, filter: "sepia(0.5) hue-rotate(-10deg)",    isMe: false },
];

/* ── Feed posts data ── */
interface Post {
  id: number;
  name: string;
  handle: string;
  location: string;
  avatar: string;
  avatarFilter: string;
  verified: boolean;
  following: boolean;
  featured: boolean;
  image: string;
  imageFilter: string;
  likes: string;
  caption: string;
  hashtags: string;
  commentUser: string;
  commentText: string;
  commentCount: number;
  timeAgo: string;
}

const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    name: "Tarçın",
    handle: "@tarcin.poodle",
    location: "Samsun",
    avatar: LOCAL,
    avatarFilter: "hue-rotate(20deg) saturate(1.2)",
    verified: true,
    following: true,
    featured: true,
    image: LOCAL,
    imageFilter: "hue-rotate(20deg) saturate(1.1) brightness(0.95)",
    likes: "1.248",
    caption: "Tarçın bugün parkta baharın tadını çıkardı 💜",
    hashtags: "#toypoodle #park",
    commentUser: "mia.poodle",
    commentText: "Ne tatlısın Tarçın! O gülüşe bayıldım 😍",
    commentCount: 38,
    timeAgo: "2 saat önce",
  },
  {
    id: 2,
    name: "Luna",
    handle: "@lunatoypoodle",
    location: "İstanbul",
    avatar: LOCAL,
    avatarFilter: "brightness(1.5) saturate(0.3)",
    verified: true,
    following: false,
    featured: false,
    image: LOCAL,
    imageFilter: "brightness(1.4) saturate(0.4)",
    likes: "892",
    caption: "Kahve molasına beni de götürdüler ☕🐾",
    hashtags: "#poodleclub #istanbul",
    commentUser: "tarcin.poodle",
    commentText: "Ben de gelsene Luna! 🐾🤣",
    commentCount: 21,
    timeAgo: "5 saat önce",
  },
  {
    id: 3,
    name: "Loki",
    handle: "@lokimaceralari",
    location: "Ankara",
    avatar: LOCAL,
    avatarFilter: "grayscale(0.85) brightness(0.65)",
    verified: false,
    following: false,
    featured: false,
    image: LOCAL,
    imageFilter: "grayscale(0.7) brightness(0.7)",
    likes: "1.057",
    caption: "Topumu kimseye vermem! 😎🟢",
    hashtags: "#oyunzamanı #poodle",
    commentUser: "badem.poodle",
    commentText: "En iyi oyun arkadaşı! 🧡",
    commentCount: 45,
    timeAgo: "Dün",
  },
];

/* ── Footer accordion ── */
const ACCORDION = [
  { Icon: PawPrint,          title: "YourPoodle",  links: ["Hakkımızda","Misyonumuz","Kariyer","Basın"]                           },
  { Icon: ShoppingBag,       title: "Alışveriş",   links: ["Tüm Ürünler","Mamalar","Aksesuarlar","Kampanyalar"]                   },
  { Icon: MessageCirclePlus, title: "Yardım",       links: ["SSS","Kargo & Teslimat","İade & Değişim","İletişim"]                 },
  { Icon: ShieldCheck,       title: "Yasal",        links: ["Gizlilik Politikası","Kullanım Koşulları","KVKK","Çerez Politikası"] },
];

/* ── Toast ── */
function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div style={{ position:"fixed", bottom:88, left:"50%", transform:"translateX(-50%)", zIndex:999, pointerEvents:"none", opacity:visible?1:0, transition:"opacity 0.3s ease" }}>
      <div style={{ background:FBG, color:"#fff", padding:"12px 24px", borderRadius:999, fontSize:14, fontWeight:500, whiteSpace:"nowrap", boxShadow:"0 4px 16px rgba(0,0,0,0.25)" }}>
        {message}
      </div>
    </div>
  );
}

/* ── Footer Accordion ── */
function FooterAccordion() {
  const [open, setOpen] = useState<number|null>(null);
  return (
    <div>
      {ACCORDION.map((item, i) => (
        <div key={item.title}>
          <button onClick={() => setOpen(open===i?null:i)}
            style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 0", borderTop:"1px solid rgba(255,255,255,0.1)", background:"none", border:"none", borderTopWidth:1, borderTopStyle:"solid", borderTopColor:"rgba(255,255,255,0.1)", cursor:"pointer", fontFamily:"inherit" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <item.Icon size={18} color="rgba(255,255,255,0.8)" />
              <span style={{ fontSize:14, fontWeight:500, color:"#fff" }}>{item.title}</span>
            </div>
            {open===i ? <Minus size={18} color="#fff" /> : <PlusIcon size={18} color="#fff" />}
          </button>
          {open===i && (
            <div style={{ paddingBottom:12, paddingLeft:30, display:"flex", flexDirection:"column", gap:8 }}>
              {item.links.map(l => (
                <span key={l} style={{ fontSize:14, color:"rgba(255,255,255,0.6)", cursor:"pointer", display:"block" }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="#fff";(e.currentTarget as HTMLElement).style.textDecoration="underline";}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="rgba(255,255,255,0.6)";(e.currentTarget as HTMLElement).style.textDecoration="none";}}>
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

/* ── Post Card ── */
function PostCard({ post, onLike, onSave }: { post: Post & { liked: boolean; saved: boolean }; onLike: ()=>void; onSave: ()=>void }) {
  const [following, setFollowing] = useState(post.following);
  const [comment, setComment] = useState("");

  return (
    <article style={{ borderBottom:`1px solid ${GB}`, paddingBottom:0, marginBottom:0 }}>
      {/* Post header */}
      <div style={{ display:"flex", alignItems:"center", padding:"10px 12px", gap:10 }}>
        {/* Avatar */}
        <img src={post.avatar} alt={post.name} loading="lazy"
          style={{ width:40, height:40, borderRadius:"50%", objectFit:"cover", border:`2px solid ${P}`, flexShrink:0, filter:post.avatarFilter }} />

        {/* Name + handle + location */}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:4 }}>
            <span style={{ fontWeight:700, fontSize:14, color:"#111827" }}>{post.name}</span>
            {post.verified && (
              <CheckCircle size={14} color="#6200EE" fill="#6200EE" strokeWidth={0} style={{ flexShrink:0 }} />
            )}
          </div>
          <div style={{ fontSize:12, color:"#6B7280" }}>
            {post.handle} · {post.location}
          </div>
        </div>

        {/* Follow button */}
        <button
          onClick={() => setFollowing(f => !f)}
          style={{
            padding:"5px 14px", borderRadius:999, fontSize:12, fontWeight:600,
            cursor:"pointer", fontFamily:"inherit", flexShrink:0, transition:"all 0.15s",
            background: following ? "#fff" : P,
            color: following ? P : "#fff",
            border: following ? `1.5px solid ${P}` : "none",
          }}>
          {following ? "Takiptesin" : "Takip Et"}
        </button>

        {/* More */}
        <button style={{ background:"none", border:"none", cursor:"pointer", padding:"4px", display:"flex" }}>
          <MoreHorizontal size={20} color="#6B7280" />
        </button>
      </div>

      {/* Post image */}
      <div style={{ position:"relative", width:"100%", lineHeight:0 }}>
        <img src={post.image} alt={post.caption} loading="lazy"
          style={{ width:"100%", height:320, objectFit:"cover", display:"block", filter:post.imageFilter }} />
        {post.featured && (
          <div style={{ position:"absolute", top:12, right:12, background:"linear-gradient(135deg,#6200EE,#4F46E5)", color:"#fff", fontSize:11, fontWeight:700, padding:"5px 10px", borderRadius:999, display:"flex", alignItems:"center", gap:5, boxShadow:"0 2px 8px rgba(98,0,238,0.4)" }}>
            <PawPrint size={12} />
            Haftanın Poodle'ı
          </div>
        )}
      </div>

      {/* Action row */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 12px 6px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <button onClick={onLike} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", padding:0, transition:"transform 0.1s" }}
            onMouseDown={e=>{e.currentTarget.style.transform="scale(0.85)";}} onMouseUp={e=>{e.currentTarget.style.transform="scale(1)";}}>
            <Heart size={24} color={post.liked?"#EF4444":"#111827"} fill={post.liked?"#EF4444":"none"} strokeWidth={1.75} />
          </button>
          <button style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", padding:0 }}>
            <MessageCircle size={24} color="#111827" strokeWidth={1.75} />
          </button>
          <button style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", padding:0 }}>
            <Send size={24} color="#111827" strokeWidth={1.75} />
          </button>
        </div>
        <button onClick={onSave} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", padding:0 }}>
          <Bookmark size={24} color="#111827" fill={post.saved?"#111827":"none"} strokeWidth={1.75} />
        </button>
      </div>

      {/* Likes */}
      <div style={{ padding:"0 12px 4px" }}>
        <span style={{ fontSize:14, fontWeight:700, color:"#111827" }}>{post.likes} beğeni</span>
      </div>

      {/* Caption */}
      <div style={{ padding:"0 12px 4px", fontSize:14, color:"#111827", lineHeight:1.5 }}>
        <span style={{ fontWeight:700 }}>{post.name.toLowerCase().replace(" ","")}.poodle </span>
        {post.caption} <span style={{ color:P }}>{post.hashtags}</span>
      </div>

      {/* Top comment */}
      <div style={{ padding:"0 12px 4px", fontSize:14, color:"#111827" }}>
        <span style={{ fontWeight:700 }}>{post.commentUser} </span>
        {post.commentText}
      </div>

      {/* View all comments */}
      <button style={{ background:"none", border:"none", cursor:"pointer", padding:"0 12px 6px", fontSize:13, color:"#6B7280", fontFamily:"inherit", display:"block" }}>
        {post.commentCount} yorumun tümünü gör
      </button>

      {/* Comment input */}
      <div style={{ display:"flex", alignItems:"center", padding:"6px 12px 10px", gap:8, borderTop:`1px solid ${GB}` }}>
        <Smile size={20} color="#6B7280" style={{ flexShrink:0 }} />
        <input
          type="text"
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Yorum ekle..."
          style={{ flex:1, border:"none", outline:"none", fontSize:13, color:"#111827", background:"none", fontFamily:"inherit" }}
        />
        <span style={{ fontSize:11, color:"#9CA3AF", flexShrink:0 }}>{post.timeAgo}</span>
      </div>
    </article>
  );
}

/* ── Main page ── */
export default function YPClubPage() {
  const [, navigate] = useLocation();
  const { isLoggedIn } = useCustomer();
  const [drawerOpen,  setDrawerOpen]  = useState(false);
  const [activeSubTab, setActiveSubTab] = useState("kesfet");
  const [activeNav,   setActiveNav]   = useState("club");
  const [toast,       setToast]       = useState({ message:"", visible:false });
  const [newsEmail,   setNewsEmail]   = useState("");
  const [cartCount,   setCartCount]   = useState(0);
  const [posts, setPosts] = useState(
    INITIAL_POSTS.map(p => ({ ...p, liked: false, saved: false }))
  );
  const toastTimer = useRef<ReturnType<typeof setTimeout>|null>(null);

  useEffect(() => { document.title = "Club | YourPoodle"; }, []);

  useEffect(() => {
    const read = () => {
      try {
        const c = JSON.parse(localStorage.getItem("yp_cart_items") || "[]");
        setCartCount(Array.isArray(c) ? c.reduce((s: number, i: any) => s + (i.qty||0), 0) : 0);
      } catch { setCartCount(0); }
    };
    read();
    window.addEventListener("storage", read);
    const t = setInterval(read, 500);
    return () => { window.removeEventListener("storage", read); clearInterval(t); };
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const go = (href: string) => { navigate(href); setDrawerOpen(false); };

  const showToast = (msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message:msg, visible:true });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, visible:false })), 3000);
  };

  const toggleLike = (id: number) => {
    setPosts(prev => prev.map(p => p.id===id ? { ...p, liked:!p.liked } : p));
  };
  const toggleSave = (id: number) => {
    setPosts(prev => prev.map(p => p.id===id ? { ...p, saved:!p.saved } : p));
  };

  /* Top tabs */
  const TOP_TABS = [
    { key:"magaza", label:"Mağaza",     Icon:ShoppingBag,       href:"/yourpoodle/magaza"     },
    { key:"club",   label:"Club",       Icon:PawPrint,           href:"/yourpoodle/club"       },
    { key:"ai",     label:"AI Asistan", Icon:MessageCirclePlus,  href:"/yourpoodle/ai-asistan" },
    { key:"rehber", label:"Rehber",     Icon:BookOpen,           href:"/yourpoodle/rehber"     },
  ];

  /* Sub-tabs */
  const SUB_TABS = [
    { key:"kesfet",      label:"Keşfet"          },
    { key:"takip",       label:"Takip Ettiklerim" },
    { key:"yakinimdaki", label:"Yakınımdakiler"   },
  ];

  /* Bottom nav */
  const BOT_TABS = [
    { key:"anasayfa", label:"Ana Sayfa", Icon:HomeIcon,    href:"/yourpoodle"            },
    { key:"club",     label:"Club",      Icon:Users,        href:"/yourpoodle/club"       },
    { key:"magaza",   label:"Mağaza",    Icon:ShoppingBag,  href:"/yourpoodle/magaza"     },
    { key:"ai",       label:"AI",        Icon:Bot,          href:"/yourpoodle/ai-asistan" },
  ];

  return (
    <div style={{ fontFamily:"'Inter',-apple-system,sans-serif", background:"#fff", minHeight:"100vh", color:"#111827", maxWidth:480, margin:"0 auto" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'); *{box-sizing:border-box;} body{margin:0;}`}</style>

      <Toast message={toast.message} visible={toast.visible} />

      {/* ── Drawer ── */}
      {drawerOpen && (
        <div onClick={() => setDrawerOpen(false)}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:500 }} />
      )}
      <div style={{ position:"fixed", top:0, left:0, height:"100%", width:288, background:"#fff", zIndex:501, transform:drawerOpen?"translateX(0)":"translateX(-100%)", transition:"transform 0.25s ease", boxShadow:"4px 0 24px rgba(0,0,0,0.18)", display:"flex", flexDirection:"column" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 16px 14px", borderBottom:`1px solid ${GB}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <img src="/images/yp-poodle-hero.png" alt="YourPoodle Logo" loading="lazy" style={{ width:32, height:32, borderRadius:"50%", objectFit:"cover" }} />
            <span style={{ fontWeight:700, fontSize:16, color:P }}>YourPoodle</span>
          </div>
          <button onClick={() => setDrawerOpen(false)} aria-label="Menüyü kapat"
            style={{ background:"none", border:"none", cursor:"pointer", minWidth:44, minHeight:44, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <X size={20} color="#374151" />
          </button>
        </div>
        <div style={{ flex:1, overflowY:"auto" }}>
          {[
            { label:"Mağaza",     href:"/yourpoodle/magaza"     },
            { label:"Club",       href:"/yourpoodle/club"       },
            { label:"AI Asistan", href:"/yourpoodle/ai-asistan" },
            { label:"Rehber",     href:"/yourpoodle/rehber"     },
          ].map(l => (
            <button key={l.href} onClick={() => go(l.href)}
              style={{ display:"block", width:"100%", padding:"14px 20px", fontSize:15, fontWeight:500, color:"#1F2937", background:"none", border:"none", borderBottom:`1px solid ${GB}`, cursor:"pointer", textAlign:"left", fontFamily:"inherit", minHeight:44 }}>
              {l.label}
            </button>
          ))}
        </div>
        <div style={{ padding:16, borderTop:`1px solid ${GB}`, display:"flex", flexDirection:"column", gap:8 }}>
          <button onClick={() => go(isLoggedIn?"/hesabim":"/yourpoodle/giris")}
            style={{ width:"100%", padding:"10px 0", fontSize:14, fontWeight:500, color:"#374151", background:"none", border:"none", cursor:"pointer", fontFamily:"inherit", textAlign:"center" }}>
            Giriş Yap
          </button>
          <button onClick={() => go("/yourpoodle/giris")}
            style={{ width:"100%", padding:"12px 0", background:P, color:"#fff", border:"none", borderRadius:999, fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
            Üye Ol
          </button>
        </div>
      </div>

      {/* ── Sticky header + top tabs ── */}
      <header style={{ position:"sticky", top:0, zIndex:400, background:"#fff" }}>
        {/* Header row — Club variant (notifications + avatar) */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", height:56, padding:"0 16px", borderBottom:`1px solid ${GB}` }}>
          {/* Left: hamburger */}
          <button aria-label="Menü" onClick={() => setDrawerOpen(true)}
            style={{ background:"none", border:"none", cursor:"pointer", minWidth:44, minHeight:44, display:"flex", alignItems:"center", justifyContent:"center", padding:0 }}>
            <Menu size={22} color="#374151" />
          </button>

          {/* Center: logo */}
          <button onClick={() => go("/yourpoodle")} aria-label="Ana sayfa"
            style={{ display:"flex", alignItems:"center", gap:8, background:"none", border:"none", cursor:"pointer", padding:0 }}>
            <img src="/images/yp-poodle-hero.png" alt="YourPoodle Logo" loading="lazy"
              style={{ width:40, height:40, borderRadius:"50%", objectFit:"cover" }} />
            <span style={{ fontWeight:700, fontSize:18, color:P }}>YourPoodle</span>
          </button>

          {/* Right: bell + message + profile */}
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            {/* Bell */}
            <div style={{ position:"relative" }}>
              <button style={{ background:"none", border:"none", cursor:"pointer", display:"flex", padding:0 }}>
                <Bell size={24} color="#374151" strokeWidth={1.75} />
              </button>
              <span style={{ position:"absolute", top:-4, right:-5, background:"#EF4444", color:"#fff", fontSize:9, fontWeight:800, width:16, height:16, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid #fff" }}>
                4
              </span>
            </div>
            {/* Messages */}
            <div style={{ position:"relative" }}>
              <button style={{ background:"none", border:"none", cursor:"pointer", display:"flex", padding:0 }}>
                <MessageCircle size={24} color="#374151" strokeWidth={1.75} />
              </button>
              <span style={{ position:"absolute", top:-4, right:-5, background:P, color:"#fff", fontSize:9, fontWeight:800, width:16, height:16, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid #fff" }}>
                2
              </span>
            </div>
            {/* Profile avatar */}
            <button style={{ background:"none", border:"none", cursor:"pointer", padding:0 }}>
              <img src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=80&h=80&fit=crop&crop=face"
                alt="Profil" loading="lazy"
                style={{ width:32, height:32, borderRadius:"50%", objectFit:"cover", border:`2px solid ${P}` }} />
            </button>
          </div>
        </div>

        {/* Top tab nav — Club active */}
        <div style={{ display:"flex", borderBottom:`1px solid ${GB}`, background:"#fff" }}>
          {TOP_TABS.map(({ key, label, Icon, href }) => {
            const active = key === "club";
            return (
              <button key={key} onClick={() => go(href)}
                style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4, padding:"10px 0", border:"none", background:"none", cursor:"pointer", fontFamily:"inherit", borderBottom:active?`2px solid ${P}`:"2px solid transparent", color:active?P:"#9CA3AF", fontWeight:active?600:500, transition:"color 0.15s" }}>
                <Icon size={20} />
                <span style={{ fontSize:11 }}>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Sub-nav: Keşfet / Takip Ettiklerim / Yakınımdakiler + Paylaş */}
        <div style={{ display:"flex", alignItems:"center", padding:"0 12px", background:"#fff", borderBottom:`1px solid ${GB}` }}>
          <div style={{ display:"flex", flex:1, overflowX:"auto" }}>
            {SUB_TABS.map(({ key, label }) => {
              const active = activeSubTab === key;
              return (
                <button key={key} onClick={() => setActiveSubTab(key)}
                  style={{ padding:"10px 12px", fontSize:13, fontWeight:active?700:500, color:active?"#111827":"#6B7280", borderBottom:active?`2px solid #111827`:"2px solid transparent", background:"none", border:"none", borderBottomWidth:2, borderBottomStyle:"solid", borderBottomColor:active?"#111827":"transparent", cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap", flexShrink:0 }}>
                  {label}
                </button>
              );
            })}
          </div>
          {/* + Paylaş */}
          <button
            onClick={() => showToast("Paylaşım özelliği yakında!")}
            style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px", background:P, color:"#fff", border:"none", borderRadius:999, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit", flexShrink:0, marginLeft:8 }}>
            <Plus size={14} />
            Paylaş
          </button>
        </div>
      </header>

      {/* ── Main content ── */}
      <main style={{ paddingBottom:96 }}>

        {/* Stories row */}
        <div style={{ display:"flex", gap:12, padding:"14px 12px", overflowX:"auto", borderBottom:`1px solid ${GB}` }}>
          {STORIES.map(story => (
            <div key={story.id} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5, cursor:"pointer", flexShrink:0, minWidth:62 }}
              onClick={() => showToast(`${story.name}'ın hikayesi`)}>
              <div style={{ position:"relative" }}>
                {/* Story ring */}
                <div style={{ width:60, height:60, borderRadius:"50%", padding:2, background:story.isMe?"#E5E7EB":`linear-gradient(135deg,${P},#EC4899)` }}>
                  <img src={story.img} alt={story.name} loading="lazy"
                    style={{ width:"100%", height:"100%", borderRadius:"50%", objectFit:"cover", border:"2px solid #fff", display:"block", filter:story.filter }} />
                </div>
                {/* + badge for own story */}
                {story.isMe && (
                  <div style={{ position:"absolute", bottom:0, right:0, width:20, height:20, borderRadius:"50%", background:P, border:"2px solid #fff", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Plus size={12} color="#fff" strokeWidth={3} />
                  </div>
                )}
              </div>
              <span style={{ fontSize:11, color:"#374151", fontWeight:500, textAlign:"center", maxWidth:62, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {story.name}
              </span>
            </div>
          ))}
        </div>

        {/* Feed posts */}
        {posts.map(post => (
          <PostCard key={post.id} post={post}
            onLike={() => toggleLike(post.id)}
            onSave={() => toggleSave(post.id)} />
        ))}
      </main>

      {/* ── Footer ── */}
      <footer style={{ background:FBG, color:"#fff" }}>
        {/* Newsletter */}
        <div style={{ margin:"0 16px", borderRadius:16, padding:20, background:NL }}>
          <h3 style={{ fontSize:15, fontWeight:600, margin:"0 0 4px" }}>Poodle dünyasından haberdar olun</h3>
          <p style={{ fontSize:13, color:"rgba(255,255,255,0.7)", margin:"0 0 16px", lineHeight:1.5 }}>
            Kampanyalar, yeni ürünler ve Poodle ipuçları e-postanıza gelsin.
          </p>
          <div style={{ display:"flex" }}>
            <input type="email" value={newsEmail} onChange={e => setNewsEmail(e.target.value)}
              placeholder="E-posta adresiniz"
              style={{ flex:1, background:"#fff", color:"#111827", borderRadius:"999px 0 0 999px", padding:"10px 16px", fontSize:13, border:"none", outline:"none", fontFamily:"inherit" }} />
            <button
              onClick={() => {
                if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsEmail)) { showToast("Bültene kaydoldunuz ✓"); setNewsEmail(""); }
                else showToast("Geçerli bir e-posta girin");
              }}
              style={{ background:"#4F46E5", color:"#fff", fontWeight:600, fontSize:13, padding:"10px 20px", borderRadius:"0 999px 999px 0", border:"none", cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}
              onMouseEnter={e=>{e.currentTarget.style.background="#4338CA";}} onMouseLeave={e=>{e.currentTarget.style.background="#4F46E5";}}>
              Üye Ol
            </button>
          </div>
          <p style={{ fontSize:11, color:"rgba(255,255,255,0.5)", margin:"8px 0 0" }}>
            Kayıt olarak KVKK Aydınlatma Metni'ni kabul etmiş olursunuz.
          </p>
        </div>
        {/* Branding */}
        <div style={{ padding:"24px 16px 0" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
            <img src="/images/yp-poodle-hero.png" alt="YourPoodle" loading="lazy" style={{ width:32, height:32, borderRadius:"50%", objectFit:"cover" }} />
            <span style={{ fontWeight:700, fontSize:17 }}>YourPoodle</span>
          </div>
          <p style={{ fontSize:13, color:"rgba(255,255,255,0.7)", margin:"0 0 20px", lineHeight:1.6 }}>
            Toy Poodle sahipleri için mutlu ve sağlıklı bir yaşam platformu.
          </p>
        </div>
        {/* Accordion */}
        <div style={{ padding:"0 16px" }}><FooterAccordion /></div>
        {/* Contact */}
        <div style={{ padding:"16px 16px 0", display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <Mail size={16} color="rgba(255,255,255,0.7)" />
            <span style={{ fontSize:13, color:"rgba(255,255,255,0.7)" }}>destek@yourpoodle.com</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <Clock size={16} color="rgba(255,255,255,0.7)" />
            <span style={{ fontSize:13, color:"rgba(255,255,255,0.7)" }}>Pzt–Cmt 09.00–18.00</span>
          </div>
        </div>
        {/* Social */}
        <div style={{ padding:"24px 16px 0", textAlign:"center" }}>
          <p style={{ fontSize:13, fontWeight:600, margin:"0 0 12px" }}>Bizi Takip Edin</p>
          <div style={{ display:"flex", justifyContent:"center", gap:16 }}>
            {[{Icon:Instagram,label:"Instagram"},{Icon:Youtube,label:"YouTube"},{Icon:Music2,label:"TikTok"},{Icon:Facebook,label:"Facebook"}].map(({Icon,label}) => (
              <a key={label} href="#" aria-label={label}
                style={{ width:36, height:36, borderRadius:"50%", border:"1px solid rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", cursor:"pointer", textDecoration:"none" }}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.1)";}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="transparent";}}>
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
        {/* Trust & Payment */}
        <div style={{ padding:"24px 16px 0", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <ShieldCheck size={16} color="rgba(255,255,255,0.6)" />
            <span style={{ fontSize:12, color:"rgba(255,255,255,0.6)" }}>256-bit SSL ile güvenli alışveriş</span>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            {["VISA","Mastercard","TROY"].map(b => (
              <span key={b} style={{ background:"#fff", color:"#374151", fontSize:11, fontWeight:700, padding:"4px 8px", borderRadius:4 }}>{b}</span>
            ))}
          </div>
        </div>
        {/* Copyright */}
        <div style={{ padding:"24px 16px", borderTop:"1px solid rgba(255,255,255,0.1)", marginTop:24 }}>
          <p style={{ fontSize:11, color:"rgba(255,255,255,0.5)", textAlign:"center", margin:"0 0 8px" }}>
            © 2026 YourPoodle. Tüm hakları saklıdır.
          </p>
          <div style={{ display:"flex", justifyContent:"center", gap:16 }}>
            {["Gizlilik","Çerezler","KVKK"].map(l => (
              <span key={l} style={{ fontSize:11, color:"rgba(255,255,255,0.5)", cursor:"pointer" }}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="#fff";}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="rgba(255,255,255,0.5)";}}>
                {l}
              </span>
            ))}
          </div>
        </div>
      </footer>

      {/* ── Fixed bottom nav ── */}
      <nav style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, background:"#fff", borderTop:`1px solid ${GB}`, boxShadow:"0 -4px 16px rgba(0,0,0,0.08)", display:"flex", alignItems:"flex-end", height:64, zIndex:900, paddingBottom:4 }}>
        {BOT_TABS.slice(0,2).map(({ key, label, Icon, href }) => {
          const active = activeNav===key;
          return (
            <button key={key} onClick={() => { setActiveNav(key); go(href); }}
              style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-end", gap:3, paddingBottom:8, border:"none", background:"none", cursor:"pointer", fontFamily:"inherit", color:active?P:"#9CA3AF" }}>
              <Icon size={22} strokeWidth={active?2:1.5} />
              <span style={{ fontSize:10, fontWeight:active?700:500, borderBottom:active?`2px solid ${P}`:"2px solid transparent", paddingBottom:1, lineHeight:1.2 }}>{label}</span>
            </button>
          );
        })}
        {/* Center — Sepetim */}
        <button onClick={() => { setActiveNav("sepetim"); go("/yourpoodle/sepet"); }}
          style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-end", gap:3, paddingBottom:8, border:"none", background:"none", cursor:"pointer", fontFamily:"inherit", position:"relative", color:activeNav==="sepetim"?P:"#111827" }}>
          <div style={{ position:"absolute", bottom:28, width:56, height:56, borderRadius:"50%", background:P, boxShadow:`0 0 0 6px rgba(98,0,238,0.15), 0 4px 16px rgba(98,0,238,0.35)`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <ShoppingCart size={26} color="#fff" strokeWidth={2} />
            {cartCount>0 && (
              <span style={{ position:"absolute", top:4, right:4, background:"#EF4444", color:"#fff", fontSize:9, fontWeight:800, width:16, height:16, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid #fff" }}>
                {cartCount>9?"9+":cartCount}
              </span>
            )}
          </div>
          <span style={{ fontSize:10, fontWeight:700, marginTop:2 }}>Sepetim</span>
        </button>
        {BOT_TABS.slice(2).map(({ key, label, Icon, href }) => {
          const active = activeNav===key;
          return (
            <button key={key} onClick={() => { setActiveNav(key); go(href); }}
              style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-end", gap:3, paddingBottom:8, border:"none", background:"none", cursor:"pointer", fontFamily:"inherit", color:active?P:"#9CA3AF" }}>
              <Icon size={22} strokeWidth={active?2:1.5} />
              <span style={{ fontSize:10, fontWeight:active?700:500, borderBottom:active?`2px solid ${P}`:"2px solid transparent", paddingBottom:1, lineHeight:1.2 }}>{label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
