import { FoodCategory } from '@/assets/images';
import { CategoryOption } from '@/src/services/shared/categoriesApi';

export interface FoodCategoryProps {
  image: any;
  title: string;
  id: number;
  displayName: string;
  description?: string;
  value?: string;
}

// Updated categories to focus on main food categories for MVP
export const CategoryFilters: FoodCategoryProps[] = [
  {
    id: 1,
    image: FoodCategory.localdish,
    title: 'local-dishes',
    displayName: 'Local Dishes',
    description: 'Traditional local cuisine',
  },
  {
    id: 2,
    image: FoodCategory.breakfast,
    title: 'breakfast',
    displayName: 'Breakfast',
    description: 'Morning meals and breakfast items',
  },
  {
    id: 3,
    image: FoodCategory.fastfood,
    title: 'fast-food',
    displayName: 'Fast Food',
    description: 'Quick service meals',
  },
  {
    id: 4,
    image: FoodCategory.vegetarian,
    title: 'vegetarian',
    displayName: 'Vegetarian',
    description: 'Plant-based dishes',
  },
  {
    id: 5,
    image: FoodCategory.dessert,
    title: 'desserts',
    displayName: 'Desserts',
    description: 'Sweet treats and desserts',
  },
  {
    id: 6,
    image: FoodCategory.drinks,
    title: 'drinks',
    displayName: 'Drinks',
    description: 'Beverages and refreshments',
  },
];

// Extended categories for filtering (same as main categories for now)
export const AllCategories: FoodCategoryProps[] = [...CategoryFilters];

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

// Icon mapping for API categories
const categoryIconMap: Record<string, any> = {
  'local-dishes': FoodCategory.localdish,
  breakfast: FoodCategory.breakfast,
  fastfood: FoodCategory.fastfood,
  'fast-food': FoodCategory.fastfood,
  vegetarian: FoodCategory.vegetarian,
  desserts: FoodCategory.dessert,
  drinks: FoodCategory.drinks,
};

// Function to map API categories to UI categories with icons
export const mapApiCategoriesToUI = (
  apiCategories: CategoryOption[],
): FoodCategoryProps[] => {
  return apiCategories.map((category, index) => ({
    id: index + 1,
    value: category.value,
    title: category.value,
    displayName: category.label,
    image: categoryIconMap[category.value] || FoodCategory.others,
    description: `${category.label} items`,
  }));
};

// Function to get icon for a specific category value
export const getCategoryIcon = (categoryValue: string): any => {
  return categoryIconMap[categoryValue] || FoodCategory.localdish;
};
