import React, { useCallback, useMemo, useState } from 'react';
import CommonView from '@/src/components/common/CommonView';
import { TextInput, useTheme } from 'react-native-paper';
import { useCategories } from '@/src/hooks/useCategories';
import { images } from '@/assets/images';
import CategoryItem from '@/src/components/customer/CategoryItem';
// Removed HomeHeader as per requirement to remove customer headers
import FoodItemCard from '@/src/components/customer/FoodItemCard';
import {
  View,
  RefreshControl,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
} from 'react-native';
import { CustomerHomeStackScreenProps } from '@/src/navigation/types';
import { RestaurantCard } from '@/src/components/customer/RestaurantCard';
import HomeScreenHeaders from '@/src/components/customer/HomeScreenHeaders';

import { useTranslation } from 'react-i18next';
import {
  useBrowseMenuItems,
  useGetAllMenuItem,
  useAllRestaurants,
  useBrowseRestaurants,
  useAllRestaurantsWithoutLocation,
} from '@/src/hooks/customer/useCustomerApi';
import { useFavoriteRestaurants } from '@/src/hooks/customer/useFavoriteRestaurants';
import { FoodProps, RestaurantCard as RestaurantProps } from '@/src/types';
import RestaurantCardSkeleton from '@/src/components/customer/RestaurantCardSkeleton';
import FoodItemCardSkeleton from '@/src/components/customer/FoodItemCardSkeleton';

import ErrorDisplay from '@/src/components/common/ErrorDisplay';
import EmptyState from '@/src/components/common/EmptyState';
import HomeHeader from '@/src/components/customer/HomeHeader';
import { useLocationForQueries } from '@/src/hooks/customer/useLocationService';
import { useFloatingTabBarHeight } from '@/src/hooks/useFloatingTabBarHeight';

  // const { width } = Dimensions.get('window'); // Removed unused variable

// Constants
const SKELETON_COUNTS = {
  restaurants: 5,
  foods: 5,
} as const;

type HomeScreenProps = CustomerHomeStackScreenProps<'HomeScreen'>;



