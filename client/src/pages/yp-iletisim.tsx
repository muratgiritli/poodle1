import { useState, useEffect } from "react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

const P = "#5D3A1A";

export default function YPIletisimPage() {
  useEffect(() => { document.title = "İletişim | YourPoodle"; }, []);
  const [form, setForm] = useState({ name: "", phone: "", email: "", konu: "", mesaj: "", kvkk: false });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!form.name.trim() || !form.phone.trim() || !form.mesaj.trim() || !form.kvkk) {
      setFormError("Lütfen ad soyad, telefon, mesaj alanlarını doldurun ve KVKK onayını işaretleyin.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/contact-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || undefined,
          message: form.mesaj.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSent(true);
      } else {
        setFormError(data.message || "Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } catch {
      setFormError("Bağlantı hatası. İnternet bağlantınızı kontrol edin.");
    } finally {
      setLoading(false);
    }
  }

  const KONULAR = ["Sipariş / Kargo", "Ürün Bilgisi", "İade / Değişim", "Teknik Destek", "Diğer"];
  const CONTACT_INFO = [
    { Icon: Mail, label: "E-posta", value: "info@yourpoodle.com", href: "mailto:info@yourpoodle.com" },
    { Icon: Phone, label: "Telefon", value: "0362 000 12 34", href: "tel:+903620001234" },
    { Icon: MessageCircle, label: "WhatsApp", value: "+90 532 000 00 00", href: "https://wa.me/905320000000" },
    { Icon: MapPin, label: "Adres", value: "Türkiye genelinde hizmet", href: undefined },
  ];

  return (
    <YPLayout constrain={false}>
      <div style={{ minHeight: "100vh", background: "#FAFAFA", paddingBottom: 48 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 0" }}>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: "#111827", margin: "0 0 6px" }}>İletişim</h1>
          <p style={{ color: "#6B7280", fontSize: 15, margin: "0 0 32px" }}>Size yardımcı olmak için buradayız</p>

          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
            {/* Form */}
            <div style={{ flex: "2 1 340px", background: "#fff", borderRadius: 20, padding: 32, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
              {sent ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>✉️</div>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: "0 0 8px" }}>Mesajınız İletildi!</h2>
                  <p style={{ color: "#6B7280", fontSize: 14 }}>En kısa sürede size dönüş yapacağız.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {formError && (
                    <div style={{ background:"#FEF2F2", border:"1px solid #FCA5A5", borderRadius:10, padding:"10px 14px", marginBottom:14, fontSize:13, color:"#991B1B" }}>
                      {formError}
                    </div>
                  )}
                  {[
                    { label: "Ad Soyad *", key: "name", type: "text", placeholder: "Adınız Soyadınız" },
                    { label: "Telefon *", key: "phone", type: "tel", placeholder: "0532 000 00 00" },
                    { label: "E-posta", key: "email", type: "email", placeholder: "ornek@email.com" },
                  ].map(({ label, key, type, placeholder }) => (
                    <div key={key} style={{ marginBottom: 16 }}>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{label}</label>
                      <input type={type} value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder}
                        style={{ width: "100%", height: 48, borderRadius: 12, border: "1.5px solid #E5E7EB", padding: "0 16px", fontSize: 15, fontFamily: "inherit", boxSizing: "border-box", outline: "none" }} />
                    </div>
                  ))}

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Konu</label>
                    <select value={form.konu} onChange={e => setForm(f => ({ ...f, konu: e.target.value }))}
                      style={{ width: "100%", height: 48, borderRadius: 12, border: "1.5px solid #E5E7EB", padding: "0 14px", fontSize: 15, fontFamily: "inherit", background: "#fff", outline: "none" }}>
                      <option value="">Seçiniz</option>
                      {KONULAR.map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Mesaj *</label>
                    <textarea value={form.mesaj} onChange={e => setForm(f => ({ ...f, mesaj: e.target.value }))} placeholder="Mesajınızı yazın..."
                      style={{ width: "100%", height: 120, borderRadius: 12, border: "1.5px solid #E5E7EB", padding: "12px 16px", fontSize: 15, fontFamily: "inherit", boxSizing: "border-box", resize: "none", outline: "none" }} />
                  </div>

                  <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginBottom: 20 }}>
                    <input type="checkbox" checked={form.kvkk} onChange={e => setForm(f => ({ ...f, kvkk: e.target.checked }))}
                      style={{ marginTop: 2, accentColor: P, width: 16, height: 16, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: "#374151" }}>
                      <a href="/kvkk" style={{ color: P, fontWeight: 600 }}>KVKK Aydınlatma Metni</a>'ni okudum ve onaylıyorum.
                    </span>
                  </label>

                  <button type="submit" disabled={loading}
                    style={{ width: "100%", height: 50, borderRadius: 14, border: "none", background: loading ? "#D1D5DB" : P, color: "#fff", fontSize: 15, fontWeight: 700, cursor: loading ? "default" : "pointer", fontFamily: "inherit" }}>
                    {loading ? "Gönderiliyor…" : "Gönder"}
                  </button>
                </form>
              )}
            </div>

            {/* Info sidebar */}
            <div style={{ flex: "1 1 220px" }}>
              {CONTACT_INFO.map(({ Icon, label, value, href }) => (
                <div key={label} style={{ background: "#fff", borderRadius: 14, padding: "16px 18px", marginBottom: 12, boxShadow: "0 1px 6px rgba(0,0,0,0.05)", display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "#F5F0E6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={18} color={P} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 11, color: "#9CA3AF" }}>{label}</p>
                    {href ? (
                      <a href={href} target="_blank" rel="noreferrer" style={{ fontSize: 14, fontWeight: 600, color: "#111827", textDecoration: "none" }}>{value}</a>
                    ) : (
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#111827" }}>{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </YPLayout>
  );
}
