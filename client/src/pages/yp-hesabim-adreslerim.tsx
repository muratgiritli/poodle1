// Route: /hesabim/adresler
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  ArrowLeft, Plus, Home, Building2, MapPin, Star,
  Pencil, Trash2, Truck, ChevronUp, ChevronDown,
  ShieldCheck, Headphones, Check,
} from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { useCustomer } from "@/contexts/CustomerContext";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { goBack } from "@/lib/goBack";
import { IS_YP } from "@/lib/store";
import { PROVINCE_NAMES, districtsOf } from "@shared/turkeyLocations";

const BASE = IS_YP ? "" : "/yourpoodle";
const P   = "#5D3A1A";
const PD  = "#3D2612";
const PL  = "#F5F0E6";
const GB  = "#E5E7EB";
const GBG = "#F9FAFB";
const GT  = "#6B7280";
const DRK = "#111827";

const LABEL_CHIPS = [
  { value: "Ev", kind: "home" as const },
  { value: "İş", kind: "work" as const },
  { value: "Diğer", kind: "other" as const },
];

interface ApiAddress {
  id: number;
  label: string;
  address: string;
  isDefault: boolean;
  district?: string | null;
  neighborhoodId?: number | null;
}

const ICON_CONFIG = {
  home:   { bg: PL, color: P, Icon: Home },
  work:   { bg: "#EFF6FF", color: "#3B82F6", Icon: Building2 },
  other:  { bg: "#FDF2F8", color: "#EC4899", Icon: MapPin },
};

function iconType(label: string): keyof typeof ICON_CONFIG {
  const l = label.toLocaleLowerCase("tr-TR");
  if (l.includes("iş") || l.includes("is") || l.includes("ofis")) return "work";
  if (l.includes("ev")) return "home";
  return "other";
}

/** district field format: "İlçe · İl" */
function parseDistrictField(raw?: string | null): { city: string; district: string } {
  const s = String(raw || "").trim();
  if (!s) return { city: "Ankara", district: "" };
  if (s.includes("·")) {
    const [d, c] = s.split("·").map((x) => x.trim());
    return { city: c || "Ankara", district: d || "" };
  }
  if (s.includes(",")) {
    const [d, c] = s.split(",").map((x) => x.trim());
    return { city: c || "Ankara", district: d || "" };
  }
  return { city: "Ankara", district: s };
}

function formatDistrictField(city: string, district: string) {
  if (!district) return city || "";
  return `${district} · ${city}`;
}

function parseAddressBody(raw: string): { recipient: string; phone: string; neighborhood: string; detail: string } {
  const lines = String(raw || "").split("\n").map((l) => l.trim()).filter(Boolean);
  let recipient = "";
  let phone = "";
  let neighborhood = "";
  let detail = "";
  if (lines[0] && /·|\//.test(lines[0]) && /\d{10}/.test(lines[0].replace(/\D/g, ""))) {
    const parts = lines[0].split(/·|\//).map((p) => p.trim());
    recipient = parts[0] || "";
    phone = parts[1] || "";
    if (lines[1] && lines.length >= 3) {
      neighborhood = lines[1];
      detail = lines.slice(2).join("\n");
    } else {
      detail = lines.slice(1).join("\n");
    }
  } else {
    detail = lines.join("\n");
  }
  return { recipient, phone, neighborhood, detail };
}

const EMPTY_FORM = {
  label: "Ev",
  city: "Ankara",
  district: "",
  neighborhood: "",
  detail: "",
  recipient: "",
  phone: "",
  isDefault: true,
};

function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [msg, onDone]);
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

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 12, fontWeight: 600, color: GT, marginBottom: 5 }}>{children}</div>;
}

const INPUT_STYLE: React.CSSProperties = {
  width: "100%", padding: "10px 12px", borderRadius: 12,
  border: `1.5px solid ${GB}`, fontSize: 13, fontFamily: "inherit",
  color: DRK, outline: "none", background: "#fff", boxSizing: "border-box",
};

