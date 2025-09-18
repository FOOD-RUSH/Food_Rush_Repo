import React, { useState, useMemo } from 'react';
import { Pressable, ScrollView, FlatList } from 'react-native-gesture-handler';
import { Text, View, StatusBar, Dimensions, Image, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { TouchableRipple, Chip, Button, useTheme } from 'react-native-paper';
import { RootStackScreenProps } from '@/src/navigation/types';
import MenuItemCard from '@/src/components/customer/MenuItemCard';
import ClassicFoodCard from '@/src/components/customer/ClassicFoodCard';
import { useRestaurantDetails } from '@/src/hooks/customer/useCustomerApi';
import { useTranslation } from 'react-i18next';
import { images } from '@/assets/images';
import { LoadingScreen } from '@/src/components/common';

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

  // fetching restaurant Details with new hook
  const {
    data: restaurantDetails,
    isLoading,
    error,
    refetch,
  } = useRestaurantDetails(restaurantId); // uses location from hook

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

  const handleViewReviews = () => {
    navigation.navigate('RestaurantReviews', {
      restaurantId,
      restaurantName: restaurantDetails?.name || 'Restaurant',
    });
  };

  const handleViewLocation = () => {};

  const handleViewOffers = () => {};

  // Extract unique categories from menu items
  const categories = useMemo(() => {
    if (!restaurantDetails?.menu) return ['All'];

    const uniqueCategories = new Set<string>();
    restaurantDetails.menu.forEach((item) => {
      // Try to categorize based on item name/description
      const itemName = item.name.toLowerCase();
      const itemDescription = item.description?.toLowerCase() || '';

      if (itemName.includes('local') || itemDescription.includes('local')) {
        uniqueCategories.add('Local Dishes');
      } else if (
        itemName.includes('snack') ||
        itemDescription.includes('snack')
      ) {
        uniqueCategories.add('Snacks');
      } else if (
        itemName.includes('drink') ||
        itemDescription.includes('drink')
      ) {
        uniqueCategories.add('Drinks');
      } else if (
        itemName.includes('breakfast') ||
        itemDescription.includes('breakfast')
      ) {
        uniqueCategories.add('Breakfast');
      } else if (itemName.includes('burger') || itemName.includes('fast')) {
        uniqueCategories.add('Fast Food');
      } else {
        uniqueCategories.add('Main Dishes');
      }
    });

    return ['All', ...Array.from(uniqueCategories)];
  }, [restaurantDetails?.menu]);

  // Filter menu items based on selected category
  const filteredMenuItems = useMemo(() => {
    if (!restaurantDetails?.menu || selectedCategory === 'All') {
      return restaurantDetails?.menu || [];
    }

    return restaurantDetails.menu.filter((item) => {
      const itemName = item.name.toLowerCase();
      const itemDescription = item.description?.toLowerCase() || '';

      switch (selectedCategory) {
        case 'Local Dishes':
          return (
            itemName.includes('local') || itemDescription.includes('local')
          );
        case 'Snacks':
          return (
            itemName.includes('snack') || itemDescription.includes('snack')
          );
        case 'Drinks':
          return (
            itemName.includes('drink') || itemDescription.includes('drink')
          );
        case 'Breakfast':
          return (
            itemName.includes('breakfast') ||
            itemDescription.includes('breakfast')
          );
        case 'Fast Food':
          return itemName.includes('burger') || itemName.includes('fast');
        case 'Main Dishes':
        default:
          return (
            !itemName.includes('local') &&
            !itemName.includes('snack') &&
            !itemName.includes('drink') &&
            !itemName.includes('breakfast') &&
            !itemName.includes('burger') &&
            !itemName.includes('fast')
          );
      }
    });
  }, [restaurantDetails?.menu, selectedCategory]);

  if (isLoading) {
    return <LoadingScreen />;
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
          source={
            restaurantDetails.image
              ? { uri: restaurantDetails.image }
              : images.onboarding2
          }
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
        {/* Status Badge - Default to open since not in API */}
        <View className="absolute bottom-4 right-4">
          <Chip
            icon="clock-outline"
            className="bg-green-500"
            textStyle={{ color: 'white' }}
          >
            {t('open')}
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
                {t('restaurant')}
              </Text>
              <Text className="font-semibold" style={{ color: colors.primary }}>
                500 XAF
              </Text>
            </View>
          </View>

          <Text className={`mb-4 `} style={{ color: colors.onSurface }}>
            Restaurant Description
          </Text>

          <View className="flex-row items-center mb-2">
            <Ionicons name="time-outline" size={16} color={colors.onSurface} />
            <Text className={`ml-2 `} style={{ color: colors.onSurface }}>
              {t('open')}
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
                {restaurantDetails.rating || 4.5}
              </Text>
              <Text className={`ml-1 `} style={{ color: colors.onSurface }}>
                ({restaurantDetails.ratingCount} reviews)
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
                  {t('delivery_address')}
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
                    500 XAF
                  </Text>
                  <Text className="mx-2" style={{ color: colors.onSurface }}>
                    |
                  </Text>
                  <Text
                    className={`text-sm `}
                    style={{ color: colors.onSurface }}
                  >
                    30 mins
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
            data={restaurantDetails.menu} // Show first 3 menu items
            renderItem={({ item }) => (
              <ClassicFoodCard
                foodName={item.name}
                id={item.id}
                foodPrice={parseFloat(item.price)}
                restaurantName={item.restaurant.name}
                distance={item.distanceKm || 0}
                rating={4.5}
                imageUrl={item.pictureUrl}
              />
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
            renderItem={({ item }) => <MenuItemCard item={item} />}
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
