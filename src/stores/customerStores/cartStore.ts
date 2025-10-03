import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { MenuProps } from '../../types';

export interface CartItem {
  id: string;
  menuItem: MenuProps;
  quantity: number;
  specialInstructions?: string;
  addedAt: number;
}

interface CartState {
  items: CartItem[];
  restaurantID: string | null;
  restaurantName: string | null;
  deliveryPrice: number | null;
  lastActivity: number;
  error: string | null;
  reminderEnabled: boolean;
}

interface CartActions {
  addtoCart: (
    item: MenuProps,
    quantity: number,
    specialInstructions?: string,
  ) => void;
  modifyCart: (itemId: string, quantity: number) => void;
  deleteCart: (itemId: string) => void;
  deleteCartByFoodId: (foodId: string) => void;
  clearCart: () => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setDeliveryPrice: (price: number | null) => void;
  canAddItem: (item: MenuProps) => boolean;
  isItemInCart: (foodId: string) => boolean;
  getItemQuantityInCart: (foodId: string) => number;
  // Cart reminder actions
  enableReminders: () => void;
  disableReminders: () => void;
  scheduleCartReminders: () => Promise<void>;
  cancelCartReminders: () => Promise<void>;
}

// Helper functions
const generateCartItemId = (foodId: string): string =>
  `${foodId}-${Date.now()}`;

const calculateItemTotal = (item: CartItem): number => {
  return item.quantity * parseFloat(item.menuItem.price || '0');
};

const calculateCartTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
};

const updateActivity = (set: any, get: any) => {
  const now = Date.now();
  set({ lastActivity: now });

  // Schedule cart reminders when activity is updated (lazy load service)
  const state = get();
  if (state.reminderEnabled && state.items.length > 0) {
    // Use setTimeout to avoid blocking the UI
    setTimeout(async () => {
      try {
        const { cartReminderService } = await import(
          '../../services/customer/cartReminderService'
        );
        await cartReminderService.scheduleCartReminders(
          state.items.reduce(
            (sum: number, item: CartItem) => sum + item.quantity,
            0,
          ),
          state.restaurantName || undefined,
          now,
        );
      } catch (error) {
        console.error('Failed to schedule cart reminders:', error);
      }
    }, 100);
  }
};

const clearCartState = (set: any) => {
  set({
    items: [],
    restaurantID: null,
    restaurantName: null,
    deliveryPrice: null,
    lastActivity: Date.now(),
  });

  // Cancel cart reminders when cart is cleared (lazy load service)
  setTimeout(async () => {
    try {
      const { cartReminderService } = await import(
        '../../services/customer/cartReminderService'
      );
      await cartReminderService.cancelAllCartReminders();
    } catch (error) {
      console.error('Failed to cancel cart reminders:', error);
    }
  }, 0);
};

