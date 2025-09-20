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

// Alternative interface for JSON-only requests (without image)
export interface CreateMenuItemJsonRequest {
  name: string;
  description: string;
  price: number;
  category: FoodCategory;
  isAvailable: boolean;
  startAt?: string;
  endAt?: string;
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

  createMenuItem: async (restaurantId: string, data: CreateMenuItemRequest) => {
    // Check if we have an image to upload
    if (data.picture) {
      // Use FormData for multipart/form-data request when image is present
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('price', data.price.toString());
      formData.append('category', data.category);
      formData.append('isAvailable', data.isAvailable.toString());
      
      // Send image as binary file (JPG/PNG) as required by backend
      // Create a proper file object for React Native with binary format
      const imageFile = {
        uri: data.picture.uri,
        type: data.picture.type, // 'image/jpeg' or 'image/png'
        name: data.picture.name,
      };
      
      // Append the image file as binary data
      formData.append('picture', imageFile as any);
      
      // Add scheduling times if provided
      if (data.startAt) {
        formData.append('startAt', data.startAt);
      }
      if (data.endAt) {
        formData.append('endAt', data.endAt);
      }
      
      console.log('Form data being sent to backend:', {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        isAvailable: data.isAvailable,
        picture: {
          name: data.picture.name,
          type: data.picture.type,
          uri: data.picture.uri.substring(0, 50) + '...'
        },
        startAt: data.startAt || null,
        endAt: data.endAt || null
      });
      
      const response = await apiClient.post<ApiResponse<MenuItem>>(`/restaurants/${restaurantId}/menu`, formData, {
        timeout: 60000, // Increase timeout for file uploads
        headers: {
          // Let axios set the Content-Type with proper boundary for multipart/form-data
        },
      });
      
      console.log('Response from backend:', response.data);
      return response;
    } else {
      // Use JSON for regular requests without image
      const jsonData = {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        isAvailable: data.isAvailable,
        ...(data.startAt && { startAt: data.startAt }),
        ...(data.endAt && { endAt: data.endAt }),
      };
      
      console.log('Form data being sent to backend:', jsonData);
      
      const response = await apiClient.post<ApiResponse<MenuItem>>(`/restaurants/${restaurantId}/menu`, jsonData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response from backend:', response.data);
      return response;
    }
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