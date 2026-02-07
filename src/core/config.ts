/**
 * Application Configuration
 *
 * Type-safe environment variable access with defaults
 *
 * Note: In Next.js, environment variables must be accessed directly
 * (e.g., process.env.NEXT_PUBLIC_API_URL) for browser-side code.
 * Dynamic access like process.env[key] won't work in the browser.
 */

// Configuration interface
export interface AppConfig {
  app: {
    name: string;
    url: string;
  };
  api: {
    url: string;
    authUrl: string;
    timeout: number;
  };
  auth: {
    accessTokenExpiry: string;
    refreshTokenExpiry: string;
  };
  security: {
    xAccessTokenKeyHeader: string;
    xAccessHeader: string;
    xAccessTokenPassword: string;
    xAccessTokenKey: string;
  };
  features: {
    analytics: boolean;
    debug: boolean;
  };
}


// Export configuration with direct env var access for Next.js compatibility
export const config: AppConfig = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Gateway Church Cebu',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
  api: {
    url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
    authUrl: process.env.NEXT_PUBLIC_API_AUTH_URL || 'http://localhost:3000/api/v1/auth',
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000', 10),
  },
  auth: {
    accessTokenExpiry: process.env.NEXT_PUBLIC_ACCESS_TOKEN_EXPIRY || '15m',
    refreshTokenExpiry: process.env.NEXT_PUBLIC_REFRESH_TOKEN_EXPIRY || '7d',
  },
  security: {
    xAccessTokenKeyHeader: process.env.NEXT_PUBLIC_X_ACCESS_TOKEN_KEY_HEADER || 'X-ACCESS-TOKEN',
    xAccessHeader: process.env.NEXT_PUBLIC_X_ACCESS_HEADER || 'X-ACCESS',
    xAccessTokenPassword: process.env.NEXT_PUBLIC_X_ACCESS_TOKEN_PASSWORD || '79710619e2c6e75105fb3c84b8b35929cd06a346b2df00156b28ca20454cf19f',
    xAccessTokenKey: process.env.NEXT_PUBLIC_X_ACCESS_TOKEN_KEY || 'f671b539a904aa84a59fa8f6c0931cc13d2f101961d43efe066abf376a04f321',
  },
  features: {
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    debug: process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true',
  },
};

// Validate required config (call in layout.tsx)
export const validateConfig = (): void => {
  const required = ['NEXT_PUBLIC_APP_URL'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0 && config.features.debug) {
    console.warn(`Missing environment variables: ${missing.join(', ')}`);
  }
};
