import React, { useState, useEffect } from 'react';
import { Pressable, ScrollView, FlatList } from 'react-native-gesture-handler';
import { FoodProps, RestaurantProfile } from '@/src/types';
import { Text, View, StatusBar, Dimensions, Image, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
  TouchableRipple,
  Card,
  Chip,
  Button,
  ActivityIndicator,
} from 'react-native-paper';
import { RootStackScreenProps } from '@/src/navigation/types';
import { images } from '@/assets/images';
import MenuItemCard from '@/src/components/customer/MenuItemCard';
import FoodItemCard from '@/src/components/customer/FoodItemCard';
import ClassicFoodCard from '@/src/components/customer/ClassicFoodCard';

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

// Get RESTAURANT details
// Get Menu with data
// User must be able to like, select food to command
// view rating details
//

const RestaurantDetailScreen = ({
  navigation,
  route,
}: RootStackScreenProps<'RestaurantDetails'>) => {
  // Get restaurant data from route params or props
  const { restaurantId } = route.params || {};

  const [restaurantDetails, setRestaurantDetails] =
    useState<RestaurantProfile | null>(null);
  const [menuItems, setMenuItems] = useState<FoodProps[]>([]);
  const [forYouItems, setForYouItems] = useState<FoodProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchRestaurantDetails();
  }, []);

  const fetchRestaurantDetails = async () => {
    try {
      setLoading(true);

      // Mock data - replace with actual API calls
      setTimeout(() => {
        setRestaurantDetails({
          id: '1',
          name: 'Le Famous Restaurant',
          image: images.onboarding3,
          ratings: '4.5',
          reviewCount: '4.8k',
          distance: '1.2 km',
          deliveryFee: '500 FCFA',
          deliveryTime: '25-35 min',
          cuisine: 'International',
          isOpen: true,
          openTime: '9:00 AM - 11:00 PM',
          phone: '+237 123 456 789',
          address: 'Douala, Cameroon',
          description:
            'Experience the finest dining with our carefully crafted menu featuring fresh ingredients and authentic flavors.',
          specialOffers: [
            'Free delivery on orders over 10,000 FCFA',
            '20% off on your first order',
            'Buy 2 Get 1 Free on selected items',
          ],
          menu: [],
        });

        setForYouItems([
          {
            id: '1',
            restaurantID: 'erereererer',
            name: 'Grilled Chicken Special',
            price: 4500,
            image: images.onboarding1,
            description: 'Tender grilled chicken with herbs',
            ratings: 4.7,
          },
          {
            id: '2',
            restaurantID: 'erereererer',
            name: 'Seafood Pasta',
            price: 6500,
            image: images.onboarding1,
            description: 'Fresh seafood with creamy pasta',
            ratings: 4.6,
          },
          {
            id: '3',
            restaurantID: 'erereererer',
            name: 'Vegetarian Delight',
            price: 3500,
            image: images.onboarding1,
            description: 'Healthy mix of fresh vegetables',
            ratings: 4.4,
          },
        ]);

        setMenuItems([
          {
            restaurantID: 'erereererer',
            id: '1',
            name: 'Grilled Chicken Special',
            price: 4500,
            category: 'Main Course',
            image: images.onboarding1,
            description: 'Tender grilled chicken with herbs and spices',
            ratings: 4.7,
          },
          {
            id: '2',
            restaurantID: 'erereererer',
            name: 'Seafood Pasta',
            price: 6500,
            category: 'Main Course',
            image: images.onboarding1,
            description: 'Fresh seafood with creamy pasta sauce',
            ratings: 4.6,
          },
          {
            restaurantID: 'erereererer',
            id: '3',
            name: 'Caesar Salad',
            price: 2500,
            category: 'Salads',
            image: images.onboarding1,
            description: 'Crispy romaine lettuce with caesar dressing',
            ratings: 4.3,
          },
          {
            restaurantID: 'erereererer',
            id: '4',
            name: 'Chocolate Cake',
            price: 1800,
            category: 'Desserts',
            image: images.onboarding1,
            description: 'Rich chocolate cake with cream frosting',
            ratings: 4.8,
          },
        ]);

        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
      setLoading(false);
      Alert.alert('Error', 'Failed to load restaurant details');
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    Alert.alert(
      isFavorite ? 'Removed from Favorites' : 'Added to Favorites',
      isFavorite
        ? 'Restaurant removed from your favorites'
        : 'Restaurant added to your favorites',
    );
  };

  const handleShare = () => {
    Alert.alert('Share', 'Share restaurant functionality');
  };

  const handleViewReviews = () => {};

  const handleViewLocation = () => {};

  const handleViewOffers = () => {};

  const handleFoodItemPress = (item: FoodProps) => {
    navigation.navigate('FoodDetails', {
      restaurantId: restaurantId,
      foodId: item.id,
    });
  };

  const categories = [
    'All',
    ...new Set(menuItems.map((item) => item.category)),
  ];
  const filteredMenuItems =
    selectedCategory === 'All'
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);


  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#007aff" animating />
        <Text className="mt-4">Loading restaurant details...</Text>
      </View>
    );
  }

  if (!restaurantDetails) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text>Failed to load restaurant details</Text>
        <Button
          mode="contained"
          onPress={fetchRestaurantDetails}
          className="mt-4"
        >
          Retry
        </Button>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
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
            {restaurantDetails.isOpen ? 'Open' : 'Closed'}
          </Chip>
        </View>
      </View>

      {/* Restaurant Information */}
      <View className="px-4 py-6">
        {/* Restaurant Name and Basic Info */}
        <View className="mb-6">
          <View className="flex-row justify-between items-start mb-2">
            <Text className="text-2xl font-bold flex-1">
              {restaurantDetails.name}
            </Text>
            <View className="flex-row items-center">
              <Text className="text-gray-600 mr-1">
                {restaurantDetails.cuisine}
              </Text>
              <Text className="text-primaryColor font-semibold">
                {/* {restaurantDetails.priceRange} */} 500FCFA
              </Text>
            </View>
          </View>

          <Text className="text-gray-600 mb-4">
            {restaurantDetails.description}
          </Text>

          <View className="flex-row items-center mb-2">
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text className="ml-2 text-gray-600">
              {restaurantDetails.openTime}
            </Text>
          </View>
        </View>

        {/* Rating Section */}
        <TouchableRipple onPress={handleViewReviews}>
          <View className="flex-row justify-between items-center py-4 border-b border-gray-200">
            <View className="flex-row items-center">
              <Ionicons name="star" color="#FFD700" size={20} />
              <Text className="ml-2 font-semibold text-base">
                {restaurantDetails.ratings}
              </Text>
              <Text className="ml-1 text-gray-500">
                ({restaurantDetails.reviewCount} reviews)
              </Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#666" />
          </View>
        </TouchableRipple>

        {/* Delivery Info */}
        <TouchableRipple onPress={handleViewLocation}>
          <View className="flex-row justify-between items-center py-4 border-b border-gray-200">
            <View className="flex-row items-center flex-1">
              <Ionicons name="location-outline" color="#007aff" size={20} />
              <View className="ml-3 flex-1">
                <Text className="font-semibold text-base text-primaryColor">
                  {restaurantDetails.distance}
                </Text>
                <View className="flex-row items-center mt-1">
                  <Text className="text-gray-500 text-sm">Delivery Now</Text>
                  <Text className="text-gray-400 mx-2">|</Text>
                  <Ionicons name="car" size={16} color="#666" />
                  <Text className="ml-1 text-gray-500 text-sm">
                    {restaurantDetails.deliveryFee}
                  </Text>
                  <Text className="text-gray-400 mx-2">|</Text>
                  <Text className="text-gray-500 text-sm">
                    {restaurantDetails.deliveryTime}
                  </Text>
                </View>
              </View>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#666" />
          </View>
        </TouchableRipple>

        {/* Offers Section */}
        <TouchableRipple onPress={handleViewOffers}>
          <View className="flex-row justify-between items-center py-4 border-b border-gray-200">
            <View className="flex-row items-center">
              <MaterialIcons name="local-offer" color="#007aff" size={20} />
              <Text className="ml-3 font-semibold text-base">
                Special Offers Available
              </Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={16}  />
          </View>
        </TouchableRipple>

        {/* For You Section */}
        <View className="mt-8">
          <Text className="text-xl font-bold mb-4">For You</Text>
          <FlatList
            data={forYouItems}
            renderItem={({ item }) => (
              <ClassicFoodCard foodName={item.name} id={item.id} />
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
              
/>
        </View>

        {/* Menu Section */}
        <View className="mt-8">
          <Text className="text-xl font-bold mb-4">Menu</Text>

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
                    selectedCategory === category
                      ? 'bg-primaryColor'
                      : 'bg-gray-100'
                  }`}
                >
                  <Text
                    className={`${
                      selectedCategory === category
                        ? 'text-white'
                        : 'text-gray-700'
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
                restaurantID={item.restaurantID}
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
