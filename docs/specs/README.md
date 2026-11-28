# Specs

One folder per task that changed the repository: `spec.md` is what was planned, `checklist.md` is what was
proven. The steps and templates are in `CLAUDE.md` ("Every task leaves a spec"). Never application code.

| Folder | Feature | Issue | Status | Date |
|---|---|---|---|---|
| [001-ai-spec-workflow-skills](001-ai-spec-workflow-skills/spec.md) | AI-spec workflow (`CLAUDE.md`, `docs/specs`) and nine project skills | none | Implemented | 2026-11-21 |
| [002-ui-ux-skill-consolidation](002-ui-ux-skill-consolidation/spec.md) | `ui-ux` skill becomes the single styling reference (new `DESIGN.md` + tokens/components/surfaces references; root design docs removed) | none | Implemented with gaps | 2026-11-21 |
| [003-admin-dashboard-refresh](003-admin-dashboard-refresh/spec.md) | Admin shell + dashboard refresh (clear, direct, theme-consistent); standing theme rule | none | Implemented with gaps | 2026-11-22 |
| [004-open-payment-app](004-open-payment-app/spec.md) | Ways to Give: **Open GCash/BPI/BDO** button after saving a channel QR on a phone (issue Option C) | #323 | Implemented | 2026-11-24 |
| [005-remove-ci-playwright-job](005-remove-ci-playwright-job/spec.md) | Deploy workflow: remove the Playwright test job so deploy runs on its own | none | Implemented | 2026-11-24 |
| [006-add-sermon-weavers-investors-dreamers](006-add-sermon-weavers-investors-dreamers/spec.md) | Sermon id `46` "Wanted: Weavers, Investors, and Dreamers" (2 Corinthians 4:13–18); featured flag moves from `45` | none | Implemented | 2026-11-27 |
| [006-platform-admin-portal](006-platform-admin-portal/spec.md) | Platform admin portal: own sign-in (platform admins only) + read-only tenant → church → campus directory | none | Awaiting verification | 2026-11-26 |
| [007-signin-rate-limit-countdown](007-signin-rate-limit-countdown/spec.md) | Sign-in: on 429, show the wait from `Retry-After` with a countdown | none | Implemented | 2026-11-28 |
