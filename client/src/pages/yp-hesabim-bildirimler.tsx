// Route: /hesabim/bildirimler
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft, SlidersHorizontal, ChevronRight, Truck, ShoppingCart,
  BookOpen, Percent, Bell, Star, Check, X,
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
const GBG = "#F9FAFB";

/* ── Types ──────────────────────────── */
type Tab   = "all" | "order" | "club" | "guide" | "campaign";
type Group = "today" | "yesterday" | "this_week";
type IconT = "truck" | "avatar" | "book" | "cart" | "percent" | "star";

interface Notif {
  id:       string;
  category: "order" | "club" | "guide" | "campaign";
  group:    Group;
  title:    string;
  desc:     string;
  time:     string;
  isRead:   boolean;
  icon:     IconT;
  avatar?:  string;
  link?:    string;
}

/* ── Mock data (matches image exactly) ─ */
const INIT: Notif[] = [
  // BUGÜN
  { id:"n1", category:"order",    group:"today",      isRead:false, icon:"truck",
    title:"Siparişiniz kargoya verildi",
    desc:"YP-20260723 numaralı siparişiniz yola çıktı.",
    time:"12 dk önce", link:"/hesabim/siparisler" },
  { id:"n2", category:"club",     group:"today",      isRead:false, icon:"avatar",
    avatar:"https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=40&h=40&fit=crop",
    title:"Gönderinize yeni yorum",
    desc:"@luna.toypoodle: Çok tatlı görünüyorsun! 💜",
    time:"28 dk önce", link:"/club" },
  { id:"n3", category:"club",     group:"today",      isRead:false, icon:"avatar",
    avatar:"https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=40&h=40&fit=crop",
    title:"Tarçın'ın paylaşımı beğenildi",
    desc:"Gönderiniz 100 beğeniye ulaştı.",
    time:"1 sa önce", link:"/club" },
  { id:"n4", category:"club",     group:"today",      isRead:false, icon:"avatar",
    avatar:"https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=40&h=40&fit=crop",
    title:"Yeni takipçiniz var",
    desc:"@badem.poodle sizi takip etmeye başladı.",
    time:"2 sa önce", link:"/club" },
  // DÜN
  { id:"n5", category:"guide",    group:"yesterday",  isRead:false, icon:"book",
    title:"Yeni rehber önerisi",
    desc:"Toy Poodle'larda Yaz Bakımı rehberini okuyun.",
    time:"Dün 18:40", link:"/rehber" },
  { id:"n6", category:"order",    group:"yesterday",  isRead:true,  icon:"cart",
    title:"Sepetinizde ürün kaldı",
    desc:"Buharlı Masaj Tarağı hâlâ sizi bekliyor.",
    time:"Dün 14:15", link:"/sepet" },
  // BU HAFTA
  { id:"n7", category:"order",    group:"this_week",  isRead:true,  icon:"truck",
    title:"Siparişiniz teslim edildi",
    desc:"Ürünleri değerlendirin, 50 PoodlePuan kazanın.",
    time:"21 Tem", link:"/hesabim/siparisler" },
  { id:"n8", category:"club",     group:"this_week",  isRead:true,  icon:"star",
    title:"Club'da haftanın yıldızları",
    desc:"En sevilen Toy Poodle paylaşımlarını keşfedin.",
    time:"20 Tem", link:"/club" },
  { id:"n9", category:"campaign", group:"this_week",  isRead:false, icon:"percent",
    title:"Size özel %15 indirim",
    desc:"Bakım ürünlerinde fırsat 23:59'da sona eriyor.",
    time:"19 Tem", link:"/magaza" },
];

const OLDER: Notif[] = [
  { id:"n10", category:"order",    group:"this_week", isRead:true,  icon:"truck",
    title:"Siparişiniz teslim edildi",
    desc:"YP-20260715 numaralı siparişiniz teslim edildi.",
    time:"15 Tem", link:"/hesabim/siparisler" },
  { id:"n11", category:"campaign", group:"this_week", isRead:true,  icon:"percent",
    title:"Özel indirim fırsatı",
    desc:"Favorilerinizdeki ürünlerde %15 indirim.",
    time:"14 Tem", link:"/hesabim/favoriler" },
];

