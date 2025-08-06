import { View, Text, Image, TouchableOpacity, Pressable } from 'react-native';
import React from 'react';
import { AntDesign, EvilIcons, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { lightTheme } from '@/src/config/theme';
import { images } from '@/assets/images';
import { Card } from 'react-native-paper';

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
    <Card mode="contained">
      <View className="flex-row px-2 py-2">
        <Image
          // source={{ uri: foodImage }}
          source={images.customerImg}
          className="h-[80px] w-[80px] rounded-[10px]"
        />
        <View className="flex-col justify-center items-center flex-1">
          <Text className="text-xl font-semibold text-start mb-2">{foodName}</Text>
          <Text className="text-primaryColor font-semibold text-xl">
            FCFA {foodPrice.toFixed(2)}
          </Text>
        </View>
        <View className="flex-col justify-center items-center">
          <View className="p-1 rounded-md border-solid border border-primaryColor mb-2">
            <Text className="text-[14px] font-semibold text-start text-primaryColor">
              {quantity}
               X
            </Text>
          </View>
          <TouchableOpacity className="rounded-full p-2 active:bg-gray transition">
            <AntDesign name="edit" color={lightTheme.colors.primary} size={20}/>
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

export default CheckOutItem;
