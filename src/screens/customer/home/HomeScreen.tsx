import React, { useCallback, useMemo, useState, useRef } from 'react';
import CommonView from '@/src/components/common/CommonView';
import { TextInput, useTheme } from 'react-native-paper';
import { images } from '@/assets/images';
import { getMainCategories, mapApiCategoriesToUI } from '@/src/constants/categories';
import CategoryItem from '@/src/components/customer/CategoryItem';
import HomeHeader from '@/src/components/customer/HomeHeader';
import FoodItemCard from '@/src/components/customer/FoodItemCard';
import {
  View,
  Dimensions,
  RefreshControl,
  FlatList,
  ListRenderItem,
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
  useGetAllMenuItem,
  useAllRestaurants,
  useNearbyRestaurants,
  useMenuCategories,
} from '@/src/hooks/customer/useCustomerApi';
import { FoodProps, RestaurantCard as RestaurantProps } from '@/src/types';
import RestaurantCardSkeleton from '@/src/components/customer/RestaurantCardSkeleton';
import FoodItemCardSkeleton from '@/src/components/customer/FoodItemCardSkeleton';
import ClassicFoodCardSkeleton from '@/src/components/customer/ClassicFoodCardSkeleton';
import ErrorDisplay from '@/src/components/common/ErrorDisplay';
import EmptyState from '@/src/components/common/EmptyState';

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

interface HomeScreenProps extends CustomerHomeStackScreenProps<'HomeScreen'> {}

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
          foodPrice={parseFloat(food.price)}
          restaurantName={food.restaurant.name}
          distance={food.distanceKm || 0}
          rating={4.5} // Default rating since not in API
          status={food.isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}
          imageUrl={food.pictureUrl}
          deliveryStatus={food.isAvailable ? t('available') : t('sold_out')}
        />
      </Animated.View>
    );
  },
);

CarouselItem.displayName = 'CarouselItem';

// Section types for FlatList
type HomeSectionItem =
  | { type: 'header'; title: string; onPress: () => void }
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
  
  // Use refs to prevent unnecessary re-renders
  const lastRefreshTime = useRef<number>(0);
  const refreshThrottle = 2000; // 2 seconds throttle

  // Updated data fetching with new hooks
  const {
    data: nearbyRestaurants,
    isLoading: nearbyLoading,
    error: nearbyError,
    refetch: refetchNearby,
  } = useNearbyRestaurants();

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

  const {
    data: menuData,
    isLoading: menuLoading,
    error: menuError,
    refetch: refetchMenu,
  } = useGetAllMenuItem();

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useMenuCategories();

  // Determine which data to use
  const restaurantData =
    nearbyRestaurants && nearbyRestaurants.length > 0
      ? nearbyRestaurants
      : allRestaurants;
  const foodData = menuData;

  // Simplified loading state
  const isLoading = nearbyLoading || allLoading || menuLoading;
  const hasError = (nearbyError && allError) || menuError;

  // Memoized categories data
  const categoriesForDisplay = useMemo(() => {
    if (categoriesData && categoriesData.length > 0) {
      return mapApiCategoriesToUI(categoriesData);
    }
    // Fallback to static categories if API fails
    return getMainCategories();
  }, [categoriesData]);

  // Simplified refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchNearby(), refetchAll(), refetchMenu(), refetchCategories()]);
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refetchNearby, refetchAll, refetchMenu, refetchCategories]);

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
        name={item.name}
        address={item.address}
        isOpen={item.isOpen}
        verificationStatus={item.verificationStatus}
        rating={item.rating}
        ratingCount={item.ratingCount}
        id={item.id}
        deliveryPrice={500} // Default value
        estimatedTime={30} // Default value
        distance={0} // Default value
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
        FoodPrice={parseFloat(item.price)}
        FoodImage={item.pictureUrl}
        distanceFromUser={item.distanceKm || 0}
        DeliveryPrice={500} // Default value
        isAvailable={item.isAvailable}
          RestaurantName={item.restaurant?.name}  
      />
    ),
    [],
  );

  const renderCategoryItem = useCallback(
    ({ item }: { item: any }) => (
      <CategoryItem 
        key={item.id} 
        image={item.image} 
        title={item.title}
        categoryId={item.id.toString()}
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
      { type: 'header', title: t('categories'), onPress: () => {} },
      {
        type: 'category',
        data: categoriesForDisplay,
      },

      // Discounts Guaranteed - Carousel Section
      { type: 'header', title: t('discount_guaranteed'), onPress: () => {} },
    ];

    // Add carousel content
    if (isLoading) {
      data.push({
        type: 'loading',
        skeletonType: 'carousel',
        count: SKELETON_COUNTS.carousel,
      });
    } else if (hasError) {
      data.push({ type: 'error', errorType: 'food', onRetry: refetchMenu });
    } else if (carouselData.length === 0) {
      data.push({
        type: 'empty',
        emptyType: 'carousel',
        onActionPress: () => navigation.navigate('SearchScreen', { type: 'search' }),
      });
    } else {
      data.push({ type: 'carousel', data: carouselData });
    }

    // Recommended for You Section
    data.push({
      type: 'header',
      title: t('recommended_for_you'),
      onPress: () => {},
    });

    if (isLoading) {
      data.push({
        type: 'loading',
        skeletonType: 'foods',
        count: SKELETON_COUNTS.foods,
      });
    } else if (menuError) {
      data.push({ type: 'error', errorType: 'food', onRetry: refetchMenu });
    } else if (recommendedFoodData.length === 0) {
      data.push({
        type: 'empty',
        emptyType: 'recommended',
        onActionPress: () => navigation.navigate('SearchScreen', { type: 'search' }),
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
    } else if (nearbyError && allError) {
      data.push({
        type: 'error',
        errorType: 'restaurant',
        onRetry: refetchNearby,
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
    menuError,
    nearbyError,
    allError,
    carouselData,
    recommendedFoodData,
    restaurantData,
    categoriesForDisplay,
    refetchMenu,
    refetchNearby,
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
                title={
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
