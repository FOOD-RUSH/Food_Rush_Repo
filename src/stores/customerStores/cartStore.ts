import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { FoodProps } from '../../types';

interface cartStore {
  CartID: string | null;
  items: CartItem[];
  totalprice: number;
  restaurantID: string | null;
}

export interface CartItem {
  id: string;
  menuItem: FoodProps;
  ItemtotalPrice: number;
  quantity: number;
  specialInstructions?: string;
}

interface cartActions {
  addtoCart: (
    item: FoodProps,
    quantity: number,
    specialInstructions: string,
  ) => void;
  modifyCart: (itemId: string, quantity: number) => void;
  deleteCart: (itemId: string) => void;
  calculateTotal: () => void;
  clearCart: () => void;
}

export const useCartStore = create<cartStore & cartActions>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        totalprice: 0,
        restaurantID: null,
        CartID: null,

        addtoCart: (item, quantity, specialInstructions) => {
          const { restaurantID, items } = get();

          // Check if adding from different restaurant
          if (restaurantID && item.restaurantID !== restaurantID) {
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
                      restaurantID: item.restaurantID,
                      CartID: `${Date.now()}-${item.restaurantID}`,
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
                restaurantID: item.restaurantID,
                CartID: `${Date.now()}-${item.restaurantID}`,
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
        },

        modifyCart: (CartItemId, quantity) => {
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
        },

        clearCart: () => {
          set({
            items: [],
            restaurantID: null,
            totalprice: 0,
            CartID: null,
          });
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