export const useCartStore = create<CartState & CartActions>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        items: [],
        restaurantID: null,
        restaurantName: null,
        deliveryPrice: null,
        lastActivity: Date.now(),
        error: null,
        reminderEnabled: true, // Enable reminders by default

        canAddItem: (item) => {
          const { restaurantID, items } = get();
          if (items.length === 0) return true;
          // Check if the item has a restaurantId field (for menu items)
          const itemRestaurantId =
            item.restaurantId || (item as any).restaurant?.id;
          if (!itemRestaurantId) {
            console.warn('Menu item missing restaurantId:', item);
            return false;
          }
          return itemRestaurantId === restaurantID;
        },

        addtoCart: (item, quantity, specialInstructions = '') => {
          try {
            const { items } = get();

            if (!get().canAddItem(item)) {
              Alert.alert(
                'Different Restaurant',
                'Your cart contains items from another restaurant. You can only order from one restaurant at a time.\n\nWould you like to clear your cart and add this item?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Clear Cart & Add',
                    onPress: () => {
                      clearCartState(set);
                      setTimeout(
                        () =>
                          get().addtoCart(item, quantity, specialInstructions),
                        100,
                      );
                    },
                  },
                ],
              );
              return;
            }

            const existingItemIndex = items.findIndex(
              (cartItem) => cartItem.menuItem.id === item.id,
            );

            let newItems: CartItem[];

            if (existingItemIndex >= 0) {
              // Item already exists in cart - show options to user
              const existingItem = items[existingItemIndex];
              const currentQuantity = existingItem.quantity;
              const newTotalQuantity = currentQuantity + quantity;

              Alert.alert(
                'Item Already in Cart',
                `"${item.name}" is already in your cart (${currentQuantity} item${currentQuantity > 1 ? 's' : ''}).\n\nWould you like to add ${quantity} more item${quantity > 1 ? 's' : ''} (total: ${newTotalQuantity}) or keep the current quantity?`,
                [
                  {
                    text: 'Keep Current',
                    style: 'cancel',
                    onPress: () => {
                      // Do nothing - keep current quantity
                      Alert.alert('No Changes', 'Cart remains unchanged', [
                        { text: 'OK' },
                      ]);
                    },
                  },
                  {
                    text: `Add ${quantity} More`,
                    onPress: () => {
                      // Add to existing quantity
                      const updatedItems = items.map((cartItem, index) =>
                        index === existingItemIndex
                          ? {
                              ...cartItem,
                              quantity: cartItem.quantity + quantity,
                              specialInstructions:
                                specialInstructions ||
                                cartItem.specialInstructions,
                            }
                          : cartItem,
                      );
                      set({ items: updatedItems });
                      updateActivity(set, get);
                      Alert.alert(
                        'Updated Successfully',
                        `Added ${quantity} more "${item.name}" to your cart. Total quantity: ${newTotalQuantity}`,
                        [{ text: 'OK' }],
                      );
                    },
                  },
                  {
                    text: `Replace with ${quantity}`,
                    onPress: () => {
                      // Replace with new quantity
                      const updatedItems = items.map((cartItem, index) =>
                        index === existingItemIndex
                          ? {
                              ...cartItem,
                              quantity: quantity,
                              specialInstructions:
                                specialInstructions ||
                                cartItem.specialInstructions,
                            }
                          : cartItem,
                      );
                      set({ items: updatedItems });
                      updateActivity(set, get);
                      Alert.alert(
                        'Updated Successfully',
                        `Updated "${item.name}" quantity to ${quantity} in your cart`,
                        [{ text: 'OK' }],
                      );
                    },
                  },
                ],
                { cancelable: true },
              );
              return; // Exit early since we're handling this with user choice
            } else {
              // Add new item
              const newItem: CartItem = {
                id: generateCartItemId(item.id),
                menuItem: item,
                quantity,
                specialInstructions,
                addedAt: Date.now(),
              };
              newItems = [...items, newItem];

              // Set restaurant ID and name if first item
              if (items.length === 0) {
                const itemRestaurantId =
                  item.restaurantId || (item as any).restaurant?.id;
                const restaurantName =
                  (item as any).restaurant?.name || 'Unknown Restaurant';
                const deliveryPrice = (item as any).restaurant?.deliveryPrice || null;
                console.log('Setting cart restaurant info:', {
                  restaurantId: itemRestaurantId,
                  restaurantName,
                  deliveryPrice,
                  menuItem: item,
                });
                set({
                  restaurantID: itemRestaurantId || null,
                  restaurantName: restaurantName,
                  deliveryPrice: deliveryPrice,
                });
              }

              set({ items: newItems });
              updateActivity(set, get);
              Alert.alert('Success', 'Successfully added item to cart', [
                { text: 'OK' },
              ]);
            }
          } catch (error: any) {
            set({ error: error.message || 'Failed to add item to cart' });
          }
        },

        modifyCart: (itemId, quantity) => {
          try {
            if (quantity <= 0) {
              get().deleteCart(itemId);
              return;
            }

            const { items } = get();
            const newItems = items.map((item) =>
              item.id === itemId ? { ...item, quantity } : item,
            );

            set({ items: newItems });
            updateActivity(set, get);
          } catch (error: any) {
            set({ error: error.message || 'Failed to modify cart item' });
          }
        },

        deleteCart: (itemId) => {
          try {
            const { items } = get();
            const filteredItems = items.filter((item) => item.id !== itemId);

            if (filteredItems.length === 0) {
              clearCartState(set);
            } else {
              set({ items: filteredItems });
              updateActivity(set, get);
            }
          } catch (error: any) {
            set({ error: error.message || 'Failed to delete item from cart' });
          }
        },

        deleteCartByFoodId: (foodId) => {
          try {
            const { items } = get();
            const filteredItems = items.filter(
              (item) => item.menuItem.id !== foodId,
            );

            if (filteredItems.length === 0) {
              clearCartState(set);
            } else {
              set({ items: filteredItems });
              updateActivity(set, get);
            }
          } catch (error: any) {
            set({ error: error.message || 'Failed to delete item from cart' });
          }
        },

        clearCart: () => {
          clearCartState(set);
        },

        setError: (error) => {
          set({ error });
        },

        setDeliveryPrice: (price) => {
          set({ deliveryPrice: price });
        },

        clearError: () => {
          set({ error: null });
        },

        isItemInCart: (foodId) => {
          const { items } = get();
          return items.some((item) => item.menuItem.id === foodId);
        },

        getItemQuantityInCart: (foodId) => {
          const { items } = get();
          const item = items.find((item) => item.menuItem.id === foodId);
          return item ? item.quantity : 0;
        },

        // Cart reminder actions
        enableReminders: () => {
          set({ reminderEnabled: true });
          // Schedule reminders for current cart if it has items
          const state = get();
          if (state.items.length > 0) {
            setTimeout(async () => {
              try {
                const { cartReminderService } = await import(
                  '../../services/customer/cartReminderService'
                );
                await cartReminderService.scheduleCartReminders(
                  state.items.reduce((sum, item) => sum + item.quantity, 0),
                  state.restaurantName || undefined,
                  state.lastActivity,
                );
              } catch (error) {
                console.error('Failed to schedule cart reminders:', error);
              }
            }, 100);
          }
        },

        disableReminders: () => {
          set({ reminderEnabled: false });
          // Cancel all existing reminders
          setTimeout(async () => {
            try {
              const { cartReminderService } = await import(
                '../../services/customer/cartReminderService'
              );
              await cartReminderService.cancelAllCartReminders();
            } catch (error) {
              console.error('Failed to cancel cart reminders:', error);
            }
          }, 0);
        },

        scheduleCartReminders: async () => {
          const state = get();
          if (state.reminderEnabled && state.items.length > 0) {
            try {
              const { cartReminderService } = await import(
                '../../services/customer/cartReminderService'
              );
              await cartReminderService.scheduleCartReminders(
                state.items.reduce((sum, item) => sum + item.quantity, 0),
                state.restaurantName || undefined,
                state.lastActivity,
              );
            } catch (error) {
              console.error('Failed to schedule cart reminders:', error);
              set({ error: 'Failed to schedule cart reminders' });
            }
          }
        },

        cancelCartReminders: async () => {
          try {
            const { cartReminderService } = await import(
              '@/src/services/customer/cartReminderService'
            );
            await cartReminderService.cancelAllCartReminders();
          } catch (error) {
            console.error('Failed to cancel cart reminders:', error);
            set({ error: 'Failed to cancel cart reminders' });
          }
        },
      }),
      {
        name: 'cart-store',
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({
          items: state.items,
          restaurantID: state.restaurantID,
          restaurantName: state.restaurantName,
          deliveryPrice: state.deliveryPrice,
          lastActivity: state.lastActivity,
          reminderEnabled: state.reminderEnabled,
        }),
      },
    ),
  ),
);

