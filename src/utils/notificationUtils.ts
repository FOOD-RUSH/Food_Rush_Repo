import type { Notification } from '@/src/types';

/**
 * Utility functions for notification handling
 */

/**
 * Generate a mock notification for testing
 */
export const createMockNotification = (
  type: Notification['type'] = 'SYSTEM',
  title: string = 'Test Notification',
  body: string = 'This is a test notification',
  data?: Notification['data'],
): Notification => {
  return {
    id: `ntf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title,
    body,
    type,
    data,
    readAt: null,
    createdAt: new Date().toISOString(),
  };
};

/**
 * Create notification for order updates
 */
export const createOrderNotification = (
  orderId: string,
  status: string,
  restaurantName?: string,
): Notification => {
  const getOrderMessage = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return `Your order has been confirmed${restaurantName ? ` by ${restaurantName}` : ''}`;
      case 'preparing':
        return `Your order is being prepared${restaurantName ? ` by ${restaurantName}` : ''}`;
      case 'ready':
        return `Your order is ready for pickup${restaurantName ? ` at ${restaurantName}` : ''}`;
      case 'picked_up':
        return 'Your order has been picked up and is on the way';
      case 'delivered':
        return 'Your order has been delivered successfully';
      case 'cancelled':
        return 'Your order has been cancelled';
      default:
        return `Your order status has been updated to ${status}`;
    }
  };

  return createMockNotification(
    'ORDER',
    'Order Update',
    getOrderMessage(status),
    { orderId },
  );
};

/**
 * Create notification for delivery updates
 */
export const createDeliveryNotification = (
  orderId: string,
  message: string,
  estimatedTime?: string,
): Notification => {
  return createMockNotification(
    'DELIVERY',
    'Delivery Update',
    `${message}${estimatedTime ? ` ETA: ${estimatedTime}` : ''}`,
    { orderId },
  );
};

/**
 * Create notification for promotions
 */
export const createPromotionNotification = (
  title: string,
  message: string,
  restaurantId?: string,
): Notification => {
  return createMockNotification(
    'PROMOTION',
    title,
    message,
    restaurantId ? { restaurantId } : undefined,
  );
};

/**
 * Create system notification
 */
export const createSystemNotification = (
  title: string,
  message: string,
): Notification => {
  return createMockNotification('SYSTEM', title, message);
};

/**
 * Format notification time for display
 */
export const formatNotificationTime = (createdAt: string): string => {
  const date = new Date(createdAt);
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60),
  );

  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInMinutes < 1440) {
    // 24 hours
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `${days}d ago`;
  }
};

/**
 * Check if notification is unread
 */
export const isNotificationUnread = (notification: Notification): boolean => {
  return !notification.readAt;
};

/**
 * Get notification icon name based on type
 */
export const getNotificationIcon = (type: Notification['type']): string => {
  switch (type) {
    case 'ORDER':
      return 'receipt-outline';
    case 'DELIVERY':
      return 'bicycle-outline';
    case 'PROMOTION':
      return 'pricetag-outline';
    case 'SYSTEM':
      return 'information-circle-outline';
    default:
      return 'notifications-outline';
  }
};

/**
 * Get notification priority for sorting
 */
export const getNotificationPriority = (type: Notification['type']): number => {
  switch (type) {
    case 'ORDER':
      return 1; // Highest priority
    case 'DELIVERY':
      return 2;
    case 'SYSTEM':
      return 3;
    case 'PROMOTION':
      return 4; // Lowest priority
    default:
      return 5;
  }
};

/**
 * Sort notifications by priority and time
 */
export const sortNotifications = (
  notifications: Notification[],
): Notification[] => {
  return [...notifications].sort((a, b) => {
    // First sort by read status (unread first)
    const aUnread = isNotificationUnread(a) ? 0 : 1;
    const bUnread = isNotificationUnread(b) ? 0 : 1;

    if (aUnread !== bUnread) {
      return aUnread - bUnread;
    }

    // Then by priority
    const aPriority = getNotificationPriority(a.type);
    const bPriority = getNotificationPriority(b.type);

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    // Finally by time (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};
