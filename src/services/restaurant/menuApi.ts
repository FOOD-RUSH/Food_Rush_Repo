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
   createdAt?: string;
}
interface OrderStatus {
  category: 'pending' | 'preparing' | 'ready_for_pickup' | 'delivered' | 'cancelled';
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

// Removed CreateCategoryRequest - backend only returns categories

export interface MenuStats {
  totalItems: number;
  totalCategories: number;
  activeItems: number;
  inactiveItems: number;
}

export const restaurantMenuApi = {
  // Menu Items for specific restaurant
  getMenuItems: (restaurantId: string, category: string) => {
    return apiClient.get<MenuItems>(`/restaurants/${restaurantId}/menu`, { params: category ? { category } : {}    });
  },

  getMenuItemById: (itemId: string) => {
    return apiClient.get<MenuItem>(`/menu-items/${itemId}`);
  },

  createMenuItem: (restaurantId: string, data: CreateMenuItemRequest) => {
    return apiClient.post(`/restaurants/${restaurantId}/menu`, {...data});
  },

  updateMenuItem: (restaurantId: string, itemId: string, data: UpdateMenuItemRequest) => {
    return apiClient.put(`/restauants/${restaurantId}/menu/${itemId}`, {...data});
  },

  deleteMenuItem: (restaurantId: string, itemId: string) => {
    return apiClient.delete(`/restauants/${restaurantId}/menu/${itemId}`);
  },

  toggleMenuItemAvailability: (restaurantId: string, itemId: string, isAvailable: boolean) => {
    return apiClient.patch(`/restaurants/${restaurantId}/menu/${itemId}/availability`, { isAvailable });
  },

  


};
