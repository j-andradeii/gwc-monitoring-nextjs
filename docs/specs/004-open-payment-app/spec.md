# Feature Specification: Open the payment app after saving a giving QR

**Issue**: #323 · **Branch**: `MIGRATION-TO-TANSTACK` · **Created**: 2026-11-24 · **Status**: Implemented

## Overview

On `/give/ways-to-give`, a giver on a phone taps **Download QR**, then has to leave the site, find GCash / BPI /
BDO and open it themselves. This adds Option C (two-tap version) from issue #323: once the QR is saved on a
phone, the channel card shows an **Open <app>** button that opens that app (or its store page) so the giver can
scan the saved QR straight away. GCash cannot be opened with the church pre-filled from a website (issue #323,
Option A needs a payment gateway), so the giver still picks the saved QR in the app.

## Source (verbatim)

> check https://github.com/j-andradeii/gwc-monitoring-nextjs/issues/323 implement option c

Issue #323, Option C, "Recommended design: a second button right after saving":

> 1. Tap **Download QR**. This works as it does today: the share sheet opens, then the "QR code saved" toast appears.
> 2. Once the save succeeds (`outcome === 'shared' | 'downloaded'`), the card shows an **"Open GCash"** button (or "Open BPI" / "Open BDO") next to the toast.
> 3. Tapping it is a **new** tap, so the browser allows the app to open. On Android it uses the intent URL with the Play Store fallback. On iPhone it uses the scheme with the timer fallback (or just the App Store link if no scheme is confirmed).
> 4. In GCash, the giver taps **Scan QR → Upload from gallery** and picks the saved QR.

## User Scenarios & Acceptance

### Story 1 — Open GCash after saving its QR on Android (Priority: P1)
1. **Given** an Android phone with GCash installed, **When** the giver taps **Download QR** on the GCash card and
   the save succeeds, **Then** an **Open GCash** button and a one-line "scan the saved QR" hint appear in that
   card's QR area.
2. **Given** that button, **When** the giver taps it, **Then** Chrome opens GCash (via `gcash` scheme intent) or,
   if GCash can't take the link or isn't installed, the GCash Play Store page (which shows **Open** or
   **Install**).

### Story 2 — Open BPI / BDO, or any app on iPhone (Priority: P1)
1. **Given** a phone, **When** the giver saves the BPI or BDO QR, **Then** **Open BPI** / **Open BDO** appears.
2. **Given** an iPhone (any channel) or Android (BPI/BDO, no confirmed scheme), **When** the giver taps the
   button, **Then** the app's store page opens in a new tab / the store app, where an installed app shows
   **Open**. The giving page stays open behind it for the receipt upload.

### Story 3 — Nothing changes where it shouldn't (Priority: P1)
1. **Given** a desktop browser, **When** the QR is downloaded, **Then** no Open button appears.
2. **Given** the share sheet is cancelled or the fetch fails, **Then** no Open button appears.
3. **Given** the other pages that use `DownloadQRButton` (events, Life Class, SOD, outreach, projects),
   **Then** they behave exactly as before.

## Requirements

- **FR-001** After a successful QR save on a phone (`outcome` `shared` or `downloaded`, `mobile` true), the
  ways-to-give card that was saved shows an **Open <channel name>** button; only one card shows it at a time
  (the last saved). — derived (one at a time mirrors the receipt hint)
- **FR-002** Android: the button opens the app with an `intent://` URL carrying the app's package and the Play
  Store page as `S.browser_fallback_url` when the channel has a confirmed scheme; otherwise it links to the Play
  Store page.
- **FR-003** iPhone/iPad: the button links to the App Store page in a new tab; when a channel sets an iOS scheme,
  it tries the scheme first and falls back to the App Store page if the page is still visible after ~1.5 s.
