# Checklist: Open the payment app after saving a giving QR

**Spec**: [spec.md](spec.md) · **Run**: 2026-11-24 13:50 · **Pre-run HEAD**: `bf74c13` · **Status**: Implemented

Pre-run `git status --short`: clean.

Format: `- [ ] ID [FR-00n] description — path · verified by <test path | check | manual — what to check>`

## Implementation
- [x] T001 [FR-006] mobile platform detection (one home) — `src/lib/mobile-platform.ts` · verified by tsc
- [x] T002 [FR-006] use shared detection — `src/hooks/useDownloadImage.ts` · verified by tsc + reading (same UA rules)
- [x] T003 [FR-002, FR-003] store / intent / scheme helpers — `src/lib/payment-app-link.ts` · verified by tsc + reading
- [x] T004 [FR-004] `app` field + ids on GCash, BPI, BDO — `src/data/giveData.ts` · verified by tsc + reading
- [x] T005 [FR-005] `onSaved` callback — `src/components/ui/DownloadQRButton.tsx` · verified by tsc + reading (only on `shared`/`downloaded`)
- [x] T006 [FR-001, FR-002, FR-003, FR-007] Open-app button — `src/components/landing/give/OpenPaymentAppButton.tsx` · verified by tsc + lint
- [x] T007 [FR-001] show the button on the saved card — `src/components/landing/give/WaysToGiveChannelsSection.tsx` · verified by tsc + screenshots
- [x] T008 [FR-001] barrel export — `src/components/landing/give/index.ts` · verified by tsc
- [x] T009 [FR-007] open-app strip styles — `src/styles/landing.css` · verified by screenshots
- [x] T010 [FR-007] `--color-on-navy` token — `src/app/globals.css` · verified by reading
- [x] T011 [FR-008] skill docs — `docs/skills/ui-ux/references/components.md`, `docs/skills/ui-ux/references/tokens.md` · verified by reading
- [x] T012 specs index row — `docs/specs/README.md` · verified by reading

## Verification
- [x] V001 `pnpm run lint` exits 0
- [x] V002 `npx tsc --noEmit` exits 0
- [x] V003 `pnpm run build` exits 0
- [x] V004 "Checklist before shipping" of `coding-style` and `ui-ux` run against the diff
- [x] V005 `docs/skills/` and `CLAUDE.md` still true
- [x] V006 UI: screenshots at desktop and ~540px, including the Open button state
- [x] V007 [FR-005] other `DownloadQRButton` callers untouched — `git diff --name-only` shows none of them

## Manual checks
- [ ] M001 [FR-002] Android + GCash installed: Download QR → save → **Open GCash** → GCash opens (or its Play Store page with **Open**); not installed → Play Store page
- [ ] M002 [FR-002, FR-004] Android: **Open BPI** / **Open BDO** open the right Play Store pages (confirms `com.bpi.ng.app`, `ph.com.bdo.retail`)
- [ ] M003 [FR-003] iPhone: each **Open** button opens the right App Store page with **Open** / **Get**; then type `gcash://` in Safari — if GCash opens, set `iosScheme: 'gcash'` in `giveData.ts`
- [ ] M004 [FR-001] phone: cancel the share sheet → no toast and no Open button
- [ ] M005 [FR-001] desktop: Download QR works as before, no Open button
- [ ] M006 open the page from Messenger's in-app browser on Android and iPhone: the button still leads to the app or its store page
- [ ] M007 [FR-005] events / Life Class / SOD / outreach QR downloads still behave as before

## Evidence (after the last edit, 2026-11-24)
- V001 `pnpm run lint` exit 0 — 31 warnings, none in new files; `WaysToGiveChannelsSection.tsx:32` unused
  `CONTACT_INFO` is pre-existing (present at `bf74c13`).
- V002 `npx tsc --noEmit` exit 0 · V003 `pnpm run build` exit 0 (`/give/ways-to-give` static).
- V004 coding-style: new files in home folders with header comments; `'use client'` only on the button; `@/`
  imports; barrel updated; no `any` / `@ts-ignore` / `console.log` added. ui-ux: hex grep shows only the
  `--color-on-navy` token definition (plus a `#323` issue number in a CSS comment); navy fill + white ink set
  together; strip scoped under `.give-channels-section` with the `gcs-` prefix; `:focus-visible`, 44px target,
  reduced-motion fallback; screenshots taken.
- V005 no skill or `CLAUDE.md` line names the moved `isMobileDevice`; ui-ux `tokens.md` / `components.md` updated.
- V006 Playwright (scratch script, production build on port 3200, share sheet stubbed): desktop 1440 channels
  unchanged; 540px before save unchanged; Android 540 GCash → `OPEN GCASH`, intent URL, same tab; Android BDO →
  Play Store, new tab; iPhone 390 BPI / GCash → App Store, new tab; strip scrolls clear of the toast (bottom
  478px of 844); white label on navy (`rgb(255,255,255)` on `rgb(26,39,68)`); desktop download and cancelled
  share → no button; only one card shows it at a time.
- V007 `git diff --name-only bf74c13` lists no other `DownloadQRButton` caller.

## Gap list
None. M001–M007 are open for the owner (real phones and apps).
