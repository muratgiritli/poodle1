/** Checkout draft handoff: sepet → ödeme (sessionStorage). */

export type CheckoutDraft = {
  couponCode?: string;
  couponDiscount?: number;
  couponLabel?: string;
  couponFreeShipping?: boolean;
  deliveryId?: string;
  deliveryPrice?: number;
  addressId?: number | null;
  addressLabel?: string;
  addressText?: string;
  city?: string;
  district?: string;
  updatedAt: number;
};

const KEY = "yp_checkout_draft";

export function saveCheckoutDraft(draft: Omit<CheckoutDraft, "updatedAt">): void {
  try {
    const payload: CheckoutDraft = { ...draft, updatedAt: Date.now() };
    sessionStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    /* ignore quota / private mode */
  }
}

export function loadCheckoutDraft(maxAgeMs = 2 * 60 * 60 * 1000): CheckoutDraft | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as CheckoutDraft;
    if (!data?.updatedAt || Date.now() - data.updatedAt > maxAgeMs) {
      sessionStorage.removeItem(KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function clearCheckoutDraft(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