function AddressCard({
  address, onSetDefault, onEdit, onDelete,
}: {
  address: ApiAddress;
  onSetDefault: (id: number) => void;
  onEdit: (a: ApiAddress) => void;
  onDelete: (id: number) => void;
}) {
  const kind = iconType(address.label);
  const { bg, color, Icon } = ICON_CONFIG[kind];
  const isDefault = !!address.isDefault;

  return (
    <div style={{
      background: "#fff", borderRadius: 16, padding: "14px 14px 10px",
      border: isDefault ? `2px solid ${P}` : `1.5px solid ${GB}`,
      marginBottom: 10,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: bg, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon size={20} color={color} />
          </div>
          <div style={{ paddingTop: 2 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: DRK }}>{address.label}</span>
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

      <div style={{ marginTop: 10, fontSize: 12, color: GT, lineHeight: 1.6 }}>
        <div>{address.address}</div>
        {address.district && <div style={{ marginTop: 2 }}>{address.district}</div>}
      </div>

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

function DeleteModal({
  address, onConfirm, onCancel,
}: { address: ApiAddress; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      zIndex: 999,
    }}>
      <div style={{
        background: "#fff", borderRadius: "20px 20px 0 0", padding: "24px 20px 36px",
        width: "100%", maxWidth: "var(--yp-shell-max)",
      }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: DRK, marginBottom: 10 }}>Adresi Sil</div>
        <div style={{ fontSize: 13, color: GT, lineHeight: 1.6, marginBottom: 20 }}>
          <strong>{address.label}</strong> adresini silmek istediğinize emin misiniz?
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

export default function YPHesabimAdreslerimPage() {
  const [, navigate] = useLocation();
  const { isLoggedIn, isLoading, customer } = useCustomer();
  const formRef = useRef<HTMLDivElement>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [deleteTarget, setDeleteTarget] = useState<ApiAddress | null>(null);
  const [toast, setToast] = useState("");
  const [onboarding, setOnboarding] = useState(false);

  useEffect(() => {
    document.title = "Adreslerim | YourPoodle";
  }, []);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate(`${BASE}/giris?returnTo=${encodeURIComponent("/hesabim/adresler")}`);
    }
  }, [isLoading, isLoggedIn, navigate]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const q = new URLSearchParams(window.location.search);
    if (q.get("yeni") === "1") {
      setOnboarding(true);
      setFormOpen(true);
      setForm({
        ...EMPTY_FORM,
        recipient: customer?.name || "",
        phone: customer?.phone || "",
        isDefault: true,
      });
      setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth" }), 200);
    }
  }, [customer?.name, customer?.phone]);

  const { data: addresses = [], isLoading: addrLoading } = useQuery<ApiAddress[]>({
    queryKey: ["/api/customer/addresses"],
    enabled: !!isLoggedIn,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["/api/customer/addresses"] });

  const createMutation = useMutation({
    mutationFn: async (data: { label: string; address: string; isDefault: boolean; district?: string }) => {
      await apiRequest("POST", "/api/customer/addresses", data);
    },
    onSuccess: () => {
      invalidate();
      showToast("Adres kaydedildi ✓");
      resetForm();
      if (onboarding) {
        setOnboarding(false);
        navigate(`${BASE}/hesabim`);
      }
    },
    onError: (e: any) => showToast(e?.message || "Adres eklenemedi"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      await apiRequest("PATCH", `/api/customer/addresses/${id}`, data);
    },
    onSuccess: () => { invalidate(); showToast("Adres güncellendi ✓"); resetForm(); },
    onError: (e: any) => showToast(e?.message || "Adres güncellenemedi"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/customer/addresses/${id}`);
    },
    onSuccess: () => { invalidate(); showToast("Adres silindi"); setDeleteTarget(null); },
    onError: (e: any) => showToast(e?.message || "Adres silinemedi"),
  });

  const setDefaultMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("PATCH", `/api/customer/addresses/${id}`, { isDefault: true });
    },
    onSuccess: () => invalidate(),
  });

  const showToast = (msg: string) => setToast(msg);

  const resetForm = () => {
    setForm({
      ...EMPTY_FORM,
      recipient: customer?.name || "",
      phone: customer?.phone || "",
      isDefault: addresses.length === 0,
    });
    setEditMode(false);
    setEditingId(null);
    setFormOpen(false);
  };

  const handleEdit = (a: ApiAddress) => {
    const { city, district } = parseDistrictField(a.district);
    const parsed = parseAddressBody(a.address);
    setForm({
      label: a.label || "Ev",
      city: city || "Ankara",
      district,
      neighborhood: parsed.neighborhood,
      detail: parsed.detail || a.address,
      recipient: parsed.recipient || customer?.name || "",
      phone: parsed.phone || customer?.phone || "",
      isDefault: !!a.isDefault,
    });
    setEditingId(a.id);
    setEditMode(true);
    setFormOpen(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const buildAddressPayload = () => {
    const lines = [
      `${form.recipient.trim()} · ${form.phone.trim()}`.trim(),
      form.neighborhood.trim(),
      form.detail.trim(),
    ].filter(Boolean);
    return {
      label: form.label.trim() || "Ev",
      address: lines.join("\n"),
      isDefault: form.isDefault,
      district: formatDistrictField(form.city, form.district) || undefined,
    };
  };

  const handleSave = () => {
    if (!form.label.trim()) { showToast("Adres tipi seçin (Ev / İş / Diğer)"); return; }
    if (!form.city.trim()) { showToast("İl seçin"); return; }
    if (!form.district.trim()) { showToast("İlçe seçin"); return; }
    if (!form.detail.trim() || form.detail.trim().length < 10) {
      showToast("Açık adresi girin (cadde, no, daire)");
      return;
    }
    if (!form.recipient.trim()) { showToast("Teslimat adı soyadı gerekli"); return; }
    if (form.phone.replace(/\D/g, "").length < 10) { showToast("Geçerli telefon girin"); return; }

    const payload = buildAddressPayload();
    if (editMode && editingId != null) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const openAddNew = () => {
    setForm({
      ...EMPTY_FORM,
      recipient: customer?.name || "",
      phone: customer?.phone || "",
      isDefault: addresses.length === 0,
    });
    setEditMode(false);
    setEditingId(null);
    setFormOpen(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  if (isLoading || !isLoggedIn) {
    return (
      <YPLayout activeLink="" constrain={false}>
        <div style={{ padding: 48, textAlign: "center", color: GT, fontSize: 14 }}>Yükleniyor...</div>
      </YPLayout>
    );
  }

  const sorted = [...addresses].sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
  const s = (k: keyof typeof EMPTY_FORM, v: any) => setForm(f => ({ ...f, [k]: v }));
  const districtOptions = districtsOf(form.city);

  return (
    <YPLayout activeLink="" constrain={false}>
      {toast && <Toast msg={toast} onDone={() => setToast("")} />}
      {deleteTarget && (
        <DeleteModal
          address={deleteTarget}
          onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div style={{
        maxWidth: "var(--yp-shell-max)", margin: "0 auto",
        fontFamily: "'Inter',-apple-system,sans-serif",
        color: DRK, background: GBG, minHeight: "100vh", paddingBottom: 30,
      }}>
        <div style={{ background: "#fff", padding: "14px 16px 16px", borderBottom: `1px solid ${GB}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <button onClick={() => goBack(navigate, "/hesabim")} aria-label="Geri"
              style={{ background: "none", border: "none", cursor: "pointer",
                       display: "flex", alignItems: "center", padding: 0, color: GT }}>
              <ArrowLeft size={17} />
            </button>
            <span style={{ fontSize: 12, color: GT }}>Hesabım</span>
            <span style={{ fontSize: 12, color: GT }}>/</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: DRK }}>Adreslerim</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: DRK }}>
              {onboarding ? "Siparişin nereye gelsin?" : "Adreslerim"}
            </h1>
            <span style={{
              fontSize: 11, fontWeight: 700, color: P,
              background: "#EDE5D8", padding: "4px 10px", borderRadius: 999,
            }}>
              {addresses.length} kayıtlı adres
            </span>
          </div>
          <p style={{ fontSize: 13, color: GT, lineHeight: 1.5, marginBottom: 14 }}>
            {onboarding
              ? "Tek sayfada Ev/İş adresini kaydet. Sonra siparişte tek dokunuşla seçilir."
              : "Teslimat adreslerinizi yönetin."}
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

        <div style={{ padding: "12px 12px 0" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: DRK, marginBottom: 8 }}>
            Kayıtlı Adresler
          </div>

          {addrLoading ? (
            <div style={{ textAlign: "center", padding: "32px 0", color: GT }}>Yükleniyor…</div>
          ) : sorted.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "32px 16px", background: "#fff",
              borderRadius: 16, border: `1px solid ${GB}`, marginBottom: 12,
            }}>
              <MapPin size={32} color="#D1D5DB" style={{ margin: "0 auto 10px" }} />
              <div style={{ fontSize: 14, fontWeight: 600, color: DRK }}>Henüz adres eklenmedi</div>
              <div style={{ fontSize: 12, color: GT, marginTop: 4 }}>İlk teslimat adresinizi ekleyin.</div>
            </div>
          ) : (
            sorted.map(a => (
              <AddressCard key={a.id} address={a}
                onSetDefault={(id) => setDefaultMutation.mutate(id)}
                onEdit={handleEdit}
                onDelete={id => setDeleteTarget(addresses.find(x => x.id === id) || null)}
              />
            ))
          )}

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

          <div style={{ marginBottom: 12 }}>
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

            {formOpen && (
              <div ref={formRef} style={{ padding: "0 0 4px" }}>
                <div style={{
                  background: "#fff", borderRadius: 16,
                  border: `1.5px solid ${GB}`, padding: "16px 14px",
                  display: "flex", flexDirection: "column", gap: 14,
                }}>
                  <div>
                    <FieldLabel>Adres tipi</FieldLabel>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {LABEL_CHIPS.map((c) => {
                        const on = form.label === c.value;
                        return (
                          <button
                            key={c.value}
                            type="button"
                            onClick={() => s("label", c.value)}
                            style={{
                              padding: "8px 14px", borderRadius: 999, fontSize: 13, fontWeight: 700,
                              border: `1.5px solid ${on ? P : GB}`,
                              background: on ? P : "#fff", color: on ? "#fff" : DRK,
                              cursor: "pointer", fontFamily: "inherit",
                            }}
                          >
                            {c.value}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div>
                      <FieldLabel>İl</FieldLabel>
                      <select
                        value={form.city}
                        onChange={(e) => setForm((f) => ({ ...f, city: e.target.value, district: "" }))}
                        style={{ ...INPUT_STYLE, appearance: "auto" as const }}
                      >
                        {PROVINCE_NAMES.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <FieldLabel>İlçe</FieldLabel>
                      <select
                        value={form.district}
                        onChange={(e) => s("district", e.target.value)}
                        style={{ ...INPUT_STYLE, appearance: "auto" as const }}
                      >
                        <option value="">İlçe seçin</option>
                        {districtOptions.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <FieldLabel>Mahalle</FieldLabel>
                    <input
                      style={INPUT_STYLE}
                      placeholder="Örn: Çankaya Mah."
                      value={form.neighborhood}
                      onChange={(e) => s("neighborhood", e.target.value)}
                    />
                  </div>

                  <div>
                    <FieldLabel>Açık adres</FieldLabel>
                    <textarea
                      style={{ ...INPUT_STYLE, minHeight: 88, resize: "vertical" as const }}
                      placeholder="Cadde, sokak, bina no, daire..."
                      value={form.detail}
                      onChange={(e) => s("detail", e.target.value)}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div>
                      <FieldLabel>Ad Soyad</FieldLabel>
                      <input
                        style={INPUT_STYLE}
                        placeholder="Teslim alacak kişi"
                        value={form.recipient}
                        onChange={(e) => s("recipient", e.target.value)}
                      />
                    </div>
                    <div>
                      <FieldLabel>Telefon</FieldLabel>
                      <input
                        style={INPUT_STYLE}
                        placeholder="05XX XXX XX XX"
                        value={form.phone}
                        onChange={(e) => s("phone", e.target.value)}
                        inputMode="tel"
                      />
                    </div>
                  </div>

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

                  <button onClick={handleSave}
                    disabled={createMutation.isPending || updateMutation.isPending}
                    style={{
                      width: "100%", padding: "14px 0",
                      background: P, border: "none", borderRadius: 14,
                      fontSize: 15, fontWeight: 700, color: "#fff",
                      cursor: "pointer", fontFamily: "inherit",
                      opacity: createMutation.isPending || updateMutation.isPending ? 0.7 : 1,
                    }}>
                    Adresi Kaydet
                  </button>
                  <button
                    onClick={() => {
                      resetForm();
                      if (onboarding) {
                        setOnboarding(false);
                        navigate(`${BASE}/hesabim`);
                      }
                    }}
                    style={{
                      width: "100%", padding: "12px 0",
                      background: "#fff", border: `1.5px solid ${GB}`,
                      borderRadius: 14, fontSize: 14, fontWeight: 600, color: GT,
                      cursor: "pointer", fontFamily: "inherit",
                    }}>
                    {onboarding ? "Sonra" : "Vazgeç"}
                  </button>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <ShieldCheck size={13} color="#16A34A" />
                    <span style={{ fontSize: 12, color: GT }}>Adres bilgileriniz güvenli şekilde saklanır.</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{
            background: PL, borderRadius: 16, padding: "16px 14px",
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
                onClick={() => navigate("/hesabim/yardim")}
                style={{
                  background: P, color: "#fff", border: "none",
                  borderRadius: 10, padding: "9px 20px",
                  fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                }}>
                Destek Al
              </button>
            </div>
          </div>
        </div>
      </div>
    </YPLayout>
  );
}
