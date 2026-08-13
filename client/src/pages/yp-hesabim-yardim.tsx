// Route: /hesabim/yardim
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft, Search, Headphones, Package, RefreshCw, CreditCard,
  ShoppingBag, PawPrint, User, ChevronRight, MessageCircle,
  Mail, Phone, Plus, Minus, X,
} from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { goBack } from "@/lib/goBack";
import {
  SUPPORT_BRAND as P,
  SUPPORT_BRAND_LIGHT as PL,
  fetchSupportTickets,
  formatTicketDate,
  ticketStatusGroup,
} from "@/lib/support-api";

/* ── Palette ─────────────────────────── */
const NAV = "#1D1E9B";
const DRK = "#111827";
const GT  = "#6B7280";
const GB  = "#E5E7EB";
const GBG = "#F9FAFB";
const GBR = "#F3F4F6";

/* ── FAQ data ───────────────────────── */
const FAQ = [
  { id:"faq-1", q:"Siparişimi nasıl takip edebilirim?",
    a:"Hesabım > Siparişlerim bölümünden kargo durumunu anlık takip edebilirsiniz." },
  { id:"faq-2", q:"İade süresi kaç gündür?",
    a:"Ürünü teslim aldıktan sonra 14 gün içinde iade talebi oluşturabilirsiniz." },
  { id:"faq-3", q:"Peşin fiyatına 3 taksit nasıl uygulanır?",
    a:"Sepet ve ödeme adımında uygun kartlarla otomatik olarak uygulanır. Ekstra ücret alınmaz." },
  { id:"faq-4", q:"Yanlış ürün geldi, ne yapmalıyım?",
    a:"Yardım Merkezi > Mesaj Gönder üzerinden sipariş numaranızla bildirim oluşturun. Ekibimiz 24 saat içinde dönüş yapar." },
  { id:"faq-5", q:"Club paylaşımımı nasıl silebilirim?",
    a:"Paylaşımınızın sağ üst menüsünden Düzenle veya Sil seçeneklerine ulaşabilirsiniz." },
  { id:"faq-6", q:"Telefon numaramı nasıl değiştiririm?",
    a:"Hesabım > Hesap Ayarları > Cep Telefonu bölümünden güncelleyebilirsiniz." },
];

/* ── Quick help categories ───────────── */
const CATS = [
  { id:"orders",     title:"Siparişlerim",   sub:"Kargo ve teslimat",         Icon:Package,    bg:"#F5F0E6", ic:P },
  { id:"returns",    title:"İade ve Değişim", sub:"Kolay iade işlemleri",     Icon:RefreshCw,  bg:"#F0FDF4", ic:"#16A34A" },
  { id:"payment",    title:"Ödeme",           sub:"Kart ve taksit sorunları", Icon:CreditCard, bg:"#FFF7ED", ic:"#EA580C" },
  { id:"products",   title:"Ürünler",         sub:"Mama ve ürün bilgileri",   Icon:ShoppingBag,bg:"#EFF6FF", ic:"#3B82F6" },
  { id:"club",       title:"Club",            sub:"Paylaşım ve hesap desteği",Icon:PawPrint,   bg:"#FDF2F8", ic:"#EC4899" },
  { id:"membership", title:"Üyelik",          sub:"Telefon ve profil işlemleri",Icon:User,     bg:"#FEF2F2", ic:"#EF4444" },
];

