'use client';

import React, { useState, useRef, useEffect, useCallback, ComponentType } from 'react';
import { NewLife } from './NewLife';
import { ConnectGroup } from './ConnectGroup';
import { Lifestyle } from './Lifestyle';
import { Growth } from './Growth';

interface NavItem {
  id: string;
  label: string;
  Component: ComponentType;
}

const navItems: NavItem[] = [
  { id: 'new-life', label: 'New Life', Component: NewLife },
  { id: 'connect-group', label: 'Connect Group', Component: ConnectGroup },
  { id: 'lifestyle', label: 'Lifestyle', Component: Lifestyle },
  { id: 'growth', label: 'Growth', Component: Growth },
];

export const ConnectTabs: React.FC = () => {
  const [activeId, setActiveId] = useState<string>('new-life');
  const [mounted, setMounted] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Sync from hash on mount (SSR-safe: only runs client-side)
  // setMounted must be called in a timeout to avoid synchronous setState-in-effect lint error
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      if (typeof window !== 'undefined') {
        const hash = window.location.hash.replace('#', '');
        const matchedItem = navItems.find((item) => item.id === hash);
        if (matchedItem) {
          setActiveId(matchedItem.id);
        }
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Update hash when tab changes (after mount only)
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${activeId}`);
    }
  }, [activeId, mounted]);

  // Auto-scroll active tab into view within the tab bar
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeIndex = navItems.findIndex((item) => item.id === activeId);
      const activeTab = tabRefs.current[activeIndex];
      if (activeTab) {
        const container = scrollContainerRef.current;
        const scrollLeft =
          activeTab.offsetLeft - container.offsetWidth / 2 + activeTab.offsetWidth / 2;
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, [activeId]);

  const handleTabClick = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
      let nextIndex: number | null = null;

      if (e.key === 'ArrowRight') {
        nextIndex = (currentIndex + 1) % navItems.length;
      } else if (e.key === 'ArrowLeft') {
        nextIndex = (currentIndex - 1 + navItems.length) % navItems.length;
      } else if (e.key === 'Home') {
        nextIndex = 0;
      } else if (e.key === 'End') {
        nextIndex = navItems.length - 1;
      }

      if (nextIndex !== null) {
        e.preventDefault();
        const nextItem = navItems[nextIndex];
        setActiveId(nextItem.id);
        tabRefs.current[nextIndex]?.focus();
      }
    },
    []
  );

  return (
    <div className="connect-tabs-wrapper">
      {/* Tab bar */}
      <div
        style={{
          position: 'sticky',
          top: '70px',
          zIndex: 900,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease',
          width: '100%',
        }}
      >
        <div
          ref={scrollContainerRef}
          className="landing-container"
          style={{
            overflowX: 'auto',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            scrollBehavior: 'smooth',
          }}
        >
          <div
            role="tablist"
            aria-label="Connect pathways"
            style={{
              display: 'flex',
              gap: '8px',
              padding: '16px 0',
              whiteSpace: 'nowrap',
            }}
          >
            {navItems.map((item, index) => {
              const isActive = activeId === item.id;
              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  id={`tab-${item.id}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${item.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => handleTabClick(item.id)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  style={{
                    padding: '10px 20px',
                    minHeight: '44px',
                    borderRadius: '50px',
                    border: '1px solid',
                    borderColor: isActive
                      ? 'var(--primary-gold-accent)'
                      : 'transparent',
                    backgroundColor: isActive
                      ? 'rgba(212, 168, 75, 0.1)'
                      : 'transparent',
                    color: isActive
                      ? 'var(--primary-gold-accent)'
                      : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    flexShrink: 0,
                  }}
                  className="connect-tab-btn"
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab panels — only the active panel mounts */}
      {navItems.map((item) => {
        const isActive = activeId === item.id;
        const PanelComponent = item.Component;
        return (
          <div
            key={item.id}
            id={`panel-${item.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${item.id}`}
            hidden={!isActive}
            className="connect-tab-panel"
          >
            {isActive && <PanelComponent />}
          </div>
        );
      })}

      <style>{`
        .connect-tab-btn:focus-visible {
          outline: 2px solid var(--primary-gold-accent);
          outline-offset: 2px;
        }
        @media (hover: none) {
          .connect-tab-btn {
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ConnectTabs;
