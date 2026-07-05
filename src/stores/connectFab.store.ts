/**
 * ConnectFab command store
 *
 * Lets sibling components (e.g. the homepage CTA slider) request that the
 * ConnectFab modal open on a specific tab, without ConnectFab owning any
 * external API surface. One-shot: consumers must call `clearRequest()`
 * once the request has been handled.
 */
import { create } from 'zustand';

export type ConnectFabTab = 'prayer' | 'join';

interface ConnectFabState {
  /** One-shot request to open the Connect modal on a given tab; null when idle. */
  pendingTab: ConnectFabTab | null;
  requestOpen: (tab: ConnectFabTab) => void;
  clearRequest: () => void;
}

export const useConnectFabStore = create<ConnectFabState>((set) => ({
  pendingTab: null,
  requestOpen: (tab) => set({ pendingTab: tab }),
  clearRequest: () => set({ pendingTab: null }),
}));
