import { useState, useRef } from "react";
import { useLocation } from "wouter";
import {
  Search, ShoppingBag, ChevronDown, Menu, X,
  Home, Users, BookOpen, Monitor, Clock, ChevronRight,
  ArrowLeft, Heart, Share2,
} from "lucide-react";

/* ─── Data ─────────────────────────────────────────────── */

const LANGUAGES = [
  { code:"TR", flag:"🇹🇷" }, { code:"EN", flag:"🇺🇸" }, { code:"DE", flag:"🇩🇪" },
  { code:"FR", flag:"🇫🇷" }, { code:"RU", flag:"🇷🇺" }, { code:"AR", flag:"🇸🇦" },
];

const CATS = ["Tümü","Beslenme","Sağlık","Bakım","Eğitim","Davranış","Üreme"];

interface Article {
  emoji:string; cat:string; title:string; min:number; views:string;
  featured:boolean; author:string; body:string;
}

const ARTICLES: Article[] = [
  { emoji:"🍖", cat:"Beslenme",  featured:true,  min:5,  views:"2.4B",
    title:"Toy Poodle İçin En İyi Mama Markaları 2024",
    author:"Dr. Ayşe Kaya — Veteriner Hekimi",
    body:"Royal Canin Poodle formülü, yaşa özel besin değerleriyle öne çıkıyor. Hill's Science Plan ve Pro Plan da Poodle'ların küçük ağız yapısına uygun kibble boyutuyla dikkat çekiyor. Tahılsız seçenekler için Orijen ve Acana tercih edilebilir. Günlük kalori ihtiyacı: yetişkin Toy Poodle (3 kg) için yaklaşık 200–240 kcal." },

  { emoji:"✂️", cat:"Bakım",     featured:true,  min:8,  views:"1.8B",
    title:"Evde Poodle Tıraşı: Adım Adım Rehber",
    author:"Selin Demir — Grooming Uzmanı",
    body:"Teddy bear kesimi için önce banyo, kurutma, ardından makasla şekillendirme adımlarını takip edin. Kulak temizliği tıraş öncesi yapılmalıdır. Gerekli ekipman: slicker fırça, matlaştırıcı sprey, profesyonel makas seti ve tıraş makinesi. Her 6–8 haftada bir tam tıraş önerilir." },

  { emoji:"💊", cat:"Sağlık",    featured:false, min:6,  views:"3.1B",
    title:"Poodle'larda Görülen 10 Yaygın Sağlık Sorunu",
    author:"Dr. Murat Yılmaz — Dahiliye Uzmanı",
    body:"Addison hastalığı, tiroid sorunları ve göz yaşı lekeleri Poodle'larda en sık görülen rahatsızlıkların başında gelir. Ayrıca patellar luksasyon, ilerleyici retinal atrofi (PRA) ve epilepsi genetik risk faktörleri arasındadır. Yılda iki kez veteriner kontrolü kritik öneme sahiptir." },

  { emoji:"🐾", cat:"Eğitim",    featured:false, min:10, views:"980B",
    title:"Poodle'ınıza Temel Komutları Nasıl Öğretirsiniz?",
    author:"Cem Arslan — Köpek Eğitmeni",
    body:"Otur, gel, dur, bırak komutlarını pozitif pekiştirme ile 2–4 hafta içinde öğretebilirsiniz. Günlük 10 dakika tutarlı antrenman yeterli. Poodle'lar yüksek zeka düzeyi sayesinde köpek türleri arasında en hızlı öğrenenlerden biridir; sıkılmamak için egzersizleri çeşitlendirin." },

  { emoji:"❤️", cat:"Davranış",  featured:false, min:7,  views:"1.2B",
    title:"Poodle Anksiyetesi: Belirtiler ve Çözüm Yolları",
    author:"Dr. Zeynep Acar — Veteriner Davranış Uzmanı",
    body:"Ayrılık anksiyetesi belirtileri: sürekli havlama, kapı önünde bekleme, eşya çiğneme. KONG oyuncağı ve Adaptil diffuser ilk adımlar olarak önerilir. Desensitizasyon protokolü için bir davranış uzmanıyla çalışmak uzun vadede en etkili yöntemdir." },

  { emoji:"🏥", cat:"Sağlık",    featured:false, min:9,  views:"760B",
    title:"Poodle'larda Kalça Displazisi: Erken Teşhis",
    author:"Dr. Ali Öztürk — Ortopedi Uzmanı",
    body:"OFA sertifikasyonlu ebeveynlerden doğan yavruları tercih edin. 6 aylık kontrollerde röntgen çektirerek erken tarama yapılabilir. Eklem takviyesi için balık yağı ve glukozamin içeren mamalar destekleyici rol oynar. Ağır vakalarda cerrahi müdahale gerekebilir." },

  { emoji:"🛁", cat:"Bakım",     featured:false, min:5,  views:"1.5B",
    title:"Poodle Tüy Bakımı: Haftalık Rutin Rehberi",
    author:"Selin Demir — Grooming Uzmanı",
    body:"Haftada en az 3 kez slicker fırçayla tarama, 4–6 haftada bir profesyonel tıraş ve 2 haftada bir banyo standart bakım rutinidir. Pin fırça yerine slicker tercih edin; mat önlemek için köklere kadar tarayın. Kulak kıllarını 3–4 haftada bir aldırın." },

  { emoji:"🥩", cat:"Beslenme",  featured:false, min:6,  views:"890B",
    title:"Yavru Poodle Beslenmesi: İlk 12 Ay",
    author:"Dr. Ayşe Kaya — Veteriner Hekimi",
    body:"8 haftaya kadar annesinden emzirme / mama geçişi, 8–16 hafta arası günde 3 öğün yavru maması, 6 aydan itibaren 2 öğüne geçiş. Yetişkin mamaya geçiş 12. ayda yapılmalı. Porsiyonları tartarak verin; aşırı yemek iskelet gelişimini olumsuz etkiler." },

  { emoji:"🎓", cat:"Eğitim",    featured:false, min:8,  views:"640B",
    title:"Clicker Eğitimi ile Hızlı Öğrenme Teknikleri",
    author:"Cem Arslan — Köpek Eğitmeni",
    body:"Clicker sesi ile ödülü eşleştirin (50 tekrar), ardından istenen davranışı capture ya da shaping yöntemiyle pekiştirin. Mark & reward döngüsü 50–100 tekrarda otomatik hale gelir. Poodle'lar hata toleransı yüksek köpeklerdir; asla olumsuz pekiştirme kullanmayın." },

  { emoji:"🐣", cat:"Üreme",     featured:false, min:7,  views:"520B",
    title:"Poodle'da İlk Kızgınlık ve Doğru Çiftleştirme Zamanı",
    author:"Dr. Murat Yılmaz — Dahiliye Uzmanı",
    body:"Dişi Toy Poodle'larda ilk kızgınlık 6–12 ay arasında görülür. Sağlıklı çiftleştirme için en az 2. ya da 3. kızgınlığı beklemeniz tavsiye edilir. Progesteron testi ile ovulasyon zamanını doğru tespit etmek gebelik başarısını önemli ölçüde artırır." },

  { emoji:"🍼", cat:"Üreme",     featured:false, min:6,  views:"430B",
    title:"Poodle Yavrularına İlk Günlerde Bakım",
    author:"Dr. Zeynep Acar — Veteriner Davranış Uzmanı",
    body:"İlk 2 haftada göz ve kulak kapalıdır; ısı düzenlemesi tamamen anneye bağlıdır. 2. haftadan itibaren yavaş yavaş çevre keşfine başlarlar. İlk aşılar 6–8. haftadan itibaren planlanır; sosyalizasyon penceresi 3–12 hafta arasıdır ve bu dönem kritik önem taşır." },
];

