import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft, Bell, MessageCircle,
  Package, Heart, Star, BadgeCheck, MapPin, PawPrint,
  Package as PackageIcon, Heart as HeartIcon, MapPin as MapPinIcon,
  Ticket, Camera, Bookmark, Bell as BellIcon, Settings,
  ChevronRight, User, Smartphone, Mail, Lock, HelpCircle,
  Syringe, Shield, Scissors,
} from "lucide-react";

import { useCustomer } from "@/contexts/CustomerContext";
import {
  userProfile, petProfile, quickActions, activeOrder, orderSteps,
  reminders, clubActivity, loyaltyPoints, settingsMenu,
} from "@/data/accountMockData";

/* ── Palette ── */
const P  = "#4B2BD6";
const PD = "#3E27B3";
const PL = "#F3EEFF";
const GB = "#E5E7EB";
const FBG = "#1D1E9B";

/* ── Icon map ── */
const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Package: PackageIcon, Heart: HeartIcon, MapPin: MapPinIcon,
  Ticket, Camera, Bookmark, Bell: BellIcon, Settings,
  User, Smartphone, Mail, Lock, HelpCircle,
};

/* ════════════════════════════════════════════════
   AUTHENTICATED HEADER
════════════════════════════════════════════════ */
function AccountHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const [, navigate] = useLocation();
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "linear-gradient(135deg,#F5F0FF 0%,#EDE9FE 100%)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      height: 58, padding: "0 12px",
      borderBottom: "1px solid #E9E3FD",
    }}>
      {/* Left: hamburger + logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <button onClick={onMenuClick} aria-label="Menü"
          style={{ background: "#EDE9FE", border: "none", cursor: "pointer",
                   padding: "5px 8px", fontSize: 18, color: "#7C3AED",
                   borderRadius: 10, lineHeight: 1 }}>
          ☰
        </button>
        <span style={{ fontFamily: "'Pacifico', cursive", fontSize: 17,
                       color: "#6B21A8", cursor: "pointer" }}
          onClick={() => navigate("/yourpoodle")}>
          YourPoodle 🐾
        </span>
      </div>

      {/* Right: bell + DM + avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {/* Bell */}
        <button onClick={() => navigate("/hesabim/bildirimler")} aria-label="Bildirimler"
          style={{ position: "relative", width: 36, height: 36, borderRadius: "50%",
                   border: "1.5px solid #E5E7EB", background: "#fff",
                   display: "flex", alignItems: "center", justifyContent: "center",
                   cursor: "pointer" }}>
          <Bell size={17} color="#374151" />
          <span style={{ position: "absolute", top: -3, right: -3,
                         background: "#EF4444", color: "#fff", fontSize: 9, fontWeight: 800,
                         width: 16, height: 16, borderRadius: "50%",
                         display: "flex", alignItems: "center", justifyContent: "center",
                         border: "2px solid #EDE9FE" }}>
            3
          </span>
        </button>

        {/* DM */}
        <button onClick={() => alert("Mesajlar yakında!")} aria-label="Mesajlar"
          style={{ position: "relative", width: 36, height: 36, borderRadius: "50%",
                   border: "1.5px solid #E5E7EB", background: "#fff",
                   display: "flex", alignItems: "center", justifyContent: "center",
                   cursor: "pointer" }}>
          <MessageCircle size={17} color="#374151" />
          <span style={{ position: "absolute", top: -3, right: -3,
                         background: P, color: "#fff", fontSize: 9, fontWeight: 800,
                         width: 16, height: 16, borderRadius: "50%",
                         display: "flex", alignItems: "center", justifyContent: "center",
                         border: "2px solid #EDE9FE" }}>
            2
          </span>
        </button>

        {/* Avatar */}
        <button onClick={() => navigate("/hesabim")} aria-label="Hesabım"
          style={{ width: 34, height: 34, borderRadius: "50%",
                   border: `2px solid ${P}`, padding: 0, cursor: "pointer",
                   overflow: "hidden", background: "none" }}>
          <img src={userProfile.avatar} alt="Profil"
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </button>
      </div>
    </header>
  );
}

