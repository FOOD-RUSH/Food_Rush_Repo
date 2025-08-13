import { View } from 'react-native';
import React from 'react';
import { useTheme } from 'react-native-paper';

const Seperator = () => {
  const { colors } = useTheme();
  const backgroundColor = 'gray-400';

  return <View className={`h-[1px] my-3 bg-[${backgroundColor}]`} />;
};

export default Seperator;
