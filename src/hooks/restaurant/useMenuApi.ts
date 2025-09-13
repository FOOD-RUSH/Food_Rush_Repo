import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  restaurantMenuApi,
  CreateMenuItemRequest,
  UpdateMenuItemRequest,
  CreateCategoryRequest,
  MenuItem,
  MenuCategory
} from "@/src/services/restaurant/menuApi";

export const useGetMenuItems = (restaurantId: string, params?: { categoryId?: string; isAvailable?: boolean; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['restaurant-menu-items', restaurantId, params],
    queryFn: () => restaurantMenuApi.getMenuItems(restaurantId, params).then(res => res.data.data),
    enabled: !!restaurantId,
  });
};

export const useGetMenuItemById = (itemId: string) => {
  return useQuery({
    queryKey: ['restaurant-menu-item', itemId],
    queryFn: () => restaurantMenuApi.getMenuItemById(itemId).then(res => res.data),
    enabled: !!itemId,
  });
};

export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ restaurantId, data }: { restaurantId: string; data: CreateMenuItemRequest }) =>
      restaurantMenuApi.createMenuItem(restaurantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['restaurant-menu-stats'] });
    },
  });
};

export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ restaurantId, itemId, data }: { restaurantId: string; itemId: string; data: UpdateMenuItemRequest }) =>
      restaurantMenuApi.updateMenuItem(restaurantId, itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['restaurant-menu-item'] });
    },
  });
};

export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ restaurantId, itemId }: { restaurantId: string; itemId: string }) =>
      restaurantMenuApi.deleteMenuItem(restaurantId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['restaurant-menu-stats'] });
    },
  });
};

export const useToggleMenuItemAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ restaurantId, itemId, isAvailable }: { restaurantId: string; itemId: string; isAvailable: boolean }) =>
      restaurantMenuApi.toggleMenuItemAvailability(restaurantId, itemId, isAvailable),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-menu-items'] });
    },
  });
};

export const useGetCategories = (params?: { isActive?: boolean; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['restaurant-categories', params],
    queryFn: () => restaurantMenuApi.getCategories(params).then(res => res.data),
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => restaurantMenuApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-categories'] });
      queryClient.invalidateQueries({ queryKey: ['restaurant-menu-stats'] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, data }: { categoryId: string; data: any }) =>
      restaurantMenuApi.updateCategory(categoryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-categories'] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: string) => restaurantMenuApi.deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-categories'] });
      queryClient.invalidateQueries({ queryKey: ['restaurant-menu-stats'] });
    },
  });
};

export const useMenuStats = () => {
  return useQuery({
    queryKey: ['restaurant-menu-stats'],
    queryFn: () => restaurantMenuApi.getMenuStats().then(res => res.data),
  });
};

// New hooks for additional APIs
export const useGetAllMenus = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['all-menus', params],
    queryFn: () => restaurantMenuApi.getAllMenus(params).then(res => res.data),
  });
};

export const useGetNearbyMenus = (params: { nearlat: number; nearlng: number; radiuskm: number; limit?: number; offset?: number }) => {
  return useQuery({
    queryKey: ['nearby-menus', params],
    queryFn: () => restaurantMenuApi.getNearbyMenus(params).then(res => res.data),
    enabled: !!(params.nearlat && params.nearlng && params.radiuskm),
  });
};

export const useBrowseMenus = (params: {
  nearLat: number;
  nearLng: number;
  minDistanceKm?: number;
  maxDistanceKm?: number;
  minDeliveryFee?: number;
  maxDeliveryFee?: number;
  radiusKm?: number;
  sortBy?: 'distance' | 'fee' | 'createdAt';
  sortDir?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
}) => {
  return useQuery({
    queryKey: ['browse-menus', params],
    queryFn: () => restaurantMenuApi.browseMenus(params).then(res => res.data),
    enabled: !!(params.nearLat && params.nearLng),
  });
};

export const useUploadMenuItemPicture = () => {
  return useMutation({
    mutationFn: ({ restaurantId, formData }: { restaurantId: string; formData: FormData }) =>
      restaurantMenuApi.uploadMenuItemPicture(restaurantId, formData),
  });
};

export const useUploadImage = () => {
  return useMutation({
    mutationFn: (formData: FormData) => restaurantMenuApi.uploadImage(formData),
  });
};