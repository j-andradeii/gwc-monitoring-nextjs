# TanStack Query Migration Plan
## GWC Monitoring Next.js — Full Migration from Pub/Sub Event Pattern

> **Project:** GWC Monitoring Next.js
> **Stack:** Next.js 16.0.10 · React 19 · Zustand 5 · React Hook Form 7 · Zod 4
> **Target:** @tanstack/react-query v5
> **Estimated Effort:** 6–7 working days
> **Date:** March 2026

---

## Migration Status Tracker

| Phase | Description | Status | Days |
|-------|-------------|--------|------|
| 1 | Foundation Setup | ✅ DONE | Day 1 |
| 2 | Public Forms Migration | ✅ DONE | Days 2–3 |
| 3 | Data Query & Mutation Hooks | ✅ DONE | Days 4–5 |
| 4 | Auth Service (keep) | ✅ DONE | Day 5 |
| 5 | Cleanup | ✅ DONE | Days 6–7 |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture: Before → After](#2-architecture-before--after)
3. [Phase 1 — Foundation Setup](#3-phase-1--foundation-setup-day-1)
4. [Phase 2 — Public Forms Migration](#4-phase-2--public-forms-migration-days-23)
5. [Phase 3 — Data Query & Mutation Hooks](#5-phase-3--data-query--mutation-hooks-days-45)
6. [Phase 4 — Auth Service (Keep Existing)](#6-phase-4--auth-service-keep-existing)
7. [Phase 5 — Cleanup](#7-phase-5--cleanup-days-67)
8. [File-by-File Checklist](#8-file-by-file-checklist)
9. [Pattern Reference Table](#9-pattern-reference-table)
10. [Rollback Plan](#10-rollback-plan)

---

## 1. Executive Summary

### Why Migrate

The current architecture implements a custom pub/sub event system using Zustand (`useApiEventStore`) to communicate API state between services and components. While functional, it has significant drawbacks:

- **High boilerplate:** Every service function requires 3 manual `sendEvent()` calls (IN_PROGRESS → COMPLETED/ERROR)
- **No caching:** Every navigation triggers fresh network requests
- **Event collision risk:** Global bus with no scoping — multiple components subscribing to the same event type interfere with each other
- **No request deduplication:** If two components call `getMembers()` simultaneously, two network requests fire
- **Complex component wiring:** Each component needs `useEffect` + `subscribe` + `createEventStatusHandleMap` just to track `isSubmitting`

### Key Benefits After Migration

- ✅ Eliminate ~60% of service + component boilerplate
- ✅ Automatic caching (stale-while-revalidate) — pages feel instant
- ✅ `isPending`, `isSuccess`, `isError` built-in — no `useState` for loading/submitted
- ✅ Automatic cache invalidation — delete member → list refetches automatically
- ✅ `apiClient.ts` unchanged — keeps encryption, JWT refresh, httpOnly cookie auth
- ✅ React Query Devtools for debugging

### Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Breaking existing components | Migrate one component at a time; test before moving on |
| Auth token refresh interference | Keep `auth.service.ts` as-is (Phase 4) |
| PrimeReact toast integration | Use `onSuccess`/`onError` callbacks with existing toast setup |

---

## 2. Architecture: Before → After

### BEFORE (Current)

```
┌─────────────────────────────────────────────────────────┐
│  Component (e.g. VipFormClient)                         │
│  • useState(isSubmitting)                               │
│  • useState(submitted)                                  │
│  • useEffect + apiEventStore.subscribe()               │
│  • createEventStatusHandleMap()                        │
└────────────────────────┬────────────────────────────────┘
                         │ calls
┌────────────────────────▼────────────────────────────────┐
│  Service (e.g. inquiry.service.ts)                      │
│  • sendEvent(IN_PROGRESS)                              │
│  • apiClient.post('/api/inquiry/vip', data)            │
│  • sendEvent(COMPLETED) or sendEvent(ERROR)            │
└────────────────────────┬────────────────────────────────┘
                         │ publishes to
┌────────────────────────▼────────────────────────────────┐
│  useApiEventStore (Zustand global event bus)            │
│  • currentEvent state                                   │
│  • subscribers[] array                                  │
│  • notifies ALL subscribers on every event             │
└────────────────────────┬────────────────────────────────┘
                         │ notifies back
                Component's useEffect callback
```

### AFTER (TanStack Query)

```
┌─────────────────────────────────────────────────────────┐
│  Component (e.g. VipFormClient)                         │
│  • const { mutate, isPending, isSuccess } = useMutation │
│  • No useState for loading/submitted                    │
│  • No useEffect subscription                            │
└────────────────────────┬────────────────────────────────┘
                         │ calls mutate()
┌────────────────────────▼────────────────────────────────┐
│  TanStack Query (QueryClient)                           │
│  • Calls mutationFn (apiClient.post)                   │
│  • Updates isPending/isSuccess/isError automatically   │
│  • Calls onSuccess/onError callbacks                   │
│  • Runs cache invalidation (invalidateQueries)         │
└────────────────────────┬────────────────────────────────┘
                         │ uses
┌────────────────────────▼────────────────────────────────┐
│  apiClient.ts (UNCHANGED)                               │
│  • Encrypted headers, JWT refresh, httpOnly cookies    │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Phase 1 — Foundation Setup (Day 1)

### Step 1.1 — Install Dependencies

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

### Step 1.2 — Create Query Client Singleton

**Create:** `src/lib/query-client.ts`

```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,       // 1 minute before refetch
      gcTime: 5 * 60_000,      // 5 minutes in cache
      retry: 1,                // retry once on failure
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,                // no retry on mutations
    },
  },
});
```

### Step 1.3 — Create Query Keys Factory

**Create:** `src/lib/query-keys.ts`

```typescript
/**
 * Centralized query key factory
 * Type-safe, composable query keys for TanStack Query
 */

export const QUERY_KEYS = {
  // Members
  members: (params?: Record<string, unknown>) =>
    params ? ['members', params] : ['members'],
  member: (id: string) => ['members', id],

  // Churches
  churches: () => ['churches'],
  church: (id: string) => ['churches', id],

  // Church Campus
  churchCampus: (id: string) => ['church-campus', id],
  churchCampusStaffs: (id: string) => ['church-campus', id, 'staffs'],

  // Campaigns
  campaigns: () => ['campaigns'],
  campaign: (id: string) => ['campaigns', id],

  // Auth
  self: () => ['self'],
} as const;
```

### Step 1.4 — Update Root Layout

**Modify:** `src/app/layout.tsx`

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './globals.css';

import { siteMetadata } from '@/data/site-metadata';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/query-client';

const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  // ... existing metadata unchanged
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

> **Note:** `QueryClientProvider` requires `'use client'` in Next.js App Router. Extract it to a separate wrapper component if needed:

**Create:** `src/components/providers/QueryProvider.tsx`

```typescript
'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/query-client';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

Then in `layout.tsx`:
```typescript
import { QueryProvider } from '@/components/providers/QueryProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
```

---

## 4. Phase 2 — Public Forms Migration (Days 2–3)

These are the lowest-risk migrations — form submissions with no data reading or cache invalidation needed.

### 4.1 ContactSection.tsx

**File:** `src/components/landing/ContactSection.tsx`

**BEFORE (current — ~50 lines of wiring):**
```typescript
const apiEventStore = useApiEventStore();
const [submitted, setSubmitted] = useState(false);

useEffect(() => {
  const unsubscribe = apiEventStore.subscribe((event) => {
    if (!event) return;
    const eventStatusHandleMap = createEventStatusHandleMap(event);
    eventStatusHandleMap[event.status]?.();
  });
  return () => unsubscribe();
}, []);

function createEventStatusHandleMap(apiEvent) {
  return {
    [ApiEventStatus.COMPLETED]: () => {
      if (apiEvent.type === ApiEventType.SUBMIT_QUERY) {
        reset();
        setSubmitted(true);
      }
    },
    // ...
  };
}

const onSubmit = async (data: SimpleContactFormData) => {
  await inquiryService.submitQuery(data);
};
```

**AFTER (useMutation):**
```typescript
'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';
// Remove: import * as inquiryService from "@/services/inquiry.service";
// Remove: import { ApiEvent, ApiEventStatus, ApiEventType, useApiEventStore } from '@/stores';

export const ContactSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const methods = useForm<SimpleContactFormData>({
    resolver: zodResolver(simpleContactSchema),
    mode: 'onChange',
    defaultValues: { name: '', email: '', message: '' },
  });

  const { handleSubmit, reset } = methods;

  // Replaces: useEffect + subscribe + createEventStatusHandleMap + inquiryService.submitQuery
  const submitQuery = useMutation({
    mutationFn: (data: SimpleContactFormData) =>
      apiClient.post('/api/inquiry', data),
    onSuccess: () => {
      reset();
      setSubmitted(true);
    },
    // onError: (error) => { /* show toast */ }
  });

  const onSubmit = (data: SimpleContactFormData) => {
    submitQuery.mutate(data);
  };

  // submitQuery.isPending replaces isSubmitting from react-hook-form
  // submitted state still needed (to show success UI)
};
```

**Eliminated:** `useApiEventStore`, `useEffect` subscription, `createEventStatusHandleMap`, `inquiryService` import, `ApiEventType`/`ApiEventStatus` imports.

---

### 4.2 ConnectFab.tsx

**File:** `src/components/landing/ConnectFab.tsx`

**AFTER:**
```typescript
'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';

export function ConnectFab() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'prayer' | 'join'>('prayer');
  // Remove: useState(isSubmitting) — use mutation.isPending instead

  const methods = useForm<ContactFormData>({ resolver: zodResolver(contactSchema), mode: 'onChange' });
  const { handleSubmit, reset } = methods;

  const submitPrayerRequest = useMutation({
    mutationFn: (data: ContactFormData) =>
      apiClient.post('/api/inquiry/prayer-requests', data),
    onSuccess: () => { setSubmitted(true); reset(); },
  });

  const submitCellGroupJoin = useMutation({
    mutationFn: (data: ContactFormData) =>
      apiClient.post('/api/inquiry/cell-groups', data),
    onSuccess: () => { setSubmitted(true); reset(); },
  });

  const onSubmit = (data: ContactFormData) => {
    if (activeTab === 'prayer') {
      submitPrayerRequest.mutate(data);
    } else {
      submitCellGroupJoin.mutate(data);
    }
  };

  // Combined isPending
  const isSubmitting = submitPrayerRequest.isPending || submitCellGroupJoin.isPending;

  // Remove: entire useEffect subscription + getApiEvents + createEventStatusHandleMap
}
```

---

### 4.3 VipFormClient.tsx

**File:** `src/app/(public)/events/vip-form/VipFormClient.tsx`

**BEFORE (current):**
```typescript
const [isSubmitting, setIsSubmitting] = useState(false);
const [submitted, setSubmitted] = useState(false);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const unsubscribe = apiEventStore.subscribe((event) => {
    if (event?.type === ApiEventType.SUBMIT_VIP_FORM) {
      if (event.status === ApiEventStatus.COMPLETED) {
        setIsSubmitting(false); setSubmitted(true); reset();
      } else if (event.status === ApiEventStatus.ERROR) {
        setIsSubmitting(false); setError('Something went wrong.');
      }
    }
  });
  return () => unsubscribe();
}, []);

const onSubmit = async (data: VipFormData) => {
  setIsSubmitting(true);
  setError(null);
  setVipName(`${data.firstName} ${data.familyName}`);
  await inquiryService.submitVipForm(data);
};
```

**AFTER:**
```typescript
'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';

export default function VipFormClient() {
  const [vipName, setVipName] = useState<string | null>(null);
  // Remove: useState(isSubmitting), useState(submitted), useState(error)

  const methods = useForm<VipFormData>({ resolver: zodResolver(vipFormSchema), mode: 'onChange' });
  const { handleSubmit, reset } = methods;

  const submitVipForm = useMutation({
    mutationFn: (data: VipFormData) =>
      apiClient.post('/api/inquiry/vip', data),
    onSuccess: () => {
      reset();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    onError: () => {
      // error message available as submitVipForm.error
    },
  });

  const onSubmit = (data: VipFormData) => {
    setVipName(`${data.firstName} ${data.familyName}`);
    submitVipForm.mutate(data);
  };

  // submitVipForm.isPending    replaces isSubmitting
  // submitVipForm.isSuccess    replaces submitted
  // submitVipForm.isError      replaces error !== null
  // submitVipForm.error        replaces error string

  return (
    <div>
      {submitVipForm.isSuccess ? (
        <div className="success-animation-container">
          <h3>Thank You!</h3>
          <p>Welcome <strong>{vipName}</strong>. We are so excited...</p>
          <button onClick={() => submitVipForm.reset()}>Submit Another VIP</button>
        </div>
      ) : (
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {submitVipForm.isError && (
              <div className="form-error-alert">Something went wrong. Please try again.</div>
            )}
            {/* ...form fields... */}
            <button disabled={submitVipForm.isPending}>
              {submitVipForm.isPending ? <i className="pi pi-spin pi-spinner" /> : 'Complete Registration'}
            </button>
          </form>
        </FormProvider>
      )}
    </div>
  );
}
```

---

### 4.4 JoinEventModal.tsx

**File:** `src/components/landing/JoinEventModal.tsx`

**AFTER:**
```typescript
'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';

export function JoinEventModal({ isOpen, onClose, eventSlug, eventTitle }: Props) {
  // Remove: useState(submitted), useState(isSubmitting), useState(error)
  // Remove: useApiEventStore, useEffect subscription, createEventStatusHandleMap

  const methods = useForm<EventContactFormData>({
    resolver: zodResolver(eventContactSchema),
    mode: 'onChange',
  });
  const { handleSubmit, reset } = methods;

  const submitEventInquiry = useMutation({
    mutationFn: (data: EventContactFormData) =>
      apiClient.post(`/api/event/${eventSlug}`, data),
    onSuccess: () => {
      reset();
      // submitEventInquiry.isSuccess drives the success UI
    },
  });

  const onSubmit = (data: EventContactFormData) => {
    submitEventInquiry.mutate(data);
  };

  if (!isOpen) return null;

  return (
    <div className="connect-modal-overlay open">
      {submitEventInquiry.isSuccess ? (
        <div className="contact-success-state">
          <h3>Registration Sent!</h3>
          <button onClick={onClose}>Close</button>
        </div>
      ) : (
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormInput name="name" label="Full Name" showRequired inputClassName="connect-input" />
            <FormInput name="email" label="Email Address" showRequired inputClassName="connect-input" />
            <FormInput name="phone" label="Phone Number" showRequired inputClassName="connect-input" />
            <button type="submit" disabled={submitEventInquiry.isPending}>
              {submitEventInquiry.isPending
                ? <i className="pi pi-spin pi-spinner" />
                : 'JOIN EVENT'}
            </button>
          </form>
        </FormProvider>
      )}
    </div>
  );
}
```

---

## 5. Phase 3 — Data Query & Mutation Hooks (Days 4–5)

### 5.1 Query Hooks (GET requests)

**Create directory:** `src/hooks/queries/`

#### `src/hooks/queries/useMembers.ts`
```typescript
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';
import { QUERY_KEYS } from '@/lib/query-keys';
import type { MemberListResponseDto, MemberPaginationParams } from '@/models/member.types';

export const useMembers = (params: MemberPaginationParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.members(params as Record<string, unknown>),
    queryFn: () => {
      const query = new URLSearchParams(
        Object.fromEntries(
          Object.entries(params).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])
        )
      ).toString();
      return apiClient.get<MemberListResponseDto>(`members?${query}`);
    },
    enabled: true,
  });
};
```

#### `src/hooks/queries/useMember.ts`
```typescript
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';
import { QUERY_KEYS } from '@/lib/query-keys';
import type { MemberResponseDto } from '@/models/member.types';

export const useMember = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.member(id),
    queryFn: () => apiClient.get<MemberResponseDto>(`members/${id}`),
    enabled: !!id,
  });
};
```

#### `src/hooks/queries/useChurches.ts`
```typescript
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';
import { QUERY_KEYS } from '@/lib/query-keys';
import type { ChurchListResponseDto } from '@/models/church.types';

export const useChurches = () => {
  return useQuery({
    queryKey: QUERY_KEYS.churches(),
    queryFn: () => apiClient.get<ChurchListResponseDto>('churches'),
  });
};
```

#### `src/hooks/queries/useChurchCampus.ts`
```typescript
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';
import { QUERY_KEYS } from '@/lib/query-keys';
import type { ChurchCampusResponseDto, ChurchCampusStaffListResponseDto } from '@/models/church.types';

export const useChurchCampus = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.churchCampus(id),
    queryFn: () => apiClient.get<ChurchCampusResponseDto>(`church-campuses/${id}`),
    enabled: !!id,
  });
};

export const useChurchCampusStaffs = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.churchCampusStaffs(id),
    queryFn: () => apiClient.get<ChurchCampusStaffListResponseDto>(`church-campuses/${id}/staffs`),
    enabled: !!id,
  });
};
```

---

### 5.2 Mutation Hooks (POST/PATCH/DELETE)

**Create directory:** `src/hooks/mutations/`

#### `src/hooks/mutations/useCreateMember.ts`
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';
import { QUERY_KEYS } from '@/lib/query-keys';
import type { MemberCreationDto, MemberResponseDto } from '@/models/member.types';

export const useCreateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MemberCreationDto) =>
      apiClient.post<MemberResponseDto>('members', data),
    onSuccess: () => {
      // Invalidate member list — triggers automatic refetch in any useMembers() consumer
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.members() });
    },
  });
};

