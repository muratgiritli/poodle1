// YourPoodle — /yourpoodle/club/kopekler — Köpek dizini
import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";

const CITIES = ["tumu", "İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Samsun", "Adana", "Konya", "Diğer"];
const BREED_TR: Record<string, string> = { toy: "Toy Poodle", miniature: "Minyatür Poodle", standart: "Standart Poodle", moyen: "Moyen Poodle" };

export default function YPClubKopeklerPage() {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("tumu");
  const [sort, setSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const { data: dogs = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/dogs", search, city, sort],
    queryFn: async () => {
      const p = new URLSearchParams({ sort, limit: "48" });
      if (search) p.set("search", search);
      if (city && city !== "tumu") p.set("city", city);
      const r = await fetch(`/api/dogs?${p}`);
      return r.json();
    },
  });

  return (
    <YPLayout activeLink="/yourpoodle/club">
      <div style={{ paddingBottom: 32 }}>
        {/* Header */}
        <div style={{ padding: "20px 0 16px" }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: "#1a1a1a", marginBottom: 4 }}>🐩 Köpek Dizini</h1>
          <p style={{ fontSize: 13.5, color: "#888" }}>Tüm YourPoodle köpek profilleri</p>
        </div>

        {/* Search + filter bar */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", background: "#F5F5F5", borderRadius: 12, padding: "0 14px" }}>
            <Search size={16} color="#aaa" style={{ flexShrink: 0 }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="İsim veya profil adresi ara..."
              style={{ flex: 1, padding: "11px 10px", background: "transparent", border: "none", outline: "none", fontSize: 14, fontFamily: "inherit" }} />
          </div>
          <button onClick={() => setShowFilters(f => !f)}
            style={{ width: 44, height: 44, borderRadius: 12, border: "1.5px solid", borderColor: showFilters ? "#7C3AED" : "#E5E7EB", background: showFilters ? "#F5F0FF" : "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <SlidersHorizontal size={18} color={showFilters ? "#7C3AED" : "#555"} />
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div style={{ background: "#F9FAFB", borderRadius: 14, padding: "16px", marginBottom: 16 }}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 12.5, color: "#555", marginBottom: 8 }}>Şehir</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {CITIES.map(c => (
                  <button key={c} onClick={() => setCity(c)}
                    style={{ padding: "6px 12px", borderRadius: 20, border: "1.5px solid", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                      borderColor: city === c ? "#7C3AED" : "#E5E7EB",
                      background: city === c ? "#F5F0FF" : "#fff",
                      color: city === c ? "#7C3AED" : "#555" }}>
                    {c === "tumu" ? "Tüm Şehirler" : c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 12.5, color: "#555", marginBottom: 8 }}>Sıralama</div>
              <div style={{ display: "flex", gap: 8 }}>
                {[["newest", "En Yeni"], ["popular", "En Popüler"]].map(([v, l]) => (
                  <button key={v} onClick={() => setSort(v)}
                    style={{ padding: "6px 14px", borderRadius: 20, border: "1.5px solid", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                      borderColor: sort === v ? "#7C3AED" : "#E5E7EB",
                      background: sort === v ? "#F5F0FF" : "#fff",
                      color: sort === v ? "#7C3AED" : "#555" }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Count */}
        {!isLoading && (
          <div style={{ fontSize: 13, color: "#aaa", marginBottom: 14 }}>{dogs.length} profil bulundu</div>
        )}

        {/* Loading */}
        {isLoading && (
          <div style={{ textAlign: "center", padding: "48px", color: "#aaa" }}>Yükleniyor...</div>
        )}

        {/* Grid */}
        {!isLoading && dogs.length === 0 && (
          <div style={{ textAlign: "center", padding: "64px 24px", color: "#aaa" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🐾</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#555" }}>Profil bulunamadı</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>Arama kriterlerini değiştir veya ilk profili oluştur.</div>
            <button onClick={() => navigate("/yourpoodle/p/olustur")}
              style={{ marginTop: 20, padding: "12px 24px", borderRadius: 20, border: "none", background: "linear-gradient(135deg,#7C3AED,#A855F7)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              Profil Oluştur
            </button>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }} className="yp-3col-grid">
          {dogs.map(dog => (
            <div key={dog.id} onClick={() => navigate(`/yourpoodle/p/${dog.slug}`)}
              style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #F0F0F0", overflow: "hidden", cursor: "pointer" }}>
              <div style={{ width: "100%", aspectRatio: "1", background: "#F5F0FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>
                {dog.avatar_url
                  ? <img src={dog.avatar_url} alt={dog.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : "🐩"
                }
              </div>
              <div style={{ padding: "10px 12px 14px" }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: "#1a1a1a", marginBottom: 2 }}>{dog.name}</div>
                <div style={{ fontSize: 11.5, color: "#888", marginBottom: 4 }}>
                  {BREED_TR[dog.breed] ?? dog.breed}
                  {dog.gender ? ` · ${dog.gender === "Dişi" ? "♀️" : "♂️"}` : ""}
                </div>
                {dog.city && (
                  <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "#aaa", marginBottom: 4 }}>
                    <MapPin size={10} /> {dog.city}
                  </div>
                )}
                {dog.bio && (
                  <div style={{ fontSize: 12, color: "#666", lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any }}>
                    {dog.bio}
                  </div>
                )}
                <div style={{ fontSize: 11.5, color: "#aaa", marginTop: 6 }}>👥 {dog.follower_count} takipçi</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </YPLayout>
  );
}
