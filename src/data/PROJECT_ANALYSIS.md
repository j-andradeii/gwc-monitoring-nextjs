# GWC Monitoring NextJS - Comprehensive Project Analysis

This document provides a complete technical analysis of the GWC Monitoring NextJS project, covering all architectural patterns, implementations, and best practices used throughout the codebase.

---

## Table of Contents

1. [Tech Stack & Dependencies](#1-tech-stack--dependencies)
2. [Project Scaffolding & Directory Structure](#2-project-scaffolding--directory-structure)
3. [Routing Patterns](#3-routing-patterns)
4. [HTTP Patterns & API Client](#4-http-patterns--api-client)
5. [State Management (Zustand)](#5-state-management-zustand)
6. [API Callback Pattern (Publisher-Subscriber)](#6-api-callback-pattern-publisher-subscriber)
7. [Form Patterns (Zod + React Hook Form)](#7-form-patterns-zod--react-hook-form)
8. [Service Layer Patterns](#8-service-layer-patterns)
9. [Reusable Form Components](#9-reusable-form-components)

---

## 1. Tech Stack & Dependencies

### Core Framework & Runtime

| Package | Version | Purpose |
|---------|---------|---------|
| Next.js | 16.0.10 | React meta-framework with App Router |
| React | 19.2.1 | UI library |
| React DOM | 19.2.1 | React DOM renderer |
| TypeScript | 5.x | Type-safe JavaScript |

### State Management

| Package | Version | Purpose |
|---------|---------|---------|
| Zustand | 5.0.9 | Lightweight state management |

### UI Components & Styling

| Package | Version | Purpose |
|---------|---------|---------|
| PrimeReact | 10.9.7 | Enterprise UI component library |
| PrimeIcons | 7.0.0 | Icon library |
| Tailwind CSS | 4.x | Utility-first CSS framework |
| @tailwindcss/postcss | 4.x | PostCSS plugin for Tailwind |

### Form Handling & Validation

| Package | Version | Purpose |
|---------|---------|---------|
| React Hook Form | 7.68.0 | Form state management |
| Zod | 4.1.13 | Schema validation |
| @hookform/resolvers | 5.2.2 | RHF-Zod integration |

### Data Visualization

| Package | Version | Purpose |
|---------|---------|---------|
| Chart.js | 4.5.1 | JavaScript charting |
| react-chartjs-2 | 5.3.1 | React wrapper for Chart.js |

### Utilities

| Package | Version | Purpose |
|---------|---------|---------|
| react-zoom-pan-pinch | 3.7.0 | Image zoom/pan functionality |
| react-share | 5.2.2 | Social media sharing |
| scrypt-js | 3.0.1 | Cryptographic utilities |
| googleapis | 171.4.0 | Google API client |

### Testing

| Package | Version | Purpose |
|---------|---------|---------|
| Playwright | 1.58.2 | End-to-end testing |

---

## 2. Project Scaffolding & Directory Structure

### Complete Directory Map

```
src/
├── app/                           # Next.js App Router
│   ├── page.tsx                   # Home page (/)
│   ├── layout.tsx                 # Root layout with metadata
│   ├── robots.ts                  # SEO robots configuration
│   ├── sitemap.ts                 # SEO sitemap
│   ├── manifest.ts                # PWA manifest
│   │
│   ├── (auth)/                    # Auth route group
│   │   ├── layout.tsx
│   │   └── signin/
│   │       └── page.tsx           # Sign-in page (/signin)
│   │
│   ├── (public)/                  # Public route group
│   │   ├── layout.tsx
│   │   ├── about/
│   │   │   └── page.tsx           # About page (/about)
│   │   ├── events/
│   │   │   ├── page.tsx           # Events listing (/events)
│   │   │   └── [slug]/
│   │   │       ├── page.tsx       # Event detail (/events/[slug])
│   │   │       └── EventDetailClient.tsx
│   │   ├── sermon-notes/
│   │   │   ├── page.tsx           # Sermon list (/sermon-notes)
│   │   │   ├── SermonNotesClient.tsx
│   │   │   └── [slug]/
│   │   │       ├── page.tsx       # Sermon detail (/sermon-notes/[slug])
│   │   │       └── SermonDetailClient.tsx
│   │   ├── give/
│   │   │   ├── ways-to-give/
│   │   │   │   └── page.tsx       # Ways to Give
│   │   │   └── gateway-projects/
│   │   │       └── page.tsx       # Gateway Projects
│   │   └── ministries/
│   │       ├── community/
│   │       │   └── page.tsx       # Community Ministry
│   │       └── serve/
│   │           └── page.tsx       # Serve Ministry
│   │
│   ├── (protected)/               # Protected/Admin route group
│   │   └── church-campus-admin/
│   │       ├── layout.tsx
│   │       ├── page.tsx           # Admin dashboard
│   │       └── church-members/
│   │           ├── page.tsx       # Members list
│   │           ├── men-network/
│   │           │   └── page.tsx
│   │           └── women-network/
│   │               └── page.tsx
│   │
│   └── api/                       # API routes
│       ├── event/
│       │   └── [slug]/
│       │       └── route.ts       # GET/POST /api/event/[slug]
│       └── inquiry/
│           ├── route.ts           # POST /api/inquiry
│           ├── cell-groups/
│           │   └── route.ts       # POST /api/inquiry/cell-groups
│           └── prayer-requests/
│               └── route.ts       # POST /api/inquiry/prayer-requests
│
├── components/                    # React components
│   ├── landing/                   # Landing page components (28 files)
│   │   ├── HeroSection.tsx
│   │   ├── ContactSection.tsx
│   │   ├── ConnectFab.tsx
│   │   ├── JoinEventModal.tsx
│   │   └── ... (25 more)
│   ├── layout/                    # Layout components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── AdminLayout.tsx
│   ├── ui/                        # Base UI components
│   │   ├── Button.tsx
│   │   ├── Spinner.tsx
│   │   └── Toast.tsx
│   ├── forms/                     # Form components
│   │   ├── FormInput.tsx
│   │   ├── FormTextarea.tsx
│   │   ├── FormSelect.tsx
│   │   ├── FormPassword.tsx
│   │   ├── FormCalendar.tsx
│   │   ├── FormCheckbox.tsx
│   │   ├── FormRadioButton.tsx
│   │   ├── FormInputNumber.tsx
│   │   ├── FormError.tsx
│   │   └── index.ts
│   └── cards/                     # Card components
│       ├── MemberCard.tsx
│       └── StatsWidget.tsx
│
├── core/                          # Core utilities & configuration
│   ├── config.ts                  # App configuration
│   ├── constants.ts               # Application constants
│   ├── messages.ts                # Toast/notification messages
│   ├── form-message.ts            # Form validation messages
│   ├── utils.ts                   # General utilities
│   ├── date-utils.ts              # Date/time manipulation
│   ├── crypto.ts                  # Encryption utilities
│   ├── local-storage.ts           # LocalStorage wrapper
│   └── index.ts
│
├── services/                      # API services
│   ├── api-client.ts              # Fetch API wrapper
│   ├── auth.service.ts            # Authentication
│   ├── member.service.ts          # Member management
│   ├── church.service.ts          # Church data
│   ├── church-campus.service.ts   # Campus operations
│   ├── inquiry.service.ts         # Inquiry submissions
│   └── index.ts
│
├── stores/                        # Zustand state stores
│   ├── event.store.ts             # API event pub/sub
│   ├── user.store.ts              # User auth state
│   ├── loading.store.ts           # Global loading
│   ├── sidebar.store.ts           # Sidebar UI state
│   ├── breadcrumbs.store.ts       # Navigation breadcrumbs
│   └── index.ts
│
├── models/                        # Types & schemas
│   ├── auth.types.ts
│   ├── member.types.ts
│   ├── church.types.ts
│   ├── index.ts
│   ├── enums/
│   │   └── index.ts               # ChurchRole, Gender, etc.
│   └── schemas/
│       ├── auth.schema.ts
│       ├── member.schema.ts
│       ├── church.schema.ts
│       └── contact.schema.ts
│
├── hooks/                         # Custom React hooks
│   ├── useAuth.ts
│   ├── useApiEvent.ts
│   ├── useBreadcrumbs.ts
│   ├── useResponsive.ts
│   ├── usePagination.ts
│   ├── useBodyClick.ts
│   ├── useDownloadImage.ts
│   └── index.ts
│
├── guards/                        # Route protection
│   ├── AuthGuard.tsx
│   └── index.ts
│
├── data/                          # Static data
│   ├── site-metadata.ts
│   ├── events.ts
│   ├── sermons.ts
│   ├── ministries.ts
│   ├── giveData.ts
│   └── contact.ts
│
├── styles/                        # CSS files
│   ├── admin.css
│   ├── landing.css
│   └── signin.css
│
├── middleware.ts                  # Next.js middleware
└── layouts/                       # (Empty - components in components/layout)
```

### Path Aliases (tsconfig.json)

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/stores/*": ["./src/stores/*"],
      "@/services/*": ["./src/services/*"],
      "@/models/*": ["./src/models/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/core/*": ["./src/core/*"],
      "@/guards/*": ["./src/guards/*"],
      "@/layouts/*": ["./src/layouts/*"],
      "@/data/*": ["./src/data/*"]
    }
  }
}
```

---

## 3. Routing Patterns

### Route Groups

The project uses Next.js App Router with route groups for organization:

| Route Group | Purpose | Authentication |
|-------------|---------|----------------|
| `(auth)` | Authentication pages (signin, signup) | Redirect if authenticated |
| `(public)` | Public-facing pages | No auth required |
| `(protected)` | Admin dashboard | Auth required |

### Route Protection (middleware.ts)

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('ACCESS_TOKEN')?.value;
  const pathname = request.nextUrl.pathname;

  // Protected routes
  if (pathname.startsWith('/church-campus-admin')) {
    if (!accessToken) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  }

  // Auth routes - redirect if already authenticated
  if (pathname.startsWith('/signin') || pathname.startsWith('/signup')) {
    if (accessToken) {
      return NextResponse.redirect(new URL('/church-campus-admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/church-campus-admin/:path*', '/signin', '/signup'],
};
```

### API Routes Structure

```
/api/inquiry              → POST: Submit general inquiry
/api/inquiry/prayer-requests → POST: Submit prayer request
/api/inquiry/cell-groups  → POST: Submit cell group join request
/api/event/[slug]         → GET: Get event, POST: Submit event inquiry
```

---

## 4. HTTP Patterns & API Client

### API Client Implementation

**File: `src/services/api-client.ts`**

```typescript
/**
 * API Client Service
 *
 * Fetch API wrapper with interceptors, token management, and error handling
 * Uses httpOnly cookies for authentication (set by backend)
 * Matches the Angular interceptor pattern for backend compatibility
 */

import { useLoadingStore } from '@/stores/loading.store';
import { useUserStore } from '@/stores/user.store';
import { config } from '@/core/config';
import { encrypt } from '@/core/crypto';
import { getUtcMillis, getBrowserTimezone } from '@/core/date-utils';

// --- Types ---

export interface ApiResponse<T = unknown> {
  data: T;
  statusCode: number;
}

export interface ApiError {
  message: string;
  status?: number;
  statusText?: string;
  errors?: Record<string, string[]>;
}

export interface FetchOptions extends Omit<RequestInit, 'body'> {
  skipAuth?: boolean;
  skipEncryption?: boolean;
  body?: unknown;
}

interface RetryConfig {
  endpoint: string;
  options?: FetchOptions;
}

// --- Auth URL detection ---

const AUTH_URLS = ['auth', 'token'];

const isAuthUrl = (url: string): boolean => {
  return AUTH_URLS.some((authUrl) => url.includes(authUrl));
};

// --- Store Actions ---

const { incrementRequests, decrementRequests } = useLoadingStore.getState();

// --- Request Interceptor ---

const buildUrl = (endpoint: string): string => {
  const baseUrl = config.app.url;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${baseUrl}/${cleanEndpoint}`;
};

const buildHeaders = async (
  endpoint: string,
  options?: FetchOptions
): Promise<HeadersInit> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Accept-Language': 'en',
    locale_timezone: getBrowserTimezone(),
    ...(options?.headers as Record<string, string>),
  };

  // Note: Authentication is handled via httpOnly cookies set by the backend
  // The browser automatically sends cookies with credentials: 'include'
  // No need to manually attach Bearer token headers

  // Add encrypted access headers (for all requests)
  if (!options?.skipEncryption) {
    try {
      const xAccessToken = await encrypt(config.security.xAccessTokenKey);
      const utcMillis = getUtcMillis();
      const xAccess = await encrypt(`${utcMillis}`);

      headers[config.security.xAccessTokenKeyHeader] = xAccessToken;
      headers[config.security.xAccessHeader] = xAccess;
    } catch (error) {
      console.warn('Failed to encrypt access headers:', error);
    }
  }

  return headers;
};

// --- Response Interceptor ---

const handleSuccessResponse = (response: Response): Response => {
  return response;
};

const handleErrorResponse = async (response: Response): Promise<ApiError> => {
  let errorData: unknown;

  try {
    errorData = await response.json();
  } catch {
    errorData = { message: response.statusText };
  }

  const error: ApiError = {
    message:
      (errorData as { message?: string })?.message || 'An error occurred',
    status: response.status,
    statusText: response.statusText,
    errors: (errorData as { errors?: Record<string, string[]> })?.errors,
  };

  return error;
};

// --- Token Refresh ---

/**
 * Refresh tokens using httpOnly cookie
 * Backend reads refresh_token from cookie automatically and sets new cookies
 */
const refreshToken = async (): Promise<boolean> => {
  try {
    const headers = await buildHeaders('auth/refresh', { skipAuth: true });
    const response = await fetch(buildUrl('auth/refresh'), {
      method: 'POST',
      headers,
      credentials: 'include', // Send cookies with request
    });

    // Backend sets new cookies automatically on success
    return response.ok;
  } catch {
    return false;
  }
};

const handleTokenRefresh = async (
  retryConfig: RetryConfig
): Promise<Response> => {
  const userStore = useUserStore.getState();
  const success = await refreshToken();

  if (!success) {
    userStore.logout();
    if (typeof window !== 'undefined') {
      window.location.href = '/signin';
    }
    throw {
      message: 'Session expired. Please login again.',
      status: 401,
    } as ApiError;
  }

  // Cookies are updated by backend, retry the original request
  return makeRequest(retryConfig.endpoint, retryConfig.options);
};

// --- Core Request Function ---

const makeRequest = async (
  endpoint: string,
  options?: FetchOptions
): Promise<Response> => {
  incrementRequests();

  try {
    const url = buildUrl(endpoint);
    const headers = await buildHeaders(endpoint, options);
    const body = options?.body ? JSON.stringify(options.body) : undefined;

    const response = await fetch(url, {
      ...options,
      headers,
      body,
      credentials: 'include', // Send/receive httpOnly cookies
    });

    // Handle 401 with token refresh
    if (response.status === 401) {
      const clonedResponse = response.clone();
      let errorData: { message?: string; error?: string } = {};

      try {
        errorData = await clonedResponse.json();
      } catch {
        // Ignore parse error
      }

      // Check for expired JWT token
      if (
        errorData.message === 'Expired JWT Token' ||
        errorData.error === 'Unauthorized'
      ) {
        decrementRequests();
        return handleTokenRefresh({ endpoint, options });
      }

      // Clear user on other 401 errors
      if (!isAuthUrl(endpoint)) {
        const userStore = useUserStore.getState();
        userStore.logout();
        if (typeof window !== 'undefined') {
          window.location.href = '/signin';
        }
      }
    }

    decrementRequests();

    if (!response.ok) {
      const error = await handleErrorResponse(response);
      throw error;
    }

    return handleSuccessResponse(response);
  } catch (error) {
    decrementRequests();
    throw error;
  }
};

// --- API Client Class ---

class ApiClient {
  async get<T = unknown>(endpoint: string, options?: FetchOptions): Promise<T> {
    const response = await makeRequest(endpoint, { ...options, method: 'GET' });
    return response.json();
  }

  async post<T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: FetchOptions
  ): Promise<T> {
    const response = await makeRequest(endpoint, {
      ...options,
      method: 'POST',
      body,
    });
    return response.json();
  }

  async put<T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: FetchOptions
  ): Promise<T> {
    const response = await makeRequest(endpoint, {
      ...options,
      method: 'PUT',
      body,
    });
    return response.json();
  }

  async patch<T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: FetchOptions
  ): Promise<T> {
    const response = await makeRequest(endpoint, {
      ...options,
      method: 'PATCH',
      body,
    });
    return response.json();
  }

  async delete<T = unknown>(
    endpoint: string,
    options?: FetchOptions
  ): Promise<T> {
    const response = await makeRequest(endpoint, {
      ...options,
      method: 'DELETE',
    });
    return response.json();
  }

  // Raw response method (for cases where you need the raw Response object)
  async raw(endpoint: string, options?: FetchOptions): Promise<Response> {
    return makeRequest(endpoint, options);
  }
}

// Export singleton
export const apiClient = new ApiClient();
```

### Key HTTP Patterns

1. **Singleton Pattern**: Single `apiClient` instance exported
2. **Interceptors**: Request headers built via `buildHeaders()`, responses handled via `handleSuccessResponse()`/`handleErrorResponse()`
3. **Token Refresh**: Automatic retry on 401 with "Expired JWT Token"
4. **Loading State**: Integrated with `useLoadingStore` via `incrementRequests()`/`decrementRequests()`
5. **httpOnly Cookies**: Authentication via `credentials: 'include'`

---

## 5. State Management (Zustand)

### 5.1 API Event Store (Publisher-Subscriber Pattern)

**File: `src/stores/event.store.ts`**

```typescript
/**
 * API Event Store
 *
 * Pub/Sub system for API event communication between services and components
 */

import { create } from 'zustand';

// Event status enum
export enum ApiEventStatus {
  DEFAULT = 0,
  IN_PROGRESS = 1,
  COMPLETED = 2,
  ERROR = 3,
}

// Event type enum
export enum ApiEventType {
  DEFAULT,
  AUTHENTICATION,
  GET_AUTHENTICATED_SELF,
  REFRESH_TOKEN,
  CREATE_MEMBER,
  UPDATE_MEMBER,
  DELETE_MEMBER,
  GET_MEMBERS,
  GET_MEMBER,
  GET_CHURCHES,
  GET_CHURCH,
  GET_CHURCH_CAMPUS,
  GET_CHURCH_CAMPUS_STAFFS,
  UPDATE_CHURCH_CAMPUS,
  GET_CAMPAIGNS,
  CREATE_CAMPAIGN,
  UPDATE_CAMPAIGN,
  DELETE_CAMPAIGN,
  SUBMIT_QUERY,
  SUBMIT_PRAYER_REQUEST,
  SUBMIT_CELL_GROUP_JOIN,
  SUBMIT_EVENT_INQUIRY,
}

// Event interface
export interface ApiEvent {
  type: ApiEventType;
  status: ApiEventStatus;
  title?: string;
  message?: string;
  spinner?: boolean;
  popup?: boolean;
  toast?: boolean;
  targetId?: string | number;
}

// Subscriber callback type
type EventCallback = (event: ApiEvent | null) => void;

interface ApiEventStore {
  currentEvent: ApiEvent | null;
  subscribers: EventCallback[];
  sendEvent: (event: ApiEvent) => void;
  subscribe: (callback: EventCallback) => () => void;
  clearEvent: () => void;
}

export const useApiEventStore = create<ApiEventStore>((set, get) => ({
  currentEvent: null,
  subscribers: [],

  sendEvent: (event: ApiEvent) => {
    set({ currentEvent: event });
    // Notify all subscribers
    get().subscribers.forEach((callback) => callback(event));
  },

  subscribe: (callback: EventCallback) => {
    set((state) => ({
      subscribers: [...state.subscribers, callback],
    }));

    // Return unsubscribe function
    return () => {
      set((state) => ({
        subscribers: state.subscribers.filter((cb) => cb !== callback),
      }));
    };
  },

  clearEvent: () => set({ currentEvent: null }),
}));

// Helper to create events
export const createApiEvent = (
  type: ApiEventType,
  status: ApiEventStatus,
  options?: Partial<Omit<ApiEvent, 'type' | 'status'>>
): ApiEvent => ({
  type,
  status,
  ...options,
});

// Selectors
export const selectCurrentEvent = (state: ApiEventStore) => state.currentEvent;
export const selectIsLoading = (state: ApiEventStore) =>
  state.currentEvent?.status === ApiEventStatus.IN_PROGRESS;
```

### 5.2 User Store (Persistence with localStorage)

**File: `src/stores/user.store.ts`**

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserState {
  user: SelfInformationDto | null;
  isAuthenticated: boolean;
}

interface UserActions {
  setUser: (user: SelfInformationDto) => void;
  setUserInfo: (user: SelfInformationDto) => void;
  updateUser: (updates: Partial<SelfInformationDto>) => void;
  clearUser: () => void;
  logout: () => void;
}

type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

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

      clearUser: () => set({ user: null, isAuthenticated: false }),

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(CONST.AUTHENTICATED_USER);
        }
        set({ user: null, isAuthenticated: false });
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
```

### 5.3 Loading Store

**File: `src/stores/loading.store.ts`**

```typescript
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
```

---

## 6. API Callback Pattern (Publisher-Subscriber)

This is the core pattern used to handle API responses in components. The pattern consists of:

1. **Service**: Sends events via `apiEventStore.sendEvent()`
2. **Component**: Subscribes to events via `apiEventStore.subscribe()`
3. **Factory Pattern**: Maps event status → event type → handler function

### 6.1 Full Example: ContactSection.tsx

**File: `src/components/landing/ContactSection.tsx`**

```typescript
'use client';

import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { simpleContactSchema, type SimpleContactFormData } from '@/models/schemas/contact.schema';
import { FormInput } from '@/components/forms/FormInput';
import { FormTextarea } from '@/components/forms/FormTextarea';
import * as inquiryService from "@/services/inquiry.service";
import { ApiEvent, ApiEventStatus, ApiEventType, useApiEventStore } from '@/stores';
import { CONTACT_INFO } from '@/data/contact';

export const ContactSection: React.FC = () => {

  const apiEventStore = useApiEventStore();

  const [submitted, setSubmitted] = useState(false);

  const methods = useForm<SimpleContactFormData>({
    resolver: zodResolver(simpleContactSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      message: ''
    }
  });


  useEffect(() => {
    const cleanup = getApiEvents();
    return () => {
      cleanup();
    };
  }, []);

  const getApiEvents = () => {
    const unsubscribe = apiEventStore.subscribe((event) => {
      if (!event) return;
      // Use the factory pattern to handle different event statuses
      const eventStatusHandleMap = createEventStatusHandleMap(event);
      const handleEvent = eventStatusHandleMap[event.status] || (() => { });
      handleEvent();
    });
    return () => {
      unsubscribe();
    };
  }

  const createEventStatusHandleMap = (
    apiEvent: ApiEvent,
  ): { [key in ApiEventStatus]?: () => void } => {
    return {
      [ApiEventStatus.COMPLETED]: () => {
        const eventTypeHandleMap: { [key in ApiEventType]?: () => void } = {
          [ApiEventType.SUBMIT_QUERY]: async () => {
            reset();
            setSubmitted(true);
          },
        };
        const handleEventType = eventTypeHandleMap[apiEvent.type] || (() => { });
        handleEventType();
      },
      [ApiEventStatus.ERROR]: () => {
        const eventTypeHandleMap: { [key in ApiEventType]?: () => void } = {
          [ApiEventType.SUBMIT_QUERY]: async () => {
          },
        };
        const handleEventType = eventTypeHandleMap[apiEvent.type] || (() => { });
        handleEventType();
      },
      [ApiEventStatus.IN_PROGRESS]: () => {
      },
      [ApiEventStatus.DEFAULT]: () => {
      }
    };
  };

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = methods;

  const onSubmit = async (data: SimpleContactFormData) => {
    // Simulate API call
    // await new Promise((resolve) => setTimeout(resolve, 1500));
    await inquiryService.submitQuery(data);

  };

  return (
    <section id="contact" className="contact-section animate-on-scroll">
      <div className="contact-bg-pattern"></div>
      <div className="landing-container">
        <div className="contact-card">
          <div className="contact-card-inner">
            {/* Left - Info */}
            <div className="contact-info-panel">
              <span className="section-label-light">Get in Touch</span>
              <h2>Let&apos;s Start a Conversation</h2>
              <p className="contact-description">We&apos;re here to help and answer any questions you might have.</p>

              <div className="contact-details">
                <a href={`mailto:${CONTACT_INFO.email}`} className="contact-detail-item">
                  <i className="pi pi-envelope"></i>
                  <span>{CONTACT_INFO.email}</span>
                </a>
                <a href={`tel:${CONTACT_INFO.phoneRaw}`} className="contact-detail-item">
                  <i className="pi pi-phone"></i>
                  <span>{CONTACT_INFO.phone}</span>
                </a>
                <div className="contact-detail-item">
                  <i className="pi pi-map-marker"></i>
                  <span>{CONTACT_INFO.address}</span>
                </div>
              </div>

            </div>

            {/* Right - Form */}
            <div className="contact-form-panel">
              {submitted ? (
                <div className="contact-success-state">
                  <div className="success-checkmark">
                    <i className="pi pi-check"></i>
                  </div>
                  <h3>Message Sent!</h3>
                  <p>We&apos;ll get back to you soon.</p>
                  <button onClick={() => setSubmitted(false)} className="success-reset">
                    Send another <i className="pi pi-arrow-right"></i>
                  </button>
                </div>
              ) : (
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmit)} className="contact-form-minimal">
                    <FormInput
                      name="name"
                      label="Name"
                      placeholder=" "
                      isFloating
                      className="input-group"
                      displayDisabled={isSubmitting}
                    />

                    <FormInput
                      name="email"
                      label="Email"
                      placeholder=" "
                      isFloating
                      className="input-group"
                      displayDisabled={isSubmitting}
                    />

                    <FormTextarea
                      name="message"
                      label="Message"
                      placeholder=" "
                      rows={3}
                      isFloating
                      className="input-group"
                      displayDisabled={isSubmitting}
                    />

                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <i className="pi pi-spin pi-spinner"></i>
                      ) : (
                        <>
                          Send Message
                          <i className="pi pi-send"></i>
                        </>
                      )}
                    </button>
                  </form>
                </FormProvider>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
```

### 6.2 Full Example: JoinEventModal.tsx

**File: `src/components/landing/JoinEventModal.tsx`**

```typescript
'use client';

import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '@/components/forms/FormInput';
import { eventContactSchema, type EventContactFormData } from '@/models/schemas/contact.schema';
import * as inquiryService from "@/services/inquiry.service";
import { ApiEvent, ApiEventStatus, ApiEventType, useApiEventStore } from '@/stores';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    eventSlug: string;
    eventTitle: string;
}

export function JoinEventModal({ isOpen, onClose, eventSlug, eventTitle }: Props) {
    const apiEventStore = useApiEventStore();
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const methods = useForm<EventContactFormData>({
        resolver: zodResolver(eventContactSchema),
        mode: 'onChange',
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            address: '',
            gender: '',
            facebook: '',
            message: '',
        },
    });

    const { handleSubmit, reset } = methods;

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Reset state when opening
            setSubmitted(false);
            setError(null);
            reset({
                name: '',
                email: '',
                phone: '',
                address: '',
                gender: '',
                facebook: '',
                message: '',
            });
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, reset]);

    // Event Listener for API responses
    useEffect(() => {
        const cleanup = getApiEvents();
        return () => {
            cleanup();
        };
    }, []);

    function getApiEvents() {
        const unsubscribe = apiEventStore.subscribe((event) => {
            if (!event) return;

            const eventStatusHandleMap = createEventStatusHandleMap(event);
            const handleEvent = eventStatusHandleMap[event.status] || (() => { });
            handleEvent();
        });
        return () => {
            unsubscribe();
        };
    }

    function createEventStatusHandleMap(
        apiEvent: ApiEvent,
    ): { [key in ApiEventStatus]?: () => void } {
        return {
            [ApiEventStatus.COMPLETED]: () => {
                if (apiEvent.type === ApiEventType.SUBMIT_EVENT_INQUIRY) {
                    setIsSubmitting(false);
                    setSubmitted(true);
                    reset();
                }
            },
            [ApiEventStatus.ERROR]: () => {
                if (apiEvent.type === ApiEventType.SUBMIT_EVENT_INQUIRY) {
                    setIsSubmitting(false);
                    setSubmitted(true); // Following ConnectFab pattern
                    reset();
                }
            },
            [ApiEventStatus.IN_PROGRESS]: () => {
            },
            [ApiEventStatus.DEFAULT]: () => {
            }
        };
    };

    const onSubmit = async (data: EventContactFormData) => {
        setIsSubmitting(true);
        setError(null);
        await inquiryService.submitEventInquiry(data, eventSlug);
    };

    const handleReset = () => {
        setSubmitted(false);
        reset();
    };

    if (!isOpen) return null;

    return (
        <div className={`connect-modal-overlay open`} onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <div className="connect-modal-content">
                <button className="connect-close-btn" onClick={onClose}>
                    <i className="pi pi-times"></i>
                </button>

                {/* Left Side - Image/Visual */}
                <div className="connect-modal-left" style={{ backgroundImage: 'url("https://gtxngthtpisigkys.public.blob.vercel-storage.com/pray.jpg")' }}>
                    <div className="connect-modal-left-content">
                        <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">JOIN EVENT</h2>
                        <p className="text-sm md:text-lg opacity-90">
                            We're excited to have you join us for <strong>{eventTitle}</strong>. Please fill out the form to register.
                        </p>
                    </div>
                </div>

                {/* Right Side - Form & Options */}
                <div className="connect-modal-right">
                    <div className="mb-6 md:mb-8">
                        <span className="text-xs font-bold text-yellow-600 tracking-widest uppercase mb-1 block">Registration</span>
                        <h3 className="text-xl md:text-2xl font-bold text-navy-900 mb-2 md:mb-4 !mt-1" style={{ color: 'var(--color-navy)' }}>ENTER YOUR DETAILS</h3>
                    </div>

                    {submitted ? (
                        <div className="contact-success-state">
                            <div className="success-checkmark">
                                <i className="pi pi-check"></i>
                            </div>
                            <h3>Registration Sent!</h3>
                            <p>We'll look forward to seeing you there.</p>
                            <button onClick={onClose} className="success-reset">
                                Close <i className="pi pi-times"></i>
                            </button>
                        </div>
                    ) : (
                        <div>
                            {error && (
                                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <FormProvider {...methods}>
                                <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
                                    <div className="grid grid-cols-1 gap-3 !mt-3">
                                        <FormInput
                                            name="name"
                                            label="Full Name"
                                            showRequired
                                            inputClassName="connect-input"
                                            labelClassName="font-bold text-sm mb-1"
                                        />

                                        <FormInput
                                            name="email"
                                            label="Email Address"
                                            showRequired
                                            inputClassName="connect-input"
                                            labelClassName="font-bold text-sm mb-1"
                                        />

                                        <FormInput
                                            name="phone"
                                            label="Phone Number"
                                            placeholder="+1 234 567 8900"
                                            showRequired
                                            inputClassName="connect-input"
                                            labelClassName="font-bold text-sm mb-1"
                                        />
                                    </div>

                                    <button type="submit" className="connect-submit-btn mt-4" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <i className="pi pi-spin pi-spinner"></i>
                                        ) : (
                                            <>
                                                JOIN EVENT <i className="pi pi-check text-sm"></i>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </FormProvider>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
```

### 6.3 Full Example: ConnectFab.tsx (Multi-Form with Tab Switching)

**File: `src/components/landing/ConnectFab.tsx`**

```typescript
'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '@/components/forms/FormInput';
import { FormTextarea } from '@/components/forms/FormTextarea';
import { FormSelect } from '@/components/forms/FormSelect';
import { contactSchema, type ContactFormData } from '@/models/schemas/contact.schema';
import * as inquiryService from "@/services/inquiry.service";
import { ApiEvent, ApiEventStatus, ApiEventType, useApiEventStore } from '@/stores';

const FAB_TEXTS = ['CONNECT', 'PRAYER?', 'NEED HELP?'];

export function ConnectFab() {
    const apiEventStore = useApiEventStore();
    const [isOpen, setIsOpen] = useState(false);
    const [textIndex, setTextIndex] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<'prayer' | 'join'>('prayer');
    const pathname = usePathname();

    const methods = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        mode: 'onChange',
        defaultValues: {
            type: 'prayer',
            name: '',
            email: '',
            phone: '',
            message: '',
        },
    });

    const { handleSubmit, reset, setValue, clearErrors } = methods;

    const handleTabChange = (tab: 'prayer' | 'join') => {
        setActiveTab(tab);
        if (tab === 'prayer') {
            reset({
                type: 'prayer',
                name: '',
                email: '',
                phone: '',
                message: '',
            });
        } else {
            reset({
                type: 'join',
                name: '',
                email: '',
                phone: '',
                gender: '',
                facebook: '',
                instagram: '',
                address: '',
                joinReason: '',
            });
        }
        clearErrors();
    };



    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true);
        if (activeTab === 'prayer') {
            await inquiryService.submitPrayerRequest(data);
        } else if (activeTab === 'join') {
            await inquiryService.submitCellGroupJoinRequest(data);
        } else {
            // Simulate API call for 'join' tab or implement another service
            await new Promise((resolve) => setTimeout(resolve, 1500));
        }

    };

    // Close modal on route change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    // Event Listener for API responses
    useEffect(() => {
        const cleanup = getApiEvents();
        return () => {
            cleanup();
        };
    }, []);

    // Cycle FAB text
    useEffect(() => {
        const interval = setInterval(() => {
            setTextIndex((prev) => (prev + 1) % FAB_TEXTS.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    function getApiEvents() {
        const unsubscribe = apiEventStore.subscribe((event) => {
            if (!event) return;
            // Use the factory pattern to handle different event statuses

            const eventStatusHandleMap = createEventStatusHandleMap(event);
            const handleEvent = eventStatusHandleMap[event.status] || (() => { });
            handleEvent();
        });
        return () => {
            unsubscribe();
        };
    }

    function createEventStatusHandleMap(
        apiEvent: ApiEvent,
    ): { [key in ApiEventStatus]?: () => void } {
        return {
            [ApiEventStatus.COMPLETED]: () => {
                const eventTypeHandleMap: { [key in ApiEventType]?: () => void } = {
                    [ApiEventType.SUBMIT_PRAYER_REQUEST]: async () => {
                        setIsSubmitting(false);
                        setSubmitted(true);
                        reset();
                    },
                    [ApiEventType.SUBMIT_CELL_GROUP_JOIN]: async () => {
                        setIsSubmitting(false);
                        setSubmitted(true);
                        reset();
                    },
                };
                const handleEventType = eventTypeHandleMap[apiEvent.type] || (() => { });
                handleEventType();
            },
            [ApiEventStatus.ERROR]: () => {
                const eventTypeHandleMap: { [key in ApiEventType]?: () => void } = {
                    [ApiEventType.SUBMIT_PRAYER_REQUEST]: async () => {
                        setIsSubmitting(false);
                        setSubmitted(true);
                        reset();
                    },
                    [ApiEventType.SUBMIT_CELL_GROUP_JOIN]: async () => {
                        setIsSubmitting(false);
                        setSubmitted(true);
                        reset();
                    },
                };
                const handleEventType = eventTypeHandleMap[apiEvent.type] || (() => { });
                handleEventType();
            },
            [ApiEventStatus.IN_PROGRESS]: () => {
            },
            [ApiEventStatus.DEFAULT]: () => {
            }
        };
    };

    const toggleModal = () => {
        if (!isOpen) {
            setActiveTab('prayer');
            setSubmitted(false);
            reset({
                type: 'prayer',
                name: '',
                email: '',
                phone: '',
                message: '',
            });
            clearErrors();
        }
        setIsOpen(!isOpen);
    };

    const handleReset = () => {
        setSubmitted(false);
        reset();
    };

    return (
        <>
            <button
                className="connect-fab-btn"
                onClick={toggleModal}
                aria-label="Connect with us"
                style={{ minWidth: '140px', justifyContent: 'center' }}
            >
                <span key={textIndex} className="fab-text-changing" style={{ minWidth: '80px', textAlign: 'center' }}>
                    {FAB_TEXTS[textIndex]}
                </span>
                <i className={`pi ${isOpen ? 'pi-times' : 'pi-comment'}`} style={{ fontSize: '1.2rem', marginLeft: 'auto' }}></i>
            </button>

            <div className={`connect-modal-overlay ${isOpen ? 'open' : ''}`} onClick={(e) => {
                if (e.target === e.currentTarget) setIsOpen(false);
            }}>
                <div className="connect-modal-content">
                    <button className="connect-close-btn" onClick={() => setIsOpen(false)}>
                        <i className="pi pi-times"></i>
                    </button>

                    {/* Left Side - Image/Visual */}
                    <div className="connect-modal-left" style={{ backgroundImage: 'url("https://gtxngthtpisigkys.public.blob.vercel-storage.com/pray.jpg")' }}>
                        <div className="connect-modal-left-content">
                            <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">WE'RE HERE FOR YOU.</h2>
                            <p className="text-sm md:text-lg opacity-90">
                                Whether you have questions about faith, need prayer, or want to join a small group, we're just a message away.
                            </p>
                        </div>
                    </div>

                    {/* Right Side - Form & Options */}
                    <div className="connect-modal-right">
                        <div className="mb-6 md:mb-8">
                            <span className="text-xs font-bold text-yellow-600 tracking-widest uppercase mb-1 block">Connect With Us</span>
                            <h3 className="text-xl md:text-2xl font-bold text-navy-900 mb-2 md:mb-4 !mt-1" style={{ color: 'var(--color-navy)' }}>HOW CAN WE HELP?</h3>


                        </div>

                        {submitted ? (
                            <div className="contact-success-state">
                                <div className="success-checkmark">
                                    <i className="pi pi-check"></i>
                                </div>
                                <h3>Message Sent!</h3>
                                <p>We'll get back to you soon.</p>
                                <button onClick={handleReset} className="success-reset">
                                    Send another <i className="pi pi-arrow-right"></i>
                                </button>
                            </div>
                        ) : (
                            <div>
                                <div className="grid grid-cols-2 gap-3 mb-4 !mt-2">
                                    <div
                                        className={`relative cursor-pointer transition-all duration-300 border-2 rounded-2xl p-3 flex flex-col items-center justify-center gap-2 text-center h-24 md:h-28 ${activeTab === 'prayer' ? 'border-yellow-500 bg-white shadow-md' : 'border-gray-100 bg-white hover:border-yellow-200 hover:shadow-sm'}`}
                                        onClick={() => handleTabChange('prayer')}
                                    >
                                        {activeTab === 'prayer' && (
                                            <div className="absolute top-2 right-2 text-yellow-500">
                                                <i className="pi pi-check-circle lg:text-md"></i>
                                            </div>
                                        )}
                                        <div className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${activeTab === 'prayer' ? 'bg-yellow-500 text-white shadow-sm' : 'bg-gray-100 text-gray-400'}`}>
                                            <i className="pi pi-heart text-lg"></i>
                                        </div>
                                        <span className={`font-bold text-[10px] md:text-xs uppercase tracking-wider leading-tight ${activeTab === 'prayer' ? 'text-navy-900' : 'text-gray-400'}`}>
                                            Request<br className="md:hidden" /> Prayer
                                        </span>
                                    </div>

                                    <div
                                        className={`relative cursor-pointer transition-all duration-300 border-2 rounded-2xl p-3 flex flex-col items-center justify-center gap-2 text-center h-24 md:h-28 ${activeTab === 'join' ? 'border-yellow-500 bg-white shadow-md' : 'border-gray-100 bg-white hover:border-yellow-200 hover:shadow-sm'}`}
                                        onClick={() => handleTabChange('join')}
                                    >
                                        {activeTab === 'join' && (
                                            <div className="absolute top-2 right-2 text-yellow-500">
                                                <i className="pi pi-check-circle lg:text-md"></i>
                                            </div>
                                        )}
                                        <div className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${activeTab === 'join' ? 'bg-yellow-500 text-white shadow-sm' : 'bg-gray-100 text-gray-400'}`}>
                                            <i className="pi pi-users text-lg"></i>
                                        </div>
                                        <span className={`font-bold text-[10px] md:text-xs uppercase tracking-wider leading-tight ${activeTab === 'join' ? 'text-navy-900' : 'text-gray-400'}`}>
                                            Join A<br className="md:hidden" /> Group
                                        </span>
                                    </div>
                                </div>

                                <FormProvider {...methods}>
                                    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 !mt-3">
                                            <FormInput
                                                name="name"
                                                label="Full Name"
                                                showRequired
                                                inputClassName="connect-input"
                                                labelClassName="font-bold text-sm mb-1"
                                            />

                                            <FormInput
                                                name="email"
                                                label="Email Address"
                                                showRequired
                                                inputClassName="connect-input"
                                                labelClassName="font-bold text-sm mb-1"
                                            />

                                            <div className={activeTab === 'prayer' ? 'md:col-span-2' : ''}>
                                                <FormInput
                                                    name="phone"
                                                    label="Phone Number"
                                                    placeholder="+1 234 567 8900"
                                                    showRequired
                                                    inputClassName="connect-input"
                                                    labelClassName="font-bold text-sm mb-1"
                                                />
                                            </div>

                                            {activeTab === 'join' && (
                                                <>
                                                    <FormSelect
                                                        name="gender"
                                                        label="Gender"
                                                        placeholder="Select Gender"
                                                        options={[
                                                            { label: 'Male', value: 'Male' },
                                                            { label: 'Female', value: 'Female' }
                                                        ]}
                                                        showRequired
                                                        dropdownClassName="connect-select"
                                                        labelClassName="font-bold text-sm mb-1"
                                                    />

                                                    <FormInput
                                                        name="facebook"
                                                        label="Facebook Link/Handle"
                                                        inputClassName="connect-input"
                                                        labelClassName="font-bold text-sm mb-1"
                                                    />

                                                    <FormInput
                                                        name="instagram"
                                                        label="Instagram Link/Handle"
                                                        inputClassName="connect-input"
                                                        labelClassName="font-bold text-sm mb-1"
                                                    />
                                                    <div className="md:col-span-2">
                                                        <FormInput
                                                            name="address"
                                                            label="Address"
                                                            placeholder="123 Main St, City, Country"
                                                            showRequired
                                                            inputClassName="connect-input"
                                                            labelClassName="font-bold text-sm mb-1"
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <div className="w-full">
                                            {activeTab === 'prayer' ? (
                                                <FormTextarea
                                                    name="message"
                                                    label="Prayer Request"
                                                    placeholder="HOW CAN WE PRAY FOR YOU OR HELP YOU TODAY?"
                                                    rows={4}
                                                    showRequired
                                                    textareaClassName="connect-input"
                                                    labelClassName="font-bold text-sm mb-1"
                                                />
                                            ) : (
                                                <FormTextarea
                                                    name="joinReason"
                                                    label="Why do you want to join a cell group?"
                                                    placeholder="Tell us a bit about yourself and why you'd like to join..."
                                                    rows={4}
                                                    showRequired
                                                    textareaClassName="connect-input"
                                                    labelClassName="font-bold text-sm mb-1"
                                                />
                                            )}
                                        </div>

                                        {activeTab === 'join' && (
                                            <div className="text-center">
                                                <Link href="/ministries/community" onClick={() => setIsOpen(false)} className="inline-flex items-center gap-2 text-sm text-yellow-600 hover:text-yellow-700 font-bold uppercase tracking-wider transition-colors">
                                                    Check our Community <i className="pi pi-arrow-right"></i>
                                                </Link>
                                            </div>
                                        )}

                                        <button type="submit" className="connect-submit-btn" disabled={isSubmitting}>
                                            {isSubmitting ? (
                                                <i className="pi pi-spin pi-spinner"></i>
                                            ) : (
                                                <>
                                                    SEND MESSAGE <i className="pi pi-send text-sm"></i>
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </FormProvider>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
```

---

## 7. Form Patterns (Zod + React Hook Form)

### 7.1 Zod Schema Definitions

**File: `src/models/schemas/contact.schema.ts`**

```typescript
import { z } from 'zod';

const contactInfoSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
});

const baseSchema = contactInfoSchema.extend({
    phone: z.string().min(1, 'Phone number is required'),
});

const prayerSchema = baseSchema.extend({
    type: z.literal('prayer'),
    message: z.string().min(1, 'Prayer request is required'),
});

export const joinSchema = baseSchema.extend({
    type: z.literal('join'),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    gender: z.string().min(1, 'Gender is required'),
    address: z.string().min(1, 'Address is required'),
    joinReason: z.string().min(1, 'Please tell us why you want to join'),
});

export const simpleContactSchema = contactInfoSchema.extend({
    message: z.string().min(1, 'Message is required'),
});

export const contactSchema = z.discriminatedUnion('type', [
    prayerSchema,
    joinSchema,
]);

export type SimpleContactFormData = z.infer<typeof simpleContactSchema>;

export const eventContactSchema = contactInfoSchema.extend({
    phone: z.string().min(1, 'Phone number is required'),
    address: z.string().optional(),
    gender: z.string().optional(),
    facebook: z.string().optional(),
    message: z.string().optional(),
});

export type EventContactFormData = z.infer<typeof eventContactSchema>;

export type ContactFormData = z.infer<typeof contactSchema>;
```

### 7.2 Form Setup Pattern

```typescript
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { simpleContactSchema, type SimpleContactFormData } from '@/models/schemas/contact.schema';

// Inside component:
const methods = useForm<SimpleContactFormData>({
  resolver: zodResolver(simpleContactSchema),
  mode: 'onChange',  // Validate on every change
  defaultValues: {
    name: '',
    email: '',
    message: ''
  }
});

const { handleSubmit, reset, formState: { isSubmitting } } = methods;

// In JSX:
<FormProvider {...methods}>
  <form onSubmit={handleSubmit(onSubmit)}>
    <FormInput name="name" label="Name" />
    <FormInput name="email" label="Email" />
    <FormTextarea name="message" label="Message" />
    <button type="submit" disabled={isSubmitting}>Submit</button>
  </form>
</FormProvider>
```

---

## 8. Service Layer Patterns

### Inquiry Service

**File: `src/services/inquiry.service.ts`**

```typescript
import { apiClient } from "@/services/api-client"
import { ApiEventStatus, ApiEventType, useApiEventStore } from "@/stores";

export const submitQuery = async (data: any) => {
    const eventType = ApiEventType.SUBMIT_QUERY;
    const apiEventStore = useApiEventStore.getState();
    try {
        apiEventStore.sendEvent({ type: eventType, status: ApiEventStatus.IN_PROGRESS, spinner: true });
        await apiClient.post('/api/inquiry', data)
        apiEventStore.sendEvent({ type: eventType, status: ApiEventStatus.COMPLETED, spinner: true });
    } catch (error) {
        console.log(error);
    }
}

export const submitPrayerRequest = async (data: any) => {
    const eventType = ApiEventType.SUBMIT_PRAYER_REQUEST;
    const apiEventStore = useApiEventStore.getState();
    try {
        apiEventStore.sendEvent({ type: eventType, status: ApiEventStatus.IN_PROGRESS, spinner: true });
        await apiClient.post('/api/inquiry/prayer-requests', data)
        apiEventStore.sendEvent({ type: eventType, status: ApiEventStatus.COMPLETED, spinner: true });
    } catch (error) {
        console.log(error);
        apiEventStore.sendEvent({ type: eventType, status: ApiEventStatus.ERROR, spinner: false });
    }
}

export const submitCellGroupJoinRequest = async (data: any) => {
    const eventType = ApiEventType.SUBMIT_CELL_GROUP_JOIN;
    const apiEventStore = useApiEventStore.getState();
    try {
        apiEventStore.sendEvent({ type: eventType, status: ApiEventStatus.IN_PROGRESS, spinner: true });
        await apiClient.post('/api/inquiry/cell-groups', data)
        apiEventStore.sendEvent({ type: eventType, status: ApiEventStatus.COMPLETED, spinner: true });
    } catch (error) {
        console.log(error);
        apiEventStore.sendEvent({ type: eventType, status: ApiEventStatus.ERROR, spinner: false });
    }
}

export const submitEventInquiry = async (data: any, slug: string) => {
    const eventType = ApiEventType.SUBMIT_EVENT_INQUIRY;
    const apiEventStore = useApiEventStore.getState();
    try {
        apiEventStore.sendEvent({ type: eventType, status: ApiEventStatus.IN_PROGRESS, spinner: true });
        await apiClient.post(`/api/event/${slug}`, data)
        apiEventStore.sendEvent({ type: eventType, status: ApiEventStatus.COMPLETED, spinner: true });
    } catch (error) {
        console.log(error);
        apiEventStore.sendEvent({ type: eventType, status: ApiEventStatus.ERROR, spinner: false });
    }
}
```

### Service Pattern Summary

1. **Get event type constant** from `ApiEventType` enum
2. **Get store state** via `useApiEventStore.getState()`
3. **Send IN_PROGRESS event** before API call
4. **Make API call** via `apiClient`
5. **Send COMPLETED event** on success
6. **Send ERROR event** on failure (in catch block)

---

## 9. Reusable Form Components

### 9.1 FormInput Component

**File: `src/components/forms/FormInput.tsx`**

```typescript
'use client';

import React, { useId } from 'react';
import { InputText } from 'primereact/inputtext';
import { Controller, useFormContext } from 'react-hook-form';
import FormError from './FormError';
import './styles/form-input.css';

// Input processing utilities
interface InputProcessingOptions {
  enableOnlyInteger?: boolean;
  enablePhoneNumberFormat?: boolean;
  enableAllowNumbersSpacesPlusDash?: boolean;
  enableCreditCardInputFormat?: boolean;
}

const getNestedError = (errors: Record<string, unknown>, path: string): string | undefined => {
  const parts = path.split('.');
  let current: Record<string, unknown> = errors;

  for (const part of parts) {
    if (!current[part]) return undefined;
    current = current[part] as Record<string, unknown>;
  }

  return (current as { message?: string }).message;
};

/**
 * Validates if the input contains only integers
 * @returns true if valid, false if invalid
 */
const validateIntegerOnly = (value: string): boolean => {
  return value === '' || /^[0-9]+$/.test(value);
};

/**
 * Formats a string as a phone number
 */
const formatPhoneNumber = (value: string): string => {
  // Remove all non-digits
  let input = value.replace(/\D/g, '');

  // Ensure it starts with '+' sign
  if (!value.startsWith('+')) {
    input = '+' + input;
  }

  // Format the input as a phone number with country code
  let formattedInput = '';
  if (input.length > 1) {
    formattedInput = `${input.slice(0, 3)}`; // Country code (+XX)
    if (input.length > 3) {
      formattedInput += ` ${input.slice(3, 6)}`; // First part of the number
      if (input.length > 6) {
        formattedInput += ` ${input.slice(6, 10)}`; // Second part of the number
        if (input.length > 10) {
          formattedInput += ` ${input.slice(10, 14)}`; // Third part of the number
        } else {
          formattedInput += input.slice(10);
        }
      } else {
        formattedInput += input.slice(6);
      }
    } else {
      formattedInput += input.slice(3);
    }
  } else {
    formattedInput = input;
  }

  return formattedInput;
};

/**
 * Formats a string to allow only numbers, spaces, plus signs, and dashes
 */
const formatAllowNumbersSpacesPlusDash = (value: string): string => {
  return value.replace(/[^0-9 \-+]/g, '');
};

const formatCreditCardInputFormat = (value: string): string => {
  const formatted = value.replace(/\D/g, '');
  return formatted.replace(/(\d{1,4})/g, '$1 ').trim();
};

/**
 * Process input through validation and formatting pipeline
 * @returns formatted value or null if validation fails
 */
const processInput = (value: string, options: InputProcessingOptions): string | null => {
  let processedValue = value;

  // Validation phase - return null if validation fails
  if (options.enableOnlyInteger && !validateIntegerOnly(value)) {
    return null;
  }

  // Formatting phase - apply formatters in sequence
  if (options.enablePhoneNumberFormat) {
    processedValue = formatPhoneNumber(processedValue);
  }

  if (options.enableAllowNumbersSpacesPlusDash) {
    processedValue = formatAllowNumbersSpacesPlusDash(processedValue);
  }

  if (options.enableCreditCardInputFormat) {
    processedValue = formatCreditCardInputFormat(processedValue);
  }

  return processedValue;
};

interface FormInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  showSpinner?: boolean;
  enableOnlyInteger?: boolean;
  readonly?: boolean;
  showRequired?: boolean;
  showLabel?: boolean;
  displayDisabled?: boolean;
  showRightIcon?: boolean;
  rightIcon?: string;
  enablePhoneNumberFormat?: boolean;
  enableAllowNumbersSpacesPlusDash?: boolean;
  enableCreditCardInputFormat?: boolean;
  className?: string; // Container custom class
  inputClassName?: string; // Input element custom class
  labelClassName?: string; // Label custom class
  isFloating?: boolean; // Enable floating label mode
}

export const FormInput = React.memo<FormInputProps>(({
  name,
  label,
  placeholder,
  enableOnlyInteger = false,
  readonly = false,
  showRequired = false,
  showLabel = true,
  displayDisabled = false,
  showRightIcon = false,
  enablePhoneNumberFormat = false,
  enableAllowNumbersSpacesPlusDash = false,
  enableCreditCardInputFormat = false,
  className = '',
  inputClassName = '',
  labelClassName = '',
  isFloating = false,
}) => {
  const { control, formState: { errors } } = useFormContext();



  const error = getNestedError(errors, name);
  const reactId = useId();
  const uniqueId = `${name}-${reactId}`;

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    field: { onChange: (value: string) => void; onBlur: () => void }
  ) => {
    const value = e.clipboardData.getData('text/plain');
    const processedValue = processInput(value, {
      enableOnlyInteger,
      enablePhoneNumberFormat,
      enableAllowNumbersSpacesPlusDash,
      enableCreditCardInputFormat,
    });

    if (processedValue !== null) {
      field.onChange(processedValue);
      setTimeout(() => {
        field.onBlur();
      }, 0);
    }

    e.preventDefault();
  };

  return (
    <div className={`grid grid-cols-12 gap-0 ${className}`}>
      {showLabel && label && !isFloating && (
        <label htmlFor={uniqueId} className={`col-span-12 ${labelClassName}`}>
          {label}
          {showRequired && <span className="form-required">*</span>}
        </label>
      )}

      <div className="col-span-12 input-container">
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState }) => (
            <span className="p-input-icon-right w-100 flex relative">
              {showRightIcon && (
                <span className="p-inputgroup-addon">
                  <i className="pi pi-user"></i>
                </span>
              )}

              <InputText
                className={`w-100 ${fieldState.invalid ? 'p-invalid' : ''} ${displayDisabled ? 'disable' : ''} ${inputClassName}`}
                value={field.value || ''}
                onPaste={(e) => handlePaste(e, field)}
                onChange={(e) => {
                  const value = e.target.value;
                  const processedValue = processInput(value, {
                    enableOnlyInteger,
                    enablePhoneNumberFormat,
                    enableAllowNumbersSpacesPlusDash,
                    enableCreditCardInputFormat,
                  });

                  if (processedValue !== null) {
                    field.onChange(processedValue);
                  }
                }}
                onBlur={field.onBlur}
                placeholder={placeholder}
                readOnly={readonly}
                id={uniqueId}
                name={uniqueId}
                autoComplete="off"
              />
              {isFloating && label && (
                <label htmlFor={uniqueId} className={labelClassName}>
                  {label}
                </label>
              )}
            </span>
          )}
        />
        {error && <FormError error={error} />}
      </div>
    </div>
  );
});

FormInput.displayName = 'FormInput';

export default FormInput;
```

### 9.2 FormTextarea Component

**File: `src/components/forms/FormTextarea.tsx`**

```typescript
'use client';

import React, { useId } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { InputTextarea } from 'primereact/inputtextarea';
import FormError from './FormError';
import './styles/form-input.css';

interface FormTextareaProps {
  name: string;
  label?: string;
  placeholder?: string;
  showRequired?: boolean;
  showLabel?: boolean;
  displayDisabled?: boolean;
  readonly?: boolean;
  rows?: number;
  cols?: number;
  autoResize?: boolean;
  maxLength?: number;
  showCount?: boolean;
  className?: string;
  textareaClassName?: string;
  labelClassName?: string;
  isFloating?: boolean;
}

const getNestedError = (errors: Record<string, unknown>, path: string): string | undefined => {
  const parts = path.split('.');
  let current: Record<string, unknown> = errors;

  for (const part of parts) {
    if (!current[part]) return undefined;
    current = current[part] as Record<string, unknown>;
  }

  return (current as { message?: string }).message;
};

export const FormTextarea = React.memo<FormTextareaProps>(({
  name,
  label,
  placeholder,
  showRequired = false,
  showLabel = true,
  displayDisabled = false,
  readonly = false,
  rows = 4,
  cols,
  autoResize = false,
  maxLength,
  showCount = false,
  className = '',
  textareaClassName = '',
  labelClassName = '',
  isFloating = false,
}) => {
  const { control, formState: { errors } } = useFormContext();



  const error = getNestedError(errors, name);
  const reactId = useId();
  const uniqueId = `${name}-${reactId}`;

  return (
    <div className={`grid grid-cols-12 gap-0 ${className}`}>
      {showLabel && label && !isFloating && (
        <label htmlFor={uniqueId} className={`col-span-12 ${labelClassName}`}>
          {label}
          {showRequired && <span className="form-required">*</span>}
        </label>
      )}

      <div className="col-span-12 input-container">
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState }) => {
            const currentLength = (field.value as string)?.length || 0;

            return (
              <>
                <InputTextarea
                  id={uniqueId}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  placeholder={placeholder}
                  rows={rows}
                  cols={cols}
                  autoResize={autoResize}
                  maxLength={maxLength}
                  className={`w-full ${fieldState.invalid ? 'p-invalid' : ''} ${displayDisabled ? 'disable' : ''} ${textareaClassName}`}
                  readOnly={readonly}
                  name={uniqueId}
                  style={{ width: '100%' }}
                />

                {showCount && maxLength && (
                  <div className="text-right">
                    <small className="text-gray-500">
                      {currentLength}/{maxLength}
                    </small>
                  </div>
                )}

                {isFloating && label && (
                  <label htmlFor={uniqueId} className={labelClassName}>
                    {label}
                  </label>
                )}
              </>
            );
          }}
        />
        {error && <FormError error={error} />}
      </div>
    </div>
  );
});

FormTextarea.displayName = 'FormTextarea';

export default FormTextarea;
```

### 9.3 FormError Component

**File: `src/components/forms/FormError.tsx`**

```typescript
'use client';

import React from 'react';

const FormError: React.FC<{ error?: string }> = ({ error }) => {
    if (!error) return null;

    return (
      <small className="p-error block mt-2">{error}</small>
    );
};

export default FormError;
```

### 9.4 Form Components Index (Barrel Export)

**File: `src/components/forms/index.ts`**

```typescript
/**
 * Form components barrel export
 */

export { FormInput } from './FormInput';
export { FormInputNumber } from './FormInputNumber';
export { FormSelect } from './FormSelect';
export { FormPassword } from './FormPassword';
export { FormCalendar, CalendarViewType } from './FormCalendar';
export { FormTextarea } from './FormTextarea';
export { FormCheckbox } from './FormCheckbox';
export { FormRadioButton } from './FormRadioButton';
export { default as FormError } from './FormError';
```

---

## Summary

This project implements a modern, full-stack Next.js application with:

1. **Publisher-Subscriber Pattern** for API event handling via Zustand
2. **Factory Pattern** for mapping event statuses to handlers in components
3. **Singleton API Client** with interceptors, token refresh, and loading state integration
4. **Zod + React Hook Form** for type-safe form validation
5. **Reusable Form Components** with PrimeReact integration
6. **httpOnly Cookie Authentication** for secure token management
7. **Route Groups** for organized routing with authentication middleware
8. **TypeScript Path Aliases** for clean imports

The architecture ensures separation of concerns, type safety, and maintainable code patterns across the entire codebase.
