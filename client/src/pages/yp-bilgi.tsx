import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import {
  Search, X,
  ChevronLeft, ChevronRight, RotateCcw,
  CheckCircle2, Circle, AlertTriangle, Phone,
} from "lucide-react";
import { useCustomer } from "@/contexts/CustomerContext";
import YPLayout from "@/components/yourpoodle/YPLayout";

/* ─── Shared style ──────────────────────────────────────── */
const CSS = [
  "*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }",
  "body { background: #fff; }",
  ".icon-btn { background: none; border: none; cursor: pointer; display: flex; align-items: center; padding: 6px; border-radius: 8px; }",
  ".tool-card { transition: transform 0.12s; }",
  ".tool-card:active { transform: scale(0.94); }",
  ".noscroll::-webkit-scrollbar { display: none; }",
  ".noscroll { -ms-overflow-style: none; scrollbar-width: none; }",
].join("\n");

/* ─── URL slug ↔ internal ID maps ──────────────────────── */
const SLUG_TO_ID: Record<string, string> = {
  "mama-hesaplama":"mama",  "su-hesaplama":"su",
  "aktivite-hesabi":"aktivite", "yas-hesaplama":"yas",
  "insan-yasi-tablosu":"insanyas", "asi-takvimi":"asi",
  "ideal-kilo":"kilo", "tiras-zamani":"tiras",
  "odul-hesabi":"odul", "belirti-kontrol":"hastalik",
  "dis-sagligi":"dis", "diski-rehberi":"diski",
};
const ID_TO_SLUG: Record<string,string> = Object.fromEntries(
  Object.entries(SLUG_TO_ID).map(([s,i])=>[i,s])
);

/* ─── Category groups ────────────────────────────────────── */
const TOOL_CATS = [
  { id:"all",      label:"Tümü",       ids: null as string[]|null },
  { id:"beslenme", label:"🍖 Beslenme", ids:["mama","su","aktivite","odul"] },
  { id:"saglik",   label:"❤️ Sağlık",   ids:["asi","kilo","hastalik","dis","diski"] },
  { id:"bakim",    label:"✂️ Bakım",    ids:["tiras"] },
  { id:"genel",    label:"🎂 Genel",    ids:["yas","insanyas"] },
];

/* ─── Token-based search (fixes "aşı" ≠ "yaş" substring bug) */
function normalize(s: string) {
  return s.toLowerCase()
    .replace(/[İI]/g,"i").replace(/[ğĞ]/g,"g")
    .replace(/[üÜ]/g,"u").replace(/[şŞ]/g,"s")
    .replace(/ı/g,"i").replace(/[öÖ]/g,"o")
    .replace(/[çÇ]/g,"c");
}
function tokenSearch(q: string, label: string, desc: string): boolean {
  if (!q.trim()) return true;
  const nq = normalize(q.trim());
  const words = normalize(label + " " + desc).split(/[\s\-\/()]+/);
  return words.some(w => w.startsWith(nq));
}

/* ─── Tool registry ─────────────────────────────────────── */
const TOOLS = [
  { id:"mama",    emoji:"🍖", label:"Mama Hesaplama",    desc:"Günlük mama miktarını hesapla",    bg:"#FFF0E0", color:"#E07820" },
  { id:"su",      emoji:"💧", label:"Su Hesaplama",      desc:"Günlük su ihtiyacını hesapla",     bg:"#DBEAFE", color:"#2563EB" },
  { id:"aktivite",emoji:"🏃", label:"Aktivite Hesabı",   desc:"Günlük egzersiz ihtiyacını öğren", bg:"#CCFBF1", color:"#0D9488" },
  { id:"yas",     emoji:"🎂", label:"Yaş Hesaplama",     desc:"Köpek yaşını insan yaşına çevir",  bg:"#F0E8FF", color:"#7C3AFF" },
  { id:"insanyas",emoji:"🐕", label:"İnsan Yaşı Tablosu",desc:"Karşılaştırmalı yaş tablosu",     bg:"#FFF0E0", color:"#E07820" },
  { id:"asi",     emoji:"💉", label:"Aşı Takvimi",       desc:"Aşılarını düzenli takip et",       bg:"#FFE4EC", color:"#E75480" },
  { id:"kilo",    emoji:"⚖️", label:"İdeal Kilo",        desc:"İdeal kilo aralığını öğren",       bg:"#D6F5E8", color:"#059669" },
  { id:"tiras",   emoji:"✂️", label:"Tıraş Zamanı",     desc:"Sonraki tıraş tarihini hesapla",   bg:"#FFE4EC", color:"#E75480" },
  { id:"odul",    emoji:"🦴", label:"Ödül Hesabı",       desc:"Ödül mamasının kalorisini hesapla",bg:"#FFF9C4", color:"#CA8A04" },
  { id:"hastalik",emoji:"🩺", label:"Belirti Kontrolü",  desc:"Belirtilere göre risk değerlendir",bg:"#EDE8FF", color:"#7C3AFF" },
  { id:"dis",     emoji:"😁", label:"Diş Sağlığı",       desc:"Ağız sağlığı kontrol listesi",     bg:"#D6F5F5", color:"#0891B2" },
  { id:"diski",   emoji:"📊", label:"Dışkı Rehberi",     desc:"Rengine ve kıvamına göre kontrol", bg:"#FEFCE8", color:"#CA8A04" },
];

/* ─── Shared sub-components ─────────────────────────────── */
function ToolHeader({ emoji, title, desc, onBack }: { emoji:string; title:string; desc:string; onBack:()=>void }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, padding:"16px 16px 0", marginBottom:20 }}>
      <button onClick={onBack} style={{ background:"#F0EBFF", border:"none", borderRadius:10, width:38, height:38, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0 }}>
        <ChevronLeft size={20} color="#7C3AFF" />
      </button>
      <div style={{ fontSize:28 }}>{emoji}</div>
      <div>
        <h2 style={{ fontSize:17, fontWeight:800, color:"#1a1a1a", fontFamily:"Inter,sans-serif", margin:0, lineHeight:1.2 }}>{title}</h2>
        <div style={{ fontSize:12, color:"#888", fontFamily:"Inter,sans-serif" }}>{desc}</div>
      </div>
    </div>
  );
}

function ResultBox({ children, color="#7C3AFF", bg="#F0EBFF" }: { children:React.ReactNode; color?:string; bg?:string }) {
  return (
    <div style={{ background:bg, border:`2px solid ${color}`, borderRadius:18, padding:"20px 20px", textAlign:"center" }}>
      {children}
    </div>
  );
}

