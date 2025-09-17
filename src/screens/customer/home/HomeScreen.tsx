import React, { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import CommonView from '@/src/components/common/CommonView';
import { TextInput, useTheme } from 'react-native-paper';
import { useCategoryOptions } from '@/src/hooks/customer/useCategoriesApi';
import { images } from '@/assets/images';
import CategoryItem from '@/src/components/customer/CategoryItem';
// Removed HomeHeader as per requirement to remove customer headers
import FoodItemCard from '@/src/components/customer/FoodItemCard';
import {
  ScrollView,
  View,
  Dimensions,
  RefreshControl,
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
import PromotionCard from '@/src/components/customer/PromotionCard';
import { FlatList } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import {
  useAllRestaurants,
  useGetAllMenu,
  useGetAllMenuBrowse,
} from '@/src/hooks/customer';
import { useLocation, LocationPermissionModal } from '@/src/location';
import { FoodProps, RestaurantCard as RestaurantCardType } from '@/src/types';
import RestaurantCardSkeleton from '@/src/components/customer/RestaurantCardSkeleton';
import FoodItemCardSkeleton from '@/src/components/customer/FoodItemCardSkeleton';
import ClassicFoodCardSkeleton from '@/src/components/customer/ClassicFoodCardSkeleton';
import ErrorDisplay from '@/src/components/common/ErrorDisplay';

const { width } = Dimensions.get('window');
RestaurantCard
// Constants
const CAROUSEL_CONFIG = {
  width: width * 0.65,
  height: 300,
  autoPlayInterval: 5000, // Increased for better UX
  animationDuration: 800, // Reduced for smoother animation
  parallaxScale: 0.92,
  parallaxOffset: 35,
} as const;

const SKELETON_COUNTS = {
  restaurants: 3, // Reduced for faster loading
  foods: 3,
  carousel: 2,
} as const;

// Optimized CarouselItem with stable props
interface CarouselItemProps {
  food?: FoodProps;
  animationValue: SharedValue<number>;
}

const CarouselItem = React.memo<CarouselItemProps>(({ food, animationValue }) => {
  const { t } = useTranslation('translation');
  
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [CAROUSEL_CONFIG.parallaxScale, 1, CAROUSEL_CONFIG.parallaxScale],
    );
    const opacity = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [0.8, 1, 0.8],
    );
    return {
      transform: [{ scale }],
      opacity,
    };
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
        restaurantId={food.restaurant?.id}
        foodName={food.name}
        foodPrice={food.price}
        restaurantName={food.restaurant?.name || 'Restaurant inconnu'}
        distance={food.distance}
        rating={food.rating || 4.5}
        status={food.isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}
        imageUrl={food.image}
        deliveryStatus={food.isAvailable ? t('available') : t('sold_out')}
      />
    </Animated.View>
  );
});
CarouselItem.displayName = 'CarouselItem';

// Optimized loading section
interface LoadingSectionProps {
  count: number;
  SkeletonComponent: React.ComponentType;
  horizontal?: boolean;
}

const LoadingSection = React.memo<LoadingSectionProps>(({ 
  count, 
  SkeletonComponent, 
  horizontal = true 
}) => {
  const { colors } = useTheme();
  
  const skeletonItems = useMemo(() => 
    Array.from({ length: count }, (_, index) => (
      <SkeletonComponent key={`skeleton-${index}`} />
    )), 
    [count, SkeletonComponent]
  );
  
  if (horizontal) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4 py-2"
        style={{ backgroundColor: colors.background }}
      >
        {skeletonItems}
      </ScrollView>
    );
  }

  return (
    <View className="px-4 py-2" style={{ backgroundColor: colors.background }}>
      {skeletonItems}
    </View>
  );
});
LoadingSection.displayName = 'LoadingSection';

