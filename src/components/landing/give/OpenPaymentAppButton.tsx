'use client';

/**
 * OpenPaymentAppButton — "Open GCash / BPI / BDO" (issue #323, Option C).
 *
 * Shown on a Ways to Give channel card only AFTER its QR has been saved on a
 * phone. Saving goes through the OS share sheet, and once that sheet closes
 * the browser treats the original tap as spent — so opening the app straight
 * after the save, from the same tap, is unreliable (blocked outright on iOS).
 * A second, deliberate tap is a fresh user gesture the browser lets through.
 *
 * It is a real `<a>` so it still works if the click handler never runs: the
 * href is already the right link for this device (`getPaymentAppTarget`).
 * Renders nothing on platforms with no app store we can link to.
 */

import React, { useEffect, useRef } from 'react';
import { getMobilePlatform } from '@/lib/mobile-platform';
import {
  getPaymentAppTarget,
  openSchemeWithStoreFallback,
  type PaymentApp,
} from '@/lib/payment-app-link';

export interface OpenPaymentAppButtonProps {
  app: PaymentApp;
  /** Channel name as shown on the card ("GCash", "BPI", "BDO"). */
  appName: string;
}

/**
 * Room the "QR code saved" toast takes at the bottom of the screen (it shows
 * for 4s, bottom-centre, the moment this button appears). A card near the
 * bottom of the viewport would otherwise have its new button hidden under it.
 */
const TOAST_CLEARANCE_PX = 160;

export const OpenPaymentAppButton: React.FC<OpenPaymentAppButtonProps> = ({ app, appName }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  // Safe during render: this component only mounts after a tap in the
  // browser, never in the server HTML, so there is no hydration to mismatch.
  const target = getPaymentAppTarget(app, getMobilePlatform());

  // Bring the button clear of the toast, but only when it would be covered —
  // never move the page under someone who can already see it.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (el.getBoundingClientRect().bottom <= window.innerHeight - TOAST_CLEARANCE_PX) return;
    el.scrollIntoView({
      block: 'center',
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }, []);

  if (!target) return null;

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!target.iosSchemeUrl) return; // the href already does the job
    event.preventDefault();
    openSchemeWithStoreFallback(target.iosSchemeUrl, target.href);
  };

  return (
    <div ref={rootRef} className="gcs-open-app">
      <a
        href={target.href}
        className="gcs-open-app-btn"
        onClick={handleClick}
        {...(target.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        <i className="pi pi-external-link" aria-hidden="true"></i>
        <span>Open {appName}</span>
      </a>
      <p className="gcs-open-app-hint">
        In {appName}, choose to scan a QR, then pick the QR you just saved from your gallery.
      </p>
    </div>
  );
};

export default OpenPaymentAppButton;
