import React, { useCallback, useMemo, useState, useRef } from 'react';
import CommonView from '@/src/components/common/CommonView';
import { TextInput, useTheme } from 'react-native-paper';
import { useCategories } from '@/src/hooks/useCategories';
import { images } from '@/assets/images';
import CategoryItem from '@/src/components/customer/CategoryItem';
// Removed HomeHeader as per requirement to remove customer headers
import FoodItemCard from '@/src/components/customer/FoodItemCard';
import {
  View,
  Dimensions,
  RefreshControl,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
} from 'react-native';
import { CustomerHomeStackScreenProps } from '@/src/navigation/types';
import { RestaurantCard } from '@/src/components/customer/RestaurantCard';
import HomeScreenHeaders from '@/src/components/customer/HomeScreenHeaders';
import Animated, {
  interpolate,
  useAnimatedStyle,
  SharedValue,
} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import ClassicFoodCard from '@/src/components/customer/ClassicFoodCard';

import { useTranslation } from 'react-i18next';
import {
  useBrowseMenuItems,
  useGetAllMenuItem,
  useAllRestaurants,
  useBrowseRestaurants,
} from '@/src/hooks/customer/useCustomerApi';
import { FoodProps, RestaurantCard as RestaurantProps } from '@/src/types';
import RestaurantCardSkeleton from '@/src/components/customer/RestaurantCardSkeleton';
import FoodItemCardSkeleton from '@/src/components/customer/FoodItemCardSkeleton';
import ClassicFoodCardSkeleton from '@/src/components/customer/ClassicFoodCardSkeleton';
import ErrorDisplay from '@/src/components/common/ErrorDisplay';
import EmptyState from '@/src/components/common/EmptyState';
import HomeHeader from '@/src/components/customer/HomeHeader';
import { useLocationForQueries } from '@/src/hooks/customer/useLocationService';
import { useFloatingTabBarHeight } from '@/src/hooks/useFloatingTabBarHeight';

const { width } = Dimensions.get('window');

// Constants
const CAROUSEL_CONFIG = {
  width: width * 0.65,
  height: 300,
  autoPlayInterval: 4000,
  animationDuration: 1000,
} as const;

const SKELETON_COUNTS = {
  restaurants: 4,
  foods: 4,
  carousel: 3,
} as const;

type HomeScreenProps = CustomerHomeStackScreenProps<'HomeScreen'>;

// Simplified CarouselItem component
interface CarouselItemProps {
  food?: FoodProps;
  animationValue: SharedValue<number>;
}

const CarouselItem = React.memo<CarouselItemProps>(
  ({ food, animationValue }) => {
    const { t } = useTranslation('translation');

    const animatedStyle = useAnimatedStyle(() => {
      const scale = interpolate(
        animationValue.value,
        [-1, 0, 1],
        [0.95, 1, 0.95],
      );
      const opacity = interpolate(
        animationValue.value,
        [-1, 0, 1],
        [0.8, 1, 0.8],
      );
      return { transform: [{ scale }], opacity };
    });

    if (!food) {
      return (
        <Animated.View style={animatedStyle} className="px-2">
          <ClassicFoodCardSkeleton />
        </Animated.View>
      );
    }

    return (
      <Animated.View style={animatedStyle} className="px-2">
        <ClassicFoodCard
          id={food.id}
          restaurantId={food.restaurant.id}
          foodName={food.name}
          foodPrice={food.price}
          restaurantName={food.restaurant.name}
          distance={food.distanceKm || food.distance}
          rating={food.restaurant?.rating || null}
          status={food.isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}
          imageUrl={food.pictureUrl}
          deliveryStatus={food.isAvailable ? t('available') : t('sold_out')}
          deliveryFee={food.deliveryFee}
          isAvailable={food.isAvailable}
        />
      </Animated.View>
    );
  },
);

CarouselItem.displayName = 'CarouselItem';

