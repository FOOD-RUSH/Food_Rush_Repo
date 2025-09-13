// services/NotificationService.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { apiClient } from '../services/customer';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    // shouldShowAlert: true,
    // shouldPlaySound: true,
    // shouldSetBadge: false,
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

export interface OrderStatus {
  orderId: string;
  status:
    | 'pending'
    | 'confirmed'
    | 'preparing'
    | 'ready_for_pickup'
    | 'out_for_delivery'
    | 'delivered'
    | 'cancelled';

  estimatedTime?: number;
}

class NotificationService {
  private expoPushToken: string | null = null;
  private apiBaseUrl: string;

  constructor(apiBaseUrl: string) {
    this.apiBaseUrl = apiBaseUrl;
  }

  // Initialize notification service
  async initialize(): Promise<void> {
    try {
      await this.requestPermissions();
      await this.registerForPushNotifications();
      this.setupNotificationListeners();
      console.log('NOtification service initialized successfully');
    } catch (error) {
      console.log('Failed to initialize notification service: ', error);
      throw error;
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

  // Send token to NestJS backend
  async sendTokenToBackend(token: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/push-tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers here if needed
          // 'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          expoPushToken: token,
          platform: Platform.OS,
        }),
      });

      // const response = await apiClient.post('push-tokens', {expoPushToken: token, Platform: Platform.OS})

      if (!response.ok) {
        throw new Error(`Failed to register token: ${response.statusText}`);
      }

      console.log('Token registered successfully');
    } catch (error) {
      console.error('Error sending token to backend:', error);
    }
  }

  // Setup notification listeners
  setupNotificationListeners(): void {
    // Handle notifications when app is in foreground
    Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received in foreground:', notification);
    });

    // Handle notification taps
    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification tapped:', response);
      const data = response.notification.request.content.data;
      this.handleNotificationTap(data);
    });
  }

  // Handle notification tap actions
  handleNotificationTap(data: any): void {
    if (data?.orderId) {
      // Navigate to order details screen
      console.log('Navigate to order:', data.orderId);
      // NavigationService.navigate('OrderDetails', { orderId: data.orderId });
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

  // Send order status local notification
  async sendOrderStatusNotification(orderStatus: OrderStatus): Promise<string> {
    const notifications = {
      pending: {
        title: '🎉 Commande en Cour!',
        body: `Votre commande #${orderStatus.orderId} es en cour. Préparation en cours...`,
      },
      confirmed: {
        title: '🎉 Commande confirmée!',
        body: `Votre commande #${orderStatus.orderId} a été confirmée. Préparation en cours...`,
      },
      preparing: {
        title: '👨‍🍳 Préparation en cours',
        body: `Votre commande #${orderStatus.orderId} est en cours de préparation.`,
      },
      out_for_delivery: {
        title: '🚗 Livraison en route!',
        body: `Votre commande #${orderStatus.orderId} est en route vers vous.`,
      },
      delivered: {
        title: '✅ Commande livrée!',
        body: `Votre commande #${orderStatus.orderId} a été livrée. Bon appétit!`,
      },
      cancelled: {
        title: '🎉 Commande en Cour!',
        body: `Votre commande #${orderStatus.orderId} a ete annule. `,
      },
      ready_for_pickup: {
        title: '🎉 Commande pret pour la Livrason!',
        body: `Votre commande #${orderStatus.orderId} a ete annule. `,
      },
    };

    const notification = notifications[orderStatus.status];

    return this.sendLocalNotification({
      title: notification.title,
      body: notification.body,
      data: {
        orderId: orderStatus.orderId,
        status: orderStatus.status,
      },
    });
  }

  // Schedule local notification for later
  async scheduleOrderReminder(
    orderId: string,
    minutesFromNow: number,
  ): Promise<string> {
    return this.sendLocalNotification({
      title: '⏰ Rappel de commande',
      body: `N'oubliez pas votre commande #${orderId}!`,
      data: { orderId, type: 'reminder' },
      scheduleAfter: minutesFromNow * 60,
    });
  }

  // Cancel scheduled notification
  async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  // Cancel all notifications for an order
  async cancelOrderNotifications(orderId: string): Promise<void> {
    const scheduledNotifications =
      await Notifications.getAllScheduledNotificationsAsync();

    for (const notification of scheduledNotifications) {
      if (notification.content.data?.orderId === orderId) {
        await Notifications.cancelScheduledNotificationAsync(
          notification.identifier,
        );
      }
    }
  }
  // cancel all Notifications
  async cancelNotifcation(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
  // Get current push token
  getExpoPushToken(): string | null {
    return this.expoPushToken;
  }
}

export default NotificationService;
