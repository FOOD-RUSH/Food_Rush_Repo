// src/hooks/useNotifications.ts
// This hook is now deprecated in favor of the NotificationProvider pattern
// Use useNotifications from '@/src/contexts/SimpleNotificationProvider' instead

import { useNotifications as useNotificationsFromProvider } from '@/src/contexts/SimpleNotificationProvider';

/**
 * @deprecated Use useNotifications from '@/src/contexts/SimpleNotificationProvider' instead
 * This hook is kept for backward compatibility but will be removed in future versions
 */
export const useNotifications = () => {
  console.warn(
    'useNotifications from @/src/hooks/useNotifications is deprecated. ' +
    'Use useNotifications from @/src/contexts/SimpleNotificationProvider instead.'
  );
  return useNotificationsFromProvider();
};

// Export individual hooks for specific use cases
export { useUnreadNotificationCount } from '@/src/hooks/shared/useUnreadNotificationCount';
export { usePushNotifications } from '@/src/hooks/shared/usePushNotifications';

export default useNotifications;
