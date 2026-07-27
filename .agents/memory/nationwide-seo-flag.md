---
name: nationwideSeo flag
description: How to enable cargo-style SEO copy rewrites for a store whose fulfillment is "local" (checkout unchanged).
---

## The rule
`StoreCommerce.nationwideSeo?: boolean` gates the SEO/copy layer only — it does NOT change checkout or order logic.

Set it `true` when: a store ships nationwide but its `fulfillment` must stay `"local"` to preserve the checkout flow.

## Where it is checked (update ALL four locations together)
1. `shared/stores.ts` — `commercifyFor`: guard `store.commerce.fulfillment !== "cargo" && !store.commerce.nationwideSeo`
2. `server/seo-meta.ts` — `isCargo` const: `fulfillment === "cargo" || !!store.commerce.nationwideSeo`
3. `client/src/pages/seo-pages.tsx` — `isCargo` const (two occurrences): same OR expression
4. `client/src/components/SEO.tsx` — `_isCargo` const: same OR expression

## Why this exists
YP (YourPoodle) is nationwide shipping but uses local fulfillment mechanics for checkout. Changing `fulfillment` to `"cargo"` would activate dormant cargo checkout machinery; the `nationwideSeo` flag isolates the copy/meta concern.

## Commercify pattern authoring tip
Stored seo-data may already have the brand name substituted (e.g. "YourPoodle") before commercifyFor runs — write patterns to match the **post-brandify text**, not the source template. Use broad anchor patterns (e.g. `/aynı gün siparişiniz kapınızda olur\./g`) rather than long exact-match strings containing Turkish characters when cross-file character encoding is uncertain.
