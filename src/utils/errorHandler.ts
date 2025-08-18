// Error handling utilities for the food delivery app

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

// Common error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Your session has expired. Please log in again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  TIMEOUT: 'Request timed out. Please try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

// Error codes mapping
export const ERROR_CODES = {
  // Authentication errors
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  
  // Validation errors
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  INVALID_INPUT: 'INVALID_INPUT',
  
  // Resource errors
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',
  
  // Payment errors
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  
  // Location errors
  LOCATION_PERMISSION_DENIED: 'LOCATION_PERMISSION_DENIED',
  LOCATION_UNAVAILABLE: 'LOCATION_UNAVAILABLE',
};

// Function to handle API errors
export const handleApiError = (error: any): ApiError => {
  // If it's already an ApiError, return it
  if (error && typeof error === 'object' && 'message' in error) {
    return error as ApiError;
  }
  
  // Handle network errors
  if (!error.response) {
    return {
      message: ERROR_MESSAGES.NETWORK_ERROR,
      code: 'NETWORK_ERROR',
    };
  }
  
  // Handle different status codes
  const { status, data } = error.response;
  
  switch (status) {
    case 400:
      return {
        message: data?.message || ERROR_MESSAGES.VALIDATION_ERROR,
        status,
        code: data?.code || ERROR_CODES.VALIDATION_FAILED,
        details: data?.details,
      };
      
    case 401:
      return {
        message: data?.message || ERROR_MESSAGES.UNAUTHORIZED,
        status,
        code: data?.code || ERROR_CODES.INVALID_CREDENTIALS,
      };
      
    case 403:
      return {
        message: data?.message || ERROR_MESSAGES.FORBIDDEN,
        status,
        code: data?.code || 'FORBIDDEN',
      };
      
    case 404:
      return {
        message: data?.message || ERROR_MESSAGES.NOT_FOUND,
        status,
        code: data?.code || ERROR_CODES.RESOURCE_NOT_FOUND,
      };
      
    case 409:
      return {
        message: data?.message || 'Conflict occurred',
        status,
        code: data?.code || ERROR_CODES.RESOURCE_CONFLICT,
      };
      
    case 500:
      return {
        message: data?.message || ERROR_MESSAGES.SERVER_ERROR,
        status,
        code: data?.code || 'SERVER_ERROR',
      };
      
    default:
      return {
        message: data?.message || ERROR_MESSAGES.UNKNOWN_ERROR,
        status,
        code: data?.code || 'UNKNOWN_ERROR',
      };
  }
};

// Function to extract error message for display
export const getErrorMessage = (error: any): string => {
  const apiError = handleApiError(error);
  return apiError.message;
};

// Function to check if error is related to network
export const isNetworkError = (error: any): boolean => {
  return !error.response || error.code === 'NETWORK_ERROR';
};

// Function to check if error is related to authentication
export const isAuthError = (error: any): boolean => {
  const apiError = handleApiError(error);
  return apiError.status === 401 || apiError.code === ERROR_CODES.INVALID_CREDENTIALS;
};

// Function to check if error is related to validation
export const isValidationError = (error: any): boolean => {
  const apiError = handleApiError(error);
  return apiError.status === 400 || apiError.code === ERROR_CODES.VALIDATION_FAILED;
};

// Function to create a user-friendly error message
export const createUserFriendlyError = (error: any): string => {
  const apiError = handleApiError(error);
  
  // Map specific error codes to user-friendly messages
  switch (apiError.code) {
    case ERROR_CODES.INVALID_CREDENTIALS:
      return 'Invalid email or password. Please try again.';
      
    case ERROR_CODES.EMAIL_NOT_VERIFIED:
      return 'Please verify your email address before logging in.';
      
    case ERROR_CODES.PAYMENT_FAILED:
      return 'Payment failed. Please check your payment details and try again.';
      
    case ERROR_CODES.INSUFFICIENT_FUNDS:
      return 'Insufficient funds. Please check your account balance.';
      
    case ERROR_CODES.LOCATION_PERMISSION_DENIED:
      return 'Location permission denied. Please enable location access in settings.';
      
    default:
      return apiError.message;
  }
};

// Function to log error for debugging
export const logError = (error: any, context: string): void => {
  console.error(`[${context}] Error:`, {
    message: error.message || error,
    code: error.code,
    status: error.status,
    stack: error.stack,
  });
};

// Export all error utilities
export const errorUtils = {
  handleApiError,
  getErrorMessage,
  isNetworkError,
  isAuthError,
  isValidationError,
  createUserFriendlyError,
  logError,
};