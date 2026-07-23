import React, { useState } from "react";
import { useLocation } from "wouter";
import {
  Bell, MessageCircle, Heart, Send, Bookmark, MoreHorizontal,
  Smile, Plus, CheckCircle, Smile as SmileIcon,
} from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";

/* ── Design tokens ── */
const P   = "#6200EE";
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
  id: number; name: string; handle: string; location: string;
  avatar: string; avatarFilter: string; verified: boolean; following: boolean;
  featured: boolean; image: string; imageFilter: string; likes: string;
  caption: string; hashtags: string; commentUser: string; commentText: string;
  commentCount: number; timeAgo: string;
}

const INITIAL_POSTS: Post[] = [
  {
    id: 1, name: "Tarçın", handle: "@tarcin.poodle", location: "Samsun",
    avatar: LOCAL, avatarFilter: "hue-rotate(20deg) saturate(1.2)",
    verified: true, following: true, featured: true,
    image: LOCAL, imageFilter: "hue-rotate(20deg) saturate(1.1) brightness(0.95)",
    likes: "1.248", caption: "Tarçın bugün parkta baharın tadını çıkardı 💜",
    hashtags: "#toypoodle #park", commentUser: "mia.poodle",
    commentText: "Ne tatlısın Tarçın! O gülüşe bayıldım 😍", commentCount: 38, timeAgo: "2 saat önce",
  },
  {
    id: 2, name: "Luna", handle: "@lunatoypoodle", location: "İstanbul",
    avatar: LOCAL, avatarFilter: "brightness(1.5) saturate(0.3)",
    verified: true, following: false, featured: false,
    image: LOCAL, imageFilter: "brightness(1.4) saturate(0.4)",
    likes: "892", caption: "Kahve molasına beni de götürdüler ☕🐾",
    hashtags: "#poodleclub #istanbul", commentUser: "tarcin.poodle",
    commentText: "Ben de gelsene Luna! 🐾🤣", commentCount: 21, timeAgo: "5 saat önce",
  },
  {
    id: 3, name: "Loki", handle: "@lokimaceralari", location: "Ankara",
    avatar: LOCAL, avatarFilter: "grayscale(0.85) brightness(0.65)",
    verified: false, following: false, featured: false,
    image: LOCAL, imageFilter: "grayscale(0.7) brightness(0.7)",
    likes: "1.057", caption: "Topumu kimseye vermem! 😎🟢",
    hashtags: "#oyunzamanı #poodle", commentUser: "badem.poodle",
    commentText: "En iyi oyun arkadaşı! 🧡", commentCount: 45, timeAgo: "Dün",
  },
];

