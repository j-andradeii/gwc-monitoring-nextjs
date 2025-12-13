/**
 * LocalStorage Utilities
 *
 * Type-safe localStorage wrapper with SSR support
 */

const isBrowser = typeof window !== 'undefined';

export const storage = {
  /**
   * Get a value from localStorage
   */
  get: (key: string): string | null => {
    if (!isBrowser) return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  /**
   * Get and parse a JSON value from localStorage
   */
  getParsed: <T>(key: string, defaultValue?: T): T | null => {
    if (!isBrowser) return defaultValue ?? null;
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue ?? null;
      return JSON.parse(item) as T;
    } catch {
      return defaultValue ?? null;
    }
  },

  /**
   * Set a value in localStorage
   */
  set: (key: string, value: string): void => {
    if (!isBrowser) return;
    try {
      localStorage.setItem(key, value);
    } catch {
      // localStorage might be full or disabled
    }
  },

  /**
   * Set a JSON value in localStorage
   */
  setJSON: <T>(key: string, value: T): void => {
    if (!isBrowser) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // localStorage might be full or disabled
    }
  },

  /**
   * Remove a value from localStorage
   */
  remove: (key: string): void => {
    if (!isBrowser) return;
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore errors
    }
  },

  /**
   * Remove multiple values from localStorage
   */
  removeMultiple: (keys: string[]): void => {
    if (!isBrowser) return;
    keys.forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch {
        // Ignore errors
      }
    });
  },

  /**
   * Clear all values from localStorage
   */
  clear: (): void => {
    if (!isBrowser) return;
    try {
      localStorage.clear();
    } catch {
      // Ignore errors
    }
  },

  /**
   * Check if localStorage is available
   */
  isAvailable: (): boolean => {
    if (!isBrowser) return false;
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  },
};

// Backwards compatible class-based API (matching Angular's LocalStorageControl)
export class LocalStorageControl {
  static get(key: string): string | null {
    return storage.get(key);
  }

  static getParsed<T>(key: string): T | null {
    return storage.getParsed<T>(key);
  }

  static set(key: string, value: string): void {
    storage.set(key, value);
  }

  static remove(key: string): void {
    storage.remove(key);
  }

  static multipleRemove(keys: string[]): void {
    storage.removeMultiple(keys);
  }

  static clear(): void {
    storage.clear();
  }

  static parse<T>(value: string | null): T | null {
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }
}
