// Export all notification services
export { default as NotificationService } from './NotficationService';
export {
  default as CustomerNotificationService,
  customerNotifications,
} from './CustomerNotificationService';
export {
  default as RestaurantNotificationService,
  restaurantNotifications,
} from './RestaurantNotificationService';

// Export types
export type {
  LocalNotificationData,
  OrderNotification,
  NotificationConfig,
} from './NotficationService';

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
    const RestaurantNotificationService =
      require('./RestaurantNotificationService').default;
    return new RestaurantNotificationService(userId);
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
