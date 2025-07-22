import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import { Image } from 'react-native-paper/lib/typescript/components/Avatar/Avatar';
import { images } from '@/assets/images';
// const {height: screenHeight, width: screenWidth} = Dimensions.get('window');


const NotFoundSearch = () => {
  return (
    <View className='flex-1 mb-4 px-2' >
        <Image source={images.not_found} className='w-full h-[70%] object-cover mb-3' />
        <Text className='text-2xl font-semibold mb-3'>Not Found</Text>
        
    </View>
  )
}

export default NotFoundSearch