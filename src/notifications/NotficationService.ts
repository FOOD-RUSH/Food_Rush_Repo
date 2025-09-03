import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types for better type safety
export interface NotificationData {
  id?: string;
  type: 'order' | 'promotion' | 'reminder' | 'system' | 'custom';
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: 'default' | 'custom' | null;
  priority?: 'default' | 'high' | 'low';
  categoryId?: string;
}

export interface ScheduledNotification extends NotificationData {
  id: string;
  scheduledTime: number;
  trigger: Notifications.NotificationTriggerInput;
}

export interface NotificationCategory {
  id: string;
  name: string;
  actions: Notifications.NotificationAction[];
}

// Storage keys
const STORAGE_KEYS = {
  PUSH_TOKEN: 'push_token',
  NOTIFICATION_HISTORY: 'notification_history',
  USER_PREFERENCES: 'notification_preferences',
} as const;

// Configure how notifications are handled when the app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: false,
  }),
});

// Notification categories for interactive notifications
const NOTIFICATION_CATEGORIES: NotificationCategory[] = [
  {
    id: 'order_actions',
    name: 'Order Actions',
    actions: [
      {
        identifier: 'view_order',
        buttonTitle: 'View Order',
        options: {
          opensAppToForeground: true,
        },
      },
      {
        identifier: 'track_order',
        buttonTitle: 'Track Order',
        options: {
          opensAppToForeground: true,
        },
      },
    ],
  },
  {
    id: 'promotion_actions',
    name: 'Promotion Actions',
    actions: [
      {
        identifier: 'view_deal',
        buttonTitle: 'View Deal',
        options: {
          opensAppToForeground: true,
        },
      },
      {
        identifier: 'dismiss',
        buttonTitle: 'Dismiss',
        options: {
          opensAppToForeground: false,
        },
      },
    ],
  },
];

class NotificationService {
  private static instance: NotificationService;
  private pushToken: string | null = null;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Initialize notification service
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Set up notification categories
      await this.setupCategories();

      // Load stored push token
      await this.loadStoredToken();

