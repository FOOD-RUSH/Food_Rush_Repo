import { apiClient } from '@/src/services/shared/apiClient';
import type { Notification } from '@/src/types';

export interface NotificationResponse {
  status_code: number;
  message: string;
  data: {
    items: Notification[];
    total: number;
    page: number;
    pages: number;
  };
}

export interface UnreadCountResponse {
  status_code: number;
  data: {
    count: number;
  };
}

// Prefer WebSocket for pushes; keep HTTP for fallback and initial load
export const notificationApi = {
  getNotifications: async (
    params: {
      limit?: number;
      page?: number;
      type?: string;
    } = {},
  ) => {
    const response = await apiClient.get<NotificationResponse>(
      '/notifications/my',
      { params: { limit: 20, page: 1, ...params } },
    );
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await apiClient.get<UnreadCountResponse>(
      '/notifications/unread-count',
    );
    return response.data;
  },

  markAsRead: async (notificationId: string) => {
    const response = await apiClient.patch<{
      status_code: number;
      message: string;
    }>(`/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await apiClient.patch<{
      status_code: number;
      message: string;
    }>('/notifications/read-all');
    return response.data;
  },

  registerDevice: async (expoToken: string, platform: string, role: string) => {
    const response = await apiClient.post<{
      status_code: number;
      message: string;
    }>('/notifications/device', { expoToken, platform, role });
    return response.data;
  },

  unregisterDevice: async (expoToken: string) => {
    const response = await apiClient.delete<{
      status_code: number;
      message: string;
    }>('/notifications/device', { data: { expoToken } });
    return response.data;
  },
};
