import { useState } from "react";
import { useLocation } from "wouter";
import { Heart, MessageCircle, Share2, Search, X } from "lucide-react";
import { useCustomer } from "@/contexts/CustomerContext";
import YPLayout from "@/components/yourpoodle/YPLayout";

const ALL_POSTS = [
  { id:"1", author:"poodlemom_ayse",  poodle:"Mocha",   avatar:"🐩", time:"2 saat önce",   text:"Mocha bugün tıraş oldu 🥰 Müthiş görünüyor! Tıraşını yaptıran var mı bu hafta?", likes:48, comments:12, liked:false },
  { id:"2", author:"toypoodle_mert",  poodle:"Luna",    avatar:"🐾", time:"5 saat önce",   text:"Luna'nın ilk oyun randevusu! Diğer poodlelarla tanışmak onu çok heyecanlandırdı 💜", likes:34, comments:7, liked:false },
  { id:"3", author:"poodle_selin",    poodle:"Biscuit", avatar:"💜", time:"1 gün önce",    text:"Biscuit 1 yaşına girdi! 🎂 Doğum günü pastasını bitirdi hepsini haha. Yorumlarınızı bekliyorum!", likes:92, comments:23, liked:false },
  { id:"4", author:"miniaturist_can", poodle:"Coco",    avatar:"🌸", time:"2 gün önce",    text:"Coco'nun yeni mama markasını denedik. Royal Canin Toy Breed'den çok memnunuz. Tavsiye ederim 👍", likes:27, comments:9, liked:false },
  { id:"5", author:"poodle_istanbul", poodle:"Mochi",   avatar:"⭐", time:"3 gün önce",    text:"Ağırlık kontrolü için hepinize soruyorum — sizin poodleniz kaç kilo? Mochi 3.2 kg, idealmiş! 🐕", likes:61, comments:31, liked:false },
  { id:"6", author:"toy_lover_ece",   poodle:"Şeker",   avatar:"🎀", time:"4 gün önce",    text:"Şeker'in yeni figür fotoğrafları! 5 yaşında ama enerji olarak hiç yaşlanmıyor 🏃", likes:45, comments:15, liked:false },
  { id:"7", author:"poodle_ankara",   poodle:"Fıstık",  avatar:"🤍", time:"5 gün önce",    text:"Fıstık ilk kez karla tanıştı! Çok korktu önce sonra aşık oldu 😂❄️", likes:108, comments:44, liked:false },
  { id:"8", author:"kucuk_poodle",    poodle:"Pamuk",   avatar:"☁️", time:"1 hafta önce",  text:"Pamuk'un veteriner kontrolünden mükemmel not aldık! Herkesin poodle'ı böyle sağlıklı olsun 🏥", likes:77, comments:19, liked:false },
];

