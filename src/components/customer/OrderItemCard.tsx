import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { Card } from 'react-native-paper';
import { useTheme } from '@/src/hooks/useTheme';

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
  const { theme } = useTheme();
  const cardBackgroundColor = theme === 'light' ? 'white' : '#1e293b';
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-text';
  const secondaryTextColor = theme === 'light' ? 'text-gray-600' : 'text-text-secondary';
  const primaryColor = theme === 'light' ? '#007aff' : '#3b82f6';
  const dividerColor = theme === 'light' ? 'bg-gray-300' : 'bg-gray-700';

  return (
    <Card
      style={{
        margin: 10,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: cardBackgroundColor,
        marginVertical: 12,
        borderColor: cardBackgroundColor,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
                  boxShadow: '1px 0px 10px rgba(0, 0, 0, 0.15)',

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
              className="w-25 h-25 rounded-xl"
              style={{ width: 100, height: 100 }}
            />
          </View>

          {/* Food Details */}
          <View className="flex-1">
            <Text className={`text-lg font-bold mb-1 ${textColor}`} numberOfLines={1}>
              {foodName}
            </Text>
            <View className="flex-row items-center mb-2">
              <Text className={`text-base mr-2 font-medium ${secondaryTextColor}`}>
                {quantity} items
              </Text>
              <Text className={`text-base mr-2 font-medium ${secondaryTextColor}`}>|</Text>
              <Text className={`text-base font-medium ${secondaryTextColor}`}>{distance}</Text>
            </View>

            {/* Price and Status */}
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-bold" style={{ color: primaryColor }}>
                {foodPrice} F
              </Text>
              <View
                className={`px-3 py-1 rounded-full ${
                  orderStatus === 'active' ? (theme === 'light' ? 'bg-blue-100' : 'bg-primary/20') : (theme === 'light' ? 'bg-primary' : 'bg-primary')
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    orderStatus === 'active'
                      ? (theme === 'light' ? 'text-blue-600' : 'text-primary')
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
      <View className={`h-[1px] mb-3 mx-2 ${dividerColor}`} /> 
      {/* Action Buttons */}
      <View className="px-4 pb-4">
        <View className="flex-row justify-between space-x-3">
          {orderStatus === 'active' ? (
            <>
              <TouchableOpacity
                className="flex-1 border rounded-full py-2 mr-2"
                style={{ borderColor: primaryColor }}
                onPress={() => {
                  // Handle cancel order logic here
                }}
              >
                <Text className="font-medium text-center text-lg" style={{ color: primaryColor }}>
                  Cancel Order
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 rounded-full py-2 ml-2"
                style={{ backgroundColor: primaryColor }}
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
                className="flex-1 border rounded-full py-2 mr-2"
                style={{ borderColor: primaryColor }}
                onPress={() => {
                  // Handle leave review logic here
                }}
              >
                <Text className="font-medium text-center text-lg" style={{ color: primaryColor }}>
                  Leave a review
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 rounded-full py-2 ml-2"
                style={{ backgroundColor: primaryColor }}
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
    </Card>
  );
};

export default OrderItemCard;
