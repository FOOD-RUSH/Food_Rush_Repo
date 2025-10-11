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
    shouldShowBanner: true,
    shouldShowList: true, // Added to satisfy NotificationBehavior type
  }),
});

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
  scheduleAfter?: number; // seconds from now
}

class PushNotificationService {
  private expoPushToken: string | null = null;
  private notificationListener: Notifications.Subscription | null = null;
  private responseListener: Notifications.Subscription | null = null;
  private initialized = false;

  // Removed empty constructor as it was unnecessary

  private setupListeners() {
    try {
      if (this.notificationListener) {
        this.notificationListener.remove();
      }
      if (this.responseListener) {
        this.responseListener.remove();
      }

      // Handle notifications received while app is foregrounded
      this.notificationListener = Notifications.addNotificationReceivedListener(
        this.handleNotificationReceived.bind(this),
      );

      // Handle notification responses (user tapped notification)
      this.responseListener = Notifications.addNotificationResponseReceivedListener(
        this.handleNotificationResponse.bind(this),
      );
    } catch (error) {
      console.error('Error setting up notification listeners:', error);
    }
  }

  async init(): Promise<void> {
    if (this.initialized) return;

    try {
      this.setupListeners();
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing push notifications:', error);
      this.initialized = false;
    }
  }

  async requestPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
      console.warn('Push notifications only work on physical devices');
      return false;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      return finalStatus === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  async getExpoPushToken(): Promise<string | null> {
    if (this.expoPushToken) {
      return this.expoPushToken;
    }

    if (!Device.isDevice) {
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

  async registerDevice(): Promise<string | null> {
    try {
      const token = await this.getExpoPushToken();
      if (!token) {
        return null;
      }

      const { user } = useAuthStore.getState();
      if (!user) {
        console.warn('User not authenticated, cannot register device');
        return null;
      }

      const platform = Platform.OS;
      const role = user.role?.toLowerCase() || 'customer';

      await notificationApi.registerDevice(token, platform, role);
      useNotificationStore.getState().setPushEnabled(true);

      return token;
    } catch (error) {
      console.error('Error registering device:', error);
      return null;
    }
  }

  async unregisterDevice(): Promise<void> {
    try {
      if (this.expoPushToken) {
        await notificationApi.unregisterDevice(this.expoPushToken);
        this.expoPushToken = null;
        useNotificationStore.getState().setPushEnabled(false);
      }
    } catch (error) {
      console.error('Error unregistering device:', error);
    }
  }

  private handleNotificationReceived(notification: Notifications.Notification) {
    try {
      const { addNotification } = useNotificationStore.getState();

      const appNotification = {
        id: notification.request.identifier,
        title: notification.request.content.title || 'Notification',
        body: notification.request.content.body || '',
        type: (notification.request.content.data?.type as string) || 'system',
        priority: (notification.request.content.data?.priority as string) || 'medium',
        data: notification.request.content.data || {},
        createdAt: new Date().toISOString(),
        readAt: null,
      };

      addNotification(appNotification);
    } catch (error) {
      console.error('Error handling notification received:', error);
    }
  }

  private handleNotificationResponse(response: Notifications.NotificationResponse) {
    try {
      const data = response.notification.request.content.data;
      const notificationId = response.notification.request.identifier;

      // Mark as read
      const { markAsRead } = useNotificationStore.getState();
      markAsRead(notificationId).catch((err) => {
        console.error('Error marking notification as read:', err);
      });

      // Handle deep linking based on notification type
      if (data?.orderId) {
        // TODO: Navigate to order details
        console.log('Navigate to order:', data.orderId);
      } else if (data?.restaurantId) {
        // TODO: Navigate to restaurant details
        console.log('Navigate to restaurant:', data.restaurantId);
      }
    } catch (error) {
      console.error('Error handling notification response:', error);
    }
  }

  async sendLocalNotification(payload: NotificationPayload): Promise<string> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: payload.title,
          body: payload.body,
          data: payload.data || {},
          sound: true,
        },
        trigger: payload.scheduleAfter
          ? { seconds: payload.scheduleAfter }
          : null,
      });

      return notificationId;
    } catch (error) {
      console.error('Error sending local notification:', error);
      throw error;
    }
  }

  async scheduleReminder(
    title: string,
    body: string,
    minutesFromNow: number,
    data?: Record<string, any>,
  ): Promise<string> {
    return this.sendLocalNotification({
      title: `⏰ ${title}`,
      body,
      data: { type: 'reminder', ...data },
      scheduleAfter: minutesFromNow * 60,
    });
  }

  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  async cancelAllScheduled(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  }

  cleanup() {
    if (this.notificationListener) {
      this.notificationListener.remove();
      this.notificationListener = null;
    }
    if (this.responseListener) {
      this.responseListener.remove();
      this.responseListener = null;
    }
    this.initialized = false;
  }
}

export const pushNotificationService = new PushNotificationService();
