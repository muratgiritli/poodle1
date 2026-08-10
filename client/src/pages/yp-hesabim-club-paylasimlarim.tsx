// Route: /hesabim/club-paylasimlarim
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft, Camera, MapPin, ChevronRight, ChevronDown, ChevronUp,
  Grid3X3, List, ArrowUpDown, Pencil, MessageCircle, BarChart2,
  Archive, Trash2, Heart, Bookmark, Eye, Users, Plus, X, MoreHorizontal,
} from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { useCustomer } from "@/contexts/CustomerContext";

/* ── Palette (app standard) ─────────────────── */
const P   = "#4B2BD6";
const PL  = "#F5F0E6";
const NAV = "#1D1E9B";
const GT  = "#6B7280";
const DRK = "#111827";
const GB  = "#E5E7EB";
const GBG = "#F9FAFB";

/* ── Types ───────────────────────────────────── */
type ContentTab = "paylasimlar" | "taslaklar" | "arsiv";

interface Post {
  id: string;
  image: string;
  likes: number;
  comments: number;
  saves: number;
  caption: string;
  date: string;
  badge?: string;
  isVideo?: boolean;
  isAlbum?: boolean;
}

/* ── Mock posts ──────────────────────────────── */
const POSTS: Post[] = [
  {
    id: "p1",
    image: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=300&h=300&fit=crop",
    likes: 1248, comments: 38, saves: 12,
    caption: "Tarçın bugün parkta baharın tadını çıkardı 🌸 @yourpoodle #park",
    date: "23 Temmuz 2026 14:32", badge: "Haftanın Poodlesi",
  },
  {
    id: "p2",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=300&h=300&fit=crop",
    likes: 892, comments: 21, saves: 8,
    caption: "Sahilde güzel bir gün 🌊", date: "21 Temmuz 2026 10:15",
  },
  {
    id: "p3",
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300&h=300&fit=crop",
    likes: 745, comments: 18, saves: 5,
    caption: "Kafede mola ☕", date: "19 Temmuz 2026 16:00",
  },
  {
    id: "p4",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&h=300&fit=crop",
    likes: 1105, comments: 42, saves: 19,
    caption: "Yeni tasma denemeleri 💜", date: "17 Temmuz 2026 12:44",
  },
  {
    id: "p5",
    image: "https://images.unsplash.com/photo-1516734212184-a967f81ad0d2?w=300&h=300&fit=crop",
    likes: 634, comments: 12, saves: 6,
    caption: "Makas sonrası taze görünüm ✂️", date: "15 Temmuz 2026 09:30",
  },
  {
    id: "p6",
    image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=300&h=300&fit=crop",
    likes: 1532, comments: 56, saves: 24,
    caption: "Doğum günü kutlaması 🎂", date: "12 Temmuz 2026 18:00", isAlbum: true,
  },
  {
    id: "p7",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=300&fit=crop",
    likes: 508, comments: 9, saves: 3,
    caption: "Sabah yürüyüşü 🌅", date: "10 Temmuz 2026 07:20",
  },
  {
    id: "p8",
    image: "https://images.unsplash.com/photo-1544568100-847a948583b9?w=300&h=300&fit=crop",
    likes: 977, comments: 31, saves: 14,
    caption: "Oyun vakti! 🎾", date: "8 Temmuz 2026 15:10", isVideo: true,
  },
  {
    id: "p9",
    image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=300&h=300&fit=crop",
    likes: 811, comments: 24, saves: 10,
    caption: "Kış kıyafetleri 🧥", date: "5 Temmuz 2026 11:45",
  },
];

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

