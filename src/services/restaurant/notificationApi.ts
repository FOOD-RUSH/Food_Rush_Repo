import { apiClient } from '@/src/services/shared/apiClient';
import type { Notification, NotificationResponse, UnreadCountResponse } from '@/src/types';

export interface NotificationListParams {
  limit?: number;
  page?: number;
  type?: 'order' | 'system' | 'promotion' | 'alert';
  priority?: 'low' | 'medium' | 'high';
}

export interface NotificationApiResponse {
  status_code: number;
  message: string;
  data?: any;
}

export const restaurantNotificationApi = {
  // GET /restaurant/notifications - Get restaurant notifications with pagination
  getNotifications: async (params: NotificationListParams = { limit: 20, page: 1 }) => {
    const response = await apiClient.get<NotificationResponse>('/restaurant/notifications', {
      params,
    });
    return response.data;
  },

  // PATCH /restaurant/notifications/:id/read - Mark a specific notification as read
  markAsRead: async (notificationId: string) => {
    const response = await apiClient.patch<NotificationApiResponse>(
      `/restaurant/notifications/${notificationId}/read`
    );
    return response.data;
  },

  // PATCH /restaurant/notifications/read-all - Mark all notifications as read for restaurant
  markAllAsRead: async () => {
    const response = await apiClient.patch<NotificationApiResponse>(
      '/restaurant/notifications/read-all'
    );
    return response.data;
  },

  // GET /restaurant/notifications/unread-count - Get number of unread notifications for restaurant
  getUnreadCount: async () => {
    const response = await apiClient.get<UnreadCountResponse>('/restaurant/notifications/unread-count');
    return response.data;
  },

  // DELETE /restaurant/notifications/:id - Delete a specific notification
  deleteNotification: async (notificationId: string) => {
    const response = await apiClient.delete<NotificationApiResponse>(
      `/restaurant/notifications/${notificationId}`
    );
    return response.data;
  },

  // POST /restaurant/notifications/register-token - Register push notification token
  registerPushToken: async (token: string, deviceInfo?: any) => {
    const response = await apiClient.post<NotificationApiResponse>(
      '/restaurant/notifications/register-token',
      {
        token,
        deviceInfo,
        platform: 'mobile',
      }
    );
    return response.data;
  },

  // DELETE /restaurant/notifications/unregister-token - Unregister push notification token
  unregisterPushToken: async (token: string) => {
    const response = await apiClient.delete<NotificationApiResponse>(
      '/restaurant/notifications/unregister-token',
      {
        data: { token }
      }
    );
    return response.data;
  },
};

// Export types for convenience
export type { Notification, NotificationResponse, UnreadCountResponse };