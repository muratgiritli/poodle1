import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Loader2, Phone, MapPin, User, Home } from "lucide-react";
import { useCustomer } from "@/contexts/CustomerContext";
import { apiRequest } from "@/lib/queryClient";
import { CITY_LIST, getDistricts } from "@/lib/turkey-cities";

/* ─── Design tokens ─────────────────────────────────────── */
const C = {
  primary:      "#7C3AED",
  primaryHover: "#6D28D9",
  bg:           "#FAF8F5",
  card:         "#FFFFFF",
  text:         "#1A1A2E",
  muted:        "#6B7280",
  light:        "#9CA3AF",
  border:       "#E5E7EB",
} as const;

/* ─── CSS ────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  .auth-root { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }

  @keyframes auth-spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
  .auth-spin { animation: auth-spin 1s linear infinite; }

  .auth-inp {
    width: 100%; height: 48px; border: 1px solid ${C.border}; border-radius: 10px;
    padding: 0 14px; font-size: 15px; font-family: inherit; outline: none;
    background: #fff; color: ${C.text}; transition: border-color .15s, box-shadow .15s;
  }
  .auth-inp:focus { border-color: ${C.primary}; box-shadow: 0 0 0 3px rgba(124,58,237,.13); }
  .auth-inp::placeholder { color: ${C.light}; }

  .auth-btn {
    width: 100%; height: 50px; background: ${C.primary}; color: #fff; border: none;
    border-radius: 12px; font-size: 15px; font-weight: 700; font-family: inherit;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    gap: 8px; transition: background .15s;
  }
  .auth-btn:hover:not(:disabled) { background: ${C.primaryHover}; }
  .auth-btn:disabled { opacity: .55; cursor: not-allowed; }

  .auth-tab-bar { display: flex; border-bottom: 2px solid ${C.border}; }
  .auth-tab {
    flex: 1; padding: 14px 0; text-align: center; background: none; border: none;
    font-size: 15px; font-family: inherit; cursor: pointer; position: relative;
    color: ${C.muted}; font-weight: 600;
  }
  .auth-tab.active { color: ${C.primary}; }
  .auth-tab.active::after {
    content: ''; position: absolute; bottom: -2px; left: 0; right: 0; height: 2px;
    background: ${C.primary}; border-radius: 2px 2px 0 0;
  }

  .otp-boxes { display: flex; gap: 12px; justify-content: center; }
  .otp-box {
    width: 60px; height: 64px; border: 2px solid ${C.border}; border-radius: 12px;
    text-align: center; font-size: 26px; font-weight: 800; font-family: inherit;
    outline: none; color: ${C.text}; transition: border-color .15s;
  }
  .otp-box:focus { border-color: ${C.primary}; box-shadow: 0 0 0 3px rgba(124,58,237,.13); }

  .auth-link { background: none; border: none; cursor: pointer; font-family: inherit;
    font-size: 13px; color: ${C.muted}; padding: 0; }
  .auth-link.purple { color: ${C.primary}; font-weight: 700; }

  .auth-shell {
    display: flex; min-height: 100vh; min-height: 100dvh;
  }
  .auth-left { display: none; }
  .auth-right {
    flex: 1; background: ${C.bg}; display: flex; flex-direction: column;
    align-items: center; justify-content: center; position: relative; padding: 24px 16px;
    min-height: 100vh; min-height: 100dvh;
  }

  .field-row { margin-bottom: 14px; }
  .field-label {
    display: flex; align-items: center; gap: 6px;
    font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;
  }
  .field-label svg { color: ${C.primary}; }

  .phone-wrap {
    display: flex; border: 1px solid ${C.border}; border-radius: 10px;
    overflow: hidden; background: #fff; transition: border-color .15s, box-shadow .15s;
  }
  .phone-wrap:focus-within { border-color: ${C.primary}; box-shadow: 0 0 0 3px rgba(124,58,237,.13); }
  .phone-prefix {
    display: flex; align-items: center; gap: 5px; padding: 0 12px;
    border-right: 1px solid ${C.border}; background: #F9FAFB; height: 48px; flex-shrink: 0;
    font-size: 13px; font-weight: 700; color: ${C.text};
  }

  @media (min-width: 900px) {
    .auth-left {
      display: flex; flex-direction: column; width: 45%; position: relative; overflow: hidden;
    }
    .auth-left img {
      position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
    }
    .auth-left-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to top, rgba(76,29,149,.85) 0%, rgba(76,29,149,.3) 60%, transparent 100%);
    }
    .auth-left-content {
      position: absolute; bottom: 40px; left: 40px; right: 40px; z-index: 1; color: #fff;
    }
    .auth-right { width: 55%; }
  }
`;

/* ─── Toast ─────────────────────────────────────────────── */
function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3500); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
      background: "#1a1a1a", color: "#fff", padding: "12px 20px", borderRadius: 12,
      fontSize: 14, fontWeight: 600, zIndex: 9999, maxWidth: "90vw", textAlign: "center",
      boxShadow: "0 4px 20px rgba(0,0,0,.3)", fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif"
    }}>{msg}</div>
  );
}