const GROUP_LABELS: Record<Group, string> = {
  today:     "Bugün",
  yesterday: "Dün",
  this_week: "Bu Hafta",
};
const GROUP_ORDER: Group[] = ["today", "yesterday", "this_week"];

const TAB_MAP: Record<Tab, string> = {
  all:"Tümü", order:"Sipariş", club:"Club", guide:"Rehber", campaign:"Kampanya",
};

/* ── Settings modal toggle ─────────────── */
function Toggle({ on, toggle }: { on: boolean; toggle: () => void }) {
  return (
    <button onClick={toggle} role="switch" aria-checked={on}
      style={{
        width: 44, height: 24, borderRadius: 12, background: on ? P : "#D1D5DB",
        border: "none", cursor: "pointer", position: "relative", transition: "background .2s",
      }}>
      <span style={{
        position: "absolute", top: 2, left: on ? 22 : 2, width: 20, height: 20,
        borderRadius: "50%", background: "#fff", transition: "left .2s",
        boxShadow: "0 1px 4px rgba(0,0,0,.18)",
      }} />
    </button>
  );
}

/* ── Settings modal ─────────────────── */
function SettingsModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [s, setS] = useState({ order:true, club:true, guide:true, campaign:false });
  const tog = (k: keyof typeof s) => setS(v => ({ ...v, [k]: !v[k] }));
  const rows: { key: keyof typeof s; label: string }[] = [
    { key:"order",    label:"Sipariş bildirimleri" },
    { key:"club",     label:"Club bildirimleri" },
    { key:"guide",    label:"Rehber bildirimleri" },
    { key:"campaign", label:"Kampanya bildirimleri" },
  ];
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)",
                  display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:9999 }}>
      <div style={{ background:"#fff", borderRadius:"20px 20px 0 0",
                    padding:"24px 20px 36px", width:"100%", maxWidth:480 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
          <span style={{ fontSize:17, fontWeight:700, color:DRK }}>Bildirim Ayarları</span>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer" }}>
            <X size={20} color={GT} />
          </button>
        </div>
        {rows.map(r => (
          <div key={r.key} style={{
            display:"flex", alignItems:"center", justifyContent:"space-between",
            padding:"12px 0", borderBottom:`1px solid ${GB}`,
          }}>
            <span style={{ fontSize:14, color:DRK }}>{r.label}</span>
            <Toggle on={s[r.key]} toggle={() => tog(r.key)} />
          </div>
        ))}
        <button onClick={onSave}
          style={{
            marginTop:20, width:"100%", padding:"13px 0", borderRadius:12,
            background:P, border:"none", color:"#fff",
            fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
          }}>
          Kaydet
        </button>
      </div>
    </div>
  );
}

/* ── Notification icon ──────────────── */
function NotifIcon({ n }: { n: Notif }) {
  if (n.icon === "avatar" && n.avatar) {
    return (
      <img src={n.avatar} alt="" style={{
        width:40, height:40, borderRadius:"50%", objectFit:"cover", flexShrink:0,
      }} />
    );
  }
  const map: Record<IconT, { bg:string; color:string; El:React.ReactNode }> = {
    truck:   { bg:"#EFF6FF", color:"#3B82F6", El:<Truck size={18} color="#3B82F6" /> },
    cart:    { bg:"#EFF6FF", color:"#3B82F6", El:<ShoppingCart size={18} color="#3B82F6" /> },
    book:    { bg:"#F0FDF4", color:"#16A34A", El:<BookOpen size={18} color="#16A34A" /> },
    percent: { bg:"#FDF2F8", color:"#EC4899", El:<Percent size={18} color="#EC4899" /> },
    star:    { bg:PL,        color:P,         El:<Star size={18} color={P} fill={P} /> },
    avatar:  { bg:PL,        color:P,         El:<Bell size={18} color={P} /> },
  };
  const cfg = map[n.icon];
  return (
    <div style={{
      width:40, height:40, borderRadius:12, background:cfg.bg,
      display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
    }}>
      {cfg.El}
    </div>
  );
}

