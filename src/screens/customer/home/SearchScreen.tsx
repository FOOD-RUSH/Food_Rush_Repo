import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useTheme, ActivityIndicator } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import CommonView from '@/src/components/common/CommonView';
import FoodItemCard from '@/src/components/customer/FoodItemCard';
import SearchInput from '@/src/components/customer/SearchInput';
import FilterModal, {
  GeneralFilterOptions,
} from '@/src/components/customer/FilterModal';
import { RootStackScreenProps } from '@/src/navigation/types';
import { FoodProps } from '@/src/types';
import { useGetAllMenu } from '@/src/hooks/customer';
import ErrorDisplay from '@/src/components/common/ErrorDisplay';
import SearchResultSkeleton from '@/src/components/customer/SearchResultSkeleton';

interface SearchScreenProps extends RootStackScreenProps<'SearchScreen'> {}

// Simplified search hook focusing on MVP filters only
const useSearchFood = (query: string, filters: GeneralFilterOptions) => {
  const {
    refetch,
    data: MenuItems,
    isPending,
    isRefetching,
    error,
  } = useGetAllMenu();

  const filteredResults = useMemo(() => {
    if (!MenuItems) return [];

    let results = [...MenuItems];

    // Apply text search
    if (query.trim()) {
      const searchTerm = query.toLowerCase().trim();
      results = results.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm) ||
          item.description?.toLowerCase().includes(searchTerm) ||
          item.restaurant?.name.toLowerCase().includes(searchTerm),
      );
    }

    // Apply price range filter
    if (filters.priceRange) {
      results = results.filter((item) => {
        const price = parseFloat(item.price);
        switch (filters.priceRange) {
          case 'budget':
            return price < 2000;
          case 'medium':
            return price >= 2000 && price <= 5000;
          case 'premium':
            return price > 5000;
          default:
            return true;
        }
      });
    }

    // Apply distance filter
    if (filters.distanceRange && filters.distanceRange !== 'any') {
      results = results.filter((item) => {
        const distance = item.distanceKm || 0;
        switch (filters.distanceRange) {
          case '0-5':
            return distance <= 5;
          case '5-10':
            return distance > 5 && distance <= 10;
          case '10+':
            return distance > 10;
          default:
            return true;
        }
      });
    }

    // Apply delivery time filter
    if (filters.deliveryTime && filters.deliveryTime !== 'any') {
      results = results.filter((item) => {
        const dtRaw =
          (item.restaurant as any)?.deliveryTime ??
          (item.restaurant as any)?.estimatedDeliveryTime;
        if (!dtRaw) return true;
        const match = String(dtRaw).match(/(\d+)/);
        const mins = match ? parseInt(match[0], 10) : NaN;
        if (Number.isNaN(mins)) return true;
        switch (filters.deliveryTime) {
          case 'under30':
            return mins <= 30;
          case '30-60':
            return mins > 30 && mins <= 60;
          case '60+':
            return mins > 60;
          default:
            return true;
        }
      });
    }

    // Apply delivery fee filter
    if (filters.deliveryFee && filters.deliveryFee !== 'any') {
      results = results.filter((item) => {
        // Since deliveryPrice is not in FoodProps, use a default or skip this filter
        const fee = 0; // Default to free for now
        switch (filters.deliveryFee) {
          case 'free':
            return fee === 0;
          case 'under1000':
            return fee > 0 && fee <= 1000;
          case 'under2000':
            return fee > 1000 && fee <= 2000;
          default:
            return true;
        }
      });
    }

    // Default sorting by distance (closest first)
    results.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));

    return results;
  }, [MenuItems, query, filters]);

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
    error: error,
    refetch: refresh,
  };
};

