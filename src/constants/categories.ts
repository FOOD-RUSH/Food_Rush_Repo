import { CategoryOption } from '@/src/services/shared/categoriesApi';

export interface FoodCategoryProps {
  title: string;
  id: number;
  displayName: string;
  description?: string;
  value?: string;
  emoji: string;
  color: string;
}

// Updated categories to focus on main food categories for MVP
export const CategoryFilters: FoodCategoryProps[] = [
  {
    id: 1,
    title: 'local-dishes',
    displayName: 'Local Dishes',
    description: 'Traditional local cuisine',
    emoji: '🍲',
    color: '#FF6B6B',
  },
  {
    id: 2,
    title: 'breakfast',
    displayName: 'Breakfast',
    description: 'Morning meals and breakfast items',
    emoji: '🥞',
    color: '#4ECDC4',
  },
  {
    id: 3,
    title: 'fast-food',
    displayName: 'Fast Food',
    description: 'Quick service meals',
    emoji: '🍔',
    color: '#FFD93D',
  },
  {
    id: 4,
    title: 'vegetarian',
    displayName: 'Vegetarian',
    description: 'Plant-based dishes',
    emoji: '🥗',
    color: '#6BCF7F',
  },
  {
    id: 5,
    title: 'desserts',
    displayName: 'Desserts',
    description: 'Sweet treats and desserts',
    emoji: '🍰',
    color: '#FF8FB1',
  },
  {
    id: 6,
    title: 'drinks',
    displayName: 'Drinks',
    description: 'Beverages and refreshments',
    emoji: '🥤',
    color: '#A8DADC',
  },
];

// Extended categories for filtering (same as main categories for now)
export const AllCategories: FoodCategoryProps[] = [
  ...CategoryFilters,
];

// Helper function to get category by title
export const getCategoryByTitle = (
  title: string,
): FoodCategoryProps | undefined => {
  return AllCategories.find((category) => category.title === title);
};

// Helper function to get main categories for home screen
export const getMainCategories = (): FoodCategoryProps[] => {
  return CategoryFilters;
};

// Helper function to get all categories for filtering
export const getAllCategories = (): FoodCategoryProps[] => {
  return AllCategories;
};

// Emoji mapping for API categories
const categoryEmojiMap: Record<string, string> = {
  'local-dishes': '🍲',
  breakfast: '🥞',
  fastfood: '🍔',
  'fast-food': '🍔',
  vegetarian: '🥗',
  desserts: '🍰',
  drinks: '🥤',
};

// Color mapping for API categories
const categoryColorMap: Record<string, string> = {
  'local-dishes': '#FF6B6B',
  breakfast: '#4ECDC4',
  fastfood: '#FFD93D',
  'fast-food': '#FFD93D',
  vegetarian: '#6BCF7F',
  desserts: '#FF8FB1',
  drinks: '#A8DADC',
};

// Function to map API categories to UI categories with emojis
export const mapApiCategoriesToUI = (
  apiCategories: CategoryOption[],
): FoodCategoryProps[] => {
  return apiCategories.map((category, index) => ({
    id: index + 1,
    value: category.value,
    title: category.value,
    displayName: category.label,
    emoji: categoryEmojiMap[category.value] || '🍽️',
    color: categoryColorMap[category.value] || '#999999',
    description: `${category.label} items`,
  }));
};

// Function to get emoji for a specific category value
export const getCategoryEmoji = (categoryValue: string): string => {
  return categoryEmojiMap[categoryValue] || '🍽️';
};

// Function to get color for a specific category value
export const getCategoryColor = (categoryValue: string): string => {
  return categoryColorMap[categoryValue] || '#999999';
};
