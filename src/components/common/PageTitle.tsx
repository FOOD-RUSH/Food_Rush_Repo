import { View, Text } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

const PageTitle = () => {
  return (
    <View className="flex-row flex-1 justify-between item-center px-2">
      <MaterialIcons name="arrow-back-ios-new" size={20} />
      <Text className="font-bold">Title</Text>
    </View>
  );
};

export default PageTitle;
