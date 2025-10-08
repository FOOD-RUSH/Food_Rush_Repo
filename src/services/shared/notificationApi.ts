import { apiClient } from '@/src/services/shared/apiClient';
import type {
  Notification,
  NotificationResponse,
  UnreadCountResponse,
} from '@/src/types';

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
  // GET /api/v1/notifications/my - Get notifications with pagination for authenticated user
  getNotifications: async (
    params: NotificationListParams = { limit: 20, page: 1 },
  ) => {
    const response = await apiClient.get<NotificationResponse>(
      '/notifications/my',
      {
        params,
      },
    );
    return response.data;
  },

  // PATCH /api/v1/notifications/{id}/read - Mark a specific notification as read
  markAsRead: async (notificationId: string) => {
    const response = await apiClient.patch<NotificationApiResponse>(
      `/notifications/${notificationId}/read`,
    );
    return response.data;
  },

  // PATCH /api/v1/notifications/read-all - Mark all notifications as read for authenticated user
  markAllAsRead: async () => {
    const response = await apiClient.patch<NotificationApiResponse>(
      '/api/v1/notifications/read-all',
    );
    return response.data;
  },

  // GET /api/v1/notifications/unread-count - Get number of unread notifications for authenticated user
  getUnreadCount: async () => {
    const response = await apiClient.get<UnreadCountResponse>(
      '/notifications/unread-count',
    );
    return response.data;
  },

  // GET /api/v1/notifications/devices - List registered Expo devices for the authenticated user
  getDevices: async () => {
    const response = await apiClient.get<NotificationApiResponse>(
      '/notifications/devices',
    );
    return response.data;
  },

  // POST /api/v1/notifications/device - Register or update Expo push token for the authenticated user
  registerDevice: async (expoToken: string, platform: string, role: string) => {
    const response = await apiClient.post<NotificationApiResponse>(
      '/notifications/device',
      {
        expoToken,
        platform,
        role,
      },
    );
    return response.data;
  },

  // DELETE /api/v1/notifications/device - Unregister Expo push token for the authenticated user
  unregisterDevice: async (expoToken: string) => {
    const response = await apiClient.delete<NotificationApiResponse>(
      '/notifications/device',
      {
        data: { expoToken },
      },
    );
    return response.data;
  },

  // DELETE /notifications/:id - Delete a specific notification (if supported by backend)
  deleteNotification: async (notificationId: string) => {
    const response = await apiClient.delete<NotificationApiResponse>(
      `/notifications/${notificationId}`,
    );
    return response.data;
  },
};

// Export types for convenience
export type { Notification, NotificationResponse, UnreadCountResponse };
