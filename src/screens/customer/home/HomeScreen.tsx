import React, { useCallback, useMemo, useState } from 'react';
import CommonView from '@/src/components/common/CommonView';
import { TextInput, useTheme, Text } from 'react-native-paper';
import { CategoryFilters, images } from '@/assets/images';
import CategoryItem from '@/src/components/customer/CategoryItem';
import HomeHeader from '@/src/components/customer/HomeHeader';
import FoodItemCard from '@/src/components/customer/FoodItemCard';
import {
  ScrollView,
  View,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { CustomerHomeStackScreenProps } from '@/src/navigation/types';
import { RestaurantCard } from '@/src/components/customer/RestaurantCard';
import HomeScreenHeaders from '@/src/components/customer/HomeScreenHeaders';
import Animated, {
  interpolate,
  useAnimatedStyle,
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

const { width } = Dimensions.get('window');

const HomeScreen = ({
  navigation,
}: CustomerHomeStackScreenProps<'HomeScreen'>) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const [refreshing, setRefreshing] = useState(false);

  const {
    location,
    isLoading: isLocationLoading,
    hasPermission,
    refreshLocation,
    requestPermission,
    setFallbackLocation,
  } = useLocation();

  const [showPermissionModal, setShowPermissionModal] = useState(false);

  // Memoize query options for better performance
  const restaurantQueryOptions = useMemo(() => {
    const options: any = { isOpen: true, sortDir: 'ASC' };
    if (
      hasPermission &&
      location?.latitude &&
      location?.longitude &&
      !location.isFallback
    ) {
      options.nearLat = location.latitude;
      options.nearLng = location.longitude;
      options.distance = 'distance';
    }
    return options;
  }, [location, hasPermission]);

  const foodQueryOptions = useMemo(() => {
    if (
      hasPermission &&
      location?.latitude &&
      location?.longitude &&
      !location.isFallback
    ) {
      return {
        nearLat: location.latitude,
        nearLng: location.longitude,
      };
    }
    return null;
  }, [location, hasPermission]);

  // API queries
  const {
    data: restaurantData,
    isLoading: isRestaurantLoading,
    refetch: refetchRestaurants,
    error: restaurantError,
  } = useAllRestaurants(restaurantQueryOptions);

  const {
    data: foodData,
    isLoading: isFoodLoading,
    refetch: refetchFood,
    error: foodError,
  } = foodQueryOptions
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useGetAllMenuBrowse({
        nearLat: foodQueryOptions.nearLat,
        nearLng: foodQueryOptions.nearLng,
        isOpen: true,
        sortDir: 'ASC',
      })
    : // eslint-disable-next-line react-hooks/rules-of-hooks
      useGetAllMenu();

  // Handle refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refreshLocation(),
        refetchRestaurants(),
        refetchFood(),
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshLocation, refetchRestaurants, refetchFood]);

  // Handle permission request
  const handleRequestPermission = useCallback(async () => {
    try {
      const granted = await requestPermission();
      if (granted) {
        setShowPermissionModal(false);
      }
    } catch (error) {
      console.error('Permission request failed:', error);
    }
  }, [requestPermission]);

  // Handle permission denial
  const handlePermissionDenied = useCallback(() => {
    setFallbackLocation();
    setShowPermissionModal(false);
  }, [setFallbackLocation]);

  // Handle address press - simple location refresh
  const handleAddressPress = useCallback(async () => {
    if (hasPermission) {
      await refreshLocation();
    } else {
      setShowPermissionModal(true);
    }
  }, [hasPermission, refreshLocation]);

  // Carousel item renderer (memoized)
  const RenderDiscountCarouselItem = useCallback(
    ({ index, animationValue }: any) => {
      const food = foodData[index];

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
        return {
          transform: [{ scale }],
          opacity,
        };
      });

      return (
        <Animated.View style={[animatedStyle, { paddingHorizontal: 8 }]}>
          <ClassicFoodCard
            id={food.id}
            restaurantId={food.restaurant?.id}
            foodName={food.name}
            foodPrice={food.price}
            restaurantName={food.restaurant!.name}
            distance={food.distance}
            rating={food?.rating || 4.5}
            status={food.discount ? 'PROMO' : 'AVAILABLE'}
            imageUrl={food.image}
            deliveryStatus={food.isAvailable ? t('available') : t('sold_out')}
          />
        </Animated.View>
      );
    },
    [foodData, t],
  );

  // Handle search navigation
  const handleSearchPress = useCallback(() => {
    navigation.navigate('SearchScreen', { type: 'search' });
  }, [navigation]);

  // Handle nearby restaurants navigation
  const handleNearbyRestaurantsPress = useCallback(() => {
    navigation.navigate('NearbyRestaurants');
  }, [navigation]);

  // Memoized render functions
  const renderRestaurantItem = useCallback(
    ({ item }) => (
      <RestaurantCard
        key={item.restaurantID}
        deliveryFee={item.deliveryFee}
        distanceFromUser={item.distanceFromUser}
        estimatedTime={item.estimatedTime}
        image={item.imageUrl}
        rating={item.rating}
        restaurantName={item.name}
        restaurantID={item.restaurantId}
      />
    ),
    [],
  );

  const renderFoodItem = useCallback(
    ({ item }) => (
      <FoodItemCard
        key={item.id}
        foodId={item.id}
        restarantId={item.restaurant.id}
        FoodName={item.name}
        FoodPrice={item.price}
        FoodImage={item.pictureUrl}
        RestarantName={item.restaurant.name}
        distanceFromUser={item.distanceKm}
        DeliveryPrice={item.restaurant?.deliveryFee || 500}
        rating={item.rating || 4.5}
        ratingCount={item.ratingCount || 1000}
        hasPromo={!!item.discount}
      />
    ),
    [],
  );

  return (
    <CommonView>
      <ScrollView
        style={{ backgroundColor: colors.background }}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
        stickyHeaderHiddenOnScroll={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Simplified Header */}
        <HomeHeader
          navigation={navigation}
          location={location}
          onLocationPress={handleAddressPress}
        />

        {/* Search Bar */}
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
                background={colors.surfaceVariant}
                className="pt-3 pl-2"
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
              paddingTop: 5,
              paddingBottom: 5,
              paddingRight: 10,
              paddingLeft: 10,
            }}
            placeholderTextColor={colors.onBackground}
            onPressIn={handleSearchPress}
          />
        </View>

        {/* Promotions Section */}
        <HomeScreenHeaders title={t('promotion')} onPress={() => {}} />
        <PromotionCard
          color={'#007aff'}
          image={images.onboarding3}
          percentage={40}
          days={4}
        />

        {/* Quick Filters Section */}
        <HomeScreenHeaders title={t('quick_filters')} onPress={() => {}} />
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={CategoryFilters}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CategoryItem image={item.image} title={item.title} />
          )}
        />

        {/* Discounts Guaranteed - Carousel Section */}
        <HomeScreenHeaders
          title={t('discount_guaranteed')}
          onPress={() => {}}
        />
        <View style={{ marginBottom: 20 }}>
          <Carousel
            width={width * 0.65}
            height={300}
            autoPlay={true}
            autoPlayInterval={4000}
            data={Array.isArray(foodData) ? foodData : []}
            scrollAnimationDuration={1000}
            renderItem={RenderDiscountCarouselItem}
            style={{
              width: width,
              height: 300,
              backgroundColor: colors.surfaceVariant,
              marginLeft: 0,
              borderRadius: 10,
            }}
            pagingEnabled={false}
            snapEnabled={true}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.9,
              parallaxScrollingOffset: 40,
            }}
          />
        </View>

        {/* Recommended for You Section */}
        <HomeScreenHeaders
          title={t('recommended_for_you')}
          onPress={() => {}}
        />
        {isFoodLoading ? (
          <View className="py-8">
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : foodError ? (
          <View className="px-4 py-8">
            <Text
              className="text-center mb-4"
              style={{ color: colors.onSurface }}
            >
              {t('network_error_food')}
            </Text>
            <TouchableOpacity
              className="bg-blue-600 py-2 px-4 rounded-lg self-center"
              onPress={() => refetchFood()}
            >
              <Text className="text-white font-semibold">{t('retry')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={Array.isArray(foodData) ? foodData : []}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={renderFoodItem}
            initialNumToRender={4}
          />
        )}

        {/* Restaurants Near You Section */}
        <HomeScreenHeaders
          title={t('restaurant_near_you')}
          onPress={handleNearbyRestaurantsPress}
        />

        {isRestaurantLoading ? (
          <View className="py-8">
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : restaurantError ? (
          <View className="px-4 py-8">
            <Text
              className="text-center mb-4"
              style={{ color: colors.onSurface }}
            >
              {t('network_error_restaurant')}
            </Text>
            <TouchableOpacity
              className="bg-blue-600 py-2 px-4 rounded-lg self-center"
              onPress={() => refetchRestaurants()}
            >
              <Text className="text-white font-semibold">{t('retry')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={
              Array.isArray(restaurantData) ? restaurantData : []
            }
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.restaurantId}
            renderItem={renderRestaurantItem}
          />
        )}
      </ScrollView>

      {/* Location Permission Modal */}
      <LocationPermissionModal
        visible={showPermissionModal}
        onRequestPermission={handleRequestPermission}
        onDeny={handlePermissionDenied}
        onClose={() => setShowPermissionModal(false)}
        isLoading={isLocationLoading}
      />
    </CommonView>
  );
};

export default React.memo(HomeScreen);