- **FR-004** App ids live with the channel data in `src/data/giveData.ts` (`app` field on `GivingChannel`):
  GCash `com.globe.gcash.android` / App Store `520020791` / Android scheme `gcash`; BPI `com.bpi.ng.app` /
  `6443950982`; BDO `ph.com.bdo.retail` / `1551584630`. No iOS scheme is set until confirmed on a real iPhone.
- **FR-005** `DownloadQRButton` gains an optional `onSaved(result)` callback, called only when the file really
  saved; callers that don't pass it are unchanged.
- **FR-006** Mobile platform detection has one home (`src/lib/mobile-platform.ts`) used by both
  `useDownloadImage` and the new button. — derived (issue: "export it instead of copying it")
- **FR-007** The button and hint stay on the current theme: navy fill with white text and icon, ≥ 44px tall,
  visible `:focus-visible`, entry animation with a `prefers-reduced-motion` fallback; a missing colour becomes a
  token. — derived (`ui-ux` rules)
- **FR-008** The `ui-ux` skill documents the new `onSaved` prop, the token and the open-app strip. — derived

## Edge Cases

- Share sheet cancelled / fetch failed → `onSaved` never fires (code path read in `DownloadQRButton`; M004).
- Desktop → `mobile` false → no button (V006 desktop screenshot after a forced state is not possible; covered by
  code reading + M005).
- App not installed → Android intent falls back to Play Store; iPhone goes to App Store (M001–M003).
- Unknown mobile platform (`other`, e.g. KaiOS) → button renders nothing (code reading).
- In-app browsers (Messenger/Facebook) may block intents or new tabs → store link still a plain anchor (M006).
- Shared `GiveChannelsSection` (outreach/projects) → untouched (`git diff --name-only`).

## Rules & skills check

- Skills read: `coding-style`, `ui-ux` (`SKILL.md`, `DESIGN.md`, `references/components.md`). `security` read for
  scope only: no CSP change — links to app stores and app schemes are navigations, which this CSP doesn't restrict
  (no `navigate-to`), and nothing new is fetched, framed or imaged. `routing`, `forms`, `api-client`,
  `authentication`, `zustand`: not in range.
- Server vs client: `page.tsx` stays a Server Component; the new button is a client component (browser APIs) used
  inside the existing client `WaysToGiveChannelsSection`.
- Store vs query: local `useState` only (card-level UI state).
- Design tokens + contrast: navy `--color-navy` background with new `--color-on-navy` white text (≈ 14:1).
- Sermon content rule: n/a.
- Skills to update: `ui-ux` `references/components.md` (DownloadQRButton `onSaved`, open-app strip),
  `references/tokens.md` (new token), `coding-style` none.

## Out of Scope

- Option A (payment gateway) and Option D.
- One-tap Android version (skipping the share sheet).
- `GiveChannelsSection` and the outreach/projects giving cards.
- Pre-filling recipient or amount in any app.

## Success Criteria

- SC-001 `pnpm run lint` · SC-002 `npx tsc --noEmit` · SC-003 `pnpm run build` exit 0
- SC-004 every FR built and verified
- SC-005 the page renders unchanged at desktop and ~540px before any save (screenshots)
- SC-006 on real phones, the Open button opens the app or its store page (owner, M001–M003)

## Assumptions & Open Questions

- Package and App Store ids were looked up on the stores' public listings on 2026-11-24; BPI's Android id comes from
  a third-party report of the Play listing and must be confirmed on a device (M002).
- `gcash://` is undocumented. On Android a wrong scheme falls back safely to the Play Store, so it is enabled there.
  On iPhone a wrong scheme shows a Safari error, so it is off until the owner confirms it (M003); turning it on is
  one line (`iosScheme: 'gcash'`).

### Run 2026-11-24
- Added during the visual check: when the new strip would land under the "QR code saved" toast (bottom of the
  screen), it scrolls itself to the centre of the viewport (`OpenPaymentAppButton`, `TOAST_CLEARANCE_PX`). It
  serves FR-001 (the button must be visible) and changes no other page.
