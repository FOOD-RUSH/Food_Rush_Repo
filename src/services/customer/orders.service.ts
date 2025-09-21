import { Order } from '@/src/types/index';
import { apiClient } from '@/src/services/shared/apiClient';
import { logError } from '@/src/utils/errorHandler';

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
}

// Order status update
export interface UpdateOrderStatusRequest {
  status: Order['status'];
}

export const OrderApi = {
  // Create a new order (matches API docs)
  createOrder: async (orderData: CreateOrderRequest) => {
    try {
      const response = await apiClient.post<{
        data: Order;
      }>('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Get order by ID (matches API docs)
  getOrderById: async (orderId: string) => {
    try {
      const response = await apiClient.get<{
        data: Order;
      }>(`/orders/${orderId}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      throw error;
    }
  },

  // Get user orders with optional filters
  getUserOrders: async (params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }) => {
    try {
      const response = await apiClient.get<{
        data: Order[];
      }>('/orders', { params });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  },

  // Get my orders (alias for getUserOrders for consistency)
  getMyOrders: async (params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }) => {
    return OrderApi.getUserOrders(params);
  },

  // Customer confirms order (if needed)
  customerConfirmOrder: async (orderId: string) => {
    try {
      const response = await apiClient.post(`/orders/${orderId}/confirm`);
      return response.data;
    } catch (error) {
      console.error(`Error confirming order ${orderId}:`, error);
      throw error;
    }
  },

  // Customer confirms they have received the delivery
  confirmOrderReceived: async (orderId: string) => {
    try {
      console.log('🚀 Confirming delivery received for order:', orderId);
      const response = await apiClient.post(`/api/v1/orders/${orderId}/confirm-received`);
      console.log('✅ Delivery confirmation response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error confirming delivery received for order ${orderId}:`, error);
      throw error;
    }
  },
};
