import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Card } from 'react-native-paper';
import { MaterialIcons, } from '@expo/vector-icons';

interface OrderItemCardProps {
  foodId: string;
  restaurantId: string;
  foodName: string;
  image: any;
  foodPrice: string;
}

const OrderItemCard = ({
  foodId,
  restaurantId,
  foodName,
  foodPrice,
  image,
}: OrderItemCardProps) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <Card
      mode="outlined"
      style={{ padding: 10, margin: 10 }}
      contentStyle={{ flexDirection: 'row' }}
    >
      <View className="flex-row justify-start">
        <Card.Cover
          source={image}
          width={50}
          height={50}
          borderRadius={15}
          role="img"
          resizeMode="contain"
          style={{ flex: 1 }}
        />
        <Card.Content>
          <View className="flex-1 flex-col">
            <View className="flex-row justify-between">
              <Text className="text-[20px]">{foodName}</Text>
              <View className="border-solid border-primaryColor rounded-md">
                <Text className="text-[12px] text-primaryColor">
                  {/* Cart Implementation */}
                  0X
                </Text>
              </View>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-[20px]">{foodPrice}</Text>
              <TouchableOpacity onPress={() => {}}>
                <MaterialIcons name="mode-edit" color="#007aff" />
              </TouchableOpacity>
            </View>
          </View>
        </Card.Content>
      </View>
    </Card>
  );
};

export default OrderItemCard;

const EditFoodModal = () => {
  return null;
};
