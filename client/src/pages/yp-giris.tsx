import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, Loader2, ShieldCheck, Search, X, ChevronDown, Star, Heart, Zap, ChevronRight } from "lucide-react";
import { useCustomer } from "@/contexts/CustomerContext";
import { apiRequest } from "@/lib/queryClient";
import YPLayout from "@/components/yourpoodle/YPLayout";

/* ─── Country codes ─────────────────────────────────────── */
const COUNTRIES = [
  { code:"TR", dial:"+90",  flag:"🇹🇷", name:"Türkiye" },
  { code:"DE", dial:"+49",  flag:"🇩🇪", name:"Almanya" },
  { code:"NL", dial:"+31",  flag:"🇳🇱", name:"Hollanda" },
  { code:"AT", dial:"+43",  flag:"🇦🇹", name:"Avusturya" },
  { code:"BE", dial:"+32",  flag:"🇧🇪", name:"Belçika" },
  { code:"FR", dial:"+33",  flag:"🇫🇷", name:"Fransa" },
  { code:"GB", dial:"+44",  flag:"🇬🇧", name:"İngiltere" },
  { code:"CH", dial:"+41",  flag:"🇨🇭", name:"İsviçre" },
  { code:"SE", dial:"+46",  flag:"🇸🇪", name:"İsveç" },
  { code:"NO", dial:"+47",  flag:"🇳🇴", name:"Norveç" },
  { code:"DK", dial:"+45",  flag:"🇩🇰", name:"Danimarka" },
  { code:"FI", dial:"+358", flag:"🇫🇮", name:"Finlandiya" },
  { code:"IT", dial:"+39",  flag:"🇮🇹", name:"İtalya" },
  { code:"ES", dial:"+34",  flag:"🇪🇸", name:"İspanya" },
  { code:"PT", dial:"+351", flag:"🇵🇹", name:"Portekiz" },
  { code:"GR", dial:"+30",  flag:"🇬🇷", name:"Yunanistan" },
  { code:"RU", dial:"+7",   flag:"🇷🇺", name:"Rusya" },
  { code:"UA", dial:"+380", flag:"🇺🇦", name:"Ukrayna" },
  { code:"US", dial:"+1",   flag:"🇺🇸", name:"ABD" },
  { code:"CA", dial:"+1",   flag:"🇨🇦", name:"Kanada" },
  { code:"AU", dial:"+61",  flag:"🇦🇺", name:"Avustralya" },
  { code:"AE", dial:"+971", flag:"🇦🇪", name:"BAE" },
  { code:"SA", dial:"+966", flag:"🇸🇦", name:"S. Arabistan" },
  { code:"QA", dial:"+974", flag:"🇶🇦", name:"Katar" },
  { code:"KW", dial:"+965", flag:"🇰🇼", name:"Kuveyt" },
  { code:"AZ", dial:"+994", flag:"🇦🇿", name:"Azerbaycan" },
  { code:"KZ", dial:"+7",   flag:"🇰🇿", name:"Kazakistan" },
  { code:"JP", dial:"+81",  flag:"🇯🇵", name:"Japonya" },
  { code:"CN", dial:"+86",  flag:"🇨🇳", name:"Çin" },
  { code:"KR", dial:"+82",  flag:"🇰🇷", name:"Güney Kore" },
];

const BREEDS = ["Toy Poodle","Miniature Poodle","Standard Poodle","Moyen Poodle"];
const CITIES = ["İstanbul","Ankara","İzmir","Bursa","Antalya","Samsun","Adana","Gaziantep","Konya","Kayseri","Diğer"];

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; }
  input[type=number] { -moz-appearance: textfield; }
  .yp-btn { border: none; cursor: pointer; font-family: Inter, sans-serif; font-weight: 800; transition: opacity 0.12s, transform 0.1s; }
  .yp-btn:active { opacity: 0.88; transform: scale(0.97); }
  .yp-inp:focus { border-color: #7C3AFF !important; box-shadow: 0 0 0 3px rgba(124,58,255,0.14); outline: none; }
  .country-row:hover { background: #F5F0FF !important; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }

  /* ── layout ── */
  .giris-wrap {
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 56px);
    background: #fff;
    font-family: Inter, sans-serif;
  }
  /* left branding panel */
  .giris-left { display: none; }
  /* right form panel */
  .giris-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #fff;
  }
  /* mobile hero (replaces left panel on small screens) */
  .giris-mobile-hero {
    display: block;
    background: linear-gradient(135deg,#7C3AFF,#A855F7);
    padding: 24px 24px 32px;
    position: relative;
    overflow: hidden;
  }
  /* mobile back header */
  .giris-mobile-hdr {
    display: flex;
    align-items: center;
    padding: 14px 16px 12px;
    border-bottom: 1px solid #f2f2f2;
  }
  /* breadcrumb — desktop only */
  .giris-breadcrumb { display: none; }

  @media (min-width: 900px) {
    .giris-wrap {
      flex-direction: row;
      min-height: calc(100vh - 64px);
    }
    .giris-left {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      width: 45%;
      background: linear-gradient(145deg,#5B21B6 0%,#7C3AFF 50%,#A855F7 100%);
      padding: 64px 56px;
      position: relative;
      overflow: hidden;
    }
    .giris-right {
      width: 55%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0;
      background: #fff;
      overflow-y: auto;
    }
    .giris-form-inner  { width: 100%; max-width: 460px; padding: 48px 0; animation: fadeUp 0.3s ease; }
    .giris-mobile-hero { display: none; }
    .giris-mobile-hdr  { display: none; }
    .giris-breadcrumb  { display: flex; }
  }
`;

function formatLocal(val: string) {
  const d = val.replace(/\D/g, "");
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0,3)} ${d.slice(3)}`;
  if (d.length <= 8) return `${d.slice(0,3)} ${d.slice(3,6)} ${d.slice(6)}`;
  return `${d.slice(0,3)} ${d.slice(3,6)} ${d.slice(6,8)} ${d.slice(8,10)}`;
}

function validatePhone(local: string, code: string): string | null {
  if (code === "TR") {
    if (local.length === 0) return "Telefon numarası girin";
    if (!local.startsWith("5")) return "Türkiye numaraları 5 ile başlamalıdır (5XX XXX XX XX)";
    if (local.length < 10) return `${10 - local.length} hane daha girin`;
  } else {
    if (local.length < 7) return "Geçerli bir telefon numarası girin";
  }
  return null;
}

function Steps({ step }: { step: "phone" | "otp" | "register" }) {
  const labels = ["Telefon", "Doğrulama", "Profil"];
  const idx = step === "phone" ? 0 : step === "otp" ? 1 : 2;
  return (
    <div style={{ display:"flex", alignItems:"center", marginBottom:28 }}>
      {labels.map((s, i) => (
        <div key={s} style={{ display:"flex", alignItems:"center", flex:1 }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:1 }}>
            <div style={{ width:30, height:30, borderRadius:"50%", background:i<=idx?"#7C3AFF":"#f0f0f0", color:i<=idx?"#fff":"#bbb", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, transition:"all 0.2s" }}>
              {i < idx ? "✓" : i+1}
            </div>
            <span style={{ fontSize:11, fontWeight:600, color:i<=idx?"#7C3AFF":"#bbb", marginTop:5 }}>{s}</span>
          </div>
          {i < labels.length-1 && <div style={{ height:2, flex:1, background:i<idx?"#7C3AFF":"#f0f0f0", marginBottom:18, transition:"background 0.3s" }} />}
        </div>
      ))}
    </div>
  );
}

