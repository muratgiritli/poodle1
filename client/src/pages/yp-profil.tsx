import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { MapPin, MessageCircle } from "lucide-react";
import { MOCK_POSTS } from "@/data/clubPosts";
import { IS_YP } from "@/lib/store";

const P = "#5D3A1A";
const BASE = IS_YP ? "" : "/yourpoodle";

const PROFILES: Record<string, any> = {
  "tarcin.poodle": { display: "Tarçın'ın Annesi", avatar: "🐩", bio: "Toy Poodle annesiyim 🐾 Samsun'dan. Tarçın 2 yaşında.", location: "Samsun, Türkiye", posts: 14, followers: 128, following: 56, poodle: { name: "Tarçın", age: "2 yaş", type: "Toy Poodle" } },
  "luna.toyp": { display: "Luna'nın Ailesi", avatar: "🐾", bio: "Luna ile her gün yeni bir macera 🌸", location: "İstanbul", posts: 9, followers: 72, following: 34, poodle: { name: "Luna", age: "1 yaş", type: "Toy Poodle" } },
};

export default function YPProfilPage() {
  const [, paramsA] = useRoute("/club/profil/:username");
  const [, paramsB] = useRoute("/yourpoodle/club/profil/:username");
  const [, navigate] = useLocation();
  const params = paramsA ?? paramsB;
  const username = params?.username ?? "tarcin.poodle";
  const profile = PROFILES[username] ?? PROFILES["tarcin.poodle"];
  const [tab, setTab] = useState<"gonderiler" | "kaydedilenler">("gonderiler");
  const [following, setFollowing] = useState(false);

  useEffect(() => { document.title = `@${username} | YourPoodle Club`; }, [username]);

  return (
    <YPLayout activeLink={`${BASE}/club`} constrain={false}>
      <div style={{ minHeight: "100vh", background: "#FAFAFA", paddingBottom: 48 }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 20px 0" }}>
          {/* Profile header */}
          <div style={{ background: "#fff", borderRadius: 20, padding: 28, marginBottom: 20, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#5D3A1A,#A67C52)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, flexShrink: 0 }}>
                {profile.avatar}
              </div>
              <div style={{ flex: 1, minWidth: 180 }}>
                <p style={{ margin: "0 0 4px", fontWeight: 800, fontSize: 18, color: "#111827" }}>{profile.display}</p>
                <p style={{ margin: "0 0 8px", fontSize: 13, color: "#9CA3AF" }}>@{username}</p>
                <p style={{ margin: "0 0 8px", fontSize: 14, color: "#374151" }}>{profile.bio}</p>
                {profile.location && (
                  <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#9CA3AF", fontSize: 12, marginBottom: 16 }}>
                    <MapPin size={12} /> {profile.location}
                  </div>
                )}
                {/* Stats */}
                <div style={{ display: "flex", gap: 24 }}>
                  {[["gönderi", profile.posts], ["takipçi", profile.followers], ["takip", profile.following]].map(([l, v]) => (
                    <div key={l as string} style={{ textAlign: "center" }}>
                      <p style={{ margin: 0, fontWeight: 800, fontSize: 16, color: "#111827" }}>{v}</p>
                      <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>{l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Poodle mini card */}
            <div style={{ marginTop: 20, padding: "12px 16px", background: "#FAF7F0", borderRadius: 12, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 24 }}>🐩</span>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#111827" }}>{profile.poodle.name}</p>
                <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>{profile.poodle.age} · {profile.poodle.type}</p>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button onClick={() => setFollowing(x => !x)}
                style={{ flex: 1, height: 44, borderRadius: 12, border: "none", background: following ? "#F3F4F6" : P, color: following ? "#374151" : "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                {following ? "Takip Ediliyor" : "Takip Et"}
              </button>
              <button onClick={() => alert("Mesaj özelliği yakında!")}
                style={{ flex: 1, height: 44, borderRadius: 12, border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <MessageCircle size={16} /> Mesaj
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "2px solid #F3F4F6", marginBottom: 16 }}>
            {(["gonderiler", "kaydedilenler"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{ flex: 1, height: 44, border: "none", background: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 700, color: tab === t ? P : "#9CA3AF", borderBottom: tab === t ? `2px solid ${P}` : "2px solid transparent", marginBottom: -2 }}>
                {t === "gonderiler" ? "Gönderiler" : "Kaydedilenler"}
              </button>
            ))}
          </div>

          {/* Photo grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
            {MOCK_POSTS.map(p => (
              <div key={p.id} onClick={() => navigate(`${BASE}/club/gonderi/${p.id}`)}
                style={{ aspectRatio: "1", borderRadius: 12, background: `linear-gradient(135deg,#5D3A1A,#A67C52)`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 36, position: "relative", overflow: "hidden" }}>
                <span>{p.avatar}</span>
                <div style={{ position: "absolute", bottom: 6, right: 8, color: "rgba(255,255,255,0.9)", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", gap: 3 }}>
                  ❤️ {p.likes}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </YPLayout>
  );
}
