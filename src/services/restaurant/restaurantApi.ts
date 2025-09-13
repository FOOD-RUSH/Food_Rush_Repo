import { restaurantApiClient } from './apiClient';

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
  // Restaurant Profile
  getProfile: () => {
    return restaurantApiClient.get<{ status_code: number; message: string; data: RestaurantProfile }>('/restaurants/profile');
  },

  updateProfile: (data: UpdateRestaurantRequest) => {
    return restaurantApiClient.put<{ status_code: number; message: string; data: RestaurantProfile }>('/restaurants/profile', data);
  },

  updateLocation: (data: {
    address: string;
    city: string;
    region?: string;
    postalCode?: string;
    country: string;
    latitude?: number;
    longitude?: number;
    deliveryRadius: number;
  }) => {
    return restaurantApiClient.put('/restaurants/location', data);
  },

  updateStatus: (restaurantId: string, status: 'online' | 'offline' | 'busy') => {
    return restaurantApiClient.patch(`/restaurants/${restaurantId}/status`, { status });
  },

  toggleStatus: (isActive: boolean) => {
    return restaurantApiClient.put('/restaurants/status', { isActive });
  },

  // Analytics
  getStats: (period?: 'today' | 'yesterday' | '7days' | '30days') => {
    return restaurantApiClient.get<{ status_code: number; message: string; data: RestaurantStats }>('/restaurants/analytics/stats', {
      params: { period }
    });
  },

  getBestSellers: (period?: string) => {
    return restaurantApiClient.get('/restaurants/analytics/bestsellers', {
      params: { period }
    });
  },

  getTimeHeatmap: (period?: string) => {
    return restaurantApiClient.get('/restaurants/analytics/heatmap', {
      params: { period }
    });
  },

  // Notifications
  getNotifications: (params?: { type?: string; isRead?: boolean; limit?: number; offset?: number }) => {
    return restaurantApiClient.get<{ status_code: number; message: string; data: { notifications: NotificationItem[]; total: number } }>('/restaurants/notifications', { params });
  },

  markNotificationAsRead: (notificationId: string) => {
    return restaurantApiClient.put(`/restaurants/notifications/${notificationId}/read`);
  },

  markAllNotificationsAsRead: () => {
    return restaurantApiClient.put('/restaurants/notifications/mark-all-read');
  },

  // Settings
  getSettings: () => {
    return restaurantApiClient.get('/restaurants/settings');
  },

  updateSettings: (settings: {
    language?: string;
    currency?: string;
    timezone?: string;
    notifications?: {
      orders?: boolean;
      promotions?: boolean;
      system?: boolean;
    };
  }) => {
    return restaurantApiClient.put('/restaurants/settings', settings);
  },

  // Image Upload
  uploadImage: (formData: FormData, type: 'profile' | 'banner' | 'menu') => {
    return restaurantApiClient.post(`/restaurants/upload/${type}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Location Services
  getCurrentLocation: () => {
    // This would integrate with your location service
    return restaurantApiClient.get('/restaurants/location/current');
  },

  searchNearbyPlaces: (query: string, latitude: number, longitude: number) => {
    return restaurantApiClient.get('/restaurants/location/nearby', {
      params: { query, latitude, longitude }
    });
  },

  validateAddress: (address: string) => {
    return restaurantApiClient.post('/restaurants/location/validate', { address });
  },
};