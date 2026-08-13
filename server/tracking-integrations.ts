/**
 * Admin-configurable tracking integrations (public IDs + server secrets).
 * Stored in app_settings as tracking_integrations JSON. Complements store google_tags.
 */
import { pool } from "./storage";
import { getStoreGoogleConfig, setStoreGoogleConfig, normalizeGoogleConfig } from "./google-tags";
import { DEFAULT_STORE } from "@shared/stores";

const SETTINGS_KEY = "tracking_integrations";

export const TRACKING_PROVIDERS = [
  "ga4",
  "gtm",
  "google_ads",
  "meta_pixel",
  "meta_capi",
  "tiktok",
  "clarity",
  "yandex_metrica",
  "hotjar",
  "pinterest",
  "linkedin",
  "snapchat",
  "microsoft_uet",
  "x_pixel",
] as const;

export type TrackingProvider = (typeof TRACKING_PROVIDERS)[number];

export type TrackingIntegrationRow = {
  provider: TrackingProvider;
  enabled: boolean;
  publicId: string;
  /** Secret never returned to browser; masked in admin as hasSecret */
  hasSecret: boolean;
  config: Record<string, unknown>;
  updatedAt: string | null;
  updatedBy: string | null;
  status: "not_configured" | "configured" | "active" | "error";
};

type StoredRow = {
  enabled?: boolean;
  publicId?: string;
  secret?: string;
  config?: Record<string, unknown>;
  updatedAt?: string;
  updatedBy?: string | null;
};

type StoredMap = Partial<Record<TrackingProvider, StoredRow>>;

let cache: StoredMap | null = null;
let cacheTs = 0;
const TTL = 30_000;

function emptyRow(provider: TrackingProvider): TrackingIntegrationRow {
  return {
    provider,
    enabled: false,
    publicId: "",
    hasSecret: false,
    config: {},
    updatedAt: null,
    updatedBy: null,
    status: "not_configured",
  };
}

async function loadRaw(): Promise<StoredMap> {
  const now = Date.now();
  if (cache && now - cacheTs < TTL) return cache;
  try {
    const { rows } = await pool.query(`SELECT value FROM app_settings WHERE key = $1`, [SETTINGS_KEY]);
    if (!rows[0]?.value) {
      cache = {};
      cacheTs = now;
      return cache;
    }
    cache = JSON.parse(rows[0].value) as StoredMap;
    cacheTs = now;
    return cache;
  } catch {
    return {};
  }
}

