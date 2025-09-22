// src/hooks/useNotifications.ts
import { useEffect, useCallback, useMemo } from 'react';
import { useNotificationStore } from '@/src/stores/shared/notificationStore';
import { useAuthStore } from '@/src/stores/AuthStore';
import { getNotificationService, initializeNotifications } from '@/src/notifications';

/**
 * Unified notification hook for both customer and restaurant users
 * Automatically initializes the correct notification service based on user type
 */
export const useNotifications = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

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
    updateUnreadCount,
    addNotification,
    setFilter,
    getFilteredNotifications,
    clearError,
    reset,
  } = useNotificationStore();

  // Get the appropriate notification service
  const notificationService = useMemo(() => {
    if (!user) return null;
    return getNotificationService(user.role, user.id);
  }, [user]);

  // Initialize notifications when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      // Initialize the notification service
      initializeNotifications(user.role, user.id);
      
      // Fetch server notifications
      fetchNotifications();
      updateUnreadCount();
    } else {
      reset();
    }
  }, [isAuthenticated, user, fetchNotifications, updateUnreadCount, reset]);

  // Filtered notifications based on current filter
  const filteredNotifications = useMemo(() => {
    return getFilteredNotifications();
  }, [getFilteredNotifications]);

  // Notification counts by type
  const notificationCounts = useMemo(() => {
    return {
      all: notifications.length,
      unread: notifications.filter(n => !n.readAt).length,
      order: notifications.filter(n => n.type === 'order').length,
      system: notifications.filter(n => n.type === 'system').length,
      promotion: notifications.filter(n => n.type === 'promotion').length,
      alert: notifications.filter(n => n.type === 'alert').length,
    };
  }, [notifications]);

  // Refresh notifications
  const refresh = useCallback(async () => {
    await refreshNotifications();
    await updateUnreadCount();
  }, [refreshNotifications, updateUnreadCount]);

  // Load more notifications
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

  // Mark notification as read with error handling
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

  // Mark all notifications as read with error handling
  const markAllNotificationsAsRead = useCallback(async () => {
    try {
      await markAllAsRead();
      return true;
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      return false;
    }
  }, [markAllAsRead]);

  // Local notification methods (using the service)
  const sendLocalNotification = useCallback(
    async (title: string, body: string, data?: any) => {
      if (!notificationService) return null;
      
      try {
        return await notificationService.sendLocalNotification({
          title,
          body,
          data,
        });
      } catch (error) {
        console.error('Failed to send local notification:', error);
        return null;
      }
    },
    [notificationService],
  );

  const sendOrderNotification = useCallback(
    async (orderId: string, status: string, details?: any) => {
      if (!notificationService) return null;
      
      try {
        return await notificationService.sendOrderNotification(orderId, status, details);
      } catch (error) {
        console.error('Failed to send order notification:', error);
        return null;
      }
    },
    [notificationService],
  );

  const sendPromotionNotification = useCallback(
    async (title: string, message: string, data?: any) => {
      if (!notificationService) return null;
      
      try {
        return await notificationService.sendPromotionNotification(title, message, data);
      } catch (error) {
        console.error('Failed to send promotion notification:', error);
        return null;
      }
    },
    [notificationService],
  );

  const scheduleReminder = useCallback(
    async (title: string, message: string, minutesFromNow: number, data?: any) => {
      if (!notificationService) return null;
      
      try {
        return await notificationService.scheduleReminder(title, message, minutesFromNow, data);
      } catch (error) {
        console.error('Failed to schedule reminder:', error);
        return null;
      }
    },
    [notificationService],
  );

  const clearBadge = useCallback(async () => {
    if (notificationService) {
      await notificationService.clearBadge();
    }
  }, [notificationService]);

  return {
    // State
    notifications: filteredNotifications,
    allNotifications: notifications,
    unreadCount,
    isLoading,
    isLoadingMore,
    error,
    hasNextPage,
    total,
    selectedFilter,
    notificationCounts,

    // Server notification actions
    refresh,
    loadMore,
    markAsRead: markNotificationAsRead,
    markAllAsRead: markAllNotificationsAsRead,
    addNotification,
    setFilter,
    clearError,

    // Local notification actions
    sendLocalNotification,
    sendOrderNotification,
    sendPromotionNotification,
    scheduleReminder,
    clearBadge,

    // Computed
    hasNotifications: filteredNotifications.length > 0,
    hasUnreadNotifications: unreadCount > 0,
    
    // User context
    userType: user?.role || null,
    isCustomer: user?.role === 'customer',
    isRestaurant: user?.role === 'restaurant',
  };
};

/**
 * Lightweight hook for just unread count (for badges)
 */
export const useUnreadNotificationCount = () => {
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const updateUnreadCount = useNotificationStore((state) => state.updateUnreadCount);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      updateUnreadCount();
    }
  }, [isAuthenticated, updateUnreadCount]);

  return {
    unreadCount,
    hasUnreadNotifications: unreadCount > 0,
    updateUnreadCount,
  };
};
