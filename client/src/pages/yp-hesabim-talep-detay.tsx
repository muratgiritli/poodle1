// Route: /hesabim/yardim/talep/:ticketId
import { useState, useRef } from "react";
import { useLocation, useParams } from "wouter";
import {
  ArrowLeft, Check, Sparkles, Copy, Tag, AlertCircle,
  Package, Calendar, Bell, FileText, Activity, MessageCircle,
  CheckCircle, Paperclip, Camera, Send, PlusCircle,
  Headphones, HelpCircle,
} from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";

/* ── Palette ─────────────────────────── */
const P   = "#4B2BD6";
const PL  = "#F5F0E6";
const NAV = "#1D1E9B";
const DRK = "#111827";
const GT  = "#6B7280";
const GB  = "#E5E7EB";
const GBG = "#F9FAFB";

/* ── Ticket data (mock) ──────────────── */
const TICKET = {
  ticketNumber: "YP-4822",
  subject: "Sipariş ve Teslimat",
  problem: "Eksik Ürün",
  orderId: "#YP-20260723",
  createdAt: "24 Temmuz 2026 • 00:52",
  contactMethod: "Uygulama Bildirimi + SMS",
  status: "Alındı",
};

/* ── Timeline steps ──────────────────── */
const STEPS = [
  { id:1, title:"Talebiniz oluşturuldu",  sub:"24 Temmuz • 00:52",                  status:"completed" },
  { id:2, title:"Destek ekibi inceliyor", sub:"Talebiniz sıraya alındı",             status:"active"    },
  { id:3, title:"Size yanıt verilecek",   sub:"Uygulama bildirimi ve SMS ile",       status:"pending"   },
  { id:4, title:"Talep çözülecek",        sub:"Onayınızdan sonra kapatılacak",       status:"pending"   },
] as const;

/* ── Message type ────────────────────── */
type Msg = { id:string; sender:"support"|"user"; text:string; time:string; };