/* ════════════════════════════════════════════════
   CATEGORY STRIP (Tab nav)
════════════════════════════════════════════════ */
function CategoryStrip() {
  const [, navigate] = useLocation();
  const tabs = [
    { label: "Mağaza",     href: "/yourpoodle/magaza",    emoji: "🛍️" },
    { label: "Club",       href: "/yourpoodle/club",       emoji: "🐾" },
    { label: "AI Asistan", href: "/yourpoodle/ai-asistan", emoji: "🤖" },
    { label: "Rehber",     href: "/yourpoodle/rehber",     emoji: "📖" },
  ];
  return (
    <div style={{ display: "flex", gap: 6, padding: "7px 10px",
                  background: "#fff", borderBottom: "1px solid #F3F4F6",
                  position: "sticky", top: 58, zIndex: 99 }}>
      {tabs.map(({ label, href, emoji }) => (
        <button key={href} onClick={() => navigate(href)}
          style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center",
                   justifyContent: "center", gap: 4, padding: "5px 4px",
                   borderRadius: 18, border: "1.5px solid #E5E7EB",
                   background: "#fff", color: "#555", fontSize: 11.5, fontWeight: 700,
                   cursor: "pointer", fontFamily: "inherit",
                   whiteSpace: "nowrap", overflow: "hidden" }}>
          <span style={{ fontSize: 13, flexShrink: 0 }}>{emoji}</span>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
        </button>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════
   PAGE HEADER (← Hesabım + greeting)
════════════════════════════════════════════════ */
function AccountPageHeader({ firstName }: { firstName: string }) {
  const [, navigate] = useLocation();
  return (
    <div style={{ padding: "12px 16px 8px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
        <button onClick={() => navigate(-1 as any)} aria-label="Geri"
          style={{ background: "none", border: "none", cursor: "pointer",
                   display: "flex", alignItems: "center", padding: 0, color: "#374151" }}>
          <ArrowLeft size={18} />
        </button>
        <span style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>Hesabım</span>
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color: "#111827", lineHeight: 1.3 }}>
        Merhaba, {firstName} 👋
      </div>
      <div style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>
        Poodle dünyanızla ilgili her şey burada
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   USER PROFILE CARD (purple gradient)
════════════════════════════════════════════════ */
function UserProfileCard() {
  const [, navigate] = useLocation();
  return (
    <div style={{ margin: "0 16px 16px", borderRadius: 18, overflow: "hidden",
                  background: "linear-gradient(135deg,#4B2BD6 0%,#6366F1 100%)", padding: 16 }}>
      {/* Profili Düzenle top-right */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
        <button onClick={() => navigate("/hesabim/kisisel")}
          style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "rgba(255,255,255,0.9)",
                   fontSize: 11, fontWeight: 500, padding: "4px 12px", borderRadius: 999,
                   cursor: "pointer", fontFamily: "inherit" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.3)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.2)"; }}>
          Profili Düzenle
        </button>
      </div>

      {/* Avatar + info */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <img src={userProfile.avatar} alt={userProfile.fullName}
          style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover",
                   border: "2px solid rgba(255,255,255,0.5)", flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>{userProfile.fullName}</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", marginTop: 2 }}>{userProfile.phone}</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 4,
                        background: "rgba(255,255,255,0.2)", color: "#fff",
                        fontSize: 11, fontWeight: 500, padding: "2px 8px",
                        borderRadius: 999, marginTop: 6 }}>
            <PawPrint size={11} />
            Club Üyesi
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16,
                    paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.2)" }}>
        {[
          { Icon: Package, value: userProfile.stats.orders,    label: "Sipariş",  route: "/hesabim/siparisler" },
          { Icon: Heart,   value: userProfile.stats.favorites, label: "Favori",   route: "/hesabim/favoriler"  },
          { Icon: Star,    value: userProfile.stats.points,    label: "Puan",     route: "/hesabim/puanlar"    },
        ].map(({ Icon, value, label, route }) => (
          <button key={label} onClick={() => navigate(route)}
            style={{ flex: 1, textAlign: "center", background: "none", border: "none",
                     cursor: "pointer", padding: "4px 0" }}>
            <Icon size={18} color="rgba(255,255,255,0.85)" style={{ display: "block", margin: "0 auto 3px" }} />
            <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{value}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)" }}>{label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   PET PROFILE CARD — Poodle'ım
════════════════════════════════════════════════ */
function PetProfileCard() {
  const [, navigate] = useLocation();
  return (
    <div style={{ margin: "0 16px 16px", background: "#fff", borderRadius: 18,
                  border: "1px solid #F3F4F6", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", padding: 16 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Poodle'ım</span>
        <button onClick={() => navigate(`/club/profil/${petProfile.clubUsername}`)}
          style={{ background: "none", border: "none", cursor: "pointer",
                   fontSize: 12, fontWeight: 600, color: P, fontFamily: "inherit" }}>
          Profili Gör
        </button>
      </div>

      {/* Content */}
      <div style={{ display: "flex", gap: 12 }}>
        {/* Avatar with verified badge */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <img src={petProfile.avatar} alt={petProfile.name}
            style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover" }} />
          {petProfile.verified && (
            <div style={{ position: "absolute", bottom: 0, right: 0,
                          width: 20, height: 20, borderRadius: "50%",
                          background: "#3B82F6", display: "flex",
                          alignItems: "center", justifyContent: "center",
                          border: "2px solid #fff" }}>
              <BadgeCheck size={12} color="#fff" />
            </div>
          )}
        </div>

        {/* Middle: name + details + progress */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{petProfile.name}</div>
          <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>
            {petProfile.breed} • {petProfile.age} • {petProfile.weight}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
            <MapPin size={11} color="#9CA3AF" />
            <span style={{ fontSize: 11, color: "#6B7280" }}>{petProfile.city}</span>
          </div>
          {/* Progress */}
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 4 }}>
              Profil %{petProfile.profileComplete} tamamlandı
            </div>
            <div style={{ background: "#F3F4F6", height: 6, borderRadius: 999, overflow: "hidden" }}>
              <div style={{ width: `${petProfile.profileComplete}%`, height: "100%",
                            background: P, borderRadius: 999 }} />
            </div>
          </div>
        </div>

        {/* Right: buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
          <button onClick={() => navigate("/yourpoodle/poodle-profili-duzenle")}
            style={{ background: P, color: "#fff", border: "none", borderRadius: 10,
                     padding: "7px 10px", fontSize: 10, fontWeight: 600,
                     cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}
            onMouseEnter={e => { e.currentTarget.style.background = PD; }}
            onMouseLeave={e => { e.currentTarget.style.background = P; }}>
            Bilgileri Güncelle
          </button>
          <button onClick={() => alert("Club profili yakında!")}
            style={{ background: "#fff", color: P, border: `1px solid ${P}`, borderRadius: 10,
                     padding: "7px 10px", fontSize: 10, fontWeight: 600,
                     cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}
            onMouseEnter={e => { e.currentTarget.style.background = PL; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}>
            Club Profiline Git
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   QUICK ACTIONS GRID
════════════════════════════════════════════════ */
function QuickActionsGrid() {
  const [, navigate] = useLocation();
  return (
    <div style={{ padding: "0 16px 16px" }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 12 }}>
        Hızlı İşlemler
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {quickActions.map(action => {
          const Icon = ICON_MAP[action.icon] || Package;
          return (
            <button key={action.id}
              onClick={() => navigate(action.route)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 12px",
                       borderRadius: 14, border: "1px solid #F3F4F6", background: "#fff",
                       cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                       transition: "box-shadow 0.15s, transform 0.1s" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}
              onMouseDown={e => { e.currentTarget.style.transform = "scale(0.98)"; }}
              onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}>
              {/* Icon box */}
              <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            background: action.bg }}>
                <Icon size={18} color={action.iconColor} />
              </div>
              {/* Label */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#111827", lineHeight: 1.3 }}>
                  {action.label}
                </div>
                {action.sublabel && (
                  <div style={{ fontSize: 10, color: "#6B7280", marginTop: 1 }}>
                    {action.sublabel}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   ORDER PROGRESS STEPPER
════════════════════════════════════════════════ */
function OrderProgressStepper({ currentKey }: { currentKey: string }) {
  const steps = orderSteps;
  const currentIdx = steps.findIndex(s => s.key === currentKey);
  return (
    <div style={{ position: "relative", marginTop: 16 }}>
      {/* Connecting line */}
      <div style={{ position: "absolute", top: 6, left: "12.5%", right: "12.5%",
                    height: 2, background: "#E5E7EB", zIndex: 0 }} />
      <div style={{ position: "absolute", top: 6, left: "12.5%",
                    width: `${(currentIdx / (steps.length - 1)) * 75}%`,
                    height: 2, background: P, zIndex: 1, transition: "width 0.4s" }} />
      {/* Steps */}
      <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
        {steps.map((step, idx) => {
          const done    = idx < currentIdx;
          const current = idx === currentIdx;
          return (
            <div key={step.key} style={{ display: "flex", flexDirection: "column",
                                          alignItems: "center", gap: 5, flex: 1 }}>
              <div style={{
                width: 14, height: 14, borderRadius: "50%",
                background: (done || current) ? P : "#E5E7EB",
                border: current ? `3px solid ${P}` : "none",
                boxShadow: current ? `0 0 0 3px rgba(75,43,214,0.2)` : "none",
                boxSizing: "border-box",
              }} />
              <span style={{ fontSize: 9, color: "#6B7280", textAlign: "center",
                             fontWeight: current ? 700 : 400, lineHeight: 1.2 }}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   ACTIVE ORDER CARD
════════════════════════════════════════════════ */
function ActiveOrderCard() {
  const [, navigate] = useLocation();
  return (
    <div style={{ margin: "0 16px 16px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Aktif Siparişim</span>
        <button onClick={() => navigate("/hesabim/siparisler")}
          style={{ background: "none", border: "none", cursor: "pointer",
                   fontSize: 12, fontWeight: 600, color: P, fontFamily: "inherit" }}>
          Tüm Siparişler
        </button>
      </div>

      {/* Card */}
      <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #F3F4F6",
                    padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        {/* Top row */}
        <div style={{ display: "flex", gap: 12 }}>
          {/* Product image */}
          <div style={{ width: 64, height: 64, borderRadius: 10, background: "#F9FAFB",
                        padding: 4, flexShrink: 0, display: "flex", alignItems: "center",
                        justifyContent: "center", overflow: "hidden" }}>
            <img src={activeOrder.image} alt={activeOrder.productName}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              onError={e => {
                const el = e.currentTarget as HTMLImageElement;
                el.style.display = "none";
                el.parentElement!.textContent = "📦";
                el.parentElement!.style.fontSize = "28px";
              }} />
          </div>

          {/* Order info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 10, color: "#9CA3AF" }}>#{activeOrder.id}</div>
            <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 3 }}>{activeOrder.date}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#111827", lineHeight: 1.35,
                          display: "-webkit-box", WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical" as any, overflow: "hidden" }}>
              {activeOrder.productName}
            </div>
            <div style={{ fontSize: 10, color: "#6B7280", marginTop: 2 }}>{activeOrder.weight}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: P, marginTop: 3 }}>{activeOrder.price}</div>
          </div>

          {/* Status badge */}
          <div style={{ flexShrink: 0 }}>
            <span style={{ display: "inline-block", background: "#FFF7ED", color: "#F97316",
                           fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 999 }}>
              {activeOrder.status}
            </span>
          </div>
        </div>

        {/* Stepper */}
        <OrderProgressStepper currentKey={activeOrder.statusKey} />

        {/* Track button */}
        <button onClick={() => alert("Sipariş takibi yakında!")}
          style={{ width: "100%", marginTop: 16, border: `2px solid ${P}`, color: P,
                   background: "#fff", borderRadius: 14, padding: "10px 0",
                   fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
          onMouseEnter={e => { e.currentTarget.style.background = PL; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}>
          Siparişi Takip Et
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   REMINDERS
════════════════════════════════════════════════ */
const REMINDER_ICONS: Record<string, React.ComponentType<any>> = {
  Syringe, Shield, Brush: Scissors,
};

function RemindersSection() {
  return (
    <div style={{ padding: "0 16px 16px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Yaklaşan Hatırlatmalar</span>
        <button onClick={() => alert("Takvim yakında!")}
          style={{ background: "none", border: "none", cursor: "pointer",
                   fontSize: 12, fontWeight: 600, color: P, fontFamily: "inherit" }}>
          Takvimi Gör
        </button>
      </div>

      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #F3F4F6",
                    padding: "4px 12px" }}>
        {reminders.map((r, idx) => {
          const Icon = REMINDER_ICONS[r.icon] || Scissors;
          return (
            <div key={r.id} style={{
              display: "flex", alignItems: "center", gap: 10,
              paddingTop: 10, paddingBottom: 10,
              borderBottom: idx < reminders.length - 1 ? "1px solid #F9FAFB" : "none",
            }}>
              {/* Icon circle */}
              <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            background: r.color + "22" }}>
                <Icon size={16} color={r.color} />
              </div>

              {/* Middle */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{r.title}</div>
                <div style={{ fontSize: 10, color: "#6B7280", marginTop: 1 }}>{r.date}</div>
              </div>

              {/* Right */}
              <div style={{ fontSize: 10, fontWeight: 600, color: P, whiteSpace: "nowrap" }}>
                {r.daysLeft} gün kaldı
              </div>

              <ChevronRight size={14} color="#D1D5DB" />
            </div>
          );
        })}
      </div>

      {/* Add reminder */}
      <button onClick={() => alert("Hatırlatma ekleme yakında!")}
        style={{ width: "100%", marginTop: 8, fontSize: 13, fontWeight: 600, color: P,
                 border: `1.5px dashed ${P}`, borderRadius: 10, padding: "9px 0",
                 background: "none", cursor: "pointer", fontFamily: "inherit" }}
        onMouseEnter={e => { e.currentTarget.style.background = PL; }}
        onMouseLeave={e => { e.currentTarget.style.background = "none"; }}>
        + Yeni Hatırlatma Ekle
      </button>
    </div>
  );
}

/* ════════════════════════════════════════════════
   CLUB ACTIVITY + LOYALTY POINTS
════════════════════════════════════════════════ */
function ClubActivitySection() {
  const [, navigate] = useLocation();
  const pct = Math.round((loyaltyPoints.current / loyaltyPoints.target) * 100);

  return (
    <div style={{ padding: "0 16px 16px" }}>
      <span style={{ fontSize: 14, fontWeight: 700, color: "#111827", display: "block", marginBottom: 8 }}>
        Club Aktivitem
      </span>

      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #F3F4F6", padding: 12 }}>
        {/* Stats */}
        <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 12 }}>
          {[
            { value: clubActivity.posts,     label: "Paylaşım" },
            { value: clubActivity.followers.toLocaleString("tr-TR"), label: "Takipçi" },
            { value: clubActivity.following,  label: "Takip" },
          ].map(({ value, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>{value}</div>
              <div style={{ fontSize: 11, color: "#6B7280", marginTop: 1 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Thumbnails */}
        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          {clubActivity.thumbnails.map((url, i) => (
            <img key={i} src={url} alt="Paylaşım"
              style={{ width: 56, height: 56, borderRadius: 10, objectFit: "cover",
                       flex: "0 0 56px" }} />
          ))}
        </div>

        {/* Open profile */}
        <button onClick={() => navigate(`/club/profil/${petProfile.clubUsername}`)}
          style={{ width: "100%", border: `1.5px solid ${P}`, color: P, background: "#fff",
                   borderRadius: 10, padding: "9px 0", fontSize: 13, fontWeight: 600,
                   cursor: "pointer", fontFamily: "inherit", marginBottom: 12 }}
          onMouseEnter={e => { e.currentTarget.style.background = PL; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}>
          Club Profilimi Aç
        </button>

        {/* Loyalty points card */}
        <div style={{ background: `linear-gradient(135deg,${P} 0%,#6366F1 100%)`,
                      borderRadius: 14, padding: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <Star size={16} color="#fff" />
            <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
              YourPoodle Puanlarım
            </span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>
            {loyaltyPoints.current} Puan
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 4, lineHeight: 1.4 }}>
            500 puana ulaşınca {loyaltyPoints.reward} kazanın.
          </div>

          {/* Progress bar */}
          <div style={{ background: "rgba(255,255,255,0.2)", height: 8, borderRadius: 999, marginTop: 10, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%",
                          background: "#fff", borderRadius: 999 }} />
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>
            {loyaltyPoints.current} / {loyaltyPoints.target}
          </div>

          <button onClick={() => navigate("/hesabim/poodle-puanlari")}
            style={{ background: "none", border: "none", cursor: "pointer",
                     fontSize: 12, color: "rgba(255,255,255,0.9)", marginTop: 8,
                     textDecoration: "underline", padding: 0, fontFamily: "inherit" }}>
            Puanlar Nasıl Kazanılır?
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   SETTINGS LIST + LOGOUT
════════════════════════════════════════════════ */
function AccountSettingsList({ onLogout }: { onLogout: () => void }) {
  const [, navigate] = useLocation();
  return (
    <div style={{ margin: "0 16px 16px" }}>
      <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #F3F4F6",
                    overflow: "hidden" }}>
        {settingsMenu.map((item, idx) => {
          const Icon = ICON_MAP[item.icon] || User;
          return (
            <button key={item.id}
              onClick={() => navigate(item.route)}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                       width: "100%", padding: "14px 16px", background: "#fff",
                       border: "none", borderBottom: idx < settingsMenu.length - 1 ? "1px solid #F9FAFB" : "none",
                       cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#F9FAFB"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Icon size={18} color="#6B7280" />
                <span style={{ fontSize: 14, fontWeight: 500, color: "#1F2937" }}>{item.label}</span>
              </div>
              <ChevronRight size={16} color="#9CA3AF" />
            </button>
          );
        })}
      </div>

      {/* Logout */}
      <button onClick={onLogout}
        style={{ width: "100%", marginTop: 12, padding: "13px 0",
                 background: "#fff", border: "none", borderRadius: 14,
                 fontSize: 14, fontWeight: 600, color: "#EF4444",
                 cursor: "pointer", fontFamily: "inherit" }}
        onMouseEnter={e => { e.currentTarget.style.background = "#FEF2F2"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}>
        Çıkış Yap
      </button>
    </div>
  );
}

/* ════════════════════════════════════════════════
   COMPACT FOOTER
════════════════════════════════════════════════ */
function AccountFooter() {
  return (
    <footer style={{ background: FBG, color: "#fff", padding: "24px 16px 24px", marginTop: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 18 }}>🐾</span>
        <span style={{ fontSize: 17, fontWeight: 700 }}>YourPoodle</span>
      </div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.5, marginBottom: 16 }}>
        Toy Poodle sahipleri için alışveriş, bilgi ve topluluk platformu.
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
        {["Hakkımızda", "Yardım", "İletişim", "KVKK"].map(link => (
          <button key={link} onClick={() => alert(`${link} yakında!`)}
            style={{ background: "none", border: "none", cursor: "pointer",
                     fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: "inherit", padding: 0 }}
            onMouseEnter={e => { e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}>
            {link}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
        <Shield size={13} color="rgba(255,255,255,0.5)" />
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
          256-bit SSL ile güvenli alışveriş
        </span>
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16,
                    fontSize: 12, color: "rgba(255,255,255,0.5)", textAlign: "center" }}>
        © 2026 YourPoodle. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════════
   BOTTOM NAV (matches YPLayout)
════════════════════════════════════════════════ */
function BottomNav() {
  const [, navigate] = useLocation();
  const tabs = [
    { label: "Ana Sayfa", href: "/yourpoodle",          emoji: "🐾" },
    { label: "Club",      href: "/yourpoodle/club",      emoji: "👥" },
    { label: "Sepetim",   href: "/yourpoodle/sepet",     emoji: "🛒", center: true },
    { label: "AI",        href: "/yourpoodle/ai-asistan",emoji: "🤖" },
    { label: "Hesabım",   href: "/hesabim",              emoji: "👤" },
  ];
  return (
    <nav style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
                  width: "100%", maxWidth: 480, background: "#fff",
                  borderTop: "1px solid #f0f0f0", boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
                  height: 72, display: "flex", alignItems: "center", zIndex: 200,
                  padding: "0 4px", paddingBottom: "env(safe-area-inset-bottom,0px)" }}>
      {tabs.map(tab => (
        <button key={tab.href} onClick={() => navigate(tab.href)}
          style={{ flex: 1, display: "flex", flexDirection: "column",
                   alignItems: "center", justifyContent: tab.center ? "flex-end" : "flex-end",
                   gap: 3, paddingBottom: 8, border: "none", background: "none",
                   cursor: "pointer", fontFamily: "inherit",
                   color: tab.href === "/hesabim" ? "#7C3AED" : "#9CA3AF" }}>
          {tab.center ? (
            <div style={{ position: "absolute", bottom: 24, width: 52, height: 52,
                          borderRadius: "50%", background: "#7C3AED",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          boxShadow: "0 0 0 5px rgba(124,58,237,0.12),0 4px 14px rgba(124,58,237,0.35)",
                          fontSize: 22 }}>
              {tab.emoji}
            </div>
          ) : (
            <span style={{ fontSize: 22 }}>{tab.emoji}</span>
          )}
          <span style={{ fontSize: 10, fontWeight: tab.href === "/hesabim" ? 700 : 500,
                         letterSpacing: 0.2, lineHeight: 1.2 }}>
            {tab.label}
          </span>
        </button>
      ))}
    </nav>
  );
}

/* ════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════ */
export default function YPHesabimPage() {
  const [, navigate] = useLocation();
  const { isLoggedIn, isLoading, customer, logout } = useCustomer();
  const drawerOpen = useRef(false);

  /* Auth guard */
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate("/yourpoodle/giris?returnTo=/hesabim");
    }
  }, [isLoading, isLoggedIn]);

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
                    height: "100vh", background: "#F9FAFB" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🐾</div>
          <div style={{ fontSize: 14, color: "#6B7280" }}>Yükleniyor...</div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) return null;

  /* Use real customer name if available, otherwise mock */
  const firstName = customer?.name?.split(" ")[0] || userProfile.firstName;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", background: "#F9FAFB",
                  minHeight: "100vh", boxShadow: "0 0 40px rgba(0,0,0,0.15)",
                  fontFamily: "'Inter',-apple-system,sans-serif", paddingBottom: 80 }}>

      <style>{`
        * { box-sizing: border-box; }
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Pacifico&display=swap');
        button { font-family: inherit; }
      `}</style>

      {/* 1. Authenticated header */}
      <AccountHeader onMenuClick={() => {}} />

      {/* 2. Category strip (tab nav) */}
      <CategoryStrip />

      {/* 3. Page header + greeting */}
      <AccountPageHeader firstName={firstName} />

      {/* 4. Purple user profile card */}
      <UserProfileCard />

      {/* 5. Poodle'ım card */}
      <PetProfileCard />

      {/* 6. Quick actions 2×4 grid */}
      <QuickActionsGrid />

      {/* 7. Active order + stepper */}
      <ActiveOrderCard />

      {/* 8. Reminders */}
      <RemindersSection />

      {/* 9. Club activity + loyalty points */}
      <ClubActivitySection />

      {/* 10+11. Settings list + logout */}
      <AccountSettingsList onLogout={handleLogout} />

      {/* 12. Compact footer */}
      <AccountFooter />

      {/* Fixed bottom nav */}
      <BottomNav />
    </div>
  );
}
