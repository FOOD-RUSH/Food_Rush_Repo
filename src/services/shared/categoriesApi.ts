import { apiClient } from '@/src/services/shared/apiClient';

export interface CategoryOption {
  value: string;
  label: string;
}

export interface CategoriesResponse {
  data: CategoryOption[];
}

export const categoriesApi = {
  // Get all food categories - unified endpoint for both customer and restaurant use
  getAllCategories: () => {
    return apiClient
      .get<CategoryOption[]>('/menu/all/categories')
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error(
          '❌ [Unified Categories API] Error fetching categories:',
          error,
        );
        throw error;
      });
  },
};
