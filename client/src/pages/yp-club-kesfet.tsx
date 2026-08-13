// YourPoodle — /yourpoodle/club/kesfet — Keşfet sayfası
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, MapPin, UserPlus } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { useCustomer } from "@/contexts/CustomerContext";
import { IS_YP } from "@/lib/store";

const BASE = IS_YP ? "" : "/yourpoodle";

interface Dog { id: number; slug: string; name: string; breed: string; avatar_url?: string; city?: string; follower_count: number; color?: string; gender?: string; bio?: string; }
interface ExploreData { popular: any[]; newDogs: Dog[]; cities: { city: string; cnt: string }[]; }

const BREED_TR: Record<string, string> = { toy: "Toy Poodle", miniature: "Minyatür Poodle", standart: "Standart Poodle", moyen: "Moyen Poodle" };

function DogCard({ dog, onFollow }: { dog: Dog; onFollow: (slug: string) => void }) {
  const [, navigate] = useLocation();
  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #F0F0F0", overflow: "hidden", cursor: "pointer" }}>
      <div onClick={() => navigate(`${BASE}/p/${dog.slug}`)}>
        <div style={{ width: "100%", aspectRatio: "1", background: "#F5F0E6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42 }}>
          {dog.avatar_url
            ? <img src={dog.avatar_url} alt={dog.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : "🐩"
          }
        </div>
        <div style={{ padding: "10px 12px 6px" }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: "#1a1a1a", marginBottom: 2 }}>{dog.name}</div>
          <div style={{ fontSize: 11.5, color: "#888" }}>{BREED_TR[dog.breed] ?? dog.breed}</div>
          {dog.city && (
            <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "#aaa", marginTop: 3 }}>
              <MapPin size={10} /> {dog.city}
            </div>
          )}
          <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{dog.follower_count} takipçi</div>
        </div>
      </div>
      <div style={{ padding: "0 12px 12px" }}>
        <button type="button" onClick={() => onFollow(dog.slug)}
          style={{ width: "100%", padding: "8px 0", borderRadius: 10, border: "none", background: "#5D3A1A", color: "#fff", fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
          <UserPlus size={13} /> Takip Et
        </button>
      </div>
    </div>
  );
}

export default function YPClubKesfetPage() {
  const [, navigate] = useLocation();
  const { isLoggedIn } = useCustomer();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery<ExploreData>({
    queryKey: ["/api/club/explore"],
    queryFn: async () => {
      const r = await fetch("/api/club/explore", { credentials: "include" });
      return r.json();
    },
  });

  const followMutation = useMutation({
    mutationFn: (slug: string) => apiRequest("POST", `/api/dogs/${slug}/follow`, {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/club/explore"] }),
  });

  const handleFollow = (slug: string) => {
    if (!isLoggedIn) {
      navigate(`${BASE}/giris?returnTo=${encodeURIComponent(`${BASE}/club/kesfet`)}`);
      return;
    }
    followMutation.mutate(slug);
  };

  return (
    <YPLayout activeLink={`${BASE}/club`} hideFooter>
      <div style={{ paddingBottom: 32 }}>
        <div style={{ padding: "20px 0 12px" }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: "#1a1a1a", marginBottom: 4 }}>Keşfet</h1>
          <p style={{ fontSize: 13.5, color: "#888" }}>Yeni Poodle'lar keşfet, takip et.</p>
        </div>

        {isLoading && (
          <div style={{ textAlign: "center", padding: "48px", color: "#aaa" }}>Yükleniyor...</div>
        )}

        {data?.popular && data.popular.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <Heart size={16} color="#EF4444" /> Bu hafta popüler
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
              {data.popular.map(p => {
                const imgs = Array.isArray(p.image_urls) ? p.image_urls : [];
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => navigate(`${BASE}/club/gonderi/${p.id}`)}
                    style={{
                      background: "#fff", borderRadius: 12, border: "1.5px solid #F0F0F0", overflow: "hidden",
                      padding: 0, cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                    }}
                  >
                    {imgs[0] ? (
                      <div style={{ aspectRatio: "1", overflow: "hidden" }}>
                        <img src={imgs[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    ) : (
                      <div style={{ aspectRatio: "1", background: "#F5F0E6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>🐩</div>
                    )}
                    <div style={{ padding: "8px 10px" }}>
                      <div style={{ fontWeight: 700, fontSize: 12.5, color: "#1a1a1a" }}>{p.dog_name}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#EF4444", marginTop: 2 }}>
                        <Heart size={12} fill="#EF4444" /> {p.like_count}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {data?.cities && data.cities.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a", marginBottom: 12 }}>Şehre göre</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {data.cities.map(({ city, cnt }) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => navigate(`${BASE}/club/kopekler?city=${encodeURIComponent(city)}`)}
                  style={{
                    padding: "8px 16px", borderRadius: 20, border: "1.5px solid #E5E7EB", background: "#fff",
                    fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", color: "#333",
                  }}
                >
                  {city} <span style={{ color: "#aaa", fontWeight: 500 }}>({cnt})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {data?.newDogs && data.newDogs.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a" }}>Yeni katılan Poodle'lar</h2>
              <button
                type="button"
                onClick={() => navigate(`${BASE}/club/kopekler`)}
                style={{ fontSize: 13, color: "#5D3A1A", fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
              >
                Tümü →
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }} className="yp-3col-grid">
              {data.newDogs.slice(0, 6).map(dog => (
                <DogCard key={dog.id} dog={dog} onFollow={handleFollow} />
              ))}
            </div>
          </div>
        )}

        {!isLoading && !data?.newDogs?.length && !data?.popular?.length && (
          <div style={{ textAlign: "center", padding: "64px 24px", color: "#aaa" }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#555" }}>Henüz profil yok</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>İlk köpek profilini oluştur!</div>
            <button
              type="button"
              onClick={() => navigate(`${BASE}/p/olustur`)}
              style={{
                marginTop: 20, padding: "12px 24px", borderRadius: 20, border: "none",
                background: "#5D3A1A", color: "#fff", fontSize: 14, fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Profil Oluştur
            </button>
          </div>
        )}
      </div>
    </YPLayout>
  );
}
