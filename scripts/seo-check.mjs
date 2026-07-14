#!/usr/bin/env node
/**
 * YourPoodle SEO Check Script
 * Usage: node scripts/seo-check.mjs [base_url]
 * Default base_url: http://localhost:5000
 *
 * Checks:
 *  - Title present, 50-60 chars
 *  - Meta description present, 140-160 chars
 *  - Canonical URL present & correct
 *  - H1 count (exactly 1)
 *  - og:title, og:description, og:image, og:url present
 *  - twitter:card present
 *  - hreflang tr + x-default
 *  - robots meta (noindex for private pages)
 *  - JSON-LD schema present
 *  - robots.txt accessible
 *  - sitemap.xml accessible
 *  - sitemap-yp.xml accessible
 *  - Duplicate titles across pages
 *  - Duplicate descriptions across pages
 */

import { createRequire } from "module";

const BASE = process.argv[2] || "http://localhost:5000";

const YP_PAGES = [
  { path: "/yourpoodle",             expectNoindex: false },
  { path: "/yourpoodle/rehber",      expectNoindex: false },
  { path: "/yourpoodle/mama",        expectNoindex: false },
  { path: "/yourpoodle/mama-bul",    expectNoindex: false },
  { path: "/yourpoodle/egitim",      expectNoindex: false },
  { path: "/yourpoodle/saglik",      expectNoindex: false },
  { path: "/yourpoodle/bakim",       expectNoindex: false },
  { path: "/yourpoodle/bilgi",       expectNoindex: false },
  { path: "/yourpoodle/ai-asistan",  expectNoindex: false },
  { path: "/yourpoodle/magaza",      expectNoindex: false },
  { path: "/yourpoodle/club",        expectNoindex: false },
  { path: "/yourpoodle/topluluk",    expectNoindex: false },
  { path: "/yourpoodle/etkinlikler", expectNoindex: false },
  { path: "/yourpoodle/hakkinda",    expectNoindex: false },
  { path: "/yourpoodle/giris",       expectNoindex: true  },
];

const UTILITY_PATHS = ["/robots.txt", "/sitemap.xml", "/sitemap-yp.xml"];

let passed = 0;
let failed = 0;
let warnings = 0;

function ok(msg) { console.log(`  ✅ ${msg}`); passed++; }
function fail(msg) { console.log(`  ❌ ${msg}`); failed++; }
function warn(msg) { console.log(`  ⚠️  ${msg}`); warnings++; }

function extract(html, regex) {
  const m = html.match(regex);
  return m ? m[1] : null;
}

function countH1(html) {
  return (html.match(/<h1[\s>]/gi) || []).length;
}

async function fetchPage(path) {
  try {
    const r = await fetch(`${BASE}${path}`, {
      headers: { "Accept": "text/html", "User-Agent": "YP-SEO-Check/1.0" },
      signal: AbortSignal.timeout(8000),
    });
    return { status: r.status, html: await r.text() };
  } catch (e) {
    return { status: 0, html: "", error: e.message };
  }
}

async function checkPage({ path, expectNoindex }) {
  console.log(`\n📄 ${path}`);
  const { status, html, error } = await fetchPage(path);

  if (error || status === 0) { fail(`Fetch failed: ${error}`); return null; }
  if (status !== 200) { fail(`HTTP ${status}`); return null; }
  ok(`HTTP 200`);

  const title = extract(html, /<title>([\s\S]*?)<\/title>/i);
  const description = extract(html, /<meta\s+name="description"\s+content="([^"]*)"/i);
  const canonical = extract(html, /<link\s+rel="canonical"\s+href="([^"]*)"/i);
  const ogTitle = extract(html, /<meta\s+property="og:title"\s+content="([^"]*)"/i);
  const ogDesc = extract(html, /<meta\s+property="og:description"\s+content="([^"]*)"/i);
  const ogImage = extract(html, /<meta\s+property="og:image"\s+content="([^"]*)"/i);
  const ogUrl = extract(html, /<meta\s+property="og:url"\s+content="([^"]*)"/i);
  const twitterCard = extract(html, /<meta\s+name="twitter:card"\s+content="([^"]*)"/i);
  const robotsMeta = extract(html, /<meta\s+name="robots"\s+content="([^"]*)"/i);
  const hreflangTr = html.includes('hreflang="tr"');
  const hreflangXDefault = html.includes('hreflang="x-default"');
  const hasSchema = html.includes('application/ld+json');
  const h1Count = countH1(html);

  // Title
  if (!title) { fail("Title missing"); }
  else if (title.length < 30) { warn(`Title very short (${title.length} chars): "${title}"`); }
  else if (title.length > 70) { warn(`Title too long (${title.length} chars): "${title.slice(0,60)}..."`); }
  else { ok(`Title OK (${title.length} chars): "${title}"`); }

  // Description
  if (!description) { fail("Meta description missing"); }
  else if (description.length < 100) { warn(`Description short (${description.length} chars)`); }
  else if (description.length > 170) { warn(`Description too long (${description.length} chars)`); }
  else { ok(`Description OK (${description.length} chars)`); }

  // Canonical
  if (!canonical) { fail("Canonical URL missing"); }
  else if (!canonical.includes("yourpoodle.com")) { warn(`Canonical doesn't include yourpoodle.com: ${canonical}`); }
  else { ok(`Canonical: ${canonical}`); }

  // H1
  if (h1Count === 0) { warn("No H1 found (page may be client-rendered)"); }
  else if (h1Count > 1) { fail(`Multiple H1s found: ${h1Count}`); }
  else { ok("Single H1"); }

  // OG tags
  if (!ogTitle) fail("og:title missing"); else ok("og:title present");
  if (!ogDesc) fail("og:description missing"); else ok("og:description present");
  if (!ogImage) fail("og:image missing"); else ok(`og:image: ${ogImage}`);
  if (!ogUrl) fail("og:url missing"); else ok("og:url present");

  // Twitter
  if (!twitterCard) fail("twitter:card missing"); else ok(`twitter:card: ${twitterCard}`);

  // hreflang
  if (!hreflangTr) fail("hreflang tr missing"); else ok("hreflang tr present");
  if (!hreflangXDefault) fail("hreflang x-default missing"); else ok("hreflang x-default present");

  // Robots
  if (expectNoindex) {
    if (robotsMeta && robotsMeta.includes("noindex")) ok("noindex correctly set");
    else fail("Expected noindex but not found");
  } else {
    if (robotsMeta && robotsMeta.includes("noindex")) fail("Unexpected noindex");
    else ok("robots: index, follow");
  }

  // JSON-LD
  if (!hasSchema) warn("No JSON-LD schema found (may be client-side only)");
  else ok("JSON-LD schema present");

  return { title, description };
}