export const useCreateCellMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MemberCreationDto) =>
      apiClient.post<MemberResponseDto>('members/cell-member', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.members() });
    },
  });
};
```

#### `src/hooks/mutations/useUpdateMember.ts`
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';
import { QUERY_KEYS } from '@/lib/query-keys';
import type { MemberCreationDto, MemberResponseDto } from '@/models/member.types';

export const useUpdateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MemberCreationDto> }) =>
      apiClient.patch<MemberResponseDto>(`members/${id}`, data),
    onSuccess: (_, variables) => {
      // Invalidate both the list and the specific member cache
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.members() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.member(variables.id) });
    },
  });
};
```

#### `src/hooks/mutations/useDeleteMember.ts`
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';
import { QUERY_KEYS } from '@/lib/query-keys';

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`members/${id}`),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.members() });
      // Remove specific member from cache immediately
      queryClient.removeQueries({ queryKey: QUERY_KEYS.member(id) });
    },
  });
};
```

#### `src/hooks/mutations/useUpdateChurchCampus.ts`
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';
import { QUERY_KEYS } from '@/lib/query-keys';
import type { ChurchCampusUpdateDto, ChurchCampusResponseDto } from '@/models/church.types';

export const useUpdateChurchCampus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ChurchCampusUpdateDto }) =>
      apiClient.patch<ChurchCampusResponseDto>(`church-campuses/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.churchCampus(variables.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.churchCampusStaffs(variables.id) });
    },
  });
};
```

### 5.3 Usage in Components

```typescript
// Before — in a members admin page:
const [members, setMembers] = useState([]);
useEffect(() => {
  memberService.getMembers({ page: 1, pageSize: 20 });
  const unsubscribe = apiEventStore.subscribe((event) => {
    if (event.type === ApiEventType.GET_MEMBERS && event.status === ApiEventStatus.COMPLETED) {
      setMembers(result); // result came from where??
    }
  });
  return () => unsubscribe();
}, []);

