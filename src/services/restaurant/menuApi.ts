import { restaurantApiClient } from './apiClient';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl?: string;
  isAvailable: boolean;
  preparationTime?: number;
  allergens?: string[];
  createdAt: string;
  updatedAt: string;
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

export interface CreateMenuItemRequest {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl?: string;
  preparationTime?: number;
  allergens?: string[];
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
  // Menu Items
  getMenuItems: (params?: { categoryId?: string; isAvailable?: boolean; page?: number; limit?: number }) => {
    return restaurantApiClient.get('/restaurants/menu/items', { params });
  },

  getMenuItemById: (itemId: string) => {
    return restaurantApiClient.get(`/restaurants/menu/items/${itemId}`);
  },

  createMenuItem: (data: CreateMenuItemRequest) => {
    return restaurantApiClient.post('/restaurants/menu/items', data);
  },

  updateMenuItem: (itemId: string, data: UpdateMenuItemRequest) => {
    return restaurantApiClient.put(`/restaurants/menu/items/${itemId}`, data);
  },

  deleteMenuItem: (itemId: string) => {
    return restaurantApiClient.delete(`/restaurants/menu/items/${itemId}`);
  },

  toggleMenuItemAvailability: (itemId: string, isAvailable: boolean) => {
    return restaurantApiClient.put(`/restaurants/menu/items/${itemId}/availability`, { isAvailable });
  },

  // Categories
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