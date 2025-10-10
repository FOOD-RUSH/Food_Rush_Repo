// src/hooks/useNotifications.ts
import { useEffect, useMemo } from 'react';
import { useNotificationStore } from '@/src/stores/shared/notificationStore';
import { useAuthStore } from '@/src/stores/AuthStore';
import { usePushNotifications } from '@/src/hooks/shared/usePushNotifications';
import pushNotificationService from '@/src/services/shared/pushNotificationService';

/**
 * Unified notification hook for both customer and restaurant users
 * Automatically initializes the correct notification service based on user type
 * Includes push notification management
 */
export const useNotifications = () => {
  const { isAuthenticated, user } = useAuthStore();
  const userType = user?.role?.toLowerCase() === 'restaurant' ? 'restaurant' : 'customer';

  const {
    notifications,
    unreadCount,
    isLoading,
    isLoadingMore,
    error,
    hasNextPage,
    currentPage,
    totalPages,
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

  // Push notification management
  const pushNotifications = usePushNotifications(true);

  // Initialize notifications when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      // The push notification service is already initialized via usePushNotifications hook

    }
  }, [isAuthenticated, user, userType]);

  // Auto-fetch notifications when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      updateUnreadCount();
    }
  }, [isAuthenticated, fetchNotifications, updateUnreadCount]);

  // Computed values
  const filteredNotifications = getFilteredNotifications();
  const hasNotifications = notifications.length > 0;
  
  // Notification counts by type
  const notificationCounts = useMemo(() => ({
    all: notifications.length,
    unread: notifications.filter(n => !n.readAt).length,
    order: notifications.filter(n => n.type === 'order').length,
    system: notifications.filter(n => n.type === 'system').length,
    promotion: notifications.filter(n => n.type === 'promotion').length,
    alert: notifications.filter(n => n.type === 'alert').length,
  }), [notifications]);

  // Refresh function
  const refresh = async () => {
    await refreshNotifications();
    await updateUnreadCount();
  };

  // Load more function
  const loadMore = async () => {
    if (hasNextPage && !isLoadingMore) {
      await loadMoreNotifications();
    }
  };

  // Send local notification (for testing)
  const sendLocalNotification = async (
    title: string,
    body: string,
    data?: any,
  ) => {
    try {
      // Use the push notification service directly
      await pushNotificationService.sendLocalNotification({
        title,
        body,
        data,
      });
    } catch (error) {
      console.error('Error sending local notification:', error);
    }
  };

  // Enhanced mark as read with optimistic updates
  const markAsReadOptimistic = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
      // Refresh unread count from server after marking as read
      await updateUnreadCount();
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Refresh count even on error to ensure consistency
      await updateUnreadCount();
      return false;
    }
  };

  // Enhanced mark all as read
  const markAllAsReadOptimistic = async () => {
    try {
      await markAllAsRead();
      // Refresh unread count from server after marking all as read
      await updateUnreadCount();
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // Refresh count even on error to ensure consistency
      await updateUnreadCount();
      return false;
    }
  };

  return {
    // Data
    notifications: filteredNotifications,
    allNotifications: notifications,
    unreadCount,
    notificationCounts,
    
    // State
    isLoading,
    isLoadingMore,
    error,
    hasNextPage,
    currentPage,
    totalPages,
    total,
    selectedFilter,
    hasNotifications,
    userType,
    
    // Actions
    fetchNotifications,
    refresh,
    loadMore,
    markAsRead: markAsReadOptimistic,
    markAllAsRead: markAllAsReadOptimistic,
    updateUnreadCount,
    addNotification,
    setFilter,
    clearError,
    reset,
    sendLocalNotification,
    
    // Push notifications
    pushNotifications,
  };
};

// Export individual hooks for specific use cases
export { useUnreadNotificationCount } from '@/src/hooks/shared/useUnreadNotificationCount';
export { usePushNotifications } from '@/src/hooks/shared/usePushNotifications';

export default useNotifications;
