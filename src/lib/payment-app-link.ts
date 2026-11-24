/**
 * Payment app links (GCash, BPI, BDO)
 *
 * Builds the link behind the ways-to-give "Open <app>" button (issue #323,
 * Option C). None of these apps publishes a link that pre-fills a recipient,
 * so all a website can do is get the giver INTO the app; they then scan the QR
 * they just saved. Two kinds of link, picked per platform:
 *
 *   • A deep-link scheme (`gcash://`) — opens the app directly, but only where
 *     the app really registers it. Undocumented, so each one is opt-in per
 *     platform in `src/data/giveData.ts`.
 *   • The app's store page — always works: an installed app shows "Open", a
 *     missing one shows "Install". The safe default.
 *
 * On Android the scheme travels inside an `intent://` URL whose
 * `S.browser_fallback_url` is the Play Store page, so Chrome itself falls back
 * when the app is missing or doesn't take the scheme — no timers needed. iOS
 * has no equivalent: an unknown scheme makes Safari show an "address is
 * invalid" alert, which is why the iOS scheme stays off until it has been
 * confirmed on a real iPhone, and why it needs the visibility timer below.
 */

import type { MobilePlatform } from '@/lib/mobile-platform';

export interface PaymentApp {
  /** Play Store package id, e.g. `com.globe.gcash.android`. */
  androidPackage: string;
  /** Numeric App Store id (the digits after `id` in an apps.apple.com URL). */
  iosAppStoreId: string;
  /**
   * Scheme (without `://`) the Android app accepts from a browser. Safe to set
   * on a hunch: a wrong one just lands on the Play Store page.
   */
  androidScheme?: string;
  /**
   * Scheme (without `://`) to try on iPhone/iPad. Only set once it has been
   * seen to open the app from Safari — a wrong one shows a Safari error.
   */
  iosScheme?: string;
}

/** What the button renders: a real link (works without JS) plus how to open it. */
export interface PaymentAppTarget {
  href: string;
  /**
   * Store pages open in a new tab so the giving page — and its receipt-upload
   * form — is still there when the giver comes back. Intent URLs stay in the
   * same tab: Chrome hands them off without navigating the page away.
   */
  newTab: boolean;
  /** iOS only: a scheme URL to try first, falling back to `href`. */
  iosSchemeUrl?: string;
}

export const playStoreUrl = (androidPackage: string): string =>
  `https://play.google.com/store/apps/details?id=${androidPackage}`;

// The `/ph/` storefront: the church's givers, and the apps are PH-only.
export const appStoreUrl = (iosAppStoreId: string): string =>
  `https://apps.apple.com/ph/app/id${iosAppStoreId}`;

/**
 * `intent://` URL Chrome (and most Android browsers) resolve against the
 * installed app. Chrome only launches activities that accept BROWSABLE links,
 * which is why a scheme is required — a package alone can't open an app's
 * home screen from a web page.
 */
export const androidIntentUrl = (androidPackage: string, scheme: string): string =>
  `intent://#Intent;scheme=${scheme};package=${androidPackage};` +
  `S.browser_fallback_url=${encodeURIComponent(playStoreUrl(androidPackage))};end`;

/** Picks the link for this device; `null` where no app store applies. */
export const getPaymentAppTarget = (
  app: PaymentApp,
  platform: MobilePlatform | null
): PaymentAppTarget | null => {
  if (platform === 'android') {
    return app.androidScheme
      ? { href: androidIntentUrl(app.androidPackage, app.androidScheme), newTab: false }
      : { href: playStoreUrl(app.androidPackage), newTab: true };
  }

  if (platform === 'ios') {
    return {
      href: appStoreUrl(app.iosAppStoreId),
      newTab: true,
      iosSchemeUrl: app.iosScheme ? `${app.iosScheme}://` : undefined,
    };
  }

  return null;
};

/** How long the page may stay visible before we decide the app didn't open. */
const SCHEME_FALLBACK_MS = 1500;

/**
 * iOS: try the scheme, and if the page is still on screen afterwards (the app
 * didn't take over), go to the store page instead. Leaving for the app hides
 * the page, which cancels the fallback so the giver doesn't come back to an
 * App Store tab they never asked for.
 */
export const openSchemeWithStoreFallback = (schemeUrl: string, storeUrl: string): void => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const cancel = () => {
    if (timer) clearTimeout(timer);
    timer = null;
    document.removeEventListener('visibilitychange', onHidden);
    window.removeEventListener('pagehide', cancel);
  };

  function onHidden() {
    if (document.visibilityState === 'hidden') cancel();
  }

  document.addEventListener('visibilitychange', onHidden);
  window.addEventListener('pagehide', cancel);

  timer = setTimeout(() => {
    const stillHere = document.visibilityState === 'visible';
    cancel();
    // Same tab: a new tab opened from a timer (no tap behind it) is a blocked
    // popup on iOS.
    if (stillHere) window.location.href = storeUrl;
  }, SCHEME_FALLBACK_MS);

  window.location.href = schemeUrl;
};
