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

<<<<<<< HEAD
  // Get all orders for a customer with filters
  getAllOrders: (customerId: string, filters?: {
=======
  // Get my orders with filters (matches API docs)
  getMyOrders: async (params?: {
>>>>>>> origin/Customer_Setup
    status?: string;
    limit?: number;
    offset?: number;
  }) => {
<<<<<<< HEAD
    return apiClient.get<Order[]>(`/orders/customer/${customerId}`, {
      params: filters
    });
  },

  // Get customer's orders
  getMyOrders: (filters?: {
    status?: string;
    limit?: number;
    offset?: number;
  }) => {
    return apiClient.get<Order[]>(`/orders/my`, {
      params: filters
    });
  },

  // Confirm order received
  confirmOrderReceived: (orderId: string) => {
    return apiClient.post<Order>(`/orders/${orderId}/confirm-received`);
  },

  // Customer confirm order
  customerConfirm: (orderId: string) => {
    return apiClient.post<Order>(`/orders/${orderId}/customer-confirm`);
  },

  // Confirm order
  confirmOrder: (orderId: string) => {
    return apiClient.post<Order>(`/orders/${orderId}/confirm`);
  },

  // Reject order
  rejectOrder: (orderId: string) => {
    return apiClient.post<Order>(`/orders/${orderId}/reject`);
  },

  // Get order history with filters (using my orders endpoint)
  getOrderHistory: (filters?: {
    status?: string;
    limit?: number;
    offset?: number;
  }) => {
    return apiClient.get<Order[]>(`/orders/my`, {
      params: filters
    });
=======
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
>>>>>>> origin/Customer_Setup
  },
};