// Selector hooks for better performance
export const useCartItems = () => useCartStore((state) => state.items);
export const useCartTotal = () =>
  useCartStore((state) => calculateCartTotal(state.items));
export const useCartRestaurantID = () =>
  useCartStore((state) => state.restaurantID);
export const useCartError = () => useCartStore((state) => state.error);
export const useCanAddToCart = () => useCartStore((state) => state.canAddItem);

// Computed selectors
export const useCartItemCount = () =>
  useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );

export const useCartIsEmpty = () =>
  useCartStore((state) => state.items.length === 0);

export const useCartItemById = (itemId: string) =>
  useCartStore((state) => state.items.find((item) => item.id === itemId));

export const useCartItemByFoodId = (foodId: string) =>
  useCartStore((state) =>
    state.items.find((item) => item.menuItem.id === foodId),
  );

export const useIsItemInCart = (foodId: string) =>
  useCartStore((state) => state.isItemInCart(foodId));

export const useItemQuantityInCart = (foodId: string) =>
  useCartStore((state) => state.getItemQuantityInCart(foodId));

// Cart reminder selectors
export const useCartReminderEnabled = () =>
  useCartStore((state) => state.reminderEnabled);

export const useCartRestaurantName = () =>
  useCartStore((state) => state.restaurantName);

export const useCartLastActivity = () =>
  useCartStore((state) => state.lastActivity);

export const useCartDeliveryPrice = () =>
  useCartStore((state) => state.deliveryPrice);

export const useSetCartDeliveryPrice = () =>
  useCartStore((state) => state.setDeliveryPrice);