const DRAWER_LINKS = [
  { label:"Ana Sayfa",    href:"/" },
  { label:"Rehber",       href:"/yourpoodle/rehber" },
  { label:"Bilgi Bankası",href:"/yourpoodle/bilgi" },
  { label:"Mağaza",       href:"/yourpoodle/magaza" },
  { label:"Club",         href:"/yourpoodle/club" },
  { label:"Mama",         href:"/yourpoodle/magaza" },
  { label:"Eğitim",       href:"/yourpoodle/rehber" },
  { label:"Sağlık",       href:"/yourpoodle/rehber" },
  { label:"Bakım",        href:"/yourpoodle/rehber" },
];

/* ─── Bottom Nav ────────────────────────────────────────── */

function BottomNav({ active }: { active:string }) {
  const [, navigate] = useLocation();
  const left  = [
    { label:"Ana Sayfa", href:"/",                  Icon: Home },
    { label:"Club",      href:"/yourpoodle/club",    Icon: Users },
  ];
  const right = [
    { label:"Rehber",        href:"/yourpoodle/rehber", Icon: BookOpen },
    { label:"Bilgi Bankası", href:"/yourpoodle/bilgi",  Icon: Monitor },
  ];
  return (
    <nav style={{ position:"fixed", bottom:0, left:0, right:0, background:"#fff", borderTop:"1px solid #f0f0f0", boxShadow:"0 -4px 20px rgba(0,0,0,0.08)", height:64, display:"flex", alignItems:"center", zIndex:200, padding:"0 8px" }}>
      {left.map(({ label, href, Icon }) => (
        <button key={label} onClick={() => navigate(href)}
          style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, background:"none", border:"none", cursor:"pointer", flex:1, color: active===label ? "#7C3AFF" : "#aaa" }}>
          <Icon size={22} strokeWidth={2} />
          <span style={{ fontSize:10, fontWeight: active===label ? 800 : 700, fontFamily:"Inter,sans-serif" }}>{label}</span>
          {active===label && <div style={{ width:20, height:2.5, borderRadius:2, background:"#7C3AFF" }} />}
        </button>
      ))}
      {/* Centre Sepet */}
      <button onClick={() => navigate("/yourpoodle/magaza")}
        style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, background:"none", border:"none", cursor:"pointer", flex:1, position:"relative" }}>
        <div style={{ width:54, height:54, borderRadius:"50%", background:"linear-gradient(135deg,#9B59FF,#7C3AFF)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 6px 20px rgba(124,58,255,0.4)", position:"absolute", top:-24 }}>
          <ShoppingBag size={24} color="#fff" strokeWidth={2.2} />
        </div>
        <span style={{ fontSize:10, fontWeight:700, color:"#aaa", fontFamily:"Inter,sans-serif", marginTop:32 }}>Sepet</span>
      </button>
      {right.map(({ label, href, Icon }) => (
        <button key={label} onClick={() => navigate(href)}
          style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, background:"none", border:"none", cursor:"pointer", flex:1, color: active===label ? "#7C3AFF" : "#aaa" }}>
          <Icon size={22} strokeWidth={2} />
          <span style={{ fontSize:10, fontWeight: active===label ? 800 : 700, fontFamily:"Inter,sans-serif" }}>{label}</span>
          {active===label && <div style={{ width:20, height:2.5, borderRadius:2, background:"#7C3AFF" }} />}
        </button>
      ))}
    </nav>
  );
}

