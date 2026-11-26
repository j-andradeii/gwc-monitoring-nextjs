---
name: zustand
description: |
  Client state with Zustand 5 in gwc-monitoring-nextjs: the six stores (user, loading, sidebar,
  breadcrumbs, connectFab, platformAdmin), the State / Actions / Store type split, create<Store>()(persist(...)) with
  createJSONStorage + partialize, exported selectors, getState() outside React, and one-shot "command"
  stores for sibling-to-sibling signals. Server data never goes in a store.

  Use when: adding or changing a store or a store action; persisting UI preferences; letting one component
  ask another to open/close something; reading the user or loading state outside React; deciding between a
  store, TanStack Query, URL state or local useState.

  Keywords: zustand, create, persist, createJSONStorage, partialize, localStorage, selector, getState,
  useUserStore, useLoadingStore, useSidebarStore, useBreadcrumbsStore, useConnectFabStore, store, client state
---

# Zustand: client state only

Stores hold **UI and session-profile state**. Anything fetched from an API or a route handler is TanStack Query's
job (`api-client`). Local component state stays in `useState`.

| Store | File | Holds | Persisted (`name` → keys) |
|---|---|---|---|
| `useUserStore` | `stores/user.store.ts` | `/self` profile + `isAuthenticated` | `user-storage` → `user`, `isAuthenticated` |
| `useLoadingStore` | `stores/loading.store.ts` | in-flight request counter, `isLoading` | no |
| `useSidebarStore` | `stores/sidebar.store.ts` | open / collapsed / mobile / expanded items | `sidebar-storage` → `isCollapsed` |
| `useBreadcrumbsStore` | `stores/breadcrumbs.store.ts` | admin breadcrumb items + home | no |
| `useConnectFabStore` | `stores/connectFab.store.ts` | one-shot request to open the Connect FAB on a tab | no |
| `usePlatformAdminStore` | `stores/platform-admin.store.ts` | platform admin portal session flag (spec 006; no server data) | `platform-admin-storage` → `email`, `isAuthenticated` |

## Files in this skill

| File | What | Load when |
|---|---|---|
| `SKILL.md` | Rules, decision guide, recipe, drift, checklist | Always |

## The rules

1. **Server data never goes in a store.** Lists, details, lookups → TanStack Query. The only API-derived value
   in a store is the signed-in profile (`useUserStore`), because guards and the shell need it synchronously.
   *Why:* two caches drift; Query already caches, dedupes and invalidates.
2. **One store per concern, in `src/stores/<name>.store.ts`, exported from `stores/index.ts`.** Name the hook
   `use<Name>Store`. *Why:* the barrel is how components import stores.
3. **Type shape:** `interface <Name>State`, `interface <Name>Actions`, `type <Name>Store = <Name>State &
   <Name>Actions`; an `initialState` const when there's a reset. Small one-purpose stores may use a single
   interface (`connectFab.store.ts`). *Why:* matches the existing stores; reset = `set(initialState)`.
4. **Create with the curried form when using middleware:** `create<Store>()(persist((set) => ({ … }), { name,
   storage: createJSONStorage(() => localStorage), partialize }))`. Plain `create<Store>((set) => …)` when
   nothing is persisted. *Why:* the curried form keeps the generic with middleware in Zustand 5.
5. **Persist only what must survive a reload, and always `partialize`.** Storage `name` is `<thing>-storage`.
   Never persist tokens, request counters, transient UI (mobile open, pending requests). *Why:* stale UI after
   reload, and secrets in `localStorage` (`security`).
6. **Actions are named verbs** (`setX`, `toggleX`, `clearX`, `requestOpen`, `logout`) and use the functional
   `set((state) => …)` form when they read state. Side effects (API calls, navigation) don't live in actions
   — except `user.logout`, which also clears the legacy `AUTHENTICATED_USER` key. *Why:* stores stay
   synchronous and testable; services do I/O.
7. **Export selectors next to the store** (`selectUser`, `selectUserRole`, `selectSidebarIsCollapsed`, …) and
   prefer `useStore(selector)` in new components so they re-render only on that slice. *Why:* destructuring the
   whole store re-renders on every change (the older components do this; don't copy it in hot paths).
8. **Outside React use `useXStore.getState()`** (services, `apiClient`, event handlers). Don't call the hook
   outside a component. *Why:* `apiClient` and `auth.service` already do this.
9. **Sibling-to-sibling signals use a one-shot command store**: the requester calls `requestOpen(tab)`, the
   owner reacts in an effect and calls `clearRequest()`. *Why:* no prop drilling or global event bus — the
   deleted `useApiEventStore` bus must not come back.
10. **Persisted stores are read on the client only.** Components that render persisted values start with the
    default on the server; guard with a mounted check if a mismatch shows. *Why:* `localStorage` doesn't exist
    during SSR.

## Decision guide

| State | Put it in | Example |
|---|---|---|
| Data from the API or a route handler | TanStack Query | `useMembers` |
| Signed-in profile, role | `useUserStore` | `AuthGuard`, `Sidebar` |
| Is any request in flight (admin overlay) | `useLoadingStore` | `AdminLayout` |
| UI preference that survives reload | persisted store + `partialize` | `useSidebarStore` (`isCollapsed`) |
| One component asks another to act | one-shot command store | `useConnectFabStore` |
| Form values | React Hook Form | `forms` skill |
| Filter / page shareable by link | URL search params | — |
| Open/closed state inside one component | `useState` | — |

## Recipe: a small persisted store

```ts
/**
 * Theme Store
 *
 * Remembers the visitor's colour-scheme choice
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ThemeState {
  mode: 'light' | 'dark';
}

interface ThemeActions {
  setMode: (mode: ThemeState['mode']) => void;
}

type ThemeStore = ThemeState & ThemeActions;

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      mode: 'light',
      setMode: (mode) => set({ mode }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ mode: state.mode }),
    }
  )
);

// Selectors
export const selectThemeMode = (state: ThemeStore) => state.mode;
```

## Legacy and drift

Don't copy any of these.

- `useUserStore` is persisted **and** `getSelf` writes the same profile to `AUTHENTICATED_USER` → new code reads the store only.
- `setUser` and `setUserInfo` do the same thing → use `setUserInfo` (what `auth.service` calls).
- `user.store.ts` re-declares `SelfInformationDto`, `ChurchCampusStaffDto`, `MemberDto` that also live in `src/models` → import from `@/models` in new code.
- `useLoadingStore.setLoading` (used by `AuthGuard`/`useAuth`) and the request counter both write `isLoading` → don't add more manual `setLoading` callers; `useIsFetching()` / `isPending` is the Query-native signal.
- Breadcrumbs default home `url: '/church-campus-admin/dashboard'` points at a missing page (see `routing`).
- Many components destructure the whole store (`const { user, isAuthenticated } = useUserStore()`) → selectors in new code.
- The deleted pub/sub store (`useApiEventStore`, `ApiEventType`, `sendEvent`) → never reintroduce.

## Checklist before shipping

- [ ] No API/route-handler data added to a store
- [ ] New store in `src/stores/<name>.store.ts`, exported from `stores/index.ts`, `State`/`Actions` typed
- [ ] Persisted stores use `partialize`; nothing secret or transient persisted
- [ ] New components read with selectors; non-React code uses `getState()`
- [ ] `git grep -n "useApiEventStore\|sendEvent\|ApiEventType" -- src` is empty

## Related skills

- [`api-client`](../api-client/SKILL.md): where server state goes
- [`authentication`](../authentication/SKILL.md): `useUserStore`
- [`coding-style`](../coding-style/SKILL.md)
