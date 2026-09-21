import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bell, Bookmark, Heart, MessageCircle, MoreHorizontal, Plus, Send,
  UserMinus, UserPlus, X, Copy, Flag, ImagePlus,
} from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { useCustomer } from "@/contexts/CustomerContext";
import { apiRequest } from "@/lib/queryClient";
import { IS_YP } from "@/lib/store";

const BASE = IS_YP ? "" : "/yourpoodle";
const P = "#5D3A1A";
const GB = "#E5E7EB";

type ClubPost = {
  id: number;
  content: string | null;
  image_urls: string[];
  hashtags: string[];
  like_count: number;
  comment_count: number;
  dog_id: number | null;
  dog_name: string | null;
  dog_slug: string | null;
  avatar_url: string | null;
  dog_city: string | null;
  owner_name: string | null;
  liked: boolean;
  saved: boolean;
  following: boolean;
  timeAgo: string;
  user_id: number;
};

type Comment = { id: number; content: string; author_name: string; created_at: string };
type Dog = { id: number; slug: string; name: string; avatar_url?: string; city?: string };
type Story = { id: number; name: string; slug: string; avatar_url: string | null; post_id: number; story_image: string | null };

function requireAuth(isLoggedIn: boolean, navigate: (p: string) => void, returnTo = `${BASE}/club`) {
  if (isLoggedIn) return true;
  navigate(`${BASE}/giris?returnTo=${encodeURIComponent(returnTo)}`);
  return false;
}

function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div style={{
      position: "fixed", bottom: 96, left: "50%", transform: "translateX(-50%)",
      zIndex: 1200, pointerEvents: "none", opacity: visible ? 1 : 0, transition: "opacity .25s",
    }}>
      <div style={{ background: "#3D2612", color: "#fff", padding: "11px 18px", borderRadius: 999, fontSize: 13, fontWeight: 600 }}>
        {message}
      </div>
    </div>
  );
}

function StoryViewer({ stories, startIndex, onClose }: { stories: Story[]; startIndex: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const animRef = useRef<number | null>(null);
  const startTs = useRef(0);
  const story = stories[idx];

  const goNext = useCallback(() => {
    if (idx < stories.length - 1) { setIdx(i => i + 1); setProgress(0); }
    else onClose();
  }, [idx, stories.length, onClose]);

  const goPrev = useCallback(() => {
    if (idx > 0) { setIdx(i => i - 1); setProgress(0); }
  }, [idx]);

  useEffect(() => {
    setProgress(0);
    startTs.current = performance.now();
    const tick = (now: number) => {
      const pct = Math.min((now - startTs.current) / 5000, 1);
      setProgress(pct);
      if (pct < 1) animRef.current = requestAnimationFrame(tick);
      else goNext();
    };
    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [idx, goNext]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", h);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", h); };
  }, [goNext, goPrev, onClose]);

  if (!story) return null;
  const img = story.story_image || story.avatar_url || "/images/yp-poodle-hero.png";

  return (
    <div role="dialog" aria-label={`${story.name} hikayesi`} style={{ position: "fixed", inset: 0, zIndex: 2000, background: "#000", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", gap: 3, padding: "12px 12px 8px", position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 }}>
        {stories.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 3, background: "rgba(255,255,255,.35)", overflow: "hidden" }}>
            <div style={{ height: "100%", background: "#fff", width: i < idx ? "100%" : i === idx ? `${progress * 100}%` : "0%" }} />
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", top: 32, left: 0, right: 0, zIndex: 10, display: "flex", alignItems: "center", padding: "0 12px", gap: 10 }}>
        <img src={story.avatar_url || "/images/yp-poodle-hero.png"} alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: "2px solid #fff" }} />
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 14, flex: 1 }}>{story.name}</span>
        <button type="button" aria-label="Kapat" onClick={onClose} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: 8 }}><X size={22} /></button>
      </div>
      <div style={{ flex: 1, position: "relative" }}>
        <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ position: "absolute", inset: 0, display: "flex", zIndex: 5 }}>
        <div role="button" tabIndex={0} aria-label="Önceki" onClick={goPrev} onKeyDown={e => e.key === "Enter" && goPrev()} style={{ flex: "0 0 30%" }} />
        <div role="button" tabIndex={0} aria-label="Sonraki" onClick={goNext} onKeyDown={e => e.key === "Enter" && goNext()} style={{ flex: 1 }} />
      </div>
    </div>
  );
}