/* ─── Article Detail Panel ──────────────────────────────── */

function ArticleDetail({ article, onClose }: { article:Article; onClose:() => void }) {
  const [liked, setLiked] = useState(false);
  return (
    <div style={{ position:"fixed", inset:0, zIndex:500, display:"flex", flexDirection:"column" }}>
      <div onClick={onClose} style={{ flex:1, background:"rgba(0,0,0,0.4)" }} />
      <div style={{ background:"#fff", borderRadius:"24px 24px 0 0", maxHeight:"85vh", display:"flex", flexDirection:"column" }}>
        {/* Handle */}
        <div style={{ display:"flex", justifyContent:"center", paddingTop:10, paddingBottom:6 }}>
          <div style={{ width:36, height:4, borderRadius:2, background:"#e0e0e0" }} />
        </div>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 16px 12px" }}>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:6, color:"#555", fontFamily:"Inter,sans-serif", fontSize:14, fontWeight:600 }}>
            <ArrowLeft size={18} strokeWidth={2} /> Geri
          </button>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={() => setLiked(l => !l)} style={{ background:"none", border:"none", cursor:"pointer" }}>
              <Heart size={20} color={liked ? "#FF4566" : "#bbb"} fill={liked ? "#FF4566" : "none"} strokeWidth={2} />
            </button>
            <button style={{ background:"none", border:"none", cursor:"pointer" }}>
              <Share2 size={20} color="#bbb" strokeWidth={2} />
            </button>
          </div>
        </div>
        {/* Content */}
        <div style={{ overflowY:"auto", padding:"0 20px 40px" }}>
          <div style={{ fontSize:28, marginBottom:14, textAlign:"center" }}>{article.emoji}</div>
          <div style={{ display:"inline-block", background:"#F0EBFF", color:"#7C3AFF", fontSize:11, fontWeight:700, borderRadius:20, padding:"4px 12px", marginBottom:12 }}>{article.cat}</div>
          <h2 style={{ fontSize:18, fontWeight:900, color:"#1a1a1a", lineHeight:1.35, marginBottom:12 }}>{article.title}</h2>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20, paddingBottom:16, borderBottom:"1px solid #f2f2f2" }}>
            <div style={{ width:34, height:34, borderRadius:"50%", background:"#EDE8FF", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>👩‍⚕️</div>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:"#333", fontFamily:"Inter,sans-serif" }}>{article.author}</div>
              <div style={{ display:"flex", gap:10, marginTop:2 }}>
                <span style={{ fontSize:11, color:"#aaa", display:"flex", alignItems:"center", gap:3 }}><Clock size={10} strokeWidth={2} />{article.min} dk okuma</span>
                <span style={{ fontSize:11, color:"#aaa" }}>👁 {article.views} görüntülenme</span>
              </div>
            </div>
          </div>
          <p style={{ fontSize:15, color:"#444", lineHeight:1.8, fontFamily:"Inter,sans-serif" }}>{article.body}</p>
          <div style={{ marginTop:24, padding:"16px", background:"#F7F4FF", borderRadius:14, borderLeft:"3px solid #7C3AFF" }}>
            <div style={{ fontSize:11, fontWeight:800, color:"#7C3AFF", marginBottom:6 }}>💡 UZMAN TAVSİYESİ</div>
            <div style={{ fontSize:13, color:"#555", lineHeight:1.6, fontFamily:"Inter,sans-serif" }}>Bu makaleyle ilgili sorularınız için YourPoodle yapay zeka asistanını veya topluluk forumunu kullanabilirsiniz.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────── */

