import { apiClient } from '@/src/services/shared/apiClient';

export interface OrderItem {
  foodId: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
  specialInstructions?: string;
}

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  items: OrderItem[];
  subtotal: number;
  deliveryPrice: number;
  total: number;
  status:
    | 'pending'
    | 'confirmed'
    | 'preparing'
    | 'ready_for_pickup'
    | 'out_for_delivery'
    | 'delivered'
    | 'cancelled';
  paymentMethod: 'mobile_money' | 'credit_card' | 'cash';
  createdAt: string;
  customer: Customer;

  // Computed properties for backward compatibility
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  deliveryFee?: number;
  time?: string;
}

export interface OrderResponse {
  status_code: number;
  message: string;
  data: Order[]; // Backend returns orders array directly
}

// Legacy interface for backward compatibility
export interface PaginatedOrderResponse {
  status_code: number;
  message: string;
  data: {
    orders: Order[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface UpdateOrderStatusRequest {
  orderId: string;
  status: Order['status'];
}

// Available order status values for filtering
export const ORDER_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY_FOR_PICKUP: 'ready_for_pickup',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export const restaurantOrderApi = {
  // Get all orders for the restaurant
  getOrders: (params?: { status?: string }) => {
    console.log(
      '🔍 [ORDER API] Fetching restaurant orders with params:',
      params,
    );

    return apiClient
      .get<OrderResponse>('/orders/my-restaurant', { params })
      .then((res) => {
        console.log(
          '✅ [ORDER API] Raw backend response:',
          JSON.stringify(res.data, null, 2),
        );
        console.log('📊 [ORDER API] Orders count:', res.data.data?.length || 0);

        return res.data.data;
      })
      .catch((error) => {
        console.error('❌ [ORDER API] Error fetching orders:', error);
        console.error('❌ [ORDER API] Error details:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        throw error;
      });
  },

  // Get orders for a specific restaurant
  getOrdersByRestaurantId: (restaurantId: string) => {
    console.log(
      `🔍 [ORDER API] Fetching orders for restaurant ID: ${restaurantId}`,
    );
    return apiClient
      .get<OrderResponse>(`/orders/restaurant/${restaurantId}`)
      .then((res) => {
        console.log(
          `✅ [ORDER API] Restaurant ${restaurantId} orders response:`,
          JSON.stringify(res.data, null, 2),
        );
        return res;
      })
      .catch((error) => {
        console.error(
          `❌ [ORDER API] Error fetching orders for restaurant ${restaurantId}:`,
          error,
        );
        throw error;
      });
  },

  // Get order by ID
  getOrderById: (orderId: string) => {
    console.log(`🔍 [ORDER API] Fetching order details for ID: ${orderId}`);
    return apiClient
      .get<{ status_code: number; message: string; data: Order }>(
        `/orders/${orderId}`,
      )
      .then((res) => {
        console.log(
          `✅ [ORDER API] Order ${orderId} details:`,
          JSON.stringify(res.data, null, 2),
        );
        return res;
      })
      .catch((error) => {
        console.error(`❌ [ORDER API] Error fetching order ${orderId}:`, error);
        throw error;
      });
  },

  // Confirm order
  confirmOrder: (orderId: string) => {
    console.log(`🔄 [ORDER API] Confirming order: ${orderId}`);
    return apiClient
      .post(`/orders/${orderId}/confirm`)
      .then((res) => {
        console.log(
          `✅ [ORDER API] Order ${orderId} confirmed successfully:`,
          JSON.stringify(res.data, null, 2),
        );
        return res;
      })
      .catch((error) => {
        console.error(
          `❌ [ORDER API] Error confirming order ${orderId}:`,
          error,
        );
        throw error;
      });
  },

  // Reject order
  rejectOrder: (orderId: string) => {
    console.log(`🔄 [ORDER API] Rejecting order: ${orderId}`);
    return apiClient
      .post(`/orders/${orderId}/reject`)
      .then((res) => {
        console.log(
          `✅ [ORDER API] Order ${orderId} rejected successfully:`,
          JSON.stringify(res.data, null, 2),
        );
        return res;
      })
      .catch((error) => {
        console.error(
          `❌ [ORDER API] Error rejecting order ${orderId}:`,
          error,
        );
        throw error;
      });
  },
};