function ImageCarousel({ images, onOpen }: { images: string[]; onOpen?: () => void }) {
  const [idx, setIdx] = useState(0);
  const startX = useRef<number | null>(null);
  if (!images.length) return null;
  const go = (n: number) => setIdx(Math.max(0, Math.min(images.length - 1, n)));
  return (
    <div
      role={onOpen ? "button" : undefined}
      onClick={onOpen}
      onTouchStart={(e) => { startX.current = e.touches[0]?.clientX ?? null; }}
      onTouchEnd={(e) => {
        if (startX.current == null) return;
        const dx = (e.changedTouches[0]?.clientX ?? startX.current) - startX.current;
        if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
        startX.current = null;
      }}
      style={{
        position: "relative", width: "100%", aspectRatio: "1 / 1",
        background: "#FAFAFA", overflow: "hidden", cursor: onOpen ? "pointer" : "default",
      }}
    >
      <img
        src={images[idx]}
        alt=""
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
      />
      {images.length > 1 && (
        <>
          <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,.55)", color: "#fff", fontSize: 11, fontWeight: 700, borderRadius: 999, padding: "3px 8px" }}>
            {idx + 1}/{images.length}
          </div>
          <div style={{ position: "absolute", bottom: 10, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 4 }}>
            {images.map((_, i) => (
              <button key={i} type="button" aria-label={`Foto ${i + 1}`} onClick={(e) => { e.stopPropagation(); go(i); }}
                style={{ width: i === idx ? 7 : 5, height: i === idx ? 7 : 5, borderRadius: "50%", border: "none", padding: 0, background: i === idx ? "#fff" : "rgba(255,255,255,.55)", cursor: "pointer" }} />
            ))}
          </div>
          {idx > 0 && (
            <button type="button" aria-label="Önceki" onClick={(e) => { e.stopPropagation(); go(idx - 1); }}
              style={{ position: "absolute", left: 6, top: "50%", transform: "translateY(-50%)", width: 28, height: 28, borderRadius: "50%", border: "none", background: "rgba(255,255,255,.85)", cursor: "pointer", fontWeight: 700 }}>‹</button>
          )}
          {idx < images.length - 1 && (
            <button type="button" aria-label="Sonraki" onClick={(e) => { e.stopPropagation(); go(idx + 1); }}
              style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", width: 28, height: 28, borderRadius: "50%", border: "none", background: "rgba(255,255,255,.85)", cursor: "pointer", fontWeight: 700 }}>›</button>
          )}
        </>
      )}
    </div>
  );
}

