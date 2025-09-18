import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  notificationApi,
  type NotificationListParams,
} from '@/src/services/customer/notification.service';
import type { Notification } from '@/src/types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasNextPage: boolean;
  currentPage: number;
  totalPages: number;
  total: number;
}

interface NotificationActions {
  // Fetch notifications with pagination
  fetchNotifications: (params?: NotificationListParams, append?: boolean) => Promise<void>;

  // Load more notifications (pagination)
  loadMoreNotifications: () => Promise<void>;

  // Mark notification as read
  markAsRead: (notificationId: string) => Promise<void>;

  // Mark all notifications as read
  markAllAsRead: () => Promise<void>;

  // Update unread count
  updateUnreadCount: () => Promise<void>;

  // Add new notification (for push notifications)
  addNotification: (notification: Notification) => void;

  // Clear error
  clearError: () => void;

  // Reset store
  reset: () => void;

  // Refresh notifications (pull to refresh)
  refreshNotifications: () => Promise<void>;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  isLoadingMore: false,
  error: null,
  hasNextPage: true,
  currentPage: 1,
  totalPages: 1,
  total: 0,
};

export const useNotificationStore = create<
  NotificationState & NotificationActions
>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        fetchNotifications: async (params = { limit: 20, page: 1 }, append = false) => {
          try {
            const isFirstPage = params.page === 1;
            set({ 
              isLoading: isFirstPage && !append, 
              isLoadingMore: !isFirstPage || append,
              error: null 
            });

            const response = await notificationApi.getNotifications(params);

            if (response.status_code === 200) {
              const { items, total, page, pages } = response.data;

              set((state) => ({
                notifications: append ? [...state.notifications, ...items] : items,
                total,
                currentPage: page,
                totalPages: pages,
                hasNextPage: page < pages,
                isLoading: false,
                isLoadingMore: false,
              }));
            } else {
              throw new Error(response.message || 'Failed to fetch notifications');
            }
          } catch (error: any) {
            set({
              error: error.message || 'Failed to fetch notifications',
              isLoading: false,
              isLoadingMore: false,
            });
          }
        },

        loadMoreNotifications: async () => {
          const { currentPage, hasNextPage, isLoadingMore } = get();
          
          if (!hasNextPage || isLoadingMore) return;

          const nextPage = currentPage + 1;
          await get().fetchNotifications({ limit: 20, page: nextPage }, true);
        },

        refreshNotifications: async () => {
          await get().fetchNotifications({ limit: 20, page: 1 }, false);
        },

        markAsRead: async (notificationId) => {
          try {
            const response = await notificationApi.markAsRead(notificationId);

            if (response.status_code === 200) {
              set((state) => ({
                notifications: state.notifications.map((notification) =>
                  notification.id === notificationId
                    ? { ...notification, readAt: new Date().toISOString() }
                    : notification,
                ),
                unreadCount: Math.max(0, state.unreadCount - 1),
              }));
            } else {
              throw new Error(response.message || 'Failed to mark notification as read');
            }
          } catch (error: any) {
            set({
              error: error.message || 'Failed to mark notification as read',
            });
            throw error;
          }
        },

        markAllAsRead: async () => {
          try {
            const response = await notificationApi.markAllAsRead();

            if (response.status_code === 200) {
              const now = new Date().toISOString();
              set((state) => ({
                notifications: state.notifications.map((notification) => ({
                  ...notification,
                  readAt: notification.readAt || now,
                })),
                unreadCount: 0,
              }));
            } else {
              throw new Error(response.message || 'Failed to mark all notifications as read');
            }
          } catch (error: any) {
            set({
              error: error.message || 'Failed to mark all notifications as read',
            });
            throw error;
          }
        },

        updateUnreadCount: async () => {
          try {
            const response = await notificationApi.getUnreadCount();

            if (response.status_code === 200) {
              set({
                unreadCount: response.data,
              });
            }
          } catch (error: any) {
            set({
              error: error.message || 'Failed to update unread count',
            });
          }
        },

        addNotification: (notification) => {
          set((state) => ({
            notifications: [notification, ...state.notifications],
            unreadCount: state.unreadCount + (notification.readAt ? 0 : 1),
            total: state.total + 1,
          }));
        },

        clearError: () => {
          set({ error: null });
        },

        reset: () => {
          set(initialState);
        },
      }),
      {
        name: 'notification-storage',
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({
          // Only persist unread count for quick access
          unreadCount: state.unreadCount,
        }),
        version: 1,
      }
    ),
    { name: 'NotificationStore' },
  ),
);

// Selector hooks for better performance
export const useNotifications = () =>
  useNotificationStore((state) => state.notifications);
export const useUnreadCount = () =>
  useNotificationStore((state) => state.unreadCount);
export const useNotificationLoading = () =>
  useNotificationStore((state) => state.isLoading);
export const useNotificationLoadingMore = () =>
  useNotificationStore((state) => state.isLoadingMore);
export const useNotificationError = () =>
  useNotificationStore((state) => state.error);
export const useNotificationHasNextPage = () =>
  useNotificationStore((state) => state.hasNextPage);
export const useNotificationTotal = () =>
  useNotificationStore((state) => state.total);