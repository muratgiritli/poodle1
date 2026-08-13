// Route: /hesabim/ayarlar
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft, BadgeCheck, ChevronRight, User, Phone, Mail,
  HeartPulse, UtensilsCrossed, Ruler, Shield, Ban,
  Smartphone, Download, HelpCircle, MessageSquare, FileText,
  LogOut, Trash2, X, ShieldCheck, PawPrint,
} from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { useCustomer } from "@/contexts/CustomerContext";
import { goBack } from "@/lib/goBack";
import { IS_YP } from "@/lib/store";

const BASE = IS_YP ? "" : "/yourpoodle";
const P   = "#5D3A1A";
const PL  = "#F5F0E6";
const GT  = "#6B7280";
const DRK = "#111827";
const GB  = "#E5E7EB";
const GBG = "#F9F9FB";

const LS_KEY = "yourpoodle-settings";

function loadNotifPrefs() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { orders: true, club: true, guide: true, campaigns: false };
}

function maskPhone(phone?: string | null) {
  if (!phone) return "Telefon eklenmemiş";
  const d = phone.replace(/\D/g, "");
  if (d.length < 7) return phone;
  return `+90 ${d.slice(-10, -7)} ••• •• ${d.slice(-2)}`;
}

function Toggle({ on, toggle }: { on: boolean; toggle: () => void }) {
  return (
    <button onClick={toggle} role="switch" aria-checked={on}
      style={{
        width: 44, height: 24, borderRadius: 12, flexShrink: 0,
        background: on ? P : "#D1D5DB",
        border: "none", cursor: "pointer", position: "relative", transition: "background .2s",
      }}>
      <span style={{
        position: "absolute", top: 2, left: on ? 22 : 2,
        width: 20, height: 20, borderRadius: "50%", background: "#fff",
        transition: "left .2s", boxShadow: "0 1px 4px rgba(0,0,0,.18)",
      }} />
    </button>
  );
}

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 16, border: `1px solid ${GB}`,
      overflow: "hidden", marginBottom: 10,
    }}>
      {title && (
        <div style={{ padding: "12px 14px 6px" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: DRK }}>{title}</span>
        </div>
      )}
      <div style={{ padding: "0 14px 10px" }}>{children}</div>
    </div>
  );
}

