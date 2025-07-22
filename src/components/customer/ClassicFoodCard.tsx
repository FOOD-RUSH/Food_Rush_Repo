import { TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Card, Text } from 'react-native-paper';
import { images } from '@/assets/images';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const ClassicFoodCard = () => {
  return (
    <Card
      mode="outlined"
      onPress={() => {}}
      className="shadow-sm p-2 border border-gray-200 overflow-hidden "
    >
      <View className="px-2 py-3">
        <View className="relative justify-center item-center">
          <Card.Cover
            src={images.onboarding2}
            height={150}
            width={150}
            className="h-[150px] w-[150px] rounded-full"
          />
          <TouchableOpacity className="absolute top-4 right-8 bg-white">
            <Ionicons
              name="heart-circle-outline"
              color={'pink'}
              selectionColor={'#ce3b54'}
              size={20}
            />
          </TouchableOpacity>
        </View>
        <View className="flex-col item-center">
          <Text variant="headlineLarge" className="mb-2">
            Egg and Pasta
          </Text>
          <Text variant="headlineMedium" className="mb-2 text-gray-500">
            Reste Chez Dialo
          </Text>
        </View>

        <View className="flex-row justify-between">
          <View className="flex-row">
            <Ionicons name="star" size={18} color={'#ffbb00'} />
            <Text>190m</Text>
          </View>
          <View className="flex-row">
            <Ionicons name="map" size={18} color={'#007aff'} />
            <Text>190m</Text>
          </View>
        </View>
        <View className="flex-row justify-between m-2">
          <Text className="text-primaryColor">500 FCFA</Text>
          <View className="flex-row">
            <MaterialIcons name="bike-scooter" color={'#007aff'} size={20} />
            <Text className="text-gray-400 text-[12px]">500.0F</Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

export default ClassicFoodCard;
