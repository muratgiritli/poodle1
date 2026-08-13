// Route: /hesabim/club-paylasimlarim
import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft, Camera, MapPin, ChevronRight, ChevronDown, ChevronUp,
  Grid3X3, List, ArrowUpDown, Pencil, MessageCircle, BarChart2,
  Archive, Trash2, Heart, Bookmark, Users, Plus, X, MoreHorizontal,
} from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { useCustomer } from "@/contexts/CustomerContext";
import { goBack } from "@/lib/goBack";
import { apiRequest } from "@/lib/queryClient";
import { IS_YP } from "@/lib/store";

/* ── Palette (app standard) ─────────────────── */
const P   = "#5D3A1A";
const PL  = "#F5F0E6";
const NAV = "#1D1E9B";
const GT  = "#6B7280";
const DRK = "#111827";
const GB  = "#E5E7EB";
const GBG = "#F9FAFB";
const BASE = IS_YP ? "" : "/yourpoodle";

/* ── Types ───────────────────────────────────── */
type ContentTab = "paylasimlar" | "taslaklar" | "arsiv";

interface Dog {
  id: number; slug: string; name: string; city?: string; district?: string;
  avatar_url?: string; follower_count?: number; following_count?: number; bio?: string;
}

interface ApiPost {
  id: number; content?: string; image_urls?: string[] | string;
  like_count: number; comment_count: number; save_count?: number;
  created_at: string; dog?: Dog;
}

interface Post {
  id: number;
  image: string;
  likes: number;
  comments: number;
  saves: number;
  caption: string;
  date: string;
  badge?: string;
  isVideo?: boolean;
  isAlbum?: boolean;
  dogSlug?: string;
}

async function fetchMyPosts(): Promise<ApiPost[]> {
  const agg = await fetch("/api/club/my-posts", { credentials: "include" });
  if (agg.ok) {
    const data = await agg.json();
    return Array.isArray(data) ? data : data.posts ?? [];
  }
  const dogsRes = await fetch("/api/my/dogs", { credentials: "include" });
  if (!dogsRes.ok) return [];
  const dogs: Dog[] = await dogsRes.json();
  const all: ApiPost[] = [];
  await Promise.all(dogs.map(async (dog) => {
    const pr = await fetch(`/api/dogs/${dog.slug}/posts`, { credentials: "include" });
    if (!pr.ok) return;
    const posts: ApiPost[] = await pr.json();
    all.push(...posts.map(p => ({ ...p, dog })));
  }));
  return all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

function parseImages(raw?: string[] | string): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try { return JSON.parse(raw); } catch { return []; }
}

function mapPost(p: ApiPost & { dog_slug?: string }): Post {
  const imgs = parseImages(p.image_urls);
  return {
    id: p.id,
    image: imgs[0] || "",
    likes: p.like_count ?? 0,
    comments: p.comment_count ?? 0,
    saves: p.save_count ?? 0,
    caption: p.content || "",
    date: p.created_at
      ? new Date(p.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })
      : "",
    isAlbum: imgs.length > 1,
    dogSlug: p.dog?.slug || p.dog_slug,
  };
}

/* ── Helpers ─────────────────────────────────── */
function fmtNum(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(".0", "") + " B";
  return n.toString();
}

function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, [msg]);
  return (
    <div style={{
      position: "fixed", top: 72, left: "50%", transform: "translateX(-50%)",
      background: "#111", color: "#fff", padding: "10px 22px", borderRadius: 12,
      fontSize: 13, fontWeight: 600, zIndex: 9999, whiteSpace: "nowrap",
      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    }}>
      {msg}
    </div>
  );
}

/* ── Delete confirm modal ────────────────────── */
function DeleteModal({ post, onConfirm, onCancel }: {
  post: Post; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 9998,
    }}>
      <div style={{
        background: "#fff", borderRadius: "20px 20px 0 0", padding: "24px 20px 36px",
        width: "100%", maxWidth: "var(--yp-shell-max)",
      }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: DRK, marginBottom: 8 }}>Paylaşımı Sil</div>
        <div style={{ fontSize: 13, color: GT, marginBottom: 24 }}>
          Bu paylaşımı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: "12px 0", borderRadius: 12,
            border: `1.5px solid ${GB}`, background: "#fff",
            fontSize: 14, fontWeight: 600, color: GT, cursor: "pointer", fontFamily: "inherit",
          }}>İptal</button>
          <button onClick={onConfirm} style={{
            flex: 1, padding: "12px 0", borderRadius: 12,
            border: "none", background: "#EF4444",
            fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "inherit",
          }}>Sil</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════ */
