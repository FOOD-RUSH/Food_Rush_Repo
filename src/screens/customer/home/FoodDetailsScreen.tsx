import { IoniconsIcon, MaterialIcon } from '@/src/components/common/icons';
import { View, StatusBar, Image, Pressable, Alert } from 'react-native';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import {
  TouchableRipple,
  Button,
  ActivityIndicator,
  useTheme,
  Chip,
} from 'react-native-paper';
import {
  Typography,
  Heading2,
  Heading4,
  Body,
  BodyLarge,
  Label,
  LabelLarge,
} from '@/src/components/common/Typography';

import { images } from '@/assets/images';
import { RootStackScreenProps } from '@/src/navigation/types';
import Seperator from '@/src/components/common/Seperator';
import InputField from '@/src/components/customer/InputField';
import Toast from 'react-native-toast-message';
import {
  useCartStore,
  useIsItemInCart,
  useItemQuantityInCart,
  useCartError,
} from '@/src/stores/customerStores/cartStore';
import { useTranslation } from 'react-i18next';
import { useMenuItemById } from '@/src/hooks/customer/useCustomerApi';

const FoodDetailsScreen = ({ navigation, route }: RootStackScreenProps<'FoodDetails'>) => {
  const { foodId } = route.params;
  const { colors } = useTheme();
  const { t } = useTranslation('translation');

  // Subscribe to cart error
  const cartError = useCartError();
  const clearError = useCartStore((state) => state.clearError);
  const restaurantName = useCartStore((state) => state.restaurantName);
  const canAddItem = useCartStore((state) => state.canAddItem);
  
  const isInCart = useIsItemInCart(foodId);
  const cartQuantity = useItemQuantityInCart(foodId);

  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');

  const {
    data: MenuDetails,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useMenuItemById(foodId);
  
  const addItemtoCart = useCartStore((state) => state.addItemtoCart);
  const clearCartAndSwitch = useCartStore((state) => state.clearCartAndSwitchRestaurant);

  // Handle cart errors
  useEffect(() => {
    if (cartError) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: cartError,
        position: 'top',
        visibilityTime: 4000,
      });
      clearError();
    }
  }, [cartError, clearError, t]);

  // Handle quantity changes
  const handleQuantityChange = useCallback((delta: number) => {
    setQuantity((prev) => {
      const newQuantity = prev + delta;
      if (newQuantity < 1) return 1;
      if (newQuantity > 99) return 99;
      return newQuantity;
    });
  }, []);

  // Calculate formatted total price
  const formattedTotalPrice = useMemo(() => {
    if (!MenuDetails) return '0';
    const price = parseFloat(MenuDetails.price || '0');
    const total = price * quantity;
    return total.toLocaleString('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }, [MenuDetails, quantity]);

  // Handle add to basket with proper feedback
  const handleAddToBasket = useCallback(() => {
    if (!MenuDetails) return;

    // Check if item can be added (restaurant match)
    const canAdd = canAddItem(MenuDetails);
    
    if (!canAdd && restaurantName) {
      // Show alert for restaurant mismatch
      Alert.alert(
        t('different_restaurant'),
        t('cart_has_items_from', { restaurant: restaurantName }) + 
        '\n\n' + 
        t('clear_cart_to_add_from_new_restaurant'),
        [
          {
            text: t('cancel'),
            style: 'cancel',
          },
          {
            text: t('clear_cart'),
            style: 'destructive',
            onPress: () => {
              clearCartAndSwitch(MenuDetails, quantity, instructions);
              Toast.show({
                type: 'success',
                text1: t('cart_cleared'),
                text2: t('item_added_to_cart'),
                position: 'bottom',
              });
              navigation.navigate('CustomerApp', {
                screen: 'Home',
                params: { screen: 'HomeScreen' },
              });
            },
          },
        ],
      );
      return;
    }

    // Immediate visual feedback (Alert + optional haptics)
    try {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    Alert.alert(
      t('adding_to_cart'),
      `${MenuDetails.name} × ${quantity}`,
      [{ text: t('ok'), style: 'default' }],
      { cancelable: true },
    );

    // Add item with both success and error callbacks
    addItemtoCart(
      MenuDetails,
      quantity,
      instructions,
      () => {
        // Success callback
        Toast.show({
          type: 'success',
          text1: t('item_added_to_cart'),
          text2: `${MenuDetails.name} ${t('added_to_cart_successfully')}`,
          position: 'bottom',
          visibilityTime: 2000,
        });

        navigation.navigate('CustomerApp', {
          screen: 'Home',
          params: { screen: 'HomeScreen' },
        });
      },
      (error) => {
        // Error callback - already handled by useEffect above
        console.error('Failed to add to cart:', error);
      }
    );
  }, [
    MenuDetails,
    quantity,
    instructions,
    addItemtoCart,
    clearCartAndSwitch,
    canAddItem,
    restaurantName,
    navigation,
    t,
  ]);

  // Loading state
  if (isLoading) {
    return (
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: colors.background }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Body color={colors.onSurface} style={{ marginTop: 16 }}>
          {t('loading_food_details')}
        </Body>
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
        <MaterialIcon
          name="error-outline"
          size={80}
          color={colors.onSurfaceVariant}
        />
        <Heading4
          color={colors.onSurface}
          align="center"
          style={{ marginTop: 16, marginBottom: 8 }}
        >
          {t('failed_to_load_food_details')}
        </Heading4>
        <Body
          color={colors.onSurfaceVariant}
          align="center"
          style={{ marginBottom: 24 }}
        >
          {t('please_check_connection_and_try_again')}
        </Body>
        <Button
          mode="contained"
          onPress={() => refetch()}
          loading={isRefetching}
          style={{ backgroundColor: colors.primary }}
        >
          {t('retry')}
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
            onError={() => {}}
          />

          {/* Cart Status Badge */}
          {isInCart && (
            <View
              className="absolute top-12 right-4 px-3 py-2 rounded-full flex-row items-center"
              style={{ backgroundColor: colors.primary }}
            >
              <MaterialIcon name="shopping-cart" size={16} color="white" />
              <Label color="white" weight="bold" style={{ marginLeft: 4 }}>
                {cartQuantity} {t('in_cart')}
              </Label>
            </View>
          )}

          {/* Price Badge */}
          <View
            className="absolute bottom-4 right-4 px-4 py-2 rounded-full"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
          >
            <LabelLarge color="white" weight="bold">
              {MenuDetails.price} XAF
            </LabelLarge>
          </View>
        </View>

        {/* Food Details Content */}
        <View className="px-4 py-6">
          {/* Title and Basic Info */}
          <View className="mb-6">
            <Heading2
              color={colors.onSurface}
              weight="bold"
              style={{ marginBottom: 8 }}
            >
              {MenuDetails.name}
            </Heading2>

            {/* Category Badge */}
            {MenuDetails.category && (
              <View className="mt-2 mb-2">
                <View
                  className="self-start px-3 py-1 rounded-full"
                  style={{ backgroundColor: colors.primaryContainer }}
                >
                  <Label color={colors.onPrimaryContainer} weight="medium">
                    {MenuDetails.category}
                  </Label>
                </View>
              </View>
            )}

            <Seperator />

            <BodyLarge color={colors.onSurface} style={{ marginBottom: 16 }}>
              {MenuDetails.description || t('no_description_available')}
            </BodyLarge>

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
          <View className="p-6">
            <LabelLarge
              color={colors.onSurface}
              weight="semibold"
              style={{ marginBottom: 16 }}
            >
              {t('quantity')}
            </LabelLarge>

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
                <IoniconsIcon
                  name="remove"
                  size={24}
                  color={quantity > 1 ? 'white' : colors.onSurfaceVariant}
                />
              </Pressable>

              <Typography
                variant="display2"
                color={colors.onSurface}
                weight="bold"
                align="center"
                style={{ marginHorizontal: 16, minWidth: 60 }}
              >
                {quantity}
              </Typography>

              <Pressable
                onPress={() => handleQuantityChange(1)}
                disabled={quantity >= 99}
                className="w-12 h-12 rounded-full items-center justify-center"
                style={{
                  backgroundColor: colors.primary,
                  opacity: quantity >= 99 ? 0.5 : 1,
                }}
              >
                <IoniconsIcon name="add" size={24} color="white" />
              </Pressable>
            </View>
          </View>

          {/* Special Instructions */}
          <View className="p-6">
            <LabelLarge
              color={colors.onSurface}
              weight="semibold"
              style={{ marginBottom: 16 }}
            >
              {t('special_instructions_optional')}
            </LabelLarge>

            <InputField
              multiline
              numberOfLines={4}
              style={{
                backgroundColor: colors.surface,
                height: 120,
              }}
              placeholder={t('special_instruction')}
              value={instructions}
              onChangeText={setInstructions}
            />
          </View>
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
              <LabelLarge color="white" weight="semibold">
                {isInCart ? t('update_cart') : t('add_to_basket')}
              </LabelLarge>
              <Label color="white" style={{ opacity: 0.9 }}>
                {quantity} {quantity === 1 ? t('item') : t('items')}
              </Label>
            </View>

            <Heading4 color="white" weight="bold">
              {formattedTotalPrice} XAF
            </Heading4>
          </View>
        </TouchableRipple>
      </View>
    </>
  );
};

export default FoodDetailsScreen;
