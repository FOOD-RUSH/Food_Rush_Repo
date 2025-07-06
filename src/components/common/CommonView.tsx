import { View, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const CommonView = ({ children }: any) => {
  return <SafeAreaView className="px-2 py-1 flex-1">{children}</SafeAreaView>;
};

export default CommonView;
