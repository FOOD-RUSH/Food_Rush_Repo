// src/services/notifications/NotificationService.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface LocalNotificationData {
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: boolean;
  scheduleAfter?: number; // seconds from now
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

      console.log(`${this.config.userType} notification service initialized`);
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

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  }

  // Register for push notifications
  async registerForPushNotifications(): Promise<string | null> {
    if (!Device.isDevice) return null;

    try {
      const projectId =
        Constants.expoConfig?.extra?.eas?.projectId ??
        Constants.easConfig?.projectId;

      if (!projectId) {
        throw new Error('Project ID not found in app config');
      }

      const token = await Notifications.getExpoPushTokenAsync({ projectId });
      this.expoPushToken = token.data;

      // Send token to backend
      await this.sendTokenToBackend(token.data);
      return token.data;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  // Send token to backend
  private async sendTokenToBackend(token: string): Promise<void> {
    try {
      const { apiClient } = await import('../services/shared/apiClient');
      
      await apiClient.post('/notifications/device', {
        token,
        platform: Platform.OS,
        userType: this.config.userType,
        userId: this.config.userId,
      });

      console.log('Push token registered with backend');
    } catch (error) {
      console.error('Error registering push token:', error);
    }
  }

  // Setup notification listeners
  private setupNotificationListeners(): void {
    // Handle notifications when app is in foreground
    Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification.request.content.title);
      this.handleNotificationReceived(notification);
    });

    // Handle notification taps
    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification tapped:', response.notification.request.content.title);
      this.handleNotificationTap(response.notification.request.content.data);
    });
  }

  // Handle notification received
  private handleNotificationReceived(notification: Notifications.Notification): void {
    // Add to notification store
    try {
      const { useNotificationStore } = require('../stores/shared/notificationStore');
      const { addNotification } = useNotificationStore.getState();
      
      const notificationData = {
        id: notification.request.identifier,
        title: notification.request.content.title || '',
        body: notification.request.content.body || '',
        type: notification.request.content.data?.type || 'system',
        priority: notification.request.content.data?.priority || 'medium',
        data: notification.request.content.data,
        readAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      addNotification(notificationData);
      this.updateBadgeCount();
    } catch (error) {
      console.warn('Could not add notification to store:', error);
    }
  }

  // Handle notification tap
  private handleNotificationTap(data: any): void {
    if (data?.orderId) {
      // TODO: Navigate to order details
      console.log('Navigate to order:', data.orderId);
    }
    if (data?.restaurantId) {
      // TODO: Navigate to restaurant
      console.log('Navigate to restaurant:', data.restaurantId);
    }
  }

  // Send local notification
  async sendLocalNotification(data: LocalNotificationData): Promise<string> {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: data.title,
        body: data.body,
        data: { 
          ...data.data, 
          userType: this.config.userType,
          timestamp: Date.now()
        },
        sound: data.sound !== false,
      },
      trigger: data.scheduleAfter ? { seconds: data.scheduleAfter } : null,
    });

    return notificationId;
  }

  // Send order notification
  async sendOrderNotification(orderId: string, status: string, details?: any): Promise<string> {
    const messages = this.getOrderMessages();
    const message = messages[this.config.userType]?.[status];
    
    if (!message) {
      throw new Error(`Unknown order status: ${status} for ${this.config.userType}`);
    }

    return this.sendLocalNotification({
      title: message.title,
      body: message.body
        .replace('{orderId}', orderId)
        .replace('{customerName}', details?.customerName || 'Customer')
        .replace('{restaurantName}', details?.restaurantName || 'Restaurant'),
      data: {
        type: 'order',
        orderId,
        status,
        ...details,
      },
    });
  }

  // Get order messages for different user types
  private getOrderMessages() {
    return {
      customer: {
        pending: { title: 'Order Placed', body: 'Your order #{orderId} is being processed' },
        confirmed: { title: 'Order Confirmed', body: 'Your order #{orderId} from {restaurantName} has been confirmed' },
        preparing: { title: 'Preparing Order', body: 'Your order #{orderId} is being prepared' },
        ready: { title: 'Order Ready', body: 'Your order #{orderId} is ready for pickup!' },
        out_for_delivery: { title: 'Out for Delivery', body: 'Your order #{orderId} is on its way!' },
        delivered: { title: 'Order Delivered', body: 'Your order #{orderId} has been delivered. Enjoy!' },
        cancelled: { title: 'Order Cancelled', body: 'Your order #{orderId} has been cancelled' },
      },
      restaurant: {
        pending: { title: 'New Order', body: 'New order #{orderId} from {customerName}' },
        confirmed: { title: 'Order Confirmed', body: 'Order #{orderId} confirmed. Start preparing' },
        preparing: { title: 'Preparing Order', body: 'Order #{orderId} is being prepared' },
        ready: { title: 'Order Ready', body: 'Order #{orderId} is ready for pickup' },
        out_for_delivery: { title: 'Order Picked Up', body: 'Order #{orderId} has been picked up' },
        delivered: { title: 'Order Delivered', body: 'Order #{orderId} delivered successfully' },
        cancelled: { title: 'Order Cancelled', body: 'Order #{orderId} has been cancelled' },
      },
    };
  }

  // Send promotion notification
  async sendPromotionNotification(title: string, message: string, data?: any): Promise<string> {
    return this.sendLocalNotification({
      title: `🎉 ${title}`,
      body: message,
      data: { type: 'promotion', ...data },
    });
  }

  // Schedule reminder
  async scheduleReminder(title: string, message: string, minutesFromNow: number, data?: any): Promise<string> {
    return this.sendLocalNotification({
      title: `⏰ ${title}`,
      body: message,
      data: { type: 'reminder', ...data },
      scheduleAfter: minutesFromNow * 60,
    });
  }

  // Cancel notification
  async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  // Cancel notifications by data filter
  async cancelNotificationsByData(filter: Record<string, any>): Promise<void> {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    
    for (const notification of scheduled) {
      const data = notification.content.data || {};
      let shouldCancel = true;

      for (const [key, value] of Object.entries(filter)) {
        if (data[key] !== value) {
          shouldCancel = false;
          break;
        }
      }

      if (shouldCancel) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
  }

  // Update badge count
  private async updateBadgeCount(): Promise<void> {
    try {
      const { useNotificationStore } = require('../stores/shared/notificationStore');
      const { unreadCount } = useNotificationStore.getState();
      await Notifications.setBadgeCountAsync(unreadCount || 0);
    } catch (error) {
      console.warn('Could not update badge count:', error);
    }
  }

  // Clear badge
  async clearBadge(): Promise<void> {
    await Notifications.setBadgeCountAsync(0);
  }

  // Get push token
  getExpoPushToken(): string | null {
    return this.expoPushToken;
  }

  // Check if initialized
  isServiceInitialized(): boolean {
    return this.isInitialized;
  }

  // Test notification
  async sendTestNotification(): Promise<string> {
    return this.sendLocalNotification({
      title: `🧪 Test - ${this.config.userType}`,
      body: `Test notification for ${this.config.userType} app`,
      data: { type: 'test', timestamp: Date.now() },
    });
  }
}

export default NotificationService;
