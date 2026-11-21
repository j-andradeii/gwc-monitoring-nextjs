# Route map (2026-11-21)

## Pages

"Shape": **S** = Server page composing `components/landing` sections · **C** = Server page + `<Name>Client.tsx` ·
**A** = `'use client'` admin page. "Sitemap" = listed in `src/app/sitemap.ts`.

| URL | File | Group | Shape | Sitemap |
|---|---|---|---|---|
| `/` | `app/page.tsx` | — (own header/footer/FAB) | S | yes (priority 1) |
| `/about` | `app/(public)/about/page.tsx` | public | S | yes |
| `/connect` | `app/(public)/connect/page.tsx` | public | S | yes |
| `/sermon-notes` | `app/(public)/sermon-notes/page.tsx` + `SermonNotesClient.tsx` | public | C | yes |
| `/sermon-notes/[slug]` | `app/(public)/sermon-notes/[slug]/page.tsx` + `SermonDetailClient.tsx` | public | C (static params from `sermons`) | yes (each sermon) |
| `/events` | `app/(public)/events/page.tsx` | public | S | yes |
| `/events/[slug]` | `app/(public)/events/[slug]/page.tsx` + `EventDetailClient.tsx` | public | C (static params from `events`) | yes (each event) |
| `/events/vip-form` | `app/(public)/events/vip-form/page.tsx` + `VipFormClient.tsx` | public | C | yes |
| `/events/sod-enrollment` | `app/(public)/events/sod-enrollment/page.tsx` + `SodEnrollmentClient.tsx` | public | C | yes |
| `/events/lifeclass-enrollment` | `app/(public)/events/lifeclass-enrollment/page.tsx` + `LifeclassEnrollmentClient.tsx` | public | C | yes |
| `/give/ways-to-give` | `app/(public)/give/ways-to-give/page.tsx` | public | S | yes |
| `/give/gateway-projects` | `app/(public)/give/gateway-projects/page.tsx` | public | S | yes |
| `/give/gateway-outreach` | `app/(public)/give/gateway-outreach/page.tsx` | public | S | yes |
| `/ministries/community` | `app/(public)/ministries/community/page.tsx` | public | S | yes |
| `/ministries/serve` | `app/(public)/ministries/serve/page.tsx` | public | S | yes |
| `/lyric-formatter` | `app/(public)/lyric-formatter/page.tsx` + `LyricFormatterClient.tsx` | public | C | no (tool) |
| `/signin` | `app/(auth)/signin/page.tsx` | auth (noindex) | client page | no (robots disallow) |
| `/church-campus-admin` | `app/(protected)/church-campus-admin/page.tsx` | protected (noindex, `AuthGuard`) | A | no (robots disallow) |
| `/church-campus-admin/church-members` | `…/church-members/page.tsx` | protected | A | no |
| `/church-campus-admin/church-members/men-network` | `…/men-network/layout.tsx` + `page.tsx` | protected | A | no |
| `/church-campus-admin/church-members/women-network` | `…/women-network/page.tsx` | protected | A | no |

## Route handlers (`src/app/api`, excluded from `middleware.ts`)

| Path | Methods | `runtime` | Schema |
|---|---|---|---|
| `/api/inquiry` | POST | default | `simpleContactSchema` |
| `/api/inquiry/prayer-requests` | POST | default | `contactSchema` |
| `/api/inquiry/cell-groups` | POST | default | `joinSchema` |
| `/api/inquiry/vip` | POST | default | `vipFormSchema` |
| `/api/inquiry/pledge` | POST | default | `gatewayPledgeSchema` |
| `/api/inquiry/sod-enrollment` | POST | default | `sodEnrollmentSchema` (no caller) |
| `/api/event/[slug]` | POST | default | `eventContactSchema` |
| `/api/events/sod-enrollment` | POST (multipart) | `nodejs` | `sodEnrollmentSchema` |
| `/api/events/event-registration` (+ `/proof`) | POST (+ GET/POST) | `nodejs` | `eventRegistrationSchema` |
| `/api/events/lifeclass-enrollment` (+ `/proof`) | POST (+ GET/POST) | `nodejs` | `lifeclassEnrollmentSchema` |
| `/api/give/giving-confirmation` | POST (multipart) | `nodejs` | `givingConfirmationSchema` |
| `/api/lyrics/search` | GET | default | inline checks |
| `/api/lyrics/identify`, `/section`, `/linebreaks` | POST | default | inline checks |

## `ROUTES` (`src/core/constants.ts`)

Existing pages: `HOME`, `SIGNIN`, `DASHBOARD` (`/church-campus-admin`), `CHURCH_MEMBERS`, `MEN_NETWORK`,
`WOMEN_NETWORK`, `SERMON_NOTES`. Declared without a page (drift): `CHURCH_DETAIL`, `CHURCH_INFO`,
`PASTORAL_STAFFS`, `CHURCH_CONFIG`, `CREATE_MEMBER`, `CHURCH_CAMPAIGNS`.

## Middleware

- `matcher`: `/((?!_next/static|_next/image|favicon.ico|assets|images|api).*)`
- `ROUTE_REDIRECTS`: empty
- `PROTECTED_ROUTES`: `['/testing']` → redirect to `/signin?returnUrl=<path>` without `ACCESS_TOKEN`
- `AUTH_ROUTES`: `/signin`, `/signup`, `/forgot-password` → redirect to `ROUTES.DASHBOARD` with `ACCESS_TOKEN`
