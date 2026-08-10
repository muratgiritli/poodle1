// Route: /hesabim/adresler
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft, Plus, Home, Building2, MapPin, Star,
  Pencil, Copy, Trash2, Truck, ChevronUp, ChevronDown,
  ShieldCheck, Headphones, Check, Navigation,
} from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { useCustomer } from "@/contexts/CustomerContext";

/* ─── Palette ─────────────────────────── */
const P   = "#4B2BD6";
const PD  = "#3E27B3";
const PL  = "#F5F0E6";
const GB  = "#E5E7EB";
const GBG = "#F9FAFB";
const GT  = "#6B7280";
const DRK = "#111827";

/* ─── Turkish location data (all 81 provinces) ────────── */
const PROVINCES = [
  "Adana","Adıyaman","Afyonkarahisar","Ağrı","Aksaray","Amasya","Ankara","Antalya",
  "Ardahan","Artvin","Aydın","Balıkesir","Bartın","Batman","Bayburt","Bilecik",
  "Bingöl","Bitlis","Bolu","Burdur","Bursa","Çanakkale","Çankırı","Çorum",
  "Denizli","Diyarbakır","Düzce","Edirne","Elazığ","Erzincan","Erzurum","Eskişehir",
  "Gaziantep","Giresun","Gümüşhane","Hakkari","Hatay","Iğdır","Isparta","İstanbul",
  "İzmir","Kahramanmaraş","Karabük","Karaman","Kars","Kastamonu","Kayseri","Kırıkkale",
  "Kırklareli","Kırşehir","Kilis","Kocaeli","Konya","Kütahya","Malatya","Manisa",
  "Mardin","Mersin","Muğla","Muş","Nevşehir","Niğde","Ordu","Osmaniye","Rize",
  "Sakarya","Samsun","Siirt","Sinop","Sivas","Şanlıurfa","Şırnak","Tekirdağ",
  "Tokat","Trabzon","Tunceli","Uşak","Van","Yalova","Yozgat","Zonguldak",
];

const DISTRICTS: Record<string, string[]> = {
  Adana:         ["Seyhan","Çukurova","Yüreğir","Sarıçam","Ceyhan","Kozan"],
  Ankara:        ["Çankaya","Keçiören","Yenimahalle","Mamak","Altındağ","Etimesgut","Sincan","Pursaklar","Gölbaşı","Polatlı"],
  Antalya:       ["Muratpaşa","Kepez","Konyaaltı","Döşemealtı","Aksu","Alanya","Manavgat","Serik"],
  Aydın:         ["Efeler","Kuşadası","Didim","Nazilli","Söke"],
  Balıkesir:     ["Altıeylül","Karesi","Bandırma","Burhaniye","Edremit"],
  Bursa:         ["Osmangazi","Nilüfer","Yıldırım","Mudanya","Gürsu","Kestel","İnegöl","Gemlik"],
  Denizli:       ["Merkezefendi","Pamukkale"],
  Diyarbakır:    ["Bağlar","Kayapınar","Sur","Yenişehir"],
  Edirne:        ["Merkez","Keşan","Uzunköprü"],
  Erzurum:       ["Yakutiye","Palandöken","Aziziye"],
  Eskişehir:     ["Odunpazarı","Tepebaşı"],
  Gaziantep:     ["Şahinbey","Şehitkamil","Nizip"],
  Hatay:         ["Antakya","İskenderun","Arsuz","Dörtyol"],
  İstanbul:      [
    "Adalar","Arnavutköy","Ataşehir","Avcılar","Bağcılar","Bahçelievler","Bakırköy",
    "Başakşehir","Bayrampaşa","Beşiktaş","Beykoz","Beylikdüzü","Beyoğlu","Büyükçekmece",
    "Çatalca","Çekmeköy","Esenler","Esenyurt","Eyüpsultan","Fatih","Gaziosmanpaşa",
    "Güngören","Kadıköy","Kağıthane","Kartal","Küçükçekmece","Maltepe","Pendik",
    "Sancaktepe","Sarıyer","Silivri","Sultanbeyli","Sultangazi","Şile","Şişli",
    "Tuzla","Ümraniye","Üsküdar","Zeytinburnu",
  ],
  İzmir:         ["Konak","Karşıyaka","Bornova","Buca","Çiğli","Narlıdere","Bayraklı","Gaziemir","Karabağlar","Balçova","Güzelbahçe","Menderes","Torbalı","Kemalpaşa"],
  Kahramanmaraş: ["Onikişubat","Dulkadiroğlu"],
  Kayseri:       ["Kocasinan","Melikgazi","Talas","Develi"],
  Kocaeli:       ["İzmit","Gebze","Darıca","Gölcük","Körfez","Başiskele","Çayırova","Dilovası"],
  Konya:         ["Karatay","Meram","Selçuklu","Ereğli"],
  Malatya:       ["Battalgazi","Yeşilyurt"],
  Manisa:        ["Yunusemre","Şehzadeler","Akhisar","Turgutlu"],
  Mersin:        ["Yenişehir","Mezitli","Toroslar","Akdeniz","Tarsus","Erdemli"],
  Muğla:         ["Bodrum","Fethiye","Marmaris","Milas","Menteşe","Dalaman"],
  Ordu:          ["Altınordu","Ünye","Fatsa"],
  Rize:          ["Merkez","Ardeşen","Çayeli"],
  Sakarya:       ["Adapazarı","Serdivan","Erenler","Arifiye","Hendek"],
  Samsun:        ["Atakum","İlkadım","Canik","Tekkeköy","Bafra","Vezirköprü"],
  Tekirdağ:      ["Süleymanpaşa","Çorlu","Çerkezköy","Ergene"],
  Trabzon:       ["Ortahisar","Akçaabat","Araklı","Of"],
  Van:           ["İpekyolu","Tuşba","Edremit"],
  Şanlıurfa:     ["Eyyübiye","Haliliye","Karaköprü"],
  Zonguldak:     ["Merkez","Kdz. Ereğli","Çaycuma"],
};

