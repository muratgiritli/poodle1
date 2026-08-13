import sharp from "sharp";
import { db } from "./storage";
import { productImages } from "@shared/schema";
import { eq } from "drizzle-orm";

/** Decode a data-URL or raw base64 string into a Buffer. */
function decodeImageInput(input: Buffer | string): Buffer {
  if (Buffer.isBuffer(input)) return input;
  const m = String(input).match(/^data:[^;]+;base64,(.+)$/s);
  return Buffer.from(m ? m[1] : String(input).replace(/^data:[^;]+;base64,/, ""), "base64");
}

/** Convert any image buffer/base64 to a WebP data URL (EXIF-rotated, size-capped). */
export async function toWebpDataUrl(
  input: Buffer | string,
  opts?: { maxEdge?: number; quality?: number; fit?: "inside" | "cover"; width?: number; height?: number },
): Promise<string> {
  const buffer = decodeImageInput(input);
  const quality = opts?.quality ?? 82;
  let pipeline = sharp(buffer).rotate();
  if (opts?.width && opts?.height) {
    pipeline = pipeline.resize(opts.width, opts.height, { fit: opts.fit || "cover" });
  } else {
    const maxEdge = opts?.maxEdge ?? 1440;
    pipeline = pipeline.resize(maxEdge, maxEdge, { fit: opts?.fit || "inside", withoutEnlargement: true });
  }
  const webpBuffer = await pipeline.webp({ quality }).toBuffer();
  return `data:image/webp;base64,${webpBuffer.toString("base64")}`;
}

/** Convert image buffer to WebP Buffer (for DB blob / disk storage). */
export async function toWebpBuffer(
  input: Buffer | string,
  opts?: { maxEdge?: number; quality?: number; fit?: "inside" | "cover"; width?: number; height?: number },
): Promise<Buffer> {
  const dataUrl = await toWebpDataUrl(input, opts);
  return decodeImageInput(dataUrl);
}

export async function saveProductImage(buffer: Buffer, productId: number): Promise<string> {
  const webpBuffer = await sharp(buffer)
    .rotate()
    .resize(800, 800, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  const base64 = webpBuffer.toString("base64");

  await db
    .insert(productImages)
    .values({ productId, data: base64, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: productImages.productId,
      set: { data: base64, updatedAt: new Date() },
    });

  const imgPath = `/api/product-image/${productId}?v=${Date.now()}`;
  console.log(`[image] Saved product ${productId} (${Math.round(webpBuffer.length / 1024)} KB)`);
  return imgPath;
}

export async function getProductImage(productId: number): Promise<Buffer | null> {
  const [row] = await db
    .select({ data: productImages.data })
    .from(productImages)
    .where(eq(productImages.productId, productId))
    .limit(1);

  if (!row) return null;
  return Buffer.from(row.data, "base64");
}

export async function downloadAndSaveImage(imageUrl: string, productId: number): Promise<string | null> {
  try {
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "image/*",
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      console.log(`[image] Download failed for product ${productId}: HTTP ${response.status}`);
      return null;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    return await saveProductImage(buffer, productId);
  } catch (err: any) {
    console.log(`[image] Error downloading product ${productId}: ${err.message}`);
    return null;
  }
}

export async function hasProductImage(productId: number): Promise<boolean> {
  const [row] = await db
    .select({ productId: productImages.productId })
    .from(productImages)
    .where(eq(productImages.productId, productId))
    .limit(1);
  return !!row;
}
