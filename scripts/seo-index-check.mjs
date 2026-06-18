#!/usr/bin/env node
/**
 * SEO / indexing monitor for gatewaychurchcebu.com
 * --------------------------------------------------
 * Zero-dependency (Node 18+ global fetch). Run:
 *
 *     node scripts/seo-index-check.mjs
 *     SEO_SITE=https://staging.example.com node scripts/seo-index-check.mjs
 *
 * What it does:
 *   1. DEPLOY MARKERS — detects whether each of the 2026-06-18 SEO fixes is
 *      actually LIVE on production yet (so you know when a redeploy landed and
 *      it's worth clicking "Validate fix" / "Request indexing" in GSC).
 *   2. URL HEALTH — for the priority pages, checks HTTP status, self-canonical,
 *      and robots meta.
 *
 * What it does NOT do: it cannot read Google Search Console (that needs your
 * auth). Run it alongside the GSC "Pages" report — see SEO-MONITORING.md for
 * the loop. It is safe + read-only (plain GETs against the public site).
 */

const SITE = (process.env.SEO_SITE || 'https://www.gatewaychurchcebu.com').replace(/\/$/, '');

const PRIORITY = [
  '/', '/about', '/connect', '/sermon-notes', '/events',
  '/give/ways-to-give', '/give/gateway-projects', '/give/gateway-outreach',
  '/ministries/community', '/ministries/serve',
];
const SAMPLE_SERMON = '/sermon-notes/the-good-shepherd';
const SAMPLE_FINISHED_EVENT = '/events/lifeclass-party';

async function get(path) {
  const url = path.startsWith('http') ? path : SITE + path;
  try {
    const res = await fetch(url, { redirect: 'follow', headers: { 'user-agent': 'gwc-seo-monitor' } });
    return { status: res.status, body: await res.text(), url: res.url };
  } catch (e) {
    return { status: 0, body: '', url, error: e.message };
  }
}
const pick = (s, re) => (s.match(re) || [])[1] || null;
const mark = (ok) => (ok ? '✅ LIVE' : '⏳ not deployed yet');

(async () => {
  console.log(`\n=== SEO / index monitor — ${SITE} — ${new Date().toISOString()} ===\n`);
  let live = 0;

  // ---- FIX 1: sitemap lastmod is stable (not a build timestamp) ----
  const sm = await get('/sitemap.xml');
  const entries = [...sm.body.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => ({
    loc: pick(m[1], /<loc>([^<]+)<\/loc>/),
    lastmod: pick(m[1], /<lastmod>([^<]+)<\/lastmod>/),
  }));
  const staticLocs = ['/about', '/connect', '/give/ways-to-give', '/give/gateway-projects', '/ministries/serve', '/events/vip-form'];
  const staticEntries = entries.filter((e) => e.loc && staticLocs.some((s) => e.loc.endsWith(s)));
  // Bug signature: static pages carry a wall-clock build timestamp (not midnight).
  const buildStamped = staticEntries.filter((e) => e.lastmod && !/T00:00:00/.test(e.lastmod));
  const fix1 = staticEntries.length > 0 && buildStamped.length === 0;
  if (fix1) live++;
  console.log(`FIX 1  sitemap stable lastmod      ${mark(fix1)}`);
  console.log(`       ${entries.length} urls; static pages w/ build-time lastmod (want 0): ${buildStamped.length}` +
    (buildStamped[0] ? `  e.g. ${buildStamped[0].loc} -> ${buildStamped[0].lastmod}` : ''));

  // ---- FIX 2: sermon Article JSON-LD ----
  const sermon = await get(SAMPLE_SERMON);
  const fix2 = /"@type":"Article"/.test(sermon.body);
  if (fix2) live++;
  console.log(`FIX 2  sermon Article schema        ${mark(fix2)}   (${SAMPLE_SERMON})`);

  // ---- FIX 3: Past Events archive de-orphans finished events ----
  const events = await get('/events');
  const fix3 = /Past Events/i.test(events.body) || new RegExp(`href="${SAMPLE_FINISHED_EVENT}"`).test(events.body);
  if (fix3) live++;
  console.log(`FIX 3  Past Events internal links   ${mark(fix3)}   (link to ${SAMPLE_FINISHED_EVENT})`);

  // ---- FIX 4: homepage Org logo no longer 404 ----
  const home = await get('/');
  const fix4 = /assets\/images\/gwc-logo-gold\.png/.test(home.body) && !/"logo":"[^"]*\/logo\.png"/.test(home.body);
  if (fix4) live++;
  console.log(`FIX 4  Org schema logo (no 404)     ${mark(fix4)}`);

  console.log(`\nDeploy status: ${live}/4 fixes live on ${SITE}` +
    (live < 4 ? '  — merge MIGRATION-TO-TANSTACK -> master and redeploy, then re-run.' : '  — all live; (re)submit sitemap + Validate fix in GSC.'));

  // ---- Per-URL health ----
  console.log(`\n--- Priority URL health (status / canonical / robots) ---`);
  for (const p of PRIORITY) {
    const r = await get(p);
    const canonical = pick(r.body, /<link[^>]*rel="canonical"[^>]*href="([^"]+)"/i);
    const robots = pick(r.body, /<meta[^>]*name="robots"[^>]*content="([^"]+)"/i);
    const want = (SITE + (p === '/' ? '' : p)).replace(/\/$/, '');
    const selfCanon = canonical && canonical.replace(/\/$/, '') === want;
    const flag = r.status === 200 && selfCanon && /index/.test(robots || '') ? '   ' : ' ! ';
    console.log(`${flag}${String(r.status).padEnd(3)} ${p.padEnd(26)} canon:${selfCanon ? 'self' : (canonical || 'MISSING')}  robots:${robots || 'MISSING'}`);
  }

  console.log(`\nGSC loop: Pages report -> track "Indexed" up / "Crawled - currently not indexed" down.`);
  console.log(`Then URL Inspection -> Request Indexing on the priority URLs (~10/day quota). See SEO-MONITORING.md.\n`);
})();
