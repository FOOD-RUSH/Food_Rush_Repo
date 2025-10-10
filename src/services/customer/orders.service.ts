import { Order } from '@/src/types/index';
import { apiClient } from '@/src/services/shared/apiClient';

// Order creation request (matches API docs)
export interface CreateOrderRequest {
  customerId: string;
  restaurantId: string;
  items: {
    menuItemId: string;
    quantity: number;
    specialInstructions?: string;
  }[];
  deliveryAddress: string;
  deliveryLatitude: number;
  deliveryLongitude: number;
  paymentMethod: 'mobile_money'; // Only mobile money is supported
}

// Order creation response (matches API docs exactly)
export interface CreateOrderResponse {
  status_code: number;
  message: string;
  data: {
    id: string;
    userId: string;
    restaurantId: string;
    items: {
      foodId: string;
      name: string;
      quantity: number;
      price: number;
      total: number;
      specialInstructions?: string;
    }[];
    subtotal: number;
    deliveryPrice: number;
    total: number;
    status: 'pending' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'out_for_delivery' | 'delivered' | 'cancelled';
    paymentMethod: string;
    createdAt: string;
  };
}

// Customer confirm order request
export interface CustomerConfirmOrderRequest {
  orderId: string;
}

// Order status update
export interface UpdateOrderStatusRequest {
  status: Order['status'];
}

export const OrderApi = {
  // Create a new order (matches API docs)
  createOrder: async (
    orderData: CreateOrderRequest,
  ): Promise<CreateOrderResponse> => {
    try {
      const response = await apiClient.post<CreateOrderResponse>(
        '/orders',
        orderData,
      );
      return response.data;
    } catch (error) {
      console.error('❌ Error creating order:', error);
      throw error;
    }
  },

  // Get order by ID (matches API docs)
  getOrderById: async (orderId: string) => {
    try {
      const response = await apiClient.get<{
        status_code: number;
        message: string;
        data: Order;
      }>(`/orders/${orderId}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      throw error;
    }
  },

  // Get user orders with optional filters (matches API docs)
  getUserOrders: async (params?: {
    status?: 'pending' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'out_for_delivery' | 'delivered' | 'cancelled';
    limit?: number;
    offset?: number;
  }) => {
    try {
      const response = await apiClient.get<{
        status_code: number;
        message: string;
        data: Order[];
      }>('/orders/my', { params });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  },

  // Get my orders (alias for getUserOrders for consistency)
  getMyOrders: async (params?: {
    status?: 'pending' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'out_for_delivery' | 'delivered' | 'cancelled';
    limit?: number;
    offset?: number;
  }) => {
    return OrderApi.getUserOrders(params);
  },

  // Customer confirms order to lock delivery fee and proceed to payment
  customerConfirmOrder: async (orderId: string) => {
    try {
      const response = await apiClient.post(
        `/orders/${orderId}/customer-confirm`,
      );
      return response.data;
    } catch (error) {
      console.error(`❌ Error confirming order ${orderId}:`, error);
      throw error;
    }
  },

  // Check order status (uses same endpoint as getOrderById)
  checkOrderStatus: async (orderId: string) => {
    try {
      const response = await apiClient.get<{
        status_code: number;
        message: string;
        data: Order;
      }>(`/orders/${orderId}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error checking order status ${orderId}:`, error);
      throw error;
    }
  },

  // Customer confirms they have received the delivery (matches API docs)
  confirmOrderReceived: async (orderId: string) => {
    try {
      const response = await apiClient.post(
        `/orders/${orderId}/confirm-received`,
      );
      return response.data;
    } catch (error) {
      console.error(
        `❌ Error confirming delivery received for order ${orderId}:`,
        error,
      );
      throw error;
    }
  },

  // Cancel order (customer cancels their own order)
  cancelOrder: async (orderId: string, reason?: string) => {
    try {
      const response = await apiClient.patch(`/orders/${orderId}/cancel`, {
        reason: reason || 'Customer cancelled',
      });
      return response.data;
    } catch (error) {
      console.error(`❌ Error cancelling order ${orderId}:`, error);
      throw error;
    }
  },
};
