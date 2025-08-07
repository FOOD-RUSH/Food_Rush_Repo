import { View } from 'react-native';
import React from 'react';
import { useTheme } from '@/src/hooks/useTheme';

const Seperator = () => {
  const { theme } = useTheme();
  const backgroundColor = theme === 'light' ? 'bg-gray-200' : 'bg-gray-700';

  return <View className={`h-[1px] my-3 ${backgroundColor}`} />;
};

export default Seperator;
