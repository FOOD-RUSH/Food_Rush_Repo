import { View, Text } from 'react-native';
import React from 'react';
import { useTheme } from '@/src/hooks/useTheme';

const NotificationScreen = () => {
  const { theme } = useTheme();
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-text';

  return (
    <View className="justify-center items-center flex-1">
      <Text className={`justify-items-center ${textColor}`}>NotificationScreen</Text>
    </View>
  );
};

export default NotificationScreen;
