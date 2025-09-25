import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/src/services/shared/apiClient';
import Toast from 'react-native-toast-message';

interface ConfirmDeliveryParams {
  orderId: string;
}

interface DeliveryConfirmationState {
  isModalVisible: boolean;
  currentOrderId: string | null;
  orderDetails?: {
    orderNumber?: string;
    restaurantName?: string;
    deliveryAddress?: string;
  };
}

/**
 * Hook for managing delivery confirmation functionality
 */
export const useDeliveryConfirmation = () => {
  const queryClient = useQueryClient();

  const [state, setState] = useState<DeliveryConfirmationState>({
    isModalVisible: false,
    currentOrderId: null,
    orderDetails: undefined,
  });

  // Mutation for confirming delivery
  const confirmDeliveryMutation = useMutation({
    mutationFn: async ({ orderId }: ConfirmDeliveryParams) => {
      console.log('🚀 Confirming delivery for order:', orderId);
      const response = await apiClient.post(`//${orderId}/confirm-received`);
      return response.data;
    },
    onSuccess: (data, variables) => {
      Toast.show({
        type: 'success',
        text1: 'Delivery Confirmed',
        text2: 'Thank you for confirming your delivery!',
        position: 'top',
      });

      // Invalidate relevant queries to refresh order status
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['customer', 'orders'] });

      console.log('✅ Delivery confirmed successfully:', data);
    },
    onError: (error: any) => {
      console.error('❌ Error confirming delivery:', error);

      Toast.show({
        type: 'error',
        text1: 'Confirmation Failed',
        text2: error.message || 'Failed to confirm delivery. Please try again.',
        position: 'top',
      });
    },
  });

  // Show confirmation modal
  const showConfirmationModal = useCallback(
    (
      orderId: string,
      orderDetails?: {
        orderNumber?: string;
        restaurantName?: string;
        deliveryAddress?: string;
      },
    ) => {
      setState({
        isModalVisible: true,
        currentOrderId: orderId,
        orderDetails,
      });
    },
    [],
  );

  // Hide confirmation modal
  const hideConfirmationModal = useCallback(() => {
    setState({
      isModalVisible: false,
      currentOrderId: null,
      orderDetails: undefined,
    });
  }, []);

  // Confirm delivery
  const confirmDelivery = useCallback(
    async (orderId?: string) => {
      const targetOrderId = orderId || state.currentOrderId;

      if (!targetOrderId) {
        console.error('No order ID provided for delivery confirmation');
        return;
      }

      try {
        await confirmDeliveryMutation.mutateAsync({ orderId: targetOrderId });
        hideConfirmationModal();
      } catch (error) {
        // Error is handled by the mutation's onError callback
        console.error('Delivery confirmation failed:', error);
      }
    },
    [state.currentOrderId, confirmDeliveryMutation, hideConfirmationModal],
  );

  // Quick confirm without modal (for direct API calls)
  const quickConfirmDelivery = useCallback(
    async (orderId: string) => {
      return confirmDeliveryMutation.mutateAsync({ orderId });
    },
    [confirmDeliveryMutation],
  );

  return {
    // State
    isModalVisible: state.isModalVisible,
    currentOrderId: state.currentOrderId,
    orderDetails: state.orderDetails,
    isConfirming: confirmDeliveryMutation.isPending,

    // Actions
    showConfirmationModal,
    hideConfirmationModal,
    confirmDelivery,
    quickConfirmDelivery,

    // Mutation state
    isLoading: confirmDeliveryMutation.isPending,
    error: confirmDeliveryMutation.error,
    isSuccess: confirmDeliveryMutation.isSuccess,
    isError: confirmDeliveryMutation.isError,
  };
};

export default useDeliveryConfirmation;
