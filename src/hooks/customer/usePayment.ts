import { useMutation, useQuery } from '@tanstack/react-query';
import PaymentService, {
  PaymentInitRequest,
  PaymentResult,
  PaymentMethod,
  PaymentStatusResponse,
} from '@/src/services/customer/payment.service';
import Toast from 'react-native-toast-message';

// Hook to initialize payment
export const useInitializePayment = () => {
  return useMutation({
    mutationFn: (request: PaymentInitRequest): Promise<PaymentResult> =>
      PaymentService.initializePayment(request),
    onSuccess: (data) => {
      if (data.success) {
        Toast.show({
          type: 'success',
          text1: 'Payment Initiated',
          text2: data.message || 'Payment process started successfully',
          position: 'top',
          visibilityTime: 4000,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Payment Failed',
          text2: data.error || 'Failed to initiate payment',
          position: 'top',
        });
      }
    },
    onError: (error) => {
      console.error('Payment initialization error:', error);
      Toast.show({
        type: 'error',
        text1: 'Payment Error',
        text2: 'An error occurred while processing payment',
        position: 'top',
      });
    },
  });
};

// Hook to check payment status
export const usePaymentStatus = (transactionId: string, enabled = false) => {
  return useQuery({
    queryKey: ['payment', 'status', transactionId],
    queryFn: (): Promise<PaymentStatusResponse> =>
      PaymentService.checkPaymentStatus(transactionId),
    enabled: !!transactionId && enabled,
    refetchInterval: (data) => {
      // Stop polling if payment is completed, failed, or expired
      if (
        data?.state.data?.status === 'completed' ||
        data?.state.data?.status === 'failed' ||
        data?.state.data?.status === 'expired'
      ) {
        return false;
      }
      return 5000; // Poll every 5 seconds for pending payments
    },
    refetchIntervalInBackground: true,
    staleTime: 0, // Always fetch fresh data
  });
};

// Hook to get available payment methods
export const usePaymentMethods = () => {
  return useQuery({
    queryKey: ['payment', 'methods'],
    queryFn: (): Promise<PaymentMethod[]> => PaymentService.getPaymentMethods(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to validate phone number
export const useValidatePhoneNumber = () => {
  return (phoneNumber: string, medium: 'mtn' | 'orange'): boolean => {
    return PaymentService.validatePhoneNumber(phoneNumber, medium);
  };
};

// Hook to format phone number
export const useFormatPhoneNumber = () => {
  return (phoneNumber: string): string => {
    return PaymentService.formatPhoneNumber(phoneNumber);
  };
};

// Helper hook to create payment request from order and user data
export const useCreatePaymentRequest = () => {
  return (
    orderId: string,
    phone: string,
    medium: 'mtn' | 'orange',
    userName: string,
    userEmail: string,
    serviceFee?: number, // Optional service fee parameter
  ): PaymentInitRequest => {
    // Ensure phone number contains only digits (remove spaces and other non-digit characters)
    const cleanPhone = phone.replace(/\D/g, '');

    return {
      orderId,
      method: 'mobile_money',
      phone: cleanPhone,
      medium,
      name: userName,
      email: userEmail,
      ...(serviceFee && { serviceFee }), // Include service fee if provided
    };
  };
};
