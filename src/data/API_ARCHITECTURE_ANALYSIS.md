# API Architecture Analysis
## Current Pub/Sub Pattern vs. TanStack Query (`useMutation` / `useQueryClient`)

> **Project:** GWC Monitoring Next.js
> **Stack:** Next.js 16.0.10 · React 19 · Zustand 5 · React Hook Form 7 · Zod 4
> **Date:** March 2026

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Data Flow — Step by Step](#2-data-flow--step-by-step)
3. [Current Approach: Pros](#3-current-approach-pros)
4. [Current Approach: Cons](#4-current-approach-cons)
5. [What TanStack Query Brings](#5-what-tanstack-query-brings)
6. [TanStack Query: Pros](#6-tanstack-query-pros)
7. [TanStack Query: Cons & Trade-offs](#7-tanstack-query-cons--trade-offs)
8. [Side-by-Side Comparison](#8-side-by-side-comparison)
9. [Migration Strategy (Incremental)](#9-migration-strategy-incremental)
10. [Final Recommendation](#10-final-recommendation)

---

## 1. Architecture Overview

The project implements a custom **3-layer API calling architecture** built around a global Zustand pub/sub event bus.

```
┌─────────────────────────────────────────────────────────────────────┐
│  LAYER 1 — apiClient (src/services/api-client.ts)                  │
│  • Native fetch wrapper                                             │
│  • Encrypted headers (xAccessToken, xAccess)                       │
│  • httpOnly cookie auth (credentials: 'include')                   │
│  • Automatic JWT refresh on 401                                     │
│  • Ties into useLoadingStore for global spinner                     │
└────────────────────────────┬────────────────────────────────────────┘
                             │ used by
┌────────────────────────────▼────────────────────────────────────────┐
│  LAYER 2 — Service Layer (src/services/*.service.ts)               │
│  • Domain-specific async functions (getMembers, createMember, …)   │
│  • Wraps apiClient calls                                            │
│  • Broadcasts events via useApiEventStore.getState().sendEvent()   │
│    → IN_PROGRESS before fetch                                       │
│    → COMPLETED on success                                           │
│    → ERROR on failure                                               │
└────────────────────────────┬────────────────────────────────────────┘
                             │ publishes to
┌────────────────────────────▼────────────────────────────────────────┐
│  LAYER 3 — Event Store + Components                                 │
│  • useApiEventStore (Zustand) acts as global event bus             │
│  • Components subscribe via useEffect + store.subscribe()          │
│  • Components filter events by ApiEventType + ApiEventStatus       │
│  • Local useState manages isSubmitting, submitted, error, etc.     │
└─────────────────────────────────────────────────────────────────────┘
```

### Key Files

| File | Role |
|------|------|
| `src/services/api-client.ts` | Core HTTP wrapper, auth, encryption |
| `src/stores/event.store.ts` | Pub/sub event bus (ApiEventType enum, sendEvent, subscribe) |
| `src/stores/loading.store.ts` | Global loading counter (tracks active requests) |
| `src/stores/user.store.ts` | Persisted user session (Zustand + localStorage) |
| `src/services/member.service.ts` | Example domain service using the pattern |
| `src/services/inquiry.service.ts` | Public inquiry service (forms) |
| `src/components/landing/JoinEventModal.tsx` | Example component consuming the event bus |

---

## 2. Data Flow — Step by Step

### Mutation (POST/PATCH/DELETE)

```
User clicks Submit
       │
       ▼
Component calls service function
  e.g. inquiryService.submitEventInquiry(data, slug)
       │
       ▼
Service calls sendEvent({ type, status: IN_PROGRESS, spinner: true })
  → EventStore updates currentEvent
  → Notifies all subscribers (components with useEffect subscriptions)
       │
       ▼
Service calls apiClient.post(endpoint, data)
  → apiClient increments useLoadingStore.activeRequests
  → Builds encrypted headers, attaches cookies
  → fetch() to server
  → On 401: auto-refreshes token, retries
  → On error: throws ApiError object
  → Decrements useLoadingStore.activeRequests
       │
       ▼
Service receives result
  → SUCCESS: sendEvent({ type, status: COMPLETED, toast: true })
  → ERROR:   sendEvent({ type, status: ERROR, toast: true })
       │
       ▼
EventStore notifies all subscribers
       │
       ▼
Component's useEffect subscription fires
  createEventStatusHandleMap(event) routes to correct handler
  e.g. if COMPLETED + SUBMIT_EVENT_INQUIRY → setSubmitted(true), reset()
```

### Query (GET)

```
Component mounts (useEffect)
       │
       ▼
Calls service.getMembers(params)
       │
       ▼
Service: IN_PROGRESS → apiClient.get() → COMPLETED
       │
       ▼
EventStore notifies subscribers
       │
       ▼
Component receives result via event
  Sets local state: setMembers(result.data)
```

> **Note:** GET responses return data directly from the service function (not via the event payload). The component both awaits the return value AND subscribes to the event — a dual-channel pattern.

---

## 3. Current Approach: Pros

### ✅ Robust HTTP Interceptors
The `apiClient` handles concerns that would otherwise be scattered throughout the app:
- **Encrypted security headers** on every request (xAccessToken, xAccess via scrypt-js)
- **Automatic token refresh**: On 401 with `"Expired JWT Token"`, the client transparently refreshes the token and retries the original request
- **httpOnly cookie auth**: No token stored in JS-accessible memory — more secure than localStorage tokens

```typescript
// api-client.ts — seamless token refresh
if (errorData.message === 'Expired JWT Token') {
  decrementRequests();
  return handleTokenRefresh({ endpoint, options }); // retry transparently
}
```

### ✅ Global Loading State — Zero Effort
Every request automatically increments/decrements `useLoadingStore`. Any component can show a loading indicator without manual wiring:

```typescript
const { isLoading } = useLoadingStore();
// isLoading is true whenever ANY request is in-flight
```

### ✅ Decoupled Architecture
Services are pure TypeScript functions, not tied to React hooks. They can be called from Server Actions, event handlers, or other services. The service layer doesn't care who calls it.

### ✅ Standardized Error Shapes
All errors pass through `handleErrorResponse()`, guaranteeing a consistent `ApiError` interface:
```typescript
interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}
```

### ✅ Typed Event System
The `ApiEventType` enum ensures all event types are centrally registered, making the codebase self-documenting at the cost of maintenance overhead.

---

## 4. Current Approach: Cons

### ❌ Massive Boilerplate Per Service Method
Every single CRUD operation requires 6+ lines just for event management:

```typescript
// member.service.ts — repeated for EVERY method
sendEvent({ type: eventType, status: ApiEventStatus.IN_PROGRESS, spinner: true });
// ... API call ...
sendEvent({ type: eventType, status: ApiEventStatus.COMPLETED, toast: true });
// ... catch ...
sendEvent({ type: eventType, status: ApiEventStatus.ERROR, toast: true });
```

Adding a new entity requires: new `ApiEventType` entries, new service file with this pattern × number of operations, new component wiring.

### ❌ Event Collision / Race Conditions
Because `useApiEventStore` is **global and singular**, multiple components subscribing to the same event type will all receive every event. If two modals are open, both listening to `SUBMIT_EVENT_INQUIRY`, they will both react to the other's event.

```typescript
// Component A and Component B both subscribe — both react to each other's events
useEffect(() => {
  const unsubscribe = apiEventStore.subscribe((event) => {
    if (event.type === ApiEventType.SUBMIT_EVENT_INQUIRY) {
      // This fires for BOTH components!
    }
  });
  return unsubscribe;
}, []);
```

The `targetId` field partially addresses this for entity-specific events, but form submissions have no entity ID.

### ❌ Complex Component Wiring
To toggle a single boolean (`isSubmitting`), components need:

```typescript
// 1. Create a subscribe useEffect with cleanup
// 2. Implement createEventStatusHandleMap()
// 3. Nested switch on status, then on type
// 4. Handle IN_PROGRESS, COMPLETED, ERROR, DEFAULT
```

This is ~20-30 lines of machinery per component just for basic async state.

### ❌ Zero Caching / Deduplication
Every call to `getMembers()` fires a network request, even if the same data was fetched 2 seconds ago. Navigating away and back always triggers a full refetch with no background update. This wastes bandwidth and creates a slower perceived UX.

### ❌ No Optimistic Updates
Deleting a member requires waiting for the API response before the UI updates. There is no built-in mechanism to speculatively update the UI and roll back on error.

### ❌ ApiEventType Enum Drift
The enum in `event.store.ts` must be manually updated every time a new API operation is added. Forgetting to add one causes silent failures (events fire with `type: 0` which matches `DEFAULT`).

### ❌ `inquiry.service.ts` Has Inconsistent Error Handling
Some services swallow errors with a bare `console.log(error)` and no toast notification, while `member.service.ts` sends a toast. Inconsistency will grow as the app scales.

```typescript
// inquiry.service.ts — error handling is silent
} catch (error) {
  console.log(error); // ← no toast, no user feedback
  apiEventStore.sendEvent({ type: eventType, status: ApiEventStatus.ERROR, spinner: false });
}
```

---

## 5. What TanStack Query Brings

TanStack Query (`@tanstack/react-query`) is purpose-built for server state — data that lives on the server and must be kept in sync with the client.

### Core Hooks

| Hook | Purpose |
|------|---------|
| `useQuery` | Fetch + cache data (GET requests) |
| `useMutation` | Send mutations (POST/PATCH/DELETE) with built-in states |
| `useQueryClient` | Invalidate/update query cache after mutations |
| `useInfiniteQuery` | Paginated/infinite scroll fetching |

### What It Handles Automatically

- **Caching**: Data is cached by a `queryKey`. Same key = served from cache.
- **Background refetching**: Stale data is shown instantly; fresh data loads in background.
- **Request deduplication**: If 3 components call the same query simultaneously, only 1 network request fires.
- **Loading/error states**: `{ data, isPending, isError, error }` from the hook — no manual `useState`.
- **Cache invalidation**: After a mutation, call `queryClient.invalidateQueries({ queryKey: ['members'] })` and all `useQuery(['members', ...])` instances refetch automatically.
- **Optimistic updates**: Update the cache before the server responds; roll back on error.
- **Retry logic**: Configurable automatic retry on failure.
- **DevTools**: Visual cache inspector for debugging.

---

## 6. TanStack Query: Pros

### ✅ Eliminates Pub/Sub Boilerplate
Replace the entire `event.store.ts`, `ApiEventType` enum, and `createEventStatusHandleMap` pattern with simple hooks:

```typescript
// BEFORE — service + component subscription pattern (30+ lines)
sendEvent({ type: ApiEventType.CREATE_MEMBER, status: ApiEventStatus.IN_PROGRESS... });
// + useEffect + subscribe + createEventStatusHandleMap in the component

// AFTER — useMutation (5 lines)
const { mutate: createMember, isPending } = useMutation({
  mutationFn: (data: MemberCreationDto) => apiClient.post('members', data),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['members'] }),
});
```

### ✅ Instant Loading/Error States in Components
No `useState(false)` for `isSubmitting`. No `useEffect` subscription. Just destructure from the hook:

```typescript
const { isPending, isError, error } = useMutation({ ... });
```

### ✅ Automatic Cache Invalidation
Delete a member → `queryClient.invalidateQueries(['members'])` → the members list refetches automatically. No manual `loadData()` call, no event listening.

### ✅ Stale-While-Revalidate UX
Navigating to the Members page shows cached data instantly while fresh data loads in the background. Dramatically improves perceived performance.

### ✅ Keeps `apiClient.ts` Intact
TanStack Query works as a layer on top of `apiClient`. The HTTP interceptors, encryption, and token refresh stay untouched:

```typescript
queryFn: () => apiClient.get<MemberListResponseDto>('members')
```

### ✅ DevTools
`@tanstack/react-query-devtools` provides a visual cache explorer — invaluable for debugging stale data, cache misses, and refetch timing.

---

## 7. TanStack Query: Cons & Trade-offs

### ⚠️ Bundle Size
Adds ~13KB (minified + gzipped) to client bundle. Negligible for most apps; worth noting.

### ⚠️ Not Installed
`@tanstack/react-query` is not in `package.json`. Adoption requires installation + `QueryClientProvider` setup in the root layout.

### ⚠️ Paradigm Shift
Developers must shift from the imperative "trigger and listen" pattern (call service → subscribe to events) to declarative hooks (`useQuery`, `useMutation`). This is a ~1-day learning curve.

### ⚠️ SSR/Server Components Consideration
In Next.js App Router, `useQuery`/`useMutation` are client-side hooks. Server Components should use direct async fetches (which the current architecture also doesn't use). This is not a blocker — it aligns with the existing `'use client'` boundaries.

### ⚠️ Global Event Bus Removed
Some cross-component communication currently goes through `useApiEventStore` (e.g., triggering a refetch in a parent from a modal mutation). TanStack Query's cache invalidation replaces this more elegantly, but existing components must be migrated.

---

## 8. Side-by-Side Comparison

| Feature | Current Pub/Sub Pattern | TanStack Query |
|---------|------------------------|----------------|
| **Caching (GET)** | ❌ None — always fetches | ✅ Built-in with configurable stale time |
| **Request deduplication** | ❌ None | ✅ Built-in |
| **Loading state** | 🔶 Manual `useState` + event subscription | ✅ Automatic `isPending` |
| **Error state** | 🔶 Manual via event bus | ✅ Automatic `isError` / `error` |
| **Cache invalidation** | ❌ N/A — manual refetch required | ✅ `queryClient.invalidateQueries()` |
| **Optimistic updates** | ❌ Not supported | ✅ Built-in rollback |
| **Background refetch** | ❌ Not supported | ✅ stale-while-revalidate |
| **Boilerplate per operation** | 🔴 High (events + enum + component map) | 🟢 Low (hook + queryKey) |
| **Event collision risk** | 🔴 High (global bus, no scoping) | 🟢 None (scoped by queryKey) |
| **HTTP interceptors** | ✅ Excellent (apiClient) | ✅ Kept (apiClient as queryFn) |
| **Token refresh** | ✅ Automatic (in apiClient) | ✅ Kept (in apiClient) |
| **Encrypted headers** | ✅ Automatic | ✅ Kept |
| **DevTools** | ❌ None | ✅ React Query Devtools |
| **Bundle size impact** | ~0 (custom) | ~13KB gzipped |
| **TypeScript support** | 🔶 Manual typing | ✅ Excellent inference |
| **Learning curve** | 🟡 Medium (custom pattern) | 🟡 Medium (new paradigm) |

---

## 9. Migration Strategy (Incremental)

Migration does **not** require rewriting the app. Adopt TanStack Query incrementally alongside the existing system.

### Step 1 — Install & Wrap

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

```typescript
// src/app/layout.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000 },  // 1 minute
  },
});

export default function RootLayout({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### Step 2 — Migrate GET Requests First

Create custom query hooks that wrap `apiClient` directly:

```typescript
// src/hooks/queries/useMembers.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';
import type { MemberListResponseDto, MemberPaginationParams } from '@/models/member.types';

export const useMembers = (params: MemberPaginationParams) => {
  return useQuery({
    queryKey: ['members', params],
    queryFn: () => apiClient.get<MemberListResponseDto>(
      `members?page=${params.page}&pageSize=${params.pageSize}`
    ),
  });
};
```

```typescript
// In the component — replaces getMembers() + useEffect subscription
const { data, isPending, isError } = useMembers({ page: 1, pageSize: 20 });
```

### Step 3 — Migrate Mutations

```typescript
// src/hooks/mutations/useCreateMember.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';
import { toast } from '@/core/toast'; // or PrimeReact toast
import type { MemberCreationDto, MemberDto } from '@/models/member.types';

export const useCreateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MemberCreationDto) =>
      apiClient.post<{ data: MemberDto }>('members', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.show({ severity: 'success', detail: 'Member created successfully' });
    },
    onError: (error: { message: string }) => {
      toast.show({ severity: 'error', detail: error.message });
    },
  });
};
```

```typescript
// In the component — replaces isSubmitting useState + event subscription
const { mutate: createMember, isPending } = useCreateMember();

const onSubmit = (data: MemberFormData) => {
  createMember(data);
};

// <button disabled={isPending}>...</button>
```

### Step 4 — Migrate Form Submissions (Inquiry)

```typescript
// src/hooks/mutations/useSubmitEventInquiry.ts
export const useSubmitEventInquiry = (slug: string) => {
  return useMutation({
    mutationFn: (data: EventContactFormData) =>
      apiClient.post(`/api/event/${slug}`, data),
    onSuccess: () => {
      // Component reads isSuccess to show confirmation
    },
  });
};

// Component — replaces JoinEventModal's useEffect + createEventStatusHandleMap
const { mutate, isPending, isSuccess } = useSubmitEventInquiry(eventSlug);
```

### Step 5 — Phase Out Event Store

Once all service calls are replaced by TanStack Query hooks:
1. Delete `src/stores/event.store.ts`
2. Remove `ApiEventType` enum
3. Remove all `createEventStatusHandleMap` functions from components
4. Keep `useLoadingStore` only if global loading bar is still needed (or use TanStack's `useIsFetching`)

### Migration Priority Order

```
High Value / Low Risk:
  1. Public inquiry forms (JoinEventModal, ContactSection, VipFormClient)
  2. Member list + CRUD pages
  3. Campaign list + CRUD pages

Lower Priority:
  4. Auth (special session concerns — keep existing pattern or use Auth.js)
  5. Church campus admin pages
```

---

## 10. Final Recommendation

### Verdict: **Migrate to TanStack Query** ✅

The current architecture is a **hand-rolled reimplementation of server state management** using Zustand as a pub/sub bus. While the `apiClient` layer is excellent and should be kept, the event store pattern introduces significant boilerplate, race condition risks, and lacks core features (caching, deduplication, background refresh) that TanStack Query provides out of the box.

### Key Arguments

| Argument | Weight |
|----------|--------|
| Eliminates ~30% of service/component boilerplate | 🔴 High |
| Fixes event collision bugs in multi-component views | 🔴 High |
| Adds caching (improves UX, reduces server load) | 🟠 Medium |
| Zero impact on `apiClient.ts` (keeps auth, encryption, token refresh) | 🟢 Low risk |
| Incremental adoption possible — no big-bang rewrite | 🟢 Low risk |

### What to Keep

| Keep | Replace |
|------|---------|
| `api-client.ts` entirely | `event.store.ts` (ApiEventType, ApiEventStatus, subscribe) |
| `loading.store.ts` (optional — or use `useIsFetching`) | `createEventStatusHandleMap` in every component |
| `user.store.ts` | Manual `useEffect` subscription pattern |
| `auth.service.ts` (authentication is special) | Manual `isSubmitting` useState for mutations |

### Suggested Timeline

- **Week 1**: Install, setup `QueryClientProvider`, migrate inquiry/public forms (low-risk)
- **Week 2**: Migrate member CRUD, campaign CRUD (replace service functions with hooks)
- **Week 3**: Remove event store, clean up dead code

---

*This analysis was generated based on the GWC Monitoring Next.js codebase as of March 2026.*
