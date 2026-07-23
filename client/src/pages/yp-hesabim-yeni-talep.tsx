// Route: /hesabim/yardim/yeni-talep
import { useState, useRef } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft, Headphones, PackageOpen, RefreshCw, PackageX,
  Truck, Clock, Repeat, MoreHorizontal, Check, Bell, Phone,
  Camera, FileText, X, ShieldCheck,
} from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";

/* ── Palette ─────────────────────────── */
const P   = "#4B2BD6";
const PL  = "#F3EEFF";
const NAV = "#1D1E9B";
const DRK = "#111827";
const GT  = "#6B7280";
const GB  = "#E5E7EB";
const GBG = "#F9FAFB";

/* ── Toggle ─────────────────────────── */
function Toggle({ on, toggle }: { on: boolean; toggle: () => void }) {
  return (
    <button onClick={toggle} role="switch" aria-checked={on}
      style={{
        width:44, height:24, borderRadius:12, flexShrink:0,
        background: on ? P : "#D1D5DB",
        border:"none", cursor:"pointer", position:"relative", transition:"background .2s",
      }}>
      <span style={{
        position:"absolute", top:2, left: on ? 22 : 2,
        width:20, height:20, borderRadius:"50%", background:"#fff",
        transition:"left .2s", boxShadow:"0 1px 4px rgba(0,0,0,.18)",
      }} />
    </button>
  );
}

/* ── Radio dot ───────────────────────── */
function RadioDot({ selected }: { selected: boolean }) {
  return (
    <div style={{
      width:18, height:18, borderRadius:"50%", flexShrink:0,
      border:`2px solid ${selected ? P : "#D1D5DB"}`,
      background: selected ? P : "#fff",
      display:"flex", alignItems:"center", justifyContent:"center",
    }}>
      {selected && <div style={{ width:6, height:6, borderRadius:"50%", background:"#fff" }} />}
    </div>
  );
}

/* ── Issue types ─────────────────────── */
const ISSUES = [
  { id:"missing",  label:"Eksik Ürün",      Icon:PackageOpen,   },
  { id:"wrong",    label:"Yanlış Ürün",      Icon:RefreshCw,     },
  { id:"damaged",  label:"Hasarlı Ürün",     Icon:PackageX,      },
  { id:"delay",    label:"Kargo Gecikmesi",  Icon:Truck,         },
  { id:"return",   label:"İade / Değişim",   Icon:Repeat,        },
  { id:"other",    label:"Diğer",            Icon:MoreHorizontal,},
] as const;

/* ── Orders ──────────────────────────── */
const ORDERS = [
  { id:"ord-1", num:"YP-20260723", date:"23 Temmuz 2026", count:2, price:"1.338 TL", status:"Teslim Edildi",
    thumbs:[
      "https://images.unsplash.com/photo-1589924691995-400dc9e7c8b0?w=48&h=48&fit=crop",
      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=48&h=48&fit=crop",
    ],
  },
  { id:"ord-2", num:"YP-20260715", date:"15 Temmuz 2026", count:1, price:"449 TL", status:"Teslim Edildi",
    thumbs:["https://images.unsplash.com/photo-1544568100-847a948583b9?w=48&h=48&fit=crop"],
  },
];

/* ── Preloaded files ─────────────────── */
type UFile = { id:string; name:string; size:string; type:"image"|"pdf"; previewUrl?:string; };
const PRELOADED: UFile[] = [
  { id:"file-1", name:"paket.jpg",  size:"412 KB", type:"image",
    previewUrl:"https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=80&h=80&fit=crop" },
  { id:"file-2", name:"fatura.pdf", size:"186 KB", type:"pdf" },
];

