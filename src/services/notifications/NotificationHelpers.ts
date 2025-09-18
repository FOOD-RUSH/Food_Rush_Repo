import { notificationService } from './NotificationService';

// Order status notifications for customers
export const sendOrderStatusNotification = async (
  orderId: string,
  status: 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled',
  restaurantName?: string
): Promise<void> => {
  const notifications = {
    confirmed: {
      title: '✅ Order Confirmed',
      body: `Your order #${orderId}${restaurantName ? ` from ${restaurantName}` : ''} has been confirmed!`,
    },
    preparing: {
      title: '👨‍🍳 Order Being Prepared',
      body: `Your order #${orderId} is being prepared with care.`,
    },
    ready: {
      title: '🎉 Order Ready!',
      body: `Your order #${orderId} is ready for pickup!`,
    },
    delivered: {
      title: '✅ Order Delivered',
      body: `Your order #${orderId} has been delivered. Enjoy your meal!`,
    },
    cancelled: {
      title: '❌ Order Cancelled',
      body: `Your order #${orderId} has been cancelled.`,
    },
  };

  const notification = notifications[status];
  if (notification) {
    await notificationService.sendLocalNotification({
      ...notification,
      data: {
        type: 'order_status',
        orderId,
        status,
        screen: 'OrderDetails',
      },
    });
  }
};

// New order notifications for restaurants
export const sendNewOrderNotification = async (
  orderId: string,
  customerName?: string
): Promise<void> => {
  await notificationService.sendLocalNotification({
    title: '🔔 New Order Received',
    body: `New order #${orderId}${customerName ? ` from ${customerName}` : ''} needs your attention.`,
    data: {
      type: 'new_order',
      orderId,
      screen: 'OrderDetails',
    },
  });
};

// Cart reminder notifications
export const scheduleCartReminder = async (
  itemCount: number,
  restaurantName?: string,
  minutesFromNow: number = 30
): Promise<string | null> => {
  const itemText = itemCount === 1 ? 'item' : 'items';
  const restaurantText = restaurantName ? ` from ${restaurantName}` : '';

  return await notificationService.scheduleNotification({
    title: '🛒 Don\'t Forget Your Cart!',
    body: `You have ${itemCount} ${itemText}${restaurantText} waiting for you.`,
    data: {
      type: 'cart_reminder',
      screen: 'Cart',
    },
    trigger: {
      seconds: minutesFromNow * 60,
    },
  });
};

// Promotion notifications
export const sendPromotionNotification = async (
  title: string,
  message: string,
  promotionId?: string
): Promise<void> => {
  await notificationService.sendLocalNotification({
    title: `🎉 ${title}`,
    body: message,
    data: {
      type: 'promotion',
      promotionId,
      screen: 'Promotions',
    },
  });
};

// General app notifications
export const sendGeneralNotification = async (
  title: string,
  message: string,
  data?: Record<string, any>
): Promise<void> => {
  await notificationService.sendLocalNotification({
    title,
    body: message,
    data: {
      type: 'general',
      ...data,
    },
  });
};

// Cancel cart reminders
export const cancelCartReminders = async (): Promise<void> => {
  // For now, cancel all notifications
  // In a more sophisticated setup, you'd track cart reminder IDs
  await notificationService.cancelAllNotifications();
};

// Track initialized users to prevent duplicate initialization
const initializedUsers = new Set<string>();

// Initialize notifications for user
export const initializeNotificationsForUser = async (
  userId: string,
  userType: 'customer' | 'restaurant'
): Promise<boolean> => {
  const userKey = `${userId}-${userType}`;
  
  // Check if already initialized for this user
  if (initializedUsers.has(userKey)) {
    return true;
  }
  
  const initialized = await notificationService.initialize();
  
  if (initialized) {
    // Register token with backend for push notifications
    await notificationService.registerTokenWithBackend(userId, userType);
    initializedUsers.add(userKey);
  }
  
  return initialized;
};