import { View } from 'react-native';
import React from 'react';
import { ActivityIndicator, useTheme } from 'react-native-paper';

const LoadingScreen = () => {
  const { colors } = useTheme();
  const indicatorColor = colors.primary;

  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color={indicatorColor} animating={true} />
    </View>
  );
};

export default LoadingScreen;
