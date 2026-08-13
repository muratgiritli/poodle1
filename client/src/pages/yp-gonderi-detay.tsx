import { useEffect, useRef, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, MessageCircle, Share2, Bookmark, ArrowLeft, Send } from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { useCustomer } from "@/contexts/CustomerContext";
import { apiRequest } from "@/lib/queryClient";
import { IS_YP } from "@/lib/store";
import { goBack } from "@/lib/goBack";

const P = "#5D3A1A";
const BASE = IS_YP ? "" : "/yourpoodle";

function PostImageCarousel({ images }: { images: string[] }) {
  const [idx, setIdx] = useState(0);
  const startX = useRef<number | null>(null);
  if (!images.length) return null;
  const go = (n: number) => setIdx(Math.max(0, Math.min(images.length - 1, n)));
  return (
    <div
      onTouchStart={(e) => { startX.current = e.touches[0]?.clientX ?? null; }}
      onTouchEnd={(e) => {
        if (startX.current == null) return;
        const dx = (e.changedTouches[0]?.clientX ?? startX.current) - startX.current;
        if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
        startX.current = null;
      }}
      style={{ position: "relative", width: "100%", aspectRatio: "1 / 1", background: "#FAFAFA", overflow: "hidden" }}
    >
      <img src={images[idx]} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }} />
      {images.length > 1 && (
        <>
          <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,.55)", color: "#fff", fontSize: 11, fontWeight: 700, borderRadius: 999, padding: "3px 8px" }}>
            {idx + 1}/{images.length}
          </div>
          <div style={{ position: "absolute", bottom: 10, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 4 }}>
            {images.map((_, i) => (
              <button key={i} type="button" aria-label={`Foto ${i + 1}`} onClick={() => go(i)}
                style={{ width: i === idx ? 7 : 5, height: i === idx ? 7 : 5, borderRadius: "50%", border: "none", padding: 0, background: i === idx ? "#fff" : "rgba(255,255,255,.55)", cursor: "pointer" }} />
            ))}
          </div>
          {idx > 0 && (
            <button type="button" aria-label="Önceki" onClick={() => go(idx - 1)}
              style={{ position: "absolute", left: 6, top: "50%", transform: "translateY(-50%)", width: 28, height: 28, borderRadius: "50%", border: "none", background: "rgba(255,255,255,.85)", cursor: "pointer", fontWeight: 700 }}>‹</button>
          )}
          {idx < images.length - 1 && (
            <button type="button" aria-label="Sonraki" onClick={() => go(idx + 1)}
              style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", width: 28, height: 28, borderRadius: "50%", border: "none", background: "rgba(255,255,255,.85)", cursor: "pointer", fontWeight: 700 }}>›</button>
          )}
        </>
      )}
    </div>
  );
}

type Post = {
  id: number;
  content: string | null;
  image_urls: string[];
  hashtags: string[];
  like_count: number;
  comment_count: number;
  dog_name: string | null;
  dog_slug: string | null;
  avatar_url: string | null;
  dog_city: string | null;
  owner_name: string | null;
  liked: boolean;
  saved: boolean;
  following: boolean;
  timeAgo: string;
};

type Comment = { id: number; content: string; author_name: string };

