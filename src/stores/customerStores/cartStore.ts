import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { FoodProps } from '../../types';

export interface CartItem {
  id: string;
  menuItem: FoodProps;
  ItemtotalPrice: number;
  quantity: number;
  specialInstructions?: string;
}

interface CartState {
  CartID: string | null;
  items: CartItem[];
  totalprice: number;
  restaurantID: string | null;
  isLoading: boolean;
  error: string | null;
}

interface CartActions {
  // Add item to cart
  addtoCart: (
    item: FoodProps,
    quantity: number,
    specialInstructions: string,
  ) => void;
  
  // Modify cart item quantity
  modifyCart: (itemId: string, quantity: number) => void;
  
  // Delete cart item
  deleteCart: (itemId: string) => void;
  
  // Calculate total price
  calculateTotal: () => void;
  
  // Clear entire cart
  clearCart: () => void;
  
  // Load cart from storage
  loadCart: () => Promise<void>;
  
  // Save cart to storage
  saveCart: () => Promise<void>;
  
  // Set error
  setError: (error: string | null) => void;
  
  // Clear error
  clearError: () => void;
}

export const useCartStore = create<CartState & CartActions>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        totalprice: 0,
        restaurantID: null,
        CartID: null,
        isLoading: false,
        error: null,

        addtoCart: (item, quantity, specialInstructions) => {
          try {
            const { restaurantID, items } = get();

            // Check if adding from different restaurant
            if (restaurantID && item.restaurant?.id !== restaurantID) {
              Alert.alert(
                'Different Restaurant',
                'You are trying to add food from a different restaurant. Do you want to clear your cart and add this item?',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'Clear & Add',
                    onPress: () => {
                      set({
                        items: [],
                        restaurantID: item.restaurant?.id,
                        CartID: `${Date.now()}-${item.restaurant?.id}`,
                        totalprice: 0,
                      });
                      get().addtoCart(item, quantity, specialInstructions);
                    },
                  },
                ],
              );
              return;
            }

            // Find existing item
            const existingItemIndex = items.findIndex(
              (cartItem) => cartItem.menuItem.id === item.id,
            );

            let newItems: CartItem[];

            if (existingItemIndex >= 0) {
              // Update existing item
              newItems = items.map((cartItem, index) =>
                index === existingItemIndex
                  ? {
                      ...cartItem,
                      quantity: cartItem.quantity + quantity,
                      specialInstructions:
                        specialInstructions || cartItem.specialInstructions,
                      ItemtotalPrice:
                        (cartItem.quantity + quantity) * cartItem.menuItem.price!,
                    }
                  : cartItem,
              );
            } else {
              // Add new item
              const newItem: CartItem = {
                id: `${item.id}-${Date.now()}`,
                menuItem: item,
                quantity: quantity,
                ItemtotalPrice: item.price! * quantity,
                specialInstructions: specialInstructions,
              };
              newItems = [...items, newItem];

              // Set restaurant ID and cart ID if first item
              if (items.length === 0) {
                set({
                  restaurantID: item.restaurant?.id,
                  CartID: `${Date.now()}-${item.restaurant?.id}`,
                });
              }
            }

            set({ items: newItems });

            // Calculate total after setting items
            const totalPrice = newItems.reduce(
              (sum, cartItem) => sum + cartItem.ItemtotalPrice,
              0,
            );
            set({ totalprice: totalPrice });

            Alert.alert('Success', 'Successfully added item to cart', [
              { text: 'OK' },
            ]);
          } catch (error: any) {
            set({ error: error.message || 'Failed to add item to cart' });
          }
        },

        calculateTotal: () => {
          const { items } = get();
          const totalPrice = items.reduce(
            (sum, item) => sum + item.ItemtotalPrice,
            0,
          );
          set({ totalprice: totalPrice });
        },

        deleteCart: (cartItemId) => {
          try {
            const { items } = get();
            const filteredItems = items.filter((item) => item.id !== cartItemId);

            // If no items left, clear everything
            if (filteredItems.length === 0) {
              set({
                items: [],
                restaurantID: null,
                totalprice: 0,
                CartID: null,
              });
              return;
            }

            // Update items and recalculate total
            const totalPrice = filteredItems.reduce(
              (sum, item) => sum + item.ItemtotalPrice,
              0,
            );

            set({
              items: filteredItems,
              totalprice: totalPrice,
            });
          } catch (error: any) {
            set({ error: error.message || 'Failed to delete item from cart' });
          }
        },

        modifyCart: (CartItemId, quantity) => {
          try {
            const { items } = get();

            // Remove item if quantity is 0 or less
            if (quantity <= 0) {
              get().deleteCart(CartItemId);
              return;
            }

            const newItems = items.map((item) =>
              item.id === CartItemId
                ? {
                    ...item,
                    quantity,
                    ItemtotalPrice: quantity * item.menuItem.price!,
                  }
                : item,
            );

            const totalPrice = newItems.reduce(
              (sum, item) => sum + item.ItemtotalPrice,
              0,
            );

            set({
              items: newItems,
              totalprice: totalPrice,
            });
          } catch (error: any) {
            set({ error: error.message || 'Failed to modify cart item' });
          }
        },

        clearCart: () => {
          set({
            items: [],
            restaurantID: null,
            totalprice: 0,
            CartID: null,
          });
        },
        
        loadCart: async () => {
          try {
            set({ isLoading: true, error: null });
            // Cart is automatically loaded by zustand persist middleware
            set({ isLoading: false });
          } catch (error: any) {
            set({ 
              error: error.message || 'Failed to load cart', 
              isLoading: false 
            });
          }
        },
        
        saveCart: async () => {
          try {
            set({ isLoading: true, error: null });
            // Cart is automatically saved by zustand persist middleware
            set({ isLoading: false });
          } catch (error: any) {
            set({ 
              error: error.message || 'Failed to save cart', 
              isLoading: false 
            });
          }
        },
        
        setError: (error) => {
          set({ error });
        },
        
        clearError: () => {
          set({ error: null });
        },
      }),
      {
        name: 'cart-store',
        storage: createJSONStorage(() => AsyncStorage),
        // Only persist essential data
        partialize: (state) => ({
          items: state.items,
          totalprice: state.totalprice,
          restaurantID: state.restaurantID,
          CartID: state.CartID,
        }),
      },
    ),
  ),
);

// Selector hooks for better performance
export const useCartItems = () => useCartStore((state) => state.items);
export const useCartTotal = () => useCartStore((state) => state.totalprice);
export const useCartRestaurantID = () => useCartStore((state) => state.restaurantID);
export const useCartID = () => useCartStore((state) => state.CartID);
export const useCartLoading = () => useCartStore((state) => state.isLoading);
export const useCartError = () => useCartStore((state) => state.error);