/* ─── Phone formatter ────────────────────────────────────── */
function fmtPhone(v: string) {
  const d = v.replace(/\D/g, "");
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0,3)} ${d.slice(3)}`;
  if (d.length <= 8) return `${d.slice(0,3)} ${d.slice(3,6)} ${d.slice(6)}`;
  return `${d.slice(0,3)} ${d.slice(3,6)} ${d.slice(6,8)} ${d.slice(8,10)}`;
}

/* ─── OTP Screen ─────────────────────────────────────────── */
function OtpScreen({
  phone, onSuccess, onBack, setToast, registrationData
}: {
  phone: string;
  onSuccess: () => void;
  onBack: () => void;
  setToast: (m: string) => void;
  registrationData?: { name: string; city: string; district: string; address: string };
}) {
  const { loginWithOtp } = useCustomer();
  const [otp, setOtp]     = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [countdown, setCd]  = useState(60);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const vfyRef  = useRef(false);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCd(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  useEffect(() => { setTimeout(() => otpRefs.current[0]?.focus(), 150); }, []);

  const doVerify = async (code: string) => {
    const local = phone.replace(/\D/g, "");
    setError(""); setLoading(true);
    try {
      const data = await loginWithOtp(
        local, code,
        registrationData?.name,
        registrationData?.address,
        registrationData?.city,
        registrationData?.district,
      );
      if (data?.requiresRegistration) {
        setError("Hesap oluşturulamadı. Lütfen tekrar deneyin.");
        vfyRef.current = false;
        return;
      }
      const firstName = (registrationData?.name || data?.name || "").split(" ")[0];
      setToast(firstName ? `Hoş geldin, ${firstName}! 🎉` : "Başarıyla giriş yapıldı!");
      setTimeout(onSuccess, 300);
    } catch (e: any) {
      let msg = "Doğrulama kodu hatalı";
      try { msg = JSON.parse(e.message.replace(/^\d+:\s*/, "")).message; } catch {}
      setError(msg);
      vfyRef.current = false;
    } finally { setLoading(false); }
  };

  const resend = async () => {
    const local = phone.replace(/\D/g, "");
    try {
      await apiRequest("POST", "/api/otp/send", { phone: local });
      setCd(60); setOtp(["", "", "", ""]); setError(""); vfyRef.current = false;
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (e: any) {
      let msg = "SMS gönderilemedi";
      try { msg = JSON.parse(e.message.replace(/^\d+:\s*/, "")).message; } catch {}
      setError(msg);
    }
  };

  const handleOtpChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    if (val.length > 1) {
      const digits = val.replace(/\D/g, "").split("");
      const next = ["", "", "", ""].map((_, i) => digits[i] || "");
      setOtp(next);
      otpRefs.current[Math.min(digits.length - 1, 3)]?.focus();
      if (next.every(d => d) && !vfyRef.current) { vfyRef.current = true; setTimeout(() => doVerify(next.join("")), 150); }
      return;
    }
    const next = [...otp]; next[idx] = val; setOtp(next);
    if (val && idx < 3) otpRefs.current[idx + 1]?.focus();
    if (next.every(d => d) && !vfyRef.current) { vfyRef.current = true; setTimeout(() => doVerify(next.join("")), 150); }
  };

  return (
    <div>
      {/* Back */}
      <button type="button" onClick={onBack}
        style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 13, padding: 0, marginBottom: 20, display: "flex", alignItems: "center", gap: 4, fontFamily: "inherit" }}>
        ← Numarayı değiştir
      </button>

      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>📱</div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: C.text, margin: "0 0 6px" }}>SMS Kodu Gir</h2>
        <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>
          <strong style={{ color: C.text }}>+90 {phone}</strong> numarasına 4 haneli kod gönderildi
        </p>
      </div>

      {/* OTP boxes */}
      <div className="otp-boxes" style={{ marginBottom: 16 }}>
        {otp.map((d, i) => (
          <input key={i} ref={el => { otpRefs.current[i] = el; }} className="otp-box"
            type="tel" inputMode="numeric" maxLength={1} value={d}
            onChange={e => handleOtpChange(i, e.target.value)}
            onKeyDown={e => { if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus(); }}
            autoComplete={i === 0 ? "one-time-code" : "off"}
          />
        ))}
      </div>

      {error && <p style={{ fontSize: 12, color: "#EF4444", textAlign: "center", marginBottom: 12 }}>{error}</p>}

      {countdown > 0
        ? <p style={{ fontSize: 12, color: C.light, textAlign: "center", marginBottom: 16 }}>
            Kod {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, "0")} içinde geçerli
          </p>
        : <div style={{ textAlign: "center", marginBottom: 16 }}>
            <button className="auth-link purple" onClick={resend} disabled={loading}>Kodu tekrar gönder</button>
          </div>
      }

      <button className="auth-btn" onClick={() => { if (!vfyRef.current) { vfyRef.current = true; doVerify(otp.join("")); } }} disabled={loading || otp.some(d => !d)}>
        {loading && <Loader2 size={16} className="auth-spin" />}
        {loading ? "Doğrulanıyor..." : "Onayla"}
      </button>
    </div>
  );
}

/* ─── Login Tab ──────────────────────────────────────────── */
function LoginTab({ setToast, onDone }: { setToast: (m: string) => void; onDone: () => void }) {
  const [phone, setPhone]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [phase, setPhase]   = useState<"phone" | "otp">("phone");

  const sendOtp = async () => {
    const local = phone.replace(/\D/g, "");
    if (!local.startsWith("5") || local.length < 10) { setError("Geçerli bir numara girin (5XX XXX XX XX)"); return; }
    setError(""); setLoading(true);
    try {
      let deviceToken: string | undefined;
      try { const t = JSON.parse(localStorage.getItem("jetgo_trusted_devices") || "{}"); deviceToken = t[local]; } catch {}
      const res  = await apiRequest("POST", "/api/otp/send", { phone: local, deviceToken });
      const data = await res.json();
      if (data.trustedLogin) { setToast("Hoş geldin! 🎉"); setTimeout(onDone, 300); return; }
      setPhase("otp");
    } catch (e: any) {
      let msg = "SMS gönderilemedi";
      try { msg = JSON.parse(e.message.replace(/^\d+:\s*/, "")).message; } catch {}
      setError(msg);
    } finally { setLoading(false); }
  };

  if (phase === "otp") return (
    <OtpScreen phone={phone} onSuccess={onDone} onBack={() => setPhase("phone")} setToast={setToast} />
  );

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🐾</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, margin: "0 0 6px" }}>Tekrar Hoş Geldin!</h2>
        <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>Telefon numaranla SMS kodu ile giriş yap</p>
      </div>

      <div className="field-row">
        <label className="field-label"><Phone size={14} /> Cep Telefonu</label>
        <div className="phone-wrap">
          <div className="phone-prefix"><span style={{ fontSize: 18 }}>🇹🇷</span> +90</div>
          <input className="auth-inp" style={{ border: "none", borderRadius: 0, height: 48, flex: 1 }}
            type="tel" inputMode="numeric" maxLength={13} placeholder="5XX XXX XX XX"
            value={phone} onChange={e => { setPhone(fmtPhone(e.target.value)); setError(""); }}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); sendOtp(); } }}
          />
        </div>
      </div>

      {error && <p style={{ fontSize: 12, color: "#EF4444", marginBottom: 12 }}>{error}</p>}

      <button className="auth-btn" onClick={sendOtp} disabled={loading} style={{ marginTop: 4 }}>
        {loading && <Loader2 size={16} className="auth-spin" />}
        {loading ? "Gönderiliyor..." : "SMS Kodu Gönder"}
      </button>
    </div>
  );
}

/* ─── Register Tab ───────────────────────────────────────── */
function RegisterTab({ setToast, onDone }: { setToast: (m: string) => void; onDone: () => void }) {
  const [phase, setPhase] = useState<"form" | "otp">("form");
  const [name, setName]       = useState("");
  const [city, setCity]       = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const submitForm = async () => {
    if (!name.trim() || name.trim().length < 2) { setError("Ad Soyad en az 2 karakter olmalı"); return; }
    if (!city.trim()) { setError("Şehir girin"); return; }
    if (!district.trim()) { setError("İlçe girin"); return; }
    if (!address.trim()) { setError("Adres girin"); return; }
    const local = phone.replace(/\D/g, "");
    if (!local.startsWith("5") || local.length < 10) { setError("Geçerli bir telefon numarası girin (5XX XXX XX XX)"); return; }

    setError(""); setLoading(true);
    try {
      const res  = await apiRequest("POST", "/api/otp/send", { phone: local });
      const data = await res.json();
      if (data.trustedLogin) { setToast(`Hoş geldin! 🎉`); setTimeout(onDone, 300); return; }
      setPhase("otp");
    } catch (e: any) {
      let msg = "SMS gönderilemedi";
      try { msg = JSON.parse(e.message.replace(/^\d+:\s*/, "")).message; } catch {}
      setError(msg);
    } finally { setLoading(false); }
  };

  if (phase === "otp") return (
    <OtpScreen
      phone={phone}
      onSuccess={onDone}
      onBack={() => setPhase("form")}
      setToast={setToast}
      registrationData={{ name: name.trim(), city: city.trim(), district: district.trim(), address: address.trim() }}
    />
  );

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 36, marginBottom: 6 }}>🐩</div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: C.text, margin: "0 0 4px" }}>Ücretsiz Üye Ol</h2>
        <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>Bilgilerini doldur, SMS ile doğrula</p>
      </div>

      {/* Ad Soyad */}
      <div className="field-row">
        <label className="field-label"><User size={13} /> Ad Soyad</label>
        <input className="auth-inp" placeholder="Ahmet Yılmaz" value={name}
          onChange={e => { setName(e.target.value); setError(""); }} autoComplete="name" />
      </div>

      {/* Şehir + İlçe side by side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <div>
          <label className="field-label"><MapPin size={13} /> Şehir</label>
          <select className="auth-inp" value={city}
            onChange={e => { setCity(e.target.value); setDistrict(""); setError(""); }}
            style={{ cursor: "pointer" }}>
            <option value="">Şehir seç…</option>
            {CITY_LIST.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label"><MapPin size={13} /> İlçe</label>
          <select className="auth-inp" value={district}
            onChange={e => { setDistrict(e.target.value); setError(""); }}
            disabled={!city}
            style={{ cursor: city ? "pointer" : "not-allowed", opacity: city ? 1 : 0.5 }}>
            <option value="">İlçe seç…</option>
            {getDistricts(city).map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Adres */}
      <div className="field-row">
        <label className="field-label"><Home size={13} /> Adres</label>
        <input className="auth-inp" placeholder="Mahalle, Sokak, Bina No..." value={address}
          onChange={e => { setAddress(e.target.value); setError(""); }} autoComplete="street-address" />
      </div>

      {/* Telefon */}
      <div className="field-row">
        <label className="field-label"><Phone size={13} /> Cep Telefonu</label>
        <div className="phone-wrap">
          <div className="phone-prefix"><span style={{ fontSize: 18 }}>🇹🇷</span> +90</div>
          <input className="auth-inp" style={{ border: "none", borderRadius: 0, height: 48, flex: 1 }}
            type="tel" inputMode="numeric" maxLength={13} placeholder="5XX XXX XX XX"
            value={phone} onChange={e => { setPhone(fmtPhone(e.target.value)); setError(""); }}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); submitForm(); } }}
          />
        </div>
      </div>

      {error && <p style={{ fontSize: 12, color: "#EF4444", marginBottom: 10 }}>{error}</p>}

      <button className="auth-btn" onClick={submitForm} disabled={loading} style={{ marginTop: 4 }}>
        {loading && <Loader2 size={16} className="auth-spin" />}
        {loading ? "Gönderiliyor..." : "Devam Et — SMS Kodu Al"}
      </button>

      <p style={{ fontSize: 11, color: C.light, marginTop: 12, textAlign: "center", lineHeight: 1.6 }}>
        Devam ederek{" "}
        <a href="/yourpoodle/kullanim-sartlari" style={{ color: C.primary }}>Kullanım Şartlarını</a>
        {" "}ve{" "}
        <a href="/yourpoodle/kvkk" style={{ color: C.primary }}>KVKK Aydınlatma Metnini</a>
        {" "}kabul etmiş olursunuz.
      </p>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */
export default function YPGirisPage() {
  const [, navigate] = useLocation();
  const { isLoggedIn } = useCustomer();
  const [tab, setTab]     = useState<"login" | "register">("login");
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (isLoggedIn) navigate("/yourpoodle/profil");
  }, [isLoggedIn]);

  // Check URL for ?tab=register
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("tab") === "register" || p.get("tab") === "kayit") setTab("register");
  }, []);

  const onDone = () => navigate("/yourpoodle/profil");

  return (
    <div className="auth-root">
      <style>{CSS}</style>
      {toast && <Toast msg={toast} onDone={() => setToast("")} />}

      <div className="auth-shell">
        {/* Left panel — desktop only */}
        <div className="auth-left" style={{ background: "linear-gradient(160deg, #4C1D95 0%, #7C3AED 50%, #A78BFA 100%)" }}>
          <div className="auth-left-overlay" style={{ background: "none" }} />
          <div className="auth-left-content">
            <div style={{ fontFamily: "'Pacifico',cursive", fontSize: 28, color: "#fff", marginBottom: 12 }}>
              YourPoodle 🐾
            </div>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,.9)", lineHeight: 1.6, margin: 0 }}>
              Toy Poodle'ınız için<br />
              <strong>beslenme, sağlık ve bakım</strong><br />
              her şey tek yerde.
            </p>
          </div>
        </div>

        {/* Right panel */}
        <div className="auth-right">
          <div style={{
            width: "100%", maxWidth: 420,
            background: C.card, borderRadius: 20,
            padding: "28px 28px 32px",
            boxShadow: "0 4px 32px rgba(0,0,0,.08)",
          }}>
            {/* Tabs */}
            <div className="auth-tab-bar" style={{ marginBottom: 28 }}>
              <button className={`auth-tab${tab === "login" ? " active" : ""}`}
                onClick={() => setTab("login")}>
                Giriş Yap
              </button>
              <button className={`auth-tab${tab === "register" ? " active" : ""}`}
                onClick={() => setTab("register")}>
                Üye Ol
              </button>
            </div>

            {tab === "login"
              ? <LoginTab setToast={setToast} onDone={onDone} />
              : <RegisterTab setToast={setToast} onDone={onDone} />
            }
          </div>

          <p style={{ marginTop: 20, fontSize: 12, color: C.light, textAlign: "center" }}>
            🔒 256-bit SSL · KVKK uyumlu
          </p>
        </div>
      </div>
    </div>
  );
}
