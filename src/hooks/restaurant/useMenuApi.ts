import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  restaurantMenuApi,
  CreateMenuItemRequest,
  UpdateMenuItemRequest,
} from '@/src/services/restaurant/menuApi';
// Removed CreateCategoryRequest - backend only returns categories

export const useGetMenuItems = (restaurantId: string, category?: string) => {
  return useQuery({
    queryKey: ['restaurant-menu-items', restaurantId, category],
    queryFn: () =>
      restaurantMenuApi
        .getMenuItems(restaurantId, category!)
        .then((res) => res.data.data),
    enabled: !!restaurantId,
  });
};

export const useGetMenuItemById = (itemId: string) => {
  return useQuery({
    queryKey: ['restaurant-menu-item', itemId],
    queryFn: () =>
      restaurantMenuApi.getMenuItemById(itemId).then((res) => res.data),
    enabled: !!itemId,
  });
};

export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      restaurantId,
      data,
    }: {
      restaurantId: string;
      data: CreateMenuItemRequest;
    }) => restaurantMenuApi.createMenuItem(restaurantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['restaurant-menu-stats'] });
    },
  });
};

export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      restaurantId,
      itemId,
      data,
    }: {
      restaurantId: string;
      itemId: string;
      data: UpdateMenuItemRequest;
    }) => restaurantMenuApi.updateMenuItem(restaurantId, itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['restaurant-menu-item'] });
    },
  });
};

export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      restaurantId,
      itemId,
    }: {
      restaurantId: string;
      itemId: string;
    }) => restaurantMenuApi.deleteMenuItem(restaurantId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['restaurant-menu-stats'] });
    },
  });
};

export const useToggleMenuItemAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      restaurantId,
      itemId,
      isAvailable,
    }: {
      restaurantId: string;
      itemId: string;
      isAvailable: boolean;
    }) =>
      restaurantMenuApi.toggleMenuItemAvailability(
        restaurantId,
        itemId,
        isAvailable,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-menu-items'] });
    },
  });
};
