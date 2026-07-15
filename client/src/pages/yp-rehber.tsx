import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { Search, X, ChevronRight, ArrowLeft, Heart, Share2, Clock } from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";

const CATS = ["Tümü","Beslenme","Sağlık","Bakım","Eğitim","Davranış","Üreme"];

interface Article {
  emoji: string; cat: string; title: string; min: number; views: string;
  featured: boolean; author: string; body: string;
}

const ARTICLES: Article[] = [
  { emoji:"🍖", cat:"Beslenme",  featured:true,  min:5,  views:"2.4M",
    title:"Toy Poodle İçin En İyi Mama Markaları 2024",
    author:"Dr. Ayşe Kaya — Veteriner Hekimi",
    body:"Royal Canin Poodle formülü, yaşa özel besin değerleriyle öne çıkıyor. Hill's Science Plan ve Pro Plan da Poodle'ların küçük ağız yapısına uygun kibble boyutuyla dikkat çekiyor. Tahılsız seçenekler için Orijen ve Acana tercih edilebilir. Günlük kalori ihtiyacı: yetişkin Toy Poodle (3 kg) için yaklaşık 200–240 kcal." },
  { emoji:"✂️", cat:"Bakım",     featured:true,  min:8,  views:"1.8M",
    title:"Evde Poodle Tıraşı: Adım Adım Rehber",
    author:"Selin Demir — Grooming Uzmanı",
    body:"Teddy bear kesimi için önce banyo, kurutma, ardından makasla şekillendirme adımlarını takip edin. Kulak temizliği tıraş öncesi yapılmalıdır. Gerekli ekipman: slicker fırça, matlaştırıcı sprey, profesyonel makas seti ve tıraş makinesi. Her 6–8 haftada bir tam tıraş önerilir." },
  { emoji:"💊", cat:"Sağlık",    featured:false, min:6,  views:"3.1M",
    title:"Poodle'larda Görülen 10 Yaygın Sağlık Sorunu",
    author:"Dr. Murat Yılmaz — Dahiliye Uzmanı",
    body:"Addison hastalığı, tiroid sorunları ve göz yaşı lekeleri Poodle'larda en sık görülen rahatsızlıkların başında gelir. Ayrıca patellar luksasyon, ilerleyici retinal atrofi (PRA) ve epilepsi genetik risk faktörleri arasındadır. Yılda iki kez veteriner kontrolü kritik öneme sahiptir." },
  { emoji:"🐾", cat:"Eğitim",    featured:false, min:10, views:"980K",
    title:"Poodle'ınıza Temel Komutları Nasıl Öğretirsiniz?",
    author:"Cem Arslan — Köpek Eğitmeni",
    body:"Otur, gel, dur, bırak komutlarını pozitif pekiştirme ile 2–4 hafta içinde öğretebilirsiniz. Günlük 10 dakika tutarlı antrenman yeterli. Poodle'lar yüksek zeka düzeyi sayesinde köpek türleri arasında en hızlı öğrenenlerden biridir; sıkılmamak için egzersizleri çeşitlendirin." },
  { emoji:"❤️", cat:"Davranış",  featured:false, min:7,  views:"1.2M",
    title:"Poodle Anksiyetesi: Belirtiler ve Çözüm Yolları",
    author:"Dr. Zeynep Acar — Veteriner Davranış Uzmanı",
    body:"Ayrılık anksiyetesi belirtileri: sürekli havlama, kapı önünde bekleme, eşya çiğneme. KONG oyuncağı ve Adaptil diffuser ilk adımlar olarak önerilir. Desensitizasyon protokolü için bir davranış uzmanıyla çalışmak uzun vadede en etkili yöntemdir." },
  { emoji:"🏥", cat:"Sağlık",    featured:false, min:9,  views:"760K",
    title:"Poodle'larda Kalça Displazisi: Erken Teşhis",
    author:"Dr. Ali Öztürk — Ortopedi Uzmanı",
    body:"OFA sertifikasyonlu ebeveynlerden doğan yavruları tercih edin. 6 aylık kontrollerde röntgen çektirerek erken tarama yapılabilir. Eklem takviyesi için balık yağı ve glukozamin içeren mamalar destekleyici rol oynar. Ağır vakalarda cerrahi müdahale gerekebilir." },
  { emoji:"🛁", cat:"Bakım",     featured:false, min:5,  views:"1.5M",
    title:"Poodle Tüy Bakımı: Haftalık Rutin Rehberi",
    author:"Selin Demir — Grooming Uzmanı",
    body:"Haftada en az 3 kez slicker fırçayla tarama, 4–6 haftada bir profesyonel tıraş ve 2 haftada bir banyo standart bakım rutinidir. Pin fırça yerine slicker tercih edin; mat önlemek için köklere kadar tarayın. Kulak kıllarını 3–4 haftada bir aldırın." },
  { emoji:"🥩", cat:"Beslenme",  featured:false, min:6,  views:"890K",
    title:"Yavru Poodle Beslenmesi: İlk 12 Ay",
    author:"Dr. Ayşe Kaya — Veteriner Hekimi",
    body:"8 haftaya kadar annesinden emzirme / mama geçişi, 8–16 hafta arası günde 3 öğün yavru maması, 6 aydan itibaren 2 öğüne geçiş. Yetişkin mamaya geçiş 12. ayda yapılmalı. Porsiyonları tartarak verin; aşırı yemek iskelet gelişimini olumsuz etkiler." },
  { emoji:"🎓", cat:"Eğitim",    featured:false, min:8,  views:"640K",
    title:"Clicker Eğitimi ile Hızlı Öğrenme Teknikleri",
    author:"Cem Arslan — Köpek Eğitmeni",
    body:"Clicker sesi ile ödülü eşleştirin (50 tekrar), ardından istenen davranışı capture ya da shaping yöntemiyle pekiştirin. Mark & reward döngüsü 50–100 tekrarda otomatik hale gelir. Poodle'lar hata toleransı yüksek köpeklerdir; asla olumsuz pekiştirme kullanmayın." },
  { emoji:"🐣", cat:"Üreme",     featured:false, min:7,  views:"520K",
    title:"Poodle'da İlk Kızgınlık ve Doğru Çiftleştirme Zamanı",
    author:"Dr. Murat Yılmaz — Dahiliye Uzmanı",
    body:"Dişi Toy Poodle'larda ilk kızgınlık 6–12 ay arasında görülür. Sağlıklı çiftleştirme için en az 2. ya da 3. kızgınlığı beklemeniz tavsiye edilir. Progesteron testi ile ovulasyon zamanını doğru tespit etmek gebelik başarısını önemli ölçüde artırır." },
  { emoji:"🍼", cat:"Üreme",     featured:false, min:6,  views:"430K",
    title:"Poodle Yavrularına İlk Günlerde Bakım",
    author:"Dr. Zeynep Acar — Veteriner Davranış Uzmanı",
    body:"İlk 2 haftada göz ve kulak kapalıdır; ısı düzenlemesi tamamen anneye bağlıdır. 2. haftadan itibaren yavaş yavaş çevre keşfine başlarlar. İlk aşılar 6–8. haftadan itibaren planlanır; sosyalizasyon penceresi 3–12 hafta arasıdır ve bu dönem kritik önem taşır." },
];

