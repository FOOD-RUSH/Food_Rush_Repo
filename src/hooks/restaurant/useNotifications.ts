import { useEffect, useCallback } from 'react';
import { useRestaurantNotificationStore } from '@/src/stores/restaurantStores/notificationStore';
import { useAuthStore } from '@/src/stores/AuthStore';
import { notificationService } from '@/src/services/notifications/NotificationService';

/**
 * Custom hook for managing restaurant notifications
 * Provides easy access to notification state and actions
 */
export const useRestaurantNotifications = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userType = useAuthStore((state) => state.userType);
  const user = useAuthStore((state) => state.user);

  const {
    notifications,
    unreadCount,
    isLoading,
    isLoadingMore,
    error,
    hasNextPage,
    total,
    selectedFilter,
    fetchNotifications,
    loadMoreNotifications,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updateUnreadCount,
    addNotification,
    setFilter,
    registerPushToken,
    unregisterPushToken,
    clearError,
    reset,
  } = useRestaurantNotificationStore();

  // Initialize notifications when restaurant user is authenticated
  useEffect(() => {
    if (isAuthenticated && userType === 'restaurant') {
      fetchNotifications();
      updateUnreadCount();
      
      // Register push token if available
      const token = notificationService.getExpoPushToken();
      if (token && user?.id) {
        registerPushToken(token, {
          userId: user.id,
          userType: 'restaurant',
          restaurantId: user.id, // Assuming user.id is restaurant ID for restaurant users
        }).catch(console.error);
      }
    } else {
      reset();
    }
  }, [isAuthenticated, userType, user?.id]);

  // Refresh notifications
  const refresh = useCallback(async () => {
    await refreshNotifications();
    await updateUnreadCount();
  }, [refreshNotifications, updateUnreadCount]);

  // Mark notification as read and handle errors
  const markNotificationAsRead = useCallback(
    async (notificationId: string) => {
      try {
        await markAsRead(notificationId);
        return true;
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
        return false;
      }
    },
    [markAsRead],
  );

  // Mark all notifications as read and handle errors
  const markAllNotificationsAsRead = useCallback(async () => {
    try {
      await markAllAsRead();
      return true;
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      return false;
    }
  }, [markAllAsRead]);

  // Delete notification with error handling
  const deleteNotificationWithError = useCallback(
    async (notificationId: string) => {
      try {
        await deleteNotification(notificationId);
        return true;
      } catch (error) {
        console.error('Failed to delete notification:', error);
        return false;
      }
    },
    [deleteNotification],
  );

  // Load more notifications with error handling
  const loadMore = useCallback(async () => {
    if (hasNextPage && !isLoadingMore) {
      try {
        await loadMoreNotifications();
        return true;
      } catch (error) {
        console.error('Failed to load more notifications:', error);
        return false;
      }
    }
    return false;
  }, [hasNextPage, isLoadingMore, loadMoreNotifications]);

  // Filter notifications based on selected filter
  const filteredNotifications = useCallback(() => {
    switch (selectedFilter) {
      case 'unread':
        return notifications.filter(n => !n.readAt);
      case 'order':
      case 'system':
      case 'promotion':
      case 'alert':
        return notifications.filter(n => n.type === selectedFilter);
      default:
        return notifications;
    }
  }, [notifications, selectedFilter]);

  // Get notification counts by type
  const getNotificationCounts = useCallback(() => {
    return {
      all: notifications.length,
      unread: notifications.filter(n => !n.readAt).length,
      order: notifications.filter(n => n.type === 'order').length,
      system: notifications.filter(n => n.type === 'system').length,
      promotion: notifications.filter(n => n.type === 'promotion').length,
      alert: notifications.filter(n => n.type === 'alert').length,
    };
  }, [notifications]);

  return {
    // State
    notifications: filteredNotifications(),
    allNotifications: notifications,
    unreadCount,
    isLoading,
    isLoadingMore,
    error,
    hasNextPage,
    total,
    selectedFilter,

    // Actions
    refresh,
    loadMore,
    markAsRead: markNotificationAsRead,
    markAllAsRead: markAllNotificationsAsRead,
    deleteNotification: deleteNotificationWithError,
    addNotification,
    setFilter,
    clearError,

    // Push notification actions
    registerPushToken,
    unregisterPushToken,

    // Computed
    hasNotifications: notifications.length > 0,
    hasUnreadNotifications: unreadCount > 0,
    notificationCounts: getNotificationCounts(),
  };
};

/**
 * Hook for getting unread count only (lightweight)
 * Useful for badge displays
 */
export const useRestaurantUnreadNotificationCount = () => {
  const unreadCount = useRestaurantNotificationStore((state) => state.unreadCount);
  const updateUnreadCount = useRestaurantNotificationStore(
    (state) => state.updateUnreadCount,
  );
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userType = useAuthStore((state) => state.userType);

  // Update unread count when authenticated as restaurant
  useEffect(() => {
    if (isAuthenticated && userType === 'restaurant') {
      updateUnreadCount();
    }
  }, [isAuthenticated, userType, updateUnreadCount]);

  return {
    unreadCount,
    hasUnreadNotifications: unreadCount > 0,
    updateUnreadCount,
  };
};

/**
 * Hook for handling push notifications for restaurants
 */
export const useRestaurantPushNotifications = () => {
  const { registerPushToken, unregisterPushToken } = useRestaurantNotificationStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userType = useAuthStore((state) => state.userType);
  const user = useAuthStore((state) => state.user);

  // Initialize push notifications
  const initializePushNotifications = useCallback(async () => {
    if (!isAuthenticated || userType !== 'restaurant' || !user?.id) {
      return false;
    }

    try {
      const isInitialized = await notificationService.initialize();
      if (!isInitialized) {
        console.warn('Failed to initialize notification service');
        return false;
      }

      const token = notificationService.getExpoPushToken();
      if (token) {
        await registerPushToken(token, {
          userId: user.id,
          userType: 'restaurant',
          restaurantId: user.id,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
      return false;
    }
  }, [isAuthenticated, userType, user?.id, registerPushToken]);

  // Cleanup push notifications
  const cleanupPushNotifications = useCallback(async () => {
    try {
      const token = notificationService.getExpoPushToken();
      if (token) {
        await unregisterPushToken(token);
      }
    } catch (error) {
      console.error('Failed to cleanup push notifications:', error);
    }
  }, [unregisterPushToken]);

  return {
    initializePushNotifications,
    cleanupPushNotifications,
  };
};