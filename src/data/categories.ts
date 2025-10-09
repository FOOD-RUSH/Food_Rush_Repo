import { FoodCategory } from '@/assets/images';

export interface Category {
  value: string;
  label: string;
  emoji: string;
  image: any;
  color: string;
  description?: string;
}

export const FOOD_CATEGORIES: Category[] = [
  {
    value: 'local-dishes',
    label: 'Local Dishes',
    emoji: '🍲',
    image: FoodCategory.localdish,
    color: '#007AFF',
    description: 'Traditional and regional cuisine',
  },
  {
    value: 'breakfast',
    label: 'Breakfast',
    emoji: '🥞',
    image: FoodCategory.breakfast,
    color: '#007AFF',
    description: 'Morning meals and breakfast items',
  },
  {
    value: 'fastfood',
    label: 'Fast Food',
    emoji: '🍔',
    image: FoodCategory.fastfood,
    color: '#007AFF',
    description: 'Quick service meals and burgers',
  },
  {
    value: 'desserts',
    label: 'Desserts',
    emoji: '🍰',
    image: FoodCategory.dessert,
    color: '#007AFF',
    description: 'Sweet treats and desserts',
  },
  {
    value: 'drinks',
    label: 'Drinks',
    emoji: '🥤',
    image: FoodCategory.drinks,
    color: '#007AFF',
    description: 'Beverages and refreshments',
  },
  {
    value: 'vegetarian',
    label: 'Vegetarian',
    emoji: '🥗',
    image: FoodCategory.vegetarian,
    color: '#007AFF',
    description: 'Plant-based and vegetarian options',
  },
];

// Helper functions
export const getCategoryByValue = (value: string): Category | undefined => {
  return FOOD_CATEGORIES.find((category) => category.value === value);
};

export const getCategoryByLabel = (label: string): Category | undefined => {
  return FOOD_CATEGORIES.find(
    (category) => category.label.toLowerCase() === label.toLowerCase(),
  );
};

export const getAllCategories = (): Category[] => {
  return FOOD_CATEGORIES;
};

export const getCategoryEmoji = (value: string): string => {
  const category = getCategoryByValue(value);
  return category?.emoji || '🍽️';
};

export const getCategoryColor = (value: string): string => {
  const category = getCategoryByValue(value);
  return category?.color || '#666666';
};

export const getCategoryLabel = (value: string): string => {
  const category = getCategoryByValue(value);
  return category?.label || value;
};

// For backward compatibility with existing translation keys
export const CATEGORY_TRANSLATION_MAP: Record<string, string> = {
  'local-dishes': 'category_local_dishes',
  breakfast: 'category_breakfast',
  fastfood: 'category_fast_food',
  desserts: 'category_desserts',
  drinks: 'category_drinks',
  vegetarian: 'category_vegetarian',
};

export const getCategoryTranslationKey = (value: string): string => {
  return CATEGORY_TRANSLATION_MAP[value] || value;
};
