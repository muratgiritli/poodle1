/**
 * First-party analytics: anonymous visitor/session + extensible events.
 * Complements (does not replace) site_visits / Google tags.
 */
import type { Pool } from "pg";

export const ANALYTICS_EVENTS = [
  "session_start",
  "page_view",
  "product_view",
  "category_view",
  "search",
  "add_to_cart",
  "remove_from_cart",
  "begin_checkout",
  "purchase",
  "food_finder_start",
  "food_finder_complete",
  "ai_open",
  "signup",
  "login",
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[number];

const EVENT_SET = new Set<string>(ANALYTICS_EVENTS);

const ID_RE = /^[a-zA-Z0-9_-]{8,64}$/;

export type DeviceType = "desktop" | "mobile" | "tablet";

export type ParsedUserAgent = {
  device: DeviceType;
  os: string;
  browser: string;
};

export type TrafficSourceInput = {
  referrer?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  gclid?: string | null;
  fbclid?: string | null;
  ttclid?: string | null;
  msclkid?: string | null;
  gbraid?: string | null;
  wbraid?: string | null;
};

export type NormalizedTrafficSource = {
  source: string;
  medium: string;
  channel: string;
  isPaid: boolean;
  label: string;
};

function lower(s: unknown): string {
  return typeof s === "string" ? s.trim().toLowerCase() : "";
}

function hostFromReferrer(referrer: string | null | undefined): string {
  if (!referrer || typeof referrer !== "string") return "";
  try {
    return new URL(referrer).hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    return "";
  }
}

/** Lightweight UA parse — no external dependency. */
export function parseUserAgent(ua: string | null | undefined): ParsedUserAgent {
  const s = typeof ua === "string" ? ua : "";
  const l = s.toLowerCase();

  let device: DeviceType = "desktop";
  if (/ipad|tablet|kindle|silk|(android(?!.*mobile))/i.test(s)) {
    device = "tablet";
  } else if (/mobi|iphone|ipod|android.*mobile|windows phone|blackberry/i.test(s)) {
    device = "mobile";
  }

  let os = "Other";
  if (/windows nt/i.test(s)) os = "Windows";
  else if (/android/i.test(s)) os = "Android";
  else if (/iphone|ipad|ipod/i.test(s)) os = "iOS";
  else if (/mac os x|macintosh/i.test(s)) os = "macOS";
  else if (/cros/i.test(s)) os = "Chrome OS";
  else if (/linux/i.test(s)) os = "Linux";

  let browser = "Other";
  if (/edg\//i.test(s)) browser = "Edge";
  else if (/opr\/|opera/i.test(s)) browser = "Opera";
  else if (/samsungbrowser/i.test(s)) browser = "Samsung Internet";
  else if (/chrome|crios/i.test(s) && !/edg\//i.test(s)) browser = "Chrome";
  else if (/firefox|fxios/i.test(s)) browser = "Firefox";
  else if (/safari/i.test(s) && !/chrome|crios|android/i.test(l)) browser = "Safari";

  return { device, os, browser };
}

const PAID_MEDIUM_RE = /^(cpc|ppc|paid|paid[_-]?social|paid[_-]?search|display|retargeting|remarketing|cpm|cpi|ads?)$/i;

function isPaidMedium(medium: string): boolean {
  return !!medium && PAID_MEDIUM_RE.test(medium);
}

function socialNetworkFromHost(host: string): string | null {
  if (!host) return null;
  if (host.includes("instagram.com") || host === "l.instagram.com") return "instagram";
  if (host.includes("facebook.com") || host.includes("fb.com") || host.includes("m.facebook.com") || host.includes("l.facebook.com")) return "facebook";
  if (host.includes("tiktok.com")) return "tiktok";
  if (host.includes("twitter.com") || host.includes("t.co") || host.includes("x.com")) return "twitter";
  if (host.includes("linkedin.com") || host.includes("lnkd.in")) return "linkedin";
  if (host.includes("pinterest.com") || host.includes("pin.it")) return "pinterest";
  if (host.includes("youtube.com") || host.includes("youtu.be")) return "youtube";
  if (host.includes("whatsapp.com") || host === "wa.me") return "whatsapp";
  if (host.includes("telegram.org") || host.includes("t.me")) return "telegram";
  return null;
}

function searchEngineFromHost(host: string): string | null {
  if (!host) return null;
  if (host.includes("google.")) return "google";
  if (host.includes("bing.com")) return "bing";
  if (host.includes("yandex.")) return "yandex";
  if (host.includes("duckduckgo.com")) return "duckduckgo";
  if (host.includes("yahoo.")) return "yahoo";
  return null;
}

/**
 * Normalize UTM + click ids + referrer into channel taxonomy.
 * Labels distinguish Google Ads vs Organic, Instagram Ads vs Organic, etc.
 */
export function normalizeTrafficSource(input: TrafficSourceInput): NormalizedTrafficSource {
  const utmSource = lower(input.utmSource);
  const utmMedium = lower(input.utmMedium);
  const utmCampaign = typeof input.utmCampaign === "string" ? input.utmCampaign.trim() : "";
  const gclid = !!clip(input.gclid, 200);
  const fbclid = !!clip(input.fbclid, 200);
  const ttclid = !!clip(input.ttclid, 200);
  const msclkid = !!clip(input.msclkid, 200);
  const gbraid = !!clip(input.gbraid, 200);
  const wbraid = !!clip(input.wbraid, 200);
  const host = hostFromReferrer(input.referrer);

  const hasGoogleClick = gclid || gbraid || wbraid;
  const hasMetaClick = fbclid;
  const hasTikTokClick = ttclid;
  const hasMicrosoftClick = msclkid;
  const paidByMedium = isPaidMedium(utmMedium);
  const paidByClick = hasGoogleClick || hasMetaClick || hasTikTokClick || hasMicrosoftClick;
  const isPaid = paidByMedium || paidByClick;

  // --- Paid / Ads ---
  if (hasGoogleClick || (paidByMedium && (utmSource.includes("google") || utmSource === "adwords" || utmSource === "googleads"))) {
    return {
      source: utmSource || "google",
      medium: utmMedium || "cpc",
      channel: "paid_search",
      isPaid: true,
      label: "Google Ads",
    };
  }
  if (hasMicrosoftClick || (paidByMedium && (utmSource.includes("bing") || utmSource.includes("microsoft")))) {
    return {
      source: utmSource || "bing",
      medium: utmMedium || "cpc",
      channel: "paid_search",
      isPaid: true,
      label: "Microsoft Ads",
    };
  }
  if (
    hasMetaClick ||
    (paidByMedium && (utmSource.includes("instagram") || utmSource === "ig" || utmSource.includes("facebook") || utmSource === "fb" || utmSource === "meta"))
  ) {
    const isIg = utmSource.includes("instagram") || utmSource === "ig" || host.includes("instagram");
    return {
      source: utmSource || (isIg ? "instagram" : "facebook"),
      medium: utmMedium || "paid_social",
      channel: "paid_social",
      isPaid: true,
      label: isIg ? "Instagram Ads" : "Facebook Ads",
    };
  }
  if (hasTikTokClick || (paidByMedium && (utmSource.includes("tiktok") || utmSource === "tt"))) {
    return {
      source: utmSource || "tiktok",
      medium: utmMedium || "paid_social",
      channel: "paid_social",
      isPaid: true,
      label: "TikTok Ads",
    };
  }
  if (paidByMedium) {
    const src = utmSource || "paid";
    return {
      source: src,
      medium: utmMedium || "cpc",
      channel: /social|instagram|facebook|tiktok|meta/i.test(src + utmMedium) ? "paid_social" : "paid",
      isPaid: true,
      label: `${src} (Paid)`,
    };
  }

  // --- Organic search ---
  const engine = searchEngineFromHost(host);
  if (engine || utmMedium === "organic") {
    const src = utmSource || engine || "search";
    const pretty =
      src.includes("google") || engine === "google" ? "Google Organic"
      : src.includes("bing") || engine === "bing" ? "Bing Organic"
      : src.includes("yandex") || engine === "yandex" ? "Yandex Organic"
      : "Organic Search";
    return {
      source: src,
      medium: "organic",
      channel: "organic_search",
      isPaid: false,
      label: pretty,
    };
  }

  // --- Organic social (referrer, no paid signals) ---
  const social = socialNetworkFromHost(host);
  const utmSocial =
    utmSource.includes("instagram") || utmSource === "ig" ? "instagram"
    : utmSource.includes("facebook") || utmSource === "fb" || utmSource === "meta" ? "facebook"
    : utmSource.includes("tiktok") || utmSource === "tt" ? "tiktok"
    : utmSource.includes("twitter") || utmSource === "x" ? "twitter"
    : utmMedium === "social" || utmMedium === "organic_social" ? (utmSource || "social")
    : null;
  const socialKey = social || (utmSocial && utmSocial !== "social" ? utmSocial : null) || (utmMedium === "social" || utmMedium === "organic_social" ? utmSource || "social" : null);

  if (socialKey && !isPaid) {
    const prettyMap: Record<string, string> = {
      instagram: "Instagram Organic",
      facebook: "Facebook Organic",
      tiktok: "TikTok Organic",
      twitter: "Twitter/X Organic",
      linkedin: "LinkedIn Organic",
      pinterest: "Pinterest Organic",
      youtube: "YouTube Organic",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
    };
    const label = prettyMap[socialKey] || `${socialKey} Organic`;
    return {
      source: socialKey,
      medium: "organic_social",
      channel: "organic_social",
      isPaid: false,
      label,
    };
  }

  // --- Email / referral / direct ---
  if (utmMedium === "email" || utmSource === "email" || utmSource === "newsletter") {
    return {
      source: utmSource || "email",
      medium: "email",
      channel: "email",
      isPaid: false,
      label: "Email",
    };
  }

  if (utmSource || utmMedium) {
    return {
      source: utmSource || "referral",
      medium: utmMedium || "referral",
      channel: "referral",
      isPaid: false,
      label: utmSource ? `${utmSource}${utmCampaign ? ` / ${utmCampaign}` : ""}` : "Referral",
    };
  }

  if (host) {
    return {
      source: host,
      medium: "referral",
      channel: "referral",
      isPaid: false,
      label: `Referral (${host})`,
    };
  }

  return {
    source: "direct",
    medium: "none",
    channel: "direct",
    isPaid: false,
    label: "Direct",
  };
}

export async function ensureAnalyticsTables(pool: Pool): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS analytics_visitors (
      id TEXT PRIMARY KEY,
      first_seen_at TIMESTAMP NOT NULL DEFAULT NOW(),
      last_seen_at TIMESTAMP NOT NULL DEFAULT NOW(),
      user_id INTEGER,
      first_source TEXT,
      first_medium TEXT,
      first_campaign TEXT,
      first_landing_page TEXT,
      first_referrer TEXT
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS analytics_sessions (
      id TEXT PRIMARY KEY,
      visitor_id TEXT NOT NULL REFERENCES analytics_visitors(id),
      user_id INTEGER,
      started_at TIMESTAMP NOT NULL DEFAULT NOW(),
      last_activity_at TIMESTAMP NOT NULL DEFAULT NOW(),
      landing_page TEXT,
      entry_referrer TEXT,
      utm_source TEXT,
      utm_medium TEXT,
      utm_campaign TEXT,
      utm_content TEXT,
      utm_term TEXT,
      gclid TEXT,
      fbclid TEXT,
      ttclid TEXT,
      gbraid TEXT,
      wbraid TEXT,
      msclkid TEXT,
      source TEXT,
      city TEXT,
      region TEXT,
      country TEXT,
      user_agent TEXT,
      is_bot BOOLEAN NOT NULL DEFAULT false,
      page_count INTEGER NOT NULL DEFAULT 0
    );
  `);

  await pool.query(`ALTER TABLE analytics_sessions ADD COLUMN IF NOT EXISTS device TEXT`);
  await pool.query(`ALTER TABLE analytics_sessions ADD COLUMN IF NOT EXISTS os TEXT`);
  await pool.query(`ALTER TABLE analytics_sessions ADD COLUMN IF NOT EXISTS browser TEXT`);
  await pool.query(`ALTER TABLE analytics_sessions ADD COLUMN IF NOT EXISTS source_label TEXT`);
  await pool.query(`ALTER TABLE analytics_sessions ADD COLUMN IF NOT EXISTS medium_norm TEXT`);
  await pool.query(`ALTER TABLE analytics_sessions ADD COLUMN IF NOT EXISTS is_paid BOOLEAN NOT NULL DEFAULT false`);
  await pool.query(`ALTER TABLE analytics_sessions ADD COLUMN IF NOT EXISTS active_seconds INTEGER NOT NULL DEFAULT 0`);

  await pool.query(`CREATE INDEX IF NOT EXISTS idx_analytics_sessions_visitor ON analytics_sessions(visitor_id);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_analytics_sessions_last ON analytics_sessions(last_activity_at);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_analytics_sessions_source_label ON analytics_sessions(source_label);`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS analytics_events (
      id BIGSERIAL PRIMARY KEY,
      visitor_id TEXT NOT NULL,
      session_id TEXT NOT NULL,
      user_id INTEGER,
      event_name TEXT NOT NULL,
      page_url TEXT,
      referrer TEXT,
      metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON analytics_events(session_id, created_at);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_analytics_events_visitor ON analytics_events(visitor_id, created_at);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_analytics_events_name ON analytics_events(event_name, created_at);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events(created_at);`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS analytics_order_attribution (
      order_id INTEGER PRIMARY KEY,
      visitor_id TEXT,
      session_id TEXT,
      first_source TEXT,
      first_medium TEXT,
      first_campaign TEXT,
      last_source TEXT,
      last_medium TEXT,
      last_campaign TEXT,
      landing_page TEXT,
      gclid TEXT,
      fbclid TEXT,
      ttclid TEXT,
      revenue NUMERIC,
      currency TEXT DEFAULT 'TRY',
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_analytics_order_attr_visitor ON analytics_order_attribution(visitor_id);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_analytics_order_attr_created ON analytics_order_attribution(created_at);`);

  await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS visitor_id TEXT`);
  await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS session_id TEXT`);
}

function clip(s: unknown, max: number): string | null {
  if (typeof s !== "string") return null;
  const t = s.trim();
  if (!t) return null;
  return t.slice(0, max);
}

function asMeta(raw: unknown): Record<string, unknown> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  try {
    const json = JSON.stringify(raw);
    if (json.length > 4000) return { _truncated: true };
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export type AnalyticsIngestInput = {
  visitorId: string;
  sessionId: string;
  eventName: string;
  pageUrl?: string | null;
  referrer?: string | null;
  userId?: number | null;
  metadata?: unknown;
  utm?: {
    source?: string | null;
    medium?: string | null;
    campaign?: string | null;
    content?: string | null;
    term?: string | null;
  };
  clickIds?: {
    gclid?: string | null;
    fbclid?: string | null;
    ttclid?: string | null;
    gbraid?: string | null;
    wbraid?: string | null;
    msclkid?: string | null;
  };
  source?: string | null;
  city?: string | null;
  region?: string | null;
  country?: string | null;
  userAgent?: string | null;
  isBot?: boolean;
};

export type AnalyticsIngestResult =
  | { ok: true; eventId: string }
  | { ok: false; reason: string };

export async function ingestAnalyticsEvent(
  pool: Pool,
  input: AnalyticsIngestInput,
): Promise<AnalyticsIngestResult> {
  if (!ID_RE.test(input.visitorId) || !ID_RE.test(input.sessionId)) {
    return { ok: false, reason: "bad_ids" };
  }
  if (!EVENT_SET.has(input.eventName)) {
    return { ok: false, reason: "bad_event" };
  }

  const pageUrl = clip(input.pageUrl, 500);
  const referrer = clip(input.referrer, 500);
  const meta = asMeta(input.metadata);
  const ua = clip(input.userAgent, 300);
  const userId = typeof input.userId === "number" && Number.isFinite(input.userId) ? input.userId : null;

  const utmSource = clip(input.utm?.source, 100);
  const utmMedium = clip(input.utm?.medium, 100);
  const utmCampaign = clip(input.utm?.campaign, 150);
  const utmContent = clip(input.utm?.content, 150);
  const utmTerm = clip(input.utm?.term, 150);
  const gclid = clip(input.clickIds?.gclid, 200);
  const fbclid = clip(input.clickIds?.fbclid, 200);
  const ttclid = clip(input.clickIds?.ttclid, 200);
  const gbraid = clip(input.clickIds?.gbraid, 200);
  const wbraid = clip(input.clickIds?.wbraid, 200);
  const msclkid = clip(input.clickIds?.msclkid, 200);

  const parsedUa = parseUserAgent(ua);
  const norm = normalizeTrafficSource({
    referrer,
    utmSource,
    utmMedium,
    utmCampaign,
    gclid,
    fbclid,
    ttclid,
    msclkid,
    gbraid,
    wbraid,
  });

  const source = clip(input.source, 80) || norm.label || "Direkt";

  await pool.query(
    `INSERT INTO analytics_visitors (id, first_seen_at, last_seen_at, user_id, first_source, first_medium, first_campaign, first_landing_page, first_referrer)
     VALUES ($1, NOW(), NOW(), $2, $3, $4, $5, $6, $7)
     ON CONFLICT (id) DO UPDATE SET
       last_seen_at = NOW(),
       user_id = COALESCE(EXCLUDED.user_id, analytics_visitors.user_id),
       first_source = COALESCE(analytics_visitors.first_source, EXCLUDED.first_source),
       first_medium = COALESCE(analytics_visitors.first_medium, EXCLUDED.first_medium),
       first_campaign = COALESCE(analytics_visitors.first_campaign, EXCLUDED.first_campaign),
       first_landing_page = COALESCE(analytics_visitors.first_landing_page, EXCLUDED.first_landing_page),
       first_referrer = COALESCE(analytics_visitors.first_referrer, EXCLUDED.first_referrer)`,
    [input.visitorId, userId, norm.source || source, norm.medium || utmMedium, utmCampaign, pageUrl, referrer],
  );

  const pageInc = input.eventName === "page_view" || input.eventName === "category_view" ? 1 : 0;

  await pool.query(
    `INSERT INTO analytics_sessions (
       id, visitor_id, user_id, started_at, last_activity_at, landing_page, entry_referrer,
       utm_source, utm_medium, utm_campaign, utm_content, utm_term,
       gclid, fbclid, ttclid, gbraid, wbraid, msclkid,
       source, city, region, country, user_agent, is_bot, page_count,
       device, os, browser, source_label, medium_norm, is_paid, active_seconds
     ) VALUES (
       $1,$2,$3,NOW(),NOW(),$4,$5,
       $6,$7,$8,$9,$10,
       $11,$12,$13,$14,$15,$16,
       $17,$18,$19,$20,$21,$22,$23,
       $24,$25,$26,$27,$28,$29,0
     )
     ON CONFLICT (id) DO UPDATE SET
       last_activity_at = NOW(),
       user_id = COALESCE(EXCLUDED.user_id, analytics_sessions.user_id),
       page_count = analytics_sessions.page_count + EXCLUDED.page_count,
       city = COALESCE(analytics_sessions.city, EXCLUDED.city),
       region = COALESCE(analytics_sessions.region, EXCLUDED.region),
       country = COALESCE(analytics_sessions.country, EXCLUDED.country),
       device = COALESCE(analytics_sessions.device, EXCLUDED.device),
       os = COALESCE(analytics_sessions.os, EXCLUDED.os),
       browser = COALESCE(analytics_sessions.browser, EXCLUDED.browser),
       source_label = COALESCE(analytics_sessions.source_label, EXCLUDED.source_label),
       medium_norm = COALESCE(analytics_sessions.medium_norm, EXCLUDED.medium_norm),
       is_paid = CASE
         WHEN analytics_sessions.source_label IS NULL THEN EXCLUDED.is_paid
         ELSE analytics_sessions.is_paid
       END`,
    [
      input.sessionId, input.visitorId, userId, pageUrl, referrer,
      utmSource, utmMedium, utmCampaign, utmContent, utmTerm,
      gclid, fbclid, ttclid, gbraid, wbraid, msclkid,
      source, clip(input.city, 80), clip(input.region, 80), clip(input.country, 80),
      ua, !!input.isBot, pageInc,
      parsedUa.device, parsedUa.os, parsedUa.browser,
      norm.label, norm.medium, norm.isPaid,
    ],
  );

  const ins = await pool.query(
    `INSERT INTO analytics_events (visitor_id, session_id, user_id, event_name, page_url, referrer, metadata)
     VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb)
     RETURNING id`,
    [input.visitorId, input.sessionId, userId, input.eventName, pageUrl, referrer, JSON.stringify(meta)],
  );

  return { ok: true, eventId: String(ins.rows[0].id) };
}

/** Heartbeat: bump last_activity and active_seconds by min(elapsed, 70). */
export async function touchAnalyticsHeartbeat(
  pool: Pool,
  visitorId: string,
  sessionId: string,
): Promise<{ ok: true; activeSeconds: number } | { ok: false; reason: string }> {
  if (!ID_RE.test(visitorId) || !ID_RE.test(sessionId)) {
    return { ok: false, reason: "bad_ids" };
  }

  const row = await pool.query(
    `SELECT last_activity_at, active_seconds FROM analytics_sessions WHERE id = $1 AND visitor_id = $2`,
    [sessionId, visitorId],
  );
  if (row.rows.length === 0) {
    return { ok: false, reason: "not_found" };
  }

  const last = row.rows[0].last_activity_at ? new Date(row.rows[0].last_activity_at).getTime() : Date.now();
  const elapsedSec = Math.max(0, Math.floor((Date.now() - last) / 1000));
  const add = Math.min(elapsedSec, 70);

  const upd = await pool.query(
    `UPDATE analytics_sessions
     SET last_activity_at = NOW(),
         active_seconds = COALESCE(active_seconds, 0) + $3
     WHERE id = $1 AND visitor_id = $2
     RETURNING active_seconds`,
    [sessionId, visitorId, add],
  );

  await pool.query(`UPDATE analytics_visitors SET last_seen_at = NOW() WHERE id = $1`, [visitorId]);

  return { ok: true, activeSeconds: Number(upd.rows[0]?.active_seconds ?? 0) };
}

export { ID_RE as ANALYTICS_ID_RE };
