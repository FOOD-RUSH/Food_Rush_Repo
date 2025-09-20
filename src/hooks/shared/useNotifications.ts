import { useEffect, useCallback } from 'react';
import { useNotificationStore } from '@/src/stores/shared/notificationStore';
import { useUser, useIsAuthenticated, useUserType } from '@/src/stores/AuthStore';
import { notificationService } from '@/src/services/notifications/NotificationService';

/**
 * Unified notification hook for both customer and restaurant users
 * The backend determines the user type from the authentication token
 * and returns appropriate notifications for that user type
 */
export const useNotifications = () => {
  const isAuthenticated = useIsAuthenticated();
  const userType = useUserType();
  const user = useUser();

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
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updateUnreadCount,
    addNotification,
    setFilter,
    refreshNotifications,
    registerPushToken,
    unregisterPushToken,
    clearError,
    reset,
  } = useNotificationStore();

  // Initialize notifications when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchNotifications({ limit: 20, page: 1 });
      updateUnreadCount();
    } else {
      reset();
    }
  }, [isAuthenticated, user?.id, fetchNotifications, updateUnreadCount, reset]);

  // Register push token when notification service is initialized
  useEffect(() => {
    const initializePushNotifications = async () => {
      if (isAuthenticated && userType && notificationService.isServiceInitialized()) {
        const token = notificationService.getExpoPushToken();
        if (token) {
          try {
            await registerPushToken(token, {
              userType,
              userId: user?.id,
              platform: 'mobile',
            });
          } catch (error) {
            console.error('Failed to register push token:', error);
          }
        }
      }
    };

    initializePushNotifications();
  }, [isAuthenticated, userType, user?.id, registerPushToken]);

  // Handle marking notification as read
  const handleMarkAsRead = useCallback(async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, [markAsRead]);

  // Handle marking all notifications as read
  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }, [markAllAsRead]);

  // Handle deleting notification
  const handleDeleteNotification = useCallback(async (notificationId: string) => {
    try {
      await deleteNotification(notificationId);
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  }, [deleteNotification]);

  // Handle refreshing notifications
  const handleRefresh = useCallback(async () => {
    try {
      await refreshNotifications();
      await updateUnreadCount();
    } catch (error) {
      console.error('Failed to refresh notifications:', error);
    }
  }, [refreshNotifications, updateUnreadCount]);

  // Handle loading more notifications
  const handleLoadMore = useCallback(async () => {
    if (hasNextPage && !isLoadingMore) {
      try {
        await loadMoreNotifications();
      } catch (error) {
        console.error('Failed to load more notifications:', error);
      }
    }
  }, [hasNextPage, isLoadingMore, loadMoreNotifications]);

  // Filter notifications based on selected filter
  const filteredNotifications = useCallback(() => {
    if (selectedFilter === 'all') {
      return notifications;
    }
    if (selectedFilter === 'unread') {
      return notifications.filter(n => !n.readAt);
    }
    return notifications.filter(n => n.type === selectedFilter);
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
    // Data
    notifications: filteredNotifications(),
    allNotifications: notifications,
    unreadCount,
    total,
    
    // Loading states
    isLoading,
    isLoadingMore,
    hasNextPage,
    
    // Error handling
    error,
    clearError,
    
    // Filter
    selectedFilter,
    setFilter,
    
    // Actions
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    deleteNotification: handleDeleteNotification,
    refresh: handleRefresh,
    loadMore: handleLoadMore,
    addNotification,
    
    // User context
    userType,
    isAuthenticated,
    
    // Computed values
    notificationCounts: getNotificationCounts(),
    hasNotifications: notifications.length > 0,
    hasUnreadNotifications: unreadCount > 0,
  };
};

/**
 * Hook for getting unread notification count
 */
export const useUnreadNotificationCount = () => {
  const isAuthenticated = useIsAuthenticated();
  const userType = useUserType();
  const { unreadCount, updateUnreadCount } = useNotificationStore();

  // Update unread count periodically for authenticated users
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      updateUnreadCount();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated, updateUnreadCount]);

  return {
    unreadCount: isAuthenticated ? unreadCount : 0,
    userType,
    isAuthenticated,
  };
};

/**
 * Hook for managing push notification registration
 */
export const usePushNotificationRegistration = () => {
  const isAuthenticated = useIsAuthenticated();
  const userType = useUserType();
  const user = useUser();
  const { registerPushToken, unregisterPushToken } = useNotificationStore();

  const registerToken = useCallback(async (token: string) => {
    if (!isAuthenticated || !userType) {
      console.warn('Cannot register push token: user not authenticated or user type unknown');
      return;
    }

    try {
      await registerPushToken(token, {
        userType,
        userId: user?.id,
        platform: 'mobile',
      });
      console.log(`Push token registered successfully for ${userType}`);
    } catch (error) {
      console.error('Failed to register push token:', error);
      throw error;
    }
  }, [isAuthenticated, userType, user?.id, registerPushToken]);

  const unregisterToken = useCallback(async (token: string) => {
    try {
      await unregisterPushToken(token);
      console.log('Push token unregistered successfully');
    } catch (error) {
      console.error('Failed to unregister push token:', error);
      throw error;
    }
  }, [unregisterPushToken]);

  return {
    registerToken,
    unregisterToken,
    isAuthenticated,
    userType,
  };
};