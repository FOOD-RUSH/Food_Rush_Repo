// Restaurant stores index
export * from './restaurantProfileStore';

// Re-export shared notification store for restaurant use
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
