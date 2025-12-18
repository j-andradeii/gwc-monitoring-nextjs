/**
 * User Store
 *
 * Manages user state with localStorage persistence
 * Note: Tokens are managed via httpOnly cookies (set by backend)
 * Only user data is stored in localStorage for quick hydration
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CONST } from '@/core/constants';

// Types
export interface ChurchCampusStaffDto {
  id: string;
  role: 'STAFF' | 'SENIOR_PASTOR' | 'PASTOR' | 'MEMBER' | 'PRIMARY';
  church_campus?: {
    id: string;
    type: string;
    name?: string;
    church?: {
      id: string;
      name: string;
    };
  };
  member?: MemberDto;
  is_hierarchy_root?: boolean;
}

export interface MemberDto {
  id: string;
  church_id?: string;
  church_campus_id?: string;
  auth_id?: string;
  first_name: string;
  last_name: string;
  email?: string;
  birthdate?: string;
  photo_url?: string;
}

export interface SelfInformationDto {
  church_campus_staff: ChurchCampusStaffDto;
  member: MemberDto;
}

interface UserState {
  user: SelfInformationDto | null;
  isAuthenticated: boolean;
  // Note: tokens are now managed via httpOnly cookies, not stored in state
}

interface UserActions {
  setUser: (user: SelfInformationDto) => void;
  setUserInfo: (user: SelfInformationDto) => void;
  updateUser: (updates: Partial<SelfInformationDto>) => void;
  clearUser: () => void;
  logout: () => void;
}

type UserStore = UserState & UserActions;

// Initial state
const initialState: UserState = {
  user: null,
  isAuthenticated: false,
};

// Store
export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      ...initialState,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

      setUserInfo: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      clearUser: () => set(initialState),

      logout: () => {
        // Clear localStorage (tokens are cleared via backend cookies)
        if (typeof window !== 'undefined') {
          localStorage.removeItem(CONST.AUTHENTICATED_USER);
        }
        set(initialState);
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selectors
export const selectUser = (state: UserStore) => state.user;
export const selectIsAuthenticated = (state: UserStore) => state.isAuthenticated;
export const selectUserRole = (state: UserStore) => state.user?.church_campus_staff?.role;
export const selectMember = (state: UserStore) => state.user?.member;
