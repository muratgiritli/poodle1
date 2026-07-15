import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { Check, ChevronLeft } from "lucide-react";
import { useCustomer } from "@/contexts/CustomerContext";
import YPLayout from "@/components/yourpoodle/YPLayout";
const BREEDS = ["Toy Poodle","Miniature Poodle","Standard Poodle","Moyen Poodle"];
const COLORS = ["Beyaz","Siyah","Bej/Krem","Kahverengi","Gri/Gümüş","Kırmızı","Kayısı","Mavi","Bicolor"];

const CSS = [
  "*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}",
  "body{background:#fff;}",
  ".icon-btn{background:none;border:none;cursor:pointer;display:flex;align-items:center;padding:6px;border-radius:8px;}",
  "input:focus,select:focus,textarea:focus{outline:none;border-color:#7C3AFF!important;}",
].join("\n");

export default function PoodleEkle() {
  const [, navigate] = useLocation();
  const { isLoggedIn } = useCustomer();
  const [saved, setSaved] = useState(false);
  const [step, setStep] = useState<"form"|"done">("form");
  const [form, setForm] = useState(() => {
    try { return JSON.parse(localStorage.getItem("yp_poodle")||"{}"); } catch { return {}; }
  });

  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const F = (k: string) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) =>
    setForm((f: any) => ({ ...f, [k]: e.target.value }));

  const handlePhotoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Immediate preview via FileReader
    const reader = new FileReader();
    reader.onload = ev => setForm((f: any) => ({ ...f, photo: ev.target?.result as string }));
    reader.readAsDataURL(file);
    // Upload to server if logged in
    if (isLoggedIn) {
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append("photo", file);
        const res = await fetch("/api/yp/poodle/photo", { method: "POST", credentials: "include", body: fd });
        if (res.ok) {
          const { url } = await res.json();
          setForm((f: any) => ({ ...f, photo: url }));
        }
      } catch {} finally { setUploading(false); }
    }
  };

  const handleSave = async () => {
    localStorage.setItem("yp_poodle", JSON.stringify(form));
    if (isLoggedIn && form.name?.trim()) {
      try {
        await fetch("/api/yp/poodle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(form),
        });
      } catch {}
    }
    setSaved(true);
    setTimeout(() => setStep("done"), 600);
  };

  const inp = { width:"100%", height:46, borderRadius:12, border:"2px solid #eee", padding:"0 14px", fontSize:14, fontFamily:"Inter,sans-serif", color:"#222", background:"#fafafa" };
  const lbl = { fontSize:11, fontWeight:700, color:"#555", display:"block" as const, marginBottom:6, fontFamily:"Inter,sans-serif" };

  return (
    <YPLayout activeLink="/yourpoodle/poodle-ekle">
      <title>Poodle Ekle — YourPoodle</title>
      <style>{CSS}</style>

      <div style={{ minHeight:"100vh", background:"#fff", fontFamily:"Inter,sans-serif", paddingBottom:32 }}>

        {step === "done" ? (
          <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 24px",textAlign:"center" }}>
            <div style={{ width:80,height:80,borderRadius:"50%",background:"linear-gradient(135deg,#7C3AFF,#A855F7)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:24 }}>
              <Check size={40} color="#fff" strokeWidth={2.5}/>
            </div>
            <div style={{ fontSize:22,fontWeight:900,color:"#1a1a1a",marginBottom:8 }}>Poodle Profilin Hazır! 🐩</div>
            <div style={{ fontSize:14,color:"#888",lineHeight:1.6,marginBottom:32,maxWidth:280 }}>
              {form.name ? `${form.name}'in profili` : "Profilin"} kaydedildi. Club'da diğer poodle sahipleriyle paylaşabilirsin.
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:12,width:"100%",maxWidth:320 }}>
              <button onClick={()=>navigate("/yourpoodle/club")}
                style={{ height:52,borderRadius:14,border:"none",background:"linear-gradient(135deg,#7C3AFF,#A855F7)",color:"#fff",fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"Inter,sans-serif" }}>
                Club'a Git 🐾
              </button>
              <button onClick={()=>{setStep("form");setSaved(false);}}
                style={{ height:52,borderRadius:14,border:"2px solid #e8e8e8",background:"#fff",color:"#555",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"Inter,sans-serif" }}>
                Profili Düzenle
              </button>
            </div>
          </div>
        ) : (
          <div style={{ padding:"24px 16px" }}>
            <button onClick={()=>window.history.back()} style={{ display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",color:"#888",fontSize:13,fontWeight:600,marginBottom:20,fontFamily:"Inter,sans-serif" }}>
              <ChevronLeft size={16}/> Geri
            </button>
            <div style={{ fontSize:22,fontWeight:900,color:"#1a1a1a",marginBottom:4 }}>🐩 Poodle'ını Ekle</div>
            <p style={{ fontSize:13,color:"#888",lineHeight:1.6,marginBottom:24 }}>Poodle'ın için bir profil oluştur ve topluluğa katıl.</p>

            {/* Preview */}
            {form.name && (
              <div style={{ background:"linear-gradient(135deg,#7C3AFF,#A855F7)",borderRadius:20,padding:"20px",marginBottom:24,position:"relative",overflow:"hidden" }}>
                <div style={{ position:"absolute",top:-20,right:-20,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,0.08)" }}/>
                <div style={{ display:"flex",alignItems:"center",gap:14 }}>
                  {form.photo
                    ? <img src={form.photo} alt={form.name} style={{ width:60,height:60,borderRadius:"50%",objectFit:"cover",border:"3px solid rgba(255,255,255,0.8)",flexShrink:0 }} onError={e=>{(e.target as HTMLImageElement).style.display="none";}}/>
                    : <div style={{ width:60,height:60,borderRadius:"50%",background:"rgba(255,255,255,0.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0 }}>🐩</div>
                  }
                  <div>
                    <div style={{ fontSize:20,fontWeight:900,color:"#fff" }}>{form.name}</div>
                    <div style={{ fontSize:12,color:"rgba(255,255,255,0.85)",marginTop:2 }}>{form.breed}{form.age?` · ${form.age}`:""}{form.color?` · ${form.color}`:""}</div>
                    {form.about&&<div style={{ fontSize:12,color:"rgba(255,255,255,0.75)",marginTop:4,lineHeight:1.5 }}>{form.about}</div>}
                  </div>
                </div>
              </div>
            )}

            <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
              <div><label style={lbl}>Poodle'ın Adı *</label>
                <input value={form.name||""} onChange={F("name")} placeholder="Örn: Mocha" style={inp}/>
              </div>
              <div><label style={lbl}>Irk</label>
                <select value={form.breed||""} onChange={F("breed")} style={{ ...inp }}>
                  <option value="">Seçin...</option>
                  {BREEDS.map(b=><option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
                <div><label style={lbl}>Yaş</label>
                  <input value={form.age||""} onChange={F("age")} placeholder="Örn: 2 yaş" style={inp}/>
                </div>
                <div><label style={lbl}>Renk</label>
                  <select value={form.color||""} onChange={F("color")} style={{ ...inp }}>
                    <option value="">Seçin...</option>
                    {COLORS.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div><label style={lbl}>Cinsiyet</label>
                <div style={{ display:"flex",gap:8 }}>
                  {["Erkek 🐕","Dişi 🐩"].map(g=>(
                    <button key={g} onClick={()=>setForm((f:any)=>({...f,gender:g}))}
                      style={{ flex:1,padding:"11px 4px",borderRadius:10,border:"2px solid",borderColor:form.gender===g?"#7C3AFF":"#e8e8e8",background:form.gender===g?"#EDE8FF":"#fff",fontSize:13,fontWeight:700,color:form.gender===g?"#7C3AFF":"#555",cursor:"pointer",fontFamily:"Inter,sans-serif" }}>{g}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={lbl}>Fotoğraf</label>
                <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handlePhotoFile} style={{ display:"none" }}/>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <button type="button" onClick={() => fileRef.current?.click()}
                    style={{ display:"flex",alignItems:"center",gap:6,padding:"11px 16px",borderRadius:12,border:"2px solid #7C3AFF",background:"#F5F0FF",color:"#7C3AFF",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"Inter,sans-serif",flexShrink:0 }}>
                    📷 {form.photo && !form.photo.startsWith("data:") ? "Değiştir" : "Fotoğraf Seç"}
                    {uploading && " …"}
                  </button>
                  {form.photo && (
                    <img src={form.photo} alt="preview" style={{ width:44,height:44,borderRadius:"50%",objectFit:"cover",border:"2px solid #eee" }}/>
                  )}
                  {!form.photo && (
                    <input value={""} onChange={e => setForm((f:any)=>({...f,photo:e.target.value}))}
                      placeholder="veya URL yapıştır…" style={{ ...inp, flex:1 }}/>
                  )}
                </div>
              </div>
              <div><label style={lbl}>Hakkında</label>
                <textarea value={form.about||""} onChange={F("about")} placeholder="Poodle'ın hakkında birkaç cümle yaz..." rows={3}
                  style={{ width:"100%",borderRadius:12,border:"2px solid #eee",padding:"12px 14px",fontSize:14,fontFamily:"Inter,sans-serif",color:"#222",background:"#fafafa",resize:"none",lineHeight:1.6 }}/>
              </div>
              <button onClick={handleSave} disabled={!form.name?.trim()}
                style={{ height:52,borderRadius:14,border:"none",background:form.name?.trim()?"linear-gradient(135deg,#7C3AFF,#A855F7)":"#e8e8e8",color:form.name?.trim()?"#fff":"#bbb",fontSize:15,fontWeight:800,cursor:form.name?.trim()?"pointer":"not-allowed",fontFamily:"Inter,sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
                {saved?<><Check size={18}/>Kaydedildi!</>:"Profili Kaydet 🐾"}
              </button>
            </div>
          </div>
        )}
      </div>
    </YPLayout>
  );
}
