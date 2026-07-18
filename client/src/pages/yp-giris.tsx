import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Loader2, Eye, EyeOff, Lock } from "lucide-react";
import { useCustomer } from "@/contexts/CustomerContext";
import { apiRequest } from "@/lib/queryClient";

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

/* ─── Global CSS ─────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  .auth-root { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }

  /* spin */
  @keyframes auth-spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
  .auth-spin { animation: auth-spin 1s linear infinite; }

  /* inputs */
  .auth-inp {
    width: 100%; height: 48px; border: 1px solid ${C.border}; border-radius: 10px;
    padding: 0 14px; font-size: 15px; font-family: inherit; outline: none;
    background: #fff; color: ${C.text}; transition: border-color .15s, box-shadow .15s;
  }
  .auth-inp:focus { border-color: ${C.primary}; box-shadow: 0 0 0 3px rgba(124,58,237,.13); }
  .auth-inp::placeholder { color: ${C.light}; }
  .auth-inp-wrap { position: relative; }
  .auth-inp-eye { position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; color: ${C.muted}; padding: 0;
    display: flex; align-items: center; }

  /* social button */
  .soc-btn {
    height: 44px; background: #fff; border: 1px solid ${C.border}; border-radius: 10px;
    display: flex; align-items: center; gap: 8px; padding: 0 10px; cursor: pointer;
    font-size: 12px; color: #374151; font-weight: 500; font-family: inherit;
    transition: box-shadow .15s; white-space: nowrap; overflow: hidden;
    min-width: 0;
  }
  .soc-btn:hover { box-shadow: 0 2px 8px rgba(0,0,0,.08); }
  .soc-btn span { overflow: hidden; text-overflow: ellipsis; }

  /* primary button */
  .auth-btn {
    width: 100%; height: 48px; background: ${C.primary}; color: #fff; border: none;
    border-radius: 10px; font-size: 15px; font-weight: 600; font-family: inherit;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    gap: 8px; transition: background .15s;
  }
  .auth-btn:hover:not(:disabled) { background: ${C.primaryHover}; }
  .auth-btn:disabled { opacity: .65; cursor: not-allowed; }

  /* tabs */
  .auth-tab-bar { display: flex; border-bottom: 1px solid ${C.border}; }
  .auth-tab {
    flex: 1; padding: 14px 0; text-align: center; background: none; border: none;
    font-size: 15px; font-family: inherit; cursor: pointer; position: relative;
    color: ${C.muted}; font-weight: 500;
  }
  .auth-tab.active { color: ${C.text}; font-weight: 600; }
  .auth-tab.active::after {
    content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 2px;
    background: ${C.primary}; border-radius: 2px 2px 0 0;
  }

  /* divider */
  .auth-divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; }
  .auth-divider-line { flex: 1; height: 1px; background: ${C.border}; }
  .auth-divider-txt { font-size: 13px; color: ${C.light}; white-space: nowrap; }

  /* otp boxes */
  .otp-boxes { display: flex; gap: 10px; justify-content: center; }
  .otp-box {
    width: 56px; height: 60px; border: 1.5px solid ${C.border}; border-radius: 10px;
    text-align: center; font-size: 24px; font-weight: 700; font-family: inherit;
    outline: none; color: ${C.text}; transition: border-color .15s;
  }
  .otp-box:focus { border-color: ${C.primary}; box-shadow: 0 0 0 3px rgba(124,58,237,.13); }

  /* checkbox */
  .auth-check { width: 16px; height: 16px; accent-color: ${C.primary}; cursor: pointer; }

  /* link-btn */
  .auth-link { background: none; border: none; cursor: pointer; font-family: inherit;
    font-size: 13px; color: ${C.muted}; padding: 0; text-decoration: underline; }
  .auth-link.purple { color: ${C.primary}; font-weight: 600; }

  /* LAYOUT */
  .auth-shell {
    display: flex; min-height: 100vh; min-height: 100dvh;
  }
  .auth-left {
    display: none;
  }
  .auth-right {
    flex: 1; background: ${C.bg}; display: flex; flex-direction: column;
    align-items: center; justify-content: center; position: relative; padding: 24px 16px;
    min-height: 100vh; min-height: 100dvh;
  }

  /* mobile hero banner */
  .auth-mobile-hero { display: none !important; }
  .auth-mobile-hero img {
    position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
  }
  .auth-mobile-hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,.55) 0%, transparent 60%);
  }
  .auth-mobile-logo {
    position: relative; z-index: 1; display: flex; align-items: center; gap: 8px;
    padding: 12px 16px; color: #fff; font-size: 17px; font-weight: 700;
    width: 100%;
  }

  @media (min-width: 1024px) {
    .auth-left {
      display: flex; flex-direction: column; width: 50%; position: relative;
      overflow: hidden;
    }
    .auth-left img.hero-photo {
      position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
    }
    .auth-left-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,.58) 0%, transparent 55%);
    }
    .auth-left-logo {
      position: absolute; top: 32px; left: 32px;
      display: flex; align-items: center; gap: 10px;
      color: #fff; font-size: 18px; font-weight: 600; z-index: 1;
    }
    .auth-left-bottom {
      position: absolute; bottom: 32px; left: 32px; right: 32px; z-index: 1;
    }
    .auth-right {
      width: 50%;
    }
    .auth-mobile-hero { display: none; }
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    .auth-shell { flex-direction: row; }
    .auth-left {
      display: flex; flex-direction: column; width: 40%; position: relative; overflow: hidden;
    }
    .auth-left img.hero-photo {
      position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
    }
    .auth-left-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,.58) 0%, transparent 55%);
    }
    .auth-left-logo {
      position: absolute; top: 24px; left: 24px;
      display: flex; align-items: center; gap: 8px;
      color: #fff; font-size: 16px; font-weight: 600; z-index: 1;
    }
    .auth-left-bottom {
      position: absolute; bottom: 24px; left: 24px; right: 24px; z-index: 1;
    }
    .auth-right { width: 60%; }
    .auth-mobile-hero { display: none; }
  }
