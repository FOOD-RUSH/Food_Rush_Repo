import { View, Text, Image, Pressable } from 'react-native';
import React from 'react';

const CategoryItem = ({
  onPress,
  title,
  image,
}: {
  onPress: () => void;
  title: string;
  image: any;
}) => {
  return (
    <Pressable onPress={onPress} >
      <View className="rounded-lg m-2 justify-center items-center flex-col p-2 active:bg-slate-300 ">
        {/* Replace with actual icons */}
        <Image source={image} className="h-[49px] w-[49px]" />
        <Text className="text-[14px] font-semibold text-center">{title}</Text>
      </View>
    </Pressable>
  );
};

export default CategoryItem;
