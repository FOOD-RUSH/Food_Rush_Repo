// Re-export the shared notification hooks for restaurant use
// This file now acts as a bridge to the unified notification system
export {
  useNotifications as useRestaurantNotifications,
  useUnreadNotificationCount as useRestaurantUnreadNotificationCount,
  usePushNotificationRegistration as useRestaurantPushNotifications,
} from '@/src/hooks/shared/useNotifications';

// Legacy exports for backward compatibility
import { useNotifications } from '@/src/hooks/shared/useNotifications';

/**
 * @deprecated Use useNotifications from '@/src/hooks/shared/useNotifications' instead
 * This is kept for backward compatibility
 */
export const useRestaurantNotificationStore = () => {
  console.warn('useRestaurantNotificationStore is deprecated. Use useNotifications from shared hooks instead.');
  return useNotifications();
};