function CountryPicker({ selected, onSelect, onClose }: {
  selected: typeof COUNTRIES[0];
  onSelect: (c: typeof COUNTRIES[0]) => void;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const filtered = COUNTRIES.filter(c =>
    q === "" || c.name.toLowerCase().includes(q.toLowerCase()) || c.dial.includes(q) || c.code.toLowerCase().includes(q.toLowerCase())
  );
  return (
    <div style={{ position:"fixed", inset:0, zIndex:9999, display:"flex", flexDirection:"column", background:"rgba(0,0,0,0.45)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ margin:"auto", background:"#fff", borderRadius:20, width:"90%", maxWidth:420, maxHeight:"80vh", display:"flex", flexDirection:"column", boxShadow:"0 20px 60px rgba(0,0,0,0.25)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 18px 12px", borderBottom:"1px solid #f0f0f0" }}>
          <span style={{ fontSize:16, fontWeight:800, color:"#1a1a1a" }}>Ülke Kodu Seç</span>
          <button onClick={onClose} style={{ background:"#F5F5F5", border:"none", borderRadius:8, padding:6, cursor:"pointer", display:"flex" }}><X size={18} color="#555" /></button>
        </div>
        <div style={{ padding:"10px 16px", borderBottom:"1px solid #f8f8f8" }}>
          <div style={{ display:"flex", alignItems:"center", background:"#F7F7F7", borderRadius:12, height:42, overflow:"hidden", border:"1.5px solid #eee" }}>
            <div style={{ paddingLeft:12, color:"#bbb", display:"flex" }}><Search size={16} strokeWidth={2} /></div>
            <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Ülke ara..." style={{ flex:1, border:"none", outline:"none", fontSize:14, color:"#333", background:"transparent", padding:"0 10px", fontFamily:"Inter,sans-serif" }} />
            {q && <button onClick={() => setQ("")} style={{ background:"none", border:"none", cursor:"pointer", paddingRight:10, color:"#bbb" }}><X size={14} /></button>}
          </div>
        </div>
        <div style={{ overflowY:"auto", flex:1 }}>
          {filtered.map(c => (
            <button key={c.code+c.dial} className="country-row" onClick={() => { onSelect(c); onClose(); }}
              style={{ display:"flex", alignItems:"center", gap:12, width:"100%", padding:"13px 18px", border:"none", borderBottom:"1px solid #fafafa", cursor:"pointer", background:c.code===selected.code && c.dial===selected.dial?"#F5F0FF":"#fff", textAlign:"left", fontFamily:"Inter,sans-serif", transition:"background 0.1s" }}>
              <span style={{ fontSize:22, lineHeight:1 }}>{c.flag}</span>
              <span style={{ flex:1, fontSize:14, fontWeight:600, color:c.code===selected.code?"#7C3AFF":"#222" }}>{c.name}</span>
              <span style={{ fontSize:14, fontWeight:700, color:"#888" }}>{c.dial}</span>
              {c.code===selected.code && c.dial===selected.dial && <span style={{ fontSize:16, color:"#7C3AFF" }}>✓</span>}
            </button>
          ))}
          {filtered.length === 0 && <div style={{ padding:"32px", textAlign:"center", color:"#aaa", fontSize:13 }}>Sonuç bulunamadı</div>}
        </div>
      </div>
    </div>
  );
}

const GoogleLogo = () => (
  <svg width="20" height="20" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3500); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position:"fixed", bottom:90, left:"50%", transform:"translateX(-50%)", background:"#1a1a1a", color:"#fff", padding:"10px 20px", borderRadius:12, fontSize:13, fontWeight:600, zIndex:9000, whiteSpace:"normal", boxShadow:"0 4px 20px rgba(0,0,0,0.3)", maxWidth:"90vw", textAlign:"center" }}>
      {msg}
    </div>
  );
}

