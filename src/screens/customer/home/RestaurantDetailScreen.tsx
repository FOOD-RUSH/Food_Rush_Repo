import React, { useState } from 'react';
import { Pressable, ScrollView, FlatList } from 'react-native-gesture-handler';
import { Text, View, StatusBar, Dimensions, Image, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
  TouchableRipple,
  Chip,
  Button,
  ActivityIndicator,
  useTheme,
} from 'react-native-paper';
import { RootStackScreenProps } from '@/src/navigation/types';
import MenuItemCard from '@/src/components/customer/MenuItemCard';
import ClassicFoodCard from '@/src/components/customer/ClassicFoodCard';
import { useRestaurantId } from '@/src/hooks/customer';
import { useTranslation } from 'react-i18next';

const { width: screenWidth } = Dimensions.get('window');

const RestaurantDetailScreen = ({
  navigation,
  route,
}: RootStackScreenProps<'RestaurantDetails'>) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isFavorite, setIsFavorite] = useState(false);
  const restaurantId = route.params.restaurantId;

  // fetching restaurant Details
  const {
    data: restaurantDetails,
    isLoading,
    error,
    refetch,
  } = useRestaurantId(restaurantId);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    Alert.alert(
      isFavorite ? t('removed_from_favorites') : t('added_to_favorites'),
      isFavorite
        ? t('restaurant_removed_from_favorites')
        : t('restaurant_added_to_favorites'),
    );
  };

  const handleShare = () => {
    Alert.alert(t('share'), t('share_restaurant_functionality'));
  };

  const handleViewReviews = () => {};

  const handleViewLocation = () => {};

  const handleViewOffers = () => {};

  const categories = [
    'All',
    ...new Set(restaurantDetails?.menu?.map((item) => item.category) || []),
  ];
  const filteredMenuItems =
    selectedCategory === 'All'
      ? restaurantDetails?.menu
      : restaurantDetails?.menu.filter(
          (item) => item.category === selectedCategory,
        );

  if (isLoading) {
    return (
      <View
        className={`flex-1 justify-center items-center ${colors.background}`}
      >
        <ActivityIndicator size="large" color={colors.primary} animating />
        <Text className={`mt-4 `} style={{ color: colors.onSurface }}>
          {t('loading_restaurant_details')}
        </Text>
      </View>
    );
  }

  if (!restaurantDetails) {
    return (
      <View
        className={`flex-1 justify-center items-center ${colors.background}`}
      >
        <Text className={`${colors.onSurface}`}>
          {t('failed_to_load_restaurant_details')}
        </Text>
        <Button
          mode="contained"
          onPress={() => refetch()}
          className="mt-4"
          buttonColor={colors.primary}
          textColor="white"
        >
          {t('retry')}
        </Button>
      </View>
    );
  }
  const seperator = () => {
    return <View className="w-[5px]" />;
  };
  return (
    <ScrollView className={`flex-1 ${colors.background}`}>
      <StatusBar translucent backgroundColor="transparent" />

      {/* Header Image with Navigation */}
      <View className="relative">
        <Image
          source={restaurantDetails.image}
          width={screenWidth}
          height={200}
          resizeMode="cover"
          className="w-full h-[400px]"
        />
        {/* Navigation Header */}
        <View className="absolute top-12 left-0 right-0 flex-row justify-between items-center px-4">
          <Pressable
            onPress={handleGoBack}
            className="bg-white/20 rounded-full p-2 backdrop-blur-sm"
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </Pressable>

          <View className="flex-row space-x-3">
            <Pressable
              onPress={handleToggleFavorite}
              className="bg-white/20 rounded-full p-2 backdrop-blur-sm"
            >
              <MaterialIcons
                name={isFavorite ? 'favorite' : 'favorite-border'}
                size={24}
                color={isFavorite ? '#FF6B6B' : 'white'}
              />
            </Pressable>
            <Pressable
              onPress={handleShare}
              className="bg-white/20 rounded-full p-2 backdrop-blur-sm"
            >
              <MaterialIcons name="share" size={24} color="white" />
            </Pressable>
          </View>
        </View>
        {/* Status Badge */}
        <View className="absolute bottom-4 right-4">
          <Chip
            icon="clock-outline"
            className={`${restaurantDetails.isOpen ? 'bg-green-500' : 'bg-red-500'}`}
            textStyle={{ color: 'white' }}
          >
            {restaurantDetails.isOpen ? t('open') : t('closed')}
          </Chip>
        </View>
      </View>

      {/* Restaurant Information */}
      <View className="px-4 py-6">
        {/* Restaurant Name and Basic Info */}
        <View className="mb-6">
          <View className="flex-row justify-between items-start mb-2">
            <Text
              className={`text-2xl font-bold flex-1 `}
              style={{ color: colors.primary }}
            >
              {restaurantDetails.name}
            </Text>
            <View className="flex-row items-center">
              <Text className={`mr-1 `} style={{ color: colors.primary }}>
                {restaurantDetails.cuisine || t('vegetarian')}
              </Text>
              <Text className="font-semibold" style={{ color: colors.primary }}>
                {/* {restaurantDetails.priceRange} */} 500FCFA
              </Text>
            </View>
          </View>

          <Text className={`mb-4 `} style={{ color: colors.onSurface }}>
            {restaurantDetails.description}
          </Text>

          <View className="flex-row items-center mb-2">
            <Ionicons name="time-outline" size={16} color={colors.onSurface} />
            <Text className={`ml-2 `} style={{ color: colors.onSurface }}>
              {restaurantDetails.openTime}
            </Text>
          </View>
        </View>

        {/* Rating Section */}
        <TouchableRipple onPress={handleViewReviews}>
          <View className="flex-row justify-between items-center py-4 border-b border-gray-200">
            <View className="flex-row items-center">
              <Ionicons name="star" color="#FFD700" size={20} />
              <Text
                className={`ml-2 font-semibold text-base `}
                style={{ color: colors.onSurface }}
              >
                {restaurantDetails.ratings}
              </Text>
              <Text className={`ml-1 `} style={{ color: colors.onSurface }}>
                ({restaurantDetails.reviewCount} reviews)
              </Text>
            </View>
            <MaterialIcons
              name="arrow-forward-ios"
              size={16}
              color={colors.onSurface}
            />
          </View>
        </TouchableRipple>

        {/* Delivery Info */}
        <TouchableRipple onPress={handleViewLocation}>
          <View className="flex-row justify-between items-center py-4 border-b border-gray-200">
            <View className="flex-row items-center flex-1">
              <Ionicons
                name="location-outline"
                color={colors.primary}
                size={20}
              />
              <View className="ml-3 flex-1">
                <Text
                  className={`font-semibold text-base`}
                  style={{ color: colors.primary }}
                >
                  {restaurantDetails.distance}
                </Text>
                <View className="flex-row items-center mt-1">
                  <Text
                    className={`text-sm `}
                    style={{ color: colors.onSurface }}
                  >
                    {t('delivery_now')}
                  </Text>
                  <Text className="mx-2" style={{ color: colors.onSurface }}>
                    |
                  </Text>
                  <Ionicons name="car" size={16} color={colors.onSurface} />
                  <Text
                    className={`ml-1 text-sm `}
                    style={{ color: colors.onSurface }}
                  >
                    {restaurantDetails.deliveryFee}
                  </Text>
                  <Text className="mx-2" style={{ color: colors.onSurface }}>
                    |
                  </Text>
                  <Text
                    className={`text-sm `}
                    style={{ color: colors.onSurface }}
                  >
                    {restaurantDetails.deliveryTime}
                  </Text>
                </View>
              </View>
            </View>
            <MaterialIcons
              name="arrow-forward-ios"
              size={16}
              color={colors.onSurface}
            />
          </View>
        </TouchableRipple>

        {/* Offers Section */}
        <TouchableRipple onPress={handleViewOffers}>
          <View className="flex-row justify-between items-center py-4 border-b border-gray-200">
            <View className="flex-row items-center">
              <MaterialIcons
                name="local-offer"
                color={colors.primary}
                size={20}
              />
              <Text
                className={`ml-3 font-semibold text-base `}
                style={{ color: colors.onSurface }}
              >
                {t('special_offers_available')}
              </Text>
            </View>
            <MaterialIcons
              name="arrow-forward-ios"
              size={16}
              color={colors.onSurface}
            />
          </View>
        </TouchableRipple>

        {/* For You Section */}
        <View className="mt-8">
          <Text
            className={`text-xl font-bold mb-4`}
            style={{ color: colors.onSurface }}
          >
            {t('for_you')}
          </Text>
          <FlatList
            data={restaurantDetails.specialOffers}
            renderItem={({ item }) => (
              <ClassicFoodCard foodName={item.name} id={item.id} />
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
            ItemSeparatorComponent={seperator}
          />
        </View>

        {/* Menu Section */}
        <View className="mt-8">
          <Text
            className={`text-xl font-bold mb-4 `}
            style={{ color: colors.onSurface }}
          >
            {t('menu')}
          </Text>

          {/* Category Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4"
          >
            <View className="flex-row space-x-2">
              {categories.map((category) => (
                <TouchableRipple
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full mx-1 ${
                    selectedCategory === category ? `bg-primary` : `bg-blue-100`
                  }`}
                >
                  <Text
                    className={`${
                      selectedCategory === category ? 'text-white' : ``
                    } font-medium`}
                  >
                    {category}
                  </Text>
                </TouchableRipple>
              ))}
            </View>
          </ScrollView>

          {/* Menu Items */}
          <FlatList
            data={filteredMenuItems}
            renderItem={({ item }) => (
              <MenuItemCard
                id={item.id}
                name={item.name}
                price={item.price}
                restaurantID={item.restaurant?.id}
                description={item.description}
              />
            )}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default RestaurantDetailScreen;
