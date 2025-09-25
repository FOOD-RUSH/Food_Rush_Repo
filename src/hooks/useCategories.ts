import { useMemo } from 'react';
import {
  FOOD_CATEGORIES,
  Category,
  getCategoryByValue,
  getAllCategories,
} from '@/src/data/categories';

export interface UseCategoriesReturn {
  categories: Category[];
  isLoading: boolean;
  error: null;
  getCategoryByValue: (value: string) => Category | undefined;
  getAllCategories: () => Category[];
}

/**
 * Hook to get food categories data
 * Replaces the API call with local data
 */
export const useCategories = (): UseCategoriesReturn => {
  const categories = useMemo(() => FOOD_CATEGORIES, []);

  return {
    categories,
    isLoading: false,
    error: null,
    getCategoryByValue,
    getAllCategories,
  };
};

/**
 * Hook to get a specific category by value
 */
export const useCategory = (value: string): Category | undefined => {
  return useMemo(() => getCategoryByValue(value), [value]);
};

/**
 * Hook to get categories formatted for dropdowns/pickers
 */
export const useCategoriesForPicker = () => {
  return useMemo(() => {
    return FOOD_CATEGORIES.map((category) => ({
      label: category.label,
      value: category.value,
      emoji: category.emoji,
      color: category.color,
    }));
  }, []);
};

export default useCategories;
