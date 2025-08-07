import { View, Text, Image } from 'react-native';
import React from 'react';
import { Card } from 'react-native-paper';
import { images } from '@/assets/images';
import { useTheme } from '@/src/hooks/useTheme';
import { CartItem } from '@/src/stores/cartStore';
import { Swipeable } from 'react-native-gesture-handler';

const CartFoodComponent = ({
  ItemtotalPrice,
  id,
  menuItem,
  quantity,
  specialInstructions,
}: CartItem) => {
  const { theme } = useTheme();
  const cardBackgroundColor = theme === 'light' ? 'white' : '#1e293b';
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-text';
  const secondaryTextColor =
    theme === 'light' ? 'text-gray-500' : 'text-text-secondary';

  return (
    
    <Card
      mode="outlined"
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
        elevation: 3,
      }}
    >
      <View className="flex-row flex items-center p-3">
        <Image
          height={100}
          width={100}
          className="h-[100px] w-[100px] rounded-2xl overflow-hidden"
          source={menuItem.image}
          defaultSource={images.customerImg}
        />
        <View className="space-y-2 flex-col flex-1 ml-4">
          <Text className={`text-lg font-semibold ${textColor}`}>
            {menuItem.name}
          </Text>
          <View className="flex-row items-center">
            <Text className={`font-semibold text-sm ${secondaryTextColor}`}>
              {quantity} items
            </Text>
            <Text
              className={`font-semibold mx-2 text-sm ${secondaryTextColor}`}
            >
              |
            </Text>
            <Text className={`font-semibold text-sm ${secondaryTextColor}`}>
              1.5 Km
            </Text>
          </View>
          <Text className="text-primary text-base font-semibold">
            {' '}
            {ItemtotalPrice}FCFA
          </Text>
        </View>
        8
      </View>
    </Card>
  );
};

export default CartFoodComponent;
