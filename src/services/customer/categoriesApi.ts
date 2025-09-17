import { apiClient } from '@/src/services/shared/apiClient';

export interface CategoryOption {
  value: string;
  label: string;
}

export interface CategoriesResponse {
  data: CategoryOption[];
}

export const categoriesApi = {
  // Get all food categories
  getAllCategories: () => {
    return apiClient.get<CategoryOption[]>('/menu/all/category');
  },
};