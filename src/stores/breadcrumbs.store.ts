/**
 * Breadcrumbs Store
 *
 * Manages navigation breadcrumb state
 */

import { create } from 'zustand';

export interface BreadcrumbItem {
  label: string;
  url?: string;
  icon?: string;
}

interface BreadcrumbsState {
  items: BreadcrumbItem[];
  home: BreadcrumbItem;
}

interface BreadcrumbsActions {
  setItems: (items: BreadcrumbItem[]) => void;
  addItem: (item: BreadcrumbItem) => void;
  removeLastItem: () => void;
  clearItems: () => void;
  setHome: (home: BreadcrumbItem) => void;
}

type BreadcrumbsStore = BreadcrumbsState & BreadcrumbsActions;

const defaultHome: BreadcrumbItem = {
  label: 'Home',
  url: '/church-campus-admin/dashboard',
  icon: 'pi pi-home',
};

export const useBreadcrumbsStore = create<BreadcrumbsStore>((set) => ({
  items: [],
  home: defaultHome,

  setItems: (items) => set({ items }),

  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),

  removeLastItem: () =>
    set((state) => ({
      items: state.items.slice(0, -1),
    })),

  clearItems: () => set({ items: [] }),

  setHome: (home) => set({ home }),
}));

// Selectors
export const selectBreadcrumbItems = (state: BreadcrumbsStore) => state.items;
export const selectBreadcrumbHome = (state: BreadcrumbsStore) => state.home;
