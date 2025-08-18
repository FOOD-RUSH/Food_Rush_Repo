import { apiClient } from './apiClient';
import { PaymentMethod, PaymentTransaction } from '@/src/types';

export interface PaymentRequest {
  orderId: string;
  amount: number;
  method: PaymentMethod;
  phoneNumber: string;
}

export interface PaymentVerificationRequest {
  transactionId: string;
  orderId: string;
}

export interface PaymentHistoryRequest {
  customerId: string;
  limit?: number;
  page?: number;
}

export const paymentApi = {
  // Initiate payment
  initiatePayment: (paymentData: PaymentRequest) => {
    return apiClient.post<PaymentTransaction>('/payments/initiate', paymentData);
  },

  // Verify payment
  verifyPayment: (verificationData: PaymentVerificationRequest) => {
    return apiClient.post<PaymentTransaction>('/payments/verify', verificationData);
  },

  // Get payment by ID
  getPaymentById: (paymentId: string) => {
    return apiClient.get<PaymentTransaction>(`/payments/${paymentId}`);
  },

  // Get payment history for customer
  getPaymentHistory: (request: PaymentHistoryRequest) => {
    return apiClient.get<PaymentTransaction[]>('/payments/history', {
      params: request
    });
  },

  // Get all payment methods
  getPaymentMethods: () => {
    return apiClient.get<PaymentMethod[]>('/payments/methods');
  },

  // Add a new payment method
  addPaymentMethod: (method: PaymentMethod) => {
    return apiClient.post<void>('/payments/methods', { method });
  },

  // Remove a payment method
  removePaymentMethod: (method: PaymentMethod) => {
    return apiClient.delete<void>(`/payments/methods/${method}`);
  },
};