// Section types for FlatList
type HomeSectionItem =
  | { type: 'header'; title: string; onPress: (() => void) | null }
  | { type: 'search' }
  | { type: 'category'; data: any[] }
  | { type: 'food_near_you'; data: FoodProps[] }
  | { type: 'restaurants'; data: RestaurantProps[] }
  | { type: 'favorite_restaurants'; data: RestaurantProps[] }
  | { type: 'All Restaurant'; data: RestaurantProps[] }

  | {
      type: 'loading';
      skeletonType: 'foods' | 'restaurants';
      count: number;
    }
  | { type: 'error'; errorType: 'food' | 'restaurant' | 'favorites'; onRetry: () => void }
  | {
      type: 'empty';
      emptyType: 'food_near_you' | 'restaurants' | 'favorites';
      onActionPress?: () => void;
    };

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const [refreshing, setRefreshing] = useState(false);
  const tabBarHeight = useFloatingTabBarHeight();

  // Location info available if needed
  useLocationForQueries();

  // Get categories from local data
  const { categories } = useCategories();

  // Updated data fetching with new hooks
  const {
    data: browseRestaurants,
    isLoading: browseLoading,
    error: browseError,
    refetch: refetchBrowse,
  } = useBrowseRestaurants();

  // Favorite restaurants
  const {
    data: favoriteRestaurants,
    isLoading: favoritesLoading,
    error: favoritesError,
    refetch: refetchFavorites,
  } = useFavoriteRestaurants();

  const {
    data: allRestaurants,
    isLoading: allLoading,
    error: allError,
    refetch: refetchAll,
  } = useAllRestaurants({
    isOpen: true,
    verificationStatus: 'APPROVED',
    limit: 20,
  });

  // Get all restaurants without location requirements
  const {
    data: allRestaurantsNoLocation,
    isLoading: allNoLocationLoading,
    error: allNoLocationError,
    refetch: refetchAllNoLocation,
  } = useAllRestaurantsWithoutLocation({
    isOpen: true,
    verificationStatus: 'APPROVED',
    limit: 30,
  });

  // Use browse menu items endpoint for better food recommendations
  const {
    data: browseMenuData,
    isLoading: browseMenuLoading,
    error: browseMenuError,
    refetch: refetchBrowseMenu,
  } = useBrowseMenuItems(undefined, { enabled: true });

  // Fallback to all menu items if browse menu is empty
  const {
    data: allMenuData,
    isLoading: allMenuLoading,
    error: allMenuError,
    refetch: refetchAllMenu,
  } = useGetAllMenuItem();

  // Using the same categories data from unified hook
  const categoriesData = categories;

  // Determine which data to use - prioritize browse data when available
  const restaurantData =
    browseRestaurants && browseRestaurants.length > 0
      ? browseRestaurants
      : allRestaurants;
  
  // All restaurants data (without location requirements)
  const allRestaurantsData = allRestaurantsNoLocation;
  
  // Use browse menu data if available, otherwise fallback to all menu data
  const foodData =
    browseMenuData && browseMenuData.length > 0 ? browseMenuData : allMenuData;

  // Simplified loading state
  const isLoading =
    browseLoading || allLoading || browseMenuLoading || allMenuLoading || allNoLocationLoading;

  // Memoized categories data
  const categoriesForDisplay = useMemo(() => {
    return categoriesData.map((category) => ({
      id: category.value,
      value: category.value,
      label: category.label,
      description: category.description || 'Delicious food items',
      emoji: category.emoji,
      color: category.color,
      image: category.image || images.onboarding1, // Use category image
    }));
  }, [categoriesData]);

  // Simplified refresh handler - now includes both menu hooks
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchBrowse(),
        refetchAll(),
        refetchAllNoLocation(),
        refetchBrowseMenu(),
        refetchAllMenu(),
        // Categories refetch handled by unified hook
      ]);
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refetchBrowse, refetchAll, refetchAllNoLocation, refetchBrowseMenu, refetchAllMenu]);

  // Navigation handlers
  const handleSearchPress = useCallback(() => {
    navigation.push('SearchScreen', { type: 'search' }); // Use push() to ensure screen appears on top
  }, [navigation]);

  const handleNearbyRestaurantsPress = useCallback(() => {
    navigation.push('NearbyRestaurants'); // Use push() to ensure screen appears on top
  }, [navigation]);

  const handleAllRestaurantsPress = useCallback(() => {
    navigation.push('AllRestaurants'); // Use push() to ensure screen appears on top
  }, [navigation]);

  // Memoized render functions


  const renderRestaurantItem = useCallback(
    ({ item }: { item: RestaurantProps }) => (
      <RestaurantCard
        key={item.id}
        id={item.id}
        name={item.name}
        address={item.address}
        latitude={item.latitude || '0'}
        longitude={item.longitude || '0'}
        isOpen={item.isOpen}
        verificationStatus={item.verificationStatus || 'APPROVED'}
        menuMode={item.menuMode || 'FIXED'}
        createdAt={item.createdAt || new Date().toISOString()}
        distanceKm={item.distanceKm || item.distance || 0}
        deliveryPrice={item.deliveryPrice || 500}
        estimatedDeliveryTime={item.estimatedDeliveryTime || '30-40 mins'}
        rating={item.rating}
        ratingCount={item.ratingCount}
        image={item.pictureUrl}
        phone={item.phone}
        menu={item.menu || []}
      />
    ),
    [],
  );

  const renderFoodItem = useCallback(
    ({ item }: { item: FoodProps }) => (
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
    ),
    [],
  );

  const renderCategoryItem = useCallback(
    ({
      item,
    }: {
      item: {
        id: string;
        value: string;
        label: string;
        description: string;
        emoji: string;
        color: string;
        image: any;
      };
    }) => (
      <CategoryItem
        key={item.value}
        image={item.image}
        title={item.label}
        description={item.description}
        emoji={item.emoji}
        color={item.color}
      />
    ),
    [],
  );

  // Memoized data slices for performance
  const foodNearYouData = useMemo(
    () => foodData?.slice(0, 8) || [],
    [foodData],
  );

  // Prepare data for FlatList sections
  const sectionData = useMemo<HomeSectionItem[]>(() => {
    const data: HomeSectionItem[] = [
      // Header
      { type: 'header', title: 'header', onPress: () => {} },

      // Search Bar
      { type: 'search' },

      // Quick Filters Section
      { type: 'header', title: t('categories'), onPress: null },
      {
        type: 'category',
        data: categoriesForDisplay,
      },
    ];

    // Food Near You Section
    data.push({
      type: 'header',
      title: t('food_near_you'),
      onPress: () => navigation.push('SearchScreen', { type: 'search' }), // Use push() to ensure screen appears on top
    });

    if (isLoading) {
      data.push({
        type: 'loading',
        skeletonType: 'foods',
        count: SKELETON_COUNTS.foods,
      });
    } else if (browseMenuError && allMenuError) {
      data.push({
        type: 'error',
        errorType: 'food',
        onRetry: () => {
          refetchBrowseMenu();
          refetchAllMenu();
        },
      });
    } else if (foodNearYouData.length === 0) {
      data.push({
        type: 'empty',
        emptyType: 'food_near_you',
        onActionPress: () =>
          navigation.push('SearchScreen', { type: 'search' }), // Use push() to ensure screen appears on top
      });
    } else {
      data.push({ type: 'food_near_you', data: foodNearYouData });
    }

    // Favorite Restaurants Section
    data.push({
      type: 'header',
      title: t('favorite_restaurants'),
      onPress: null,
    });

    if (favoritesLoading) {
      data.push({
        type: 'loading',
        skeletonType: 'restaurants',
        count: SKELETON_COUNTS.restaurants,
      });
    } else if (favoritesError) {
      data.push({
        type: 'error',
        errorType: 'favorites',
        onRetry: refetchFavorites,
      });
    } else if (!favoriteRestaurants || favoriteRestaurants.length === 0) {
      data.push({
        type: 'empty',
        emptyType: 'favorites',
        onActionPress: handleAllRestaurantsPress,
      });
    } else {
      data.push({ type: 'favorite_restaurants', data: favoriteRestaurants });
    }

    // Restaurants Near You Section
    data.push({
      type: 'header',
      title: t('restaurant_near_you'),
      onPress: handleNearbyRestaurantsPress,
    });

    if (isLoading) {
      data.push({
        type: 'loading',
        skeletonType: 'restaurants',
        count: SKELETON_COUNTS.restaurants,
      });
    } else if (browseError && allError) {
      data.push({
        type: 'error',
        errorType: 'restaurant',
        onRetry: refetchBrowse,
      });
    } else if (!restaurantData || restaurantData.length === 0) {
      data.push({
        type: 'empty',
        emptyType: 'restaurants',
        onActionPress: handleNearbyRestaurantsPress,
      });
    } else {
      data.push({ type: 'restaurants', data: restaurantData });
    }
    // All Restaurants Section
    data.push({
      type: 'header',
      title: t('all_restaurants'),
      onPress: handleAllRestaurantsPress,
    });

    if (allNoLocationLoading) {
      data.push({
        type: 'loading',
        skeletonType: 'restaurants',
        count: SKELETON_COUNTS.restaurants,
      });
    } else if (allNoLocationError) {
      data.push({
        type: 'error',
        errorType: 'restaurant',
        onRetry: refetchAllNoLocation,
      });
    } else if (!allRestaurantsData || allRestaurantsData.length === 0) {
      data.push({
        type: 'empty',
        emptyType: 'restaurants',
        onActionPress: handleAllRestaurantsPress,
      });
    } else {
      data.push({ type: 'restaurants', data: allRestaurantsData });
    }
    


    return data;
  }, [t, categoriesForDisplay, isLoading, browseMenuError, allMenuError, foodNearYouData, handleNearbyRestaurantsPress, handleAllRestaurantsPress, browseError, allError, restaurantData, allRestaurantsData, allNoLocationLoading, allNoLocationError, refetchBrowseMenu, refetchAllMenu, refetchAllNoLocation, navigation, refetchBrowse, favoritesLoading, favoritesError, favoriteRestaurants, refetchFavorites]);

  // Render item based on type
  const renderItem: ListRenderItem<HomeSectionItem> = useCallback(
    ({ item }) => {
      switch (item.type) {
        case 'header':
          if (item.title === 'header') {
            return <HomeHeader navigation={navigation} />;
          }
          return (
            <HomeScreenHeaders title={item.title} onPress={item.onPress} />
          );

        case 'search':
          return (
            <TouchableOpacity activeOpacity={0.8} onPress={handleSearchPress}>
              <View
                className="px-4 py-3"
                style={{ backgroundColor: colors.background }}
              >
                <TextInput
                  placeholder={t('search_your_craving')}
                  left={
                    <TextInput.Icon
                      icon="magnify"
                      size={30}
                      color={colors.onSurfaceVariant}
                    />
                  }
                  mode="outlined"
                  outlineStyle={{
                    borderColor: colors.surfaceVariant,
                    borderWidth: 1,
                    borderRadius: 20,
                    backgroundColor: colors.surfaceVariant,
                  }}
                  style={{ backgroundColor: colors.surfaceVariant }}
                  className="py-1 px-3 rounded-2xl"
                  placeholderTextColor={colors.onBackground}
                  onPressIn={handleSearchPress}
                  pointerEvents="none"
                />
              </View>
            </TouchableOpacity>
          );

        case 'category':
          return (
            <View className="mb-4">
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={item.data}
                keyExtractor={(categoryItem) => categoryItem.id.toString()}
                renderItem={renderCategoryItem}
                className="px-2"
                contentContainerStyle={{ paddingHorizontal: 8 }}
              />
            </View>
          );



        case 'food_near_you':
          return (
            <View className="mb-4">
              <FlatList
                data={item.data}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(foodItem) => foodItem.id.toString()}
                renderItem={renderFoodItem}
                className="px-2"
                contentContainerStyle={{ paddingHorizontal: 8 }}
              />
            </View>
          );

        case 'restaurants':
          return (
            <View className="mb-6">
              <FlatList
                data={item.data}
                horizontal
                showsHorizontalScrollIndicator={false}                
                keyExtractor={(restaurantItem) => restaurantItem.id}
                renderItem={renderRestaurantItem}
                contentContainerStyle={{ paddingHorizontal: 8 }}
              />
            </View>
          );
        case 'favorite_restaurants':
          return (
            <View className="mb-6">
              <FlatList
                data={item.data}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(restaurantItem) => restaurantItem.id}
                renderItem={renderRestaurantItem}
                contentContainerStyle={{ paddingHorizontal: 8 }}
              />
            </View>
          );
        case 'All Restaurant':
          return (
              <View className="mb-6">
              <FlatList
                data={item.data}
                showsVerticalScrollIndicator={false}                
                keyExtractor={(restaurantItem) => restaurantItem.id}
                renderItem={renderRestaurantItem}
                contentContainerStyle={{ paddingHorizontal: 8 }}
              />
            </View>
          );

        case 'loading':
          switch (item.skeletonType) {
            case 'foods':
              return (
                <View className="mb-4">
                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={Array(item.count).fill(0)}
                    keyExtractor={(_, index) => `skeleton-food-${index}`}
                    renderItem={() => (
                      <View className="px-2 mr-4">
                        <FoodItemCardSkeleton />
                      </View>
                    )}
                    contentContainerStyle={{ paddingHorizontal: 8 }}
                  />
                </View>
              );
            case 'restaurants':
              return (
                <View className="mb-6">
                  <FlatList
                  horizontal
                    showsHorizontalScrollIndicator={false}
                    data={Array(item.count).fill(0)}
                    keyExtractor={(_, index) => `skeleton-restaurant-${index}`}
                    renderItem={() => (
                      <View className="px-2 mb-4">
                        <RestaurantCardSkeleton />
                      </View>
                    )}
                    contentContainerStyle={{ paddingHorizontal: 8 }}
                  />
                </View>
              );
          }
          break;

        case 'error':
          return (
            <View className="px-4 mb-4">
              <ErrorDisplay
                error={
                  item.errorType === 'food'
                    ? t('network_error_food')
                    : item.errorType === 'favorites'
                    ? t('favorites_error_description')
                    : t('network_error_restaurant')
                }
                onRetry={item.onRetry}
              />
            </View>
          );

        case 'empty':
          const getEmptyStateProps = () => {
            switch (item.emptyType) {
              case 'food_near_you':
                return {
                  icon: 'restaurant-outline' as const,
                  title: t('no_food_near_you'),
                  description: t('no_food_near_you_description'),
                  actionText: t('explore_menu'),
                };
              case 'restaurants':
                return {
                  icon: 'storefront-outline' as const,
                  title: t('no_restaurants_found'),
                  description: t('no_restaurants_description'),
                  actionText: t('explore_restaurants'),
                };
              case 'favorites':
                return {
                  icon: 'heart-outline' as const,
                  title: t('no_favorite_restaurants'),
                  description: t('no_favorites_description'),
                  actionText: t('explore_restaurants'),
                };
              default:
                return {
                  icon: 'alert-circle-outline' as const,
                  title: t('no_food_items_found'),
                  description: t('no_food_items_description'),
                  actionText: t('browse_categories'),
                };
            }
          };

          const emptyProps = getEmptyStateProps();
          return (
            <View className="px-4 mb-4">
              <EmptyState
                {...emptyProps}
                onActionPress={item.onActionPress}
                size="small"
              />
            </View>
          );
      }

      return null;
    },
    [
      navigation,
      colors,
      t,
      handleSearchPress,
      renderCategoryItem,
      renderFoodItem,
      renderRestaurantItem,
    ],
  );

  // Key extractor for FlatList
  const keyExtractor = useCallback((item: HomeSectionItem, index: number) => {
    return `${item.type}-${index}`;
  }, []);

  return (
    <CommonView>
      <FlatList
        data={sectionData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        style={{ backgroundColor: colors.background }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: tabBarHeight,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
    </CommonView>
  );
};

export default React.memo(HomeScreen);