export default function Rehber() {
  const [, navigate]      = useLocation();
  const [activeLang, setActiveLang] = useState(LANGUAGES[0]);
  const [langOpen,   setLangOpen]   = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeCat,  setActiveCat]  = useState("Tümü");
  const [search,     setSearch]     = useState("");
  const [selected,   setSelected]   = useState<Article | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = ARTICLES.filter(a =>
    (activeCat === "Tümü" || a.cat === activeCat) &&
    (search === "" || a.title.toLowerCase().includes(search.toLowerCase()))
  );

  function handleCatChange(cat: string) {
    setActiveCat(cat);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function focusSearch() {
    searchRef.current?.focus();
    searchRef.current?.scrollIntoView({ behavior:"smooth", block:"center" });
  }

  return (
    <>
      <title>Rehber — YourPoodle</title>
      <style>{[
        "*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }",
        "body { background: #fff; }",
        ".noscroll::-webkit-scrollbar { display: none; }",
        ".noscroll { -ms-overflow-style: none; scrollbar-width: none; }",
        ".icon-btn { background: none; border: none; cursor: pointer; display: flex; align-items: center; padding: 6px; border-radius: 8px; }",
        ".art-row:hover { background: #F5F1FF !important; }",
      ].join("\n")}</style>

      {selected && <ArticleDetail article={selected} onClose={() => setSelected(null)} />}

      <div style={{ minHeight:"100vh", background:"#fff", fontFamily:"Inter,sans-serif", paddingBottom:80 }}>

        {/* DRAWER OVERLAY */}
        {drawerOpen && <div onClick={() => setDrawerOpen(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.3)", zIndex:199 }} />}
        <div style={{ position:"fixed", top:0, right:0, height:"100%", width:280, background:"#fff", zIndex:200, transform: drawerOpen ? "translateX(0)" : "translateX(100%)", transition:"transform 0.24s ease", boxShadow:"-4px 0 24px rgba(0,0,0,0.12)" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 18px 14px", borderBottom:"1px solid #f2f2f2" }}>
            <img src="/images/yourpoodle-logo.jpg" alt="YourPoodle" style={{ height:32, objectFit:"contain" }} />
            <button className="icon-btn" onClick={() => setDrawerOpen(false)}><X size={20} color="#444" /></button>
          </div>
          <nav>
            {DRAWER_LINKS.map(({ label, href }) => (
              <button key={label} onClick={() => { setDrawerOpen(false); navigate(href); }}
                style={{ display:"block", width:"100%", textAlign:"left", padding:"14px 20px", fontSize:15, fontWeight:600, color:"#222", background:"none", border:"none", borderBottom:"1px solid #fafafa", cursor:"pointer", fontFamily:"Inter,sans-serif" }}>
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* HEADER */}
        <header style={{ position:"sticky", top:0, zIndex:100, background:"#fff", borderBottom:"1px solid #f0f0f0" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px" }}>
            <button onClick={() => navigate("/")} style={{ background:"none", border:"none", cursor:"pointer", padding:0 }}>
              <img src="/images/yourpoodle-logo.jpg" alt="YourPoodle" style={{ height:36, width:160, objectFit:"contain", objectPosition:"left center" }} />
            </button>
            <div style={{ display:"flex", alignItems:"center", gap:4 }}>
              <button className="icon-btn" onClick={focusSearch}><Search size={21} color="#333" strokeWidth={2} /></button>
              <button className="icon-btn" onClick={() => navigate("/yourpoodle/magaza")}><ShoppingBag size={21} color="#333" strokeWidth={2} /></button>
              {/* Language picker */}
              <div style={{ position:"relative" }}>
                <button className="icon-btn" onClick={() => setLangOpen(!langOpen)} style={{ gap:4, padding:"5px 8px" }}>
                  <span style={{ fontSize:15 }}>{activeLang.flag}</span>
                  <span style={{ fontSize:13, fontWeight:700, color:"#6C47FF" }}>{activeLang.code}</span>
                  <ChevronDown size={13} color="#6C47FF" strokeWidth={2.5} style={{ transform: langOpen ? "rotate(180deg)" : "none", transition:"transform 0.18s" }} />
                </button>
                {langOpen && (
                  <div style={{ position:"absolute", right:0, top:38, background:"#fff", borderRadius:12, border:"1px solid #eee", boxShadow:"0 8px 28px rgba(0,0,0,0.12)", zIndex:150, minWidth:110, padding:"4px 0" }}>
                    {LANGUAGES.map(l => (
                      <button key={l.code} onClick={() => { setActiveLang(l); setLangOpen(false); }}
                        style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"9px 14px", border:"none", background: activeLang.code===l.code ? "#F5F0FF" : "transparent", cursor:"pointer", fontSize:13, fontWeight:700, color: activeLang.code===l.code ? "#6C47FF" : "#333", fontFamily:"Inter,sans-serif" }}>
                        <span style={{ fontSize:16 }}>{l.flag}</span>{l.code}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button className="icon-btn" onClick={() => setDrawerOpen(true)}><Menu size={22} color="#333" strokeWidth={2} /></button>
            </div>
          </div>
          {/* Tab bar */}
          <div style={{ display:"flex", borderTop:"1px solid #f0f0f0" }}>
            {[
              { label:"Ana Sayfa",    href:"/" },
              { label:"Rehber",       href:"/yourpoodle/rehber" },
              { label:"Bilgi Bankası",href:"/yourpoodle/bilgi" },
              { label:"Mağaza",       href:"/yourpoodle/magaza" },
            ].map(t => (
              <button key={t.label} onClick={() => navigate(t.href)}
                style={{ flex:1, padding:"11px 4px", fontSize:13.5, fontWeight: t.label==="Rehber" ? 700 : 500, color: t.label==="Rehber" ? "#6C47FF" : "#555", borderBottom: t.label==="Rehber" ? "2.5px solid #6C47FF" : "2.5px solid transparent", textAlign:"center", background:"none", border:"none", borderBottomWidth:"2.5px", borderBottomStyle:"solid", borderBottomColor: t.label==="Rehber" ? "#6C47FF" : "transparent", cursor:"pointer", fontFamily:"Inter,sans-serif" }}>
                {t.label}
              </button>
            ))}
          </div>
        </header>

        {/* PAGE TITLE */}
        <div style={{ padding:"20px 16px 0" }}>
          <h1 style={{ fontSize:22, fontWeight:900, color:"#1a1a1a", marginBottom:4 }}>📖 Rehber</h1>
          <p style={{ fontSize:13, color:"#888" }}>Toy Poodle'ınız için kapsamlı içerikler</p>
        </div>

        {/* SEARCH */}
        <div style={{ padding:"14px 16px 0" }}>
          <div style={{ display:"flex", alignItems:"center", background:"#F7F7F7", border:"1.5px solid #ececec", borderRadius:14, height:48, overflow:"hidden" }}>
            <div style={{ paddingLeft:14, color:"#bbb", display:"flex" }}><Search size={18} strokeWidth={2} /></div>
            <input
              ref={searchRef}
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Makale ara..."
              style={{ flex:1, border:"none", outline:"none", fontSize:13.5, fontWeight:600, color:"#333", background:"transparent", padding:"0 10px", fontFamily:"Inter,sans-serif" }} />
            {search && (
              <button onClick={() => setSearch("")} style={{ background:"none", border:"none", cursor:"pointer", paddingRight:12, color:"#bbb" }}>
                <X size={16} strokeWidth={2} />
              </button>
            )}
          </div>
        </div>

        {/* CATEGORY CHIPS */}
        <div style={{ padding:"12px 16px 0" }}>
          <div className="noscroll" style={{ display:"flex", gap:8, overflowX:"auto" }}>
            {CATS.map(c => (
              <button key={c} onClick={() => handleCatChange(c)}
                style={{ flexShrink:0, padding:"7px 16px", borderRadius:20, border:"1.5px solid", borderColor: activeCat===c ? "#7C3AFF" : "#e8e8e8", background: activeCat===c ? "#7C3AFF" : "#fff", color: activeCat===c ? "#fff" : "#555", fontSize:12.5, fontWeight:700, cursor:"pointer", fontFamily:"Inter,sans-serif" }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* FEATURED CARD */}
        {activeCat === "Tümü" && search === "" && (() => {
          const feat = ARTICLES.filter(a => a.featured)[0];
          return feat ? (
            <div style={{ padding:"16px 16px 0" }}>
              <button onClick={() => setSelected(feat)}
                style={{ width:"100%", background:"linear-gradient(135deg,#EDE8FF,#F5F0FF)", borderRadius:18, padding:"18px", display:"flex", gap:14, alignItems:"center", cursor:"pointer", border:"none", textAlign:"left" }}>
                <div style={{ width:64, height:64, borderRadius:16, background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, flexShrink:0 }}>{feat.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:10, fontWeight:800, color:"#7C3AFF", letterSpacing:"0.06em", marginBottom:5 }}>ÖNE ÇIKAN</div>
                  <div style={{ fontSize:15, fontWeight:800, color:"#1a1a1a", lineHeight:1.35, marginBottom:6, fontFamily:"Inter,sans-serif" }}>{feat.title}</div>
                  <div style={{ display:"flex", gap:12 }}>
                    <span style={{ fontSize:11, color:"#888", display:"flex", alignItems:"center", gap:3 }}><Clock size={11} strokeWidth={2} />{feat.min} dk</span>
                    <span style={{ fontSize:11, color:"#888" }}>👁 {feat.views}</span>
                  </div>
                </div>
                <ChevronRight size={18} color="#7C3AFF" />
              </button>
            </div>
          ) : null;
        })()}

        {/* ARTICLE LIST */}
        <div style={{ padding:"16px 16px 0", display:"flex", flexDirection:"column", gap:12 }}>
          {filtered.filter(a => !a.featured || activeCat !== "Tümü" || search !== "").length === 0 ? (
            <div style={{ textAlign:"center", padding:"48px 24px", color:"#aaa" }}>
              <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
              <div style={{ fontSize:15, fontWeight:700, color:"#555", marginBottom:6 }}>Sonuç bulunamadı</div>
              <div style={{ fontSize:13, color:"#aaa" }}>"{search}" için makale yok. Farklı bir kelime deneyin.</div>
              <button onClick={() => { setSearch(""); setActiveCat("Tümü"); }}
                style={{ marginTop:16, padding:"10px 24px", borderRadius:20, background:"#7C3AFF", color:"#fff", border:"none", cursor:"pointer", fontSize:13, fontWeight:700, fontFamily:"Inter,sans-serif" }}>
                Tümünü Göster
              </button>
            </div>
          ) : (
            filtered.filter(a => !a.featured || activeCat !== "Tümü" || search !== "").map(a => (
              <button key={a.title} className="art-row" onClick={() => setSelected(a)}
                style={{ display:"flex", gap:12, alignItems:"center", padding:"12px", background:"#FAFAFA", borderRadius:14, cursor:"pointer", border:"none", textAlign:"left", width:"100%", transition:"background 0.15s" }}>
                <div style={{ width:52, height:52, borderRadius:12, background:"#EDE8FF", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>{a.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:"#7C3AFF", marginBottom:4 }}>{a.cat}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:"#1a1a1a", lineHeight:1.4, marginBottom:5, fontFamily:"Inter,sans-serif" }}>{a.title}</div>
                  <div style={{ fontSize:11, color:"#888", marginBottom:3, fontFamily:"Inter,sans-serif" }}>{a.author.split(" — ")[0]}</div>
                  <div style={{ display:"flex", gap:10 }}>
                    <span style={{ fontSize:11, color:"#aaa", display:"flex", alignItems:"center", gap:3 }}><Clock size={11} strokeWidth={2} />{a.min} dk</span>
                    <span style={{ fontSize:11, color:"#aaa" }}>👁 {a.views}</span>
                  </div>
                </div>
                <ChevronRight size={16} color="#ccc" />
              </button>
            ))
          )}
        </div>

        {/* Bottom padding for nav */}
        <div style={{ height:16 }} />
      </div>

      <BottomNav active="Rehber" />
    </>
  );
}
