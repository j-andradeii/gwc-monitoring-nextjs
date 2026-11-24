/**
 * Mobile platform detection
 *
 * The one place the site decides "is this a phone, and which kind". Shared by
 * `useDownloadImage` (share sheet vs file download) and the ways-to-give
 * "Open GCash / BPI / BDO" button (Play Store intent vs App Store link), so the
 * two can never disagree about what device the giver is holding.
 *
 * Browser-only: on the server (no `navigator`) everything reports "not mobile".
 */

/** `other` = a phone/tablet that is neither iOS nor Android (webOS, KaiOS, …). */
export type MobilePlatform = 'ios' | 'android' | 'other';

export const getMobilePlatform = (): MobilePlatform | null => {
  if (typeof navigator === 'undefined') return null;
  const ua = navigator.userAgent || '';

  if (/Android/i.test(ua)) return 'android';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';

  // iPadOS 13+ Safari reports a desktop ("Macintosh") UA — detect it via touch.
  const isTouchMac =
    /Macintosh/.test(ua) &&
    typeof document !== 'undefined' &&
    'ontouchend' in document &&
    navigator.maxTouchPoints > 1;
  if (isTouchMac) return 'ios';

  if (/webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)) return 'other';

  return null;
};

/**
 * A real mobile / tablet device (touch phone, Android tablet, or iPad).
 * Desktop browsers — even ones that support the Web Share API (Safari/Edge on
 * macOS/Windows) — return false so they keep the normal file download.
 */
export const isMobileDevice = (): boolean => getMobilePlatform() !== null;
