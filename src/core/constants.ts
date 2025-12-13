/**
 * Application Constants
 */

// Form validation patterns
export const FORM_CONST = {
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  WEBSITE_PATTERN: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
  PHONE_PATTERN: /^\+?[1-9]\d{1,14}$/,
  VALIDATION_MESSAGE_REQUIRED: 'This field is required',
} as const;

// Icon constants
export const ICON_CONSTANTS = {
  LOADING: 'pi pi-spin pi-spinner',
  USER: 'pi pi-user',
  USERS: 'pi pi-users',
  CHURCH: 'pi pi-building',
  CALENDAR: 'pi pi-calendar',
  DASHBOARD: 'pi pi-chart-bar',
  SETTINGS: 'pi pi-cog',
  LOGOUT: 'pi pi-sign-out',
  MENU: 'pi pi-bars',
  CLOSE: 'pi pi-times',
  CHECK: 'pi pi-check',
  EDIT: 'pi pi-pencil',
  DELETE: 'pi pi-trash',
  ADD: 'pi pi-plus',
  SEARCH: 'pi pi-search',
  FILTER: 'pi pi-filter',
  ARROW_LEFT: 'pi pi-arrow-left',
  ARROW_RIGHT: 'pi pi-arrow-right',
} as const;

// Local storage keys
export const CONST = {
  ACCESS_TOKEN: 'ACCESS_TOKEN',
  REFRESH_TOKEN: 'REFRESH_TOKEN',
  AUTHENTICATED_USER: 'AUTHENTICATED_USER',
  THEME: 'theme-preference',
  LANGUAGE: 'language-preference',
} as const;

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  SIGNIN: '/signin',
  DASHBOARD: '/church-campus-admin/dashboard',
  CHURCH_DETAIL: '/church-campus-admin/church-detail',
  CHURCH_INFO: '/church-campus-admin/church-detail/church-info',
  PASTORAL_STAFFS: '/church-campus-admin/church-detail/pastoral-staffs',
  CHURCH_CONFIG: '/church-campus-admin/church-detail/church-config',
  CHURCH_MEMBERS: '/church-campus-admin/church-members',
  MEN_NETWORK: '/church-campus-admin/church-members/men-network',
  WOMEN_NETWORK: '/church-campus-admin/church-members/women-network',
  CREATE_MEMBER: '/church-campus-admin/church-members/create',
  CHURCH_CAMPAIGNS: '/church-campus-admin/church-campaigns',
  SERMON_NOTES: '/sermon-notes',
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

// Validation limits
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  BIO_MAX_LENGTH: 500,
} as const;
