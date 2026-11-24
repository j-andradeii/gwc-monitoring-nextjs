---
name: routing
description: |
  Routing in gwc-monitoring-nextjs (Next.js 16 App Router): the route groups (public), (auth), (protected)
  and their layouts, the home page at src/app/page.tsx, page.tsx (Server, metadata) + <Name>Client.tsx
  (client island), dynamic [slug] routes with generateStaticParams + generateMetadata + notFound, JSON-LD,
  sitemap.ts and robots.ts, ROUTES constants, middleware.ts redirects and matcher, and route handlers in
  src/app/api.

  Use when: adding, moving or removing a page, layout or route handler; adding a dynamic route; changing
  metadata, canonical URLs, JSON-LD, the sitemap or robots; adding a ROUTES entry, a redirect or a nav link.

  Keywords: app router, route group, (public), (auth), (protected), layout.tsx, page.tsx, Client.tsx,
  generateStaticParams, generateMetadata, notFound, params Promise, Metadata, canonical, openGraph, JSON-LD,
  sitemap, robots, ROUTES, middleware matcher, ROUTE_REDIRECTS, route.ts, NextResponse, runtime nodejs
---

# Routing: route groups, pages, metadata, route handlers

```
src/app/
  layout.tsx            fonts (Inter, Fraunces) · PrimeReact theme · globals.css · QueryProvider · root metadata
  page.tsx              home "/"  (outside the groups; renders its own LandingHeader/Footer + ConnectFab)
  (public)/layout.tsx   landing.css + sermon-detail.css + <ConnectFab/>     → about, connect, events/**, give/**, ministries/**, sermon-notes/**, lyric-formatter
  (auth)/layout.tsx     robots noindex                                       → signin
  (protected)/layout.tsx robots noindex
    church-campus-admin/layout.tsx  'use client' · <AuthGuard><AdminLayout showBreadcrumbs>   → dashboard, church-members/**
  api/**/route.ts       route handlers (POST/GET), no middleware
  sitemap.ts robots.ts manifest.ts
middleware.ts           runs on every non-static, non-api path: ROUTE_REDIRECTS → auth redirects → security headers
```

## Files in this skill

| File | What | Load when |
|---|---|---|
| `SKILL.md` | Rules, decision guide, recipes, drift, checklist | Always |
| `references/route-map.md` | Every page and route handler with its group, rendering, metadata and sitemap entry | Adding or moving a route |

## The rules

1. **Pick the group by audience.** Public marketing/forms → `(public)`; sign-in style pages → `(auth)`;
   anything needing a signed-in user → `(protected)/church-campus-admin/`. *Why:* the group's layout brings the
   CSS, the FAB, `noindex` or the `AuthGuard`.
2. **`page.tsx` is a Server Component** that exports `metadata` (or `generateMetadata`) and either
   (a) composes section components from `src/components/landing/**` (`about`, `connect`, `events`, `give/*`,
   `ministries/*`), or (b) renders one default-exported `<Name>Client />` from the same folder when the page has
   its own state (forms, filters, tools: `vip-form`, `sod-enrollment`, `lifeclass-enrollment`, `sermon-notes`,
   `events/[slug]`, `lyric-formatter`). State, hooks and PrimeReact live in the client files. *Why:* metadata
   and static generation stay on the server. Admin pages are the exception today (`'use client'` pages under a
   client layout) — they don't need SEO.
3. **Public page metadata is complete:** `title` (`'<Page> | Gateway Church'`), `description`, `keywords`,
   `alternates.canonical` built from `siteMetadata.siteUrl`, `openGraph` (title, description, url, siteName,
   locale `en_US`, type, `images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt }]`) and `twitter`
   (`summary_large_image`). Add a `BreadcrumbList` JSON-LD `<script type="application/ld+json">` for nested
   pages. *Why:* SEO is a requirement (`SEO-MONITORING.md`); pages copy this block.
4. **Dynamic routes** (`[slug]`): `params` is a `Promise` — `const { slug } = await params`; export
   `generateStaticParams()` from the data file (`sermons.map(s => ({ slug: s.slug }))`), `generateMetadata`
   with a "Not Found" fallback, and call `notFound()` when the lookup fails. *Why:* content is static data;
   every slug is pre-rendered.
5. **A new indexable page gets a sitemap entry** in `src/app/sitemap.ts` (dynamic content maps from its data
   array with `lastModified` from the content date). Non-indexable areas are in `robots.ts` `disallow`.
   *Why:* `sitemap.ts` is a hand-kept list.
6. **Paths in code come from `ROUTES`** (`core/constants.ts`) for app routes used in redirects, guards and
   nav. Add the entry when you add an admin route. *Why:* guards and redirects reference these constants.
7. **Navigation:** `<Link href>` for links, `useRouter().push` for post-action redirects in client code,
   `window.location.href` only for sign-out / session expiry (full reset). *Why:* matches the existing code.
8. **Route handlers** (`src/app/api/<area>/<name>/route.ts`) export `POST`/`GET`, validate with the shared
   schema, return `NextResponse.json(...)`, and set `export const runtime = 'nodejs'` when they use `sharp`,
   `googleapis`, `node:crypto` or Blob. Shared sheet/email logic goes to `src/lib/<name>-sheet.ts` /
   `src/lib/email/`. The middleware matcher excludes `/api`, so handlers get no security headers or redirects.
   *Why:* keeps handlers thin and the proof routes agreeing with the main routes (see `security`).
