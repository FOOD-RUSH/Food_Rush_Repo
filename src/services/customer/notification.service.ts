import { apiClient } from './apiClient';
import type { 
  Notification, 
  NotificationResponse, 
  UnreadCountResponse 
} from '@/src/types';

export interface NotificationListParams {
  limit?: number;
  page?: number;
}

export interface NotificationApiResponse {
  status_code: number;
  message: string;
  data?: any;
}

export const notificationApi = {
  // GET /my - Get notifications with pagination
  getNotifications: async (params: NotificationListParams = { limit: 20, page: 1 }) => {
    const response = await apiClient.get<NotificationResponse>('/notifications/my', {
      params,
    });
    return response.data;
  },

  // PATCH /:id/read - Mark a specific notification as read
  markAsRead: async (notificationId: string) => {
    const response = await apiClient.patch<NotificationApiResponse>(
      `/notifications/${notificationId}/read`
    );
    return response.data;
  },

  // PATCH /read-all - Mark all notifications as read for authenticated user
  markAllAsRead: async () => {
    const response = await apiClient.patch<NotificationApiResponse>(
      '/notifications/read-all'
    );
    return response.data;
  },

  // GET /unread-count - Get number of unread notifications for authenticated user
  getUnreadCount: async () => {
    const response = await apiClient.get<UnreadCountResponse>('/notifications/unread-count');
    return response.data;
  },
};

// Export types for convenience
export type { Notification, NotificationResponse, UnreadCountResponse };