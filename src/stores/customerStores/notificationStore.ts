// Customer-specific notification store
// Re-exports the shared notification store with customer-specific enhancements
export * from '../shared/notificationStore';
export { 
  useNotificationStore,
  useNotifications,
  useAllNotifications,
  useUnreadCount,
  useNotificationLoading,
  useNotificationError
} from '../shared/notificationStore';