/**
 * Idempotent bulk seed for kuru mama catalog (Mama Bul + SEO).
 * Reads server/kuru_mama_catalog.json and upserts by barcode.
 */
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { pool } from "./storage";
import { downloadAndSaveImage } from "./image-service";

type CatalogProduct = {
  barcode: string;
  name: string;
  brandName: string;
  brandSlug: string;
  price: number;
  originalPrice?: number;
  img?: string | null;
  stock?: number;
  mamaType: string;
  longDescription?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  mamaMetadata?: Record<string, unknown>;
};

function loadCatalog(): CatalogProduct[] {
  const candidates = [
    join(process.cwd(), "server", "kuru_mama_catalog.json"),
    join(process.cwd(), "kuru_mama_catalog.json"),
    "/app/server/kuru_mama_catalog.json",
  ];
  for (const p of candidates) {
    try {
      if (!existsSync(p)) continue;
      const raw = JSON.parse(readFileSync(p, "utf8"));
      if (Array.isArray(raw?.products)) return raw.products as CatalogProduct[];
    } catch (e: any) {
      console.warn("[seedBulkKuruMama] read failed", p, e?.message);
    }
  }
  console.warn("[seedBulkKuruMama] kuru_mama_catalog.json not found — skip");
  return [];
}

async function ensureBrand(brandName: string, brandSlug: string): Promise<number> {
  // Dry-food catalog belongs under kopek-kuru-mama (shown on /kuru-mama).
  const subcategory = "kopek-kuru-mama";
  const existing = await pool.query(
    `SELECT id FROM brand_categories
     WHERE brand_slug = $1 AND animal = 'kopek' AND subcategory = $2
     LIMIT 1`,
    [brandSlug, subcategory],
  );
  if (existing.rows[0]) return existing.rows[0].id as number;

  // Migrate legacy odul-kemik brand rows created by older seeds.
  const legacy = await pool.query(
    `UPDATE brand_categories
     SET subcategory = $2
     WHERE brand_slug = $1 AND animal = 'kopek' AND subcategory = 'odul-kemik'
     RETURNING id`,
    [brandSlug, subcategory],
  );
  if (legacy.rows[0]) return legacy.rows[0].id as number;

  const ins = await pool.query(
    `INSERT INTO brand_categories (brand_name, brand_slug, animal, subcategory)
     VALUES ($1, $2, 'kopek', $3)
     RETURNING id`,
    [brandName, brandSlug, subcategory],
  );
  return ins.rows[0].id as number;
}

export async function seedBulkKuruMama(): Promise<void> {
  try {
    await seedBulkKuruMamaInner();
  } catch (e: any) {
    console.error("[seedBulkKuruMama] failed:", e?.message || e);
  }
}

