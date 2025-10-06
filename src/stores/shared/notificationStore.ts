// src/stores/notificationStore.ts
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notificationApi } from '@/src/services/shared/notificationApi';
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
  selectedFilter: 'all' | 'order' | 'system' | 'promotion' | 'alert' | 'unread';
}

interface NotificationActions {
  // Fetch notifications
  fetchNotifications: (
    params?: { limit?: number; page?: number },
    append?: boolean,
  ) => Promise<void>;
  loadMoreNotifications: () => Promise<void>;
  refreshNotifications: () => Promise<void>;

  // Mark notifications as read
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;

  // Update unread count
  updateUnreadCount: () => Promise<void>;

  // Add notification (for push notifications)
  addNotification: (notification: Notification) => void;

  // Filter notifications
  setFilter: (filter: NotificationState['selectedFilter']) => void;
  getFilteredNotifications: () => Notification[];

  // Utility actions
  clearError: () => void;
  reset: () => void;

  // Push token management
  registerPushToken: (
    expoToken: string,
    platform: string,
    role: 'customer' | 'restaurant',
  ) => Promise<void>;
  unregisterPushToken: (token?: string) => Promise<void>;
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
  selectedFilter: 'all',
};

export const useNotificationStore = create<
  NotificationState & NotificationActions
>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        fetchNotifications: async (
          params = { limit: 20, page: 1 },
          append = false,
        ) => {
          try {
            const isFirstPage = params.page === 1;
            set({
              isLoading: isFirstPage && !append,
              isLoadingMore: !isFirstPage || append,
              error: null,
            });

            const response = await notificationApi.getNotifications(params);

            if (response.status_code === 200) {
              const { items, total, page, pages } = response.data;

              set((state) => ({
                notifications: append
                  ? [...state.notifications, ...items]
                  : items,
                total,
                currentPage: page,
                totalPages: pages,
                hasNextPage: page < pages,
                isLoading: false,
                isLoadingMore: false,
              }));
            } else {
              throw new Error(
                response.message || 'Failed to fetch notifications',
              );
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

          await get().fetchNotifications(
            { limit: 20, page: currentPage + 1 },
            true,
          );
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
              throw new Error(response.message || 'Failed to mark as read');
            }
          } catch (error: any) {
            set({ error: error.message || 'Failed to mark as read' });
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
              throw new Error(response.message || 'Failed to mark all as read');
            }
          } catch (error: any) {
            set({ error: error.message || 'Failed to mark all as read' });
            throw error;
          }
        },

        updateUnreadCount: async () => {
          try {
            const response = await notificationApi.getUnreadCount();
            if (response.status_code === 200) {
              set({ unreadCount: response.data });
            }
          } catch (error: any) {
          }
        },

        addNotification: (notification) => {
          set((state) => ({
            notifications: [notification, ...state.notifications],
            unreadCount: state.unreadCount + (notification.readAt ? 0 : 1),
            total: state.total + 1,
          }));
        },

        setFilter: (filter) => {
          set({ selectedFilter: filter });
        },

        getFilteredNotifications: () => {
          const { notifications, selectedFilter } = get();

          switch (selectedFilter) {
            case 'unread':
              return notifications.filter((n) => !n.readAt);
            case 'order':
            case 'system':
            case 'promotion':
            case 'alert':
              return notifications.filter((n) => n.type === selectedFilter);
            default:
              return notifications;
          }
        },

        registerPushToken: async (expoToken, platform, role) => {
          try {
            const response = await notificationApi.registerDevice(
              expoToken,
              platform,
              role,
            );
            if (response.status_code !== 200) {
              throw new Error(
                response.message || 'Failed to register push token',
              );
            }
          } catch (error: any) {
            set({ error: error.message || 'Failed to register push token' });
            throw error;
          }
        },

        unregisterPushToken: async (token) => {
          try {
            const response = await notificationApi.unregisterDevice(token);
            if (response.status_code !== 200) {
              throw new Error(
                response.message || 'Failed to unregister push token',
              );
            }
          } catch (error: any) {
            set({ error: error.message || 'Failed to unregister push token' });
            throw error;
          }
        },

        clearError: () => set({ error: null }),
        reset: () => set(initialState),
      }),
      {
        name: 'notification-storage',
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({
          unreadCount: state.unreadCount,
          selectedFilter: state.selectedFilter,
        }),
        version: 1,
      },
    ),
    { name: 'NotificationStore' },
  ),
);

// Selector hooks for performance
export const useNotifications = () =>
  useNotificationStore((state) => state.getFilteredNotifications());
export const useAllNotifications = () =>
  useNotificationStore((state) => state.notifications);
export const useUnreadCount = () =>
  useNotificationStore((state) => state.unreadCount);
export const useNotificationLoading = () =>
  useNotificationStore((state) => state.isLoading);
export const useNotificationError = () =>
  useNotificationStore((state) => state.error);
