import { View, StatusBar, Image, Pressable, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import {
  Text,
  TouchableRipple,
  Button,
  ActivityIndicator,
  useTheme,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { images } from '@/assets/images';
import { RootStackScreenProps } from '@/src/navigation/types';
import Seperator from '@/src/components/common/Seperator';
import InputField from '@/src/components/customer/InputField';
import { FoodProps } from '@/src/types';
import { useCartStore } from '@/src/stores/cartStore';

interface ExtraProps {
  id: number;
  name: string;
  price: number;
}

interface FoodDetailProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: any;
  reviewCount: number;
  rating: number;
  category: string;
  extras: ExtraProps[];
  preparationTime?: string;
}

const FoodDetailsScreen = ({
  navigation,
  route,
}: RootStackScreenProps<'FoodDetails'>) => {
  const { restaurantId, foodId } = route.params;
  const { colors } = useTheme();

  const [foodDetails, setFoodDetails] = useState<FoodDetailProps>();
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(0);
  const [instructions, setInstructions] = useState('');
  useEffect(() => {
    console.log('Restaurant ID: ' + restaurantId);
    console.log('Food ID: ' + foodId);
    const fetchFoodDetails = async () => {
      try {
        setLoading(true);
        // Simulated API call - replace with your actual API endpoint
        // const response = await fetch(`/api/restaurants/${restaurantId}/foods/${foodId}`);
        // const data = await response.json();

        // Mock data for demonstration

        setTimeout(() => {
          setFoodDetails({
            id: foodId,
            name: 'Mixed Vegetable Salad',
            description:
              'Fresh garden vegetables mixed with our signature dressing. A healthy and delicious choice packed with nutrients and vibrant flavors.',
            price: 5500,
            image: images.onboarding2,
            rating: 4.5,
            reviewCount: 128,
            category: 'Salads',

            extras: [
              { id: 1, name: 'Extra Cheese', price: 500 },
              { id: 2, name: 'Avocado', price: 800 },
              { id: 3, name: 'Grilled Chicken', price: 1500 },
            ],
          });
          setLoading(false);
        }, 2000);
      } catch (error) {
        console.error('Error fetching food details:', error);
        setLoading(false);
        Alert.alert('Error', 'Failed to load food details. Please try again.');
      }
    };
    fetchFoodDetails();
  }, [restaurantId, foodId]);
  // store
  const addItemtoCart = useCartStore().addtoCart;

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const calculateTotalPrice = () => {
    if (!foodDetails) return 0;
    return foodDetails.price * quantity;
  };

  const handleAddToBasket = () => {
    const cartItem: FoodProps = {
      id: foodDetails?.id!,
      restaurantID: restaurantId,
      name: foodDetails?.name,
      category: foodDetails?.category,
      image: foodDetails?.image,
      description: foodDetails?.description!,
      price: foodDetails?.price,
    };

    console.log('Adding to basket:', cartItem);
    // adding item to card
    addItemtoCart(cartItem, quantity, instructions);
    // Implement actual basket functionality here
  };

  if (loading) {
    return (
      <View
        className={`flex-1 justify-center items-center ${colors.background}`}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className={`mt-4 `}>Loading food details...</Text>
      </View>
    );
  }

  if (!foodDetails) {
    return (
      <View
        className={`flex-1 justify-center items-center ${colors.background}`}
      >
        <Text className={``}>Failed to load food details</Text>
        <Button mode="contained" onPress={() => {}} className="mt-4">
          Retry
        </Button>
      </View>
    );
  }

  return (
    <>
      <StatusBar backgroundColor={'transparent'} translucent />
      <ScrollView className={`flex-1 ${colors.background} mb-15`}>
        {/* Header Image with Navigation */}
        <View className="relative">
          <Image
            className="relative object-center w-full h-[350px]"
            source={foodDetails.image}
            resizeMode="cover"
          />

          {/* Rating Badge */}
          <View className="absolute bottom-4 right-4 bg-white rounded-full px-3 py-1 flex-row items-center">
            <Ionicons name="star" color="#FFD700" size={16} />
            <Text className="ml-1 font-semibold">{foodDetails.rating}</Text>
            <Text className={`ml-1 text-[${colors.secondary}]`}>
              ({foodDetails.reviewCount})
            </Text>
          </View>
        </View>

        {/* Food Details Content */}
        <View className="px-4 py-6 mb-2">
          {/* Title and Basic Info */}
          <View className="mb-6">
            <Text
              variant="headlineMedium"
              style={{
                fontWeight: 'bold',
              }}
            >
              {foodDetails.name}
            </Text>

            <Seperator />

            <Text variant="bodyLarge">{foodDetails.description}</Text>
          </View>
        </View>
        {/* QUANTITY NEEDED */}
        <View className="flex-row items-center space-x-2 mb-2 self-center">
          <Pressable
            onPress={() => handleQuantityChange(-1)}
            className="rounded-full w-10 h-10 items-center justify-center active:bg-gray-200 border-gray-300 border"
          >
            <Ionicons
              name="remove"
              size={25}
              color={colors.primary}
              selectionColor={'#fff'}
            />
          </Pressable>
          <Text className={`mx-4 text-2xl font-bold text-center`}>
            {quantity}
          </Text>
          <Pressable
            onPress={() => handleQuantityChange(1)}
            className="rounded-full w-10 h-10 items-center justify-center active:bg-gray-200 border-gray-300 border"
          >
            <Ionicons name="add" size={25} color={colors.primary} />
          </Pressable>
        </View>

        <View className="px-4 mb-4">
          <InputField
            label="Add a note (optional)"
            multiline
            numberOfLines={3}
            style={{
              backgroundColor: colors.background,
              marginRight: 16,
              marginLeft: 16,
              alignSelf: 'center',
              height: 100,
            }}
            placeholder="Special instructions or preferences"
          />
        </View>
      </ScrollView>
      <View className={`px-4 pb-12 shadow-2xl ${colors.background}`}>
        <TouchableRipple
          onPress={handleAddToBasket}
          disabled={quantity === 0 ? true : false}
          className="rounded-full py-4 px-6 my-4"
          style={{
            backgroundColor: colors.primary,
            opacity: quantity === 0 ? 0.5 : 1,
          }}
        >
          <View className="flex-row justify-center items-center px-4">
            <Text className="font-semibold text-lg" style={{ color: 'white' }}>
              Add to Basket -
            </Text>
            <Text
              className="text-white font-bold text-lg"
              style={{ color: 'white' }}
            >
              {calculateTotalPrice()} FCFA
            </Text>
          </View>
        </TouchableRipple>
      </View>
    </>
  );
};

export default FoodDetailsScreen;