/* ── Post Card ── */
function PostCard({ post, onLike, onSave }: {
  post: Post & { liked: boolean; saved: boolean };
  onLike: ()=>void; onSave: ()=>void;
}) {
  const [following, setFollowing] = useState(post.following);
  const [comment, setComment] = useState("");
  return (
    <article style={{ borderBottom:`1px solid ${GB}`, paddingBottom:0, marginBottom:0 }}>
      <div style={{ display:"flex", alignItems:"center", padding:"10px 12px", gap:10 }}>
        <img src={post.avatar} alt={post.name} loading="lazy"
          style={{ width:40, height:40, borderRadius:"50%", objectFit:"cover", border:`2px solid ${P}`, flexShrink:0, filter:post.avatarFilter }} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:4 }}>
            <span style={{ fontWeight:700, fontSize:14, color:"#111827" }}>{post.name}</span>
            {post.verified && (
              <CheckCircle size={14} color="#6200EE" fill="#6200EE" strokeWidth={0} style={{ flexShrink:0 }} />
            )}
          </div>
          <div style={{ fontSize:12, color:"#6B7280" }}>{post.handle} · {post.location}</div>
        </div>
        <button onClick={() => setFollowing(f => !f)}
          style={{ padding:"5px 14px", borderRadius:999, fontSize:12, fontWeight:600,
                   cursor:"pointer", fontFamily:"inherit", flexShrink:0, transition:"all 0.15s",
                   background: following ? "#fff" : P,
                   color: following ? P : "#fff",
                   border: following ? `1.5px solid ${P}` : "none" }}>
          {following ? "Takiptesin" : "Takip Et"}
        </button>
        <button style={{ background:"none", border:"none", cursor:"pointer", padding:"4px", display:"flex" }}>
          <MoreHorizontal size={20} color="#6B7280" />
        </button>
      </div>

      <div style={{ position:"relative", width:"100%", lineHeight:0 }}>
        <img src={post.image} alt={post.caption} loading="lazy"
          style={{ width:"100%", height:320, objectFit:"cover", display:"block", filter:post.imageFilter }} />
        {post.featured && (
          <div style={{ position:"absolute", top:12, right:12, background:`linear-gradient(135deg,${P},#4F46E5)`,
                        color:"#fff", fontSize:11, fontWeight:700, padding:"5px 10px", borderRadius:999,
                        display:"flex", alignItems:"center", gap:5, boxShadow:"0 2px 8px rgba(98,0,238,0.4)" }}>
            🐾 Haftanın Poodle'ı
          </div>
        )}
      </div>

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

      <div style={{ padding:"0 12px 4px" }}>
        <span style={{ fontSize:14, fontWeight:700, color:"#111827" }}>{post.likes} beğeni</span>
      </div>
      <div style={{ padding:"0 12px 4px", fontSize:14, color:"#111827", lineHeight:1.5 }}>
        <span style={{ fontWeight:700 }}>{post.name.toLowerCase().replace(" ","")}.poodle </span>
        {post.caption} <span style={{ color:P }}>{post.hashtags}</span>
      </div>
      <div style={{ padding:"0 12px 4px", fontSize:14, color:"#111827" }}>
        <span style={{ fontWeight:700 }}>{post.commentUser} </span>
        {post.commentText}
      </div>
      <button style={{ background:"none", border:"none", cursor:"pointer", padding:"0 12px 6px", fontSize:13, color:"#6B7280", fontFamily:"inherit", display:"block" }}>
        {post.commentCount} yorumun tümünü gör
      </button>
      <div style={{ display:"flex", alignItems:"center", padding:"6px 12px 10px", gap:8, borderTop:`1px solid ${GB}` }}>
        <Smile size={20} color="#6B7280" style={{ flexShrink:0 }} />
        <input type="text" value={comment} onChange={e => setComment(e.target.value)}
          placeholder="Yorum ekle..."
          style={{ flex:1, border:"none", outline:"none", fontSize:13, color:"#111827", background:"none", fontFamily:"inherit" }} />
        <span style={{ fontSize:11, color:"#9CA3AF", flexShrink:0 }}>{post.timeAgo}</span>
      </div>
    </article>
  );
}

