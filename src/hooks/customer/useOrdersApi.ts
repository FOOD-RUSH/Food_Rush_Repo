import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  OrderApi,
  CreateOrderRequest,
} from '@/src/services/customer/orders.service';
import { Order } from '@/src/types';
import Toast from 'react-native-toast-message';

const CACHE_CONFIG = {
  STALE_TIME: 30 * 1000, // 30 seconds for orders (frequently changing data)
  CACHE_TIME: 5 * 60 * 1000, // 5 minutes cache
  MAX_RETRIES: 3,
};

// Hook to get user's orders with real-time updates
export const useMyOrders = (params?: {
  status?: string;
  limit?: number;
  offset?: number;
}) => {
  return useQuery({
    queryKey: ['orders', 'my', params],
    queryFn: () => OrderApi.getMyOrders(params),
    staleTime: CACHE_CONFIG.STALE_TIME,
    gcTime: CACHE_CONFIG.CACHE_TIME,
    retry: CACHE_CONFIG.MAX_RETRIES,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for real-time updates
    refetchIntervalInBackground: true,
  });
};

// Hook to get pending/active orders (all statuses except delivered and cancelled)
export const useActiveOrders = () => {
  return useQuery({
    queryKey: ['orders', 'active'],
    queryFn: async () => {
      // Get all orders and filter on frontend since backend doesn't support comma-separated status
      const allOrders = await OrderApi.getMyOrders();

      // Filter for active orders (all statuses except delivered and cancelled)
      const activeStatuses = [
        'pending',
        'confirmed', 
        'preparing',
        'ready',
        'ready_for_pickup',
        'picked_up',
        'out_for_delivery',
        'payment_pending',
        'payment_confirmed'
      ];
      return allOrders.filter((order) => 
        !['delivered', 'cancelled'].includes(order.status)
      );
    },
    staleTime: 15 * 1000, // 15 seconds for active orders
    gcTime: CACHE_CONFIG.CACHE_TIME,
    retry: CACHE_CONFIG.MAX_RETRIES,
    refetchInterval: 15 * 1000, // More frequent updates for active orders
    refetchIntervalInBackground: true,
  });
};

// Hook to get completed orders (delivered only)
export const useCompletedOrders = (limit = 50) => {
  return useQuery({
    queryKey: ['orders', 'completed', limit],
    queryFn: async () => {
      // Get all orders and filter on frontend
      const allOrders = await OrderApi.getMyOrders({ limit });

      // Filter for completed orders (delivered only)
      return allOrders.filter((order) => order.status === 'delivered');
    },
    staleTime: 5 * 60 * 1000, // 5 minutes for completed orders
    gcTime: 10 * 60 * 1000,
    retry: CACHE_CONFIG.MAX_RETRIES,
  });
};

// Hook to get cancelled orders
export const useCancelledOrders = (limit = 50) => {
  return useQuery({
    queryKey: ['orders', 'cancelled', limit],
    queryFn: async () => {
      // Get all orders and filter on frontend
      const allOrders = await OrderApi.getMyOrders({ limit });

      // Filter for cancelled orders only
      return allOrders.filter((order) => order.status === 'cancelled');
    },
    staleTime: 5 * 60 * 1000, // 5 minutes for cancelled orders
    gcTime: 10 * 60 * 1000,
    retry: CACHE_CONFIG.MAX_RETRIES,
  });
};

// Hook to get order by ID with real-time tracking
export const useOrderById = (orderId: string, enabled = true) => {
  return useQuery({
    queryKey: ['orders', 'detail', orderId],
    queryFn: () => OrderApi.getOrderById(orderId),
    enabled: !!orderId && enabled,
    staleTime: 15 * 1000, // 15 seconds for order details
    gcTime: CACHE_CONFIG.CACHE_TIME,
    retry: CACHE_CONFIG.MAX_RETRIES,
    refetchInterval: (data) => {
      // Stop refetching if order is completed
      if (
        data?.state.data?.status === 'delivered' ||
        data?.state.data?.status === 'cancelled'
      ) {
        return false;
      }
      return 20 * 1000; // 20 seconds for active order tracking
    },
    refetchIntervalInBackground: true,
  });
};

// Hook to create order
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderData: CreateOrderRequest) =>
      OrderApi.createOrder(orderData),
    onSuccess: (data) => {
      // Invalidate and refetch orders
      queryClient.invalidateQueries({ queryKey: ['orders'] });

      Toast.show({
        type: 'success',
        text1: 'Order Placed!',
        text2: 'Your order has been placed successfully',
        position: 'top',
        visibilityTime: 4000,
      });

      // Add the new order to cache
      queryClient.setQueryData(['orders', 'detail', data.data.id], data.data);
    },
    onError: (error) => {
      console.error('Error creating order:', error);
      Toast.show({
        type: 'error',
        text1: 'Order Failed',
        text2: 'Failed to place your order. Please try again.',
        position: 'top',
      });
    },
  });
};

// Hook to confirm order
export const useConfirmOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => OrderApi.customerConfirmOrder(orderId),
    onSuccess: (_, orderId) => {
      // Update order status in cache
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({
        queryKey: ['orders', 'detail', orderId],
      });

      Toast.show({
        type: 'success',
        text1: 'Order Confirmed!',
        text2: 'Your order has been confirmed and is being prepared',
        position: 'top',
      });
    },
    onError: (error) => {
      console.error('Error confirming order:', error);
      Toast.show({
        type: 'error',
        text1: 'Confirmation Failed',
        text2: 'Failed to confirm your order. Please try again.',
        position: 'top',
      });
    },
  });
};

