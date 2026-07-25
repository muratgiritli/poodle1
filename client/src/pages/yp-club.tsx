import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { IS_YP } from "@/lib/store";
import {
  Bell, MessageCircle, Heart, Send, Bookmark, MoreHorizontal,
  Smile, CheckCircle, ChevronDown, ChevronUp,
} from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";

const BASE = IS_YP ? "" : "/yourpoodle";

/* ── Design tokens ── */
const P  = "#6200EE";
const GB = "#E5E7EB";

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
interface Comment { author: string; text: string; }
interface Post {
  id: number; name: string; handle: string; location: string;
  avatar: string; avatarFilter: string; verified: boolean; following: boolean;
  featured: boolean; image: string; imageFilter: string; likes: string;
  caption: string; hashtags: string; comments: Comment[];
  timeAgo: string;
}

const INITIAL_POSTS: Post[] = [
  {
    id: 1, name: "Tarçın", handle: "@tarcin.poodle", location: "Samsun",
    avatar: LOCAL, avatarFilter: "hue-rotate(20deg) saturate(1.2)",
    verified: true, following: true, featured: true,
    image: LOCAL, imageFilter: "hue-rotate(20deg) saturate(1.1) brightness(0.95)",
    likes: "1.248", caption: "Tarçın bugün parkta baharın tadını çıkardı 💜",
    hashtags: "#toypoodle #park",
    comments: [
      { author: "mia.poodle", text: "Ne tatlısın Tarçın! O gülüşe bayıldım 😍" },
      { author: "luna.poodle", text: "Çok sevimli, park hangisi?" },
      { author: "badem.ailesi", text: "Birlikte parka gidelim! 🐾" },
    ],
    timeAgo: "2 saat önce",
  },
  {
    id: 2, name: "Luna", handle: "@lunatoypoodle", location: "İstanbul",
    avatar: LOCAL, avatarFilter: "brightness(1.5) saturate(0.3)",
    verified: true, following: false, featured: false,
    image: LOCAL, imageFilter: "brightness(1.4) saturate(0.4)",
    likes: "892", caption: "Kahve molasına beni de götürdüler ☕🐾",
    hashtags: "#poodleclub #istanbul",
    comments: [
      { author: "tarcin.poodle", text: "Ben de gelsene Luna! 🐾🤣" },
      { author: "mia.poodle",    text: "Kahve içen poodle harikaaa 😂" },
    ],
    timeAgo: "5 saat önce",
  },
  {
    id: 3, name: "Loki", handle: "@lokimaceralari", location: "Ankara",
    avatar: LOCAL, avatarFilter: "grayscale(0.85) brightness(0.65)",
    verified: false, following: false, featured: false,
    image: LOCAL, imageFilter: "grayscale(0.7) brightness(0.7)",
    likes: "1.057", caption: "Topumu kimseye vermem! 😎🟢",
    hashtags: "#oyunzamanı #poodle",
    comments: [
      { author: "badem.poodle", text: "En iyi oyun arkadaşı! 🧡" },
      { author: "luna.poodle",  text: "Loki çok komiksin 😄" },
    ],
    timeAgo: "Dün",
  },
];

/* ── Inline toast ── */
function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div style={{
      position: "fixed", bottom: 88, left: "50%", transform: "translateX(-50%)",
      zIndex: 999, pointerEvents: "none", opacity: visible ? 1 : 0, transition: "opacity 0.3s ease",
    }}>
      <div style={{
        background: "#1A0052", color: "#fff", padding: "12px 24px",
        borderRadius: 999, fontSize: 14, fontWeight: 500,
        whiteSpace: "nowrap", boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
      }}>
        {message}
      </div>
    </div>
  );
}

