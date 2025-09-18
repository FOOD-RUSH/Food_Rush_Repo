// Hook for managing cart reminders
import { useEffect, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { cartReminderService } from '../../services/customer/cartReminderService';
import {
  useCartStore,
  useCartItems,
  useCartReminderEnabled,
  useCartRestaurantName,
  useCartLastActivity,
} from '../../stores/customerStores/cartStore';

export const useCartReminders = () => {
  const cartItems = useCartItems();
  const reminderEnabled = useCartReminderEnabled();
  const restaurantName = useCartRestaurantName();
  const lastActivity = useCartLastActivity();
  const {
    scheduleCartReminders,
    cancelCartReminders,
    enableReminders,
    disableReminders,
  } = useCartStore();

  // Initialize cart reminder service
  useEffect(() => {
    const initializeService = async () => {
      try {
        await cartReminderService.initialize();
        console.log('Cart reminder service initialized');
      } catch (error) {
        console.error('Failed to initialize cart reminder service:', error);
      }
    };

    initializeService();
  }, []);

  // Handle app state changes
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      cartReminderService.handleAppStateChange(nextAppState);

      // If app becomes active and we have items, reschedule reminders
      if (
        nextAppState === 'active' &&
        cartItems.length > 0 &&
        reminderEnabled
      ) {
        scheduleCartReminders();
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => subscription?.remove();
  }, [cartItems.length, reminderEnabled, scheduleCartReminders]);

  // Schedule reminders when cart changes
  useEffect(() => {
    if (reminderEnabled) {
      if (cartItems.length > 0) {
        scheduleCartReminders();
      } else {
        cancelCartReminders();
      }
    }
  }, [
    cartItems.length,
    reminderEnabled,
    scheduleCartReminders,
    cancelCartReminders,
  ]);

  // Utility functions
  const toggleReminders = useCallback(() => {
    if (reminderEnabled) {
      disableReminders();
    } else {
      enableReminders();
    }
  }, [reminderEnabled, enableReminders, disableReminders]);

  const getActiveReminders = useCallback(() => {
    return cartReminderService.getActiveReminders();
  }, []);

  const getReminderConfig = useCallback(() => {
    return cartReminderService.getConfig();
  }, []);

  const updateReminderConfig = useCallback(
    (
      config: Partial<{
        firstReminderMinutes: number;
        secondReminderMinutes: number;
        maxReminders: number;
      }>,
    ) => {
      cartReminderService.updateConfig(config);
    },
    [],
  );

  return {
    // State
    reminderEnabled,
    cartItemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    restaurantName,
    lastActivity,

    // Actions
    enableReminders,
    disableReminders,
    toggleReminders,
    scheduleCartReminders,
    cancelCartReminders,

    // Utilities
    getActiveReminders,
    getReminderConfig,
    updateReminderConfig,
  };
};

export default useCartReminders;
