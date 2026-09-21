import { useState, useEffect, useMemo, useRef } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, CreditCard, Loader2, ArrowRight, X, AlertTriangle, PackageX, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { useCustomer } from "@/contexts/CustomerContext";
import { useCart } from "@/contexts/CartContext";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { PROVINCE_NAMES, districtsOf } from "@shared/turkeyLocations";
import { goBack } from "@/lib/goBack";
import { IS_YP } from "@/lib/store";
import { loadCheckoutDraft, clearCheckoutDraft } from "@/lib/checkout-draft";
import { resolveYpShipping, type DeliveryNeighborhood } from "@/lib/yp-shipping";
import { getAttributionPayload } from "@/lib/yp-analytics";

const BASE = IS_YP ? "" : "/yourpoodle";

/* ─── Cart line for checkout ─── */
interface CartItem { id: number; name: string; price: number; img?: string; qty: number; }

/* ─── Formatting helper ─── */
function formatPhone(val: string): string {
  const d = val.replace(/\D/g, "");
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
  if (d.length <= 8) return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
  return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 8)} ${d.slice(8, 10)}`;
}

function stripAddressHeader(raw: string): string {
  return String(raw || "").replace(/^[^\n]*·[^\n]*\n?/, "").trim() || String(raw || "").trim();
}

function fmtShipHint(freeLimit: number, fee: number): string {
  return `${freeLimit.toLocaleString("tr-TR")} TL üzeri ücretsiz kargo · altı ${fee.toLocaleString("tr-TR")} TL`;
}

/* ─── Stock status for a single product ─── */
interface LiveProductInfo {
  name: string;
  price: number;
  stock: number;
  isActive: boolean;
}

export default function YPOdemePage() {
  const [, navigate] = useLocation();
  const { customer, isLoggedIn } = useCustomer();
  const { selectedProducts, clearCart, updateQty, basket } = useCart();

  /* Build cart lines from shared CartContext */
  const cartFromCtx: CartItem[] = useMemo(() =>
    selectedProducts.map(({ product, qty }) => ({
      id: Number(product.id),
      name: product.name,
      price: product.price,
      img: product.img || undefined,
      qty,
    })).filter(i => Number.isFinite(i.id) && i.qty > 0),
  [selectedProducts]);

  /* Local override for price updates / removals during stock check */
  const [cartOverride, setCartOverride] = useState<CartItem[] | null>(null);
  const cart = cartOverride ?? cartFromCtx;

  useEffect(() => {
    // Reset override when context cart changes (e.g. user navigates back)
    setCartOverride(null);
  }, [basket]);

  /* ─── Stock validation ─── */
  const [liveInfo, setLiveInfo] = useState<Record<number, LiveProductInfo>>({});
  const [stockLoading, setStockLoading] = useState(false);
  const [stockChecked, setStockChecked] = useState(false);
  const [stockError, setStockError] = useState("");

  /* ─── Form ─── */
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [addrLabel, setAddrLabel] = useState("Ev");
  const [saveAddress, setSaveAddress] = useState(true);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);

  /* ─── Coupon — validated discount (also prefilled from sepet draft) ─── */
  const [couponCode, setCouponCode]       = useState("");
  const [couponApplied, setCouponApplied] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponFreeShipping, setCouponFreeShipping] = useState(false);
  const [couponError, setCouponError]     = useState("");
  const [couponHint, setCouponHint]       = useState("");

  const { data: deliveryNeighborhoods = [] } = useQuery<DeliveryNeighborhood[]>({
    queryKey: ["/api/delivery-neighborhoods"],
    staleTime: 60_000,
  });
  const { data: publicSettings } = useQuery<Record<string, string>>({
    queryKey: ["/api/public-settings"],
    staleTime: 60_000,
  });

  /* Prefill from sepet checkout draft, then customer profile */
  useEffect(() => {
    const draft = loadCheckoutDraft();
    if (draft) {
      if (draft.addressText) setAddress(stripAddressHeader(draft.addressText));
      if (draft.city) setCity(draft.city);
      if (draft.district) {
        // may be "İlçe · İl" from saved addresses
        const raw = String(draft.district);
        if (raw.includes("·")) {
          const [d, c] = raw.split("·").map((x) => x.trim());
          setDistrict(d || "");
          if (c) setCity((prev) => prev || c);
        } else {
          setDistrict(raw);
        }
      }
      if (draft.couponCode) {
        setCouponApplied(draft.couponCode);
        setCouponDiscount(Number(draft.couponDiscount) || 0);
        setCouponFreeShipping(!!draft.couponFreeShipping);
        setCouponHint(draft.couponLabel || "Sepetten aktarıldı");
      }
    }
  }, []);

  const applySavedAddress = (a: any) => {
    setAddrLabel(a.label || "Ev");
    setAddress(String(a.address || "").replace(/^[^\n]*·[^\n]*\n?/, "").trim() || String(a.address || ""));
    const raw = String(a.district || "");
    if (raw.includes("·")) {
      const [d, c] = raw.split("·").map((x: string) => x.trim());
      setDistrict(d || "");
      if (c) setCity(c);
    } else if (raw.includes(",")) {
      const [d, c] = raw.split(",").map((x: string) => x.trim());
      setDistrict(d || "");
      if (c) setCity(c);
    } else {
      setDistrict(raw);
    }
  };

  /* Load saved addresses for quick pick; auto-fill only if form still empty */
  useEffect(() => {
    if (!isLoggedIn) return;
    fetch("/api/customer/addresses", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => {
        if (!Array.isArray(list)) return;
        setSavedAddresses(list);
        const def = list.find((a: any) => a.isDefault) || list[0];
        if (!def) return;
        setAddress((cur) => {
          if (cur.trim()) return cur;
          // Fill related fields once we know form address is empty
          setAddrLabel(def.label || "Ev");
          const raw = String(def.district || "");
          if (raw.includes("·")) {
            const [d, c] = raw.split("·").map((x: string) => x.trim());
            setDistrict(d || "");
            if (c) setCity(c);
          } else if (raw.includes(",")) {
            const [d, c] = raw.split(",").map((x: string) => x.trim());
            setDistrict(d || "");
            if (c) setCity(c);
          } else if (raw) {
            setDistrict(raw);
          }
          return String(def.address || "").replace(/^[^\n]*·[^\n]*\n?/, "").trim() || String(def.address || "");
        });
      })
      .catch(() => {});
  }, [isLoggedIn]);

  /* Pre-fill when logged in (don't overwrite draft address if set) */
  useEffect(() => {
    if (isLoggedIn && customer) {
      setName((n) => n || customer.name || "");
      setPhone((p) => p || formatPhone(customer.phone || ""));
      setAddress((a) => a || stripAddressHeader(customer.address || ""));
      if ((customer as any).city) setCity((c) => c || (customer as any).city);
      if ((customer as any).district) setDistrict((d) => d || (customer as any).district);
    }
  }, [isLoggedIn, customer]);

  const districts = useMemo(() => (city ? districtsOf(city) : []), [city]);
  const [cityTouched, setCityTouched] = useState(false);
  useEffect(() => {
    if (cityTouched) setDistrict("");
  }, [city, cityTouched]);

  /* Compute totals — must come after couponDiscount is declared */
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const addressBlob = useMemo(
    () => [address, district, city].filter(Boolean).join(", "),
    [address, district, city],
  );
  const shipInfo = useMemo(
    () => resolveYpShipping(subtotal, addressBlob, deliveryNeighborhoods),
    [subtotal, addressBlob, deliveryNeighborhoods],
  );
  const shipping = couponFreeShipping ? 0 : shipInfo.shipping;
  const total = Math.max(0, subtotal - couponDiscount + shipping);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const beginCheckoutFired = useRef(false);

  useEffect(() => {
    if (beginCheckoutFired.current || cartCount === 0) return;
    beginCheckoutFired.current = true;
    import("@/lib/yp-analytics").then((yp) => {
      yp.trackBeginCheckout(total, cartCount);
    }).catch(() => {});
  }, [cartCount, total]);

  const applyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    setCouponError("");
    setCouponHint("");
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setCouponApplied(code);
        setCouponDiscount(Number(data.discountAmount) || 0);
        setCouponFreeShipping(!!data.freeShipping || data.discountType === "free_shipping");
        setCouponCode("");
        setCouponHint(data.message || "Kupon uygulandı");
      } else {
        setCouponError(data.message || "Geçersiz kupon");
        setCouponApplied("");
        setCouponDiscount(0);
        setCouponFreeShipping(false);
      }
    } catch {
      setCouponError("Kupon doğrulanamadı");
    }
  };

  const removeCoupon = () => {
    setCouponApplied("");
    setCouponDiscount(0);
    setCouponFreeShipping(false);
    setCouponError("");
    setCouponHint("");
  };

  /* ─── Order ─── */
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState("");

  /* ─── Redirect empty cart ─── */
  useEffect(() => {
    if (cartFromCtx.length === 0 && !cartOverride?.length) {
      navigate(`${BASE}/magaza`);
    }
  }, [cartFromCtx.length]);

  /* ─── Validate cart against live product data on mount ─── */
  const validateCart = async (currentCart: CartItem[]) => {
    if (currentCart.length === 0) return;
    setStockLoading(true);
    setStockError("");
    try {
      const ids = currentCart.map(i => i.id);
      const res = await apiRequest("POST", "/api/yp-cart/validate", { ids });
      if (!res.ok) throw new Error("Ürün bilgileri alınamadı.");
      const data: Record<string, LiveProductInfo> = await res.json();
      setLiveInfo(data);

      setCartOverride(prev => {
        const base = prev ?? currentCart;
        return base.map(item => {
          const live = data[item.id];
          if (live && live.isActive && live.price !== item.price) {
            return { ...item, price: live.price };
          }
          return item;
        });
      });
    } catch {
      setStockError("Stok kontrolü yapılamadı. Devam edebilirsiniz ancak bazı ürünler güncel olmayabilir.");
    } finally {
      setStockLoading(false);
      setStockChecked(true);
    }
  };

  useEffect(() => {
    if (cartFromCtx.length > 0) validateCart(cartFromCtx);
  }, []);

  /* ─── Derived: per-item issues ─── */
  interface ItemIssue { kind: "inactive" | "outofstock" | "pricechange"; oldPrice?: number; newPrice?: number; }
  const itemIssues = useMemo((): Record<number, ItemIssue> => {
    if (!stockChecked) return {};
    const issues: Record<number, ItemIssue> = {};
    for (const item of cart) {
      const live = liveInfo[item.id];
      if (!live) continue; // product not found → don't block (server will catch it)
      if (!live.isActive) { issues[item.id] = { kind: "inactive" }; continue; }
      if ((live.stock ?? 0) <= 0) { issues[item.id] = { kind: "outofstock" }; continue; }
      /* qty exceeds stock */
      if (item.qty > live.stock) { issues[item.id] = { kind: "outofstock" }; continue; }
    }
    return issues;
  }, [cart, liveInfo, stockChecked]);

  const hasBlockingIssues = Object.keys(itemIssues).length > 0;

  /* Remove a problematic item from cart */
  const removeItem = (id: number) => {
    const cur = basket[String(id)] || 0;
    if (cur > 0) updateQty(String(id), -cur);
    setCartOverride(prev => {
      const base = prev ?? cart;
      return base.filter(i => i.id !== id);
    });
  };

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
  const buildPayload = (): Record<string, unknown> => {
    let analytics: { visitorId: string; sessionId: string } | undefined;
    try {
      analytics = getAttributionPayload();
    } catch { /* ignore */ }
    return {
      items: cart.map(i => ({
        productId: i.id,
        name: i.name,
        price: i.price,
        quantity: i.qty,
        img: i.img || undefined,
      })),
      subtotal,
      shipping,
      discount: couponDiscount,
      grandTotal: total,
      ...(couponApplied ? { couponCode: couponApplied } : {}),
      paymentMethod: "Online Kredi/Banka Kartı",
      customerName: name.trim(),
      customerPhone: phone.replace(/\D/g, ""),
      customerAddress: [city, district, address.trim()].filter(Boolean).join(", "),
      city,
      district,
      ...(analytics ? { analytics } : {}),
    };
  };

  /* ─── Place order and init payment ─── */
  const placeOrder = async (payload: Record<string, unknown>) => {
    setOrderLoading(true);
    setOrderError("");
    try {
      /* Optionally save address for next orders */
      if (isLoggedIn && saveAddress && address.trim().length >= 10 && city && district) {
        try {
          await apiRequest("POST", "/api/customer/addresses", {
            label: addrLabel || "Ev",
            address: `${name.trim()} · ${phone.replace(/\D/g, "")}\n${address.trim()}`,
            district: `${district} · ${city}`,
            isDefault: true,
          });
        } catch { /* non-blocking */ }
      }

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

      /* Enabled gateways only (avoid cancel+retry on disabled iyzico) */
      const isOn = (v: string | undefined) => v !== "0" && v !== "false";
      const providers: string[] = [];
      if (isOn(publicSettings?.payment_iyzico_enabled)) providers.push("/api/iyzico/init-payment");
      if (isOn(publicSettings?.payment_tosla_enabled)) providers.push("/api/tosla/init-payment");
      if (providers.length === 0) {
        providers.push("/api/iyzico/init-payment", "/api/tosla/init-payment");
      }
      let lastErr: any = null;
      for (const ep of providers) {
        try {
          const url = await tryInit(ep);
          queryClient.invalidateQueries({ queryKey: ["/api/customer/orders"] });
          clearCheckoutDraft();
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

      // Stok yetersizliği → validateCart çağırarak per-item sorun panelini göster,
      // genel hata mesajını temizle (panel zaten Kaldır butonuyla yol gösteriyor).
      if (/stok yetersiz/i.test(msg)) {
        setOrderError(""); // hata kutusu yerine per-item panel devreye giriyor
        validateCart(cart); // stok bilgisini yenile → itemIssues dolacak → panel açılacak
      } else {
        setOrderError(msg);
      }
    } finally {
      setOrderLoading(false);
    }
  };

  /* ─── Submit handler ─── */
  const handleSubmit = async () => {
    if (hasBlockingIssues) return;
    const err = validate();
    if (err) { setOrderError(err); return; }
    await placeOrder(buildPayload());
  };

  if (cart.length === 0) return null;

  const brand = "#5D3A1A";

  /* ─── Login gate: kullanıcı giriş yapmamışsa önce giriş/kayıt ekranı ─── */
  if (!isLoggedIn) {
    return (
      <YPLayout activeLink="/yourpoodle/magaza">
        <div style={{ background: "#fff", minHeight: "100vh" }}>
          {/* Header */}
          <div style={{ background: "#fff", padding: "12px 16px", borderBottom: "1px solid #f0f0f0", position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => goBack(navigate, "/yourpoodle/sepet")}
              style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: brand, fontSize: 13, fontWeight: 700, padding: 0 }}>
              <ChevronLeft size={16} /> Sepet
            </button>
            <h1 style={{ flex: 1, textAlign: "center", fontSize: 16, fontWeight: 800, color: "#1a1a1a", margin: 0 }}>Ödeme</h1>
            <div style={{ width: 60 }} />
          </div>

          {/* Gate content */}
          <div style={{ maxWidth: "var(--yp-read-max)", margin: "0 auto", padding: "48px 24px 40px", textAlign: "center" }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🔒</div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: "#1a1a1a", margin: "0 0 10px" }}>
              Siparişi tamamlamak için giriş yapın
            </h2>
            <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 32px", lineHeight: 1.6 }}>
              Teslimat bilgilerinizi girebilmek ve siparişinizi takip edebilmek için hesabınıza giriş yapın ya da üye olun.
            </p>

            <button
              onClick={() => navigate("/yourpoodle/giris?returnTo=/yourpoodle/odeme")}
              style={{
                width: "100%", height: 52, borderRadius: 14, border: "none",
                background: `linear-gradient(135deg,${brand},#A67C52)`,
                color: "#fff", fontSize: 16, fontWeight: 800,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                gap: 8, fontFamily: "inherit", marginBottom: 12,
              }}>
              Giriş Yap
            </button>

            <button
              onClick={() => navigate("/yourpoodle/giris?tab=register&returnTo=/yourpoodle/odeme")}
              style={{
                width: "100%", height: 52, borderRadius: 14,
                border: `2px solid ${brand}`,
                background: "#fff", color: brand,
                fontSize: 16, fontWeight: 800,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                gap: 8, fontFamily: "inherit",
              }}>
              Üye Ol
            </button>

            <p style={{ fontSize: 12, color: "#aaa", marginTop: 24 }}>
              Sepetiniz kaybolmaz, giriş yaptıktan sonra siparişinize devam edebilirsiniz.
            </p>
          </div>
        </div>
      </YPLayout>
    );
  }
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
          <button onClick={() => goBack(navigate, "/yourpoodle/sepet")}
            style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: brand, fontSize: 13, fontWeight: 700, padding: 0 }}>
            <ChevronLeft size={16} /> Sepet
          </button>
          <h1 style={{ flex: 1, textAlign: "center", fontSize: 16, fontWeight: 800, color: "#1a1a1a", margin: 0 }}>
            Ödeme
          </h1>
          <div style={{ width: 60 }} />
        </div>

        <div style={{ maxWidth: 640, margin: "0 auto", padding: "16px 16px 24px" }}>

          {/* Payment badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F5F0E6", borderRadius: 12, padding: "10px 14px", marginBottom: 20 }}>
            <CreditCard size={18} color={brand} />
            <span style={{ fontSize: 13, fontWeight: 700, color: brand }}>Güvenli Online Kart Ödemesi</span>
            <span style={{ marginLeft: "auto", fontSize: 11, color: "#888" }}>SSL şifreli</span>
          </div>

          {/* Stock checking indicator */}
          {stockLoading && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F5F0E6", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: brand }}>
              <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />
              Sepetinizdeki ürünlerin güncel stoku kontrol ediliyor…
            </div>
          )}

          {/* Stock check error (non-blocking) */}
          {stockError && !stockLoading && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#FFFBEB", border: "1px solid #FCD34D", borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
              <AlertTriangle size={15} color="#D97706" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: "#92400E" }}>{stockError}</span>
            </div>
          )}

          {/* Blocking issues: out-of-stock / deactivated items */}
          {stockChecked && hasBlockingIssues && (
            <div style={{ background: "#FEF2F2", border: "1.5px solid #FCA5A5", borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <PackageX size={17} color="#DC2626" />
                <span style={{ fontSize: 13, fontWeight: 800, color: "#DC2626" }}>
                  Sepetinizde sorunlu ürün var
                </span>
              </div>
              <p style={{ fontSize: 12.5, color: "#7F1D1D", margin: "0 0 12px", lineHeight: 1.5 }}>
                Aşağıdaki ürünler stokta kalmadı veya satıştan kaldırıldı. Ödemeye geçebilmek için lütfen sepetinizden kaldırın.
              </p>
              {Object.entries(itemIssues).map(([idStr, issue]) => {
                const id = Number(idStr);
                const item = cart.find(i => i.id === id);
                if (!item) return null;
                return (
                  <div key={id} style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", borderRadius: 10, padding: "10px 12px", marginBottom: 6, border: "1px solid #FCA5A5" }}>
                    {item.img && (
                      <img src={item.img} alt={item.name} style={{ width: 36, height: 36, objectFit: "contain", borderRadius: 6, flexShrink: 0 }} />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: "#1a1a1a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
                      <div style={{ fontSize: 11.5, color: "#DC2626", marginTop: 2 }}>
                        {issue.kind === "inactive" ? "Bu ürün artık satışta değil" : "Stokta yok"}
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(id)}
                      style={{ display: "flex", alignItems: "center", gap: 4, background: "#DC2626", border: "none", borderRadius: 8, padding: "6px 10px", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}
                    >
                      <X size={12} /> Kaldır
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Delivery info form — adres burada zorunlu */}
          <div style={{ background: "#F9FAFB", borderRadius: 16, padding: "18px 16px", marginBottom: 16, border: "1.5px solid #E8E0D4" }}>
            <h2 style={{ fontSize: 14, fontWeight: 800, color: "#1a1a1a", margin: "0 0 4px" }}>Teslimat Adresi</h2>
            <p style={{ fontSize: 12, color: "#6B7280", margin: "0 0 14px", lineHeight: 1.4 }}>
              Sipariş vermek için teslimat adresini gir. Sonraki siparişlerde kayıtlı kalır.
            </p>

            {savedAddresses.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", marginBottom: 8, letterSpacing: 0.3 }}>KAYITLI ADRESLER</div>
                <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                  {savedAddresses.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => applySavedAddress(a)}
                      style={{
                        flexShrink: 0, maxWidth: 200, textAlign: "left",
                        padding: "10px 12px", borderRadius: 12, cursor: "pointer", fontFamily: "inherit",
                        border: `1.5px solid ${brand}`, background: "#fff",
                      }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 800, color: brand }}>{a.label || "Adres"}</div>
                      <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {a.district || a.address}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>Adres tipi</label>
              <div style={{ display: "flex", gap: 8 }}>
                {["Ev", "İş", "Diğer"].map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setAddrLabel(l)}
                    style={{
                      padding: "7px 14px", borderRadius: 999, fontSize: 12, fontWeight: 700,
                      border: `1.5px solid ${addrLabel === l ? brand : "#E5E7EB"}`,
                      background: addrLabel === l ? brand : "#fff",
                      color: addrLabel === l ? "#fff" : "#374151",
                      cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

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
                  <select style={selectStyle} value={city} onChange={e => { setCityTouched(true); setCity(e.target.value); setDistrict(""); }}>
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

            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>Açık adres *</label>
              <textarea
                style={{ ...inputStyle, minHeight: 72, resize: "vertical" } as React.CSSProperties}
                placeholder="Mahalle, cadde, sokak, bina no, daire no…"
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            </div>

            {isLoggedIn && (
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={saveAddress}
                  onChange={(e) => setSaveAddress(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: brand }}
                />
                <span style={{ fontSize: 12.5, color: "#374151", fontWeight: 600 }}>
                  Bu adresi hesabıma kaydet (sonraki siparişler için)
                </span>
              </label>
            )}
          </div>

          {/* Order summary */}
          <div style={{ background: "#F9FAFB", borderRadius: 16, padding: "16px 18px", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <h2 style={{ fontSize: 14, fontWeight: 800, color: "#1a1a1a", margin: 0 }}>Sipariş Özeti ({cartCount} ürün)</h2>
              {stockChecked && !stockLoading && (
                <button
                  onClick={() => validateCart(cart)}
                  style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: brand, fontSize: 11, fontWeight: 700, padding: 0 }}
                  title="Stoku yenile"
                >
                  <RefreshCw size={12} /> Stoku yenile
                </button>
              )}
            </div>
            {cart.map(item => {
              const issue = itemIssues[item.id];
              const hasIssue = !!issue;
              return (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: hasIssue ? "#B91C1C" : "#444", marginBottom: 8, opacity: hasIssue ? 0.7 : 1 }}>
                  <span style={{ flex: 1, marginRight: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.name} <span style={{ color: "#888" }}>×{item.qty}</span>
                    {hasIssue && <span style={{ marginLeft: 6, fontSize: 11, color: "#DC2626", fontWeight: 700 }}>
                      {issue.kind === "inactive" ? "(satışta değil)" : "(stok yok)"}
                    </span>}
                  </span>
                  <span style={{ fontWeight: 700, flexShrink: 0, textDecoration: hasIssue ? "line-through" : undefined }}>
                    ₺{(item.price * item.qty).toLocaleString("tr-TR")}
                  </span>
                </div>
              );
            })}
            <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 10, marginTop: 4 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#555", marginBottom: 6 }}>
                <span>Kargo{shipInfo.matched ? ` · ${shipInfo.matched.name}` : ""}</span>
                <span style={{ fontWeight: shipping === 0 ? 700 : undefined, color: shipping === 0 ? "#16A34A" : undefined }}>
                  {shipping === 0 ? "Ücretsiz" : `₺${shipping.toLocaleString("tr-TR")}`}
                </span>
              </div>
              {couponDiscount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#16A34A", fontWeight: 700, marginBottom: 6 }}>
                  <span>Kupon İndirimi</span>
                  <span>-₺{couponDiscount.toLocaleString("tr-TR")}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 17, fontWeight: 900, color: "#1a1a1a" }}>
                <span>Toplam</span>
                <span style={{ color: brand }}>₺{total.toLocaleString("tr-TR")}</span>
              </div>
              {shipping > 0 && (
                <p style={{ fontSize: 11, color: "#9CA3AF", margin: "8px 0 0" }}>
                  {fmtShipHint(shipInfo.freeLimit, shipInfo.fee)}
                </p>
              )}
            </div>
          </div>

          {/* Kupon kodu */}
          <div style={{ background: "#F9FAFB", borderRadius: 16, padding: "14px 16px", marginBottom: 16, border: "1px solid #E5E7EB" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 10 }}>🎟️ Kupon Kodu</div>
            {couponApplied ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#ECFDF5", border: "1.5px solid #6EE7B7", borderRadius: 10, padding: "10px 14px" }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#065F46" }}>{couponApplied}</span>
                  <span style={{ fontSize: 12, color: "#6B7280", marginLeft: 8 }}>siparişte kontrol edilecek</span>
                  {couponHint && <span style={{ fontSize: 11, color: "#9CA3AF", display: "block", marginTop: 4 }}>{couponHint}</span>}
                </div>
                <button onClick={removeCoupon}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#DC2626", fontSize: 12, fontWeight: 700, padding: 0 }}>
                  Kaldır
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={couponCode}
                  onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); }}
                  onKeyDown={e => e.key === "Enter" && applyCoupon()}
                  placeholder="Kupon kodunu girin"
                  style={{ flex: 1, height: 42, borderRadius: 10, border: "1.5px solid #E5E7EB", padding: "0 14px", fontSize: 13, fontFamily: "inherit", outline: "none", letterSpacing: "0.05em" }}
                />
                <button onClick={applyCoupon} disabled={!couponCode.trim()}
                  style={{ height: 42, padding: "0 18px", borderRadius: 10, border: "none", background: couponCode.trim() ? brand : "#E5E7EB", color: couponCode.trim() ? "#fff" : "#9CA3AF", fontSize: 13, fontWeight: 700, cursor: couponCode.trim() ? "pointer" : "not-allowed", fontFamily: "inherit", flexShrink: 0 }}>
                  Uygula
                </button>
              </div>
            )}
            {couponError && <p style={{ fontSize: 12, color: "#DC2626", marginTop: 6, margin: "6px 0 0" }}>{couponError}</p>}
          </div>

          {orderError && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#B91C1C", marginBottom: 14 }}>
              {orderError}
            </div>
          )}

          {/* Blocking issues hint above button */}
          {stockChecked && hasBlockingIssues && (
            <div style={{ textAlign: "center", fontSize: 12.5, color: "#DC2626", fontWeight: 700, marginBottom: 10 }}>
              Sorunlu ürünleri kaldırdıktan sonra ödemeye geçebilirsiniz.
            </div>
          )}

          {/* Place order button */}
          <button
            onClick={handleSubmit}
            disabled={orderLoading || (stockChecked && hasBlockingIssues)}
            style={{
              width: "100%", height: 52, borderRadius: 14, border: "none",
              background: (orderLoading || (stockChecked && hasBlockingIssues)) ? "#ccc" : `linear-gradient(135deg,${brand},#A67C52)`,
              color: "#fff", fontSize: 15, fontWeight: 800,
              cursor: (orderLoading || (stockChecked && hasBlockingIssues)) ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit",
            }}
          >
            {orderLoading ? (
              <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> İşleniyor...</>
            ) : stockLoading ? (
              <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Stok kontrol ediliyor...</>
            ) : (
              <>Ödemeye Geç <ArrowRight size={16} /></>
            )}
          </button>

          <p style={{ textAlign: "center", fontSize: 11, color: "#aaa", marginTop: 10 }}>
            Siparişi tamamlayarak <a href="/yourpoodle/kullanim-sartlari" style={{ color: brand }}>Kullanım Şartları</a>'nı kabul etmiş olursunuz.
          </p>
        </div>

      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </YPLayout>
  );
}
