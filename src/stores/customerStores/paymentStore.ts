import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Only mobile_money payment method is supported
export type PaymentMethod = 'mobile_money';
export type PaymentProvider = 'mtn' | 'orange';

export interface PaymentMethodDetails {
  type: PaymentMethod;
  provider?: PaymentProvider;
  name: string;
}

interface PaymentState {
  paymentMethods: PaymentMethod[];
  selectedPaymentMethod: PaymentMethod | null;
  selectedProvider: PaymentProvider | null; // For mobile_money type
  isPaymentLoading: boolean;
  paymentError: string | null;
}

interface PaymentActions {
  // Set selected payment method
  setSelectedPaymentMethod: (
    method: PaymentMethod,
    provider?: PaymentProvider,
  ) => void;

  // Set provider for mobile money
  setSelectedProvider: (provider: PaymentProvider) => void;

  // Clear error
  clearError: () => void;

  // Reset store
  reset: () => void;
}

const initialState: PaymentState = {
  paymentMethods: ['mobile_money'], // Only mobile money is supported
  selectedPaymentMethod: 'mobile_money', // Default and only option
  selectedProvider: 'mtn', // Default to MTN
  isPaymentLoading: false,
  paymentError: null,
};

export const usePaymentStore = create<PaymentState & PaymentActions>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setSelectedPaymentMethod: (method, provider) => {
          set({
            selectedPaymentMethod: method,
            selectedProvider:
              method === 'mobile_money' ? provider || 'mtn' : null,
          });
        },

        setSelectedProvider: (provider) => {
          set({ selectedProvider: provider });
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
          selectedProvider: state.selectedProvider,
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
export const useSelectedProvider = () =>
  usePaymentStore((state) => state.selectedProvider);
export const usePaymentLoading = () =>
  usePaymentStore((state) => state.isPaymentLoading);
export const usePaymentError = () =>
  usePaymentStore((state) => state.paymentError);
