import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Avatar, Button } from 'react-native-paper';
import { icons } from '@/assets/images';
import { Ionicons } from '@expo/vector-icons';
import { CustomerHomeStackScreenProps } from '@/src/navigation/types';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/src/hooks/useTheme';

const HomeHeader = () => {
  const navigation =
    useNavigation<CustomerHomeStackScreenProps<'HomeScreen'>['navigation']>();
  const { theme} = useTheme();
  const backgroundColor = theme === 'light' ? 'bg-white' : 'bg-background';
  const textColor = theme === 'light' ? 'text-black' : 'text-text';
  const secondaryTextColor = theme === 'light' ? 'text-gray-500' : 'text-text-secondary';
  const iconColor = theme === 'light' ? '#000' : 'white';

  return (
    <View className={`flex-row justify-between items-center px-4 py-3 ${backgroundColor}`}>
      <View className="flex-row items-center flex-1">
        <Avatar.Image
          source={icons.appleIcon}
          size={70}
          style={{ backgroundColor: theme === 'light' ? '#f0f0f0' : '#334155' }}
        />
        <View className="ml-3 flex-1">
          <Text className={`text-sm mb-1 ${secondaryTextColor}`}>Deliver to</Text>
          <View className="flex-row items-center">
            <Text className={`text-lg font-bold ${textColor}`}>Byiem Assi</Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color={iconColor}
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
          <Ionicons name="notifications-outline" color={iconColor} size={24} />
        </TouchableOpacity>
        <TouchableOpacity
          className="ml-2 border border-solid border-gray-300 rounded-full p-2 active:bg-gray-200"
          onPress={() => {
            navigation.navigate('Cart');
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="bag-outline" color={iconColor} size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeHeader;
