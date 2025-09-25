import React, {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useEffect,
} from 'react';
import { useNotifications } from '@/src/hooks/useNotifications';
import { initializeNotifications } from '@/src/notifications';
import { useAuthStore } from '@/src/stores/AuthStore';

interface NotificationContextType {
  // Customer functions
  sendOrderStatus: (
    orderId: string,
    status: 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled',
    restaurantName?: string,
  ) => Promise<void>;
  scheduleCartReminder: (
    itemCount: number,
    restaurantName?: string,
    minutesFromNow?: number,
  ) => Promise<string | null>;
  cancelCartReminders: () => Promise<void>;

  // Restaurant functions
  sendNewOrder: (orderId: string, customerName?: string) => Promise<void>;

  // Common functions
  sendPromotion: (
    title: string,
    message: string,
    promotionId?: string,
  ) => Promise<void>;
  sendGeneral: (
    title: string,
    message: string,
    data?: Record<string, any>,
  ) => Promise<void>;

  // State
  isAuthenticated: boolean;
  userType: 'customer' | 'restaurant' | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

interface NotificationProviderProps {
  children: ReactNode;
}

export const SimpleNotificationProvider: React.FC<
  NotificationProviderProps
> = ({ children }) => {
  const notifications = useNotifications();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userType = user?.role;

  // Initialize notifications when user is authenticated
  useEffect(() => {
    if (isAuthenticated && userType && user?.id) {
      initializeNotifications(userType, user.id)
        .then((success) => {
          if (success) {
            console.log('✅ Notification service initialized successfully');
          } else {
            console.warn('⚠️ Failed to initialize notification service');
          }
        })
        .catch((error) => {
          console.error('❌ Error initializing notification service:', error);
        });
    }
  }, [isAuthenticated, userType, user?.id]);

  const contextValue: NotificationContextType = useMemo(
    () => ({
      sendOrderStatus: async (
        orderId: string,
        status: 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled',
        restaurantName?: string,
      ) => {
        await notifications.sendOrderNotification(orderId, status, {
          restaurantName,
        });
      },
      scheduleCartReminder: async (
        itemCount: number,
        restaurantName?: string,
        minutesFromNow: number = 25,
      ) => {
        return await notifications.scheduleReminder(
          "🛒 Don't Forget Your Cart!",
          `You have ${itemCount} item${itemCount === 1 ? '' : 's'}${restaurantName ? ` from ${restaurantName}` : ''} waiting for you. Complete your order now!`,
          minutesFromNow,
          { type: 'cart_reminder', itemCount, restaurantName },
        );
      },
      cancelCartReminders: async () => {
        // This would need to be implemented in the notification service
        console.log('Cancel cart reminders not implemented yet');
      },
      sendNewOrder: async (orderId: string, customerName?: string) => {
        await notifications.sendOrderNotification(orderId, 'pending', {
          customerName,
        });
      },
      sendPromotion: async (
        title: string,
        message: string,
        promotionId?: string,
      ) => {
        await notifications.sendPromotionNotification(title, message, {
          promotionId,
        });
      },
      sendGeneral: async (
        title: string,
        message: string,
        data?: Record<string, any>,
      ) => {
        await notifications.sendLocalNotification(title, message, data);
      },
      isAuthenticated,
      userType,
    }),
    [
      notifications.sendOrderNotification,
      notifications.scheduleReminder,
      notifications.sendPromotionNotification,
      notifications.sendLocalNotification,
      isAuthenticated,
      userType,
    ],
  );

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
      'useNotificationContext must be used within a SimpleNotificationProvider',
    );
  }
  return context;
};

export default SimpleNotificationProvider;
