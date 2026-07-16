import { findSeoPage, type SeoPageData } from "../client/src/lib/seo-data";
import { pool as sharedPool } from "./storage";
import { getStoreByHost, brandifyFor, commercifyFor, DEFAULT_STORE, type StoreConfig } from "@shared/stores";
import { getStoreGoogleConfig } from "./google-tags";

type ProductMeta = {
  id: number;
  name: string;
  price: number;
  img: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  longDescription: string | null;
};

const productCache = new Map<number, { data: ProductMeta | null; ts: number }>();
const PROD_TTL_MS = 5 * 60 * 1000;

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u")
    .replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function getProductMeta(id: number): Promise<ProductMeta | null> {
  const cached = productCache.get(id);
  if (cached && Date.now() - cached.ts < PROD_TTL_MS) return cached.data;
  try {
    const r = await sharedPool.query(
      `SELECT id, name, price, img, meta_title, meta_description, meta_keywords, long_description
         FROM products WHERE id = $1 AND is_active = true LIMIT 1`,
      [id],
    );
    if (r.rows.length === 0) {
      productCache.set(id, { data: null, ts: Date.now() });
      return null;
    }
    const row = r.rows[0];
    const data: ProductMeta = {
      id: row.id,
      name: row.name,
      price: row.price,
      img: row.img,
      metaTitle: row.meta_title,
      metaDescription: row.meta_description,
      metaKeywords: row.meta_keywords,
      longDescription: row.long_description,
    };
    productCache.set(id, { data, ts: Date.now() });
    return data;
  } catch {
    return null;
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function findSeoData(urlPath: string, store: StoreConfig): SeoPageData | undefined {
  const cleanPath = urlPath.split("?")[0].split("#")[0];
  const slug = cleanPath.replace(/^\/+/, "").replace(/\/+$/, "");
  if (!slug) return undefined;
  // Resolve the variant served by this store's commerce model so cargo domains
  // never emit local-only pages (and vice versa).
  return findSeoPage(slug, store);
}

function replaceTag(html: string, regex: RegExp, replacement: string): string {
  if (regex.test(html)) return html.replace(regex, replacement);
  return html.replace(/<\/head>/i, `  ${replacement}\n  </head>`);
}

/** Keep only safe id characters so a config value can't break out of the inline
 * script / attribute it gets embedded in. GTM/GA4/Ads ids are alnum + "-"/"_". */
function sanitizeGId(s: string): string {
  return String(s).replace(/[^A-Za-z0-9_-]/g, "");
}

/**
 * Inject THIS domain's own Google tags (Search Console verification, GTM, GA4,
 * Ads), keyed off the resolved store. Nothing is emitted unless the store sets
 * the matching value, so every domain is an independent Google property and an
 * unconfigured domain ships zero tracking.
 */
export function injectGoogleTags(html: string, store: StoreConfig): string {
  const g = store.google;
  if (!g) return html;
  let out = html;

  const head: string[] = [];
  if (g.siteVerification) {
    head.push(`<meta name="google-site-verification" content="${escapeHtml(g.siteVerification)}" />`);
  }
  const gtmId = g.gtmId ? sanitizeGId(g.gtmId) : "";
  if (gtmId) {
    head.push(
      `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');</script>`,
    );
  }
  const gtagIds = [...(g.ga4Ids || []), ...(g.adsIds || [])].map(sanitizeGId).filter(Boolean);
  if (gtagIds.length) {
    const configs = gtagIds.map((x) => `gtag('config','${x}');`).join("");
    head.push(
      `<script async src="https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gtagIds[0])}"></script>` +
        `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());${configs}</script>`,
    );
  }
  if (head.length) {
    out = out.replace(/<\/head>/i, `  ${head.join("\n  ")}\n  </head>`);
  }

  if (gtmId) {
    const noscript = `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(gtmId)}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`;
    out = out.replace(/<body([^>]*)>/i, (m) => `${m}\n    ${noscript}`);
  }

  return out;
}

/**
 * Per-domain identity tags applied to EVERY served page so each custom domain
 * presents its own brand: og:site_name, theme-color, app title and share image.
 */
// The static crawler block in client/index.html promises the LOCAL model
// (aynı gün kurye, kapıda ödeme, Samsun mahalle teslimatı). On a cargo /
// online-payment store those claims are FALSE and commercifyFor's phrase table
// does not cover this bespoke wording, so cargo stores get a purpose-built,
// nationwide-cargo crawler block instead of a rewrite of the local one.
function cargoSeoStaticBlock(store: StoreConfig): string {
  const name = escapeHtml(store.name);
  return (
    `<div id="seo-static" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);clip-path:inset(50%);white-space:nowrap;border:0;padding:0;margin:-1px;">\n` +
    `      <h1>${name} - Türkiye Geneli Hızlı Petshop Kargo</h1>\n` +
    `      <p>Kedi maması, köpek maması, kedi kumu ve evcil hayvan ürünlerini Türkiye'nin her yerine hızlı kargo ile gönderen online petshop. Güvenli online ödeme, 900'den fazla ürün.</p>\n` +
    `      <h2>Kedi Ürünleri ve Kedi Maması</h2>\n` +
    `      <p>Royal Canin, Pro Plan, Hill's, N&amp;D ve Reflex gibi premium kedi mama markaları, kedi kumu çeşitleri, kedi oyuncakları ve aksesuarları hızlı kargo ile adresinize gelir.</p>\n` +
    `      <h2>Köpek Ürünleri ve Köpek Maması</h2>\n` +
    `      <p>Yavru, yetişkin ve büyük ırk köpekler için tahıllı/tahılsız mamalar, ödül mamaları, tasma ve köpek aksesuarları Türkiye geneline kargo ile.</p>\n` +
    `      <h2>Kuş, Kemirgen ve Akvaryum Ürünleri</h2>\n` +
    `      <p>Muhabbet kuşu yemi, hamster mamaları, akvaryum balık yemleri ve aksesuarlar geniş çeşitle Türkiye geneline kargolanır.</p>\n` +
    `      <h2>Kampanya ve İndirimler</h2>\n` +
    `      <p>Haftalık petshop kampanyaları, sepet indirimleri, ücretsiz kargo fırsatları.</p>\n` +
    `      <img src="/og-image.webp" alt="${name} online petshop Türkiye geneli kargo" width="1" height="1" />\n` +
    `      <nav aria-label="Site içi linkler">\n` +
    `        <ul>\n` +
    `          <li><a href="/kategori/kedi">Kedi maması ve kedi ürünleri</a></li>\n` +
    `          <li><a href="/kategori/kopek">Köpek maması ve köpek ürünleri</a></li>\n` +
    `          <li><a href="/kategori/kus">Kuş yemi ve kafes ürünleri</a></li>\n` +
    `          <li><a href="/kategori/kemirgen">Kemirgen mamaları</a></li>\n` +
    `          <li><a href="/kategori/akvaryum">Akvaryum balık ve aksesuarları</a></li>\n` +
    `          <li><a href="/markalar">Petshop markaları</a></li>\n` +
    `          <li><a href="/kampanya">Kampanyalı petshop ürünleri</a></li>\n` +
    `          <li><a href="/blog">Pet bakım rehberi blog</a></li>\n` +
    `          <li><a href="/iletisim">İletişim</a></li>\n` +
    `          <li><a href="/hakkimizda">Hakkımızda</a></li>\n` +
    `        </ul>\n` +
    `      </nav>\n` +
    `    </div>`
  );
}

function applyGlobalBranding(html: string, store: StoreConfig): string {
  let out = html;
  const isCargo = store.commerce.fulfillment === "cargo";
  const ogImage = `${store.domain}${store.seo.ogImage}`;
  out = replaceTag(out, /<meta\s+property="og:site_name"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:site_name" content="${escapeHtml(store.name)}" />`);
  out = replaceTag(out, /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:image" content="${escapeHtml(ogImage)}" />`);
  out = replaceTag(out, /<meta\s+name="theme-color"\s+content="[^"]*"\s*\/?>/i, `<meta name="theme-color" content="${store.theme.topBar}" />`);
  out = replaceTag(out, /<meta\s+name="apple-mobile-web-app-title"\s+content="[^"]*"\s*\/?>/i, `<meta name="apple-mobile-web-app-title" content="${escapeHtml(store.shortName)}" />`);

  // Static crawler-visible SEO block (hidden seo-static div). Cargo stores get a
  // nationwide-cargo block (the local one's same-day/kapıda/mahalle promises are
  // false for them); local/default stores keep the block, brandified to their domain.
  out = out.replace(/<div id="seo-static"[^>]*>[\s\S]*?<\/div>/i, (block) =>
    isCargo ? cargoSeoStaticBlock(store) : brandifyFor(store, block),
  );

  // Brandify the static JSON-LD fallback block: brand name and self-referential
  // URLs (url/image/logo) follow the request domain. Contact identifiers (email +
  // sameAs social handles) point to the single real business shared across the
  // non-default brands ("tek mutfak, çok tabela"), so for THOSE they are preserved
  // as-is (not domain-rewritten). The flagship, however, was renamed off the shared
  // JETGO/jetgomarket identity, so it uses its OWN config email/social instead of
  // inheriting the static block's legacy jetgomarket handles.
  out = out.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/i, (block) => {
    const origEmail = block.match(/"email":\s*"[^"]*"/i)?.[0];
    const origSameAs = block.match(/"sameAs":\s*\[[\s\S]*?\]/i)?.[0];
    let b = brandifyFor(store, block);
    if (store.id === DEFAULT_STORE.id) {
      b = b.replace(/"email":\s*"[^"]*"/i, `"email": ${JSON.stringify(store.email)}`);
      b = b.replace(/"sameAs":\s*\[[\s\S]*?\]/i, `"sameAs": ${JSON.stringify(store.social)}`);
    } else {
      if (origEmail) b = b.replace(/"email":\s*"[^"]*"/i, origEmail);
      if (origSameAs) b = b.replace(/"sameAs":\s*\[[\s\S]*?\]/i, origSameAs);
    }
    // Cargo stores ship nationwide: the static block's Samsun-neighborhood
    // areaServed is a false local-delivery claim, so collapse it to Türkiye.
    if (isCargo) {
      b = b.replace(/"areaServed":\s*\[[\s\S]*?\]/i, `"areaServed": {"@type":"Country","name":"Türkiye"}`);
    }
    return b;
  });

  return out;
}

/**
 * Inject SEO meta tags for known SEO landing pages. Title/description/keywords
 * come from the shared SEO content table; canonical & og:url are bound to the
 * REQUEST domain so each site self-canonicalizes and ranks independently.
 */
function injectSeoMeta(html: string, urlPath: string, store: StoreConfig): string {
  const data = findSeoData(urlPath, store);
  if (!data) return html;

  // Compose: rewrite false local delivery/payment claims for cargo stores
  // (commercifyFor), THEN brand to this domain. No-op for local/default stores.
  const bc = (t: string) => brandifyFor(store, commercifyFor(store, t));

  const title = escapeHtml(bc(data.metaTitle || data.title));
  const description = escapeHtml(bc(data.metaDescription || ""));
  const canonical = `${store.domain}/${data.slug}`;
  const keywords = data.keywords ? escapeHtml(brandifyFor(store, data.keywords)) : "";

  let out = html;

  out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
  out = out.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${description}" />`,
  );
  out = out.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${title}" />`,
  );
  out = out.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${description}" />`,
  );
  out = replaceTag(out, /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${canonical}" />`);
  out = replaceTag(out, /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${canonical}" />`);

  const extras: string[] = [];
  if (keywords && !/<meta\s+name=["']keywords["']/i.test(out)) {
    extras.push(`<meta name="keywords" content="${keywords}" />`);
  } else if (keywords) {
    out = out.replace(
      /<meta\s+name=["']keywords["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta name="keywords" content="${keywords}" />`,
    );
  }
  if (!/<meta\s+name=["']twitter:title["']/i.test(out)) {
    extras.push(`<meta name="twitter:card" content="summary_large_image" />`);
    extras.push(`<meta name="twitter:title" content="${title}" />`);
    extras.push(`<meta name="twitter:description" content="${description}" />`);
  } else {
    out = out.replace(
      /<meta\s+name=["']twitter:title["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta name="twitter:title" content="${title}" />`,
    );
    out = out.replace(
      /<meta\s+name=["']twitter:description["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta name="twitter:description" content="${description}" />`,
    );
  }

  if (data.h1 && data.intro && data.intro.length > 0) {
    const h1 = escapeHtml(bc(data.h1));
    const introHtml = data.intro
      .map((p) => `<p>${escapeHtml(bc(p))}</p>`)
      .join("\n");
    const noscriptBlock =
      `<noscript>\n` +
      `<h1>${h1}</h1>\n` +
      `${introHtml}\n` +
      `</noscript>`;
    out = out.replace(
      /<div id="root"><\/div>/i,
      `<div id="root"></div>\n${noscriptBlock}`,
    );
  }

  if (extras.length) {
    out = out.replace(
      /<\/head>/i,
      `  ${extras.join("\n  ")}\n  </head>`,
    );
  }

  // AI/no-JS tarayıcılar (LLM botları, AI Overviews) için yapısal veriyi sunucu
  // tarafında bas: client JS çalışmadan da BreadcrumbList + FAQPage HTML'de olur.
  const ldBlocks: string[] = [];
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: store.domain },
      { "@type": "ListItem", position: 2, name: brandifyFor(store, data.title), item: canonical },
    ],
  };
  ldBlocks.push(JSON.stringify(breadcrumb));
  if (data.faq && data.faq.length > 0) {
    const faq = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: data.faq.map((q) => ({
        "@type": "Question",
        name: bc(q.q),
        acceptedAnswer: { "@type": "Answer", text: bc(q.a) },
      })),
    };
    ldBlocks.push(JSON.stringify(faq));
  }
  const ldScripts = ldBlocks
    .map((b) => `<script type="application/ld+json">${b.replace(/</g, "\\u003c")}</script>`)
    .join("\n  ");
  out = out.replace(/<\/head>/i, `  ${ldScripts}\n  </head>`);

  return out;
}

function injectProductMeta(html: string, p: ProductMeta, urlPath: string, store: StoreConfig): string {
  const cleanPath = urlPath.split("?")[0].split("#")[0];
  const slug = slugify(p.name);
  const canonical = `${store.domain}/urun/${p.id}/${slug}`;
  const title = escapeHtml(p.metaTitle || `${p.name} - Samsun Petshop | ${store.shortName}`);
  const description = escapeHtml(
    p.metaDescription ||
      `${p.name} en uygun fiyatla ${store.name}'ta. Aynı gün teslimat, kapıda ödeme. ${p.price} TL.`,
  );
  const keywords = p.metaKeywords ? escapeHtml(p.metaKeywords) : "";
  const image = p.img && /^https?:\/\//.test(p.img) ? p.img : `${store.domain}${store.seo.ogImage}`;

  let out = html;
  out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
  out = replaceTag(out, /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta name="description" content="${description}" />`);
  out = replaceTag(out, /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${title}" />`);
  out = replaceTag(out, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${description}" />`);
  out = replaceTag(out, /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${canonical}" />`);
  out = replaceTag(out, /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:image" content="${escapeHtml(image)}" />`);
  out = replaceTag(out, /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:type" content="product" />`);
  out = replaceTag(out, /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${canonical}" />`);
  if (keywords) {
    out = replaceTag(out, /<meta\s+name=["']keywords["']\s+content=["'][^"']*["']\s*\/?>/i, `<meta name="keywords" content="${keywords}" />`);
  }
  out = replaceTag(out, /<meta\s+name=["']twitter:title["']\s+content=["'][^"']*["']\s*\/?>/i, `<meta name="twitter:title" content="${title}" />`);
  out = replaceTag(out, /<meta\s+name=["']twitter:description["']\s+content=["'][^"']*["']\s*\/?>/i, `<meta name="twitter:description" content="${description}" />`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    image,
    description: p.metaDescription || p.longDescription?.replace(/<[^>]+>/g, "").slice(0, 300) || p.name,
    sku: String(p.id),
    brand: { "@type": "Brand", name: store.shortName },
    offers: {
      "@type": "Offer",
      url: canonical,
      priceCurrency: "TRY",
      price: p.price,
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: store.name },
    },
  };
  const ldScript = `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>`;
  out = out.replace(/<\/head>/i, `  ${ldScript}\n  </head>`);

  const noscript = `<noscript>\n<h1>${escapeHtml(p.name)}</h1>\n<p>${description}</p>\n<p>Fiyat: ${p.price} TL</p>\n</noscript>`;
  out = out.replace(/<div id="root"><\/div>/i, `<div id="root"></div>\n${noscript}`);

  void cleanPath;
  return out;
}

/**
 * Homepage and any non-SEO/non-product route: apply the store's homepage
 * defaults and bind canonical/og:url to this domain + path.
 */
function injectHomeMeta(html: string, urlPath: string, store: StoreConfig): string {
  const cleanPath = urlPath.split("?")[0].split("#")[0] || "/";
  const canonical = `${store.domain}${cleanPath}`;
  const title = escapeHtml(store.seo.title);
  const description = escapeHtml(store.seo.description);
  const keywords = escapeHtml(store.seo.keywords);

  let out = html;
  out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
  out = replaceTag(out, /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta name="description" content="${description}" />`);
  out = replaceTag(out, /<meta\s+name=["']keywords["']\s+content=["'][^"']*["']\s*\/?>/i, `<meta name="keywords" content="${keywords}" />`);
  out = replaceTag(out, /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${title}" />`);
  out = replaceTag(out, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${description}" />`);
  out = replaceTag(out, /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${canonical}" />`);
  out = replaceTag(out, /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${canonical}" />`);
  return out;
}

const PRODUCT_PATH_RE = /^\/urun\/(\d+)(?:\/[^/?#]*)?\/?$/;

// ── YourPoodle SEO infrastructure ─────────────────────────────────────────────

const YP_BASE = "https://www.yourpoodle.com";
const YP_OG_IMAGE = `${YP_BASE}/og-image.webp`;

interface YPMeta {
  title: string;       // target 50-60 chars
  description: string; // target 140-160 chars
  keywords: string;
  noindex?: boolean;
  schemaType: "home" | "guide" | "tool" | "community" | "app" | "event";
  breadcrumb: Array<{ name: string; href: string }>;
}

const YP_ROUTE_META: Record<string, YPMeta> = {
  "/yourpoodle": {
    title: "Toy Poodle Rehberi, Bakımı ve Mama Seçimi | YourPoodle",
    description: "Toy Poodle bakımı, eğitimi, mama seçimi, sağlık rehberleri, ürünler ve uzman önerileri YourPoodle'da. Poodle'ınız için her şey tek yerde.",
    keywords: "toy poodle, poodle bakım, poodle mama, poodle eğitim, poodle sağlık, miniature poodle, poodle rehber",
    schemaType: "home",
    breadcrumb: [{ name: "Ana Sayfa", href: "/" }],
  },
  "/yourpoodle/rehber": {
    title: "Toy Poodle Bakım, Eğitim ve Sağlık Rehberleri | YourPoodle",
    description: "Toy Poodle için yavru bakımı, tüy bakımı, tıraş rehberi, tuvalet eğitimi, sağlık belirtileri ve bakım ipuçları. Poodle sahipleri için kapsamlı rehber kaynağı.",
    keywords: "toy poodle bakım, poodle eğitim, poodle sağlık, poodle tıraş, yavru poodle, poodle rehber",
    schemaType: "guide",
    breadcrumb: [{ name: "Ana Sayfa", href: "/" }, { name: "Rehber", href: "/yourpoodle/rehber" }],
  },
  "/yourpoodle/mama": {
    title: "Toy Poodle Mama Seçimi ve Beslenme Rehberi | YourPoodle",
    description: "Poodle için doğru mama seçimi, günlük porsiyon hesaplama, yaşa göre mama tavsiyeleri. Tahılsız ve hipoalerjenik mama karşılaştırması YourPoodle'da.",
    keywords: "toy poodle mama, poodle beslenme, poodle mama seçimi, tahılsız poodle mama, hipoalerjenik poodle mama",
    schemaType: "guide",
    breadcrumb: [{ name: "Ana Sayfa", href: "/" }, { name: "Mama Rehberi", href: "/yourpoodle/mama" }],
  },
  "/yourpoodle/mama-bul": {
    title: "Poodle İçin Doğru Mamayı Bul — Kişisel Öneri | YourPoodle",
    description: "11 soruluk sihirbazla Poodle'ınıza özel mama önerisi alın. Yaş, kilo, alerji ve bütçenize göre size en uygun 3 mama markasını keşfedin.",
    keywords: "poodle mama önerisi, hangi mama, poodle mama seç, mama hesaplama, poodle beslenme",
    schemaType: "tool",
    breadcrumb: [{ name: "Ana Sayfa", href: "/" }, { name: "Mama Bul", href: "/yourpoodle/mama-bul" }],
  },
  "/yourpoodle/egitim": {
    title: "Toy Poodle Eğitimi: Komutlar ve Davranış | YourPoodle",
    description: "Poodle tuvalet eğitimi, temel komutlar, havlama ve yalnız kalma sorunları için adım adım rehberler. Ödül bazlı eğitim yöntemleriyle hızlı sonuçlar.",
    keywords: "toy poodle eğitim, poodle tuvalet eğitimi, poodle komutlar, poodle havlama, poodle yalnız kalma",
    schemaType: "guide",
    breadcrumb: [{ name: "Ana Sayfa", href: "/" }, { name: "Eğitim Rehberi", href: "/yourpoodle/egitim" }],
  },
  "/yourpoodle/saglik": {
    title: "Toy Poodle Sağlığı: Belirtiler ve Koruma | YourPoodle",
    description: "Poodle sağlık belirtilerini tanıyın, aşı takvimini öğrenin ve önleyici bakım ipuçları edinin. Acil durum belirtileri ve veteriner tavsiyeleri.",
    keywords: "toy poodle sağlık, poodle aşı takvimi, poodle hastalıkları, poodle acil durum, poodle veteriner",
    schemaType: "guide",
    breadcrumb: [{ name: "Ana Sayfa", href: "/" }, { name: "Sağlık Rehberi", href: "/yourpoodle/saglik" }],
  },
  "/yourpoodle/bakim": {
    title: "Toy Poodle Bakımı: Tıraş, Tüy ve Günlük Bakım | YourPoodle",
    description: "Poodle tüy bakımı, tıraş modelleri, kulak temizliği ve göz altı leke bakımı rehberleri. Evde ve kuaförde poodle bakımı için pratik ipuçları.",
    keywords: "toy poodle tıraş, poodle tüy bakımı, poodle kulak bakımı, poodle göz lekesi, poodle bakım",
    schemaType: "guide",
    breadcrumb: [{ name: "Ana Sayfa", href: "/" }, { name: "Bakım Rehberi", href: "/yourpoodle/bakim" }],
  },
  "/yourpoodle/bilgi": {
    title: "Poodle Araçları: Mama, Yaş ve Kilo Hesaplama | YourPoodle",
    description: "Poodle için mama miktarı hesaplama, yaş dönüşümü, ideal kilo takibi, su ihtiyacı ve aşı takvimi araçları. Poodle sahiplerine özel ücretsiz hesaplama platformu.",
    keywords: "poodle mama hesaplama, poodle yaş hesaplama, poodle kilo hesaplama, poodle araçları",
    schemaType: "tool",
    breadcrumb: [{ name: "Ana Sayfa", href: "/" }, { name: "Bilgi Bankası", href: "/yourpoodle/bilgi" }],
  },
  "/yourpoodle/ai-asistan": {
    title: "AI Poodle Asistanı: Anlık Poodle Uzman Desteği | YourPoodle",
    description: "Poodle'ınız hakkında merak ettiklerinizi AI asistana sorun. Mama, bakım, eğitim, sağlık ve davranış sorularına kişiselleştirilmiş yanıtlar alın.",
    keywords: "poodle yapay zeka, poodle asistan, poodle soru cevap, AI poodle, poodle chatbot",
    schemaType: "app",
    breadcrumb: [{ name: "Ana Sayfa", href: "/" }, { name: "AI Asistan", href: "/yourpoodle/ai-asistan" }],
  },
  "/yourpoodle/club": {
    title: "Poodle Club: Topluluk ve Etkinlikler | YourPoodle",
    description: "YourPoodle Club'a katılın, poodle sahipleriyle bağlantı kurun. Fotoğraf paylaşımı, aylık yarışmalar ve poodle buluşmaları için Türkiye'nin poodle topluluğu.",
    keywords: "poodle club, poodle topluluğu, poodle sahipleri, poodle yarışması, poodle buluşma",
    schemaType: "community",
    breadcrumb: [{ name: "Ana Sayfa", href: "/" }, { name: "Poodle Club", href: "/yourpoodle/club" }],
  },
  "/yourpoodle/magaza": {
    title: "Poodle Ürünleri: Mama, Aksesuar ve Oyuncaklar | YourPoodle",
    description: "Toy Poodle için mama, ödül, tasma, yatak, oyuncak ve bakım ürünleri. Poodle sahiplerinin tercih ettiği ürünler, uygun fiyat ve hızlı teslimat.",
    keywords: "poodle ürünleri, poodle mama satın al, poodle aksesuar, poodle oyuncak, poodle bakım ürünleri",
    schemaType: "tool",
    breadcrumb: [{ name: "Ana Sayfa", href: "/" }, { name: "Mağaza", href: "/yourpoodle/magaza" }],
  },
  "/yourpoodle/topluluk": {
    title: "Poodle Topluluğu: Paylaşım ve Buluşmalar | YourPoodle",
    description: "Türkiye'nin poodle sahipleri ile buluşun, deneyim ve fotoğraf paylaşın. Poodle topluluğu etkinlikleri, anketler ve özel içerikler YourPoodle'da.",
    keywords: "poodle topluluğu, poodle sahipleri, poodle paylaşım, poodle forum, poodle sosyal",
    schemaType: "community",
    breadcrumb: [{ name: "Ana Sayfa", href: "/" }, { name: "Topluluk", href: "/yourpoodle/topluluk" }],
  },
  "/yourpoodle/etkinlikler": {
    title: "Poodle Etkinlikleri: Buluşmalar ve Yarışmalar | YourPoodle",
    description: "Yaklaşan poodle buluşmaları, online webinarlar, fotoğraf yarışmaları ve sosyal etkinlikler. Poodle sahipleri için Türkiye genelinde etkinlik takvimi.",
    keywords: "poodle etkinlikleri, poodle buluşma, poodle yarışması, poodle webinar, poodle takvimi",
    schemaType: "event",
    breadcrumb: [{ name: "Ana Sayfa", href: "/" }, { name: "Etkinlikler", href: "/yourpoodle/etkinlikler" }],
  },
  "/yourpoodle/poodle-ekle": {
    title: "Poodle Profilim: Poodle'ımı Platforma Ekle | YourPoodle",
    description: "Poodle'ınızın profilini oluşturun; adı, yaşı, kilosu ve fotoğrafını ekleyin. Kişiselleştirilmiş mama ve bakım önerileri alın, topluluğa katılın.",
    keywords: "poodle profil, poodle ekle, poodle kayıt, poodle sahipleri",
    schemaType: "app",
    breadcrumb: [{ name: "Ana Sayfa", href: "/" }, { name: "Poodle'ım", href: "/yourpoodle/poodle-ekle" }],
  },
  "/yourpoodle/profil": {
    title: "Poodle Profilim | YourPoodle",
    description: "Poodle'ınızın bilgilerini kaydedin, kişiselleştirilmiş bakım önerileri alın. YourPoodle profil sayfası.",
    keywords: "poodle profil, poodle bilgileri, poodle kaydı, yourpoodle hesap",
    schemaType: "guide",
    breadcrumb: [{ name: "Ana Sayfa", href: "/" }, { name: "Profilim", href: "/yourpoodle/profil" }],
  },
  "/yourpoodle/hakkinda": {
    title: "YourPoodle Hakkında: Platform, Ekip ve Metodoloji",
    description: "YourPoodle'un kuruluş hikayesi, içerik metodolojisi, veteriner danışman ekibi ve editöryal politikası. Toy Poodle rehberlerini nasıl hazırlıyoruz.",
    keywords: "yourpoodle hakkında, poodle platformu, poodle rehber ekibi, editöryal politika, veteriner danışman",
    schemaType: "guide",
    breadcrumb: [{ name: "Ana Sayfa", href: "/" }, { name: "Hakkımızda", href: "/yourpoodle/hakkinda" }],
  },
  "/yourpoodle/giris": {
    title: "Giriş Yap | YourPoodle",
    description: "YourPoodle hesabınıza giriş yapın veya ücretsiz üye olun.",
    keywords: "",
    noindex: true,
    schemaType: "app",
    breadcrumb: [],
  },
};

/** Build JSON-LD schema blocks for the given YP route */
function buildYPSchema(meta: YPMeta, canonical: string): string {
  const schemas: object[] = [];

  const breadcrumbListEl = meta.breadcrumb.length
    ? meta.breadcrumb.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.name,
        item: `${YP_BASE}${b.href}`,
      }))
    : null;

  if (meta.schemaType === "home") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "Toy Poodle ile Minyatür Poodle arasındaki fark nedir?", acceptedAnswer: { "@type": "Answer", text: "Toy Poodle genellikle 2-4 kg, Minyatür Poodle ise 4-9 kg ağırlığındadır. İkisi de zeki, eğitilebilir ve az dökülen tüylere sahiptir." } },
        { "@type": "Question", name: "Poodle'lar için en iyi mama hangisi?", acceptedAnswer: { "@type": "Answer", text: "Royal Canin Poodle, Pro Plan ve Hill's Science Plan poodle sahiplerinin en çok tercih ettiği markalardandır. YourPoodle mama bulma sihirbazı ile poodle'ınıza özel öneri alabilirsiniz." } },
        { "@type": "Question", name: "Poodle'lar ne sıklıkla tıraş yaptırılmalı?", acceptedAnswer: { "@type": "Answer", text: "Toy ve Minyatür Poodle'lar ortalama 6-8 haftada bir tıraş gerektirir. Tüyleri sürekli uzadığından düzenli bakım şarttır." } },
        { "@type": "Question", name: "Poodle'ımı evde yalnız bırakabilir miyim?", acceptedAnswer: { "@type": "Answer", text: "Poodle'lar sosyal köpeklerdir. Uzun süre yalnız kaldıklarında anksiyete yaşayabilirler. Günde 4-6 saatten fazla yalnız bırakmamaya çalışın." } },
        { "@type": "Question", name: "AI asistan gerçek veteriner yerine geçer mi?", acceptedAnswer: { "@type": "Answer", text: "Hayır. AI asistanımız genel bilgilendirme sağlar. Sağlık sorunları için mutlaka veteriner hekiminize başvurun." } },
      ],
    });
  }

  if (breadcrumbListEl && breadcrumbListEl.length > 1) {
    schemas.push({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: breadcrumbListEl });
  }

  if (["guide", "tool", "app"].includes(meta.schemaType) && meta.schemaType !== "home") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": meta.schemaType === "guide" ? "Article" : "WebApplication",
      "@id": canonical,
      url: canonical,
      name: meta.title,
      description: meta.description,
      publisher: { "@type": "Organization", name: "YourPoodle", url: YP_BASE },
      inLanguage: "tr-TR",
    });
  }

  return schemas.map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join("\n  ");
}

function injectYPMeta(html: string, urlPath: string, _store: StoreConfig): string {
  const meta = YP_ROUTE_META[urlPath] ?? YP_ROUTE_META["/yourpoodle"];
  const canonical = `${YP_BASE}${urlPath}`;
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);

  let out = html;

  // ── Replace existing standard meta tags ───────────────────────────────────
  out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
  out = replaceTag(out, /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta name="description" content="${description}" />`);
  if (meta.keywords) {
    out = replaceTag(out, /<meta\s+name=["']keywords["']\s+content="[^"]*"\s*\/?>/i, `<meta name="keywords" content="${escapeHtml(meta.keywords)}" />`);
  }
  out = replaceTag(out, /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${title}" />`);
  out = replaceTag(out, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${description}" />`);
  out = replaceTag(out, /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${canonical}" />`);
  out = replaceTag(out, /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:image" content="${YP_OG_IMAGE}" />`);
  out = replaceTag(out, /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:type" content="${urlPath === "/yourpoodle" ? "website" : "article"}" />`);
  out = replaceTag(out, /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${canonical}" />`);
  // Robots — replaceTag guarantees noindex/nofollow for private pages
  out = replaceTag(
    out,
    /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i,
    meta.noindex
      ? `<meta name="robots" content="noindex, nofollow" />`
      : `<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />`
  );

  // ── Remove previous YP extended block (idempotent) ──────────────────────
  out = out.replace(/\n?\s*<!-- yp-seo-ext-start -->[\s\S]*?<!-- yp-seo-ext-end -->/g, "");

  // ── Build extended block injected once before </head> ───────────────────
  const schemaHtml = buildYPSchema(meta, canonical);
  const googleVerif = process.env.GOOGLE_SITE_VERIFICATION ? `<meta name="google-site-verification" content="${escapeHtml(process.env.GOOGLE_SITE_VERIFICATION)}" />` : "";
  const bingVerif = process.env.BING_SITE_VERIFICATION ? `<meta name="msvalidate.01" content="${escapeHtml(process.env.BING_SITE_VERIFICATION)}" />` : "";

  const extTags = [
    `<meta property="og:locale" content="tr_TR" />`,
    `<meta property="og:site_name" content="YourPoodle" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${YP_OG_IMAGE}" />`,
    // hreflang — tr only for now; expand when /en/ /de/ etc. routes exist
    `<link rel="alternate" hreflang="tr" href="${canonical}" />`,
    `<link rel="alternate" hreflang="x-default" href="${YP_BASE}/" />`,
    googleVerif,
    bingVerif,
    schemaHtml,
  ].filter(Boolean).join("\n  ");

  out = out.replace(/<\/head>/i, `  <!-- yp-seo-ext-start -->\n  ${extTags}\n  <!-- yp-seo-ext-end -->\n</head>`);

  return out;
}

/**
 * Apply per-route, per-domain SEO metadata. `host` selects the active store so
 * every custom domain serves its own brand identity and self-canonicalizes.
 */
export async function injectAllMeta(html: string, urlPath: string, host?: string): Promise<string> {
  const store = getStoreByHost(host);
  let out = applyGlobalBranding(html, store);
  // DB'de admin tarafından girilmiş google config varsa statik koda gömülü
  // değeri tamamen ezer (boş bile olsa); yoksa statik koda gömülü değere düşülür.
  // Wrapped in try-catch: DB may not be ready on cold start; fall back to
  // static config so the healthcheck never sees a 500.
  let dbGoogle: Awaited<ReturnType<typeof getStoreGoogleConfig>> = null;
  try {
    dbGoogle = await getStoreGoogleConfig(store.id);
  } catch {
    // non-fatal — use static config
  }
  out = injectGoogleTags(out, dbGoogle ? { ...store, google: dbGoogle } : store);

  const cleanPath = urlPath.split("?")[0].split("#")[0];

  // YourPoodle sub-app: inject platform-specific meta for all /yourpoodle/* routes
  if (cleanPath.startsWith("/yourpoodle")) {
    return injectYPMeta(out, cleanPath, store);
  }

  const m = cleanPath.match(PRODUCT_PATH_RE);
  if (m) {
    const id = Number(m[1]);
    if (Number.isFinite(id)) {
      const prod = await getProductMeta(id);
      if (prod) return injectProductMeta(out, prod, cleanPath, store);
    }
    return injectHomeMeta(out, urlPath, store);
  }

  if (findSeoData(urlPath, store)) {
    return injectSeoMeta(out, urlPath, store);
  }

  return injectHomeMeta(out, urlPath, store);
}