/* ── Post Card ── */
function PostCard({
  post, onLike, onSave,
}: {
  post: Post & { liked: boolean; saved: boolean; following: boolean };
  onLike: () => void;
  onSave: () => void;
}) {
  const [following, setFollowing] = useState(post.following);
  const [commentInput, setCommentInput] = useState("");
  const [localComments, setLocalComments] = useState<Comment[]>(post.comments);
  const [expanded, setExpanded] = useState(false);
  const [copyDone, setCopyDone] = useState(false);

  const submitComment = () => {
    const t = commentInput.trim();
    if (!t) return;
    setLocalComments(prev => [...prev, { author: "sen", text: t }]);
    setCommentInput("");
    setExpanded(true);
  };

  const handleShare = async () => {
    const url = window.location.href;
    const data = { title: `${post.name} - YourPoodle Club`, text: post.caption, url };
    if (navigator.share) {
      try { await navigator.share(data); } catch (e: any) { if (e?.name === "AbortError") return; }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopyDone(true);
        setTimeout(() => setCopyDone(false), 2000);
      } catch {}
    }
  };

  const visibleComments = expanded ? localComments : localComments.slice(0, 1);
  const hiddenCount = localComments.length - visibleComments.length;

  return (
    <article style={{ borderBottom: `1px solid ${GB}`, paddingBottom: 0, marginBottom: 0 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", padding: "10px 12px", gap: 10 }}>
        <img src={post.avatar} alt={post.name} loading="lazy"
          style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", border: `2px solid ${P}`, flexShrink: 0, filter: post.avatarFilter }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{post.name}</span>
            {post.verified && <CheckCircle size={14} color="#6200EE" fill="#6200EE" strokeWidth={0} style={{ flexShrink: 0 }} />}
          </div>
          <div style={{ fontSize: 12, color: "#6B7280" }}>{post.handle} · {post.location}</div>
        </div>
        <button
          aria-label={following ? "Takibi bırak" : "Takip et"}
          onClick={() => setFollowing(f => !f)}
          style={{
            padding: "5px 14px", borderRadius: 999, fontSize: 12, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit", flexShrink: 0, transition: "all 0.15s",
            background: following ? "#fff" : P, color: following ? P : "#fff",
            border: following ? `1.5px solid ${P}` : "none",
          }}>
          {following ? "Takiptesin" : "Takip Et"}
        </button>
        <button aria-label="Daha fazla seçenek" style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex" }}>
          <MoreHorizontal size={20} color="#6B7280" />
        </button>
      </div>

      {/* Image */}
      <div style={{ position: "relative", width: "100%", lineHeight: 0 }}>
        <img src={post.image} alt={post.caption} loading="lazy"
          style={{ width: "100%", height: 320, objectFit: "cover", display: "block", filter: post.imageFilter }} />
        {post.featured && (
          <div style={{
            position: "absolute", top: 12, right: 12,
            background: `linear-gradient(135deg,${P},#4F46E5)`,
            color: "#fff", fontSize: 11, fontWeight: 700, padding: "5px 10px", borderRadius: 999,
            display: "flex", alignItems: "center", gap: 5, boxShadow: "0 2px 8px rgba(98,0,238,0.4)",
          }}>
            🐾 Haftanın Poodle'ı
          </div>
        )}
      </div>

      {/* Actions row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px 6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button aria-label={post.liked ? "Beğeniyi geri al" : "Beğen"} onClick={onLike}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: 0, transition: "transform 0.1s" }}
            onMouseDown={e => { e.currentTarget.style.transform = "scale(0.85)"; }}
            onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}>
            <Heart size={24} color={post.liked ? "#EF4444" : "#111827"} fill={post.liked ? "#EF4444" : "none"} strokeWidth={1.75} />
          </button>
          <button aria-label="Yorum yap"
            onClick={() => { document.getElementById(`comment-${post.id}`)?.focus(); }}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: 0 }}>
            <MessageCircle size={24} color="#111827" strokeWidth={1.75} />
          </button>
          <button
            aria-label={copyDone ? "Bağlantı kopyalandı" : "Paylaş"}
            onClick={handleShare}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: 0 }}>
            <Send size={24} color={copyDone ? P : "#111827"} strokeWidth={1.75} />
          </button>
        </div>
        <button aria-label={post.saved ? "Kaydedildi" : "Kaydet"} onClick={onSave}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: 0 }}>
          <Bookmark size={24} color="#111827" fill={post.saved ? "#111827" : "none"} strokeWidth={1.75} />
        </button>
      </div>

      {copyDone && (
        <div style={{ padding: "0 12px 4px", fontSize: 12, color: P, fontWeight: 600 }}>
          Bağlantı kopyalandı ✓
        </div>
      )}

      {/* Likes */}
      <div style={{ padding: "0 12px 4px" }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{post.likes} beğeni</span>
      </div>

      {/* Caption */}
      <div style={{ padding: "0 12px 4px", fontSize: 14, color: "#111827", lineHeight: 1.5 }}>
        <span style={{ fontWeight: 700 }}>{post.name.toLowerCase().replace(" ", "")}.poodle </span>
        {post.caption} <span style={{ color: P }}>{post.hashtags}</span>
      </div>

      {/* Comments */}
      {visibleComments.map((c, i) => (
        <div key={i} style={{ padding: "0 12px 4px", fontSize: 14, color: "#111827" }}>
          <span style={{ fontWeight: 700 }}>{c.author} </span>{c.text}
        </div>
      ))}

      {/* Expand / collapse comments */}
      {localComments.length > 1 && (
        <button
          onClick={() => setExpanded(e => !e)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "0 12px 6px", fontSize: 13, color: "#6B7280", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}>
          {expanded
            ? <><ChevronUp size={14} /> Yorumları gizle</>
            : <><ChevronDown size={14} /> {hiddenCount} yorumun tümünü gör</>
          }
        </button>
      )}

      {/* Comment input */}
      <div style={{ display: "flex", alignItems: "center", padding: "6px 12px 10px", gap: 8, borderTop: `1px solid ${GB}` }}>
        <Smile size={20} color="#6B7280" style={{ flexShrink: 0 }} />
        <input
          id={`comment-${post.id}`}
          type="text"
          value={commentInput}
          onChange={e => setCommentInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitComment(); } }}
          placeholder="Yorum ekle..."
          aria-label="Yorum ekle"
          style={{ flex: 1, border: "none", outline: "none", fontSize: 13, color: "#111827", background: "none", fontFamily: "inherit" }}
        />
        {commentInput.trim() && (
          <button
            onClick={submitComment}
            style={{ background: "none", border: "none", cursor: "pointer", color: P, fontSize: 13, fontWeight: 700, fontFamily: "inherit", flexShrink: 0, padding: "0 4px" }}>
            Gönder
          </button>
        )}
        <span style={{ fontSize: 11, color: "#9CA3AF", flexShrink: 0 }}>{post.timeAgo}</span>
      </div>
    </article>
  );
}

