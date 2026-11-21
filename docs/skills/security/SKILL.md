---
name: security
description: |
  Security of gwc-monitoring-nextjs: the security headers and CSP set in src/middleware.ts, the encrypted
  X-ACCESS-TOKEN / X-ACCESS headers (core/crypto.ts, AES-CBC + scrypt) the external API requires, httpOnly
  auth cookies, env keys (server-only vs NEXT_PUBLIC_*), input validation in route handlers, file uploads to
  Vercel Blob, and keeping secrets and personal data out of code, logs and commits.

  Use when: touching src/middleware.ts, the CSP or any response header; core/config.ts or core/crypto.ts;
  adding or reading an env key; writing or changing a route handler in src/app/api; handling an upload;
  embedding a new external domain (image, iframe, script, fetch); logging anything from a request.

  Keywords: CSP, Content-Security-Policy, HSTS, X-Frame-Options, middleware, X-ACCESS-TOKEN, X-ACCESS,
  encrypt, decrypt, scrypt, AES-CBC, NEXT_PUBLIC_, process.env, env key, safeParse, route handler, upload,
  Vercel Blob, put, image-mime, magic bytes, sharp, Google Sheets, Resend, secret, PII
---

# Security: headers, encryption, env and route handlers

Two trust boundaries. **Browser → external API:** httpOnly cookies set by the API plus two encrypted headers
built by `apiClient`. **Browser → our route handlers (`src/app/api`):** public, unauthenticated endpoints that
write to Google Sheets, Vercel Blob and Resend — so every one re-validates its input on the server.

```
browser ─▶ middleware.ts  (all pages except _next/static|_next/image|favicon.ico|assets|images|api)
             └─ CSP · HSTS · X-Frame-Options DENY · nosniff · Referrer-Policy · Permissions-Policy · COOP
        ─▶ apiClient(target 'api') ─▶ external API   headers: X-ACCESS-TOKEN = encrypt(key), X-ACCESS = encrypt(utcMillis)
                                                     cookies: ACCESS_TOKEN / REFRESH_TOKEN (httpOnly, set by the API)
        ─▶ fetch / apiClient(target 'app') ─▶ src/app/api/**/route.ts ─▶ Zod safeParse ─▶ Sheets / Blob / Resend (server env)
```

## Files in this skill

| File | What | Load when |
|---|---|---|
| `SKILL.md` | Rules, decision guide, file map, drift, checklist | Always |
| `references/env-keys.md` | Every env key: where it's read, server or public, purpose (no values) | Adding or reading config |

## The rules

1. **Server secrets never get a `NEXT_PUBLIC_` prefix and are read only in server code** (`src/app/api/**`,
   `src/lib/**` used by route handlers). *Why:* anything `NEXT_PUBLIC_*` is inlined into the browser bundle.
2. **No new `process.env.X || '<literal>'` fallbacks for secrets, keys or IDs.** A missing server key makes
   the route return its "not configured" result or a 500, not run with a baked-in value. Non-secret defaults
   (a model name, a public URL) may keep a fallback. *Why:* see "Legacy and drift" — the existing fallbacks put
   real values in git.
3. **The `X-ACCESS-*` headers are built only by `apiClient.buildHeaders` with `encrypt()` from
   `core/crypto.ts`.** Don't build them elsewhere, don't change the scrypt parameters (`N=1024, r=8, p=1`, salt
   `'salt'`, 32-byte key) or the `iv:cipher` hex format. *Why:* the API's `AccessTokenMiddleware` decrypts them
   with the same scheme; a mismatch is a 403 on every call.
4. **Treat the X-ACCESS scheme as client identification, not a secret boundary.** Its password ships to the
   browser (`NEXT_PUBLIC_X_ACCESS_TOKEN_PASSWORD`). Real authorization is the API's JWT guard. *Why:* stops
   anyone relying on it to protect data.
5. **JS never reads, stores or logs tokens.** Auth cookies are httpOnly and set/cleared by the API; requests
   use `credentials: 'include'`. Only the `/self` user profile is stored client-side (`authentication`).
   *Why:* XSS can't steal what JS can't read.
6. **Every route handler validates with the shared Zod schema** (`schema.safeParse(body)`) before any side
   effect, returns `400` with `{ error: 'Invalid submission data', details }` on failure, and wraps the
   handler in `try/catch` returning a generic `500` message. Convert JSON-transported types first (ISO string →
   `Date`) as `app/api/inquiry/vip/route.ts` does. *Why:* the endpoints are public; the client check is UX only.
7. **Uploads:** sniff the real type from magic bytes (`resolveImageMime` in `lib/image-mime.ts`), cap size
   (`SOD_PROOF_MAX_BYTES`, 10 MB) and keep the body under Vercel's ~4.5 MB limit (client converts to WebP,
   4 MB guard), store via `put()` with `addRandomSuffix: true` and a sanitized base name
   (`/[^a-zA-Z0-9._-]/g → '_'`). Server routes that use `sharp` set `export const runtime = 'nodejs'` and import
   it lazily. *Why:* user files are untrusted; predictable blob names leak other people's proofs.
8. **Never log personal data.** Route handlers log errors (`console.error('…', error)`), not request bodies.
   *Why:* Vercel logs are not a place for names, phone numbers and birthdates.
