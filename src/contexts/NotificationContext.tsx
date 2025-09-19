import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useNotificationStore } from '@/src/stores/customerStores/notificationStore';
import { useAuthStore } from '@/src/stores/AuthStore';
import type { Notification } from '@/src/types';

interface NotificationContextType {
  // Context can be extended in the future for additional functionality
  addNotification: (notification: Notification) => void;
  updateUnreadCount: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { addNotification, updateUnreadCount } = useNotificationStore();

  // Update unread count when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated) {
      updateUnreadCount();
    }
  }, [isAuthenticated, updateUnreadCount]);

  // Handle incoming push notifications
  const handleAddNotification = (notification: Notification) => {
    addNotification(notification);
  };

  const contextValue: NotificationContextType = {
    addNotification: handleAddNotification,
    updateUnreadCount,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotificationContext must be used within a NotificationProvider',
    );
  }
  return context;
};
