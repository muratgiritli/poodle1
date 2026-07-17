// YourPoodle Club — Instagram tarzı sosyal akış
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Heart, MessageCircle, Share2, Plus, Camera, X, Search,
  MapPin, Calendar, ChevronRight,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { useCustomer } from "@/contexts/CustomerContext";

/* ─── Types ─────────────────────────────────────────────── */
interface ApiPost {
  id: number; dog_id?: number; user_id: number; content?: string;
  image_urls?: string[]; hashtags?: string[]; like_count: number;
  comment_count: number; visibility: string; created_at: string;
  timeAgo?: string; dog_name?: string; dog_slug?: string; avatar_url?: string;
  owner_name?: string; liked?: boolean;
}

/* ─── Constants ─────────────────────────────────────────── */
const TABS = [
  { id: "akis",     label: "Ana Sayfa" },
  { id: "poodlem",  label: "Poodlem" },
  { id: "etkinlik", label: "Etkinlik" },
];

const FEED_CATS = [
  { id: "tumu", label: "Tümü" },
  { id: "tiras", label: "Tıraş & Bakım" },
  { id: "mama", label: "Mama" },
  { id: "saglik", label: "Sağlık" },
  { id: "egitim", label: "Eğitim" },
  { id: "oyun", label: "Oyun" },
];

const FALLBACK_EVENTS = [
  { id:1, day:"26", month:"TEM", time:"10:00", title:"Poodle Buluşması — Kadıköy", location:"İstanbul", venue:"Moda Sahili", desc:"İstanbul poodle severler Kadıköy Moda sahilinde buluşuyor.", color:"#7C3AED", type:"Yüz yüze", free:true, participants:23, featured:true },
  { id:2, day:"09", month:"AĞU", time:"19:30", title:"Online: Tıraş Teknikleri Webinarı", location:"Online", venue:"Zoom", desc:"Uzman groomer Selin Demir ile ev ortamında tıraş teknikleri.", color:"#A855F7", type:"Online", free:true, participants:41, featured:false },
  { id:3, day:"23", month:"AĞU", time:"09:00", title:"Poodle Agility Yarışması", location:"Ankara", venue:"Atatürk Orman Çiftliği", desc:"Tüm yaş grupları için ayrı kategoriler.", color:"#6D28D9", type:"Yüz yüze", free:false, participants:17, featured:false },
  { id:4, day:"06", month:"EYL", time:"14:00", title:"Poodle Fotoğraf Günü", location:"İzmir", venue:"Kordon", desc:"Profesyonel fotoğrafçı eşliğinde anılar.", color:"#7C3AED", type:"Yüz yüze", free:false, participants:12, featured:false },
];

