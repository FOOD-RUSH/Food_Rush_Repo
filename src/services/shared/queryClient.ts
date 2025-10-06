import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error: any) => {
        // Handle session expired errors globally
        if (
          error?.code === 'SESSION_EXPIRED' ||
          error?.message?.includes('session has expired')
        ) {
          // Don't show error to user, let the app handle logout
          return;
        }
        // For other errors, they can be handled by individual components
      },
    },
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on session expired errors
        if (
          error?.code === 'SESSION_EXPIRED' ||
          error?.message?.includes('session has expired')
        ) {
          return false;
        }
        // Retry other errors up to 3 times
        return failureCount < 3;
      },
    },
  },
});
