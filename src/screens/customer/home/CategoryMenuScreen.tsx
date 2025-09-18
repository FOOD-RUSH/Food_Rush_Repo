import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme, ActivityIndicator } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import CommonView from '@/src/components/common/CommonView';
import FoodItemCard from '@/src/components/customer/FoodItemCard';
import { RootStackScreenProps } from '@/src/navigation/types';
import { FoodProps } from '@/src/types';
import { useGetAllMenuItem } from '@/src/hooks/customer/useCustomerApi';
import ErrorDisplay from '@/src/components/common/ErrorDisplay';
import FoodItemCardSkeleton from '@/src/components/customer/FoodItemCardSkeleton';
import { getCategoryByTitle } from '@/src/constants/categories';

type CategoryMenuScreenProps = RootStackScreenProps<'CategoryMenu'>;

const CategoryMenuScreen: React.FC<CategoryMenuScreenProps> = ({
  navigation,
  route,
}) => {
  const { categoryTitle } = route.params;
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const [refreshing, setRefreshing] = useState(false);

  // Get category info
  const categoryInfo = getCategoryByTitle(categoryTitle);

  // Fetch all menu items
  const { data: allMenuItems, isLoading, error, refetch } = useGetAllMenuItem();

  // Filter menu items by category
  const categoryMenuItems = useMemo(() => {
    if (!allMenuItems) return [];

    // Filter items based on category
    // Since we don't have category field from backend, we'll filter by name/description
    return allMenuItems.filter((item) => {
      const itemName = item.name.toLowerCase();
      const itemDescription = item.description?.toLowerCase() || '';

      switch (categoryTitle) {
        case 'local-dishes':
          return (
            itemName.includes('local') ||
            itemName.includes('traditional') ||
            itemDescription.includes('local') ||
            itemDescription.includes('traditional')
          );
        case 'snacks':
          return (
            itemName.includes('snack') ||
            itemName.includes('bite') ||
            itemName.includes('chip') ||
            itemDescription.includes('snack')
          );
        case 'drinks':
          return (
            itemName.includes('drink') ||
            itemName.includes('juice') ||
            itemName.includes('water') ||
            itemName.includes('soda') ||
            itemDescription.includes('beverage')
          );
        case 'breakfast':
          return (
            itemName.includes('breakfast') ||
            itemName.includes('morning') ||
            itemName.includes('pancake') ||
            itemName.includes('egg') ||
            itemDescription.includes('breakfast')
          );
        case 'fast-food':
          return (
            itemName.includes('burger') ||
            itemName.includes('fries') ||
            itemName.includes('fast') ||
            itemDescription.includes('fast')
          );
        default:
          return (
            itemName.includes(categoryTitle) ||
            itemDescription.includes(categoryTitle)
          );
      }
    });
  }, [allMenuItems, categoryTitle]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

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
          restaurantId={item.restaurant?.id!}
          FoodName={item.name}
          FoodPrice={parseFloat(item.price)}
          FoodImage={item.pictureUrl}
          distanceFromUser={item.distanceKm || 0}
          DeliveryPrice={500} // Default delivery price
          isAvailable={item.isAvailable}
          RestaurantName={item.restaurant?.name}
        />
      </View>
    ),
    [],
  );

  const keyExtractor = useCallback((item: FoodProps) => item.id, []);

  // Header component
  const Header = () => (
    <View style={[styles.header, { backgroundColor: colors.surface }]}>
      <TouchableOpacity
        onPress={handleGoBack}
        style={[styles.backButton, { backgroundColor: colors.primary }]}
      >
        <MaterialIcons name="arrow-back" size={20} color="white" />
      </TouchableOpacity>
      <View style={styles.headerContent}>
        <Text style={[styles.categoryTitle, { color: colors.onSurface }]}>
          {categoryInfo?.displayName || categoryTitle}
        </Text>
        {categoryInfo?.description && (
          <Text
            style={[
              styles.categoryDescription,
              { color: colors.onSurfaceVariant },
            ]}
          >
            {categoryInfo.description}
          </Text>
        )}
      </View>
    </View>
  );

  // Loading state
  if (isLoading) {
    return (
      <CommonView>
        <SafeAreaView style={{ flex: 1 }}>
          <Header />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.onSurface }]}>
              {t('loading_menu_items')}
            </Text>
          </View>
        </SafeAreaView>
      </CommonView>
    );
  }

  // Error state
  if (error) {
    return (
      <CommonView>
        <SafeAreaView style={{ flex: 1 }}>
          <Header />
          <ErrorDisplay
            onRetry={refetch}
            message={t('error_loading_menu') || t('something_went_wrong')}
          />
        </SafeAreaView>
      </CommonView>
    );
  }

  return (
    <CommonView>
      {/* Content */}
      {categoryMenuItems.length > 0 ? (
        <FlatList
          data={categoryMenuItems}
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
        <View style={styles.emptyState}>
          <MaterialIcons
            name="restaurant-menu"
            size={64}
            color={colors.onSurfaceVariant}
          />
          <Text style={[styles.emptyTitle, { color: colors.onSurface }]}>
            {t('no_items_in_category')}
          </Text>
          <Text
            style={[styles.emptySubtitle, { color: colors.onSurfaceVariant }]}
          >
            {t('try_browsing_other_categories')}
          </Text>
        </View>
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
