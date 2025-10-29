import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { MenuProps } from '../../types';
import { calculateServiceFee } from '@/src/utils/ServiceFee';

export interface CartItem {
  id: string;
  menuItem: MenuProps;
  quantity: number;
  specialInstructions?: string;
  addedAt: number;
  deliveryFee?: number; // Store delivery fee from when item was added
}

interface CartState {
  items: CartItem[];
  restaurantID: string | null;
  restaurantName: string | null;
  lastActivity: number;
  error: string | null;
  reminderEnabled: boolean;
}

interface CartActions {
  addItemtoCart: (
    item: MenuProps,
    quantity: number,
    specialInstructions?: string,
    onSuccess?: () => void,
  ) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  removeItemByFoodId: (foodId: string) => void;
  clearCart: () => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  canAddItem: (item: MenuProps) => boolean;
  isItemInCart: (foodId: string) => boolean;
  getItemQuantityInCart: (foodId: string) => number;
  // Cart calculations
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getServiceFee: () => number;
  getTotal: () => number;
}

// Helper functions
const generateCartItemId = (foodId: string): string =>
  `${foodId}-${Date.now()}`;

const calculateItemTotal = (item: CartItem): number => {
  return item.quantity * parseFloat(item.menuItem.price || '0');
};

const updateActivity = (set: any, get: any) => {
  const now = Date.now();
  set({ lastActivity: now });
  // Reminder logic moved to components using effects
};

const clearCartState = (set: any) => {
  set({
    items: [],
    restaurantID: null,
    restaurantName: null,
    lastActivity: Date.now(),
  });
  // Reminder logic moved to components using effects
};

export const useCartStore = create<CartState & CartActions>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        items: [],
        restaurantID: null,
        restaurantName: null,
        lastActivity: Date.now(),
        error: null,
        reminderEnabled: true,

        canAddItem: (item) => {
          const { restaurantID, items } = get();
          if (items.length === 0) return true;

          const itemRestaurantId =
            item.restaurantId || (item as any).restaurant?.id;
          if (!itemRestaurantId) {
            return false;
          }
          return itemRestaurantId === restaurantID;
        },

        addItemtoCart: (
          item,
          quantity,
          specialInstructions = '',
          onSuccess,
        ) => {
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
                          get().addItemtoCart(
                            item,
                            quantity,
                            specialInstructions,
                            onSuccess,
                          ),
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

            if (existingItemIndex >= 0) {
              // Item already exists - show options
              const existingItem = items[existingItemIndex];
              const currentQuantity = existingItem.quantity;
              const newTotalQuantity = currentQuantity + quantity;

              Alert.alert(
                'Item Already in Cart',
                `"${item.name}" is already in your cart (${currentQuantity} item${currentQuantity > 1 ? 's' : ''}).\n\nWould you like to add ${quantity} more item${quantity > 1 ? 's' : ''} (total: ${newTotalQuantity}) or replace the current quantity?`,
                [
                  {
                    text: 'Keep Current',
                    style: 'cancel',
                  },
                  {
                    text: `Add ${quantity} More`,
                    onPress: () => {
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
                      if (onSuccess) {
                        onSuccess();
                      }
                    },
                  },
                  {
                    text: `Replace with ${quantity}`,
                    onPress: () => {
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
                      if (onSuccess) {
                        onSuccess();
                      }
                    },
                  },
                ],
                { cancelable: true },
              );
              return;
            }

            // Add new item
            const deliveryFee =
              (item as any).restaurant?.deliveryPrice ||
              (item as any).deliveryPrice ||
              0;

            const newItem: CartItem = {
              id: generateCartItemId(item.id),
              menuItem: item,
              quantity,
              specialInstructions,
              addedAt: Date.now(),
              deliveryFee, // Store delivery fee from food details
            };

            const newItems = [...items, newItem];

            // Set restaurant info if first item
            if (items.length === 0) {
              const itemRestaurantId =
                item.restaurantId || (item as any).restaurant?.id;
              const restaurantName =
                (item as any).restaurant?.name || 'Unknown Restaurant';

              set({
                restaurantID: itemRestaurantId || null,
                restaurantName: restaurantName,
              });
            }

            set({ items: newItems });
            updateActivity(set, get);

            Alert.alert('Success', 'Successfully added item to cart', [
              {
                text: 'OK',
                onPress: () => {
                  if (onSuccess) {
                    onSuccess();
                  }
                },
              },
            ]);
          } catch (error: any) {
            set({ error: error.message || 'Failed to add item to cart' });
          }
        },

        updateItemQuantity: (itemId, quantity) => {
          try {
            if (quantity <= 0) {
              get().removeItem(itemId);
              return;
            }

            const { items } = get();
            const newItems = items.map((item) =>
              item.id === itemId ? { ...item, quantity } : item,
            );

            set({ items: newItems });
            updateActivity(set, get);
          } catch (error: any) {
            set({ error: error.message || 'Failed to update cart item' });
          }
        },

        removeItem: (itemId) => {
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
            set({ error: error.message || 'Failed to remove item from cart' });
          }
        },

        removeItemByFoodId: (foodId) => {
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
            set({ error: error.message || 'Failed to remove item from cart' });
          }
        },

        clearCart: () => {
          clearCartState(set);
        },

        setError: (error) => {
          set({ error });
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

        // Cart calculations
        getSubtotal: () => {
          const { items } = get();
          return items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
        },

        getDeliveryFee: () => {
          const { items } = get();
          if (items.length === 0) return 0;

          // Use the delivery fee from the first item (all items should be from same restaurant)
          // This is the fee that was captured when the item was added to cart
          return items[0].deliveryFee || 0;
        },

        getServiceFee: () => {
          const subtotal = get().getSubtotal();
          return calculateServiceFee(subtotal);
        },

        getTotal: () => {
          const subtotal = get().getSubtotal();
          const deliveryFee = get().getDeliveryFee();
          const serviceFee = get().getServiceFee();
          return subtotal + deliveryFee + serviceFee;
        },
      }),
      {
        name: 'cart-store',
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({
          items: state.items,
          restaurantID: state.restaurantID,
          restaurantName: state.restaurantName,
          lastActivity: state.lastActivity,
          reminderEnabled: state.reminderEnabled,
        }),
      },
    ),
  ),
);
// Selector hooks for better performance
export const useCartItems = () => useCartStore((state) => state.items);
export const useCartSubtotal = () =>
  useCartStore((state) => state.getSubtotal());
export const useCartDeliveryFee = () =>
  useCartStore((state) => state.getDeliveryFee());
export const useCartServiceFee = () =>
  useCartStore((state) => state.getServiceFee());
export const useCartTotal = () => useCartStore((state) => state.getTotal());
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

// Legacy compatibility - keep old function names
export const addItemtoCart = (
  item: MenuProps,
  quantity: number,
  specialInstructions?: string,
  onSuccess?: () => void,
) =>
  useCartStore
    .getState()
    .addItemtoCart(item, quantity, specialInstructions, onSuccess);

export const modifyCart = (itemId: string, quantity: number) =>
  useCartStore.getState().updateItemQuantity(itemId, quantity);

export const deleteCart = (itemId: string) =>
  useCartStore.getState().removeItem(itemId);

export const deleteCartByFoodId = (foodId: string) =>
  useCartStore.getState().removeItemByFoodId(foodId);
