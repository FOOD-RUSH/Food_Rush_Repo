// Simple MVP Production-Ready Notification Service
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { apiClient } from '../services/customer/apiClient';

// Configure notification behavior for production
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: false,
  }),
});

export interface LocalNotificationData {
  title: string;
  body: string;
  data?: any;
  scheduleAfter?: number; // seconds from now
}

export interface OrderNotification {
  orderId: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'cancelled';
  customerName?: string;
  restaurantName?: string;
  estimatedTime?: number;
}

export interface NotificationConfig {
  userType: 'customer' | 'restaurant';
  userId?: string;
}

class NotificationService {
  private expoPushToken: string | null = null;
  private config: NotificationConfig;
  private isInitialized: boolean = false;

  constructor(config: NotificationConfig) {
    this.config = config;
  }

  // Initialize notification service
  async initialize(): Promise<boolean> {
    if (this.isInitialized) {
      console.log('Notification service already initialized');
      return true;
    }

    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.warn('Notification permissions denied');
        return false;
      }

      await this.registerForPushNotifications();
      this.setupNotificationListeners();
      this.isInitialized = true;

      console.log(`${this.config.userType} notification service initialized successfully`);
      return true;
    } catch (error) {
      console.error('Failed to initialize notification service:', error);
      return false;
    }
  }

  // Request notification permissions
  async requestPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
      console.warn('Push notifications only work on physical devices');
      return false;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Permission for notifications was denied');
      return false;
    }

    return true;
  }

  // Register for push notifications and get Expo token
  async registerForPushNotifications(): Promise<string | null> {
    if (!Device.isDevice) {
      console.warn('Must use physical device for push notifications');
      return null;
    }

    try {
      const projectId =
        Constants.expoConfig?.extra?.eas?.projectId ??
        Constants.easConfig?.projectId;

      if (!projectId) {
        throw new Error('Project ID not found in app config');
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      this.expoPushToken = token.data;
      console.log('Expo Push Token:', token.data);

      // Send token to backend
      await this.sendTokenToBackend(token.data);

      return token.data;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  // Send token to backend
  async sendTokenToBackend(token: string): Promise<void> {
    try {
      const response = await apiClient.post('/notifications/device', {
        expoPushToken: token,
        platform: Platform.OS,
        userType: this.config.userType,
        userId: this.config.userId,
      });

      console.log('Push token registered successfully with backend');
    } catch (error) {
      console.error('Error registering push token with backend:', error);
      // Don't throw error - app should continue working even if backend registration fails
    }
  }

  // Setup notification listeners
  setupNotificationListeners(): void {
    // Handle notifications when app is in foreground
    Notifications.addNotificationReceivedListener((notification) => {
      console.log(`[${this.config.userType}] Notification received:`, notification.request.content.title);
    });

    // Handle notification taps
    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(`[${this.config.userType}] Notification tapped:`, response.notification.request.content.title);
      const data = response.notification.request.content.data;
      this.handleNotificationTap(data);
    });
  }

  // Handle notification tap actions
  private handleNotificationTap(data: any): void {
    if (data?.orderId) {
      console.log(`Navigate to order details: ${data.orderId}`);
      // TODO: Implement navigation to order details
      // This should be handled by the app's navigation service
    }

    if (data?.type === 'promotion' && data?.promotionId) {
      console.log(`Navigate to promotion: ${data.promotionId}`);
      // TODO: Implement navigation to promotion details
    }
  }

  // Send local notification immediately
  async sendLocalNotification(data: LocalNotificationData): Promise<string> {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: data.title,
        body: data.body,
        data: data.data,
        sound: 'default',
      },
      trigger: data.scheduleAfter ? { seconds: data.scheduleAfter } : null,
    });

    return notificationId;
  }

  // Send order notification (works for both customer and restaurant)
  async sendOrderNotification(orderData: OrderNotification): Promise<string> {
    const { orderId, status, customerName, restaurantName } = orderData;

    // Different messages for customer vs restaurant
    const notifications = this.config.userType === 'customer'
      ? this.getCustomerNotifications(orderId, status, restaurantName)
      : this.getRestaurantNotifications(orderId, status, customerName);

    const notification = notifications[status];
    if (!notification) {
      throw new Error(`Unknown order status: ${status}`);
    }

    return this.sendLocalNotification({
      title: notification.title,
      body: notification.body,
      data: {
        orderId,
        status,
        type: 'order',
        userType: this.config.userType,
      },
    });
  }

  // Customer notification messages
  private getCustomerNotifications(orderId: string, status: string, restaurantName?: string) {
    const restaurant = restaurantName ? ` from ${restaurantName}` : '';

    return {
      pending: {
        title: '🕐 Order Placed',
        body: `Your order #${orderId}${restaurant} is being processed.`,
      },
      confirmed: {
        title: '✅ Order Confirmed',
        body: `Your order #${orderId}${restaurant} has been confirmed and is being prepared.`,
      },
      preparing: {
        title: '👨‍🍳 Preparing Your Order',
        body: `Your order #${orderId}${restaurant} is being prepared with care.`,
      },
      ready: {
        title: '🎉 Order Ready',
        body: `Your order #${orderId}${restaurant} is ready for pickup!`,
      },
      picked_up: {
        title: '🚗 Out for Delivery',
        body: `Your order #${orderId}${restaurant} is on its way to you!`,
      },
      delivered: {
        title: '✅ Order Delivered',
        body: `Your order #${orderId}${restaurant} has been delivered. Enjoy your meal!`,
      },
      cancelled: {
        title: '❌ Order Cancelled',
        body: `Your order #${orderId}${restaurant} has been cancelled.`,
      },
    };
  }

  // Restaurant notification messages
  private getRestaurantNotifications(orderId: string, status: string, customerName?: string) {
    const customer = customerName ? ` for ${customerName}` : '';

    return {
      pending: {
        title: '🔔 New Order',
        body: `New order #${orderId}${customer} received. Please confirm.`,
      },
      confirmed: {
        title: '✅ Order Confirmed',
        body: `Order #${orderId}${customer} confirmed. Start preparing.`,
      },
      preparing: {
        title: '👨‍🍳 Preparing Order',
        body: `Order #${orderId}${customer} is being prepared.`,
      },
      ready: {
        title: '🎉 Order Ready',
        body: `Order #${orderId}${customer} is ready for pickup.`,
      },
      picked_up: {
        title: '🚗 Order Picked Up',
        body: `Order #${orderId}${customer} has been picked up for delivery.`,
      },
      delivered: {
        title: '✅ Order Delivered',
        body: `Order #${orderId}${customer} has been delivered successfully.`,
      },
      cancelled: {
        title: '❌ Order Cancelled',
        body: `Order #${orderId}${customer} has been cancelled.`,
      },
    };
  }

  // Send promotion notification
  async sendPromotionNotification(title: string, message: string, promotionId?: string): Promise<string> {
    return this.sendLocalNotification({
      title: `🎉 ${title}`,
      body: message,
      data: {
        type: 'promotion',
        promotionId,
        userType: this.config.userType,
      },
    });
  }

  // Schedule reminder notification
  async scheduleReminder(
    title: string,
    message: string,
    minutesFromNow: number,
    data?: any
  ): Promise<string> {
    return this.sendLocalNotification({
      title: `⏰ ${title}`,
      body: message,
      data: {
        type: 'reminder',
        userType: this.config.userType,
        ...data
      },
      scheduleAfter: minutesFromNow * 60,
    });
  }

  // Cancel scheduled notification
  async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  // Cancel notifications by type or data
  async cancelNotificationsByData(filterData: any): Promise<void> {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();

    for (const notification of scheduledNotifications) {
      const notificationData = notification.content.data;
      let shouldCancel = true;

      // Check if all filter criteria match
      for (const [key, value] of Object.entries(filterData)) {
        if (notificationData?.[key] !== value) {
          shouldCancel = false;
          break;
        }
      }

      if (shouldCancel) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
  }

  // Cancel all notifications
  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  // Get notification statistics
  async getNotificationStats(): Promise<{
    scheduled: number;
    delivered: number;
    permissions: Notifications.NotificationPermissionsStatus;
  }> {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const permissions = await Notifications.getPermissionsAsync();

    return {
      scheduled: scheduled.length,
      delivered: 0, // This would need to be tracked separately
      permissions,
    };
  }
  // Get current push token
  getExpoPushToken(): string | null {
    return this.expoPushToken;
  }

  // Check if service is initialized
  isServiceInitialized(): boolean {
    return this.isInitialized;
  }

  // Get user type
  getUserType(): 'customer' | 'restaurant' {
    return this.config.userType;
  }
}

// Export singleton instances for customer and restaurant
export const customerNotificationService = new NotificationService({ userType: 'customer' });
export const restaurantNotificationService = new NotificationService({ userType: 'restaurant' });

export default NotificationService;
