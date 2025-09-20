// Re-export the shared notification store for backward compatibility
// This file now acts as a bridge to the unified notification system
export {
  useNotificationStore,
  useNotifications,
  useUnreadCount,
  useNotificationLoading,
  useNotificationLoadingMore,
  useNotificationError,
  useNotificationHasNextPage,
  useNotificationTotal,
  useNotificationFilter,
} from '@/src/stores/shared/notificationStore';

// Export types for backward compatibility
export type {
  Notification,
  NotificationResponse,
  UnreadCountResponse,
} from '@/src/services/shared/notificationApi';