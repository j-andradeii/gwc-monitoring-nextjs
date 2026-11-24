/**
 * Payment app links (GCash, BPI, BDO)
 *
 * Builds the link behind the ways-to-give "Open <app>" button (issue #323,
 * Option C; spec 004). Goal: open the app itself when it's installed, and the
 * app's store page when it isn't. None of these apps publishes a link that
 * pre-fills a recipient, so the giver still scans the QR they just saved.
 *
 * Opening an installed app from a web page needs a deep link the app itself
 * registers (`deepLink`). GCash publishes its own: `gcash://com.mynt.gcash/app/<screen>`,
 * listed in https://www.gcash.com/.well-known/apple-app-site-association. BPI
 * and BDO publish none (no scheme, no app-link file), so on iPhone the store
 * page is the best a website can do — an installed app shows "Open" there.
 *
 *   • Android: every app gets an `intent://` URL that names the package and
 *     carries the Play Store page as `S.browser_fallback_url`. Chrome opens the
 *     app if it's installed and takes the link, and goes to the Play Store
 *     otherwise — the browser does the fallback, no timers. Apps without a
 *     deep link try their `https` handler (see `getPaymentAppTarget`).
 *   • iPhone/iPad: Safari has no fallback of its own, so we navigate to the
 *     deep link and, if the page is still on screen ~1.5 s later (the app did
 *     not take over), send the giver to the App Store app. When the app is
 *     missing, Safari may flash an "address is invalid" alert first — that is
 *     iOS, and unavoidable from a web page.
 */

import type { MobilePlatform } from '@/lib/mobile-platform';

export interface PaymentApp {
  /** Play Store package id, e.g. `com.globe.gcash.android`. */
  androidPackage: string;
  /** Numeric App Store id (the digits after `id` in an apps.apple.com URL). */
  iosAppStoreId: string;
  /**
   * A link the app registers itself (`scheme://host/path`), used on Android
   * and iOS to open the installed app directly. Leave unset when the app
   * publishes none — the button then opens the store page.
   */
  deepLink?: string;
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
  /** iOS only: the deep link to try first, then `iosStoreFallbackUrl`. */
  iosDeepLink?: string;
  iosStoreFallbackUrl?: string;
}

export const playStoreUrl = (androidPackage: string): string =>
  `https://play.google.com/store/apps/details?id=${androidPackage}`;

// The `/ph/` storefront: the church's givers, and the apps are PH-only.
export const appStoreUrl = (iosAppStoreId: string): string =>
  `https://apps.apple.com/ph/app/id${iosAppStoreId}`;

/**
 * The App Store app's own scheme. Used for the iOS fallback because it runs
 * from a timer (no tap behind it): an https apps.apple.com navigation from a
 * timer only loads the store's web page, while this opens the App Store app.
 */
const appStoreAppUrl = (iosAppStoreId: string): string =>
  `itms-apps://apps.apple.com/ph/app/id${iosAppStoreId}`;

/**
 * Wraps a deep link (`gcash://com.mynt.gcash/app/…`) in an Android intent URL:
 * `intent://com.mynt.gcash/app/…#Intent;scheme=gcash;package=…;S.browser_fallback_url=…;end`.
 * Returns null for a link that has no `scheme://` to split on.
 */
export const androidIntentUrl = (androidPackage: string, deepLink: string): string | null => {
  const match = /^([a-z][a-z0-9+.-]*):\/\/(.*)$/i.exec(deepLink);
  if (!match) return null;
  const [, scheme, rest] = match;
  return (
    `intent://${rest}#Intent;scheme=${scheme};package=${androidPackage};` +
    `S.browser_fallback_url=${encodeURIComponent(playStoreUrl(androidPackage))};end`
  );
};

/** Picks the link for this device; `null` where no app store applies. */
export const getPaymentAppTarget = (
  app: PaymentApp,
  platform: MobilePlatform | null
): PaymentAppTarget | null => {
  if (platform === 'android') {
    // Always an intent: Chrome falls back to the Play Store on its own, so
    // trying the app first never leaves the giver worse off. Without a deep
    // link, `https://` asks for the app's own web-link handler (`intent://
    // #Intent;scheme=https;package=…`) — it opens the app only if the app takes
    // plain web links, and otherwise lands on the Play Store page.
    const intent = androidIntentUrl(app.androidPackage, app.deepLink ?? 'https://');
    return intent
      ? { href: intent, newTab: false }
      : { href: playStoreUrl(app.androidPackage), newTab: true };
  }

  if (platform === 'ios') {
    return {
      href: appStoreUrl(app.iosAppStoreId),
      newTab: true,
      iosDeepLink: app.deepLink,
      iosStoreFallbackUrl: app.deepLink ? appStoreAppUrl(app.iosAppStoreId) : undefined,
    };
  }

  return null;
};

/** How long the page may stay visible before we decide the app didn't open. */
const DEEP_LINK_FALLBACK_MS = 1500;
/** After a system prompt/alert closes and the page is still here: go now-ish. */
const AFTER_PROMPT_FALLBACK_MS = 600;
/** Stop listening after this long, whatever happened. */
const GIVE_UP_MS = 60_000;

/**
 * iOS: try the deep link, and if the page is still on screen afterwards (the
 * app didn't take over), open the store instead. Leaving for the app hides the
 * page, which cancels the fallback so the giver doesn't come back to an App
 * Store they never asked for.
 *
 * Safari may put a system sheet over the page first — "Open in GCash?" when the
 * app is installed, "address is invalid" when it isn't. Either can blur the
 * page; the timer pauses while one is up (a fallback firing behind "Open in
 * GCash?" would replace it before the giver can answer) and resumes briefly
 * once the page has focus again and is still showing.
 */
export const openDeepLinkWithStoreFallback = (deepLink: string, storeUrl: string): void => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const arm = (ms: number) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      const stillHere = document.visibilityState === 'visible';
      cancel();
      if (stillHere) window.location.href = storeUrl;
    }, ms);
  };

  const pause = () => {
    if (timer) clearTimeout(timer);
    timer = null;
  };

  const resume = () => {
    if (document.visibilityState === 'visible') arm(AFTER_PROMPT_FALLBACK_MS);
  };

  const onVisibility = () => {
    if (document.visibilityState === 'hidden') cancel();
  };

  const giveUp = setTimeout(() => cancel(), GIVE_UP_MS);

  function cancel() {
    pause();
    clearTimeout(giveUp);
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('pagehide', cancel);
    window.removeEventListener('blur', pause);
    window.removeEventListener('focus', resume);
  }

  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('pagehide', cancel);
  window.addEventListener('blur', pause);
  window.addEventListener('focus', resume);

  arm(DEEP_LINK_FALLBACK_MS);
  window.location.href = deepLink;
};
