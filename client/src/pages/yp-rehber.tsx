import React, { useState, useEffect } from "react";
import { ChevronRight, Search, Heart, Brush, GraduationCap, Calculator } from "lucide-react";
import { useLocation, useSearch } from "wouter";
import YPLayout from "@/components/yourpoodle/YPLayout";

/* ── Design tokens ── */
const P  = "#5D3A1A";
const GB = "#E5E7EB";

/* ── Slug maps: item label → { category, slug } or { externalPath } ── */
const SLUG_MAP: Record<string, { cat: string; slug: string } | { path: string }> = {
  /* Sağlık */
  "Aşı Takvimi":                  { cat: "saglik",  slug: "asi-takvimi" },
  "İç ve Dış Parazit":            { cat: "saglik",  slug: "ic-dis-parazit" },
  "Toy Poodle Hastalıkları":      { cat: "saglik",  slug: "toy-poodle-hastaliklari" },
  "Alerji Belirtileri":           { cat: "saglik",  slug: "alerji-belirtileri" },
  "Sindirim ve İshal":            { cat: "saglik",  slug: "sindirim-ishal" },
  "Göz Sağlığı":                  { cat: "saglik",  slug: "goz-sagligi" },
  "Kulak Sağlığı":                { cat: "saglik",  slug: "kulak-sagligi" },
  "Ağız ve Diş Sağlığı":          { cat: "saglik",  slug: "agiz-dis-sagligi" },
  "Eklem ve Diz Kapağı":          { cat: "saglik",  slug: "eklem-diz-kapagi" },
  "Acil Durumlarda İlk Yardım":   { cat: "saglik",  slug: "acil-ilk-yardim" },
  /* Bakım */
  "Tüy Bakımı ve Tarama":         { cat: "bakim",   slug: "tuy-bakimi-tarama" },
  "Banyo Sıklığı":                { cat: "bakim",   slug: "banyo-sikligi" },
  "Doğru Şampuan Seçimi":         { cat: "bakim",   slug: "sampuan-secimi" },
  "Tıraş Modelleri":              { cat: "bakim",   slug: "tiras-modelleri" },
  "Göz Yaşı Lekesi Bakımı":       { cat: "bakim",   slug: "goz-yasi-lekesi" },
  "Kulak Temizliği":              { cat: "bakim",   slug: "kulak-temizligi" },
  "Tırnak Kesimi":                { cat: "bakim",   slug: "tirnak-kesimi" },
  "Diş Temizliği":                { cat: "bakim",   slug: "dis-temizligi" },
  "Pati ve Burun Bakımı":         { cat: "bakim",   slug: "pati-burun-bakimi" },
  "Yaz ve Kış Bakımı":            { cat: "bakim",   slug: "yaz-kis-bakimi" },
  /* Eğitim */
  "Tuvalet Eğitimi":              { cat: "egitim",  slug: "toy-poodle-tuvalet-egitimi" },
  "İsmini Öğretme":               { cat: "egitim",  slug: "isim-ogretme" },
  "Temel Komutlar":               { cat: "egitim",  slug: "temel-komutlar" },
  "Isırmayı Bırakma":             { cat: "egitim",  slug: "isirmayi-birakma" },
  "Havlama Kontrolü":             { cat: "egitim",  slug: "havlama-kontrolu" },
  "Tasma ile Yürüme":             { cat: "egitim",  slug: "tasma-yurume" },
  "Sosyalleşme Eğitimi":          { cat: "egitim",  slug: "sosyallesme-egitimi" },
  "Yalnız Kalma Eğitimi":         { cat: "egitim",  slug: "yalniz-kalma-egitimi" },
  "Ödülle Eğitim":                { cat: "egitim",  slug: "odulle-egitim" },
  "Seyahat ve Araba Eğitimi":     { cat: "egitim",  slug: "seyahat-araba-egitimi" },
  /* Araçlar — tools with dedicated pages navigate there directly */
  "Günlük Mama Hesaplayıcı":      { path: "/yourpoodle/mama-hesaplama" },
  "Su İhtiyacı Hesaplayıcı":      { cat: "araclar", slug: "su-ihtiyaci-hesaplama" },
  "İdeal Kilo Takibi":            { cat: "araclar", slug: "ideal-kilo-takibi" },
  "Köpek Yaşı Hesaplayıcı":       { path: "/yourpoodle/yas-hesaplama" },
  "Aşı Takvimi Oluştur":          { cat: "saglik",  slug: "asi-takvimi" },
  "Parazit Hatırlatıcısı":        { cat: "araclar", slug: "parazit-hatirlatici" },
  "Bakım Takvimi":                { cat: "araclar", slug: "bakim-takvimi" },
  "Mama Karşılaştırma":           { path: "/yourpoodle/mama-bul" },
  "Belirli Rehberi":              { cat: "araclar", slug: "beslenme-rehberi" },
  "Seyahat Kontrol Listesi":      { cat: "araclar", slug: "seyahat-kontrol-listesi" },
};

