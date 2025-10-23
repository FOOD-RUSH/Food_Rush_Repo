import { useEffect } from 'react';
import { useNotificationStore } from '@/src/stores/shared/notificationStore';

/**
 * Minimal hook to expose unread notification count from the store
 * and a method to refresh it from the backend.
 */
export const useUnreadNotificationCount = () => {
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const refreshUnread = useNotificationStore((state) => state.updateUnreadCount);

  useEffect(() => {
    // Prime the count on first use; ignore failures
    refreshUnread().catch(() => {});
  }, [refreshUnread]);

  return { unreadCount, refreshUnread } as const;
};
