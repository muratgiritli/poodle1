// YourPoodle — /yourpoodle/p/:slug — Public köpek profili
import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Share2, Grid3X3, Info, Heart, MessageCircle, Plus, Scale, Stethoscope, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { useCustomer } from "@/contexts/CustomerContext";

interface Dog {
  id: number; slug: string; name: string; breed: string; gender: string;
  birth_date?: string; weight_kg?: number; color?: string; city?: string;
  district?: string; bio?: string; avatar_url?: string; is_public: boolean;
  is_private: boolean; follower_count: number; following_count: number;
  post_count: number; private?: boolean; isOwner: boolean;
  followStatus?: "active" | "pending" | null;
}
interface Post {
  id: number; content?: string; image_urls?: string[]; like_count: number;
  comment_count: number; liked: boolean; created_at: string; timeAgo?: string;
}

function calcAge(birthDate?: string): string {
  if (!birthDate) return "";
  const b = new Date(birthDate);
  const now = new Date();
  const months = (now.getFullYear() - b.getFullYear()) * 12 + (now.getMonth() - b.getMonth());
  if (months < 12) return `${months} aylık`;
  const years = Math.floor(months / 12);
  return `${years} yaşında`;
}

function PostCard({ post, onLike }: { post: Post; onLike: (id: number) => void }) {
  const img = post.image_urls?.[0];
  return (
    <div style={{ border: "1.5px solid #F0F0F0", borderRadius: 12, overflow: "hidden", background: "#fff", marginBottom: 12 }}>
      {img && (
        <div style={{ width: "100%", aspectRatio: "1", background: "#F5F0FF", overflow: "hidden" }}>
          <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      )}
      {post.content && (
        <div style={{ padding: "10px 14px", fontSize: 13.5, color: "#333", lineHeight: 1.5 }}>{post.content}</div>
      )}
      <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", gap: 16, borderTop: "1px solid #F5F5F5" }}>
        <button onClick={() => onLike(post.id)}
          style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", fontSize: 13, color: post.liked ? "#EF4444" : "#888", fontWeight: 600, padding: 0, fontFamily: "inherit" }}>
          <Heart size={16} fill={post.liked ? "#EF4444" : "none"} stroke={post.liked ? "#EF4444" : "#888"} />
          {post.like_count}
        </button>
        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#888" }}>
          <MessageCircle size={16} /> {post.comment_count}
        </span>
        <span style={{ marginLeft: "auto", fontSize: 11, color: "#bbb" }}>{post.timeAgo}</span>
      </div>
    </div>
  );
}

