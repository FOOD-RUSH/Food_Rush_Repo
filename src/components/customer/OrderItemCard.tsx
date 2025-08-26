import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { useTheme, Card } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

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
  const { colors } = useTheme();
  const { t } = useTranslation('translation');

  return (
    <Card
      style={{
        margin: 10,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: colors.surface,
        marginVertical: 12,
        borderColor: colors.surface,
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
            <Text
              className={`text-lg font-bold mb-1 `}
              style={{ color: colors.onSurface }}
            >
              {foodName}
            </Text>
            <View className="flex-row items-center mb-2">
              <Text
                className={`text-base mr-2 font-medium `}
                style={{ color: colors.onSurface }}
              >
                {quantity}
                {t('items')}
              </Text>
              <Text
                className={`text-base mr-2 font-medium `}
                style={{ color: colors.onSurface }}
              >
                {t('pipe_separator')}
              </Text>
              <Text
                className={`text-base font-medium `}
                style={{ color: colors.onSurface }}
              >
                {distance}
              </Text>
            </View>

            {/* Price and Status */}
            <View className="flex-row items-center justify-between">
              <Text
                className="text-lg font-bold"
                style={{ color: colors.primary }}
              >
                {foodPrice} F
              </Text>
              <View
                className={`px-3 py-1 rounded-full ${
                  orderStatus === 'active' ? 'bg-green-100' : 'bg-blue-200'
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    orderStatus === 'active' ? colors.primary : colors.onPrimary
                  }`}
                >
                  {orderStatus === 'active' ? t('paid') : t('completed')}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      {/* DIVIDER */}
      <View className={`h-[1px] mb-3 mx-2 bg-gray-400`} />
      {/* Action Buttons */}
      <View className="px-4 pb-4">
        <View className="flex-row justify-between space-x-3">
          {orderStatus === 'active' ? (
            <>
              <TouchableOpacity
                className="flex-1 border rounded-full py-2 mr-2"
                style={{ borderColor: colors.primary }}
                onPress={() => {
                  // Handle cancel order logic here
                }}
              >
                <Text
                  className="font-medium text-center text-lg"
                  style={{ color: colors.primary }}
                >
                  {t('cancel_order')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 rounded-full py-2 ml-2"
                style={{ backgroundColor: colors.primary }}
                onPress={() => {
                  // Handle track driver logic here
                }}
              >
                <Text className="text-white font-medium text-center text-lg">
                  {t('track_driver')}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                className="flex-1 border rounded-full py-2 mr-2"
                style={{ borderColor: colors.primary }}
                onPress={() => {
                  // Handle leave review logic here
                }}
              >
                <Text
                  className="font-medium text-center text-lg"
                  style={{ color: colors.primary }}
                >
                  {t('leave_a_review')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 rounded-full py-2 ml-2"
                style={{ backgroundColor: colors.primary }}
                onPress={() => {
                  // Handle order again logic here
                }}
              >
                <Text className="text-white font-medium text-center text-lg">
                  {t('order_again')}
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
