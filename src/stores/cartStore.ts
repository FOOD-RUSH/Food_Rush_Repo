import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { FoodProps } from "../types";
interface cartStore {

    items: CartItem[];
    totalprice: number | null;
    restaurantID: string | null;
}

// this is created when the add to cart is pressed


export interface CartItem {
    id: string,
    menuItem: FoodProps,
    ItemtotalPrice: number;
    quantity: number;
    specialInstructions?: string
}
interface cartActions {
    // add items 
    addtoCart: (item: FoodProps, quantity: number, specialInstructions: string) => void
    // modify particularItem
    modifyCart: (itemId: string, quantity: number) => void
    // remove item
    deleteCart: (itemId: string) => void
    // total quantiy calculated inside
    calculateTotal: () => void
    // Clear cart
    clearCart: () => void
}



export const useCartStore = create<cartStore & cartActions>()(devtools(persist((set, get) => (
    {
        items: [],
        totalprice: 0,
        restaurantID: null,
        // cart actions
        addtoCart: (item, quantity, specialInstructions) => {
            const { restaurantID, items } = get()
            if (item.restaurantID === restaurantID) {
                Alert.alert('Warning', 'You are trying to add food from a different restaurant, do you want to clear cart and add button', [{ text: 'dismiss' }])
                return;
            };
            // update the exisiting item
            const exisitingItemIndex = items.findIndex((list) => list.menuItem.id === item.id);
            let newItems
            if (exisitingItemIndex >= 0) {
                // update existing state
                newItems = [...items]
                newItems[exisitingItemIndex].quantity += quantity;
                newItems[exisitingItemIndex].specialInstructions = specialInstructions;
                newItems[exisitingItemIndex].ItemtotalPrice = newItems[exisitingItemIndex].quantity * newItems[exisitingItemIndex].menuItem.price!
            }
            else {
                const newItem: CartItem = {
                    id: `${item.id} - ${Date.now()}`,
                    menuItem: item,
                    quantity: quantity,
                    ItemtotalPrice: item.price! * quantity,
                    specialInstructions: specialInstructions
                }
                newItems = [...items, newItem];
            };
            set({ items: newItems })

            Alert.alert('Success', 'Sucessfully added items', [{ text: 'Clear & Add' }, { text: 'dismiss' }])
            // calculates total so we get lastest values
            get().calculateTotal();
        },

        // Total price

        calculateTotal: () => {
            const { items } = get()
            const totalPrice = items.reduce((sum, item) => sum + item.ItemtotalPrice, 0);
            set({ totalprice: totalPrice })
        },

        deleteCart: (cartItemId) => {
            // get current state
            const items = get().items
            const filterItems = items.filter((item) => item.menuItem.id !== cartItemId);
            set({ items: filterItems });
            get().calculateTotal();
        },

        modifyCart: (CartItemid, quantity) => {
            const { items } = get();
            const newItems = items.map((item) => (item.menuItem.id === CartItemid ? { ...item, quantity, totalPrice: quantity * item.menuItem.price! } : item)
            );
            set({ items: newItems });
            get().calculateTotal();
        },
        clearCart: () => { set({ items: [], restaurantID: '', totalprice: 0 }) }



    }

), {
    name: 'cart-store',
    storage: createJSONStorage(() => AsyncStorage),
})))