/* ── Mini chart (SVG sparkline) ─────────────── */
function Sparkline() {
  const pts = [20, 35, 28, 55, 42, 70, 60, 85, 75, 90, 80, 100];
  const max = Math.max(...pts);
  const w = 110, h = 50;
  const xs = pts.map((_, i) => (i / (pts.length - 1)) * w);
  const ys = pts.map(p => h - (p / max) * h);
  const d = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ");
  const fill = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ")
    + ` L${w},${h} L0,${h} Z`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={P} stopOpacity="0.3" />
          <stop offset="100%" stopColor={P} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill="url(#sg)" />
      <path d={d} fill="none" stroke={P} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={xs[xs.length - 1]} cy={ys[ys.length - 1]} r="3" fill={P} />
    </svg>
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
  const { isLoggedIn } = useCustomer();

  const [posts, setPosts]         = useState<Post[]>(POSTS);
  const [activeTab, setActiveTab] = useState<ContentTab>("paylasimlar");
  const [viewMode, setViewMode]   = useState<"grid" | "list">("grid");
  const [expandedId, setExpandedId] = useState<string | null>("p1");
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [toast, setToast]         = useState("");

  useEffect(() => {
    if (isLoggedIn === false) navigate("/yourpoodle/giris?returnTo=/hesabim/club-paylasimlarim");
  }, [isLoggedIn]);
  if (!isLoggedIn) return null;

  const showToast = (m: string) => setToast(m);

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setPosts(ps => ps.filter(p => p.id !== deleteTarget.id));
    setExpandedId(null);
    setDeleteTarget(null);
    showToast("Paylaşım silindi");
  };

  const toggleAccordion = (key: string) =>
    setOpenAccordion(v => v === key ? null : key);

  const TAB_ITEMS: { key: ContentTab; label: string; count: number }[] = [
    { key: "paylasimlar", label: "Paylaşımlar", count: posts.length },
    { key: "taslaklar",   label: "Taslaklar",   count: 2 },
    { key: "arsiv",       label: "Arşiv",        count: 3 },
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
            <button onClick={() => navigate("/hesabim")} aria-label="Geri"
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
              onClick={() => showToast("Fotoğraf yükleme yakında")}
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
            Tarçın'ın paylaşımlarını görüntüleyin ve yönetin.
          </p>
        </div>

        {/* ── PROFİLE CARD ── */}
        <div style={{ margin: "0 12px 14px", background: GBG, borderRadius: 16, border: `1px solid ${GB}`, padding: "14px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <img
                src="https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=80&h=80&fit=crop"
                alt="Tarçın"
                style={{ width: 58, height: 58, borderRadius: "50%", objectFit: "cover",
                         border: `3px solid ${P}` }}
              />
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: DRK }}>Tarçın</span>
                <span style={{ fontSize: 16 }}>🐾</span>
              </div>
              <div style={{ fontSize: 12, color: GT }}>@tarcin.poodle</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                <MapPin size={11} color={GT} />
                <span style={{ fontSize: 11, color: GT }}>Samsun</span>
              </div>
            </div>

            {/* Profili Gör */}
            <button onClick={() => navigate("/yourpoodle/p/tarcin")}
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
              { label: "Takipçi",  value: "1.248" },
              { label: "Takip",    value: "186" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 17, fontWeight: 800, color: DRK }}>{s.value}</div>
                <div style={{ fontSize: 11, color: GT, marginTop: 1 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CONTENT TABS ── */}
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
            {viewMode === "grid" ? (
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
                    <img src={post.image} alt={post.caption}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} />

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
                    <img src={post.image} alt={post.caption}
                      style={{ width: 56, height: 56, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
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
                  <img
                    src="https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=80&h=80&fit=crop"
                    alt="Tarçın"
                    style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: DRK }}>Tarçın</div>
                    <div style={{ fontSize: 11, color: GT }}>@tarcin.poodle</div>
                  </div>
                  <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                    <MoreHorizontal size={18} color={GT} />
                  </button>
                </div>

                {/* Post image */}
                <img src={expandedPost.image} alt={expandedPost.caption}
                  style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }} />

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
                    <button onClick={() => showToast("Yorumlar açıldı")}
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
            <div style={{ fontSize: 15, fontWeight: 700, color: DRK, marginBottom: 6 }}>2 taslak paylaşım</div>
            <div style={{ fontSize: 13, color: GT }}>Tamamlanmamış paylaşımlarınız burada görünür.</div>
          </div>
        )}

        {/* ── ARŞİV TAB ── */}
        {activeTab === "arsiv" && (
          <div style={{ padding: "20px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🗃️</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: DRK, marginBottom: 6 }}>3 arşivlenmiş paylaşım</div>
            <div style={{ fontSize: 13, color: GT }}>Gizlediğiniz paylaşımlar burada saklanır.</div>
          </div>
        )}

        {/* ── SON 30 GÜN İSTATİSTİKLER ── */}
        {activeTab === "paylasimlar" && (
          <div style={{ margin: "0 12px 16px", borderRadius: 16, border: `1px solid ${GB}`, overflow: "hidden" }}>
            <div style={{ padding: "14px 14px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: DRK }}>Son 30 Gün</span>
            </div>
            <div style={{ padding: "0 14px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
              {/* Stats grid */}
              <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { icon: <Eye size={14} color={P} />,      label: "Görüntülenme", value: "12.4 B" },
                  { icon: <Heart size={14} color="#EC4899" fill="#EC4899" />, label: "Beğeni", value: "2.840" },
                  { icon: <MessageCircle size={14} color="#3B82F6" />, label: "Yorum", value: "186" },
                  { icon: <Users size={14} color="#10B981" />, label: "Yeni Takipçi", value: "+74" },
                ].map(s => (
                  <div key={s.label} style={{
                    background: GBG, borderRadius: 12, padding: "10px 10px",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                      {s.icon}
                      <span style={{ fontSize: 10, color: GT }}>{s.label}</span>
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: DRK }}>{s.value}</div>
                  </div>
                ))}
              </div>
              {/* Sparkline */}
              <div style={{ flexShrink: 0, paddingTop: 4 }}>
                <Sparkline />
              </div>
            </div>
            <button
              onClick={() => showToast("Detaylı istatistikler yakında")}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                padding: "11px 0", background: GBG, border: "none",
                borderTop: `1px solid ${GB}`,
                fontSize: 12, fontWeight: 700, color: P, cursor: "pointer", fontFamily: "inherit",
              }}>
              Detaylı İstatistikleri Gör <ChevronRight size={14} />
            </button>
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
                Tarçın'ın yeni bir anını paylaşın
              </div>
              <div style={{ fontSize: 12, color: GT, lineHeight: 1.5, marginBottom: 12 }}>
                Fotoğrafınızı ekleyin, açıklamanızı yazın ve Club'da paylaşın.
              </div>
              <button onClick={() => showToast("Fotoğraf yükleme yakında")}
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

      {/* ── FAB ── */}
      <button
        onClick={() => showToast("Fotoğraf yükleme yakında")}
        style={{
          position: "fixed", bottom: 80, right: 20,
          width: 52, height: 52, borderRadius: "50%",
          background: P, border: "none", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", boxShadow: "0 4px 16px rgba(75,43,214,0.4)",
          zIndex: 100,
        }}>
        <Camera size={22} />
      </button>
    </YPLayout>
  );
}
