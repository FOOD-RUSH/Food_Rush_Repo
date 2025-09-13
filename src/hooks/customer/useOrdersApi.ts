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

// Hook to get pending/active orders
export const useActiveOrders = () => {
  return useQuery({
    queryKey: ['orders', 'active'],
    queryFn: () =>
      OrderApi.getMyOrders({
        status: 'pending,confirmed,preparing,ready,picked_up',
        limit: 20,
      }),
    staleTime: 15 * 1000, // 15 seconds for active orders
    gcTime: CACHE_CONFIG.CACHE_TIME,
    retry: CACHE_CONFIG.MAX_RETRIES,
    refetchInterval: 15 * 1000, // More frequent updates for active orders
    refetchIntervalInBackground: true,
  });
};

// Hook to get completed orders
export const useCompletedOrders = (limit = 50) => {
  return useQuery({
    queryKey: ['orders', 'completed', limit],
    queryFn: () =>
      OrderApi.getMyOrders({
        status: 'delivered',
        limit,
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes for completed orders
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

// Helper hook to get order status information
export const useOrderStatus = (status: Order['status']) => {
  const statusInfo = {
    pending: {
      label: 'Order Placed',
      color: '#FFA500',
      icon: 'clock-outline',
      description: 'Waiting for restaurant confirmation',
      canCancel: true,
    },
    confirmed: {
      label: 'Confirmed',
      color: '#4CAF50',
      icon: 'checkmark-circle-outline',
      description: 'Restaurant confirmed your order',
      canCancel: false,
    },
    preparing: {
      label: 'Preparing',
      color: '#2196F3',
      icon: 'restaurant-outline',
      description: 'Your order is being prepared',
      canCancel: false,
    },
    ready: {
      label: 'Ready for Pickup',
      color: '#FF9800',
      icon: 'bag-check-outline',
      description: 'Order ready for delivery',
      canCancel: false,
    },
    picked_up: {
      label: 'Out for Delivery',
      color: '#9C27B0',
      icon: 'car-outline',
      description: 'Driver is on the way',
      canCancel: false,
    },
    delivered: {
      label: 'Delivered',
      color: '#4CAF50',
      icon: 'checkmark-done-circle',
      description: 'Order delivered successfully',
      canCancel: false,
    },
    cancelled: {
      label: 'Cancelled',
      color: '#F44336',
      icon: 'close-circle-outline',
      description: 'Order was cancelled',
      canCancel: false,
    },
  };

  return statusInfo[status] || statusInfo.pending;
};

// Hook to track active orders count for badge
export const useActiveOrdersCount = () => {
  const { data: activeOrders } = useActiveOrders();
  return activeOrders?.length || 0;
};
