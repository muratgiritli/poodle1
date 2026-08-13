/**
 * First-party analytics report queries (admin + order attribution).
 */
import type { Pool } from "pg";
import { ANALYTICS_ID_RE } from "./first-party-analytics";

const SESSION_BOUNDS = `
  s.started_at >= ($1::date::timestamp AT TIME ZONE 'Europe/Istanbul')
  AND s.started_at < (($2::date + 1)::timestamp AT TIME ZONE 'Europe/Istanbul')
`;

const EVENT_BOUNDS = `
  e.created_at >= ($1::date::timestamp AT TIME ZONE 'Europe/Istanbul')
  AND e.created_at < (($2::date + 1)::timestamp AT TIME ZONE 'Europe/Istanbul')
`;

const ATTR_BOUNDS = `
  a.created_at >= ($1::date::timestamp AT TIME ZONE 'Europe/Istanbul')
  AND a.created_at < (($2::date + 1)::timestamp AT TIME ZONE 'Europe/Istanbul')
`;

function isDateStr(s: unknown): s is string {
  return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
}

export function clampDateRange(fromDate: string, toDate: string): { from: string; to: string } {
  let from = isDateStr(fromDate) ? fromDate : new Date().toISOString().slice(0, 10);
  let to = isDateStr(toDate) ? toDate : from;
  if (from > to) {
    const t = from;
    from = to;
    to = t;
  }
  return { from, to };
}

export async function getRealtimeSessions(pool: Pool, minutes = 5) {
  const mins = Math.max(1, Math.min(120, Math.floor(Number(minutes) || 5)));
  const q = await pool.query(
    `SELECT
       s.id AS session_id,
       s.visitor_id,
       s.landing_page,
       s.source_label,
       s.medium_norm,
       s.is_paid,
       s.device,
       s.os,
       s.browser,
       s.city,
       s.country,
       s.page_count,
       s.active_seconds,
       s.started_at,
       s.last_activity_at,
       s.user_id
     FROM analytics_sessions s
     WHERE s.last_activity_at >= NOW() - ($1::int * INTERVAL '1 minute')
       AND COALESCE(s.is_bot, false) = false
     ORDER BY s.last_activity_at DESC
     LIMIT 200`,
    [mins],
  );
  const countQ = await pool.query(
    `SELECT COUNT(*)::int AS n
     FROM analytics_sessions s
     WHERE s.last_activity_at >= NOW() - ($1::int * INTERVAL '1 minute')
       AND COALESCE(s.is_bot, false) = false`,
    [mins],
  );
  return {
    minutes: mins,
    activeSessions: countQ.rows[0]?.n ?? 0,
    sessions: q.rows,
  };
}