/* ─── Hashtag renderer ──────────────────────────────────── */
function renderText(text: string, onTag?: (tag: string) => void) {
  const parts = text.split(/(#[\p{L}\p{N}_]+)/gu);
  return parts.map((part, i) => {
    if (part.startsWith("#")) {
      return (
        <button key={i} onClick={() => onTag?.(part.slice(1).toLowerCase())}
          style={{ background: "none", border: "none", color: "#7C3AED", fontWeight: 700, cursor: "pointer", padding: 0, fontSize: "inherit", fontFamily: "inherit" }}>
          {part}
        </button>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

/* ─── DogAvatar ─────────────────────────────────────────── */
function DogAvatar({ avatarUrl, name, size = 40 }: { avatarUrl?: string; name?: string; size?: number }) {
  const initials = (name ?? "?").slice(0, 2).toUpperCase();
  if (avatarUrl) {
    return (
      <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "2px solid #EDE8FF" }}>
        <img src={avatarUrl} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    );
  }
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#A855F7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.35, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
      {initials}
    </div>
  );
}

/* ─── Comment section ───────────────────────────────────── */
function CommentSection({ postId, isLoggedIn, onJoin }: { postId: number; isLoggedIn: boolean; onJoin: () => void }) {
  const qc = useQueryClient();
  const [text, setText] = useState("");
  const { data: comments = [] } = useQuery<any[]>({
    queryKey: [`/api/club/posts/${postId}/comments`],
    queryFn: async () => { const r = await fetch(`/api/club/posts/${postId}/comments`); return r.json(); },
  });
  const addComment = useMutation({
    mutationFn: () => apiRequest("POST", `/api/club/posts/${postId}/comments`, { content: text }),
    onSuccess: () => { setText(""); qc.invalidateQueries({ queryKey: [`/api/club/posts/${postId}/comments`] }); qc.invalidateQueries({ queryKey: ["/api/club/public-feed"] }); },
  });
  return (
    <div style={{ padding: "10px 16px 14px", borderTop: "1px solid #F5F5F5", background: "#FAFAFA" }}>
      {comments.map((c: any) => (
        <div key={c.id} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <DogAvatar name={c.author_name} size={26} />
          <div style={{ background: "#fff", borderRadius: 12, padding: "6px 12px", flex: 1, border: "1px solid #E5E7EB" }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: "#7C3AED" }}>{c.author_name} </span>
            <span style={{ fontSize: 12.5, color: "#374151" }}>{c.content}</span>
          </div>
        </div>
      ))}
      {isLoggedIn ? (
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 6 }}>
          <input value={text} onChange={e => setText(e.target.value)} placeholder="Yorum yaz..."
            onKeyDown={e => { if (e.key === "Enter" && text.trim()) addComment.mutate(); }}
            style={{ flex: 1, height: 34, borderRadius: 10, border: "1.5px solid #E5E7EB", padding: "0 12px", fontSize: 13, outline: "none", background: "#fff" }} />
          <button onClick={() => text.trim() && addComment.mutate()}
            disabled={!text.trim() || addComment.isPending}
            style={{ padding: "0 12px", height: 34, borderRadius: 10, border: "none", background: "#7C3AED", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            Gönder
          </button>
        </div>
      ) : (
        <button onClick={onJoin} style={{ width: "100%", padding: "8px", borderRadius: 10, border: "1.5px solid #EDE8FF", background: "#fff", color: "#7C3AED", fontSize: 12, fontWeight: 700, cursor: "pointer", marginTop: 4 }}>
          Yorum yapmak için giriş yap →
        </button>
      )}
    </div>
  );
}

/* ─── Post Card ─────────────────────────────────────────── */
function PostCard({ post, isLoggedIn, onJoin, onLike }: { post: ApiPost; isLoggedIn: boolean; onJoin: () => void; onLike: (id: number) => void }) {
  const [, navigate] = useLocation();
  const [showComments, setShowComments] = useState(false);
  const imgs: string[] = Array.isArray(post.image_urls) ? post.image_urls : (typeof post.image_urls === "string" ? JSON.parse(post.image_urls || "[]") : []);
  const slug = post.dog_slug;

  return (
    <article style={{ background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB", marginBottom: 14, overflow: "hidden" }}>
      {/* Author row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px 8px" }}>
        <div onClick={() => slug && navigate(`/yourpoodle/p/${slug}`)} style={{ cursor: slug ? "pointer" : "default" }}>
          <DogAvatar avatarUrl={post.avatar_url} name={post.dog_name || post.owner_name} size={40} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {slug ? (
              <button onClick={() => navigate(`/yourpoodle/p/${slug}`)}
                style={{ fontSize: 13.5, fontWeight: 800, color: "#1A1A1A", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}>
                {post.dog_name || post.owner_name}
              </button>
            ) : (
              <span style={{ fontSize: 13.5, fontWeight: 800, color: "#1A1A1A" }}>{post.owner_name}</span>
            )}
          </div>
          <span style={{ fontSize: 11, color: "#9CA3AF" }}>{post.timeAgo}</span>
        </div>
      </div>

      {/* Content */}
      {post.content && (
        <p style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.7, padding: "0 14px 10px", margin: 0 }}>
          {renderText(post.content)}
        </p>
      )}

      {/* Image(s) */}
      {imgs.length > 0 && (
        <div style={{ width: "100%", aspectRatio: imgs.length > 1 ? "4/3" : "1", overflow: "hidden", background: "#F5F0FF" }}>
          {imgs[0].startsWith("data:") || imgs[0].startsWith("http") ? (
            <img src={imgs[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : null}
          {imgs.length > 1 && (
            <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)", color: "#fff", borderRadius: 8, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>
              +{imgs.length - 1}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", borderTop: "1px solid #F3F4F6", padding: "2px 6px" }}>
        <button onClick={() => { if (!isLoggedIn) { onJoin(); return; } onLike(post.id); }}
          style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 12px", borderRadius: 10, border: "none", background: "none", cursor: "pointer", flex: 1, justifyContent: "center" }}>
          <Heart size={17} strokeWidth={2} color={post.liked ? "#E75480" : "#9CA3AF"} fill={post.liked ? "#E75480" : "none"} />
          <span style={{ fontSize: 12, fontWeight: 700, color: post.liked ? "#E75480" : "#9CA3AF" }}>{post.like_count}</span>
        </button>
        <button onClick={() => setShowComments(s => !s)}
          style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 12px", borderRadius: 10, border: "none", background: "none", cursor: "pointer", flex: 1, justifyContent: "center" }}>
          <MessageCircle size={17} strokeWidth={2} color={showComments ? "#7C3AED" : "#9CA3AF"} />
          <span style={{ fontSize: 12, fontWeight: 700, color: showComments ? "#7C3AED" : "#9CA3AF" }}>{post.comment_count}</span>
        </button>
        <button onClick={() => {
          const url = `${window.location.origin}/yourpoodle/club`;
          if (navigator.share) { navigator.share({ title: "YourPoodle Club", url }).catch(() => {}); }
          else { navigator.clipboard?.writeText(url).catch(() => {}); }
        }} style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 12px", borderRadius: 10, border: "none", background: "none", cursor: "pointer", flex: 1, justifyContent: "center" }}>
          <Share2 size={17} strokeWidth={2} color="#9CA3AF" />
          <span style={{ fontSize: 12, fontWeight: 700, color: "#9CA3AF" }}>Paylaş</span>
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <CommentSection postId={post.id} isLoggedIn={isLoggedIn} onJoin={onJoin} />
      )}
    </article>
  );
}

/* ─── New Post Modal ────────────────────────────────────── */
function NewPostModal({ onClose, myDogs }: { onClose: () => void; myDogs: any[] }) {
  const qc = useQueryClient();
  const [text, setText] = useState("");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [dogSlug, setDogSlug] = useState(myDogs[0]?.slug ?? "");
  const [visibility, setVisibility] = useState<"public" | "followers">("public");
  const fileRef = useRef<HTMLInputElement>(null);
  const [, navigate] = useLocation();

  const canPost = text.trim().length > 0 || imageBase64 !== null;

  const postMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/club/posts", { dogSlug: dogSlug || undefined, content: text.trim() || undefined, imageBase64: imageBase64 || undefined, visibility }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/club/public-feed"] }); onClose(); },
  });

  const onFile = (f: File) => {
    if (f.size > 5 * 1024 * 1024) { alert("Maksimum 5MB"); return; }
    const reader = new FileReader();
    reader.onload = ev => setImageBase64(ev.target?.result as string);
    reader.readAsDataURL(f);
  };

  if (myDogs.length === 0) {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 400, background: "rgba(0,0,0,0.5)", display: "flex", flexDirection: "column" }}
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
        <div style={{ marginTop: "auto", background: "#fff", borderRadius: "22px 22px 0 0", padding: "28px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🐩</div>
          <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 8 }}>Önce köpek profili oluştur</h3>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>Paylaşım yapmak için köpeğin için bir profil gerekiyor.</p>
          <button onClick={() => { onClose(); navigate("/yourpoodle/p/olustur"); }}
            style={{ width: "100%", height: 50, borderRadius: 14, border: "none", background: "linear-gradient(135deg,#7C3AED,#A855F7)", color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
            Profil Oluştur →
          </button>
          <button onClick={onClose} style={{ marginTop: 10, width: "100%", padding: "10px", borderRadius: 12, border: "1.5px solid #E5E7EB", background: "#fff", fontSize: 14, cursor: "pointer", fontFamily: "inherit", color: "#555" }}>Kapat</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 400, background: "rgba(0,0,0,0.5)", display: "flex", flexDirection: "column" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ marginTop: "auto", background: "#fff", borderRadius: "22px 22px 0 0", padding: "20px", maxHeight: "90vh", overflowY: "auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: "#1A1A1A" }}>Paylaşım Yap</span>
          <button onClick={onClose} style={{ background: "#F5F5F5", border: "none", borderRadius: 8, padding: 6, cursor: "pointer", display: "flex" }}><X size={18} color="#555" /></button>
        </div>

        {/* Dog selector */}
        {myDogs.length > 1 && (
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#666", marginBottom: 6 }}>Hangi köpek adına?</label>
            <select value={dogSlug} onChange={e => setDogSlug(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 12, border: "1.5px solid #E5E7EB", fontSize: 14, fontFamily: "inherit", outline: "none", background: "#fff" }}>
              {myDogs.map(d => <option key={d.slug} value={d.slug}>{d.name}</option>)}
            </select>
          </div>
        )}
        {myDogs.length === 1 && (
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
            <DogAvatar avatarUrl={myDogs[0].avatar_url} name={myDogs[0].name} size={38} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#1A1A1A" }}>{myDogs[0].name}</div>
              <div style={{ fontSize: 11, color: "#aaa" }}>adına paylaşıyorsun</div>
            </div>
          </div>
        )}

        {/* Text */}
        <textarea value={text} onChange={e => setText(e.target.value)}
          placeholder="Poodle'ınla ilgili ne paylaşmak istersin? #tiras #mama #saglik"
          rows={4}
          style={{ width: "100%", borderRadius: 14, border: "2px solid #E5E7EB", padding: "12px", fontSize: 14, color: "#333", fontFamily: "Inter,sans-serif", resize: "none", lineHeight: 1.6, outline: "none", boxSizing: "border-box" }} />

        {/* Image */}
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: "none" }}
          onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); }} />

        {imageBase64 ? (
          <div style={{ position: "relative", marginTop: 10 }}>
            <img src={imageBase64} alt="" style={{ width: "100%", borderRadius: 12, maxHeight: 200, objectFit: "cover" }} />
            <button onClick={() => setImageBase64(null)}
              style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.6)", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={14} color="#fff" />
            </button>
          </div>
        ) : (
          <button onClick={() => fileRef.current?.click()}
            style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: "1.5px solid #E5E7EB", background: "#F9FAFB", fontSize: 13, color: "#555", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            <Camera size={16} /> Fotoğraf ekle (opsiyonel)
          </button>
        )}

        {/* Visibility */}
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          {[{ v: "public", l: "🌍 Herkese" }, { v: "followers", l: "👥 Takipçiler" }].map(({ v, l }) => (
            <button key={v} onClick={() => setVisibility(v as any)}
              style={{ flex: 1, padding: "8px", borderRadius: 10, border: `1.5px solid ${visibility === v ? "#7C3AED" : "#E5E7EB"}`, background: visibility === v ? "#F5F0FF" : "#fff", color: visibility === v ? "#7C3AED" : "#555", fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              {l}
            </button>
          ))}
        </div>

        {postMutation.isError && (
          <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 8, background: "#FEF2F2", color: "#EF4444", fontSize: 12 }}>
            Gönderilemedi. Tekrar dene.
          </div>
        )}

        <button onClick={() => postMutation.mutate()} disabled={!canPost || postMutation.isPending}
          style={{ width: "100%", marginTop: 14, height: 50, borderRadius: 14, border: "none", background: canPost ? "#7C3AED" : "#E5E7EB", color: canPost ? "#fff" : "#9CA3AF", fontSize: 15, fontWeight: 800, cursor: canPost ? "pointer" : "not-allowed", fontFamily: "inherit" }}>
          {postMutation.isPending ? "Paylaşılıyor..." : "Paylaş"}
        </button>
      </div>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────── */
