import { View } from 'react-native';
import React from 'react';

const Seperator = (backgroundColor: string) => {
  return <View className={`h-[1px] bg-${backgroundColor} my-3`} />;
};

export default Seperator;
