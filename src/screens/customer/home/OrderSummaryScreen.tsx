import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import CommonView from '@/src/components/common/CommonView';
import { ScrollView } from 'react-native-gesture-handler';
import { Divider } from 'react-native-paper';
import { icons, images } from '@/assets/images';
import { MaterialIcons } from '@expo/vector-icons';

const OrderSummaryScreen = () => {
  return (
    <CommonView>
      <ScrollView className="h-full bg-white">
        {/* location card */}
        <View className="flex px-2 py-3 mb-2 rounded-xl shadow-sm">
          <Text className="text-[18px] font-semibold">Deliver To</Text>
          <View className="h-[1px] bg-gray-200 mx-2 my-3" />
          <View className="flex-row items-center">
            <Image
              source={icons.filter}
              className="h-8 w-8 object-cover bg-primaryColor"
            />
            <View className="flex-row justify-between items-center flex-1 px-2">
              <View className="flex-col">
                <View className="flex-row">
                  <Text className="text-[15px]">Home</Text>
                  <View className="bg-blue-200 rounded-lg px-2">
                    <Text className="text-[12px] text-primaryColor">
                      Default
                    </Text>
                  </View>
                </View>
                <Text className="text-gray-800 text-[15px]">
                  Times Square NYC Manhattan
                </Text>
              </View>
              <MaterialIcons name="arrow-forward-ios" size={27} />
            </View>
          </View>
        </View>
        <View className="flex px-2 py-3 mb-2 rounded-xl shadow-sm">
          <View className="flex-row justify-between items-center">
            <Text className="font-bold text-xl">Order Summary</Text>
            <TouchableOpacity className="border border-primaryColor rounded-full">
              <Text className="font-bold text-primaryColor text-[16px]">
                Add Items
              </Text>
              <View className="h-[1px] bg-gray-200 mx-2 my-3" />
              {/* flat list to go through all your orders  */}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </CommonView>
  );
};

export default OrderSummaryScreen;






