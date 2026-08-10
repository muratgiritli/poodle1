import { useState } from "react";
import YPStaticPage from "@/components/yourpoodle/YPStaticPage";

export default function YPBayiBasvurusu() {
  const [form, setForm] = useState({ ad:"", email:"", sehir:"", magaza:"", mesaj:"" });
  const [status, setStatus] = useState<"idle"|"sending"|"ok"|"err">("idle");

  const F = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.ad || !form.email || !form.sehir) return;
    setStatus("sending");
    // mailto fallback — no server endpoint required
    const subject = encodeURIComponent("Bayi Başvurusu — " + form.magaza);
    const body = encodeURIComponent(
      `Ad: ${form.ad}\nE-posta: ${form.email}\nŞehir: ${form.sehir}\nMağaza/İşletme: ${form.magaza}\n\nMesaj:\n${form.mesaj}`
    );
    window.location.href = `mailto:info@yourpoodle.com?subject=${subject}&body=${body}`;
    setTimeout(() => setStatus("ok"), 800);
  };

  const inp: React.CSSProperties = { width:"100%", height:46, borderRadius:12, border:"1.5px solid #E5E7EB", padding:"0 14px", fontSize:14, fontFamily:"Inter,sans-serif", outline:"none", boxSizing:"border-box", background:"#FAFAFA" };
  const lbl: React.CSSProperties = { fontSize:11, fontWeight:700, color:"#6B7280", display:"block", marginBottom:6 };

  return (
    <YPStaticPage
      title="Bayi Başvurusu"
      description="YourPoodle bayi programına katılın: avantajlar, başvuru formu ve bayi iletişim bilgileri."
      updatedDate="16 Temmuz 2026"
      breadcrumb={[{ label:"Ana Sayfa", href:"/yourpoodle" }, { label:"Hakkımızda", href:"/yourpoodle/hakkinda" }, { label:"Bayi Başvurusu" }]}
    >
      <div className="sp-section">
        <h2>Bayi Programı Avantajları</h2>
        <ul>
          <li><strong>Toplu fiyatlandırma:</strong> 20+ ürünlük siparişlerde özel bayi fiyatları</li>
          <li><strong>Öncelikli stok:</strong> Yeni ürünlerde bayilere öncelikli tahsis</li>
          <li><strong>Pazarlama desteği:</strong> Dijital materyal, ürün görselleri ve içerik desteği</li>
          <li><strong>Dedicated destek:</strong> Bayi müşteri temsilcisi ile doğrudan iletişim</li>
        </ul>
      </div>

      <div className="sp-section">
        <h2>Başvuru Formu</h2>
        {status === "ok" ? (
          <div style={{ background:"#F0FFF4", border:"1.5px solid #BBF7D0", borderRadius:14, padding:"24px", textAlign:"center" }}>
            <div style={{ fontSize:32, marginBottom:10 }}>✅</div>
            <div style={{ fontSize:16, fontWeight:800, color:"#15803D" }}>Başvurunuz alındı!</div>
            <p style={{ fontSize:13.5, color:"#166534", marginTop:8 }}>E-posta istemcinizde hazırlanan mesajı gönderin. En kısa sürede dönüş yapacağız.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div>
                <label style={lbl}>Ad Soyad *</label>
                <input value={form.ad} onChange={F("ad")} placeholder="Ali Yılmaz" style={inp} required />
              </div>
              <div>
                <label style={lbl}>E-posta *</label>
                <input type="email" value={form.email} onChange={F("email")} placeholder="ali@magaza.com" style={inp} required />
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div>
                <label style={lbl}>Şehir *</label>
                <input value={form.sehir} onChange={F("sehir")} placeholder="İstanbul" style={inp} required />
              </div>
              <div>
                <label style={lbl}>Mağaza / İşletme Adı</label>
                <input value={form.magaza} onChange={F("magaza")} placeholder="Pati Pet Shop" style={inp} />
              </div>
            </div>
            <div>
              <label style={lbl}>Mesaj</label>
              <textarea value={form.mesaj} onChange={F("mesaj")} placeholder="İşletmeniz ve beklentileriniz hakkında kısaca bilgi verin..."
                rows={4} style={{ width:"100%", borderRadius:12, border:"1.5px solid #E5E7EB", padding:"12px 14px", fontSize:14, fontFamily:"Inter,sans-serif", outline:"none", boxSizing:"border-box", background:"#FAFAFA", resize:"none", lineHeight:1.6 }} />
            </div>
            <button type="submit" disabled={!form.ad || !form.email || !form.sehir || status==="sending"}
              style={{ height:50, borderRadius:14, border:"none", background:(form.ad && form.email && form.sehir) ? "#5D3A1A" : "#E5E7EB", color:(form.ad && form.email && form.sehir) ? "#fff" : "#9CA3AF", fontSize:15, fontWeight:800, cursor:(form.ad && form.email && form.sehir) ? "pointer" : "not-allowed", fontFamily:"Inter,sans-serif" }}>
              {status === "sending" ? "Gönderiliyor..." : "Başvuru Gönder"}
            </button>
          </form>
        )}
      </div>

      <div className="sp-section">
        <h2>İletişim</h2>
        <p>Bayi programı hakkında daha fazla bilgi almak için <a href="mailto:info@yourpoodle.com" style={{ color:"#5D3A1A", fontWeight:700 }}>info@yourpoodle.com</a> adresine yazabilirsiniz.</p>
      </div>
    </YPStaticPage>
  );
}
