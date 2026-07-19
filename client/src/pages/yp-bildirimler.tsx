// YourPoodle — /yourpoodle/bildirimler — Bildirimler
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, Heart, MessageCircle, UserPlus, CheckCheck, ChevronLeft } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { useCustomer } from "@/contexts/CustomerContext";

interface Notif {
  id: number;
  type: string;
  message: string;
  is_read: boolean;
  created_at: string;
  timeAgo?: string;
  actor_name?: string;
  dog_name?: string;
  dog_slug?: string;
  post_id?: number;
}

function notifIcon(type: string) {
  switch (type) {
    case "like":         return <Heart size={16} fill="#EF4444" stroke="none" />;
    case "comment":      return <MessageCircle size={16} color="#7C3AED" />;
    case "follow":
    case "follow_request": return <UserPlus size={16} color="#2563EB" />;
    default:             return <Bell size={16} color="#9CA3AF" />;
  }
}
function notifColor(type: string) {
  switch (type) {
    case "like":           return { bg: "#FFF1F2", border: "#FECDD3" };
    case "comment":        return { bg: "#F5F0FF", border: "#DDD6FE" };
    case "follow":
    case "follow_request": return { bg: "#EFF6FF", border: "#BFDBFE" };
    default:               return { bg: "#F9FAFB", border: "#E5E7EB" };
  }
}

export default function YPBildirimlerPage() {
  const [, navigate] = useLocation();
  const { isLoggedIn } = useCustomer();
  const qc = useQueryClient();

  const { data: notifs = [], isLoading } = useQuery<Notif[]>({
    queryKey: ["/api/notifications"],
    queryFn: async () => {
      const r = await fetch("/api/notifications", { credentials: "include" });
      if (!r.ok) return [];
      return r.json();
    },
    enabled: isLoggedIn,
    staleTime: 0,
    refetchInterval: 30_000,
  });

  const readAllMutation = useMutation({
    mutationFn: () => apiRequest("PUT", "/api/notifications/read-all", {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/notifications"] }),
  });

  const readOneMutation = useMutation({
    mutationFn: (id: number) => apiRequest("PUT", `/api/notifications/${id}/read`, {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/notifications"] }),
  });

  const unread = notifs.filter(n => !n.is_read).length;

  function handleClick(n: Notif) {
    if (!n.is_read) readOneMutation.mutate(n.id);
    if (n.dog_slug) navigate(`/yourpoodle/p/${n.dog_slug}`);
  }

  if (!isLoggedIn) {
    return (
      <YPLayout activeLink="/yourpoodle/bildirimler">
        <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, fontFamily: "Inter,sans-serif" }}>
          <Bell size={52} color="#D8B4FE" style={{ marginBottom: 16 }} />
          <div style={{ fontSize: 18, fontWeight: 800, color: "#1a1a1a", marginBottom: 8 }}>Giriş Gerekli</div>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 24, textAlign: "center" }}>Bildirimlerinizi görmek için giriş yapın.</p>
          <button onClick={() => navigate("/yourpoodle/giris")}
            style={{ padding: "12px 28px", borderRadius: 12, border: "none", background: "#7C3AED", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
            Giriş Yap
          </button>
        </div>
      </YPLayout>
    );
  }

  return (
    <YPLayout activeLink="/yourpoodle/bildirimler">
      <title>Bildirimler | YourPoodle</title>
      <div style={{ maxWidth: 600, margin: "0 auto", fontFamily: "Inter,sans-serif", minHeight: "100vh", background: "#FAFAFA" }}>

        {/* Header */}
        <div style={{ background: "#fff", borderBottom: "1px solid #F0EAFF", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, position: "sticky", top: 60, zIndex: 40 }}>
          <button onClick={() => navigate(-1 as any)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#7C3AED" }}>
            <ChevronLeft size={22} />
          </button>
          <h1 style={{ fontSize: 17, fontWeight: 900, color: "#1a1a1a", margin: 0, flex: 1 }}>
            Bildirimler {unread > 0 && (
              <span style={{ fontSize: 12, background: "#7C3AED", color: "#fff", borderRadius: 10, padding: "2px 8px", marginLeft: 8, fontWeight: 800 }}>
                {unread}
              </span>
            )}
          </h1>
          {unread > 0 && (
            <button
              onClick={() => readAllMutation.mutate()}
              disabled={readAllMutation.isPending}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 10, border: "none", background: "#F5F0FF", color: "#7C3AED", fontSize: 12, fontWeight: 800, cursor: "pointer" }}>
              <CheckCheck size={13} /> Tümünü Okundu İşaretle
            </button>
          )}
        </div>

        {isLoading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 64 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", border: "3px solid #D8B4FE", borderTopColor: "#7C3AED", animation: "spin 0.8s linear infinite" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : notifs.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 32px", textAlign: "center" }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🔔</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#1a1a1a", marginBottom: 8 }}>Henüz Bildirim Yok</div>
            <p style={{ fontSize: 13, color: "#9CA3AF", maxWidth: 260 }}>
              Takipçileriniz beğeni veya yorum yaptığında burada göreceksiniz.
            </p>
            <button onClick={() => navigate("/yourpoodle/club")}
              style={{ marginTop: 20, padding: "10px 24px", borderRadius: 12, border: "none", background: "#7C3AED", color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>
              Club'a Git
            </button>
          </div>
        ) : (
          <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
            {notifs.map(n => {
              const { bg, border } = notifColor(n.type);
              return (
                <div key={n.id}
                  onClick={() => handleClick(n)}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 14px",
                    borderRadius: 14, border: `1.5px solid ${n.is_read ? "#F0F0F0" : border}`,
                    background: n.is_read ? "#fff" : bg,
                    cursor: "pointer", transition: "opacity 0.15s",
                  }}>
                  {/* Icon circle */}
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: n.is_read ? "#F3F4F6" : "#fff", border: `1.5px solid ${n.is_read ? "#E5E7EB" : border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {notifIcon(n.type)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, color: "#1a1a1a", lineHeight: 1.5, fontWeight: n.is_read ? 400 : 700 }}>
                      {n.message}
                    </div>
                    <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 3 }}>{n.timeAgo || new Date(n.created_at).toLocaleDateString("tr-TR")}</div>
                  </div>
                  {!n.is_read && (
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#7C3AED", flexShrink: 0, marginTop: 4 }} />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </YPLayout>
  );
}
