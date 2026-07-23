// Route: /hesabim/ayarlar
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft, BadgeCheck, ChevronRight, User, Phone, Mail,
  HeartPulse, UtensilsCrossed, Ruler, Bell, Shield, Ban,
  Smartphone, Download, HelpCircle, MessageSquare, FileText,
  LogOut, Trash2, X, ShieldCheck, Check,
} from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { useCustomer } from "@/contexts/CustomerContext";

/* ── Palette ─────────────────────────── */
const P   = "#4B2BD6";
const PL  = "#F3EEFF";
const NAV = "#1D1E9B";
const GT  = "#6B7280";
const DRK = "#111827";
const GB  = "#E5E7EB";
const GBG = "#F9F9FB";

/* ── LocalStorage key ───────────────── */
const LS_KEY = "yourpoodle-settings";

function loadNotifPrefs() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { orders: true, club: true, guide: true, campaigns: false };
}

/* ── Reusable Toggle ────────────────── */
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

/* ── Section card ───────────────────── */
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

/* ── Setting row ────────────────────── */
function Row({
  icon: Icon, label, value, subtitle, badge, actionLabel, onClick,
}: {
  icon: React.ElementType; label: string;
  value?: string; subtitle?: string; badge?: "verified";
  actionLabel?: string; onClick?: () => void;
}) {
  return (
    <button onClick={onClick}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 10,
        padding: "11px 0", borderBottom: `1px solid ${GB}`,
        background: "none", border: "none", borderTop: "none",
        borderLeft: "none", borderRight: "none",
        cursor: "pointer", fontFamily: "inherit", textAlign: "left",
      }}
      onMouseEnter={e => { e.currentTarget.style.background = GBG; }}
      onMouseLeave={e => { e.currentTarget.style.background = "none"; }}
    >
      {/* Icon */}
      <div style={{
        width: 36, height: 36, borderRadius: 10, background: PL,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <Icon size={16} color={P} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: DRK }}>{label}</div>
        {(value || subtitle) && (
          <div style={{ fontSize: 11, color: GT, marginTop: 2,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {value ?? subtitle}
          </div>
        )}
      </div>

      {/* Right */}
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

/* ── Toggle row ─────────────────────── */
function ToggleRow({ label, desc, on, toggle }: {
  label: string; desc: string; on: boolean; toggle: () => void;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "11px 0", borderBottom: `1px solid ${GB}`,
    }}>
      <div style={{ flex: 1, paddingRight: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: DRK }}>{label}</div>
        <div style={{ fontSize: 11, color: GT, marginTop: 2, lineHeight: 1.4 }}>{desc}</div>
      </div>
      <Toggle on={on} toggle={toggle} />
    </div>
  );
}

/* ── Edit Profile Modal ─────────────── */
function EditProfileModal({ name, onSave, onClose }: {
  name: string; onSave: (n: string) => void; onClose: () => void;
}) {
  const [val, setVal] = useState(name);
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)",
                  display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:9999 }}>
      <div style={{ background:"#fff", borderRadius:"20px 20px 0 0",
                    padding:"24px 20px 36px", width:"100%", maxWidth:480 }}>
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
        <button style={{
          width:"100%", padding:"10px 0", borderRadius:10,
          border:`1.5px solid ${GB}`, background:"#fff",
          fontSize:13, color:GT, cursor:"pointer", fontFamily:"inherit", marginBottom:10,
        }}>Fotoğraf Değiştir</button>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onClose}
            style={{ flex:1, padding:"12px 0", borderRadius:12, border:`1.5px solid ${GB}`,
                     background:"#fff", fontSize:14, fontWeight:600, color:GT,
                     cursor:"pointer", fontFamily:"inherit" }}>İptal</button>
          <button onClick={() => onSave(val)}
            style={{ flex:1, padding:"12px 0", borderRadius:12, border:"none",
                     background:P, fontSize:14, fontWeight:700, color:"#fff",
                     cursor:"pointer", fontFamily:"inherit" }}>Kaydet</button>
        </div>
      </div>
    </div>
  );
}

/* ── Add Email Modal ────────────────── */
function AddEmailModal({ onSave, onClose }: {
  onSave: (e: string) => void; onClose: () => void;
}) {
  const [val, setVal] = useState("");
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)",
                  display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:9999 }}>
      <div style={{ background:"#fff", borderRadius:"20px 20px 0 0",
                    padding:"24px 20px 36px", width:"100%", maxWidth:480 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
          <span style={{ fontSize:17, fontWeight:700, color:DRK }}>E-posta Ekle</span>
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
          <button onClick={() => val && onSave(val)}
            style={{ flex:1, padding:"12px 0", borderRadius:12, border:"none",
                     background:P, fontSize:14, fontWeight:700, color:"#fff",
                     cursor:"pointer", fontFamily:"inherit" }}>Kaydet</button>
        </div>
      </div>
    </div>
  );
}

