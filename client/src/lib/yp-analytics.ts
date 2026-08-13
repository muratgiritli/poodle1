/**
 * Phase 1 first-party analytics client.
 * Anonymous visitor_id + session_id; posts to /api/track/event.
 * Does not load third-party pixels.
 */

export type YpAnalyticsEvent =
  | "session_start"
  | "page_view"
  | "product_view"
  | "category_view"
  | "search"
  | "add_to_cart"
  | "remove_from_cart"
  | "begin_checkout"
  | "purchase"
  | "food_finder_start"
  | "food_finder_complete"
  | "ai_open"
  | "signup"
  | "login";

const VID_KEY = "yp_vid";
const SID_KEY = "yp_sid";
const SID_TS_KEY = "yp_sid_ts";
const ATTR_KEY = "yp_attr";
const SESSION_MS = 30 * 60 * 1000;

type Attr = {
  referrer: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  gclid: string;
  fbclid: string;
  ttclid: string;
  gbraid: string;
  wbraid: string;
  msclkid: string;
};

function rid(): string {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID().replace(/-/g, "");
    }
  } catch {}
  return `yp${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
}

function lsGet(k: string): string | null {
  try { return localStorage.getItem(k); } catch { return null; }
}
function lsSet(k: string, v: string) {
  try { localStorage.setItem(k, v); } catch {}
}
function ssGet(k: string): string | null {
  try { return sessionStorage.getItem(k); } catch { return null; }
}
function ssSet(k: string, v: string) {
  try { sessionStorage.setItem(k, v); } catch {}
}

export function getVisitorId(): string {
  let id = lsGet(VID_KEY);
  if (!id || id.length < 8) {
    id = rid();
    lsSet(VID_KEY, id);
  }
  return id;
}

/** Returns { sessionId, isNew } */
export function getSessionId(): { sessionId: string; isNew: boolean } {
  const now = Date.now();
  const existing = ssGet(SID_KEY);
  const ts = parseInt(ssGet(SID_TS_KEY) || "0", 10) || 0;
  if (existing && existing.length >= 8 && now - ts < SESSION_MS) {
    ssSet(SID_TS_KEY, String(now));
    return { sessionId: existing, isNew: false };
  }
  const sessionId = rid();
  ssSet(SID_KEY, sessionId);
  ssSet(SID_TS_KEY, String(now));
  return { sessionId, isNew: true };
}

function captureAttrOnce(): Attr {
  const cached = ssGet(ATTR_KEY);
  if (cached) {
    try { return JSON.parse(cached) as Attr; } catch {}
  }
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const attr: Attr = {
    referrer: typeof document !== "undefined" ? (document.referrer || "") : "",
    utmSource: params.get("utm_source") || "",
    utmMedium: params.get("utm_medium") || "",
    utmCampaign: params.get("utm_campaign") || "",
    utmContent: params.get("utm_content") || "",
    utmTerm: params.get("utm_term") || "",
    gclid: params.get("gclid") || "",
    fbclid: params.get("fbclid") || "",
    ttclid: params.get("ttclid") || "",
    gbraid: params.get("gbraid") || "",
    wbraid: params.get("wbraid") || "",
    msclkid: params.get("msclkid") || "",
  };
  ssSet(ATTR_KEY, JSON.stringify(attr));
  return attr;
}

function isCategoryPath(path: string): boolean {
  return (
    /^\/kategori(\/|$)/i.test(path) ||
    /^\/yourpoodle\/(magaza|kuru-mama|yas-mama)/i.test(path) ||
    /^\/(magaza|kuru-mama|yas-mama)(\/|$)/i.test(path) ||
    /^\/siparis\//i.test(path)
  );
}

export function track(eventName: YpAnalyticsEvent, metadata?: Record<string, unknown>, pageUrl?: string): void {
  if (typeof window === "undefined") return;
  try {
    const path = pageUrl || `${window.location.pathname}${window.location.search}`;
    if (/^\/admin/i.test(path)) return;

    const visitorId = getVisitorId();
    const { sessionId, isNew } = getSessionId();
    const attr = captureAttrOnce();

    const send = (name: YpAnalyticsEvent, meta?: Record<string, unknown>) => {
      const body = {
        visitorId,
        sessionId,
        eventName: name,
        pageUrl: path.slice(0, 500),
        referrer: attr.referrer.slice(0, 500),
        utmSource: attr.utmSource,
        utmMedium: attr.utmMedium,
        utmCampaign: attr.utmCampaign,
        utmContent: attr.utmContent,
        utmTerm: attr.utmTerm,
        gclid: attr.gclid,
        fbclid: attr.fbclid,
        ttclid: attr.ttclid,
        gbraid: attr.gbraid,
        wbraid: attr.wbraid,
        msclkid: attr.msclkid,
        metadata: meta || {},
      };
      const payload = JSON.stringify(body);
      if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
        const blob = new Blob([payload], { type: "application/json" });
        if (navigator.sendBeacon("/api/track/event", blob)) return;
      }
      fetch("/api/track/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
        credentials: "include",
      }).catch(() => {});
    };

    if (isNew) send("session_start");
    // Start (or resume after refresh) engagement heartbeat once per tab lifetime
    startHeartbeat();
    send(eventName, metadata);

    if (eventName === "page_view" && isCategoryPath(path)) {
      send("category_view", { path });
    }
  } catch {
    /* never break UX */
  }
}

/** Convenience: product view */
export function trackProductView(product: { id: string | number; name?: string; price?: number }) {
  track("product_view", {
    product_id: String(product.id),
    product_name: product.name || null,
    price: product.price ?? null,
  });
}

export function trackAddToCart(product: { id: string | number; name?: string; price?: number }, qty = 1) {
  track("add_to_cart", {
    product_id: String(product.id),
    product_name: product.name || null,
    price: product.price ?? null,
    quantity: qty,
  });
}

export function trackRemoveFromCart(productId: string | number, qty = 1) {
  track("remove_from_cart", { product_id: String(productId), quantity: qty });
}

export function trackBeginCheckout(value?: number, itemCount?: number) {
  track("begin_checkout", { value: value ?? null, item_count: itemCount ?? null, currency: "TRY" });
}

export function trackPurchase(order: { orderId: string | number; value?: number; currency?: string }) {
  track("purchase", {
    order_id: String(order.orderId),
    value: order.value ?? null,
    currency: order.currency || "TRY",
  });
  // Meta Pixel Purchase — same event_id as server CAPI for dedupe
  try {
    const w = window as any;
    if (typeof w.fbq === "function") {
      w.fbq(
        "track",
        "Purchase",
        {
          value: order.value ?? 0,
          currency: order.currency || "TRY",
          order_id: String(order.orderId),
        },
        { eventID: `order_${order.orderId}` },
      );
    }
  } catch { /* ignore */ }
}

/** Attach to order create body for server-side attribution. */
export function getAttributionPayload(): { visitorId: string; sessionId: string } {
  const visitorId = getVisitorId();
  const { sessionId } = getSessionId();
  return { visitorId, sessionId };
}

let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
let heartbeatStarted = false;

function postHeartbeat(): void {
  if (typeof window === "undefined") return;
  if (typeof document !== "undefined" && document.visibilityState === "hidden") return;
  try {
    const path = `${window.location.pathname}${window.location.search}`;
    if (/^\/admin/i.test(path)) return;
    const visitorId = getVisitorId();
    const { sessionId } = getSessionId();
    const payload = JSON.stringify({ visitorId, sessionId });
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([payload], { type: "application/json" });
      if (navigator.sendBeacon("/api/track/heartbeat", blob)) return;
    }
    fetch("/api/track/heartbeat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
      credentials: "include",
    }).catch(() => {});
  } catch {
    /* never break UX */
  }
}

/** POST /api/track/heartbeat every 60s while the tab is visible. */
export function startHeartbeat(): void {
  if (typeof window === "undefined" || heartbeatStarted) return;
  heartbeatStarted = true;
  postHeartbeat();
  if (heartbeatTimer) clearInterval(heartbeatTimer);
  heartbeatTimer = setInterval(postHeartbeat, 60_000);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") postHeartbeat();
  });
}
