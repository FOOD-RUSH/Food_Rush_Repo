import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Card , useTheme} from 'react-native-paper';
import { FoodProps } from '@/src/types';
import { images } from '@/assets/images';
import { useNavigation } from '@react-navigation/native';
import { RootStackScreenProps } from '@/src/navigation/types';
import { useCartStore } from '@/src/stores/cartStore';

const MenuItemCard = ({
  id,
  restaurantID,
  name,
  price,
  image,
  description,
}: FoodProps) => {
  const addToCart = useCartStore((state) => state.addtoCart);
  const removeFromCart = useCartStore((state) => state.deleteCart);
  const [isSelect, setIsSelected] = useState(false);
  const longPress = () => {
    setIsSelected(!isSelect);
    if (isSelect) {
      addToCart(
        {
          id: id,
          restaurantID: restaurantID,
          name: name,
          price: price,
          image: image,
          description: description,
        },
        1,
        '',
      );
    } else {
      removeFromCart(id);
    }
  };
  const navigation =
    useNavigation<RootStackScreenProps<'RestaurantDetails'>['navigation']>();
  const { colors } = useTheme();
  const borderColor = isSelect ? colors.primary : colors.outline;

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
        key={id}
        onPress={() => {
          navigation.navigate('FoodDetails', {
            foodId: id,
            restaurantId: restaurantID,
          });
        }}
        onLongPress={longPress}
      >
        <View className="flex-row py-3 px-3 items-center justify-between ">
          <Card.Cover
            source={images.onboarding2}
            style={{ height: 90, width: 90, borderRadius: 16 }}
          />
          <View className="flex-1 ml-3">
            <Text
              className={`font-semibold text-xl  `} style={{ color: colors.onSurface }}>
              {name}
            </Text>
            <Text
              className="text-xl font-semibold"
              style={{ color: colors.primary }}
            >
              {price} XAF
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default MenuItemCard;
