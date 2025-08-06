import { View, Text, Image } from 'react-native';
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
        boxShadow: '0 2px 3px 1px rgba(0,0,0,0.1)',
      }}
    >
      <View className="flex-row  flex items-center p-3">
        <Image
        height={100}
        width={100}
          className="h-[100px] w-[100px] rounded-2xl overflow-hidden "
          source={images.onboarding2}
          defaultSource={images.customerImg}
        />
        <View className="space-y-2 flex-col flex-1 ml-3">
          <Text className="text-[20px] font-semibold">Mixed Salad Bon...</Text>
          <View className="flex-row items-center ">
            <Text className="text-gray-500 font-semibold">3 items  </Text>
            <Text className="text-gray-500 font-semibold">|  </Text>
            <Text className="text-gray-500 font-semibold">1.5 Km</Text>
          </View>
          <Text className="text-primaryColor text-[18px] font-semibold">$ 18.00</Text>
        </View>
      </View>
    </Card>
  );
};

export default CartFoodComponent;
