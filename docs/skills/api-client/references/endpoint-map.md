# Endpoint map (2026-11-21)

## External API (`target: 'api'`, base `NEXT_PUBLIC_API_URL` = `…/api/v1`)

Service routes from `gwc-monitoring-service/src/**/controllers/*.controller.ts`. "Match" means the path and
method this app calls exist on the service.

| Caller | Call | Service route | Match |
|---|---|---|---|
| `auth.service.authenticate` | `POST auth` | `POST /api/v1/auth` | yes |
| `auth.service.getSelf` | `GET self` | `GET /api/v1/self` (also `auth/self`) | yes |
| `auth.service.logout` | `POST auth/logout` | `POST /api/v1/auth/logout` | yes |
| `api-client.refreshToken` | `POST {app}/auth/refresh` | `POST /api/v1/auth/refresh` | **no — wrong base** |
| `useMembers` | `GET members?page&pageSize&sortBy&sortDirection&search&gender&affiliation&civil_status` | `GET /api/v1/members` (declares `page`, `pageSize`, `gender`) | partly |
| `useMember` | `GET members/:id` | `GET /api/v1/members/:id` | yes |
| `useChurches` | `GET churches` | `GET /api/v1/churches` | yes |
| `useChurchCampus` | `GET church-campuses/:id` | `GET /api/v1/churchCampuses/:id` | **no — name** |
| `useChurchCampusStaffs` | `GET church-campuses/:id/staffs` | `GET /api/v1/churchCampuses/:id/churchCampusStaffs` | **no — name** |
| `useCreateMember` | `POST members` | `POST /api/v1/members` | yes |
| `useCreateCellMember` | `POST members/cell-member` | `POST /api/v1/cellMembers` | **no — name** |
| `useUpdateMember` | `PATCH members/:id` | — | **no route** |
| `useDeleteMember` | `DELETE members/:id` | — | **no route** |
| `useUpdateChurchCampus` | `PATCH church-campuses/:id` | — | **no route** |

Service routes with no caller here yet: `POST /api/v1/churchCampuses` (create campus),
`POST /api/v1/churchCampuses/:id/churchCampusStaffs`, `POST /api/v1/churchCampuses/:id/heirarchyRoots`
(misspelling is the real path), `GET /api/v1/churches/healthCheck`, `GET /api/health`.

## Our route handlers (`target: 'app'` or relative `fetch`)

| Caller | Method + path | Body | Handler writes to |
|---|---|---|---|
| `ContactSection` | `POST /api/inquiry` | JSON (`simpleContactSchema`) | Google Sheet |
| `ConnectFab` (prayer) | `POST /api/inquiry/prayer-requests` | JSON (`contactSchema`, `type: 'prayer'`) | Google Sheet |
| `ConnectFab` (join) | `POST /api/inquiry/cell-groups` | JSON (`joinSchema`) | Google Sheet |
| `VipFormClient` | `POST /api/inquiry/vip` | JSON (`vipFormSchema`) | Google Sheet |
| `GatewayPledgeSection` | `POST /api/inquiry/pledge` | JSON (`gatewayPledgeSchema`) | Google Sheet |
| `EventContactSection`, `JoinEventModal` | `POST /api/event/[slug]` | JSON (`eventContactSchema`) | Google Sheet |
| `SodEnrollmentClient` | `POST /api/events/sod-enrollment` | multipart | Blob + Google Sheet |
| `EventRegistrationSection` | `POST /api/events/event-registration` | multipart | Blob + Google Sheet + Resend |
| `CompleteRegistrationPanel` | `GET` (lookup by reference) + `POST` (multipart) `/api/events/event-registration/proof` | query / multipart | Google Sheet + Blob + Resend |
| `LifeclassEnrollmentClient` | `POST /api/events/lifeclass-enrollment` | multipart | Blob + Google Sheet + Resend |
| `LifeclassAlreadyEnrolledPanel` | `GET` (lookup) + `POST` (multipart) `/api/events/lifeclass-enrollment/proof` | query / multipart | Google Sheet + Blob + Resend |
| `GivingConfirmationSection` | `POST /api/give/giving-confirmation` | multipart | Blob + Google Sheet + Resend |
| `LyricFormatterClient` (+ `lib/lyrics/lrclib-search.ts`) | `/api/lyrics/search`, `/api/lyrics/identify`, `/api/lyrics/section` | JSON / query | LRCLIB, Firecrawl, Gemini |

No caller in `src/`: `app/api/inquiry/sod-enrollment/route.ts` (older SOD inquiry) and `app/api/lyrics/linebreaks/route.ts`.

## Query keys (`src/lib/query-keys.ts`)

| Factory | Key | Used by |
|---|---|---|
| `members(params?)` | `['members']` / `['members', params]` | `useMembers`; invalidated by create/update/delete |
| `member(id)` | `['members', id]` | `useMember`; invalidated by update, removed by delete |
| `churches()` / `church(id)` | `['churches']` / `['churches', id]` | `useChurches` |
| `churchCampus(id)` | `['church-campus', id]` | `useChurchCampus`; invalidated by `useUpdateChurchCampus` |
| `churchCampusStaffs(id)` | `['church-campus', id, 'staffs']` | `useChurchCampusStaffs`; invalidated by `useUpdateChurchCampus` |
| `campaigns()` / `campaign(id)` | `['campaigns']` / `['campaigns', id]` | reserved |
| `self()` | `['self']` | reserved (`/self` goes through `auth.service`, not a query) |
| `lyricsSearch(params)` | `['lyrics', 'search', params]` | `LyricFormatterClient` |
| `lyricsIdentify(lyrics)` | `['lyrics', 'identify', lyrics]` | `LyricFormatterClient` |
