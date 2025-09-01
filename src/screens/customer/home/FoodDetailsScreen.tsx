import { View, StatusBar, Image, Pressable, Alert } from 'react-native';
import React, { useState } from 'react';
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
import { useCartStore } from '@/src/stores/customerStores/cartStore';
import { useTranslation } from 'react-i18next';
import { useGetMenuById } from '@/src/hooks/customer';

interface ExtraProps {
  id: number;
  name: string;
  price: number;
}

const FoodDetailsScreen = ({
  navigation,
  route,
}: RootStackScreenProps<'FoodDetails'>) => {
  const { restaurantId, foodId } = route.params;
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const [quantity, setQuantity] = useState(0);
  const [instructions, setInstructions] = useState('');

  // store
  const {
    data: MenuDetails,
    isLoading,
    isRefetching,
    refetch,
    error,
  } = useGetMenuById(restaurantId, foodId);
  const addItemtoCart = useCartStore().addtoCart;

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const calculateTotalPrice = () => {
    if (!MenuDetails) return 0;
    return MenuDetails.price * quantity;
  };

  const handleAddToBasket = () => {
    const cartItem: FoodProps = {
      id: MenuDetails?.id!,
      restaurantID: restaurantId,
      name: MenuDetails?.name,
      category: MenuDetails?.category,
      image: MenuDetails?.image,
      description: MenuDetails?.description!,
      price: MenuDetails?.price!,
    };

    console.log('Adding to basket:', cartItem);
    // adding item to card
    addItemtoCart(cartItem, quantity, instructions);
    // Implement actual basket functionality here
  };

  if (isLoading) {
    return (
      <View
        className={`flex-1 justify-center items-center ${colors.background}`}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className={`mt-4 `}>
          {t('loading_food_details') || 'Loading food details...'}
        </Text>
      </View>
    );
  }

  if (!MenuDetails) {
    return (
      <View
        className={`flex-1 justify-center items-center ${colors.background}`}
      >
        <Text className={``}>
          {t('failed_to_load_food_details') || 'Failed to load food details'}
        </Text>
        <Button mode="contained" onPress={() => refetch()} className="mt-4">
          {t('retry') || 'Retry'}
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
            source={MenuDetails.image || images.onboarding1}
            resizeMode="cover"
            onError={() => console.log('Image load error')}
          />

          {/* Rating Badge */}
          <View className="absolute bottom-4 right-4 bg-white rounded-full px-3 py-1 flex-row items-center">
            <Ionicons name="star" color="#FFD700" size={16} />
            <Text className="ml-1 font-semibold">
              {MenuDetails.rating || 4.3}{' '}
            </Text>
            <Text className={`ml-1 text-[${colors.onSurfaceVariant}]`}>
              ({MenuDetails.reviewCount || '100K'})
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
              {MenuDetails.name}
            </Text>

            <Seperator />

            <Text variant="bodyLarge">{MenuDetails.description}</Text>
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
            // label={t('add_a_note_optional')}
            label={t('add_a_note')}
            multiline
            numberOfLines={3}
            style={{
              backgroundColor: colors.surface,
              marginRight: 16,
              marginLeft: 16,
              alignSelf: 'center',
              height: 100,
            }}
            // placeholder={t('special_instructions_or_preferences')}
            placeholder={t('special_instruction')}
            onChangeText={(text) => setInstructions(text)}
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
              {/* {t('add_to_basket')} - */} {t('add_to_basket')}
            </Text>
            <Text
              className="text-white font-bold text-lg"
              style={{ color: 'white' }}
            >
              {calculateTotalPrice()} {t('fcfa_unit')}
            </Text>
          </View>
        </TouchableRipple>
      </View>
    </>
  );
};

export default FoodDetailsScreen;
