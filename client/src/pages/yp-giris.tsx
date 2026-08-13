import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useCustomer } from "@/contexts/CustomerContext";
import { apiRequest } from "@/lib/queryClient";
import { IS_YP } from "@/lib/store";
import {
  ShieldCheck, MessageSquare, Lock, CheckCircle, Zap, Fingerprint,
} from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import PatternLock from "@/components/PatternLock";
import {
  clearPatternLock,
  getPatternLock,
  clearLegacyTrustedDeviceStorage,
  hashPattern,
  isMobilePatternDevice,
  savePatternLock,
} from "@/lib/pattern-lock";
import { safeInternalPath } from "@/lib/safe-redirect";

const BASE = IS_YP ? "" : "/yourpoodle";

/* ── Design tokens ── */
const P      = "#5D3A1A";
const PD     = "#3D2612";
const PLIGHT = "#F5F0E6";
const PBADGE = "#EDE5D8";
const GB     = "#E5E7EB";

type Step = "phone" | "otp" | "register" | "pattern-unlock" | "pattern-setup" | "pattern-confirm";

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
      <div style={{ background:"#3D2612", color:"#fff", padding:"12px 24px", borderRadius:999,
                    fontSize:14, fontWeight:500, whiteSpace:"nowrap", boxShadow:"0 4px 16px rgba(0,0,0,0.25)" }}>
        {message}
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function YPGirisPage() {
  const [, navigate] = useLocation();
  const { isLoggedIn, loginWithOtp, refetch } = useCustomer();
  const mobile = isMobilePatternDevice();

  /* Auth flow state */
  const [phone,             setPhone]             = useState("");
  const [step,              setStep]              = useState<Step>("phone");
  const [otp,               setOtp]               = useState(["","","","","",""] as string[]);
  const [smsSent,           setSmsSent]           = useState(false);
  const [countdown,         setCountdown]         = useState(60);
  const [termsAccepted,     setTermsAccepted]     = useState(() => isMobilePatternDevice());
  const [marketingAccepted, setMarketingAccepted] = useState(false);
  const [loading,           setLoading]           = useState(false);
  const [toast,             setToast]             = useState({ message:"", visible:false });
  const [phoneError,        setPhoneError]        = useState("");
  const [patternError,      setPatternError]      = useState("");
  const [patternReset,      setPatternReset]      = useState(0);
  const [pendingPattern,    setPendingPattern]    = useState<number[] | null>(null);
  const [patternFails,      setPatternFails]      = useState(0);
  const [regName,           setRegName]           = useState("");
  const [regError,          setRegError]          = useState("");
  /** New user: OTP verified, waiting for pattern (mobile) + name before account creation */
  const [pendingRegistration, setPendingRegistration] = useState(false);
  const otpRefs   = useRef<(HTMLInputElement|null)[]>([]);
  const verifying = useRef(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>|null>(null);
  const patternBooted = useRef(false);
  /** After name registration, block auto-redirect until pattern is saved */
  const awaitingPatternRef = useRef(false);

  /* Page title */
  useEffect(() => { document.title = "Giriş Yap | YourPoodle"; }, []);

  /* Redirect if already logged in */
  const [returnTo] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    return safeInternalPath(p.get("returnTo"), `${BASE}/benim-poodleim`);
  });
  useEffect(() => {
    // Pattern setup must run after login; don't bounce to panel early.
    if (!isLoggedIn) return;
    if (awaitingPatternRef.current) return;
    if (step === "pattern-setup" || step === "pattern-confirm" || step === "register") return;
    navigate(returnTo);
  }, [isLoggedIn, step, navigate, returnTo]);

  /* Mobile: open pattern unlock if a saved pattern + trusted device exist */
  useEffect(() => {
    if (patternBooted.current || isLoggedIn) return;
    patternBooted.current = true;
    clearLegacyTrustedDeviceStorage();
    if (!mobile) return;
    const saved = getPatternLock();
    if (!saved) return;
    // Trusted device lives in HttpOnly cookie — show unlock UI; server validates cookie on send.
    setPhone(fmtPhone(saved.phone));
    setStep("pattern-unlock");
  }, [mobile, isLoggedIn]);

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

  const goToPatternSetup = (toastMsg = "Şimdi giriş deseni oluştur") => {
    setStep("pattern-setup");
    setPendingPattern(null);
    setPatternError("");
    setPatternReset(k => k + 1);
    showToast(toastMsg);
  };

  const finishLogin = async (msg = "Hoş geldiniz! ✓") => {
    showToast(msg);
    await refetch();
    setTimeout(() => navigate(returnTo), 600);
  };

  const offerPatternSetupOrFinish = () => {
    if (!getPatternLock()) {
      goToPatternSetup("Giriş başarılı — desen kilidini oluştur");
      return;
    }
    finishLogin();
  };

  /* Computed: can send SMS */
  const canSend = validPhone(phone) && termsAccepted;

  /* Send SMS */
  const sendSMS = async () => {
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
      // If a pattern lock is set, skip cookie trusted-login so user can use SMS/pattern.
      const hasPattern = getPatternLock()?.phone === digits;
      const res  = await apiRequest("POST", "/api/otp/send", { phone: digits, forceSms: !!hasPattern });
      const data = await res.json();
      if (data.trustedLogin) {
        await finishLogin();
        return;
      }
      setSmsSent(true); setStep("otp"); setCountdown(60);
      verifying.current = false; setOtp(["","","","","",""]);
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
    if (entered.length < 6) { showToast("6 haneli kodu girin"); return; }
    if (verifying.current) return;
    verifying.current = true; setLoading(true);
    try {
      const digits = phone.replace(/\D/g, "");
      const data = await loginWithOtp(digits, entered);
      if (data?.requiresRegistration) {
        setPendingRegistration(true);
        setRegName("");
        setRegError("");
        verifying.current = false;
        // Ad soyad önce; mobilde desen kilidi sonra
        setStep("register");
        showToast(mobile ? "Son adım: adını yaz, sonra desen çiz" : "Son adım: adınızı yazın");
        return;
      }
      import("@/lib/yp-analytics").then(({ track }) => {
        track(data?.isNewUser ? "signup" : "login");
      }).catch(() => {});
      setPendingRegistration(false);
      offerPatternSetupOrFinish();
    } catch (e: any) {
      let msg = "Geçersiz doğrulama kodu";
      try { msg = JSON.parse(e.message.replace(/^\d+:\s*/,"")).message; } catch {}
      showToast(msg);
      verifying.current = false;
    } finally { setLoading(false); }
  };

  const completeRegistration = async () => {
    const name = regName.trim();
    if (name.length < 2) {
      setRegError("Lütfen adınızı ve soyadınızı girin");
      return;
    }
    setRegError("");
    setLoading(true);
    try {
      const digits = phone.replace(/\D/g, "");
      const code = otp.join("");
      // Hold redirect: loginWithOtp sets isLoggedIn before we can switch to pattern step
      awaitingPatternRef.current = true;
      const data = await loginWithOtp(digits, code, name);
      if (data?.requiresRegistration) {
        awaitingPatternRef.current = false;
        setRegError("Kayıt tamamlanamadı, tekrar deneyin");
        return;
      }
      import("@/lib/yp-analytics").then(({ track }) => track("signup")).catch(() => {});
      setPendingRegistration(false);

      // Always require pattern for this phone after first registration
      const saved = getPatternLock();
      if (saved && saved.phone !== digits) {
        clearPatternLock();
      }
      if (!getPatternLock() || getPatternLock()?.phone !== digits) {
        goToPatternSetup("Üyelik aktif — şimdi güvenlik desenini çiz");
        return;
      }

      awaitingPatternRef.current = false;
      await finishLogin("Üyeliğin aktif edildi ✓");
      return;
    } catch (e: any) {
      awaitingPatternRef.current = false;
      let msg = "Kayıt tamamlanamadı";
      try { msg = JSON.parse(e.message.replace(/^\d+:\s*/,"")).message; } catch {}
      // OTP süresi dolduysa SMS adımına dön
      if (/süre|bulunamadı|yeni kod/i.test(msg)) {
        setPendingRegistration(false);
        setStep("otp");
        showToast(msg);
      } else {
        setRegError(msg);
      }
    } finally {
      setLoading(false);
    }
  };
  /* Resend */
  const resendOTP = async () => {
    if (countdown > 0) return;
    const digits = phone.replace(/\D/g, "");
    try {
      await apiRequest("POST", "/api/otp/send", { phone: digits });
      setCountdown(60); setOtp(["","","","","",""]); verifying.current = false;
      showToast("Kod yeniden gönderildi");
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch { showToast("SMS gönderilemedi"); }
  };

  const changePhone = () => {
    setStep("phone"); setSmsSent(false); setOtp(["","","","","",""]); setCountdown(0);
    verifying.current = false;
    setPendingRegistration(false);
    awaitingPatternRef.current = false;
    setPendingPattern(null);
    setRegName("");
    setRegError("");
  };

  const handleOtpChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    if (val.length > 1) {
      const digits = val.replace(/\D/g,"").split("");
      const next = ["","","","","",""].map((_,i) => digits[i]||"");
      setOtp(next);
      otpRefs.current[Math.min(digits.length-1,5)]?.focus();
      if (next.every(d=>d) && !verifying.current) verifyOTP(next.join(""));
      return;
    }
    const next = [...otp]; next[idx] = val; setOtp(next);
    if (val && idx < 5) otpRefs.current[idx+1]?.focus();
    if (next.every(d=>d) && !verifying.current) verifyOTP(next.join(""));
  };

  const onPatternUnlock = async (nodes: number[]) => {
    if (loading) return;
    const saved = getPatternLock();
    if (!saved) {
      setStep("phone");
      return;
    }
    setLoading(true);
    setPatternError("");
    try {
      const hash = await hashPattern(nodes);
      if (hash !== saved.patternHash) {
        const fails = patternFails + 1;
        setPatternFails(fails);
        setPatternReset(k => k + 1);
        if (fails >= 5) {
          clearPatternLock();
          setStep("phone");
          setPatternFails(0);
          showToast("Çok fazla hatalı desen. SMS ile giriş yapın.");
        } else {
          setPatternError(`Yanlış desen (${fails}/5)`);
        }
        return;
      }
      // Cookie is sent automatically with credentials; server validates HttpOnly yp_td.
      const res = await apiRequest("POST", "/api/otp/send", { phone: saved.phone });
      const data = await res.json();
      if (data.trustedLogin) {
        setPatternFails(0);
        await finishLogin("Desen ile giriş başarılı ✓");
        return;
      }
      clearPatternLock();
      setPhone(fmtPhone(saved.phone));
      setStep("phone");
      showToast("Cihaz güveni sona erdi. SMS ile giriş yapın.");
    } catch {
      setPatternError("Giriş yapılamadı, tekrar deneyin");
      setPatternReset(k => k + 1);
    } finally {
      setLoading(false);
    }
  };

  const onPatternSetup = (nodes: number[]) => {
    if (nodes.length < 4) {
      setPatternError("En az 4 nokta birleştirin");
      setPatternReset(k => k + 1);
      return;
    }
    setPendingPattern(nodes);
    setPatternError("");
    setStep("pattern-confirm");
    setPatternReset(k => k + 1);
  };

  const onPatternConfirm = async (nodes: number[]) => {
    if (!pendingPattern) {
      setStep("pattern-setup");
      return;
    }
    const same =
      nodes.length === pendingPattern.length &&
      nodes.every((n, i) => n === pendingPattern[i]);
    if (!same) {
      setPatternError("Desenler eşleşmedi. Yeniden çizin.");
      setPendingPattern(null);
      setStep("pattern-setup");
      setPatternReset(k => k + 1);
      return;
    }
    const digits = phone.replace(/\D/g, "");
    const hash = await hashPattern(nodes);
    savePatternLock(digits, hash);
    setPendingPattern(null);
    setPatternError("");
    awaitingPatternRef.current = false;
    setPendingRegistration(false);
    await finishLogin("Desen kaydedildi — üyeliğin aktif ✓");
  };
  const useSmsInstead = () => {
    setStep("phone");
    setPatternError("");
    setPatternFails(0);
  };

  const showPhoneOtp = step === "phone" || step === "otp";
  const showRegister = step === "register";
  const showPattern = step === "pattern-unlock" || step === "pattern-setup" || step === "pattern-confirm";

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
                       margin:"0 auto", display:"block", border:`3px solid ${PLIGHT}` }} />

            <div style={{ display:"inline-flex", alignItems:"center", gap:6,
                          background:PBADGE, color:P, fontSize:12, fontWeight:600,
                          padding:"5px 14px", borderRadius:999, marginTop:12 }}>
              {showPattern ? <Fingerprint size={14} /> : <ShieldCheck size={14} />}
              {step === "pattern-unlock" ? "Desen ile Giriş" :
               step === "pattern-setup" || step === "pattern-confirm" ? "Desen Kilidi" :
               step === "register" ? "Hesap Oluştur" :
               "Şifresiz ve Güvenli"}
            </div>

            <h1 style={{ fontSize:22, fontWeight:700, color:"#111827", margin:"14px 0 8px", lineHeight:1.2 }}>
              {step === "pattern-unlock" ? "Desenini Çiz" :
               step === "pattern-setup" ? "Desen Kilidi Oluştur" :
               step === "pattern-confirm" ? "Deseni Tekrar Çiz" :
               step === "register" ? "Seni Tanıyalım" :
               "Üye Ol veya Giriş Yap"}
            </h1>
            <p style={{ fontSize:13, color:"#6B7280", margin:0, lineHeight:1.6, padding:"0 4px" }}>
              {step === "pattern-unlock"
                ? `Kayıtlı cihazında hızlı giriş için desenini çiz. (${maskPhone(phone.replace(/\D/g,""))})`
                : step === "pattern-setup"
                ? "Parmaklarınla bir desen çiz (en az 4 nokta). Kaydedince paneline gireceksin."
                : step === "pattern-confirm"
                ? "Aynı deseni bir kez daha çiz — ardından paneline geçeceksin."
                : step === "register"
                ? "Telefon doğrulandı. Adını yaz; ardından güvenlik desenini çizeceksin."
                : "Cep telefonu numaranızı yazın. SMS ile tek kullanımlık doğrulama kodu gönderelim."}
            </p>
          </div>

          {/* New user: name registration */}
          {showRegister && (
            <div style={{ marginTop:12 }}>
              <label style={{ display:"block", fontSize:13, fontWeight:600, color:"#111827", marginBottom:8 }}>
                Ad Soyad
              </label>
              <input
                type="text"
                autoComplete="name"
                placeholder="Örn. Ayşe Yılmaz"
                value={regName}
                onChange={e => { setRegName(e.target.value); setRegError(""); }}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); completeRegistration(); } }}
                aria-label="Ad Soyad"
                aria-invalid={!!regError}
                style={{
                  width:"100%", boxSizing:"border-box",
                  border:`1.5px solid ${regError ? "#EF4444" : GB}`,
                  borderRadius:12, padding:"14px 12px", fontSize:15,
                  fontFamily:"inherit", color:"#111827", outline:"none",
                }}
              />
              {regError && (
                <p role="alert" style={{ fontSize:12, color:"#EF4444", margin:"6px 0 0", fontWeight:500 }}>
                  {regError}
                </p>
              )}
              <button
                type="button"
                onClick={completeRegistration}
                disabled={loading || regName.trim().length < 2}
                style={{
                  width:"100%", marginTop:14,
                  background: (loading || regName.trim().length < 2) ? "#D4C4B0" : P,
                  color:"#fff", border:"none", borderRadius:12, padding:"14px 0",
                  fontSize:15, fontWeight:600,
                  cursor: (loading || regName.trim().length < 2) ? "not-allowed" : "pointer",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                  fontFamily:"inherit",
                }}>
                <ShieldCheck size={18} />
                {loading ? "Kaydediliyor..." : "Devam Et — Desen Çiz"}
              </button>
            </div>
          )}

          {/* Pattern unlock / setup (mobile only steps) */}
          {showPattern && (
            <div style={{ marginTop:8 }}>
              <PatternLock
                accent={P}
                accentSoft={PLIGHT}
                disabled={loading}
                resetKey={`${step}-${patternReset}`}
                onComplete={
                  step === "pattern-unlock" ? onPatternUnlock :
                  step === "pattern-setup" ? onPatternSetup :
                  onPatternConfirm
                }
              />
              {patternError && (
                <p role="alert" style={{ fontSize:13, color:"#EF4444", textAlign:"center", marginTop:12, fontWeight:600 }}>
                  {patternError}
                </p>
              )}
              {loading && (
                <p style={{ fontSize:13, color:"#6B7280", textAlign:"center", marginTop:12 }}>
                  Doğrulanıyor...
                </p>
              )}

              {step === "pattern-unlock" && (
                <button
                  type="button"
                  onClick={useSmsInstead}
                  style={{ width:"100%", marginTop:16, background:"none", border:`1px solid ${GB}`,
                           borderRadius:12, padding:"12px 0", fontSize:14, fontWeight:600,
                           color:P, cursor:"pointer", fontFamily:"inherit" }}>
                  SMS ile giriş yap
                </button>
              )}

              {(step === "pattern-setup" || step === "pattern-confirm") && (
                <p style={{ fontSize:12, color:"#6B7280", textAlign:"center", marginTop:14, lineHeight:1.5 }}>
                  Deseni kaydettikten sonra paneline yönlendirileceksin.
                </p>
              )}
            </div>
          )}

          {/* Step 1: Phone */}
          {showPhoneOtp && (
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
          )}

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

          {/* Consent Checkboxes — desktop only; mobile’da gizli (terms auto-accept) */}
          {showPhoneOtp && !mobile && (
          <div style={{ marginTop:20, display:"flex", flexDirection:"column", gap:12 }}>
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
          )}

          {/* Value props — ad soyad sonrası (desen adımında) */}
          {showPattern && (step === "pattern-setup" || step === "pattern-confirm") && (
          <div style={{ marginTop:20, background:PLIGHT, borderRadius:14, padding:"16px 12px" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
              {[
                { Icon: Fingerprint, label: "Desen Kilit" },
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
          )}

          {/* Support link */}
          {showPhoneOtp && (
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
          )}

        </div>
      </main>
    </YPLayout>
  );
}
