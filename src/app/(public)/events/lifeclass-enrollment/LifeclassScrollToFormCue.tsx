'use client';

/**
 * LifeclassScrollToFormCue — mobile-only floating cue pointing at the
 * enrollment form.
 *
 * Below 992px the two-column layout stacks (see vip-form.css), so the poster,
 * the welcome card and the "Already Enrolled?" tab all land ABOVE the form: on
 * a phone the first question sits roughly two screens down, with nothing on the
 * way there saying a form exists at all. This is the always-on way in.
 *
 * Mirrors `GivingUploadCue` (components/landing/give) element for element —
 * same navy pill, gold icon chip and nudging arrow — so the site's two "the
 * form is further down" prompts read as one thing. The bottom of the screen is
 * free here: ConnectFab hides itself on every `/events/*` route.
 *
 * Where it differs: the giving cue waits for the channels band to come into
 * view before it appears, because that page has content worth reading first.
 * Here the form IS the page, so the cue is up from the top — it only has to
 * disappear once the reader has actually arrived at the form (see the
 * observer's rootMargin, which is what decides "arrived").
 * `boundingClientRect.top > 0` separates "not scrolled to yet" from "already
 * scrolled past", so it never floats over the footer pointing down at a form
 * the reader has finished with. Whenever the form isn't on the page at all —
 * the pay-later panel is open, or either confirmation screen is up — the parent
 * unmounts this instead, so there is no state in which it points at nothing.
 */

import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';

interface LifeclassScrollToFormCueProps {
  /** The form whose position decides whether the cue is showing. */
  targetId?: string;
  /**
   * Where a tap lands — also the anchor href. Deliberately NOT the form: it is
   * the "Already Enrolled?" tab just above it, so the reader arrives looking at
   * the pay-later route and the form's own header rather than at a bare first
   * field. Falls back to `targetId` if the element isn't there.
   */
  scrollTargetId?: string;
  /** Prompt copy. Short by design: it's read at a glance, one-handed. */
  label?: string;
}

export default function LifeclassScrollToFormCue({
  targetId = 'lifeclass-enroll-form',
  scrollTargetId = 'lifeclass-enroll-start',
  label = 'Ready to enroll? Jump to the form',
}: LifeclassScrollToFormCueProps) {
  const [showCue, setShowCue] = useState(false);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setShowCue(!entry.isIntersecting && entry.boundingClientRect.top > 0),
      /**
       * A NEGATIVE bottom margin, which pulls the root's bottom edge UP to 75%
       * of the viewport: the form only counts as "arrived" once its top has
       * risen past that line, which is roughly where its header and first field
       * are actually readable.
       *
       * The obvious sign is wrong here. Expanding the root downwards instead
       * (`140px`) marks the form as in view while it is still BELOW the fold —
       * on a tall window that leaves the reader looking at the welcome card
       * with no form on screen and no cue either, which is the exact hole this
       * component exists to fill.
       *
       * Pulling the edge up also keeps the cue clear of what it points at: by
       * the time it unmounts the form's top is three quarters of the way up the
       * screen, nowhere near the bar sitting on the bottom edge.
       */
      { threshold: 0, rootMargin: '0px 0px -25% 0px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [targetId]);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const target =
      document.getElementById(scrollTargetId) ?? document.getElementById(targetId);
    // Nothing to scroll to — let the browser resolve the anchor itself.
    if (!target) return;

    event.preventDefault();
    // `scrollIntoView` honours the target's own `scroll-margin-top` (the fixed
    // header's allowance), so that number stays in one place.
    target.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  // Unmounted rather than hidden with a class: keeps it out of the
  // accessibility tree and off the tab order whenever it isn't on screen.
  if (!showCue) return null;

  return (
    <a
      href={`#${scrollTargetId}`}
      className="lifeclass-form-cue"
      onClick={handleClick}
      aria-label={`${label} — goes to the Life Class enrollment form`}
    >
      <span className="lifeclass-form-cue-icon" aria-hidden="true">
        <i className="pi pi-pencil"></i>
      </span>
      <span className="lifeclass-form-cue-text">{label}</span>
      <span className="lifeclass-form-cue-chevron" aria-hidden="true">
        <i className="pi pi-arrow-down"></i>
      </span>
    </a>
  );
}
