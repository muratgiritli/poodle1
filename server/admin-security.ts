/**
 * Admin security helpers: audit log, password policy, RBAC skeleton.
 * Used by server/routes.ts — keep side-effect free except DB writes.
 */
import type { Pool } from "pg";
import type { Request } from "express";

/**
 * Legacy weak bootstrap password — NEVER use to create new accounts.
 * Kept only to detect / reject accounts still on the old default.
 */
export const LEGACY_DEFAULT_ADMIN_PASSWORD = "jetgo2024";

/** @deprecated Use LEGACY_DEFAULT_ADMIN_PASSWORD — do not create accounts with this. */
export const DEFAULT_ADMIN_PASSWORD = LEGACY_DEFAULT_ADMIN_PASSWORD;

/** Permission strings — extend as features grow. */
export const ADMIN_PERMISSIONS = [
  "products.read",
  "products.write",
  "orders.read",
  "orders.update",
  "customers.read",
  "customers.write",
  "finance.read",
  "club.moderate",
  "settings.write",
  "staff.manage",
  "audit.read",
] as const;

export type AdminPermission = (typeof ADMIN_PERMISSIONS)[number];

export type AdminRole = "super_admin" | "store_manager" | "support" | "content_editor" | "club_moderator" | "finance";

export const ADMIN_ROLES: { id: AdminRole; label: string }[] = [
  { id: "super_admin", label: "Süper Admin" },
  { id: "store_manager", label: "Mağaza Yöneticisi" },
  { id: "support", label: "Destek" },
  { id: "content_editor", label: "İçerik Editörü" },
  { id: "club_moderator", label: "Club Moderatör" },
  { id: "finance", label: "Finans" },
];

const ROLE_PERMISSIONS: Record<AdminRole, readonly AdminPermission[]> = {
  super_admin: ADMIN_PERMISSIONS,
  store_manager: [
    "products.read", "products.write",
    "orders.read", "orders.update",
    "customers.read", "customers.write",
    "finance.read", "settings.write", "audit.read", "club.moderate",
  ],
  support: ["orders.read", "orders.update", "customers.read", "customers.write"],
  content_editor: ["products.read", "products.write", "settings.write"],
  club_moderator: ["club.moderate", "customers.read"],
  finance: ["orders.read", "orders.update", "finance.read", "audit.read", "customers.read"],
};

/** Session helper for routes outside routes.ts (e.g. dogs.ts). */
export function sessionHasPermission(req: Request, perm: AdminPermission): boolean {
  const sess = req.session as any;
  if (!sess?.userId || sess?.isAdmin !== true) return false;
  return roleHasPermission(String(sess.adminRole || "super_admin"), perm);
}

export function permissionsForRole(role: string | null | undefined): AdminPermission[] {
  const r = (role || "super_admin") as AdminRole;
  return [...(ROLE_PERMISSIONS[r] || ROLE_PERMISSIONS.super_admin)];
}

export function roleHasPermission(role: string | null | undefined, perm: AdminPermission): boolean {
  return permissionsForRole(role).includes(perm);
}

export async function ensureAdminSecuritySchema(pool: Pool): Promise<void> {
  await pool.query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'super_admin';
  `);
  await pool.query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN NOT NULL DEFAULT false;
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id SERIAL PRIMARY KEY,
      actor_user_id TEXT,
      actor_username TEXT,
      action TEXT NOT NULL,
      entity_type TEXT,
      entity_id TEXT,
      before_json JSONB,
      after_json JSONB,
      ip TEXT,
      meta JSONB,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);`);

  await pool.query(`
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS admin_note TEXT;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS yp_chat_events (
      id SERIAL PRIMARY KEY,
      customer_id INTEGER,
      ip_hash TEXT,
      is_local BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_yp_chat_events_created ON yp_chat_events(created_at DESC);`);

  await pool.query(`ALTER TABLE yp_articles ADD COLUMN IF NOT EXISTS seo_title TEXT`);
  await pool.query(`ALTER TABLE yp_articles ADD COLUMN IF NOT EXISTS seo_description TEXT`);
  await pool.query(`ALTER TABLE yp_articles ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ`);
  await pool.query(`ALTER TABLE yp_articles ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ`);
  await pool.query(`ALTER TABLE yp_articles ADD COLUMN IF NOT EXISTS related_slugs TEXT`);

  await pool.query(`ALTER TABLE coupons ADD COLUMN IF NOT EXISTS first_order_only BOOLEAN DEFAULT false`);
  await pool.query(`ALTER TABLE coupons ADD COLUMN IF NOT EXISTS max_discount_amount REAL`);
  await pool.query(`ALTER TABLE coupons ADD COLUMN IF NOT EXISTS free_shipping BOOLEAN DEFAULT false`);

  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS critical_stock INTEGER DEFAULT 5`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS order_refunds (
      id SERIAL PRIMARY KEY,
      order_id INTEGER NOT NULL,
      customer_id INTEGER,
      reason TEXT,
      amount NUMERIC(12,2),
      status TEXT NOT NULL DEFAULT 'pending',
      admin_note TEXT,
      resolved_by TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      resolved_at TIMESTAMPTZ
    )
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_order_refunds_status ON order_refunds(status)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_order_refunds_order ON order_refunds(order_id)`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS seo_redirects (
      id SERIAL PRIMARY KEY,
      from_path TEXT NOT NULL UNIQUE,
      to_path TEXT NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

export type AuditInput = {
  actorUserId?: string | null;
  actorUsername?: string | null;
  action: string;
  entityType?: string;
  entityId?: string | number | null;
  before?: unknown;
  after?: unknown;
  ip?: string | null;
  meta?: unknown;
};

export async function writeAuditLog(pool: Pool, input: AuditInput): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO audit_logs
        (actor_user_id, actor_username, action, entity_type, entity_id, before_json, after_json, ip, meta)
       VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7::jsonb,$8,$9::jsonb)`,
      [
        input.actorUserId ?? null,
        input.actorUsername ?? null,
        input.action,
        input.entityType ?? null,
        input.entityId != null ? String(input.entityId) : null,
        input.before != null ? JSON.stringify(input.before) : null,
        input.after != null ? JSON.stringify(input.after) : null,
        input.ip ?? null,
        input.meta != null ? JSON.stringify(input.meta) : null,
      ],
    );
  } catch (e) {
    console.error("[audit] write failed:", (e as Error)?.message);
  }
}

export function auditActorFromReq(req: Request): { userId?: string; username?: string; ip?: string } {
  const sess = req.session as any;
  return {
    userId: sess?.userId ? String(sess.userId) : undefined,
    username: sess?.adminUsername ? String(sess.adminUsername) : undefined,
    ip: req.ip || undefined,
  };
}
