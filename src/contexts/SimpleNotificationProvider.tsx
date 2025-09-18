import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useNotifications } from '@/src/hooks/useNotifications';

interface NotificationContextType {
  // Customer functions
  sendOrderStatus: (orderId: string, status: 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled', restaurantName?: string) => Promise<void>;
  scheduleCartReminder: (itemCount: number, restaurantName?: string, minutesFromNow?: number) => Promise<string | null>;
  cancelCartReminders: () => Promise<void>;
  
  // Restaurant functions
  sendNewOrder: (orderId: string, customerName?: string) => Promise<void>;
  
  // Common functions
  sendPromotion: (title: string, message: string, promotionId?: string) => Promise<void>;
  sendGeneral: (title: string, message: string, data?: Record<string, any>) => Promise<void>;
  
  // State
  isAuthenticated: boolean;
  userType: 'customer' | 'restaurant' | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const SimpleNotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const notifications = useNotifications();

  const contextValue: NotificationContextType = useMemo(() => ({
    sendOrderStatus: notifications.sendOrderStatus,
    scheduleCartReminder: notifications.scheduleCartReminderNotification,
    cancelCartReminders: notifications.cancelCartReminderNotifications,
    sendNewOrder: notifications.sendNewOrder,
    sendPromotion: notifications.sendPromotion,
    sendGeneral: notifications.sendGeneral,
    isAuthenticated: notifications.isAuthenticated,
    userType: notifications.userType,
  }), [
    notifications.sendOrderStatus,
    notifications.scheduleCartReminderNotification,
    notifications.cancelCartReminderNotifications,
    notifications.sendNewOrder,
    notifications.sendPromotion,
    notifications.sendGeneral,
    notifications.isAuthenticated,
    notifications.userType,
  ]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a SimpleNotificationProvider');
  }
  return context;
};

export default SimpleNotificationProvider;