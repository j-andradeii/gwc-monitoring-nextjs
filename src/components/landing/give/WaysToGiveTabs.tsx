'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

export interface WaysToGiveTabsProps {
  /** "Give Details" panel content — the giving-channels block only. */
  detailsPanel: React.ReactNode;
  /** "Why We Give" panel content — Tithes, Firstfruits, testimonies + Contact. */
  whyPanel: React.ReactNode;
}

type TabId = 'give-details' | 'why-we-give';

interface TabItem {
  id: TabId;
  label: string;
  icon: string;
  /** URL hash written on click / read on mount. */
  hash: string;
}

const TAB_ITEMS: TabItem[] = [
  { id: 'give-details', label: 'Give Details', icon: 'pi pi-wallet', hash: 'give-channels' },
  { id: 'why-we-give', label: 'Why We Give', icon: 'pi pi-heart', hash: 'why-we-give' },
];

// Deep-link hashes that live inside each panel — map every anchor a link
// might point at (nav, footer, email, etc.) to the tab that contains it.
const HASH_TO_TAB: Record<string, TabId> = {
  'give-channels': 'give-details',
  'why-we-give': 'why-we-give',
  'tithes-offering': 'why-we-give',
  'tithes-offering-testimony': 'why-we-give',
  firstfruits: 'why-we-give',
  'firstfruits-testimony': 'why-we-give',
};

/** House easing (same cubic as AboutSection's count-up): fast out, soft stop. */
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/** Beat before the glide starts, so the hero is seen rather than flashed past. */
const LANDING_DELAY_MS = 150;
/** Long enough to read as a deliberate move, short enough not to feel held up. */
const LANDING_DURATION_MS = 900;

/**
 * Eases the window down to `targetId` and returns a cancel function.
 *
 * Hand-animated rather than `scrollIntoView({ behavior: 'smooth' })` because
 * globals.css sets `scroll-behavior: auto` below 769px on purpose ("use JS for
 * better control") — the native call would animate on desktop and hard-cut on
 * phones, which is where this page is mostly read.
 *
 * The giver always outranks the animation: a wheel, touch, or key during the
 * wait or the glide cancels it on the spot, and a page that is already scrolled
 * when the timer fires is left alone. Nothing here fights someone who has
 * started reading.
 *
 * Input events, deliberately, rather than a `scroll` listener: the glide moves
 * the window itself, so a scroll listener would cancel on its own first frame.
 */
function glideToLanding(targetId: string): () => void {
  if (typeof window === 'undefined') return () => {};

  let rafId: number | null = null;
  let cancelled = false;

  // Declared before `cancel` so it can be captured by value: the callback only
  // ever runs on a later task, by which point `cancel` is initialised.
  const startTimer = window.setTimeout(() => {
    if (cancelled) return;

    const target = document.getElementById(targetId);
    // Someone who has already scrolled is reading — leave them where they are.
    if (!target || window.scrollY > 4) return cancel();

    // Honours the section's own `scroll-margin-top` (170px here: fixed header
    // + sticky tab bar) so the allowance stays in the stylesheet.
    const marginTop = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    const startY = window.scrollY;
    const endY = Math.min(
      target.getBoundingClientRect().top + startY - marginTop,
      // Never ask for a position past the end of the document, or the glide
      // spends its last frames easing toward somewhere it can't reach.
      document.documentElement.scrollHeight - window.innerHeight
    );
    const distance = endY - startY;
    if (Math.abs(distance) < 1) return cancel();

    // Reduced motion gets the destination without the journey.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo({ top: endY, behavior: 'auto' });
      return cancel();
    }

    const startTime = performance.now();
    const step = (now: number) => {
      if (cancelled) return;
      const progress = Math.min((now - startTime) / LANDING_DURATION_MS, 1);
      window.scrollTo({ top: startY + distance * easeOut(progress), behavior: 'auto' });
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        cancel();
      }
    };
    rafId = requestAnimationFrame(step);
  }, LANDING_DELAY_MS);

  const cancel = () => {
    cancelled = true;
    if (rafId !== null) cancelAnimationFrame(rafId);
    window.clearTimeout(startTimer);
    window.removeEventListener('wheel', cancel);
    window.removeEventListener('touchstart', cancel);
    window.removeEventListener('keydown', cancel);
  };

  // Any input from the giver outranks the glide — including during the delay.
  window.addEventListener('wheel', cancel, { passive: true, once: true });
  window.addEventListener('touchstart', cancel, { passive: true, once: true });
  window.addEventListener('keydown', cancel, { once: true });

  return cancel;
}