/* ── Notification row ───────────────── */
function NotifRow({ n, sel, onSel, onRead, onNav }: {
  n: Notif; sel: boolean;
  onSel: () => void; onRead: () => void; onNav: () => void;
}) {
  return (
    <div
      onClick={() => { onRead(); onNav(); }}
      style={{
        display:"flex", alignItems:"flex-start", gap:10,
        padding:"12px 14px", borderBottom:`1px solid ${GB}`,
        background: n.isRead ? "#fff" : "#FAFAFF",
        cursor:"pointer",
      }}
    >
      {/* Left col: dot + checkbox */}
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6, paddingTop:3, flexShrink:0 }}>
        <div style={{
          width:8, height:8, borderRadius:"50%",
          background: n.isRead ? "transparent" : P, flexShrink:0,
        }} />
        <input
          type="checkbox" checked={sel}
          onClick={e => e.stopPropagation()}
          onChange={e => { e.stopPropagation(); onSel(); }}
          style={{ width:15, height:15, accentColor:P, cursor:"pointer" }}
        />
      </div>

      {/* Icon */}
      <NotifIcon n={n} />

      {/* Content */}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:13, fontWeight:n.isRead ? 500 : 700, color:DRK, lineHeight:1.4 }}>
          {n.title}
        </div>
        <div style={{ fontSize:12, color:GT, marginTop:2, lineHeight:1.4,
                      overflow:"hidden", display:"-webkit-box",
                      WebkitLineClamp:2, WebkitBoxOrient:"vertical" as any }}>
          {n.desc}
        </div>
        <div style={{ fontSize:11, color:"#9CA3AF", marginTop:4 }}>{n.time}</div>
      </div>

      <ChevronRight size={16} color="#D1D5DB" style={{ flexShrink:0, marginTop:4 }} />
    </div>
  );
}

