// Route: /hesabim/yardim/yeni-talep
import { useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft, Headphones, PackageOpen, RefreshCw, PackageX,
  Truck, Clock, Repeat, MoreHorizontal, Check, Bell, Phone,
  Camera, FileText, X,
} from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { goBack } from "@/lib/goBack";
import { apiRequest } from "@/lib/queryClient";
import { SUPPORT_BRAND as P, SUPPORT_BRAND_LIGHT as PL } from "@/lib/support-api";

/* ── Palette ─────────────────────────── */
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

const TOPIC_LABELS: Record<string, string> = {
  order: "Sipariş ve Teslimat",
  payment: "Ödeme ve Taksit",
  product: "Ürün Bilgisi",
  membership: "Üyelik",
  other: "Diğer",
};

const ISSUE_LABELS: Record<string, string> = {
  missing: "Eksik Ürün",
  wrong: "Yanlış Ürün",
  damaged: "Hasarlı Ürün",
  delay: "Kargo Gecikmesi",
  return: "İade / Değişim",
  other: "Diğer",
};

type OrderRow = {
  id: number | string;
  status: string;
  grandTotal: number | string;
  createdAt: string;
  items: Array<{ name?: string; productName?: string; img?: string | null }>;
};

/* ── Preloaded files ─────────────────── */
type UFile = { id:string; name:string; size:string; type:"image"|"pdf"; previewUrl?:string; };

/* ── KVKK Aydınlatma Modal ───────────── */
const AYDINLATMA_SECTIONS = [
  {
    heading: "1. Veri Sorumlusu",
    text: "Destek talebiniz kapsamında paylaştığınız kişisel veriler, veri sorumlusu sıfatıyla Sizpa İnternet Tic. Ltd. Şti. (YourPoodle) tarafından işlenmektedir. İletişim: info@sizpa.com",
  },
  {
    heading: "2. İşlenen Veriler",
    text: "Ad-soyad, üyelik iletişim bilgileriniz, sipariş numarası ve sipariş bilgileri, talep konusu ve açıklamanız, yüklediğiniz fotoğraf/belge ekleri, tercih ettiğiniz iletişim yöntemi (uygulama bildirimi, telefon, SMS) ve talebin takibi için gerekli teknik kayıtlar işlenebilir.",
  },
  {
    heading: "3. İşleme Amacı",
    text: "Verileriniz; destek talebinizin alınması, incelenmesi, yanıtlanması, iade/değişim veya şikâyet süreçlerinin yürütülmesi, müşteri memnuniyetinin sağlanması ve yasal yükümlülüklerin yerine getirilmesi amacıyla işlenir.",
  },
  {
    heading: "4. Hukuki Dayanak",
    text: "İşleme; 6698 sayılı KVKK’nın 5. maddesi kapsamında sözleşmenin ifası, hukuki yükümlülük, meşru menfaat ve gerekli hallerde açık rızanıza dayanır. Destek talebi formundaki onay, talebinizin incelenmesi için gerekli bilgilerin işlenmesine ilişkin rızanızı ifade eder.",
  },
  {
    heading: "5. Aktarım",
    text: "Talebin çözümü için gerekli olduğu ölçüde kargo firmaları, ödeme/iade altyapı sağlayıcıları veya yasal zorunluluk halinde yetkili kamu kurumlarıyla sınırlı veri paylaşımı yapılabilir. Verileriniz pazarlama amacıyla üçüncü kişilere satılmaz.",
  },
  {
    heading: "6. Saklama Süresi",
    text: "Destek talebi kayıtları, talebin kapanmasından sonra yasal saklama süreleri ve olası uyuşmazlıkların takibi için makul süre boyunca muhafaza edilir; süre sonunda silinir veya anonimleştirilir. Yüklediğiniz ekler yalnızca talep süreciyle sınırlı kullanılır.",
  },
  {
    heading: "7. Haklarınız",
    text: "KVKK’nın 11. maddesi uyarınca verilerinize erişme, düzeltme, silme, işlemeyi kısıtlama, itiraz etme ve zararınızın giderilmesini talep etme haklarına sahipsiniz. Başvurularınızı info@sizpa.com adresine iletebilirsiniz. Ayrıntılı metin için Gizlilik Politikası sayfamızı inceleyebilirsiniz.",
  },
] as const;

function AydinlatmaModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="aydinlatma-title"
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 9999,
        display: "flex", alignItems: "flex-end", justifyContent: "center",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: "20px 20px 0 0",
          padding: "24px 20px 28px", width: "100%", maxWidth: "var(--yp-shell-max)",
          maxHeight: "85vh", display: "flex", flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span id="aydinlatma-title" style={{ fontSize: 16, fontWeight: 700, color: DRK }}>
            KVKK Aydınlatma Metni
          </span>
          <button type="button" onClick={onClose} aria-label="Kapat"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <X size={20} color={GT} />
          </button>
        </div>
        <p style={{ fontSize: 11, color: GT, margin: "0 0 14px", lineHeight: 1.5 }}>
          Destek talebi kapsamında kişisel verilerinizin işlenmesine ilişkin bilgilendirme
          (6698 sayılı KVKK). Son güncelleme: 12 Ağustos 2026.
        </p>
        <div style={{ overflowY: "auto", flex: 1, fontSize: 12, color: "#4B5563", lineHeight: 1.7, marginBottom: 16 }}>
          {AYDINLATMA_SECTIONS.map(s => (
            <div key={s.heading} style={{ marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: DRK, marginBottom: 4 }}>{s.heading}</div>
              <p style={{ margin: 0 }}>{s.text}</p>
            </div>
          ))}
        </div>
        <button type="button" onClick={onClose}
          style={{
            width: "100%", background: P, color: "#fff", border: "none", borderRadius: 12,
            padding: "14px 0", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
          }}>
          Anladım
        </button>
      </div>
    </div>
  );
}

