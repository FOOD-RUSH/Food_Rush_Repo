// Export the unified notification service
export { default as NotificationService } from './NotficationService';
export {
  default as CustomerNotificationService,
  customerNotifications,
} from './CustomerNotificationService';

// Export restaurant notification service from new location
export { 
  restaurantNotificationService,
  default as RestaurantNotificationService 
} from '@/src/services/restaurant/restaurantNotificationService';

// Export types
export type {
  LocalNotificationData,
  OrderNotification,
  NotificationConfig,
} from './NotficationService';

export type {
  RestaurantNotificationData,
  LocalNotificationPayload,
} from '@/src/services/restaurant/restaurantNotificationService';

// Convenience function to get the appropriate notification service
export const getNotificationService = (
  userType: 'customer' | 'restaurant',
  userId?: string,
) => {
  if (userType === 'customer') {
    const CustomerNotificationService =
      require('@/src/notifications/CustomerNotificationService').default;
    return new CustomerNotificationService(userId);
  } else {
    // Return the singleton restaurant notification service
    const { restaurantNotificationService } = 
      require('@/src/services/restaurant/restaurantNotificationService');
    return restaurantNotificationService;
  }
};

// Initialize notification service based on user type
export const initializeNotifications = async (
  userType: 'customer' | 'restaurant',
  userId?: string,
): Promise<boolean> => {
  const service = getNotificationService(userType, userId);
  return await service.initialize();
};
