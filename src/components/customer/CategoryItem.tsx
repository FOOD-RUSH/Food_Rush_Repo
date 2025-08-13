import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { CustomerHomeStackScreenProps } from '@/src/navigation/types';
import { useTheme } from 'react-native-paper';

const CategoryItem = ({ title, image }: { title: string; image: any }) => {
  const navigation =
    useNavigation<CustomerHomeStackScreenProps<'HomeScreen'>['navigation']>();
  const { colors } = useTheme();
  const textColor = colors.onSurface;

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('SearchScreen', {
          type: 'category',
          category: title,
          categoryId: title,
        });
        console.log('Category pressed: ' + title);
      }}
    >
      <View className="rounded-lg m-2 justify-center items-center flex-col p-2 active:bg-slate-300">
        {/* Replace with actual icons */}
        <Image source={image} className="h-[49px] w-[49px]" />
        <Text
          className={`text-[14px] font-semibold text-center text-[${textColor}]`}
          style={{ color: colors.onSurface }}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CategoryItem;
