import { View, Text, Image } from 'react-native';
import React from 'react';
import { images } from '@/assets/images';
import { useTheme } from 'react-native-paper';

const NotFoundSearch = () => {
  const { colors } = useTheme();
  const textColor = colors.onSurface;

  return (
    <View className="flex-1 mb-4 px-2">
      <Image
        source={images.not_found}
        className="w-full h-[70%] object-cover mb-3"
      />
      <Text className={`text-2xl font-semibold mb-3 text-[${textColor}]`}>
        Not Found
      </Text>
    </View>
  );
};

export default NotFoundSearch;
