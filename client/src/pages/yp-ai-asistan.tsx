import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import {
  Send, Bot, User, AlertTriangle, RotateCcw, ChevronRight, ChevronDown,
  Utensils, Scissors, GraduationCap, HeartPulse, PawPrint, Dog,
} from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";

/* ─── SEO ────────────────────────────────────────────── */
const PAGE_TITLE = "AI Poodle Asistanı: Anlık Uzman Desteği | YourPoodle";
const PAGE_DESC  = "Toy Poodle hakkında AI asistana sorun. Mama, bakım, eğitim, sağlık ve davranış sorularına kişiselleştirilmiş anlık yanıtlar. Ücretsiz Poodle uzmanı.";

/* ─── Types ──────────────────────────────────────────── */
interface Message { role: "user" | "assistant"; content: string; ts: number; }
interface Profile  { name: string; age: string; weight: string; gender: string; neutered: string; }

/* ─── Categories ─────────────────────────────────────── */
const CATS = [
  {
    id:"beslenme", label:"Beslenme", Icon:Utensils,
    color:"#8B5CF6", bg:"#F3E8FF", desc:"Doğru mama seçimi, ölçüm miktarı ve beslenme tavsiyeleri.",
    qs:["4 aylık Poodle'ım ne kadar mama yemeli?","Poodle'a hangi yiyecekler verilmez?","Yetişkin Toy Poodle için en iyi mama hangisi?"],
  },
  {
    id:"bakim", label:"Bakım", Icon:Scissors,
    color:"#EC4899", bg:"#FCE7F3", desc:"Tüy bakımı, tarama sıklığı, banyo ve genel bakım önerileri.",
    qs:["Poodle tüyü ne sıklıkla taranmalı?","Evde tıraş mı, groomer mı?","Göz altı lekesi nasıl temizlenir?"],
  },
  {
    id:"egitim", label:"Eğitim", Icon:GraduationCap,
    color:"#3B82F6", bg:"#DBEAFE", desc:"Tuvalet eğitimi, temel komutlar ve davranış geliştirme tavsiyeleri.",
    qs:["Tuvalet eğitimine nasıl başlanır?","Temel komutlar kaç haftada öğrenilir?","Clicker eğitimi nasıl yapılır?"],
  },
  {
    id:"saglik", label:"Sağlık", Icon:HeartPulse,
    color:"#10B981", bg:"#D1FAE5", desc:"Aşı takvimi, yaygın hastalıklar ve sağlık önerileri.",
    qs:["Poodle aşı takvimi nasıl olmalı?","İdeal kilosu ne olmalı?","Göz altı neden kızarır?"],
  },
  {
    id:"davranis", label:"Davranış", Icon:PawPrint,
    color:"#F97316", bg:"#FFEDD5", desc:"Havlama, ayrılık kaygısı, sosyalleşme ve daha fazlası.",
    qs:["Yalnız kalınca neden havlar?","Anksiyete belirtileri neler?","Isırma davranışı nasıl düzeltilir?"],
  },
];

/* ─── Article links ──────────────────────────────────── */
const ARTICLE_LINKS: Record<string, { slug: string; title: string }[]> = {
  beslenme:[{slug:"toy-poodle-en-iyi-mama-markalari-2026",title:"En İyi Mama Markaları 2026"},{slug:"yavru-poodle-beslenmesi-ilk-12-ay",title:"Yavru Poodle Beslenmesi"},{slug:"poodle-beslenme-alerjisi",title:"Besin Alerjisi Rehberi"}],
  bakim:[{slug:"evde-poodle-tirasi-adim-adim-rehber",title:"Evde Poodle Tıraşı"},{slug:"poodle-tuy-bakimi-haftalik-rutin",title:"Haftalık Tüy Bakım Rutini"},{slug:"poodle-goz-yasi-lekesi-temizleme",title:"Göz Yaşı Lekesi Temizleme"}],
  egitim:[{slug:"temel-komut-egitimi",title:"Temel Komut Eğitimi"},{slug:"clicker-egitimi",title:"Clicker Eğitimi"},{slug:"tuvalet-egitimi",title:"Tuvalet Eğitimi"}],
  saglik:[{slug:"poodle-saglik-sorunlari",title:"10 Yaygın Sağlık Sorunu"},{slug:"poodle-kalca-displazisi-erken-teshis",title:"Kalça Displazisi"},{slug:"poodle-dis-bakim-rehberi",title:"Diş Bakımı Rehberi"}],
  davranis:[{slug:"poodle-anksiyetesi",title:"Poodle Anksiyetesi"}],
};

