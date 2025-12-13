/**
 * Date Utilities
 *
 * Date formatting and manipulation helpers
 */

/**
 * Get current UTC timestamp in milliseconds
 */
export const getUtcMillis = (): number => {
  return Date.now();
};

/**
 * Format date to locale string
 */
export const formatDate = (
  date: Date | string | number,
  locale: string = 'en-US'
): string => {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format date with time
 */
export const formatDateTime = (
  date: Date | string | number,
  locale: string = 'en-US'
): string => {
  return new Date(date).toLocaleString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format date to ISO string (YYYY-MM-DD)
 */
export const formatDateISO = (date: Date | string | number): string => {
  return new Date(date).toISOString().split('T')[0];
};

/**
 * Format date to short format (MM/DD/YYYY)
 */
export const formatDateShort = (date: Date | string | number): string => {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  return `${month}/${day}/${year}`;
};

/**
 * Format date to Australian format (DD/MM/YYYY)
 */
export const formatDateAUS = (date: Date | string | number): string => {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Parse date from string
 */
export const parseDate = (dateString: string): Date | null => {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

/**
 * Get time difference in human-readable format
 */
export const getTimeAgo = (date: Date | string | number): string => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffYears > 0) return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
  if (diffMonths > 0) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  return 'Just now';
};

/**
 * Check if date is today
 */
export const isToday = (date: Date | string | number): boolean => {
  const today = new Date();
  const d = new Date(date);
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

/**
 * Get start of day
 */
export const getStartOfDay = (date: Date | string | number): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Get end of day
 */
export const getEndOfDay = (date: Date | string | number): Date => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Add days to a date
 */
export const addDays = (date: Date | string | number, days: number): Date => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

/**
 * Get month difference between two dates
 */
export const getMonthDifference = (
  date1: Date | string | number,
  date2: Date | string | number
): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    (d2.getFullYear() - d1.getFullYear()) * 12 +
    (d2.getMonth() - d1.getMonth())
  );
};

/**
 * Get browser timezone
 */
export const getBrowserTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

// Class-based API for backwards compatibility with Angular's GWCFormatDate
export class GWCFormatDate {
  static getUtcMillis = getUtcMillis;
  static formatDate = formatDate;
  static formatDateTime = formatDateTime;
  static formatDateISO = formatDateISO;
  static formatDateShort = formatDateShort;
  static formatDateAUS = formatDateAUS;
  static parseDate = parseDate;
  static getTimeAgo = getTimeAgo;
  static isToday = isToday;
  static getStartOfDay = getStartOfDay;
  static getEndOfDay = getEndOfDay;
  static addDays = addDays;
  static getMonthDifference = getMonthDifference;
  static getBrowserTimezone = getBrowserTimezone;
}
