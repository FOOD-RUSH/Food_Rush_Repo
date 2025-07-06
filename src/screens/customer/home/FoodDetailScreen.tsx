import React from 'react';
import CommonView from '@/src/components/common/CommonView';
import { Pressable, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { FoodProps } from '@/src/types';
import { Text } from 'react-native-paper';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const FoodDetailScreen = ({
  id,
  restaurantID,
  name,
  price,
  distance,
  ratings,
  addedOn,
  image,
}: FoodProps) => {
  return (
    <CommonView>
      <ScrollView className="px-2">
        {/* Image controller */}
        <View className="flex-row justify-between">
          <Text variant="displayMedium">{name}</Text>
          <Pressable onPress={() => {}}>
            <Ionicons name="push" />
          </Pressable>
        </View>
        <View className="flex-row justify-between">
          <Ionicons name="location" color="#007aff" />
          <View className="flex-col">
            <Text className="font-semibold">{distance?.toFixed(2)} KM</Text>
            <View className="flex-row justify-center items-center">
              <Text className="text-gray-400">Delivery Now</Text>
              <Text>|</Text> <MaterialIcons name="fire-truck" color="#007aff" />
              <Text>{price.toFixed(2)} F</Text>
            </View>
          </View>
        </View>
        {/* Horizontal flat list */}

        {/* Menu from restaurant related to what you choosed */}
      </ScrollView>
    </CommonView>
  );
};

export default FoodDetailScreen;
