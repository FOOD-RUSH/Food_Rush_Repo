import { View } from 'react-native';
import React from 'react';

const Seperator = (backgroundColor: string) => {
  return <View className={`h-[1px] bg-${backgroundColor}`} />;
};

export default Seperator;
