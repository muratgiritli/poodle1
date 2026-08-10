// YourPoodle — /yourpoodle/p/olustur — Köpek profili oluşturma wizard
import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Check, Camera, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { useCustomer } from "@/contexts/CustomerContext";

const BREEDS = ["toy", "miniature", "standart", "moyen"];
const BREED_TR: Record<string, string> = { toy: "Toy Poodle", miniature: "Minyatür Poodle", standart: "Standart Poodle", moyen: "Moyen Poodle" };
const COLORS = ["Beyaz", "Siyah", "Bej/Krem", "Kahverengi", "Gri/Gümüş", "Kırmızı", "Kayısı", "Çikolata", "Bicolor"];
const CITIES = ["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Samsun", "Adana", "Konya", "Eskişehir", "Diğer"];

function slugify(s: string) {
  return s.toLowerCase()
    .replace(/[çÇ]/g, "c").replace(/[ğĞ]/g, "g").replace(/[ıI]/g, "i")
    .replace(/[İ]/g, "i").replace(/[öÖ]/g, "o").replace(/[şŞ]/g, "s")
    .replace(/[üÜ]/g, "u").replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-").replace(/^-|-$/g, "");
}

export default function YPDogCreatePage() {
  const [, navigate] = useLocation();
  const { isLoggedIn } = useCustomer();
  const [step, setStep] = useState(0);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [slugChecking, setSlugChecking] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "", slug: "", breed: "toy", birthYear: "", birthMonth: "", weightKg: "",
    color: "", gender: "", city: "", district: "", bio: "", isPrivate: false,
  });

  if (!isLoggedIn) {
    return (
      <YPLayout activeLink="/yourpoodle/club">
        <div style={{ padding: "80px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🐩</div>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Önce giriş yapmalısın</h2>
          <p style={{ color: "#888", marginBottom: 24 }}>Köpek profili oluşturmak için üye olman gerekiyor.</p>
          <button onClick={() => navigate("/yourpoodle/giris")}
            style={{ padding: "12px 28px", borderRadius: 20, background: "linear-gradient(135deg,#5D3A1A,#A67C52)", border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            Giriş Yap / Üye Ol
          </button>
        </div>
      </YPLayout>
    );
  }

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const checkSlug = async (slug: string) => {
    if (slug.length < 2) { setSlugAvailable(null); return; }
    setSlugChecking(true);
    try {
      const r = await fetch(`/api/dogs/check-slug/${encodeURIComponent(slug)}`);
      const d = await r.json();
      setSlugAvailable(d.available);
    } finally { setSlugChecking(false); }
  };

  const onNameChange = (v: string) => {
    set("name", v);
    const autoSlug = slugify(v);
    set("slug", autoSlug);
    checkSlug(autoSlug);
  };
  const onSlugChange = (v: string) => {
    const s = slugify(v);
    set("slug", s);
    checkSlug(s);
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      const birthDate = form.birthYear && form.birthMonth
        ? `${form.birthYear}-${form.birthMonth.padStart(2, "0")}-01` : undefined;
      const r = await apiRequest("POST", "/api/dogs", {
        name: form.name, slug: form.slug, breed: form.breed,
        birthDate, weightKg: form.weightKg || undefined,
        color: form.color, gender: form.gender,
        city: form.city, district: form.district,
        bio: form.bio, isPrivate: form.isPrivate,
      });
      const dog = await r.json();
      if (!r.ok) throw new Error(dog.message || "Hata");
      // Upload avatar if selected
      if (avatarFile && dog.slug) {
        const fd = new FormData();
        fd.append("avatar", avatarFile);
        await fetch(`/api/dogs/${dog.slug}/avatar`, { method: "POST", body: fd });
      }
      return dog;
    },
    onSuccess: (dog) => navigate(`/yourpoodle/p/${dog.slug}`),
  });

  const STEPS = [
    { label: "İsim & Adres", emoji: "🏷️" },
    { label: "Fotoğraf", emoji: "📷" },
    { label: "Bilgiler", emoji: "📋" },
    { label: "Bio", emoji: "✍️" },
    { label: "Gizlilik", emoji: "🔒" },
  ];

  const canNext = [
    form.name.trim().length >= 1 && slugAvailable === true,
    true, // photo optional
    form.gender !== "" && form.color !== "",
    true, // bio optional
    true,
  ][step];

  return (
    <YPLayout activeLink="/yourpoodle/club" constrain={false}>
      <div style={{ maxWidth: "var(--yp-shell-max)", margin: "0 auto", padding: "0 0 80px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid #f0f0f0", background: "#fff", position: "sticky", top: 60, zIndex: 50 }}>
          <button onClick={() => step > 0 ? setStep(s => s - 1) : navigate("/yourpoodle/club")}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <ChevronLeft size={22} color="#333" />
          </button>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a" }}>Profil Oluştur</div>
            <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{STEPS[step].emoji} {STEPS[step].label} ({step + 1}/{STEPS.length})</div>
          </div>
          <div style={{ width: 30 }} />
        </div>

        {/* Progress bar */}
        <div style={{ height: 3, background: "#F5F0E6" }}>
          <div style={{ height: "100%", background: "#5D3A1A", width: `${((step + 1) / STEPS.length) * 100}%`, transition: "width 0.3s" }} />
        </div>

        <div style={{ padding: "24px 20px" }}>
          {/* Step 0: Name + slug */}
          {step === 0 && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>Köpeğinin adı ne? 🐾</h2>
              <p style={{ fontSize: 13, color: "#888", marginBottom: 24 }}>Profil adresi otomatik oluşturulur, değiştirebilirsin.</p>
              <label style={{ display: "block", fontWeight: 700, fontSize: 13, marginBottom: 6, color: "#333" }}>İsim</label>
              <input value={form.name} onChange={e => onNameChange(e.target.value)}
                placeholder="Mocha, Luna, Biscuit..."
                style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1.5px solid #E5E7EB", fontSize: 15, fontWeight: 600, boxSizing: "border-box", fontFamily: "inherit", outline: "none", marginBottom: 16 }} />
              <label style={{ display: "block", fontWeight: 700, fontSize: 13, marginBottom: 6, color: "#333" }}>Profil Adresi</label>
              <div style={{ display: "flex", alignItems: "center", background: "#F9FAFB", borderRadius: 12, border: "1.5px solid #E5E7EB", padding: "0 14px", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "#aaa", whiteSpace: "nowrap" }}>yourpoodle.com/p/</span>
                <input value={form.slug} onChange={e => onSlugChange(e.target.value)}
                  placeholder="mocha"
                  style={{ flex: 1, padding: "11px 4px", border: "none", background: "transparent", fontSize: 14, fontWeight: 600, outline: "none", fontFamily: "inherit" }} />
                {slugChecking && <span style={{ fontSize: 12, color: "#aaa" }}>…</span>}
                {!slugChecking && slugAvailable === true && <Check size={16} color="#16A34A" />}
                {!slugChecking && slugAvailable === false && <AlertCircle size={16} color="#EF4444" />}
              </div>
              {slugAvailable === false && <p style={{ fontSize: 12, color: "#EF4444", margin: "0 0 12px" }}>Bu isim alınmış, başka bir isim dene.</p>}
              {slugAvailable === true && <p style={{ fontSize: 12, color: "#16A34A", margin: "0 0 12px" }}>✓ Kullanılabilir</p>}
              <label style={{ display: "block", fontWeight: 700, fontSize: 13, marginBottom: 8, color: "#333", marginTop: 8 }}>Irk</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {BREEDS.map(b => (
                  <button key={b} onClick={() => set("breed", b)}
                    style={{ padding: "8px 16px", borderRadius: 20, border: "1.5px solid", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                      borderColor: form.breed === b ? "#5D3A1A" : "#E5E7EB",
                      background: form.breed === b ? "#F5F0E6" : "#fff",
                      color: form.breed === b ? "#5D3A1A" : "#555" }}>
                    {BREED_TR[b]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Avatar */}
          {step === 1 && (
            <div style={{ textAlign: "center" }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>Profil fotoğrafı ekle 📸</h2>
              <p style={{ fontSize: 13, color: "#888", marginBottom: 32 }}>İsteğe bağlı — sonra da ekleyebilirsin.</p>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
                onChange={e => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setAvatarFile(f);
                  const reader = new FileReader();
                  reader.onload = ev => setAvatarPreview(ev.target?.result as string);
                  reader.readAsDataURL(f);
                }} />
              <div onClick={() => fileRef.current?.click()}
                style={{ width: 140, height: 140, borderRadius: "50%", border: "3px dashed #5D3A1A", background: "#F5F0E6", margin: "0 auto 24px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {avatarPreview
                  ? <img src={avatarPreview} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <div><Camera size={36} color="#5D3A1A" /><div style={{ fontSize: 12, color: "#5D3A1A", marginTop: 6, fontWeight: 700 }}>Fotoğraf seç</div></div>
                }
              </div>
              {avatarPreview && (
                <button onClick={() => { setAvatarPreview(null); setAvatarFile(null); }}
                  style={{ padding: "8px 20px", borderRadius: 20, border: "1.5px solid #E5E7EB", background: "#fff", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                  Kaldır
                </button>
              )}
            </div>
          )}

          {/* Step 2: Basic info */}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>Temel bilgiler 📋</h2>
              <p style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>Diğer Poodle sahipleriyle daha iyi eşleşirsin.</p>
              {/* Gender */}
              <label style={{ display: "block", fontWeight: 700, fontSize: 13, marginBottom: 8, color: "#333" }}>Cinsiyet *</label>
              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                {["Dişi", "Erkek"].map(g => (
                  <button key={g} onClick={() => set("gender", g)}
                    style={{ flex: 1, padding: "10px", borderRadius: 12, border: "1.5px solid", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                      borderColor: form.gender === g ? "#5D3A1A" : "#E5E7EB",
                      background: form.gender === g ? "#F5F0E6" : "#fff",
                      color: form.gender === g ? "#5D3A1A" : "#555" }}>
                    {g === "Dişi" ? "♀️ Dişi" : "♂️ Erkek"}
                  </button>
                ))}
              </div>
              {/* Color */}
              <label style={{ display: "block", fontWeight: 700, fontSize: 13, marginBottom: 8, color: "#333" }}>Renk *</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                {COLORS.map(c => (
                  <button key={c} onClick={() => set("color", c)}
                    style={{ padding: "7px 14px", borderRadius: 20, border: "1.5px solid", fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                      borderColor: form.color === c ? "#5D3A1A" : "#E5E7EB",
                      background: form.color === c ? "#F5F0E6" : "#fff",
                      color: form.color === c ? "#5D3A1A" : "#555" }}>
                    {c}
                  </button>
                ))}
              </div>
              {/* Birth year/month */}
              <label style={{ display: "block", fontWeight: 700, fontSize: 13, marginBottom: 8, color: "#333" }}>Doğum (opsiyonel)</label>
              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                <input value={form.birthYear} onChange={e => set("birthYear", e.target.value)} placeholder="2022"
                  type="number" min="2010" max="2026"
                  style={{ width: "50%", padding: "10px 14px", borderRadius: 12, border: "1.5px solid #E5E7EB", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
                <input value={form.birthMonth} onChange={e => set("birthMonth", e.target.value)} placeholder="Ay (1-12)"
                  type="number" min="1" max="12"
                  style={{ width: "50%", padding: "10px 14px", borderRadius: 12, border: "1.5px solid #E5E7EB", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
              </div>
              {/* Weight */}
              <label style={{ display: "block", fontWeight: 700, fontSize: 13, marginBottom: 8, color: "#333" }}>Kilo (kg, opsiyonel)</label>
              <input value={form.weightKg} onChange={e => set("weightKg", e.target.value)} placeholder="3.2"
                type="number" step="0.1" min="0.5" max="30"
                style={{ width: "100%", padding: "10px 14px", borderRadius: 12, border: "1.5px solid #E5E7EB", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box", marginBottom: 16 }} />
              {/* City */}
              <label style={{ display: "block", fontWeight: 700, fontSize: 13, marginBottom: 8, color: "#333" }}>Şehir</label>
              <select value={form.city} onChange={e => set("city", e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 12, border: "1.5px solid #E5E7EB", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box", background: "#fff" }}>
                <option value="">Şehir seç</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}

          {/* Step 3: Bio */}
          {step === 3 && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>Bio yaz ✍️</h2>
              <p style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>Kısa bir tanıtım (opsiyonel, maks 150 karakter).</p>
              <textarea value={form.bio} onChange={e => set("bio", e.target.value.slice(0, 150))}
                placeholder="Çikolata renkli toy poodle. İstanbul'da yaşıyorum, parkları seviyorum..."
                rows={4}
                style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1.5px solid #E5E7EB", fontSize: 14, fontFamily: "inherit", outline: "none", resize: "none", boxSizing: "border-box" }} />
              <div style={{ textAlign: "right", fontSize: 12, color: form.bio.length > 130 ? "#EF4444" : "#aaa", marginTop: 4 }}>
                {form.bio.length}/150
              </div>
            </div>
          )}

          {/* Step 4: Privacy */}
          {step === 4 && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>Gizlilik ayarı 🔒</h2>
              <p style={{ fontSize: 13, color: "#888", marginBottom: 24 }}>Profilin kim görebilir?</p>
              {[
                { value: false, emoji: "🌍", title: "Herkese Açık", desc: "Profil ve gönderiler herkes tarafından görünür. Takip isteği gerekmez." },
                { value: true, emoji: "🔒", title: "Gizli Profil", desc: "Gönderilerini sadece onaylanan takipçiler görebilir." },
              ].map(o => (
                <div key={String(o.value)} onClick={() => set("isPrivate", o.value)}
                  style={{ padding: "16px", borderRadius: 14, border: `2px solid ${form.isPrivate === o.value ? "#5D3A1A" : "#E5E7EB"}`,
                    background: form.isPrivate === o.value ? "#F5F0E6" : "#fff", cursor: "pointer", marginBottom: 12 }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{o.emoji}</div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: form.isPrivate === o.value ? "#5D3A1A" : "#1a1a1a", marginBottom: 4 }}>{o.title}</div>
                  <div style={{ fontSize: 13, color: "#666" }}>{o.desc}</div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {createMutation.isError && (
            <div style={{ marginTop: 16, padding: "12px 14px", borderRadius: 10, background: "#FEF2F2", border: "1px solid #FCA5A5", fontSize: 13, color: "#EF4444" }}>
              {(createMutation.error as Error)?.message ?? "Bir hata oluştu"}
            </div>
          )}
        </div>

        {/* Footer nav */}
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #f0f0f0", padding: "12px 20px", display: "flex", gap: 10, maxWidth: "var(--yp-shell-max)", margin: "0 auto", zIndex: 100 }}>
          {step < STEPS.length - 1 ? (
            <>
              <button onClick={() => setStep(s => s - 1)} disabled={step === 0}
                style={{ width: 48, height: 48, borderRadius: 12, border: "1.5px solid #E5E7EB", background: "#fff", cursor: step === 0 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: step === 0 ? 0.3 : 1 }}>
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => setStep(s => s + 1)} disabled={!canNext}
                style={{ flex: 1, height: 48, borderRadius: 12, border: "none", background: canNext ? "linear-gradient(135deg,#5D3A1A,#A67C52)" : "#E5E7EB", color: canNext ? "#fff" : "#aaa", fontSize: 15, fontWeight: 800, cursor: canNext ? "pointer" : "default", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                Devam <ChevronRight size={18} />
              </button>
            </>
          ) : (
            <button onClick={() => createMutation.mutate()} disabled={createMutation.isPending}
              style={{ flex: 1, height: 52, borderRadius: 14, border: "none", background: "linear-gradient(135deg,#5D3A1A,#A67C52)", color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {createMutation.isPending ? "Oluşturuluyor..." : <><Check size={20} /> Profili Oluştur</>}
            </button>
          )}
        </div>
      </div>
    </YPLayout>
  );
}