/* ─── Schemas ───────────────────────────────────────────── */
const webPageSchema = {
  "@context":"https://schema.org",
  "@type":"WebPage",
  "name":"Giriş Yap / Üye Ol",
  "description":"YourPoodle hesabınıza giriş yapın veya ücretsiz üye olun. Telefon veya Google ile hızlı kayıt.",
  "url":"https://www.yourpoodle.com/yourpoodle/giris",
  "isPartOf":{ "@id":"https://www.yourpoodle.com/#website" },
  "potentialAction":{
    "@type":"RegisterAction",
    "target":{
      "@type":"EntryPoint",
      "urlTemplate":"https://www.yourpoodle.com/yourpoodle/giris",
      "actionPlatform":["http://schema.org/DesktopWebPlatform","http://schema.org/MobileWebPlatform"]
    }
  }
};
const breadcrumbSchema = {
  "@context":"https://schema.org",
  "@type":"BreadcrumbList",
  "itemListElement":[
    { "@type":"ListItem","position":1,"name":"Ana Sayfa","item":"https://www.yourpoodle.com/yourpoodle" },
    { "@type":"ListItem","position":2,"name":"Giriş Yap","item":"https://www.yourpoodle.com/yourpoodle/giris" }
  ]
};
const faqSchema = {
  "@context":"https://schema.org",
  "@type":"FAQPage",
  "mainEntity":[
    { "@type":"Question","name":"YourPoodle'a nasıl üye olurum?","acceptedAnswer":{ "@type":"Answer","text":"Telefon numaranızı girin, SMS ile gelen kodu onaylayın ve profilinizi oluşturun. 2 dakikada tamamlanır." } },
    { "@type":"Question","name":"Üyelik ücretsiz mi?","acceptedAnswer":{ "@type":"Answer","text":"Evet, YourPoodle üyeliği tamamen ücretsizdir. Gizli ücret yoktur." } },
    { "@type":"Question","name":"Telefon numaram neden isteniyor?","acceptedAnswer":{ "@type":"Answer","text":"Telefon numaranız yalnızca kimlik doğrulama için kullanılır. SMS doğrulaması güvenliğinizi korur." } },
    { "@type":"Question","name":"Google ile giriş güvenli mi?","acceptedAnswer":{ "@type":"Answer","text":"Evet, Google OAuth 2.0 standart güvenlik protokolünü kullanır. Şifreniz bizimle paylaşılmaz." } },
    { "@type":"Question","name":"Misafir olarak ne yapabilirim?","acceptedAnswer":{ "@type":"Answer","text":"Misafir olarak içerikleri görüntüleyebilirsiniz. Beğeni, yorum ve paylaşım için üye olmanız gerekir." } }
  ]
};

