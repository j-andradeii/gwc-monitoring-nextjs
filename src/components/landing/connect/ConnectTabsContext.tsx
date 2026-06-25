'use client';

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from 'react';

export interface ConnectTabMeta {
  id: string;
  label: string;
  /**
   * Hero background image shown while this tab is active.
   * Swap any entry below to a real photo in /public/assets/images.
   */
  background: string;
}

/**
 * Single source of truth for Connect tab order, labels, and per-tab hero
 * backgrounds. `ConnectTabs` attaches the panel components by id, and
 * `ConnectHero` reads the active background from here.
 *
 * TODO: replace the placeholder backgrounds below (Lifestyle / Growth) with
 * real photos once available — just point `background` at a file in
 * /public/assets/images.
 */
export const CONNECT_TABS: ConnectTabMeta[] = [
  { id: 'new-life', label: 'New Beginning', background: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/vip_2.jpg' },
  { id: 'connect-group', label: 'Connect Group', background: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/cell_group_2.png' },
  // {
  //   id: 'lifestyle',
  //   label: 'Lifestyle',
  //   background: 'https://placehold.co/1920x1080/1a2744/d4a84b.png?text=Lifestyle',
  // },
  {
    id: 'growth',
    label: 'Growth',
    background: 'https://placehold.co/1920x1080/14213d/d4a84b.png?text=Growth',
  },
];

const DEFAULT_TAB_ID = CONNECT_TABS[0].id;

interface ConnectTabsContextValue {
  activeId: string;
  setActiveId: (id: string) => void;
  /** Background image for the currently active tab. */
  activeBackground: string;
}

const ConnectTabsContext = createContext<ConnectTabsContextValue | null>(null);

export const ConnectTabsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [activeId, setActiveId] = useState<string>(DEFAULT_TAB_ID);

  const value = useMemo<ConnectTabsContextValue>(() => {
    const active = CONNECT_TABS.find((tab) => tab.id === activeId);
    return {
      activeId,
      setActiveId,
      activeBackground: active?.background ?? CONNECT_TABS[0].background,
    };
  }, [activeId]);

  return (
    <ConnectTabsContext.Provider value={value}>
      {children}
    </ConnectTabsContext.Provider>
  );
};

export function useConnectTabs(): ConnectTabsContextValue {
  const ctx = useContext(ConnectTabsContext);
  if (!ctx) {
    throw new Error('useConnectTabs must be used within a ConnectTabsProvider');
  }
  return ctx;
}
