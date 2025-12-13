/**
 * Sidebar Store
 *
 * Manages sidebar visibility and collapsed state
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SidebarState {
  isOpen: boolean;
  isCollapsed: boolean;
  isMobileOpen: boolean;
  expandedItems: string[];
}

interface SidebarActions {
  setIsOpen: (isOpen: boolean) => void;
  setIsCollapsed: (isCollapsed: boolean) => void;
  setIsMobileOpen: (isMobileOpen: boolean) => void;
  toggle: () => void;
  toggleCollapse: () => void;
  toggleMobile: () => void;
  closeMobile: () => void;
  close: () => void;
  toggleExpand: (item: string) => void;
}

type SidebarStore = SidebarState & SidebarActions;

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      isOpen: true,
      isCollapsed: false,
      isMobileOpen: false,
      expandedItems: [],

      setIsOpen: (isOpen) => set({ isOpen }),

      setIsCollapsed: (isCollapsed) => set({ isCollapsed }),

      setIsMobileOpen: (isMobileOpen) => set({ isMobileOpen }),

      toggle: () => set((state) => ({ isOpen: !state.isOpen })),

      toggleCollapse: () =>
        set((state) => ({ isCollapsed: !state.isCollapsed })),

      toggleMobile: () =>
        set((state) => ({ isMobileOpen: !state.isMobileOpen })),

      closeMobile: () => set({ isMobileOpen: false }),

      close: () => set({ isOpen: false, isMobileOpen: false }),

      toggleExpand: (item) =>
        set((state) => ({
          expandedItems: state.expandedItems.includes(item)
            ? state.expandedItems.filter((i) => i !== item)
            : [...state.expandedItems, item],
        })),
    }),
    {
      name: 'sidebar-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isCollapsed: state.isCollapsed,
      }),
    }
  )
);

// Selectors
export const selectSidebarIsOpen = (state: SidebarStore) => state.isOpen;
export const selectSidebarIsCollapsed = (state: SidebarStore) => state.isCollapsed;
export const selectSidebarIsMobileOpen = (state: SidebarStore) => state.isMobileOpen;
