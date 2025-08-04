import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';

export interface OrderItemCardProps {
  foodId: string;
  restaurantId: string;
  foodName: string;
  image: any;
  foodPrice: string;
  quantity: number;
  orderStatus: 'active' | 'completed';
  distance?: string;
}

const OrderItemCard = ({
  foodId,
  restaurantId,
  foodName,
  foodPrice,
  image,
  orderStatus,
  quantity,
  distance = '2.4 km',
}: OrderItemCardProps) => {
  return (
    <View
      className="bg-white rounded-2xl mx-4 mb-4 shadow-sm"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      {/* Main Content */}
      <View className="p-4">
        <View className="flex-row items-center">
          {/* Food Image */}
          <View className="mr-4">
            <Image
              source={image}
              className="w-25 h-25 rounded-xl "
              style={{ width: 100, height: 100 }}
            />
          </View>

          {/* Food Details */}
          <View className="flex-1">
            <Text className="text-[20px] font-bold text-gray-900 mb-1" numberOfLines={1}>
              {foodName}
            </Text>
            <View className="flex-row items-center mb-2">
              <Text className="text-gray-600 text-lg mr-2 font-medium">
                {quantity} items
              </Text>
              <Text className="text-gray-400 text-lg mr-2 font-medium">|</Text>
              <Text className="text-gray-600 text-lg font-medium">{distance}</Text>
            </View>

            {/* Price and Status */}
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-bold text-primaryColor">
                {foodPrice} F
              </Text>
              <View
                className={`px-3 py-1 rounded-full ${
                  orderStatus === 'active' ? 'bg-blue-100' : 'bg-primaryColor rounded-full'
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    orderStatus === 'active'
                      ? 'text-blue-600'
                      : 'text-white'
                  }`}
                >
                  {orderStatus === 'active' ? 'Paid' : 'Completed'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      {/* DIVIDER */}
      <View className="bg-gray-300 h-[1px] mb-3 mx-2" /> 
      {/* Action Buttons */}
      <View className="px-4 pb-4">
        <View className="flex-row justify-between space-x-3">
          {orderStatus === 'active' ? (
            <>
              <TouchableOpacity
                className="flex-1 border border-blue-500 rounded-full py-3 mr-2"
                onPress={() => {
                  // Handle cancel order logic here
                }}
              >
                <Text className="text-blue-500 font-medium text-center text-lg">
                  Cancel Order
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-blue-500 rounded-full py-3 ml-2"
                onPress={() => {
                  // Handle track driver logic here
                }}
              >
                <Text className="text-white font-medium text-center text-lg">
                  Track Driver
                </Text>
              </TouchableOpacity>
            </>
          ) : ( 
            <>
              <TouchableOpacity
                className="flex-1 border border-blue-500 rounded-full py-3 mr-2"
                onPress={() => {
                  // Handle leave review logic here
                }}
              >
                <Text className="text-blue-500 font-medium text-center text-lg">
                  Leave a review
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-blue-500 rounded-full py-3 ml-2"
                onPress={() => {
                  // Handle order again logic here
                }}
              >
                <Text className="text-white font-medium text-center text-lg">
                  Order Again
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default OrderItemCard;
