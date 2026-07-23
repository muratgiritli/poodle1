import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useCustomer } from "@/contexts/CustomerContext";
import { apiRequest } from "@/lib/queryClient";
import {
  Menu, X, ShoppingBag, PawPrint, MessageCirclePlus, BookOpen,
  ShieldCheck, MessageSquare, Lock, CheckCircle, Zap, Key,
  Mail, Clock, Instagram, Youtube, Music2, Facebook, Plus, Minus,
} from "lucide-react";

/* ── Design tokens ── */
const P      = "#4B2BD6";
const PD     = "#3E27B3";
const PLIGHT = "#F3F0FF";
const PBADGE = "#EDE9FE";
const FBG    = "#1D1E9B";
const FBX    = "#2D2FA8";
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

/* ── Toast ── */
function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div style={{
      position:"fixed", bottom:88, left:"50%", transform:"translateX(-50%)",
      zIndex:999, pointerEvents:"none", opacity:visible?1:0, transition:"opacity 0.3s ease"
    }}>
      <div style={{
        background:FBG, color:"#fff", padding:"12px 24px", borderRadius:999,
        fontSize:14, fontWeight:500, whiteSpace:"nowrap", boxShadow:"0 4px 16px rgba(0,0,0,0.25)"
      }}>{message}</div>
    </div>
  );
}

/* ── Footer accordion ── */
const ACCORDION = [
  { Icon:PawPrint,          title:"YourPoodle", links:["Hakkımızda","Misyonumuz","Kariyer","Basın"] },
  { Icon:ShoppingBag,       title:"Alışveriş",  links:["Tüm Ürünler","Mamalar","Aksesuarlar","Kampanyalar"] },
  { Icon:MessageCirclePlus, title:"Yardım",     links:["SSS","Kargo & Teslimat","İade & Değişim","İletişim"] },
  { Icon:ShieldCheck,       title:"Yasal",      links:["Gizlilik Politikası","Kullanım Koşulları","KVKK","Çerez Politikası"] },
];

