import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { restaurantOrderApi, UpdateOrderStatusRequest } from "@/src/services/restaurant/orderApi";

export const useGetOrders = (params?: { status?: string; page?: number; limit?: number }) => {
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

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateOrderStatusRequest) =>
      restaurantOrderApi.updateOrderStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-orders'] });
    },
  });
};

export const useAcceptOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => restaurantOrderApi.acceptOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-orders'] });
    },
  });
};

export const useRejectOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason?: string }) =>
      restaurantOrderApi.rejectOrder(orderId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-orders'] });
    },
  });
};

export const useMarkOrderAsReady = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => restaurantOrderApi.markAsReady(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-orders'] });
    },
  });
};

export const useMarkOrderAsDelivered = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => restaurantOrderApi.markAsDelivered(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-orders'] });
    },
  });
};

export const useOrderStats = () => {
  return useQuery({
    queryKey: ['restaurant-order-stats'],
    queryFn: () => restaurantOrderApi.getOrderStats().then(res => res.data),
    refetchInterval: 60000, // Refetch every minute
  });
};