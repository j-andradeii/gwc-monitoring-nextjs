---
name: api-client
description: |
  Data fetching in gwc-monitoring-nextjs: the fetch wrapper apiClient (target 'app' for our route handlers,
  'api' for gwc-monitoring-service, encrypted headers, httpOnly cookies, 401 refresh, global loading counter),
  TanStack Query v5 (queryClient defaults, QUERY_KEYS factory, query hooks in hooks/queries, mutation hooks in
  hooks/mutations, inline useMutation for public forms) and cache invalidation.

  Use when: adding or changing a call to the external API or to a route handler in src/app/api; writing a
  useQuery / useMutation hook; adding a query key; invalidating cache; showing loading, error or success
  state from a request; touching src/services/api-client.ts, src/lib/query-client.ts or src/lib/query-keys.ts.

  Keywords: apiClient, target, api, app, FetchOptions, ApiResponse, ApiError, skipEncryption, raw,
  useQuery, useMutation, useQueryClient, invalidateQueries, removeQueries, QUERY_KEYS, queryClient,
  staleTime, enabled, isPending, isSuccess, isError, QueryProvider, useLoadingStore, React Query, TanStack
---

# API client and TanStack Query

Server state belongs to TanStack Query; `apiClient` is the only way to reach the external API. Hooks call
`apiClient` directly in `queryFn` / `mutationFn` (the shape chosen in `src/data/TANSTACK_MIGRATION_PLAN.md`).

```
component ─▶ useMembers(params)            (hooks/queries)    queryKey QUERY_KEYS.members(params)
          ─▶ useCreateMember().mutate(dto) (hooks/mutations)  onSuccess → invalidateQueries(QUERY_KEYS.members())
          ─▶ useMutation inline            (public forms)     mutationFn → apiClient.post('/api/inquiry/…') or fetch(FormData)
                 │
                 ▼
apiClient.get/post/put/patch/delete<T>(endpoint, [body], { target })
   target 'api' → config.api.url (gwc-monitoring-service)   target 'app' (default) → config.app.url (our route handlers)
   headers: JSON + locale_timezone + X-ACCESS-TOKEN/X-ACCESS · credentials: 'include'
   useLoadingStore increment/decrement · 401 → refresh/sign-out · !ok → throw ApiError · ok → response.json() as T
```

## Files in this skill

