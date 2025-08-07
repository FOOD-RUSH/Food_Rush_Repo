import { View, Text } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/src/hooks/useTheme';

const PageTitle = () => {
  const { theme } = useTheme();
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-text';
  const iconColor = theme === 'light' ? 'black' : 'white';

  return (
    <View className="flex-row flex-1 justify-between item-center px-2">
      <MaterialIcons name="arrow-back-ios-new" size={20} color={iconColor} />
      <Text className={`font-bold ${textColor}`}>Title</Text>
    </View>
  );
};

export default PageTitle;