// After — clean and direct:
const { data: members, isPending, isError } = useMembers({ page: 1, pageSize: 20 });
const { mutate: deleteMember } = useDeleteMember();
// When deleteMember(id) succeeds → queryClient auto-refetches members list
```

---

## 6. Phase 4 — Auth Service (Keep Existing)

### Why Auth Stays As-Is

`auth.service.ts` should **NOT** be migrated to TanStack Query for these reasons:

1. **Password encryption side effect:** `authenticate()` runs `await encrypt(credentials.password)` before the API call — this async side effect doesn't fit `queryFn`
2. **Multi-step flow:** `authenticate()` calls `getSelf()` internally after success
3. **User store updates:** `getSelf()` updates `useUserStore` with the logged-in user — this is app state, not server cache
4. **Redirect logic:** `logout()` calls `window.location.href = '/signin'` — mutation callbacks can handle this but adds no benefit
5. **httpOnly cookie management:** Auth state is managed by the backend via cookies, not by TanStack Query cache

**Acceptable minor cleanups for auth.service.ts:**
- Remove `sendEvent(IN_PROGRESS)` / `sendEvent(COMPLETED)` if no component subscribes to auth events anymore (check after Phase 2-3)
- Keep `useUserStore` updates
- Keep redirect logic in `logout()`

---

## 7. Phase 5 — Cleanup (Days 6–7)

### Step 7.1 — Delete event.store.ts

```bash
# Only after ALL components have been migrated off the event store
rm src/stores/event.store.ts
rm src/hooks/useApiEvent.ts
```

Verify no remaining imports:
```bash
grep -r "useApiEventStore\|ApiEventType\|ApiEventStatus\|useApiEvent" src/ --include="*.ts" --include="*.tsx"
```

### Step 7.2 — Simplify loading.store.ts

Replace the request counter with TanStack's `useIsFetching`:

```typescript
// Before — in components:
import { useLoadingStore } from '@/stores/loading.store';
const { isLoading } = useLoadingStore();

