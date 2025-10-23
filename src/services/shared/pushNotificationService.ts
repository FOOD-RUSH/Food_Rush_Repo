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
    console.log('[PushService] Setting up listeners...');
    
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

      this.responseListener = Notifications.addNotificationResponseReceivedListener(
        this.handleNotificationResponse.bind(this),
      );
      
      console.log('[PushService] Listeners setup complete');
    } catch (error) {
      console.error('[PushService] Error setting up notification listeners:', error);
    }
  }

  async init(): Promise<void> {
    if (this.initialized) {
      console.log('[PushService] Already initialized');
      return;
    }

    console.log('[PushService] Initializing...');

    try {
      this.setupListeners();
      this.initialized = true;
      console.log('[PushService] Initialization complete');
    } catch (error) {
      console.error('[PushService] Error initializing push notifications:', error);
      this.initialized = false;
      throw error;
    }
  }

  async requestPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
      console.warn('[PushService] Push notifications only work on physical devices');
      return false;
    }

    console.log('[PushService] Requesting permissions...');

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      console.log('[PushService] Existing permission status:', existingStatus);
      
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        console.log('[PushService] New permission status:', finalStatus);
      }

      const granted = finalStatus === 'granted';
      console.log('[PushService] Permissions granted:', granted);
      return granted;
    } catch (error) {
      console.error('[PushService] Error requesting notification permissions:', error);
      return false;
    }
  }

  async getExpoPushToken(): Promise<string | null> {
    if (this.expoPushToken) {
      console.log('[PushService] Using cached token');
      return this.expoPushToken;
    }

    if (!Device.isDevice) {
      console.warn('[PushService] Not a physical device, cannot get token');
      return null;
    }

    console.log('[PushService] Getting Expo push token...');

    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.warn('[PushService] No permission, cannot get token');
        return null;
      }

      const projectId = process.env.EXPO_PROJECT_ID;
      console.log('[PushService] Project ID:', projectId);

      const token = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      this.expoPushToken = token.data;
      console.log('[PushService] Token obtained:', this.expoPushToken);
      return token.data;
    } catch (error) {
      console.error('[PushService] Error getting Expo push token:', error);
      return null;
    }
  }

  async registerDevice(): Promise<string | null> {
    console.log('[PushService] Registering device...');
    
    try {
      const token = await this.getExpoPushToken();
      if (!token) {
        console.warn('[PushService] No token available for registration');
        return null;
      }

      const { user } = useAuthStore.getState();
      if (!user) {
        console.warn('[PushService] User not authenticated, cannot register device');
        return null;
      }

      const platform = Platform.OS;
      const role = user.role?.toLowerCase() || 'customer';

      console.log('[PushService] Registering with:', { platform, role });

      await notificationApi.registerDevice(token, platform, role);
      useNotificationStore.getState().setPushEnabled(true);

      console.log('[PushService] Device registered successfully');
      return token;
    } catch (error) {
      console.error('[PushService] Error registering device:', error);
      return null;
    }
  }

  async unregisterDevice(): Promise<void> {
    console.log('[PushService] Unregistering device...');
    
    try {
      if (this.expoPushToken) {
        await notificationApi.unregisterDevice(this.expoPushToken);
        this.expoPushToken = null;
        useNotificationStore.getState().setPushEnabled(false);
        console.log('[PushService] Device unregistered successfully');
      }
    } catch (error) {
      console.error('[PushService] Error unregistering device:', error);
    }
  }

  private handleNotificationReceived(notification: Notifications.Notification) {
    console.log('[PushService] Notification received:', {
      id: notification.request.identifier,
      title: notification.request.content.title,
      body: notification.request.content.body,
      data: notification.request.content.data
    });

    try {
      const { addNotification, fetchNotifications } = useNotificationStore.getState();

      const appNotification = {
        id: notification.request.identifier,
        userId: '', // Will be set by backend
        title: notification.request.content.title || 'Notification',
        body: notification.request.content.body || '',
        type: (notification.request.content.data?.type as string) || 'system',
        priority: (notification.request.content.data?.priority as string) || 'medium',
        data: notification.request.content.data || {},
        createdAt: new Date().toISOString(),
        readAt: null,
      };

      addNotification(appNotification);
      
      // Refresh notifications from backend to sync
      fetchNotifications().catch(err => {
        console.error('[PushService] Failed to refresh notifications:', err);
      });

      console.log('[PushService] Notification handled successfully');
    } catch (error) {
      console.error('[PushService] Error handling notification received:', error);
    }
  }

  private handleNotificationResponse(response: Notifications.NotificationResponse) {
    console.log('[PushService] Notification response:', {
      id: response.notification.request.identifier,
      actionIdentifier: response.actionIdentifier,
      data: response.notification.request.content.data
    });

    try {
      const data = response.notification.request.content.data;
      const notificationId = response.notification.request.identifier;

      const { markAsRead } = useNotificationStore.getState();
      markAsRead(notificationId).catch((err) => {
        console.error('[PushService] Error marking notification as read:', err);
      });

      if (data?.orderId) {
        console.log('[PushService] Navigate to order:', data.orderId);
        // TODO: Implement navigation
      } else if (data?.restaurantId) {
        console.log('[PushService] Navigate to restaurant:', data.restaurantId);
        // TODO: Implement navigation
      }
    } catch (error) {
      console.error('[PushService] Error handling notification response:', error);
    }
  }

  async sendLocalNotification(payload: NotificationPayload): Promise<string> {
    console.log('[PushService] Sending local notification:', payload.title);
    
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

      console.log('[PushService] Local notification sent:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('[PushService] Error sending local notification:', error);
      throw error;
    }
  }

  async scheduleReminder(
    title: string,
    body: string,
    minutesFromNow: number,
    data?: Record<string, any>,
  ): Promise<string> {
    console.log('[PushService] Scheduling reminder:', { title, minutesFromNow });
    
    return this.sendLocalNotification({
      title: `⏰ ${title}`,
      body,
      data: { type: 'reminder', ...data },
      scheduleAfter: minutesFromNow * 60,
    });
  }

  async cancelNotification(notificationId: string): Promise<void> {
    console.log('[PushService] Canceling notification:', notificationId);
    
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log('[PushService] Notification canceled');
    } catch (error) {
      console.error('[PushService] Error canceling notification:', error);
    }
  }

  async cancelAllScheduled(): Promise<void> {
    console.log('[PushService] Canceling all scheduled notifications');
    
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('[PushService] All notifications canceled');
    } catch (error) {
      console.error('[PushService] Error canceling all notifications:', error);
    }
  }

  cleanup() {
    console.log('[PushService] Cleaning up...');
    
    if (this.notificationListener) {
      this.notificationListener.remove();
      this.notificationListener = null;
    }
    if (this.responseListener) {
      this.responseListener.remove();
      this.responseListener = null;
    }
    this.initialized = false;
    
    console.log('[PushService] Cleanup complete');
  }
}

export const pushNotificationService = new PushNotificationService();