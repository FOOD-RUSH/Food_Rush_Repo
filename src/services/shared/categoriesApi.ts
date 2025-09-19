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
    console.log('🔍 [Unified Categories API] Fetching categories from /menu/all/categories');
    return apiClient.get<CategoryOption[]>('/menu/all/categories').then(response => {
      console.log('✅ [Unified Categories API] Categories fetched successfully:', response.data);
      console.log('📊 [Unified Categories API] Number of categories:', response.data?.length || 0);
      return response;
    }).catch(error => {
      console.error('❌ [Unified Categories API] Error fetching categories:', error);
      throw error;
    });
  },
};