export default function Club() {
  const [, navigate] = useLocation();
  const { isLoggedIn } = useCustomer();
  const qc = useQueryClient();

  const [activeTab, setActiveTab] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    const slug = p.get("tab");
    if (slug === "topluluk") return "poodlem";
    return slug && TABS.find(t => t.id === slug) ? slug : "akis";
  });
  const [feedCat, setFeedCat] = useState(() => new URLSearchParams(window.location.search).get("kategori") || "tumu");
  const [search, setSearch] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [evCity, setEvCity] = useState("Tüm şehirler");

  // Real feed from API
  const { data: rawPosts = [] } = useQuery<ApiPost[]>({
    queryKey: ["/api/club/public-feed"],
    queryFn: async () => {
      const r = await fetch("/api/club/public-feed?limit=30");
      if (!r.ok) return [];
      const d = await r.json();
      return Array.isArray(d) ? d : [];
    },
    staleTime: 30_000,
  });

  // My dogs (for post creation)
  const { data: myDogs = [] } = useQuery<any[]>({
    queryKey: ["/api/my/dogs"],
    queryFn: async () => { const r = await fetch("/api/my/dogs"); if (!r.ok) return []; return r.json(); },
    enabled: isLoggedIn,
  });

  // Events
  const { data: apiEvents = [] } = useQuery<any[]>({
    queryKey: ["/api/yp-events"],
    queryFn: async () => { const r = await fetch("/api/yp-events"); if (!r.ok) return []; return r.json(); },
    staleTime: 5 * 60 * 1000,
  });
  const displayEvents = apiEvents.length > 0 ? apiEvents : FALLBACK_EVENTS;

  useEffect(() => {
    document.title = "Poodle Club | YourPoodle";
  }, []);

  const switchTab = (id: string) => {
    setActiveTab(id);
    setSearch("");
    const qs = new URLSearchParams();
    qs.set("tab", id);
    window.history.pushState(null, "", `?${qs.toString()}`);
  };

  const likeMutation = useMutation({
    mutationFn: (postId: number) => apiRequest("POST", `/api/club/posts/${postId}/like`, {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/club/public-feed"] }),
  });

  const goLogin = () => navigate("/yourpoodle/giris?redirect=/yourpoodle/club");

  // Filter posts by search + category
  const filteredPosts = rawPosts.filter(p => {
    const text = [p.content ?? "", p.dog_name ?? "", p.owner_name ?? ""].join(" ").toLowerCase();
    const matchSearch = !search || text.includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (feedCat === "tumu") return true;
    const hashtags: string[] = Array.isArray(p.hashtags) ? p.hashtags : (typeof p.hashtags === "string" ? JSON.parse(p.hashtags || "[]") : []);
    return hashtags.includes(feedCat) || (p.content ?? "").toLowerCase().includes(feedCat);
  });

  const filteredEvents = displayEvents.filter((ev: any) => evCity === "Tüm şehirler" || ev.location === evCity);
  const featuredEvent = filteredEvents[0];
  const listEvents = filteredEvents.slice(1);

  return (
    <YPLayout activeLink="/yourpoodle/club" bottomNavActive="/yourpoodle/club">
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        .club-noscroll::-webkit-scrollbar { display:none; }
        .club-noscroll { -ms-overflow-style:none; scrollbar-width:none; }
      `}</style>

      {showCompose && isLoggedIn && (
        <NewPostModal myDogs={myDogs} onClose={() => setShowCompose(false)} />
      )}

      <div style={{ background: "#FAFAF8", minHeight: "100vh", fontFamily: "Inter,sans-serif", paddingBottom: 80 }}>

        {/* ── Mini header ── */}
        <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#7C3AED,#A855F7)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: 18 }}>🐩</span>
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 15, fontWeight: 900, color: "#1A1A1A" }}>Poodle Club</span>
          </div>
          <button onClick={() => navigate("/yourpoodle/club/kesfet")}
            style={{ padding: "6px 12px", borderRadius: 14, border: "1.5px solid #E5E7EB", background: "#fff", fontSize: 12, fontWeight: 700, color: "#555", cursor: "pointer", fontFamily: "inherit" }}>
            🔍 Keşfet
          </button>
          {isLoggedIn ? (
            <button onClick={() => setShowCompose(true)}
              style={{ width: 36, height: 36, borderRadius: 10, border: "none", background: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Plus size={18} color="#fff" />
            </button>
          ) : (
            <button onClick={goLogin}
              style={{ padding: "7px 14px", borderRadius: 20, border: "none", background: "#7C3AED", color: "#fff", fontSize: 12.5, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
              Giriş Yap
            </button>
          )}
        </div>

        {/* ── Tab bar ── */}
        <div role="tablist" style={{ display: "flex", background: "#fff", borderBottom: "1px solid #E5E7EB", position: "sticky", top: 0, zIndex: 50 }}>
          {TABS.map(t => (
            <button key={t.id} role="tab" aria-selected={activeTab === t.id}
              onClick={() => switchTab(t.id)}
              style={{ flex: 1, padding: "11px 4px", fontSize: 13.5, fontWeight: 700, border: "none", background: "none", cursor: "pointer", borderBottom: `2.5px solid ${activeTab === t.id ? "#7C3AED" : "transparent"}`, color: activeTab === t.id ? "#7C3AED" : "#6B7280", fontFamily: "Inter,sans-serif", transition: "color 0.15s" }}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ padding: "16px 14px 0" }}>

          {/* ══ ANA SAYFA (FEED) ══ */}
          {activeTab === "akis" && (
            <div>
              {/* Quick actions */}
              <div className="club-noscroll" style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 14 }}>
                {[
                  { icon: "📸", label: "Paylaş",      action: () => { if (!isLoggedIn) { goLogin(); return; } setShowCompose(true); } },
                  { icon: "🐩", label: "Profil Oluştur", action: () => navigate("/yourpoodle/p/olustur") },
                  { icon: "🔍", label: "Dizin",        action: () => navigate("/yourpoodle/club/kopekler") },
                  { icon: "📅", label: "Etkinlikler",  action: () => switchTab("etkinlik") },
                ].map(b => (
                  <button key={b.label} onClick={b.action}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: 20, border: "1.5px solid #E5E7EB", background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#374151", whiteSpace: "nowrap", flexShrink: 0 }}>
                    <span>{b.icon}</span> {b.label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div style={{ display: "flex", alignItems: "center", background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 12, height: 42, overflow: "hidden", marginBottom: 12 }}>
                <div style={{ paddingLeft: 12, color: "#9CA3AF", display: "flex" }}><Search size={16} strokeWidth={2} /></div>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Paylaşım ara..."
                  style={{ flex: 1, border: "none", outline: "none", fontSize: 13, color: "#333", background: "transparent", padding: "0 10px" }} />
                {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", paddingRight: 10, color: "#9CA3AF", display: "flex" }}><X size={14} /></button>}
              </div>

              {/* Category filters */}
              <div className="club-noscroll" style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 14, paddingBottom: 2 }}>
                {FEED_CATS.map(c => (
                  <button key={c.id} onClick={() => setFeedCat(c.id)}
                    style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 20, border: "1.5px solid", borderColor: feedCat === c.id ? "#7C3AED" : "#E5E7EB", background: feedCat === c.id ? "#7C3AED" : "#fff", color: feedCat === c.id ? "#fff" : "#6B7280", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Compose prompt */}
              {isLoggedIn && (
                <button onClick={() => setShowCompose(true)}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, background: "#fff", borderRadius: 14, padding: "12px 16px", border: "1.5px dashed #DDD5FF", cursor: "pointer", marginBottom: 16 }}>
                  <DogAvatar name="Siz" size={34} />
                  <span style={{ fontSize: 13.5, color: "#9CA3AF", fontWeight: 600 }}>Poodlenle ilgili bir şey paylaş...</span>
                  <div style={{ marginLeft: "auto", width: 30, height: 30, borderRadius: "50%", background: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Plus size={16} color="#fff" strokeWidth={2.5} />
                  </div>
                </button>
              )}

              {/* Feed */}
              {filteredPosts.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 0" }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>🐾</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#555", marginBottom: 6 }}>
                    {rawPosts.length === 0 ? "Henüz paylaşım yok" : "Bu kategoride paylaşım yok"}
                  </div>
                  <div style={{ fontSize: 13, color: "#aaa", marginBottom: 20 }}>İlk paylaşımı sen yap!</div>
                  {isLoggedIn ? (
                    <button onClick={() => setShowCompose(true)}
                      style={{ padding: "10px 24px", borderRadius: 20, background: "#7C3AED", color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "inherit" }}>
                      Paylaşım Yap
                    </button>
                  ) : (
                    <button onClick={goLogin}
                      style={{ padding: "10px 24px", borderRadius: 20, background: "#7C3AED", color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "inherit" }}>
                      Giriş Yap & Paylaş
                    </button>
                  )}
                </div>
              ) : (
                <div role="feed">
                  {filteredPosts.map(post => (
                    <PostCard key={post.id} post={post} isLoggedIn={isLoggedIn} onJoin={goLogin}
                      onLike={id => likeMutation.mutate(id)} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ POODLEM TAB ══ */}
          {activeTab === "poodlem" && (
            <div style={{ paddingBottom: 32 }}>
              <div style={{ textAlign: "center", padding: "32px 0 20px" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🐩</div>
                <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 6 }}>Köpek Dizini</h2>
                <p style={{ fontSize: 14, color: "#888", marginBottom: 24 }}>Tüm YourPoodle köpeklerini keşfet veya kendi profilini oluştur.</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button onClick={() => navigate("/yourpoodle/p/olustur")}
                  style={{ width: "100%", height: 56, borderRadius: 14, border: "none", background: "linear-gradient(135deg,#7C3AED,#A855F7)", color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <Plus size={20} /> Köpek Profili Oluştur
                </button>
                <button onClick={() => navigate("/yourpoodle/club/kopekler")}
                  style={{ width: "100%", height: 50, borderRadius: 14, border: "1.5px solid #E5E7EB", background: "#fff", color: "#555", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  Tüm Profilleri Gör <ChevronRight size={18} />
                </button>
                <button onClick={() => navigate("/yourpoodle/club/kesfet")}
                  style={{ width: "100%", height: 50, borderRadius: 14, border: "1.5px solid #E5E7EB", background: "#fff", color: "#555", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  🔍 Keşfet
                </button>
              </div>
            </div>
          )}

          {/* ══ ETKİNLİK TAB ══ */}
          {activeTab === "etkinlik" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1A1A1A", margin: 0 }}>Yaklaşan Etkinlikler</h2>
                <a href="/yourpoodle/etkinlikler" style={{ color: "#7C3AED", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>Tümü →</a>
              </div>

              {/* City filter */}
              <div className="club-noscroll" style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 16 }}>
                {["Tüm şehirler", "İstanbul", "Ankara", "İzmir", "Online"].map(c => (
                  <button key={c} onClick={() => setEvCity(c)}
                    style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 20, border: "1.5px solid", borderColor: evCity === c ? "#7C3AED" : "#E5E7EB", background: evCity === c ? "#7C3AED" : "#fff", color: evCity === c ? "#fff" : "#6B7280", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                    {c === "Tüm şehirler" ? <><MapPin size={11} />Tüm şehirler</> : c}
                  </button>
                ))}
              </div>

              {/* Featured event */}
              {featuredEvent && (
                <div style={{ background: "linear-gradient(135deg,#7C3AED,#A855F7)", borderRadius: 18, padding: "20px", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,255,255,0.2)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <div style={{ fontSize: 16, fontWeight: 900, color: "#fff", lineHeight: 1.1 }}>{featuredEvent.day}</div>
                      <div style={{ fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.8)" }}>{featuredEvent.month}</div>
                    </div>
                    <div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
                        <span style={{ fontSize: 10, background: "rgba(255,255,255,0.2)", color: "#fff", borderRadius: 6, padding: "2px 8px", fontWeight: 700 }}>{featuredEvent.type}</span>
                        {featuredEvent.free && <span style={{ fontSize: 10, background: "rgba(255,255,255,0.2)", color: "#fff", borderRadius: 6, padding: "2px 8px", fontWeight: 700 }}>Ücretsiz</span>}
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 900, color: "#fff", lineHeight: 1.3 }}>{featuredEvent.title}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginBottom: 6 }}>
                    📍 {featuredEvent.venue}, {featuredEvent.location} · 🕙 {featuredEvent.time}
                  </div>
                  {featuredEvent.desc && <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.85)", lineHeight: 1.6, margin: "0 0 12px" }}>{featuredEvent.desc}</p>}
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => { if (!isLoggedIn) { goLogin(); return; } }}
                      style={{ flex: 1, height: 40, borderRadius: 12, border: "none", background: "#fff", color: "#7C3AED", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>
                      Katıl
                    </button>
                    <a href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(featuredEvent.title)}&location=${encodeURIComponent(featuredEvent.venue + ", " + featuredEvent.location)}`}
                      target="_blank" rel="noopener noreferrer"
                      style={{ height: 40, borderRadius: 12, border: "2px solid rgba(255,255,255,0.4)", background: "transparent", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 12px", textDecoration: "none" }}>
                      <Calendar size={14} />&nbsp;Takvim
                    </a>
                  </div>
                </div>
              )}

              {/* Event list */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {listEvents.map((ev: any) => (
                  <div key={ev.id} style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB", padding: "14px 16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 46, height: 46, borderRadius: 12, background: ev.color || "#7C3AED", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 900, color: "#fff", lineHeight: 1.1 }}>{ev.day}</div>
                      <div style={{ fontSize: 8, fontWeight: 800, color: "rgba(255,255,255,0.85)" }}>{ev.month}</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 4 }}>
                        <span style={{ fontSize: 10, background: "#EDE8FF", color: "#7C3AED", borderRadius: 5, padding: "2px 6px", fontWeight: 700 }}>{ev.type}</span>
                        {ev.free && <span style={{ fontSize: 10, background: "#DCFCE7", color: "#16A34A", borderRadius: 5, padding: "2px 6px", fontWeight: 700 }}>Ücretsiz</span>}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#1A1A1A", marginBottom: 2 }}>{ev.title}</div>
                      <div style={{ fontSize: 11.5, color: "#9CA3AF" }}>📍 {ev.location} · 🕙 {ev.time}</div>
                    </div>
                    <button onClick={() => { if (!isLoggedIn) { goLogin(); return; } }}
                      style={{ padding: "7px 12px", borderRadius: 10, border: "none", background: "#7C3AED", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", flexShrink: 0, alignSelf: "center" }}>
                      Katıl
                    </button>
                  </div>
                ))}
              </div>

              {filteredEvents.length === 0 && (
                <div style={{ textAlign: "center", padding: "48px 0", color: "#9CA3AF" }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>📅</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#555" }}>Bu şehirde yaklaşan etkinlik yok</div>
                  <button onClick={() => setEvCity("Tüm şehirler")} style={{ marginTop: 12, padding: "8px 20px", borderRadius: 20, border: "none", background: "#7C3AED", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                    Tüm şehirleri göster
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Club mini-footer */}
        <footer style={{ marginTop: 32, borderTop: "1px solid #E5E7EB", padding: "16px", background: "#fff", textAlign: "center" }}>
          <div style={{ fontSize: 12.5, color: "#9CA3AF", display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <span style={{ fontWeight: 700, color: "#7C3AED" }}>YourPoodle Club</span>
            <a href="/yourpoodle/gizlilik-politikasi" style={{ color: "#9CA3AF", textDecoration: "none" }}>Gizlilik</a>
            <a href="/yourpoodle/kullanim-sartlari" style={{ color: "#9CA3AF", textDecoration: "none" }}>Kullanım Koşulları</a>
            <a href="/yourpoodle/club/hakkimizda" style={{ color: "#9CA3AF", textDecoration: "none" }}>Club Nedir?</a>
          </div>
        </footer>
      </div>

      {/* FAB */}
      {isLoggedIn && activeTab === "akis" && (
        <button onClick={() => setShowCompose(true)}
          style={{ position: "fixed", bottom: 80, right: 20, width: 52, height: 52, borderRadius: "50%", background: "#7C3AED", border: "none", boxShadow: "0 6px 20px rgba(124,58,237,0.4)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 150 }}>
          <Plus size={22} color="#fff" strokeWidth={2.5} />
        </button>
      )}
    </YPLayout>
  );
}
