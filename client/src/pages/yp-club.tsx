import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import { IS_YP } from "@/lib/store";
import {
  Bell, MessageCircle, Heart, Send, Bookmark, MoreHorizontal,
  Smile, CheckCircle, ChevronDown, ChevronUp, X, Copy, Flag, UserMinus, UserPlus,
} from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";

const BASE = IS_YP ? "" : "/yourpoodle";

/* ── Design tokens ── */
const P  = "#6200EE";
const GB = "#E5E7EB";

/* ── Stories data ── */
const LOCAL = "/images/yp-poodle-hero.png";
interface Story { id: number; name: string; img: string; filter: string; isMe: boolean; genitive: string; }
const STORIES: Story[] = [
  { id: 1, name: "Mia",    img: LOCAL, filter: "none",                              isMe: true,  genitive: "Mia'nın"    },
  { id: 2, name: "Tarçın", img: LOCAL, filter: "hue-rotate(20deg) saturate(1.2)",  isMe: false, genitive: "Tarçın'ın"  },
  { id: 3, name: "Loki",   img: LOCAL, filter: "grayscale(0.85) brightness(0.65)", isMe: false, genitive: "Loki'nin"   },
  { id: 4, name: "Luna",   img: LOCAL, filter: "brightness(1.5) saturate(0.3)",    isMe: false, genitive: "Luna'nın"   },
  { id: 5, name: "Badem",  img: LOCAL, filter: "sepia(0.5) hue-rotate(-10deg)",    isMe: false, genitive: "Badem'in"   },
];

const STORY_DURATION = 5000; // ms per story

/* ── Story Viewer ── */
function StoryViewer({
  stories, startIndex, onClose,
}: {
  stories: Story[]; startIndex: number; onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const animRef = useRef<number | null>(null);
  const startTs = useRef<number>(0);

  const goNext = useCallback(() => {
    if (idx < stories.length - 1) { setIdx(i => i + 1); setProgress(0); }
    else onClose();
  }, [idx, stories.length, onClose]);

  const goPrev = useCallback(() => {
    if (idx > 0) { setIdx(i => i - 1); setProgress(0); }
  }, [idx]);

  /* Auto-advance with rAF for smooth progress bar */
  useEffect(() => {
    setProgress(0);
    startTs.current = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTs.current;
      const pct = Math.min(elapsed / STORY_DURATION, 1);
      setProgress(pct);
      if (pct < 1) { animRef.current = requestAnimationFrame(tick); }
      else goNext();
    };
    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [idx, goNext]);

  /* Lock body scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  /* Keyboard */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [goNext, goPrev, onClose]);

  const story = stories[idx];

  return (
    <div
      role="dialog"
      aria-label={story.isMe ? "Kendi hikayen" : `${story.genitive} hikayesi`}
      style={{
        position: "fixed", inset: 0, zIndex: 2000,
        background: "#000", display: "flex", flexDirection: "column",
      }}
    >
      {/* Progress bars */}
      <div style={{ display: "flex", gap: 3, padding: "12px 12px 8px", position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 }}>
        {stories.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 3, background: "rgba(255,255,255,0.35)", overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 3, background: "#fff",
              width: i < idx ? "100%" : i === idx ? `${progress * 100}%` : "0%",
              transition: i === idx ? "none" : undefined,
            }} />
          </div>
        ))}
      </div>

      {/* Header */}
      <div style={{
        position: "absolute", top: 32, left: 0, right: 0, zIndex: 10,
        display: "flex", alignItems: "center", padding: "0 12px", gap: 10,
      }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid #fff", overflow: "hidden", flexShrink: 0 }}>
          <img src={story.img} alt={story.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: story.filter }} />
        </div>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 14, flex: 1, textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
          {story.isMe ? "Hikayen" : story.name}
        </span>
        <button
          aria-label="Kapat"
          onClick={onClose}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 8, color: "#fff", display: "flex" }}>
          <X size={24} />
        </button>
      </div>

      {/* Image */}
      <div style={{ flex: 1, position: "relative" }}>
        <img
          src={story.img} alt={story.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: story.filter }}
        />
        {/* Gradient overlays */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.4) 100%)" }} />
      </div>

      {/* Tap zones — prev / next */}
      <div style={{ position: "absolute", inset: 0, display: "flex", zIndex: 5 }}>
        <div
          aria-label="Önceki hikaye"
          role="button"
          tabIndex={0}
          onClick={goPrev}
          onKeyDown={e => e.key === "Enter" && goPrev()}
          style={{ flex: "0 0 30%", cursor: "pointer" }}
        />
        <div
          aria-label="Sonraki hikaye"
          role="button"
          tabIndex={0}
          onClick={goNext}
          onKeyDown={e => e.key === "Enter" && goNext()}
          style={{ flex: 1, cursor: "pointer" }}
        />
      </div>
    </div>
  );
}

