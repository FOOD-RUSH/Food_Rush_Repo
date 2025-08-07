import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Card } from 'react-native-paper';
import { FoodProps } from '@/src/types';
import { images } from '@/assets/images';
import { useNavigation } from '@react-navigation/native';
import { RootStackScreenProps } from '@/src/navigation/types';
import { useTheme } from '@/src/hooks/useTheme';

const MenuItemCard = ({ id, restaurantID, name, price, image }: FoodProps) => {
  const [isSelect, setIsSelected] = useState(false);
  const longPress = () => {
    setIsSelected(!isSelect);
  };
  const navigation =
    useNavigation<RootStackScreenProps<'RestaurantDetails'>['navigation']>();
  const { theme } = useTheme();
  const cardBackgroundColor = theme === 'light' ? 'white' : '#1e293b';
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-text';
  const primaryColor = theme === 'light' ? '#007aff' : '#3b82f6';
  const borderColor = isSelect
    ? primaryColor
    : theme === 'light'
      ? '#e0e0e0'
      : '#334155';

  return (
    <TouchableOpacity activeOpacity={0.8}>
      <Card
        mode="outlined"
        style={{
          margin: 10,
          borderRadius: 16,
          overflow: 'hidden',
          backgroundColor: cardBackgroundColor,
          marginVertical: 12,
          borderColor: borderColor,
          elevation: 2,
          boxShadow: '1px 0px 10px rgba(0, 0, 0, 0.15)',
          borderWidth: 2

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
            <Text className={`font-semibold text-xl ${textColor} `} numberOfLines={1}>{name}</Text>
            <Text
              className="text-xl font-semibold"
              style={{ color: primaryColor }}
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
