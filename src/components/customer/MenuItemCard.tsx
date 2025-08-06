import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Card } from 'react-native-paper';
import { FoodProps } from '@/src/types';
import { images } from '@/assets/images';
import { useNavigation } from '@react-navigation/native';
import { RootStackScreenProps } from '@/src/navigation/types';

const MenuItemCard = ({ id, restaurantID, name, price, image }: FoodProps) => {
  const [isSelect, setIsSelected] = useState(false);
  const longPress = () => {
    setIsSelected(!isSelect);
  };
  const navigation =
    useNavigation<RootStackScreenProps<'RestaurantDetails'>['navigation']>();
  return (
    <TouchableOpacity activeOpacity={0.8}>
      <Card
        mode="outlined"
        style={{
          margin: 10,
          borderRadius: 16,
          overflow: 'hidden',
          backgroundColor: 'white',
          marginVertical: 12,
          boxShadow: !isSelect
            ? '0px 1px 5px 3px  rgba(0, 0, 0, 0.15)'
            : ' 0px 1px 5px 3px rgba(0, 122, 255, 0.15)',
          borderColor: isSelect ? '#007aff' : '#e0e0e0',
          elevation: 2,
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
            <Text className="font-semibold text-xl">{name}</Text>
            <Text className="text-primaryColor text-xl font-semibold ">
              {price} XAF
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default MenuItemCard;