const SearchScreen: React.FC<SearchScreenProps> = ({ navigation, route }) => {
  const { type, category = '' } = route.params || {};
  const { colors } = useTheme();
  const { t } = useTranslation('translation');

  // Search state
  const [query, setQuery] = useState('');

  // Filter modal visibility
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  // Filter state - simplified to MVP only
  const [filters, setFilters] = useState<GeneralFilterOptions>({
    priceRange: null,
    deliveryTime: 'any',
    deliveryFee: 'any',
    distanceRange: 'any',
  });

  const { results, isPending, isRefetching, error, refetch } = useSearchFood(
    query,
    filters,
  );

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const renderFoodItem = useCallback(
    ({ item }: { item: FoodProps }) => (
      <View style={{ paddingVertical: 4 }}>
        <FoodItemCard
          key={item.id}
          foodId={item.id}
          restaurantId={item.restaurant?.id!}
          FoodName={item.name}
          FoodPrice={parseFloat(item.price)}
          FoodImage={
            item.pictureUrl || require('@/assets/images/NoOrdersDark.png')
          }
          RestaurantName={item.restaurant?.name || ''}
          distanceFromUser={item.distanceKm || 0}
          DeliveryPrice={2000}
          hasPromo={false}
        />
      </View>
    ),
    [],
  );

  const keyExtractor = useCallback((item: FoodProps) => item.id, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.priceRange !== null ||
      filters.deliveryTime !== 'any' ||
      filters.deliveryFee !== 'any' ||
      filters.distanceRange !== 'any'
    );
  }, [filters]);

  const getActiveFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.priceRange) count++;
    if (filters.deliveryTime !== 'any') count++;
    if (filters.deliveryFee !== 'any') count++;
    if (filters.distanceRange !== 'any') count++;
    return count;
  }, [filters]);

  // Header component
  const Header = () => {
    if (type === 'category') {
      return (
        <View
          style={[styles.categoryHeader, { backgroundColor: colors.surface }]}
        >
          <TouchableOpacity
            onPress={handleGoBack}
            style={[styles.backButton, { backgroundColor: colors.primary }]}
          >
            <MaterialIcons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>
          <Text style={[styles.categoryTitle, { color: colors.onSurface }]}>
            {category}
          </Text>
        </View>
      );
    }

    return (
      <View
        style={[styles.searchHeader, { backgroundColor: colors.background }]}
      >
        <View style={styles.searchRow}>
          <TouchableOpacity
            onPress={handleGoBack}
            style={[styles.backButton, { backgroundColor: colors.primary }]}
          >
            <MaterialIcons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>
          <SearchInput value={query} onChangeText={setQuery} />
        </View>
      </View>
    );
  };

  // Filter bar component (below search bar)
  const FilterBar = () => (
    <View style={[styles.filterBar, { backgroundColor: colors.surface }]}>
      <TouchableOpacity
        style={[
          styles.filterButton,
          hasActiveFilters
            ? { backgroundColor: colors.primaryContainer }
            : { backgroundColor: colors.surfaceVariant },
        ]}
        onPress={() => setIsFilterModalVisible(true)}
      >
        <MaterialIcons
          name="tune"
          size={20}
          color={
            hasActiveFilters
              ? colors.onPrimaryContainer
              : colors.onSurfaceVariant
          }
        />
        <Text
          style={[
            styles.filterButtonText,
            {
              color: hasActiveFilters
                ? colors.onPrimaryContainer
                : colors.onSurfaceVariant,
            },
          ]}
        >
          {t('filters')}
        </Text>
        {getActiveFiltersCount > 0 && (
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Text style={[styles.badgeText, { color: 'white' }]}>
              {getActiveFiltersCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {hasActiveFilters && (
        <TouchableOpacity
          style={[
            styles.clearButton,
            { backgroundColor: colors.errorContainer },
          ]}
          onPress={() => {
            setFilters({
              priceRange: null,
              deliveryTime: 'any',
              deliveryFee: 'any',
              distanceRange: 'any',
            });
          }}
        >
          <MaterialIcons
            name="clear"
            size={16}
            color={colors.onErrorContainer}
          />
          <Text
            style={[styles.clearButtonText, { color: colors.onErrorContainer }]}
          >
            {t('clear')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Error state
  if (error) {
    return (
      <CommonView>
        <SafeAreaView style={{ flex: 1 }}>
          <Header />
          <ErrorDisplay
            onRetry={refetch}
            message={t('error_loading_food') || t('something_went_wrong')}
          />
        </SafeAreaView>
      </CommonView>
    );
  }

  // Loading state
  if (isPending) {
    return (
      <CommonView>
        <SafeAreaView style={{ flex: 1 }}>
          <Header />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.onSurface }]}>
              {t('searching')}
            </Text>
          </View>
        </SafeAreaView>
      </CommonView>
    );
  }

  return (
    <CommonView>
      <SafeAreaView style={{ flex: 1 }}>
        <Header />
        <FilterBar />

        {/* Results info */}
        {hasActiveFilters && (
          <View
            style={[
              styles.resultsInfo,
              { backgroundColor: colors.surfaceVariant },
            ]}
          >
            <Text
              style={[styles.resultsText, { color: colors.onSurfaceVariant }]}
            >
              {results.length} {t('results_found')}
            </Text>
          </View>
        )}

        {/* Content */}
        {isRefetching ? (
          <SearchResultSkeleton count={4} />
        ) : results.length > 0 ? (
          <FlatList
            data={results}
            renderItem={renderFoodItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.listContent}
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
          <View style={styles.emptyState}>
            <MaterialIcons
              name="search-off"
              size={64}
              color={colors.onSurfaceVariant}
            />
            <Text style={[styles.emptyTitle, { color: colors.onSurface }]}>
              {query ? t('no_food_found') : t('start_searching_for_food')}
            </Text>
            <Text
              style={[styles.emptySubtitle, { color: colors.onSurfaceVariant }]}
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
          onApply={(filterOptions) => {
            setFilters(filterOptions);
          }}
          currentFilters={filters}
        />
      </SafeAreaView>
    </CommonView>
  );
};

const styles = StyleSheet.create({
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  searchHeader: {
    paddingVertical: 4,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  categoryTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    marginRight: 36,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,

    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    position: 'relative',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginLeft: 8,
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  resultsInfo: {
    paddingVertical: 8,
  },
  resultsText: {
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default SearchScreen;
