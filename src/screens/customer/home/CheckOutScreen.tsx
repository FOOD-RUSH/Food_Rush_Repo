import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import CommonView from '@/src/components/common/CommonView';
import { ScrollView } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import { lightTheme } from '@/src/config/theme';
import { RootStackScreenProps } from '@/src/navigation/types';

const CheckOutScreen = ({navigation, route}: RootStackScreenProps<'Checkout'>) => {

  return (
    <CommonView>
      <ScrollView className="px-2 py-3 h-full flex-col space-y-2 ">
        {/* Adress Card */}
        <View className="rounded-xl px-2 py-3">
          <Text className="font-bold text-xl ">Delivery To</Text>
          <View className="h-[1px] bg-gray-500 w-full" />
          <View className="flex-row items-center justify-between">
            <MaterialIcons name="edit-location-alt" color={'#007aff'} size={27} />
            <View className="flex-col space-y-2">
              <View className="flex-row space-x-2">
                <Text className="text-xl font-semibold mr-2">Home</Text>
                <Text className="flex bg-blue-300 rounded-md px-2 py-1 text-primaryColor text-xs">
                  Default
                </Text>
              </View>
              <Text className="text-center text-gray-400 text-xl">
                Time Square NYC, Manhattan
              </Text>
            </View>
            <MaterialIcons
              name="arrow-forward-ios"
              size={25}
              color={'#007aff'}
            />
          </View>
        </View>
        {/* Order Summary */}
        <View className="rounded-xl px-2 py-3">
          <View className="flex-row justify-between space-x-2">
            <Text className="font-bold text-xl ">Order Summary</Text>
            <TouchableOpacity
              onPress={() => {}}
              activeOpacity={0.8}
              className="border-[2px] border-solid border-primaryColor rounded-full px-2 "
            >
              <Text className="text-primaryColor font-semibold text-[8px]">
                Add Items
              </Text>
            </TouchableOpacity>
          </View>
          <View className="h-[1px] bg-gray-400 w-full" />
          {/*Flatlist with component*/}

          {/* payement section */}

          <View className="px-2 py-3 rounded-xl flex-col space-y-2">
            <View className="flex-row justify-between space-x-2">
              <MaterialIcons name="credit-card" color={'#007aff'} size={20} />
              <View className="flex-row space-x-1">
                <Text className="text-primaryColor text-base">E-Wallet</Text>
                <MaterialIcons
                  name="arrow-forward-ios"
                  size={20}
                  color={lightTheme.colors.primary}
                />
              </View>
            </View>
            <View className="h-[1px] bg-gray-400" />

            <View className="flex-row justify-between space-x-2">
              <MaterialIcons name="discount" color={'#007aff'} size={20} />
              <View className="flex-row space-x-1">
                <Text className="text-primaryColor text-base">E-Wallet</Text>
                <MaterialIcons
                  name="arrow-forward-ios"
                  size={20}
                  color={lightTheme.colors.primary}
                />
              </View>
            </View>
          </View>

          <View className="flex-col px-2 py-3 rounded-xl space-Y-3 shadow-sm">
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-900 ">SubTotal: </Text>
              <Text className="font-bold ">500 XAF </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-900 ">Delivery Fee: </Text>
              <Text className="font-bold "> 2300 XAF</Text>
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-primaryColor ">Discount: </Text>
              <Text className="font-bold text-primaryColor "> 2300 XAF</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </CommonView>
  );
};

export default CheckOutScreen;