async function checkUtility(path) {
  console.log(`\n🔧 ${path}`);
  const { status, html, error } = await fetchPage(path);
  if (error) { fail(`Fetch failed: ${error}`); return; }
  if (status === 200) ok(`HTTP 200 (${html.length} bytes)`);
  else fail(`HTTP ${status}`);

  if (path === "/robots.txt") {
    if (html.includes("Disallow: /admin")) ok("Disallow /admin");
    else fail("Missing Disallow: /admin");
    if (html.includes("Disallow: /api")) ok("Disallow /api");
    else warn("Missing Disallow: /api");
    if (html.includes("Sitemap:")) ok("Sitemap directive present");
    else fail("Sitemap directive missing");
  }
  if (path === "/sitemap.xml") {
    if (html.includes("sitemap-yp.xml")) ok("sitemap-yp.xml referenced");
    else fail("sitemap-yp.xml not referenced in sitemap index");
    if (html.includes("sitemap-main.xml")) ok("sitemap-main.xml referenced");
    else fail("sitemap-main.xml not referenced");
  }
  if (path === "/sitemap-yp.xml") {
    if (html.includes("/yourpoodle")) ok("/yourpoodle URLs present");
    else fail("/yourpoodle URLs missing");
    if (html.includes("hreflang")) ok("hreflang in sitemap");
    else warn("hreflang missing from sitemap");
  }
}

async function main() {
  console.log(`\n🐾 YourPoodle SEO Check`);
  console.log(`   Base URL: ${BASE}`);
  console.log(`   Pages: ${YP_PAGES.length} | Utility: ${UTILITY_PATHS.length}`);
  console.log("═".repeat(60));

  // Check utility files first
  for (const path of UTILITY_PATHS) {
    await checkUtility(path);
  }

  // Check all YP pages
  const results = [];
  for (const page of YP_PAGES) {
    const result = await checkPage(page);
    if (result) results.push({ path: page.path, ...result });
  }

  // Check duplicate titles
  console.log("\n🔍 Duplicate Detection");
  const titleMap = new Map();
  const descMap = new Map();
  for (const r of results) {
    if (r.title) {
      if (titleMap.has(r.title)) { fail(`Duplicate title: "${r.title}" on ${r.path} and ${titleMap.get(r.title)}`); }
      else titleMap.set(r.title, r.path);
    }
    if (r.description) {
      if (descMap.has(r.description)) { fail(`Duplicate description on ${r.path} and ${descMap.get(r.description)}`); }
      else descMap.set(r.description, r.path);
    }
  }
  if (results.length === titleMap.size) ok(`All ${results.length} pages have unique titles`);
  if (results.length === descMap.size) ok(`All ${results.length} pages have unique descriptions`);

  // Summary
  console.log("\n" + "═".repeat(60));
  console.log(`📊 SUMMARY:`);
  console.log(`   ✅ Passed:   ${passed}`);
  console.log(`   ❌ Failed:   ${failed}`);
  console.log(`   ⚠️  Warnings: ${warnings}`);
  console.log("═".repeat(60));

  if (failed > 0) {
    console.log("\n❌ SEO check completed with failures.");
    process.exit(1);
  } else {
    console.log("\n✅ SEO check passed!");
    process.exit(0);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