/* ════════════════════════════
   MAIN PAGE
════════════════════════════ */
export default function YPTalepDetayPage() {
  const [, navigate] = useLocation();
  const params = useParams<{ ticketId?: string }>();
  const ticketId = params?.ticketId ?? "YP-4822";

  const [messages, setMessages] = useState<Msg[]>([
    { id:"m1", sender:"support",
      text:"Talebiniz bize ulaştı. Gelişmeleri bu sayfadan takip edebilirsiniz.",
      time:"00:52" },
  ]);
  const [newMsg, setNewMsg]   = useState("");
  const [copied, setCopied]   = useState(false);
  const [toast, setToast]     = useState("");
  const msgRef = useRef<HTMLDivElement>(null);

  const showToast = (m: string) => { setToast(m); setTimeout(()=>setToast(""), 2200); };

  const copyTicket = () => {
    navigator.clipboard.writeText(`#${ticketId}`).catch(()=>{});
    setCopied(true);
    setTimeout(()=>setCopied(false), 2000);
    showToast("Kopyalandı ✓");
  };

  const sendMessage = () => {
    if (!newMsg.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now().toString(), sender:"user", text:newMsg.trim(), time:"şimdi",
    }]);
    setNewMsg("");
    showToast("Mesajınız iletildi");
    setTimeout(()=>msgRef.current?.scrollIntoView({ behavior:"smooth" }), 100);
  };

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

      <div style={{ maxWidth: "var(--yp-shell-max)", margin:"0 auto", fontFamily:"'Inter',-apple-system,sans-serif",
                    background:GBG, minHeight:"100vh", color:DRK, paddingBottom:0 }}>

        {/* ── BREADCRUMB ── */}
        <div style={{ padding:"14px 16px 10px", background:"#fff",
                      borderBottom:`1px solid ${GB}`, marginBottom:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:5, flexWrap:"wrap" as any }}>
            <button onClick={() => navigate("/hesabim/yardim")}
              style={{ background:"none", border:"none", cursor:"pointer", padding:0, display:"flex" }}>
              <ArrowLeft size={16} color={P} />
            </button>
            <span style={{ fontSize:11, color:P }}>Hesabım</span>
            <span style={{ fontSize:11, color:P }}>/</span>
            <button onClick={() => navigate("/hesabim/yardim")}
              style={{ background:"none", border:"none", cursor:"pointer", padding:0,
                       fontSize:11, color:P, fontFamily:"inherit" }}>
              Yardım Merkezi
            </button>
            <span style={{ fontSize:11, color:P }}>/</span>
            <span style={{ fontSize:11, color:P, fontWeight:700 }}>Talep #{ticketId}</span>
          </div>
        </div>

        {/* ── HERO CARD ── */}
        <div style={{ margin:"0 12px 12px", background:"#fff", borderRadius:18,
                      border:`1px solid ${GB}`, overflow:"hidden" }}>
          {/* Gradient top */}
          <div style={{
            background:"linear-gradient(180deg, #F5F0E6 0%, #fff 100%)",
            padding:"28px 20px 20px", textAlign:"center",
          }}>
            {/* Checkmark with sparkles */}
            <div style={{ position:"relative", width:72, height:72, margin:"0 auto 16px" }}>
              {/* Sparkle TL */}
              <Sparkles size={12} color={P} style={{ position:"absolute", top:-2, left:2, opacity:.5 }} />
              {/* Sparkle TR */}
              <Sparkles size={10} color={P} style={{ position:"absolute", top:-4, right:0, opacity:.4 }} />
              {/* Sparkle BR */}
              <Sparkles size={9}  color={P} style={{ position:"absolute", bottom:-2, right:-2, opacity:.35 }} />
              <div style={{ width:72, height:72, borderRadius:"50%", background:P,
                            display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Check size={32} color="#fff" strokeWidth={3} />
              </div>
            </div>

            <div style={{ fontSize:18, fontWeight:800, color:P, marginBottom:8 }}>
              Destek Talebiniz Alındı
            </div>
            <div style={{ fontSize:13, color:GT, lineHeight:1.6, padding:"0 10px" }}>
              Talebiniz başarıyla oluşturuldu. Ekibimiz en kısa sürede sizinle iletişime geçecek.
            </div>

            {/* Ticket pill */}
            <div style={{
              display:"inline-flex", alignItems:"center", gap:8, marginTop:16,
              background:"#fff", border:`1px solid ${GB}`, borderRadius:999,
              padding:"8px 18px", boxShadow:"0 1px 4px rgba(0,0,0,.06)",
            }}>
              <span style={{ fontSize:14, fontWeight:700, color:DRK }}>
                Talep No: #{ticketId}
              </span>
              <button onClick={copyTicket}
                style={{ background:"none", border:"none", cursor:"pointer", padding:0, display:"flex" }}>
                {copied
                  ? <Check size={14} color="#16A34A" />
                  : <Copy size={14} color="#9CA3AF" />}
              </button>
            </div>

            {/* ETA */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
                          gap:6, marginTop:12 }}>
              <span style={{ width:8, height:8, borderRadius:"50%", background:"#22C55E",
                             display:"inline-block" }} />
              <span style={{ fontSize:12, color:GT }}>Tahmini yanıt süresi: 3 dakika</span>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ padding:"0 20px 20px", display:"flex", flexDirection:"column", gap:8 }}>
            <button
              onClick={() => msgRef.current?.scrollIntoView({ behavior:"smooth" })}
              style={{ width:"100%", padding:"13px 0", borderRadius:12, border:"none",
                       background:P, fontSize:14, fontWeight:700, color:"#fff",
                       cursor:"pointer", fontFamily:"inherit" }}>
              Talebi Görüntüle
            </button>
            <button onClick={() => navigate("/hesabim/yardim")}
              style={{ width:"100%", padding:"13px 0", borderRadius:12,
                       border:`2px solid ${P}`, background:"#fff",
                       fontSize:14, fontWeight:700, color:P,
                       cursor:"pointer", fontFamily:"inherit" }}>
              Yardım Merkezine Dön
            </button>
          </div>
        </div>

        {/* ── TALEP ÖZETİ ── */}
        <div style={{ margin:"0 12px 12px", background:"#fff", borderRadius:18,
                      border:`1px solid ${GB}`, padding:"16px 14px" }}>
          <div style={{ fontSize:14, fontWeight:700, color:DRK, marginBottom:12 }}>Talep Özeti</div>
          {[
            { Icon:Tag,          label:"Konu",        value:TICKET.subject,       badge:"Alındı" },
            { Icon:AlertCircle,  label:"Sorun",       value:TICKET.problem,       badge:null },
            { Icon:Package,      label:"Sipariş",     value:TICKET.orderId,       badge:null },
            { Icon:Calendar,     label:"Talep Tarihi",value:TICKET.createdAt,     badge:null },
            { Icon:Bell,         label:"İletişim",    value:TICKET.contactMethod, badge:null },
          ].map(({ Icon, label, value, badge }, i, arr) => (
            <div key={label}
              style={{ display:"flex", alignItems:"center", gap:10,
                       padding:"10px 0", borderBottom: i < arr.length-1 ? `1px solid ${GBG}` : "none" }}>
              <div style={{ width:32, height:32, borderRadius:10, background:PL,
                            display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Icon size={15} color={P} />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:11, color:GT }}>{label}</div>
                <div style={{ fontSize:13, fontWeight:600, color:DRK,
                              overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {value}
                </div>
              </div>
              {badge && (
                <span style={{ fontSize:10, fontWeight:700, color:P, background:PL,
                               padding:"3px 8px", borderRadius:999, flexShrink:0 }}>
                  {badge}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* ── EKLİ DOSYALAR ── */}
        <div style={{ margin:"0 12px 12px", background:"#fff", borderRadius:18,
                      border:`1px solid ${GB}`, padding:"16px 14px" }}>
          <div style={{ fontSize:14, fontWeight:700, color:DRK, marginBottom:12 }}>Ekli Dosyalar</div>
          <div style={{ display:"flex", gap:10 }}>
            {/* paket.jpg */}
            <button onClick={() => showToast("Dosya önizleme yakında!")}
              style={{ flex:1, display:"flex", alignItems:"center", gap:8, background:GBG,
                       border:`1px solid ${GB}`, borderRadius:12, padding:"10px",
                       cursor:"pointer", fontFamily:"inherit", textAlign:"left" as any }}>
              <img
                src="https://images.unsplash.com/photo-1544568100-847a948583b9?w=80&h=80&fit=crop"
                alt="paket.jpg"
                style={{ width:40, height:40, borderRadius:8, objectFit:"cover", flexShrink:0 }}
              />
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:11, fontWeight:700, color:DRK,
                              overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  paket.jpg
                </div>
                <div style={{ fontSize:10, color:GT }}>412 KB</div>
              </div>
            </button>

            {/* fatura.pdf */}
            <button onClick={() => showToast("Dosya önizleme yakında!")}
              style={{ flex:1, display:"flex", alignItems:"center", gap:8, background:GBG,
                       border:`1px solid ${GB}`, borderRadius:12, padding:"10px",
                       cursor:"pointer", fontFamily:"inherit", textAlign:"left" as any }}>
              <div style={{ width:40, height:40, borderRadius:8, background:"#FEF2F2",
                            display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <FileText size={18} color="#DC2626" />
              </div>
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:11, fontWeight:700, color:DRK }}>fatura.pdf</div>
                <div style={{ fontSize:10, color:GT }}>186 KB</div>
              </div>
            </button>
          </div>
        </div>

        {/* ── TİMELINE ── */}
        <div style={{ margin:"0 12px 12px", background:"#fff", borderRadius:18,
                      border:`1px solid ${GB}`, padding:"16px 14px" }}>
          <div style={{ fontSize:14, fontWeight:700, color:DRK, marginBottom:16 }}>
            Şimdi ne olacak?
          </div>
          <div style={{ paddingLeft:4 }}>
            {STEPS.map((s, i) => {
              const isLast = i === STEPS.length - 1;
              const done = s.status === "completed";
              const active = s.status === "active";
              const pending = s.status === "pending";
              return (
                <div key={s.id}
                  style={{ display:"flex", gap:14, paddingBottom: isLast ? 0 : 20, position:"relative" }}>
                  {/* Connector line */}
                  {!isLast && (
                    <div style={{
                      position:"absolute", left:15, top:32, bottom:0, width:2,
                      background: done || active ? P : "#E5E7EB",
                    }} />
                  )}
                  {/* Icon */}
                  <div style={{
                    width:32, height:32, borderRadius:"50%", flexShrink:0, zIndex:1,
                    background: done ? P : active ? P : "#E5E7EB",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    animation: active ? "pulse 2s infinite" : undefined,
                  }}>
                    {done   && <Check         size={14} color="#fff" />}
                    {active && <Activity      size={14} color="#fff" />}
                    {pending && s.id === 3 && <MessageCircle size={14} color="#9CA3AF" />}
                    {pending && s.id === 4 && <CheckCircle   size={14} color="#9CA3AF" />}
                  </div>
                  {/* Text */}
                  <div style={{ paddingTop:4 }}>
                    <div style={{ fontSize:13, fontWeight:600,
                                  color: pending ? "#9CA3AF" : DRK }}>
                      {s.title}
                    </div>
                    <div style={{ fontSize:11, marginTop:3,
                                  color: pending ? "#9CA3AF" : GT }}>
                      {s.sub}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── MESSAGES ── */}
        <div id="messages" ref={msgRef}
          style={{ margin:"0 12px 0", padding:"0 0 4px" }}>
          <div style={{ fontSize:14, fontWeight:700, color:DRK, marginBottom:12 }}>
            Talebinize mesaj ekleyin
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {messages.map(msg => {
              const isSupport = msg.sender === "support";
              return (
                <div key={msg.id}
                  style={{ display:"flex", flexDirection: isSupport ? "row" : "row-reverse",
                           alignItems:"flex-start", gap:8 }}>
                  {isSupport && (
                    <img
                      src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=40&h=40&fit=crop"
                      alt="support"
                      style={{ width:32, height:32, borderRadius:"50%", objectFit:"cover", flexShrink:0 }}
                    />
                  )}
                  <div style={{ maxWidth:"85%" }}>
                    <div style={{
                      background: isSupport ? "#F3F4F6" : P,
                      borderRadius: isSupport ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
                      padding:"10px 14px",
                    }}>
                      {isSupport && (
                        <div style={{ fontSize:10, fontWeight:700, color:P, marginBottom:4 }}>
                          YourPoodle Destek
                        </div>
                      )}
                      <div style={{ fontSize:13, color: isSupport ? DRK : "#fff",
                                    lineHeight:1.5 }}>
                        {msg.text}
                      </div>
                      <div style={{ fontSize:10, color: isSupport ? "#9CA3AF" : "rgba(255,255,255,.6)",
                                    textAlign:"right", marginTop:4 }}>
                        {msg.time}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── MESSAGE INPUT ── */}
        <div style={{ margin:"10px 12px 12px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10,
                        background:"#fff", border:`1px solid ${GB}`, borderRadius:24,
                        padding:"8px 12px", boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
            <input value={newMsg} onChange={e => setNewMsg(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Ek bilgi veya mesaj yazın..."
              style={{ flex:1, border:"none", outline:"none", fontSize:13,
                       fontFamily:"inherit", color:DRK, background:"transparent" }} />
            <button onClick={() => showToast("Dosya ekleme yakında!")}
              style={{ background:"none", border:"none", cursor:"pointer", padding:0, display:"flex" }}>
              <Paperclip size={18} color="#9CA3AF" />
            </button>
            <button onClick={() => showToast("Kamera yakında!")}
              style={{ background:"none", border:"none", cursor:"pointer", padding:0, display:"flex" }}>
              <Camera size={18} color="#9CA3AF" />
            </button>
            <button onClick={sendMessage}
              disabled={!newMsg.trim()}
              style={{
                width:36, height:36, borderRadius:"50%",
                background: newMsg.trim() ? P : "#D1D5DB",
                border:"none", cursor: newMsg.trim() ? "pointer" : "not-allowed",
                display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
              }}>
              <Send size={15} color="#fff" />
            </button>
          </div>
        </div>

        {/* ── NOTIFICATION BANNER ── */}
        <div style={{
          margin:"0 12px 12px", background:"#FEF9C3", border:"1px solid #FDE68A",
          borderRadius:16, padding:"14px",
          display:"flex", alignItems:"flex-start", gap:10,
        }}>
          <Bell size={20} color="#CA8A04" style={{ flexShrink:0, marginTop:1 }} />
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:700, color:DRK }}>Bildirimleri açık tutun</div>
            <div style={{ fontSize:11, color:"#374151", marginTop:3, lineHeight:1.5 }}>
              Destek ekibimiz yanıt verdiğinde size anında haber vereceğiz.
            </div>
          </div>
          <button onClick={() => navigate("/hesabim/ayarlar")}
            style={{ flexShrink:0, border:`1px solid ${GB}`, background:"#fff",
                     borderRadius:8, padding:"6px 12px", fontSize:11, fontWeight:700,
                     color:DRK, cursor:"pointer", fontFamily:"inherit" }}>
            Ayarlar
          </button>
        </div>

        {/* ── QUICK ACTIONS ── */}
        <div style={{ margin:"0 12px 12px" }}>
          <div style={{ fontSize:14, fontWeight:700, color:DRK, marginBottom:10 }}>
            Başka bir konuda yardıma mı ihtiyacınız var?
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
            {[
              { Icon:PlusCircle,  label:"Yeni Talep Oluştur",    sub:"Başka bir konu için\nyeni talep açın",  onClick:() => navigate("/hesabim/yardim/yeni-talep") },
              { Icon:Headphones,  label:"Canlı Destek",           sub:"Hemen destek ekibimizle\ngörüşün",     onClick:() => showToast("Canlı destek yakında") },
              { Icon:HelpCircle,  label:"Sık Sorulan Sorular",    sub:"Cevapları hızlıca\nbulun",            onClick:() => navigate("/hesabim/yardim") },
            ].map(({ Icon, label, sub, onClick }) => (
              <button key={label} onClick={onClick}
                style={{ background:"#fff", border:`1px solid ${GB}`, borderRadius:14,
                         padding:"14px 8px", textAlign:"center", cursor:"pointer",
                         fontFamily:"inherit", display:"flex", flexDirection:"column",
                         alignItems:"center", gap:6 }}>
                <Icon size={20} color={P} />
                <div style={{ fontSize:10, fontWeight:700, color:DRK, lineHeight:1.3 }}>{label}</div>
                <div style={{ fontSize:9, color:GT, lineHeight:1.3, whiteSpace:"pre-line" }}>{sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* ── REASSURANCE BANNER ── */}
        <div style={{ margin:"0 12px 24px", background:PL, borderRadius:16, padding:"16px 14px",
                      display:"flex", alignItems:"center", gap:12 }}>
          <img
            src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=80&h=80&fit=crop"
            alt="poodle"
            style={{ width:56, height:56, borderRadius:"50%", objectFit:"cover", flexShrink:0 }}
          />
          <div>
            <div style={{ fontSize:14, fontWeight:800, color:P, marginBottom:4 }}>
              Merak etmeyin, yanınızdayız!
            </div>
            <div style={{ fontSize:12, color:GT, lineHeight:1.5 }}>
              Sorununuz çözülene kadar talebinizi birlikte takip edeceğiz.
            </div>
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
