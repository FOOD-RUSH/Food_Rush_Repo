import { useState, useCallback, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  OrderApi,
  CreateOrderRequest,
  CreateOrderResponse,
} from '@/src/services/customer/orders.service';
import { useCartStore } from '@/src/stores/customerStores/cartStore';
import { useAuthUser } from '@/src/stores/customerStores';
import { useDefaultAddress } from '@/src/location/store';
import EnhancedPaymentService, {
  PaymentInitRequest,
  PaymentPollingResult,
} from '@/src/services/customer/enhancedPayment.service';
import Toast from 'react-native-toast-message';

export type EnhancedOrderFlowStep =
  | 'idle'                        // Initial state
  | 'creating_order'              // Creating the order
  | 'waiting_restaurant'          // Waiting for restaurant confirmation (2-15 min)
  | 'payment_required'            // Restaurant confirmed, payment needed
  | 'payment_processing'          // Payment in progress
  | 'payment_polling'             // Polling payment status
  | 'payment_success'             // Payment successful
  | 'order_preparing'             // Payment successful, restaurant preparing
  | 'order_ready'                 // Order ready for pickup/delivery
  | 'order_delivering'            // Out for delivery
  | 'order_completed'             // Order completed
  | 'order_cancelled'             // Order cancelled
  | 'payment_failed'              // Payment failed
  | 'order_failed';               // Order creation failed

export interface EnhancedOrderFlowState {
  step: EnhancedOrderFlowStep;
  orderId?: string;
  orderData?: CreateOrderResponse['data'];
  transactionId?: string;
  paymentAmount?: number;
  error?: string;
  canCancel: boolean;
  canRetryPayment: boolean;
  timeRemaining?: number; // For payment timeout
}

export interface PaymentDetails {
  provider: 'mtn' | 'orange';
  phoneNumber: string;
}

