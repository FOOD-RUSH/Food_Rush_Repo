import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { notificationApi } from './notificationApi';
import { useAuthStore } from '@/src/stores/AuthStore';
import { useNotificationStore } from '@/src/stores/shared/notificationStore';

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

export interface PushNotificationService {
  registerForPushNotifications: () => Promise<string | null>;
  unregisterPushNotifications: () => Promise<void>;
  getExpoPushToken: () => Promise<string | null>;
  handleNotificationReceived: (notification: Notifications.Notification) => void;
  handleNotificationResponse: (response: Notifications.NotificationResponse) => void;
  requestPermissions: () => Promise<boolean>;
  checkPermissions: () => Promise<boolean>;
  sendLocalNotification: (data: LocalNotificationData) => Promise<string>;
  scheduleReminder: (title: string, message: string, minutesFromNow: number, data?: any) => Promise<string>;
  cancelNotification: (notificationId: string) => Promise<void>;
}

class PushNotificationServiceImpl implements PushNotificationService {
  private expoPushToken: string | null = null;
  private notificationListener: Notifications.Subscription | null = null;
  private responseListener: Notifications.Subscription | null = null;

  constructor() {
    this.setupNotificationListeners();
  }

  private setupNotificationListeners() {
    // Handle notifications received while app is foregrounded
    this.notificationListener = Notifications.addNotificationReceivedListener(
      this.handleNotificationReceived.bind(this),
    );

    // Handle notification responses (user tapped notification)
    this.responseListener = Notifications.addNotificationResponseReceivedListener(
      this.handleNotificationResponse.bind(this),
    );
  }

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

    if (finalStatus !== 'granted') {
      console.warn('Failed to get push token for push notification!');
      return false;
    }

    return true;
  }

  async checkPermissions(): Promise<boolean> {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  }

  async getExpoPushToken(): Promise<string | null> {
    if (this.expoPushToken) {
      return this.expoPushToken;
    }

    if (!Device.isDevice) {
      console.warn('Must use physical device for Push Notifications');
      return null;
    }

    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PROJECT_ID,
      });

      this.expoPushToken = token.data;
      return token.data;
    } catch (error) {
      console.error('Error getting Expo push token:', error);
      return null;
    }
  }

  async registerForPushNotifications(): Promise<string | null> {
    try {
      const token = await this.getExpoPushToken();
      if (!token) {
        return null;
      }

      // Get user info to determine role
      const { user } = useAuthStore.getState();
      if (!user) {
        console.warn('User not authenticated, cannot register push token');
        return null;
      }

      const platform = Platform.OS;
      const role = user.role?.toLowerCase() || 'customer';

      // Register with backend
      await notificationApi.registerDevice(token, platform, role);
      
      console.log('✅ Push notification token registered successfully');
      return token;
    } catch (error) {
      console.error('❌ Error registering push notification token:', error);
      return null;
    }
  }

  async unregisterPushNotifications(): Promise<void> {
    try {
      if (this.expoPushToken) {
        await notificationApi.unregisterDevice(this.expoPushToken);
        this.expoPushToken = null;
        console.log('✅ Push notification token unregistered successfully');
      }
    } catch (error) {
      console.error('❌ Error unregistering push notification token:', error);
    }
  }

  handleNotificationReceived(notification: Notifications.Notification) {
    console.log('📱 Notification received:', notification);
    
    // Add notification to store for in-app display
    const { addNotification } = useNotificationStore.getState();
    
    // Convert Expo notification to our notification format
    const appNotification = {
      id: notification.request.identifier,
      title: notification.request.content.title || 'Notification',
      body: notification.request.content.body || '',
      type: (notification.request.content.data?.type as any) || 'system',
      priority: (notification.request.content.data?.priority as any) || 'medium',
      data: notification.request.content.data || {},
      createdAt: new Date().toISOString(),
      readAt: null,
    };
    
    addNotification(appNotification);
  }

  handleNotificationResponse(response: Notifications.NotificationResponse) {
    console.log('📱 Notification response:', response);
    
    const data = response.notification.request.content.data;
    
    // Handle navigation based on notification data
    if (data?.orderId) {
      // Navigate to order details
      // This would need to be implemented with navigation service
      console.log('Navigate to order:', data.orderId);
    } else if (data?.restaurantId) {
      // Navigate to restaurant details
      console.log('Navigate to restaurant:', data.restaurantId);
    }
    
    // Mark notification as read
    const notificationId = response.notification.request.identifier;
    const { markAsRead } = useNotificationStore.getState();
    markAsRead(notificationId).catch(console.error);
  }

  // Send local notification
  async sendLocalNotification(data: LocalNotificationData): Promise<string> {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: data.title,
        body: data.body,
        data: data.data || {},
        sound: data.sound !== false,
      },
      trigger: data.scheduleAfter ? { seconds: data.scheduleAfter } : null,
    });

    return notificationId;
  }

  // Schedule reminder
  async scheduleReminder(
    title: string,
    message: string,
    minutesFromNow: number,
    data?: any,
  ): Promise<string> {
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

  cleanup() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }
}

// Singleton instance
const pushNotificationService = new PushNotificationServiceImpl();

export default pushNotificationService;

// Helper functions for easy use
export const registerForPushNotifications = () => 
  pushNotificationService.registerForPushNotifications();

export const unregisterPushNotifications = () => 
  pushNotificationService.unregisterPushNotifications();

export const checkNotificationPermissions = () => 
  pushNotificationService.checkPermissions();

export const requestNotificationPermissions = () => 
  pushNotificationService.requestPermissions();