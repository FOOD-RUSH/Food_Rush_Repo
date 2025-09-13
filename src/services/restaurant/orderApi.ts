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
  getOrders: (params?: { status?: string; limit?: number; offset?: number }) => {
    return restaurantApiClient.get<OrderResponse>('/orders/my-restaurant', { params });
  },

  // Get orders for a specific restaurant
  getOrdersByRestaurantId: (restaurantId: string) => {
    return restaurantApiClient.get<OrderResponse>(`/orders/restaurant/${restaurantId}`);
  },

  // Get order by ID
  getOrderById: (orderId: string) => {
    return restaurantApiClient.get<{ status_code: number; message: string; data: Order }>(`/orders/${orderId}`);
  },

  // Confirm order
  confirmOrder: (orderId: string) => {
    return restaurantApiClient.post(`/orders/${orderId}/confirm`);
  },

  // Reject order
  rejectOrder: (orderId: string) => {
    return restaurantApiClient.post(`/orders/${orderId}/reject`);
  },

  // Get all orders (general endpoint)
  getAllOrders: () => {
    return restaurantApiClient.get<OrderResponse>('/orders');
  },
};