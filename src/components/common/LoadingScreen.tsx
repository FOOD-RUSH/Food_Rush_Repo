import { View } from 'react-native';
import React from 'react';
import { ActivityIndicator } from 'react-native-paper';
import { useTheme } from '@/src/hooks/useTheme';

const LoadingScreen = () => {
  const { theme } = useTheme();
  const indicatorColor = theme === 'light' ? '#0000ff' : '#3b82f6';

  return (
    <View className='flex-1 justify-center items-center'>
      <ActivityIndicator size="large" color={indicatorColor} animating={true} />
    </View>
  );
};

export default LoadingScreen;