export async function getOverview(pool: Pool, fromDate: string, toDate: string) {
  const { from, to } = clampDateRange(fromDate, toDate);
  const params = [from, to];

  const visitorsQ = await pool.query(
    `SELECT COUNT(DISTINCT s.visitor_id)::int AS visitors,
            COUNT(*)::int AS sessions,
            COALESCE(SUM(s.page_count), 0)::int AS pageviews,
            COALESCE(SUM(s.active_seconds), 0)::int AS active_seconds
     FROM analytics_sessions s
     WHERE ${SESSION_BOUNDS}
       AND COALESCE(s.is_bot, false) = false`,
    params,
  );

  const eventsQ = await pool.query(
    `SELECT
       COUNT(*) FILTER (WHERE e.event_name = 'page_view')::int AS page_views,
       COUNT(*) FILTER (WHERE e.event_name = 'product_view')::int AS product_views,
       COUNT(*) FILTER (WHERE e.event_name = 'add_to_cart')::int AS add_to_carts,
       COUNT(*) FILTER (WHERE e.event_name = 'begin_checkout')::int AS begin_checkouts,
       COUNT(*) FILTER (WHERE e.event_name = 'purchase')::int AS purchases
     FROM analytics_events e
     JOIN analytics_sessions s ON s.id = e.session_id
     WHERE ${EVENT_BOUNDS}
       AND COALESCE(s.is_bot, false) = false`,
    params,
  );

  const ordersQ = await pool.query(
    `SELECT COUNT(*)::int AS orders_attributed,
            COALESCE(SUM(a.revenue), 0)::float AS revenue
     FROM analytics_order_attribution a
     WHERE ${ATTR_BOUNDS}`,
    params,
  );

  const topSourcesQ = await pool.query(
    `SELECT COALESCE(s.source_label, s.source, 'Direct') AS source_label,
            COALESCE(s.medium_norm, 'none') AS medium_norm,
            BOOL_OR(COALESCE(s.is_paid, false)) AS is_paid,
            COUNT(*)::int AS sessions,
            COUNT(DISTINCT s.visitor_id)::int AS visitors
     FROM analytics_sessions s
     WHERE ${SESSION_BOUNDS}
       AND COALESCE(s.is_bot, false) = false
     GROUP BY 1, 2
     ORDER BY sessions DESC
     LIMIT 15`,
    params,
  );

  const devicesQ = await pool.query(
    `SELECT COALESCE(s.device, 'desktop') AS device, COUNT(*)::int AS sessions
     FROM analytics_sessions s
     WHERE ${SESSION_BOUNDS}
       AND COALESCE(s.is_bot, false) = false
     GROUP BY 1
     ORDER BY sessions DESC`,
    params,
  );

  const v = visitorsQ.rows[0] || {};
  const e = eventsQ.rows[0] || {};
  const o = ordersQ.rows[0] || {};

  return {
    from,
    to,
    visitors: v.visitors ?? 0,
    sessions: v.sessions ?? 0,
    pageviews: e.page_views ?? v.pageviews ?? 0,
    activeSeconds: v.active_seconds ?? 0,
    productViews: e.product_views ?? 0,
    addToCarts: e.add_to_carts ?? 0,
    beginCheckouts: e.begin_checkouts ?? 0,
    purchases: e.purchases ?? 0,
    ordersAttributed: o.orders_attributed ?? 0,
    revenue: Number(o.revenue ?? 0),
    topSources: topSourcesQ.rows,
    devices: devicesQ.rows,
  };
}

export async function getVisitorsList(
  pool: Pool,
  fromDate: string,
  toDate: string,
  limit = 50,
) {
  const { from, to } = clampDateRange(fromDate, toDate);
  const lim = Math.max(1, Math.min(500, Math.floor(Number(limit) || 50)));
  const q = await pool.query(
    `SELECT
       v.id AS visitor_id,
       v.first_seen_at,
       v.last_seen_at,
       v.user_id,
       v.first_source,
       v.first_medium,
       v.first_campaign,
       v.first_landing_page,
       COUNT(DISTINCT s.id)::int AS session_count,
       COALESCE(SUM(s.page_count), 0)::int AS pageviews,
       COALESCE(SUM(s.active_seconds), 0)::int AS active_seconds,
       (
         SELECT s2.source_label FROM analytics_sessions s2
         WHERE s2.visitor_id = v.id
         ORDER BY s2.started_at DESC NULLS LAST
         LIMIT 1
       ) AS last_source_label
     FROM analytics_visitors v
     JOIN analytics_sessions s ON s.visitor_id = v.id
     WHERE s.started_at >= ($1::date::timestamp AT TIME ZONE 'Europe/Istanbul')
       AND s.started_at < (($2::date + 1)::timestamp AT TIME ZONE 'Europe/Istanbul')
       AND COALESCE(s.is_bot, false) = false
     GROUP BY v.id
     ORDER BY MAX(s.last_activity_at) DESC
     LIMIT $3`,
    [from, to, lim],
  );
  return { from, to, limit: lim, visitors: q.rows };
}

export async function getVisitorDetail(pool: Pool, visitorId: string) {
  if (!ANALYTICS_ID_RE.test(visitorId)) return null;

  const vQ = await pool.query(`SELECT * FROM analytics_visitors WHERE id = $1`, [visitorId]);
  if (vQ.rows.length === 0) return null;

  const sessionsQ = await pool.query(
    `SELECT id, started_at, last_activity_at, landing_page, source_label, medium_norm, is_paid,
            device, os, browser, city, country, page_count, active_seconds, utm_campaign, utm_source
     FROM analytics_sessions
     WHERE visitor_id = $1
     ORDER BY started_at DESC
     LIMIT 100`,
    [visitorId],
  );

  const eventsQ = await pool.query(
    `SELECT id, session_id, event_name, page_url, metadata, created_at
     FROM analytics_events
     WHERE visitor_id = $1
     ORDER BY created_at DESC
     LIMIT 200`,
    [visitorId],
  );

  const ordersQ = await pool.query(
    `SELECT * FROM analytics_order_attribution WHERE visitor_id = $1 ORDER BY created_at DESC LIMIT 50`,
    [visitorId],
  );

  return {
    visitor: vQ.rows[0],
    sessions: sessionsQ.rows,
    events: eventsQ.rows,
    orders: ordersQ.rows,
  };
}

