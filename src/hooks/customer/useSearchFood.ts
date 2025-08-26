import { useMemo, useCallback } from 'react';
import { useGetAllMenu } from './useCustomerApi';
import { FoodProps } from '@/src/types';

export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minDeliveryPrice?: number;
  maxDeliveryPrice?: number;
  maxDistance?: number;
  rating?: number;
}

export interface UseSearchFoodOptions {
  query?: string;
  filters?: SearchFilters;
  sortBy?: 'name' | 'price' | 'rating' | 'distance' | 'deliveryPrice';
  sortOrder?: 'asc' | 'desc';
}

export const useSearchFood = (options: UseSearchFoodOptions = {}) => {
  const { query = '', filters = {}, sortBy = 'name', sortOrder = 'asc' } = options;
  
  const { 
    data: menuItems, 
    isLoading, 
    error, 
    refetch,
    isRefetching 
  } = useGetAllMenu();

  // Memoized filtered and sorted results
  const searchResults = useMemo(() => {
    if (!menuItems || !Array.isArray(menuItems)) {
      return [];
    }

    let filtered = [...menuItems] as FoodProps[];

    // Apply text search
    if (query.trim().length > 0) {
      const searchQuery = query.toLowerCase().trim();
      filtered = filtered.filter((item: FoodProps) =>
        item.name.toLowerCase().includes(searchQuery) ||
        item.description?.toLowerCase().includes(searchQuery) ||
        item.category?.toLowerCase().includes(searchQuery) ||
        item.restaurant?.name?.toLowerCase().includes(searchQuery)
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter((item: FoodProps) =>
        item.category?.toLowerCase().includes(filters.category!.toLowerCase())
      );
    }

    // Apply price filters
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((item: FoodProps) => item.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((item: FoodProps) => item.price <= filters.maxPrice!);
    }

    // Apply delivery price filters (using default delivery price of 4000 for now)
    const defaultDeliveryPrice = 4000;
    if (filters.minDeliveryPrice !== undefined) {
      filtered = filtered.filter(() => defaultDeliveryPrice >= filters.minDeliveryPrice!);
    }
    if (filters.maxDeliveryPrice !== undefined) {
      filtered = filtered.filter(() => defaultDeliveryPrice <= filters.maxDeliveryPrice!);
    }

    // Apply distance filter
    if (filters.maxDistance !== undefined) {
      filtered = filtered.filter((item: FoodProps) => 
        (item.distance || 0) <= filters.maxDistance!
      );
    }

    // Apply rating filter
    if (filters.rating !== undefined) {
      filtered = filtered.filter((item: FoodProps) => 
        (item.ratings || 0) >= filters.rating!
      );
    }

    // Apply sorting
    filtered.sort((a: FoodProps, b: FoodProps) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'rating':
          aValue = a.ratings || 0;
          bValue = b.ratings || 0;
          break;
        case 'distance':
          aValue = a.distance || 0;
          bValue = b.distance || 0;
          break;
        case 'deliveryPrice':
          aValue = defaultDeliveryPrice;
          bValue = defaultDeliveryPrice;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'desc') {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      } else {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [menuItems, query, filters, sortBy, sortOrder]);

  // Search statistics
  const searchStats = useMemo(() => {
    const totalItems = menuItems?.length || 0;
    const filteredItems = searchResults.length;
    const hasActiveFilters = query.trim().length > 0 || 
      Object.keys(filters).some(key => filters[key as keyof SearchFilters] !== undefined);

    return {
      totalItems,
      filteredItems,
      hasActiveFilters,
      hasResults: filteredItems > 0,
      isFiltered: hasActiveFilters && filteredItems < totalItems,
    };
  }, [menuItems, searchResults, query, filters]);

  // Categories available in the data
  const availableCategories = useMemo(() => {
    if (!menuItems || !Array.isArray(menuItems)) return [];
    
    const categories = new Set<string>();
    menuItems.forEach((item: FoodProps) => {
      if (item.category) {
        categories.add(item.category);
      }
    });
    
    return Array.from(categories).sort();
  }, [menuItems]);

  // Price range in the data
  const priceRange = useMemo(() => {
    if (!menuItems || !Array.isArray(menuItems) || menuItems.length === 0) {
      return { min: 0, max: 0 };
    }

    const prices = menuItems.map((item: FoodProps) => item.price).filter(price => price > 0);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [menuItems]);

  // Distance range in the data
  const distanceRange = useMemo(() => {
    if (!menuItems || !Array.isArray(menuItems) || menuItems.length === 0) {
      return { min: 0, max: 0 };
    }

    const distances = menuItems
      .map((item: FoodProps) => item.distance || 0)
      .filter(distance => distance > 0);
    
    if (distances.length === 0) return { min: 0, max: 10 }; // Default range
    
    return {
      min: Math.min(...distances),
      max: Math.max(...distances),
    };
  }, [menuItems]);

  // Refresh function with error handling
  const refresh = useCallback(async () => {
    try {
      await refetch();
    } catch (error) {
      console.error('Error refreshing search results:', error);
    }
  }, [refetch]);

  return {
    // Data
    results: searchResults,
    totalItems: menuItems?.length || 0,
    
    // Loading states
    isLoading,
    isRefetching,
    
    // Error handling
    error,
    refetch: refresh,
    
    // Search metadata
    stats: searchStats,
    availableCategories,
    priceRange,
    distanceRange,
    
    // Helper functions
    hasResults: searchResults.length > 0,
    isEmpty: !menuItems || menuItems.length === 0,
    isSearching: query.trim().length > 0,
    
    // Raw data for advanced use cases
    rawData: menuItems || [],
  };
};