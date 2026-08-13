import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { MapPin, MessageCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useCustomer } from "@/contexts/CustomerContext";
import { IS_YP } from "@/lib/store";

const P = "#5D3A1A";
const BASE = IS_YP ? "" : "/yourpoodle";

interface Dog {
  id: number; slug: string; name: string; breed: string; gender?: string;
  birth_date?: string; city?: string; district?: string; bio?: string;
  avatar_url?: string; is_private: boolean; follower_count: number;
  following_count: number; post_count: number; post_count_live?: number;
  private?: boolean; isOwner: boolean; followStatus?: "active" | "pending" | null;
}

interface Post {
  id: number; content?: string; image_urls?: string[]; like_count: number;
  comment_count: number; created_at: string; timeAgo?: string;
}

function calcAge(birthDate?: string): string {
  if (!birthDate) return "";
  const b = new Date(birthDate);
  const now = new Date();
  const months = (now.getFullYear() - b.getFullYear()) * 12 + (now.getMonth() - b.getMonth());
  if (months < 12) return `${months} aylık`;
  return `${Math.floor(months / 12)} yaş`;
}

const BREED_LABELS: Record<string, string> = {
  toy: "Toy Poodle", mini: "Mini Poodle", standard: "Standard Poodle",
};

export default function YPProfilPage() {
  const [, paramsA] = useRoute("/club/profil/:username");
  const [, paramsB] = useRoute("/yourpoodle/club/profil/:username");
  const [, navigate] = useLocation();
  const qc = useQueryClient();
  const { isLoggedIn } = useCustomer();
  const params = paramsA ?? paramsB;
  const slug = params?.username ?? "";
  const [tab, setTab] = useState<"gonderiler" | "kaydedilenler">("gonderiler");

  const { data: dog, isLoading, isError } = useQuery<Dog>({
    queryKey: [`/api/dogs/${slug}`],
    queryFn: async () => {
      const r = await fetch(`/api/dogs/${slug}`);
      if (!r.ok) throw new Error("Bulunamadı");
      return r.json();
    },
    enabled: !!slug,
  });

  const { data: posts = [] } = useQuery<Post[]>({
    queryKey: [`/api/dogs/${slug}/posts`],
    queryFn: async () => {
      const r = await fetch(`/api/dogs/${slug}/posts`, { credentials: "include" });
      if (!r.ok) return [];
      return r.json();
    },
    enabled: !!slug && !!dog && !dog.private,
  });

  const followMutation = useMutation({
    mutationFn: async () => {
      if (dog?.followStatus === "active" || dog?.followStatus === "pending") {
        await apiRequest("DELETE", `/api/dogs/${slug}/follow`, {});
      } else {
        await apiRequest("POST", `/api/dogs/${slug}/follow`, {});
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [`/api/dogs/${slug}`] }),
  });

  useEffect(() => {
    document.title = slug ? `@${slug} | YourPoodle Club` : "Profil | YourPoodle Club";
  }, [slug]);

  if (!slug) {
    return (
      <YPLayout activeLink={`${BASE}/club`} constrain={false}>
        <div style={{ padding: 80, textAlign: "center", color: "#6B7280" }}>Profil bulunamadı</div>
      </YPLayout>
    );
  }

  if (isLoading) {
    return (
      <YPLayout activeLink={`${BASE}/club`} constrain={false}>
        <div style={{ padding: 80, textAlign: "center", color: "#9CA3AF" }}>Yükleniyor...</div>
      </YPLayout>
    );
  }

  if (isError || !dog) {
    return (
      <YPLayout activeLink={`${BASE}/club`} constrain={false}>
        <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🐾</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: "0 0 8px" }}>Profil bulunamadı</h2>
          <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 24px" }}>@{slug} adlı köpek profili mevcut değil.</p>
          <button onClick={() => navigate(`${BASE}/club`)}
            style={{ padding: "12px 24px", borderRadius: 12, border: "none", background: P, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            Club'a Dön
          </button>
        </div>
      </YPLayout>
    );
  }

  if (dog.private) {
    return (
      <YPLayout activeLink={`${BASE}/club`} constrain={false}>
        <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: "0 0 8px" }}>Gizli profil</h2>
          <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 24px" }}>Bu profili görmek için takip isteği göndermeniz gerekir.</p>
          {!dog.isOwner && isLoggedIn && (
            <button onClick={() => followMutation.mutate()}
              style={{ padding: "12px 24px", borderRadius: 12, border: "none", background: P, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              {dog.followStatus === "pending" ? "İstek Gönderildi" : "Takip İsteği Gönder"}
            </button>
          )}
        </div>
      </YPLayout>
    );
  }

  const postCount = dog.post_count_live ?? dog.post_count ?? posts.length;
  const location = [dog.district, dog.city].filter(Boolean).join(", ");
  const following = dog.followStatus === "active";

  return (
    <YPLayout activeLink={`${BASE}/club`} constrain={false}>
      <div style={{ minHeight: "100vh", background: "#FAFAFA", paddingBottom: 48 }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 20px 0" }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: 28, marginBottom: 20, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#5D3A1A,#A67C52)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, flexShrink: 0, overflow: "hidden" }}>
                {dog.avatar_url ? (
                  <img src={dog.avatar_url} alt={dog.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : "🐩"}
              </div>
              <div style={{ flex: 1, minWidth: 180 }}>
                <p style={{ margin: "0 0 4px", fontWeight: 800, fontSize: 18, color: "#111827" }}>{dog.name}</p>
                <p style={{ margin: "0 0 8px", fontSize: 13, color: "#9CA3AF" }}>@{slug}</p>
                {dog.bio && <p style={{ margin: "0 0 8px", fontSize: 14, color: "#374151" }}>{dog.bio}</p>}
                {location && (
                  <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#9CA3AF", fontSize: 12, marginBottom: 16 }}>
                    <MapPin size={12} /> {location}
                  </div>
                )}
                <div style={{ display: "flex", gap: 24 }}>
                  {[["gönderi", postCount], ["takipçi", dog.follower_count], ["takip", dog.following_count]].map(([l, v]) => (
                    <div key={l as string} style={{ textAlign: "center" }}>
                      <p style={{ margin: 0, fontWeight: 800, fontSize: 16, color: "#111827" }}>{v}</p>
                      <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>{l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 20, padding: "12px 16px", background: "#FAF7F0", borderRadius: 12, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 24 }}>🐩</span>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#111827" }}>{dog.name}</p>
                <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>
                  {[calcAge(dog.birth_date), BREED_LABELS[dog.breed] || dog.breed].filter(Boolean).join(" · ")}
                </p>
              </div>
            </div>

            {!dog.isOwner && (
              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <button onClick={() => { if (!isLoggedIn) { navigate(`${BASE}/giris?returnTo=${encodeURIComponent(`${BASE}/club/profil/${slug}`)}`); return; } followMutation.mutate(); }}
                  disabled={followMutation.isPending || dog.followStatus === "pending"}
                  style={{ flex: 1, height: 44, borderRadius: 12, border: "none", background: following ? "#F3F4F6" : P, color: following ? "#374151" : "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  {dog.followStatus === "pending" ? "İstek Gönderildi" : following ? "Takip Ediliyor" : "Takip Et"}
                </button>
                <button onClick={() => {
                  if (!isLoggedIn) { navigate(`${BASE}/giris?returnTo=${encodeURIComponent(`${BASE}/club/mesajlar?to=${slug}`)}`); return; }
                  navigate(`${BASE}/club/mesajlar?to=${slug}`);
                }}
                  style={{ flex: 1, height: 44, borderRadius: 12, border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <MessageCircle size={16} /> Mesaj
                </button>
              </div>
            )}
          </div>

          <div style={{ display: "flex", borderBottom: "2px solid #F3F4F6", marginBottom: 16 }}>
            {(["gonderiler", "kaydedilenler"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{ flex: 1, height: 44, border: "none", background: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 700, color: tab === t ? P : "#9CA3AF", borderBottom: tab === t ? `2px solid ${P}` : "2px solid transparent", marginBottom: -2 }}>
                {t === "gonderiler" ? "Gönderiler" : "Kaydedilenler"}
              </button>
            ))}
          </div>

          {tab === "gonderiler" ? (
            posts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 20px", color: "#9CA3AF" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📷</div>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#374151" }}>Henüz gönderi yok</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                {posts.map(p => {
                  const img = p.image_urls?.[0];
                  return (
                    <div key={p.id} onClick={() => navigate(`${BASE}/club/gonderi/${p.id}`)}
                      style={{ aspectRatio: "1", borderRadius: 12, background: img ? "#F5F0E6" : `linear-gradient(135deg,#5D3A1A,#A67C52)`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 36, position: "relative", overflow: "hidden" }}>
                      {img ? <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span>🐾</span>}
                      <div style={{ position: "absolute", bottom: 6, right: 8, color: "rgba(255,255,255,0.9)", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", gap: 3 }}>
                        ❤️ {p.like_count}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <div style={{ textAlign: "center", padding: "48px 20px", color: "#9CA3AF" }}>
              <p style={{ margin: 0, fontSize: 14 }}>Kaydedilen gönderiler yakında.</p>
            </div>
          )}
        </div>
      </div>
    </YPLayout>
  );
}