/* ════════════════════════════
   MAIN PAGE
════════════════════════════ */
export default function YPHesabimBildirimlerPage() {
  const [, navigate] = useLocation();
  const { isLoggedIn } = useCustomer();

  const [notifs, setNotifs]         = useState<Notif[]>(INIT);
  const [activeTab, setActiveTab]   = useState<Tab>("all");
  const [selected, setSelected]     = useState<Set<string>>(new Set());
  const [showOlder, setShowOlder]   = useState(false);
  const [settingsOpen, setSettings] = useState(false);
  const [toast, setToast]           = useState("");

  useEffect(() => {
    if (isLoggedIn === false)
      navigate("/yourpoodle/giris?returnTo=/hesabim/bildirimler");
  }, [isLoggedIn]);
  if (!isLoggedIn) return null;

  const showToast = (m: string) => setToast(m);

  // filtered list
  const filtered = notifs.filter(n =>
    activeTab === "all" ||
    (activeTab === "order" && n.category === "order") ||
    (activeTab === "club"  && n.category === "club")  ||
    (activeTab === "guide" && n.category === "guide") ||
    (activeTab === "campaign" && n.category === "campaign")
  );

  // grouped
  const grouped = GROUP_ORDER
    .map(g => ({ key: g, items: filtered.filter(n => n.group === g) }))
    .filter(g => g.items.length > 0);

  const unreadCount = notifs.filter(n => !n.isRead).length;
  const allSel = filtered.length > 0 && filtered.every(n => selected.has(n.id));
  const partSel = filtered.some(n => selected.has(n.id)) && !allSel;

  const tabCounts = {
    all:      notifs.length,
    order:    notifs.filter(n => n.category === "order").length,
    club:     notifs.filter(n => n.category === "club").length,
    guide:    notifs.filter(n => n.category === "guide").length,
    campaign: notifs.filter(n => n.category === "campaign").length,
  };

  const toggleAll = () => {
    if (allSel) setSelected(new Set());
    else setSelected(new Set(filtered.map(n => n.id)));
  };

  const markRead = () => {
    const toMark = selected.size > 0 ? [...selected] : filtered.map(n => n.id);
    setNotifs(ns => ns.map(n => toMark.includes(n.id) ? { ...n, isRead:true } : n));
    setSelected(new Set());
    showToast("Okundu olarak işaretlendi ✓");
  };

  const clearAll = () => {
    if (!confirm("Tüm bildirimleri temizlemek istediğinize emin misiniz?")) return;
    if (selected.size > 0) {
      setNotifs(ns => ns.filter(n => !selected.has(n.id)));
      setSelected(new Set());
    } else {
      setNotifs(ns => ns.filter(n =>
        activeTab === "all" ? false :
        n.category !== ({ order:"order", club:"club", guide:"guide", campaign:"campaign" } as any)[activeTab]
      ));
    }
    showToast("Bildirimler temizlendi");
  };

  const markOneRead = (id: string) =>
    setNotifs(ns => ns.map(n => n.id === id ? { ...n, isRead:true } : n));

  const loadOlder = () => {
    setNotifs(ns => [...ns, ...OLDER.filter(o => !ns.find(n => n.id === o.id))]);
    setShowOlder(true);
  };

  /* ── render ── */
  return (
    <YPLayout activeLink="club" constrain={false}>
      {toast && (
        <div style={{
          position:"fixed", top:72, left:"50%", transform:"translateX(-50%)",
          background:"#111", color:"#fff", padding:"10px 22px", borderRadius:12,
          fontSize:13, fontWeight:600, zIndex:9999, whiteSpace:"nowrap",
          boxShadow:"0 4px 20px rgba(0,0,0,.3)",
        }}
          onClick={() => setToast("")}
        >
          {toast}
        </div>
      )}
      {settingsOpen && (
        <SettingsModal
          onClose={() => setSettings(false)}
          onSave={() => { setSettings(false); showToast("Ayarlar kaydedildi ✓"); }}
        />
      )}

      <div style={{
        maxWidth:480, margin:"0 auto",
        fontFamily:"'Inter',-apple-system,sans-serif",
        background:"#fff", minHeight:"100vh", color:DRK,
      }}>

        {/* ── HEADER ── */}
        <div style={{ padding:"14px 14px 0", background:"#fff" }}>
          {/* Breadcrumb */}
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10 }}>
            <button onClick={() => navigate("/hesabim")}
              style={{ background:"none", border:"none", cursor:"pointer", padding:0, display:"flex" }}>
              <ArrowLeft size={17} color={P} />
            </button>
            <span style={{ fontSize:12, color:P, fontWeight:500 }}>Hesabım</span>
            <span style={{ fontSize:12, color:P }}>/</span>
            <span style={{ fontSize:12, color:P, fontWeight:700 }}>Bildirimler</span>
          </div>

          {/* Title row */}
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:10 }}>
            <div>
              <h1 style={{ fontSize:22, fontWeight:800, color:DRK, margin:0 }}>Bildirimler</h1>
              <p style={{ fontSize:13, color:GT, margin:"3px 0 0" }}>
                Siparişleriniz, Club ve size özel gelişmeler burada.
              </p>
              {unreadCount > 0 && (
                <span style={{
                  display:"inline-block", marginTop:6,
                  fontSize:11, fontWeight:700, color:P,
                  background:PL, padding:"3px 10px", borderRadius:999,
                }}>
                  {unreadCount} okunmamış
                </span>
              )}
            </div>
            <button onClick={() => setSettings(true)}
              style={{
                display:"flex", alignItems:"center", gap:5, flexShrink:0,
                padding:"8px 12px", borderRadius:12,
                border:`1.5px solid ${GB}`, background:"#fff",
                fontSize:12, fontWeight:600, color:DRK,
                cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap",
              }}>
              <SlidersHorizontal size={13} /> Ayarlar
            </button>
          </div>
        </div>

        {/* ── TABS ── */}
        <div style={{
          display:"flex", gap:6, overflowX:"auto", padding:"12px 14px 8px",
          scrollbarWidth:"none",
        }}>
          {(Object.keys(TAB_MAP) as Tab[]).map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab); setSelected(new Set()); }}
              style={{
                padding:"7px 14px", borderRadius:999, flexShrink:0,
                border:"none", cursor:"pointer", fontFamily:"inherit",
                background: activeTab === tab ? P : "#F3F4F6",
                color:      activeTab === tab ? "#fff" : GT,
                fontSize:13, fontWeight: activeTab === tab ? 700 : 500,
              }}>
              {TAB_MAP[tab]} {tabCounts[tab]}
            </button>
          ))}
        </div>

        {/* ── BULK BAR ── */}
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"8px 14px", borderBottom:`1px solid ${GB}`,
        }}>
          <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
            <input type="checkbox" checked={allSel}
              ref={el => { if (el) el.indeterminate = partSel; }}
              onChange={toggleAll}
              style={{ width:16, height:16, accentColor:P, cursor:"pointer" }}
            />
            <span style={{ fontSize:13, color:DRK }}>Tümünü seç</span>
          </label>
          <div style={{ display:"flex", gap:14 }}>
            <button onClick={markRead}
              style={{ background:"none", border:"none", cursor:"pointer",
                       fontSize:12, fontWeight:700, color:P, fontFamily:"inherit" }}>
              Okundu İşaretle
            </button>
            <button onClick={clearAll}
              style={{ background:"none", border:"none", cursor:"pointer",
                       fontSize:12, fontWeight:700, color:P, fontFamily:"inherit" }}>
              Tümünü Temizle
            </button>
          </div>
        </div>

        {/* ── NOTIFICATION GROUPS ── */}
        {grouped.length === 0 ? (
          <div style={{ padding:"40px 20px", textAlign:"center" }}>
            <div style={{ fontSize:36, marginBottom:10 }}>🔔</div>
            <div style={{ fontSize:15, fontWeight:600, color:DRK }}>Bu kategoride bildirim yok.</div>
          </div>
        ) : grouped.map(g => (
          <div key={g.key}>
            {/* Group header */}
            <div style={{ padding:"10px 14px 4px" }}>
              <span style={{
                fontSize:11, fontWeight:700, color:GT,
                textTransform:"uppercase", letterSpacing:"0.06em",
              }}>
                {GROUP_LABELS[g.key]}
              </span>
            </div>
            {g.items.map(n => (
              <NotifRow
                key={n.id}
                n={n}
                sel={selected.has(n.id)}
                onSel={() => {
                  setSelected(s => {
                    const ns = new Set(s);
                    ns.has(n.id) ? ns.delete(n.id) : ns.add(n.id);
                    return ns;
                  });
                }}
                onRead={() => markOneRead(n.id)}
                onNav={() => { if (n.link) navigate(n.link); }}
              />
            ))}
          </div>
        ))}

        {/* ── LOAD MORE ── */}
        {!showOlder && (
          <div style={{ display:"flex", justifyContent:"center", padding:"16px 14px" }}>
            <button onClick={loadOlder}
              style={{
                padding:"11px 28px", borderRadius:12,
                border:`1.5px solid ${P}`, background:"#fff", color:P,
                fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = PL; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}>
              Daha Eski Bildirimleri Göster
            </button>
          </div>
        )}

        {/* ── CTA BANNER ── */}
        <div style={{
          margin:"6px 12px 16px",
          background:PL, borderRadius:16,
          display:"flex", alignItems:"center", gap:12, padding:"14px 14px",
        }}>
          <div style={{
            width:40, height:40, borderRadius:12, background:P, flexShrink:0,
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <Bell size={20} color="#fff" />
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:700, color:DRK }}>Bildirimlerinizi siz yönetin</div>
            <div style={{ fontSize:12, color:GT, marginTop:2, lineHeight:1.4 }}>
              Sipariş, Club ve kampanya bildirimlerini düzenleyin.
            </div>
          </div>
          <button onClick={() => setSettings(true)}
            style={{
              flexShrink:0, padding:"9px 12px", borderRadius:12,
              background:P, border:"none", color:"#fff",
              fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
              whiteSpace:"nowrap",
            }}>
            Bildirim Ayarları
          </button>
        </div>

        {/* ── FOOTER ── */}
        <div style={{ background:NAV, padding:"20px 16px 28px" }}>
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
    </YPLayout>
  );
}