export async function getSessionTimeline(pool: Pool, sessionId: string) {
  if (!ANALYTICS_ID_RE.test(sessionId)) return null;

  const sQ = await pool.query(`SELECT * FROM analytics_sessions WHERE id = $1`, [sessionId]);
  if (sQ.rows.length === 0) return null;

  const eventsQ = await pool.query(
    `SELECT id, event_name, page_url, referrer, metadata, created_at, user_id
     FROM analytics_events
     WHERE session_id = $1
     ORDER BY created_at ASC
     LIMIT 500`,
    [sessionId],
  );

  return {
    session: sQ.rows[0],
    events: eventsQ.rows,
  };
}

export async function getTrafficSources(pool: Pool, fromDate: string, toDate: string) {
  const { from, to } = clampDateRange(fromDate, toDate);
  const params = [from, to];

  const q = await pool.query(
    `SELECT
       COALESCE(s.source_label, s.source, 'Direct') AS source_label,
       COALESCE(s.medium_norm, 'none') AS medium,
       COALESCE(s.is_paid, false) AS is_paid,
       COUNT(*)::int AS sessions,
       COUNT(DISTINCT s.visitor_id)::int AS visitors,
       COALESCE(SUM(s.page_count), 0)::int AS pageviews,
       COALESCE(SUM(s.active_seconds), 0)::int AS active_seconds,
       COUNT(DISTINCT a.order_id)::int AS orders,
       COALESCE(SUM(a.revenue), 0)::float AS revenue
     FROM analytics_sessions s
     LEFT JOIN analytics_order_attribution a
       ON a.session_id = s.id
     WHERE ${SESSION_BOUNDS}
       AND COALESCE(s.is_bot, false) = false
     GROUP BY 1, 2, 3
     ORDER BY sessions DESC
     LIMIT 100`,
    params,
  );

  return { from, to, sources: q.rows };
}

export async function getCampaigns(pool: Pool, fromDate: string, toDate: string) {
  const { from, to } = clampDateRange(fromDate, toDate);
  const params = [from, to];

  const q = await pool.query(
    `SELECT
       COALESCE(NULLIF(TRIM(s.utm_campaign), ''), '(none)') AS campaign,
       COALESCE(s.utm_source, '') AS utm_source,
       COALESCE(s.utm_medium, '') AS utm_medium,
       COALESCE(s.source_label, 'Direct') AS source_label,
       COALESCE(s.is_paid, false) AS is_paid,
       COUNT(*)::int AS sessions,
       COUNT(DISTINCT s.visitor_id)::int AS visitors,
       COUNT(DISTINCT a.order_id)::int AS orders,
       COALESCE(SUM(a.revenue), 0)::float AS revenue
     FROM analytics_sessions s
     LEFT JOIN analytics_order_attribution a ON a.session_id = s.id
     WHERE ${SESSION_BOUNDS}
       AND COALESCE(s.is_bot, false) = false
       AND (
         NULLIF(TRIM(s.utm_campaign), '') IS NOT NULL
         OR COALESCE(s.is_paid, false) = true
         OR s.gclid IS NOT NULL OR s.fbclid IS NOT NULL OR s.ttclid IS NOT NULL
       )
     GROUP BY 1, 2, 3, 4, 5
     ORDER BY sessions DESC
     LIMIT 100`,
    params,
  );

  return { from, to, campaigns: q.rows };
}

const FUNNEL_STEPS = [
  "session_start",
  "page_view",
  "product_view",
  "add_to_cart",
  "begin_checkout",
  "purchase",
] as const;

