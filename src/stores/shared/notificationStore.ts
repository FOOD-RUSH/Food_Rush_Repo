import { create } from 'zustand';
import { notificationApi } from '@/src/services/shared/notificationApi';
import type { Notification } from '@/src/types';
import { eventBus } from '@/src/services/shared/eventBus';

interface NotificationState {
  // Data
  notifications: Notification[];
  unreadCount: number;
  currentPage: number;
  totalPages: number;
  selectedFilter: 'all' | 'unread' | 'order' | 'system' | 'promotion' | 'alert';

  // Loading states
  isLoading: boolean;
  isLoadingMore: boolean;

  // Error handling
  error: string | null;

  // Flags
  hasNextPage: boolean;
  pushEnabled: boolean;
  isInitialized: boolean;

  // Actions
  fetchNotifications: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  loadMoreNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (notification: Notification) => void;
  setFilter: (filter: NotificationState['selectedFilter']) => void;
  getFilteredNotifications: () => Notification[];
  updateUnreadCount: () => Promise<void>;
  setPushEnabled: (enabled: boolean) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  notifications: [],
  unreadCount: 0,
  currentPage: 1,
  totalPages: 1,
  selectedFilter: 'all' as const,
  isLoading: false,
  isLoadingMore: false,
  error: null,
  hasNextPage: false,
  pushEnabled: false,
  isInitialized: false,
};

export const useNotificationStore = create<NotificationState>((set, get) => {
  // Listen to logout event and reset notifications
  eventBus.on('user-logout', () => {
    set(initialState);
  });

  return {
    ...initialState,

  fetchNotifications: async () => {
    const state = get();
    if (state.isLoading) {
      // Already loading, skipping fetch
      return;
    }

    // Removed console.log for production
    set({ isLoading: true, error: null });

    try {
      const params: any = { limit: 20, page: 1 };

      // Apply filter
      if (state.selectedFilter !== 'all' && state.selectedFilter !== 'unread') {
        params.type = state.selectedFilter;
      }

      // Removed console.log for production
      const response = await notificationApi.getNotifications(params);
      // Removed console.log for production

      let notifications = response.data.items || [];

      // Apply unread filter locally (API might not support it)
      if (state.selectedFilter === 'unread') {
        notifications = notifications.filter((n) => !n.readAt);
        // Removed console.log for production
      }

      const unreadCount = notifications.filter((n) => !n.readAt).length;

      set({
        notifications,
        unreadCount,
        currentPage: response.data.page,
        totalPages: response.data.pages,
        hasNextPage: response.data.page < response.data.pages,
        isLoading: false,
        isInitialized: true,
        error: null,
      });

      // Removed console.log for production
    } catch (error: any) {
      // Fetch error - handle silently
      set({
        error: error.message || 'Failed to fetch notifications',
        isLoading: false,
      });
    }
  },

  refreshNotifications: async () => {
    // Removed console.log for production
    set({ currentPage: 1 });
    await get().fetchNotifications();
  },

  loadMoreNotifications: async () => {
    const state = get();

    if (state.isLoadingMore || !state.hasNextPage) {
      // Skip load more - removed console.log
      return;
    }

    // Removed console.log for production
    set({ isLoadingMore: true, error: null });

    try {
      const nextPage = state.currentPage + 1;
      const params: any = { limit: 20, page: nextPage };

      if (state.selectedFilter !== 'all' && state.selectedFilter !== 'unread') {
        params.type = state.selectedFilter;
      }

      // Removed console.log for production
      const response = await notificationApi.getNotifications(params);
      // Removed console.log for production

      let newNotifications = response.data.items || [];

      if (state.selectedFilter === 'unread') {
        newNotifications = newNotifications.filter((n) => !n.readAt);
      }

      const allNotifications = [...state.notifications, ...newNotifications];
      const unreadCount = allNotifications.filter((n) => !n.readAt).length;

      set({
        notifications: allNotifications,
        unreadCount,
        currentPage: response.data.page,
        hasNextPage: response.data.page < response.data.pages,
        isLoadingMore: false,
      });

      // Removed console.log for production
    } catch (error: any) {
      // Load more error - handle silently
      set({
        error: error.message || 'Failed to load more notifications',
        isLoadingMore: false,
      });
    }
  },

  markAsRead: async (id: string) => {
    // Removed console.log for production

    try {
      await notificationApi.markAsRead(id);

      set((state) => {
        const updatedNotifications = state.notifications.map((n) =>
          n.id === id ? { ...n, readAt: new Date().toISOString() } : n,
        );
        const unreadCount = updatedNotifications.filter(
          (n) => !n.readAt,
        ).length;

        // Removed console.log for production

        return {
          notifications: updatedNotifications,
          unreadCount,
        };
      });
    } catch (error: any) {
      // Mark as read error - handle silently
      throw error;
    }
  },

  markAllAsRead: async () => {
    // Removed console.log for production

    try {
      await notificationApi.markAllAsRead();

      set((state) => {
        const updatedNotifications = state.notifications.map((n) => ({
          ...n,
          readAt: n.readAt || new Date().toISOString(),
        }));

        // Removed console.log for production

        return {
          notifications: updatedNotifications,
          unreadCount: 0,
        };
      });
    } catch (error: any) {
      // Mark all as read error - handle silently
      throw error;
    }
  },

  addNotification: (notification: Notification) => {
    // Removed console.log for production

    set((state) => {
      // Check if notification already exists
      const exists = state.notifications.some((n) => n.id === notification.id);
      if (exists) {
        // Notification already exists, skipping - removed console.log
        return state;
      }

      const notifications = [notification, ...state.notifications];
      const unreadCount = notifications.filter((n) => !n.readAt).length;

      // Removed console.log for production

      return {
        notifications,
        unreadCount,
      };
    });
  },

  setFilter: (filter: NotificationState['selectedFilter']) => {
    // Removed console.log for production
    set({ selectedFilter: filter, currentPage: 1 });
    get().fetchNotifications();
  },

  getFilteredNotifications: () => {
    const state = get();
    // Removed console.log for production

    switch (state.selectedFilter) {
      case 'unread':
        return state.notifications.filter((n) => !n.readAt);
      case 'all':
        return state.notifications;
      default:
        return state.notifications.filter(
          (n) => n.type === state.selectedFilter,
        );
    }
  },

  updateUnreadCount: async () => {
    // Removed console.log for production

    try {
      const response = await notificationApi.getUnreadCount();
      const count = response.data.count;

      // Removed console.log for production
      set({ unreadCount: count });
    } catch (error: any) {
      // Update unread count error - handle silently
    }
  },

  setPushEnabled: (enabled: boolean) => {
    // Removed console.log for production
    set({ pushEnabled: enabled });
  },

  clearError: () => {
    // Removed console.log for production
    set({ error: null });
  },

  reset: () => {
    // Removed console.log for production
    set(initialState);
  },
  };
});