/* ─── Main ───────────────────────────────────────────────── */
export default function YPGiris() {
  const [, navigate]    = useLocation();
  const { loginWithOtp, isLoggedIn } = useCustomer();

  // returnUrl — whitelist: only /yourpoodle/* paths or /
  const [returnUrl] = useState(() => {
    const raw = new URLSearchParams(window.location.search).get("returnUrl") || "/yourpoodle/club";
    return (raw.startsWith("/yourpoodle") || raw === "/") ? raw : "/yourpoodle/club";
  });

  const [step,         setStep]        = useState<"phone"|"otp"|"register">("phone");
  const [country,      setCountry]     = useState(COUNTRIES[0]);
  const [pickerOpen,   setPickerOpen]  = useState(false);
  const [phone,        setPhone]       = useState("");
  const [otp,          setOtp]         = useState(["","","",""]);
  const [name,         setName]        = useState("");
  const [poodleName,   setPoodleName]  = useState("");
  const [poodleBreed,  setPoodleBreed] = useState("Toy Poodle");
  const [city,         setCity]        = useState("");
  const [loading,      setLoading]     = useState(false);
  const [googleLoading,setGoogleLoading] = useState(false);
  const [autoVfy,      setAutoVfy]     = useState(false);
  const [error,        setError]       = useState("");
  const [countdown,    setCountdown]   = useState(0);
  const [toast,        setToast]       = useState("");

  const otpRefs = useRef<(HTMLInputElement|null)[]>([]);
  const vfyRef  = useRef(false);

  // Single-set SEO — noindex for auth page
  useEffect(() => {
    document.title = "Giriş Yap / Üye Ol | YourPoodle";
    const setMeta = (attr: string, key: string, val: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
      el.content = val;
    };
    setMeta("name",     "description",   "YourPoodle hesabınıza giriş yapın veya ücretsiz üye olun. Telefon veya Google ile hızlı kayıt.");
    setMeta("property", "og:title",      "Giriş Yap / Üye Ol | YourPoodle");
    setMeta("property", "og:description","YourPoodle hesabınıza giriş yapın veya ücretsiz üye olun.");
    setMeta("property", "og:type",       "website");
    setMeta("property", "og:url",        "https://www.yourpoodle.com/yourpoodle/giris");
    setMeta("name",     "robots",        "noindex, nofollow");
    // Remove duplicate og tags
    ["og:title","og:description","og:type"].forEach(prop => {
      document.querySelectorAll(`meta[property="${prop}"]`).forEach((el, i) => { if (i > 0) el.remove(); });
    });
    // canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    canonical.href = "https://www.yourpoodle.com/yourpoodle/giris";
  }, []);

  // Already logged in → go to returnUrl
  useEffect(() => { if (isLoggedIn) navigate(returnUrl); }, [isLoggedIn]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c-1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // Web OTP API (auto-fill SMS code)
  useEffect(() => {
    if (step !== "otp") return;
    if (!("OTPCredential" in window)) return;
    const ac = new AbortController();
    (navigator as any).credentials
      .get({ otp: { transport: ["sms"] }, signal: ac.signal })
      .then((res: any) => {
        if (!res?.code) return;
        const d = res.code.replace(/\D/g,"");
        if (d.length === 4) {
          setOtp(d.split(""));
          if (!vfyRef.current) { vfyRef.current = true; setTimeout(() => doVerify(d), 150); }
        }
      }).catch(()=>{});
    return () => ac.abort();
  }, [step]);

  const sendOtp = async () => {
    const local = phone.replace(/\D/g,"");
    const phoneError = validatePhone(local, country.code);
    if (phoneError) { setError(phoneError); return; }
    const normalized = country.code === "TR" ? local : `${country.dial.replace("+","")}${local}`;
    setError(""); setLoading(true);
    try {
      let deviceToken: string|undefined;
      try { const t = JSON.parse(localStorage.getItem("jetgo_trusted_devices")||"{}"); deviceToken = t[normalized]; } catch {}
      const res  = await apiRequest("POST", "/api/otp/send", { phone: normalized, deviceToken });
      const data = await res.json();
      if (data.trustedLogin) { navigate(returnUrl); return; }
      setStep("otp"); setCountdown(60);
      setOtp(["","","",""]); vfyRef.current = false;
      setTimeout(() => otpRefs.current[0]?.focus(), 120);
    } catch (e: any) {
      let msg = "SMS gönderilemedi, tekrar deneyin";
      try { msg = JSON.parse(e.message.replace(/^\d+:\s*/,"")).message; } catch {}
      setError(msg);
    } finally { setLoading(false); }
  };

  const doVerify = async (code: string) => {
    const local = phone.replace(/\D/g,"");
    const normalized = country.code === "TR" ? local : `${country.dial.replace("+","")}${local}`;
    setError(""); setLoading(true); setAutoVfy(true);
    try {
      const data = await loginWithOtp(normalized, code);
      if (data?.requiresRegistration) { setStep("register"); }
      else { navigate(returnUrl); }
    } catch (e: any) {
      let msg = "Doğrulama kodu hatalı";
      try { msg = JSON.parse(e.message.replace(/^\d+:\s*/,"")).message; } catch {}
      if (msg.toLowerCase().includes("süre") || msg.toLowerCase().includes("expire")) {
        msg = "Kodun süresi doldu, yeni kod isteyin";
      }
      setError(msg); vfyRef.current = false;
    } finally { setLoading(false); setAutoVfy(false); }
  };

  const doRegister = async () => {
    if (!name.trim()) { setError("Adınızı girin"); return; }
    const local = phone.replace(/\D/g,"");
    const normalized = country.code === "TR" ? local : `${country.dial.replace("+","")}${local}`;
    setError(""); setLoading(true);
    try {
      await loginWithOtp(normalized, otp.join(""), name.trim());
      // Save poodle profile info locally — picked up by Club/Poodlem tab
      if (poodleName.trim()) {
        localStorage.setItem("yp_poodle", JSON.stringify({ name: poodleName.trim(), breed: poodleBreed, city: city.trim() }));
      }
      setToast(`YourPoodle'a hoş geldin, ${name.trim()}! 🎉`);
      setTimeout(() => navigate(returnUrl), 400);
    } catch (e: any) {
      let msg = "Kayıt tamamlanamadı";
      try { msg = JSON.parse(e.message.replace(/^\d+:\s*/,"")).message; } catch {}
      setError(msg);
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    // Google OAuth requires Cloud Console setup — show friendly message
    await new Promise(r => setTimeout(r, 600));
    setGoogleLoading(false);
    setToast("Google girişi yakında aktif olacak 🚀 Şimdilik telefon ile devam edin.");
  };

  const handleGuestContinue = () => {
    localStorage.setItem("yp_guest", JSON.stringify({ isGuest: true, expiresAt: Date.now() + 24*60*60*1000 }));
    navigate(returnUrl);
  };

  const handleOtpChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    if (val.length > 1) {
      const digits = val.replace(/\D/g,"").split("");
      const next = ["","","",""].map((_,i) => digits[i]||"");
      setOtp(next);
      otpRefs.current[Math.min(digits.length-1, 3)]?.focus();
      if (next.every(d=>d) && !vfyRef.current) { vfyRef.current=true; setTimeout(()=>doVerify(next.join("")), 150); }
      return;
    }
    const next = [...otp]; next[idx]=val; setOtp(next);
    if (val && idx < 3) otpRefs.current[idx+1]?.focus();
    if (next.every(d=>d) && !vfyRef.current) { vfyRef.current=true; setTimeout(()=>doVerify(next.join("")), 150); }
  };
  const handleOtpKey = (idx: number, e: React.KeyboardEvent) => {
    if (e.key==="Backspace" && !otp[idx] && idx>0) otpRefs.current[idx-1]?.focus();
  };

  const maskedPhone = () => {
    const d = phone.replace(/\D/g,"");
    if (d.length < 4) return `${country.dial} ${phone}`;
    return `${country.dial} ${d.slice(0,3)} *** ** ${d.slice(-2)}`;
  };

  const fmtCountdown = () => `${Math.floor(countdown/60)}:${String(countdown%60).padStart(2,"0")}`;

  return (
    <YPLayout activeLink="/yourpoodle/giris" authMode={true} constrain={false}>
      <style>{CSS}</style>

      {/* Structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {pickerOpen && <CountryPicker selected={country} onSelect={setCountry} onClose={() => setPickerOpen(false)} />}
      {toast && <Toast msg={toast} onDone={() => setToast("")} />}

      <main>
        <div className="giris-wrap">

          {/* ══════════ LEFT PANEL (desktop only) ══════════ */}
          <div className="giris-left">
            <div style={{ position:"absolute", top:-80, right:-80, width:300, height:300, borderRadius:"50%", background:"rgba(255,255,255,0.07)" }} />
            <div style={{ position:"absolute", bottom:-60, left:-60, width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,0.05)" }} />
            <div style={{ position:"absolute", top:"40%", right:30, width:120, height:120, borderRadius:"50%", background:"rgba(255,255,255,0.04)" }} />

            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:48 }}>
              <div style={{ width:52, height:52, borderRadius:14, background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, backdropFilter:"blur(10px)" }}>🐩</div>
              <span style={{ fontSize:26, fontWeight:900, color:"#fff", letterSpacing:"-0.5px" }}>YourPoodle</span>
            </div>

            {/* H2 — not H1 — for the branding headline */}
            <h2 style={{ fontSize:38, fontWeight:900, color:"#fff", lineHeight:1.15, marginBottom:16, letterSpacing:"-0.5px" }}>
              Poodle'ınızın<br />en iyi arkadaşı
            </h2>
            <p style={{ fontSize:16, color:"rgba(255,255,255,0.78)", lineHeight:1.7, marginBottom:48, maxWidth:340 }}>
              Beslenme rehberi, sağlık tavsiyeleri, eğitim ipuçları ve daha fazlası — hepsi tek platformda.
            </p>

            {[
              { icon: <Star size={16} strokeWidth={2.5} />, text: "Kişiselleştirilmiş mama önerileri" },
              { icon: <Heart size={16} strokeWidth={2.5} />, text: "Sağlık takip ve veteriner tavsiyeleri" },
              { icon: <Zap size={16} strokeWidth={2.5} />,  text: "AI destekli anlık sorular" },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
                <div style={{ width:32, height:32, borderRadius:9, background:"rgba(255,255,255,0.18)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", flexShrink:0 }}>{icon}</div>
                <span style={{ fontSize:14, color:"rgba(255,255,255,0.88)", fontWeight:600 }}>{text}</span>
              </div>
            ))}

            {/* Testimonial */}
            <div style={{ marginTop:40, background:"rgba(255,255,255,0.12)", borderRadius:16, padding:"18px 20px", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.15)" }}>
              <div style={{ fontSize:13, color:"rgba(255,255,255,0.9)", lineHeight:1.6, marginBottom:10 }}>
                "Toy Poodle'ım için en doğru mamayı YourPoodle sayesinde buldum. AI asistan çok yardımcı oldu!"
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:28, height:28, borderRadius:"50%", background:"rgba(255,255,255,0.25)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>🐩</div>
                <div>
                  <div style={{ fontSize:12, fontWeight:800, color:"#fff" }}>Ayşe K.</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)" }}>Miniature Poodle sahibi</div>
                </div>
                <div style={{ marginLeft:"auto", color:"#FBBF24", fontSize:13, letterSpacing:1 }}>★★★★★</div>
              </div>
            </div>
          </div>

          {/* ══════════ MOBILE HERO ══════════ */}
          <div className="giris-mobile-hero">
            <div style={{ position:"absolute", top:-30, right:-30, width:120, height:120, borderRadius:"50%", background:"rgba(255,255,255,0.08)" }} />
            <div style={{ position:"absolute", bottom:-20, left:-10, width:80, height:80, borderRadius:"50%", background:"rgba(255,255,255,0.06)" }} />
            <div style={{ fontSize:30, marginBottom:6 }}>🐩</div>
            {/* p — NOT h1 — mobile contextual subtitle */}
            <p style={{ fontSize:20, fontWeight:900, color:"#fff", marginBottom:4, lineHeight:1.2 }}>
              {step==="phone" ? "Hoş Geldiniz!" : step==="otp" ? "Kodu Girin" : "Profil Tamamla"}
            </p>
            <p style={{ fontSize:13, color:"rgba(255,255,255,0.82)", lineHeight:1.5 }}>
              {step==="phone" ? "YourPoodle topluluğuna katılın." : step==="otp" ? maskedPhone() + " numarasına kod gönderdik." : "Hesap oluşturmak için bilgilerinizi paylaşın."}
            </p>
          </div>

          {/* ══════════ RIGHT PANEL / FORM ══════════ */}
          <div className="giris-right">

            {/* Mobile back header */}
            <div className="giris-mobile-hdr">
              <button onClick={() => step==="phone" ? navigate("/yourpoodle") : setStep("phone")}
                style={{ background:"#F5F5F5", border:"none", borderRadius:10, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", marginRight:10 }}>
                <ChevronLeft size={18} color="#333" />
              </button>
              <span style={{ fontSize:14, fontWeight:700, color:"#333" }}>YourPoodle</span>
            </div>

            <div className="giris-form-inner">

              {/* Visible breadcrumb — desktop only */}
              <nav className="giris-breadcrumb" aria-label="Breadcrumb"
                style={{ alignItems:"center", gap:5, marginBottom:24, fontSize:12, color:"#aaa" }}>
                <button onClick={() => navigate("/yourpoodle")} style={{ background:"none", border:"none", cursor:"pointer", color:"#888", fontSize:12, fontFamily:"Inter,sans-serif", padding:0 }}>Ana Sayfa</button>
                <ChevronRight size={12} color="#ccc" />
                <span style={{ color:"#333", fontWeight:700, fontFamily:"Inter,sans-serif" }}>Giriş Yap</span>
              </nav>

              {/* THE SINGLE H1 — visible on all screen sizes */}
              <h1 style={{ fontSize:26, fontWeight:900, color:"#1a1a1a", marginBottom:6, letterSpacing:"-0.3px", lineHeight:1.2 }}>
                Giriş Yap / Üye Ol
              </h1>
              <p style={{ fontSize:14, color:"#888", marginBottom:28, lineHeight:1.6 }}>
                {step==="phone" ? "YourPoodle topluluğuna hoş geldiniz." : step==="otp" ? `${maskedPhone()} numarasına SMS gönderildi.` : "Hesap oluşturmak için profilinizi tamamlayın."}
              </p>

              <form onSubmit={e => {
                e.preventDefault();
                if (step==="phone") sendOtp();
                else if (step==="otp") doVerify(otp.join(""));
                else doRegister();
              }} noValidate>
                <div style={{ background:"#fff" }}>
                  <Steps step={step} />

                  {/* ═══ PHONE STEP ═══ */}
                  {step==="phone" && (
                    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

                      {/* Google */}
                      <button type="button" onClick={handleGoogle} disabled={googleLoading} className="yp-btn"
                        style={{ height:50, borderRadius:14, background:"#fff", border:"1.5px solid #e0e0e0", color:"#333", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center", gap:10, opacity:googleLoading?0.7:1 }}>
                        {googleLoading ? <Loader2 size={18} style={{ animation:"spin 1s linear infinite" }} /> : <GoogleLogo />}
                        <span style={{ fontWeight:700 }}>{googleLoading ? "Bağlanıyor..." : "Google ile Devam Et"}</span>
                      </button>

                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ flex:1, height:1, background:"#f0f0f0" }} />
                        <span style={{ fontSize:11, color:"#ccc", fontWeight:600 }}>ya da telefon ile</span>
                        <div style={{ flex:1, height:1, background:"#f0f0f0" }} />
                      </div>

                      <div>
                        <label htmlFor="phone" style={{ fontSize:12, fontWeight:700, color:"#555", display:"block", marginBottom:8 }}>Telefon Numarası</label>
                        <div style={{ display:"flex", border:"2px solid #e8e8e8", borderRadius:14, overflow:"hidden", background:"#fafafa", transition:"border-color 0.2s" }}>
                          <button type="button" onClick={() => setPickerOpen(true)}
                            style={{ display:"flex", alignItems:"center", gap:5, padding:"0 10px 0 12px", borderRight:"1px solid #e8e8e8", background:"#f5f5f5", border:"none", cursor:"pointer", flexShrink:0, height:52 }}>
                            <span style={{ fontSize:20, lineHeight:1 }}>{country.flag}</span>
                            <span style={{ fontSize:13, fontWeight:700, color:"#333" }}>{country.dial}</span>
                            <ChevronDown size={13} color="#888" strokeWidth={2.5} />
                          </button>
                          <input
                            className="yp-inp"
                            type="tel"
                            id="phone"
                            name="phone"
                            autoComplete="tel"
                            inputMode="numeric"
                            maxLength={country.code==="TR" ? 12 : 20}
                            value={phone}
                            onChange={e => {
                              const val = formatLocal(e.target.value);
                              setPhone(val);
                              const d = val.replace(/\D/g,"");
                              if (country.code==="TR" && d.length > 0 && !d.startsWith("5")) {
                                setError("Türkiye numaraları 5 ile başlamalıdır");
                              } else if (error) {
                                setError("");
                              }
                            }}
                            onKeyDown={e => { if (e.key==="Enter") { e.preventDefault(); sendOtp(); } }}
                            placeholder={country.code==="TR" ? "5XX XXX XX XX" : "Telefon no."}
                            aria-label="Telefon numarası"
                            style={{ flex:1, border:"none", padding:"0 14px", fontSize:18, fontWeight:700, letterSpacing:1, color:"#222", background:"transparent", height:52, fontFamily:"Inter,sans-serif", outline:"none" }}
                          />
                        </div>
                        {error && <p role="alert" style={{ fontSize:12, color:"#EF4444", marginTop:6, fontWeight:600 }}>{error}</p>}
                      </div>

                      <button type="submit" className="yp-btn" disabled={loading}
                        style={{ height:54, borderRadius:16, background:loading?"#c4b5fd":"linear-gradient(135deg,#7C3AFF,#A855F7)", color:"#fff", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                        {loading && <Loader2 size={20} style={{ animation:"spin 1s linear infinite" }} />}
                        {loading ? "Gönderiliyor..." : "Devam Et →"}
                      </button>

                      <button type="button" className="yp-btn" onClick={handleGuestContinue}
                        style={{ height:48, borderRadius:14, background:"#F5F0FF", color:"#7C3AFF", fontSize:14 }}>
                        Misafir Olarak Devam Et
                      </button>

                      <p style={{ fontSize:11, color:"#bbb", textAlign:"center", lineHeight:1.7 }}>
                        Devam ederek{" "}
                        <a href="/yourpoodle/kullanim-sartlari" target="_blank" rel="noopener noreferrer"
                          style={{ color:"#7C3AFF", fontWeight:700, textDecoration:"underline" }}>Kullanım Şartlarını</a>
                        {" "}ve{" "}
                        <a href="/yourpoodle/gizlilik-politikasi" target="_blank" rel="noopener noreferrer"
                          style={{ color:"#7C3AFF", fontWeight:700, textDecoration:"underline" }}>Gizlilik Politikasını</a>
                        {" "}kabul etmiş olursunuz.
                      </p>
                    </div>
                  )}

                  {/* ═══ OTP STEP ═══ */}
                  {step==="otp" && (
                    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

                      {/* Info banner */}
                      <div style={{ background:"#F0FDF4", borderRadius:12, padding:"12px 16px", border:"1.5px solid #BBF7D0", display:"flex", gap:10, alignItems:"center" }}>
                        <span style={{ fontSize:18 }}>📱</span>
                        <div>
                          <div style={{ fontSize:13, fontWeight:800, color:"#15803D" }}>Kod gönderildi</div>
                          <div style={{ fontSize:12, color:"#16A34A" }}>{maskedPhone()}</div>
                        </div>
                      </div>

                      <div style={{ textAlign:"center" }}>
                        <div style={{ display:"flex", gap:12, justifyContent:"center", marginBottom:6 }}>
                          {otp.map((d,i) => (
                            <input key={i} ref={el => otpRefs.current[i]=el}
                              type="text" id={`otp-${i}`} name={i===0?"otp":undefined}
                              autoComplete={i===0?"one-time-code":undefined}
                              inputMode="numeric" maxLength={4} value={d}
                              onChange={e => handleOtpChange(i,e.target.value)}
                              onKeyDown={e => handleOtpKey(i,e)}
                              aria-label={`OTP rakam ${i+1}`}
                              style={{ width:64, height:72, borderRadius:16, textAlign:"center", fontSize:28, fontWeight:900, fontFamily:"Inter,sans-serif", border:`2.5px solid ${d?"#7C3AFF":"#e8e8e8"}`, background:d?"#F5F0FF":"#fafafa", color:"#7C3AFF", outline:"none", transition:"all 0.15s", caretColor:"#7C3AFF" }} />
                          ))}
                        </div>
                        {error && <p role="alert" style={{ fontSize:12, color:"#EF4444", fontWeight:600, marginTop:6 }}>{error}</p>}
                      </div>

                      {autoVfy && (
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, color:"#7C3AFF", fontSize:13, fontWeight:700 }}>
                          <Loader2 size={16} style={{ animation:"spin 1s linear infinite" }} /> Doğrulanıyor...
                        </div>
                      )}

                      <button type="submit" className="yp-btn" disabled={loading || otp.some(d=>!d)}
                        style={{ height:54, borderRadius:16, background:otp.every(d=>d)?"linear-gradient(135deg,#7C3AFF,#A855F7)":"#e8e8e8", color:otp.every(d=>d)?"#fff":"#bbb", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                        {loading && !autoVfy && <Loader2 size={20} style={{ animation:"spin 1s linear infinite" }} />}
                        <ShieldCheck size={20} /> Doğrula
                      </button>

                      <div style={{ textAlign:"center" }}>
                        {countdown > 0 ? (
                          <span style={{ fontSize:13, color:"#aaa" }}>
                            Yeni kod için bekleyin: <strong style={{ color:"#7C3AFF" }}>{fmtCountdown()}</strong>
                          </span>
                        ) : (
                          <button type="button" onClick={() => { setOtp(["","","",""]); vfyRef.current=false; sendOtp(); }}
                            style={{ background:"none", border:"none", cursor:"pointer", fontSize:13, color:"#7C3AFF", fontWeight:700, fontFamily:"Inter,sans-serif" }}>
                            Kodu Tekrar Gönder →
                          </button>
                        )}
                      </div>

                      <button type="button" onClick={() => { setStep("phone"); setError(""); setOtp(["","","",""]); }}
                        style={{ background:"none", border:"none", cursor:"pointer", fontSize:13, color:"#aaa", fontWeight:600, fontFamily:"Inter,sans-serif" }}>
                        ← Numarayı değiştir
                      </button>
                    </div>
                  )}

                  {/* ═══ REGISTER STEP ═══ */}
                  {step==="register" && (
                    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                      <div style={{ background:"#F5F0FF", borderRadius:14, padding:16, display:"flex", gap:12, alignItems:"flex-start" }}>
                        <span style={{ fontSize:24 }}>🐾</span>
                        <div>
                          <div style={{ fontSize:13, fontWeight:800, color:"#7C3AFF", marginBottom:3 }}>YourPoodle Ailesine Katılıyorsunuz!</div>
                          <div style={{ fontSize:12, color:"#888", lineHeight:1.6 }}>Profilinizi oluşturmak için bilgilerinizi paylaşın.</div>
                        </div>
                      </div>

                      {/* Ad Soyad */}
                      <div>
                        <label htmlFor="fullname" style={{ fontSize:12, fontWeight:700, color:"#555", display:"block", marginBottom:8 }}>Ad Soyad <span style={{ color:"#EF4444" }}>*</span></label>
                        <input className="yp-inp" type="text" id="fullname" name="name" autoComplete="given-name"
                          value={name} onChange={e => setName(e.target.value)}
                          onKeyDown={e => { if (e.key==="Enter") doRegister(); }}
                          placeholder="Örn: Ayşe Kaya" autoFocus
                          style={{ width:"100%", height:52, borderRadius:14, border:"2px solid #e8e8e8", padding:"0 16px", fontSize:16, fontWeight:600, color:"#222", background:"#fafafa", fontFamily:"Inter,sans-serif", outline:"none", transition:"border-color 0.2s" }} />
                      </div>

                      {/* Poodle adı */}
                      <div>
                        <label htmlFor="poodle-name" style={{ fontSize:12, fontWeight:700, color:"#555", display:"block", marginBottom:8 }}>Poodle'ınızın Adı <span style={{ color:"#EF4444" }}>*</span></label>
                        <input className="yp-inp" type="text" id="poodle-name" name="poodle_name"
                          value={poodleName} onChange={e => setPoodleName(e.target.value)}
                          placeholder="Örn: Mocha"
                          style={{ width:"100%", height:52, borderRadius:14, border:"2px solid #e8e8e8", padding:"0 16px", fontSize:16, fontWeight:600, color:"#222", background:"#fafafa", fontFamily:"Inter,sans-serif", outline:"none", transition:"border-color 0.2s" }} />
                      </div>

                      {/* Poodle cinsi */}
                      <div>
                        <label htmlFor="poodle-breed" style={{ fontSize:12, fontWeight:700, color:"#555", display:"block", marginBottom:8 }}>Poodle Cinsi</label>
                        <select id="poodle-breed" name="poodle_breed" value={poodleBreed} onChange={e => setPoodleBreed(e.target.value)}
                          style={{ width:"100%", height:52, borderRadius:14, border:"2px solid #e8e8e8", padding:"0 16px", fontSize:15, fontWeight:600, color:"#222", background:"#fafafa", fontFamily:"Inter,sans-serif", outline:"none", cursor:"pointer", appearance:"auto" }}>
                          {BREEDS.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>

                      {/* Şehir */}
                      <div>
                        <label htmlFor="city" style={{ fontSize:12, fontWeight:700, color:"#555", display:"block", marginBottom:8 }}>Şehir <span style={{ fontSize:11, color:"#bbb", fontWeight:500 }}>(isteğe bağlı)</span></label>
                        <select id="city" name="city" value={city} onChange={e => setCity(e.target.value)}
                          style={{ width:"100%", height:52, borderRadius:14, border:"2px solid #e8e8e8", padding:"0 16px", fontSize:15, fontWeight:600, color:city?"#222":"#aaa", background:"#fafafa", fontFamily:"Inter,sans-serif", outline:"none", cursor:"pointer", appearance:"auto" }}>
                          <option value="">Şehir seçin...</option>
                          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      {error && <p role="alert" style={{ fontSize:12, color:"#EF4444", fontWeight:600 }}>{error}</p>}

                      <button type="submit" className="yp-btn" disabled={loading || !name.trim()}
                        style={{ height:54, borderRadius:16, background:name.trim()?"linear-gradient(135deg,#7C3AFF,#A855F7)":"#e8e8e8", color:name.trim()?"#fff":"#bbb", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                        {loading && <Loader2 size={20} style={{ animation:"spin 1s linear infinite" }} />}
                        {loading ? "Oluşturuluyor..." : "Profilimi Oluştur 🎉"}
                      </button>
                    </div>
                  )}

                  {/* Trust bar */}
                  <div style={{ marginTop:24, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                    <ShieldCheck size={13} color="#22C55E" strokeWidth={2.5} />
                    <span style={{ fontSize:11, color:"#bbb", fontWeight:600 }}>Bilgileriniz SSL ile korunmaktadır · KVKK uyumlu</span>
                  </div>
                </div>
              </form>

              {/* FAQ section — crawler-visible static content */}
              <section style={{ marginTop:40, paddingTop:32, borderTop:"1px solid #f5f5f5" }}>
                <h2 style={{ fontSize:16, fontWeight:800, color:"#1a1a1a", marginBottom:16 }}>Sık Sorulan Sorular</h2>
                {[
                  ["YourPoodle'a nasıl üye olurum?","Telefon numaranızı girin, SMS kodu onaylayın, profilinizi oluşturun. 2 dakikada tamamlanır — ücretsiz."],
                  ["Üyelik ücretsiz mi?","Evet, tamamen ücretsizdir. Gizli ücret, abonelik veya kredi kartı gerekmez."],
                  ["Telefon numaram neden isteniyor?","Telefon numarası yalnızca kimlik doğrulama için kullanılır. SMS ile gelen kod hesabınızı güvence altına alır."],
                  ["Google ile giriş güvenli mi?","Google OAuth 2.0 standart protokolünü kullanır. Şifreniz hiçbir zaman bizimle paylaşılmaz."],
                  ["Misafir olarak ne yapabilirim?","İçerikleri görüntüleyebilir, ürünleri inceleyebilirsiniz. Beğeni, yorum ve paylaşım için üye olmanız gerekir."],
                ].map(([q,a]) => (
                  <div key={q} style={{ marginBottom:12, background:"#FAFAFA", borderRadius:13, padding:"14px 16px", border:"1px solid #f0f0f0" }}>
                    <div style={{ fontSize:13.5, fontWeight:800, color:"#1a1a1a", marginBottom:5 }}>❓ {q}</div>
                    <div style={{ fontSize:13, color:"#555", lineHeight:1.65 }}>{a}</div>
                  </div>
                ))}
              </section>

              {/* Crawler-visible static content for AI search */}
              <section style={{ marginTop:24, padding:"20px 0" }}>
                <h2 style={{ fontSize:14, fontWeight:800, color:"#1a1a1a", marginBottom:10 }}>YourPoodle'a Nasıl Üye Olurum?</h2>
                <ol style={{ paddingLeft:20 }}>
                  <li style={{ fontSize:13, color:"#555", marginBottom:6, lineHeight:1.6 }}>Telefon numaranızı girin (Türkiye: 5XX XXX XX XX formatında)</li>
                  <li style={{ fontSize:13, color:"#555", marginBottom:6, lineHeight:1.6 }}>SMS ile gelen 4 haneli kodu onaylayın</li>
                  <li style={{ fontSize:13, color:"#555", lineHeight:1.6 }}>Adınızı ve poodle bilgilerini girin — profil hazır!</li>
                </ol>
              </section>

            </div>
          </div>
        </div>
      </main>
    </YPLayout>
  );
}