/* "Tümünü Gör" targets */
const CATEGORY_FULL_PATH: Record<string, string> = {
  saglik:  "/yourpoodle/saglik",
  bakim:   "/yourpoodle/bakim",
  egitim:  "/yourpoodle/egitim",
  araclar: "/yourpoodle/rehber?cat=araclar",
};

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
    id:"araclar", name:"Araçlar", icon:Calculator, iconColor:"#5D3A1A", badgeColor:"#5D3A1A",
    headerBg:"#F5F0E6", headerBorder:"#E5DDD0", numberBg:"#5D3A1A",
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

function SectionCard({ section, onNavigate }: { section: GuideSection; onNavigate: (item: string) => void }) {
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
            onClick={() => onNavigate(item)}>
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
          data-section-id={section.id}>
          Tümünü Gör
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

export default function YPRehberPage({ routeSlug: _routeSlug }: { routeSlug?: string }) {
  const [search, setSearch] = useState("");
  const [, navigate] = useLocation();
  const qs = useSearch();

  /* Pre-filter by ?cat= query param (used by "Tümünü Gör" for araclar) */
  const catParam = new URLSearchParams(qs).get("cat") ?? "";

  /* Scroll to hash anchor when navigating from homepage guide cards */
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const timer = setTimeout(() => {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  /* Page title */
  useEffect(() => {
    document.title = "Toy Poodle Bakım, Eğitim ve Sağlık Rehberleri | YourPoodle";
  }, []);

  /* Navigate a topic row click */
  const handleTopicClick = (item: string) => {
    const entry = SLUG_MAP[item];
    if (!entry) return;
    if ("path" in entry) {
      navigate(entry.path);
    } else {
      navigate(`/yourpoodle/rehber/${entry.cat}/${entry.slug}`);
    }
  };

  /* "Tümünü Gör" per category */
  const handleSeeAll = (sectionId: string) => {
    const path = CATEGORY_FULL_PATH[sectionId];
    if (path) navigate(path);
  };

  const baseFiltered = catParam
    ? SECTIONS.filter(s => s.id === catParam)
    : SECTIONS;

  const filtered = search.trim() === ""
    ? baseFiltered
    : baseFiltered.map(s => ({
        ...s,
        items: s.items.filter(item => item.toLowerCase().includes(search.toLowerCase())),
      })).filter(s => s.items.length > 0 || s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <YPLayout activeLink="/yourpoodle/rehber" constrain={false}>

      <main className="yp-pw" style={{ padding:"20px 16px 16px", paddingBottom:96 }}>

        {/* Back pill when filtered by category param */}
        {catParam && (
          <button
            onClick={() => navigate("/yourpoodle/rehber")}
            style={{ display:"flex", alignItems:"center", gap:6, marginBottom:14,
                     background:"none", border:"none", cursor:"pointer", fontFamily:"inherit",
                     fontSize:13, color:P, fontWeight:600, padding:0 }}>
            ← Tüm Kategoriler
          </button>
        )}

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
        </div>

        {/* Quick category pills */}
        {!catParam && (
          <div className="yp-pill-row" style={{ display:"flex", gap:10, marginBottom:24 }}>
            {SECTIONS.map(s => (
              <QuickPill key={s.id} section={s}
                onClick={() => {
                  const el = document.getElementById(`section-${s.id}`);
                  if (el) el.scrollIntoView({ behavior:"smooth", block:"start" });
                }} />
            ))}
          </div>
        )}

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
          <div className="yp-section-grid">
            {filtered.map(s => (
              <div id={`section-${s.id}`} key={s.id}>
                {/* Wrap card so we can intercept the "Tümünü Gör" click */}
                <div onClick={e => {
                  const btn = (e.target as HTMLElement).closest("button[data-section-id]");
                  if (btn) { handleSeeAll((btn as HTMLElement).dataset.sectionId!); }
                }}>
                  <SectionCard section={s} onNavigate={handleTopicClick} />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </YPLayout>
  );
}
