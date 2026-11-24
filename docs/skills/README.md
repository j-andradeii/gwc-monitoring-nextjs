# Project skills

Written for this repository (2026-11-21) from the code as it is on `MIGRATION-TO-TANSTACK`; same setup as
`gwc-monitoring-service`. `CLAUDE.md` imports this index. Before planning any task, open the `SKILL.md` of
**every** skill whose "Use when" matches, then its `references/` files for the parts you'll touch. Every code
task also opens `coding-style`.

| Skill (folder) | Covers | Open it when the task… | Detail |
|---|---|---|---|
| [`coding-style/`](coding-style/SKILL.md) | File names and folders, `'use client'` placement, exports and barrels, header comments, aliases, page + `*Client` split, comments that explain *why*, lint/tsc bar | writes or changes any code in `src/` (every code task) | — |
| [`security/`](security/SKILL.md) | `middleware.ts` headers and CSP, `X-ACCESS-TOKEN`/`X-ACCESS` encryption (`core/crypto.ts`), httpOnly cookies, env keys and `NEXT_PUBLIC_*`, route-handler input validation, uploads, secrets in code | touches `middleware.ts`, CSP, headers, `core/config.ts`, `core/crypto.ts`, an env key, a route handler in `src/app/api`, file uploads, or adds an external domain (images, iframes, fetch) | `references/env-keys.md` |
| [`authentication/`](authentication/SKILL.md) | Login (`auth.service.ts`), `getSelf`, `useUserStore`, `AuthGuard`/`RoleGuard`, `useAuth` role helpers, token refresh, logout, `returnUrl` | touches sign-in, sign-out, the admin guard, roles, the user store, session expiry or `/self` | `references/auth-flow.md` |
| [`api-client/`](api-client/SKILL.md) | `apiClient` (`target: 'app' \| 'api'`), `ApiResponse`/`ApiError`, `QUERY_KEYS`, `queryClient` defaults, query hooks in `hooks/queries`, mutation hooks in `hooks/mutations`, inline `useMutation` for public forms, invalidation | adds or changes a call to the external API or a Next route handler, a query/mutation hook, a query key, caching, or loading state | `references/endpoint-map.md` |
| [`routing/`](routing/SKILL.md) | Route groups `(public)`/`(auth)`/`(protected)`, layouts, `ROUTES`, `middleware.ts` matcher and redirects, `page.tsx` + `*Client.tsx`, `generateMetadata`/`generateStaticParams`, JSON-LD, `sitemap.ts`, route handlers | adds or moves a page, layout, route handler, redirect or `ROUTES` entry; changes metadata, sitemap or robots | `references/route-map.md` |
| [`zustand/`](zustand/SKILL.md) | The five stores, `State`/`Actions` split, `persist` + `partialize`, selectors, `getState()` outside React, one-shot command stores | adds or changes a store, persisted UI state, or cross-component UI signals | — |
| [`forms/`](forms/SKILL.md) | Zod 4 schemas in `models/schemas`, `useForm` + `zodResolver` + `FormProvider`, the `Form*` wrappers, `useScrollToFirstError`, proof-of-payment upload, multipart vs JSON submit, success/error panels | adds or changes a form, a schema, a `Form*` component or a submission route | `references/form-components.md` |
| [`adding-sermons/`](adding-sermons/SKILL.md) | Adding or migrating an entry in `src/data/sermons.ts`: ids, slug, required fields, Modern Reader fields, the strict content rule, NKJV scripture text, `videoUrl`, featured flag | adds, edits or migrates a sermon, or pastes sermon notes | `src/data/ADDING_SERMONS.md` |
| [`ui-ux/`](ui-ux/SKILL.md) | **The styling reference** (replaces the old root design docs): tokens and live values, typography (Inter + Fraunces), contrast, PrimeReact overrides, buttons, cards, dialogs, toasts, heroes, sermon reader, sign-in, public forms, admin shell, motion and a11y, visual verification | changes anything a user sees, or needs to know what colour / class / size the app uses | `DESIGN.md`, `references/tokens.md`, `references/components.md`, `references/surfaces.md` |

## Common combinations

Every code task also opens `coding-style`.

| Task | Skills |
|---|---|
| New public page | `routing`, `ui-ux` (+ `forms` and `security` if it has a form) |
| New public form → Google Sheet | `forms`, `api-client`, `security`, `routing`, `ui-ux` |
| New admin page with data | `routing`, `authentication`, `api-client`, `ui-ux` (+ `forms` for edits) |
| New external-API endpoint call | `api-client`, `authentication` (+ `security` for headers) |
| Login, logout, roles, session | `authentication`, `security`, `zustand` |
| New UI state shared by siblings | `zustand` |
| Add a sermon | `adding-sermons` (no `coding-style` needed unless code changes) |
| CSS / design fix | `ui-ux` |
| CSP, headers, env key | `security` |
| Bug fix | the skill for the layer it's in |

## How to use them

1. **Precedence: `CLAUDE.md` > these skills > the user-level `gwc-nextjs-patterns` skill.** That user-level
   skill is a broad knowledge base for this app; where it disagrees with a skill here, this folder wins. About
   what exists in the code, the code wins: a skill that names a missing file or a wrong signature is fixed in
   the same change.
2. **Rules are for new code.** Each skill's "Legacy and drift" lists what the code does today that new code must
   not repeat. Fixing a drift item is its own task (and spec) unless the request asks for it.
3. **Run each opened skill's "Checklist before shipping"** against the diff before reporting (spec checklist
   line V004).
4. **Keep them true.** A change to a documented pattern updates its skill in the same change.
5. **Never paste a secret, token, `.env*` value, spreadsheet ID, real name or email into a skill.**
6. **External side effects in a skill or checklist** (deploy, `vercel env pull`, `scripts/*`, submitting a form
   against real Google Sheets / Blob / Resend, logging in to the real API) are run by the owner, never by Claude
   (`CLAUDE.md`, "External side effects").