      // Set up notification listeners
      this.setupListeners();

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize notification service:', error);
    }
  }

  // Set up notification categories
  private async setupCategories(): Promise<void> {
    try {
      for (const category of NOTIFICATION_CATEGORIES) {
        await Notifications.setNotificationCategoryAsync(
          category.id,
          category.actions
        );
      }
    } catch (error) {
      console.error('Failed to set up notification categories:', error);
    }
  }

  // Set up notification listeners
  private setupListeners(): void {
    // Handle notification received while app is foregrounded
    Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      this.storeNotificationHistory(notification);
    });

    // Handle notification response (when user interacts with notification)
    Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      this.handleNotificationResponse(response);
    });
  }

  // Request permissions with better error handling
  async requestPermissions(): Promise<boolean> {
    try {
      if (!Device.isDevice) {
        console.warn('Notifications require a physical device');
        return false;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Notification permissions not granted');
        return false;
      }

      // Get and store push token
      await this.getPushToken();
      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  // Get push token for FCM/APNs
  private async getPushToken(): Promise<void> {
    try {
      const token = await Notifications.getExpoPushTokenAsync();
      this.pushToken = token.data;
      await AsyncStorage.setItem(STORAGE_KEYS.PUSH_TOKEN, this.pushToken);
      console.log('Push token obtained:', this.pushToken);
    } catch (error) {
      console.error('Failed to get push token:', error);
    }
  }

  // Load stored push token
  private async loadStoredToken(): Promise<void> {
    try {
      const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.PUSH_TOKEN);
      if (storedToken) {
        this.pushToken = storedToken;
      }
    } catch (error) {
      console.error('Failed to load stored push token:', error);
    }
  }

  // Get current push token
  getCurrentPushToken(): string | null {
    return this.pushToken;
  }

  // Schedule a local notification with enhanced options
  async scheduleNotification(
    notificationData: NotificationData,
    delaySeconds: number = 0
  ): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notificationData.title,
          body: notificationData.body,
          data: {
            ...notificationData.data,
            type: notificationData.type,
            id: notificationData.id,
          },
          sound: notificationData.sound || 'default',
          priority: notificationData.priority === 'high'
            ? Notifications.AndroidNotificationPriority.HIGH
            : Notifications.AndroidNotificationPriority.DEFAULT,
          categoryIdentifier: notificationData.categoryId,
        },
        trigger: delaySeconds > 0 ? { seconds: delaySeconds, repeats: false, type: 'timeInterval' as any } : null,
      });

      // Store scheduled notification info
      await this.storeScheduledNotification({
        ...notificationData,
        id: notificationId,
        scheduledTime: Date.now() + (delaySeconds * 1000),
        trigger: delaySeconds > 0 ? { seconds: delaySeconds, repeats: false, type: 'timeInterval' as any } : null,
      });

      return notificationId;
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      return null;
    }
  }

  // Schedule recurring notification (simplified)
  async scheduleRecurringNotification(
    notificationData: NotificationData,
    intervalSeconds: number,
    hour: number = 9
  ): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      // Schedule multiple notifications for recurring effect
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notificationData.title,
          body: notificationData.body,
          data: {
            ...notificationData.data,
            type: notificationData.type,
            recurring: true,
          },
          sound: notificationData.sound || 'default',
        },
        trigger: { seconds: intervalSeconds, repeats: true, type: 'timeInterval' as any },
      });

      return notificationId;
    } catch (error) {
      console.error('Failed to schedule recurring notification:', error);
      return null;
    }
  }

  // Cancel a specific notification
  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      await this.removeScheduledNotification(notificationId);
    } catch (error) {
      console.error('Failed to cancel notification:', error);
    }
  }

  // Cancel all notifications
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await AsyncStorage.removeItem(STORAGE_KEYS.NOTIFICATION_HISTORY);
    } catch (error) {
      console.error('Failed to cancel all notifications:', error);
    }
  }

  // Get all scheduled notifications
  async getScheduledNotifications(): Promise<ScheduledNotification[]> {
    try {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      return scheduled.map(notification => ({
        id: notification.identifier,
        type: (notification.content.data?.type as any) || 'custom',
        title: notification.content.title || '',
        body: notification.content.body || '',
        data: notification.content.data,
        scheduledTime: Date.now(), // Approximate
        trigger: notification.trigger as any,
      }));
    } catch (error) {
      console.error('Failed to get scheduled notifications:', error);
      return [];
    }
  }

  // Handle notification response
  private handleNotificationResponse(response: Notifications.NotificationResponse): void {
    const { notification, actionIdentifier } = response;
    const data = notification.request.content.data;

    // Handle different action types
    switch (actionIdentifier) {
      case 'view_order':
        // Navigate to order details
        console.log('Navigate to order:', data.orderId);
        break;
      case 'track_order':
        // Navigate to order tracking
        console.log('Navigate to tracking:', data.orderId);
        break;
      case 'view_deal':
        // Navigate to promotion
        console.log('Navigate to promotion:', data.promotionId);
        break;
      default:
        // Default notification tap
        console.log('Notification tapped:', data);
        break;
    }
  }

  // Store notification in history
  private async storeNotificationHistory(notification: Notifications.Notification): Promise<void> {
    try {
      const history = await this.getNotificationHistory();
      const notificationEntry = {
        id: notification.request.identifier,
        title: notification.request.content.title,
        body: notification.request.content.body,
        data: notification.request.content.data,
        receivedAt: Date.now(),
      };

      history.unshift(notificationEntry);

      // Keep only last 100 notifications
      if (history.length > 100) {
        history.splice(100);
      }

      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATION_HISTORY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to store notification history:', error);
    }
  }

  // Store scheduled notification info
  private async storeScheduledNotification(notification: ScheduledNotification): Promise<void> {
    try {
      const scheduled = await this.getStoredScheduledNotifications();
      scheduled.push(notification);
      await AsyncStorage.setItem('scheduled_notifications', JSON.stringify(scheduled));
    } catch (error) {
      console.error('Failed to store scheduled notification:', error);
    }
  }

  // Remove scheduled notification from storage
  private async removeScheduledNotification(notificationId: string): Promise<void> {
    try {
      const scheduled = await this.getStoredScheduledNotifications();
      const filtered = scheduled.filter(n => n.id !== notificationId);
      await AsyncStorage.setItem('scheduled_notifications', JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to remove scheduled notification:', error);
    }
  }

  // Get stored scheduled notifications
  private async getStoredScheduledNotifications(): Promise<ScheduledNotification[]> {
    try {
      const stored = await AsyncStorage.getItem('scheduled_notifications');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to get stored scheduled notifications:', error);
      return [];
    }
  }

  // Get notification history
  async getNotificationHistory(): Promise<any[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_HISTORY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to get notification history:', error);
      return [];
    }
  }

  // Clear notification history
  async clearNotificationHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.NOTIFICATION_HISTORY);
    } catch (error) {
      console.error('Failed to clear notification history:', error);
    }
  }

  // Set notification badge count
  async setBadgeCount(count: number): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('Failed to set badge count:', error);
    }
  }

  // Get current badge count
  async getBadgeCount(): Promise<number> {
    try {
      return await Notifications.getBadgeCountAsync();
    } catch (error) {
      console.error('Failed to get badge count:', error);
      return 0;
    }
  }

  // Convenience methods for common notifications
  async sendOrderUpdateNotification(orderId: string, status: string): Promise<string | null> {
    return this.scheduleNotification({
      type: 'order',
      title: 'Order Update',
      body: `Your order status has been updated to: ${status}`,
      data: { orderId, status },
      categoryId: 'order_actions',
    });
  }

  async sendPromotionNotification(title: string, body: string, promotionId: string): Promise<string | null> {
    return this.scheduleNotification({
      type: 'promotion',
      title,
      body,
      data: { promotionId },
      categoryId: 'promotion_actions',
      priority: 'high',
    });
  }

  async sendReminderNotification(title: string, body: string, data?: any): Promise<string | null> {
    return this.scheduleNotification({
      type: 'reminder',
      title,
      body,
      data,
      sound: 'default',
    });
  }
}

// Export singleton instance
const notificationService = NotificationService.getInstance();
export default notificationService;