function AccordionFooter() {
  const [open, setOpen] = useState<number|null>(null);
  return (
    <div>
      {ACCORDION.map((item, i) => (
        <div key={item.title}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between",
              padding:"14px 0", background:"none", border:"none",
              borderTop:"1px solid rgba(255,255,255,0.1)", cursor:"pointer", fontFamily:"inherit"
            }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <item.Icon size={18} color="rgba(255,255,255,0.8)" />
              <span style={{ fontSize:14, fontWeight:500, color:"#fff" }}>{item.title}</span>
            </div>
            {open === i ? <Minus size={18} color="#fff" /> : <Plus size={18} color="#fff" />}
          </button>
          {open === i && (
            <div style={{ paddingBottom:12, paddingLeft:30, display:"flex", flexDirection:"column", gap:8 }}>
              {item.links.map(l => (
                <span key={l} style={{ fontSize:14, color:"rgba(255,255,255,0.6)", cursor:"pointer" }}>{l}</span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Main Page ── */
export default function YPGirisPage() {
  const [, navigate] = useLocation();
  const { isLoggedIn, loginWithOtp } = useCustomer();

  /* UI state */
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast,      setToast]      = useState({ message:"", visible:false });
  const toastTimer = useRef<ReturnType<typeof setTimeout>|null>(null);

  /* Auth flow state */
  const [phone,             setPhone]             = useState("");
  const [step,              setStep]              = useState<"phone"|"otp">("phone");
  const [otp,               setOtp]               = useState(["","","",""] as string[]);
  const [smsSent,           setSmsSent]           = useState(false);
  const [countdown,         setCountdown]         = useState(60);
  const [termsAccepted,     setTermsAccepted]     = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(false);
  const [loading,           setLoading]           = useState(false);
  const otpRefs = useRef<(HTMLInputElement|null)[]>([]);
  const verifying = useRef(false);

  /* Newsletter */
  const [newsEmail, setNewsEmail] = useState("");

  /* Redirect if already logged in */
  const [returnTo] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    return p.get("returnTo") || "/yourpoodle/profil";
  });
  useEffect(() => { if (isLoggedIn) navigate(returnTo); }, [isLoggedIn]);

  /* Countdown timer */
  useEffect(() => {
    if (!smsSent || countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [smsSent, countdown]);

  useEffect(() => { document.title = "Üye Ol veya Giriş Yap | YourPoodle"; }, []);
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const go = (href: string) => { navigate(href); setDrawerOpen(false); };

  const showToast = (msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message:msg, visible:true });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, visible:false })), 3000);
  };

  const fmtCountdown = (s: number) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  /* Send SMS */
  const sendSMS = async () => {
    const digits = phone.replace(/\D/g, "");
    if (!digits.startsWith("5") || digits.length < 10) {
      showToast("Geçerli bir cep telefonu numarası girin"); return;
    }
    if (!termsAccepted) {
      showToast("Lütfen sözleşmeleri kabul edin"); return;
    }
    setLoading(true);
    try {
      let deviceToken: string|undefined;
      try { const t = JSON.parse(localStorage.getItem("jetgo_trusted_devices")||"{}"); deviceToken = t[digits]; } catch {}
      const res  = await apiRequest("POST", "/api/otp/send", { phone: digits, deviceToken });
      const data = await res.json();
      if (data.trustedLogin) {
        showToast("Hoş geldiniz! ✓");
        setTimeout(() => navigate(returnTo), 800);
        return;
      }
      setSmsSent(true);
      setStep("otp");
      setCountdown(60);
      verifying.current = false;
      setOtp(["","","",""]);
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
    verifying.current = true;
    setLoading(true);
    try {
      const digits = phone.replace(/\D/g, "");
      const data = await loginWithOtp(digits, entered);
      if (data?.requiresRegistration) {
        showToast("Hesap oluşturulamadı. Lütfen tekrar deneyin.");
        verifying.current = false;
        return;
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
      setCountdown(60);
      setOtp(["","","",""]);
      verifying.current = false;
      showToast("Kod yeniden gönderildi");
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch { showToast("SMS gönderilemedi"); }
  };

  /* Change phone */
  const changePhone = () => {
    setStep("phone");
    setSmsSent(false);
    setOtp(["","","",""]);
    setCountdown(0);
    verifying.current = false;
  };

  /* OTP input handler */
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

  /* Newsletter */
  const submitNewsletter = () => {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsEmail)) {
      showToast("Bültene kaydoldunuz ✓");
      setNewsEmail("");
    } else {
      showToast("Geçerli bir e-posta girin");
    }
  };

  /* Top tabs */
  const TOP_TABS = [
    { key:"magaza", label:"Mağaza",     Icon:ShoppingBag,        href:"/yourpoodle/magaza" },
    { key:"club",   label:"Club",       Icon:PawPrint,            href:"/yourpoodle/topluluk" },
    { key:"ai",     label:"AI Asistan", Icon:MessageCirclePlus,   href:"/yourpoodle/ai-asistan" },
    { key:"rehber", label:"Rehber",     Icon:BookOpen,            href:"/yourpoodle/rehber" },
  ];

  return (
    <div style={{ fontFamily:"'Inter',-apple-system,sans-serif", background:"#F3F4F6",
      minHeight:"100vh", color:"#111827", maxWidth:480, margin:"0 auto" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing:border-box; }
        body { margin:0; }
      `}</style>

      <Toast message={toast.message} visible={toast.visible} />

      {/* ── Drawer overlay ── */}
      {drawerOpen && (
        <div onClick={() => setDrawerOpen(false)}
          style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:500 }} />
      )}
      <div style={{
        position:"fixed",top:0,left:0,height:"100%",width:288,background:"#fff",zIndex:501,
        transform:drawerOpen?"translateX(0)":"translateX(-100%)",transition:"transform 0.25s ease",
        boxShadow:"4px 0 24px rgba(0,0,0,0.18)",display:"flex",flexDirection:"column"
      }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"20px 16px 14px",borderBottom:`1px solid ${GB}` }}>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <img src="/images/yp-poodle-hero.png" alt="YourPoodle"
              style={{ width:32,height:32,borderRadius:"50%",objectFit:"cover" }} />
            <span style={{ fontWeight:700,fontSize:16,color:P }}>YourPoodle</span>
          </div>
          <button onClick={() => setDrawerOpen(false)} aria-label="Kapat"
            style={{ background:"none",border:"none",cursor:"pointer",display:"flex",
              alignItems:"center",justifyContent:"center",minWidth:44,minHeight:44 }}>
            <X size={20} color="#374151" />
          </button>
        </div>
        <div style={{ flex:1,overflowY:"auto" }}>
          {TOP_TABS.map(l => (
            <button key={l.href} onClick={() => go(l.href)}
              style={{ display:"block",width:"100%",padding:"14px 20px",fontSize:15,
                fontWeight:500,color:"#1F2937",background:"none",border:"none",
                borderBottom:`1px solid ${GB}`,cursor:"pointer",textAlign:"left",
                fontFamily:"inherit",minHeight:44 }}>
              {l.label}
            </button>
          ))}
        </div>
        <div style={{ padding:16,borderTop:`1px solid ${GB}`,display:"flex",flexDirection:"column",gap:8 }}>
          <button onClick={() => go("/yourpoodle/giris")}
            style={{ width:"100%",padding:"10px 0",fontSize:14,fontWeight:500,
              color:"#374151",background:"none",border:"none",cursor:"pointer",
              fontFamily:"inherit",textAlign:"center" }}>
            Giriş Yap
          </button>
          <button onClick={() => go("/yourpoodle/giris")}
            style={{ width:"100%",padding:"12px 0",background:P,color:"#fff",
              border:"none",borderRadius:999,fontSize:14,fontWeight:600,
              cursor:"pointer",fontFamily:"inherit" }}>
            Üye Ol
          </button>
        </div>
      </div>

      {/* ── Sticky Header ── */}
      <header style={{ position:"sticky",top:0,zIndex:400,background:"#fff" }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",
          height:56,padding:"0 16px",borderBottom:`1px solid ${GB}` }}>
          <button aria-label="Menü" onClick={() => setDrawerOpen(true)}
            style={{ background:"none",border:"none",cursor:"pointer",display:"flex",
              alignItems:"center",justifyContent:"center",minWidth:44,minHeight:44,padding:0 }}>
            <Menu size={22} color="#374151" />
          </button>
          <button onClick={() => go("/yourpoodle")} aria-label="Ana sayfa"
            style={{ display:"flex",alignItems:"center",gap:8,background:"none",
              border:"none",cursor:"pointer",padding:0 }}>
            <img src="/images/yp-poodle-hero.png" alt="YourPoodle"
              style={{ width:40,height:40,borderRadius:"50%",objectFit:"cover" }} />
            <span style={{ fontWeight:700,fontSize:18,color:P }}>YourPoodle</span>
          </button>
          <div style={{ display:"flex",alignItems:"center",gap:12 }}>
            <button onClick={() => go("/yourpoodle/giris")}
              style={{ background:"none",border:"none",cursor:"pointer",fontSize:13,
                color:"#374151",fontFamily:"inherit",whiteSpace:"nowrap" }}>
              Giriş Yap
            </button>
            <button onClick={() => go("/yourpoodle/giris")}
              style={{ background:`linear-gradient(135deg,${P} 0%,#4F46E5 100%)`,color:"#fff",
                fontSize:13,fontWeight:500,padding:"6px 16px",borderRadius:999,border:"none",
                cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit" }}>
              Üye Ol
            </button>
          </div>
        </div>

        {/* Top Tab Nav — all inactive */}
        <div style={{ display:"flex",borderBottom:`1px solid ${GB}`,background:"#fff" }}>
          {TOP_TABS.map(({ key, label, Icon, href }) => (
            <button key={key} onClick={() => go(href)}
              style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",
                gap:4,padding:"10px 0",border:"none",background:"none",cursor:"pointer",
                fontFamily:"inherit",borderBottom:"2px solid transparent",
                color:"#9CA3AF",fontWeight:500,transition:"color 0.15s" }}>
              <Icon size={20} />
              <span style={{ fontSize:11 }}>{label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* ── Main content ── */}
      <main style={{ padding:"20px 16px 32px" }}>

        {/* Auth card */}
        <div style={{ background:"#fff",borderRadius:20,border:`1px solid #F3F4F6`,
          boxShadow:"0 2px 16px rgba(0,0,0,0.07)",padding:"28px 20px 24px" }}>

          {/* Hero image */}
          <div style={{ textAlign:"center", marginBottom:16 }}>
            <img
              src="/images/yp-poodle-hero.png"
              alt="YourPoodle"
              style={{ width:96,height:96,borderRadius:"50%",objectFit:"cover",
                margin:"0 auto",display:"block",border:"3px solid #F3F0FF" }}
            />

            {/* Şifresiz ve Güvenli badge */}
            <div style={{ display:"inline-flex",alignItems:"center",gap:6,
              background:PBADGE,color:P,fontSize:12,fontWeight:600,
              padding:"5px 14px",borderRadius:999,marginTop:12 }}>
              <ShieldCheck size={14} />
              Şifresiz ve Güvenli
            </div>

            {/* Title */}
            <h1 style={{ fontSize:22,fontWeight:700,color:"#111827",margin:"14px 0 8px",lineHeight:1.2 }}>
              Üye Ol veya Giriş Yap
            </h1>

            {/* Subtext */}
            <p style={{ fontSize:13,color:"#6B7280",margin:0,lineHeight:1.6,padding:"0 4px" }}>
              Cep telefonu numaranızı yazın. Size SMS ile tek kullanımlık doğrulama kodu gönderelim.
              Kayıtlıysanız giriş yapılır, değilseniz hesabınız otomatik oluşturulur.
            </p>
          </div>

          {/* ── Step 1: Phone ── */}
          <div style={{ marginTop:20 }}>
            {/* Step label */}
            <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:10 }}>
              <div style={{ width:22,height:22,borderRadius:"50%",background:P,
                color:"#fff",fontSize:12,fontWeight:700,display:"flex",
                alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                1
              </div>
              <span style={{ fontSize:14,fontWeight:600,color:"#111827" }}>Cep Telefonu Numaranız</span>
            </div>

            {/* Phone input row */}
            <div style={{ display:"flex",border:`1px solid ${GB}`,borderRadius:12,
              overflow:"hidden",background:"#fff" }}>
              {/* Country code */}
              <div style={{ display:"flex",alignItems:"center",gap:6,padding:"0 12px",
                background:"#F9FAFB",borderRight:`1px solid ${GB}`,flexShrink:0,
                fontSize:13,fontWeight:600,color:"#374151" }}>
                <span style={{ fontSize:18 }}>🇹🇷</span>
                <span>+90</span>
              </div>
              {/* Phone input */}
              <input
                type="tel"
                inputMode="numeric"
                placeholder="5XX XXX XX XX"
                value={phone}
                onChange={e => setPhone(fmtPhone(e.target.value))}
                onKeyDown={e => { if(e.key==="Enter") { e.preventDefault(); sendSMS(); } }}
                disabled={step === "otp"}
                style={{ flex:1,border:"none",outline:"none",padding:"14px 12px",
                  fontSize:15,fontFamily:"inherit",color:"#111827",
                  background: step==="otp" ? "#F9FAFB" : "#fff" }}
              />
            </div>

            <p style={{ fontSize:11,color:"#9CA3AF",margin:"6px 0 0",paddingLeft:2 }}>
              Doğrulama kodu bu numaraya gönderilecektir.
            </p>

            {/* SMS Kodu Gönder button */}
            {step === "phone" && (
              <button
                onClick={sendSMS}
                disabled={loading}
                style={{ width:"100%",marginTop:14,background:loading?"#7B6BB3":P,
                  color:"#fff",border:"none",borderRadius:12,padding:"14px 0",
                  fontSize:15,fontWeight:600,cursor:loading?"not-allowed":"pointer",
                  display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                  fontFamily:"inherit",transition:"background 0.15s",
                  opacity:loading?0.75:1 }}
                onMouseEnter={e=>{ if(!loading) e.currentTarget.style.background=PD; }}
                onMouseLeave={e=>{ if(!loading) e.currentTarget.style.background=P; }}>
                <MessageSquare size={18} />
                {loading ? "Gönderiliyor..." : "SMS Kodu Gönder"}
              </button>
            )}

            {/* Security note */}
            {step === "phone" && (
              <div style={{ display:"flex",alignItems:"center",gap:6,justifyContent:"center",
                marginTop:10 }}>
                <Lock size={12} color="#9CA3AF" />
                <span style={{ fontSize:11,color:"#9CA3AF" }}>
                  Numaranız güvende, üçüncü taraflarla paylaşılmaz.
                </span>
              </div>
            )}
          </div>

          {/* ── Step 2: OTP ── */}
          {smsSent && step === "otp" && (
            <div style={{ marginTop:18 }}>
              {/* Green success banner */}
              <div style={{ background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:12,
                padding:"10px 14px",display:"flex",alignItems:"center",gap:8,marginBottom:16 }}>
                <CheckCircle size={16} color="#16A34A" style={{ flexShrink:0 }} />
                <span style={{ fontSize:13,color:"#166534",fontWeight:500 }}>
                  Doğrulama kodu {maskPhone(phone.replace(/\D/g,""))} numarasına gönderildi.
                </span>
              </div>

              {/* Step 2 label */}
              <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:14 }}>
                <div style={{ width:22,height:22,borderRadius:"50%",background:P,
                  color:"#fff",fontSize:12,fontWeight:700,display:"flex",
                  alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                  2
                </div>
                <span style={{ fontSize:14,fontWeight:600,color:"#111827" }}>SMS Doğrulama Kodu</span>
              </div>

              {/* 4 OTP boxes */}
              <div style={{ display:"flex",gap:10,justifyContent:"center",marginBottom:12 }}>
                {otp.map((d, i) => (
                  <input
                    key={i}
                    ref={el => { otpRefs.current[i] = el; }}
                    type="tel"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    autoComplete={i===0?"one-time-code":"off"}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => {
                      if(e.key==="Backspace" && !otp[i] && i>0) otpRefs.current[i-1]?.focus();
                    }}
                    style={{
                      width:56,height:56,border:`2px solid ${d?P:GB}`,borderRadius:12,
                      textAlign:"center",fontSize:24,fontWeight:700,fontFamily:"inherit",
                      outline:"none",color:"#111827",
                      background:d?PLIGHT:"#fff",transition:"border-color 0.15s, background 0.15s"
                    }}
                  />
                ))}
              </div>

              {/* Timer */}
              <div style={{ textAlign:"center",marginBottom:8 }}>
                <span style={{ fontSize:12,color:"#6B7280" }}>
                  Kodu tekrar gönder: {fmtCountdown(countdown)}
                </span>
              </div>

              {/* Links row */}
              <div style={{ display:"flex",alignItems:"center",justifyContent:"center",
                gap:12,marginBottom:16 }}>
                <button
                  onClick={resendOTP}
                  disabled={countdown > 0}
                  style={{ background:"none",border:"none",cursor:countdown>0?"not-allowed":"pointer",
                    fontSize:12,fontWeight:600,color:P,fontFamily:"inherit",
                    opacity:countdown>0?0.5:1,padding:0 }}>
                  Kodu yeniden gönder
                </button>
                <span style={{ color:"#D1D5DB",fontSize:14 }}>|</span>
                <button
                  onClick={changePhone}
                  style={{ background:"none",border:"none",cursor:"pointer",
                    fontSize:12,fontWeight:600,color:P,fontFamily:"inherit",padding:0 }}>
                  Telefon numarasını değiştir
                </button>
              </div>

              {/* Doğrula ve Devam Et button */}
              <button
                onClick={() => verifyOTP()}
                disabled={loading || otp.some(d=>!d)}
                style={{ width:"100%",background:(loading||otp.some(d=>!d))?"#9CA3AF":P,
                  color:"#fff",border:"none",borderRadius:12,padding:"14px 0",
                  fontSize:15,fontWeight:600,
                  cursor:(loading||otp.some(d=>!d))?"not-allowed":"pointer",
                  display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                  fontFamily:"inherit",transition:"background 0.15s" }}
                onMouseEnter={e=>{ if(!loading&&!otp.some(d=>!d)) e.currentTarget.style.background=PD; }}
                onMouseLeave={e=>{ if(!loading&&!otp.some(d=>!d)) e.currentTarget.style.background=P; }}>
                <ShieldCheck size={18} />
                {loading ? "Doğrulanıyor..." : "Doğrula ve Devam Et"}
              </button>
            </div>
          )}

          {/* ── Consent Checkboxes ── */}
          <div style={{ marginTop:20,display:"flex",flexDirection:"column",gap:12 }}>
            {/* Terms — required */}
            <label style={{ display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer" }}>
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={e => setTermsAccepted(e.target.checked)}
                style={{ marginTop:2,flexShrink:0,accentColor:P,width:16,height:16 }}
              />
              <span style={{ fontSize:12,color:"#4B5563",lineHeight:1.6 }}>
                <span
                  onClick={e => { e.preventDefault(); alert("Üyelik Sözleşmesi"); }}
                  style={{ color:P,fontWeight:600,cursor:"pointer",textDecoration:"underline" }}>
                  Üyelik Sözleşmesi
                </span>
                {", "}
                <span
                  onClick={e => { e.preventDefault(); alert("KVKK Aydınlatma Metni"); }}
                  style={{ color:P,fontWeight:600,cursor:"pointer",textDecoration:"underline" }}>
                  KVKK Aydınlatma Metni
                </span>
                {" ve "}
                <span
                  onClick={e => { e.preventDefault(); alert("Gizlilik Politikası"); }}
                  style={{ color:P,fontWeight:600,cursor:"pointer",textDecoration:"underline" }}>
                  Gizlilik Politikası
                </span>
                {"'nı okudum, kabul ediyorum."}
              </span>
            </label>

            {/* Marketing — optional */}
            <label style={{ display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer" }}>
              <input
                type="checkbox"
                checked={marketingAccepted}
                onChange={e => setMarketingAccepted(e.target.checked)}
                style={{ marginTop:2,flexShrink:0,accentColor:P,width:16,height:16 }}
              />
              <span style={{ fontSize:12,color:"#4B5563",lineHeight:1.6 }}>
                Kampanya, indirim ve yenilikler hakkında SMS almak istiyorum. (İsteğe bağlı)
              </span>
            </label>
          </div>

          {/* ── Value props bar ── */}
          <div style={{ marginTop:20,background:PLIGHT,borderRadius:14,padding:"16px 12px" }}>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8 }}>
              {[
                { Icon:Key,         label:"Şifre Yok" },
                { Icon:Zap,         label:"Hızlı Giriş" },
                { Icon:ShieldCheck, label:"Güvenli Doğrulama" },
              ].map(({ Icon, label }) => (
                <div key={label} style={{ textAlign:"center" }}>
                  <Icon size={20} color={P} style={{ display:"block",margin:"0 auto 4px" }} />
                  <span style={{ fontSize:11,fontWeight:500,color:"#374151" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Support link ── */}
          <div style={{ marginTop:16,marginBottom:4,textAlign:"center" }}>
            <span style={{ fontSize:12,color:"#6B7280" }}>
              Kod gelmedi mi? Destek ekibimizden yardım alın.{" "}
            </span>
            <button
              onClick={() => { window.location.href = "mailto:destek@yourpoodle.com"; }}
              style={{ background:"none",border:"none",cursor:"pointer",fontSize:12,
                fontWeight:700,color:P,fontFamily:"inherit",padding:0,textDecoration:"underline" }}>
              Destek Al
            </button>
          </div>

        </div>{/* end auth card */}
      </main>

      {/* ── Footer ── */}
      <footer style={{ background:FBG,color:"#fff" }}>

        {/* Newsletter box */}
        <div style={{ margin:"0 16px",borderRadius:16,padding:20,background:FBX,position:"relative",top:-1 }}>
          <h3 style={{ fontSize:15,fontWeight:600,margin:"0 0 4px" }}>Poodle dünyasından haberdar olun</h3>
          <p style={{ fontSize:13,color:"rgba(255,255,255,0.7)",margin:"0 0 16px",lineHeight:1.5 }}>
            Yer rehberleri, kampanyalar ve özel fırsatlar e-postanıza gelsin.
          </p>
          <div style={{ display:"flex" }}>
            <input
              type="email"
              value={newsEmail}
              onChange={e => setNewsEmail(e.target.value)}
              placeholder="E-posta adresiniz"
              style={{ flex:1,background:"#fff",color:"#111827",borderRadius:"999px 0 0 999px",
                padding:"10px 16px",fontSize:13,border:"none",outline:"none",fontFamily:"inherit" }}
            />
            <button
              onClick={submitNewsletter}
              style={{ background:P,color:"#fff",fontWeight:600,fontSize:13,padding:"10px 20px",
                borderRadius:"0 999px 999px 0",border:"none",cursor:"pointer",fontFamily:"inherit",
                whiteSpace:"nowrap" }}>
              Üye Ol
            </button>
          </div>
        </div>

        {/* Branding */}
        <div style={{ padding:"24px 16px 0" }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
            <img src="/images/yp-poodle-hero.png" alt="YourPoodle"
              style={{ width:32,height:32,borderRadius:"50%",objectFit:"cover" }} />
            <span style={{ fontWeight:700,fontSize:17 }}>YourPoodle</span>
          </div>
          <p style={{ fontSize:13,color:"rgba(255,255,255,0.7)",margin:"0 0 20px",lineHeight:1.6 }}>
            Toy Poodle'ınızın mutlu ve sağlıklı yaşamı için alışveriş, bilgi ve topluluk platformu.
          </p>
        </div>

        {/* Accordion */}
        <div style={{ padding:"0 16px" }}>
          <AccordionFooter />
        </div>

        {/* Contact */}
        <div style={{ padding:"16px 16px 0",display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <Mail size={16} color="rgba(255,255,255,0.7)" />
            <span style={{ fontSize:13,color:"rgba(255,255,255,0.7)" }}>destek@yourpoodle.com</span>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <Clock size={16} color="rgba(255,255,255,0.7)" />
            <span style={{ fontSize:13,color:"rgba(255,255,255,0.7)" }}>Pzt–Cmt 09.00–18.00</span>
          </div>
        </div>

        {/* Social */}
        <div style={{ padding:"24px 16px 0",textAlign:"center" }}>
          <p style={{ fontSize:13,fontWeight:600,margin:"0 0 12px" }}>Bizi Takip Edin</p>
          <div style={{ display:"flex",justifyContent:"center",gap:16 }}>
            {[
              { Icon:Instagram, label:"Instagram" },
              { Icon:Youtube,   label:"YouTube"   },
              { Icon:Music2,    label:"TikTok"    },
              { Icon:Facebook,  label:"Facebook"  },
            ].map(({ Icon, label }) => (
              <a key={label} href="#" aria-label={label}
                style={{ width:36,height:36,borderRadius:"50%",
                  border:"1px solid rgba(255,255,255,0.2)",display:"flex",
                  alignItems:"center",justifyContent:"center",color:"#fff",
                  cursor:"pointer",textDecoration:"none" }}>
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Trust & Payment */}
        <div style={{ padding:"24px 16px 0",display:"flex",
          alignItems:"center",justifyContent:"space-between" }}>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <ShieldCheck size={16} color="rgba(255,255,255,0.6)" />
            <span style={{ fontSize:12,color:"rgba(255,255,255,0.6)" }}>256-bit SSL ile güvenli alışveriş</span>
          </div>
          <div style={{ display:"flex",gap:8 }}>
            {["VISA","Mastercard","TROY"].map(b => (
              <span key={b} style={{ background:"#fff",color:"#374151",fontSize:11,
                fontWeight:700,padding:"4px 8px",borderRadius:4 }}>{b}</span>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div style={{ padding:"24px 16px",borderTop:"1px solid rgba(255,255,255,0.1)",marginTop:24 }}>
          <p style={{ fontSize:11,color:"rgba(255,255,255,0.5)",textAlign:"center",margin:"0 0 8px" }}>
            © 2026 YourPoodle. Tüm hakları saklıdır.
          </p>
          <div style={{ display:"flex",justifyContent:"center",gap:16 }}>
            {["Gizlilik","Çerezler","KVKK"].map(l => (
              <span key={l} style={{ fontSize:11,color:"rgba(255,255,255,0.5)",cursor:"pointer" }}>
                {l}
              </span>
            ))}
          </div>
        </div>

      </footer>
    </div>
  );
}
