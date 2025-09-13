import { apiClient } from './apiClient';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'promotion' | 'system' | 'delivery';
  isRead: boolean;
  createdAt: string;
  orderId?: string;
  deepLink?: string;
}

export interface NotificationPreferences {
  orderUpdates: boolean;
  promotions: boolean;
  systemAlerts: boolean;
  deliveryUpdates: boolean;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  preferences: NotificationPreferences;
}

export const notificationApi = {
  // Get all notifications for user
  getNotifications: (userId: string) => {
    return apiClient.get<Notification[]>(`/notifications/user/${userId}`);
  },

  // Mark notification as read
  markAsRead: (notificationId: string) => {
    return apiClient.patch<Notification>(
      `/notifications/${notificationId}/read`,
      {},
    );
  },

  // Mark all notifications as read
  markAllAsRead: (userId: string) => {
    return apiClient.patch<void>(`/notifications/user/${userId}/read-all`, {});
  },

  // Delete notification
  deleteNotification: (notificationId: string) => {
    return apiClient.delete<void>(`/notifications/${notificationId}`);
  },

  // Get notification settings
  getSettings: (userId: string) => {
    return apiClient.get<NotificationSettings>(
      `/notifications/settings/${userId}`,
    );
  },

  // Update notification settings
  updateSettings: (userId: string, settings: Partial<NotificationSettings>) => {
    return apiClient.patch<NotificationSettings>(
      `/notifications/settings/${userId}`,
      settings,
    );
  },

  // Get unread notification count
  getUnreadCount: (userId: string) => {
    return apiClient.get<number>(`/notifications/unread-count/${userId}`);
  },

  // Subscribe to push notifications
  subscribeToPush: (userId: string, token: string) => {
    return apiClient.post<void>(`/notifications/push/subscribe`, {
      userId,
      token,
    });
  },

  // Unsubscribe from push notifications
  unsubscribeFromPush: (userId: string, token: string) => {
    return apiClient.post<void>(`/notifications/push/unsubscribe`, {
      userId,
      token,
    });
  },
};
