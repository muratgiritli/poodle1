/**
 * YourPoodle — Dog profile, Club social feed, follow system, notifications.
 * Registered by calling registerDogRoutes(app, pool) from routes.ts.
 */
import type { Express, Request, Response, NextFunction } from "express";
import type { Pool } from "pg";
import multer from "multer";
import { toWebpBuffer, toWebpDataUrl } from "./image-service";
import { sessionHasPermission } from "./admin-security";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });

function requireClubMod(req: Request, res: Response, next: NextFunction) {
  if (!sessionHasPermission(req, "club.moderate")) {
    return res.status(403).json({ message: "Bu işlem için yetkiniz yok", permission: "club.moderate" });
  }
  next();
}

function requireProductsWrite(req: Request, res: Response, next: NextFunction) {
  // Dog admin: store_manager / content_editor style — products.write OR club.moderate
  if (!sessionHasPermission(req, "products.write") && !sessionHasPermission(req, "club.moderate")) {
    return res.status(403).json({ message: "Bu işlem için yetkiniz yok" });
  }
  next();
}
/* ─── Auth middleware ────────────────────────────────── */
function requireCustomer(req: Request, res: Response, next: NextFunction) {
  const s = (req as any).session;
  if (!s?.customerId) return res.status(401).json({ message: "Giriş yapılmamış" });
  next();
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const s = (req as any).session;
  if (!s?.userId || s?.isAdmin !== true) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

/* ─── DB migrations ──────────────────────────────────── */
async function migrate(pool: Pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS dogs (
      id              SERIAL PRIMARY KEY,
      user_id         INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      slug            TEXT    UNIQUE NOT NULL,
      name            TEXT    NOT NULL,
      breed           TEXT    NOT NULL DEFAULT 'toy',
      birth_date      DATE,
      weight_kg       NUMERIC(4,2),
      color           TEXT,
      gender          TEXT,
      city            TEXT,
      district        TEXT,
      bio             TEXT,
      avatar_url      TEXT,
      is_public       BOOLEAN NOT NULL DEFAULT true,
      is_private      BOOLEAN NOT NULL DEFAULT false,
      follower_count  INTEGER NOT NULL DEFAULT 0,
      following_count INTEGER NOT NULL DEFAULT 0,
      post_count      INTEGER NOT NULL DEFAULT 0,
      created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS dog_images (
      id         SERIAL PRIMARY KEY,
      dog_id     INTEGER REFERENCES dogs(id) ON DELETE CASCADE,
      data       TEXT    NOT NULL,
      mimetype   TEXT    NOT NULL DEFAULT 'image/jpeg',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS dog_photos (
      id         SERIAL PRIMARY KEY,
      dog_id     INTEGER NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
      url        TEXT    NOT NULL,
      caption    TEXT,
      "order"    INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS club_posts (
      id            SERIAL PRIMARY KEY,
      dog_id        INTEGER REFERENCES dogs(id) ON DELETE SET NULL,
      user_id       INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      content       TEXT,
      image_urls    JSONB   NOT NULL DEFAULT '[]',
      hashtags      JSONB   NOT NULL DEFAULT '[]',
      like_count    INTEGER NOT NULL DEFAULT 0,
      comment_count INTEGER NOT NULL DEFAULT 0,
      visibility    TEXT    NOT NULL DEFAULT 'public',
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  // Add dog_id column if club_posts existed without it
  await pool.query(`ALTER TABLE club_posts ADD COLUMN IF NOT EXISTS dog_id INTEGER REFERENCES dogs(id) ON DELETE SET NULL;`);
  await pool.query(`ALTER TABLE club_posts ADD COLUMN IF NOT EXISTS image_urls JSONB NOT NULL DEFAULT '[]';`);
  await pool.query(`ALTER TABLE club_posts ADD COLUMN IF NOT EXISTS hashtags JSONB NOT NULL DEFAULT '[]';`);
  await pool.query(`ALTER TABLE club_posts ADD COLUMN IF NOT EXISTS visibility TEXT NOT NULL DEFAULT 'public';`);
  await pool.query(`ALTER TABLE club_posts ADD COLUMN IF NOT EXISTS moderated_at TIMESTAMPTZ;`);
  await pool.query(`ALTER TABLE club_posts ADD COLUMN IF NOT EXISTS moderated_by TEXT;`);
  await pool.query(`ALTER TABLE club_post_comments ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN NOT NULL DEFAULT false;`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS club_reports (
      id SERIAL PRIMARY KEY,
      post_id INTEGER REFERENCES club_posts(id) ON DELETE CASCADE,
      comment_id INTEGER REFERENCES club_post_comments(id) ON DELETE CASCADE,
      reporter_user_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
      reason TEXT,
      status TEXT NOT NULL DEFAULT 'open',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      resolved_at TIMESTAMPTZ,
      resolved_by TEXT
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS club_post_likes (
      id         SERIAL PRIMARY KEY,
      post_id    INTEGER NOT NULL REFERENCES club_posts(id) ON DELETE CASCADE,
      user_id    INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(post_id, user_id)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS club_post_comments (
      id         SERIAL PRIMARY KEY,
      post_id    INTEGER NOT NULL REFERENCES club_posts(id) ON DELETE CASCADE,
      user_id    INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      content    TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS club_post_saves (
      id         SERIAL PRIMARY KEY,
      post_id    INTEGER NOT NULL REFERENCES club_posts(id) ON DELETE CASCADE,
      user_id    INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(post_id, user_id)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS dog_follows (
      id               SERIAL PRIMARY KEY,
      follower_user_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      dog_id           INTEGER NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
      status           TEXT    NOT NULL DEFAULT 'active',
      created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(follower_user_id, dog_id)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS dog_notifications (
      id            SERIAL PRIMARY KEY,
      user_id       INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      type          TEXT    NOT NULL,
      actor_user_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
      dog_id        INTEGER REFERENCES dogs(id) ON DELETE CASCADE,
      post_id       INTEGER REFERENCES club_posts(id) ON DELETE CASCADE,
      message       TEXT    NOT NULL,
      is_read       BOOLEAN NOT NULL DEFAULT false,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS dog_weight_log (
      id          SERIAL PRIMARY KEY,
      dog_id      INTEGER NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
      weight_kg   NUMERIC(4,2) NOT NULL,
      note        TEXT,
      measured_at DATE NOT NULL DEFAULT CURRENT_DATE,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS dog_vet_visits (
      id              SERIAL PRIMARY KEY,
      dog_id          INTEGER NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
      visit_date      DATE NOT NULL,
      vet_name        TEXT,
      visit_type      TEXT NOT NULL DEFAULT 'Rutin Kontrol',
      notes           TEXT,
      next_visit_date DATE,
      created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS yp_event_registrations (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      event_id   INTEGER NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(user_id, event_id)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS club_dm_threads (
      id              SERIAL PRIMARY KEY,
      user_a_id       INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      user_b_id       INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      dog_a_slug      TEXT,
      dog_b_slug      TEXT,
      last_message    TEXT,
      last_message_at TIMESTAMPTZ,
      created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(user_a_id, user_b_id)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS club_dm_messages (
      id          SERIAL PRIMARY KEY,
      thread_id   INTEGER NOT NULL REFERENCES club_dm_threads(id) ON DELETE CASCADE,
      sender_id   INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      body        TEXT NOT NULL,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  console.log("[dogs] DB migration complete");
}

/** Demo Club content when DB has no posts (local / empty installs). */
async function seedClubDemo(pool: Pool) {
  const cnt = await pool.query(`SELECT COUNT(*)::int AS c FROM club_posts`);
  if ((cnt.rows[0]?.c ?? 0) > 0) return;
  const owners = await pool.query(`SELECT id FROM customers ORDER BY id ASC LIMIT 1`);
  if (!owners.rows.length) return;
  const userId = owners.rows[0].id as number;

  const demos = [
    {
      slug: "luna-club", name: "Luna", breed: "toy", city: "İstanbul",
      avatar: "/images/poodle-avatar-1.jpg",
      content: "Sabah yürüyüşü tamam ☀️ #poodle #istanbul",
      image: "/images/poodle-hero.jpg", likes: 12, hoursAgo: 2,
    },
    {
      slug: "max-club", name: "Max", breed: "miniature", city: "Ankara",
      avatar: "/images/poodle-avatar-2.jpg",
      content: "Yeni topumla ilk oyun! 🎾 #oyun #poodle",
      image: "/images/poodle-hero_2.jpg", likes: 8, hoursAgo: 8,
    },
    {
      slug: "bella-club", name: "Bella", breed: "toy", city: "İzmir",
      avatar: "/images/poodle-avatar-3.jpg",
      content: "Kuaförden çıktık, pırıl pırıl ✨ #bakim #toypoodle",
      image: "/images/yp-poodle-hero.png", likes: 21, hoursAgo: 20,
    },
    {
      slug: "coco-club", name: "Coco", breed: "moyen", city: "İstanbul",
      avatar: "/images/poodle-avatar-4.jpg",
      content: "Parkta yeni dostlar 🐾 #yakınımda #club",
      image: "/images/poodle-hero.png", likes: 5, hoursAgo: 30,
    },
  ];

  for (const d of demos) {
    let dogId: number;
    const existing = await pool.query(`SELECT id FROM dogs WHERE slug=$1`, [d.slug]);
    if (existing.rows.length) {
      dogId = existing.rows[0].id;
    } else {
      const ins = await pool.query(`
        INSERT INTO dogs (user_id, slug, name, breed, city, bio, avatar_url, is_public, is_private, post_count)
        VALUES ($1,$2,$3,$4,$5,$6,$7,true,false,1)
        RETURNING id
      `, [userId, d.slug, d.name, d.breed, d.city, `${d.name} Club demosu`, d.avatar]);
      dogId = ins.rows[0].id;
    }
    const tags = JSON.stringify(
      [...(d.content.match(/#[\p{L}\p{N}_]+/gu) ?? [])].map(h => h.slice(1).toLowerCase()),
    );
    await pool.query(`
      INSERT INTO club_posts (dog_id, user_id, content, image_urls, hashtags, visibility, like_count, created_at)
      VALUES ($1,$2,$3,$4::jsonb,$5::jsonb,'public',$6, NOW() - ($7::int * INTERVAL '1 hour'))
    `, [dogId, userId, d.content, JSON.stringify([d.image]), tags, d.likes, d.hoursAgo]);
  }
  console.log("[dogs] Club demo seed complete");
}

/* ─── Helpers ────────────────────────────────────────── */
function slugify(s: string) {
  return s.toLowerCase()
    .replace(/[çÇ]/g, "c").replace(/[ğĞ]/g, "g").replace(/[ıI]/g, "i")
    .replace(/[İ]/g, "i").replace(/[öÖ]/g, "o").replace(/[şŞ]/g, "s")
    .replace(/[üÜ]/g, "u").replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function extractHashtags(text: string): string[] {
  return [...(text.match(/#[\p{L}\p{N}_]+/gu) ?? [])].map(h => h.slice(1).toLowerCase());
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Az önce";
  if (m < 60) return `${m} dk önce`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} sa önce`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} gün önce`;
  return date.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
}

async function createNotification(pool: Pool, opts: {
  userId: number; type: string; actorUserId: number;
  dogId?: number; postId?: number; message: string;
}) {
  try {
    await pool.query(`
      INSERT INTO dog_notifications (user_id, type, actor_user_id, dog_id, post_id, message)
      VALUES ($1,$2,$3,$4,$5,$6)
    `, [opts.userId, opts.type, opts.actorUserId, opts.dogId ?? null, opts.postId ?? null, opts.message]);
  } catch { /* notifications are non-critical */ }
}

/* ─── Main export ────────────────────────────────────── */
export async function registerDogRoutes(app: Express, pool: Pool) {
  try {
    await migrate(pool);
    await seedClubDemo(pool);
  } catch (e: any) {
    console.warn("[local] Skipping dogs migrate (DB unavailable):", e?.code || e?.message);
  }

  // ── Check slug availability ─────────────────────────
  app.get("/api/dogs/check-slug/:slug", async (req, res) => {
    const slug = slugify(req.params.slug);
    if (slug.length < 2) return res.json({ available: false, reason: "Çok kısa" });
    const r = await pool.query(`SELECT id FROM dogs WHERE slug=$1`, [slug]);
    res.json({ available: r.rows.length === 0, slug });
  });

  // ── Dog directory (public) ──────────────────────────
  app.get("/api/dogs", async (req, res) => {
    const { search, city, sort = "newest", limit = "24", offset = "0" } = req.query as any;
    let q = `SELECT d.*, c.name AS owner_name
             FROM dogs d
             JOIN customers c ON c.id = d.user_id
             WHERE d.is_public = true`;
    const params: any[] = [];
    if (search) { params.push(`%${search}%`); q += ` AND (d.name ILIKE $${params.length} OR d.slug ILIKE $${params.length})`; }
    if (city && city !== "tumu") { params.push(city); q += ` AND d.city = $${params.length}`; }
    q += sort === "popular" ? " ORDER BY d.follower_count DESC, d.created_at DESC" : " ORDER BY d.created_at DESC";
    params.push(parseInt(limit)); q += ` LIMIT $${params.length}`;
    params.push(parseInt(offset)); q += ` OFFSET $${params.length}`;
    const r = await pool.query(q, params);
    res.json(r.rows);
  });

  // ── Create dog profile ──────────────────────────────
  app.post("/api/dogs", requireCustomer, async (req, res) => {
    const userId = (req as any).session.customerId as number;
    const { name, slug: rawSlug, breed, birthDate, weightKg, color, gender, city, district, bio, isPrivate } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: "İsim zorunlu" });
    const slug = slugify(rawSlug || name);
    if (slug.length < 2) return res.status(400).json({ message: "Geçersiz slug" });
    // Check uniqueness
    const exists = await pool.query(`SELECT id FROM dogs WHERE slug=$1`, [slug]);
    if (exists.rows.length) return res.status(409).json({ message: "Bu isim zaten alınmış" });
    const r = await pool.query(`
      INSERT INTO dogs (user_id, slug, name, breed, birth_date, weight_kg, color, gender, city, district, bio, is_private, is_public)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *
    `, [userId, slug, name.trim(), breed || "toy", birthDate || null, weightKg || null,
        color || null, gender || null, city || null, district || null,
        bio ? bio.slice(0, 150) : null, !!isPrivate, !isPrivate]);
    res.status(201).json(r.rows[0]);
  });

  // ── Get dog profile ─────────────────────────────────
  app.get("/api/dogs/:slug", async (req, res) => {
    const userId = (req as any).session?.customerId as number | undefined;
    const r = await pool.query(`
      SELECT d.*,
             c.name AS owner_name, c.id AS owner_id,
             (SELECT COUNT(*) FROM club_posts cp WHERE cp.dog_id=d.id) AS post_count_live
      FROM dogs d
      JOIN customers c ON c.id=d.user_id
      WHERE d.slug=$1
    `, [req.params.slug]);
    if (!r.rows.length) return res.status(404).json({ message: "Profil bulunamadı" });
    const dog = r.rows[0];
    let followStatus: string | null = null;
    if (userId) {
      const f = await pool.query(`SELECT status FROM dog_follows WHERE follower_user_id=$1 AND dog_id=$2`, [userId, dog.id]);
      followStatus = f.rows[0]?.status ?? null;
    }
    const isOwner = userId === dog.user_id;
    if (dog.is_private && !isOwner && followStatus !== "active") {
      return res.json({ ...dog, private: true, isOwner, followStatus });
    }
    res.json({ ...dog, isOwner, followStatus });
  });

  // ── Update dog profile ──────────────────────────────
  app.put("/api/dogs/:slug", requireCustomer, async (req, res) => {
    const userId = (req as any).session.customerId as number;
    const dog = await pool.query(`SELECT * FROM dogs WHERE slug=$1`, [req.params.slug]);
    if (!dog.rows.length) return res.status(404).json({ message: "Bulunamadı" });
    if (dog.rows[0].user_id !== userId) return res.status(403).json({ message: "Yetkisiz" });
    const { name, breed, birthDate, weightKg, color, gender, city, district, bio, isPrivate } = req.body;
    const r = await pool.query(`
      UPDATE dogs SET
        name=$1, breed=$2, birth_date=$3, weight_kg=$4, color=$5, gender=$6,
        city=$7, district=$8, bio=$9, is_private=$10, is_public=$11, updated_at=NOW()
      WHERE id=$12 RETURNING *
    `, [name ?? dog.rows[0].name, breed ?? dog.rows[0].breed,
        birthDate ?? dog.rows[0].birth_date, weightKg ?? dog.rows[0].weight_kg,
        color ?? dog.rows[0].color, gender ?? dog.rows[0].gender,
        city ?? dog.rows[0].city, district ?? dog.rows[0].district,
        bio ? bio.slice(0, 150) : dog.rows[0].bio,
        isPrivate ?? dog.rows[0].is_private, !isPrivate,
        dog.rows[0].id]);
    res.json(r.rows[0]);
  });

  // ── Upload dog avatar ───────────────────────────────
  app.post("/api/dogs/:slug/avatar", requireCustomer, upload.single("avatar"), async (req, res) => {
    const userId = (req as any).session.customerId as number;
    const dog = await pool.query(`SELECT * FROM dogs WHERE slug=$1`, [req.params.slug]);
    if (!dog.rows.length) return res.status(404).json({ message: "Bulunamadı" });
    if (dog.rows[0].user_id !== userId) return res.status(403).json({ message: "Yetkisiz" });
    if (!req.file) return res.status(400).json({ message: "Dosya bulunamadı" });
    if (!req.file.mimetype?.startsWith("image/")) return res.status(400).json({ message: "Sadece resim yüklenebilir" });
    try {
      const webp = await toWebpBuffer(req.file.buffer, { width: 400, height: 400, fit: "cover", quality: 82 });
      const b64 = webp.toString("base64");
      await pool.query(`DELETE FROM dog_images WHERE dog_id=$1`, [dog.rows[0].id]);
      await pool.query(`INSERT INTO dog_images (dog_id, data, mimetype) VALUES ($1,$2,$3)`, [dog.rows[0].id, b64, "image/webp"]);
      const avatarUrl = `/api/dogs/${dog.rows[0].slug}/avatar-img`;
      await pool.query(`UPDATE dogs SET avatar_url=$1, updated_at=NOW() WHERE id=$2`, [avatarUrl, dog.rows[0].id]);
      res.json({ avatarUrl });
    } catch (err: any) {
      console.log(`[dogs] avatar webp error: ${err?.message || err}`);
      res.status(500).json({ message: "Avatar yüklenemedi" });
    }
  });

  // ── Serve dog avatar image ──────────────────────────
  app.get("/api/dogs/:slug/avatar-img", async (req, res) => {
    const dog = await pool.query(`SELECT id FROM dogs WHERE slug=$1`, [req.params.slug]);
    if (!dog.rows.length) return res.status(404).end();
    const img = await pool.query(`SELECT data, mimetype FROM dog_images WHERE dog_id=$1 ORDER BY id DESC LIMIT 1`, [dog.rows[0].id]);
    if (!img.rows.length) return res.status(404).end();
    const buf = Buffer.from(img.rows[0].data, "base64");
    res.setHeader("Content-Type", img.rows[0].mimetype);
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(buf);
  });

  // ── Follow / request follow ─────────────────────────
  app.post("/api/dogs/:slug/follow", requireCustomer, async (req, res) => {
    const userId = (req as any).session.customerId as number;
    const dog = await pool.query(`SELECT * FROM dogs WHERE slug=$1`, [req.params.slug]);
    if (!dog.rows.length) return res.status(404).json({ message: "Bulunamadı" });
    if (dog.rows[0].user_id === userId) return res.status(400).json({ message: "Kendi köpeğini takip edemezsin" });
    const status = dog.rows[0].is_private ? "pending" : "active";
    await pool.query(`
      INSERT INTO dog_follows (follower_user_id, dog_id, status)
      VALUES ($1,$2,$3)
      ON CONFLICT (follower_user_id, dog_id) DO UPDATE SET status=$3
    `, [userId, dog.rows[0].id, status]);
    if (status === "active") {
      await pool.query(`UPDATE dogs SET follower_count=follower_count+1 WHERE id=$1`, [dog.rows[0].id]);
      // Takip eden kullanıcının köpeklerinde following_count artır
      await pool.query(
        `UPDATE dogs SET following_count=following_count+1 WHERE user_id=$1`,
        [userId],
      );
      await createNotification(pool, {
        userId: dog.rows[0].user_id, type: "new_follower", actorUserId: userId,
        dogId: dog.rows[0].id, message: `Birisi ${dog.rows[0].name} profilinizi takip etmeye başladı.`,
      });
    } else {
      await createNotification(pool, {
        userId: dog.rows[0].user_id, type: "follow_request", actorUserId: userId,
        dogId: dog.rows[0].id, message: `Birisi ${dog.rows[0].name} profilinizi takip etmek istiyor.`,
      });
    }
    res.json({ status });
  });

  // ── Unfollow ────────────────────────────────────────
  app.delete("/api/dogs/:slug/follow", requireCustomer, async (req, res) => {
    const userId = (req as any).session.customerId as number;
    const dog = await pool.query(`SELECT id FROM dogs WHERE slug=$1`, [req.params.slug]);
    if (!dog.rows.length) return res.status(404).json({ message: "Bulunamadı" });
    const f = await pool.query(`SELECT status FROM dog_follows WHERE follower_user_id=$1 AND dog_id=$2`, [userId, dog.rows[0].id]);
    if (f.rows.length && f.rows[0].status === "active") {
      await pool.query(`UPDATE dogs SET follower_count=GREATEST(0,follower_count-1) WHERE id=$1`, [dog.rows[0].id]);
      await pool.query(
        `UPDATE dogs SET following_count=GREATEST(0,following_count-1) WHERE user_id=$1`,
        [userId],
      );
    }
    await pool.query(`DELETE FROM dog_follows WHERE follower_user_id=$1 AND dog_id=$2`, [userId, dog.rows[0].id]);
    res.json({ ok: true });
  });

  // ── Accept follow request ───────────────────────────
  app.post("/api/dogs/:slug/follow/accept", requireCustomer, async (req, res) => {
    const userId = (req as any).session.customerId as number;
    const { followerId } = req.body;
    const dog = await pool.query(`SELECT * FROM dogs WHERE slug=$1`, [req.params.slug]);
    if (!dog.rows.length) return res.status(404).json({ message: "Bulunamadı" });
    if (dog.rows[0].user_id !== userId) return res.status(403).json({ message: "Yetkisiz" });
    await pool.query(`UPDATE dog_follows SET status='active' WHERE follower_user_id=$1 AND dog_id=$2`, [followerId, dog.rows[0].id]);
    await pool.query(`UPDATE dogs SET follower_count=follower_count+1 WHERE id=$1`, [dog.rows[0].id]);
    const fid = parseInt(followerId, 10);
    if (!Number.isNaN(fid)) {
      await pool.query(
        `UPDATE dogs SET following_count=following_count+1 WHERE user_id=$1`,
        [fid],
      );
    }
    await createNotification(pool, {
      userId: parseInt(followerId), type: "follow_accept", actorUserId: userId,
      dogId: dog.rows[0].id, message: `${dog.rows[0].name} takip isteğiniz kabul edildi.`,
    });
    res.json({ ok: true });
  });

  // ── Reject follow request ───────────────────────────
  app.post("/api/dogs/:slug/follow/reject", requireCustomer, async (req, res) => {
    const userId = (req as any).session.customerId as number;
    const { followerId } = req.body;
    const dog = await pool.query(`SELECT * FROM dogs WHERE slug=$1`, [req.params.slug]);
    if (!dog.rows.length) return res.status(404).json({ message: "Bulunamadı" });
    if (dog.rows[0].user_id !== userId) return res.status(403).json({ message: "Yetkisiz" });
    await pool.query(`DELETE FROM dog_follows WHERE follower_user_id=$1 AND dog_id=$2 AND status='pending'`, [followerId, dog.rows[0].id]);
    res.json({ ok: true });
  });

  // ── Followers list ──────────────────────────────────
  app.get("/api/dogs/:slug/followers", async (req, res) => {
    const dog = await pool.query(`SELECT id FROM dogs WHERE slug=$1`, [req.params.slug]);
    if (!dog.rows.length) return res.status(404).json({ message: "Bulunamadı" });
    const r = await pool.query(`
      SELECT df.follower_user_id, df.status, df.created_at,
             c.name AS owner_name
      FROM dog_follows df
      JOIN customers c ON c.id=df.follower_user_id
      WHERE df.dog_id=$1 AND df.status='active'
      ORDER BY df.created_at DESC LIMIT 50
    `, [dog.rows[0].id]);
    res.json(r.rows);
  });

  // ── Club feed (followed dogs' posts) ───────────────
  app.get("/api/club/feed", requireCustomer, async (req, res) => {
    const userId = (req as any).session.customerId as number;
    const limit = parseInt((req.query.limit as string) || "20");
    const offset = parseInt((req.query.offset as string) || "0");
    const r = await pool.query(`
      SELECT cp.*,
             d.name AS dog_name, d.slug AS dog_slug, d.avatar_url, d.city AS dog_city,
             c.name AS owner_name,
             EXISTS(SELECT 1 FROM club_post_likes l WHERE l.post_id=cp.id AND l.user_id=$1) AS liked,
             EXISTS(SELECT 1 FROM club_post_saves s WHERE s.post_id=cp.id AND s.user_id=$1) AS saved,
             TRUE AS following
      FROM club_posts cp
      JOIN dog_follows df ON df.dog_id=cp.dog_id AND df.follower_user_id=$1 AND df.status='active'
      LEFT JOIN dogs d ON d.id=cp.dog_id
      LEFT JOIN customers c ON c.id=cp.user_id
      WHERE cp.visibility='public' OR cp.user_id=$1
      ORDER BY cp.created_at DESC
      LIMIT $2 OFFSET $3
    `, [userId, limit, offset]);
    res.json(r.rows.map(p => ({
      ...p,
      image_urls: typeof p.image_urls === "string" ? JSON.parse(p.image_urls) : (p.image_urls || []),
      hashtags: typeof p.hashtags === "string" ? JSON.parse(p.hashtags) : (p.hashtags || []),
      timeAgo: timeAgo(new Date(p.created_at)),
    })));
  });

  // ── Public explore feed (no auth needed) ───────────
  app.get("/api/club/public-feed", async (req, res) => {
    const limit = parseInt((req.query.limit as string) || "20");
    const offset = parseInt((req.query.offset as string) || "0");
    const city = ((req.query.city as string) || "").trim();
    const userId = (req as any).session?.customerId as number | undefined;

    const params: any[] = [];
    let where = `WHERE cp.visibility='public'`;
    if (city) {
      params.push(`%${city}%`);
      where += ` AND d.city ILIKE $${params.length}`;
    }
    params.push(limit, offset);
    const limitIdx = params.length - 1;
    const offsetIdx = params.length;

    const r = await pool.query(`
      SELECT cp.*,
             d.name AS dog_name, d.slug AS dog_slug, d.avatar_url, d.city AS dog_city,
             c.name AS owner_name
      FROM club_posts cp
      LEFT JOIN dogs d ON d.id=cp.dog_id
      LEFT JOIN customers c ON c.id=cp.user_id
      ${where}
      ORDER BY cp.created_at DESC
      LIMIT $${limitIdx} OFFSET $${offsetIdx}
    `, params);

    const rows = r.rows.map(p => ({
      ...p,
      image_urls: typeof p.image_urls === "string" ? JSON.parse(p.image_urls) : (p.image_urls || []),
      hashtags: typeof p.hashtags === "string" ? JSON.parse(p.hashtags) : (p.hashtags || []),
      liked: false,
      saved: false,
      following: false,
      timeAgo: timeAgo(new Date(p.created_at)),
    }));

    if (userId && rows.length) {
      const ids = rows.map(r => r.id);
      const [likes, saves, follows] = await Promise.all([
        pool.query(`SELECT post_id FROM club_post_likes WHERE user_id=$1 AND post_id = ANY($2::int[])`, [userId, ids]),
        pool.query(`SELECT post_id FROM club_post_saves WHERE user_id=$1 AND post_id = ANY($2::int[])`, [userId, ids]),
        pool.query(`
          SELECT dog_id FROM dog_follows
          WHERE follower_user_id=$1 AND status='active'
            AND dog_id = ANY($2::int[])
        `, [userId, rows.map(r => r.dog_id).filter(Boolean)]),
      ]);
      const likedSet = new Set(likes.rows.map(x => x.post_id));
      const savedSet = new Set(saves.rows.map(x => x.post_id));
      const followSet = new Set(follows.rows.map(x => x.dog_id));
      for (const row of rows) {
        row.liked = likedSet.has(row.id);
        row.saved = savedSet.has(row.id);
        row.following = row.dog_id ? followSet.has(row.dog_id) : false;
      }
    }
    res.json(rows);
  });

  // ── Single post ─────────────────────────────────────
  app.get("/api/club/posts/:id", async (req, res) => {
    const id = parseInt(String(req.params.id));
    if (!id) return res.status(400).json({ message: "Geçersiz id" });
    const userId = (req as any).session?.customerId as number | undefined;
    const r = await pool.query(`
      SELECT cp.*,
             d.name AS dog_name, d.slug AS dog_slug, d.avatar_url, d.city AS dog_city,
             c.name AS owner_name
      FROM club_posts cp
      LEFT JOIN dogs d ON d.id=cp.dog_id
      LEFT JOIN customers c ON c.id=cp.user_id
      WHERE cp.id=$1
    `, [id]);
    if (!r.rows.length) return res.status(404).json({ message: "Bulunamadı" });
    const p = r.rows[0];
    if (p.visibility !== "public" && p.user_id !== userId) {
      return res.status(404).json({ message: "Bulunamadı" });
    }
    if (p.visibility === "hidden" && p.user_id !== userId) {
      return res.status(404).json({ message: "Bulunamadı" });
    }
    let liked = false, saved = false, following = false;
    if (userId) {
      const [l, s, f] = await Promise.all([
        pool.query(`SELECT 1 FROM club_post_likes WHERE post_id=$1 AND user_id=$2`, [id, userId]),
        pool.query(`SELECT 1 FROM club_post_saves WHERE post_id=$1 AND user_id=$2`, [id, userId]),
        p.dog_id
          ? pool.query(`SELECT 1 FROM dog_follows WHERE dog_id=$1 AND follower_user_id=$2 AND status='active'`, [p.dog_id, userId])
          : Promise.resolve({ rows: [] as any[] }),
      ]);
      liked = l.rows.length > 0;
      saved = s.rows.length > 0;
      following = f.rows.length > 0;
    }
    res.json({
      ...p,
      image_urls: typeof p.image_urls === "string" ? JSON.parse(p.image_urls) : (p.image_urls || []),
      hashtags: typeof p.hashtags === "string" ? JSON.parse(p.hashtags) : (p.hashtags || []),
      liked, saved, following,
      timeAgo: timeAgo(new Date(p.created_at)),
    });
  });

  // ── Save/unsave ─────────────────────────────────────
  app.post("/api/club/posts/:id/save", requireCustomer, async (req, res) => {
    const userId = (req as any).session.customerId as number;
    const id = parseInt(String(req.params.id));
    const p = await pool.query(`SELECT id FROM club_posts WHERE id=$1`, [id]);
    if (!p.rows.length) return res.status(404).json({ message: "Bulunamadı" });
    const existing = await pool.query(`SELECT id FROM club_post_saves WHERE post_id=$1 AND user_id=$2`, [id, userId]);
    if (existing.rows.length) {
      await pool.query(`DELETE FROM club_post_saves WHERE post_id=$1 AND user_id=$2`, [id, userId]);
      return res.json({ saved: false });
    }
    await pool.query(`INSERT INTO club_post_saves (post_id, user_id) VALUES ($1,$2)`, [id, userId]);
    res.json({ saved: true });
  });

  // ── Create post ─────────────────────────────────────
  app.post("/api/club/posts", requireCustomer, async (req, res) => {
    const userId = (req as any).session.customerId as number;
    const { dogSlug, content, imageBase64, imagesBase64, visibility = "public" } = req.body;
    const rawImages: string[] = Array.isArray(imagesBase64)
      ? imagesBase64.filter((x: any) => typeof x === "string" && x.length > 0).slice(0, 6)
      : (imageBase64 ? [imageBase64] : []);
    if (!content?.trim() && rawImages.length === 0) return res.status(400).json({ message: "İçerik veya fotoğraf zorunlu" });
    let dogId: number | null = null;
    let dogOwnerId: number | null = null;
    if (dogSlug) {
      const d = await pool.query(`SELECT id, user_id FROM dogs WHERE slug=$1`, [dogSlug]);
      if (d.rows.length) { dogId = d.rows[0].id; dogOwnerId = d.rows[0].user_id; }
    }
    if (dogId && dogOwnerId !== userId) return res.status(403).json({ message: "Bu köpek size ait değil" });
    const hashtags = content ? extractHashtags(content) : [];
    const imageUrls: string[] = [];
    for (const img of rawImages) {
      if (String(img).length > 12 * 1024 * 1024) {
        return res.status(400).json({ message: "Fotoğraf çok büyük" });
      }
      try {
        imageUrls.push(await toWebpDataUrl(img, { width: 1080, height: 1080, fit: "cover", quality: 82 }));
      } catch (err: any) {
        console.log(`[club] post image webp error: ${err?.message || err}`);
        return res.status(400).json({ message: "Fotoğraf işlenemedi" });
      }
    }
    const r = await pool.query(`
      INSERT INTO club_posts (dog_id, user_id, content, image_urls, hashtags, visibility)
      VALUES ($1,$2,$3,$4,$5,$6) RETURNING *
    `, [dogId, userId, content?.trim() || null, JSON.stringify(imageUrls), JSON.stringify(hashtags), visibility]);
    if (dogId) await pool.query(`UPDATE dogs SET post_count=post_count+1 WHERE id=$1`, [dogId]);
    res.status(201).json(r.rows[0]);
  });

  // ── Admin: migrate legacy club/dog images to WebP ───
  app.post("/api/admin/club/migrate-webp", requireAdmin, requireClubMod, async (_req, res) => {
    try {
      let postsUpdated = 0;
      let photosUpdated = 0;
      let imagesConverted = 0;
      const posts = await pool.query(`SELECT id, image_urls FROM club_posts WHERE jsonb_array_length(image_urls) > 0 ORDER BY id ASC LIMIT 500`);
      for (const row of posts.rows) {
        const urls: string[] = typeof row.image_urls === "string" ? JSON.parse(row.image_urls) : (row.image_urls || []);
        let changed = false;
        const next: string[] = [];
        for (const u of urls) {
          if (typeof u !== "string" || !u.startsWith("data:") || u.startsWith("data:image/webp")) {
            next.push(u);
            continue;
          }
          try {
            next.push(await toWebpDataUrl(u, { width: 1080, height: 1080, fit: "cover", quality: 82 }));
            changed = true;
            imagesConverted++;
          } catch {
            next.push(u);
          }
        }
        if (changed) {
          await pool.query(`UPDATE club_posts SET image_urls=$1 WHERE id=$2`, [JSON.stringify(next), row.id]);
          postsUpdated++;
        }
      }
      const photos = await pool.query(
        `SELECT id, url FROM dog_photos WHERE url LIKE 'data:image/%' AND url NOT LIKE 'data:image/webp%' ORDER BY id ASC LIMIT 500`
      );
      for (const row of photos.rows) {
        try {
          const webp = await toWebpDataUrl(row.url, { maxEdge: 1440, quality: 82 });
          await pool.query(`UPDATE dog_photos SET url=$1 WHERE id=$2`, [webp, row.id]);
          photosUpdated++;
          imagesConverted++;
        } catch { /* skip */ }
      }
      res.json({ ok: true, postsUpdated, photosUpdated, imagesConverted });
    } catch (e: any) {
      res.status(500).json({ message: e?.message || "Migrate başarısız" });
    }
  });

  // ── Delete post ─────────────────────────────────────
  app.delete("/api/club/posts/:id", requireCustomer, async (req, res) => {
    const userId = (req as any).session.customerId as number;
    const id = parseInt(String(req.params.id));
    const p = await pool.query(`SELECT * FROM club_posts WHERE id=$1`, [id]);
    if (!p.rows.length) return res.status(404).json({ message: "Bulunamadı" });
    if (p.rows[0].user_id !== userId) return res.status(403).json({ message: "Yetkisiz" });
    if (p.rows[0].dog_id) await pool.query(`UPDATE dogs SET post_count=GREATEST(0,post_count-1) WHERE id=$1`, [p.rows[0].dog_id]);
    await pool.query(`DELETE FROM club_posts WHERE id=$1`, [id]);
    res.json({ ok: true });
  });

  // ── Like/unlike ─────────────────────────────────────
  app.post("/api/club/posts/:id/like", requireCustomer, async (req, res) => {
    const userId = (req as any).session.customerId as number;
    const id = parseInt(String(req.params.id));
    const p = await pool.query(`SELECT * FROM club_posts WHERE id=$1`, [id]);
    if (!p.rows.length) return res.status(404).json({ message: "Bulunamadı" });
    const existing = await pool.query(`SELECT id FROM club_post_likes WHERE post_id=$1 AND user_id=$2`, [id, userId]);
    if (existing.rows.length) {
      await pool.query(`DELETE FROM club_post_likes WHERE post_id=$1 AND user_id=$2`, [id, userId]);
      await pool.query(`UPDATE club_posts SET like_count=GREATEST(0,like_count-1) WHERE id=$1`, [id]);
      return res.json({ liked: false });
    }
    await pool.query(`INSERT INTO club_post_likes (post_id, user_id) VALUES ($1,$2)`, [id, userId]);
    await pool.query(`UPDATE club_posts SET like_count=like_count+1 WHERE id=$1`, [id]);
    // Notify post owner (don't notify self-like)
    if (p.rows[0].user_id !== userId && p.rows[0].dog_id) {
      const dog = await pool.query(`SELECT name FROM dogs WHERE id=$1`, [p.rows[0].dog_id]);
      await createNotification(pool, {
        userId: p.rows[0].user_id, type: "like", actorUserId: userId,
        dogId: p.rows[0].dog_id, postId: id,
        message: `Birisi ${dog.rows[0]?.name ?? ""} gönderinizi beğendi ❤️`,
      });
    }
    res.json({ liked: true });
  });

  // ── Comments ────────────────────────────────────────
  app.get("/api/club/posts/:id/comments", async (req, res) => {
    const id = parseInt(req.params.id);
    const r = await pool.query(`
      SELECT cc.*, c.name AS author_name
      FROM club_post_comments cc
      JOIN customers c ON c.id=cc.user_id
      WHERE cc.post_id=$1
        AND COALESCE(cc.is_hidden, false) = false
      ORDER BY cc.created_at ASC LIMIT 50
    `, [id]);
    res.json(r.rows);
  });

  app.post("/api/club/posts/:id/comments", requireCustomer, async (req, res) => {
    const userId = (req as any).session.customerId as number;
    const id = parseInt(String(req.params.id));
    const { content } = req.body;
    if (!content?.trim()) return res.status(400).json({ message: "Yorum boş olamaz" });
    const p = await pool.query(`SELECT * FROM club_posts WHERE id=$1`, [id]);
    if (!p.rows.length) return res.status(404).json({ message: "Bulunamadı" });
    const r = await pool.query(`
      INSERT INTO club_post_comments (post_id, user_id, content)
      VALUES ($1,$2,$3) RETURNING *
    `, [id, userId, content.trim().slice(0, 500)]);
    await pool.query(`UPDATE club_posts SET comment_count=comment_count+1 WHERE id=$1`, [id]);
    // Notify
    if (p.rows[0].user_id !== userId && p.rows[0].dog_id) {
      const dog = await pool.query(`SELECT name FROM dogs WHERE id=$1`, [p.rows[0].dog_id]);
      await createNotification(pool, {
        userId: p.rows[0].user_id, type: "comment", actorUserId: userId,
        dogId: p.rows[0].dog_id, postId: id,
        message: `Birisi ${dog.rows[0]?.name ?? ""} gönderinize yorum yaptı 💬`,
      });
    }
    const me = await pool.query(`SELECT name FROM customers WHERE id=$1`, [userId]);
    res.status(201).json({ ...r.rows[0], author_name: me.rows[0]?.name || "Sen" });
  });

  // ── Notifications ───────────────────────────────────
  app.get("/api/notifications", requireCustomer, async (req, res) => {
    const userId = (req as any).session.customerId as number;
    const r = await pool.query(`
      SELECT n.*, c.name AS actor_name, d.name AS dog_name, d.slug AS dog_slug
      FROM dog_notifications n
      LEFT JOIN customers c ON c.id=n.actor_user_id
      LEFT JOIN dogs d ON d.id=n.dog_id
      WHERE n.user_id=$1 ORDER BY n.created_at DESC LIMIT 50
    `, [userId]);
    res.json(r.rows.map(n => ({ ...n, timeAgo: timeAgo(new Date(n.created_at)) })));
  });

  app.put("/api/notifications/:id/read", requireCustomer, async (req, res) => {
    const userId = (req as any).session.customerId as number;
    await pool.query(`UPDATE dog_notifications SET is_read=true WHERE id=$1 AND user_id=$2`, [req.params.id, userId]);
    res.json({ ok: true });
  });

  app.put("/api/notifications/read-all", requireCustomer, async (req, res) => {
    const userId = (req as any).session.customerId as number;
    await pool.query(`UPDATE dog_notifications SET is_read=true WHERE user_id=$1`, [userId]);
    res.json({ ok: true });
  });

  app.get("/api/notifications/unread-count", requireCustomer, async (req, res) => {
    const userId = (req as any).session.customerId as number;
    const r = await pool.query(`SELECT COUNT(*) AS cnt FROM dog_notifications WHERE user_id=$1 AND is_read=false`, [userId]);
    res.json({ count: parseInt(r.rows[0].cnt) });
  });

  // ── Explore ─────────────────────────────────────────
  app.get("/api/club/explore", async (req, res) => {
    const userId = (req as any).session?.customerId;
    // Popular posts (last 7 days)
    const popular = await pool.query(`
      SELECT cp.*, d.name AS dog_name, d.slug AS dog_slug, d.avatar_url, d.city
      FROM club_posts cp
      LEFT JOIN dogs d ON d.id=cp.dog_id
      WHERE cp.visibility='public' AND cp.created_at > NOW()-INTERVAL '7 days'
      ORDER BY cp.like_count DESC LIMIT 6
    `);
    // New dogs
    const newDogs = await pool.query(`
      SELECT d.*, c.name AS owner_name
      FROM dogs d JOIN customers c ON c.id=d.user_id
      WHERE d.is_public=true ORDER BY d.created_at DESC LIMIT 12
    `);
    // By city
    const cities = await pool.query(`
      SELECT city, COUNT(*) AS cnt FROM dogs WHERE is_public=true AND city IS NOT NULL
      GROUP BY city ORDER BY cnt DESC LIMIT 8
    `);
    res.json({
      popular: popular.rows.map(p => ({
        ...p,
        image_urls: typeof p.image_urls === "string" ? JSON.parse(p.image_urls) : (p.image_urls || []),
        timeAgo: timeAgo(new Date(p.created_at)),
      })),
      newDogs: newDogs.rows,
      cities: cities.rows,
    });
  });

  // ── Stories (last 24h photo posts from followed) ────
  app.get("/api/club/stories", requireCustomer, async (req, res) => {
    const userId = (req as any).session.customerId as number;
    const r = await pool.query(`
      SELECT DISTINCT ON (d.id)
             d.id, d.name, d.slug, d.avatar_url,
             cp.id AS post_id,
             cp.image_urls,
             cp.created_at
      FROM club_posts cp
      JOIN dogs d ON d.id=cp.dog_id
      JOIN dog_follows df ON df.dog_id=d.id AND df.follower_user_id=$1 AND df.status='active'
      WHERE cp.created_at > NOW()-INTERVAL '24 hours'
        AND jsonb_array_length(cp.image_urls) > 0
      ORDER BY d.id, cp.created_at DESC
      LIMIT 12
    `, [userId]);
    res.json(r.rows.map(row => {
      const urls = typeof row.image_urls === "string" ? JSON.parse(row.image_urls) : (row.image_urls || []);
      return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        avatar_url: row.avatar_url,
        post_id: row.post_id,
        story_image: urls[0] || null,
        created_at: row.created_at,
      };
    }));
  });

  // ── My dogs (for post creation) ─────────────────────
  app.get("/api/my/dogs", requireCustomer, async (req, res) => {
    const userId = (req as any).session.customerId as number;
    const r = await pool.query(`SELECT * FROM dogs WHERE user_id=$1 ORDER BY created_at DESC`, [userId]);
    res.json(r.rows);
  });

  // ── My club posts (all dogs of current user) ────────
  app.get("/api/club/my-posts", requireCustomer, async (req, res) => {
    const userId = (req as any).session.customerId as number;
    try {
      const r = await pool.query(`
        SELECT cp.*, d.slug AS dog_slug, d.name AS dog_name, d.avatar_url AS dog_avatar
        FROM club_posts cp
        JOIN dogs d ON d.id = cp.dog_id
        WHERE d.user_id = $1
        ORDER BY cp.created_at DESC
        LIMIT 100
      `, [userId]);
      res.json(r.rows.map((p: any) => ({ ...p, timeAgo: timeAgo(new Date(p.created_at)) })));
    } catch (e: any) {
      console.error("[club my-posts]", e?.message);
      res.json([]);
    }
  });

  // ── Direct messages ─────────────────────────────────
  app.get("/api/club/messages", requireCustomer, async (req, res) => {
    const userId = (req as any).session.customerId as number;
    try {
      const r = await pool.query(`
        SELECT t.*,
          CASE WHEN t.user_a_id = $1 THEN t.user_b_id ELSE t.user_a_id END AS other_user_id,
          CASE WHEN t.user_a_id = $1 THEN t.dog_b_slug ELSE t.dog_a_slug END AS other_dog_slug
        FROM club_dm_threads t
        WHERE t.user_a_id = $1 OR t.user_b_id = $1
        ORDER BY COALESCE(t.last_message_at, t.created_at) DESC
        LIMIT 50
      `, [userId]);
      const threads = [];
      for (const row of r.rows) {
        let otherDogName = row.other_dog_slug || "Üye";
        let otherDogAvatar: string | null = null;
        if (row.other_dog_slug) {
          const d = await pool.query(`SELECT name, avatar_url FROM dogs WHERE slug=$1 LIMIT 1`, [row.other_dog_slug]);
          if (d.rows[0]) {
            otherDogName = d.rows[0].name;
            otherDogAvatar = d.rows[0].avatar_url;
          }
        } else {
          const c = await pool.query(`SELECT name FROM customers WHERE id=$1`, [row.other_user_id]);
          if (c.rows[0]) otherDogName = c.rows[0].name;
        }
        threads.push({
          id: row.id,
          otherDogSlug: row.other_dog_slug || undefined,
          otherDogName,
          otherDogAvatar,
          otherCustomerName: otherDogName,
          lastMessage: row.last_message || "",
          lastMessageAt: row.last_message_at,
          unreadCount: 0,
        });
      }
      res.json(threads);
    } catch (e: any) {
      console.error("[club messages list]", e?.message);
      res.json([]);
    }
  });

  app.get("/api/club/messages/:threadId", requireCustomer, async (req, res) => {
    const userId = (req as any).session.customerId as number;
    const threadId = parseInt(String(req.params.threadId), 10);
    if (!Number.isFinite(threadId)) return res.status(400).json({ message: "Geçersiz thread" });
    try {
      const t = await pool.query(
        `SELECT * FROM club_dm_threads WHERE id=$1 AND (user_a_id=$2 OR user_b_id=$2)`,
        [threadId, userId]
      );
      if (!t.rows[0]) return res.status(404).json({ message: "Konuşma bulunamadı" });
      const msgs = await pool.query(
        `SELECT id, body, created_at, sender_id FROM club_dm_messages WHERE thread_id=$1 ORDER BY id ASC LIMIT 200`,
        [threadId]
      );
      res.json(msgs.rows.map((m: any) => ({
        id: m.id,
        body: m.body,
        created_at: m.created_at,
        isMine: m.sender_id === userId,
      })));
    } catch {
      res.json([]);
    }
  });

  app.post("/api/club/messages", requireCustomer, async (req, res) => {
    const userId = (req as any).session.customerId as number;
    const body = String(req.body?.body || "").trim();
    const toDogSlug = String(req.body?.toDogSlug || "").trim();
    if (!body) return res.status(400).json({ message: "Mesaj gerekli" });
    if (!toDogSlug) return res.status(400).json({ message: "Alıcı gerekli" });
    try {
      const dog = await pool.query(`SELECT id, user_id, slug, name FROM dogs WHERE slug=$1`, [toDogSlug]);
      if (!dog.rows[0]) return res.status(404).json({ message: "Profil bulunamadı" });
      const otherId = dog.rows[0].user_id as number;
      if (otherId === userId) return res.status(400).json({ message: "Kendinize mesaj gönderemezsiniz" });
      const a = Math.min(userId, otherId);
      const b = Math.max(userId, otherId);
      let thread = await pool.query(
        `SELECT * FROM club_dm_threads WHERE user_a_id=$1 AND user_b_id=$2`,
        [a, b]
      );
      if (!thread.rows[0]) {
        const myDog = await pool.query(`SELECT slug FROM dogs WHERE user_id=$1 ORDER BY id ASC LIMIT 1`, [userId]);
        const dogASlug = userId === a ? (myDog.rows[0]?.slug || null) : toDogSlug;
        const dogBSlug = userId === b ? (myDog.rows[0]?.slug || null) : toDogSlug;
        thread = await pool.query(
          `INSERT INTO club_dm_threads (user_a_id, user_b_id, dog_a_slug, dog_b_slug, last_message, last_message_at)
           VALUES ($1,$2,$3,$4,$5,NOW()) RETURNING *`,
          [a, b, dogASlug, dogBSlug, body.slice(0, 500)]
        );
      } else {
        await pool.query(
          `UPDATE club_dm_threads SET last_message=$1, last_message_at=NOW() WHERE id=$2`,
          [body.slice(0, 500), thread.rows[0].id]
        );
      }
      const threadId = thread.rows[0].id;
      await pool.query(
        `INSERT INTO club_dm_messages (thread_id, sender_id, body) VALUES ($1,$2,$3)`,
        [threadId, userId, body.slice(0, 4000)]
      );
      res.json({ ok: true, threadId, id: threadId });
    } catch (e: any) {
      console.error("[club messages create]", e?.message);
      res.status(500).json({ message: "Mesaj gönderilemedi" });
    }
  });

  app.post("/api/club/messages/:threadId", requireCustomer, async (req, res) => {
    const userId = (req as any).session.customerId as number;
    const threadId = parseInt(String(req.params.threadId), 10);
    const body = String(req.body?.body || "").trim();
    if (!Number.isFinite(threadId) || !body) return res.status(400).json({ message: "Geçersiz istek" });
    try {
      const t = await pool.query(
        `SELECT * FROM club_dm_threads WHERE id=$1 AND (user_a_id=$2 OR user_b_id=$2)`,
        [threadId, userId]
      );
      if (!t.rows[0]) return res.status(404).json({ message: "Konuşma bulunamadı" });
      await pool.query(
        `INSERT INTO club_dm_messages (thread_id, sender_id, body) VALUES ($1,$2,$3)`,
        [threadId, userId, body.slice(0, 4000)]
      );
      await pool.query(
        `UPDATE club_dm_threads SET last_message=$1, last_message_at=NOW() WHERE id=$2`,
        [body.slice(0, 500), threadId]
      );
      res.json({ ok: true });
    } catch {
      res.status(500).json({ message: "Mesaj gönderilemedi" });
    }
  });

  // ── Dog's posts ─────────────────────────────────────
  app.get("/api/dogs/:slug/posts", async (req, res) => {
    const userId = (req as any).session?.customerId;
    const dog = await pool.query(`SELECT * FROM dogs WHERE slug=$1`, [req.params.slug]);
    if (!dog.rows.length) return res.status(404).json({ message: "Bulunamadı" });
    const isOwner = userId === dog.rows[0].user_id;
    let followStatus = null;
    if (userId) {
      const f = await pool.query(`SELECT status FROM dog_follows WHERE follower_user_id=$1 AND dog_id=$2`, [userId, dog.rows[0].id]);
      followStatus = f.rows[0]?.status ?? null;
    }
    const canSee = !dog.rows[0].is_private || isOwner || followStatus === "active";
    if (!canSee) return res.json([]);
    const r = await pool.query(`
      SELECT cp.*
      FROM club_posts cp WHERE cp.dog_id=$1 ORDER BY cp.created_at DESC LIMIT 30
    `, [dog.rows[0].id]);
    res.json(r.rows.map(p => ({ ...p, timeAgo: timeAgo(new Date(p.created_at)) })));
  });

  // ── Weight log ─────────────────────────────────────
  app.get("/api/dogs/:slug/weight-log", requireCustomer, async (req, res) => {
    const userId = (req as any).session.customerId as number;
    const dog = await pool.query(`SELECT * FROM dogs WHERE slug=$1 AND user_id=$2`, [req.params.slug, userId]);
    if (!dog.rows.length) return res.status(403).json({ message: "Yetkisiz" });
    const r = await pool.query(`SELECT * FROM dog_weight_log WHERE dog_id=$1 ORDER BY measured_at DESC, id DESC LIMIT 50`, [dog.rows[0].id]);
    res.json(r.rows);
  });

  app.post("/api/dogs/:slug/weight-log", requireCustomer, async (req, res) => {
    const userId = (req as any).session.customerId as number;
    const dog = await pool.query(`SELECT * FROM dogs WHERE slug=$1 AND user_id=$2`, [req.params.slug, userId]);
    if (!dog.rows.length) return res.status(403).json({ message: "Yetkisiz" });
    const { weight_kg, note, measured_at } = req.body;
    if (!weight_kg || isNaN(Number(weight_kg))) return res.status(400).json({ message: "Geçerli kilo girin" });
    const r = await pool.query(
      `INSERT INTO dog_weight_log (dog_id, weight_kg, note, measured_at) VALUES ($1,$2,$3,$4) RETURNING *`,
      [dog.rows[0].id, Number(weight_kg), note || null, measured_at || null]
    );
    // Also update dog's current weight
    await pool.query(`UPDATE dogs SET weight_kg=$1 WHERE id=$2`, [Number(weight_kg), dog.rows[0].id]);
    res.json(r.rows[0]);
  });

  app.delete("/api/dogs/:slug/weight-log/:id", requireCustomer, async (req, res) => {
    const userId = (req as any).session.customerId as number;
    const dog = await pool.query(`SELECT * FROM dogs WHERE slug=$1 AND user_id=$2`, [req.params.slug, userId]);
    if (!dog.rows.length) return res.status(403).json({ message: "Yetkisiz" });
    await pool.query(`DELETE FROM dog_weight_log WHERE id=$1 AND dog_id=$2`, [parseInt(String(req.params.id)), dog.rows[0].id]);
    res.json({ ok: true });
  });

  // ── Vet visits ─────────────────────────────────────
  app.get("/api/dogs/:slug/vet-visits", requireCustomer, async (req, res) => {
    const userId = (req as any).session.customerId as number;
    const dog = await pool.query(`SELECT * FROM dogs WHERE slug=$1 AND user_id=$2`, [req.params.slug, userId]);
    if (!dog.rows.length) return res.status(403).json({ message: "Yetkisiz" });
    const r = await pool.query(`SELECT * FROM dog_vet_visits WHERE dog_id=$1 ORDER BY visit_date DESC`, [dog.rows[0].id]);
    res.json(r.rows);
  });

  app.post("/api/dogs/:slug/vet-visits", requireCustomer, async (req, res) => {
    const userId = (req as any).session.customerId as number;
    const dog = await pool.query(`SELECT * FROM dogs WHERE slug=$1 AND user_id=$2`, [req.params.slug, userId]);
    if (!dog.rows.length) return res.status(403).json({ message: "Yetkisiz" });
    const { visit_date, vet_name, visit_type, notes, next_visit_date } = req.body;
    if (!visit_date) return res.status(400).json({ message: "Ziyaret tarihi zorunlu" });
    const r = await pool.query(
      `INSERT INTO dog_vet_visits (dog_id, visit_date, vet_name, visit_type, notes, next_visit_date)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [dog.rows[0].id, visit_date, vet_name || null, visit_type || "Rutin Kontrol", notes || null, next_visit_date || null]
    );
    res.json(r.rows[0]);
  });

  app.delete("/api/dogs/:slug/vet-visits/:id", requireCustomer, async (req, res) => {
    const userId = (req as any).session.customerId as number;
    const dog = await pool.query(`SELECT * FROM dogs WHERE slug=$1 AND user_id=$2`, [req.params.slug, userId]);
    if (!dog.rows.length) return res.status(403).json({ message: "Yetkisiz" });
    await pool.query(`DELETE FROM dog_vet_visits WHERE id=$1 AND dog_id=$2`, [parseInt(String(req.params.id)), dog.rows[0].id]);
    res.json({ ok: true });
  });

  // ── Dog photos (gallery) ───────────────────────────
  app.get("/api/dogs/:slug/photos", async (req, res) => {
    const dog = await pool.query(`SELECT id FROM dogs WHERE slug=$1`, [req.params.slug]);
    if (!dog.rows.length) return res.status(404).json({ message: "Bulunamadı" });
    const r = await pool.query(`SELECT * FROM dog_photos WHERE dog_id=$1 ORDER BY "order" ASC, created_at DESC LIMIT 100`, [dog.rows[0].id]);
    res.json(r.rows);
  });

  app.post("/api/dogs/:slug/photos", requireCustomer, async (req, res) => {
    const userId = (req as any).session.customerId as number;
    const dog = await pool.query(`SELECT id FROM dogs WHERE slug=$1 AND user_id=$2`, [req.params.slug, userId]);
    if (!dog.rows.length) return res.status(403).json({ message: "Yetkisiz" });
    const { imageBase64, caption } = req.body;
    if (!imageBase64) return res.status(400).json({ message: "Fotoğraf zorunlu" });
    if (String(imageBase64).length > 12 * 1024 * 1024) return res.status(400).json({ message: "Fotoğraf 5MB'tan büyük olamaz" });
    const count = await pool.query(`SELECT COUNT(*) AS cnt FROM dog_photos WHERE dog_id=$1`, [dog.rows[0].id]);
    if (parseInt(count.rows[0].cnt) >= 30) return res.status(400).json({ message: "En fazla 30 fotoğraf ekleyebilirsiniz" });
    let webpUrl: string;
    try {
      webpUrl = await toWebpDataUrl(imageBase64, { maxEdge: 1440, quality: 82 });
    } catch (err: any) {
      console.log(`[dogs] photo webp error: ${err?.message || err}`);
      return res.status(400).json({ message: "Fotoğraf işlenemedi" });
    }
    const r = await pool.query(
      `INSERT INTO dog_photos (dog_id, url, caption) VALUES ($1,$2,$3) RETURNING *`,
      [dog.rows[0].id, webpUrl, caption || null]
    );
    res.json(r.rows[0]);
  });

  app.delete("/api/dogs/:slug/photos/:photoId", requireCustomer, async (req, res) => {
    const userId = (req as any).session.customerId as number;
    const dog = await pool.query(`SELECT id FROM dogs WHERE slug=$1 AND user_id=$2`, [req.params.slug, userId]);
    if (!dog.rows.length) return res.status(403).json({ message: "Yetkisiz" });
    await pool.query(`DELETE FROM dog_photos WHERE id=$1 AND dog_id=$2`, [parseInt(String(req.params.photoId)), dog.rows[0].id]);
    res.json({ ok: true });
  });

  // ── Event registrations ────────────────────────────
  app.get("/api/yp/event-registrations", requireCustomer, async (req, res) => {
    const userId = (req as any).session.customerId as number;
    const r = await pool.query(`SELECT event_id FROM yp_event_registrations WHERE user_id=$1`, [userId]);
    res.json(r.rows.map((x: any) => x.event_id));
  });

  app.post("/api/yp/event-registrations/:eventId", requireCustomer, async (req, res) => {
    const userId = (req as any).session.customerId as number;
    const eventId = parseInt(String(req.params.eventId));
    try {
      await pool.query(`INSERT INTO yp_event_registrations (user_id, event_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`, [userId, eventId]);
      res.json({ ok: true });
    } catch (e: any) { res.status(500).json({ message: e.message }); }
  });

  app.delete("/api/yp/event-registrations/:eventId", requireCustomer, async (req, res) => {
    const userId = (req as any).session.customerId as number;
    const eventId = parseInt(String(req.params.eventId));
    await pool.query(`DELETE FROM yp_event_registrations WHERE user_id=$1 AND event_id=$2`, [userId, eventId]);
    res.json({ ok: true });
  });

  // ── Admin: event registrations overview ───────────
  app.get("/api/admin/yp-event-registrations", requireAdmin, (req, res, next) => {
    if (!sessionHasPermission(req, "club.moderate") && !sessionHasPermission(req, "customers.read")) {
      return res.status(403).json({ message: "Bu işlem için yetkiniz yok", permission: "club.moderate|customers.read" });
    }
    next();
  }, async (_req, res) => {
    try {
      const r = await pool.query(`
        SELECT er.event_id,
               COALESCE(e.title, 'Etkinlik #' || er.event_id) AS event_title,
               COUNT(*)::int AS count,
               json_agg(json_build_object('id', c.id, 'name', c.name, 'phone', c.phone) ORDER BY er.created_at DESC) AS attendees
        FROM yp_event_registrations er
        JOIN customers c ON c.id = er.user_id
        LEFT JOIN yp_events e ON e.id = er.event_id
        GROUP BY er.event_id, e.title
        ORDER BY count DESC, er.event_id
      `);
      res.json(r.rows);
    } catch (e: any) {
      console.error("[admin yp-event-registrations]", e?.message);
      res.status(500).json({ message: "Kayıtlar yüklenemedi" });
    }
  });

  // ── Admin: Club moderation ─────────────────────────
  app.get("/api/admin/club/posts", requireAdmin, requireClubMod, async (req, res) => {
    try {
      const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 40));
      const filter = String(req.query.visibility || "all");
      const params: any[] = [];
      let where = "WHERE 1=1";
      if (filter === "public" || filter === "hidden") {
        params.push(filter);
        where += ` AND cp.visibility = $${params.length}`;
      }
      params.push(limit);
      const r = await pool.query(
        `SELECT cp.id, cp.content, cp.visibility, cp.like_count, cp.comment_count, cp.created_at,
                cp.image_urls, cp.moderated_at, cp.moderated_by,
                d.name AS dog_name, c.name AS owner_name, c.phone AS owner_phone, c.id AS owner_id
         FROM club_posts cp
         LEFT JOIN dogs d ON d.id = cp.dog_id
         LEFT JOIN customers c ON c.id = cp.user_id
         ${where}
         ORDER BY cp.created_at DESC
         LIMIT $${params.length}`,
        params,
      );
      res.json(r.rows.map((p: any) => ({
        ...p,
        image_urls: typeof p.image_urls === "string" ? JSON.parse(p.image_urls) : (p.image_urls || []),
      })));
    } catch (e: any) {
      res.status(500).json({ message: e?.message || "Club postları alınamadı" });
    }
  });

  app.patch("/api/admin/club/posts/:id", requireAdmin, requireClubMod, async (req, res) => {
    try {
      const id = parseInt(String(req.params.id));
      if (!id) return res.status(400).json({ message: "Geçersiz id" });
      const visibility = String(req.body?.visibility || "").trim();
      if (!["public", "hidden"].includes(visibility)) {
        return res.status(400).json({ message: "visibility public|hidden olmalı" });
      }
      const adminUser = String((req as any).session?.adminUsername || (req as any).session?.userId || "admin");
      const r = await pool.query(
        `UPDATE club_posts SET visibility=$1, moderated_at=NOW(), moderated_by=$2 WHERE id=$3 RETURNING id, visibility`,
        [visibility, adminUser, id],
      );
      if (!r.rows[0]) return res.status(404).json({ message: "Post bulunamadı" });
      res.json(r.rows[0]);
    } catch (e: any) {
      res.status(500).json({ message: e?.message || "Güncellenemedi" });
    }
  });

  app.delete("/api/admin/club/posts/:id", requireAdmin, requireClubMod, async (req, res) => {
    try {
      const id = parseInt(String(req.params.id));
      if (!id) return res.status(400).json({ message: "Geçersiz id" });
      await pool.query(`DELETE FROM club_posts WHERE id=$1`, [id]);
      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ message: e?.message || "Silinemedi" });
    }
  });

  app.get("/api/admin/club/reports", requireAdmin, requireClubMod, async (_req, res) => {
    try {
      const r = await pool.query(
        `SELECT r.*, c.name AS reporter_name, c.phone AS reporter_phone
         FROM club_reports r
         LEFT JOIN customers c ON c.id = r.reporter_user_id
         ORDER BY r.created_at DESC LIMIT 100`,
      );
      res.json(r.rows);
    } catch (e: any) {
      res.status(500).json({ message: e?.message || "Şikayetler alınamadı" });
    }
  });

  app.patch("/api/admin/club/reports/:id", requireAdmin, requireClubMod, async (req, res) => {
    try {
      const id = parseInt(String(req.params.id));
      const status = String(req.body?.status || "closed");
      if (!["open", "closed"].includes(status)) return res.status(400).json({ message: "Geçersiz status" });
      const adminUser = String((req as any).session?.adminUsername || "admin");
      await pool.query(
        `UPDATE club_reports SET status=$1, resolved_at=NOW(), resolved_by=$2 WHERE id=$3`,
        [status, adminUser, id],
      );
      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ message: e?.message || "Güncellenemedi" });
    }
  });

  // ─── Admin: dog profiles ──────────────────────────────────────────────────
  app.get("/api/admin/dogs", requireAdmin, requireProductsWrite, async (req, res) => {
    try {
      const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
      const limit = Math.min(200, Math.max(1, Number(req.query.limit) || 50));
      const params: any[] = [];
      let where = "";
      if (q) {
        params.push(`%${q}%`);
        where = `WHERE (d.name ILIKE $1 OR d.slug ILIKE $1 OR c.name ILIKE $1 OR c.phone ILIKE $1)`;
      }
      params.push(limit);
      const r = await pool.query(
        `SELECT d.id, d.slug, d.name, d.breed, d.city, d.gender, d.is_public AS "isPublic",
                d.is_private AS "isPrivate", d.follower_count AS "followerCount",
                d.post_count AS "postCount", d.created_at AS "createdAt",
                c.id AS "ownerId", c.name AS "ownerName", c.phone AS "ownerPhone"
         FROM dogs d
         LEFT JOIN customers c ON c.id = d.user_id
         ${where}
         ORDER BY d.created_at DESC
         LIMIT $${params.length}`,
        params
      );
      res.json({ dogs: r.rows });
    } catch (e: any) {
      res.status(500).json({ message: e?.message || "Köpek listesi alınamadı" });
    }
  });

  app.patch("/api/admin/dogs/:id", requireAdmin, requireProductsWrite, async (req, res) => {
    try {
      const id = parseInt(String(req.params.id));
      if (isNaN(id)) return res.status(400).json({ message: "Geçersiz ID" });
      const sets: string[] = [];
      const params: any[] = [];
      let i = 1;
      if (req.body?.isPublic !== undefined) {
        sets.push(`is_public = $${i++}`);
        params.push(!!req.body.isPublic);
      }
      if (req.body?.isPrivate !== undefined) {
        sets.push(`is_private = $${i++}`);
        params.push(!!req.body.isPrivate);
      }
      if (req.body?.name !== undefined) {
        sets.push(`name = $${i++}`);
        params.push(String(req.body.name).slice(0, 80));
      }
      if (req.body?.city !== undefined) {
        sets.push(`city = $${i++}`);
        params.push(String(req.body.city).slice(0, 80) || null);
      }
      if (!sets.length) return res.status(400).json({ message: "Güncelleme yok" });
      sets.push(`updated_at = NOW()`);
      params.push(id);
      const r = await pool.query(
        `UPDATE dogs SET ${sets.join(", ")} WHERE id = $${i}
         RETURNING id, slug, name, is_public AS "isPublic", is_private AS "isPrivate", city`,
        params
      );
      if (!r.rows[0]) return res.status(404).json({ message: "Köpek yok" });
      res.json(r.rows[0]);
    } catch (e: any) {
      res.status(500).json({ message: e?.message || "Güncellenemedi" });
    }
  });

  app.delete("/api/admin/dogs/:id", requireAdmin, requireProductsWrite, async (req, res) => {
    try {
      const id = parseInt(String(req.params.id));
      await pool.query(`DELETE FROM dogs WHERE id = $1`, [id]);
      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ message: e?.message || "Silinemedi" });
    }
  });

  app.post("/api/club/posts/:id/report", requireCustomer, async (req, res) => {
    try {
      const id = parseInt(String(req.params.id));
      const userId = (req as any).session.customerId as number;
      const reason = String(req.body?.reason || "").slice(0, 500);
      const p = await pool.query(`SELECT id FROM club_posts WHERE id=$1`, [id]);
      if (!p.rows[0]) return res.status(404).json({ message: "Post yok" });
      await pool.query(
        `INSERT INTO club_reports (post_id, reporter_user_id, reason) VALUES ($1,$2,$3)`,
        [id, userId, reason || null],
      );
      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ message: e?.message || "Şikayet kaydedilemedi" });
    }
  });

  console.log("[dogs] Routes registered");
}
