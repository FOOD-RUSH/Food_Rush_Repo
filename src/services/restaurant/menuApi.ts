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

      // Append text fields exactly as backend expects them
      formData.append('name', data.name);
      if (data.description) {
        formData.append('description', data.description);
      }
      // Backend expects price as string, so convert number to string
      formData.append('price', data.price.toString());
      formData.append('category', data.category);
      formData.append('isAvailable', data.isAvailable.toString());

      if (data.startAt) {
        formData.append('startAt', data.startAt);
      }
      if (data.endAt) {
        formData.append('endAt', data.endAt);
      }

      // FIXED: Add image file properly - React Native expects this exact format
      if (data.picture) {
        // React Native FormData expects this specific object structure
        const imageFile = {
          uri: data.picture.uri,
          name: data.picture.name,
          type: data.picture.type,
        };

        // Use 'picture' as the field name to match backend API
        formData.append('picture', imageFile as any);
      }

      // Log what we're sending

      const response = await apiClient.post<ApiResponse<MenuItem>>(
        `/restaurants/${restaurantId}/menu`,
        formData,
        {
          // Don't set Content-Type for FormData - let axios handle it
          // The apiClient will automatically set the proper Content-Type with boundary
          headers: {
            Accept: 'application/json',
          },
          timeout: 30000, // 30 seconds timeout for file upload
        },
      );

      // Log successful response

      return response;
    } catch (error: any) {
      // Log error response from backend

      throw error;
    }
  },

  updateMenuItem: async (
    restaurantId: string,
    itemId: string,
    data: UpdateMenuItemRequest,
  ) => {
    try {
      // Check if we have a picture to upload
      if (data.picture && data.picture.uri && data.picture.name && data.picture.type) {
        // Use FormData for requests with image uploads
        const formData = new FormData();

        // Append text fields
        if (data.name !== undefined) {
          formData.append('name', data.name);
        }
        if (data.description !== undefined) {
          formData.append('description', data.description);
        }
        if (data.price !== undefined) {
          formData.append('price', data.price.toString());
        }
        if (data.category !== undefined) {
          formData.append('category', data.category);
        }
        if (data.isAvailable !== undefined) {
          formData.append('isAvailable', data.isAvailable.toString());
        }
        if (data.startAt !== undefined) {
          formData.append('startAt', data.startAt);
        }
        if (data.endAt !== undefined) {
          formData.append('endAt', data.endAt);
        }

        // Add the image file
        const imageFile = {
          uri: data.picture.uri,
          name: data.picture.name,
          type: data.picture.type,
        };
        formData.append('picture', imageFile as any);

        return await apiClient.patch(
          `/restaurants/${restaurantId}/menu/${itemId}`,
          formData,
          {
            headers: {
              Accept: 'application/json',
            },
            timeout: 30000, // 30 seconds timeout for file upload
          },
        );
      } else {
        // Use JSON for requests without image uploads
        const jsonData: any = {};
        
        // Only include fields that are defined (not undefined)
        if (data.name !== undefined) jsonData.name = data.name;
        if (data.description !== undefined) jsonData.description = data.description;
        if (data.price !== undefined) jsonData.price = data.price;
        if (data.category !== undefined) jsonData.category = data.category;
        if (data.isAvailable !== undefined) jsonData.isAvailable = data.isAvailable;
        if (data.startAt !== undefined) jsonData.startAt = data.startAt;
        if (data.endAt !== undefined) jsonData.endAt = data.endAt;

        return await apiClient.patch(
          `/restaurants/${restaurantId}/menu/${itemId}`,
          jsonData,
        );
      }
    } catch (error: any) {
      console.error('❌ Error updating menu item:', error);
      throw error;
    }
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