| File | What | Load when |
|---|---|---|
| `SKILL.md` | Rules, decision guide, recipes, drift, checklist | Always |
| `references/endpoint-map.md` | Every hook/call → endpoint → service route (and which don't match yet), query-key inventory | Adding or changing an endpoint or key |

## The rules

1. **External-API calls use `apiClient` with `{ target: 'api' }`** and a relative endpoint (`'members'`,
   `` `members/${id}` ``). Never `fetch` the API directly. *Why:* `apiClient` adds the encrypted headers,
   cookies, the loading counter and the 401 flow.
2. **Type the envelope.** The API wraps bodies as `{ data, statusCode }`; the generic is the whole response
   type (`MemberListResponseDto`, `ApiResponse<T>`), and components read `.data`. *Why:* matches the DTOs in
   `src/models/*.types.ts`.
3. **Reads are query hooks in `src/hooks/queries/use<Thing>.ts`**, exported from `hooks/queries/index.ts`:
   `useQuery({ queryKey: QUERY_KEYS.x(...), queryFn: () => apiClient.get<T>(…, { target: 'api' }), enabled: !!id })`.
   *Why:* cache sharing and dedupe need one key per resource.
4. **Writes are mutation hooks in `src/hooks/mutations/use<Verb><Thing>.ts`**, and **every mutation
   invalidates what it changed** in `onSuccess` (`invalidateQueries` for lists/details, `removeQueries` for a
   deleted detail). Variables with an id are `{ id, data }`. *Why:* stale lists after a write are the bug this
   migration removed.
5. **Query keys come only from `QUERY_KEYS`** in `src/lib/query-keys.ts`: `[resource]`, `[resource, params]`,
   `[resource, id]`, `[resource, id, sub]`. Add the factory there before using it. *Why:* invalidation by prefix
   (`QUERY_KEYS.members()`) only works when every key shares the prefix.
6. **Public form submissions use an inline `useMutation` in the client component** (no shared hook):
   JSON → `apiClient.post('/api/<route>', data)` (default target `'app'`); with a file → `fetch('/api/<route>',
   { method: 'POST', body: formData })` because `apiClient` is JSON-only, throwing
   `new Error(err.error || err.message || 'Submission failed')` on `!response.ok`. *Why:* one-off submissions
   don't need cache; `isPending`/`isSuccess`/`isError` drive the UI (`forms`).
7. **UI state comes from the hook, not `useState`:** `isPending` disables the submit button and shows the
   spinner, `isSuccess` swaps in the thank-you panel, `isError` shows the alert, `mutation.reset()` + form
   `reset()` for "submit another". Admin feedback uses `showSuccess` / `showError` from
   `@/components/ui/Toast` in `onSuccess` / `onError`. *Why:* no duplicated flags.
8. **Keep the `queryClient` defaults** (`staleTime 60_000`, `gcTime 5 min`, `retry 1`,
   `refetchOnWindowFocus false`, mutations `retry 0`); override per hook only with a reason in a comment.
   *Why:* consistent caching across pages.
9. **Don't remove `incrementRequests`/`decrementRequests` from `apiClient`.** `AdminLayout` shows
   `<PageSpinner />` from `useLoadingStore().isLoading`. *Why:* the admin loading overlay depends on it.
10. **Never put server data in Zustand.** *Why:* two caches drift (`zustand`).
11. **Match the service's route names exactly** (`references/endpoint-map.md`). A new hook for a route the
    service doesn't have yet is a spec open question, not a guess. *Why:* several hooks already point at
    routes that don't exist.

## Decision guide

| Situation | Use | Example in this repo |
|---|---|---|
| List / detail from the API | query hook + `QUERY_KEYS` + `enabled: !!id` | `hooks/queries/useMember.ts` |
| Create / update / delete on the API | mutation hook + invalidation | `hooks/mutations/useUpdateMember.ts` |
| Public JSON form → route handler | inline `useMutation` + `apiClient.post('/api/…', data)` | `app/(public)/events/vip-form/VipFormClient.tsx` |
| Public form with a file | inline `useMutation` + `fetch` + `FormData` | `app/(public)/events/sod-enrollment/SodEnrollmentClient.tsx` |
| Lookup-on-click (not cached) | inline `useMutation` | `components/landing/events/CompleteRegistrationPanel.tsx` (`lookup`) |
| Read from a route handler with caching | `useQuery` + a `QUERY_KEYS` entry | `app/(public)/lyric-formatter/LyricFormatterClient.tsx` (`lyricsSearch`) |
| Is anything loading (admin) | `useLoadingStore().isLoading` (or `useIsFetching()`) | `components/layout/AdminLayout.tsx` |

## Where things live

| Path | What |
|---|---|
| `src/services/api-client.ts` | `apiClient` (`get`, `post`, `put`, `patch`, `delete`, `raw`), `ApiResponse<T>`, `ApiError` (`retryAfter`: seconds from a 429's `Retry-After`, spec 007), `FetchOptions` (`target`, `skipEncryption`, `skipAuth`, `body`, `signInPath` — where a failed refresh sends the browser, default `/signin`) |
| `src/lib/query-client.ts` | `queryClient` and its defaults |
| `src/lib/query-keys.ts` | `QUERY_KEYS` |
| `src/components/providers/QueryProvider.tsx` | `QueryClientProvider` + `ReactQueryDevtools`, mounted in `src/app/layout.tsx` |
| `src/hooks/queries/` | `useMembers`, `useMember`, `useChurches`, `useChurchCampus`, `useChurchCampusStaffs`, `usePlatformTenants` (portal; 403 → sign-out) |
| `src/hooks/mutations/` | `useCreateMember`, `useCreateCellMember`, `useUpdateMember`, `useDeleteMember`, `useUpdateChurchCampus` |
| `src/stores/loading.store.ts` | `useLoadingStore` (request counter) |
| `src/components/ui/Toast.tsx` | `showSuccess`, `showError`, `showWarning`, `showInfo`, `ToastProvider` |
| `src/core/utils.ts` | `buildQueryString` |

## Recipe: query + mutation hook

```ts
// src/hooks/queries/useChurchCampus.ts
export const useChurchCampus = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.churchCampus(id),
    queryFn: () => apiClient.get<ChurchCampusResponseDto>(`churchCampuses/${id}`, { target: 'api' }),
    enabled: !!id,
  });
};

// src/hooks/mutations/useCreateMember.ts
export const useCreateMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MemberCreationDto) =>
      apiClient.post<MemberResponseDto>('members', data, { target: 'api' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.members() });
    },
  });
};
```

(The recipe uses the service's `churchCampuses` route; the current hook still calls `church-campuses` — drift.)

## Legacy and drift

Don't copy any of these; fixing them is a separate task.

- Endpoint names that don't match `gwc-monitoring-service`: `church-campuses/:id`, `church-campuses/:id/staffs`, `members/cell-member`, and `PATCH/DELETE members/:id`, `PATCH church-campuses/:id` (no such routes) → see `references/endpoint-map.md`.
- `handleErrorResponse` reads `message`; the service sends `{ data: null, statusCode, error }` → every API error message becomes `'An error occurred'`. New error UIs use generic copy; the fix reads `error ?? message`.
- `refreshToken()` targets the app origin, not the API (see `authentication`).
- `target: 'app'` builds an absolute URL from `NEXT_PUBLIC_APP_URL` (fallback: the production origin), so a build without that key posts public forms to production. Multipart forms use a relative `fetch('/api/…')`; prefer relative URLs for our own routes.
- Unused service wrappers (`services/member.service.ts`, `church.service.ts`, `church-campus.service.ts`, `inquiry.service.ts`) duplicate the hooks → don't add to them.
- `useMembers` casts `params as unknown as Record<string, unknown>` for the key, and sends `sortBy`/`search`/`affiliation`/`civil_status` that the service doesn't declare (it declares `page`, `pageSize`, `gender`).
- `config.api.timeout` exists but `apiClient` has no timeout/abort; pass `signal` from the query context if a call needs cancelling.

## Checklist before shipping

- [ ] Every external call uses `apiClient` with `target: 'api'`: `git diff -U0 -- src | grep -E "^\+.*fetch\(" ` shows only route-handler or multipart `/api/…` calls
- [ ] Every `queryKey` uses `QUERY_KEYS`: `git diff -U0 -- src | grep -E "^\+.*queryKey: \["` is empty
- [ ] Every new mutation hook has `onSuccess` invalidation (or a comment saying why not)
- [ ] New endpoints listed in `references/endpoint-map.md` and match a service route (or are an open question in the spec)
- [ ] Loading / error / success states come from the hook

## Related skills

- [`authentication`](../authentication/SKILL.md): 401, refresh, `/self`
- [`security`](../security/SKILL.md): encrypted headers, route-handler validation
- [`forms`](../forms/SKILL.md): submitting forms with `useMutation`
- [`zustand`](../zustand/SKILL.md): what stays out of stores
