/**
 * Application Messages
 *
 * Centralized message strings for consistency
 */

export const Messages = {
  // Headers
  HEADER_GENERIC_ERROR: 'Error',
  HEADER_AUTHENTICATION_FAILED_ERROR: 'Authentication Failed',
  HEADER_ACCESS_RESTRICTED: 'Access Restricted',
  HEADER_SUCCESS: 'Success',
  HEADER_WARNING: 'Warning',
  HEADER_INFO: 'Information',

  // Authentication messages
  MESSAGE_LOGIN_SUCCESSFUL: 'Login successful! Welcome back.',
  MESSAGE_LOGOUT_SUCCESSFUL: 'You have been logged out successfully.',
  MESSAGE_EXPIREED_REFRESH_TOKEN: 'Your session has expired. Please login again.',
  MESSAGE_INVALID_CREDENTIALS: 'Invalid email or password.',
  MESSAGE_UNAUTHORIZED: 'You are not authorized to access this resource.',

  // Generic messages
  MESSAGE_GENERIC_ERROR: 'Something went wrong. Please try again.',
  MESSAGE_NETWORK_ERROR: 'Network error. Please check your connection.',
  MESSAGE_LOADING: 'Loading...',
  MESSAGE_SAVING: 'Saving...',
  MESSAGE_DELETING: 'Deleting...',

  // CRUD messages
  MESSAGE_CREATE_SUCCESS: 'Record created successfully.',
  MESSAGE_UPDATE_SUCCESS: 'Record updated successfully.',
  MESSAGE_DELETE_SUCCESS: 'Record deleted successfully.',
  MESSAGE_FETCH_ERROR: 'Failed to fetch data.',

  // Member messages
  MESSAGE_MEMBER_CREATED: 'Member created successfully.',
  MESSAGE_MEMBER_UPDATED: 'Member updated successfully.',
  MESSAGE_MEMBER_DELETED: 'Member deleted successfully.',

  // Church messages
  MESSAGE_CHURCH_UPDATED: 'Church information updated successfully.',
  MESSAGE_CAMPUS_UPDATED: 'Campus information updated successfully.',

  // Validation messages
  MESSAGE_REQUIRED_FIELD: 'This field is required.',
  MESSAGE_INVALID_EMAIL: 'Please enter a valid email address.',
  MESSAGE_PASSWORD_TOO_SHORT: 'Password must be at least 8 characters.',
  MESSAGE_PASSWORDS_DONT_MATCH: 'Passwords do not match.',
  MESSAGE_INVALID_PHONE: 'Please enter a valid phone number.',

  // Form messages
  MESSAGE_FORM_INVALID: 'Please fix the errors in the form.',
  MESSAGE_UNSAVED_CHANGES: 'You have unsaved changes. Are you sure you want to leave?',
  MESSAGE_CONFIRM_DELETE: 'Are you sure you want to delete this record?',
} as const;