// After — no store needed:
import { useIsFetching } from '@tanstack/react-query';
const isFetching = useIsFetching(); // > 0 means loading
```

> **Decision:** If `useLoadingStore` is only used for global loading indicators, delete it. If it has other uses (non-API loading states), keep it but remove the `incrementRequests`/`decrementRequests` logic from `api-client.ts`.

**Modify `api-client.ts` (remove loading store calls):**
```typescript
// Remove these lines:
import { useLoadingStore } from '@/stores/loading.store';
const { incrementRequests, decrementRequests } = useLoadingStore.getState();

// Remove from makeRequest:
incrementRequests();
decrementRequests();
```

### Step 7.3 — Update stores/index.ts

```typescript
// src/stores/index.ts
// Before:
export * from './user.store';
export * from './event.store';    // DELETE THIS LINE
export * from './loading.store';  // REMOVE or keep if still used
export * from './breadcrumbs.store';
export * from './sidebar.store';

// After:
export * from './user.store';
export * from './breadcrumbs.store';
export * from './sidebar.store';
// loading.store optional — remove if replaced by useIsFetching
```

### Step 7.4 — Clean up Service Files

Once components no longer call `inquiryService.*`, you can either:

**Option A:** Delete `src/services/inquiry.service.ts` entirely (since mutations now call apiClient directly in hooks)

**Option B:** Simplify to thin wrappers without event dispatch:
```typescript
// src/services/inquiry.service.ts — simplified
import { apiClient } from './api-client';

