# Testing Workflow Guide

A comprehensive testing strategy for `gwc-monitoring-nextjs` covering unit testing, integration testing, and E2E testing with Playwright.

---

## Table of Contents

1. [Testing Stack Overview](#testing-stack-overview)
2. [Initial Setup](#initial-setup)
3. [Project Structure](#project-structure)
4. [Unit Testing Workflow](#unit-testing-workflow)
5. [Component Testing Patterns](#component-testing-patterns)
6. [Hook Testing Patterns](#hook-testing-patterns)
7. [Service Testing Patterns](#service-testing-patterns)
8. [Store Testing Patterns](#store-testing-patterns)
9. [Form Testing Patterns](#form-testing-patterns)
10. [Playwright E2E Testing](#playwright-e2e-testing)
11. [Standard Workflow: New Page Implementation](#standard-workflow-new-page-implementation)
12. [Mock Strategies](#mock-strategies)
13. [CI/CD Integration](#cicd-integration)

---

## Testing Stack Overview

| Layer | Tool | Purpose |
|-------|------|---------|
| Unit Tests | Vitest | Fast unit testing with TypeScript support |
| Component Tests | React Testing Library | Component behavior testing |
| E2E Tests | Playwright | Full browser automation |
| Mocking | MSW (Mock Service Worker) | API mocking for tests |
| Coverage | Vitest Coverage | Code coverage reports |

---

## Initial Setup

### 1. Install Dependencies

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event msw
```

### 2. Create Vitest Configuration

Create `vitest.config.ts` in the project root:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./src/test/setup.ts'],
        include: ['src/**/*.{test,spec}.{ts,tsx}'],
        exclude: ['node_modules', 'e2e'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'src/test/',
                '**/*.d.ts',
                '**/*.config.*',
                '**/types/**',
            ],
        },
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
```

### 3. Create Test Setup File

Create `src/test/setup.ts`:

```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll, vi } from 'vitest';
import { server } from './mocks/server';

// Cleanup after each test
afterEach(() => {
    cleanup();
});

// MSW Server Setup
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock Next.js router
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        prefetch: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
    }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
    useParams: () => ({}),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});
```

### 4. Create MSW Handlers

Create `src/test/mocks/handlers.ts`:

```typescript
import { http, HttpResponse } from 'msw';
import { config } from '@/core/config';

const API_BASE = config.api.url;

export const handlers = [
    // Auth handlers
    http.post(`${API_BASE}/auth`, async ({ request }) => {
        const body = await request.json();
        if (body.email === 'test@example.com') {
            return HttpResponse.json({
                data: {
                    id: '1',
                    email: 'test@example.com',
                    firstName: 'Test',
                    lastName: 'User',
                },
            });
        }
        return HttpResponse.json(
            { error: 'Invalid credentials' },
            { status: 401 }
        );
    }),

    // Add more handlers as needed
];
```

Create `src/test/mocks/server.ts`:

```typescript
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

### 5. Add Package.json Scripts

```json
{
    "scripts": {
        "test": "vitest",
        "test:ui": "vitest --ui",
        "test:run": "vitest run",
        "test:coverage": "vitest run --coverage",
        "test:e2e": "playwright test",
        "test:e2e:ui": "playwright test --ui",
        "test:all": "npm run test:run && npm run test:e2e"
    }
}
```

---

## Project Structure

```
src/
├── test/                          # Test utilities & setup
│   ├── setup.ts                   # Global test setup
│   ├── test-utils.tsx             # Custom render & utilities
│   ├── mocks/
│   │   ├── handlers.ts            # MSW request handlers
│   │   ├── server.ts              # MSW server instance
│   │   └── data/                  # Mock data fixtures
│   │       ├── users.ts
│   │       ├── events.ts
│   │       └── churches.ts
│   └── factories/                 # Test data factories
│       ├── user.factory.ts
│       └── event.factory.ts
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   └── Button.test.tsx        # Co-located tests
│   └── forms/
│       ├── FormInput.tsx
│       └── FormInput.test.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useAuth.test.ts
├── services/
│   ├── auth.service.ts
│   └── auth.service.test.ts
├── stores/
│   ├── user.store.ts
│   └── user.store.test.ts
└── app/
    └── (public)/
        └── events/
            ├── page.tsx
            └── page.test.tsx
```

---

## Unit Testing Workflow

### Test File Naming Convention

| File Type | Test File Name |
|-----------|----------------|
| `Button.tsx` | `Button.test.tsx` |
| `useAuth.ts` | `useAuth.test.ts` |
| `auth.service.ts` | `auth.service.test.ts` |
| `user.store.ts` | `user.store.test.ts` |
| `page.tsx` | `page.test.tsx` |

### Test Structure Template

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('ComponentName', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('rendering', () => {
        it('should render default state', () => {});
        it('should render with custom props', () => {});
    });

    describe('interactions', () => {
        it('should handle click events', () => {});
        it('should handle form submission', () => {});
    });

    describe('edge cases', () => {
        it('should handle empty data', () => {});
        it('should handle errors', () => {});
    });
});
```

---

## Component Testing Patterns

### Create Custom Render Utility

Create `src/test/test-utils.tsx`:

```typescript
import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';

// Wrapper with all providers
const AllProviders = ({ children }: { children: ReactNode }) => {
    return <>{children}</>;
};

// Form wrapper for form components
const FormWrapper = ({ children, defaultValues = {} }: {
    children: ReactNode;
    defaultValues?: Record<string, unknown>;
}) => {
    const methods = useForm({ defaultValues });
    return <FormProvider {...methods}>{children}</FormProvider>;
};

// Custom render with providers
const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>
) => {
    return {
        user: userEvent.setup(),
        ...render(ui, { wrapper: AllProviders, ...options }),
    };
};

// Render with form context
const renderWithForm = (
    ui: ReactElement,
    { defaultValues = {}, ...options }: RenderOptions & { defaultValues?: Record<string, unknown> } = {}
) => {
    return {
        user: userEvent.setup(),
        ...render(ui, {
            wrapper: ({ children }) => (
                <FormWrapper defaultValues={defaultValues}>{children}</FormWrapper>
            ),
            ...options,
        }),
    };
};

export * from '@testing-library/react';
export { customRender as render, renderWithForm, userEvent };
```

### Basic Component Test

```typescript
// src/components/ui/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { Button } from './Button';

describe('Button', () => {
    it('should render with text', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('should call onClick when clicked', async () => {
        const handleClick = vi.fn();
        const { user } = render(<Button onClick={handleClick}>Click me</Button>);

        await user.click(screen.getByRole('button'));

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should be disabled when disabled prop is true', () => {
        render(<Button disabled>Click me</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should show loading state', () => {
        render(<Button loading>Submit</Button>);
        expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    });
});
```

### Card Component Test

```typescript
// src/components/cards/EventCard.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { EventCard } from './EventCard';
import { createMockEvent } from '@/test/factories/event.factory';

describe('EventCard', () => {
    const mockEvent = createMockEvent({
        title: 'Sunday Service',
        date: '2025-01-26',
        time: '10:00 AM',
        location: 'Main Campus',
    });

    it('should render event details', () => {
        render(<EventCard event={mockEvent} />);

        expect(screen.getByText('Sunday Service')).toBeInTheDocument();
        expect(screen.getByText('10:00 AM')).toBeInTheDocument();
        expect(screen.getByText('Main Campus')).toBeInTheDocument();
    });

    it('should show featured badge when event is featured', () => {
        const featuredEvent = createMockEvent({ isFeatured: true });
        render(<EventCard event={featuredEvent} />);

        expect(screen.getByText(/featured/i)).toBeInTheDocument();
    });

    it('should render image with alt text', () => {
        render(<EventCard event={mockEvent} />);

        const image = screen.getByRole('img');
        expect(image).toHaveAttribute('alt', expect.stringContaining(mockEvent.title));
    });
});
```

---

## Hook Testing Patterns

### Create Hook Test Utility

```typescript
// src/test/hook-utils.ts
import { renderHook, act } from '@testing-library/react';
import { ReactNode } from 'react';

export { renderHook, act };

// Wrapper for hooks that need providers
export const createWrapper = (providers: ReactNode[] = []) => {
    return ({ children }: { children: ReactNode }) => {
        return providers.reduce(
            (acc, Provider) => <>{Provider}{acc}</>,
            <>{children}</>
        );
    };
};
```

### Testing useAuth Hook

```typescript
// src/hooks/useAuth.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth } from './useAuth';
import { useUserStore } from '@/stores/user.store';
import * as authService from '@/services/auth.service';

// Mock the store
vi.mock('@/stores/user.store', () => ({
    useUserStore: vi.fn(),
}));

// Mock the service
vi.mock('@/services/auth.service', () => ({
    authenticate: vi.fn(),
    logout: vi.fn(),
}));

describe('useAuth', () => {
    const mockUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (useUserStore as unknown as vi.Mock).mockReturnValue({
            user: null,
            isAuthenticated: false,
            setUser: vi.fn(),
            clearUser: vi.fn(),
        });
    });

    describe('initial state', () => {
        it('should return unauthenticated state by default', () => {
            const { result } = renderHook(() => useAuth());

            expect(result.current.isAuthenticated).toBe(false);
            expect(result.current.user).toBeNull();
        });

        it('should return authenticated state when user exists', () => {
            (useUserStore as unknown as vi.Mock).mockReturnValue({
                user: mockUser,
                isAuthenticated: true,
            });

            const { result } = renderHook(() => useAuth());

            expect(result.current.isAuthenticated).toBe(true);
            expect(result.current.user).toEqual(mockUser);
        });
    });

    describe('login', () => {
        it('should call authenticate service with credentials', async () => {
            (authService.authenticate as vi.Mock).mockResolvedValue(true);

            const { result } = renderHook(() => useAuth());

            await act(async () => {
                await result.current.login({
                    email: 'test@example.com',
                    password: 'password123',
                });
            });

            expect(authService.authenticate).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            });
        });

        it('should handle login failure', async () => {
            (authService.authenticate as vi.Mock).mockRejectedValue(
                new Error('Invalid credentials')
            );

            const { result } = renderHook(() => useAuth());

            await expect(
                act(async () => {
                    await result.current.login({
                        email: 'wrong@example.com',
                        password: 'wrong',
                    });
                })
            ).rejects.toThrow('Invalid credentials');
        });
    });

    describe('hasRole', () => {
        it('should return true when user has required role', () => {
            (useUserStore as unknown as vi.Mock).mockReturnValue({
                user: { ...mockUser, role: 'ADMIN' },
                isAuthenticated: true,
            });

            const { result } = renderHook(() => useAuth());

            expect(result.current.hasRole(['ADMIN', 'SUPER_ADMIN'])).toBe(true);
        });

        it('should return false when user lacks required role', () => {
            (useUserStore as unknown as vi.Mock).mockReturnValue({
                user: { ...mockUser, role: 'USER' },
                isAuthenticated: true,
            });

            const { result } = renderHook(() => useAuth());

            expect(result.current.hasRole(['ADMIN'])).toBe(false);
        });
    });
});
```

### Testing usePagination Hook

```typescript
// src/hooks/usePagination.test.ts
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePagination } from './usePagination';

describe('usePagination', () => {
    it('should initialize with default values', () => {
        const { result } = renderHook(() => usePagination({ totalItems: 100 }));

        expect(result.current.currentPage).toBe(1);
        expect(result.current.pageSize).toBe(10);
        expect(result.current.totalPages).toBe(10);
    });

    it('should calculate correct page range', () => {
        const { result } = renderHook(() =>
            usePagination({ totalItems: 50, pageSize: 10 })
        );

        expect(result.current.startIndex).toBe(0);
        expect(result.current.endIndex).toBe(9);
    });

    it('should navigate to next page', () => {
        const { result } = renderHook(() =>
            usePagination({ totalItems: 100, pageSize: 10 })
        );

        act(() => {
            result.current.goToNextPage();
        });

        expect(result.current.currentPage).toBe(2);
    });

    it('should not exceed total pages', () => {
        const { result } = renderHook(() =>
            usePagination({ totalItems: 20, pageSize: 10, initialPage: 2 })
        );

        act(() => {
            result.current.goToNextPage();
        });

        expect(result.current.currentPage).toBe(2); // Should stay at 2
    });
});
```

---

## Service Testing Patterns

### Testing API Service

```typescript
// src/services/auth.service.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authenticate, logout } from './auth.service';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { config } from '@/core/config';

describe('auth.service', () => {
    describe('authenticate', () => {
        it('should successfully authenticate with valid credentials', async () => {
            const result = await authenticate({
                email: 'test@example.com',
                password: 'password123',
            });

            expect(result).toBe(true);
        });

        it('should throw error with invalid credentials', async () => {
            server.use(
                http.post(`${config.api.url}/auth`, () => {
                    return HttpResponse.json(
                        { error: 'Invalid credentials' },
                        { status: 401 }
                    );
                })
            );

            await expect(
                authenticate({
                    email: 'wrong@example.com',
                    password: 'wrong',
                })
            ).rejects.toThrow();
        });

        it('should handle network errors', async () => {
            server.use(
                http.post(`${config.api.url}/auth`, () => {
                    return HttpResponse.error();
                })
            );

            await expect(
                authenticate({
                    email: 'test@example.com',
                    password: 'password123',
                })
            ).rejects.toThrow();
        });
    });

    describe('logout', () => {
        it('should clear user session', async () => {
            server.use(
                http.post(`${config.api.url}/auth/logout`, () => {
                    return HttpResponse.json({ success: true });
                })
            );

            await expect(logout()).resolves.not.toThrow();
        });
    });
});
```

### Testing Member Service

```typescript
// src/services/member.service.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { getMembers, createMember, updateMember, deleteMember } from './member.service';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { config } from '@/core/config';
import { createMockMember } from '@/test/factories/member.factory';

describe('member.service', () => {
    describe('getMembers', () => {
        it('should fetch paginated members list', async () => {
            const mockMembers = [
                createMockMember({ id: '1' }),
                createMockMember({ id: '2' }),
            ];

            server.use(
                http.get(`${config.api.url}/members`, () => {
                    return HttpResponse.json({
                        data: mockMembers,
                        total: 2,
                        page: 1,
                        pageSize: 10,
                    });
                })
            );

            const result = await getMembers({ page: 1, pageSize: 10 });

            expect(result.data).toHaveLength(2);
            expect(result.total).toBe(2);
        });

        it('should handle search filters', async () => {
            server.use(
                http.get(`${config.api.url}/members`, ({ request }) => {
                    const url = new URL(request.url);
                    const search = url.searchParams.get('search');

                    if (search === 'John') {
                        return HttpResponse.json({
                            data: [createMockMember({ firstName: 'John' })],
                            total: 1,
                        });
                    }
                    return HttpResponse.json({ data: [], total: 0 });
                })
            );

            const result = await getMembers({ search: 'John' });

            expect(result.data[0].firstName).toBe('John');
        });
    });

    describe('createMember', () => {
        it('should create new member and return created data', async () => {
            const newMember = {
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane@example.com',
            };

            server.use(
                http.post(`${config.api.url}/members`, async ({ request }) => {
                    const body = await request.json();
                    return HttpResponse.json({
                        data: { id: '123', ...body },
                    }, { status: 201 });
                })
            );

            const result = await createMember(newMember);

            expect(result.data.id).toBe('123');
            expect(result.data.firstName).toBe('Jane');
        });

        it('should handle validation errors', async () => {
            server.use(
                http.post(`${config.api.url}/members`, () => {
                    return HttpResponse.json({
                        error: 'Validation failed',
                        details: { email: 'Email is required' },
                    }, { status: 400 });
                })
            );

            await expect(
                createMember({ firstName: 'Jane', lastName: 'Doe' })
            ).rejects.toThrow();
        });
    });
});
```

---

## Store Testing Patterns

### Testing Zustand Store

```typescript
// src/stores/user.store.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useUserStore } from './user.store';
import { act } from '@testing-library/react';

describe('user.store', () => {
    beforeEach(() => {
        // Reset store state before each test
        const { clearUser } = useUserStore.getState();
        clearUser();
    });

    describe('initial state', () => {
        it('should have null user by default', () => {
            const state = useUserStore.getState();

            expect(state.user).toBeNull();
            expect(state.isAuthenticated).toBe(false);
        });
    });

    describe('setUser', () => {
        it('should set user and mark as authenticated', () => {
            const mockUser = {
                id: '1',
                email: 'test@example.com',
                firstName: 'Test',
                lastName: 'User',
            };

            act(() => {
                useUserStore.getState().setUser(mockUser);
            });

            const state = useUserStore.getState();
            expect(state.user).toEqual(mockUser);
            expect(state.isAuthenticated).toBe(true);
        });
    });

    describe('updateUser', () => {
        it('should partially update user data', () => {
            const mockUser = {
                id: '1',
                email: 'test@example.com',
                firstName: 'Test',
                lastName: 'User',
            };

            act(() => {
                useUserStore.getState().setUser(mockUser);
                useUserStore.getState().updateUser({ firstName: 'Updated' });
            });

            const state = useUserStore.getState();
            expect(state.user?.firstName).toBe('Updated');
            expect(state.user?.lastName).toBe('User'); // Unchanged
        });
    });

    describe('clearUser', () => {
        it('should clear user and mark as unauthenticated', () => {
            const mockUser = {
                id: '1',
                email: 'test@example.com',
                firstName: 'Test',
                lastName: 'User',
            };

            act(() => {
                useUserStore.getState().setUser(mockUser);
                useUserStore.getState().clearUser();
            });

            const state = useUserStore.getState();
            expect(state.user).toBeNull();
            expect(state.isAuthenticated).toBe(false);
        });
    });

    describe('logout', () => {
        it('should clear user and redirect', () => {
            act(() => {
                useUserStore.getState().setUser({
                    id: '1',
                    email: 'test@example.com',
                });
                useUserStore.getState().logout();
            });

            const state = useUserStore.getState();
            expect(state.user).toBeNull();
            expect(state.isAuthenticated).toBe(false);
        });
    });
});
```

### Testing Loading Store

```typescript
// src/stores/loading.store.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useLoadingStore } from './loading.store';
import { act } from '@testing-library/react';

describe('loading.store', () => {
    beforeEach(() => {
        // Reset the store
        const store = useLoadingStore.getState();
        while (store.isLoading) {
            store.decrementRequests();
        }
    });

    describe('incrementRequests', () => {
        it('should set isLoading to true', () => {
            act(() => {
                useLoadingStore.getState().incrementRequests();
            });

            expect(useLoadingStore.getState().isLoading).toBe(true);
        });
    });

    describe('decrementRequests', () => {
        it('should set isLoading to false when all requests complete', () => {
            act(() => {
                useLoadingStore.getState().incrementRequests();
                useLoadingStore.getState().decrementRequests();
            });

            expect(useLoadingStore.getState().isLoading).toBe(false);
        });

        it('should keep isLoading true with pending requests', () => {
            act(() => {
                useLoadingStore.getState().incrementRequests();
                useLoadingStore.getState().incrementRequests();
                useLoadingStore.getState().decrementRequests();
            });

            expect(useLoadingStore.getState().isLoading).toBe(true);
        });
    });
});
```

---

## Form Testing Patterns

### Testing Form Input Component

```typescript
// src/components/forms/FormInput.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { renderWithForm, screen, waitFor } from '@/test/test-utils';
import { FormInput } from './FormInput';

describe('FormInput', () => {
    it('should render with label', () => {
        renderWithForm(
            <FormInput name="email" label="Email Address" />,
            { defaultValues: { email: '' } }
        );

        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    });

    it('should display placeholder text', () => {
        renderWithForm(
            <FormInput
                name="email"
                label="Email"
                placeholder="Enter your email"
            />,
            { defaultValues: { email: '' } }
        );

        expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    });

    it('should update value on input', async () => {
        const { user } = renderWithForm(
            <FormInput name="email" label="Email" />,
            { defaultValues: { email: '' } }
        );

        const input = screen.getByLabelText(/email/i);
        await user.type(input, 'test@example.com');

        expect(input).toHaveValue('test@example.com');
    });

    it('should format phone number when enablePhoneNumberFormat is true', async () => {
        const { user } = renderWithForm(
            <FormInput
                name="phone"
                label="Phone"
                enablePhoneNumberFormat
            />,
            { defaultValues: { phone: '' } }
        );

        const input = screen.getByLabelText(/phone/i);
        await user.type(input, '1234567890');

        expect(input).toHaveValue('(123) 456-7890');
    });

    it('should only allow integers when enableOnlyInteger is true', async () => {
        const { user } = renderWithForm(
            <FormInput
                name="age"
                label="Age"
                enableOnlyInteger
            />,
            { defaultValues: { age: '' } }
        );

        const input = screen.getByLabelText(/age/i);
        await user.type(input, 'abc123def');

        expect(input).toHaveValue('123');
    });

    it('should show error message when validation fails', async () => {
        renderWithForm(
            <FormInput
                name="email"
                label="Email"
                error={{ message: 'Email is required' }}
            />,
            { defaultValues: { email: '' } }
        );

        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
});
```

### Testing Complete Form

```typescript
// src/components/forms/ContactForm.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import { ContactForm } from './ContactForm';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';

describe('ContactForm', () => {
    const onSuccess = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render all form fields', () => {
        render(<ContactForm onSuccess={onSuccess} />);

        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    it('should show validation errors for empty submission', async () => {
        const { user } = render(<ContactForm onSuccess={onSuccess} />);

        await user.click(screen.getByRole('button', { name: /submit/i }));

        await waitFor(() => {
            expect(screen.getByText(/name is required/i)).toBeInTheDocument();
            expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        });
    });

    it('should show validation error for invalid email', async () => {
        const { user } = render(<ContactForm onSuccess={onSuccess} />);

        await user.type(screen.getByLabelText(/name/i), 'John Doe');
        await user.type(screen.getByLabelText(/email/i), 'invalid-email');
        await user.type(screen.getByLabelText(/message/i), 'Test message');
        await user.click(screen.getByRole('button', { name: /submit/i }));

        await waitFor(() => {
            expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
        });
    });

    it('should submit form with valid data', async () => {
        server.use(
            http.post('/api/inquiry', () => {
                return HttpResponse.json({ success: true });
            })
        );

        const { user } = render(<ContactForm onSuccess={onSuccess} />);

        await user.type(screen.getByLabelText(/name/i), 'John Doe');
        await user.type(screen.getByLabelText(/email/i), 'john@example.com');
        await user.type(screen.getByLabelText(/message/i), 'Test message');
        await user.click(screen.getByRole('button', { name: /submit/i }));

        await waitFor(() => {
            expect(onSuccess).toHaveBeenCalled();
        });
    });

    it('should show loading state during submission', async () => {
        server.use(
            http.post('/api/inquiry', async () => {
                await new Promise(resolve => setTimeout(resolve, 100));
                return HttpResponse.json({ success: true });
            })
        );

        const { user } = render(<ContactForm onSuccess={onSuccess} />);

        await user.type(screen.getByLabelText(/name/i), 'John Doe');
        await user.type(screen.getByLabelText(/email/i), 'john@example.com');
        await user.type(screen.getByLabelText(/message/i), 'Test message');
        await user.click(screen.getByRole('button', { name: /submit/i }));

        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should handle server error', async () => {
        server.use(
            http.post('/api/inquiry', () => {
                return HttpResponse.json(
                    { error: 'Server error' },
                    { status: 500 }
                );
            })
        );

        const { user } = render(<ContactForm onSuccess={onSuccess} />);

        await user.type(screen.getByLabelText(/name/i), 'John Doe');
        await user.type(screen.getByLabelText(/email/i), 'john@example.com');
        await user.type(screen.getByLabelText(/message/i), 'Test message');
        await user.click(screen.getByRole('button', { name: /submit/i }));

        await waitFor(() => {
            expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
        });
    });
});
```

---

## Playwright E2E Testing

### Configuration (Already Exists)

The project already has `playwright.config.ts` configured:

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: 'http://localhost:3100',
        trace: 'on-first-retry',
    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
        { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    ],
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:3100',
        reuseExistingServer: !process.env.CI,
    },
});
```

### E2E Test Structure

```
e2e/
├── fixtures/
│   ├── auth.fixture.ts        # Authentication fixtures
│   └── test-data.ts           # Test data constants
├── pages/
│   ├── base.page.ts           # Base page object
│   ├── home.page.ts           # Home page object
│   ├── login.page.ts          # Login page object
│   └── events.page.ts         # Events page object
├── home.spec.ts               # Home page tests
├── auth.spec.ts               # Authentication tests
├── events.spec.ts             # Events tests
└── contact.spec.ts            # Contact form tests
```

### Page Object Model (POM)

Create `e2e/pages/base.page.ts`:

```typescript
import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
    readonly page: Page;
    readonly header: Locator;
    readonly footer: Locator;
    readonly loadingSpinner: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = page.locator('.landing-header');
        this.footer = page.locator('.landing-footer');
        this.loadingSpinner = page.locator('[data-testid="loading-spinner"]');
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }

    async waitForLoadingToComplete() {
        await this.loadingSpinner.waitFor({ state: 'hidden' });
    }

    async expectToastMessage(message: string) {
        await expect(this.page.getByText(message)).toBeVisible();
    }
}
```

Create `e2e/pages/home.page.ts`:

```typescript
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
    readonly heroSection: Locator;
    readonly heroTitle: Locator;
    readonly eventsSection: Locator;
    readonly ministriesSection: Locator;
    readonly contactForm: Locator;

    constructor(page: Page) {
        super(page);
        this.heroSection = page.locator('.hero-section');
        this.heroTitle = page.locator('.hero-section h1');
        this.eventsSection = page.locator('#events');
        this.ministriesSection = page.locator('#ministries');
        this.contactForm = page.locator('#contact-form');
    }

    async goto() {
        await this.page.goto('/');
        await this.waitForPageLoad();
    }

    async expectHeroVisible() {
        await expect(this.heroSection).toBeVisible();
        await expect(this.heroTitle).toBeVisible();
    }

    async scrollToSection(section: 'events' | 'ministries' | 'contact') {
        const sectionMap = {
            events: this.eventsSection,
            ministries: this.ministriesSection,
            contact: this.contactForm,
        };
        await sectionMap[section].scrollIntoViewIfNeeded();
    }
}
```

Create `e2e/pages/login.page.ts`:

```typescript
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly submitButton: Locator;
    readonly errorMessage: Locator;
    readonly forgotPasswordLink: Locator;

    constructor(page: Page) {
        super(page);
        this.emailInput = page.getByLabel(/email/i);
        this.passwordInput = page.getByLabel(/password/i);
        this.submitButton = page.getByRole('button', { name: /sign in|login/i });
        this.errorMessage = page.locator('[data-testid="error-message"]');
        this.forgotPasswordLink = page.getByRole('link', { name: /forgot password/i });
    }

    async goto() {
        await this.page.goto('/signin');
        await this.waitForPageLoad();
    }

    async login(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.submitButton.click();
    }

    async expectErrorMessage(message: string) {
        await expect(this.errorMessage).toContainText(message);
    }

    async expectSuccessfulLogin() {
        await this.page.waitForURL(/dashboard|church-campus-admin/);
    }
}
```

### Authentication Fixture

Create `e2e/fixtures/auth.fixture.ts`:

```typescript
import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

// Test user credentials
const TEST_USER = {
    email: process.env.TEST_USER_EMAIL || 'test@gateway.church',
    password: process.env.TEST_USER_PASSWORD || 'testpassword123',
};

// Extend base test with authentication
export const test = base.extend<{
    authenticatedPage: ReturnType<typeof base.extend>;
}>({
    authenticatedPage: async ({ page, context }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(TEST_USER.email, TEST_USER.password);
        await loginPage.expectSuccessfulLogin();

        // Save authentication state
        await context.storageState({ path: '.auth/user.json' });

        await use(page);
    },
});

export { expect };
```

### E2E Test Examples

#### Home Page Tests

```typescript
// e2e/home.spec.ts
import { test, expect } from '@playwright/test';
import { HomePage } from './pages/home.page';

test.describe('Gateway Church Landing Page', () => {
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        await homePage.goto();
    });

    test('should load the home page with correct title', async ({ page }) => {
        await expect(page).toHaveTitle(/Gateway Church/i);
    });

    test('should display hero section', async () => {
        await homePage.expectHeroVisible();
        await expect(homePage.heroTitle).toContainText(/Loving God/i);
    });

    test('should have visible navigation', async () => {
        await expect(homePage.header).toBeVisible();
        await expect(homePage.page.getByRole('navigation')).toBeVisible();
    });

    test('should navigate to events section when clicking nav link', async ({ page }) => {
        await page.getByRole('link', { name: /events/i }).click();
        await expect(homePage.eventsSection).toBeInViewport();
    });

    test('should display footer with contact info', async () => {
        await expect(homePage.footer).toBeVisible();
        await expect(homePage.footer).toContainText(/Gateway Church/i);
    });
});
```

#### Authentication Tests

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login.page';

test.describe('Authentication Flow', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();
    });

    test('should display login form', async () => {
        await expect(loginPage.emailInput).toBeVisible();
        await expect(loginPage.passwordInput).toBeVisible();
        await expect(loginPage.submitButton).toBeVisible();
    });

    test('should show validation errors for empty form', async () => {
        await loginPage.submitButton.click();

        await expect(loginPage.page.getByText(/email is required/i)).toBeVisible();
        await expect(loginPage.page.getByText(/password is required/i)).toBeVisible();
    });

    test('should show error for invalid credentials', async () => {
        await loginPage.login('invalid@email.com', 'wrongpassword');

        await loginPage.expectErrorMessage(/invalid credentials/i);
    });

    test('should navigate to forgot password page', async () => {
        await loginPage.forgotPasswordLink.click();

        await expect(loginPage.page).toHaveURL(/forgot-password/);
    });

    test('should redirect authenticated users from login page', async ({ page, context }) => {
        // Setup: Login first
        await loginPage.login('test@gateway.church', 'password123');
        await loginPage.expectSuccessfulLogin();

        // Try to access login page while authenticated
        await page.goto('/signin');

        // Should redirect to dashboard
        await expect(page).not.toHaveURL(/signin/);
    });
});
```

#### Form Submission Tests

```typescript
// e2e/contact.spec.ts
import { test, expect } from '@playwright/test';
import { HomePage } from './pages/home.page';

test.describe('Contact Form', () => {
    test.beforeEach(async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.goto();
        await homePage.scrollToSection('contact');
    });

    test('should display contact form', async ({ page }) => {
        await expect(page.getByLabel(/name/i)).toBeVisible();
        await expect(page.getByLabel(/email/i)).toBeVisible();
        await expect(page.getByLabel(/message/i)).toBeVisible();
    });

    test('should validate required fields', async ({ page }) => {
        await page.getByRole('button', { name: /submit|send/i }).click();

        await expect(page.getByText(/name is required/i)).toBeVisible();
    });

    test('should successfully submit contact form', async ({ page }) => {
        await page.getByLabel(/name/i).fill('Test User');
        await page.getByLabel(/email/i).fill('test@example.com');
        await page.getByLabel(/message/i).fill('This is a test message');

        await page.getByRole('button', { name: /submit|send/i }).click();

        await expect(page.getByText(/thank you|success/i)).toBeVisible();
    });
});
```

#### Protected Routes Tests

```typescript
// e2e/protected-routes.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Protected Routes', () => {
    test('should redirect unauthenticated users to login', async ({ page }) => {
        await page.goto('/church-campus-admin');

        await expect(page).toHaveURL(/signin/);
    });

    test('should allow authenticated users to access admin', async ({ page, context }) => {
        // Use saved auth state
        await context.addCookies([
            {
                name: 'ACCESS_TOKEN',
                value: 'valid-token',
                domain: 'localhost',
                path: '/',
            },
        ]);

        await page.goto('/church-campus-admin');

        await expect(page).toHaveURL(/church-campus-admin/);
    });
});
```

### Visual Regression Testing

```typescript
// e2e/visual.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
    test('home page screenshot', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        await expect(page).toHaveScreenshot('home-page.png', {
            fullPage: true,
            mask: [page.locator('.dynamic-content')], // Mask dynamic content
        });
    });

    test('events page screenshot', async ({ page }) => {
        await page.goto('/events');
        await page.waitForLoadState('networkidle');

        await expect(page).toHaveScreenshot('events-page.png');
    });
});
```

### Mobile Testing

```typescript
// e2e/mobile.spec.ts
import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['iPhone 12'] });

test.describe('Mobile Experience', () => {
    test('should show mobile navigation', async ({ page }) => {
        await page.goto('/');

        // Mobile menu should be hidden by default
        await expect(page.locator('.mobile-menu')).toBeHidden();

        // Hamburger menu should be visible
        await expect(page.locator('.hamburger-menu')).toBeVisible();
    });

    test('should open mobile menu on hamburger click', async ({ page }) => {
        await page.goto('/');

        await page.locator('.hamburger-menu').click();

        await expect(page.locator('.mobile-menu')).toBeVisible();
    });

    test('should render hero properly on mobile', async ({ page }) => {
        await page.goto('/');

        const hero = page.locator('.hero-section');
        await expect(hero).toBeVisible();

        // Check responsive layout
        const heroBox = await hero.boundingBox();
        expect(heroBox?.width).toBeLessThanOrEqual(390); // iPhone 12 width
    });
});
```

---

## Standard Workflow: New Page Implementation

### Checklist for New Page

```markdown
## New Page Implementation Checklist

### 1. Planning
- [ ] Define page requirements and acceptance criteria
- [ ] Identify data requirements (API endpoints, static data)
- [ ] Identify components needed (existing vs new)
- [ ] Plan state management needs

### 2. Test Setup (TDD Approach)
- [ ] Create page test file: `src/app/(route)/page.test.tsx`
- [ ] Write failing unit tests for page behavior
- [ ] Create E2E test file: `e2e/[page-name].spec.ts`
- [ ] Write failing E2E tests for user flows

### 3. Component Development
- [ ] Create/update components with tests
- [ ] Create component test files alongside components
- [ ] Implement component logic
- [ ] Verify unit tests pass

### 4. Page Implementation
- [ ] Create page.tsx with basic structure
- [ ] Connect to data sources (services/stores)
- [ ] Add form handling if needed
- [ ] Implement loading states
- [ ] Implement error states

### 5. Testing
- [ ] Run unit tests: `npm run test`
- [ ] Run E2E tests: `npm run test:e2e`
- [ ] Manual testing in browser
- [ ] Test responsive design
- [ ] Test accessibility

### 6. Final Verification
- [ ] All tests pass
- [ ] No console errors
- [ ] Lighthouse audit passes
- [ ] Code review completed
```

### Example: Creating Events Detail Page

#### Step 1: Write Tests First

```typescript
// src/app/(public)/events/[slug]/page.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import EventDetailPage from './page';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';

describe('EventDetailPage', () => {
    const mockEvent = {
        id: '1',
        slug: 'sunday-service',
        title: 'Sunday Service',
        date: '2025-01-26',
        time: '10:00 AM',
        location: 'Main Campus',
        description: 'Join us for worship',
        image: '/events/sunday.jpg',
    };

    it('should render event details', async () => {
        server.use(
            http.get('/api/events/sunday-service', () => {
                return HttpResponse.json({ data: mockEvent });
            })
        );

        render(<EventDetailPage params={{ slug: 'sunday-service' }} />);

        await waitFor(() => {
            expect(screen.getByText('Sunday Service')).toBeInTheDocument();
            expect(screen.getByText('10:00 AM')).toBeInTheDocument();
            expect(screen.getByText('Main Campus')).toBeInTheDocument();
        });
    });

    it('should show loading state initially', () => {
        render(<EventDetailPage params={{ slug: 'sunday-service' }} />);

        expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
    });

    it('should handle event not found', async () => {
        server.use(
            http.get('/api/events/invalid-slug', () => {
                return HttpResponse.json({ error: 'Not found' }, { status: 404 });
            })
        );

        render(<EventDetailPage params={{ slug: 'invalid-slug' }} />);

        await waitFor(() => {
            expect(screen.getByText(/event not found/i)).toBeInTheDocument();
        });
    });

    it('should render share buttons', async () => {
        server.use(
            http.get('/api/events/sunday-service', () => {
                return HttpResponse.json({ data: mockEvent });
            })
        );

        render(<EventDetailPage params={{ slug: 'sunday-service' }} />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
        });
    });
});
```

#### Step 2: Write E2E Tests

```typescript
// e2e/event-detail.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Event Detail Page', () => {
    test('should display event details', async ({ page }) => {
        await page.goto('/events/sunday-service');

        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        await expect(page.getByText(/main campus/i)).toBeVisible();
    });

    test('should navigate back to events list', async ({ page }) => {
        await page.goto('/events/sunday-service');

        await page.getByRole('link', { name: /back to events/i }).click();

        await expect(page).toHaveURL('/events');
    });

    test('should share event', async ({ page }) => {
        await page.goto('/events/sunday-service');

        await page.getByRole('button', { name: /share/i }).click();

        await expect(page.getByText(/copied to clipboard|share options/i)).toBeVisible();
    });

    test('should display 404 for invalid event', async ({ page }) => {
        await page.goto('/events/non-existent-event');

        await expect(page.getByText(/event not found/i)).toBeVisible();
    });
});
```

#### Step 3: Implement the Page

```typescript
// src/app/(public)/events/[slug]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Event } from '@/models/event.types';
import { getEventBySlug } from '@/services/event.service';
import { EventDetail } from '@/components/events/EventDetail';
import { EventSkeleton } from '@/components/events/EventSkeleton';
import { NotFound } from '@/components/ui/NotFound';

export default function EventDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                const data = await getEventBySlug(slug);
                setEvent(data);
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [slug]);

    if (loading) {
        return <EventSkeleton data-testid="loading-skeleton" />;
    }

    if (error || !event) {
        return <NotFound message="Event not found" />;
    }

    return <EventDetail event={event} />;
}
```

#### Step 4: Run Tests

```bash
# Run unit tests for the new page
npm run test -- src/app/(public)/events/[slug]/page.test.tsx

# Run all unit tests
npm run test:run

# Run E2E tests for the new page
npm run test:e2e -- e2e/event-detail.spec.ts

# Run all E2E tests
npm run test:e2e
```

---

## Mock Strategies

### 1. API Mocking with MSW

```typescript
// src/test/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
    // Success response
    http.get('/api/events', () => {
        return HttpResponse.json({
            data: mockEvents,
            total: mockEvents.length,
        });
    }),

    // Error response
    http.get('/api/events/error', () => {
        return HttpResponse.json(
            { error: 'Server error' },
            { status: 500 }
        );
    }),

    // Delayed response
    http.get('/api/events/slow', async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return HttpResponse.json({ data: mockEvents });
    }),

    // Dynamic response based on request
    http.get('/api/events/:id', ({ params }) => {
        const event = mockEvents.find(e => e.id === params.id);
        if (!event) {
            return HttpResponse.json(
                { error: 'Not found' },
                { status: 404 }
            );
        }
        return HttpResponse.json({ data: event });
    }),
];
```

### 2. Zustand Store Mocking

```typescript
// Reset store between tests
import { useUserStore } from '@/stores/user.store';

beforeEach(() => {
    useUserStore.setState({
        user: null,
        isAuthenticated: false,
    });
});

// Set specific state for test
it('should show admin features for admin user', () => {
    useUserStore.setState({
        user: { id: '1', role: 'ADMIN' },
        isAuthenticated: true,
    });

    render(<AdminPanel />);

    expect(screen.getByText(/admin settings/i)).toBeInTheDocument();
});
```

### 3. Next.js Router Mocking

```typescript
// In setup.ts or test file
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        prefetch: vi.fn(),
        back: vi.fn(),
    }),
    usePathname: () => '/current-path',
    useSearchParams: () => new URLSearchParams('?query=test'),
    useParams: () => ({ id: '123' }),
}));

// Override in specific test
it('should redirect after login', async () => {
    const pushMock = vi.fn();
    vi.mocked(useRouter).mockReturnValue({
        push: pushMock,
        replace: vi.fn(),
        prefetch: vi.fn(),
        back: vi.fn(),
    });

    // ... test logic

    expect(pushMock).toHaveBeenCalledWith('/dashboard');
});
```

### 4. Test Data Factories

```typescript
// src/test/factories/event.factory.ts
import { Event, GatewayEventType } from '@/models/event.types';

let eventIdCounter = 1;

export const createMockEvent = (overrides: Partial<Event> = {}): Event => ({
    id: String(eventIdCounter++),
    slug: `event-${eventIdCounter}`,
    title: `Test Event ${eventIdCounter}`,
    date: '2025-01-26',
    time: '10:00 AM',
    location: 'Test Location',
    description: 'Test description',
    image: '/test-image.jpg',
    type: GatewayEventType.REGULAR,
    isFeatured: false,
    ...overrides,
});

export const createMockEventList = (count: number): Event[] => {
    return Array.from({ length: count }, () => createMockEvent());
};
```

---

## CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage/lcov.info

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          CI: true

      - name: Upload test report
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

### Pre-commit Hook

```bash
# package.json
{
  "scripts": {
    "test:pre-commit": "vitest run --changed"
  }
}

# .husky/pre-commit
#!/bin/sh
npm run test:pre-commit
```

---

## Quick Reference

### Running Tests

```bash
# Unit Tests
npm run test              # Watch mode
npm run test:run          # Single run
npm run test:coverage     # With coverage
npm run test:ui           # Vitest UI

# E2E Tests
npm run test:e2e          # Run all
npm run test:e2e:ui       # Playwright UI
npm run test:e2e -- --headed  # With browser
npm run test:e2e -- e2e/home.spec.ts  # Specific file

# All Tests
npm run test:all
```

### Test File Templates

```bash
# Copy from existing test or use snippets:
# - Component: src/components/ui/Button.test.tsx
# - Hook: src/hooks/useAuth.test.ts
# - Service: src/services/auth.service.test.ts
# - Store: src/stores/user.store.test.ts
# - Page: src/app/(public)/events/page.test.tsx
# - E2E: e2e/home.spec.ts
```

### Common Test Patterns

| What to Test | How to Test |
|--------------|-------------|
| Component renders | `expect(screen.getByRole(...)).toBeInTheDocument()` |
| User interaction | `await user.click(element)` |
| Form input | `await user.type(input, 'text')` |
| API success | MSW handler returns success |
| API error | MSW handler returns error status |
| Loading state | Check for loading indicator |
| Navigation | `expect(page).toHaveURL(...)` |
| Store state | `useStore.setState({...})` |

---

## Summary

This workflow ensures:

1. **Consistency**: Standard patterns across all tests
2. **Reliability**: Isolated tests with proper mocking
3. **Coverage**: Unit, integration, and E2E layers
4. **Efficiency**: Parallel execution, fast feedback
5. **Maintainability**: Page Object Model, factories, utilities

Follow the checklist for each new page, write tests first when possible, and maintain the test infrastructure as the codebase grows.
