import React, { useState } from "react";
import { ChevronRight, Search, SlidersHorizontal, Heart, Brush, GraduationCap, Calculator } from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";

/* ── Design tokens ── */
const P  = "#6200EE";
const GB = "#E5E7EB";

/* ── Section definitions ── */
interface GuideSection {
  id: string; name: string; icon: React.ElementType;
  iconColor: string; badgeColor: string;
  headerBg: string; headerBorder: string; numberBg: string;
  items: string[];
}

const SECTIONS: GuideSection[] = [
  {
    id:"saglik", name:"Sağlık", icon:Heart, iconColor:"#14B8A6", badgeColor:"#14B8A6",
    headerBg:"#F0FDFA", headerBorder:"#99F6E4", numberBg:"#14B8A6",
    items:["Aşı Takvimi","İç ve Dış Parazit","Toy Poodle Hastalıkları","Alerji Belirtileri","Sindirim ve İshal","Göz Sağlığı","Kulak Sağlığı","Ağız ve Diş Sağlığı","Eklem ve Diz Kapağı","Acil Durumlarda İlk Yardım"],
  },
  {
    id:"bakim", name:"Bakım", icon:Brush, iconColor:"#EC4899", badgeColor:"#EC4899",
    headerBg:"#FDF2F8", headerBorder:"#FBCFE8", numberBg:"#EC4899",
    items:["Tüy Bakımı ve Tarama","Banyo Sıklığı","Doğru Şampuan Seçimi","Tıraş Modelleri","Göz Yaşı Lekesi Bakımı","Kulak Temizliği","Tırnak Kesimi","Diş Temizliği","Pati ve Burun Bakımı","Yaz ve Kış Bakımı"],
  },
  {
    id:"egitim", name:"Eğitim", icon:GraduationCap, iconColor:"#F97316", badgeColor:"#F97316",
    headerBg:"#FFF7ED", headerBorder:"#FED7AA", numberBg:"#F97316",
    items:["Tuvalet Eğitimi","İsmini Öğretme","Temel Komutlar","Isırmayı Bırakma","Havlama Kontrolü","Tasma ile Yürüme","Sosyalleşme Eğitimi","Yalnız Kalma Eğitimi","Ödülle Eğitim","Seyahat ve Araba Eğitimi"],
  },
  {
    id:"araclar", name:"Araçlar", icon:Calculator, iconColor:"#6200EE", badgeColor:"#6200EE",
    headerBg:"#F3EEFF", headerBorder:"#DDD6FE", numberBg:"#6200EE",
    items:["Günlük Mama Hesaplayıcı","Su İhtiyacı Hesaplayıcı","İdeal Kilo Takibi","Köpek Yaşı Hesaplayıcı","Aşı Takvimi Oluştur","Parazit Hatırlatıcısı","Bakım Takvimi","Mama Karşılaştırma","Belirli Rehberi","Seyahat Kontrol Listesi"],
  },
];

function QuickPill({ section, onClick }: { section: GuideSection; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:8,
               padding:"12px 8px", borderRadius:12,
               border:`1px solid ${section.headerBorder}`,
               background: hov ? section.headerBorder : section.headerBg,
               cursor:"pointer", transition:"all 0.15s ease",
               transform: hov ? "scale(1.03)" : "scale(1)", fontFamily:"inherit" }}>
      <div style={{ width:44, height:44, borderRadius:10, background:"#fff",
                    border:`1px solid ${section.headerBorder}`,
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
        <section.icon size={22} color={section.iconColor} strokeWidth={1.75} />
      </div>
      <span style={{ fontSize:12, fontWeight:600, color:"#111827" }}>{section.name}</span>
    </button>
  );
}

