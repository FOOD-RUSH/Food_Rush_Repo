import { View, Text, TouchableHighlight } from 'react-native';
import React from 'react';
import { Card, Divider } from 'react-native-paper';

interface OrderItemCardProps {
  foodId: string;
  restaurantId: string;
  foodName: string;
  image: any;
  foodPrice: string;
  quantity: number;
  orderStatus: 'pending' | 'delivered' | 'on the way';
}

const OrderItemCard = ({
  foodId,
  restaurantId,
  foodName,
  foodPrice,
  image,
  orderStatus,
  quantity,
}: OrderItemCardProps) => {
  return (
    <Card
      mode="outlined"
      style={{ padding: 10, margin: 10 }}
      contentStyle={{ flexDirection: 'row' }}
      id={foodId}
    >
      <View className="flex-row item-center p-4">
        <Card.Cover source={image} height={100} width={100} borderRadius={10} />
        <View className="flex-column flex-1 ml-2 justify-between items-start">
          <Text className="text-xl font-bold text-center">{foodName}</Text>
          <View className="flex-row my-2">
            <Text className="text-gray-700 mr-2">{quantity}Items</Text>
            <Text className="text-gray-700 mr-2">|</Text>
            <Text className="text-gray-700 mr-2">2.7 km</Text>
          </View>
          {/* price + state of card */}
          <View className="flex-row justify-between ">
            <Text className="text-xl">{foodPrice} F</Text>
            <TouchableHighlight style={{ backgroundColor: '#007aff' }}>
              <Text className="text-white">{orderStatus}</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
      <Divider style={{ outlineColor: 'grey' }} />
      <View className="flex-row my-2 justify-between">
        <TouchableHighlight className="border-primaryColor border-2 p-2 rounded-xl">
          <Text className="">Leave a review</Text>
        </TouchableHighlight>
        <TouchableHighlight className="bg-primaryColor p-2 rounded-xl">
          <Text className="text-[18px]">Order Again</Text>
        </TouchableHighlight>
      </View>
    </Card>
  );
};

export default OrderItemCard;
