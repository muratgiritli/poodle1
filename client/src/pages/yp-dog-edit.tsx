// YourPoodle — /yourpoodle/p/:slug/duzenle — Köpek profili düzenleme
import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Camera, Save } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { useCustomer } from "@/contexts/CustomerContext";
import { goBack } from "@/lib/goBack";

const COLORS = ["Beyaz", "Siyah", "Bej/Krem", "Kahverengi", "Gri/Gümüş", "Kırmızı", "Kayısı", "Çikolata", "Bicolor"];
const CITIES = ["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Samsun", "Adana", "Konya", "Eskişehir", "Diğer"];

export default function YPDogEditPage({ routeSlug }: { routeSlug?: string }) {
  const [, navigate] = useLocation();
  const { isLoggedIn } = useCustomer();
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [form, setForm] = useState<any>({});
  const [saved, setSaved] = useState(false);

  const { data: dog } = useQuery<any>({
    queryKey: [`/api/dogs/${routeSlug}`],
    queryFn: async () => { const r = await fetch(`/api/dogs/${routeSlug}`); return r.json(); },
    enabled: !!routeSlug,
  });

  useEffect(() => {
    if (dog) {
      setForm({
        name: dog.name ?? "", breed: dog.breed ?? "toy",
        color: dog.color ?? "", gender: dog.gender ?? "",
        city: dog.city ?? "", district: dog.district ?? "",
        bio: dog.bio ?? "", isPrivate: dog.is_private ?? false,
        weightKg: dog.weight_kg ?? "", birthYear: dog.birth_date?.split("-")[0] ?? "",
        birthMonth: dog.birth_date?.split("-")[1]?.replace(/^0/, "") ?? "",
      });
    }
  }, [dog]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const birthDate = form.birthYear && form.birthMonth
        ? `${form.birthYear}-${String(form.birthMonth).padStart(2, "0")}-01` : undefined;
      const r = await apiRequest("PUT", `/api/dogs/${routeSlug}`, { ...form, birthDate });
      if (!r.ok) throw new Error(await r.text());
      if (avatarFile) {
        const fd = new FormData();
        fd.append("avatar", avatarFile);
        await fetch(`/api/dogs/${routeSlug}/avatar`, { method: "POST", body: fd });
      }
    },
    onSuccess: () => {
      setSaved(true);
      qc.invalidateQueries({ queryKey: [`/api/dogs/${routeSlug}`] });
      setTimeout(() => navigate(`/yourpoodle/p/${routeSlug}`), 1200);
    },
  });

  if (!isLoggedIn || (dog && !dog.isOwner)) {
    navigate(`/yourpoodle/p/${routeSlug}`);
    return null;
  }

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  return (
    <YPLayout activeLink="/yourpoodle/club" constrain={false} hideBottomNav hideFooter>
      <div style={{ maxWidth: "var(--yp-shell-max)", margin: "0 auto", paddingBottom: 80 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid #f0f0f0", background: "#fff", position: "sticky", top: 60, zIndex: 50 }}>
          <button onClick={() => goBack(navigate, `/yourpoodle/p/${routeSlug}`)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <ChevronLeft size={22} />
          </button>
          <div style={{ flex: 1, textAlign: "center", fontSize: 15, fontWeight: 800 }}>Profili Düzenle</div>
          <div style={{ width: 30 }} />
        </div>

        <div style={{ padding: "24px 20px" }}>
          {/* Avatar */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={e => {
                const f = e.target.files?.[0]; if (!f) return;
                setAvatarFile(f);
                const r = new FileReader();
                r.onload = ev => setAvatarPreview(ev.target?.result as string);
                r.readAsDataURL(f);
              }} />
            <div onClick={() => fileRef.current?.click()}
              style={{ width: 90, height: 90, borderRadius: "50%", border: "3px solid #5D3A1A", overflow: "hidden", margin: "0 auto 10px", cursor: "pointer", background: "#F5F0E6", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              {(avatarPreview || dog?.avatar_url)
                ? <img src={avatarPreview ?? dog.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <div style={{ textAlign: "center" }}><Camera size={28} color="#5D3A1A" /><div style={{ fontSize: 10, color: "#5D3A1A", fontWeight: 700 }}>Fotoğraf</div></div>
              }
            </div>
            <button onClick={() => fileRef.current?.click()}
              style={{ fontSize: 13, color: "#5D3A1A", fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
              Fotoğraf Değiştir
            </button>
          </div>

          {/* Fields */}
          {[
            { label: "İsim", key: "name", type: "text" },
            { label: "Kilo (kg)", key: "weightKg", type: "number" },
            { label: "Doğum Yılı", key: "birthYear", type: "number" },
            { label: "İlçe", key: "district", type: "text" },
          ].map(({ label, key, type }) => (
            <div key={key} style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontWeight: 700, fontSize: 13, color: "#333", marginBottom: 6 }}>{label}</label>
              <input value={form[key] ?? ""} onChange={e => set(key, e.target.value)} type={type}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 12, border: "1.5px solid #E5E7EB", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
            </div>
          ))}

          {/* Gender */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontWeight: 700, fontSize: 13, color: "#333", marginBottom: 8 }}>Cinsiyet</label>
            <div style={{ display: "flex", gap: 10 }}>
              {["Dişi", "Erkek"].map(g => (
                <button key={g} onClick={() => set("gender", g)}
                  style={{ flex: 1, padding: "10px", borderRadius: 12, border: `1.5px solid ${form.gender === g ? "#5D3A1A" : "#E5E7EB"}`,
                    background: form.gender === g ? "#F5F0E6" : "#fff", color: form.gender === g ? "#5D3A1A" : "#555", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                  {g === "Dişi" ? "♀️ Dişi" : "♂️ Erkek"}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontWeight: 700, fontSize: 13, color: "#333", marginBottom: 8 }}>Renk</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {COLORS.map(c => (
                <button key={c} onClick={() => set("color", c)}
                  style={{ padding: "7px 14px", borderRadius: 20, border: `1.5px solid ${form.color === c ? "#5D3A1A" : "#E5E7EB"}`,
                    background: form.color === c ? "#F5F0E6" : "#fff", color: form.color === c ? "#5D3A1A" : "#555", fontWeight: 700, fontSize: 12.5, cursor: "pointer", fontFamily: "inherit" }}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* City */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontWeight: 700, fontSize: 13, color: "#333", marginBottom: 6 }}>Şehir</label>
            <select value={form.city} onChange={e => set("city", e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 12, border: "1.5px solid #E5E7EB", fontSize: 14, fontFamily: "inherit", outline: "none", background: "#fff", boxSizing: "border-box" }}>
              <option value="">Şehir seç</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Bio */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontWeight: 700, fontSize: 13, color: "#333", marginBottom: 6 }}>Bio (maks 150 karakter)</label>
            <textarea value={form.bio ?? ""} onChange={e => set("bio", e.target.value.slice(0, 150))} rows={3}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 12, border: "1.5px solid #E5E7EB", fontSize: 14, fontFamily: "inherit", outline: "none", resize: "none", boxSizing: "border-box" }} />
            <div style={{ textAlign: "right", fontSize: 11, color: "#aaa" }}>{(form.bio ?? "").length}/150</div>
          </div>

          {/* Privacy */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontWeight: 700, fontSize: 13, color: "#333", marginBottom: 8 }}>Gizlilik</label>
            <div style={{ display: "flex", gap: 10 }}>
              {[{ v: false, l: "🌍 Herkese Açık" }, { v: true, l: "🔒 Gizli" }].map(({ v, l }) => (
                <button key={String(v)} onClick={() => set("isPrivate", v)}
                  style={{ flex: 1, padding: "10px", borderRadius: 12, border: `1.5px solid ${form.isPrivate === v ? "#5D3A1A" : "#E5E7EB"}`,
                    background: form.isPrivate === v ? "#F5F0E6" : "#fff", color: form.isPrivate === v ? "#5D3A1A" : "#555", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {saveMutation.isError && (
            <div style={{ padding: "10px 14px", borderRadius: 10, background: "#FEF2F2", color: "#EF4444", fontSize: 13, marginBottom: 12 }}>
              Hata: {(saveMutation.error as Error)?.message}
            </div>
          )}
          {saved && (
            <div style={{ padding: "10px 14px", borderRadius: 10, background: "#F0FDF4", color: "#16A34A", fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
              ✓ Kaydedildi! Yönlendiriliyor...
            </div>
          )}
        </div>

        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff",
          borderTop: "1px solid #f0f0f0",
          padding: "12px 20px calc(12px + env(safe-area-inset-bottom))",
          maxWidth: "var(--yp-shell-max)", margin: "0 auto", zIndex: 100,
          boxSizing: "border-box", width: "100%",
        }}>
          <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}
            style={{ width: "100%", height: 50, borderRadius: 14, border: "none", background: "linear-gradient(135deg,#5D3A1A,#A67C52)", color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Save size={18} /> {saveMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>
    </YPLayout>
  );
}