/* ─── Types ───────────────────────────── */
interface Address {
  id:           string;
  title:        string;
  fullName:     string;
  phone:        string;
  province:     string;
  district:     string;
  neighborhood: string;
  streetAddress:string;
  buildingNo:   string;
  floor:        string;
  apartmentNo:  string;
  deliveryNote: string;
  isDefault:    boolean;
  iconType:     "home" | "work" | "family";
}

const INITIAL_ADDRESSES: Address[] = [
  {
    id: "addr-1", title: "Evim", fullName: "Ayşe Yılmaz", phone: "0532 ••• 48",
    province: "İstanbul", district: "Kadıköy", neighborhood: "Moda Mahallesi",
    streetAddress: "Bahariye Cad. No: 12 D: 5",
    buildingNo: "12", floor: "2", apartmentNo: "5",
    deliveryNote: "Zil çalışmıyor, lütfen arayın.",
    isDefault: true, iconType: "home",
  },
  {
    id: "addr-2", title: "İş Yerim", fullName: "Ayşe Yılmaz", phone: "0532 ••• 48",
    province: "İstanbul", district: "Beşiktaş", neighborhood: "Levent Mahallesi",
    streetAddress: "Büyükdere Cad. No: 78 K: 4",
    buildingNo: "78", floor: "4", apartmentNo: "14",
    deliveryNote: "",
    isDefault: false, iconType: "work",
  },
];

const ICON_CONFIG = {
  home:   { bg: "#F5F0E6", color: "#5D3A1A", Icon: Home },
  work:   { bg: "#EFF6FF", color: "#3B82F6", Icon: Building2 },
  family: { bg: "#FDF2F8", color: "#EC4899", Icon: MapPin },
};

const EMPTY_FORM = {
  title: "", fullName: "", phone: "",
  province: "İstanbul", district: "Kadıköy", neighborhood: "",
  streetAddress: "", buildingNo: "", floor: "", apartmentNo: "",
  deliveryNote: "", isDefault: true, iconType: "home" as Address["iconType"],
};

const LS_KEY = "yourpoodle_addresses";

function loadAddresses(): Address[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_ADDRESSES;
}

function saveAddresses(addrs: Address[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(addrs)); } catch {}
}