function ArticleDetail({ article, onClose }: { article: Article; onClose: () => void }) {
  const [liked, setLiked] = useState(false);
  return (
    <div style={{ position:"fixed", inset:0, zIndex:500, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.4)" }} />
      <div style={{ position:"relative", background:"#fff", borderRadius:20, maxWidth:640, width:"calc(100% - 32px)", maxHeight:"88vh", display:"flex", flexDirection:"column", overflow:"hidden", boxShadow:"0 24px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px 12px", borderBottom:"1px solid #f2f2f2" }}>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:6, color:"#555", fontSize:14, fontWeight:600 }}>
            <ArrowLeft size={16} strokeWidth={2} /> Geri
          </button>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={() => setLiked(l => !l)} style={{ background:"none", border:"none", cursor:"pointer" }}>
              <Heart size={20} color={liked?"#FF4566":"#bbb"} fill={liked?"#FF4566":"none"} strokeWidth={2} />
            </button>
            <button onClick={() => { if (navigator.share) navigator.share({ title: article.title, url: window.location.origin + "/yourpoodle/rehber" }).catch(() => {}); }} style={{ background:"none", border:"none", cursor:"pointer" }}>
              <Share2 size={20} color="#bbb" strokeWidth={2} />
            </button>
          </div>
        </div>
        <div style={{ overflowY:"auto", padding:"16px 24px 40px" }}>
          <div style={{ fontSize:36, marginBottom:14, textAlign:"center" }}>{article.emoji}</div>
          <div style={{ display:"inline-block", background:"#F0EBFF", color:"#7C3AFF", fontSize:11, fontWeight:700, borderRadius:20, padding:"4px 12px", marginBottom:14 }}>{article.cat}</div>
          <h2 style={{ fontSize:20, fontWeight:900, color:"#1a1a1a", lineHeight:1.35, marginBottom:14 }}>{article.title}</h2>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20, paddingBottom:16, borderBottom:"1px solid #f2f2f2" }}>
            <div style={{ width:36, height:36, borderRadius:"50%", background:"#EDE8FF", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>👩‍⚕️</div>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:"#333" }}>{article.author}</div>
              <div style={{ display:"flex", gap:10, marginTop:2 }}>
                <span style={{ fontSize:11, color:"#aaa", display:"flex", alignItems:"center", gap:3 }}><Clock size={10} strokeWidth={2} />{article.min} dk okuma</span>
                <span style={{ fontSize:11, color:"#aaa" }}>👁 {article.views}</span>
              </div>
            </div>
          </div>
          <p style={{ fontSize:15, color:"#444", lineHeight:1.8 }}>{article.body}</p>
          <div style={{ marginTop:24, padding:"16px", background:"#F7F4FF", borderRadius:14, borderLeft:"3px solid #7C3AFF" }}>
            <div style={{ fontSize:11, fontWeight:800, color:"#7C3AFF", marginBottom:6 }}>💡 UZMAN TAVSİYESİ</div>
            <div style={{ fontSize:13, color:"#555", lineHeight:1.6 }}>Bu makaleyle ilgili sorularınız için YourPoodle yapay zeka asistanını veya topluluk forumunu kullanabilirsiniz.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Rehber() {
  const [, navigate]    = useLocation();
  const [activeCat,  setActiveCat]  = useState("Tümü");
  const [search,     setSearch]     = useState("");
  const [selected,   setSelected]   = useState<Article | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = ARTICLES.filter(a =>
    (activeCat === "Tümü" || a.cat === activeCat) &&
    (search === "" || a.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <YPLayout activeLink="/yourpoodle/rehber">
      <title>Rehber — YourPoodle</title>
      <style>{`
        .art-row-reh:hover { background: #F5F1FF !important; }
        .noscroll-reh::-webkit-scrollbar { display: none; }
        .noscroll-reh { -ms-overflow-style: none; scrollbar-width: none; }
        @media (min-width: 900px) {
          .reh-featured { max-width: 680px; }
        }
      `}</style>

      {selected && <ArticleDetail article={selected} onClose={() => setSelected(null)} />}

      {/* Page title */}
      <div style={{ padding:"24px 16px 0" }}>
        <h1 style={{ fontSize:24, fontWeight:900, color:"#1a1a1a", marginBottom:4 }}>📖 Rehber</h1>
        <p style={{ fontSize:13, color:"#888" }}>Toy Poodle'ınız için kapsamlı içerikler</p>
      </div>

      {/* Search */}
      <div style={{ padding:"14px 16px 0" }}>
        <div style={{ display:"flex", alignItems:"center", background:"#F7F7F7", border:"1.5px solid #ececec", borderRadius:14, height:50, overflow:"hidden" }}>
          <div style={{ paddingLeft:14, color:"#bbb", display:"flex" }}><Search size={18} strokeWidth={2} /></div>
          <input
            ref={searchRef}
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Makale ara..."
            style={{ flex:1, border:"none", outline:"none", fontSize:14, fontWeight:600, color:"#333", background:"transparent", padding:"0 12px" }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ background:"none", border:"none", cursor:"pointer", paddingRight:12, color:"#bbb" }}>
              <X size={16} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>

      {/* Category chips */}
      <div style={{ padding:"12px 16px 0" }}>
        <div className="noscroll-reh" style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:2 }}>
          {CATS.map(c => (
            <button key={c} onClick={() => { setActiveCat(c); window.scrollTo({ top:0, behavior:"smooth" }); }}
              style={{ flexShrink:0, padding:"7px 16px", borderRadius:20, border:"1.5px solid", borderColor:activeCat===c?"#7C3AFF":"#e8e8e8", background:activeCat===c?"#7C3AFF":"#fff", color:activeCat===c?"#fff":"#555", fontSize:12.5, fontWeight:700, cursor:"pointer" }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Featured card */}
      {activeCat === "Tümü" && search === "" && (() => {
        const feat = ARTICLES.filter(a => a.featured)[0];
        return feat ? (
          <div style={{ padding:"16px 16px 0" }}>
            <button onClick={() => setSelected(feat)} className="reh-featured"
              style={{ width:"100%", background:"linear-gradient(135deg,#EDE8FF,#F5F0FF)", borderRadius:18, padding:"20px", display:"flex", gap:16, alignItems:"center", cursor:"pointer", border:"none", textAlign:"left" }}>
              <div style={{ width:68, height:68, borderRadius:16, background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:34, flexShrink:0 }}>{feat.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:10, fontWeight:800, color:"#7C3AFF", letterSpacing:"0.06em", marginBottom:6 }}>ÖNE ÇIKAN</div>
                <div style={{ fontSize:16, fontWeight:800, color:"#1a1a1a", lineHeight:1.35, marginBottom:8 }}>{feat.title}</div>
                <div style={{ display:"flex", gap:12 }}>
                  <span style={{ fontSize:11, color:"#888", display:"flex", alignItems:"center", gap:3 }}><Clock size={11} strokeWidth={2} />{feat.min} dk</span>
                  <span style={{ fontSize:11, color:"#888" }}>👁 {feat.views}</span>
                </div>
              </div>
            </button>
          </div>
        ) : null;
      })()}

      {/* Article list */}
      <div style={{ padding:"16px 16px 32px" }}>
        {filtered.filter(a => !a.featured || activeCat !== "Tümü" || search !== "").length === 0 ? (
          <div style={{ textAlign:"center", padding:"48px 24px", color:"#aaa" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
            <div style={{ fontSize:15, fontWeight:700, color:"#555", marginBottom:6 }}>Sonuç bulunamadı</div>
            <div style={{ fontSize:13 }}>"{search}" için makale yok. Farklı bir kelime deneyin.</div>
            <button onClick={() => { setSearch(""); setActiveCat("Tümü"); }}
              style={{ marginTop:16, padding:"10px 24px", borderRadius:20, background:"#7C3AFF", color:"#fff", border:"none", cursor:"pointer", fontSize:13, fontWeight:700 }}>
              Tümünü Göster
            </button>
          </div>
        ) : (
          <div className="yp-art-grid" style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {filtered.filter(a => !a.featured || activeCat !== "Tümü" || search !== "").map(a => (
              <button key={a.title} className="art-row-reh" onClick={() => setSelected(a)}
                style={{ display:"flex", gap:12, alignItems:"center", padding:"14px", background:"#FAFAFA", borderRadius:14, cursor:"pointer", border:"none", textAlign:"left", width:"100%", transition:"background 0.15s" }}>
                <div style={{ width:54, height:54, borderRadius:12, background:"#EDE8FF", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>{a.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:"#7C3AFF", marginBottom:4 }}>{a.cat}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:"#1a1a1a", lineHeight:1.4, marginBottom:5 }}>{a.title}</div>
                  <div style={{ fontSize:11, color:"#888", marginBottom:3 }}>{a.author.split(" — ")[0]}</div>
                  <div style={{ display:"flex", gap:10 }}>
                    <span style={{ fontSize:11, color:"#aaa", display:"flex", alignItems:"center", gap:3 }}><Clock size={11} strokeWidth={2} />{a.min} dk</span>
                    <span style={{ fontSize:11, color:"#aaa" }}>👁 {a.views}</span>
                  </div>
                </div>
                <ChevronRight size={16} color="#ccc" />
              </button>
            ))}
          </div>
        )}
      </div>
    </YPLayout>
  );
}
