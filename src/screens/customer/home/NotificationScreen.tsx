import { View, Text } from 'react-native';
import React from 'react';
import { useAppStore } from '@/src/stores/AppStore';

const NotificationScreen = () => {
  const  theme  = useAppStore((state) => state.theme);
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-text';

  return (
    <View className="justify-center items-center flex-1">
      <Text className={`justify-items-center ${textColor}`}>
        NotificationScreen
      </Text>
    </View>
  );
};

export default NotificationScreen;
