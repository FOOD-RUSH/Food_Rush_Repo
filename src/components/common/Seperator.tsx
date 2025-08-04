import { View } from 'react-native';
import React from 'react';

const Seperator = ({ backgroundColor }: { backgroundColor: string }) => {
  return <View className={`h-[1px] my-3 ${backgroundColor}`} ></View>;
};

export default Seperator;