export default function YPDogProfilePage({ routeSlug }: { routeSlug?: string }) {
  const [, navigate] = useLocation();
  const qc = useQueryClient();
  const { isLoggedIn } = useCustomer();
  const [activeTab, setActiveTab] = useState<"posts" | "info" | "kilo" | "veteriner">("posts");
  const [showWeightForm, setShowWeightForm] = useState(false);
  const [newWeight, setNewWeight] = useState("");
  const [newWeightNote, setNewWeightNote] = useState("");
  const [newWeightDate, setNewWeightDate] = useState(new Date().toISOString().slice(0, 10));
  const [showVetForm, setShowVetForm] = useState(false);
  const [vetDate, setVetDate] = useState(new Date().toISOString().slice(0, 10));
  const [vetName, setVetName] = useState("");
  const [vetType, setVetType] = useState("Rutin Kontrol");
  const [vetNotes, setVetNotes] = useState("");
  const [vetNextDate, setVetNextDate] = useState("");

  const { data: dog, isLoading, isError } = useQuery<Dog>({
    queryKey: [`/api/dogs/${routeSlug}`],
    queryFn: async () => {
      const r = await fetch(`/api/dogs/${routeSlug}`);
      if (!r.ok) throw new Error("Bulunamadı");
      return r.json();
    },
    enabled: !!routeSlug,
  });

  const { data: posts = [], refetch: refetchPosts } = useQuery<Post[]>({
    queryKey: [`/api/dogs/${routeSlug}/posts`],
    queryFn: async () => {
      const r = await fetch(`/api/dogs/${routeSlug}/posts`);
      return r.json();
    },
    enabled: !!routeSlug && !!dog && !dog.private,
  });

  const { data: weightLog = [], refetch: refetchWeightLog } = useQuery<any[]>({
    queryKey: [`/api/dogs/${routeSlug}/weight-log`],
    queryFn: async () => {
      const r = await fetch(`/api/dogs/${routeSlug}/weight-log`, { credentials: "include" });
      if (!r.ok) return [];
      return r.json();
    },
    enabled: !!routeSlug && !!dog?.isOwner,
    staleTime: 0,
  });

  const { data: vetVisits = [], refetch: refetchVetVisits } = useQuery<any[]>({
    queryKey: [`/api/dogs/${routeSlug}/vet-visits`],
    queryFn: async () => {
      const r = await fetch(`/api/dogs/${routeSlug}/vet-visits`, { credentials: "include" });
      if (!r.ok) return [];
      return r.json();
    },
    enabled: !!routeSlug && !!dog?.isOwner,
    staleTime: 0,
  });

  const addWeightMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/dogs/${routeSlug}/weight-log`, { weight_kg: Number(newWeight), note: newWeightNote || undefined, measured_at: newWeightDate }),
    onSuccess: () => { refetchWeightLog(); setShowWeightForm(false); setNewWeight(""); setNewWeightNote(""); setNewWeightDate(new Date().toISOString().slice(0, 10)); qc.invalidateQueries({ queryKey: [`/api/dogs/${routeSlug}`] }); },
  });

  const deleteWeightMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/dogs/${routeSlug}/weight-log/${id}`, {}),
    onSuccess: () => refetchWeightLog(),
  });

  const addVetMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/dogs/${routeSlug}/vet-visits`, { visit_date: vetDate, vet_name: vetName || undefined, visit_type: vetType, notes: vetNotes || undefined, next_visit_date: vetNextDate || undefined }),
    onSuccess: () => { refetchVetVisits(); setShowVetForm(false); setVetDate(new Date().toISOString().slice(0, 10)); setVetName(""); setVetType("Rutin Kontrol"); setVetNotes(""); setVetNextDate(""); },
  });

  const deleteVetMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/dogs/${routeSlug}/vet-visits/${id}`, {}),
    onSuccess: () => refetchVetVisits(),
  });

  const followMutation = useMutation({
    mutationFn: async () => {
      if (dog?.followStatus === "active" || dog?.followStatus === "pending") {
        await apiRequest("DELETE", `/api/dogs/${routeSlug}/follow`, {});
      } else {
        await apiRequest("POST", `/api/dogs/${routeSlug}/follow`, {});
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [`/api/dogs/${routeSlug}`] }),
  });

  const likeMutation = useMutation({
    mutationFn: (postId: number) => apiRequest("POST", `/api/club/posts/${postId}/like`, {}),
    onSuccess: () => refetchPosts(),
  });

  const share = () => {
    const url = `https://www.yourpoodle.com/yourpoodle/p/${routeSlug}`;
    if (navigator.share) {
      navigator.share({ title: `${dog?.name} | YourPoodle`, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => alert("Link kopyalandı!"));
    }
  };

  if (isLoading) return (
    <YPLayout activeLink="/yourpoodle/club">
      <div style={{ padding: "80px 24px", textAlign: "center", color: "#aaa" }}>Yükleniyor...</div>
    </YPLayout>
  );
  if (isError || !dog) return (
    <YPLayout activeLink="/yourpoodle/club">
      <div style={{ padding: "80px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
        <h2>Profil bulunamadı</h2>
      </div>
    </YPLayout>
  );

  const age = calcAge(dog.birth_date);
  const BREED_TR: Record<string, string> = { toy: "Toy Poodle", miniature: "Minyatür Poodle", standart: "Standart Poodle", moyen: "Moyen Poodle" };

  const followLabel = () => {
    if (dog.isOwner) return "Profilimi Düzenle";
    if (dog.followStatus === "active") return "✓ Takip Ediliyor";
    if (dog.followStatus === "pending") return "İstek Gönderildi";
    return dog.is_private ? "Takip İsteği Gönder" : "Takip Et";
  };

  const followBtnStyle: React.CSSProperties = {
    flex: 1, padding: "10px 0", borderRadius: 12, border: "1.5px solid",
    fontSize: 13.5, fontWeight: 800, cursor: "pointer", fontFamily: "inherit",
    borderColor: dog.followStatus === "active" ? "#E5E7EB" : "#7C3AED",
    background: dog.followStatus === "active" ? "#fff" : dog.followStatus === "pending" ? "#F5F0FF" : "linear-gradient(135deg,#7C3AED,#A855F7)",
    color: (dog.followStatus === "active" || dog.followStatus === "pending") ? "#7C3AED" : "#fff",
  };

  return (
    <YPLayout activeLink="/yourpoodle/club" constrain={false}>
      <style>{`
        .dog-photo-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 2px; }
        .dog-photo-cell { aspect-ratio: 1; overflow: hidden; background: #F5F0FF; }
        .dog-photo-cell img { width: 100%; height: 100%; object-fit: cover; }
        .dog-photo-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 24px; }
      `}</style>

      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid #f0f0f0", background: "#fff", position: "sticky", top: 60, zIndex: 50 }}>
          <button onClick={() => navigate("/yourpoodle/club")} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <ChevronLeft size={22} color="#333" />
          </button>
          <div style={{ flex: 1, textAlign: "center", fontSize: 15, fontWeight: 800, color: "#1a1a1a" }}>
            {dog.slug}
          </div>
          <button onClick={share} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <Share2 size={20} color="#555" />
          </button>
        </div>

        {/* Profile header */}
        <div style={{ padding: "20px 20px 16px", background: "#fff", borderBottom: "1px solid #f0f0f0" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 14 }}>
            {/* Avatar */}
            <div style={{ width: 84, height: 84, borderRadius: "50%", border: "3px solid #7C3AED", overflow: "hidden", flexShrink: 0, background: "#F5F0FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>
              {dog.avatar_url
                ? <img src={dog.avatar_url} alt={dog.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : "🐩"
              }
            </div>
            {/* Stats */}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 0, textAlign: "center" }}>
                {[
                  [dog.post_count, "gönderi"],
                  [dog.follower_count, "takipçi"],
                  [dog.following_count, "takip"],
                ].map(([v, l]) => (
                  <div key={l as string} style={{ flex: 1 }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: "#1a1a1a" }}>{v}</div>
                    <div style={{ fontSize: 11, color: "#888", fontWeight: 600 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Name + meta */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontWeight: 900, fontSize: 16, color: "#1a1a1a" }}>{dog.name}</div>
            <div style={{ fontSize: 13, color: "#666", marginTop: 2 }}>
              {BREED_TR[dog.breed] ?? dog.breed}
              {dog.gender && ` · ${dog.gender}`}
              {age && ` · ${age}`}
            </div>
            {(dog.city || dog.weight_kg) && (
              <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>
                {dog.city && `📍 ${dog.city}`}
                {dog.weight_kg && ` · ${dog.weight_kg} kg`}
              </div>
            )}
            {dog.bio && <div style={{ fontSize: 13.5, color: "#333", marginTop: 6, lineHeight: 1.5 }}>{dog.bio}</div>}
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            {dog.isOwner ? (
              <>
                <button onClick={() => navigate(`/yourpoodle/p/${dog.slug}/duzenle`)} style={followBtnStyle}>Profili Düzenle</button>
                <button onClick={() => navigate(`/yourpoodle/club`)}
                  style={{ width: 42, height: 42, borderRadius: 12, border: "1.5px solid #E5E7EB", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Plus size={18} color="#555" />
                </button>
              </>
            ) : (
              <>
                <button onClick={() => isLoggedIn ? followMutation.mutate() : navigate("/yourpoodle/giris")}
                  disabled={followMutation.isPending} style={followBtnStyle}>
                  {followMutation.isPending ? "..." : followLabel()}
                </button>
                <button onClick={share}
                  style={{ width: 42, height: 42, borderRadius: 12, border: "1.5px solid #E5E7EB", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Share2 size={16} color="#555" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Private notice */}
        {dog.private && !dog.isOwner && (
          <div style={{ padding: "48px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>Gizli Profil</div>
            <div style={{ fontSize: 13, color: "#888" }}>Gönderileri görmek için takip isteği gönder.</div>
          </div>
        )}

        {!dog.private && (
          <>
            {/* Tabs */}
            <div style={{ display: "flex", background: "#fff", borderBottom: "1px solid #f0f0f0", overflowX: "auto" }}>
              {([
                { id: "posts", Icon: Grid3X3, label: "Gönderiler" },
                { id: "info", Icon: Info, label: "Bilgi" },
                ...(dog.isOwner ? [
                  { id: "kilo", Icon: Scale, label: "Kilo" },
                  { id: "veteriner", Icon: Stethoscope, label: "Veteriner" },
                ] : []),
              ] as { id: string; Icon: any; label: string }[]).map(({ id, Icon, label }) => (
                <button key={id} onClick={() => setActiveTab(id as any)}
                  style={{ flexShrink: 0, padding: "12px 14px", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 12, fontWeight: 700,
                    color: activeTab === id ? "#7C3AED" : "#aaa",
                    borderBottom: activeTab === id ? "2px solid #7C3AED" : "2px solid transparent" }}>
                  <Icon size={15} /> {label}
                </button>
              ))}
            </div>

            {/* Posts grid */}
            {activeTab === "posts" && (
              posts.length === 0 ? (
                <div style={{ padding: "64px 24px", textAlign: "center", color: "#aaa" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📷</div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#555" }}>Henüz gönderi yok</div>
                  {dog.isOwner && (
                    <div style={{ fontSize: 13, marginTop: 6, color: "#888" }}>Club'a giderek ilk gönderini paylaş!</div>
                  )}
                </div>
              ) : (
                <div style={{ padding: "12px" }}>
                  {posts.map(p => <PostCard key={p.id} post={p} onLike={id => likeMutation.mutate(id)} />)}
                </div>
              )
            )}

            {/* Info tab */}
            {activeTab === "info" && (
              <div style={{ padding: "20px" }}>
                {[
                  ["Irk", dog.breed ? (({toy:"Toy Poodle",miniature:"Minyatür Poodle",standart:"Standart Poodle",moyen:"Moyen Poodle"} as any)[dog.breed] ?? dog.breed) : null],
                  ["Cinsiyet", dog.gender],
                  ["Yaş", calcAge(dog.birth_date)],
                  ["Kilo", dog.weight_kg ? `${dog.weight_kg} kg` : null],
                  ["Renk", dog.color],
                  ["Şehir", dog.city ? `${dog.city}${dog.district ? " / " + dog.district : ""}` : null],
                ].filter(([, v]) => v).map(([label, value]) => (
                  <div key={label as string} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #F5F5F5" }}>
                    <span style={{ fontSize: 13, color: "#888", fontWeight: 600 }}>{label}</span>
                    <span style={{ fontSize: 13, color: "#1a1a1a", fontWeight: 700 }}>{value as string}</span>
                  </div>
                ))}
                {!dog.city && !dog.weight_kg && !dog.color && (
                  <div style={{ textAlign: "center", padding: "32px", color: "#aaa", fontSize: 13 }}>Bilgi eklenmemiş</div>
                )}
              </div>
            )}

            {/* Weight history tab (owner only) */}
            {activeTab === "kilo" && dog.isOwner && (
              <div style={{ padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: "#1a1a1a" }}>Kilo Geçmişi</span>
                  <button onClick={() => setShowWeightForm(s => !s)}
                    style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 10, border: "none", background: "#7C3AED", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                    <Plus size={13} /> Kaydet
                  </button>
                </div>
                {showWeightForm && (
                  <div style={{ background: "#F5F0FF", borderRadius: 14, padding: 14, marginBottom: 14 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: "#555", display: "block", marginBottom: 4 }}>Kilo (kg) *</label>
                        <input type="number" step="0.1" value={newWeight} onChange={e => setNewWeight(e.target.value)}
                          placeholder="2.5" style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1.5px solid #D8B4FE", fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: "#555", display: "block", marginBottom: 4 }}>Tarih</label>
                        <input type="date" value={newWeightDate} onChange={e => setNewWeightDate(e.target.value)}
                          style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1.5px solid #D8B4FE", fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
                      </div>
                    </div>
                    <input value={newWeightNote} onChange={e => setNewWeightNote(e.target.value)}
                      placeholder="Not (opsiyonel)" style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1.5px solid #D8B4FE", fontSize: 13, fontFamily: "inherit", outline: "none", marginBottom: 10, boxSizing: "border-box" }} />
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => setShowWeightForm(false)}
                        style={{ flex: 1, padding: "8px", borderRadius: 8, border: "1.5px solid #D8B4FE", background: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", color: "#7C3AED", fontFamily: "inherit" }}>İptal</button>
                      <button onClick={() => addWeightMutation.mutate()} disabled={!newWeight || addWeightMutation.isPending}
                        style={{ flex: 2, padding: "8px", borderRadius: 8, border: "none", background: "#7C3AED", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", opacity: !newWeight ? 0.5 : 1 }}>
                        {addWeightMutation.isPending ? "Kaydediliyor…" : "Kaydet"}
                      </button>
                    </div>
                  </div>
                )}
                {weightLog.length === 0 && !showWeightForm ? (
                  <div style={{ textAlign: "center", padding: "32px", color: "#aaa", fontSize: 13 }}>
                    <Scale size={32} color="#D8B4FE" style={{ marginBottom: 8 }} />
                    <div>Henüz kilo kaydı yok.</div>
                    <div style={{ fontSize: 12, marginTop: 4 }}>Düzenli takip sağlık için önemli!</div>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {weightLog.map((entry: any, i: number) => (
                      <div key={entry.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 12, background: i === 0 ? "#F5F0FF" : "#FAFAFA", border: `1.5px solid ${i === 0 ? "#D8B4FE" : "#F0F0F0"}` }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                            <span style={{ fontSize: 18, fontWeight: 900, color: "#7C3AED" }}>{entry.weight_kg} kg</span>
                            {i === 0 && <span style={{ fontSize: 10, fontWeight: 800, color: "#7C3AED", background: "#EDE9FE", borderRadius: 6, padding: "1px 6px" }}>Güncel</span>}
                          </div>
                          <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{entry.measured_at ? new Date(entry.measured_at).toLocaleDateString("tr-TR") : ""}{entry.note ? ` · ${entry.note}` : ""}</div>
                        </div>
                        <button onClick={() => deleteWeightMutation.mutate(entry.id)}
                          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#ccc" }}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Vet visits tab (owner only) */}
            {activeTab === "veteriner" && dog.isOwner && (
              <div style={{ padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: "#1a1a1a" }}>Veteriner Ziyaretleri</span>
                  <button onClick={() => setShowVetForm(s => !s)}
                    style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 10, border: "none", background: "#7C3AED", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                    <Plus size={13} /> Ekle
                  </button>
                </div>
                {showVetForm && (
                  <div style={{ background: "#F5F0FF", borderRadius: 14, padding: 14, marginBottom: 14 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: "#555", display: "block", marginBottom: 4 }}>Ziyaret Tarihi *</label>
                        <input type="date" value={vetDate} onChange={e => setVetDate(e.target.value)}
                          style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1.5px solid #D8B4FE", fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: "#555", display: "block", marginBottom: 4 }}>Sonraki Ziyaret</label>
                        <input type="date" value={vetNextDate} onChange={e => setVetNextDate(e.target.value)}
                          style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1.5px solid #D8B4FE", fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: "#555", display: "block", marginBottom: 4 }}>Veteriner Adı</label>
                        <input value={vetName} onChange={e => setVetName(e.target.value)}
                          placeholder="Dr. Ayşe Kaya" style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1.5px solid #D8B4FE", fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: "#555", display: "block", marginBottom: 4 }}>Ziyaret Türü</label>
                        <select value={vetType} onChange={e => setVetType(e.target.value)}
                          style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1.5px solid #D8B4FE", fontSize: 13, fontFamily: "inherit", outline: "none", background: "#fff", boxSizing: "border-box" }}>
                          {["Rutin Kontrol", "Aşı", "Tıraş / Bakım", "Hastalık", "Ameliyat", "Diş", "Diğer"].map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                    <textarea value={vetNotes} onChange={e => setVetNotes(e.target.value)}
                      placeholder="Notlar (opsiyonel)" rows={2}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1.5px solid #D8B4FE", fontSize: 13, fontFamily: "inherit", outline: "none", resize: "none", marginBottom: 10, boxSizing: "border-box" }} />
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => setShowVetForm(false)}
                        style={{ flex: 1, padding: "8px", borderRadius: 8, border: "1.5px solid #D8B4FE", background: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", color: "#7C3AED", fontFamily: "inherit" }}>İptal</button>
                      <button onClick={() => addVetMutation.mutate()} disabled={!vetDate || addVetMutation.isPending}
                        style={{ flex: 2, padding: "8px", borderRadius: 8, border: "none", background: "#7C3AED", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", opacity: !vetDate ? 0.5 : 1 }}>
                        {addVetMutation.isPending ? "Kaydediliyor…" : "Kaydet"}
                      </button>
                    </div>
                  </div>
                )}
                {vetVisits.length === 0 && !showVetForm ? (
                  <div style={{ textAlign: "center", padding: "32px", color: "#aaa", fontSize: 13 }}>
                    <Stethoscope size={32} color="#D8B4FE" style={{ marginBottom: 8 }} />
                    <div>Henüz veteriner ziyareti kaydedilmemiş.</div>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {vetVisits.map((v: any) => (
                      <div key={v.id} style={{ borderRadius: 12, border: "1.5px solid #F0F0F0", overflow: "hidden" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#FAFAFA", borderBottom: v.notes ? "1px solid #F0F0F0" : "none" }}>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontSize: 10, fontWeight: 800, background: "#EDE9FE", color: "#7C3AED", borderRadius: 6, padding: "2px 8px" }}>{v.visit_type}</span>
                              <span style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a" }}>{new Date(v.visit_date).toLocaleDateString("tr-TR")}</span>
                            </div>
                            {v.vet_name && <div style={{ fontSize: 11, color: "#888", marginTop: 3 }}>👨‍⚕️ {v.vet_name}</div>}
                            {v.next_visit_date && <div style={{ fontSize: 11, color: "#16A34A", marginTop: 2 }}>📅 Sonraki: {new Date(v.next_visit_date).toLocaleDateString("tr-TR")}</div>}
                          </div>
                          <button onClick={() => deleteVetMutation.mutate(v.id)}
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#ccc" }}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                        {v.notes && <div style={{ padding: "8px 14px", fontSize: 12, color: "#555", lineHeight: 1.5 }}>{v.notes}</div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* OG meta */}
        <title>{dog.name} · {BREED_TR[dog.breed] ?? "Poodle"} | YourPoodle</title>
        <meta name="description" content={`${calcAge(dog.birth_date)} ${dog.city ? "· " + dog.city : ""} · ${dog.bio || "YourPoodle"}`} />
      </div>
    </YPLayout>
  );
}
