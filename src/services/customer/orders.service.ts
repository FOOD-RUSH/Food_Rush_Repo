import { Order } from '@/src/types/index';
import { apiClient } from './apiClient';

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

  // Get my orders with filters (matches API docs)
  getMyOrders: async (params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }) => {
    try {
      const response = await apiClient.get<{
        status_code: number;
        message: string;
        data: Order[];
      }>('/orders/my');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching my orders:', error);
      throw error;
    }
  },

  // Confirm order received (matches API docs)
  confirmOrderReceived: async (orderId: string) => {
    try {
      const response = await apiClient.post(
        `/orders/${orderId}/confirm-received`,
      );
      return response.data;
    } catch (error) {
      console.error(`Error confirming order ${orderId} received:`, error);
      throw error;
    }
  },

  // Customer confirm order (matches API docs)
  customerConfirmOrder: async (orderId: string) => {
    try {
      const response = await apiClient.post(
        `/orders/${orderId}/customer-confirm`,
      );
      return response.data;
    } catch (error) {
      console.error(`Error confirming order ${orderId}:`, error);
      throw error;
    }
  },
};
