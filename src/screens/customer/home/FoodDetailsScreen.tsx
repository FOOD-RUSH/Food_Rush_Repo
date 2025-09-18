import { View, StatusBar, Image, Pressable, Alert } from 'react-native';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import {
  Text,
  TouchableRipple,
  Button,
  ActivityIndicator,
  useTheme,
  Card,
  Chip,
} from 'react-native-paper';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { images } from '@/assets/images';
import { RootStackScreenProps } from '@/src/navigation/types';
import Seperator from '@/src/components/common/Seperator';
import InputField from '@/src/components/customer/InputField';
import {
  useCartStore,
  useIsItemInCart,
  useItemQuantityInCart,
} from '@/src/stores/customerStores/cartStore';
import { useTranslation } from 'react-i18next';
import { useMenuItemById } from '@/src/hooks/customer/useCustomerApi';

const FoodDetailsScreen = ({
  navigation,
  route,
}: RootStackScreenProps<'FoodDetails'>) => {
  const { foodId } = route.params;
  const { colors } = useTheme();
  const { t } = useTranslation('translation');

  // Cart state
  const isInCart = useIsItemInCart(foodId);
  const cartQuantity = useItemQuantityInCart(foodId);

  // Local state - initialize with cart quantity or 1
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');

  // API and store
  const {
    data: MenuDetails,
    isLoading,
    isRefetching,
    refetch,
    error,
  } = useMenuItemById(foodId);
  const addItemtoCart = useCartStore().addtoCart;

  // Initialize quantity based on cart state
  useEffect(() => {
    if (isInCart && cartQuantity > 0) {
      setQuantity(cartQuantity);
    }
  }, [isInCart, cartQuantity]);

  const handleQuantityChange = useCallback(
    (change: number) => {
      const newQuantity = quantity + change;
      if (newQuantity >= 1 && newQuantity <= 99) {
        setQuantity(newQuantity);
      }
    },
    [quantity],
  );

  const calculateTotalPrice = useMemo(() => {
    if (!MenuDetails) return 0;
    return parseFloat(MenuDetails.price || '0') * quantity;
  }, [MenuDetails, quantity]);

  const formattedTotalPrice = useMemo(() => {
    return calculateTotalPrice.toLocaleString('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }, [calculateTotalPrice]);

  const handleAddToBasket = useCallback(() => {
    if (!MenuDetails) return;

    try {
      addItemtoCart(MenuDetails, quantity, instructions);
      // Show success feedback
      // Note: The cart store will handle the duplicate item dialog
    } catch (error) {
      Alert.alert(
        t('error') || 'Error',
        t('failed_to_add_to_cart') || 'Failed to add item to cart',
        [{ text: 'OK' }],
      );
    }
  }, [MenuDetails, quantity, instructions, addItemtoCart, t]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Loading state
  if (isLoading) {
    return (
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: colors.background }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="mt-4" style={{ color: colors.onSurface }}>
          {t('loading_food_details') || 'Loading food details...'}
        </Text>
      </View>
    );
  }

  // Error state
  if (!MenuDetails || error) {
    return (
      <View
        className="flex-1 justify-center items-center px-6"
        style={{ backgroundColor: colors.background }}
      >
        <MaterialIcons
          name="error-outline"
          size={80}
          color={colors.onSurfaceVariant}
        />
        <Text
          className="text-xl font-semibold mt-4 mb-2 text-center"
          style={{ color: colors.onSurface }}
        >
          {t('failed_to_load_food_details') || 'Failed to load food details'}
        </Text>
        <Text
          className="text-base text-center mb-6"
          style={{ color: colors.onSurfaceVariant }}
        >
          {t('please_check_connection_and_try_again') ||
            'Please check your connection and try again'}
        </Text>
        <Button
          mode="contained"
          onPress={() => refetch()}
          loading={isRefetching}
          style={{ backgroundColor: colors.primary }}
        >
          {t('retry') || 'Retry'}
        </Button>
      </View>
    );
  }

  return (
    <>
      <StatusBar backgroundColor="transparent" translucent />
      <ScrollView
        className="flex-1"
        style={{ backgroundColor: colors.background }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Image with Navigation */}
        <View className="relative">
          <Image
            className="w-full h-[350px]"
            source={
              MenuDetails.image
                ? { uri: MenuDetails.image }
                : images.onboarding1
            }
            resizeMode="cover"
            onError={() => console.log('Image load error')}
          />

          {/* Back Button */}
          <Pressable
            onPress={handleGoBack}
            className="absolute top-12 left-4 w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>

          {/* Cart Status Badge */}
          {isInCart && (
            <View
              className="absolute top-12 right-4 px-3 py-2 rounded-full flex-row items-center"
              style={{ backgroundColor: colors.primary }}
            >
              <MaterialIcons name="shopping-cart" size={16} color="white" />
              <Text className="text-white text-sm font-bold ml-1">
                {cartQuantity} in cart
              </Text>
            </View>
          )}

          {/* Price Badge */}
          <View
            className="absolute bottom-4 right-4 px-4 py-2 rounded-full"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
          >
            <Text className="text-white text-lg font-bold">
              {MenuDetails.price} {t('fcfa_unit')}
            </Text>
          </View>
        </View>

        {/* Food Details Content */}
        <View className="px-4 py-6">
          {/* Title and Basic Info */}
          <View className="mb-6">
            <Text
              variant="headlineMedium"
              style={{
                fontWeight: 'bold',
                color: colors.onSurface,
                marginBottom: 8,
              }}
            >
              {MenuDetails.name}
            </Text>

            {/* Category Badge */}
            {MenuDetails.category && (
              <View className="mt-2 mb-2">
                <View
                  className="self-start px-3 py-1 rounded-full"
                  style={{ backgroundColor: colors.primaryContainer }}
                >
                  <Text
                    className="text-sm font-medium"
                    style={{ color: colors.onPrimaryContainer }}
                  >
                    {MenuDetails.category}
                  </Text>
                </View>
              </View>
            )}

            <Seperator />

            <Text
              variant="bodyLarge"
              style={{
                color: colors.onSurface,
                lineHeight: 24,
                marginBottom: 16,
              }}
            >
              {MenuDetails.description || t('no_description_available')}
            </Text>

            {/* Category Chip */}
            {MenuDetails.category && (
              <Chip
                mode="outlined"
                style={{
                  alignSelf: 'flex-start',
                  marginBottom: 16,
                }}
              >
                {MenuDetails.category}
              </Chip>
            )}
          </View>

          {/* Quantity Selector */}
          <Card
            mode="outlined"
            style={{
              marginBottom: 20,
              backgroundColor: colors.surface,
            }}
          >
            <View className="p-4">
              <Text
                className="text-lg font-semibold mb-4"
                style={{ color: colors.onSurface }}
              >
                {t('quantity')}
              </Text>

              <View className="flex-row items-center justify-center">
                <Pressable
                  onPress={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="w-12 h-12 rounded-full items-center justify-center border"
                  style={{
                    borderColor: quantity > 1 ? colors.primary : colors.outline,
                    backgroundColor:
                      quantity > 1 ? colors.primary : colors.surface,
                  }}
                >
                  <Ionicons
                    name="remove"
                    size={24}
                    color={quantity > 1 ? 'white' : colors.onSurfaceVariant}
                  />
                </Pressable>

                <Text
                  className="mx-4 text-3xl font-bold text-center min-w-[60px]"
                  style={{ color: colors.onSurface }}
                >
                  {quantity}
                </Text>

                <Pressable
                  onPress={() => handleQuantityChange(1)}
                  disabled={quantity >= 99}
                  className="w-12 h-12 rounded-full items-center justify-center"
                  style={{
                    backgroundColor: colors.primary,
                    opacity: quantity >= 99 ? 0.5 : 1,
                  }}
                >
                  <Ionicons name="add" size={24} color="white" />
                </Pressable>
              </View>
            </View>
          </Card>

          {/* Special Instructions */}
          <Card
            mode="outlined"
            style={{
              marginBottom: 20,
              backgroundColor: colors.surface,
            }}
          >
            <View className="p-4">
              <Text
                className="text-lg font-semibold mb-4"
                style={{ color: colors.onSurface }}
              >
                {t('special_instructions_optional')}
              </Text>

              <InputField
                multiline
                numberOfLines={3}
                style={{
                  backgroundColor: colors.surface,
                  minHeight: 80,
                }}
                placeholder={t('special_instruction')}
                value={instructions}
                onChangeText={setInstructions}
              />
            </View>
          </Card>
        </View>
      </ScrollView>

      {/* Add to Cart Button */}
      <View
        className="px-4 py-4 border-t pb-12"
        style={{
          backgroundColor: colors.surface,
          borderTopColor: colors.outline,
        }}
      >
        <TouchableRipple
          onPress={handleAddToBasket}
          className="rounded-2xl py-4 px-6"
          style={{
            backgroundColor: colors.primary,
          }}
        >
          <View className="flex-row justify-between items-center">
            <View>
              <Text
                className="font-semibold text-lg"
                style={{ color: 'white' }}
              >
                {isInCart ? t('update_cart') : t('add_to_basket')}
              </Text>
              <Text className="text-sm opacity-90" style={{ color: 'white' }}>
                {quantity} {quantity === 1 ? t('item') : t('items')}
              </Text>
            </View>

            <Text className="font-bold text-xl" style={{ color: 'white' }}>
              {formattedTotalPrice} {t('fcfa_unit')}
            </Text>
          </View>
        </TouchableRipple>
      </View>
    </>
  );
};

export default FoodDetailsScreen;
