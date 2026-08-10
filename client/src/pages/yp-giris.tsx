import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useCustomer } from "@/contexts/CustomerContext";
import { apiRequest } from "@/lib/queryClient";
import { IS_YP } from "@/lib/store";
import {
  ShieldCheck, MessageSquare, Lock, CheckCircle, Zap, Key,
} from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";

const BASE = IS_YP ? "" : "/yourpoodle";

/* ── Design tokens ── */
const P      = "#4B2BD6";
const PD     = "#3E27B3";
const PLIGHT = "#F3F0FF";
const PBADGE = "#EDE5D8";
const GB     = "#E5E7EB";

/* ── Phone formatter ── */
function fmtPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0,3)} ${d.slice(3)}`;
  if (d.length <= 8) return `${d.slice(0,3)} ${d.slice(3,6)} ${d.slice(6)}`;
  return `${d.slice(0,3)} ${d.slice(3,6)} ${d.slice(6,8)} ${d.slice(8,10)}`;
}

function maskPhone(raw: string) {
  const d = raw.replace(/\D/g, "");
  if (d.length < 2) return "+90 " + d;
  return `+90 ${d.slice(0,3)} *** ** ${d.slice(-2)}`;
}

function validPhone(raw: string) {
  const d = raw.replace(/\D/g, "");
  return d.startsWith("5") && d.length === 10;
}

/* ── Toast ── */
function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)",
                  zIndex:999, pointerEvents:"none", opacity:visible?1:0, transition:"opacity 0.3s ease" }}>
      <div style={{ background:"#1D1E9B", color:"#fff", padding:"12px 24px", borderRadius:999,
                    fontSize:14, fontWeight:500, whiteSpace:"nowrap", boxShadow:"0 4px 16px rgba(0,0,0,0.25)" }}>
        {message}
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function YPGirisPage() {
  const [, navigate] = useLocation();
  const { isLoggedIn, loginWithOtp } = useCustomer();

  /* Auth flow state */
  const [phone,             setPhone]             = useState("");
  const [step,              setStep]              = useState<"phone"|"otp">("phone");
  const [otp,               setOtp]               = useState(["","","",""] as string[]);
  const [smsSent,           setSmsSent]           = useState(false);
  const [countdown,         setCountdown]         = useState(60);
  const [termsAccepted,     setTermsAccepted]     = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(false);
  const [loading,           setLoading]           = useState(false);
  const [toast,             setToast]             = useState({ message:"", visible:false });
  const [phoneError,        setPhoneError]        = useState("");
  const otpRefs   = useRef<(HTMLInputElement|null)[]>([]);
  const verifying = useRef(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>|null>(null);

  /* Page title */
  useEffect(() => { document.title = "Giriş Yap | YourPoodle"; }, []);

  /* Redirect if already logged in */
  const [returnTo] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    return p.get("returnTo") || `${BASE}/benim-poodleim`;
  });
  useEffect(() => { if (isLoggedIn) navigate(returnTo); }, [isLoggedIn]);

  /* Countdown timer */
  useEffect(() => {
    if (!smsSent || countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [smsSent, countdown]);

  const showToast = (msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message:msg, visible:true });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, visible:false })), 3000);
  };

  const fmtCountdown = (s: number) =>
    `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  /* Computed: can send SMS */
  const canSend = validPhone(phone) && termsAccepted;

  /* Send SMS */
  const sendSMS = async () => {
    /* Inline validation instead of alert() */
    if (!validPhone(phone)) {
      setPhoneError("Geçerli bir cep telefonu numarası girin (5XX XXX XX XX)");
      return;
    }
    setPhoneError("");
    if (!termsAccepted) {
      showToast("Lütfen sözleşmeleri kabul edin");
      return;
    }
    setLoading(true);
    try {
      const digits = phone.replace(/\D/g, "");
      let deviceToken: string|undefined;
      try { const t = JSON.parse(localStorage.getItem("jetgo_trusted_devices")||"{}"); deviceToken = t[digits]; } catch {}
      const res  = await apiRequest("POST", "/api/otp/send", { phone: digits, deviceToken });
      const data = await res.json();
      if (data.trustedLogin) {
        showToast("Hoş geldiniz! ✓");
        setTimeout(() => navigate(returnTo), 800);
        return;
      }
      setSmsSent(true); setStep("otp"); setCountdown(60);
      verifying.current = false; setOtp(["","","",""]);
      showToast("Doğrulama kodu gönderildi ✓");
      setTimeout(() => otpRefs.current[0]?.focus(), 300);
    } catch (e: any) {
      let msg = "SMS gönderilemedi";
      try { msg = JSON.parse(e.message.replace(/^\d+:\s*/,"")).message; } catch {}
      showToast(msg);
    } finally { setLoading(false); }
  };

  /* Verify OTP */
  const verifyOTP = async (code?: string) => {
    const entered = code ?? otp.join("");
    if (entered.length < 4) { showToast("4 haneli kodu girin"); return; }
    if (verifying.current) return;
    verifying.current = true; setLoading(true);
    try {
      const digits = phone.replace(/\D/g, "");
      const data = await loginWithOtp(digits, entered);
      if (data?.requiresRegistration) {
        showToast("Hesap oluşturulamadı. Lütfen tekrar deneyin.");
        verifying.current = false; return;
      }
      showToast("Hoş geldiniz! ✓");
      setTimeout(() => navigate(returnTo), 600);
    } catch (e: any) {
      let msg = "Geçersiz doğrulama kodu";
      try { msg = JSON.parse(e.message.replace(/^\d+:\s*/,"")).message; } catch {}
      showToast(msg);
      verifying.current = false;
    } finally { setLoading(false); }
  };

  /* Resend */
  const resendOTP = async () => {
    if (countdown > 0) return;
    const digits = phone.replace(/\D/g, "");
    try {
      await apiRequest("POST", "/api/otp/send", { phone: digits });
      setCountdown(60); setOtp(["","","",""]); verifying.current = false;
      showToast("Kod yeniden gönderildi");
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch { showToast("SMS gönderilemedi"); }
  };

  const changePhone = () => {
    setStep("phone"); setSmsSent(false); setOtp(["","","",""]); setCountdown(0);
    verifying.current = false;
  };

  const handleOtpChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    if (val.length > 1) {
      const digits = val.replace(/\D/g,"").split("");
      const next = ["","","",""].map((_,i) => digits[i]||"");
      setOtp(next);
      otpRefs.current[Math.min(digits.length-1,3)]?.focus();
      if (next.every(d=>d) && !verifying.current) verifyOTP(next.join(""));
      return;
    }
    const next = [...otp]; next[idx] = val; setOtp(next);
    if (val && idx < 3) otpRefs.current[idx+1]?.focus();
    if (next.every(d=>d) && !verifying.current) verifyOTP(next.join(""));
  };

  return (
    <YPLayout activeLink={`${BASE}/giris`} constrain={true} authMode={true} hideFooter={true}>
      <Toast message={toast.message} visible={toast.visible} />

      <main style={{ padding:"20px 16px calc(env(safe-area-inset-bottom,0px) + 32px)" }}>

        {/* Auth card */}
        <div style={{ background:"#fff", borderRadius:20, border:`1px solid #F3F4F6`,
                      boxShadow:"0 2px 16px rgba(0,0,0,0.07)", padding:"28px 20px 24px" }}>

          {/* Hero image */}
          <div style={{ textAlign:"center", marginBottom:16 }}>
            <img src="/images/yp-poodle-hero.png" alt="YourPoodle"
              style={{ width:96, height:96, borderRadius:"50%", objectFit:"cover",
                       margin:"0 auto", display:"block", border:"3px solid #F3F0FF" }} />

            <div style={{ display:"inline-flex", alignItems:"center", gap:6,
                          background:PBADGE, color:P, fontSize:12, fontWeight:600,
                          padding:"5px 14px", borderRadius:999, marginTop:12 }}>
              <ShieldCheck size={14} />
              Şifresiz ve Güvenli
            </div>

            <h1 style={{ fontSize:22, fontWeight:700, color:"#111827", margin:"14px 0 8px", lineHeight:1.2 }}>
              Üye Ol veya Giriş Yap
            </h1>
            <p style={{ fontSize:13, color:"#6B7280", margin:0, lineHeight:1.6, padding:"0 4px" }}>
              Cep telefonu numaranızı yazın. SMS ile tek kullanımlık doğrulama kodu gönderelim.
            </p>
          </div>

          {/* Step 1: Phone */}
          <div style={{ marginTop:20 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
              <div style={{ width:22, height:22, borderRadius:"50%", background:P, color:"#fff",
                            fontSize:12, fontWeight:700, display:"flex", alignItems:"center",
                            justifyContent:"center", flexShrink:0 }}>
                1
              </div>
              <span style={{ fontSize:14, fontWeight:600, color:"#111827" }}>Cep Telefonu Numaranız</span>
            </div>

            <div style={{
              display:"flex", border:`1.5px solid ${phoneError ? "#EF4444" : GB}`,
              borderRadius:12, overflow:"hidden", background:"#fff",
              transition:"border-color 0.15s",
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, padding:"0 12px",
                            background:"#F9FAFB", borderRight:`1px solid ${GB}`, flexShrink:0,
                            fontSize:13, fontWeight:600, color:"#374151" }}>
                <span style={{ fontSize:18 }}>🇹🇷</span>
                <span>+90</span>
              </div>
              <input type="tel" inputMode="numeric" placeholder="5XX XXX XX XX"
                value={phone}
                onChange={e => { setPhone(fmtPhone(e.target.value)); setPhoneError(""); }}
                onKeyDown={e => { if(e.key==="Enter") { e.preventDefault(); sendSMS(); } }}
                disabled={step === "otp"}
                aria-label="Cep telefonu numarası"
                aria-invalid={!!phoneError}
                style={{ flex:1, border:"none", outline:"none", padding:"14px 12px",
                         fontSize:15, fontFamily:"inherit", color:"#111827",
                         background: step==="otp" ? "#F9FAFB" : "#fff" }} />
            </div>

            {/* Inline phone error */}
            {phoneError && (
              <p role="alert" style={{ fontSize:12, color:"#EF4444", margin:"5px 0 0", paddingLeft:2, fontWeight:500 }}>
                {phoneError}
              </p>
            )}
            {!phoneError && (
              <p style={{ fontSize:11, color:"#9CA3AF", margin:"6px 0 0", paddingLeft:2 }}>
                Doğrulama kodu bu numaraya gönderilecektir.
              </p>
            )}

            {step === "phone" && (
              <button
                onClick={sendSMS}
                disabled={loading || !canSend}
                aria-disabled={loading || !canSend}
                style={{
                  width:"100%", marginTop:14,
                  background: (loading || !canSend) ? "#D4C4B0" : P,
                  color:"#fff", border:"none", borderRadius:12, padding:"14px 0",
                  fontSize:15, fontWeight:600,
                  cursor: (loading || !canSend) ? "not-allowed" : "pointer",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                  fontFamily:"inherit", transition:"background 0.15s",
                  opacity: (loading || !canSend) ? 0.75 : 1,
                }}
                onMouseEnter={e=>{ if(!loading && canSend) e.currentTarget.style.background=PD; }}
                onMouseLeave={e=>{ if(!loading && canSend) e.currentTarget.style.background=P; }}>
                <MessageSquare size={18} />
                {loading ? "Gönderiliyor..." : "SMS Kodu Gönder"}
              </button>
            )}

            {/* Hint: why button is disabled */}
            {step === "phone" && !canSend && !loading && (
              <p style={{ fontSize:11, color:"#9CA3AF", textAlign:"center", margin:"8px 0 0" }}>
                {!validPhone(phone)
                  ? "Geçerli bir 10 haneli telefon numarası girin"
                  : "Sözleşmeleri kabul etmeniz gerekiyor"}
              </p>
            )}

            {step === "phone" && (
              <div style={{ display:"flex", alignItems:"center", gap:6, justifyContent:"center", marginTop:10 }}>
                <Lock size={12} color="#9CA3AF" />
                <span style={{ fontSize:11, color:"#9CA3AF" }}>
                  Numaranız güvende, üçüncü taraflarla paylaşılmaz.
                </span>
              </div>
            )}
          </div>

          {/* Step 2: OTP */}
          {smsSent && step === "otp" && (
            <div style={{ marginTop:18 }}>
              <div style={{ background:"#F0FDF4", border:"1px solid #BBF7D0", borderRadius:12,
                            padding:"10px 14px", display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
                <CheckCircle size={16} color="#16A34A" style={{ flexShrink:0 }} />
                <span style={{ fontSize:13, color:"#166534", fontWeight:500 }}>
                  Doğrulama kodu {maskPhone(phone.replace(/\D/g,""))} numarasına gönderildi.
                </span>
              </div>

              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                <div style={{ width:22, height:22, borderRadius:"50%", background:P, color:"#fff",
                              fontSize:12, fontWeight:700, display:"flex", alignItems:"center",
                              justifyContent:"center", flexShrink:0 }}>
                  2
                </div>
                <span style={{ fontSize:14, fontWeight:600, color:"#111827" }}>SMS Doğrulama Kodu</span>
              </div>

              <div style={{ display:"flex", gap:10, justifyContent:"center", marginBottom:12 }}>
                {otp.map((d, i) => (
                  <input key={i}
                    ref={el => { otpRefs.current[i] = el; }}
                    type="tel" inputMode="numeric" maxLength={1} value={d}
                    autoComplete={i===0?"one-time-code":"off"}
                    aria-label={`OTP hanesi ${i+1}`}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => {
                      if(e.key==="Backspace" && !otp[i] && i>0) otpRefs.current[i-1]?.focus();
                    }}
                    style={{ width:56, height:56, border:`2px solid ${d?P:GB}`, borderRadius:12,
                             textAlign:"center", fontSize:24, fontWeight:700, fontFamily:"inherit",
                             outline:"none", color:"#111827",
                             background:d?PLIGHT:"#fff", transition:"border-color 0.15s, background 0.15s" }} />
                ))}
              </div>

              <div style={{ textAlign:"center", marginBottom:8 }}>
                <span style={{ fontSize:12, color:"#6B7280" }}>
                  Kodu tekrar gönder: {fmtCountdown(countdown)}
                </span>
              </div>

              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:16 }}>
                <button onClick={resendOTP} disabled={countdown > 0}
                  style={{ background:"none", border:"none", cursor:countdown>0?"not-allowed":"pointer",
                           fontSize:12, fontWeight:600, color:P, fontFamily:"inherit",
                           opacity:countdown>0?0.5:1, padding:0 }}>
                  Kodu yeniden gönder
                </button>
                <span style={{ color:"#D1D5DB", fontSize:14 }}>|</span>
                <button onClick={changePhone}
                  style={{ background:"none", border:"none", cursor:"pointer",
                           fontSize:12, fontWeight:600, color:P, fontFamily:"inherit", padding:0 }}>
                  Telefon numarasını değiştir
                </button>
              </div>

              <button onClick={() => verifyOTP()} disabled={loading || otp.some(d=>!d)}
                style={{ width:"100%", background:(loading||otp.some(d=>!d))?"#9CA3AF":P,
                         color:"#fff", border:"none", borderRadius:12, padding:"14px 0",
                         fontSize:15, fontWeight:600,
                         cursor:(loading||otp.some(d=>!d))?"not-allowed":"pointer",
                         display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                         fontFamily:"inherit", transition:"background 0.15s" }}
                onMouseEnter={e=>{ if(!loading&&!otp.some(d=>!d)) e.currentTarget.style.background=PD; }}
                onMouseLeave={e=>{ if(!loading&&!otp.some(d=>!d)) e.currentTarget.style.background=P; }}>
                <ShieldCheck size={18} />
                {loading ? "Doğrulanıyor..." : "Doğrula ve Devam Et"}
              </button>
            </div>
          )}

          {/* Consent Checkboxes */}
          <div style={{ marginTop:20, display:"flex", flexDirection:"column", gap:12 }}>
            {/* Terms checkbox — required, real toggle */}
            <label style={{ display:"flex", alignItems:"flex-start", gap:10, cursor:"pointer" }}>
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={e => setTermsAccepted(e.target.checked)}
                aria-required="true"
                aria-label="Üyelik Sözleşmesi, KVKK Aydınlatma Metni ve Gizlilik Politikasını kabul ediyorum"
                style={{ marginTop:2, flexShrink:0, accentColor:P, width:16, height:16, cursor:"pointer" }}
              />
              <span style={{ fontSize:12, color:"#4B5563", lineHeight:1.6 }}>
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); navigate(`${BASE}/kullanim-sartlari`); }}
                  style={{ background:"none", border:"none", padding:0, color:P, fontWeight:600,
                           cursor:"pointer", fontSize:"inherit", fontFamily:"inherit",
                           textDecoration:"underline" }}>
                  Üyelik Sözleşmesi
                </button>
                {", "}
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); navigate(`${BASE}/gizlilik-politikasi`); }}
                  style={{ background:"none", border:"none", padding:0, color:P, fontWeight:600,
                           cursor:"pointer", fontSize:"inherit", fontFamily:"inherit",
                           textDecoration:"underline" }}>
                  KVKK Aydınlatma Metni
                </button>
                {" ve "}
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); navigate(`${BASE}/gizlilik-politikasi`); }}
                  style={{ background:"none", border:"none", padding:0, color:P, fontWeight:600,
                           cursor:"pointer", fontSize:"inherit", fontFamily:"inherit",
                           textDecoration:"underline" }}>
                  Gizlilik Politikası
                </button>
                {"'nı okudum, kabul ediyorum."}
              </span>
            </label>

            {/* Marketing checkbox — optional, real toggle */}
            <label style={{ display:"flex", alignItems:"flex-start", gap:10, cursor:"pointer" }}>
              <input
                type="checkbox"
                checked={marketingAccepted}
                onChange={e => setMarketingAccepted(e.target.checked)}
                aria-label="Kampanya, indirim ve yenilikler hakkında SMS almayı kabul ediyorum"
                style={{ marginTop:2, flexShrink:0, accentColor:P, width:16, height:16, cursor:"pointer" }}
              />
              <span style={{ fontSize:12, color:"#4B5563", lineHeight:1.6 }}>
                Kampanya, indirim ve yenilikler hakkında SMS almak istiyorum. (İsteğe bağlı)
              </span>
            </label>
          </div>

          {/* Value props bar */}
          <div style={{ marginTop:20, background:PLIGHT, borderRadius:14, padding:"16px 12px" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
              {[
                { Icon:Key,         label:"Şifre Yok" },
                { Icon:Zap,         label:"Hızlı Giriş" },
                { Icon:ShieldCheck, label:"Güvenli Doğrulama" },
              ].map(({ Icon, label }) => (
                <div key={label} style={{ textAlign:"center" }}>
                  <Icon size={20} color={P} style={{ display:"block", margin:"0 auto 4px" }} />
                  <span style={{ fontSize:11, fontWeight:500, color:"#374151" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Support link — real page, no mailto dead end */}
          <div style={{ marginTop:16, marginBottom:4, textAlign:"center" }}>
            <span style={{ fontSize:12, color:"#6B7280" }}>
              Kod gelmedi mi? Destek ekibimizden yardım alın.{" "}
            </span>
            <button
              type="button"
              onClick={() => navigate(`${BASE}/iletisim`)}
              style={{ background:"none", border:"none", cursor:"pointer", fontSize:12,
                       fontWeight:700, color:P, fontFamily:"inherit", padding:0,
                       textDecoration:"underline" }}>
              Destek Al
            </button>
          </div>

        </div>
      </main>
    </YPLayout>
  );
}
