import { View, Text, TouchableHighlight, Image } from 'react-native';
import React from 'react';

const CategoryItem = ({
  onPress,
  title,
  image,
}: {
  onPress: () => string;
  title: string;
  image: any;
}) => {
  return (
    <TouchableHighlight onPress={onPress}>
      <View className="h-6 w-6 rounded-lg p-2 justify-center items-center">
        {/* Replace with actual icons */}
        <Image source={image} height={20} width={20} resizeMode="contain" />
        <Text className="text-[14px] font-semibold">{title}</Text>
      </View>
    </TouchableHighlight>
  );
};

export default CategoryItem;