function ComposeSheet({
  dogs, onClose, onSubmit, onCreateDog, loading,
}: {
  dogs: Dog[];
  onClose: () => void;
  onSubmit: (payload: { dogSlug: string; content: string; imagesBase64?: string[] }) => void;
  onCreateDog: () => void;
  loading: boolean;
}) {
  const [dogSlug, setDogSlug] = useState(dogs[0]?.slug || "");
  const [content, setContent] = useState("");
  const [previews, setPreviews] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (dogs[0] && !dogSlug) setDogSlug(dogs[0].slug); }, [dogs, dogSlug]);

  const onFiles = (files?: FileList | null) => {
    if (!files?.length) return;
    const remain = Math.max(0, 6 - previews.length);
    Array.from(files).slice(0, remain).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setPreviews((p) => [...p, String(reader.result || "")].slice(0, 6));
      reader.readAsDataURL(file);
    });
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 1500 }} />
      <div style={{
        position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 1600, background: "#fff",
        borderRadius: "20px 20px 0 0", padding: "12px 16px calc(16px + env(safe-area-inset-bottom))",
        maxHeight: "88vh", overflowY: "auto",
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: GB, margin: "0 auto 14px" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontSize: 16, fontWeight: 700 }}>Yeni gönderi</span>
          <button type="button" onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
        </div>
        {dogs.length === 0 ? (
          <div>
            <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.5, marginBottom: 16 }}>
              Gönderi paylaşmak için önce bir Poodle profili oluşturmalısın.
            </p>
            <button type="button" onClick={onCreateDog}
              style={{ width: "100%", padding: "12px 0", borderRadius: 12, border: "none", background: P, color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              Profil Oluştur
            </button>
          </div>
        ) : (
          <>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#6B7280" }}>Poodle</label>
            <select value={dogSlug} onChange={e => setDogSlug(e.target.value)}
              style={{ width: "100%", marginTop: 6, marginBottom: 12, padding: "11px 12px", borderRadius: 12, border: `1px solid ${GB}`, fontSize: 14, fontFamily: "inherit" }}>
              {dogs.map(d => <option key={d.id} value={d.slug}>{d.name}</option>)}
            </select>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Ne paylaşmak istersin?"
              rows={4}
              style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${GB}`, borderRadius: 12, padding: 12, fontSize: 14, fontFamily: "inherit", resize: "vertical" }}
            />
            {previews.length > 0 && (
              <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                {previews.map((src, i) => (
                  <div key={i} style={{ position: "relative", aspectRatio: "1 / 1", borderRadius: 10, overflow: "hidden", background: "#FAFAFA" }}>
                    <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button type="button" onClick={() => setPreviews((p) => p.filter((_, j) => j !== i))}
                      style={{ position: "absolute", top: 4, right: 4, background: "#fff", border: "none", borderRadius: "50%", width: 24, height: 24, cursor: "pointer" }}>
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button type="button" onClick={() => fileRef.current?.click()} disabled={previews.length >= 6}
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "12px 0", borderRadius: 12, border: `1px solid ${GB}`, background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 13, fontFamily: "inherit", opacity: previews.length >= 6 ? 0.5 : 1 }}>
                <ImagePlus size={16} /> Fotoğraf{previews.length ? ` (${previews.length}/6)` : ""}
              </button>
              <button
                type="button"
                disabled={loading || (!content.trim() && previews.length === 0) || !dogSlug}
                onClick={() => onSubmit({ dogSlug, content: content.trim(), imagesBase64: previews.length ? previews : undefined })}
                style={{
                  flex: 1, padding: "12px 0", borderRadius: 12, border: "none",
                  background: loading || (!content.trim() && previews.length === 0) ? "#D1D5DB" : P,
                  color: "#fff", fontWeight: 700, fontSize: 13, cursor: loading ? "default" : "pointer", fontFamily: "inherit",
                }}>
                {loading ? "Paylaşılıyor..." : "Paylaş"}
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={e => { onFiles(e.target.files); e.target.value = ""; }} />
          </>
        )}
      </div>
    </>
  );
}

function PostCard({
  post, isLoggedIn, currentUserId, onRequireAuth, onLike, onSave, onFollow, onOpenMenu, onOpenPost, onOpenProfile, onToast,
}: {
  post: ClubPost;
  isLoggedIn: boolean;
  currentUserId?: number | null;
  onRequireAuth: () => void;
  onLike: () => void;
  onSave: () => void;
  onFollow: () => void;
  onOpenMenu: () => void;
  onOpenPost: () => void;
  onOpenProfile: () => void;
  onToast?: (msg: string) => void;
}) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const qc = useQueryClient();

  const loadComments = async () => {
    setShowComments(true);
    setLoadingComments(true);
    try {
      const r = await fetch(`/api/club/posts/${post.id}/comments`, { credentials: "include" });
      if (r.ok) setComments(await r.json());
    } finally {
      setLoadingComments(false);
    }
  };

  const submitComment = async () => {
    if (!isLoggedIn) { onRequireAuth(); return; }
    const t = comment.trim();
    if (!t) return;
    try {
      const res = await apiRequest("POST", `/api/club/posts/${post.id}/comments`, { content: t });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || "Yorum gönderilemedi");
      const created = await res.json();
      setShowComments(true);
      setComments(prev => [...prev, created]);
      setComment("");
      qc.setQueriesData<ClubPost[]>({ queryKey: ["club-feed"] }, (old) =>
        (old || []).map(p => p.id === post.id ? { ...p, comment_count: (p.comment_count || 0) + 1 } : p),
      );
      onToast?.("Yorum eklendi");
    } catch (e: any) {
      onToast?.(e?.message || "Yorum gönderilemedi");
    }
  };

  const share = async () => {
    const url = `${window.location.origin}${BASE}/club/gonderi/${post.id}`;
    if (navigator.share) {
      try { await navigator.share({ title: post.dog_name || "YourPoodle", text: post.content || "", url }); return; }
      catch (e: any) { if (e?.name === "AbortError") return; }
    }
    try {
      await navigator.clipboard.writeText(url);
      onToast?.("Link kopyalandı");
    } catch {
      onToast?.("Paylaşım desteklenmiyor");
    }
  };

  const images = Array.isArray(post.image_urls) ? post.image_urls : [];
  const tags = Array.isArray(post.hashtags) ? post.hashtags : [];
  const isOwn = !!currentUserId && post.user_id === currentUserId;

  return (
    <article style={{ borderBottom: `1px solid ${GB}`, background: "#fff" }}>
      <div style={{ display: "flex", alignItems: "center", padding: "10px 12px", gap: 10 }}>
        <button type="button" onClick={onOpenProfile} style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}>
          <img src={post.avatar_url || "/images/yp-poodle-hero.png"} alt="" style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", border: `2px solid ${P}` }} />
        </button>
        <button type="button" onClick={onOpenProfile} style={{ flex: 1, minWidth: 0, background: "none", border: "none", textAlign: "left", cursor: "pointer", padding: 0, fontFamily: "inherit" }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{post.dog_name || post.owner_name || "Poodle"}</div>
          <div style={{ fontSize: 12, color: "#6B7280" }}>
            {post.dog_slug ? `@${post.dog_slug}` : ""}{post.dog_city ? ` · ${post.dog_city}` : ""}
          </div>
        </button>
        {post.dog_slug && !isOwn && (
          <button type="button" onClick={() => isLoggedIn ? onFollow() : onRequireAuth()}
            style={{
              padding: "5px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              background: post.following ? "#fff" : P, color: post.following ? P : "#fff",
              border: post.following ? `1.5px solid ${P}` : "none",
            }}>
            {post.following ? "Takiptesin" : "Takip Et"}
          </button>
        )}
        {isOwn && (
          <span style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", padding: "4px 8px" }}>Senin</span>
        )}
        <button type="button" aria-label="Menü" onClick={onOpenMenu} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <MoreHorizontal size={20} color="#6B7280" />
        </button>
      </div>

      {images.length > 0 && <ImageCarousel images={images} onOpen={onOpenPost} />}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px 6px" }}>
        <div style={{ display: "flex", gap: 14 }}>
          <button type="button" aria-label="Beğen" onClick={() => isLoggedIn ? onLike() : onRequireAuth()} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <Heart size={24} color={post.liked ? "#EF4444" : "#111827"} fill={post.liked ? "#EF4444" : "none"} strokeWidth={1.75} />
          </button>
          <button type="button" aria-label="Yorum" onClick={loadComments} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <MessageCircle size={24} color="#111827" strokeWidth={1.75} />
          </button>
          <button type="button" aria-label="Paylaş" onClick={share} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <Send size={24} color="#111827" strokeWidth={1.75} />
          </button>
        </div>
        <button type="button" aria-label="Kaydet" onClick={() => isLoggedIn ? onSave() : onRequireAuth()} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <Bookmark size={24} color="#111827" fill={post.saved ? "#111827" : "none"} strokeWidth={1.75} />
        </button>
      </div>

      <div style={{ padding: "0 12px 4px", fontSize: 14, fontWeight: 700 }}>{post.like_count || 0} beğeni</div>
      {(post.content || tags.length > 0) && (
        <div style={{ padding: "0 12px 6px", fontSize: 14, color: "#111827", lineHeight: 1.5 }}>
          <button type="button" onClick={onOpenProfile} style={{ background: "none", border: "none", fontWeight: 700, cursor: "pointer", padding: 0, marginRight: 4, fontFamily: "inherit", fontSize: 14 }}>
            {post.dog_name || "poodle"}
          </button>
          {post.content
            ? String(post.content).split(/(#[\wçğıöşüÇĞİÖŞÜ]+)/gu).map((part, i) =>
                part.startsWith("#")
                  ? <span key={i} style={{ color: P, fontWeight: 600 }}>{part}</span>
                  : <span key={i}>{part}</span>
              )
            : tags.map(t => <span key={t} style={{ color: P, fontWeight: 600 }}>#{String(t).replace(/^#/, "")} </span>)}
        </div>
      )}
      {post.comment_count > 0 && !showComments && (
        <button type="button" onClick={loadComments} style={{ background: "none", border: "none", color: "#6B7280", fontSize: 13, padding: "0 12px 8px", cursor: "pointer", fontFamily: "inherit" }}>
          {post.comment_count} yorumun tümünü gör
        </button>
      )}
      {showComments && (
        <div style={{ padding: "0 12px 8px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Yorumlar ({comments.length || post.comment_count || 0})</div>
          {loadingComments && <div style={{ fontSize: 12, color: "#9CA3AF" }}>Yorumlar yükleniyor...</div>}
          {!loadingComments && comments.length === 0 && (
            <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 6 }}>Henüz yorum yok</div>
          )}
          {comments.map(c => (
            <div key={c.id} style={{ fontSize: 13, marginBottom: 4, color: "#111827" }}>
              <strong>{c.author_name || "Üye"}</strong> {c.content}
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px 10px", borderTop: `1px solid ${GB}` }}>
        <input
          value={comment}
          onChange={e => setComment(e.target.value.slice(0, 500))}
          onFocus={() => { if (!isLoggedIn) onRequireAuth(); else if (!showComments) loadComments(); }}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); submitComment(); } }}
          placeholder="Yorum yaz..."
          style={{ flex: 1, border: "1px solid #E5E7EB", borderRadius: 12, padding: "8px 10px", outline: "none", fontSize: 13, fontFamily: "inherit", background: "#fff" }}
        />
        <button
          type="button"
          aria-label="Yorum gönder"
          onClick={submitComment}
          disabled={!comment.trim()}
          style={{
            width: 36, height: 36, borderRadius: 10, border: "none", background: P, color: "#fff",
            cursor: comment.trim() ? "pointer" : "not-allowed", opacity: comment.trim() ? 1 : 0.5,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}
        >
          <Send size={14} />
        </button>
      </div>
    </article>
  );
}

export default function YPClubPage() {
  const [, navigate] = useLocation();
  const { isLoggedIn, customer } = useCustomer();
  const qc = useQueryClient();
  const [tab, setTab] = useState<"kesfet" | "takip" | "yakinimdaki">("kesfet");
  const [toast, setToast] = useState({ message: "", visible: false });
  const [menuPost, setMenuPost] = useState<ClubPost | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [storyIdx, setStoryIdx] = useState<number | null>(null);
  const [offset, setOffset] = useState(0);

  const showToast = useCallback((msg: string) => {
    setToast({ message: msg, visible: true });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2200);
  }, []);

  const city = customer?.city || undefined;

  const feedKey = useMemo(() => ["club-feed", tab, city || "", offset, isLoggedIn] as const, [tab, city, offset, isLoggedIn]);

  const { data: pagePosts = [], isLoading, isFetching, refetch } = useQuery<ClubPost[]>({
    queryKey: feedKey,
    queryFn: async () => {
      if (tab === "takip") {
        if (!isLoggedIn) return [];
        const r = await fetch(`/api/club/feed?limit=30&offset=${offset}`, { credentials: "include" });
        if (r.status === 401) return [];
        if (!r.ok) throw new Error("Feed yüklenemedi");
        return r.json();
      }
      const qs = new URLSearchParams({ limit: "30", offset: String(offset) });
      if (tab === "yakinimdaki" && city) qs.set("city", city);
      const r = await fetch(`/api/club/public-feed?${qs}`, { credentials: "include" });
      if (!r.ok) throw new Error("Feed yüklenemedi");
      return r.json();
    },
  });

  const [posts, setPosts] = useState<ClubPost[]>([]);
  useEffect(() => {
    if (offset === 0) setPosts(pagePosts);
    else {
      setPosts(prev => {
        const seen = new Set(prev.map(p => p.id));
        return [...prev, ...pagePosts.filter(p => !seen.has(p.id))];
      });
    }
  }, [pagePosts, offset]);

  const { data: stories = [] } = useQuery<Story[]>({
    queryKey: ["/api/club/stories", isLoggedIn],
    enabled: isLoggedIn,
    queryFn: async () => {
      const r = await fetch("/api/club/stories", { credentials: "include" });
      if (!r.ok) return [];
      return r.json();
    },
  });

  const { data: unread } = useQuery<{ count: number }>({
    queryKey: ["/api/notifications/unread-count"],
    enabled: isLoggedIn,
    queryFn: async () => {
      const r = await fetch("/api/notifications/unread-count", { credentials: "include" });
      if (!r.ok) return { count: 0 };
      return r.json();
    },
    refetchInterval: 60_000,
  });

  const { data: myDogs = [] } = useQuery<Dog[]>({
    queryKey: ["/api/my/dogs"],
    enabled: isLoggedIn && composeOpen,
    queryFn: async () => {
      const r = await fetch("/api/my/dogs", { credentials: "include" });
      if (!r.ok) return [];
      return r.json();
    },
  });

  const { data: explore } = useQuery<{ newDogs: Dog[] }>({
    queryKey: ["/api/club/explore-lite"],
    queryFn: async () => {
      const r = await fetch("/api/club/explore", { credentials: "include" });
      if (!r.ok) return { newDogs: [] };
      return r.json();
    },
  });

  useEffect(() => { document.title = "Club | YourPoodle"; }, []);
  useEffect(() => { setOffset(0); }, [tab]);

  const patchPost = (id: number, patch: Partial<ClubPost>) => {
    setPosts(old => old.map(p => p.id === id ? { ...p, ...patch } : p));
    qc.setQueryData<ClubPost[]>(feedKey, (old) => (old || []).map(p => p.id === id ? { ...p, ...patch } : p));
  };

  const likeMut = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("POST", `/api/club/posts/${id}/like`, {});
      if (!res.ok) throw new Error("like");
      return res.json();
    },
    onMutate: async (id) => {
      const cur = posts.find(p => p.id === id) || (qc.getQueryData<ClubPost[]>(feedKey) || []).find(p => p.id === id);
      if (!cur) return;
      patchPost(id, { liked: !cur.liked, like_count: Math.max(0, (cur.like_count || 0) + (cur.liked ? -1 : 1)) });
    },
    onError: () => { refetch(); showToast("Beğeni kaydedilemedi"); },
  });

  const saveMut = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("POST", `/api/club/posts/${id}/save`, {});
      if (!res.ok) throw new Error("save");
      return res.json();
    },
    onMutate: async (id) => {
      const cur = posts.find(p => p.id === id) || (qc.getQueryData<ClubPost[]>(feedKey) || []).find(p => p.id === id);
      if (!cur) return;
      patchPost(id, { saved: !cur.saved });
    },
    onSuccess: async (res) => {
      const data = await (res instanceof Response ? res.json() : Promise.resolve(res));
      showToast(data.saved ? "Kaydedildi" : "Kayıttan çıkarıldı");
    },
    onError: () => { refetch(); showToast("Kaydetme başarısız"); },
  });

  const followMut = useMutation({
    mutationFn: async ({ slug, following }: { slug: string; following: boolean }) => {
      if (following) await apiRequest("DELETE", `/api/dogs/${slug}/follow`, {});
      else await apiRequest("POST", `/api/dogs/${slug}/follow`, {});
    },
    onSuccess: (_, vars) => {
      setPosts(old => (old || []).map(p => p.dog_slug === vars.slug ? { ...p, following: !vars.following } : p));
      qc.setQueryData<ClubPost[]>(feedKey, (old) => (old || []).map(p => p.dog_slug === vars.slug ? { ...p, following: !vars.following } : p));
      showToast(vars.following ? "Takip bırakıldı" : "Takip edildi");
      qc.invalidateQueries({ queryKey: ["/api/club/explore-lite"] });
    },
    onError: () => showToast("Takip işlemi başarısız"),
  });

  const createMut = useMutation({
    mutationFn: (body: { dogSlug: string; content: string; imagesBase64?: string[] }) =>
      apiRequest("POST", "/api/club/posts", body),
    onSuccess: () => {
      setComposeOpen(false);
      showToast("Gönderi paylaşıldı");
      setTab("kesfet");
      qc.invalidateQueries({ queryKey: ["club-feed"] });
    },
    onError: (e: any) => showToast(e?.message || "Paylaşım başarısız"),
  });

  const goLogin = () => requireAuth(false, navigate);

  const nearbyEmpty = tab === "yakinimdaki" && !city;
  const visiblePosts = nearbyEmpty ? [] : posts;

  return (
    <YPLayout activeLink={`${BASE}/club`} constrain={false} showMobileFooter>
      <Toast message={toast.message} visible={toast.visible} />

      {storyIdx !== null && stories.length > 0 && (
        <StoryViewer stories={stories} startIndex={storyIdx} onClose={() => setStoryIdx(null)} />
      )}

      {composeOpen && (
        <ComposeSheet
          dogs={myDogs}
          loading={createMut.isPending}
          onClose={() => setComposeOpen(false)}
          onCreateDog={() => {
            setComposeOpen(false);
            navigate(`${BASE}/p/olustur`);
          }}
          onSubmit={(payload) => {
            if (!payload.dogSlug) {
              navigate(`${BASE}/p/olustur`);
              return;
            }
            createMut.mutate(payload);
          }}
        />
      )}

      {menuPost && (
        <>
          <div onClick={() => setMenuPost(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 1500 }} />
          <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 1600, background: "#fff", borderRadius: "20px 20px 0 0", padding: "12px 0 calc(16px + env(safe-area-inset-bottom))" }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: GB, margin: "0 auto 12px" }} />
            {[
              !menuPost.user_id || menuPost.user_id !== customer?.id
                ? {
                    Icon: menuPost.following ? UserMinus : UserPlus,
                    label: menuPost.following ? "Takibi Bırak" : "Takip Et",
                    color: menuPost.following ? "#EF4444" : "#111827",
                    action: () => {
                      if (!menuPost.dog_slug) return;
                      if (!requireAuth(isLoggedIn, navigate)) return;
                      followMut.mutate({ slug: menuPost.dog_slug, following: menuPost.following });
                      setMenuPost(null);
                    },
                  }
                : null,
              {
                Icon: Copy,
                label: "Bağlantıyı Kopyala",
                color: "#111827",
                action: async () => {
                  try {
                    await navigator.clipboard.writeText(`${window.location.origin}${BASE}/club/gonderi/${menuPost.id}`);
                    showToast("Bağlantı kopyalandı");
                  } catch {}
                  setMenuPost(null);
                },
              },
              {
                Icon: Flag,
                label: "Şikayet Et",
                color: "#EF4444",
                action: () => { showToast("Şikayetiniz alındı"); setMenuPost(null); },
              },
            ].filter(Boolean).map((item: any) => (
              <button key={item.label} type="button" onClick={item.action}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", background: "none", border: "none", cursor: "pointer", fontSize: 15, fontWeight: 600, color: item.color, fontFamily: "inherit" }}>
                <item.Icon size={18} /> {item.label}
              </button>
            ))}
            <button type="button" onClick={() => setMenuPost(null)}
              style={{ width: "100%", padding: "14px 20px", border: "none", borderTop: "8px solid #F3F4F6", background: "none", fontWeight: 700, color: P, cursor: "pointer", fontFamily: "inherit" }}>
              İptal
            </button>
          </div>
        </>
      )}

      <div className="yp-feed-center" style={{ background: "#FAF8F4", minHeight: "70vh" }}>
        {/* Slim actions */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "#fff", borderBottom: `1px solid ${GB}` }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>Club</span>
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <button type="button" aria-label="Bildirimler" onClick={() => navigate(isLoggedIn ? `${BASE}/bildirimler` : `${BASE}/giris?returnTo=${BASE}/bildirimler`)}
              style={{ position: "relative", width: 44, height: 44, background: "none", border: "none", cursor: "pointer" }}>
              <Bell size={22} color="#374151" strokeWidth={1.75} />
              {!!unread?.count && (
                <span style={{ position: "absolute", top: 6, right: 6, minWidth: 16, height: 16, borderRadius: 999, background: "#EF4444", color: "#fff", fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>
                  {unread.count > 9 ? "9+" : unread.count}
                </span>
              )}
            </button>
            <button type="button" aria-label="Mesajlar" onClick={() => navigate(`${BASE}/club/mesajlar`)}
              style={{ width: 44, height: 44, background: "none", border: "none", cursor: "pointer" }}>
              <MessageCircle size={22} color="#374151" strokeWidth={1.75} />
            </button>
            <button type="button" aria-label="Profil" onClick={() => navigate(`${BASE}/benim-poodleim`)}
              style={{ width: 44, height: 44, background: "none", border: "none", cursor: "pointer" }}>
              <img src="/images/yp-poodle-hero.png" alt="" style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", border: `2px solid ${P}` }} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", background: "#fff", borderBottom: `1px solid ${GB}` }}>
          {([
            { key: "kesfet", label: "Keşfet" },
            { key: "takip", label: "Takip" },
            { key: "yakinimdaki", label: "Yakınımda" },
          ] as const).map(t => (
            <button key={t.key} type="button" onClick={() => setTab(t.key)}
              style={{
                flex: 1, padding: "12px 8px", background: "none", border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: tab === t.key ? 700 : 500,
                color: tab === t.key ? "#111827" : "#6B7280",
                borderBottom: tab === t.key ? "2px solid #111827" : "2px solid transparent",
                fontFamily: "inherit",
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Real stories only when present */}
        {isLoggedIn && stories.length > 0 && (
          <div style={{ display: "flex", gap: 12, padding: "12px", overflowX: "auto", background: "#fff", borderBottom: `1px solid ${GB}` }}>
            {stories.map((s, i) => (
              <button key={s.id} type="button" onClick={() => setStoryIdx(i)}
                style={{ background: "none", border: "none", cursor: "pointer", flexShrink: 0, width: 64, padding: 0, fontFamily: "inherit" }}>
                <div style={{ width: 58, height: 58, borderRadius: "50%", padding: 2, background: `linear-gradient(135deg,${P},#A67C52)`, margin: "0 auto" }}>
                  <img src={s.avatar_url || s.story_image || "/images/yp-poodle-hero.png"} alt="" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "2px solid #fff" }} />
                </div>
                <div style={{ fontSize: 11, marginTop: 4, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
              </button>
            ))}
          </div>
        )}

        {/* Explore people strip */}
        {tab === "kesfet" && (explore?.newDogs?.length || 0) > 0 && (
          <div style={{ padding: "12px 12px 4px", background: "#fff", borderBottom: `1px solid ${GB}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>Yeni Poodle'lar</span>
              <button type="button" onClick={() => navigate(`${BASE}/club/kesfet`)}
                style={{ background: "none", border: "none", color: P, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                Tümü
              </button>
            </div>
            <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8 }}>
              {explore!.newDogs.slice(0, 8).map(d => (
                <button key={d.id} type="button" onClick={() => navigate(`${BASE}/p/${d.slug}`)}
                  style={{ width: 86, flexShrink: 0, background: "#FAF8F4", border: `1px solid ${GB}`, borderRadius: 12, padding: 8, cursor: "pointer", fontFamily: "inherit" }}>
                  <img src={d.avatar_url || "/images/yp-poodle-hero.png"} alt="" style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", display: "block", margin: "0 auto 6px" }} />
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Feed */}
        <div style={{ paddingBottom: 110 }}>
          {(isLoading || isFetching) && posts.length === 0 && (
            <div style={{ padding: 48, textAlign: "center", color: "#9CA3AF", fontSize: 14 }}>Yükleniyor...</div>
          )}

          {tab === "takip" && !isLoggedIn && (
            <div style={{ padding: "48px 24px", textAlign: "center" }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 8 }}>Takip akışı için giriş yap</h2>
              <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 20 }}>Takip ettiğin Poodle'ların gönderilerini burada görürsün.</p>
              <button type="button" onClick={goLogin} style={{ background: P, color: "#fff", border: "none", borderRadius: 12, padding: "11px 20px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                Giriş Yap
              </button>
            </div>
          )}

          {nearbyEmpty && (
            <div style={{ padding: "48px 24px", textAlign: "center" }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 8 }}>Şehir bilgisi yok</h2>
              <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 20 }}>Yakındaki paylaşımlar için profiline şehir ekle.</p>
              <button type="button" onClick={() => navigate("/hesabim/ayarlar")} style={{ background: P, color: "#fff", border: "none", borderRadius: 12, padding: "11px 20px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                Ayarlara Git
              </button>
            </div>
          )}

          {!isLoading && visiblePosts.length === 0 && !(tab === "takip" && !isLoggedIn) && !nearbyEmpty && (
            <div style={{ padding: "48px 24px", textAlign: "center" }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 8 }}>
                {tab === "takip" ? "Takip akışı boş" : tab === "yakinimdaki" ? "Yakında paylaşım yok" : "Henüz gönderi yok"}
              </h2>
              <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 20, lineHeight: 1.5 }}>
                {tab === "takip"
                  ? "Keşfet’ten Poodle takip et veya ilk gönderini paylaş."
                  : "İlk Club gönderisini sen paylaş."}
              </p>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                <button type="button" onClick={() => setTab("kesfet")} style={{ border: `1.5px solid ${P}`, background: "#fff", color: P, borderRadius: 12, padding: "10px 16px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  Keşfet
                </button>
                <button type="button" onClick={() => {
                  if (!requireAuth(isLoggedIn, navigate)) return;
                  setComposeOpen(true);
                }} style={{ background: P, color: "#fff", border: "none", borderRadius: 12, padding: "10px 16px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  Gönderi Paylaş
                </button>
              </div>
            </div>
          )}

          {visiblePosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              isLoggedIn={isLoggedIn}
              currentUserId={customer?.id}
              onRequireAuth={goLogin}
              onLike={() => likeMut.mutate(post.id)}
              onSave={() => saveMut.mutate(post.id)}
              onFollow={() => post.dog_slug && followMut.mutate({ slug: post.dog_slug, following: post.following })}
              onOpenMenu={() => setMenuPost(post)}
              onOpenPost={() => navigate(`${BASE}/club/gonderi/${post.id}`)}
              onOpenProfile={() => post.dog_slug && navigate(`${BASE}/p/${post.dog_slug}`)}
              onToast={showToast}
            />
          ))}

          {visiblePosts.length > 0 && pagePosts.length >= 30 && (
            <div style={{ padding: 16, textAlign: "center" }}>
              <button type="button" disabled={isFetching} onClick={() => setOffset(o => o + 30)}
                style={{ background: "#fff", border: `1px solid ${GB}`, borderRadius: 12, padding: "10px 18px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", color: P }}>
                {isFetching ? "Yükleniyor..." : "Daha fazla yükle"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Compose FAB */}
      <button
        type="button"
        aria-label="Yeni gönderi"
        onClick={() => {
          if (!requireAuth(isLoggedIn, navigate)) return;
          setComposeOpen(true);
        }}
        style={{
          position: "fixed", right: 18, bottom: "calc(76px + env(safe-area-inset-bottom))",
          width: 56, height: 56, borderRadius: "50%", background: P, color: "#fff",
          border: "none", cursor: "pointer", zIndex: 220,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 24px rgba(93,58,26,.35)",
        }}
      >
        <Plus size={26} strokeWidth={2.4} />
      </button>
    </YPLayout>
  );
}
