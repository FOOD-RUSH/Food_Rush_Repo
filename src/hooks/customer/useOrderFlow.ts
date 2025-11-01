import { useState, useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  OrderApi,
  CreateOrderRequest,
  CreateOrderResponse,
} from '@/src/services/customer/orders.service';
import { useCartStore } from '@/src/stores/customerStores/cartStore';
import { useAuthUser } from '@/src/stores/customerStores';
import { useDefaultAddress } from '@/src/location/store';
// Payment method now handled in checkout component

export type OrderFlowStep =
  | 'creating' // Creating the order
  | 'created' // Order created successfully, MUST proceed to payment immediately
  | 'pending' // Order created but not paid yet (should not happen in new flow)
  | 'confirmed' // Restaurant confirmed (legacy - new orders require payment first)
  | 'payment_processing' // Payment in progress
  | 'preparing' // Payment successful, restaurant preparing
  | 'completed' // Order flow completed
  | 'cancelled' // Order cancelled
  | 'failed'; // Generic failure

// NEW PAYMENT FLOW:
// 1. User creates order → Order status: 'pending', isPaid: false
// 2. User MUST pay immediately → Order status: 'pending', isPaid: true
// 3. Restaurant can only see orders where isPaid: true
// 4. Restaurant confirms → Order status: 'confirmed', isPaid: true
// 5. Restaurant prepares → Order status: 'preparing', isPaid: true

export interface OrderFlowState {
  step: OrderFlowStep;
  orderId?: string;
  orderData?: CreateOrderResponse['data'];
  error?: string;
  shouldProceedToPayment?: boolean;
}

export const useOrderFlow = () => {
  const [flowState, setFlowState] = useState<OrderFlowState>({
    step: 'creating',
  });

  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const user = useAuthUser();
  const defaultAddress = useDefaultAddress();
  // Payment method now handled in checkout component

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: (orderData: CreateOrderRequest) =>
      OrderApi.createOrder(orderData),
    onSuccess: (response) => {
      // Order created successfully, MUST proceed to payment immediately
      // Restaurant will NOT see this order until payment is completed (isPaid: true)
      setFlowState({
        step: 'created',
        orderId: response.data.id,
        orderData: response.data,
        shouldProceedToPayment: true, // This triggers navigation to payment screen
      });
    },
    onError: (error) => {
      console.error('❌ Order creation failed:', error);
      setFlowState({
        step: 'failed',
        error: 'Failed to create order. Please try again.',
      });
    },
  });

  // Cancel order mutation (before restaurant confirmation)
  const cancelOrderMutation = useMutation({
    mutationFn: (orderId: string) => OrderApi.cancelOrder(orderId),
    onSuccess: () => {
      setFlowState((prev) => ({
        ...prev,
        step: 'cancelled',
      }));
    },
    onError: (error) => {
      console.error('❌ Order cancellation failed:', error);
      setFlowState((prev) => ({
        ...prev,
        error: 'Failed to cancel order. Please try again.',
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
      (flowState.step === 'pending' || flowState.step === 'confirmed'),
    refetchInterval: 3000, // Poll every 3 seconds
    onSuccess: (data) => {
      if (data?.status === 'confirmed' && flowState.step === 'pending') {
        setFlowState((prev) => ({
          ...prev,
          step: 'confirmed',
        }));
      } else if (data?.status === 'cancelled') {
        setFlowState((prev) => ({
          ...prev,
          step: 'cancelled',
          error: 'Order was cancelled.',
        }));
      } else if (data?.status === 'preparing') {
        setFlowState((prev) => ({
          ...prev,
          step: 'preparing',
        }));
      }
    },
  });

  // Create order from cart
  const createOrderFromCart = useCallback(
    async (
      restaurantId: string,
      coordinates?: { latitude: number; longitude: number },
    ) => {
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
        deliveryLongitude:
          coordinates?.longitude || defaultAddress.longitude || 0,
        paymentMethod: 'mobile_money', // Only mobile money is supported
      };

      setFlowState({ step: 'creating' });
      createOrderMutation.mutate(orderData);
    },
    [user, defaultAddress, cartItems, createOrderMutation],
  );

  // Cancel order (before restaurant confirmation)
  const cancelOrder = useCallback(() => {
    if (!flowState.orderId) {
      throw new Error('No order ID available for cancellation');
    }

    cancelOrderMutation.mutate(flowState.orderId);
  }, [flowState.orderId, cancelOrderMutation]);

  // Proceed to payment (after restaurant confirmation)
  const proceedToPayment = useCallback(() => {
    setFlowState((prev) => ({
      ...prev,
      step: 'payment_processing',
    }));
  }, []);

  // Mark payment as completed
  const completePayment = useCallback(() => {
    setFlowState((prev) => ({
      ...prev,
      step: 'preparing',
    }));
    clearCart();
  }, [clearCart]);

  // Mark payment as failed
  const failPayment = useCallback((error: string) => {
    setFlowState((prev) => ({
      ...prev,
      step: 'failed',
      error,
    }));
  }, []);

  // Reset flow state
  const resetFlow = useCallback(() => {
    setFlowState({ step: 'creating' });
  }, []);

  // Mark payment as started (when navigating to payment screen)
  const startPaymentFlow = useCallback(() => {
    setFlowState((prev) => ({
      ...prev,
      step: 'payment_processing',
      shouldProceedToPayment: false,
    }));
  }, []);

  // Status checks
  const isCreated = flowState.step === 'created';
  const isPending = flowState.step === 'pending';
  const isConfirmed = flowState.step === 'confirmed';
  const isPaymentProcessing = flowState.step === 'payment_processing';
  const isPreparing = flowState.step === 'preparing';
  const isCompleted = flowState.step === 'completed';
  const isCancelled = flowState.step === 'cancelled';
  const isFailed = flowState.step === 'failed';
  const canCancel = isPending; // Can only cancel before restaurant confirmation
  const shouldProceedToPayment = flowState.shouldProceedToPayment === true;

  return {
    // State
    flowState,
    orderStatus,

    // Actions
    createOrderFromCart,
    cancelOrder,
    proceedToPayment,
    startPaymentFlow,
    completePayment,
    failPayment,
    resetFlow,
    refetchOrderStatus,

    // Status checks
    isCreated,
    isPending,
    isConfirmed,
    isPaymentProcessing,
    isPreparing,
    isCompleted,
    isCancelled,
    isFailed,
    canCancel,
    shouldProceedToPayment,

    // Loading states
    isCreatingOrder: createOrderMutation.isPending,
    isCancellingOrder: cancelOrderMutation.isPending,
    isOrderCreated: isCreated,
  };
};