async function seedBulkKuruMamaInner(): Promise<void> {
  const products = loadCatalog();
  if (!products.length) return;

  // One-shot migration: older seeds put dry food under odul-kemik.
  await pool.query(`
    UPDATE brand_categories
    SET subcategory = 'kopek-kuru-mama'
    WHERE animal = 'kopek' AND subcategory = 'odul-kemik'
  `);

  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS mama_metadata JSONB`);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_title text`);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_description text`);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_keywords text`);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS long_description text`);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS mama_type text`);

  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (const p of products) {
    if (!p.barcode || !p.name) continue;
    try {
      const brandId = await ensureBrand(p.brandName, p.brandSlug);
      const metaJson = JSON.stringify(p.mamaMetadata || {});
      const img = p.img || null;

      const existing = await pool.query(
        `SELECT id, img FROM products
         WHERE barcode = $1
            OR (name = $2 AND brand_category_id = $3)
         ORDER BY CASE WHEN barcode = $1 THEN 0 ELSE 1 END
         LIMIT 1`,
        [p.barcode, p.name, brandId],
      );

      if (existing.rows[0]) {
        await pool.query(
          `UPDATE products SET
            barcode = COALESCE(NULLIF(barcode, ''), $2),
            name = $3,
            price = $4,
            original_price = $5,
            stock = GREATEST(COALESCE(stock, 0), $6),
            brand_category_id = $7,
            mama_type = $8,
            long_description = $9,
            meta_title = $10,
            meta_description = $11,
            meta_keywords = $12,
            mama_metadata = $13::jsonb,
            img = CASE
              WHEN img LIKE '/api/product-image/%' THEN img
              ELSE COALESCE(NULLIF(img, ''), $14)
            END,
            hidden_payment_methods = ARRAY['nakit','eft','qr','pos']::text[]
           WHERE id = $1`,
          [
            existing.rows[0].id,
            p.barcode,
            p.name,
            p.price,
            p.originalPrice ?? null,
            p.stock ?? 25,
            brandId,
            p.mamaType,
            p.longDescription ?? null,
            p.metaTitle ?? null,
            p.metaDescription ?? null,
            p.metaKeywords ?? null,
            metaJson,
            img,
          ],
        );
        updated++;
        if (img && String(existing.rows[0].img || "").startsWith("http")) {
          try {
            const localPath = await downloadAndSaveImage(img, existing.rows[0].id as number);
            if (localPath) {
              await pool.query(`UPDATE products SET img = $2, is_active = true WHERE id = $1`, [existing.rows[0].id, localPath]);
            }
          } catch { /* */ }
        }
      } else {
        const ins = await pool.query(
          `INSERT INTO products (
            name, price, original_price, img, stock, brand_category_id, barcode,
            mama_type, long_description, meta_title, meta_description, meta_keywords,
            mama_metadata, is_active, hidden_payment_methods
          ) VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13::jsonb,true,
            ARRAY['nakit','eft','qr','pos']::text[]
          ) RETURNING id`,
          [
            p.name,
            p.price,
            p.originalPrice ?? null,
            img,
            p.stock ?? 25,
            brandId,
            p.barcode,
            p.mamaType,
            p.longDescription ?? null,
            p.metaTitle ?? null,
            p.metaDescription ?? null,
            p.metaKeywords ?? null,
            metaJson,
          ],
        );
        inserted++;
        if (img && ins.rows[0]?.id) {
          try {
            const localPath = await downloadAndSaveImage(img, ins.rows[0].id as number);
            if (localPath) {
              await pool.query(`UPDATE products SET img = $2 WHERE id = $1`, [ins.rows[0].id, localPath]);
            }
          } catch { /* */ }
        }
      }
    } catch (e: any) {
      skipped++;
      console.warn(`[seedBulkKuruMama] skip ${p.name}:`, e?.message || e);
    }
  }

  // Also tag existing poodle / small-breed kuru mamalar that lack metadata
  await pool.query(`
    UPDATE products p
    SET mama_metadata = COALESCE(mama_metadata, '{}'::jsonb) || jsonb_build_object(
          'breedSize', COALESCE(mama_metadata->>'breedSize', 'toy'),
          'budgetTier', COALESCE(mama_metadata->>'budgetTier', 'orta'),
          'aiSearchHints', COALESCE(mama_metadata->'aiSearchHints', '["poodle mama","kuru mama"]'::jsonb)
        ),
        mama_type = COALESCE(NULLIF(mama_type, ''), 'yetiskin'),
        hidden_payment_methods = ARRAY['nakit','eft','qr','pos']::text[]
    WHERE p.is_active = true
      AND p.name ILIKE '%poodle%'
      AND (p.mama_metadata IS NULL OR p.mama_metadata = 'null'::jsonb)
  `);

  // Enforce store-wide: disable non-card payment methods in app_settings
  for (const key of [
    "payment_nakit_enabled",
    "payment_eft_enabled",
    "payment_qr_enabled",
    "payment_pos_enabled",
  ]) {
    await pool.query(
      `INSERT INTO app_settings (key, value, updated_at) VALUES ($1, 'false', NOW())
       ON CONFLICT (key) DO UPDATE SET value = 'false', updated_at = NOW()`,
      [key],
    );
  }
  await pool.query(
    `INSERT INTO app_settings (key, value, updated_at) VALUES ('payment_iyzico_enabled', 'true', NOW())
     ON CONFLICT (key) DO UPDATE SET value = 'true', updated_at = NOW()`,
  );

  console.log(`[seedBulkKuruMama] inserted=${inserted} updated=${updated} skipped=${skipped} total=${products.length}`);
}