// Section types for FlatList
type HomeSectionItem =
  | { type: 'header'; title: string; onPress: (() => void) | null }
  | { type: 'search' }
  | { type: 'category'; data: any[] }
  | { type: 'carousel'; data: FoodProps[] }
  | { type: 'recommended'; data: FoodProps[] }
  | { type: 'restaurants'; data: RestaurantProps[] }
  | {
      type: 'loading';
      skeletonType: 'carousel' | 'foods' | 'restaurants';
      count: number;
    }
  | { type: 'error'; errorType: 'food' | 'restaurant'; onRetry: () => void }
  | {
      type: 'empty';
      emptyType: 'carousel' | 'recommended' | 'restaurants';
      onActionPress?: () => void;
    };

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const [refreshing, setRefreshing] = useState(false);
  const tabBarHeight = useFloatingTabBarHeight();

  // Get location info for debugging
  const { nearLat, nearLng, locationSource, hasLocation } =
    useLocationForQueries();

  // Log location data for debugging
  console.log('🏠 HomeScreen Location Data:', {
    coordinates: { lat: nearLat, lng: nearLng },
    locationSource,
    hasLocation,
    timestamp: new Date().toISOString(),
  });

  // Get categories from local data
  const { categories, isLoading: isCategoriesLoading } = useCategories();

  // Updated data fetching with new hooks
  const {
    data: browseRestaurants,
    isLoading: browseLoading,
    error: browseError,
    refetch: refetchBrowse,
  } = useBrowseRestaurants();

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

  // Use browse menu data if available, otherwise fallback to all menu data
  const foodData =
    browseMenuData && browseMenuData.length > 0 ? browseMenuData : allMenuData;

  // Simplified loading state
  const isLoading =
    browseLoading || allLoading || browseMenuLoading || allMenuLoading;
  const hasError =
    (browseError && allError) || (browseMenuError && allMenuError);

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
        refetchBrowseMenu(),
        refetchAllMenu(),
        // Categories refetch handled by unified hook
      ]);
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refetchBrowse, refetchAll, refetchBrowseMenu, refetchAllMenu]);

  // Navigation handlers
  const handleSearchPress = useCallback(() => {
    navigation.navigate('SearchScreen', { type: 'search' });
  }, [navigation]);

  const handleNearbyRestaurantsPress = useCallback(() => {
    navigation.navigate('NearbyRestaurants');
  }, [navigation]);

  // Memoized render functions
  const renderDiscountCarouselItem = useCallback(
    ({
      index,
      animationValue,
    }: {
      index: number;
      animationValue: SharedValue<number>;
    }) => {
      const food = foodData?.[index];
      return <CarouselItem food={food} animationValue={animationValue} />;
    },
    [foodData],
  );

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
        image={item.image}
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
  const carouselData = useMemo(() => foodData?.slice(0, 6) || [], [foodData]);
  const recommendedFoodData = useMemo(
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

      // Discounts Guaranteed - Carousel Section
      { type: 'header', title: t('discount_guaranteed'), onPress: null },
    ];

    // Add carousel content
    if (isLoading) {
      data.push({
        type: 'loading',
        skeletonType: 'carousel',
        count: SKELETON_COUNTS.carousel,
      });
    } else if (hasError) {
      data.push({
        type: 'error',
        errorType: 'food',
        onRetry: () => {
          refetchBrowseMenu();
          refetchAllMenu();
        },
      });
    } else if (carouselData.length === 0) {
      data.push({
        type: 'empty',
        emptyType: 'carousel',
        onActionPress: () =>
          navigation.navigate('SearchScreen', { type: 'search' }),
      });
    } else {
      data.push({ type: 'carousel', data: carouselData });
    }

    // Recommended for You Section
    data.push({
      type: 'header',
      title: t('recommended_for_you'),
      onPress: () => navigation.navigate('SearchScreen', { type: 'search' }),
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
    } else if (recommendedFoodData.length === 0) {
      data.push({
        type: 'empty',
        emptyType: 'recommended',
        onActionPress: () =>
          navigation.navigate('SearchScreen', { type: 'search' }),
      });
    } else {
      data.push({ type: 'recommended', data: recommendedFoodData });
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

    return data;
  }, [
    t,
    isLoading,
    hasError,
    browseMenuError,
    allMenuError,
    browseError,
    allError,
    carouselData,
    recommendedFoodData,
    restaurantData,
    categoriesForDisplay,
    refetchBrowseMenu,
    refetchAllMenu,
    refetchBrowse,
    handleNearbyRestaurantsPress,
    navigation,
  ]);

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

        case 'carousel':
          return (
            <View className="mb-5" style={{ height: CAROUSEL_CONFIG.height }}>
              <Carousel
                width={CAROUSEL_CONFIG.width}
                height={CAROUSEL_CONFIG.height}
                autoPlay
                autoPlayInterval={CAROUSEL_CONFIG.autoPlayInterval}
                data={item.data}
                scrollAnimationDuration={CAROUSEL_CONFIG.animationDuration}
                renderItem={renderDiscountCarouselItem}
                style={{
                  width: width,
                  height: CAROUSEL_CONFIG.height,
                  backgroundColor: colors.background,
                }}
                mode="parallax"
                modeConfig={{
                  parallaxScrollingScale: 0.9,
                  parallaxScrollingOffset: 40,
                }}
              />
            </View>
          );

        case 'recommended':
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
                showsVerticalScrollIndicator={false}
                keyExtractor={(restaurantItem) => restaurantItem.id}
                renderItem={renderRestaurantItem}
                contentContainerStyle={{ paddingHorizontal: 8 }}
              />
            </View>
          );

        case 'loading':
          switch (item.skeletonType) {
            case 'carousel':
              return (
                <View
                  className="mb-5"
                  style={{ height: CAROUSEL_CONFIG.height }}
                >
                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={Array(item.count).fill(0)}
                    keyExtractor={(_, index) => `skeleton-carousel-${index}`}
                    renderItem={() => (
                      <View className="px-2">
                        <ClassicFoodCardSkeleton />
                      </View>
                    )}
                  />
                </View>
              );
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
                    : t('network_error_restaurant')
                }
                onRetry={item.onRetry}
              />
            </View>
          );

        case 'empty':
          const getEmptyStateProps = () => {
            switch (item.emptyType) {
              case 'carousel':
                return {
                  icon: 'pricetag-outline' as const,
                  title: t('no_discounts_available'),
                  description: t('no_discounts_description'),
                  actionText: t('view_all_food'),
                };
              case 'recommended':
                return {
                  icon: 'restaurant-outline' as const,
                  title: t('no_recommendations'),
                  description: t('no_recommendations_description'),
                  actionText: t('explore_menu'),
                };
              case 'restaurants':
                return {
                  icon: 'storefront-outline' as const,
                  title: t('no_restaurants_found'),
                  description: t('no_restaurants_description'),
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
      renderDiscountCarouselItem,
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