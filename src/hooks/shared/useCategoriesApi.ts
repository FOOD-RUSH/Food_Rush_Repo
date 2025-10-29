import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '@/src/services/shared/categoriesApi';

// Unified hook for fetching categories - replaces all other category hooks
export const useCategoriesApi = () => {
  const queryResult = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoriesApi.getAllCategories().then((res) => {
        return res.data;
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });

  const { data: categories, ...rest } = queryResult;

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
export const useGetAllCategories = useCategoriesApi;
