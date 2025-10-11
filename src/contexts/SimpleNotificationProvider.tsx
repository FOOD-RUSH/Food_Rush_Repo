import React, { ReactNode, useMemo } from 'react';
import { useNotificationStore } from '@/src/stores/shared/notificationStore';
import { usePushNotifications } from '@/src/hooks/shared/usePushNotifications';
import { pushNotificationService } from '@/src/services/shared/pushNotificationService';
import { useUserType } from '@/src/stores/AuthStore';

interface NotificationCounts {
  all: number;
  unread: number;
  order: number;
  system: number;
  promotion: number;
  alert: number;
}

interface NotificationContextType {
  // Notifications
  notifications: any[];
  unreadCount: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasNextPage: boolean;
  selectedFilter: string;
  notificationCounts: NotificationCounts;
  hasNotifications: boolean;
  userType: 'customer' | 'restaurant' | null;

  // Actions
  fetchNotifications: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  markAsRead: (id: string) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;
  setFilter: (filter: string) => void;
  clearError: () => void;

  // Push
  pushIsReady: boolean;
  pushError: string | null;

  // Utils
  sendLocalNotification: (
    title: string,
    body: string,
    data?: any,
  ) => Promise<string>;
  scheduleReminder: (
    title: string,
    body: string,
    minutesFromNow: number,
    data?: any,
  ) => Promise<string>;
}

const NotificationContext = React.createContext<
  NotificationContextType | undefined
>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const { isReady: pushIsReady, error: pushError } = usePushNotifications();
  const userType = useUserType();

  const {
    notifications,
    unreadCount,
    isLoading,
    isLoadingMore,
    error,
    hasNextPage,
    selectedFilter,
    fetchNotifications,
    refreshNotifications,
    loadMoreNotifications,
    markAsRead: storeMarkAsRead,
    markAllAsRead: storeMarkAllAsRead,
    setFilter,
    getFilteredNotifications,
    clearError,
  } = useNotificationStore();

  // Calculate notification counts
  const notificationCounts = useMemo(() => {
    const counts: NotificationCounts = {
      all: notifications.length,
      unread: notifications.filter(n => !n.readAt).length,
      order: notifications.filter(n => n.type === 'order').length,
      system: notifications.filter(n => n.type === 'system').length,
      promotion: notifications.filter(n => n.type === 'promotion').length,
      alert: notifications.filter(n => n.type === 'alert').length,
    };
    return counts;
  }, [notifications]);

  // Get filtered notifications
  const filteredNotifications = useMemo(() => {
    return getFilteredNotifications();
  }, [getFilteredNotifications]);

  // Enhanced mark as read with success return
  const markAsRead = async (id: string): Promise<boolean> => {
    try {
      await storeMarkAsRead(id);
      return true;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      return false;
    }
  };

  // Enhanced mark all as read with success return
  const markAllAsRead = async (): Promise<boolean> => {
    try {
      await storeMarkAllAsRead();
      return true;
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      return false;
    }
  };

  // Refresh alias
  const refresh = refreshNotifications;

  // Load more alias
  const loadMore = loadMoreNotifications;

  const value = useMemo<NotificationContextType>(
    () => ({
      notifications: filteredNotifications,
      unreadCount,
      isLoading,
      isLoadingMore,
      error,
      hasNextPage,
      selectedFilter,
      notificationCounts,
      hasNotifications: notifications.length > 0,
      userType,

      fetchNotifications,
      refreshNotifications,
      refresh,
      loadMore,
      markAsRead,
      markAllAsRead,
      setFilter,
      clearError,

      pushIsReady,
      pushError,

      sendLocalNotification: async (title, body, data) => {
        return pushNotificationService.sendLocalNotification({
          title,
          body,
          data,
        });
      },

      scheduleReminder: async (title, body, minutesFromNow, data) => {
        return pushNotificationService.scheduleReminder(
          title,
          body,
          minutesFromNow,
          data,
        );
      },
    }),
    [
      filteredNotifications,
      notifications.length,
      unreadCount,
      isLoading,
      isLoadingMore,
      error,
      hasNextPage,
      selectedFilter,
      notificationCounts,
      userType,
      pushIsReady,
      pushError,
      fetchNotifications,
      refreshNotifications,
      refresh,
      loadMore,
      markAsRead,
      markAllAsRead,
      setFilter,
      clearError,
    ],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotifications must be used within NotificationProvider',
    );
  }
  return context;
};