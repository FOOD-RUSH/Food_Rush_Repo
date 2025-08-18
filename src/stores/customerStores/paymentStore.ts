import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { paymentApi } from '@/src/services/customer/payment.service';
import { PaymentMethod, PaymentTransaction } from '@/src/types';

interface PaymentState {
  paymentMethods: PaymentMethod[];
  paymentHistory: PaymentTransaction[];
  selectedPaymentMethod: PaymentMethod | null;
  isPaymentLoading: boolean;
  paymentError: string | null;
}

interface PaymentActions {
  // Fetch available payment methods
  fetchPaymentMethods: () => Promise<void>;
  
  // Add a payment method
  addPaymentMethod: (method: PaymentMethod) => Promise<void>;
  
  // Remove a payment method
  removePaymentMethod: (method: PaymentMethod) => Promise<void>;
  
  // Set selected payment method
  setSelectedPaymentMethod: (method: PaymentMethod) => void;
  
  // Initiate payment
  initiatePayment: (paymentData: {
    orderId: string;
    amount: number;
    method: PaymentMethod;
    phoneNumber: string;
  }) => Promise<PaymentTransaction>;
  
  // Verify payment
  verifyPayment: (verificationData: {
    transactionId: string;
    orderId: string;
  }) => Promise<PaymentTransaction>;
  
  // Fetch payment history
  fetchPaymentHistory: (customerId: string) => Promise<void>;
  
  // Clear error
  clearError: () => void;
  
  // Reset store
  reset: () => void;
}

const initialState: PaymentState = {
  paymentMethods: ['mtn_mobile_money', 'orange_money'],
  paymentHistory: [],
  selectedPaymentMethod: null,
  isPaymentLoading: false,
  paymentError: null,
};

export const usePaymentStore = create<PaymentState & PaymentActions>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        fetchPaymentMethods: async () => {
          try {
            set({ isPaymentLoading: true, paymentError: null });
            const response = await paymentApi.getPaymentMethods();
            
            set({ 
              paymentMethods: response.data,
              isPaymentLoading: false 
            });
          } catch (error: any) {
            set({ 
              paymentError: error.message || 'Failed to fetch payment methods',
              isPaymentLoading: false 
            });
          }
        },
        
        addPaymentMethod: async (method) => {
          try {
            set({ isPaymentLoading: true, paymentError: null });
            await paymentApi.addPaymentMethod(method);
            
            set(state => ({
              paymentMethods: [...state.paymentMethods, method],
              isPaymentLoading: false
            }));
          } catch (error: any) {
            set({ 
              paymentError: error.message || 'Failed to add payment method',
              isPaymentLoading: false 
            });
            throw error;
          }
        },
        
        removePaymentMethod: async (method) => {
          try {
            set({ isPaymentLoading: true, paymentError: null });
            await paymentApi.removePaymentMethod(method);
            
            set(state => ({
              paymentMethods: state.paymentMethods.filter(m => m !== method),
              isPaymentLoading: false
            }));
          } catch (error: any) {
            set({ 
              paymentError: error.message || 'Failed to remove payment method',
              isPaymentLoading: false 
            });
            throw error;
          }
        },
        
        setSelectedPaymentMethod: (method) => {
          set({ selectedPaymentMethod: method });
        },
        
        initiatePayment: async (paymentData) => {
          try {
            set({ isPaymentLoading: true, paymentError: null });
            const response = await paymentApi.initiatePayment(paymentData);
            
            set({ isPaymentLoading: false });
            return response.data;
          } catch (error: any) {
            set({ 
              paymentError: error.message || 'Failed to initiate payment',
              isPaymentLoading: false 
            });
            throw error;
          }
        },
        
        verifyPayment: async (verificationData) => {
          try {
            set({ isPaymentLoading: true, paymentError: null });
            const response = await paymentApi.verifyPayment(verificationData);
            
            // Add to payment history
            set(state => ({
              paymentHistory: [response.data, ...state.paymentHistory],
              isPaymentLoading: false
            }));
            
            return response.data;
          } catch (error: any) {
            set({ 
              paymentError: error.message || 'Failed to verify payment',
              isPaymentLoading: false 
            });
            throw error;
          }
        },
        
        fetchPaymentHistory: async (customerId) => {
          try {
            set({ isPaymentLoading: true, paymentError: null });
            const response = await paymentApi.getPaymentHistory({ customerId });
            
            set({ 
              paymentHistory: response.data,
              isPaymentLoading: false 
            });
          } catch (error: any) {
            set({ 
              paymentError: error.message || 'Failed to fetch payment history',
              isPaymentLoading: false 
            });
          }
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
      }
    ),
    { name: 'PaymentStore' }
  )
);

// Selector hooks for better performance
export const usePaymentMethods = () => usePaymentStore((state) => state.paymentMethods);
export const useSelectedPaymentMethod = () => usePaymentStore((state) => state.selectedPaymentMethod);
export const usePaymentHistory = () => usePaymentStore((state) => state.paymentHistory);
export const usePaymentLoading = () => usePaymentStore((state) => state.isPaymentLoading);
export const usePaymentError = () => usePaymentStore((state) => state.paymentError);