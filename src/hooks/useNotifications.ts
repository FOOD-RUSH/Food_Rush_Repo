import { useEffect, useCallback, useRef } from 'react';
import { useAuthStore } from '@/src/stores/customerStores/AuthStore';
import { 
  initializeNotificationsForUser,
  sendOrderStatusNotification,
  sendNewOrderNotification,
  scheduleCartReminder,
  sendPromotionNotification,
  sendGeneralNotification,
  cancelCartReminders,
} from '@/src/services/notifications/NotificationHelpers';

export const useNotifications = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userType = useAuthStore((state) => state.userType);
  const initializationRef = useRef<string | null>(null);

  // Initialize notifications when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user?.id && userType) {
      const currentKey = `${user.id}-${userType}`;
      
      // Prevent re-initialization for the same user
      if (initializationRef.current === currentKey) {
        return;
      }
      
      initializationRef.current = currentKey;
      
      initializeNotificationsForUser(user.id, userType)
        .then((success) => {
          if (success) {
            console.log(`Notifications initialized for ${userType}: ${user.id}`);
          } else {
            console.warn('Failed to initialize notifications');
          }
        })
        .catch((error) => {
          console.error('Error initializing notifications:', error);
          initializationRef.current = null; // Reset on error
        });
    } else {
      initializationRef.current = null;
    }
  }, [isAuthenticated, user?.id, userType]);

  // Customer-specific notification functions
  const sendOrderStatus = useCallback(
    async (orderId: string, status: 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled', restaurantName?: string) => {
      if (userType === 'customer') {
        await sendOrderStatusNotification(orderId, status, restaurantName);
      }
    },
    [userType]
  );

  const scheduleCartReminderNotification = useCallback(
    async (itemCount: number, restaurantName?: string, minutesFromNow?: number) => {
      if (userType === 'customer') {
        return await scheduleCartReminder(itemCount, restaurantName, minutesFromNow);
      }
      return null;
    },
    [userType]
  );

  // Restaurant-specific notification functions
  const sendNewOrder = useCallback(
    async (orderId: string, customerName?: string) => {
      if (userType === 'restaurant') {
        await sendNewOrderNotification(orderId, customerName);
      }
    },
    [userType]
  );

  // Common notification functions
  const sendPromotion = useCallback(
    async (title: string, message: string, promotionId?: string) => {
      await sendPromotionNotification(title, message, promotionId);
    },
    []
  );

  const sendGeneral = useCallback(
    async (title: string, message: string, data?: Record<string, any>) => {
      await sendGeneralNotification(title, message, data);
    },
    []
  );

  const cancelCartReminderNotifications = useCallback(async () => {
    await cancelCartReminders();
  }, []);

  return {
    // Customer functions
    sendOrderStatus,
    scheduleCartReminderNotification,
    cancelCartReminderNotifications,
    
    // Restaurant functions
    sendNewOrder,
    
    // Common functions
    sendPromotion,
    sendGeneral,
    
    // State
    isAuthenticated,
    userType,
  };
};