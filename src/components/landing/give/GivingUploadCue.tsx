'use client';

/**
 * GivingUploadCue — mobile-only floating prompt pointing at the giving
 * confirmation form.
 *
 * The problem it solves: on a phone the confirmation form sits a full screen of
 * channel cards below the fold, so a giver who never scrolls past the card they
 * came for has no way of knowing the form exists. `WaysToGiveChannelsSection`
 * already reveals an in-card hint, but only AFTER a successful copy — someone
 * who scans the QR, or types the number by hand, never triggers it. This is the
 * always-on cue for everyone else.
 *
 * Visible only while the giver is actually looking at the channels: it appears
 * when the channels section is on screen and hides again the moment the form
 * itself comes into view (no point pointing at something they can already see,
 * and it would otherwise float over the form's own fields).
 *
 * It renders INSIDE the "Give Details" tab panel, which is what scopes it to
 * that tab — `.wtg-tab-panel[hidden] { display: none !important }` takes the
 * whole subtree, fixed positioning included, out with the panel. No tab state
 * is passed in or duplicated here.
 *
 * Must NOT be moved inside `.give-channels-section`: that section sets
 * `overflow: hidden`, and this element's `position: fixed` only reliably
 * escapes it while no ancestor creates a containing block (a `transform`,
 * `filter`, or `will-change` on any wrapper would clip it to the section).
 */

import React, { useEffect, useState } from 'react';

export interface GivingUploadCueProps {
  /** Section that must be on screen for the cue to show. */
  channelsTargetId?: string;
  /** The form it points at — also the anchor it links to. */
  confirmationTargetId?: string;
  /** Prompt copy. Short by design: it's read at a glance, one-handed. */
  label?: string;
}

export const GivingUploadCue: React.FC<GivingUploadCueProps> = ({
  channelsTargetId = 'give-channels',
  confirmationTargetId = 'giving-confirmation',
  label = 'Already sent your gift? Upload your receipt',
}) => {
  const [channelsInView, setChannelsInView] = useState(false);
  const [formInView, setFormInView] = useState(false);

  useEffect(() => {
    const channelsEl = document.getElementById(channelsTargetId);
    const formEl = document.getElementById(confirmationTargetId);
    if (!channelsEl || !formEl) return;

    const channelsObserver = new IntersectionObserver(
      ([entry]) => setChannelsInView(entry.isIntersecting),
      { threshold: 0 }
    );
    const formObserver = new IntersectionObserver(
      ([entry]) => setFormInView(entry.isIntersecting),
      // Bottom margin expands the root downwards, so the form counts as "in
      // view" ~140px before it actually clears the fold — the cue is gone
      // before it can overlap the form's first field rather than as it does.
      { threshold: 0, rootMargin: '0px 0px 140px 0px' }
    );

    channelsObserver.observe(channelsEl);
    formObserver.observe(formEl);

    return () => {
      channelsObserver.disconnect();
      formObserver.disconnect();
    };
  }, [channelsTargetId, confirmationTargetId]);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(confirmationTargetId);
    // Nothing to scroll to — let the browser resolve the anchor itself.
    if (!target) return;

    event.preventDefault();
    // `scrollIntoView` honours the form section's own `scroll-margin-top: 170px`
    // (fixed header + sticky tab bar), so that allowance stays in one place.
    target.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  // Unmounted rather than hidden with a class: keeps it out of the
  // accessibility tree and off the tab order whenever it isn't on screen.
  if (!channelsInView || formInView) return null;

  return (
    <a
      href={`#${confirmationTargetId}`}
      className="gcs-upload-cue"
      onClick={handleClick}
      aria-label={`${label} — goes to the giving confirmation form`}
    >
      <span className="gcs-upload-cue-icon" aria-hidden="true">
        <i className="pi pi-camera"></i>
      </span>
      <span className="gcs-upload-cue-text">{label}</span>
      <span className="gcs-upload-cue-chevron" aria-hidden="true">
        <i className="pi pi-arrow-down"></i>
      </span>
    </a>
  );
};

export default GivingUploadCue;