/* ── Order Picker Modal ──────────────── */
function OrderPickerModal({ orders, selected, onSelect, onClose }:{
  orders: OrderRow[]; selected:string; onSelect:(id:string)=>void; onClose:()=>void;
}) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)",
                  display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:9999 }}>
      <div style={{ background:"#fff", borderRadius:"20px 20px 0 0",
                    padding:"24px 20px 40px", width:"100%", maxWidth: "var(--yp-shell-max)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
          <span style={{ fontSize:17, fontWeight:700, color:DRK }}>Sipariş Seçin</span>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer" }}>
            <X size={20} color={GT} />
          </button>
        </div>
        {orders.length === 0 ? (
          <div style={{ fontSize:13, color:GT, textAlign:"center", padding:"16px 0" }}>
            Henüz siparişiniz yok.
          </div>
        ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {orders.map(o => {
            const oid = String(o.id);
            const thumbs = o.items?.slice(0, 2).map(i => i.img).filter(Boolean) as string[];
            return (
            <button key={oid} onClick={() => { onSelect(oid); onClose(); }}
              style={{
                display:"flex", alignItems:"center", gap:12, padding:"14px",
                border:`1.5px solid ${oid === selected ? P : GB}`,
                borderRadius:14, background: oid === selected ? PL : "#fff",
                cursor:"pointer", fontFamily:"inherit", textAlign:"left",
              }}>
              <div style={{ display:"flex", marginRight:4 }}>
                {thumbs.length > 0 ? thumbs.map((t,i) => (
                  <img key={i} src={t} alt="" style={{
                    width:38, height:38, borderRadius:8, objectFit:"cover",
                    border:"2px solid #fff", marginLeft: i>0 ? -10 : 0,
                  }} />
                )) : (
                  <div style={{ width:38, height:38, borderRadius:8, background:PL }} />
                )}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:700, color:DRK }}>Sipariş #{o.id}</div>
                <div style={{ fontSize:11, color:GT }}>
                  {new Date(o.createdAt).toLocaleDateString("tr-TR")} · {o.items?.length ?? 0} ürün
                </div>
                <div style={{ fontSize:13, fontWeight:700, color:P }}>
                  {Number(o.grandTotal || 0).toLocaleString("tr-TR")} TL
                </div>
              </div>
              <RadioDot selected={oid === selected} />
            </button>
          );})}
        </div>
        )}
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
  const queryClient = useQueryClient();

  const { data: orders = [] } = useQuery<OrderRow[]>({
    queryKey: ["/api/customer/orders"],
    queryFn: async () => {
      const r = await fetch("/api/customer/orders", { credentials: "include" });
      if (!r.ok) return [];
      return r.json();
    },
  });

  const [topic,     setTopic]     = useState("order");
  const [issue,     setIssue]     = useState("missing");
  const [orderId,   setOrderId]   = useState("");
  const [title,     setTitle]     = useState("");
  const [desc,      setDesc]      = useState("");
  const [files,     setFiles]     = useState<UFile[]>([]);
  const [contact,   setContact]   = useState<"app"|"phone">("app");
  const [sms,       setSms]       = useState(true);
  const [consent,   setConsent]   = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [aydinlatmaOpen, setAydinlatmaOpen] = useState(false);
  const [success,   setSuccess]   = useState(false);
  const [ticketNo,  setTicketNo]  = useState("");
  const [errors,    setErrors]    = useState<Record<string,string>>({});
  const [toast,     setToast]     = useState("");

  const fileRef = useRef<HTMLInputElement>(null);

  const effectiveOrderId = orderId || (orders[0] ? String(orders[0].id) : "");
  const selectedOrder = useMemo(
    () => orders.find(o => String(o.id) === effectiveOrderId) ?? orders[0] ?? null,
    [orders, effectiveOrderId],
  );

  const showToast = (m:string) => { setToast(m); setTimeout(()=>setToast(""),2200); };

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

  const createMutation = useMutation({
    mutationFn: async () => {
      const category = `${TOPIC_LABELS[topic] ?? topic} · ${ISSUE_LABELS[issue] ?? issue}`;
      const res = await apiRequest("POST", "/api/customer/support-tickets", {
        subject: title.trim(),
        category,
        body: `${desc.trim()}${contact === "phone" ? "\n\nİletişim: Telefon" : ""}${sms ? "\nSMS bildirimi: Evet" : ""}`,
        ...(effectiveOrderId ? { orderId: effectiveOrderId } : {}),
      });
      return res.json() as Promise<{ id: string }>;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/customer/support-tickets"] });
      setTicketNo(String(data.id));
      setSuccess(true);
    },
    onError: (err: Error) => {
      showToast(err.message.replace(/^\d+:\s*/, "") || "Talep gönderilemedi");
    },
  });

  const submit = () => {
    if (!validate()) return;
    createMutation.mutate();
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
        <OrderPickerModal orders={orders} selected={effectiveOrderId}
          onSelect={setOrderId} onClose={() => setOrderOpen(false)} />
      )}

      {aydinlatmaOpen && (
        <AydinlatmaModal onClose={() => setAydinlatmaOpen(false)} />
      )}

      {success && (
        <SuccessModal ticketNo={ticketNo}
          onClose={() => { setSuccess(false); navigate(`/hesabim/yardim/talep/${ticketNo}`); }} />
      )}

      <div style={{ maxWidth: "var(--yp-shell-max)", margin:"0 auto", fontFamily:"'Inter',-apple-system,sans-serif",
                    background:"#fff", minHeight:"100vh", color:DRK, paddingBottom:0 }}>

        {/* ── PAGE HEADER ── */}
        <div style={{ padding:"14px 16px 12px", background:"#fff",
                      borderBottom:`1px solid ${GB}`, marginBottom:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:12, flexWrap:"wrap" as any }}>
            <button onClick={() => goBack(navigate, "/hesabim/yardim")}
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

          {topic === "order" && (
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:14, fontWeight:700, color:DRK, marginBottom:12 }}>
              2. Siparişinizi Seçin
            </div>
            {!selectedOrder ? (
              <div style={{ border:`1px solid ${GB}`, borderRadius:16, padding:"20px 14px", textAlign:"center", color:GT, fontSize:13 }}>
                İlişkilendirmek için önce bir sipariş vermeniz gerekir.
              </div>
            ) : (
            <div style={{ border:`1px solid ${GB}`, borderRadius:16, padding:"14px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ display:"flex", flexShrink:0 }}>
                  {(selectedOrder.items ?? []).slice(0, 2).map((item, i) => item.img ? (
                    <img key={i} src={item.img} alt="" style={{
                      width:44, height:44, borderRadius:10, objectFit:"cover",
                      border:"2px solid #fff", marginLeft: i>0 ? -12 : 0,
                    }} />
                  ) : null)}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:DRK }}>
                    Sipariş #{selectedOrder.id}
                  </div>
                  <div style={{ fontSize:11, color:GT, marginTop:2 }}>
                    {new Date(selectedOrder.createdAt).toLocaleDateString("tr-TR")} · {selectedOrder.items?.length ?? 0} ürün
                  </div>
                  <div style={{ fontSize:13, fontWeight:700, color:P, marginTop:2 }}>
                    {Number(selectedOrder.grandTotal || 0).toLocaleString("tr-TR")} TL
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6, flexShrink:0 }}>
                  <span style={{ fontSize:10, fontWeight:700, color:"#16A34A",
                                 background:"#DCFCE7", padding:"3px 8px", borderRadius:999 }}>
                    {selectedOrder.status}
                  </span>
                  <RadioDot selected={true} />
                  {orders.length > 1 && (
                  <button onClick={() => setOrderOpen(true)}
                    style={{ fontSize:10, fontWeight:700, color:P, border:`1px solid ${P}`,
                             background:"#fff", borderRadius:8, padding:"4px 8px",
                             cursor:"pointer", fontFamily:"inherit" }}>
                    Değiştir
                  </button>
                  )}
                </div>
              </div>
            </div>
            )}
          </div>
          )}

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
              border:"2px dashed #D4C4B0", borderRadius:16, padding:"14px",
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
              <button
                type="button"
                onClick={e => { e.preventDefault(); e.stopPropagation(); setAydinlatmaOpen(true); }}
                style={{
                  background: "none", border: "none", padding: 0, color: P, fontWeight: 700,
                  textDecoration: "underline", cursor: "pointer", fontSize: "inherit",
                  fontFamily: "inherit",
                }}
              >
                Aydınlatma Metni
              </button>
            </label>
          </div>
          {errors.consent && <div style={{ fontSize:11, color:"#DC2626", marginBottom:8 }}>{errors.consent}</div>}

          {/* ── BUTTONS ── */}
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
            <button onClick={submit} disabled={createMutation.isPending}
              style={{
                width:"100%", padding:"14px 0", borderRadius:14,
                background: createMutation.isPending ? "#9CA3AF" : P,
                border:"none", fontSize:14, fontWeight:700, color:"#fff",
                cursor: createMutation.isPending ? "not-allowed" : "pointer", fontFamily:"inherit",
              }}>
              {createMutation.isPending ? "Gönderiliyor..." : "Talebi Gönder"}
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