export default function Topluluk() {
  const [, navigate] = useLocation();
  const { isLoggedIn } = useCustomer();
  const [search, setSearch] = useState("");
  const [posts,  setPosts]  = useState(ALL_POSTS);

  const filtered = search ? posts.filter(p =>
    p.text.toLowerCase().includes(search.toLowerCase()) ||
    p.author.toLowerCase().includes(search.toLowerCase())
  ) : posts;

  const handleLike = (id: string) =>
    setPosts(ps => ps.map(p => p.id === id ? { ...p, liked: !p.liked } : p));

  return (
    <YPLayout activeLink="/yourpoodle/topluluk">
      <title>Poodle Topluluğu | 10.000+ Poodle Sahibiyle Paylaş | YourPoodle</title>
      <meta name="description" content="Türkiye'nin en büyük Toy Poodle topluluğu. Poodle sahipleriyle deneyim paylaşın, sorular sorun, fotoğraf paylaşın. 10.000+ aktif üye." />
      <meta property="og:title" content="Poodle Topluluğu | YourPoodle" />
      <meta property="og:description" content="10.000+ poodle sahibiyle buluş. Deneyim paylaş, soru sor, topluluğa katıl." />
      <meta property="og:type" content="website" />
      <meta name="robots" content="index, follow" />
      <style>{`
        .post-action:hover { background: #F5F0FF; }
        @media (min-width: 900px) {
          .topluluk-grid { display: grid !important; grid-template-columns: 1fr 1fr; gap: 14px; align-items: start; }
          .topluluk-hero { border-radius: 20px; margin: 24px 0 !important; }
        }
      `}</style>

      <div style={{ background:"#F7F5FF", minHeight:"100vh" }}>

        {/* Hero */}
        <div className="topluluk-hero" style={{ background:"linear-gradient(135deg,#7C3AFF,#A855F7)", padding:"24px 24px 28px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-20, right:-20, width:100, height:100, borderRadius:"50%", background:"rgba(255,255,255,0.08)" }} />
          <div style={{ fontSize:32, marginBottom:8 }}>👥</div>
          <h1 style={{ fontSize:22, fontWeight:900, color:"#fff", marginBottom:4 }}>Poodle Topluluğu</h1>
          <p style={{ fontSize:13, color:"rgba(255,255,255,0.85)", marginBottom:14 }}>10.000+ poodle sahibiyle deneyim paylaş</p>
          <div style={{ display:"flex", gap:16 }}>
            {[["10K+","Üye"],["50K+","Gönderi"],["Ücretsiz","Katıl"]].map(([n,l]) => (
              <div key={l}>
                <div style={{ fontSize:14, fontWeight:900, color:"#fff" }}>{n}</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.72)" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding:"20px 16px 0" }}>
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:18, fontWeight:900, color:"#1a1a1a", marginBottom:4 }}>Son Paylaşımlar</div>
          </div>

          {/* Search */}
          <div style={{ display:"flex", alignItems:"center", background:"#fff", border:"1.5px solid #ececec", borderRadius:14, height:46, overflow:"hidden", marginBottom:16 }}>
            <div style={{ paddingLeft:14, color:"#bbb", display:"flex" }}><Search size={17} strokeWidth={2} /></div>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Paylaşım ara..."
              style={{ flex:1, border:"none", outline:"none", fontSize:13, fontWeight:600, color:"#333", background:"transparent", padding:"0 10px", fontFamily:"Inter,sans-serif" }} />
            {search && <button onClick={() => setSearch("")} style={{ background:"none", border:"none", cursor:"pointer", paddingRight:12, color:"#bbb" }}><X size={15} /></button>}
          </div>

          {/* Join CTA for guests */}
          {!isLoggedIn && (
            <div style={{ background:"#fff", borderRadius:16, padding:"14px 16px", marginBottom:16, border:"1.5px solid #EDE8FF", display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:26 }}>✏️</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:800, color:"#1a1a1a" }}>Siz de paylaşın!</div>
                <div style={{ fontSize:11, color:"#888" }}>Ücretsiz üye olun ve toplulukla paylaşın</div>
              </div>
              <button onClick={() => navigate("/yourpoodle/giris")}
                style={{ padding:"8px 14px", borderRadius:12, border:"none", background:"#7C3AFF", color:"#fff", fontSize:12, fontWeight:800, cursor:"pointer", fontFamily:"Inter,sans-serif", whiteSpace:"nowrap" }}>Katıl</button>
            </div>
          )}

          {/* Posts */}
          <div className="topluluk-grid">
            {filtered.map(post => (
              <div key={post.id} style={{ background:"#fff", borderRadius:18, boxShadow:"0 2px 16px rgba(0,0,0,0.07)", overflow:"hidden", marginBottom:14 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, padding:"14px 16px 10px" }}>
                  <div style={{ width:42, height:42, borderRadius:"50%", background:"linear-gradient(135deg,#EDE8FF,#D4C4FF)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{post.avatar}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ fontSize:13, fontWeight:800, color:"#1a1a1a" }}>@{post.author}</span>
                      <span style={{ fontSize:11, background:"#EDE8FF", color:"#7C3AFF", borderRadius:6, padding:"1px 7px", fontWeight:700 }}>🐩 {post.poodle}</span>
                    </div>
                    <span style={{ fontSize:11, color:"#aaa" }}>{post.time}</span>
                  </div>
                </div>
                <p style={{ fontSize:13.5, color:"#333", lineHeight:1.65, padding:"0 16px 12px", fontFamily:"Inter,sans-serif" }}>{post.text}</p>
                <div style={{ display:"flex", borderTop:"1px solid #f5f5f5", padding:"4px 8px" }}>
                  <button className="post-action" onClick={() => handleLike(post.id)}
                    style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 14px", borderRadius:10, border:"none", background:"none", cursor:"pointer", flex:1, justifyContent:"center", fontFamily:"Inter,sans-serif" }}>
                    <Heart size={18} strokeWidth={2} color={post.liked?"#E75480":"#aaa"} fill={post.liked?"#E75480":"none"} />
                    <span style={{ fontSize:12, fontWeight:700, color:post.liked?"#E75480":"#aaa" }}>{post.likes + (post.liked ? 1 : 0)}</span>
                  </button>
                  <button className="post-action"
                    style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 14px", borderRadius:10, border:"none", background:"none", cursor:"pointer", flex:1, justifyContent:"center", fontFamily:"Inter,sans-serif" }}>
                    <MessageCircle size={18} strokeWidth={2} color="#aaa" />
                    <span style={{ fontSize:12, fontWeight:700, color:"#aaa" }}>{post.comments}</span>
                  </button>
                  <button className="post-action"
                    onClick={() => { if (navigator.share) { navigator.share({ title:"YourPoodle", text:post.text.slice(0,100), url:window.location.href }).catch(() => {}); } else { navigator.clipboard?.writeText(window.location.href).catch(() => {}); } }}
                    style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 14px", borderRadius:10, border:"none", background:"none", cursor:"pointer", flex:1, justifyContent:"center", fontFamily:"Inter,sans-serif" }}>
                    <Share2 size={18} strokeWidth={2} color="#aaa" />
                    <span style={{ fontSize:12, fontWeight:700, color:"#aaa" }}>Paylaş</span>
                  </button>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div style={{ textAlign:"center", padding:"40px 24px", color:"#aaa" }}>
                <div style={{ fontSize:36, marginBottom:12 }}>🔍</div>
                <div style={{ fontSize:14, fontWeight:700, color:"#555", marginBottom:4 }}>Sonuç bulunamadı</div>
                <button onClick={() => setSearch("")} style={{ marginTop:12, padding:"8px 20px", borderRadius:20, background:"#7C3AFF", color:"#fff", border:"none", cursor:"pointer", fontSize:13, fontWeight:700, fontFamily:"Inter,sans-serif" }}>Tümünü Göster</button>
              </div>
            )}
          </div>

          <div style={{ textAlign:"center", padding:"8px 0 32px" }}>
            <button onClick={() => navigate("/yourpoodle/club")}
              style={{ padding:"10px 28px", borderRadius:20, border:"2px solid #7C3AFF", background:"#fff", color:"#7C3AFF", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"Inter,sans-serif" }}>
              Club'da Daha Fazla Gör 🐾
            </button>
          </div>
        </div>
      </div>
    </YPLayout>
  );
}