/* ── Main page ── */
export default function YPClubPage() {
  const [activeSubTab, setActiveSubTab] = useState("kesfet");
  const [toast, setToast]       = useState({ message:"", visible:false });
  const [posts, setPosts] = useState(
    INITIAL_POSTS.map(p => ({ ...p, liked: false, saved: false }))
  );

  const showToast = (msg: string) => {
    setToast({ message:msg, visible:true });
    setTimeout(() => setToast(t => ({ ...t, visible:false })), 3000);
  };

  const toggleLike = (id: number) => setPosts(prev => prev.map(p => p.id===id ? { ...p, liked:!p.liked } : p));
  const toggleSave = (id: number) => setPosts(prev => prev.map(p => p.id===id ? { ...p, saved:!p.saved } : p));

  const SUB_TABS = [
    { key:"kesfet",      label:"Keşfet"          },
    { key:"takip",       label:"Takip Ettiklerim" },
    { key:"yakinimdaki", label:"Yakınımdakiler"   },
  ];

  return (
    <YPLayout activeLink="/yourpoodle/club" constrain={false}>
      <style>{`button { font-family:inherit; } .toast-box{position:fixed;bottom:88px;left:50%;transform:translateX(-50%);zIndex:999;pointer-events:none;transition:opacity 0.3s;}`}</style>

      {/* Toast */}
      <div style={{ position:"fixed", bottom:88, left:"50%", transform:"translateX(-50%)", zIndex:999, pointerEvents:"none", opacity:toast.visible?1:0, transition:"opacity 0.3s ease" }}>
        <div style={{ background:"#1A0052", color:"#fff", padding:"12px 24px", borderRadius:999, fontSize:14, fontWeight:500, whiteSpace:"nowrap", boxShadow:"0 4px 16px rgba(0,0,0,0.25)" }}>
          {toast.message}
        </div>
      </div>

      {/* Club header row with notification icons */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-end",
                    padding:"10px 16px", borderBottom:`1px solid ${GB}`,
                    background:"#fff", gap:14 }}>
        <div style={{ position:"relative" }}>
          <button style={{ background:"none", border:"none", cursor:"pointer", display:"flex", padding:0 }}>
            <Bell size={24} color="#374151" strokeWidth={1.75} />
          </button>
          <span style={{ position:"absolute", top:-4, right:-5, background:"#EF4444", color:"#fff", fontSize:9, fontWeight:800, width:16, height:16, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid #fff" }}>4</span>
        </div>
        <div style={{ position:"relative" }}>
          <button style={{ background:"none", border:"none", cursor:"pointer", display:"flex", padding:0 }}>
            <MessageCircle size={24} color="#374151" strokeWidth={1.75} />
          </button>
          <span style={{ position:"absolute", top:-4, right:-5, background:P, color:"#fff", fontSize:9, fontWeight:800, width:16, height:16, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid #fff" }}>2</span>
        </div>
        <button style={{ background:"none", border:"none", cursor:"pointer", padding:0 }}>
          <img src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=80&h=80&fit=crop&crop=face"
            alt="Profil" loading="lazy"
            style={{ width:32, height:32, borderRadius:"50%", objectFit:"cover", border:`2px solid ${P}` }} />
        </button>
      </div>

      {/* Sub-nav: Keşfet / Takip / Yakınımdakiler + Paylaş */}
      <div style={{ display:"flex", alignItems:"center", padding:"0 12px", background:"#fff", borderBottom:`1px solid ${GB}` }}>
        <div style={{ display:"flex", flex:1, overflowX:"auto" }}>
          {SUB_TABS.map(({ key, label }) => {
            const active = activeSubTab === key;
            return (
              <button key={key} onClick={() => setActiveSubTab(key)}
                style={{ padding:"10px 12px", fontSize:13, fontWeight:active?700:500,
                         color:active?"#111827":"#6B7280",
                         borderBottom:active?`2px solid #111827`:"2px solid transparent",
                         background:"none", border:"none", borderBottomWidth:2, borderBottomStyle:"solid",
                         borderBottomColor:active?"#111827":"transparent",
                         cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap", flexShrink:0 }}>
                {label}
              </button>
            );
          })}
        </div>
        <button onClick={() => showToast("Paylaşım özelliği yakında!")}
          style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px", background:P, color:"#fff",
                   border:"none", borderRadius:999, fontSize:12, fontWeight:700, cursor:"pointer",
                   fontFamily:"inherit", flexShrink:0, marginLeft:8 }}>
          <Plus size={14} />
          Paylaş
        </button>
      </div>

      {/* Stories row */}
      <div style={{ display:"flex", gap:12, padding:"14px 12px", overflowX:"auto", borderBottom:`1px solid ${GB}` }}>
        {STORIES.map(story => (
          <div key={story.id}
            style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5, cursor:"pointer", flexShrink:0, minWidth:62 }}
            onClick={() => showToast(`${story.name}'ın hikayesi`)}>
            <div style={{ position:"relative" }}>
              <div style={{ width:60, height:60, borderRadius:"50%", padding:2, background:story.isMe?"#E5E7EB":`linear-gradient(135deg,${P},#EC4899)` }}>
                <img src={story.img} alt={story.name} loading="lazy"
                  style={{ width:"100%", height:"100%", borderRadius:"50%", objectFit:"cover", border:"2px solid #fff", display:"block", filter:story.filter }} />
              </div>
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
      <div style={{ paddingBottom:96 }}>
        {posts.map(post => (
          <PostCard key={post.id} post={post}
            onLike={() => toggleLike(post.id)}
            onSave={() => toggleSave(post.id)} />
        ))}
      </div>
    </YPLayout>
  );
}