`;

/* ─── SVG icons ─────────────────────────────────────────── */
const IconGoogle = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" style={{flexShrink:0}}>
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);
const IconApple = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{flexShrink:0}}>
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);
const IconFacebook = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2" style={{flexShrink:0}}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);
const IconX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{flexShrink:0}}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const IconMicrosoft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" style={{flexShrink:0}}>
    <path fill="#F25022" d="M1 1h10v10H1z"/>
    <path fill="#00A4EF" d="M13 1h10v10H13z"/>
    <path fill="#7FBA00" d="M1 13h10v10H1z"/>
    <path fill="#FFB900" d="M13 13h10v10H13z"/>
  </svg>
);
const IconLinkedIn = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2" style={{flexShrink:0}}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);
const IconPaw = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4.5 10c-1.381 0-2.5-1.343-2.5-3S3.119 4 4.5 4 7 5.343 7 7s-1.119 3-2.5 3zm15 0c-1.381 0-2.5-1.343-2.5-3S18.119 4 19.5 4 22 5.343 22 7s-1.119 3-2.5 3zM8 8C6.619 8 5.5 6.657 5.5 5S6.619 2 8 2s2.5 1.343 2.5 3S9.381 8 8 8zm8 0c-1.381 0-2.5-1.343-2.5-3S14.619 2 16 2s2.5 1.343 2.5 3S17.381 8 16 8zm-4 2c-3.314 0-6 2.686-6 6 0 2.5 1 4 3.5 4.5.5.1 1 .5 2.5.5s2-.4 2.5-.5C17 20 18 18.5 18 16c0-3.314-2.686-6-6-6z"/>
  </svg>
);
const IconUsers = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

/* ─── Toast ─────────────────────────────────────────────── */
function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3500); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)",
      background:"#1a1a1a", color:"#fff", padding:"12px 20px", borderRadius:12,
      fontSize:14, fontWeight:600, zIndex:9999, maxWidth:"90vw", textAlign:"center",
      boxShadow:"0 4px 20px rgba(0,0,0,.3)", whiteSpace:"normal",
      fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"
    }}>{msg}</div>
  );
}

/* ─── Social buttons grid ───────────────────────────────── */
function SocialGrid({ onGoogle }: { onGoogle: () => void }) {
  const stub = (name: string) => () => {
    // handled by parent via toast
    (window as any).__authStubToast?.(name + " ile giriş yakında aktif olacak.");
  };
  const buttons = [
    { icon: <IconGoogle />, label: "Google ile Devam Et",    onClick: onGoogle,        ariaLabel: "Google ile Devam Et" },
    { icon: <IconApple />,  label: "Apple ile Devam Et",     onClick: stub("Apple"),   ariaLabel: "Apple ile Devam Et" },
    { icon: <IconFacebook />, label: "Facebook ile Devam Et",onClick: stub("Facebook"),ariaLabel: "Facebook ile Devam Et" },
    { icon: <IconX />,      label: "X ile Devam Et",         onClick: stub("X"),       ariaLabel: "X ile Devam Et" },
    { icon: <IconMicrosoft />, label: "Microsoft ile Devam Et", onClick: stub("Microsoft"), ariaLabel: "Microsoft ile Devam Et" },
    { icon: <IconLinkedIn />, label: "LinkedIn ile Devam Et",  onClick: stub("LinkedIn"),  ariaLabel: "LinkedIn ile Devam Et" },
  ];
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
      {buttons.map(b => (
        <button key={b.label} className="soc-btn" onClick={b.onClick} aria-label={b.ariaLabel} type="button">
          {b.icon}
          <span style={{overflow:"hidden",textOverflow:"ellipsis"}}>{b.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ─── Phone OTP inline ──────────────────────────────────── */
function PhoneOtpInline({
  onSuccess, onCancel, setToast
}: {
  onSuccess: () => void;
  onCancel: () => void;
  setToast: (m: string) => void;
}) {
  const { loginWithOtp } = useCustomer();
  const [phase, setPhase] = useState<"phone"|"otp"|"register">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp]   = useState(["","","",""]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [countdown, setCd]  = useState(0);
  const otpRefs = useRef<(HTMLInputElement|null)[]>([]);
  const vfyRef  = useRef(false);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCd(c => c-1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const fmt = (v: string) => {
    const d = v.replace(/\D/g,"");
    if (d.length<=3) return d;
    if (d.length<=6) return `${d.slice(0,3)} ${d.slice(3)}`;
    if (d.length<=8) return `${d.slice(0,3)} ${d.slice(3,6)} ${d.slice(6)}`;
    return `${d.slice(0,3)} ${d.slice(3,6)} ${d.slice(6,8)} ${d.slice(8,10)}`;
  };

  const sendOtp = async () => {
    const local = phone.replace(/\D/g,"");
    if (!local.startsWith("5") || local.length < 10) { setError("Geçerli bir numara girin (5XX XXX XX XX)"); return; }
    setError(""); setLoading(true);
    try {
      let deviceToken: string|undefined;
      try { const t = JSON.parse(localStorage.getItem("jetgo_trusted_devices")||"{}"); deviceToken = t[local]; } catch {}
      const res  = await apiRequest("POST", "/api/otp/send", { phone: local, deviceToken });
      const data = await res.json();
      if (data.trustedLogin) { onSuccess(); return; }
      setPhase("otp"); setCd(60); setOtp(["","","",""]); vfyRef.current = false;
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch(e:any) {
      let msg = "SMS gönderilemedi";
      try { msg = JSON.parse(e.message.replace(/^\d+:\s*/,"")).message; } catch {}
      setError(msg);
    } finally { setLoading(false); }
  };

  const doVerify = async (code: string) => {
    const local = phone.replace(/\D/g,"");
    setError(""); setLoading(true);
    try {
      const data = await loginWithOtp(local, code);
      if (data?.requiresRegistration) { setPhase("register"); }
      else { onSuccess(); }
    } catch(e:any) {
      let msg = "Doğrulama kodu hatalı";
      try { msg = JSON.parse(e.message.replace(/^\d+:\s*/,"")).message; } catch {}
      setError(msg); vfyRef.current = false;
    } finally { setLoading(false); }
  };

  const doRegister = async () => {
    if (!name.trim()) { setError("Adınızı girin"); return; }
    const local = phone.replace(/\D/g,"");
    setError(""); setLoading(true);
    try {
      await loginWithOtp(local, otp.join(""), name.trim());
      setToast(`YourPoodle'a hoş geldin, ${name.trim()}! 🎉`);
      setTimeout(onSuccess, 400);
    } catch(e:any) {
      let msg = "Kayıt tamamlanamadı";
      try { msg = JSON.parse(e.message.replace(/^\d+:\s*/,"")).message; } catch {}
      setError(msg);
    } finally { setLoading(false); }
  };

  const handleOtpChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    if (val.length > 1) {
      const digits = val.replace(/\D/g,"").split("");
      const next = ["","","",""].map((_,i) => digits[i]||"");
      setOtp(next);
      otpRefs.current[Math.min(digits.length-1,3)]?.focus();
      if (next.every(d=>d) && !vfyRef.current) { vfyRef.current=true; setTimeout(()=>doVerify(next.join("")),150); }
      return;
    }
    const next=[...otp]; next[idx]=val; setOtp(next);
    if (val && idx<3) otpRefs.current[idx+1]?.focus();
    if (next.every(d=>d) && !vfyRef.current) { vfyRef.current=true; setTimeout(()=>doVerify(next.join("")),150); }
  };

  const inpStyle: React.CSSProperties = {
    width:"100%", height:48, border:`1px solid ${C.border}`, borderRadius:10,
    padding:"0 14px", fontSize:15, fontFamily:"inherit", outline:"none",
    background:"#fff", color:C.text
  };

  return (
    <div style={{marginTop:16, background:"#F5F3FF", borderRadius:12, padding:20, border:`1px solid #DDD6FE`}}>
      {phase==="phone" && (
        <>
          <p style={{fontSize:13,color:C.muted,marginBottom:12}}>Telefon numaranıza SMS kodu gönderilecek:</p>
          <div style={{display:"flex",border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden",background:"#fff",marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:5,padding:"0 10px",borderRight:`1px solid ${C.border}`,background:"#F9FAFB",height:48,flexShrink:0}}>
              <span style={{fontSize:18}}>🇹🇷</span>
              <span style={{fontSize:13,fontWeight:600,color:C.text}}>+90</span>
            </div>
            <input
              className="auth-inp" style={{border:"none",borderRadius:0,height:48,flex:1}}
              type="tel" inputMode="numeric" maxLength={13} placeholder="5XX XXX XX XX"
              value={phone} onChange={e=>setPhone(fmt(e.target.value))}
              onKeyDown={e=>{ if(e.key==="Enter"){ e.preventDefault(); sendOtp(); }}}
            />
          </div>
          {error && <p style={{fontSize:12,color:"#EF4444",marginBottom:8}}>{error}</p>}
          <div style={{display:"flex",gap:8}}>
            <button className="auth-btn" onClick={sendOtp} disabled={loading} style={{flex:1}}>
              {loading && <Loader2 size={16} className="auth-spin" />}
              {loading ? "Gönderiliyor..." : "Kod Gönder"}
            </button>
            <button type="button" onClick={onCancel}
              style={{height:48,padding:"0 16px",border:`1px solid ${C.border}`,borderRadius:10,background:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:14,color:C.muted}}>
              İptal
            </button>
          </div>
        </>
      )}

      {phase==="otp" && (
        <>
          <p style={{fontSize:13,color:C.muted,marginBottom:16}}>
            +90 {phone} numarasına 4 haneli kod gönderildi.
          </p>
          <div className="otp-boxes" style={{marginBottom:12}}>
            {otp.map((d,i) => (
              <input key={i} ref={el=>{ otpRefs.current[i]=el; }} className="otp-box"
                type="tel" inputMode="numeric" maxLength={1} value={d}
                onChange={e=>handleOtpChange(i,e.target.value)}
                onKeyDown={e=>{ if(e.key==="Backspace"&&!otp[i]&&i>0) otpRefs.current[i-1]?.focus(); }}
                autoComplete={i===0?"one-time-code":"off"}
              />
            ))}
          </div>
          {error && <p style={{fontSize:12,color:"#EF4444",marginBottom:8,textAlign:"center"}}>{error}</p>}
          {countdown>0 && <p style={{fontSize:12,color:C.light,textAlign:"center",marginBottom:12}}>Kod {Math.floor(countdown/60)}:{String(countdown%60).padStart(2,"0")} süre geçerli</p>}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <button className="auth-link" onClick={()=>{setPhase("phone");setError("");setOtp(["","","",""]);vfyRef.current=false;}}>← Numarayı değiştir</button>
            {countdown<=0 && <button className="auth-link purple" onClick={sendOtp} disabled={loading}>Tekrar gönder</button>}
          </div>
        </>
      )}

      {phase==="register" && (
        <>
          <p style={{fontSize:13,color:C.muted,marginBottom:12}}>Hesabınızı oluşturmak için adınızı girin:</p>
          <input className="auth-inp" placeholder="Adınız Soyadınız" value={name}
            onChange={e=>setName(e.target.value)} style={{marginBottom:10}}
            onKeyDown={e=>{ if(e.key==="Enter"){ e.preventDefault(); doRegister(); }}}
          />
          {error && <p style={{fontSize:12,color:"#EF4444",marginBottom:8}}>{error}</p>}
          <button className="auth-btn" onClick={doRegister} disabled={loading}>
            {loading && <Loader2 size={16} className="auth-spin" />}
            {loading ? "Kaydediliyor..." : "Hesap Oluştur"}
          </button>
        </>
      )}
    </div>
  );
}

/* ─── Login form ────────────────────────────────────────── */
function LoginForm({ setToast, onSwitchTab, onGuestContinue }: {
  setToast: (m:string)=>void;
  onSwitchTab: ()=>void;
  onGuestContinue: ()=>void;
}) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [showPhone, setShowPhone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError("E-posta adresi girin"); return; }
    if (!password) { setError("Şifre girin"); return; }
    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setLoading(false);
    setToast("E-posta ile giriş yakında aktif olacak. Şifresiz giriş linkini kullanabilirsiniz.");
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Label + input: E-posta */}
      <div style={{marginBottom:16}}>
        <label style={{display:"block",fontSize:14,fontWeight:500,color:"#374151",marginBottom:6}}>E-posta</label>
        <input className="auth-inp" type="email" placeholder="ahmet@email.com"
          value={email} onChange={e=>{setEmail(e.target.value);setError("");}} autoComplete="email" />
      </div>

      {/* Password */}
      <div style={{marginBottom:14}}>
        <label style={{display:"block",fontSize:14,fontWeight:500,color:"#374151",marginBottom:6}}>Şifre</label>
        <div className="auth-inp-wrap">
          <input className="auth-inp" type={showPw?"text":"password"} placeholder="••••••••••••"
            value={password} onChange={e=>{setPassword(e.target.value);setError("");}}
            autoComplete="current-password" style={{paddingRight:42}} />
          <button type="button" className="auth-inp-eye" onClick={()=>setShowPw(p=>!p)} tabIndex={-1}>
            {showPw ? <EyeOff size={18}/> : <Eye size={18}/>}
          </button>
        </div>
      </div>

      {/* Remember me */}
      <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",marginBottom:20}}>
        <input type="checkbox" className="auth-check" checked={remember} onChange={e=>setRemember(e.target.checked)} />
        <span style={{fontSize:14,color:"#374151"}}>Beni hatırla</span>
      </label>

      {error && <p style={{fontSize:12,color:"#EF4444",marginBottom:12,textAlign:"center"}}>{error}</p>}

      <button type="submit" className="auth-btn" disabled={loading}>
        {loading && <Loader2 size={16} className="auth-spin"/>}
        {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
      </button>

      {/* Secondary links row 1 */}
      <div style={{marginTop:16,textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center",gap:12,flexWrap:"wrap"}}>
        <button type="button" className="auth-link" style={{fontSize:13}} onClick={()=>setToast("Şifre sıfırlama e-postası gönderilecek — bu özellik yakında aktif olacak.")}>
          Şifremi unuttum
        </button>
        <span style={{color:C.border}}>|</span>
        <button type="button" className="auth-link" style={{fontSize:13}}
          onClick={()=>setShowPhone(p=>!p)}>
          Şifresiz giriş linki gönder
        </button>
      </div>

      {/* Phone OTP magic link */}
      {showPhone && (
        <PhoneOtpInline
          onSuccess={()=>{}}
          onCancel={()=>setShowPhone(false)}
          setToast={setToast}
        />
      )}

      {/* Row 2 — sign up */}
      <div style={{marginTop:12,textAlign:"center",fontSize:14,color:C.muted}}>
        Hesabınız yok mu?{" "}
        <button type="button" className="auth-link purple" style={{fontSize:14}} onClick={onSwitchTab}>
          Ücretsiz üye olun
        </button>
      </div>

      {/* Row 3 — guest */}
      <div style={{marginTop:8,textAlign:"center"}}>
        <button type="button" className="auth-link" style={{fontSize:13}} onClick={onGuestContinue}>
          Misafir olarak devam et
        </button>
      </div>
    </form>
  );
}

/* ─── Signup form ────────────────────────────────────────── */
function SignupForm({ setToast, onSwitchTab }: { setToast:(m:string)=>void; onSwitchTab:()=>void; }) {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [showPhone, setShowPhone] = useState(false);

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColor = ["transparent","#EF4444","#F59E0B","#22C55E"][strength];
  const strengthLabel = ["","Zayıf","Orta","Güçlü"][strength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Adınızı girin"); return; }
    if (!email.trim()) { setError("E-posta adresi girin"); return; }
    if (password.length < 6) { setError("Şifre en az 6 karakter olmalı"); return; }
    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setLoading(false);
    setToast("E-posta ile kayıt yakında aktif olacak. Şimdilik telefon ile kaydolabilirsiniz.");
    setShowPhone(true);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{marginBottom:16}}>
        <label style={{display:"block",fontSize:14,fontWeight:500,color:"#374151",marginBottom:6}}>Adınız</label>
        <input className="auth-inp" type="text" placeholder="Adınız Soyadınız"
          value={name} onChange={e=>{setName(e.target.value);setError("");}} autoComplete="name" />
      </div>
      <div style={{marginBottom:16}}>
        <label style={{display:"block",fontSize:14,fontWeight:500,color:"#374151",marginBottom:6}}>E-posta</label>
        <input className="auth-inp" type="email" placeholder="ahmet@email.com"
          value={email} onChange={e=>{setEmail(e.target.value);setError("");}} autoComplete="email" />
      </div>
      <div style={{marginBottom:20}}>
        <label style={{display:"block",fontSize:14,fontWeight:500,color:"#374151",marginBottom:6}}>Şifre</label>
        <div className="auth-inp-wrap">
          <input className="auth-inp" type={showPw?"text":"password"} placeholder="En az 6 karakter"
            value={password} onChange={e=>{setPassword(e.target.value);setError("");}}
            autoComplete="new-password" style={{paddingRight:42}} />
          <button type="button" className="auth-inp-eye" onClick={()=>setShowPw(p=>!p)} tabIndex={-1}>
            {showPw ? <EyeOff size={18}/> : <Eye size={18}/>}
          </button>
        </div>
        {/* Strength bar */}
        {password.length > 0 && (
          <div style={{marginTop:6,display:"flex",gap:4,alignItems:"center"}}>
            {[1,2,3].map(i=>(
              <div key={i} style={{flex:1,height:3,borderRadius:2,background:i<=strength?strengthColor:"#E5E7EB",transition:"background .2s"}}/>
            ))}
            <span style={{fontSize:11,color:C.light,marginLeft:4,minWidth:32}}>{strengthLabel}</span>
          </div>
        )}
      </div>

      {error && <p style={{fontSize:12,color:"#EF4444",marginBottom:12,textAlign:"center"}}>{error}</p>}

      <button type="submit" className="auth-btn" disabled={loading}>
        {loading && <Loader2 size={16} className="auth-spin"/>}
        {loading ? "Hesap oluşturuluyor..." : "Hesap Oluştur"}
      </button>

      <p style={{fontSize:12,color:C.light,marginTop:12,textAlign:"center",lineHeight:1.6}}>
        Devam ederek{" "}
        <a href="/yourpoodle/kullanim-sartlari" style={{color:C.primary}}>Kullanım Şartlarını</a>
        {" "}ve{" "}
        <a href="/yourpoodle/gizlilik-politikasi" style={{color:C.primary}}>Gizlilik Politikasını</a>
        {" "}kabul etmiş olursunuz.
      </p>

      <div style={{marginTop:8,textAlign:"center",fontSize:14,color:C.muted}}>
        <button type="button" style={{fontSize:13,color:C.muted,marginBottom:8,display:"block",width:"100%",textAlign:"center",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}
          onClick={()=>setShowPhone(p=>!p)}>
          📱 Telefon ile kaydol
        </button>
      </div>

      {showPhone && (
        <PhoneOtpInline onSuccess={()=>{}} onCancel={()=>setShowPhone(false)} setToast={setToast} />
      )}

      <div style={{marginTop:12,textAlign:"center",fontSize:14,color:C.muted}}>
        Zaten hesabınız var mı?{" "}
        <button type="button" className="auth-link purple" style={{fontSize:14}} onClick={onSwitchTab}>
          Giriş yapın
        </button>
      </div>
    </form>
  );
}

/* ─── Main page ──────────────────────────────────────────── */
export default function YPGiris() {
  const [, navigate] = useLocation();
  const { isLoggedIn } = useCustomer();

  const [returnUrl] = useState(() => {
    const raw = new URLSearchParams(window.location.search).get("returnUrl") || "/yourpoodle/club";
    return (raw.startsWith("/yourpoodle") || raw === "/") ? raw : "/yourpoodle/club";
  });

  const [tab, setTab]   = useState<"login"|"signup">(() =>
    new URLSearchParams(window.location.search).get("tab") === "signup" ? "signup" : "login"
  );
  const [toast, setToastMsg] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  // SEO
  useEffect(() => {
    document.title = "Giriş Yap / Üye Ol | YourPoodle";
    const m = (a:string,k:string,v:string) => {
      let el = document.querySelector(`meta[${a}="${k}"]`) as HTMLMetaElement|null;
      if (!el) { el=document.createElement("meta"); el.setAttribute(a,k); document.head.appendChild(el); }
      el.content=v;
    };
    m("name","robots","noindex, nofollow");
    m("name","description","YourPoodle hesabınıza giriş yapın veya ücretsiz üye olun.");
  }, []);

  useEffect(() => { if (isLoggedIn) navigate(returnUrl); }, [isLoggedIn]);

  // Register stub toast trigger for social buttons
  useEffect(() => {
    (window as any).__authStubToast = setToastMsg;
    return () => { delete (window as any).__authStubToast; };
  }, []);

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await new Promise(r=>setTimeout(r,600));
    setGoogleLoading(false);
    setToastMsg("Google girişi yakında aktif olacak. Şimdilik telefon ile devam edin.");
  };

  const handleGuest = () => {
    localStorage.setItem("yp_guest", JSON.stringify({ isGuest:true, expiresAt:Date.now()+24*60*60*1000 }));
    navigate(returnUrl);
  };

  return (
    <div className="auth-root">
      <style>{CSS}</style>

      {toast && <Toast msg={toast} onDone={()=>setToastMsg("")} />}

      <div className="auth-shell">

        {/* ══ LEFT PHOTO PANEL ══ */}
        <div className="auth-left">
          <img className="hero-photo" src="/images/poodle-real-hero.jpg" alt="Toy Poodle" />
          <div className="auth-left-overlay" />

          {/* Logo top-left */}
          <div className="auth-left-logo">
            <IconPaw />
            <span>YourPoodle</span>
          </div>

          {/* Bottom text */}
          <div className="auth-left-bottom">
            <h2 style={{fontSize:28,fontWeight:700,color:"#fff",lineHeight:1.3,marginBottom:8}}>
              Poodle'ınızın<br/>en iyi arkadaşı
            </h2>
            <p style={{fontSize:15,color:"rgba(255,255,255,.9)",lineHeight:1.6,marginBottom:16}}>
              Beslenme rehberi, sağlık tavsiyeleri ve AI asistan —<br/>tek platformda.
            </p>
            <div style={{display:"flex",alignItems:"center",gap:6,color:"rgba(255,255,255,.8)",fontSize:13}}>
              <IconUsers />
              <span>12.000+ poodle sahibi burada</span>
            </div>
          </div>
        </div>

        {/* ══ RIGHT AUTH PANEL ══ */}
        <div className="auth-right">

          {/* Yardım link */}
          <a href="/yourpoodle/yardim" style={{
            position:"absolute",top:24,right:32,fontSize:14,color:C.muted,
            textDecoration:"none",fontFamily:"inherit"
          }}>Yardım</a>

          {/* Mobile hero banner */}
          <div className="auth-mobile-hero">
            <img src="/images/poodle-real-hero.jpg" alt="Toy Poodle" />
            <div className="auth-mobile-hero-overlay" />
            <div className="auth-mobile-logo">
              <IconPaw />
              <span>YourPoodle</span>
            </div>
          </div>

          {/* Auth card */}
          <div style={{
            background:C.card, maxWidth:420, width:"100%", padding:32,
            borderRadius:16, boxShadow:"0 4px 24px rgba(0,0,0,.08)"
          }}>

            {/* Tab bar */}
            <div className="auth-tab-bar" style={{marginBottom:24}}>
              <button className={`auth-tab${tab==="login"?" active":""}`}
                onClick={()=>setTab("login")} role="tab" aria-selected={tab==="login"}>
                Giriş Yap
              </button>
              <button className={`auth-tab${tab==="signup"?" active":""}`}
                onClick={()=>setTab("signup")} role="tab" aria-selected={tab==="signup"}>
                Üye Ol
              </button>
            </div>

            {/* Social grid */}
            <SocialGrid onGoogle={handleGoogle} />

            {/* Divider */}
            <div className="auth-divider">
              <div className="auth-divider-line"/>
              <span className="auth-divider-txt">veya e-posta ile devam et</span>
              <div className="auth-divider-line"/>
            </div>

            {/* Tab content */}
            {tab==="login" ? (
              <LoginForm
                setToast={setToastMsg}
                onSwitchTab={()=>setTab("signup")}
                onGuestContinue={handleGuest}
              />
            ) : (
              <SignupForm
                setToast={setToastMsg}
                onSwitchTab={()=>setTab("login")}
              />
            )}

            {/* Trust footer */}
            <div style={{
              marginTop:24, textAlign:"center", fontSize:12, color:C.light,
              display:"flex", alignItems:"center", justifyContent:"center", gap:6
            }}>
              <Lock size={12}/>
              <span>256-bit SSL · KVKK uyumlu</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
