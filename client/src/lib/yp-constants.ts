/**
 * YourPoodle shipping constants — single source of truth.
 * Update these values here; all YP pages import from this module.
 */
export const YP_SHIPPING = {
  /** Minimum domestic cart total for free shipping (TL) */
  FREE_SHIPPING_MIN_TL: 1000,
  /** Minimum order value accepted (TL) */
  MIN_ORDER_TL: 500,
  /** Flat domestic shipping fee below the free-shipping threshold (TL) */
  DELIVERY_FEE_TL: 89,
} as const;

/** Display helper: "1.000₺ üzeri ücretsiz kargo" */
export const FREE_SHIPPING_LABEL = `${YP_SHIPPING.FREE_SHIPPING_MIN_TL.toLocaleString("tr-TR")}₺ üzeri ücretsiz kargo`;
