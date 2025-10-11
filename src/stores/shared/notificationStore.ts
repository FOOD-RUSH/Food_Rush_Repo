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
  pushEnabled: boolean;
  lastSyncTime: number | null;
}

interface NotificationActions {
  fetchNotifications: (
    params?: { limit?: number; page?: number },
    append?: boolean,
  ) => Promise<void>;
  loadMoreNotifications: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  updateUnreadCount: () => Promise<void>;
  addNotification: (notification: Notification) => void;
  removeNotification: (notificationId: string) => void;
  setFilter: (filter: NotificationState['selectedFilter']) => void;
  getFilteredNotifications: () => Notification[];
  clearError: () => void;
  reset: () => void;
  setPushEnabled: (enabled: boolean) => void;
  setLastSyncTime: (time: number) => void;
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
  pushEnabled: false,
  lastSyncTime: null,
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
              error: null,
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
                lastSyncTime: Date.now(),
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
            console.error('Error fetching notifications:', error);
          }
        },

        loadMoreNotifications: async () => {
          const { currentPage, hasNextPage, isLoadingMore } = get();
          if (!hasNextPage || isLoadingMore) return;
          await get().fetchNotifications({ limit: 20, page: currentPage + 1 }, true);
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
            }
          } catch (error: any) {
            console.error('Error marking notification as read:', error);
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
            }
          } catch (error: any) {
            console.error('Error marking all as read:', error);
            throw error;
          }
        },

        updateUnreadCount: async () => {
          try {
            const response = await notificationApi.getUnreadCount();
            if (response.status_code === 200) {
              set({ unreadCount: response.data.count });
            }
          } catch (error: any) {
            console.error('Error updating unread count:', error);
          }
        },

        addNotification: (notification) => {
          set((state) => ({
            notifications: [notification, ...state.notifications],
            unreadCount: state.unreadCount + (notification.readAt ? 0 : 1),
            total: state.total + 1,
          }));
        },

        removeNotification: (notificationId) => {
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== notificationId),
            total: Math.max(0, state.total - 1),
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

        clearError: () => set({ error: null }),
        reset: () => set(initialState),
        setPushEnabled: (enabled) => set({ pushEnabled: enabled }),
        setLastSyncTime: (time) => set({ lastSyncTime: time }),
      }),
      {
        name: 'notification-storage',
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({
          unreadCount: state.unreadCount,
          selectedFilter: state.selectedFilter,
          pushEnabled: state.pushEnabled,
        }),
        version: 1,
      },
    ),
    { name: 'NotificationStore' },
  ),
);

// Selector hooks for performance
export const useNotificationSelectors = {
  useNotifications: () => useNotificationStore((state) => state.getFilteredNotifications()),
  useAllNotifications: () => useNotificationStore((state) => state.notifications),
  useUnreadCount: () => useNotificationStore((state) => state.unreadCount),
  useIsLoading: () => useNotificationStore((state) => state.isLoading),
  useError: () => useNotificationStore((state) => state.error),
  usePushEnabled: () => useNotificationStore((state) => state.pushEnabled),
};