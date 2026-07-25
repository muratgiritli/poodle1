import { useEffect } from "react";
import { useLocation } from "wouter";
import { MessageCircle, ChevronLeft } from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { IS_YP } from "@/lib/store";

const BASE = IS_YP ? "" : "/yourpoodle";

export default function YPClubMesajlarPage() {
  const [, navigate] = useLocation();
  useEffect(() => { document.title = "Mesajlar | YourPoodle Club"; }, []);

  return (
    <YPLayout activeLink={`${BASE}/club`} constrain={false}>
      <div style={{ maxWidth: 600, margin: "0 auto", minHeight: "100vh", background: "#FAFAFA", fontFamily: "Inter,sans-serif" }}>

        {/* Header */}
        <div style={{
          background: "#fff", borderBottom: "1px solid #F0F0F0",
          padding: "0 16px", display: "flex", alignItems: "center", gap: 10,
          height: 56, position: "sticky", top: 60, zIndex: 40,
        }}>
          <button
            aria-label="Geri"
            onClick={() => navigate(`${BASE}/club`)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#6200EE", display: "flex", minWidth: 44, minHeight: 44, alignItems: "center", justifyContent: "center" }}>
            <ChevronLeft size={22} />
          </button>
          <h1 style={{ fontSize: 17, fontWeight: 900, color: "#1a1a1a", margin: 0, flex: 1 }}>Mesajlar</h1>
        </div>

        {/* Empty state */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", padding: "80px 32px", textAlign: "center",
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "linear-gradient(135deg,#F3EEFF,#EDE9FE)",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 20,
          }}>
            <MessageCircle size={36} color="#6200EE" strokeWidth={1.5} />
          </div>
          <div style={{ fontSize: 19, fontWeight: 900, color: "#1a1a1a", marginBottom: 8 }}>
            Henüz mesaj yok
          </div>
          <p style={{ fontSize: 14, color: "#9CA3AF", lineHeight: 1.6, maxWidth: 260, margin: "0 auto 28px" }}>
            Takip ettiğiniz Poodle sahiplerini Keşfet sekmesinde bulabilir ve sohbet başlatabilirsiniz.
          </p>
          <button
            onClick={() => navigate(`${BASE}/club`)}
            style={{
              padding: "12px 28px", borderRadius: 12, border: "none",
              background: "#6200EE", color: "#fff", fontSize: 14, fontWeight: 800,
              cursor: "pointer", fontFamily: "inherit",
            }}>
            Club'a Dön
          </button>
        </div>
      </div>
    </YPLayout>
  );
}
