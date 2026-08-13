/**
 * Shared OTP + rate-limit store.
 * Prefers Redis (RATE_LIMIT_REDIS_URL | REDIS_URL); falls back to Postgres so
 * multi-instance deploys stay correct without Redis. Memory is last resort.
 */
import type { Pool } from "pg";
import Redis from "ioredis";

export type OtpEntry = { code: string; expiresAt: number; attempts: number };

let pool: Pool | null = null;
let redis: Redis | null = null;
let redisTried = false;
let pgReady = false;

const memOtp = new Map<string, OtpEntry>();
const memRl = new Map<string, { count: number; resetAt: number }>();
const memLogin = new Map<string, { count: number; blockedUntil: number }>();

export function initSharedLimits(p: Pool): void {
  pool = p;
  ensurePgTables().catch((e) => console.warn("[shared-limits] pg init:", (e as Error)?.message));
  ensureRedis();
}

function ensureRedis(): Redis | null {
  if (redisTried) return redis;
  redisTried = true;
  const url = (process.env.RATE_LIMIT_REDIS_URL || process.env.REDIS_URL || "").trim();
  if (!url) return null;
  try {
    redis = new Redis(url, {
      maxRetriesPerRequest: 1,
      enableReadyCheck: true,
      lazyConnect: false,
      connectTimeout: 3000,
    });
    redis.on("error", (err) => {
      console.warn("[shared-limits] redis error:", err?.message || err);
    });
    console.info("[shared-limits] Redis connected for OTP/rate limits");
    return redis;
  } catch (e: any) {
    console.warn("[shared-limits] Redis unavailable, using Postgres/memory:", e?.message);
    redis = null;
    return null;
  }
}

