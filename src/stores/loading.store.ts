/**
 * Loading Store
 *
 * Tracks active HTTP requests for global loading state
 */

import { create } from 'zustand';

interface LoadingState {
  activeRequests: number;
  isLoading: boolean;
}

interface LoadingActions {
  incrementRequests: () => void;
  decrementRequests: () => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

type LoadingStore = LoadingState & LoadingActions;

export const useLoadingStore = create<LoadingStore>((set) => ({
  activeRequests: 0,
  isLoading: false,

  incrementRequests: () =>
    set((state) => ({
      activeRequests: state.activeRequests + 1,
      isLoading: true,
    })),

  decrementRequests: () =>
    set((state) => {
      const newCount = Math.max(0, state.activeRequests - 1);
      return {
        activeRequests: newCount,
        isLoading: newCount > 0,
      };
    }),

  setLoading: (loading) =>
    set({ isLoading: loading }),

  reset: () =>
    set({
      activeRequests: 0,
      isLoading: false,
    }),
}));

// Selectors
export const selectLoadingIsLoading = (state: LoadingStore) => state.isLoading;
export const selectActiveRequests = (state: LoadingStore) => state.activeRequests;