/* ── Live Support Modal ─────────────── */
function LiveSupportModal({ onClose, showToast }: { onClose:()=>void; showToast:(m:string)=>void }) {
  const [msg, setMsg] = useState("");
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)",
                  display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:9999 }}>
      <div style={{ background:"#fff", borderRadius:"20px 20px 0 0",
                    padding:"24px 20px 36px", width:"100%", maxWidth: "var(--yp-shell-max)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
          <span style={{ fontSize:17, fontWeight:700, color:DRK }}>Canlı Destek</span>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer" }}>
            <X size={20} color={GT} />
          </button>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:16 }}>
          <span style={{ width:8, height:8, borderRadius:"50%", background:"#22C55E", flexShrink:0, display:"inline-block" }} />
          <span style={{ fontSize:13, fontWeight:600, color:"#16A34A" }}>Destek ekibimiz çevrimiçi</span>
        </div>
        <textarea value={msg} onChange={e=>setMsg(e.target.value)}
          placeholder="Sorununuzu kısaca yazın..."
          rows={4}
          style={{ width:"100%", padding:"10px 12px", borderRadius:12,
                   border:`1.5px solid ${GB}`, fontSize:14, fontFamily:"inherit",
                   color:DRK, resize:"none", outline:"none", boxSizing:"border-box" as any, marginBottom:12 }} />
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onClose}
            style={{ flex:1, padding:"12px 0", borderRadius:12, border:`1.5px solid ${GB}`,
                     background:"#fff", fontSize:14, fontWeight:600, color:GT,
                     cursor:"pointer", fontFamily:"inherit" }}>Kapat</button>
          <button onClick={() => { showToast("Mesajınız iletildi ✓"); onClose(); }}
            style={{ flex:1, padding:"12px 0", borderRadius:12, border:"none",
                     background:P, fontSize:14, fontWeight:700, color:"#fff",
                     cursor:"pointer", fontFamily:"inherit" }}>Gönder</button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════
   MAIN PAGE
