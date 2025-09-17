import { FoodCategory } from '@/assets/images';
import { CategoryItem } from '@/src/services/customer/restaurant.service';

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
    image: FoodCategory.bread,
    title: 'local-dishes',
    displayName: 'Local Dishes',
    description: 'Traditional local cuisine',
  },
  {
    id: 2,
    image: FoodCategory.french_fries,
    title: 'snacks',
    displayName: 'Snacks',
    description: 'Quick bites and finger foods',
  },
  {
    id: 3,
    image: FoodCategory.drink,
    title: 'drinks',
    displayName: 'Drinks',
    description: 'Beverages and refreshments',
  },
  {
    id: 4,
    image: FoodCategory.pancakes,
    title: 'breakfast',
    displayName: 'Breakfast',
    description: 'Morning meals and breakfast items',
  },
  {
    id: 5,
    image: FoodCategory.burger,
    title: 'fast-food',
    displayName: 'Fast Food',
    description: 'Quick service meals',
  },
];

// Extended categories for filtering (includes all original categories)
export const AllCategories: FoodCategoryProps[] = [
  ...CategoryFilters,
  {
    id: 6,
    image: FoodCategory.vegetable,
    title: 'vegetable',
    displayName: 'Vegetables',
    description: 'Fresh vegetables and salads',
  },
  {
    id: 7,
    image: FoodCategory.pizza,
    title: 'pizza',
    displayName: 'Pizza',
    description: 'Italian pizza varieties',
  },
  {
    id: 8,
    image: FoodCategory.desert,
    title: 'dessert',
    displayName: 'Desserts',
    description: 'Sweet treats and desserts',
  },
  {
    id: 9,
    image: FoodCategory.meat,
    title: 'meat',
    displayName: 'Meat',
    description: 'Meat dishes and proteins',
  },
  {
    id: 10,
    image: FoodCategory.noodles,
    title: 'noodles',
    displayName: 'Noodles',
    description: 'Pasta and noodle dishes',
  },
];

// Helper function to get category by title
export const getCategoryByTitle = (title: string): FoodCategoryProps | undefined => {
  return AllCategories.find(category => category.title === title);
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
  'local-dishes': FoodCategory.bread,
  'breakfast': FoodCategory.pancakes,
  'fastfood': FoodCategory.burger,
  'fast-food': FoodCategory.burger,
  'vegetarian': FoodCategory.vegetable,
  'desserts': FoodCategory.desert,
  'snacks': FoodCategory.french_fries,
  'drinks': FoodCategory.drink,
  'pizza': FoodCategory.pizza,
  'meat': FoodCategory.meat,
  'noodles': FoodCategory.noodles,
  'salad': FoodCategory.salad,
  'sandwich': FoodCategory.sandwich,
  'taco': FoodCategory.taco,
  'ice-cream': FoodCategory.ice_cream,
  'cheese': FoodCategory.cheese,
  'croissant': FoodCategory.croissant,
};

// Function to map API categories to UI categories with icons
export const mapApiCategoriesToUI = (apiCategories: CategoryItem[]): FoodCategoryProps[] => {
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
  return categoryIconMap[categoryValue] || FoodCategory.others;
};