function Row({
  icon: Icon, label, value, subtitle, badge, actionLabel, onClick, disabled, disabledLabel,
}: {
  icon: React.ElementType; label: string;
  value?: string; subtitle?: string; badge?: "verified";
  actionLabel?: string; onClick?: () => void;
  disabled?: boolean; disabledLabel?: string;
}) {
  const inner = (
    <>
      <div style={{
        width: 36, height: 36, borderRadius: 10, background: PL,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        opacity: disabled ? 0.55 : 1,
      }}>
        <Icon size={16} color={P} />
      </div>
      <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: disabled ? GT : DRK }}>{label}</div>
        {(value || subtitle) && (
          <div style={{ fontSize: 11, color: GT, marginTop: 2,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {value ?? subtitle}
          </div>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        {badge === "verified" && (
          <span style={{
            fontSize: 10, fontWeight: 700, color: "#16A34A",
            background: "#F0FDF4", padding: "2px 7px", borderRadius: 999,
          }}>Doğrulandı</span>
        )}
        {disabled && (
          <span style={{
            fontSize: 10, fontWeight: 700, color: GT,
            background: GBG, padding: "2px 7px", borderRadius: 999,
            border: `1px solid ${GB}`,
          }}>{disabledLabel ?? "Yakında"}</span>
        )}
        {!disabled && actionLabel && (
          <span style={{ fontSize: 11, fontWeight: 700, color: P }}>{actionLabel}</span>
        )}
        {!disabled && <ChevronRight size={15} color="#D1D5DB" />}
      </div>
    </>
  );

  if (disabled) {
    return (
      <div style={{
        width: "100%", display: "flex", alignItems: "center", gap: 10,
        padding: "11px 0", borderBottom: `1px solid ${GB}`, opacity: 0.85,
      }}>
        {inner}
      </div>
    );
  }

  return (
    <button onClick={onClick}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 10,
        padding: "11px 0",
        background: "none", border: "none", borderBottom: `1px solid ${GB}`,
        cursor: "pointer", fontFamily: "inherit", textAlign: "left",
      }}
      onMouseEnter={e => { e.currentTarget.style.background = GBG; }}
      onMouseLeave={e => { e.currentTarget.style.background = "none"; }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 10, background: PL,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <Icon size={16} color={P} />
      </div>
      <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: DRK }}>{label}</div>
        {(value || subtitle) && (
          <div style={{ fontSize: 11, color: GT, marginTop: 2,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {value ?? subtitle}
          </div>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        {badge === "verified" && (
          <span style={{
            fontSize: 10, fontWeight: 700, color: "#16A34A",
            background: "#F0FDF4", padding: "2px 7px", borderRadius: 999,
          }}>Doğrulandı</span>
        )}
        {actionLabel && (
          <span style={{ fontSize: 11, fontWeight: 700, color: P }}>{actionLabel}</span>
        )}
        <ChevronRight size={15} color="#D1D5DB" />
      </div>
    </button>
  );
}

function EditProfileModal({ name, onSave, onClose, saving }: {
  name: string; onSave: (n: string) => void; onClose: () => void; saving?: boolean;
}) {
  const [val, setVal] = useState(name);
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)",
                  display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:9999 }}>
      <div style={{ background:"#fff", borderRadius:"20px 20px 0 0",
                    padding:"24px 20px 36px", width:"100%", maxWidth: "var(--yp-shell-max)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
          <span style={{ fontSize:17, fontWeight:700, color:DRK }}>Profili Düzenle</span>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer" }}>
            <X size={20} color={GT} />
          </button>
        </div>
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:12, fontWeight:600, color:GT, marginBottom:6 }}>Ad Soyad</div>
          <input value={val} onChange={e => setVal(e.target.value)}
            style={{ width:"100%", padding:"10px 12px", borderRadius:12,
                     border:`1.5px solid ${GB}`, fontSize:14, fontFamily:"inherit",
                     color:DRK, outline:"none", boxSizing:"border-box" as any }} />
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onClose}
            style={{ flex:1, padding:"12px 0", borderRadius:12, border:`1.5px solid ${GB}`,
                     background:"#fff", fontSize:14, fontWeight:600, color:GT,
                     cursor:"pointer", fontFamily:"inherit" }}>İptal</button>
          <button onClick={() => onSave(val.trim())} disabled={saving || val.trim().length < 2}
            style={{ flex:1, padding:"12px 0", borderRadius:12, border:"none",
                     background:P, fontSize:14, fontWeight:700, color:"#fff",
                     cursor:"pointer", fontFamily:"inherit", opacity: saving || val.trim().length < 2 ? 0.6 : 1 }}>
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}