const RESTAURANT_CONFIRMATION_TIMEOUT = 15 * 60 * 1000; // 15 minutes
const PAYMENT_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export const useEnhancedOrderFlow = () => {
  const [flowState, setFlowState] = useState<EnhancedOrderFlowState>({
    step: 'idle',
    canCancel: false,
    canRetryPayment: false,
  });

  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const user = useAuthUser();
  const defaultAddress = useDefaultAddress();

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: (orderData: CreateOrderRequest) =>
      OrderApi.createOrder(orderData),
    onSuccess: (response) => {

      setFlowState({
        step: 'waiting_restaurant',
        orderId: response.data.id,
        orderData: response.data,
        paymentAmount: response.data.total,
        canCancel: true,
        canRetryPayment: false,
        timeRemaining: RESTAURANT_CONFIRMATION_TIMEOUT / 1000,
      });
      
      Toast.show({
        type: 'success',
        text1: 'Order Created',
        text2: 'Waiting for restaurant confirmation...',
        position: 'top',
      });
    },
    onError: (error: any) => {
      console.error('❌ Order creation failed:', error);
      setFlowState({
        step: 'order_failed',
        error: error.response?.data?.message || 'Failed to create order. Please try again.',
        canCancel: false,
        canRetryPayment: false,
      });
      
      Toast.show({
        type: 'error',
        text1: 'Order Failed',
        text2: 'Failed to create order. Please try again.',
        position: 'top',
      });
    },
  });

  // Cancel order mutation
  const cancelOrderMutation = useMutation({
    mutationFn: (orderId: string) => OrderApi.cancelOrder(orderId),
    onSuccess: () => {

      setFlowState((prev) => ({
        ...prev,
        step: 'order_cancelled',
        canCancel: false,
        canRetryPayment: false,
      }));
      
      Toast.show({
        type: 'info',
        text1: 'Order Cancelled',
        text2: 'Your order has been cancelled successfully.',
        position: 'top',
      });
    },
    onError: (error: any) => {
      console.error('❌ Order cancellation failed:', error);
      setFlowState((prev) => ({
        ...prev,
        error: error.response?.data?.message || 'Failed to cancel order.',
      }));
    },
  });

  // Poll order status to check restaurant response
  const { data: orderStatus, refetch: refetchOrderStatus } = useQuery({
    queryKey: ['orderStatus', flowState.orderId],
    queryFn: () =>
      flowState.orderId ? OrderApi.checkOrderStatus(flowState.orderId) : null,
    enabled:
      !!flowState.orderId &&
      (flowState.step === 'waiting_restaurant' || 
       flowState.step === 'order_preparing' ||
       flowState.step === 'order_ready' ||
       flowState.step === 'order_delivering'),
    refetchInterval: 3000, // Poll every 3 seconds
    onSuccess: (data) => {
      if (!data) return;

      const currentStep = flowState.step;
      
      // Handle restaurant confirmation
      if (data.status === 'confirmed' && currentStep === 'waiting_restaurant') {

        setFlowState((prev) => ({
          ...prev,
          step: 'payment_required',
          canCancel: false, // Can't cancel after restaurant confirmation
          canRetryPayment: true,
          timeRemaining: undefined,
        }));
        
        Toast.show({
          type: 'success',
          text1: 'Order Confirmed',
          text2: 'Restaurant confirmed your order. Please proceed with payment.',
          position: 'top',
        });
      }
      
      // Handle restaurant rejection/cancellation
      else if (data.status === 'cancelled') {

        setFlowState((prev) => ({
          ...prev,
          step: 'order_cancelled',
          error: data.cancellationReason || 'Restaurant cancelled your order.',
          canCancel: false,
          canRetryPayment: false,
        }));
        
        Toast.show({
          type: 'error',
          text1: 'Order Cancelled',
          text2: 'Restaurant cancelled your order.',
          position: 'top',
        });
      }
      
      // Handle order status updates after payment
      else if (data.status === 'preparing' && currentStep !== 'order_preparing') {
        setFlowState((prev) => ({
          ...prev,
          step: 'order_preparing',
          canCancel: false,
          canRetryPayment: false,
        }));
      }
      else if (data.status === 'ready_for_pickup' && currentStep !== 'order_ready') {
        setFlowState((prev) => ({
          ...prev,
          step: 'order_ready',
        }));
        
        Toast.show({
          type: 'success',
          text1: 'Order Ready',
          text2: 'Your order is ready for pickup!',
          position: 'top',
        });
      }
      else if (data.status === 'out_for_delivery' && currentStep !== 'order_delivering') {
        setFlowState((prev) => ({
          ...prev,
          step: 'order_delivering',
        }));
        
        Toast.show({
          type: 'info',
          text1: 'Out for Delivery',
          text2: 'Your order is on the way!',
          position: 'top',
        });
      }
      else if (data.status === 'delivered') {
        setFlowState((prev) => ({
          ...prev,
          step: 'order_completed',
        }));
        
        Toast.show({
          type: 'success',
          text1: 'Order Delivered',
          text2: 'Enjoy your meal!',
          position: 'top',
        });
      }
    },
  });

  // Timer for restaurant confirmation timeout
  useEffect(() => {
    if (flowState.step === 'waiting_restaurant' && flowState.timeRemaining) {
      const timer = setInterval(() => {
        setFlowState((prev) => {
          if (!prev.timeRemaining || prev.timeRemaining <= 1) {
            clearInterval(timer);
            return {
              ...prev,
              step: 'order_cancelled',
              error: 'Restaurant did not respond within the time limit.',
              canCancel: false,
              canRetryPayment: false,
              timeRemaining: undefined,
            };
          }
          return {
            ...prev,
            timeRemaining: prev.timeRemaining - 1,
          };
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [flowState.step, flowState.timeRemaining]);

  // Create order from cart
  const createOrderFromCart = useCallback(
    async (restaurantId: string, coordinates?: { latitude: number; longitude: number }) => {
      if (!user?.id || !defaultAddress || cartItems.length === 0) {
        throw new Error('Missing required information for order creation');
      }

      const orderData: CreateOrderRequest = {
        customerId: user.id,
        restaurantId,
        items: cartItems.map((item) => ({
          menuItemId: item.menuItem.id,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions || undefined,
        })),
        deliveryAddress: defaultAddress.fullAddress,
        deliveryLatitude: coordinates?.latitude || defaultAddress.latitude || 0,
        deliveryLongitude: coordinates?.longitude || defaultAddress.longitude || 0,
        paymentMethod: 'mobile_money',
      };

      setFlowState({ 
        step: 'creating_order',
        canCancel: false,
        canRetryPayment: false,
      });
      
      createOrderMutation.mutate(orderData);
    },
    [user, defaultAddress, cartItems, createOrderMutation],
  );

  // Process payment
  const processPayment = useCallback(
    async (paymentDetails: PaymentDetails) => {
      if (!flowState.orderId || !user?.fullName || !user?.email) {
        throw new Error('Missing required information for payment');
      }

      setFlowState((prev) => ({
        ...prev,
        step: 'payment_processing',
        error: undefined,
        timeRemaining: PAYMENT_TIMEOUT / 1000,
      }));

      try {
        const paymentRequest: PaymentInitRequest = {
          orderId: flowState.orderId,
          method: 'mobile_money',
          phone: paymentDetails.phoneNumber,
          medium: paymentDetails.provider,
          name: user.fullName,
          email: user.email,
        };

        setFlowState((prev) => ({
          ...prev,
          step: 'payment_polling',
        }));

        // Process payment with polling
        const result: PaymentPollingResult = await EnhancedPaymentService.processPaymentWithRetry(
          paymentRequest,
          (status) => {

          },
        );

        if (result.success) {

          setFlowState((prev) => ({
            ...prev,
            step: 'payment_success',
            transactionId: result.transactionId,
            canRetryPayment: false,
            timeRemaining: undefined,
          }));
          
          // Clear cart after successful payment
          clearCart();
          
          Toast.show({
            type: 'success',
            text1: 'Payment Successful',
            text2: 'Your payment has been confirmed!',
            position: 'top',
          });
          
          // Refresh order status to get updated state
          setTimeout(() => {
            refetchOrderStatus();
          }, 2000);
        } else {
          console.error('❌ Payment failed:', result.error);
          setFlowState((prev) => ({
            ...prev,
            step: 'payment_failed',
            error: result.error,
            canRetryPayment: true,
            timeRemaining: undefined,
          }));
          
          Toast.show({
            type: 'error',
            text1: 'Payment Failed',
            text2: result.error || 'Payment processing failed',
            position: 'top',
          });
        }
      } catch (error: any) {
        console.error('❌ Payment processing error:', error);
        setFlowState((prev) => ({
          ...prev,
          step: 'payment_failed',
          error: error.message || 'Payment processing failed',
          canRetryPayment: true,
          timeRemaining: undefined,
        }));
      }
    },
    [flowState.orderId, user, clearCart, refetchOrderStatus],
  );

  // Cancel order
  const cancelOrder = useCallback(() => {
    if (!flowState.orderId || !flowState.canCancel) {
      throw new Error('Cannot cancel order at this time');
    }

    cancelOrderMutation.mutate(flowState.orderId);
  }, [flowState.orderId, flowState.canCancel, cancelOrderMutation]);

  // Retry payment
  const retryPayment = useCallback(() => {
    if (!flowState.canRetryPayment) {
      throw new Error('Cannot retry payment at this time');
    }

    setFlowState((prev) => ({
      ...prev,
      step: 'payment_required',
      error: undefined,
      timeRemaining: undefined,
    }));
  }, [flowState.canRetryPayment]);

  // Reset flow
  const resetFlow = useCallback(() => {
    setFlowState({
      step: 'idle',
      canCancel: false,
      canRetryPayment: false,
    });
  }, []);

  // Format time remaining
  const formatTimeRemaining = useCallback((seconds?: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    // State
    flowState,
    orderStatus,
    
    // Actions
    createOrderFromCart,
    processPayment,
    cancelOrder,
    retryPayment,
    resetFlow,
    refetchOrderStatus,
    
    // Utilities
    formatTimeRemaining,
    
    // Loading states
    isCreatingOrder: createOrderMutation.isPending,
    isCancellingOrder: cancelOrderMutation.isPending,
    
    // Status checks
    isWaitingRestaurant: flowState.step === 'waiting_restaurant',
    isPaymentRequired: flowState.step === 'payment_required',
    isPaymentProcessing: flowState.step === 'payment_processing' || flowState.step === 'payment_polling',
    isPaymentSuccess: flowState.step === 'payment_success',
    isPaymentFailed: flowState.step === 'payment_failed',
    isOrderPreparing: flowState.step === 'order_preparing',
    isOrderCompleted: flowState.step === 'order_completed',
    isOrderCancelled: flowState.step === 'order_cancelled',
    isOrderFailed: flowState.step === 'order_failed',
  };
};