/* ── Delete Confirm Modal ───────────── */
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

/* ════════════════════════════
   MAIN PAGE
════════════════════════════ */
export default function YPHesabimAyarlarPage() {
  const [, navigate] = useLocation();
  const { isLoggedIn, logout } = useCustomer() as any;

  const [fullName, setFullName] = useState("Hacı Murat Giritli");
  const [email, setEmail]       = useState<string | null>(null);
  const [notif, setNotif]       = useState(loadNotifPrefs());
  const [editOpen, setEditOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toast, setToast]       = useState("");

  useEffect(() => {
    if (isLoggedIn === false)
      navigate("/yourpoodle/giris?returnTo=/hesabim/ayarlar");
  }, [isLoggedIn]);
  if (!isLoggedIn) return null;

  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(""), 2200);
  };

  const saveNotif = (key: keyof typeof notif) => {
    const next = { ...notif, [key]: !notif[key] };
    setNotif(next);
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch {}
  };

  const handleLogout = () => {
    if (typeof logout === "function") logout();
    navigate("/yourpoodle/giris");
    showToast("Oturum kapatıldı");
  };

  const handleDeleteConfirm = () => {
    setDeleteOpen(false);
    if (typeof logout === "function") logout();
    navigate("/yourpoodle/giris");
    showToast("Hesap silme talebi alındı");
  };

  return (
    <YPLayout activeLink="club" constrain={false}>
      {/* ── Toast ── */}
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

      {/* ── Modals ── */}
      {editOpen && (
        <EditProfileModal name={fullName}
          onSave={n => { setFullName(n); setEditOpen(false); showToast("Profil güncellendi ✓"); }}
          onClose={() => setEditOpen(false)} />
      )}
      {emailOpen && (
        <AddEmailModal
          onSave={e => { setEmail(e); setEmailOpen(false); showToast("E-posta eklendi ✓"); }}
          onClose={() => setEmailOpen(false)} />
      )}
      {deleteOpen && (
        <DeleteModal onConfirm={handleDeleteConfirm} onClose={() => setDeleteOpen(false)} />
      )}

      <div style={{
        maxWidth:480, margin:"0 auto",
        fontFamily:"'Inter',-apple-system,sans-serif",
        background:GBG, minHeight:"100vh", color:DRK, paddingBottom:24,
      }}>

        {/* ── PAGE HEADER ── */}
        <div style={{ padding:"14px 14px 12px", background:"#fff",
                      borderBottom:`1px solid ${GB}`, marginBottom:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10 }}>
            <button onClick={() => navigate("/hesabim")}
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

          {/* ── PROFILE CARD ── */}
          <div style={{
            background:"#fff", borderRadius:16, border:`1px solid ${GB}`,
            padding:"14px", marginBottom:10,
            display:"flex", alignItems:"center", gap:12,
          }}>
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop"
              alt="avatar"
              style={{ width:56, height:56, borderRadius:"50%", objectFit:"cover",
                       border:`2px solid ${PL}`, flexShrink:0 }}
            />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:15, fontWeight:800, color:DRK, overflow:"hidden",
                            textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {fullName}
              </div>
              <div style={{ fontSize:11, color:GT, marginTop:2 }}>Üyelik: Temmuz 2026</div>
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

          {/* ── KİŞİSEL BİLGİLER ── */}
          <Card title="Kişisel Bilgiler">
            <Row icon={User} label="Ad Soyad" value={fullName} onClick={() => setEditOpen(true)} />
            <Row icon={Phone} label="Cep Telefonu" value="+90 532 ••• •• 47" badge="verified"
                 onClick={() => alert("Telefon doğrulama yakında!")} />
            <Row icon={Mail} label="E-posta Adresi"
                 value={email ?? "E-posta eklenmedi"}
                 actionLabel={email ? undefined : "Ekle"}
                 onClick={() => setEmailOpen(true)} />
          </Card>

          {/* ── POODLE PROFİLİM + BİLDİRİM TERCİHLERİ (2-col) ── */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>

            {/* Poodle Profilim */}
            <div style={{ background:"#fff", borderRadius:16, border:`1px solid ${GB}`,
                          overflow:"hidden", padding:"12px 12px 8px" }}>
              <div style={{ fontSize:13, fontWeight:700, color:DRK, marginBottom:8 }}>
                Poodle Profilim
              </div>
              {/* Tarçın mini card */}
              <div style={{ display:"flex", alignItems:"center", gap:8,
                            paddingBottom:8, borderBottom:`1px solid ${GB}`, marginBottom:8 }}>
                <img
                  src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=48&h=48&fit=crop"
                  alt="Tarçın"
                  style={{ width:38, height:38, borderRadius:"50%", objectFit:"cover", flexShrink:0 }}
                />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:DRK }}>Tarçın</div>
                  <div style={{ fontSize:10, color:GT }}>Toy Poodle · 3 yaş</div>
                </div>
                <button onClick={() => navigate("/yourpoodle/p/tarcin")}
                  style={{
                    fontSize:9, fontWeight:700, color:P,
                    background:"none", border:`1px solid ${P}`,
                    borderRadius:7, padding:"3px 6px", cursor:"pointer", fontFamily:"inherit",
                    flexShrink:0,
                  }}>
                  Profili Yönet
                </button>
              </div>

              {/* Sub-rows */}
              {[
                { Icon: HeartPulse, label:"Sağlık ve Bakım Bilgileri" },
                { Icon: UtensilsCrossed, label:"Mama Tercihleri" },
                { Icon: Ruler, label:"Ölçüler ve Beden Bilgileri" },
              ].map(({ Icon, label }, i, arr) => (
                <button key={label}
                  onClick={() => showToast(`${label} yakında`)}
                  style={{
                    width:"100%", display:"flex", alignItems:"center",
                    justifyContent:"space-between",
                    padding:"8px 0",
                    borderBottom: i < arr.length - 1 ? `1px solid ${GB}` : "none",
                    background:"none", border:"none", borderTop:"none",
                    borderLeft:"none", borderRight:"none",
                    cursor:"pointer", fontFamily:"inherit",
                  }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <div style={{ width:28, height:28, borderRadius:8, background:PL,
                                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Icon size={14} color={P} />
                    </div>
                    <span style={{ fontSize:11, fontWeight:600, color:DRK, textAlign:"left" }}>
                      {label}
                    </span>
                  </div>
                  <ChevronRight size={13} color="#D1D5DB" />
                </button>
              ))}
            </div>

            {/* Bildirim Tercihleri */}
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

          {/* ── GİZLİLİK VE GÜVENLİK ── */}
          <Card title="Gizlilik ve Güvenlik">
            <Row icon={Shield} label="Profil Gizliliği" subtitle="Herkese Açık"
                 onClick={() => alert("Gizlilik seçenekleri yakında")} />
            <Row icon={Ban} label="Engellenen Hesaplar" subtitle="2 hesap"
                 onClick={() => alert("Engellenen hesaplar yakında")} />
            <Row icon={Smartphone} label="Oturum Açılan Cihazlar" subtitle="1 cihaz"
                 onClick={() => alert("Cihazlar yakında")} />
            <Row icon={Download} label="Verilerimi İndir"
                 onClick={() => showToast("Veri indirme talebi alındı ✓")} />
          </Card>

          {/* ── DESTEK VE YASAL ── */}
          <Card title="Destek ve Yasal">
            <Row icon={HelpCircle} label="Yardım Merkezi"
                 onClick={() => alert("Yardım Merkezi")} />
            <Row icon={MessageSquare} label="Bize Ulaşın"
                 onClick={() => alert("İletişim")} />
            <Row icon={ShieldCheck} label="Gizlilik Politikası"
                 onClick={() => alert("Gizlilik Politikası")} />
            <Row icon={FileText} label="Üyelik Sözleşmesi"
                 onClick={() => alert("Üyelik Sözleşmesi")} />
          </Card>

          {/* ── OTURUMU KAPAT ── */}
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

          {/* ── HESABI SİL ── */}
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

          {/* ── FOOTER ── */}
          <div style={{ background:NAV, borderRadius:16, padding:"20px 16px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
              <span style={{ fontSize:22 }}>🐾</span>
              <span style={{ fontSize:16, fontWeight:800, color:"#fff" }}>YourPoodle</span>
            </div>
            <div style={{ display:"flex", gap:16, marginBottom:10 }}>
              {["Yardım","İletişim","KVKK"].map(l => (
                <a key={l} href="#"
                  style={{ fontSize:12, color:"rgba(255,255,255,.7)", textDecoration:"none" }}>
                  {l}
                </a>
              ))}
            </div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,.4)" }}>© 2026 YourPoodle</div>
          </div>
        </div>
      </div>
    </YPLayout>
  );
}
