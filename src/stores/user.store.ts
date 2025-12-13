/**
 * User Store
 *
 * Manages authentication state with localStorage persistence
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
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

interface UserActions {
  setUser: (user: SelfInformationDto, token: string, refreshToken: string) => void;
  setUserInfo: (user: SelfInformationDto) => void;
  setTokens: (token: string, refreshToken: string) => void;
  updateUser: (updates: Partial<SelfInformationDto>) => void;
  clearUser: () => void;
  logout: () => void;
}

type UserStore = UserState & UserActions;

// Initial state
const initialState: UserState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
};

// Store
export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      ...initialState,

      setUser: (user, token, refreshToken) =>
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
        }),

      setUserInfo: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

      setTokens: (token, refreshToken) =>
        set({ token, refreshToken }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      clearUser: () => set(initialState),

      logout: () => {
        // Clear localStorage manually as well
        if (typeof window !== 'undefined') {
          localStorage.removeItem(CONST.ACCESS_TOKEN);
          localStorage.removeItem(CONST.REFRESH_TOKEN);
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
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selectors
export const selectUser = (state: UserStore) => state.user;
export const selectToken = (state: UserStore) => state.token;
export const selectIsAuthenticated = (state: UserStore) => state.isAuthenticated;
export const selectUserRole = (state: UserStore) => state.user?.church_campus_staff?.role;
export const selectMember = (state: UserStore) => state.user?.member;