async function saveRaw(map: StoredMap): Promise<void> {
  await pool.query(
    `INSERT INTO app_settings (key, value, updated_at) VALUES ($1, $2, NOW())
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
    [SETTINGS_KEY, JSON.stringify(map)],
  );
  cache = map;
  cacheTs = Date.now();
}

function deriveStatus(row: StoredRow | undefined, provider?: TrackingProvider): TrackingIntegrationRow["status"] {
  if (!row) return "not_configured";
  const hasId = !!(row.publicId && String(row.publicId).trim());
  const hasSecret = !!(row.secret && String(row.secret).trim());
  const needsSecret = provider === "meta_capi";
  if (!hasId && !hasSecret) return "not_configured";
  if (row.enabled && hasId) {
    if (needsSecret && !hasSecret) return "configured";
    return "active";
  }
  if (hasId || hasSecret) return "configured";
  return "not_configured";
}

/** Merge Google tags from store config into integration list for admin UI. */
async function googleOverlay(rows: TrackingIntegrationRow[]): Promise<TrackingIntegrationRow[]> {
  const g = (await getStoreGoogleConfig(DEFAULT_STORE.id)) || DEFAULT_STORE.google || {};
  const by = new Map(rows.map((r) => [r.provider, r]));

  const setG = (provider: TrackingProvider, publicId: string, enabled: boolean) => {
    const cur = by.get(provider) || emptyRow(provider);
    // Prefer dedicated tracking_integrations override if present
    if (cur.publicId) return;
    by.set(provider, {
      ...cur,
      publicId: publicId || cur.publicId,
      enabled: enabled || cur.enabled,
      status: publicId ? (enabled ? "active" : "configured") : cur.status,
    });
  };

  if (g.gtmId) setG("gtm", g.gtmId, true);
  if (g.ga4Ids?.[0]) setG("ga4", g.ga4Ids[0], true);
  if (g.adsIds?.[0]) setG("google_ads", g.adsIds[0], true);

  return TRACKING_PROVIDERS.map((p) => by.get(p) || emptyRow(p));
}

export async function listTrackingIntegrations(): Promise<TrackingIntegrationRow[]> {
  const raw = await loadRaw();
  const rows = TRACKING_PROVIDERS.map((provider) => {
    const s = raw[provider];
    return {
      provider,
      enabled: !!s?.enabled,
      publicId: s?.publicId || "",
      hasSecret: !!(s?.secret && String(s.secret).length > 0),
      config: s?.config && typeof s.config === "object" ? s.config : {},
      updatedAt: s?.updatedAt || null,
      updatedBy: s?.updatedBy ?? null,
      status: deriveStatus(s, provider),
    } satisfies TrackingIntegrationRow;
  });
  return googleOverlay(rows);
}

export async function upsertTrackingIntegration(
  provider: string,
  patch: { enabled?: boolean; publicId?: string; secret?: string | null; config?: Record<string, unknown> },
  updatedBy?: string | null,
): Promise<TrackingIntegrationRow> {
  if (!TRACKING_PROVIDERS.includes(provider as TrackingProvider)) {
    throw new Error("unknown_provider");
  }
  const p = provider as TrackingProvider;
  const raw = await loadRaw();
  const prev = raw[p] || {};
  const next: StoredRow = {
    ...prev,
    enabled: typeof patch.enabled === "boolean" ? patch.enabled : !!prev.enabled,
    publicId:
      typeof patch.publicId === "string"
        ? patch.publicId.trim().slice(0, 128)
        : prev.publicId || "",
    config: patch.config && typeof patch.config === "object" ? patch.config : prev.config || {},
    updatedAt: new Date().toISOString(),
    updatedBy: updatedBy ?? prev.updatedBy ?? null,
  };
  if (patch.secret === null) {
    delete next.secret;
  } else if (typeof patch.secret === "string" && patch.secret.trim()) {
    next.secret = patch.secret.trim().slice(0, 512);
  }
  // Keep existing secret if not provided
  if (patch.secret === undefined && prev.secret) next.secret = prev.secret;

  raw[p] = next;
  await saveRaw(raw);

  // Sync Google providers into store google_tags so SSR inject stays source of truth
  if (p === "ga4" || p === "gtm" || p === "google_ads") {
    const g = (await getStoreGoogleConfig(DEFAULT_STORE.id)) || {};
    const merged = normalizeGoogleConfig({
      gtmId: p === "gtm" ? next.publicId : g.gtmId,
      ga4Ids: p === "ga4" ? (next.publicId ? [next.publicId] : []) : g.ga4Ids,
      adsIds: p === "google_ads" ? (next.publicId ? [next.publicId] : []) : g.adsIds,
      siteVerification: g.siteVerification,
    });
    // If disabled, clear that id from google tags
    if (!next.enabled) {
      if (p === "gtm") delete merged.gtmId;
      if (p === "ga4") delete merged.ga4Ids;
      if (p === "google_ads") delete merged.adsIds;
    }
    await setStoreGoogleConfig(DEFAULT_STORE.id, merged);
  }

  const list = await listTrackingIntegrations();
  return list.find((r) => r.provider === p)!;
}

/** Public config for browser loader — no secrets. */
export async function getPublicTrackingConfig(): Promise<{
  providers: Array<{ provider: string; publicId: string }>;
}> {
  const raw = await loadRaw();
  const providers: Array<{ provider: string; publicId: string }> = [];
  for (const p of TRACKING_PROVIDERS) {
    if (p === "ga4" || p === "gtm" || p === "google_ads") continue; // SSR Google inject
    if (p === "meta_capi") continue; // server-only
    const s = raw[p];
    if (s?.enabled && s.publicId) {
      providers.push({ provider: p, publicId: String(s.publicId).trim() });
    }
  }
  return { providers };
}

export async function getMetaCapiSecret(): Promise<{ pixelId: string; accessToken: string } | null> {
  const raw = await loadRaw();
  const s = raw.meta_capi;
  if (!s?.enabled || !s.secret) return null;
  const pixelId = (s.publicId || raw.meta_pixel?.publicId || "").trim();
  if (!pixelId) return null;
  return { pixelId, accessToken: String(s.secret).trim() };
}

/** Server-side Meta Purchase (CAPI). Uses orderId as event_id for Pixel dedupe. */
export async function sendMetaCapiPurchase(input: {
  orderId: string | number;
  value?: number | null;
  currency?: string;
  eventSourceUrl?: string | null;
  clientIp?: string | null;
  userAgent?: string | null;
  email?: string | null;
  phone?: string | null;
}): Promise<void> {
  const creds = await getMetaCapiSecret();
  if (!creds) return;

  const eventId = `order_${input.orderId}`;
  const userData: Record<string, unknown> = {};
  if (input.clientIp) userData.client_ip_address = input.clientIp;
  if (input.userAgent) userData.client_user_agent = input.userAgent;
  // Hash PII when present (SHA-256 hex) — Meta requires normalized hashed values
  const crypto = await import("crypto");
  const hash = (v: string) => crypto.createHash("sha256").update(v.trim().toLowerCase()).digest("hex");
  if (input.email?.trim()) userData.em = [hash(input.email)];
  if (input.phone?.trim()) {
    const digits = input.phone.replace(/\D/g, "");
    if (digits) userData.ph = [hash(digits)];
  }

  const body = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: "website",
        event_source_url: input.eventSourceUrl || undefined,
        user_data: userData,
        custom_data: {
          currency: input.currency || "TRY",
          value: typeof input.value === "number" && !Number.isNaN(input.value) ? input.value : undefined,
          order_id: String(input.orderId),
        },
      },
    ],
  };

  const url = `https://graph.facebook.com/v19.0/${encodeURIComponent(creds.pixelId)}/events?access_token=${encodeURIComponent(creds.accessToken)}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.warn("[meta-capi] Purchase failed", res.status, text.slice(0, 300));
    }
  } catch (e) {
    console.warn("[meta-capi] Purchase error", e);
  }
}

/** Load order + fire Meta CAPI Purchase (non-blocking caller). */
export async function sendMetaCapiPurchaseForOrder(orderId: string | number): Promise<void> {
  try {
    const { rows } = await pool.query(
      `SELECT id, grand_total, customer_phone FROM orders WHERE id = $1`,
      [orderId],
    );
    const o = rows[0];
    if (!o) return;
    const value = Number(o.grand_total);
    await sendMetaCapiPurchase({
      orderId: o.id,
      value: Number.isFinite(value) ? value : null,
      currency: "TRY",
      phone: o.customer_phone || null,
    });
  } catch (e) {
    console.warn("[meta-capi] order lookup failed", e);
  }
}