/* ─── SSS ────────────────────────────────────────────── */
const SSS = [
  {q:"4 aylık Poodle ne kadar mama yemeli?",a:"4 aylık Toy Poodle günde 100–150 gram yavru maması, 3–4 öğün halinde yemelidir. Mama miktarı köpeğin kilosuna ve mamaya göre değişir; ambalajdaki tabloyu referans alın."},
  {q:"Poodle göz altı neden kızarır?",a:"Gözyaşı kanalı tıkanıklığı, alerji veya enfeksiyon olabilir. Günlük ıslak mendille temizlik yapın; kızarıklık, şişlik veya akıntı varsa veteriner kontrolü önerilir."},
  {q:"Poodle evde yalnız kalınca neden havlar?",a:"Yalnız kalma kaygısı, dikkat isteme veya sıkıntı belirtisi olabilir. Kademeli ayrılma eğitimi ve KONG gibi zihinsel uyarım oyuncakları etkili ilk adımlardır."},
  {q:"Poodle tüyü ne sıklıkla taranmalı?",a:"Haftada en az 3 kez slicker fırçayla tarama önerilir. Profesyonel tıraş 6–8 haftada bir yapılmalıdır; mat oluşumunu önlemek için köklere kadar tarayın."},
  {q:"Poodle tuvalet eğitimine nasıl başlanır?",a:"Her yemekten 20–30 dakika sonra belirli bir noktaya götürün. Başarılı olduğunda hemen ödüllendirin, asla cezalandırmayın. Genellikle 2–4 haftada temel alışkanlık oluşur."},
];

const PROFILE_FIELDS = [
  {key:"name",label:"İsim",placeholder:"ör. Max"},
  {key:"age",label:"Yaş",placeholder:"ör. 6 ay, 2 yaş"},
  {key:"weight",label:"Kilo",placeholder:"ör. 3.2 kg"},
  {key:"gender",label:"Cinsiyet",placeholder:"Erkek / Dişi"},
  {key:"neutered",label:"Kısırlaştırıldı?",placeholder:"Evet / Hayır"},
];

/* ─── Constants ──────────────────────────────────────── */
const EMPTY_PROFILE: Profile = {name:"",age:"",weight:"",gender:"",neutered:""};
const LS_MSG   = "yp_ai_messages";
const LS_PRF   = "yp_ai_profile";
const LS_LIMIT = "yp_ai_daily";
const MAX_STORED  = 20;
const DAILY_LIMIT = 5;

function getToday() { return new Date().toISOString().slice(0,10); }
function getLimitData(): { date: string; count: number } {
  try { const r=localStorage.getItem(LS_LIMIT); if(r){const d=JSON.parse(r);if(d.date===getToday())return d;} } catch {}
  return {date:getToday(),count:0};
}
function incrementLimit() { const d=getLimitData(); d.count+=1; try{localStorage.setItem(LS_LIMIT,JSON.stringify(d));}catch{} return d.count; }
function track(event: string, props?: Record<string, unknown>) { console.log("[YP Analytics]",event,props??{}); }