/* ── Main page ── */
export default function YPClubPage() {
  const [, navigate] = useLocation();
  const [activeSubTab, setActiveSubTab] = useState("kesfet");
  const [toast, setToast] = useState({ message: "", visible: false });
  const [posts, setPosts] = useState(
    INITIAL_POSTS.map(p => ({ ...p, liked: false, saved: false }))
  );

  useEffect(() => { document.title = "Club | YourPoodle"; }, []);

  const showToast = useCallback((msg: string) => {
    setToast({ message: msg, visible: true });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2500);
  }, []);

  const toggleLike = (id: number) => setPosts(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked } : p));
  const toggleSave = (id: number) => setPosts(prev => prev.map(p => p.id === id ? { ...p, saved: !p.saved } : p));

  const SUB_TABS = [
    { key: "kesfet",      label: "Keşfet"          },
    { key: "takip",       label: "Takip Ettiklerim" },
    { key: "yakinimdaki", label: "Yakınımdakiler"   },
  ];

  const visiblePosts = posts.filter(p => {
    if (activeSubTab === "takip") return p.following;
    return true; // keşfet + yakınımdakiler show all
  });

  return (
    <YPLayout activeLink={`${BASE}/club`} constrain={false} hideFooter>
      <style>{`button { font-family: inherit; }`}</style>
      <Toast message={toast.message} visible={toast.visible} />

      <div className="yp-feed-center">

        {/* ── In-feed header: notifications + DM + profile ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "flex-end",
          padding: "10px 16px", borderBottom: `1px solid ${GB}`,
          background: "#fff", gap: 14,
        }}>
          {/* Bildirimler */}
          <div style={{ position: "relative" }}>
            <button
              aria-label="Bildirimler"
              onClick={() => navigate(`${BASE}/bildirimler`)}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 0, width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
              <Bell size={24} color="#374151" strokeWidth={1.75} />
            </button>
            <span style={{
              position: "absolute", top: 4, right: 4, background: "#EF4444", color: "#fff",
              fontSize: 9, fontWeight: 800, width: 16, height: 16, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff",
              pointerEvents: "none",
            }}>4</span>
          </div>

          {/* DM (no DM system — navigate to keşfet) */}
          <button
            aria-label="Mesajlar"
            onClick={() => navigate(`${BASE}/club/kesfet`)}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 0, width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
            <MessageCircle size={24} color="#374151" strokeWidth={1.75} />
          </button>

          {/* Profile avatar */}
          <button
            aria-label="Benim Poodle'ım"
            onClick={() => navigate(`${BASE}/benim-poodleim`)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src="/images/yp-poodle-hero.png" alt="Profil" loading="lazy"
              style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", border: `2px solid ${P}` }} />
          </button>
        </div>

        {/* ── Sub-nav tabs ── */}
        <div style={{ display: "flex", alignItems: "center", padding: "0 12px", background: "#fff", borderBottom: `1px solid ${GB}`, overflowX: "auto" }}>
          {SUB_TABS.map(({ key, label }) => {
            const active = activeSubTab === key;
            return (
              <button key={key} onClick={() => setActiveSubTab(key)}
                style={{
                  padding: "10px 12px", fontSize: 13, fontWeight: active ? 700 : 500,
                  color: active ? "#111827" : "#6B7280",
                  borderBottom: `2px solid ${active ? "#111827" : "transparent"}`,
                  background: "none", border: "none", borderBottomWidth: 2, borderBottomStyle: "solid",
                  borderBottomColor: active ? "#111827" : "transparent",
                  cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", flexShrink: 0,
                }}>
                {label}
              </button>
            );
          })}
        </div>

        {/* ── Stories row ── */}
        <div style={{ display: "flex", gap: 12, padding: "14px 12px", overflowX: "auto", borderBottom: `1px solid ${GB}`, scrollbarWidth: "none" }}>
          {STORIES.map(story => (
            <div key={story.id}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, cursor: "pointer", flexShrink: 0, minWidth: 62 }}
              onClick={() => showToast(`${story.name}'ın hikayesi açıldı`)}>
              <div style={{ position: "relative" }}>
                <div style={{ width: 60, height: 60, borderRadius: "50%", padding: 2, background: story.isMe ? "#E5E7EB" : `linear-gradient(135deg,${P},#EC4899)` }}>
                  <img src={story.img} alt={story.name} loading="lazy"
                    style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "2px solid #fff", display: "block", filter: story.filter }} />
                </div>
                {story.isMe && (
                  <div style={{ position: "absolute", bottom: 0, right: 0, width: 20, height: 20, borderRadius: "50%", background: P, border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "#fff", fontSize: 14, lineHeight: 1, fontWeight: 900 }}>+</span>
                  </div>
                )}
              </div>
              <span style={{ fontSize: 11, color: "#374151", fontWeight: 500, textAlign: "center", maxWidth: 62, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {story.isMe ? "Hikayen" : story.name}
              </span>
            </div>
          ))}
        </div>

        {/* ── Feed posts ── */}
        <div style={{ paddingBottom: 96 }}>
          {visiblePosts.length === 0 ? (
            <div style={{ padding: "48px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🐾</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#111827", marginBottom: 8 }}>
                {activeSubTab === "takip" ? "Henüz kimseyi takip etmiyorsun" : "Yakınında paylaşım yok"}
              </div>
              <p style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 24, maxWidth: 260, margin: "0 auto 24px" }}>
                {activeSubTab === "takip"
                  ? "Keşfet sekmesinden Poodle sahiplerini bul ve takip et."
                  : "Şu an için yakınında aktif kullanıcı bulunamadı."}
              </p>
              <button onClick={() => setActiveSubTab("kesfet")}
                style={{ padding: "10px 24px", borderRadius: 12, border: "none", background: P, color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
                Keşfet'e Git
              </button>
            </div>
          ) : (
            visiblePosts.map(post => (
              <PostCard key={post.id} post={post}
                onLike={() => toggleLike(post.id)}
                onSave={() => toggleSave(post.id)} />
            ))
          )}
        </div>

      </div>
    </YPLayout>
  );
}
