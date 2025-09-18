import { useQuery } from '@tanstack/react-query';
import { restaurantCategoriesApi } from '@/src/services/restaurant/categoriesApi';

export const useGetRestaurantCategories = () => {
  return useQuery({
    queryKey: ['restaurant-categories'],
    queryFn: () =>
      restaurantCategoriesApi.getAllCategories().then((res) => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

// Hook to get categories as options for dropdowns/selectors
export const useRestaurantCategoryOptions = () => {
  const { data: categories, ...rest } = useGetRestaurantCategories();

  return {
    ...rest,
    data: categories || [],
    categoryOptions: categories || [],
  };
};