/**
 * Ways to Give — content-switcher tabs.
 *
 * Both panels are ALWAYS rendered (toggled only via the `hidden` attribute)
 * because the giving copy backs the FAQPage JSON-LD in page.tsx and must
 * stay in the SSR HTML for SEO. This intentionally differs from
 * `ConnectTabs`, which conditionally mounts only the active panel.
 *
 * Tab-panel animation gotcha (see DESIGN_SYSTEM.md "Tab-panel animation
 * gotcha" + connect/NewLife.tsx): `ScrollAnimationProvider`'s
 * IntersectionObserver runs once on mount and unobserves each element after
 * its first intersection. Elements inside a `display:none` panel never
 * intersect, so on tab-switch they could stay stuck at `opacity:0`. We
 * reveal the target panel's `.animate-on-scroll` cards on mount / tab
 * change via `requestAnimationFrame`, not a fresh observer.
 */
export const WaysToGiveTabs: React.FC<WaysToGiveTabsProps> = ({ detailsPanel, whyPanel }) => {
  const [activeId, setActiveId] = useState<TabId>('give-details');
  const [mounted, setMounted] = useState(false);
  const [isStuck, setIsStuck] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const detailsPanelRef = useRef<HTMLDivElement>(null);
  const whyPanelRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  /** Cancels the landing glide (see `glideToLanding`) if this unmounts first. */
  const cancelLandingRef = useRef<(() => void) | null>(null);

  const panelRef = useCallback(
    (id: TabId) => (id === 'give-details' ? detailsPanelRef.current : whyPanelRef.current),
    []
  );

  const revealPanel = useCallback((id: TabId) => {
    const panelEl = panelRef(id);
    if (!panelEl) return;
    const animated = panelEl.querySelectorAll('.animate-on-scroll:not(.animate-visible)');
    if (animated.length === 0) return;
    requestAnimationFrame(() => {
      animated.forEach((el) => el.classList.add('animate-visible'));
    });
  }, [panelRef]);

  // Reveal the initially-active panel's cards on mount.
  useEffect(() => {
    revealPanel('give-details');
  }, [revealPanel]);

  // Stuck-state detection: a 1px sentinel sits immediately before the sticky
  // bar. `.landing-header` is `position: fixed` at exactly 70px tall, so a
  // `-71px` top rootMargin makes the sentinel "leave" the viewport the moment
  // the bar pins beneath it. setState inside the IO callback (not the effect
  // body) is safe under the sync-setState-in-effect lint rule.
  useEffect(() => {
    const sentinelEl = sentinelRef.current;
    if (!sentinelEl) return;
    const io = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { rootMargin: '-71px 0px 0px 0px', threshold: 0 }
    );
    io.observe(sentinelEl);
    return () => io.disconnect();
  }, []);

  // Sync from hash on mount (SSR-safe: only runs client-side). setMounted is
  // deferred in a timeout to avoid the synchronous setState-in-effect lint rule.
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      if (typeof window === 'undefined') return;
      const hash = window.location.hash.replace('#', '');
      const matchedTab = HASH_TO_TAB[hash];

      if (matchedTab) {
        setActiveId(matchedTab);
        revealPanel(matchedTab);
        requestAnimationFrame(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        return;
      }

      /**
       * No hash (or one this page doesn't own): glide down to the giving
       * channels rather than sitting at the top of the hero. Anyone arriving
       * here — from the nav, a shared link, or a redirect — came to give, and
       * the channels are the thing they came for. Animating it (rather than
       * jumping) keeps the hero readable on the way past, so the page still
       * introduces itself instead of appearing to have loaded halfway down.
       *
       * The hash is written by the effect below, so a reload or a share keeps
       * the same spot.
       */
      const [defaultTab] = TAB_ITEMS;
      cancelLandingRef.current = glideToLanding(defaultTab.hash);
    }, 0);

    return () => {
      clearTimeout(timer);
      // A tab switch or route change mid-glide must not leave a rAF loop
      // driving the scroll position of a page the giver has left.
      cancelLandingRef.current?.();
    };
  }, [revealPanel]);

  // Update the hash when the tab changes (after mount only) — replaceState so
  // switching tabs never adds a new history entry.
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    const tab = TAB_ITEMS.find((t) => t.id === activeId);
    if (tab) {
      window.history.replaceState(null, '', `#${tab.hash}`);
    }
  }, [activeId, mounted]);

  const handleTabClick = useCallback(
    (id: TabId) => {
      setActiveId(id);
      revealPanel(id);
    },
    [revealPanel]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
      let nextIndex: number | null = null;

      if (e.key === 'ArrowRight') {
        nextIndex = (currentIndex + 1) % TAB_ITEMS.length;
      } else if (e.key === 'ArrowLeft') {
        nextIndex = (currentIndex - 1 + TAB_ITEMS.length) % TAB_ITEMS.length;
      } else if (e.key === 'Home') {
        nextIndex = 0;
      } else if (e.key === 'End') {
        nextIndex = TAB_ITEMS.length - 1;
      }

      if (nextIndex !== null) {
        e.preventDefault();
        const nextItem = TAB_ITEMS[nextIndex];
        handleTabClick(nextItem.id);
        tabRefs.current[nextIndex]?.focus();
      }
    },
    [handleTabClick]
  );

  return (
    <div className="wtg-tabs-wrapper">
      {/* 1px sentinel — observed to toggle the stuck-state shadow on the bar below */}
      <div ref={sentinelRef} className="wtg-tabs-sentinel" aria-hidden="true" />

      {/* Sticky segmented-control tab bar */}
      <div className={`wtg-tabs-bar${isStuck ? ' is-stuck' : ''}`}>
        <div className="landing-container wtg-tabs-scroll">
          <div role="tablist" aria-label="Ways to give" className="wtg-tablist">
            {TAB_ITEMS.map((item, index) => {
              const isActive = activeId === item.id;
              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  id={`wtg-tab-${item.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`wtg-panel-${item.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => handleTabClick(item.id)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`wtg-tab-btn${isActive ? ' is-active' : ''}`}
                >
                  <i className={item.icon} aria-hidden="true" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/*
        Both panels render always — visibility toggles via `hidden` only (SEO).

        `wtg-tab-panel--alternating` declares the house white/cream band rhythm
        (DESIGN_SYSTEM.md §8 "Section Background Alternation": first section
        white, then alternate) for each panel's direct `<section>` children.
        The alternation itself is painted in landing.css via CSS `nth-of-type`
        rather than by injecting classes into children here, because each
        panel is passed in as a JSX fragment (`detailsPanel` / `whyPanel`) —
        `React.Children.map` over a fragment yields the fragment itself, not
        its sections, so per-child class injection would be brittle.
      */}
      <div
        ref={detailsPanelRef}
        id="wtg-panel-give-details"
        role="tabpanel"
        aria-labelledby="wtg-tab-give-details"
        hidden={activeId !== 'give-details'}
        className="wtg-tab-panel wtg-tab-panel--alternating"
      >
        {detailsPanel}
      </div>

      <div
        ref={whyPanelRef}
        id="wtg-panel-why-we-give"
        role="tabpanel"
        aria-labelledby="wtg-tab-why-we-give"
        hidden={activeId !== 'why-we-give'}
        className="wtg-tab-panel wtg-tab-panel--alternating"
      >
        {whyPanel}
      </div>
    </div>
  );
};

export default WaysToGiveTabs;