9. **Redirects that must happen before render** go in `ROUTE_REDIRECTS` in `middleware.ts`; URL-shape changes
   that only matter for links go in the page. *Why:* edge redirects are instant and SEO-safe.
10. **Page CSS is imported by the page's client file or the group layout** (`import '@/styles/vip-form.css'`).
    *Why:* page styles are scoped (`ui-ux`).

## Decision guide

| Situation | Do | Example in this repo |
|---|---|---|
| New public content page | `(public)/<path>/page.tsx` (metadata) composing `components/landing/<area>/*` sections; sitemap entry | `(public)/about/page.tsx` |
| New public page with state (form, filter, tool) | `page.tsx` (metadata) + `<Name>Client.tsx`; sitemap entry | `(public)/events/vip-form/` |
| New detail page from static data | `[slug]/page.tsx` with `generateStaticParams` + `generateMetadata` + `notFound()` | `(public)/sermon-notes/[slug]/page.tsx` |
| New admin page | `(protected)/church-campus-admin/<path>/page.tsx` + `ROUTES` entry + sidebar item | `church-campus-admin/church-members/page.tsx` |
| Section layout inside admin | `layout.tsx` in that folder | `church-members/men-network/layout.tsx` |
| New form endpoint | `app/api/<area>/<name>/route.ts` + shared schema | `app/api/inquiry/vip/route.ts` |
| Old URL → new URL | `ROUTE_REDIRECTS` in `middleware.ts` | (empty today) |

## Where things live

| Path | What |
|---|---|
| `src/app/layout.tsx` | root layout, fonts, global CSS order (PrimeReact theme → primereact.css → primeicons → `globals.css`), root `metadata` |
| `src/app/(public)/layout.tsx`, `(auth)/layout.tsx`, `(protected)/layout.tsx`, `(protected)/church-campus-admin/layout.tsx` | group layouts |
| `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/manifest.ts` | SEO files |
| `src/data/site-metadata.ts` | `siteMetadata` (`name`, `description`, `keywords`, `siteUrl`) |
| `src/core/constants.ts` | `ROUTES` |
| `src/middleware.ts` | `PROTECTED_ROUTES`, `AUTH_ROUTES`, `ROUTE_REDIRECTS`, `matcher` |
| `src/components/layout/` | `AdminLayout`, `Sidebar`, `Header`, `Breadcrumbs`, `Footer` (admin shell) |
| `src/components/landing/LandingHeader.tsx`, `LandingFooter.tsx`, `PageHero.tsx` | public shell |
| `src/hooks/useBreadcrumbs.ts`, `src/stores/breadcrumbs.store.ts` | admin breadcrumbs |

## Recipe: dynamic detail page

```tsx
interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return sermons.map((sermon) => ({ slug: sermon.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sermon = getSermonBySlug(slug);
  if (!sermon) return { title: 'Sermon Not Found | Gateway Church' };
  return { title: `${sermon.title} | Gateway Church Sermons`, description: sermon.excerpt /* + canonical, openGraph, twitter */ };
}

export default async function SermonDetailPage({ params }: Props) {
  const { slug } = await params;
  const sermon = getSermonBySlug(slug);
  if (!sermon) notFound();
  return <SermonDetailClient sermon={sermon} /* … */ />;
}
```

## Legacy and drift

Don't copy any of these.

- `middleware.ts` `PROTECTED_ROUTES = ['/testing']` doesn't cover `/church-campus-admin` (client `AuthGuard` only) → see `authentication`.
- `ROUTES` lists pages that don't exist (`CHURCH_DETAIL`, `CHURCH_INFO`, `PASTORAL_STAFFS`, `CHURCH_CONFIG`, `CREATE_MEMBER`, `CHURCH_CAMPAIGNS`), and the breadcrumbs default home is `/church-campus-admin/dashboard` (no such page; the dashboard is `/church-campus-admin`) → add the page with its `ROUTES` entry; don't link to missing pages.
- `AUTH_ROUTES` and `robots.ts` name `/signup` and `/forgot-password`, which don't exist.
- No `error.tsx`, `not-found.tsx` or `loading.tsx` anywhere → a new feature that can fail at render adds its own `error.tsx`.
- `church-members/women-network` has no layout while `men-network` does → follow `men-network` for new network pages.
- Next 16 deprecates `middleware.ts` (renamed `proxy.ts`) → keep editing `middleware.ts` until that migration is its own task.

## Checklist before shipping

- [ ] Page is in the right group; `page.tsx` stays a Server Component (public pages)
- [ ] Public page has full metadata + canonical; nested page has BreadcrumbList JSON-LD
- [ ] Dynamic route: `await params`, `generateStaticParams`, `generateMetadata`, `notFound()`
- [ ] Indexable page added to `sitemap.ts`; non-indexable area in `robots.ts`
- [ ] New admin route has a `ROUTES` entry; links point only at existing pages
- [ ] `references/route-map.md` updated

## Related skills

- [`authentication`](../authentication/SKILL.md): `AuthGuard`, redirects after sign-in
- [`security`](../security/SKILL.md): middleware headers, route-handler validation
- [`coding-style`](../coding-style/SKILL.md): page + client split, file names
- [`ui-ux`](../ui-ux/SKILL.md): page CSS scoping
