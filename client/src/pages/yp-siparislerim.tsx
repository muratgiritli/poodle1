import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Package, ExternalLink, ChevronRight, X } from "lucide-react";
import { useCustomer } from "@/contexts/CustomerContext";
import YPLayout from "@/components/yourpoodle/YPLayout";
import YPBreadcrumb from "@/components/YPBreadcrumb";

const BREADCRUMBS = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Profilim", href: "/yourpoodle/profil" },
  { label: "Siparişlerim", href: "/yourpoodle/siparislerim" },
];

const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  beklemede:    { label: "Beklemede",      color: "#92400E", bg: "#FEF3C7" },
  hazirlaniyor: { label: "Hazırlanıyor",   color: "#1E40AF", bg: "#DBEAFE" },
  kargoda:      { label: "Kargoda",        color: "#5B21B6", bg: "#EDE9FE" },
  teslim:       { label: "Teslim Edildi",  color: "#065F46", bg: "#D1FAE5" },
  iptal:        { label: "İptal",          color: "#991B1B", bg: "#FEE2E2" },
};

const PAYMENT_STATUS: Record<string, { label: string; color: string }> = {
  paid:       { label: "Ödendi",           color: "#065F46" },
  pending:    { label: "Ödeme Bekleniyor", color: "#92400E" },
  awaiting:   { label: "Ödeme Bekleniyor", color: "#92400E" },
  failed:     { label: "Ödeme Başarısız",  color: "#991B1B" },
};

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  nakit:           "Kapıda Nakit",
  "kredi-karti":   "Kredi Kartı",
  "kapida-kart":   "Kapıda Kart",
  havale:          "Havale/EFT",
  iyzico:          "Kredi Kartı (Online)",
  tosla:           "Tosla ile Öde",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

