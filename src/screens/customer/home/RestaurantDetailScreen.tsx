import React from 'react';
import { Pressable, ScrollView } from 'react-native-gesture-handler';
import { FoodProps } from '@/src/types';
import { Text, View, StatusBar, Dimensions, Image } from 'react-native';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');
const RestaurantDetailScreen = ({
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
    <ScrollView className="h-full flex p-0 m-0 bg-white">
      <StatusBar translucent backgroundColor="transparent" />
      <View className="relative">
        <Image
          source={image}
          width={screenWidth}
          height={(screenHeight * 3) / 5}
          resizeMode="contain"
          className="pb-3 relative"
        />
        <View className="flex-row absolute top-5 bg-transparent justify-between flex-1  ">
          <MaterialIcons name="arrow-left" size={20} color={'white'} />
          <View className="flex-1 justify-end">
            <MaterialIcons
              name="monitor-heart"
              size={20}
              color={'white'}
              className="pr-3"
            />
            <MaterialIcons name="telegram" size={20} color={'white'} />
          </View>
        </View>
      </View>

      <View className="bg-white flex h-full px-3 ">
        <View className="flex-row justify-between mb-2 py-2">
          <Text className="font-semibold text-2xl">{name} Le Famous</Text>
          <Pressable onPress={() => {}}>
            <MaterialIcons name="arrow-forward-ios" />
          </Pressable>
        </View>
        <View className="bg-gray-300 h-[1px] mb-2" />

        <View className="flex-row justify-between mb-2 py-2">
          <View className="flex-row">
            <Ionicons name="star" color={'yellow'} size={20} />
            <Text className="font-semibold text-[15px]">{ratings}</Text>
            <Text className="font-light text-gray-500">(4.8k reviews)</Text>
          </View>
          <MaterialIcons name="arrow-forward-ios" />
        </View>

        <View className="bg-gray-300 h-[1px] mb-2" />

        <View className="flex-row justify-between mb-2 py-2">
          <Ionicons name="location-outline" color={'#007aff'} />
          <View className="flex-col">
            <Text className="font-semibold text-[15px]">{distance}</Text>
            <View className="flex-col justify-between">
              <Text className="text-gray-500 text-[13px]">Delivery Now</Text>
              <Text className="text-gray-500 text-[13px]"> | </Text>
              <Ionicons name="car" size={20} />
              <Text className="text-gray-500 text-[13px]">{price}</Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" />
          </View>
        </View>

        <View className="bg-gray-300 h-[1px] mb-2" />

        <View className="flex-row justify-between mb-2 py-2">
          <MaterialIcons name="cloud-circle" color={'#007aff'} />
          <Text className="font-semibold text-[15px]">
            Offers are Available
          </Text>
          <MaterialIcons name="arrow-forward-ios" size={20} />
        </View>

        <View className="bg-gray-300 h-[1px] mb-2" />

        <Text className="text-[20px] pl-3 font-bold">For You</Text>

        {/* Horizontal scrollView with animation */}

        <Text className="text-[20px] pl-3 font-bold">Menu</Text>
        {/* Menu Items from Same Restaurant */}
        
      </View>
    </ScrollView>
  );
};

export default RestaurantDetailScreen;
