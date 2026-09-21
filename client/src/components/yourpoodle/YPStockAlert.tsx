import { useState } from "react";
import { Bell } from "lucide-react";
import { useCustomer } from "@/contexts/CustomerContext";
import { apiRequest } from "@/lib/queryClient";

const P = "#5D3A1A";
const PL = "#F5F0E6";
const GB = "#E8E0D4";

function alreadyAsked(productId: number) {
  try {
    return sessionStorage.getItem(`yp_stock_alert_${productId}`) === "1";
  } catch {
    return false;
  }
}

export default function YPStockAlert({
  productId,
  productName,
}: {
  productId: number;
  productName: string;
}) {
  const { customer } = useCustomer();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(customer?.name || "");
  const [phone, setPhone] = useState(customer?.phone || "");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(() => alreadyAsked(productId));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (sending) return;
    if (name.trim().length < 2) { setError("Lütfen adınızı yazın."); return; }
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) { setError("Geçerli bir telefon numarası yazın."); return; }

    setError(null);
    setSending(true);
    try {
      await apiRequest("POST", "/api/stock-alerts", {
        productId,
        customerName: name.trim().slice(0, 100),
        phone: digits.slice(0, 20),
        productName: productName.slice(0, 300),
      });
      try { sessionStorage.setItem(`yp_stock_alert_${productId}`, "1"); } catch { /* ignore */ }
      setSent(true);
      setOpen(false);
    } catch {
      setError("Kayıt alınamadı. Lütfen tekrar deneyin.");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <p style={{
        margin: "0 0 16px", padding: "11px 13px", borderRadius: 12,
        background: "#EDF6EE", border: "1px solid #CBE5CF",
        fontSize: 13, color: "#256A34", lineHeight: 1.5,
      }}>
        Stoğa girince sizi arayacağız veya WhatsApp’tan yazacağız.
      </p>
    );
  }

  return (
    <div style={{ marginBottom: 16 }}>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          style={{
            width: "100%", minHeight: 48, display: "inline-flex", alignItems: "center",
            justifyContent: "center", gap: 8, border: `1.5px solid ${P}`, borderRadius: 12,
            background: PL, color: P, fontFamily: "inherit", fontSize: 14, fontWeight: 800,
            cursor: "pointer",
          }}
        >
          <Bell size={16} /> Gelince haber ver
        </button>
      ) : (
        <form
          onSubmit={submit}
          style={{ background: "#fff", border: `1px solid ${GB}`, borderRadius: 14, padding: 14 }}
        >
          <p style={{ margin: "0 0 12px", fontSize: 13, color: "#5C4B3A", lineHeight: 1.5 }}>
            Ürün tekrar stoğa girdiğinde sizi haberdar edelim.
          </p>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Adınız"
            maxLength={100}
            style={{
              width: "100%", minHeight: 42, marginBottom: 8, padding: "0 12px",
              border: `1px solid ${GB}`, borderRadius: 10, background: "#FFFCF8",
              fontFamily: "inherit", fontSize: 14, boxSizing: "border-box",
            }}
          />
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="05xx xxx xx xx"
            inputMode="tel"
            maxLength={20}
            style={{
              width: "100%", minHeight: 42, marginBottom: 10, padding: "0 12px",
              border: `1px solid ${GB}`, borderRadius: 10, background: "#FFFCF8",
              fontFamily: "inherit", fontSize: 14, boxSizing: "border-box",
            }}
          />
          {error && <p style={{ margin: "0 0 10px", fontSize: 12.5, fontWeight: 650, color: "#B4271C" }}>{error}</p>}
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="submit"
              disabled={sending}
              style={{
                flex: 1, minHeight: 42, border: "none", borderRadius: 11,
                background: sending ? "#9A8B7A" : P, color: "#fff",
                fontFamily: "inherit", fontSize: 13.5, fontWeight: 750,
                cursor: sending ? "progress" : "pointer",
              }}
            >
              {sending ? "Kaydediliyor…" : "Beni haberdar et"}
            </button>
            <button
              type="button"
              onClick={() => { setOpen(false); setError(null); }}
              style={{
                minHeight: 42, padding: "0 14px", border: `1px solid ${GB}`, borderRadius: 11,
                background: "#fff", color: "#5C4B3A", fontFamily: "inherit",
                fontSize: 13.5, fontWeight: 700, cursor: "pointer",
              }}
            >
              Vazgeç
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
