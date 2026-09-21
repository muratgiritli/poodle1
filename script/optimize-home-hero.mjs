// Generates responsive variants for the homepage hero image.
// The source is a 1024x1536 JPEG saved at a wasteful quality, so re-encoding to
// WebP cuts it by ~95% with no visible loss at the sizes the hero actually renders.
// Run: node script/optimize-home-hero.mjs
import { stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SOURCE = path.resolve("client/public/images/yp-home-hero.jpg");
const OUT_DIR = path.resolve("client/public/images");

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;

const meta = await sharp(SOURCE).metadata();
console.log(`source: ${meta.width}x${meta.height} ${kb((await stat(SOURCE)).size)}`);

const targets = [
  { file: "yp-home-hero-1024.webp", width: 1024, quality: 74, format: "webp" },
  { file: "yp-home-hero-640.webp", width: 640, quality: 76, format: "webp" },
  { file: "yp-home-hero-1024.jpg", width: 1024, quality: 78, format: "jpeg" },
];

for (const target of targets) {
  const out = path.join(OUT_DIR, target.file);
  const pipeline = sharp(SOURCE).resize({ width: target.width, withoutEnlargement: true });
  await (target.format === "webp"
    ? pipeline.webp({ quality: target.quality, effort: 6 })
    : pipeline.jpeg({ quality: target.quality, progressive: true, mozjpeg: true })
  ).toFile(out);
  console.log(`${target.file}: ${kb((await stat(out)).size)}`);
}
