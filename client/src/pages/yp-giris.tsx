import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, Loader2, ShieldCheck, Phone } from "lucide-react";
import { useCustomer } from "@/contexts/CustomerContext";
import { apiRequest } from "@/lib/queryClient";

/* ─── helpers ────────────────────────────────────────────── */
const CSS = [
  "*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }",
  "body { background: #fff; }",
  "input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; }",
  "input[type=number] { -moz-appearance: textfield; }",
  ".yp-btn { border: none; cursor: pointer; font-family: Inter, sans-serif; font-weight: 800; }",
  ".yp-btn:active { opacity: 0.88; transform: scale(0.98); }",
  ".yp-input:focus { border-color: #7C3AFF; box-shadow: 0 0 0 3px rgba(124,58,255,0.12); }",
].join("\n");

function formatPhone(val: string) {
  const d = val.replace(/\D/g, "");
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
  if (d.length <= 8) return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
  return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 8)} ${d.slice(8, 10)}`;
}

/* ─── Step indicators ───────────────────────────────────── */
function Steps({ step }: { step: "phone" | "otp" | "register" }) {
  const steps = ["Telefon", "Doğrulama", "Profil"];
  const idx   = step === "phone" ? 0 : step === "otp" ? 1 : 2;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 32 }}>
      {steps.map((s, i) => (
        <div key={s} style={{ display: "flex", alignItems: "center", flex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: i <= idx ? "#7C3AFF" : "#f0f0f0",
              color: i <= idx ? "#fff" : "#bbb",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 800, fontFamily: "Inter, sans-serif",
              transition: "all 0.2s",
            }}>
              {i < idx ? "✓" : i + 1}
            </div>
            <span style={{ fontSize: 10, fontWeight: 600, color: i <= idx ? "#7C3AFF" : "#bbb", marginTop: 4, fontFamily: "Inter, sans-serif" }}>{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ height: 2, flex: 1, background: i < idx ? "#7C3AFF" : "#f0f0f0", marginBottom: 16, transition: "background 0.3s" }} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────── */
export default function YPGiris() {
  const [, navigate]    = useLocation();
  const { loginWithOtp, isLoggedIn } = useCustomer();

  const [step,     setStep]     = useState<"phone" | "otp" | "register">("phone");
  const [phone,    setPhone]    = useState("");
  const [otp,      setOtp]      = useState(["", "", "", ""]);
  const [name,     setName]     = useState("");
  const [loading,  setLoading]  = useState(false);
  const [autoVfy,  setAutoVfy]  = useState(false);
  const [error,    setError]    = useState("");
  const [countdown, setCountdown] = useState(0);
  const [isExisting, setIsExisting] = useState(false);

  const otpRefs   = useRef<(HTMLInputElement | null)[]>([]);
  const vfyRef    = useRef(false);

  /* redirect if already logged in */
  useEffect(() => { if (isLoggedIn) navigate("/"); }, [isLoggedIn]);

  /* countdown timer */
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  /* SMS OTP Web API */
  useEffect(() => {
    if (step !== "otp") return;
    if (!("OTPCredential" in window)) return;
    const ac = new AbortController();
    (navigator as any).credentials
      .get({ otp: { transport: ["sms"] }, signal: ac.signal })
      .then((res: any) => {
        if (!res?.code) return;
        const digits = res.code.replace(/\D/g, "");
        if (digits.length === 4) {
          setOtp(digits.split(""));
          if (!vfyRef.current) { vfyRef.current = true; setTimeout(() => doVerify(digits), 150); }
        }
      })
      .catch(() => {});
    return () => ac.abort();
  }, [step]);

  /* ── send OTP ─────────────────────────────────────────── */
  const sendOtp = async () => {
    const normalized = phone.replace(/\D/g, "");
    if (normalized.length < 10) { setError("Geçerli bir telefon numarası girin"); return; }
    setError(""); setLoading(true);
    try {
      let deviceToken: string | undefined;
      try { const t = JSON.parse(localStorage.getItem("jetgo_trusted_devices") || "{}"); deviceToken = t[normalized]; } catch {}
      const res  = await apiRequest("POST", "/api/otp/send", { phone: normalized, deviceToken });
      const data = await res.json();
      if (data.trustedLogin) { navigate("/"); return; }
      setIsExisting(!!data.isExisting);
      setStep("otp");
      setCountdown(180);
      setOtp(["", "", "", ""]);
      vfyRef.current = false;
      setTimeout(() => otpRefs.current[0]?.focus(), 120);
    } catch (e: any) {
      let msg = "SMS gönderilemedi, tekrar deneyin";
      try { msg = JSON.parse(e.message.replace(/^\d+:\s*/, "")).message; } catch {}
      setError(msg);
    } finally { setLoading(false); }
  };

  /* ── verify OTP ───────────────────────────────────────── */
  const doVerify = async (code: string) => {
    setError(""); setLoading(true); setAutoVfy(true);
    const normalized = phone.replace(/\D/g, "");
    try {
      const data = await loginWithOtp(normalized, code);
      if (data?.requiresRegistration) { setStep("register"); }
      else { navigate("/"); }
    } catch (e: any) {
      let msg = "Doğrulama kodu hatalı";
      try { msg = JSON.parse(e.message.replace(/^\d+:\s*/, "")).message; } catch {}
      setError(msg);
      vfyRef.current = false;
    } finally { setLoading(false); setAutoVfy(false); }
  };

  /* ── register ─────────────────────────────────────────── */
  const doRegister = async () => {
    if (!name.trim()) { setError("Adınızı girin"); return; }
    setError(""); setLoading(true);
    const normalized = phone.replace(/\D/g, "");
    try {
      await loginWithOtp(normalized, otp.join(""), name.trim());
      navigate("/");
    } catch (e: any) {
      let msg = "Kayıt tamamlanamadı";
      try { msg = JSON.parse(e.message.replace(/^\d+:\s*/, "")).message; } catch {}
      setError(msg);
    } finally { setLoading(false); }
  };

  /* ── OTP input handlers ───────────────────────────────── */
  const handleOtpChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    if (val.length > 1) {
      const digits = val.replace(/\D/g, "").split("");
      const next = ["", "", "", ""].map((_, i) => digits[i] || "");
      setOtp(next);
      const last = Math.min(digits.length - 1, 3);
      otpRefs.current[last]?.focus();
      if (next.every(d => d !== "") && !vfyRef.current) { vfyRef.current = true; setTimeout(() => doVerify(next.join("")), 150); }
      return;
    }
    const next = [...otp]; next[idx] = val; setOtp(next);
    if (val && idx < 3) otpRefs.current[idx + 1]?.focus();
    if (next.every(d => d !== "") && !vfyRef.current) { vfyRef.current = true; setTimeout(() => doVerify(next.join("")), 150); }
  };

  const handleOtpKey = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus();
  };

  /* ── render ───────────────────────────────────────────── */
  return (
    <>
      <title>Giriş — YourPoodle</title>
      <style>{CSS}</style>

      <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "Inter, sans-serif", display: "flex", flexDirection: "column" }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "center", padding: "16px 16px 12px", borderBottom: "1px solid #f2f2f2" }}>
          <button onClick={() => step === "phone" ? navigate("/") : setStep("phone")}
            style={{ background: "#F5F5F5", border: "none", borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", marginRight: 12 }}>
            <ChevronLeft size={18} color="#333" />
          </button>
          <img src="/images/yourpoodle-logo.jpg" alt="YourPoodle" style={{ height: 30, objectFit: "contain" }} />
        </div>

        {/* ── Hero gradient strip ── */}
        <div style={{ background: "linear-gradient(135deg,#7C3AFF,#A855F7)", padding: "28px 24px 36px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
          <div style={{ position: "absolute", bottom: -20, left: -10, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
          <div style={{ fontSize: 32, marginBottom: 6 }}>🐩</div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 4 }}>
            {step === "phone"    ? "Hoş Geldiniz!" :
             step === "otp"     ? "Kodu Girin"    :
                                  "Profilinizi Tamamlayın"}
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>
            {step === "phone"    ? "YourPoodle'a giriş yapmak veya üye olmak için telefon numaranızı girin." :
             step === "otp"     ? `+90 ${phone} numarasına gönderilen 4 haneli kodu girin.` :
                                  "Sizi tanımak için adınızı paylaşın."}
          </p>
        </div>

        {/* ── Form card ── */}
        <div style={{ flex: 1, padding: "28px 20px 40px", background: "#fff", borderRadius: "20px 20px 0 0", marginTop: -12, boxShadow: "0 -4px 20px rgba(0,0,0,0.06)" }}>
          <Steps step={step} />

          {/* PHONE STEP */}
          {step === "phone" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#555", display: "block", marginBottom: 8 }}>Telefon Numarası</label>
                <div style={{ display: "flex", alignItems: "center", border: "2px solid #e8e8e8", borderRadius: 14, overflow: "hidden", background: "#fafafa", transition: "border-color 0.2s" }}>
                  <div style={{ padding: "0 12px", borderRight: "1px solid #e8e8e8", display: "flex", alignItems: "center", gap: 6, height: 52, flexShrink: 0, background: "#f5f5f5" }}>
                    <span style={{ fontSize: 18 }}>🇹🇷</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#333" }}>+90</span>
                  </div>
                  <input
                    className="yp-input"
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={e => setPhone(formatPhone(e.target.value))}
                    onKeyDown={e => { if (e.key === "Enter") sendOtp(); }}
                    placeholder="5XX XXX XX XX"
                    maxLength={13}
                    style={{ flex: 1, border: "none", outline: "none", padding: "0 14px", fontSize: 18, fontWeight: 700, letterSpacing: 1, color: "#222", background: "transparent", height: 52, fontFamily: "Inter, sans-serif" }}
                  />
                  <Phone size={18} color="#ccc" style={{ marginRight: 14, flexShrink: 0 }} />
                </div>
                {error && <p style={{ fontSize: 12, color: "#EF4444", marginTop: 6, fontWeight: 600 }}>{error}</p>}
              </div>

              <button className="yp-btn" onClick={sendOtp} disabled={loading}
                style={{ height: 54, borderRadius: 16, background: loading ? "#c4b5fd" : "linear-gradient(135deg,#7C3AFF,#A855F7)", color: "#fff", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {loading ? <Loader2 size={20} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} /> : null}
                {loading ? "Gönderiliyor..." : "Devam Et →"}
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1, height: 1, background: "#f0f0f0" }} />
                <span style={{ fontSize: 11, color: "#ccc", fontWeight: 600 }}>veya</span>
                <div style={{ flex: 1, height: 1, background: "#f0f0f0" }} />
              </div>

              <button className="yp-btn" onClick={() => navigate("/")}
                style={{ height: 50, borderRadius: 16, background: "#F5F0FF", color: "#7C3AFF", fontSize: 14 }}>
                Misafir Olarak Devam Et
              </button>

              <p style={{ fontSize: 11, color: "#aaa", textAlign: "center", lineHeight: 1.7 }}>
                Devam ederek{" "}
                <span style={{ color: "#7C3AFF", fontWeight: 700 }}>Kullanım Şartlarını</span> ve{" "}
                <span style={{ color: "#7C3AFF", fontWeight: 700 }}>Gizlilik Politikasını</span>{" "}
                kabul etmiş olursunuz.
              </p>
            </div>
          )}

          {/* OTP STEP */}
          {step === "otp" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#555", display: "block", marginBottom: 16, textAlign: "center" }}>
                  {isExisting ? "Hoş geldiniz! Kodu girin 👋" : "Yeni hesap — kodu girin 🎉"}
                </label>

                {/* OTP boxes */}
                <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 8 }}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => otpRefs.current[i] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKey(i, e)}
                      style={{
                        width: 62, height: 72, borderRadius: 16, textAlign: "center",
                        fontSize: 28, fontWeight: 900, fontFamily: "Inter, sans-serif",
                        border: `2.5px solid ${digit ? "#7C3AFF" : "#e8e8e8"}`,
                        background: digit ? "#F5F0FF" : "#fafafa",
                        color: "#7C3AFF", outline: "none",
                        transition: "all 0.15s", caretColor: "#7C3AFF",
                      }}
                    />
                  ))}
                </div>
                {error && <p style={{ fontSize: 12, color: "#EF4444", textAlign: "center", fontWeight: 600, marginTop: 4 }}>{error}</p>}
              </div>

              {autoVfy && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "#7C3AFF", fontSize: 13, fontWeight: 700 }}>
                  <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Doğrulanıyor...
                </div>
              )}

              <button className="yp-btn" onClick={() => doVerify(otp.join(""))} disabled={loading || otp.some(d => !d)}
                style={{ height: 54, borderRadius: 16, background: otp.every(d => d) ? "linear-gradient(135deg,#7C3AFF,#A855F7)" : "#e8e8e8", color: otp.every(d => d) ? "#fff" : "#bbb", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {loading && !autoVfy ? <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> : <ShieldCheck size={20} />}
                Doğrula
              </button>

              <div style={{ textAlign: "center" }}>
                {countdown > 0 ? (
                  <span style={{ fontSize: 13, color: "#aaa" }}>
                    Yeni kod: <strong style={{ color: "#7C3AFF" }}>{Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, "0")}</strong>
                  </span>
                ) : (
                  <button onClick={() => { setOtp(["","","",""]); vfyRef.current=false; sendOtp(); }}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#7C3AFF", fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
                    Kodu Tekrar Gönder
                  </button>
                )}
              </div>

              <button onClick={() => { setStep("phone"); setError(""); setOtp(["","","",""]); }}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#aaa", fontWeight: 600, fontFamily: "Inter, sans-serif" }}>
                ← Telefon numarasını değiştir
              </button>
            </div>
          )}

          {/* REGISTER STEP */}
          {step === "register" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "#F5F0FF", borderRadius: 14, padding: 16, display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ fontSize: 24 }}>🐾</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#7C3AFF", marginBottom: 3 }}>YourPoodle Ailesine Katılıyorsunuz!</div>
                  <div style={{ fontSize: 12, color: "#888", lineHeight: 1.6 }}>Hesabınızı oluşturmak için bir isim yeterli. Adres ve diğer bilgiler sipariş sırasında alınacak.</div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#555", display: "block", marginBottom: 8 }}>Adınız</label>
                <input
                  className="yp-input"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") doRegister(); }}
                  placeholder="Örn: Ayşe"
                  autoFocus
                  style={{ width: "100%", height: 52, borderRadius: 14, border: "2px solid #e8e8e8", padding: "0 16px", fontSize: 16, fontWeight: 600, color: "#222", background: "#fafafa", outline: "none", fontFamily: "Inter, sans-serif", transition: "border-color 0.2s" }}
                />
                {error && <p style={{ fontSize: 12, color: "#EF4444", marginTop: 6, fontWeight: 600 }}>{error}</p>}
              </div>

              {/* Avatar picker */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#555", display: "block", marginBottom: 10 }}>Profil İkonu (isteğe bağlı)</label>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {["🐩","🐾","🌸","⭐","🎀","🦴","🐶","💜"].map(e => (
                    <button key={e} style={{ width: 44, height: 44, borderRadius: 12, border: "2px solid #f0f0f0", background: "#fafafa", fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} className="yp-btn">
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <button className="yp-btn" onClick={doRegister} disabled={loading}
                style={{ height: 54, borderRadius: 16, background: name.trim() ? "linear-gradient(135deg,#7C3AFF,#A855F7)" : "#e8e8e8", color: name.trim() ? "#fff" : "#bbb", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {loading ? <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> : null}
                {loading ? "Oluşturuluyor..." : "Hesabımı Oluştur 🎉"}
              </button>
            </div>
          )}
        </div>

        {/* ── Bottom trust bar ── */}
        <div style={{ background: "#FAFAFA", borderTop: "1px solid #f0f0f0", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <ShieldCheck size={14} color="#22C55E" strokeWidth={2.5} />
          <span style={{ fontSize: 11, color: "#aaa", fontWeight: 600 }}>Bilgileriniz SSL ile korunmaktadır</span>
        </div>

        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </>
  );
}
