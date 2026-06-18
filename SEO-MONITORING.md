# SEO Indexing — Monitoring & Runbook

Tracks the fix for the Google Search Console issue **"Crawled – currently not indexed"** on
https://www.gatewaychurchcebu.com (audit + fixes: 2026-06-18).

## TL;DR
Technical SEO is healthy (every page: HTTP 200, self-canonical, `index,follow`, SSR content, JSON-LD,
correct robots.txt + 53-URL sitemap). The remaining "crawled-not-indexed" pages are mostly a **site-authority /
crawl-demand** problem plus a few on-page gaps now fixed in code. Getting them indexed = **deploy the fixes +
work Google Search Console + build authority + be patient** (re-indexing 40+ pages on a small domain takes weeks).

## 1. Run the automated monitor
```bash
node scripts/seo-index-check.mjs
```
Read-only. Tells you (a) how many of the 4 fixes are **live on production** yet, and (b) per-URL health
(status / canonical / robots). It can NOT read GSC — that's the manual half below.

## 2. The GSC loop (do this — it's the real lever)
1. **Deploy first.** The fixes live on branch `MIGRATION-TO-TANSTACK`; production deploys from `master`.
   Merge the PR → Vercel redeploys → re-run the monitor until it shows **4/4 live**.
2. **Re-submit** the sitemap (GSC → Sitemaps) so Google re-reads the cleaned `lastmod` values.
3. **Request indexing** for the priority URLs below: GSC → URL Inspection → *Request Indexing* (~10/day quota).
4. **Validate fix** on the "Crawled – currently not indexed" issue — BUT judge success by the **Indexed count
   trend** in the Pages report, not the validation banner. That validation can sit *Pending/Failed* even after
   real fixes, because indexing is Google's quality/demand decision, not a pass/fail check.
5. **Build authority** (biggest off-page lever for a local church): verify a **Google Business Profile** and link
   the site; get listed in local + church directories; earn a few backlinks (partner/denomination sites); keep
   posting page links on the FB/IG already in the site's `sameAs`.

## 3. Priority URLs to Request-Index after deploy
`/` · `/about` · `/connect` · `/sermon-notes` · `/events` · `/give/ways-to-give` ·
`/give/gateway-projects` · `/give/gateway-outreach` · `/ministries/community` · `/ministries/serve`
(then the newest sermons + any upcoming events)

## 4. Progress ledger
Fill a row each time you check GSC (Pages report → numbers). `site:` is a rough proxy only — GSC is the truth.

| Date | Fixes live (x/4) | GSC Indexed | Crawled-not-indexed | `site:` count | Notes |
|------|------------------|-------------|---------------------|---------------|-------|
| 2026-06-18 | 0/4 (baseline, pre-deploy) | _fill from GSC_ | _fill from GSC_ | ~1 (home only) | Audit + 4 fixes implemented, not yet deployed. |
| | | | | | |
| | | | | | |

## 5. The 4 fixes being tracked
1. **Sitemap stable `lastmod`** (`src/app/sitemap.ts`) — was build-time on every static page → Google distrusts the signal.
2. **Sermon `Article` JSON-LD** (`sermon-notes/[slug]/page.tsx`) — all 31 sermon pages previously shipped breadcrumb-only schema.
3. **Past Events archive** (`(public)/events/page.tsx`) — de-orphans ~10 finished-event pages (zero internal links → a top cause).
4. **Org logo 404** (`src/app/page.tsx`) — `/logo.png` (404) → `/assets/images/gwc-logo-gold.png`.

## 6. Optional / minor
- Apex `gatewaychurchcebu.com → www` is a **307** (temporary); make it **308** in Vercel domain settings for cleaner canonicalization.
- `/events/vip-form` + `/events/sod-enrollment` are low-value utility pages — fine if they stay unindexed (could `noindex` to save crawl budget).
