import React from 'react';
import { Text, View } from 'react-native';
import { Card } from 'react-native-paper';
import { useTheme } from '@/src/hooks/useTheme';

const RestaurantMenuCard = ({
  image,
  foodPrice,
  foodName,
  foodCategory,
}: {
  image: any;
  foodName: any;
  foodPrice: number;
  foodCategory: string;
}) => {
  const { theme } = useTheme();
  const cardBackgroundColor = theme === 'light' ? 'white' : '#1e293b';
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-text';
  const primaryColor = theme === 'light' ? '#007aff' : '#3b82f6';

  return (
    <Card
      mode="outlined"
      style={{
        margin: 10,
        borderRadius: 10,
        backgroundColor: cardBackgroundColor,
        boxShadow: '1px 0px 10px rgba(0, 0, 0, 0.15)',
      }}
    >
      <View className="flex-row items-center">
        <Card.Cover
          source={image}
          style={{
            height: 100,
            width: 100,
            borderRadius: 10,
            overflow: 'hidden',
            objectFit: 'cover',
          }}
        />
        {/* Price */}
        <View className="flex-col justify-center flex-1 ml-2">
          <Text className={`text-xl font-semibold ${textColor}`}>
            {foodName}
          </Text>
          <Text
            className="justify-center text-center items-center"
            style={{ color: primaryColor }}
          >
            {foodPrice} FCFA
          </Text>
        </View>
      </View>
    </Card>
  );
};

export default RestaurantMenuCard;
