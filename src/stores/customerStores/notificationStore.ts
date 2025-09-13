import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  notificationApi,
  Notification,
  NotificationSettings,
} from '@/src/services/customer/notification.service';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  settings: NotificationSettings | null;
  isLoading: boolean;
  error: string | null;
}

interface NotificationActions {
  // Fetch notifications
  fetchNotifications: (userId: string) => Promise<void>;

  // Mark notification as read
  markAsRead: (notificationId: string) => Promise<void>;

  // Mark all notifications as read
  markAllAsRead: (userId: string) => Promise<void>;

  // Delete notification
  deleteNotification: (notificationId: string) => Promise<void>;

  // Fetch notification settings
  fetchSettings: (userId: string) => Promise<void>;

  // Update notification settings
  updateSettings: (
    userId: string,
    settings: Partial<NotificationSettings>,
  ) => Promise<void>;

  // Update unread count
  updateUnreadCount: (userId: string) => Promise<void>;

  // Add new notification (for push notifications)
  addNotification: (notification: Notification) => void;

  // Clear error
  clearError: () => void;

  // Reset store
  reset: () => void;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  settings: null,
  isLoading: false,
  error: null,
};

export const useNotificationStore = create<
  NotificationState & NotificationActions
>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        fetchNotifications: async (userId) => {
          try {
            set({ isLoading: true, error: null });
            const response = await notificationApi.getNotifications(userId);

            set({
              notifications: response.data,
              isLoading: false,
            });
          } catch (error: any) {
            set({
              error: error.message || 'Failed to fetch notifications',
              isLoading: false,
            });
          }
        },

        markAsRead: async (notificationId) => {
          try {
            await notificationApi.markAsRead(notificationId);

            set((state) => ({
              notifications: state.notifications.map((notification) =>
                notification.id === notificationId
                  ? { ...notification, isRead: true }
                  : notification,
              ),
              unreadCount: Math.max(0, state.unreadCount - 1),
            }));
          } catch (error: any) {
            set({
              error: error.message || 'Failed to mark notification as read',
            });
            throw error;
          }
        },

        markAllAsRead: async (userId) => {
          try {
            await notificationApi.markAllAsRead(userId);

            set((state) => ({
              notifications: state.notifications.map((notification) => ({
                ...notification,
                isRead: true,
              })),
              unreadCount: 0,
            }));
          } catch (error: any) {
            set({
              error:
                error.message || 'Failed to mark all notifications as read',
            });
            throw error;
          }
        },

        deleteNotification: async (notificationId) => {
          try {
            await notificationApi.deleteNotification(notificationId);

            set((state) => ({
              notifications: state.notifications.filter(
                (notification) => notification.id !== notificationId,
              ),
            }));
          } catch (error: any) {
            set({
              error: error.message || 'Failed to delete notification',
            });
            throw error;
          }
        },

        fetchSettings: async (userId) => {
          try {
            set({ isLoading: true, error: null });
            const response = await notificationApi.getSettings(userId);

            set({
              settings: response.data,
              isLoading: false,
            });
          } catch (error: any) {
            set({
              error: error.message || 'Failed to fetch notification settings',
              isLoading: false,
            });
          }
        },

        updateSettings: async (userId, settings) => {
          try {
            set({ isLoading: true, error: null });
            const response = await notificationApi.updateSettings(
              userId,
              settings,
            );

            set({
              settings: response.data,
              isLoading: false,
            });
          } catch (error: any) {
            set({
              error: error.message || 'Failed to update notification settings',
              isLoading: false,
            });
            throw error;
          }
        },

        updateUnreadCount: async (userId) => {
          try {
            const response = await notificationApi.getUnreadCount(userId);

            set({
              unreadCount: response.data,
            });
          } catch (error: any) {
            set({
              error: error.message || 'Failed to update unread count',
            });
          }
        },

        addNotification: (notification) => {
          set((state) => ({
            notifications: [notification, ...state.notifications],
            unreadCount: state.unreadCount + (notification.isRead ? 0 : 1),
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
          settings: state.settings,
        }),
        version: 1,
      },
    ),
    { name: 'NotificationStore' },
  ),
);

// Selector hooks for better performance
export const useNotifications = () =>
  useNotificationStore((state) => state.notifications);
export const useUnreadCount = () =>
  useNotificationStore((state) => state.unreadCount);
export const useNotificationSettings = () =>
  useNotificationStore((state) => state.settings);
export const useNotificationLoading = () =>
  useNotificationStore((state) => state.isLoading);
export const useNotificationError = () =>
  useNotificationStore((state) => state.error);
