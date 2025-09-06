import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  restaurantMenuApi,
  CreateMenuItemRequest,
  UpdateMenuItemRequest,
  CreateCategoryRequest,
  MenuItem,
  MenuCategory
} from "@/src/services/restaurant/menuApi";

export const useGetMenuItems = (params?: { categoryId?: string; isAvailable?: boolean; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['restaurant-menu-items', params],
    queryFn: () => restaurantMenuApi.getMenuItems(params).then(res => res.data),
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
    mutationFn: (data: CreateMenuItemRequest) => restaurantMenuApi.createMenuItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['restaurant-menu-stats'] });
    },
  });
};

export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, data }: { itemId: string; data: UpdateMenuItemRequest }) =>
      restaurantMenuApi.updateMenuItem(itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['restaurant-menu-item'] });
    },
  });
};

export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => restaurantMenuApi.deleteMenuItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['restaurant-menu-stats'] });
    },
  });
};

export const useToggleMenuItemAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, isAvailable }: { itemId: string; isAvailable: boolean }) =>
      restaurantMenuApi.toggleMenuItemAvailability(itemId, isAvailable),
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