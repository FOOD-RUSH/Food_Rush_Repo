import { useQuery } from '@tanstack/react-query';
import {
  categoriesApi,
  CategoryOption,
} from '@/src/services/customer/categoriesApi';

export const useGetCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAllCategories().then((res) => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

// Hook to get categories as options for dropdowns/selectors
export const useCategoryOptions = () => {
  const { data: categories, ...rest } = useGetCategories();

  return {
    ...rest,
    data: categories || [],
    categoryOptions: categories || [],
  };
};
