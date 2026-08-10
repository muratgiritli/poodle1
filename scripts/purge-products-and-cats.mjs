/**
 * Wipe ALL products + remove non-kopek (esp. kedi) catalog rows.
 * Usage: node scripts/purge-products-and-cats.mjs
 */
import pg from "pg";

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://postgres:petshop123@127.0.0.1:5433/petshop";

const c = new pg.Client({ connectionString: DATABASE_URL });

async function q(sql, params) {
  const r = await c.query(sql, params);
  return r;
}

async function main() {
  await c.connect();
  console.log("Connected to", DATABASE_URL.replace(/:[^:@/]+@/, ":***@"));

  const before = await q("SELECT COUNT(*)::int AS n FROM products");
  console.log("Products before:", before.rows[0].n);

  // Break FKs first (ignore missing tables)
  const steps = [
    "DELETE FROM cross_sell_items",
    "DELETE FROM campaign_items",
    "DELETE FROM product_images",
    "DELETE FROM product_reviews",
    "DELETE FROM stock_alerts",
    "DELETE FROM stock_movements",
    "DELETE FROM customer_favorites",
    "DELETE FROM breed_stats",
    "DELETE FROM reorder_reminders",
    "DELETE FROM products",
    "DELETE FROM brand_categories WHERE animal <> 'kopek'",
    "DELETE FROM subcategories WHERE animal <> 'kopek'",
    "DELETE FROM cross_sell_sections WHERE for_animal IS NOT NULL AND for_animal <> 'kopek'",
  ];

  for (const sql of steps) {
    try {
      const r = await q(sql);
      console.log(sql.slice(0, 60) + "...", "→", r.rowCount);
    } catch (e) {
      console.log("SKIP", sql.slice(0, 40), e.message.split("\n")[0]);
    }
  }

  const afterP = await q("SELECT COUNT(*)::int AS n FROM products");
  const afterBc = await q(
    "SELECT animal, COUNT(*)::int AS n FROM brand_categories GROUP BY animal ORDER BY n DESC"
  );
  const afterSub = await q(
    "SELECT animal, COUNT(*)::int AS n FROM subcategories GROUP BY animal ORDER BY n DESC"
  );
  console.log("Products after:", afterP.rows[0].n);
  console.log("brand_categories:", afterBc.rows);
  console.log("subcategories:", afterSub.rows);
  await c.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