/* ─── Helper components ───────────────── */
function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [msg]);
  return (
    <div style={{
      position: "fixed", top: 70, left: "50%", transform: "translateX(-50%)",
      background: "#111", color: "#fff", padding: "10px 20px", borderRadius: 12,
      fontSize: 13, fontWeight: 600, zIndex: 999, whiteSpace: "nowrap",
      boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
    }}>
      {msg}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} aria-checked={checked} role="switch"
      style={{
        width: 44, height: 24, borderRadius: 12, flexShrink: 0,
        background: checked ? P : "#D1D5DB",
        border: "none", cursor: "pointer", position: "relative",
        transition: "background 0.2s",
      }}>
      <span style={{
        position: "absolute", top: 2, left: checked ? 22 : 2,
        width: 20, height: 20, borderRadius: "50%", background: "#fff",
        transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
      }} />
    </button>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 12, fontWeight: 600, color: GT, marginBottom: 5 }}>{children}</div>;
}

const INPUT_STYLE: React.CSSProperties = {
  width: "100%", padding: "10px 12px", borderRadius: 12,
  border: `1.5px solid ${GB}`, fontSize: 13, fontFamily: "inherit",
  color: DRK, outline: "none", background: "#fff", boxSizing: "border-box",
};

const SELECT_STYLE: React.CSSProperties = {
  ...INPUT_STYLE, appearance: "none", cursor: "pointer",
};

