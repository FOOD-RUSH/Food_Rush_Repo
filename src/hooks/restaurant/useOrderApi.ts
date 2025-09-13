import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { restaurantOrderApi, UpdateOrderStatusRequest } from "@/src/services/restaurant/orderApi";

export const useGetOrders = (params?: { status?: string; limit?: number; offset?: number }) => {
  return useQuery({
    queryKey: ['restaurant-orders', params],
    queryFn: () => restaurantOrderApi.getOrders(params).then(res => res.data.data),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useGetOrderById = (orderId: string) => {
  return useQuery({
    queryKey: ['restaurant-order', orderId],
    queryFn: () => restaurantOrderApi.getOrderById(orderId).then(res => res.data.data),
    enabled: !!orderId,
  });
};

export const useConfirmOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => restaurantOrderApi.confirmOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-orders'] });
    },
    onError: (error: any) => {
      // Handle session expired errors gracefully
      if (error?.code === 'SESSION_EXPIRED' || error?.message?.includes('session has expired')) {
        console.log('Session expired during order confirmation');
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
    mutationFn: (orderId: string) =>
      restaurantOrderApi.rejectOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-orders'] });
    },
    onError: (error: any) => {
      // Handle session expired errors gracefully
      if (error?.code === 'SESSION_EXPIRED' || error?.message?.includes('session has expired')) {
        console.log('Session expired during order rejection');
        // Don't show error to user, let the app handle logout
        return;
      }
      // For other errors, let them bubble up
      throw error;
    },
  });
};