async function ensurePgTables(): Promise<void> {
  if (!pool) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS otp_codes (
      phone TEXT PRIMARY KEY,
      code TEXT NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      attempts INT NOT NULL DEFAULT 0
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS rate_limit_counters (
      key TEXT PRIMARY KEY,
      count INT NOT NULL DEFAULT 0,
      reset_at TIMESTAMPTZ NOT NULL
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS login_attempt_counters (
      key TEXT PRIMARY KEY,
      count INT NOT NULL DEFAULT 0,
      blocked_until TIMESTAMPTZ
    )
  `);
  pgReady = true;
}

/** true = limited (should reject) */
export async function rateLimitHit(key: string, maxRequests: number, windowMs: number): Promise<boolean> {
  const r = ensureRedis();
  if (r) {
    try {
      const rk = `rl:${key}`;
      const n = await r.incr(rk);
      if (n === 1) await r.pexpire(rk, windowMs);
      return n > maxRequests;
    } catch {
      /* fall through */
    }
  }
  if (pool && pgReady) {
    try {
      const { rows } = await pool.query(
        `INSERT INTO rate_limit_counters (key, count, reset_at)
         VALUES ($1, 1, NOW() + ($2::text || ' milliseconds')::interval)
         ON CONFLICT (key) DO UPDATE SET
           count = CASE WHEN rate_limit_counters.reset_at <= NOW() THEN 1 ELSE rate_limit_counters.count + 1 END,
           reset_at = CASE WHEN rate_limit_counters.reset_at <= NOW()
             THEN NOW() + ($2::text || ' milliseconds')::interval
             ELSE rate_limit_counters.reset_at END
         RETURNING count`,
        [key, String(windowMs)],
      );
      return Number(rows[0]?.count || 0) > maxRequests;
    } catch {
      /* fall through */
    }
  }
  const now = Date.now();
  const entry = memRl.get(key);
  if (!entry || entry.resetAt <= now) {
    memRl.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  entry.count++;
  return entry.count > maxRequests;
}

export async function otpSet(phone: string, entry: OtpEntry): Promise<void> {
  const ttlMs = Math.max(1000, entry.expiresAt - Date.now());
  const r = ensureRedis();
  if (r) {
    try {
      await r.set(`otp:${phone}`, JSON.stringify(entry), "PX", ttlMs);
      return;
    } catch { /* fall */ }
  }
  if (pool && pgReady) {
    try {
      await pool.query(
        `INSERT INTO otp_codes (phone, code, expires_at, attempts)
         VALUES ($1, $2, to_timestamp($3 / 1000.0), $4)
         ON CONFLICT (phone) DO UPDATE SET code = $2, expires_at = to_timestamp($3 / 1000.0), attempts = $4`,
        [phone, entry.code, entry.expiresAt, entry.attempts],
      );
      return;
    } catch { /* fall */ }
  }
  memOtp.set(phone, entry);
}

export async function otpGet(phone: string): Promise<OtpEntry | null> {
  const r = ensureRedis();
  if (r) {
    try {
      const raw = await r.get(`otp:${phone}`);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as OtpEntry;
      if (parsed.expiresAt < Date.now()) {
        await r.del(`otp:${phone}`);
        return null;
      }
      return parsed;
    } catch { /* fall */ }
  }
  if (pool && pgReady) {
    try {
      const { rows } = await pool.query(
        `SELECT code, EXTRACT(EPOCH FROM expires_at) * 1000 AS expires_at, attempts
         FROM otp_codes WHERE phone = $1 AND expires_at > NOW()`,
        [phone],
      );
      if (!rows[0]) return null;
      return {
        code: String(rows[0].code),
        expiresAt: Number(rows[0].expires_at),
        attempts: Number(rows[0].attempts) || 0,
      };
    } catch { /* fall */ }
  }
  const m = memOtp.get(phone);
  if (!m || m.expiresAt < Date.now()) {
    memOtp.delete(phone);
    return null;
  }
  return m;
}

export async function otpDelete(phone: string): Promise<void> {
  const r = ensureRedis();
  if (r) {
    try { await r.del(`otp:${phone}`); } catch { /* ignore */ }
  }
  if (pool && pgReady) {
    try { await pool.query(`DELETE FROM otp_codes WHERE phone = $1`, [phone]); } catch { /* ignore */ }
  }
  memOtp.delete(phone);
}

export async function otpSendCountGet(phone: string): Promise<{ count: number; resetAt: number } | null> {
  const key = `otp_send:${phone}`;
  const r = ensureRedis();
  if (r) {
    try {
      const raw = await r.get(key);
      if (!raw) return null;
      return JSON.parse(raw) as { count: number; resetAt: number };
    } catch { /* fall */ }
  }
  if (pool && pgReady) {
    try {
      const { rows } = await pool.query(
        `SELECT count, EXTRACT(EPOCH FROM reset_at) * 1000 AS reset_at
         FROM rate_limit_counters WHERE key = $1`,
        [key],
      );
      if (!rows[0]) return null;
      const resetAt = Number(rows[0].reset_at);
      if (resetAt <= Date.now()) return null;
      return { count: Number(rows[0].count) || 0, resetAt };
    } catch { /* fall */ }
  }
  const m = memRl.get(key);
  if (!m || m.resetAt <= Date.now()) return null;
  return { count: m.count, resetAt: m.resetAt };
}

export async function otpSendCountIncr(phone: string, dayMs: number): Promise<void> {
  const key = `otp_send:${phone}`;
  const cur = await otpSendCountGet(phone);
  const next = cur
    ? { count: cur.count + 1, resetAt: cur.resetAt }
    : { count: 1, resetAt: Date.now() + dayMs };
  const r = ensureRedis();
  if (r) {
    try {
      const ttl = Math.max(1000, next.resetAt - Date.now());
      await r.set(key, JSON.stringify(next), "PX", ttl);
      return;
    } catch { /* fall */ }
  }
  if (pool && pgReady) {
    try {
      await pool.query(
        `INSERT INTO rate_limit_counters (key, count, reset_at)
         VALUES ($1, $2, to_timestamp($3 / 1000.0))
         ON CONFLICT (key) DO UPDATE SET count = $2, reset_at = to_timestamp($3 / 1000.0)`,
        [key, next.count, next.resetAt],
      );
      return;
    } catch { /* fall */ }
  }
  memRl.set(key, next);
}

export async function loginAttemptGet(key: string): Promise<{ count: number; blockedUntil: number } | null> {
  const r = ensureRedis();
  if (r) {
    try {
      const raw = await r.get(`la:${key}`);
      if (!raw) return null;
      return JSON.parse(raw) as { count: number; blockedUntil: number };
    } catch { /* fall */ }
  }
  if (pool && pgReady) {
    try {
      const { rows } = await pool.query(
        `SELECT count,
                COALESCE(EXTRACT(EPOCH FROM blocked_until) * 1000, 0) AS blocked_until
         FROM login_attempt_counters WHERE key = $1`,
        [key],
      );
      if (!rows[0]) return null;
      return { count: Number(rows[0].count) || 0, blockedUntil: Number(rows[0].blocked_until) || 0 };
    } catch { /* fall */ }
  }
  return memLogin.get(key) || null;
}

export async function loginAttemptSet(key: string, count: number, blockedUntil: number): Promise<void> {
  const ttlMs = blockedUntil > Date.now() ? blockedUntil - Date.now() : 30 * 60 * 1000;
  const r = ensureRedis();
  if (r) {
    try {
      await r.set(`la:${key}`, JSON.stringify({ count, blockedUntil }), "PX", Math.max(ttlMs, 60_000));
      return;
    } catch { /* fall */ }
  }
  if (pool && pgReady) {
    try {
      await pool.query(
        `INSERT INTO login_attempt_counters (key, count, blocked_until)
         VALUES ($1, $2, CASE WHEN $3::bigint > 0 THEN to_timestamp($3 / 1000.0) ELSE NULL END)
         ON CONFLICT (key) DO UPDATE SET count = $2,
           blocked_until = CASE WHEN $3::bigint > 0 THEN to_timestamp($3 / 1000.0) ELSE NULL END`,
        [key, count, blockedUntil],
      );
      return;
    } catch { /* fall */ }
  }
  memLogin.set(key, { count, blockedUntil });
}

export async function loginAttemptClear(key: string): Promise<void> {
  const r = ensureRedis();
  if (r) {
    try { await r.del(`la:${key}`); } catch { /* ignore */ }
  }
  if (pool && pgReady) {
    try { await pool.query(`DELETE FROM login_attempt_counters WHERE key = $1`, [key]); } catch { /* ignore */ }
  }
  memLogin.delete(key);
}

export function sharedLimitsBackend(): "redis" | "postgres" | "memory" {
  if (redis) return "redis";
  if (pgReady) return "postgres";
  return "memory";
}
