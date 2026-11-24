---
name: coding-style
description: |
  The owner's coding style in gwc-monitoring-nextjs: where files go and how they are named, the page.tsx +
  <Name>Client.tsx split, 'use client' placement, named exports + barrels, the file header comment, @/ aliases,
  comments that explain why, and the lint + tsc bar.

  Use when: writing or changing any TypeScript/TSX in src/ (every code task); naming a file, component, hook,
  store, schema or type; choosing where a helper lives; reviewing a diff for style.

  Keywords: naming, file names, folder, barrel, index.ts, 'use client', Client.tsx, page.tsx, header comment,
  @/ alias, React.memo, displayName, default export, named export, comments, lint, tsc, pnpm
---

# Coding style

Write new code so it reads like the files next to it. The owner's code is explicit and commented: every file
opens with a short header block, every non-obvious line says *why*, and each concern has one home folder.

## Files in this skill

| File | What | Load when |
|---|---|---|
| `SKILL.md` | Rules, where things live, recipes, drift, checklist | Always |

## The rules

1. **One home per concern.** Put the file in the folder the table below names; don't invent a new top-level
   folder under `src/`. *Why:* every reader (and every skill) finds things by folder.
2. **File names by kind.**
   | Kind | Name | Example |
   |---|---|---|
   | Component | `PascalCase.tsx` | `components/landing/PageHero.tsx` |
   | Page-specific client island | `<Name>Client.tsx` next to `page.tsx` | `app/(public)/events/vip-form/VipFormClient.tsx` |
   | Page-only sub-component | `PascalCase.tsx` next to `page.tsx` | `app/(public)/events/sod-enrollment/SodBirthdateField.tsx` |
   | Hook | `useCamelCase.ts` | `hooks/usePagination.ts`, `hooks/queries/useMembers.ts` |
   | Store | `<name>.store.ts` | `stores/sidebar.store.ts` |
   | Zod schema | `<kebab>.schema.ts` | `models/schemas/event-registration.schema.ts` |
   | Types / DTOs | `<name>.types.ts` | `models/member.types.ts` |
   | Service | `<kebab>.service.ts` | `services/auth.service.ts` |
   | Helper / server lib | `<kebab>.ts` | `lib/event-registration-sheet.ts`, `lib/youtube.ts` |
   | Page / feature CSS | `<feature>.css` | `styles/vip-form.css`, `components/forms/styles/form-input.css` |
   *Why:* names tell the kind before the file is opened.
3. **Every file opens with a header comment** — `/** Title \n * \n * What it is and why. */` — except tiny
   barrels. Page files say what the page is; route handlers say what they write and where. *Why:* the owner
   reads files top-down; the header is the summary.
4. **Comments explain why, not what.** Keep the owner's habit of naming the constraint behind a choice
   ("must stay under Vercel's ~4.5 MB body limit", "prefix with an apostrophe so USER_ENTERED stores text").
   No commented-out code in new files; no `console.log` in client code. *Why:* the constraints are the hard
   part to rediscover.
5. **`'use client'` only where needed** — state, effects, event handlers, browser APIs, PrimeReact, React
   Query hooks. It goes on line 1, or right after the header comment (both appear; match the folder).
   `page.tsx` and `layout.tsx` stay Server Components unless they already aren't. *Why:* keeps metadata,
   static params and SEO on the server (`routing`).
6. **Exports.** Named exports for components, hooks, stores, schemas and helpers, re-exported from the
   folder's `index.ts` when the folder has one (`components/admin`, `components/forms`, `components/landing`, `components/ui`,
   `hooks`, `hooks/queries`, `hooks/mutations`, `stores`, `models`, `core`, `guards`). `page.tsx`,
   `layout.tsx` and `<Name>Client.tsx` use `export default function`. A component may add
   `export default X` beside the named export. *Why:* barrels give one import line per area.
7. **Imports use `@/`** (`@/components/forms`, `@/models/schemas/vip.schema`, `@/core/constants`), never
   `../../`. Same-folder siblings use `./`. Import the barrel when it exports what you need. *Why:* moves
   don't break imports.
8. **Components:** function components; props as an `interface <Name>Props` above the component with
   defaults in the destructuring; `React.memo` + `X.displayName = 'X'` only for the heavy reusable inputs
   (`FormInput`, `FormTextarea` do this). Ids from `useId()`. *Why:* matches the existing component files.
9. **Types:** `strict` is on. No `any` (two pre-exist), no `@ts-ignore`; `unknown` + a narrow cast is the
   house way (`(error as { message?: string })?.message`). Types inferred from Zod with `z.infer`. Constants
   `as const`. *Why:* `tsc --noEmit` is part of the definition of done.
