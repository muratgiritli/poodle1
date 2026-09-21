/**
 * Seed enuygunpetshop category catalog into YourPoodle subcategories.
 * Reads server/enuygun_category_catalog.json — upsert by barcode.
 */
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { pool } from "./storage";
import { downloadAndSaveImage } from "./image-service";

type CatProduct = {
  barcode: string;
  name: string;
  brandName: string;
  brandSlug: string;
  subcategory: string;
  price: number;
  originalPrice?: number;
  img?: string | null;
  stock?: number;
  skt?: string | null;
  mamaType?: string | null;
  longDescription?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  mamaMetadata?: Record<string, unknown>;
};

function loadCatalog(): CatProduct[] {
  const candidates = [
    join(process.cwd(), "server", "enuygun_category_catalog.json"),
    join(process.cwd(), "enuygun_category_catalog.json"),
    "/app/server/enuygun_category_catalog.json",
  ];
  for (const p of candidates) {
    try {
      if (!existsSync(p)) continue;
      const raw = JSON.parse(readFileSync(p, "utf8"));
      if (Array.isArray(raw?.products)) return raw.products as CatProduct[];
    } catch (e: any) {
      console.warn("[seedEnuygunCategories] read failed", p, e?.message);
    }
  }
  console.warn("[seedEnuygunCategories] catalog not found — skip");
  return [];
}

async function ensureBrand(brandName: string, brandSlug: string, subcategory: string): Promise<number> {
  const existing = await pool.query(
    `SELECT id FROM brand_categories
     WHERE brand_slug = $1 AND animal = 'kopek' AND subcategory = $2
     LIMIT 1`,
    [brandSlug, subcategory],
  );
  if (existing.rows[0]) return existing.rows[0].id as number;
  const ins = await pool.query(
    `INSERT INTO brand_categories (brand_name, brand_slug, animal, subcategory)
     VALUES ($1, $2, 'kopek', $3)
     RETURNING id`,
    [brandName, brandSlug, subcategory],
  );
  return ins.rows[0].id as number;
}

/** Split generic bakim-saglik catalog rows into finer storefront subcategories. */
function refineSubcategory(subcategory: string, name: string): string {
  if (subcategory !== "bakim-saglik") return subcategory;
  const n = String(name || "").toLocaleLowerCase("tr-TR");
  if (/şampuan|sampuan|parf[uü]m|shampoo|dry shampoo|conditioner|banyo/.test(n)) return "sampuan-banyo";
  if (/tırnak|tirnak|makas|tarak|tıraş|tiras|traş|tras|kıtık|kitik|tüy temiz|tuy temiz|tüy topla|tuy topla|kaşıma|kasima/.test(n)) {
    return "tras-ekipmanlari";
  }
  if (/diş|dis fır|dis fir|ağız|agiz|toothpaste|diş mac|dis mac/.test(n)) return "agiz-dis-bakim";
  if (/biberon|süt toz|sut toz|nursing/.test(n)) return "sut-tozu-biberon";
  if (/pire|bit |kene|parazit|antiparazit|spot.?on/.test(n)) return "bit-pire-parazit";
  if (/göz|goz|kulak|ear clean|eye/.test(n)) return "goz-kulak-bakim";
  return "bakim-saglik";
}

export async function seedEnuygunCategories(): Promise<void> {
  try {
    await seedEnuygunCategoriesInner();
  } catch (e: any) {
    console.error("[seedEnuygunCategories] failed:", e?.message || e);
  }
}

async function seedEnuygunCategoriesInner(): Promise<void> {
  const products = loadCatalog();
  if (!products.length) return;

  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS mama_metadata JSONB`);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_title text`);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_description text`);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_keywords text`);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS long_description text`);

  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (const p of products) {
    if (!p.barcode || !p.name || !p.subcategory) continue;
    try {
      const brandId = await ensureBrand(p.brandName, p.brandSlug, refineSubcategory(p.subcategory, p.name));
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
            mama_type = COALESCE($8, mama_type),
            long_description = COALESCE($9, long_description),
            meta_title = $10,
            meta_description = $11,
            meta_keywords = $12,
            mama_metadata = $13::jsonb,
            img = CASE
              WHEN img LIKE '/api/product-image/%' THEN img
              ELSE COALESCE(NULLIF(img, ''), $14)
            END,
            skt = COALESCE($15, skt),
            hidden_payment_methods = ARRAY['nakit','eft','qr','pos']::text[]
           WHERE id = $1`,
          [
            existing.rows[0].id,
            p.barcode,
            p.name,
            p.price,
            p.originalPrice ?? null,
            p.stock ?? 15,
            brandId,
            p.mamaType ?? null,
            p.longDescription ?? null,
            p.metaTitle ?? null,
            p.metaDescription ?? null,
            p.metaKeywords ?? null,
            metaJson,
            img,
            p.skt ?? null,
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
        } else if (img && !existing.rows[0].img) {
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
            mama_metadata, skt, is_active, hidden_payment_methods
          ) VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13::jsonb,$14,true,
            ARRAY['nakit','eft','qr','pos']::text[]
          ) RETURNING id`,
          [
            p.name,
            p.price,
            p.originalPrice ?? null,
            img,
            p.stock ?? 15,
            brandId,
            p.barcode,
            p.mamaType ?? null,
            p.longDescription ?? null,
            p.metaTitle ?? null,
            p.metaDescription ?? null,
            p.metaKeywords ?? null,
            metaJson,
            p.skt ?? null,
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
      console.warn(`[seedEnuygunCategories] skip ${p.name}:`, e?.message || e);
    }
  }

  console.log(`[seedEnuygunCategories] inserted=${inserted} updated=${updated} skipped=${skipped} total=${products.length}`);
}