/* ── Post action sheet ── */
function PostActionSheet({
  postName, following, onClose, onToggleFollow, onCopyLink, onReport,
}: {
  postName: string; following: boolean;
  onClose: () => void;
  onToggleFollow: () => void;
  onCopyLink: () => void;
  onReport: () => void;
}) {
  /* Close on backdrop click */
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1500 }}
      />
      {/* Sheet */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1600,
        background: "#fff", borderRadius: "20px 20px 0 0",
        padding: "12px 0 calc(env(safe-area-inset-bottom, 0px) + 16px)",
        boxShadow: "0 -4px 32px rgba(0,0,0,0.15)",
        animation: "sheet-up 0.2s ease",
      }}>
        <style>{`@keyframes sheet-up { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>

        {/* Handle */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "#E5E7EB", margin: "0 auto 16px" }} />

        {/* Post label */}
        <div style={{ padding: "0 20px 12px", borderBottom: "1px solid #F3F4F6", fontSize: 13, color: "#9CA3AF", fontWeight: 500 }}>
          {postName} paylaşımı
        </div>

        {/* Actions */}
        {[
          {
            Icon: following ? UserMinus : UserPlus,
            label: following ? "Takibi Bırak" : "Takip Et",
            color: following ? "#EF4444" : "#111827",
            action: () => { onToggleFollow(); onClose(); },
          },
          {
            Icon: Copy,
            label: "Bağlantıyı Kopyala",
            color: "#111827",
            action: () => { onCopyLink(); onClose(); },
          },
          {
            Icon: Flag,
            label: "Şikayet Et",
            color: "#EF4444",
            action: () => { onReport(); onClose(); },
          },
        ].map(({ Icon, label, color, action }) => (
          <button
            key={label}
            onClick={action}
            style={{
              display: "flex", alignItems: "center", gap: 14,
              width: "100%", padding: "15px 20px",
              background: "none", border: "none", cursor: "pointer",
              fontSize: 15, fontWeight: 600, color,
              fontFamily: "inherit", textAlign: "left",
              transition: "background 0.1s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#F9FAFB")}
            onMouseLeave={e => (e.currentTarget.style.background = "none")}
          >
            <Icon size={20} color={color} />
            {label}
          </button>
        ))}

        {/* Cancel */}
        <div style={{ borderTop: "8px solid #F3F4F6", marginTop: 4 }}>
          <button
            onClick={onClose}
            style={{
              width: "100%", padding: "16px 20px", background: "none", border: "none",
              cursor: "pointer", fontSize: 15, fontWeight: 700, color: "#6200EE",
              fontFamily: "inherit",
            }}>
            İptal
          </button>
        </div>
      </div>
    </>
  );
}

/* ── Feed post data ── */
interface Comment { author: string; text: string; }
interface Post {
  id: number; name: string; handle: string; location: string;
  avatar: string; avatarFilter: string; verified: boolean; following: boolean;
  featured: boolean; nearby: boolean;
  image: string; imageFilter: string; likes: string;
  caption: string; hashtags: string; comments: Comment[];
  timeAgo: string;
}

const INITIAL_POSTS: Post[] = [
  {
    id: 1, name: "Tarçın", handle: "@tarcin.poodle", location: "Samsun",
    avatar: LOCAL, avatarFilter: "hue-rotate(20deg) saturate(1.2)",
    verified: true, following: true, featured: true, nearby: true,
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
    verified: true, following: false, featured: false, nearby: false,
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
    verified: false, following: false, featured: false, nearby: false,
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
  post, onLike, onSave, onToggleFollow, onShowMenu,
}: {
  post: Post & { liked: boolean; saved: boolean };
  onLike: () => void;
  onSave: () => void;
  onToggleFollow: (id: number) => void;
  onShowMenu: (id: number) => void;
}) {
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
    <article style={{ borderBottom: `1px solid ${GB}` }}>
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
          aria-label={post.following ? "Takibi bırak" : "Takip et"}
          onClick={() => onToggleFollow(post.id)}
          style={{
            padding: "5px 14px", borderRadius: 999, fontSize: 12, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit", flexShrink: 0, transition: "all 0.15s",
            background: post.following ? "#fff" : P, color: post.following ? P : "#fff",
            border: post.following ? `1.5px solid ${P}` : "none",
          }}>
          {post.following ? "Takiptesin" : "Takip Et"}
        </button>
        <button
          aria-label="Daha fazla seçenek"
          onClick={() => onShowMenu(post.id)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex" }}>
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

      {/* Actions */}
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
          <button aria-label={copyDone ? "Bağlantı kopyalandı" : "Paylaş"} onClick={handleShare}
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

      <div style={{ padding: "0 12px 4px" }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{post.likes} beğeni</span>
      </div>
      <div style={{ padding: "0 12px 4px", fontSize: 14, color: "#111827", lineHeight: 1.5 }}>
        <span style={{ fontWeight: 700 }}>{post.name.toLowerCase().replace(" ", "")}.poodle </span>
        {post.caption} <span style={{ color: P }}>{post.hashtags}</span>
      </div>

      {visibleComments.map((c, i) => (
        <div key={i} style={{ padding: "0 12px 4px", fontSize: 14, color: "#111827" }}>
          <span style={{ fontWeight: 700 }}>{c.author} </span>{c.text}
        </div>
      ))}

      {localComments.length > 1 && (
        <button onClick={() => setExpanded(e => !e)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "0 12px 6px", fontSize: 13, color: "#6B7280", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}>
          {expanded
            ? <><ChevronUp size={14} /> Yorumları gizle</>
            : <><ChevronDown size={14} /> {hiddenCount} yorumun tümünü gör</>
          }
        </button>
      )}

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
          <button onClick={submitComment}
            style={{ background: "none", border: "none", cursor: "pointer", color: P, fontSize: 13, fontWeight: 700, fontFamily: "inherit", flexShrink: 0, padding: "0 4px" }}>
            Gönder
          </button>
        )}
        <span style={{ fontSize: 11, color: "#9CA3AF", flexShrink: 0 }}>{post.timeAgo}</span>
      </div>
    </article>
  );
}

/* ══ Main page ══ */
export default function YPClubPage() {
  const [, navigate] = useLocation();
  const [activeSubTab, setActiveSubTab] = useState("kesfet");
  const [toast, setToast] = useState({ message: "", visible: false });
  const [posts, setPosts] = useState(
    INITIAL_POSTS.map(p => ({ ...p, liked: false, saved: false }))
  );
  /* Story viewer */
  const [storyIdx, setStoryIdx] = useState<number | null>(null);
  /* Action sheet — id of post whose menu is open */
  const [menuPostId, setMenuPostId] = useState<number | null>(null);

  useEffect(() => { document.title = "Club | YourPoodle"; }, []);

  const showToast = useCallback((msg: string) => {
    setToast({ message: msg, visible: true });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2500);
  }, []);

  const toggleLike        = (id: number) => setPosts(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked } : p));
  const toggleSave        = (id: number) => setPosts(prev => prev.map(p => p.id === id ? { ...p, saved: !p.saved } : p));
  const toggleFollow      = (id: number) => setPosts(prev => prev.map(p => p.id === id ? { ...p, following: !p.following } : p));

  const SUB_TABS = [
    { key: "kesfet",      label: "Keşfet"          },
    { key: "takip",       label: "Takip Ettiklerim" },
    { key: "yakinimdaki", label: "Yakınımdakiler"   },
  ];

  const visiblePosts = posts.filter(p => {
    if (activeSubTab === "takip")       return p.following;
    if (activeSubTab === "yakinimdaki") return p.nearby;
    return true; // keşfet → all
  });

  const menuPost = menuPostId !== null ? posts.find(p => p.id === menuPostId) : null;

  return (
    <YPLayout activeLink={`${BASE}/club`} constrain={false}>
      <style>{`button { font-family: inherit; }`}</style>
      <Toast message={toast.message} visible={toast.visible} />

      {/* Story viewer overlay */}
      {storyIdx !== null && (
        <StoryViewer
          stories={STORIES}
          startIndex={storyIdx}
          onClose={() => setStoryIdx(null)}
        />
      )}

      {/* Post action sheet */}
      {menuPost && (
        <PostActionSheet
          postName={menuPost.name}
          following={menuPost.following}
          onClose={() => setMenuPostId(null)}
          onToggleFollow={() => toggleFollow(menuPost.id)}
          onCopyLink={async () => {
            try { await navigator.clipboard.writeText(window.location.href); showToast("Bağlantı kopyalandı"); }
            catch {}
          }}
          onReport={() => showToast("Şikayetiniz alındı, teşekkürler")}
        />
      )}

      <div className="yp-feed-center">

        {/* ── In-feed header ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "flex-end",
          padding: "10px 16px", borderBottom: `1px solid ${GB}`,
          background: "#fff", gap: 4,
        }}>
          {/* Bildirimler */}
          <div style={{ position: "relative" }}>
            <button
              aria-label="Bildirimler"
              onClick={() => navigate(`${BASE}/bildirimler`)}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
              <Bell size={24} color="#374151" strokeWidth={1.75} />
            </button>
            <span style={{
              position: "absolute", top: 4, right: 4, background: "#EF4444", color: "#fff",
              fontSize: 9, fontWeight: 800, width: 16, height: 16, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff",
              pointerEvents: "none",
            }}>4</span>
          </div>

          {/* Mesajlar → real page */}
          <button
            aria-label="Mesajlar"
            onClick={() => navigate(`${BASE}/club/mesajlar`)}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
            <MessageCircle size={24} color="#374151" strokeWidth={1.75} />
          </button>

          {/* Profile */}
          <button
            aria-label="Benim Poodle'ım"
            onClick={() => navigate(`${BASE}/benim-poodleim`)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src="/images/yp-poodle-hero.png" alt="Profil" loading="lazy"
              style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", border: `2px solid ${P}` }} />
          </button>
        </div>

        {/* ── Sub-nav tabs ── */}
        <div style={{ display: "flex", alignItems: "center", padding: "0 12px", background: "#fff", borderBottom: `1px solid ${GB}`, overflowX: "auto", scrollbarWidth: "none" }}>
          {SUB_TABS.map(({ key, label }) => {
            const active = activeSubTab === key;
            return (
              <button key={key} onClick={() => setActiveSubTab(key)}
                style={{
                  padding: "10px 12px", fontSize: 13, fontWeight: active ? 700 : 500,
                  color: active ? "#111827" : "#6B7280",
                  borderBottom: "2px solid", borderBottomColor: active ? "#111827" : "transparent",
                  background: "none", border: "none", borderBottomWidth: 2, borderBottomStyle: "solid",
                  cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", flexShrink: 0,
                }}>
                {label}
              </button>
            );
          })}
        </div>

        {/* ── Stories row ── */}
        <div style={{ display: "flex", gap: 12, padding: "14px 12px", overflowX: "auto", borderBottom: `1px solid ${GB}`, scrollbarWidth: "none" }}>
          {STORIES.map((story, i) => (
            <div key={story.id}
              role="button"
              tabIndex={0}
              aria-label={story.isMe ? "Kendi hikayen" : `${story.genitive} hikayesi`}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, cursor: "pointer", flexShrink: 0, minWidth: 62 }}
              onClick={() => setStoryIdx(i)}
              onKeyDown={e => e.key === "Enter" && setStoryIdx(i)}>
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
              <p style={{ fontSize: 13, color: "#9CA3AF", maxWidth: 260, margin: "0 auto 24px", lineHeight: 1.6 }}>
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
              <PostCard
                key={post.id}
                post={post}
                onLike={() => toggleLike(post.id)}
                onSave={() => toggleSave(post.id)}
                onToggleFollow={toggleFollow}
                onShowMenu={setMenuPostId}
              />
            ))
          )}
        </div>

      </div>
    </YPLayout>
  );
}
