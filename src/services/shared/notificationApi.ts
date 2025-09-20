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

/**
 * Unified notification API service for both customer and restaurant users
 * The backend determines the user type from the authentication token
 * and returns appropriate notifications for that user type
 */
export const notificationApi = {
  // GET /notifications/my - Get notifications with pagination for authenticated user
  getNotifications: async (params: NotificationListParams = { limit: 20, page: 1 }) => {
    const response = await apiClient.get<NotificationResponse>('/notifications/my', {
      params,
    });
    return response.data;
  },

  // PATCH /notifications/:id/read - Mark a specific notification as read
  markAsRead: async (notificationId: string) => {
    const response = await apiClient.patch<NotificationApiResponse>(
      `/notifications/${notificationId}/read`
    );
    return response.data;
  },

  // PATCH /notifications/read-all - Mark all notifications as read for authenticated user
  markAllAsRead: async () => {
    const response = await apiClient.patch<NotificationApiResponse>(
      '/notifications/read-all'
    );
    return response.data;
  },

  // GET /notifications/unread-count - Get number of unread notifications for authenticated user
  getUnreadCount: async () => {
    const response = await apiClient.get<UnreadCountResponse>('/notifications/unread-count');
    return response.data;
  },

  // DELETE /notifications/:id - Delete a specific notification (if supported by backend)
  deleteNotification: async (notificationId: string) => {
    const response = await apiClient.delete<NotificationApiResponse>(
      `/notifications/${notificationId}`
    );
    return response.data;
  },

  // POST /notifications/register-token - Register push notification token
  registerPushToken: async (token: string, deviceInfo?: any) => {
    const response = await apiClient.post<NotificationApiResponse>(
      '/notifications/register-token',
      {
        token,
        deviceInfo,
        platform: 'mobile',
      }
    );
    return response.data;
  },

  // DELETE /notifications/unregister-token - Unregister push notification token
  unregisterPushToken: async (token: string) => {
    const response = await apiClient.delete<NotificationApiResponse>(
      '/notifications/unregister-token',
      {
        data: { token }
      }
    );
    return response.data;
  },
};

// Export types for convenience
export type { Notification, NotificationResponse, UnreadCountResponse };