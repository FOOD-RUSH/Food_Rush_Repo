import React from 'react';
import { Text, View } from 'react-native';
import { Card } from 'react-native-paper';

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
  return (
    <Card
      mode="outlined"
      style={{
        margin: 10,
        borderRadius: 10,
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
          <Text className="text-xl font-semibold ">{foodName}</Text>
          <Text className=" justify-center text-center items-center text-primaryColor">
            {foodPrice} FCFA
          </Text>
        </View>
      </View>
    </Card>
  );
};

export default RestaurantMenuCard;

// be still, be still my soul,
