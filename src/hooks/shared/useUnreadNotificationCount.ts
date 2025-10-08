import { useEffect } from 'react';
import { useNotificationStore } from '@/src/stores/shared/notificationStore';
import { useAuthStore } from '@/src/stores/AuthStore';

/**
 * Hook to get and manage unread notification count
 * Automatically updates the count when user is authenticated
 */
export const useUnreadNotificationCount = () => {
  const { unreadCount, updateUnreadCount, isLoading } = useNotificationStore();
  const { isAuthenticated } = useAuthStore();

  // Update unread count when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      updateUnreadCount();
    }
  }, [isAuthenticated, updateUnreadCount]);

  return {
    unreadCount,
    isLoading,
    refresh: updateUnreadCount,
  };
};

export default useUnreadNotificationCount;