export const submitQuery = (data: unknown) =>
  apiClient.post('/api/inquiry', data);

export const submitPrayerRequest = (data: unknown) =>
  apiClient.post('/api/inquiry/prayer-requests', data);

export const submitVipForm = (data: unknown) =>
  apiClient.post('/api/inquiry/vip', data);

// etc.
```

Similarly simplify `member.service.ts`, `church.service.ts`, `church-campus.service.ts` to remove all `sendEvent()` calls.

### Step 7.5 — Remove sendEvent from auth.service.ts

After verifying no component subscribes to AUTHENTICATION or GET_AUTHENTICATED_SELF events:

```typescript
// auth.service.ts — remove event dispatch but keep core logic
export const authenticate = async (credentials: LoginCredentials): Promise<boolean> => {
  try {
    const encryptedPassword = await encrypt(credentials.password.trim());
    const response = await apiClient.post<AuthenticatedTokenResponse>('auth', {
      email: credentials.email.trim(),
      password: encryptedPassword,
    });
    if (response.data) {
      await getSelf(false);
      return true;
    }
    return false;
  } catch (error) {
    // Handle error in the calling component
    return false;
  }
};
```

---

## 8. File-by-File Checklist

### Phase 1 — Foundation
- [x] Run: `npm install @tanstack/react-query @tanstack/react-query-devtools`
- [x] Create: `src/lib/query-client.ts`
- [x] Create: `src/lib/query-keys.ts`
- [x] Create: `src/components/providers/QueryProvider.tsx`
- [x] Modify: `src/app/layout.tsx` — wrap with `<QueryProvider>`
- [x] Test: app loads without errors, ReactQueryDevtools panel visible

### Phase 2 — Public Forms
- [x] Migrate: `src/components/landing/ContactSection.tsx`
- [x] Migrate: `src/components/landing/ConnectFab.tsx`
- [x] Migrate: `src/app/(public)/events/vip-form/VipFormClient.tsx`
- [x] Migrate: `src/components/landing/JoinEventModal.tsx`
- [x] Migrate: `src/components/landing/EventContactSection.tsx`
- [x] Migrate: `src/components/landing/give/GatewayPledgeSection.tsx`
- [x] Test: all form submissions work, success/error states show correctly

### Phase 3 — Query & Mutation Hooks
- [x] Create dir: `src/hooks/queries/`
- [x] Create: `src/hooks/queries/useMembers.ts`
- [x] Create: `src/hooks/queries/useMember.ts`
- [x] Create: `src/hooks/queries/useChurches.ts`
- [x] Create: `src/hooks/queries/useChurchCampus.ts` (includes useChurchCampusStaffs)
- [x] Create dir: `src/hooks/mutations/`
- [x] Create: `src/hooks/mutations/useCreateMember.ts` (includes useCreateCellMember)
- [x] Create: `src/hooks/mutations/useUpdateMember.ts`
- [x] Create: `src/hooks/mutations/useDeleteMember.ts`
- [x] Create: `src/hooks/mutations/useUpdateChurchCampus.ts`
- [x] Create: `src/hooks/queries/index.ts` + `src/hooks/mutations/index.ts` (barrel exports)
- [ ] Migrate: all admin pages to use new query/mutation hooks
- [x] Test: build passes with all hooks

### Phase 4 — Auth
- [x] Review: `src/services/auth.service.ts` — kept core logic
- [x] Remove sendEvent calls from auth.service.ts
- [x] Remove unused `showToast` parameter from `getSelf()`
- [x] Update callers: `AuthGuard.tsx`, `useAuth.ts`

### Phase 5 — Cleanup
- [x] Verify: `grep -r "useApiEventStore" src/` returns 0 results
- [x] Delete: `src/stores/event.store.ts`
- [x] Delete: `src/hooks/useApiEvent.ts`
- [x] Modify: `src/stores/index.ts` — removed event.store export
- [x] Modify: `src/hooks/index.ts` — removed useApiEvent export
- [x] Decide: KEEP `src/stores/loading.store.ts` (used by AdminLayout + AuthGuard)
- [x] Keep: `src/services/api-client.ts` loading store calls (AdminLayout depends on isLoading)
- [x] Simplify: `src/services/inquiry.service.ts` (thin wrappers, no sendEvent)
- [x] Simplify: `src/services/member.service.ts` (thin wrappers, no sendEvent)
- [x] Simplify: `src/services/church.service.ts` (thin wrappers, no sendEvent)
- [x] Simplify: `src/services/church-campus.service.ts` (thin wrappers, no sendEvent)
- [x] Clean: `src/components/ui/Toast.tsx` — removed event store subscription
- [x] Final: `grep -r "ApiEventType\|ApiEventStatus\|sendEvent\|useApiEvent" src/` returns 0

---

## 9. Pattern Reference Table

| Current Pattern | TanStack Query Equivalent |
|----------------|--------------------------|
| `sendEvent({ status: IN_PROGRESS })` | `mutation.isPending` or `query.isPending` |
| `sendEvent({ status: COMPLETED })` | `mutation.isSuccess` / `query.isSuccess` |
| `sendEvent({ status: ERROR })` | `mutation.isError` / `query.isError` |
| `sendEvent({ toast: true, message })` | `onSuccess: () => toast.show(...)` in mutation |
| `useState(isSubmitting)` | `mutation.isPending` |
| `useState(submitted)` | `mutation.isSuccess` |
| `useState(error)` | `mutation.error` |
| `useEffect + subscribe + createEventStatusHandleMap` | Eliminated — use hook states directly |
| `ApiEventType.GET_MEMBERS` | `queryKey: QUERY_KEYS.members(params)` |
| `ApiEventType.CREATE_MEMBER` | `useMutation({ mutationFn: ... })` |
| `useApiEventStore.subscribe()` | Multiple components call same `useQuery` — cache syncs them |
| `useEventLoading(ApiEventType.GET_MEMBERS)` | `const { isPending } = useMembers(params)` |
| `useLoadingStore().isLoading` | `useIsFetching() > 0` |
| Manual refetch after mutation | `queryClient.invalidateQueries({ queryKey: [...] })` |
| No cache | `staleTime: 60_000` — data served from cache for 1 min |
| No deduplication | Automatic — same queryKey = 1 request regardless of subscribers |

---

## 10. Rollback Plan

If the migration causes critical issues, reverting is safe and non-destructive.

### Rollback Steps

1. **Phase 2 rollback (form components):** Revert individual component files using `git checkout src/components/landing/ContactSection.tsx`. Each component is migrated independently, so rollback is per-file.

2. **Phase 3 rollback (query hooks):** Delete the `src/hooks/queries/` and `src/hooks/mutations/` directories. The original service functions still exist until Phase 5.

3. **Phase 1 rollback (QueryClientProvider):** Revert `src/app/layout.tsx`. The `@tanstack/react-query` package can be uninstalled: `npm uninstall @tanstack/react-query @tanstack/react-query-devtools`

4. **Phase 5 rollback:** This phase is irreversible (files deleted). **Use git** — commit before each phase so you have restore points.

### Git Checkpoints (Recommended)

```bash
# Before starting
git commit -am "chore: before TanStack Query migration"

