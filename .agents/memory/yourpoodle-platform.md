---
name: YourPoodle platform architecture
description: DB tables, API routes, client page map, and data-flow decisions for the YourPoodle layer running on the jetgo codebase.
---

## DB Tables (all CREATE TABLE IF NOT EXISTS on first hit)
- `yp_poodles` — customer poodle profile; `customer_id INT UNIQUE`; upserted by POST /api/yp/poodle
- `yp_email_subscribers` — email signup; `email TEXT UNIQUE`; upserted (ON CONFLICT DO NOTHING)
- `yp_events` — platform events; managed via admin CRUD at /api/admin/yp-events
- `yp_articles` — platform articles; managed via admin CRUD at /api/admin/yp-articles

## Key API Endpoints
- `GET /api/yp/poodle` — returns authenticated user's poodle (customerId from session)
- `POST /api/yp/poodle` — upsert poodle profile (auth required)
- `POST /api/yp/email-subscribe` — add email (public, deduped)
- `GET /api/admin/yp-email-subscribers` + `/export` — admin list + CSV download
- `GET|POST|PUT|DELETE /api/admin/yp-events` — events CRUD
- `GET|POST|PUT|DELETE /api/admin/yp-articles` — articles CRUD

## Client Pages (/yourpoodle/*)
All lazy-loaded in App.tsx. Bottom nav has 5 tabs: Ana Sayfa, Rehber, Asistan (center), Market, Profil.
Profil tab → /yourpoodle/profil (NOT /yourpoodle/poodle-ekle).

## Data Flow — Poodle Profile
- `yp-poodle-ekle.tsx`: saves to localStorage always; also POSTs to API if `isLoggedIn`
- `yp-profil.tsx`: loads from API if logged in, falls back to localStorage; shows profile card or empty state
- Guest users: profile only in localStorage (shown with warning banner)

## Filtering Rule
- `yp-magaza.tsx` and `yp-mama.tsx` filter `allProducts` by `p.animal === 'kopek'`
- `sitemap-main.xml` category loop skips `cat.animal !== 'kopek'`

## PWA
- `client/public/manifest.json` exists with 3 shortcuts (AI Asistan, Mama Bul, Club)
- Service worker registration in index.html; `client/public/sw.js` exists

## OG Image
- `client/public/og-image.jpg` — AI-generated YourPoodle branded (purple gradient + poodle)
- `client/public/og-image.webp` — older version still present
- index.html references `.webp`; new jpg available at `/og-image.jpg`

**Why:** YP is a poodle-only content+community layer; the underlying pet-shop commerce engine (orders, products, checkout) remains fully functional but filtered at display level to dog-only.