9. **Spreadsheet formulas from user data:** values go in with `valueInputOption: 'USER_ENTERED'`, so a
   value starting with `=`, `+`, `-` or `@` would run as a formula. Only server-built cells may be formulas
   (`=HYPERLINK(...IMAGE(...))` from our own Blob URL); prefix user text that could start a formula with `'`
   (as birthdates already are). *Why:* formula injection in the church's sheets.
10. **A new external origin is added to the CSP in `middleware.ts`** in the right directive (`img-src`,
    `frame-src`, `connect-src`, `script-src`, `font-src`) and, for `next/image`, to `images.remotePatterns` in
    `next.config.ts`. *Why:* otherwise it silently fails in production.
11. **No secret, token, `.env*` value, spreadsheet ID or personal data in code, tests, specs, skills or
    commits.** `.env*` is git-ignored; keep it that way. *Why:* the repo is shared.

## Decision guide

| Situation | Do | Example in this repo |
|---|---|---|
| Call the external API | `apiClient.get/post/…(endpoint, …, { target: 'api' })` — headers and cookies come for free | `hooks/queries/useMembers.ts` |
| Public form submission | POST to a route handler; handler `safeParse`s with the same schema | `app/api/inquiry/vip/route.ts` + `models/schemas/vip.schema.ts` |
| Form with a file | multipart `FormData` via `fetch`; route sniffs MIME, re-encodes, `put()` to Blob | `app/api/events/sod-enrollment/route.ts`, `lib/event-proof-upload.ts` |
| New server secret | add to `references/env-keys.md` (+ owner adds it in Vercel); read in server code only; no fallback | `RESEND_API_KEY` in `lib/email/send.ts` |
| New embed / image host | CSP directive in `middleware.ts` + `next.config.ts` `remotePatterns` | YouTube in `frame-src`, Blob in `img-src` |
| Need the user on the client | `useUserStore` (profile from `/self`), never the cookie | `guards/AuthGuard.tsx` |

## Where things live

| Path | What |
|---|---|
| `src/middleware.ts` | `buildCspHeader()` (adds the `NEXT_PUBLIC_API_URL` origin to `connect-src`), the seven security headers, cookie-based redirects, `config.matcher` |
| `src/core/config.ts` | `config` object: app, api, auth, security (`xAccessTokenKeyHeader`, `xAccessHeader`, `xAccessTokenPassword`, `xAccessTokenKey`), features |
| `src/core/crypto.ts` | `encrypt`, `decrypt`, `CryptoService` (AES-CBC, scrypt key, cached `keyPromise`) |
| `src/services/api-client.ts` | `buildHeaders` (adds the encrypted headers unless `skipEncryption`), `credentials: 'include'` |
| `src/app/api/**/route.ts` | route handlers; `runtime = 'nodejs'` where `sharp`/`googleapis` run |
| `src/lib/image-mime.ts`, `lib/image-to-webp.ts`, `lib/event-proof-upload.ts` | MIME sniffing, client WebP conversion, Blob upload helpers |
| `src/lib/*-sheet.ts`, `src/lib/email/` | Google Sheets clients and Resend email senders (server only) |
| `next.config.ts` | `images.remotePatterns` |

## Legacy and drift

Don't copy any of these.

- `core/config.ts` falls back to literal values for `xAccessTokenPassword` and `xAccessTokenKey` → never add such fallbacks; removing them (and rotating the values on the API) is a separate task.
- Spreadsheet IDs as `process.env.X || '<id>'` fallbacks in `app/api/events/sod-enrollment/route.ts`, `lib/event-registration-sheet.ts`, `lib/lifeclass-enrollment-sheet.ts`, `lib/giving-confirmation-sheet.ts` → new sheets read the env key only.
- `console.log('… received:', validationResult.data)` in the inquiry/event route handlers logs personal data → errors only.
- `script-src 'unsafe-inline' 'unsafe-eval'` in the CSP → don't widen the CSP further; tightening it (nonces) is a separate task.
- No `.env.example` in the repo → `references/env-keys.md` is the key list until one is added.
- Next 16 deprecates `middleware.ts` in favour of `proxy.ts`; the rename is a separate task — keep editing `middleware.ts` until then.

## Checklist before shipping

- [ ] No new secret in client code: `git grep -nE "process\.env\.[A-Z_]+" -- 'src/components' 'src/hooks' 'src/stores' 'src/app/**/*Client.tsx'` shows only `NEXT_PUBLIC_*` keys
- [ ] No new env fallback for a secret or ID: `git diff -U0 -- src | grep -E "^\+.*process\.env\.[A-Z_]+ *(\|\||\?\?) *['\"]"` is empty (or each hit is a non-secret default named in the spec)
- [ ] Every new/changed route handler `safeParse`s before side effects, has `try/catch`, logs no request data
- [ ] Uploads: MIME sniffed, size capped, random-suffixed Blob name
- [ ] New external origin added to CSP (+ `remotePatterns` for `next/image`)
- [ ] New env key listed in `references/env-keys.md` (name and purpose only)

## Related skills

- [`authentication`](../authentication/SKILL.md): cookies, refresh, guards
- [`api-client`](../api-client/SKILL.md): `buildHeaders`, `target`
- [`forms`](../forms/SKILL.md): shared client/server schemas, uploads
- [`routing`](../routing/SKILL.md): middleware matcher and redirects
