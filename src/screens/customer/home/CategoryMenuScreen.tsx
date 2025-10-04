import React, { useState, useCallback, useLayoutEffect, useMemo } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { useTheme, ActivityIndicator } from 'react-native-paper';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import CommonView from '@/src/components/common/CommonView';
import FoodItemCard from '@/src/components/customer/FoodItemCard';
import { RootStackScreenProps } from '@/src/navigation/types';
import { FoodProps } from '@/src/types';
import { useBrowseMenuItems } from '@/src/hooks/customer/useCustomerApi';
import { getCategoryByTitle } from '@/src/constants/categories';
import ProfessionalErrorDisplay from '@/src/components/common/ProfessionalErrorDisplay';

type CategoryMenuScreenProps = RootStackScreenProps<'CategoryMenu'>;

const CategoryMenuScreen: React.FC<CategoryMenuScreenProps> = ({
  navigation,
  route,
}) => {
  const { categoryTitle } = route.params;
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const [refreshing, setRefreshing] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: categoryTitle });
  }, [categoryTitle, navigation]);
  // Get category info
  const categoryInfo = getCategoryByTitle(categoryTitle);

  // Fetch menu items for this category using the browse API
  // Convert display title to API category value
  const categoryValue =
    categoryInfo?.title || categoryTitle.toLowerCase().replace(/\s+/g, '-');
  const {
    data: categoryMenuItems,
    isLoading,
    error,
    refetch,
  } = useBrowseMenuItems(categoryValue);

  console.log('Category filtering:', {
    categoryTitle,
    categoryValue,
    categoryInfo,
  });

  // Apply client-side filtering as backup if API doesn't filter properly
  const filteredMenuItems = useMemo(() => {
    if (!categoryMenuItems) return [];

    // If we have items, check if they're already filtered by the API
    // If not, apply client-side filtering
    const filtered = categoryMenuItems.filter((item) => {
      // First check if item has a category field that matches
      if (item.category) {
        return item.category.toLowerCase() === categoryValue.toLowerCase();
      }

      // Fallback to name/description matching
      const itemName = item.name.toLowerCase();
      const itemDescription = item.description?.toLowerCase() || '';

      switch (categoryValue) {
        case 'local-dishes':
          return (
            itemName.includes('local') ||
            itemDescription.includes('local') ||
            itemName.includes('traditional') ||
            itemDescription.includes('traditional')
          );
        case 'snacks':
          return (
            itemName.includes('snack') ||
            itemDescription.includes('snack') ||
            itemName.includes('bite') ||
            itemDescription.includes('bite')
          );
        case 'drinks':
          return (
            itemName.includes('drink') ||
            itemDescription.includes('drink') ||
            itemName.includes('beverage') ||
            itemDescription.includes('beverage') ||
            itemName.includes('juice') ||
            itemName.includes('water') ||
            itemName.includes('soda')
          );
        case 'breakfast':
          return (
            itemName.includes('breakfast') ||
            itemDescription.includes('breakfast') ||
            itemName.includes('morning') ||
            itemDescription.includes('morning')
          );
        case 'fast-food':
          return (
            itemName.includes('burger') ||
            itemName.includes('fast') ||
            itemName.includes('quick') ||
            itemDescription.includes('fast') ||
            itemDescription.includes('quick')
          );
        default:
          return (
            itemName.includes(categoryValue) ||
            itemDescription.includes(categoryValue)
          );
      }
    });

    return filtered;
  }, [categoryMenuItems, categoryValue]);

  console.log('CategoryMenuScreen:', {
    categoryTitle,
    categoryValue,
    totalItems: categoryMenuItems?.length || 0,
    filteredItems: filteredMenuItems?.length || 0,
    items: filteredMenuItems,
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const renderFoodItem = useCallback(
    ({ item }: { item: FoodProps }) => (
      <View style={{ paddingVertical: 4, paddingHorizontal: 8 }}>
        <FoodItemCard
          key={item.id}
          foodId={item.id}
          restaurantId={item.restaurant.id}
          FoodName={item.name}
          FoodPrice={item.price}
          FoodImage={null} // Will use pictureUrl instead
          pictureUrl={item.pictureUrl}
          RestaurantName={item.restaurant.name}
          distanceKm={item.distanceKm || item.distance || 0}
          deliveryFee={item.deliveryFee}
          isAvailable={item.isAvailable}
        />
      </View>
    ),
    [],
  );

  const keyExtractor = useCallback((item: FoodProps) => item.id, []);

  // Loading state
  if (isLoading) {
    return (
      <CommonView>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.onSurface }]}>
            {t('loading_menu_items')}
          </Text>
        </View>
      </CommonView>
    );
  }

  // Error state
  if (error) {
    return (
      <CommonView>
        <SafeAreaView style={{ flex: 1 }}>
          <ProfessionalErrorDisplay
            type="network_error"
            title={t('error_loading_menu')}
            message={t('please_check_your_internet_connection')}
            onRefresh={refetch}
            refreshButtonText={t('retry')}
          />
        </SafeAreaView>
      </CommonView>
    );
  }

  return (
    <CommonView>
      {/* Content */}
      {filteredMenuItems.length > 0 ? (
        <FlatList
          data={filteredMenuItems}
          renderItem={renderFoodItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        />
      ) : (
        <ProfessionalErrorDisplay
          type="no_items"
          title={t('no_items_in_category')}
          message={t('try_browsing_other_categories')}
          onRefresh={onRefresh}
          refreshButtonText={t('refresh')}
          containerStyle={{ flex: 1 }}
        />
      )}
    </CommonView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  categoryDescription: {
    fontSize: 14,
    marginTop: 2,
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
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsText: {
    fontSize: 14,
    fontWeight: '500',
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

export default CategoryMenuScreen;