export async function getFunnel(
  pool: Pool,
  fromDate: string,
  toDate: string,
  sourceFilter?: string | null,
) {
  const { from, to } = clampDateRange(fromDate, toDate);
  const hasSource = typeof sourceFilter === "string" && sourceFilter.trim().length > 0;

  const q2 = await pool.query(
    hasSource
      ? `SELECT e.event_name, COUNT(DISTINCT e.session_id)::int AS sessions
         FROM analytics_events e
         JOIN analytics_sessions s ON s.id = e.session_id
         WHERE e.created_at >= ($1::date::timestamp AT TIME ZONE 'Europe/Istanbul')
           AND e.created_at < (($2::date + 1)::timestamp AT TIME ZONE 'Europe/Istanbul')
           AND COALESCE(s.is_bot, false) = false
           AND e.event_name = ANY($3::text[])
           AND (s.source_label = $4 OR s.source = $4 OR s.utm_source = $4)
         GROUP BY e.event_name`
      : `SELECT e.event_name, COUNT(DISTINCT e.session_id)::int AS sessions
         FROM analytics_events e
         JOIN analytics_sessions s ON s.id = e.session_id
         WHERE e.created_at >= ($1::date::timestamp AT TIME ZONE 'Europe/Istanbul')
           AND e.created_at < (($2::date + 1)::timestamp AT TIME ZONE 'Europe/Istanbul')
           AND COALESCE(s.is_bot, false) = false
           AND e.event_name = ANY($3::text[])
         GROUP BY e.event_name`,
    hasSource ? [from, to, [...FUNNEL_STEPS], sourceFilter!.trim()] : [from, to, [...FUNNEL_STEPS]],
  );

  const byName = new Map<string, number>();
  for (const r of q2.rows) byName.set(r.event_name, r.sessions);

  const steps = FUNNEL_STEPS.map((name, i) => {
    const sessions = byName.get(name) ?? 0;
    const prev = i === 0 ? sessions : (byName.get(FUNNEL_STEPS[i - 1]) ?? 0);
    return {
      step: name,
      sessions,
      conversionFromPrev: prev > 0 ? Math.round((sessions / prev) * 10000) / 100 : null,
    };
  });

  return {
    from,
    to,
    sourceFilter: hasSource ? sourceFilter!.trim() : null,
    steps,
  };
}

export async function getProductAnalytics(pool: Pool, fromDate: string, toDate: string) {
  const { from, to } = clampDateRange(fromDate, toDate);
  const params = [from, to];

  const q = await pool.query(
    `SELECT
       COALESCE(e.metadata->>'product_id', '(unknown)') AS product_id,
       MAX(e.metadata->>'product_name') AS product_name,
       COUNT(*) FILTER (WHERE e.event_name = 'product_view')::int AS views,
       COUNT(*) FILTER (WHERE e.event_name = 'add_to_cart')::int AS add_to_carts,
       COUNT(*) FILTER (WHERE e.event_name = 'remove_from_cart')::int AS remove_from_carts,
       COUNT(DISTINCT e.session_id)::int AS sessions
     FROM analytics_events e
     JOIN analytics_sessions s ON s.id = e.session_id
     WHERE ${EVENT_BOUNDS}
       AND COALESCE(s.is_bot, false) = false
       AND e.event_name IN ('product_view', 'add_to_cart', 'remove_from_cart')
       AND e.metadata->>'product_id' IS NOT NULL
     GROUP BY 1
     ORDER BY views DESC, add_to_carts DESC
     LIMIT 100`,
    params,
  );

  return { from, to, products: q.rows };
}

export type AttributeOrderInput = {
  orderId: number;
  visitorId?: string | null;
  sessionId?: string | null;
  revenue?: number | null;
  currency?: string | null;
};

/**
 * First-touch from visitor + last-touch from session; ON CONFLICT DO NOTHING.
 */
