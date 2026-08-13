/**
 * YourPoodle shipping calc — mirrors server /api/orders neighborhood matching
 * (delivery_neighborhoods → else YP_SHIPPING / CONFIG defaults).
 */
import { CONFIG, roundMoney } from "@/lib/data";
import { YP_SHIPPING } from "@/lib/yp-constants";

export type DeliveryNeighborhood = {
  id?: number;
  name: string;
  district?: string;
  shippingFee: number;
  freeShippingLimit: number;
  minOrder: number;
  isActive?: boolean;
};

export function matchNeighborhood(
  addressText: string,
  neighborhoods: DeliveryNeighborhood[],
): DeliveryNeighborhood | null {
  const list = (neighborhoods || []).filter((n) => n.isActive !== false);
  const addrLower = (addressText || "").toLocaleLowerCase("tr");
  if (!addrLower.trim() || !list.length) return null;

  const compactAddr = addrLower.replace(/\s+/g, " ");
  const noSpaceAddr = addrLower.replace(/\s+/g, "");
  let best: DeliveryNeighborhood | null = null;

  for (const nh of list) {
    const nhLower = (nh.name || "").toLocaleLowerCase("tr");
    if (!nhLower) continue;
    const compactNb = nhLower.replace(/\s+/g, " ");
    const noSpaceNb = nhLower.replace(/\s+/g, "");
    if (compactAddr.includes(compactNb) || noSpaceAddr.includes(noSpaceNb)) {
      if (!best || nh.name.length > best.name.length) best = nh;
    }
  }
  return best;
}

export function resolveYpShipping(
  subtotal: number,
  addressText: string,
  neighborhoods: DeliveryNeighborhood[],
): {
  shipping: number;
  fee: number;
  freeLimit: number;
  minOrder: number;
  matched: DeliveryNeighborhood | null;
} {
  const matched = matchNeighborhood(addressText, neighborhoods);
  const fee = matched ? Number(matched.shippingFee) : (YP_SHIPPING.DELIVERY_FEE_TL || CONFIG.shipFee);
  const freeLimit = matched
    ? Number(matched.freeShippingLimit)
    : (YP_SHIPPING.FREE_SHIPPING_MIN_TL || CONFIG.shipLimit);
  const minOrder = matched ? Number(matched.minOrder) || 0 : 0;
  const shipping = subtotal >= freeLimit ? 0 : fee;
  return { shipping, fee, freeLimit, minOrder, matched };
}

/** Card surcharge on product subtotal only (same as server). */
export function ypCardSurcharge(subtotal: number, rate: number): number {
  return roundMoney(Math.max(0, subtotal) * rate);
}
