import { View, Text } from 'react-native';
import React from 'react';
import { RootStackScreenProps } from '@/src/navigation/types';

const FavoriteRestaurants = ({
  navigation,
}: RootStackScreenProps<'FavoriteRestaurantScreen'>) => {
  return (
    <View className="h-full items-center">
      <Text>FavoriteRestaurants</Text>
    </View>
  );
};

export default FavoriteRestaurants;
