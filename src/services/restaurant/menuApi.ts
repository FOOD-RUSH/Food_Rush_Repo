import { apiClient } from '@/src/services/shared/apiClient';
import { FoodCategory } from '../../types/MenuItem';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: FoodCategory;
  pictureUrl?: string;
  isAvailable: boolean;
  startAt?: string; // ISO 8601 format
  endAt?: string;   // ISO 8601 format
  createdAt?: string;
  updatedAt?: string;
  restaurant?: {
    id: string;
    name: string;
    address: string;
    phone?: string;
    isOpen: boolean;
    latitude?: number;
    longitude?: number;
    verificationStatus: string;
    documentUrl?: string;
    rating?: number;
    ratingCount: number;
    ownerId: string;
    menuMode: string;
    timezone: string;
    deliveryBaseFee?: number;
    deliveryPerKmRate?: number;
    deliveryMinFee?: number;
    deliveryMaxFee?: number;
    deliveryFreeThreshold?: number;
    deliverySurgeMultiplier?: number;
    createdAt: string;
    updatedAt: string;
  };
}

export interface MenuItems {
  data: MenuItem[];
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Updated to match backend API requirements
export interface CreateMenuItemRequest {
  name: string;
  description: string;
  price: number;
  category: FoodCategory;
  isAvailable: boolean;
  picture?: {
    uri: string;
    type: string;
    name: string;
  }; // File object for FormData
  startAt?: string; // ISO 8601 format for daily scheduling
  endAt?: string;   // ISO 8601 format for daily scheduling
}

export interface UpdateMenuItemRequest extends Partial<CreateMenuItemRequest> {
  isAvailable?: boolean;
}

export interface MenuStats {
  totalItems: number;
  totalCategories: number;
  activeItems: number;
  inactiveItems: number;
}

// API response wrapper interface
interface ApiResponse<T> {
  status_code: number;
  message: string;
  data: T;
}

export const restaurantMenuApi = {
  // Menu Items for specific restaurant
  getMenuItems: (restaurantId: string, category?: string) => {
    return apiClient.get<MenuItems>(`/restaurants/${restaurantId}/menu`, { 
      params: category ? { category } : {} 
    });
  },

  getMenuItemById: (itemId: string) => {
    return apiClient.get<MenuItem>(`/menu-items/${itemId}`);
  },

  createMenuItem: (restaurantId: string, data: CreateMenuItemRequest) => {
    console.log('API Call - Creating menu item:', {
      restaurantId,
      name: data.name,
      price: data.price,
      category: data.category,
      hasImage: !!data.picture
    });
    
    // Prepare form data for multipart/form-data request
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('category', data.category);
    formData.append('isAvailable', data.isAvailable.toString());
    
    // Add image if provided
    if (data.picture) {
      console.log('Adding image to form data:', {
        uri: data.picture.uri,
        type: data.picture.type,
        name: data.picture.name
      });
      
      // For React Native, append the file object directly
      formData.append('picture', {
        uri: data.picture.uri,
        type: data.picture.type,
        name: data.picture.name,
      } as any);
    }
    
    // Add scheduling times if provided
    if (data.startAt) {
      formData.append('startAt', data.startAt);
    }
    if (data.endAt) {
      formData.append('endAt', data.endAt);
    }
    
    console.log('Sending FormData to API:', {
      restaurantId,
      hasImage: !!data.picture,
      hasSchedule: !!(data.startAt && data.endAt)
    });
    
    return apiClient.post<ApiResponse<MenuItem>>(`/restaurants/${restaurantId}/menu`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  updateMenuItem: (restaurantId: string, itemId: string, data: UpdateMenuItemRequest) => {
    return apiClient.put(`/restaurants/${restaurantId}/menu/${itemId}`, { ...data });
  },

  deleteMenuItem: (restaurantId: string, itemId: string) => {
    return apiClient.delete(`/restaurants/${restaurantId}/menu/${itemId}`);
  },

  toggleMenuItemAvailability: (restaurantId: string, itemId: string, isAvailable: boolean) => {
    return apiClient.patch(`/restaurants/${restaurantId}/menu/${itemId}/availability`, { isAvailable });
  },
};