function AddEmailModal({ initial, onSave, onClose, saving }: {
  initial?: string | null; onSave: (e: string) => void; onClose: () => void; saving?: boolean;
}) {
  const [val, setVal] = useState(initial || "");
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)",
                  display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:9999 }}>
      <div style={{ background:"#fff", borderRadius:"20px 20px 0 0",
                    padding:"24px 20px 36px", width:"100%", maxWidth: "var(--yp-shell-max)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
          <span style={{ fontSize:17, fontWeight:700, color:DRK }}>E-posta</span>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer" }}>
            <X size={20} color={GT} />
          </button>
        </div>
        <div style={{ marginBottom:18 }}>
          <div style={{ fontSize:12, fontWeight:600, color:GT, marginBottom:6 }}>E-posta Adresi</div>
          <input type="email" value={val} onChange={e => setVal(e.target.value)}
            placeholder="ornek@email.com"
            style={{ width:"100%", padding:"10px 12px", borderRadius:12,
                     border:`1.5px solid ${GB}`, fontSize:14, fontFamily:"inherit",
                     color:DRK, outline:"none", boxSizing:"border-box" as any }} />
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onClose}
            style={{ flex:1, padding:"12px 0", borderRadius:12, border:`1.5px solid ${GB}`,
                     background:"#fff", fontSize:14, fontWeight:600, color:GT,
                     cursor:"pointer", fontFamily:"inherit" }}>İptal</button>
          <button onClick={() => val && onSave(val.trim())} disabled={saving || !val.includes("@")}
            style={{ flex:1, padding:"12px 0", borderRadius:12, border:"none",
                     background:P, fontSize:14, fontWeight:700, color:"#fff",
                     cursor:"pointer", fontFamily:"inherit", opacity: saving || !val.includes("@") ? 0.6 : 1 }}>
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ onConfirm, onClose }: {
  onConfirm: () => void; onClose: () => void;
}) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  padding:"0 20px", zIndex:9999 }}>
      <div style={{ background:"#fff", borderRadius:20, padding:"24px 20px",
                    width:"100%", maxWidth:380 }}>
        <div style={{ fontSize:16, fontWeight:700, color:DRK, marginBottom:10 }}>
          Hesabı silmek istediğinize emin misiniz?
        </div>
        <div style={{ fontSize:13, color:GT, marginBottom:22, lineHeight:1.5 }}>
          Bu işlem geri alınamaz. Tüm verileriniz kalıcı olarak silinecektir.
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onClose}
            style={{ flex:1, padding:"12px 0", borderRadius:12, border:`1.5px solid ${GB}`,
                     background:"#fff", fontSize:14, fontWeight:600, color:GT,
                     cursor:"pointer", fontFamily:"inherit" }}>İptal</button>
          <button onClick={onConfirm}
            style={{ flex:1, padding:"12px 0", borderRadius:12, border:"none",
                     background:"#DC2626", fontSize:14, fontWeight:700, color:"#fff",
                     cursor:"pointer", fontFamily:"inherit" }}>Evet, Sil</button>
        </div>
      </div>
    </div>
  );
}

type Dog = {
  id: number;
  slug: string;
  name: string;
  breed?: string;
  avatar_url?: string | null;
  birth_date?: string | null;
};

const BREED_TR: Record<string, string> = {
  toy: "Toy Poodle",
  miniature: "Minyatür Poodle",
  standart: "Standart Poodle",
  moyen: "Moyen Poodle",
};

function dogAge(birth?: string | null) {
  if (!birth) return null;
  const b = new Date(birth);
  if (Number.isNaN(b.getTime())) return null;
  const months = Math.floor((Date.now() - b.getTime()) / (1000 * 60 * 60 * 24 * 30.44));
  if (months < 12) return `${months} ay`;
  return `${Math.floor(months / 12)} yaş`;
}

