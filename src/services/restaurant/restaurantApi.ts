import { apiClient } from '@/src/services/shared/apiClient';

export interface RestaurantProfile {
  id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  region: string;
  postalCode?: string;
  country: string;
  latitude?: number;
  longitude?: number;
  phone: string;
  email: string;
  website?: string;
  cuisineType: string[];
  deliveryRadius: number;
  isActive: boolean;
  isVerified: boolean;
  rating: number;
  totalReviews: number;
  openingHours: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  imageUrl?: string;
  bannerUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  averagePreparationTime: number;
  cancellationRate: number;
  customerSatisfaction: number;
  orderAccuracy: number;
  repeatCustomers: number;
  todayOrders: number;
  todayRevenue: number;
  weeklyOrders: number[];
  monthlyRevenue: number[];
  topCategories: {
    name: string;
    orders: number;
    percentage: number;
    color: string;
  }[];
  paymentMethods: {
    method: string;
    percentage: number;
    color: string;
  }[];
}

export interface UpdateRestaurantRequest {
  name?: string;
  description?: string;
  address?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  website?: string;
  cuisineType?: string[];
  deliveryRadius?: number;
  openingHours?: RestaurantProfile['openingHours'];
}

export interface NotificationItem {
  id: string;
  type: 'order' | 'system' | 'promotion' | 'alert';
  title: string;
  message: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  orderId?: string;
  createdAt: string;
  data?: any;
}

export const restaurantApi = {
  // Get restaurant details by ID
  getRestaurantById: (restaurantId: string) => {
    return apiClient.get(`/restaurants/${restaurantId}`);
  },

  updateLocation: (
    restaurantId: string,
    data: { latitude?: number; longitude?: number },
  ) => {
    return apiClient.patch(`/restaurants/${restaurantId}/location`, {
      ...data,
    });
  },

  toggleStatus: (isOpen: boolean, restaurantId: string) => {
    return apiClient.patch(`/restaurants/${restaurantId}/status`, {
      isOpen: isOpen,
    });
  },

  // Analytics
  getStats: (period?: 'today' | 'yesterday' | '7days' | '30days') => {
    return apiClient.get<{
      status_code: number;
      message: string;
      data: RestaurantStats;
    }>('/restaurants/analytics/stats', {
      params: { period },
    });
  },

  getBestSellers: (period?: string) => {
    return apiClient.get('/restaurants/analytics/bestsellers', {
      params: { period },
    });
  },

  getTimeHeatmap: (period?: string) => {
    return apiClient.get('/restaurants/analytics/heatmap', {
      params: { period },
    });
  },
};
