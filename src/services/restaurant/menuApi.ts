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
  endAt?: string; // ISO 8601 format
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

// Updated to match backend API requirements and React Native FormData standards
export interface CreateMenuItemRequest {
  name: string;
  description: string;
  price: number;
  category: FoodCategory;
  isAvailable: boolean;
  picture?: {
    uri: string; // File URI from image picker (file://, content://, ph://)
    type: string; // MIME type: 'image/jpeg' or 'image/png' only
    name: string; // Filename with proper extension (.jpg or .png)
  }; // File object for FormData - matches React Native requirements
  startAt?: string; // ISO 8601 format for daily scheduling
  endAt?: string; // ISO 8601 format for daily scheduling
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
      params: category ? { category } : {},
    });
  },

  getMenuItemById: (itemId: string) => {
    return apiClient.get<MenuItem>(`/menu-items/${itemId}`);
  },

  createMenuItem: async (restaurantId: string, data: CreateMenuItemRequest) => {
  try {
    // Always use FormData approach
    const formData = new FormData();

    // Append text fields
    formData.append('name', data.name);
    if (data.description) {
      formData.append('description', data.description);
    }
    formData.append('price', data.price.toString());
    formData.append('category', data.category);
    formData.append('isAvailable', data.isAvailable.toString());

    if (data.startAt) {
      formData.append('startAt', data.startAt);
    }
    if (data.endAt) {
      formData.append('endAt', data.endAt);
    }

    // Add image (required)
    const imageFile = {
      uri: data.picture.uri,
      name: data.picture.name,
      type: data.picture.type,
    };
    formData.append('picture', imageFile as any);

    // Log what we're sending
    console.log('Sending to backend:', {
      restaurantId,
      url: `/restaurants/${restaurantId}/menu`,
      fields: {
        name: data.name,
        description: data.description || null,
        price: data.price.toString(),
        category: data.category,
        isAvailable: data.isAvailable.toString(),
        startAt: data.startAt || null,
        endAt: data.endAt || null,
        hasPicture: true,
        pictureDetails: {
          name: data.picture.name,
          type: data.picture.type,
          uri: data.picture.uri.substring(0, 50) + '...'
        }
      }
    });

    const response = await apiClient.post<ApiResponse<MenuItem>>(
      `/restaurants/${restaurantId}/menu`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
        timeout: 30000,
      }
    );

    // Log successful response
    console.log('SUCCESS RESPONSE FROM BACKEND:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers
    });

    return response;

  } catch (error: any) {
    // Log error response from backend
    console.log('ERROR RESPONSE FROM BACKEND:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data,
      responseHeaders: error.response?.headers,
      requestUrl: error.config?.url,
      requestMethod: error.config?.method,
      fullError: error
    });

    throw error;
  }
},

  updateMenuItem: (
    restaurantId: string,
    itemId: string,
    data: UpdateMenuItemRequest,
  ) => {
    return apiClient.patch(`/restaurants/${restaurantId}/menu/${itemId}`, {
      ...data,
    });
  },

  deleteMenuItem: (restaurantId: string, itemId: string) => {
    return apiClient.delete(`/restaurants/${restaurantId}/menu/${itemId}`);
  },

  toggleMenuItemAvailability: (
    restaurantId: string,
    itemId: string,
    isAvailable: boolean,
  ) => {
    return apiClient.patch(
      `/restaurants/${restaurantId}/menu/${itemId}/availability`,
      { isAvailable },
    );
  },
};
