import React, { ReactNode, useMemo, useEffect, useCallback } from 'react';
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
  isInitialized: boolean;

  fetchNotifications: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  markAsRead: (id: string) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;
  setFilter: (filter: string) => void;
  clearError: () => void;

  pushIsReady: boolean;
  pushError: string | null;

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
  // Removed console.log for production

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
    isInitialized,
    fetchNotifications,
    refreshNotifications,
    loadMoreNotifications,
    markAsRead: storeMarkAsRead,
    markAllAsRead: storeMarkAllAsRead,
    setFilter,
    getFilteredNotifications,
    clearError,
  } = useNotificationStore();

  // WebSocket: subscribe to real-time notifications
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { socketService } = await import('@/src/services/shared/socket');
        await socketService.connect();
        if (!mounted) return;
        const onNew = (payload: any) => {
          try {
            if (payload?.id) {
              useNotificationStore.getState().addNotification(payload);
            }
          } catch {}
        };
        socketService.on('notification:new', onNew);
        return () => {
          socketService.off('notification:new', onNew);
        };
      } catch (e) {
        console.error('[NotificationProvider] socket setup error', e);
      }
    })();
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    // Removed console.log for production

    if (!isInitialized && !isLoading && userType) {
      // Removed console.log for production
      fetchNotifications().catch((err) => {
        // Initial fetch failed - handle silently
      });
    }
  }, [isInitialized, isLoading, userType, fetchNotifications]);

  // Reset and refetch when user type changes to prevent cross-role bleed-through
  const previousUserTypeRef = React.useRef<typeof userType>(userType);

  useEffect(() => {
    // Only reset if userType actually changed (not on initial mount)
    if (!userType) {
      previousUserTypeRef.current = userType;
      return;
    }

    // Skip if same as previous (prevents infinite loops)
    if (previousUserTypeRef.current === userType) {
      return;
    }

    previousUserTypeRef.current = userType;

    const doResetAndFetch = async () => {
      try {
        useNotificationStore.getState().reset();
        await fetchNotifications();
      } catch (err) {
        // Refetch on userType change failed - handle silently
      }
    };
    doResetAndFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType]);

  // Calculate notification counts
  const notificationCounts = useMemo(() => {
    // Removed console.log for production

    const counts: NotificationCounts = {
      all: notifications.length,
      unread: notifications.filter((n) => !n.readAt).length,
      order: notifications.filter((n) => n.type === 'order').length,
      system: notifications.filter((n) => n.type === 'system').length,
      promotion: notifications.filter((n) => n.type === 'promotion').length,
      alert: notifications.filter((n) => n.type === 'alert').length,
    };

    // Removed console.log for production
    return counts;
  }, [notifications]);

  // Get filtered notifications
  const filteredNotifications = useMemo(() => {
    const filtered = getFilteredNotifications();
    // Removed console.log for production
    return filtered;
  }, [getFilteredNotifications, selectedFilter]);

  // Enhanced mark as read with success return
  const markAsRead = useCallback(
    async (id: string): Promise<boolean> => {
      // Removed console.log for production
      try {
        await storeMarkAsRead(id);
        return true;
      } catch (error) {
        // Failed to mark notification as read - handle silently
        return false;
      }
    },
    [storeMarkAsRead],
  );

  // Enhanced mark all as read with success return
  const markAllAsRead = useCallback(async (): Promise<boolean> => {
    // Removed console.log for production
    try {
      await storeMarkAllAsRead();
      return true;
    } catch (error) {
      // Failed to mark all notifications as read - handle silently
      return false;
    }
  }, [storeMarkAllAsRead]);

  const value = useMemo<NotificationContextType>(() => {
    // Removed console.log for production
    return {
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
      isInitialized,

      fetchNotifications,
      refreshNotifications,
      refresh: refreshNotifications,
      loadMore: loadMoreNotifications,
      markAsRead,
      markAllAsRead,
      // Wrap the store's strongly-typed setFilter with a string-accepting wrapper
      setFilter: (filter: string) => {
        // cast to any to satisfy the store's narrower type
        setFilter(filter as any);
      },
      clearError,

      pushIsReady,
      pushError,

      sendLocalNotification: async (title, body, data) => {
        // Removed console.log for production
        return pushNotificationService.sendLocalNotification({
          title,
          body,
          data,
        });
      },

      scheduleReminder: async (title, body, minutesFromNow, data) => {
        // Removed console.log for production
        return pushNotificationService.scheduleReminder(
          title,
          body,
          minutesFromNow,
          data,
        );
      },
    };
  }, [
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
    isInitialized,
    pushIsReady,
    pushError,
    fetchNotifications,
    refreshNotifications,
    loadMoreNotifications,
    markAsRead,
    markAllAsRead,
    setFilter,
    clearError,
  ]);

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
