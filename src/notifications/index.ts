// src/services/notifications/index.ts
import NotificationService from './NotificationService';

// Create singleton instances for each user type
export const customerNotificationService = new NotificationService({
  userType: 'customer',
});

export const restaurantNotificationService = new NotificationService({
  userType: 'restaurant',
});

// Get the appropriate service based on user type
export const getNotificationService = (
  userType: 'customer' | 'restaurant',
  userId?: string,
) => {
  if (userType === 'customer') {
    return customerNotificationService;
  }
  return restaurantNotificationService;
};

// Initialize notifications for a user
export const initializeNotifications = async (
  userType: 'customer' | 'restaurant',
  userId?: string,
): Promise<boolean> => {
  const service = getNotificationService(userType, userId);
  return await service.initialize();
};

// Helper functions for common notification operations
export const sendOrderNotification = async (
  userType: 'customer' | 'restaurant',
  orderId: string,
  status: string,
  details?: any,
): Promise<void> => {
  const service = getNotificationService(userType);
  await service.sendOrderNotification(orderId, status, details);
};

export const sendPromotionNotification = async (
  userType: 'customer' | 'restaurant',
  title: string,
  message: string,
  data?: any,
): Promise<void> => {
  const service = getNotificationService(userType);
  await service.sendPromotionNotification(title, message, data);
};

export const scheduleReminder = async (
  userType: 'customer' | 'restaurant',
  title: string,
  message: string,
  minutesFromNow: number,
  data?: any,
): Promise<string | null> => {
  const service = getNotificationService(userType);
  return await service.scheduleReminder(title, message, minutesFromNow, data);
};

// Quick actions for specific use cases
export const sendNewOrderNotification = async (
  orderId: string,
  customerName: string,
  restaurantName?: string,
): Promise<void> => {
  // Send to restaurant
  await sendOrderNotification('restaurant', orderId, 'pending', {
    customerName,
  });

  // Send to customer
  await sendOrderNotification('customer', orderId, 'pending', {
    restaurantName,
  });
};

export const sendOrderStatusUpdate = async (
  orderId: string,
  status: string,
  customerName?: string,
  restaurantName?: string,
): Promise<void> => {
  // Send to customer
  await sendOrderNotification('customer', orderId, status, { restaurantName });

  // Send to restaurant (if needed)
  if (
    [
      'confirmed',
      'preparing',
      'ready',
      'out_for_delivery',
      'delivered',
    ].includes(status)
  ) {
    await sendOrderNotification('restaurant', orderId, status, {
      customerName,
    });
  }
};

// Export the service class and types
export { default as NotificationService } from './NotificationService';
export type {
  LocalNotificationData,
  NotificationConfig,
} from './NotificationService';