function renderCaption(text: string) {
  const parts = text.split(/(#[\wçğıöşüÇĞİÖŞÜ]+)/gu);
  return parts.map((part, i) => {
    if (part.startsWith("#")) {
      return (
        <span key={i} style={{ color: P, fontWeight: 600 }}>
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function YPGonderiDetayPage() {
  const [, paramsA] = useRoute("/club/gonderi/:postId");
  const [, paramsB] = useRoute("/yourpoodle/club/gonderi/:postId");
  const [, navigate] = useLocation();
  const { isLoggedIn } = useCustomer();
  const qc = useQueryClient();
  const postId = (paramsA ?? paramsB)?.postId || "";
  const [comment, setComment] = useState("");
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  const { data: post, isLoading, isError } = useQuery<Post>({
    queryKey: ["/api/club/posts", postId],
    enabled: !!postId,
    queryFn: async () => {
      const r = await fetch(`/api/club/posts/${postId}`, { credentials: "include" });
      if (!r.ok) throw new Error("not found");
      return r.json();
    },
  });

  const { data: comments = [], refetch: refetchComments } = useQuery<Comment[]>({
    queryKey: ["/api/club/posts", postId, "comments"],
    enabled: !!postId,
    queryFn: async () => {
      const r = await fetch(`/api/club/posts/${postId}/comments`, { credentials: "include" });
      if (!r.ok) return [];
      return r.json();
    },
  });

  useEffect(() => {
    document.title = post?.dog_name ? `${post.dog_name} | YourPoodle Club` : "Gönderi | YourPoodle Club";
  }, [post?.dog_name]);

  const needLogin = () => navigate(`${BASE}/giris?returnTo=${encodeURIComponent(`${BASE}/club/gonderi/${postId}`)}`);

  const patchPost = (patch: Partial<Post>) => {
    qc.setQueryData<Post>(["/api/club/posts", postId], (old) => (old ? { ...old, ...patch } : old));
  };

  const likeMut = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/club/posts/${postId}/like`, {});
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || "Beğeni başarısız");
      return res.json() as Promise<{ liked: boolean }>;
    },
    onMutate: async () => {
      const cur = qc.getQueryData<Post>(["/api/club/posts", postId]);
      if (!cur) return;
      patchPost({
        liked: !cur.liked,
        like_count: Math.max(0, (cur.like_count || 0) + (cur.liked ? -1 : 1)),
      });
    },
    onSuccess: (data) => {
      const cur = qc.getQueryData<Post>(["/api/club/posts", postId]);
      if (!cur) return;
      // sync absolute liked flag from server
      if (typeof data?.liked === "boolean" && data.liked !== cur.liked) {
        patchPost({
          liked: data.liked,
          like_count: Math.max(0, (cur.like_count || 0) + (data.liked ? 1 : -1)),
        });
      }
    },
    onError: () => {
      qc.invalidateQueries({ queryKey: ["/api/club/posts", postId] });
      showToast("Beğeni kaydedilemedi — giriş gerekli olabilir");
    },
  });

  const saveMut = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/club/posts/${postId}/save`, {});
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || "Kaydetme başarısız");
      return res.json() as Promise<{ saved: boolean }>;
    },
    onMutate: async () => {
      const cur = qc.getQueryData<Post>(["/api/club/posts", postId]);
      if (!cur) return;
      patchPost({ saved: !cur.saved });
    },
    onSuccess: (data) => {
      if (typeof data?.saved === "boolean") patchPost({ saved: data.saved });
      showToast(data?.saved ? "Kaydedildi" : "Kayıttan çıkarıldı");
    },
    onError: () => {
      qc.invalidateQueries({ queryKey: ["/api/club/posts", postId] });
      showToast("Kaydetme başarısız — giriş gerekli olabilir");
    },
  });

  const commentMut = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("POST", `/api/club/posts/${postId}/comments`, { content });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || "Yorum gönderilemedi");
      return res.json();
    },
    onSuccess: () => {
      setComment("");
      refetchComments();
      qc.invalidateQueries({ queryKey: ["/api/club/posts", postId] });
      showToast("Yorum eklendi");
    },
    onError: (e: any) => showToast(e?.message || "Yorum gönderilemedi"),
  });

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: post?.dog_name || "YourPoodle", text: post?.content || "", url });
        return;
      } catch (e: any) {
        if (e?.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      showToast("Link kopyalandı");
    } catch {
      showToast("Paylaşım desteklenmiyor");
    }
  };

  if (isLoading) {
    return (
      <YPLayout activeLink={`${BASE}/club`} constrain={false}>
        <div style={{ padding: 48, textAlign: "center", color: "#9CA3AF" }}>Yükleniyor...</div>
      </YPLayout>
    );
  }

  if (isError || !post) {
    return (
      <YPLayout activeLink={`${BASE}/club`} constrain={false}>
        <div style={{ padding: 48, textAlign: "center" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800 }}>Gönderi bulunamadı</h2>
          <button type="button" onClick={() => navigate(`${BASE}/club`)}
            style={{ marginTop: 16, background: P, color: "#fff", border: "none", borderRadius: 12, padding: "10px 18px", fontWeight: 700, cursor: "pointer" }}>
            Club'a Dön
          </button>
        </div>
      </YPLayout>
    );
  }

  const tags = Array.isArray(post.hashtags) ? post.hashtags : [];
  const bodyText = String(post.content || "").trim();
  // content already has hashtags → don't duplicate from array
  const showExtraTags = tags.length > 0 && !tags.some((t) => bodyText.toLowerCase().includes(`#${String(t).replace(/^#/, "").toLowerCase()}`));

  return (
    <YPLayout activeLink={`${BASE}/club`} constrain={false}>
      {toast && (
        <div style={{
          position: "fixed",
          bottom: "calc(96px + env(safe-area-inset-bottom))",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1200,
          pointerEvents: "none",
          background: "#3D2612",
          color: "#fff",
          padding: "11px 18px",
          borderRadius: 999,
          fontSize: 13,
          fontWeight: 600,
          whiteSpace: "nowrap",
        }}>
          {toast}
        </div>
      )}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "12px 12px 48px" }}>
        <button type="button" onClick={() => goBack(navigate, `${BASE}/club`)}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#6B7280", fontSize: 13, fontWeight: 600, padding: "8px 0", fontFamily: "inherit" }}>
          <ArrowLeft size={16} /> Geri
        </button>

        <article style={{ background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 12 }}>
            <button type="button" onClick={() => post.dog_slug && navigate(`${BASE}/p/${post.dog_slug}`)}
              style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, fontFamily: "inherit" }}>
              <img src={post.avatar_url || "/images/yp-poodle-hero.png"} alt="" style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }} />
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{post.dog_name || post.owner_name || "Poodle"}</div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>{post.timeAgo}{post.dog_city ? ` · ${post.dog_city}` : ""}</div>
              </div>
            </button>
          </div>

          {(post.image_urls || []).length > 0 && (
            <PostImageCarousel images={post.image_urls || []} />
          )}

          <div style={{ display: "flex", gap: 14, padding: "12px 12px 6px" }}>
            <button
              type="button"
              aria-label="Beğen"
              disabled={likeMut.isPending}
              onClick={() => (isLoggedIn ? likeMut.mutate() : needLogin())}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0, opacity: likeMut.isPending ? 0.6 : 1 }}
            >
              <Heart size={24} color={post.liked ? "#EF4444" : "#111"} fill={post.liked ? "#EF4444" : "none"} />
            </button>
            <button type="button" aria-label="Yorum" onClick={() => document.getElementById("gonderi-comment")?.focus()} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              <MessageCircle size={24} />
            </button>
            <button type="button" aria-label="Paylaş" onClick={share} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              <Share2 size={24} />
            </button>
            <div style={{ flex: 1 }} />
            <button
              type="button"
              aria-label="Kaydet"
              disabled={saveMut.isPending}
              onClick={() => (isLoggedIn ? saveMut.mutate() : needLogin())}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0, opacity: saveMut.isPending ? 0.6 : 1 }}
            >
              <Bookmark size={24} fill={post.saved ? "#111" : "none"} />
            </button>
          </div>

          <div style={{ padding: "0 12px 8px", fontWeight: 700, fontSize: 14 }}>{post.like_count || 0} beğeni</div>
          {(bodyText || showExtraTags) && (
            <div style={{ padding: "0 12px 12px", fontSize: 14, lineHeight: 1.55 }}>
              <strong>{post.dog_name || "poodle"}</strong>{" "}
              {bodyText ? renderCaption(bodyText) : null}
              {showExtraTags && (
                <>
                  {" "}
                  {tags.map((t) => (
                    <span key={t} style={{ color: P, fontWeight: 600 }}>#{String(t).replace(/^#/, "")} </span>
                  ))}
                </>
              )}
            </div>
          )}

          <div style={{ borderTop: "1px solid #F3F4F6", padding: "12px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
              Yorumlar ({comments.length || post.comment_count || 0})
            </div>
            {comments.length === 0 && (
              <p style={{ fontSize: 12, color: "#9CA3AF", margin: "0 0 10px" }}>Henüz yorum yok — ilk yorumu sen yaz.</p>
            )}
            {comments.map((c) => (
              <div key={c.id} style={{ fontSize: 13, marginBottom: 8 }}>
                <strong>{c.author_name || "Üye"}</strong> {c.content}
              </div>
            ))}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!isLoggedIn) {
                  needLogin();
                  return;
                }
                if (!comment.trim() || commentMut.isPending) return;
                commentMut.mutate(comment.trim());
              }}
              style={{ display: "flex", gap: 8, marginTop: 8 }}
            >
              <input
                id="gonderi-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value.slice(0, 500))}
                onFocus={() => {
                  if (!isLoggedIn) needLogin();
                }}
                placeholder="Yorum yaz..."
                maxLength={500}
                style={{ flex: 1, border: "1px solid #E5E7EB", borderRadius: 12, padding: "10px 12px", fontSize: 13, fontFamily: "inherit" }}
              />
              <button
                type="submit"
                disabled={commentMut.isPending || !comment.trim()}
                aria-label="Yorum gönder"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  border: "none",
                  background: P,
                  color: "#fff",
                  cursor: comment.trim() ? "pointer" : "not-allowed",
                  opacity: !comment.trim() || commentMut.isPending ? 0.55 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </article>
      </div>
    </YPLayout>
  );
}
