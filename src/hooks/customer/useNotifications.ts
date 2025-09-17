import { useEffect, useCallback } from 'react';
import { useNotificationStore } from '@/src/stores/customerStores/notificationStore';
import { useAuthStore } from '@/src/stores/customerStores/AuthStore';

/**
 * Custom hook for managing notifications
 * Provides easy access to notification state and actions
 */
export const useNotifications = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  const {
    notifications,
    unreadCount,
    isLoading,
    isLoadingMore,
    error,
    hasNextPage,
    total,
    fetchNotifications,
    loadMoreNotifications,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
    updateUnreadCount,
    addNotification,
    clearError,
    reset,
  } = useNotificationStore();

  // Initialize notifications when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      updateUnreadCount();
    } else {
      reset();
    }
  }, [isAuthenticated]);

  // Refresh notifications
  const refresh = useCallback(async () => {
    await refreshNotifications();
    await updateUnreadCount();
  }, [refreshNotifications, updateUnreadCount]);

  // Mark notification as read and handle errors
  const markNotificationAsRead = useCallback(async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
      return true;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      return false;
    }
  }, [markAsRead]);

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

  return {
    // State
    notifications,
    unreadCount,
    isLoading,
    isLoadingMore,
    error,
    hasNextPage,
    total,
    
    // Actions
    refresh,
    loadMore,
    markAsRead: markNotificationAsRead,
    markAllAsRead: markAllNotificationsAsRead,
    addNotification,
    clearError,
    
    // Computed
    hasNotifications: notifications.length > 0,
    hasUnreadNotifications: unreadCount > 0,
  };
};

/**
 * Hook for getting unread count only (lightweight)
 * Useful for badge displays
 */
export const useUnreadNotificationCount = () => {
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const updateUnreadCount = useNotificationStore((state) => state.updateUnreadCount);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Update unread count when authenticated
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