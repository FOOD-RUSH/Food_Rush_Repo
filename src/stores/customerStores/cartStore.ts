// ============================================
// FIXED cartStore.ts - Complete Implementation
// ============================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { MenuProps } from '../../types';
import { calculateServiceFee } from '@/src/utils/ServiceFee';
import { eventBus } from '@/src/services/shared/eventBus';

export interface CartItem {
  id: string;
  menuItem: MenuProps;
  quantity: number;
  specialInstructions?: string;
  addedAt: number;
  deliveryFee?: number;
}

interface CartState {
  items: CartItem[];
  restaurantID: string | null;
  restaurantName: string | null;
  lastActivity: number;
  error: string | null;
}

interface CartActions {
  addItemtoCart: (
    item: MenuProps,
    quantity: number,
    specialInstructions?: string,
    onSuccess?: () => void,
    onError?: (error: string) => void, // ADDED: Error callback
  ) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  updateItem: (itemId: string, updates: Partial<Pick<CartItem, 'quantity' | 'specialInstructions'>>) => void; // ADDED: Better update method
  removeItem: (itemId: string) => void;
  removeItemByFoodId: (foodId: string) => void;
  clearCart: () => void;
  clearCartAndSwitchRestaurant: (newItem: MenuProps, quantity: number, specialInstructions?: string) => void; // ADDED: Handle restaurant switch
  setError: (error: string | null) => void;
  clearError: () => void;
  canAddItem: (item: MenuProps) => boolean;
  isItemInCart: (foodId: string) => boolean;
  getItemQuantityInCart: (foodId: string) => number;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getServiceFee: () => number;
  getTotal: () => number;
}

// IMPROVED: Helper function for consistent restaurant ID extraction
const getRestaurantId = (item: MenuProps): string | null => {
  return item.restaurantId || (item as any).restaurant?.id || null;
};

const getRestaurantName = (item: MenuProps): string => {
  return (item as any).restaurant?.name || 'Unknown Restaurant';
};

// Helper functions
const generateCartItemId = (foodId: string): string =>
  `${foodId}-${Date.now()}`;

const calculateItemTotal = (item: CartItem): number => {
  return item.quantity * parseFloat(item.menuItem.price || '0');
};

export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set, get) => {
      // Listen to logout event and clear cart
      eventBus.on('user-logout', () => {
        set({
          items: [],
          restaurantID: null,
          restaurantName: null,
          lastActivity: Date.now(),
          error: null,
        });
      });

      return {
        // Initial state
        items: [],
        restaurantID: null,
        restaurantName: null,
        lastActivity: Date.now(),
        error: null,

        canAddItem: (item) => {
          const { restaurantID, items } = get();
          if (items.length === 0) return true;

          const itemRestaurantId = getRestaurantId(item);
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
          onError, // ADDED: Error callback
        ) => {
          try {
            const { items } = get();

            // IMPROVED: Check if item is from same restaurant
            if (!get().canAddItem(item)) {
              const errorMsg = 'Cannot add items from different restaurants. Please clear your cart first.';
              set({ error: errorMsg });
              onError?.(errorMsg); // FIXED: Call error callback
              return;
            }

            // FIXED: Check for existing item WITH SAME INSTRUCTIONS
            const existingItemIndex = items.findIndex(
              (cartItem) =>
                cartItem.menuItem.id === item.id &&
                (cartItem.specialInstructions || '') === (specialInstructions || ''),
            );

            if (existingItemIndex >= 0) {
              // Update existing item quantity
              const updatedItems = items.map((cartItem, index) =>
                index === existingItemIndex
                  ? {
                      ...cartItem,
                      quantity: cartItem.quantity + quantity,
                    }
                  : cartItem,
              );
              set({ items: updatedItems, lastActivity: Date.now() });
            } else {
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
                deliveryFee,
              };

              const newItems = [...items, newItem];

              // Set restaurant info if first item
              if (items.length === 0) {
                const itemRestaurantId = getRestaurantId(item);
                const restaurantName = getRestaurantName(item);

                set({
                  restaurantID: itemRestaurantId || null,
                  restaurantName: restaurantName,
                });
              }

              set({ items: newItems, lastActivity: Date.now() });
            }

            // FIXED: Call success callback
            if (onSuccess) {
              onSuccess();
            }
          } catch (error: any) {
            const errorMsg = error.message || 'Failed to add item to cart';
            set({ error: errorMsg });
            onError?.(errorMsg); // FIXED: Call error callback
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

            set({ items: newItems, lastActivity: Date.now() });
          } catch (error: any) {
            set({ error: error.message || 'Failed to update cart item' });
          }
        },

        // ADDED: New method to update item without removing
        updateItem: (itemId, updates) => {
          try {
            const { items } = get();
            const newItems = items.map((item) =>
              item.id === itemId ? { ...item, ...updates } : item,
            );

            set({ items: newItems, lastActivity: Date.now() });
          } catch (error: any) {
            set({ error: error.message || 'Failed to update cart item' });
          }
        },

        removeItem: (itemId) => {
          try {
            const { items } = get();
            const filteredItems = items.filter((item) => item.id !== itemId);

            if (filteredItems.length === 0) {
              set({
                items: [],
                restaurantID: null,
                restaurantName: null,
                lastActivity: Date.now(),
              });
            } else {
              set({ items: filteredItems, lastActivity: Date.now() });
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
              set({
                items: [],
                restaurantID: null,
                restaurantName: null,
                lastActivity: Date.now(),
              });
            } else {
              set({ items: filteredItems, lastActivity: Date.now() });
            }
          } catch (error: any) {
            set({ error: error.message || 'Failed to remove item from cart' });
          }
        },

        clearCart: () => {
          set({
            items: [],
            restaurantID: null,
            restaurantName: null,
            lastActivity: Date.now(),
          });
        },

        // ADDED: Clear cart and add item from new restaurant
        clearCartAndSwitchRestaurant: (newItem, quantity, specialInstructions = '') => {
          try {
            // Clear current cart
            set({
              items: [],
              restaurantID: null,
              restaurantName: null,
              error: null,
            });

            // Add new item
            get().addItemtoCart(newItem, quantity, specialInstructions);
          } catch (error: any) {
            set({ error: error.message || 'Failed to switch restaurant' });
          }
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
          // IMPROVED: Sum ALL items with this foodId (different instructions)
          return items
            .filter((item) => item.menuItem.id === foodId)
            .reduce((sum, item) => sum + item.quantity, 0);
        },

        // Cart calculations
        getSubtotal: () => {
          const { items } = get();
          return items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
        },

        getDeliveryFee: () => {
          const { items } = get();
          if (items.length === 0) return 0;
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
      };
    },
    {
      name: 'cart-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        items: state.items,
        restaurantID: state.restaurantID,
        restaurantName: state.restaurantName,
        lastActivity: state.lastActivity,
      }),
    },
  ),
);

// Selector hooks for better performance
export const useCartItems = () => useCartStore((state) => state.items);
export const useCartSubtotal = () => useCartStore((state) => state.getSubtotal());
export const useCartDeliveryFee = () => useCartStore((state) => state.getDeliveryFee());
export const useCartServiceFee = () => useCartStore((state) => state.getServiceFee());
export const useCartTotal = () => useCartStore((state) => state.getTotal());
export const useCartRestaurantID = () => useCartStore((state) => state.restaurantID);
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

export const useCartRestaurantName = () =>
  useCartStore((state) => state.restaurantName);

export const useCartLastActivity = () =>
  useCartStore((state) => state.lastActivity);
