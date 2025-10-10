import { AxiosError } from 'axios';
import i18n from '@/src/locales/i18n';

export interface ApiError extends Error {
  message: string;
  status?: number;
  code?: string;
  isApiError?: true;
}

// Type guard to check if error is AxiosError
const isAxiosError = (error: any): error is AxiosError => {
  return error && typeof error === 'object' && error.isAxiosError === true;
};

// Safely get status from various error types
const getErrorStatus = (error: any): number | undefined => {
  if (isAxiosError(error)) {
    return error.response?.status;
  }
  return error?.status || error?.response?.status;
};

// Safely get server message from various error types
const getServerMessage = (error: any): string | undefined => {
  if (isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  return error?.response?.data?.message || error?.message;
};

// Get user-friendly error message based on status code
export const getUserFriendlyErrorMessage = (error: any): string => {
  const status = getErrorStatus(error);
  const serverMessage = getServerMessage(error);

  // In development, show server messages if available and meaningful
  if (
    __DEV__ &&
    serverMessage &&
    typeof serverMessage === 'string' &&
    serverMessage.trim()
  ) {
    return serverMessage;
  }

  // In production, return generic messages based on status
  try {
    switch (status) {
      case 400:
        return i18n.t('errors.validation_failed', {
          defaultValue: 'Please check your input and try again.',
        });
      case 401:
        return i18n.t('errors.authentication_failed', {
          defaultValue: 'Authentication failed. Please log in again.',
        });
      case 403:
        return i18n.t('errors.access_denied', {
          defaultValue: 'Access denied. You do not have permission.',
        });
      case 404:
        return i18n.t('errors.resource_not_found', {
          defaultValue: 'The requested resource was not found.',
        });
      case 408:
        return i18n.t('errors.request_timeout', {
          defaultValue: 'Request timed out. Please try again.',
        });
      case 422:
        return i18n.t('errors.validation_failed', {
          defaultValue: 'Invalid data provided. Please check your input.',
        });
      case 429:
        return i18n.t('errors.too_many_requests', {
          defaultValue: 'Too many requests. Please wait and try again.',
        });
      case 500:
        return i18n.t('errors.server_error', {
          defaultValue: 'Server error occurred. Please try again later.',
        });
      case 502:
      case 503:
      case 504:
        return i18n.t('errors.service_unavailable', {
          defaultValue:
            'Service temporarily unavailable. Please try again later.',
        });
      default:
        // If we have a server message but no specific status handling, use it
        if (
          serverMessage &&
          typeof serverMessage === 'string' &&
          serverMessage.trim()
        ) {
          return serverMessage;
        }
        return i18n.t('errors.unexpected_error', {
          defaultValue: 'An unexpected error occurred. Please try again.',
        });
    }
  } catch (_i18nError) {
    // Fallback if i18n is not available or fails

    // Provide fallback messages without i18n
    switch (status) {
      case 400:
        return 'Please check your input and try again.';
      case 401:
        return 'Authentication failed. Please log in again.';
      case 403:
        return 'Access denied. You do not have permission.';
      case 404:
        return 'The requested resource was not found.';
      case 408:
        return 'Request timed out. Please try again.';
      case 422:
        return 'Invalid data provided. Please check your input.';
      case 429:
        return 'Too many requests. Please wait and try again.';
      case 500:
        return 'Server error occurred. Please try again later.';
      case 502:
      case 503:
      case 504:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return (
          serverMessage || 'An unexpected error occurred. Please try again.'
        );
    }
  }
};

// Check if error is network related
export const isNetworkError = (error: any): boolean => {
  if (isAxiosError(error)) {
    return !error.response; // Network errors don't have response
  }
  return (
    !error?.response ||
    error?.code === 'NETWORK_ERROR' ||
    error?.code === 'ECONNABORTED'
  );
};

// Check if error is authentication related
export const isAuthError = (error: any): boolean => {
  const status = getErrorStatus(error);
  return status === 401;
};

// Check if error is validation related
export const isValidationError = (error: any): boolean => {
  const status = getErrorStatus(error);
  return status === 400 || status === 422;
};

// Check if error is server error
export const isServerError = (error: any): boolean => {
  const status = getErrorStatus(error);
  return status !== undefined && status >= 500;
};

// Log error for debugging (only in development)
export const logError = (error: any, context?: string): void => {
  if (__DEV__) {
    const prefix = context ? `[${context}]` : '[Error]';

    if (isAxiosError(error)) {
      console.error(`${prefix} Axios Error:`, {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        code: error.code,
        url: error.config?.url,
        method: error.config?.method,
      });
    } else {
      console.error(`${prefix} Error:`, {
        message: error?.message,
        status: error?.status,
        code: error?.code,
        stack: error?.stack,
      });
    }
  }
};

// Simple error handler for API responses
export const handleApiError = (error: any): ApiError => {
  logError(error, 'API');

  const apiError = new Error(getUserFriendlyErrorMessage(error)) as ApiError;
  apiError.status = getErrorStatus(error);
  apiError.code = error?.response?.data?.code || error?.code || 'UNKNOWN_ERROR';
  apiError.isApiError = true;

  return apiError;
};

// Create standardized error for consistent error handling
export const createApiError = (
  message: string,
  status?: number,
  code?: string,
): ApiError => {
  const error = new Error(message) as ApiError;
  error.status = status;
  error.code = code || 'API_ERROR';
  error.isApiError = true;
  return error;
};

// Retry helper for transient errors
export const shouldRetry = (
  error: any,
  attemptNumber: number,
  maxAttempts: number = 3,
): boolean => {
  if (attemptNumber >= maxAttempts) {
    return false;
  }

  // Retry on network errors
  if (isNetworkError(error)) {
    return true;
  }

  // Retry on specific server errors
  const status = getErrorStatus(error);
  return (
    status === 408 ||
    status === 429 ||
    status === 502 ||
    status === 503 ||
    status === 504
  );
};
