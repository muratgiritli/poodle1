import { useEffect } from "react";
import { useLocation } from "wouter";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { CheckCircle, ShoppingBag, Home } from "lucide-react";

export default function YPTesekkurlerPage() {
  const [, navigate] = useLocation();

  useEffect(() => {
    document.title = "Siparişiniz Alındı | YourPoodle";
  }, []);

  const purple = "#7C3AFF";

  return (
    <YPLayout activeLink="/yourpoodle/magaza">
      <div style={{ background: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center" }}>

        {/* Success icon */}
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <CheckCircle size={44} color="#16A34A" strokeWidth={2} />
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 900, color: "#1a1a1a", margin: "0 0 10px" }}>
          Siparişiniz Alındı! 🐾
        </h1>
        <p style={{ fontSize: 15, color: "#555", maxWidth: 360, lineHeight: 1.6, margin: "0 0 8px" }}>
          Ödemeniz başarıyla işlendi. Siparişiniz en kısa sürede kargoya verilecek.
        </p>
        <p style={{ fontSize: 13, color: "#888", maxWidth: 360, lineHeight: 1.5, margin: "0 0 32px" }}>
          Sipariş detayları ve kargo takip bilgileri hesabınıza ve telefonunuza gönderilecektir.
        </p>

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 320 }}>
          <button
            onClick={() => navigate("/yourpoodle/magaza")}
            style={{
              height: 50, borderRadius: 14, border: "none",
              background: `linear-gradient(135deg,${purple},#A855F7)`,
              color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              fontFamily: "inherit",
            }}
          >
            <ShoppingBag size={18} /> Alışverişe Devam Et
          </button>
          <button
            onClick={() => navigate("/yourpoodle")}
            style={{
              height: 50, borderRadius: 14, border: `1.5px solid ${purple}`,
              background: "#fff", color: purple, fontSize: 14, fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              fontFamily: "inherit",
            }}
          >
            <Home size={18} /> YourPoodle'a Dön
          </button>
        </div>

        {/* Footer note */}
        <p style={{ marginTop: 40, fontSize: 12, color: "#bbb" }}>
          Sorularınız için: info@yourpoodle.com
        </p>
      </div>
    </YPLayout>
  );
}
