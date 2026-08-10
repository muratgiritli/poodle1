// Route: /yourpoodle/poodle-profili-duzenle
import { useState, useRef, useEffect } from "react";
import { useLocation, Link } from "wouter";
import {
  ArrowLeft, Camera, Calendar, Check, ChevronRight,
  MapPin, Globe, Users, Lock, Eye, Trash2, Shield,
  Bell,
} from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { useCustomer } from "@/contexts/CustomerContext";

/* ── Palette ─────────────────────────── */
const P    = "#4B2BD6";
const PD   = "#3E27B3";
const PL   = "#F5F0E6";
const GB   = "#E5E7EB";
const GBG  = "#F9FAFB";
const GT   = "#6B7280";
const DARK = "#111827";

/* ── Types ───────────────────────────── */
interface FormState {
  name: string;
  username: string;
  birthDate: string;
  gender: "Dişi" | "Erkek";
  color: string;
  weight: string;
  size: "Toy" | "Miniature" | "Standart";
  neutered: boolean | null;
  hasAllergy: boolean | null;
  hasChronic: boolean | null;
  foodPref: string;
  activityLevel: string;
  vetNotes: string;
  careNotify: boolean;
  clubVisible: boolean;
  bio: string;
  city: string;
  privacy: "public" | "followers" | "private";
}

const COLORS = ["Krem", "Beyaz", "Siyah", "Kahverengi", "Gri", "Kırmızı", "Apricot", "Çikolata"];
const FOOD_PREFS = ["Sensitive • Somonlu", "Tavuklu", "Kuzulu", "Balıklı", "Tahılsız", "Diğer"];
const ACTIVITY_LEVELS = ["Düşük", "Orta", "Yüksek", "Çok Yüksek"];
const CITIES = ["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Adana", "Samsun", "Konya", "Gaziantep", "Mersin", "Kocaeli", "Trabzon", "Diğer"];

const INITIAL: FormState = {
  name: "Tarçın",
  username: "@tarcin.poodle",
  birthDate: "14.06.2024",
  gender: "Dişi",
  color: "Apricot",
  weight: "4,2",
  size: "Toy",
  neutered: false,
  hasAllergy: false,
  hasChronic: false,
  foodPref: "Sensitive • Somonlu",
  activityLevel: "Orta",
  vetNotes: "",
  careNotify: true,
  clubVisible: true,
  bio: "Oyun oynamayı ve parkta koşmayı seven neşeli bir Toy Poodle 🐾",
  city: "İstanbul",
  privacy: "public",
};

const CARE_DATES = [
  { id: "asci",     label: "Son Aşı Tarihi",          date: "28.06.2026", icon: Shield },
  { id: "parazit",  label: "Son Parazit Uygulaması",   date: "04.07.2026", icon: Shield },
  { id: "tuy",      label: "Son Tüy Bakımı",           date: "08.07.2026", icon: Camera },
];

const SIZE_OPTIONS: { key: "Toy" | "Miniature" | "Standart"; emoji: string }[] = [
  { key: "Toy",       emoji: "🐩" },
  { key: "Miniature", emoji: "🐕" },
  { key: "Standart",  emoji: "🐕‍🦺" },
];

