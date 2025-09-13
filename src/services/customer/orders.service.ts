import { Order } from '@/src/types/index';
import { apiClient } from './apiClient';

// Order creation request
export interface CreateOrderRequest {
  restaurantId: string;
  items: {
    menuItemId: string;
    quantity: number;
    price: number;
  }[];
  deliveryAddress: {
    label: string;
    fullAddress: string;
    latitude?: number;
    longitude?: number;
  };
  paymentMethod: 'mtn_mobile_money' | 'orange_money';
  totalAmount: number;
  specialInstructions?: string;
}

// Order status update
export interface UpdateOrderStatusRequest {
  status: Order['status'];
}

export const OrderApi = {
  // Create a new order
  createOrder: (orderData: CreateOrderRequest) => {
    return apiClient.post<Order>('/orders', orderData);
  },

  // Get order by ID
  getOrderById: (orderId: string) => {
    return apiClient.get<Order>(`/orders/${orderId}`);
  },

  // Get all orders for a customer with filters
  getAllOrders: (customerId: string, filters?: {
    status?: string;
    limit?: number;
    offset?: number;
  }) => {
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
  },
};
