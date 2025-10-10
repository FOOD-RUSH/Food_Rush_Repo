import { useEffect, useCallback } from 'react';
import { AppState } from 'react-native';
import { useNotificationStore } from '@/src/stores/shared/notificationStore';
import { useAuthStore } from '@/src/stores/AuthStore';

/**
 * Hook to get and manage unread notification count
 * Automatically updates the count when user is authenticated
 * Refreshes count when app comes to foreground
 */
export const useUnreadNotificationCount = () => {
  const { unreadCount, updateUnreadCount, isLoading } = useNotificationStore();
  const { isAuthenticated } = useAuthStore();

  // Refresh unread count
  const refreshCount = useCallback(async () => {
    if (isAuthenticated) {
      try {
        await updateUnreadCount();
      } catch (error) {
        console.error('Failed to refresh unread count:', error);
      }
    }
  }, [isAuthenticated, updateUnreadCount]);

  // Update unread count when user is authenticated
  useEffect(() => {
    refreshCount();
  }, [refreshCount]);

  // Listen for app state changes and refresh count when app becomes active
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active' && isAuthenticated) {
        // Refresh unread count when app comes to foreground
        refreshCount();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [isAuthenticated, refreshCount]);

  return {
    unreadCount,
    isLoading,
    refresh: refreshCount,
  };
};

export default useUnreadNotificationCount;