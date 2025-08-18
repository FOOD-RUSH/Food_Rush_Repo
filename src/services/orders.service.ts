import { Order } from '../types';
import { apiClient } from './customer/apiClient';

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

  // Get all orders for a customer
  getAllOrders: (customerId: string) => {
    return apiClient.get<Order[]>(`/orders/customer/${customerId}`);
  },

  // Cancel an order
  cancelOrder: (orderId: string) => {
    return apiClient.patch<Order>(`/orders/${orderId}/cancel`, {});
  },

  // Update order status
  updateOrderStatus: (orderId: string, data: UpdateOrderStatusRequest) => {
    return apiClient.patch<Order>(`/orders/${orderId}/status`, data);
  },

  // Get order tracking information
  getOrderTracking: (orderId: string) => {
    return apiClient.get<any>(`/orders/${orderId}/tracking`);
  },

  // Add rating and review to order
  addOrderReview: (orderId: string, reviewData: { rating: number; comment: string }) => {
    return apiClient.post<void>(`/orders/${orderId}/review`, reviewData);
  },

  // Get order receipt
  getOrderReceipt: (orderId: string) => {
    return apiClient.get<any>(`/orders/${orderId}/receipt`);
  },

  // Get order history with filters
  getOrderHistory: (customerId: string, filters?: { 
    status?: Order['status']; 
    limit?: number; 
    page?: number 
  }) => {
    return apiClient.get<Order[]>(`/orders/customer/${customerId}/history`, {
      params: filters
    });
  },
};
