import { View, Text } from 'react-native';
import React from 'react';
import { Card } from 'react-native-paper';
import { images } from '@/assets/images';

const CartFoodComponent = () => {
  return (
    <Card
      mode="outlined"
      style={{
        margin: 10,
        borderRadius: 16,
        overflow: 'hidden',
        borderColor: '#e0e0e0',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      }}
    >
      <View className="flex-row p-4 items-center">
        <Card.Cover
          className="h-[100px] w-[100px] rounded-2xl overflow-hidden object-center"
          source={images.onboarding1}
        />
        <View className="space-y-2 flex-col">
          <Text className="text-[22px] text-center">Mixed Salad Bon...</Text>
          <View className="flex-row items-center space-x-2">
            <Text className="text-gray-500">3 items</Text>
            <Text className="text-gray-500">|</Text>
            <Text className="text-gray-500">1.5 Km</Text>
          </View>
          <Text className="text-primaryColor text-[20px]">$ 18.00</Text>
        </View>
      </View>
    </Card>
  );
};

export default CartFoodComponent;
