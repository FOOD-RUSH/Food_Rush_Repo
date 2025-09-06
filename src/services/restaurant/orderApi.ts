import { restaurantApiClient } from './apiClient';

export interface OrderItem {
  id: string;
  quantity: number;
  name: string;
  price: number;
  modifications?: string[];
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  total: number;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  time: string;
  paymentMethod: 'credit_card' | 'cash' | 'mobile_payment';
  specialInstructions: string;
  estimatedPrepTime: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderResponse {
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

export const restaurantOrderApi = {
  // Get all orders for the restaurant
  getOrders: (params?: { status?: string; page?: number; limit?: number }) => {
    return restaurantApiClient.get<OrderResponse>('/restaurants/orders', { params });
  },

  // Get order by ID
  getOrderById: (orderId: string) => {
    return restaurantApiClient.get<{ status_code: number; message: string; data: Order }>(`/restaurants/orders/${orderId}`);
  },

  // Update order status
  updateOrderStatus: (data: UpdateOrderStatusRequest) => {
    return restaurantApiClient.put('/restaurants/orders/status', data);
  },

  // Get order statistics
  getOrderStats: () => {
    return restaurantApiClient.get('/restaurants/orders/stats');
  },

  // Accept order
  acceptOrder: (orderId: string) => {
    return restaurantApiClient.put(`/restaurants/orders/${orderId}/accept`);
  },

  // Reject order
  rejectOrder: (orderId: string, reason?: string) => {
    return restaurantApiClient.put(`/restaurants/orders/${orderId}/reject`, { reason });
  },

  // Mark order as ready
  markAsReady: (orderId: string) => {
    return restaurantApiClient.put(`/restaurants/orders/${orderId}/ready`);
  },

  // Mark order as delivered
  markAsDelivered: (orderId: string) => {
    return restaurantApiClient.put(`/restaurants/orders/${orderId}/delivered`);
  },
};