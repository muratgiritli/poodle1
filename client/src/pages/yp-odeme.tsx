import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, CreditCard, Loader2, ArrowRight, Check, X } from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { useCustomer } from "@/contexts/CustomerContext";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { PROVINCE_NAMES, districtsOf } from "@shared/turkeyLocations";

/* ─── Cart types (mirrored from yp-sepet.tsx) ─── */
interface CartItem { id: number; name: string; price: number; img?: string; qty: number; }
const LS_CART = "yp_cart_items";
function loadCart(): CartItem[] {
  try { return JSON.parse(localStorage.getItem(LS_CART) || "[]"); } catch { return []; }
}
function clearYPCart() {
  try { localStorage.setItem(LS_CART, "[]"); } catch {}
}

/* ─── Shipping constants (mirrors yp-sepet.tsx) ─── */
const KARGO_UCRET = 49;
const KARGO_UCRETSIZ_LIMIT = 299;

/* ─── Formatting helper ─── */
function formatPhone(val: string): string {
  const d = val.replace(/\D/g, "");
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
  if (d.length <= 8) return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
  return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 8)} ${d.slice(8, 10)}`;
}

export default function YPOdemePage() {
  const [, navigate] = useLocation();
  const { customer, isLoggedIn, loginWithOtp } = useCustomer();

  /* ─── Cart ─── */
  const [cart] = useState<CartItem[]>(loadCart);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= KARGO_UCRETSIZ_LIMIT ? 0 : KARGO_UCRET;
  const total = subtotal + shipping;
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  /* ─── Form ─── */
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");

  /* Pre-fill when logged in */
  useEffect(() => {
    if (isLoggedIn && customer) {
      setName(customer.name || "");
      setPhone(formatPhone(customer.phone || ""));
      setAddress(customer.address || "");
    }
  }, [isLoggedIn, customer]);

  const districts = useMemo(() => (city ? districtsOf(city) : []), [city]);
  useEffect(() => { setDistrict(""); }, [city]);

  /* ─── OTP modal ─── */
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState(["", "", "", ""]);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const verifyingRef = useRef(false);
  const pendingPayloadRef = useRef<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (otpCountdown <= 0) return;
    const t = setTimeout(() => setOtpCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [otpCountdown]);

  /* ─── Order ─── */
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState("");

  /* ─── Redirect empty cart ─── */
  useEffect(() => {
    if (cart.length === 0) navigate("/yourpoodle/magaza");
  }, []);

  /* ─── Validation ─── */
  const validate = (): string => {
    if (!name.trim()) return "Ad Soyad zorunludur.";
    if (phone.replace(/\D/g, "").length < 10) return "Geçerli bir telefon numarası girin.";
    if (!city) return "İl seçiniz.";
    if (!district) return "İlçe seçiniz.";
    if (!address.trim() || address.trim().length < 10) return "Teslimat adresinizi eksiksiz girin (cadde, sokak, bina no vb.).";
    return "";
  };

  /* ─── Build order payload ─── */
  const buildPayload = (): Record<string, unknown> => ({
    items: cart.map(i => ({
      productId: i.id,
      name: i.name,
      price: i.price,
      quantity: i.qty,
      img: i.img || undefined,
    })),
    subtotal,
    shipping,
    discount: 0,
    grandTotal: total,
    paymentMethod: "Online Kredi/Banka Kartı",
    customerName: name.trim(),
    customerPhone: phone.replace(/\D/g, ""),
    customerAddress: [city, district, address.trim()].filter(Boolean).join(", "),
    city,
    district,
  });

  /* ─── Place order and init payment ─── */
  const placeOrder = async (payload: Record<string, unknown>) => {
    setOrderLoading(true);
    setOrderError("");
    try {
      const res = await apiRequest("POST", "/api/orders", payload);
      const result: any = await res.json();
      if (!result?.id) throw new Error(result?.message || "Sipariş oluşturulamadı.");

      /* Try iyzico then tosla */
      const tryInit = async (endpoint: string) => {
        const r = await apiRequest("POST", endpoint, { orderId: result.id });
        const d = await r.json();
        if (d?.paymentPageUrl) return d.paymentPageUrl;
        throw new Error(d?.message || "Ödeme sayfası açılamadı");
      };

      const providers = ["/api/iyzico/init-payment", "/api/tosla/init-payment"];
      let lastErr: any = null;
      for (const ep of providers) {
        try {
          const url = await tryInit(ep);
          queryClient.invalidateQueries({ queryKey: ["/api/customer/orders"] });
          // Cart is NOT cleared here — it is cleared by payment-result.tsx only
          // after the payment gateway confirms success. If the user cancels or the
          // payment fails they can return and retry with their cart intact.
          window.location.href = url;
          return;
        } catch (e) { lastErr = e; }
      }
      let msg = "Online ödeme başlatılamadı. Lütfen tekrar deneyin.";
      try { const p = JSON.parse(lastErr?.message?.replace(/^\d+:\s*/, "") || "{}"); if (p.message) msg = p.message; } catch {}
      setOrderError(msg);
    } catch (err: any) {
      let msg = "Sipariş kaydedilemedi.";
      try { const p = JSON.parse(err?.message?.replace(/^\d+:\s*/, "") || "{}"); if (p.message) msg = p.message; } catch {}
      setOrderError(msg);
    } finally {
      setOrderLoading(false);
    }
  };

  /* ─── Guest OTP send ─── */
  const sendOtp = async (normalized: string) => {
    setOtpLoading(true);
    setOtpError("");
    try {
      let deviceToken: string | undefined;
      try { const tokens = JSON.parse(localStorage.getItem("jetgo_trusted_devices") || "{}"); deviceToken = tokens[normalized]; } catch {}
      const res = await apiRequest("POST", "/api/otp/send", { phone: normalized, deviceToken });
      const data = await res.json();
      /* Trusted device → skip OTP, place order directly */
      if (data.trustedLogin && data.customer) {
        const payload = pendingPayloadRef.current;
        pendingPayloadRef.current = null;
        if (payload) await placeOrder(payload);
        return;
      }
      setOtpCountdown(180);
      setOtpCode(["", "", "", ""]);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err: any) {
      let msg = "SMS gönderilemedi.";
      try { const p = JSON.parse(err?.message?.replace(/^\d+:\s*/, "") || "{}"); if (p.message) msg = p.message; } catch {}
      setOtpError(msg);
    } finally {
      setOtpLoading(false);
    }
  };

  /* ─── Guest OTP verify ─── */
  const doVerify = async (code: string) => {
    if (code.length !== 4) { verifyingRef.current = false; return; }
    setOtpLoading(true);
    setOtpError("");
    const normalized = phone.replace(/\D/g, "");
    try {
      await loginWithOtp(normalized, code, name.trim(), undefined);
      setShowOtp(false);
      const payload = pendingPayloadRef.current;
      pendingPayloadRef.current = null;
      if (payload) await placeOrder(payload);
    } catch (err: any) {
      let msg = "Doğrulama kodu hatalı.";
      try { const p = JSON.parse(err?.message?.replace(/^\d+:\s*/, "") || "{}"); if (p.message) msg = p.message; } catch {}
      setOtpError(msg);
    } finally {
      setOtpLoading(false);
      verifyingRef.current = false;
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otpCode];
    if (value.length > 1) {
      const digits = value.replace(/\D/g, "").split("");
      for (let i = 0; i < 4; i++) next[i] = digits[i] || "";
      setOtpCode(next);
      otpRefs.current[Math.min(digits.length - 1, 3)]?.focus();
      if (next.every(d => d !== "") && !verifyingRef.current) {
        verifyingRef.current = true;
        setTimeout(() => doVerify(next.join("")), 150);
      }
      return;
    }
    next[index] = value;
    setOtpCode(next);
    if (value && index < 3) otpRefs.current[index + 1]?.focus();
    if (next.every(d => d !== "") && !verifyingRef.current) {
      verifyingRef.current = true;
      setTimeout(() => doVerify(next.join("")), 150);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) otpRefs.current[index - 1]?.focus();
  };

  /* ─── Submit handler ─── */
  const handleSubmit = async () => {
    const err = validate();
    if (err) { setOrderError(err); return; }
    const payload = buildPayload();
    if (isLoggedIn) {
      await placeOrder(payload);
      return;
    }
    /* Guest: send OTP */
    pendingPayloadRef.current = payload;
    setOtpCode(["", "", "", ""]);
    setOtpError("");
    verifyingRef.current = false;
    setShowOtp(true);
    await sendOtp(phone.replace(/\D/g, ""));
  };

  if (cart.length === 0) return null;

  const purple = "#7C3AFF";
  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 12px", borderRadius: 10,
    border: "1.5px solid #e5e7eb", fontSize: 14, fontFamily: "inherit",
    outline: "none", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 4, display: "block" };
  const selectStyle: React.CSSProperties = { ...inputStyle, background: "#fff", appearance: "none", WebkitAppearance: "none" };

  return (
    <YPLayout activeLink="/yourpoodle/magaza">
      <div style={{ background: "#fff", minHeight: "100vh", paddingBottom: 100 }}>
        {/* Header */}
        <div style={{ background: "#fff", padding: "12px 16px", borderBottom: "1px solid #f0f0f0", position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => navigate("/yourpoodle/sepet")}
            style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: purple, fontSize: 13, fontWeight: 700, padding: 0 }}>
            <ChevronLeft size={16} /> Sepet
          </button>
          <h1 style={{ flex: 1, textAlign: "center", fontSize: 16, fontWeight: 800, color: "#1a1a1a", margin: 0 }}>
            Ödeme
          </h1>
          <div style={{ width: 60 }} />
        </div>

        <div style={{ maxWidth: 640, margin: "0 auto", padding: "16px 16px 24px" }}>

          {/* Payment badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F5F0FF", borderRadius: 12, padding: "10px 14px", marginBottom: 20 }}>
            <CreditCard size={18} color={purple} />
            <span style={{ fontSize: 13, fontWeight: 700, color: purple }}>Güvenli Online Kart Ödemesi</span>
            <span style={{ marginLeft: "auto", fontSize: 11, color: "#888" }}>SSL şifreli</span>
          </div>

          {/* Delivery info form */}
          <div style={{ background: "#F9FAFB", borderRadius: 16, padding: "18px 16px", marginBottom: 16 }}>
            <h2 style={{ fontSize: 14, fontWeight: 800, color: "#1a1a1a", margin: "0 0 16px" }}>Teslimat Bilgileri</h2>

            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>Ad Soyad *</label>
              <input style={inputStyle} placeholder="Ad Soyad" value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>Telefon *</label>
              <input
                style={inputStyle}
                placeholder="5XX XXX XX XX"
                inputMode="numeric"
                value={phone}
                onChange={e => {
                  const d = e.target.value.replace(/\D/g, "");
                  if (d.length <= 11) setPhone(formatPhone(d));
                }}
              />
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>İl *</label>
                <div style={{ position: "relative" }}>
                  <select style={selectStyle} value={city} onChange={e => setCity(e.target.value)}>
                    <option value="">İl seçin</option>
                    {PROVINCE_NAMES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#888", fontSize: 10 }}>▼</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>İlçe *</label>
                <div style={{ position: "relative" }}>
                  <select style={selectStyle} value={district} onChange={e => setDistrict(e.target.value)} disabled={!city}>
                    <option value="">İlçe seçin</option>
                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#888", fontSize: 10 }}>▼</span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 4 }}>
              <label style={labelStyle}>Adres *</label>
              <textarea
                style={{ ...inputStyle, minHeight: 72, resize: "vertical" } as React.CSSProperties}
                placeholder="Mahalle, cadde, sokak, bina no, daire no…"
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            </div>
          </div>

          {/* Order summary */}
          <div style={{ background: "#F9FAFB", borderRadius: 16, padding: "16px 18px", marginBottom: 16 }}>
            <h2 style={{ fontSize: 14, fontWeight: 800, color: "#1a1a1a", margin: "0 0 14px" }}>Sipariş Özeti ({cartCount} ürün)</h2>
            {cart.map(item => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#444", marginBottom: 8 }}>
                <span style={{ flex: 1, marginRight: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {item.name} <span style={{ color: "#888" }}>×{item.qty}</span>
                </span>
                <span style={{ fontWeight: 700, flexShrink: 0 }}>₺{(item.price * item.qty).toLocaleString("tr-TR")}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 10, marginTop: 4 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#555", marginBottom: 6 }}>
                <span>Kargo</span>
                <span style={{ fontWeight: shipping === 0 ? 700 : undefined, color: shipping === 0 ? "#16A34A" : undefined }}>
                  {shipping === 0 ? "Ücretsiz" : `₺${shipping}`}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 17, fontWeight: 900, color: "#1a1a1a" }}>
                <span>Toplam</span>
                <span style={{ color: purple }}>₺{total.toLocaleString("tr-TR")}</span>
              </div>
            </div>
          </div>

          {orderError && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#B91C1C", marginBottom: 14 }}>
              {orderError}
            </div>
          )}

          {/* Place order button */}
          <button
            onClick={handleSubmit}
            disabled={orderLoading}
            style={{
              width: "100%", height: 52, borderRadius: 14, border: "none",
              background: orderLoading ? "#ccc" : `linear-gradient(135deg,${purple},#A855F7)`,
              color: "#fff", fontSize: 15, fontWeight: 800, cursor: orderLoading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit",
            }}
          >
            {orderLoading ? (
              <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> İşleniyor...</>
            ) : (
              <>Ödemeye Geç <ArrowRight size={16} /></>
            )}
          </button>

          <p style={{ textAlign: "center", fontSize: 11, color: "#aaa", marginTop: 10 }}>
            Siparişi tamamlayarak <a href="/yourpoodle/kullanim-sartlari" style={{ color: purple }}>Kullanım Şartları</a>'nı kabul etmiş olursunuz.
          </p>
        </div>

        {/* OTP modal */}
        {showOtp && (
          <div style={{ position: "fixed", inset: 0, zIndex: 10000, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} onClick={() => setShowOtp(false)} />
            <div style={{ position: "relative", width: "100%", maxWidth: 480, background: `linear-gradient(160deg,${purple},#A855F7)`, borderRadius: "20px 20px 0 0", padding: "24px 20px 36px", color: "#fff" }}>
              <button
                onClick={() => setShowOtp(false)}
                style={{ position: "absolute", top: 14, right: 14, background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 20, width: 28, height: 28, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <X size={16} />
              </button>
              <h3 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 800 }}>SMS Doğrulama</h3>
              <p style={{ margin: "0 0 20px", fontSize: 13, opacity: 0.85 }}>
                <strong>{phone}</strong> numarasına 4 haneli kod gönderdik.
              </p>

              {/* OTP inputs */}
              <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 16 }}>
                {otpCode.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    style={{
                      width: 56, height: 60, borderRadius: 12, border: "2px solid rgba(255,255,255,0.4)",
                      background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: 24, fontWeight: 800,
                      textAlign: "center", fontFamily: "inherit", outline: "none",
                    }}
                  />
                ))}
              </div>

              {otpError && (
                <p style={{ textAlign: "center", fontSize: 13, color: "#FCA5A5", marginBottom: 10 }}>{otpError}</p>
              )}

              <button
                onClick={() => { verifyingRef.current = true; doVerify(otpCode.join("")); }}
                disabled={otpLoading || otpCode.some(d => !d)}
                style={{
                  width: "100%", height: 48, borderRadius: 12, border: "none",
                  background: otpLoading ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.95)",
                  color: purple, fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                {otpLoading ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : <><Check size={16} /> Doğrula ve Siparişi Tamamla</>}
              </button>

              <div style={{ textAlign: "center", marginTop: 14 }}>
                {otpCountdown > 0 ? (
                  <span style={{ fontSize: 13, opacity: 0.7 }}>Tekrar gönder ({otpCountdown}s)</span>
                ) : (
                  <button
                    onClick={() => sendOtp(phone.replace(/\D/g, ""))}
                    style={{ background: "none", border: "none", color: "rgba(255,255,255,0.85)", fontSize: 13, cursor: "pointer", textDecoration: "underline", fontFamily: "inherit" }}
                  >
                    Kodu tekrar gönder
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </YPLayout>
  );
}