/* ─── Main ───────────────────────────────────────────── */
export default function YPAiAsistanPage() {
  const [, navigate] = useLocation();

  const [messages, setMessages] = useState<Message[]>(() => {
    try{const r=localStorage.getItem(LS_MSG);return r?JSON.parse(r):[];}catch{return[];}
  });
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [limitData,setLimitData]= useState(getLimitData);
  const remainingQuestions = Math.max(0, DAILY_LIMIT - limitData.count);
  const limitReached = remainingQuestions === 0;

  const [profile, setProfile] = useState<Profile>(() => {
    try{const r=localStorage.getItem(LS_PRF);return r?{...EMPTY_PROFILE,...JSON.parse(r)}:EMPTY_PROFILE;}catch{return EMPTY_PROFILE;}
  });
  const hasProfile = Object.values(profile).some(v=>v);
  const [showProfile, setShowProfile] = useState(false);
  const [showExamples, setShowExamples] = useState(true);

  const [activeCat, setActiveCat]     = useState(CATS[0].id);
  const [expandedSss, setExpandedSss] = useState<number|null>(null);

  /* Suggested questions visible in the panel */
  const SUGGESTED_QS = [
    "4 aylık Poodle'ım ne kadar mama yemeli?",
    "Toy Poodle tüy bakımı ne sıklıkla yapılmalı?",
    "Poodle tuvalet eğitimi ne kadar sürer?",
    "Poodle tüyü ne sıklıkla taranmalı?",
    "Yetişkin Toy Poodle için en iyi mama hangisi?",
  ];

  const bottomRef   = useRef<HTMLDivElement>(null);
  const msgsRef     = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatRef     = useRef<HTMLDivElement>(null);

  useEffect(()=>{ try{localStorage.setItem(LS_MSG,JSON.stringify(messages.slice(-MAX_STORED)));}catch{} },[messages]);
  useEffect(()=>{ try{localStorage.setItem(LS_PRF,JSON.stringify(profile));}catch{} },[profile]);
  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth",block:"nearest"}); },[messages,loading]);

  useEffect(()=>{
    document.title=PAGE_TITLE;
    const m=(a:string,k:string,v:string)=>{
      let el=document.querySelector(`meta[${a}="${k}"]`) as HTMLMetaElement|null;
      if(!el){el=document.createElement("meta");el.setAttribute(a,k);document.head.appendChild(el);}
      el.content=v;
    };
    m("property","og:title",PAGE_TITLE);m("property","og:description",PAGE_DESC);
    m("property","og:type","website");m("name","description",PAGE_DESC);
  },[]);

  const buildSystemPrompt = () => {
    const parts:string[]=[];
    if(profile.name)     parts.push(`İsim: ${profile.name}`);
    if(profile.age)      parts.push(`Yaş: ${profile.age}`);
    if(profile.weight)   parts.push(`Kilo: ${profile.weight}`);
    if(profile.gender)   parts.push(`Cinsiyet: ${profile.gender}`);
    if(profile.neutered) parts.push(`Kısırlaştırıldı mı: ${profile.neutered}`);
    const profileStr=parts.length?`\n\nPoodle profili: ${parts.join(", ")}.`:"";
    return `Sen YourPoodle'ın AI asistanısın. Yalnızca Toy Poodle ve Miniature Poodle sahiplerine yardımcı oluyorsun.${profileStr}\n\nKurallar:\n- Samimi, sıcak ve anlaşılır dil kullan.\n- Sadece poodle bakımı, beslenmesi, eğitimi, sağlığı ve davranışı hakkında bilgi ver.\n- Kesin tıbbi teşhis koyma, ilaç dozu verme.\n- Acil belirti (kusma+letarji, 24 saatten uzun iştahsızlık, nöbet, zehirlenme şüphesi) varsa "⚠️ Hemen veterinere gidin" uyarısı ver.\n- Ciddi sağlık sorunlarında daima veterinere yönlendir.\n- Sorulara kısa ve net cevaplar ver, gerektiğinde madde madde açıkla.\n- Türkçe cevap ver.\n- Her yanıt genel bilgilendirme amaçlıdır; bunu kısa bir notla belirt.`;
  };

  const greeting = hasProfile && profile.name
    ? `Merhaba! ${profile.name} için buradayım 🐾`
    : "Merhaba! 👋\nBen AI Poodle Asistanı.\nPoodle'nız için buradayım!";

  const send = useCallback(async (text?: string) => {
    const q=(text??input).trim();
    if(!q||loading)return;
    if(limitReached){track("ai_limit_reached");return;}
    setInput("");
    if(textareaRef.current) textareaRef.current.style.height="44px";
    const newCount=incrementLimit();
    setLimitData({date:getToday(),count:newCount});
    const ts=Date.now();
    const newMessages:Message[]=[...messages,{role:"user",content:q,ts}];
    setMessages(newMessages);
    setLoading(true);
    setShowExamples(false);
    track("ai_question_sent",{category:activeCat,has_profile:hasProfile});
    try{
      const res=await fetch("/api/yp-chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:newMessages.map(({role,content})=>({role,content})),systemPrompt:buildSystemPrompt()})});
      const data=await res.json();
      let reply=data.reply??"Üzgünüm, şu anda yanıt veremiyorum. Lütfen tekrar deneyin.";
      const arts=ARTICLE_LINKS[activeCat];
      if(arts&&arts.length>=2){const links=arts.slice(0,2).map(a=>`📖 ${a.title} → /yourpoodle/rehber/${a.slug}`).join("\n");reply+=`\n\nİlgili rehberler:\n${links}`;}
      setMessages(prev=>[...prev,{role:"assistant",content:reply,ts:Date.now()}]);
    }catch{
      setMessages(prev=>[...prev,{role:"assistant",content:"Bağlantı hatası oluştu. Lütfen tekrar deneyin.",ts:Date.now()}]);
    }
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[input,loading,messages,profile,activeCat,limitReached,hasProfile]);

  const handleKey=(e:React.KeyboardEvent<HTMLTextAreaElement>)=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();} };
  const resetChat=()=>{ setMessages([]);setShowExamples(true);try{localStorage.removeItem(LS_MSG);}catch{} };
  const selectCat=(id:string)=>{ setActiveCat(id);track("ai_category_selected",{category:id}); };
  const sendQ=(q:string)=>{ track("ai_quick_chip_clicked",{question:q,category:activeCat});send(q); };
  const currentCat=CATS.find(c=>c.id===activeCat)??CATS[0];
  const isHealthCat=activeCat==="saglik";

  const webAppSchema={"@context":"https://schema.org","@type":"WebApplication","name":"AI Poodle Asistanı","applicationCategory":"LifestyleApplication","operatingSystem":"Web","offers":{"@type":"Offer","price":"0","priceCurrency":"TRY"},"url":"https://www.yourpoodle.com/yourpoodle/ai-asistan","description":PAGE_DESC};
  const faqSchema={"@context":"https://schema.org","@type":"FAQPage","mainEntity":SSS.map(s=>({  "@type":"Question","name":s.q,"acceptedAnswer":{"@type":"Answer","text":s.a}}))};

  return (
    <YPLayout activeLink="/yourpoodle/ai-asistan" bottomNavActive="/yourpoodle/ai-asistan">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(webAppSchema)}}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faqSchema)}}/>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        .yp-ai-msgs::-webkit-scrollbar { width: 4px; }
        .yp-ai-msgs::-webkit-scrollbar-thumb { background: #DDD5FF; border-radius: 4px; }
        .yp-msg-user { align-self:flex-end; background:#7C3AED; color:#fff; border-radius:18px 18px 4px 18px; padding:11px 15px; max-width:82%; font-size:14px; line-height:1.55; word-break:break-word; }
        .yp-msg-bot  { align-self:flex-start; background:#fff; color:#222; border-radius:18px 18px 18px 4px; padding:11px 15px; max-width:86%; font-size:14px; line-height:1.65; box-shadow:0 2px 12px rgba(0,0,0,0.07); word-break:break-word; white-space:pre-wrap; }
        .yp-dot { width:7px; height:7px; border-radius:50%; background:#bbb; animation:yp-bounce 1.2s infinite; }
        .yp-dot:nth-child(2){animation-delay:0.2s;} .yp-dot:nth-child(3){animation-delay:0.4s;}
        @keyframes yp-bounce { 0%,60%,100%{transform:translateY(0);} 30%{transform:translateY(-6px);} }
        .yp-cat-card { cursor:pointer; transition:transform 0.2s,box-shadow 0.2s; }
        .yp-cat-card:hover { transform:translateY(-3px); box-shadow:0 8px 28px rgba(0,0,0,0.10) !important; }
        .yp-sq-btn { transition:background 0.12s; }
        .yp-sq-btn:hover { background:#F5F0FF !important; }
        .sss-answer { overflow:hidden; transition:max-height 0.28s ease,padding 0.28s ease; }

        /* Hero stat chips — glassmorphism */
        .yp-stat-chip {
          background: rgba(255,255,255,0.18);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.28);
          border-radius: 14px;
          padding: 8px 14px;
          display: flex; align-items: center; gap: 8px;
          flex: 1; min-width: 0;
        }

        /* Hero wave clip */
        .yp-hero-wrap {
          background: linear-gradient(135deg, #7C3AED 0%, #8B5CF6 55%, #A78BFA 100%);
          padding: 32px 24px 52px;
          position: relative; overflow: hidden;
        }
        .yp-hero-wave {
          position: absolute; bottom: 0; left: 0; right: 0;
          line-height: 0;
        }
        .yp-hero-wave svg { display: block; }

        /* Two-column body */
        .yp-ai-body {
          max-width: 1200px; margin: 0 auto;
          padding: 0 20px 40px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 28px;
        }
        @media (min-width: 1024px) {
          .yp-ai-body { grid-template-columns: 2fr 1fr; align-items: start; }
          .yp-hero-wrap { padding: 48px 40px 64px; }
          .yp-hero-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 0; }
          .yp-hero-left { flex: 1; }
          .yp-hero-right { position: relative; width: 300px; flex-shrink: 0; }
          .yp-cat-grid { display: grid !important; grid-template-columns: repeat(3, 1fr) !important; }
          .yp-cat-grid-last-row { display: grid !important; grid-template-columns: repeat(2, 1fr) !important; }
          .yp-stat-chips { flex-wrap: nowrap !important; }
          .yp-chat-sticky { position: sticky; top: 90px; }
        }
        @media (max-width: 1023px) {
          .yp-hero-right { display: none !important; }
          .yp-cat-grid { display: grid !important; grid-template-columns: repeat(2, 1fr) !important; }
          .yp-cat-grid-last-row { display: grid !important; grid-template-columns: 1fr !important; }
          .yp-stat-chips { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
        }
      `}</style>

      {/* ══ HERO ════════════════════════════════════════════ */}
      <div className="yp-hero-wrap">
        {/* decorative circles */}
        <div style={{position:"absolute",top:-40,right:-20,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.07)"}}/>
        <div style={{position:"absolute",bottom:20,left:-10,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
        <div style={{position:"absolute",top:30,right:280,width:60,height:60,borderRadius:"50%",background:"rgba(255,255,255,0.08)"}}/>

        <div className="yp-hero-inner">
          {/* Left */}
          <div className="yp-hero-left">
            {/* Robot icon badge */}
            <div style={{width:56,height:56,borderRadius:18,background:"rgba(255,255,255,0.18)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:18,backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.25)"}}>
              <Bot size={30} color="#fff"/>
            </div>
            <h1 style={{fontSize:32,fontWeight:900,color:"#fff",margin:"0 0 10px",lineHeight:1.15}}>AI Poodle Asistanı</h1>
            <p style={{fontSize:15,color:"rgba(255,255,255,0.88)",lineHeight:1.6,margin:"0 0 24px",maxWidth:480}}>
              Poodle'nız hakkında her soruyu sorun — beslenme, bakım, eğitim ve sağlık.
            </p>

            {/* Stat chips */}
            <div className="yp-stat-chips" style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {[
                {icon:"💬",top:"7/24",bot:"Aktif"},
                {icon:"👑",top:"Ücretsiz",bot:"Her zaman"},
                {icon:"💭",top:"5sn",bot:"Ortalama yanıt"},
                {icon:"⭐",top:"5",bot:"Kategori"},
              ].map(({icon,top,bot})=>(
                <div key={bot} className="yp-stat-chip">
                  <span style={{fontSize:18}}>{icon}</span>
                  <div>
                    <div style={{fontSize:14,fontWeight:800,color:"#fff",lineHeight:1.2}}>{top}</div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.72)"}}>{bot}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — poodle photo + speech bubble */}
          <div className="yp-hero-right" style={{display:"block",textAlign:"right",position:"relative"}}>
            {/* Speech bubble */}
            <div style={{position:"absolute",left:-10,top:30,background:"#fff",borderRadius:16,padding:"12px 16px",boxShadow:"0 8px 32px rgba(0,0,0,0.15)",maxWidth:200,zIndex:10}}>
              <p style={{margin:0,fontSize:13,fontWeight:700,color:"#222",lineHeight:1.5}}>
                Merhaba! 👋<br/>Ben AI Poodle Asistanı.<br/>Poodle'nız için buradayım!
              </p>
              {/* bubble tail */}
              <div style={{position:"absolute",bottom:-8,left:20,width:16,height:16,background:"#fff",transform:"rotate(45deg)",boxShadow:"4px 4px 8px rgba(0,0,0,0.06)"}}/>
            </div>
            <img src="/images/toy-poodle-hero.webp" alt="Toy Poodle"
              onError={e=>{(e.currentTarget as HTMLImageElement).style.display="none";}}
              style={{height:220,width:"auto",objectFit:"contain",position:"relative",zIndex:5,marginTop:10}}/>
          </div>
        </div>

        {/* Wave divider */}
        <div className="yp-hero-wave">
          <svg viewBox="0 0 1440 40" preserveAspectRatio="none" style={{width:"100%",height:40}}>
            <path d="M0,40 C360,0 1080,0 1440,40 L1440,40 L0,40 Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </div>

      {/* ══ BODY ════════════════════════════════════════════ */}
      <div style={{background:"#F9FAFB",paddingTop:4}}>
        <div className="yp-ai-body">

          {/* ── LEFT COLUMN ────────────────────────────────── */}
          <div>
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" style={{display:"flex",gap:4,alignItems:"center",fontSize:12.5,color:"#9CA3AF",margin:"20px 0 22px"}}>
              <a href="/yourpoodle" style={{color:"#7C3AED",textDecoration:"none",fontWeight:600}}>Ana Sayfa</a>
              <ChevronRight size={12}/>
              <span style={{color:"#374151",fontWeight:600}}>AI Poodle Asistanı</span>
            </nav>

            {/* Section title */}
            <div style={{marginBottom:20}}>
              <h2 style={{fontSize:20,fontWeight:800,color:"#111827",margin:"0 0 6px",display:"flex",alignItems:"center",gap:6}}>
                <span>✨</span> Size Nasıl Yardımcı Olabilirim?
              </h2>
              <p style={{fontSize:14,color:"#6B7280",margin:0}}>Aşağıdaki konulardan birini seçin veya sorunuzu yazın.</p>
            </div>

            {/* Category grid — first 3 */}
            <div className="yp-cat-grid" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14,marginBottom:14}}>
              {CATS.slice(0,3).map(c=>(
                <CatCard key={c.id} cat={c} active={activeCat===c.id}
                  onClick={()=>{ selectCat(c.id); chatRef.current?.scrollIntoView({behavior:"smooth",block:"nearest"}); }}
                  onSend={q=>{ selectCat(c.id); sendQ(q); chatRef.current?.scrollIntoView({behavior:"smooth",block:"nearest"}); }}/>
              ))}
            </div>
            {/* Category grid — last 2 */}
            <div className="yp-cat-grid-last-row" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14,marginBottom:14}}>
              {CATS.slice(3).map(c=>(
                <CatCard key={c.id} cat={c} active={activeCat===c.id}
                  onClick={()=>{ selectCat(c.id); chatRef.current?.scrollIntoView({behavior:"smooth",block:"nearest"}); }}
                  onSend={q=>{ selectCat(c.id); sendQ(q); chatRef.current?.scrollIntoView({behavior:"smooth",block:"nearest"}); }}/>
              ))}
            </div>

            {/* Poodle Profilim full-width card */}
            <button onClick={()=>{ setShowProfile(!showProfile); track("ai_profile_opened"); }}
              className="yp-cat-card"
              style={{width:"100%",display:"flex",alignItems:"center",gap:16,padding:"18px 20px",background:"#F3E8FF",borderRadius:20,border:"1.5px solid #DDD5FF",cursor:"pointer",boxShadow:"0 2px 10px rgba(0,0,0,0.05)"}}>
              <div style={{width:52,height:52,borderRadius:16,background:"#E9D5FF",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <Dog size={26} color="#7C3AED"/>
              </div>
              <div style={{flex:1,textAlign:"left"}}>
                <div style={{fontSize:15,fontWeight:800,color:"#111827",marginBottom:3}}>Poodle Profilim</div>
                <div style={{fontSize:13,color:"#6B7280",lineHeight:1.45}}>Poodle'nızın bilgilerini ekleyin, size özel öneriler alın.</div>
              </div>
              {hasProfile && <span style={{fontSize:11,fontWeight:700,background:"#7C3AED",color:"#fff",borderRadius:20,padding:"3px 10px",flexShrink:0}}>Dolu</span>}
              <ChevronRight size={20} color="#7C3AED" style={{flexShrink:0,transform:showProfile?"rotate(90deg)":"none",transition:"transform 0.2s"}}/>
            </button>

            {/* Profile form */}
            {showProfile && (
              <div style={{background:"#fff",borderRadius:16,border:"1.5px solid #DDD5FF",padding:"18px",marginTop:12}}>
                <p style={{fontSize:13,color:"#6B7280",marginBottom:14,lineHeight:1.5}}>
                  Poodle'ınızın bilgilerini girerek daha kişisel öneriler alın (isteğe bağlı):
                </p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                  {PROFILE_FIELDS.map(f=>(
                    <div key={f.key}>
                      <label htmlFor={"prf-"+f.key} style={{fontSize:11.5,fontWeight:700,color:"#374151",display:"block",marginBottom:4}}>{f.label}</label>
                      <input id={"prf-"+f.key}
                        value={profile[f.key as keyof Profile]}
                        onChange={e=>setProfile(p=>({...p,[f.key]:e.target.value}))}
                        placeholder={f.placeholder}
                        style={{width:"100%",border:"1.5px solid #E5E7EB",borderRadius:10,padding:"8px 12px",fontSize:13,outline:"none",fontFamily:"inherit",background:"#F9FAFB"}}
                        onFocus={e=>{e.currentTarget.style.borderColor="#7C3AED";}}
                        onBlur={e=>{e.currentTarget.style.borderColor="#E5E7EB";}}/>
                    </div>
                  ))}
                </div>
                <button onClick={()=>setShowProfile(false)}
                  style={{width:"100%",height:40,borderRadius:10,border:"none",background:"#7C3AED",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer"}}>
                  Kaydet ✓
                </button>
              </div>
            )}

            {/* SSS Accordion */}
            <div style={{marginTop:32}}>
              <h2 style={{fontSize:17,fontWeight:800,color:"#111827",marginBottom:14}}>💡 Sık Sorulan Sorular</h2>
              <div style={{background:"#fff",borderRadius:18,border:"1.5px solid #E5E7EB",overflow:"hidden",boxShadow:"0 2px 10px rgba(0,0,0,0.05)"}}>
                {SSS.map((s,i)=>{
                  const open=expandedSss===i;
                  return(
                    <div key={i} style={{borderBottom:i<SSS.length-1?"1px solid #F3F4F6":"none"}}>
                      <button onClick={()=>setExpandedSss(open?null:i)} aria-expanded={open}
                        style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 18px",background:"none",border:"none",cursor:"pointer",textAlign:"left",gap:10}}>
                        <span style={{fontSize:14,fontWeight:700,color:"#111827",lineHeight:1.4}}>S: {s.q}</span>
                        <span style={{fontSize:18,color:"#7C3AED",flexShrink:0}} aria-hidden="true">{open?"−":"+"}</span>
                      </button>
                      <div className="sss-answer" style={{maxHeight:open?"400px":"0px",padding:open?"0 18px 14px":"0 18px"}}>
                        <p style={{fontSize:13.5,color:"#4B5563",lineHeight:1.7,margin:"0 0 10px"}}>
                          <span style={{fontWeight:700,color:"#7C3AED"}}>C: </span>{s.a}
                        </p>
                        <button onClick={()=>sendQ(s.q)} disabled={limitReached}
                          style={{padding:"7px 16px",borderRadius:20,border:"1.5px solid #7C3AED",background:"#fff",color:"#7C3AED",fontSize:12.5,fontWeight:700,cursor:limitReached?"not-allowed":"pointer",opacity:limitReached?0.5:1}}>
                          💬 Asistana sor →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN — Chat panel ───────────────────── */}
          <div className="yp-chat-sticky" ref={chatRef}>
            <div style={{background:"#fff",borderRadius:24,boxShadow:"0 8px 40px rgba(139,92,246,0.12)",border:"1px solid #EDE9FE",overflow:"hidden",marginTop:56}}>

              {/* Suggested questions header */}
              <div style={{padding:"18px 20px 14px",borderBottom:"1px solid #F3F4F6"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:32,height:32,borderRadius:10,background:"#F3E8FF",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <Bot size={17} color="#7C3AED"/>
                    </div>
                    <div>
                      <div style={{fontSize:14,fontWeight:800,color:"#111827"}}>Önerilen Sorular</div>
                      <div style={{fontSize:11.5,color:"#9CA3AF"}}>Sık sorulan sorulara göz atın.</div>
                    </div>
                  </div>
                  {messages.length>0 && (
                    <button onClick={resetChat} title="Yeni Sohbet" aria-label="Sohbeti temizle"
                      style={{background:"#F3F4F6",border:"none",borderRadius:8,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#6B7280"}}>
                      <RotateCcw size={14}/>
                    </button>
                  )}
                </div>

                {/* Suggested question list — always visible when no messages, otherwise collapsible */}
                {(showExamples || messages.length === 0) && (
                  <div style={{display:"flex",flexDirection:"column",gap:1}}>
                    {(messages.length===0 ? SUGGESTED_QS : currentCat.qs).map((q,qi)=>(
                      <button key={qi} onClick={()=>sendQ(q)} disabled={limitReached} className="yp-sq-btn"
                        style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",padding:"11px 14px",borderRadius:12,background:"#FAFAFA",border:"none",textAlign:"left",fontSize:13.5,color:limitReached?"#9CA3AF":"#374151",cursor:limitReached?"not-allowed":"pointer",fontFamily:"inherit",lineHeight:1.4,gap:8}}>
                        <span style={{display:"flex",alignItems:"center",gap:8}}>
                          <span style={{fontSize:14,color:"#8B5CF6",flexShrink:0}}>💬</span>
                          {q}
                        </span>
                        <ChevronRight size={14} color="#D1D5DB" style={{flexShrink:0}}/>
                      </button>
                    ))}
                  </div>
                )}

                {/* Category tab pills — when chat started */}
                {messages.length > 0 && (
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:4}}>
                    {CATS.map(c=>(
                      <button key={c.id} onClick={()=>selectCat(c.id)}
                        style={{display:"flex",alignItems:"center",gap:4,padding:"5px 12px",borderRadius:20,border:"1.5px solid",borderColor:activeCat===c.id?"#7C3AED":"#E5E7EB",background:activeCat===c.id?"#7C3AED":"#fff",color:activeCat===c.id?"#fff":"#374151",fontSize:12,fontWeight:700,cursor:"pointer",transition:"all 0.15s"}}>
                        <c.Icon size={12}/> {c.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Health warning */}
              {isHealthCat && (
                <div style={{background:"#FFF1F2",borderBottom:"1px solid #FEE2E2",padding:"9px 16px",display:"flex",alignItems:"center",gap:8}}>
                  <AlertTriangle size={14} color="#EF4444" style={{flexShrink:0}}/>
                  <span style={{fontSize:12,color:"#991B1B"}}>
                    ⚠️ Acil durum mu?{" "}
                    <a href="/yourpoodle/rehber/poodle-saglik-sorunlari" style={{color:"#7C3AED",fontWeight:700,textDecoration:"none"}}>Acil belirti rehberi →</a>
                  </span>
                </div>
              )}

              {/* Messages area */}
              {messages.length > 0 && (
                <div ref={msgsRef} className="yp-ai-msgs" role="log" aria-live="polite"
                  style={{minHeight:200,maxHeight:"50vh",overflowY:"auto",padding:"14px 16px 8px",display:"flex",flexDirection:"column",gap:11,background:"#FAFAFA"}}>

                  {messages.length===0 && (
                    <div style={{display:"flex",gap:9,alignItems:"flex-start"}}>
                      <div style={{width:30,height:30,borderRadius:"50%",background:"#F0E8FF",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <Bot size={15} color="#7C3AED"/>
                      </div>
                      <div className="yp-msg-bot">{greeting}</div>
                    </div>
                  )}

                  {messages.map((m,i)=>(
                    <div key={i} style={{display:"flex",gap:8,alignItems:"flex-end",flexDirection:m.role==="user"?"row-reverse":"row"}}>
                      {m.role==="assistant" && (
                        <div style={{width:28,height:28,borderRadius:"50%",background:"#F0E8FF",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          <Bot size={14} color="#7C3AED"/>
                        </div>
                      )}
                      <div className={m.role==="user"?"yp-msg-user":"yp-msg-bot"}>{m.content}</div>
                      {m.role==="user" && (
                        <div style={{width:28,height:28,borderRadius:"50%",background:"#7C3AED",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          <User size={14} color="#fff"/>
                        </div>
                      )}
                    </div>
                  ))}

                  {loading && (
                    <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
                      <div style={{width:28,height:28,borderRadius:"50%",background:"#F0E8FF",display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <Bot size={14} color="#7C3AED"/>
                      </div>
                      <div style={{background:"#fff",borderRadius:"18px 18px 18px 4px",padding:"14px 16px",boxShadow:"0 2px 12px rgba(0,0,0,0.07)"}}>
                        <div style={{display:"flex",gap:4}}><div className="yp-dot"/><div className="yp-dot"/><div className="yp-dot"/></div>
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef}/>
                </div>
              )}

              {/* Limit reached */}
              {limitReached && (
                <div style={{borderTop:"1px solid #EDE9FE",padding:"12px 16px",background:"#FFF7ED"}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#92400E",marginBottom:6}}>⛔ Günlük 5 ücretsiz sorunuz doldu</div>
                  <div style={{fontSize:12,color:"#92400E",marginBottom:8}}>Yarın tekrar soru sorabilir ya da Club üyesi olarak sınırsız erişim alabilirsiniz.</div>
                  <button onClick={()=>navigate("/yourpoodle/kayit")}
                    style={{padding:"7px 16px",borderRadius:20,border:"none",background:"#7C3AED",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                    Club Üyesi Ol → Sınırsız Soru
                  </button>
                </div>
              )}

              {/* Remaining badge */}
              {!limitReached && messages.length > 0 && (
                <div style={{padding:"6px 16px",background:"#F9FAFB",borderTop:"1px solid #F3F4F6",display:"flex",justifyContent:"flex-end"}}>
                  <span style={{fontSize:11,fontWeight:700,color:"#8B5CF6",background:"#EDE9FE",borderRadius:20,padding:"3px 10px"}}>
                    {remainingQuestions}/{DAILY_LIMIT} soru kaldı
                  </span>
                </div>
              )}

              {/* Input */}
              <div style={{padding:"12px 14px",display:"flex",gap:8,alignItems:"flex-end",background:"#fff",borderTop:"1px solid #F3F4F6"}}>
                <textarea ref={textareaRef}
                  value={input}
                  onChange={e=>{setInput(e.target.value);e.target.style.height="44px";e.target.style.height=Math.min(e.target.scrollHeight,120)+"px";}}
                  onKeyDown={handleKey}
                  placeholder={limitReached?"Günlük limit doldu":"Sorunuzu buraya yazın..."}
                  disabled={limitReached}
                  rows={1}
                  aria-label="Poodle sorunuzu yazın"
                  style={{flex:1,border:"1.5px solid #E5E7EB",borderRadius:14,padding:"10px 14px",fontSize:14,fontFamily:"inherit",resize:"none",outline:"none",minHeight:44,maxHeight:120,background:limitReached?"#F5F5F5":"#F9FAFB",color:"#111827",lineHeight:1.5,transition:"border-color 0.15s"}}
                  onFocus={e=>{if(!limitReached)e.target.style.borderColor="#7C3AED";}}
                  onBlur={e=>{e.target.style.borderColor="#E5E7EB";}}/>
                <button onClick={()=>send()} disabled={!input.trim()||loading||limitReached} aria-label="Gönder"
                  style={{width:44,height:44,borderRadius:14,background:input.trim()&&!loading&&!limitReached?"#7C3AED":"#D1D5DB",border:"none",cursor:input.trim()&&!loading&&!limitReached?"pointer":"not-allowed",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:"#fff",transition:"background 0.15s"}}>
                  <Send size={18}/>
                </button>
              </div>

              {/* Privacy note */}
              <div style={{padding:"8px 16px 12px",background:"#fff",borderTop:"1px solid #F9FAFB"}}>
                <p style={{fontSize:11.5,color:"#9CA3AF",margin:0,lineHeight:1.5}}>
                  🔒 Sohbetleriniz gizlidir ve üçüncü kişilerle paylaşılmaz.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile FAB to scroll to chat */}
      <style>{`@media(max-width:1023px){.yp-chat-fab{display:flex !important;}}`}</style>
      <button className="yp-chat-fab" onClick={()=>chatRef.current?.scrollIntoView({behavior:"smooth",block:"start"})}
        aria-label="Soru Sor"
        style={{display:"none",position:"fixed",bottom:80,right:18,zIndex:400,width:54,height:54,borderRadius:"50%",background:"#7C3AED",border:"none",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 20px rgba(124,58,237,0.4)",cursor:"pointer",color:"#fff",fontSize:22}}>
        💬
      </button>
    </YPLayout>
  );
}

/* ─── Category Card ─────────────────────────────────── */
function CatCard({
  cat, active, onClick, onSend,
}:{
  cat: typeof CATS[number];
  active: boolean;
  onClick: ()=>void;
  onSend: (q:string)=>void;
}) {
  const { label, desc, Icon, color, bg } = cat;
  return (
    <div className="yp-cat-card" onClick={onClick}
      style={{background:"#fff",borderRadius:20,padding:"18px 16px",border:`1.5px solid ${active?"#C4B5FD":"#F3F4F6"}`,cursor:"pointer",boxShadow:active?"0 4px 20px rgba(139,92,246,0.12)":"0 2px 8px rgba(0,0,0,0.05)",position:"relative",overflow:"hidden"}}>
      {active && <div style={{position:"absolute",inset:0,background:"rgba(139,92,246,0.03)",borderRadius:20}}/>}
      {/* Icon circle */}
      <div style={{width:48,height:48,borderRadius:16,background:bg,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12}}>
        <Icon size={24} color={color} strokeWidth={2}/>
      </div>
      <div style={{fontSize:15,fontWeight:800,color:"#111827",marginBottom:5}}>{label}</div>
      <div style={{fontSize:12.5,color:"#6B7280",lineHeight:1.5,marginBottom:12}}>{desc}</div>
      {/* Arrow button */}
      <div style={{display:"flex",justifyContent:"flex-end"}}>
        <button onClick={e=>{e.stopPropagation();onSend(cat.qs[0]);}}
          style={{width:30,height:30,borderRadius:"50%",background:bg,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          <ChevronRight size={15} color={color}/>
        </button>
      </div>
    </div>
  );
}
