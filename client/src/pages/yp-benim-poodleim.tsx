import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Camera, Save, ChevronLeft, PawPrint, Cake, Weight, Palette } from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { useCustomer } from "@/contexts/CustomerContext";
import { IS_YP } from "@/lib/store";
import { goBack } from "@/lib/goBack";

const BASE = IS_YP ? "" : "/yourpoodle";
const P = "#5D3A1A";

interface PoodleProfile {
  name: string;
  birthDate: string;
  weightKg: string;
  gender: "erkek" | "dişi" | "";
  coatColor: string;
  photoUrl: string;
  sterilized: boolean;
  activityLevel: "düşük" | "orta" | "yüksek" | "";
}

const COAT_COLORS = ["Kayısı / Apricot", "Siyah", "Beyaz", "Gümüş / Gri", "Kahverengi", "Krem", "Kırmızı / Red", "Mavi-Gri"];

const ACTIVITY_LEVELS = [
  { value:"düşük",   label:"🛋️ Sakin",  desc:"Az hareket, sık uyur" },
  { value:"orta",    label:"🚶 Orta",   desc:"Günde 1-2 yürüyüş" },
  { value:"yüksek",  label:"⚡ Aktif",  desc:"Çok enerjik, koşmayı sever" },
];

export default function YPBenimPoodleimPage() {
  const [, navigate] = useLocation();
  const { isLoggedIn } = useCustomer();
  const fileRef = useRef<HTMLInputElement>(null);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState<PoodleProfile>(() => {
    try {
      const stored = localStorage.getItem("yp_poodle_profile");
      if (stored) return JSON.parse(stored);
    } catch {}
    return { name:"", birthDate:"", weightKg:"", gender:"", coatColor:"", photoUrl:"", sterilized:false, activityLevel:"" };
  });

  /* Redirect if not logged in */
  useEffect(() => {
    if (!isLoggedIn) {
      navigate(`${BASE}/giris?returnTo=${encodeURIComponent(BASE + "/benim-poodleim")}`);
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) return null;

  const set = (field: keyof PoodleProfile, val: any) =>
    setProfile(p => ({ ...p, [field]: val }));

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => set("photoUrl", ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    localStorage.setItem("yp_poodle_profile", JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const ageText = () => {
    if (!profile.birthDate) return "";
    const ms = Date.now() - new Date(profile.birthDate).getTime();
    const months = Math.floor(ms / (1000 * 60 * 60 * 24 * 30.44));
    if (months < 12) return `${months} aylık`;
    const years = Math.floor(months / 12);
    const rem = months % 12;
    return rem > 0 ? `${years} yaş ${rem} ay` : `${years} yaşında`;
  };

  return (
    <YPLayout activeLink={`${BASE}/benim-poodleim`}>
      <div style={{ maxWidth:640, margin:"0 auto", padding:"24px 0 60px" }}>

        {/* Back */}
        <button onClick={() => goBack(navigate, BASE || "/")}
          style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none",
                   cursor:"pointer", color:"#5D3A1A", fontSize:14, fontWeight:600,
                   fontFamily:"inherit", marginBottom:20, padding:0 }}>
          <ChevronLeft size={18} />
          Geri
        </button>

        <h1 style={{ fontSize:22, fontWeight:800, color:"#1F2937", margin:"0 0 4px" }}>
          🐾 Benim Poodle'ım
        </h1>
        <p style={{ fontSize:14, color:"#6B7280", margin:"0 0 28px" }}>
          Poodle profilinizi oluşturun — AI asistan ve mama hesabı bunu kullanır.
        </p>

        {/* Photo upload */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:28 }}>
          <div style={{ position:"relative" }}>
            <div style={{
              width:120, height:120, borderRadius:"50%",
              background: profile.photoUrl ? "transparent" : "linear-gradient(135deg,#EDE5D8,#E5DDD0)",
              border:"3px solid #E5E7EB", overflow:"hidden",
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              {profile.photoUrl
                ? <img src={profile.photoUrl} alt="Poodle" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                : <PawPrint size={40} color="#D4C4B0" />
              }
            </div>
            <button onClick={() => fileRef.current?.click()}
              style={{ position:"absolute", bottom:4, right:4, width:34, height:34, borderRadius:"50%",
                       background:P, border:"2px solid #fff", display:"flex", alignItems:"center",
                       justifyContent:"center", cursor:"pointer" }}>
              <Camera size={16} color="#fff" />
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handlePhoto} />
          <span style={{ fontSize:12, color:"#9CA3AF", marginTop:8 }}>Fotoğraf yükle (opsiyonel)</span>
        </div>

        {/* Form */}
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

          {/* Name */}
          <div>
            <label style={{ fontSize:13, fontWeight:700, color:"#374151", display:"block", marginBottom:6 }}>
              <PawPrint size={14} style={{ display:"inline", marginRight:5, verticalAlign:"middle" }} />
              Poodle'ımın Adı *
            </label>
            <input value={profile.name} onChange={e => set("name", e.target.value)}
              placeholder="örn. Tarçın, Luna, Prens..."
              style={{ width:"100%", padding:"11px 14px", borderRadius:12, border:"1.5px solid #E5E7EB",
                       fontSize:14, fontFamily:"inherit", outline:"none", boxSizing:"border-box",
                       transition:"border-color 0.15s" }}
              onFocus={e => (e.target.style.borderColor = P)}
              onBlur={e => (e.target.style.borderColor = "#E5E7EB")} />
          </div>

          {/* Birth date + Weight */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <div>
              <label style={{ fontSize:13, fontWeight:700, color:"#374151", display:"block", marginBottom:6 }}>
                <Cake size={14} style={{ display:"inline", marginRight:5, verticalAlign:"middle" }} />
                Doğum Tarihi
              </label>
              <input type="date" value={profile.birthDate} onChange={e => set("birthDate", e.target.value)}
                style={{ width:"100%", padding:"11px 14px", borderRadius:12, border:"1.5px solid #E5E7EB",
                         fontSize:14, fontFamily:"inherit", outline:"none", boxSizing:"border-box" }}
                onFocus={e => (e.target.style.borderColor = P)}
                onBlur={e => (e.target.style.borderColor = "#E5E7EB")} />
              {profile.birthDate && <div style={{ fontSize:11, color:P, marginTop:4, fontWeight:600 }}>{ageText()}</div>}
            </div>
            <div>
              <label style={{ fontSize:13, fontWeight:700, color:"#374151", display:"block", marginBottom:6 }}>
                <Weight size={14} style={{ display:"inline", marginRight:5, verticalAlign:"middle" }} />
                Ağırlık (kg)
              </label>
              <input type="number" min="0.5" max="10" step="0.1" value={profile.weightKg}
                onChange={e => set("weightKg", e.target.value)}
                placeholder="örn. 3.2"
                style={{ width:"100%", padding:"11px 14px", borderRadius:12, border:"1.5px solid #E5E7EB",
                         fontSize:14, fontFamily:"inherit", outline:"none", boxSizing:"border-box" }}
                onFocus={e => (e.target.style.borderColor = P)}
                onBlur={e => (e.target.style.borderColor = "#E5E7EB")} />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label style={{ fontSize:13, fontWeight:700, color:"#374151", display:"block", marginBottom:8 }}>Cinsiyet</label>
            <div style={{ display:"flex", gap:10 }}>
              {(["erkek","dişi"] as const).map(g => (
                <button key={g} onClick={() => set("gender", profile.gender === g ? "" : g)}
                  style={{
                    flex:1, padding:"10px 0", borderRadius:12, border:"1.5px solid",
                    borderColor: profile.gender === g ? P : "#E5E7EB",
                    background: profile.gender === g ? "#F5F0E6" : "#fff",
                    color: profile.gender === g ? P : "#374151",
                    fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
                  }}>
                  {g === "erkek" ? "♂️ Erkek" : "♀️ Dişi"}
                </button>
              ))}
            </div>
          </div>

          {/* Coat color */}
          <div>
            <label style={{ fontSize:13, fontWeight:700, color:"#374151", display:"block", marginBottom:8 }}>
              <Palette size={14} style={{ display:"inline", marginRight:5, verticalAlign:"middle" }} />
              Tüy Rengi
            </label>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {COAT_COLORS.map(c => (
                <button key={c} onClick={() => set("coatColor", profile.coatColor === c ? "" : c)}
                  style={{
                    padding:"6px 14px", borderRadius:999, border:"1.5px solid",
                    borderColor: profile.coatColor === c ? P : "#E5E7EB",
                    background: profile.coatColor === c ? P : "#fff",
                    color: profile.coatColor === c ? "#fff" : "#374151",
                    fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit",
                    transition:"all 0.15s",
                  }}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Sterilized */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                        background:"#F9FAFB", borderRadius:12, padding:"14px 16px" }}>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:"#374151" }}>Kısırlaştırıldı mı?</div>
              <div style={{ fontSize:12, color:"#9CA3AF" }}>Mama hesabında kullanılır</div>
            </div>
            <button onClick={() => set("sterilized", !profile.sterilized)}
              style={{
                width:50, height:27, borderRadius:999, border:"none", cursor:"pointer",
                background: profile.sterilized ? P : "#D1D5DB",
                position:"relative", transition:"background 0.2s",
              }}>
              <span style={{
                position:"absolute", top:3, left: profile.sterilized ? 26 : 3,
                width:21, height:21, borderRadius:"50%", background:"#fff",
                transition:"left 0.2s", boxShadow:"0 1px 4px rgba(0,0,0,0.2)",
              }} />
            </button>
          </div>

          {/* Activity level */}
          <div>
            <label style={{ fontSize:13, fontWeight:700, color:"#374151", display:"block", marginBottom:8 }}>Aktivite Düzeyi</label>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {ACTIVITY_LEVELS.map(a => (
                <button key={a.value} onClick={() => set("activityLevel", profile.activityLevel === a.value ? "" : a.value)}
                  style={{
                    display:"flex", alignItems:"center", justifyContent:"space-between",
                    padding:"12px 16px", borderRadius:12, border:"1.5px solid",
                    borderColor: profile.activityLevel === a.value ? P : "#E5E7EB",
                    background: profile.activityLevel === a.value ? "#F5F0E6" : "#fff",
                    cursor:"pointer", fontFamily:"inherit", textAlign:"left",
                    transition:"all 0.15s",
                  }}>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color: profile.activityLevel === a.value ? P : "#374151" }}>
                      {a.label}
                    </div>
                    <div style={{ fontSize:12, color:"#9CA3AF" }}>{a.desc}</div>
                  </div>
                  {profile.activityLevel === a.value && (
                    <div style={{ width:20, height:20, borderRadius:"50%", background:P,
                                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <span style={{ color:"#fff", fontSize:12 }}>✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Save button */}
          <button onClick={handleSave}
            style={{
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              width:"100%", padding:"14px 0", borderRadius:14, border:"none",
              background: saved ? "#10B981" : P, color:"#fff",
              fontSize:15, fontWeight:800, cursor:"pointer", fontFamily:"inherit",
              boxShadow: `0 4px 14px rgba(93,58,26,0.3)`,
              transition:"background 0.3s",
            }}>
            <Save size={18} />
            {saved ? "Kaydedildi ✓" : "Profili Kaydet"}
          </button>

          {profile.name && (
            <div style={{ background:"linear-gradient(135deg,#F5F0E6,#EDE5D8)", borderRadius:14,
                          padding:"16px 20px", textAlign:"center" }}>
              <div style={{ fontSize:32, marginBottom:6 }}>🐾</div>
              <div style={{ fontSize:16, fontWeight:800, color:"#1F2937" }}>{profile.name}</div>
              {profile.birthDate && <div style={{ fontSize:13, color:P, fontWeight:600 }}>{ageText()}</div>}
              {profile.weightKg && <div style={{ fontSize:13, color:"#6B7280", marginTop:2 }}>{profile.weightKg} kg</div>}
              <div style={{ display:"flex", gap:10, justifyContent:"center", marginTop:12 }}>
                <button onClick={() => navigate(`${BASE}/mama-bul`)}
                  style={{ padding:"8px 18px", borderRadius:999, border:"none", background:P,
                           color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                  🍽️ Mama Hesapla
                </button>
                <button onClick={() => navigate(`${BASE}/ai-asistan`)}
                  style={{ padding:"8px 18px", borderRadius:999, border:"1.5px solid",
                           borderColor:P, background:"#fff", color:P,
                           fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                  🤖 AI'ya Sor
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </YPLayout>
  );
}
