<<<<<<< HEAD
// Food categories available in the system
export type FoodCategory = 
  | 'local-dishes'
  | 'breakfast'
  | 'fastfood'
  | 'desserts'
  | 'snacks'
  | 'drinks';

// Category display names for UI
export const FOOD_CATEGORIES: Record<FoodCategory, string> = {
  'local-dishes': 'Local Dishes',
  'breakfast': 'Breakfast',
  'fastfood': 'Fast Food',
  'desserts': 'Desserts',
  'snacks': 'Snacks',
  'drinks': 'Drinks'
};

// French translations for categories
export const FOOD_CATEGORIES_FR: Record<FoodCategory, string> = {
  'local-dishes': 'Plats Locaux',
  'breakfast': 'Petit-déjeuner',
  'fastfood': 'Restauration Rapide',
  'desserts': 'Desserts',
  'snacks': 'Collations',
  'drinks': 'Boissons'
};

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: FoodCategory;
  image?: string;
  isAvailable: boolean;
  startAt?: string; // ISO 8601 format
  endAt?: string;   // ISO 8601 format
  createdAt?: string;
  updatedAt?: string;
}

// Request interface for creating menu items
export interface CreateMenuItemRequest {
  name: string;
  description: string;
  price: number;
  category: FoodCategory;
  isAvailable: boolean;
  picture?: string; // Base64 encoded image or file path
  startAt?: string; // ISO 8601 format
  endAt?: string;   // ISO 8601 format
}
=======
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
}
>>>>>>> origin/Customer_Setup
