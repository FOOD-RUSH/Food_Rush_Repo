import { useQuery } from '@tanstack/react-query';
import {
  categoriesApi,
  CategoryOption,
} from '@/src/services/shared/categoriesApi';

// Unified hook for fetching categories - replaces all other category hooks
export const useCategoriesApi = () => {
  console.log('🎣 [Unified Categories Hook] Initializing categories query');
  
  const queryResult = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      console.log('🚀 [Unified Categories Hook] Executing query function');
      return categoriesApi.getAllCategories().then((res) => {
        console.log('🎉 [Unified Categories Hook] Query completed, data:', res.data);
        return res.data;
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });

  const { data: categories, ...rest } = queryResult;
  
  console.log('📊 [Unified Categories Hook] Categories data received:', categories);

  return {
    ...rest,
    data: categories || [],
    categoryOptions: categories || [], // For backward compatibility
  };
};

// Export alias for easier migration
export const useCategoryOptions = useCategoriesApi;
export const useRestaurantCategoryOptions = useCategoriesApi;
export const useMenuCategories = useCategoriesApi;