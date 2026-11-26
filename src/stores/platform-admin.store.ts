/**
 * Platform Admin Store
 *
 * The platform admin portal's session flag (who signed in). Kept apart from useUserStore: a platform admin may
 * have no church profile (`/self`), and the church admin must not treat a portal session as its own. The tenant
 * data itself lives in TanStack Query (usePlatformTenants); the JWT stays in the API's httpOnly cookies.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface PlatformAdminState {
  email: string | null;
  isAuthenticated: boolean;
}

interface PlatformAdminActions {
  setSignedIn: (email: string) => void;
  clear: () => void;
}

type PlatformAdminStore = PlatformAdminState & PlatformAdminActions;

const initialState: PlatformAdminState = {
  email: null,
  isAuthenticated: false,
};

export const usePlatformAdminStore = create<PlatformAdminStore>()(
  persist(
    (set) => ({
      ...initialState,
      setSignedIn: (email) => set({ email, isAuthenticated: true }),
      clear: () => set(initialState),
    }),
    {
      name: 'platform-admin-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ email: state.email, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export const selectPlatformAdminEmail = (state: PlatformAdminStore) => state.email;
export const selectPlatformAdminIsAuthenticated = (state: PlatformAdminStore) =>
  state.isAuthenticated;
