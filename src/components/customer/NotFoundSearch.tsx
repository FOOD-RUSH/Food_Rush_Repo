import { View, Text } from 'react-native';
import React from 'react';
import { images } from '@/assets/images';
import { useTheme } from '@/src/hooks/useTheme';

const NotFoundSearch = () => {
  const { theme } = useTheme();
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-text';

  return (
    <View className='flex-1 mb-4 px-2'>
        <Image source={images.not_found} className='w-full h-[70%] object-cover mb-3' />
        <Text className={`text-2xl font-semibold mb-3 ${textColor}`}>Not Found</Text>
    </View>
  )
}

export default NotFoundSearch;