/* ── Order Picker Modal ──────────────── */
function OrderPickerModal({ selected, onSelect, onClose }:{
  selected:string; onSelect:(id:string)=>void; onClose:()=>void;
}) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)",
                  display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:9999 }}>
      <div style={{ background:"#fff", borderRadius:"20px 20px 0 0",
                    padding:"24px 20px 40px", width:"100%", maxWidth:480 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
          <span style={{ fontSize:17, fontWeight:700, color:DRK }}>Sipariş Seçin</span>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer" }}>
            <X size={20} color={GT} />
          </button>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {ORDERS.map(o => (
            <button key={o.id} onClick={() => { onSelect(o.id); onClose(); }}
              style={{
                display:"flex", alignItems:"center", gap:12, padding:"14px",
                border:`1.5px solid ${o.id === selected ? P : GB}`,
                borderRadius:14, background: o.id === selected ? PL : "#fff",
                cursor:"pointer", fontFamily:"inherit", textAlign:"left",
              }}>
              <div style={{ display:"flex", marginRight:4 }}>
                {o.thumbs.map((t,i) => (
                  <img key={i} src={t} alt="" style={{
                    width:38, height:38, borderRadius:8, objectFit:"cover",
                    border:"2px solid #fff", marginLeft: i>0 ? -10 : 0,
                  }} />
                ))}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:700, color:DRK }}>Sipariş #{o.num}</div>
                <div style={{ fontSize:11, color:GT }}>{o.date} · {o.count} ürün</div>
                <div style={{ fontSize:13, fontWeight:700, color:P }}>{o.price}</div>
              </div>
              <RadioDot selected={o.id === selected} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Success Modal ───────────────────── */
function SuccessModal({ ticketNo, onClose }:{ ticketNo:string; onClose:()=>void; }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  padding:"0 20px", zIndex:9999 }}>
      <div style={{ background:"#fff", borderRadius:20, padding:"28px 24px",
                    width:"100%", maxWidth:380, textAlign:"center" }}>
        <div style={{ width:56, height:56, borderRadius:"50%", background:PL,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      margin:"0 auto 16px" }}>
          <Check size={28} color={P} />
        </div>
        <div style={{ fontSize:18, fontWeight:800, color:DRK, marginBottom:8 }}>Talebiniz Alındı</div>
        <div style={{ fontSize:14, fontWeight:700, color:P, marginBottom:8 }}>{ticketNo}</div>
        <div style={{ fontSize:13, color:GT, marginBottom:24, lineHeight:1.5 }}>
          En kısa sürede size dönüş yapacağız.
        </div>
        <button onClick={onClose}
          style={{ width:"100%", padding:"13px 0", borderRadius:12, border:"none",
                   background:P, fontSize:14, fontWeight:700, color:"#fff",
                   cursor:"pointer", fontFamily:"inherit" }}>
          Tamam
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════
   MAIN PAGE
════════════════════════════ */
export default function YPYeniTalepPage() {
  const [, navigate] = useLocation();

  const [topic,     setTopic]     = useState("order");
  const [issue,     setIssue]     = useState("missing");
  const [orderId,   setOrderId]   = useState("ord-1");
  const [title,     setTitle]     = useState("Siparişimde bir ürün eksik geldi");
  const [desc,      setDesc]      = useState(
    "Kargo paketimi teslim aldım ancak Buharlı Masaj Tarağı paket içerisinden çıkmadı. Kontrol edilmesini rica ederim."
  );
  const [files,     setFiles]     = useState<UFile[]>(PRELOADED);
  const [contact,   setContact]   = useState<"app"|"phone">("app");
  const [sms,       setSms]       = useState(true);
  const [consent,   setConsent]   = useState(true);
  const [orderOpen, setOrderOpen] = useState(false);
  const [success,   setSuccess]   = useState(false);
  const [ticketNo,  setTicketNo]  = useState("");
  const [errors,    setErrors]    = useState<Record<string,string>>({});
  const [toast,     setToast]     = useState("");

  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (m:string) => { setToast(m); setTimeout(()=>setToast(""),2200); };

  const selectedOrder = ORDERS.find(o => o.id === orderId)!;

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const allowed = ["image/jpeg","image/png","application/pdf"];
    const arr = Array.from(list);
    if (files.length + arr.length > 5) { showToast("En fazla 5 dosya ekleyebilirsiniz."); return; }
    const next: UFile[] = arr
      .filter(f => {
        if (!allowed.includes(f.type)) { showToast("Sadece JPG, PNG veya PDF"); return false; }
        if (f.size > 10*1024*1024) { showToast("Dosya 10 MB'ı geçemez."); return false; }
        return true;
      })
      .map(f => ({
        id: Math.random().toString(36).slice(2),
        name: f.name,
        size: f.size > 1024*1024 ? `${(f.size/1024/1024).toFixed(1)} MB` : `${Math.round(f.size/1024)} KB`,
        type: f.type === "application/pdf" ? "pdf" : "image",
        previewUrl: f.type.startsWith("image") ? URL.createObjectURL(f) : undefined,
      }));
    setFiles(prev => [...prev, ...next]);
  };

  const validate = () => {
    const errs: Record<string,string> = {};
    if (title.trim().length < 5)   errs.title = "Başlık en az 5 karakter olmalıdır.";
    if (desc.trim().length < 20)   errs.desc  = "Açıklama en az 20 karakter olmalıdır.";
    if (!consent)                  errs.consent = "Lütfen onay kutucuğunu işaretleyin.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    const no = `#YP-${4820 + Math.floor(Math.random()*10) + 2}`;
    setTicketNo(no);
    setSuccess(true);
    showToast("Destek talebiniz oluşturuldu ✓");
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

      {/* Order Picker */}
      {orderOpen && (
        <OrderPickerModal selected={orderId}
          onSelect={setOrderId} onClose={() => setOrderOpen(false)} />
      )}

      {/* Success Modal */}
      {success && (
        <SuccessModal ticketNo={ticketNo}
          onClose={() => { setSuccess(false); navigate("/hesabim/yardim"); }} />
      )}

      <div style={{ maxWidth:480, margin:"0 auto", fontFamily:"'Inter',-apple-system,sans-serif",
                    background:"#fff", minHeight:"100vh", color:DRK, paddingBottom:0 }}>

        {/* ── PAGE HEADER ── */}
        <div style={{ padding:"14px 16px 12px", background:"#fff",
                      borderBottom:`1px solid ${GB}`, marginBottom:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:12, flexWrap:"wrap" as any }}>
            <button onClick={() => navigate("/hesabim/yardim")}
              style={{ background:"none", border:"none", cursor:"pointer", padding:0, display:"flex" }}>
              <ArrowLeft size={16} color={P} />
            </button>
            <span style={{ fontSize:11, color:P }}>Hesabım</span>
            <span style={{ fontSize:11, color:P }}>/</span>
            <span style={{ fontSize:11, color:P }}>Yardım Merkezi</span>
            <span style={{ fontSize:11, color:P }}>/</span>
            <span style={{ fontSize:11, color:P, fontWeight:700 }}>Yeni Talep</span>
          </div>
          <h1 style={{ fontSize:22, fontWeight:800, color:DRK, margin:"0 0 4px" }}>
            Destek Talebi Oluştur
          </h1>
          <p style={{ fontSize:13, color:GT, margin:0, lineHeight:1.5 }}>
            Sorununuzu detaylı anlatın, ekibimiz en kısa sürede size yardımcı olsun.
          </p>
        </div>

        {/* ── ONLINE BAR ── */}
        <div style={{
          margin:"0 16px 16px", background:"#F3F4F6", borderRadius:12,
          padding:"10px 14px", display:"flex", alignItems:"center", justifyContent:"space-between",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <Headphones size={17} color={P} />
            <span style={{ fontSize:12, color:"#374151" }}>Ortalama yanıt süresi: 3 dakika</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:"#22C55E", display:"inline-block" }} />
            <span style={{ fontSize:12, fontWeight:600, color:"#16A34A" }}>Çevrimiçi</span>
          </div>
        </div>

        <div style={{ padding:"0 16px" }}>

          {/* ── SECTION 1: YARDIM KONUSU ── */}
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:14, fontWeight:700, color:DRK, marginBottom:12 }}>
              1. Yardım Konusu
            </div>
            <div style={{ fontSize:11, color:GT, marginBottom:6 }}>Konu Seçin</div>
            <select value={topic} onChange={e => setTopic(e.target.value)}
              style={{
                width:"100%", background:"#fff", border:`1px solid ${GB}`,
                borderRadius:12, padding:"12px 16px", fontSize:13,
                fontFamily:"inherit", color:DRK, appearance:"none",
                backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat:"no-repeat", backgroundPosition:"right 14px center",
                outline:"none", boxSizing:"border-box" as any,
              }}>
              {[
                { v:"order",      l:"Sipariş ve Teslimat" },
                { v:"payment",    l:"Ödeme ve Taksit" },
                { v:"product",    l:"Ürün Bilgisi" },
                { v:"club",       l:"Club ve Hesap" },
                { v:"membership", l:"Üyelik" },
                { v:"other",      l:"Diğer" },
              ].map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
            </select>

            {/* Issue grid 2-col */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:12 }}>
              {ISSUES.map(({ id, label, Icon }) => {
                const sel = issue === id;
                return (
                  <button key={id} onClick={() => setIssue(id)}
                    style={{
                      background: sel ? PL : "#fff",
                      border:`2px solid ${sel ? P : GB}`,
                      borderRadius:14, padding:"12px 10px",
                      display:"flex", flexDirection:"column", alignItems:"center",
                      gap:6, cursor:"pointer", fontFamily:"inherit", position:"relative",
                    }}>
                    {sel && (
                      <div style={{ position:"absolute", top:6, right:6 }}>
                        <Check size={13} color={P} />
                      </div>
                    )}
                    <Icon size={20} color={sel ? P : "#9CA3AF"} />
                    <span style={{ fontSize:11, fontWeight:700, color:DRK, textAlign:"center" }}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── SECTION 2: SİPARİŞ SEÇİMİ ── */}
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:14, fontWeight:700, color:DRK, marginBottom:12 }}>
              2. Siparişinizi Seçin
            </div>
            <div style={{ border:`1px solid ${GB}`, borderRadius:16, padding:"14px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                {/* Thumbnails */}
                <div style={{ display:"flex", flexShrink:0 }}>
                  {selectedOrder.thumbs.map((t,i) => (
                    <img key={i} src={t} alt="" style={{
                      width:44, height:44, borderRadius:10, objectFit:"cover",
                      border:"2px solid #fff", marginLeft: i>0 ? -12 : 0,
                    }} />
                  ))}
                </div>
                {/* Info */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:DRK }}>
                    Sipariş #{selectedOrder.num}
                  </div>
                  <div style={{ fontSize:11, color:GT, marginTop:2 }}>
                    {selectedOrder.date} · {selectedOrder.count} ürün
                  </div>
                  <div style={{ fontSize:13, fontWeight:700, color:P, marginTop:2 }}>
                    {selectedOrder.price}
                  </div>
                </div>
                {/* Right */}
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6, flexShrink:0 }}>
                  <span style={{ fontSize:10, fontWeight:700, color:"#16A34A",
                                 background:"#DCFCE7", padding:"3px 8px", borderRadius:999 }}>
                    {selectedOrder.status}
                  </span>
                  <RadioDot selected={true} />
                  <button onClick={() => setOrderOpen(true)}
                    style={{ fontSize:10, fontWeight:700, color:P, border:`1px solid ${P}`,
                             background:"#fff", borderRadius:8, padding:"4px 8px",
                             cursor:"pointer", fontFamily:"inherit" }}>
                    Değiştir
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION 3: SORUN AÇIKLAMASI ── */}
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:14, fontWeight:700, color:DRK, marginBottom:12 }}>
              3. Sorununuzu Anlatın
            </div>
            <div style={{ fontSize:11, color:GT, marginBottom:5 }}>Talep Başlığı</div>
            <input value={title} onChange={e => setTitle(e.target.value)} maxLength={100}
              style={{
                width:"100%", border:`1px solid ${errors.title ? "#DC2626" : GB}`,
                borderRadius:12, padding:"11px 14px", fontSize:13,
                fontFamily:"inherit", color:DRK, outline:"none",
                boxSizing:"border-box" as any,
              }} />
            {errors.title && <div style={{ fontSize:11, color:"#DC2626", marginTop:4 }}>{errors.title}</div>}

            <div style={{ fontSize:11, color:GT, margin:"12px 0 5px" }}>Açıklama</div>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} maxLength={1000} rows={4}
              style={{
                width:"100%", border:`1px solid ${errors.desc ? "#DC2626" : GB}`,
                borderRadius:12, padding:"11px 14px", fontSize:13,
                fontFamily:"inherit", color:DRK, resize:"none", outline:"none",
                boxSizing:"border-box" as any, lineHeight:1.6,
              }} />
            <div style={{ textAlign:"right", fontSize:11, color:"#9CA3AF", marginTop:3 }}>
              {desc.length} / 1000
            </div>
            {errors.desc && <div style={{ fontSize:11, color:"#DC2626", marginTop:2 }}>{errors.desc}</div>}
          </div>

          {/* ── SECTION 4: DOSYA YÜKLEME ── */}
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:14, fontWeight:700, color:DRK, marginBottom:12 }}>
              4. Fotoğraf veya Belge Ekleyin
            </div>

            {/* Upload zone */}
            <div style={{
              border:"2px dashed #C4B5FD", borderRadius:16, padding:"14px",
              display:"flex", alignItems:"center", gap:12, justifyContent:"space-between",
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, flex:1 }}>
                <Camera size={24} color={P} style={{ flexShrink:0 }} />
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:DRK }}>
                    Fotoğraf eklemek için dokunun
                  </div>
                  <div style={{ fontSize:11, color:GT, marginTop:2 }}>
                    En fazla 5 dosya · JPG, PNG veya PDF · 10 MB
                  </div>
                </div>
              </div>
              <button onClick={() => fileRef.current?.click()}
                style={{ flexShrink:0, border:`1px solid ${P}`, color:P, background:"#fff",
                         borderRadius:10, padding:"8px 12px", fontSize:11, fontWeight:700,
                         cursor:"pointer", fontFamily:"inherit" }}>
                Dosya Seç
              </button>
              <input ref={fileRef} type="file" multiple
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={e => addFiles(e.target.files)}
                style={{ display:"none" }} />
            </div>

            {/* Uploaded files */}
            {files.length > 0 && (
              <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:10 }}>
                {files.map(f => (
                  <div key={f.id}
                    style={{
                      display:"flex", alignItems:"center", gap:8,
                      background:GBG, border:`1px solid ${GB}`,
                      borderRadius:12, padding:"8px 10px",
                    }}>
                    {f.type === "image" && f.previewUrl ? (
                      <img src={f.previewUrl} alt={f.name}
                        style={{ width:40, height:40, borderRadius:8, objectFit:"cover", flexShrink:0 }} />
                    ) : (
                      <div style={{ width:40, height:40, borderRadius:8, background:"#EFF6FF",
                                    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <FileText size={20} color="#3B82F6" />
                      </div>
                    )}
                    <div style={{ minWidth:0 }}>
                      <div style={{ fontSize:11, fontWeight:600, color:DRK,
                                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
                                    maxWidth:80 }}>{f.name}</div>
                      <div style={{ fontSize:10, color:GT }}>{f.size}</div>
                    </div>
                    <button onClick={() => setFiles(prev => prev.filter(x => x.id !== f.id))}
                      style={{ background:"none", border:"none", cursor:"pointer", padding:0,
                               display:"flex", flexShrink:0 }}>
                      <X size={15} color="#DC2626" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── SECTION 5: İLETİŞİM TERCİHİ ── */}
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:14, fontWeight:700, color:DRK, marginBottom:12 }}>
              5. Size nasıl ulaşalım?
            </div>
            <div style={{ display:"flex", gap:10 }}>
              {/* Uygulama Bildirimi */}
              <button onClick={() => setContact("app")}
                style={{
                  flex:1, display:"flex", alignItems:"center", gap:10, padding:"12px",
                  border:`2px solid ${contact==="app" ? P : GB}`,
                  background: contact==="app" ? PL : "#fff",
                  borderRadius:14, cursor:"pointer", fontFamily:"inherit", textAlign:"left",
                }}>
                <Bell size={20} color={contact==="app" ? P : "#9CA3AF"} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:DRK }}>Uygulama Bildirimi</div>
                  <div style={{ fontSize:10, color:GT }}>Önerilen yöntem</div>
                </div>
                <RadioDot selected={contact==="app"} />
              </button>

              {/* Cep Telefonu */}
              <button onClick={() => setContact("phone")}
                style={{
                  flex:1, display:"flex", alignItems:"center", gap:10, padding:"12px",
                  border:`2px solid ${contact==="phone" ? P : GB}`,
                  background: contact==="phone" ? PL : "#fff",
                  borderRadius:14, cursor:"pointer", fontFamily:"inherit", textAlign:"left",
                }}>
                <Phone size={20} color={contact==="phone" ? P : "#9CA3AF"} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:DRK }}>Cep Telefonu</div>
                  <div style={{ fontSize:10, color:GT }}>+90 532 *** ** 47</div>
                </div>
                <RadioDot selected={contact==="phone"} />
              </button>
            </div>

            {/* SMS toggle */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                          marginTop:14 }}>
              <span style={{ fontSize:13, color:DRK }}>Yanıt geldiğinde SMS gönder</span>
              <Toggle on={sms} toggle={() => setSms(v => !v)} />
            </div>
          </div>

          {/* ── CONSENT ── */}
          <div style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:14 }}>
            <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)}
              id="consent-cb"
              style={{ width:16, height:16, flexShrink:0, marginTop:1,
                       accentColor:P, cursor:"pointer" }} />
            <label htmlFor="consent-cb" style={{ fontSize:12, color:"#4B5563", lineHeight:1.5, cursor:"pointer" }}>
              Destek talebinin incelenmesi için paylaştığım bilgilerin işlenmesini kabul ediyorum.{" "}
              <a href="#" onClick={e => { e.preventDefault(); alert("KVKK Aydınlatma Metni"); }}
                style={{ color:P, fontWeight:700, textDecoration:"underline" }}>
                Aydınlatma Metni
              </a>
            </label>
          </div>
          {errors.consent && <div style={{ fontSize:11, color:"#DC2626", marginBottom:8 }}>{errors.consent}</div>}

          {/* ── BUTTONS ── */}
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
            <button onClick={submit}
              style={{
                width:"100%", padding:"14px 0", borderRadius:14,
                background: consent ? P : "#9CA3AF",
                border:"none", fontSize:14, fontWeight:700, color:"#fff",
                cursor: consent ? "pointer" : "not-allowed", fontFamily:"inherit",
                opacity: consent ? 1 : 0.6,
              }}>
              Talebi Gönder
            </button>
            <button onClick={() => navigate("/hesabim/yardim")}
              style={{
                width:"100%", padding:"14px 0", borderRadius:14,
                border:`2px solid ${P}`, background:"#fff",
                fontSize:14, fontWeight:700, color:P,
                cursor:"pointer", fontFamily:"inherit",
              }}>
              Vazgeç
            </button>
          </div>

          {/* ── TRUST BANNER ── */}
          <div style={{
            background:"#EFF6FF", border:"1px solid #BFDBFE",
            borderRadius:16, padding:"14px",
            display:"flex", alignItems:"flex-start", gap:12, marginBottom:24,
          }}>
            <ShieldCheck size={22} color="#3B82F6" style={{ flexShrink:0, marginTop:1 }} />
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:DRK }}>Bilgileriniz güvende</div>
              <div style={{ fontSize:11, color:GT, marginTop:3, lineHeight:1.5 }}>
                Paylaştığınız dosyalar yalnızca destek talebiniz için kullanılır.
              </div>
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
