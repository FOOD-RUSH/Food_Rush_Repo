import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { restaurantOrderApi } from '@/src/services/restaurant/orderApi';

export const useGetOrders = (params?: { status?: string }) => {
  return useQuery({
    queryKey: ['restaurant-orders', params],
    queryFn: async () => {
      console.log('🔄 [HOOK] useGetOrders called with params:', params);
      const result = await restaurantOrderApi.getOrders(params);
      console.log('📊 [HOOK] useGetOrders result:', {
        ordersCount: result?.length || 0,
        statusFilter: params?.status || 'all',
        orders:
          result?.map((order) => ({
            id: order.id,
            status: order.status,
            customer: order.customer?.fullName || order.customerName,
            total: order.total,
          })) || [],
      });
      return result;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useGetOrderById = (orderId: string) => {
  return useQuery({
    queryKey: ['restaurant-order', orderId],
    queryFn: async () => {
      console.log(`🔄 [HOOK] useGetOrderById called for order: ${orderId}`);
      const res = await restaurantOrderApi.getOrderById(orderId);
      console.log(`📊 [HOOK] useGetOrderById result for ${orderId}:`, {
        orderId: res.data.data.id,
        status: res.data.data.status,
        customer:
          res.data.data.customer?.fullName || res.data.data.customerName,
        total: res.data.data.total,
        itemsCount: res.data.data.items?.length || 0,
      });
      return res.data.data;
    },
    enabled: !!orderId,
  });
};

export const useConfirmOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      console.log(`🔄 [HOOK] useConfirmOrder called for order: ${orderId}`);
      const result = await restaurantOrderApi.confirmOrder(orderId);
      console.log(
        `✅ [HOOK] useConfirmOrder success for ${orderId}:`,
        result.data,
      );
      return result;
    },
    onSuccess: (data, orderId) => {
      console.log(
        `🔄 [HOOK] useConfirmOrder onSuccess - invalidating queries for order: ${orderId}`,
      );
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
        console.log('🔐 [HOOK] Session expired during order confirmation');
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
      console.log(`🔄 [HOOK] useRejectOrder called for order: ${orderId}`);
      const result = await restaurantOrderApi.rejectOrder(orderId);
      console.log(
        `✅ [HOOK] useRejectOrder success for ${orderId}:`,
        result.data,
      );
      return result;
    },
    onSuccess: (data, orderId) => {
      console.log(
        `🔄 [HOOK] useRejectOrder onSuccess - invalidating queries for order: ${orderId}`,
      );
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
        console.log('🔐 [HOOK] Session expired during order rejection');
        // Don't show error to user, let the app handle logout
        return;
      }
      // For other errors, let them bubble up
      throw error;
    },
  });
};
