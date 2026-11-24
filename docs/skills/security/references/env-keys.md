# Env keys (names only — never values)

Read from `process.env` in `src/` on 2026-11-21. `.env` and `.env.local` are git-ignored and hold the values;
on Vercel they are project env vars. There is no `.env.example` yet; this table is the list.

**Public** = `NEXT_PUBLIC_*`, inlined into the browser bundle, never a secret. **Server** = read only in route
handlers / `src/lib`.

## Public (`src/core/config.ts` unless noted)

| Key | Purpose | Fallback in code |
|---|---|---|
| `NEXT_PUBLIC_APP_NAME` | site name in `config.app.name` | yes (site name) |
| `NEXT_PUBLIC_APP_URL` | site origin; also `src/data/site-metadata.ts` | yes (production URL) |
| `NEXT_PUBLIC_API_URL` | external API base (`…/api/v1`); also adds its origin to CSP `connect-src` in `middleware.ts` | yes (localhost) |
| `NEXT_PUBLIC_API_AUTH_URL` | auth base URL (in `config`, unused by `apiClient`) | yes (localhost) |
| `NEXT_PUBLIC_API_TIMEOUT` | request timeout ms (in `config`, unused by `apiClient`) | yes |
| `NEXT_PUBLIC_ACCESS_TOKEN_EXPIRY`, `NEXT_PUBLIC_REFRESH_TOKEN_EXPIRY` | informational only (cookies are set by the API) | yes |
| `NEXT_PUBLIC_X_ACCESS_TOKEN_KEY_HEADER`, `NEXT_PUBLIC_X_ACCESS_HEADER` | header names (`X-ACCESS-TOKEN`, `X-ACCESS`) | yes |
| `NEXT_PUBLIC_X_ACCESS_TOKEN_PASSWORD` | scrypt password for `core/crypto.ts`; must equal the API's encryption password | **yes — drift, see SKILL.md** |
| `NEXT_PUBLIC_X_ACCESS_TOKEN_KEY` | plaintext the API expects inside `X-ACCESS-TOKEN` | **yes — drift, see SKILL.md** |
| `NEXT_PUBLIC_ENABLE_ANALYTICS`, `NEXT_PUBLIC_ENABLE_DEBUG` | feature flags (`'true'`) | — |
| `NEXT_PUBLIC_SITE_URL` | present in `.env`, not read by `src/` | — |

## Server

| Key | Read in | Purpose |
|---|---|---|
| `GOOGLE_SHEETS_CLIENT_EMAIL`, `GOOGLE_SHEETS_PRIVATE_KEY` | inquiry/event route handlers, `lib/event-registration-sheet.ts` (+ other `lib/*-sheet.ts`) | service-account credentials; private key has `\n` escapes replaced at read time. Missing → routes return "Logged locally (Google Sheets not configured)" |
| `GOOGLE_SPREADSHEET_ID` | `app/api/inquiry/route.ts`, `inquiry/cell-groups`, `inquiry/pledge`, `inquiry/prayer-requests`, `app/api/event/[slug]/route.ts` | general inquiries sheet |
| `GOOGLE_SPREADSHEET_VIP_ID` | `app/api/inquiry/vip/route.ts` | VIP sheet |
| `GOOGLE_SPREADSHEET_SOD_ID` | `app/api/inquiry/sod-enrollment/route.ts` | SOD inquiry sheet |
| `GOOGLE_SPREADSHEET_ENROLLEES_ID` | `app/api/events/sod-enrollment/route.ts` | SOD enrollees sheet (has a literal fallback — drift) |
| `GOOGLE_SPREADSHEET_G12_EVENTS` | `lib/event-registration-sheet.ts` | paid-event registrations (literal fallback — drift) |
| `GOOGLE_SPREAD_SHEET_LIFECLASS_ENROLLEES` | `lib/lifeclass-enrollment-sheet.ts` | Lifeclass enrollees (literal fallback — drift) |
| `GOOGLE_SPREAD_SHEET_GATEWAY_GIVING` | `lib/giving-confirmation-sheet.ts` | giving confirmations (literal fallback — drift) |
| `BLOB_READ_WRITE_TOKEN` | read by `@vercel/blob` `put()` (not by name in `src/`) | Vercel Blob uploads; auto-injected on Vercel |
| `RESEND_API_KEY` | `lib/email/send.ts` | email sending; missing → sending skipped |
| `MAIL_FROM`, `MAIL_FROM_ADDRESS`, `MAIL_FROM_NAME` | `lib/email/send.ts` | sender identity |
| `ADMIN_NOTIFY_EMAIL` | `lib/email/event-proof-email.ts`, `event-registration-email.ts`, `lifeclass-enrollment-email.ts` | staff notification address |
| `PASTOR_ADMIN_NOTIFY_EMAIL` | `lib/email/giving-confirmation-email.ts` | giving notification address |
| `GEMINI_API_KEY`, `GEMINI_MODEL` | `app/api/lyrics/section/route.ts`, `lyrics/linebreaks/route.ts` | lyric formatting (model has a non-secret default) |
| `FIRECRAWL_API_KEY` | `app/api/lyrics/identify/route.ts` | lyric lookup |
| `PAYMONGO_SECRET_KEY`, `VERCEL_OIDC_TOKEN` | present in `.env*`, not read by `src/` | — |

## Adding a key

1. Server secret → no `NEXT_PUBLIC_` prefix, read in server code only, no literal fallback.
2. Add a row here (name, where read, purpose). Never the value.
3. The owner sets it locally and in Vercel; Claude never runs `vercel env pull` / `vercel env add`.
