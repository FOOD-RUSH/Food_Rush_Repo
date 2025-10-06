import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { restaurantOrderApi } from '@/src/services/restaurant/orderApi';

export const useGetOrders = (params?: { status?: string }) => {
  return useQuery({
    queryKey: ['restaurant-orders', params],
    queryFn: async () => {
      const result = await restaurantOrderApi.getOrders(params);
      return result;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useGetOrderById = (orderId: string) => {
  return useQuery({
    queryKey: ['restaurant-order', orderId],
    queryFn: async () => {
      const res = await restaurantOrderApi.getOrderById(orderId);
      return res.data.data;
    },
    enabled: !!orderId,
  });
};

export const useConfirmOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const result = await restaurantOrderApi.confirmOrder(orderId);
      return result;
    },
    onSuccess: (data, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-orders'] });
      queryClient.invalidateQueries({
        queryKey: ['restaurant-order', orderId],
      });
    },
    onError: (error: any, orderId) => {
      console.error(`❌ [HOOK] useConfirmOrder error for ${orderId}:`, error);
      // Handle session expired errors gracefully
      if (
        error?.code === 'SESSION_EXPIRED' ||
        error?.message?.includes('session has expired')
      ) {
        // Don't show error to user, let the app handle logout
        return;
      }
      // For other errors, let them bubble up
      throw error;
    },
  });
};

export const useRejectOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const result = await restaurantOrderApi.rejectOrder(orderId);
      return result;
    },
    onSuccess: (data, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-orders'] });
      queryClient.invalidateQueries({
        queryKey: ['restaurant-order', orderId],
      });
    },
    onError: (error: any, orderId) => {
      console.error(`❌ [HOOK] useRejectOrder error for ${orderId}:`, error);
      // Handle session expired errors gracefully
      if (
        error?.code === 'SESSION_EXPIRED' ||
        error?.message?.includes('session has expired')
      ) {
        // Don't show error to user, let the app handle logout
        return;
      }
      // For other errors, let them bubble up
      throw error;
    },
  });
};
