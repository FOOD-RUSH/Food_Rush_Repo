import { View, StatusBar, Image, Dimensions, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Text, TouchableRipple } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

const FoodDetailsScreen = () => {
  const route = useRoute();
  const { restaurantID, foodID } = route.params;
  // const [foodDetails, setFoodDetails] = useState(null);

  useEffect(() => {
    console.log('this is the restaurant-id: ' + restaurantID);
    // fetching all the data of food details screen
    // setting the data to the variable
  }, [restaurantID]);

  return (
    <>
      <StatusBar backgroundColor="transparent" translucent />
      <ScrollView>
        <View className="relative">
          <Image
            height={screenHeight * 0.6}
            width={screenWidth}
            className="relative"
          />
          <View className="bg-transparent flex-row justify-between px-3 absolute top-12 right-2">
            <Pressable className="bg-transparent" onPress={() => {}}>
              <Ionicons name="arrow-back" color={'white'} />
            </Pressable>
            <Pressable className="bg-transparent" onPress={() => {}}>
              <Ionicons name="paper-plane-outline" color={'white'} />
            </Pressable>
          </View>
        </View>
        {/*  */}
        <View className=" flex-col items-center">
          <Text variant="titleLarge">Mixed Vegetable Salad</Text>
          <Text>
            this crgrp fgfpg lores posim antf gofg pgf ddps fgpf fgp,fg;vgjasov
            fgpmgf nkg;snsnn mfgfk ggfgpfgfgnfgmmfg kfgf gokfgjf
          </Text>

          <TouchableRipple
            onPress={() => {}}
            className="bg-primaryColor rounded-xl px-2 py-3 flex items-center"
          >
            <Text>Add to Basket - 5500 FCFA</Text>
          </TouchableRipple>
        </View>
      </ScrollView>
    </>
  );
};

export default FoodDetailsScreen;