════════════════════════════ */
export default function YPHesabimYardimPage() {
  const [, navigate] = useLocation();
  const [searchQ, setSearchQ]       = useState("");
  const [searchRes, setSearchRes]   = useState<typeof FAQ | null>(null);
  const [expandedId, setExpandedId] = useState<string>("faq-1");
  const [showAll, setShowAll]       = useState(false);
  const [liveOpen, setLiveOpen]     = useState(false);
  const [toast, setToast]           = useState("");

  const { data: tickets = [] } = useQuery({
    queryKey: ["/api/customer/support-tickets"],
    queryFn: fetchSupportTickets,
  });

  const activeTicket = useMemo(
    () => tickets.find(t => ticketStatusGroup(t.status) !== "solved") ?? null,
    [tickets],
  );

  const showToast = (m: string) => { setToast(m); setTimeout(()=>setToast(""), 2200); };

  const performSearch = () => {
    if (!searchQ.trim()) { setSearchRes(null); return; }
    const q = searchQ.toLowerCase();
    const res = FAQ.filter(f => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
    setSearchRes(res);
    if (res.length === 1) setExpandedId(res[0].id);
  };

  const visibleFaq = searchRes ?? (showAll ? FAQ : FAQ.slice(0, 6));

  return (
    <YPLayout activeLink="club" constrain={false}>
      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed", top:72, left:"50%", transform:"translateX(-50%)",
                      background:"#111", color:"#fff", padding:"10px 22px", borderRadius:12,
                      fontSize:13, fontWeight:600, zIndex:9999, whiteSpace:"nowrap",
                      boxShadow:"0 4px 20px rgba(0,0,0,.3)" }}>
          {toast}
        </div>
      )}

      {/* Live Support Modal */}
      {liveOpen && <LiveSupportModal onClose={() => setLiveOpen(false)} showToast={showToast} />}

      <div style={{ maxWidth: "var(--yp-shell-max)", margin:"0 auto", fontFamily:"'Inter',-apple-system,sans-serif",
                    background:"#fff", minHeight:"100vh", color:DRK, paddingBottom:0 }}>

        {/* ── PAGE HEADER ── */}
        <div style={{ padding:"14px 16px 12px", background:"#fff",
                      borderBottom:`1px solid ${GBR}`, marginBottom:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:12 }}>
            <button onClick={() => goBack(navigate, "/hesabim")}
              style={{ background:"none", border:"none", cursor:"pointer", padding:0, display:"flex" }}>
              <ArrowLeft size={17} color={P} />
            </button>
            <span style={{ fontSize:12, color:P, fontWeight:500 }}>Hesabım</span>
            <span style={{ fontSize:12, color:P }}>/</span>
            <span style={{ fontSize:12, color:P, fontWeight:700 }}>Yardım Merkezi</span>
          </div>
          <h1 style={{ fontSize:22, fontWeight:800, color:P, margin:"0 0 4px", lineHeight:1.25 }}>
            Size nasıl yardımcı olabiliriz?
          </h1>
          <p style={{ fontSize:13, color:GT, margin:0 }}>
            Aradığınız cevabı bulun veya destek ekibimize ulaşın.
          </p>
        </div>

        {/* ── SEARCH BAR ── */}
        <div style={{ padding:"0 16px 14px" }}>
          <div style={{ display:"flex", gap:8 }}>
            <div style={{ flex:1, position:"relative" }}>
              <Search size={16} color="#9CA3AF"
                style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }} />
              <input
                value={searchQ}
                onChange={e => { setSearchQ(e.target.value); if (!e.target.value) setSearchRes(null); }}
                onKeyDown={e => e.key === "Enter" && performSearch()}
                placeholder="Sipariş, ödeme veya ürün hakkında ara..."
                style={{ width:"100%", background:GBG, border:`1px solid ${GB}`,
                         borderRadius:12, paddingLeft:38, paddingRight:14,
                         paddingTop:10, paddingBottom:10, fontSize:13,
                         fontFamily:"inherit", color:DRK, outline:"none", boxSizing:"border-box" as any }} />
            </div>
            <button onClick={performSearch}
              style={{ flexShrink:0, background:P, color:"#fff", border:"none",
                       borderRadius:12, padding:"10px 20px", fontSize:13, fontWeight:700,
                       cursor:"pointer", fontFamily:"inherit" }}>
              Ara
            </button>
          </div>

          {/* Search results */}
          {searchRes !== null && (
            <div style={{ marginTop:10, border:`1px solid ${GBR}`, borderRadius:12, overflow:"hidden" }}>
              {searchRes.length === 0 ? (
                <div style={{ padding:"14px 16px", fontSize:13, color:GT }}>Sonuç bulunamadı.</div>
              ) : (
                searchRes.map(f => (
                  <div key={f.id} style={{ padding:"12px 16px", borderBottom:`1px solid ${GBR}` }}>
                    <div style={{ fontSize:13, fontWeight:600, color:DRK, marginBottom:4 }}>{f.q}</div>
                    <div style={{ fontSize:12, color:GT, lineHeight:1.5 }}>{f.a}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* ── LIVE SUPPORT BANNER ── */}
        <div style={{ margin:"0 16px 16px",
                      background:PL, border:"1px solid #E9D5FF",
                      borderRadius:16, padding:"14px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:44, height:44, borderRadius:"50%", background:"#fff",
                          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Headphones size={20} color={P} />
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ fontSize:13, fontWeight:700, color:DRK }}>Destek ekibimiz çevrimiçi</span>
                <span style={{ width:8, height:8, borderRadius:"50%", background:"#22C55E",
                               display:"inline-block", flexShrink:0 }} />
              </div>
              <div style={{ fontSize:11, color:GT, marginTop:2 }}>Ortalama yanıt süresi 3 dakika</div>
            </div>
            <button onClick={() => setLiveOpen(true)}
              style={{ flexShrink:0, border:`1.5px solid ${P}`, color:P,
                       background:"#fff", borderRadius:12, padding:"8px 10px",
                       fontSize:10, fontWeight:700, cursor:"pointer",
                       fontFamily:"inherit", whiteSpace:"nowrap" }}>
              Canlı Desteği Başlat
            </button>
          </div>
        </div>

        {/* ── HIZLI YARDIM ── */}
        <div style={{ padding:"0 16px 16px" }}>
          <div style={{ fontSize:14, fontWeight:700, color:DRK, marginBottom:12 }}>Hızlı Yardım</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {CATS.map(({ id, title, sub, Icon, bg, ic }) => (
              <button key={id}
                onClick={() => navigate("/hesabim/yardim/yeni-talep")}
                style={{ background:"#fff", border:`1px solid ${GBR}`, borderRadius:16,
                         padding:"14px", textAlign:"left", cursor:"pointer",
                         fontFamily:"inherit", display:"flex", flexDirection:"column", gap:8 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:bg,
                              display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon size={17} color={ic} />
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:DRK }}>{title}</div>
                  <div style={{ fontSize:11, color:GT, marginTop:2 }}>{sub}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding:"0 16px 16px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <span style={{ fontSize:14, fontWeight:700, color:DRK }}>
              Devam Eden Destek Talebiniz
            </span>
            <button onClick={() => navigate("/hesabim/destek-talepleri")}
              style={{ background:"none", border:"none", color:P, fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
              Tümü
            </button>
          </div>
          {!activeTicket ? (
            <div style={{ background:"#fff", border:`1px solid ${GBR}`, borderRadius:16, padding:"20px 14px", textAlign:"center" }}>
              <div style={{ fontSize:13, color:GT, marginBottom:12 }}>Açık destek talebiniz yok.</div>
              <button onClick={() => navigate("/hesabim/yardim/yeni-talep")}
                style={{ background:P, color:"#fff", border:"none", borderRadius:12, padding:"9px 14px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                Yeni Talep Oluştur
              </button>
            </div>
          ) : (
          <button
            onClick={() => navigate(`/hesabim/yardim/talep/${activeTicket.id}`)}
            style={{ width:"100%", background:"#fff", border:`1px solid ${GBR}`,
                     borderRadius:16, padding:"14px", cursor:"pointer", fontFamily:"inherit",
                     textAlign:"left" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ fontSize:10, fontWeight:700, color:P, background:PL, padding:"3px 9px", borderRadius:999 }}>
                {ticketStatusGroup(activeTicket.status) === "replied" ? "Yanıtlandı" : "İnceleniyor"}
              </span>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ fontSize:11, color:GT, fontWeight:500 }}>#{activeTicket.id}</span>
                <ChevronRight size={15} color="#D1D5DB" />
              </div>
            </div>
            <div style={{ fontSize:14, fontWeight:700, color:DRK, marginBottom:3 }}>
              {activeTicket.subject}
            </div>
            {activeTicket.orderId != null && (
              <div style={{ fontSize:12, color:GT, marginBottom:12 }}>
                Sipariş: {activeTicket.orderId}
              </div>
            )}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                          borderTop:`1px solid ${GBR}`, paddingTop:12 }}>
              <span style={{ fontSize:11, color:"#9CA3AF" }}>
                Son güncelleme: {formatTicketDate(activeTicket.updatedAt || activeTicket.createdAt)}
              </span>
              <button
                onClick={e => { e.stopPropagation(); navigate(`/hesabim/yardim/talep/${activeTicket.id}`); }}
                style={{ fontSize:10, fontWeight:700, color:P, border:`1px solid ${P}`,
                         background:"#fff", borderRadius:8, padding:"5px 10px",
                         cursor:"pointer", fontFamily:"inherit" }}>
                Talebi Gör
              </button>
            </div>
          </button>
          )}
        </div>

        {/* ── SIK SORULAN SORULAR ── */}
        <div style={{ padding:"0 16px 16px" }}>
          <div style={{ fontSize:14, fontWeight:700, color:DRK, marginBottom:12 }}>
            Sık Sorulan Sorular
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {visibleFaq.map(f => (
              <div key={f.id}
                style={{ background:"#fff", border:`1px solid ${GBR}`,
                         borderRadius:12, overflow:"hidden" }}>
                {/* Header */}
                <button
                  onClick={() => setExpandedId(expandedId === f.id ? "" : f.id)}
                  style={{ width:"100%", display:"flex", alignItems:"center",
                           justifyContent:"space-between",
                           padding:"14px 16px", background:"none", border:"none",
                           cursor:"pointer", fontFamily:"inherit", textAlign:"left" }}>
                  <span style={{ flex:1, paddingRight:10, fontSize:13,
                                 fontWeight:600, color:DRK }}>
                    {f.q}
                  </span>
                  {expandedId === f.id
                    ? <Minus size={17} color={P} style={{ flexShrink:0 }} />
                    : <Plus  size={17} color="#9CA3AF" style={{ flexShrink:0 }} />}
                </button>
                {/* Answer */}
                {expandedId === f.id && (
                  <div style={{ padding:"0 16px 14px",
                                borderTop:`1px solid ${GBR}` }}>
                    <div style={{ fontSize:13, color:GT, lineHeight:1.6, paddingTop:10 }}>
                      {f.a}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Tüm Soruları Gör */}
          {!showAll && !searchRes && (
            <button
              onClick={() => setShowAll(true)}
              style={{ width:"100%", marginTop:12, padding:"13px 0",
                       border:`1.5px solid ${P}`, background:"#fff",
                       borderRadius:14, fontSize:14, fontWeight:700, color:P,
                       cursor:"pointer", fontFamily:"inherit" }}>
              Tüm Soruları Gör
            </button>
          )}
        </div>

        {/* ── BİZE ULAŞIN ── */}
        <div style={{ padding:"0 16px 16px" }}>
          <div style={{ fontSize:14, fontWeight:700, color:DRK, marginBottom:12 }}>Bize Ulaşın</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
            {/* Canlı Destek */}
            <button onClick={() => setLiveOpen(true)}
              style={{ background:"#fff", border:`1px solid ${GBR}`, borderRadius:14,
                       padding:"14px 8px", textAlign:"center", cursor:"pointer",
                       fontFamily:"inherit", display:"flex", flexDirection:"column",
                       alignItems:"center", gap:6 }}>
              <MessageCircle size={20} color={P} />
              <div style={{ fontSize:11, fontWeight:700, color:DRK }}>Canlı Destek</div>
              <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background:"#22C55E",
                               display:"inline-block" }} />
                <span style={{ fontSize:10, color:GT }}>Çevrimiçi</span>
              </div>
            </button>
            {/* Mesaj Gönder */}
            <button onClick={() => navigate("/hesabim/yardim/yeni-talep")}
              style={{ background:"#fff", border:`1px solid ${GBR}`, borderRadius:14,
                       padding:"14px 8px", textAlign:"center", cursor:"pointer",
                       fontFamily:"inherit", display:"flex", flexDirection:"column",
                       alignItems:"center", gap:6 }}>
              <Mail size={20} color={P} />
              <div style={{ fontSize:11, fontWeight:700, color:DRK }}>Mesaj Gönder</div>
              <div style={{ fontSize:10, color:GT }}>24 saat içinde</div>
            </button>
            {/* Bizi Arayın */}
            <button onClick={() => showToast("0850 xxx xx xx — 09:00-18:00")}
              style={{ background:"#fff", border:`1px solid ${GBR}`, borderRadius:14,
                       padding:"14px 8px", textAlign:"center", cursor:"pointer",
                       fontFamily:"inherit", display:"flex", flexDirection:"column",
                       alignItems:"center", gap:6 }}>
              <Phone size={20} color={P} />
              <div style={{ fontSize:11, fontWeight:700, color:DRK }}>Bizi Arayın</div>
              <div style={{ fontSize:10, color:GT }}>09:00-18:00</div>
            </button>
          </div>
        </div>

        {/* ── AI ASISTAN BANNER ── */}
        <div style={{ margin:"0 16px 24px", background:PL, borderRadius:16, padding:"14px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <img
              src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=80&h=80&fit=crop"
              alt="poodle"
              style={{ width:56, height:56, borderRadius:"50%", objectFit:"cover", flexShrink:0 }}
            />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:700, color:DRK }}>
                AI Asistan'a da sorabilirsiniz
              </div>
              <div style={{ fontSize:11, color:GT, marginTop:3, lineHeight:1.5 }}>
                Toy Poodle bakımı ve ürün seçimi için anında yanıt alın.
              </div>
            </div>
            <button onClick={() => navigate("/yourpoodle/ai-asistan")}
              style={{ flexShrink:0, background:P, color:"#fff", border:"none",
                       borderRadius:12, padding:"9px 11px", fontSize:10, fontWeight:700,
                       cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>
              AI Asistan'a Sor
            </button>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div style={{ background:NAV, padding:"22px 16px 32px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
            <span style={{ fontSize:22 }}>🐾</span>
            <span style={{ fontSize:16, fontWeight:800, color:"#fff" }}>YourPoodle</span>
          </div>
          <div style={{ display:"flex", gap:18, marginBottom:12 }}>
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
