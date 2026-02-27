# GWC Monitoring NextJS — Comprehensive Testing Tutorial

> **Stack:** Next.js 16 · React 19 · TypeScript 5 · Zod 4 · Zustand 5 · React Hook Form 7 · PrimeReact 10
> **Current test coverage:** Playwright E2E only (`e2e/*.spec.ts`)
> **Goal of this doc:** Add Vitest + React Testing Library for unit/component tests, and expand Playwright with auth & API patterns.

---

## Table of Contents

1. [Part 1 — Unit Testing Setup (Vitest + React Testing Library)](#part-1--unit-testing-setup)
2. [Part 2 — Playwright E2E Testing (existing setup extended)](#part-2--playwright-e2e-testing)
3. [Part 3 — Scenario Coverage (practical examples)](#part-3--scenario-coverage)
4. [Part 4 — Handling Changing Requirements](#part-4--handling-changing-requirements)
5. [Part 5 — CI/CD Cheatsheet](#part-5--cicd-cheatsheet)

---

## Part 1 — Unit Testing Setup

### 1.1 Why Vitest instead of Jest

| Concern | Jest | Vitest |
|---------|------|--------|
| Config overhead with Next.js | High — requires `babel-jest` or `ts-jest`, custom `moduleNameMapper` | Low — reads `vite.config`/`vitest.config`, natively handles ESM |
| Path alias support (`@/`) | Manual `moduleNameMapper` in `jest.config.js` | Single `resolve.alias` entry in `vitest.config.ts` |
| TypeScript | Needs `ts-jest` transformer | First-class native TS |
| Speed | Slower cold start | Faster (Vite's esbuild pipeline) |
| Watch mode | Separate `jest --watch` | Built-in smart HMR-based watch |
| Compatibility with Zod 4 / Zustand 5 ESM | Can break without extra config | Works out of the box |

For this project (Next.js 16 + TypeScript + pure ESM packages), **Vitest is the path of least resistance**.

---

### 1.2 Install dependencies

Add to `devDependencies` in `package.json`:

```json
{
  "devDependencies": {
    "vitest": "^2.0.5",
    "@vitejs/plugin-react": "^4.3.1",
    "vite-tsconfig-paths": "^5.0.1",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.4.6",
    "@testing-library/user-event": "^14.5.2",
    "jsdom": "^24.1.1"
  }
}
```

Install with:

```bash
npm install --save-dev vitest @vitejs/plugin-react vite-tsconfig-paths \
  @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Add scripts to `package.json`:

```json
{
  "scripts": {
    "test:unit": "vitest run",
    "test:unit:watch": "vitest",
    "test:unit:coverage": "vitest run --coverage"
  }
}
```

---

### 1.3 `vitest.config.ts` — root level

Create `vitest.config.ts` at the project root (same level as `package.json`):

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(), // reads tsconfig.json paths — @/* → ./src/*
  ],
  test: {
    globals: true,          // describe/it/expect available without imports
    environment: 'jsdom',   // browser-like DOM for React components
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/**/*.spec.ts'],
    exclude: ['e2e/**', 'node_modules/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'src/models/schemas/**',
        'src/stores/**',
        'src/services/**',
        'src/hooks/**',
        'src/core/**',
        'src/components/forms/**',
      ],
      exclude: [
        'src/**/*.d.ts',
        'src/test/**',
        'src/app/**',        // Next.js pages — test via E2E
        'src/layouts/**',
        'src/data/**',
      ],
    },
  },
});
```

> **Why `globals: true`?**
> Matches the Playwright / Jest API (`describe`, `it`, `expect`, `beforeEach`) without importing from `vitest` in every file. You can set it to `false` and import explicitly if you prefer strict imports.

---

### 1.4 Global setup file — `src/test/setup.ts`

Create the directory and file:

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';

// Reset Zustand stores between tests to prevent state leakage
import { useUserStore } from '@/stores/user.store';
import { useApiEventStore } from '@/stores/event.store';
import { useLoadingStore } from '@/stores/loading.store';

beforeEach(() => {
  useUserStore.setState({
    user: null,
    isAuthenticated: false,
  });
  useApiEventStore.setState({
    currentEvent: null,
    subscribers: [],
  });
  useLoadingStore.setState({
    activeRequests: 0,
    isLoading: false,
  });
});

// Silence console.log calls from services during tests
// Remove if you want to see service logs
vi.spyOn(console, 'log').mockImplementation(() => {});
```

> **Important:** Zustand stores are module-level singletons. Without a `beforeEach` reset, state from one test leaks into the next. The `setState` call directly mutates the store — it is the Zustand-recommended approach for testing.

---

### 1.5 TypeScript — add test files to `tsconfig.json`

The existing `tsconfig.json` already includes `**/*.ts` and `**/*.tsx`, so test files are automatically included. No changes needed.

If you later add a separate `tsconfig.test.json` (not required), you would extend from the root config and change `moduleResolution` to `node` for compatibility with Vitest's internals — but `vitest.config.ts` with `tsconfigPaths` handles this transparently.

---

### 1.6 Mocking strategy — `vi.mock` vs `vi.spyOn`

| Use case | Tool |
|----------|------|
| Replace an entire module (e.g., `apiClient`) | `vi.mock('@/services/api-client')` |
| Replace a single function on a real module | `vi.spyOn(module, 'functionName')` |
| Mock `localStorage` / `window` | `Object.defineProperty` or `vi.stubGlobal` |
| Mock `next/navigation` | `vi.mock('next/navigation', ...)` |

Pattern for service tests — mock `apiClient` globally:

```typescript
// At the top of a test file
vi.mock('@/services/api-client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));
```

Then inside each test, configure the mock return value:

```typescript
import { apiClient } from '@/services/api-client';

(apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
  data: { access_token: 'mock-token' },
  statusCode: 200,
});
```

---

## Part 2 — Playwright E2E Testing

### 2.1 How the existing `playwright.config.ts` works

```
playwright.config.ts
├── testDir: './e2e'
├── baseURL: 'http://localhost:3100'       ← matches `npm run dev` port
├── trace: 'on-first-retry'               ← trace saved only on retry (CI-friendly)
├── retries: 2 on CI, 0 locally           ← flaky tests get 3 total attempts on CI
├── workers: 1 on CI, auto locally        ← parallelism
├── reporter: 'html'                      ← opens HTML report in browser
└── projects
    ├── chromium  (Desktop Chrome)
    └── Mobile Chrome  (Pixel 5 — 393×851)
```

Key behavior: `webServer` starts `npm run dev` automatically. `reuseExistingServer: !process.env.CI` means locally you can keep `npm run dev` running and Playwright won't start a second server.

---

### 2.2 File naming convention

| Pattern | Purpose |
|---------|---------|
| `e2e/[feature].spec.ts` | Smoke test — one test, loads page, checks key elements |
| `e2e/[feature].advanced.spec.ts` | Full suite — describe blocks, beforeEach, mobile/desktop variants |

**Existing files:**
- `e2e/home.spec.ts` — smoke
- `e2e/home.advanced.spec.ts` — full navigation, hero, accessibility
- `e2e/about.advanced.spec.ts` — SEO, hero, vision/mission, pastors
- `e2e/ministries.spec.ts` — data-driven ministry titles

**Convention for new files:**
- `e2e/auth.spec.ts` — signin smoke
- `e2e/auth.advanced.spec.ts` — full auth flow, redirects
- `e2e/protected.spec.ts` — middleware route protection

---

### 2.3 Page Object Model (POM) pattern

POM centralizes selectors so when a CSS class changes you fix one file, not every spec.

**Create `e2e/pages/NavigationPage.ts`:**

```typescript
// e2e/pages/NavigationPage.ts
import { Page, Locator } from '@playwright/test';

export class NavigationPage {
  readonly header: Locator;
  readonly logo: Locator;
  readonly hamburgerBtn: Locator;
  readonly mobileNav: Locator;

  constructor(private page: Page) {
    this.header = page.locator('.landing-header');
    this.logo = this.header.locator('img[alt="Gateway Church Logo"]');
    this.hamburgerBtn = page.locator('button.hamburger-menu');
    this.mobileNav = page.locator('.nav-menu-wrapper');
  }

  async openMobileMenu() {
    await this.hamburgerBtn.click();
    await this.mobileNav.waitFor({ state: 'visible' });
  }

  async closeMobileMenu() {
    await this.hamburgerBtn.click();
  }

  async openDropdown(label: string) {
    await this.page
      .locator('.nav-dropdown-trigger', { hasText: label })
      .click();
  }

  async getDropdownLink(label: string) {
    return this.page
      .locator(`.nav-dropdown-menu >> a:has-text("${label}")`)
      .first();
  }
}
```

**Usage in a spec:**

```typescript
// e2e/navigation.advanced.spec.ts
import { test, expect } from '@playwright/test';
import { NavigationPage } from './pages/NavigationPage';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('desktop: ministries dropdown shows Community link', async ({ page }) => {
    test.skip(({ isMobile }) => isMobile, 'desktop only');
    const nav = new NavigationPage(page);
    await nav.openDropdown('Ministries');
    const link = await nav.getDropdownLink('Community');
    await expect(link).toBeVisible();
  });
});
```

---

### 2.4 Auth fixtures — session reuse for protected routes

The middleware (`src/middleware.ts`) reads `ACCESS_TOKEN` from httpOnly cookies. To test protected routes without going through the full login UI on every test:

**Step 1 — Create `e2e/global-setup.ts`:**

```typescript
// e2e/global-setup.ts
import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Perform login once
  await page.goto(`${baseURL}/signin`);
  await page.fill('input[name="email"]', process.env.TEST_EMAIL ?? 'test@example.com');
  await page.fill('input[name="password"]', process.env.TEST_PASSWORD ?? 'TestPass123');
  await page.click('button[type="submit"]');

  // Wait for redirect to dashboard (or any indicator of successful login)
  await page.waitForURL(`${baseURL}/church-campus-admin/**`);

  // Save the storage state (cookies + localStorage) to a file
  await page.context().storageState({ path: 'e2e/.auth/user.json' });

  await browser.close();
}

export default globalSetup;
```

**Step 2 — Update `playwright.config.ts`:**

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  globalSetup: './e2e/global-setup.ts',   // ← add this
  use: {
    baseURL: 'http://localhost:3100',
    trace: 'on-first-retry',
  },
  projects: [
    // Unauthenticated project — no storageState
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Authenticated project — injects saved session
    {
      name: 'chromium-authenticated',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/user.json',  // ← inject session
      },
      testMatch: /.*\.auth\.spec\.ts/,        // only run auth spec files
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3100',
    reuseExistingServer: !process.env.CI,
  },
});
```

**Step 3 — Create `.gitignore` entry:**

```
e2e/.auth/
```

**Step 4 — Per-test `storageState` (alternative to global project config):**

```typescript
// e2e/dashboard.auth.spec.ts
import { test, expect } from '@playwright/test';

// Use stored session for this entire describe block
test.use({ storageState: 'e2e/.auth/user.json' });

test.describe('Dashboard (authenticated)', () => {
  test('loads church-campus-admin page', async ({ page }) => {
    await page.goto('/church-campus-admin');
    // Should not redirect to /signin
    await expect(page).not.toHaveURL(/signin/);
    await expect(page.locator('h1')).toBeVisible();
  });
});
```

---

### 2.5 API route testing with the `request` fixture

Playwright's `request` fixture sends raw HTTP calls — useful for testing Next.js API routes without a browser:

```typescript
// e2e/api.spec.ts
import { test, expect } from '@playwright/test';

test.describe('API Routes', () => {
  test('POST /api/inquiry returns 200', async ({ request }) => {
    const response = await request.post('/api/inquiry', {
      data: {
        name: 'Test User',
        email: 'test@example.com',
        message: 'Integration test message',
        type: 'contact',
      },
    });
    // Expect 200 or 201 depending on backend contract
    expect([200, 201]).toContain(response.status());
  });

  test('GET /api/auth returns unauthenticated when no cookie', async ({ request }) => {
    const response = await request.get('/api/auth');
    // Expect 401 when no valid access token cookie
    expect(response.status()).toBe(401);
  });
});
```

---

## Part 3 — Scenario Coverage

### 3.1 Playwright E2E Scenarios

#### Scenario A — Public pages smoke tests

```typescript
// e2e/public-pages.spec.ts
import { test, expect } from '@playwright/test';

const PUBLIC_PAGES = [
  { path: '/',                  title: /Gateway Church \| Welcome Home/i },
  { path: '/about',             title: /About Us \| Gateway Church/i },
  { path: '/ministries/community', title: /Community/i },
  { path: '/sermon-notes',      title: /Sermons/i },
];

for (const { path, title } of PUBLIC_PAGES) {
  test(`${path} loads and has correct title`, async ({ page }) => {
    await page.goto(path);
    await expect(page).toHaveTitle(title);
    // No 500 error — main content renders
    await expect(page.locator('main')).toBeVisible();
  });
}
```

#### Scenario B — Auth flow

```typescript
// e2e/auth.advanced.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.describe('Sign In Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/signin');
    });

    test('renders email and password fields', async ({ page }) => {
      await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('shows validation errors on empty submit', async ({ page }) => {
      await page.click('button[type="submit"]');
      // Zod loginSchema: email required, password required
      await expect(page.getByText(/email is required/i).first()).toBeVisible();
      await expect(page.getByText(/password is required/i).first()).toBeVisible();
    });

    test('shows error on invalid credentials', async ({ page }) => {
      await page.fill('input[type="email"], input[name="email"]', 'wrong@example.com');
      await page.fill('input[type="password"]', 'WrongPass1');
      await page.click('button[type="submit"]');
      // Auth service emits ERROR event → toast appears
      await expect(page.getByText(/invalid credentials|authentication failed/i).first())
        .toBeVisible({ timeout: 10_000 });
    });
  });

  test.describe('Redirect Rules (middleware)', () => {
    test('unauthenticated: /church-campus-admin → /signin?returnUrl=...', async ({ page }) => {
      await page.goto('/church-campus-admin');
      await expect(page).toHaveURL(/\/signin/);
      // returnUrl query param should be present
      const url = new URL(page.url());
      expect(url.searchParams.get('returnUrl')).toBe('/church-campus-admin');
    });

    test('authenticated: /signin → /church-campus-admin (dashboard)', async ({ page }) => {
      // Inject session cookie manually for this test
      await page.context().addCookies([
        {
          name: 'ACCESS_TOKEN',
          value: 'valid-mock-token',
          domain: 'localhost',
          path: '/',
          httpOnly: true,
        },
      ]);
      await page.goto('/signin');
      // Should redirect away from signin
      await expect(page).not.toHaveURL(/signin/);
    });
  });
});
```

#### Scenario C — Protected routes smoke test

```typescript
// e2e/protected.spec.ts
import { test, expect } from '@playwright/test';

const PROTECTED_PATHS = [
  '/church-campus-admin',
  '/church-campus-admin/members',
];

for (const path of PROTECTED_PATHS) {
  test(`${path} redirects to signin when unauthenticated`, async ({ page }) => {
    await page.goto(path);
    await expect(page).toHaveURL(/\/signin/);
  });
}
```

#### Scenario D — Security headers (middleware check)

```typescript
// e2e/security-headers.spec.ts
import { test, expect } from '@playwright/test';

test('public page response includes security headers', async ({ request }) => {
  const response = await request.get('/');
  const headers = response.headers();

  // Middleware sets these headers on every response
  expect(headers['x-frame-options']).toBe('DENY');
  expect(headers['x-content-type-options']).toBe('nosniff');
  expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
  expect(headers['content-security-policy']).toContain("default-src 'self'");
  expect(headers['strict-transport-security']).toContain('max-age=31536000');
});
```

#### Scenario E — Navigation (desktop + mobile)

Pattern from `e2e/home.advanced.spec.ts` — desktop uses `test.skip(({ isMobile }) => isMobile, '...')` and mobile uses the inverse. Reference that file for the selector patterns already verified against the app:

- `.landing-header` — main header
- `.nav-dropdown-trigger` — dropdown buttons
- `.nav-dropdown-menu >> a:has-text("X")` — items inside open dropdowns
- `button.hamburger-menu` — mobile toggle
- `.nav-menu-wrapper` + class `mobile-nav-active` — open state

#### Scenario F — Ministries data-driven test

Already implemented in `e2e/ministries.spec.ts`. This is the gold standard pattern for data-driven E2E:

```typescript
import { ministries } from '../src/data/ministries';
// ...
for (const ministry of ministries) {
  const title = page.locator(`h2.ministry-feature-title:has-text("${ministry.title}")`);
  await expect(title).toBeVisible();
}
```

**Key insight:** Importing the same data array the app uses means the test automatically stays in sync when `src/data/ministries.ts` is updated.

---

### 3.2 Unit Test Scenarios

#### Scenario 1 — Zod schemas

**`src/models/schemas/__tests__/auth.schema.test.ts`:**

```typescript
import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema } from '../auth.schema';

describe('loginSchema', () => {
  it('passes with valid email and 8+ char password', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'Secret123',
    });
    expect(result.success).toBe(true);
  });

  it('fails when email is missing', () => {
    const result = loginSchema.safeParse({ email: '', password: 'Secret123' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('Email is required');
  });

  it('fails when email format is invalid', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'Secret123' });
    expect(result.success).toBe(false);
    const messages = result.error?.issues.map((i) => i.message);
    expect(messages).toContain('Invalid email address');
  });

  it('fails when password is shorter than 8 characters', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com', password: 'short' });
    expect(result.success).toBe(false);
    const messages = result.error?.issues.map((i) => i.message);
    expect(messages).toContain('Password must be at least 8 characters');
  });
});

describe('registerSchema', () => {
  const validData = {
    name: 'John Doe',
    email: 'user@example.com',
    password: 'SecurePass1',
    confirmPassword: 'SecurePass1',
  };

  it('passes with matching passwords and all required fields', () => {
    expect(registerSchema.safeParse(validData).success).toBe(true);
  });

  it('fails when passwords do not match (.refine check)', () => {
    const result = registerSchema.safeParse({
      ...validData,
      confirmPassword: 'DifferentPass1',
    });
    expect(result.success).toBe(false);
    const confirmError = result.error?.issues.find(
      (i) => i.path.includes('confirmPassword')
    );
    expect(confirmError?.message).toBe('Passwords do not match');
  });

  it('fails when password has no uppercase letter', () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: 'nouppercase1',
      confirmPassword: 'nouppercase1',
    });
    expect(result.success).toBe(false);
  });
});
```

---

**`src/models/schemas/__tests__/contact.schema.test.ts`:**

```typescript
import { describe, it, expect } from 'vitest';
import { contactSchema, simpleContactSchema, joinSchema } from '../contact.schema';

describe('contactSchema (discriminated union)', () => {
  it('accepts type=prayer with a message', () => {
    const result = contactSchema.safeParse({
      type: 'prayer',
      name: 'Jane',
      email: 'jane@example.com',
      phone: '09123456789',
      message: 'Please pray for healing.',
    });
    expect(result.success).toBe(true);
  });

  it('accepts type=join with required join fields', () => {
    const result = contactSchema.safeParse({
      type: 'join',
      name: 'John',
      email: 'john@example.com',
      phone: '09123456789',
      gender: 'Male',
      address: '123 Main St',
      joinReason: 'I want to grow in faith.',
    });
    expect(result.success).toBe(true);
  });

  it('rejects type=prayer when message is empty', () => {
    const result = contactSchema.safeParse({
      type: 'prayer',
      name: 'Jane',
      email: 'jane@example.com',
      phone: '09123456789',
      message: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects type=join when gender is missing', () => {
    const result = contactSchema.safeParse({
      type: 'join',
      name: 'John',
      email: 'john@example.com',
      phone: '09123456789',
      gender: '',
      address: '123 Main St',
      joinReason: 'Want to join.',
    });
    expect(result.success).toBe(false);
  });
});

describe('simpleContactSchema', () => {
  it('passes with name, valid email, and message', () => {
    expect(
      simpleContactSchema.safeParse({
        name: 'Alice',
        email: 'alice@example.com',
        message: 'Hello there!',
      }).success
    ).toBe(true);
  });

  it('fails when message is empty', () => {
    expect(
      simpleContactSchema.safeParse({
        name: 'Alice',
        email: 'alice@example.com',
        message: '',
      }).success
    ).toBe(false);
  });
});
```

---

**`src/models/schemas/__tests__/member.schema.test.ts`:**

```typescript
import { describe, it, expect } from 'vitest';
import { personalInfoSchema, memberContactSchema } from '../member.schema';
import { Gender, ContactInfoType } from '../../enums';

describe('personalInfoSchema', () => {
  it('passes with only required first and last name', () => {
    const result = personalInfoSchema.safeParse({
      first_name: 'Maria',
      last_name: 'Santos',
    });
    expect(result.success).toBe(true);
  });

  it('fails when first_name is less than 2 characters', () => {
    const result = personalInfoSchema.safeParse({
      first_name: 'A',
      last_name: 'Santos',
    });
    expect(result.success).toBe(false);
    const messages = result.error?.issues.map((i) => i.message);
    expect(messages).toContain('First name must be at least 2 characters');
  });

  it('accepts valid email as optional field', () => {
    const result = personalInfoSchema.safeParse({
      first_name: 'Maria',
      last_name: 'Santos',
      email: 'maria@example.com',
    });
    expect(result.success).toBe(true);
  });

  it('accepts empty string for optional email (z.literal empty string)', () => {
    const result = personalInfoSchema.safeParse({
      first_name: 'Maria',
      last_name: 'Santos',
      email: '',
    });
    expect(result.success).toBe(true);
  });

  it('fails with invalid email format', () => {
    const result = personalInfoSchema.safeParse({
      first_name: 'Maria',
      last_name: 'Santos',
      email: 'not-an-email',
    });
    expect(result.success).toBe(false);
  });

  it('accepts valid Gender enum value', () => {
    const result = personalInfoSchema.safeParse({
      first_name: 'Maria',
      last_name: 'Santos',
      gender: Gender.FEMALE,
    });
    expect(result.success).toBe(true);
  });
});

describe('memberContactSchema', () => {
  it('passes with valid contactInfoType and number', () => {
    const result = memberContactSchema.safeParse({
      contactInfoType: ContactInfoType.MOBILE,
      number: '09171234567',
    });
    expect(result.success).toBe(true);
  });

  it('fails when number is empty', () => {
    const result = memberContactSchema.safeParse({
      contactInfoType: ContactInfoType.MOBILE,
      number: '',
    });
    expect(result.success).toBe(false);
  });
});
```

---

#### Scenario 2 — Zustand stores

**`src/stores/__tests__/loading.store.test.ts`:**

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { useLoadingStore } from '../loading.store';

// Reset store before each test (also done globally in setup.ts)
beforeEach(() => {
  useLoadingStore.setState({ activeRequests: 0, isLoading: false });
});

describe('useLoadingStore', () => {
  it('starts with no active requests and isLoading=false', () => {
    const state = useLoadingStore.getState();
    expect(state.activeRequests).toBe(0);
    expect(state.isLoading).toBe(false);
  });

  it('incrementRequests: increases counter and sets isLoading=true', () => {
    useLoadingStore.getState().incrementRequests();
    const state = useLoadingStore.getState();
    expect(state.activeRequests).toBe(1);
    expect(state.isLoading).toBe(true);
  });

  it('decrementRequests: decreases counter, sets isLoading=false at zero', () => {
    useLoadingStore.getState().incrementRequests();
    useLoadingStore.getState().incrementRequests();
    useLoadingStore.getState().decrementRequests();
    expect(useLoadingStore.getState().activeRequests).toBe(1);
    expect(useLoadingStore.getState().isLoading).toBe(true);

    useLoadingStore.getState().decrementRequests();
    expect(useLoadingStore.getState().activeRequests).toBe(0);
    expect(useLoadingStore.getState().isLoading).toBe(false);
  });

  it('decrementRequests: does not go below 0 (Math.max guard)', () => {
    useLoadingStore.getState().decrementRequests(); // called on zero
    expect(useLoadingStore.getState().activeRequests).toBe(0);
  });

  it('reset: clears all state', () => {
    useLoadingStore.getState().incrementRequests();
    useLoadingStore.getState().incrementRequests();
    useLoadingStore.getState().reset();
    expect(useLoadingStore.getState().activeRequests).toBe(0);
    expect(useLoadingStore.getState().isLoading).toBe(false);
  });
});
```

---

**`src/stores/__tests__/event.store.test.ts`:**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  useApiEventStore,
  ApiEventType,
  ApiEventStatus,
  createApiEvent,
} from '../event.store';

beforeEach(() => {
  useApiEventStore.setState({ currentEvent: null, subscribers: [] });
});

describe('useApiEventStore', () => {
  it('sendEvent: sets currentEvent and notifies subscribers', () => {
    const callback = vi.fn();
    useApiEventStore.getState().subscribe(callback);

    const event = createApiEvent(ApiEventType.AUTHENTICATION, ApiEventStatus.IN_PROGRESS);
    useApiEventStore.getState().sendEvent(event);

    expect(useApiEventStore.getState().currentEvent).toEqual(event);
    expect(callback).toHaveBeenCalledWith(event);
  });

  it('subscribe: returns an unsubscribe function', () => {
    const callback = vi.fn();
    const unsubscribe = useApiEventStore.getState().subscribe(callback);

    unsubscribe();

    useApiEventStore.getState().sendEvent(
      createApiEvent(ApiEventType.GET_MEMBERS, ApiEventStatus.COMPLETED)
    );

    // Callback should NOT be called after unsubscribe
    expect(callback).not.toHaveBeenCalled();
  });

  it('clearEvent: resets currentEvent to null', () => {
    useApiEventStore.getState().sendEvent(
      createApiEvent(ApiEventType.AUTHENTICATION, ApiEventStatus.COMPLETED)
    );
    useApiEventStore.getState().clearEvent();
    expect(useApiEventStore.getState().currentEvent).toBeNull();
  });

  it('multiple subscribers all receive the event', () => {
    const cb1 = vi.fn();
    const cb2 = vi.fn();
    useApiEventStore.getState().subscribe(cb1);
    useApiEventStore.getState().subscribe(cb2);

    const event = createApiEvent(ApiEventType.CREATE_MEMBER, ApiEventStatus.COMPLETED);
    useApiEventStore.getState().sendEvent(event);

    expect(cb1).toHaveBeenCalledWith(event);
    expect(cb2).toHaveBeenCalledWith(event);
  });
});

describe('createApiEvent helper', () => {
  it('creates event with type and status', () => {
    const event = createApiEvent(ApiEventType.DELETE_MEMBER, ApiEventStatus.ERROR, {
      toast: true,
      message: 'Deletion failed',
    });
    expect(event.type).toBe(ApiEventType.DELETE_MEMBER);
    expect(event.status).toBe(ApiEventStatus.ERROR);
    expect(event.toast).toBe(true);
    expect(event.message).toBe('Deletion failed');
  });
});
```

---

**`src/stores/__tests__/user.store.test.ts`:**

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { useUserStore } from '../user.store';
import type { SelfInformationDto } from '../user.store';

const mockUser: SelfInformationDto = {
  church_campus_staff: {
    id: 'staff-1',
    role: 'STAFF',
    church_campus: { id: 'campus-1', type: 'MAIN' },
  },
  member: {
    id: 'member-1',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
  },
};

beforeEach(() => {
  useUserStore.setState({ user: null, isAuthenticated: false });
});

describe('useUserStore', () => {
  it('initial state: user=null, isAuthenticated=false', () => {
    const state = useUserStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('setUser: stores user and sets isAuthenticated=true', () => {
    useUserStore.getState().setUser(mockUser);
    expect(useUserStore.getState().user).toEqual(mockUser);
    expect(useUserStore.getState().isAuthenticated).toBe(true);
  });

  it('updateUser: merges partial updates', () => {
    useUserStore.getState().setUser(mockUser);
    useUserStore.getState().updateUser({
      member: { ...mockUser.member, first_name: 'Jane' },
    });
    expect(useUserStore.getState().user?.member.first_name).toBe('Jane');
    // Other fields untouched
    expect(useUserStore.getState().user?.church_campus_staff.role).toBe('STAFF');
  });

  it('clearUser: resets to initial state', () => {
    useUserStore.getState().setUser(mockUser);
    useUserStore.getState().clearUser();
    expect(useUserStore.getState().user).toBeNull();
    expect(useUserStore.getState().isAuthenticated).toBe(false);
  });

  it('selectUserRole selector returns staff role', () => {
    useUserStore.getState().setUser(mockUser);
    const role = useUserStore.getState().user?.church_campus_staff?.role;
    expect(role).toBe('STAFF');
  });
});
```

---

#### Scenario 3 — Services

**`src/services/__tests__/auth.service.test.ts`:**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useApiEventStore, ApiEventType, ApiEventStatus } from '@/stores/event.store';
import { useUserStore } from '@/stores/user.store';

// Mock the entire apiClient module
vi.mock('@/services/api-client', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

// Mock crypto — scrypt is async and slow in tests
vi.mock('@/core/crypto', () => ({
  encrypt: vi.fn().mockResolvedValue('encrypted-password'),
}));

// Mock storage
vi.mock('@/core/local-storage', () => ({
  storage: { set: vi.fn(), get: vi.fn(), remove: vi.fn() },
}));

import { apiClient } from '@/services/api-client';
import { authenticate, logout, isAuthenticated, hasRole } from '@/services/auth.service';

beforeEach(() => {
  vi.clearAllMocks();
  useUserStore.setState({ user: null, isAuthenticated: false });
  useApiEventStore.setState({ currentEvent: null, subscribers: [] });
});

describe('authenticate', () => {
  it('returns true and emits COMPLETED event on success', async () => {
    // Mock POST auth → returns token response
    (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: { access_token: 'mock-token' },
      statusCode: 200,
    });
    // Mock GET self → returns user info
    (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: {
        church_campus_staff: { id: 's1', role: 'STAFF' },
        member: { id: 'm1', first_name: 'John', last_name: 'Doe' },
      },
    });

    const result = await authenticate({ email: 'user@example.com', password: 'Pass123!' });

    expect(result).toBe(true);
    expect(useApiEventStore.getState().currentEvent?.type).toBe(ApiEventType.GET_AUTHENTICATED_SELF);
    expect(useApiEventStore.getState().currentEvent?.status).toBe(ApiEventStatus.COMPLETED);
  });

  it('returns false and emits ERROR event on API failure', async () => {
    (apiClient.post as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error('Invalid credentials')
    );

    const result = await authenticate({ email: 'bad@example.com', password: 'WrongPass1' });

    expect(result).toBe(false);
    expect(useApiEventStore.getState().currentEvent?.status).toBe(ApiEventStatus.ERROR);
    expect(useApiEventStore.getState().currentEvent?.type).toBe(ApiEventType.AUTHENTICATION);
  });
});

describe('isAuthenticated', () => {
  it('returns false when store has no user', () => {
    expect(isAuthenticated()).toBe(false);
  });

  it('returns true when store has authenticated user', () => {
    useUserStore.setState({ isAuthenticated: true, user: null });
    expect(isAuthenticated()).toBe(true);
  });
});

describe('hasRole', () => {
  it('returns false when user has no role', () => {
    expect(hasRole(['STAFF'])).toBe(false);
  });

  it('returns true when user role is in the list', () => {
    useUserStore.setState({
      isAuthenticated: true,
      user: {
        church_campus_staff: { id: 's1', role: 'PASTOR' },
        member: { id: 'm1', first_name: 'Jim', last_name: 'Doe' },
      },
    });
    expect(hasRole(['PASTOR', 'SENIOR_PASTOR'])).toBe(true);
    expect(hasRole(['STAFF'])).toBe(false);
  });
});
```

---

**`src/services/__tests__/inquiry.service.test.ts`:**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useApiEventStore, ApiEventType, ApiEventStatus } from '@/stores/event.store';

vi.mock('@/services/api-client', () => ({
  apiClient: { post: vi.fn() },
}));

import { apiClient } from '@/services/api-client';
import {
  submitQuery,
  submitPrayerRequest,
  submitCellGroupJoinRequest,
  submitEventInquiry,
} from '@/services/inquiry.service';

beforeEach(() => {
  vi.clearAllMocks();
  useApiEventStore.setState({ currentEvent: null, subscribers: [] });
});

describe('submitPrayerRequest', () => {
  const payload = { name: 'Jane', email: 'jane@test.com', phone: '123', message: 'Heal me' };

  it('emits IN_PROGRESS then COMPLETED on success', async () => {
    (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce({});
    const events: unknown[] = [];
    useApiEventStore.getState().subscribe((e) => events.push(e));

    await submitPrayerRequest(payload);

    const statuses = (events as Array<{ status: number }>).map((e) => e.status);
    expect(statuses).toContain(ApiEventStatus.IN_PROGRESS);
    expect(statuses).toContain(ApiEventStatus.COMPLETED);
  });

  it('emits ERROR on API failure', async () => {
    (apiClient.post as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network error'));

    await submitPrayerRequest(payload);

    expect(useApiEventStore.getState().currentEvent?.status).toBe(ApiEventStatus.ERROR);
  });

  it('calls /api/inquiry/prayer-requests endpoint', async () => {
    (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce({});
    await submitPrayerRequest(payload);
    expect(apiClient.post).toHaveBeenCalledWith('/api/inquiry/prayer-requests', payload);
  });
});

describe('submitEventInquiry', () => {
  it('calls /api/event/:slug endpoint with correct slug', async () => {
    (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce({});
    await submitEventInquiry({ name: 'Test' }, 'easter-2025');
    expect(apiClient.post).toHaveBeenCalledWith('/api/event/easter-2025', { name: 'Test' });
  });
});
```

---

#### Scenario 4 — Custom hooks

**`src/hooks/__tests__/usePagination.test.ts`:**

```typescript
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePagination } from '../usePagination';

describe('usePagination', () => {
  it('initializes with defaults: page=1, pageSize from PAGINATION constant', () => {
    const { result } = renderHook(() => usePagination());
    expect(result.current.page).toBe(1);
    expect(result.current.isFirstPage).toBe(true);
    expect(result.current.isLastPage).toBe(true); // only 1 page with 0 records
  });

  it('nextPage increments page', () => {
    const { result } = renderHook(() =>
      usePagination({ totalRecords: 100, initialPageSize: 10 })
    );
    act(() => result.current.setTotalRecords(100));
    act(() => result.current.nextPage());
    expect(result.current.page).toBe(2);
  });

  it('prevPage decrements page', () => {
    const { result } = renderHook(() =>
      usePagination({ totalRecords: 100, initialPageSize: 10, initialPage: 3 })
    );
    act(() => result.current.prevPage());
    expect(result.current.page).toBe(2);
  });

  it('setPage clamps to valid range', () => {
    const { result } = renderHook(() =>
      usePagination({ totalRecords: 30, initialPageSize: 10 })
    );
    act(() => result.current.setPage(99));  // beyond last page
    expect(result.current.page).toBe(3);   // clamped to totalPages=3

    act(() => result.current.setPage(-5)); // below first page
    expect(result.current.page).toBe(1);  // clamped to 1
  });

  it('setPageSize resets to page 1', () => {
    const { result } = renderHook(() =>
      usePagination({ totalRecords: 100, initialPage: 5 })
    );
    act(() => result.current.setPageSize(25));
    expect(result.current.page).toBe(1);
  });

  it('setSearch resets to page 1', () => {
    const { result } = renderHook(() =>
      usePagination({ totalRecords: 100, initialPage: 4 })
    );
    act(() => result.current.setSearch('john'));
    expect(result.current.page).toBe(1);
    expect(result.current.search).toBe('john');
  });

  it('startRecord and endRecord computed correctly on page 2 (10 per page)', () => {
    const { result } = renderHook(() =>
      usePagination({ totalRecords: 25, initialPageSize: 10, initialPage: 2 })
    );
    expect(result.current.startRecord).toBe(11);
    expect(result.current.endRecord).toBe(20);
  });

  it('hasNextPage false on last page', () => {
    const { result } = renderHook(() =>
      usePagination({ totalRecords: 10, initialPageSize: 10 })
    );
    expect(result.current.hasNextPage).toBe(false);
    expect(result.current.isLastPage).toBe(true);
  });
});
```

---

**`src/hooks/__tests__/useAuth.test.ts`:**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useUserStore } from '@/stores/user.store';
import { useLoadingStore } from '@/stores/loading.store';

// Mock services
vi.mock('@/services/auth.service', () => ({
  authService: {
    authenticate: vi.fn(),
    logout: vi.fn(),
    getSelf: vi.fn(),
    hasRole: vi.fn(),
    getUserRole: vi.fn(),
  },
}));

// Mock next/navigation (required for useRouter inside useAuth)
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

import { authService } from '@/services/auth.service';
import { useAuth } from '../useAuth';

beforeEach(() => {
  vi.clearAllMocks();
  useUserStore.setState({ user: null, isAuthenticated: false });
  useLoadingStore.setState({ activeRequests: 0, isLoading: false });
});

describe('useAuth', () => {
  it('exposes isAuthenticated from user store', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('login: calls authService.authenticate and returns result', async () => {
    (authService.authenticate as ReturnType<typeof vi.fn>).mockResolvedValueOnce(true);

    const { result } = renderHook(() => useAuth());
    const success = await result.current.login({
      email: 'user@example.com',
      password: 'Pass123!',
    });

    expect(success).toBe(true);
    expect(authService.authenticate).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'Pass123!',
    });
  });

  it('isStaffOrAbove: returns true for STAFF role', () => {
    (authService.hasRole as ReturnType<typeof vi.fn>).mockImplementation(
      (roles: string[]) => roles.includes('STAFF')
    );
    const { result } = renderHook(() => useAuth());
    expect(result.current.isStaffOrAbove()).toBe(true);
  });
});
```

---

#### Scenario 5 — Utility functions

**`src/core/__tests__/date-utils.test.ts`:**

```typescript
import { describe, it, expect } from 'vitest';
import {
  formatDate,
  formatDateISO,
  formatDateShort,
  parseDate,
  isToday,
  addDays,
  getMonthDifference,
  getTimeAgo,
} from '../date-utils';

describe('formatDateISO', () => {
  it('formats Date object to YYYY-MM-DD', () => {
    expect(formatDateISO(new Date('2025-01-15'))).toBe('2025-01-15');
  });

  it('handles string input', () => {
    expect(formatDateISO('2024-12-25')).toBe('2024-12-25');
  });
});

describe('formatDateShort', () => {
  it('formats to MM/DD/YYYY', () => {
    expect(formatDateShort(new Date('2025-03-05'))).toBe('03/05/2025');
  });
});

describe('parseDate', () => {
  it('returns a Date for valid string', () => {
    const d = parseDate('2025-06-15');
    expect(d).toBeInstanceOf(Date);
    expect(d?.getFullYear()).toBe(2025);
  });

  it('returns null for invalid string', () => {
    expect(parseDate('not-a-date')).toBeNull();
  });
});

describe('isToday', () => {
  it('returns true for today', () => {
    expect(isToday(new Date())).toBe(true);
  });

  it('returns false for yesterday', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(isToday(yesterday)).toBe(false);
  });
});

describe('addDays', () => {
  it('adds 7 days to a date', () => {
    const base = new Date('2025-01-01');
    const result = addDays(base, 7);
    expect(formatDateISO(result)).toBe('2025-01-08');
  });

  it('subtracts days with negative value', () => {
    const base = new Date('2025-01-10');
    expect(formatDateISO(addDays(base, -5))).toBe('2025-01-05');
  });
});

describe('getMonthDifference', () => {
  it('calculates months between two dates', () => {
    expect(getMonthDifference('2025-01-01', '2025-06-01')).toBe(5);
  });
});

describe('getTimeAgo', () => {
  it('returns "Just now" for current timestamp', () => {
    expect(getTimeAgo(Date.now())).toBe('Just now');
  });

  it('returns "1 day ago" for yesterday', () => {
    const yesterday = Date.now() - 24 * 60 * 60 * 1000 - 60_000; // extra minute buffer
    expect(getTimeAgo(yesterday)).toBe('1 day ago');
  });
});
```

---

**`src/core/__tests__/utils.test.ts`:**

```typescript
import { describe, it, expect } from 'vitest';
import {
  truncate,
  capitalize,
  toTitleCase,
  isEmpty,
  getInitials,
  getFullName,
  buildQueryString,
  formatBytes,
} from '../utils';

describe('truncate', () => {
  it('returns original string when shorter than limit', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('truncates and appends ...', () => {
    expect(truncate('Hello World', 5)).toBe('Hello...');
  });

  it('uses custom suffix', () => {
    expect(truncate('Hello World', 5, '…')).toBe('Hello…');
  });
});

describe('capitalize', () => {
  it('capitalizes first letter, lowercases rest', () => {
    expect(capitalize('hELLO')).toBe('Hello');
  });
});

describe('toTitleCase', () => {
  it('capitalizes each word', () => {
    expect(toTitleCase('gateway church women')).toBe('Gateway Church Women');
  });
});

describe('isEmpty', () => {
  it('returns true for null, undefined, empty string, empty array, empty object', () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
    expect(isEmpty('')).toBe(true);
    expect(isEmpty('  ')).toBe(true);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty({})).toBe(true);
  });

  it('returns false for non-empty values', () => {
    expect(isEmpty('hello')).toBe(false);
    expect(isEmpty([1])).toBe(false);
    expect(isEmpty({ a: 1 })).toBe(false);
  });
});

describe('getInitials', () => {
  it('returns first two characters of first and last name', () => {
    expect(getInitials('John Doe')).toBe('JD');
  });

  it('handles single name', () => {
    expect(getInitials('Maria')).toBe('MA'); // sliced to 2 from 'M'
  });
});

describe('getFullName', () => {
  it('combines first and last name', () => {
    expect(getFullName('John', 'Doe')).toBe('John Doe');
  });

  it('trims extra whitespace', () => {
    expect(getFullName('  John  ', '  Doe  ')).toBe('John     Doe'); // trim on result only
  });
});

describe('buildQueryString', () => {
  it('builds a valid query string from an object', () => {
    const qs = buildQueryString({ page: 1, pageSize: 10, search: 'john' });
    expect(qs).toBe('page=1&pageSize=10&search=john');
  });

  it('omits null and undefined values', () => {
    const qs = buildQueryString({ page: 1, filter: null, sort: undefined });
    expect(qs).toBe('page=1');
  });
});

describe('formatBytes', () => {
  it('formats bytes correctly', () => {
    expect(formatBytes(0)).toBe('0 Bytes');
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1048576)).toBe('1 MB');
  });
});
```

---

#### Scenario 6 — Form components

`FormInput` and `FormSelect` require a `react-hook-form` `FormProvider` context — always wrap them:

**`src/components/forms/__tests__/FormInput.test.tsx`:**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm, FormProvider } from 'react-hook-form';
import { FormInput } from '../FormInput';

// Wrapper provides the required FormContext
function Wrapper({ name = 'email', defaultValue = '' }) {
  const methods = useForm({ defaultValues: { [name]: defaultValue } });
  return (
    <FormProvider {...methods}>
      <FormInput name={name} label="Email" placeholder="Enter email" />
    </FormProvider>
  );
}

describe('FormInput', () => {
  it('renders a label and input', () => {
    render(<Wrapper />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('accepts user typing', async () => {
    render(<Wrapper />);
    const input = screen.getByLabelText(/email/i);
    await userEvent.type(input, 'test@example.com');
    expect(input).toHaveValue('test@example.com');
  });

  it('renders required indicator when showRequired=true', () => {
    const methods = useForm({ defaultValues: { email: '' } });
    const { container } = render(
      <FormProvider {...methods}>
        <FormInput name="email" label="Email" showRequired />
      </FormProvider>
    );
    expect(container.querySelector('.form-required')).toBeInTheDocument();
  });

  it('filters non-integers when enableOnlyInteger=true', async () => {
    const methods = useForm({ defaultValues: { count: '' } });
    render(
      <FormProvider {...methods}>
        <FormInput name="count" label="Count" enableOnlyInteger />
      </FormProvider>
    );
    const input = screen.getByLabelText(/count/i);
    await userEvent.type(input, 'abc123');
    // 'abc' are rejected by processInput; only '123' passes
    expect(input).toHaveValue('123');
  });
});
```

---

## Part 4 — Handling Changing Requirements

### 4.1 The 3-zone model

Not all tests are equally fragile. Understanding which zone a test lives in determines how to respond when product requirements change.

```
Zone 1: MOST STABLE → change rarely
  Schema unit tests (Zod)
  Store unit tests (pure state transitions)
  Pure utility function tests

Zone 2: MODERATELY STABLE → change when flows change
  Service tests (mock API, assert events)
  Hook tests (mock services, assert UI state)
  E2E auth flow tests

Zone 3: LEAST STABLE → change when UI changes
  E2E text content assertions (toContainText, hasText)
  E2E CSS class selectors (.landing-header, .hero-carousel-section)
  E2E aria-label checks
```

**Decision matrix:**

| Requirement changes | Action |
|---------------------|--------|
| New Zod validation rule | UPDATE the schema test with the new rule |
| Renamed CSS class | UPDATE the E2E selector or POM file — one place only |
| New API endpoint added | ADD a new service test; existing tests unchanged |
| Feature removed (e.g., Give page removed) | DELETE the E2E spec — don't `test.skip` indefinitely |
| Page copy/text changed | UPDATE the E2E assertion — `toContainText` not exact match |
| Store action renamed | UPDATE all unit tests using that action |
| New form field added | ADD test case for it; existing test cases unchanged |

---

### 4.2 Data-driven tests — stay in sync automatically

The `e2e/ministries.spec.ts` file already demonstrates the best pattern:

```typescript
import { ministries } from '../src/data/ministries';

for (const ministry of ministries) {
  const title = page.locator(`h2.ministry-feature-title:has-text("${ministry.title}")`);
  await expect(title).toBeVisible();
}
```

When `src/data/ministries.ts` is updated (new ministry added, title changed), this test **automatically adapts** — no test file edit needed.

Apply this to all pages driven by static data:

| Page | Data source |
|------|------------|
| `/ministries/community` | `src/data/ministries.ts` |
| `/sermons` | `src/data/sermons.ts` (or API) |
| `/events` | `src/data/events.ts` (or API) |
| About team cards | `src/data/team.ts` (if exists) |

---

### 4.3 Selector strategy (most → least brittle)

```
1. data-testid attributes  ← BEST: explicit, never styled, easy to search
   page.locator('[data-testid="hero-cta-button"]')

2. ARIA roles / accessible names  ← GOOD: mirrors what screen readers see
   page.getByRole('button', { name: 'Donate Now' })
   page.getByLabel('Email address')

3. Semantic HTML  ← OK: h1, h2, nav, main, footer
   page.locator('h1')
   page.locator('main')

4. CSS classes (BEM-style)  ← RISKY: can change during refactor
   page.locator('.landing-header')  (already in existing specs)

5. Exact text content  ← MOST BRITTLE: breaks on copy changes
   page.getByText('Loving God, Loving People')
```

**Recommendation for new selectors:** Ask the dev adding the component to also add `data-testid` attributes. Example:

```tsx
// In the component
<button data-testid="hero-cta-button" className="...">
  {label}
</button>

// In the spec
await page.locator('[data-testid="hero-cta-button"]').click();
```

---

### 4.4 Arrange → Act → Assert mindset

Every test should have three clear phases:

```typescript
it('login returns false on invalid credentials', async () => {
  // ARRANGE — set up preconditions and mocks
  (apiClient.post as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
    new Error('Invalid credentials')
  );

  // ACT — call the function being tested
  const result = await authenticate({ email: 'bad@test.com', password: 'WrongPass1' });

  // ASSERT — verify the outcome
  expect(result).toBe(false);
  expect(useApiEventStore.getState().currentEvent?.status).toBe(ApiEventStatus.ERROR);
});
```

Tests with all three phases are easier to debug and update because it's clear what changed.

---

### 4.5 When to DELETE a test

A skipped test is a broken promise. If a feature is removed:

1. `git grep` for all test files referencing the removed feature
2. Delete or rewrite, not skip
3. Never leave `test.skip` in a commit without a linked issue

```typescript
// BAD — skip with no plan
test.skip('Give page shows donation options', async ({ page }) => { ... });

// GOOD — delete the file when the feature is removed
// git rm e2e/give.advanced.spec.ts
```

---

## Part 5 — CI/CD Cheatsheet

### 5.1 Running tests

```bash
# Run all E2E tests (uses existing playwright.config.ts)
npm run test:e2e

# After adding Vitest: run unit tests once
npm run test:unit

# Run unit tests in watch mode (local dev)
npm run test:unit:watch

# Run unit tests with coverage report
npm run test:unit:coverage
```

---

### 5.2 Run a single file

```bash
# Playwright — single spec file
npx playwright test e2e/home.advanced.spec.ts

# Vitest — single file
npx vitest run src/stores/__tests__/loading.store.test.ts
```

---

### 5.3 Run a single test by name (grep)

```bash
# Playwright — match test title
npx playwright test --grep "should have correct metadata"

# Vitest — match test title
npx vitest run --reporter=verbose -t "formatDateISO"
```

---

### 5.4 Debug and headed mode

```bash
# Playwright — open browser and pause on first failure
npx playwright test --headed --debug e2e/auth.advanced.spec.ts

# Playwright — open codegen inspector to record new selectors
npx playwright codegen http://localhost:3100

# Playwright — view trace from last run
npx playwright show-report

# Playwright — open trace viewer for a specific trace file
npx playwright show-trace test-results/home-advanced-chromium/trace.zip
```

---

### 5.5 Recommended `package.json` scripts after setup

```json
{
  "scripts": {
    "dev": "next dev --port 3100",
    "build": "next build",
    "start": "next start --port 3100",
    "lint": "eslint",
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug",
    "test:unit": "vitest run",
    "test:unit:watch": "vitest",
    "test:unit:coverage": "vitest run --coverage",
    "test": "npm run test:unit && npm run test:e2e"
  }
}
```

---

### 5.6 GitHub Actions example

```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run test:unit

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
        env:
          CI: true
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Install unit test deps | `npm install --save-dev vitest @vitejs/plugin-react vite-tsconfig-paths @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom` |
| Run E2E smoke | `npx playwright test e2e/home.spec.ts` |
| Run E2E advanced | `npx playwright test e2e/home.advanced.spec.ts` |
| Run E2E with UI | `npx playwright test --headed` |
| Run all unit tests | `npx vitest run` |
| Watch unit tests | `npx vitest` |
| Test a specific unit | `npx vitest run -t "loginSchema"` |
| See coverage | `npx vitest run --coverage` |
| See E2E report | `npx playwright show-report` |
| Record new selectors | `npx playwright codegen http://localhost:3100` |

---

*Last updated: February 2026 | Stack: Next.js 16 · React 19 · Vitest 2 · Playwright 1.58*
