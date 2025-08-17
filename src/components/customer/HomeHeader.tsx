import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Avatar, useTheme } from 'react-native-paper';
import { icons } from '@/assets/images';
import { Ionicons } from '@expo/vector-icons';
import { CustomerHomeStackScreenProps } from '@/src/navigation/types';
import { useNavigation } from '@react-navigation/native';

const HomeHeader = () => {
  const navigation =
    useNavigation<CustomerHomeStackScreenProps<'HomeScreen'>['navigation']>();
  const { colors } = useTheme();

  return (
    <View
      className="flex-row justify-between items-center px-4 py-3"
      style={{ backgroundColor: colors.background }}
    >
      <View className="flex-row items-center flex-1">
        <Avatar.Image
          source={icons.appleIcon}
          size={70}
          style={{ backgroundColor: colors.surfaceVariant }}
        />
        <View className="ml-3 flex-1">
          <Text className={`text-sm mb-1 `} style={{ color: colors.onSurface }}>
            Deliver to
          </Text>
          <View className="flex-row items-center">
            <Text
              className={`text-lg font-bold `}
              style={{ color: colors.onSurface }}
            >
              Byiem Assi
            </Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color={colors.onSurface}
              className="ml-1"
            />
          </View>
        </View>
      </View>
      <View className="flex-row items-center flex-[0.4] justify-between ">
        <TouchableOpacity
          className="border border-gray-300 rounded-full active:bg-gray-200 p-2"
          onPress={() => {
            navigation.navigate('Notifications');
          }}
          activeOpacity={0.7}
        >
          <Ionicons
            name="notifications-outline"
            color={colors.onSurface}
            size={25}
          />
        </TouchableOpacity>
        <TouchableOpacity
          className="ml-2 border border-solid border-gray-300 rounded-full p-2 active:bg-gray-200 relative"
          onPress={() => {
            navigation.navigate('Cart');
          }}
          activeOpacity={0.7}
        >
          {/* indicator for cart items */}
          <View className=" rounded-2xl bg-red-900 absolute bottom-[-4px] right-0 h-6 w-6 items-center">
            <Text className="text-white text-sm text-center font-bold ">1</Text>
          </View>
          <Ionicons name="bag-outline" color={colors.onSurface} size={25} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeHeader;
