// Re-export the shared notification API for backward compatibility
// This file now acts as a bridge to the unified notification system
export {
  notificationApi,
  type NotificationListParams,
  type NotificationApiResponse,
  type Notification,
  type NotificationResponse,
  type UnreadCountResponse,
} from '@/src/services/shared/notificationApi';