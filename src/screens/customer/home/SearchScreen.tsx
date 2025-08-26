import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useTheme, ActivityIndicator } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import CommonView from '@/src/components/common/CommonView';
import FoodItemCard from '@/src/components/customer/FoodItemCard';
import SearchInput from '@/src/components/customer/SearchInput';
import FilterModal from '@/src/components/customer/FilterModal';
import { RootStackScreenProps } from '@/src/navigation/types';
import { FoodProps } from '@/src/types';
import { useGetAllMenu } from '@/src/hooks/customer';

interface SearchScreenProps extends RootStackScreenProps<'SearchScreen'> {}

interface FilterOptions {
  categories: string[];
  priceRange: 'low' | 'medium' | 'high' | null;
  sortBy: 'name' | 'price' | 'rating' | 'distance';
}

// Mock hook for MVP - replace with actual API call
const useSearchFood = (query: string, filters: FilterOptions) => {
  const { refetch, data: MenuItems, isPending, isRefetching } = useGetAllMenu();

  // Simple filtering logic
  let filteredResults = MenuItems?.filter((item) =>
    query ? item.name.toLowerCase().includes(query.toLowerCase()) : true,
  );

  // Apply category filter
  if (filters.categories.length > 0) {
    // Mock category filtering - in real app, items would have categories
    filteredResults = filteredResults?.filter(
      (item) => filters.categories.includes('Fast Food'), // Mock logic
    );
  }

  // Apply price filter
  if (filters.priceRange) {
    filteredResults = filteredResults?.filter((item) => {
      switch (filters.priceRange) {
        case 'low':
          return item.price < 2000;
        case 'medium':
          return item.price >= 2000 && item.price <= 5000;
        case 'high':
          return item.price > 5000;
        default:
          return true;
      }
    });
  }

  // Apply sorting
  filteredResults?.sort((a, b) => {
    switch (filters.sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price':
        return a.price - b.price;
      case 'distance':
        return (a.distance || 0) - (b.distance || 0);
      default:
        return 0;
    }
  });
  const refresh = useCallback(async () => {
    try {
      await refetch();
    } catch (error) {
      console.error('Error refreshing search results:', error);
    }
  }, [refetch]);

  return {
    results: filteredResults,
    isPending,
    isRefetching,
    refetch: refresh,
    availableCategories: ['Fast Food', 'Pizza', 'Burgers', 'Asian'],
  };
};

const SearchScreen: React.FC<SearchScreenProps> = ({ navigation, route }) => {
  const { type, category } = route.params;
  const { colors } = useTheme();
  const { t } = useTranslation('translation');

  // Simple state management
  const [query, setQuery] = useState('');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    categories: type === 'category' && category ? [category] : [],
    priceRange: null,
    sortBy: 'name',
  });

  const { results, isPending, isRefetching, refetch, availableCategories } =
    useSearchFood(query, filters);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleFilterPress = useCallback(() => {
    setIsFilterModalVisible(true);
  }, []);

  const handleApplyFilters = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
  }, []);

  const renderFoodItem = useCallback(
    ({ item }: { item: FoodProps }) => (
      <View style={{ paddingVertical: 4 }}>
        <FoodItemCard
          key={item.id}
          foodId={item.id}
          restarantId={item.restaurant?.id}
          FoodName={item.name}
          FoodPrice={item.price}
          FoodImage={item.image}
          RestarantName={item.restaurant?.name || ''}
          distanceFromUser={item.distance || 0}
          DeliveryPrice={2000} // Mock delivery price
        />
      </View>
    ),
    [],
  );

  const keyExtractor = useCallback((item: FoodProps) => item.id, []);

  // Header component
  const Header = () => {
    if (type === 'category') {
      return (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: colors.surface,
            borderBottomWidth: 1,
            borderBottomColor: colors.outline,
          }}
        >
          <TouchableOpacity
            onPress={handleGoBack}
            style={{
              padding: 8,
              borderRadius: 20,
              backgroundColor: colors.primary,
            }}
          >
            <MaterialIcons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>
          <Text
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: 18,
              fontWeight: '600',
              color: colors.onSurface,
              marginRight: 36, // Compensate for back button
            }}
          >
            {category}
          </Text>
        </View>
      );
    }

    return (
      <View
        style={{
          paddingVertical: 8,
          backgroundColor: colors.background,
          borderBottomWidth: 1,
          borderBottomColor: colors.outline,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity
            onPress={handleGoBack}
            style={{
              padding: 8,
              borderRadius: 20,
              backgroundColor: colors.primary,
            }}
          >
            <MaterialIcons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>
          <SearchInput
            value={query}
            onChangeText={setQuery}
            showFilterButton={true}
            onFilterPress={handleFilterPress}
          />
        </View>
      </View>
    );
  };

  // Loading state
  if (isPending) {
    return (
      <CommonView>
        <SafeAreaView style={{ flex: 1 }}>
          <Header />
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ color: colors.onSurface, marginTop: 16 }}>
              {t('searching') || 'Searching...'}
            </Text>
          </View>
        </SafeAreaView>
      </CommonView>
    );
  }

  return (
    <CommonView>
      <Header />

      {/* Results info */}
      {results?.length! > 0 && (
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: colors.surface,
          }}
        >
          <Text style={{ color: colors.onSurfaceVariant, fontSize: 14 }}>
            {results?.length > 1
              ? t('results_found_plural', { count: results.length }) ||
                `${results.length} results found`
              : t('results_found', { count: results.length }) ||
                `${results.length} result found`}
          </Text>
        </View>
      )}

      {/* Content */}
      {results?.length! > 0 ? (
        <FlatList
          data={results}
          renderItem={renderFoodItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={{
            paddingBottom: 100,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={[colors.primary]}
            />
          }
        />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 32,
          }}
        >
          <MaterialIcons
            name="search-off"
            size={64}
            color={colors.onSurfaceVariant}
          />
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: colors.onSurface,
              marginTop: 16,
              textAlign: 'center',
            }}
          >
            {query
              ? t('no_results_for', { query: query }) ||
                `No results for "${query}"`
              : t('start_searching_for_food') || 'Start searching for food'}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: colors.onSurfaceVariant,
              marginTop: 8,
              textAlign: 'center',
            }}
          >
            {query
              ? t('try_adjusting_search_or_filters')
              : t('enter_search_term_to_find_delicious_food')}
          </Text>
        </View>
      )}

      {/* Filter Modal */}
      <FilterModal
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        onApply={handleApplyFilters}
        availableCategories={availableCategories}
      />
    </CommonView>
  );
};

export default SearchScreen;
