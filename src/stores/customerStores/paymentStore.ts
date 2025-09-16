import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Simplified payment method type
export type PaymentMethod = 'mtn_mobile_money' | 'orange_money' | 'card';

interface PaymentState {
  paymentMethods: PaymentMethod[];
  selectedPaymentMethod: PaymentMethod | null;
  isPaymentLoading: boolean;
  paymentError: string | null;
}

interface PaymentActions {
  // Set selected payment method
  setSelectedPaymentMethod: (method: PaymentMethod) => void;

  // Clear error
  clearError: () => void;

  // Reset store
  reset: () => void;
}

const initialState: PaymentState = {
  paymentMethods: ['mtn_mobile_money', 'orange_money'],
  selectedPaymentMethod: 'mtn_mobile_money', // Default to MTN Mobile Money
  isPaymentLoading: false,
  paymentError: null,
};

export const usePaymentStore = create<PaymentState & PaymentActions>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setSelectedPaymentMethod: (method) => {
          set({ selectedPaymentMethod: method });
        },

        clearError: () => {
          set({ paymentError: null });
        },

        reset: () => {
          set(initialState);
        },
      }),
      {
        name: 'payment-storage',
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({
          paymentMethods: state.paymentMethods,
          selectedPaymentMethod: state.selectedPaymentMethod,
        }),
        version: 1,
      },
    ),
    { name: 'PaymentStore' },
  ),
);

// Selector hooks for better performance
export const usePaymentMethods = () =>
  usePaymentStore((state) => state.paymentMethods);
export const useSelectedPaymentMethod = () =>
  usePaymentStore((state) => state.selectedPaymentMethod);
export const usePaymentLoading = () =>
  usePaymentStore((state) => state.isPaymentLoading);
export const usePaymentError = () =>
  usePaymentStore((state) => state.paymentError);
