---
name: nationwideSeo flag
description: How to enable cargo-style SEO copy rewrites for a store whose fulfillment is "local" (checkout unchanged).
---

## The rule
`StoreCommerce.nationwideSeo?: boolean` gates the SEO/copy layer only — it does NOT change checkout or order logic.

Set it `true` when: a store ships nationwide but its `fulfillment` must stay `"local"` to preserve the checkout flow.

## Where it is checked (update ALL five locations together)
1. `shared/stores.ts` — `commercifyFor`: guard `store.commerce.fulfillment !== "cargo" && !store.commerce.nationwideSeo`
2. `server/seo-meta.ts` — `isCargo` const: `fulfillment === "cargo" || !!store.commerce.nationwideSeo`
3. `client/src/pages/seo-pages.tsx` — `isCargo` const (two occurrences): same OR expression
4. `client/src/components/SEO.tsx` — `_isCargo` const: same OR expression
5. `client/src/lib/seo-data.ts` — `isCargoStore()`: `fulfillment === "cargo" || !!store.commerce.nationwideSeo`

## Why this exists
YP (YourPoodle) is nationwide shipping but uses local fulfillment mechanics for checkout. Changing `fulfillment` to `"cargo"` would activate dormant cargo checkout machinery; the `nationwideSeo` flag isolates the copy/meta concern.

## findSeoPage structural fix for nationwide stores
For cargo/nationwide stores, `findSeoPage` should skip `availability:"localOnly"` overrides when a cargo variant exists in `_cargoSlugMap`. Safe fallback: still return the localOnly override when no cargo variant exists (content is cleaned at render by `commercifyFor`). Pattern:
```
if (cargo && override.availability === "localOnly") {
  const cargoVariant = _cargoSlugMap.get(slug);
  if (cargoVariant) return cargoVariant;
}
return override; // fallback: commercify cleans it at render
```
When adding a new slug to cargo map so findSeoPage can find it: add the keyword to `CARGO_KEYWORDS` in `keyword-pages.ts`.

## CARGO_COPY_REWRITES coverage: JETGO-exclusive page templates
JETGO-exclusive pages (`keyword-pages-jetgo*.ts`) have their own template functions not covered by initial patterns. All three jetgo source files share the same `deliverySection`, `whyJetgoSection`, and ORDER_LINE structure:
- `deliverySection` H2: `Atakum ve Samsun'a Teslimat`
- `deliverySection` para: `Atakum'un tüm mahallelerine kurye ile ulaştırıyoruz\.`
- `deliverySection` list: `NEIGHBORHOODS[] + " bölgesine hızlı teslimat"` (explicit list in the pattern)
- `whyJetgoSection` currier: `kurye ekibimiz apartman katınıza kadar getirsin\.`
- ORDER_LINE variant: `üzerinden ürünleri seçip sepete ekleyin; WhatsApp ile tek tıkla ya da[^.]+siparişinizi onaylayın\.`
- FAQ retailer: `Samsun merkezli bağımsız bir yerel pet shop'tur`

## Commercify pattern authoring tip
`commercify(text)` runs BEFORE `brandify`. Patterns must match the pre-brandify text (e.g. "JETGO" not "YourPoodle"). Use broad anchors for long Turkish sentences to avoid char-encoding mismatches.