function SectionCard({ section }: { section: GuideSection }) {
  return (
    <div style={{ borderRadius:16, border:`1px solid ${section.headerBorder}`, overflow:"hidden", marginBottom:16 }}>
      <div style={{ background:section.headerBg, padding:"14px 16px",
                    display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:"#fff",
                        border:`1px solid ${section.headerBorder}`,
                        display:"flex", alignItems:"center", justifyContent:"center" }}>
            <section.icon size={18} color={section.iconColor} strokeWidth={1.75} />
          </div>
          <span style={{ fontSize:15, fontWeight:700, color:"#111827" }}>{section.name}</span>
        </div>
        <span style={{ fontSize:13, fontWeight:500, color:section.badgeColor }}>{section.items.length} konu</span>
      </div>
      <div style={{ background:"#fff" }}>
        {section.items.map((item, idx) => (
          <button key={item}
            style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between",
                     padding:"11px 16px", background:"none", border:"none", borderBottom:`1px solid ${GB}`,
                     cursor:"pointer", fontFamily:"inherit", textAlign:"left", transition:"background 0.12s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#F9FAFB"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "none"; }}
            onClick={() => alert(`Konu: ${item}`)}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ width:22, height:22, borderRadius:"50%", background:section.numberBg, color:"#fff",
                             fontSize:11, fontWeight:700,
                             display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                {idx + 1}
              </span>
              <span style={{ fontSize:14, color:"#111827", fontWeight:400 }}>{item}</span>
            </div>
            <ChevronRight size={16} color="#9CA3AF" />
          </button>
        ))}
      </div>
      <div style={{ background:"#fff", padding:"10px 16px", display:"flex", justifyContent:"center" }}>
        <button style={{ background:"none", border:"none", cursor:"pointer", fontSize:13, fontWeight:600,
                         color:section.badgeColor, fontFamily:"inherit", display:"flex", alignItems:"center", gap:4 }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.textDecoration = "underline"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.textDecoration = "none"; }}
          onClick={() => alert(`${section.name} — tümünü gör`)}>
          Tümünü Gör
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

export default function YPRehberPage({ routeSlug: _routeSlug }: { routeSlug?: string }) {
  const [search, setSearch] = useState("");
  const [showToast, setShowToast] = useState<string|null>(null);

  const filtered = search.trim() === ""
    ? SECTIONS
    : SECTIONS.map(s => ({
        ...s,
        items: s.items.filter(item => item.toLowerCase().includes(search.toLowerCase())),
      })).filter(s => s.items.length > 0 || s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <YPLayout activeLink="/yourpoodle/rehber" constrain={false}>
      {showToast && (
        <div style={{ position:"fixed", bottom:88, left:"50%", transform:"translateX(-50%)", zIndex:999, pointerEvents:"none" }}>
          <div style={{ background:"#1A0052", color:"#fff", padding:"12px 24px", borderRadius:999, fontSize:14, fontWeight:500, whiteSpace:"nowrap" }}>
            {showToast}
          </div>
        </div>
      )}

      <main style={{ padding:"20px 16px 16px", paddingBottom:96 }}>
        {/* Search bar */}
        <div style={{ display:"flex", alignItems:"center", gap:0, border:`1px solid ${GB}`,
                      borderRadius:12, background:"#F9FAFB", marginBottom:20, overflow:"hidden" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"0 12px" }}>
            <Search size={18} color="#9CA3AF" />
          </div>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Poodle rehberinde ara..."
            style={{ flex:1, background:"none", border:"none", outline:"none",
                     fontSize:14, color:"#111827", padding:"12px 0", fontFamily:"inherit" }} />
          <button onClick={() => alert("Filtre seçenekleri yakında!")}
            style={{ background:"none", border:"none", cursor:"pointer", padding:"0 14px",
                     display:"flex", alignItems:"center", justifyContent:"center" }}>
            <SlidersHorizontal size={18} color="#6B7280" />
          </button>
        </div>

        {/* Quick category pills */}
        <div style={{ display:"flex", gap:10, marginBottom:24 }}>
          {SECTIONS.map(s => (
            <QuickPill key={s.id} section={s}
              onClick={() => {
                const el = document.getElementById(`section-${s.id}`);
                if (el) el.scrollIntoView({ behavior:"smooth", block:"start" });
              }} />
          ))}
        </div>

        {/* Section cards */}
        {filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"48px 0", color:"#6B7280" }}>
            <p style={{ fontSize:15 }}>Aramanızla eşleşen konu bulunamadı.</p>
            <button onClick={() => setSearch("")}
              style={{ marginTop:12, background:"none", border:"none", color:P, fontSize:14, cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}>
              Aramayı temizle
            </button>
          </div>
        ) : (
          filtered.map(s => (
            <div id={`section-${s.id}`} key={s.id}>
              <SectionCard section={s} />
            </div>
          ))
        )}
      </main>
    </YPLayout>
  );
}