# After Phase 1
git commit -am "feat: add TanStack Query foundation (QueryClientProvider)"

# After Phase 2
git commit -am "feat: migrate public forms to useMutation"

# After Phase 3
git commit -am "feat: add query/mutation hooks for CRUD operations"

# After Phase 5
git commit -am "chore: remove event store and useApiEvent hooks"
```

### Emergency Revert

```bash
# Revert to before migration started
git revert HEAD~N  # N = number of commits to undo
# or
git reset --hard <commit-hash-before-migration>
```

---

## Appendix: Quick Start for a New Component

Once the migration is complete, this is the pattern for all new components:

```typescript
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';
import { QUERY_KEYS } from '@/lib/query-keys';

// READ DATA
const { data: members, isPending, isError } = useQuery({
  queryKey: QUERY_KEYS.members({ page: 1, pageSize: 20 }),
  queryFn: () => apiClient.get('members?page=1&pageSize=20'),
});

// MUTATE DATA
const queryClient = useQueryClient();
const createMember = useMutation({
  mutationFn: (data: MemberCreationDto) => apiClient.post('members', data),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.members() }),
});

// USE IN JSX
if (isPending) return <Spinner />;
if (isError) return <ErrorMessage />;

return (
  <div>
    {members?.data.map(m => <MemberCard key={m.id} member={m} />)}
    <button onClick={() => createMember.mutate(formData)} disabled={createMember.isPending}>
      {createMember.isPending ? 'Saving...' : 'Add Member'}
    </button>
  </div>
);
```

---

*Migration plan generated for GWC Monitoring Next.js — March 2026*