// Hook to confirm order received
export const useConfirmOrderReceived = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => OrderApi.confirmOrderReceived(orderId),
    onSuccess: (_, orderId) => {
      // Update order status in cache
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({
        queryKey: ['orders', 'detail', orderId],
      });

      Toast.show({
        type: 'success',
        text1: 'Order Received!',
        text2: 'Thank you for confirming delivery',
        position: 'top',
      });
    },
    onError: (error) => {
      console.error('Error confirming order received:', error);
      Toast.show({
        type: 'error',
        text1: 'Confirmation Failed',
        text2: 'Failed to confirm order received. Please try again.',
        position: 'top',
      });
    },
  });
};

// Hook to cancel order
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason?: string }) =>
      OrderApi.cancelOrder(orderId, reason),
    onSuccess: (_, { orderId }) => {
      // Update order status in cache
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({
        queryKey: ['orders', 'detail', orderId],
      });

      Toast.show({
        type: 'success',
        text1: 'Order Cancelled',
        text2: 'Your order has been cancelled successfully',
        position: 'top',
      });
    },
    onError: (error) => {
      console.error('Error cancelling order:', error);
      Toast.show({
        type: 'error',
        text1: 'Cancellation Failed',
        text2: 'Failed to cancel your order. Please try again.',
        position: 'top',
      });
    },
  });
};

// Helper hook to get order status information
export const useOrderStatus = (status: Order['status']) => {
  const statusInfo = {
    pending: {
      label: 'Order Placed',
      color: '#FFA500',
      icon: 'clock-outline',
      description: 'Waiting for restaurant confirmation',
      canCancel: true,
      showConfirm: false,
      showTrack: false,
      showConfirmDelivery: false,
      buttonText: 'Cancel Order'
    },
    confirmed: {
      label: 'Confirmed',
      color: '#4CAF50',
      icon: 'checkmark-circle-outline',
      description: 'Restaurant confirmed your order',
      canCancel: true,
      showConfirm: true,
      showTrack: false,
      showConfirmDelivery: false,
      buttonText: 'Confirm & Pay'
    },
    payment_pending: {
      label: 'Payment Pending',
      color: '#FF9800',
      icon: 'card-outline',
      description: 'Complete your payment',
      canCancel: false,
      showConfirm: false,
      showTrack: false,
      showConfirmDelivery: false,
      buttonText: 'Complete Payment'
    },
    payment_confirmed: {
      label: 'Payment Confirmed',
      color: '#4CAF50',
      icon: 'checkmark-circle',
      description: 'Payment successful, order being prepared',
      canCancel: false,
      showConfirm: false,
      showTrack: true,
      showConfirmDelivery: false,
      buttonText: 'Track Order'
    },
    preparing: {
      label: 'Preparing',
      color: '#2196F3',
      icon: 'restaurant-outline',
      description: 'Your order is being prepared',
      canCancel: false,
      showConfirm: false,
      showTrack: true,
      showConfirmDelivery: false,
      buttonText: 'Track Order'
    },
    ready: {
      label: 'Ready for Pickup',
      color: '#FF9800',
      icon: 'bag-check-outline',
      description: 'Order ready for delivery',
      canCancel: false,
      showConfirm: false,
      showTrack: true,
      showConfirmDelivery: false,
      buttonText: 'Track Order'
    },
    ready_for_pickup: {
      label: 'Ready for Pickup',
      color: '#FF9800',
      icon: 'bag-check-outline',
      description: 'Order ready for delivery',
      canCancel: false,
      showConfirm: false,
      showTrack: true,
      showConfirmDelivery: false,
      buttonText: 'Track Order'
    },
    picked_up: {
      label: 'Out for Delivery',
      color: '#9C27B0',
      icon: 'car-outline',
      description: 'Driver is on the way',
      canCancel: false,
      showConfirm: false,
      showTrack: true,
      showConfirmDelivery: false,
      buttonText: 'Track Order'
    },
    out_for_delivery: {
      label: 'Out for Delivery',
      color: '#9C27B0',
      icon: 'car-outline',
      description: 'Driver is on the way',
      canCancel: false,
      showConfirm: false,
      showTrack: true,
      showConfirmDelivery: false,
      buttonText: 'Track Order'
    },
    delivered: {
      label: 'Delivered',
      color: '#4CAF50',
      icon: 'checkmark-done-circle',
      description: 'Order delivered successfully',
      canCancel: false,
      showConfirm: false,
      showTrack: false,
      showConfirmDelivery: true,
      buttonText: 'Confirm Delivery'
    },
    cancelled: {
      label: 'Cancelled',
      color: '#F44336',
      icon: 'close-circle-outline',
      description: 'Order was cancelled',
      canCancel: false,
      showConfirm: false,
      showTrack: false,
      showConfirmDelivery: false,
      buttonText: ''
    },
  };

  return statusInfo[status] || statusInfo.pending;
};

// Hook to track active orders count for badge
export const useActiveOrdersCount = () => {
  const { data: activeOrders } = useActiveOrders();
  return activeOrders?.length || 0;
};
