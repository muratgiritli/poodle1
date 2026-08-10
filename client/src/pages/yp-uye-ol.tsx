import { useState } from "react";
import { useLocation } from "wouter";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { Eye, EyeOff, CheckCircle, ChevronLeft } from "lucide-react";

const P  = "#5D3A1A";
const PD = "#5B18A8";
const BG = "#FAFAFA";
const BORDER = "#E5E7EB";
const ERR = "#EF4444";

export default function YPUyeOlPage() {
  const [, navigate] = useLocation();

  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", password2: "", kvkk: false,
  });
  const [showPw, setShowPw]   = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [errors, setErrors]   = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState(false);

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm(f => ({ ...f, [k]: v }));

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim())                  e.name     = "Ad soyad zorunlu";
    if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) e.email = "Geçerli e-posta girin";
    if (!form.phone.match(/^\+?[\d\s\-]{10,}$/))   e.phone = "Geçerli telefon girin";
    if (form.password.length < 6)           e.password = "Şifre en az 6 karakter olmalı";
    if (form.password !== form.password2)   e.password2= "Şifreler eşleşmiyor";
    if (!form.kvkk)                         e.kvkk     = "KVKK onayı zorunlu";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch("/api/customer/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          password: form.password,
        }),
      });
      const data = await res.json();
      if (res.status === 201) {
        setSuccess(true);
        setTimeout(() => navigate("/hesabim"), 1800);
      } else if (res.status === 409) {
        setErrors({ phone: data.message || "Bu telefon numarası zaten kayıtlı" });
      } else if (res.status === 429) {
        setErrors({ form: "Çok fazla deneme. Lütfen daha sonra tekrar deneyin." });
      } else {
        setErrors({ form: data.message || "Kayıt sırasında bir hata oluştu." });
      }
    } catch {
      setErrors({ form: "Bağlantı hatası. İnternet bağlantınızı kontrol edin." });
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <YPLayout authMode constrain={false}>
        <div style={{ minHeight:"80vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24 }}>
          <div style={{ width:72, height:72, borderRadius:"50%", background:"#DCFCE7", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20 }}>
            <CheckCircle size={36} color="#10B981" />
          </div>
          <h2 style={{ fontSize:22, fontWeight:800, color:"#111827", margin:"0 0 8px", textAlign:"center" }}>Üyeliğiniz Oluşturuldu!</h2>
          <p style={{ fontSize:14, color:"#6B7280", textAlign:"center", margin:0 }}>Hesabınıza yönlendiriliyorsunuz…</p>
        </div>
      </YPLayout>
    );
  }

  const Field = ({
    label, name, type = "text", value, onChange, error, right,
  }: {
    label: string; name: string; type?: string;
    value: string; onChange: (v: string) => void;
    error?: string; right?: React.ReactNode;
  }) => (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display:"block", fontSize:13, fontWeight:600, color:"#374151", marginBottom:6 }}>{label}</label>
      <div style={{ position:"relative" }}>
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            width:"100%", height:48, borderRadius:12,
            border: `1.5px solid ${error ? ERR : BORDER}`,
            paddingLeft:16, paddingRight: right ? 44 : 16,
            fontSize:15, color:"#111827", background:"#fff",
            fontFamily:"Inter,sans-serif", outline:"none",
            boxSizing:"border-box",
          }}
          onFocus={e => (e.currentTarget.style.borderColor = P)}
          onBlur={e  => (e.currentTarget.style.borderColor = error ? ERR : BORDER)}
        />
        {right && (
          <div style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", cursor:"pointer", color:"#9CA3AF" }}>
            {right}
          </div>
        )}
      </div>
      {error && <p style={{ margin:"4px 0 0", fontSize:12, color:ERR }}>{error}</p>}
    </div>
  );

  return (
    <YPLayout authMode constrain={false}>
      <div style={{ minHeight:"100vh", background:BG, paddingBottom:48 }}>
        <div style={{ maxWidth:480, margin:"0 auto", padding:"0 20px" }}>

          {/* Back link */}
          <button onClick={() => navigate("/giris")}
            style={{ display:"flex", alignItems:"center", gap:4, marginTop:24, marginBottom:8, background:"none", border:"none", cursor:"pointer", color:"#6B7280", fontSize:13, fontWeight:600, padding:0, fontFamily:"inherit" }}>
            <ChevronLeft size={16} />
            Giriş Yap
          </button>

          {/* Card */}
          <div style={{ background:"#fff", borderRadius:20, padding:32, boxShadow:"0 2px 16px rgba(0,0,0,0.08)", marginTop:8 }}>
            {/* Header */}
            <div style={{ textAlign:"center", marginBottom:28 }}>
              <img src="/images/brand/logo.png" alt="YourPoodle" style={{ height: 40, width: "auto", display: "block", margin: "0 auto" }} />
              <h1 style={{ fontSize:20, fontWeight:800, color:"#111827", margin:"12px 0 4px" }}>Ücretsiz Üye Ol</h1>
              <p style={{ fontSize:13, color:"#6B7280", margin:0 }}>Poodle topluluğuna katılın</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <Field label="Ad Soyad" name="name" value={form.name}
                onChange={v => set("name", v)} error={errors.name} />

              <Field label="E-posta" name="email" type="email" value={form.email}
                onChange={v => set("email", v)} error={errors.email} />

              <Field label="Telefon" name="phone" type="tel" value={form.phone}
                onChange={v => set("phone", v)} error={errors.phone} />

              <Field label="Şifre" name="password"
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={v => set("password", v)}
                error={errors.password}
                right={
                  <span onClick={() => setShowPw(x => !x)}>
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                }
              />

              <Field label="Şifre Tekrar" name="password2"
                type={showPw2 ? "text" : "password"}
                value={form.password2}
                onChange={v => set("password2", v)}
                error={errors.password2}
                right={
                  <span onClick={() => setShowPw2(x => !x)}>
                    {showPw2 ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                }
              />

              {/* KVKK */}
              <div style={{ marginBottom:24 }}>
                <label style={{ display:"flex", alignItems:"flex-start", gap:10, cursor:"pointer" }}>
                  <input type="checkbox" checked={form.kvkk}
                    onChange={e => set("kvkk", e.target.checked)}
                    style={{ marginTop:2, accentColor:P, width:16, height:16, flexShrink:0 }} />
                  <span style={{ fontSize:12.5, color:"#374151", lineHeight:1.5 }}>
                    <a href="/yourpoodle/gizlilik-politikasi" target="_blank"
                      style={{ color:P, textDecoration:"none", fontWeight:600 }}>Gizlilik Politikası</a>
                    {" "}ve{" "}
                    <a href="/yourpoodle/kullanim-sartlari" target="_blank"
                      style={{ color:P, textDecoration:"none", fontWeight:600 }}>Kullanım Şartları</a>
                    {" "}kapsamında kişisel verilerimin işlenmesini onaylıyorum.
                  </span>
                </label>
                {errors.kvkk && <p style={{ margin:"4px 0 0 26px", fontSize:12, color:ERR }}>{errors.kvkk}</p>}
              </div>

              {/* Form-level error */}
              {errors.form && (
                <p style={{ margin:"-8px 0 12px", fontSize:13, color:"#EF4444", textAlign:"center" }}>{errors.form}</p>
              )}

              {/* Submit */}
              <button type="submit" disabled={submitting}
                style={{
                  width:"100%", height:52, borderRadius:14, border:"none",
                  background: submitting ? "#D1D5DB" : `linear-gradient(135deg,${P},#A67C52)`,
                  color:"#fff", fontSize:16, fontWeight:700, cursor: submitting ? "default" : "pointer",
                  fontFamily:"inherit", transition:"background 0.2s",
                }}
                onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = `linear-gradient(135deg,${PD},${P})`; }}
                onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = `linear-gradient(135deg,${P},#A67C52)`; }}>
                {submitting ? "Hesap oluşturuluyor…" : "Üye Ol"}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display:"flex", alignItems:"center", gap:12, margin:"20px 0" }}>
              <div style={{ flex:1, height:1, background:BORDER }} />
              <span style={{ fontSize:12, color:"#9CA3AF" }}>veya</span>
              <div style={{ flex:1, height:1, background:BORDER }} />
            </div>

            {/* Social buttons */}
            {["🇬 Google ile Kayıt Ol", "🍎 Apple ile Kayıt Ol"].map(label => (
              <button key={label}
                onClick={() => {
                  const btn = document.activeElement as HTMLButtonElement;
                  if (btn) btn.blur();
                  const msg = document.createElement("span");
                  msg.textContent = "Sosyal giriş yakında aktif olacak!";
                }}
                style={{
                  width:"100%", height:48, borderRadius:12, border:`1.5px solid ${BORDER}`,
                  background:"#fff", fontSize:14, fontWeight:600, color:"#374151",
                  cursor:"pointer", fontFamily:"inherit", marginBottom:10,
                  display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                }}>
                {label}
              </button>
            ))}

            {/* Login link */}
            <p style={{ textAlign:"center", margin:"16px 0 0", fontSize:13, color:"#6B7280" }}>
              Hesabınız var mı?{" "}
              <button onClick={() => navigate("/giris")}
                style={{ background:"none", border:"none", color:P, fontWeight:700, cursor:"pointer", fontSize:13, padding:0, fontFamily:"inherit" }}>
                Giriş Yap
              </button>
            </p>
          </div>
        </div>
      </div>
    </YPLayout>
  );
}
