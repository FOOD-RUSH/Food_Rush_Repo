import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Card, useTheme } from 'react-native-paper';
import { FoodProps } from '@/src/types';
import { images } from '@/assets/images';
import { useNavigation } from '@react-navigation/native';
import { RootStackScreenProps } from '@/src/navigation/types';
import {
  useCartStore,
  useIsItemInCart,
  useItemQuantityInCart,
} from '@/src/stores/customerStores/cartStore';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';

const MenuItemCard = ({ item }: { item: FoodProps }) => {
  const addToCart = useCartStore((state) => state.addtoCart);
  const removeFromCart = useCartStore((state) => state.deleteCartByFoodId);
  const isInCart = useIsItemInCart(item.id);
  const quantityInCart = useItemQuantityInCart(item.id);
  const [isSelect, setIsSelected] = useState(false);
  const { t } = useTranslation('translation');

  const longPress = () => {
    setIsSelected(!isSelect);
    if (isSelect) {
      addToCart(item, 1, '');
    } else {
      removeFromCart(item.id);
    }
  };
  const navigation =
    useNavigation<RootStackScreenProps<'RestaurantDetails'>['navigation']>();
  const { colors } = useTheme();
  const borderColor = isSelect
    ? colors.primary
    : isInCart
      ? colors.primary
      : colors.outline;

  return (
    <TouchableOpacity activeOpacity={0.8}>
      <Card
        mode="outlined"
        style={{
          margin: 10,
          borderRadius: 16,
          overflow: 'hidden',
          backgroundColor: colors.surface,
          marginVertical: 12,
          borderColor: borderColor,
          elevation: 2,
          boxShadow: '1px 0px 10px rgba(0, 0, 0, 0.15)',
        }}
        key={item.id}
        onPress={() => {
          navigation.navigate('FoodDetails', {
            foodId: item.id,
          });
        }}
        onLongPress={longPress}
      >
        <View className="flex-row py-3 px-3 items-center justify-between ">
          <View className="relative">
            <Card.Cover
              source={
                item.pictureUrl ? { uri: item.pictureUrl } : images.onboarding2
              }
              style={{ height: 90, width: 90, borderRadius: 16 }}
            />
            {/* Cart indicator */}
            {isInCart && (
              <View
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <Text className="text-white text-xs font-bold">
                  {quantityInCart}
                </Text>
              </View>
            )}
          </View>
          <View className="flex-1 ml-3">
            <View className="flex-row items-center justify-between">
              <Text
                className={`font-semibold text-xl flex-1`}
                style={{ color: colors.onSurface }}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              {isInCart && (
                <View className="ml-2">
                  <MaterialIcons
                    name="shopping-cart"
                    size={20}
                    color={colors.primary}
                  />
                </View>
              )}
            </View>
            <Text
              className="text-xl font-semibold"
              style={{ color: colors.primary }}
            >
              {item.price}
              {t('xaf_currency')}
            </Text>
            {isInCart && (
              <Text
                className="text-sm mt-1"
                style={{ color: colors.onSurfaceVariant }}
              >
                {quantityInCart} in cart
              </Text>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default MenuItemCard;
