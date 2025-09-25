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
    // Check if we have an image to upload
    if (data.picture) {
      // Use FormData for multipart/form-data request when image is present
      // Following React Native FormData requirements for binary uploads
      const formData = new FormData();

      // Append text fields
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('price', data.price.toString());
      formData.append('category', data.category);
      formData.append('isAvailable', data.isAvailable.toString());

      // Add scheduling times if provided
      if (data.startAt) {
        formData.append('startAt', data.startAt);
      }
      if (data.endAt) {
        formData.append('endAt', data.endAt);
      }

      // Create properly formatted image object for React Native FormData
      // This structure is required for React Native to handle binary uploads correctly
      const imageFile = {
        uri: data.picture.uri, // File URI from image picker
        name: data.picture.name, // Filename with proper extension
        type: data.picture.type, // MIME type: 'image/jpeg' or 'image/png'
      };

      // Append the image file as binary data
      // React Native will automatically handle the binary conversion
      formData.append('picture', imageFile as any);

      console.log('FormData being sent to backend:', {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        isAvailable: data.isAvailable,
        picture: {
          name: data.picture.name,
          type: data.picture.type,
          uri: data.picture.uri.substring(0, 50) + '...',
        },
        startAt: data.startAt || null,
        endAt: data.endAt || null,
        contentType: 'multipart/form-data',
      });

      // Send multipart/form-data request
      // Important: Do NOT set Content-Type manually - let fetch/axios set the boundary
      const response = await apiClient.post<ApiResponse<MenuItem>>(
        `/restaurants/${restaurantId}/menu`,
        formData,
        {
          timeout: 60000, // Increase timeout for file uploads
          headers: {
            // Do NOT set Content-Type manually for FormData
            // axios will automatically set 'multipart/form-data' with proper boundary
            Accept: 'application/json',
          },
        },
      );

      console.log('✅ Menu item created successfully with image:', {
        status: response.status,
        itemId: response.data?.data?.id,
        itemName: response.data?.data?.name,
        hasPicture: !!response.data?.data?.pictureUrl,
      });

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

      console.log('JSON data being sent to backend:', jsonData);

      const response = await apiClient.post<ApiResponse<MenuItem>>(
        `/restaurants/${restaurantId}/menu`,
        jsonData,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );

      console.log('✅ Menu item created successfully without image:', {
        status: response.status,
        itemId: response.data?.data?.id,
        itemName: response.data?.data?.name,
      });

      return response;
    }
  },

  updateMenuItem: (
    restaurantId: string,
    itemId: string,
    data: UpdateMenuItemRequest,
  ) => {
    return apiClient.put(`/restaurants/${restaurantId}/menu/${itemId}`, {
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
