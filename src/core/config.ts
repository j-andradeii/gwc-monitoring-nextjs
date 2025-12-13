/**
 * Application Configuration
 *
 * Type-safe environment variable access with defaults
 */

// Helper functions
const getEnvVar = (key: string, defaultValue: string = ''): string => {
  return process.env[key] || defaultValue;
};

const getBoolEnvVar = (key: string, defaultValue: boolean = false): boolean => {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true';
};

const getNumberEnvVar = (key: string, defaultValue: number): number => {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

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

// Export configuration
export const config: AppConfig = {
  app: {
    name: getEnvVar('NEXT_PUBLIC_APP_NAME', 'GWC Monitoring'),
    url: getEnvVar('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
  },
  api: {
    url: getEnvVar('NEXT_PUBLIC_API_URL', 'https://api-gateway-production-87e4.up.railway.app/api/v1'),
    authUrl: getEnvVar('NEXT_PUBLIC_API_AUTH_URL', 'https://api-gateway-production-87e4.up.railway.app/api/v1/auth'),
    timeout: getNumberEnvVar('NEXT_PUBLIC_API_TIMEOUT', 30000),
  },
  auth: {
    accessTokenExpiry: getEnvVar('NEXT_PUBLIC_ACCESS_TOKEN_EXPIRY', '15m'),
    refreshTokenExpiry: getEnvVar('NEXT_PUBLIC_REFRESH_TOKEN_EXPIRY', '7d'),
  },
  security: {
    xAccessTokenKeyHeader: getEnvVar('NEXT_PUBLIC_X_ACCESS_TOKEN_KEY_HEADER', 'X-ACCESS-TOKEN'),
    xAccessHeader: getEnvVar('NEXT_PUBLIC_X_ACCESS_HEADER', 'X-ACCESS'),
    xAccessTokenPassword: getEnvVar('NEXT_PUBLIC_X_ACCESS_TOKEN_PASSWORD', '79710619e2c6e75105fb3c84b8b35929cd06a346b2df00156b28ca20454cf19f'),
    xAccessTokenKey: getEnvVar('NEXT_PUBLIC_X_ACCESS_TOKEN_KEY', 'f671b539a904aa84a59fa8f6c0931cc13d2f101961d43efe066abf376a04f321'),
  },
  features: {
    analytics: getBoolEnvVar('NEXT_PUBLIC_ENABLE_ANALYTICS', false),
    debug: getBoolEnvVar('NEXT_PUBLIC_ENABLE_DEBUG', false),
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
