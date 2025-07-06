import React from 'react';
import { Text, View } from 'react-native';
import { Card } from 'react-native-paper';

const RestaurantMenuCard = ({
  image,
  foodPrice,
  foodName,
}: {
  image: any;
  foodName: any;
  foodPrice: number;
}) => {
  return (
    <Card
      mode="outlined"
      style={{
        padding: 10,
        margin: 10,
        borderRadius: 10,
      }}
    >
      <View className="flex-row items-center">
        <Card.Cover
          source={image}
          style={{
            position: 'relative',
            left: 3,
            height: 100,
            width: 100,
            borderRadius: 10,
            overflow: 'hidden',
          }}
        />
        {/* Price */}
        <View className="flex-col justify-center ">
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
