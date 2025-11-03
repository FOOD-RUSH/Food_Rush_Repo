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
      console.log('[NotificationStore] Already loading, skipping fetch');
      return;
    }

    console.log('[NotificationStore] Fetching notifications...');
    set({ isLoading: true, error: null });

    try {
      const params: any = { limit: 20, page: 1 };

      // Apply filter
      if (state.selectedFilter !== 'all' && state.selectedFilter !== 'unread') {
        params.type = state.selectedFilter;
      }

      console.log('[NotificationStore] API params:', params);
      const response = await notificationApi.getNotifications(params);
      console.log('[NotificationStore] API response:', {
        total: response.data.total,
        items: response.data.items.length,
        pages: response.data.pages,
      });

      let notifications = response.data.items || [];

      // Apply unread filter locally (API might not support it)
      if (state.selectedFilter === 'unread') {
        notifications = notifications.filter((n) => !n.readAt);
        console.log(
          '[NotificationStore] Filtered to unread:',
          notifications.length,
        );
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

      console.log('[NotificationStore] State updated:', {
        notificationsCount: notifications.length,
        unreadCount,
        hasNextPage: response.data.page < response.data.pages,
      });
    } catch (error: any) {
      console.error('[NotificationStore] Fetch error:', error);
      set({
        error: error.message || 'Failed to fetch notifications',
        isLoading: false,
      });
    }
  },

  refreshNotifications: async () => {
    console.log('[NotificationStore] Refreshing notifications...');
    set({ currentPage: 1 });
    await get().fetchNotifications();
  },

  loadMoreNotifications: async () => {
    const state = get();

    if (state.isLoadingMore || !state.hasNextPage) {
      console.log('[NotificationStore] Skip load more:', {
        isLoadingMore: state.isLoadingMore,
        hasNextPage: state.hasNextPage,
      });
      return;
    }

    console.log('[NotificationStore] Loading more notifications...');
    set({ isLoadingMore: true, error: null });

    try {
      const nextPage = state.currentPage + 1;
      const params: any = { limit: 20, page: nextPage };

      if (state.selectedFilter !== 'all' && state.selectedFilter !== 'unread') {
        params.type = state.selectedFilter;
      }

      console.log('[NotificationStore] Load more params:', params);
      const response = await notificationApi.getNotifications(params);
      console.log('[NotificationStore] Load more response:', {
        newItems: response.data.items.length,
        page: response.data.page,
      });

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

      console.log('[NotificationStore] Load more complete:', {
        totalNotifications: allNotifications.length,
        unreadCount,
      });
    } catch (error: any) {
      console.error('[NotificationStore] Load more error:', error);
      set({
        error: error.message || 'Failed to load more notifications',
        isLoadingMore: false,
      });
    }
  },

  markAsRead: async (id: string) => {
    console.log('[NotificationStore] Marking as read:', id);

    try {
      await notificationApi.markAsRead(id);

      set((state) => {
        const updatedNotifications = state.notifications.map((n) =>
          n.id === id ? { ...n, readAt: new Date().toISOString() } : n,
        );
        const unreadCount = updatedNotifications.filter(
          (n) => !n.readAt,
        ).length;

        console.log('[NotificationStore] Mark as read success:', {
          id,
          newUnreadCount: unreadCount,
        });

        return {
          notifications: updatedNotifications,
          unreadCount,
        };
      });
    } catch (error: any) {
      console.error('[NotificationStore] Mark as read error:', error);
      throw error;
    }
  },

  markAllAsRead: async () => {
    console.log('[NotificationStore] Marking all as read...');

    try {
      await notificationApi.markAllAsRead();

      set((state) => {
        const updatedNotifications = state.notifications.map((n) => ({
          ...n,
          readAt: n.readAt || new Date().toISOString(),
        }));

        console.log('[NotificationStore] Mark all as read success');

        return {
          notifications: updatedNotifications,
          unreadCount: 0,
        };
      });
    } catch (error: any) {
      console.error('[NotificationStore] Mark all as read error:', error);
      throw error;
    }
  },

  addNotification: (notification: Notification) => {
    console.log('[NotificationStore] Adding notification:', {
      id: notification.id,
      title: notification.title,
      type: notification.type,
    });

    set((state) => {
      // Check if notification already exists
      const exists = state.notifications.some((n) => n.id === notification.id);
      if (exists) {
        console.log(
          '[NotificationStore] Notification already exists, skipping',
        );
        return state;
      }

      const notifications = [notification, ...state.notifications];
      const unreadCount = notifications.filter((n) => !n.readAt).length;

      console.log('[NotificationStore] Notification added:', {
        totalNotifications: notifications.length,
        unreadCount,
      });

      return {
        notifications,
        unreadCount,
      };
    });
  },

  setFilter: (filter: NotificationState['selectedFilter']) => {
    console.log('[NotificationStore] Setting filter:', filter);
    set({ selectedFilter: filter, currentPage: 1 });
    get().fetchNotifications();
  },

  getFilteredNotifications: () => {
    const state = get();
    console.log('[NotificationStore] Getting filtered notifications:', {
      filter: state.selectedFilter,
      total: state.notifications.length,
    });

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
    console.log('[NotificationStore] Updating unread count...');

    try {
      const response = await notificationApi.getUnreadCount();
      const count = response.data.count;

      console.log('[NotificationStore] Unread count updated:', count);
      set({ unreadCount: count });
    } catch (error: any) {
      console.error('[NotificationStore] Update unread count error:', error);
    }
  },

  setPushEnabled: (enabled: boolean) => {
    console.log('[NotificationStore] Push enabled:', enabled);
    set({ pushEnabled: enabled });
  },

  clearError: () => {
    console.log('[NotificationStore] Clearing error');
    set({ error: null });
  },

  reset: () => {
    console.log('[NotificationStore] Resetting store');
    set(initialState);
  },
  };
});
