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
      }
    }, 0);
    return () => clearTimeout(timer);
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