10. **Strings and constants live in `src/core`.** Routes in `ROUTES`, storage keys in `CONST`, messages in
    `Messages` / `FORM_MESSAGES`, patterns in `FORM_CONST`, icons in `ICON_CONSTANTS`. Static content
    (sermons, events, ministries, give data) lives in `src/data/*.ts`. *Why:* one place to change copy.
11. **Formatting:** 2-space indent, single quotes, semicolons, trailing commas in multi-line literals. There
    is no Prettier config; match the file you're in (a few older files use 4 spaces — don't reformat them).
12. **Done means:** `pnpm run lint` exits 0 with no new warnings in touched files, and `npx tsc --noEmit`
    exits 0. *Why:* there are no unit tests; these two plus the build are the gate.

## Where things live

| Path | What goes there |
|---|---|
| `src/app/(public)/<route>/page.tsx` + `<Name>Client.tsx` | public pages (Server page + client island) |
| `src/app/(protected)/church-campus-admin/**` | admin pages (behind `AuthGuard`) |
| `src/app/(auth)/signin/page.tsx` | sign-in |
| `src/app/api/**/route.ts` | route handlers (server only) |
| `src/components/<area>/` | shared components: `admin` (admin page parts), `forms`, `landing` (+ `about`, `connect`, `events`, `give`, `outreach`), `layout` (admin shell + `admin-navigation.ts`), `cards`, `events`, `providers`, `ui` |
| `src/core/` | config, constants, crypto, messages, storage, date + string utils |
| `src/data/` | static content + its docs (`ADDING_SERMONS.md`) |
| `src/guards/` | `AuthGuard`, `RoleGuard`, `withAuth`, `withRole` |
| `src/hooks/` | UI hooks; `queries/` and `mutations/` for TanStack Query |
| `src/lib/` | helpers shared by route handlers and pages (`*-sheet.ts`, `email/`, `image-*.ts`, `youtube.ts`, `query-client.ts`, `query-keys.ts`) |
| `src/models/` | `*.types.ts`, `enums/`, `schemas/*.schema.ts` |
| `src/services/` | `api-client.ts`, `auth.service.ts` |
| `src/stores/` | Zustand stores |
| `src/styles/` | page-scoped CSS |

## Recipe: a page with a client island

```tsx
// src/app/(public)/events/<feature>/page.tsx
/**
 * <Feature> Page
 *
 * Public page for …
 */

import { Metadata } from 'next';
import { siteMetadata } from '@/data/site-metadata';
import FeatureClient from './FeatureClient';

export const metadata: Metadata = { title: '… | Gateway Church', alternates: { canonical: `${siteMetadata.siteUrl}/events/<feature>` } };

export default function FeaturePage() {
  return <FeatureClient />;
}
```

```tsx
// src/app/(public)/events/<feature>/FeatureClient.tsx
'use client';

import React, { useState } from 'react';
import { LandingHeader, LandingFooter, PageHero } from '@/components/landing';
import '@/styles/landing.css';

export default function FeatureClient() {
  // …state, hooks, handlers…
  return (/* … */);
}
```

## Legacy and drift

Don't copy any of these into new code.

- `console.log` of submissions in route handlers (`app/api/inquiry/*/route.ts`, `app/api/events/sod-enrollment/route.ts`, `app/api/event/[slug]/route.ts`) → log errors only, never form data (see `security`).
- Unused legacy service files (`services/member.service.ts`, `church.service.ts`, `church-campus.service.ts`, `inquiry.service.ts`) duplicate what the hooks do → don't extend them; see `api-client`.
- Misspelled internals in `api-client.ts` (`builAppdUrl`, `builApidUrl`) and `Messages.MESSAGE_EXPIREED_REFRESH_TOKEN` → keep using them as they are; renames are a separate task.
- Inline `style={{ … }}` blocks and hard-coded hex colours in some clients (e.g. `VipFormClient.tsx`) → classes + tokens (`ui-ux`).
- `connectFab.store.ts` is camelCase while other stores are lowercase words → new stores use `<kebab>.store.ts`.
- `models/index.ts` re-exports only auth/member/church schemas → import other schemas by path (`@/models/schemas/<x>.schema`).

## Checklist before shipping

- [ ] Each new file is in its home folder with the rule-2 name and a header comment
- [ ] `'use client'` only on files that need it; pages and layouts still Server Components
- [ ] `@/` imports, barrels updated when a folder has an `index.ts`
- [ ] No `any`, `@ts-ignore`, `console.log` (client) or commented-out code added: `git diff -U0 | grep -E "^\+.*(: any\b|as any\b|@ts-ignore|console\.log)"` is empty
- [ ] `pnpm run lint` exits 0 with no new warnings in touched files; `npx tsc --noEmit` exits 0

## Related skills

- [`routing`](../routing/SKILL.md) (page + client split), [`api-client`](../api-client/SKILL.md), [`forms`](../forms/SKILL.md), [`ui-ux`](../ui-ux/SKILL.md)
