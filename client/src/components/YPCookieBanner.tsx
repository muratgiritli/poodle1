import { useState, useEffect } from "react";

const STORAGE_KEY = "yp_cookie_consent";

type ConsentLevel = "all" | "required" | null;

function getStored(): ConsentLevel {
  try { return (localStorage.getItem(STORAGE_KEY) as ConsentLevel) || null; }
  catch { return null; }
}
function setStored(v: ConsentLevel) {
  try { localStorage.setItem(STORAGE_KEY, v!); } catch {}
}

export default function YPCookieBanner() {
  const [show, setShow] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    if (!getStored()) setShow(true);
  }, []);

  const accept = (level: ConsentLevel) => {
    setStored(level);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Çerez tercihleri"
      aria-modal="true"
      style={{
        position: "fixed", bottom: 80, left: 12, right: 12, zIndex: 9999,
        background: "#fff", borderRadius: 20, padding: "20px 18px",
        boxShadow: "0 8px 40px rgba(0,0,0,0.18)", maxWidth: "var(--yp-shell-max)",
        margin: "0 auto",
        fontFamily: "'Inter',sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
        <span style={{ fontSize: 28, flexShrink: 0, lineHeight: 1 }}>🍪</span>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a", marginBottom: 4 }}>Çerez Tercihleri</div>
          <p style={{ fontSize: 12.5, color: "#555", lineHeight: 1.5, margin: 0 }}>
            Siteyi daha iyi hale getirmek için çerezler kullanıyoruz.{" "}
            <button
              onClick={() => setShowDetail(!showDetail)}
              style={{ background: "none", border: "none", color: "#5D3A1A", fontWeight: 700, cursor: "pointer", padding: 0, fontSize: 12.5, fontFamily: "'Inter',sans-serif" }}
            >
              {showDetail ? "Gizle ↑" : "Detaylar →"}
            </button>
          </p>
        </div>
      </div>

      {showDetail && (
        <div style={{ background: "#F8F7FF", borderRadius: 12, padding: "12px 14px", marginBottom: 14, fontSize: 12, color: "#555", lineHeight: 1.6 }}>
          <p style={{ margin: "0 0 8px", fontWeight: 700, color: "#333" }}>Zorunlu çerezler</p>
          <p style={{ margin: "0 0 10px" }}>Oturum yönetimi ve site güvenliği için gereklidir. Devre dışı bırakılamaz.</p>
          <p style={{ margin: "0 0 8px", fontWeight: 700, color: "#333" }}>İşlevsel çerezler</p>
          <p style={{ margin: "0 0 10px" }}>Dil tercihi, son aramalar ve profil bilgilerini hatırlamak için kullanılır.</p>
          <p style={{ margin: "0 0 8px", fontWeight: 700, color: "#333" }}>Analitik çerezler</p>
          <p style={{ margin: 0 }}>Hangi içeriklerin daha çok ilgi gördüğünü anlamamıza yardımcı olur. Kişisel veri içermez.</p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <button
          onClick={() => accept("all")}
          style={{
            height: 48, borderRadius: 12, background: "#5D3A1A", color: "#fff",
            border: "none", fontSize: 14, fontWeight: 800, cursor: "pointer",
            fontFamily: "'Inter',sans-serif",
          }}
          aria-label="Tüm çerezleri kabul et"
        >
          Tümünü Kabul Et
        </button>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => accept("required")}
            style={{
              flex: 1, height: 44, borderRadius: 12, background: "#F5F0FF",
              color: "#5D3A1A", border: "1.5px solid #E5DDD0",
              fontSize: 13, fontWeight: 700, cursor: "pointer",
              fontFamily: "'Inter',sans-serif",
            }}
            aria-label="Yalnızca zorunlu çerezler"
          >
            Zorunlu Çerezler
          </button>
          <button
            onClick={() => accept("required")}
            style={{
              flex: 1, height: 44, borderRadius: 12, background: "#F5F5F5",
              color: "#666", border: "1.5px solid #E8E8E8",
              fontSize: 13, fontWeight: 700, cursor: "pointer",
              fontFamily: "'Inter',sans-serif",
            }}
            aria-label="Tercihleri yönet"
          >
            Tercihleri Yönet
          </button>
        </div>
      </div>

      <p style={{ marginTop: 10, fontSize: 11, color: "#aaa", textAlign: "center", lineHeight: 1.4 }}>
        KVKK kapsamında kişisel verileriniz korunmaktadır.{" "}
        <a href="/kvkk" style={{ color: "#5D3A1A", textDecoration: "none" }}>KVKK Aydınlatma Metni</a>{" "}·{" "}
        <a href="/cerez-politikasi" style={{ color: "#5D3A1A", textDecoration: "none" }}>Çerez Politikası</a>
      </p>
    </div>
  );
}