interface HomeScreenProps extends CustomerHomeStackScreenProps<'HomeScreen'> {}

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const [refreshing, setRefreshing] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  
  // Get categories from API
  const { data: categories, isLoading: isCategoriesLoading } = useCategoryOptions();

  // Location hook with optimized options
  const {
    location,
    isLoading: isLocationLoading,
    hasPermission,
    refreshLocation,
    requestPermission,
    setFallbackLocation,
  } = useLocation({
    autoInit: true,
    showPermissionAlert: false, // Handle manually for better UX
    showServicesAlert: false,
    fallbackToYaounde: true,
    enableHighAccuracy: false, // Better performance for Cameroon
  });

  // Stable query options with proper memoization
  const queryOptions = useMemo(() => {
    const hasValidLocation = location?.latitude && location?.longitude && !location.isFallback;

    return {
      restaurant: {
        isOpen: true,
        sortDir: 'ASC' as const,
        ...(hasValidLocation && {
          nearLat: location.latitude,
          nearLng: location.longitude,
          distance: 'distance' as const,
        }),
      },
      food: hasValidLocation ? {
        nearLat: location.latitude,
        nearLng: location.longitude,
        isOpen: true,
        sortDir: 'ASC' as const,
      } : null,
    };
  }, [location?.latitude, location?.longitude, location?.isFallback]);

  // Use conditional hooks properly
  const restaurantQuery = useAllRestaurants(queryOptions.restaurant);
  
  // Only use location-based food query if we have valid location
  const locationBasedFoodQuery = useGetAllMenuBrowse(
    queryOptions.food,
    { enabled: !!queryOptions.food }
  );
  
  // Always use general food query as fallback
  const generalFoodQuery = useGetAllMenu({
    enabled: !queryOptions.food, // Only when location-based is disabled
  });

  // Select the appropriate food data
  const foodQuery = queryOptions.food ? locationBasedFoodQuery : generalFoodQuery;

  // Destructure with stable names
  const {
    data: foodData,
    isLoading: isFoodLoading,
    refetch: refetchFood,
    error: foodError,
  } = foodQuery;

  const {
    data: restaurantData,
    isLoading: isRestaurantLoading,
    refetch: refetchRestaurants,
    error: restaurantError,
  } = restaurantQuery;

  // Optimized loading state
  const isDataLoading = isFoodLoading || isRestaurantLoading;
  const hasDataError = !!(foodError || restaurantError);

  // Stable refs for cleanup
  const refreshTimeoutRef = useRef<number | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  // Optimized refresh with debouncing
  const onRefresh = useCallback(async () => {
    if (refreshing) return;

    // Clear any pending refresh
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    
    setRefreshing(true);
    
    try {
      // Parallel execution for better performance
      await Promise.allSettled([
        refreshLocation(),
        refetchRestaurants(),
        refetchFood(),
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      // Add small delay to prevent rapid successive refreshes
      refreshTimeoutRef.current = setTimeout(() => {
        setRefreshing(false);
      }, 500);
    }
  }, [refreshing, refreshLocation, refetchRestaurants, refetchFood]);

  // Handle permission request with better UX
  const handleRequestPermission = useCallback(async () => {
    try {
      const granted = await requestPermission();
      if (granted) {
        setShowPermissionModal(false);
        // Auto-refresh location after permission granted
        await refreshLocation();
      }
    } catch (error) {
      console.error('Permission request failed:', error);
    }
  }, [requestPermission, refreshLocation]);

  const handlePermissionDenied = useCallback(() => {
    setFallbackLocation();
    setShowPermissionModal(false);
  }, [setFallbackLocation]);

  // Optimized address press handler
  const handleAddressPress = useCallback(async () => {
    if (!location || location.isFallback) {
      // Show permission modal if no location or using fallback
      setShowPermissionModal(true);
    } else if (hasPermission) {
      // Refresh current location
      await refreshLocation();
    } else {
      setShowPermissionModal(true);
    }
  }, [location, hasPermission, refreshLocation]);

  // Stable render functions with proper memoization
  const renderDiscountCarouselItem = useCallback(
    ({ index, animationValue }: { index: number; animationValue: SharedValue<number> }) => {
      const food = Array.isArray(foodData) ? foodData[index] : undefined;
      return <CarouselItem food={food} animationValue={animationValue} />;
    },
    [foodData]
  );

  const handleSearchPress = useCallback(() => {
    navigation.navigate('SearchScreen', { type: 'search' });
  }, [navigation]);

  const handleNearbyRestaurantsPress = useCallback(() => {
    navigation.navigate('NearbyRestaurants');
  }, [navigation]);

  // Optimized render functions
  const renderRestaurantItem = useCallback(
    ({ item }: { item: RestaurantCardType }) => (
      <RestaurantCard
        key={item.restaurantId}
        deliveryFee={item.deliveryFee}
        distanceFromUser={item.distanceFromUser}
        estimatedTime={item.estimatedDeliveryTime}
        image={item.imageUrl}
        rating={item.rating || 4.5}
        restaurantName={item.name}
        restaurantID={item.restaurantId}
        deliveryPrice={item.deliveryPrice}
        distance={item.distance}
      />
    ),
    []
  );

  const renderFoodItem = useCallback(
    ({ item }: { item: FoodProps }) => (
      <FoodItemCard
        key={item.id}
        foodId={item.id}
        restarantId={item.restaurant?.id || ''}
        FoodName={item.name}
        FoodPrice={item.price}
        FoodImage={item.image}
        RestarantName={item.restaurant?.name || 'Restaurant inconnu'}
        distanceFromUser={item.distance || 0}
        DeliveryPrice={item.deliveryPrice || 500}
      />
    ),
    []
  );

  const renderCategoryItem = useCallback(
    ({ item }: { item: { value: string; label: string } }) => (
      <CategoryItem 
        key={item.value} 
        image={images.onboarding1} // Use default image for now
        title={item.label} 
      />
    ),
    []
  );

  // Memoize carousel data for performance
  const carouselData = useMemo(() => 
    Array.isArray(foodData) ? foodData.slice(0, 6) : [], 
    [foodData]
  );

  const recommendedFoodData = useMemo(() => 
    Array.isArray(foodData) ? foodData.slice(0, 8) : [], 
    [foodData]
  );

  return (
    <CommonView>
      <ScrollView
        style={{ backgroundColor: colors.background }}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
        removeClippedSubviews={true}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
            progressBackgroundColor={colors.background}
          />
        }
        accessibilityLabel={t('home')}
      >
        {/* Removed HomeHeader as per requirement to remove customer headers */}

        {/* Search Bar */}
        <View
          className="px-4 py-3"
          style={{ backgroundColor: colors.background }}
        >
          <TextInput
            placeholder={t('search_your_craving')}
            accessibilityLabel={t('search_for_food')}
            accessibilityHint={t('search_for_food')}
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
            style={{
              backgroundColor: colors.surfaceVariant,
            }}
            className="py-1 px-3 rounded-2xl"
            placeholderTextColor={colors.onBackground}
            onPressIn={handleSearchPress}
            editable={false}
            pointerEvents="box-only"
          />
        </View>

        {/* Promotions Section */}
        <HomeScreenHeaders 
          title={t('promotion')} 
          onPress={() => {}} 
        />
        <View className="px-4 mb-4">
          <PromotionCard
            color="#007aff"
            image={images.onboarding3}
            percentage={40}
            days={4}
          />
        </View>

        {/* Quick Filters Section */}
        <HomeScreenHeaders 
          title={t('quick_filters')} 
          onPress={() => {}} 
        />
        <View className="mb-4">
          {isCategoriesLoading ? (
            <LoadingSection 
              count={4}
              SkeletonComponent={() => (
                <View style={{ width: 80, height: 80, backgroundColor: colors.surfaceVariant, borderRadius: 8, margin: 4 }} />
              )}
            />
          ) : (
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={categories}
              keyExtractor={(item) => item.value}
              renderItem={renderCategoryItem}
              className="px-2"
              contentContainerStyle={{ paddingHorizontal: 8 }}
              removeClippedSubviews={true}
              initialNumToRender={4}
              maxToRenderPerBatch={2}
              windowSize={6}
            />
          )}
        </View>

        {/* Discounts Guaranteed - Carousel Section */}
        <HomeScreenHeaders
          title={t('discount_guaranteed')}
          onPress={() => {}}
        />
        <View className="mb-5" style={{ height: CAROUSEL_CONFIG.height }}>
          {isDataLoading ? (
            <LoadingSection 
              count={SKELETON_COUNTS.carousel}
              SkeletonComponent={ClassicFoodCardSkeleton}
            />
          ) : hasDataError ? (
            <ErrorDisplay
              title={t('network_error_food')}
              onRetry={refetchFood}
            />
          ) : (
            <Carousel
              width={CAROUSEL_CONFIG.width}
              height={CAROUSEL_CONFIG.height}
              autoPlay
              autoPlayInterval={CAROUSEL_CONFIG.autoPlayInterval}
              data={carouselData}
              scrollAnimationDuration={CAROUSEL_CONFIG.animationDuration}
              renderItem={renderDiscountCarouselItem}
              style={{
                width: width,
                height: CAROUSEL_CONFIG.height,
                backgroundColor: colors.background,
              }}
              pagingEnabled={false}
              snapEnabled
              mode="parallax"
              modeConfig={{
                parallaxScrollingScale: CAROUSEL_CONFIG.parallaxScale,
                parallaxScrollingOffset: CAROUSEL_CONFIG.parallaxOffset,
              }}
              windowSize={4}
            />
          )}
        </View>

        {/* Recommended for You Section */}
        <HomeScreenHeaders
          title={t('recommended_for_you')}
          onPress={() => {}}
        />
        <View className="mb-4">
          {isDataLoading ? (
            <LoadingSection 
              count={SKELETON_COUNTS.foods}
              SkeletonComponent={FoodItemCardSkeleton}
            />
          ) : foodError ? (
            <ErrorDisplay
              title={t('network_error_food')}
              onRetry={refetchFood}
            />
          ) : (
            <FlatList
              data={recommendedFoodData}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderFoodItem}
              style={{ backgroundColor: colors.background }}
              className="px-2"
              contentContainerStyle={{ paddingHorizontal: 8 }}
              removeClippedSubviews={true}
              initialNumToRender={3}
              maxToRenderPerBatch={2}
              windowSize={6}
              getItemLayout={(_, index) => ({
                length: 200, // Approximate width of FoodItemCard
                offset: 200 * index,
                index,
              })}
            />
          )}
        </View>

        {/* Restaurants Near You Section */}
        <HomeScreenHeaders
          title={t('restaurant_near_you')}
          onPress={handleNearbyRestaurantsPress}
        />
        <View className="mb-6">
          {isDataLoading ? (
            <LoadingSection 
              count={SKELETON_COUNTS.restaurants}
              SkeletonComponent={RestaurantCardSkeleton}
            />
          ) : restaurantError ? (
            <ErrorDisplay
              title={t('network_error_restaurant')}
              onRetry={refetchRestaurants}
            />
          ) : (
            <FlatList
              data={restaurantData || []}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.restaurantId}
              renderItem={renderRestaurantItem}
              style={{ backgroundColor: colors.background }}
              className="px-2"
              contentContainerStyle={{ paddingHorizontal: 8 }}
              removeClippedSubviews={true}
              initialNumToRender={3}
              maxToRenderPerBatch={2}
              windowSize={6}
              getItemLayout={(_, index) => ({
                length: 280, // Approximate width of RestaurantCard
                offset: 280 * index,
                index,
              })}
            />
          )}
        </View>
      </ScrollView>

      {/* Location Permission Modal - Only render when needed */}
      {showPermissionModal && (
        <LocationPermissionModal
          visible={showPermissionModal}
          onRequestPermission={handleRequestPermission}
          onDeny={handlePermissionDenied}
          onClose={() => setShowPermissionModal(false)}
          isLoading={isLocationLoading}
        />
      )}
    </CommonView>
  );
};

export default React.memo(HomeScreen);
