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
import { useSelectedPaymentMethod } from '@/src/stores/customerStores/paymentStore';

export type OrderFlowStep =
  | 'creating'
  | 'pending_restaurant_confirmation'
  | 'ready_for_customer_confirmation'
  | 'customer_confirming'
  | 'payment_processing'
  | 'completed'
  | 'failed';

export interface OrderFlowState {
  step: OrderFlowStep;
  orderId?: string;
  orderData?: CreateOrderResponse['data'];
  error?: string;
}

export const useOrderFlow = () => {
  const [flowState, setFlowState] = useState<OrderFlowState>({
    step: 'creating',
  });

  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const user = useAuthUser();
  const defaultAddress = useDefaultAddress();
  const selectedPaymentMethod = useSelectedPaymentMethod();

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: (orderData: CreateOrderRequest) =>
      OrderApi.createOrder(orderData),
    onSuccess: (response) => {
      console.log('✅ Order created successfully:', response);
      setFlowState({
        step: 'pending_restaurant_confirmation',
        orderId: response.data.id,
        orderData: response.data,
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

  // Customer confirm order mutation
  const customerConfirmMutation = useMutation({
    mutationFn: (orderId: string) => OrderApi.customerConfirmOrder(orderId),
    onSuccess: () => {
      console.log('✅ Customer confirmation successful');
      setFlowState((prev) => ({
        ...prev,
        step: 'payment_processing',
      }));
    },
    onError: (error) => {
      console.error('❌ Customer confirmation failed:', error);
      setFlowState((prev) => ({
        ...prev,
        step: 'failed',
        error: 'Failed to confirm order. Please try again.',
      }));
    },
  });

  // Poll order status to check if restaurant confirmed
  const { data: orderStatus, refetch: refetchOrderStatus } = useQuery({
    queryKey: ['orderStatus', flowState.orderId],
    queryFn: () =>
      flowState.orderId ? OrderApi.checkOrderStatus(flowState.orderId) : null,
    enabled:
      !!flowState.orderId &&
      flowState.step === 'pending_restaurant_confirmation',
    refetchInterval: 3000, // Poll every 3 seconds
    onSuccess: (data) => {
      if (data?.status === 'confirmed') {
        console.log(
          '✅ Restaurant confirmed order, ready for customer confirmation',
        );
        setFlowState((prev) => ({
          ...prev,
          step: 'ready_for_customer_confirmation',
        }));
      } else if (data?.status === 'cancelled') {
        console.log('❌ Restaurant cancelled order');
        setFlowState((prev) => ({
          ...prev,
          step: 'failed',
          error: 'Restaurant cancelled your order. Please try again.',
        }));
      }
    },
  });

  // Create order from cart
  const createOrderFromCart = useCallback(
    async (restaurantId: string) => {
      if (
        !user?.id ||
        !defaultAddress ||
        !selectedPaymentMethod ||
        cartItems.length === 0
      ) {
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
        deliveryLatitude: defaultAddress.latitude || 0,
        deliveryLongitude: defaultAddress.longitude || 0,
        paymentMethod: 'mobile_money', // Only mobile money is supported
      };

      setFlowState({ step: 'creating' });
      createOrderMutation.mutate(orderData);
    },
    [
      user,
      defaultAddress,
      selectedPaymentMethod,
      cartItems,
      createOrderMutation,
    ],
  );

  // Customer confirms order (after restaurant confirmation)
  const confirmOrder = useCallback(() => {
    if (!flowState.orderId) {
      throw new Error('No order ID available for confirmation');
    }

    setFlowState((prev) => ({
      ...prev,
      step: 'customer_confirming',
    }));

    customerConfirmMutation.mutate(flowState.orderId);
  }, [flowState.orderId, customerConfirmMutation]);

  // Mark payment as completed
  const completePayment = useCallback(() => {
    setFlowState((prev) => ({
      ...prev,
      step: 'completed',
    }));
    clearCart();
  }, [clearCart]);

  // Reset flow state
  const resetFlow = useCallback(() => {
    setFlowState({ step: 'creating' });
  }, []);

  // Check if order is ready for customer confirmation
  const isReadyForCustomerConfirmation =
    flowState.step === 'ready_for_customer_confirmation';

  // Check if order is waiting for restaurant confirmation
  const isWaitingForRestaurant =
    flowState.step === 'pending_restaurant_confirmation';

  // Check if payment is in progress
  const isPaymentInProgress = flowState.step === 'payment_processing';

  // Check if order flow is completed
  const isCompleted = flowState.step === 'completed';

  // Check if order flow failed
  const isFailed = flowState.step === 'failed';

  return {
    // State
    flowState,
    orderStatus,

    // Actions
    createOrderFromCart,
    confirmOrder,
    completePayment,
    resetFlow,
    refetchOrderStatus,

    // Status checks
    isReadyForCustomerConfirmation,
    isWaitingForRestaurant,
    isPaymentInProgress,
    isCompleted,
    isFailed,

    // Loading states
    isCreatingOrder: createOrderMutation.isPending,
    isConfirmingOrder: customerConfirmMutation.isPending,
  };
};
