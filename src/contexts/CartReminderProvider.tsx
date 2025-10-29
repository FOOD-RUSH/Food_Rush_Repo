// Cart Reminder Provider - Initializes and manages cart reminder service
import React, { createContext, useContext, useEffect, memo } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { cartReminderService } from '../services/customer/cartReminderService';
import { useCartStore } from '../stores/customerStores/cartStore';

interface CartReminderContextType {
  isInitialized: boolean;
}

const CartReminderContext = createContext<CartReminderContextType>({
  isInitialized: false,
});

export const useCartReminderContext = () => {
  const context = useContext(CartReminderContext);
  if (!context) {
    throw new Error(
      'useCartReminderContext must be used within CartReminderProvider',
    );
  }
  return context;
};

interface CartReminderProviderProps {
  children: React.ReactNode;
}

export const CartReminderProvider: React.FC<CartReminderProviderProps> = memo(
  ({ children }) => {
    const [isInitialized, setIsInitialized] = React.useState(false);

    // Direct reminder function using the service
    const scheduleCartReminders = React.useCallback(async () => {
      const state = useCartStore.getState();
      if (state.reminderEnabled && state.items.length > 0) {
        try {
          const itemCount = state.items.reduce(
            (sum, item) => sum + item.quantity,
            0,
          );
          await cartReminderService.scheduleCartReminders(
            itemCount,
            state.restaurantName || undefined,
            state.lastActivity,
          );
        } catch (error) {
          console.error('Failed to schedule cart reminders:', error);
        }
      }
    }, []);

    // Initialize cart reminder service
    useEffect(() => {
      const initializeService = async () => {
        try {
          await cartReminderService.initialize();
          setIsInitialized(true);
        } catch (error) {
          console.error('Failed to initialize cart reminder service:', error);
          // Don't block the app if reminder service fails
          setIsInitialized(true);
        }
      };

      initializeService();
    }, []);

    // Handle app state changes
    useEffect(() => {
      const handleAppStateChange = (nextAppState: AppStateStatus) => {
        if (isInitialized) {
          cartReminderService.handleAppStateChange(nextAppState);

          // If app becomes active, reschedule reminders for current cart
          if (nextAppState === 'active') {
            const state = useCartStore.getState();
            if (state.items.length > 0 && state.reminderEnabled) {
              scheduleCartReminders();
            }
          }
        }
      };

      const subscription = AppState.addEventListener(
        'change',
        handleAppStateChange,
      );
      return () => subscription?.remove();
    }, [isInitialized, scheduleCartReminders]);

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        if (isInitialized) {
          cartReminderService.cancelAllCartReminders().catch((error) => {
            console.error(
              'Failed to cleanup cart reminders on unmount:',
              error,
            );
          });
        }
      };
    }, [isInitialized]);

    const contextValue = React.useMemo(
      () => ({
        isInitialized,
      }),
      [isInitialized],
    );

    return (
      <CartReminderContext.Provider value={contextValue}>
        {children}
      </CartReminderContext.Provider>
    );
  },
);

CartReminderProvider.displayName = 'CartReminderProvider';

export default CartReminderProvider;
