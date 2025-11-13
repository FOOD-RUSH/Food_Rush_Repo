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
    shouldShowList: true,
  }),
});

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
  scheduleAfter?: number;
}

class PushNotificationService {
  private expoPushToken: string | null = null;
  private notificationListener: Notifications.Subscription | null = null;
  private responseListener: Notifications.Subscription | null = null;
  private initialized = false;

  private setupListeners() {

    try {
      if (this.notificationListener) {
        this.notificationListener.remove();
      }
      if (this.responseListener) {
        this.responseListener.remove();
      }

      this.notificationListener = Notifications.addNotificationReceivedListener(
        this.handleNotificationReceived.bind(this),
      );

      this.responseListener =
        Notifications.addNotificationResponseReceivedListener(
          this.handleNotificationResponse.bind(this),
        );

    } catch (error) {
      console.error(
        '[PushService] Error setting up notification listeners:',
        error,
      );
    }
  }

  async init(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      this.setupListeners();
      this.initialized = true;
    } catch (error) {
      console.error(
        '[PushService] Error initializing push notifications:',
        error,
      );
      this.initialized = false;
      throw error;
    }
  }

  async requestPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
      // Push notifications only work on physical devices
      return false;
    }

    // Removed console.log for production

    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      const granted = finalStatus === 'granted';
      return granted;
    } catch (error) {
      // Error requesting notification permissions - handle silently
      return false;
    }
  }

  async getExpoPushToken(): Promise<string | null> {
    if (this.expoPushToken) {
      return this.expoPushToken;
    }

    if (!Device.isDevice) {
      // Not a physical device, cannot get token
      return null;
    }


    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        // No permission, cannot get token
        return null;
      }

      const projectId = process.env.EXPO_PROJECT_ID;

      const token = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      this.expoPushToken = token.data;
      return token.data;
    } catch (error) {
      // Error getting push token - handle silently
      return null;
    }
  }

  async registerDevice(): Promise<string | null> {
    // Removed console.log for production

    try {
      const token = await this.getExpoPushToken();
      if (!token) {
        // No token available for registration
        return null;
      }

      const { user } = useAuthStore.getState();
      if (!user) {
        // User not authenticated, cannot register device
        return null;
      }

      const platform = Platform.OS;
      const role = user.role?.toLowerCase() || 'customer';

      // Removed console.log for production

      await notificationApi.registerDevice(token, platform, role);
      useNotificationStore.getState().setPushEnabled(true);

      // Removed console.log for production
      return token;
    } catch (error) {
      // Error registering device - handle silently
      return null;
    }
  }

  async unregisterDevice(): Promise<void> {
    // Removed console.log for production

    try {
      if (this.expoPushToken) {
        await notificationApi.unregisterDevice(this.expoPushToken);
        this.expoPushToken = null;
        useNotificationStore.getState().setPushEnabled(false);
        // Removed console.log for production
      }
    } catch (error) {
      // Error unregistering device - handle silently
    }
  }

  private handleNotificationReceived(notification: Notifications.Notification) {
    // Removed console.log for production

    try {
      const { addNotification, fetchNotifications } =
        useNotificationStore.getState();

      const appNotification = {
        id: notification.request.identifier,
        userId: '', // Will be set by backend
        title: notification.request.content.title || 'Notification',
        body: notification.request.content.body || '',
        type: (notification.request.content.data?.type as string) || 'system',
        priority:
          (notification.request.content.data?.priority as string) || 'medium',
        data: notification.request.content.data || {},
        createdAt: new Date().toISOString(),
        readAt: null,
      };

      addNotification(appNotification);

      // Refresh notifications from backend to sync
      fetchNotifications().catch((err) => {
        // Failed to refresh notifications - handle silently
      });

      // Removed console.log for production
    } catch (error) {
      // Error handling notification received - handle silently
    }
  }

  private handleNotificationResponse(
    response: Notifications.NotificationResponse,
  ) {
    // Removed console.log for production

    try {
      const data = response.notification.request.content.data;
      const notificationId = response.notification.request.identifier;

      const { markAsRead } = useNotificationStore.getState();
      markAsRead(notificationId).catch((err) => {
        // Error marking notification as read - handle silently
      });

      if (data?.orderId) {
        // Navigate to order - removed console.log
        // TODO: Implement navigation
      } else if (data?.restaurantId) {
        // Navigate to restaurant - removed console.log
        // TODO: Implement navigation
      }
    } catch (error) {
      // Error handling notification response - handle silently
    }
  }

  async sendLocalNotification(payload: NotificationPayload): Promise<string> {
    // Removed console.log for production

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

      // Removed console.log for production
      return notificationId;
    } catch (error) {
      // Error sending local notification - handle silently
      throw error;
    }
  }

  async scheduleReminder(
    title: string,
    body: string,
    minutesFromNow: number,
    data?: Record<string, any>,
  ): Promise<string> {
    // Removed console.log for production

    return this.sendLocalNotification({
      title: `⏰ ${title}`,
      body,
      data: { type: 'reminder', ...data },
      scheduleAfter: minutesFromNow * 60,
    });
  }

  async cancelNotification(notificationId: string): Promise<void> {
    // Removed console.log for production

    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      // Removed console.log for production
    } catch (error) {
      // Error canceling notification - handle silently
    }
  }

  async cancelAllScheduled(): Promise<void> {
    // Removed console.log for production

    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      // Removed console.log for production
    } catch (error) {
      // Error canceling all notifications - handle silently
    }
  }

  cleanup() {
    // Removed console.log for production

    if (this.notificationListener) {
      this.notificationListener.remove();
      this.notificationListener = null;
    }
    if (this.responseListener) {
      this.responseListener.remove();
      this.responseListener = null;
    }
    this.initialized = false;

    // Removed console.log for production
  }
}

export const pushNotificationService = new PushNotificationService();
