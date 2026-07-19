/**
 * YourPoodle — Dog profile, Club social feed, follow system, notifications.
 * Registered by calling registerDogRoutes(app, pool) from routes.ts.
 */
import type { Express, Request, Response, NextFunction } from "express";
import type { Pool } from "pg";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });

/* ─── Auth middleware ────────────────────────────────── */
function requireCustomer(req: Request, res: Response, next: NextFunction) {
  const s = (req as any).session;
  if (!s?.customerId) return res.status(401).json({ message: "Giriş yapılmamış" });
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

  console.log("[dogs] DB migration complete");
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
  await migrate(pool);

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
    const b64 = req.file.buffer.toString("base64");
    const mime = req.file.mimetype;
    // Delete old
    await pool.query(`DELETE FROM dog_images WHERE dog_id=$1`, [dog.rows[0].id]);
    await pool.query(`INSERT INTO dog_images (dog_id, data, mimetype) VALUES ($1,$2,$3)`, [dog.rows[0].id, b64, mime]);
    const avatarUrl = `/api/dogs/${dog.rows[0].slug}/avatar-img`;
    await pool.query(`UPDATE dogs SET avatar_url=$1, updated_at=NOW() WHERE id=$2`, [avatarUrl, dog.rows[0].id]);
    res.json({ avatarUrl });
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
             d.name AS dog_name, d.slug AS dog_slug, d.avatar_url,
             c.name AS owner_name,
             EXISTS(SELECT 1 FROM club_post_likes l WHERE l.post_id=cp.id AND l.user_id=$1) AS liked
      FROM club_posts cp
      JOIN dog_follows df ON df.dog_id=cp.dog_id AND df.follower_user_id=$1 AND df.status='active'
      LEFT JOIN dogs d ON d.id=cp.dog_id
      LEFT JOIN customers c ON c.id=cp.user_id
      WHERE cp.visibility='public' OR cp.user_id=$1
      ORDER BY cp.created_at DESC
      LIMIT $2 OFFSET $3
    `, [userId, limit, offset]);
    res.json(r.rows.map(p => ({ ...p, timeAgo: timeAgo(new Date(p.created_at)) })));
  });

  // ── Public explore feed (no auth needed) ───────────
  app.get("/api/club/public-feed", async (req, res) => {
    const limit = parseInt((req.query.limit as string) || "20");
    const offset = parseInt((req.query.offset as string) || "0");
    const r = await pool.query(`
      SELECT cp.*,
             d.name AS dog_name, d.slug AS dog_slug, d.avatar_url,
             c.name AS owner_name
      FROM club_posts cp
      LEFT JOIN dogs d ON d.id=cp.dog_id
      LEFT JOIN customers c ON c.id=cp.user_id
      WHERE cp.visibility='public'
      ORDER BY cp.created_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);
    const userId = (req as any).session?.customerId;
    const rows = r.rows.map(p => ({ ...p, liked: false, timeAgo: timeAgo(new Date(p.created_at)) }));
    if (userId) {
      for (const row of rows) {
        const l = await pool.query(`SELECT 1 FROM club_post_likes WHERE post_id=$1 AND user_id=$2`, [row.id, userId]);
        row.liked = l.rows.length > 0;
      }
    }
    res.json(rows);
  });

  // ── Create post ─────────────────────────────────────
  app.post("/api/club/posts", requireCustomer, async (req, res) => {
    const userId = (req as any).session.customerId as number;
    const { dogSlug, content, imageBase64, visibility = "public" } = req.body;
    if (!content?.trim() && !imageBase64) return res.status(400).json({ message: "İçerik veya fotoğraf zorunlu" });
    let dogId: number | null = null;
    let dogOwnerId: number | null = null;
    if (dogSlug) {
      const d = await pool.query(`SELECT id, user_id FROM dogs WHERE slug=$1`, [dogSlug]);
      if (d.rows.length) { dogId = d.rows[0].id; dogOwnerId = d.rows[0].user_id; }
    }
    if (dogId && dogOwnerId !== userId) return res.status(403).json({ message: "Bu köpek size ait değil" });
    const hashtags = content ? extractHashtags(content) : [];
    const imageUrls = imageBase64 ? [imageBase64] : [];
    const r = await pool.query(`
      INSERT INTO club_posts (dog_id, user_id, content, image_urls, hashtags, visibility)
      VALUES ($1,$2,$3,$4,$5,$6) RETURNING *
    `, [dogId, userId, content?.trim() || null, JSON.stringify(imageUrls), JSON.stringify(hashtags), visibility]);
    if (dogId) await pool.query(`UPDATE dogs SET post_count=post_count+1 WHERE id=$1`, [dogId]);
    res.status(201).json(r.rows[0]);
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
      WHERE cc.post_id=$1 ORDER BY cc.created_at ASC LIMIT 50
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
    res.status(201).json(r.rows[0]);
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
      popular: popular.rows.map(p => ({ ...p, timeAgo: timeAgo(new Date(p.created_at)) })),
      newDogs: newDogs.rows,
      cities: cities.rows,
    });
  });

  // ── Stories (last 24h photo posts from followed) ────
  app.get("/api/club/stories", requireCustomer, async (req, res) => {
    const userId = (req as any).session.customerId as number;
    const r = await pool.query(`
      SELECT DISTINCT ON (d.id) d.id, d.name, d.slug, d.avatar_url, cp.created_at
      FROM club_posts cp
      JOIN dogs d ON d.id=cp.dog_id
      JOIN dog_follows df ON df.dog_id=d.id AND df.follower_user_id=$1 AND df.status='active'
      WHERE cp.created_at > NOW()-INTERVAL '24 hours'
        AND jsonb_array_length(cp.image_urls) > 0
      ORDER BY d.id, cp.created_at DESC
      LIMIT 12
    `, [userId]);
    res.json(r.rows);
  });

  // ── My dogs (for post creation) ─────────────────────
  app.get("/api/my/dogs", requireCustomer, async (req, res) => {
    const userId = (req as any).session.customerId as number;
    const r = await pool.query(`SELECT * FROM dogs WHERE user_id=$1 ORDER BY created_at DESC`, [userId]);
    res.json(r.rows);
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

  console.log("[dogs] Routes registered");
}
