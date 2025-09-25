import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  restaurantMenuApi,
  CreateMenuItemRequest,
  UpdateMenuItemRequest,
} from '@/src/services/restaurant/menuApi';

// Query Keys
export const menuQueryKeys = {
  all: ['menu'] as const,
  restaurants: () => [...menuQueryKeys.all, 'restaurants'] as const,
  restaurant: (restaurantId: string) =>
    [...menuQueryKeys.restaurants(), restaurantId] as const,
  menuItems: (restaurantId: string, category?: string) =>
    [
      ...menuQueryKeys.restaurant(restaurantId),
      'items',
      category || 'all',
    ] as const,
  menuItem: (itemId: string) => [...menuQueryKeys.all, 'item', itemId] as const,
};

// Hook for fetching menu items
export const useMenuItems = (restaurantId: string, category?: string) => {
  return useQuery({
    queryKey: menuQueryKeys.menuItems(restaurantId, category),
    queryFn: async () => {
      const response = await restaurantMenuApi.getMenuItems(
        restaurantId,
        category,
      );
      // Extract the data array from the API response
      return response.data?.data || [];
    },
    enabled: !!restaurantId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for fetching a single menu item
export const useMenuItem = (itemId: string) => {
  return useQuery({
    queryKey: menuQueryKeys.menuItem(itemId),
    queryFn: async () => {
      const response = await restaurantMenuApi.getMenuItemById(itemId);
      // Extract the data from the API response
      return response.data;
    },
    enabled: !!itemId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for creating a menu item
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
    onSuccess: (response, { restaurantId }) => {
      // Invalidate and refetch menu items for this restaurant
      queryClient.invalidateQueries({
        queryKey: menuQueryKeys.restaurant(restaurantId),
      });

      // Optionally, you can also update the cache optimistically
      // if you want immediate UI updates
      console.log('✅ Menu item created successfully in hook:', response.data);
    },
    onError: (error) => {
      console.error('Failed to create menu item:', error);
    },
  });
};

// Hook for updating a menu item
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
    onSuccess: (response, { restaurantId, itemId }) => {
      // Invalidate queries
      queryClient.invalidateQueries({
        queryKey: menuQueryKeys.restaurant(restaurantId),
      });
      queryClient.invalidateQueries({
        queryKey: menuQueryKeys.menuItem(itemId),
      });

      console.log('Menu item updated successfully:', response);
    },
    onError: (error) => {
      console.error('Failed to update menu item:', error);
    },
  });
};

// Hook for deleting a menu item
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
    onSuccess: (response, { restaurantId, itemId }) => {
      // Remove the item from cache
      queryClient.removeQueries({
        queryKey: menuQueryKeys.menuItem(itemId),
      });

      // Invalidate menu items list
      queryClient.invalidateQueries({
        queryKey: menuQueryKeys.restaurant(restaurantId),
      });

      console.log('Menu item deleted successfully:', response);
    },
    onError: (error) => {
      console.error('Failed to delete menu item:', error);
    },
  });
};

// Hook for toggling menu item availability
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
    onMutate: async ({ restaurantId, itemId, isAvailable }) => {
      // Optimistic update
      await queryClient.cancelQueries({
        queryKey: menuQueryKeys.menuItem(itemId),
      });

      const previousData = queryClient.getQueryData(
        menuQueryKeys.menuItem(itemId),
      );

      // Optimistically update the cache
      queryClient.setQueryData(menuQueryKeys.menuItem(itemId), (old: any) => {
        if (old) {
          return {
            ...old,
            isAvailable,
          };
        }
        return old;
      });

      return { previousData };
    },
    onError: (error, { restaurantId, itemId }, context) => {
      // Revert optimistic update on error
      if (context?.previousData) {
        queryClient.setQueryData(
          menuQueryKeys.menuItem(itemId),
          context.previousData,
        );
      }
      console.error('Failed to toggle menu item availability:', error);
    },
    onSettled: (data, error, { restaurantId, itemId }) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({
        queryKey: menuQueryKeys.menuItem(itemId),
      });
      queryClient.invalidateQueries({
        queryKey: menuQueryKeys.restaurant(restaurantId),
      });
    },
  });
};

// Utility hook for managing menu-related loading states
export const useMenuLoadingStates = () => {
  const queryClient = useQueryClient();

  return {
    isAnyMenuMutationLoading: () => {
      return (
        queryClient.isMutating({
          mutationKey: menuQueryKeys.all,
        }) > 0
      );
    },

    invalidateAllMenuData: () => {
      queryClient.invalidateQueries({
        queryKey: menuQueryKeys.all,
      });
    },

    clearMenuCache: () => {
      queryClient.removeQueries({
        queryKey: menuQueryKeys.all,
      });
    },
  };
};
