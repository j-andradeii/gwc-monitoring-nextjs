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

//APP URL is using nextjs api
const builAppdUrl = (endpoint: string): string => {
  const baseUrl = config.app.url;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${baseUrl}/${cleanEndpoint}`;
};

const builApidUrl = (endpoint: string): string => {
  const baseUrl = config.api.url;
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
    const response = await fetch(builAppdUrl('auth/refresh'), {
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
    const url = builAppdUrl(endpoint);
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
