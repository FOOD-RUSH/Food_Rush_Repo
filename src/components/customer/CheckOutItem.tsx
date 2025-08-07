import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { images } from '@/assets/images';
import { Card } from 'react-native-paper';
import { useTheme } from '@/src/hooks/useTheme';

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
  const { theme } = useTheme();
  const cardBackgroundColor = theme === 'light' ? 'white' : '#1e293b';
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-text';
  const primaryColor = theme === 'light' ? '#007aff' : '#3b82f6';

  return (
    <Card mode="contained" style={{ backgroundColor: cardBackgroundColor }}>
      <View className="flex-row px-2 py-2">
        <Image
          source={images.customerImg}
          className="h-[80px] w-[80px] rounded-[10px]"
        />
        <View className="flex-col justify-center items-center flex-1">
          <Text className={`text-xl font-semibold text-start mb-2 ${textColor}`}>{foodName}</Text>
          <Text className="font-semibold text-xl" style={{ color: primaryColor }}>
            FCFA {foodPrice.toFixed(2)}
          </Text>
        </View>
        <View className="flex-col justify-center items-center">
          <View className="p-1 rounded-md border-solid border mb-2" style={{ borderColor: primaryColor }}>
            <Text className="text-[14px] font-semibold text-start" style={{ color: primaryColor }}>
              {quantity}
               X
            </Text>
          </View>
          <TouchableOpacity className="rounded-full p-2 active:bg-gray transition">
            <AntDesign name="edit" color={primaryColor} size={20}/>
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

export default CheckOutItem;