function formatCurrency(v: number | string) {
  return Number(v).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const CANCELLABLE_STATUSES = ["beklemede", "hazirlaniyor"];

export default function YPSiparislerimPage() {
  const [, navigate] = useLocation();
  const { isLoggedIn } = useCustomer();
  const queryClient = useQueryClient();
  const [confirmingId, setConfirmingId] = useState<number | null>(null);

  // Redirect to login if not logged in
  useEffect(() => {
    if (isLoggedIn === false) navigate("/yourpoodle/giris");
  }, [isLoggedIn]);

  const { data: allOrders, isLoading } = useQuery<any[]>({
    queryKey: ["/api/customer/orders"],
    enabled: !!isLoggedIn,
    staleTime: 30_000,
  });

  const cancelMutation = useMutation({
    mutationFn: async (orderId: number) => {
      const res = await fetch(`/api/customer/orders/${orderId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "İptal işlemi başarısız oldu");
      }
      return res.json();
    },
    onSuccess: (_data, orderId) => {
      setConfirmingId(null);
      // Optimistically update the cached order list so status flips instantly
      queryClient.setQueryData<any[]>(["/api/customer/orders"], (prev) =>
        (prev || []).map((o) => (o.id === orderId ? { ...o, status: "iptal" } : o))
      );
    },
    onError: (err: Error) => {
      setConfirmingId(null);
      alert(err.message || "İptal işlemi başarısız oldu. Lütfen tekrar deneyin.");
    },
  });

  // Filter to YP / jetgo orders only, exclude pending payment (not yet paid online)
  const orders = (allOrders || []).filter(
    (o: any) =>
      o.sourceSite === "jetgo" &&
      o.paymentStatus !== "pending" &&
      o.paymentStatus !== "awaiting"
  );

  return (
    <YPLayout activeLink="/yourpoodle/profil">
      <title>Siparişlerim | YourPoodle</title>
      <meta name="robots" content="noindex" />

      <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: "#FAFAF9" }}>
        <YPBreadcrumb items={BREADCRUMBS} />

        {/* Header */}
        <section style={{ background: "linear-gradient(135deg, #7C3AFF 0%, #5B21B6 100%)", padding: "28px 20px 24px", textAlign: "center", color: "#fff" }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>📦</div>
          <h1 style={{ fontSize: 20, fontWeight: 900, marginBottom: 4 }}>Siparişlerim</h1>
          <p style={{ fontSize: 13, opacity: 0.85 }}>YourPoodle'dan verdiğiniz siparişler</p>
        </section>

        <div style={{ padding: "20px 16px", maxWidth: 700, margin: "0 auto" }}>

          {isLoading ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: "#aaa" }}>Yükleniyor…</div>
          ) : orders.length === 0 ? (
            /* ── Empty state ── */
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🛍️</div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a", marginBottom: 8 }}>Henüz siparişiniz yok</h2>
              <p style={{ fontSize: 14, color: "#888", lineHeight: 1.7, marginBottom: 24, maxWidth: 300, margin: "0 auto 24px" }}>
                YourPoodle mağazasından ilk siparişinizi verin, poodle'ınız bekliyor!
              </p>
              <button
                onClick={() => navigate("/yourpoodle/magaza")}
                style={{ height: 48, borderRadius: 14, background: "#7C3AFF", border: "none", color: "#fff", fontSize: 15, fontWeight: 800, padding: "0 28px", cursor: "pointer", fontFamily: "inherit" }}
              >
                Mağazaya Git
              </button>
            </div>
          ) : (
            /* ── Order list ── */
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {orders.map((order: any) => {
                const statusInfo = STATUS_LABEL[order.status] || { label: order.status, color: "#555", bg: "#f3f3f3" };
                const payInfo = PAYMENT_STATUS[order.paymentStatus] || null;
                const items: any[] = Array.isArray(order.items) ? order.items : [];
                const hasTracking = order.trackingNumber || order.trackingUrl;
                const isCancellable = CANCELLABLE_STATUSES.includes(order.status);
                const isConfirming = confirmingId === order.id;
                const isCancelling = cancelMutation.isPending && cancelMutation.variables === order.id;

                return (
                  <div key={order.id} style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 16px rgba(0,0,0,0.07)", overflow: "hidden" }}>
                    {/* Order header */}
                    <div style={{ padding: "14px 16px 12px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#1a1a1a" }}>Sipariş #{order.id}</div>
                        <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>{formatDate(order.createdAt)}</div>
                      </div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                        <span style={{ background: statusInfo.bg, color: statusInfo.color, borderRadius: 99, padding: "4px 10px", fontSize: 11, fontWeight: 700 }}>
                          {statusInfo.label}
                        </span>
                        {payInfo && (
                          <span style={{ background: "#F9FAFB", color: payInfo.color, borderRadius: 99, padding: "4px 10px", fontSize: 11, fontWeight: 700, border: "1px solid #E5E7EB" }}>
                            {payInfo.label}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Items */}
                    <div style={{ padding: "12px 16px" }}>
                      {items.length === 0 ? (
                        <p style={{ fontSize: 13, color: "#aaa", margin: 0 }}>Ürün bilgisi bulunamadı</p>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {items.map((item: any, idx: number) => (
                            <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              {item.img ? (
                                <img
                                  src={item.img}
                                  alt={item.name}
                                  style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover", flexShrink: 0, background: "#f5f5f5" }}
                                />
                              ) : (
                                <div style={{ width: 44, height: 44, borderRadius: 10, background: "#EDE9FE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 20 }}>🐾</div>
                              )}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  {item.name}
                                </div>
                                <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
                                  {item.quantity} adet × ₺{formatCurrency(item.price)}
                                </div>
                              </div>
                              <div style={{ fontSize: 13, fontWeight: 800, color: "#7C3AED", flexShrink: 0 }}>
                                ₺{formatCurrency(Number(item.price) * Number(item.quantity))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Delivery address + slot */}
                    {(order.customerAddress || order.deliverySlot) && (
                      <div style={{ margin: "0 16px 12px", background: "#F5F3FF", borderRadius: 12, padding: "10px 14px", display: "flex", flexDirection: "column", gap: 5 }}>
                        {order.deliverySlot && (
                          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#5B21B6", fontWeight: 700 }}>
                            <span>🕐</span>
                            <span>Tahmini Teslimat: {order.deliverySlot}</span>
                          </div>
                        )}
                        {order.customerAddress && (
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 12, color: "#555" }}>
                            <span style={{ flexShrink: 0 }}>📍</span>
                            <span style={{ overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                              {order.customerAddress}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Totals + payment method */}
                    <div style={{ padding: "10px 16px 12px", borderTop: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
                      <div style={{ fontSize: 12, color: "#888" }}>
                        {PAYMENT_METHOD_LABEL[order.paymentMethod] || order.paymentMethod}
                      </div>
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        {Number(order.shipping) > 0 && (
                          <span style={{ fontSize: 12, color: "#aaa" }}>+₺{formatCurrency(order.shipping)} kargo</span>
                        )}
                        <span style={{ fontSize: 15, fontWeight: 900, color: "#1a1a1a" }}>₺{formatCurrency(order.grandTotal)}</span>
                      </div>
                    </div>

                    {/* Kargo tracking */}
                    {hasTracking && (
                      <div style={{ margin: "0 16px 14px", background: "#EDE9FE", borderRadius: 12, padding: "10px 14px" }}>
                        <div style={{ fontSize: 11, color: "#7C3AED", fontWeight: 700, marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
                          <Package size={12} />
                          Kargo Takibi
                        </div>
                        {order.cargoCompany && (
                          <div style={{ fontSize: 12, color: "#555", marginBottom: 2 }}>
                            <span style={{ color: "#888" }}>Kargo: </span>{order.cargoCompany}
                          </div>
                        )}
                        {order.trackingNumber && (
                          <div style={{ fontSize: 12, color: "#555", marginBottom: order.trackingUrl ? 4 : 0 }}>
                            <span style={{ color: "#888" }}>Takip No: </span>
                            <strong>{order.trackingNumber}</strong>
                          </div>
                        )}
                        {order.trackingUrl && (
                          <a
                            href={order.trackingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700, color: "#7C3AED", textDecoration: "none", marginTop: 2 }}
                          >
                            Kargoya Git <ExternalLink size={11} />
                          </a>
                        )}
                      </div>
                    )}

                    {/* View product CTA (if single item) */}
                    {items.length === 1 && items[0].productId && (
                      <div style={{ padding: "0 16px 14px" }}>
                        <button
                          onClick={() => navigate(`/yourpoodle/urun/${items[0].productId}`)}
                          style={{ width: "100%", background: "#F5F3FF", border: "none", borderRadius: 12, padding: "10px 14px", fontSize: 12, fontWeight: 700, color: "#7C3AED", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, fontFamily: "inherit" }}
                        >
                          Ürünü Görüntüle <ChevronRight size={13} />
                        </button>
                      </div>
                    )}

                    {/* Cancel button — only for beklemede / hazirlaniyor */}
                    {isCancellable && (
                      <div style={{ padding: "0 16px 14px" }}>
                        {isConfirming ? (
                          <div style={{ background: "#FEF2F2", borderRadius: 12, padding: "12px 14px", border: "1px solid #FECACA" }}>
                            <p style={{ fontSize: 13, fontWeight: 700, color: "#991B1B", margin: "0 0 10px", textAlign: "center" }}>
                              Siparişi iptal etmek istediğinize emin misiniz?
                            </p>
                            <div style={{ display: "flex", gap: 8 }}>
                              <button
                                onClick={() => setConfirmingId(null)}
                                disabled={isCancelling}
                                style={{ flex: 1, height: 40, borderRadius: 10, background: "#F3F4F6", border: "none", fontSize: 13, fontWeight: 700, color: "#374151", cursor: "pointer", fontFamily: "inherit" }}
                              >
                                Vazgeç
                              </button>
                              <button
                                onClick={() => cancelMutation.mutate(order.id)}
                                disabled={isCancelling}
                                style={{ flex: 1, height: 40, borderRadius: 10, background: "#DC2626", border: "none", fontSize: 13, fontWeight: 700, color: "#fff", cursor: isCancelling ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: isCancelling ? 0.7 : 1 }}
                              >
                                {isCancelling ? "İptal ediliyor…" : "Evet, İptal Et"}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmingId(order.id)}
                            style={{ width: "100%", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 12, padding: "10px 14px", fontSize: 12, fontWeight: 700, color: "#DC2626", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, fontFamily: "inherit" }}
                          >
                            <X size={13} />
                            İptal Et
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Back to profile */}
          <div style={{ marginTop: 24, textAlign: "center" }}>
            <button
              onClick={() => navigate("/yourpoodle/profil")}
              style={{ background: "none", border: "none", fontSize: 13, fontWeight: 700, color: "#7C3AED", cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}
            >
              ← Profile Dön
            </button>
          </div>
        </div>
      </div>
    </YPLayout>
  );
}