/* ─── Address Card ────────────────────── */
function AddressCard({
  address, onSetDefault, onEdit, onCopy, onDelete,
}: {
  address: Address;
  onSetDefault: (id: string) => void;
  onEdit: (a: Address) => void;
  onCopy: (a: Address) => void;
  onDelete: (id: string) => void;
}) {
  const { bg, color, Icon } = ICON_CONFIG[address.iconType];
  const isDefault = address.isDefault;

  return (
    <div style={{
      background: "#fff", borderRadius: 16, padding: "14px 14px 10px",
      border: isDefault ? `2px solid ${P}` : `1.5px solid ${GB}`,
      marginBottom: 10,
    }}>
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          {/* Icon */}
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: bg, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon size={20} color={color} />
          </div>
          {/* Title + badge */}
          <div style={{ paddingTop: 2 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: DRK }}>{address.title}</span>
              {isDefault && (
                <span style={{
                  fontSize: 10, fontWeight: 700, color: P,
                  background: "#EDE5D8", padding: "2px 7px", borderRadius: 999,
                }}>
                  Varsayılan
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Radio/check */}
        <button onClick={() => onSetDefault(address.id)}
          style={{
            width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
            background: isDefault ? P : "#fff",
            border: `2px solid ${isDefault ? P : "#D1D5DB"}`,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
          {isDefault && <Check size={12} color="#fff" strokeWidth={3} />}
        </button>
      </div>

      {/* Details */}
      <div style={{ marginTop: 10, fontSize: 12, color: GT, lineHeight: 1.6 }}>
        <div>{address.fullName} • {address.phone}</div>
        <div>{address.neighborhood}, {address.streetAddress}, {address.district} / {address.province}</div>
        {address.deliveryNote && (
          <div style={{ color: "#3B82F6", fontStyle: "italic", marginTop: 2 }}>
            {address.deliveryNote}
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{
        display: "flex", alignItems: "center", flexWrap: "wrap", gap: 12,
        marginTop: 12, paddingTop: 10, borderTop: `1px solid ${GBG}`,
      }}>
        {!isDefault && (
          <button onClick={() => onSetDefault(address.id)}
            style={{
              display: "flex", alignItems: "center", gap: 4,
              background: "none", border: "none", cursor: "pointer",
              fontSize: 11, fontWeight: 600, color: P, fontFamily: "inherit",
            }}>
            <Star size={12} /> Varsayılan Yap
          </button>
        )}
        <button onClick={() => onEdit(address)}
          style={{
            display: "flex", alignItems: "center", gap: 4,
            background: "none", border: "none", cursor: "pointer",
            fontSize: 11, fontWeight: 600, color: GT, fontFamily: "inherit",
          }}>
          <Pencil size={12} /> Düzenle
        </button>
        {isDefault && (
          <button onClick={() => onCopy(address)}
            style={{
              display: "flex", alignItems: "center", gap: 4,
              background: "none", border: "none", cursor: "pointer",
              fontSize: 11, fontWeight: 600, color: GT, fontFamily: "inherit",
            }}>
            <Copy size={12} /> Kopyala
          </button>
        )}
        <button onClick={() => onDelete(address.id)}
          style={{
            display: "flex", alignItems: "center", gap: 4,
            background: "none", border: "none", cursor: "pointer",
            fontSize: 11, fontWeight: 600, color: "#EF4444", fontFamily: "inherit",
          }}>
          <Trash2 size={12} /> Sil
        </button>
      </div>
    </div>
  );
}

/* ─── Delete Modal ────────────────────── */
function DeleteModal({
  address, onConfirm, onCancel,
}: { address: Address; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      zIndex: 999, padding: "0 0 0",
    }}>
      <div style={{
        background: "#fff", borderRadius: "20px 20px 0 0", padding: "24px 20px 36px",
        width: "100%", maxWidth: 480,
      }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: DRK, marginBottom: 10 }}>
          Adresi Sil
        </div>
        <div style={{ fontSize: 13, color: GT, lineHeight: 1.6, marginBottom: 20 }}>
          <strong>{address.title}</strong> adresini silmek istediğinize emin misiniz?
          {address.isDefault && (
            <div style={{ color: "#F97316", marginTop: 6 }}>
              Varsayılan adres silinecek, başka bir adres varsayılan yapılacak.
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel}
            style={{
              flex: 1, padding: "12px 0", borderRadius: 12,
              border: `1.5px solid ${GB}`, background: "#fff",
              fontSize: 14, fontWeight: 600, color: GT, cursor: "pointer", fontFamily: "inherit",
            }}>
            İptal
          </button>
          <button onClick={onConfirm}
            style={{
              flex: 1, padding: "12px 0", borderRadius: 12,
              border: "none", background: "#EF4444",
              fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "inherit",
            }}>
            Sil
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Address Form ────────────────────── */
function AddressForm({
  form, setForm, onSave, onCancel, editMode, formRef,
}: {
  form: typeof EMPTY_FORM;
  setForm: React.Dispatch<React.SetStateAction<typeof EMPTY_FORM>>;
  onSave: () => void;
  onCancel: () => void;
  editMode: boolean;
  formRef: React.RefObject<HTMLDivElement>;
}) {
  const [invoiceDiff, setInvoiceDiff] = useState(false);
  const s = (k: keyof typeof EMPTY_FORM, v: any) => setForm(f => ({ ...f, [k]: v }));

  const handleLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      () => { /* real geocoding would go here — leave fields as-is for now */ },
      () => { /* permission denied — silent */ },
    );
  };

  const districts = DISTRICTS[form.province] || [];

  return (
    <div ref={formRef} style={{ padding: "0 12px" }}>
      <div style={{
        background: "#fff", borderRadius: 16,
        border: `1.5px solid ${GB}`, padding: "16px 14px",
        display: "flex", flexDirection: "column", gap: 12,
      }}>

        {/* Title + Name */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <FieldLabel>Adres Başlığı</FieldLabel>
            <input style={INPUT_STYLE} placeholder="Ev, İş, Ailem..."
              value={form.title} onChange={e => s("title", e.target.value)} />
          </div>
          <div>
            <FieldLabel>Ad Soyad</FieldLabel>
            <input style={INPUT_STYLE} placeholder="Ayşe Yılmaz"
              value={form.fullName} onChange={e => s("fullName", e.target.value)} />
          </div>
        </div>

        {/* Phone */}
        <div>
          <FieldLabel>Cep Telefonu</FieldLabel>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 6, padding: "10px 10px",
              border: `1.5px solid ${GB}`, borderRadius: 12, background: GBG, flexShrink: 0,
            }}>
              <span style={{ fontSize: 16 }}>🇹🇷</span>
              <span style={{ fontSize: 13, color: DRK, fontWeight: 600 }}>+90</span>
            </div>
            <input style={{ ...INPUT_STYLE, flex: 1 }} placeholder="5XX XXX XX XX"
              value={form.phone} onChange={e => s("phone", e.target.value)} maxLength={10} />
          </div>
        </div>

        {/* İl / İlçe */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <FieldLabel>İl</FieldLabel>
            <select style={SELECT_STYLE} value={form.province}
              onChange={e => {
                const prov = e.target.value;
                const dist = DISTRICTS[prov]?.[0] || "";
                setForm(f => ({ ...f, province: prov, district: dist, neighborhood: "" }));
              }}>
              {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <FieldLabel>İlçe</FieldLabel>
            {districts.length > 0 ? (
              <select style={SELECT_STYLE} value={form.district}
                onChange={e => setForm(f => ({ ...f, district: e.target.value, neighborhood: "" }))}>
                <option value="">İlçe seçin</option>
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            ) : (
              <input style={INPUT_STYLE} placeholder="İlçe adı girin"
                value={form.district} onChange={e => setForm(f => ({ ...f, district: e.target.value, neighborhood: "" }))} />
            )}
          </div>
        </div>

        {/* Mahalle — free text for all Turkey */}
        <div>
          <FieldLabel>Mahalle</FieldLabel>
          <input style={INPUT_STYLE} placeholder="Mahalle adı"
            value={form.neighborhood} onChange={e => s("neighborhood", e.target.value)} />
        </div>

        {/* Adres */}
        <div>
          <FieldLabel>Adres</FieldLabel>
          <textarea rows={2} style={{ ...INPUT_STYLE, resize: "none" }}
            placeholder="Cadde, sokak, bina ve daire numarası..."
            value={form.streetAddress} onChange={e => s("streetAddress", e.target.value)} />
        </div>

        {/* Bina / Kat / Daire */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          <div>
            <FieldLabel>Bina No</FieldLabel>
            <input style={INPUT_STYLE} placeholder="Ör: 128"
              value={form.buildingNo} onChange={e => s("buildingNo", e.target.value)} />
          </div>
          <div>
            <FieldLabel>Kat</FieldLabel>
            <input style={INPUT_STYLE} placeholder="Ör: 7"
              value={form.floor} onChange={e => s("floor", e.target.value)} />
          </div>
          <div>
            <FieldLabel>Daire</FieldLabel>
            <input style={INPUT_STYLE} placeholder="Ör: 3"
              value={form.apartmentNo} onChange={e => s("apartmentNo", e.target.value)} />
          </div>
        </div>

        {/* Teslimat Notu */}
        <div>
          <FieldLabel>Teslimat Notu (İsteğe Bağlı)</FieldLabel>
          <textarea rows={2} style={{ ...INPUT_STYLE, resize: "none" }}
            placeholder="Kurye için kısa bir not..."
            value={form.deliveryNote} onChange={e => s("deliveryNote", e.target.value)} />
        </div>

        {/* Konum butonu */}
        <button onClick={handleLocation}
          style={{
            width: "100%", padding: "11px 0",
            border: `1.5px solid ${P}`, borderRadius: 12,
            background: "#fff", color: P,
            fontSize: 13, fontWeight: 700, cursor: "pointer",
            fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
          <Navigation size={15} /> Konumdan Adres Bul
        </button>

        {/* Varsayılan checkbox */}
        <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <div
            onClick={() => s("isDefault", !form.isDefault)}
            style={{
              width: 18, height: 18, borderRadius: 4, flexShrink: 0,
              border: `2px solid ${form.isDefault ? P : "#D1D5DB"}`,
              background: form.isDefault ? P : "#fff",
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            }}>
            {form.isDefault && <Check size={10} color="#fff" strokeWidth={3} />}
          </div>
          <span style={{ fontSize: 13, color: DRK }}>Bu adresi varsayılan yap</span>
        </label>

        {/* Fatura toggle */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10, background: GBG,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Building2 size={16} color={GT} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: DRK }}>Fatura bilgilerim farklı</div>
              <div style={{ fontSize: 11, color: GT }}>Kurumsal veya farklı bir fatura adresi kullanabilirsiniz.</div>
            </div>
          </div>
          <Toggle checked={invoiceDiff} onChange={() => setInvoiceDiff(v => !v)} />
        </div>

        {/* Save / Cancel */}
        <button onClick={onSave}
          style={{
            width: "100%", padding: "14px 0",
            background: `linear-gradient(135deg,${P},#6366F1)`,
            border: "none", borderRadius: 14,
            fontSize: 15, fontWeight: 700, color: "#fff",
            cursor: "pointer", fontFamily: "inherit",
          }}>
          Adresi Kaydet
        </button>
        <button onClick={onCancel}
          style={{
            width: "100%", padding: "12px 0",
            background: "#fff", border: `1.5px solid ${GB}`,
            borderRadius: 14, fontSize: 14, fontWeight: 600, color: GT,
            cursor: "pointer", fontFamily: "inherit",
          }}>
          Vazgeç
        </button>

        {/* Security note */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <ShieldCheck size={13} color="#16A34A" />
          <span style={{ fontSize: 12, color: GT }}>Adres bilgileriniz güvenli şekilde saklanır.</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────── */
export default function YPHesabimAdreslerimPage() {
  const [, navigate] = useLocation();
  const { isLoggedIn } = useCustomer();
  const formRef = useRef<HTMLDivElement>(null);

  const [addresses, setAddresses] = useState<Address[]>(loadAddresses);
  const [formOpen, setFormOpen] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [deleteTarget, setDeleteTarget] = useState<Address | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => { saveAddresses(addresses); }, [addresses]);

  useEffect(() => {
    if (isLoggedIn === false) {
      navigate("/yourpoodle/giris?returnTo=/hesabim/adresler");
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) return null;

  const showToast = (msg: string) => { setToast(msg); };

  const setDefault = (id: string) =>
    setAddresses(ads => ads.map(a => ({ ...a, isDefault: a.id === id })));

  const handleEdit = (a: Address) => {
    setForm({
      title: a.title, fullName: a.fullName, phone: a.phone,
      province: a.province, district: a.district, neighborhood: a.neighborhood,
      streetAddress: a.streetAddress, buildingNo: a.buildingNo, floor: a.floor,
      apartmentNo: a.apartmentNo, deliveryNote: a.deliveryNote,
      isDefault: a.isDefault, iconType: a.iconType,
    });
    setEditingId(a.id);
    setEditMode(true);
    setFormOpen(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleCopy = (a: Address) => {
    const text = `${a.title}: ${a.fullName}, ${a.phone}\n${a.neighborhood}, ${a.streetAddress}, ${a.district}/${a.province}`;
    navigator.clipboard?.writeText(text).catch(() => {});
    showToast("Adres panoya kopyalandı ✓");
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setAddresses(ads => {
      const next = ads.filter(a => a.id !== deleteTarget.id);
      if (deleteTarget.isDefault && next.length > 0) next[0].isDefault = true;
      return next;
    });
    setDeleteTarget(null);
    showToast("Adres silindi");
  };

  const handleSave = () => {
    if (!form.title.trim()) { showToast("Adres başlığı gerekli"); return; }
    if (!form.streetAddress.trim()) { showToast("Adres gerekli"); return; }

    if (editMode && editingId) {
      setAddresses(ads => ads.map(a => {
        if (a.id !== editingId) return form.isDefault ? { ...a, isDefault: false } : a;
        return { ...a, ...form };
      }));
      showToast("Adres güncellendi ✓");
    } else {
      const newId = `addr-${Date.now()}`;
      setAddresses(ads => {
        const base = form.isDefault ? ads.map(a => ({ ...a, isDefault: false })) : ads;
        return [...base, { ...form, id: newId }];
      });
      showToast("Adres kaydedildi ✓");
    }

    setForm({ ...EMPTY_FORM });
    setEditMode(false);
    setEditingId(null);
    setFormOpen(false);
  };

  const handleCancel = () => {
    setForm({ ...EMPTY_FORM });
    setEditMode(false);
    setEditingId(null);
    setFormOpen(false);
  };

  const openAddNew = () => {
    setForm({ ...EMPTY_FORM });
    setEditMode(false);
    setEditingId(null);
    setFormOpen(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const sorted = [...addresses].sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));

  return (
    <YPLayout activeLink="" constrain={false}>
      {toast && <Toast msg={toast} onDone={() => setToast("")} />}
      {deleteTarget && (
        <DeleteModal address={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      )}

      <div style={{
        maxWidth: 480, margin: "0 auto",
        fontFamily: "'Inter',-apple-system,sans-serif",
        color: DRK, background: GBG, minHeight: "100vh", paddingBottom: 30,
      }}>

        {/* ── HEADER ── */}
        <div style={{ background: "#fff", padding: "14px 16px 16px", borderBottom: `1px solid ${GB}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <button onClick={() => navigate("/hesabim")} aria-label="Geri"
              style={{ background: "none", border: "none", cursor: "pointer",
                       display: "flex", alignItems: "center", padding: 0, color: GT }}>
              <ArrowLeft size={17} />
            </button>
            <span style={{ fontSize: 12, color: GT }}>Hesabım</span>
            <span style={{ fontSize: 12, color: GT }}>/</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: DRK }}>Adreslerim</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: DRK }}>Adreslerim</h1>
            <span style={{
              fontSize: 11, fontWeight: 700, color: P,
              background: "#EDE5D8", padding: "4px 10px", borderRadius: 999,
            }}>
              {addresses.length} kayıtlı adres
            </span>
          </div>
          <p style={{ fontSize: 13, color: GT, lineHeight: 1.5, marginBottom: 14 }}>
            Teslimat ve fatura adreslerinizi yönetin.
          </p>

          <button onClick={openAddNew}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              width: "auto", padding: "10px 20px", borderRadius: 12,
              background: P, border: "none", color: "#fff",
              fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = PD; }}
            onMouseLeave={e => { e.currentTarget.style.background = P; }}>
            <Plus size={16} /> Yeni Adres Ekle
          </button>
        </div>

        {/* ── ADDRESS LIST ── */}
        <div style={{ padding: "12px 12px 0" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: DRK, marginBottom: 8 }}>
            Kayıtlı Adresler
          </div>
          {sorted.map(a => (
            <AddressCard key={a.id} address={a}
              onSetDefault={setDefault}
              onEdit={handleEdit}
              onCopy={handleCopy}
              onDelete={id => setDeleteTarget(addresses.find(x => x.id === id)!)}
            />
          ))}

          {/* Green banner */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "#F0FDF4", border: "1px solid #BBF7D0",
            borderRadius: 12, padding: "10px 14px", marginBottom: 12,
          }}>
            <Truck size={16} color="#16A34A" />
            <span style={{ fontSize: 12, color: "#15803D", fontWeight: 500 }}>
              Varsayılan adresiniz ödeme sırasında otomatik seçilir.
            </span>
          </div>

          {/* ── FORM SECTION ── */}
          <div style={{ marginBottom: 12 }}>
            {/* Form header */}
            <button
              onClick={() => setFormOpen(v => !v)}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 0", background: "none", border: "none",
                cursor: "pointer", fontFamily: "inherit",
              }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%", background: P,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <MapPin size={15} color="#fff" />
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: DRK }}>
                  {editMode ? "Adresi Düzenle" : "Yeni Adres Ekle"}
                </span>
              </div>
              {formOpen ? <ChevronUp size={18} color={GT} /> : <ChevronDown size={18} color={GT} />}
            </button>
            {!formOpen && (
              <p style={{ fontSize: 12, color: GT, marginBottom: 4 }}>
                Adres için adres bilgilerini eksiksiz girin.
              </p>
            )}

            {formOpen && (
              <AddressForm
                form={form}
                setForm={setForm}
                onSave={handleSave}
                onCancel={handleCancel}
                editMode={editMode}
                formRef={formRef}
              />
            )}
          </div>

          {/* ── SUPPORT BANNER ── */}
          <div style={{
            background: "#F5F0E6", borderRadius: 16, padding: "16px 14px",
            display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%", background: P,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Headphones size={18} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: DRK, marginBottom: 4 }}>
                Adres eklerken sorun mu yaşıyorsunuz?
              </div>
              <div style={{ fontSize: 12, color: GT, lineHeight: 1.5, marginBottom: 12 }}>
                Ekibimiz size yardımcı olmak için burada.
              </div>
              <button
                onClick={() => alert("Destek")}
                style={{
                  background: P, color: "#fff", border: "none",
                  borderRadius: 10, padding: "9px 20px",
                  fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                }}>
                Destek Al
              </button>
            </div>
          </div>

          {/* ── MINI FOOTER ── */}
          <div style={{ background: "#1D1E9B", borderRadius: 16, padding: "20px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 22 }}>🐾</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>YourPoodle</span>
            </div>
            <div style={{ display: "flex", gap: 14, marginBottom: 12 }}>
              {["Yardım", "İletişim", "KVKK"].map(l => (
                <a key={l} href="#" style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>{l}</a>
              ))}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>
              🔒 256-bit SSL ile güvenli alışveriş
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
              © 2026 YourPoodle
            </div>
          </div>
        </div>
      </div>
    </YPLayout>
  );
}