export default function YPHesabimAyarlarPage() {
  const [, navigate] = useLocation();
  const { isLoggedIn, isLoading, customer, logout, updateProfile } = useCustomer();

  const [notif, setNotif] = useState(loadNotifPrefs());
  const [editOpen, setEditOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    document.title = "Hesap Ayarları | YourPoodle";
  }, []);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate(`${BASE}/giris?returnTo=${encodeURIComponent("/hesabim/ayarlar")}`);
    }
  }, [isLoading, isLoggedIn, navigate]);

  const { data: dogs = [] } = useQuery<Dog[]>({
    queryKey: ["/api/my/dogs"],
    enabled: !!isLoggedIn,
    queryFn: async () => {
      const r = await fetch("/api/my/dogs", { credentials: "include" });
      if (!r.ok) return [];
      return r.json();
    },
  });

  const primaryDog = dogs[0] || null;

  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(""), 2200);
  };

  const saveNotif = (key: keyof typeof notif) => {
    const next = { ...notif, [key]: !notif[key] };
    setNotif(next);
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch {}
  };

  const handleSaveName = async (name: string) => {
    if (name.length < 2) return;
    setSaving(true);
    try {
      await updateProfile({ name });
      setEditOpen(false);
      showToast("Profil güncellendi ✓");
    } catch (e: any) {
      showToast(e?.message || "Güncellenemedi");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEmail = async (email: string) => {
    setSaving(true);
    try {
      await updateProfile({ email });
      setEmailOpen(false);
      showToast("E-posta kaydedildi ✓");
    } catch (e: any) {
      showToast(e?.message || "E-posta kaydedilemedi");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate(`${BASE}/giris`);
  };

  const handleDeleteConfirm = async () => {
    setDeleteOpen(false);
    showToast("Hesap silme talebi alındı");
    await logout();
    navigate(`${BASE}/giris`);
  };

  if (isLoading || !isLoggedIn) {
    return (
      <YPLayout activeLink="" constrain={false} hideFooter>
        <div style={{ padding: 48, textAlign: "center", color: GT, fontSize: 14 }}>Yükleniyor...</div>
      </YPLayout>
    );
  }

  const fullName = customer?.name || "Üye";
  const email = customer?.email || null;
  const initials = fullName.split(/\s+/).map(p => p[0]).join("").slice(0, 2).toUpperCase();

  return (
    <YPLayout activeLink="" constrain={false} hideFooter>
      {toast && (
        <div style={{
          position:"fixed", top:72, left:"50%", transform:"translateX(-50%)",
          background:"#111", color:"#fff", padding:"10px 22px", borderRadius:12,
          fontSize:13, fontWeight:600, zIndex:9999, whiteSpace:"nowrap",
          boxShadow:"0 4px 20px rgba(0,0,0,.3)",
        }}>
          {toast}
        </div>
      )}

      {editOpen && (
        <EditProfileModal name={fullName} saving={saving}
          onSave={handleSaveName} onClose={() => setEditOpen(false)} />
      )}
      {emailOpen && (
        <AddEmailModal initial={email} saving={saving}
          onSave={handleSaveEmail} onClose={() => setEmailOpen(false)} />
      )}
      {deleteOpen && (
        <DeleteModal onConfirm={handleDeleteConfirm} onClose={() => setDeleteOpen(false)} />
      )}

      <div style={{
        maxWidth: "var(--yp-shell-max)", margin:"0 auto",
        fontFamily:"'Inter',-apple-system,sans-serif",
        background:GBG, minHeight:"100vh", color:DRK, paddingBottom:24,
      }}>
        <div style={{ padding:"14px 14px 12px", background:"#fff",
                      borderBottom:`1px solid ${GB}`, marginBottom:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10 }}>
            <button onClick={() => goBack(navigate, "/hesabim")}
              style={{ background:"none", border:"none", cursor:"pointer", padding:0, display:"flex" }}>
              <ArrowLeft size={17} color={P} />
            </button>
            <span style={{ fontSize:12, color:P, fontWeight:500 }}>Hesabım</span>
            <span style={{ fontSize:12, color:P }}>/</span>
            <span style={{ fontSize:12, color:P, fontWeight:700 }}>Hesap Ayarları</span>
          </div>
          <h1 style={{ fontSize:22, fontWeight:800, color:DRK, margin:0 }}>Hesap Ayarları</h1>
          <p style={{ fontSize:13, color:GT, margin:"4px 0 0" }}>
            Kişisel bilgilerinizi, güvenlik ve tercihlerinizi yönetin.
          </p>
        </div>

        <div style={{ padding:"0 12px" }}>
          <div style={{
            background:"#fff", borderRadius:16, border:`1px solid ${GB}`,
            padding:"14px", marginBottom:10,
            display:"flex", alignItems:"center", gap:12,
          }}>
            <div style={{
              width:56, height:56, borderRadius:"50%", background:PL,
              display:"flex", alignItems:"center", justifyContent:"center",
              border:`2px solid ${PL}`, flexShrink:0,
              fontSize:18, fontWeight:800, color:P,
            }}>
              {initials}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:15, fontWeight:800, color:DRK, overflow:"hidden",
                            textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {fullName}
              </div>
              <div style={{ fontSize:11, color:GT, marginTop:2 }}>{maskPhone(customer?.phone)}</div>
              <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:4,
                            background:PL, borderRadius:999, width:"fit-content", padding:"3px 8px" }}>
                <BadgeCheck size={12} color={P} />
                <span style={{ fontSize:10, fontWeight:700, color:P }}>Doğrulanmış Üye</span>
              </div>
            </div>
            <button onClick={() => setEditOpen(true)}
              style={{
                flexShrink:0, padding:"8px 12px", borderRadius:12,
                border:`1.5px solid ${P}`, background:"#fff",
                fontSize:11, fontWeight:700, color:P,
                cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap",
              }}>
              Profili Düzenle
            </button>
          </div>

          <Card title="Kişisel Bilgiler">
            <Row icon={User} label="Ad Soyad" value={fullName} onClick={() => setEditOpen(true)} />
            <Row icon={Phone} label="Cep Telefonu" value={maskPhone(customer?.phone)} badge="verified"
                 disabled disabledLabel="Değişiklik yakında" />
            <Row icon={Mail} label="E-posta Adresi"
                 value={email ?? "E-posta eklenmedi"}
                 actionLabel={email ? undefined : "Ekle"}
                 onClick={() => setEmailOpen(true)} />
          </Card>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
            <div style={{ background:"#fff", borderRadius:16, border:`1px solid ${GB}`,
                          overflow:"hidden", padding:"12px 12px 8px" }}>
              <div style={{ fontSize:13, fontWeight:700, color:DRK, marginBottom:8 }}>
                Poodle Profilim
              </div>
              {primaryDog ? (
                <div style={{ display:"flex", alignItems:"center", gap:8,
                              paddingBottom:8, borderBottom:`1px solid ${GB}`, marginBottom:8 }}>
                  {primaryDog.avatar_url ? (
                    <img src={primaryDog.avatar_url} alt={primaryDog.name}
                      style={{ width:38, height:38, borderRadius:"50%", objectFit:"cover", flexShrink:0 }} />
                  ) : (
                    <div style={{
                      width:38, height:38, borderRadius:"50%", background:PL, flexShrink:0,
                      display:"flex", alignItems:"center", justifyContent:"center",
                    }}>
                      <PawPrint size={16} color={P} />
                    </div>
                  )}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:DRK }}>{primaryDog.name}</div>
                    <div style={{ fontSize:10, color:GT }}>
                      {BREED_TR[primaryDog.breed || ""] || primaryDog.breed || "Poodle"}
                      {dogAge(primaryDog.birth_date) ? ` · ${dogAge(primaryDog.birth_date)}` : ""}
                    </div>
                  </div>
                  <button onClick={() => navigate(`${BASE}/p/${primaryDog.slug}`)}
                    style={{
                      fontSize:9, fontWeight:700, color:P,
                      background:"none", border:`1px solid ${P}`,
                      borderRadius:7, padding:"3px 6px", cursor:"pointer", fontFamily:"inherit",
                      flexShrink:0,
                    }}>
                    Profili Yönet
                  </button>
                </div>
              ) : (
                <div style={{ paddingBottom:8, borderBottom:`1px solid ${GB}`, marginBottom:8 }}>
                  <div style={{ fontSize:11, color:GT, marginBottom:8 }}>Henüz Poodle profili yok</div>
                  <button onClick={() => navigate(`${BASE}/p/olustur`)}
                    style={{
                      fontSize:11, fontWeight:700, color:"#fff", background:P, border:"none",
                      borderRadius:8, padding:"6px 10px", cursor:"pointer", fontFamily:"inherit",
                    }}>
                    Poodle Ekle
                  </button>
                </div>
              )}

              {[
                { Icon: HeartPulse, label: "Sağlık ve Bakım Bilgileri" },
                { Icon: UtensilsCrossed, label: "Mama Tercihleri" },
                { Icon: Ruler, label: "Ölçüler ve Beden Bilgileri" },
              ].map(({ Icon, label }, i, arr) => (
                <div key={label}
                  style={{
                    width: "100%", display: "flex", alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: i < arr.length - 1 ? `1px solid ${GB}` : "none",
                    opacity: 0.75,
                  }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: PL,
                                  display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={14} color={P} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: GT, textAlign: "left" }}>
                      {label}
                    </span>
                  </div>
                  <span style={{
                    fontSize: 9, fontWeight: 700, color: GT,
                    background: GBG, padding: "2px 6px", borderRadius: 999,
                    border: `1px solid ${GB}`,
                  }}>Yakında</span>
                </div>
              ))}
            </div>

            <div style={{ background:"#fff", borderRadius:16, border:`1px solid ${GB}`,
                          overflow:"hidden", padding:"12px 12px 8px" }}>
              <div style={{ fontSize:13, fontWeight:700, color:DRK, marginBottom:8 }}>
                Bildirim Tercihleri
              </div>
              {[
                { key:"orders",    label:"Sipariş Bildirimleri",    desc:"Sipariş durumu ve kargo bilgileri" },
                { key:"club",      label:"Club Bildirimleri",        desc:"Club etkinlikleri ve özel içerikler" },
                { key:"guide",     label:"Rehber Önerileri",         desc:"Rehber içerikleri ve öneriler" },
                { key:"campaigns", label:"Kampanya ve İndirimler",   desc:"Özel kampanyalar ve indirim fırsatları" },
              ].map(({ key, label, desc }, i, arr) => (
                <div key={key}
                  style={{
                    display:"flex", alignItems:"center", justifyContent:"space-between",
                    padding:"8px 0",
                    borderBottom: i < arr.length - 1 ? `1px solid ${GB}` : "none",
                  }}>
                  <div style={{ flex:1, paddingRight:8 }}>
                    <div style={{ fontSize:11, fontWeight:600, color:DRK }}>{label}</div>
                    <div style={{ fontSize:9, color:GT, marginTop:1, lineHeight:1.3 }}>{desc}</div>
                  </div>
                  <Toggle on={notif[key as keyof typeof notif]} toggle={() => saveNotif(key as keyof typeof notif)} />
                </div>
              ))}
            </div>
          </div>

          <Card title="Gizlilik ve Güvenlik">
            <Row icon={Shield} label="Profil Gizliliği" subtitle="Herkese Açık"
                 disabled disabledLabel="Yakında" />
            <Row icon={Ban} label="Engellenen Hesaplar"
                 disabled disabledLabel="Yakında" />
            <Row icon={Smartphone} label="Oturum Açılan Cihazlar"
                 disabled disabledLabel="Yakında" />
            <Row icon={Download} label="Verilerimi İndir"
                 disabled disabledLabel="Yakında" />
          </Card>

          <Card title="Destek ve Yasal">
            <Row icon={HelpCircle} label="Yardım Merkezi"
                 onClick={() => navigate("/hesabim/yardim")} />
            <Row icon={MessageSquare} label="Bize Ulaşın"
                 onClick={() => navigate(`${BASE}/iletisim`)} />
            <Row icon={ShieldCheck} label="Gizlilik Politikası"
                 onClick={() => navigate(`${BASE}/gizlilik-politikasi`)} />
            <Row icon={FileText} label="Kullanım Şartları"
                 onClick={() => navigate(`${BASE}/kullanim-sartlari`)} />
          </Card>

          <button onClick={handleLogout}
            style={{
              width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              padding:"13px 0", borderRadius:14, marginBottom:10,
              border:`1.5px solid ${P}`, background:"#fff",
              fontSize:14, fontWeight:700, color:P,
              cursor:"pointer", fontFamily:"inherit",
            }}>
            <LogOut size={17} /> Oturumu Kapat
          </button>

          <div style={{
            background:"#FEF2F2", border:"1px solid #FECACA",
            borderRadius:16, padding:"14px", marginBottom:12,
            display:"flex", alignItems:"flex-start", gap:12,
          }}>
            <Trash2 size={20} color="#DC2626" style={{ flexShrink:0, marginTop:2 }} />
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:700, color:DRK }}>Hesabı Sil</div>
              <div style={{ fontSize:12, color:GT, marginTop:3, lineHeight:1.5 }}>
                Hesabınızı ve tüm verilerinizi kalıcı olarak silin.
              </div>
            </div>
            <button onClick={() => setDeleteOpen(true)}
              style={{
                flexShrink:0, padding:"8px 12px", borderRadius:10,
                border:"1.5px solid #DC2626", background:"#fff",
                fontSize:11, fontWeight:700, color:"#DC2626",
                cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap",
              }}>
              Hesabı Sil
            </button>
          </div>

        </div>
      </div>
    </YPLayout>
  );
}