/* ── Helpers ─────────────────────────── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 15, fontWeight: 700, color: DARK, marginBottom: 12, marginTop: 20 }}>
      {children}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 12, fontWeight: 600, color: GT, marginBottom: 6 }}>
      {children}
    </div>
  );
}

function TextInput({
  value, onChange, placeholder, icon,
}: { value: string; onChange:(v:string)=>void; placeholder?: string; icon?: React.ReactNode }) {
  return (
    <div style={{ position: "relative" }}>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", padding: icon ? "11px 40px 11px 12px" : "11px 12px",
          borderRadius: 12, border: `1.5px solid ${GB}`,
          fontSize: 14, fontFamily: "inherit", color: DARK,
          outline: "none", background: "#fff", boxSizing: "border-box",
        }}
        onFocus={e => { e.currentTarget.style.borderColor = P; }}
        onBlur={e => { e.currentTarget.style.borderColor = GB; }}
      />
      {icon && (
        <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}>
          {icon}
        </span>
      )}
    </div>
  );
}

function YesNoToggle({
  value, onChange,
}: { value: boolean | null; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
      {[true, false].map(opt => {
        const label = opt ? "Evet" : "Hayır";
        const selected = value === opt;
        const bg   = selected ? (opt ? PL : "#FFF7ED") : GBG;
        const clr  = selected ? (opt ? P : "#F97316")  : GT;
        const bdr  = selected ? (opt ? P : "#F97316")  : GB;
        return (
          <button key={String(opt)} onClick={() => onChange(opt)}
            style={{
              padding: "5px 14px", borderRadius: 8,
              border: `1.5px solid ${bdr}`,
              background: bg, color: clr,
              fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.15s",
            }}>
            {label}
          </button>
        );
      })}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} aria-checked={checked} role="switch"
      style={{
        width: 44, height: 24, borderRadius: 12,
        background: checked ? P : "#D1D5DB",
        border: "none", cursor: "pointer", position: "relative", flexShrink: 0,
        transition: "background 0.2s",
      }}>
      <span style={{
        position: "absolute", top: 2,
        left: checked ? 22 : 2,
        width: 20, height: 20, borderRadius: "50%", background: "#fff",
        transition: "left 0.2s",
        boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
      }} />
    </button>
  );
}

/* ═══════════════════════════════════════════════ */
export default function YPPoodleProfilDuzenlePage() {
  const [, navigate] = useLocation();
  const { isLoggedIn } = useCustomer();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm]   = useState<FormState>(INITIAL);
  const [photo, setPhoto] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/yourpoodle/giris?returnTo=/yourpoodle/poodle-profili-duzenle");
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) return null;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      navigate("/hesabim");
    }, 1500);
  };

  const handleDelete = () => {
    if (window.confirm("Tarçın'ın profilini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
      alert("Profil silme yakında!");
    }
  };

  return (
    <YPLayout activeLink="" constrain={false}>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
        onChange={handlePhotoChange} />

      <div style={{
        maxWidth: 480, margin: "0 auto", paddingBottom: 100,
        fontFamily: "'Inter',-apple-system,sans-serif", color: DARK,
      }}>

        {/* ── BREADCRUMB + TITLE ── */}
        <div style={{ padding: "14px 16px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <button onClick={() => navigate("/hesabim")} aria-label="Geri"
              style={{ background: "none", border: "none", cursor: "pointer",
                       display: "flex", alignItems: "center", padding: 0, color: GT }}>
              <ArrowLeft size={17} />
            </button>
            <span style={{ fontSize: 12, color: GT }}>Hesabım</span>
            <span style={{ fontSize: 12, color: GT }}>/</span>
            <span style={{ fontSize: 12, color: GT, cursor: "pointer" }}
              onClick={() => navigate("/hesabim")}>Poodle'ım</span>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: DARK, marginBottom: 4 }}>
            Poodle Profilini Düzenle
          </div>
          <div style={{ fontSize: 13, color: GT, lineHeight: 1.5, marginBottom: 20 }}>
            Tarçın'ın bilgilerini güncel tutun; öneriler ve hatırlatmalar ona özel olsun.
          </div>
        </div>

        {/* ── PROFILE PHOTO ── */}
        <div style={{ padding: "0 16px", textAlign: "center", marginBottom: 4 }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <div style={{
              width: 120, height: 120, borderRadius: "50%", overflow: "hidden",
              border: `3px solid ${P}`, margin: "0 auto",
            }}>
              <img
                src={photo || "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300&h=300&fit=crop"}
                alt="Tarçın"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            {/* Camera overlay */}
            <button onClick={() => fileRef.current?.click()}
              style={{
                position: "absolute", bottom: 4, right: 4,
                width: 30, height: 30, borderRadius: "50%",
                background: P, border: "2px solid #fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
              }}>
              <Camera size={14} color="#fff" />
            </button>
          </div>

          {/* Photo action buttons */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12 }}>
            <button onClick={() => fileRef.current?.click()}
              style={{
                padding: "8px 20px", borderRadius: 999,
                background: P, color: "#fff",
                border: "none", fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = PD; }}
              onMouseLeave={e => { e.currentTarget.style.background = P; }}>
              Fotoğraf Değiştir
            </button>
            <button onClick={() => setPhoto(null)}
              style={{
                padding: "8px 20px", borderRadius: 999,
                background: "#fff", color: GT,
                border: `1.5px solid ${GB}`, fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
              }}>
              Kaldır
            </button>
          </div>
          <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 8 }}>
            JPG veya PNG · En fazla 5 MB
          </div>
        </div>

        {/* ── PROGRESS BAR ── */}
        <div style={{ margin: "20px 16px 0", background: "#fff", borderRadius: 14,
                      border: `1px solid ${GB}`, padding: "14px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: P }}>Profil Tamamlama: %85</span>
          </div>
          <div style={{ background: "#F3F4F6", height: 8, borderRadius: 999, overflow: "hidden" }}>
            <div style={{ width: "85%", height: "100%", background: P, borderRadius: 999 }} />
          </div>
          <div style={{ fontSize: 12, color: GT, marginTop: 8 }}>
            Sağlık bilgilerini ekleyerek profili tamamlayın.
          </div>
        </div>

        <div style={{ padding: "0 16px" }}>

          {/* ════════════ TEMEL BİLGİLER ════════════ */}
          <SectionTitle>Temel Bilgiler</SectionTitle>

          <div style={{ background: "#fff", borderRadius: 14, border: `1px solid ${GB}`,
                        padding: "16px 14px", display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Name + Username in 2-col */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <FieldLabel>Poodle'ın Adı</FieldLabel>
                <TextInput value={form.name} onChange={v => set("name", v)} />
              </div>
              <div>
                <FieldLabel>Kullanıcı Adı</FieldLabel>
                <TextInput
                  value={form.username}
                  onChange={v => set("username", v)}
                  icon={<Check size={16} color="#16A34A" />}
                />
              </div>
            </div>

            {/* Doğum Tarihi */}
            <div>
              <FieldLabel>Doğum Tarihi</FieldLabel>
              <div style={{ position: "relative" }}>
                <input type="text" value={form.birthDate}
                  onChange={e => set("birthDate", e.target.value)}
                  placeholder="GG.AA.YYYY"
                  style={{
                    width: "100%", padding: "11px 40px 11px 12px", borderRadius: 12,
                    border: `1.5px solid ${GB}`, fontSize: 14,
                    fontFamily: "inherit", color: DARK, outline: "none",
                    background: "#fff", boxSizing: "border-box",
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = P; }}
                  onBlur={e => { e.currentTarget.style.borderColor = GB; }}
                />
                <Calendar size={16} color="#9CA3AF"
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }} />
              </div>
            </div>

            {/* Cinsiyet */}
            <div>
              <FieldLabel>Cinsiyet</FieldLabel>
              <div style={{ display: "flex", gap: 8 }}>
                {(["Dişi", "Erkek"] as const).map(g => {
                  const sel = form.gender === g;
                  return (
                    <button key={g} onClick={() => set("gender", g)}
                      style={{
                        flex: 1, padding: "10px 0", borderRadius: 12,
                        border: `1.5px solid ${sel ? P : GB}`,
                        background: sel ? PL : "#fff",
                        color: sel ? P : GT,
                        fontSize: 14, fontWeight: 600, cursor: "pointer",
                        fontFamily: "inherit", display: "flex",
                        alignItems: "center", justifyContent: "center", gap: 6,
                      }}>
                      <span style={{ fontSize: 16 }}>{g === "Dişi" ? "♀" : "♂"}</span>
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Renk + Kilo in 2-col */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <FieldLabel>Renk</FieldLabel>
                <select value={form.color} onChange={e => set("color", e.target.value)}
                  style={{
                    width: "100%", padding: "11px 12px", borderRadius: 12,
                    border: `1.5px solid ${GB}`, fontSize: 14,
                    fontFamily: "inherit", background: "#fff", outline: "none",
                    color: DARK, boxSizing: "border-box",
                  }}>
                  {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <FieldLabel>Kilo</FieldLabel>
                <div style={{ position: "relative" }}>
                  <input type="text" value={form.weight}
                    onChange={e => set("weight", e.target.value)}
                    style={{
                      width: "100%", padding: "11px 36px 11px 12px", borderRadius: 12,
                      border: `1.5px solid ${GB}`, fontSize: 14,
                      fontFamily: "inherit", color: DARK, outline: "none",
                      background: "#fff", boxSizing: "border-box",
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = P; }}
                    onBlur={e => { e.currentTarget.style.borderColor = GB; }}
                  />
                  <span style={{ position: "absolute", right: 12, top: "50%",
                                 transform: "translateY(-50%)", fontSize: 12, color: GT }}>
                    kg
                  </span>
                </div>
              </div>
            </div>

            {/* Age badge */}
            <div>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "#FEF9C3", color: "#854D0E",
                fontSize: 12, fontWeight: 600,
                padding: "5px 12px", borderRadius: 999,
              }}>
                🎂 2 yaşında
              </span>
            </div>
          </div>

          {/* ════════════ IRK VE BOYUT ════════════ */}
          <SectionTitle>Irk ve Boyut</SectionTitle>
          <div style={{ background: "#fff", borderRadius: 14, border: `1px solid ${GB}`,
                        padding: "16px 14px" }}>
            {/* Breed */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <FieldLabel>Irk:</FieldLabel>
              <span style={{ fontSize: 14, fontWeight: 600, color: DARK }}>Toy Poodle</span>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#3B82F6",
                            display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Check size={12} color="#fff" />
              </div>
            </div>

            {/* Size selector */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {SIZE_OPTIONS.map(({ key, emoji }) => {
                const sel = form.size === key;
                return (
                  <button key={key} onClick={() => set("size", key)}
                    style={{
                      padding: "12px 8px", borderRadius: 12,
                      border: `2px solid ${sel ? P : GB}`,
                      background: sel ? PL : GBG,
                      cursor: "pointer", fontFamily: "inherit",
                      display: "flex", flexDirection: "column",
                      alignItems: "center", gap: 6,
                    }}>
                    <span style={{ fontSize: 28 }}>{emoji}</span>
                    <span style={{
                      fontSize: 12, fontWeight: sel ? 700 : 500,
                      color: sel ? P : GT,
                    }}>
                      {key}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ════════════ SAĞLIK BİLGİLERİ ════════════ */}
          <SectionTitle>Sağlık Bilgileri</SectionTitle>
          <div style={{ background: "#fff", borderRadius: 14, border: `1px solid ${GB}`,
                        padding: "16px 14px" }}>
            <div style={{ fontSize: 12, color: GT, marginBottom: 14, lineHeight: 1.5 }}>
              Bu bilgiler yalnızca size özel öneriler için kullanılır.
            </div>

            {/* Yes/No questions */}
            {[
              { label: "Kısırlaştırıldı mı?", key: "neutered"    as keyof FormState },
              { label: "Alerjisi var mı?",    key: "hasAllergy"  as keyof FormState },
              { label: "Kronik rahatsızlığı var mı?", key: "hasChronic" as keyof FormState },
            ].map(({ label, key }) => (
              <div key={key} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                paddingBottom: 12, marginBottom: 12,
                borderBottom: `1px solid ${GBG}`,
              }}>
                <span style={{ fontSize: 13, color: DARK }}>{label}</span>
                <YesNoToggle
                  value={form[key] as boolean | null}
                  onChange={v => set(key, v)}
                />
              </div>
            ))}

            {/* Mama tercihi */}
            <div style={{ marginBottom: 14 }}>
              <FieldLabel>Mama tercihi</FieldLabel>
              <select value={form.foodPref} onChange={e => set("foodPref", e.target.value)}
                style={{
                  width: "100%", padding: "11px 12px", borderRadius: 12,
                  border: `1.5px solid ${GB}`, fontSize: 14,
                  fontFamily: "inherit", background: "#fff", outline: "none",
                  color: DARK, boxSizing: "border-box",
                }}>
                {FOOD_PREFS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            {/* Aktivite düzeyi */}
            <div style={{ marginBottom: 14 }}>
              <FieldLabel>Aktivite düzeyi</FieldLabel>
              <select value={form.activityLevel} onChange={e => set("activityLevel", e.target.value)}
                style={{
                  width: "100%", padding: "11px 12px", borderRadius: 12,
                  border: `1.5px solid ${GB}`, fontSize: 14,
                  fontFamily: "inherit", background: "#fff", outline: "none",
                  color: DARK, boxSizing: "border-box",
                }}>
                {ACTIVITY_LEVELS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            {/* Vet notes */}
            <div>
              <FieldLabel>Veteriner Notları (isteğe bağlı)</FieldLabel>
              <textarea
                value={form.vetNotes}
                onChange={e => set("vetNotes", e.target.value)}
                placeholder="Eklemek istediğiniz sağlık notları..."
                rows={3}
                style={{
                  width: "100%", padding: "11px 12px", borderRadius: 12,
                  border: `1.5px solid ${GB}`, fontSize: 14,
                  fontFamily: "inherit", color: DARK, outline: "none",
                  resize: "none", boxSizing: "border-box", lineHeight: 1.5,
                }}
                onFocus={e => { e.currentTarget.style.borderColor = P; }}
                onBlur={e => { e.currentTarget.style.borderColor = GB; }}
              />
            </div>
          </div>

          {/* ════════════ BAKIM BİLGİLERİ ════════════ */}
          <SectionTitle>Bakım Bilgileri</SectionTitle>
          <div style={{ background: "#fff", borderRadius: 14, border: `1px solid ${GB}`, overflow: "hidden" }}>
            {CARE_DATES.map(({ id, label, date, icon: Icon }, idx) => (
              <button key={id}
                onClick={() => alert(`${label} düzenleme yakında!`)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  width: "100%", padding: "14px 16px", background: "#fff", border: "none",
                  borderBottom: idx < CARE_DATES.length - 1 ? `1px solid ${GBG}` : "none",
                  cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = GBG; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Icon size={16} color="#9CA3AF" />
                  <span style={{ fontSize: 13, color: DARK }}>{label}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, color: GT }}>{date}</span>
                  <ChevronRight size={16} color="#9CA3AF" />
                </div>
              </button>
            ))}

            {/* Care notification toggle */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "14px 16px", borderTop: `1px solid ${GBG}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Bell size={16} color="#9CA3AF" />
                <span style={{ fontSize: 13, color: DARK }}>
                  Yaklaşan bakım tarihleri için bildirim gönder
                </span>
              </div>
              <Toggle checked={form.careNotify} onChange={() => set("careNotify", !form.careNotify)} />
            </div>
          </div>

          {/* ════════════ CLUB PROFİLİ ════════════ */}
          <SectionTitle>Club Profili</SectionTitle>
          <div style={{ background: "#fff", borderRadius: 14, border: `1px solid ${GB}`,
                        padding: "16px 14px" }}>

            {/* Visible toggle */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                          marginBottom: 16 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: DARK }}>Profil Club'da görsün</span>
              <Toggle checked={form.clubVisible} onChange={() => set("clubVisible", !form.clubVisible)} />
            </div>

            {/* Bio */}
            <div style={{ marginBottom: 14 }}>
              <FieldLabel>Bio</FieldLabel>
              <textarea
                value={form.bio}
                onChange={e => set("bio", e.target.value.slice(0, 200))}
                rows={3}
                style={{
                  width: "100%", padding: "11px 12px", borderRadius: 12,
                  border: `1.5px solid ${GB}`, fontSize: 14,
                  fontFamily: "inherit", color: DARK, outline: "none",
                  resize: "none", boxSizing: "border-box", lineHeight: 1.5,
                }}
                onFocus={e => { e.currentTarget.style.borderColor = P; }}
                onBlur={e => { e.currentTarget.style.borderColor = GB; }}
              />
              <div style={{ textAlign: "right", fontSize: 11, color: "#9CA3AF", marginTop: 3 }}>
                {form.bio.length}/200
              </div>
            </div>

            {/* City */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <MapPin size={15} color="#9CA3AF" />
              <select value={form.city} onChange={e => set("city", e.target.value)}
                style={{
                  flex: 1, padding: "9px 12px", borderRadius: 10,
                  border: `1.5px solid ${GB}`, fontSize: 13,
                  fontFamily: "inherit", background: "#fff", outline: "none", color: DARK,
                }}>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Privacy */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
              {([
                { key: "public",    label: "Herkese Açık", Icon: Globe },
                { key: "followers", label: "Takipçiler",   Icon: Users },
                { key: "private",   label: "Gizli",        Icon: Lock  },
              ] as const).map(({ key, label, Icon }) => {
                const sel = form.privacy === key;
                return (
                  <button key={key} onClick={() => set("privacy", key)}
                    style={{
                      padding: "10px 6px", borderRadius: 12,
                      border: `1.5px solid ${sel ? P : GB}`,
                      background: sel ? PL : GBG,
                      cursor: "pointer", fontFamily: "inherit",
                      display: "flex", flexDirection: "column",
                      alignItems: "center", gap: 5,
                    }}>
                    <Icon size={16} color={sel ? P : GT} />
                    <span style={{ fontSize: 11, fontWeight: sel ? 700 : 500,
                                   color: sel ? P : GT, textAlign: "center", lineHeight: 1.2 }}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Club profile preview */}
            <button onClick={() => alert("Club profili önizleme yakında!")}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: 6, width: "100%", padding: "10px 0",
                background: "none", border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 600, color: P, fontFamily: "inherit",
              }}>
              <Eye size={15} />
              Club Profilini Önizle
            </button>
          </div>

          {/* ════════════ ACTION BUTTONS ════════════ */}
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>

            {/* Save */}
            <button onClick={handleSave}
              style={{
                width: "100%", padding: "15px 0",
                background: `linear-gradient(135deg,${P} 0%,#6366F1 100%)`,
                color: "#fff", border: "none", borderRadius: 14,
                fontSize: 15, fontWeight: 700, cursor: "pointer",
                fontFamily: "inherit",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "0.92"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
              {saved ? "✓ Kaydedildi!" : "Değişiklikleri Kaydet"}
            </button>

            {/* Cancel */}
            <button onClick={() => navigate("/hesabim")}
              style={{
                width: "100%", padding: "13px 0",
                background: "#fff", color: GT,
                border: `1.5px solid ${GB}`, borderRadius: 14,
                fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
              }}>
              Vazgeç
            </button>

            {/* Security note */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Check size={13} color="#16A34A" />
              <span style={{ fontSize: 12, color: "#16A34A" }}>
                Bilgileriniz güvenli şekilde saklanır.
              </span>
            </div>

            {/* Delete */}
            <button onClick={handleDelete}
              style={{
                width: "100%", padding: "13px 0",
                background: "#fff", color: "#EF4444",
                border: "1.5px solid #EF4444", borderRadius: 14,
                fontSize: 14, fontWeight: 600, cursor: "pointer",
                fontFamily: "inherit",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#FEF2F2"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}>
              <Trash2 size={16} />
              Poodle Profilini Sil
            </button>
          </div>

        </div>
      </div>

      {/* ════════════ STICKY BOTTOM BAR ════════════ */}
      <div style={{
        position: "fixed", bottom: 72, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 480, background: "#fff",
        borderTop: `1px solid ${GB}`,
        boxShadow: "0 -4px 16px rgba(0,0,0,0.08)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 16px", zIndex: 50,
      }}>
        <span style={{ fontSize: 12, color: GT }}>Son güncelleme: Bugün</span>
        <button onClick={handleSave}
          style={{
            background: P, color: "#fff", border: "none",
            borderRadius: 12, padding: "10px 28px",
            fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = PD; }}
          onMouseLeave={e => { e.currentTarget.style.background = P; }}>
          Kaydet
        </button>
      </div>
    </YPLayout>
  );
}
