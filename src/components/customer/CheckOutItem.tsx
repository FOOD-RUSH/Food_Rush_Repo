import { View, Text, Image, TouchableOpacity, Pressable } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { lightTheme } from '@/src/config/theme';
import { images } from '@/assets/images';

// foodID needed + name + price + quantity + restaurantID
//
//

interface CheckOutItemProps {
  foodId: string;
  restaurantID: string;
  foodName: string;
  foodPrice: number;
  quantity: number;
  foodImage: any;
}
const CheckOutItem = ({
  foodId,
  foodName,
  foodPrice,
  quantity,
  restaurantID,
  foodImage,
}: CheckOutItemProps) => {
  return (
    <View className="flex-row px-2 py-2 space-x-2">
      <Image
        // source={{ uri: foodImage }}
        source={images.customerImg}
        height={100}
        width={100}
        className="h-25 w-25 object-contain "
      />
      <View className="flex-col justify-center items-center space-y-2 flex-1">
        <Text className="text-xl font-semibold text-start ">{foodName}</Text>
        <Text className="text-primaryColor font-semibold text-xl">
          FCFA {foodPrice.toFixed(2)}
        </Text>
      </View>
      <View className="flex-col justify-center items-center space-y-2">
        <View className="p-2 rounded-md border-solid border border-primaryColor">
          <Text className="text-xl font-semibold text-start">
            {quantity}
            <MaterialIcons name="cancel" size={12} color={'#007aff'} />
          </Text>
        </View>
        <Pressable className="rounded-full p-2 active:bg-gray transition">
          <MaterialIcons name="edit" color={lightTheme.colors.primary} />
        </Pressable>
      </View>
    </View>
  );
};

export default CheckOutItem;