export default function YPHesabimClubPaylasimlarimPage() {
  const [, navigate] = useLocation();
  const qc = useQueryClient();
  const { isLoggedIn } = useCustomer();

  const [activeTab, setActiveTab] = useState<ContentTab>("paylasimlar");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [toast, setToast]         = useState("");

  const { data: myDogs = [], isLoading: dogsLoading } = useQuery<Dog[]>({
    queryKey: ["/api/my/dogs"],
    queryFn: async () => {
      const r = await fetch("/api/my/dogs", { credentials: "include" });
      if (!r.ok) return [];
      return r.json();
    },
    enabled: !!isLoggedIn,
  });

  const { data: apiPosts = [], isLoading: postsLoading, refetch: refetchPosts } = useQuery<ApiPost[]>({
    queryKey: ["/api/club/my-posts"],
    queryFn: fetchMyPosts,
    enabled: !!isLoggedIn,
  });

  const posts = useMemo(() => apiPosts.map(mapPost), [apiPosts]);
  const primaryDog = myDogs[0] ?? null;

  const goShare = () => navigate(`${BASE}/club`);

  const deleteMut = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/club/posts/${id}`, {}),
    onSuccess: () => {
      refetchPosts();
      qc.invalidateQueries({ queryKey: ["/api/my/dogs"] });
      setExpandedId(null);
      setDeleteTarget(null);
      setToast("Paylaşım silindi");
    },
    onError: () => setToast("Silme başarısız"),
  });

  useEffect(() => {
    if (isLoggedIn === false) navigate("/yourpoodle/giris?returnTo=/hesabim/club-paylasimlarim");
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

  const showToast = (m: string) => setToast(m);

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteMut.mutate(deleteTarget.id);
  };

  const toggleAccordion = (key: string) =>
    setOpenAccordion(v => v === key ? null : key);

  const TAB_ITEMS: { key: ContentTab; label: string; count: number }[] = [
    { key: "paylasimlar", label: "Paylaşımlar", count: posts.length },
    { key: "taslaklar",   label: "Taslaklar",   count: 0 },
    { key: "arsiv",       label: "Arşiv",        count: 0 },
  ];

  const ACCORDION_ITEMS = [
    { key: "duzenleme",   label: "Paylaşım Düzenleme" },
    { key: "arsiv",       label: "Arşiv ve Taslaklar" },
    { key: "gizlilik",    label: "Gizlilik Ayarları" },
  ];

  const expandedPost = posts.find(p => p.id === expandedId) ?? null;

  return (
    <YPLayout activeLink="club" constrain={false}>
      {toast && <Toast msg={toast} onDone={() => setToast("")} />}
      {deleteTarget && (
        <DeleteModal post={deleteTarget} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />
      )}

      <div style={{
        maxWidth: "var(--yp-shell-max)", margin: "0 auto",
        fontFamily: "'Inter',-apple-system,sans-serif",
        background: "#fff", minHeight: "100vh", paddingBottom: 80, color: DRK,
      }}>

        {/* ── PAGE HEADER ── */}
        <div style={{ padding: "14px 16px 0", background: "#fff" }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <button onClick={() => goBack(navigate, "/hesabim")} aria-label="Geri"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
              <ArrowLeft size={17} color={P} />
            </button>
            <span style={{ fontSize: 12, color: P, fontWeight: 500 }}>Hesabım</span>
            <span style={{ fontSize: 12, color: P }}>/</span>
            <span style={{ fontSize: 12, color: P, fontWeight: 700 }}>Club Paylaşımlarım</span>
          </div>

          {/* Title row */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: DRK, margin: 0 }}>Club Paylaşımlarım</h1>
            <button
              onClick={goShare}
              style={{
                display: "flex", alignItems: "center", gap: 6, flexShrink: 0,
                padding: "8px 12px", borderRadius: 12,
                border: `1.5px solid ${P}`, background: "#fff", color: P,
                fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                whiteSpace: "nowrap",
              }}>
              <Camera size={14} /> Yeni Fotoğraf Paylaş
            </button>
          </div>
          <p style={{ fontSize: 13, color: GT, margin: "0 0 14px" }}>
            {primaryDog ? `${primaryDog.name}'ın paylaşımlarını görüntüleyin ve yönetin.` : "Köpek profilinizi oluşturup Club'da paylaşım yapabilirsiniz."}
          </p>
        </div>

        {(dogsLoading || postsLoading) && (
          <div style={{ padding: "32px 16px", textAlign: "center", color: GT, fontSize: 14 }}>Yükleniyor...</div>
        )}

        {!dogsLoading && !primaryDog && (
          <div style={{ margin: "0 12px 14px", padding: 24, background: GBG, borderRadius: 16, border: `1px solid ${GB}`, textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🐾</div>
            <p style={{ fontSize: 15, fontWeight: 700, color: DRK, margin: "0 0 8px" }}>Henüz köpek profiliniz yok</p>
            <p style={{ fontSize: 13, color: GT, margin: "0 0 16px" }}>Paylaşım yapmak için önce köpek profilinizi oluşturun.</p>
            <button onClick={() => navigate(`${BASE}/p/olustur`)}
              style={{ padding: "10px 20px", borderRadius: 12, border: "none", background: P, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              Profil Oluştur
            </button>
          </div>
        )}

        {primaryDog && (
        <>
        <div style={{ margin: "0 12px 14px", background: GBG, borderRadius: 16, border: `1px solid ${GB}`, padding: "14px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              {primaryDog.avatar_url ? (
                <img src={primaryDog.avatar_url} alt={primaryDog.name}
                  style={{ width: 58, height: 58, borderRadius: "50%", objectFit: "cover", border: `3px solid ${P}` }} />
              ) : (
                <div style={{ width: 58, height: 58, borderRadius: "50%", background: PL, border: `3px solid ${P}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🐩</div>
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: DRK }}>{primaryDog.name}</span>
                <span style={{ fontSize: 16 }}>🐾</span>
              </div>
              <div style={{ fontSize: 12, color: GT }}>@{primaryDog.slug}</div>
              {(primaryDog.city || primaryDog.district) && (
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                  <MapPin size={11} color={GT} />
                  <span style={{ fontSize: 11, color: GT }}>{[primaryDog.district, primaryDog.city].filter(Boolean).join(", ")}</span>
                </div>
              )}
            </div>

            {/* Profili Gör */}
            <button onClick={() => navigate(`${BASE}/p/${primaryDog.slug}`)}
              style={{
                padding: "7px 12px", borderRadius: 10,
                border: `1.5px solid ${P}`, background: "#fff",
                fontSize: 11, fontWeight: 700, color: P,
                cursor: "pointer", fontFamily: "inherit", flexShrink: 0,
              }}>
              Profili Gör
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", justifyContent: "space-around", marginTop: 14, paddingTop: 12, borderTop: `1px solid ${GB}` }}>
            {[
              { label: "Paylaşım", value: posts.length },
              { label: "Takipçi",  value: fmtNum(primaryDog.follower_count ?? 0) },
              { label: "Takip",    value: fmtNum(primaryDog.following_count ?? 0) },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 17, fontWeight: 800, color: DRK }}>{s.value}</div>
                <div style={{ fontSize: 11, color: GT, marginTop: 1 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", borderBottom: `1px solid ${GB}`, margin: "0 12px 12px" }}>
          {TAB_ITEMS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1, padding: "10px 4px", background: "none", border: "none",
                borderBottom: activeTab === tab.key ? `2.5px solid ${P}` : "2.5px solid transparent",
                color: activeTab === tab.key ? P : GT,
                fontSize: 13, fontWeight: activeTab === tab.key ? 700 : 500,
                cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
              }}>
              {tab.label} <span style={{ fontSize: 11, opacity: 0.8 }}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* ── GRID CONTROLS ── */}
        {activeTab === "paylasimlar" && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px 10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
              {/* Grid toggle */}
              <button onClick={() => setViewMode("grid")}
                style={{
                  padding: "6px 8px", borderRadius: "8px 0 0 8px",
                  border: `1.5px solid ${GB}`,
                  background: viewMode === "grid" ? P : "#fff",
                  color: viewMode === "grid" ? "#fff" : GT,
                  cursor: "pointer", display: "flex",
                }}>
                <Grid3X3 size={15} />
              </button>
              <button onClick={() => setViewMode("list")}
                style={{
                  padding: "6px 8px", borderRadius: "0 8px 8px 0",
                  border: `1.5px solid ${GB}`, borderLeft: "none",
                  background: viewMode === "list" ? P : "#fff",
                  color: viewMode === "list" ? "#fff" : GT,
                  cursor: "pointer", display: "flex",
                }}>
                <List size={15} />
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: GT, fontWeight: 600 }}>En Yeni</span>
              <button
                style={{
                  display: "flex", alignItems: "center", gap: 4,
                  padding: "6px 10px", borderRadius: 8, border: `1.5px solid ${GB}`,
                  background: "#fff", fontSize: 12, fontWeight: 600, color: GT,
                  cursor: "pointer", fontFamily: "inherit",
                }}>
                <ArrowUpDown size={13} /> Sırala
              </button>
            </div>
          </div>
        )}

        {/* ── PAYLAŞIMLAR TAB ── */}
        {activeTab === "paylasimlar" && (
          <>
            {!postsLoading && posts.length === 0 ? (
              <div style={{ padding: "32px 20px", textAlign: "center", margin: "0 12px 12px", background: GBG, borderRadius: 16, border: `1px solid ${GB}` }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📷</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: DRK, marginBottom: 6 }}>Henüz paylaşım yok</div>
                <div style={{ fontSize: 13, color: GT, marginBottom: 16 }}>Club'da ilk fotoğrafınızı paylaşın.</div>
                <button onClick={goShare}
                  style={{ padding: "10px 20px", borderRadius: 12, border: "none", background: P, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  Paylaşım Yap
                </button>
              </div>
            ) : viewMode === "grid" ? (
              /* 3-column grid */
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
                gap: 2, padding: "0 12px 12px",
              }}>
                {posts.map(post => (
                  <div key={post.id}
                    onClick={() => setExpandedId(v => v === post.id ? null : post.id)}
                    style={{
                      position: "relative", aspectRatio: "1/1", cursor: "pointer",
                      borderRadius: 8, overflow: "hidden",
                      outline: expandedId === post.id ? `2.5px solid ${P}` : "none",
                    }}>
                    {post.image ? (
                      <img src={post.image} alt={post.caption}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", background: PL, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>🐾</div>
                    )}

                    {/* Badge */}
                    {post.badge && (
                      <div style={{
                        position: "absolute", top: 5, left: 5,
                        background: "rgba(75,43,214,0.92)",
                        color: "#fff", fontSize: 8, fontWeight: 700,
                        padding: "2px 5px", borderRadius: 4,
                      }}>
                        {post.badge}
                      </div>
                    )}

                    {/* Video/album badge */}
                    {(post.isVideo || post.isAlbum) && (
                      <div style={{
                        position: "absolute", top: 5, right: 5,
                        background: "rgba(0,0,0,0.5)",
                        color: "#fff", fontSize: 10,
                        padding: "2px 4px", borderRadius: 4,
                      }}>
                        {post.isVideo ? "▶" : "⧉"}
                      </div>
                    )}

                    {/* Overlay stats */}
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0,
                      background: "linear-gradient(transparent, rgba(0,0,0,0.55))",
                      padding: "14px 5px 5px",
                      display: "flex", alignItems: "center", gap: 6,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Heart size={10} color="#fff" fill="#fff" />
                        <span style={{ fontSize: 9, color: "#fff", fontWeight: 700 }}>
                          {fmtNum(post.likes)}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <MessageCircle size={10} color="#fff" />
                        <span style={{ fontSize: 9, color: "#fff", fontWeight: 700 }}>
                          {post.comments}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* List view */
              <div style={{ padding: "0 12px 12px" }}>
                {posts.map(post => (
                  <div key={post.id}
                    onClick={() => setExpandedId(v => v === post.id ? null : post.id)}
                    style={{
                      display: "flex", gap: 12, alignItems: "center",
                      padding: "10px 0", borderBottom: `1px solid ${GB}`,
                      cursor: "pointer",
                    }}>
                    {post.image ? (
                      <img src={post.image} alt={post.caption}
                        style={{ width: 56, height: 56, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: 56, height: 56, borderRadius: 10, background: PL, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🐾</div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: DRK,
                                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {post.caption}
                      </div>
                      <div style={{ fontSize: 11, color: GT, marginTop: 3 }}>{post.date}</div>
                      <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: GT }}>
                          <Heart size={11} color="#EC4899" fill="#EC4899" /> {post.likes}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: GT }}>
                          <MessageCircle size={11} /> {post.comments}
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={16} color={GT} />
                  </div>
                ))}
              </div>
            )}

            {/* ── EXPANDED POST DETAIL ── */}
            {expandedPost && (
              <div style={{
                margin: "0 12px 16px",
                background: "#fff", borderRadius: 16,
                border: `1.5px solid ${GB}`,
                boxShadow: "0 2px 16px rgba(75,43,214,0.08)",
                overflow: "hidden",
              }}>
                {/* Post header */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px" }}>
                  {primaryDog.avatar_url ? (
                    <img src={primaryDog.avatar_url} alt={primaryDog.name}
                      style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: PL, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🐩</div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: DRK }}>{primaryDog.name}</div>
                    <div style={{ fontSize: 11, color: GT }}>@{primaryDog.slug}</div>
                  </div>
                  <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                    <MoreHorizontal size={18} color={GT} />
                  </button>
                </div>

                {/* Post image */}
                {expandedPost.image ? (
                  <img src={expandedPost.image} alt={expandedPost.caption}
                    style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }} />
                ) : (
                  <div style={{ width: "100%", aspectRatio: "1/1", background: PL, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>🐾</div>
                )}

                {/* Caption */}
                <div style={{ padding: "10px 14px 6px" }}>
                  <p style={{ fontSize: 13, color: DRK, lineHeight: 1.5, margin: 0 }}>
                    {expandedPost.caption}
                  </p>
                  <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: GT }}>
                      <Heart size={13} color="#EC4899" fill="#EC4899" />
                      {expandedPost.likes.toLocaleString("tr-TR")} beğenme
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: GT }}>
                      <MessageCircle size={13} /> {expandedPost.comments} yorum
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: GT }}>
                      <Bookmark size={13} /> {expandedPost.saves} kaydetme
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: GT, marginTop: 5 }}>{expandedPost.date}</div>
                </div>

                {/* Action buttons */}
                <div style={{ padding: "10px 14px 14px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                    <button onClick={() => showToast("Düzenleme açıldı")}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        padding: "9px 0", borderRadius: 10, border: `1.5px solid ${GB}`,
                        background: "#fff", fontSize: 12, fontWeight: 600, color: DRK,
                        cursor: "pointer", fontFamily: "inherit",
                      }}>
                      <Pencil size={13} /> Düzenle
                    </button>
                    <button onClick={() => navigate(`${BASE}/club/gonderi/${expandedPost.id}`)}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        padding: "9px 0", borderRadius: 10, border: `1.5px solid ${GB}`,
                        background: "#fff", fontSize: 12, fontWeight: 600, color: DRK,
                        cursor: "pointer", fontFamily: "inherit",
                      }}>
                      <MessageCircle size={13} /> Yorumları Gör
                    </button>
                    <button onClick={() => showToast("İstatistikler açıldı")}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        padding: "9px 0", borderRadius: 10, border: `1.5px solid ${GB}`,
                        background: "#fff", fontSize: 12, fontWeight: 600, color: DRK,
                        cursor: "pointer", fontFamily: "inherit",
                      }}>
                      <BarChart2 size={13} /> İstatistikler
                    </button>
                    <button onClick={() => showToast("Arşivlendi")}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        padding: "9px 0", borderRadius: 10, border: `1.5px solid ${GB}`,
                        background: "#fff", fontSize: 12, fontWeight: 600, color: DRK,
                        cursor: "pointer", fontFamily: "inherit",
                      }}>
                      <Archive size={13} /> Arşivle
                    </button>
                  </div>
                  {/* Delete */}
                  <button onClick={() => setDeleteTarget(expandedPost)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      padding: "10px 0", borderRadius: 10, border: "1.5px solid #EF4444",
                      background: "#fff", fontSize: 13, fontWeight: 700, color: "#EF4444",
                      cursor: "pointer", fontFamily: "inherit",
                    }}>
                    <Trash2 size={14} /> Paylaşımı Sil
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── TASLAKLAR TAB ── */}
        {activeTab === "taslaklar" && (
          <div style={{ padding: "20px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: DRK, marginBottom: 6 }}>Taslak paylaşım yok</div>
            <div style={{ fontSize: 13, color: GT }}>Tamamlanmamış paylaşımlarınız burada görünür.</div>
          </div>
        )}

        {/* ── ARŞİV TAB ── */}
        {activeTab === "arsiv" && (
          <div style={{ padding: "20px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🗃️</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: DRK, marginBottom: 6 }}>Arşivlenmiş paylaşım yok</div>
            <div style={{ fontSize: 13, color: GT }}>Gizlediğiniz paylaşımlar burada saklanır.</div>
          </div>
        )}

        {/* ── ÖZET İSTATİSTİKLER (gerçek veri) ── */}
        {activeTab === "paylasimlar" && posts.length > 0 && (
          <div style={{ margin: "0 12px 16px", borderRadius: 16, border: `1px solid ${GB}`, overflow: "hidden" }}>
            <div style={{ padding: "14px 14px 10px" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: DRK }}>Paylaşım Özeti</span>
            </div>
            <div style={{ padding: "0 14px 14px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[
                { icon: <Heart size={14} color="#EC4899" fill="#EC4899" />, label: "Beğeni",
                  value: fmtNum(posts.reduce((s, p) => s + (p.likes || 0), 0)) },
                { icon: <MessageCircle size={14} color="#3B82F6" />, label: "Yorum",
                  value: fmtNum(posts.reduce((s, p) => s + (p.comments || 0), 0)) },
                { icon: <Users size={14} color="#10B981" />, label: "Takipçi",
                  value: fmtNum(primaryDog.follower_count ?? 0) },
              ].map(s => (
                <div key={s.label} style={{ background: GBG, borderRadius: 12, padding: "10px 10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                    {s.icon}
                    <span style={{ fontSize: 10, color: GT }}>{s.label}</span>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: DRK }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CTA BANNER ── */}
        {activeTab === "paylasimlar" && (
          <div style={{
            margin: "0 12px 16px", background: PL, borderRadius: 16, padding: "16px 14px",
            display: "flex", alignItems: "flex-start", gap: 12,
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12, background: P, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Camera size={20} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: DRK, marginBottom: 4 }}>
                {primaryDog.name}'ın yeni bir anını paylaşın
              </div>
              <div style={{ fontSize: 12, color: GT, lineHeight: 1.5, marginBottom: 12 }}>
                Fotoğrafınızı ekleyin, açıklamanızı yazın ve Club'da paylaşın.
              </div>
              <button onClick={goShare}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "10px 18px", borderRadius: 12,
                  background: P, border: "none", color: "#fff",
                  fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                }}>
                <Camera size={14} /> Fotoğraf Paylaş
              </button>
            </div>
          </div>
        )}

        {/* ── ACCORDION SETTINGS ── */}
        {activeTab === "paylasimlar" && (
          <div style={{ margin: "0 12px 16px", borderRadius: 16, border: `1px solid ${GB}`, overflow: "hidden" }}>
            {ACCORDION_ITEMS.map((item, idx) => (
              <div key={item.key}>
                {idx > 0 && <div style={{ height: 1, background: GB }} />}
                <button
                  onClick={() => toggleAccordion(item.key)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 16px", background: "none", border: "none",
                    cursor: "pointer", fontFamily: "inherit",
                  }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: DRK }}>{item.label}</span>
                  {openAccordion === item.key
                    ? <ChevronUp size={16} color={GT} />
                    : <Plus size={16} color={GT} />
                  }
                </button>
                {openAccordion === item.key && (
                  <div style={{ padding: "0 16px 14px" }}>
                    <p style={{ fontSize: 12, color: GT, margin: 0 }}>
                      {item.key === "duzenleme" && "Paylaşım başlığını, açıklamasını ve etiketlerini düzenleyebilirsiniz."}
                      {item.key === "arsiv"     && "Arşivlediğiniz paylaşımları geri yükleyebilir veya taslakları tamamlayabilirsiniz."}
                      {item.key === "gizlilik"  && "Paylaşımlarınızı kimlerin göreceğini ayarlayabilirsiniz."}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        </>
        )}

        {/* ── FOOTER ── */}
        <div style={{ background: NAV, padding: "20px 16px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 22 }}>🐾</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>YourPoodle</span>
          </div>
          <div style={{ display: "flex", gap: 16, marginBottom: 10 }}>
            {["Yardım", "İletişim", "KVKK"].map(l => (
              <a key={l} href="#" style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>{l}</a>
            ))}
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>© 2026 YourPoodle</div>
        </div>
      </div>

      {primaryDog && (
      <button
        onClick={goShare}
        style={{
          position: "fixed", bottom: 80, right: 20,
          width: 52, height: 52, borderRadius: "50%",
          background: P, border: "none", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", boxShadow: "0 4px 16px rgba(93,58,26,0.4)",
          zIndex: 100,
        }}>
        <Camera size={22} />
      </button>
      )}
    </YPLayout>
  );
}
