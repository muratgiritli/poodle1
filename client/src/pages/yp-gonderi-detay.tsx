import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { Heart, MessageCircle, Share2, Bookmark, ArrowLeft, MoreHorizontal, Send } from "lucide-react";
import { getPost, MOCK_POSTS } from "@/data/clubPosts";
import { IS_YP } from "@/lib/store";

const P = "#7022C4";
const BASE = IS_YP ? "" : "/yourpoodle";

export default function YPGonderiDetayPage() {
  const [, paramsA] = useRoute("/club/gonderi/:postId");
  const [, paramsB] = useRoute("/yourpoodle/club/gonderi/:postId");
  const [, navigate] = useLocation();
  const params = paramsA ?? paramsB;
  const postId = params?.postId ?? "1";
  const post = getPost(postId) ?? MOCK_POSTS[0];

  const LS_KEY = `yp_post_likes`;
  const [liked, setLiked] = useState<boolean>(() => {
    try { const s = localStorage.getItem(LS_KEY); return s ? (JSON.parse(s) as string[]).includes(postId) : false; } catch { return false; }
  });
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(() => {
    try { const s = localStorage.getItem(`yp_post_comments_${postId}`); return s ? [...post.comments, ...JSON.parse(s)] : post.comments; } catch { return post.comments; }
  });

  useEffect(() => { document.title = `${post.author} | YourPoodle Club`; }, [post.author]);

  function toggleLike() {
    setLiked(prev => {
      const next = !prev;
      try {
        const s = localStorage.getItem(LS_KEY);
        const arr: string[] = s ? JSON.parse(s) : [];
        const updated = next ? [...arr.filter(x => x !== postId), postId] : arr.filter(x => x !== postId);
        localStorage.setItem(LS_KEY, JSON.stringify(updated));
      } catch {}
      return next;
    });
  }

  function sendComment(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim()) return;
    const newComment = { id: Date.now(), author: "Ben", avatar: "👤", text: comment.trim(), time: "şimdi" };
    setComments(c => {
      const updated = [...c, newComment];
      try {
        const existing = comments.filter(x => !post.comments.some(p => p.id === x.id));
        localStorage.setItem(`yp_post_comments_${postId}`, JSON.stringify([...existing, newComment]));
      } catch {}
      return updated;
    });
    setComment("");
  }

  return (
    <YPLayout activeLink={`${BASE}/club`} constrain={false}>
      <div style={{ minHeight: "100vh", background: "#FAFAFA", paddingBottom: 48 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "16px 20px 0", display: "flex", gap: 0, alignItems: "flex-start", flexWrap: "wrap" }}>

          {/* Back */}
          <div style={{ width: "100%", marginBottom: 16 }}>
            <button onClick={() => navigate(`${BASE}/club`)}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#6B7280", fontSize: 13, fontWeight: 600, padding: 0, fontFamily: "inherit" }}>
              <ArrowLeft size={16} /> Club'a Dön
            </button>
          </div>

          <div style={{ display: "flex", gap: 0, width: "100%", flexWrap: "wrap", background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.08)" }}>
            {/* Image */}
            <div style={{ flex: "1 1 340px", minHeight: 300, background: "linear-gradient(135deg,#7022C4,#A855F7,#EC4899)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 80 }}>{post.avatar}</span>
            </div>

            {/* Info + comments */}
            <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", minWidth: 280 }}>
              {/* Author row */}
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#F5F0FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{post.avatar}</div>
                  <div>
                    <button onClick={() => navigate(`${BASE}/club/profil/${post.username}`)}
                      style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 14, color: "#111827", padding: 0, fontFamily: "inherit" }}>
                      @{post.username}
                    </button>
                    <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>{post.author}</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setFollowing(f => !f)}
                    style={{ padding: "6px 14px", borderRadius: 8, border: `1.5px solid ${P}`, background: following ? P : "#F5F0FF", color: following ? "#fff" : P, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                    {following ? "Takip Ediliyor" : "Takip Et"}
                  </button>
                  <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}>
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </div>

              {/* Comments */}
              <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", maxHeight: 280 }}>
                <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, marginBottom: 12 }}>{post.caption}</p>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 16 }}>
                  {post.hashtags.map(h => <span key={h} style={{ fontSize: 12, color: P }}>{h}</span>)}
                </div>
                {comments.map(c => (
                  <div key={c.id} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{c.avatar}</span>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>@{c.author} </span>
                      <span style={{ fontSize: 13, color: "#374151" }}>{c.text}</span>
                      <p style={{ margin: "2px 0 0", fontSize: 11, color: "#9CA3AF" }}>{c.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action row */}
              <div style={{ padding: "12px 20px", borderTop: "1px solid #F3F4F6" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ display: "flex", gap: 14 }}>
                    <button onClick={toggleLike}
                      style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: liked ? "#EF4444" : "#6B7280", fontFamily: "inherit", fontSize: 13, fontWeight: 600 }}>
                      <Heart size={18} fill={liked ? "#EF4444" : "none"} /> {post.likes + (liked ? 1 : 0)}
                    </button>
                    <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "#6B7280", fontFamily: "inherit", fontSize: 13 }}>
                      <MessageCircle size={18} /> {comments.length}
                    </button>
                    <button onClick={() => {
                      if (navigator.share) navigator.share({ title: post.author, text: post.caption, url: window.location.href }).catch(()=>{});
                      else if (navigator.clipboard) navigator.clipboard.writeText(window.location.href).then(()=>{});
                    }} style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280" }}>
                      <Share2 size={18} />
                    </button>
                  </div>
                  <button onClick={() => setSaved(x => !x)} style={{ background: "none", border: "none", cursor: "pointer", color: saved ? P : "#6B7280" }}>
                    <Bookmark size={18} fill={saved ? P : "none"} />
                  </button>
                </div>
                <p style={{ fontSize: 12, color: "#9CA3AF", margin: "0 0 10px" }}>{post.time}</p>
                <form onSubmit={sendComment} style={{ display: "flex", gap: 8 }}>
                  <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Yorum ekle..."
                    style={{ flex: 1, height: 38, borderRadius: 10, border: "1.5px solid #E5E7EB", padding: "0 12px", fontSize: 13, fontFamily: "inherit", outline: "none" }} />
                  <button type="submit" style={{ width: 38, height: 38, borderRadius: 10, border: "none", background: P, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Send size={15} />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Related posts */}
          <div style={{ width: "100%", marginTop: 32 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>Benzer Gönderiler</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
              {MOCK_POSTS.filter(p => p.id !== post.id).map(p => (
                <div key={p.id} onClick={() => navigate(`${BASE}/club/gonderi/${p.id}`)}
                  style={{ aspectRatio: "1", borderRadius: 12, background: "linear-gradient(135deg,#7022C4,#A855F7)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 36 }}>
                  {p.avatar}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </YPLayout>
  );
}