/* ─── 1. Mama Calculator ────────────────────────────────── */
function MamaCalculator({ onBack }: { onBack:()=>void }) {
  const [, navigate] = useLocation();
  const [weight, setWeight] = useState("");
  const [age, setAge]       = useState("yetiskin");
  const [act, setAct]       = useState("orta");
  const [result, setResult] = useState<number|null>(null);

  const calc = () => {
    const w = parseFloat(weight); if (isNaN(w) || w <= 0) return;
    let base = w * 30 + 70;
    if (age === "yavru") base *= 2;
    if (age === "yasli") base *= 0.8;
    if (act === "dusuk") base *= 0.9;
    if (act === "yuksek") base *= 1.2;
    setResult(Math.round(base / 3.5));
  };

  return (
    <div style={{ padding:"0 16px", paddingBottom:32 }}>
      <ToolHeader emoji="🍖" title="Mama Hesaplama" desc="Günlük mama miktarını hesapla" onBack={onBack} />
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        <div style={{ background:"#FFF0E0", borderRadius:16, padding:16 }}>
          <label style={{ fontSize:12, fontWeight:700, color:"#E07820", display:"block", marginBottom:8 }}>Poodle'ın kilosu (kg)</label>
          <input type="number" value={weight} onChange={e=>setWeight(e.target.value)} placeholder="Örn: 3.5"
            style={{ width:"100%", height:48, borderRadius:12, border:"2px solid #E07820", padding:"0 14px", fontSize:16, fontWeight:700, outline:"none", fontFamily:"Inter,sans-serif", background:"#fff" }} />
        </div>
        <div style={{ background:"#FAFAFA", borderRadius:16, padding:16 }}>
          <label style={{ fontSize:12, fontWeight:700, color:"#555", display:"block", marginBottom:10 }}>Yaş grubu</label>
          <div style={{ display:"flex", gap:8 }}>
            {[["yavru","🐶 Yavru"],["yetiskin","🐕 Yetişkin"],["yasli","🦮 Yaşlı"]].map(([v,l])=>(
              <button key={v} onClick={()=>setAge(v)} style={{ flex:1, padding:"10px 4px", borderRadius:10, border:"2px solid", borderColor:age===v?"#E07820":"#e8e8e8", background:age===v?"#FFF0E0":"#fff", fontSize:10.5, fontWeight:700, color:age===v?"#E07820":"#555", cursor:"pointer", fontFamily:"Inter,sans-serif", lineHeight:1.4 }}>{l}</button>
            ))}
          </div>
        </div>
        <div style={{ background:"#FAFAFA", borderRadius:16, padding:16 }}>
          <label style={{ fontSize:12, fontWeight:700, color:"#555", display:"block", marginBottom:10 }}>Aktivite seviyesi</label>
          <div style={{ display:"flex", gap:8 }}>
            {[["dusuk","😴 Düşük"],["orta","🚶 Orta"],["yuksek","🏃 Yüksek"]].map(([v,l])=>(
              <button key={v} onClick={()=>setAct(v)} style={{ flex:1, padding:"10px 4px", borderRadius:10, border:"2px solid", borderColor:act===v?"#7C3AFF":"#e8e8e8", background:act===v?"#EDE8FF":"#fff", fontSize:12, fontWeight:700, color:act===v?"#7C3AFF":"#555", cursor:"pointer", fontFamily:"Inter,sans-serif" }}>{l}</button>
            ))}
          </div>
        </div>
        <button onClick={calc} style={{ height:52, borderRadius:16, border:"none", background:"linear-gradient(135deg,#E07820,#F59E0B)", color:"#fff", fontSize:15, fontWeight:800, cursor:"pointer", fontFamily:"Inter,sans-serif" }}>Hesapla</button>
        {result !== null && (
          <>
            <ResultBox color="#E07820" bg="linear-gradient(135deg,#FFF0E0,#FFF9C4)">
              <div style={{ fontSize:13, color:"#888", marginBottom:4 }}>Günlük önerilen mama miktarı</div>
              <div style={{ fontSize:52, fontWeight:900, color:"#E07820" }}>{result}g</div>
              <div style={{ fontSize:13, color:"#555", marginTop:6, fontWeight:700 }}>
                Günde {age==="yavru"?"3–4":"2"} öğün halinde verin
              </div>
              <div style={{ fontSize:12, color:"#888", marginTop:6, lineHeight:1.6 }}>Bu miktar yaklaşık değerdir. Mama markasının talimatlarını da göz önünde bulundurun.</div>
              <button onClick={()=>setResult(null)} style={{ marginTop:12, display:"inline-flex", alignItems:"center", gap:6, background:"none", border:"none", color:"#E07820", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"Inter,sans-serif" }}>
                <RotateCcw size={13} /> Yeniden Hesapla
              </button>
            </ResultBox>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <button onClick={()=>navigate("/yourpoodle/mama-bul")}
                style={{ height:46, borderRadius:13, border:"none", background:"#E07820", color:"#fff", fontSize:13, fontWeight:800, cursor:"pointer", fontFamily:"Inter,sans-serif" }}>
                🍖 Mama Bul Sihirbazı ile kişisel öneri al →
              </button>
              <button onClick={()=>navigate("/yourpoodle/magaza?kategori=mama")}
                style={{ height:46, borderRadius:13, border:"1.5px solid #E07820", background:"#fff", color:"#E07820", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"Inter,sans-serif" }}>
                Mağazada mama ürünlerine bak →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── 2. Su Hesabı ──────────────────────────────────────── */
function SuHesabi({ onBack }: { onBack:()=>void }) {
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState<number|null>(null);

  const calc = () => {
    const w = parseFloat(weight); if (isNaN(w) || w <= 0) return;
    setResult(Math.round(w * 60));
  };

  return (
    <div style={{ padding:"0 16px", paddingBottom:32 }}>
      <ToolHeader emoji="💧" title="Su Hesaplama" desc="Günlük su ihtiyacını hesapla" onBack={onBack} />
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        <div style={{ background:"#DBEAFE", borderRadius:16, padding:16 }}>
          <label style={{ fontSize:12, fontWeight:700, color:"#2563EB", display:"block", marginBottom:8 }}>Poodle'ın kilosu (kg)</label>
          <input type="number" value={weight} onChange={e=>setWeight(e.target.value)} placeholder="Örn: 3.5"
            style={{ width:"100%", height:48, borderRadius:12, border:"2px solid #2563EB", padding:"0 14px", fontSize:16, fontWeight:700, outline:"none", fontFamily:"Inter,sans-serif", background:"#fff" }} />
        </div>
        <div style={{ background:"#F0F9FF", borderRadius:14, padding:14 }}>
          <div style={{ fontSize:12, color:"#555", lineHeight:1.7, fontFamily:"Inter,sans-serif" }}>
            💡 <strong>Formül:</strong> Günlük su ihtiyacı ≈ ağırlık (kg) × 60 ml<br />
            Sıcak havada, egzersiz sonrası ve emziren annelerde bu miktar artar.
          </div>
        </div>
        <button onClick={calc} style={{ height:52, borderRadius:16, border:"none", background:"linear-gradient(135deg,#2563EB,#60A5FA)", color:"#fff", fontSize:15, fontWeight:800, cursor:"pointer", fontFamily:"Inter,sans-serif" }}>Hesapla</button>
        {result !== null && (
          <ResultBox color="#2563EB" bg="#EFF6FF">
            <div style={{ fontSize:13, color:"#888", marginBottom:4 }}>Günlük minimum su ihtiyacı</div>
            <div style={{ fontSize:52, fontWeight:900, color:"#2563EB" }}>{result} ml</div>
            <div style={{ fontSize:12, color:"#888", marginTop:8, lineHeight:1.6 }}>
              ≈ {Math.round(result / 250)} bardak su<br />
              Kasesi her zaman dolu ve temiz tutun.
            </div>
            <button onClick={()=>setResult(null)} style={{ marginTop:12, display:"inline-flex", alignItems:"center", gap:6, background:"none", border:"none", color:"#2563EB", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"Inter,sans-serif" }}>
              <RotateCcw size={13} /> Yeniden Hesapla
            </button>
          </ResultBox>
        )}
      </div>
    </div>
  );
}

/* ─── 3. Aktivite Hesabı ────────────────────────────────── */
function AktiviteHesabi({ onBack }: { onBack:()=>void }) {
  const [age,    setAge]    = useState("yetiskin");
  const [energy, setEnergy] = useState("orta");
  const [result, setResult] = useState<{min:number; max:number; sessions:number}|null>(null);

  const calc = () => {
    let base = 30;
    if (age === "yavru")   base = 15;
    if (age === "yasli")   base = 20;
    if (energy === "dusuk") base = Math.round(base * 0.7);
    if (energy === "yuksek") base = Math.round(base * 1.5);
    setResult({ min: base, max: Math.round(base * 1.4), sessions: age === "yavru" ? 3 : 2 });
  };

  return (
    <div style={{ padding:"0 16px", paddingBottom:32 }}>
      <ToolHeader emoji="🏃" title="Aktivite Hesabı" desc="Günlük egzersiz ihtiyacını öğren" onBack={onBack} />
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        <div style={{ background:"#CCFBF1", borderRadius:16, padding:16 }}>
          <label style={{ fontSize:12, fontWeight:700, color:"#0D9488", display:"block", marginBottom:10 }}>Yaş grubu</label>
          <div style={{ display:"flex", gap:8 }}>
            {[["yavru","🐶 Yavru (0-1 yaş)"],["yetiskin","🐕 Yetişkin (1-7 yaş)"],["yasli","🦮 Yaşlı (7+ yaş)"]].map(([v,l])=>(
              <button key={v} onClick={()=>setAge(v)} style={{ flex:1, padding:"10px 4px", borderRadius:10, border:"2px solid", borderColor:age===v?"#0D9488":"#e8e8e8", background:age===v?"#CCFBF1":"#fff", fontSize:10.5, fontWeight:700, color:age===v?"#0D9488":"#555", cursor:"pointer", fontFamily:"Inter,sans-serif", lineHeight:1.4 }}>{l}</button>
            ))}
          </div>
        </div>
        <div style={{ background:"#FAFAFA", borderRadius:16, padding:16 }}>
          <label style={{ fontSize:12, fontWeight:700, color:"#555", display:"block", marginBottom:10 }}>Enerji seviyesi</label>
          <div style={{ display:"flex", gap:8 }}>
            {[["dusuk","😴 Düşük"],["orta","🚶 Orta"],["yuksek","⚡ Yüksek"]].map(([v,l])=>(
              <button key={v} onClick={()=>setEnergy(v)} style={{ flex:1, padding:"10px 4px", borderRadius:10, border:"2px solid", borderColor:energy===v?"#0D9488":"#e8e8e8", background:energy===v?"#CCFBF1":"#fff", fontSize:12, fontWeight:700, color:energy===v?"#0D9488":"#555", cursor:"pointer", fontFamily:"Inter,sans-serif" }}>{l}</button>
            ))}
          </div>
        </div>
        <button onClick={calc} style={{ height:52, borderRadius:16, border:"none", background:"linear-gradient(135deg,#0D9488,#34D399)", color:"#fff", fontSize:15, fontWeight:800, cursor:"pointer", fontFamily:"Inter,sans-serif" }}>Hesapla</button>
        {result && (
          <ResultBox color="#0D9488" bg="#F0FDF9">
            <div style={{ fontSize:13, color:"#888", marginBottom:4 }}>Günlük egzersiz önerisi</div>
            <div style={{ fontSize:48, fontWeight:900, color:"#0D9488" }}>{result.min}–{result.max} dk</div>
            <div style={{ fontSize:13, color:"#555", marginTop:10, lineHeight:1.7, fontFamily:"Inter,sans-serif" }}>
              Günde <strong>{result.sessions} seans</strong> halinde bölünmesi önerilir.<br />
              Yürüyüş + oyun kombinasyonu idealdir.
            </div>
            <button onClick={()=>setResult(null)} style={{ marginTop:12, display:"inline-flex", alignItems:"center", gap:6, background:"none", border:"none", color:"#0D9488", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"Inter,sans-serif" }}>
              <RotateCcw size={13} /> Yeniden Hesapla
            </button>
          </ResultBox>
        )}
      </div>
    </div>
  );
}

/* ─── 4. Yaş Hesaplama ──────────────────────────────────── */
function YasHesaplama({ onBack }: { onBack:()=>void }) {
  const [dogAge, setDogAge] = useState("");
  const [result, setResult] = useState<number|null>(null);

  const calc = () => {
    const y = parseFloat(dogAge); if (isNaN(y) || y < 0) return;
    // Küçük ırklar için: ilk yıl=15, ikinci yıl=9, sonrası +4
    let human = 0;
    if (y >= 1) human += 15;
    if (y >= 2) human += 9;
    if (y > 2)  human += Math.round((y - 2) * 4);
    setResult(human);
  };

  return (
    <div style={{ padding:"0 16px", paddingBottom:32 }}>
      <ToolHeader emoji="🎂" title="Yaş Hesaplama" desc="Köpek yaşını insan yaşına çevir" onBack={onBack} />
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        <div style={{ background:"#F0E8FF", borderRadius:16, padding:16 }}>
          <label style={{ fontSize:12, fontWeight:700, color:"#7C3AFF", display:"block", marginBottom:8 }}>Poodle'ın yaşı (yıl)</label>
          <input type="number" value={dogAge} onChange={e=>setDogAge(e.target.value)} placeholder="Örn: 4"
            style={{ width:"100%", height:48, borderRadius:12, border:"2px solid #7C3AFF", padding:"0 14px", fontSize:16, fontWeight:700, outline:"none", fontFamily:"Inter,sans-serif", background:"#fff" }} />
        </div>
        <div style={{ background:"#F7F4FF", borderRadius:14, padding:14 }}>
          <div style={{ fontSize:12, color:"#555", lineHeight:1.7, fontFamily:"Inter,sans-serif" }}>
            💡 Küçük ırk formülü: 1. yıl = 15 insan yılı, 2. yıl = +9, sonraki her yıl = +4
          </div>
        </div>
        <button onClick={calc} style={{ height:52, borderRadius:16, border:"none", background:"linear-gradient(135deg,#7C3AFF,#A78BFA)", color:"#fff", fontSize:15, fontWeight:800, cursor:"pointer", fontFamily:"Inter,sans-serif" }}>Hesapla</button>
        {result !== null && (
          <ResultBox color="#7C3AFF" bg="#F5F0FF">
            <div style={{ fontSize:13, color:"#888", marginBottom:4 }}>İnsan yaşı karşılığı</div>
            <div style={{ fontSize:52, fontWeight:900, color:"#7C3AFF" }}>{result} yaş</div>
            <div style={{ fontSize:12, color:"#888", marginTop:8, lineHeight:1.6 }}>
              {result < 20 ? "Hâlâ bir genç! Enerji dozu yüksek olabilir 🐾" :
               result < 40 ? "Genç yetişkin döneminde, en aktif çağ 🏃" :
               result < 60 ? "Olgun yetişkin, rutin kontroller önemli 🩺" :
               "Kıdemli üye! Eklem ve diyet takibi ihmal edilmemeli ❤️"}
            </div>
            <button onClick={()=>setResult(null)} style={{ marginTop:12, display:"inline-flex", alignItems:"center", gap:6, background:"none", border:"none", color:"#7C3AFF", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"Inter,sans-serif" }}>
              <RotateCcw size={13} /> Yeniden Hesapla
            </button>
          </ResultBox>
        )}
      </div>
    </div>
  );
}

/* ─── 5. İnsan Yaşı Tablosu ─────────────────────────────── */
const AGE_TABLE = [
  [1, 15], [2, 24], [3, 28], [4, 32], [5, 36], [6, 40], [7, 44],
  [8, 48], [9, 52], [10, 56], [12, 64], [14, 72], [16, 80], [18, 88],
];

function InsanYasTablosu({ onBack }: { onBack:()=>void }) {
  const [highlight, setHighlight] = useState<number|null>(null);

  return (
    <div style={{ padding:"0 16px", paddingBottom:32 }}>
      <ToolHeader emoji="🐕" title="İnsan Yaşı Tablosu" desc="Karşılaştırmalı yaş tablosu" onBack={onBack} />
      <div style={{ background:"#FFF0E0", borderRadius:14, padding:14, marginBottom:16 }}>
        <div style={{ fontSize:12, color:"#E07820", lineHeight:1.7, fontFamily:"Inter,sans-serif" }}>
          💡 Küçük ırk (Toy Poodle) için hesaplanmıştır. Bir satıra dokunarak seç.
        </div>
      </div>
      <div style={{ borderRadius:16, overflow:"hidden", border:"1px solid #f0f0f0" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", background:"#F5F0FF", padding:"10px 0" }}>
          <div style={{ textAlign:"center", fontSize:12, fontWeight:800, color:"#7C3AFF" }}>Köpek Yaşı</div>
          <div style={{ textAlign:"center", fontSize:12, fontWeight:800, color:"#7C3AFF" }}>İnsan Yaşı</div>
        </div>
        {AGE_TABLE.map(([dog, human]) => (
          <button key={dog} onClick={() => setHighlight(highlight === dog ? null : dog)}
            style={{ display:"grid", gridTemplateColumns:"1fr 1fr", width:"100%", border:"none", borderBottom:"1px solid #fafafa", padding:"12px 0", cursor:"pointer", background: highlight===dog ? "#EDE8FF" : dog % 2 === 0 ? "#fafafa" : "#fff", transition:"background 0.15s" }}>
            <div style={{ textAlign:"center", fontSize:15, fontWeight: highlight===dog ? 900 : 600, color: highlight===dog ? "#7C3AFF" : "#333", fontFamily:"Inter,sans-serif" }}>{dog} yıl</div>
            <div style={{ textAlign:"center", fontSize:15, fontWeight: highlight===dog ? 900 : 600, color: highlight===dog ? "#7C3AFF" : "#555", fontFamily:"Inter,sans-serif" }}>{human} yaş</div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── 6. Aşı Takvimi ────────────────────────────────────── */
const VACCINES = [
  { hafta:6,  ad:"Karma Aşı 1 (DHPPi)", zorunlu:true,  notlar:"İlk karma aşı, veteriner onaylı" },
  { hafta:9,  ad:"Karma Aşı 2 (DHPPi)", zorunlu:true,  notlar:"30 gün sonra tekrar" },
  { hafta:12, ad:"Karma Aşı 3 + Kuduz", zorunlu:true,  notlar:"Kuduz aşısı bu seansta başlanır" },
  { hafta:16, ad:"Karma Aşı 4 (Booster)", zorunlu:true, notlar:"Son temel dozu" },
  { yil:1,   ad:"Yıllık Hatırlatma",    zorunlu:true,  notlar:"Her yıl tekrar edilmeli" },
  { hafta:8, ad:"Kennel Cough (Bordetella)", zorunlu:false, notlar:"Diğer köpeklerle temas ediyorsa" },
  { yil:1,   ad:"Leptospiroz",          zorunlu:false, notlar:"Dış mekân erişimi varsa önerilir" },
];

function AsiTakvimi({ onBack }: { onBack:()=>void }) {
  const [age, setAge] = useState("yavru");
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    const s = new Set(checked);
    s.has(i) ? s.delete(i) : s.add(i);
    setChecked(s);
  };

  return (
    <div style={{ padding:"0 16px", paddingBottom:32 }}>
      <ToolHeader emoji="💉" title="Aşı Takvimi" desc="Aşılarını takip et ve işaretle" onBack={onBack} />
      <div style={{ display:"flex", gap:8, marginBottom:18 }}>
        {[["yavru","🐶 Yavru"],["yetiskin","🐕 Yetişkin"]].map(([v,l])=>(
          <button key={v} onClick={()=>setAge(v)} style={{ flex:1, padding:"10px 4px", borderRadius:10, border:"2px solid", borderColor:age===v?"#E75480":"#e8e8e8", background:age===v?"#FFE4EC":"#fff", fontSize:13, fontWeight:700, color:age===v?"#E75480":"#555", cursor:"pointer", fontFamily:"Inter,sans-serif" }}>{l}</button>
        ))}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {VACCINES.filter(v => age === "yavru" ? !v.yil : !!v.yil).map((v, i) => (
          <button key={i} onClick={() => toggle(i)}
            style={{ display:"flex", alignItems:"flex-start", gap:12, padding:14, background: checked.has(i) ? "#F0FDF4" : "#FAFAFA", borderRadius:14, border:`1.5px solid ${checked.has(i) ? "#22C55E" : "#f0f0f0"}`, cursor:"pointer", textAlign:"left", transition:"all 0.15s" }}>
            {checked.has(i)
              ? <CheckCircle2 size={22} color="#22C55E" strokeWidth={2} style={{ flexShrink:0, marginTop:1 }} />
              : <Circle size={22} color="#ddd" strokeWidth={2} style={{ flexShrink:0, marginTop:1 }} />
            }
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                <span style={{ fontSize:14, fontWeight:700, color: checked.has(i) ? "#16A34A" : "#1a1a1a", fontFamily:"Inter,sans-serif", textDecoration: checked.has(i) ? "line-through" : "none" }}>{v.ad}</span>
                {v.zorunlu && <span style={{ fontSize:9, fontWeight:800, background:"#FFE4EC", color:"#E75480", borderRadius:6, padding:"2px 6px" }}>ZORUNLU</span>}
              </div>
              <div style={{ fontSize:11, color:"#888", fontFamily:"Inter,sans-serif" }}>
                {v.hafta ? `${v.hafta}. hafta` : "Yıllık"} • {v.notlar}
              </div>
            </div>
          </button>
        ))}
      </div>
      <div style={{ marginTop:16, background:"#FFF0E0", borderRadius:14, padding:14 }}>
        <div style={{ fontSize:12, color:"#E07820", lineHeight:1.7, fontFamily:"Inter,sans-serif" }}>
          ⚠️ Aşı programı veterinerinizin önerisine göre değişebilir. Pasaport defterini güncel tutun.
        </div>
      </div>
    </div>
  );
}

/* ─── 7. İdeal Kilo ─────────────────────────────────────── */
const KILO_TABLE = [
  { tip:"Toy Poodle",       min:1.5, max:3.5, boy:"25–28 cm" },
  { tip:"Minyatür Poodle",  min:5,   max:9,   boy:"28–38 cm" },
  { tip:"Orta Poodle",      min:9,   max:13,  boy:"35–45 cm" },
  { tip:"Standart Poodle",  min:20,  max:32,  boy:"45–60 cm" },
];

function IdealKilo({ onBack }: { onBack:()=>void }) {
  const [weight, setWeight]   = useState("");
  const [selected, setSelected] = useState("Toy Poodle");
  const current = KILO_TABLE.find(k => k.tip === selected)!;

  const w = parseFloat(weight);
  const status = isNaN(w) || weight === "" ? null :
    w < current.min ? "Düşük" : w > current.max ? "Yüksek" : "İdeal";
  const statusColor = status === "İdeal" ? "#22C55E" : status === "Düşük" ? "#F59E0B" : "#EF4444";

  return (
    <div style={{ padding:"0 16px", paddingBottom:32 }}>
      <ToolHeader emoji="⚖️" title="İdeal Kilo" desc="Poodle türüne göre ideal kilo aralığı" onBack={onBack} />
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        <div style={{ background:"#D6F5E8", borderRadius:16, padding:16 }}>
          <label style={{ fontSize:12, fontWeight:700, color:"#059669", display:"block", marginBottom:10 }}>Poodle türü</label>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {KILO_TABLE.map(k => (
              <button key={k.tip} onClick={() => setSelected(k.tip)}
                style={{ padding:"10px 14px", borderRadius:10, border:"2px solid", borderColor:selected===k.tip?"#059669":"#e8e8e8", background:selected===k.tip?"#D6F5E8":"#fff", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", fontFamily:"Inter,sans-serif" }}>
                <span style={{ fontSize:13, fontWeight:700, color:selected===k.tip?"#059669":"#333" }}>{k.tip}</span>
                <span style={{ fontSize:12, color:"#888" }}>{k.min}–{k.max} kg · {k.boy}</span>
              </button>
            ))}
          </div>
        </div>
        <div style={{ background:"#FAFAFA", borderRadius:16, padding:16 }}>
          <label style={{ fontSize:12, fontWeight:700, color:"#555", display:"block", marginBottom:8 }}>Poodle'ın mevcut kilosu (kg) <span style={{ fontWeight:400, color:"#aaa" }}>(isteğe bağlı)</span></label>
          <input type="number" value={weight} onChange={e=>setWeight(e.target.value)} placeholder="Örn: 3.2"
            style={{ width:"100%", height:48, borderRadius:12, border:"2px solid #059669", padding:"0 14px", fontSize:16, fontWeight:700, outline:"none", fontFamily:"Inter,sans-serif", background:"#fff" }} />
        </div>
        <ResultBox color="#059669" bg="#F0FDF4">
          <div style={{ fontSize:13, color:"#888", marginBottom:4 }}>{current.tip} için ideal kilo aralığı</div>
          <div style={{ fontSize:42, fontWeight:900, color:"#059669" }}>{current.min}–{current.max} kg</div>
          <div style={{ fontSize:12, color:"#888", marginTop:4 }}>Boy: {current.boy}</div>
          {status && (
            <div style={{ marginTop:12, padding:"8px 16px", borderRadius:10, background: status==="İdeal"?"#DCFCE7":status==="Düşük"?"#FEF3C7":"#FEE2E2", display:"inline-block" }}>
              <span style={{ fontSize:13, fontWeight:800, color:statusColor }}>
                {status === "İdeal" ? "✅ Kilo ideal aralıkta!" : status === "Düşük" ? "⚠️ Kilo düşük — mama artırılabilir" : "⚠️ Kilo yüksek — diyete dikkat!"}
              </span>
            </div>
          )}
        </ResultBox>
      </div>
    </div>
  );
}

/* ─── 8. Tıraş Zamanı ───────────────────────────────────── */
function TirasZamani({ onBack }: { onBack:()=>void }) {
  const [lastDate, setLastDate] = useState("");
  const [interval, setInterval_] = useState("6");
  const [result, setResult]     = useState<{ next:string; days:number }|null>(null);

  const calc = () => {
    if (!lastDate) return;
    const last = new Date(lastDate);
    const next = new Date(last);
    next.setDate(next.getDate() + parseInt(interval) * 7);
    const today = new Date();
    const days  = Math.ceil((next.getTime() - today.getTime()) / 86400000);
    setResult({ next: next.toLocaleDateString("tr-TR", { day:"numeric", month:"long", year:"numeric" }), days });
  };

  return (
    <div style={{ padding:"0 16px", paddingBottom:32 }}>
      <ToolHeader emoji="✂️" title="Tıraş Zamanı" desc="Sonraki tıraş tarihini hesapla" onBack={onBack} />
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        <div style={{ background:"#FFE4EC", borderRadius:16, padding:16 }}>
          <label style={{ fontSize:12, fontWeight:700, color:"#E75480", display:"block", marginBottom:8 }}>Son tıraş tarihi</label>
          <input type="date" value={lastDate} onChange={e=>setLastDate(e.target.value)}
            style={{ width:"100%", height:48, borderRadius:12, border:"2px solid #E75480", padding:"0 14px", fontSize:14, fontWeight:700, outline:"none", fontFamily:"Inter,sans-serif", background:"#fff", color:"#333" }} />
        </div>
        <div style={{ background:"#FAFAFA", borderRadius:16, padding:16 }}>
          <label style={{ fontSize:12, fontWeight:700, color:"#555", display:"block", marginBottom:10 }}>Tıraş aralığı</label>
          <div style={{ display:"flex", gap:8 }}>
            {[["4","4 Hafta"],["6","6 Hafta"],["8","8 Hafta"]].map(([v,l])=>(
              <button key={v} onClick={()=>setInterval_(v)} style={{ flex:1, padding:"10px 4px", borderRadius:10, border:"2px solid", borderColor:interval===v?"#E75480":"#e8e8e8", background:interval===v?"#FFE4EC":"#fff", fontSize:12, fontWeight:700, color:interval===v?"#E75480":"#555", cursor:"pointer", fontFamily:"Inter,sans-serif" }}>{l}</button>
            ))}
          </div>
        </div>
        <button onClick={calc} style={{ height:52, borderRadius:16, border:"none", background:"linear-gradient(135deg,#E75480,#F472B6)", color:"#fff", fontSize:15, fontWeight:800, cursor:"pointer", fontFamily:"Inter,sans-serif" }}>Hesapla</button>
        {result && (
          <ResultBox color="#E75480" bg="#FFF0F5">
            <div style={{ fontSize:13, color:"#888", marginBottom:4 }}>Sonraki tıraş tarihi</div>
            <div style={{ fontSize:22, fontWeight:900, color:"#E75480", lineHeight:1.3 }}>{result.next}</div>
            <div style={{ fontSize:14, fontWeight:700, color: result.days < 0 ? "#EF4444" : result.days <= 7 ? "#F59E0B" : "#22C55E", marginTop:12 }}>
              {result.days < 0 ? `${Math.abs(result.days)} gün gecikmiş! 🚨` :
               result.days === 0 ? "Bugün tıraş günü! ✂️" :
               `${result.days} gün sonra ✅`}
            </div>
            <button onClick={()=>setResult(null)} style={{ marginTop:12, display:"inline-flex", alignItems:"center", gap:6, background:"none", border:"none", color:"#E75480", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"Inter,sans-serif" }}>
              <RotateCcw size={13} /> Yeniden Hesapla
            </button>
          </ResultBox>
        )}
      </div>
    </div>
  );
}

/* ─── 9. Ödül Hesabı ────────────────────────────────────── */
function OdulHesabi({ onBack }: { onBack:()=>void }) {
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState<number|null>(null);

  const calc = () => {
    const w = parseFloat(weight); if (isNaN(w) || w <= 0) return;
    const daily = Math.round((w * 30 + 70) / 3.5);
    setResult(Math.round(daily * 0.1)); // max %10 ödülden gelmeli
  };

  return (
    <div style={{ padding:"0 16px", paddingBottom:32 }}>
      <ToolHeader emoji="🦴" title="Ödül Hesabı" desc="Günlük ödül kalori bütçesini hesapla" onBack={onBack} />
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        <div style={{ background:"#FFF9C4", borderRadius:16, padding:16 }}>
          <label style={{ fontSize:12, fontWeight:700, color:"#CA8A04", display:"block", marginBottom:8 }}>Poodle'ın kilosu (kg)</label>
          <input type="number" value={weight} onChange={e=>setWeight(e.target.value)} placeholder="Örn: 3.5"
            style={{ width:"100%", height:48, borderRadius:12, border:"2px solid #CA8A04", padding:"0 14px", fontSize:16, fontWeight:700, outline:"none", fontFamily:"Inter,sans-serif", background:"#fff" }} />
        </div>
        <div style={{ background:"#FFFBEB", borderRadius:14, padding:14 }}>
          <div style={{ fontSize:12, color:"#92400E", lineHeight:1.7, fontFamily:"Inter,sans-serif" }}>
            💡 Günlük kalorisinin <strong>maksimum %10'u</strong> ödülden gelebilir. Fazlası obeziteye yol açar.
          </div>
        </div>
        <button onClick={calc} style={{ height:52, borderRadius:16, border:"none", background:"linear-gradient(135deg,#CA8A04,#FBBF24)", color:"#fff", fontSize:15, fontWeight:800, cursor:"pointer", fontFamily:"Inter,sans-serif" }}>Hesapla</button>
        {result !== null && (
          <ResultBox color="#CA8A04" bg="#FFFBEB">
            <div style={{ fontSize:13, color:"#888", marginBottom:4 }}>Günlük maksimum ödül kalori bütçesi</div>
            <div style={{ fontSize:52, fontWeight:900, color:"#CA8A04" }}>{result} kcal</div>
            <div style={{ fontSize:12, color:"#888", marginTop:8, lineHeight:1.6 }}>
              Bu miktarı aşmamak için ödül mama paketinin kalori bilgisini kontrol edin.
            </div>
            <button onClick={()=>setResult(null)} style={{ marginTop:12, display:"inline-flex", alignItems:"center", gap:6, background:"none", border:"none", color:"#CA8A04", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"Inter,sans-serif" }}>
              <RotateCcw size={13} /> Yeniden Hesapla
            </button>
          </ResultBox>
        )}
      </div>
    </div>
  );
}

/* ─── 10. Belirti Kontrolü ──────────────────────────────── */
const SYMPTOMS = [
  { id:"istahs",  label:"İştah kaybı (>24 saat)",           risk:2 },
  { id:"kusma",   label:"Kusma (2+ kez)",                    risk:2 },
  { id:"ishal",   label:"İshal (kanlı)",                     risk:3 },
  { id:"letarji", label:"Aşırı yorgunluk / uyku hali",       risk:2 },
  { id:"ofes",    label:"Nefes darlığı / hızlı nefes",       risk:3 },
  { id:"titreme", label:"Titreme veya nöbet",                 risk:3 },
  { id:"karin",   label:"Şiş karın / sertlik",               risk:3 },
  { id:"limp",    label:"Topallama (>12 saat)",               risk:2 },
  { id:"goz",     label:"Göz akıntısı / kızarıklık",         risk:1 },
  { id:"kas",     label:"Kaşıma / deri döküntüsü",           risk:1 },
  { id:"hapsi",   label:"Sık hapşırma / burun akıntısı",     risk:1 },
  { id:"idrar",   label:"İdrara çıkmama (>12 saat)",          risk:3 },
];

function BelirtiKontrol({ onBack }: { onBack:()=>void }) {
  const [, navigate] = useLocation();
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (id:string) => {
    const s = new Set(checked);
    s.has(id) ? s.delete(id) : s.add(id);
    setChecked(s);
  };

  const totalRisk = Array.from(checked).reduce((sum, id) => {
    const s = SYMPTOMS.find(s => s.id === id);
    return sum + (s ? s.risk : 0);
  }, 0);

  const level = totalRisk === 0 ? null : totalRisk <= 2 ? "low" : totalRisk <= 5 ? "medium" : "high";
  const levelConfig = {
    low:    { label:"Düşük Risk",         sub:"Belirtileri izleyin. Birkaç gün içinde geçmezse veterinere gidin.", color:"#22C55E", bg:"#F0FDF4", icon:"✅" },
    medium: { label:"Orta Risk",          sub:"24 saat içinde veteriner kontrolü önerilir.", color:"#F59E0B", bg:"#FFFBEB", icon:"⚠️" },
    high:   { label:"ACİL — Hemen Veterinere Gidin!", sub:"Seçilen belirtiler ciddi risk işareti. En kısa sürede veterinere başvurun.", color:"#EF4444", bg:"#FFF1F2", icon:"🚨" },
  };

  return (
    <div style={{ padding:"0 16px", paddingBottom:32 }}>
      <ToolHeader emoji="🩺" title="Belirti Kontrolü" desc="Belirtilere göre risk değerlendirmesi" onBack={onBack} />

      {/* Static disclaimer — always visible */}
      <div style={{ display:"flex", gap:9, alignItems:"flex-start", background:"#FFF7ED", borderRadius:13, padding:"11px 13px", marginBottom:16, border:"1.5px solid #FED7AA" }}>
        <AlertTriangle size={15} color="#D97706" style={{ flexShrink:0, marginTop:1 }}/>
        <p style={{ fontSize:12, color:"#92400E", margin:0, lineHeight:1.55, fontFamily:"Inter,sans-serif" }}>
          <strong>Bu araç tıbbi tavsiye yerine geçmez.</strong> Ciddi veya acil belirtilerde veterinerinize başvurun.
        </p>
      </div>

      <div style={{ background:"#EDE8FF", borderRadius:14, padding:12, marginBottom:16 }}>
        <div style={{ fontSize:12, color:"#7C3AFF", lineHeight:1.7, fontFamily:"Inter,sans-serif" }}>
          Poodle'ınızda gözlemlediğiniz belirtileri işaretleyin. <strong>!!!</strong> işareti acil duruma işaret eder.
        </div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:16 }}>
        {SYMPTOMS.map(s => (
          <button key={s.id} onClick={() => toggle(s.id)}
            style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", background: checked.has(s.id) ? "#FFF1F2" : "#FAFAFA", borderRadius:12, border:`1.5px solid ${checked.has(s.id)?"#FCA5A5":"#f0f0f0"}`, cursor:"pointer", textAlign:"left", transition:"all 0.15s" }}>
            {checked.has(s.id)
              ? <CheckCircle2 size={20} color="#EF4444" strokeWidth={2} style={{ flexShrink:0 }} />
              : <Circle size={20} color="#ddd" strokeWidth={2} style={{ flexShrink:0 }} />
            }
            <span style={{ fontSize:13, fontWeight:600, color: checked.has(s.id)?"#EF4444":"#333", fontFamily:"Inter,sans-serif" }}>{s.label}</span>
            <span style={{ marginLeft:"auto", fontSize:10, fontWeight:700, color:s.risk===3?"#EF4444":s.risk===2?"#F59E0B":"#22C55E", flexShrink:0 }}>
              {"!".repeat(s.risk)}
            </span>
          </button>
        ))}
      </div>

      {level && (() => {
        const c = levelConfig[level];
        return (
          <div style={{ background:c.bg, border:`2px solid ${c.color}`, borderRadius:18, padding:"20px" }}>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:32, marginBottom:8 }}>{c.icon}</div>
              <div style={{ fontSize:18, fontWeight:900, color:c.color, marginBottom:6, fontFamily:"Inter,sans-serif" }}>{c.label}</div>
              <div style={{ fontSize:13, color:"#555", lineHeight:1.6, fontFamily:"Inter,sans-serif" }}>{c.sub}</div>
            </div>
            {/* CTA for medium + high */}
            {(level === "high" || level === "medium") && (
              <div style={{ display:"flex", flexDirection:"column", gap:8, marginTop:16 }}>
                {level === "high" && (
                  <a href="tel:4441308"
                    style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, height:46, borderRadius:13, background:"#EF4444", color:"#fff", fontSize:14, fontWeight:800, textDecoration:"none", fontFamily:"Inter,sans-serif" }}>
                    <Phone size={16}/> Veteriner Acil Hattını Ara
                  </a>
                )}
                <button onClick={()=>navigate("/yourpoodle/ai-asistan")}
                  style={{ height:44, borderRadius:13, border:`1.5px solid ${c.color}`, background:"#fff", color:c.color, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"Inter,sans-serif" }}>
                  🤖 AI Asistana Sor
                </button>
              </div>
            )}
          </div>
        );
      })()}
      {checked.size > 0 && (
        <button onClick={() => setChecked(new Set())} style={{ marginTop:12, width:"100%", padding:"10px", borderRadius:12, border:"1.5px solid #f0f0f0", background:"#fff", color:"#aaa", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"Inter,sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
          <RotateCcw size={13} /> Temizle
        </button>
      )}
    </div>
  );
}

/* ─── 11. Diş Sağlığı ───────────────────────────────────── */
const DIS_CHECKS = [
  { id:"renk",  label:"Dişler beyaz / açık sarı (sarı-kahverengi değil)",  tip:"Tartar birikimi diş sarartır" },
  { id:"koku",  label:"Ağız kokusu yok / hafif",                           tip:"Ciddi koku periodontal hastalık işareti olabilir" },
  { id:"dis2",  label:"Kırık veya eksik diş yok",                          tip:"Kırık dişler ağrıya yol açabilir" },
  { id:"eti",   label:"Diş eti pembemsi ve sağlıklı (kırmızı/şiş değil)", tip:"Kırmızılık iltihaplanma işareti" },
  { id:"salya", label:"Aşırı salya yok",                                   tip:"Aşırı salya ağız sorunu belirtisi" },
  { id:"yeme",  label:"Katı mamaları / oyuncakları rahat çiğniyor",        tip:"Çiğneme güçlüğü ağrıya işaret eder" },
  { id:"firca", label:"Bu hafta en az 1 kez fırçalandı",                   tip:"İdeal: her gün veya gün aşırı" },
];

function DisSagligi({ onBack }: { onBack:()=>void }) {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (id:string) => {
    const s = new Set(checked);
    s.has(id) ? s.delete(id) : s.add(id);
    setChecked(s);
  };

  const score = checked.size;
  const pct   = Math.round((score / DIS_CHECKS.length) * 100);
  const color = pct >= 80 ? "#22C55E" : pct >= 50 ? "#F59E0B" : "#EF4444";

  return (
    <div style={{ padding:"0 16px", paddingBottom:32 }}>
      <ToolHeader emoji="😁" title="Diş Sağlığı" desc="Ağız sağlığı kontrol listesi" onBack={onBack} />
      {score > 0 && (
        <div style={{ background:"#F0F0F0", borderRadius:12, overflow:"hidden", marginBottom:16, height:10 }}>
          <div style={{ height:"100%", width:`${pct}%`, background:color, borderRadius:12, transition:"width 0.3s" }} />
        </div>
      )}
      <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
        {DIS_CHECKS.map(d => (
          <button key={d.id} onClick={() => toggle(d.id)}
            style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"12px 14px", background: checked.has(d.id)?"#F0FDF4":"#FAFAFA", borderRadius:12, border:`1.5px solid ${checked.has(d.id)?"#86EFAC":"#f0f0f0"}`, cursor:"pointer", textAlign:"left", transition:"all 0.15s" }}>
            {checked.has(d.id)
              ? <CheckCircle2 size={20} color="#22C55E" strokeWidth={2} style={{ flexShrink:0, marginTop:1 }} />
              : <Circle size={20} color="#ddd" strokeWidth={2} style={{ flexShrink:0, marginTop:1 }} />
            }
            <div>
              <div style={{ fontSize:13, fontWeight:600, color: checked.has(d.id)?"#16A34A":"#333", fontFamily:"Inter,sans-serif", marginBottom:2 }}>{d.label}</div>
              <div style={{ fontSize:11, color:"#aaa", fontFamily:"Inter,sans-serif" }}>{d.tip}</div>
            </div>
          </button>
        ))}
      </div>
      {score > 0 && (
        <ResultBox color={color} bg={pct>=80?"#F0FDF4":pct>=50?"#FFFBEB":"#FFF1F2"}>
          <div style={{ fontSize:13, color:"#888", marginBottom:4 }}>Diş sağlığı skoru</div>
          <div style={{ fontSize:48, fontWeight:900, color }}>{pct}%</div>
          <div style={{ fontSize:13, color:"#555", marginTop:8, fontFamily:"Inter,sans-serif" }}>
            {pct >= 80 ? "Mükemmel! Ağız sağlığı çok iyi 😁" :
             pct >= 50 ? "Orta düzey — fırçalama sıklığını artırın 🪥" :
             "Veterinere diş kontrolü için gidilmesi önerilir 🏥"}
          </div>
        </ResultBox>
      )}
    </div>
  );
}

/* ─── 12. Dışkı Rehberi ─────────────────────────────────── */
const DISKI_RENK = [
  { renk:"Kahverengi (açık-orta)",  ok:true,  anlam:"Normal — Sağlıklı sindirim", kıvam:"Firmalığını koruyor, şekil veriliyor" },
  { renk:"Koyu kahverengi / siyah", ok:false, anlam:"⚠️ İç kanama veya kan yutma olabilir", kıvam:"Veterinere gidin" },
  { renk:"Kırmızı / kanlı",         ok:false, anlam:"🚨 Alt GI kanaması — Acil", kıvam:"Hemen veterinere" },
  { renk:"Sarı / turuncu",           ok:false, anlam:"⚠️ Karaciğer / safra sorunu olabilir", kıvam:"48 saat içinde veterinere" },
  { renk:"Yeşil",                    ok:false, anlam:"⚠️ Çim yenilmiş veya safra sorunu", kıvam:"İzleyin, tekrarlarsa gidin" },
  { renk:"Gri / bej",                ok:false, anlam:"⚠️ Pankreas veya safra kesesi sorunu", kıvam:"Veterinere gidin" },
  { renk:"Beyaz / çok açık",         ok:false, anlam:"⚠️ Kemik fazlalığı veya kalsiyum", kıvam:"Diyeti gözden geçirin" },
];

function DiskiRehberi({ onBack }: { onBack:()=>void }) {
  const [selected, setSelected] = useState<number|null>(null);

  return (
    <div style={{ padding:"0 16px", paddingBottom:32 }}>
      <ToolHeader emoji="📊" title="Dışkı Rehberi" desc="Renk ve kıvamına göre değerlendirme" onBack={onBack} />
      <div style={{ background:"#FEFCE8", borderRadius:14, padding:12, marginBottom:16 }}>
        <div style={{ fontSize:12, color:"#92400E", lineHeight:1.7, fontFamily:"Inter,sans-serif" }}>
          Poodle'ınızın dışkısının rengini aşağıdan seçin. Tek seferlik anormal renk panik yaratmamalı, tekrarlanması önemli.
        </div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {DISKI_RENK.map((d, i) => (
          <button key={i} onClick={() => setSelected(selected === i ? null : i)}
            style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", background: selected===i ? (d.ok?"#F0FDF4":"#FFF1F2") : "#FAFAFA", borderRadius:12, border:`1.5px solid ${selected===i?(d.ok?"#86EFAC":"#FCA5A5"):"#f0f0f0"}`, cursor:"pointer", textAlign:"left", transition:"all 0.15s" }}>
            <div style={{ width:24, height:24, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
              {d.ok ? <CheckCircle2 size={22} color="#22C55E" /> : <AlertTriangle size={20} color={selected===i?"#EF4444":"#aaa"} />}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color: selected===i?(d.ok?"#16A34A":"#DC2626"):"#333", fontFamily:"Inter,sans-serif", marginBottom: selected===i?4:0 }}>{d.renk}</div>
              {selected === i && (
                <>
                  <div style={{ fontSize:12, color:"#555", fontFamily:"Inter,sans-serif", marginBottom:2 }}>{d.anlam}</div>
                  <div style={{ fontSize:11, color:"#888", fontFamily:"Inter,sans-serif" }}>{d.kıvam}</div>
                </>
              )}
            </div>
            <ChevronLeft size={14} color="#ccc" style={{ transform: selected===i?"rotate(-90deg)":"rotate(180deg)", transition:"transform 0.2s", flexShrink:0 }} />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Tool → Component map ──────────────────────────────── */
const TOOL_SCREENS: Record<string, React.ComponentType<{ onBack:()=>void }>> = {
  mama:     MamaCalculator,
  su:       SuHesabi,
  aktivite: AktiviteHesabi,
  yas:      YasHesaplama,
  insanyas: InsanYasTablosu,
  asi:      AsiTakvimi,
  kilo:     IdealKilo,
  tiras:    TirasZamani,
  odul:     OdulHesabi,
  hastalik: BelirtiKontrol,
  dis:      DisSagligi,
  diski:    DiskiRehberi,
};

/* ─── Main Page ─────────────────────────────────────────── */
export default function BilgiBankasi() {
  const [, navigate] = useLocation();

  // Read ?tool= param on first render (lazy initializer)
  const [activeTool, setActiveTool] = useState<string|null>(() => {
    const slug = new URLSearchParams(window.location.search).get("tool");
    return slug ? (SLUG_TO_ID[slug] ?? null) : null;
  });
  const [activeCat, setActiveCat] = useState<string>("all");
  const [search, setSearch] = useState("");

  // Open tool: update state + URL
  const openTool = (id: string) => {
    setActiveTool(id);
    window.history.pushState(null, "", `?tool=${ID_TO_SLUG[id] ?? id}`);
    window.scrollTo({ top:0, behavior:"smooth" });
  };

  // Close tool: clear state + URL
  const closeTool = () => {
    setActiveTool(null);
    window.history.pushState(null, "", window.location.pathname);
    window.scrollTo({ top:0, behavior:"smooth" });
  };

  // Browser back button support
  useEffect(() => {
    const handler = () => {
      const slug = new URLSearchParams(window.location.search).get("tool");
      setActiveTool(slug ? (SLUG_TO_ID[slug] ?? null) : null);
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  // SEO — single set, no duplicates
  useEffect(() => {
    const toolLabel = activeTool ? TOOLS.find(t=>t.id===activeTool)?.label : null;
    document.title = toolLabel
      ? `${toolLabel} — Poodle Hesaplama Aracı | YourPoodle`
      : "Poodle Bilgi Bankası — 12 Ücretsiz Hesaplama Aracı | YourPoodle";

    const setMeta = (attr: string, key: string, val: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement|null;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
      el.content = val;
    };
    setMeta("name","description","Toy Poodle için 12 pratik araç: mama hesaplama, su ihtiyacı, yaş çevirici, aşı takvimi, ideal kilo, belirti kontrolü, tıraş zamanı. Ücretsiz, anlık sonuç.");
    setMeta("property","og:title","Poodle Bilgi Bankası | YourPoodle");
    setMeta("property","og:description","12 ücretsiz poodle aracı: mama, yaş, aşı, belirti kontrolü ve daha fazlası.");
    setMeta("property","og:type","website");
    setMeta("property","og:url","https://www.yourpoodle.com/yourpoodle/bilgi");
    // Remove stale duplicates
    document.querySelectorAll('meta[property="og:type"]').forEach((el,i) => { if(i>0) el.remove(); });
    document.querySelectorAll('meta[property="og:title"]').forEach((el,i) => { if(i>0) el.remove(); });
    const oldTitle = document.head.querySelector("title");
    if (oldTitle) oldTitle.remove();
  }, [activeTool]);

  // Category + search filter
  const catIds = TOOL_CATS.find(c=>c.id===activeCat)?.ids ?? null;
  const filtered = TOOLS.filter(t => {
    if (catIds && !catIds.includes(t.id)) return false;
    return tokenSearch(search, t.label, t.desc);
  });

  const ActiveScreen = activeTool ? TOOL_SCREENS[activeTool] : null;
  const activeToolMeta = activeTool ? TOOLS.find(t=>t.id===activeTool) : null;

  // Structured data schemas
  const webAppSchema = {
    "@context":"https://schema.org",
    "@type":"WebApplication",
    "name":"Poodle Bilgi Bankası",
    "applicationCategory":"HealthApplication",
    "operatingSystem":"Web",
    "url":"https://www.yourpoodle.com/yourpoodle/bilgi",
    "offers":{"@type":"Offer","price":"0","priceCurrency":"TRY"},
    "featureList":TOOLS.map(t=>t.label),
  };
  const itemListSchema = {
    "@context":"https://schema.org",
    "@type":"ItemList",
    "name":"Poodle Hesaplama Araçları",
    "numberOfItems":12,
    "itemListElement": TOOLS.map((t,i)=>({
      "@type":"ListItem",
      "position":i+1,
      "name":t.label,
      "description":t.desc,
      "url":`https://www.yourpoodle.com/yourpoodle/bilgi?tool=${ID_TO_SLUG[t.id]??t.id}`,
    })),
  };
  const howToSchema = {
    "@context":"https://schema.org",
    "@type":"HowTo",
    "name":"Toy Poodle Mama Miktarı Nasıl Hesaplanır?",
    "step":[
      {"@type":"HowToStep","text":"Poodle'ın kilosunu (kg) girin"},
      {"@type":"HowToStep","text":"Yaş grubunu seçin (Yavru/Yetişkin/Yaşlı)"},
      {"@type":"HowToStep","text":"Aktivite seviyesini seçin (Düşük/Orta/Yüksek)"},
      {"@type":"HowToStep","text":"'Hesapla' butonuna tıklayın ve günlük gram miktarını görün"},
    ],
  };
  const faqSchema = {
    "@context":"https://schema.org",
    "@type":"FAQPage",
    "mainEntity":[
      {"@type":"Question","name":"Toy poodle günde ne kadar mama yer?","acceptedAnswer":{"@type":"Answer","text":"Ortalama 3–4 kg ağırlığındaki toy poodle için günlük ~85–100g kuru mama önerilir. Yaş, aktivite seviyesi ve mama markasına göre değişir. Mama Hesaplama aracımızla kişisel miktarı öğrenebilirsiniz."}},
      {"@type":"Question","name":"Poodle yaşını insan yaşına nasıl çeviririm?","acceptedAnswer":{"@type":"Answer","text":"Küçük ırklar için: 1. yıl = 15 insan yılı, 2. yıl = +9, sonraki her yıl +4. Örneğin 4 yaşındaki toy poodle ≈ 32 insan yaşına karşılık gelir."}},
      {"@type":"Question","name":"Poodle aşı takvimi nasıl olmalı?","acceptedAnswer":{"@type":"Answer","text":"6. haftada Karma Aşı 1, 9. haftada Karma Aşı 2, 12. haftada Karma Aşı 3 + Kuduz, 16. haftada son temel doz. Ardından yılda bir hatırlatma. Detaylı takvim için Aşı Takvimi aracını kullanın."}},
      {"@type":"Question","name":"Poodle belirtileri ne zaman tehlikelidir?","acceptedAnswer":{"@type":"Answer","text":"Nefes darlığı, titreme/nöbet, kanlı ishal, idrara çıkmama, şiş karın gibi belirtiler ACİL duruma işaret eder. Belirti Kontrolü aracımız risk değerlendirmesi yapar; ciddi belirtilerde hemen veterinere başvurun."}},
    ],
  };

  return (
    <YPLayout activeLink="/yourpoodle/bilgi" bottomNavActive="/yourpoodle/bilgi">
      <style>{CSS + `
        .bilgi-cats::-webkit-scrollbar{display:none}
        .bilgi-cats{-ms-overflow-style:none;scrollbar-width:none}
        @media(min-width:1024px){.yp-tools-grid{grid-template-columns:repeat(4,1fr)!important}}
        @media(min-width:768px) and (max-width:1023px){.yp-tools-grid{grid-template-columns:repeat(3,1fr)!important}}
        @media(min-width:640px) and (max-width:767px){.yp-tools-grid{grid-template-columns:repeat(3,1fr)!important}}
      `}</style>

      {/* Structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(webAppSchema)}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(itemListSchema)}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(howToSchema)}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faqSchema)}} />

      <div style={{ background:"#fff", fontFamily:"Inter,sans-serif" }}>

        {/* ── ACTIVE TOOL VIEW ─────────────────────────── */}
        {ActiveScreen ? (
          <div style={{ paddingBottom:80 }}>
            {/* Breadcrumb inside tool */}
            <div style={{ display:"flex", alignItems:"center", gap:5, padding:"10px 16px", borderBottom:"1px solid #f5f5f5", background:"#fafafa" }}>
              <button onClick={()=>navigate("/yourpoodle")} style={{ background:"none",border:"none",cursor:"pointer",color:"#888",fontSize:12,fontFamily:"Inter,sans-serif",padding:0 }}>Ana Sayfa</button>
              <ChevronRight size={12} color="#bbb"/>
              <button onClick={closeTool} style={{ background:"none",border:"none",cursor:"pointer",color:"#7C3AFF",fontSize:12,fontFamily:"Inter,sans-serif",padding:0,fontWeight:700 }}>Bilgi Bankası</button>
              <ChevronRight size={12} color="#bbb"/>
              <span style={{ fontSize:12, color:"#333", fontWeight:700, fontFamily:"Inter,sans-serif" }}>{activeToolMeta?.label}</span>
            </div>
            <ActiveScreen onBack={closeTool} />
          </div>
        ) : (
          <>
            {/* Hero banner */}
            <div className="yp-hero-banner" style={{ background:"linear-gradient(135deg,#7C3AFF,#A855F7)", padding:"26px 24px 30px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:-30, right:-20, width:130, height:130, borderRadius:"50%", background:"rgba(255,255,255,0.08)" }} />
              <div style={{ fontSize:36, marginBottom:10 }}>⚡</div>
              <h1 style={{ fontSize:24, fontWeight:900, color:"#fff", marginBottom:5, lineHeight:1.2 }}>Poodle Bilgi Bankası</h1>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.85)", marginBottom:16 }}>Poodle'ınız için {TOOLS.length} pratik araç</p>
              <div style={{ display:"flex", gap:20 }}>
                {[["12","Araç"],["Ücretsiz","Kullan"],["Anlık","Sonuç"]].map(([n,l]) => (
                  <div key={l}><div style={{ fontSize:14, fontWeight:900, color:"#fff" }}>{n}</div><div style={{ fontSize:10, color:"rgba(255,255,255,0.72)" }}>{l}</div></div>
                ))}
              </div>
            </div>

            {/* Breadcrumb */}
            <div style={{ display:"flex", alignItems:"center", gap:5, padding:"10px 16px", borderBottom:"1px solid #f5f5f5" }}>
              <button onClick={()=>navigate("/yourpoodle")} style={{ background:"none",border:"none",cursor:"pointer",color:"#888",fontSize:12,fontFamily:"Inter,sans-serif",padding:0 }}>Ana Sayfa</button>
              <ChevronRight size={12} color="#bbb"/>
              <span style={{ fontSize:12, color:"#333", fontWeight:700, fontFamily:"Inter,sans-serif" }}>Bilgi Bankası</span>
            </div>

            {/* Search */}
            <div style={{ padding:"16px 16px 0" }}>
              <div style={{ display:"flex", alignItems:"center", background:"#F7F7F7", border:"1.5px solid #ececec", borderRadius:14, height:48, overflow:"hidden" }}>
                <div style={{ paddingLeft:14, color:"#bbb", display:"flex" }}><Search size={18} strokeWidth={2} /></div>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Araç ara... (mama, yaş, aşı...)"
                  style={{ flex:1, border:"none", outline:"none", fontSize:13.5, fontWeight:600, color:"#333", background:"transparent", padding:"0 10px", fontFamily:"Inter,sans-serif" }} />
                {search && (
                  <button onClick={() => setSearch("")} style={{ background:"none", border:"none", cursor:"pointer", paddingRight:12, color:"#bbb" }}>
                    <X size={16} strokeWidth={2} />
                  </button>
                )}
              </div>
            </div>

            {/* Category chips */}
            <div className="bilgi-cats" style={{ display:"flex", gap:8, padding:"12px 16px", overflowX:"auto" }}>
              {TOOL_CATS.map(c => (
                <button key={c.id} onClick={()=>{ setActiveCat(c.id); setSearch(""); }}
                  style={{ whiteSpace:"nowrap", padding:"8px 16px", borderRadius:20, border:"2px solid", borderColor:activeCat===c.id?"#7C3AFF":"#e8e8e8", background:activeCat===c.id?"#7C3AFF":"#fff", color:activeCat===c.id?"#fff":"#555", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"Inter,sans-serif", transition:"all 0.15s" }}>
                  {c.label}
                </button>
              ))}
            </div>

            {/* Tool grid */}
            <div style={{ padding:"0 16px" }}>
              {filtered.length === 0 ? (
                <div style={{ textAlign:"center", padding:"48px 24px", color:"#aaa" }}>
                  <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
                  <div style={{ fontSize:15, fontWeight:700, color:"#555", marginBottom:6 }}>Araç bulunamadı</div>
                  <div style={{ fontSize:13 }}>"{search}" ile eşleşen araç yok.</div>
                  <button onClick={() => { setSearch(""); setActiveCat("all"); }} style={{ marginTop:16, padding:"10px 24px", borderRadius:20, background:"#7C3AFF", color:"#fff", border:"none", cursor:"pointer", fontSize:13, fontWeight:700, fontFamily:"Inter,sans-serif" }}>Tümünü Göster</button>
                </div>
              ) : (
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"20px 8px", paddingBottom:12 }} className="yp-tools-grid">
                  {filtered.map(t => (
                    <button key={t.id} className="tool-card" onClick={() => openTool(t.id)}
                      style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, background:"none", border:"none", cursor:"pointer", padding:0, textAlign:"center" }}>
                      <div style={{ width:60, height:60, borderRadius:"50%", background:t.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>{t.emoji}</div>
                      <div>
                        <div style={{ fontSize:11.5, fontWeight:800, color:"#1a1a1a", lineHeight:1.3, marginBottom:3 }}>{t.label}</div>
                        <div style={{ fontSize:10, color:"#888", lineHeight:1.35 }}>{t.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Static SEO content — crawler-visible */}
            <section style={{ padding:"32px 16px 0", borderTop:"1px solid #f0f0f0", marginTop:24 }}>
              <h2 style={{ fontSize:17, fontWeight:800, color:"#1a1a1a", marginBottom:10 }}>Poodle Hesaplama Araçları</h2>
              <p style={{ fontSize:13, color:"#555", lineHeight:1.7, marginBottom:16 }}>
                YourPoodle Bilgi Bankası, toy poodle sahipleri için 12 ücretsiz, anlık hesaplama aracı sunar.
                Mama miktarından aşı takvimine, yaş hesaplamadan belirti kontrolüne kadar her araç bilimsel formüllere dayanır.
              </p>
              {/* AI-crawler-friendly tool list */}
              <ul aria-label="Tüm poodle araçları" style={{ listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:6 }}>
                {TOOLS.map(t => (
                  <li key={t.id} style={{ fontSize:12.5, color:"#444", lineHeight:1.5 }}>
                    <button onClick={()=>openTool(t.id)} style={{ background:"none",border:"none",cursor:"pointer",textAlign:"left",padding:0,color:"#7C3AFF",fontWeight:700,fontFamily:"Inter,sans-serif",fontSize:12.5 }}>
                      {t.emoji} {t.label}
                    </button>{" "}— {t.desc}
                  </li>
                ))}
              </ul>
              <p style={{ fontSize:12, color:"#888", marginTop:8 }}>
                Örnek: 3.5 kg yetişkin toy poodle, orta aktivite → ~85 g mama/gün · 2 yaşındaki toy poodle → ~24 insan yaşı
              </p>
            </section>

            {/* SSS — FAQPage schema ile eşleşen */}
            <section style={{ padding:"24px 16px 32px" }}>
              <h2 style={{ fontSize:16, fontWeight:800, color:"#1a1a1a", marginBottom:12 }}>Sık Sorulan Sorular</h2>
              {[
                ["Toy poodle günde ne kadar mama yer?","Ortalama 3–4 kg ağırlığındaki toy poodle için günlük ~85–100 g kuru mama önerilir. Yaş, aktivite seviyesi ve mama markasına göre değişir. Mama Hesaplama aracımızla kişisel miktarı öğrenebilirsiniz."],
                ["Poodle yaşını insan yaşına nasıl çeviririm?","Küçük ırklar için: 1. yıl = 15 insan yılı, 2. yıl = +9, sonraki her yıl +4. 4 yaşındaki toy poodle ≈ 32 insan yaşına karşılık gelir."],
                ["Poodle aşı takvimi nasıl olmalı?","6. haftada Karma Aşı 1, 9. haftada Karma Aşı 2, 12. haftada Karma Aşı 3 + Kuduz, 16. haftada son temel doz. Ardından yılda bir hatırlatma."],
                ["Poodle belirtileri ne zaman tehlikelidir?","Nefes darlığı, titreme/nöbet, kanlı ishal, idrara çıkmama veya şiş karın ACİL duruma işaret eder. Belirti Kontrolü aracımız risk değerlendirmesi yapar."],
              ].map(([q,a])=>(
                <div key={q} style={{ marginBottom:14, background:"#FAFAFA", borderRadius:13, padding:"14px 16px" }}>
                  <div style={{ fontSize:13.5, fontWeight:800, color:"#1a1a1a", marginBottom:5 }}>❓ {q}</div>
                  <div style={{ fontSize:13, color:"#555", lineHeight:1.65 }}>{a}</div>
                </div>
              ))}
            </section>

            {/* Footer */}
            <footer style={{ background:"#111", padding:"28px 20px 24px" }}>
              <div style={{ display:"flex", gap:32, flexWrap:"wrap", marginBottom:20 }}>
                {[
                  ["Platform",["Ana Sayfa:/yourpoodle","Mağaza:/yourpoodle/magaza","AI Asistan:/yourpoodle/ai-asistan","Rehber:/yourpoodle/rehber"]],
                  ["Destek",["Hakkımızda:/yourpoodle","İletişim:/yourpoodle","Bakım:/yourpoodle/bakim","Sağlık:/yourpoodle/saglik"]],
                  ["Yasal",["Gizlilik & KVKK:/yourpoodle","Çerez Politikası:/yourpoodle","Kullanım Şartları:/yourpoodle"]],
                ].map(([title,links])=>(
                  <div key={title as string}>
                    <div style={{ fontSize:11, fontWeight:800, color:"#888", marginBottom:10, letterSpacing:"0.08em", textTransform:"uppercase" }}>{title as string}</div>
                    {(links as string[]).map(l=>{
                      const [label,href]=l.split(":");
                      return <button key={label} onClick={()=>navigate(href)} style={{ display:"block",background:"none",border:"none",cursor:"pointer",color:"#bbb",fontSize:12,fontFamily:"Inter,sans-serif",marginBottom:7,padding:0,textAlign:"left" }}>{label}</button>;
                    })}
                  </div>
                ))}
              </div>
              <div style={{ fontSize:11, color:"#555", borderTop:"1px solid #222", paddingTop:16 }}>
                © 2026 YourPoodle · Toy Poodle sahipleri için Türkiye'nin ilk dijital platformu
              </div>
            </footer>
          </>
        )}
      </div>
    </YPLayout>
  );
}
