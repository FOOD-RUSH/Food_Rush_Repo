import { restaurantApiClient } from './apiClient';
import { FoodCategory } from '../../types/MenuItem';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: FoodCategory;
  imageUrl?: string;
  isAvailable: boolean;
  startAt?: string; // ISO 8601 format
  endAt?: string;   // ISO 8601 format
  preparationTime?: number;
  allergens?: string[];
  createdAt: string;
  updatedAt: string;
}

interface MenuItems {
  data : MenuItems
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
  price: number; // Changed from string to number
  category: FoodCategory;
  isAvailable: boolean;
  picture?: string; // Binary string (jpg or png image file)
  startAt?: string; // ISO 8601 format for daily scheduling
  endAt?: string;   // ISO 8601 format for daily scheduling
}

export interface UpdateMenuItemRequest extends Partial<CreateMenuItemRequest> {
  isAvailable?: boolean;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  imageUrl?: string;
  sortOrder?: number;
}

export interface MenuStats {
  totalItems: number;
  totalCategories: number;
  activeItems: number;
  inactiveItems: number;
}

export const restaurantMenuApi = {
  // Menu Items for specific restaurant
  getMenuItems: (restaurantId: string, params?: { categoryId?: string; isAvailable?: boolean; page?: number; limit?: number }) => {
    return restaurantApiClient.get<MenuItems>(`/restauants/${restaurantId}/menu`, { params:{ ...params} });
  },

  getMenuItemById: (itemId: string) => {
    return restaurantApiClient.get<MenuItem>(`/menu-item/${itemId}`);
  },

  createMenuItem: (restaurantId: string, data: CreateMenuItemRequest) => {
    return restaurantApiClient.post(`/restaurants/${restaurantId}/menu`, {...data});
  },

  updateMenuItem: (restaurantId: string, itemId: string, data: UpdateMenuItemRequest) => {
    return restaurantApiClient.put(`/restauant/${restaurantId}/menu/${itemId}`, {...data});
  },

  deleteMenuItem: (restaurantId: string, itemId: string) => {
    return restaurantApiClient.delete(`/restauant/${restaurantId}/menu/${itemId}`);
  },

  toggleMenuItemAvailability: (restaurantId: string, itemId: string, isAvailable: boolean) => {
    return restaurantApiClient.put(`/restauant/${restaurantId}/menu/${itemId}`, { isAvailable });
  },

  // Upload menu item picture
  uploadMenuItemPicture: (restaurantId: string, formData: FormData) => {
    return restaurantApiClient.post(`/restauant/${restaurantId}/menu/picture`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  

  // Image upload
  uploadImage: (formData: FormData) => {
    return restaurantApiClient.post('/uploads/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Legacy category methods (keeping for compatibility, but may not be used with new API)
  // to be added in backend 
  // TODO 
  getCategories: (params?: { isActive?: boolean; page?: number; limit?: number }) => {
    return restaurantApiClient.get('/restaurants/menu/categories', { params });
  },

  getCategoryById: (categoryId: string) => {
    return restaurantApiClient.get(`/restaurants/menu/categories/${categoryId}`);
  },

  createCategory: (data: CreateCategoryRequest) => {
    return restaurantApiClient.post('/restaurants/menu/categories', data);
  },

  updateCategory: (categoryId: string, data: Partial<CreateCategoryRequest & { isActive: boolean }>) => {
    return restaurantApiClient.put(`/restaurants/menu/categories/${categoryId}`, data);
  },

  deleteCategory: (categoryId: string) => {
    return restaurantApiClient.delete(`/restaurants/menu/categories/${categoryId}`);
  },

  // Menu Statistics
  getMenuStats: () => {
    return restaurantApiClient.get('/restaurants/menu/stats');
  },

  // Bulk operations
  bulkUpdateItems: (updates: Array<{ id: string; data: UpdateMenuItemRequest }>) => {
    return restaurantApiClient.put('/restaurants/menu/items/bulk', { updates });
  },

  // Menu Settings
  getMenuSettings: () => {
    return restaurantApiClient.get('/restaurants/menu/settings');
  },

  updateMenuSettings: (settings: any) => {
    return restaurantApiClient.put('/restaurants/menu/settings', settings);
  },
};