export async function attributeOrder(pool: Pool, input: AttributeOrderInput) {
  const orderId = Math.floor(Number(input.orderId));
  if (!Number.isFinite(orderId) || orderId <= 0) {
    return { ok: false as const, reason: "bad_order" };
  }

  let visitorId = typeof input.visitorId === "string" && ANALYTICS_ID_RE.test(input.visitorId) ? input.visitorId : null;
  let sessionId = typeof input.sessionId === "string" && ANALYTICS_ID_RE.test(input.sessionId) ? input.sessionId : null;

  if (!visitorId || !sessionId) {
    const ord = await pool.query(
      `SELECT visitor_id, session_id, grand_total FROM orders WHERE id = $1`,
      [orderId],
    );
    if (ord.rows.length === 0) return { ok: false as const, reason: "order_not_found" };
    if (!visitorId && ord.rows[0].visitor_id && ANALYTICS_ID_RE.test(ord.rows[0].visitor_id)) {
      visitorId = ord.rows[0].visitor_id;
    }
    if (!sessionId && ord.rows[0].session_id && ANALYTICS_ID_RE.test(ord.rows[0].session_id)) {
      sessionId = ord.rows[0].session_id;
    }
    if (input.revenue == null && ord.rows[0].grand_total != null) {
      input.revenue = Number(ord.rows[0].grand_total);
    }
  }

  if (!visitorId && !sessionId) {
    return { ok: false as const, reason: "no_attribution_ids" };
  }

  let session: Record<string, unknown> | null = null;
  if (sessionId) {
    const sQ = await pool.query(`SELECT * FROM analytics_sessions WHERE id = $1`, [sessionId]);
    session = sQ.rows[0] || null;
    if (session && !visitorId && typeof session.visitor_id === "string") {
      visitorId = session.visitor_id;
    }
  }

  let visitor: Record<string, unknown> | null = null;
  if (visitorId) {
    const vQ = await pool.query(`SELECT * FROM analytics_visitors WHERE id = $1`, [visitorId]);
    visitor = vQ.rows[0] || null;
  }

  if (!session && visitorId) {
    const lastS = await pool.query(
      `SELECT * FROM analytics_sessions WHERE visitor_id = $1 ORDER BY last_activity_at DESC LIMIT 1`,
      [visitorId],
    );
    session = lastS.rows[0] || null;
    if (session && typeof session.id === "string") sessionId = session.id;
  }

  const revenue = input.revenue != null && Number.isFinite(Number(input.revenue)) ? Number(input.revenue) : null;
  const currency = (typeof input.currency === "string" && input.currency.trim()) || "TRY";

  const firstSource = (visitor?.first_source as string) || (session?.source as string) || (session?.source_label as string) || null;
  const firstMedium = (visitor?.first_medium as string) || (session?.medium_norm as string) || (session?.utm_medium as string) || null;
  const firstCampaign = (visitor?.first_campaign as string) || (session?.utm_campaign as string) || null;

  const lastSource = (session?.source_label as string) || (session?.source as string) || (session?.utm_source as string) || null;
  const lastMedium = (session?.medium_norm as string) || (session?.utm_medium as string) || null;
  const lastCampaign = (session?.utm_campaign as string) || null;

  const landingPage = (session?.landing_page as string) || (visitor?.first_landing_page as string) || null;
  const gclid = (session?.gclid as string) || null;
  const fbclid = (session?.fbclid as string) || null;
  const ttclid = (session?.ttclid as string) || null;

  const ins = await pool.query(
    `INSERT INTO analytics_order_attribution (
       order_id, visitor_id, session_id,
       first_source, first_medium, first_campaign,
       last_source, last_medium, last_campaign,
       landing_page, gclid, fbclid, ttclid,
       revenue, currency, created_at
     ) VALUES (
       $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,NOW()
     )
     ON CONFLICT (order_id) DO NOTHING
     RETURNING order_id`,
    [
      orderId, visitorId, sessionId,
      firstSource, firstMedium, firstCampaign,
      lastSource, lastMedium, lastCampaign,
      landingPage, gclid, fbclid, ttclid,
      revenue, currency,
    ],
  );

  return {
    ok: true as const,
    inserted: (ins.rowCount ?? 0) > 0,
    orderId,
    visitorId,
    sessionId,
  };
}

/** Convenience for payment callbacks — loads revenue from order. */
export async function attributeOrderById(pool: Pool, orderId: number) {
  try {
    return await attributeOrder(pool, { orderId });
  } catch (e) {
    console.error("attributeOrderById error:", e);
    return { ok: false as const, reason: "error" };
  }
}
